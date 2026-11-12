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
  // pósit añadido a mano, con cinta americana: «+ EVENTOS» (el organigrama se imprimió antes de que existieran)
  ditherOverlay(g, x + 27, y + 27, 31, 9, PAL.ink[0], 0.4);
  rect(g, x + 26, y + 26, 31, 9, '#f6e27a'); hline(g, x + 26, y + 34, 31, '#c8b450');
  rect(g, x + 24, y + 25, 5, 2, PAL.metal[4]); rect(g, x + 54, y + 25, 5, 2, PAL.metal[4]);
  micro(g, '+EVENTOS', x + 27, y + 28, PAL.red[2]);
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

// ------------------------------------------------------------------ GEOGRAFÍA (problema del director: el ascensor
// tiene que estar DETRÁS del torno). La sala se lee de izquierda a derecha:
//   ZONA DE ENTRADA (x 0-210): puertas de la calle, organigrama, cuadro de llaves, ficus y el mostrador de seguridad de
//     Celestino, pegado a los tornos.
//   LÍNEA DE TORNOS (diagonal, del fondo al borde de la pantalla): tres bancadas de acero con alas de cristal. El carril
//     de atrás es el torno de Bruno (se abre con torno_abierto); el de delante está FUERA DE SERVICIO. Cartel colgado
//     «ACCESO REDACCIÓN →».
//   VESTÍBULO INTERIOR (x 222-320): pared de nogal con el logo, moqueta, el ascensor y la escalera a la Redacción.
// Suelo: walkbox `entrada` + walkbox `interior` + walkbox `paso_torno` (when: 'torno_abierto', carril de atrás). Antes de
// abrir el torno no hay camino del lado de la calle al interior (el motor evalúa `when`; docs CONTENT_SCHEMA §2.4).
const BX = (y) => 216 + (y - 97) * 0.6;           // eje de la línea de tornos en el suelo (x en función de la profundidad)
const BANK = [{ y: 106, d: 5, L: 24, H: 20 }, { y: 124, d: 6, L: 27, H: 22 }, { y: 146, d: 7, L: 30, H: 24 }];
const NOGAL = [PAL.wood[1], PAL.wood[2], PAL.wood[3], PAL.wood[2]];

/** Bancada de torno (caja de acero alargada en la dirección de paso) con base en la profundidad `b.y`. */
function cabinet(g, b, opts = {}) {
  const cx = Math.round(BX(b.y - b.d / 2)), x0 = cx - (b.L >> 1), x1 = x0 + b.L, top = b.y - b.H;
  shadowEllipse(g, cx + 2, b.y, (b.L >> 1) + 4, 2.5, 0.8);
  // cara superior (se ve un poco desde arriba): paralelogramo hacia el fondo
  const sk = Math.round(b.d * 0.6);
  poly(g, [[x0 - sk, top - b.d + 1], [x1 - sk, top - b.d + 1], [x1, top], [x0, top]], (xx, yy) => ditherPick(xx, yy, [PAL.ink[1], PAL.ink[2], PAL.metal[1]], (yy - top + b.d) / b.d));
  hline(g, x0 - sk, top - b.d + 1, b.L, PAL.metal[4]);
  // cara frontal: acero cepillado
  paint(g, x0, top, b.L, b.H, (xx, yy) => ditherPick(xx, yy, [PAL.metal[6], PAL.metal[5], PAL.metal[4], PAL.metal[3]], 0.15 + (yy - top) / b.H * 0.6 + ((xx * 3 + (yy >> 2)) % 9 === 0 ? 0.12 : 0)));
  hline(g, x0, top, b.L, PAL.metal[7]); vline(g, x0, top, b.H, PAL.metal[7]); vline(g, x1 - 1, top, b.H, PAL.metal[2]);
  rect(g, x0, b.y - 3, b.L, 3, PAL.ink[1]); hline(g, x0, b.y - 3, b.L, PAL.metal[2]);
  // franja negra de lectores con piloto
  rect(g, x0 + 2, top + 3, b.L - 4, 3, PAL.ink[0]);
  px(g, x0 + 4, top + 4, opts.led || PAL.red[4]); px(g, x1 - 5, top + 4, opts.led || PAL.red[4]);
  // lado (canto hacia el interior: se ve el lateral derecho)
  poly(g, [[x1, top], [x1 + 2, top - 1], [x1 + 2, b.y - 1], [x1, b.y]], PAL.metal[2]);
  return { x0, x1, top, cx };
}

