// SALA `administracion` — Administración, «La Ventanilla». Arte y geometría (rediseño, docs/GUIA_REDISENO.md §4, §10).
// Biblia §3.8 + adenda §3.8. Oficina institucional verde sanatorio, fluorescente enfermo. Cuatro zonas con su suelo, filete y
// pilastra: ESPERA (la boca del pasillo, sin puerta, con la placa «2 MARKETING ◄ / Y COMERCIAL», horario, dispensador de turnos, pared de
// trofeos de notas rechazadas sobre el aviso del 26 % y el banco), VENTANILLA (cabina de cristal con BEGOÑA sentada tras el
// mostrador y el agujerito a 14 px de su cara), CONTROLLING (despacho acristalado: don EVARISTO sentado con su lupa, la coma
// enmarcada como una coma y las torres de contratos leídos) y ARCHIVO (EJEMPLARES entero).
import { PAL, px, rect, hline, vline, frameRect, line, poly, ellipse, paint, ditherPick, ditherOverlay, noise, glow, gradV,
  rng, hash2, shade, mix, shadowEllipse, bevel, vignette, floorTiles, fluorescent, wallClock, glaze, lightCone } from '../../../engine/draw.js';
import { greek, cap, pin, stain, dropShadow, miniText } from './lib-catacumba-util.js';
import * as kit from '../../lib/kit.js';

const W = 320;
const FL = 97;                                                                              // línea pared / suelo
const WALLU = [PAL.green[3], PAL.green[4], PAL.green[5], PAL.green[6], PAL.green[7]];      // parte alta: verde sanatorio claro
const WALLL = [PAL.green[1], PAL.green[2], PAL.green[3], PAL.green[4]];                    // zócalo oscuro
const BENCH_ZY = 109, BOOTH_ZY = 100, DESK_ZY = 101;

const layout = {
  administracion_a_ecosistema: { rect: [4, 8, 38, 90], walkTo: [26, 112], face: 'left' },
  cartel_horario: { rect: [42, 30, 36, 28], walkTo: [58, 112], face: 'up' },
  dispensador_turnos: { rect: [44, 62, 22, 36], walkTo: [58, 112], face: 'up' },
  pared_rechazadas: { rect: [79, 14, 78, 24], walkTo: [118, 112], face: 'up' },
  cartel_recorte: { rect: [79, 39, 78, 52], walkTo: [118, 112], face: 'up' },
  // la cabina: cristal y rótulo (el mostrador lo pinta el frente, ordenado por z, delante de Begoña)
  ventanilla: { rect: [164, 34, 58, 38], walkTo: [193, 114], face: 'up' },
  mostrador_ventanilla: { rect: [160, 34, 66, 70], layer: 'sorted', zy: BOOTH_ZY, prop: true, cache: true, cachePad: 8, draw: (g) => drawBoothFront(g) },
  sellos: { rect: [168, 73, 22, 11], walkTo: [178, 114], face: 'up', priority: 1, layer: 'sorted', zy: BOOTH_ZY - 2, cache: true, cachePad: 4, draw: (g) => drawSellos(g, 168, 73) },
  tazas_begona: { rect: [203, 73, 20, 11], walkTo: [212, 114], face: 'up', priority: 1, layer: 'sorted', zy: BOOTH_ZY - 2, cache: true, cachePad: 4, draw: (g) => drawTazas(g, 203, 73) },
  puerta_controlling: { rect: [226, 42, 20, 56], walkTo: [238, 114], face: 'up' },
  contratos_evaristo: { rect: [262, 58, 12, 40], walkTo: [266, 114], face: 'up', priority: 1 },
  coma_enmarcada: { rect: [250, 33, 18, 20], walkTo: [258, 114], face: 'up', priority: 1 },
  archivador_ejemplares: { rect: [278, 38, 42, 60], walkTo: [298, 112], face: 'up' },
  // muebles de plano medio (sin hotspot): el banco de espera y la mesa de Evaristo, ordenados por z
  banco_espera: { rect: [84, 92, 74, 20], layer: 'sorted', zy: BENCH_ZY, prop: true, cache: true, cachePad: 10, draw: (g) => drawBench(g) },
  mesa_evaristo: { rect: [226, 78, 48, 22], layer: 'sorted', zy: DESK_ZY, prop: true, cache: true, cachePad: 10, draw: (g) => drawEvaristoDesk(g) },
  // Begoña, SENTADA tras el mostrador. Bruno le habla desde la izquierda de la cabina, de perfil, junto al agujerito
  // (nunca delante de ella): el agujero está a 14 px de su cara
  begona_triplicado: { at: [196, 98, 'down'], pose: 'tras_mesa', walkTo: [158, 120], face: 'right' },
  // Evaristo, SENTADO dentro de su despacho (lupa en la mesa); `puerta`: sale a la puerta de cristal, de pie, cuando se le llama
  evaristo_salvedad: { at: [256, 99, 'down'], pose: 'sentado', walkTo: [226, 126], face: 'right',
    positions: { despacho: { at: [256, 99, 'down'], pose: 'sentado' }, puerta: { at: [238, 107, 'left'], walkTo: [212, 114], face: 'right' } } },
};

