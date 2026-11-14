// SALA `vestibulo` — ARTE Y GEOMETRÍA (REDISEÑO P1, docs/GUIA_REDISENO.md §3, §4, §10, §11).
// Vestíbulo nocturno de elContable.es (planta 0). De izquierda a derecha:
//   ENTRADA   (x 0-152)   mármol claro: puerta de la calle (noche / amanecer), organigrama, cuadro de llaves, ficus.
//   CONTROL   (x 154-218) pizarra con franja de seguridad: mostrador BAJO de Celestino, Ibex, altavoz, cartel colgado.
//   TORNOS    (diagonal)  tres bancadas de acero con alas de cristal; el carril de atrás es el de Bruno.
//   NÚCLEO    (x 224-320) moqueta roja detrás de los tornos: ascensor «0» + escalera que sube (kit.nucleo, FL = 94).
// Profundidad: fondo (paredes y lo que cuelga), plano medio (mostrador, ficus, paraguas, torno, cartel de suelo, fardo) y
// primer plano (bancada delantera de tornos, poste y cordón). Los estados se dibujan por el ESTADO del objeto
// (`puerta_calle`: noche | amanecer; `cuadro_plazas`: normal | tachado) o por el flag que la lógica pone ANTES de la
// línea que lo comenta (`torno_abierto`, `foto_en_organigrama`, `planta_empujada_n`).
import {
  PAL, mix, shade, rect, hline, vline, frameRect, line, px, poly, ellipse, paint, gradV, bevel, noise, hash2, rng,
  ditherOverlay, ditherPick, glow, vignette, shadowEllipse, ceiling, wallClock, plant, floorTiles, label, measureText,
} from '../../../engine/draw.js';
import * as kit from '../../lib/kit.js';
import { nucleoGeom } from '../../lib/edificio.js';

const W = 320, FL = 94;
const N = nucleoGeom('vestibulo', FL);
const INK = kit.INK;
const mc = (g, t, cx, y, c, o = {}) => kit.micro(g, t, cx, y, c, { align: 'center', ...o });

// ------------------------------------------------------------------ utilidades
function tintPoly(g, pts, color, alpha) { g.save(); g.globalAlpha = alpha; poly(g, pts, color); g.restore(); }
function tintRect(g, x, y, w, h, color, alpha) { g.save(); g.globalAlpha = alpha; rect(g, x, y, w, h, color); g.restore(); }
/** Haz de luz poligonal con bandas suaves (cada banda más pequeña y más intensa). */
function band(g, pts, color, alpha, n = 4) {
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  for (let i = 0; i < n; i++) {
    const k = 1 - i / n * 0.6;
    tintPoly(g, pts.map(p => [cx + (p[0] - cx) * k, cy + (p[1] - cy) * k]), color, alpha / n);
  }
}
const isDawn = (view) => !!(view && view.objState && view.objState('puerta_calle') === 'amanecer');

// ------------------------------------------------------------------ geometría de los tornos (diagonal)
const BX = (y) => 216 + (y - 97) * 0.6;           // eje de la línea de tornos en el suelo (x en función de la profundidad)
const BANK = [{ y: 106, d: 5, L: 24, H: 20 }, { y: 124, d: 6, L: 27, H: 22 }, { y: 146, d: 7, L: 30, H: 24 }];
const NOGAL = [PAL.wood[1], PAL.wood[2], PAL.wood[3], PAL.wood[2]];
const VERDE = kit.PLANTA['0'];

// ------------------------------------------------------------------ puerta de la calle (objeto con ESTADO: noche | amanecer)
const DOOR = { x: 4, y: 28, w: 36, h: 66 };
const DOOR_CV = {};
/** La puerta (cristal, cielo, edificio, marco) se pinta una vez por estado en un lienzo; cada fotograma solo suma la lluvia. */
function drawDoor(g, view, t) {
  const dawn = isDawn(view);
  const { x, y, w, h } = DOOR;
  const key = dawn ? 'a' : 'n';
  if (typeof document !== 'undefined') {
    let cv = DOOR_CV[key];
    if (!cv) {
      cv = DOOR_CV[key] = document.createElement('canvas'); cv.width = w + 8; cv.height = h + 12;
      const cg = cv.getContext('2d'); cg.translate(-(x - 4), -(y - 6));
      drawDoorBody(cg, dawn);
    }
    g.drawImage(cv, x - 4, y - 6);
  } else drawDoorBody(g, dawn);
  if (!dawn) {
    const ix = x + 2, iy = y + 1, iw = w - 4, ih = h - 1;
    g.save(); g.beginPath(); g.rect(ix, iy, iw, ih); g.clip();
    for (let i = 0; i < 24; i++) {
      const sp = 28 + (i * 7) % 23;
      const yy = ((t || 0) / 1000 * sp + i * 17) % (ih + 8) - 4;
      g.fillStyle = i % 4 === 0 ? '#c8e0f4' : '#7ea8d0';
      g.fillRect(ix + 1 + ((i * 53) % (iw - 2)), Math.floor(iy + yy), 1, 3);
    }
    g.restore();
  }
}
function drawDoorBody(g, dawn) {
  const { x, y, w, h } = DOOR;
  // marco de acero de la puerta doble
  rect(g, x - 2, y - 3, w + 4, h + 3, PAL.metal[1]);
  rect(g, x - 1, y - 2, w + 2, h + 2, PAL.metal[3]);
  vline(g, x - 1, y - 2, h + 2, PAL.metal[5]); hline(g, x - 1, y - 2, w + 2, PAL.metal[5]);
  const ix = x + 2, iy = y + 1, iw = w - 4, ih = h - 1;
  // la calle: noche con farola naranja / amanecer rosa y dorado
  paint(g, ix, iy, iw, ih, (xx, yy) => {
    const tt = (yy - iy) / ih;
    if (dawn && tt < 0.62) return ditherPick(xx, yy, [PAL.night[3], PAL.purple[4], PAL.dusk[3], PAL.dusk[5], PAL.dusk[6], PAL.dusk[7]], Math.pow(tt / 0.62, 0.9));
    if (tt < 0.62) return ditherPick(xx, yy, [PAL.night[0], PAL.night[1], PAL.night[2], PAL.purple[2], PAL.dusk[2]], Math.pow(tt / 0.62, 1.6));
    const u = (tt - 0.62) / 0.38;
    const lamp = Math.max(0, 1 - Math.abs(xx - (ix + 22)) / 16);
    if (dawn) return ditherPick(xx, yy, [PAL.dusk[3], PAL.dusk[5], PAL.dusk[6], PAL.dusk[7]], 0.3 + u * 0.35 + lamp * 0.1);
    return ditherPick(xx, yy, [PAL.ink[2], PAL.night[1], PAL.dusk[2], PAL.dusk[4]], 0.15 + u * 0.2 + lamp * 0.55 * (1 - u * 0.4));
  });
  
  // edificio de enfrente
  rect(g, ix, iy + 16, 12, 30, dawn ? PAL.purple[3] : PAL.purple[1]); rect(g, ix + 12, iy + 24, 9, 22, dawn ? PAL.purple[2] : PAL.purple[0]); rect(g, ix + 21, iy + 12, 11, 34, dawn ? PAL.purple[3] : PAL.purple[1]);
  if (dawn) { glow(g, ix + 17, iy + 22, 24, 16, '#fff0b0', 0.7, 6); ellipse(g, ix + 17, iy + 23, 5, 4, '#fff8d8'); }
  const r = rng(77);
  for (let k = 0; k < 12; k++) {
    const wx = ix + 1 + Math.floor(r() * 29), wy = iy + 18 + Math.floor(r() * 26);
    if (hash2(wx, wy, 5) < (dawn ? 0.12 : 0.6)) rect(g, wx, wy, 2, 2, r() < 0.7 ? PAL.gold[4] : PAL.teal[6]);
  }
  // farola (de noche)
  const lx = ix + 22;
  vline(g, lx, iy + 8, 38, PAL.ink[0]); hline(g, lx - 3, iy + 8, 4, PAL.ink[0]);
  rect(g, lx - 4, iy + 9, 3, 2, dawn ? PAL.metal[4] : PAL.gold[6]);
  if (!dawn) { glow(g, lx - 3, iy + 10, 16, 14, '#ff9a3c', 0.5, 6); glow(g, lx - 3, iy + 10, 5, 4, '#ffd890', 0.7, 3); }
  // asfalto
  for (let k = 0; k < 7; k++) hline(g, lx - 5 + (k % 3), iy + 47 + k * 2, 5 - (k >> 2), dawn ? PAL.dusk[7] : (k % 2 ? PAL.dusk[6] : PAL.dusk[5]));
  // travesaños, barras antipánico, brillo
  rect(g, ix + (iw >> 1) - 1, iy, 2, ih, PAL.metal[2]); vline(g, ix + (iw >> 1) - 1, iy, ih, PAL.metal[5]);
  rect(g, ix, iy + 34, iw, 2, PAL.metal[3]); hline(g, ix, iy + 34, iw, PAL.metal[6]);
  rect(g, ix, iy, iw, 2, PAL.metal[2]);
  rect(g, ix, iy + ih - 5, iw, 5, PAL.metal[2]); hline(g, ix, iy + ih - 5, iw, PAL.metal[5]);
  for (const hx of [ix + (iw >> 1) - 4, ix + (iw >> 1) + 3]) { rect(g, hx, iy + 20, 2, 12, PAL.metal[6]); vline(g, hx, iy + 20, 12, PAL.metal[7]); vline(g, hx + 1, iy + 20, 12, PAL.metal[3]); }
  tintPoly(g, [[ix + 3, iy + 2], [ix + 9, iy + 2], [ix + 1, iy + 30], [ix - 2, iy + 30]], '#ffffff', dawn ? 0.2 : 0.10);
  tintPoly(g, [[ix + 20, iy + 2], [ix + 24, iy + 2], [ix + 16, iy + 30], [ix + 13, iy + 30]], '#ffffff', dawn ? 0.16 : 0.07);
  // vinilo del horario, entero
  kit.micro(g, 'CIERRE', ix + 3, iy + 5, PAL.paper[7], { sombra: PAL.night[0] });
  kit.micro(g, '21:00', ix + 3, iy + 12, PAL.paper[7], { sombra: PAL.night[0] });
  // gotas (solo con lluvia) y lluvia animada tras el cristal
  if (!dawn) {
    const rr = rng(5);
    for (let k = 0; k < 20; k++) {
      const dx = ix + 1 + Math.floor(rr() * (iw - 2)), dy = iy + 2 + Math.floor(rr() * (ih - 10));
      px(g, dx, dy, '#9fc4e6'); if (k % 3 === 0) { px(g, dx, dy + 1, '#7ea8d0'); px(g, dx, dy + 2, '#5a7fb0'); }
    }
  } else {
    // el cristal seco: solo unas gotas viejas y el reflejo del sol
    px(g, ix + 6, iy + 14, '#fff0d0'); px(g, ix + 7, iy + 15, '#fff0d0'); px(g, ix + 26, iy + 24, '#fff0d0');
  }
  // cenefa de latón en el umbral
  rect(g, x - 2, FL - 2, w + 4, 2, PAL.gold[2]); hline(g, x - 2, FL - 2, w + 4, PAL.gold[5]);
  kit.cantoVivo(g, x - 2, y - 3, w + 4, h + 3);
}

