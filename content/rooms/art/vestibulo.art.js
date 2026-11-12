// SALA `vestibulo` — ARTE Y GEOMETRÍA. Biblia §3.1 + adenda §3.1 / §8bis.
// Vestíbulo nocturno de elContable.es: puertas de cristal a la calle (farola naranja y lluvia animada), organigrama
// con la casilla VACANTE, cuadro de llaves del garaje, torno de cristal con LED, logo de letras metálicas,
// mostrador de Celestino (con el Ibex en pantalla), ascensor de acero con botonera y el ficus de plástico.
import {
  PAL, mix, rect, hline, vline, frameRect, line, px, poly, ellipse, paint, gradV, gradH, bevel, noise, hash2, rng,
  ditherOverlay, ditherPick, glow, vignette, shadowEllipse, ceiling, wallClock, plant, floorTiles, label, measureText,
} from '../../../engine/draw.js';
import { micro, microCenter, microShadow } from './lib-vestibulo-micro.js';

const W = 320;

// ------------------------------------------------------------------ utilidades
function tintPoly(g, pts, color, alpha) {
  g.save(); g.globalAlpha = alpha; poly(g, pts, color); g.restore();
}
function tintRect(g, x, y, w, h, color, alpha) {
  g.save(); g.globalAlpha = alpha; rect(g, x, y, w, h, color); g.restore();
}
/** Haz de luz poligonal con bandas suaves (cada banda más pequeña y más intensa). */
function band(g, pts, color, alpha, n = 4) {
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  for (let i = 0; i < n; i++) {
    const k = 1 - i / n * 0.6;
    tintPoly(g, pts.map(p => [cx + (p[0] - cx) * k, cy + (p[1] - cy) * k]), color, alpha / n);
  }
}
function bayer2(x, y) { return ((x * 7 + y * 13) % 16) / 16; }

// ------------------------------------------------------------------ puertas de cristal a la calle (x 4..44)
function streetDoors(g, dawn) {
  const x = 4, y = 26, w = 40, h = 72;
  rect(g, x - 2, y - 3, w + 4, h + 3, PAL.metal[1]);
  rect(g, x - 1, y - 2, w + 2, h + 2, PAL.metal[3]);
  vline(g, x - 1, y - 2, h + 2, PAL.metal[5]); hline(g, x - 1, y - 2, w + 2, PAL.metal[5]);
  const ix = x + 2, iy = y + 1, iw = w - 4, ih = h - 1;
  // calle: noche con la farola naranja; asfalto mojado abajo
  paint(g, ix, iy, iw, ih, (xx, yy) => {
    const t = (yy - iy) / ih;
    if (dawn && t < 0.7) return ditherPick(xx, yy, [PAL.night[3], PAL.purple[4], PAL.dusk[4], PAL.dusk[6], PAL.dusk[7]], Math.pow(t / 0.7, 1.1));
    if (t < 0.7) return ditherPick(xx, yy, [PAL.night[0], PAL.night[1], PAL.night[2], PAL.purple[2], PAL.dusk[2]], Math.pow(t / 0.7, 1.6));
    const u = (t - 0.7) / 0.3;
    const lamp = Math.max(0, 1 - Math.abs(xx - (ix + 25)) / 16);
    if (dawn) return ditherPick(xx, yy, [PAL.night[2], PAL.purple[4], PAL.dusk[4], PAL.dusk[6]], 0.25 + u * 0.3 + lamp * 0.2);
    return ditherPick(xx, yy, [PAL.ink[2], PAL.night[1], PAL.dusk[2], PAL.dusk[4]], 0.15 + u * 0.2 + lamp * 0.55 * (1 - u * 0.4));
  });
  // edificio de enfrente (siluetas con ventanas)
  rect(g, ix, iy + 14, 14, 36, PAL.purple[1]); rect(g, ix + 14, iy + 22, 10, 28, PAL.purple[0]); rect(g, ix + 24, iy + 10, 12, 40, PAL.purple[1]);
  const r = rng(77);
  for (let k = 0; k < 14; k++) {
    const wx = ix + 1 + Math.floor(r() * 33), wy = iy + 16 + Math.floor(r() * 30);
    if (hash2(wx, wy, 5) < (dawn ? 0.15 : 0.6)) rect(g, wx, wy, 2, 2, r() < 0.7 ? PAL.gold[4] : PAL.teal[6]);
  }
  // farola
  const lx = ix + 25;
  vline(g, lx, iy + 8, 42, PAL.ink[0]); hline(g, lx - 3, iy + 8, 4, PAL.ink[0]);
  rect(g, lx - 4, iy + 9, 3, 2, dawn ? PAL.metal[4] : PAL.gold[6]);
  if (!dawn) { glow(g, lx - 3, iy + 10, 16, 14, '#ff9a3c', 0.5, 6); glow(g, lx - 3, iy + 10, 5, 4, '#ffd890', 0.7, 3); }
  else glow(g, ix + 30, iy + 36, 18, 12, '#fff0b0', 0.45, 5);
  // reflejos de la farola en el asfalto mojado
  for (let k = 0; k < 8; k++) hline(g, lx - 5 + (k % 3), iy + 52 + k * 2, 5 - (k >> 2), dawn ? PAL.dusk[7] : (k % 2 ? PAL.dusk[6] : PAL.dusk[5]));
  // marco de hojas, travesaño central, barras y tiradores
  rect(g, ix + (iw >> 1) - 1, iy, 2, ih, PAL.metal[2]); vline(g, ix + (iw >> 1) - 1, iy, ih, PAL.metal[5]);
  rect(g, ix, iy + 38, iw, 2, PAL.metal[3]); hline(g, ix, iy + 38, iw, PAL.metal[6]);
  rect(g, ix, iy, iw, 2, PAL.metal[2]);
  rect(g, ix, iy + ih - 5, iw, 5, PAL.metal[2]); hline(g, ix, iy + ih - 5, iw, PAL.metal[5]);
  for (const hx of [ix + (iw >> 1) - 4, ix + (iw >> 1) + 3]) { rect(g, hx, iy + 22, 2, 14, PAL.metal[6]); vline(g, hx, iy + 22, 14, PAL.metal[7]); vline(g, hx + 1, iy + 22, 14, PAL.metal[3]); }
  // brillo de cristal
  tintPoly(g, [[ix + 3, iy + 2], [ix + 9, iy + 2], [ix + 1, iy + 34], [ix - 2, iy + 34]], '#ffffff', 0.10);
  tintPoly(g, [[ix + 22, iy + 2], [ix + 26, iy + 2], [ix + 18, iy + 34], [ix + 15, iy + 34]], '#ffffff', 0.07);
  // gotas estáticas y regueros en el cristal
  const rr = rng(5);
  for (let k = 0; k < (dawn ? 3 : 26); k++) {
    const dx = ix + 1 + Math.floor(rr() * (iw - 2)), dy = iy + 2 + Math.floor(rr() * (ih - 10));
    px(g, dx, dy, '#9fc4e6'); if (k % 3 === 0) { px(g, dx, dy + 1, '#7ea8d0'); px(g, dx, dy + 2, '#5a7fb0'); }
  }
  // vinilo del horario
  microShadow(g, 'CIERRE', ix + 2, iy + 6, PAL.paper[7], PAL.night[0]);
  microShadow(g, '21:00', ix + 2, iy + 13, PAL.paper[7], PAL.night[0]);
  // cenefa de latón en el umbral
  rect(g, x - 2, 98, w + 4, 2, PAL.gold[2]); hline(g, x - 2, 98, w + 4, PAL.gold[5]);
}