// ------------------------------------------------------------ objetos
function drawSellos(g, x, y) {
  // tres sellos (original, duplicado, triplicado) con su tampón; uno escondido al fondo (RECHAZADO)
  rect(g, x, y + 7, 21, 3, PAL.ink[2]); hline(g, x, y + 7, 21, PAL.metal[4]);                      // tampón / bandeja
  rect(g, x + 1, y + 6, 19, 1, PAL.red[3]);
  for (let i = 0; i < 3; i++) {
    const sx = x + 1 + i * 7;
    rect(g, sx, y + 2, 5, 5, PAL.wood[4]); hline(g, sx, y + 2, 5, PAL.wood[6]); vline(g, sx + 4, y + 2, 5, PAL.wood[2]);   // cuerpo
    rect(g, sx + 1, y, 3, 3, PAL.wood[5]); px(g, sx + 2, y, PAL.wood[7]);                                                 // pomo
    rect(g, sx, y + 6, 5, 1, [PAL.blue[3], PAL.leaf[4], PAL.red[4]][i]);
  }
  px(g, x + 19, y + 3, PAL.red[5]); px(g, x + 20, y + 3, PAL.red[5]); px(g, x + 19, y + 4, PAL.red[5]);  // el RECHAZADO escondido
}
function drawTazas(g, x, y) {
  // tres tazas vacías con restos de café seco y bolis dentro
  for (let i = 0; i < 3; i++) {
    const tx = x + 1 + i * 7;
    rect(g, tx, y + 3, 5, 6, [PAL.paper[5], PAL.gold[4], PAL.blue[5]][i]); hline(g, tx, y + 3, 5, PAL.paper[7]); vline(g, tx + 4, y + 3, 6, PAL.ink[3]);
    hline(g, tx + 1, y + 4, 3, PAL.wood[2]); px(g, tx + 5, y + 5, PAL.paper[4]); px(g, tx + 5, y + 6, PAL.paper[3]);
    hline(g, tx, y + 9, 5, PAL.ink[3]);
  }
  line(g, x + 3, y + 3, x + 2, y - 1, PAL.red[4]); line(g, x + 9, y + 3, x + 10, y, PAL.blue[4]); line(g, x + 16, y + 3, x + 15, y, PAL.ink[0]);
}

/** Parte delantera de la cabina: pilares, cristal translúcido con orificio, mostrador. Se dibuja ordenado tras Begoña. */
function drawBoothFront(g) {
  const x0 = 164, x1 = 222, top = 36, ctr = 82;
  // cristal translúcido sobre la cabina (verde azulado) con reflejos
  glaze(g, x0 + 3, top + 12, x1 - x0 - 6, ctr - top - 12, PAL.teal[6], 0.12);
  ditherOverlay(g, x0 + 6, top + 14, 10, 30, PAL.white, 0.1);
  ditherOverlay(g, x0 + 30, top + 14, 6, 30, PAL.white, 0.07);
  // marco: pilares laterales y travesaño superior (acero verde)
  rect(g, x0, top, 4, ctr - top + 16, PAL.metal[3]); vline(g, x0, top, ctr - top + 16, PAL.metal[6]); vline(g, x0 + 3, top, ctr - top + 16, PAL.ink[1]);
  rect(g, x1 - 4, top, 4, ctr - top + 16, PAL.metal[3]); vline(g, x1 - 4, top, ctr - top + 16, PAL.metal[6]); vline(g, x1 - 1, top, ctr - top + 16, PAL.ink[1]);
  rect(g, x0, top + 12, x1 - x0, 3, PAL.metal[3]); hline(g, x0, top + 12, x1 - x0, PAL.metal[6]); hline(g, x0, top + 14, x1 - x0, PAL.ink[1]);
  // rótulo superior VENTANILLA
  bevel(g, x0, top, x1 - x0, 12, PAL.crt[2], PAL.crt[4], PAL.crt[0]);
  cap(g, 'VENTANILLA', (x0 + x1) >> 1, top + 3, PAL.crt[6], { align: 'center' });
  // agujerito a la altura de la boca (con aro), a un lado del cristal: así no le tapa la cara a Begoña (problema C)
  ellipse(g, 182, 65, 3.5, 2.5, PAL.gold[4]); ellipse(g, 182, 65, 2.5, 1.5, PAL.ink[0]); hline(g, 179, 62, 6, PAL.gold[6]);
  for (let k = 0; k < 3; k++) px(g, 180 + k * 2, 65, PAL.metal[2]);
  // número del turno y flecha
  rect(g, 207, 49, 9, 5, PAL.ink[1]); rect(g, 208, 50, 7, 3, PAL.red[2]); px(g, 210, 51, PAL.red[6]); px(g, 211, 51, PAL.red[6]); px(g, 212, 52, PAL.red[6]);
  // mostrador (cara exterior): repisa saliente, panel frontal, ranura pasapapeles con bandeja de latón
  poly(g, [[x0 - 4, ctr], [x1 + 4, ctr], [x1 + 6, ctr + 4], [x0 - 6, ctr + 4]], PAL.paper[5]); hline(g, x0 - 4, ctr, x1 - x0 + 8, PAL.white);
  hline(g, x0 - 6, ctr + 4, x1 - x0 + 12, PAL.paper[2]);
  rect(g, x0 - 4, ctr + 5, x1 - x0 + 8, 13, PAL.metal[3]); gradV(g, x0 - 4, ctr + 5, x1 - x0 + 8, 13, [PAL.metal[4], PAL.metal[3], PAL.metal[2]]);
  hline(g, x0 - 4, ctr + 5, x1 - x0 + 8, PAL.metal[6]); vline(g, x0 - 4, ctr + 5, 13, PAL.metal[5]); vline(g, x1 + 3, ctr + 5, 13, PAL.ink[1]);
  // ranura con bandeja
  rect(g, 181, ctr + 6, 24, 3, PAL.ink[0]); hline(g, 181, ctr + 6, 24, PAL.metal[1]);
  rect(g, 182, ctr + 9, 22, 2, PAL.gold[4]); hline(g, 182, ctr + 9, 22, PAL.gold[6]);
  miniText(g, 'NO APOYARSE', 193, ctr + 12, PAL.metal[7], { align: 'center' });
  line(g, 214, ctr + 4, 214, ctr + 7, PAL.metal[6]); line(g, 214, ctr + 7, 217, ctr + 4, PAL.metal[6]);
  rect(g, 216, ctr + 1, 5, 1, PAL.blue[4]);
  // sombra bajo el mostrador
  ditherOverlay(g, x0 - 6, ctr + 18, x1 - x0 + 12, 3, PAL.shadow, 0.5);
}

