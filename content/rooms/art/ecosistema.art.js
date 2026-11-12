// SALA `ecosistema` — El Ecosistema (Marketing y Comercial). Arte y geometría. Biblia §3.7 + adenda §3.7.
// Planta diáfana de moqueta gorda: escalera a la izquierda, photocall con alfombra roja, aro de luz ante la ventana
// con lluvia, pufs, pizarra SINERGIA con la mesa vacía de Tadeo, gong de Maripaz y, a la derecha, el pasillo con la
// impresora de la tercera. Paleta: lila pastel, verde azulado, coral y oro; la lluvia fría fuera, el néon dentro.
import { PAL, px, rect, hline, vline, frameRect, line, poly, ellipse, paint, ditherPick, ditherOverlay, noise, glow, gradV,
  rng, hash2, shade, mix, shadowEllipse, bevel, vignette, floorTiles, cityWindow, mug } from '../../../engine/draw.js';
import { greek, cap, dropShadow } from './lib-catacumba-util.js';

const W = 320;
const LIL = ['#8c88b4', '#a29cc6', '#b8b2d6', '#cdc8e4', '#e0dcf0', '#f0eef8'];       // paredes lila pastel
const CORAL = [PAL.dusk[3], PAL.dusk[4], PAL.dusk[5], PAL.dusk[6]];
const CARP = ['#3a2058', '#4e2c70', '#6a3c92', '#8250aa', '#9c68c4'];

const layout = {
  ecosistema_a_pecera: { rect: [4, 26, 32, 72], walkTo: [26, 112], face: 'left' },
  photocall: { rect: [38, 22, 56, 76], walkTo: [66, 114], face: 'up' },
  aro_luz: { rect: [108, 36, 24, 62], walkTo: [120, 112], face: 'up' },
  pizarra_sinergia: { rect: [192, 24, 44, 36], walkTo: [208, 112], face: 'up' },
  ascensor_ecosistema: { rect: [142, 34, 40, 52], walkTo: [162, 120], face: 'up' },
  pufs: { rect: [136, 86, 36, 17], walkTo: [154, 116], face: 'up' },
  album_eventos_hotspot: { rect: [150, 80, 13, 7], walkTo: [156, 116], face: 'up', priority: 1, draw: (g) => drawAlbum(g, 150, 80) },
  cajas_lanyards: { rect: [174, 76, 20, 24], walkTo: [186, 114], face: 'up' },
  gong: { rect: [234, 38, 26, 62], walkTo: [248, 112], face: 'up' },
  lema_enmarcado: { rect: [260, 24, 44, 22], walkTo: [284, 112], face: 'up' },
  impresora_tercera: { rect: [284, 56, 18, 44], walkTo: [292, 112], face: 'up' },
  ecosistema_a_administracion: { rect: [304, 24, 14, 74], walkTo: [308, 110], face: 'right' },
  portatil_tadeo: { rect: [198, 62, 26, 22], walkTo: [210, 112], face: 'up', draw: (g, v, t) => drawPortatil(g, 198, 62, t) },
  piel_platano: { rect: [292, 106, 14, 8], walkTo: [284, 122], face: 'up', priority: 1, draw: (g) => drawPlatano(g, 292, 106) },
  borja_engagement: { at: [104, 108, 'right'], walkTo: [88, 116], face: 'right' },
  // EVENTOS: Pilar Escaleta, delante de su photocall, en la alfombra roja (problema 8)
  pilar_escaleta: { at: [62, 124, 'right'], walkTo: [86, 127], face: 'left' },
  maripaz_remitido: { at: [272, 106, 'down'], walkTo: [256, 116], face: 'right' },
};

