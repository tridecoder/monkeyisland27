// Microfuente 3x5 (mayúsculas, cifras, puntuación) para carteles diminutos pintados en los fondos.
// Módulo propio del artista de fondos (vestibulo/cpd/office). Paso de 4 px por letra.
import { rect } from '../../../engine/draw.js';

// (REDISEÑO: la microfuente CANÓNICA es micro() de content/lib/kit.js; esta copia se mantiene para el arte actual)
// glifos: 5 filas; '#' = píxel
const FIX = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'], B: ['##.', '#.#', '##.', '#.#', '##.'], C: ['.##', '#..', '#..', '#..', '.##'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'], E: ['###', '#..', '##.', '#..', '###'], F: ['###', '#..', '##.', '#..', '#..'],
  G: ['.##', '#..', '#.#', '#.#', '.##'], H: ['#.#', '#.#', '###', '#.#', '#.#'], I: ['###', '.#.', '.#.', '.#.', '###'],
  J: ['..#', '..#', '..#', '#.#', '.#.'], K: ['#.#', '#.#', '##.', '#.#', '#.#'], L: ['#..', '#..', '#..', '#..', '###'],
  M: ['#.#', '###', '###', '#.#', '#.#'], N: ['###', '#.#', '#.#', '#.#', '#.#'], O: ['.#.', '#.#', '#.#', '#.#', '.#.'],
  P: ['##.', '#.#', '##.', '#..', '#..'], Q: ['.#.', '#.#', '#.#', '###', '..#'], R: ['##.', '#.#', '##.', '#.#', '#.#'],
  S: ['.##', '#..', '.#.', '..#', '##.'], T: ['###', '.#.', '.#.', '.#.', '.#.'], U: ['#.#', '#.#', '#.#', '#.#', '###'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.'], W: ['#.#', '#.#', '###', '###', '#.#'], X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
  Y: ['#.#', '#.#', '.#.', '.#.', '.#.'], Z: ['###', '..#', '.#.', '#..', '###'],
  0: ['###', '#.#', '#.#', '#.#', '###'], 1: ['.#.', '##.', '.#.', '.#.', '###'], 2: ['##.', '..#', '.#.', '#..', '###'],
  3: ['##.', '..#', '.#.', '..#', '##.'], 4: ['#.#', '#.#', '###', '..#', '..#'], 5: ['###', '#..', '##.', '..#', '##.'],
  6: ['.##', '#..', '###', '#.#', '###'], 7: ['###', '..#', '.#.', '.#.', '.#.'], 8: ['###', '#.#', '###', '#.#', '###'],
  9: ['###', '#.#', '###', '..#', '##.'],
  '.': ['.', '.', '.', '.', '#'], ',': ['.', '.', '.', '#', '#'], ':': ['.', '#', '.', '#', '.'], '-': ['..', '..', '##', '..', '..'],
  '!': ['#', '#', '#', '.', '#'], '?': ['##.', '..#', '.#.', '...', '.#.'], '/': ['..#', '..#', '.#.', '#..', '#..'],
  "'": ['#', '#', '.', '.', '.'], '=': ['...', '###', '...', '###', '...'], '+': ['...', '.#.', '###', '.#.', '...'],
  '%': ['#.#', '..#', '.#.', '#..', '#.#'], '€': ['.##', '###', '##.', '###', '.##'], '(': ['.#', '#.', '#.', '#.', '.#'], ')': ['#.', '.#', '.#', '.#', '#.'],
  '>': ['#..', '.#.', '..#', '.#.', '#..'], '<': ['..#', '.#.', '#..', '.#.', '..#'], '*': ['#.#', '.#.', '#.#', '...', '...'],
};
const ACC = { 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ñ': 'N', 'Ü': 'U' };

/** Anchura en px de un texto (mayúsculas) con paso 1 px entre letras. */
export function microWidth(text) {
  let w = 0;
  for (const ch of String(text).toUpperCase()) {
    if (ch === ' ') { w += 3; continue; }
    const k = ACC[ch] || ch;
    const gl = FIX[k];
    w += (gl ? gl[0].length : 3) + 1;
  }
  return Math.max(0, w - 1);
}

/** Dibuja texto 3x5 en (x, y) = esquina superior izquierda. Devuelve la anchura. Acentos: 1 px encima. */
export function micro(g, text, x, y, color, opts = {}) {
  let cx = x;
  for (const ch of String(text).toUpperCase()) {
    if (ch === ' ') { cx += 3; continue; }
    const k = ACC[ch] || ch;
    const gl = FIX[k];
    if (!gl) { cx += 4; continue; }
    g.fillStyle = color;
    for (let r = 0; r < 5; r++) for (let c = 0; c < gl[r].length; c++) if (gl[r][c] === '#') g.fillRect(cx + c, y + r, 1, 1);
    if (ACC[ch]) g.fillRect(cx + 1, y - 1, 1, 1);
    cx += gl[0].length + 1;
  }
  return cx - x - 1;
}

/** Texto micro centrado en cx. */
export function microCenter(g, text, cx, y, color) {
  const w = microWidth(text);
  return micro(g, text, Math.round(cx - w / 2), y, color);
}

/** Texto micro con sombra de 1 px (contraste sobre fondos variados). */
export function microShadow(g, text, x, y, color, shadow = '#08060e') {
  micro(g, text, x + 1, y + 1, shadow);
  return micro(g, text, x, y, color);
}

/** Display de 7 segmentos para números (LED). Cada dígito 5x9. */
export function sevenSeg(g, text, x, y, on, off) {
  const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
  let cx = x;
  for (const ch of String(text)) {
    if (ch === '.' || ch === ',') { rect(g, cx, y + 8, 1, 1, on); cx += 2; continue; }
    const s = SEG[ch] || '';
    const seg = (n, sx, sy, w, h) => rect(g, cx + sx, y + sy, w, h, s.includes(n) ? on : off);
    seg('a', 1, 0, 3, 1); seg('b', 4, 1, 1, 3); seg('c', 4, 5, 1, 3); seg('d', 1, 8, 3, 1);
    seg('e', 0, 5, 1, 3); seg('f', 0, 1, 1, 3); seg('g', 1, 4, 3, 1);
    cx += 6;
  }
  return cx - x;
}