// ------------------------------------------------------------ fondo
function drawCeiling(g) {
  gradV(g, 0, 0, W, 15, [PAL.ink[2], PAL.green[0], PAL.green[1]]);
  for (let x = 0; x < W; x += 32) vline(g, x, 0, 14, PAL.green[0]);
  hline(g, 0, 7, W, PAL.green[0]);
  for (const lx of [22, 104, 186, 268]) fluorescent(g, lx, 8, 40, lx !== 186);
  hline(g, 0, 14, W, PAL.ink[0]);
  // detector de humo, altavoz
  ellipse(g, 70, 12, 3, 1.5, PAL.paper[6]); px(g, 70, 11, PAL.red[4]);
}

function drawWall(g) {
  paint(g, 0, 15, W, 61, (x, y) => ditherPick(x, y, [WALLU[1], WALLU[2], WALLU[3], WALLU[2]], 0.25 + ((y - 15) / 61) * 0.5 + (hash2(x >> 4, y >> 3, 2) - 0.5) * 0.06));
  noise(g, 0, 15, W, 60, WALLU[0], 0.03, 3);
  // humedad, manchas de café
  stain(g, 164, 28, 20, 8, WALLU[0], 0.3); stain(g, 300, 30, 10, 10, WALLU[0], 0.3);
  // zócalo oscuro con línea de pintura clara y roces
  paint(g, 0, 76, W, 20, (x, y) => ditherPick(x, y, WALLL, 0.2 + (96 - y) / 20 * 0.25 + hash2(x >> 2, y >> 1, 6) * 0.1));
  hline(g, 0, 74, W, WALLU[4]); hline(g, 0, 75, W, PAL.green[6]); hline(g, 0, 76, W, PAL.ink[1]);
  ditherOverlay(g, 0, 77, W, 6, PAL.shadow, 0.22);
  rect(g, 0, 95, W, 3, PAL.paper[3]); hline(g, 0, 95, W, PAL.paper[5]); hline(g, 0, 97, W, PAL.ink[1]);
  kit.filete(g, 0, W, 70, 'administracion');
}

function drawFloor(g) {
  floorTiles(g, { x: 0, y: 98, w: W, h: 46, vpx: W / 2, vpy: 34, tile: 20, rowPx: 8, colors: [PAL.paper[3], PAL.green[5]], colors3: PAL.paper[2], grout: PAL.green[2], far: PAL.green[0], fade: 0.5 });
  // tres suelos con canto: ventanilla (verde oliva), despacho de Controlling (moqueta granate) y archivo (gris)
  kit.zonaSuelo(g, 158, 224, 98, kit.DEPTO.administracion.suelo, { vpx: 191, vpy: 34, trama: 'baldosa', borde: '#a8c880', seed: 4 });
  kit.zonaSuelo(g, 224, 276, 98, ['#3a1820', '#4a1e28', '#5a2630'], { vpx: 250, vpy: 34, borde: '#a86060', seed: 5 });
  kit.zonaSuelo(g, 276, 320, 98, ['#2c303a', '#363a46', '#404452'], { vpx: 298, vpy: 34, trama: 'baldosa', borde: '#8a90a0', seed: 6 });
  ditherOverlay(g, 0, 98, W, 4, PAL.shadow, 0.5);
  // línea amarilla de espera pintada en el suelo frente a la ventanilla
  for (let x = 164; x < 224; x += 6) { hline(g, x, 119, 4, PAL.gold[5]); hline(g, x, 120, 4, PAL.gold[3]); }
  // huellas de zapato mojado (viernes de lluvia)
  for (const [fx, fy] of [[60, 124], [66, 128], [110, 120], [118, 126], [150, 130], [233, 122]]) { ellipse(g, fx, fy, 2, 1, PAL.green[3]); }
  glow(g, 190, 112, 60, 14, PAL.crt[5], 0.05, 3);
}

