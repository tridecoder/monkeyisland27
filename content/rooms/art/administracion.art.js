// SALA `administracion` — Administración, «La Ventanilla». Arte y geometría. Biblia §3.8 + adenda §3.8.
// Oficina institucional verde sanatorio, luz de fluorescente enfermo. De izquierda a derecha: puerta al pasillo, cartel de
// horario y dispensador de turnos, pared de notas rechazadas (trofeos) sobre el cartel del recorte y un banco de espera,
// la VENTANILLA (cabina de cristal con Begoña detrás, el mostrador tapa sus piernas), el despacho acristalado de Controlling
// (Evaristo, coma enmarcada, torres de contratos) y el archivador EJEMPLARES.
import { PAL, px, rect, hline, vline, frameRect, line, poly, ellipse, paint, ditherPick, ditherOverlay, noise, glow, gradV,
  rng, hash2, shade, mix, shadowEllipse, bevel, vignette, floorTiles, fluorescent, wallClock, glaze, lightCone } from '../../../engine/draw.js';
import { greek, cap, pin, stain, dropShadow, miniText } from './lib-catacumba-util.js';

const W = 320;
const WALLU = [PAL.green[3], PAL.green[4], PAL.green[5], PAL.green[6], PAL.green[7]];      // parte alta: verde sanatorio claro
const WALLL = [PAL.green[1], PAL.green[2], PAL.green[3], PAL.green[4]];                    // zócalo oscuro

const layout = {
  administracion_a_ecosistema: { rect: [4, 30, 34, 68], walkTo: [26, 112], face: 'left' },
  cartel_horario: { rect: [36, 30, 43, 30], walkTo: [58, 112], face: 'up' },
  dispensador_turnos: { rect: [44, 62, 22, 36], walkTo: [56, 112], face: 'up' },
  pared_rechazadas: { rect: [82, 5, 80, 36], walkTo: [120, 112], face: 'up' },
  cartel_recorte: { rect: [82, 42, 80, 40], walkTo: [122, 112], face: 'up' },
  ventanilla: {
    rect: [160, 34, 66, 66], walkTo: [193, 114], face: 'up', layer: 'sorted', zy: 100, prop: true, cache: true, cachePad: 8,
    draw: (g) => drawBoothFront(g),
  },
  sellos: { rect: [168, 73, 22, 11], walkTo: [178, 114], face: 'up', priority: 1, layer: 'sorted', zy: 98, cache: true, cachePad: 4, draw: (g) => drawSellos(g, 168, 73) },
  tazas_begona: { rect: [198, 73, 22, 11], walkTo: [210, 114], face: 'up', priority: 1, layer: 'sorted', zy: 98, cache: true, cachePad: 4, draw: (g) => drawTazas(g, 198, 73) },
  puerta_controlling: { rect: [228, 42, 18, 56], walkTo: [238, 114], face: 'up' },
  contratos_evaristo: { rect: [260, 52, 12, 46], walkTo: [262, 114], face: 'up', priority: 1 },
  coma_enmarcada: { rect: [250, 32, 14, 14], walkTo: [254, 114], face: 'up', priority: 1 },
  archivador_ejemplares: { rect: [276, 38, 42, 60], walkTo: [296, 112], face: 'up' },
  // Bruno le habla desde la izquierda de la ventanilla, de perfil, junto al agujerito (no delante de ella)
  begona_triplicado: { at: [193, 96, 'down'], walkTo: [158, 116], face: 'right' },
  // dentro de su despacho (leyendo con lupa); `puerta`: sale a la puerta de cristal cuando se le llama (adenda 3.8)
  evaristo_salvedad: { at: [252, 97, 'down'], walkTo: [240, 115], face: 'right',
    positions: { despacho: { at: [252, 97, 'down'] }, puerta: { at: [237, 106, 'left'], walkTo: [216, 114], face: 'right' } } },
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
  ellipse(g, 177, 64, 3, 2, PAL.metal[5]); ellipse(g, 177, 64, 2, 1, PAL.ink[0]);
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
}

