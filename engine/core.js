// Core game runtime: state, rooms, actors, rendering, input, scripts.
import { WalkMap } from './walk.js';
import { getFrame, paperDoll } from './sprites.js';
import { AudioSystem } from './audio.js';
import { drawText, wrap, measure, LINE_H } from './font.js';
import { toggleFullscreen, updateRotateHint } from './fullscreen.js';
import { shadowEllipse, PAL } from './draw.js';
import { makeApi } from './script.js';
import { runDialog } from './dialog.js';
import { runDuel } from './duel.js';
import * as UI from './ui.js';
import * as Phone from './phone.js';
import * as Screens from './screens.js';
import { Debug } from './debug.js';
import * as Pose from './pose.js';
import * as Detalle from './detalle.js';
import * as Ver from './hotspots.js';
import * as Fx from './efectos.js';
import * as Mov from './mover.js';
/** Versión de las partidas guardadas: 2 = tras el rediseño de las salas (las posiciones de los PNJ cambiaron). */
const SAVE_V = 3;                    // 3: la Redacción pasó a 1270 px (vestíbulo de planta): los PNJ vuelven a su sitio

export const SCREEN_W = 320, SCREEN_H = 200, VIEW_H = 144;

export const DEFAULT_VERBS = [
  { id: 'dar', label: 'Dar' }, { id: 'abrir', label: 'Abrir' }, { id: 'cerrar', label: 'Cerrar' },
  { id: 'coger', label: 'Coger' }, { id: 'mirar', label: 'Mirar' }, { id: 'hablar', label: 'Hablar', prep: 'con' },
  { id: 'usar', label: 'Usar' }, { id: 'empujar', label: 'Empujar' }, { id: 'tirar', label: 'Tirar' },
];
const WALK_VERB = { id: 'ir', label: 'Ir a' };

const SETTINGS_KEY = 'settings';

function mergeMaps(...maps) { return Object.assign({}, ...maps.filter(Boolean)); }
function asArray(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }
function rand(a, b) { return a + Math.random() * (b - a); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }

/** Normalise the content module exported by content/index.js */
export function normalizeContent(mod) {
  const game = mod.game || {};
  const rooms = {};
  const scenes = {};
  const addScenes = (src, from) => {
    for (const [k, fn] of Object.entries(src || {})) {
      if (scenes[k]) console.warn(`[contenido] escena duplicada '${k}' (${from})`);
      scenes[k] = fn;
    }
  };
  addScenes(game.scenes, 'game');
  for (const s of asArray(mod.scenes)) addScenes(s, 'index');
  for (const r of asArray(mod.rooms)) {
    if (!r || !r.id) { console.error('[contenido] habitación sin id', r); continue; }
    if (rooms[r.id]) console.warn('[contenido] habitación duplicada', r.id);
    rooms[r.id] = r;
    addScenes(r.scenes, 'sala ' + r.id);
  }
  // Duel data: shared data (content/duelo.js via index `duels`) + per-room opponents (room.duels).
  const duelParts = [game.duels, ...asArray(mod.duels)].filter(Boolean);
  for (const r of Object.values(rooms)) if (r.duels) duelParts.push({ opponents: r.duels });
  const duels = { pairs: [], weakReplies: [], opponents: {}, wrongObject: {}, texts: {} };
  for (const d of duelParts) {
    duels.pairs.push(...asArray(d.pairs));
    duels.weakReplies.push(...asArray(d.weakReplies));
    for (const [k, o] of Object.entries(d.opponents || {})) {
      if (duels.opponents[k]) console.warn('[contenido] duelo duplicado', k);
      duels.opponents[k] = { id: k, ...o };
    }
    for (const [k, v] of Object.entries(d.wrongObject || {})) duels.wrongObject[k] = typeof v === 'object' ? { ...(duels.wrongObject[k] || {}), ...v } : v;
    Object.assign(duels.texts, d.texts || {});
    for (const k of Object.keys(d)) if (!(k in duels)) duels[k] = d[k];
  }
  // Known flags (content/flags.js via index `flags`, plus per-room local `flags`): used by the debug checker.
  const flags = {};
  for (const f of asArray(mod.flags)) {
    if (Array.isArray(f)) f.forEach(n => { flags[n] = ''; });
    else Object.assign(flags, f);
  }
  for (const r of Object.values(rooms)) Object.assign(flags, r.flags || {});
  const items = mergeMaps(game.items, ...asArray(mod.items));
  for (const [id, it] of Object.entries(items)) it.id = id;
  const actors = mergeMaps(...asArray(mod.actors));
  for (const [id, a] of Object.entries(actors)) a.id = id;
  return {
    game, rooms, items, actors, duels, scenes, flags,
    music: mergeMaps(game.music, ...asArray(mod.music)),
    sfx: mergeMaps(game.sfx, ...asArray(mod.sfx)),
    dialogs: mergeMaps(game.dialogs, ...asArray(mod.dialogs)),
  };
}

/** Banda translúcida bajo el texto hablado (game.speechBacking la sustituye; null la quita). La comprueba tools/contrast.mjs. */
export const SPEECH_BACKING = { color: '#06050c', alpha: 0.8 };