function drawExitDoor(g) {
  // la BOCA DEL PASILLO (sin puerta), la misma que se ve desde Marketing y Comercial (ecosistema.art.js `drawPasillo`):
  // marco común, el pasillo verde oliva en perspectiva y, al fondo, el Ecosistema (pared melocotón de Comercial y luz
  // lila) con la impresora de la tercera a la entrada
  const x0 = 4, x1 = 40, top = 30;
  const fx0 = 15, fx1 = 30, ftop = 46, fbot = 80;
  const OL = ['#2e3a2c', '#3a4a36', '#4a5c42', '#5c704e'];
  kit.marcoPuerta(g, x0, top, x1 - x0, FL - top, { ramp: [PAL.metal[0], PAL.metal[1], PAL.metal[2], PAL.metal[3], PAL.metal[4], PAL.metal[5], PAL.metal[6], PAL.metal[7]] });
  poly(g, [[x0, top], [x1, top], [fx1, ftop], [fx0, ftop]], OL[0]);
  poly(g, [[x0, top], [fx0, ftop], [fx0, fbot], [x0, FL]], (xx, yy) => ditherPick(xx, yy, OL, 0.35 + (xx - x0) / 40));
  poly(g, [[x1, top], [fx1, ftop], [fx1, fbot], [x1, FL]], (xx, yy) => ditherPick(xx, yy, OL, 0.55 - (x1 - xx) / 30));
  poly(g, [[x0, FL], [fx0, fbot], [fx1, fbot], [x1, FL]], (xx, yy) => ditherPick(xx, yy, kit.DEPTO.administracion.suelo, 0.3 + (yy - fbot) / 20));
  for (let k = 1; k < 3; k++) { const t = k / 3; line(g, Math.round(x0 + (fx0 - x0) * t), Math.round(FL + (fbot - FL) * t), Math.round(x1 + (fx1 - x1) * t), Math.round(FL + (fbot - FL) * t), OL[1]); }
  for (const t of [0.3, 0.65]) { const yy = Math.round(top + (ftop - top) * t), xa = Math.round(x0 + (fx0 - x0) * t) + 6, xb = Math.round(x1 + (fx1 - x1) * t) - 6; hline(g, xa, yy + 1, xb - xa, '#e8ffe0'); }
  // el fondo: Comercial (pared melocotón, filete naranja), con la luz lila de Marketing que se escapa por un lado
  paint(g, fx0, ftop, fx1 - fx0, fbot - ftop, (xx, yy) => ditherPick(xx, yy, ['#8e5a46', '#a26a52', '#b67c60'], 0.6 - (yy - ftop) / 60));
  hline(g, fx0, ftop + 14, fx1 - fx0, kit.DEPTO.comercial.c);
  rect(g, fx0, fbot - 5, fx1 - fx0, 5, '#4a3a4e');
  glow(g, fx0 + 2, ftop + 18, 10, 18, '#c8a0e8', 0.35, 3);
  // la impresora de la tercera, a la entrada del pasillo (su piloto rojo de atasco)
  rect(g, fx1 - 7, fbot - 15, 6, 11, PAL.paper[5]); hline(g, fx1 - 7, fbot - 15, 6, PAL.paper[7]); rect(g, fx1 - 6, fbot - 12, 4, 2, PAL.ink[1]); px(g, fx1 - 5, fbot - 12, PAL.red[4]);
  glow(g, (fx0 + fx1) / 2, fbot - 4, 14, 6, '#ffd8b0', 0.2, 3);
  ditherOverlay(g, x0, FL - 3, x1 - x0, 3, PAL.ink[0], 0.3);
  kit.cantoVivo(g, x0 - 2, top - 2, x1 - x0 + 4, FL - top + 2);
  // sobre el dintel: placa del kit «2 MARKETING ◄ / Y COMERCIAL» y, en el suelo, el umbral del destino
  kit.placaSala(g, 4, 9, 'ecosistema', { flecha: '<' });
  kit.umbral(g, x0, FL + 1, x1 - x0, 6, kit.DEPTO.marketing.c, { chevron: true });
}

function drawHorario(g) {
  // cartel «ATENCIÓN: 19:00 A 19:15» (las 19:07, según Begoña)
  const x = 42, y = 30, w = 36, h = 28;
  dropShadow(g, x, y, w, h, 2, 2, 0.5);
  rect(g, x, y, w, h, PAL.paper[6]); frameRect(g, x, y, w, h, PAL.metal[3]);
  rect(g, x + 1, y + 1, w - 2, 8, PAL.red[3]); hline(g, x + 1, y + 1, w - 2, PAL.red[5]);
  kit.micro(g, 'ATENCIÓN', x + (w >> 1), y + 4, PAL.paper[7], { align: 'center' });
  kit.micro(g, '19:00 A', x + (w >> 1), y + 13, PAL.ink[1], { align: 'center' });
  kit.micro(g, '19:15', x + (w >> 1), y + 20, PAL.red[3], { align: 'center' });
  pin(g, x + 2, y + 2, PAL.metal[7]); pin(g, x + w - 3, y + 2, PAL.metal[7]);
  kit.cantoVivo(g, x, y, w, h);
}

function drawKiosk(g) {
  // dispensador de turnos: poste con caja roja y pantalla digital que marca 0
  const x = 46, y = 64;
  shadowEllipse(g, x + 8, 98, 11, 3, 0.7);
  rect(g, x + 6, y + 22, 4, 12, PAL.metal[4]); vline(g, x + 6, y + 22, 12, PAL.metal[6]); vline(g, x + 9, y + 22, 12, PAL.ink[1]);
  rect(g, x + 1, y + 32, 14, 3, PAL.metal[2]); hline(g, x + 1, y + 32, 14, PAL.metal[5]);
  bevel(g, x, y, 16, 22, PAL.red[3], PAL.red[5], PAL.red[1]);
  rect(g, x + 3, y + 3, 10, 6, PAL.ink[0]); rect(g, x + 4, y + 4, 8, 4, PAL.red[1]);
  miniText(g, '0', x + 8, y + 4, PAL.red[6], { align: 'center' });                                              // marca 0
  rect(g, x + 3, y + 12, 10, 3, PAL.paper[5]); hline(g, x + 3, y + 12, 10, PAL.white);                           // boca del ticket
  for (let i = 0; i < 4; i++) px(g, x + 4 + i * 2, y + 14, PAL.paper[2]);
  rect(g, x + 6, y + 17, 4, 2, PAL.gold[4]);
  // tira de tickets enrollada, un 1 asomando
  rect(g, x + 4, y + 15, 8, 3, PAL.paper[6]); miniText(g, '1', x + 7, y + 14, PAL.ink[1]);
}