/** Alas de cristal de un carril, entre la bancada `a` (detrás) y `b` (delante). open = recogidas dentro de la bancada. */
function wings(g, a, b, open, tint = PAL.teal[6]) {
  const ya = a.y, yb = b.y - b.d, ym = (ya + yb) / 2;
  const leaf = (y0, y1) => {
    const x0 = BX(y0), x1 = BX(y1);
    const pts = [[x0, y0 - 28], [x1, y1 - 28], [x1, y1 - 7], [x0, y0 - 7]];
    tintPoly(g, pts, tint, 0.55);
    tintPoly(g, [[x0 + 0.5, y0 - 27], [x0 + 1.5, y0 - 27], [x0 + 1.5, y0 - 18], [x0 + 0.5, y0 - 18]], '#ffffff', 0.4);
    line(g, Math.round(x0), y0 - 28, Math.round(x1), y1 - 28, PAL.teal[7]);
    line(g, Math.round(x0), y0 - 7, Math.round(x1), y1 - 7, PAL.teal[3]);
    vline(g, Math.round(x1), y1 - 28, 21, PAL.teal[7]);
  };
  if (!open) { leaf(ya, ym - 0.5); leaf(yb, ym + 0.5); }
  else {
    // recogidas: solo asoma el canto de cada ala junto a su bancada
    leaf(ya, ya + 1.5); leaf(yb, yb - 1.5);
  }
}

/** Panel de cristal fijo, alto, entre el poste de la pared y la primera bancada (para que nadie se cuele por el fondo). */
function backGlass(g) {
  const x = BX(97), y0 = 97, y1 = BANK[0].y - BANK[0].d;
  tintPoly(g, [[x, 50], [BX(y1), y1 - 44], [BX(y1), y1 - 16], [x, y0 - 4]], PAL.teal[6], 0.35);
  vline(g, Math.round(x), 48, 50, PAL.metal[6]); vline(g, Math.round(x) + 1, 48, 50, PAL.metal[2]);
  rect(g, Math.round(x) - 1, 47, 4, 2, PAL.metal[7]);
}

function drawBankBack(g) {
  backGlass(g);
  for (const [d, c] of [[0, PAL.metal[7]], [1, PAL.metal[3]]]) line(g, Math.round(BX(97)), 97 - 46 + d, Math.round(BX(101)), 101 - 30 + d, c);
  cabinet(g, BANK[0]);
}

