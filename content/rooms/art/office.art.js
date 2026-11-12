// SALA `office` — ARTE Y GEOMETRÍA. Biblia §3.3 + adenda §3.5 / §8bis (porra) / §1.5 (Custodia).
// Cocina de la redacción: fluorescente que parpadea, azulejo amarilleado, nevera con imanes y su cartel, nueve tuppers
// en cola ante el microondas, Gertrudis (actor) en el centro con el ventanuco de la Secretaría de Redacción encima
// (persiana a media altura, manos con guantes de punto, llave con cinta roja, libro negro, timbre «NO»), tablón de
// corcho con el hilo del yogur, la porra y la hoja de firmas, cartel del cortado, fregadero con tazas de eventos y,
// a la derecha, la puerta vieja de TALLERES con su placa esmaltada y olor a tinta.
import {
  PAL, mix, rect, hline, vline, frameRect, line, px, poly, ellipse, paint, gradV, gradH, bevel, noise, hash2, rng,
  ditherOverlay, ditherPick, glow, vignette, shadowEllipse, floorTiles, wallClock, trashBin,
} from '../../../engine/draw.js';
import { micro, microCenter } from './lib-vestibulo-micro.js';

const W = 320;
const FL = 92; // línea de suelo

function tint(g, pts, color, alpha) { g.save(); g.globalAlpha = alpha; poly(g, pts, color); g.restore(); }
function tintR(g, x, y, w, h, color, alpha) { g.save(); g.globalAlpha = alpha; rect(g, x, y, w, h, color); g.restore(); }

// ------------------------------------------------------------------ fondo
function paintBackground(g) {
  rect(g, 0, 0, W, 144, PAL.ink[1]);
  // techo bajo
  gradV(g, 0, 0, W, 8, [PAL.ink[1], PAL.metal[2], PAL.metal[3]]);
  hline(g, 0, 10, W, PAL.metal[1]);
  // pared pintada (crema verdosa, manchas de grasa y humedad) hasta la cenefa
  const paintBase = [mix(PAL.paper[4], PAL.green[6], 0.45), mix(PAL.paper[3], PAL.green[5], 0.5), mix(PAL.paper[2], PAL.green[4], 0.5)];
  paint(g, 0, 11, W, 48, (xx, yy) => {
    const t = (yy - 11) / 48;
    let c = ditherPick(xx, yy, paintBase, t * 0.9);
    if (hash2(xx >> 1, yy, 6) < 0.05) c = paintBase[2];
    return c;
  });
  // manchas de humedad
  for (const [sx, sw] of [[8, 14], [118, 20], [250, 16]]) {
    paint(g, sx, 11, sw, 30, (xx, yy) => (hash2(xx, yy, 11) < 0.35 * (1 - (yy - 11) / 30) ? paintBase[2] : null));
  }
  // cenefa verde oscura y azulejos amarilleados
  rect(g, 0, 58, W, 3, PAL.green[3]); hline(g, 0, 58, W, PAL.green[5]); hline(g, 0, 60, W, PAL.green[1]);
  paint(g, 0, 61, W, FL - 61, (xx, yy) => {
    const gx = xx % 8 === 0, gy = (yy - 61) % 8 === 0;
    if (gx || gy) return PAL.paper[2];
    const v = hash2(xx >> 3, (yy - 61) >> 3, 5);
    let c = ditherPick(xx, yy, [PAL.paper[4], PAL.paper[5], PAL.paper[6]], 0.35 + v * 0.45 - (yy - 61) / 90);
    if (((xx % 8) === 1 || (yy - 61) % 8 === 1)) c = PAL.paper[7];
    return c;
  });
  // goteras de grasa en los azulejos
  for (const gx of [92, 130, 236]) vline(g, gx, 61, 12 + (gx % 7), PAL.paper[2]);
  rect(g, 0, FL - 3, W, 3, PAL.wood[1]); hline(g, 0, FL - 3, W, PAL.wood[3]);
  // suelo de linóleo
  floorTiles(g, { x: 0, y: FL, w: W, h: 144 - FL, vpx: 160, vpy: 30, tile: 20, rowPx: 8, colors: ['#c49a62', '#a47e52'], colors3: '#b08a58', grout: PAL.wood[1], far: PAL.wood[0], fade: 0.5 });
  ditherOverlay(g, 0, FL, W, 5, PAL.ink[0], 0.55);

  doorLeft(g);
  fridge(g);
  counterAndMicro(g);
  clock(g);
  hatch(g);
  corkboard(g);
  sinkArea(g);
  doorRight(g);
  mat(g);
  // luz del fluorescente sobre pared y suelo
  glow(g, 165, 46, 80, 40, '#f4ffd8', 0.07, 5);
  glow(g, 165, 112, 90, 14, '#f4ffd8', 0.07, 5);
  vignette(g, W, 144, 0.55);
}

