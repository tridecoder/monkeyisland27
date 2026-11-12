// SALA `cpd` — ARTE Y GEOMETRÍA. Biblia §3.9 + adenda §3.2 / §1.9.
// Sótano −1 de elContable.es: sala fría de servidores en luz azul, falso suelo técnico, bandejas de cables en el techo,
// armarios idénticos numerados 24-30 (el 27 «ñiiic, ñiiic» con papel continuo), mesa de Paco con el contador de
// tickets, ventilador con cuña de papel, libro de visitas en un atril, caja de ratones de bola y el ascensor (con la
// botonera común, content/lib/ascensor.js). El antiguo rincón de Valentín Retícula ya no está (Valentín trabaja en la
// Pecera, junto a la bandeja de Diseño): su hueco lo ocupan dos armarios más (22 y 23) y una maraña de cables.
// Paco está de pie detrás de su mesa, a cuerpo descubierto: el registro de tickets yace plano a su izquierda y el CRT
// está en la otra punta, para que no le tape (problema 4 del director).
import {
  PAL, mix, rect, hline, vline, frameRect, line, px, poly, ellipse, paint, gradV, gradH, bevel, hash2, rng,
  ditherOverlay, ditherPick, glow, vignette, shadowEllipse, floorTiles,
} from '../../../engine/draw.js';
import { micro, microCenter, sevenSeg } from './lib-vestibulo-micro.js';

const W = 320;
const CAB_Y = 18, CAB_H = 78;
const CABS = [
  { n: 22, x: 46, w: 24 }, { n: 23, x: 72, w: 22 }, { n: 24, x: 96, w: 20 }, { n: 25, x: 118, w: 24 }, { n: 26, x: 144, w: 24 }, { n: 27, x: 170, w: 32 },
  { n: 28, x: 242, w: 24 }, { n: 29, x: 268, w: 24 }, { n: 30, x: 294, w: 24 },
];
const LEDS = []; // [x, y, tipo, semilla]: se rellenan al pintar el fondo; animate() las hace parpadear

function tint(g, pts, color, alpha) { g.save(); g.globalAlpha = alpha; poly(g, pts, color); g.restore(); }
function tintR(g, x, y, w, h, color, alpha) { g.save(); g.globalAlpha = alpha; rect(g, x, y, w, h, color); g.restore(); }