// ------------------------------------------------------------ objetos dibujados por el hotspot
function drawAlbum(g, x, y) {
  poly(g, [[x + 1, y], [x + 12, y], [x + 13, y + 6], [x, y + 6]], PAL.paper[6]);
  hline(g, x + 1, y, 11, PAL.white); hline(g, x, y + 6, 14, PAL.paper[2]);
  rect(g, x + 2, y + 1, 8, 4, PAL.blue[5]);
  rect(g, x + 4, y + 1, 3, 3, PAL.skin[5]); px(g, x + 5, y + 2, PAL.ink[0]);
  rect(g, x + 8, y + 2, 2, 3, PAL.paper[7]); px(g, x + 8, y + 2, PAL.ink[1]);
  hline(g, x + 1, y + 5, 11, PAL.gold[4]);
}
function drawPlatano(g, x, y) {
  shadowEllipse(g, x + 7, y + 5, 7, 2, 0.5);
  poly(g, [[x + 1, y + 3], [x + 7, y + 1], [x + 13, y + 3], [x + 8, y + 6], [x + 4, y + 6]], PAL.gold[5]);
  poly(g, [[x + 6, y + 3], [x + 10, y + 5], [x + 13, y + 7], [x + 8, y + 7]], PAL.gold[4]);
  line(g, x + 2, y + 2, x + 6, y + 4, PAL.gold[3]); line(g, x + 12, y + 3, x + 13, y + 6, PAL.gold[3]);
  px(g, x + 6, y + 3, PAL.wood[3]); hline(g, x + 3, y + 3, 3, PAL.gold[6]);
}
/** Portátil de Tadeo, 26x22: pantalla con notificaciones y un globo que parpadea (2 frames). */
function drawPortatil(g, x, y, t) {
  const f = ((t || 0) % 900) < 450;
  rect(g, x + 2, y + 4, 22, 13, PAL.metal[2]); frameRect(g, x + 2, y + 4, 22, 13, PAL.metal[4]); hline(g, x + 2, y + 4, 22, PAL.metal[6]);
  rect(g, x + 4, y + 6, 18, 9, f ? PAL.blue[7] : PAL.blue[6]);
  for (let i = 0; i < 4; i++) { const yy = y + 7 + i * 2; rect(g, x + 5, yy, 2, 1, i % 2 ? PAL.red[4] : PAL.gold[4]); hline(g, x + 8, yy, 6 + ((i * 5) % 7), PAL.blue[3]); }
  rect(g, x + 17, y + 12, 4, 2, PAL.red[4]);
  poly(g, [[x, y + 17], [x + 26, y + 17], [x + 24, y + 21], [x + 2, y + 21]], PAL.metal[5]); hline(g, x, y + 17, 26, PAL.metal[7]);
  hline(g, x + 4, y + 19, 18, PAL.metal[3]); hline(g, x + 10, y + 20, 6, PAL.metal[2]);
  const by = f ? y - 1 : y + 1;
  if (f) glow(g, x + 20, by + 2, 9, 6, PAL.gold[5], 0.2, 3);
  poly(g, [[x + 14, by], [x + 25, by], [x + 25, by + 6], [x + 19, by + 6], [x + 17, by + 9], [x + 17, by + 6], [x + 14, by + 6]], f ? PAL.paper[7] : PAL.red[4]);
  frameRect(g, x + 14, by, 12, 7, PAL.ink[1]);
  px(g, x + 18, by + 2, PAL.ink[0]); px(g, x + 20, by + 2, PAL.ink[0]); px(g, x + 22, by + 2, PAL.ink[0]); px(g, x + 18, by + 4, PAL.ink[0]); px(g, x + 22, by + 4, PAL.ink[0]);
}

// ------------------------------------------------------------ fondo
function drawCeiling(g) {
  gradV(g, 0, 0, W, 15, [PAL.paper[3], PAL.paper[5], PAL.paper[4]]);
  for (let x = 0; x < W; x += 40) vline(g, x, 0, 14, PAL.paper[2]);
  for (let lx = 24; lx < W; lx += 64) {
    rect(g, lx, 6, 30, 5, PAL.paper[2]); rect(g, lx + 1, 7, 28, 3, '#fbfdff'); hline(g, lx + 1, 7, 28, '#ffffff');
    glow(g, lx + 15, 14, 26, 8, '#f0f4ff', 0.12, 3);
  }
  hline(g, 0, 14, W, PAL.paper[1]); ditherOverlay(g, 0, 15, W, 3, PAL.shadow, 0.25);
  for (let x = 0; x < W; x++) px(g, x, 3, [PAL.dusk[5], PAL.teal[5], PAL.gold[5], PAL.leaf[6]][(x >> 3) & 3]);
}

function drawWall(g) {
  paint(g, 0, 15, W, 83, (x, y) => ditherPick(x, y, LIL, 0.9 - (y - 15) / 83 * 0.55 + (hash2(x >> 3, y >> 2, 4) - 0.5) * 0.05));
  noise(g, 0, 15, W, 80, LIL[1], 0.02, 6);
  rect(g, 0, 76, W, 21, PAL.teal[3]);
  paint(g, 0, 76, W, 21, (x, y) => ditherPick(x, y, [PAL.teal[2], PAL.teal[3], PAL.teal[4]], 0.2 + (97 - y) / 21 * 0.2 + hash2(x >> 3, y, 4) * 0.1));
  hline(g, 0, 75, W, CORAL[2]); hline(g, 0, 76, W, CORAL[1]); hline(g, 0, 77, W, PAL.teal[6]);
  ditherOverlay(g, 0, 78, W, 5, PAL.shadow, 0.2);
  rect(g, 0, 96, W, 3, PAL.paper[5]); hline(g, 0, 96, W, PAL.paper[7]); hline(g, 0, 98, W, PAL.paper[2]);
  // formas Memphis
  ellipse(g, 107, 70, 5, 5, PAL.gold[4]); ellipse(g, 106, 69, 3, 3, PAL.gold[5]);
  poly(g, [[190, 70], [196, 62], [202, 70]], PAL.teal[5]);
  for (let i = 0; i < 14; i++) px(g, 238 + i * 2, 66 + ((i & 1) ? 2 : 0), CORAL[1]);
  for (let i = 0; i < 12; i++) px(g, 239 + i * 2, 68 + ((i & 1) ? 2 : 0), PAL.blue[4]);
}

