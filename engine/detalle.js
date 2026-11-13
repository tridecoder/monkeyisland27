// «PLANO DETALLE» (api.detalle): inserto ampliado con marco y rótulo sobre la sala, para los remates que el guion pide
// «en primer plano» (el portátil del Titulator, la pegatina «Atrezo», el teléfono rojo, la página 7). Generaliza lo que
// ya hacían el móvil de las llamadas (engine/phone.js) y el portátil de la escena 7.2.
//
//   await api.detalle({
//     draw(g, r, t, k) {},          // pinta el contenido en coordenadas de PANTALLA dentro de r = { x, y, w, h }
//                                   // (recortado al marco); t = ms desde que se abrió; k = 0..1 de la apertura
//     w: 150, h: 84, x?, y?,        // tamaño del contenido; por defecto centrado arriba (y = 6)
//     titulo: 'ATREZO',             // rótulo del marco (opcional; fuente del juego)
//     color: '#f2ecd8',             // color del marco y del rótulo
//     lines: ['narrador', ['inigo_sinergia', '...'], ['player', '...']],   // se dicen con el inserto abierto
//     ms: 1800,                     // sin `lines` ni cuerpo: cuánto se queda (un clic o «.» lo cierra antes)
//     oscurecer: 0.45,              // velo sobre la sala detrás del inserto
//   }, async (api) => { ... })      // opcional: cuerpo con el inserto abierto (se cierra al acabar, aunque lance)
//
// Seguro: Esc (cinemática saltada) y el modo rápido lo resuelven al instante; se cierra siempre al acabar el guion que
// lo abrió y al cargar partida (no se guarda). Las líneas van al registro (`__game.log`) como cualquier otra.
// `__game.state().detalle` = { titulo } | null.
import { rect, hline, vline, frameRect, ditherOverlay } from './draw.js';
import { drawText, measure } from './font.js';

const OPEN_MS = 200;

export function open(game, ctx, opts = {}) {
  if (game.detalle) close(game);
  const w = Math.max(24, Math.min(304, Math.round(opts.w || 150)));
  const h = Math.max(16, Math.min(118, Math.round(opts.h || 84)));
  const x = Math.round(opts.x ?? (160 - w / 2));
  const y = Math.round(opts.y ?? 8);
  const D = game.detalle = {
    x, y, w, h, draw: opts.draw, titulo: opts.titulo || null, color: opts.color || '#f2ecd8',
    oscurecer: opts.oscurecer ?? 0.45, t0: game.time, owner: ctx, skip: null, prevTop: game.hudTop,
  };
  game.hudTop = y + h + (D.titulo ? 13 : 5);        // los globos, debajo del inserto
  game.log.push({ who: 'aviso', name: null, text: 'Plano detalle' + (D.titulo ? ': ' + D.titulo : ''), room: game.state && game.state.room, t: Math.round(game.time) });
  return D;
}

export function close(game) {
  const D = game.detalle;
  if (!D) return;
  game.detalle = null;
  game.hudTop = D.prevTop || 0;
  if (D.skip) { const r = D.skip; D.skip = null; r(); }
}

/** Un clic / «.» durante la espera sin líneas cierra el plano. */
export function skip(game) {
  const D = game.detalle;
  if (D && D.skip) { const r = D.skip; D.skip = null; r(); return true; }
  return false;
}

/** Espera `ms` o hasta que se salte (clic, «.», Esc). */
export function hold(game, ms) {
  const D = game.detalle;
  if (!D || game.instant) return Promise.resolve();
  return new Promise(res => {
    let done = false;
    const fin = () => { if (!done) { done = true; res(); } };
    D.skip = fin;
    game.sleep(ms).then(fin);
  });
}

export function draw(g, game) {
  const D = game.detalle; if (!D) return;
  const t = game.time - D.t0;
  const k = game.instant ? 1 : Math.min(1, t / OPEN_MS);
  g.save();
  if (D.oscurecer > 0) { g.globalAlpha = D.oscurecer * k; g.fillStyle = '#05040a'; g.fillRect(0, 0, 320, 144); g.globalAlpha = 1; }
  const { x, y, w, h } = D;
  const hh = Math.max(2, Math.round((h + 6) * k));
  const cy = y + ((h + 6) >> 1) - (hh >> 1) - 3;
  // marco: tinta, filo claro, sombra dura abajo a la derecha (lenguaje de las placas del kit)
  ditherOverlay(g, x - 1, cy + 2, w + 6, hh + 2, '#000000', 0.6);
  rect(g, x - 3, cy, w + 6, hh, '#141220');
  frameRect(g, x - 3, cy, w + 6, hh, D.color);
  hline(g, x - 2, cy + 1, w + 4, '#24203a');
  if (k >= 1) {
    g.beginPath(); g.rect(x, y, w, h); g.clip();
    if (D.draw) { try { D.draw(g, { x, y, w, h }, t, k); } catch (e) { game.error('detalle draw() falló: ' + e.message, e); D.draw = null; } }
  }
  g.restore();
  if (k >= 1) {
    // esquinas de «encuadre»
    for (const [cx0, cy0, sx, sy] of [[x - 1, y - 1, 1, 1], [x + w, y - 1, -1, 1], [x - 1, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
      hline(g, Math.min(cx0, cx0 + sx * 4), cy0, 5, D.color); vline(g, cx0, Math.min(cy0, cy0 + sy * 4), 5, D.color);
    }
    if (D.titulo) {
      const tw = measure(D.titulo) + 8;
      const tx = Math.round(x + w / 2 - tw / 2), ty = y + h + 2;
      rect(g, tx, ty, tw, 10, '#141220'); frameRect(g, tx, ty, tw, 10, D.color);
      drawText(g, D.titulo, x + (w >> 1), ty + 1, D.color, { align: 'center' });
    }
  }
}
