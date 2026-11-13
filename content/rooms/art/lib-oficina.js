// Utilidades de arte propias del artista de fondos de pecera / pajarera / sala_amazonas.
// (Micro-fuente 3x5 para carteles pintados, sillas vistas de espaldas con chaqueta, monitores planos con
// distintos contenidos, lluvia sobre cristal, pósits, persianas...). No es compartido: solo lo importan esas 3 salas.
import {
  PAL, rect, hline, vline, frameRect, px, line, poly, ellipse, paint, bevel, dither, ditherOverlay, glaze, gradV, gradH,
  noise, glow, shadowEllipse, ditherPick, hash2, rng, shade, mix, bayer,
} from '../../../engine/draw.js';

// (REDISEÑO: la microfuente CANÓNICA es micro() de content/lib/kit.js; esta copia se mantiene para el arte actual)
// ------------------------------------------------------------------ micro-fuente 3x5 (mayúsculas)
const GLY = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'], B: ['##.', '#.#', '##.', '#.#', '##.'], C: ['.##', '#..', '#..', '#..', '.##'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'], E: ['###', '#..', '##.', '#..', '###'], F: ['###', '#..', '##.', '#..', '#..'],
  G: ['.##', '#..', '#.#', '#.#', '.##'], H: ['#.#', '#.#', '###', '#.#', '#.#'], I: ['###', '.#.', '.#.', '.#.', '###'],
  J: ['..#', '..#', '..#', '#.#', '.#.'], K: ['#.#', '#.#', '##.', '#.#', '#.#'], L: ['#..', '#..', '#..', '#..', '###'],
  M: ['#.#', '###', '###', '#.#', '#.#'], N: ['##.', '#.#', '#.#', '#.#', '#.#'], O: ['.#.', '#.#', '#.#', '#.#', '.#.'],
  P: ['##.', '#.#', '##.', '#..', '#..'], Q: ['.#.', '#.#', '#.#', '##.', '.##'], R: ['##.', '#.#', '##.', '#.#', '#.#'],
  S: ['.##', '#..', '.#.', '..#', '##.'], T: ['###', '.#.', '.#.', '.#.', '.#.'], U: ['#.#', '#.#', '#.#', '#.#', '###'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.'], W: ['#.#', '#.#', '###', '###', '#.#'], X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
  Y: ['#.#', '#.#', '.#.', '.#.', '.#.'], Z: ['###', '..#', '.#.', '#..', '###'],
  0: ['###', '#.#', '#.#', '#.#', '###'], 1: ['.#.', '##.', '.#.', '.#.', '###'], 2: ['##.', '..#', '.#.', '#..', '###'],
  3: ['##.', '..#', '.#.', '..#', '##.'], 4: ['#.#', '#.#', '###', '..#', '..#'], 5: ['###', '#..', '##.', '..#', '##.'],
  6: ['.##', '#..', '###', '#.#', '###'], 7: ['###', '..#', '.#.', '.#.', '.#.'], 8: ['###', '#.#', '###', '#.#', '###'],
  9: ['###', '#.#', '###', '..#', '##.'],
  '.': ['...', '...', '...', '...', '.#.'], ',': ['...', '...', '...', '.#.', '#..'], ':': ['...', '.#.', '...', '.#.', '...'],
  '-': ['...', '...', '###', '...', '...'], '(': ['.#.', '#..', '#..', '#..', '.#.'], ')': ['.#.', '..#', '..#', '..#', '.#.'],
  '?': ['##.', '..#', '.#.', '...', '.#.'], '!': ['.#.', '.#.', '.#.', '...', '.#.'], '/': ['..#', '..#', '.#.', '#..', '#..'],
  '%': ['#.#', '..#', '.#.', '#..', '#.#'], '+': ['...', '.#.', '###', '.#.', '...'], '·': ['...', '...', '.#.', '...', '...'],
  '*': ['#.#', '.#.', '###', '.#.', '#.#'], '=': ['...', '###', '...', '###', '...'], '"': ['#.#', '#.#', '...', '...', '...'],
  "'": ['.#.', '.#.', '...', '...', '...'], '_': ['...', '...', '...', '...', '###'], '>': ['#..', '.#.', '..#', '.#.', '#..'],
  '<': ['..#', '.#.', '#..', '.#.', '..#'], '^': ['.#.', '###', '...', '...', '...'], ' ': ['..', '..', '..', '..', '..'],
};
const ACC = { 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ñ': 'N', 'Ü': 'U' };

/** anchura en px de un texto en micro-fuente */
export function tinyW(text) { return Math.max(0, String(text).length * 4 - 1); }
/** texto 3x5; (x, y) = esquina superior izquierda; maneja Á É Í Ó Ú Ñ (puntito arriba) */
export function tiny(g, text, x, y, c = PAL.ink[1], o = {}) {
  let cx = o.align === 'center' ? x - (tinyW(text) >> 1) : o.align === 'right' ? x - tinyW(text) : x;
  for (const chRaw of String(text).toUpperCase()) {
    const base = ACC[chRaw] || chRaw;
    const gl = GLY[base] || GLY['?'];
    if (base === ' ') { cx += 2; continue; }
    for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) if (gl[r][q] === '#') px(g, cx + q, y + r, c);
    if (ACC[chRaw]) px(g, cx + 1, y - 1, c);
    cx += 4;
  }
}