// ------------------------------------------------------------------ fondo estático
function paintBackground(g, dawn) {
  rect(g, 0, 0, W, 144, PAL.ink[1]);
  // techo
  gradV(g, 0, 0, W, 14, [PAL.ink[0], PAL.ink[2], PAL.metal[1]]);
  hline(g, 0, 14, W, PAL.metal[3]); hline(g, 0, 15, W, PAL.ink[0]);
  // pared verde institucional de noche, con pilastras
  paint(g, 0, 16, W, 66, (xx, yy) => {
    const t = (yy - 16) / 66;
    let c = ditherPick(xx, yy, [PAL.green[4], PAL.green[3], PAL.green[2], PAL.green[1]], t);
    if (hash2(xx, yy, 3) < 0.035) c = PAL.green[1];
    return c;
  });
  for (const px0 of [104, 202]) { vline(g, px0, 16, 64, PAL.green[1]); vline(g, px0 + 1, 16, 64, PAL.green[5]); }
  ceiling(g, 0, 0, W, 15, { spacing: 100, offset: 62, lampW: 40 });
  // zócalo de mármol
  paint(g, 0, 80, W, 16, (xx, yy) => {
    const t = (yy - 80) / 16;
    const vein = Math.sin(xx * 0.31 + Math.sin(yy * 0.7 + xx * 0.05) * 2.2 + (xx >> 5) * 1.7);
    let c = ditherPick(xx, yy, [PAL.metal[4], PAL.metal[3], PAL.metal[2]], t * 0.9);
    if (vein > 0.93) c = PAL.metal[5];
    return c;
  });
  hline(g, 0, 80, W, PAL.metal[6]); hline(g, 0, 81, W, PAL.metal[4]); hline(g, 0, 82, W, PAL.metal[1]);
  for (let px0 = 0; px0 < W; px0 += 40) vline(g, px0, 83, 10, PAL.metal[1]);
  rect(g, 0, 93, W, 4, PAL.metal[1]); hline(g, 0, 93, W, PAL.metal[4]); hline(g, 0, 96, W, PAL.ink[0]);
  // suelo de mármol gastado
  floorTiles(g, { x: 0, y: 97, w: W, h: 47, vpx: 160, vpy: 24, tile: 26, rowPx: 9, colors: [mix(PAL.metal[3], PAL.metal[4], 0.55), PAL.metal[3]], colors3: PAL.metal[2], grout: PAL.metal[1], far: PAL.ink[0], fade: 0.5 });
  // franja desgastada justo en la línea del torno (el mármol pulido por años de «no consta»)
  glow(g, 160, 109, 52, 8, PAL.metal[7], 0.22, 6);
  glow(g, 160, 109, 30, 4, PAL.metal[7], 0.18, 4);
  for (let k = 0; k < 40; k++) px(g, 118 + ((k * 37) % 84), 104 + ((k * 11) % 10), PAL.metal[5]);

  streetDoors(g, dawn);

  // luz de farola derramada sobre el suelo y la pared izquierda
  band(g, [[4, 97], [44, 97], [96, 143], [-6, 143]], dawn ? '#ffe0a8' : '#ff9a3c', dawn ? 0.26 : 0.22, 5);
  band(g, [[44, 40], [92, 40], [92, 96], [44, 96]], dawn ? '#ffe0a8' : '#ff9a3c', 0.06, 3);
  // charco de lluvia + huellas mojadas
  ellipse(g, 32, 118, 19, 4, (xx, yy, d) => ditherPick(xx, yy, [PAL.night[1], PAL.night[2], PAL.dusk[3], PAL.dusk[5]], 0.35 + (1 - d) * 0.45 - (yy - 118) * 0.04));
  ellipse(g, 32, 118, 19, 4, (xx, yy, d) => (d > 0.88 ? PAL.metal[2] : null));
  for (let k = 0; k < 7; k++) {
    const fx = 48 + k * 9 + (k % 2) * 2, fy = 109 + (k % 2) * 3;
    rect(g, fx, fy, 3, 1, PAL.ink[2]); rect(g, fx + 1, fy + 1, 2, 1, PAL.ink[3]);
  }
  // felpudo del umbral
  poly(g, [[7, 100], [43, 100], [49, 111], [1, 111]], (xx, yy) => (hash2(xx, yy, 6) < 0.3 ? PAL.ink[0] : PAL.ink[2]));
  line(g, 7, 100, 1, 111, PAL.red[2]); line(g, 43, 100, 49, 111, PAL.red[2]); hline(g, 1, 111, 48, PAL.red[2]);
  microCenter(g, 'BIENVENIDO', 25, 104, PAL.paper[4]);
  paraguero(g, 52, 101);
  sueloMojado(g, 88, 101);

  organigrama(g);
  cuadroPlazas(g);
  logo(g);
  wallClock(g, 195, 36, 7, 20 + 59 / 60);
  altavoz(g);
  drawCounter(g);
  elevator(g);
  // directorio de plantas junto al ascensor
  rect(g, 299, 30, 18, 24, PAL.ink[1]); frameRect(g, 299, 30, 18, 24, PAL.metal[4]);
  ['2 DIR', '1 RED', '0 HALL', '-1 SIS'].forEach((tx, i) => micro(g, tx, 301, 33 + i * 5, i === 2 ? PAL.gold[6] : PAL.paper[5]));

  // luz de los fluorescentes en la pared y el suelo
  for (const cx of [82, 182, 282]) {
    glow(g, cx, 40, 38, 26, '#dff0e4', 0.13, 5);
    glow(g, cx, 112, 40, 9, '#dff0e4', 0.08, 5);
  }
  ditherOverlay(g, 0, 93, W, 4, PAL.ink[0], 0.45);
  vignette(g, W, 144, 0.55);
}