// ------------------------------------------------------------------ armario de servidores
function rack(g, c) {
  const { x, w, n } = c;
  const y = CAB_Y, h = CAB_H;
  const r = rng(n * 101 + 7);
  shadowEllipse(g, x + w / 2, y + h + 1, w / 2 + 3, 2.5, 0.8);
  rect(g, x - 1, y - 2, w + 2, h + 2, PAL.ink[0]);
  rect(g, x, y, w, h, PAL.ink[1]);
  vline(g, x, y, h, PAL.metal[2]); vline(g, x + w - 1, y, h, PAL.ink[0]);
  hline(g, x - 1, y - 2, w + 2, PAL.metal[3]); hline(g, x, y - 1, w, PAL.metal[1]);
  rect(g, x + (w >> 1) - 7, y + 2, 14, 8, PAL.paper[6]); frameRect(g, x + (w >> 1) - 7, y + 2, 14, 8, PAL.metal[3]);
  microCenter(g, String(n), x + (w >> 1), y + 4, PAL.ink[1]);
  let uy = y + 13;
  while (uy < y + h - 7) {
    const kind = Math.floor(r() * 6);
    const uh = kind === 5 ? 9 : 4;
    if (uy + uh > y + h - 5) break;
    const ux = x + 2, uw = w - 4;
    gradV(g, ux, uy, uw, uh, [PAL.metal[3], PAL.metal[2], PAL.metal[1]]);
    hline(g, ux, uy, uw, PAL.metal[4]); hline(g, ux, uy + uh - 1, uw, PAL.ink[0]);
    vline(g, ux, uy, uh, PAL.metal[4]);
    if (kind === 0 || kind === 1) for (let b = 0; b < 4; b++) rect(g, ux + 2 + b * 4, uy + 1, 3, uh - 2, PAL.ink[2]);
    else if (kind === 2) for (let b = 0; b < 8; b++) px(g, ux + 2 + b * 2, uy + 1, PAL.ink[0]);
    else if (kind === 3) for (let b = 0; b < 6; b++) { px(g, ux + 2 + b * 3, uy + 1, b % 2 ? PAL.blue[4] : PAL.gold[4]); px(g, ux + 2 + b * 3, uy + 2, PAL.ink[0]); }
    else if (kind === 4) for (let b = 0; b < uw - 2; b += 2) px(g, ux + 1 + b, uy + 1, PAL.ink[1]);
    else { rect(g, ux + 2, uy + 2, 9, 4, PAL.ink[0]); rect(g, ux + 3, uy + 3, 6, 2, PAL.crt[3]); rect(g, ux + 13, uy + 2, uw - 15, 5, PAL.ink[1]); }
    const nled = kind === 4 ? 1 : 2 + Math.floor(r() * 3);
    for (let l = 0; l < nled; l++) LEDS.push([ux + uw - 3 - l * 2, uy + 1 + (kind === 5 ? 6 : 0), Math.floor(r() * 4), Math.floor(r() * 1000)]);
    uy += uh;
  }
  paint(g, x + 1, y + 11, w - 2, h - 13, (xx, yy) => (((xx + yy) & 1) === 0 && hash2(xx, yy, 2) < 0.7 ? PAL.ink[0] : null));
  ditherOverlay(g, x + 1, y + 11, w - 2, h - 13, PAL.night[0], 0.18);
  rect(g, x, y + h - 4, w, 4, PAL.ink[0]); hline(g, x, y + h - 4, w, PAL.metal[2]);
  for (let k = 2; k < w - 2; k += 3) px(g, x + k, y + h - 2, PAL.metal[1]);
  glow(g, x + w / 2, y + h + 8, w * 0.9, 6, '#3aa0ff', 0.12, 4);
}

