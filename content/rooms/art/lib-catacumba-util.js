// Utilidades de pintura compartidas por los fondos catacumba / ecosistema / administracion (mismo artista).
import { PAL, px, rect, hline, vline, frameRect, line, poly, ellipse, paint, ditherPick, ditherOverlay, noise, glow,
  rng, hash2, shade, mix, gradV, label, measureText, shadowEllipse, bevel } from '../../../engine/draw.js';

/** Líneas de texto «de mentira» (greeked): n líneas de ancho w a partir de (x,y). */
export function greek(g, x, y, w, n, c, seed = 1, gap = 2, minF = 0.55) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const lw = Math.max(2, Math.floor(w * (i === n - 1 ? minF * r() + 0.2 : minF + (1 - minF) * r())));
    hline(g, x, y + i * gap, lw, c);
  }
}
/** Texto con la fuente del juego cuya parte alta de las mayúsculas cae en y (la fuente reserva 3 filas de tilde). */
export function cap(g, text, x, y, c, opts = {}) {
  const w = measureText(text, opts);
  const ax = opts.align === 'center' ? x - (w >> 1) : opts.align === 'right' ? x - w : x;
  const o = { ...opts }; delete o.align;
  label(g, text, ax, y - 3, c, o);
  return w;
}
/** Chincheta. */
export function pin(g, x, y, c = PAL.red[4]) { px(g, x, y, c); px(g, x, y - 1, shade(c, 0.3)); }
/** Cinta adhesiva sobre una esquina. */
export function tape(g, x, y, w = 5, h = 2) { rect(g, x, y, w, h, '#d8cfa0'); hline(g, x, y, w, '#ece6c4'); }
/** Mancha de humedad / café con dither. */
export function stain(g, cx, cy, rx, ry, c, t = 0.4) {
  paint(g, cx - rx, cy - ry, rx * 2 + 1, ry * 2 + 1, (x, y) => {
    const dx = (x - cx) / rx, dy = (y - cy) / ry, d = dx * dx + dy * dy;
    if (d > 1) return null;
    const v = (1 - d) * t * 2;
    return hash2(x, y, 5) < v ? c : null;
  });
}
/** Sombra proyectada (dither oscuro) de un rectángulo contra la pared: desplazada (dx,dy). */
export function dropShadow(g, x, y, w, h, dx = 2, dy = 2, t = 0.5) {
  ditherOverlay(g, x + dx, y + dy, w, h, PAL.shadow, t);
}
/** Brillo de luz cálida/frío + rejilla. */
export function lamp(g, cx, cy, rx, ry, c, a = 0.14) { glow(g, cx, cy, rx, ry, c, a, 5); }
/** Tela con pliegues verticales (cortinas): ramp oscuro→claro. */
export function fabric(g, x, y, w, h, ramp, opts = {}) {
  const per = opts.fold || 6, ph = opts.phase || 0;
  paint(g, x, y, w, h, (xx, yy) => {
    const u = ((xx - x + ph) % per) / per;
    const f = Math.abs(Math.sin(u * Math.PI));
    const t = 0.15 + f * 0.7 - (yy - y) / h * 0.15;
    return ditherPick(xx, yy, ramp, Math.max(0, Math.min(1, t)));
  });
}
/** Línea de un sitio a otro con sombra bajo ella (cables, cordeles). */
export function cord(g, x0, y0, x1, y1, sag, c, shadow = true) {
  const n = Math.abs(x1 - x0);
  let prev = null;
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag);
    if (prev) line(g, prev[0], prev[1], x, y, c);
    if (shadow) px(g, x + 1, y + 2, shade(PAL.shadow, 0));
    prev = [x, y];
  }
}
export { PAL };