function drawFloor(g) {
  floorTiles(g, { x: 0, y: 99, w: W, h: 45, vpx: W / 2, vpy: 36, tile: 22, rowPx: 7, colors: [CARP[3], CARP[2]], grout: CARP[1], far: CARP[0], fade: 0.35 });
  paint(g, 0, 99, W, 45, (x, y) => { const v = hash2(x, y, 11); return v < 0.08 ? CARP[3] : v > 0.88 ? CARP[1] : null; });
  ditherOverlay(g, 0, 99, W, 4, PAL.shadow, 0.45);
  glow(g, 160, 118, 140, 18, '#e8d8ff', 0.07, 4);
  // alfombra roja del photocall
  poly(g, [[44, 101], [92, 101], [112, 140], [24, 140]], (x, y) => ditherPick(x, y, [PAL.red[2], PAL.red[3], PAL.red[4]], 0.3 + hash2(x >> 1, y, 2) * 0.35));
  line(g, 44, 101, 24, 140, PAL.gold[4]); line(g, 92, 101, 112, 140, PAL.gold[4]);
  for (let i = 0; i < 4; i++) { const yy = 106 + i * 9, xl = Math.round(44 - (yy - 101) * 0.51), xr = Math.round(92 + (yy - 101) * 0.51); hline(g, xl + 2, yy, xr - xl - 4, PAL.red[5]); }
  for (const [sx, sy] of [[68, 116], [60, 128], [76, 131]]) { px(g, sx, sy, PAL.gold[6]); px(g, sx - 1, sy, PAL.gold[5]); px(g, sx + 1, sy, PAL.gold[5]); px(g, sx, sy - 1, PAL.gold[5]); px(g, sx, sy + 1, PAL.gold[5]); }
  for (const [sx, sy] of [[48, 106], [92, 106]]) { rect(g, sx, sy - 12, 2, 12, PAL.gold[4]); vline(g, sx, sy - 12, 12, PAL.gold[6]); ellipse(g, sx + 1, sy - 13, 2, 2, PAL.gold[5]); shadowEllipse(g, sx + 1, sy, 3, 1, 0.5); }
  const sag = [[49, 95], [60, 98], [72, 99], [84, 98], [93, 95]];
  for (let i = 0; i < sag.length - 1; i++) line(g, sag[i][0], sag[i][1], sag[i + 1][0], sag[i + 1][1], PAL.red[4], 1);
}

function drawStairs(g) {
  rect(g, 3, 24, 34, 74, PAL.paper[2]); frameRect(g, 3, 24, 34, 74, PAL.ink[1]);
  gradV(g, 6, 27, 28, 71, [PAL.ink[2], PAL.night[1], PAL.night[2]]);
  glow(g, 18, 100, 22, 28, PAL.gold[5], 0.22, 5);
  for (let i = 0; i < 6; i++) {
    const y = 56 + i * 7, w = 28 - i * 2, x = 6 + i;
    rect(g, x, y, w, 5, mix(PAL.paper[2], PAL.night[2], i / 6)); hline(g, x, y, w, mix(PAL.paper[5], PAL.night[4], i / 6)); hline(g, x, y + 4, w, PAL.ink[1]);
  }
  line(g, 6, 40, 34, 66, PAL.metal[6], 1); line(g, 6, 41, 34, 67, PAL.metal[3], 1);
  for (const [bx, by] of [[10, 44], [18, 51], [26, 58]]) vline(g, bx, by, 14, PAL.metal[4]);
  bevel(g, 8, 28, 24, 11, PAL.blue[3], PAL.blue[5], PAL.blue[1]);
  cap(g, 'P1', 14, 30, PAL.white);
  poly(g, [[24, 31], [30, 31], [27, 36]], PAL.white);
  ditherOverlay(g, 6, 27, 4, 71, PAL.shadow, 0.45);
  rect(g, 3, 98, 34, 2, PAL.paper[6]); ditherOverlay(g, 3, 100, 34, 3, PAL.shadow, 0.4);
}

