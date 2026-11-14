// Script API given to every handler / hook: async (api) => { ... }
// See docs/CONTENT_SCHEMA.md#script-api for the authoritative reference.

import * as Phone from './phone.js';
import * as Detalle from './detalle.js';
import { itemIconCanvas } from './ui.js';
import * as Fx from './efectos.js';
import * as Obj from './objetivos.js';

function pick(arr) { return Array.isArray(arr) ? arr[Math.floor(Math.random() * arr.length)] : arr; }

export function makeApi(game, ctx = {}) {
  const blocking = ctx.blocking !== false;
  const P = () => game.G.player;
  const actorOr = id => { const a = game.actors[id]; if (!a) game.error('Actor desconocido: ' + id); return a; };

  // an ambient script (room `ambient`) falls silent as soon as the player leaves its room
  const gone = () => !!(ctx.ambientRoom && (!game.state || game.state.room !== ctx.ambientRoom));
  // ambient lines (room `ambient`) wait for silence before each balloon and are cut by any real line (efectos.js)
  const amb = !!ctx.ambientRoom;
  const sayLines = async (who, text, opts) => {
    const lines = Array.isArray(text) ? text : [text];
    for (const l of lines) {
      if (gone()) return;
      if (amb && !(await Fx.waitQuiet(game, gone))) return;
      await game.speak(who, l, { blocking, ...(amb ? { ambient: true } : {}), ...(opts || {}) });
    }
  };

  const resolvePoint = (target, y) => {
    if (typeof target === 'number') return [target, y];
    if (Array.isArray(target)) return target;
    if (typeof target === 'string') {
      const t = game.resolveTarget(target);
      if (!t) { game.error('walkTo: destino desconocido ' + target); return null; }
      const ap = game.approachPoint(t);
      return [ap.x, ap.y, ap.face, ap.faceTo];
    }
    if (target && typeof target === 'object') return [target.x, target.y];
    return null;
  };

  const api = {
    // context
    get room() { return game.state && game.state.room; },
    get verb() { return ctx.verb; },
    get target() { return ctx.target ? ctx.target.id : undefined; },
    get obj() { return ctx.target ? ctx.target.id : undefined; },
    get item() { return ctx.item || undefined; },
    get game() { return game; },
    get player() { return P(); },
    get flags() { return game.state.flags; },
    get skipping() { return game.instant; },
    /** true inside a room's onEnter when the game is being restored from a save (not a real entry). */
    get restoring() { return !!game.restoring; },

    // speech
    say: (text, opts) => sayLines(P(), text, opts),
    sayAs: (id, text, opts) => sayLines(id, text, opts),
    narrate: (text, opts) => sayLines(null, text, { narrator: true, ...(opts || {}) }),
    /** A room object "speaks" (LCD, fax, torno LED...): text above the object, in opts.color or the object's `color`. */
    sayFrom: async (objId, text, opts = {}) => {
      if (gone()) return;
      const f = game.findObjectDef(objId);
      if (!f) { game.error('sayFrom: objeto desconocido ' + objId); return; }
      const d = f.def;
      const cx = d.poly ? d.poly.reduce((s, p) => s + p[0], 0) / d.poly.length : d.x + d.w / 2;
      const top = d.poly ? Math.min(...d.poly.map(p => p[1])) : d.y;
      const lines = Array.isArray(text) ? text : [text];
      for (const l of lines) {
        if (gone()) return;
        if (amb && !(await Fx.waitQuiet(game, gone))) return;
        await game.speak(null, l, { blocking, at: [cx, top - 2], color: opts.color || d.color || '#e8e8e8', who: d.id, ...(amb ? { ambient: true } : {}), ...opts });
      }
    },
    /** PANTALLA DE UN OBJETO (ENMIENDA E2 §2.2, §3.1, §4.4): como `sayFrom`, pero con el prefijo y el color que el juego
     *  registra para ese objeto en `game.js` → `pantallas` (p. ej. `herminia_portatil` → «HERMINIA (IA) › », #FF8C3C).
     *  Si el texto ya empieza por «›», no se duplica. opts: los de sayFrom (`prefijo` y `color` mandan sobre el registro).
     *    await api.pantalla('herminia_portatil', 'tu pieza · 31 líneas · hueco de la página 7: 23 · sobra: 26 %');
     *    → «HERMINIA (IA) › tu pieza · 31 líneas · …» */
    pantalla: async (objId, text, opts = {}) => {
      const R = ((game.G.pantallas || {})[objId]) || {};
      const pre = opts.prefijo ?? R.prefijo ?? '';
      const lines = (Array.isArray(text) ? text : [text]).map(l => {
        let t = String(l);
        if (pre && t.startsWith(pre)) return t;
        if (pre && /›\s*$/.test(pre)) t = t.replace(/^›\s*/, '');
        return pre + t;
      });
      const o = { ...opts }; delete o.prefijo;
      if (!o.color && R.color) o.color = R.color;
      return api.sayFrom(objId, lines, o);
    },
    /** MEGAFONÍA (plan §4.7): la voz de un actor por un altavoz (ascensor, edificio): globo arriba, en su color, con la
     *  etiqueta «MEGAFONÍA» encima (no cuenta en los 80 caracteres), sin que el actor esté en la sala. No bloquea salvo
     *  `{ blocking: true }`. El log lleva `tag: 'MEGAFONÍA'`. */
    megafonia: async (id, text, opts = {}) => {
      const a = actorOr(id); if (!a) return;
      const lines = Array.isArray(text) ? text : [text];
      if (opts.sfx !== false) game.audio.sfx(opts.sfx || 'beep');
      for (const l of lines) {
        if (gone()) return;
        await game.speak(null, l, { blocking: !!opts.blocking, at: [Math.round(game.camX) + 160, opts.y ?? 44], color: a.color, who: a.id, width: 260, ms: opts.ms, tag: opts.etiqueta ?? 'MEGAFONÍA' });
      }
    },
    /** TITULAR (plan §4.6): la línea sale como franja de titular de periódico. opts: { who (actor; por defecto Bruno),
     *  from (objeto que «habla», p. ej. 'pantalla_titulator'), blocking, ms }. */
    titular: async (text, opts = {}) => {
      const who = opts.from ? null : (opts.who || P());
      const lines = Array.isArray(text) ? text : [text];
      for (const l of lines) {
        if (gone()) return;
        await game.speak(who, l, { blocking: opts.blocking ?? blocking, style: 'titular', who: opts.from, ms: opts.ms, color: opts.color });
      }
    },
    sayRandom: (lines) => sayLines(P(), pick(lines)),

    // llamadas de teléfono: primer plano del móvil (engine/phone.js). Ver docs/CONTENT_SCHEMA.md «Llamadas».
    phone: {
      /** Abre una llamada: { caller (id de actor), label?, sub?, outgoing? (Bruno llama), ringMs?, side? }. */
      open: (opts) => Phone.open(game, ctx, opts),
      /** Habla quien llama, anclado al móvil (texto o lista de líneas). */
      say: async (text, opts) => { const P = game.phone; if (P) await sayLines(P.caller, text, opts); else game.error('phone.say: no hay llamada abierta'); },
      /** Cuelga: el móvil se desliza fuera. */
      close: (opts) => Phone.close(game, opts),
      /** open + fn + close garantizado (también si fn lanza). */
      call: async (opts, fn) => {
        const ok = await Phone.open(game, ctx, opts);
        try { if (ok !== false || game.instant) await fn(api); }
        finally { await Phone.close(game); }
      },
      /** MODO APLICACIÓN (sin llamada): abre o cambia la pantalla del móvil { title, rows: [{ text, sub, dot, icon, color }], body }. */
      app: (screen) => Phone.app(game, ctx, screen),
      /** Un globo anclado al móvil (p. ej. el texto de un correo), de `who` (id de actor o null). */
      read: async (who, text, opts = {}) => {
        if (!game.phone) { game.error('phone.read: el móvil no está abierto'); return; }
        const lines = Array.isArray(text) ? text : [text];
        for (const l of lines) { if (gone()) return; await game.speak(who && game.actors[who] ? who : null, l, { blocking, ...Phone.anchor(game), who: who || 'movil', ...opts }); }
      },
      get active() { return !!game.phone; },
      get caller() { return game.phone ? game.phone.caller : null; },
    },

    // movement
    walkTo: async (target, y) => {
      const p = resolvePoint(target, y);
      if (!p) return false;
      const ok = await game.walkActor(P(), p[0], p[1]);
      const a = game.player;
      if (p[2]) a.dir = p[2]; else if (p[3]) game.faceTowards(a, p[3][0], p[3][1]);
      return ok;
    },
    walkActor: async (id, target, y) => {
      const p = resolvePoint(target, y);
      if (!p || !actorOr(id)) return false;
      return game.walkActor(id, p[0], p[1]);
    },
    face: (dirOrTarget) => api.faceActor(P(), dirOrTarget),
    /** Variante de sprite elegida por guion (se guarda con la partida): api.vestir('bruno', 'con_chaqueta'); null = la
     *  de siempre (o la que diga `variant(view)` en actors.js). */
    vestir: (id, variante = null) => {
      const a = actorOr(id); if (!a) return;
      if (variante && !a.variants[variante]) { game.error(`vestir: ${id} no tiene la variante ${variante}`); return; }
      a.variante = variante || undefined;
      if (game.state && game.state.actors[id]) { if (variante) game.state.actors[id].variante = variante; else delete game.state.actors[id].variante; }
    },
    /** Huida en grupo por una puerta con atasco (plan §4.4). Ver engine/efectos.js `estampida`. */
    estampida: (ids, opts) => Fx.estampida(game, api, ids, opts),
    faceActor: (id, dirOrTarget) => {
      const a = actorOr(id); if (!a) return;
      if (['up', 'down', 'left', 'right'].includes(dirOrTarget)) { a.dir = dirOrTarget; return; }
      const o = game.actors[dirOrTarget];
      if (o) { game.faceTowards(a, o.x, o.y); return; }
      const f = game.findObjectDef(dirOrTarget);
      if (f) { const d = f.def; const cx = d.poly ? d.poly[0][0] : d.x + d.w / 2; const cy = d.poly ? d.poly[0][1] : d.y + d.h / 2; game.faceTowards(a, cx, cy); return; }
      game.error('face: dirección/destino desconocido ' + dirOrTarget);
    },
    placeActor: (id, room, x, y, dir) => {
      const a = actorOr(id); if (!a) return;
      if (a.walkResolve) { const r = a.walkResolve; a.walkResolve = null; r(false); }
      a.room = room; if (x != null) a.x = x; if (y != null) a.y = y; if (dir) a.dir = dir; a.path = [];
      game.syncState();
    },
    /** Pose de un actor: 'sentado' | 'tras_mesa' | 'de_pie' (fuerza de pie) | null (la de su colocación en la sala). */
    pose: (id, pose = null) => { const a = actorOr(id); if (!a) return; a.pose = pose == null ? undefined : pose; game.syncState(); },
    /** Exención de la penumbra de la sala para un actor: 0 = se oscurece como el fondo … 1 = nada; null = la de la sala. */
    luz: (id, k = null) => { const a = actorOr(id); if (!a) return; a.luz = k == null ? undefined : Math.max(0, Math.min(1, Number(k))); game.syncState(); },
    /** Objeto en la mano: id de un item del inventario (su icono a media escala), { draw(g, x, y, s, dir) } o null.
     *  Se suelta solo al acabar el guion bloqueante que lo dio (no se guarda). */
    sostener: (id, what = null) => {
      const a = actorOr(id); if (!a) return;
      if (what == null) { a.hold = null; return; }
      if (typeof what === 'string') {
        if (!game.content.items[what]) { game.error('sostener: item desconocido ' + what); return; }
        a.hold = { icon: itemIconCanvas(game, what), item: what, owner: blocking ? ctx : null };
      } else a.hold = { ...what, owner: blocking ? ctx : null };
    },
    actorPos: (id) => { const a = actorOr(id); return a ? { room: a.room, x: a.x, y: a.y, dir: a.dir } : null; },
    anim: async (id, name, ms = 600) => {
      const a = actorOr(id); if (!a) return;
      if (name === 'idle' || !name) { a.custom = null; return; }
      a.custom = { name, until: ms > 0 ? game.time + ms : 0 };
      if (ms > 0) await game.sleep(ms);
    },
    cameraTo: (x) => { game.camFollow = null; game.camTarget = x - 160; },
    cameraFollow: (id) => { game.camTarget = null; game.camFollow = id || P(); },

    // time & effects
    wait: (ms) => game.sleep(ms),
    shake: (ms, amp) => game.shake(ms, amp),
    /** Apagón de la sala (plan §4.2): api.apagon({ ms: 3000, spots, alpha }) · api.apagon(false) devuelve la luz. */
    apagon: (opts) => Fx.apagon(game, opts),
    /** Ráfaga de notificaciones + contador (plan §4.1, la cafetera viral). Ver engine/efectos.js `viral`. */
    viral: (opts) => Fx.viral(game, opts),
    /** Pantalla fija (la fe de erratas final, plan §9): api.tarjeta({ titulo, lineas, minMs: 6000 }); espera al clic. */
    tarjeta: (opts) => Fx.tarjeta(game, opts),
    /** Dice una secuencia [[quién, texto], ...] con `voces` opcionales (el mismo formato que el ambiente). */
    decir: (lines, voces) => Fx.decir(api, lines, voces),
    fadeOut: (ms = 500) => game.fadeTo(1, ms),
    fadeIn: (ms = 500) => game.fadeTo(0, ms),
    sfx: (name) => game.audio.sfx(name),
    music: (id, fade = 1) => game.audio.play(id, fade),

    // inventory
    give: (id) => {
      if (!game.content.items[id]) { game.error('Item desconocido: ' + id); return; }
      if (!game.state.inventory.includes(id)) game.state.inventory.push(id);
      const per = 4, rows = Math.ceil(game.state.inventory.length / per);
      game.ui.invScroll = Math.max(0, rows - 2);
    },
    take: (id) => {
      const i = game.state.inventory.indexOf(id);
      if (i >= 0) game.state.inventory.splice(i, 1);
      if (game.ui.item === id) game.ui.item = null;
      const rows = Math.ceil(game.state.inventory.length / 4);
      game.ui.invScroll = Math.max(0, Math.min(game.ui.invScroll, rows - 2));
    },
    has: (id) => game.state.inventory.includes(id),
    inventory: () => game.state.inventory.slice(),

    // flags & state
    flag: (name) => { game.checkFlag(name, 'flag'); return game.state.flags[name]; },
    setFlag: (name, value = true) => { game.checkFlag(name, 'setFlag'); game.state.flags[name] = value; game.refreshWalkboxes(); if (game.room && game.room.def.dynamic) game.repaint(); return value; },
    inc: (name, by = 1) => { game.checkFlag(name, 'inc'); game.state.flags[name] = (game.state.flags[name] || 0) + by; game.refreshWalkboxes(); if (game.room && game.room.def.dynamic) game.repaint(); return game.state.flags[name]; },
    once: (key) => { const k = 'once:' + key; if (game.state.once[k]) return false; game.state.once[k] = true; return true; },
    cond: (c) => game.cond(c, api),
    getState: (id) => game.getObjState(id).state,
    setState: (id, value) => game.setObjState(id, { state: value }),
    isVisible: (id) => {
      if (game.actors[id]) return game.actors[id].visible;
      return game.getObjState(id).visible;
    },
    show: (id) => {
      if (game.actors[id]) { game.actors[id].visible = true; return; }
      game.setObjState(id, { visible: true });
    },
    hide: (id) => {
      if (game.actors[id]) { game.actors[id].visible = false; return; }
      game.setObjState(id, { visible: false });
    },
    setWalkbox: (id, on) => {
      game.state.flags['walkbox:' + game.state.room + '.' + id] = !!on;
      if (game.room) { const b = game.room.walk.boxes.find(b => b.id === id); if (b) b.when = undefined; game.room.walk.setEnabled(id, on); }
    },
    repaint: () => game.repaint(),

    // duel replies are learned ONLY through flags rep_01..rep_14 (bible 6.2.11)
    /** Teach a duel reply: sets its flag (e.g. 'rep_07'; 'R07' also accepted) and, the first time, shows the notice. */
    learnReply: (id) => {
      const D = game.content.duels;
      const pair = (D.pairs || []).find(p => p.flag === id || p.id === id);
      const flag = pair ? pair.flag : id;
      if (!pair) game.error('learnReply: réplica desconocida ' + id);
      game.checkFlag(flag, 'learnReply');
      if (game.state.flags[flag]) return false;
      game.state.flags[flag] = true;
      const L = game.G.learnReply || {};
      if (L.notice !== false) game.notice(L.notice || 'Réplica apuntada.', { color: L.color });
      if (L.sfx !== false) game.audio.sfx(L.sfx || 'good');
      return true;
    },
    knowsReply: (id) => {
      const pair = (game.content.duels.pairs || []).find(p => p.flag === id || p.id === id);
      return !!game.state.flags[pair ? pair.flag : id];
    },
    notice: (text, opts) => game.notice(text, opts),
    get comboFails() { return game.comboFails; },
    resetComboFails: () => { game.comboFails = 0; },

    // objetivos, pistas y hora (plan §8; engine/objetivos.js, datos en content/pistas.js)
    objetivo: Obj.apiFor(game, () => api),
    /** Hora de la historia en el móvil ('18:30' … '21:00', por hitos; los relojes del edificio siguen en 20:59). */
    hora: () => Obj.hora(game),

    // flow
    goto: (room, entry) => game.enterRoom(room, entry),
    dialog: (id, node) => { game.sceneTicks = (game.sceneTicks || 0) + 1; return game.dialog(id, node, api); },
    /** opts.escape = índice que elige Esc o un toque fuera del panel (p. ej. «Guardar el móvil»). */
    choose: (options, opts) => game.choose(options, opts),
    duel: (id) => { game.sceneTicks = (game.sceneTicks || 0) + 1; return game.duel(id, api); },
    pickItem: (prompt) => game.pickItem(prompt),
    scene: (name, ...args) => {
      if (name !== 'avisos' && name !== 'pistas') game.sceneTicks = (game.sceneTicks || 0) + 1;   // «la entrada dispara una escena»
      return game.runScene(name, api, ...args);
    },
    refreshActors: () => game.applyPresence(),
    /** PLANO DETALLE (engine/detalle.js): inserto ampliado con marco y rótulo. Ver la cabecera de detalle.js. */
    detalle: async (opts = {}, body) => {
      const D = Detalle.open(game, ctx, opts);
      try {
        if (game.instant) await game.sleep(0);
        else await game.sleep(220);                                     // la apertura
        if (typeof body === 'function') await body(api);
        if (opts.lines) {
          for (const l of opts.lines) {
            if (game.detalle !== D) break;
            if (Array.isArray(l)) {
              const [who, text] = l;
              if (who === 'player' || who === 'B') await api.say(text);
              else if (who === 'narrador' || who === 'narrator' || who == null) await api.narrate(text);
              else await api.sayAs(who, text);
            } else await api.narrate(l);
          }
        }
        // el plano no se cierra antes de que dé tiempo a leer lo que enseña (su rótulo + `texto`, si lo pinta): lo que
        // falte se espera (un clic lo salta); sin líneas ni cuerpo, `ms` (y nunca menos que eso)
        const leer = [opts.titulo, opts.texto].filter(Boolean).join(' ');
        const minMs = leer ? game.timedMs('detalle', leer, opts.ms || 0) : (opts.ms || 0);
        const abierto = game.time - D.t0;
        // E2 §4.2: un anuncio con `cuenta`/`bloqueo` no se cierra antes de su cuenta atrás (y sin `ms`, deja 1,5 s
        // para leer «Saltar anuncio ›» o ver que la X ya no está)
        const porDefecto = D.cuenta ? D.cuenta.ms + 1500 : 1800;
        if (!opts.lines && typeof body !== 'function') await Detalle.hold(game, Math.max(opts.ms ?? porDefecto, minMs, D.bloqueo || 0));
        else if (Math.max(minMs, D.bloqueo || 0) > abierto) await Detalle.hold(game, Math.max(minMs, D.bloqueo || 0) - abierto);
      } finally { if (game.detalle === D) Detalle.close(game); }
    },
    /** Alias del plano detalle con el nombre de la propuesta (M2). */
    inserto: (opts, body) => api.detalle(opts, body),
    cutscene: async (fn) => {
      game.sceneTicks = (game.sceneTicks || 0) + 1;
      game.cutscene++;
      try { await fn(api); }
      finally { game.cutscene = Math.max(0, game.cutscene - 1); if (!game.cutscene) game.skipCut = false; }
    },
    ending: (opts) => game.screens.startEnding(game, opts),
    /** Credits inside the game: resolves by itself when the text has scrolled away and the game stays in 'play'. */
    credits: (opts) => game.screens.startEnding(game, opts, true),
    run: (fn) => game.runScript(fn, { ...ctx, label: (ctx.label || '') + '>run' }),
    background: (fn) => { game.runScript(fn, { blocking: false, label: 'background' }); },
    defaultResponse: async () => {
      const t = ctx.target;
      if (!t) return;
      const gd = game.G.defaults || {}, rd = (game.room && game.room.def.defaults) || {};
      const key = ctx.verb || 'mirar';
      for (const c of [rd[key], rd['*'], gd[key], gd['*']]) {
        const s = game.toScript(c, t);
        if (s) { await s(api); return; }
      }
    },
    random: pick,
    pick,
    log: (...a) => console.log('[script]', ...a),
  };
  return api;
}
