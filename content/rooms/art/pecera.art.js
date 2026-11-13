// SALA `pecera` — ARTE Y GEOMETRÍA. Dueño: artista de fondos. Biblia: §3.2; adenda §3.3 y §11.3.
// 640×144 con scroll. De izquierda a derecha: puerta de cristal al vestíbulo · filas de mesas con sillas-chaqueta ·
// pantalla gigante de métricas · Infografía (Herminia) · Yoli · Bruno/Ramírez · cristalera de la Pajarera · Office ·
// cinta de carrocero (frontera) · rincón de Desarrollo (kanban, coro, semáforo) · ventana · Anselmo ·
// [ampliación a 800 px] bandeja de Diseño y Producto (la frontera de entregas) · puesto de Valentín Retícula (mesa
// blanca, flexo cálido, retícula, muestras de color y, en su monitor, la Pecera en miniatura con Bruno dentro) ·
// ascensor (botonera común) · escalera a la planta 2. La sala pasó de 640 a 800 px: lo de 0-598 no se ha movido.
//
// Objetos con estado/animación (se dibujan en su `draw`, leyendo flags): pantalla_metricas (cms_vivo), enchufe_pantalla,
// silla_ramirez (silla_libre), chaqueta_ramirez_hotspot, kanban (posit_descopeado), frontera_carrocero (acto 2/3,
// infografia_integrada), herminia_portatil (animada), figurantes_web (tecleo), coro_desarrollo (manos), semaforo_ruido
// (estado rojo/ambar/verde), bandeja_diseno (bandeja_diseno_abierta), pantalla_anselmo (ruben_encontrado / infografia_integrada).
import {
  PAL, rect, hline, vline, frameRect, px, line, poly, ellipse, paint, bevel, ditherOverlay, gradV, gradH,
  glow, shadowEllipse, ditherPick, hash2, rng, fadeRows, vignette, wall, baseboard, floorTiles, fluorescent,
  cityWindow, wallClock, mug, extinguisher, label, papers, bayer,
} from '../../../engine/draw.js';
import {
  tiny, postit, POSTIT, lcd, JACKETS, jacketOn, chairBack, deskFront, blinds, rainOnGlass, rainyGlassStatic, cable, personBack,
} from './lib-oficina.js';

const W = 800;
const DX = 164;            // la escalera (antes en 598) se desplaza 164 px a la derecha
const FL = 98;            // línea de suelo (la pared acaba aquí)
const DT = 79;            // altura de la tapa de las mesas
const KB_Y = 19;          // borde superior del kanban (tablero 42 px: acaba en y=61, encima del coro)
const VPX = 320, VPY = 30; // punto de fuga del suelo

/** x de una línea del suelo que sale de (xb, y=104) hacia el punto de fuga, evaluada en y */
const tapeX = (xb, y) => VPX + (xb - VPX) * (y - VPY) / (104 - VPY);

function glassWallPajarera(g) {
  const x = 372, y = 24, w = 38, h = 72;
  rect(g, x - 2, y - 2, w + 4, h + 2, PAL.metal[4]); hline(g, x - 2, y - 2, w + 4, PAL.metal[7]); vline(g, x - 2, y - 2, h + 2, PAL.metal[6]);
  vline(g, x + w + 1, y - 2, h + 2, PAL.metal[2]);
  paint(g, x, y, w, h, (xx, yy) => ditherPick(xx, yy, [PAL.wood[1], PAL.wood[2], PAL.gold[1], PAL.gold[2]], 0.15 + (yy - y) / h * 0.6 + 0.2 * (1 - Math.abs(xx - (x + w / 2)) / (w / 2))));
  glow(g, x + 22, y + 44, 16, 14, PAL.gold[5], 0.35);
  // mesa grande vista a través del cristal + una silueta de cartón pluma
  rect(g, x + 8, y + 44, 28, 3, PAL.wood[4]); rect(g, x + 8, y + 47, 28, 8, PAL.wood[2]);
  rect(g, x + 20, y + 28, 7, 16, PAL.ink[2]); ellipse(g, x + 23, y + 26, 3, 3, PAL.ink[2]);
  vline(g, x + 11, y, h, PAL.metal[4]); vline(g, x + 12, y, h, PAL.metal[2]);
  frameRect(g, x + 12, y + 2, w - 14, h - 2, PAL.metal[3]);
  g.save(); g.globalAlpha = 0.12; poly(g, [[x + 3, y + h], [x + 9, y + h], [x + 22, y], [x + 16, y]], '#ffffff'); poly(g, [[x + 24, y + h], [x + 27, y + h], [x + 36, y], [x + 33, y]], '#ffffff'); g.restore();
  blinds(g, x, y + 1, w, 26, { down: 24, color: PAL.paper });
  rect(g, x, y + 34, w, 8, PAL.teal[6]); ditherOverlay(g, x, y + 34, w, 8, '#ffffff', 0.35);
  hline(g, x, y + 34, w, PAL.teal[7]); hline(g, x, y + 41, w, PAL.teal[4]);
  tiny(g, 'DIRECCIÓN', x + (w >> 1), y + 36, PAL.teal[1], { align: 'center' });
  rect(g, x + 14, y + 44, 2, 9, PAL.metal[7]); vline(g, x + 15, y + 44, 9, PAL.metal[3]);
  rect(g, x - 2, y + h, w + 4, 2, PAL.metal[2]);
}

function officeDoor(g) {
  const x = 414, y = 28, w = 26, h = 68;
  rect(g, x - 3, y - 3, w + 6, h + 3, PAL.wood[1]);
  rect(g, x - 2, y - 2, w + 4, h + 2, PAL.wood[3]); hline(g, x - 2, y - 2, w + 4, PAL.wood[5]); vline(g, x - 2, y - 2, h + 2, PAL.wood[5]);
  gradH(g, x, y, w, h, [PAL.wood[5], PAL.wood[4], PAL.wood[3]]);
  paint(g, x, y, w, h, (xx, yy) => (hash2(xx, yy >> 2, 4) < 0.18 ? PAL.wood[3] : null));
  frameRect(g, x + 3, y + 21, w - 6, 15, PAL.wood[2]); hline(g, x + 4, y + 35, w - 8, PAL.wood[6]);
  frameRect(g, x + 3, y + 41, w - 6, 22, PAL.wood[2]); hline(g, x + 4, y + 62, w - 8, PAL.wood[6]);
  bevel(g, x + 2, y + 6, w - 4, 11, PAL.gold[4], PAL.gold[6], PAL.gold[2]);
  tiny(g, 'OFFICE', x + (w >> 1), y + 9, PAL.ink[1], { align: 'center' });
  rect(g, x + w - 6, y + 38, 3, 3, PAL.gold[3]); px(g, x + w - 6, y + 38, PAL.gold[6]);
  hline(g, x + 1, y + h - 1, w - 2, PAL.gold[5]);
  ditherOverlay(g, x, y + h - 3, w, 3, PAL.gold[4], 0.4);
}

/** Salida al vestíbulo (geografía, adenda §14 y problema E del director): la Redacción está en la PLANTA 1, así que
 *  aquí no hay una puerta a ras de suelo con el torno detrás, sino el hueco de la ESCALERA QUE BAJA a la planta 0:
 *  rellano a la altura del suelo, barandilla que se hunde hacia la izquierda, peldaños que bajan y se oscurecen, y el
 *  rótulo «↓ VESTÍBULO · PLANTA 0». Desde el vestíbulo se sube por la escalera «REDAC. 1» y se llega arriba de esta. */