function drawPhotocall(g) {
  shadowEllipse(g, 66, 99, 32, 3, 0.7);
  rect(g, 38, 94, 7, 3, PAL.metal[3]); rect(g, 89, 94, 7, 3, PAL.metal[3]);
  rect(g, 40, 22, 3, 74, PAL.metal[5]); vline(g, 40, 22, 74, PAL.metal[7]); vline(g, 42, 22, 74, PAL.metal[2]);
  rect(g, 91, 22, 3, 74, PAL.metal[5]); vline(g, 91, 22, 74, PAL.metal[7]); vline(g, 93, 22, 74, PAL.metal[2]);
  rect(g, 38, 22, 58, 4, PAL.metal[5]); hline(g, 38, 22, 58, PAL.metal[7]); hline(g, 38, 25, 58, PAL.metal[2]);
  for (let i = 0; i < 28; i++) px(g, 39 + i * 2, 24, PAL.metal[3]);
  const fx = 44, fy = 27, cw = 6, ch = 8, cols = 8, rows = 8;
  gradV(g, fx, fy, cols * cw, rows * ch, ['#f4f1fb', '#dcd6ee']);
  const cs = [PAL.dusk[4], PAL.teal[4], PAL.gold[4], PAL.blue[4], PAL.leaf[5], PAL.purple[5], PAL.red[4], PAL.ink[3]];
  let n = 0;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    if (i >= 1 && i <= 6 && j >= 2 && j <= 5) continue;
    const cx = fx + i * cw + 3, cy = fy + j * ch + 4, c = cs[(i * 3 + j * 5 + n) % cs.length], k = (i + j * 2) % 6;
    n++;
    if (k === 0) ellipse(g, cx, cy, 2, 2, c);
    else if (k === 1) rect(g, cx - 2, cy - 2, 5, 5, c);
    else if (k === 2) poly(g, [[cx - 2, cy + 2], [cx + 2, cy + 2], [cx, cy - 2]], c);
    else if (k === 3) poly(g, [[cx, cy - 3], [cx + 3, cy], [cx, cy + 3], [cx - 3, cy]], c);
    else if (k === 4) { rect(g, cx - 2, cy - 2, 5, 2, c); rect(g, cx - 2, cy + 1, 3, 2, shade(c, 0.2)); }
    else { ellipse(g, cx, cy, 1, 1, c); px(g, cx - 2, cy, c); px(g, cx + 2, cy, c); px(g, cx, cy - 2, c); px(g, cx, cy + 2, c); }
    hline(g, fx + i * cw + 1, fy + j * ch + 7, 4, '#c9c4de');
  }
  const hx = fx + 6, hy = fy + 16, hw = 36, hh = 32;
  paint(g, hx, hy, hw, hh, (xx, yy) => ditherPick(xx, yy, LIL, 0.7 - (yy - hy) / hh * 0.3));
  for (let i = 0; i < hw; i += 4) { hline(g, hx + i, hy, 2, PAL.dusk[4]); hline(g, hx + i, hy + hh - 1, 2, PAL.dusk[4]); }
  for (let i = 0; i < hh; i += 4) { vline(g, hx, hy + i, 2, PAL.dusk[4]); vline(g, hx + hw - 1, hy + i, 2, PAL.dusk[4]); }
  cap(g, 'ESPACIO', hx + 18, hy + 3, PAL.dusk[1], { align: 'center' });
  cap(g, 'PREMIUM', hx + 18, hy + 10, PAL.dusk[1], { align: 'center' });
  cap(g, 'PARA TU', hx + 18, hy + 17, PAL.dusk[1], { align: 'center' });
  cap(g, 'CARA', hx + 18, hy + 24, PAL.dusk[1], { align: 'center' });
  ditherOverlay(g, fx + cols * cw, fy + 3, 3, rows * ch, PAL.shadow, 0.4);
  for (let i = 0; i < 6; i++) hline(g, fx + 1 + i, fy + 1 + i, 3, PAL.white);
}

function drawRingLight(g) {
  const cx = 119, cy = 50;
  glow(g, cx, cy, 24, 24, PAL.light, 0.12, 5);
  ellipse(g, cx, cy, 11, 11, PAL.metal[2]);
  ellipse(g, cx, cy, 10, 10, PAL.paper[7]);
  paint(g, cx - 6, cy - 6, 13, 13, (xx, yy) => ((xx - cx) ** 2 + (yy - cy) ** 2 < 36) ? LIL[2 + (((xx + yy) & 1) ? 0 : 1)] : null);
  px(g, cx - 8, cy - 8, PAL.white); px(g, cx - 7, cy - 9, PAL.white);
  rect(g, cx - 2, cy + 11, 4, 3, PAL.metal[3]);
  rect(g, cx - 3, cy - 3, 6, 9, PAL.ink[1]); rect(g, cx - 2, cy - 2, 4, 7, PAL.blue[6]);
  vline(g, cx, cy + 12, 38, PAL.metal[3]); vline(g, cx + 1, cy + 12, 38, PAL.metal[6]);
  line(g, cx, cy + 40, cx - 8, 100, PAL.metal[3]); line(g, cx + 1, cy + 40, cx + 9, 100, PAL.metal[3]); line(g, cx, cy + 40, cx, 101, PAL.metal[5]);
  shadowEllipse(g, cx, 100, 10, 2, 0.6);
  rect(g, cx - 1, cy + 28, 3, 4, PAL.metal[2]);
}