// ------------------------------------------------------------------ fondo estático
function paintBackground(g) {
  LEDS.length = 0;
  rect(g, 0, 0, W, 144, PAL.ink[0]);
  paint(g, 0, 14, W, 83, (xx, yy) => {
    const t = (yy - 14) / 83;
    let c = ditherPick(xx, yy, [PAL.night[2], PAL.night[1], PAL.night[0], PAL.ink[1]], t);
    if (hash2(xx, yy, 3) < 0.03) c = PAL.ink[1];
    return c;
  });
  gradV(g, 0, 0, W, 14, [PAL.ink[0], PAL.ink[2], PAL.night[0]]);
  hline(g, 0, 14, W, PAL.metal[1]);
  rect(g, 0, 4, W, 6, PAL.metal[1]); hline(g, 0, 4, W, PAL.metal[3]); hline(g, 0, 9, W, PAL.ink[0]);
  for (let k = 3; k < W; k += 7) vline(g, k, 5, 4, PAL.metal[2]);
  const rc = rng(12);
  for (let k = 0; k < 18; k++) {
    const cx = 6 + Math.floor(rc() * (W - 12)), len = 5 + Math.floor(rc() * 12);
    const col = [PAL.gold[3], PAL.blue[3], PAL.red[3], PAL.ink[3], PAL.teal[4]][k % 5];
    vline(g, cx, 10, len, col); vline(g, cx + 1, 10, len - 1, mix(col, '#000000', 0.4));
  }
  for (const lx of [66, 168, 270]) {
    rect(g, lx - 14, 11, 28, 3, PAL.night[5]); hline(g, lx - 14, 11, 28, PAL.night[7]);
    glow(g, lx, 20, 36, 12, '#8ec4ff', 0.10, 5);
  }
  rect(g, 4, 17, 40, 8, PAL.blue[3]); frameRect(g, 4, 17, 40, 8, PAL.blue[1]); microCenter(g, 'SALA FRIA', 24, 19, PAL.paper[7]);
  floorTiles(g, { x: 0, y: 97, w: W, h: 47, vpx: 160, vpy: 30, tile: 22, rowPx: 9, colors: [mix(PAL.night[2], PAL.metal[3], 0.4), PAL.night[2]], grout: PAL.ink[0], far: PAL.ink[0], fade: 0.55 });
  rect(g, 0, 94, W, 3, PAL.ink[0]); hline(g, 0, 94, W, PAL.metal[2]);

  elevator(g);
  for (const c of CABS) rack(g, c);
  cableMess(g);
  // señal de «NO COMER» (ironía con el armario 27), pegada en la puerta del 23
  rect(g, 74, 44, 18, 14, PAL.paper[6]); frameRect(g, 74, 44, 18, 14, PAL.red[3]);
  microCenter(g, 'NO', 83, 46, PAL.red[3]); microCenter(g, 'COMER', 83, 52, PAL.red[3]);
  contador(g);
  // mampara de oficina detrás de la mesa de Paco: tela gris clara, para que su silueta se lea sobre los armarios
  {
    const x = 246, y = 56, w = 52, h = 26;
    rect(g, x - 1, y - 2, w + 2, h + 2, PAL.metal[2]);
    paint(g, x, y, w, h, (xx, yy) => ditherPick(xx, yy, [PAL.metal[4], PAL.metal[5], PAL.metal[6]], 0.75 - (yy - y) / h * 0.5 + (hash2(xx, yy, 7) < 0.1 ? -0.15 : 0)));
    hline(g, x - 1, y - 2, w + 2, PAL.metal[7]);
    // planilla de guardias y un pósit: «VUELVO EN 5 MIN (2009)»
    rect(g, x + 3, y + 3, 12, 15, PAL.paper[7]); for (let k = 0; k < 5; k++) hline(g, x + 4, y + 5 + k * 3, 9, PAL.metal[3]);
    rect(g, x + w - 11, y + 4, 8, 8, '#f0e050'); hline(g, x + w - 10, y + 6, 6, PAL.ink[3]); hline(g, x + w - 10, y + 8, 4, PAL.ink[3]);
  }
  // flexo de Paco: la única luz cálida del sótano, para que se le vea (problema 4)
  glow(g, 272, 68, 26, 22, '#ffd8a0', 0.2, 5);
  floorStuff(g);
  for (const lx of [66, 168, 270]) glow(g, lx, 112, 44, 8, '#8ec4ff', 0.07, 4);
  ditherOverlay(g, 0, 94, W, 4, PAL.ink[0], 0.5);
  vignette(g, W, 144, 0.7);
}

function elevator(g) {
  const x = 4, y = 28, w = 38, h = 70;
  rect(g, x - 1, y - 2, w + 2, h + 2, PAL.metal[1]);
  rect(g, x, y, w, h, PAL.metal[2]); hline(g, x, y, w, PAL.metal[6]); vline(g, x, y, h, PAL.metal[5]);
  rect(g, x + 8, y + 3, 22, 8, PAL.ink[0]); frameRect(g, x + 8, y + 3, 22, 8, PAL.metal[4]);
  micro(g, '-1', x + 12, y + 5, PAL.crt[5]); px(g, x + 24, y + 6, PAL.crt[5]); px(g, x + 23, y + 7, PAL.crt[5]); px(g, x + 25, y + 7, PAL.crt[5]);
  glow(g, x + 19, y + 7, 12, 5, PAL.crt[5], 0.2, 3);
  const dx = x + 4, dy = y + 14, dw = 30, dh = h - 15;
  paint(g, dx, dy, dw, dh, (xx, yy) => {
    const fx = (xx - dx) / dw, base = fx < 0.5 ? fx * 2 : (1 - fx) * 2;
    return ditherPick(xx, yy, [PAL.metal[2], PAL.metal[3], PAL.metal[4], PAL.metal[5]], 0.2 + base * 0.5 + (hash2(xx, yy >> 2, 2) < 0.15 ? 0.12 : 0) - (yy - dy) / dh * 0.12);
  });
  vline(g, dx + 14, dy, dh, PAL.ink[0]); vline(g, dx + 15, dy, dh, PAL.ink[1]);
  vline(g, dx, dy, dh, PAL.ink[1]); vline(g, dx + dw - 1, dy, dh, PAL.ink[1]);
  for (let k = 0; k < dw; k += 4) poly(g, [[dx + k, y + h - 3], [dx + k + 2, y + h - 3], [dx + k + 1, y + h], [dx + k - 1, y + h]], PAL.gold[4]);
  rect(g, x + w + 1, y + 28, 3, 7, PAL.metal[4]); px(g, x + w + 2, y + 30, PAL.gold[6]); px(g, x + w + 2, y + 33, PAL.metal[7]);
  tint(g, [[dx + 2, dy], [dx + 8, dy], [dx + 2, dy + 26], [dx - 1, dy + 26]], '#ffffff', 0.12);
  glow(g, x + w / 2, y + h + 6, 30, 6, '#fff4d8', 0.18, 4);
}

