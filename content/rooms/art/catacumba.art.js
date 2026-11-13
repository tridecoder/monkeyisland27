// SALA `catacumba` — La Catacumba (Redacción de Papel). Arte y geometría. Biblia §3.4 + adenda §3.6.
// Sótano de talleres amarillento: tuberías en el techo, galeradas colgadas como jamones, mesa de Teodoro (fax) a la
// izquierda, mesa de Aurora a la derecha, camastro tras una cortina, cajonera de tipos, bombillas desnudas.
import { PAL, px, rect, hline, vline, frameRect, line, poly, ellipse, paint, ditherPick, ditherOverlay, noise, glow, gradV,
  rng, hash2, shade, shadowEllipse, bevel, vignette, floorPlanks, desk, wallClock,
  bookshelf, newspaperStack, mug, papers, lightCone, trashBin } from '../../../engine/draw.js';
import { greek, cap, pin, stain, dropShadow, fabric, cord } from './lib-catacumba-util.js';
import { tiny } from './lib-oficina.js';

const W = 320;
const TOB = ['#2c2016', '#45321f', '#5f4829', '#7a5f35', '#957845', '#b09457', '#c9ae70']; // pared con nicotina
const GRN = [PAL.green[0], PAL.green[1], PAL.green[2], PAL.green[3], PAL.green[4]];        // zócalo verde de cola
const OLDW = PAL.wood.map((c) => shade(c, -0.12));

// ------------------------------------------------------------ geometría
const layout = {
  catacumba_a_office: { rect: [4, 30, 36, 68], walkTo: [30, 112], face: 'left' },
  galeradas: { rect: [54, 15, 118, 24], walkTo: [120, 112], face: 'up' },
  camastro: { rect: [44, 52, 34, 46], walkTo: [62, 112], face: 'up' },
  fax: {
    rect: [96, 68, 26, 17], walkTo: [108, 112], face: 'up',
    sprites: {
      sin_papel: (g, v, t) => drawFax(g, 96, 68, false, t),
      con_papel: (g, v, t) => drawFax(g, 96, 68, true, t),
      default: (g, v, t) => drawFax(g, 96, 68, false, t),
    },
  },
  telefono_rojo: {
    poly: [[111, 58], [146, 58], [146, 72], [143, 72], [143, 87], [122, 87], [122, 72], [111, 72]], walkTo: [132, 112], face: 'up',
    sprites: { colgado: (g) => drawTelefono(g, false), descolgado: (g) => drawTelefono(g, true), default: (g) => drawTelefono(g, false) },
  },
  tipometro: { rect: [143, 79, 16, 8], walkTo: [150, 112], face: 'up' },
  reloj_2147: { rect: [147, 35, 18, 18], walkTo: [152, 112], face: 'up' },
  fotos_jefes_cierre: { rect: [170, 29, 48, 24], walkTo: [194, 112], face: 'up' },
  fax_enmarcado: { rect: [222, 28, 22, 28], walkTo: [226, 114], face: 'up' },
  cartel_aurora: { rect: [248, 41, 50, 29], walkTo: [264, 114], face: 'up' },
  libro_estilo: { rect: [256, 72, 28, 13], walkTo: [270, 114], face: 'up' },
  bolis_aurora: { rect: [285, 66, 15, 22], walkTo: [292, 114], face: 'up', priority: 1 },
  corrector_aurora: { rect: [256, 85, 28, 5], walkTo: [276, 116], face: 'up', priority: 2 },
  // Teodoro: de pie junto a la cajonera; `telefono` = su sitio al teléfono rojo en la escena 7.3a (delante de su mesa,
  // a la derecha del teléfono, para que se vean a la vez el aparato descolgado, el cable y el auricular en su oreja)
  teodoro_cuerpodoce: { at: [166, 104, 'left'], walkTo: [190, 114], face: 'left', positions: { telefono: { at: [156, 106, 'left'] } } },
  aurora_galerada: { at: [238, 106, 'right'], walkTo: [222, 114], face: 'right' },
};

// ------------------------------------------------------------ objetos con estado
/** Teléfono rojo sin teclas ni disco (línea directa con la rotativa). Descolgado: la horquilla vacía, el cable rizado
 *  sube hacia la mano de Teodoro (el auricular lo pinta su `drawExtra` en content/actors.js mientras habla). */
function drawTelefono(g, descolgado) {
  poly(g, [[125, 79], [139, 79], [141, 85], [123, 85]], PAL.red[3]);
  hline(g, 125, 79, 14, PAL.red[5]); hline(g, 123, 85, 19, PAL.red[1]);
  ellipse(g, 132, 82, 4, 1.5, PAL.red[2]); px(g, 130, 81, PAL.red[6]);
  if (!descolgado) {
    rect(g, 123, 75, 19, 4, PAL.red[3]); hline(g, 123, 75, 19, PAL.red[5]); hline(g, 123, 78, 19, PAL.red[1]);
    rect(g, 122, 76, 3, 5, PAL.red[2]); rect(g, 140, 76, 3, 5, PAL.red[2]);
  } else {
    // horquilla vacía: dos patillas y el botón de colgar levantado
    rect(g, 124, 76, 2, 3, PAL.red[2]); rect(g, 138, 76, 2, 3, PAL.red[2]); px(g, 124, 76, PAL.red[5]); px(g, 138, 76, PAL.red[5]);
    rect(g, 130, 77, 4, 2, PAL.metal[5]); hline(g, 130, 77, 4, PAL.metal[7]);
    // el cable rizado sale tenso hacia la derecha y arriba (hacia el auricular)
    for (let i = 0; i < 9; i++) px(g, 141 + i, 80 - Math.round(i * 0.9) + ((i & 1) ? 1 : 0), PAL.red[2]);
  }
  for (let i = 0; i < 6; i++) px(g, 122 - i, 84 + (i & 1), PAL.ink[1]);
}

