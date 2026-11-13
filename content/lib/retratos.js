// RETRATOS de quien llama por teléfono (pantalla del móvil, engine/phone.js). Archivo compartido.
// Cada retrato es `(g, w, h, st)`: pinta en un recuadro de w×h (72×54) con origen en (0,0), en pixel art procedural.
// `st` = { mouth: 0 cerrada | 1 entreabierta | 2 abierta, blink: bool, t: ms }. Se registran en actors.js (`portrait`).
// Mismos colores que el sprite del actor (content/actors.js), dibujados en grande y con más cariño.
import { PAL, rect, px, hline, vline, line, ellipse, poly, ditherOverlay, hash2 } from '../../engine/draw.js';

const dots = (g, x0, y0, w, h, c, step, seed) => {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (hash2(x, y, seed) < 1 / step) px(g, x, y, c);
};

/** Abuela Remedios: moño blanco, gafas redondas con cadenita, vestido azul de lunares, móvil con purpurina. */
export function retratoAbuela(g, w, h, st) {
  const cx = w >> 1, t = st.t || 0;
  // papel pintado de salón de pueblo: rayas crema y florecitas
  rect(g, 0, 0, w, h, '#ead9b6');
  for (let x = 2; x < w; x += 6) vline(g, x, 0, h, '#e0cb9f');
  for (let y = 4; y < h; y += 11) for (let x = (y % 22 === 4 ? 3 : 9); x < w; x += 12) {
    px(g, x, y, '#e29ab0'); px(g, x - 1, y, '#e8b4c4'); px(g, x + 1, y, '#e8b4c4'); px(g, x, y - 1, '#e8b4c4'); px(g, x, y + 1, '#e8b4c4'); px(g, x, y, '#f4dc90');
  }
  ditherOverlay(g, 0, 0, w, 8, '#fff4d8', 0.25);
  // vestido azul de lunares (hombros)
  ellipse(g, cx, h + 8, 31, 22, (x, y, d) => (d > 0.86 ? '#4e6fa6' : x < cx - 4 ? '#8cb0e4' : '#7aa0d8'));
  paintDots(g, cx, h + 8, 31, 22);
  // cuello
  rect(g, cx - 4, 34, 9, 8, '#d9a984'); rect(g, cx - 4, 34, 4, 8, '#e7bd9a');
  // cuello de encaje y collar de perlas
  poly(g, [[cx - 9, 40], [cx + 9, 40], [cx + 1, 50], [cx - 1, 50]], '#f6f1e2');
  for (let i = 0; i < 9; i++) { const a = i / 8, xx = Math.round(cx - 8 + a * 16), yy = Math.round(42 + Math.sin(a * Math.PI) * 4); px(g, xx, yy, '#fffaf4'); px(g, xx, yy + 1, '#d8d0d0'); }
  for (let i = 0; i < 6; i++) px(g, cx - 8 + i * 3, 41, '#e0d4c0');
  // pelo trasero y moño
  ellipse(g, cx, 20, 16, 18, '#cfcfd8');
  ellipse(g, cx, 4, 8, 6, (x, y, d) => (d > 0.7 ? '#cfcfd8' : x < cx ? '#fafafa' : '#e6e6ee'));
  for (let i = 0; i < 5; i++) line(g, cx - 5 + i, 1 + (i % 2), cx - 3 + i * 2, 6, '#d2d2dc');
  hline(g, cx - 3, 8, 7, '#a8a8b4');                                    // redecilla
  line(g, cx - 4, 2, cx + 5, 6, '#c8a860'); px(g, cx + 5, 6, '#e8d080'); // horquilla
  // cara
  ellipse(g, cx, 23, 13, 15, (x, y, d) => (d > 0.86 ? '#d4a47e' : x < cx - 3 ? '#f7d4b6' : '#f0c8a8'));
  // orejas con pendientes de perla
  ellipse(g, cx - 13, 25, 2, 3, '#e4b898'); ellipse(g, cx + 13, 25, 2, 3, '#d9a984');
  px(g, cx - 13, 29, '#fffafa'); px(g, cx - 13, 30, '#e0d8d8'); px(g, cx + 13, 29, '#fffafa'); px(g, cx + 13, 30, '#e0d8d8');
  // flequillo blanco
  poly(g, [[cx - 14, 24], [cx - 15, 14], [cx - 9, 7], [cx + 9, 7], [cx + 15, 14], [cx + 14, 24], [cx + 11, 17], [cx + 6, 12], [cx - 1, 11], [cx - 7, 13], [cx - 11, 19]],
    (x, y) => ((x + y) % 5 === 0 ? '#dcdce6' : '#f6f6fa'));
  line(g, cx - 9, 11, cx - 2, 9, '#ffffff'); line(g, cx + 2, 9, cx + 9, 11, '#e0e0ea');
  // cejas
  hline(g, cx - 11, 17, 6, '#b8b8c4'); hline(g, cx + 5, 17, 6, '#b8b8c4'); px(g, cx - 12, 18, '#b8b8c4'); px(g, cx + 11, 18, '#b8b8c4');
  // gafas redondas
  for (const sx of [-6, 6]) {
    ellipse(g, cx + sx, 23, 5.5, 4.8, '#8a6a5a');
    ellipse(g, cx + sx, 23, 4.5, 3.8, '#e4f2f6');
    if (st.blink) hline(g, cx + sx - 2, 23, 5, '#6a4a3c');
    else { rect(g, cx + sx - 1, 22, 2, 3, '#3a2a2a'); px(g, cx + sx - 1, 22, '#ffffff'); }
    px(g, cx + sx - 3, 21, '#ffffff'); px(g, cx + sx - 2, 20, '#ffffff');
  }
  hline(g, cx - 1, 22, 3, '#8a6a5a'); hline(g, cx - 14, 22, 3, '#8a6a5a'); hline(g, cx + 12, 22, 3, '#8a6a5a');
  // cadenita de las gafas
  for (let i = 0; i < 4; i++) { px(g, cx - 14 - (i % 2), 24 + i * 2, '#c8b8a0'); px(g, cx + 15 + (i % 2), 24 + i * 2, '#c8b8a0'); }
  // nariz, mejillas, arrugas
  px(g, cx, 26, '#d4967a'); px(g, cx + 1, 27, '#d4967a'); hline(g, cx - 1, 28, 3, '#e0a888'); px(g, cx - 1, 27, '#fbe0c8');
  ditherOverlay(g, cx - 11, 27, 6, 4, '#e88c94', 0.45); ditherOverlay(g, cx + 6, 27, 6, 4, '#e88c94', 0.45);
  px(g, cx - 10, 31, '#cf9c78'); px(g, cx - 10, 32, '#cf9c78'); px(g, cx + 10, 31, '#cf9c78'); px(g, cx + 10, 32, '#cf9c78');
  // boca: 0 sonrisa, 1 entreabierta, 2 abierta (dentadura)
  const my = 33;
  if (st.mouth === 0) { hline(g, cx - 3, my, 7, '#c0525c'); px(g, cx - 4, my - 1, '#c0525c'); px(g, cx + 4, my - 1, '#c0525c'); hline(g, cx - 2, my + 1, 5, '#e47a86'); }
  else if (st.mouth === 1) { rect(g, cx - 3, my - 1, 7, 3, '#6a1c28'); hline(g, cx - 3, my - 1, 7, '#fff6ee'); hline(g, cx - 4, my - 2, 9, '#d0606c'); hline(g, cx - 3, my + 2, 7, '#d0606c'); }
  else { rect(g, cx - 4, my - 2, 9, 5, '#5a1420'); hline(g, cx - 3, my - 2, 7, '#fff6ee'); rect(g, cx - 2, my + 1, 5, 2, '#dc6a7c'); hline(g, cx - 5, my - 3, 11, '#d0606c'); hline(g, cx - 4, my + 3, 9, '#d0606c'); }
  // móvil con purpurina pegado a la oreja (lado derecho de la imagen)
  rect(g, cx + 14, 17, 8, 17, '#c8409c'); rect(g, cx + 14, 17, 8, 1, '#f080d0'); vline(g, cx + 14, 17, 17, '#f080d0'); vline(g, cx + 21, 18, 16, '#8c2a70');
  for (let i = 0; i < 9; i++) { const gx = cx + 15 + (i * 5) % 6, gy = 19 + (i * 7) % 13, on = ((t / 140 + i * 3) | 0) % 5 === 0; px(g, gx, gy, on ? '#ffffff' : '#ffb8ea'); }
  rect(g, cx + 17, 33, 6, 4, '#e4b898'); hline(g, cx + 17, 33, 6, '#f0c8a8'); hline(g, cx + 17, 36, 6, '#cf9c78');
}
function paintDots(g, cx, cy, rx, ry) {
  for (let y = 38; y < 54; y++) for (let x = cx - rx; x < cx + rx; x++) {
    const dx = (x - cx) / rx, dy = (y - cy) / ry;
    if (dx * dx + dy * dy > 0.84) continue;
    if (((x + (y >> 1) % 2 * 3) % 6 === 0) && y % 4 === 1) { px(g, x, y, '#ffd0e4'); px(g, x + 1, y, '#f0b0cc'); }
  }
}

