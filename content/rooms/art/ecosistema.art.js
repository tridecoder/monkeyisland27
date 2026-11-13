// SALA `ecosistema` — El Ecosistema (Marketing y Comercial). Arte y geometría. Biblia §3.7 + adenda §3.7 y §13.4.
// Planta diáfana de moqueta gorda: escalera a la izquierda, la PUERTA DE EVENTOS (doble hoja con ojos de buey por los
// que se escapan los focos de la Sala Polivalente), el embudo de Marketing bajo el neón, ascensor con pufs, roll-up de
// Comercial, pizarra SINERGIA con la mesa vacía de Tadeo, el termómetro de ventas de Maripaz con su mesa y, a la
// derecha, el pasillo con la impresora de la tercera. Eventos (photocall, gong, lanyards, Pilar) tiene sala propia.
// Paleta: lila pastel, verde azulado, coral y oro.
import { PAL, px, rect, hline, vline, frameRect, line, poly, ellipse, paint, ditherPick, ditherOverlay, noise, glow, gradV,
  rng, hash2, shade, mix, shadowEllipse, bevel, vignette, floorTiles, cityWindow, mug } from '../../../engine/draw.js';
import { greek, cap, dropShadow, miniText } from './lib-catacumba-util.js';

const W = 320;
const LIL = ['#8c88b4', '#a29cc6', '#b8b2d6', '#cdc8e4', '#e0dcf0', '#f0eef8'];       // paredes lila pastel
const CORAL = [PAL.dusk[3], PAL.dusk[4], PAL.dusk[5], PAL.dusk[6]];
const CARP = ['#3a2058', '#4e2c70', '#6a3c92', '#8250aa', '#9c68c4'];

const layout = {
  ecosistema_a_pecera: { rect: [4, 26, 32, 72], walkTo: [26, 112], face: 'left' },
  ecosistema_a_eventos: { rect: [40, 22, 56, 76], walkTo: [68, 110], face: 'up' },
  embudo_marketing: { rect: [104, 33, 34, 40], walkTo: [124, 112], face: 'up' },
  pizarra_sinergia: { rect: [192, 24, 44, 36], walkTo: [208, 112], face: 'up' },
  ascensor_ecosistema: { rect: [142, 34, 40, 52], walkTo: [162, 120], face: 'up' },
  pufs: { rect: [136, 86, 36, 17], walkTo: [154, 116], face: 'up' },
  rollup_comercial: { rect: [173, 40, 20, 60], walkTo: [184, 114], face: 'up' },
  termometro_ventas: { rect: [238, 26, 22, 54], walkTo: [250, 112], face: 'up' },
  lema_enmarcado: { rect: [260, 24, 44, 22], walkTo: [284, 112], face: 'up' },
  impresora_tercera: { rect: [284, 56, 18, 44], walkTo: [292, 112], face: 'up' },
  ecosistema_a_administracion: { rect: [304, 24, 14, 74], walkTo: [308, 110], face: 'right' },
  portatil_tadeo: { rect: [198, 62, 26, 22], walkTo: [210, 112], face: 'up', draw: (g, v, t) => drawPortatil(g, 198, 62, t) },
  piel_platano: { rect: [292, 106, 14, 8], walkTo: [284, 122], face: 'up', priority: 1, draw: (g) => drawPlatano(g, 292, 106) },
  borja_engagement: { at: [104, 108, 'right'], walkTo: [88, 116], face: 'right' },
  maripaz_remitido: { at: [272, 106, 'down'], walkTo: [256, 116], face: 'right' },
};

// ------------------------------------------------------------ objetos dibujados por el hotspot
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
  for (let i = 0; i < 8; i++) px(g, 262 + i * 2, 66 + ((i & 1) ? 2 : 0), CORAL[1]);
}