function drawRechazadas(g) {
  // la pared de trofeos: cinco notas de gasto enmarcadas como piezas de caza (placa de latón y sello RECHAZADO), con
  // cornamenta de ciervo en el centro
  const x0 = 79, y0 = 16, w = 78, h = 22;
  rect(g, x0, y0, w, h, PAL.wood[2]); frameRect(g, x0, y0, w, h, PAL.wood[1]); hline(g, x0, y0, w, PAL.wood[5]);
  gradV(g, x0 + 1, y0 + 1, w - 2, h - 2, [PAL.wood[3], PAL.wood[2]]);
  for (let i = 0; i < 5; i++) {
    const fx = x0 + 4 + i * 14.6 | 0, fy = y0 + 3;
    dropShadow(g, fx, fy, 12, 15, 1, 1, 0.5);
    rect(g, fx, fy, 12, 15, PAL.gold[2]); hline(g, fx, fy, 12, PAL.gold[6]); vline(g, fx, fy, 15, PAL.gold[5]);
    rect(g, fx + 2, fy + 2, 8, 9, PAL.paper[6]);
    greek(g, fx + 3, fy + 3, 6, 3, PAL.paper[2], 10 + i, 2, 0.6);
    line(g, fx + 2, fy + 9, fx + 9, fy + 5, PAL.red[4]); line(g, fx + 2, fy + 10, fx + 9, fy + 6, PAL.red[3]);     // sello RECHAZADO oblicuo
    rect(g, fx + 3, fy + 12, 6, 2, PAL.gold[4]); hline(g, fx + 4, fy + 13, 4, PAL.gold[2]);                     // placa de latón
  }
  for (const sg of [-1, 1]) { const cx = x0 + 38; line(g, cx + sg * 2, y0 + 1, cx + sg * 8, y0 - 4, PAL.paper[5]); line(g, cx + sg * 8, y0 - 4, cx + sg * 10, y0 - 8, PAL.paper[5]); line(g, cx + sg * 6, y0 - 2, cx + sg * 4, y0 - 6, PAL.paper[4]); }
  rect(g, x0 + 35, y0 - 1, 6, 3, PAL.wood[4]);
  kit.cantoVivo(g, x0, y0, w, h);
}

function drawRecorte(g) {
  // aviso del recorte del 26 % (pista de P11): entero, con la firma «— ADMINISTRACIÓN (TAMBIÉN RECORTADA)» en 2 líneas
  // (nunca «LA DIRECCIÓN»: el juego no alude a ninguna dirección de periódico)
  const x = 79, y = 39, w = 78, h = 52;
  dropShadow(g, x, y, w, h, 2, 2, 0.5);
  rect(g, x, y, w, h, PAL.paper[6]); frameRect(g, x, y, w, h, PAL.red[3]); hline(g, x + 1, y + h - 2, w - 2, PAL.paper[4]);
  rect(g, x + 2, y + 2, w - 4, 7, PAL.red[3]); hline(g, x + 2, y + 2, w - 4, PAL.red[5]);
  kit.texto(g, 'AVISO AL PERSONAL', x + 2, y + 3, w - 4, 6, { color: PAL.paper[7], fuente: 'micro', pad: 0 });
  kit.texto(g, 'TODA PIEZA O NOTA', x + 2, y + 9, w - 4, 6, { color: PAL.ink[1], fuente: 'micro', pad: 0 });
  kit.texto(g, 'SUFRE EL RECORTE', x + 2, y + 15, w - 4, 6, { color: PAL.ink[1], fuente: 'micro', pad: 0 });
  kit.texto(g, 'ESTÁNDAR (26 %)', x + 2, y + 20, w - 4, 10, { color: PAL.red[3], fuente: 'juego', pad: 0 });
  kit.texto(g, 'SIN EXCEPCIONES', x + 2, y + 31, w - 4, 6, { color: PAL.ink[1], fuente: 'micro', pad: 0 });
  hline(g, x + 6, y + 37, w - 12, PAL.paper[3]);
  kit.texto(g, '- ADMINISTRACIÓN', x + 2, y + 39, w - 4, 6, { color: PAL.metal[3], fuente: 'micro', pad: 0 });
  kit.texto(g, '(TAMBIÉN RECORTADA)', x + 1, y + 44, w - 2, 6, { color: PAL.metal[3], fuente: 'micro', pad: 0 });
  pin(g, x + 3, y + 4, PAL.metal[7]); pin(g, x + w - 4, y + 4, PAL.metal[7]);
  // el aviso ya está recortado por abajo: borde dentado
  for (let i = 0; i < w - 2; i += 3) px(g, x + 1 + i, y + h - 1, PAL.paper[2]);
  kit.cantoVivo(g, x, y, w, h);
}

/** Banco de espera de plástico naranja (cuatro asientos soldados): mueble de plano medio, ordenado por z. */
function drawBench(g) {
  const x = 86, y = 93;
  shadowEllipse(g, x + 36, 109, 40, 3, 0.7);
  for (let i = 0; i < 4; i++) {
    const cx = x + i * 18;
    poly(g, [[cx + 1, y], [cx + 16, y], [cx + 17, y + 6], [cx, y + 6]], PAL.dusk[5]); hline(g, cx + 1, y, 15, PAL.dusk[7]);
    vline(g, cx + 16, y, 6, PAL.dusk[3]);
    rect(g, cx + 1, y + 7, 16, 5, PAL.dusk[4]); hline(g, cx + 1, y + 7, 16, PAL.dusk[6]); hline(g, cx + 1, y + 11, 16, PAL.dusk[2]);
  }
  for (const lx of [x + 2, x + 35, x + 68]) { rect(g, lx, y + 12, 3, 12, PAL.metal[3]); hline(g, lx, y + 23, 3, PAL.ink[1]); vline(g, lx, y + 12, 12, PAL.metal[5]); }
  // revista antigua, tela de araña en el asiento 4 y paraguas goteando
  rect(g, x + 38, y + 8, 8, 3, PAL.paper[5]); hline(g, x + 39, y + 9, 6, PAL.red[4]);
  line(g, x + 56, y + 1, x + 62, y + 7, PAL.paper[6]); line(g, x + 62, y + 1, x + 56, y + 7, PAL.paper[6]); hline(g, x + 56, y + 4, 7, PAL.paper[6]);
  line(g, x - 3, y + 6, x - 2, y + 23, PAL.ink[0]); line(g, x - 3, y + 6, x, y + 4, PAL.ink[0]); ellipse(g, x - 2, y + 24, 3, 1, PAL.teal[3]);
}