function paraguero(g, x, y) {
  shadowEllipse(g, x, y, 8, 2, 0.7);
  const ucol = [[PAL.red[4], PAL.red[2]], [PAL.ink[3], PAL.ink[1]], [PAL.blue[4], PAL.blue[2]]];
  for (let i = 0; i < 3; i++) {
    const ux = x - 5 + i * 4, tilt = (i - 1) * 2;
    line(g, ux, y - 8, ux + tilt, y - 26, ucol[i][1], 3);
    line(g, ux + 1, y - 8, ux + tilt + 1, y - 26, ucol[i][0], 1);
    line(g, ux + tilt, y - 27, ux + tilt + 3, y - 30, PAL.wood[5], 1);
  }
  poly(g, [[x - 7, y - 12], [x + 7, y - 12], [x + 6, y], [x - 6, y]], (xx, yy) => ditherPick(xx, yy, [PAL.metal[5], PAL.metal[4], PAL.metal[2]], (xx - x + 7) / 14));
  hline(g, x - 7, y - 12, 14, PAL.metal[7]); hline(g, x - 6, y - 1, 12, PAL.ink[1]);
  for (let k = 0; k < 4; k++) px(g, x - 4 + k * 3, y - 7, PAL.metal[2]);
  px(g, x + 9, y - 1, PAL.night[5]); px(g, x + 10, y, PAL.night[5]); px(g, x - 9, y, PAL.night[4]);
}
function sueloMojado(g, x, y) {
  shadowEllipse(g, x, y, 7, 2, 0.7);
  poly(g, [[x - 5, y - 18], [x + 5, y - 18], [x + 8, y], [x - 8, y]], (xx, yy) => ditherPick(xx, yy, [PAL.gold[5], PAL.gold[4], PAL.gold[3]], (xx - x + 8) / 16));
  poly(g, [[x - 4, y - 16], [x + 4, y - 16], [x + 6, y - 2], [x - 6, y - 2]], PAL.gold[5]);
  hline(g, x - 5, y - 18, 10, PAL.gold[6]);
  rect(g, x - 1, y - 13, 2, 2, PAL.ink[1]); line(g, x, y - 11, x + 2, y - 7, PAL.ink[1]); line(g, x + 2, y - 7, x - 1, y - 4, PAL.ink[1]);
  line(g, x, y - 10, x - 3, y - 8, PAL.ink[1]); line(g, x + 2, y - 7, x + 4, y - 4, PAL.ink[1]);
  hline(g, x - 4, y - 3, 9, PAL.night[3]);
}