function doorLeft(g) {
  const x = 6, y = 32, w = 32, h = 60;
  rect(g, x - 3, y - 3, w + 6, h + 3, PAL.metal[1]); rect(g, x - 2, y - 2, w + 4, h + 2, PAL.metal[3]);
  vline(g, x - 2, y - 2, h + 2, PAL.metal[5]); hline(g, x - 2, y - 2, w + 4, PAL.metal[5]);
  gradH(g, x, y, w, h, [PAL.green[5], PAL.green[4], PAL.green[3]]);
  // ventanilla con cristal armado: se ve el resplandor azul de las pantallas de la Pecera
  const gx = x + 5, gy = y + 6, gw = w - 10, gh = 24;
  rect(g, gx - 1, gy - 1, gw + 2, gh + 2, PAL.green[1]);
  paint(g, gx, gy, gw, gh, (xx, yy) => ditherPick(xx, yy, [PAL.night[2], PAL.night[3], PAL.blue[4], PAL.blue[5]], 0.2 + (yy - gy) / gh * 0.4 + (xx - gx) / gw * 0.15));
  for (let k = 0; k < 3; k++) rect(g, gx + 2 + k * 7, gy + 12, 5, 6, PAL.crt[3 + (k % 2)]); // monitores a lo lejos
  for (let i = 0; i <= gw; i += 4) vline(g, gx + i, gy, gh, PAL.night[1]); for (let j = 0; j <= gh; j += 4) hline(g, gx, gy + j, gw, PAL.night[1]); // malla del cristal armado
  tint(g, [[gx + 2, gy], [gx + 8, gy], [gx, gy + 14], [gx - 2, gy + 14]], '#ffffff', 0.14);
  rect(g, x + 4, y + 36, w - 8, 18, PAL.green[3]); frameRect(g, x + 4, y + 36, w - 8, 18, PAL.green[2]);
  hline(g, x + 5, y + 37, w - 10, PAL.green[6]);
  rect(g, x + w - 7, y + 28, 2, 5, PAL.gold[3]); px(g, x + w - 7, y + 28, PAL.gold[6]);
  rect(g, x + 2, y + h - 8, w - 4, 6, PAL.metal[4]); hline(g, x + 2, y + h - 8, w - 4, PAL.metal[6]); // chapa antipatadas
  // placa
  rect(g, x + 2, y - 11, 28, 7, PAL.blue[3]); frameRect(g, x + 2, y - 11, 28, 7, PAL.blue[1]);
  microCenter(g, 'PECERA', x + 16, y - 9, PAL.paper[7]);
  glow(g, x + w + 6, y + 30, 10, 26, '#6aa0ff', 0.07, 3);
}