/** Fax beige de 1992, 26x17. Sin papel: bandeja vacía + luz roja que parpadea; con papel: folios y papel continuo saliendo. */
function drawFax(g, x, y, papel, t) {
  const B = PAL.paper;
  shadowEllipse(g, x + 13, y + 17, 15, 2, 0.6);
  poly(g, [[x + 3, y], [x + 21, y], [x + 24, y + 5], [x + 2, y + 5]], papel ? PAL.paper[6] : PAL.metal[2]);
  if (papel) { hline(g, x + 5, y + 1, 14, B[3]); hline(g, x + 4, y + 3, 17, B[3]); hline(g, x + 4, y, 16, B[7]); }
  else { hline(g, x + 3, y, 18, PAL.metal[4]); }
  bevel(g, x, y + 5, 26, 12, B[3], B[5], B[0]);
  hline(g, x + 1, y + 6, 24, B[4]);
  rect(g, x + 15, y + 8, 9, 3, PAL.crt[0]);
  rect(g, x + 15, y + 8, 9, 1, PAL.crt[1]);
  if (!papel) { for (let i = 0; i < 4; i++) rect(g, x + 16 + i * 2, y + 9, 1, 2, PAL.crt[3]); }
  else { hline(g, x + 16, y + 9, 7, PAL.crt[5]); hline(g, x + 16, y + 10, 4, PAL.crt[4]); }
  for (let i = 0; i < 5; i++) rect(g, x + 15 + i * 2, y + 13, 1, 1, i % 2 ? PAL.metal[1] : B[1]);
  const blink = !papel && ((t || 0) % 1200) < 600;
  rect(g, x + 22, y + 14, 2, 1, papel ? PAL.crt[5] : blink ? '#FF7E6A' : PAL.red[1]);
  if (!papel && blink) glow(g, x + 23, y + 14, 6, 4, '#ff5a40', 0.18, 3);
  rect(g, x + 2, y + 13, 11, 2, PAL.ink[1]);
  if (papel) {
    poly(g, [[x + 3, y + 14], [x + 12, y + 14], [x + 13, y + 17], [x + 2, y + 17]], B[6]);
    for (let i = 0; i < 3; i++) hline(g, x + 4 + i, y + 15, 5 - i, B[3]);
  }
  hline(g, x, y + 16, 26, B[0]);
  rect(g, x + 1, y + 17, 3, 1, PAL.ink[1]); rect(g, x + 22, y + 17, 3, 1, PAL.ink[1]);
  if (papel) {
    for (let i = 0; i < 7; i++) {
      const yy = y + 17 + i; rect(g, x + 4, yy, 7, 1, i % 2 ? B[5] : B[6]);
      if (i % 3 === 0) { px(g, x + 4, yy, PAL.ink[3]); px(g, x + 10, yy, PAL.ink[3]); }
    }
    hline(g, x + 5, y + 20, 5, B[2]);
  }
}

// ------------------------------------------------------------ piezas del fondo
function drawCeiling(g) {
  gradV(g, 0, 0, W, 16, [PAL.ink[0], PAL.ink[1], '#2a1e16', '#33261a']);
  noise(g, 0, 0, W, 14, '#4a3828', 0.06, 2);
  rect(g, 0, 12, W, 3, '#1c140e'); hline(g, 0, 12, W, '#4b3a28'); hline(g, 0, 15, W, '#241912');
  const ramp = [PAL.metal[1], PAL.metal[2], PAL.metal[4], PAL.metal[5], PAL.metal[4], PAL.metal[2]];
  for (let k = 0; k < 6; k++) hline(g, 0, 3 + k, W, ramp[k]);
  for (let x = 0; x < W; x += 2) px(g, x, 4, PAL.metal[6]);
  hline(g, 0, 9, W, PAL.ink[0]);
  rect(g, 0, 10, W, 2, '#6a4a30'); hline(g, 0, 10, W, '#9a7248'); hline(g, 0, 11, W, '#3a281a');
  for (const bx of [22, 70, 118, 166, 214, 262, 308]) {
    rect(g, bx, 2, 4, 9, PAL.metal[2]); vline(g, bx, 2, 9, PAL.metal[5]); vline(g, bx + 3, 2, 9, PAL.ink[1]);
    px(g, bx + 1, 4, PAL.ink[0]); px(g, bx + 1, 8, PAL.ink[0]);
  }
  for (const rx of [214]) { for (let i = 0; i < 9; i++) px(g, rx + 1, 12 + i, i < 3 ? '#8a4a24' : '#5a3a20'); stain(g, rx + 1, 18, 5, 3, '#4a3018', 0.5); }
}

