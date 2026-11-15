// MOVIMIENTO DEL JUGADOR (crítica §4.2 / §6.2: cruzar la Redacción de 1.270 px costaba 19 s y 4-5 clics).
//   · Doble clic / doble toque en una SALIDA mientras Bruno va hacia ella: llega ya y sale (convención clásica).
//   · Doble clic / doble toque en el SUELO: Bruno corre (×RUN_FACTOR) hasta allí, con un saltito al paso.
//   · Mantener pulsado el botón (o arrastrar el dedo por el suelo): Bruno sigue al puntero mientras se mantenga.
//   ENMIENDA E5 §6.8: el doble clic se mide en coordenadas de mundo; en la franja del borde (≤ 28 px) de una sala con
//   scroll corre hasta la siguiente PARADA (`parada: true` en el layout) o el final del suelo (`paradaBorde`); sobre un
//   objeto que no es salida, Bruno corre hasta él y el verbo en curso sigue (core.click); corriendo, la cámara se
//   adelanta 60 px (core.update). Un PNJ con `api.sinCongelar(id)` (`a.noFreeze`) no se para aunque se le apunte.
// Los paseos de guion (api.walkTo / walkActor) nunca corren ni se aceleran: `run` solo lo pone este módulo.
// También: un PNJ que anda bajo un guion NO bloqueante se queda quieto mientras el jugador apunta (verbo u objeto
// elegido, o el ratón encima de él), para que el clic no caiga donde ya no está (crítica §6.6).
const VIEW_H = 144;

export const RUN_FACTOR = 2.2;
export const DOUBLE_MS = 420;            // dos clics en este tiempo y a ≤ 10 px (o sobre el mismo objetivo) = doble
const HOLD_MS = 280;                     // a partir de aquí, mantener pulsado = seguir al puntero
const HOLD_EVERY = 140;                  // cada cuánto se recalcula el camino al seguir al puntero

export function reset(game) { game.mov = { last: null, hold: null }; }
const M = (game) => game.mov || (reset(game), game.mov);

/** ¿Este clic es el segundo de un doble clic (mismo objetivo o mismo sitio)? Registra el clic para el siguiente.
 *  `x, y` en coordenadas de PANTALLA. E5 §6.8a: el sitio se compara también en coordenadas de MUNDO (`x + camX`): el
 *  segundo clic cuenta si cae a ≤ 10 px del primero en el mundo (el jugador sigue el punto mientras la cámara se mueve)
 *  o en la pantalla (la mano quieta mientras la cámara se mueve). */
export function isDouble(game, x, y, id, ev = {}) {
  const m = M(game), now = game.realTime, L = m.last;
  const wx = x + Math.round(game.camX || 0);
  const cerca = L && (Math.hypot(wx - L.wx, y - L.y) <= 10 || Math.hypot(x - L.x, y - L.y) <= 10);
  const dbl = !!(L && now - L.t <= DOUBLE_MS && (id ? L.id === id : (!L.id && cerca)));
  m.last = dbl ? null : { x, wx, y, id: id || null, t: now };
  if (dbl && !id) { const h = m.hold; if (h) h.run = true; }
  return dbl;
}

/** Doble clic en la salida hacia la que ya anda Bruno: termina el paseo al instante y la acción en curso sigue. */
export function skipToExit(game, t) {
  const p = game.player;
  if (!p || !p.path.length) return false;
  const end = p.path[p.path.length - 1];
  p.x = end[0]; p.y = end[1]; p.path = []; p.anim = 'idle'; p.running = false;
  game.snapCamera();
  if (p.walkResolve) { const r = p.walkResolve; p.walkResolve = null; r(true); }
  game.audio.sfx('click');
  return true;
}

export function holdStart(game, kind, now = false) {
  const m = M(game);
  if (game.mode !== 'play' || !game.room || game.menu) return;
  if (game.mouse.y >= VIEW_H) return;
  m.hold = { kind, t0: game.realTime - (now ? HOLD_MS : 0), lastAt: 0, run: !!(game.player && game.player.running) };
}
export function holdEnd(game) { const m = M(game); m.hold = null; }

/** Cada fotograma: seguir al puntero mientras se mantiene pulsado (solo andando por el suelo, sin verbo ni objeto). */
export function update(game) {
  const m = M(game), h = m.hold;
  if (!h) return;
  if (game.busy || game.choice || game.itemPick || game.menu || game.ui.verb || game.ui.item || game.inDialog || game.cutscene) return;
  if (game.realTime - h.t0 < HOLD_MS || game.realTime - h.lastAt < HOLD_EVERY) return;
  const { x, y, inside } = game.mouse;
  if (!inside || y >= VIEW_H) return;
  const p = game.player; if (!p) return;
  const tx = x + Math.round(game.camX), ty = y;
  const end = p.path.length ? p.path[p.path.length - 1] : [p.x, p.y];
  h.lastAt = game.realTime;
  const [nx, ny] = game.room.walk.inside(tx, ty) ? [tx, ty] : game.room.walk.nearest(tx, ty);
  if (Math.hypot(nx - end[0], ny - end[1]) < 6) return;
  if (game.pickAt(x, y)) return;                     // sobre un objeto, el clic manda (no arrastrar «Ir a» sin querer)
  game.cancelAction();
  game.walkActor(p.id, tx, ty, { run: h.run });
}

/** DOBLE CLIC EN EL BORDE (E5 §6.8b): doble clic en la franja de ≤ 28 px del borde izquierdo o derecho, en una sala
 *  con scroll y hacia ese lado de Bruno: el destino es la siguiente PARADA del mundo en esa dirección (más allá del
 *  punto pulsado) o, si no hay, el final del suelo. Paradas: el `walkTo` de los objetos de la sala con `parada: true`
 *  (en el layout del arte, junto al `walkTo`; p. ej. `kanban: { x, y, w, h, walkTo: [x, y], parada: true }`).
 *  Devuelve [x, y] de mundo o null (entonces, el doble clic de siempre: correr al punto pulsado). */
export const BORDE = 28;
export function paradaBorde(game, sx, sy) {
  const rt = game.room, p = game.player;
  if (!rt || !p || !rt.walk || rt.width <= 320 || sy >= VIEW_H) return null;
  const side = sx < BORDE ? -1 : sx >= 320 - BORDE ? 1 : 0;
  if (!side) return null;
  const wx = sx + Math.round(game.camX);
  if (Math.sign(wx - p.x) !== side) return null;                               // «hacia ese lado»
  let best = null;
  for (const o of game.roomObjects()) {
    if (!o.parada || !Array.isArray(o.walkTo)) continue;
    const [ox, oy] = o.walkTo;
    if (side < 0 ? ox >= wx - 4 : ox <= wx + 4) continue;                      // la siguiente, más allá del clic
    if (!best || (side < 0 ? ox > best[0] : ox < best[0])) best = [ox, oy];
  }
  if (best) return best;
  return rt.walk.nearest(side < 0 ? 0 : rt.width - 1, sy);                    // el final del suelo
}

/** ¿Debe esperar este PNJ (anda bajo un guion no bloqueante y el jugador le está apuntando)? */
export function frozen(game, a) {
  if (game.busy || a.id === game.G.player || a.noFreeze) return false;     // E5 §6.3: api.sinCongelar(id)
  if (game.ui.verb || game.ui.item) return true;
  const h = game.ui.hover;
  return !!(h && h.kind === 'actor' && h.id === a.id);
}