/** Donde estaba el rincón de Diseño: latiguillos que cuelgan de la bandeja del techo y bajan por los armarios 22-24. */
function cableMess(g) {
  const cols = [PAL.gold[3], PAL.blue[4], PAL.red[3], PAL.teal[4], PAL.crt[3], PAL.purple[4]];
  for (let k = 0; k < 14; k++) {
    const x0 = 50 + k * 5, c = cols[k % cols.length], len = 14 + ((k * 7) % 12);
    for (let y = 10; y < 10 + len; y++) px(g, x0 + Math.round(Math.sin((y + k) * 0.35) * 1.2), y, c);
    px(g, x0, 10 + len, PAL.ink[0]);
  }
  // un lazo de cable que se escapa entre el 23 y el 24 hasta el suelo técnico
  for (let y = 30; y < 98; y++) { px(g, 95 + Math.round(Math.sin(y * 0.2) * 1.5), y, PAL.blue[3]); px(g, 94 + Math.round(Math.cos(y * 0.18)), y, PAL.gold[3]); }
  // etiqueta de inventario colgando: «DISEÑO SE FUE. EL CABLE, NO»
  rect(g, 98, 70, 16, 9, PAL.paper[6]); frameRect(g, 98, 70, 16, 9, PAL.metal[3]); micro(g, 'DYP?', 100, 72, PAL.ink[2]);
}

function contador(g) {
  const x = 238, y = 30;
  ditherOverlay(g, x + 2, y + 2, 68, 18, PAL.ink[0], 0.6);
  bevel(g, x, y, 68, 19, PAL.ink[2], PAL.metal[4], PAL.ink[0]);
  microCenter(g, 'TICKETS ABIERTOS', x + 34, y + 2, '#ff7a6a');
  rect(g, x + 11, y + 8, 46, 10, '#1a0406');
}

function floorStuff(g) {
  poly(g, [[148, 118], [172, 118], [176, 128], [144, 128]], PAL.ink[0]);
  line(g, 150, 120, 160, 126, PAL.red[3], 1); line(g, 158, 119, 168, 127, PAL.blue[4], 1); line(g, 165, 119, 156, 127, PAL.gold[3], 1);
  hline(g, 144, 128, 32, PAL.metal[4]); hline(g, 148, 118, 24, PAL.metal[5]);
  glow(g, 160, 124, 24, 6, '#5ab0ff', 0.15, 4);
  ellipse(g, 138, 124, 3, 1.5, PAL.ink[0]); px(g, 137, 123, PAL.metal[5]);
  const pts = [[202, 100], [212, 108], [228, 112], [248, 110], [262, 104]];
  for (let i = 0; i < pts.length - 1; i++) { line(g, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], PAL.ink[0], 2); line(g, pts[i][0], pts[i][1] - 1, pts[i + 1][0], pts[i + 1][1] - 1, PAL.blue[3], 1); }
}

// ------------------------------------------------------------------ objetos
function drawRejilla(g) {
  const x = 96, y = 122, w = 36, h = 14;
  glow(g, x + w / 2, y + h / 2, 30, 9, '#5ab0ff', 0.22, 5);
  poly(g, [[x + 3, y], [x + w - 3, y], [x + w, y + h], [x, y + h]], PAL.ink[0]);
  for (let i = 0; i < 6; i++) {
    const yy = y + 2 + i * 2, ins = Math.round(3 - i * 0.5);
    rect(g, x + ins, yy, w - ins * 2, 1, PAL.metal[5]);
    rect(g, x + ins, yy + 1, w - ins * 2, 1, PAL.metal[2]);
  }
  hline(g, x + 3, y, w - 6, PAL.metal[7]); hline(g, x, y + h, w, PAL.metal[1]);
  vline(g, x + 3, y, h, PAL.metal[6]); vline(g, x + w - 4, y, h, PAL.metal[3]);
  tintR(g, x + 4, y + 2, w - 8, 3, '#8ec4ff', 0.18);
}