function vestibuloDoor(g) {
  const x = 6, y = 26, w = 46, h = 70;
  // hueco en la pared (marco de acero) y caja de escalera en penumbra, más oscura cuanto más abajo
  rect(g, x - 3, y - 3, w + 6, h + 3, PAL.metal[2]);
  frameRect(g, x - 3, y - 3, w + 6, h + 3, PAL.metal[1]);
  hline(g, x - 2, y - 2, w + 4, PAL.metal[6]); vline(g, x - 2, y - 2, h + 2, PAL.metal[5]);
  paint(g, x, y, w, h, (xx, yy) => ditherPick(xx, yy, [PAL.ink[0], PAL.ink[1], PAL.teal[1], PAL.teal[2]], 0.75 - (yy - y) / h * 0.35 - (x + w - xx) / w * 0.35));
  // pared del fondo de la caja de escalera: zócalo que BAJA en diagonal (de derecha arriba a izquierda abajo)
  line(g, x + w - 1, y + 50, x, y + h - 2, PAL.teal[3], 1);
  // peldaños que bajan hacia la izquierda: cada uno más bajo, más estrecho y más oscuro
  for (let i = 0; i < 7; i++) {
    const sx = x + w - 10 - i * 6, sy = y + 48 + i * 3;
    const c = [PAL.metal[7], PAL.metal[6], PAL.metal[5], PAL.metal[4], PAL.metal[3], PAL.metal[2], PAL.ink[3]][i];
    rect(g, sx, sy, 9, 2, c); hline(g, sx, sy, 9, PAL.gold[i < 3 ? 5 : 3]); hline(g, sx, sy + 2, 9, PAL.ink[0]); vline(g, sx, sy + 3, 3, PAL.ink[1]);
  }
  // rellano a ras del suelo de la Pecera (el escalón de arriba), con su tira antideslizante amarilla
  rect(g, x + w - 14, y + h - 4, 14, 4, PAL.metal[5]); hline(g, x + w - 14, y + h - 4, 14, PAL.metal[7]);
  for (let k = 0; k < 14; k += 3) px(g, x + w - 14 + k, y + h - 2, PAL.gold[5]);
  // barandilla: pasamanos de madera que baja hacia la izquierda, con balaustres
  line(g, x + w - 2, y + 30, x + 2, y + 52, PAL.wood[5], 2); line(g, x + w - 2, y + 29, x + 2, y + 51, PAL.wood[7], 1);
  for (let k = 0; k < 5; k++) { const bx = x + w - 6 - k * 10; const by = Math.round(y + 31 + (x + w - 2 - bx) * 22 / (w - 4)); vline(g, bx, by + 1, Math.max(4, y + h - 2 - by - k * 3), PAL.metal[4]); }
  vline(g, x + w - 2, y + 29, h - 29, PAL.wood[4]); vline(g, x + w - 1, y + 29, h - 29, PAL.wood[2]);   // poste del arranque
  // luz que sube de abajo (el vestíbulo, iluminado) y el reflejo del pasamanos
  glow(g, x + 8, y + h - 4, 14, 8, PAL.gold[5], 0.18, 3);
  // rótulo colgado: flecha abajo + VESTÍBULO / PLANTA 0
  bevel(g, x - 2, y - 17, w + 4, 15, PAL.crt[2], PAL.crt[4], PAL.crt[0]);
  poly(g, [[x + 1, y - 10], [x + 8, y - 10], [x + 4, y - 5]], PAL.crt[6]); rect(g, x + 3, y - 15, 3, 5, PAL.crt[6]);
  tiny(g, 'VESTÍBULO', x + 28, y - 15, PAL.crt[6], { align: 'center' });
  tiny(g, 'PLANTA 0', x + 28, y - 9, PAL.crt[5], { align: 'center' });
}

function deskWithStation(g, x, w, kinds, seed, o = {}) {
  deskFront(g, x, DT, w, 21, { drawers: o.drawers ?? 'right' });
  kinds.forEach((k, i) => lcd(g, x + 3 + i * 20, DT - 18, 18, 14, { kind: k, seed: seed + i * 3 }));
  rect(g, x + 6, DT + 1, 12, 2, PAL.paper[2]); hline(g, x + 6, DT + 1, 12, PAL.paper[4]);
  px(g, x + 21, DT + 1, PAL.ink[2]); px(g, x + 22, DT + 1, PAL.ink[2]);
  if (kinds.length > 1) { rect(g, x + 26, DT + 1, 10, 2, PAL.paper[2]); hline(g, x + 26, DT + 1, 10, PAL.paper[4]); }
}

function drawFloorDetails(g) {
  const r = rng(77);
  for (let i = 0; i < 26; i++) {
    const x = 6 + Math.floor(r() * (W - 12)), y = 106 + Math.floor(r() * 36);
    ditherOverlay(g, x, y, 3 + Math.floor(r() * 5), 1 + Math.floor(r() * 2), PAL.ink[0], 0.35);
  }
  ellipse(g, 332, 118, 6, 2, (xx, yy, d) => (bayer(xx, yy) < 0.5 - d * 0.4 ? PAL.wood[1] : null));
  cable(g, 140, 101, 188, 112, 6, PAL.ink[0], 24);
  cable(g, 188, 112, 204, 100, 3, PAL.ink[0], 12);
  cable(g, 300, 100, 262, 108, 5, PAL.ink[1], 18);
}