function drawWall(g) {
  paint(g, 0, 15, W, 82, (x, y) => {
    const ty = (y - 15) / 82;
    const lightL = Math.exp(-Math.pow((x - 130) / 140, 2)) * 0.5 + Math.exp(-Math.pow((x - 262) / 90, 2)) * 0.3;
    return ditherPick(x, y, TOB, Math.min(0.95, 0.18 + ty * 0.38 + lightL * 0.35));
  });
  noise(g, 0, 15, W, 80, TOB[1], 0.025, 4);
  stain(g, 40, 30, 14, 9, TOB[1], 0.5); stain(g, 190, 22, 22, 6, TOB[1], 0.45); stain(g, 300, 38, 12, 14, TOB[1], 0.5);
  stain(g, 232, 62, 8, 6, TOB[2], 0.4);
  paint(g, 0, 70, W, 26, (x, y) => ditherPick(x, y, [GRN[2], GRN[3], GRN[4]], 0.25 + (96 - y) / 26 * 0.3 + hash2(x >> 2, y, 3) * 0.12));
  hline(g, 0, 69, W, TOB[6]); hline(g, 0, 70, W, GRN[4]); hline(g, 0, 71, W, GRN[1]);
  ditherOverlay(g, 0, 72, W, 6, PAL.shadow, 0.22);
  noise(g, 0, 72, W, 24, GRN[1], 0.06, 12);
  rect(g, 0, 95, W, 3, PAL.wood[2]); hline(g, 0, 95, W, PAL.wood[4]); hline(g, 0, 97, W, PAL.ink[0]);
}

function drawFloor(g) {
  floorPlanks(g, { x: 0, y: 98, w: W, h: 46, vpx: W / 2, vpy: 30, plank: 11, ramp: OLDW, seed: 14, far: PAL.ink[0], fade: 0.55 });
  for (let i = 0; i < 26; i++) { const x = 6 + ((hash2(i, 1, 3) * (W - 14)) | 0), y = 101 + ((hash2(i, 2, 3) * 40) | 0), w = 3 + ((hash2(i, 3, 3) * 6) | 0); hline(g, x, y, w, PAL.ink[1]); hline(g, x + 1, y + 1, w - 2, PAL.wood[1]); }
  ditherOverlay(g, 0, 98, W, 4, PAL.shadow, 0.5);
}

function drawDoor(g) {
  rect(g, 4, 28, 38, 70, PAL.wood[1]); frameRect(g, 4, 28, 38, 70, PAL.ink[0]);
  gradV(g, 7, 31, 32, 67, [PAL.wood[4], PAL.wood[3], PAL.wood[2]]);
  vline(g, 7, 31, 67, PAL.wood[5]); vline(g, 38, 31, 67, PAL.wood[1]);
  for (const [py0, ph] of [[52, 18], [72, 24]]) {
    rect(g, 12, py0, 22, ph, PAL.wood[2]); hline(g, 12, py0, 22, PAL.wood[1]); vline(g, 12, py0, ph, PAL.wood[1]);
    hline(g, 12, py0 + ph - 1, 22, PAL.wood[5]); vline(g, 33, py0, ph, PAL.wood[5]);
    gradV(g, 13, py0 + 1, 20, ph - 2, [PAL.wood[3], PAL.wood[2]]);
  }
  // rótulo colgado sobre la puerta
  ditherOverlay(g, 5, 19, 46, 11, PAL.shadow, 0.5);
  bevel(g, 3, 16, 46, 11, PAL.gold[3], PAL.gold[5], PAL.gold[1]);
  cap(g, 'TALLERES', 26, 18, PAL.ink[1], { align: 'center' });
  px(g, 5, 15, PAL.ink[0]); px(g, 46, 15, PAL.ink[0]);
  rect(g, 12, 38, 22, 9, PAL.wood[2]); hline(g, 12, 38, 22, PAL.wood[1]); hline(g, 12, 46, 22, PAL.wood[5]);
  rect(g, 18, 40, 10, 5, PAL.paper[6]); greek(g, 19, 41, 8, 2, PAL.metal[3], 2);
  rect(g, 32, 62, 3, 4, PAL.gold[3]); px(g, 32, 62, PAL.gold[6]); px(g, 33, 68, PAL.ink[0]);
  hline(g, 8, 97, 30, PAL.gold[5]); ditherOverlay(g, 8, 94, 30, 3, PAL.gold[6], 0.3);
  rect(g, 15, 55, 10, 7, PAL.paper[5]); frameRect(g, 15, 55, 10, 7, PAL.paper[2]); rect(g, 19, 57, 2, 2, PAL.red[4]); line(g, 16, 59, 24, 61, PAL.red[4]);
  ditherOverlay(g, 4, 98, 40, 5, PAL.shadow, 0.55);
}