// (REDISEÑO: la microfuente CANÓNICA es micro() de content/lib/kit.js; esta copia se mantiene para el arte actual)
// ---- fuente mínima 3x5 (para rótulos que no caben con la fuente del juego): mayúsculas, dígitos y signos
const G = (a) => a.join('');
const MINI = {
  A: G(['.#.', '#.#', '###', '#.#', '#.#']), B: G(['##.', '#.#', '##.', '#.#', '##.']), C: G(['.##', '#..', '#..', '#..', '.##']),
  D: G(['##.', '#.#', '#.#', '#.#', '##.']), E: G(['###', '#..', '##.', '#..', '###']), F: G(['###', '#..', '##.', '#..', '#..']),
  G: G(['.##', '#..', '#.#', '#.#', '.##']), H: G(['#.#', '#.#', '###', '#.#', '#.#']), I: G(['###', '.#.', '.#.', '.#.', '###']),
  J: G(['..#', '..#', '..#', '#.#', '.#.']), K: G(['#.#', '#.#', '##.', '#.#', '#.#']), L: G(['#..', '#..', '#..', '#..', '###']),
  M: G(['#.#', '###', '###', '#.#', '#.#']), N: G(['##.', '#.#', '#.#', '#.#', '#.#']), O: G(['.#.', '#.#', '#.#', '#.#', '.#.']),
  P: G(['##.', '#.#', '##.', '#..', '#..']), Q: G(['.#.', '#.#', '#.#', '###', '.##']), R: G(['##.', '#.#', '##.', '#.#', '#.#']),
  S: G(['.##', '#..', '.#.', '..#', '##.']), T: G(['###', '.#.', '.#.', '.#.', '.#.']), U: G(['#.#', '#.#', '#.#', '#.#', '###']),
  V: G(['#.#', '#.#', '#.#', '#.#', '.#.']), W: G(['#.#', '#.#', '###', '###', '#.#']), X: G(['#.#', '#.#', '.#.', '#.#', '#.#']),
  Y: G(['#.#', '#.#', '.#.', '.#.', '.#.']), Z: G(['###', '..#', '.#.', '#..', '###']),
  0: G(['###', '#.#', '#.#', '#.#', '###']), 1: G(['.#.', '##.', '.#.', '.#.', '###']), 2: G(['##.', '..#', '.#.', '#..', '###']),
  3: G(['##.', '..#', '.#.', '..#', '##.']), 4: G(['#.#', '#.#', '###', '..#', '..#']), 5: G(['###', '#..', '##.', '..#', '##.']),
  6: G(['.##', '#..', '###', '#.#', '###']), 7: G(['###', '..#', '.#.', '.#.', '.#.']), 8: G(['###', '#.#', '###', '#.#', '###']),
  9: G(['###', '#.#', '###', '..#', '##.']),
  ':': G(['...', '.#.', '...', '.#.', '...']), '.': G(['...', '...', '...', '...', '.#.']), '-': G(['...', '...', '###', '...', '...']),
  '%': G(['#.#', '..#', '.#.', '#..', '#.#']), '(': G(['.#.', '#..', '#..', '#..', '.#.']), ')': G(['.#.', '..#', '..#', '..#', '.#.']),
  '/': G(['..#', '..#', '.#.', '#..', '#..']), ' ': '',
};
export function miniText(g, text, x, y, c, opts = {}) {
  const w = text.length * 4 - 1;
  let cx = opts.align === 'center' ? x - (w >> 1) : opts.align === 'right' ? x - w : x;
  for (const ch of text.toUpperCase()) {
    const base = ch === 'Á' ? 'A' : ch === 'É' ? 'E' : ch === 'Ó' ? 'O' : ch === 'Ñ' ? 'N' : ch === 'Í' ? 'I' : ch;
    const gl = (MINI[base] || '').padEnd(15, '.');
    for (let i = 0; i < 15; i++) if (gl[i] === '#') px(g, cx + (i % 3), y + ((i / 3) | 0), c);
    if (ch !== base) px(g, cx + 1, y - 2, c);
    cx += 4;
  }
  return w;
}
