// SALA `pajarera` (en pantalla y en las placas: «DIRECCIÓN»; el apodo no se enseña nunca, orden i) — ARTE Y GEOMETRÍA.
// Paquete P2 del rediseño (docs/GUIA_REDISENO.md §2, §4, §9-§12; propuesta §4.5). 320×144, planta 1, FL = 96.
// De izquierda a derecha:
//   · el TABIQUE DE CRISTAL hacia la Redacción (con la puerta: `pajarera_a_pecera`; placa «1 REDACCIÓN ◄ / LA PECERA»):
//     a través se ven la pantalla de métricas, mesas con pantallas encendidas y sillas con chaqueta; persiana a media
//     altura desde 2015 (`persiana`) en el cristal
//   · la ZONA DEL CONSULTOR: pared de pósits, la matriz 2×2 (COSTE entero), el pósit de Evaristo asomando por la esquina
//     de PRESCINDIBLE; el sofá blanco con Íñigo SENTADO; el Lector Medio aparcado como expositor de Marketing delante de
//     los pósits (nunca junto a una mesa de mando); el Titulator en su ATRIL propio, pantalla de 30×19 legible
//   · DIRECCIÓN: la mesa grande con su cartelito «RESERVADO», el cuenco y el informe en blanco; el ventanal a la ciudad
//     detrás; el perchero de latón; la mesa de Gervasio (sentado tras ella en el Acto II) con tres móviles; la puerta
//     de la Sala con su pantallita de estado y la placa «1 AMAZONAS / SALA DE REUNIONES»; la hoja de reservas.
// En esta planta no hay director de periódico: ni retrato, ni placa, ni alusión.
// Estados: pantalla_titulator (estado `ayudame` medio segundo en la 3.ª mirada; vacía en el Acto III), puerta_sala
// (EN CURSO / LIBRE / OCUPADO HASTA 2031), hoja_reservas (folio del Acto III), persiana (fija, a media altura).
import {
  PAL, rect, hline, vline, frameRect, px, line, poly, ellipse, paint, bevel, ditherOverlay, gradV,
  glow, lightCone, shadowEllipse, ditherPick, hash2, rng, fadeRows, vignette, rug, cityWindow, plant, shade, label,
} from '../../../engine/draw.js';
import { postit, POSTIT, lcd, JACKETS, chairBack, blinds, rainOnGlass, rainyGlassStatic, cable, deskFront } from './lib-oficina.js';
import * as kit from '../../lib/kit.js';

const W = 320;
const FL = 96;
const { micro } = kit;
const INK = kit.INK;
const NOGAL = ['#2a180e', '#3a2416', '#4a3020', '#5a3c28', '#6a4830'];
const LATON = kit.DEPTO.direccion.c;

// ================================================================== FONDO
function techo(g) {
  gradV(g, 0, 0, W, 12, [PAL.ink[0], '#1e140e', '#2a1c12']);
  for (let x = 0; x < W; x += 20) vline(g, x, 0, 11, '#140c08');
  hline(g, 0, 11, W, LATON); hline(g, 0, 12, W, NOGAL[0]);
  // downlights cálidos
  for (const x of [70, 128, 196, 262]) { ellipse(g, x, 9, 4, 1.5, '#fff0c0'); glow(g, x, 16, 22, 10, '#ffd890', 0.14, 3); }
}
function paredes(g) {
  // nogal en paneles verticales con veta, junquillo de latón y friso inferior más oscuro
  paint(g, 42, 12, W - 42, FL - 12, (x, y) => ditherPick(x, y, NOGAL, 0.42 + ((x * 5 + (y >> 2)) % 13) / 40 - (y - 12) / 260 + (hash2(x, y >> 1, 3) < 0.1 ? 0.12 : 0)));
  for (let x = 44; x < W; x += 22) { vline(g, x, 13, 52, NOGAL[0]); vline(g, x + 1, 13, 52, NOGAL[3]); }
  rect(g, 42, 66, W - 42, 2, LATON); hline(g, 42, 68, W - 42, shade(LATON, -0.5));
  paint(g, 42, 69, W - 42, FL - 73, (x, y) => ditherPick(x, y, [NOGAL[0], NOGAL[1], NOGAL[2]], 0.5 + ((x % 26) < 2 ? -0.4 : 0) + (y === 70 ? 0.4 : 0)));
  rect(g, 42, FL - 4, W - 42, 4, NOGAL[0]); hline(g, 42, FL - 4, W - 42, shade(LATON, -0.2));
}
function suelo(g) {
  // parqué en espiga cálido, con brillo
  paint(g, 0, FL, W, 144 - FL, (x, y) => {
    const t = (y - FL) / 48;
    // espiga: tablillas de 10 px que alternan dirección, con su junta oscura
    const u = Math.floor((x + (y - FL) * 1.6) / 10), v = Math.floor((x - (y - FL) * 1.6) / 10);
    const k = (u + v) & 1;
    const junta = ((x + Math.round((y - FL) * 1.6 * (k ? 1 : -1))) % 10 + 10) % 10 === 0;
    if (junta) return PAL.wood[1];
    return ditherPick(x, y, [PAL.wood[2], PAL.wood[3], PAL.wood[4], PAL.wood[5]], 0.2 + t * 0.5 + (k ? 0.12 : -0.04));
  });
  ditherOverlay(g, 0, FL, W, 3, PAL.ink[0], 0.55);
  fadeRows(g, 0, FL + 3, W, 6, PAL.ink[0], 0.3, 0, 3);
  // alfombra azul bajo el sofá, roja bajo la mesa grande
  rug(g, [[56, 101], [126, 101], [134, 118], [48, 118]], PAL.blue, { border: PAL.gold[3] });
  rug(g, [[158, 101], [238, 101], [256, 124], [140, 124]], PAL.red, { border: PAL.gold[3] });
}