// ------------------------------------------------------------------ fondo
function drawRoom(g) {
  gradV(g, 0, 0, W, 15, [PAL.ink[1], PAL.metal[1], PAL.metal[2]]);
  for (let x = 0; x < W; x += 40) vline(g, x, 0, 14, PAL.ink[0]);
  hline(g, 0, 6, W, PAL.ink[1]);
  hline(g, 0, 14, W, PAL.metal[1]);
  wall(g, 0, 15, W, 60, [PAL.green[3], PAL.green[4], PAL.green[5], PAL.green[6]], { seed: 5 });
  gradV(g, 0, 73, W, 25, [PAL.teal[5], PAL.teal[4], PAL.teal[3]]);
  for (let x = 0; x < W; x += 32) { vline(g, x, 75, 21, PAL.teal[2]); vline(g, x + 1, 75, 21, PAL.teal[5]); }
  hline(g, 0, 73, W, PAL.teal[6]); hline(g, 0, 74, W, PAL.teal[5]); hline(g, 0, 75, W, PAL.teal[2]);
  baseboard(g, 0, 94, W, 4, PAL.metal);
  floorTiles(g, { x: 0, y: FL, w: W, h: 46, vpx: VPX, vpy: VPY, tile: 24, rowPx: 9, colors: ['#566580', '#4a5872'], colors3: '#3e4a62', grout: '#2a3246', far: PAL.ink[1], fade: 0.4 });
  ditherOverlay(g, 0, FL, W, 4, PAL.ink[0], 0.5);
  drawFloorDetails(g);

  for (let x = 24; x < W; x += 96) fluorescent(g, x, 10, 44, true);
  for (let x = 24; x < W; x += 96) glow(g, x + 22, 20, 56, 26, '#e8fff0', 0.13);

  vestibuloDoor(g);
  extinguisher(g, 54, 96);
  cityWindow(g, 66, 20, 84, 36, { sky: 'night', seed: 14, blinds: true, blindsDown: 9, mullions: true });
  rainyGlassStatic(g, 66, 20, 84, 36, 5);

  deskWithStation(g, 60, 40, ['chart', 'bars'], 1);
  deskWithStation(g, 102, 40, ['dash', 'article'], 2);
  deskWithStation(g, 144, 56, ['chart', 'code'], 3, { drawers: 'left' });
  lcd(g, 184, DT - 18, 12, 14, { kind: 'chart', seed: 9 });
  chairBack(g, 78, 103, { jacket: JACKETS.navy });
  chairBack(g, 96, 105, { jacket: JACKETS.beige, turn: 1 });
  chairBack(g, 118, 103, { jacket: JACKETS.olive });
  chairBack(g, 136, 105, { jacket: JACKETS.burdeos });
  mug(g, 93, DT + 3, { color: PAL.teal });
  mug(g, 128, DT + 3, { color: PAL.paper, full: true });
  papers(g, 60, DT, 20, { n: 3, seed: 3 });
  postit(g, 63, DT - 17, POSTIT.y, { w: 6, h: 6 }); postit(g, 106, DT - 10, POSTIT.p, { w: 5, h: 5 });

  // regleta y cartel de NO DESENCHUFAR (el enchufe y su cable los dibuja el objeto)
  rect(g, 198, 87, 18, 4, PAL.metal[1]); hline(g, 198, 87, 18, PAL.metal[4]);
  // dos tiras de cinta de carrocero con rotulador, pegadas bajo la pantalla
  for (const [tx, ty, tw, txt, ink] of [[176, 55, 62, 'NO DESENCHUFAR', PAL.red[2]], [168, 62, 88, 'PANTALLA DE DIRECCIÓN', PAL.ink[2]]]) {
    ditherOverlay(g, tx + 1, ty + 1, tw, 7, PAL.shadow, 0.35);
    rect(g, tx, ty, tw, 7, PAL.paper[4]); hline(g, tx, ty, tw, PAL.paper[6]); hline(g, tx, ty + 6, tw, PAL.paper[2]);
    px(g, tx - 1, ty + 1, PAL.paper[4]); px(g, tx + tw, ty + 5, PAL.paper[4]);
    tiny(g, txt, tx + (tw >> 1), ty + 1, ink, { align: 'center' });
  }

  // Infografía: mesa de dibujo inclinada (tablero alto, con polvo en forma de regla); Herminia va encima (objeto)
  {
    const L = [PAL.paper[3], PAL.paper[4], PAL.paper[5], PAL.paper[6]];
    shadowEllipse(g, 240, 101, 28, 3, 0.7);
    // patas de tubo y travesaño
    for (const lx of [217, 262]) { rect(g, lx, 89, 2, 12, PAL.metal[4]); vline(g, lx, 89, 12, PAL.metal[7]); vline(g, lx + 1, 89, 12, PAL.metal[1]); }
    rect(g, 217, 94, 47, 2, PAL.metal[3]); hline(g, 217, 94, 47, PAL.metal[6]);
    rect(g, 235, 89, 4, 6, PAL.metal[3]);
    // tablero inclinado (trapecio: más ancho abajo)
    poly(g, [[222, 70], [258, 70], [266, 87], [214, 87]], (xx, yy) => ditherPick(xx, yy, [L[2], L[3], PAL.paper[7]], 0.1 + (yy - 70) / 17 * 0.6));
    ditherOverlay(g, 214, 70, 52, 17, PAL.paper[2], 0.14);                // polvo
    rect(g, 219, 79, 17, 3, PAL.paper[7]); rect(g, 220, 80, 15, 1, PAL.paper[6]);   // marca limpia de la regla
    for (let i = 0; i < 16; i += 3) px(g, 220 + i, 79, PAL.paper[3]);
    hline(g, 214, 87, 52, PAL.metal[6]); rect(g, 213, 87, 54, 2, PAL.metal[4]); hline(g, 213, 88, 54, PAL.metal[1]);   // canto/ranura de lápices
    line(g, 222, 70, 258, 70, PAL.metal[5]); hline(g, 222, 69, 36, PAL.metal[3]);
    // escuadra, lápices y goma en la ranura
    line(g, 248, 85, 261, 72, PAL.teal[5]); line(g, 261, 72, 261, 85, PAL.teal[3]);
    rect(g, 217, 85, 6, 2, PAL.red[4]); rect(g, 224, 86, 5, 1, PAL.gold[5]); rect(g, 255, 86, 3, 1, PAL.paper[7]);
    // lámpara articulada de dibujante
    line(g, 266, 87, 265, 78, PAL.metal[4]); line(g, 265, 78, 259, 73, PAL.metal[4]);
    poly(g, [[253, 70], [260, 71], [259, 75], [253, 74]], PAL.gold[3]); hline(g, 253, 70, 7, PAL.gold[5]);
  }
  chairBack(g, 227, 106, { jacket: JACKETS.camel, turn: 1 });
  chairBack(g, 247, 106, { jacket: JACKETS.black, turn: -1 });

  // Yoli
  deskFront(g, 266, DT, 36, 21, { drawers: 'right' });
  lcd(g, 267, DT - 19, 11, 15, { kind: 'chart', seed: 20 });
  lcd(g, 279, DT - 21, 14, 17, { kind: 'dash', seed: 21 });
  lcd(g, 294, DT - 19, 11, 15, { kind: 'bars', seed: 22 });
  postit(g, 270, DT - 17, POSTIT.y, { w: 8, h: 11, lines: false });
  tiny(g, 'KEY', 271, DT - 16, PAL.red[3]); tiny(g, 'WORD', 271, DT - 10, PAL.red[3]);
  rect(g, 296, DT - 4, 3, 5, PAL.blue[4]); rect(g, 296, DT - 6, 3, 2, PAL.paper[6]); px(g, 297, DT - 2, PAL.paper[7]);
  chairBack(g, 280, 103, { jacket: null, col: [PAL.red[0], PAL.red[1], PAL.red[2], PAL.red[3], PAL.red[4]] });

  // Bruno: monitor viejo, sin silla
  deskFront(g, 306, DT, 30, 21, { drawers: 'left', top: [PAL.wood[3], PAL.wood[4], PAL.wood[5]], body: [PAL.wood[1], PAL.wood[2], PAL.wood[3]] });
  {
    const x = 310, y = DT - 22;
    bevel(g, x, y, 22, 19, PAL.paper[3], PAL.paper[5], PAL.paper[1]);
    rect(g, x + 3, y + 3, 16, 12, PAL.ink[1]);
    gradV(g, x + 3, y + 3, 16, 12, [PAL.blue[4], PAL.blue[3]]);
    for (let ly = y + 5; ly < y + 14; ly += 2) hline(g, x + 4, ly, 6 + (ly % 5), PAL.blue[7]);
    rect(g, x + 4, y + 19, 14, 3, PAL.paper[2]); rect(g, x + 2, y + 21, 18, 1, PAL.paper[1]);
    px(g, x + 18, y + 17, PAL.crt[5]);
    postit(g, x + 17, y + 1, POSTIT.y, { w: 11, h: 11, lines: false });
    tiny(g, 'BRUNO', x + 18, y + 2, PAL.ink[2]); tiny(g, 'PELLIZCO', x + 18, y + 8, PAL.ink[2]);
  }
  rect(g, 311, DT + 1, 14, 2, PAL.paper[2]); hline(g, 311, DT + 1, 14, PAL.paper[4]);
  papers(g, 327, DT - 1, 8, { n: 2, seed: 8 });

  // Ramírez (mesa; silla y chaqueta son objetos)
  deskFront(g, 338, DT, 32, 21, { drawers: 'right' });
  // taza abandonada: costra de café de la crisis de la deuda (y un bloc debajo)
  rect(g, 354, DT - 2, 7, 2, PAL.paper[5]); hline(g, 354, DT - 2, 7, PAL.paper[7]);
  mug(g, 361, DT + 1, { color: PAL.paper });
  hline(g, 361, DT - 5, 5, PAL.wood[0]); px(g, 362, DT - 5, PAL.leaf[3]); px(g, 364, DT - 5, PAL.leaf[4]); px(g, 363, DT - 6, PAL.leaf[5]);
  px(g, 366, DT - 2, PAL.wood[2]); px(g, 367, DT - 1, PAL.wood[2]);
  ellipse(g, 364, DT + 2, 5, 1, (xx, yy, d) => (bayer(xx, yy) < 0.55 - d * 0.4 ? PAL.wood[2] : null));
  rect(g, 343, DT + 1, 12, 2, PAL.paper[2]);

  glassWallPajarera(g);
  officeDoor(g);
  wallClock(g, 354, 34, 7);

  // pizarra de keywords y pancarta BIENVENIDO
  rect(g, 262, 20, 40, 28, PAL.metal[5]); rect(g, 263, 21, 38, 26, PAL.paper[7]); hline(g, 262, 48, 40, PAL.metal[2]);
  tiny(g, 'KEYWORDS', 282, 23, PAL.blue[3], { align: 'center' });
  ['PENSIONES', 'IBEX', 'LLUVIA', 'FÚTBOL'].forEach((s, i) => tiny(g, s, 265, 31 + i * 6, [PAL.ink[3], PAL.red[4], PAL.blue[4], PAL.crt[3]][i]));
  line(g, 288, 32, 299, 44, PAL.red[4]);
  {
    const x = 304, y = 34;
    line(g, x, y, x + 36, y + 2, PAL.paper[3]);
    rect(g, x + 1, y + 1, 41, 9, PAL.paper[6]); frameRect(g, x + 1, y + 1, 41, 9, PAL.paper[3]);
    tiny(g, 'BIENVENIDO', x + 22, y + 3, PAL.red[3], { align: 'center' });
    poly(g, [[x + 36, y + 10], [x + 42, y + 10], [x + 40, y + 14]], PAL.paper[4]);
  }

  drawDesarrollo(g);

  for (const [x, y, rx] of [[80, 66, 30], [122, 66, 30], [170, 66, 32], [286, 64, 24], [330, 66, 18], [350, 66, 14], [520, 70, 30]]) glow(g, x, y, rx, 14, '#9fe8ff', 0.1);
  // charcos de luz en la moqueta: fluorescentes, cristal de la Pajarera, escalera, pantallas
  for (let x = 46; x < W; x += 96) glow(g, x, 124, 52, 9, '#e8fff0', 0.07, 4);
  glow(g, 391, 106, 26, 6, PAL.gold[5], 0.16, 4);
  glow(g, 620 + DX, 104, 22, 6, PAL.gold[5], 0.2, 4);
  glow(g, 214, 104, 40, 5, '#8ec8ff', 0.09, 3);
  glow(g, 120, 104, 40, 5, '#8ec8ff', 0.07, 3);
  fadeRows(g, 0, FL, W, 8, PAL.ink[0], 0.35, 0, 4);
  vignette(g, W, 144, 0.4);
}

function drawStairs(g) {
  const x = 598 + DX, y = 16, w = 38, h = 82;
  rect(g, x - 2, y, w + 3, h, PAL.ink[1]);
  gradV(g, x, y + 20, w, h - 20, [PAL.ink[2], PAL.metal[1], PAL.metal[2]]);
  for (let i = 0; i < 7; i++) {
    const sx = x + i * 5, sy = y + h - 2 - i * 8;
    rect(g, sx, sy, w - i * 5, 3, PAL.metal[5]); hline(g, sx, sy, w - i * 5, PAL.metal[7]);
    rect(g, sx, sy + 3, w - i * 5, 5, PAL.metal[2]); hline(g, sx, sy + 3, w - i * 5, PAL.metal[3]);
    hline(g, sx, sy + 8, w - i * 5, PAL.ink[0]);
  }
  glow(g, x + 30, y + 14, 18, 20, PAL.gold[5], 0.28);
  line(g, x, y + h - 14, x + 32, y + 24, PAL.gold[3], 2); line(g, x, y + h - 16, x + 32, y + 22, PAL.gold[6]);
  vline(g, x + 2, y + h - 14, 12, PAL.gold[3]); vline(g, x + 16, y + 48, 14, PAL.gold[3]); vline(g, x + 28, y + 30, 12, PAL.gold[3]);
  const sx = 582 + DX - 4, sy = 3;          // colgado del techo: no tapa el ascensor
  rect(g, sx, sy, 56, 36, PAL.blue[1]); frameRect(g, sx, sy, 56, 36, PAL.blue[4]);
  hline(g, sx + 1, sy + 1, 54, PAL.blue[5]);
  tiny(g, 'PLANTA 2', sx + 22, sy + 4, PAL.paper[7], { align: 'center' });
  poly(g, [[sx + 46, sy + 3], [sx + 51, sy + 9], [sx + 41, sy + 9]], PAL.gold[5]); rect(g, sx + 45, sy + 9, 3, 4, PAL.gold[5]);
  tiny(g, 'MARKETING', sx + 28, sy + 11, PAL.gold[6], { align: 'center' });
  tiny(g, 'EVENTOS', sx + 28, sy + 17, PAL.gold[6], { align: 'center' });
  tiny(g, 'COMERCIAL', sx + 28, sy + 23, PAL.gold[6], { align: 'center' });
  tiny(g, 'ADMINISTRACIÓN', sx + 28, sy + 30, PAL.gold[6], { align: 'center' });
}

