// EFECTOS Y SISTEMAS COMUNES DEL PLAN DE COMEDIA (docs/guion2/PLAN_COMEDIA.md, paquete común P0). Genéricos: el
// contenido solo pone textos y números. Documentación y ejemplos: docs/CONTENT_SCHEMA.md §7 «Efectos de situación» y
// §18 «Ambiente»; demo: tools/demo-fase0.js (tools/test-fase0.mjs).
//
//   AMBIENTE  · un único programador para todo el `ambient` de las salas (coro de Desarrollo incluido): nunca habla con
//               otro globo, un menú, un aviso, el móvil, un plano detalle, una tarjeta o un duelo en pantalla; entre una
//               intervención y la siguiente pasan 60-120 s; como mucho 3 por visita. Sala: `ambientRules`.
//   APAGÓN    · api.apagon({ ms, alpha, color, spots, actor }) oscurece la sala (mismo pintado que la penumbra).
//   ESTAMPIDA · api.estampida(ids, { puerta: [x, y], ... }) varios actores huyen por una puerta con atasco y «corcho».
//   VIRAL     · api.viral({ avisos, contador, etiqueta }) ráfaga de notificaciones en la esquina y un contador que sube.
//   TITULAR   · api.titular(texto, { who, from }) la línea sale como franja de titular de periódico.
//   TARJETA   · api.tarjeta({ titulo, lineas, minMs }) pantalla fija (la fe de erratas final); espera al clic.
import { drawText, measure, wrap, LINE_H } from './font.js';
import { rect, hline, vline, frameRect, line, ditherPick, PAL } from './draw.js';
import { makeApi } from './script.js';

const asArray = x => x == null ? [] : Array.isArray(x) ? x : [x];
const rand = (a, b) => a + Math.random() * (b - a);

export function reset(game) {
  if (game.apagon && game.apagon.resolve) game.apagon.resolve();
  game.apagon = null;
  game.burst = null;
  if (game.card) { const r = game.card.resolve; game.card = null; if (r) r(); }
}

// ================================================================== AMBIENTE
export const AMBIENT_DEFAULTS = { every: [60000, 120000], max: 3 };

/** Nada en pantalla que el ambiente pueda pisar (plan §1.1 «Coro» y §5.14). */
export function quiet(game) {
  if (game.mode !== 'play' || !game.room) return false;
  if (game.busy || game.acting || game.choice || game.itemPick || game.menu || game.phone || game.detalle || game.hud || game.card) return false;
  if (game.cutscene > 0 || game.inDialog > 0 || game.duelInfo) return false;
  if (game.speeches.length) return false;
  if (game.notices.some(n => game.realTime < n.until)) return false;
  return true;
}
/** Espera a que haya silencio (lo usan las líneas de ambiente antes de cada globo). `gone()` aborta. */
export async function waitQuiet(game, gone) {
  for (let i = 0; i < 4000; i++) {
    if (gone && gone()) return false;
    if (quiet(game) || game.instant) return true;
    await game.sleep(150);
  }
  return false;
}
function rules(rt) { return { ...AMBIENT_DEFAULTS, ...(rt.def.ambientRules || {}) }; }
export function ambientEnter(game, rt) {
  const R = rules(rt);
  rt.amb = { count: 0, max: R.max, next: game.time + rand(...asArray(R.first || R.every)), idx: 0, running: false };
}
/** Cada fotograma (core.update): lanza la siguiente intervención de ambiente si toca y hay silencio. */
export function updateAmbient(game) {
  const rt = game.room, A = rt && rt.amb;
  if (!A || A.running || !rt.ambient.length) return;
  if (A.count >= A.max || game.time < A.next) return;
  if (!quiet(game)) return;                         // pospuesta: sale en cuanto haya silencio
  const api = makeApi(game, {});
  const n = rt.ambient.length;
  for (let k = 0; k < n; k++) {
    const am = rt.ambient[(A.idx + k) % n];
    let ok = true;
    try { ok = !am.def.if || game.cond(am.def.if, api); } catch (e) { ok = false; }
    if (!ok) continue;
    const run = ambientScript(game, rt, am.def);
    if (!run) continue;
    A.idx = (A.idx + k + 1) % n;
    A.running = true; am.running = true;
    const R = rules(rt), rid = rt.def.id;
    game.runScript(run, { blocking: false, label: 'ambient ' + rid, ambientRoom: rid }).then(() => {
      am.running = false;
      if (game.room === rt) { A.running = false; A.count++; A.next = game.time + rand(...asArray(R.every)); }
    });
    return;
  }
  A.next = game.time + 5000;                        // nada elegible ahora: se vuelve a mirar en 5 s
}
/** El guion de una entrada de ambiente: `run(api)` o, solo con las líneas, `discusiones: [[[quién, texto], ...], ...]`
 *  (o `lineas: [[quién, texto], ...]`, una sola), en orden (`orden: 'fijo'`, por defecto: al acabar la lista, silencio
 *  el resto de la partida) o en bucle (`orden: 'rotar'`). Quién: 'B' / 'player' (Bruno), un id de actor, 'obj:<objeto>'
 *  o una clave de `voces: { D1: { from: 'coro_desarrollo', prefijo: 'D1: ' } | 'id_de_actor' }`. */