// ------------------------------------------------------------------ organigrama (frame fijo; la foto en VACANTE es el estado)
const ORG = { x: 51, y: 28, w: 54, h: 62 };
function vacanteSlot(g, vx, vy, foto, t, drop = 0) {
  rect(g, vx, vy, 24, 11, PAL.paper[7]);
  for (let i = 0; i < 24; i += 2) { px(g, vx + i, vy, PAL.red[3]); px(g, vx + i, vy + 10, PAL.red[3]); }
  for (let i = 0; i < 11; i += 2) { px(g, vx, vy + i, PAL.red[3]); px(g, vx + 23, vy + i, PAL.red[3]); }
  if (foto) {
    // la foto del becario: 8×9 con borde blanco, chicle rosa, y un resplandor de «consto» que late
    const pulse = 0.22 + 0.1 * Math.sin((t || 0) / 380);
    glow(g, vx + 6, vy + 6, 14, 9, '#fff4c8', pulse, 4);
    // [P1] E2 L5: con `drop` la foto ha resbalado (1 px, un centímetro); el chicle se queda donde estaba, estirado
    const fy = vy + drop;
    rect(g, vx + 1, fy + 1, 8, 9, '#ffffff');
    rect(g, vx + 2, fy + 2, 6, 7, PAL.blue[6]);
    rect(g, vx + 3, fy + 2, 4, 2, PAL.wood[3]); rect(g, vx + 3, fy + 4, 4, 3, PAL.skin[5]); px(g, vx + 4, fy + 5, PAL.ink[1]); px(g, vx + 6, fy + 5, PAL.ink[1]);
    rect(g, vx + 2, fy + 7, 6, 2, PAL.blue[3]);
    px(g, vx + 0, vy + 0, '#f2a0c8'); px(g, vx + 1, vy + 0, '#f2a0c8'); px(g, vx + 0, vy + 1, '#f2a0c8');           // el chicle
    if (drop) px(g, vx + 1, vy + 1, '#f2a0c8');
    kit.micro(g, 'VACANTE', vx + 11, vy + 3, PAL.crt[2]);
  } else {
    rect(g, vx + 2, vy + 2, 7, 8, PAL.paper[4]);
    ditherOverlay(g, vx + 2, vy + 2, 7, 8, PAL.paper[2], 0.5);
    kit.micro(g, '?', vx + 4, vy + 3, PAL.paper[1]);
    kit.micro(g, 'VACANTE', vx + 11, vy + 3, PAL.red[4]);
  }
}
const VAC = { x: ORG.x + 15, y: ORG.y + 49 };
function organigrama(g) {
  const { x, y, w, h } = ORG;
  ditherOverlay(g, x + 2, y + 3, w, h, PAL.ink[0], 0.55);
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[2]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[1]);
  hline(g, x - 1, y - 1, w + 2, PAL.wood[6]); vline(g, x - 1, y - 1, h + 2, PAL.wood[5]);
  gradV(g, x, y, w, h, [PAL.paper[6], PAL.paper[5], PAL.paper[4]]);
  ditherOverlay(g, x, y + h - 14, w, 14, PAL.paper[2], 0.14);
  mc(g, 'ORGANIGRAMA', x + w / 2, y + 2, PAL.ink[2]);
  hline(g, x + 3, y + 8, w - 6, PAL.paper[2]);
  const faces = [PAL.skin[2], PAL.skin[3], PAL.skin[4], PAL.skin[5], PAL.skin[1]];
  const hairs = [PAL.ink[1], PAL.wood[2], PAL.wood[5], PAL.gold[4], PAL.metal[5], PAL.red[3]];
  const rows = [[1, 10], [3, 15], [6, 20], [9, 25], [10, 30]];
  const pos = rows.map(([cnt, ry]) => {
    const gap = (w - 4) / cnt;
    return Array.from({ length: cnt }, (_, i) => [Math.round(x + 2 + gap * i + gap / 2 - 2), ry + y]);
  });
  for (let r = 1; r < pos.length; r++) {
    for (let i = 0; i < pos[r].length; i++) {
      const par = pos[r - 1][Math.min(pos[r - 1].length - 1, Math.floor(i * pos[r - 1].length / pos[r].length))];
      const c = pos[r][i];
      const my = par[1] + 4;
      vline(g, par[0] + 1, par[1] + 3, my - par[1] - 2, PAL.metal[4]);
      hline(g, Math.min(par[0], c[0]) + 1, my, Math.abs(par[0] - c[0]) + 1, PAL.metal[4]);
      vline(g, c[0] + 1, my, c[1] - my, PAL.metal[4]);
    }
  }
  let n = 0;
  for (const row of pos) for (const [bx, by] of row) {
    rect(g, bx, by, 4, 3, PAL.paper[7]);
    rect(g, bx, by, 4, 1, hairs[n % hairs.length]);
    px(g, bx + 1, by + 1, faces[(n * 3) % faces.length]); px(g, bx + 2, by + 1, faces[(n * 3) % faces.length]);
    hline(g, bx, by + 2, 4, PAL.metal[3]);
    n++;
  }
  // rama inferior: «DISEÑO Y PRODUCTO»
  const cx = x + w / 2;
  vline(g, cx, y + 33, 2, PAL.metal[4]);
  rect(g, x + 9, y + 35, w - 18, 13, PAL.teal[7]); frameRect(g, x + 9, y + 35, w - 18, 13, PAL.teal[3]);
  mc(g, 'DISEÑO Y', cx, y + 37, PAL.ink[0]);
  mc(g, 'PRODUCTO', cx, y + 42, PAL.ink[0]);
  vline(g, cx, y + 48, 1, PAL.metal[4]);
  vacanteSlot(g, VAC.x, VAC.y, false, 0);
  // pósit añadido a mano con cinta americana: «+EVENTOS» (el organigrama se imprimió antes de que existieran)
  ditherOverlay(g, x + 22, y + 24, 31, 9, PAL.ink[0], 0.4);
  rect(g, x + 21, y + 23, 31, 9, '#f6e27a'); hline(g, x + 21, y + 31, 31, '#c8b450');
  rect(g, x + 19, y + 22, 5, 2, PAL.metal[4]); rect(g, x + 49, y + 22, 5, 2, PAL.metal[4]);
  kit.micro(g, '+EVENTOS', x + 22, y + 25, PAL.red[2]);
  kit.cantoVivo(g, x - 2, y - 2, w + 4, h + 4);
}
function drawVacante(g, view, t) {
  if (view.flag('foto_en_organigrama')) vacanteSlot(g, VAC.x, VAC.y, true, t, view.flag('vestibulo_foto_resbalo') ? 1 : 0);
}