/** Ascensor de la planta 2 (botonera común, content/lib/ascensor.js), donde antes había una ventana. Marketing le ha
 *  puesto los pufs delante y un vinilo de «ESPACIO DE ENCUENTRO» en las puertas. */
function drawWindow(g) {
  const x = 144, y = 36, w = 36, h = 62;
  dropShadow(g, x, y, w, h, 2, 2, 0.45);
  rect(g, x - 3, y - 3, w + 6, h + 3, PAL.paper[2]); frameRect(g, x - 3, y - 3, w + 6, h + 3, PAL.ink[2]);
  rect(g, x, y, w, h, PAL.metal[2]);
  rect(g, x + 5, y + 2, 26, 7, PAL.ink[0]); frameRect(g, x + 5, y + 2, 26, 7, PAL.metal[4]);
  ['-1', '0', '1', '2'].forEach((t, i) => cap(g, t, x + 7 + i * 6, y + 3, i === 3 ? PAL.crt[5] : PAL.metal[3]));
  const dx = x + 3, dy = y + 11, dw = w - 6, dh = h - 11;
  paint(g, dx, dy, dw, dh, (xx, yy) => {
    const fx = (xx - dx) / dw, base = fx < 0.5 ? fx * 2 : (1 - fx) * 2;
    return ditherPick(xx, yy, [PAL.metal[3], PAL.metal[4], PAL.metal[5], PAL.metal[6]], 0.3 + base * 0.45 - (yy - dy) / dh * 0.15 + (hash2(xx, yy >> 2, 2) < 0.15 ? 0.12 : 0));
  });
  vline(g, dx + (dw >> 1) - 1, dy, dh, PAL.ink[0]); vline(g, dx + (dw >> 1), dy, dh, PAL.ink[1]);
  vline(g, dx, dy, dh, PAL.ink[1]); vline(g, dx + dw - 1, dy, dh, PAL.ink[1]);
  // vinilo Memphis en las puertas: círculo y triángulo de colores (Marketing no deja nada sin «activar»)
  ellipse(g, dx + 7, dy + 14, 3, 3, PAL.dusk[5]); poly(g, [[dx + 19, dy + 17], [dx + 25, dy + 17], [dx + 22, dy + 11]], PAL.teal[5]);
  for (let i = 0; i < 6; i++) px(g, dx + 4 + i * 4, dy + 24 + (i & 1), CORAL[1]);
  // botonera de llamada
  const px0 = x + w + 4, py0 = y + 20;
  bevel(g, px0, py0, 5, 13, PAL.metal[4], PAL.metal[6], PAL.metal[1]);
  ellipse(g, px0 + 2.5, py0 + 4, 1.5, 1.5, PAL.gold[6]); ellipse(g, px0 + 2.5, py0 + 9, 1.5, 1.5, PAL.white);
  glow(g, x + w / 2, y + 30, 26, 26, PAL.light, 0.06, 4);
}

function drawNeon(g) {
  const x = 94, y = 18;
  glow(g, x + 27, y + 5, 40, 12, '#ff4aa8', 0.16, 5);
  rect(g, x - 2, y - 1, 58, 12, PAL.ink[1]); frameRect(g, x - 2, y - 1, 58, 12, PAL.ink[3]);
  cap(g, 'ECOSISTEMA', x + 27, y + 2, '#ff6ec0', { align: 'center' });
}

function drawPufs(g) {
  shadowEllipse(g, 154, 102, 22, 3, 0.7);
  const DU = [PAL.dusk[2], PAL.dusk[3], PAL.dusk[4], PAL.dusk[5], PAL.dusk[6], PAL.dusk[7]];
  const defs = [[145, 97, 10, 8, PAL.teal], [160, 98, 11, 9, DU], [170, 99, 7, 6, PAL.gold]];
  for (const [cx, cy, rx, ry, ramp] of defs) {
    ellipse(g, cx, cy - 1, rx, ry, (x, y, d) => ditherPick(x, y, [ramp[2], ramp[3], ramp[4], ramp[5]], Math.max(0, Math.min(1, 1 - d * 0.9 - (x - cx) * 0.03 + (cy - y) * 0.02))));
    ellipse(g, cx - 2, cy - ry + 1, Math.max(1, rx * 0.5), Math.max(1, ry * 0.3), ramp[Math.min(6, ramp.length - 1)]);
    px(g, cx + 1, cy - 2, ramp[1]); px(g, cx, cy - 1, ramp[1]);
    hline(g, cx - rx + 2, cy + ry - 1, rx * 2 - 3, ramp[1]);
  }
}