function ambientScript(game, rt, def) {
  if (def.run) return def.run;
  const list = def.discusiones || (def.lineas ? [def.lineas] : null);
  if (!list || !list.length) return null;
  const key = 'ambient:' + rt.def.id + '.' + (def.id || 'ambiente');
  const i = game.state.flags[key] || 0;
  if (def.orden !== 'rotar' && i >= list.length) return null;
  return async (api) => {
    api.game.state.flags[key] = i + 1;
    const lines = typeof list[i % list.length] === 'function' ? list[i % list.length](api) : list[i % list.length];
    await decir(api, lines, def.voces || {});
  };
}
/** Dice una secuencia [[quién, texto], ...] (también sirve fuera del ambiente). */
export async function decir(api, lines, voces = {}) {
  for (const l of asArray(lines)) {
    const [who, text, opts] = Array.isArray(l) ? l : ['B', l];
    const v = voces[who];
    if (who === 'B' || who === 'player') await api.say(text, opts);
    else if (who === 'wait') await api.wait(Number(text) || 300);
    else if (who === 'sfx') api.sfx(text);
    else if (who === 'narrador' || who === 'narrator') await api.narrate(text, opts);
    else if (v && typeof v === 'object') {
      const t = (v.prefijo || '') + text;
      if (v.from && api.game.actors[v.from]) await api.sayAs(v.from, t, opts);
      else if (v.from) await api.sayFrom(v.from, t, { color: v.color, ...(opts || {}) });
      else await api.narrate(t, { color: v.color, ...(opts || {}) });
    } else if (typeof v === 'string') await api.sayAs(v, text, opts);
    else if (typeof who === 'string' && who.startsWith('obj:')) await api.sayFrom(who.slice(4), text, opts);
    else await api.sayAs(who, text, opts);
  }
}

// ================================================================== APAGÓN
/** api.apagon(opts): la sala se queda a oscuras (sobre todo menos la interfaz). opts: { ms (0 = hasta api.apagon(false)),
 *  alpha 0.88, color '#020308', spots [[cx, cy, rx, ry]] (pantallas que siguen encendidas), actor 0.25 (cuánto se libran
 *  los actores, como en la penumbra), parpadeo true (titila al encenderse/apagarse) }. Devuelve una promesa que se
 *  resuelve al volver la luz (con ms) o enseguida (sin ms). */
