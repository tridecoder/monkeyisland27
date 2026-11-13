// SALA `office` — ARTE Y GEOMETRÍA (rediseño, docs/GUIA_REDISENO.md §4, §8, §10). Biblia §3.3 + adenda §3.5 / §8bis.
// Cocina de la redacción. De izquierda a derecha: puerta de la Pecera (placa «1 REDACCIÓN ◄»), nevera con su cartel,
// el ventanuco de Custodia (Secretaría de Redacción) con el cartel del material, pilastra, GERTRUDIS grande (66 px) en
// el centro y sin nada delante, pilastra, tablón (hilo del yogur, porra, hoja de firmas) sobre la encimera con la COLA
// DE NUEVE TUPPERS ante el microondas y el fregadero, y la puerta vieja de TALLERES con su placa esmaltada y, sobre el
// dintel, la placa del kit «1 CIERRE ▼ / REDACCIÓN DE PAPEL». Tres peldaños bajan hasta la Catacumba (medio nivel).
// En el plano medio, una mesa alta rompe el suelo vacío; el walkbox la rodea. Un cartel de «suelo mojado» hace de
// oclusor en el primer plano.
import {
  PAL, mix, shade, rect, hline, vline, frameRect, line, px, poly, ellipse, paint, gradV, gradH, bevel, noise, hash2,
  ditherOverlay, ditherPick, glow, vignette, shadowEllipse, trashBin, floorTiles,
} from '../../../engine/draw.js';
import * as kit from '../../lib/kit.js';

const W = 320;
const FL = 94; // línea pared / suelo

// geometría de los elementos (compartida por el dibujo y el layout)
const HATCH = { x: 91, y: 40, w: 36, h: 18 };          // hueco del ventanuco (los marcos, por fuera)
const GER_AT = [164, 96, 'down'];                      // pies de Gertrudis (máquina de 66 px: escala 1,5)
const MESA = { x: 214, y: 111, w: 36 };                // mesa alta: tablero y patas hasta y 134
const MESA_ZY = 136;

function tint(g, pts, color, alpha) { g.save(); g.globalAlpha = alpha; poly(g, pts, color); g.restore(); }

// ------------------------------------------------------------------ fondo
function paintBackground(g) {
  rect(g, 0, 0, W, 144, PAL.ink[1]);
  // techo bajo con dos fluorescentes apagados (el que parpadea va en animate)
  gradV(g, 0, 0, W, 8, [PAL.ink[1], PAL.metal[2], PAL.metal[3]]);
  hline(g, 0, 10, W, PAL.metal[1]);
  for (const lx of [34, 258]) { rect(g, lx - 2, 1, 50, 6, PAL.metal[2]); hline(g, lx - 2, 1, 50, PAL.metal[4]); rect(g, lx, 3, 46, 3, PAL.metal[4]); }
  // pared pintada (crema verdosa, manchas de grasa y humedad) hasta el filete
  const paintBase = [mix(PAL.paper[4], PAL.green[6], 0.45), mix(PAL.paper[3], PAL.green[5], 0.5), mix(PAL.paper[2], PAL.green[4], 0.5)];
  paint(g, 0, 11, W, 45, (xx, yy) => {
    const t = (yy - 11) / 45;
    let c = ditherPick(xx, yy, paintBase, t * 0.9);
    if (hash2(xx >> 1, yy, 6) < 0.05) c = paintBase[2];
    return c;
  });
  for (const [sx, sw] of [[8, 14], [140, 22], [270, 14]]) {
    paint(g, sx, 11, sw, 30, (xx, yy) => (hash2(xx, yy, 11) < 0.35 * (1 - (yy - 11) / 30) ? paintBase[2] : null));
  }
  // filete del departamento (Office, amarillo) + cenefa verde + azulejos amarilleados
  kit.filete(g, 0, W, 56, 'office');
  rect(g, 0, 59, W, 2, PAL.green[3]); hline(g, 0, 59, W, PAL.green[5]); hline(g, 0, 60, W, PAL.green[1]);
  paint(g, 0, 61, W, FL - 61, (xx, yy) => {
    const gx = xx % 8 === 0, gy = (yy - 61) % 8 === 0;
    if (gx || gy) return PAL.paper[2];
    const v = hash2(xx >> 3, (yy - 61) >> 3, 5);
    let c = ditherPick(xx, yy, [PAL.paper[4], PAL.paper[5], PAL.paper[6]], 0.35 + v * 0.45 - (yy - 61) / 90);
    if (((xx % 8) === 1 || (yy - 61) % 8 === 1)) c = PAL.paper[7];
    return c;
  });
  for (const gx of [92, 150, 236]) vline(g, gx, 61, 10 + (gx % 7), PAL.paper[2]);   // goteras de grasa
  rect(g, 0, FL - 3, W, 3, PAL.wood[1]); hline(g, 0, FL - 3, W, PAL.wood[3]);          // zócalo
  // suelo de linóleo en perspectiva, con el canto de goma oscuro bajo el zócalo
  floorTiles(g, { x: 0, y: FL, w: W, h: 144 - FL, vpx: 160, vpy: 30, tile: 20, rowPx: 8, colors: ['#c49a62', '#a47e52'], colors3: '#b08a58', grout: PAL.wood[1], far: PAL.wood[0], fade: 0.5 });
  // dos zonas de suelo con canto: la franja de goma del café (bajo Gertrudis) y el felpudo de imprenta ante TALLERES
  kit.zonaSuelo(g, 134, 196, FL, ['#3a3430', '#4a443c', '#5a5248'], { vpx: 165, vpy: 30, trama: 'baldosa', borde: '#7a6e5a', seed: 8 });
  kit.zonaSuelo(g, 272, 320, FL, kit.DEPTO.papel.suelo, { vpx: 300, vpy: 30, borde: '#8a6a44', seed: 9 });
  ditherOverlay(g, 0, FL, W, 5, PAL.ink[0], 0.55);
  rect(g, 0, FL, W, 1, PAL.ink[1]);

  doorLeft(g);
  fridge(g);
  hatchFrame(g);
  secretaria(g);
  kit.pilastra(g, 131, 11, FL);
  kit.pilastra(g, 193, 11, FL);
  ledPanel(g);
  matGertrudis(g);
  corkboard(g);
  counter(g);
  doorRight(g);
  props(g);
  // luz del fluorescente sobre pared y suelo
  glow(g, 164, 46, 80, 40, '#f4ffd8', 0.07, 5);
  glow(g, 164, 114, 90, 14, '#f4ffd8', 0.07, 5);
  vignette(g, W, 144, 0.55);
}