// ------------------------------------------------------------------ fondo estático
function paintBackground(g, dawn) {
  rect(g, 0, 0, W, 144, PAL.ink[1]);
  // pared verde institucional de la zona de entrada
  paint(g, 0, 16, 220, 66, (xx, yy) => {
    const t = (yy - 16) / 66;
    let c = ditherPick(xx, yy, [PAL.green[4], PAL.green[3], PAL.green[2], PAL.green[1]], t);
    if (hash2(xx, yy, 3) < 0.035) c = PAL.green[1];
    return c;
  });
  vline(g, 104, 16, 64, PAL.green[1]); vline(g, 105, 16, 64, PAL.green[5]);
  // zócalo de mármol (entrada)
  paint(g, 0, 80, 220, 16, (xx, yy) => {
    const t = (yy - 80) / 16;
    const vein = Math.sin(xx * 0.31 + Math.sin(yy * 0.7 + xx * 0.05) * 2.2 + (xx >> 5) * 1.7);
    let c = ditherPick(xx, yy, [PAL.metal[4], PAL.metal[3], PAL.metal[2]], t * 0.9);
    if (vein > 0.93) c = PAL.metal[5];
    return c;
  });
  hline(g, 0, 80, 220, PAL.metal[6]); hline(g, 0, 81, 220, PAL.metal[4]); hline(g, 0, 82, 220, PAL.metal[1]);
  for (let px0 = 0; px0 < 220; px0 += 40) vline(g, px0, 83, 10, PAL.metal[1]);
  rect(g, 0, 93, 220, 4, PAL.metal[1]); hline(g, 0, 93, 220, PAL.metal[4]); hline(g, 0, 96, 220, PAL.ink[0]);
  // VESTÍBULO INTERIOR: pared de nogal con lamas verticales (más cálida, «de dentro»)
  paint(g, 220, 16, W - 220, 81, (xx, yy) => {
    const lama = (xx - 220) % 6;
    const t = (yy - 16) / 81;
    let c = ditherPick(xx, yy, NOGAL, 0.2 + t * 0.6 + (lama === 0 ? 0.3 : 0));
    if (lama === 1) c = PAL.wood[3];
    if (hash2(xx, yy >> 3, 8) < 0.04) c = PAL.wood[1];
    return c;
  });
  rect(g, 220, 93, W - 220, 4, PAL.ink[1]); hline(g, 220, 93, W - 220, PAL.wood[4]); hline(g, 220, 96, W - 220, PAL.ink[0]);
  // techo
  gradV(g, 0, 0, W, 14, [PAL.ink[0], PAL.ink[2], PAL.metal[1]]);
  hline(g, 0, 14, W, PAL.metal[3]); hline(g, 0, 15, W, PAL.ink[0]);
  ceiling(g, 0, 0, 216, 15, { spacing: 100, offset: 40, lampW: 40 });
  // downlights cálidos del interior
  for (const lx of [244, 300]) { rect(g, lx - 4, 13, 9, 2, PAL.gold[6]); hline(g, lx - 4, 15, 9, PAL.gold[3]); }
  // suelo de mármol gastado
  floorTiles(g, { x: 0, y: 97, w: W, h: 47, vpx: 160, vpy: 24, tile: 26, rowPx: 9, colors: [mix(PAL.metal[3], PAL.metal[4], 0.55), PAL.metal[3]], colors3: PAL.metal[2], grout: PAL.metal[1], far: PAL.ink[0], fade: 0.5 });
  // moqueta del vestíbulo interior (detrás de los tornos)
  poly(g, [[BX(97) + 12, 98], [W, 98], [W, 144], [BX(144) + 12, 144]], (xx, yy) => {
    const v = hash2(xx >> 1, yy, 5);
    return v < 0.1 ? PAL.red[0] : ditherPick(xx, yy, [PAL.red[1], PAL.red[2], PAL.purple[2]], 0.35 + (yy - 98) / 46 * 0.4);
  });
  line(g, Math.round(BX(97)) + 12, 98, Math.round(BX(144)) + 12, 144, PAL.gold[3]);
  for (let k = 0; k < 4; k++) { const yy = 104 + k * 10; hline(g, Math.round(BX(yy)) + 16, yy, W - Math.round(BX(yy)) - 20, PAL.red[3]); }
  // franja de seguridad pintada en el suelo, del lado de la calle, a lo largo de los tornos
  for (let yy = 98; yy < 144; yy++) {
    const xx = Math.round(BX(yy)) - 16 - Math.floor((yy - 98) / 16);
    rect(g, xx, yy, 2, 1, ((yy >> 2) & 1) ? PAL.gold[5] : PAL.ink[1]);
  }
  // mármol pulido por años de «no consta», delante del carril del torno
  glow(g, 196, 112, 26, 6, PAL.metal[7], 0.2, 5);
  for (let k = 0; k < 24; k++) px(g, 176 + ((k * 37) % 40), 107 + ((k * 11) % 10), PAL.metal[5]);

  streetDoors(g, dawn);

  // luz de farola derramada sobre el suelo y la pared izquierda
  band(g, [[4, 97], [44, 97], [96, 143], [-6, 143]], dawn ? '#ffe0a8' : '#ff9a3c', dawn ? 0.26 : 0.22, 5);
  band(g, [[44, 40], [92, 40], [92, 96], [44, 96]], dawn ? '#ffe0a8' : '#ff9a3c', 0.06, 3);
  // charco de lluvia + huellas mojadas (hacia los tornos)
  ellipse(g, 32, 118, 19, 4, (xx, yy, d) => ditherPick(xx, yy, [PAL.night[1], PAL.night[2], PAL.dusk[3], PAL.dusk[5]], 0.35 + (1 - d) * 0.45 - (yy - 118) * 0.04));
  ellipse(g, 32, 118, 19, 4, (xx, yy, d) => (d > 0.88 ? PAL.metal[2] : null));
  for (let k = 0; k < 11; k++) {
    const fx = 50 + k * 13 + (k % 2) * 2, fy = 111 + (k % 2) * 3;
    rect(g, fx, fy, 3, 1, PAL.ink[2]); rect(g, fx + 1, fy + 1, 2, 1, PAL.ink[3]);
  }
  // felpudo del umbral
  poly(g, [[7, 100], [43, 100], [49, 111], [1, 111]], (xx, yy) => (hash2(xx, yy, 6) < 0.3 ? PAL.ink[0] : PAL.ink[2]));
  line(g, 7, 100, 1, 111, PAL.red[2]); line(g, 43, 100, 49, 111, PAL.red[2]); hline(g, 1, 111, 48, PAL.red[2]);
  microCenter(g, 'BIENVENIDO', 25, 104, PAL.paper[4]);
  paraguero(g, 52, 101);
  sueloMojado(g, 96, 112);

  organigrama(g);
  cuadroPlazas(g);
  wallClock(g, 146, 26, 7, 20 + 59 / 60);
  altavoz(g);
  logo(g);
  elevator(g);
  stairs(g);
  hangingSign(g);
  drawBankBack(g);

  // luz de los fluorescentes en la pared y el suelo (entrada); luz cálida del interior
  for (const cx of [60, 160]) {
    glow(g, cx, 40, 38, 26, '#dff0e4', 0.13, 5);
    glow(g, cx, 112, 40, 9, '#dff0e4', 0.08, 5);
  }
  glow(g, 266, 26, 40, 16, '#ffd890', 0.22, 5);
  glow(g, 258, 110, 30, 8, '#ffcf80', 0.12, 4);
  glow(g, 300, 108, 22, 8, '#ffcf80', 0.10, 4);
  ditherOverlay(g, 0, 93, W, 4, PAL.ink[0], 0.45);
  vignette(g, W, 144, 0.5);
}