// ------------------------------------------------------------------ organigrama
function organigrama(g) {
  const x = 47, y = 18, w = 56, h = 68;
  ditherOverlay(g, x + 2, y + 3, w, h, PAL.ink[0], 0.55);
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[2]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[1]);
  hline(g, x - 1, y - 1, w + 2, PAL.wood[6]); vline(g, x - 1, y - 1, h + 2, PAL.wood[5]);
  gradV(g, x, y, w, h, [PAL.paper[6], PAL.paper[5], PAL.paper[4]]);
  ditherOverlay(g, x, y + h - 14, w, 14, PAL.paper[2], 0.14);
  microCenter(g, 'ORGANIGRAMA', x + w / 2, y + 2, PAL.ink[2]);
  hline(g, x + 3, y + 8, w - 6, PAL.paper[2]);
  const faces = [PAL.skin[2], PAL.skin[3], PAL.skin[4], PAL.skin[5], PAL.skin[1]];
  const hairs = [PAL.ink[1], PAL.wood[2], PAL.wood[5], PAL.gold[4], PAL.metal[5], PAL.red[3]];
  const rows = [[1, 11], [3, 17], [6, 23], [9, 29], [10, 35]];
  const pos = rows.map(([cnt, ry]) => {
    const gap = (w - 4) / cnt;
    return Array.from({ length: cnt }, (_, i) => [Math.round(x + 2 + gap * i + gap / 2 - 2), ry + y]);
  });
  for (let r = 1; r < pos.length; r++) {
    for (let i = 0; i < pos[r].length; i++) {
      const par = pos[r - 1][Math.min(pos[r - 1].length - 1, Math.floor(i * pos[r - 1].length / pos[r].length))];
      const c = pos[r][i];
      const my = par[1] + 5;
      vline(g, par[0] + 1, par[1] + 4, my - par[1] - 3, PAL.metal[4]);
      hline(g, Math.min(par[0], c[0]) + 1, my, Math.abs(par[0] - c[0]) + 1, PAL.metal[4]);
      vline(g, c[0] + 1, my, c[1] - my, PAL.metal[4]);
    }
  }
  let n = 0;
  for (const row of pos) for (const [bx, by] of row) {
    rect(g, bx, by, 4, 4, PAL.paper[7]);
    rect(g, bx, by, 4, 1, hairs[n % hairs.length]);
    rect(g, bx + 1, by + 1, 2, 2, faces[(n * 3) % faces.length]);
    hline(g, bx, by + 3, 4, PAL.metal[3]);
    n++;
  }
  // rama inferior: «DISEÑO Y PRODUCTO»
  const cx = x + w / 2;
  vline(g, cx, y + 39, 2, PAL.metal[4]);
  rect(g, x + 10, y + 40, w - 20, 13, PAL.teal[7]); frameRect(g, x + 10, y + 40, w - 20, 13, PAL.teal[3]);
  microCenter(g, 'DISEÑO Y', cx, y + 42, PAL.ink[0]);
  microCenter(g, 'PRODUCTO', cx, y + 47, PAL.ink[0]);
  vline(g, cx, y + 53, 1, PAL.metal[4]);
  vacanteSlot(g, x + 16, y + 54, false);
}
function vacanteSlot(g, vx, vy, foto) {
  rect(g, vx, vy, 24, 11, PAL.paper[7]);
  for (let i = 0; i < 24; i += 2) { px(g, vx + i, vy, PAL.red[3]); px(g, vx + i, vy + 10, PAL.red[3]); }
  for (let i = 0; i < 11; i += 2) { px(g, vx, vy + i, PAL.red[3]); px(g, vx + 23, vy + i, PAL.red[3]); }
  if (foto) {
    rect(g, vx + 2, vy + 2, 7, 8, PAL.blue[6]);
    rect(g, vx + 3, vy + 2, 4, 2, PAL.wood[3]); rect(g, vx + 3, vy + 4, 4, 3, PAL.skin[5]); px(g, vx + 4, vy + 5, PAL.ink[1]); px(g, vx + 6, vy + 5, PAL.ink[1]);
    rect(g, vx + 2, vy + 8, 7, 2, PAL.blue[3]);
    px(g, vx + 1, vy + 1, '#f2a0c8'); px(g, vx + 2, vy + 1, '#f2a0c8'); px(g, vx + 1, vy + 2, '#f2a0c8'); // el chicle
  } else {
    rect(g, vx + 2, vy + 2, 7, 8, PAL.paper[4]);
    ditherOverlay(g, vx + 2, vy + 2, 7, 8, PAL.paper[2], 0.5);
    micro(g, '?', vx + 4, vy + 3, PAL.paper[1]);
  }
  micro(g, 'VACANTE', vx + 11, vy + 3, PAL.red[4]);
}

// ------------------------------------------------------------------ cuadro de llaves + línea de sucesión
function cuadroPlazas(g) {
  const x = 108, y = 38, w = 26, h = 38;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.ink[0], 0.5);
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[3]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[1]);
  hline(g, x - 1, y - 1, w + 2, PAL.wood[6]); vline(g, x - 1, y - 1, h + 2, PAL.wood[5]);
  paint(g, x, y, w, h, (xx, yy) => (hash2(xx, yy, 4) < 0.25 ? PAL.green[2] : PAL.green[3]));
  rect(g, x, y, w, 7, PAL.red[3]); hline(g, x, y, w, PAL.red[5]);
  microCenter(g, 'GARAJE', x + w / 2, y + 1, PAL.paper[7]);
  const tag = [PAL.gold[4], PAL.paper[6], PAL.red[4], PAL.teal[5]];
  for (let i = 0; i < 12; i++) {
    const cx = x + 3 + (i % 4) * 6, cy = y + 10 + Math.floor(i / 4) * 9;
    px(g, cx + 1, cy, PAL.gold[6]);
    if (i === 2) { px(g, cx + 1, cy + 1, PAL.ink[2]); continue; } // plaza 3: sin llave («ocupada por su ausencia»)
    rect(g, cx, cy + 1, 3, 2, PAL.metal[6]); px(g, cx, cy + 1, PAL.metal[7]);
    rect(g, cx, cy + 3, 4, 3, tag[i % tag.length]); px(g, cx + 1, cy + 4, PAL.ink[1]);
  }
  // hoja a lápiz con la línea de sucesión: tachones y nombres
  const sx = x + 2, sy = y + h + 3;
  ditherOverlay(g, sx + 1, sy + 1, 22, 20, PAL.ink[0], 0.4);
  rect(g, sx, sy, 22, 20, PAL.paper[6]);
  const r = rng(31);
  for (let ly = sy + 4; ly < sy + 19; ly += 3) {
    const len = 10 + Math.floor(r() * 9);
    hline(g, sx + 2, ly, len, PAL.metal[4]);
    if (r() < 0.5) hline(g, sx + 2, ly, len, PAL.red[3]);
  }
  micro(g, 'PLAZA 3', sx + 2, sy + 1, PAL.ink[3]);
  px(g, sx + 11, sy - 1, PAL.red[5]); px(g, sx + 10, sy - 1, PAL.red[2]);
}