export class Game {
  constructor(canvas, contentModule, opts = {}) {
    this.display = canvas;
    this.dctx = canvas.getContext('2d');
    this.buf = document.createElement('canvas');
    this.buf.width = SCREEN_W; this.buf.height = SCREEN_H;
    this.ctx = this.buf.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.content = normalizeContent(contentModule);
    this.G = this.content.game;
    this.verbs = (this.G.verbs || DEFAULT_VERBS).map(v => ({ ...v }));
    this.walkVerb = { ...WALK_VERB, ...(this.G.walkVerb || {}) };
    this.saveKey = (this.G.id || this.G.title || 'aventura').toString().replace(/\W+/g, '_');
    this.debug = new Debug(this, !!opts.debug);
    this.audio = new AudioSystem();
    this.audio.register(this.content.music, this.content.sfx);
    this.settings = { textSpeed: 1, music: 0.6, sfx: 0.8, ...this.loadSettings() };
    this.audio.setVolumes(this.settings.music, this.settings.sfx);
    if (this.G.title && this.G.title.music) this.audio.play(this.G.title.music, 0.5); // starts on first gesture
    this.time = 0; this.realTime = 0;
    this.mode = 'title';
    this.busy = 0;
    this.cutscene = 0; this.skipCut = false;
    this.fast = false;
    this.speeches = [];
    this.timers = [];
    this.fades = [];
    this.fadeLevel = 0;
    this.shakeUntil = 0; this.shakeAmp = 0;
    this.choice = null;
    this.menu = null;
    this.hud = null;
    this.phone = null;            // primer plano del móvil durante una llamada (engine/phone.js, api.phone)
    this.ui = { verb: null, item: null, hover: null, invScroll: 0, sentence: null };
    this.mouse = { x: -1, y: -1, inside: false, touch: false };
    this.coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);   // iPhone / tableta
    this.log = [];
    this.errors = [];
    this.toast = null;
    this.notices = [];            // non-blocking notices drawn at the bottom of the room view
    this.itemPick = null;         // inventory picker (duel finishers)
    this.idleMs = 0; this.idleFired = false;
    this.comboFails = 0;          // consecutive item interactions that fell back to a default line
    this.murmur = { hoverId: null, hoverMs: 0, last: {}, stillMs: 0 };
    this.hudTop = 0;              // speech is kept below this y while a HUD is shown
    this.warnedFlags = new Set();
    this.actionToken = 0;
    this.idleWaiters = [];
    this.camX = 0; this.camTarget = null; this.camFollow = null;
    this.room = null;
    this.state = null;
    this.actors = {};
    this.screens = Screens;
    this.validate();
    this.bindInput();
    this.resize();
    const rs = () => { this.resize(); clearTimeout(this.rsT); this.rsT = setTimeout(() => this.resize(), 250); };   // iOS da el tamaño final un poco después
    window.addEventListener('resize', rs);
    window.addEventListener('orientationchange', rs);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', rs);
    document.addEventListener('fullscreenchange', rs);
    document.addEventListener('webkitfullscreenchange', rs);
    this.last = performance.now();
    requestAnimationFrame(ts => this.frame(ts));
    window.addEventListener('error', e => this.error('Error no capturado: ' + e.message, e.error));
    window.addEventListener('unhandledrejection', e => this.error('Promesa rechazada: ' + (e.reason && e.reason.message || e.reason), e.reason));
  }

  // ------------------------------------------------------------------ validation & errors
  validate() {
    const C = this.content;
    const warn = m => { console.warn('[contenido] ' + m); this.errors.push({ msg: m, warn: true }); };
    if (!C.rooms[this.G.startRoom]) warn('startRoom desconocida: ' + this.G.startRoom);
    if (!C.actors[this.G.player]) warn('player desconocido: ' + this.G.player);
    for (const r of Object.values(C.rooms)) {
      for (const a of asArray(r.actors)) if (!C.actors[a.id]) warn(`habitación ${r.id}: actor desconocido ${a.id}`);
      for (const o of asArray(r.objects)) {
        if (!o.id) warn(`habitación ${r.id}: objeto sin id`);
        if (o.pickup && !C.items[o.pickup]) warn(`habitación ${r.id}: objeto ${o.id} recoge item desconocido ${o.pickup}`);
        if (o.exit && !C.rooms[o.exit.room]) warn(`habitación ${r.id}: salida ${o.id} a habitación desconocida ${o.exit.room}`);
        else if (o.exit && o.exit.entry && !(C.rooms[o.exit.room].entries || {})[o.exit.entry]) warn(`habitación ${r.id}: salida ${o.id} → ${o.exit.room} usa la entrada '${o.exit.entry}', que no existe allí`);
      }
    }
    for (const [id, d] of Object.entries(C.duels.opponents)) if (d.actor && !C.actors[d.actor]) warn(`duelo ${id}: actor desconocido ${d.actor}`);
  }
  /** Debug-mode check that a flag is declared in content/flags.js (or a room's local `flags`). */
  checkFlag(name, op) {
    if (!this.debug.on || name == null) return;
    const n = String(name);
    if (n.startsWith('duel:') || n.startsWith('walkbox:') || n.startsWith('obj:') || n.startsWith('ambient:')) return;
    const known = this.content.flags;
    if (!known || !Object.keys(known).length || n in known || this.warnedFlags.has(n)) return;
    this.warnedFlags.add(n);
    const m = `flag no declarado en content/flags.js (${op}): ${n}`;
    console.warn('[flags] ' + m);
    this.errors.push({ msg: m, warn: true });
  }
  condApi() { return this._condApi || (this._condApi = makeApi(this, { label: 'cond' })); }
  /** Non-blocking notice at the bottom of the room view (e.g. "Réplica apuntada en la libreta."). */
  notice(text, opts = {}) {
    this.log.push({ who: 'aviso', name: null, text: String(text), room: this.state && this.state.room, t: Math.round(this.time) });
    // nunca menos que el tiempo de lectura de su texto (con la velocidad del texto elegida)
    const ms = this.timedMs('aviso', text, opts.ms || 2600);
    if (this.fast) return;
    this.notices.push({ text: String(text), color: opts.color || '#f2d468', until: this.realTime + ms });
  }
  /** TEXTO CON TEMPORIZADOR (avisos, globos con `ms`, el hilo del duelo, mensajes del menú): devuelve su duración, que
   *  nunca baja del tiempo de lectura (`speechDuration`, que escala con la velocidad del texto), y lo apunta en
   *  `timedTexts` para tools/text-audit.mjs. */
  timedMs(kind, text, ms) {
    const need = this.speechDuration(text);
    const out = Math.max(Number(ms) || 0, need);
    (this.timedTexts || (this.timedTexts = [])).push({ kind, text: String(text), pedido: Math.round(Number(ms) || 0), ms: Math.round(out), need: Math.round(need) });
    if (this.timedTexts.length > 4000) this.timedTexts.splice(0, 1000);
    return out;
  }
  /** Run a named scene registered by any room (`scenes: {...}`) or game.js. Missing scenes only warn. */
  async runScene(name, api, ...args) {
    const fn = this.content.scenes[name];
    if (!fn) {
      const m = 'escena no implementada todavía: ' + name;
      console.warn('[contenido] ' + m); this.errors.push({ msg: m, warn: true });
      return false;
    }
    await fn(api, ...args);
    return true;
  }
  error(msg, err) {
    console.error('[motor] ' + msg, err || '');
    this.errors.push({ msg, stack: err && err.stack });
    this.toast = { text: msg, until: this.realTime + 6000 };
  }

  // ------------------------------------------------------------------ settings & saves
  loadSettings() { try { return JSON.parse(localStorage.getItem(this.saveKey + ':' + SETTINGS_KEY)) || {}; } catch (e) { return {}; } }
  saveSettings() {
    try { localStorage.setItem(this.saveKey + ':' + SETTINGS_KEY, JSON.stringify(this.settings)); } catch (e) { /* ignore */ }
    this.audio.setVolumes(this.settings.music, this.settings.sfx);
  }
  syncState() {
    if (!this.state) return;
    for (const a of Object.values(this.actors)) {
      const s = { room: a.room, x: Math.round(a.x), y: Math.round(a.y), dir: a.dir, visible: a.visible };
      if (a.pose !== undefined) s.pose = a.pose;          // api.pose (explícita); sin ella, la pose sale de la colocación
      if (a.luz !== undefined) s.luz = a.luz;             // api.luz (exención de la penumbra)
      if (a.variante) s.variante = a.variante;            // api.vestir (variante de sprite elegida por guion)
      this.state.actors[a.id] = s;
    }
  }
  slotKey(slot) { return this.saveKey + ':slot:' + slot; }
  save(slot = 1) {
    if (!this.state) return false;
    this.syncState();
    // a save made while a duel is open remembers it: loading restarts that duel (critic §6.5 / §9 bug 6)
    const state = this.duelActive ? { ...this.state, duelPendiente: this.duelActive.id } : this.state;
    const data = { v: SAVE_V, date: Date.now(), roomName: this.room ? (this.room.def.name || this.room.def.id) : '', state };
    try { localStorage.setItem(this.slotKey(slot), JSON.stringify(data)); return true; } catch (e) { this.error('No se pudo guardar', e); return false; }
  }
  slotInfo(slot) {
    try { const d = JSON.parse(localStorage.getItem(this.slotKey(slot))); return d ? { slot, date: d.date, roomName: d.roomName } : null; } catch (e) { return null; }
  }
  async load(slot = 1) {
    let d;
    try { d = JSON.parse(localStorage.getItem(this.slotKey(slot))); } catch (e) { d = null; }
    if (!d || !d.state) { this.error('Ranura vacía: ' + slot); return false; }
    this.resetRuntime();
    this.state = d.state;
    // partidas de antes del rediseño (v < 2): las posiciones guardadas de los PNJ son las de las salas viejas (la Redacción
    // medía 800 px, los mostradores y las mesas estaban en otro sitio). Cada PNJ vuelve a su sitio de la sala donde está.
    if ((d.v || 1) < 3) this.migrarJugadorV2();
    if ((d.v || 1) < SAVE_V) this.migrarPosiciones();
    // migración del contenido (objetos y flags retirados): idempotente, en cada carga (content/game.js `migrarPartida`)
    if (typeof this.G.migrarPartida === 'function') { try { this.G.migrarPartida(this.state); } catch (e) { this.error('migrarPartida falló', e); } }
    this.buildActors();
    this.mode = 'play';
    const duelo = this.state.duelPendiente;
    delete this.state.duelPendiente;
    await this.runScript(async () => { await this.enterRoom(this.state.room, null, { restore: true }); }, { label: 'cargar' });
    this.anclarJugador();
    // the save was made during a duel: the duel starts again from 0 (never drops to the room with the duel lost)
    if (duelo && this.content.duels.opponents[duelo]) {
      this.runScript(async (api) => { api.notice(this.G.duelResumeNotice || 'Se retoma el hilo.'); await api.duel(duelo); }, { label: 'reanudar duelo ' + duelo });
    }
    return true;
  }
  /** Partida v2 (Redacción de 940 px): el jugador, si estaba en la Redacción, pasa a la x equivalente de la sala de 1270
   *  (vestíbulo de planta 96-344, zona de papel 344-580, Web… +270, Diseño +330). Contenido de content/lib/edificio.js. */
  migrarJugadorV2() {
    const s = this.state.actors && this.state.actors[this.G.player];
    if (!s || s.room !== 'pecera' || typeof s.x !== 'number') return;
    const x = s.x;
    s.x = x < 96 ? x : x < 170 ? 96 + (x - 96) * 248 / 74 : x < 310 ? 344 + (x - 170) * 236 / 140 : x < 820 ? x + 270 : x + 330;
    s.x = Math.round(s.x);
  }
  /** Partida vieja: cada PNJ (no el jugador) que está en una sala donde tiene sitio en el arte vuelve a ese sitio (y a su
   *  pose); una sala que ya no existe en la geografía (salida retirada) no importa: el sitio es el de la sala. */
  migrarPosiciones() {
    const pl = this.G.player;
    for (const [id, s] of Object.entries(this.state.actors || {})) {
      if (id === pl || !s || !s.room) continue;
      const r = this.content.rooms[s.room];
      const p = r && asArray(r.actors).find(p => p.id === id);
      if (!p || p.x == null) continue;
      s.x = p.x; s.y = p.y; s.dir = p.dir || s.dir; delete s.pose;
    }
    if (this.state.poses) this.state.poses = {};
  }
  /** Tras cargar: si el jugador ha quedado fuera del suelo (partida vieja, sala repintada), al punto de suelo más cercano. */
  anclarJugador() {
    const p = this.player, rt = this.room;
    if (!p || !rt || !rt.walk || p.room !== rt.def.id || rt.walk.inside(p.x, p.y)) return;
    const [x, y] = rt.walk.nearest(p.x, p.y);
    p.x = x; p.y = y; p.path = [];
    this.snapCamera(); this.syncState();
  }
  autosave() { if (this.G.autosave !== false && !this.duelActive) this.save('auto'); }      // plan §7.1.14: never inside a duel

  // ------------------------------------------------------------------ new game / actors
  resetRuntime() {
    // scripts left waiting on a menu/choice of the previous game never resume: their input lock must not leak into the
    // loaded game (a save loaded from inside a duel or a dialog left the game «busy» for ever). `gen` makes any late
    // finally of those orphan scripts a no-op.
    this.gen = (this.gen || 0) + 1; this.busy = 0; this.acting = 0;
    this.speeches.forEach(s => s.resolve && s.resolve());
    this.speeches = []; this.timers.forEach(t => t.resolve()); this.timers = [];
    // un menú con salida (`escape`, p. ej. el del móvil) se cierra por su salida: su guion termina y suelta la entrada
    if (this.choice && this.choice.escape != null) { const ch = this.choice; ch.resolve(ch.escape); }
    this.choice = null; this.menu = null; this.hud = null; this.phone = null; this.detalle = null; this.hsShow = null; this.hsHold = false; this.hudTop = 0; this.cutscene = 0; this.skipCut = false; this.inDialog = 0;
    if (this.itemPick) { const r = this.itemPick.resolve; this.itemPick = null; r(null); }
    this.notices = []; this.idleMs = 0; this.idleFired = false; this.comboFails = 0; this.duelInfo = null; this.duelActive = null;
    Fx.reset(this); Mov.reset(this);
    this.ui.verb = null; this.ui.item = null; this.ui.invScroll = 0; this.ui.sentence = null;
    this.fadeLevel = 0; this.fades = [];
    this.room = null;
  }
  initialState() {
    const C = this.content;
    const st = {
      room: null, inventory: [...asArray(this.G.startInventory)], flags: { ...(this.G.startFlags || {}) },
      objects: {}, actors: {}, dialogs: {}, once: {}, playTime: 0,
    };
    // Placements without `when` give the initial room; conditional placements are applied on room entry.
    for (const r of Object.values(C.rooms)) for (const p of asArray(r.actors)) {
      if (p.when != null) continue;
      if (!st.actors[p.id]) st.actors[p.id] = { room: r.id, x: p.x, y: p.y, dir: p.dir || 'down', visible: p.visible !== false };
    }
    for (const r of Object.values(C.rooms)) for (const p of asArray(r.actors)) {
      if (!st.actors[p.id]) st.actors[p.id] = { room: null, x: p.x, y: p.y, dir: p.dir || 'down', visible: p.visible !== false };
    }
    for (const a of Object.values(C.actors)) if (a.room && !st.actors[a.id]) st.actors[a.id] = { room: a.room, x: a.x || 160, y: a.y || 130, dir: a.dir || 'down', visible: a.visible !== false };
    const pl = this.G.player;
    if (!st.actors[pl]) st.actors[pl] = { room: null, x: 160, y: 130, dir: 'down', visible: true };
    return st;
  }
  buildActors() {
    this.actors = {};
    for (const def of Object.values(this.content.actors)) {
      let sprite = def.sprite;
      if (!sprite) { try { sprite = paperDoll(def.doll || {}); } catch (e) { this.error('paperDoll falló para ' + def.id, e); sprite = paperDoll({}); } }
      const s = this.state.actors[def.id] || { room: null, x: 0, y: 0, dir: 'down', visible: true };
      const variants = {};
      for (const [k, v] of Object.entries(def.variants || {})) {
        try { variants[k] = v.sprite || paperDoll({ ...(def.doll || {}), ...(v.doll || {}) }); } catch (e) { this.error(`variante ${k} de ${def.id} falló`, e); }
      }
      this.actors[def.id] = {
        variants,
        id: def.id, def, sprite, name: def.name || def.id, color: def.color || '#ffffff',
        room: s.room, x: s.x, y: s.y, dir: s.dir || 'down', visible: s.visible !== false,
        anim: 'idle', path: [], walkDist: 0, speed: def.speed || 64, walkResolve: null,
        custom: null, nextBlink: rand(1000, 4000), scale: def.scale,
        pose: s.pose, luz: s.luz, hold: null, variante: s.variante,
      };
    }
  }
  get player() { return this.actors[this.G.player]; }
  /** Current sprite of an actor: def.variant(view) may pick one of def.variants (e.g. the Lector Medio with a jacket). */
  spriteOf(a) {
    // api.vestir(id, variante): explicit variant chosen by a script (saved with the game) beats def.variant(view)
    if (a.variante && a.variants[a.variante]) return a.variants[a.variante];
    if (a.def.variant) {
      let k = null;
      try { k = a.def.variant(this.viewFor()); } catch (e) { k = null; }
      if (k && a.variants[k]) return a.variants[k];
    }
    return a.sprite;
  }
  /** Conditional walkboxes: a walkbox with `when` (art `walkboxes: [{ id, poly, when: 'torno_abierto' }]`) is enabled
   *  only while its condition holds. Re-evaluated on room entry, after every setFlag/inc and when a blocking script
   *  ends. An explicit api.setWalkbox(id, on) for that box takes precedence. Cheap: rebuilds only on change. */
  refreshWalkboxes(rt = this.room) {
    if (!rt || !rt.walk || !this.state) return;
    let changed = false;
    for (const b of rt.walk.boxes) {
      if (b.when == null) continue;
      let on = false;
      try { on = !!this.cond(b.when, this.condApi()); } catch (e) { this.error(`when del walkbox ${b.id} falló`, e); }
      if (on !== b.enabled) { b.enabled = on; changed = true; }
    }
    if (changed) rt.walk.rebuild();
  }
  /** Put actors whose placement in the current room has a `when` condition in / out of the room. */
  applyPresence() {
    if (!this.room || !this.state) return;
    this.refreshWalkboxes();
    const rid = this.room.def.id;
    for (const p of asArray(this.room.def.actors)) {
      if (p.when == null) continue;
      const a = this.actors[p.id]; if (!a || a.id === this.G.player) continue;
      let on = false;
      try { on = this.cond(p.when, this.condApi()); } catch (e) { this.error(`when de ${p.id} en ${rid} falló`, e); }
      if (on && a.room !== rid) {
        let pos = p;
        const pn = typeof p.pos === 'function' ? p.pos(this.viewFor()) : p.pos;
        if (pn && p.positions && p.positions[pn]) pos = p.positions[pn];
        a.room = rid; a.x = pos.x ?? a.x; a.y = pos.y ?? a.y; a.dir = pos.dir || a.dir; a.path = []; a.anim = 'idle';
      } else if (!on && a.room === rid) { a.room = null; a.path = []; }
    }
  }
  /** Placement of an actor in the current room (merged with its named position, if any). */
  placementOf(id) {
    const p = asArray(this.room && this.room.def.actors).find(p => p.id === id);
    if (!p) return {};
    const pn = typeof p.pos === 'function' ? p.pos(this.viewFor()) : p.pos;
    return pn && p.positions && p.positions[pn] ? { ...p, ...p.positions[pn] } : p;
  }
  /** Start a new game. opts: { room, entry, skipIntro } (room/entry override the start room, e.g. for previews). */
  async newGame(opts = {}) {
    this.resetRuntime();
    this.finished = null;
    this.state = this.initialState();
    this.buildActors();
    this.log.length = 0;
    this.mode = 'play';
    await this.runScript(async (api) => {
      await this.enterRoom(opts.room || this.G.startRoom, opts.room ? opts.entry : (opts.entry || this.G.startEntry));
      if (this.G.onStart && !opts.skipIntro && !opts.room) await this.G.onStart(api);
    }, { label: 'inicio' });
  }

  // ------------------------------------------------------------------ rooms
  /** Escala por profundidad. Con `x`, un walkbox activo que contenga el punto y tenga su propia `scale` (art
   *  `walkboxes: [{ id, poly, scale: { yFar, far, yNear, near } | número }]`) manda sobre la de la sala. */
  roomScale(y, x) {
    let sc = this.room && this.room.def.scale;
    if (x != null && this.room && this.room.walk && this.room.walk.scaled) {
      const b = this.room.walk.boxAt(x, y, true);
      if (b && b.scale != null) sc = b.scale;
    }
    if (!sc) return 1;
    if (typeof sc === 'number') return sc;
    if (typeof sc === 'function') return sc(y);
    const { yFar = 0, far = 1, yNear = 144, near = 1 } = sc;
    const t = Math.max(0, Math.min(1, (y - yFar) / ((yNear - yFar) || 1)));
    return far + (near - far) * t;
  }
  viewFor(objState) {
    const self = this;
    return {
      get flags() { return self.state ? self.state.flags : {}; },
      flag: n => { self.checkFlag(n, 'arte'); return self.state ? self.state.flags[n] : undefined; },
      has: i => self.state ? self.state.inventory.includes(i) : false,
      objState: id => self.getObjState(id).state,
      state: objState ? objState.state : undefined,
      visible: objState ? objState.visible : undefined,
      t: this.time,
    };
  }
  paintRoom() {
    const rt = this.room, def = rt.def;
    const mk = () => { const c = document.createElement('canvas'); c.width = rt.width; c.height = VIEW_H; return c; };
    rt.bg = mk();
    const g = rt.bg.getContext('2d');
    try { if (def.draw) def.draw(g, this.viewFor(), 0); }
    catch (e) { this.error(`draw() de la habitación ${def.id} falló: ${e.message}`, e); g.fillStyle = '#802080'; g.fillRect(0, 0, rt.width, VIEW_H); }
    rt.fg = null;
    if (def.foreground) {
      rt.fg = mk();
      try { def.foreground(rt.fg.getContext('2d'), this.viewFor(), 0); } catch (e) { this.error(`foreground() de ${def.id} falló`, e); }
    }
    rt.dirty = false;
    rt.paintId = (rt.paintId || 0) + 1;
  }
  repaint() { if (this.room) this.room.dirty = true; }
  objKey(roomId, id) { return roomId + '.' + id; }
  findObjectDef(id, roomId) {
    let r = roomId || (this.room && this.room.def.id);
    let oid = id;
    if (id && id.includes('.')) { [r, oid] = id.split('.'); }
    const room = this.content.rooms[r];
    if (!room) return null;
    const o = asArray(room.objects).find(o => o.id === oid);
    return o ? { def: o, roomId: r } : null;
  }
  getObjState(id, roomId) {
    const f = this.findObjectDef(id, roomId);
    if (!f) return { state: undefined, visible: false, missing: true };
    const k = this.objKey(f.roomId, f.def.id);
    const s = this.state && this.state.objects[k];
    let visible = s && 'visible' in s ? s.visible : (f.def.visible !== false);
    if (visible && f.def.when != null && this.state) {
      try { visible = this.cond(f.def.when, this.condApi()); } catch (e) { visible = false; }
    }
    return { state: s && 'state' in s ? s.state : f.def.state, visible };
  }
  setObjState(id, patch) {
    const f = this.findObjectDef(id);
    if (!f) { this.error('Objeto desconocido: ' + id); return false; }
    const k = this.objKey(f.roomId, f.def.id);
    this.state.objects[k] = { ...(this.state.objects[k] || {}), ...patch };
    if (this.room && this.room.def.dynamic) this.repaint();
    return true;
  }
  async enterRoom(id, entry, opts = {}) {
    const def = this.content.rooms[id];
    if (!def) { this.error('Habitación desconocida: ' + id); return false; }
    if (this.room && !opts.restore) {
      const old = this.room.def;
      if (old.onExit) { try { await old.onExit(makeApi(this, { label: old.id + '.onExit' })); } catch (e) { this.error(`onExit de ${old.id} falló: ${e.message}`, e); } }
      if (!this.instant) await this.fadeTo(1, 220);
    }
    this.speeches.filter(s => !s.blocking).forEach(s => this.endSpeech(s));
    this.state.room = id;
    const rt = { def, width: Math.max(SCREEN_W, def.width || SCREEN_W), dirty: true };
    rt.walk = new WalkMap(asArray(def.walkboxes).map(b => {
      const k = 'walkbox:' + id + '.' + (b.id || '');
      const on = this.state.flags[k];
      return on === undefined ? b : { ...b, enabled: on, when: undefined };   // api.setWalkbox wins over `when`
    }));
    this.refreshWalkboxes(rt);
    rt.ambient = asArray(def.ambient).map(a => ({ def: a, next: this.time + rand(...(a.every || [8000, 15000])), running: false }));
    Fx.ambientEnter(this, rt);
    this.room = rt;
    this.paintRoom();
    const p = this.player;
    if (!opts.restore) {
      const entries = def.entries || {};
      let e = entry && entries[entry];
      if (entry && !e) this.error(`Entrada '${entry}' no existe en ${id}`);
      if (!e) e = entries.default || Object.values(entries)[0] || { x: rt.width / 2, y: 130, dir: 'down' };
      if (Array.isArray(e)) e = { x: e[0], y: e[1], dir: e[2] };
      p.room = id; p.x = e.x; p.y = e.y; p.dir = e.dir || p.dir; p.path = []; p.anim = 'idle';
      if (p.walkResolve) { const r = p.walkResolve; p.walkResolve = null; r(false); }
    }
    this.applyPresence();
    this.camFollow = this.G.player; this.camTarget = null;
    this.snapCamera();
    if (def.music !== undefined) this.audio.play(def.music, 1.2);
    this.murmur.stillMs = 0;
    this.syncState();
    if (!opts.noAutosave) this.autosave();
    this.ui.hover = null;
    if (this.fadeLevel > 0) await this.fadeTo(0, this.instant ? 0 : 220);
    // `G.afterEnter(api, info)`: gancho común tras el onEnter de cada sala (avisos de la adenda §2). Se salta al cargar
    // partida y cuando la entrada ya ha lanzado una escena / diálogo / duelo / cinemática (`sceneTicks` cambió).
    this.entryN = (this.entryN || 0) + 1;
    const ticks = this.sceneTicks = this.sceneTicks || 0;
    // api.restoring is true inside onEnter when the entry comes from loading a save (per-entry gags can skip it)
    this.restoring = !!opts.restore;
    try { if (def.onEnter) await this.runScript(def.onEnter, { label: id + '.onEnter' }); }
    finally { this.restoring = false; }
    if (this.G.afterEnter && !opts.restore && this.state && this.sceneTicks === ticks && !this.cutscene && !this.inDialog) {
      await this.runScript((api) => this.G.afterEnter(api, { room: id, entryN: this.entryN }), { label: id + '.afterEnter' });
    }
    return true;
  }
  snapCamera() {
    const W = this.room ? this.room.width : SCREEN_W;
    const p = this.player;
    this.camX = Math.max(0, Math.min(W - SCREEN_W, (p ? p.x : 0) - SCREEN_W / 2));
  }

  // ------------------------------------------------------------------ time helpers
  get instant() { return this.fast || this.skipCut; }
  sleep(ms) {
    if (this.instant || ms <= 0) return Promise.resolve();
    return new Promise(res => this.timers.push({ at: this.time + ms, resolve: res }));
  }
  fadeTo(level, ms = 400) {
    if (this.instant || ms <= 0) { const old = this.fades; this.fadeLevel = level; this.fades = []; old.forEach(f => f.resolve()); return Promise.resolve(); }
    // a fade replaced by another never leaves its script waiting for ever (two room changes at once)
    return new Promise(res => { const old = this.fades; this.fades = [{ from: this.fadeLevel, to: level, start: this.time, ms, resolve: res }]; old.forEach(f => f.resolve()); });
  }
  shake(ms = 400, amp = 2) { if (!this.instant) { this.shakeUntil = this.time + ms; this.shakeAmp = amp; } }

  // ------------------------------------------------------------------ speech
  speechDuration(text) {
    const n = String(text).length;
    return Math.max(1100, 900 + n * 55) * (this.settings.textSpeed || 1);
  }
  speak(actorId, text, opts = {}) {
    text = String(text ?? '');
    const a = actorId ? this.actors[actorId] : null;
    if (actorId && !a) this.error('Actor desconocido en sayAs: ' + actorId);
    this.log.push({ who: a ? a.id : (opts.who || (opts.narrator ? 'narrador' : null)), name: a ? a.name : null, text, room: this.state && this.state.room, t: Math.round(this.time), ...(opts.tag ? { tag: opts.tag } : {}) });
    if (this.debug.on) console.log(`[diálogo] ${a ? a.name : '—'}: ${text}`);
    // el que llama por el móvil habla SIEMPRE anclado al teléfono (aunque el contenido no lo pida)
    if (this.phone && a && a.id === this.phone.caller && !opts.at && !opts.narrator) opts = { ...opts, ...Phone.anchor(this) };
    const durMs = opts.ms ? this.timedMs('globo', text, opts.ms) : this.speechDuration(text);   // nunca menos que leerlo
    if (this.instant) return Promise.resolve();
    for (const s of this.speeches.filter(s => s.actor === (a ? a.id : null) && !s.at === !opts.at)) this.endSpeech(s);
    // ambient chatter and murmurs never stay on screen under a real line: they are cut (the next ambient line waits)
    if (!opts.ambient) for (const s of this.speeches.filter(s => s.ambient)) this.endSpeech(s);
    return new Promise(resolve => {
      const color = opts.color || (a ? a.color : (this.G.narratorColor || '#f0e8c0'));
      const lines = wrap(text, opts.width || 210);
      const sp = { actor: a ? a.id : null, at: opts.at || null, text, lines: opts.style === 'titular' ? wrap(text, 290, { bold: true }) : lines, color, end: this.time + durMs, blocking: opts.blocking !== false, tail: opts.tail || null, phone: !!opts.phone, ambient: !!opts.ambient, style: opts.style || null, tag: opts.tag || null, resolve };
      this.speeches.push(sp);
    });
  }
  endSpeech(sp) {
    const i = this.speeches.indexOf(sp);
    if (i >= 0) this.speeches.splice(i, 1);
    if (sp.resolve) { const r = sp.resolve; sp.resolve = null; r(); }
  }
  skipSpeech() {
    const bl = this.speeches.filter(s => s.blocking);
    bl.forEach(s => this.endSpeech(s));
    return bl.length > 0;
  }
  isTalking(id) { return this.speeches.some(s => s.actor === id); }

  // ------------------------------------------------------------------ actors movement
  walkActor(id, x, y, opts = {}) {
    const a = this.actors[id];
    if (!a) { this.error('Actor desconocido: ' + id); return Promise.resolve(false); }
    if (a.walkResolve) { const r = a.walkResolve; a.walkResolve = null; r(false); }
    a.running = !!opts.run;                                       // scripted walks never run (only the double click)
    if (a.pose && a.pose !== 'de_pie') a.pose = undefined;      // quien anda se levanta (la pose automática vuelve en su sitio)
    const onRoom = this.room && a.room === this.room.def.id;
    let path = onRoom ? this.room.walk.findPath([a.x, a.y], [x, y]) : [[x, y]];
    if (!path.length) return Promise.resolve(true);
    if (this.instant || !onRoom) {
      const end = path[path.length - 1];
      const prev = path.length > 1 ? path[path.length - 2] : [a.x, a.y];
      this.setDirFromDelta(a, end[0] - prev[0], end[1] - prev[1]);
      a.x = end[0]; a.y = end[1]; a.path = []; a.anim = 'idle';
      return Promise.resolve(true);
    }
    a.path = path;
    return new Promise(res => { a.walkResolve = res; });
  }
  setDirFromDelta(a, dx, dy) {
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
    if (Math.abs(dx) >= Math.abs(dy) * 1.2) a.dir = dx < 0 ? 'left' : 'right';
    else a.dir = dy < 0 ? 'up' : 'down';
  }
  faceTowards(a, x, y) {
    const dx = x - a.x, dy = y - a.y;
    if (Math.abs(dx) >= Math.abs(dy) * 0.8) a.dir = dx < 0 ? 'left' : 'right';
    else a.dir = dy < 0 ? 'up' : 'down';
  }
  updateActors(dt) {
    if (!this.room) return;
    for (const a of Object.values(this.actors)) {
      if (a.room !== this.room.def.id) continue;
      if (a.path.length) {
        // a NPC walking under a non-blocking script waits while the player is aiming at something (critic §6.6)
        if (Mov.frozen(this, a)) { a.anim = 'idle'; continue; }
        const s = a.scale || this.roomScale(a.y, a.x);
        let step = a.speed * (a.running ? Mov.RUN_FACTOR : 1) * s * dt;
        while (step > 0 && a.path.length) {
          const [tx, ty] = a.path[0];
          const dx = tx - a.x, dy = ty - a.y;
          const dist = Math.hypot(dx, dy * 1.7);
          if (dist < 0.01) { a.path.shift(); continue; }
          this.setDirFromDelta(a, dx, dy);
          if (dist <= step) { a.x = tx; a.y = ty; a.path.shift(); step -= dist; a.walkDist += dist / s; }
          else { const k = step / dist; a.x += dx * k; a.y += dy * k; a.walkDist += step / s; step = 0; }
        }
        a.anim = 'walk';
        if (!a.path.length) {
          a.anim = 'idle'; a.running = false;
          if (a.walkResolve) { const r = a.walkResolve; a.walkResolve = null; r(true); }
        }
      } else if (a.custom && (a.custom.until === 0 || this.time < a.custom.until)) {
        a.anim = a.custom.name;
      } else {
        if (a.custom) a.custom = null;
        a.anim = this.isTalking(a.id) ? 'talk' : 'idle';
      }
    }
  }
  actorFrame(a) {
    const spr = this.spriteOf(a);
    const an = spr.anims && spr.anims[a.anim];
    if (a.anim === 'walk') return Math.floor(a.walkDist / 5) % ((an && an.frames) || 4);
    if (a.anim === 'talk') {
      const k = Math.floor(this.time / 110);
      return [0, 1, 2, 1, 0, 1, 1, 2, 0, 2][(k + a.id.length * 3) % 10] % ((an && an.frames) || 1);
    }
    if (a.anim === 'idle') {
      if (this.time > a.nextBlink + 150) a.nextBlink = this.time + rand(2500, 6000);
      return this.time > a.nextBlink && (an && an.frames > 1) ? 1 : 0;
    }
    const fps = (an && an.fps) || 6;
    return Math.floor(this.time / 1000 * fps) % ((an && an.frames) || 1);
  }
  actorBox(a) {
    const s = a.scale || this.roomScale(a.y, a.x);
    const sp = this.spriteOf(a);
    const hw = (sp.hitW || sp.w * 0.62) * s / 2;
    const pose = this.poseOf(a);
    if (pose) {                                    // sentado: la cabeza baja; tras la mesa, la caja acaba en la cintura
      const P = Pose.seat(sp);
      const top = a.y - (sp.oy - (sp.headY || 0) - P.drop) * s;
      const bottom = pose === 'tras_mesa' ? a.y - (sp.oy - P.hip - P.drop - 2) * s : a.y + 2;
      return { x: a.x - hw, y: top, w: hw * 2, h: Math.max(4, bottom - top), s, pose };
    }
    const top = a.y - (sp.oy - (sp.headY || 0)) * s;
    return { x: a.x - hw, y: top, w: hw * 2, h: a.y - top + 2, s };
  }
  /** Pose con la que se dibuja un actor: 'sentado' | 'tras_mesa' | null (de pie). Manda la pose explícita (api.pose);
   *  si no hay, la de su colocación en la sala (art `pose` en `at`/`positions`) mientras esté quieto en ese punto. */
  poseOf(a) {
    if (a.path && a.path.length) return null;
    if (a.pose === 'de_pie') return null;
    if (a.pose) return a.pose;
    if (!this.room || a.room !== this.room.def.id) return null;
    const p = this.placementOf(a.id);
    if (p && p.pose && Math.abs((p.x ?? -99) - a.x) < 2 && Math.abs((p.y ?? -99) - a.y) < 2) return p.pose;
    return null;
  }
  /** Exención de la penumbra (0 = se oscurece como el fondo, 1 = no se oscurece nada). */
  luzOf(a, P) {
    if (a.luz != null) return a.luz;
    const p = this.placementOf(a.id);
    if (p && p.luz != null) return p.luz;
    if (P && P.actores && P.actores[a.id] != null) return P.actores[a.id];
    return P && P.actor != null ? P.actor : 0.78;
  }

  // ------------------------------------------------------------------ targets & hover
  roomObjects() {
    if (!this.room) return [];
    return asArray(this.room.def.objects);
  }
  objectTarget(def) {
    const st = this.getObjState(def.id);
    return { kind: 'obj', id: def.id, def, name: this.nameOf(def, st), handlers: def.handlers || {}, st };
  }
  actorTarget(a) {
    const place = this.placementOf(a.id);
    return {
      kind: 'actor', id: a.id, def: { ...a.def, ...place }, actor: a, name: place.name || a.name,
      handlers: { ...(a.def.handlers || {}), ...(place.handlers || {}) },
    };
  }
  itemTarget(id) {
    const it = this.content.items[id];
    if (!it) return null;
    return { kind: 'inv', id, def: it, name: this.nameOf(it), handlers: it.handlers || {} };
  }
  nameOf(def, st) {
    try { return typeof def.name === 'function' ? def.name(this.viewFor(st)) : (def.name || def.id); } catch (e) { return def.id; }
  }
  hitObject(def, x, y) {
    const st = this.getObjState(def.id);
    if (!st.visible || def.hotspot === false) return false;
    if (def.poly) {
      let inside = false; const P = def.poly;
      for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
        const [xi, yi] = P[i], [xj, yj] = P[j];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    }
    return x >= def.x && x < def.x + def.w && y >= def.y && y < def.y + def.h;
  }
  pickAt(sx, sy) {
    if (!this.room || sy >= VIEW_H) return null;
    const x = sx + Math.round(this.camX), y = sy;
    // con un objeto «solo» en la mano (el móvil), Bruno gana a lo que tenga detrás: «Usar móvil con Bruno»
    if (this.ui.item && this.isSolo(this.ui.item) && this.player && this.player.visible) {
      const b = this.actorBox(this.player);
      if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) return this.actorTarget(this.player);
    }
    const acts = Object.values(this.actors).filter(a => a.room === this.room.def.id && a.visible && a.id !== this.G.player && a.def.hotspot !== false)
      .sort((a, b) => b.y - a.y);
    for (const a of acts) { const b = this.actorBox(a), m = a.path.length ? 4 : 0; if (x >= b.x - m && x < b.x + b.w + m && y >= b.y - m && y < b.y + b.h + m) return this.actorTarget(a); }
    const objs = this.roomObjects();
    let hits = objs.filter(o => this.hitObject(o, x, y));
    if (!hits.length) hits = this.slopHits(objs, x, y);
    if (!hits.length) {
      // the player is clickable (lowest priority) when its definition has handlers (e.g. "Mirar a Bruno")
      const p = this.player;
      if (p && p.visible && p.def.handlers && this.G.playerHotspot !== false && !this.busy) {
        const b = this.actorBox(p);
        if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h - 4) return this.actorTarget(p);
      }
      return null;
    }
    hits.sort((a, b) => (b.priority || 0) - (a.priority || 0) || objs.indexOf(b) - objs.indexOf(a));
    return this.objectTarget(hits[0]);
  }
  /** Tamaño mínimo efectivo de un hotspot (docs/GUIA_REDISENO.md): si un clic no cae en ningún objeto, los objetos
   *  pequeños crecen (centrados) hasta 12×10 px con ratón y 16×12 px al tacto; gana el centro más cercano. */
  slopHits(objs, x, y) {
    const touch = this.touchUI();
    const MW = touch ? 16 : 12, MH = touch ? 12 : 10;
    let best = null, bd = Infinity;
    for (const o of objs) {
      if (o.hotspot === false) continue;
      const b = Ver.bbox(o); if (!b) continue;
      if (b.w >= MW && b.h >= MH) continue;
      const w = Math.max(b.w, MW), h = Math.max(b.h, MH), cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      if (Math.abs(x - cx) > w / 2 || Math.abs(y - cy) > h / 2) continue;
      if (!this.getObjState(o.id).visible) continue;
      const d = Math.hypot(x - cx, y - cy);
      if (d < bd) { bd = d; best = o; }
    }
    return best ? [best] : [];
  }
  resolveTarget(id) {
    if (!id) return null;
    if (this.actors[id] && this.room && this.actors[id].room === this.room.def.id) return this.actorTarget(this.actors[id]);
    const f = this.findObjectDef(id);
    if (f && f.roomId === (this.room && this.room.def.id)) return this.objectTarget(f.def);
    if (this.content.items[id] && this.state.inventory.includes(id)) return this.itemTarget(id);
    if (f) return this.objectTarget(f.def);
    return null;
  }
  defaultVerbFor(t) {
    if (!t) return null;
    if (t.def.defaultVerb) return t.def.defaultVerb;
    if (t.kind === 'actor') return 'hablar';
    if (t.kind === 'inv') return this.isSolo(t.id) ? 'usar' : 'mirar';
    if (t.def.exit) return 'ir';
    return 'mirar';
  }
  /** Objeto de inventario que se usa SOLO (`solo: true` en items.js: el móvil, la libreta): «Usar» actúa ya, sin «con…»;
   *  «Usar X con Bruno», clic derecho y doble toque también lo abren. */
  isSolo(id) { const it = id && this.content.items[id]; return !!(it && it.solo); }
  verbLabel(id) {
    if (id === 'ir' || !id) return this.walkVerb.label;
    const v = this.verbs.find(v => v.id === id);
    return v ? v.label : id;
  }
  sentenceText() {
    if (this.ui.sentence) return this.ui.sentence;
    const h = this.ui.hover;
    const v = this.ui.verb;
    if (this.ui.item) {
      const it = this.content.items[this.ui.item];
      const prep = v === 'dar' ? (this.G.prepDar || 'a') : (this.G.prepUsar || 'con');
      return `${this.verbLabel(v)} ${it ? this.nameOf(it) : this.ui.item} ${prep}${h && h.id !== this.ui.item ? ' ' + h.name : ''}`;
    }
    if (!v && h && h.kind === 'inv') return `${this.verbLabel('usar')} ${h.name}`;
    return `${this.verbPhrase(v)}${h ? ' ' + h.name : ''}`;
  }
  /** Verb label plus its optional preposition (e.g. 'Hablar con'). */
  verbPhrase(id) {
    const v = this.verbs.find(v => v.id === id);
    return this.verbLabel(id) + (v && v.prep ? ' ' + v.prep : '');
  }
  composeSentence(verb, target, itemId) {
    if (itemId) {
      const it = this.content.items[itemId];
      const prep = verb === 'dar' ? (this.G.prepDar || 'a') : (this.G.prepUsar || 'con');
      return `${this.verbLabel(verb)} ${it ? this.nameOf(it) : itemId} ${prep} ${target.name}`;
    }
    return `${this.verbPhrase(verb)} ${target.name}`;
  }

  // ------------------------------------------------------------------ interactions
  approachPoint(t) {
    const d = t.def;
    if (t.kind === 'actor') {
      const a = t.actor;
      if (d.walkTo) return { x: d.walkTo[0], y: d.walkTo[1], face: d.face };
      const side = this.player.x < a.x ? -1 : 1;
      return { x: a.x + side * 22 * this.roomScale(a.y, a.x), y: a.y + 1, faceTo: [a.x, a.y] };
    }
    if (d.walkTo) return { x: d.walkTo[0], y: d.walkTo[1], face: d.face || (d.walkTo[2]) };
    let cx, cy;
    if (d.poly) { cx = d.poly.reduce((s, p) => s + p[0], 0) / d.poly.length; cy = Math.max(...d.poly.map(p => p[1])); }
    else { cx = d.x + d.w / 2; cy = d.y + d.h; }
    const [nx, ny] = this.room.walk.nearest(cx, cy + 4);
    return { x: nx, y: ny, face: d.face, faceTo: [cx, cy - 10] };
  }
  needsWalk(verb, t) {
    if (!t || t.kind === 'inv') return false;
    if (t.kind === 'actor' && t.id === this.G.player) return false;
    if (t.def.walk === false) return false;
    const nw = this.G.noWalkVerbs || [];
    return !nw.includes(verb);
  }
  /** Execute verb on target (optionally with inventory item). Resolves when done (false if cancelled). */
  async execute(verb, target, itemId = null) {
    if (this.busy || this.mode !== 'play') return false;
    // un objeto que se usa solo, «usado con» el propio Bruno, es usarlo (el gesto natural: «Usar móvil con Bruno»)
    if (itemId && verb === 'usar' && this.isSolo(itemId) && target && target.id === this.G.player) { target = this.itemTarget(itemId); itemId = null; }
    this.acting = (this.acting || 0) + 1;
    const gen = this.gen;
    try { return await this.executeInner(verb, target, itemId); }
    finally { if (gen === this.gen) this.acting = Math.max(0, this.acting - 1); this.checkIdle(); }
  }
  async executeInner(verb, target, itemId) {
    const token = ++this.actionToken;
    this.ui.sentence = this.composeSentence(verb, target, itemId);
    this.ui.verb = null; this.ui.item = null;
    const p = this.player;
    if (this.needsWalk(verb, target)) {
      const ap = this.approachPoint(target);
      const ok = await this.walkActor(p.id, ap.x, ap.y);
      if (!ok || token !== this.actionToken) { if (token === this.actionToken) this.ui.sentence = null; return false; }
      if (ap.face) p.dir = ap.face; else if (ap.faceTo) this.faceTowards(p, ap.faceTo[0], ap.faceTo[1]);
    }
    if (token !== this.actionToken) return false;
    await this.runInteraction(verb, target, itemId);
    if (token === this.actionToken) this.ui.sentence = null;
    return true;
  }
  cancelAction() {
    this.actionToken++;
    this.ui.sentence = null;
  }
  toScript(h, t) {
    if (h == null) return null;
    if (typeof h === 'function') return h;
    const fill = s => String(s).replace(/\{obj\}/g, t ? t.name : '').replace(/\{name\}/g, t ? t.name : '');
    if (Array.isArray(h)) return api => api.say(fill(h[Math.floor(Math.random() * h.length)]));
    if (typeof h === 'string') return api => api.say(fill(h));
    if (typeof h === 'object' && h.say) return api => api.say(fill(h.say));
    return null;
  }
  findHandler(verb, t, itemId) {
    const C = this.content;
    const cands = [];
    const th = t.handlers || {};
    if (itemId) {
      cands.push(th[verb + ':' + itemId]);
      const it = C.items[itemId];
      if (it && it.handlers) cands.push(it.handlers[verb + ':' + t.id]);
      if (t.kind === 'inv' && verb === 'usar') {
        cands.push(it && it.combine && it.combine[t.id]);
        cands.push(t.def.combine && t.def.combine[itemId]);
      }
      cands.push(th[verb + ':*']);
      if (it && it.handlers) cands.push(it.handlers[verb + ':*']);
    } else {
      cands.push(th[verb]);
      if (verb === 'mirar' && t.def.desc) cands.push(t.def.desc);
      if (verb === 'coger' && t.def.pickup) cands.push(this.pickupScript(t));
      if (verb === 'ir' && t.def.exit) cands.push(async api => { if (t.def.exit.sfx) api.sfx(t.def.exit.sfx); await api.goto(t.def.exit.room, t.def.exit.entry); });
    }
    if (verb !== 'ir') cands.push(th['*']);
    for (const c of cands) { const s = this.toScript(c, t); if (s) { if (itemId) this.comboFails = 0; return s; } }
    if (verb === 'ir') return null;
    if (itemId) this.comboFails++;
    const rd = (this.room && this.room.def.defaults) || {};
    const gd = this.G.defaults || {};
    const key = itemId && t.kind === 'inv' && verb === 'usar' ? 'combine' : verb;
    for (const c of [rd[key], rd['*'], gd[key], key === 'combine' ? gd.usar : null, gd['*']]) {
      const s = this.toScript(c, t); if (s) return s;
    }
    return api => api.say('...');
  }
  pickupScript(t) {
    return async api => {
      await api.anim(this.G.player, 'reach', 350);
      api.give(t.def.pickup);
      api.hide(t.id);
      api.sfx('pickup');
      if (t.def.pickupText) await api.say(t.def.pickupText);
    };
  }
  async runInteraction(verb, target, itemId) {
    const h = this.findHandler(verb, target, itemId);
    if (!h) return;
    await this.runScript(h, { verb, target, item: itemId, label: `${verb}${itemId ? ':' + itemId : ''} → ${target.id}` });
  }
  /** Run a script function with the script API. blocking scripts lock input. */
  async runScript(fn, ctx = {}) {
    const blocking = ctx.blocking !== false;
    if (blocking) this.busy++;
    const gen = this.gen;
    const api = makeApi(this, ctx);
    try { await fn(api); }
    catch (e) {
      this.error(`Error en script [${ctx.label || '?'}]: ${e && e.message}`, e);
      if (blocking) this.speeches.filter(s => s.blocking).forEach(s => this.endSpeech(s));
    } finally {
      if (this.phone && (this.phone.owner === ctx || (blocking && this.busy <= 1))) Phone.kill(this);   // nunca queda el móvil colgado
      if (this.detalle && (this.detalle.owner === ctx || (blocking && this.busy <= 1))) Detalle.close(this);   // ni el plano detalle
      if (blocking && this.busy <= 1) for (const a of Object.values(this.actors)) if (a.hold && a.hold.owner) a.hold = null;
      if (blocking && gen === this.gen) {
        this.busy = Math.max(0, this.busy - 1);
        if (!this.busy) { this.cutscene = 0; this.skipCut = false; this.ui.sentence = null; this.applyPresence(); }
      }
      if (blocking) this.idleMs = 0;
      this.checkIdle();
    }
    return api;
  }
  /** Show options in the panel. Each option is a string or { text, disabled } (disabled = grey, not selectable). */
  choose(options, opts = {}) {
    if (this.choice) { this.choice.resolve(-1); }
    return new Promise(res => {
      const texts = options.map(o => (o && typeof o === 'object') ? String(o.text) : String(o));
      const disabled = new Set(options.map((o, i) => (o && typeof o === 'object' && o.disabled) ? i : -1).filter(i => i >= 0));
      // `escape`: la opción que eligen Esc y un toque en la sala (fuera del panel y del móvil); `t0`: los toques de los
      // primeros 250 ms no cuentan (el segundo toque de un doble toque no elige una opción por accidente)
      const escape = Number.isInteger(opts.escape) ? opts.escape : null;
      this.choice = { options: texts, disabled, escape, compact: !!opts.duel, t0: this.realTime, resolve: i => { this.choice = null; res(i); this.checkIdle(); }, scroll: 0, hover: -1 };
      this.checkIdle();
    });
  }
  /** Let the player pick an inventory item in the panel (duel finishers). Resolves with an item id or null (back). */
  pickItem(prompt) {
    if (this.itemPick) { const r = this.itemPick.resolve; this.itemPick = null; r(null); }
    return new Promise(res => {
      this.itemPick = { prompt: prompt || 'Usar objeto:', resolve: id => { this.itemPick = null; res(id); this.checkIdle(); } };
      this.checkIdle();
    });
  }
  dialog(id, node, api) { return runDialog(this, api, id, node); }
  duel(id, api) { return runDuel(this, api, id); }
  checkIdle() {
    const free = !this.busy && !this.acting;
    const ch = this.choice || this.itemPick;
    if (!free && !ch) return;
    const w = this.idleWaiters; this.idleWaiters = [];
    for (const x of w) {
      if (free || (x.choiceOk && ch)) x.resolve();
      else this.idleWaiters.push(x);
    }
  }
  waitIdle(choiceOk = false) {
    return new Promise(resolve => { this.idleWaiters.push({ resolve, choiceOk }); this.checkIdle(); });
  }

  // ------------------------------------------------------------------ loop
  frame(ts) {
    const dt = Math.min(0.05, Math.max(0, (ts - this.last) / 1000));
    this.last = ts;
    this.realTime += dt * 1000;
    try {
      if (!this.menu) this.update(dt);
      this.render();
    } catch (e) { this.error('Error en el bucle: ' + e.message, e); }
    requestAnimationFrame(t => this.frame(t));
  }
  update(dt) {
    this.time += dt * 1000;
    if (this.state && this.mode === 'play') this.state.playTime += dt;
    // timers
    if (this.timers.length) {
      const due = this.timers.filter(t => t.at <= this.time);
      if (due.length) { this.timers = this.timers.filter(t => t.at > this.time); due.forEach(t => t.resolve()); }
    }
    // fades
    for (const f of this.fades.slice()) {
      const k = Math.min(1, (this.time - f.start) / f.ms);
      this.fadeLevel = f.from + (f.to - f.from) * k;
      if (k >= 1) { this.fades.splice(this.fades.indexOf(f), 1); f.resolve(); }
    }
    for (const s of this.speeches.slice()) if (this.time >= s.end) this.endSpeech(s);
    if (this.mode === 'play' && this.room) {
      this.updateActors(dt);
      // camera
      const W = this.room.width;
      let target = this.camX;
      if (this.camTarget != null) target = this.camTarget;
      else if (this.camFollow && this.actors[this.camFollow]) {
        const a = this.actors[this.camFollow];
        const sx = a.x - this.camX;
        if (sx < 110 || sx > 210) target = a.x - SCREEN_W / 2;
        if (a.path.length) target = a.x - SCREEN_W / 2 + (a.dir === 'left' ? -30 : a.dir === 'right' ? 30 : 0);
      }
      target = Math.max(0, Math.min(W - SCREEN_W, target));
      this.camX += (target - this.camX) * Math.min(1, dt * 3.2);
      if (Math.abs(target - this.camX) < 0.3) this.camX = target;
      // ambient: one shared scheduler (engine/efectos.js) — never over a balloon, menu, notice, phone or close-up;
      // 60-120 s between interventions; at most 3 per visit (room `ambientRules: { every, max, first }`)
      Fx.updateAmbient(this);
      Mov.update(this, dt);
      if (this.room.def.update) { try { this.room.def.update(makeApi(this, { label: 'update' }), dt); } catch (e) { this.error('update() falló', e); this.room.def.update = null; } }
      this.updateIdle(dt);
    }
    if (this.mode === 'ending') Screens.updateEnding(this, dt);
  }
  /** Inactivity line (game.idle) and NPC murmurs (actor/object `murmurs`: on hover 0.7 s, or after 20 s still). */
  updateIdle(dt) {
    const quiet = !this.busy && !this.acting && !this.choice && !this.itemPick && !this.inDialog && !this.cutscene && !this.fast;
    if (!quiet) { this.murmur.hoverMs = 0; return; }
    this.idleMs += dt * 1000;
    const I = this.G.idle;
    if (I && I.run && !this.idleFired && this.idleMs >= (I.ms || 60000)) { this.idleFired = true; this.runScript(I.run, { label: 'idle' }); return; }
    const M = this.murmur;
    const h = this.ui.hover;
    if (h && h.kind !== 'inv' && h.id !== this.G.player) {
      if (M.hoverId !== h.id) { M.hoverId = h.id; M.hoverMs = 0; }
      M.hoverMs += dt * 1000;
      if (M.hoverMs > 700) { M.hoverMs = -1e9; this.playMurmur(h); }
    } else { M.hoverId = null; M.hoverMs = 0; }
    M.stillMs += dt * 1000;
    if (M.stillMs > (this.G.murmurAfterMs || 20000)) {
      M.stillMs = 0;
      // the room placement may carry its own murmurs (actorTarget merges definition + placement)
      const cands = Object.values(this.actors).filter(a => a.room === this.room.def.id && a.visible && a.id !== this.G.player)
        .map(a => this.actorTarget(a)).filter(t => this.murmurLines(t.def).length)
        .concat(this.roomObjects().filter(o => o.murmurs && this.getObjState(o.id).visible).map(o => this.objectTarget(o)));
      if (cands.length) this.playMurmur(cands[Math.floor(Math.random() * cands.length)]);
    }
  }
  murmurLines(def) {
    let m = def && def.murmurs;
    try { if (typeof m === 'function') m = m(this.viewFor()); } catch (e) { m = null; }
    return Array.isArray(m) ? m : [];
  }
  playMurmur(t) {
    const lines = this.murmurLines(t.def);
    if (!lines.length) return;
    const M = this.murmur;
    if (this.realTime - (M.last[t.id] || -1e9) < 9000) return;
    if (!Fx.quiet(this)) return;
    M.last[t.id] = this.realTime;
    M.idx = M.idx || {};
    const i = (M.idx[t.id] = ((M.idx[t.id] ?? -1) + 1)) % lines.length;
    if (t.kind === 'actor') this.speak(t.id, lines[i], { blocking: false, ambient: true });
    else {
      const d = t.def;
      const cx = d.poly ? d.poly.reduce((s, p) => s + p[0], 0) / d.poly.length : d.x + d.w / 2;
      const top = d.poly ? Math.min(...d.poly.map(p => p[1])) : d.y;
      this.speak(null, lines[i], { blocking: false, ambient: true, at: [cx, top - 2], color: d.murmurColor || '#c8c4d8', who: t.id });
    }
  }
  inputActivity() { this.idleMs = 0; this.idleFired = false; this.murmur.stillMs = 0; }
  /** Evaluate a condition: function(api) | 'flag' | '!flag' | 'has:item' | '!has:item' | array (all). */
  cond(c, api) {
    if (c == null) return true;
    if (typeof c === 'function') return !!c(api);
    if (Array.isArray(c)) return c.every(x => this.cond(x, api));
    let s = String(c).trim(), neg = false;
    if (s[0] === '!') { neg = true; s = s.slice(1); }
    let v;
    if (s.startsWith('has:')) v = this.state.inventory.includes(s.slice(4));
    else if (s.includes('=')) { const [k, val] = s.split('='); this.checkFlag(k.trim(), 'condición'); v = String(this.state.flags[k.trim()]) === val.trim(); }
    else { this.checkFlag(s, 'condición'); v = !!this.state.flags[s]; }
    return neg ? !v : v;
  }

  // ------------------------------------------------------------------ render
  render() {
    const g = this.ctx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = '#000'; g.fillRect(0, 0, SCREEN_W, SCREEN_H);
    if (this.mode === 'title') Screens.drawTitle(this, g);
    else if (this.mode === 'ending') Screens.drawEnding(this, g);
    else if (this.room) {
      this.renderRoom(g);
      UI.drawPanel(this, g);
    }
    if (this.card) { try { Fx.drawCard(this, g); } catch (e) { this.error('tarjeta falló', e); } }
    if (this.menu) Screens.drawMenu(this, g);
    if (this.iosHelp) Screens.drawIosHelp(this, g);
    this.debug.draw(g);
    if (this.toast && this.realTime < this.toast.until && this.debug.on) {
      const lines = wrap(this.toast.text, 300);
      g.fillStyle = 'rgba(80,0,0,0.85)'; g.fillRect(0, 0, SCREEN_W, lines.length * 11 + 4);
      lines.forEach((l, i) => drawText(g, l, 4, 2 + i * 11, '#ffd0d0'));
    }
    UI.drawCursor(this, g);
    // blit
    const d = this.dctx;
    d.imageSmoothingEnabled = false;
    d.drawImage(this.buf, 0, 0, this.display.width, this.display.height);
  }
  renderRoom(g) {
    const rt = this.room;
    if (rt.dirty) this.paintRoom();
    let ox = 0, oy = 0;
    if (this.time < this.shakeUntil) { ox = Math.round(rand(-this.shakeAmp, this.shakeAmp)); oy = Math.round(rand(-this.shakeAmp, this.shakeAmp)); }
    const cam = Math.round(this.camX);
    g.save();
    g.beginPath(); g.rect(0, 0, SCREEN_W, VIEW_H); g.clip();
    g.drawImage(rt.bg, cam, 0, SCREEN_W, VIEW_H, ox, oy, SCREEN_W, VIEW_H);
    g.translate(-cam + ox, oy);
    const view = this.viewFor();
    const safe = (fn, label) => { try { fn(); } catch (e) { this.error(label + ' falló: ' + e.message, e); } };
    if (rt.def.animate) safe(() => rt.def.animate(g, view, this.time), 'animate()');
    const objs = this.roomObjects();
    const sorted = [];
    // fuera de cámara no se pinta (salas anchas: la Redacción mide 1270 px; margen de 64 px para lo que se sale de su caja)
    const cull = (o) => o.x != null && o.w != null && (o.x + o.w + 64 < cam || o.x - 64 > cam + SCREEN_W);
    for (const o of objs) {
      if (!o.draw) continue;
      if (cull(o)) continue;
      const st = this.getObjState(o.id);
      // `prop: true` (art key): the drawing is FURNITURE that hides actors' legs (a counter, a desk, a table): it is
      // painted even while its hotspot is hidden / its `when` is false (then it is just not clickable). The draw
      // function gets view.visible === false and may skip the small, takeable part.
      if (!st.visible && !o.prop) continue;
      const layer = o.layer || 'back';
      const fn = () => this.drawObject(g, o, st);
      if (layer === 'back') safe(fn, `draw() de ${o.id}`);
      else if (layer === 'sorted') sorted.push({ z: o.zy ?? ((o.y || 0) + (o.h || 0)), fn, label: o.id });
    }
    for (const a of Object.values(this.actors)) {
      if (a.room !== rt.def.id || !a.visible) continue;
      if (a.x + 48 < cam || a.x - 48 > cam + SCREEN_W) continue;
      sorted.push({ z: a.y, fn: () => this.drawActor(g, a), label: a.id });
    }
    sorted.sort((a, b) => a.z - b.z);
    for (const s of sorted) safe(s.fn, 'dibujo ' + s.label);
    if (rt.fg) g.drawImage(rt.fg, 0, 0);
    if (rt.def.penumbra) safe(() => this.drawPenumbra(g, view, cam), 'penumbra()');
    if (rt.def.overlay) safe(() => rt.def.overlay(g, view, this.time), 'overlay()');
    for (const o of objs) {
      if (!o.draw || o.layer !== 'front') continue;
      const st = this.getObjState(o.id);
      if (st.visible) safe(() => this.drawObject(g, o, st), `draw() de ${o.id}`);
    }
    if (this.apagon) safe(() => Fx.drawApagon(this, g, cam), 'apagón');
    if (Ver.active(this)) safe(() => Ver.draw(this, g, cam), 'ver hotspots');
    this.debug.drawRoom(g);
    g.restore();
    // fade (room viewport only)
    if (this.fadeLevel > 0) {
      g.fillStyle = '#000';
      if (this.fadeLevel >= 0.999) g.fillRect(0, 0, SCREEN_W, VIEW_H);
      else {
        // dithered fade
        const lv = this.fadeLevel;
        for (let y = 0; y < VIEW_H; y++) for (let x = 0; x < SCREEN_W; x += 1) {
          if (((x & 3) * 4 + (y & 3) + 0.5) / 16 < lv) g.fillRect(x, y, 1, 1);
        }
      }
    }
    if (this.hud) safe(() => this.hud(g), 'hud');
    if (this.phone) safe(() => Phone.draw(g, this), 'móvil');
    if (this.detalle) safe(() => Detalle.draw(g, this), 'plano detalle');
    if (this.burst) safe(() => Fx.drawBurst(this, g), 'notificaciones');
    this.drawSpeech(g, cam);
    this.drawNotices(g);
  }
  drawNotices(g) {
    this.notices = this.notices.filter(n => this.realTime < n.until);
    this.notices.forEach((n, i) => {
      const w = measure(n.text) + 12, x = Math.round(160 - w / 2), y = 128 - i * 14;
      g.save(); g.globalAlpha = 0.82; g.fillStyle = '#08060e'; g.fillRect(x, y, w, 13); g.restore();
      g.fillStyle = n.color; g.fillRect(x, y, w, 1); g.fillRect(x, y + 12, w, 1);
      drawText(g, n.text, 160, y + 1, n.color, { align: 'center' });
    });
  }
  /** Draw an object; objects with cache:true are rendered once per state into an offscreen canvas. */
  drawObject(g, o, st) {
    if (!o.cache) { o.draw(g, this.viewFor(st), this.time); return; }
    const pad = o.cachePad ?? 16;
    const key = String(st.state) + '|' + (this.room.paintId || 0);
    this.objCache = this.objCache || new Map();
    const ck = this.room.def.id + '.' + o.id;
    let c = this.objCache.get(ck);
    if (!c || c.key !== key) {
      const cv = document.createElement('canvas');
      cv.width = o.w + pad * 2; cv.height = o.h + pad * 2;
      const cg = cv.getContext('2d');
      cg.translate(-o.x + pad, -o.y + pad);
      o.draw(cg, this.viewFor(st), 0);
      c = { key, cv };
      this.objCache.set(ck, c);
    }
    g.drawImage(c.cv, o.x - pad, o.y - pad);
  }
  drawActor(g, a, mask = false) {
    const s = a.scale || this.roomScale(a.y, a.x);
    const sp = this.spriteOf(a);
    const pose = this.poseOf(a);
    if (!mask && sp.shadow !== false && pose !== 'tras_mesa') shadowEllipse(g, Math.round(a.x), Math.round(a.y), Math.max(3, 8 * s), Math.max(1.2, 2.2 * s), 0.55);
    const fr = this.actorFrame(a);
    const { canvas, flip } = getFrame(sp, a.anim, a.dir, fr);
    const dw = Math.round(canvas.width * s), dh = Math.round(canvas.height * s);
    const bob = a.running && a.anim === 'walk' && !mask && fr % 2 ? Math.max(1, Math.round(s)) : 0;   // carrera: saltito al paso
    const dx = Math.round(a.x - (sp.ox + 1) * s), dy = Math.round(a.y - (sp.oy + 1) * s) - bob;
    if (flip) { g.save(); g.translate(Math.round(a.x) * 2, 0); g.scale(-1, 1); }
    if (pose) Pose.drawPosed(g, sp, canvas, dx, dy, s, pose, a.dir);
    else g.drawImage(canvas, dx, dy, dw, dh);
    if (flip) g.restore();
    if (a.hold) Pose.drawHold(g, this, a, sp, s, pose);
    if (this.phone && this.phone.ear && a.id === this.G.player) Phone.drawEar(g, this, a, this.actorBox(a));
    if (a.def.drawExtra) a.def.drawExtra(g, a, this.time, { s, box: this.actorBox(a), sprite: sp, pose });
  }
  /** PENUMBRA (art `penumbra(view, t) → { color, alpha, spots, actor, actores } | null`): oscurece la sala por encima de
   *  todo (fondo, muebles, primer plano) MENOS los focos (`spots`: [cx, cy, rx, ry] elipses o { rect: [x, y, w, h] }) y
   *  los actores, que por defecto solo reciben el 22 % de la penumbra (`actor: 0.78` de exención; por actor con
   *  `actores: { id: k }`, la colocación `luz: k` o api.luz(id, k)). Así ningún personaje queda «holograma». */
  drawPenumbra(g, view, cam) {
    let P = null;
    try { P = this.room.def.penumbra(view, this.time); } catch (e) { this.error('penumbra() falló: ' + e.message, e); this.room.def.penumbra = null; return; }
    if (!P) return;
    this.drawShade(g, cam, P);
  }
  /** Darkens the room view with P = { color, alpha, spots, actor, actores, borde } (penumbra and api.apagon). */
  drawShade(g, cam, P) {
    const c = this.penCanvas || (this.penCanvas = document.createElement('canvas'));
    if (c.width !== SCREEN_W || c.height !== VIEW_H) { c.width = SCREEN_W; c.height = VIEW_H; }
    const m = c.getContext('2d');
    m.setTransform(1, 0, 0, 1, 0, 0); m.globalCompositeOperation = 'source-over'; m.globalAlpha = 1;
    m.clearRect(0, 0, SCREEN_W, VIEW_H);
    m.globalAlpha = P.alpha ?? 0.45; m.fillStyle = P.color || '#080c24'; m.fillRect(0, 0, SCREEN_W, VIEW_H);
    m.translate(-cam, 0);
    m.globalCompositeOperation = 'destination-out';
    const edge = P.borde ?? 0.55;
    for (const sp of P.spots || []) {
      if (sp.rect) { m.globalAlpha = sp.k ?? 1; m.fillStyle = '#000'; m.fillRect(sp.rect[0], sp.rect[1], sp.rect[2], sp.rect[3]); continue; }
      const [cx, cy, rx, ry, k = 1] = sp;
      for (const [f, al] of [[1, edge * k], [0.72, k]]) {
        m.globalAlpha = al; m.fillStyle = '#000';
        m.beginPath(); m.ellipse(cx, cy, Math.max(1, rx * f), Math.max(1, ry * f), 0, 0, Math.PI * 2); m.fill();
      }
    }
    const rid = this.room.def.id;
    for (const a of Object.values(this.actors)) {
      if (a.room !== rid || !a.visible) continue;
      const k = Math.max(0, Math.min(1, this.luzOf(a, P)));
      if (k <= 0) continue;
      m.globalAlpha = k;
      this.drawActor(m, a, true);
    }
    m.setTransform(1, 0, 0, 1, 0, 0); m.globalCompositeOperation = 'source-over'; m.globalAlpha = 1;
    g.drawImage(c, cam, 0);
  }
  drawSpeech(g, cam) {
    for (const sp of this.speeches) {
      if (sp.style === 'titular') { Fx.drawTitular(this, g, sp); continue; }
      let cx, bottom;
      const a = sp.actor && this.actors[sp.actor];
      if (sp.at) { cx = Math.round(sp.at[0] - cam); bottom = Math.round(sp.at[1]); }
      else if (a && this.room && a.room === this.room.def.id && a.visible) {
        const b = this.actorBox(a);
        cx = Math.round(a.x - cam);
        bottom = Math.round(b.y) - 3;
      } else { cx = SCREEN_W / 2; bottom = 18 + sp.lines.length * LINE_H; }
      const w = Math.max(...sp.lines.map(l => measure(l)));
      const [fLo, fHi] = this.phone && !sp.phone ? Phone.freeRange(this) : [3, SCREEN_W - 3];   // con el móvil abierto, los demás hablan en el hueco libre
      cx = Math.max(fLo + w / 2, Math.min(fHi - w / 2, cx));
      let top = bottom - sp.lines.length * LINE_H;
      const minTop = (this.hud || this.detalle) ? Math.max(2, this.hudTop) : 2;
      if (top < minTop) top = minTop;
      if (sp.tag && top < minTop + 12) top = minTop + 12;
      // legibilidad (problema 5): bajo cada línea, una banda oscura translúcida pegada al texto (el contorno negro de
      // 8 vecinos sigue ahí). Así el texto de color se lee sobre fondos claros (planta 2 lila) y oscuros (CPD).
      const SB = this.G.speechBacking === undefined ? SPEECH_BACKING : this.G.speechBacking;
      if (SB) {
        g.save(); g.globalAlpha = SB.alpha; g.fillStyle = SB.color;
        sp.lines.forEach((l, i) => { const lw = measure(l) + 6; g.fillRect(Math.round(cx - lw / 2), top + i * LINE_H - 2, lw, LINE_H + 1); });
        g.restore();
      }
      if (sp.tag) { const tw = measure(sp.tag) + 6; g.save(); g.globalAlpha = 0.9; g.fillStyle = '#06050c'; g.fillRect(Math.round(cx - tw / 2), top - 12, tw, 10); g.restore(); drawText(g, sp.tag, cx, top - 13, sp.color, { align: 'center' }); }   // «MEGAFONÍA» (api.megafonia)
      if (sp.tail) this.drawTail(g, sp, cx, top, w);
      sp.lines.forEach((l, i) => drawText(g, l, cx, top + i * LINE_H, sp.color, { align: 'center' }));
    }
  }

  /** Globo del móvil: marco del color de quien habla + piquito que apunta al retrato (se ve de quién sale la voz). */
  drawTail(g, sp, cx, top, w) {
    const x0 = Math.round(cx - w / 2) - 4, x1 = Math.round(cx + w / 2) + 4, y0 = top - 3, y1 = top + sp.lines.length * LINE_H;
    const [tx, ty] = sp.tail;
    g.fillStyle = sp.color;
    g.fillRect(x0, y0, x1 - x0, 1); g.fillRect(x0, y1, x1 - x0, 1); g.fillRect(x0, y0, 1, y1 - y0); g.fillRect(x1 - 1, y0, 1, y1 - y0 + 1);
    const fromRight = tx > cx, ax = fromRight ? x1 - 1 : x0, ay = y1;
    // piquito escalonado desde la esquina inferior hasta el móvil
    const n = Math.max(2, Math.floor(Math.abs(tx - ax) / 2));
    for (let i = 0; i <= n; i++) {
      const k = i / n, x = Math.round(ax + (tx - ax) * k), y = Math.round(ay + (ty - ay) * k), th = Math.max(1, Math.round(5 * (1 - k)));
      g.save(); g.globalAlpha = 0.8; g.fillStyle = '#06050c'; g.fillRect(x - (fromRight ? th : 0), y - 1, th, th); g.restore();
      g.fillStyle = sp.color; g.fillRect(x, y + th - 1, 1, 1);
      g.fillRect(x - (fromRight ? th : 0), y - 1, 1, 1);
    }
  }

  // ------------------------------------------------------------------ input
  /** Tamaño del lienzo: la mayor escala nítida que cabe en el área útil (descontando las zonas seguras del notch y la
   *  barra de inicio, que el CSS pone como relleno de #stage). En escritorio y pantallas de 1x, escala entera; en
   *  pantallas táctiles de alta densidad (iPhone), ocupa todo el alto/ancho disponible con píxeles «nearest» (a 3x de
   *  densidad la diferencia entre 5 y 6 píxeles físicos no se ve, y la escala entera dejaba un 15 % de pantalla negra). */
  resize() {
    const dpr = window.devicePixelRatio || 1;
    const stage = this.display.parentElement;
    let W = window.innerWidth, H = window.innerHeight;
    if (window.visualViewport) { W = Math.min(W, window.visualViewport.width); H = Math.min(H, window.visualViewport.height); }
    if (stage && window.getComputedStyle) {
      const cs = window.getComputedStyle(stage);
      W -= (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      H -= (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    }
    W = Math.max(1, W); H = Math.max(1, H);
    const devW = W * dpr, devH = H * dpr;
    const fit = Math.min(devW / SCREEN_W, devH / SCREEN_H);
    const coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    let s = Math.floor(fit);
    let cw, ch;
    if (s >= 1 && !(coarse && dpr >= 2 && s / fit < 0.97)) { cw = SCREEN_W * s; ch = SCREEN_H * s; }
    else { cw = Math.floor(SCREEN_W * fit); ch = Math.floor(SCREEN_H * fit); }
    if (this.display.width !== cw || this.display.height !== ch) { this.display.width = cw; this.display.height = ch; }
    this.display.style.width = (cw / dpr) + 'px';
    this.display.style.height = (ch / dpr) + 'px';
    updateRotateHint();
  }
  toVirtual(e) {
    const r = this.display.getBoundingClientRect();
    return { x: Math.floor((e.clientX - r.left) / r.width * SCREEN_W), y: Math.floor((e.clientY - r.top) / r.height * SCREEN_H) };
  }
  /** Convert virtual (320x200) coords to page client coords (for automated clicking). */
  toClient(x, y) {
    const r = this.display.getBoundingClientRect();
    return { x: r.left + (x + 0.5) / SCREEN_W * r.width, y: r.top + (y + 0.5) / SCREEN_H * r.height };
  }
  bindInput() {
    const c = this.display;
    c.addEventListener('contextmenu', e => e.preventDefault());
    c.addEventListener('pointermove', e => {
      const p = this.toVirtual(e);
      if (p.x !== this.mouse.x || p.y !== this.mouse.y) this.inputActivity();
      this.mouse.x = p.x; this.mouse.y = p.y; this.mouse.inside = true;
      this.mouse.touch = e.pointerType === 'touch';
      this.updateHover();
      if (this.longPress && Math.hypot(e.clientX - this.longPress.cx, e.clientY - this.longPress.cy) > 12) {
        clearTimeout(this.longPress.timer); this.longPress = null;
        Mov.holdStart(this, 'touch', true);                          // a finger dragged on the floor: Bruno follows it
      }
    });
    c.addEventListener('pointerleave', () => { this.mouse.inside = false; this.ui.hover = null; Mov.holdEnd(this); });
    c.addEventListener('pointerdown', e => {
      e.preventDefault();
      this.audio.unlock();
      this.inputActivity();
      const p = this.toVirtual(e);
      this.mouse.x = p.x; this.mouse.y = p.y; this.mouse.inside = true;
      this.mouse.touch = e.pointerType === 'touch';
      this.updateHover();
      if (e.pointerType === 'touch') {
        const lp = { cx: e.clientX, cy: e.clientY, fired: false };
        // pulsación larga: verbo por defecto sobre un objeto; en una zona vacía de la sala, «ver hotspots»
        lp.timer = setTimeout(() => {
          lp.fired = true;
          if (this.mode === 'play' && !this.menu && !this.busy && !this.choice && !this.itemPick && p.y < VIEW_H && !this.pickAt(p.x, p.y)) this.showHotspots();
          else this.click(p.x, p.y, 2);
        }, 550);
        this.longPress = lp;
        return;
      }
      this.click(p.x, p.y, e.button === 2 ? 2 : 0);
      if (e.button === 0) Mov.holdStart(this, e.pointerType || 'mouse');      // holding the button keeps walking
    });
    c.addEventListener('pointerup', e => {
      Mov.holdEnd(this);
      if (e.pointerType === 'touch' && this.longPress) {
        clearTimeout(this.longPress.timer);
        const lp = this.longPress; this.longPress = null;
        if (!lp.fired) { const p = this.toVirtual(e); this.click(p.x, p.y, 0); }
      }
    });
    window.addEventListener('keydown', e => {
      this.audio.unlock();
      this.inputActivity();
      if (this.debug.consoleFocused()) return;
      if (e.key === 'Escape') {
        if (this.choice && this.choice.escape != null && !this.menu) { this.choice.resolve(this.choice.escape); e.preventDefault(); return; }
        if (this.cutscene > 0 && !this.choice) { this.skipCutscene(); e.preventDefault(); return; }
        if (this.mode === 'play' || this.menu) { this.toggleMenu(); e.preventDefault(); }
        return;
      }
      if (e.key === '.' || e.key === 'Enter') { if (this.busy && !this.skipSpeech() && this.detalle) Detalle.skip(this); return; }
      if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey && !e.altKey) { this.showHotspots(); return; }
      if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); if (!e.repeat) this.showHotspots(0, true); return; }
      if (e.key === 'F5') { e.preventDefault(); if (this.mode === 'play') this.toggleMenu(); return; }
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) { toggleFullscreen(this); return; }
      if (this.choice && /^[1-9]$/.test(e.key)) { const i = +e.key - 1; if (i < this.choice.options.length && !this.choice.disabled.has(i)) this.choice.resolve(i); return; }
      if (this.itemPick && (e.key === 'Backspace')) { this.itemPick.resolve(null); return; }
      this.debug.key(e);
    });
    window.addEventListener('keyup', e => { if (e.key === ' ' || e.code === 'Space') this.hsHold = false; });
  }
  /** Interfaz táctil (filas de diálogo de 14 px, márgenes de toque de 16×12): último puntero táctil o pantalla «coarse». */
  touchUI() { return !!(this.mouse.touch || this.coarse); }
  /** «Ver hotspots» (D7): resalta con el canto vivo y el nombre todo lo interactivo de la sala durante `ms` (1,5 s), o
   *  mientras se mantenga pulsado Espacio (`hold`). Botón del panel (ojo), menú de pausa, tecla H, pulsación larga. */
  showHotspots(ms = 1500, hold = false) {
    if (this.mode !== 'play' || !this.room) return false;
    if (hold) this.hsHold = true;
    this.hsShow = { t0: this.realTime, until: this.realTime + (hold ? 400 : ms) };
    this.audio.sfx('click');
    return true;
  }
  skipCutscene() {
    this.skipCut = true;
    this.speeches.slice().forEach(s => this.endSpeech(s));
    const t = this.timers; this.timers = []; t.forEach(x => x.resolve());
    for (const a of Object.values(this.actors)) if (a.path.length) {
      const end = a.path[a.path.length - 1]; a.x = end[0]; a.y = end[1]; a.path = []; a.anim = 'idle';
      if (a.walkResolve) { const r = a.walkResolve; a.walkResolve = null; r(true); }
    }
    for (const f of this.fades.splice(0)) { this.fadeLevel = f.to; f.resolve(); }
  }
  toggleMenu() {
    if (this.menu) { this.menu = null; this.saveSettings(); }
    else this.menu = { page: 'main' };
  }
  updateHover() {
    if (this.mode !== 'play' || this.menu || !this.room) { this.ui.hover = null; return; }
    const { x, y } = this.mouse;
    if (this.choice) { UI.hoverChoice(this, x, y); this.ui.hover = null; return; }
    if (this.itemPick) {
      const hit = y >= VIEW_H ? UI.panelHit(this, x, y) : null;
      const id = hit && hit.type === 'inv' ? this.state.inventory[hit.index] : null;
      this.ui.hover = id ? this.itemTarget(id) : null;
      return;
    }
    if (y < VIEW_H) this.ui.hover = this.pickAt(x, y);
    else {
      const hit = UI.panelHit(this, x, y);
      if (hit && hit.type === 'inv') { const id = this.state.inventory[hit.index]; this.ui.hover = id ? this.itemTarget(id) : null; }
      else this.ui.hover = null;
    }
  }
  click(x, y, button, ev = {}) {
    if (this.card) { Fx.cardClick(this); return; }
    if (this.iosHelp) { if (this.realTime - this.iosHelp.at > 300) this.iosHelp = null; return; }   // el panel de ayuda del iPhone se cierra con un toque
    if (this.menu) { Screens.menuClick(this, x, y); return; }
    if (this.mode === 'title') { Screens.titleClick(this, x, y); return; }
    if (this.mode === 'ending') { Screens.endingClick(this, x, y); return; }
    if (this.mode !== 'play' || !this.room) return;
    if (this.choice) {
      const ch = this.choice;
      if (ch.escape != null && this.realTime - ch.t0 < 250) return;                 // segundo toque de un doble toque
      if (ch.escape != null && y < VIEW_H && !Phone.contains(this, x, y)) { this.audio.sfx('click'); ch.resolve(ch.escape); return; }
      UI.choiceClick(this, x, y); return;
    }
    if (this.itemPick) { if (!this.skipSpeech()) UI.itemPickClick(this, x, y); return; }
    if (this.busy) { if (!this.skipSpeech() && this.detalle) Detalle.skip(this); return; }
    this.audio.unlock();
    if (y >= VIEW_H) {
      const hit = UI.panelHit(this, x, y);
      if (!hit) return;
      if (hit.type === 'menu') { this.toggleMenu(); return; }
      if (hit.type === 'hotspots') { this.showHotspots(); return; }
      if (hit.type === 'verb') { this.ui.verb = hit.id; this.ui.item = null; this.audio.sfx('click'); return; }
      if (hit.type === 'arrow') { UI.scrollInventory(this, hit.dir); return; }
      if (hit.type === 'inv') {
        const id = this.state.inventory[hit.index];
        if (!id) return;
        const t = this.itemTarget(id);
        if (button === 2) { this.execute(this.defaultVerbFor(t), t); return; }
        const v = this.ui.verb;
        if (this.ui.item) {
          if (this.ui.item === id) { if (v === 'usar') this.execute('usar', t); else { this.ui.item = null; } return; }
          this.execute(v, t, this.ui.item); return;
        }
        if ((!v || v === 'usar') && this.isSolo(id)) { this.execute('usar', t); return; }     // el móvil: se abre ya
        if (!v || v === 'usar' || v === 'dar') { this.ui.verb = v || 'usar'; this.ui.item = id; return; }
        this.execute(v, t); return;
      }
      return;
    }
    const t = this.pickAt(x, y);
    if (button === 2) {
      if (t) this.execute(this.defaultVerbFor(t), t);
      return;
    }
    if (t) {
      if (this.ui.item) { this.execute(this.ui.verb, t, this.ui.item); return; }
      // double click / double tap on an exit while Bruno walks to it: he is there already (classic convention)
      if (!this.ui.verb && t.def.exit && Mov.isDouble(this, x, y, t.id, ev) && Mov.skipToExit(this, t)) return;
      this.execute(this.ui.verb || 'ir', t);
      return;
    }
    // walk to point (a double click / double tap on the floor runs: engine/mover.js)
    this.cancelAction();
    this.ui.verb = null; this.ui.item = null;
    this.walkActor(this.G.player, x + Math.round(this.camX), y, { run: Mov.isDouble(this, x, y, null, ev) });
  }
}