function drawFloor(g) {
  floorTiles(g, { x: 0, y: 98, w: W, h: 46, vpx: W / 2, vpy: 34, tile: 20, rowPx: 8, colors: [PAL.paper[3], PAL.green[5]], colors3: PAL.paper[2], grout: PAL.green[2], far: PAL.green[0], fade: 0.5 });
  ditherOverlay(g, 0, 98, W, 4, PAL.shadow, 0.5);
  // línea amarilla de espera pintada en el suelo frente a la ventanilla
  for (let x = 162; x < 226; x += 6) { hline(g, x, 118, 4, PAL.gold[5]); hline(g, x, 119, 4, PAL.gold[3]); }
  // huellas de zapato mojado (viernes de lluvia)
  for (const [fx, fy] of [[60, 124], [66, 128], [110, 120], [118, 126], [150, 130], [233, 122]]) { ellipse(g, fx, fy, 2, 1, PAL.green[3]); }
  glow(g, 186, 112, 60, 14, PAL.crt[5], 0.05, 3);
}

function drawExitDoor(g) {
  // puerta metálica al pasillo del Ecosistema, con barra antipánico y ventanuco con alambre
  rect(g, 4, 28, 33, 71, PAL.metal[1]); frameRect(g, 4, 28, 33, 71, PAL.ink[0]);
  gradV(g, 7, 31, 27, 68, [PAL.metal[4], PAL.metal[3], PAL.metal[2]]);
  vline(g, 7, 31, 68, PAL.metal[6]); vline(g, 33, 31, 68, PAL.metal[1]);
  rect(g, 13, 38, 15, 18, PAL.ink[0]); gradV(g, 14, 39, 13, 16, [PAL.teal[3], PAL.teal[5]]);
  for (let i = 0; i < 13; i += 3) { vline(g, 14 + i, 39, 16, PAL.metal[6]); } for (let j = 0; j < 16; j += 3) hline(g, 14, 39 + j, 13, PAL.metal[6]);
  rect(g, 8, 70, 25, 4, PAL.red[3]); hline(g, 8, 70, 25, PAL.red[5]); hline(g, 8, 73, 25, PAL.red[1]);              // barra antipánico
  rect(g, 8, 88, 25, 8, PAL.metal[2]); hline(g, 8, 88, 25, PAL.metal[5]);                                         // chapa de patada
  rect(g, 7, 22, 27, 8, PAL.crt[2]); frameRect(g, 7, 22, 27, 8, PAL.crt[0]);
  miniText(g, 'PASILLO', 20, 24, PAL.crt[6], { align: 'center' });
  // «TIRE» con la flecha
  miniText(g, 'EMPUJE', 20, 60, PAL.ink[1], { align: 'center' });
  ditherOverlay(g, 4, 98, 36, 5, PAL.shadow, 0.5);
}

function drawHorario(g) {
  // cartel «ATENCIÓN: 19:00 A 19:15» y reloj parado en las 19:07 (según Begoña)
  const x = 36, y = 30, w = 43, h = 30;
  dropShadow(g, x, y, w, h, 2, 2, 0.5);
  rect(g, x, y, w, h, PAL.paper[6]); frameRect(g, x, y, w, h, PAL.metal[3]);
  rect(g, x + 1, y + 1, w - 2, 6, PAL.red[3]); hline(g, x + 1, y + 1, w - 2, PAL.red[5]);
  cap(g, 'ATENCIÓN', x + w / 2, y + 7, PAL.ink[1], { align: 'center' });
  cap(g, '19:00 A', x + w / 2, y + 15, PAL.ink[1], { align: 'center' });
  cap(g, '19:15', x + w / 2, y + 22, PAL.red[3], { align: 'center' });
  pin(g, x + 2, y + 2, PAL.metal[7]); pin(g, x + w - 3, y + 2, PAL.metal[7]);
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
  // cinco notas de gasto enmarcadas como trofeos (con placa y sello RECHAZADO); cornamenta en el centro
  const x0 = 82, y0 = 14;
  rect(g, x0, y0, 80, 26, PAL.wood[2]); frameRect(g, x0, y0, 80, 26, PAL.wood[1]); hline(g, x0, y0, 80, PAL.wood[5]);
  gradV(g, x0 + 1, y0 + 1, 78, 24, [PAL.wood[3], PAL.wood[2]]);
  const r = rng(51);
  for (let i = 0; i < 5; i++) {
    const fx = x0 + 3 + i * 15, fy = y0 + 4;
    dropShadow(g, fx, fy, 13, 17, 1, 1, 0.5);
    rect(g, fx, fy, 13, 17, PAL.gold[2]); hline(g, fx, fy, 13, PAL.gold[6]); vline(g, fx, fy, 17, PAL.gold[5]);
    rect(g, fx + 2, fy + 2, 9, 11, PAL.paper[6]);
    greek(g, fx + 3, fy + 3, 7, 4, PAL.paper[2], 10 + i, 2, 0.6);
    // sello RECHAZADO oblicuo
    line(g, fx + 2, fy + 11, fx + 10, fy + 6, PAL.red[4]); line(g, fx + 2, fy + 12, fx + 10, fy + 7, PAL.red[3]);
    rect(g, fx + 3, fy + 14, 7, 2, PAL.gold[4]); hline(g, fx + 4, fy + 15, 5, PAL.gold[2]);                  // placa de latón
  }
  // cornamenta de ciervo sobre el marco del centro
  for (const s of [-1, 1]) { const cx = x0 + 40; line(g, cx + s * 2, y0 + 1, cx + s * 8, y0 - 4, PAL.paper[5]); line(g, cx + s * 8, y0 - 4, cx + s * 10, y0 - 9, PAL.paper[5]); line(g, cx + s * 6, y0 - 2, cx + s * 4, y0 - 7, PAL.paper[4]); }
  rect(g, x0 + 37, y0 - 1, 6, 3, PAL.wood[4]);
}