// ------------------------------------------------------------------ logo de letras metálicas
function logo(g) {
  const t = 'elContable.es';
  const tw = measureText(t);
  const x = Math.round(160 - tw / 2), y = 14;
  label(g, t, x + 1, y + 2, PAL.ink[0], { bold: true });
  label(g, t, x, y + 1, PAL.metal[3], { bold: true });
  label(g, t, x, y, PAL.metal[7], { bold: true });
  const cx = (s) => x + measureText(s);
  for (const [s, dy] of [['el', 4], ['elC', 4], ['elCont', 4], ['elContab', 4], ['elContable.', 4]]) px(g, cx(s) + 1, y + dy + 6, PAL.gold[5]);
  px(g, x + 2, y + 9, PAL.ink[0]); // agujero sin tornillo en la primera «e»
  px(g, x + 2, y + 10, PAL.metal[1]);
  rect(g, x + 5, 31, 1, 1, PAL.metal[6]); // el tornillo, en la repisa
  hline(g, 124, 31, 72, PAL.green[1]); hline(g, 124, 32, 72, PAL.green[5]);
}

// ------------------------------------------------------------------ altavoz del Ibex con bufanda
function altavoz(g) {
  const x = 241, y = 30;
  ditherOverlay(g, x + 1, y + 2, 13, 11, PAL.ink[0], 0.5);
  bevel(g, x, y, 13, 11, PAL.metal[5], PAL.metal[7], PAL.metal[2]);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) px(g, x + 3 + j * 2, y + 3 + i * 2, PAL.metal[2]);
  rect(g, x + 1, y + 7, 9, 3, PAL.paper[7]); micro(g, 'IBEX', x + 2, y + 7, PAL.ink[1]);
  const sc = [PAL.leaf[5], PAL.red[4]];
  for (let i = 0; i < 13; i++) rect(g, x + i, y - 1, 1, 4, sc[(i >> 1) % 2]);
  hline(g, x, y - 1, 13, PAL.paper[6]);
  for (let k = 0; k < 11; k++) rect(g, x + 8, y + 3 + k, 3, 1, sc[(k >> 1) % 2]);
  vline(g, x + 11, y + 3, 11, PAL.ink[2]);
  line(g, x + 13, y + 8, x + 16, y + 22, PAL.ink[0]);
}

// ------------------------------------------------------------------ mostrador de Celestino
function drawCounter(g) {
  const x = 190, y = 72, w = 64;
  shadowEllipse(g, x + w / 2, 102, w / 2 + 6, 3, 0.75);
  gradV(g, x, y + 5, w, 25, [PAL.wood[4], PAL.wood[3], PAL.wood[2]]);
  noise(g, x, y + 5, w, 25, PAL.wood[1], 0.05, 9);
  for (let i = 0; i < 4; i++) {
    const px0 = x + 3 + i * 15;
    frameRect(g, px0, y + 9, 13, 16, PAL.wood[1]);
    hline(g, px0 + 1, y + 10, 11, PAL.wood[5]); vline(g, px0 + 1, y + 10, 14, PAL.wood[5]);
    hline(g, px0 + 1, y + 24, 12, PAL.wood[2]);
  }
  vline(g, x, y + 5, 25, PAL.wood[5]); vline(g, x + w - 1, y + 5, 25, PAL.wood[1]);
  rect(g, x, y + 27, w, 3, PAL.ink[2]); hline(g, x, y + 27, w, PAL.metal[3]);
  rect(g, x - 2, y, w + 4, 5, PAL.wood[5]); hline(g, x - 2, y, w + 4, PAL.wood[7]); hline(g, x - 2, y + 1, w + 4, PAL.wood[6]);
  hline(g, x - 2, y + 4, w + 4, PAL.wood[2]);
  rect(g, x + 14, y + 11, 36, 7, PAL.gold[5]); frameRect(g, x + 14, y + 11, 36, 7, PAL.gold[2]);
  microCenter(g, 'CONSERJE', x + 32, y + 13, PAL.ink[0]);
}
/** Objetos del mostrador (se pintan con el mostrador, delante de Celestino). */
function counterTop(g) {
  const y = 72;
  const bx = 195, by = 59;
  ditherOverlay(g, bx + 1, by + 2, 14, 13, PAL.ink[0], 0.45);
  bevel(g, bx, by, 13, 13, PAL.red[3], PAL.red[5], PAL.red[1]);
  rect(g, bx + 2, by + 3, 9, 1, PAL.ink[0]);
  ditherOverlay(g, bx, by, 13, 4, PAL.paper[4], 0.55);
  rect(g, bx + 2, by + 6, 9, 5, PAL.paper[6]); microCenter(g, 'SUGER.', bx + 6, by + 7, PAL.ink[2]);
  rect(g, 212, y - 11, 5, 11, PAL.green[3]); vline(g, 212, y - 11, 11, PAL.green[5]); rect(g, 212, y - 13, 5, 2, PAL.metal[5]); hline(g, 212, y - 13, 5, PAL.metal[7]);
  rect(g, 217, y - 8, 1, 4, PAL.metal[4]);
  rect(g, 219, y - 3, 11, 3, PAL.paper[6]); hline(g, 219, y - 3, 11, PAL.red[4]); hline(g, 221, y - 1, 7, PAL.paper[3]);
  const rx = 240, ry = y - 10;
  ditherOverlay(g, rx + 1, ry + 2, 12, 9, PAL.ink[0], 0.5);
  bevel(g, rx, ry, 12, 10, PAL.wood[3], PAL.wood[6], PAL.wood[1]);
  rect(g, rx + 1, ry + 1, 6, 6, PAL.ink[2]); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) px(g, rx + 2 + j * 2, ry + 2 + i * 2, PAL.metal[4]);
  rect(g, rx + 8, ry + 2, 3, 1, PAL.gold[5]); px(g, rx + 9, ry + 5, PAL.red[5]); px(g, rx + 8, ry + 7, PAL.metal[6]);
  line(g, rx + 10, ry, rx + 15, ry - 9, PAL.metal[6]);
  px(g, rx + 15, ry - 9, PAL.metal[7]);
  glow(g, 224, y - 2, 22, 5, PAL.crt[4], 0.07, 4);
}

