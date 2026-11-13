// SALA `cpd` — ARTE Y GEOMETRÍA (REDISEÑO P1, docs/GUIA_REDISENO.md §3, §4, §10, §11).
// Sótano −1 de elContable.es, en luz azul fría. De izquierda a derecha:
//   NÚCLEO         (x 0-96)    terrazo; caja de escalera CERRADA («SOLO EVACUACIÓN», no hay escalera en la planta −1) y el
//                              ascensor «−1» (kit.nucleo, FL = 94); placa «−1 SISTEMAS».
//   PASILLO FRÍO   (x 96-226)  falso suelo técnico, armarios 24-27 con la luz azul; carro de consola exento en el plano medio,
//                              rejilla del suelo, ventilador con cuña de papel; rótulo de zona «SISTEMAS» colgado.
//   PUESTO DE PACO (x 226-320) moqueta gris, mampara «SISTEMAS» con las llaves, mesa con el contador de tickets; Paco SENTADO.
// Profundidad: fondo (racks y pared), plano medio (carro, ventilador, atril del libro, mesa de Paco, papel continuo, rejilla)
// y primer plano (bobina de cable). El armario 27 y el papel continuo se dibujan por su ESTADO (§11).
import {
  PAL, mix, shade, rect, hline, vline, frameRect, line, px, poly, ellipse, paint, gradV, bevel, hash2, rng,
  ditherOverlay, ditherPick, glow, vignette, shadowEllipse, floorTiles, officeChair,
} from '../../../engine/draw.js';
import * as kit from '../../lib/kit.js';
import { nucleoGeom } from '../../lib/edificio.js';
import { sevenSeg } from './lib-vestibulo-micro.js';

const W = 320, FL = 94;
const N = nucleoGeom('cpd', FL);
const INK = kit.INK;
const mc = (g, t, cx, y, c, o = {}) => kit.micro(g, t, cx, y, c, { align: 'center', ...o });
const AZUL = kit.DEPTO.sistemas.c;
const CAB_Y = 28, CAB_H = 66;
// armarios 24-27 (pasillo frío) y 28-30 (detrás de la mesa de Paco); el 22 y el 23 ya no caben junto al núcleo
const CABS = [
  { n: 24, x: 102, w: 21 }, { n: 25, x: 125, w: 21 }, { n: 26, x: 148, w: 20 }, { n: 27, x: 170, w: 32 },
  { n: 28, x: 242, w: 24 }, { n: 29, x: 268, w: 24 }, { n: 30, x: 294, w: 24 },
];
const C27 = CABS.find(c => c.n === 27);
const LEDS = [];                       // [x, y, tipo, semilla]: se rellenan al pintar el fondo; animate() las hace parpadear

function tint(g, pts, color, alpha) { g.save(); g.globalAlpha = alpha; poly(g, pts, color); g.restore(); }
function tintR(g, x, y, w, h, color, alpha) { g.save(); g.globalAlpha = alpha; rect(g, x, y, w, h, color); g.restore(); }