// ------------------------------------------------------------------ logo de letras metálicas (pared de nogal)
function logo(g) {
  const t = 'elContable.es';
  const tw = measureText(t);
  const x = Math.round(268 - tw / 2), y = 19;
  label(g, t, x + 1, y + 2, PAL.ink[0], { bold: true });
  label(g, t, x, y + 1, PAL.metal[3], { bold: true });
  label(g, t, x, y, PAL.metal[7], { bold: true });
  const cx = (s) => x + measureText(s);
  for (const s of ['el', 'elC', 'elCont', 'elContab', 'elContable.']) px(g, cx(s) + 1, y + 10, PAL.gold[5]);
  px(g, x + 2, y + 9, PAL.ink[0]); // agujero sin tornillo en la primera «e»
  px(g, x + 2, y + 10, PAL.wood[0]);
  hline(g, x - 4, 31, tw + 8, PAL.wood[0]); hline(g, x - 4, 32, tw + 8, PAL.wood[5]);   // repisa
  rect(g, x + 5, 30, 1, 1, PAL.metal[6]); // el tornillo, en la repisa
}

// ------------------------------------------------------------------ altavoz del Ibex con bufanda
function altavoz(g) {
  const x = 199, y = 26;
  ditherOverlay(g, x + 1, y + 2, 13, 11, PAL.ink[0], 0.5);
  bevel(g, x, y, 13, 11, PAL.metal[5], PAL.metal[7], PAL.metal[2]);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) px(g, x + 3 + j * 2, y + 3 + i * 2, PAL.metal[2]);
  rect(g, x + 1, y + 7, 9, 3, PAL.paper[7]); micro(g, 'IBEX', x + 2, y + 7, PAL.ink[1]);
  const sc = [PAL.leaf[5], PAL.red[4]];
  for (let i = 0; i < 13; i++) rect(g, x + i, y - 1, 1, 4, sc[(i >> 1) % 2]);
  hline(g, x, y - 1, 13, PAL.paper[6]);
  for (let k = 0; k < 11; k++) rect(g, x + 8, y + 3 + k, 3, 1, sc[(k >> 1) % 2]);
  vline(g, x + 11, y + 3, 11, PAL.ink[2]);
}