export function apagon(game, opts = {}) {
  if (opts === false || opts === null) { if (game.apagon) { const r = game.apagon.resolve; game.apagon = null; if (r) r(); } return Promise.resolve(); }
  if (typeof opts === 'number') opts = { ms: opts };
  if (game.apagon && game.apagon.resolve) game.apagon.resolve();
  const ms = opts.ms ?? 3000;
  const A = { t0: game.time, until: ms > 0 ? game.time + ms : 0, alpha: opts.alpha ?? 0.88, color: opts.color || '#020308',
    spots: opts.spots || [], actor: opts.actor ?? 0.25, parpadeo: opts.parpadeo !== false, resolve: null };
  game.apagon = A;
  game.audio.sfx(opts.sfx || 'click');
  if (!ms || game.instant) { if (game.instant && ms) game.apagon = null; return Promise.resolve(); }
  return new Promise(res => { A.resolve = res; game.sleep(ms).then(() => { if (game.apagon === A) game.apagon = null; res(); }); });
}
export function drawApagon(game, g, cam) {
  const A = game.apagon;
  if (!A) return;
  if (A.until && game.time >= A.until) { game.apagon = null; if (A.resolve) A.resolve(); return; }
  const t = game.time - A.t0;
  let k = Math.min(1, t / 90);
  if (A.parpadeo && t < 260) k = (Math.floor(t / 65) % 2) ? 0.35 : 1;               // titila al irse la luz
  if (A.until && A.parpadeo && A.until - game.time < 240) k = (Math.floor((A.until - game.time) / 60) % 2) ? 0.4 : 0.9;
  game.drawShade(g, cam, { color: A.color, alpha: A.alpha * k, spots: A.spots, actor: A.actor, borde: 0.3 });
}

// ================================================================== ESTAMPIDA
/** api.estampida(ids, opts): huida en grupo por una puerta con atasco. opts: { puerta: [x, y] (punto de la puerta),
 *  atascoMs 900 (encajados: ±3 px y temblor), gap 120 (salen de uno en uno), destino: null | id de sala (adónde van),
 *  enAtasco: async (api) => {} (líneas mientras están encajados), sfx: { atasco, plop } }. Corren ×1,8. */
export async function estampida(game, api, ids, opts = {}) {
  const [px, py] = opts.puerta || [0, 0];
  const actors = ids.map(id => game.actors[id]).filter(Boolean);
  // todos a la puerta a la vez (con un pequeño abanico para que no se pisen del todo)
  await Promise.all(actors.map((a, i) => { a.running = false; const p = game.walkActor(a.id, px + (i - (actors.length - 1) / 2) * 4, py + (i % 2)); a.speed0 = a.speed0 || a.speed; a.speed = a.speed0 * (opts.prisa ?? 1.8); return p; }));
  actors.forEach(a => { a.speed = a.speed0 || a.speed; });
  // encajados en el marco: ±3 px y temblor
  if (opts.sfx !== false) api.sfx((opts.sfx && opts.sfx.atasco) || 'hit');
  game.shake(300, 1);
  const base = actors.map(a => [a.x, a.y]);
  let jam = true;
  const temblor = (async () => {
    for (let k = 0; jam && k < 400; k++) {
      actors.forEach((a, i) => { a.x = base[i][0] + ((k + i) % 2 ? 3 : -3) * (i % 2 ? 1 : -1); a.y = base[i][1] + ((k + i) % 3) - 1; });
      await game.sleep(70);
      if (game.instant) break;
    }
  })();
  const t0 = game.time;
  if (opts.enAtasco) await opts.enAtasco(api);
  const rest = (opts.atascoMs ?? 900) - (game.time - t0);
  if (rest > 0) await api.wait(rest);
  jam = false; await temblor;
  actors.forEach((a, i) => { a.x = base[i][0]; a.y = base[i][1]; });
  // «¡plop!»: salen de uno en uno
  for (const a of actors) {
    if (opts.sfx !== false) api.sfx((opts.sfx && opts.sfx.plop) || 'door');
    a.room = opts.destino || null; a.path = [];
    await api.wait(opts.gap ?? 120);
  }
  game.syncState();
}

// ================================================================== VIRAL (ráfaga de notificaciones)
/** api.viral(opts): en la esquina superior derecha caen avisos tipo móvil (uno cada `cada` ms) y, si se pide, un
 *  contador sube a saltos. opts: { avisos: ['texto', ...], contador: [desde, hasta], saltos 3, etiqueta 'visitas',
 *  cada 260, ms 3200 (lo que dura todo), color '#9fd8ff', sfx 'beep' }. Resuelve al terminar (no hace falta esperar). */