// ------------------------------------------------------------------ puerta de la Pecera (placa del kit + umbral)
function doorLeft(g) {
  const x = 6, y = 36, w = 32, h = FL - 36;
  kit.marcoPuerta(g, x, y, w, h);
  gradH(g, x, y, w, h, [PAL.green[5], PAL.green[4], PAL.green[3]]);
  // ventanilla con cristal armado: se ve el resplandor azul de las pantallas de la Pecera
  const gx = x + 5, gy = y + 6, gw = w - 10, gh = 22;
  rect(g, gx - 1, gy - 1, gw + 2, gh + 2, PAL.green[1]);
  paint(g, gx, gy, gw, gh, (xx, yy) => ditherPick(xx, yy, [PAL.night[2], PAL.night[3], PAL.blue[4], PAL.blue[5]], 0.2 + (yy - gy) / gh * 0.4 + (xx - gx) / gw * 0.15));
  for (let k = 0; k < 3; k++) rect(g, gx + 2 + k * 7, gy + 11, 5, 6, PAL.crt[3 + (k % 2)]);
  for (let i = 0; i <= gw; i += 4) vline(g, gx + i, gy, gh, PAL.night[1]);
  for (let j = 0; j <= gh; j += 4) hline(g, gx, gy + j, gw, PAL.night[1]);
  tint(g, [[gx + 2, gy], [gx + 8, gy], [gx, gy + 14], [gx - 2, gy + 14]], '#ffffff', 0.14);
  rect(g, x + 4, y + 34, w - 8, 16, PAL.green[3]); frameRect(g, x + 4, y + 34, w - 8, 16, PAL.green[2]);
  hline(g, x + 5, y + 35, w - 10, PAL.green[6]);
  rect(g, x + w - 7, y + 26, 2, 5, PAL.gold[3]); px(g, x + w - 7, y + 26, PAL.gold[6]);
  rect(g, x + 2, y + h - 8, w - 4, 6, PAL.metal[4]); hline(g, x + 2, y + h - 8, w - 4, PAL.metal[6]);   // chapa antipatadas
  glow(g, x + w + 6, y + 30, 10, 26, '#6aa0ff', 0.07, 3);
  kit.cantoVivo(g, x, y, w, h);
  kit.placaSala(g, 4, 11, 'pecera', { flecha: '<' });
  kit.umbral(g, x - 2, FL + 1, w + 4, 6, kit.DEPTO.redaccion.c, { chevron: true });
}

// ------------------------------------------------------------------ nevera (cartel entero de la biblia)
function fridge(g) {
  const x = 44, y = 32, w = 40, h = FL - 32;
  shadowEllipse(g, x + w / 2, FL + 1, w / 2 + 3, 2.5, 0.8);
  gradH(g, x, y, w, h, [PAL.paper[7], PAL.paper[6], PAL.paper[5], PAL.paper[3]]);
  rect(g, x, y, 1, 1, PAL.ink[1]); rect(g, x + w - 1, y, 1, 1, PAL.ink[1]);
  vline(g, x, y + 1, h - 1, PAL.paper[7]); vline(g, x + w - 1, y + 1, h - 1, PAL.paper[2]);
  hline(g, x + 1, y, w - 2, PAL.paper[7]); hline(g, x, y + h - 1, w, PAL.paper[1]);
  ditherOverlay(g, x + w - 4, y, 4, h, PAL.ink[0], 0.3);
  hline(g, x, y + 22, w, PAL.paper[2]); hline(g, x, y + 23, w, PAL.paper[7]);               // junta congelador
  rect(g, x + w - 6, y + 4, 2, 14, PAL.metal[4]); vline(g, x + w - 6, y + 4, 14, PAL.metal[7]);   // tiradores
  rect(g, x + w - 6, y + 27, 2, 20, PAL.metal[4]); vline(g, x + w - 6, y + 27, 20, PAL.metal[7]);
  // cartel «ETIQUETAD VUESTROS TUPPERS» (cartulina amarilla pegada con celo)
  rect(g, x + 1, y + 6, 37, 17, '#f4e48c'); frameRect(g, x + 1, y + 6, 37, 17, PAL.gold[3]);
  kit.micro(g, 'ETIQUETAD', x + 2, y + 8, PAL.red[3]); kit.micro(g, 'VUESTROS', x + 2, y + 13, PAL.red[3]); kit.micro(g, 'TUPPERS', x + 2, y + 18, PAL.red[3]);
  px(g, x + 1, y + 6, PAL.paper[7]); px(g, x + 37, y + 6, PAL.paper[7]);
  // imanes, fotos y notas
  const mg = [[8, 30, PAL.red[4]], [16, 33, PAL.blue[5]], [24, 30, PAL.leaf[5]], [10, 40, PAL.gold[5]], [20, 42, PAL.red[3]], [28, 38, PAL.teal[5]], [14, 49, PAL.purple[5]], [26, 49, PAL.red[4]]];
  mg.forEach(([mx, my, c]) => { rect(g, x + mx, y + my, 3, 3, c); px(g, x + mx, y + my, PAL.paper[7]); });
  rect(g, x + 6, y + 36, 8, 6, PAL.paper[7]); frameRect(g, x + 6, y + 36, 8, 6, PAL.paper[3]); hline(g, x + 7, y + 38, 6, PAL.blue[4]);
  rect(g, x + 22, y + 44, 9, 8, '#f4c0c8'); hline(g, x + 23, y + 46, 7, PAL.red[3]); hline(g, x + 23, y + 48, 5, PAL.red[3]);
  rect(g, x + 4, y + 53, 15, 6, PAL.paper[6]); kit.micro(g, 'RAMIREZ', x + 5, y + 54, PAL.red[3]);     // «RAMÍREZ NO SE TOCA»
  kit.cantoVivo(g, x, y, w, h);
}

