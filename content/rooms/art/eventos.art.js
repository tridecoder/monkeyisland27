// SALA `eventos` — La Sala Polivalente (Eventos, planta 2). Arte y geometría. Adenda §13 (sala propia de Eventos).
// 512×144 con scroll. De izquierda a derecha: puerta abierta al Ecosistema (luz lila de Marketing) · PHOTOCALL con su
// truss, la pared de logos con el hueco «ESPACIO PREMIUM PARA TU CARA», alfombra roja, postes y cordón de terciopelo ·
// aro de luz · flight cases · ESCENARIO (telón negro, pancarta «BIENVENIDOS A» con cinta, cuenta atrás clavada en
// 00:05:00, gong, micro de pie y atril) con las FILAS DE SILLAS delante (las famosas 112, en perspectiva; una con el
// folio «RESERVADO» y otra torcida, de Comercial, que saca de quicio a Pilar) · altavoces · mesa de sonido con el
// cargador de walkies · mesa de acreditaciones (cajas de lanyards, el álbum) · catering con las croquetas bajo campana
// («21:05»). Arriba, de lado a lado, la barra de focos: conos de luz con trama, brillo de lente y dos focos que
// parpadean (el tres del photocall y el del atril). Cruces de cinta americana por todo el suelo.
// Paleta: ciruela oscuro y terciopelo negro, moqueta azul noche, oro de foco, rojo alfombra, cromo de truss.
import { PAL, px, rect, hline, vline, frameRect, line, poly, ellipse, paint, ditherPick, ditherOverlay, noise, glow, gradV,
  hash2, shade, mix, shadowEllipse, bevel, vignette, bayer } from '../../../engine/draw.js';
import { cap, dropShadow, fabric, miniText } from './lib-catacumba-util.js';

const W = 512;
const FL = 98;                                        // línea de suelo
const LIL = ['#8c88b4', '#a29cc6', '#b8b2d6', '#cdc8e4', '#e0dcf0'];       // la luz lila del Ecosistema, al otro lado
const PLUM = ['#140c1c', '#1c1228', '#261834', '#311f42', '#3e2852', '#4c3262'];
const VELVET = [PAL.ink[0], PAL.ink[1], PAL.ink[2], '#2a2238', '#352c46'];
const CARPET = ['#0e1226', '#151a34', '#1c2342', '#252e52', '#303b64'];
const WARM = '#fff0c0', MAGENTA = '#ff8ad8', ICE = '#a8ccff';
const TAPE = '#a8a8a4', TAPE_HI = '#cfcfc8';
const CHAIR_NEAR = [PAL.red[1], PAL.red[2], PAL.red[3], PAL.red[4]];
const CHAIR_FAR = [PAL.red[0], '#561818', PAL.red[2], '#83261f'];
const CHAIR = CHAIR_NEAR;

// --------------------------------------------------------------------------------------------- geometría de las sillas
const AISLE_X = 275;                                  // pasillo central, delante del escenario
const ROWS = [{ y: 105, s: 0.74 }, { y: 112, s: 0.81 }, { y: 120, s: 0.9 }, { y: 129, s: 1 }];
const PER_SIDE = 7;
/** centro x de la silla i (0 = junto al pasillo) del lado side (-1 izquierda, +1 derecha) en la fila r */
function chairX(r, side, i) {
  const { s } = ROWS[r];
  return Math.round(AISLE_X + side * (7 * s + (i + 0.5) * 12 * s));
}
const RES = { r: 3, side: -1, i: 0 };                 // la silla del «RESERVADO»: primera fila, junto al pasillo
const RES_X = chairX(RES.r, RES.side, RES.i);

const layout = {
  eventos_a_ecosistema: { rect: [2, 26, 34, 72], walkTo: [20, 116], face: 'left' },
  photocall: { rect: [44, 20, 103, 78], walkTo: [94, 116], face: 'up' },
  aro_luz: { rect: [150, 32, 24, 68], walkTo: [160, 112], face: 'up' },
  flight_cases: { rect: [175, 58, 28, 40], walkTo: [182, 104], face: 'up' },
  focos: { rect: [36, 0, 444, 22], walkTo: [276, 136], face: 'up' },
  cuenta_atras: { rect: [246, 17, 58, 19], walkTo: [276, 136], face: 'up', priority: 1 },
  pancarta_evento: { rect: [240, 38, 82, 15], walkTo: [280, 136], face: 'up' },
  gong: { rect: [204, 42, 34, 44], walkTo: [186, 106], face: 'right' },
  atril: { rect: [320, 50, 22, 36], walkTo: [330, 136], face: 'up' },
  sillas_evento: { poly: [[206, 92], [344, 92], [367, 130], [183, 130]], walkTo: [276, 136], face: 'up' },
  silla_reservado: { rect: [RES_X - 10, 108, 20, 22], walkTo: [RES_X, 136], face: 'up', priority: 1 },
  silla_torcida: { rect: [367, 108, 20, 22], walkTo: [380, 137], face: 'up', priority: 1, draw: (g) => drawSillaTorcida(g) },
  mesa_sonido: { rect: [392, 62, 42, 36], walkTo: [412, 108], face: 'up' },
  mesa_acreditaciones: { rect: [436, 76, 42, 22], walkTo: [456, 108], face: 'up' },
  cajas_lanyards: { rect: [438, 56, 22, 20], walkTo: [449, 108], face: 'up', priority: 1 },
  album_eventos_hotspot: { rect: [461, 68, 15, 8], walkTo: [466, 108], face: 'up', priority: 2, draw: (g) => drawAlbum(g, 462, 69) },
  catering_croquetas: { rect: [480, 58, 30, 40], walkTo: [494, 110], face: 'up' },
  marcas_cinta: { rect: [154, 127, 26, 11], walkTo: [167, 138], face: 'down' },
  // Pilar Escaleta, en la alfombra roja, delante de su photocall (la pared blanca detrás la recorta)
  pilar_escaleta: { at: [128, 124, 'left'], walkTo: [104, 127], face: 'right' },
};