export function viral(game, opts = {}) {
  const avisos = asArray(opts.avisos);
  const cada = opts.cada ?? 260;
  const total = Math.max(opts.ms ?? 3200, avisos.length * cada + 1600);
  for (const t of avisos) game.timedMs('viral', t, 0);
  game.log.push({ who: 'aviso', name: null, text: 'VIRAL: ' + avisos.join(' | ') + (opts.contador ? ` (${opts.contador.join(' → ')} ${opts.etiqueta || ''})` : ''), room: game.state && game.state.room, t: Math.round(game.time) });
  if (game.instant) return Promise.resolve();
  const B = game.burst = { t0: game.time, until: game.time + total, avisos, cada, contador: opts.contador || null, saltos: opts.saltos ?? 3,
    etiqueta: opts.etiqueta || '', color: opts.color || '#9fd8ff', sfx: opts.sfx === undefined ? 'beep' : opts.sfx, sonados: 0 };
  return new Promise(res => game.sleep(total).then(() => { if (game.burst === B) game.burst = null; res(); }));
}
export function drawBurst(game, g) {
  const B = game.burst;
  if (!B) return;
  if (game.time >= B.until) { game.burst = null; return; }
  const t = game.time - B.t0;
  const W = 132, x0 = 320 - W - 4;
  let y = (game.hudTop || 0) + 4;
  if (B.contador) {
    const [a, b] = B.contador;
    const s = Math.min(B.saltos, Math.floor(t / 400) + 1);
    const v = Math.round(a + (b - a) * s / B.saltos);
    const txt = v.toLocaleString('es-ES') + (B.etiqueta ? ' ' + B.etiqueta : '');
    const w = measure(txt, { bold: true }) + 10;
    g.save(); g.globalAlpha = 0.88; rect(g, 320 - w - 4, y, w, 13, '#08060e'); g.restore();
    frameRect(g, 320 - w - 4, y, w, 13, '#ff5040');
    rect(g, 320 - w, y + 5, 3, 3, (Math.floor(t / 250) % 2) ? '#ff5040' : '#601810');
    drawText(g, txt, 316 - 3, y + 1, '#ffffff', { align: 'right', bold: true, outline: null });
    y += 16;
  }
  const n = Math.min(B.avisos.length, Math.floor(t / B.cada) + 1);
  if (n > B.sonados) { if (B.sfx) game.audio.sfx(B.sfx); B.sonados = n; }
  const show = B.avisos.slice(Math.max(0, n - 4), n);           // como mucho 4 a la vista
  show.forEach((txt, i) => {
    const k = Math.max(0, n - 4) + i;
    const age = t - k * B.cada;
    const slide = Math.max(0, 1 - age / 140);
    const xx = Math.round(x0 + slide * (W + 8));
    const lines = wrap(txt, W - 14).slice(0, 2);
    const h = 4 + lines.length * 10;
    g.save(); g.globalAlpha = 0.9; rect(g, xx, y, W, h, '#141a30'); g.restore();
    frameRect(g, xx, y, W, h, B.color);
    rect(g, xx + 3, y + 4, 4, 4, B.color);
    lines.forEach((l, j) => drawText(g, l, xx + 10, y + 1 + j * 10, '#e8ecf8', { outline: null }));
    y += h + 2;
  });
}

// ================================================================== TITULAR (franja de periódico)
/** Una línea dicha como titular: franja de papel a lo ancho, letra negra en negrita y filete rojo (Rubén, el
 *  Titulator, Bruno contagiado). La pinta core.drawSpeech cuando el globo tiene `style: 'titular'`. */