function drawBoothBack(g) {
  // interior de la cabina: pared amarillenta, estantería con carpetas, calendario, lámpara y reloj 19:07
  const x0 = 164, x1 = 222;
  rect(g, x0, 36, x1 - x0, 62, PAL.paper[2]);
  gradV(g, x0 + 4, 50, x1 - x0 - 8, 32, [PAL.paper[4], PAL.paper[3], PAL.paper[2]]);
  rect(g, x0 + 4, 50, x1 - x0 - 8, 2, PAL.metal[2]);
  // estantería superior izquierda: carpetas de colores
  rect(g, x0 + 5, 56, 14, 14, PAL.wood[2]); frameRect(g, x0 + 5, 56, 14, 14, PAL.wood[1]);
  for (let i = 0; i < 5; i++) { rect(g, x0 + 7 + i * 2, 58, 2, 10, [PAL.blue[4], PAL.red[4], PAL.gold[4], PAL.leaf[5], PAL.paper[6]][i]); }
  hline(g, x0 + 6, 63, 12, PAL.wood[1]);
  // calendario de 2019 y reloj
  rect(g, x1 - 18, 56, 10, 12, PAL.paper[7]); rect(g, x1 - 18, 56, 10, 3, PAL.red[4]); for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) px(g, x1 - 16 + i * 2, 61 + j * 2, PAL.ink[2]);
  wallClock(g, x1 - 28, 62, 5, 19 + 7 / 60);
  // lámpara de oficina y cables
  line(g, x0 + 30, 82, x0 + 30, 74, PAL.metal[3]);
  // suelo de la cabina
  rect(g, x0 + 4, 82, x1 - x0 - 8, 16, PAL.paper[1]);
  gradV(g, x0 + 4, 82, x1 - x0 - 8, 16, [PAL.paper[2], PAL.paper[0]]);
  // luz fluorescente enferma desde arriba
  glow(g, 193, 52, 28, 16, PAL.crt[6], 0.1, 4);
}

/** Despacho acristalado de Controlling (fondo): marco de aluminio hasta el techo, rótulo esmerilado, puerta de cristal, la
 *  coma enmarcada (una coma grande y negra en su marco, con placa), las torres de contratos LEÍDOS y la moqueta granate. */
function drawOffice(g) {
  const x0 = 224, x1 = 274, y0 = 16, yb = 98;
  rect(g, x0, y0, x1 - x0, yb - y0, PAL.paper[3]);
  gradV(g, x0 + 2, y0 + 2, x1 - x0 - 4, yb - y0 - 2, [PAL.paper[5], PAL.paper[4], PAL.paper[3]]);
  rect(g, x0 + 2, 94, x1 - x0 - 4, 4, PAL.red[1]);                                  // zócalo de moqueta granate
  // la coma enmarcada: marco dorado, passepartout crema, una coma negra de 8 px y su placa
  const cx = 251, cy = 33;
  dropShadow(g, cx, cy, 18, 20, 2, 2, 0.5);
  rect(g, cx, cy, 18, 20, PAL.gold[3]); frameRect(g, cx, cy, 18, 20, PAL.gold[1]); hline(g, cx, cy, 18, PAL.gold[6]); vline(g, cx, cy, 20, PAL.gold[5]);
  rect(g, cx + 2, cy + 2, 14, 12, PAL.paper[7]); frameRect(g, cx + 2, cy + 2, 14, 12, PAL.paper[4]);
  ellipse(g, cx + 9, cy + 6, 2.6, 2.6, PAL.ink[1]);                                    // la cabeza redonda de la coma…
  poly(g, [[cx + 10, cy + 7], [cx + 12, cy + 7], [cx + 11, cy + 10], [cx + 8, cy + 13], [cx + 7, cy + 12], [cx + 9, cy + 9]], PAL.ink[1]);   // …y su cola curva
  rect(g, cx + 4, cy + 16, 10, 3, PAL.gold[5]); hline(g, cx + 5, cy + 17, 8, PAL.gold[2]);   // placa «Cláusula 7, 2009»
  kit.cantoVivo(g, cx, cy, 18, 20);
  // torres de contratos (LEÍDOS) a la derecha: tres columnas de carpetas
  const cs = [PAL.blue[4], PAL.red[4], PAL.gold[4], PAL.leaf[5], PAL.paper[6], PAL.dusk[4]];
  const r = rng(77);
  for (const [tx, tw, th] of [[262, 5, 34], [267, 4, 28], [271, 3, 38]]) {
    let yy = 98;
    shadowEllipse(g, tx + tw / 2, 98, tw + 2, 1.5, 0.5);
    while (yy > 98 - th) { const hh = 3 + ((r() * 2) | 0); rect(g, tx + (r() < 0.5 ? 0 : 1), yy - hh, tw, hh, cs[(r() * cs.length) | 0]); hline(g, tx, yy - hh, tw, PAL.paper[7]); yy -= hh; }
  }
  kit.cantoVivo(g, 262, 60, 12, 38);
  // lámpara verde en la esquina de la mesa (la mesa y Evaristo se pintan aparte, ordenados por z)
  rect(g, 234, 62, 2, 14, PAL.metal[3]); poly(g, [[231, 61], [239, 61], [237, 56], [233, 56]], PAL.green[3]); hline(g, 233, 56, 4, PAL.green[6]);
  glow(g, 237, 76, 14, 8, PAL.gold[5], 0.12, 3);
  // marco de aluminio y cristal (frontal), hasta el techo
  rect(g, x0, y0, x1 - x0, 3, PAL.metal[5]); hline(g, x0, y0, x1 - x0, PAL.metal[7]); hline(g, x0, y0 + 2, x1 - x0, PAL.metal[2]);
  rect(g, x0, y0, 3, yb - y0, PAL.metal[5]); vline(g, x0, y0, yb - y0, PAL.metal[7]);
  rect(g, x1 - 3, y0, 3, yb - y0, PAL.metal[5]); vline(g, x1 - 3, y0, yb - y0, PAL.metal[7]); vline(g, x1 - 1, y0, yb - y0, PAL.ink[1]);
  rect(g, x0, 31, x1 - x0, 2, PAL.metal[4]); hline(g, x0, 31, x1 - x0, PAL.metal[7]);
  // dintel: rótulo esmerilado «CONTROLLING / Y FINANZAS»
  bevel(g, x0 + 3, y0 + 3, x1 - x0 - 6, 14, PAL.teal[2], PAL.teal[4], PAL.teal[0]);
  kit.micro(g, 'CONTROLLING', (x0 + x1) / 2, y0 + 4, PAL.teal[7], { align: 'center' });
  kit.micro(g, 'Y FINANZAS', (x0 + x1) / 2, y0 + 10, PAL.teal[7], { align: 'center' });
  // puerta de cristal esmerilado (izquierda) con marco, rótulo y tirador
  const dx = 228, dw = 17, dy = 42;
  rect(g, dx - 1, dy - 1, dw + 2, yb - dy + 1, PAL.metal[3]); frameRect(g, dx - 1, dy - 1, dw + 2, yb - dy + 1, PAL.metal[1]);
  paint(g, dx, dy, dw, yb - dy, (xx, yy) => ditherPick(xx, yy, [PAL.teal[5], PAL.teal[6], PAL.paper[6]], 0.35 + ((xx - dx) / dw) * 0.3 + hash2(xx, yy, 7) * 0.12));
  rect(g, dx + 3, dy + 6, dw - 6, 1, PAL.teal[3]); rect(g, dx + 3, dy + 9, dw - 10, 1, PAL.teal[3]);
  rect(g, dx + dw - 4, 66, 2, 8, PAL.metal[7]); vline(g, dx + dw - 4, 66, 8, PAL.white);
  hline(g, dx, yb - 2, dw, PAL.metal[3]);
  kit.cantoVivo(g, dx - 1, dy - 1, dw + 2, yb - dy + 1);
  ditherOverlay(g, x0, yb, x1 - x0 + 2, 3, PAL.shadow, 0.5);
}