// ------------------------------------------------------------------ ascensor
function elevator(g) {
  const x = 258, y = 24, w = 40, h = 74;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.ink[0], 0.5);
  rect(g, x, y, w, h, PAL.metal[2]); frameRect(g, x, y, w, h, PAL.metal[1]);
  hline(g, x + 1, y + 1, w - 2, PAL.metal[6]); vline(g, x + 1, y + 1, h - 2, PAL.metal[5]);
  rect(g, x + 4, y + 3, 28, 8, PAL.ink[0]); frameRect(g, x + 4, y + 3, 28, 8, PAL.metal[4]);
  const nums = ['-1', '0', '1', '2'];
  for (let i = 0; i < 4; i++) micro(g, nums[i], x + 7 + i * 7, y + 5, i === 1 ? PAL.crt[5] : PAL.metal[3]);
  glow(g, x + 15, y + 7, 8, 5, PAL.crt[5], 0.2, 3);
  const dx = x + 4, dy = y + 13, dw = 28, dh = h - 14;
  paint(g, dx, dy, dw, dh, (xx, yy) => {
    const fx = (xx - dx) / dw;
    const streak = hash2(xx, yy >> 2, 2) < 0.18 ? 1 : 0;
    const base = fx < 0.5 ? fx * 2 : (1 - fx) * 2;
    return ditherPick(xx, yy, [PAL.metal[3], PAL.metal[4], PAL.metal[5], PAL.metal[6]], 0.25 + base * 0.45 + streak * 0.15 - (yy - dy) / dh * 0.15);
  });
  vline(g, dx + 13, dy, dh, PAL.ink[0]); vline(g, dx + 14, dy, dh, PAL.ink[1]);
  vline(g, dx, dy, dh, PAL.ink[1]); vline(g, dx + dw - 1, dy, dh, PAL.ink[1]);
  ellipse(g, dx + 8, dy + 38, 3, 8, (xx, yy, d) => (bayer2(xx, yy) < 0.5 - d * 0.4 ? PAL.metal[2] : null));
  rect(g, dx + 5, dy + 28, 7, 2, PAL.metal[3]);
  tintPoly(g, [[dx + 3, dy], [dx + 8, dy], [dx + 3, dy + 24], [dx, dy + 24]], '#ffffff', 0.12);
  rect(g, dx - 1, y + h - 1, dw + 2, 2, PAL.metal[5]);
  const px0 = x + 35, py0 = y + 22;
  bevel(g, px0, py0, 4, 24, PAL.metal[4], PAL.metal[6], PAL.metal[1]);
  for (let i = 0; i < 4; i++) {
    const by = py0 + 2 + i * 5;
    ellipse(g, px0 + 2, by + 1.5, 1.5, 1.5, i === 3 ? PAL.gold[6] : PAL.metal[7]); // el -1, gastadísimo de dedos
    if (i === 3) px(g, px0 + 1, by + 1, '#ffffff');
  }
}

