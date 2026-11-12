// SALA `pajarera` — ARTE Y GEOMETRÍA. Dueño: artista de fondos. Biblia: §3.5; adenda §3.4 y §11.3.
// Despacho de cristal de Dirección, persianas a media altura desde 2015. A la izquierda, la puerta de cristal (se intuye la
// Pecera); pared de pósits; pizarra con la matriz 2x2; sofá blanco de cuero; el atril del Titulator; la mesa enorme
// (el Lector Medio, actor, de pie DETRÁS); perchero vacío; mesa de Gervasio con tres móviles; puerta de la Sala Amazonas
// con su pantallita de estado y la hoja de reservas.
//
// Objetos con estado/animación: pantalla_titulator (rota titulares, animada), puerta_sala (pantallita: reunion_terminada /
// acto_3_iniciado), hoja_reservas (folio impreso del Acto III encima), mesa_direccion (ordenada por z con el Lector Medio).
import {
  PAL, rect, hline, vline, frameRect, px, line, poly, ellipse, paint, bevel, ditherOverlay, gradV, gradH, noise,
  glow, lightCone, shadowEllipse, ditherPick, hash2, rng, fadeRows, vignette, wall, wainscot, baseboard, floorPlanks, rug,
  fluorescent, cityWindow, wallClock, plant, mix, shade,
} from '../../../engine/draw.js';
import {
  tiny, tinyW, postit, POSTIT, lcd, JACKETS, chairBack, blinds, rainOnGlass, rainyGlassStatic, cable,
} from './lib-oficina.js';

const W = 320;
const FL = 98;

const wallRamp = [mix(PAL.paper[2], PAL.blue[4], 0.28), mix(PAL.paper[3], PAL.blue[5], 0.22), mix(PAL.paper[4], PAL.blue[6], 0.18), mix(PAL.paper[5], PAL.blue[6], 0.12)];

// ------------------------------------------------------------------ props
function glassDoorToPecera(g) {
  const x = 6, y = 26, w = 32, h = 70;
  rect(g, x - 3, y - 3, w + 6, h + 3, PAL.metal[3]); frameRect(g, x - 3, y - 3, w + 6, h + 3, PAL.metal[1]);
  hline(g, x - 2, y - 2, w + 4, PAL.metal[7]); vline(g, x - 2, y - 2, h + 2, PAL.metal[6]);
  // la Pecera al otro lado: paredes verdes iluminadas en frío, filas de mesas con pantallas, ventana con lluvia
  gradV(g, x, y, w, h, [PAL.teal[3], PAL.green[5], PAL.green[4]]);
  rect(g, x, y, w, 5, PAL.metal[2]); rect(g, x + 4, y + 3, 10, 2, '#eaffee'); rect(g, x + 20, y + 3, 10, 2, '#eaffee');
  rect(g, x + 3, y + 10, 14, 10, PAL.night[1]); rect(g, x + 4, y + 11, 12, 8, PAL.night[2]);   // ventana
  for (let i = 0; i < 4; i++) px(g, x + 5 + i * 3, y + 15, PAL.gold[5]);
  rect(g, x, y + 36, w, 2, PAL.teal[2]);                          // zócalo
  gradV(g, x, y + 38, w, h - 38, [PAL.metal[2], PAL.metal[1]]);   // moqueta
  for (let i = 0; i < 3; i++) {                                    // mesas con pantallas encendidas, sillas vacías
    const dx = x + 3 + i * 10;
    rect(g, dx, y + 30, 8, 3, PAL.paper[4]); rect(g, dx + 1, y + 33, 6, 5, PAL.paper[2]);
    rect(g, dx + 1, y + 24, 6, 5, PAL.blue[3]); px(g, dx + 2, y + 26, PAL.gold[5]); px(g, dx + 4, y + 27, PAL.crt[5]);
    glow(g, dx + 4, y + 26, 8, 6, '#9fe8ff', 0.18, 3);
    rect(g, dx + 1, y + 42, 6, 8, JACKETS.navy[2]); rect(g, dx + 2, y + 41, 4, 3, i === 1 ? JACKETS.beige[3] : JACKETS.camel[3]);
  }
  // cristal: reflejo y esmerilado inferior con "REDACCIÓN"
  g.save(); g.globalAlpha = 0.16; poly(g, [[x + 2, y + h], [x + 10, y + h], [x + 24, y], [x + 16, y]], '#ffffff'); g.restore();
  rect(g, x, y + 54, w, 9, PAL.teal[6]); ditherOverlay(g, x, y + 54, w, 9, '#ffffff', 0.4);
  hline(g, x, y + 54, w, PAL.teal[7]); hline(g, x, y + 62, w, PAL.teal[4]);
  tiny(g, 'PECERA', x + (w >> 1), y + 57, PAL.teal[1], { align: 'center' });
  // marco de la hoja + tirador + barra
  frameRect(g, x, y, w, h, PAL.metal[3]);
  rect(g, x + w - 5, y + 36, 2, 10, PAL.metal[7]); vline(g, x + w - 4, y + 36, 10, PAL.metal[3]);
  rect(g, x - 3, y + h, w + 6, 2, PAL.metal[2]);
}