// --------------------------------------------------------------------------------------------- utilidades de luz
/** Cono de luz con trama ordenada: de la lente (x0, y0) al suelo/pared (x1, y1); w0 → w1 de ancho. Más denso arriba. */
function cone(g, x0, y0, x1, y1, w0, w1, c, dens = 0.5, sparse = 1) {
  const h = y1 - y0;
  for (let y = y0; y <= y1; y++) {
    const t = (y - y0) / h, cx = x0 + (x1 - x0) * t, hw = (w0 + (w1 - w0) * t) / 2;
    for (let x = Math.floor(cx - hw); x <= Math.ceil(cx + hw); x++) {
      const e = Math.abs(x - cx) / hw;
      if (e > 1) continue;
      const d = dens * (1 - 0.5 * t) * (1 - e * e * 0.75) * sparse;
      if (bayer(x, y) < d) px(g, x, y, c);
    }
  }
}
/** Velo suave (aditivo) en forma de cono: bandas translúcidas «screen», el brillo VGA sin degradado continuo. */
function veil(g, x0, y0, x1, y1, w0, w1, c, a = 0.18) {
  g.save();
  g.globalCompositeOperation = 'screen';
  for (let b = 0; b < 3; b++) {
    const k = 1 - b / 3;
    g.globalAlpha = a / 3;
    poly(g, [[x0 - w0 / 2 * k, y0], [x0 + w0 / 2 * k, y0], [x1 + w1 / 2 * k, y1], [x1 - w1 / 2 * k, y1]], c);
  }
  g.restore();
}
/** Charco de luz en el suelo (elipse tramada + velo). */
function pool(g, cx, cy, rx, ry, c, dens = 0.45) {
  paint(g, cx - rx, cy - ry, rx * 2 + 1, ry * 2 + 1, (x, y) => {
    const dx = (x - cx) / rx, dy = (y - cy) / ry, d = dx * dx + dy * dy;
    return d <= 1 && bayer(x, y) < dens * (1 - d) ? c : null;
  });
  glow(g, cx, cy, rx, ry, c, 0.16, 4);
}
/** Foco PAR colgado de la barra: horquilla, cuerpo y lente (apagada si !on). dir = -1 / 0 / 1 inclinación. */
function parCan(g, x, y, { dir = 0, on = true, gel = WARM } = {}) {
  vline(g, x - 4, y - 2, 6, PAL.metal[4]); vline(g, x + 4, y - 2, 6, PAL.metal[4]); hline(g, x - 4, y - 2, 9, PAL.metal[5]);
  rect(g, x - 2, y - 4, 5, 2, PAL.metal[2]);                                         // abrazadera
  const bx = x - 3 + dir, by = y;
  rect(g, bx, by, 7, 7, PAL.metal[1]); vline(g, bx, by, 7, PAL.metal[3]); hline(g, bx, by, 7, PAL.metal[3]);
  px(g, bx + 5, by + 1, PAL.metal[5]);
  rect(g, bx - 1 + dir, by + 7, 9, 2, PAL.metal[2]);                                  // aro de la lente
  if (on) {
    hline(g, bx + dir, by + 8, 7, gel); hline(g, bx + 1 + dir, by + 9, 5, PAL.white);
    glow(g, bx + 3 + dir, by + 9, 7, 4, gel, 0.45, 3);
  } else { hline(g, bx + dir, by + 8, 7, PAL.metal[1]); hline(g, bx + 1 + dir, by + 9, 5, PAL.ink[3]); }
}

// --------------------------------------------------------------------------------------------- fondo
function drawCeiling(g) {
  paint(g, 0, 0, W, 17, (x, y) => ditherPick(x, y, [PAL.ink[0], PAL.ink[1], PLUM[1]], y / 17 * 0.9));
  // rejilla del techo técnico
  for (let x = 6; x < W; x += 22) vline(g, x, 0, 16, PAL.ink[2]);
  // barra de focos principal: truss triangular de lado a lado
  const y0 = 4, y1 = 11;
  hline(g, 0, y0, W, PAL.metal[5]); hline(g, 0, y0 + 1, W, PAL.metal[3]);
  hline(g, 0, y1, W, PAL.metal[4]); hline(g, 0, y1 + 1, W, PAL.metal[2]);
  for (let x = 0; x < W; x += 8) { line(g, x, y0 + 1, x + 4, y1, PAL.metal[3]); line(g, x + 4, y1, x + 8, y0 + 1, PAL.metal[3]); }
  for (let x = 2; x < W; x += 8) px(g, x, y0, PAL.metal[7]);
  // cadenas de cuelgue
  for (const x of [40, 160, 290, 420]) for (let y = 0; y < y0; y += 2) px(g, x, y, PAL.metal[4]);
  // cables con cinta, colgando en catenaria
  for (const [a, b] of [[60, 130], [226, 320], [392, 474]]) {
    for (let x = a; x <= b; x++) { const t = (x - a) / (b - a); px(g, x, y1 + 3 + Math.round(Math.sin(t * Math.PI) * 3), PAL.ink[3]); }
    rect(g, a + ((b - a) >> 1) - 1, y1 + 5, 3, 2, TAPE);
  }
}

function drawWall(g) {
  paint(g, 0, 17, W, FL - 17, (x, y) => {
    const panel = (x % 32) < 1 ? -0.12 : (x % 32) === 1 ? 0.08 : 0;
    return ditherPick(x, y, PLUM, 0.62 - (y - 17) / (FL - 17) * 0.42 + panel + (hash2(x >> 2, y >> 3, 9) - 0.5) * 0.06);
  });
  noise(g, 0, 17, W, FL - 17, PLUM[0], 0.03, 3);
  // zócalo negro
  rect(g, 0, FL - 6, W, 6, PAL.ink[1]); hline(g, 0, FL - 6, W, PLUM[3]); hline(g, 0, FL - 1, W, PAL.ink[0]);
  ditherOverlay(g, 0, 17, W, 4, PAL.shadow, 0.5);
}

function drawFloor(g) {
  paint(g, 0, FL, W, 144 - FL, (x, y) => {
    const t = (y - FL) / (144 - FL);
    const v = hash2(x, y, 21);
    return v < 0.05 ? CARPET[0] : v > 0.95 ? CARPET[3] : ditherPick(x, y, CARPET, 0.25 + t * 0.45 + (hash2(x >> 3, y >> 1, 4) - 0.5) * 0.08);
  });
  // líneas del pasillo, que fugan hacia el escenario
  for (const xb of [AISLE_X - 9, AISLE_X + 9]) line(g, xb + (xb < AISLE_X ? 1 : -1) * 2, FL + 2, xb + (xb < AISLE_X ? -6 : 6), 143, CARPET[3]);
  ditherOverlay(g, 0, FL, W, 5, PAL.shadow, 0.55);
}

/** Cinta americana en el suelo: cruces y escuadras (las «marcas» de Pilar). */
function tapeX(g, x, y, s = 3) { line(g, x - s, y - 1, x + s, y + 1, TAPE); line(g, x - s, y + 1, x + s, y - 1, TAPE); px(g, x, y, TAPE_HI); }
function tapeL(g, x, y, w, c = TAPE) { hline(g, x, y, w, c); vline(g, x, y - 2, 3, c); }
function drawTapeMarks(g) {
  // marcas de las patas del photocall, de los postes y del gong
  for (const [x, y] of [[40, 101], [150, 101], [60, 108], [132, 108], [52, 124], [140, 124], [186, 100], [214, 100]]) tapeX(g, x, y, 2);
  // las «marcas_cinta» del hotspot: una retícula de cruces y una con nombre
  for (const [x, y] of [[158, 130], [166, 133], [174, 130], [162, 136], [178, 135]]) tapeX(g, x, y, 3);
  rect(g, 168, 136, 9, 3, PAL.paper[6]); hline(g, 169, 137, 7, PAL.ink[2]);           // «BRUNO» en una tira
  // escuadras en la moqueta: zona de paso, foco, sillas
  tapeL(g, 196, 140, 10); tapeL(g, 346, 140, 10); tapeL(g, 388, 104, 8); tapeL(g, 22, 136, 8);
  for (let x = 196; x < 360; x += 9) hline(g, x, 141, 4, TAPE);                     // línea discontinua de la zona de paso
  tapeX(g, 240, 99, 2); tapeX(g, 306, 99, 2);
}