// ------------------------------------------------------------------ torno de cristal (objeto: LED rojo/verde, hojas)
function drawTorno(g, view, t) {
  const open = !!view.flag('torno_abierto');
  shadowEllipse(g, 160, 100, 29, 3, 0.7);
  const gy0 = 68, gy1 = 97;
  const leaf = (xa, xb, right) => {
    if (!open) {
      tintPoly(g, [[xa, gy0], [xb, gy0], [xb, gy1], [xa, gy1]], PAL.teal[5], 0.32);
      tintPoly(g, [[xa + 1, gy0 + 1], [xb - 1, gy0 + 1], [xb - 1, gy1 - 1], [xa + 1, gy1 - 1]], PAL.teal[7], 0.10);
      tintPoly(g, [[xa + 2, gy0 + 2], [xa + 5, gy0 + 2], [xa + 2, gy0 + 16], [xa, gy0 + 16]], '#ffffff', 0.18);
      frameRect(g, xa, gy0, xb - xa, gy1 - gy0, PAL.metal[6]);
      hline(g, xa, gy0, xb - xa, PAL.metal[7]);
      hline(g, xa, gy1 - 2, xb - xa, PAL.metal[3]);
    } else {
      const pts = right ? [[xb - 1, gy0], [xb + 3, gy0 + 2], [xb + 3, gy1 - 2], [xb - 1, gy1]] : [[xa + 1, gy0], [xa - 3, gy0 + 2], [xa - 3, gy1 - 2], [xa + 1, gy1]];
      tintPoly(g, pts, PAL.teal[6], 0.5);
      line(g, pts[0][0], pts[0][1], pts[1][0], pts[1][1], PAL.metal[6]);
    }
  };
  leaf(147, 159, false); leaf(161, 173, true);
  if (!open) { rect(g, 159, gy0, 2, gy1 - gy0, PAL.metal[4]); vline(g, 159, gy0, gy1 - gy0, PAL.metal[6]); }
  for (const px0 of [135, 174]) {
    gradH(g, px0, 62, 11, 36, [PAL.metal[3], PAL.metal[6], PAL.metal[7], PAL.metal[4], PAL.metal[2]]);
    frameRect(g, px0, 62, 11, 36, PAL.metal[1]);
    rect(g, px0 - 1, 60, 13, 3, PAL.metal[5]); hline(g, px0 - 1, 60, 13, PAL.metal[7]); hline(g, px0 - 1, 62, 13, PAL.metal[2]);
    rect(g, px0 - 2, 96, 15, 3, PAL.metal[2]); hline(g, px0 - 2, 96, 15, PAL.metal[5]);
  }
  const lx = 137, ly = 67;
  rect(g, lx - 1, ly - 1, 9, 7, PAL.ink[0]);
  const blink = open ? true : ((t || 0) % 1400) < 900;
  const col = open ? PAL.crt[5] : '#ff3a30';
  if (blink) {
    if (open) { px(g, lx + 1, ly + 3, col); px(g, lx + 2, ly + 4, col); px(g, lx + 3, ly + 3, col); px(g, lx + 4, ly + 2, col); px(g, lx + 5, ly + 1, col); }
    else for (let i = 0; i < 4; i++) { px(g, lx + 1 + i, ly + 1 + i, col); px(g, lx + 4 - i, ly + 1 + i, col); }
    glow(g, lx + 3, ly + 3, 9, 6, col, 0.3, 3);
  }
  rect(g, 177, 66, 6, 7, PAL.ink[1]); rect(g, 178, 67, 4, 1, PAL.metal[3]);
  px(g, 180, 71, open ? PAL.crt[5] : PAL.red[4]); px(g, 178, 71, PAL.metal[4]);
  tintRect(g, 148, 61, 24, 1, open ? PAL.crt[5] : PAL.red[4], 0.8);
  tintRect(g, 140, 101, 24, 2, open ? PAL.crt[4] : PAL.red[4], 0.10);
}

// ------------------------------------------------------------------ pantalla del Ibex (animada)
function drawIbex(g, view, t) {
  const x = 207, y = 24, w = 32, h = 23;
  rect(g, x + 14, y + h, 4, 3, PAL.metal[2]);
  ditherOverlay(g, x + 1, y + 2, w, h, PAL.ink[0], 0.5);
  bevel(g, x - 2, y - 2, w + 4, h + 4, PAL.ink[2], PAL.metal[3], PAL.ink[0]);
  rect(g, x, y, w, h, '#03120a');
  for (let gy = y + 4; gy < y + h; gy += 5) for (let gx = x; gx < x + w; gx += 2) px(g, gx, gy, '#0b2a16');
  const T = Math.floor((t || 0) / 700);
  const r = rng(9 + T % 8);
  let prev = y + 14;
  for (let i = 0; i < 12; i++) {
    const bx = (x + 2 + i * 2.5) | 0;
    const nv = Math.max(y + 5, Math.min(y + h - 6, prev + Math.round((r() - 0.5) * 7)));
    rect(g, bx, Math.min(nv, prev), 2, Math.abs(nv - prev) + 1, nv < prev ? PAL.crt[5] : '#e0402e');
    prev = nv;
  }
  micro(g, 'IBEX 35', x + 2, y + 1, PAL.crt[6]);
  micro(g, T % 2 ? '+0.12%' : '-0.31%', x + w - 25, y + h - 6, T % 2 ? PAL.crt[5] : '#ff6a50');
  ditherOverlay(g, x, y, w, 5, '#ffffff', 0.06);
  glow(g, x + w / 2, y + h / 2 + 6, 26, 16, PAL.crt[4], 0.10, 4);
}

// ------------------------------------------------------------------ ficus de plástico (con micrófono si se ha empujado)
function drawFicus(g, view, t) {
  const pushed = (view.flag('planta_empujada_n') | 0) >= 1;
  const x = 308, y = 101;
  plant(g, x, y, { size: 44, seed: 7, leaves: 22, potW: 14, leaf: PAL.leaf, pot: PAL.ink });
  const r = rng(4);
  for (let i = 0; i < 16; i++) { const lx = x - 12 + Math.floor(r() * 25), ly = y - 14 - Math.floor(r() * 30); px(g, lx, ly, PAL.leaf[7]); if (i % 3 === 0) px(g, lx + 1, ly + 1, '#e4f6c8'); }
  ditherOverlay(g, x - 11, y - 14, 23, 8, PAL.paper[3], 0.18);
  rect(g, x + 4, y - 11, 4, 3, PAL.paper[6]); px(g, x + 5, y - 10, PAL.red[4]);
  if (pushed) {
    line(g, x - 12, y - 32, x - 4, y - 30, PAL.leaf[7], 2);
    line(g, x - 12, y - 32, x - 17, y - 25, PAL.leaf[2], 1);
    const mx = x - 6, my = y - 27;
    rect(g, mx - 1, my - 1, 7, 9, PAL.ink[0]);
    rect(g, mx, my, 5, 6, PAL.metal[3]); for (let i = 0; i < 3; i++) hline(g, mx + 1, my + 1 + i * 2, 3, PAL.metal[6]);
    hline(g, mx, my, 5, PAL.metal[7]);
    rect(g, mx + 1, my + 7, 3, 1, PAL.ink[2]);
    rect(g, mx - 3, my + 9, 13, 6, PAL.red[5]); micro(g, 'SEG', mx - 2, my + 10, PAL.paper[7]);
    if (((t || 0) % 1200) < 700) { px(g, mx + 2, my - 1, '#ff4030'); glow(g, mx + 2, my - 1, 4, 3, '#ff4030', 0.5, 2); }
  }
}