function postitWall(g) {
  const x = 46, y = 26, w = 44, h = 56;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.3);
  rect(g, x, y, w, h, PAL.paper[7]); frameRect(g, x, y, w, h, PAL.paper[3]);
  const r = rng(1999);
  const cols = [POSTIT.b, POSTIT.b, POSTIT.b, POSTIT.y, POSTIT.g, POSTIT.p];   // el azul es el que más se gasta
  for (let row = 0; row < 8; row++) for (let col = 0; col < 6; col++) {
    const px0 = x + 2 + col * 7 + Math.floor(r() * 2), py0 = y + 2 + row * 7 + Math.floor(r() * 2);
    postit(g, px0, py0, cols[Math.floor(r() * cols.length)], { w: 5, h: 5, lines: false });
    if (r() < 0.6) { hline(g, px0 + 1, py0 + 1, 3, PAL.ink[3]); hline(g, px0 + 1, py0 + 3, 2, PAL.ink[3]); }
  }
  // dos pósits sueltos cayéndose
  postit(g, x + 8, y + h - 2, POSTIT.p, { w: 5, h: 5, lines: false });
}

function matriz(g) {
  const x = 90, y = 20, w = 60, h = 46;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.3);
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.metal[5]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.metal[2]);
  rect(g, x, y, w, h, PAL.paper[7]);
  hline(g, x - 2, y + h + 2, w + 4, PAL.metal[3]); rect(g, x + 12, y + h + 2, 36, 2, PAL.metal[4]);
  // ejes: COSTE (horizontal), DISPONIBILIDAD (vertical)
  vline(g, x + 33, y + 3, h - 11, PAL.ink[3]); hline(g, x + 6, y + 22, w - 8, PAL.ink[3]);
  poly(g, [[x + 32, y + 2], [x + 35, y + 2], [x + 33.5, y]], PAL.ink[3]);
  tiny(g, 'COSTE', x + 33, y + h - 6, PAL.blue[3], { align: 'center' });
  ['D', 'I', 'S', 'P'].forEach((c, i) => tiny(g, c, x + 2, y + 7 + i * 6, PAL.blue[3]));
  // cuadrantes
  tiny(g, 'IDEAL', x + 6, y + 3, PAL.ink[3]);
  tiny(g, 'CARO', x + 36, y + 3, PAL.metal[4]);
  tiny(g, 'BARATO', x + 7, y + 25, PAL.metal[4]);
  tiny(g, 'PRESC.', x + 36, y + 25, PAL.red[3]);
  // pósit rosa VACANTE en el cuadrante IDEAL
  postit(g, x + 5, y + 10, POSTIT.p, { w: 28, h: 9, lines: false }); tiny(g, 'VACANTE', x + 19, y + 12, PAL.red[2], { align: 'center' });
  // nombres diminutos: toda la plantilla en «prescindible»
  const r = rng(2222);
  for (let i = 0; i < 8; i++) { const nx = x + 36 + Math.floor(r() * 20), ny = y + 31 + Math.floor(r() * 10); hline(g, nx, ny, 2 + Math.floor(r() * 3), PAL.ink[2]); }
  for (let i = 0; i < 5; i++) hline(g, x + 8 + Math.floor(r() * 20), y + 31 + Math.floor(r() * 9), 3, PAL.metal[4]);
  for (let i = 0; i < 3; i++) hline(g, x + 38 + Math.floor(r() * 16), y + 9 + Math.floor(r() * 10), 3, PAL.metal[4]);
  // el pósit azul extra (Evaristo) en el cuadrante PRESCINDIBLE
  postit(g, x + 45, y + 33, POSTIT.b, { w: 9, h: 8 });
  px(g, x + 47, y + 35, PAL.ink[2]); px(g, x + 48, y + 35, PAL.ink[2]); px(g, x + 49, y + 35, PAL.ink[2]); px(g, x + 47, y + 37, PAL.ink[2]); px(g, x + 49, y + 37, PAL.ink[2]);
}