// ------------------------------------------------------------------ cartel colgado sobre los tornos
function hangingSign(g) {
  const x = 202, y = 49, w = 46;
  vline(g, x + 5, 15, y - 15, PAL.metal[3]); vline(g, x + w - 6, 15, y - 15, PAL.metal[3]);
  ditherOverlay(g, x + 2, y + 2, w, 18, PAL.ink[0], 0.5);
  bevel(g, x, y, w, 18, PAL.ink[2], PAL.metal[3], PAL.ink[0]);
  rect(g, x + 1, y + 1, w - 2, 16, '#0c2a1c');
  micro(g, 'REDACCIÓN', x + 3, y + 3, PAL.paper[7]);
  micro(g, 'ASCENSOR', x + 3, y + 10, PAL.paper[7]);
  for (const ay of [y + 5, y + 12]) { hline(g, x + 39, ay, 3, PAL.gold[6]); vline(g, x + 42, ay - 2, 5, PAL.gold[6]); vline(g, x + 43, ay - 1, 3, PAL.gold[6]); px(g, x + 44, ay, PAL.gold[6]); }
}

// ------------------------------------------------------------------ mostrador de seguridad de Celestino (junto a los tornos)
const CX0 = 156, CW = 50, CY = 79;   // mostrador bajo: Celestino se ve de cintura para arriba (problema 4)
function drawCounter(g) {
  const x = CX0, y = CY, w = CW;
  shadowEllipse(g, x + w / 2, 102, w / 2 + 6, 3, 0.75);
  gradV(g, x, y + 5, w, 23, [PAL.wood[4], PAL.wood[3], PAL.wood[2]]);
  noise(g, x, y + 5, w, 23, PAL.wood[1], 0.05, 9);
  for (let i = 0; i < 3; i++) {
    const px0 = x + 3 + i * 15;
    frameRect(g, px0, y + 9, 13, 14, PAL.wood[1]);
    hline(g, px0 + 1, y + 10, 11, PAL.wood[5]); vline(g, px0 + 1, y + 10, 12, PAL.wood[5]);
    hline(g, px0 + 1, y + 22, 12, PAL.wood[2]);
  }
  vline(g, x, y + 5, 23, PAL.wood[5]); vline(g, x + w - 1, y + 5, 23, PAL.wood[1]);
  rect(g, x, y + 25, w, 3, PAL.ink[2]); hline(g, x, y + 25, w, PAL.metal[3]);
  rect(g, x - 2, y, w + 4, 5, PAL.wood[5]); hline(g, x - 2, y, w + 4, PAL.wood[7]); hline(g, x - 2, y + 1, w + 4, PAL.wood[6]);
  hline(g, x - 2, y + 4, w + 4, PAL.wood[2]);
  rect(g, x + 7, y + 12, 36, 7, PAL.gold[5]); frameRect(g, x + 7, y + 12, 36, 7, PAL.gold[2]);
  microCenter(g, 'SEGURIDAD', x + 25, y + 13, PAL.ink[0]);
}
/** Objetos del mostrador (se pintan con el mostrador, delante de Celestino). Bajos: no le tapan el torso. */
function counterTop(g) {
  const y = CY;
  // buzón de sugerencias (izquierda)
  const bx = 158, by = CY - 12;
  ditherOverlay(g, bx + 1, by + 2, 14, 12, PAL.ink[0], 0.45);
  bevel(g, bx, by, 13, 12, PAL.red[3], PAL.red[5], PAL.red[1]);
  rect(g, bx + 2, by + 3, 9, 1, PAL.ink[0]);
  ditherOverlay(g, bx, by, 13, 4, PAL.paper[4], 0.55);
  rect(g, bx + 2, by + 6, 9, 5, PAL.paper[6]); microCenter(g, 'SUGER.', bx + 6, by + 7, PAL.ink[2]);
  // termo de 1994 y libro de firmas
  rect(g, 174, y - 9, 4, 9, PAL.green[3]); vline(g, 174, y - 9, 9, PAL.green[5]); rect(g, 174, y - 11, 4, 2, PAL.metal[5]);
  rect(g, 182, y - 2, 10, 2, PAL.paper[6]); hline(g, 182, y - 2, 10, PAL.red[4]);
  // radio del Mundial del 82 (derecha)
  const rx = 192, ry = y - 10;
  ditherOverlay(g, rx + 1, ry + 2, 12, 9, PAL.ink[0], 0.5);
  bevel(g, rx, ry, 12, 10, PAL.wood[3], PAL.wood[6], PAL.wood[1]);
  rect(g, rx + 1, ry + 1, 6, 6, PAL.ink[2]); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) px(g, rx + 2 + j * 2, ry + 2 + i * 2, PAL.metal[4]);
  rect(g, rx + 8, ry + 2, 3, 1, PAL.gold[5]); px(g, rx + 9, ry + 5, PAL.red[5]); px(g, rx + 8, ry + 7, PAL.metal[6]);
  line(g, rx + 10, ry, rx + 13, ry - 7, PAL.metal[6]);
  glow(g, 181, y - 2, 22, 5, PAL.crt[4], 0.07, 4);
}