function fridge(g) {
  const x = 44, y = 28, w = 40, h = 64;
  shadowEllipse(g, x + w / 2, FL + 1, w / 2 + 3, 2.5, 0.8);
  // cuerpo blanco amarilleado con esquinas redondeadas
  gradH(g, x, y, w, h, [PAL.paper[7], PAL.paper[6], PAL.paper[5], PAL.paper[3]]);
  rect(g, x, y, 1, 1, PAL.ink[1]); rect(g, x + w - 1, y, 1, 1, PAL.ink[1]);
  vline(g, x, y + 1, h - 1, PAL.paper[7]); vline(g, x + w - 1, y + 1, h - 1, PAL.paper[2]);
  hline(g, x + 1, y, w - 2, PAL.paper[7]); hline(g, x, y + h - 1, w, PAL.paper[1]);
  hline(g, x, y + 22, w, PAL.paper[2]); hline(g, x, y + 23, w, PAL.paper[7]); // junta congelador
  rect(g, x + w - 6, y + 4, 2, 14, PAL.metal[4]); vline(g, x + w - 6, y + 4, 14, PAL.metal[7]); // tiradores
  rect(g, x + w - 6, y + 27, 2, 20, PAL.metal[4]); vline(g, x + w - 6, y + 27, 20, PAL.metal[7]);
  // cartel «ETIQUETAD VUESTROS TUPPERS» (cartulina amarilla pegada con celo)
  rect(g, x + 1, y + 6, 37, 17, '#f4e48c'); frameRect(g, x + 1, y + 6, 37, 17, PAL.gold[3]);
  micro(g, 'ETIQUETAD', x + 2, y + 8, PAL.red[3]); micro(g, 'VUESTROS', x + 2, y + 13, PAL.red[3]); micro(g, 'TUPPERS', x + 2, y + 18, PAL.red[3]);
  px(g, x + 1, y + 6, PAL.paper[7]); px(g, x + 37, y + 6, PAL.paper[7]);
  // imanes de colores, fotos y notas
  const mg = [[8, 30, PAL.red[4]], [16, 33, PAL.blue[5]], [24, 30, PAL.leaf[5]], [10, 40, PAL.gold[5]], [20, 42, PAL.red[3]], [28, 38, PAL.teal[5]], [14, 50, PAL.purple[5]], [26, 50, PAL.red[4]]];
  mg.forEach(([mx, my, c]) => { rect(g, x + mx, y + my, 3, 3, c); px(g, x + mx, y + my, PAL.paper[7]); });
  rect(g, x + 6, y + 36, 8, 6, PAL.paper[7]); frameRect(g, x + 6, y + 36, 8, 6, PAL.paper[3]); hline(g, x + 7, y + 38, 6, PAL.blue[4]);
  rect(g, x + 22, y + 45, 9, 8, '#f4c0c8'); hline(g, x + 23, y + 47, 7, PAL.red[3]); hline(g, x + 23, y + 49, 5, PAL.red[3]);
  // nota «RAMÍREZ NO SE TOCA»
  rect(g, x + 4, y + 54, 14, 6, PAL.paper[6]); micro(g, 'RAMIREZ', x + 5, y + 55, PAL.red[3]);
  ditherOverlay(g, x + w - 5, y, 5, h, PAL.ink[0], 0.3);
}

function counterAndMicro(g) {
  const x = 86, y = 68, w = 60;
  shadowEllipse(g, x + w / 2, FL + 1, w / 2 + 3, 2.5, 0.8);
  gradV(g, x, y + 5, w, FL - y - 5, [PAL.wood[4], PAL.wood[3], PAL.wood[2]]);
  noise(g, x, y + 5, w, FL - y - 5, PAL.wood[1], 0.05, 7);
  for (let i = 0; i < 3; i++) {
    const px0 = x + 2 + i * 19;
    frameRect(g, px0, y + 8, 17, 14, PAL.wood[1]); hline(g, px0 + 1, y + 9, 15, PAL.wood[5]); vline(g, px0 + 1, y + 9, 12, PAL.wood[5]);
    rect(g, px0 + 7, y + 14, 3, 1, PAL.metal[6]);
  }
  rect(g, x, FL - 3, w, 3, PAL.ink[2]);
  rect(g, x - 2, y, w + 4, 5, PAL.paper[3]); hline(g, x - 2, y, w + 4, PAL.paper[7]); hline(g, x - 2, y + 4, w + 4, PAL.paper[1]);
  // microondas
  const mx = 117, my = 48, mw = 28, mh = 20;
  ditherOverlay(g, mx + 1, my + 2, mw, mh, PAL.ink[0], 0.45);
  bevel(g, mx, my, mw, mh, PAL.metal[5], PAL.metal[7], PAL.metal[2]);
  rect(g, mx + 2, my + 2, 17, 15, PAL.ink[0]); gradH(g, mx + 3, my + 3, 15, 13, [PAL.ink[2], PAL.night[1], PAL.ink[1]]);
  tint(g, [[mx + 4, my + 3], [mx + 8, my + 3], [mx + 4, my + 12], [mx + 3, my + 12]], '#ffffff', 0.15);
  rect(g, mx + 21, my + 3, 5, 3, PAL.ink[0]); micro(g, '0', mx + 23, my + 3 - 0, PAL.crt[5]);
  for (let k = 0; k < 3; k++) rect(g, mx + 21, my + 8 + k * 3, 5, 2, PAL.metal[3]);
  rect(g, mx + 1, my + mh, 4, 1, PAL.ink[0]); rect(g, mx + mw - 5, my + mh, 4, 1, PAL.ink[0]);
  // nueve tuppers en cola esperando turno (el primero lleva ahí desde la hora de comer)
  const lid = [PAL.teal[5], PAL.red[4], PAL.blue[5], PAL.gold[5], PAL.leaf[5], PAL.purple[5], PAL.teal[6], PAL.red[5], PAL.paper[6]];
  for (let i = 0; i < 9; i++) {
    const tx = 114 - i * 3 - (i >> 1) - 1, ty = y - 6 - (i % 2);
    rect(g, tx, ty, 6, 6 + (i % 2), PAL.paper[7]); frameRect(g, tx, ty, 6, 6 + (i % 2), PAL.paper[3]);
    rect(g, tx, ty, 6, 2, lid[i]); hline(g, tx, ty, 6, PAL.paper[7]);
    if (i % 3 === 0) px(g, tx + 3, ty + 4, PAL.red[3]); // etiqueta con el nombre
  }
  px(g, 105, y - 9, PAL.paper[7]);
  glow(g, 124, 58, 20, 14, '#f4ffd8', 0.04, 3);
}