// ------------------------------------------------------------------ cuadro de llaves + línea de sucesión
const CUA = { x: 110, y: 28, w: 24, h: 36 };
function cuadroPlazas(g) {
  const { x, y, w, h } = CUA;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.ink[0], 0.5);
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[3]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.wood[1]);
  hline(g, x - 1, y - 1, w + 2, PAL.wood[6]); vline(g, x - 1, y - 1, h + 2, PAL.wood[5]);
  paint(g, x, y, w, h, (xx, yy) => (hash2(xx, yy, 4) < 0.25 ? PAL.green[2] : PAL.green[3]));
  rect(g, x, y, w, 7, PAL.red[3]); hline(g, x, y, w, PAL.red[5]);
  mc(g, 'GARAJE', x + w / 2, y + 1, PAL.paper[7]);
  const tag = [PAL.gold[4], PAL.paper[6], PAL.red[4], PAL.teal[5]];
  for (let i = 0; i < 12; i++) {
    const cx = x + 3 + (i % 4) * 5, cy = y + 10 + Math.floor(i / 4) * 8;
    px(g, cx + 1, cy, PAL.gold[6]);
    if (i === 2) { px(g, cx + 1, cy + 1, PAL.ink[2]); continue; }                 // plaza 3: sin llave («ocupada por su ausencia»)
    rect(g, cx, cy + 1, 3, 2, PAL.metal[6]); px(g, cx, cy + 1, PAL.metal[7]);
    rect(g, cx, cy + 3, 4, 3, tag[i % tag.length]); px(g, cx + 1, cy + 4, PAL.ink[1]);
  }
  // hoja a lápiz con la línea de sucesión: tachones y nombres
  const sx = x + 1, sy = y + h + 3;
  ditherOverlay(g, sx + 1, sy + 1, 22, 20, PAL.ink[0], 0.4);
  rect(g, sx, sy, 22, 20, PAL.paper[6]);
  const r = rng(31);
  for (let ly = sy + 4; ly < sy + 19; ly += 3) {
    const len = 10 + Math.floor(r() * 9);
    hline(g, sx + 2, ly, len, PAL.metal[4]);
    if (r() < 0.5) hline(g, sx + 2, ly, len, PAL.red[3]);
  }
  kit.micro(g, 'PL. 3', sx + 2, sy + 1, PAL.ink[3]);
  px(g, sx + 11, sy - 1, PAL.red[5]); px(g, sx + 10, sy - 1, PAL.red[2]);
  kit.cantoVivo(g, x - 2, y - 2, w + 4, h + 4);
}
function drawTachado(g) {
  const { x, y, h } = CUA, sx = x + 1, sy = y + h + 3;
  // aspa grande de rotulador rojo sobre el cuadro y tachones en la hoja: cambia forma y color
  line(g, x + 1, y + 8, x + 22, y + 33, PAL.red[4], 2); line(g, x + 22, y + 8, x + 1, y + 33, PAL.red[4], 2);
  for (let k = 0; k < 4; k++) hline(g, sx + 2, sy + 4 + k * 3, 18, PAL.red[4]);
  rect(g, sx + 1, sy + 14, 20, 5, PAL.paper[7]); kit.micro(g, 'PL. 1', sx + 2, sy + 15, PAL.ink[2]);
  px(g, sx + 18, sy + 16, PAL.red[4]);
  glow(g, x + 12, y + 18, 18, 22, '#ff4030', 0.12, 4);
}

// ------------------------------------------------------------------ bancadas de torno y alas de cristal
/** Bancada de torno (caja de acero alargada en la dirección de paso) con base en la profundidad `b.y`. */
function cabinet(g, b, opts = {}) {
  const cx = Math.round(BX(b.y - b.d / 2)), x0 = cx - (b.L >> 1), x1 = x0 + b.L, top = b.y - b.H;
  shadowEllipse(g, cx + 2, b.y, (b.L >> 1) + 4, 2.5, 0.8);
  const sk = Math.round(b.d * 0.6);
  poly(g, [[x0 - sk, top - b.d + 1], [x1 - sk, top - b.d + 1], [x1, top], [x0, top]], (xx, yy) => ditherPick(xx, yy, [PAL.ink[1], PAL.ink[2], PAL.metal[1]], (yy - top + b.d) / b.d));
  hline(g, x0 - sk, top - b.d + 1, b.L, PAL.metal[4]);
  paint(g, x0, top, b.L, b.H, (xx, yy) => ditherPick(xx, yy, [PAL.metal[6], PAL.metal[5], PAL.metal[4], PAL.metal[3]], 0.15 + (yy - top) / b.H * 0.6 + ((xx * 3 + (yy >> 2)) % 9 === 0 ? 0.12 : 0)));
  hline(g, x0, top, b.L, PAL.metal[7]); vline(g, x0, top, b.H, PAL.metal[7]); vline(g, x1 - 1, top, b.H, PAL.metal[2]);
  rect(g, x0, b.y - 3, b.L, 3, PAL.ink[1]); hline(g, x0, b.y - 3, b.L, PAL.metal[2]);
  rect(g, x0 + 2, top + 3, b.L - 4, 3, PAL.ink[0]);
  px(g, x0 + 4, top + 4, opts.led || PAL.red[4]); px(g, x1 - 5, top + 4, opts.led || PAL.red[4]);
  poly(g, [[x1, top], [x1 + 2, top - 1], [x1 + 2, b.y - 1], [x1, b.y]], PAL.metal[2]);
  return { x0, x1, top, cx };
}
/** Alas de cristal de un carril, entre la bancada `a` (detrás) y `b` (delante). open = recogidas dentro de la bancada. */
function wings(g, a, b, open, tint = PAL.teal[6]) {
  const ya = a.y, yb = b.y - b.d, ym = (ya + yb) / 2;
  const leaf = (y0, y1) => {
    const x0 = BX(y0), x1 = BX(y1);
    const pts = [[x0, y0 - 28], [x1, y1 - 28], [x1, y1 - 7], [x0, y0 - 7]];
    tintPoly(g, pts, tint, 0.7);
    tintPoly(g, [[x0 + 0.5, y0 - 27], [x0 + 1.5, y0 - 27], [x0 + 1.5, y0 - 18], [x0 + 0.5, y0 - 18]], '#ffffff', 0.4);
    line(g, Math.round(x0), y0 - 28, Math.round(x1), y1 - 28, PAL.teal[7]);
    line(g, Math.round(x0), y0 - 7, Math.round(x1), y1 - 7, PAL.teal[3]);
    vline(g, Math.round(x1), y1 - 28, 21, PAL.teal[7]);
  };
  if (!open) { leaf(ya, ym - 0.5); leaf(yb, ym + 0.5); }
  else { leaf(ya, ya + 1.5); leaf(yb, yb - 1.5); }
}
function backGlass(g) {
  const x = BX(95), y0 = 95, y1 = BANK[0].y - BANK[0].d;
  tintPoly(g, [[x, 52], [BX(y1), y1 - 44], [BX(y1), y1 - 16], [x, y0 - 2]], PAL.teal[6], 0.35);
  vline(g, Math.round(x), 50, 46, PAL.metal[6]); vline(g, Math.round(x) + 1, 50, 46, PAL.metal[2]);
  rect(g, Math.round(x) - 1, 49, 4, 2, PAL.metal[7]);
}
function drawBankBack(g) {
  backGlass(g);
  for (const [d, c] of [[0, PAL.metal[7]], [1, PAL.metal[3]]]) line(g, Math.round(BX(95)), 95 - 44 + d, Math.round(BX(101)), 101 - 30 + d, c);
  cabinet(g, BANK[0]);
}