/** el tabique de cristal hacia la Redacción: se ve la Pecera de verdad (pantalla de métricas, mesas, chaquetas) */
/** la Redacción vista a través del cristal (se pinta dos veces: en el tabique y dentro de la hoja de la puerta) */
function vistaRedaccion(g) {
  const x = 0, y = 12, w = 42, h = FL - 12;
  // la Redacción al otro lado, iluminada en frío: pared verde agua con su filete, la pantalla de métricas (con su
  // línea roja que baja), mesas con pantallas encendidas y sillas con chaqueta, y su moqueta azul pizarra
  paint(g, x, y, w, h, (xx, yy) => ditherPick(xx, yy, ['#2c6a66', '#347a74', '#3e8a82'], 0.7 - (yy - y) / h * 0.6));
  rect(g, x, y, w, 3, PAL.ink[1]); for (let i = 0; i < 2; i++) { rect(g, x + 3 + i * 21, y + 1, 14, 2, '#eaffee'); glow(g, x + 10 + i * 21, y + 6, 12, 5, '#eaffee', 0.2, 3); }
  rect(g, x + 4, y + 18, 32, 14, PAL.ink[0]); rect(g, x + 5, y + 19, 30, 12, PAL.blue[1]);                 // la pantalla de métricas
  rect(g, x + 7, y + 21, 10, 3, '#fff4c8'); for (let i = 0; i < 26; i++) px(g, x + 7 + i, y + 26 + Math.round(i / 9), '#ff5a48');
  glow(g, x + 20, y + 25, 24, 12, '#8ec8ff', 0.22, 3);
  hline(g, x, y + 40, w, kit.DEPTO.web.c); hline(g, x, y + 41, w, shade(kit.DEPTO.web.c, -0.4));
  gradV(g, x, y + 56, w, h - 56, ['#3a4858', '#465668', '#506274']);                                       // su moqueta
  for (let i = 0; i < 3; i++) {                                                                           // mesas, pantallas y chaquetas
    const dx = x + 2 + i * 13;
    rect(g, dx + 1, y + 37, 9, 7, PAL.ink[1]); rect(g, dx + 2, y + 38, 7, 5, [PAL.blue[4], PAL.crt[3], PAL.blue[5]][i]); px(g, dx + 4, y + 40, PAL.gold[5]);
    rect(g, dx, y + 45, 12, 3, PAL.paper[5]); rect(g, dx + 1, y + 48, 10, 7, PAL.paper[3]);
    const J = [JACKETS.navy, JACKETS.beige, JACKETS.olive][i];
    rect(g, dx + 2, y + 50, 8, 10, J[2]); rect(g, dx + 3, y + 49, 6, 3, J[4]); rect(g, dx + 5, y + 60, 2, 4, PAL.metal[2]);
    glow(g, dx + 5, y + 40, 8, 6, '#9fe8ff', 0.2, 3);
  }
}