function drawDoor(g) {
  const x = 3, y = 26, w = 33, h = FL - 26;
  rect(g, x - 1, y - 3, w + 2, h + 3, PAL.ink[0]);
  // el otro lado: el Ecosistema, lila y luminoso
  paint(g, x + 2, y, w - 4, h, (xx, yy) => ditherPick(xx, yy, LIL, 0.9 - (yy - y) / h * 0.6));
  rect(g, x + 2, y + h - 12, w - 4, 12, '#6a3c92');                                  // su moqueta morada
  for (let i = 0; i < 4; i++) hline(g, x + 2, y + h - 11 + i * 3, w - 4, '#8250aa');
  rect(g, x + 10, y + 18, 12, 16, PAL.paper[6]); frameRect(g, x + 10, y + 18, 12, 16, PAL.metal[3]);   // la pizarra, a lo lejos
  hline(g, x + 12, y + 22, 8, '#d83c4a'); hline(g, x + 12, y + 25, 6, '#2c5cc8'); hline(g, x + 12, y + 28, 7, '#2c9a4c');
  // marco y hojas abiertas hacia dentro
  rect(g, x, y - 2, w, 3, PAL.metal[3]); vline(g, x, y, h, PAL.metal[4]); vline(g, x + w - 1, y, h, PAL.metal[2]);
  poly(g, [[x + 2, y + 1], [x + 7, y + 4], [x + 7, y + h - 3], [x + 2, y + h]], PAL.ink[2]);
  poly(g, [[x + w - 3, y + 1], [x + w - 8, y + 4], [x + w - 8, y + h - 3], [x + w - 3, y + h]], PAL.ink[2]);
  vline(g, x + 5, y + 30, 8, PAL.metal[5]); vline(g, x + w - 6, y + 30, 8, PAL.metal[5]);
  // cartel encima
  rect(g, x - 1, 17, w + 2, 8, PAL.ink[0]); frameRect(g, x - 1, 17, w + 2, 8, PLUM[4]);
  miniText(g, 'MKT', x + w / 2 + 2, 19, LIL[3], { align: 'center' });
  poly(g, [[x + 4, 21], [x + 8, 18], [x + 8, 24]], LIL[3]);
  // la luz lila que entra
  glow(g, x + w / 2, FL + 8, 30, 10, LIL[2], 0.22, 4);
  poly(g, [[x + 3, FL], [x + w - 3, FL], [x + w + 22, 143], [x - 2, 143]], (xx, yy) => (bayer(xx, yy) < 0.18 * (1 - (yy - FL) / 46) ? LIL[1] : null));
}

function drawPhotocall(g) {
  // truss de dos torres y travesaño
  const towers = [44, 141];
  shadowEllipse(g, 95, 99, 54, 3, 0.7);
  for (const tx of towers) {
    rect(g, tx, 20, 6, FL - 20, PAL.metal[1]);
    vline(g, tx, 20, FL - 20, PAL.metal[6]); vline(g, tx + 5, 20, FL - 20, PAL.metal[4]);
    for (let y = 22; y < FL - 2; y += 6) { line(g, tx + 1, y, tx + 4, y + 3, PAL.metal[4]); line(g, tx + 4, y + 3, tx + 1, y + 6, PAL.metal[4]); }
    rect(g, tx - 2, FL - 2, 10, 3, PAL.metal[3]); hline(g, tx - 2, FL - 2, 10, PAL.metal[5]);
  }
  rect(g, 44, 20, 103, 6, PAL.metal[1]); hline(g, 44, 20, 103, PAL.metal[6]); hline(g, 44, 25, 103, PAL.metal[3]);
  for (let x = 46; x < 144; x += 6) { line(g, x, 21, x + 3, 24, PAL.metal[4]); line(g, x + 3, 24, x + 6, 21, PAL.metal[4]); }
  // la pared de logos (lona blanca, tensada con bridas)
  const fx = 50, fy = 26, fw = 91, fh = FL - 28;
  paint(g, fx, fy, fw, fh, (xx, yy) => ditherPick(xx, yy, ['#c8c2dc', '#dcd6ee', '#ece8f8', '#f8f6fd'], 0.85 - (yy - fy) / fh * 0.35 - Math.abs(xx - 95) / 46 * 0.25));
  for (let y = fy + 4; y < fy + fh; y += 10) { px(g, fx - 1, y, PAL.ink[2]); px(g, fx + fw, y, PAL.ink[2]); }
  const cs = [PAL.dusk[4], PAL.teal[4], PAL.gold[3], PAL.blue[4], PAL.leaf[4], PAL.purple[4], PAL.red[4], PAL.ink[3]];
  const cw = 9, ch = 9, cols = 10, rows = 7;
  const hole = (i, j) => i >= 2 && i <= 7 && j >= 1 && j <= 5;
  let n = 0;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    if (hole(i, j)) continue;
    const cx = fx + 1 + i * cw + 4, cy = fy + 3 + j * ch + 3, c = cs[(i * 3 + j * 5 + n++) % cs.length], k = (i + j * 2) % 6;
    if (k === 0) { ellipse(g, cx, cy, 2, 2, c); px(g, cx - 1, cy - 1, shade(c, 0.35)); }
    else if (k === 1) { rect(g, cx - 2, cy - 2, 5, 4, c); hline(g, cx - 2, cy - 2, 5, shade(c, 0.3)); }
    else if (k === 2) poly(g, [[cx - 3, cy + 2], [cx + 3, cy + 2], [cx, cy - 3]], c);
    else if (k === 3) poly(g, [[cx, cy - 3], [cx + 3, cy], [cx, cy + 3], [cx - 3, cy]], c);
    else if (k === 4) { rect(g, cx - 3, cy - 1, 3, 3, c); rect(g, cx + 1, cy - 2, 2, 4, shade(c, 0.15)); }
    else { ellipse(g, cx, cy, 1, 1, c); px(g, cx - 2, cy, c); px(g, cx + 2, cy, c); px(g, cx, cy - 2, c); px(g, cx, cy + 2, c); }
    hline(g, cx - 3, cy + 4, 7, '#b8b2cc');                                        // «nombre de la marca»
  }
  // el hueco: ESPACIO PREMIUM PARA TU CARA (marco discontinuo)
  const hx = fx + 1 + 2 * cw, hy = fy + 3 + ch, hw = 6 * cw, hh = 5 * ch;
  paint(g, hx, hy, hw, hh, (xx, yy) => ditherPick(xx, yy, ['#e4e0f2', '#f2f0fa', '#fbfaff'], 0.8 - (yy - hy) / hh * 0.4));
  for (let i = 0; i < hw; i += 4) { hline(g, hx + i, hy, 2, PAL.dusk[3]); hline(g, hx + i, hy + hh - 1, 2, PAL.dusk[3]); }
  for (let i = 0; i < hh; i += 4) { vline(g, hx, hy + i, 2, PAL.dusk[3]); vline(g, hx + hw - 1, hy + i, 2, PAL.dusk[3]); }
  const mx = hx + hw / 2;
  cap(g, 'ESPACIO', mx, hy + 6, PAL.dusk[1], { align: 'center' });
  cap(g, 'PREMIUM', mx, hy + 15, PAL.dusk[1], { align: 'center' });
  cap(g, 'PARA TU', mx, hy + 24, PAL.dusk[1], { align: 'center' });
  cap(g, 'CARA', mx, hy + 33, PAL.red[3], { align: 'center' });
  ditherOverlay(g, fx + fw, fy + 2, 3, fh, PAL.shadow, 0.45);
}