function clock(g) {
  wallClock(g, 100, 30, 8, 20 + 59 / 60);
  // calendario de otro año colgado de una chincheta
  rect(g, 112, 20, 10, 13, PAL.paper[7]); rect(g, 112, 20, 10, 4, PAL.red[4]); frameRect(g, 112, 20, 10, 13, PAL.paper[2]);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) px(g, 114 + c * 2, 26 + r * 2, PAL.ink[3]);
  micro(g, '17', 113, 21, PAL.paper[7]);
}

// ventanuco de la Secretaría de Redacción: marco, interior oscuro con archivadores, mostrador, timbre y cartel
function hatch(g) {
  const x = 138, y = 32, w = 48, h = 16;
  // cartel «EL MATERIAL NO SE PIDE. SE MERECE.»
  ditherOverlay(g, 140, 10, 48, 20, PAL.ink[0], 0.45);
  rect(g, 138, 8, 48, 21, PAL.paper[6]); frameRect(g, 138, 8, 48, 21, PAL.metal[2]); frameRect(g, 139, 9, 46, 19, PAL.red[3]);
  microCenter(g, 'EL MATERIAL', 162, 11, PAL.ink[1]); microCenter(g, 'NO SE PIDE.', 162, 17, PAL.ink[1]); microCenter(g, 'SE MERECE.', 162, 22, PAL.red[3]);
  // marco del ventanuco
  rect(g, x - 2, y - 2, w + 4, h + 6, PAL.metal[2]); frameRect(g, x - 2, y - 2, w + 4, h + 6, PAL.metal[1]);
  hline(g, x - 1, y - 1, w + 2, PAL.metal[5]);
  // interior oscuro con estantes y archivadores a la luz de un flexo verde
  rect(g, x, y, w, h, PAL.ink[0]);
  gradH(g, x, y, w, h, [PAL.ink[0], '#10281a', PAL.ink[0]]);
  for (let sy = y + 3; sy < y + h; sy += 5) { hline(g, x, sy + 4, w, PAL.metal[1]); for (let k = 0; k < 14; k++) rect(g, x + 2 + k * 3, sy, 2, 4, [PAL.wood[2], PAL.green[2], PAL.paper[2], PAL.red[2]][(k * 7 + sy) % 4]); }
  glow(g, x + 40, y + 4, 14, 8, '#c8f0a0', 0.25, 3);
  // mostrador estrecho
  rect(g, x - 3, y + h, w + 6, 4, PAL.wood[4]); hline(g, x - 3, y + h, w + 6, PAL.wood[7]); hline(g, x - 3, y + h + 3, w + 6, PAL.wood[1]);
  // timbre de mostrador con pegatina «NO»
  const bx = 158;
  rect(g, bx, y + h - 3, 10, 3, PAL.metal[4]); hline(g, bx, y + h - 3, 10, PAL.metal[7]);
  ellipse(g, bx + 5, y + h - 4, 4, 2, (xx, yy, d) => ditherPick(xx, yy, [PAL.gold[6], PAL.gold[4], PAL.gold[3]], d));
  px(g, bx + 5, y + h - 7, PAL.metal[7]);
  rect(g, bx + 3, y + h - 3, 5, 3, PAL.paper[7]); micro(g, 'N', bx + 3, y + h - 4, PAL.red[3]); px(g, bx + 7, y + h - 2, PAL.red[3]);
}
function drawCustodia(g, view, t) {
  const x = 138, y = 32, w = 48;
  const T = t || 0;
  // persiana metálica a media altura (lamas, tope inferior y asa)
  for (let ly = y - 1; ly < y + 8; ly += 2) {
    hline(g, x - 1, ly, w + 2, PAL.metal[4]); hline(g, x - 1, ly + 1, w + 2, PAL.metal[2]);
  }
  rect(g, x - 1, y + 7, w + 2, 2, PAL.metal[5]); hline(g, x - 1, y + 7, w + 2, PAL.metal[7]); hline(g, x - 1, y + 9, w + 2, PAL.ink[0]);
  rect(g, x + 22, y + 8, 5, 2, PAL.metal[3]);
  ditherOverlay(g, x, y + 10, w, 2, PAL.ink[0], 0.5); // sombra de la persiana
  // llave con cinta roja colgando
  line(g, x + 42, y + 10, x + 42, y + 15, PAL.red[4], 2);
  rect(g, x + 41, y + 15, 3, 2, PAL.gold[5]); px(g, x + 42, y + 17, PAL.gold[4]); px(g, x + 41, y + 18, PAL.gold[5]);
  // esquina del libro negro
  poly(g, [[x + 1, y + 15], [x + 9, y + 15], [x + 9, y + 12], [x + 1, y + 11]], PAL.ink[1]); hline(g, x + 1, y + 11, 8, PAL.metal[3]);
  // manos con guantes de punto sin dedos: tamborilean; de vez en cuando cuentan con los dedos
  const cyc = T % 11000;
  const counting = cyc > 8000 && cyc < 10200;
  const nfing = counting ? 1 + Math.floor((cyc - 8000) / 700) : 0;
  const tap = Math.floor(T / 140);
  const hand = (hx, hy, right, ph) => {
    // palma con guante lila a rayas
    rect(g, hx, hy, 11, 5, PAL.purple[4]);
    for (let k = 0; k < 11; k += 2) vline(g, hx + k, hy, 5, PAL.purple[5]);
    hline(g, hx, hy + 4, 11, PAL.purple[2]); hline(g, hx, hy, 11, PAL.purple[6]);
    rect(g, hx + (right ? 10 : -1), hy + 1, 2, 4, PAL.purple[3]); // puño con lana
    // yemas de los dedos, asomando del guante sin dedos
    for (let f = 0; f < 4; f++) {
      const up = counting && right ? (f < nfing ? 3 : 0) : ((tap + f * 2 + ph) % 6 === 0 ? 1 : 0);
      const fx = hx + 1 + f * 2 + (right ? 0 : 1);
      rect(g, fx, hy - 2 - up, 2, 2 + up, PAL.skin[4]); px(g, fx, hy - 2 - up, PAL.skin[5]);
    }
  };
  hand(143, 42, false, 0);
  hand(171, 42, true, 3);
  // brillo del flexo sobre las manos
  glow(g, 168, 46, 22, 5, '#c8f0a0', 0.12, 3);
}