// ------------------------------------------------------------------ armario de servidores (24-26, 28-30)
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
  mc(g, String(n), x + (w >> 1), y + 4, PAL.ink[1]);
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
  // pared del pasillo frío: azul noche, con juntas verticales de panel
  paint(g, 0, 14, W, FL - 14, (xx, yy) => {
    const t = (yy - 14) / (FL - 14);
    let c = ditherPick(xx, yy, [PAL.night[2], PAL.night[1], PAL.night[0], PAL.ink[1]], t);
    if (hash2(xx, yy, 3) < 0.03) c = PAL.ink[1];
    return c;
  });
  // techo con bandejas de cables, latiguillos colgando y plafones fríos
  gradV(g, 0, 0, W, 14, [PAL.ink[0], PAL.ink[2], PAL.night[0]]);
  hline(g, 0, 14, W, PAL.metal[1]);
  rect(g, 0, 4, W, 6, PAL.metal[1]); hline(g, 0, 4, W, PAL.metal[3]); hline(g, 0, 9, W, PAL.ink[0]);
  for (let k = 3; k < W; k += 7) vline(g, k, 5, 4, PAL.metal[2]);
  const rc = rng(12);
  for (let k = 0; k < 18; k++) {
    const cx = 104 + Math.floor(rc() * (W - 108)), len = 5 + Math.floor(rc() * 11);
    const col = [PAL.gold[3], PAL.blue[3], PAL.red[3], PAL.ink[3], PAL.teal[4]][k % 5];
    vline(g, cx, 10, len, col); vline(g, cx + 1, 10, len - 1, mix(col, '#000000', 0.4));
  }
  for (const lx of [66, 168, 270]) {
    rect(g, lx - 14, 11, 28, 3, PAL.night[5]); hline(g, lx - 14, 11, 28, PAL.night[7]);
    glow(g, lx, 20, 36, 12, '#8ec4ff', 0.10, 5);
  }

  // ---- suelos: falso suelo técnico (pasillo) y moqueta (puesto de Paco)
  floorTiles(g, { x: 0, y: FL, w: W, h: 144 - FL, vpx: 160, vpy: 30, tile: 22, rowPx: 9, colors: [mix(PAL.night[2], PAL.metal[3], 0.4), PAL.night[2]], grout: PAL.ink[0], far: PAL.ink[0], fade: 0.5 });
  // pasillo frío: franja clara central con flechas de flujo de aire, y baldosas perforadas
  for (let k = 0; k < 12; k++) {
    const bx = 112 + k * 16, by = 118 + (k % 3) * 8;
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) px(g, bx + a * 2, by + b * 2, PAL.ink[0]);
  }
  kit.zonaSuelo(g, 226, W, FL, ['#2a3042', '#343c52', '#3e4862'], { vpx: 160, vpy: 24, trama: 'baldosa', borde: true });

  // ---- NÚCLEO (kit): terrazo, caja de escalera cerrada, ascensor «−1» (indicador y botonera) y sus umbrales
  kit.nucleo(g, 'cpd', FL);
  kit.pilastra(g, 95, 14, FL);
  kit.pilastra(g, 227, 14, FL);
  // cornisa: filete azul de Sistemas a lo largo de toda la pared (entre el techo y la fila de armarios)
  kit.filete(g, 0, 95, 22, 'sistemas'); kit.filete(g, 101, 227, 22, 'sistemas'); kit.filete(g, 233, W, 22, 'sistemas');
  // cortina de tiras de plástico del pasillo frío (translúcida): separa el núcleo del pasillo y deja ver los armarios detrás
  for (let k = 0; k < 4; k++) { const cx = 98 + k * 2; tintR(g, cx, 14, 1, FL - 14, '#9ad0ff', 0.28); hline(g, cx, 14, 1, PAL.metal[5]); }
  rect(g, 97, 13, 9, 2, PAL.metal[4]);

  // ---- armarios y cables
  for (const c of CABS) if (c.n !== 27) rack(g, c);
  // el hueco del 27 (lo rellena el objeto, por estado): marco y sombra
  rect(g, C27.x - 1, CAB_Y - 2, C27.w + 2, CAB_H + 2, PAL.ink[0]);
  cableMess(g);
  // señal de «NO COMER» (ironía con el armario 27), pegada en la puerta del 24; etiqueta «DYP?» colgada de un cable
  rect(g, 102, 46, 23, 14, PAL.paper[6]); frameRect(g, 102, 46, 23, 14, PAL.red[3]);
  mc(g, 'NO', 113, 48, PAL.red[3]); mc(g, 'COMER', 113, 54, PAL.red[3]);
  // mampara gris detrás de la mesa de Paco: tela clara «SISTEMAS» (su silueta oscura se lee delante) + las llaves
  kit.mampara(g, 248, 84, 58, 34, '#8a90a8', { texto: 'SISTEMAS', tinta: '#e8ecf8' });
  llaves(g, 292, 62);
  rect(g, 252, 64, 12, 15, PAL.paper[7]); for (let k = 0; k < 5; k++) hline(g, 253, 66 + k * 3, 9, PAL.metal[3]);                     // planilla de guardias
  rect(g, 267, 66, 8, 8, '#f0e050'); hline(g, 268, 68, 6, PAL.ink[3]); hline(g, 268, 70, 4, PAL.ink[3]);                           // pósit «vuelvo en 5 min»
  officeChair(g, 277, 101, { color: PAL.metal, back: true });                                                                     // el respaldo de la silla de Paco
  contador(g);
  // la única luz cálida del sótano: el flexo de Paco
  glow(g, 272, 74, 28, 22, '#ffd8a0', 0.2, 5);
  floorStuff(g);
  rotulos(g);
  for (const lx of [66, 168, 270]) glow(g, lx, 112, 44, 8, '#8ec4ff', 0.07, 4);
  ditherOverlay(g, 0, FL - 3, W, 4, PAL.ink[0], 0.5);
  vignette(g, W, 144, 0.7);
}

function rotulos(g) {
  // rótulo de zona «SISTEMAS» colgado del techo sobre el pasillo frío, y la placa «−1 SISTEMAS / CPD» sobre el ascensor
  kit.rotuloZona(g, 152, 15, 'sistemas', { colgado: 5 });
  kit.placaSala(g, 40, 14, 'cpd', { sinSub: true });
}