// ------------------------------------------------------------------ Diseño y Producto (ampliación 600-760)
// Pared más clara (blanco roto calibrado), rótulo colgado, póster de retícula, muestras de color, moqueta gris perla.
// La mesa y el monitor de Valentín son el objeto `monitor_valentin` (prop: tapa las piernas de quien pase detrás).
function drawDisenoBay(g) {
  const x0 = 604, x1 = 760;
  // pared blanco roto con un zócalo gris (corta limpio con el verde de Desarrollo)
  paint(g, x0, 15, x1 - x0, 79, (xx, yy) => ditherPick(xx, yy, [PAL.paper[4], PAL.paper[5], PAL.paper[6], PAL.paper[7]], 0.95 - (yy - 15) / 79 * 0.55));
  rect(g, x0, 76, x1 - x0, 18, PAL.metal[4]); hline(g, x0, 76, x1 - x0, PAL.metal[6]); hline(g, x0, 93, x1 - x0, PAL.metal[2]);
  for (let x = x0; x < x1; x += 24) vline(g, x, 77, 16, PAL.metal[3]);
  vline(g, x0, 15, 79, PAL.metal[3]); vline(g, x0 + 1, 15, 79, PAL.paper[7]);
  baseboard(g, x0, 94, x1 - x0, 4, PAL.metal);
  // moqueta gris perla, con el borde alineado (claro)
  paint(g, x0, FL, x1 - x0 + 40, 46, (xx, yy) => {
    if (xx < x0 + (yy - FL) * 0.25) return null;
    return ditherPick(xx, yy, [PAL.metal[3], PAL.metal[4], PAL.metal[5]], 0.55 - (yy - FL) / 46 * 0.3 + (hash2(xx >> 1, yy, 6) < 0.08 ? -0.2 : 0));
  });
  line(g, x0, FL, x0 + 11, 143, PAL.paper[6]);
  // rótulo colgado: DISEÑO Y PRODUCTO (alineado al píxel, cómo no)
  {
    const x = 650, y = 15, w = 66;
    vline(g, x + 5, 12, 4, PAL.metal[4]); vline(g, x + w - 6, 12, 4, PAL.metal[4]);
    bevel(g, x, y, w, 9, PAL.paper[6], PAL.paper[7], PAL.metal[3]);
    tiny(g, 'DISEÑO Y PRODUCTO', x + (w >> 1), y + 2, PAL.ink[1], { align: 'center' });
  }
  // póster de retícula (12 columnas) y muestras de color
  {
    const x = 654, y = 28, w = 26, h = 34;
    ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.35);
    rect(g, x - 1, y - 1, w + 2, h + 2, PAL.ink[1]); rect(g, x, y, w, h, '#fbfbf6');
    for (let c = 0; c <= 12; c += 2) vline(g, x + 1 + c * 2, y + 2, h - 4, '#f2b8b8');
    for (let r = 0; r < 6; r++) hline(g, x + 1, y + 3 + r * 5, w - 2, '#d8e2f0');
    rect(g, x + 3, y + 5, 12, 3, PAL.ink[1]); rect(g, x + 3, y + 10, 20, 1, PAL.metal[3]); rect(g, x + 3, y + 12, 16, 1, PAL.metal[3]);
    rect(g, x + 3, y + 16, 9, 12, PAL.red[4]); rect(g, x + 14, y + 16, 9, 6, PAL.blue[4]); rect(g, x + 14, y + 23, 9, 5, PAL.gold[5]);
    tiny(g, '12 COL', x + 13, y + h - 6, PAL.ink[2], { align: 'center' });
  }
  {
    const cols = [PAL.ink[1], PAL.red[4], PAL.gold[5], PAL.teal[5], PAL.blue[4], PAL.paper[7]];
    cols.forEach((c, i) => { rect(g, 686 + i * 5, 32, 4, 12, c); frameRect(g, 686 + i * 5, 32, 4, 12, PAL.metal[3]); });
    hline(g, 686, 46, 29, PAL.metal[3]);
    tiny(g, 'COLORÍN', 700, 48, PAL.metal[2], { align: 'center' });   // carta de color inventada (nada de marcas reales, biblia §1.3)
  }
  // un cartelito impecable sobre la bandeja: «ENTREGAS · 18:29»
  rect(g, 612, 46, 26, 9, PAL.paper[7]); frameRect(g, 612, 46, 26, 9, PAL.metal[3]);
  tiny(g, 'ENTREGAS', 625, 48, PAL.ink[2], { align: 'center' });
  // planta de verdad (no de plástico) en una maceta blanca
  plantita(g, 642, 100);
  // luz cálida del flexo de Valentín y luz de pared
  glow(g, 678, 70, 40, 26, '#ffe6b8', 0.16, 5);
  glow(g, 680, 110, 50, 9, '#fff0d0', 0.08, 4);
  drawLift(g);
}
/** Ascensor de la planta 1 (botonera común): acero cepillado, indicador en «1», botones de llamada. */
function drawLift(g) {
  const x = 724, y = 42, w = 32, h = 56;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.ink[0], 0.45);
  rect(g, x - 2, y - 2, w + 4, h + 2, PAL.metal[1]);
  rect(g, x, y, w, h, PAL.metal[2]); hline(g, x + 1, y + 1, w - 2, PAL.metal[6]); vline(g, x + 1, y + 1, h - 2, PAL.metal[5]);
  rect(g, x + 4, y + 3, 24, 7, PAL.ink[0]); frameRect(g, x + 4, y + 3, 24, 7, PAL.metal[4]);
  ['-1', '0', '1', '2'].forEach((t, i) => tiny(g, t, x + 7 + i * 6, y + 4, i === 2 ? PAL.crt[5] : PAL.metal[3]));
  glow(g, x + 20, y + 6, 6, 4, PAL.crt[5], 0.25, 3);
  const dx = x + 3, dy = y + 12, dw = w - 6, dh = h - 12;
  paint(g, dx, dy, dw, dh, (xx, yy) => {
    const fx = (xx - dx) / dw, base = fx < 0.5 ? fx * 2 : (1 - fx) * 2;
    return ditherPick(xx, yy, [PAL.metal[3], PAL.metal[4], PAL.metal[5], PAL.metal[6]], 0.25 + base * 0.45 + (hash2(xx, yy >> 2, 2) < 0.18 ? 0.15 : 0) - (yy - dy) / dh * 0.15);
  });
  vline(g, dx + (dw >> 1) - 1, dy, dh, PAL.ink[0]); vline(g, dx + (dw >> 1), dy, dh, PAL.ink[1]);
  vline(g, dx, dy, dh, PAL.ink[1]); vline(g, dx + dw - 1, dy, dh, PAL.ink[1]);
  g.save(); g.globalAlpha = 0.12; poly(g, [[dx + 3, dy], [dx + 8, dy], [dx + 3, dy + 20], [dx, dy + 20]], '#ffffff'); g.restore();
  rect(g, dx - 1, y + h - 1, dw + 2, 2, PAL.metal[5]);
  const px0 = x - 7, py0 = y + 20;
  bevel(g, px0, py0, 5, 13, PAL.metal[4], PAL.metal[6], PAL.metal[1]);
  ellipse(g, px0 + 2.5, py0 + 4, 1.5, 1.5, PAL.gold[6]); ellipse(g, px0 + 2.5, py0 + 9, 1.5, 1.5, PAL.metal[7]);
  glow(g, x + w / 2, 104, 20, 5, '#e8f0ff', 0.12, 3);
}
function plantita(g, x, y) {
  shadowEllipse(g, x, y, 6, 2, 0.6);
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 + (i - 4) * 0.33, len = 10 + (i % 3) * 3;
    for (let s = 0; s < len; s++) px(g, Math.round(x + Math.cos(a) * s), Math.round(y - 9 + Math.sin(a) * s + (s * s) / 60), s > len - 3 ? PAL.leaf[6] : PAL.leaf[3 + (i & 1)]);
  }
  poly(g, [[x - 5, y - 9], [x + 5, y - 9], [x + 4, y], [x - 4, y]], (xx) => (xx < x ? PAL.paper[7] : PAL.paper[5]));
  hline(g, x - 5, y - 9, 10, PAL.white);
}