// ------------------------------------------------------------------ ventanuco de Custodia (fondo; las manos son un objeto animado)
function hatchFrame(g) {
  const { x, y, w, h } = HATCH;
  // cartel «EL MATERIAL NO SE PIDE. SE MERECE.» encima del ventanuco (no de Gertrudis)
  const cx = 86, cy = 14, cw = 46, ch = 21;
  ditherOverlay(g, cx + 2, cy + 2, cw, ch, PAL.ink[0], 0.45);
  rect(g, cx, cy, cw, ch, PAL.paper[6]); frameRect(g, cx, cy, cw, ch, PAL.metal[2]); frameRect(g, cx + 1, cy + 1, cw - 2, ch - 2, PAL.red[3]);
  kit.micro(g, 'EL MATERIAL', cx + (cw >> 1), cy + 3, PAL.ink[1], { align: 'center' });
  kit.micro(g, 'NO SE PIDE.', cx + (cw >> 1), cy + 9, PAL.ink[1], { align: 'center' });
  kit.micro(g, 'SE MERECE.', cx + (cw >> 1), cy + 14, PAL.red[3], { align: 'center' });
  kit.cantoVivo(g, cx, cy, cw, ch);
  // marco metálico y sombra interior
  rect(g, x - 3, y - 3, w + 6, h + 9, PAL.metal[2]); frameRect(g, x - 3, y - 3, w + 6, h + 9, PAL.metal[1]);
  hline(g, x - 2, y - 2, w + 4, PAL.metal[5]); vline(g, x - 2, y - 2, h + 8, PAL.metal[4]);
  // interior oscuro con estantes y archivadores a la luz de un flexo verde
  rect(g, x, y, w, h, PAL.ink[0]);
  gradH(g, x, y, w, h, [PAL.ink[0], '#10281a', PAL.ink[0]]);
  for (let sy = y + 2; sy < y + h - 4; sy += 5) {
    hline(g, x, sy + 4, w, PAL.metal[1]);
    for (let k = 0; k < 11; k++) rect(g, x + 2 + k * 3, sy, 2, 4, [PAL.wood[2], PAL.green[2], PAL.paper[2], PAL.red[2]][(k * 7 + sy) % 4]);
  }
  glow(g, x + 28, y + 6, 12, 6, '#c8f0a0', 0.25, 3);
  // alféizar de madera (mostrador estrecho)
  rect(g, x - 4, y + h, w + 8, 5, PAL.wood[4]); hline(g, x - 4, y + h, w + 8, PAL.wood[7]); hline(g, x - 4, y + h + 4, w + 8, PAL.wood[1]);
  ditherOverlay(g, x - 2, y + h + 5, w + 4, 3, PAL.ink[0], 0.5);
}
function drawBell(g) {
  // timbre de mostrador con pegatina «NO», con su canto vivo (es interactivo)
  const bx = 108, by = 53;
  rect(g, bx, by + 7, 12, 3, PAL.metal[4]); hline(g, bx, by + 7, 12, PAL.metal[7]); hline(g, bx, by + 9, 12, PAL.metal[1]);
  ellipse(g, bx + 6, by + 5, 5, 3, (xx, yy, d) => ditherPick(xx, yy, [PAL.gold[6], PAL.gold[4], PAL.gold[3]], d));
  px(g, bx + 6, by + 1, PAL.metal[7]); px(g, bx + 5, by + 2, PAL.gold[6]);
  rect(g, bx + 3, by + 6, 6, 3, PAL.paper[7]); kit.micro(g, 'N', bx + 3, by + 4, PAL.red[3], { registrar: false }); px(g, bx + 8, by + 8, PAL.red[3]);
  kit.cantoVivo(g, bx, by, 12, 10);
}
function drawCustodia(g, view, t) {
  const { x, y, w } = HATCH;
  const T = t || 0;
  // persiana metálica a media altura (lamas, tope inferior y asa)
  for (let ly = y - 1; ly < y + 7; ly += 2) { hline(g, x - 1, ly, w + 2, PAL.metal[4]); hline(g, x - 1, ly + 1, w + 2, PAL.metal[2]); }
  rect(g, x - 1, y + 7, w + 2, 2, PAL.metal[5]); hline(g, x - 1, y + 7, w + 2, PAL.metal[7]); hline(g, x - 1, y + 9, w + 2, PAL.ink[0]);
  rect(g, x + 15, y + 8, 5, 2, PAL.metal[3]);
  ditherOverlay(g, x, y + 10, w, 2, PAL.ink[0], 0.5);
  // llave con cinta roja colgando
  line(g, x + 31, y + 10, x + 31, y + 14, PAL.red[4], 2);
  rect(g, x + 30, y + 14, 3, 2, PAL.gold[5]); px(g, x + 31, y + 16, PAL.gold[4]);
  // esquina del libro negro
  poly(g, [[x + 1, y + 15], [x + 8, y + 15], [x + 8, y + 12], [x + 1, y + 11]], PAL.ink[1]); hline(g, x + 1, y + 11, 7, PAL.metal[3]);
  // manos con guantes de punto sin dedos: tamborilean; de vez en cuando cuentan con los dedos (dedos de 2 px, bien visibles)
  const cyc = T % 11000;
  const counting = cyc > 8000 && cyc < 10200;
  const nfing = counting ? 1 + Math.floor((cyc - 8000) / 700) : 0;
  const tap = Math.floor(T / 140);
  const hand = (hx, hy, right, ph) => {
    rect(g, hx, hy, 9, 5, PAL.purple[4]);
    for (let k = 0; k < 9; k += 2) vline(g, hx + k, hy, 5, PAL.purple[5]);
    hline(g, hx, hy + 4, 9, PAL.purple[2]); hline(g, hx, hy, 9, PAL.purple[6]);
    rect(g, hx + (right ? 8 : -1), hy + 1, 2, 4, PAL.purple[3]);
    for (let f = 0; f < 4; f++) {
      const up = counting && right ? (f < nfing ? 3 : 0) : ((tap + f * 2 + ph) % 6 === 0 ? 1 : 0);
      const fx = hx + f * 2 + (right ? 1 : 0);
      rect(g, fx, hy - 3 - up, 2, 3 + up, PAL.skin[4]); px(g, fx, hy - 3 - up, PAL.skin[5]); px(g, fx + 1, hy - 3 - up, PAL.skin[3]);
    }
  };
  hand(x + 3, y + 10, false, 0);
  hand(x + 24, y + 10, true, 3);
  glow(g, x + 22, y + 14, 18, 4, '#c8f0a0', 0.12, 3);
  kit.cantoVivo(g, x - 4, y - 3, w + 8, HATCH.h + 9);
  drawBell(g);
}