function drawRedCarpet(g) {
  const L0 = 60, R0 = 130, L1 = 38, R1 = 152;
  poly(g, [[L0, FL], [R0, FL], [R1, 143], [L1, 143]], (x, y) => ditherPick(x, y, [PAL.red[1], PAL.red[2], PAL.red[3], PAL.red[4]],
    0.3 + (y - FL) / 46 * 0.25 + (hash2(x >> 1, y, 2) - 0.5) * 0.25));
  line(g, L0, FL, L1, 143, PAL.gold[4]); line(g, R0, FL, R1, 143, PAL.gold[4]);
  line(g, L0 + 1, FL, L1 + 1, 143, PAL.gold[2]); line(g, R0 - 1, FL, R1 - 1, 143, PAL.gold[2]);
  for (let yy = 104; yy < 143; yy += 8) {
    const t = (yy - FL) / 45, xl = Math.round(L0 + (L1 - L0) * t), xr = Math.round(R0 + (R1 - R0) * t);
    hline(g, xl + 3, yy, xr - xl - 6, PAL.red[1]);
  }
  for (const [sx, sy] of [[84, 112], [104, 120], [74, 132], [118, 138]]) { px(g, sx, sy, PAL.gold[6]); px(g, sx - 1, sy, PAL.gold[4]); px(g, sx + 1, sy, PAL.gold[4]); px(g, sx, sy - 1, PAL.gold[4]); px(g, sx, sy + 1, PAL.gold[4]); }
}

/** Postes dorados con cordón de terciopelo granate a los lados de la alfombra (mitad de atrás). */
function drawStanchions(g) {
  const posts = [[[60, 108], [52, 124]], [[132, 108], [140, 124]]];
  for (const pair of posts) {
    for (const [sx, sy] of pair) {
      shadowEllipse(g, sx + 1, sy, 4, 1, 0.6);
      ellipse(g, sx + 1, sy - 1, 3, 1, PAL.gold[3]);
      rect(g, sx, sy - 14, 2, 13, PAL.gold[4]); vline(g, sx, sy - 14, 13, PAL.gold[6]);
      ellipse(g, sx + 1, sy - 15, 2, 2, PAL.gold[5]); px(g, sx, sy - 16, PAL.white);
    }
    const [[ax, ay], [bx, by]] = pair;
    const n = Math.abs(by - ay) + Math.abs(bx - ax);
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = Math.round(ax + 1 + (bx - ax) * t), y = Math.round(ay - 12 + (by - ay) * t + Math.sin(t * Math.PI) * 4);
      px(g, x, y, PAL.red[3]); px(g, x, y + 1, PAL.red[1]);
    }
  }
}

function drawRingLight(g) {
  const cx = 162, cy = 46;
  ellipse(g, cx, cy, 11, 11, PAL.metal[2]);
  ellipse(g, cx, cy, 10, 10, PAL.paper[7]);
  ellipse(g, cx, cy, 7, 7, PLUM[2]);
  rect(g, cx - 3, cy - 4, 6, 9, PAL.ink[1]); rect(g, cx - 2, cy - 3, 4, 7, PAL.blue[6]);   // el móvil en el centro (apagado)
  px(g, cx - 8, cy - 7, PAL.white); px(g, cx - 7, cy - 8, PAL.white);
  vline(g, cx, cy + 11, 40, PAL.metal[3]); vline(g, cx + 1, cy + 11, 40, PAL.metal[5]);
  line(g, cx, cy + 40, cx - 8, FL + 1, PAL.metal[3]); line(g, cx + 1, cy + 40, cx + 9, FL + 1, PAL.metal[3]); line(g, cx, cy + 40, cx, FL + 2, PAL.metal[5]);
  shadowEllipse(g, cx, FL + 1, 10, 2, 0.6);
  rect(g, cx - 1, cy + 26, 3, 4, PAL.metal[2]);
  glow(g, cx, cy, 16, 16, PAL.paper[6], 0.06, 3);                                    // apagado: «solo para gente importante»
}

function flightCase(g, x, y, w, h, txt) {
  rect(g, x, y, w, h, PAL.ink[2]); frameRect(g, x, y, w, h, PAL.metal[4]);
  hline(g, x, y, w, PAL.metal[6]); hline(g, x, y + (h >> 1), w, PAL.metal[3]);
  for (const [cx, cy] of [[x, y], [x + w - 3, y], [x, y + h - 3], [x + w - 3, y + h - 3]]) { rect(g, cx, cy, 3, 3, PAL.metal[5]); px(g, cx, cy, PAL.metal[7]); }
  rect(g, x + (w >> 1) - 3, y + 2, 6, 2, PAL.metal[3]);                               // asa
  if (txt) miniText(g, txt, x + (w >> 1), y + (h >> 1) + 2, PAL.paper[4], { align: 'center' });
}
function drawFlightCases(g) {
  shadowEllipse(g, 189, FL, 16, 2, 0.7);
  flightCase(g, 175, 78, 28, 20, 'EVNT');
  flightCase(g, 177, 62, 24, 16, '5MIN');
  rect(g, 180, 59, 8, 3, PAL.ink[2]); ellipse(g, 184, 59, 4, 2, TAPE); ellipse(g, 184, 59, 2, 1, PAL.ink[3]);   // rollo de cinta encima
  rect(g, 192, 69, 7, 2, TAPE);                                                       // tira pegada en una esquina
}