function drawArmario27(g, view, t) {
  const { x, w } = CABS.find(c => c.n === 27);
  const y = CAB_Y, h = CAB_H;
  const enc = !!view.flag('ruben_encontrado'), libre = !!view.flag('ruben_libre');
  const a3 = !!view.flag('acto_3_iniciado');
  if (!enc) {
    rect(g, x + 3, y + 44, w - 6, 20, PAL.paper[6]); frameRect(g, x + 3, y + 44, w - 6, 20, PAL.red[3]);
    ellipse(g, x + 8, y + 49, 3, 3, PAL.red[4]); micro(g, 'OB', x + 6, y + 47, PAL.paper[7]);
    micro(g, 'NO', x + 4, y + 53, PAL.red[3]); micro(g, 'ABRIR', x + 4, y + 58, PAL.red[3]);
    hline(g, x + 14, y + 52, 12, PAL.metal[4]); hline(g, x + 14, y + 54, 9, PAL.metal[4]); hline(g, x + 14, y + 56, 11, PAL.metal[4]);
    rect(g, x + w - 6, y + 30, 2, 6, PAL.metal[6]);
  } else {
    rect(g, x + 1, y + 11, w - 2, h - 13, PAL.ink[0]);
    gradV(g, x + 2, y + 12, w - 4, h - 16, [PAL.ink[1], PAL.ink[0]]);
    rect(g, x + 4, y + 36, 14, 9, PAL.ink[2]); rect(g, x + 5, y + 37, 12, 7, PAL.crt[1]);
    for (let k = 0; k < 4; k++) hline(g, x + 6, y + 38 + k * 2, 4 + ((k * 5) % 6), PAL.crt[5]);
    glow(g, x + 12, y + 40, 18, 12, PAL.crt[4], 0.25, 4);
    for (let k = 0; k < 5; k++) vline(g, x + 3 + k * 5, y + 12, 18 + k * 2, [PAL.gold[3], PAL.blue[3], PAL.red[3], PAL.ink[3], PAL.teal[4]][k]);
    rect(g, x + 14, y + 58, 9, 5, PAL.teal[6]); hline(g, x + 14, y + 58, 9, PAL.teal[7]);
    for (let k = 0; k < 9; k++) px(g, x + 3 + ((k * 7) % 22), y + h - 8 + (k % 3), PAL.paper[5]);
    poly(g, [[x + 1, y + 11], [x - 11, y + 6], [x - 11, y + h - 2], [x + 1, y + h - 4]], (xx, yy) => ditherPick(xx, yy, [PAL.ink[0], PAL.metal[1], PAL.metal[2]], (xx - x + 11) / 12));
    line(g, x - 11, y + 6, x - 11, y + h - 2, PAL.metal[4], 1);
    rect(g, x - 9, y + 38, 8, 6, PAL.paper[6]); micro(g, 'NO', x - 8, y + 40, PAL.red[3]);
  }
  if (!libre) {
    const k = Math.floor((t || 0) / (a3 ? 110 : 480)) % 3;
    const col = ['#ff8030', '#ffd040', '#ff5030'][k];
    rect(g, x + w - 5, y + 14, 2, 2, col); glow(g, x + w - 4, y + 15, 5, 4, col, 0.5, 2);
    if (a3 && !enc) for (let s = 0; s < 6; s++) rect(g, x + 3 + s * 3, y + 30 + ((Math.floor((t || 0) / 90) + s * 3) % 5), 2, 1, PAL.crt[5]);
  } else rect(g, x + w - 5, y + 14, 2, 2, PAL.metal[2]);
}