// ------------------------------------------------------------------ pósits y papelitos
export const POSTIT = { y: '#f6dc5a', g: '#9ad46a', p: '#f49ab8', b: '#7ab8e8', o: '#f4a040', w: '#f4f0e0' };
export function postit(g, x, y, c = POSTIT.y, o = {}) {
  const w = o.w || 7, h = o.h || 7;
  ditherOverlay(g, x + 1, y + 1, w, h, PAL.shadow, 0.35);
  rect(g, x, y, w, h, c);
  hline(g, x, y, w, shade(c, 0.25)); hline(g, x, y + h - 1, w, shade(c, -0.18));
  if (o.lines !== false) for (let ly = y + 2; ly < y + h - 1; ly += 2) hline(g, x + 1, ly, w - 2 - ((ly + x) % 3 === 0 ? 2 : 0), shade(c, -0.38));
  if (o.text) tiny(g, o.text, x + 1, y + 1, o.ink || PAL.ink[2]);
}

// ------------------------------------------------------------------ monitor plano (visto de frente)
/** pantalla plana w×h (incluye marco); kind: chart | bars | article | dash | code | saver | pie | off | map */
export function lcd(g, x, y, w, h, o = {}) {
  const kind = o.kind || 'chart', seed = o.seed || 1, t = o.t || 0;
  rect(g, x, y, w, h, PAL.metal[1]);
  hline(g, x, y, w, PAL.metal[3]); vline(g, x, y, h, PAL.metal[2]);
  const sx = x + 1, sy = y + 1, sw = w - 2, sh = h - 3;
  const r = rng(seed * 7 + 3);
  if (kind === 'off') {
    gradV(g, sx, sy, sw, sh, [PAL.metal[1], PAL.ink[1]]);
  } else if (kind === 'chart') {
    gradV(g, sx, sy, sw, sh, [PAL.blue[1], PAL.blue[2]]);
    for (let gy = sy + 3; gy < sy + sh; gy += 4) for (let gx = sx; gx < sx + sw; gx += 2) px(g, gx, gy, PAL.blue[3]);
    let py = sy + sh - 2 - Math.floor(r() * (sh * 0.5));
    const col = [PAL.gold[5], PAL.crt[5], '#ff8a70', PAL.teal[7]][seed % 4];
    for (let gx = sx; gx < sx + sw; gx++) {
      const ny = Math.max(sy + 1, Math.min(sy + sh - 2, py + Math.floor((r() - 0.5) * 4) + (gx % 7 === 0 ? -1 : 0)));
      px(g, gx, ny, col);
      if (gx % 2 === 0) for (let fy = ny + 1; fy < sy + sh; fy += 2) px(g, gx, fy, PAL.blue[3]);
      py = ny;
    }
  } else if (kind === 'bars') {
    gradV(g, sx, sy, sw, sh, [PAL.ink[2], PAL.ink[3]]);
    const n = Math.max(3, Math.floor(sw / 3));
    for (let i = 0; i < n; i++) {
      const bh = 2 + Math.floor(r() * (sh - 4)), c = [PAL.teal[5], PAL.gold[4], PAL.red[4], PAL.crt[4]][(i + seed) % 4];
      rect(g, sx + 1 + i * 3, sy + sh - 1 - bh, 2, bh, c);
    }
  } else if (kind === 'article') {
    rect(g, sx, sy, sw, sh, PAL.paper[6]);
    rect(g, sx, sy, sw, 2, PAL.blue[4]);
    rect(g, sx + 1, sy + 3, Math.floor(sw * 0.5), 2, PAL.ink[2]);
    for (let ly = sy + 6; ly < sy + sh - 1; ly += 2) hline(g, sx + 1, ly, sw - 2 - Math.floor(r() * 5), PAL.metal[5]);
  } else if (kind === 'dash') {
    gradV(g, sx, sy, sw, sh, [PAL.ink[2], PAL.blue[1]]);
    rect(g, sx + 1, sy + 1, Math.floor(sw / 2) - 1, 4, PAL.teal[4]);
    rect(g, sx + Math.floor(sw / 2) + 1, sy + 1, Math.floor(sw / 2) - 2, 4, PAL.gold[3]);
    for (let i = 0; i < 4; i++) rect(g, sx + 1 + i * 4, sy + sh - 1 - Math.floor(r() * 5 + 1), 3, 1 + Math.floor(r() * 5), PAL.crt[4]);
  } else if (kind === 'code') {
    gradV(g, sx, sy, sw, sh, [PAL.ink[1], PAL.ink[2]]);
    for (let ly = sy + 1; ly < sy + sh - 1; ly += 2) {
      let lx = sx + 1 + Math.floor(r() * 3);
      const n = 1 + Math.floor(r() * 3);
      for (let k = 0; k < n && lx < sx + sw - 2; k++) {
        const lw = 2 + Math.floor(r() * 6);
        hline(g, lx, ly, Math.min(lw, sx + sw - 1 - lx), [PAL.crt[5], '#e070e0', PAL.blue[6], PAL.gold[5], '#ff7060'][Math.floor(r() * 5)]);
        lx += lw + 1;
      }
    }
  } else if (kind === 'saver') {
    rect(g, sx, sy, sw, sh, PAL.ink[0]);
    const k = (t / 1400 + seed * 0.37) % 1, k2 = (t / 2300 + seed * 0.21) % 1;
    const bx = sx + 1 + Math.floor(Math.abs(((k * 2) % 2) - 1) * (sw - 8)), by = sy + 1 + Math.floor(Math.abs(((k2 * 2) % 2) - 1) * (sh - 5));
    rect(g, bx, by, 6, 3, PAL.blue[5]); hline(g, bx, by, 6, PAL.blue[7]);
  } else if (kind === 'pie') {
    rect(g, sx, sy, sw, sh, PAL.paper[6]);
    const cx = sx + (sw >> 1), cy = sy + (sh >> 1), rr = Math.min(sw, sh) / 2 - 1;
    ellipse(g, cx, cy, rr, rr, (xx, yy) => { const a = (Math.atan2(yy - cy, xx - cx) + Math.PI) / (Math.PI * 2); return a < 0.55 ? PAL.teal[5] : a < 0.85 ? PAL.gold[4] : PAL.red[4]; });
  } else if (kind === 'map') {
    gradV(g, sx, sy, sw, sh, [PAL.blue[2], PAL.blue[3]]);
    for (let i = 0; i < 6; i++) rect(g, sx + Math.floor(r() * (sw - 4)), sy + Math.floor(r() * (sh - 3)), 2 + Math.floor(r() * 4), 1 + Math.floor(r() * 3), PAL.crt[3]);
  }
  ditherOverlay(g, sx, sy, sw, 2, '#ffffff', 0.1);
  // peana
  const cx = x + (w >> 1);
  rect(g, cx - 1, y + h - 2, 2, 2, PAL.metal[2]);
  rect(g, cx - 4, y + h, 8, 1, PAL.metal[3]); hline(g, cx - 4, y + h, 8, PAL.metal[4]);
  if (o.led !== false && kind !== 'off') px(g, x + w - 3, y + h - 2, PAL.crt[5]);
}