function corkboard(g) {
  const x = 194, y = 24, w = 48, h = 32;
  ditherOverlay(g, x + 2, y + 3, w, h, PAL.ink[0], 0.5);
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[3]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[1]);
  hline(g, x - 1, y - 1, w + 2, PAL.wood[6]); vline(g, x - 1, y - 1, h + 2, PAL.wood[5]);
  paint(g, x, y, w, h, (xx, yy) => { const v = hash2(xx, yy, 5); return v < 0.3 ? PAL.wood[4] : v < 0.85 ? PAL.wood[5] : PAL.wood[6]; });
  // notas variadas
  const notes = [[x + 14, y + 3, 10, 8, '#f4e48c'], [x + 30, y + 3, 9, 7, '#f4c0c8'], [x + 3, y + 21, 10, 8, PAL.teal[6]], [x + 15, y + 22, 8, 7, PAL.paper[7]], [x + 40, y + 4, 6, 9, '#c8f0a0']];
  notes.forEach(([nx, ny, nw, nh, c]) => { ditherOverlay(g, nx + 1, ny + 1, nw, nh, PAL.wood[1], 0.5); rect(g, nx, ny, nw, nh, c); for (let ly = ny + 2; ly < ny + nh - 1; ly += 2) hline(g, nx + 1, ly, nw - 3, PAL.paper[2]); px(g, nx + (nw >> 1), ny, PAL.red[4]); });
  // el hilo del yogur: tira de correo impreso larguísima que cuelga y se arrastra por la pared
  const tx = 5 + x;
  rect(g, tx, y + 1, 9, h - 2, PAL.paper[7]);
  for (let ly = y + 3; ly < y + h - 2; ly += 2) hline(g, tx + 1 + (ly % 3 === 0 ? 1 : 0), ly, 7 - (ly % 3 === 0 ? 1 : 0), PAL.ink[3]);
  poly(g, [[tx, y + h], [tx + 9, y + h], [tx + 11, y + h + 8], [tx + 3, y + h + 9], [tx - 2, y + h + 4]], PAL.paper[6]);
  for (let ly = y + h + 1; ly < y + h + 8; ly += 2) hline(g, tx + 1, ly, 7, PAL.ink[3]);
  rect(g, tx + 1, y + 1, 7, 2, PAL.red[3]); // «RE: RE: RE:»
  px(g, tx + 4, y - 0, PAL.red[5]);
  // porra del garaje (hoja grapada con columnas a boli)
  const px0 = 222, py0 = 40;
  ditherOverlay(g, px0 + 1, py0 + 1, 20, 17, PAL.wood[1], 0.5);
  rect(g, px0, py0, 20, 17, PAL.paper[7]); hline(g, px0, py0, 20, PAL.paper[5]);
  micro(g, 'PORRA', px0 + 2, py0 + 2, PAL.ink[2]);
  for (let ly = py0 + 8; ly < py0 + 16; ly += 2) { hline(g, px0 + 2, ly, 7, PAL.blue[4]); hline(g, px0 + 11, ly, 6, PAL.blue[4]); }
  px(g, px0 + 2, py0 + 1, PAL.metal[5]); px(g, px0 + 3, py0 + 1, PAL.metal[5]);
  // hoja de firmas (curso de prevención de riesgos) colgada de un clavo
  const hx = 245, hy = 28;
  ditherOverlay(g, hx + 1, hy + 2, 13, 19, PAL.ink[0], 0.4);
  rect(g, hx, hy, 13, 19, PAL.paper[7]); frameRect(g, hx, hy, 13, 19, PAL.paper[3]);
  rect(g, hx + 4, hy - 2, 5, 2, PAL.metal[4]); px(g, hx + 6, hy - 4, PAL.metal[5]);
  micro(g, 'PRL', hx + 2, hy + 2, PAL.ink[2]);
  for (let ly = hy + 8; ly < hy + 18; ly += 3) { hline(g, hx + 2, ly, 9, PAL.paper[2]); }
  hline(g, hx + 2, hy + 8, 6, PAL.green[3]); hline(g, hx + 3, hy + 7, 4, PAL.green[3]); // la única firma
  // cartel «EL CORTADO SUBE A 1,20 €» (escrito a mano en cartón)
  const cx = 190, cy = 61;
  ditherOverlay(g, cx + 1, cy + 2, 55, 12, PAL.ink[0], 0.4);
  poly(g, [[cx, cy], [cx + 55, cy + 1], [cx + 55, cy + 12], [cx + 1, cy + 11]], PAL.wood[6]);
  hline(g, cx, cy, 55, PAL.wood[7]); hline(g, cx + 1, cy + 11, 54, PAL.wood[4]);
  micro(g, 'EL CORTADO', cx + 3, cy + 2, PAL.ink[1]); micro(g, 'SUBE A 1,20 €', cx + 3, cy + 7, PAL.red[3]);
  px(g, cx + 2, cy + 1, PAL.red[4]);
}