function drawStage(g) {
  const x0 = 204, x1 = 346, top = 82;
  // telón negro de terciopelo, con piernas laterales
  fabric(g, x0, 16, x1 - x0, top - 16, VELVET, { fold: 7 });
  fabric(g, x0 - 4, 16, 8, top - 14, [PAL.ink[0], PAL.ink[1], PLUM[2]], { fold: 4 });
  fabric(g, x1 - 4, 16, 8, top - 14, [PAL.ink[0], PAL.ink[1], PLUM[2]], { fold: 4, phase: 2 });
  rect(g, x0 - 6, 15, x1 - x0 + 12, 3, PAL.ink[0]); hline(g, x0 - 6, 17, x1 - x0 + 12, PLUM[2]);
  // tarima
  rect(g, x0 - 2, top, x1 - x0 + 4, 4, PAL.wood[2]); hline(g, x0 - 2, top, x1 - x0 + 4, PAL.wood[4]);
  for (let x = x0; x < x1; x += 14) vline(g, x, top + 1, 3, PAL.wood[1]);
  rect(g, x0 - 2, top + 4, x1 - x0 + 4, FL - top - 4, PAL.ink[1]);
  fabric(g, x0 - 2, top + 5, x1 - x0 + 4, FL - top - 5, [PAL.ink[0], PAL.ink[1], PAL.ink[2]], { fold: 5 });   // faldón
  hline(g, x0 - 2, top + 4, x1 - x0 + 4, PAL.gold[3]);                                  // cinta de borde (fosforito)
  for (let x = x0; x < x1; x += 6) px(g, x, top + 4, PAL.gold[5]);
  // escalerita a la derecha
  for (let i = 0; i < 3; i++) { rect(g, x1 + 2 + i * 2, top + 4 + i * 4, 8 - i * 2, 4, PAL.ink[2]); hline(g, x1 + 2 + i * 2, top + 4 + i * 4, 8 - i * 2, PAL.metal[3]); }
  // monitores de suelo (cuñas)
  for (const mx of [232, 300]) { poly(g, [[mx, top + 1], [mx + 12, top + 1], [mx + 12, top - 4], [mx + 3, top - 6]], PAL.ink[2]); hline(g, mx + 3, top - 5, 8, PAL.metal[3]); rect(g, mx + 5, top - 3, 5, 3, PAL.metal[1]); }
  // micro de pie, en el centro
  const sx = 268;
  line(g, sx, top - 1, sx - 4, top + 1, PAL.metal[4]); line(g, sx, top - 1, sx + 4, top + 1, PAL.metal[4]);
  vline(g, sx, 58, top - 58, PAL.metal[4]); line(g, sx, 58, sx + 5, 54, PAL.metal[5]);
  rect(g, sx + 4, 52, 3, 3, PAL.ink[3]); px(g, sx + 5, 52, PAL.metal[6]);
  ditherOverlay(g, x0 - 2, FL - 3, x1 - x0 + 4, 3, PAL.shadow, 0.5);
}

function drawBanner(g) {
  const x = 240, y = 38, w = 82, h = 15;
  for (const ax of [x + 4, x + w - 5]) vline(g, ax, 34, 4, PAL.metal[4]);
  rect(g, x, y, w, h, PAL.paper[6]); frameRect(g, x, y, w, h, PAL.paper[3]);
  hline(g, x, y, w, PAL.white); hline(g, x, y + h - 1, w, PAL.paper[2]);
  for (let i = 0; i < w; i += 9) px(g, x + i, y + 1, PAL.paper[3]);                  // ojales
  cap(g, 'BIENVENIDOS A', x + 3, y + 5, PAL.red[2]);
  // la cinta americana que tapa el nombre del evento (dos capas)
  rect(g, x + 69, y + 2, 12, 11, TAPE); rect(g, x + 71, y + 4, 9, 8, '#9a9a96');
  hline(g, x + 69, y + 2, 12, TAPE_HI); hline(g, x + 71, y + 4, 9, TAPE_HI);
  for (let i = 0; i < 12; i += 3) px(g, x + 69 + i, y + 12, '#8a8a86');
  ditherOverlay(g, x + 2, y + h, w, 2, PAL.shadow, 0.5);
}

/** Dígito de siete segmentos (5×9). */
const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
function seg7(g, x, y, d, on, off) {
  const s = SEG[d] || '';
  const S = { a: [x + 1, y, 3, 1], b: [x + 4, y + 1, 1, 3], c: [x + 4, y + 5, 1, 3], d: [x + 1, y + 8, 3, 1], e: [x, y + 5, 1, 3], f: [x, y + 1, 1, 3], g: [x + 1, y + 4, 3, 1] };
  for (const [k, r] of Object.entries(S)) rect(g, r[0], r[1], r[2], r[3], s.includes(k) ? on : off);
}
export function drawCountdown(g, text, colon = true) {
  const x = 247, y = 18, w = 56, h = 17;
  rect(g, x - 1, y - 1, w + 2, h + 2, PAL.metal[3]); rect(g, x, y, w, h, PAL.ink[0]);
  hline(g, x - 1, y - 1, w + 2, PAL.metal[5]);
  let cx = x + 4;
  for (const ch of text) {
    if (ch === ':') { if (colon) { rect(g, cx, y + 6, 1, 1, PAL.red[6]); rect(g, cx, y + 10, 1, 1, PAL.red[6]); } cx += 3; continue; }
    seg7(g, cx, y + 4, ch, '#ff3a28', '#2a0c0c');
    cx += 7;
  }
  vline(g, x + 10, y - 3, 2, PAL.metal[4]); vline(g, x + w - 11, y - 3, 2, PAL.metal[4]);
}

function drawGong(g) {
  const cx = 220, cy = 63;
  rect(g, 206, 44, 3, 39, PAL.wood[2]); vline(g, 206, 44, 39, PAL.wood[4]);
  rect(g, 232, 44, 3, 39, PAL.wood[2]); vline(g, 232, 44, 39, PAL.wood[4]);
  rect(g, 204, 42, 33, 3, PAL.wood[3]); hline(g, 204, 42, 33, PAL.wood[5]);
  rect(g, 203, 81, 8, 2, PAL.wood[1]); rect(g, 230, 81, 8, 2, PAL.wood[1]);
  line(g, cx - 6, 45, cx - 6, 50, PAL.paper[5]); line(g, cx + 6, 45, cx + 6, 50, PAL.paper[5]);
  ellipse(g, cx, cy, 13, 13, PAL.gold[1]);
  ellipse(g, cx, cy, 12, 12, (x, y, d) => ditherPick(x, y, [PAL.gold[2], PAL.gold[3], PAL.gold[4], PAL.gold[5], PAL.gold[6]],
    Math.max(0, Math.min(1, 0.95 - d * 0.7 - (x - cx) * 0.02 - (y - cy) * 0.025))));
  ellipse(g, cx, cy, 5, 5, (x, y, d) => ditherPick(x, y, [PAL.gold[3], PAL.gold[5], PAL.gold[4]], d));
  for (const rr of [8, 10]) for (let a = 0; a < 40; a++) px(g, Math.round(cx + Math.cos(a / 40 * 6.283) * rr), Math.round(cy + Math.sin(a / 40 * 6.283) * rr), PAL.gold[2 + (a & 1)]);
  px(g, cx - 7, cy - 8, PAL.white); px(g, cx - 6, cy - 9, PAL.white); px(g, cx - 8, cy - 6, PAL.white);
  line(g, 234, 80, 239, 74, PAL.wood[5]); ellipse(g, 240, 73, 2, 2, PAL.paper[6]);   // el mazo, apoyado
  rect(g, 211, 83, 18, 1, TAPE);                                                      // su marca de cinta
}

function drawLectern(g) {
  const x = 322, y = 60;
  poly(g, [[x, y], [x + 18, y], [x + 16, 84], [x + 2, 84]], PAL.wood[3]);
  poly(g, [[x + 1, y + 1], [x + 9, y + 1], [x + 8, 83], [x + 3, 83]], PAL.wood[4]);
  hline(g, x, y, 18, PAL.wood[6]);
  rect(g, x - 1, y - 3, 20, 3, PAL.wood[5]); hline(g, x - 1, y - 3, 20, PAL.wood[7]);
  rect(g, x + 4, y - 5, 10, 2, PAL.paper[6]);                                         // el discurso, una hoja
  ellipse(g, x + 9, y + 9, 4, 4, PAL.gold[3]); miniText(g, 'EC', x + 9, y + 7, PAL.ink[1], { align: 'center' });   // escudo de la casa
  line(g, x + 14, y - 3, x + 12, y - 9, PAL.metal[4]); line(g, x + 12, y - 9, x + 9, y - 11, PAL.metal[4]);       // flexo del micro
  rect(g, x + 7, y - 13, 3, 3, PAL.ink[3]); px(g, x + 8, y - 13, PAL.metal[6]);
}