function drawRecorte(g) {
  const x = 82, y = 42, w = 80, h = 40;
  dropShadow(g, x, y, w, h, 2, 2, 0.5);
  rect(g, x, y, w, h, PAL.paper[6]); frameRect(g, x, y, w, h, PAL.red[3]); frameRect(g, x + 1, y + 1, w - 2, h - 2, PAL.paper[4]);
  rect(g, x + 2, y + 2, w - 4, 6, PAL.red[3]); hline(g, x + 2, y + 2, w - 4, PAL.red[5]);
  miniText(g, 'AVISO AL PERSONAL', x + w / 2, y + 3, PAL.white, { align: 'center' });
  miniText(g, 'TODA PIEZA O NOTA', x + w / 2, y + 10, PAL.ink[1], { align: 'center' });
  miniText(g, 'SUFRE EL RECORTE', x + w / 2, y + 16, PAL.ink[1], { align: 'center' });
  cap(g, 'ESTÁNDAR (26 %)', x + w / 2, y + 25, PAL.red[3], { align: 'center' });
  miniText(g, 'SIN EXCEPCIONES', x + w / 2, y + 34, PAL.ink[1], { align: 'center' });
  pin(g, x + 3, y + 3, PAL.metal[7]); pin(g, x + w - 3, y + 3, PAL.metal[7]);
}

