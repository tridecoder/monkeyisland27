// MOVIMIENTO DEL JUGADOR (crítica §4.2 / §6.2: cruzar la Redacción de 1.270 px costaba 19 s y 4-5 clics).
//   · Doble clic / doble toque en una SALIDA mientras Bruno va hacia ella: llega ya y sale (convención clásica).
//   · Doble clic / doble toque en el SUELO: Bruno corre (×RUN_FACTOR) hasta allí, con un saltito al paso.
//   · Mantener pulsado el botón (o arrastrar el dedo por el suelo): Bruno sigue al puntero mientras se mantenga.
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

/** ¿Este clic es el segundo de un doble clic (mismo objetivo o mismo sitio)? Registra el clic para el siguiente. */
export function isDouble(game, x, y, id, ev = {}) {
  const m = M(game), now = game.realTime, L = m.last;
  const dbl = !!(L && now - L.t <= DOUBLE_MS && (id ? L.id === id : (!L.id && Math.hypot(x - L.x, y - L.y) <= 10)));
  m.last = dbl ? null : { x, y, id: id || null, t: now };
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

/** ¿Debe esperar este PNJ (anda bajo un guion no bloqueante y el jugador le está apuntando)? */
export function frozen(game, a) {
  if (game.busy || a.id === game.G.player) return false;
  if (game.ui.verb || game.ui.item) return true;
  const h = game.ui.hover;
  return !!(h && h.kind === 'actor' && h.id === a.id);
}