/** La mesa de Evaristo, DELANTE de él (objeto ordenado por z): tablero con la lupa sobre un contrato, la carpeta abierta y el
 *  cristal del despacho, que lo envuelve en un tinte de acuario. */
function drawEvaristoDesk(g) {
  const x = 238, y = 91, w = 30;
  shadowEllipse(g, x + w / 2, y + 9, w / 2 + 4, 2, 0.6);
  rect(g, x + 2, y + 5, 3, 5, PAL.wood[2]); rect(g, x + w - 5, y + 5, 3, 5, PAL.wood[2]);
  poly(g, [[x + 2, y], [x + w - 2, y], [x + w + 1, y + 5], [x - 1, y + 5]], (xx, yy) => ditherPick(xx, yy, [PAL.wood[5], PAL.wood[6]], 0.3 + (yy - y) / 5 * 0.6));
  hline(g, x - 1, y + 5, w + 2, PAL.wood[1]);
  rect(g, x + 4, y + 5, w - 8, 2, PAL.wood[3]);
  // contrato abierto con la cláusula subrayada y la lupa encima
  poly(g, [[x + 4, y + 1], [x + 17, y + 1], [x + 18, y + 4], [x + 3, y + 4]], PAL.paper[7]); hline(g, x + 5, y + 2, 10, PAL.metal[4]); hline(g, x + 5, y + 3, 7, PAL.red[4]);
  // la lupa (aro metálico, cristal y mango de madera) sobre el contrato
  line(g, x + 25, y - 2, x + 29, y + 3, PAL.wood[3], 2);
  ellipse(g, x + 23, y - 5, 5, 5, PAL.metal[6]); ellipse(g, x + 23, y - 5, 4, 4, PAL.metal[3]); ellipse(g, x + 23, y - 5, 3, 3, PAL.teal[7]);
  px(g, x + 21, y - 7, PAL.white); px(g, x + 22, y - 7, PAL.white); px(g, x + 21, y - 6, PAL.white);
  // el cristal del despacho tinta lo que hay dentro
  glaze(g, 247, 42, 25, 56, PAL.teal[6], 0.1);
  ditherOverlay(g, 252, 44, 7, 50, PAL.white, 0.07);
}