function cristalRedaccion(g) {
  const x = 0, y = 12, w = 42, h = FL - 12;
  vistaRedaccion(g);
  // el cristal: reflejos, montante de acero y la persiana a media altura (desde 2015)
  g.save(); g.globalAlpha = 0.16; poly(g, [[x + 4, y + h], [x + 12, y + h], [x + 30, y], [x + 22, y]], '#ffffff'); g.restore();
  blinds(g, x, y + 3, w - 3, 13, { down: 12, color: PAL.paper });
  rect(g, x + w - 3, y, 3, h, PAL.metal[4]); vline(g, x + w - 3, y, h, PAL.metal[6]); vline(g, x + w - 1, y, h, PAL.metal[2]);
  // la puerta de cristal (salida): marco del kit, tirador de latón, franja esmerilada y umbral verde agua (planta 1)
  kit.marcoPuerta(g, 6, 38, 30, FL - 38);
  g.save(); g.beginPath(); g.rect(6, 38, 30, FL - 38); g.clip(); vistaRedaccion(g); g.restore();
  g.save(); g.globalAlpha = 0.12; rect(g, 6, 38, 30, FL - 38, '#d8f8ff'); poly(g, [[8, FL], [14, FL], [30, 38], [24, 38]], '#ffffff'); g.restore();
  rect(g, 6, 38, 30, 3, PAL.metal[3]); vline(g, 6, 38, FL - 38, PAL.metal[5]); vline(g, 35, 38, FL - 38, PAL.metal[2]);
  rect(g, 6, 74, 30, 7, '#a8dcd4'); ditherOverlay(g, 6, 74, 30, 7, '#ffffff', 0.4); hline(g, 6, 74, 30, '#e0fff8');
  rect(g, 30, 56, 2, 12, LATON); vline(g, 31, 56, 12, PAL.gold[2]);
  kit.umbral(g, 4, FL + 1, 34, 5, kit.PLANTA['1'].c);
  kit.cantoVivo(g, 3, 35, 36, FL - 35);
  // placa de destino: la Redacción, con su apodo debajo
  kit.placaSala(g, 2, 1, 'pecera', { flecha: '<' });
}

function postitWall(g) {
  const x = 46, y = 24, w = 42, h = 42;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.3);
  rect(g, x - 1, y - 1, w + 2, h + 2, PAL.metal[3]); rect(g, x, y, w, h, PAL.paper[7]);
  const r = rng(1999);
  const cols = [POSTIT.b, POSTIT.b, POSTIT.b, POSTIT.y, POSTIT.g, POSTIT.p];      // el azul (excusas) es el que más se gasta
  for (let row = 0; row < 6; row++) for (let col = 0; col < 6; col++) {
    const px0 = x + 1 + col * 7 + Math.floor(r() * 2), py0 = y + 1 + row * 7 + Math.floor(r() * 2);
    postit(g, px0, py0, cols[Math.floor(r() * cols.length)], { w: 5, h: 5, lines: false });
    if (r() < 0.6) { hline(g, px0 + 1, py0 + 1, 3, PAL.ink[3]); hline(g, px0 + 1, py0 + 3, 2, PAL.ink[3]); }
  }
  postit(g, x + 30, y + h + 2, POSTIT.p, { w: 5, h: 5, lines: false });            // uno, cayéndose
}

function matriz(g) {
  const x = 92, y = 18, w = 60, h = 40;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.3);
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.metal[5]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.metal[2]);
  rect(g, x, y, w, h, PAL.paper[7]);
  hline(g, x - 2, y + h + 2, w + 4, PAL.metal[3]); rect(g, x + 12, y + h + 2, 36, 2, PAL.metal[4]);
  // ejes: COSTE (horizontal, entero), DISP. (vertical)
  vline(g, x + 31, y + 2, h - 10, PAL.ink[3]); hline(g, x + 6, y + 18, w - 8, PAL.ink[3]);
  poly(g, [[x + 30, y + 2], [x + 33, y + 2], [x + 31.5, y]], PAL.ink[3]); poly(g, [[x + w - 2, y + 17], [x + w - 2, y + 20], [x + w, y + 18.5]], PAL.ink[3]);
  micro(g, 'COSTE', x + 31, y + h - 6, PAL.blue[3], { align: 'center' });
  ['D', 'I', 'S', 'P'].forEach((c, i) => micro(g, c, x + 1, y + 5 + i * 6, PAL.blue[3]));
  micro(g, 'IDEAL', x + 6, y + 2, PAL.ink[3]);
  micro(g, 'CARO', x + 35, y + 2, PAL.metal[4]);
  micro(g, 'BARATO', x + 6, y + 21, PAL.metal[4]);
  micro(g, 'PRESC.', x + 35, y + 21, PAL.red[3]);
  // pósit rosa VACANTE en IDEAL
  postit(g, x + 5, y + 8, POSTIT.p, { w: 25, h: 8, lines: false }); micro(g, 'VACANTE', x + 18, y + 10, PAL.red[2], { align: 'center' });
  // toda la plantilla en PRESCINDIBLE (rayitas de nombres)
  const r = rng(2222);
  for (let i = 0; i < 9; i++) { const nx = x + 35 + Math.floor(r() * 20), ny = y + 27 + Math.floor(r() * 6); hline(g, nx, ny, 2 + Math.floor(r() * 3), PAL.ink[2]); }
  for (let i = 0; i < 4; i++) hline(g, x + 7 + Math.floor(r() * 18), y + 28 + Math.floor(r() * 5), 3, PAL.metal[4]);
  kit.cantoVivo(g, x - 2, y - 2, w + 4, h + 4);
}