function sofa(g) {
  const x = 86, y = 72, w = 58;
  shadowEllipse(g, x + w / 2, 99, w / 2 + 4, 4, 0.75);
  const L = [PAL.paper[4], PAL.paper[5], PAL.paper[6], PAL.paper[7], PAL.white];
  // respaldo
  poly(g, [[x + 4, y], [x + w - 4, y], [x + w - 2, y + 16], [x + 2, y + 16]], (xx, yy) => ditherPick(xx, yy, [L[3], L[2], L[1]], (yy - y) / 16 * 0.8 + (xx - x) / w * 0.2));
  hline(g, x + 4, y, w - 8, L[4]);
  for (let i = 1; i < 3; i++) vline(g, x + Math.round(w * i / 3), y + 2, 14, L[1]);
  // asiento (dos cojines) y brazos
  for (const bx of [x + 6, x + 6 + 23]) { bevel(g, bx, y + 16, 23, 9, L[3], L[4], L[1]); ditherOverlay(g, bx + 1, y + 20, 21, 4, L[0], 0.3); px(g, bx + 11, y + 19, L[0]); }
  for (const ax of [x, x + w - 7]) {
    rect(g, ax, y + 7, 7, 19, L[2]); hline(g, ax, y + 7, 7, L[4]); vline(g, ax, y + 7, 19, L[3]); vline(g, ax + 6, y + 8, 18, L[0]);
    ellipse(g, ax + 3, y + 8, 3, 2, L[3]);
  }
  // patas cromadas
  for (const lx of [x + 3, x + w - 5]) { rect(g, lx, y + 26, 2, 3, PAL.metal[6]); }
  hline(g, x + 7, y + 25, w - 14, L[0]);
  // cojín de monograma
  rect(g, x + 22, y + 11, 8, 7, PAL.gold[3]); hline(g, x + 22, y + 11, 8, PAL.gold[5]); px(g, x + 26, y + 14, PAL.gold[1]);
}

function titulatorStand(g) {
  const x = 148, y = 70;
  // atril metálico
  shadowEllipse(g, x + 11, 99, 12, 2.5, 0.7);
  rect(g, x + 10, y + 20, 2, 7, PAL.metal[4]); rect(g, x + 5, y + 26, 12, 2, PAL.metal[3]); hline(g, x + 5, y + 26, 12, PAL.metal[6]);
  poly(g, [[x + 1, y + 16], [x + 21, y + 16], [x + 19, y + 21], [x + 3, y + 21]], PAL.metal[5]);
  hline(g, x + 1, y + 16, 20, PAL.metal[7]);
  // patas
  line(g, x + 11, y + 28, x + 3, y + 29, PAL.metal[3]);
}