// ------------------------------------------------------------------ ascensor (vestíbulo interior)
const EL = { x: 236, y: 38, w: 34, h: 60 };
function elevator(g) {
  const { x, y, w, h } = EL;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.ink[0], 0.5);
  rect(g, x - 2, y - 2, w + 4, h + 2, PAL.metal[1]);
  rect(g, x, y, w, h, PAL.metal[2]); frameRect(g, x, y, w, h, PAL.metal[1]);
  hline(g, x + 1, y + 1, w - 2, PAL.metal[6]); vline(g, x + 1, y + 1, h - 2, PAL.metal[5]);
  // indicador de planta: 0
  rect(g, x + 5, y + 3, 24, 7, PAL.ink[0]); frameRect(g, x + 5, y + 3, 24, 7, PAL.metal[4]);
  ['-1', '0', '1', '2'].forEach((s, i) => micro(g, s, x + 7 + i * 6, y + 4, i === 1 ? PAL.crt[5] : PAL.metal[3]));
  glow(g, x + 15, y + 6, 8, 5, PAL.crt[5], 0.2, 3);
  const dx = x + 3, dy = y + 12, dw = w - 6, dh = h - 12;
  paint(g, dx, dy, dw, dh, (xx, yy) => {
    const fx = (xx - dx) / dw;
    const streak = hash2(xx, yy >> 2, 2) < 0.18 ? 1 : 0;
    const base = fx < 0.5 ? fx * 2 : (1 - fx) * 2;
    return ditherPick(xx, yy, [PAL.metal[3], PAL.metal[4], PAL.metal[5], PAL.metal[6]], 0.25 + base * 0.45 + streak * 0.15 - (yy - dy) / dh * 0.15);
  });
  vline(g, dx + (dw >> 1) - 1, dy, dh, PAL.ink[0]); vline(g, dx + (dw >> 1), dy, dh, PAL.ink[1]);
  vline(g, dx, dy, dh, PAL.ink[1]); vline(g, dx + dw - 1, dy, dh, PAL.ink[1]);
  tintPoly(g, [[dx + 3, dy], [dx + 8, dy], [dx + 3, dy + 22], [dx, dy + 22]], '#ffffff', 0.12);
  // reflejo cálido del downlight en el acero
  glow(g, dx + 8, dy + 6, 6, 10, '#ffd890', 0.18, 3);
  rect(g, dx - 1, y + h - 1, dw + 2, 2, PAL.metal[5]);
  // botonera de llamada, a la derecha
  const px0 = x + w + 3, py0 = y + 22;
  bevel(g, px0, py0, 5, 14, PAL.metal[4], PAL.metal[6], PAL.metal[1]);
  ellipse(g, px0 + 2.5, py0 + 4, 1.5, 1.5, PAL.gold[6]); ellipse(g, px0 + 2.5, py0 + 9, 1.5, 1.5, PAL.metal[7]);
  // directorio de plantas sobre la botonera
  rect(g, px0 - 1, y - 2, 7, 18, PAL.ink[1]); frameRect(g, px0 - 1, y - 2, 7, 18, PAL.wood[4]);
  ['2', '1', '0', '-'].forEach((s, i) => micro(g, s, px0 + 1, y + i * 4 - 1 + 0, i === 2 ? PAL.gold[6] : PAL.paper[5]));
}