// cajonera de la Secretaría bajo el ventanuco (archivadores de madera)
function secretaria(g) {
  const x = 88, y = 66, w = 42;
  shadowEllipse(g, x + w / 2, FL + 1, w / 2 + 3, 2.5, 0.8);
  gradV(g, x, y + 3, w, FL - y - 3, [PAL.wood[4], PAL.wood[3], PAL.wood[2]]);
  noise(g, x, y + 3, w, FL - y - 3, PAL.wood[1], 0.05, 7);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
    const px0 = x + 3 + i * 19, py0 = y + 6 + j * 12;
    frameRect(g, px0, py0, 17, 10, PAL.wood[1]); hline(g, px0 + 1, py0 + 1, 15, PAL.wood[5]); vline(g, px0 + 1, py0 + 1, 8, PAL.wood[5]);
    rect(g, px0 + 6, py0 + 4, 5, 1, PAL.metal[6]);
    rect(g, px0 + 2, py0 + 2, 5, 3, PAL.paper[6]); px(g, px0 + 3, py0 + 3, PAL.ink[2]); px(g, px0 + 5, py0 + 3, PAL.ink[2]);   // etiquetas
  }
  rect(g, x, FL - 3, w, 3, PAL.ink[2]);
  rect(g, x - 1, y, w + 2, 3, PAL.metal[4]); hline(g, x - 1, y, w + 2, PAL.metal[7]);
}

// panel LED sobre Gertrudis: su estado en reposo (texto entero de la biblia)
function ledPanel(g) {
  const x = 138, y = 12, w = 54, h = 17;
  ditherOverlay(g, x + 1, y + 2, w, h, PAL.ink[0], 0.45);
  rect(g, x, y, w, h, PAL.ink[0]); frameRect(g, x, y, w, h, PAL.metal[3]); hline(g, x + 1, y + 1, w - 2, PAL.metal[1]);
  rect(g, x + 1, y + 2, w - 2, h - 3, '#06140a');
  kit.texto(g, 'PRECALENTANDO RENCOR', x + 1, y + 2, w - 2, h - 3, { color: '#39ff14', fuente: 'micro', pad: 0 });
  glow(g, x + (w >> 1), y + h + 2, 30, 6, '#39ff14', 0.07, 3);
  vline(g, x + 6, 1, y - 1, PAL.metal[3]); vline(g, x + w - 7, 1, y - 1, PAL.metal[3]);
}

// alfombrilla de goma y charquito de café bajo Gertrudis
function matGertrudis(g) {
  poly(g, [[140, FL + 2], [190, FL + 2], [196, FL + 10], [134, FL + 10]], PAL.ink[2]);
  hline(g, 140, FL + 2, 50, PAL.ink[3]);
  for (let k = 0; k < 46; k += 3) px(g, 142 + k, FL + 6, PAL.ink[1]);
  ellipse(g, 176, FL + 7, 5, 1.5, PAL.wood[1]); ellipse(g, 176, FL + 7, 3, 1, PAL.wood[2]);
  shadowEllipse(g, GER_AT[0], FL + 3, 26, 3, 0.6);
}