function drawBench(g) {
  // banco de espera de plástico naranja (cuatro asientos soldados) bajo el cartel
  const x = 88, y = 84;
  shadowEllipse(g, x + 36, 99, 38, 3, 0.7);
  for (let i = 0; i < 4; i++) {
    const cx = x + i * 18;
    poly(g, [[cx + 1, y], [cx + 16, y], [cx + 17, y + 9], [cx, y + 9]], PAL.dusk[5]); hline(g, cx + 1, y, 15, PAL.dusk[7]);
    vline(g, cx + 16, y, 9, PAL.dusk[3]);
    rect(g, cx + 1, y + 10, 16, 4, PAL.dusk[4]); hline(g, cx + 1, y + 10, 16, PAL.dusk[6]); hline(g, cx + 1, y + 13, 16, PAL.dusk[2]);
  }
  rect(g, x + 2, y + 14, 3, 10, PAL.metal[3]); rect(g, x + 68, y + 14, 3, 10, PAL.metal[3]); rect(g, x + 35, y + 14, 3, 10, PAL.metal[3]);
  hline(g, x + 2, y + 24, 3, PAL.ink[1]); hline(g, x + 35, y + 24, 3, PAL.ink[1]); hline(g, x + 68, y + 24, 3, PAL.ink[1]);
  // revista antigua y tela de araña en el asiento 4
  rect(g, x + 38, y + 10, 8, 3, PAL.paper[5]); hline(g, x + 39, y + 11, 6, PAL.red[4]);
  line(g, x + 54, y + 1, x + 60, y + 8, PAL.paper[6]); line(g, x + 60, y + 1, x + 54, y + 8, PAL.paper[6]); hline(g, x + 54, y + 4, 7, PAL.paper[6]);
  // paraguas goteando
  line(g, x - 6, y + 4, x - 4, y + 22, PAL.ink[0]); line(g, x - 6, y + 4, x - 3, y + 2, PAL.ink[0]); ellipse(g, x - 4, y + 24, 3, 1, PAL.teal[3]);
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

function drawOffice(g) {
  // despacho acristalado de Controlling: marco de aluminio, puerta de cristal esmerilado con rótulo, interior visible
  const x0 = 224, x1 = 274, y0 = 24, yb = 98;
  // interior
  rect(g, x0, y0, x1 - x0, yb - y0, PAL.paper[3]);
  gradV(g, x0 + 2, y0 + 2, x1 - x0 - 4, yb - y0 - 2, [PAL.paper[5], PAL.paper[4], PAL.paper[3]]);
  // suelo / zócalo interior moqueta granate
  rect(g, x0 + 2, 94, x1 - x0 - 4, 4, PAL.red[1]);
  // coma enmarcada en la pared interior
  const cx = 250, cy = 33;
  rect(g, cx, cy, 14, 14, PAL.gold[3]); frameRect(g, cx, cy, 14, 14, PAL.gold[1]); hline(g, cx, cy, 14, PAL.gold[6]); vline(g, cx, cy, 14, PAL.gold[5]);
  rect(g, cx + 2, cy + 2, 10, 10, PAL.paper[7]);
  ellipse(g, cx + 6, cy + 5, 2, 2, PAL.ink[1]); poly(g, [[cx + 7, cy + 6], [cx + 8, cy + 6], [cx + 6, cy + 11], [cx + 5, cy + 11]], PAL.ink[1]);       // la coma
  rect(g, cx + 4, cy + 14, 6, 2, PAL.gold[4]);                                                                                                        // placa
  // torres de contratos (LEÍDOS) a la derecha: tres columnas de carpetas
  const cs = [PAL.blue[4], PAL.red[4], PAL.gold[4], PAL.leaf[5], PAL.paper[6], PAL.dusk[4]];
  const r = rng(77);
  for (const [tx, tw, th] of [[259, 6, 34], [265, 5, 28], [269, 4, 40]]) {
    let yy = 98;
    shadowEllipse(g, tx + tw / 2, 98, tw + 2, 1.5, 0.5);
    while (yy > 98 - th) { const hh = 3 + ((r() * 2) | 0); rect(g, tx + (r() < 0.5 ? 0 : 1), yy - hh, tw, hh, cs[(r() * cs.length) | 0]); hline(g, tx, yy - hh, tw, PAL.paper[7]); yy -= hh; }
  }
  rect(g, 258, 92, 15, 2, PAL.metal[2]);
  // escritorio visible: lupa y carpeta abierta sobre mesa pequeña
  rect(g, 232, 82, 22, 3, PAL.wood[5]); hline(g, 232, 82, 22, PAL.wood[7]); rect(g, 233, 85, 2, 12, PAL.wood[2]); rect(g, 251, 85, 2, 12, PAL.wood[2]);
  rect(g, 238, 79, 10, 3, PAL.paper[7]); line(g, 249, 80, 253, 77, PAL.metal[5]); ellipse(g, 254, 76, 2, 2, PAL.teal[5]);
  // lámpara verde
  rect(g, 231, 78, 2, 4, PAL.metal[3]); poly(g, [[229, 77], [236, 77], [234, 73], [231, 73]], PAL.green[3]);
  // marco de aluminio y cristal (frontal)
  rect(g, x0, y0, x1 - x0, 3, PAL.metal[5]); hline(g, x0, y0, x1 - x0, PAL.metal[7]); hline(g, x0, y0 + 2, x1 - x0, PAL.metal[2]);
  rect(g, x0, y0, 3, yb - y0, PAL.metal[5]); vline(g, x0, y0, yb - y0, PAL.metal[7]);
  rect(g, x1 - 3, y0, 3, yb - y0, PAL.metal[5]); vline(g, x1 - 3, y0, yb - y0, PAL.metal[7]); vline(g, x1 - 1, y0, yb - y0, PAL.ink[1]);
  rect(g, x0, 40, x1 - x0, 2, PAL.metal[4]); hline(g, x0, 40, x1 - x0, PAL.metal[7]);
  // cristal: reflejos diagonales y tinte
  glaze(g, x0 + 3, 42, x1 - x0 - 6, 56, PAL.teal[6], 0.1);
  ditherOverlay(g, 250, 44, 8, 50, PAL.white, 0.07);
  // dintel: rótulo esmerilado
  bevel(g, x0 + 3, y0 + 3, x1 - x0 - 6, 14, PAL.teal[2], PAL.teal[4], PAL.teal[0]);
  miniText(g, 'CONTROLLING', (x0 + x1) / 2, y0 + 5, PAL.teal[7], { align: 'center' });
  miniText(g, 'Y FINANZAS', (x0 + x1) / 2, y0 + 11, PAL.teal[7], { align: 'center' });
  // puerta de cristal esmerilado (izquierda) con marco, rótulo y tirador
  const dx = 228, dw = 17, dy = 42;
  rect(g, dx - 1, dy - 1, dw + 2, yb - dy + 1, PAL.metal[3]); frameRect(g, dx - 1, dy - 1, dw + 2, yb - dy + 1, PAL.metal[1]);
  paint(g, dx, dy, dw, yb - dy, (xx, yy) => ditherPick(xx, yy, [PAL.teal[5], PAL.teal[6], PAL.paper[6]], 0.35 + ((xx - dx) / dw) * 0.3 + hash2(xx, yy, 7) * 0.12));
  rect(g, dx + 3, dy + 6, dw - 6, 1, PAL.teal[3]); rect(g, dx + 3, dy + 9, dw - 10, 1, PAL.teal[3]);
  rect(g, dx + dw - 4, 66, 2, 8, PAL.metal[7]); vline(g, dx + dw - 4, 66, 8, PAL.white);
  hline(g, dx, yb - 2, dw, PAL.metal[3]);
  ditherOverlay(g, x0, yb, x1 - x0 + 2, 3, PAL.shadow, 0.5);
}

function drawArchivador(g) {
  // armario archivador de acero verde, ocho cajones; rótulo EJEMPLARES, candado y nota «NO TOCAR»
  const x = 276, y = 38, w = 42, h = 60;
  shadowEllipse(g, x + w / 2, y + h, w / 2 + 2, 3, 0.7);
  rect(g, x, y, w, h, PAL.green[1]); frameRect(g, x, y, w, h, PAL.ink[0]);
  gradV(g, x + 1, y + 1, w - 2, h - 2, [PAL.green[5], PAL.green[4], PAL.green[3]]);
  hline(g, x, y, w, PAL.green[7]); vline(g, x, y, h, PAL.green[6]); vline(g, x + w - 1, y, h, PAL.green[1]);
  // rótulo superior
  bevel(g, x + 1, y + 3, w - 2, 9, PAL.paper[6], PAL.white, PAL.paper[2]);
  miniText(g, 'EJEMPLARES', x + w / 2, y + 6, PAL.red[3], { align: 'center' });
  for (let j = 0; j < 4; j++) {
    const cy = y + 15 + j * 11;
    for (let i = 0; i < 2; i++) {
      const cx = x + 3 + i * 19;
      bevel(g, cx, cy, 18, 10, PAL.green[4], PAL.green[6], PAL.green[1]);
      hline(g, cx + 6, cy + 3, 6, PAL.metal[6]); hline(g, cx + 6, cy + 4, 6, PAL.metal[2]);                // tirador
      rect(g, cx + 2, cy + 6, 6, 3, PAL.paper[6]); hline(g, cx + 3, cy + 7, 4, PAL.metal[3]);              // etiqueta
    }
  }
  // candado en el cajón de arriba y nota «NO TOCAR»
  rect(g, x + 28, y + 20, 4, 4, PAL.gold[4]); frameRect(g, x + 28, y + 20, 4, 4, PAL.gold[1]); hline(g, x + 28, y + 18, 4, PAL.metal[5]);
  rect(g, x + 8, y + 27, 29, 7, PAL.gold[5]); hline(g, x + 8, y + 27, 29, PAL.gold[6]); miniText(g, 'NO TOCAR', x + 22, y + 29, PAL.red[3], { align: 'center' });
  // arañazos y sombra lateral
  ditherOverlay(g, x + w - 4, y + 2, 4, h - 2, PAL.shadow, 0.35);
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

export default {
  room: 'administracion',
  width: 320,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [[8, 104], [314, 104], [318, 142], [2, 142]] }],
  entries: { ecosistema: [28, 116, 'right'] },
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
    drawBench(g);
    drawBoothBack(g);
    drawOffice(g);
    drawArchivador(g);
    drawQueue(g);
    drawLights(g);
    vignette(g, W, 144, 0.5);
  },
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