/** Cuadro de llaves pequeño sobre la mampara (las llaves de Sistemas): 6 llaves con etiqueta de color. */
function llaves(g, x, y) {
  rect(g, x, y, 12, 13, PAL.wood[2]); frameRect(g, x, y, 12, 13, PAL.wood[1]);
  const tag = [PAL.gold[4], PAL.paper[6], PAL.red[4], PAL.teal[5]];
  for (let i = 0; i < 6; i++) {
    const kx = x + 2 + (i % 3) * 3, ky = y + 2 + (i >> 1 & 1 ? 5 : 0) + (i > 3 ? 0 : 0);
    px(g, kx, y + 2 + Math.floor(i / 3) * 5, PAL.gold[6]);
    rect(g, kx, y + 3 + Math.floor(i / 3) * 5, 2, 3, tag[i % tag.length]);
    void ky;
  }
}

/** Cable-lazo que baja de la bandeja entre los armarios 24 y 25 hasta el suelo técnico, y los latiguillos de «Diseño se fue». */
function cableMess(g) {
  const cols = [PAL.gold[3], PAL.blue[4], PAL.red[3], PAL.teal[4], PAL.crt[3], PAL.purple[4]];
  for (let k = 0; k < 12; k++) {
    const x0 = 104 + k * 4, c = cols[k % cols.length], len = 14 + ((k * 7) % 14);
    for (let y = 10; y < 10 + len; y++) px(g, x0 + Math.round(Math.sin((y + k) * 0.35) * 1.2), y, c);
    px(g, x0, 10 + len, PAL.ink[0]);
  }
  for (let y = 40; y < FL; y++) { px(g, 147 + Math.round(Math.sin(y * 0.2) * 1.2), y, PAL.blue[3]); px(g, 146 + Math.round(Math.cos(y * 0.18)), y, PAL.gold[3]); }
  // etiqueta de inventario colgando: «DYP?» («Diseño se fue. El cable, no»)
  rect(g, 126, 66, 17, 9, PAL.paper[6]); frameRect(g, 126, 66, 17, 9, PAL.metal[3]); mc(g, 'DYP?', 134, 68, PAL.ink[2]);
}

const CNT = { x: 238, y: 30, w: 68, h: 19 };
function contador(g) {
  const { x, y, w, h } = CNT;
  ditherOverlay(g, x + 2, y + 2, w, h - 1, PAL.ink[0], 0.6);
  bevel(g, x, y, w, h, PAL.ink[2], PAL.metal[4], PAL.ink[0]);
  mc(g, 'TICKETS ABIERTOS', x + w / 2, y + 2, '#ff7a6a');
  rect(g, x + 11, y + 8, 46, 10, '#1a0406');
}

function floorStuff(g) {
  // el cable gordo que sale de debajo del 27 y serpentea hasta la mesa de Paco
  const pts = [[206, 100], [214, 108], [228, 112], [244, 110], [258, 104]];
  for (let i = 0; i < pts.length - 1; i++) { line(g, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], PAL.ink[0], 2); line(g, pts[i][0], pts[i][1] - 1, pts[i + 1][0], pts[i + 1][1] - 1, PAL.blue[3], 1); }
  ellipse(g, 98, 124, 3, 1.5, PAL.ink[0]); px(g, 97, 123, PAL.metal[5]);
}

// ------------------------------------------------------------------ objetos
function drawRejilla(g) {
  const x = 112, y = 121, w = 36, h = 14;
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
  kit.cantoVivo(g, x, y, w, h);
}

/** Carro de consola (KVM) exento en el plano medio: monitor, teclado y cajón; el walkbox lo rodea. */
function drawCarro(g, view, t) {
  const x = 146, y = 124;
  shadowEllipse(g, x + 12, y, 16, 3, 0.7);
  // patas con ruedas y bandeja
  rect(g, x + 1, y - 3, 3, 3, PAL.ink[0]); rect(g, x + 20, y - 3, 3, 3, PAL.ink[0]);
  vline(g, x + 2, y - 22, 20, PAL.metal[4]); vline(g, x + 21, y - 22, 20, PAL.metal[3]);
  rect(g, x, y - 12, 24, 3, PAL.metal[4]); hline(g, x, y - 12, 24, PAL.metal[7]);                                  // balda del teclado
  rect(g, x + 3, y - 15, 18, 3, PAL.paper[4]); hline(g, x + 3, y - 15, 18, PAL.paper[7]);
  for (let k = 0; k < 8; k++) px(g, x + 4 + k * 2, y - 14, PAL.ink[2]);
  rect(g, x, y - 5, 24, 3, PAL.metal[3]); hline(g, x, y - 5, 24, PAL.metal[5]);                                    // balda de abajo
  // monitor CRT con el cursor parpadeando
  rect(g, x + 4, y - 31, 16, 14, PAL.paper[3]); hline(g, x + 4, y - 31, 16, PAL.paper[5]); frameRect(g, x + 4, y - 31, 16, 14, PAL.paper[1]);
  rect(g, x + 6, y - 29, 12, 9, PAL.ink[0]);
  for (let k = 0; k < 3; k++) hline(g, x + 7, y - 28 + k * 2, 3 + ((k * 3) % 5), PAL.crt[4]);
  if (((t || 0) % 900) < 450) rect(g, x + 7, y - 23, 2, 1, PAL.crt[6]);
  glow(g, x + 12, y - 24, 16, 10, PAL.crt[4], 0.1, 3);
  // el latiguillo que cuelga del carro hasta el armario 26
  for (let k = 0; k < 20; k++) px(g, x + 22 + Math.round(Math.sin(k * 0.3) * 2), y - 34 + k, PAL.gold[3]);
}