export function drawTitular(game, g, sp) {
  const lines = sp.lines;
  const h = lines.length * LINE_H + 7;
  let top = Math.max(4, (game.hud || game.detalle) ? game.hudTop : 4);
  if (game.phone) top = Math.max(top, 4);
  const w = Math.min(312, Math.max(...lines.map(l => measure(l, { bold: true }))) + 18);
  const x = Math.round(160 - w / 2);
  g.save(); g.globalAlpha = 0.97; rect(g, x, top, w, h, '#f4efe2'); g.restore();
  hline(g, x, top, w, '#141220'); hline(g, x, top + 2, w, '#141220');
  hline(g, x, top + h - 1, w, '#c83a3a'); hline(g, x + 4, top + h - 3, w - 8, '#c83a3a');
  vline(g, x, top, h, '#8a8070'); vline(g, x + w - 1, top, h, '#8a8070');
  rect(g, x + 4, top + 5, 3, 3, sp.color && sp.color !== '#FFFFFF' ? sp.color : '#c83a3a');    // de quién es: su color
  lines.forEach((l, i) => drawText(g, l, 160 + 2, top + 3 + i * LINE_H, '#141220', { align: 'center', bold: true, outline: null }));
}

// ================================================================== TARJETA FIJA (fe de erratas final)
/** api.tarjeta(opts): pantalla fija sobre todo (también el panel). opts: { titulo 'FE DE ERRATAS', lineas: [...],
 *  minMs 6000 (antes no se cierra), boli true (el boli rojo de Aurora encima), draw(g, t) (fondo propio), music }.
 *  Se cierra con un clic tras minMs; en modo rápido, al momento. */
export function tarjeta(game, opts = {}) {
  const lines = asArray(opts.lineas);
  game.log.push({ who: 'tarjeta', name: null, text: [opts.titulo || 'FE DE ERRATAS', ...lines].join(' / '), room: game.state && game.state.room, t: Math.round(game.time) });
  if (opts.music !== undefined) game.audio.play(opts.music, 1);
  if (game.fast) return Promise.resolve();
  return new Promise(res => { game.card = { ...opts, lines, t0: game.realTime, resolve: () => { game.card = null; res(); } }; });
}
export function cardClick(game) {
  const C = game.card;
  if (!C) return;
  if (game.realTime - C.t0 >= (C.minMs ?? 6000)) { game.audio.sfx('click'); C.resolve(); }
}
export function drawCard(game, g) {
  const C = game.card;
  const t = game.realTime - C.t0;
  if (C.draw) { C.draw(g, t); }
  else {
    rect(g, 0, 0, 320, 200, '#0a0810');
    const x0 = 34, y0 = 14, w = 252, h = 168;
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x += 2) {
      g.fillStyle = ditherPick(x, y, [PAL.paper[4], PAL.paper[5], PAL.paper[6]], 0.9 - (x - x0) / (w * 3) - (y - y0) / (h * 3)); g.fillRect(x, y, 2, 1);
    }
    vline(g, x0 + w, y0 + 2, h, '#000'); hline(g, x0 + 2, y0 + h, w, '#000');
    const ink = '#1c1820';
    drawText(g, C.titulo || 'FE DE ERRATAS', 160, y0 + 10, '#a82a24', { align: 'center', scale: 2, outline: null, bold: true });
    hline(g, x0 + 16, y0 + 36, w - 32, ink); hline(g, x0 + 16, y0 + 38, w - 32, ink);
    let y = y0 + 46;
    for (const l of C.lines) {
      if (!l) { y += 6; continue; }
      for (const s of wrap(l, w - 36)) { drawText(g, s, 160, y, ink, { align: 'center', outline: null }); y += LINE_H; }
    }
    if (C.boli !== false) {     // el boli rojo de Aurora, cruzado sobre la esquina
      line(g, x0 + w - 70, y0 + h - 10, x0 + w - 18, y0 + h - 30, '#a82a24', 2);
      line(g, x0 + w - 70, y0 + h - 11, x0 + w - 20, y0 + h - 30, '#e05048');
      rect(g, x0 + w - 20, y0 + h - 33, 4, 3, PAL.metal[5]);
    }
  }
  if (t >= (C.minMs ?? 6000) && Math.floor(t / 600) % 2 === 0) drawText(g, C.pie || 'Haz clic para seguir', 160, 188, '#a49ec4', { align: 'center' });
}