// ------------------------------------------------------------------ fondo estático
function paintBackground(g, view) {
  const dawn = isDawn(view);
  rect(g, 0, 0, W, 144, PAL.ink[1]);
  // ---- paredes por zona
  // ENTRADA + CONTROL: pared verde institucional con juntas de panel
  paint(g, 0, 15, 222, FL - 15, (xx, yy) => {
    const t = (yy - 15) / (FL - 15);
    let c = ditherPick(xx, yy, [PAL.green[4], PAL.green[3], PAL.green[2], PAL.green[1]], t);
    if (hash2(xx, yy, 3) < 0.035) c = PAL.green[1];
    return c;
  });
  for (let jx = 26; jx < 220; jx += 26) { vline(g, jx, 15, FL - 15, PAL.green[1]); vline(g, jx + 1, 15, FL - 15, PAL.green[5]); }
  // zócalo de mármol (ENTRADA) y de pizarra (CONTROL), con su filete verde de planta
  paint(g, 0, 80, 154, FL - 80, (xx, yy) => {
    const t = (yy - 80) / (FL - 80);
    const vein = Math.sin(xx * 0.31 + Math.sin(yy * 0.7 + xx * 0.05) * 2.2 + (xx >> 5) * 1.7);
    let c = ditherPick(xx, yy, [PAL.metal[6], PAL.metal[5], PAL.metal[4]], t * 0.9);
    if (vein > 0.93) c = PAL.metal[7];
    return c;
  });
  paint(g, 154, 80, 68, FL - 80, (xx, yy) => ditherPick(xx, yy, [PAL.green[2], PAL.green[1], PAL.green[0]], (yy - 80) / (FL - 80)));
  hline(g, 0, 80, 222, PAL.metal[7]); hline(g, 0, 81, 222, PAL.metal[5]);
  for (let px0 = 0; px0 < 154; px0 += 38) vline(g, px0, 82, FL - 82, PAL.metal[3]);
  kit.filete(g, 0, 222, 77, VERDE.c);
  rect(g, 0, FL - 3, 222, 3, PAL.ink[2]); hline(g, 0, FL - 3, 222, PAL.metal[4]);
  // NÚCLEO: pared de nogal con lamas verticales (más cálida, «de dentro»)
  paint(g, 222, 15, W - 222, FL - 15, (xx, yy) => {
    const lama = (xx - 222) % 6;
    const t = (yy - 15) / (FL - 15);
    let c = ditherPick(xx, yy, NOGAL, 0.2 + t * 0.6 + (lama === 0 ? 0.3 : 0));
    if (lama === 1) c = PAL.wood[3];
    if (hash2(xx, yy >> 3, 8) < 0.04) c = PAL.wood[1];
    return c;
  });
  kit.filete(g, 222, W, 77, '#d8a040');
  rect(g, 222, FL - 3, W - 222, 3, PAL.ink[1]); hline(g, 222, FL - 3, W - 222, PAL.wood[4]);
  // techo
  gradV(g, 0, 0, W, 14, [PAL.ink[0], PAL.ink[2], PAL.metal[1]]);
  hline(g, 0, 14, W, PAL.metal[3]); hline(g, 0, 15, W, PAL.ink[0]);
  ceiling(g, 0, 0, 216, 15, { spacing: 100, offset: 40, lampW: 40 });
  for (const lx of [236, 296]) { rect(g, lx - 4, 13, 9, 2, PAL.gold[6]); hline(g, lx - 4, 15, 9, PAL.gold[3]); }
  // ---- suelos por zona
  floorTiles(g, { x: 0, y: FL, w: W, h: 144 - FL, vpx: 160, vpy: 24, tile: 26, rowPx: 9, colors: [mix(PAL.metal[4], PAL.metal[5], 0.5), PAL.metal[4]], colors3: PAL.metal[3], grout: PAL.metal[2], far: PAL.ink[0], fade: 0.42 });
  // CONTROL: pizarra oscura con canto claro
  kit.zonaSuelo(g, 154, 218, FL, ['#2a3430', '#323e3a', '#3a4844'], { vpx: 160, vpy: 24, trama: 'baldosa', borde: true });
  // moqueta del vestíbulo interior (detrás de los tornos)
  poly(g, [[BX(94) + 12, FL], [W, FL], [W, 144], [BX(144) + 12, 144]], (xx, yy) => {
    const v = hash2(xx >> 1, yy, 5);
    return v < 0.1 ? PAL.red[0] : ditherPick(xx, yy, [PAL.red[1], PAL.red[2], PAL.purple[2]], 0.35 + (yy - FL) / 50 * 0.4);
  });
  line(g, Math.round(BX(94)) + 12, FL, Math.round(BX(144)) + 12, 144, PAL.gold[3]);
  for (let k = 0; k < 4; k++) { const yy = 102 + k * 10; hline(g, Math.round(BX(yy)) + 16, yy, W - Math.round(BX(yy)) - 20, PAL.red[3]); }
  // franja de seguridad pintada en el suelo, del lado de la calle, a lo largo de los tornos
  for (let yy = FL; yy < 144; yy++) {
    const xx = Math.round(BX(yy)) - 16 - Math.floor((yy - FL) / 16);
    rect(g, xx, yy, 2, 1, ((yy >> 2) & 1) ? PAL.gold[5] : PAL.ink[1]);
  }
  glow(g, 196, 112, 26, 6, PAL.metal[7], 0.2, 5);
  for (let k = 0; k < 24; k++) px(g, 176 + ((k * 37) % 40), 107 + ((k * 11) % 10), PAL.metal[5]);

  // ---- columnas (pilastras) que separan las zonas
  kit.pilastra(g, 43, 15, FL);
  kit.pilastra(g, 153, 15, FL);
  kit.pilastra(g, 216, 15, FL);

  // ---- luz de la calle sobre el suelo y la pared izquierda
  if (dawn) {
    // luz rasante del amanecer: haces dorados por el mármol, de la puerta hacia dentro
    // el sol entra por las dos hojas de la puerta y dibuja dos paralelogramos en el mármol (con la sombra del travesaño en medio)
    const sh = (x, y) => [x + (y - FL) * 1.5, y];
    for (const [xa, xb] of [[6, 21], [24, 38]]) {
      const P = [[xa, FL + 1], [xb, FL + 1], sh(xb, 140), sh(xa, 140)];
      band(g, P, '#ffcf80', 0.6, 5);
      tintPoly(g, [P[0], P[1], sh(xb, 112), sh(xa, 112)], '#fff6d0', 0.28);
    }
    band(g, [[4, FL], [40, FL], [128, 143], [8, 143]], '#ffcf80', 0.22, 4);
    band(g, [[44, 34], [104, 30], [104, FL - 2], [44, FL - 2]], '#ffd890', 0.16, 3);
    for (let k = 0; k < 22; k++) px(g, 20 + ((k * 53) % 150), 100 + ((k * 17) % 40), '#fff6d8');            // motas de polvo en el haz
  } else {
    band(g, [[4, FL], [44, FL], [96, 143], [-6, 143]], '#ff9a3c', 0.22, 5);
    band(g, [[44, 40], [92, 40], [92, FL - 2], [44, FL - 2]], '#ff9a3c', 0.06, 3);
    // charco de lluvia
    ellipse(g, 32, 118, 19, 4, (xx, yy, d) => ditherPick(xx, yy, [PAL.night[1], PAL.night[2], PAL.dusk[3], PAL.dusk[5]], 0.35 + (1 - d) * 0.45 - (yy - 118) * 0.04));
    ellipse(g, 32, 118, 19, 4, (xx, yy, d) => (d > 0.88 ? PAL.metal[2] : null));
  }
  // huellas mojadas hacia los tornos
  for (let k = 0; k < 11; k++) {
    const fx = 50 + k * 13 + (k % 2) * 2, fy = 111 + (k % 2) * 3;
    rect(g, fx, fy, 3, 1, dawn ? PAL.metal[3] : PAL.ink[2]); rect(g, fx + 1, fy + 1, 2, 1, dawn ? PAL.metal[2] : PAL.ink[3]);
  }
  // felpudo del umbral
  poly(g, [[8, 97], [38, 97], [45, 109], [1, 109]], (xx, yy) => (hash2(xx, yy, 6) < 0.3 ? PAL.ink[0] : PAL.ink[2]));
  line(g, 8, 97, 1, 109, PAL.red[2]); line(g, 38, 97, 45, 109, PAL.red[2]); hline(g, 1, 109, 45, PAL.red[2]);
  mc(g, 'BIENVENIDO', 23, 102, PAL.paper[4]);

  // ---- pared de la ENTRADA
  logo(g);
  organigrama(g);
  cuadroPlazas(g);
  wallClock(g, 146, 28, 7, 20 + 59 / 60);
  hangingSign(g);
  // ---- NÚCLEO (kit): ascensor «0», escalera que sube y sus placas, idénticos en las cuatro plantas
  kit.nucleo(g, 'vestibulo', FL, { sinSuelo: true });          // la pared del núcleo, la misma que en las otras plantas
  drawBankBack(g);

  // luz de los fluorescentes en la pared y el suelo (entrada); luz cálida del interior
  for (const cx of [60, 160]) {
    glow(g, cx, 40, 38, 26, '#dff0e4', 0.13, 5);
    glow(g, cx, 112, 40, 9, '#dff0e4', 0.08, 5);
  }
  glow(g, 266, 26, 40, 16, '#ffd890', dawn ? 0.12 : 0.22, 5);
  glow(g, 258, 110, 30, 8, '#ffcf80', 0.12, 4);
  glow(g, 300, 108, 22, 8, '#ffcf80', 0.10, 4);
  if (dawn) tintRect(g, 0, 15, 222, FL - 15, '#ffc890', 0.09);
  ditherOverlay(g, 0, FL - 3, W, 4, PAL.ink[0], 0.45);
  vignette(g, W, 144, dawn ? 0.3 : 0.5);
}