function sofa(g) {
  const x = 62, y = 74, w = 58;
  shadowEllipse(g, x + w / 2, 101, w / 2 + 4, 3, 0.75);
  const L = [PAL.paper[4], PAL.paper[5], PAL.paper[6], PAL.paper[7], '#ffffff'];
  poly(g, [[x + 4, y], [x + w - 4, y], [x + w - 2, y + 13], [x + 2, y + 13]], (xx, yy) => ditherPick(xx, yy, [L[3], L[2], L[1]], (yy - y) / 13 * 0.8 + (xx - x) / w * 0.2));
  hline(g, x + 4, y, w - 8, L[4]);
  for (let i = 1; i < 3; i++) vline(g, x + Math.round(w * i / 3), y + 2, 11, L[1]);
  for (const bx of [x + 6, x + 6 + 23]) { bevel(g, bx, y + 13, 23, 9, L[3], L[4], L[1]); ditherOverlay(g, bx + 1, y + 17, 21, 4, L[0], 0.3); }
  for (const ax of [x, x + w - 7]) {
    rect(g, ax, y + 5, 7, 18, L[2]); hline(g, ax, y + 5, 7, L[4]); vline(g, ax, y + 5, 18, L[3]); vline(g, ax + 6, y + 6, 17, L[0]);
    ellipse(g, ax + 3, y + 6, 3, 2, L[3]);
  }
  for (const lx of [x + 3, x + w - 5]) rect(g, lx, y + 23, 2, 4, PAL.metal[6]);
  hline(g, x + 7, y + 22, w - 14, L[0]);
  rect(g, x + 44, y + 7, 7, 6, PAL.gold[3]); hline(g, x + 44, y + 7, 7, PAL.gold[5]); px(g, x + 47, y + 10, PAL.gold[1]);   // cojín con monograma
  kit.cantoVivo(g, x, y, w, 27);
}

/** el atril del Titulator (pie de acero con su peana); el portátil y la pantalla los pinta el objeto */
function atril(g) {
  const x = 140;
  shadowEllipse(g, x, 100, 12, 2.5, 0.7);
  rect(g, x - 1, 78, 3, 20, PAL.metal[4]); vline(g, x - 1, 78, 20, PAL.metal[6]);
  rect(g, x - 8, 97, 17, 2, PAL.metal[3]); hline(g, x - 8, 97, 17, PAL.metal[6]);
  cable(g, x + 1, 90, x + 26, 99, 3, PAL.ink[0], 10);
}

function mesaDireccion(g) {
  const x = 164, y = 74, w = 66;
  shadowEllipse(g, x + w / 2, 101, w / 2 + 6, 3.5, 0.8);
  poly(g, [[x + 3, y], [x + w - 3, y], [x + w, y + 7], [x, y + 7]], (xx, yy) => ditherPick(xx, yy, [PAL.wood[5], PAL.wood[6], PAL.wood[7]], 0.2 + (yy - y) / 7 * 0.7));
  hline(g, x, y + 7, w, PAL.wood[7]); hline(g, x, y + 8, w, PAL.wood[2]);
  gradV(g, x, y + 9, w, 17, [PAL.wood[4], PAL.wood[3], PAL.wood[2]]);
  rect(g, x, y + 9, 3, 17, PAL.wood[2]); rect(g, x + w - 3, y + 9, 3, 17, PAL.wood[1]);
  frameRect(g, x + 5, y + 11, w - 10, 12, PAL.wood[2]); hline(g, x + 6, y + 22, w - 12, PAL.wood[5]);
  frameRect(g, x + 8, y + 13, w - 16, 8, PAL.wood[3]);
  // cartelito de mesa «RESERVADO» (de los de restaurante: reservada para una reunión que nunca empieza)
  const cx = x + 10, cy = y - 9;
  poly(g, [[cx, cy + 9], [cx + 2, cy], [cx + 41, cy], [cx + 43, cy + 9]], PAL.paper[7]);
  hline(g, cx + 2, cy, 39, '#ffffff'); hline(g, cx, cy + 9, 44, PAL.paper[2]);
  kit.texto(g, 'RESERVADO', cx + 2, cy + 1, 39, 8, { color: PAL.red[3], fuente: 'micro' });
  // informe en blanco («Lo que quiere el Lector Medio») y cuenco de caramelos corporativos
  rect(g, x + 48, y + 1, 14, 5, PAL.paper[7]); hline(g, x + 48, y + 5, 14, PAL.paper[3]); rect(g, x + 50, y + 2, 7, 1, PAL.blue[4]);
  ellipse(g, x + 6, y + 3, 5, 2, PAL.metal[5]); hline(g, x + 2, y + 4, 9, PAL.metal[2]);
  for (const [dx, c] of [[-3, PAL.red[4]], [0, PAL.blue[5]], [3, PAL.gold[5]], [-1, PAL.teal[5]], [2, PAL.red[5]]]) px(g, x + 6 + dx, y + 1 + (dx & 1), c);
  rect(g, x + 2, y + 26, 3, 3, PAL.wood[1]); rect(g, x + w - 5, y + 26, 3, 3, PAL.wood[1]);
  kit.cantoVivo(g, x, y - 9, w, 35);
}
/** el ventanal tras la mesa grande: la ciudad de noche con lluvia (la persiana va en el cristal de la Redacción) */
function ventanal(g) {
  const x = 168, y = 18, w = 52, h = 40;
  rect(g, x - 3, y - 3, w + 6, h + 6, NOGAL[0]); frameRect(g, x - 3, y - 3, w + 6, h + 6, LATON);
  cityWindow(g, x, y, w, h, { sky: 'night', seed: 21, blinds: false, mullions: true });
  rainyGlassStatic(g, x, y, w, h, 6);
  rect(g, x - 4, y + h + 3, w + 8, 2, NOGAL[3]); hline(g, x - 4, y + h + 3, w + 8, LATON);
}