// ------------------------------------------------------------------ chaquetas y sillas (vistas de espaldas)
export const JACKETS = {
  beige: [PAL.paper[1], PAL.paper[2], PAL.paper[3], PAL.paper[4], PAL.paper[5]],
  navy: [PAL.blue[0], PAL.blue[1], PAL.blue[2], PAL.blue[3], PAL.blue[4]],
  grey: [PAL.metal[0], PAL.metal[1], PAL.metal[2], PAL.metal[3], PAL.metal[4]],
  burdeos: [PAL.red[0], PAL.red[1], PAL.red[2], PAL.red[3], PAL.red[4]],
  olive: [PAL.green[0], PAL.green[1], PAL.green[2], PAL.green[3], PAL.green[4]],
  camel: [PAL.wood[2], PAL.wood[3], PAL.wood[4], PAL.wood[5], PAL.wood[6]],
  black: [PAL.ink[0], PAL.ink[1], PAL.ink[2], PAL.ink[3], PAL.metal[1]],
};
/** chaqueta colgada del respaldo; (cx, top) = centro y borde superior del respaldo */
export function jacketOn(g, cx, top, ramp = JACKETS.grey, o = {}) {
  const w = o.w || 15;
  const x0 = cx - (w >> 1);
  // hombros y cuerpo
  poly(g, [[x0 + 1, top - 1], [x0 + w - 1, top - 1], [x0 + w + 1, top + 3], [x0 + w, top + 11], [x0 - 0, top + 11], [x0 - 1, top + 3]],
    (xx, yy) => ditherPick(xx, yy, [ramp[3], ramp[2], ramp[1]], ((xx - x0) / w) * 0.8 + (yy - top) / 18));
  // solapa / cuello
  hline(g, x0 + 2, top - 1, w - 4, ramp[4]);
  poly(g, [[cx - 3, top - 1], [cx + 3, top - 1], [cx + 1, top + 3], [cx - 1, top + 3]], ramp[1]);
  // pliegues
  vline(g, cx - 3, top + 3, 7, ramp[1]); vline(g, cx + 3, top + 4, 6, ramp[1]);
  vline(g, x0 + 1, top + 2, 8, ramp[4]);
  // mangas colgando a los lados
  rect(g, x0 - 2, top + 3, 2, 9, ramp[2]); vline(g, x0 - 2, top + 3, 9, ramp[3]);
  rect(g, x0 + w, top + 3, 2, 9, ramp[1]);
  // etiqueta cuello
  if (o.label) px(g, cx, top + 2, PAL.paper[6]);
}
/** silla de oficina vista de espaldas. (cx, by) = suelo bajo el pie central. o.col rampa, o.jacket rampa|null, o.turn -1/0/1 (giro) */
export function chairBack(g, cx, by, o = {}) {
  const c = o.col || [PAL.metal[1], PAL.metal[2], PAL.metal[3], PAL.metal[4], PAL.metal[5]];
  shadowEllipse(g, cx + (o.turn || 0), by, 9, 2, 0.75);
  // patas estrella + ruedas
  hline(g, cx - 6, by - 2, 13, PAL.metal[2]); hline(g, cx - 5, by - 3, 11, PAL.metal[4]);
  px(g, cx - 6, by - 1, PAL.ink[0]); px(g, cx + 6, by - 1, PAL.ink[0]); px(g, cx, by - 1, PAL.ink[0]); px(g, cx - 3, by - 1, PAL.ink[0]); px(g, cx + 3, by - 1, PAL.ink[0]);
  rect(g, cx - 1, by - 8, 2, 5, PAL.metal[3]);
  // asiento (borde trasero)
  rect(g, cx - 7, by - 11, 15, 3, c[2]); hline(g, cx - 7, by - 11, 15, c[4]); hline(g, cx - 7, by - 9, 15, c[0]);
  // respaldo
  const t = by - 25;
  rect(g, cx - 6, t, 13, 14, c[2]);
  paint(g, cx - 5, t + 1, 11, 12, (xx, yy) => ((xx + yy) & 1 ? c[3] : c[2]));
  hline(g, cx - 6, t, 13, c[4]); vline(g, cx - 6, t, 14, c[4]); vline(g, cx + 6, t, 14, c[0]); hline(g, cx - 6, t + 13, 13, c[0]);
  rect(g, cx - 2, t + 14, 4, 2, c[1]);
  if (o.jacket) jacketOn(g, cx, t + 1, o.jacket);
}