function drawDesarrollo(g) {
  // rótulo colgado del techo: DESARROLLO
  {
    const x = 490, y = 15;
    vline(g, x + 4, 12, 4, PAL.metal[4]); vline(g, x + 40, 12, 4, PAL.metal[4]);
    bevel(g, x, y, 46, 9, PAL.purple[3], PAL.purple[5], PAL.purple[1]);
    tiny(g, 'DESARROLLO', x + 23, y + 2, PAL.paper[7], { align: 'center' });
  }
  // calendario de papel (Ferretería Hermanos Tornillo)
  {
    const x = 458, y = 30, w = 18, h = 26;
    ditherOverlay(g, x + 1, y + 1, w, h, PAL.shadow, 0.4);
    rect(g, x, y, w, h, PAL.paper[6]); frameRect(g, x, y, w, h, PAL.paper[3]);
    rect(g, x, y, w, 9, PAL.red[3]); hline(g, x, y, w, PAL.red[5]);
    tiny(g, 'TORNILLO', x + (w >> 1), y + 2, PAL.paper[7], { align: 'center' });
    rect(g, x + 6, y + 10, 6, 2, PAL.metal[5]); rect(g, x + 8, y + 12, 2, 6, PAL.metal[4]); for (let i = 0; i < 6; i += 2) hline(g, x + 7, y + 13 + i, 4, PAL.metal[2]);
    for (let r2 = 0; r2 < 3; r2++) for (let c = 0; c < 5; c++) px(g, x + 2 + c * 3, y + 19 + r2 * 2, c === 4 ? PAL.red[4] : PAL.ink[2]);
    px(g, x + (w >> 1), y - 2, PAL.metal[4]);
  }
  // mesa de Nerea
  deskFront(g, 460, DT, 26, 21, { drawers: 'left' });
  lcd(g, 463, DT - 18, 18, 14, { kind: 'code', seed: 41 });
  postit(g, 464, DT - 3, POSTIT.o, { w: 4, h: 4, lines: false }); postit(g, 469, DT - 4, POSTIT.g, { w: 4, h: 4, lines: false });
  ellipse(g, 482, DT - 3, 2, 2, PAL.gold[5]); px(g, 483, DT - 3, PAL.ink[0]); px(g, 484, DT - 2, PAL.red[4]);
  chairBack(g, 473, 103, { jacket: null, col: [PAL.teal[0], PAL.teal[1], PAL.teal[2], PAL.teal[3], PAL.teal[4]] });

  // kanban (pizarra con ruedas), alta: el tablero entero queda POR ENCIMA de las cabezas y las manos del coro (P14)
  {
    const x = 488, y = KB_Y, w = 52, h = 42;
    rect(g, x + 2, y + h, 2, 38, PAL.metal[4]); rect(g, x + w - 4, y + h, 2, 38, PAL.metal[4]);
    rect(g, x + 1, y + h + 36, 4, 2, PAL.ink[0]); rect(g, x + w - 5, y + h + 36, 4, 2, PAL.ink[0]);
    ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.45);
    rect(g, x, y, w, h, PAL.metal[6]); frameRect(g, x, y, w, h, PAL.metal[3]);
    hline(g, x + 1, y + 1, w - 2, PAL.metal[7]); vline(g, x + 1, y + 1, h - 2, PAL.metal[7]);
    rect(g, x + 2, y + 2, w - 4, h - 4, PAL.paper[7]);
    const colw = 10;
    for (let c = 0; c < 5; c++) {
      const cx = x + 3 + c * colw;
      rect(g, cx, y + 3, colw - 1, 5, [PAL.blue[4], PAL.gold[4], PAL.red[4], PAL.crt[3], PAL.purple[4]][c]);
      tiny(g, ['P', 'E', 'B', 'H', '?'][c], cx + ((colw - 1) >> 1) + 1, y + 3, PAL.paper[7], { align: 'center' });
      if (c < 4) vline(g, cx + colw - 1, y + 8, h - 12, PAL.metal[5]);
    }
    const r = rng(404);
    const cols = [POSTIT.y, POSTIT.g, POSTIT.p, POSTIT.b, POSTIT.o];
    const counts = [5, 3, 2, 6];
    for (let c = 0; c < 4; c++) for (let i = 0; i < counts[c]; i++) {
      const cx = x + 4 + c * colw + (i % 2) * 4, cy = y + 10 + Math.floor(i / 2) * 9 + (i % 2);
      if (cy + 6 > y + h - 3) continue;
      if (c === 0 && i === 1) continue;     // hueco de «Baja becario Rubén» (lo pinta el objeto)
      postit(g, cx, cy, cols[Math.floor(r() * 5)], { w: 5, h: 5, lines: false });
      px(g, cx + 1, cy + 2, PAL.ink[2]); px(g, cx + 2, cy + 2, PAL.ink[2]); px(g, cx + 1, cy + 3, PAL.ink[2]);
    }
    paint(g, x + 3 + 4 * colw, y + 8, colw - 1, h - 12, (xx, yy) => (((xx + yy) % 5 === 0) ? PAL.purple[6] : null));
    // el pósit de 1998 (amarillísimo, viejo, doblado)
    postit(g, 530, y + 10, '#ffe21a', { w: 8, h: 8, lines: false });
    for (let ly = y + 12; ly < y + 17; ly += 2) hline(g, 531, ly, 6, '#b08a00');
    px(g, 537, y + 17, PAL.paper[0]); px(g, 536, y + 17, '#b08a00');
  }
  // semáforo de ruido (la lámpara la dibuja el objeto) + pósit de Nerea
  {
    const x = 542, y = 34;
    bevel(g, x, y, 10, 26, PAL.paper[6], PAL.paper[7], PAL.paper[2]);
    rect(g, x + 2, y + 2, 6, 6, PAL.ink[1]); rect(g, x + 2, y + 9, 6, 6, PAL.ink[1]); rect(g, x + 2, y + 16, 6, 6, PAL.ink[1]);
    rect(g, x + 3, y + 24, 5, 3, PAL.paper[2]);
    postit(g, x + 2, y + 28, POSTIT.p, { w: 6, h: 6, lines: false }); px(g, x + 3, y + 30, PAL.ink[2]); px(g, x + 5, y + 31, PAL.ink[2]);
  }
  // coro: escritorio largo con tres monitores y tazas DEV, DEV, NO
  {
    const x = 488, w = 58;
    deskFront(g, x, DT, w, 21, { drawers: false });
    lcd(g, x + 2, DT - 18, 15, 14, { kind: 'code', seed: 51 });
    lcd(g, x + 21, DT - 18, 15, 14, { kind: 'code', seed: 52 });
    lcd(g, x + 40, DT - 18, 15, 14, { kind: 'code', seed: 53 });
    mug(g, x + 17, DT + 3, { color: PAL.paper, logo: PAL.blue[4] }); mug(g, x + 36, DT + 3, { color: PAL.paper, logo: PAL.blue[4] }); mug(g, x + 53, DT + 3, { color: PAL.red }); tiny(g, 'NO', x + 53, DT - 4, PAL.paper[7]);
  }
  // Anselmo: mesa con monitor (la pantalla es un objeto) y termo
  deskFront(g, 570, DT, 24, 21, { drawers: false, top: [PAL.metal[4], PAL.metal[5], PAL.metal[6]], body: [PAL.metal[1], PAL.metal[2], PAL.metal[3]] });
  rect(g, 588, DT - 7, 4, 7, PAL.metal[5]); rect(g, 588, DT - 8, 4, 2, PAL.ink[1]); px(g, 589, DT - 4, PAL.red[4]);
  // ventana con lluvia (derecha) y radiador
  cityWindow(g, 554, 22, 26, 42, { sky: 'night', seed: 33, mullions: true });
  rainyGlassStatic(g, 554, 22, 26, 42, 9);
  rect(g, 554, 68, 26, 5, PAL.paper[5]); for (let i = 0; i < 26; i += 3) vline(g, 554 + i, 68, 5, PAL.paper[3]);
  hline(g, 554, 68, 26, PAL.paper[7]);
  // donde antes estaba la bandeja: torre de servidor «de pruebas» y una papelera de latas de Desarrollo
  shadowEllipse(g, 556, 101, 9, 2, 0.7);
  bevel(g, 549, 80, 12, 20, PAL.ink[2], PAL.metal[2], PAL.ink[0]);
  for (let k = 0; k < 4; k++) { hline(g, 551, 83 + k * 3, 8, PAL.ink[0]); px(g, 558, 83 + k * 3, k % 2 ? PAL.crt[5] : PAL.gold[5]); }
  tiny(g, 'PRE', 550, 94, PAL.metal[5]);
  rect(g, 563, 90, 8, 10, PAL.metal[3]); frameRect(g, 563, 90, 8, 10, PAL.metal[1]);
  for (let k = 0; k < 3; k++) { rect(g, 564 + k * 2, 87 + (k % 2), 2, 4, [PAL.red[4], PAL.teal[5], PAL.gold[5]][k]); px(g, 564 + k * 2, 87 + (k % 2), PAL.metal[7]); }
  drawDisenoBay(g);
  drawStairs(g);
  // atril con el cartel de frontera
  {
    const x = 444, y = 74;
    shadowEllipse(g, x + 8, 101, 11, 2, 0.6);
    line(g, x + 2, y + 18, x - 1, y + 28, PAL.metal[3]); line(g, x + 14, y + 18, x + 17, y + 28, PAL.metal[3]);
    rect(g, x + 7, y + 22, 2, 6, PAL.metal[2]);
    rect(g, x, y, 17, 21, PAL.paper[2]); frameRect(g, x, y, 17, 21, PAL.ink[2]);
    rect(g, x + 1, y + 1, 15, 19, PAL.paper[6]);
    tiny(g, 'DESARR.', x + 8, y + 2, PAL.red[3], { align: 'center' });
    tiny(g, 'SOLO', x + 8, y + 8, PAL.ink[2], { align: 'center' });
    tiny(g, 'CÓDIGO', x + 8, y + 13, PAL.ink[2], { align: 'center' });
    hline(g, x + 3, y + 19, 11, PAL.blue[4]);
  }
}