// Estados del objeto `armario_27` (los pone la lógica, cpd.js; se guardan con la partida):
//   'cerrado'      puerta cerrada, pegatina «NO ABRIR», LED naranja, charco de luz fría delante (Actos I-III hasta la revelación)
//   'entreabierto' fotograma intermedio del ñiiic: la puerta a medio abrir (solo dentro de la escena 7.3)
//   'abierto'      puerta abierta hacia fuera: el nido de Rubén, luz VERDE dentro y charco verde delante
//   'vacio'        abierta y sin Rubén (ruben_libre): el nido, el monitor apagado y el pósit «Gracias, Tadeo»
function puertaAbierta(g, x, y, h, ancho) {
  // hoja de la puerta girada hacia fuera (hacia la izquierda): `ancho` = cuánto sobresale (12 abierta, 4 entreabierta)
  const x0 = x + 1, x1 = x - ancho;
  poly(g, [[x0, y + 11], [x1, y + 4], [x1, y + h], [x0, y + h - 4]], (xx, yy) => ditherPick(xx, yy, [PAL.ink[0], PAL.metal[1], PAL.metal[2], PAL.metal[3]], (xx - x1) / (ancho + 1) * 0.9));
  line(g, x1, y + 4, x1, y + h, PAL.metal[4], 1);
  const px0 = x1 + Math.round(ancho * 0.25);
  rect(g, px0, y + 38, Math.max(5, Math.round(ancho * 0.55)), 7, PAL.paper[5]); kit.micro(g, 'ON', px0 + 1, y + 40, PAL.red[2]);         // la pegatina, del revés
}
function nidoRuben(g, x, y, w, h, libre, t) {
  rect(g, x + 1, y + 11, w - 2, h - 13, PAL.ink[0]);
  gradV(g, x + 2, y + 12, w - 4, h - 16, [PAL.ink[1], PAL.ink[0]]);
  for (let k = 0; k < 5; k++) vline(g, x + 3 + k * 6, y + 12, 6 + k * 2, [PAL.gold[3], PAL.blue[3], PAL.red[3], PAL.ink[3], PAL.teal[4]][k]);
  // la matricial en la balda de arriba, con el papel continuo bajando por la pared del armario
  rect(g, x + 3, y + 22, 13, 6, PAL.paper[3]); hline(g, x + 3, y + 22, 13, PAL.paper[5]); rect(g, x + 5, y + 21, 9, 1, PAL.paper[7]);
  for (let yy = y + 28; yy < y + h - 4; yy += 2) { hline(g, x + 6, yy, 6, PAL.paper[6]); px(g, x + 6, yy, PAL.ink[3]); px(g, x + 11, yy, PAL.ink[3]); }
  // monitor verde (el Titulator por dentro) en la balda derecha
  rect(g, x + 18, y + 18, 12, 10, PAL.ink[2]); rect(g, x + 19, y + 19, 10, 7, libre ? PAL.ink[1] : PAL.crt[1]);
  if (!libre) {
    for (let k = 0; k < 3; k++) hline(g, x + 20, y + 20 + k * 2, 3 + ((k * 5) % 6), PAL.crt[5]);
    if ((Math.floor((t || 0) / 400) & 1) === 0) rect(g, x + 24, y + 24, 2, 1, PAL.crt[6]);
    glow(g, x + 20, y + 30, 26, 22, PAL.crt[4], 0.3, 5);
  }
  rect(g, x + 17, y + 28, 14, 1, PAL.metal[3]);
  // manta de cuadros y cojín en el suelo del armario (el «nido»)
  paint(g, x + 2, y + h - 12, w - 4, 8, (xx, yy) => ((((xx >> 2) + (yy >> 2)) & 1) ? PAL.red[3] : PAL.red[1]));
  hline(g, x + 2, y + h - 12, w - 4, PAL.red[4]);
  rect(g, x + w - 11, y + h - 16, 8, 5, PAL.paper[5]); hline(g, x + w - 11, y + h - 16, 8, PAL.paper[7]);
  // tápers de atún apilados y envoltorios
  rect(g, x + 18, y + 38, 9, 4, PAL.teal[6]); hline(g, x + 18, y + 38, 9, PAL.teal[7]); rect(g, x + 19, y + 43, 8, 4, PAL.teal[5]); hline(g, x + 19, y + 43, 8, PAL.teal[7]);
  for (let k = 0; k < 9; k++) px(g, x + 3 + ((k * 7) % 22), y + h - 4 + (k % 2), PAL.paper[5]);
  // pósit «Gracias, Tadeo» pegado por dentro
  rect(g, x + 20, y + 31, 7, 6, '#f0e050'); hline(g, x + 21, y + 33, 5, PAL.ink[3]); hline(g, x + 21, y + 35, 4, PAL.ink[3]);
}
function drawArmario27(g, view, t) {
  const { x, w } = C27;
  const y = CAB_Y, h = CAB_H;
  const st = String(view.state || 'cerrado');
  const libre = st === 'vacio';
  const a3 = !!view.flag('acto_3_iniciado');
  const T = t || 0;
  // el suelo delante del armario: charco de luz FRÍA (cerrado) o VERDE (abierto): cambia la luz, no solo el dibujo
  if (st === 'cerrado') glow(g, x + w / 2, 104, 40, 9, '#5ab0ff', 0.2, 5);
  else if (st === 'entreabierto') glow(g, x + w / 2, 104, 40, 9, '#7ad8a0', 0.2, 5);
  else if (!libre) glow(g, x + w / 2 - 6, 106, 48, 10, '#8aff70', 0.26 + 0.04 * Math.sin(T / 300), 6);
  if (st === 'cerrado') {
    // chasis completo: puerta ciega con rejilla de ventilación, manilla, pegatina y la rendija de abajo por donde sale el papel
    rect(g, x, y, w, h, PAL.ink[1]); vline(g, x, y, h, PAL.metal[2]); vline(g, x + w - 1, y, h, PAL.ink[0]);
    hline(g, x - 1, y - 2, w + 2, PAL.metal[3]); hline(g, x, y - 1, w, PAL.metal[1]);
    paint(g, x + 2, y + 4, w - 4, h - 12, (xx, yy) => ditherPick(xx, yy, [PAL.metal[1], PAL.metal[2], PAL.metal[3]], 0.35 + (yy - y) / h * 0.3 + (hash2(xx, yy >> 1, 4) < 0.1 ? 0.1 : 0)));
    for (let k = 0; k < 6; k++) hline(g, x + 4, y + 6 + k * 2, w - 8, PAL.ink[0]);                                    // rejilla de ventilación
    rect(g, x + (w >> 1) - 7, y + 20, 14, 7, PAL.paper[6]); frameRect(g, x + (w >> 1) - 7, y + 20, 14, 7, PAL.metal[3]); mc(g, '27', x + (w >> 1), y + 21, PAL.ink[1]);
    rect(g, x + 3, y + 34, w - 6, 22, PAL.paper[6]); frameRect(g, x + 3, y + 34, w - 6, 22, PAL.red[3]);                // pegatina «NO ABRIR»
    ellipse(g, x + 8, y + 39, 3, 3, PAL.red[4]); px(g, x + 8, y + 39, PAL.paper[7]);
    mc(g, 'NO', x + 18, y + 37, PAL.red[3]); mc(g, 'ABRIR', x + 16, y + 44, PAL.red[3]);
    hline(g, x + 6, y + 51, 20, PAL.metal[4]); hline(g, x + 6, y + 53, 14, PAL.metal[4]);
    rect(g, x + w - 6, y + 28, 2, 8, PAL.metal[6]);                                                                    // manilla
    rect(g, x + 4, y + h - 8, w - 8, 3, PAL.ink[0]); hline(g, x + 4, y + h - 8, w - 8, PAL.metal[2]);                  // la rendija del papel
    rect(g, x, y + h - 4, w, 4, PAL.ink[0]); hline(g, x, y + h - 4, w, PAL.metal[2]);
    if (a3) for (let s = 0; s < 6; s++) rect(g, x + 4 + s * 4, y + 58 - ((Math.floor(T / 90) + s * 3) % 5) * 0, 2, 1, PAL.crt[5]);   // «teclea, con faltas»
  } else if (st === 'entreabierto') {
    // a medio abrir: el hueco ya deja ver el nido (luz verde), la hoja aún tapa la izquierda
    rect(g, x, y, w, h, PAL.ink[1]);
    nidoRuben(g, x, y, w, h, false, T);
    const hx = x + 14;
    poly(g, [[x + 1, y + 11], [hx, y + 9], [hx, y + h - 3], [x + 1, y + h - 4]], (xx, yy) => ditherPick(xx, yy, [PAL.ink[1], PAL.metal[1], PAL.metal[2]], (xx - x) / 14));
    vline(g, hx, y + 9, h - 12, PAL.metal[4]);
    rect(g, x + 3, y + 34, 9, 16, PAL.paper[6]); mc(g, 'NO', x + 7, y + 40, PAL.red[3]);
    puertaAbierta(g, x, y, h, 4);
  } else {
    rect(g, x, y, w, h, PAL.ink[1]);
    nidoRuben(g, x, y, w, h, libre, T);
    puertaAbierta(g, x, y, h, 12);
  }
  // LED de estado: naranja intermitente (cerrado, imprimiendo) / verde fijo (abierto) / apagado (vacío)
  if (!libre) {
    const k = Math.floor(T / (a3 ? 110 : 480)) % 3;
    const col = st === 'cerrado' ? ['#ff8030', '#ffd040', '#ff5030'][k] : PAL.crt[5];
    rect(g, x + w - 5, y + 14, 2, 2, col); glow(g, x + w - 4, y + 15, 5, 4, col, 0.5, 2);
  } else rect(g, x + w - 5, y + 14, 2, 2, PAL.metal[2]);
  kit.cantoVivo(g, x - 1, y - 2, w + 2, h);
}