// ------------------------------------------------------------------ mesas
/** mesa de oficina vista de frente: x..x+w, tapa a y, patas hasta y+h. Devuelve y de la superficie. */
export function deskFront(g, x, y, w, h, o = {}) {
  const top = o.top || [PAL.paper[4], PAL.paper[5], PAL.paper[6]];
  const body = o.body || [PAL.paper[2], PAL.paper[3], PAL.paper[4]];
  shadowEllipse(g, x + w / 2, y + h, w / 2 + 4, 3, 0.7);
  // tapa (2 px de cara superior + canto)
  rect(g, x - 1, y, w + 2, 3, top[2]); hline(g, x - 1, y, w + 2, '#ffffff'); hline(g, x - 1, y + 1, w + 2, top[2]);
  hline(g, x - 1, y + 3, w + 2, body[0]);
  // faldón y frente
  gradV(g, x + 1, y + 4, w - 2, h - 4, [body[2], body[1], body[0]]);
  // panel frontal central (faldón)
  rect(g, x + 2, y + 4, w - 4, 6, body[1]);
  hline(g, x + 2, y + 4, w - 4, body[2]); hline(g, x + 2, y + 10, w - 4, body[0]);
  // patas
  rect(g, x, y + 4, 2, h - 4, body[0]); vline(g, x, y + 4, h - 4, body[2]);
  rect(g, x + w - 2, y + 4, 2, h - 4, body[0]);
  // hueco de rodillas oscuro
  gradV(g, x + 3, y + 11, w - 6, h - 12, [PAL.ink[2], PAL.ink[1]]);
  if (o.drawers) {
    const dw = Math.min(14, w >> 1);
    const dx = o.drawers === 'left' ? x + 3 : x + w - dw - 3;
    for (let i = 0; i < 3; i++) {
      const dy = y + 11 + i * ((h - 13) / 3 | 0);
      bevel(g, dx, dy, dw, ((h - 13) / 3 | 0) - 1, body[2], body[2] === undefined ? undefined : shade(body[2], 0.2), body[0]);
      rect(g, dx + (dw >> 1) - 2, dy + 2, 4, 1, PAL.metal[5]);
    }
  }
  return y;
}