function drawCajas(g) {
  shadowEllipse(g, 184, 100, 14, 3, 0.7);
  for (const [bx, by, bw, bh] of [[176, 88, 16, 12], [178, 78, 13, 10]]) {
    bevel(g, bx, by, bw, bh, PAL.wood[5], PAL.wood[6], PAL.wood[3]);
    hline(g, bx, by + 3, bw, PAL.wood[3]); rect(g, bx + (bw >> 1) - 3, by + 4, 6, 3, PAL.paper[6]); hline(g, bx + (bw >> 1) - 2, by + 5, 4, PAL.red[4]);
  }
  const cs = [PAL.dusk[4], PAL.teal[5], PAL.gold[4], PAL.blue[4], PAL.leaf[5]];
  for (let i = 0; i < 5; i++) { vline(g, 178 + i * 2, 86, 5 + (i % 3) * 2, cs[i]); px(g, 178 + i * 2, 91 + (i % 3) * 2, PAL.paper[6]); }
  rect(g, 177, 72, 3, 6, PAL.paper[6]); rect(g, 181, 73, 3, 5, PAL.paper[5]);
  px(g, 178, 74, PAL.red[4]); px(g, 182, 75, PAL.blue[4]);
}

function drawBoard(g) {
  const x = 192, y = 24, w = 44, h = 36;
  dropShadow(g, x, y, w, h, 2, 2, 0.5);
  rect(g, x - 1, y - 1, w + 2, h + 2, PAL.metal[5]); frameRect(g, x - 1, y - 1, w + 2, h + 2, PAL.metal[3]);
  gradV(g, x, y, w, h, ['#fbfdff', '#e8eef6', '#d6dfec']);
  const t = 'SINERGIA';
  const cs = ['#d83c4a', '#2c5cc8', '#2c9a4c'];
  let cx = x + 3;
  for (let i = 0; i < t.length; i++) { cap(g, t[i], cx, y + 4, cs[i % 3]); cx += t[i] === 'I' ? 4 : 5; }
  poly(g, [[x + 22, y + 15], [x + 22, y + 28], [x + 12, y + 28]], '#d4dcec'); line(g, x + 22, y + 15, x + 22, y + 29, '#aab6cc');
  poly(g, [[x + 24, y + 19], [x + 24, y + 28], [x + 31, y + 28]], '#dbe3f0'); line(g, x + 10, y + 30, x + 33, y + 30, '#b2bed2'); line(g, x + 12, y + 31, x + 31, y + 31, '#c4cee0');
  frameRect(g, x + 33, y + 19, 7, 7, '#c05060');
  line(g, x + 4, y + 20, x + 9, y + 24, '#2c5cc8'); line(g, x + 9, y + 24, x + 4, y + 28, '#2c5cc8');
  hline(g, x + 3, y + 33, 14, '#2c9a4c'); hline(g, x + 3, y + 34, 9, '#2c9a4c');
  rect(g, x, y + h, w, 2, PAL.metal[4]); rect(g, x + 4, y + h - 1, 4, 2, '#d83c4a'); rect(g, x + 10, y + h - 1, 4, 2, '#2c5cc8'); rect(g, x + 16, y + h - 1, 4, 2, '#2c9a4c');
  px(g, x + 3, y + 3, PAL.white);
}

function drawTadeoDesk(g) {
  const x = 194, y = 76;
  shadowEllipse(g, 214, 100, 22, 3, 0.7);
  rect(g, 226, 68, 12, 18, PAL.ink[2]); rect(g, 227, 69, 10, 16, PAL.metal[2]); hline(g, 227, 69, 10, PAL.metal[4]);
  poly(g, [[224, 70], [239, 70], [240, 88], [223, 88]], PAL.blue[2]); hline(g, 224, 70, 15, PAL.blue[5]); vline(g, 224, 70, 18, PAL.blue[4]);
  vline(g, 231, 72, 15, PAL.blue[1]); rect(g, 235, 74, 2, 2, PAL.gold[4]);
  line(g, 224, 70, 229, 78, PAL.blue[3]);
  poly(g, [[x + 3, y + 3], [x + 40, y + 3], [x + 42, y + 10], [x + 1, y + 10]], PAL.paper[6]); hline(g, x + 3, y + 3, 37, PAL.white);
  rect(g, x + 1, y + 10, 41, 3, PAL.paper[3]); hline(g, x + 1, y + 10, 41, PAL.paper[5]);
  rect(g, x + 3, y + 13, 3, 12, PAL.metal[4]); rect(g, x + 36, y + 13, 3, 12, PAL.metal[4]); vline(g, x + 3, y + 13, 12, PAL.metal[6]);
  ditherOverlay(g, x + 6, y + 13, 30, 10, PAL.shadow, 0.3);
  mug(g, x + 31, y + 8, { color: PAL.blue });
}