// ------------------------------------------------------------------ objetos con estado
/** pantalla gigante: LECTORES CONCURRENTES 3.418 + línea roja que baja; con cms_vivo está apagada */
function drawMetricas(g, view, t) {
  const x = 164, y = 17, w = 98, h = 35;
  const off = !!view.flag('cms_vivo');
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.ink[0]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.metal[2]);
  hline(g, x - 1, y - 1, w + 2, PAL.metal[4]);
  if (off) {
    gradV(g, x, y, w, h, [PAL.ink[1], PAL.ink[0]]);
    g.save(); g.globalAlpha = 0.1; poly(g, [[x + 6, y + h], [x + 22, y + h], [x + 44, y], [x + 28, y]], '#ffffff'); g.restore();
    ditherOverlay(g, x, y, w, h, PAL.metal[2], 0.06);
    px(g, x + w - 3, y + h - 3, PAL.red[3]);
    return;
  }
  gradV(g, x, y, w, h, [PAL.blue[1], PAL.blue[0]]);
  tiny(g, 'LECTORES CONCURRENTES', x + 3, y + 3, PAL.blue[7]);
  hline(g, x + 3, y + 9, w - 6, PAL.blue[3]);
  const n = ['3', '.', '4', '1', String(8 - (Math.floor(t / 1000) % 3 === 0 ? 1 : 0))];
  let nx = x + 4;
  n.forEach(ch => { label(g, ch, nx, y + 6, '#fff4c8'); nx += ch === '.' ? 3 : 7; });
  tiny(g, 'EN DIRECTO', x + w - 4, y + 12, PAL.crt[5], { align: 'right' });
  const gx = x + 4, gy = y + 21, gw = w - 8, gh = 11;
  rect(g, gx, gy, gw, gh, PAL.ink[1]);
  for (let yy = gy + 2; yy < gy + gh; yy += 3) for (let xx = gx; xx < gx + gw; xx += 3) px(g, xx, yy, PAL.blue[2]);
  const k = Math.floor(t / 1000);
  let prev = gy + 1;
  for (let i = 0; i < gw; i++) {
    const base = gy + 1 + (i / gw) * (gh - 4);
    const nz = (hash2(i + k, 3, 5) - 0.5) * 2.2;
    const yy = Math.max(gy, Math.min(gy + gh - 1, Math.round(base + nz)));
    px(g, gx + i, yy, '#ff5a48'); if (Math.abs(yy - prev) > 1) vline(g, gx + i, Math.min(yy, prev), Math.abs(yy - prev), '#ff5a48');
    px(g, gx + i, yy + 1, PAL.red[2]);
    prev = yy;
  }
  px(g, gx + gw - 1, prev - 1, '#fff4c8');
  if ((Math.floor(t / 500) & 1) === 0) rect(g, x + w - 6, y + 3, 3, 3, '#ff3a30');
  ditherOverlay(g, x, y, w, 2, '#ffffff', 0.08);
  glow(g, x + w / 2, y + h / 2, 78, 34, '#8ec8ff', 0.16, 4);
}

function drawEnchufe(g, view) {
  const x = 205, y = 86;
  const pulled = !!view.flag('cms_vivo');
  rect(g, x, y, 7, 6, PAL.paper[6]); frameRect(g, x, y, 7, 6, PAL.paper[3]);
  px(g, x + 2, y + 2, PAL.ink[1]); px(g, x + 4, y + 2, PAL.ink[1]); px(g, x + 2, y + 4, PAL.ink[1]); px(g, x + 4, y + 4, PAL.ink[1]);
  if (!pulled) {
    rect(g, x + 1, y + 1, 5, 4, PAL.ink[2]); rect(g, x + 2, y + 2, 3, 2, PAL.metal[4]);
    vline(g, x + 3, 53, 33, PAL.ink[0]);
    rect(g, x - 3, y - 2, 13, 3, PAL.paper[4]); hline(g, x - 3, y - 2, 13, PAL.paper[6]);
    rect(g, x - 3, y + 6, 13, 2, PAL.paper[4]);
  } else {
    cable(g, x + 3, 53, x + 18, y + 12, 8, PAL.ink[0], 20);
    rect(g, x + 16, y + 11, 5, 4, PAL.ink[2]); px(g, x + 17, y + 14, PAL.metal[5]); px(g, x + 19, y + 14, PAL.metal[5]);
    rect(g, x - 3, y - 2, 13, 3, PAL.paper[4]); line(g, x - 3, y + 1, x + 10, y - 3, PAL.paper[2]);
  }
}

function drawSilla(g, view) {
  const libre = !!view.flag('silla_libre');
  chairBack(g, libre ? 323 : 349, libre ? 105 : 103, { jacket: null, turn: libre ? -1 : 0 });
}
function drawChaqueta(g) {
  const top = 103 - 25 + 1;
  jacketOn(g, 349, top, JACKETS.beige);
  rect(g, 353, top + 7, 4, 3, PAL.paper[7]); px(g, 354, top + 8, PAL.red[4]); px(g, 355, top + 8, PAL.red[4]);
}

function drawKanbanNote(g, view) {
  const x = 492, y = KB_Y;
  const cx = x + 4 + 4, cy = y + 10 + 1;
  if (view.flag('posit_descopeado')) {
    postit(g, cx - 1, cy, '#a6f08c', { w: 7, h: 7, lines: false });
    px(g, cx + 1, cy + 2, PAL.ink[2]); px(g, cx + 3, cy + 2, PAL.ink[2]); px(g, cx + 1, cy + 4, PAL.ink[2]); px(g, cx + 2, cy + 4, PAL.ink[2]); px(g, cx + 3, cy + 4, PAL.ink[2]);
    px(g, cx + 5, cy + 1, PAL.red[4]);
  } else {
    postit(g, cx - 1, cy, '#f49ab8', { w: 7, h: 7, lines: false });
    tiny(g, 'BAJA', cx, cy + 1, PAL.ink[2]); tiny(g, 'RUB', cx, cy + 4, PAL.ink[2]);
  }
}

function drawFrontera(g, view) {
  const a2 = !!view.flag('acto_2_iniciado'), a3 = !!view.flag('acto_3_iniciado'), inte = !!view.flag('infografia_integrada');
  const xb = a2 || a3 ? 400 : 420;
  if (inte && a3) {
    for (let y = 102; y < 144; y += 2) {
      const xx = Math.round(tapeX(400, y));
      ditherOverlay(g, xx - 2, y, 4 + Math.floor((y - 100) / 12), 1, PAL.paper[2], 0.45);
    }
    return;
  }
  for (let y = 100; y < 144; y++) {
    const xx = Math.round(tapeX(xb, y));
    const wd = Math.max(2, Math.round(2 + (y - 100) / 14));
    rect(g, xx - (wd >> 1), y, wd, 1, (y & 3) < 2 ? PAL.paper[4] : PAL.paper[3]);
    px(g, xx - 1 - Math.floor((y - 100) / 28), y, PAL.paper[6]);
  }
  if (a3 && !inte) {
    const pts = [[204, 102], [276, 102], [288, 115], [192, 115]];
    for (let i = 0; i < 4; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % 4];
      line(g, ax, ay, bx, by, PAL.paper[4]); line(g, ax, ay + 1, bx, by + 1, PAL.paper[3]);
    }
  }
}