function drawGaleradas(g) {
  const x0 = 54, x1 = 172;
  cord(g, x0, 17, x1, 19, 4, PAL.wood[5]);
  px(g, x0, 17, PAL.ink[0]); px(g, x1, 19, PAL.ink[0]);
  const r = rng(77);
  for (let x = x0 + 5; x < x1 - 3; x += 7 + ((r() * 4) | 0)) {
    const t = (x - x0) / (x1 - x0), cy = Math.round(17 + 2 * t + Math.sin(t * Math.PI) * 4);
    const len = 13 + ((r() * 11) | 0), w = 6 + ((r() * 3) | 0);
    const lean = r() < 0.5 ? -1 : 1;
    ditherOverlay(g, x + 2, cy + 2, w, len, PAL.shadow, 0.35);
    for (let yy = 0; yy < len; yy++) {
      const xo = Math.round(lean * Math.sin(yy / len * 2) * 0.8);
      hline(g, x + xo, cy + yy, w, PAL.paper[5]);
      px(g, x + xo, cy + yy, PAL.paper[3]); px(g, x + xo + w - 1, cy + yy, PAL.paper[2]);
    }
    rect(g, x + 1, cy + 2, w - 2, 2, PAL.ink[2]);
    greek(g, x + 1, cy + 5, w - 2, ((len - 7) / 2) | 0, PAL.paper[2], x, 2, 0.6);
    if (r() < 0.6) { const my = cy + 6 + ((r() * (len - 9)) | 0); hline(g, x, my, w, PAL.red[4]); px(g, x + w - 1, my - 1, PAL.red[4]); }
    rect(g, x + (w >> 1) - 1, cy - 1, 2, 4, PAL.wood[5]); px(g, x + (w >> 1) - 1, cy - 1, PAL.wood[7]);
    px(g, x, cy + len - 1, PAL.paper[2]); px(g, x + w - 1, cy + len, PAL.paper[2]);
  }
}

function drawReloj(g) {
  shadowEllipse(g, 158, 53, 9, 1, 0.3);
  ellipse(g, 157, 45, 10, 10, PAL.ink[0]);
  ellipse(g, 156, 44, 9, 9, PAL.metal[3]);
  ellipse(g, 156, 44, 8, 8, (x, y, d) => d > 0.85 ? PAL.paper[4] : d > 0.55 ? PAL.paper[6] : PAL.paper[7]);
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    px(g, Math.round(156 + Math.sin(a) * 6.3), Math.round(44 - Math.cos(a) * 6.3), PAL.ink[1]);
  }
  wallClock(g, 156, 44, 8, 20 + 59 / 60);
  line(g, 152, 39, 156, 44, PAL.paper[7]); px(g, 153, 41, PAL.paper[7]);
  px(g, 151, 40, PAL.white); px(g, 152, 39, PAL.white);
}

function drawFotos(g) {
  const xs = [172, 184, 196, 208];
  const mood = [PAL.metal[5], PAL.metal[6], PAL.metal[4], PAL.metal[5]];
  const hairs = [PAL.ink[1], PAL.metal[1], PAL.ink[2], PAL.metal[2]];
  for (let i = 0; i < 4; i++) {
    const x = xs[i], y = i % 2 ? 33 : 31;
    dropShadow(g, x, y, 11, 15, 2, 2, 0.55);
    rect(g, x, y, 11, 15, PAL.wood[2]); hline(g, x, y, 11, PAL.wood[5]); vline(g, x, y, 15, PAL.wood[4]); hline(g, x, y + 14, 11, PAL.wood[0]); vline(g, x + 10, y, 15, PAL.wood[0]);
    rect(g, x + 1, y + 1, 9, 13, PAL.paper[6]);
    gradV(g, x + 2, y + 2, 7, 10, [mood[i], PAL.metal[3]]);
    ellipse(g, x + 5, y + 6, 2.3, 3, PAL.metal[7]);
    hline(g, x + 3, y + 3, 5, hairs[i]); if (i === 1) hline(g, x + 3, y + 4, 5, hairs[i]);
    if (i === 2) { px(g, x + 3, y + 4, hairs[i]); px(g, x + 7, y + 4, hairs[i]); }
    px(g, x + 4, y + 6, PAL.ink[0]); px(g, x + 6, y + 6, PAL.ink[0]);
    hline(g, x + 3, y + 8, 5, PAL.ink[0]); if (i % 2) { px(g, x + 3, y + 9, PAL.ink[0]); px(g, x + 7, y + 9, PAL.ink[0]); }
    rect(g, x + 2, y + 10, 7, 2, PAL.ink[2]); px(g, x + 5, y + 10, PAL.paper[6]);
    px(g, x + 8, y + 2, PAL.white);
  }
  bevel(g, 176, 47, 38, 5, PAL.gold[3], PAL.gold[5], PAL.gold[1]);
  greek(g, 178, 49, 34, 1, PAL.gold[1], 3);
}

function drawFaxEnmarcado(g) {
  dropShadow(g, 224, 30, 18, 22, 2, 2, 0.55);
  rect(g, 223, 29, 18, 24, PAL.wood[2]); hline(g, 223, 29, 18, PAL.wood[6]); vline(g, 223, 29, 24, PAL.wood[5]); hline(g, 223, 52, 18, PAL.wood[0]); vline(g, 240, 29, 24, PAL.wood[0]);
  gradV(g, 225, 31, 14, 20, ['#e8e0c4', '#cfc6a2']);
  hline(g, 226, 32, 12, PAL.ink[3]); hline(g, 226, 34, 8, PAL.metal[4]);
  cap(g, '¿?', 232, 37, PAL.ink[1], { align: 'center', bold: true });
  greek(g, 226, 45, 12, 2, PAL.metal[3], 5);
  line(g, 226, 49, 230, 48, PAL.blue[3]); line(g, 230, 48, 234, 50, PAL.blue[3]); line(g, 234, 50, 237, 48, PAL.blue[3]);
  for (let y = 32; y < 50; y += 3) px(g, 225, y, '#b8ae88');
  px(g, 238, 31, PAL.white); px(g, 237, 32, PAL.white);
}