function drawPapel(g, view, t) {
  const x = 175, y = 95;
  const sheets = [[0, 0, 22], [3, 3, 22], [-1, 6, 23], [4, 8, 20]];
  sheets.forEach(([dx, dy, w], i) => {
    const sy = y + dy;
    poly(g, [[x + dx + 2, sy], [x + dx + w + 2, sy], [x + dx + w, sy + 3], [x + dx, sy + 3]], i % 2 ? PAL.paper[6] : PAL.paper[5]);
    hline(g, x + dx + 2, sy, w, PAL.paper[7]);
    hline(g, x + dx, sy + 3, w, PAL.paper[2]);
    for (let k = 0; k < w; k += 3) px(g, x + dx + 3 + k, sy + 1, PAL.ink[3]);
    px(g, x + dx + 1, sy + 1, PAL.metal[4]); px(g, x + dx + w, sy + 1, PAL.metal[4]);
  });
  rect(g, x + 6, y - 3, 10, 4, PAL.paper[6]); for (let k = 0; k < 10; k += 3) px(g, x + 7 + k, y - 2, PAL.ink[3]);
  if (((t || 0) % 960) < 480) px(g, x + 24, y + 6, PAL.paper[7]);
}

function drawVentilador(g, view, t) {
  const x = 214, y = 99;
  shadowEllipse(g, x, y + 1, 11, 2.5, 0.7);
  ellipse(g, x, y - 1, 8, 2.2, (xx, yy, d) => ditherPick(xx, yy, [PAL.metal[5], PAL.metal[3]], d));
  vline(g, x, y - 36, 35, PAL.metal[3]); vline(g, x - 1, y - 36, 35, PAL.metal[5]);
  const cx = x, cy = y - 43, R = 11;
  ellipse(g, cx, cy, R, R, (xx, yy, d) => (d > 0.88 ? PAL.metal[6] : ditherPick(xx, yy, [PAL.ink[1], PAL.night[1]], d)));
  const k = Math.floor((t || 0) / 90) % 2;
  for (let b = 0; b < 3; b++) {
    const a = b * Math.PI * 2 / 3 + k * 0.35;
    line(g, cx, cy, cx + Math.cos(a) * 8, cy + Math.sin(a) * 8, PAL.metal[4], 2);
  }
  ellipse(g, cx, cy, 2, 2, PAL.metal[7]);
  for (let a = 0; a < 6; a++) line(g, cx, cy, cx + Math.cos(a * Math.PI / 3) * R, cy + Math.sin(a * Math.PI / 3) * R, PAL.metal[5], 1);
  poly(g, [[x - 5, y - 33], [x + 2, y - 33], [x + 2, y - 30]], PAL.paper[7]); hline(g, x - 5, y - 33, 7, PAL.paper[4]);
  poly(g, [[x + 2, y - 31], [x + 6, y - 29], [x + 2, y - 28]], PAL.paper[5]);
  px(g, x - 14 - (k * 3), y - 40, PAL.night[6]); px(g, x - 18, y - 38 + k, PAL.night[5]);
}

function drawLibro(g) {
  const x = 232, y = 99;
  shadowEllipse(g, x, y + 1, 9, 2, 0.7);
  ellipse(g, x, y - 1, 7, 2, (xx, yy, d) => ditherPick(xx, yy, [PAL.wood[5], PAL.wood[3]], d));
  vline(g, x - 1, y - 28, 27, PAL.wood[4]); vline(g, x, y - 28, 27, PAL.wood[3]); vline(g, x + 1, y - 28, 27, PAL.wood[2]);
  poly(g, [[x - 8, y - 29], [x + 8, y - 29], [x + 9, y - 34], [x - 9, y - 34]], PAL.wood[4]);
  hline(g, x - 9, y - 34, 18, PAL.wood[6]);
  poly(g, [[x - 7, y - 30], [x + 7, y - 30], [x + 8, y - 34], [x - 8, y - 34]], PAL.paper[6]);
  vline(g, x, y - 34, 4, PAL.paper[3]);
  for (let k = 0; k < 3; k++) { hline(g, x - 6, y - 33 + k, 5, PAL.ink[3]); hline(g, x + 2, y - 33 + k, 4, PAL.ink[3]); }
  px(g, x + 2, y - 31, PAL.red[3]);
  line(g, x + 7, y - 31, x + 10, y - 22, PAL.metal[5], 1); px(g, x + 10, y - 21, PAL.blue[5]);
}