function perchero(g) {
  const x = 240;
  shadowEllipse(g, x, 99, 9, 2, 0.7);
  rect(g, x - 1, 34, 3, 63, PAL.gold[3]); vline(g, x - 1, 34, 63, PAL.gold[5]); vline(g, x + 1, 34, 63, PAL.gold[1]);
  ellipse(g, x, 33, 3, 2, PAL.gold[4]); px(g, x - 1, 32, PAL.gold[6]);
  for (const [dx, dy] of [[-7, 38], [7, 38], [-6, 46], [6, 46]]) { line(g, x, dy + 3, x + dx, dy, PAL.gold[4]); px(g, x + dx, dy - 1, PAL.gold[6]); }
  line(g, x, 94, x - 9, 99, PAL.gold[2]); line(g, x, 94, x + 9, 99, PAL.gold[2]); rect(g, x - 3, 93, 6, 3, PAL.gold[3]);
  kit.cantoVivo(g, x - 8, 32, 17, 67);
}

function puertaSala(g) {
  const x = 290, y = 38, w = 26, h = FL - y;
  kit.marcoPuerta(g, x, y, w, h);
  paint(g, x, y, w, h, (xx, yy) => ditherPick(xx, yy, [PAL.wood[3], PAL.wood[4], PAL.wood[5]], 0.3 + (xx - x) / w * 0.4 + (hash2(xx, yy >> 2, 4) < 0.15 ? -0.25 : 0)));
  const gx = x + 4, gy = y + 5, gw = w - 8, gh = 24;
  rect(g, gx - 1, gy - 1, gw + 2, gh + 2, PAL.wood[1]);
  paint(g, gx, gy, gw, gh, (xx, yy) => ditherPick(xx, yy, [PAL.green[3], PAL.green[4], PAL.teal[5], PAL.paper[5]], 0.2 + (xx - gx) / gw * 0.3 + (yy - gy) / gh * 0.3));
  g.save(); g.globalAlpha = 0.28; ellipse(g, gx + 9, gy + 16, 3, 3, PAL.ink[1]); rect(g, gx + 6, gy + 19, 7, 5, PAL.ink[1]); g.restore();   // la gente de dentro
  frameRect(g, x + 3, y + 34, w - 6, 18, PAL.wood[2]); hline(g, x + 4, y + 51, w - 8, PAL.wood[6]);
  rect(g, x + 2, y + 30, 3, 4, LATON); px(g, x + 2, y + 30, PAL.gold[6]);
  // marco de la pantallita de estado (el contenido, en el objeto) y la placa del kit
  rect(g, 287, 22, 32, 13, PAL.ink[1]); frameRect(g, 287, 22, 32, 13, PAL.metal[3]);
  kit.placaSala(g, W - 2 - kit.placaSalaW('sala_amazonas', { flecha: '>' }), 1, 'sala_amazonas', { flecha: '>' });
  kit.umbral(g, x - 2, FL + 1, w + 4, 5, kit.DEPTO.direccion.c);
}

function drawRoom(g) {
  techo(g);
  paredes(g);
  suelo(g);
  cristalRedaccion(g);
  postitWall(g);
  matriz(g);
  ventanal(g);
  atril(g);
  sofa(g);
  mesaDireccion(g);
  perchero(g);
  puertaSala(g);
  // lámpara de latón colgada sobre la mesa grande
  vline(g, 197, 12, 14, PAL.gold[2]);
  poly(g, [[190, 26], [204, 26], [208, 32], [186, 32]], (xx) => (xx < 197 ? PAL.gold[5] : PAL.gold[3])); hline(g, 186, 32, 22, PAL.gold[2]);
  hline(g, 189, 33, 16, '#fff4c8');
  lightCone(g, 186, 33, 22, 60, 38, '#ffe6b0', 0.12);
  // luz cálida de las lámparas: charcos en el parqué y sobre la mesa
  glow(g, 196, 72, 40, 16, PAL.gold[5], 0.1);
  glow(g, 92, 110, 40, 8, '#ffe0a0', 0.06, 3);
  glow(g, 196, 112, 50, 8, '#ffe0a0', 0.07, 3);
  vignette(g, W, 144, 0.38);
}