function drawCajonera(g) {
  const x = 166, y = 58, w = 40, h = 41;
  shadowEllipse(g, x + w / 2, y + h, w / 2 + 4, 3, 0.7);
  dropShadow(g, x, y, w, h, 3, 1, 0.4);
  rect(g, x, y, w, h, PAL.wood[1]);
  gradV(g, x + 1, y + 1, w - 2, h - 2, [PAL.wood[3], PAL.wood[2], PAL.wood[2]]);
  hline(g, x, y, w, PAL.wood[6]); vline(g, x, y, h, PAL.wood[4]); vline(g, x + w - 1, y, h, PAL.wood[0]);
  rect(g, x - 1, y - 2, w + 2, 3, PAL.wood[3]); hline(g, x - 1, y - 2, w + 2, PAL.wood[6]);
  const cols = 5, rows = 6, cw = (w - 4) / cols, ch = (h - 6) / rows;
  const r = rng(61);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const cx = Math.round(x + 2 + i * cw), cy = Math.round(y + 3 + j * ch);
    bevel(g, cx, cy, Math.round(cw) - 1, Math.round(ch) - 1, PAL.wood[4], PAL.wood[5], PAL.wood[1]);
    hline(g, cx + 2, cy + 3, Math.round(cw) - 5, PAL.gold[4]); px(g, cx + 2, cy + 3, PAL.gold[6]);
    rect(g, cx + 2, cy + 1, 3, 1, PAL.paper[5]);
    if (r() < 0.1) rect(g, cx + 1, cy + 4, Math.round(cw) - 3, 1, PAL.ink[0]);
  }
  rect(g, x + 4, y - 7, 10, 5, PAL.metal[3]); hline(g, x + 4, y - 7, 10, PAL.metal[6]); hline(g, x + 4, y - 3, 10, PAL.ink[1]);
  for (let i = 0; i < 7; i++) vline(g, x + 5 + i, y - 6, 3, i % 2 ? PAL.metal[5] : PAL.metal[7]);
  rect(g, x + 27, y - 8, 6, 6, PAL.teal[3]); hline(g, x + 27, y - 8, 6, PAL.teal[6]); hline(g, x + 27, y - 5, 6, PAL.paper[4]);
}

function drawTeodoroDesk(g) {
  desk(g, 78, 82, 78, 19, { ramp: OLDW, depth: 7, drawers: true, kneeHole: false, drawersBoth: true });
  poly(g, [[84, 83], [150, 83], [152, 88], [82, 88]], PAL.green[2]); hline(g, 84, 83, 66, PAL.green[4]); hline(g, 82, 88, 70, PAL.green[1]);
  px(g, 93, 86, PAL.ink[0]); px(g, 128, 85, PAL.ink[0]); ellipse(g, 136, 87, 2, 1, PAL.wood[1]);
  // lámpara verde de banquero
  rect(g, 81, 85, 7, 2, PAL.metal[2]); hline(g, 81, 85, 7, PAL.metal[5]);
  vline(g, 84, 74, 11, PAL.gold[3]); px(g, 83, 75, PAL.gold[6]);
  poly(g, [[78, 75], [91, 75], [89, 70], [80, 70]], PAL.green[3]); hline(g, 80, 70, 9, PAL.green[6]); hline(g, 78, 75, 13, PAL.green[1]);
  hline(g, 79, 76, 11, PAL.gold[5]); ditherOverlay(g, 77, 77, 15, 2, PAL.gold[6], 0.5);
  // cenicero-lapicero
  const ax = 94; rect(g, ax, 80, 5, 6, PAL.teal[3]); hline(g, ax, 80, 5, PAL.teal[6]); vline(g, ax, 80, 6, PAL.teal[5]); hline(g, ax, 85, 5, PAL.teal[1]);
  for (const [dx, h, c] of [[1, 6, PAL.red[4]], [2, 9, PAL.gold[4]], [3, 7, PAL.blue[4]], [4, 5, PAL.paper[5]]]) { vline(g, ax + dx, 80 - h, h, c); px(g, ax + dx, 80 - h, PAL.ink[1]); }
  line(g, ax + 5, 80, ax + 8, 77, PAL.paper[6]); px(g, ax + 8, 77, PAL.red[5]);
  papers(g, 123, 85, 14, { n: 2, seed: 4 });
  // (el teléfono rojo es el objeto `telefono_rojo`: se pinta por estado, colgado / descolgado)
  // cartelito clavado en la pared encima del teléfono: «LÍNEA DIRECTA · ROTATIVA» (se lee desde la primera vez)
  dropShadow(g, 111, 59, 35, 12, 1, 1, 0.5);
  rect(g, 111, 59, 35, 12, PAL.paper[6]); hline(g, 111, 59, 35, PAL.paper[7]); hline(g, 111, 70, 35, PAL.paper[3]);
  rect(g, 111, 59, 35, 3, PAL.red[3]);
  tiny(g, 'ROTATIVA', 128, 64, PAL.red[2], { align: 'center' });
  pin(g, 113, 61, PAL.gold[5]); pin(g, 143, 61, PAL.gold[5]);
  // el cable rizado baja de la pared (la línea va «al polígono»): de la clavija al teléfono
  for (let y = 71; y < 77; y++) px(g, 146 + ((y & 1) ? 1 : 0), y, PAL.ink[1]);
  rect(g, 145, 69, 4, 3, PAL.metal[3]); px(g, 146, 70, PAL.ink[0]);
  // tipómetro
  poly(g, [[144, 86], [158, 81], [159, 83], [146, 88]], PAL.metal[6]);
  line(g, 144, 86, 158, 81, PAL.metal[7]);
  for (let i = 0; i < 12; i += 2) px(g, 145 + i, 86 - Math.round(i * 0.36), PAL.ink[1]);
  line(g, 146, 88, 159, 83, PAL.metal[3]);
}