function sinkArea(g) {
  const x = 249, y = 76, w = 28;
  shadowEllipse(g, x + w / 2, FL + 1, w / 2 + 3, 2.5, 0.8);
  gradV(g, x, y + 4, w, FL - y - 4, [PAL.metal[4], PAL.metal[3], PAL.metal[2]]);
  vline(g, x, y + 4, FL - y - 4, PAL.metal[6]); vline(g, x + w - 1, y + 4, FL - y - 4, PAL.metal[1]);
  for (let i = 0; i < 2; i++) { frameRect(g, x + 3 + i * 13, y + 8, 11, 12, PAL.metal[1]); rect(g, x + 8 + i * 13, y + 12, 1, 4, PAL.metal[7]); }
  rect(g, x - 2, y, w + 4, 4, PAL.metal[6]); hline(g, x - 2, y, w + 4, PAL.metal[7]); hline(g, x - 2, y + 3, w + 4, PAL.metal[2]);
  // seno con tazas de eventos apiladas
  rect(g, x + 3, y - 1, 19, 2, PAL.ink[1]);
  const cups = [[x + 4, PAL.blue[5]], [x + 9, PAL.red[4]], [x + 13, PAL.paper[6]], [x + 17, PAL.gold[5]]];
  cups.forEach(([cx, c], i) => { const ch = 5 + (i % 2) * 2; rect(g, cx, y - ch, 4, ch, c); hline(g, cx, y - ch, 4, PAL.paper[7]); px(g, cx + 4, y - ch + 2, PAL.paper[3]); });
  // la del «Foro de Innovación 2017»: moho innovador
  rect(g, x + 8, y - 11, 5, 5, PAL.paper[5]); frameRect(g, x + 8, y - 11, 5, 5, PAL.paper[3]);
  px(g, x + 9, y - 10, PAL.leaf[5]); px(g, x + 10, y - 9, PAL.leaf[4]); px(g, x + 11, y - 10, PAL.leaf[6]); px(g, x + 10, y - 11, PAL.leaf[3]);
  // grifo de cuello de cisne con goteo
  line(g, x + 25, y, x + 25, y - 10, PAL.metal[6], 2);
  line(g, x + 25, y - 10, x + 20, y - 12, PAL.metal[6], 2);
  px(g, x + 20, y - 10, PAL.metal[7]);
  rect(g, x + 23, y - 3, 2, 3, PAL.metal[5]);
  // escurridor de platos y estropajo
  rect(g, x + 22, y + 0, 6, 1, PAL.leaf[4]);
  // trapo colgado del tirador
  rect(g, x + 3, y + 5, 3, 7, PAL.red[4]); for (let k = 0; k < 7; k += 2) hline(g, x + 3, y + 5 + k, 3, PAL.paper[6]);
  // papelera
  trashBin(g, 236, FL, { w: 11, h: 12, full: true });
}