/** primer plano: una mesita baja de cristal delante del sofá y un ficus en la esquina de la Sala (por debajo de y 112) */
function drawFrente(g) {
  // butaca blanca de espaldas, en primer plano (la pareja del sofá del consultor): respaldo capitoné y brazos
  const x = 122, y = 120;
  const L = [PAL.paper[1], PAL.paper[2], PAL.paper[3], PAL.paper[4], PAL.paper[5]];
  for (const ax of [x - 6, x + 34]) { rect(g, ax, y + 10, 8, 14, L[1]); hline(g, ax, y + 10, 8, L[3]); ellipse(g, ax + 4, y + 10, 4, 2, L[2]); }
  poly(g, [[x + 4, y], [x + 30, y], [x + 34, y + 4], [x + 35, y + 24], [x - 1, y + 24], [x, y + 4]], (xx, yy) => ditherPick(xx, yy, [L[3], L[2], L[1]], (yy - y) / 24 * 0.7 + (xx - x) / 34 * 0.3));
  hline(g, x + 4, y, 26, L[4]); hline(g, x + 2, y + 1, 30, L[3]);
  for (let i = 0; i < 3; i++) for (let k = 0; k < 2; k++) px(g, x + 7 + i * 10 + k * 5, y + 6 + k * 6, L[0]);
  ditherOverlay(g, x - 6, y, 48, 24, PAL.ink[0], 0.22);
  ditherOverlay(g, x - 6, y + 18, 48, 6, PAL.ink[0], 0.35);
  // ficus en la esquina, recortado por el borde
  plant(g, 312, 146, { size: 34, seed: 7, leaves: 16, potW: 14, pot: [PAL.ink[0], PAL.ink[1], PAL.metal[1], PAL.metal[2], PAL.metal[3], PAL.metal[4], PAL.metal[5]], leaf: ['#08140c', '#0c1c10', '#102614', '#16301a', '#1c3a20', '#22462a', '#2a5232', '#2a5232'] });
}

// ================================================================== OBJETOS
/** el Titulator en su atril: portátil plateado de cara a la sala, pegatina sonriente; la pantalla (30×19) rota titulares
 *  en 3 líneas de 3×5; estado `ayudame`: «AYÚDAME / ARMARIO / 27» en rojo. Acto III: el atril vacío. */
const TITULARES = [                       // 3 líneas de 8 caracteres como máximo (34 px): siempre enteras
  ['EL IBEX', 'ABRE', 'PLANO.'], ['UN TRUCO', 'SENCILLO', 'HEREDAR'], ['7 FALLOS', 'CON TU', 'PENSIÓN'],
  ['PAPEL:', 'MUERTO', '10 VECES'], ['LA PRIMA', 'SUBE. Y', 'TU PERRO'],
];
function laptop(g, t, lineas, color, glitch) {
  const x = 122, y = 57, w = 38, h = 24;
  rect(g, x + 2, y + h, w - 4, 3, PAL.metal[5]); hline(g, x + 2, y + h, w - 4, PAL.metal[7]); hline(g, x + 2, y + h + 2, w - 4, PAL.metal[2]);
  poly(g, [[x + 6, y + h + 3], [x + w - 6, y + h + 3], [x + w - 10, y + h + 6], [x + 10, y + h + 6]], PAL.metal[3]);    // bandeja del atril
  bevel(g, x, y, w, h, PAL.metal[6], PAL.metal[7], PAL.metal[3]);
  const sx = x + 2, sy = y + 2, sw = w - 4, sh = h - 4;
  rect(g, sx, sy, sw, sh, glitch ? '#300606' : '#08140a');
  if (lineas) lineas.forEach((l, i) => micro(g, l, sx + (sw >> 1), sy + 1 + i * 6, color, { align: 'center', registrar: false }));
  ditherOverlay(g, sx, sy, sw, 2, '#ffffff', 0.1);
  glow(g, x + w / 2, y + h / 2, 26, 16, color, 0.1, 3);
  rect(g, x + w - 8, y + h + 1, 5, 4, PAL.gold[5]); px(g, x + w - 7, y + h + 2, INK); px(g, x + w - 5, y + h + 2, INK); hline(g, x + w - 7, y + h + 3, 3, INK);   // pegatina sonriente, en la base
  kit.cantoVivo(g, x, y, w, h + 3);
  void t;
}
function drawTitulator(g, view, t) {
  if (view.flag('acto_3_iniciado')) {          // se lo han llevado a la Sala: atril vacío y un cable que se va
    const x = 124, y = 81;
    poly(g, [[x + 8, y + 3], [x + 26, y + 3], [x + 22, y + 6], [x + 12, y + 6]], PAL.metal[3]);
    rect(g, x + 14, y, 6, 3, PAL.metal[2]);
    cable(g, x + 17, y + 3, x + 40, y + 16, 3, PAL.ink[0], 10);
    kit.cantoVivo(g, x + 8, y, 18, 6);
    return;
  }
  const k = Math.floor(t / 2600) % TITULARES.length;
  const glitch = (Math.floor(t / 7000) % 5) === 4 && (t % 7000) < 400;
  laptop(g, t, glitch ? null : TITULARES[k], '#B6FF4D', glitch);
}
function drawTitulatorAyudame(g, view, t) {
  laptop(g, t, ['AYÚDAME', 'ARMARIO', '27'], '#ff4a3a', true);
}