function drawAuroraDesk(g) {
  desk(g, 246, 82, 52, 19, { ramp: PAL.wood, depth: 7, drawers: true, kneeHole: true });
  poly(g, [[250, 83], [292, 83], [294, 88], [248, 88]], PAL.paper[4]); hline(g, 250, 83, 42, PAL.paper[6]);
  for (let i = 0; i < 9; i++) px(g, 251 + i * 5, 85 + (i & 1), i % 3 ? PAL.red[4] : PAL.blue[3]);
  mug(g, 248, 86, { color: PAL.paper, logo: PAL.red[4] });
  // bote con bolis rojos
  rect(g, 287, 77, 8, 9, PAL.metal[3]); vline(g, 287, 77, 9, PAL.metal[6]); vline(g, 294, 77, 9, PAL.metal[1]); hline(g, 287, 77, 8, PAL.metal[7]); hline(g, 287, 85, 8, PAL.ink[1]);
  rect(g, 288, 80, 6, 3, PAL.red[3]); hline(g, 288, 80, 6, PAL.red[5]);
  for (const [dx, dy, c] of [[0, -9, PAL.red[4]], [2, -10, PAL.red[5]], [4, -8, PAL.red[4]], [5, -9, PAL.red[3]]]) {
    line(g, 290 + (dx >> 1), 77, 289 + dx, 77 + dy, c); px(g, 289 + dx, 77 + dy - 1, PAL.ink[0]);
  }
  // el boli muerto, tumbado: descolorido
  line(g, 283, 87, 296, 86, '#7a4638'); line(g, 283, 88, 296, 87, '#5a2c24');
  px(g, 296, 86, PAL.ink[0]); px(g, 283, 86, '#a07a6a'); px(g, 290, 85, PAL.paper[3]);
}

function drawLibroEstilo(g) {
  const x = 256, y = 72, w = 28, h = 13;
  shadowEllipse(g, x + w / 2, y + h + 1, w / 2 + 3, 2, 0.6);
  gradV(g, x, y, w, h - 3, [PAL.red[4], PAL.red[3], PAL.red[2]]);
  hline(g, x, y, w, PAL.red[6]); vline(g, x, y, h - 3, PAL.red[5]); vline(g, x + w - 1, y, h - 3, PAL.red[1]);
  for (const bx of [x + 4, x + 8, x + w - 9, x + w - 5]) { vline(g, bx, y + 1, h - 5, PAL.gold[4]); vline(g, bx + 1, y + 1, h - 5, PAL.gold[2]); }
  rect(g, x + 11, y + 3, 6, 4, PAL.gold[4]); frameRect(g, x + 11, y + 3, 6, 4, PAL.gold[2]);
  hline(g, x + 12, y + 4, 4, PAL.red[2]); hline(g, x + 12, y + 6, 4, PAL.red[2]);
  rect(g, x + 1, y + h - 3, w - 2, 3, PAL.paper[6]);
  for (let i = 0; i < w - 2; i += 2) px(g, x + 1 + i, y + h - 2, PAL.paper[4]);
  hline(g, x, y + h - 3, w, PAL.red[1]); hline(g, x + 1, y + h, w - 2, PAL.paper[2]);
  rect(g, x + 22, y + h - 1, 2, 3, PAL.gold[5]); rect(g, x + 4, y - 1, 3, 2, PAL.gold[5]); rect(g, x + 8, y - 1, 3, 1, PAL.blue[4]);
}

function drawCorrector(g) {
  const x = 254, y = 85;
  rect(g, x, y + 1, 32, 4, PAL.ink[0]);
  poly(g, [[x + 1, y], [x + 31, y], [x + 32, y + 4], [x, y + 4]], PAL.metal[1]);
  hline(g, x + 1, y, 30, PAL.metal[4]);
  rect(g, x + 2, y + 1, 28, 2, '#101624'); hline(g, x + 3, y + 1, 5, PAL.blue[3]);
  rect(g, x + 24, y + 1, 4, 3, PAL.teal[5]); px(g, x + 25, y + 2, PAL.white); px(g, x + 27, y + 2, PAL.white);
  line(g, x + 31, y + 3, x + 34, y + 5, PAL.ink[1]); px(g, x + 34, y + 5, PAL.red[5]);
}