function mesaDireccion(g) {
  const x = 164, y = 74, w = 64;
  shadowEllipse(g, x + w / 2, 101, w / 2 + 6, 3.5, 0.8);
  const Wd = PAL.wood;
  // tapa
  poly(g, [[x + 3, y], [x + w - 3, y], [x + w, y + 7], [x, y + 7]], (xx, yy) => ditherPick(xx, yy, [Wd[5], Wd[6], Wd[7]], 0.2 + (yy - y) / 7 * 0.7));
  hline(g, x, y + 7, w, Wd[7]); hline(g, x, y + 8, w, Wd[2]);
  // frente tallado
  gradV(g, x, y + 9, w, 18, [Wd[4], Wd[3], Wd[2]]);
  rect(g, x, y + 9, 3, 18, Wd[2]); rect(g, x + w - 3, y + 9, 3, 18, Wd[1]);
  frameRect(g, x + 5, y + 11, w - 10, 13, Wd[2]); hline(g, x + 6, y + 23, w - 12, Wd[5]);
  frameRect(g, x + 8, y + 13, w - 16, 9, Wd[3]);
  // placa DIRECCIÓN (latón)
  bevel(g, x + (w >> 1) - 20, y + 14, 40, 7, PAL.gold[4], PAL.gold[6], PAL.gold[2]);
  tiny(g, 'DIRECCIÓN', x + (w >> 1), y + 15, PAL.ink[1], { align: 'center' });
  // informe encima: «Lo que quiere el Lector Medio»
  rect(g, x + 26, y + 1, 14, 5, PAL.paper[7]); hline(g, x + 26, y + 5, 14, PAL.paper[3]); rect(g, x + 28, y + 2, 7, 1, PAL.blue[4]);
  // lámpara de banquero
  rect(g, x + 8, y + 2, 6, 3, PAL.crt[2]); rect(g, x + 10, y - 5, 2, 7, PAL.gold[3]); rect(g, x + 7, y - 7, 8, 3, PAL.crt[3]); hline(g, x + 7, y - 7, 8, PAL.crt[5]);
  // bandeja de entrada vacía
  rect(g, x + 48, y + 2, 9, 3, PAL.metal[4]); hline(g, x + 48, y + 2, 9, PAL.metal[7]);
  // patas
  rect(g, x + 2, y + 27, 3, 4, Wd[1]); rect(g, x + w - 5, y + 27, 3, 4, Wd[1]);
}

function perchero(g) {
  const x = 234;
  shadowEllipse(g, x, 98, 9, 2, 0.7);
  rect(g, x - 1, 40, 3, 58, PAL.wood[3]); vline(g, x - 1, 40, 58, PAL.wood[6]); vline(g, x + 1, 40, 58, PAL.wood[1]);
  rect(g, x - 2, 38, 4, 3, PAL.wood[3]);
  // ganchos
  for (const [dx, dy] of [[-7, 44], [6, 44], [-6, 52], [5, 52]]) { line(g, x, dy + 2, x + dx, dy - 1, PAL.metal[4]); px(g, x + dx, dy - 2, PAL.metal[6]); }
  // base de tres patas
  line(g, x, 94, x - 9, 98, PAL.wood[2]); line(g, x, 94, x + 9, 98, PAL.wood[2]); rect(g, x - 3, 93, 6, 3, PAL.wood[3]);
}