// ------------------------------------------------------------------ logo de letras metálicas (pared de la entrada)
const LOGO = { text: 'elContable.es', cx: 90, y: 14 };
function logo(g) {
  const t = LOGO.text, tw = measureText(t);
  const x = Math.round(LOGO.cx - tw / 2), y = LOGO.y;
  label(g, t, x + 1, y + 2, PAL.ink[0], { bold: true });
  label(g, t, x, y + 1, PAL.metal[3], { bold: true });
  label(g, t, x, y, PAL.metal[7], { bold: true });
  const cx = (s) => x + measureText(s);
  for (const s of ['el', 'elC', 'elCont', 'elContab', 'elContable.']) px(g, cx(s) + 1, y + 10, PAL.gold[5]);
  px(g, x + 2, y + 9, PAL.ink[0]); px(g, x + 2, y + 10, PAL.wood[0]);             // agujero sin tornillo en la primera «e»
  hline(g, x - 4, y + 12, tw + 8, PAL.wood[0]); hline(g, x - 4, y + 13, tw + 8, PAL.wood[5]);   // repisa
  rect(g, x + 5, y + 11, 1, 1, PAL.metal[6]);                                      // el tornillo, en la repisa
}

// ------------------------------------------------------------------ cartel colgado sobre los tornos (se conserva)
function hangingSign(g) {
  const x = 179, y = 50, w = 46, h = 15;
  vline(g, x + 5, 15, y - 15, PAL.metal[3]); vline(g, x + w - 6, 15, y - 15, PAL.metal[3]);
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.ink[0], 0.5);
  bevel(g, x, y, w, h, PAL.ink[2], PAL.metal[3], PAL.ink[0]);
  rect(g, x + 1, y + 1, w - 2, h - 2, '#0c2a1c');
  kit.micro(g, 'REDACCIÓN', x + 2, y + 3, PAL.paper[7]);
  kit.micro(g, 'ASCENSOR', x + 2, y + 9, PAL.paper[7]);
  for (const ay of [y + 6, y + 11]) { hline(g, x + 38, ay, 3, PAL.gold[6]); vline(g, x + 41, ay - 2, 5, PAL.gold[6]); vline(g, x + 42, ay - 1, 3, PAL.gold[6]); px(g, x + 43, ay, PAL.gold[6]); }
}

// ------------------------------------------------------------------ mostrador BAJO de Celestino (objeto sorted: tapa de la cintura abajo)
const CT = { x: 158, w: 50, y: 84 };
function drawCounter(g) {
  const { x, w, y } = CT;
  shadowEllipse(g, x + w / 2, 106, w / 2 + 6, 3, 0.75);
  gradV(g, x, y + 5, w, 18, [PAL.wood[4], PAL.wood[3], PAL.wood[2]]);
  noise(g, x, y + 5, w, 18, PAL.wood[1], 0.05, 9);
  for (let i = 0; i < 3; i++) {
    const px0 = x + 3 + i * 15;
    frameRect(g, px0, y + 7, 13, 11, PAL.wood[1]);
    hline(g, px0 + 1, y + 8, 11, PAL.wood[5]); vline(g, px0 + 1, y + 8, 9, PAL.wood[5]);
    hline(g, px0 + 1, y + 17, 12, PAL.wood[2]);
  }
  vline(g, x, y + 5, 18, PAL.wood[5]); vline(g, x + w - 1, y + 5, 18, PAL.wood[1]);
  rect(g, x, y + 20, w, 3, PAL.ink[2]); hline(g, x, y + 20, w, PAL.metal[3]);
  rect(g, x - 2, y, w + 4, 5, PAL.wood[5]); hline(g, x - 2, y, w + 4, PAL.wood[7]); hline(g, x - 2, y + 1, w + 4, PAL.wood[6]);
  hline(g, x - 2, y + 4, w + 4, PAL.wood[2]);
  // placa «SEGURIDAD» (entera: la fuente del juego si cabe, si no 3×5)
  rect(g, x + 1, y + 8, w - 2, 12, PAL.gold[5]); frameRect(g, x + 1, y + 8, w - 2, 12, PAL.gold[2]);
  kit.texto(g, 'SEGURIDAD', x + 1, y + 8, w - 2, 12, { color: INK });
}
/** Objetos del mostrador, delante de Celestino: bajos, para no taparle el torso. */
function counterTop(g, view) {
  const y = CT.y;
  // buzón de sugerencias: caja amarilla con ranura y una cartulina asomando (forma propia, 12×13)
  const bx = 182, by = y - 13;
  ditherOverlay(g, bx + 1, by + 2, 13, 12, PAL.ink[0], 0.45);
  rect(g, bx, by, 12, 13, '#e8b82c'); hline(g, bx, by, 12, '#fff0a0'); vline(g, bx, by, 13, '#fff0a0'); vline(g, bx + 11, by, 13, '#a07818'); hline(g, bx, by + 12, 12, '#a07818');
  rect(g, bx + 2, by + 3, 8, 2, INK);
  rect(g, bx + 4, by + 1, 5, 3, PAL.paper[7]); hline(g, bx + 4, by + 2, 4, PAL.metal[4]);                  // la cartulina asomando
  rect(g, bx + 2, by + 7, 8, 5, '#c89018'); frameRect(g, bx + 2, by + 7, 8, 5, '#a07818'); px(g, bx + 5, by + 9, '#fff0a0');
  rect(g, bx - 1, by + 8, 2, 3, '#c83a2a');                                                                  // la banderita roja
  kit.cantoVivo(g, bx, by, 12, 13);
  // libro de firmas y paquete de chicles de menta (abierto, con la tira asomando): Celestino mastica sin parar
  rect(g, 170, y - 2, 10, 2, PAL.paper[6]); hline(g, 170, y - 2, 10, PAL.red[4]);
  rect(g, 173, y - 5, 5, 4, PAL.teal[5]); hline(g, 173, y - 5, 5, PAL.teal[7]); px(g, 175, y - 3, PAL.red[4]);
  // radio del Mundial del 82: 14×11 con antena y dial
  const rx = 196, ry = y - 11;
  ditherOverlay(g, rx + 1, ry + 2, 13, 10, PAL.ink[0], 0.5);
  bevel(g, rx, ry, 13, 11, PAL.wood[3], PAL.wood[6], PAL.wood[1]);
  rect(g, rx + 1, ry + 1, 6, 7, PAL.ink[2]); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) px(g, rx + 2 + j * 2, ry + 2 + i * 2, PAL.metal[4]);
  rect(g, rx + 8, ry + 2, 4, 1, PAL.gold[5]); px(g, rx + 9, ry + 5, PAL.red[5]); px(g, rx + 8, ry + 8, PAL.metal[6]); px(g, rx + 11, ry + 8, PAL.metal[6]);
  line(g, rx + 11, ry, rx + 13, ry - 5, PAL.metal[6]);
  kit.cantoVivo(g, rx, ry, 13, 11);
  glow(g, 183, y - 2, 24, 5, PAL.crt[4], 0.07, 4);
}