// ------------------------------------------------------------------ tablón de corcho (hilo del yogur, porra, hoja de firmas)
function corkboard(g) {
  const x = 201, y = 20, w = 36, h = 28;
  ditherOverlay(g, x + 2, y + 3, w, h, PAL.ink[0], 0.5);
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[3]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[1]);
  hline(g, x - 1, y - 1, w + 2, PAL.wood[6]); vline(g, x - 1, y - 1, h + 2, PAL.wood[5]);
  paint(g, x, y, w, h, (xx, yy) => { const v = hash2(xx, yy, 5); return v < 0.3 ? PAL.wood[4] : v < 0.85 ? PAL.wood[5] : PAL.wood[6]; });
  // notas variadas
  const notes = [[x + 12, y + 2, 9, 7, '#f4e48c'], [x + 2, y + 18, 9, 7, PAL.teal[6]], [x + 13, y + 19, 8, 7, PAL.paper[7]]];
  notes.forEach(([nx, ny, nw, nh, c]) => { ditherOverlay(g, nx + 1, ny + 1, nw, nh, PAL.wood[1], 0.5); rect(g, nx, ny, nw, nh, c); for (let ly = ny + 2; ly < ny + nh - 1; ly += 2) hline(g, nx + 1, ly, nw - 3, PAL.paper[2]); px(g, nx + (nw >> 1), ny, PAL.red[4]); });
  // el hilo del yogur: tira de correo impreso larguísima que cuelga y se arrastra por la pared
  const tx = x + 2;
  rect(g, tx, y + 1, 8, h - 2, PAL.paper[7]);
  for (let ly = y + 3; ly < y + h - 2; ly += 2) hline(g, tx + 1 + (ly % 3 === 0 ? 1 : 0), ly, 6 - (ly % 3 === 0 ? 1 : 0), PAL.ink[3]);
  poly(g, [[tx, y + h], [tx + 8, y + h], [tx + 10, y + h + 7], [tx + 3, y + h + 8], [tx - 2, y + h + 4]], PAL.paper[6]);
  for (let ly = y + h + 1; ly < y + h + 7; ly += 2) hline(g, tx + 1, ly, 6, PAL.ink[3]);
  rect(g, tx + 1, y + 1, 6, 2, PAL.red[3]);   // «RE: RE: RE:»
  kit.cantoVivo(g, x - 2, y - 2, 24, h + 4);
  // porra del garaje (hoja grapada con columnas a boli) sobre el corcho
  const px0 = x + 17, py0 = y + 3;
  ditherOverlay(g, px0 + 1, py0 + 1, 19, 18, PAL.wood[1], 0.5);
  rect(g, px0, py0, 19, 18, PAL.paper[7]); hline(g, px0, py0, 19, PAL.paper[5]);
  kit.micro(g, 'PORRA', px0 + 2, py0 + 2, PAL.ink[2]);
  for (let ly = py0 + 9; ly < py0 + 17; ly += 2) { hline(g, px0 + 2, ly, 6, PAL.blue[4]); hline(g, px0 + 10, ly, 6, PAL.blue[4]); }
  kit.cantoVivo(g, px0, py0, 19, 18);
  // hoja de firmas (curso de prevención de riesgos) colgada de un clavo
  const hx = 241, hy = 24;
  ditherOverlay(g, hx + 1, hy + 2, 14, 19, PAL.ink[0], 0.4);
  rect(g, hx, hy, 14, 19, PAL.paper[7]); frameRect(g, hx, hy, 14, 19, PAL.paper[3]);
  rect(g, hx + 4, hy - 2, 5, 2, PAL.metal[4]); px(g, hx + 6, hy - 4, PAL.metal[5]);
  kit.micro(g, 'PRL', hx + 2, hy + 2, PAL.ink[2]);
  for (let ly = hy + 8; ly < hy + 18; ly += 3) hline(g, hx + 2, ly, 10, PAL.paper[2]);
  hline(g, hx + 2, hy + 8, 6, PAL.green[3]); hline(g, hx + 3, hy + 7, 4, PAL.green[3]);   // la única firma
  kit.cantoVivo(g, hx, hy, 14, 19);
}