function drawCartelAurora(g) {
  const x = 248, y = 41;
  dropShadow(g, x, y, 49, 29, 2, 2, 0.5);
  poly(g, [[x, y + 1], [x + 49, y], [x + 50, y + 28], [x + 1, y + 29]], '#e6d070');
  gradV(g, x, y, 50, 29, ['#ead679', '#d8c15c']);
  hline(g, x, y, 49, '#f3e69a'); vline(g, x, y, 29, '#f3e69a'); hline(g, x + 1, y + 29, 49, '#a58f3a');
  pin(g, x + 3, y + 3); pin(g, x + 46, y + 2, PAL.blue[4]);
  cap(g, 'NO HABLO', x + 24, y + 3, PAL.red[2], { align: 'center' });
  cap(g, 'ANTES DEL', x + 24, y + 12, PAL.red[2], { align: 'center' });
  cap(g, 'CAFÉ.', x + 22, y + 22, PAL.red[2], { align: 'center' });
  ellipse(g, x + 40, y + 24, 3, 2, '#bd9a3a'); ellipse(g, x + 40, y + 24, 2, 1, '#d8c15c');
}

function drawArchivo(g) {
  bookshelf(g, 301, 38, 18, 60, { ramp: OLDW, seed: 31, shelves: 5 });
  for (let sy = 40; sy < 94; sy += 12) hline(g, 302, sy + 9, 16, PAL.gold[3]);
  ditherOverlay(g, 301, 38, 18, 60, PAL.shadow, 0.25);
}

function drawCamastro(g) {
  const x = 42, y = 50;
  rect(g, x, y, 36, 47, PAL.ink[1]);
  paint(g, x + 1, y + 1, 34, 46, (xx, yy) => ditherPick(xx, yy, [TOB[0], TOB[1], TOB[2]], 0.15 + (yy - y) / 47 * 0.3));
  rect(g, x + 28, y + 6, 4, 9, PAL.ink[2]); poly(g, [[x + 28, y + 15], [x + 32, y + 15], [x + 34, y + 22], [x + 26, y + 22]], '#3a4650');
  line(g, 50, 84, 48, 92, PAL.metal[2]); line(g, 70, 84, 72, 92, PAL.metal[2]); line(g, 50, 92, 70, 84, PAL.metal[2]);
  rect(g, 46, 80, 28, 5, PAL.metal[3]); hline(g, 46, 80, 28, PAL.metal[5]);
  poly(g, [[48, 73], [74, 73], [76, 82], [46, 82]], PAL.red[2]);
  paint(g, 46, 73, 31, 10, (xx, yy) => ((xx >> 2) + (yy >> 1)) % 2 === 0 ? ((xx >> 2) % 2 ? PAL.red[3] : PAL.red[1]) : null);
  for (let i = 0; i < 6; i++) vline(g, 49 + i * 5, 74, 8, PAL.paper[4]);
  hline(g, 47, 78, 29, PAL.paper[4]);
  hline(g, 48, 73, 26, PAL.red[5]); hline(g, 46, 82, 30, PAL.red[0]);
  rect(g, 49, 70, 11, 5, PAL.paper[5]); hline(g, 49, 70, 11, PAL.paper[7]); hline(g, 49, 74, 11, PAL.paper[2]); greek(g, 51, 72, 6, 1, PAL.paper[3], 4);
  rect(g, 54, 91, 6, 3, PAL.ink[2]); rect(g, 62, 91, 6, 3, PAL.ink[2]); hline(g, 54, 91, 6, PAL.metal[3]);
  rect(g, 73, 83, 2, 6, PAL.paper[5]); px(g, 73, 88, PAL.paper[3]);
  shadowEllipse(g, 60, 96, 18, 3, 0.7);
  // cortina entreabierta
  rect(g, 39, 48, 42, 2, PAL.wood[1]); hline(g, 39, 48, 42, PAL.wood[5]);
  const cur = [PAL.purple[1], PAL.purple[2], PAL.purple[3], PAL.purple[4], PAL.purple[5]];
  fabric(g, 40, 50, 10, 45, cur, { fold: 4, phase: 1 });
  poly(g, [[69, 50], [79, 50], [81, 95], [66, 95]], (xx, yy) => ditherPick(xx, yy, cur, 0.15 + Math.abs(Math.sin(xx * 0.9)) * 0.7));
  hline(g, 40, 95, 10, PAL.ink[0]); hline(g, 66, 95, 15, PAL.ink[0]);
  for (let i = 0; i < 6; i++) px(g, 41 + i * 4, 49, PAL.metal[6]);
  for (let i = 0; i < 5; i++) px(g, 68 + i * 3, 49, PAL.metal[6]);
  line(g, 40, 80, 50, 83, PAL.gold[4]); rect(g, 50, 82, 2, 2, PAL.gold[5]);
  ditherOverlay(g, 50, 52, 6, 40, PAL.shadow, 0.3);
}

function drawBucket(g) {
  const x = 214, y = 99;
  shadowEllipse(g, x, y, 8, 2, 0.7);
  poly(g, [[x - 5, y - 8], [x + 5, y - 8], [x + 4, y], [x - 4, y]], (xx) => ditherPick(xx, 0, [PAL.metal[2], PAL.metal[4], PAL.metal[6], PAL.metal[3]], (xx - x + 5) / 10));
  hline(g, x - 5, y - 8, 11, PAL.metal[7]); hline(g, x - 4, y - 1, 9, PAL.metal[1]);
  ellipse(g, x, y - 8, 5, 1, PAL.teal[4]);
}