// ------------------------------------------------------------------ pantalla del Ibex y altavoz con bufanda
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
  kit.micro(g, 'IBEX 35', x + 2, y + 1, PAL.crt[6]);
  kit.micro(g, T % 2 ? '+0.12%' : '-0.31%', x + w - 25, y + h - 6, T % 2 ? PAL.crt[5] : '#ff6a50');
  ditherOverlay(g, x, y, w, 5, '#ffffff', 0.06);
  // LED de borde verde/rojo (el color del último movimiento)
  const led = T % 2 ? PAL.crt[5] : '#ff4a38';
  hline(g, x - 2, y + h + 1, w + 4, led); px(g, x + w + 2, y + h - 1, led);
  glow(g, x + w / 2, y + h / 2 + 6, 26, 16, PAL.crt[4], 0.10, 4);
  kit.cantoVivo(g, x - 2, y - 2, w + 4, h + 4);
}
function drawAltavoz(g) {
  const x = 198, y = 28;
  ditherOverlay(g, x + 1, y + 2, 16, 15, PAL.ink[0], 0.5);
  bevel(g, x, y, 16, 15, PAL.metal[5], PAL.metal[7], PAL.metal[2]);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) px(g, x + 3 + j * 2, y + 3 + i * 2, PAL.metal[2]);       // rejilla
  rect(g, x + 2, y + 10, 12, 4, PAL.paper[7]); kit.micro(g, 'IBEX', x + 3, y + 9, PAL.ink[1]);
  // la bufanda a rayas verde/roja del Ibex: cubre la parte alta y cuelga por el lado (forma inconfundible)
  const sc = [PAL.leaf[5], PAL.red[4]];
  for (let i = 0; i < 16; i++) rect(g, x + i, y - 2, 1, 5, sc[(i >> 1) % 2]);
  hline(g, x, y - 2, 16, PAL.paper[6]);
  for (let k = 0; k < 13; k++) rect(g, x + 11, y + 3 + k, 4, 1, sc[(k >> 1) % 2]);
  for (let k = 0; k < 4; k++) { vline(g, x + 11 + k, y + 16, 2, sc[k % 2]); }
  vline(g, x + 15, y + 3, 13, PAL.ink[2]);
  rect(g, x + 7, y - 7, 2, 5, PAL.metal[3]);                                                                   // el soporte de pared
  kit.cantoVivo(g, x, y - 2, 16, 20);
}

// ------------------------------------------------------------------ ficus de plástico (con micrófono si se ha empujado)
function drawFicus(g, view, t) {
  const pushed = (view.flag('planta_empujada_n') | 0) >= 1;
  const x = 147, y = 100;
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
    rect(g, mx - 3, my + 9, 13, 6, PAL.red[5]); kit.micro(g, 'SEG', mx - 2, my + 10, PAL.paper[7]);
    if (((t || 0) % 1200) < 700) { px(g, mx + 2, my - 1, '#ff4030'); glow(g, mx + 2, my - 1, 4, 3, '#ff4030', 0.5, 2); }
  }
}