function drawCaja(g) {
  const x = 301, y = 102;
  shadowEllipse(g, x + 8, y, 11, 2, 0.7);
  poly(g, [[x, y - 14], [x + 16, y - 14], [x + 17, y], [x - 1, y]], (xx, yy) => ditherPick(xx, yy, [PAL.wood[5], PAL.wood[4], PAL.wood[3]], Math.min(1, (xx - x) / 18 + (yy - y + 14) / 40)));
  hline(g, x, y - 14, 16, PAL.wood[7]); hline(g, x - 1, y - 1, 18, PAL.wood[2]);
  rect(g, x + 2, y - 10, 13, 6, PAL.paper[6]); micro(g, 'RATAS', x + 3, y - 9, PAL.ink[2]);
  for (let k = 0; k < 4; k++) {
    ellipse(g, x + 3 + k * 4, y - 16 - (k % 2), 2.5, 2, PAL.paper[5]); px(g, x + 2 + k * 4, y - 17 - (k % 2), PAL.paper[7]);
    line(g, x + 3 + k * 4, y - 14, x + 5 + k * 4, y - 12, PAL.paper[3], 1);
  }
  line(g, x + 3, y - 18, x - 3, y - 13, PAL.paper[3], 1);
}

function drawPacoDesk(g, view, t) {
  const x = 240, y = 80, w = 60;
  shadowEllipse(g, x + w / 2, 102, w / 2 + 6, 3, 0.75);
  gradV(g, x, y + 5, w, 22, [PAL.metal[3], PAL.metal[2], PAL.metal[1]]);
  vline(g, x, y + 5, 22, PAL.metal[5]); vline(g, x + w - 1, y + 5, 22, PAL.ink[1]);
  for (let i = 0; i < 3; i++) { bevel(g, x + w - 18, y + 7 + i * 6, 14, 5, PAL.metal[3], PAL.metal[5], PAL.metal[1]); rect(g, x + w - 14, y + 9 + i * 6, 6, 1, PAL.metal[7]); }
  rect(g, x + 4, y + 8, 26, 16, PAL.ink[1]);
  rect(g, x - 2, y, w + 4, 5, PAL.paper[4]); hline(g, x - 2, y, w + 4, PAL.paper[7]); hline(g, x - 2, y + 4, w + 4, PAL.paper[1]);
  // registro de tickets: un archivador gordísimo, TUMBADO a la izquierda (no tapa a Paco)
  const bx = 240, by = y - 8;
  bevel(g, bx, by, 26, 8, PAL.red[3], PAL.red[5], PAL.red[1]);
  rect(g, bx + 2, by + 2, 22, 4, PAL.paper[6]); microCenter(g, 'TICKETS', bx + 13, by + 2, PAL.ink[1]);
  for (let k = 0; k < 4; k++) rect(g, bx + 26, by + 1 + k * 2, 2, 1, PAL.paper[6]);
  // pósits de colores en la mesa
  rect(g, 270, y + 1, 3, 3, '#f0e050'); rect(g, 275, y + 2, 3, 3, '#f0a0c0');
  // CRT en la punta derecha, de lado, mirando a Paco
  const mx = 287, my = y - 15;
  bevel(g, mx, my, 13, 14, PAL.paper[3], PAL.paper[5], PAL.paper[1]);
  rect(g, mx + 2, my + 2, 9, 8, PAL.ink[0]);
  for (let k = 0; k < 3; k++) hline(g, mx + 3, my + 3 + k * 2, 3 + ((k * 3) % 5), PAL.crt[4]);
  if (((t || 0) % 800) < 400) rect(g, mx + 3, my + 9, 2, 1, PAL.crt[6]);
  rect(g, mx + 3, my + 14, 7, 1, PAL.paper[2]);
  glow(g, mx + 6, my + 6, 12, 9, PAL.crt[4], 0.12, 3);
}

