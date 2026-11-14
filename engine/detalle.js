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
//     // --- ANUNCIOS (ENMIENDA E2 §4.2: el pop-up de Maripaz, el «anuncio antes de entrar») ---
//     bloqueo: 5000,                // el clic / «.» NO cierra el plano antes de estos ms (Esc y el modo rápido, sí)
//     cuenta: { ms: 5000, texto: 'Podrá continuar en {n}', fin: 'Saltar anuncio ›' },
//                                   // rótulo de cuenta atrás pintado por el motor al pie del contenido ({n} = segundos
//                                   // que faltan, 5… 1); al llegar a 0 cambia a `fin` (si lo hay). Implica
//                                   // `bloqueo: cuenta.ms` y, sin `ms`, el plano se queda cuenta.ms + 1500
//     cerrarX: 3,                   // botón de cerrar «×» de N px en la esquina superior derecha (1 = un punto; 0 o
//                                   // null = sin X). El motor lo pinta encima del dibujo del contenido.
//   }, async (api) => { ... })      // opcional: cuerpo con el inserto abierto (se cierra al acabar, aunque lance)
//
// Ejemplo (Sala Amazonas, 3.ª vez: sin X, «Podrá cerrar en 3»):
//   await api.detalle({ titulo: 'PUBLICIDAD', w: 150, h: 60, draw: popupComercial, cerrarX: 0,
//                       cuenta: { ms: 3000, texto: 'Podrá cerrar en {n}' } });
// Helpers para el dibujo del contenido: `cuentaAtras(t, ms)` (segundos que faltan, 0 al acabar) y
// `dibujarX(g, x, y, px, color)` (la «×» de cerrar, por si el contenido quiere más de una).
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
    cuenta: opts.cuenta ? { ms: 5000, texto: 'Podrá continuar en {n}', ...opts.cuenta } : null,
    cerrarX: Math.max(0, Math.round(Number(opts.cerrarX) || 0)),
  };
  D.bloqueo = Math.max(0, Number(opts.bloqueo ?? (D.cuenta ? D.cuenta.ms : 0)) || 0);
  game.hudTop = y + h + (D.titulo ? 13 : 5);        // los globos, debajo del inserto
  // el ambiente y los murmullos no se quedan debajo del inserto (E2: el anuncio tapa la sala; nada habla por encima)
  for (const sp of (game.speeches || []).filter(sp => sp.ambient)) game.endSpeech(sp);
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

/** Un clic / «.» durante la espera sin líneas cierra el plano (salvo durante su `bloqueo`, E2 §4.2.4). */
export function skip(game) {
  const D = game.detalle;
  if (D && D.skip && !bloqueado(game)) { const r = D.skip; D.skip = null; r(); return true; }
  return false;
}
/** ¿El plano abierto aún no se deja cerrar con un clic? (anuncio con cuenta atrás) */
export function bloqueado(game) {
  const D = game.detalle;
  return !!(D && D.bloqueo && !game.instant && game.time - D.t0 < D.bloqueo);
}
/** Segundos que faltan de una cuenta atrás de `ms` a los `t` ms de abrirse (5, 4… 1; 0 al acabar). */
export function cuentaAtras(t, ms) { return Math.max(0, Math.ceil((ms - t) / 1000)); }
/** La «×» de cerrar de un anuncio: un cuadrado de `n` px (n ≥ 3: aspa dentro de un cuadradito; 1-2: un punto). */
export function dibujarX(g, x, y, n, color = '#5a5a66') {
  if (!(n > 0)) return;
  if (n < 3) { rect(g, x, y, n, n, color); return; }
  rect(g, x, y, n, n, '#f4f4f0');
  for (let i = 0; i < n; i++) { rect(g, x + i, y + i, 1, 1, color); rect(g, x + n - 1 - i, y + i, 1, 1, color); }
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
    // Esc (cinemática saltada) también lo resuelve durante el bloqueo: el modo rápido pone game.instant
    const poll = () => { if (done) return; if (game.instant || game.detalle !== D) { fin(); return; } game.sleep(100).then(poll); };
    if (D.bloqueo) game.sleep(100).then(poll);
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
    // E2 §4.2: la «×» de cerrar (cada vez más pequeña) y la cuenta atrás del anuncio, encima del contenido
    if (D.cerrarX) dibujarX(g, x + w - D.cerrarX - 2, y + 2, D.cerrarX);
    if (D.cuenta) {
      const n = cuentaAtras(t, D.cuenta.ms);
      const msg = n > 0 ? String(D.cuenta.texto).replace('{n}', n) : (D.cuenta.fin || '');
      if (msg) {
        const mw = measure(msg) + 6, mx = x + w - mw - 4, my = y + h - 13;
        rect(g, mx, my, mw, 10, '#141220'); frameRect(g, mx, my, mw, 10, n > 0 ? '#8a8aa0' : '#f2ecd8');
        drawText(g, msg, mx + 3, my + 1, n > 0 ? '#c8c8d8' : '#ffffff', { outline: null });
      }
    }
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