// ------------------------------------------------------------------ vidrio
/** persiana veneciana (lamas) sobre un hueco: down = alto bajado */
export function blinds(g, x, y, w, h, o = {}) {
  const down = o.down ?? h;
  const base = o.color || PAL.paper;
  rect(g, x, y - 2, w, 3, base[2]);
  for (let by = y + 1; by < y + down; by += 3) {
    hline(g, x, by, w, base[5]); hline(g, x, by + 1, w, base[3]);
    if (o.shadow !== false) hline(g, x, by + 2, w, base[1]);
  }
  // cordón y tirador
  vline(g, x + w - 5, y, down + 3, base[1]); rect(g, x + w - 6, y + down + 3, 3, 2, base[4]);
  hline(g, x, y + down + 1, w, base[1]);
  // viga inferior
  rect(g, x, y + down, w, 2, base[3]); hline(g, x, y + down, w, base[6] || base[5]);
}
/** lluvia animada sobre un cristal: streaks que resbalan + gotas fijas */
export function rainOnGlass(g, x, y, w, h, t, seed = 1, o = {}) {
  g.save();
  g.beginPath(); g.rect(x, y, w, h); g.clip();
  const n = Math.max(4, Math.floor(w / (o.dens || 5)));
  for (let i = 0; i < n; i++) {
    const rx = x + Math.floor(hash2(i, 1, seed) * w);
    const sp = 22 + hash2(i, 2, seed) * 34;
    const off = hash2(i, 3, seed) * (h + 12);
    const yy = y + ((t / 1000 * sp + off) % (h + 12)) - 6;
    g.globalAlpha = 0.5;
    px(g, rx, yy, o.color || '#b6cae8');
    g.globalAlpha = 0.28;
    px(g, rx, yy - 1, o.color || '#b6cae8'); px(g, rx, yy - 2, o.color || '#b6cae8');
  }
  g.globalAlpha = 0.35;
  for (let i = 0; i < n * 0.8; i++) {
    const rx = x + Math.floor(hash2(i, 7, seed) * w), ry = y + Math.floor(hash2(i, 8, seed) * h);
    px(g, rx, ry, '#d8e4f6'); px(g, rx, ry + 1, '#8ea6cc');
  }
  g.restore();
}
/** cristal de ventana con ciudad nocturna lluviosa (estático): neblina + brillos de farolas */
export function rainyGlassStatic(g, x, y, w, h, seed = 4) {
  const r = rng(seed);
  for (let i = 0; i < w * h / 70; i++) {
    const rx = x + Math.floor(r() * w), ry = y + Math.floor(r() * (h - 8));
    const l = 2 + Math.floor(r() * 5);
    g.save(); g.globalAlpha = 0.16; vline(g, rx, ry, l, '#c8d8f0'); g.restore();
  }
}