function drawFloor(g) {
  floorTiles(g, { x: 0, y: 99, w: W, h: 45, vpx: W / 2, vpy: 36, tile: 22, rowPx: 7, colors: [CARP[3], CARP[2]], grout: CARP[1], far: CARP[0], fade: 0.35 });
  paint(g, 0, 99, W, 45, (x, y) => { const v = hash2(x, y, 11); return v < 0.08 ? CARP[3] : v > 0.88 ? CARP[1] : null; });
  ditherOverlay(g, 0, 99, W, 4, PAL.shadow, 0.45);
  glow(g, 160, 118, 140, 18, '#e8d8ff', 0.07, 4);
  // la lengua de luz cálida que sale por la rendija de la puerta de Eventos
  glow(g, 68, 104, 26, 5, '#ffe0a0', 0.14, 4);
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

/** La puerta de EVENTOS (Sala Polivalente): doble hoja ciruela con ojos de buey por los que se escapan los focos,
 *  barras antipánico, piloto verde «5 MIN» encima y una lengua de luz cálida que sale por la rendija. */
function drawEventosDoor(g) {
  const x = 42, y = 26, w = 52, h = 72;
  dropShadow(g, x, y, w, h, 2, 2, 0.45);
  rect(g, x - 4, y - 4, w + 8, h + 4, PAL.paper[2]); frameRect(g, x - 4, y - 4, w + 8, h + 4, PAL.ink[2]);
  hline(g, x - 4, y - 4, w + 8, PAL.paper[5]); vline(g, x - 4, y - 4, h + 4, PAL.paper[4]);
  const PL = ['#1c1228', '#2a1a3a', '#3a2650', '#4c3262', '#5e4076'];
  for (const [dx, dw] of [[0, 26], [26, 26]]) {
    paint(g, x + dx, y, dw, h, (xx, yy) => ditherPick(xx, yy, PL, 0.75 - (yy - y) / h * 0.4 - (xx - x - dx) / dw * 0.15));
    frameRect(g, x + dx, y, dw, h, PAL.ink[1]);
    frameRect(g, x + dx + 3, y + 40, dw - 6, 26, PL[1]);                             // cuarterón
    // ojo de buey: dentro, el resplandor de los focos
    const ox = x + dx + 13, oy = y + 18;
    ellipse(g, ox, oy, 7, 7, PAL.metal[4]); ellipse(g, ox, oy, 6, 6, PAL.ink[0]);
    ellipse(g, ox, oy, 5, 5, (xx, yy, d) => ditherPick(xx, yy, [PAL.ink[1], '#5a2a5a', '#c86aa8', '#fff0c0'], Math.max(0, 1 - d - (yy - oy) * 0.05)));
    px(g, ox - 3, oy - 3, PAL.white);
    rect(g, x + dx + 4, y + 34, dw - 8, 3, PAL.metal[5]); hline(g, x + dx + 4, y + 34, dw - 8, PAL.metal[7]);   // barra antipánico
  }
  vline(g, x + 25, y, h, PAL.ink[0]); vline(g, x + 26, y, h, PAL.ink[0]);
  // rendija de luz y la lengua cálida sobre la moqueta
  vline(g, x + 25, y + 2, h - 4, '#ffd890');
  glow(g, x + 26, y + 30, 10, 34, '#ffe8b0', 0.18, 4);
  // cartel encima: «EVENTOS» en verde Pilar y el piloto de los cinco minutos
  rect(g, x + 4, y - 15, w - 10, 10, PAL.ink[1]); frameRect(g, x + 4, y - 15, w - 10, 10, PAL.ink[3]);
  glow(g, x + w / 2, y - 10, 30, 8, '#a8f07a', 0.12, 3);
  cap(g, 'EVENTOS', x + w / 2 - 1, y - 13, '#a8f07a', { align: 'center' });
  rect(g, x + w + 1, y + 4, 4, 8, PAL.ink[1]); rect(g, x + w + 2, y + 5, 2, 2, PAL.crt[5]); rect(g, x + w + 2, y + 9, 2, 2, PAL.red[2]);
}

/** Marketing: el embudo de conversión en vinilo, «VEN · MIRA · COMPARTE · ¿?», con flechas Memphis. */
function drawEmbudo(g) {
  const x = 104, y = 34, w = 34, h = 38;
  dropShadow(g, x, y, w, h, 2, 2, 0.4);
  rect(g, x, y, w, h, '#f6f2fc'); frameRect(g, x, y, w, h, LIL[0]);
  const bands = [[PAL.dusk[5], 30], [PAL.teal[5], 22], [PAL.gold[5], 14], [PAL.dusk[3], 7]];
  bands.forEach(([c, bw], i) => {
    const by = y + 4 + i * 8, nx = bands[i + 1] ? bands[i + 1][1] : 3;
    poly(g, [[x + (w - bw) / 2, by], [x + (w + bw) / 2, by], [x + (w + nx) / 2, by + 7], [x + (w - nx) / 2, by + 7]], c);
    hline(g, x + Math.round((w - bw) / 2), by, bw, shade(c, 0.3));
  });
  rect(g, x + 16, y + 36, 3, 2, PAL.dusk[2]);
  for (const [i, t] of [[0, 'VEN'], [1, 'MIRA'], [2, 'COMP']]) miniText(g, t, x + w / 2, y + 5 + i * 8, PAL.white, { align: 'center' });
  miniText(g, '?', x + w / 2, y + 29, PAL.white, { align: 'center' });
  line(g, x + 2, y + 6, x + 2, y + 30, PAL.dusk[4]); poly(g, [[x, y + 29], [x + 5, y + 29], [x + 2, y + 33]], PAL.dusk[4]);
  px(g, x + 1, y + 1, PAL.white);
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

/** Comercial: roll-up «SU ANUNCIO AQUÍ» con la extensión de Maripaz. */
function drawRollup(g) {
  const x = 175, y = 40, w = 16, h = 56;
  shadowEllipse(g, x + 8, 100, 11, 2, 0.6);
  rect(g, x - 2, y + h, w + 4, 4, PAL.metal[4]); hline(g, x - 2, y + h, w + 4, PAL.metal[6]);
  vline(g, x + 8, y - 2, 2, PAL.metal[4]);
  rect(g, x, y, w, h, '#fff4ec'); frameRect(g, x, y, w, h, PAL.metal[3]);
  rect(g, x + 1, y + 1, w - 2, 12, '#ff7a52'); miniText(g, 'SU', x + 8, y + 4, PAL.white, { align: 'center' });
  miniText(g, 'ANUN', x + 8, y + 16, '#c03a28', { align: 'center' });
  miniText(g, 'CIO', x + 8, y + 22, '#c03a28', { align: 'center' });
  miniText(g, 'AQUI', x + 8, y + 28, '#c03a28', { align: 'center' });
  ellipse(g, x + 8, y + 40, 4, 4, PAL.gold[5]); ellipse(g, x + 8, y + 40, 2, 2, '#ff7a52');
  rect(g, x + 2, y + 47, w - 4, 6, '#ff7a52'); miniText(g, '247', x + 8, y + 48, PAL.white, { align: 'center' });
  ditherOverlay(g, x + w, y + 2, 2, h, PAL.shadow, 0.4);
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

/** Comercial: el termómetro de ventas de Maripaz, pintado a rotulador en un papelógrafo: «OBJETIVO Q3», al 97 %. */
function drawTermometro(g) {
  const x = 239, y = 27, w = 20, h = 52;
  dropShadow(g, x, y, w, h, 2, 2, 0.45);
  rect(g, x, y, w, h, PAL.paper[7]); frameRect(g, x, y, w, h, PAL.paper[3]);
  rect(g, x + 3, y - 2, 4, 3, '#d8cfa0'); rect(g, x + w - 7, y - 2, 4, 3, '#d8cfa0');
  miniText(g, 'Q3', x + w / 2, y + 2, '#c03a28', { align: 'center' });
  const tx = x + 8, ty = y + 9, th = 34;
  rect(g, tx, ty, 5, th, PAL.paper[5]); frameRect(g, tx, ty, 5, th, PAL.ink[3]);
  const fill = Math.round(th * 0.97);
  rect(g, tx + 1, ty + th - fill, 3, fill, '#d83c2a'); vline(g, tx + 1, ty + th - fill, fill, '#ff7a5a');
  ellipse(g, tx + 2, ty + th + 3, 4, 4, PAL.ink[3]); ellipse(g, tx + 2, ty + th + 3, 3, 3, '#d83c2a'); px(g, tx + 1, ty + th + 2, '#ffb09a');
  for (let i = 0; i <= 4; i++) hline(g, tx + 6, ty + i * 8, 3, PAL.ink[3]);
  miniText(g, '97', tx + 9, ty - 1, '#c03a28');
  for (const [px0, py0] of [[x + 3, y + 30], [x + 4, y + 18]]) { px(g, px0, py0, PAL.gold[4]); px(g, px0 - 1, py0, PAL.gold[5]); }
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
  glow(g, 68, 60, 30, 40, '#ffe8b0', 0.07, 4);
  glow(g, 250, 52, 30, 34, PAL.light, 0.06, 4);
  glow(g, 160, 54, 38, 36, PAL.night[5], 0.06, 4);
  glow(g, 121, 24, 36, 14, '#ff4aa8', 0.09, 4);
}

export default {
  room: 'ecosistema',
  width: 320,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [[10, 104], [312, 104], [318, 142], [2, 142]] }],
  entries: { pecera: [26, 116, 'right'], administracion: [306, 116, 'left'], ascensor: [162, 122, 'down'], eventos: [68, 114, 'down'] },
  layout,
  draw(g) {
    drawCeiling(g);
    drawWall(g);
    drawFloor(g);
    drawStairs(g);
    drawEventosDoor(g);
    drawNeon(g);
    drawWindow(g);
    drawBoard(g);
    drawLema(g);
    drawEmbudo(g);
    drawPufs(g);
    drawRollup(g);
    drawTadeoDesk(g);
    drawTermometro(g);
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