function drawGong(g) {
  const cx = 247, cy = 56;
  rect(g, 234, 40, 3, 60, PAL.wood[3]); vline(g, 234, 40, 60, PAL.wood[5]); rect(g, 258, 40, 3, 60, PAL.wood[3]); vline(g, 258, 40, 60, PAL.wood[5]);
  rect(g, 232, 38, 31, 4, PAL.wood[4]); hline(g, 232, 38, 31, PAL.wood[6]); hline(g, 232, 41, 31, PAL.wood[1]);
  rect(g, 232, 96, 8, 3, PAL.wood[2]); rect(g, 255, 96, 8, 3, PAL.wood[2]);
  line(g, cx - 8, 42, cx - 8, 46, PAL.paper[6]); line(g, cx + 9, 42, cx + 9, 46, PAL.paper[6]);
  glow(g, cx, cy, 20, 20, PAL.gold[5], 0.12, 4);
  ellipse(g, cx, cy, 14, 14, PAL.gold[1]);
  ellipse(g, cx, cy, 13, 13, (x, y, d) => ditherPick(x, y, [PAL.gold[2], PAL.gold[3], PAL.gold[4], PAL.gold[5], PAL.gold[6]], Math.max(0, Math.min(1, 0.9 - d * 0.7 - (x - cx) * 0.02 - (y - cy) * 0.02))));
  ellipse(g, cx, cy, 6, 6, (x, y, d) => ditherPick(x, y, [PAL.gold[3], PAL.gold[5], PAL.gold[4]], d));
  ellipse(g, cx, cy, 2, 2, PAL.gold[6]);
  for (const rr of [9, 11]) for (let a = 0; a < 40; a++) px(g, Math.round(cx + Math.cos(a / 40 * 6.283) * rr), Math.round(cy + Math.sin(a / 40 * 6.283) * rr), PAL.gold[2 + (a & 1)]);
  px(g, cx - 8, cy - 9, PAL.white); px(g, cx - 7, cy - 10, PAL.white); px(g, cx - 9, cy - 7, PAL.white);
  line(g, 238, 97, 244, 90, PAL.wood[5]); ellipse(g, 245, 89, 3, 3, PAL.paper[6]); px(g, 244, 88, PAL.white);
}

function drawMaripazDesk(g) {
  const x = 242, y = 80;
  shadowEllipse(g, 264, 101, 26, 3, 0.7);
  poly(g, [[x + 3, y], [x + 38, y], [x + 41, y + 6], [x, y + 6]], PAL.paper[6]); hline(g, x + 3, y, 35, PAL.white);
  gradV(g, x, y + 6, 41, 18, [PAL.dusk[5], PAL.dusk[4], PAL.dusk[3]]);
  hline(g, x, y + 6, 41, PAL.dusk[6]); vline(g, x, y + 6, 18, PAL.dusk[5]); vline(g, x + 40, y + 6, 18, PAL.dusk[2]);
  rect(g, x + 4, y + 10, 33, 8, PAL.dusk[3]); frameRect(g, x + 4, y + 10, 33, 8, PAL.dusk[2]);
  for (let i = 0; i < 6; i++) rect(g, x + 7 + i * 5, y + 12, 3, 4, i % 2 ? PAL.gold[5] : PAL.paper[6]);
  rect(g, x + 8, y - 6, 3, 6, PAL.ink[2]); line(g, x + 9, y - 6, x + 15, y - 8, PAL.ink[2]); rect(g, x + 14, y - 9, 4, 4, PAL.metal[3]); px(g, x + 15, y - 8, PAL.metal[6]);
  rect(g, x + 24, y - 4, 8, 4, PAL.metal[3]); hline(g, x + 24, y - 4, 8, PAL.metal[6]); rect(g, x + 26, y - 3, 4, 1, PAL.crt[4]);
  rect(g, x + 33, y - 3, 5, 5, PAL.gold[5]); px(g, x + 34, y - 1, PAL.red[4]); hline(g, x + 34, y, 3, PAL.gold[3]);
}

function drawLema(g) {
  const x = 262, y = 25, w = 40, h = 20;
  dropShadow(g, x, y, w, h, 2, 2, 0.5);
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.gold[2]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.gold[1]); hline(g, x - 2, y - 2, w + 4, PAL.gold[6]); vline(g, x - 2, y - 2, h + 4, PAL.gold[5]);
  gradV(g, x, y, w, h, [PAL.night[2], PAL.night[1]]);
  cap(g, 'TODO ES', x + 20, y + 2, PAL.gold[6], { align: 'center' });
  greek(g, x + 3, y + 10, 34, 1, PAL.gold[5], 7, 2, 0.9);
  greek(g, x + 5, y + 13, 30, 1, PAL.gold[4], 8, 2, 0.9);
  greek(g, x + 8, y + 16, 24, 1, PAL.gold[4], 9, 2, 0.9);
  px(g, x + 1, y + 1, PAL.white);
}