/** un cable que cuelga (curva simple) */
export function cable(g, x0, y0, x1, y1, sag, c = PAL.ink[0], steps = 24) {
  let lx = x0, ly = y0;
  for (let i = 1; i <= steps; i++) {
    const tt = i / steps;
    const cx = x0 + (x1 - x0) * tt, cy = y0 + (y1 - y0) * tt + Math.sin(tt * Math.PI) * sag;
    line(g, lx, ly, Math.round(cx), Math.round(cy), c); lx = Math.round(cx); ly = Math.round(cy);
  }
}

/** cabeza + hombros de espaldas (figurante sentado). (cx, headTop) */
export function personBack(g, cx, headTop, o = {}) {
  const hair = o.hair || PAL.wood[1], shirt = o.shirt || JACKETS.grey, skin = o.skin || PAL.skin;
  const hw = o.hw || 5;
  // cuello y hombros
  rect(g, cx - 2, headTop + 9, 4, 3, skin[3]);
  poly(g, [[cx - hw - 3, headTop + 15], [cx - hw - 1, headTop + 11], [cx + hw + 1, headTop + 11], [cx + hw + 3, headTop + 15], [cx + hw + 3, headTop + 24], [cx - hw - 3, headTop + 24]],
    (xx, yy) => ditherPick(xx, yy, [shirt[3], shirt[2], shirt[1]], ((xx - cx + hw + 3) / (hw * 2 + 6)) * 0.9 + (yy - headTop) / 60));
  vline(g, cx, headTop + 13, 10, shirt[1]);
  // cabeza
  ellipse(g, cx, headTop + 4, hw, 5, (xx, yy, d) => (d > 0.75 ? shade(hair, -0.2) : hair));
  hline(g, cx - 2, headTop - 1, 4, shade(hair, 0.3));
  px(g, cx - hw, headTop + 5, skin[3]); px(g, cx + hw - 1, headTop + 5, skin[2]);   // orejas
  if (o.cans) {
    // cascos: arco + auriculares
    for (let a = -hw; a <= hw; a++) { const yy = headTop + 1 - Math.round(Math.sqrt(Math.max(0, 1 - (a / (hw + 1)) ** 2)) * 1); px(g, cx + a, yy - 3 + 3, PAL.ink[1]); }
    rect(g, cx - hw - 1, headTop + 3, 2, 5, PAL.ink[1]); rect(g, cx + hw - 1, headTop + 3, 2, 5, PAL.ink[1]);
    px(g, cx - hw - 1, headTop + 4, PAL.metal[4]); px(g, cx + hw, headTop + 4, PAL.metal[4]);
  }
}
void glaze; void gradH; void noise; void glow; void dither; void frameRect; void mix; void bayer;