function doorRight(g) {
  const x = 278, y = 30, w = 36, h = 62;
  rect(g, x - 3, y - 3, w + 6, h + 3, PAL.wood[0]); rect(g, x - 2, y - 2, w + 4, h + 2, PAL.wood[2]);
  vline(g, x - 2, y - 2, h + 2, PAL.wood[4]); hline(g, x - 2, y - 2, w + 4, PAL.wood[4]);
  gradH(g, x, y, w, h, [PAL.wood[4], PAL.wood[3], PAL.wood[2]]);
  noise(g, x, y, w, h, PAL.wood[1], 0.08, 5);
  // vetas de la madera y paneles
  for (let k = 0; k < 7; k++) vline(g, x + 3 + k * 5, y + 2, h - 4, PAL.wood[2]);
  frameRect(g, x + 4, y + 22, w - 8, 14, PAL.wood[1]); hline(g, x + 5, y + 23, w - 10, PAL.wood[5]);
  frameRect(g, x + 4, y + 40, w - 8, 18, PAL.wood[1]); hline(g, x + 5, y + 41, w - 10, PAL.wood[5]);
  // pomo de latón
  rect(g, x + 4, y + 36, 3, 3, PAL.gold[4]); px(g, x + 4, y + 36, PAL.gold[6]);
  // placa esmaltada «TALLERES»
  rect(g, x + 1, y + 6, 34, 11, PAL.paper[7]); frameRect(g, x + 1, y + 6, 34, 11, PAL.blue[3]); frameRect(g, x + 2, y + 7, 32, 9, PAL.blue[2]);
  microCenter(g, 'TALLERES', x + 18, y + 9, PAL.blue[2]);
  px(g, x + 3, y + 8, PAL.paper[5]); px(g, x + 32, y + 15, PAL.paper[2]);
  // marca de tinta en el marco y luz de imprenta bajo la puerta
  ditherOverlay(g, x - 2, y + h - 6, w + 4, 6, PAL.ink[0], 0.5);
  rect(g, x + 2, FL - 2, w - 4, 2, '#e0a050'); glow(g, x + 17, FL + 4, 24, 5, '#e0a050', 0.25, 3);
}