function drawHerminia(g, view, t) {
  const x = 229, y = 71;
  rect(g, x, y + 14, 22, 3, PAL.metal[5]); hline(g, x, y + 14, 22, PAL.metal[7]); hline(g, x, y + 16, 22, PAL.metal[2]);
  bevel(g, x + 1, y, 20, 14, PAL.metal[6], PAL.metal[7], PAL.metal[3]);
  const sx = x + 3, sy = y + 2, sw = 16, sh = 10;
  rect(g, sx, sy, sw, sh, PAL.paper[7]);
  const f = Math.floor(t / 900) % 4;
  if (f === 0) {
    ellipse(g, sx + 6, sy + 5, 4, 4, (xx, yy) => { const a = (Math.atan2(yy - (sy + 5), xx - (sx + 6)) + Math.PI) / (Math.PI * 2); return a < 0.55 ? PAL.teal[5] : a < 0.85 ? PAL.gold[4] : PAL.red[4]; });
    hline(g, sx + 11, sy + 2, 4, PAL.ink[3]); hline(g, sx + 11, sy + 4, 4, PAL.metal[4]); hline(g, sx + 11, sy + 6, 3, PAL.metal[4]);
  } else if (f === 1) {
    for (let i = 0; i < 5; i++) { const bh = 2 + ((i * 7 + 3) % 6); rect(g, sx + 1 + i * 3, sy + sh - 1 - bh, 2, bh, [PAL.teal[5], PAL.gold[4], PAL.red[4], PAL.teal[5], PAL.blue[4]][i]); }
  } else if (f === 2) {
    let py = sy + 7; for (let i = 0; i < 14; i++) { py = Math.max(sy + 1, Math.min(sy + sh - 2, py + ((i * 5) % 3) - 1)); px(g, sx + 1 + i, py, PAL.teal[4]); px(g, sx + 1 + i, py + 1, PAL.teal[2]); }
    hline(g, sx + 1, sy + sh - 1, 14, PAL.metal[5]);
  } else {
    for (let i = 0; i < 9; i++) rect(g, sx + 1 + ((i * 5) % 14), sy + 1 + ((i * 3) % 7), 2, 2, [PAL.red[4], PAL.teal[5], PAL.gold[4]][i % 3]);
  }
  ditherOverlay(g, sx, sy, sw, 2, '#ffffff', 0.15);
  glow(g, x + 11, y + 6, 20, 14, '#b8fff0', 0.12, 3);
  // pegatina «HERMINIA» escrita a mano sobre la tapa, bajo la pantalla
  rect(g, x - 5, y + 18, 34, 6, PAL.paper[7]); frameRect(g, x - 5, y + 18, 34, 6, PAL.paper[3]); tiny(g, 'HERMINIA', x + 12, y + 19, PAL.teal[3], { align: 'center' });
}

function drawFigurantes(g, view, t) {
  const spec = [{ cx: 160, hair: PAL.wood[1], shirt: JACKETS.grey, y: 64 }, { cx: 183, hair: PAL.ink[3], shirt: JACKETS.olive, y: 66 }];
  spec.forEach((s, i) => {
    chairBack(g, s.cx, 103, { jacket: null, col: [PAL.metal[0], PAL.metal[1], PAL.metal[2], PAL.metal[3], PAL.metal[4]] });
    personBack(g, s.cx, s.y, { hair: s.hair, shirt: s.shirt, hw: 5 });
    const k = Math.floor(t / (110 + i * 40)) % 4;
    rect(g, s.cx - 10, s.y + 17, 3, 7, s.shirt[2]); rect(g, s.cx + 7, s.y + 17, 3, 7, s.shirt[2]);
    rect(g, s.cx - 9 + (k & 1), s.y + 24, 2, 2, PAL.skin[3]); rect(g, s.cx + 7 + ((k >> 1) & 1), s.y + 24, 2, 2, PAL.skin[3]);
  });
  if ((Math.floor(t / 400) & 1) === 0) { px(g, 150, DT - 6, PAL.crt[6]); px(g, 190, DT - 9, PAL.crt[6]); }
}

function drawCoro(g, view, t) {
  const spec = [{ cx: 498, hair: PAL.wood[2], hood: JACKETS.navy }, { cx: 517, hair: PAL.ink[2], hood: JACKETS.burdeos }, { cx: 536, hair: PAL.wood[1], hood: JACKETS.black }];
  spec.forEach((s, i) => {
    chairBack(g, s.cx, 103, { jacket: null, col: [PAL.teal[0], PAL.teal[1], PAL.teal[2], PAL.teal[3], PAL.teal[4]], turn: i === 1 ? 1 : 0 });
    personBack(g, s.cx, 68, { hair: s.hair, shirt: s.hood, hw: 5, cans: true });
    const ph = t / 160 + i * 1.7;
    for (const side of [-1, 1]) {
      const sw = Math.sin(ph + (side > 0 ? 1.4 : 0));
      const bx = s.cx + side * 8, by = 70;
      // manos a la altura del teclado (no tapan el kanban, que está encima)
      const hx = Math.round(bx + side * (3 + sw * 3)), hy = Math.round(by - 4 - Math.abs(Math.cos(ph + side)) * 3);
      line(g, bx, by + 2, hx, hy + 2, s.hood[2], 2);
      ellipse(g, hx, hy, 2.5, 2.5, PAL.skin[3]);
      px(g, hx - 2, hy - 3, PAL.skin[4]); px(g, hx, hy - 4, PAL.skin[4]); px(g, hx + 2, hy - 3, PAL.skin[4]); px(g, hx + 1, hy - 3, PAL.skin[2]);
    }
  });
}

function drawSemaforo(g, view) {
  const x = 542, y = 34;
  const st = String(view.state || 'rojo');
  const lit = /^[aá]mb/.test(st) ? 1 : st.startsWith('ver') ? 2 : 0;
  const cols = [['#ff3a30', PAL.red[1]], ['#ffc83a', PAL.gold[1]], ['#4ae86a', PAL.crt[1]]];
  for (let i = 0; i < 3; i++) {
    const ly = y + 2 + i * 7;
    const on = i === lit;
    rect(g, x + 2, ly, 6, 6, on ? cols[i][0] : cols[i][1]);
    if (on) { hline(g, x + 2, ly, 6, '#ffffff'); glow(g, x + 5, ly + 3, 12, 10, cols[i][0], 0.35, 4); }
  }
}

function drawBandeja(g, view) {
  const x = 614, y = 80;
  deskFront(g, x, y + 8, 20, 12, { drawers: false });
  for (let i = 0; i < 3; i++) {
    const by = y + 6 - i * 5;
    rect(g, x + 3, by, 16, 4, PAL.metal[4]); hline(g, x + 3, by, 16, PAL.metal[7]); hline(g, x + 3, by + 3, 16, PAL.metal[1]);
    for (let k = 0; k < 4; k++) rect(g, x + 4 + k * 4, by - 2, 3, 2, PAL.paper[6]);
    rect(g, x + 4, by - 3, 6, 1, PAL.paper[5]);
  }
  rect(g, x + 2, y - 10, 2, 16, PAL.metal[3]); rect(g, x + 18, y - 10, 2, 16, PAL.metal[3]);
  rect(g, x + 7, y + 8, 8, 3, PAL.paper[7]); tiny(g, 'DYP', x + 11, y + 6, PAL.ink[2], { align: 'center' });
  if (view.flag('bandeja_diseno_abierta')) { rect(g, x + 8, y - 12, 6, 3, PAL.paper[7]); hline(g, x + 8, y - 12, 6, PAL.red[4]); }
}

/** Puesto de Valentín: mesa blanca impecable, flexo cálido, teclado alineado, taza en la esquina superior derecha y,
 *  en el monitor, la Pecera en miniatura (con un Bruno de un píxel que se mueve cuando Bruno se mueve). */
function drawMonitorValentin(g, view, t) {
  const x = 648, y = DT, w = 56;
  shadowEllipse(g, x + w / 2, 101, w / 2 + 4, 3, 0.6);
  // patas finas de acero y tablero blanco
  for (const lx of [x + 2, x + w - 4]) { rect(g, lx, y + 4, 2, 17, PAL.metal[5]); vline(g, lx, y + 4, 17, PAL.metal[7]); }
  rect(g, x + 8, y + 4, w - 16, 2, PAL.metal[4]);
  rect(g, x - 2, y, w + 4, 4, '#f6f6f2'); hline(g, x - 2, y, w + 4, '#ffffff'); hline(g, x - 2, y + 3, w + 4, PAL.metal[4]);
  // cajonera blanca con una sola etiqueta
  bevel(g, x + w - 18, y + 6, 13, 14, '#ecece6', '#ffffff', PAL.metal[4]); rect(g, x + w - 14, y + 9, 5, 1, PAL.metal[3]); rect(g, x + w - 14, y + 15, 5, 1, PAL.metal[3]);
  // monitor de pie, grande y fino
  const mx = x + 10, my = y - 26, mw = 30, mh = 20;
  rect(g, mx + 13, my + mh, 4, 5, PAL.metal[6]); rect(g, mx + 9, y - 1, 12, 1, PAL.metal[6]);
  rect(g, mx - 1, my - 1, mw + 2, mh + 2, PAL.ink[1]);
  const sx = mx + 1, sy = my + 1, sw = mw - 2, sh = mh - 2;
  // la Pecera en miniatura: pared verde, franja teal, suelo, mesitas y pantalla de métricas (apagada con cms_vivo)
  rect(g, sx, sy, sw, sh, PAL.green[4]);
  rect(g, sx, sy + 9, sw, 3, PAL.teal[4]); rect(g, sx, sy + 12, sw, sh - 12, '#4a5872');
  rect(g, sx + 9, sy + 2, 10, 4, view.flag('cms_vivo') ? PAL.ink[1] : PAL.blue[2]); if (!view.flag('cms_vivo')) hline(g, sx + 10, sy + 4, 8, '#ff5a48');
  for (const k of [2, 8, 20]) { rect(g, sx + k, sy + 9, 5, 2, PAL.paper[5]); px(g, sx + k + 1, sy + 7, PAL.blue[5]); }
  rect(g, sx + 24, sy + 3, 3, 6, PAL.metal[4]);                       // ascensor diminuto
  // Bruno en miniatura (pelo castaño, camisa azul) y Valentín en miniatura junto a su mesa
  const bx = sx + 3 + Math.round(((view.t || t || 0) / 1200) % 18);
  rect(g, bx, sy + 10, 2, 1, PAL.wood[2]); rect(g, bx, sy + 11, 2, 3, PAL.blue[5]); rect(g, bx, sy + 14, 2, 2, PAL.ink[2]);
  rect(g, sx + 22, sy + 9, 1, 1, PAL.skin[4]); rect(g, sx + 22, sy + 10, 1, 4, PAL.ink[2]);
  ditherOverlay(g, sx, sy, sw, 2, '#ffffff', 0.15);
  glow(g, mx + 15, my + 10, 24, 16, '#c8e8ff', 0.10, 3);
  // teclado alineado y ratón
  rect(g, x + 13, y - 2, 22, 2, '#f2f2ee'); hline(g, x + 13, y - 1, 22, PAL.metal[4]); rect(g, x + 38, y - 2, 3, 2, '#f2f2ee');
  // taza blanca en la esquina superior derecha («ahí no molesta»)
  rect(g, x + w - 5, y - 5, 4, 5, '#ffffff'); hline(g, x + w - 5, y - 1, 4, PAL.metal[4]); px(g, x + w - 1, y - 3, PAL.metal[5]);
  // flexo cálido calibrado
  const lx = x + 2, ly = y;
  rect(g, lx, ly - 2, 7, 2, PAL.metal[3]);
  line(g, lx + 3, ly - 2, lx + 1, ly - 14, PAL.metal[6]); line(g, lx + 1, ly - 14, lx + 7, ly - 21, PAL.metal[6]);
  poly(g, [[lx + 5, ly - 24], [lx + 11, ly - 21], [lx + 9, ly - 16], [lx + 4, ly - 19]], PAL.paper[7]);
  rect(g, lx + 6, ly - 18, 4, 1, '#fff4c8');
  g.save(); g.globalAlpha = 0.12; poly(g, [[lx + 5, ly - 17], [lx + 10, ly - 17], [lx + 20, ly + 2], [lx - 4, ly + 2]], '#ffe6b0'); g.restore();
  // cuaderno de bocetos cuadriculado
  rect(g, x + 42, y - 2, 8, 2, PAL.paper[7]); px(g, x + 44, y - 2, PAL.red[4]);
}