function drawArchivador(g) {
  // armario archivador de acero verde, ocho cajones; rótulo EJEMPLARES entero, candado y nota «NO TOCAR»
  const x = 278, y = 38, w = 42, h = 60;
  shadowEllipse(g, x + w / 2, y + h, w / 2 + 2, 3, 0.7);
  rect(g, x, y, w, h, PAL.green[1]); frameRect(g, x, y, w, h, PAL.ink[0]);
  gradV(g, x + 1, y + 1, w - 2, h - 2, [PAL.green[5], PAL.green[4], PAL.green[3]]);
  hline(g, x, y, w, PAL.green[7]); vline(g, x, y, h, PAL.green[6]); vline(g, x + w - 1, y, h, PAL.green[1]);
  bevel(g, x + 1, y + 3, w - 2, 9, PAL.paper[6], PAL.white, PAL.paper[2]);
  kit.texto(g, 'EJEMPLARES', x + 1, y + 4, w - 2, 7, { color: PAL.red[3], fuente: 'micro', pad: 0 });
  for (let j = 0; j < 4; j++) {
    const cy = y + 15 + j * 11;
    for (let i = 0; i < 2; i++) {
      const cx = x + 3 + i * 19;
      bevel(g, cx, cy, 18, 10, PAL.green[4], PAL.green[6], PAL.green[1]);
      hline(g, cx + 6, cy + 3, 6, PAL.metal[6]); hline(g, cx + 6, cy + 4, 6, PAL.metal[2]);
      rect(g, cx + 2, cy + 6, 6, 3, PAL.paper[6]); hline(g, cx + 3, cy + 7, 4, PAL.metal[3]);
    }
  }
  rect(g, x + 28, y + 20, 4, 4, PAL.gold[4]); frameRect(g, x + 28, y + 20, 4, 4, PAL.gold[1]); hline(g, x + 28, y + 18, 4, PAL.metal[5]);
  rect(g, x + 4, y + 27, 34, 8, PAL.gold[5]); hline(g, x + 4, y + 27, 34, PAL.gold[6]);
  kit.texto(g, 'NO TOCAR', x + 4, y + 28, 34, 7, { color: PAL.red[3], fuente: 'micro', pad: 0 });
  ditherOverlay(g, x + w - 4, y + 2, 4, h - 2, PAL.shadow, 0.35);
  kit.cantoVivo(g, x, y, w, h);
}

function drawQueue(g) {
  // postes con cinta separadora frente a la ventanilla (la cola que nunca hay)
  for (const [sx, sy] of [[166, 110], [222, 110]]) {
    shadowEllipse(g, sx, sy + 1, 4, 1.2, 0.6);
    rect(g, sx - 3, sy - 1, 6, 2, PAL.metal[3]); vline(g, sx, sy - 14, 14, PAL.metal[5]); px(g, sx, sy - 15, PAL.metal[7]); rect(g, sx - 1, sy - 16, 3, 2, PAL.metal[4]);
  }
  for (let i = 0; i <= 56; i++) { const yy = 97 + Math.round(Math.sin(i / 56 * Math.PI) * 3); px(g, 167 + i, yy, PAL.red[4]); px(g, 167 + i, yy + 1, PAL.red[2]); }
}

function drawLights(g) {
  glow(g, 62, 20, 36, 14, PAL.crt[5], 0.06, 3);
  glow(g, 124, 30, 50, 24, PAL.crt[6], 0.07, 4);
  glow(g, 206, 30, 50, 24, PAL.crt[6], 0.06, 4);
  glow(g, 288, 30, 34, 24, PAL.crt[5], 0.06, 4);
}

function foreground(g) {
  // primer plano: el paraguas olvidado de alguien, apoyado en el borde bajo del banco, y el cubo de la gotera (esquina inferior izquierda)
  const x = 2, y = 141;
  shadowEllipse(g, x + 10, y, 12, 2, 0.7);
  poly(g, [[x + 3, y], [x + 17, y], [x + 15, y - 14], [x + 5, y - 14]], (xx) => ditherPick(xx, 0, [PAL.metal[2], PAL.metal[4], PAL.metal[3]], (xx - x) / 14));
  hline(g, x + 3, y, 15, PAL.metal[1]); hline(g, x + 5, y - 14, 11, PAL.metal[6]); ellipse(g, x + 10, y - 14, 6, 1.5, PAL.teal[4]);
  px(g, x + 8, y - 17, PAL.teal[6]);
}

export default {
  room: 'administracion',
  width: 320,
  rediseno: true,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  // suelo con forma: el banco de espera (hasta y 109) y el cubo del rincón quedan fuera; la franja de atrás deja pasar a Evaristo
  walkboxes: [
    { id: 'espera', poly: [[8, 104], [82, 104], [82, 142], [26, 142], [26, 128], [2, 128], [2, 116], [8, 116]] },
    { id: 'centro', poly: [[80, 110], [312, 110], [318, 142], [80, 142]] },
    { id: 'fondo', poly: [[158, 104], [312, 104], [312, 112], [158, 112]] },
  ],
  entries: { ecosistema: [30, 116, 'right'] },
  layout,
  draw(g) {
    drawCeiling(g);
    drawWall(g);
    drawFloor(g);
    drawExitDoor(g);
    drawHorario(g);
    drawKiosk(g);
    drawRechazadas(g);
    drawRecorte(g);
    drawBoothBack(g);
    drawOffice(g);
    drawArchivador(g);
    kit.pilastra(g, 157, 15, FL, { w: 5 });
    kit.pilastra(g, 274, 15, FL, { w: 4 });
    drawQueue(g);
    drawLights(g);
    vignette(g, W, 144, 0.5);
  },
  foreground(g) { foreground(g); },
  animate(g, view, t) {
    // fluorescente que parpadea sobre la ventanilla
    const on = (Math.sin(t / 90) + Math.sin(t / 223) + Math.sin(t / 51)) > -2.2;
    rect(g, 185, 7, 40, 5, PAL.green[1]);
    if (on) { rect(g, 186, 8, 40, 3, '#e8ffe0'); glow(g, 206, 16, 38, 10, PAL.crt[6], 0.1, 3); }
    else { rect(g, 186, 8, 40, 3, PAL.metal[3]); }
    // el contador del dispensador parpadea (0)
    if ((t % 1600) < 800) rect(g, 51, 69, 2, 1, PAL.red[6]);
  },
};