function drawContador(g, view) {
  const x = 238, y = 30;
  contador(g);
  const n = Math.max(0, Math.floor(Number(view.flag('paco_tickets')) || 48211));
  const s = String(n);
  const txt = s.length > 3 ? s.slice(0, s.length - 3) + '.' + s.slice(-3) : s;
  const tw = txt.split('').reduce((a, ch) => a + (ch === '.' ? 2 : 6), 0);
  sevenSeg(g, txt, x + 34 - (tw >> 1), y + 9, '#ff3a30', '#3a0a0c');
  glow(g, x + 34, y + 13, 36, 10, '#ff3a30', 0.18, 4);
}

// ------------------------------------------------------------------ animación (LEDs parpadeantes y respiración de luz)
function animateLeds(g, view, t) {
  const T = t || 0;
  for (const [x, y, kind, seed] of LEDS) {
    const per = 260 + (seed % 7) * 260;
    const phase = Math.floor((T + seed * 37) / per);
    const on = hash2(phase, seed, 4) < (kind === 0 ? 0.9 : kind === 1 ? 0.55 : 0.4);
    const col = kind === 0 ? PAL.crt[5] : kind === 1 ? '#ffb038' : kind === 2 ? '#4aa8ff' : '#FF7E6A';
    g.fillStyle = on ? col : '#102018';
    g.fillRect(x, y, 1, 1);
    if (on && kind !== 0) { g.save(); g.globalAlpha = 0.15; g.fillStyle = col; g.fillRect(x - 1, y - 1, 3, 3); g.restore(); }
  }
  const b = 0.03 + 0.02 * Math.sin(T / 900);
  g.save(); g.globalAlpha = b; g.fillStyle = '#5ab0ff'; g.fillRect(0, 100, W, 44); g.restore();
}

// ------------------------------------------------------------------ geometría
const layout = {
  ascensor_cpd: { rect: [4, 26, 38, 72], walkTo: [26, 112], face: 'left' },
  armarios: { rect: [46, 16, 154, 80], walkTo: [84, 108], face: 'up', priority: -1 },
  armario_27: { rect: [170, 16, 32, 80], walkTo: [186, 110], face: 'up', priority: 1, draw: (g, v, t) => drawArmario27(g, v, t) },
  papel_continuo: { rect: [172, 92, 32, 14], walkTo: [190, 111], face: 'up', priority: 2, draw: (g, v, t) => drawPapel(g, v, t) },
  ventilador: { rect: [203, 30, 22, 70], walkTo: [214, 112], face: 'up', draw: (g, v, t) => drawVentilador(g, v, t) },
  libro_visitas: { rect: [223, 62, 18, 38], walkTo: [232, 112], face: 'up', draw: (g) => drawLibro(g) },
  contador_tickets: { rect: [238, 30, 68, 19], walkTo: [272, 112], face: 'up', draw: (g, v) => drawContador(g, v) },
  registro_tickets: {
    rect: [238, 70, 30, 12], walkTo: [250, 112], face: 'up', priority: 1,
    layer: 'sorted', zy: 103, prop: true, draw: (g, v, t) => drawPacoDesk(g, v, t),
  },
  cementerio_ratones: { rect: [299, 86, 19, 18], walkTo: [306, 112], face: 'up', draw: (g) => drawCaja(g) },
  rejilla_cpd: { rect: [94, 120, 40, 18], walkTo: [114, 114], face: 'down', draw: (g) => drawRejilla(g) },
  paco_ticket: { at: [273, 99, 'down'], walkTo: [270, 113], face: 'up' },
  ruben: { at: [186, 101, 'down'], walkTo: [204, 112], face: 'left' },
};

export default {
  room: 'cpd',
  width: W,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [[6, 104], [314, 104], [318, 142], [2, 142]] }],
  entries: { vestibulo: [28, 114, 'right'], ascensor: [28, 114, 'right'] },
  layout,
  draw(g) { paintBackground(g); },
  animate(g, view, t) { animateLeds(g, view, t); },
  overlay(g, view, t) {
    if (((t || 0) % 7000) > 6850) { g.save(); g.globalAlpha = 0.25; g.fillStyle = '#05060c'; g.fillRect(0, 12, W, 6); g.restore(); }
  },
};