/** Papel continuo: una TIRA perforada (borde con agujeros, plegado en acordeón) que sale por la rendija de abajo del 27 y
 *  serpentea por el suelo hacia cámara. Estados: 'asoma' (serpentea y avanza despacio), 'tensa' (P13: recta y tirante, levantada
 *  del suelo) y 'recogida' (tras la revelación: solo asoma un cabo). */
function drawPapel(g, view, t) {
  const st = String(view.state || 'asoma');
  const T = t || 0;
  const sx = 183, sy = 91;                           // la rendija del 27
  let pts;
  if (st === 'tensa') {
    // recta y tirante hacia la mano de Bruno, con una leve comba: se ve el hilo
    pts = []; for (let i = 0; i <= 34; i++) { const u = i / 34; pts.push([sx + u * 22, sy + u * 38 + Math.sin(u * Math.PI) * -1.5]); }
  } else if (st === 'recogida') {
    // la matricial ya no tira: queda el cabo por la rendija y el papel plegado en acordeón sobre el suelo (16×11)
    pts = []; for (let i = 0; i <= 6; i++) { const u = i / 6; pts.push([sx + Math.sin(u * 2) * 1, sy + u * 8]); }
    for (let k = 0; k < 5; k++) {
      const yy = 101 + k * 2, ww = 15 - (k & 1) * 2, xx = sx - 7 + (k & 1) * 1;
      shadowEllipse(g, sx + 1, 112, 9, 1.5, 0.45);
      rect(g, xx, yy, ww, 2, k & 1 ? PAL.paper[5] : PAL.paper[7]); hline(g, xx, yy, ww, PAL.paper[7]); hline(g, xx, yy + 1, ww, PAL.paper[3]);
      px(g, xx + 1, yy, PAL.ink[3]); px(g, xx + ww - 2, yy, PAL.ink[3]);
    }
  } else {
    pts = []; for (let i = 0; i <= 44; i++) { const u = i / 44; pts.push([sx + 4 + Math.sin(u * 5.2) * 9 * (0.4 + u) + u * 14, sy + 2 + u * 37]); }
  }
  // sombra de la tira sobre el suelo
  for (const [px0, py0] of pts) if (py0 > sy + 6) px(g, Math.round(px0) + 2, Math.round(py0) + (st === 'tensa' ? 6 : 1), PAL.ink[0]);
  const wd = st === 'tensa' ? 7 : 11;
  const avance = st === 'asoma' ? Math.floor(T / 700) % 2 : 0;                   // «ñiiic»: el papel avanza un pliegue
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const fold = ((i + avance) >> 1) & 1;
    const w = wd * (0.55 + 0.45 * (cy - sy) / 40);                                // en perspectiva: más ancha cerca de cámara
    const col = fold ? PAL.paper[7] : PAL.paper[5];
    poly(g, [[x0 - w / 2, y0], [x0 + w / 2, y0], [x1 + w / 2, y1], [x1 - w / 2, y1]], col);
    hline(g, Math.round(cx - w / 2), Math.round(cy), Math.max(1, Math.round(w)), fold ? PAL.paper[4] : PAL.paper[3]);
    if (i % 2 === 0) { px(g, Math.round(cx - w / 2) + 1, Math.round(cy), PAL.ink[3]); px(g, Math.round(cx + w / 2) - 2, Math.round(cy), PAL.ink[3]); }   // los agujeros de arrastre
  }
  // el cabo asomando por la rendija (luz del papel)
  if (st !== 'tensa') rect(g, sx - 5, sy - 1, 11, 2, PAL.paper[7]);
  if (st === 'tensa') { glow(g, sx + 10, sy + 20, 14, 18, PAL.paper[7], 0.1, 3); px(g, sx + 22, sy + 38, PAL.paper[7]); }
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
  // la cuña: papel blanco doblado (9×6) calzando la pata de la rejilla, con su sombra y el borde oscuro: se lee a 1×
  poly(g, [[x - 8, y - 30], [x + 2, y - 30], [x + 2, y - 25]], PAL.ink[0]);
  poly(g, [[x - 7, y - 31], [x + 2, y - 31], [x + 2, y - 26]], PAL.paper[7]); hline(g, x - 7, y - 31, 9, PAL.paper[4]);
  px(g, x - 3, y - 30, PAL.ink[3]); px(g, x - 1, y - 29, PAL.ink[3]);                                           // renglones de la página perdida
  poly(g, [[x + 2, y - 29], [x + 6, y - 27], [x + 2, y - 25]], PAL.paper[5]);
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
  rect(g, x + 1, y - 11, 15, 7, PAL.paper[6]); kit.micro(g, 'RATAS', x + 2, y - 10, PAL.ink[2]);
  for (let k = 0; k < 4; k++) {
    ellipse(g, x + 3 + k * 4, y - 16 - (k % 2), 2.5, 2, PAL.paper[5]); px(g, x + 2 + k * 4, y - 17 - (k % 2), PAL.paper[7]);
    line(g, x + 3 + k * 4, y - 14, x + 5 + k * 4, y - 12, PAL.paper[3], 1);
  }
  line(g, x + 3, y - 18, x - 3, y - 13, PAL.paper[3], 1);
  kit.cantoVivo(g, x - 1, y - 14, 19, 15);
}