// ------------------------------------------------------------------ encimera: cola de tuppers, microondas, fregadero, cartel del cortado
function counter(g) {
  const x = 199, y = 72, w = 79;
  shadowEllipse(g, x + w / 2, FL + 1, w / 2 + 3, 2.5, 0.8);
  gradV(g, x, y + 5, w, FL - y - 5, [PAL.wood[4], PAL.wood[3], PAL.wood[2]]);
  noise(g, x, y + 5, w, FL - y - 5, PAL.wood[1], 0.05, 7);
  for (let i = 0; i < 4; i++) {
    const dx = x + 2 + i * 19;
    frameRect(g, dx, y + 8, 17, 14, PAL.wood[1]); hline(g, dx + 1, y + 9, 15, PAL.wood[5]); vline(g, dx + 1, y + 9, 12, PAL.wood[5]);
    rect(g, dx + 7, y + 14, 3, 1, PAL.metal[6]);
  }
  rect(g, x, FL - 3, w, 3, PAL.ink[2]);
  rect(g, x - 2, y, w + 4, 5, PAL.paper[3]); hline(g, x - 2, y, w + 4, PAL.paper[7]); hline(g, x - 2, y + 4, w + 4, PAL.paper[1]);
  // cartel «EL CORTADO / SUBE A 1,20 €» (escrito a mano en cartón) pegado en la puerta del mueble
  const cx = 219, cy = 79;
  ditherOverlay(g, cx + 1, cy + 2, 55, 12, PAL.ink[0], 0.4);
  poly(g, [[cx, cy], [cx + 55, cy + 1], [cx + 55, cy + 12], [cx + 1, cy + 11]], PAL.wood[6]);
  hline(g, cx, cy, 55, PAL.wood[7]); hline(g, cx + 1, cy + 11, 54, PAL.wood[4]);
  kit.micro(g, 'EL CORTADO', cx + 3, cy + 1, PAL.ink[1]); kit.micro(g, 'SUBE A 1,20 €', cx + 3, cy + 6, PAL.red[3]);
  px(g, cx + 2, cy + 1, PAL.red[4]);
  kit.cantoVivo(g, cx, cy, 55, 12);
  // microondas (27×22) a la derecha de la cola
  const mx = 229, my = 50, mw = 27, mh = 22;
  ditherOverlay(g, mx + 1, my + 2, mw, mh, PAL.ink[0], 0.45);
  bevel(g, mx, my, mw, mh, PAL.metal[5], PAL.metal[7], PAL.metal[2]);
  rect(g, mx + 2, my + 2, 16, 17, PAL.ink[0]); gradH(g, mx + 3, my + 3, 14, 15, [PAL.ink[2], PAL.night[1], PAL.ink[1]]);
  tint(g, [[mx + 4, my + 3], [mx + 8, my + 3], [mx + 4, my + 14], [mx + 3, my + 14]], '#ffffff', 0.15);
  ellipse(g, mx + 10, my + 15, 4, 1, PAL.metal[3]);       // el plato que gira vacío
  rect(g, mx + 20, my + 3, 5, 3, PAL.ink[0]); kit.micro(g, '0', mx + 21, my + 3, PAL.crt[5], { registrar: false });
  for (let k = 0; k < 3; k++) rect(g, mx + 20, my + 8 + k * 3, 5, 2, PAL.metal[3]);
  rect(g, mx + 1, my + mh, 4, 1, PAL.ink[0]); rect(g, mx + mw - 5, my + mh, 4, 1, PAL.ink[0]);
  kit.cantoVivo(g, mx, my, mw, mh);
  // nueve tuppers en cola esperando turno (el primero lleva ahí desde la hora de comer): tapas de color con etiqueta
  const lid = [PAL.teal[5], PAL.red[4], PAL.blue[5], PAL.gold[5], PAL.leaf[5], PAL.purple[5], PAL.teal[6], PAL.red[5], PAL.paper[6]];
  for (let i = 0; i < 9; i++) {
    const tx = 223 - i * 2 - (i >> 1) * 1 - 3, ty = y - 7 - (i % 2);
    shadowEllipse(g, tx + 3, y + 1, 4, 1, 0.5);
    rect(g, tx, ty, 6, 7 + (i % 2), PAL.paper[7]); frameRect(g, tx, ty, 6, 7 + (i % 2), PAL.paper[3]);
    rect(g, tx, ty, 6, 3, lid[i]); hline(g, tx, ty, 6, PAL.paper[7]);
    if (i % 3 === 0) px(g, tx + 3, ty + 5, PAL.red[3]);   // etiqueta con el nombre
  }
  kit.cantoVivo(g, 201, y - 9, 26, 9);
  // fregadero con tazas de eventos apiladas y grifo de cuello de cisne
  const sx = 259, sw = 19;
  rect(g, sx, y - 1, sw, 3, PAL.metal[4]); hline(g, sx, y - 1, sw, PAL.metal[7]);
  rect(g, sx + 2, y + 1, sw - 6, 2, PAL.ink[1]);
  const cups = [[sx + 1, PAL.blue[5]], [sx + 5, PAL.red[4]], [sx + 9, PAL.paper[6]]];
  cups.forEach(([cxx, c], i) => { const ch = 6 + (i % 2) * 2; rect(g, cxx, y - 1 - ch, 4, ch, c); hline(g, cxx, y - 1 - ch, 4, PAL.paper[7]); px(g, cxx + 4, y - ch + 1, PAL.paper[3]); });
  rect(g, sx + 4, y - 15, 5, 5, PAL.paper[5]); frameRect(g, sx + 4, y - 15, 5, 5, PAL.paper[3]);     // la del «Foro de Innovación 2017»: moho innovador
  px(g, sx + 5, y - 14, PAL.leaf[5]); px(g, sx + 6, y - 13, PAL.leaf[4]); px(g, sx + 7, y - 14, PAL.leaf[6]);
  line(g, sx + 16, y - 1, sx + 16, y - 15, PAL.metal[6], 2);
  line(g, sx + 16, y - 15, sx + 12, y - 17, PAL.metal[6], 2);
  px(g, sx + 12, y - 15, PAL.metal[7]);
  rect(g, sx + 14, y - 5, 2, 4, PAL.metal[5]);
  kit.cantoVivo(g, sx - 1, y - 18, sw + 1, 20);
}

// ------------------------------------------------------------------ puerta de TALLERES (placa esmaltada en la hoja) + placa del kit + peldaños
function doorRight(g) {
  const x = 282, y = 32, w = 34, h = FL - 32;
  kit.marcoPuerta(g, x, y, w, h, { ramp: PAL.wood });
  gradH(g, x, y, w, h, [PAL.wood[4], PAL.wood[3], PAL.wood[2]]);
  noise(g, x, y, w, h, PAL.wood[1], 0.08, 5);
  for (let k = 0; k < 7; k++) vline(g, x + 3 + k * 5, y + 2, h - 4, PAL.wood[2]);
  frameRect(g, x + 4, y + 22, w - 8, 14, PAL.wood[1]); hline(g, x + 5, y + 23, w - 10, PAL.wood[5]);
  frameRect(g, x + 4, y + 40, w - 8, 16, PAL.wood[1]); hline(g, x + 5, y + 41, w - 10, PAL.wood[5]);
  rect(g, x + 4, y + 36, 3, 3, PAL.gold[4]); px(g, x + 4, y + 36, PAL.gold[6]);     // pomo de latón
  // placa esmaltada «TALLERES» (es un gag de la biblia: se queda en la hoja)
  rect(g, x, y + 6, 34, 11, PAL.paper[7]); frameRect(g, x, y + 6, 34, 11, PAL.blue[3]);
  kit.micro(g, 'TALLERES', x + 17, y + 9, PAL.blue[2], { align: 'center' });
  px(g, x + 1, y + 7, PAL.paper[5]); px(g, x + 32, y + 15, PAL.paper[2]);
  ditherOverlay(g, x, y + h - 6, w, 6, PAL.ink[0], 0.5);
  rect(g, x + 2, FL - 2, w - 4, 2, '#e0a050');
  glow(g, x + 17, FL + 5, 26, 6, '#e0a050', 0.3, 3);                              // luz ámbar de la imprenta, abajo
  kit.cantoVivo(g, x, y, w, h);
  // sobre el dintel: placa del kit «1 CIERRE ▼ / REDACCIÓN DE PAPEL»
  const pw = kit.placaSalaW('catacumba', { flecha: 'v' });
  kit.placaSala(g, W - 2 - pw, 11, 'catacumba', { flecha: 'v' });
  // umbral ámbar y TRES PELDAÑOS con nariz amarilla que BAJAN a la Catacumba (medio nivel)
  kit.umbral(g, x - 2, FL + 1, w + 4, 7, kit.DEPTO.papel.c, { chevron: true });
  rect(g, x + 1, FL, w - 2, 12, PAL.ink[0]);                                       // el hueco de la escalera
  kit.peldanos(g, x + 2, FL + 12, w - 4, 'baja', { color: PAL.paper[3] });
  vline(g, x + 1, FL, 12, PAL.ink[2]); vline(g, x + w - 2, FL, 12, PAL.ink[2]);
}

