// Script API given to every handler / hook: async (api) => { ... }
// See docs/CONTENT_SCHEMA.md#script-api for the authoritative reference.

function pick(arr) { return Array.isArray(arr) ? arr[Math.floor(Math.random() * arr.length)] : arr; }

export function makeApi(game, ctx = {}) {
  const blocking = ctx.blocking !== false;
  const P = () => game.G.player;
  const actorOr = id => { const a = game.actors[id]; if (!a) game.error('Actor desconocido: ' + id); return a; };

  // an ambient script (room `ambient`) falls silent as soon as the player leaves its room
  const gone = () => !!(ctx.ambientRoom && (!game.state || game.state.room !== ctx.ambientRoom));
  const sayLines = async (who, text, opts) => {
    const lines = Array.isArray(text) ? text : [text];
    for (const l of lines) { if (gone()) return; await game.speak(who, l, { blocking, ...(opts || {}) }); }
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
      for (const l of lines) { if (gone()) return; await game.speak(null, l, { blocking, at: [cx, top - 2], color: opts.color || d.color || '#e8e8e8', who: d.id, ...opts }); }
    },
    sayRandom: (lines) => sayLines(P(), pick(lines)),

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
    setFlag: (name, value = true) => { game.checkFlag(name, 'setFlag'); game.state.flags[name] = value; if (game.room && game.room.def.dynamic) game.repaint(); return value; },
    inc: (name, by = 1) => { game.checkFlag(name, 'inc'); game.state.flags[name] = (game.state.flags[name] || 0) + by; if (game.room && game.room.def.dynamic) game.repaint(); return game.state.flags[name]; },
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
      if (game.room) game.room.walk.setEnabled(id, on);
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

    // flow
    goto: (room, entry) => game.enterRoom(room, entry),
    dialog: (id, node) => { game.sceneTicks = (game.sceneTicks || 0) + 1; return game.dialog(id, node, api); },
    choose: (options) => game.choose(options),
    duel: (id) => { game.sceneTicks = (game.sceneTicks || 0) + 1; return game.duel(id, api); },
    pickItem: (prompt) => game.pickItem(prompt),
    scene: (name, ...args) => {
      if (name !== 'avisos' && name !== 'pistas') game.sceneTicks = (game.sceneTicks || 0) + 1;   // «la entrada dispara una escena»
      return game.runScene(name, api, ...args);
    },
    refreshActors: () => game.applyPresence(),
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