/** pantallita de la puerta de la Sala: REUNIÓN EN CURSO (Actos I-II) · LIBRE (reunion_terminada) · OCUPADO HASTA 2031
 *  (Acto III): cambia texto, color y luz */
function drawPuertaSala(g, view, t) {
  const a3 = !!view.flag('acto_3_iniciado'), libre = !!view.flag('reunion_terminada') && !a3;
  const x = 288, y = 23, w = 30, h = 11;
  rect(g, x, y, w, h, libre ? PAL.crt[1] : '#3a0808');
  const L = libre ? [['LIBRE', PAL.crt[6]]] : a3 ? [['OCUPADO', '#ff5a48'], ['HASTA 2031', '#ffb0a0']] : [['REUNIÓN', '#ff5a48'], ['EN CURSO', '#ffb0a0']];
  if (L.length === 1) micro(g, L[0][0], x + (w >> 1), y + 3, L[0][1], { align: 'center' });
  else if (a3) { micro(g, 'OCUPADO', x + (w >> 1), y, L[0][1], { align: 'center' }); micro(g, '2031', x + (w >> 1), y + 6, L[1][1], { align: 'center' }); }
  else { micro(g, 'REUNIÓN', x + (w >> 1), y + 1, L[0][1], { align: 'center' }); micro(g, 'EN CURSO', x + (w >> 1), y + 6, L[1][1], { align: 'center' }); }
  if ((Math.floor(t / 600) & 1) === 0) px(g, x + 1, y + 1, libre ? PAL.crt[6] : '#ff3a30');
  glow(g, x + w / 2, y + h / 2, 26, 10, libre ? PAL.crt[5] : '#ff3a30', 0.18, 3);
  kit.cantoVivo(g, 290 - 3, 38 - 3, 32, FL - 35);
}
/** hoja de reservas junto a la puerta; en el Acto III, el folio impreso de Íñigo pegado encima */
function drawHoja(g, view) {
  const a3 = !!view.flag('acto_3_iniciado');
  const x = 271, y = 40;
  rect(g, x, y, 14, 20, PAL.paper[7]); frameRect(g, x, y, 14, 20, PAL.paper[3]);
  rect(g, x, y, 14, 3, PAL.metal[5]);
  const r = rng(515);
  for (let ly = y + 5; ly < y + 19; ly += 2) { hline(g, x + 1, ly, 8 + Math.floor(r() * 4), PAL.ink[3]); if (r() < 0.6) hline(g, x + 1, ly, 6 + Math.floor(r() * 6), PAL.red[3]); }
  postit(g, x + 8, y + 10, POSTIT.y, { w: 5, h: 5, lines: false }); postit(g, x - 1, y + 14, POSTIT.p, { w: 5, h: 5, lines: false });
  if (a3) {
    rect(g, x - 3, y + 2, 20, 17, '#ffffff'); frameRect(g, x - 3, y + 2, 20, 17, PAL.paper[2]);
    micro(g, 'ÍÑIGO', x + 7, y + 5, PAL.red[3], { align: 'center' });
    micro(g, '2031', x + 7, y + 12, INK, { align: 'center' });
    rect(g, x - 3, y + 1, 5, 2, PAL.paper[4]); rect(g, x + 12, y + 1, 5, 2, PAL.paper[4]);
  }
  kit.cantoVivo(g, x, y, 14, 20);
}
/** la mesa de Gervasio (mueble DELANTE de él: `tras_mesa`), su monitor con la sesión abierta y los tres móviles */
function drawMesaGervasio(g, view) {
  const x = 248, y = 80, w = 38;
  shadowEllipse(g, x + w / 2, 101, w / 2 + 4, 3, 0.7);
  poly(g, [[x + 2, y], [x + w - 2, y], [x + w, y + 5], [x, y + 5]], (xx, yy) => ditherPick(xx, yy, [PAL.wood[5], PAL.wood[6]], (yy - y) / 5));
  hline(g, x, y + 5, w, PAL.wood[7]);
  gradV(g, x, y + 6, w, 15, [PAL.wood[3], PAL.wood[2], PAL.wood[1]]);
  rect(g, x + 3, y + 8, 14, 11, PAL.wood[1]); for (let i = 0; i < 3; i++) { rect(g, x + 21, y + 8 + i * 4, 14, 3, PAL.wood[4]); rect(g, x + 26, y + 9 + i * 4, 4, 1, PAL.gold[4]); }
  // monitor con la sesión abierta, a su derecha (no le tapa la cara)
  lcd(g, x + 22, y - 19, 18, 15, { kind: 'article', seed: 77 });
  rect(g, x + 23, y - 18, 16, 2, PAL.blue[5]);
  // tres móviles cargando
  for (let i = 0; i < 3; i++) {
    const mx = x + 3 + i * 5;
    rect(g, mx, y - 6, 3, 6, PAL.ink[1]); rect(g, mx, y - 6, 3, 1, PAL.metal[5]); px(g, mx + 1, y - 4, [PAL.crt[5], PAL.gold[5], PAL.red[4]][i]);
  }
  rect(g, x + 2, y - 1, 16, 2, PAL.metal[2]);
  if (view.visible !== false) kit.cantoVivo(g, x + 22, y - 19, 18, 16);
}