function drawSpeakers(g) {
  for (const sx of [348, 368]) {
    const x = sx, y = 34;
    line(g, x + 6, y + 30, x, FL, PAL.metal[3]); line(g, x + 6, y + 30, x + 12, FL, PAL.metal[3]); vline(g, x + 6, y + 30, FL - y - 30, PAL.metal[4]);
    rect(g, x, y, 13, 30, PAL.ink[1]); frameRect(g, x, y, 13, 30, PAL.ink[3]); hline(g, x, y, 13, PAL.metal[3]);
    ellipse(g, x + 6, y + 9, 4, 4, PAL.ink[0]); ellipse(g, x + 6, y + 9, 2, 2, PAL.metal[2]);
    ellipse(g, x + 6, y + 21, 5, 5, PAL.ink[0]); ellipse(g, x + 6, y + 21, 2, 2, PAL.metal[2]);
    px(g, x + 3, y + 6, PAL.metal[5]); px(g, x + 2, y + 18, PAL.metal[5]);
    shadowEllipse(g, x + 6, FL + 1, 8, 1, 0.6);
  }
}

/** Una silla de evento vista por detrás (respaldo tapizado granate, patas cromadas). */
function chair(g, cx, fy, s, lit = 0, dim = 0) {
  const CHAIR = dim ? CHAIR_FAR : CHAIR_NEAR;                                           // las del fondo, en penumbra
  const w = Math.max(7, Math.round(10 * s)), sy = fy - Math.round(7 * s), bh = Math.round(9 * s), x = Math.round(cx - w / 2);
  shadowEllipse(g, cx, fy, Math.round(w / 2) + 1, 1, 0.55);
  vline(g, x + 1, sy, fy - sy, PAL.metal[5]); vline(g, x + w - 2, sy, fy - sy, PAL.metal[4]);           // patas traseras
  vline(g, x + 2, sy + 1, fy - sy - 2, PAL.metal[2]); vline(g, x + w - 3, sy + 1, fy - sy - 2, PAL.metal[2]);   // delanteras
  rect(g, x, sy - 1, w, 2, PAL.ink[2]);                                                // canto del asiento
  const top = sy - bh;
  rect(g, x, top, w, bh, CHAIR[1]);
  rect(g, x + 1, top + 1, w - 2, bh - 2, CHAIR[2 + (lit > 0.5 ? 1 : 0)]);
  hline(g, x + 1, top, w - 2, CHAIR[3]); px(g, x, top, CHAIR[0]); px(g, x + w - 1, top, CHAIR[0]);
  hline(g, x + 2, top + 1, w - 5, lit > 0.5 ? PAL.red[5] : CHAIR[3]);
  vline(g, x + w - 1, top + 1, bh - 1, CHAIR[0]);
  hline(g, x, sy - 2, w, PAL.metal[3]);                                                // perfil cromado
}
function drawChairs(g) {
  for (let r = 0; r < ROWS.length; r++) {
    const { y, s } = ROWS[r];
    for (const side of [-1, 1]) for (let i = PER_SIDE - 1; i >= 0; i--) {
      const cx = chairX(r, side, i);
      const lit = Math.abs(cx - AISLE_X) < 40 && r < 2 ? 1 : 0;
      chair(g, cx, y, s, lit && r > 0, r === 0 ? 1 : 0);
      if (r === RES.r && side === RES.side && i === RES.i) reservado(g, cx, y, s);
    }
  }
}
/** El folio «RESERVADO», pegado con cinta al respaldo. */
function reservado(g, cx, fy, s) {
  const top = fy - Math.round(7 * s) - Math.round(9 * s);
  const x = cx - 10, y = top - 3;
  rect(g, x + 1, y + 1, 21, 13, PAL.shadow);
  rect(g, x, y, 21, 13, PAL.paper[7]); frameRect(g, x, y, 21, 13, PAL.paper[3]);
  miniText(g, 'RESER', x + 11, y + 1, PAL.red[3], { align: 'center' });
  miniText(g, 'VADO', x + 11, y + 7, PAL.red[3], { align: 'center' });
  rect(g, x + 7, y - 1, 7, 2, TAPE);
}
/** La silla 113: de Comercial, torcida, fuera de su cruz, sacando una pata al pasillo (hotspot `silla_torcida`). */
function drawSillaTorcida(g) {
  const cx = 377, fy = 128;
  shadowEllipse(g, cx + 1, fy, 8, 2, 0.6);
  // patas (girada unos 30°: se le ven las cuatro)
  line(g, cx - 6, fy - 7, cx - 7, fy, PAL.metal[5]); line(g, cx + 5, fy - 8, cx + 7, fy - 1, PAL.metal[5]);
  line(g, cx - 2, fy - 6, cx - 2, fy + 1, PAL.metal[3]); line(g, cx + 2, fy - 9, cx + 3, fy - 3, PAL.metal[3]);
  // asiento en escorzo
  poly(g, [[cx - 7, fy - 8], [cx + 1, fy - 6], [cx + 7, fy - 9], [cx - 1, fy - 11]], CHAIR[2]);
  line(g, cx - 7, fy - 8, cx + 1, fy - 6, PAL.metal[4]); line(g, cx + 1, fy - 6, cx + 7, fy - 9, PAL.metal[3]);
  // respaldo, de medio lado, con la funda naranja de Comercial
  poly(g, [[cx - 1, fy - 22], [cx + 7, fy - 19], [cx + 7, fy - 9], [cx - 1, fy - 11]], CHAIR[1]);
  poly(g, [[cx, fy - 21], [cx + 6, fy - 18], [cx + 6, fy - 10], [cx, fy - 12]], '#d0602e');
  line(g, cx, fy - 21, cx + 6, fy - 18, PAL.dusk[6]); vline(g, cx - 1, fy - 22, 11, PAL.metal[4]);
  rect(g, cx + 2, fy - 16, 3, 2, PAL.paper[7]); px(g, cx + 3, fy - 16, '#ff7a52');                       // pegatina
  // su cruz de cinta, vacía, un palmo más allá
  line(g, cx - 15, fy - 1, cx - 11, fy + 1, TAPE); line(g, cx - 15, fy + 1, cx - 11, fy - 1, TAPE);
}