// ------------------------------------------------------------------ mesa de Paco (plano medio, tapa de la cintura abajo al sentado)
const MESA = { x: 240, y: 84, w: 62 };
function drawPacoDesk(g, view, t) {
  const { x, y, w } = MESA;
  shadowEllipse(g, x + w / 2, 105, w / 2 + 6, 3, 0.75);
  gradV(g, x, y + 5, w, 20, [PAL.metal[3], PAL.metal[2], PAL.metal[1]]);
  vline(g, x, y + 5, 20, PAL.metal[5]); vline(g, x + w - 1, y + 5, 20, PAL.ink[1]);
  for (let i = 0; i < 3; i++) { bevel(g, x + w - 18, y + 7 + i * 6, 14, 5, PAL.metal[3], PAL.metal[5], PAL.metal[1]); rect(g, x + w - 14, y + 9 + i * 6, 6, 1, PAL.metal[7]); }
  rect(g, x + 4, y + 8, 26, 16, PAL.ink[1]);                                                                // el hueco de las rodillas
  rect(g, x - 2, y, w + 4, 5, PAL.paper[4]); hline(g, x - 2, y, w + 4, PAL.paper[7]); hline(g, x - 2, y + 4, w + 4, PAL.paper[1]);
  // registro de tickets: un archivador gordísimo, TUMBADO a la izquierda (no tapa a Paco)
  const bx = 240, by = y - 9;
  bevel(g, bx, by, 31, 9, PAL.red[3], PAL.red[5], PAL.red[1]);
  rect(g, bx + 2, by + 2, 28, 5, PAL.paper[6]); mc(g, 'TICKETS', bx + 16, by + 2, PAL.ink[1]);
  for (let k = 0; k < 4; k++) rect(g, bx + 31, by + 1 + k * 2, 2, 1, PAL.paper[6]);
  kit.cantoVivo(g, bx, by, 31, 9);
  // pósits de colores en la mesa
  rect(g, 276, y + 1, 3, 3, '#f0e050'); rect(g, 281, y + 2, 3, 3, '#f0a0c0');
  // CRT en la punta derecha, de lado, mirando a Paco
  const mx = 289, my = y - 15;
  bevel(g, mx, my, 13, 14, PAL.paper[3], PAL.paper[5], PAL.paper[1]);
  rect(g, mx + 2, my + 2, 9, 8, PAL.ink[0]);
  for (let k = 0; k < 3; k++) hline(g, mx + 3, my + 3 + k * 2, 3 + ((k * 3) % 5), PAL.crt[4]);
  if (((t || 0) % 800) < 400) rect(g, mx + 3, my + 9, 2, 1, PAL.crt[6]);
  rect(g, mx + 3, my + 14, 7, 1, PAL.paper[2]);
  glow(g, mx + 6, my + 6, 12, 9, PAL.crt[4], 0.12, 3);
}