// ------------------------------------------------------------------ paraguero y cartel de suelo mojado (plano medio, sin hotspot)
function drawParaguero(g) {
  const x = 52, y = 101;
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
function drawSueloMojado(g) {
  const x = 96, y = 112;
  shadowEllipse(g, x, y, 7, 2, 0.7);
  poly(g, [[x - 5, y - 18], [x + 5, y - 18], [x + 8, y], [x - 8, y]], (xx, yy) => ditherPick(xx, yy, [PAL.gold[5], PAL.gold[4], PAL.gold[3]], (xx - x + 8) / 16));
  poly(g, [[x - 4, y - 16], [x + 4, y - 16], [x + 6, y - 2], [x - 6, y - 2]], PAL.gold[5]);
  hline(g, x - 5, y - 18, 10, PAL.gold[6]);
  rect(g, x - 1, y - 13, 2, 2, PAL.ink[1]); line(g, x, y - 11, x + 2, y - 7, PAL.ink[1]); line(g, x + 2, y - 7, x - 1, y - 4, PAL.ink[1]);
  line(g, x, y - 10, x - 3, y - 8, PAL.ink[1]); line(g, x + 2, y - 7, x + 4, y - 4, PAL.ink[1]);
  hline(g, x - 4, y - 3, 9, PAL.night[3]);
}

// ------------------------------------------------------------------ TORNOS
/** Pantalla/lector del torno de Bruno (en la bancada de ATRÁS) + franja de luz del suelo del carril: cambian forma, color
 *  y luz con `torno_abierto` (alas recogidas + LED verde con visto + franja verde de 46×5 en el suelo). Capa 'back'. */
function drawTornoLuces(g, view, t) {
  const open = !!view.flag('torno_abierto');
  const c0 = { x0: Math.round(BX(BANK[0].y - BANK[0].d / 2)) - (BANK[0].L >> 1), top: BANK[0].y - BANK[0].H };
  // franja del suelo del carril (de la calle al interior): roja apagada / verde encendida
  const ya = 109, ha = 5;
  poly(g, [[BX(ya) - 34, ya], [BX(ya) + 28, ya], [BX(ya + ha) + 30, ya + ha], [BX(ya + ha) - 36, ya + ha]],
    (xx, yy) => (open ? ditherPick(xx, yy, [PAL.crt[2], PAL.crt[3], PAL.crt[4]], 0.5 + ((xx >> 2) & 1) * 0.2) : ditherPick(xx, yy, [PAL.red[1], PAL.red[2]], 0.3 + ((xx >> 3) & 1) * 0.3)));
  if (open) {
    glow(g, BX(111) - 6, 111, 44, 7, PAL.crt[4], 0.3, 4);
    for (let k = 0; k < 3; k++) { const ax = Math.round(BX(111)) - 24 + k * 9; px(g, ax, 111, PAL.crt[6]); px(g, ax - 1, 110, PAL.crt[6]); px(g, ax - 1, 112, PAL.crt[6]); }   // flechas →
  }
  // lector 10×9 en la bancada de atrás, mirando a la calle (el LED que Bruno ve)
  const lx = c0.x0 + 4, ly = c0.top - 11;                 // en un brazo sobre la bancada de ATRÁS, de cara a la calle
  rect(g, lx + 5, ly + 10, 2, 11, PAL.metal[3]); vline(g, lx + 5, ly + 10, 11, PAL.metal[6]);
  rect(g, lx - 1, ly - 1, 14, 12, PAL.ink[0]); frameRect(g, lx - 1, ly - 1, 14, 12, PAL.metal[4]);
  rect(g, lx, ly, 12, 10, open ? PAL.crt[1] : '#2a0808');
  const col = open ? PAL.crt[6] : '#ff3a30';
  const blink = open ? true : ((t || 0) % 1400) < 900;
  if (blink) {
    if (open) { for (let i = 0; i < 3; i++) { px(g, lx + 2 + i, ly + 5 + i, col); px(g, lx + 3 + i, ly + 5 + i, col); } for (let i = 0; i < 6; i++) { px(g, lx + 5 + i, ly + 7 - i, col); px(g, lx + 6 + i, ly + 7 - i, col); } }
    else for (let i = 0; i < 7; i++) { rect(g, lx + 2 + i, ly + 1 + i, 2, 1, col); rect(g, lx + 9 - i, ly + 1 + i, 2, 1, col); }
    glow(g, lx + 6, ly + 5, 16, 10, col, open ? 0.45 : 0.35, 3);
  }
  px(g, lx + 1, ly + 9, open ? PAL.crt[5] : PAL.red[4]); px(g, lx + 10, ly + 9, open ? PAL.crt[5] : PAL.red[4]);
}
/** Las alas de cristal del carril de Bruno + la bancada central. Alas extendidas (cerrado) o recogidas (abierto). */
function drawTorno(g, view) {
  const open = !!view.flag('torno_abierto');
  wings(g, BANK[0], BANK[1], open);
  cabinet(g, BANK[1], { led: open ? PAL.crt[5] : PAL.red[4] });
  kit.cantoVivo(g, 208, 76, 38, 6);
}
/** Carril de delante (fuera de servicio): cinta cruzada y cartel «AVERIADO» entero. Decorativo, delante de casi todo. */
function drawBancadaDelantera(g) {
  wings(g, BANK[1], BANK[2], false, PAL.teal[5]);
  for (const [d, c] of [[0, PAL.metal[7]], [1, PAL.metal[3]]]) line(g, Math.round(BX(118)), 118 - 30 + d, Math.round(BX(150)), 150 - 30 + d, c);
  cabinet(g, BANK[2]);
  // dos cintas amarillas y negras en aspa sobre el carril, y el cartel «AVERIADO» entero encima
  const lx0 = 226, ly0 = 100;
  for (let i = 0; i < 26; i++) {
    const s = (i >> 1) % 2 ? PAL.gold[5] : PAL.ink[1];
    rect(g, lx0 + i, ly0 + Math.round(i * 0.8), 1, 3, s);
    rect(g, lx0 + i, ly0 + 20 - Math.round(i * 0.8), 1, 3, s);
  }
  const cx = 217, cy = 107, cw = 46, ch = 12;
  ditherOverlay(g, cx + 1, cy + 1, cw, ch, PAL.ink[0], 0.5);
  rect(g, cx, cy, cw, ch, PAL.paper[7]); frameRect(g, cx, cy, cw, ch, PAL.red[3]);
  kit.texto(g, 'AVERIADO', cx, cy, cw, ch, { color: PAL.red[2] });
}

// ------------------------------------------------------------------ fardo de periódicos y caja de Íñigo (epílogo, 7.5)
function drawFardo(g) {
  const x = 159, y = CT.y;                                  // sobre el mostrador, delante de la cintura de Celestino
  shadowEllipse(g, x + 9, y + 1, 11, 2, 0.5);
  for (let i = 0; i < 5; i++) {
    const yy = y - (i + 1) * 2;
    rect(g, x + (i % 2), yy, 18, 2, i % 2 ? PAL.paper[4] : PAL.paper[5]);
    hline(g, x + (i % 2), yy + 1, 18, PAL.paper[2]);
  }
  rect(g, x + 1, y - 10, 16, 2, '#f8f2de');
  hline(g, x + 3, y - 10, 8, PAL.ink[2]); px(g, x + 13, y - 10, PAL.red[4]); px(g, x + 14, y - 10, PAL.red[4]);
  vline(g, x + 8, y - 10, 10, PAL.wood[3]); hline(g, x + 1, y - 5, 17, PAL.wood[3]);                          // el cordel
  glow(g, x + 9, y - 6, 18, 8, '#fff0c0', 0.12, 3);
}
/** La caja de cartón de Íñigo (api.sostener): pósits, matriz y portátil asomando, y la taza «MEJOR BECARIO». */
export function drawCajaInigo(g, x, y, s) {
  const bw = 14, bh = 10, bx = Math.round(x - bw / 2), by = Math.round(y - bh + 2);
  rect(g, bx, by, bw, bh, '#c8944c'); hline(g, bx, by, bw, '#e8b86c'); vline(g, bx, by, bh, '#e8b86c'); vline(g, bx + bw - 1, by, bh, '#8a5c2c'); hline(g, bx, by + bh - 1, bw, '#8a5c2c');
  rect(g, bx + 4, by + 3, 6, 2, '#a87430');                                                                   // el asa
  rect(g, bx + 1, by - 4, 5, 4, '#f2e27a'); rect(g, bx + 2, by - 6, 4, 3, '#f2a0c8');                          // pósits
  rect(g, bx + 7, by - 5, 6, 5, PAL.metal[5]); frameRect(g, bx + 7, by - 5, 6, 5, PAL.metal[2]);              // portátil
  rect(g, bx + 9, by - 8, 3, 3, PAL.paper[6]); px(g, bx + 10, by - 7, PAL.red[4]);                             // taza
}

/** [P1] El cruasán mordido de Ramírez (api.sostener, epílogo §9). */
export function drawCruasan(g, x, y) {
  const cx = Math.round(x), cy = Math.round(y);
  ellipse(g, cx, cy, 4, 2, '#c8843c'); ellipse(g, cx - 1, cy - 1, 3, 1, '#e8b060');
  px(g, cx - 3, cy + 1, '#a86a2c'); px(g, cx + 3, cy + 1, '#a86a2c');
  rect(g, cx + 2, cy - 2, 2, 2, '#1c1828');                                                                   // el mordisco
}

/** [P1] E2 §4.5: el periódico de Maripaz, abierto por la página 7 (api.sostener, epílogo). Con `banner`, el anuncio que
 *  dibuja a rotulador entre dos líneas (naranja de Comercial) y el rotulador en la mano. */
export function drawPeriodicoMaripaz(g, x, y, s, dir, banner = false) {
  const w = 13, h = 9, bx = Math.round(x - (dir === 'left' ? w - 3 : 3)), by = Math.round(y - h + 3);
  rect(g, bx, by, w, h, '#ece4cc'); vline(g, bx + (w >> 1), by, h, '#c8bea0');                                // doble página
  frameRect(g, bx, by, w, h, '#a89c80');
  hline(g, bx + 1, by + 1, 5, PAL.ink[1]); hline(g, bx + 1, by + 2, 4, PAL.ink[2]);                          // titular de la 7
  for (let i = 0; i < 3; i++) { hline(g, bx + 1, by + 4 + i * 2, 5, '#9a907a'); hline(g, bx + 7, by + 2 + i * 2, 5, '#9a907a'); }
  if (banner) {
    rect(g, bx + 1, by + 5, 5, 1, '#FF8A60'); px(g, bx + 1, by + 5, '#d0402a'); px(g, bx + 5, by + 5, '#d0402a');   // el banner, a rotulador
    vline(g, bx + w, by - 2, 4, '#d0402a'); px(g, bx + w, by + 2, PAL.ink[1]);                                   // el rotulador
  }
}

// ------------------------------------------------------------------ primer plano: poste y cordón de seguridad
function foreground(g) {
  const px0 = 9;
  // poste cromado con base redonda y cordón de terciopelo que sale del cuadro hacia la derecha
  shadowEllipse(g, px0, 138, 7, 2, 0.6);
  rect(g, px0 - 5, 136, 10, 3, PAL.metal[3]); hline(g, px0 - 5, 136, 10, PAL.metal[6]);
  rect(g, px0 - 1, 112, 3, 25, PAL.metal[5]); vline(g, px0 - 1, 112, 25, PAL.metal[7]); vline(g, px0 + 1, 112, 25, PAL.metal[2]);
  ellipse(g, px0, 111, 3, 3, (xx, yy, d) => (d > 0.6 ? PAL.metal[7] : PAL.metal[5]));
  for (let i = 0; i < 20; i++) { const yy = 114 + Math.round(Math.sin(i / 20 * Math.PI) * 5); px(g, px0 + 3 + i, yy, PAL.red[3]); px(g, px0 + 3 + i, yy + 1, PAL.red[1]); }
}

// ------------------------------------------------------------------ geometría
const layout = {
  puerta_calle: {
    rect: [4, 25, 40, 71], walkTo: [30, 110], face: 'left',
    sprites: { noche: (g, v, t) => drawDoor(g, v, t), amanecer: (g, v, t) => drawDoor(g, v, t), default: (g, v, t) => drawDoor(g, v, t) },
  },
  organigrama: { rect: [49, 26, 58, 34], walkTo: [78, 108], face: 'up', draw: (g, v, t) => drawVacante(g, v, t) },
  rama_diseno: { rect: [49, 60, 58, 32], walkTo: [80, 108], face: 'up' },
  cuadro_plazas: {
    rect: [108, 26, 28, 62], walkTo: [122, 108], face: 'up',
    sprites: { normal: () => {}, default: () => {}, tachado: (g) => drawTachado(g) },        // epílogo (8bis.2)
  },
  planta_plastico: { rect: [135, 52, 24, 49], walkTo: [147, 110], face: 'up', priority: 1, layer: 'sorted', zy: 101, cache: true, draw: (g, v, t) => drawFicus(g, v, t) },
  pantalla_ibex: { rect: [158, 18, 40, 30], walkTo: [181, 112], face: 'up', draw: (g, v, t) => drawIbex(g, v, t) },
  altavoz_ibex: { rect: [196, 20, 20, 24], walkTo: [200, 110], face: 'up', priority: 1, cache: true, draw: (g) => drawAltavoz(g) },
  buzon_sugerencias: { rect: [181, 70, 14, 15], walkTo: [186, 112], face: 'up', priority: 1 },
  radio_celestino: {
    rect: [194, 72, 16, 13], walkTo: [201, 112], face: 'up', priority: 1,
    layer: 'sorted', zy: 104, prop: true, cache: true, cachePad: 64,      // el mostrador tapa las piernas de Celestino: se pinta siempre
    draw: (g, v) => { drawCounter(g); counterTop(g, v); },
  },
  // la línea de tornos: el hotspot cubre el carril de Bruno y la bancada central; Bruno se acerca por el lado de la calle
  torno: {
    poly: [[204, 76], [238, 76], [250, 124], [212, 124]], walkTo: [207, 114], face: 'right',
    layer: 'sorted', zy: 124, draw: (g, v, t) => drawTorno(g, v, t),
  },
  torno_luces: { rect: [196, 72, 60, 48], layer: 'back', prop: true, draw: (g, v, t) => drawTornoLuces(g, v, t) },
  torno_bancada: { rect: [226, 108, 36, 36], layer: 'sorted', zy: 145, prop: true, draw: (g) => drawBancadaDelantera(g) },
  paraguero: { rect: [43, 70, 18, 32], layer: 'sorted', zy: 103, prop: true, cache: true, draw: (g) => drawParaguero(g) },
  cartel_suelo: { rect: [86, 94, 20, 20], layer: 'sorted', zy: 113, prop: true, cache: true, draw: (g) => drawSueloMojado(g) },
  fardo_periodicos: { rect: [157, 66, 22, 20], layer: 'sorted', zy: 105, draw: (g) => drawFardo(g) },
  logo_pared: { rect: [60, 13, 60, 17], walkTo: [74, 108], face: 'up' },
  // el NÚCLEO del kit: coordenadas del contrato (nucleoGeom, FL = 94)
  ascensor_vestibulo: { rect: N.ascensor.rect, walkTo: N.ascensor.walkTo, face: 'up' },
  vestibulo_a_redaccion: { rect: N.escaleras.sube.rect, walkTo: N.escaleras.sube.walkTo, face: N.escaleras.sube.face },
  // Celestino, tras su mostrador bajo (de cintura arriba); Bruno le habla desde la izquierda, de perfil
  celestino: { at: [170, 97, 'down'], walkTo: [138, 122], face: 'right' },
  evaristo_salvedad: { at: [196, 113, 'left'], walkTo: [186, 118], face: 'right' },
};

// Epílogo (§7.5, sábado 6:00): sitios del reparto del amanecer (los usa content/escenas/final.js). Rubén junto al
// organigrama mirando la luz de la calle; Íñigo y Maripaz salen del ascensor (`from`), cruzan el torno ya abierto y se
// paran ante el mostrador (a un lado: nadie tapa a Celestino); salen por la puerta de la calle (`salida`). Bruno
// espera entre el cuadro de llaves y el organigrama; el fardo de periódicos está sobre el mostrador y Bruno lo lee a un lado.
const epilogo = {
  ruben: [64, 116, 'right'],
  bruno: [112, 124, 'left'],
  inigo_sinergia: { from: [N.ascensor.entrada[0], N.ascensor.entrada[1], 'left'], at: [150, 118, 'right'] },
  // [P1] E2 §4.5 (fase B (5)): Gervasio ya no sale en el epílogo; su sitio, del ascensor al mostrador, es de Maripaz
  maripaz_remitido: { from: [N.ascensor.entrada[0], N.ascensor.entrada[1], 'left'], at: [188, 116, 'left'] },
  salida: [10, 118],
  periodicos: [150, 122],
  // [P1] plan §9: Ramírez entra por la puerta de la calle y sube por la escalera; Yoli baja por ella y sale a la calle
  ramirez: { from: [14, 120, 'right'], at: [92, 118, 'right'] },
  yoli_tendencias: { from: [N.escaleras.sube.entrada[0], N.escaleras.sube.entrada[1], 'left'], at: [176, 120, 'left'] },
};

export default {
  room: 'vestibulo',
  rediseno: true,
  epilogo,
  width: W,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  // `entrada` (lado de la calle) y `interior` (núcleo) solo se unen por el carril del torno, y solo con el torno abierto
  // (walkbox condicional). La entrada rodea el cartel de suelo mojado y el poste del primer plano.
  walkboxes: [
    { id: 'entrada', poly: [[6, 104], [86, 104], [86, 114], [106, 114], [106, 104], [206, 104], [229, 142], [24, 142], [24, 126], [2, 126], [2, 110]] },
    { id: 'interior', poly: [[234, 104], [314, 104], [318, 142], [257, 142]] },
    { id: 'paso_torno', when: 'torno_abierto', poly: [[198, 107], [242, 107], [247, 117], [200, 117]] },
  ],
  entries: { inicio: [38, 118, 'right'], pecera: N.escaleras.sube.entrada, cpd: N.ascensor.entrada, ascensor: N.ascensor.entrada },
  layout,
  dynamic: true,
  draw(g, view) { paintBackground(g, view); },
  foreground(g) { foreground(g); },
  overlay(g, view, t) {
    if (isDawn(view)) return;
    const k = Math.floor((t || 0) / 400) % 3;
    g.fillStyle = '#ffc080'; g.fillRect(24 + k * 6, 117, 2, 1); g.fillRect(34 - k * 4, 119, 1, 1);
  },
};
