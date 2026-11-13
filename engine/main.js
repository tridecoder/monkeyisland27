// Boot: loads content/index.js, starts the game and exposes window.__game (QA / testing API).
import { Game } from './core.js';
import * as UI from './ui.js';
import * as HS from './hotspots.js';

const params = new URLSearchParams(location.search);
const debug = params.get('debug') === '1';

async function boot() {
  const canvas = document.getElementById('screen');
  let content;
  try {
    content = (await import('../content/index.js')).default;
  } catch (e) {
    console.error('[motor] No se pudo cargar content/index.js', e);
    document.body.insertAdjacentHTML('beforeend', `<pre class="fatal">Error cargando el contenido:\n${e && e.stack || e}</pre>`);
    return;
  }
  const game = new Game(canvas, content, { debug });
  window.__game = makeTestApi(game);
  if (params.get('room')) {
    // ?room=id[&entry=x] jumps straight into a room (preview / art work)
    await game.newGame({ room: params.get('room'), entry: params.get('entry') || undefined });
  } else if (params.get('autostart') === '1') {
    game.newGame();
  }
}

function makeTestApi(game) {
  const idle = () => game.waitIdle(true);
  const api = {
    game,
    get log() { return game.log; },
    get errors() { return game.errors; },
    state() {
      game.syncState();
      const s = game.state ? JSON.parse(JSON.stringify(game.state)) : null;
      return {
        mode: game.mode,
        room: s && s.room,
        busy: game.busy > 0 || !!game.acting,
        cutscene: game.cutscene > 0,
        inventory: s ? s.inventory : [],
        flags: s ? s.flags : {},
        objects: s ? s.objects : {},
        actors: s ? s.actors : {},
        player: game.player && game.state ? { x: Math.round(game.player.x), y: Math.round(game.player.y), dir: game.player.dir } : null,
        dialog: game.choice ? game.choice.options.slice() : null,
        dialogDisabled: game.choice ? [...game.choice.disabled] : null,
        pickItem: !!game.itemPick,
        duel: game.duelInfo ? { ...game.duelInfo } : null,
        lastDuel: game.lastDuel || null,
        learnedReplies: s ? (game.content.duels.pairs || []).filter(p => s.flags[p.flag]).map(p => p.flag) : [],
        notices: game.notices.map(n => n.text),
        sentence: game.room ? game.sentenceText() : null,
        hover: game.ui.hover ? game.ui.hover.id : null,
        camX: Math.round(game.camX),
        music: game.audio.requestedId ?? game.audio.currentId ?? null,
        menu: game.menu ? game.menu.page : null,
        speaking: game.speeches.map(s => ({ who: s.actor, text: s.text })),
        phone: game.phone ? { caller: game.phone.caller, label: game.phone.label, state: game.phone.state, side: game.phone.side } : null,   // llamada en curso (api.phone)
        detalle: game.detalle ? { titulo: game.detalle.titulo } : null,   // plano detalle abierto (api.detalle)
        hotspotsShown: !!game.hsShow,       // «ver hotspots» en pantalla
        poses: Object.fromEntries(Object.values(game.actors).filter(a => game.room && a.room === game.room.def.id).map(a => [a.id, game.poseOf(a)]).filter(([, p]) => p)),
        aviso: !!game.avisoActive,          // true mientras suena una llamada / un RV: / un aviso común (game.js `avisos`)
        // última partida terminada con api.ending() (el juego ya está en el título): sus flags, inventario, sala y objetos
        finished: game.finished ? { room: game.finished.room, flags: game.finished.flags, inventory: game.finished.inventory, objects: game.finished.objects, actors: game.finished.actors } : null,
      };
    },
    newGame: async () => { await game.newGame(); return idle(); },
    gotoRoom: async (id, entry) => {
      if (game.mode !== 'play') await game.newGame();
      await game.runScript(api2 => api2.goto(id, entry), { label: 'gotoRoom' });
      return idle();
    },
    doVerb: async (verb, objId, itemId) => {
      const t = game.resolveTarget(objId);
      if (!t) { game.error(`doVerb: objetivo desconocido o no presente: ${objId}`); return false; }
      if (itemId && !game.content.items[itemId]) { game.error('doVerb: item desconocido ' + itemId); return false; }
      if (game.busy) await game.waitIdle(false);
      const p = game.execute(verb, t, itemId || null);
      await Promise.race([p, idle()]);
      await new Promise(r => setTimeout(r, 0));
      return idle();
    },
    waitIdle: () => idle(),
    waitChoice: () => idle(),
    currentDialogOptions: () => (game.choice ? game.choice.options.slice() : null),
    chooseDialog: async (i) => {
      if (!game.choice) { game.error('chooseDialog: no hay opciones en pantalla'); return false; }
      if (i < 0 || i >= game.choice.options.length) { game.error('chooseDialog: índice fuera de rango ' + i); return false; }
      if (game.choice.disabled.has(i)) { game.error('chooseDialog: opción deshabilitada ' + i); return false; }
      game.choice.resolve(i);
      await new Promise(r => setTimeout(r, 0));
      return idle();
    },
    /** Pick an option whose text contains `substr` (case-insensitive). Returns false if not found. */
    chooseText: async (substr) => {
      const opts = game.choice ? game.choice.options : null;
      const i = opts ? opts.findIndex(o => o.toLowerCase().includes(String(substr).toLowerCase())) : -1;
      if (i < 0) return false;
      return api.chooseDialog(i);
    },
    /** In the inventory picker of a duel finisher ([Usar objeto]): choose an item (null = back). */
    chooseItem: async (id) => {
      if (!game.itemPick) { game.error('chooseItem: no hay selector de objeto en pantalla'); return false; }
      game.itemPick.resolve(id || null);
      await new Promise(r => setTimeout(r, 0));
      return idle();
    },
    /** Debug: put every item of content/items.js in the inventory. */
    giveAll: () => { if (!game.state) return []; for (const id of Object.keys(game.content.items)) if (!game.state.inventory.includes(id)) game.state.inventory.push(id); return game.state.inventory.slice(); },
    /** Run a registered scene (rooms' `scenes`) as a blocking script. */
    scene: async (name, ...args) => { await game.runScript(a => a.scene(name, ...args), { label: 'scene ' + name }); return idle(); },
    giveItem: (id) => { if (!game.state) return; if (!game.content.items[id]) { game.error('giveItem: item desconocido ' + id); return; } if (!game.state.inventory.includes(id)) game.state.inventory.push(id); },
    takeItem: (id) => { if (!game.state) return; const i = game.state.inventory.indexOf(id); if (i >= 0) game.state.inventory.splice(i, 1); },
    setFlag: (k, v = true) => { if (game.state) { game.state.flags[k] = v; game.refreshWalkboxes(); } },
    getFlag: (k) => game.state && game.state.flags[k],
    /** Cierra el globo de texto que esté en pantalla (como un clic). Los tests lo usan para descartar avisos. */
    skipSpeech: () => game.skipSpeech(),
    skipText: (on = true) => { game.fast = !!on; if (on) game.skipSpeech(); },
    clearLog: () => { game.log.length = 0; },
    save: (slot = 1) => game.save(slot),
    load: async (slot = 1) => { await game.load(slot); return idle(); },
    skipCutscene: () => game.skipCutscene(),
    /** «Ver hotspots» como el botón del panel; devuelve la lista { id, name, box, kind } que se resalta. */
    showHotspots: (ms) => { game.showHotspots(ms); return game.room ? HS.targets(game).map(t => ({ id: t.id, name: t.name, kind: t.kind, box: t.box })) : []; },
    objects: () => {
      if (!game.room) return [];
      const cam = Math.round(game.camX);
      const objs = game.roomObjects().map(o => {
        const st = game.getObjState(o.id);
        const b = o.poly ? { x: Math.min(...o.poly.map(p => p[0])), y: Math.min(...o.poly.map(p => p[1])), w: Math.max(...o.poly.map(p => p[0])) - Math.min(...o.poly.map(p => p[0])), h: Math.max(...o.poly.map(p => p[1])) - Math.min(...o.poly.map(p => p[1])) } : { x: o.x, y: o.y, w: o.w, h: o.h };
        return { id: o.id, name: game.nameOf(o, st), kind: 'obj', visible: st.visible, state: st.state, ...b, screenX: Math.round(b.x + b.w / 2 - cam), screenY: Math.round(b.y + b.h / 2) };
      });
      const acts = Object.values(game.actors).filter(a => a.room === game.room.def.id && a.id !== game.G.player).map(a => {
        const b = game.actorBox(a);
        return { id: a.id, name: a.name, kind: 'actor', visible: a.visible, x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h), screenX: Math.round(a.x - cam), screenY: Math.round(b.y + b.h * 0.4) };
      });
      return objs.concat(acts);
    },
    /** Page (client) coordinates to click a room object/actor/inventory item/verb/dialog option. */
    screenPos: (id) => {
      const o = api.objects().find(o => o.id === id);
      if (o) { const mid = { x: Math.max(1, Math.min(318, o.screenX)), y: o.screenY }; return game.toClient(mid.x, mid.y); }
      const ip = game.state && UI.invPos(game, id);
      if (ip) return game.toClient(ip.x, ip.y);
      return null;
    },
    roomPointToClient: (x, y) => game.toClient(x - Math.round(game.camX), y),
    verbPos: (id) => { const p = UI.verbPos(game, id); return p && game.toClient(p.x, p.y); },
    invPos: (id) => { const p = UI.invPos(game, id); return p && game.toClient(p.x, p.y); },
    optionPos: (i) => { const p = UI.optionPos(game, i); return p && game.toClient(p.x, p.y); },
    virtualToClient: (x, y) => game.toClient(x, y),
  };
  return api;
}

boot();