function gervasioDesk(g) {
  const x = 244, y = 80, w = 40;
  shadowEllipse(g, x + w / 2, 101, w / 2 + 4, 3, 0.7);
  const Wd = PAL.wood;
  poly(g, [[x + 2, y], [x + w - 2, y], [x + w, y + 5], [x, y + 5]], (xx, yy) => ditherPick(xx, yy, [Wd[5], Wd[6]], (yy - y) / 5));
  hline(g, x, y + 5, w, Wd[7]);
  gradV(g, x, y + 6, w, 15, [Wd[3], Wd[2], Wd[1]]);
  rect(g, x + 3, y + 8, 14, 11, Wd[1]); rect(g, x + 20, y + 8, 16, 3, Wd[4]); rect(g, x + 20, y + 12, 16, 3, Wd[4]); rect(g, x + 20, y + 16, 16, 3, Wd[4]);
  for (let i = 0; i < 3; i++) rect(g, x + 26, y + 9 + i * 4, 4, 1, PAL.gold[4]);
  // monitor con la sesión abierta (bandeja de Enviados)
  lcd(g, x + 3, y - 18, 22, 16, { kind: 'article', seed: 77 });
  rect(g, x + 4, y - 17, 20, 2, PAL.blue[5]); tiny(g, 'ENV.', x + 5, y - 17, PAL.paper[7]);
  // tres móviles cargando
  for (let i = 0; i < 3; i++) {
    const mx = x + 29 + i * 4;
    rect(g, mx, y - 6, 3, 6, PAL.ink[1]); rect(g, mx, y - 6, 3, 1, PAL.metal[5]); px(g, mx + 1, y - 4, i === 0 ? PAL.crt[5] : i === 1 ? PAL.gold[5] : PAL.red[4]);
    vline(g, mx + 1, y, 1, PAL.ink[0]);
  }
  rect(g, x + 28, y - 1, 14, 2, PAL.metal[2]);   // regleta
  cable(g, x + 29, y + 1, x + 20, y + 14, 5, PAL.ink[0], 10);
  // teclado
  rect(g, x + 6, y + 1, 12, 2, PAL.paper[2]);
}

function doorToSala(g) {
  const x = 288, y = 34, w = 26, h = 62;
  rect(g, x - 3, y - 3, w + 6, h + 3, PAL.wood[1]);
  rect(g, x - 2, y - 2, w + 4, h + 2, PAL.wood[3]); hline(g, x - 2, y - 2, w + 4, PAL.wood[5]); vline(g, x - 2, y - 2, h + 2, PAL.wood[5]);
  gradH(g, x, y, w, h, [PAL.wood[5], PAL.wood[4], PAL.wood[3]]);
  paint(g, x, y, w, h, (xx, yy) => (hash2(xx, yy >> 2, 4) < 0.15 ? PAL.wood[3] : null));
  // ojo de cristal esmerilado
  const gx = x + 4, gy = y + 6, gw = w - 8, gh = 30;
  rect(g, gx - 1, gy - 1, gw + 2, gh + 2, PAL.wood[1]);
  paint(g, gx, gy, gw, gh, (xx, yy) => ditherPick(xx, yy, [PAL.teal[4], PAL.teal[5], PAL.teal[6], PAL.paper[5]], 0.2 + (xx - gx) / gw * 0.3 + (yy - gy) / gh * 0.3));
  noise(g, gx, gy, gw, gh, PAL.teal[7], 0.07, 3);
  frameRect(g, x + 3, y + 40, w - 6, 18, PAL.wood[2]); hline(g, x + 4, y + 57, w - 8, PAL.wood[6]);
  rect(g, x + 2, y + 33, 3, 3, PAL.gold[3]); px(g, x + 2, y + 33, PAL.gold[6]);
  // tirador
  rect(g, x + 2, y + 38, 3, 4, PAL.gold[3]); px(g, x + 2, y + 38, PAL.gold[6]);
  // sombra de la gente que hay dentro, en el cristal
  g.save(); g.globalAlpha = 0.25; ellipse(g, gx + 9, gy + 22, 3, 3, PAL.ink[1]); rect(g, gx + 6, gy + 25, 7, 5, PAL.ink[1]); g.restore();
}

function ficus(g, x, y) { plant(g, x, y, { size: 36, seed: 11, leaves: 18, potW: 11, pot: PAL.metal }); }