function drawMixingDesk(g) {
  const x = 392, y = 74;
  shadowEllipse(g, x + 21, FL + 1, 24, 2, 0.7);
  // pie de flight case
  rect(g, x + 2, y + 10, 38, FL - y - 10, PAL.ink[2]); frameRect(g, x + 2, y + 10, 38, FL - y - 10, PAL.metal[3]);
  for (const [cx, cy] of [[x + 2, y + 10], [x + 37, y + 10], [x + 2, FL - 3], [x + 37, FL - 3]]) rect(g, cx, cy, 3, 3, PAL.metal[5]);
  miniText(g, 'FOH', x + 21, y + 16, PAL.paper[3], { align: 'center' });
  // la mesa, inclinada hacia el técnico
  poly(g, [[x + 3, y], [x + 39, y], [x + 42, y + 10], [x, y + 10]], PAL.metal[2]);
  hline(g, x + 3, y, 36, PAL.metal[5]); hline(g, x, y + 10, 42, PAL.metal[1]);
  for (let i = 0; i < 12; i++) {
    const fx = x + 4 + i * 3;
    vline(g, fx, y + 3, 6, PAL.ink[0]);
    rect(g, fx - 1, y + 3 + ((i * 7) % 5), 3, 2, i === 5 ? PAL.red[5] : PAL.metal[6]);   // faders
    px(g, fx, y + 1, [PAL.gold[5], PAL.teal[5], PAL.red[5], PAL.paper[6]][i & 3]);     // botones
  }
  // flexo de mesa (luz cálida)
  line(g, x + 38, y - 1, x + 36, y - 9, PAL.metal[4]); line(g, x + 36, y - 9, x + 31, y - 10, PAL.metal[4]);
  rect(g, x + 29, y - 11, 4, 2, PAL.gold[4]);
  glow(g, x + 30, y - 2, 10, 5, PAL.gold[5], 0.25, 3);
  // cargador de walkies: cuatro walkies con antena
  const wx = x + 2, wy = y - 12;
  rect(g, wx, wy + 8, 24, 4, PAL.ink[2]); hline(g, wx, wy + 8, 24, PAL.metal[3]);
  for (let i = 0; i < 4; i++) {
    const bx = wx + 2 + i * 6;
    rect(g, bx, wy + 1, 4, 8, PAL.ink[0]); frameRect(g, bx, wy + 1, 4, 8, PAL.ink[3]); vline(g, bx + 1, wy - 4, 5, PAL.ink[3]);
    px(g, bx + 1, wy + 3, PAL.metal[4]);
  }
  ditherOverlay(g, x + 40, y + 10, 2, FL - y - 10, PAL.shadow, 0.5);
}

function drawAccreditation(g) {
  const x = 436, y = 76;
  shadowEllipse(g, x + 21, FL + 1, 24, 2, 0.7);
  // mantel negro hasta el suelo, con el cartel impreso
  rect(g, x, y, 42, 3, PAL.ink[3]); hline(g, x, y, 42, PLUM[4]);
  fabric(g, x, y + 3, 42, FL - y - 3, [PAL.ink[0], PAL.ink[1], PAL.ink[2]], { fold: 6 });
  rect(g, x + 5, y + 6, 32, 9, '#f2eef8'); frameRect(g, x + 5, y + 6, 32, 9, PAL.dusk[3]);
  miniText(g, 'ACREDIT', x + 21, y + 8, PAL.dusk[2], { align: 'center' });
  // la lista de acreditados, pegada con cinta al canto
  rect(g, x + 33, y - 3, 7, 9, PAL.paper[7]); for (let i = 0; i < 3; i++) hline(g, x + 34, y - 1 + i * 2, 5, PAL.ink[3]);
  rect(g, x + 34, y - 4, 5, 1, TAPE);
  // las cajas de lanyards (cartón) con cintas de colores colgando
  for (const [bx, by, bw, bh] of [[440, 66, 18, 10], [442, 58, 14, 8]]) {
    bevel(g, bx, by, bw, bh, PAL.wood[5], PAL.wood[6], PAL.wood[3]);
    hline(g, bx, by + 3, bw, PAL.wood[3]); rect(g, bx + (bw >> 1) - 3, by + 4, 6, 3, PAL.paper[6]); hline(g, bx + (bw >> 1) - 2, by + 5, 4, PAL.red[4]);
  }
  const cs = [PAL.dusk[4], PAL.teal[5], PAL.gold[4], PAL.blue[4], PAL.leaf[5], '#ffcc00'];
  for (let i = 0; i < 6; i++) { vline(g, 441 + i * 3, 74, 4 + (i % 3) * 2, cs[i]); px(g, 441 + i * 3, 78 + (i % 3) * 2, PAL.paper[6]); }
  // roll-up de Eventos detrás: «EN 5 MIN»
  rect(g, 463, 74, 15, 2, PAL.metal[4]);
  rect(g, 464, 28, 13, 46, '#f2f6ee'); frameRect(g, 464, 28, 13, 46, PAL.metal[3]);
  rect(g, 465, 29, 11, 9, '#3a7a2a'); miniText(g, 'EV', 470, 31, '#e0ffd0', { align: 'center' });
  ellipse(g, 470, 47, 5, 5, '#a8f07a'); ellipse(g, 470, 47, 4, 4, '#3a7a2a'); miniText(g, '5', 471, 45, '#e0ffd0', { align: 'center' });
  miniText(g, 'MIN', 470, 56, '#3a7a2a', { align: 'center' });
  for (let i = 0; i < 3; i++) hline(g, 466, 63 + i * 3, 9, PAL.metal[5]);
}
function drawAlbum(g, x, y) {
  poly(g, [[x + 1, y], [x + 12, y], [x + 13, y + 6], [x, y + 6]], PAL.paper[6]);
  hline(g, x + 1, y, 11, PAL.white); hline(g, x, y + 6, 14, PAL.paper[2]);
  rect(g, x + 2, y + 1, 8, 4, PAL.blue[5]);
  rect(g, x + 4, y + 1, 3, 3, PAL.skin[5]); px(g, x + 5, y + 2, PAL.ink[0]);
  rect(g, x + 8, y + 2, 2, 3, PAL.paper[7]); px(g, x + 8, y + 2, PAL.ink[1]);
  hline(g, x + 1, y + 5, 11, PAL.gold[4]);
}

function drawCatering(g, view) {
  const x = 481, y = 76;
  shadowEllipse(g, x + 15, FL + 1, 18, 2, 0.7);
  // mantel blanco
  rect(g, x, y, 30, 3, PAL.paper[7]); hline(g, x, y, 30, PAL.white);
  fabric(g, x, y + 3, 30, FL - y - 3, [PAL.paper[3], PAL.paper[4], PAL.paper[5], PAL.paper[6]], { fold: 5 });
  // campana plateada
  const cx = x + 14, cy = y - 1;
  ellipse(g, cx, cy, 11, 1, PAL.metal[3]);
  for (let yy = 0; yy < 10; yy++) {
    const hw = Math.round(Math.sqrt(1 - (yy / 10) ** 2) * 10);
    for (let xx = -hw; xx <= hw; xx++) px(g, cx + xx, cy - 1 - yy, ditherPick(cx + xx, cy - yy, [PAL.metal[3], PAL.metal[5], PAL.metal[6], PAL.metal[7]], 0.85 - (xx + 10) / 20 * 0.6 + (yy / 10) * 0.1));
  }
  ellipse(g, cx, cy - 11, 2, 1, PAL.metal[6]); px(g, cx - 4, cy - 8, PAL.white); px(g, cx - 5, cy - 6, PAL.white);
  // cartel doblado «21:05»
  poly(g, [[cx - 12, y + 2], [cx + 12, y + 2], [cx + 11, y - 6], [cx - 11, y - 6]], PAL.paper[6]); hline(g, cx - 11, y - 6, 23, PAL.white);
  hline(g, cx - 12, y + 2, 25, PAL.paper[3]);
  miniText(g, '21:05', cx + 1, y - 4, PAL.red[3], { align: 'center' });
  // servilletas y vasos
  rect(g, x + 1, y - 3, 5, 3, PAL.paper[6]); for (const gx of [x + 25, x + 28]) { rect(g, gx, y - 5, 2, 5, ICE); px(g, gx, y - 5, PAL.white); }
  void view;
}