// ------------------------------------------------------------------ escalera a la Redacción (planta 1)
function stairs(g) {
  const x = 282, y = 38, w = 36, h = 60;
  rect(g, x - 2, y - 2, w + 4, h + 2, PAL.wood[0]);
  gradV(g, x, y, w, h, [PAL.ink[1], PAL.ink[2], PAL.metal[1]]);
  // peldaños que suben hacia la derecha (de 98 a 40)
  for (let i = 0; i < 7; i++) {
    const sx = x + i * 4, sy = y + h - 4 - i * 7;
    rect(g, sx, sy, w - i * 4, 3, PAL.red[3]); hline(g, sx, sy, w - i * 4, PAL.red[5]);
    rect(g, sx, sy + 3, w - i * 4, 4, PAL.wood[2]); hline(g, sx, sy + 3, w - i * 4, PAL.wood[4]);
    hline(g, sx, sy + 7, w - i * 4, PAL.ink[0]);
  }
  // pasamanos de latón
  line(g, x + 2, y + h - 22, x + 34, y + 4, PAL.gold[3], 2); line(g, x + 2, y + h - 24, x + 34, y + 2, PAL.gold[6]);
  for (const [bx, by] of [[x + 4, y + h - 24], [x + 18, y + h - 33], [x + 32, y + 6]]) vline(g, bx, by, 12, PAL.gold[3]);
  glow(g, x + 28, y + 10, 16, 14, PAL.gold[5], 0.25, 4);
  // cartel: REDACCIÓN · 1 (sobre el arranque de la escalera)
  const sx = 284, sy = 64;
  rect(g, sx, sy, 32, 12, PAL.crt[2]); frameRect(g, sx, sy, 32, 12, PAL.crt[4]);
  micro(g, 'REDAC.', sx + 2, sy + 2, PAL.crt[6]); micro(g, '1', sx + 27, sy + 2, PAL.gold[6]);
  for (let k = 0; k < 3; k++) hline(g, sx + 26 - k, sy + 8 + k, 1 + k * 2, PAL.gold[6]);   // flecha ↑
}

// ------------------------------------------------------------------ TORNOS (objetos: se ordenan con los personajes)
/** El torno de Bruno: alas del carril de atrás (abiertas con torno_abierto) + la bancada central con la pantallita LED. */
function drawTorno(g, view, t) {
  const open = !!view.flag('torno_abierto');
  wings(g, BANK[0], BANK[1], open);
  const c = cabinet(g, BANK[1], { led: open ? PAL.crt[5] : PAL.red[4] });
  // pantallita del lector, en la punta que mira a la calle
  const lx = c.x0 - 2, ly = c.top - 8;
  rect(g, lx + 3, ly + 7, 2, 2, PAL.metal[3]);
  rect(g, lx - 1, ly - 1, 9, 8, PAL.ink[0]); frameRect(g, lx - 1, ly - 1, 9, 8, PAL.metal[4]);
  const blink = open ? true : ((t || 0) % 1400) < 900;
  const col = open ? PAL.crt[5] : '#ff3a30';
  if (blink) {
    if (open) { px(g, lx + 1, ly + 3, col); px(g, lx + 2, ly + 4, col); px(g, lx + 3, ly + 3, col); px(g, lx + 4, ly + 2, col); px(g, lx + 5, ly + 1, col); }
    else for (let i = 0; i < 4; i++) { px(g, lx + 1 + i, ly + 1 + i, col); px(g, lx + 4 - i, ly + 1 + i, col); }
    glow(g, lx + 3, ly + 3, 9, 6, col, 0.3, 3);
  }
  // flecha verde/aspa roja pintada en el suelo del carril
  tintRect(g, BX(112) - 12, 111, 22, 2, open ? PAL.crt[4] : PAL.red[4], 0.18);
}
/** Carril de delante (fuera de servicio, siempre cerrado) + bancada delantera. Decorativo, delante de casi todo. */
function drawBancadaDelantera(g) {
  wings(g, BANK[1], BANK[2], false, PAL.teal[5]);
  // pasamanos de acero que une las bancadas: la línea de tornos se lee de la pared al borde de la pantalla
  for (const [d, c] of [[0, PAL.metal[7]], [1, PAL.metal[3]]]) line(g, Math.round(BX(118)), 118 - 30 + d, Math.round(BX(150)), 150 - 30 + d, c);
  const ym = (BANK[1].y + BANK[2].y - BANK[2].d) / 2;
  // cinta de FUERA DE SERVICIO cruzando el carril
  const x0 = Math.round(BX(ym)) - 9;
  for (let i = 0; i < 18; i++) rect(g, x0 + i, ym - 18 + (i >> 3), 1, 3, (i >> 1) % 2 ? PAL.gold[5] : PAL.ink[1]);
  rect(g, x0 + 3, ym - 26, 12, 7, PAL.paper[6]); frameRect(g, x0 + 3, ym - 26, 12, 7, PAL.red[3]);
  micro(g, 'NO', x0 + 6, ym - 25, PAL.red[3]);
  cabinet(g, BANK[2]);
}
function drawIbex(g, view, t) {
  const x = 162, y = 22, w = 32, h = 23;
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
  const x = 143, y = 101;
  plant(g, x, y, { size: 40, seed: 7, leaves: 22, potW: 13, leaf: PAL.leaf, pot: PAL.ink });
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
    rect: [106, 36, 28, 62], walkTo: [120, 108], face: 'up',
    sprites: {
      normal: () => {},
      default: () => {},
      // epílogo (8bis.2): Celestino tacha el cuadro de llaves — la línea de sucesión «enloquece»
      tachado: (g) => drawTachado(g),
    },
  },
  planta_plastico: { rect: [134, 56, 18, 46], walkTo: [143, 109], face: 'up', priority: 1, draw: (g, v, t) => drawFicus(g, v, t) },
  pantalla_ibex: { rect: [160, 20, 36, 28], walkTo: [181, 112], face: 'up', draw: (g, v, t) => drawIbex(g, v, t) },
  altavoz_ibex: { rect: [198, 23, 15, 18], walkTo: [198, 110], face: 'up', priority: 1 },
  buzon_sugerencias: { rect: [157, 65, 15, 14], walkTo: [165, 111], face: 'up', priority: 1 },
  radio_celestino: {
    rect: [191, 67, 15, 12], walkTo: [198, 111], face: 'up', priority: 1,
    layer: 'sorted', zy: 104, prop: true,     // el mostrador tapa las piernas de Celestino: se pinta siempre
    draw: (g) => { drawCounter(g); counterTop(g); },
  },
  // la línea de tornos: el hotspot cubre el carril de Bruno y la bancada central; Bruno se acerca por el lado de la calle
  torno: {
    poly: [[204, 74], [238, 74], [250, 124], [212, 124]], walkTo: [201, 112], face: 'right',
    layer: 'sorted', zy: 124, draw: (g, v, t) => drawTorno(g, v, t),
  },
  torno_bancada: { rect: [226, 108, 36, 36], layer: 'sorted', zy: 145, prop: true, draw: (g) => drawBancadaDelantera(g) },
  logo_pared: { rect: [228, 14, 80, 20], walkTo: [204, 108], face: 'right' },
  ascensor_vestibulo: { rect: [234, 36, 38, 62], walkTo: [253, 109], face: 'up' },
  vestibulo_a_redaccion: { rect: [280, 36, 38, 62], walkTo: [300, 109], face: 'right' },
  celestino: { at: [181, 99, 'down'], walkTo: [181, 112], face: 'up' },
  evaristo_salvedad: { at: [196, 113, 'left'], walkTo: [186, 118], face: 'right' },
};