// ------------------------------------------------------------------ fondo
function drawRoom(g) {
  // techo con fluorescentes
  gradV(g, 0, 0, W, 15, [PAL.ink[1], PAL.metal[1], PAL.metal[2]]);
  for (let x = 0; x < W; x += 40) vline(g, x, 0, 14, PAL.ink[0]);
  hline(g, 0, 6, W, PAL.ink[1]); hline(g, 0, 14, W, PAL.metal[1]);
  // pared
  wall(g, 0, 15, W, 58, wallRamp, { seed: 4 });
  wainscot(g, 0, 72, W, 26, PAL.wood, { panel: 26 });
  baseboard(g, 0, 94, W, 4, PAL.wood);
  // suelo de tarima
  floorPlanks(g, { x: 0, y: FL, w: W, h: 46, vpx: 160, vpy: 30, plank: 10, ramp: PAL.wood, seed: 8, far: PAL.ink[1], fade: 0.5 });
  ditherOverlay(g, 0, FL, W, 4, PAL.ink[0], 0.5);
  // alfombra bajo la mesa
  rug(g, [[158, 101], [236, 101], [262, 128], [134, 128]], PAL.red, { border: PAL.gold[3] });
  rug(g, [[74, 118], [112, 118], [118, 134], [66, 134]], PAL.blue, { border: PAL.gold[3] });

  for (const x of [28, 134, 240]) fluorescent(g, x, 10, 44, true);
  for (const x of [28, 134, 240]) glow(g, x + 22, 20, 52, 24, '#fff4dc', 0.1);

  // cristal izquierdo hacia la Pecera
  glassDoorToPecera(g);
  // pared de pósits y matriz 2x2
  postitWall(g);
  matriz(g);

  // ventanal de cristal con persianas a media altura (detrás de la mesa)
  {
    const x = 156, y = 20, w = 70, h = 42;
    cityWindow(g, x, y, w, h, { sky: 'night', seed: 21, blinds: false, mullions: true });
    rainyGlassStatic(g, x, y, w, h, 6);
    blinds(g, x, y + 1, w, h, { down: 20, color: PAL.paper });
  }
  // atril del Titulator (el portátil lo dibuja el objeto)
  titulatorStand(g);
  sofa(g);
  perchero(g);
  gervasioDesk(g);
  doorToSala(g);
  
  wallClock(g, 264, 55, 6);
  // póster «DISRUPCIÓN» con un avión de papel que se estrella
  {
    const x = 238, y = 21, w = 42, h = 22;
    rect(g, x - 1, y - 1, w + 2, h + 2, PAL.metal[2]); rect(g, x, y, w, h, PAL.blue[2]); gradV(g, x, y, w, 12, [PAL.blue[4], PAL.blue[2]]);
    poly(g, [[x + 12, y + 6], [x + 30, y + 2], [x + 22, y + 10]], PAL.paper[7]); line(g, x + 12, y + 6, x + 22, y + 10, PAL.paper[3]);
    tiny(g, 'DISRUPCIÓN', x + (w >> 1), y + 14, PAL.gold[5], { align: 'center' });
    rect(g, x, y + 20, w, 2, PAL.ink[1]);
  }
  // pantallita encima de la puerta: marco (el contenido, en el objeto)
  rect(g, 279, 15, 42, 15, PAL.ink[1]); frameRect(g, 279, 15, 42, 15, PAL.metal[3]);

  // luz cálida de la lámpara + sombras de contacto
  glow(g, 178, 70, 20, 12, PAL.gold[5], 0.18);
  glow(g, 205, 80, 40, 14, PAL.gold[5], 0.07);
  fadeRows(g, 0, FL, W, 8, PAL.ink[0], 0.35, 0, 4);
  vignette(g, W, 144, 0.42);
}