function props(g) {
  // cubo de la fregona y escoba en el rincón, papelera junto a la pilastra
  const mx = 270, my = 102;
  shadowEllipse(g, mx, my, 9, 2, 0.7);
  poly(g, [[mx - 7, my - 9], [mx + 7, my - 9], [mx + 6, my], [mx - 6, my]], (xx, yy) => ditherPick(xx, yy, [PAL.gold[5], PAL.gold[4], PAL.gold[2]], (xx - mx + 7) / 14));
  ellipse(g, mx, my - 9, 7, 2, PAL.metal[3]); ellipse(g, mx, my - 9, 5, 1, PAL.night[3]);
  for (let k = 0; k < 5; k++) line(g, mx - 3 + k * 2, my - 9, mx - 4 + k * 2, my - 13 - (k % 2), PAL.paper[4], 1);
  hline(g, mx - 6, my - 6, 12, PAL.gold[6]);
  trashBin(g, 187, FL + 1, { w: 11, h: 12, full: true });
  // migas y manchas del suelo
  for (const [cx, cy] of [[96, 118], [180, 128], [120, 135]]) { ellipse(g, cx, cy, 4, 1.5, PAL.wood[2]); px(g, cx - 1, cy - 1, PAL.wood[1]); }
}

// ------------------------------------------------------------------ plano medio: mesa alta (objeto ordenado por z)
function drawMesaAlta(g) {
  const { x, y, w } = MESA;
  shadowEllipse(g, x + w / 2, y + 24, w / 2 + 4, 3, 0.7);
  // patas y travesaño
  for (const lx of [x + 3, x + w - 5]) { rect(g, lx, y + 5, 2, 18, PAL.metal[3]); vline(g, lx, y + 5, 18, PAL.metal[6]); }
  hline(g, x + 4, y + 17, w - 8, PAL.metal[2]);
  // tablero con perspectiva (formica crema, canto de madera)
  poly(g, [[x + 3, y], [x + w - 3, y], [x + w + 1, y + 6], [x - 1, y + 6]], (xx, yy) => ditherPick(xx, yy, [PAL.paper[5], PAL.paper[6], PAL.paper[7]], 0.3 + (yy - y) / 6 * 0.5));
  rect(g, x - 1, y + 6, w + 2, 2, PAL.wood[4]); hline(g, x - 1, y + 6, w + 2, PAL.wood[6]); hline(g, x - 1, y + 7, w + 2, PAL.wood[2]);
  // sobre la mesa: vasos de la cafetera, un sobre de azúcar y un plato con una media tostada de hace tres turnos
  for (const [cx, c] of [[x + 5, PAL.paper[6]], [x + 10, PAL.red[4]], [x + 24, PAL.paper[5]]]) { rect(g, cx, y - 4, 3, 5, c); hline(g, cx, y - 4, 3, PAL.paper[7]); }
  rect(g, x + 15, y + 1, 6, 3, PAL.paper[7]); px(g, x + 17, y + 2, PAL.red[3]);
  ellipse(g, x + 29, y + 3, 4, 1.5, PAL.paper[6]); px(g, x + 28, y + 2, PAL.gold[4]);
  // taburete de metal a un lado, medio escondido
  const tx = x - 11;
  shadowEllipse(g, tx + 4, y + 24, 6, 2, 0.6);
  ellipse(g, tx + 4, y + 11, 5, 2, PAL.red[3]); hline(g, tx, y + 11, 9, PAL.red[5]);
  line(g, tx + 1, y + 12, tx - 1, y + 24, PAL.metal[4]); line(g, tx + 7, y + 12, tx + 9, y + 24, PAL.metal[4]); vline(g, tx + 4, y + 13, 11, PAL.metal[3]);
}

// ------------------------------------------------------------------ primer plano: cartel de «suelo mojado» (oclusor sin tapar a nadie)
function foreground(g) {
  const x = 295, y = 141;
  shadowEllipse(g, x + 9, y, 12, 2, 0.7);
  // caballete amarillo de «suelo mojado»: dos caras en A, con su pictograma
  poly(g, [[x, y], [x + 18, y], [x + 14, y - 20], [x + 4, y - 20]], (xx) => ditherPick(xx, 0, [PAL.gold[4], PAL.gold[5], PAL.gold[3]], (xx - x) / 18));
  line(g, x, y, x + 4, y - 20, PAL.gold[2]); line(g, x + 18, y, x + 14, y - 20, PAL.gold[2]);
  hline(g, x + 4, y - 20, 11, PAL.gold[6]); hline(g, x, y, 19, PAL.gold[2]);
  poly(g, [[x + 9, y - 16], [x + 14, y - 5], [x + 4, y - 5]], PAL.ink[1]);
  px(g, x + 9, y - 12, PAL.gold[5]); px(g, x + 9, y - 10, PAL.gold[5]); px(g, x + 9, y - 8, PAL.gold[5]);
  hline(g, x + 5, y - 3, 8, PAL.ink[2]);
}