function mopBucket(g, x, y) {
  shadowEllipse(g, x, y, 9, 2, 0.7);
  poly(g, [[x - 7, y - 9], [x + 7, y - 9], [x + 6, y], [x - 6, y]], (xx, yy) => ditherPick(xx, yy, [PAL.gold[5], PAL.gold[4], PAL.gold[2]], (xx - x + 7) / 14));
  ellipse(g, x, y - 9, 7, 2, PAL.metal[3]); ellipse(g, x, y - 9, 5, 1, PAL.night[3]);
  line(g, x + 3, y - 10, x + 7, y - 30, PAL.wood[5], 1); // mango
  for (let k = 0; k < 5; k++) line(g, x + 7, y - 30 + k, x + 4 + k * 2, y - 24, PAL.paper[4], 1);
  hline(g, x - 6, y - 6, 12, PAL.gold[6]);
}
function mat(g) {
  mopBucket(g, 268, 100);
  for (const [cx, cy] of [[96, 118], [210, 126], [120, 135]]) { ellipse(g, cx, cy, 4, 1.5, PAL.wood[2]); px(g, cx - 1, cy - 1, PAL.wood[1]); }
  for (let k = 0; k < 6; k++) px(g, 70 + k * 3, 112 + (k % 2), PAL.paper[6]);
  // alfombrilla de goma y charquito de café bajo Gertrudis
  poly(g, [[146, FL + 2], [180, FL + 2], [184, FL + 9], [142, FL + 9]], PAL.ink[2]);
  hline(g, 146, FL + 2, 34, PAL.ink[3]);
  for (let k = 0; k < 28; k += 3) px(g, 148 + k, FL + 6, PAL.ink[1]);
  ellipse(g, 168, FL + 6, 5, 1.5, PAL.wood[1]); ellipse(g, 168, FL + 6, 3, 1, PAL.wood[2]);
  // escoba en el rincón
  line(g, 286, FL - 20, 292, FL + 1, PAL.wood[5], 1);
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
  const x = 142, y = 3, w = 46;
  rect(g, x - 2, y - 2, w + 4, 6, PAL.metal[2]); hline(g, x - 2, y - 2, w + 4, PAL.metal[4]);
  rect(g, x, y, w, 3, f > 0.8 ? '#fbfff0' : f > 0.2 ? PAL.metal[6] : PAL.metal[4]);
  if (f > 0.8) { hline(g, x, y + 3, w, '#dfeee0'); }
  if (f > 0.2) {
    g.save(); g.globalAlpha = 0.07 * f; g.fillStyle = '#f4ffd8';
    poly(g, [[x, y + 4], [x + w, y + 4], [x + w + 40, 100], [x - 40, 100]], '#f4ffd8'); g.restore();
  }
}
function animateOffice(g, view, t) {
  tube(g, t);
  // olor a tinta que sale por debajo de la puerta de TALLERES
  const T = t || 0;
  for (let k = 0; k < 3; k++) {
    const ph = (T / 900 + k * 0.9) % 3;
    const yy = 28 - ph * 6, xx = 289 + k * 9 + Math.round(Math.sin(T / 400 + k) * 2);
    g.fillStyle = '#3a2a4a'; g.globalAlpha = 0.5 * (1 - ph / 3);
    g.fillRect(xx, yy, 1, 3); g.fillRect(xx + 1, yy - 1, 1, 2);
    g.globalAlpha = 1;
  }
}

// ------------------------------------------------------------------ geometría
const layout = {
  office_a_pecera: { rect: [4, 21, 36, 71], walkTo: [28, 108], face: 'left' },
  nevera: { rect: [44, 28, 40, 64], walkTo: [64, 108], face: 'up' },
  microondas: { rect: [86, 44, 60, 32], walkTo: [116, 108], face: 'up' },
  tablon: { rect: [192, 22, 30, 36], walkTo: [210, 108], face: 'up' },
  porra_plazas: { rect: [222, 38, 22, 20], walkTo: [232, 108], face: 'up', priority: 1 },
  hoja_firmas: { rect: [244, 24, 16, 26], walkTo: [250, 108], face: 'up', priority: 1 },
  cartel_cortado: { rect: [190, 60, 56, 14], walkTo: [214, 108], face: 'up' },
  fregadero: { rect: [248, 62, 30, 30], walkTo: [260, 108], face: 'up' },
  office_a_catacumba: { rect: [275, 27, 42, 65], walkTo: [296, 108], face: 'right' },
  custodia_precinto: { rect: [136, 30, 52, 24], walkTo: [150, 108], face: 'up', priority: 1, draw: (g, v, t) => drawCustodia(g, v, t) },
  cartel_material: { rect: [138, 8, 48, 21], walkTo: [150, 108], face: 'up' },
  timbre_secretaria: { rect: [156, 40, 14, 12], walkTo: [164, 108], face: 'up', priority: 2 },
  gertrudis: { at: [162, 94, 'down'], walkTo: [162, 110], face: 'up' },
  gervasio_acta: { at: [176, 108, 'up'], walkTo: [198, 113], face: 'left' },
};

export default {
  room: 'office',
  width: W,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [[6, 101], [314, 101], [318, 142], [2, 142]] }],
  entries: { pecera: [30, 112, 'right'], catacumba: [294, 112, 'left'] },
  layout,
  draw(g) { paintBackground(g); },
  animate(g, view, t) { animateOffice(g, view, t); },
  overlay(g, view, t) {
    // el parpadeo oscurece toda la sala un instante
    const f = flicker(t);
    if (f < 0.9) { g.save(); g.globalAlpha = 0.28 * (1 - f); g.fillStyle = '#080614'; g.fillRect(0, 0, W, 144); g.restore(); }
  },
};