// ------------------------------------------------------------------ objetos
const TIT = [
  [['A'], PAL.crt[5]], [['B'], PAL.gold[5]], [['C'], PAL.blue[6]], [['D'], '#ff8aa0'],
];
function drawTitulator(g, view, t) {
  const x = 146, y = 62;
  // portátil plateado visto de frente con pegatina sonriente
  rect(g, x, y + 13, 24, 3, PAL.metal[5]); hline(g, x, y + 13, 24, PAL.metal[7]); hline(g, x, y + 15, 24, PAL.metal[2]);
  bevel(g, x + 1, y, 22, 13, PAL.metal[6], PAL.metal[7], PAL.metal[3]);
  const sx = x + 3, sy = y + 2, sw = 18, sh = 9;
  const k = Math.floor(t / 2600) % 4;
  const glitch = (Math.floor(t / 7000) % 5) === 4 && (t % 7000) < 500;
  rect(g, sx, sy, sw, sh, glitch ? '#300606' : PAL.ink[1]);
  if (glitch) {
    for (let i = 0; i < 4; i++) hline(g, sx + 1, sy + 1 + i * 2, 4 + ((i * 5) % 11), '#ff3a30');
  } else {
    const c = TIT[k][1];
    rect(g, sx, sy, sw, 2, c);
    for (let i = 0; i < 3; i++) hline(g, sx + 1, sy + 3 + i * 2, 4 + ((i * 7 + k * 3) % 13), PAL.paper[6]);
    const scroll = Math.floor(t / 90) % 20;
    for (let i = 0; i < 18; i += 3) px(g, sx + ((i + scroll) % 18), sy + 8, c);
  }
  ditherOverlay(g, sx, sy, sw, 2, '#ffffff', 0.12);
  glow(g, x + 12, y + 6, 22, 14, '#b8d8ff', 0.1, 3);
  // pegatina sonriente
  rect(g, x + 18, y + 18, 5, 5, PAL.gold[5]); px(g, x + 19, y + 19, PAL.ink[1]); px(g, x + 21, y + 19, PAL.ink[1]); px(g, x + 19, y + 21, PAL.ink[1]); px(g, x + 20, y + 22, PAL.ink[1]); px(g, x + 21, y + 21, PAL.ink[1]);
}

function drawPuertaSala(g, view, t) {
  const a3 = !!view.flag('acto_3_iniciado'), libre = !!view.flag('reunion_terminada') && !a3;
  const x = 280, y = 17, w = 40, h = 12;
  rect(g, x, y, w, h, libre ? PAL.crt[1] : '#3a0808');
  if (libre) {
    tiny(g, 'LIBRE', x + (w >> 1), y + 3, PAL.crt[6], { align: 'center' });
    hline(g, x + 2, y + 9, w - 4, PAL.crt[4]);
  } else if (a3) {
    tiny(g, 'OCUPADO', x + (w >> 1), y + 1, '#ff5a48', { align: 'center' });
    tiny(g, 'HASTA 2031', x + (w >> 1), y + 7, '#ffb0a0', { align: 'center' });
  } else {
    tiny(g, 'REUNIÓN', x + (w >> 1), y + 2, '#ff5a48', { align: 'center' });
    tiny(g, 'EN CURSO', x + (w >> 1), y + 7, '#ffb0a0', { align: 'center' });
  }
  if ((Math.floor(t / 600) & 1) === 0) px(g, x + 2, y + 2, libre ? PAL.crt[6] : '#ff3a30');
  glow(g, x + w / 2, y + h / 2, 30, 10, libre ? PAL.crt[5] : '#ff3a30', 0.18, 3);
}