function drawAnselmoScreen(g, view, t) {
  const x = 570, y = 62;
  lcd(g, x, y, 24, 16, { kind: 'off', seed: 1 });
  const inte = !!view.flag('infografia_integrada'), found = !!view.flag('ruben_encontrado');
  const sx = x + 1, sy = y + 1, sw = 22, sh = 13;
  rect(g, sx, sy, sw, sh, inte ? PAL.crt[0] : found ? '#3a0c0c' : '#1a0a0a');
  tiny(g, 'ACCESO', sx + 1, sy + 1, inte ? PAL.crt[5] : '#ff5a48');
  tiny(g, inte ? 'CONC.' : found ? 'REVOC.' : 'DENEG.', sx + 1, sy + 7, inte ? PAL.crt[6] : '#ffb0a0');
  if (inte) hline(g, sx + 1, sy + 11, sw - 3, '#ff6a58');
  if ((Math.floor(t / 500) & 1) === 0) px(g, sx + sw - 2, sy + sh - 2, '#ffffff');
}

// ------------------------------------------------------------------ geometría
const layout = {
  pecera_a_vestibulo: { rect: [4, 26, 50, 72], walkTo: [32, 110], face: 'left' },
  sillas_con_chaqueta: { rect: [60, 60, 84, 44], walkTo: [104, 112], face: 'up' },
  figurantes_web: { rect: [146, 56, 50, 48], walkTo: [172, 112], face: 'up', draw: drawFigurantes, priority: 1 },
  pantalla_metricas: { rect: [162, 15, 102, 39], walkTo: [214, 110], face: 'up', draw: drawMetricas },
  enchufe_pantalla: { rect: [198, 84, 18, 11], walkTo: [208, 109], face: 'up', priority: 1, draw: drawEnchufe },
  mesa_dibujo: { rect: [212, 68, 56, 34], walkTo: [240, 111], face: 'up' },
  herminia_portatil: { rect: [226, 70, 28, 26], walkTo: [240, 109], face: 'up', priority: 1, draw: drawHerminia },
  taza_abandonada: { rect: [358, 71, 12, 11], walkTo: [366, 110], face: 'up', priority: 1 },
  ordenador_bruno: { rect: [304, 54, 24, 28], walkTo: [316, 110], face: 'up', priority: 1 },
  silla_ramirez: { rect: [312, 66, 46, 38], walkTo: [340, 111], face: 'up', draw: drawSilla },
  chaqueta_ramirez_hotspot: { rect: [340, 76, 18, 17], walkTo: [348, 111], face: 'up', priority: 2, draw: drawChaqueta },
  pecera_a_pajarera: { rect: [372, 28, 38, 70], walkTo: [391, 106], face: 'up' },
  pecera_a_office: { rect: [413, 34, 28, 64], walkTo: [427, 106], face: 'up' },
  calendario_ferreteria: { rect: [456, 28, 22, 30], walkTo: [450, 108], face: 'up' },
  kanban: { rect: [488, 17, 52, 46], walkTo: [512, 109], face: 'up', draw: drawKanbanNote },
  posit_1998: { rect: [528, 27, 12, 12], walkTo: [534, 109], face: 'up', priority: 1 },
  ventana: { rect: [552, 20, 30, 46], walkTo: [567, 109], face: 'up' },
  pecera_a_ecosistema: { rect: [598 + DX, 14, 38, 84], walkTo: [620 + DX, 106], face: 'right' },
  ascensor_pecera: { rect: [722, 40, 36, 58], walkTo: [740, 108], face: 'up' },
  monitor_valentin: {
    rect: [656, 52, 32, 26], walkTo: [672, 110], face: 'up', priority: 1,
    layer: 'sorted', zy: 100, prop: true, draw: drawMonitorValentin,
  },
  // ADENDA
  frontera_carrocero: { poly: [[394, 104], [428, 104], [488, 142], [434, 142]], walkTo: [404, 124], face: 'right', layer: 'back', draw: drawFrontera },
  cartel_frontera: { rect: [442, 72, 22, 30], walkTo: [452, 110], face: 'up' },
  coro_desarrollo: { rect: [488, 62, 58, 44], walkTo: [517, 112], face: 'up', draw: drawCoro },
  bandeja_diseno: { rect: [612, 64, 24, 36], walkTo: [624, 110], face: 'up', draw: drawBandeja },
  semaforo_ruido: { rect: [540, 32, 14, 30], walkTo: [546, 108], face: 'up', draw: drawSemaforo },
  taza_no: { rect: [539, 71, 10, 11], walkTo: [544, 110], face: 'up', priority: 1 },
  pantalla_anselmo: { rect: [569, 60, 26, 20], walkTo: [582, 110], face: 'up', priority: 1, draw: drawAnselmoScreen },
  // PNJ
  // Bruno le habla desde su derecha (a su izquierda está Leoncio: no se pone detrás de él ni delante de ella)
  yoli_tendencias: { at: [284, 113, 'down'], walkTo: [306, 116], face: 'left' },
  nerea_backlog: { at: [474, 115, 'down'] },
  ruben: { at: [568, 113, 'up'] },
  inigo_sinergia: { at: [214, 119, 'down'] },
  leoncio_quesitos: { at: [262, 116, 'down'], walkTo: [250, 126], face: 'right' },
  anselmo_monolito: { at: [598, 118, 'left'], walkTo: [584, 126], face: 'right' },
  // Valentín: de pie, a cuerpo entero, a la derecha de su mesa, mirando su monitor (hacia Desarrollo)
  valentin_reticula: { at: [712, 115, 'left'], walkTo: [694, 120], face: 'right' },
};

export default {
  room: 'pecera',
  width: W,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [[4, 104], [796, 104], [798, 142], [2, 142]] }],
  // entradas: se llaman como la sala de la que se viene
  entries: { vestibulo: [34, 116, 'right'], pajarera: [391, 110, 'down'], office: [427, 110, 'down'], ecosistema: [618 + DX, 116, 'left'], ascensor: [740, 112, 'down'] },
  layout,
  draw: drawRoom,
  animate(g, view, t) {
    rainOnGlass(g, 66, 20, 84, 36, t, 3);
    rainOnGlass(g, 554, 22, 26, 42, t, 8);
    lcd(g, 123, DT - 18, 18, 14, { kind: 'saver', seed: 4, t });
    lcd(g, 63, DT - 18, 18, 14, { kind: 'saver', seed: 7, t });
    lcd(g, 342, DT - 18, 16, 14, { kind: (Math.floor(t / 3000) & 1) ? 'bars' : 'chart', seed: 31, t });
    // un fluorescente moribundo parpadea sobre Infografía
    if (hash2(Math.floor(t / 120), 5, 2) < 0.12) { rect(g, 216, 11, 44, 3, PAL.metal[4]); g.save(); g.globalAlpha = 0.22; rect(g, 190, 14, 100, 20, PAL.ink[0]); g.restore(); }
  },
};