// Epílogo (§7.5, sábado 6:00): sitios del reparto del amanecer (los usa content/escenas/final.js). Rubén junto al
// organigrama mirando la luz de la calle; Íñigo y Gervasio salen del ascensor (`from`, detrás de los tornos, ya abiertos),
// cruzan el torno y se paran ante el mostrador; Gervasio se va por la puerta de la calle (`salida`). Bruno espera entre el
// cuadro de llaves y el organigrama; el fardo de periódicos llega junto al torno, del lado de la calle.
const epilogo = {
  ruben: [64, 116, 'right'],
  bruno: [112, 124, 'left'],
  inigo_sinergia: { from: [253, 110, 'left'], at: [150, 118, 'right'] },
  gervasio_acta: { from: [258, 112, 'left'], at: [200, 124, 'left'], salida: [30, 124] },
  salida: [10, 118],
  periodicos: [186, 121],
};

export default {
  room: 'vestibulo',
  epilogo,
  width: W,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  // `entrada` (lado de la calle) y `interior` (ascensor y escalera) solo se unen por el carril del torno, y solo con el
  // torno abierto (walkbox condicional: el motor evalúa `when` al entrar y en cada cambio de flag).
  walkboxes: [
    { id: 'entrada', poly: [[6, 104], [206, 104], [229, 142], [2, 142]] },
    { id: 'interior', poly: [[234, 104], [314, 104], [318, 142], [257, 142]] },
    { id: 'paso_torno', when: 'torno_abierto', poly: [[198, 107], [242, 107], [247, 117], [200, 117]] },
  ],
  entries: { inicio: [38, 118, 'right'], pecera: [296, 112, 'left'], cpd: [253, 110, 'down'], ascensor: [253, 110, 'down'] },
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