function drawTachado(g) {
  const x = 108, y = 38, sx = x + 2, sy = y + 41;
  // aspa grande de rotulador rojo sobre el cuadro y tachones en la hoja
  line(g, x + 1, y + 8, x + 24, y + 36, PAL.red[4], 2); line(g, x + 24, y + 8, x + 1, y + 36, PAL.red[4], 2);
  for (let k = 0; k < 4; k++) hline(g, sx + 2, sy + 4 + k * 3, 18, PAL.red[4]);
  rect(g, sx + 1, sy + 14, 20, 5, PAL.paper[7]); micro(g, 'PLAZA 1', sx + 2, sy + 15, PAL.ink[2]);
  px(g, sx + 18, sy + 16, PAL.red[4]);
}

function drawVacante(g, view) {
  if (view.flag('foto_en_organigrama')) vacanteSlot(g, 63, 72, true);
}

// ------------------------------------------------------------------ geometría
const layout = {
  puerta_calle: { rect: [4, 24, 40, 74], walkTo: [30, 110], face: 'left' },
  organigrama: { rect: [47, 18, 56, 36], walkTo: [74, 108], face: 'up', draw: (g, v) => drawVacante(g, v) },
  rama_diseno: { rect: [47, 56, 56, 28], walkTo: [76, 108], face: 'up' },
  cuadro_plazas: {
    rect: [106, 36, 26, 58], walkTo: [120, 108], face: 'up',
    sprites: {
      normal: () => {},
      default: () => {},
      // epílogo (8bis.2): Celestino tacha el cuadro de llaves — la línea de sucesión «enloquece»
      tachado: (g) => drawTachado(g),
    },
  },
  logo_pared: { rect: [122, 14, 76, 18], walkTo: [160, 108], face: 'up' },
  torno: { rect: [133, 58, 56, 42], walkTo: [160, 107], face: 'up', draw: (g, v, t) => drawTorno(g, v, t) },
  pantalla_ibex: { rect: [205, 22, 36, 28], walkTo: [224, 112], face: 'up', draw: (g, v, t) => drawIbex(g, v, t) },
  altavoz_ibex: { rect: [241, 28, 14, 16], walkTo: [248, 112], face: 'up', priority: 1 },
  buzon_sugerencias: { rect: [194, 58, 15, 14], walkTo: [202, 110], face: 'up', priority: 1 },
  radio_celestino: {
    rect: [239, 60, 17, 12], walkTo: [244, 110], face: 'up', priority: 1,
    layer: 'sorted', zy: 100,
    draw: (g) => { drawCounter(g); counterTop(g); },
  },
  ascensor_vestibulo: { rect: [258, 24, 40, 74], walkTo: [276, 108], face: 'up' },
  planta_plastico: { rect: [297, 54, 20, 48], walkTo: [304, 110], face: 'up', priority: 1, draw: (g, v, t) => drawFicus(g, v, t) },
  celestino: { at: [224, 98, 'down'], walkTo: [224, 111], face: 'up' },
  evaristo_salvedad: { at: [196, 114, 'left'], walkTo: [212, 116], face: 'left' },
};

export default {
  room: 'vestibulo',
  width: W,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [[6, 104], [314, 104], [318, 142], [2, 142]] }],
  entries: { inicio: [38, 118, 'right'], pecera: [160, 110, 'down'], cpd: [278, 110, 'down'] },
  layout,
  dynamic: true,
  draw(g, view) { paintBackground(g, !!(view && view.flag && view.flag('lector_derribado'))); },
  animate(g, view, t) {
    if (view && view.flag && view.flag('lector_derribado')) return; // amanece: se acabó la lluvia
    // lluvia en las puertas de la calle
    const ix = 6, iy = 27, iw = 36, ih = 70;
    g.save(); g.beginPath(); g.rect(ix, iy, iw, ih); g.clip();
    for (let i = 0; i < 28; i++) {
      const sp = 28 + (i * 7) % 23;
      const yy = ((t || 0) / 1000 * sp + i * 17) % (ih + 8) - 4;
      const xx = ix + 1 + ((i * 53) % (iw - 2));
      g.fillStyle = i % 4 === 0 ? '#c8e0f4' : '#7ea8d0';
      g.fillRect(xx, Math.floor(iy + yy), 1, 3);
    }
    for (let i = 0; i < 6; i++) {
      const yy = ((t || 0) / 1000 * (6 + i * 1.3) + i * 23) % ih;
      g.fillStyle = '#b4d4ee'; g.fillRect(ix + 3 + i * 6, Math.floor(iy + yy), 1, 2);
    }
    g.restore();
  },
  overlay(g, view, t) {
    if (view && view.flag && view.flag('lector_derribado')) return;
    const k = Math.floor((t || 0) / 400) % 3;
    g.fillStyle = '#ffc080'; g.fillRect(24 + k * 6, 117, 2, 1); g.fillRect(34 - k * 4, 119, 1, 1);
  },
};