/** Evaristo Salvedad (Controlling): chaqueta de punto gris perla, corbata con comas, lupa al cuello, lápiz bicolor. */
export function retratoEvaristo(g, w, h, st) {
  const cx = w >> 1;
  // despacho: pared gris azulada, estantería de archivadores y una lámpara
  rect(g, 0, 0, w, h, '#b8c0d0');
  ditherOverlay(g, 0, 0, w, h, '#9aa4ba', 0.18);
  rect(g, 0, 36, 12, 18, '#6a5a48'); for (let i = 0; i < 6; i++) { rect(g, 1 + i * 2, 37, 1, 16, ['#a03a3a', '#3a5a9a', '#4a7a4a', '#c8a040'][i % 4]); }
  rect(g, w - 12, 30, 12, 24, '#6a5a48'); for (let i = 0; i < 5; i++) rect(g, w - 11 + i * 2, 31, 1, 22, ['#3a5a9a', '#a03a3a', '#c8a040', '#4a7a4a'][i % 4]);
  // hombros: chaqueta de punto
  ellipse(g, cx, h + 10, 30, 24, (x, y, d) => (d > 0.86 ? '#8a8d96' : x < cx - 4 ? '#cfd2da' : '#b9bcc4'));
  for (let y = 40; y < 54; y += 2) for (let x = cx - 28; x < cx + 28; x += 2) if (((x + y) >> 1) % 2 === 0 && Math.abs(x - cx) > 8) px(g, x, y, '#a6a9b2');
  // camisa y corbata con comas
  poly(g, [[cx - 8, 38], [cx + 8, 38], [cx + 3, 46], [cx - 3, 46]], '#f4f2ea');
  poly(g, [[cx - 2, 41], [cx + 2, 41], [cx + 4, 54], [cx - 4, 54]], '#33427a');
  for (let i = 0; i < 4; i++) { px(g, cx - 1 + (i % 2), 44 + i * 3, '#f2ecc4'); px(g, cx - 1 + (i % 2), 45 + i * 3, '#f2ecc4'); }
  // botones
  px(g, cx - 12, 50, '#7a7d86'); px(g, cx + 12, 50, '#7a7d86');
  // cordón y lupa
  line(g, cx - 8, 38, cx + 6, 49, '#8a6a3a'); line(g, cx + 8, 38, cx + 7, 49, '#8a6a3a');
  ellipse(g, cx + 7, 51, 4, 4, '#F0F0A8'); ellipse(g, cx + 7, 51, 2.5, 2.5, '#dbe8f0'); px(g, cx + 6, 50, '#ffffff');
  // cuello y cabeza
  rect(g, cx - 4, 33, 9, 7, '#c89c7c');
  ellipse(g, cx, 22, 12, 15, (x, y, d) => (d > 0.86 ? '#c89c7c' : x < cx - 3 ? '#f0cdac' : '#e8c4a4'));
  ellipse(g, cx - 12, 24, 2, 3, '#dcb394'); ellipse(g, cx + 12, 24, 2, 3, '#c89c7c');
  // pelo gris con raya
  poly(g, [[cx - 12, 20], [cx - 12, 12], [cx - 6, 6], [cx + 7, 6], [cx + 12, 12], [cx + 12, 20], [cx + 9, 14], [cx - 2, 11], [cx - 8, 14]], (x, y) => ((x + y) % 4 === 0 ? '#a0a2aa' : '#b4b6bc'));
  line(g, cx - 3, 7, cx - 1, 12, '#8e9098');
  px(g, cx - 12, 21, '#b4b6bc'); px(g, cx + 12, 21, '#b4b6bc'); rect(g, cx + 12, 19, 1, 4, '#b4b6bc');
  // lápiz bicolor tras la oreja
  line(g, cx + 12, 18, cx + 16, 12, '#c03030'); px(g, cx + 16, 12, '#2040a0'); px(g, cx + 17, 11, '#2040a0');
  // cejas (una levantada), ojos
  hline(g, cx - 9, 17, 5, '#8e9098'); hline(g, cx + 4, 15, 6, '#8e9098'); px(g, cx + 10, 16, '#8e9098');
  for (const sx of [-5, 5]) {
    rect(g, cx + sx - 2, 20, 5, 3, '#f8f6f0');
    if (st.blink) hline(g, cx + sx - 2, 21, 5, '#5a4030'); else { rect(g, cx + sx - 1, 20, 2, 3, '#3a3a4a'); px(g, cx + sx - 1, 20, '#ffffff'); }
    hline(g, cx + sx - 2, 23, 5, '#d4a888');                              // ojeras
  }
  // nariz, mejillas
  px(g, cx, 25, '#d49a7a'); px(g, cx + 1, 26, '#d49a7a'); hline(g, cx - 1, 27, 3, '#d8a484');
  px(g, cx - 9, 28, '#d8a484'); px(g, cx + 9, 28, '#d8a484');
  // boca: línea de funcionario; al hablar, precisa
  const my = 32;
  if (st.mouth === 0) { hline(g, cx - 3, my, 7, '#b0645c'); px(g, cx - 4, my + 1, '#b0645c'); px(g, cx + 4, my + 1, '#b0645c'); }
  else if (st.mouth === 1) { rect(g, cx - 3, my - 1, 7, 3, '#5a2a2a'); hline(g, cx - 3, my - 1, 7, '#f4f0e8'); hline(g, cx - 4, my - 2, 9, '#b0645c'); }
  else { rect(g, cx - 3, my - 2, 7, 5, '#4a1c1c'); hline(g, cx - 3, my - 2, 7, '#f4f0e8'); rect(g, cx - 1, my + 1, 3, 2, '#b85c64'); hline(g, cx - 4, my - 3, 9, '#b0645c'); }
  // mentón
  hline(g, cx - 2, 36, 5, '#d8a888');
}