function drawRug(g) {
  // alfombra raída entre las dos mesas
  const quad = [[112, 108], [232, 108], [250, 138], [96, 138]];
  poly(g, quad, (x, y) => {
    const v = hash2(x >> 1, y, 3);
    const edge = x < 118 + (y - 108) * -0.5 || false;
    return v < 0.1 ? PAL.red[0] : ditherPick(x, y, [PAL.red[1], PAL.red[2]], 0.4 + hash2(x, y >> 1, 8) * 0.3);
  });
  const [a, b, c, d] = quad;
  const ins = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const tl = ins(a, c, 0.07), tr = ins(b, d, 0.07), br = ins(c, a, 0.07), bl = ins(d, b, 0.07);
  for (const [p, q] of [[tl, tr], [tr, br], [br, bl], [bl, tl]]) line(g, Math.round(p[0]), Math.round(p[1]), Math.round(q[0]), Math.round(q[1]), PAL.gold[2]);
  // medallón y flecos raídos
  ellipse(g, 172, 123, 24, 6, (x, y, d) => d > 0.8 ? PAL.gold[2] : d > 0.5 ? PAL.red[3] : PAL.red[1]);
  for (let i = 0; i < 20; i++) px(g, 98 + i * 7, 138 + (i & 1), PAL.paper[3]);
  ditherOverlay(g, 96, 108, 154, 6, PAL.shadow, 0.35);
}

function drawFloorProps(g) {
  newspaperStack(g, 289, 100, 15, 7); newspaperStack(g, 301, 100, 13, 4);
  for (const [x, y] of [[120, 118], [196, 123], [90, 130], [262, 132], [150, 136]]) { poly(g, [[x, y], [x + 6, y - 1], [x + 7, y + 2], [x + 1, y + 3]], PAL.paper[5]); hline(g, x + 1, y + 1, 4, PAL.paper[3]); }
  trashBin(g, 72, 101, { w: 11, h: 12 });
}

function drawLight(g) {
  for (const [bx, by] of [[62, 24], [122, 22], [184, 24], [246, 22], [292, 22]]) {
    vline(g, bx, 14, by - 14, PAL.ink[0]);
    rect(g, bx - 1, by, 3, 3, PAL.metal[3]);
    ellipse(g, bx, by + 6, 3, 4, PAL.gold[6]); px(g, bx - 1, by + 5, PAL.white);
    glow(g, bx, by + 8, 44, 26, PAL.gold[5], 0.12, 5);
    glow(g, bx, by + 8, 20, 12, PAL.light, 0.12, 3);
  }
  glow(g, 104, 80, 50, 14, PAL.gold[5], 0.10, 4);
  glow(g, 272, 80, 38, 12, PAL.gold[5], 0.10, 4);
  glow(g, 90, 80, 14, 8, PAL.crt[5], 0.12, 3);
  lightCone(g, 80, 76, 6, 22, 14, PAL.gold[5], 0.12);
}

export default {
  room: 'catacumba',
  width: 320,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [[8, 104], [314, 104], [318, 142], [2, 142]] }],
  entries: { office: [30, 116, 'right'] },
  layout,
  draw(g) {
    drawCeiling(g);
    drawWall(g);
    drawFloor(g);
    drawDoor(g);
    drawGaleradas(g);
    drawCamastro(g);
    drawReloj(g);
    drawFotos(g);
    drawFaxEnmarcado(g);
    drawCajonera(g);
    drawArchivo(g);
    rect(g, 79, 15, 3, 82, PAL.metal[3]); vline(g, 79, 15, 82, PAL.metal[6]); vline(g, 81, 15, 82, PAL.ink[1]);
    drawTeodoroDesk(g);
    drawAuroraDesk(g);
    drawCartelAurora(g);
    drawLibroEstilo(g);
    drawCorrector(g);
    drawBucket(g);
    drawRug(g);
    drawFloorProps(g);
    drawLight(g);
    vignette(g, W, 144, 0.55);
  },
  animate(g, view, t) {
    const k = (t % 2400) / 2400;
    if (k < 0.55) { const y = 18 + Math.floor(Math.pow(k / 0.55, 2) * 74); px(g, 214, y, PAL.teal[6]); px(g, 214, y - 1, PAL.teal[4]); }
    else if (k < 0.7) { const r = Math.floor((k - 0.55) / 0.15 * 4); px(g, 214 - r, 91, PAL.teal[6]); px(g, 214 + r, 91, PAL.teal[6]); }
    const f = (Math.sin(t / 380) + Math.sin(t / 137) * 0.6) * 0.5;
    if (f > 0.55) glow(g, 122, 30, 30, 18, PAL.light, 0.08, 3);
    for (let i = 0; i < 4; i++) { const ph = ((t / 700) + i * 0.25) % 1; px(g, 102 + Math.round(Math.sin(ph * 6 + i) * 2), 76 - Math.floor(ph * 14), PAL.paper[5]); }
  },
  overlay(g, view, t) {
    for (let i = 0; i < 14; i++) {
      const x = (hash2(i, 1, 4) * 320 + Math.sin(t / 2000 + i) * 6 + t * 0.002) % 320;
      const y = 20 + (hash2(i, 2, 4) * 76 + t * 0.004 * (1 + (i % 3))) % 76;
      px(g, Math.floor(x), Math.floor(y), (i & 1) ? PAL.gold[6] : PAL.paper[6]);
    }
  },
};