/** Focos del escenario: se pintan ANTES que la pancarta, la cuenta atrás, el gong y el atril (que van delante). */
function drawStageLights(g) {
  parCan(g, 222, 13, { dir: 0, gel: WARM });
  parCan(g, 366, 13, { dir: -2, gel: MAGENTA });
  parCan(g, 331, 13, { dir: 0, on: false });
  cone(g, 222, 23, 221, 82, 5, 32, WARM, 0.34); veil(g, 222, 23, 221, 82, 5, 34, WARM, 0.22);
  pool(g, 221, 82, 20, 3, WARM, 0.45);
  cone(g, 363, 23, 280, 82, 5, 38, MAGENTA, 0.32); veil(g, 363, 23, 280, 82, 5, 40, MAGENTA, 0.22);
  pool(g, 280, 82, 22, 3, MAGENTA, 0.45);
  glow(g, 272, 70, 70, 26, MAGENTA, 0.07, 4);
}
/** Cartel luminoso de la sala, sobre la mesa de sonido. */
function drawRoomSign(g) {
  const x = 384, y = 24, w = 70, h = 20;
  glow(g, x + w / 2, y + h / 2, 46, 16, '#a8f07a', 0.1, 4);
  rect(g, x, y, w, h, PAL.ink[0]); frameRect(g, x, y, w, h, PAL.metal[3]); hline(g, x, y, w, PAL.metal[5]);
  cap(g, 'SALA', x + w / 2, y + 3, '#a8f07a', { align: 'center' });
  cap(g, 'POLIVALENTE', x + w / 2, y + 11, '#a8f07a', { align: 'center' });
  vline(g, x + 8, 14, y - 14, PAL.metal[4]); vline(g, x + w - 9, 14, y - 14, PAL.metal[4]);
}
/** Bruma de sala: el aire se ve donde hay foco (velo muy suave bajo la barra). */
function drawHaze(g) {
  for (const [x, c] of [[76, WARM], [118, WARM], [222, WARM], [331, ICE], [363, MAGENTA], [420, WARM], [490, WARM]]) glow(g, x, 30, 26, 14, c, 0.05, 3);
}
function drawLights(g) {
  // focos fijos (los que no parpadean): photocall izquierdo, escenario (cálido y magenta), sala y catering
  parCan(g, 72, 13, { dir: 1, gel: WARM });
  parCan(g, 420, 13, { dir: 0, gel: WARM });
  parCan(g, 490, 13, { dir: 0, gel: WARM });
  // los dos que parpadean se pintan en animate (foco 3 del photocall y el del atril); aquí, su cuerpo apagado
  parCan(g, 122, 13, { dir: -1, on: false });
  // conos con trama + velo
  cone(g, 76, 23, 86, 110, 5, 40, WARM, 0.2);  veil(g, 76, 23, 86, 112, 5, 44, WARM, 0.22);
  pool(g, 88, 112, 24, 6, WARM, 0.35);
  cone(g, 420, 23, 414, 74, 4, 26, WARM, 0.18); veil(g, 420, 23, 414, 74, 4, 28, WARM, 0.12);
  cone(g, 490, 23, 495, 64, 4, 18, WARM, 0.3); veil(g, 490, 23, 495, 64, 4, 22, WARM, 0.2);
  glow(g, 95, 60, 50, 38, WARM, 0.07, 4);
}

export default {
  room: 'eventos',
  width: W,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  // el bloque de sillas no se pisa: se rodea por la izquierda (photocall), por delante (pasillo de cinta) y por la derecha
  walkboxes: [{ id: 'suelo', poly: [[6, 102], [194, 102], [176, 131], [370, 131], [388, 102], [506, 102], [510, 142], [2, 142]] }],
  entries: { ecosistema: [30, 118, 'right'] },
  layout,
  draw(g, view) {
    drawCeiling(g);
    drawWall(g);
    drawFloor(g);
    drawDoor(g);
    drawPhotocall(g);
    drawRedCarpet(g);
    drawStanchions(g);
    drawRingLight(g);
    drawFlightCases(g);
    drawStage(g);
    drawStageLights(g);
    drawBanner(g);
    drawCountdown(g, '00:05:00');
    drawGong(g);
    drawLectern(g);
    drawSpeakers(g);
    drawLights(g);
    drawTapeMarks(g);
    drawMixingDesk(g);
    drawAccreditation(g);
    drawCatering(g, view);
    glow(g, 495, 68, 14, 8, WARM, 0.3, 4);                                          // las croquetas, bajo su foco
    drawRoomSign(g);
    drawHaze(g);
    drawChairs(g);
    vignette(g, W, 144, 0.5);
  },
  animate(g, view, t) {
    // foco 3 del photocall: parpadea «de ambiente» desde la cena de Navidad
    const on3 = (Math.sin(t / 97) + Math.sin(t / 31 + 1.3)) > -1.45;
    parCan(g, 122, 13, { dir: -1, on: on3 });
    if (on3) { cone(g, 118, 23, 104, 112, 5, 40, WARM, 0.15, 1); veil(g, 118, 23, 104, 112, 5, 44, WARM, 0.16); glow(g, 104, 112, 22, 5, WARM, 0.14, 3); }
    // el del atril: se muere y resucita (frío)
    const k = (t % 5200) / 5200;
    const on2 = k < 0.62 || (k > 0.66 && k < 0.7) || (k > 0.74 && k < 0.76) || k > 0.86;
    parCan(g, 331, 13, { dir: 0, on: on2, gel: ICE });
    if (on2) { cone(g, 331, 23, 331, 82, 5, 24, ICE, 0.24, 1); veil(g, 331, 23, 331, 82, 5, 26, ICE, 0.18); glow(g, 331, 70, 14, 14, ICE, 0.1, 3); }
    // cuenta atrás: los dos puntos parpadean; los números, no
    if ((t % 1000) < 500) { rect(g, 265, 24, 1, 1, '#2a0c0c'); rect(g, 265, 28, 1, 1, '#2a0c0c'); rect(g, 282, 24, 1, 1, '#2a0c0c'); rect(g, 282, 28, 1, 1, '#2a0c0c'); }
    // vúmetros de la mesa y pilotos del cargador de walkies
    for (let i = 0; i < 4; i++) {
      const lv = Math.floor((Math.sin(t / 120 + i * 1.7) + 1) * 2);
      for (let j = 0; j < 4; j++) px(g, 425 + i, 76 + 3 - j, j <= lv ? (j > 2 ? PAL.red[5] : j > 1 ? PAL.gold[5] : PAL.crt[5]) : PAL.ink[0]);
    }
    for (let i = 0; i < 4; i++) px(g, 397 + i * 6, 67, ((t / 400 + i) | 0) % 3 ? PAL.crt[5] : PAL.red[5]);
  },
};