// ================================================================== GEOMETRÍA
const layout = {
  pajarera_a_pecera: { rect: [3, 42, 37, 54], walkTo: [24, 110], face: 'left' },
  persiana: { rect: [2, 14, 38, 26], walkTo: [24, 110], face: 'up' },
  postits: { rect: [44, 22, 46, 44], walkTo: [70, 114], face: 'up' },
  matriz_2x2: { rect: [90, 16, 64, 42], walkTo: [122, 110], face: 'up' },
  posit_evaristo: { rect: [154, 44, 13, 12], walkTo: [156, 110], face: 'up', priority: 2, draw: drawPositEvaristo },
  sofa: { rect: [60, 72, 62, 28], walkTo: [100, 116], face: 'up' },
  pantalla_titulator: { rect: [120, 55, 42, 32], walkTo: [140, 110], face: 'up', priority: 1,
    sprites: { default: drawTitulator, ayudame: drawTitulatorAyudame } },
  mesa_direccion: { rect: [162, 64, 70, 36], walkTo: [196, 114], face: 'up', layer: 'sorted', zy: 101, prop: true, cache: true, cachePad: 12, draw: mesaDireccionObj },
  perchero: { rect: [232, 30, 16, 68], walkTo: [240, 110], face: 'up' },
  ordenador_gervasio: { rect: [268, 58, 20, 22], walkTo: [270, 112], face: 'up', layer: 'sorted', zy: 102, prop: true, draw: drawMesaGervasio },
  hoja_reservas: { rect: [270, 38, 16, 22], walkTo: [282, 110], face: 'up', priority: 1, draw: drawHoja },
  puerta_sala: { rect: [286, 20, 34, 78], walkTo: [302, 108], face: 'right', draw: drawPuertaSala },
  // PNJ (docs/GUIA_REDISENO.md §10)
  lector_medio: { at: [50, 106, 'right'], walkTo: [26, 124], face: 'right' },
  inigo_sinergia: { at: [92, 98, 'down'], pose: 'sentado', walkTo: [66, 126], face: 'right' },
  gervasio_acta: { at: [262, 97, 'down'], pose: 'tras_mesa', walkTo: [236, 126], face: 'right' },
};
function mesaDireccionObj(g) { mesaDireccion(g); }
/** pósit azul de Evaristo, asomando por la esquina de PRESCINDIBLE de la matriz */
function drawPositEvaristo(g) {
  const x = 154, y = 44;
  postit(g, x, y, POSTIT.b, { w: 12, h: 11, lines: false });
  micro(g, 'EV', x + 2, y + 2, INK);
  hline(g, x + 2, y + 8, 7, PAL.ink[3]);
  kit.cantoVivo(g, x, y, 12, 11);
}

export default {
  room: 'pajarera',
  width: W,
  rediseno: true,
  scale: { yFar: 100, far: 0.9, yNear: 142, near: 1.02 },
  walkboxes: [{ id: 'suelo', poly: [[6, 104], [314, 104], [318, 142], [2, 142]] }],
  entries: { pecera: [30, 114, 'right'], sala_amazonas: [298, 114, 'left'] },
  layout,
  draw: drawRoom,
  foreground: drawFrente,
  animate(g, view, t) {
    rainOnGlass(g, 168, 18, 52, 40, t, 5);
    // la Redacción tras el cristal: la gráfica de métricas parpadea
    if ((Math.floor(t / 700) & 1) === 0) { px(g, 32, 24, '#ff3a30'); px(g, 9, 50, PAL.gold[5]); }
  },
};
void lightCone; void chairBack; void deskFront; void label; void line;