function drawContador(g, view) {
  const { x, y, w } = CNT;
  contador(g);
  const n = Math.max(0, Math.floor(Number(view.flag('paco_tickets')) || 48211));
  const s = String(n);
  const txt = s.length > 3 ? s.slice(0, s.length - 3) + '.' + s.slice(-3) : s;
  const tw = txt.split('').reduce((a, ch) => a + (ch === '.' ? 2 : 6), 0);
  sevenSeg(g, txt, x + (w >> 1) - (tw >> 1), y + 9, '#ff3a30', '#3a0a0c');
  glow(g, x + (w >> 1), y + 13, 36, 10, '#ff3a30', 0.18, 4);
  glow(g, x + (w >> 1), 56, 40, 14, '#ff3a30', 0.07, 4);                                                    // el contador rojo tiñe la pared
  kit.cantoVivo(g, x, y, w, 19);
}

// ------------------------------------------------------------------ primer plano: bobina de cable
function foreground(g) {
  const cx = 6, cy = 130;
  shadowEllipse(g, cx + 6, 143, 14, 3, 0.6);
  ellipse(g, cx, cy, 14, 13, (xx, yy, d) => (d > 0.86 ? PAL.metal[6] : ditherPick(xx, yy, [PAL.wood[4], PAL.wood[3], PAL.wood[2]], d)));
  ellipse(g, cx, cy, 10, 9, (xx, yy, d) => ditherPick(xx, yy, [PAL.blue[3], PAL.blue[2], PAL.ink[1]], d));
  for (let a = 0; a < 5; a++) line(g, cx, cy, cx + Math.round(Math.cos(a * 1.26) * 9), cy + Math.round(Math.sin(a * 1.26) * 8), PAL.gold[3], 1);
  ellipse(g, cx, cy, 3, 3, PAL.ink[0]);
  line(g, cx + 12, cy + 8, cx + 24, cy + 12, PAL.blue[3], 2);
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
  g.save(); g.globalAlpha = b; g.fillStyle = '#5ab0ff'; g.fillRect(96, 100, W - 96, 44); g.restore();
}