function drawHoja(g, view) {
  const a3 = !!view.flag('acto_3_iniciado');
  const x = 292, y = 50;
  // hoja de reservas llena de tachones y pósits
  rect(g, x, y, 15, 20, PAL.paper[7]); frameRect(g, x, y, 15, 20, PAL.paper[3]);
  rect(g, x, y, 15, 3, PAL.metal[5]); tiny(g, 'RES.', x + 2, y + 5, PAL.ink[3]);
  const r = rng(515);
  for (let ly = y + 5; ly < y + 19; ly += 2) { hline(g, x + 1, ly, 8 + Math.floor(r() * 5), PAL.ink[3]); if (r() < 0.6) hline(g, x + 1, ly, 6 + Math.floor(r() * 7), PAL.red[3]); }
  postit(g, x + 9, y + 10, POSTIT.y, { w: 5, h: 5, lines: false }); postit(g, x - 1, y + 14, POSTIT.p, { w: 5, h: 5, lines: false });
  postit(g, x + 3, y + 6, POSTIT.b, { w: 5, h: 5, lines: false });
  if (a3) {
    // folio impreso grande pegado encima: «CONSEJO · ÍÑIGO · HASTA 2031»
    rect(g, x - 3, y + 2, 21, 17, PAL.white); frameRect(g, x - 3, y + 2, 21, 17, PAL.paper[2]);
    tiny(g, 'CONSEJO', x + 7, y + 4, PAL.ink[0], { align: 'center' });
    tiny(g, 'INIGO', x + 7, y + 10, PAL.red[3], { align: 'center' });
    tiny(g, '2031', x + 7, y + 15, PAL.ink[0], { align: 'center' });
    rect(g, x - 3, y + 1, 5, 2, PAL.paper[4]); rect(g, x + 13, y + 1, 5, 2, PAL.paper[4]);
  }
}

function drawMesa(g) { mesaDireccion(g); }

// ------------------------------------------------------------------ geometría
const layout = {
  pajarera_a_pecera: { rect: [2, 22, 40, 76], walkTo: [24, 110], face: 'left' },
  persiana: { rect: [154, 18, 74, 44], walkTo: [190, 108], face: 'up', priority: 0 },
  postits: { rect: [44, 18, 48, 64], walkTo: [66, 110], face: 'up' },
  matriz_2x2: { rect: [88, 18, 64, 50], walkTo: [126, 108], face: 'up' },
  sofa: { rect: [84, 70, 62, 30], walkTo: [100, 113], face: 'up' },
  pantalla_titulator: { rect: [146, 60, 24, 24], walkTo: [158, 110], face: 'up', draw: drawTitulator, priority: 1 },
  mesa_direccion: { rect: [162, 66, 68, 36], walkTo: [196, 114], face: 'up', layer: 'sorted', zy: 100, cache: true, cachePad: 12, draw: drawMesa },
  perchero: { rect: [224, 36, 20, 62], walkTo: [232, 110], face: 'up', priority: 1 },
  ordenador_gervasio: { rect: [244, 58, 40, 26], walkTo: [262, 111], face: 'up' },
  puerta_sala: { rect: [279, 14, 42, 84], walkTo: [298, 108], face: 'right', draw: drawPuertaSala },
  hoja_reservas: { rect: [286, 42, 22, 30], walkTo: [296, 110], face: 'up', priority: 1, draw: drawHoja },
  posit_evaristo: { rect: [133, 51, 12, 11], walkTo: [140, 108], face: 'up', priority: 2 },
  lector_medio: { at: [196, 92, 'down'], walkTo: [196, 114], face: 'up' },
  inigo_sinergia: { at: [116, 101, 'down'], walkTo: [100, 114], face: 'right' },
  gervasio_acta: { at: [262, 104, 'left'], walkTo: [278, 112], face: 'left' },
};
void lightCone; void shade; void tinyW; void chairBack; void rainOnGlass;

export default {
  room: 'pajarera',
  width: W,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [[4, 104], [316, 104], [318, 142], [2, 142]] }],
  entries: { pecera: [30, 114, 'right'], sala_amazonas: [296, 114, 'left'] },
  layout,
  draw: drawRoom,
  animate(g, view, t) {
    rainOnGlass(g, 156, 20, 70, 42, t, 5);
    // la Pecera tras el cristal: parpadean las pantallas
    if ((Math.floor(t / 700) & 1) === 0) { px(g, 15, 52, PAL.gold[5]); px(g, 31, 51, PAL.crt[6]); }
  },
};