function drawPrinter(g) {
  const x = 284, y = 58;
  shadowEllipse(g, x + 9, 100, 13, 3, 0.7);
  bevel(g, x, y + 10, 18, 32, PAL.paper[4], PAL.paper[6], PAL.paper[1]);
  rect(g, x - 1, y + 6, 20, 6, PAL.paper[3]); hline(g, x - 1, y + 6, 20, PAL.paper[7]);
  rect(g, x + 2, y + 1, 14, 6, PAL.paper[5]); hline(g, x + 2, y + 1, 14, PAL.white);
  rect(g, x + 2, y + 13, 14, 8, PAL.ink[1]);
  rect(g, x + 3, y + 14, 12, 5, PAL.red[2]); for (let i = 0; i < 4; i++) hline(g, x + 4, y + 15 + (i >> 1) * 2, 4 + i * 2 - (i >> 1) * 2, PAL.red[5]);
  rect(g, x + 4, y + 20, 2, 1, PAL.crt[5]); rect(g, x + 8, y + 20, 2, 1, PAL.dusk[5]);
  for (const [by, c] of [[y + 25, PAL.metal[3]], [y + 32, PAL.metal[2]]]) { rect(g, x + 2, by, 14, 5, c); hline(g, x + 2, by, 14, PAL.metal[5]); rect(g, x + 7, by + 2, 4, 1, PAL.ink[1]); }
  rect(g, x + 1, y + 40, 16, 2, PAL.ink[2]);
  poly(g, [[x + 3, y + 22], [x + 15, y + 22], [x + 14, y + 25], [x + 2, y + 25]], PAL.paper[7]);
  rect(g, x + 14, y + 27, 5, 5, PAL.gold[5]); px(g, x + 15, y + 29, PAL.red[4]); hline(g, x + 15, y + 30, 3, PAL.gold[3]);
  ditherOverlay(g, x + 18, y + 8, 3, 34, PAL.shadow, 0.35);
}

function drawCorridor(g) {
  const x = 303, y = 22, w = 17, h = 76;
  rect(g, x - 2, y - 2, w + 2, h + 2, PAL.paper[3]); frameRect(g, x - 2, y - 2, w + 2, h + 2, PAL.paper[1]);
  poly(g, [[x, y], [x + w, y + 6], [x + w, y + h - 8], [x, y + h]], PAL.green[2]);
  gradV(g, x, y + 6, w, h - 10, [PAL.green[1], PAL.green[2], PAL.green[3]]);
  poly(g, [[x, y + h], [x + w, y + h - 8], [x + w, y + h - 3], [x, y + h + 2]], PAL.purple[2]);
  rect(g, x + 6, y + 14, 9, 36, PAL.green[0]);
  glow(g, x + 12, y + 32, 12, 24, PAL.crt[6], 0.2, 5);
  rect(g, x + 8, y + 24, 6, 18, PAL.crt[5]); hline(g, x + 8, y + 24, 6, PAL.white); vline(g, x + 11, y + 24, 18, PAL.crt[3]);
  rect(g, x + 2, y + 2, 12, 5, PAL.metal[2]); rect(g, x + 4, y + 4, 8, 1, PAL.crt[5]);
  glow(g, x + 8, y + 40, 20, 38, PAL.crt[4], 0.07, 4);
}

function drawLights(g) {
  glow(g, 66, 30, 40, 30, PAL.light, 0.10, 4);
  glow(g, 248, 56, 34, 40, PAL.gold[5], 0.08, 4);
  glow(g, 160, 54, 38, 36, PAL.night[5], 0.06, 4);
  glow(g, 121, 24, 36, 14, '#ff4aa8', 0.09, 4);
}

export default {
  room: 'ecosistema',
  width: 320,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [[10, 104], [312, 104], [318, 142], [2, 142]] }],
  entries: { pecera: [26, 116, 'right'], administracion: [306, 116, 'left'], ascensor: [162, 122, 'down'] },
  layout,
  draw(g) {
    drawCeiling(g);
    drawWall(g);
    drawFloor(g);
    drawStairs(g);
    drawPhotocall(g);
    drawNeon(g);
    drawWindow(g);
    drawBoard(g);
    drawLema(g);
    drawRingLight(g);
    drawPufs(g);
    drawCajas(g);
    drawTadeoDesk(g);
    drawGong(g);
    drawMaripazDesk(g);
    drawPrinter(g);
    drawCorridor(g);
    drawLights(g);
    vignette(g, W, 144, 0.45);
  },
  animate(g, view, t) {
    const on = (Math.sin(t / 240) + Math.sin(t / 73)) > -1.7;
    if (!on) { rect(g, 94, 18, 54, 10, PAL.ink[1]); cap(g, 'ECOSISTEMA', 121, 20, PAL.metal[2], { align: 'center' }); }
    if ((t % 1400) < 700) rect(g, 288, 72, 3, 1, PAL.red[6]);
  },
};