// ------------------------------------------------------------------ fluorescente que parpadea (animate: detrás de los actores)
function flicker(t) {
  const c = (t || 0) % 6400;
  if (c > 4000 && c < 4070) return 0;
  if (c > 4150 && c < 4200) return 0.3;
  if (c > 4260 && c < 4300) return 0;
  if (c > 5600 && c < 5640) return 0.5;
  return 1;
}
function tube(g, t) {
  const f = flicker(t);
  const x = 140, y = 3, w = 46;
  rect(g, x - 2, y - 2, w + 4, 6, PAL.metal[2]); hline(g, x - 2, y - 2, w + 4, PAL.metal[4]);
  rect(g, x, y, w, 3, f > 0.8 ? '#fbfff0' : f > 0.2 ? PAL.metal[6] : PAL.metal[4]);
  if (f > 0.8) hline(g, x, y + 3, w, '#dfeee0');
  if (f > 0.2) { g.save(); g.globalAlpha = 0.07 * f; poly(g, [[x, y + 4], [x + w, y + 4], [x + w + 40, 100], [x - 40, 100]], '#f4ffd8'); g.restore(); }
}
function animateOffice(g, view, t) {
  tube(g, t);
  // olor a tinta que sale por debajo de la puerta de TALLERES
  const T = t || 0;
  for (let k = 0; k < 3; k++) {
    const ph = (T / 900 + k * 0.9) % 3;
    const yy = 28 - ph * 6, xx = 290 + k * 9 + Math.round(Math.sin(T / 400 + k) * 2);
    g.fillStyle = '#3a2a4a'; g.globalAlpha = 0.5 * (1 - ph / 3);
    g.fillRect(xx, yy, 1, 3); g.fillRect(xx + 1, yy - 1, 1, 2);
    g.globalAlpha = 1;
  }
}

// ------------------------------------------------------------------ geometría
const layout = {
  office_a_pecera: { rect: [4, 12, 36, 84], walkTo: [28, 108], face: 'left' },
  nevera: { rect: [44, 32, 40, 62], walkTo: [64, 108], face: 'up' },
  cartel_material: { rect: [86, 14, 46, 22], walkTo: [110, 108], face: 'up' },
  custodia_precinto: { rect: [87, 37, 44, 16], walkTo: [100, 108], face: 'up', priority: 1, draw: (g, v, t) => drawCustodia(g, v, t) },
  timbre_secretaria: { rect: [107, 52, 14, 10], walkTo: [114, 108], face: 'up', priority: 2 },
  microondas: { rect: [201, 48, 55, 24], walkTo: [226, 108], face: 'up' },
  tablon: { rect: [199, 18, 20, 30], walkTo: [208, 108], face: 'up' },
  porra_plazas: { rect: [219, 23, 19, 18], walkTo: [224, 108], face: 'up', priority: 1 },
  hoja_firmas: { rect: [241, 20, 14, 24], walkTo: [246, 108], face: 'up', priority: 1 },
  cartel_cortado: { rect: [219, 78, 55, 14], walkTo: [250, 108], face: 'up' },
  fregadero: { rect: [257, 52, 21, 25], walkTo: [267, 108], face: 'up' },
  office_a_catacumba: { rect: [279, 12, 40, 84], walkTo: [296, 108], face: 'right' },
  // mueble de plano medio: tapa lo que queda detrás de su tablero y se rodea por el walkbox (sin hotspot)
  mesa_alta: { rect: [MESA.x - 12, MESA.y - 4, MESA.w + 12, 28], layer: 'sorted', zy: MESA_ZY, prop: true, cache: true, cachePad: 4, draw: (g) => drawMesaAlta(g) },
  // Gertrudis: máquina de 66 px (escala 1,5 desde onEnter). Bruno le habla desde la izquierda, nunca delante (taparía el
  // LCD). Gervasio (Acto III) se planta DELANTE de ella: su cabeza queda por debajo del LCD.
  gertrudis: { at: GER_AT, walkTo: [134, 110], face: 'right' },
  gervasio_acta: { at: [170, 119, 'up'], walkTo: [136, 128], face: 'right' },
};

export default {
  room: 'office',
  width: W,
  rediseno: true,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  // suelo con forma: franja de atrás, bloque izquierdo, bloque derecho y franja delantera rodean la mesa alta y el cartel
  walkboxes: [
    { id: 'fondo', poly: [[6, 101], [314, 101], [316, 111], [4, 111]] },
    { id: 'izq', poly: [[2, 108], [210, 108], [210, 142], [2, 142]] },
    { id: 'der', poly: [[256, 108], [316, 108], [316, 124], [288, 124], [288, 142], [256, 142]] },
    { id: 'frente', poly: [[2, 134], [290, 134], [290, 142], [2, 142]] },
  ],
  entries: { pecera: [30, 112, 'right'], catacumba: [294, 112, 'left'] },
  layout,
  draw(g) { paintBackground(g); },
  foreground(g) { foreground(g); },
  animate(g, view, t) { animateOffice(g, view, t); },
  // el parpadeo oscurece la sala un instante (los actores, solo el 22 %)
  penumbra(view, t) {
    const f = flicker(t);
    if (f >= 0.9) return null;
    return { color: '#080614', alpha: 0.28 * (1 - f), spots: [] };
  },
};