// ------------------------------------------------------------------ geometría
const layout = {
  ascensor_cpd: { rect: N.ascensor.rect, walkTo: N.ascensor.walkTo, face: 'up' },            // núcleo del kit (FL = 94)
  armarios: { rect: [102, 28, 66, 66], walkTo: [128, 108], face: 'up', priority: -1 },
  armario_27: { rect: [170, 28, 32, 66], walkTo: [186, 110], face: 'up', priority: 1, draw: (g, v, t) => drawArmario27(g, v, t) },
  papel_continuo: {
    rect: [176, 94, 32, 38], walkTo: [190, 111], face: 'up', priority: 2,
    sprites: { asoma: (g, v, t) => drawPapel(g, v, t), tensa: (g, v, t) => drawPapel(g, v, t), recogida: (g, v, t) => drawPapel(g, v, t), default: (g, v, t) => drawPapel(g, v, t) },
  },
  ventilador: { rect: [203, 30, 22, 70], walkTo: [214, 112], face: 'up', draw: (g, v, t) => drawVentilador(g, v, t) },
  libro_visitas: { rect: [225, 62, 16, 38], walkTo: [232, 112], face: 'up', cache: true, draw: (g) => drawLibro(g) },
  contador_tickets: { rect: [238, 30, 68, 19], walkTo: [272, 112], face: 'up', draw: (g, v) => drawContador(g, v) },
  registro_tickets: {
    rect: [240, 74, 31, 10], walkTo: [250, 114], face: 'up', priority: 1,
    layer: 'sorted', zy: 103, prop: true, draw: (g, v, t) => drawPacoDesk(g, v, t),
  },
  cementerio_ratones: { rect: [299, 86, 19, 18], walkTo: [306, 112], face: 'up', cache: true, draw: (g) => drawCaja(g) },
  rejilla_cpd: { rect: [112, 121, 36, 15], walkTo: [130, 116], face: 'down', cache: true, draw: (g) => drawRejilla(g) },
  carro_kvm: { rect: [144, 90, 28, 36], layer: 'sorted', zy: 125, prop: true, draw: (g, v, t) => drawCarro(g, v, t) },
  // Paco, SENTADO tras su mesa (la mesa le tapa de la cintura abajo); Bruno le habla desde la izquierda, de perfil
  paco_ticket: { at: [277, 96, 'down'], pose: 'sentado', walkTo: [246, 126], face: 'right' },
  // Rubén: `dentro` = de pie dentro del armario abierto (escena 7.3); luego sale y se queda delante del nido. Bruno le habla desde la derecha.
  ruben: { at: [186, 106, 'down'], walkTo: [214, 118], face: 'left', positions: { dentro: { at: [187, 93, 'down'] } } },
};

export default {
  room: 'cpd',
  rediseno: true,
  width: W,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  // el suelo rodea el carro de consola (exento): se pasa por delante, por los lados y por la franja de detrás
  walkboxes: [
    { id: 'tras', poly: [[24, 100], [316, 100], [318, 113], [22, 113]] },
    { id: 'izq', poly: [[24, 112], [143, 112], [143, 142], [22, 142]] },
    { id: 'der', poly: [[172, 112], [318, 112], [318, 142], [172, 142]] },
    { id: 'delante', poly: [[22, 129], [318, 129], [318, 142], [22, 142]] },
  ],
  entries: { vestibulo: N.ascensor.entrada, ascensor: N.ascensor.entrada },
  layout,
  draw(g) { paintBackground(g); },
  foreground(g) { foreground(g); },
  animate(g, view, t) { animateLeds(g, view, t); },
  overlay(g, view, t) {
    if (((t || 0) % 7000) > 6850) { g.save(); g.globalAlpha = 0.25; g.fillStyle = '#05060c'; g.fillRect(0, 12, W, 6); g.restore(); }
  },
};
