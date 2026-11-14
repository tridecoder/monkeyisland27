// SALA `catacumba` — REDACCIÓN DE PAPEL / CIERRE (apodo, solo en boca de los personajes: la Catacumba). Arte y geometría
// (rediseño, docs/GUIA_REDISENO.md §8, §10). Biblia §3.4 + adenda §3.6. Planta 1, AL LADO de la Redacción web y al mismo
// nivel (orden de dirección 2): a la izquierda, la puerta doble abierta con el umbral de latón y la placa del kit
// «1 REDACCIÓN ◄ / REDACCIÓN WEB»; por ella se ve el azul de las pantallas. La placa esmaltada «TALLERES» (que antes
// colgaba en la puerta del Office) cuelga aquí dentro, sobre el camastro. Tres zonas con su suelo, filete y pilastra: la mesa de TEODORO (camastro tras
// la cortina, el fax y el teléfono rojo bajo su cartel «ROTATIVA», el tipómetro; Teodoro SENTADO frente al fax, de perfil,
// con la mesa por delante), la PARED DE CIERRE (reloj de las 20:59, galería de ex-jefes de cierre, fax enmarcado, cajonera
// de tipos) y la mesa de AURORA (cartel, Libro de Estilo y tableta calzando la pata, bolis rojos). Galeradas colgadas como
// jamones, conductos viejos del aire en el techo (edificio de 1987), bombillas desnudas. Primer plano: bobinas de papel (oclusor que no tapa a nadie).
import { PAL, px, rect, hline, vline, frameRect, line, poly, ellipse, paint, ditherPick, ditherOverlay, noise, glow, gradV,
  rng, hash2, shade, shadowEllipse, bevel, vignette, floorPlanks, desk, wallClock,
  bookshelf, newspaperStack, mug, papers, lightCone, trashBin } from '../../../engine/draw.js';
import { greek, cap, pin, stain, dropShadow, fabric, cord } from './lib-catacumba-util.js';
import * as kit from '../../lib/kit.js';

const W = 320;
const TOB = ['#2c2016', '#45321f', '#5f4829', '#7a5f35', '#957845', '#b09457', '#c9ae70']; // pared con nicotina
const GRN = [PAL.green[0], PAL.green[1], PAL.green[2], PAL.green[3], PAL.green[4]];        // zócalo verde de cola
const OLDW = PAL.wood.map((c) => shade(c, -0.12));

// ------------------------------------------------------------ geometría
const FL = 97;                       // línea pared / suelo
const FAX = { x: 103, y: 77 };       // el fax, sobre la mesa de Teodoro (a su derecha: Teodoro lo mira de perfil)
const DESK_Y = 91, DESK_ZY = 110;    // tablero de la mesa de Teodoro; z de su frente (quien está más abajo va delante)
const layout = {
  catacumba_a_pecera: { rect: [3, 26, 42, 72], walkTo: [30, 112], face: 'left' },
  galeradas: { rect: [74, 15, 98, 24], walkTo: [120, 112], face: 'up' },
  camastro: { rect: [44, 52, 34, 46], walkTo: [62, 112], face: 'up' },
  mesa_teodoro: { rect: [98, DESK_Y, 72, 20], layer: 'sorted', zy: DESK_ZY, prop: true, cache: true, cachePad: 6, draw: (g) => drawTeodoroDesk(g) },
  fax: {
    rect: [FAX.x, FAX.y, 26, 17], walkTo: [148, 114], face: 'left',   // [P3] de lado: no tapa el fax ni a Teodoro
    layer: 'sorted', zy: DESK_ZY + 1,
    sprites: {
      sin_papel: (g, v, t) => drawFax(g, FAX.x, FAX.y, false, t),
      con_papel: (g, v, t) => drawFax(g, FAX.x, FAX.y, true, t),
      // [P3] plan §4.5: imprimiendo (la hoja sale 2 px cada 80 ms, y vuelve a empezar)
      imprimiendo: (g, v, t) => { drawFax(g, FAX.x, FAX.y, true, t); drawHojaSaliendo(g, FAX.x, FAX.y, t); },
      default: (g, v, t) => drawFax(g, FAX.x, FAX.y, false, t),
    },
  },
  telefono_rojo: {
    rect: [131, 79, 16, 15], walkTo: [139, 113], face: 'up', layer: 'sorted', zy: DESK_ZY + 1, cache: true, cachePad: 12,
    sprites: { colgado: (g) => drawTelefono(g, false), descolgado: (g) => drawTelefono(g, true), default: (g) => drawTelefono(g, false) },
  },
  tipometro: { rect: [134, 89, 28, 11], walkTo: [150, 113], face: 'up', layer: 'sorted', zy: DESK_ZY + 1, cache: true, cachePad: 4, draw: (g) => drawTipometro(g) },
  reloj_2147: { rect: [176, 29, 22, 22], walkTo: [187, 114], face: 'up' },
  fotos_jefes_cierre: { rect: [198, 27, 42, 26], walkTo: [214, 114], face: 'up' },
  fax_enmarcado: { rect: [220, 55, 18, 24], walkTo: [230, 114], face: 'up' },
  // [P3] plan §4.5: la factura del envío (0,26 €), grapada en la pared de Teodoro, sobre el fax
  factura_fax: { rect: [104, 56, 12, 13], walkTo: [114, 112], face: 'up', draw: (g) => drawFactura(g, 105, 57) },
  cartel_aurora: { rect: [248, 36, 50, 30], walkTo: [266, 114], face: 'up' },
  libro_estilo: { rect: [244, 89, 28, 11], walkTo: [258, 114], face: 'up' },
  bolis_aurora: { rect: [284, 62, 14, 20], walkTo: [290, 114], face: 'up', priority: 1 },
  corrector_aurora: { rect: [275, 88, 14, 12], walkTo: [280, 116], face: 'up', priority: 2 },
  // Teodoro SENTADO frente al fax, de perfil (la mesa le tapa las rodillas). `telefono` = su sitio al teléfono rojo en la
  // escena 7.3a: de pie delante de la mesa, a la derecha del aparato, mirándolo. Bruno le habla desde la izquierda.
  teodoro_cuerpodoce: { at: [94, 104, 'right'], pose: 'sentado', walkTo: [66, 124], face: 'right', positions: { telefono: { at: [152, 113, 'left'] } } },
  aurora_galerada: { at: [232, 108, 'right'], walkTo: [206, 124], face: 'right' },
};

// ------------------------------------------------------------ objetos con estado
/** Teléfono rojo sin teclas ni disco (línea directa con la rotativa), sobre la mesa de Teodoro. Colgado: auricular en su
 *  horquilla y luz apagada. Descolgado: horquilla vacía con el botón levantado, cable tenso y piloto ámbar encendido
 *  (el auricular lo pinta el `drawExtra` del actor en content/actors.js mientras Teodoro habla; el cable de él acaba en 141,80). */
function drawTelefono(g, descolgado) {
  const x = 131, y = 79;
  shadowEllipse(g, x + 8, 94, 9, 1.5, 0.5);
  poly(g, [[x + 2, 86], [x + 14, 86], [x + 16, 93], [x, 93]], PAL.red[3]);
  hline(g, x + 2, 86, 12, PAL.red[5]); hline(g, x, 93, 17, PAL.red[1]); vline(g, x, 92, 1, PAL.red[1]);
  ellipse(g, x + 8, 90, 4, 1.5, PAL.red[2]); px(g, x + 6, 89, PAL.red[6]);
  if (!descolgado) {
    rect(g, x, y + 2, 16, 5, PAL.red[4]); hline(g, x, y + 2, 16, PAL.red[6]); hline(g, x + 1, y + 6, 14, PAL.red[1]); hline(g, x + 3, y + 3, 10, PAL.red[5]);
    rect(g, x - 1, y + 3, 3, 7, PAL.red[3]); rect(g, x + 14, y + 3, 3, 7, PAL.red[3]); hline(g, x - 1, y + 3, 3, PAL.red[6]); hline(g, x + 14, y + 3, 3, PAL.red[6]);
    hline(g, x - 1, y + 9, 3, PAL.red[1]); hline(g, x + 14, y + 9, 3, PAL.red[1]); vline(g, x + 4, y + 7, 3, PAL.ink[1]); vline(g, x + 11, y + 7, 3, PAL.ink[1]);
    px(g, x + 8, 91, PAL.red[1]);
  } else {
    rect(g, x + 1, y + 5, 2, 4, PAL.red[2]); rect(g, x + 13, y + 5, 2, 4, PAL.red[2]); px(g, x + 1, y + 5, PAL.red[5]); px(g, x + 13, y + 5, PAL.red[5]);
    rect(g, x + 6, y + 6, 4, 2, PAL.metal[5]); hline(g, x + 6, y + 6, 4, PAL.metal[7]);
    rect(g, x + 7, 90, 3, 2, '#ffb030'); px(g, x + 8, 90, '#fff0a0');            // piloto de línea ocupada
    glow(g, x + 8, 90, 9, 4, '#ffb030', 0.25, 3);
    for (let i = 0; i < 5; i++) px(g, x + 16 + (i & 1), y + 1 - ((i * 5) >> 2) + 5, PAL.red[2]);  // el cable rizado sale hacia la mano
  }
  kit.cantoVivo(g, x - 1, y + 3, 18, 14);
  for (let i = 0; i < 6; i++) px(g, x - 1 - i, 93 + (i & 1), PAL.ink[1]);          // cable al enchufe de la mesa
}

/** Tipómetro: regla de latón con marcas, tumbada en diagonal sobre el tablero (26×11). */
function drawTipometro(g) {
  const x0 = 135, y0 = 98, x1 = 161, y1 = 90;
  line(g, x0 + 1, y0 + 3, x1 + 1, y1 + 3, PAL.ink[0], 1);                      // sombra
  line(g, x0, y0, x1, y1, PAL.gold[4], 3);
  line(g, x0, y0 - 1, x1, y1 - 1, PAL.gold[6], 1);
  line(g, x0, y0 + 1, x1, y1 + 1, PAL.gold[2], 1);
  for (let i = 1; i < 26; i += 2) { const xx = x0 + i, yy = Math.round(y0 + (y1 - y0) * i / 26); px(g, xx, yy + 1, PAL.ink[1]); if (i % 6 === 1) px(g, xx, yy, PAL.ink[1]); }
  px(g, x0 + 2, y0 - 2, PAL.gold[7] || '#fff4b8'); px(g, x1 - 1, y1 - 2, '#fff4b8');
}

/** Fax beige de 1992, 26x17. Sin papel: bandeja vacía + luz roja que parpadea; con papel: folios y papel continuo saliendo. */
function drawFax(g, x, y, papel, t) {
  const B = PAL.paper;
  shadowEllipse(g, x + 13, y + 17, 15, 2, 0.6);
  poly(g, [[x + 3, y], [x + 21, y], [x + 24, y + 5], [x + 2, y + 5]], papel ? PAL.paper[6] : PAL.metal[2]);
  if (papel) { hline(g, x + 5, y + 1, 14, B[3]); hline(g, x + 4, y + 3, 17, B[3]); hline(g, x + 4, y, 16, B[7]); }
  else { hline(g, x + 3, y, 18, PAL.metal[4]); }
  bevel(g, x, y + 5, 26, 12, B[3], B[5], B[0]);
  hline(g, x + 1, y + 6, 24, B[4]);
  rect(g, x + 15, y + 8, 9, 3, PAL.crt[0]);
  rect(g, x + 15, y + 8, 9, 1, PAL.crt[1]);
  if (!papel) { for (let i = 0; i < 4; i++) rect(g, x + 16 + i * 2, y + 9, 1, 2, PAL.crt[3]); }
  else { hline(g, x + 16, y + 9, 7, PAL.crt[5]); hline(g, x + 16, y + 10, 4, PAL.crt[4]); }
  for (let i = 0; i < 5; i++) rect(g, x + 15 + i * 2, y + 13, 1, 1, i % 2 ? PAL.metal[1] : B[1]);
  const blink = !papel && ((t || 0) % 1200) < 600;
  rect(g, x + 22, y + 14, 2, 1, papel ? PAL.crt[5] : blink ? '#FF7E6A' : PAL.red[1]);
  if (!papel && blink) glow(g, x + 23, y + 14, 6, 4, '#ff5a40', 0.18, 3);
  if (papel) glow(g, x + 8, y + 22, 12, 6, '#fff2c0', 0.18, 3);
  rect(g, x + 2, y + 13, 11, 2, PAL.ink[1]);
  if (papel) {
    poly(g, [[x + 3, y + 14], [x + 12, y + 14], [x + 13, y + 17], [x + 2, y + 17]], B[6]);
    for (let i = 0; i < 3; i++) hline(g, x + 4 + i, y + 15, 5 - i, B[3]);
  }
  hline(g, x, y + 16, 26, B[0]);
  rect(g, x + 1, y + 17, 3, 1, PAL.ink[1]); rect(g, x + 22, y + 17, 3, 1, PAL.ink[1]);
  if (papel) {
    for (let i = 0; i < 7; i++) {
      const yy = y + 17 + i; rect(g, x + 4, yy, 7, 1, i % 2 ? B[5] : B[6]);
      if (i % 3 === 0) { px(g, x + 4, yy, PAL.ink[3]); px(g, x + 10, yy, PAL.ink[3]); }
    }
    hline(g, x + 5, y + 20, 5, B[2]);
  }
  kit.cantoVivo(g, x, y, 26, 17);
}

/** [P3] La hoja que sale del fax mientras imprime: crece 2 px cada 80 ms hasta 16 px y vuelve a empezar. */
function drawHojaSaliendo(g, x, y, t) {
  const h = 2 + ((Math.floor((t || 0) / 80) * 2) % 16);
  rect(g, x + 3, y + 14, 9, h, PAL.paper[7]); vline(g, x + 11, y + 14, h, PAL.paper[4]);
  for (let i = 3; i < h - 1; i += 3) hline(g, x + 4, y + 14 + i, 6 - (i % 4), PAL.ink[3]);
}
/** [P3] La factura del fax: papelito con grapa, renglones y sello rojo. */
function drawFactura(g, x, y) {
  dropShadow(g, x, y, 9, 11, 1, 1, 0.5);
  rect(g, x, y, 9, 11, PAL.paper[6]); hline(g, x, y, 9, PAL.paper[7]); vline(g, x + 8, y + 1, 10, PAL.paper[4]);
  rect(g, x + 2, y - 1, 5, 1, PAL.metal[6]);                       // grapa
  for (let i = 0; i < 3; i++) hline(g, x + 1, y + 2 + i * 2, 6 - i, PAL.ink[3]);
  frameRect(g, x + 2, y + 7, 5, 3, PAL.red[3]); px(g, x + 4, y + 8, PAL.red[4]);
}

// ------------------------------------------------------------ piezas del fondo
function drawCeiling(g) {
  gradV(g, 0, 0, W, 16, [PAL.ink[0], PAL.ink[1], '#2a1e16', '#33261a']);
  noise(g, 0, 0, W, 14, '#4a3828', 0.06, 2);
  rect(g, 0, 12, W, 3, '#1c140e'); hline(g, 0, 12, W, '#4b3a28'); hline(g, 0, 15, W, '#241912');
  const ramp = [PAL.metal[1], PAL.metal[2], PAL.metal[4], PAL.metal[5], PAL.metal[4], PAL.metal[2]];
  for (let k = 0; k < 6; k++) hline(g, 0, 3 + k, W, ramp[k]);
  for (let x = 0; x < W; x += 2) px(g, x, 4, PAL.metal[6]);
  hline(g, 0, 9, W, PAL.ink[0]);
  rect(g, 0, 10, W, 2, '#6a4a30'); hline(g, 0, 10, W, '#9a7248'); hline(g, 0, 11, W, '#3a281a');
  for (const bx of [22, 70, 118, 166, 214, 262, 308]) {
    rect(g, bx, 2, 4, 9, PAL.metal[2]); vline(g, bx, 2, 9, PAL.metal[5]); vline(g, bx + 3, 2, 9, PAL.ink[1]);
    px(g, bx + 1, 4, PAL.ink[0]); px(g, bx + 1, 8, PAL.ink[0]);
  }
}

function drawWall(g) {
  paint(g, 0, 15, W, 82, (x, y) => {
    const ty = (y - 15) / 82;
    const lightL = Math.exp(-Math.pow((x - 130) / 140, 2)) * 0.5 + Math.exp(-Math.pow((x - 262) / 90, 2)) * 0.3;
    return ditherPick(x, y, TOB, Math.min(0.95, 0.18 + ty * 0.38 + lightL * 0.35));
  });
  noise(g, 0, 15, W, 80, TOB[1], 0.025, 4);
  stain(g, 40, 30, 14, 9, TOB[1], 0.5); stain(g, 190, 22, 22, 6, TOB[1], 0.45); stain(g, 300, 38, 12, 14, TOB[1], 0.5);
  stain(g, 232, 62, 8, 6, TOB[2], 0.4);
  paint(g, 0, 70, W, 26, (x, y) => ditherPick(x, y, [GRN[2], GRN[3], GRN[4]], 0.25 + (96 - y) / 26 * 0.3 + hash2(x >> 2, y, 3) * 0.12));
  hline(g, 0, 69, W, TOB[6]); hline(g, 0, 70, W, GRN[4]); hline(g, 0, 71, W, GRN[1]);
  ditherOverlay(g, 0, 72, W, 6, PAL.shadow, 0.22);
  noise(g, 0, 72, W, 24, GRN[1], 0.06, 12);
  rect(g, 0, 95, W, 3, PAL.wood[2]); hline(g, 0, 95, W, PAL.wood[4]); hline(g, 0, 97, W, PAL.ink[0]);
  kit.filete(g, 0, W, 66, 'papel');
}

function drawFloor(g) {
  floorPlanks(g, { x: 0, y: 98, w: W, h: 46, vpx: W / 2, vpy: 30, plank: 11, ramp: OLDW, seed: 14, far: PAL.ink[0], fade: 0.55 });
  for (let i = 0; i < 26; i++) { const x = 6 + ((hash2(i, 1, 3) * (W - 14)) | 0), y = 101 + ((hash2(i, 2, 3) * 40) | 0), w = 3 + ((hash2(i, 3, 3) * 6) | 0); hline(g, x, y, w, PAL.ink[1]); hline(g, x + 1, y + 1, w - 2, PAL.wood[1]); }
  // tres suelos con su canto: la alfombra raída de Teodoro, el entarimado de la pared de cierre y el linóleo de Aurora
  drawRug(g);
  kit.zonaSuelo(g, 172, 238, 98, ['#4a3220', '#5a4028', '#6a4e32'], { vpx: 205, vpy: 30, borde: '#b08850', seed: 6 });
  kit.zonaSuelo(g, 246, 320, 98, ['#2e3a30', '#384636', '#44543e'], { vpx: 284, vpy: 30, trama: 'baldosa', borde: '#7a9070', seed: 7 });
  ditherOverlay(g, 0, 98, W, 4, PAL.shadow, 0.5);
}

function drawDoor(g) {
  // la puerta doble a la Redacción web, abierta de par en par y AL MISMO NIVEL (orden de dirección 2): por el hueco se
  // ve el nogal y el parqué de la bisagra y, al fondo, el resplandor de las pantallas; en el suelo, el umbral de latón
  const x = 6, y = 33, w = 34, h = FL - 33;
  kit.marcoPuerta(g, x, y, w, h, { ramp: PAL.wood });
  // lo que hay de verdad al otro lado: la bisagra de la Redacción (pared de nogal con friso y parqué de tablilla, como en
  // pecera.art.js `zonaPapel`) y, más allá, a la derecha, el resplandor frío de las pantallas de la Redacción web
  gradV(g, x, y, w, h, ['#4a3420', '#6a4a2c', '#7a5634']);
  hline(g, x, y + 22, w, '#9a7446'); hline(g, x, y + 23, w, '#2a1a10');                                          // el friso
  rect(g, x + 6, y + 26, 11, 14, PAL.paper[6]); frameRect(g, x + 6, y + 26, 11, 14, PAL.wood[1]);              // «EL MATERIAL NO SE PIDE…»
  for (let l = 0; l < 4; l++) hline(g, x + 8, y + 29 + l * 3, 7 - (l & 1) * 2, l === 0 ? PAL.red[3] : PAL.ink[3]);
  paint(g, x, y + h - 12, w, 12, (xx, yy) => ditherPick(xx, yy, ['#3a2616', '#4a321c', '#5a3e24', '#6a4a2c'], (yy - (y + h - 12)) / 12 + (((xx + yy * 3) >> 2) & 1) * 0.1));
  rect(g, x + 2, y + 6, w - 4, 3, PAL.metal[4]); hline(g, x + 2, y + 9, w - 4, '#e8fff0');                       // un fluorescente
  for (let k = 0; k < 2; k++) { const mx = x + 18 + k * 7; rect(g, mx, y + 30, 6, 5, PAL.ink[1]); rect(g, mx + 1, y + 31, 4, 3, [PAL.crt[3], PAL.blue[4]][k]); }
  glow(g, x + w - 6, y + 32, 16, 14, '#8ec8ff', 0.4, 3); glow(g, x + w / 2, y + 12, 20, 10, '#fff4d8', 0.2, 3);
  for (const [lx, d] of [[x, 1], [x + w - 5, -1]]) { rect(g, lx, y, 5, h, OLDW[3]); vline(g, lx + (d > 0 ? 0 : 4), y, h, OLDW[5]); vline(g, lx + (d > 0 ? 4 : 0), y, h, OLDW[1]); }
  ditherOverlay(g, x, y + h - 4, w, 4, PAL.ink[0], 0.35);
  kit.cantoVivo(g, x - 3, y - 3, w + 6, h + 3);
  // placa de destino del kit sobre el dintel: «1 REDACCIÓN ◄ / REDACCIÓN WEB»
  kit.placaSala(g, 3, 10, 'pecera', { flecha: '<' });
  // el umbral de latón: la frontera, del color del destino (Redacción, azul)
  kit.umbral(g, x - 4, FL + 1, w + 8, 6, kit.DEPTO.redaccion.c, { chevron: true });
  line(g, x - 5, FL + 8, x + w + 5, FL + 8, PAL.gold[5]); line(g, x - 6, FL + 9, x + w + 6, FL + 9, PAL.gold[2]);
  ditherOverlay(g, 4, 98, 40, 3, PAL.shadow, 0.4);
}
/** La placa esmaltada «TALLERES» (gag de la biblia: antes en la puerta del Office): ahora cuelga aquí dentro, torcida,
 *  del mismo cordel que las galeradas, lejos de la barra de la cortina del camastro y del cartel «ROTATIVA». */
function drawTalleres(g) {
  const x = 130, y = 32, w = 35, h = 10;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.ink[0], 0.45);
  rect(g, x, y, w, h, PAL.paper[7]); frameRect(g, x, y, w, h, PAL.blue[3]);
  kit.micro(g, 'TALLERES', x + (w >> 1) + 1, y + 3, PAL.blue[2], { align: 'center' });
  px(g, x + 1, y + 1, PAL.paper[5]); px(g, x + w - 2, y + 8, PAL.paper[2]); px(g, x + 3, y + 8, PAL.metal[2]);   // desconchones
  line(g, x + 4, y, x + 17, y - 9, PAL.metal[3]); line(g, x + w - 4, y, x + 17, y - 9, PAL.metal[3]); px(g, x + 17, y - 10, PAL.metal[5]);   // colgada del cordel
}

function drawGaleradas(g) {
  const x0 = 76, x1 = 170;
  cord(g, x0, 17, x1, 19, 4, PAL.wood[5]);
  px(g, x0, 17, PAL.ink[0]); px(g, x1, 19, PAL.ink[0]);
  const r = rng(77);
  for (let x = x0 + 5; x < x1 - 3; x += 7 + ((r() * 4) | 0)) {
    const t = (x - x0) / (x1 - x0), cy = Math.round(17 + 2 * t + Math.sin(t * Math.PI) * 4);
    const len = 13 + ((r() * 11) | 0), w = 6 + ((r() * 3) | 0);
    const lean = r() < 0.5 ? -1 : 1;
    ditherOverlay(g, x + 2, cy + 2, w, len, PAL.shadow, 0.35);
    for (let yy = 0; yy < len; yy++) {
      const xo = Math.round(lean * Math.sin(yy / len * 2) * 0.8);
      hline(g, x + xo, cy + yy, w, PAL.paper[5]);
      px(g, x + xo, cy + yy, PAL.paper[3]); px(g, x + xo + w - 1, cy + yy, PAL.paper[2]);
    }
    rect(g, x + 1, cy + 2, w - 2, 2, PAL.ink[2]);
    greek(g, x + 1, cy + 5, w - 2, ((len - 7) / 2) | 0, PAL.paper[2], x, 2, 0.6);
    if (r() < 0.6) { const my = cy + 6 + ((r() * (len - 9)) | 0); hline(g, x, my, w, PAL.red[4]); px(g, x + w - 1, my - 1, PAL.red[4]); }
    rect(g, x + (w >> 1) - 1, cy - 1, 2, 4, PAL.wood[5]); px(g, x + (w >> 1) - 1, cy - 1, PAL.wood[7]);
    px(g, x, cy + len - 1, PAL.paper[2]); px(g, x + w - 1, cy + len, PAL.paper[2]);
  }
}

function drawReloj(g) {
  // esfera de 9 px de radio: horaria casi en el 9 y minutero casi en el 12 (las 20:59: falta un minuto)
  const cx = 187, cy = 40;
  shadowEllipse(g, cx + 1, cy + 11, 10, 1, 0.3);
  ellipse(g, cx + 1, cy + 1, 11, 11, PAL.ink[0]);
  ellipse(g, cx, cy, 10, 10, PAL.metal[3]);
  ellipse(g, cx, cy, 9, 9, (x, y, d) => d > 0.85 ? PAL.paper[4] : d > 0.55 ? PAL.paper[6] : PAL.paper[7]);
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    px(g, Math.round(cx + Math.sin(a) * 7.2), Math.round(cy - Math.cos(a) * 7.2), PAL.ink[1]);
    if (i % 3 === 0) px(g, Math.round(cx + Math.sin(a) * 6.2), Math.round(cy - Math.cos(a) * 6.2), PAL.ink[1]);
  }
  wallClock(g, cx, cy, 9, 20 + 59 / 60);
  line(g, cx - 5, cy - 6, cx - 2, cy - 3, PAL.white);                       // reflejo del cristal
  kit.cantoVivo(g, cx - 11, cy - 11, 22, 22);
}

function drawFotos(g) {
  // galería de ex-jefes de cierre (ninguno es director): cuatro retratos en blanco y negro, todos con bigote
  const bx = 198, by = 27, bw = 42, bh = 26;
  dropShadow(g, bx, by, bw, bh, 2, 2, 0.55);
  rect(g, bx, by, bw, bh, PAL.wood[2]); hline(g, bx, by, bw, PAL.wood[6]); vline(g, bx, by, bh, PAL.wood[4]); hline(g, bx, by + bh - 1, bw, PAL.wood[0]); vline(g, bx + bw - 1, by, bh, PAL.wood[0]);
  rect(g, bx + 1, by + 1, bw - 2, bh - 2, PAL.wood[1]);
  const mood = [PAL.metal[5], PAL.metal[6], PAL.metal[4], PAL.metal[5]];
  const hairs = [PAL.ink[1], PAL.metal[1], PAL.ink[2], PAL.metal[2]];
  for (let i = 0; i < 4; i++) {
    const x = bx + 2 + i * 10, y = by + 2;
    rect(g, x, y, 9, 13, PAL.paper[6]); frameRect(g, x, y, 9, 13, PAL.wood[5]);
    gradV(g, x + 1, y + 1, 7, 11, [mood[i], PAL.metal[3]]);
    ellipse(g, x + 4.5, y + 5, 2.2, 2.8, PAL.metal[7]);
    hline(g, x + 2, y + 2, 5, hairs[i]); if (i === 1) hline(g, x + 2, y + 3, 5, hairs[i]);
    px(g, x + 3, y + 5, PAL.ink[0]); px(g, x + 6, y + 5, PAL.ink[0]);
    hline(g, x + 2, y + 7, 5, PAL.ink[0]); if (i % 2) { px(g, x + 2, y + 8, PAL.ink[0]); px(g, x + 6, y + 8, PAL.ink[0]); }   // BIGOTE
    rect(g, x + 1, y + 9, 7, 3, PAL.ink[2]); px(g, x + 4, y + 9, PAL.paper[6]);
  }
  // placa de latón
  bevel(g, bx + 3, by + 18, bw - 6, 7, PAL.gold[3], PAL.gold[5], PAL.gold[1]);
  kit.micro(g, 'EX-JEFES', bx + (bw >> 1), by + 19, PAL.gold[0], { align: 'center' });
  kit.cantoVivo(g, bx, by, bw, bh);
}

function drawFaxEnmarcado(g) {
  const fx = 220, fy = 55;
  dropShadow(g, fx, fy, 18, 24, 2, 2, 0.55);
  rect(g, fx, fy, 18, 24, PAL.wood[2]); hline(g, fx, fy, 18, PAL.wood[6]); vline(g, fx, fy, 24, PAL.wood[5]); hline(g, fx, fy + 23, 18, PAL.wood[0]); vline(g, fx + 17, fy, 24, PAL.wood[0]);
  gradV(g, fx + 2, fy + 2, 14, 20, ['#e8e0c4', '#cfc6a2']);
  hline(g, fx + 3, fy + 3, 12, PAL.ink[3]); hline(g, fx + 3, fy + 5, 8, PAL.metal[4]);
  kit.micro(g, '?', fx + 9, fy + 8, PAL.ink[1], { align: 'center' });
  greek(g, fx + 3, fy + 14, 12, 2, PAL.metal[3], 5);
  line(g, fx + 3, fy + 19, fx + 7, fy + 18, PAL.blue[3]); line(g, fx + 7, fy + 18, fx + 11, fy + 20, PAL.blue[3]); line(g, fx + 11, fy + 20, fx + 14, fy + 18, PAL.blue[3]);
  for (let y = fy + 3; y < fy + 20; y += 3) px(g, fx + 2, y, '#b8ae88');
  px(g, fx + 15, fy + 2, PAL.white); px(g, fx + 14, fy + 3, PAL.white);
  kit.cantoVivo(g, fx, fy, 18, 24);
}

function drawCajonera(g) {
  const x = 172, y = 64, w = 42, h = 35;
  shadowEllipse(g, x + w / 2, y + h, w / 2 + 4, 3, 0.7);
  dropShadow(g, x, y, w, h, 3, 1, 0.4);
  rect(g, x, y, w, h, PAL.wood[1]);
  gradV(g, x + 1, y + 1, w - 2, h - 2, [PAL.wood[3], PAL.wood[2], PAL.wood[2]]);
  hline(g, x, y, w, PAL.wood[6]); vline(g, x, y, h, PAL.wood[4]); vline(g, x + w - 1, y, h, PAL.wood[0]);
  rect(g, x - 1, y - 2, w + 2, 3, PAL.wood[3]); hline(g, x - 1, y - 2, w + 2, PAL.wood[6]);
  const cols = 5, rows = 5, cw = (w - 4) / cols, ch = (h - 6) / rows;
  const r = rng(61);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const cx = Math.round(x + 2 + i * cw), cy = Math.round(y + 3 + j * ch);
    bevel(g, cx, cy, Math.round(cw) - 1, Math.round(ch) - 1, PAL.wood[4], PAL.wood[5], PAL.wood[1]);
    hline(g, cx + 2, cy + 3, Math.round(cw) - 5, PAL.gold[4]); px(g, cx + 2, cy + 3, PAL.gold[6]);
    rect(g, cx + 2, cy + 1, 3, 1, PAL.paper[5]);
    if (r() < 0.1) rect(g, cx + 1, cy + 4, Math.round(cw) - 3, 1, PAL.ink[0]);
  }
  // sobre la cajonera: componedor con tipos y una lata de tinta
  rect(g, x + 4, y - 7, 10, 5, PAL.metal[3]); hline(g, x + 4, y - 7, 10, PAL.metal[6]); hline(g, x + 4, y - 3, 10, PAL.ink[1]);
  for (let i = 0; i < 7; i++) vline(g, x + 5 + i, y - 6, 3, i % 2 ? PAL.metal[5] : PAL.metal[7]);
  rect(g, x + 27, y - 8, 6, 6, PAL.teal[3]); hline(g, x + 27, y - 8, 6, PAL.teal[6]); hline(g, x + 27, y - 5, 6, PAL.paper[4]);
}

/** La mesa de Teodoro (objeto ordenado por z: tapa las rodillas de Teodoro, sentado de perfil a su izquierda). */
function drawTeodoroDesk(g) {
  const x = 100, y = DESK_Y, w = 68;
  desk(g, x, y, w, 19, { ramp: OLDW, depth: 7, drawers: true, kneeHole: false, drawersBoth: true });
  // tapete verde y marcas de lectura
  poly(g, [[x + 6, y + 1], [x + w - 6, y + 1], [x + w - 4, y + 5], [x + 4, y + 5]], PAL.green[2]); hline(g, x + 6, y + 1, w - 12, PAL.green[4]);
  px(g, x + 12, y + 3, PAL.ink[0]); px(g, x + 47, y + 3, PAL.ink[0]);
  papers(g, x + 52, y + 2, 12, { n: 2, seed: 4 });
}
/** Lo que hay sobre y tras la mesa de Teodoro y no es interactivo (fondo): lámpara de banquero, cenicero-lapicero y el cartelito
 *  «LÍNEA DIRECTA · ROTATIVA» clavado en la pared encima del teléfono (se lee desde la primera vez). */
function drawTeodoroProps(g) {
  const x = 100, y = DESK_Y;
  rect(g, x + 49, y - 2, 8, 3, PAL.metal[2]); hline(g, x + 49, y - 2, 8, PAL.metal[5]);
  vline(g, x + 53, y - 14, 12, PAL.gold[3]); px(g, x + 52, y - 13, PAL.gold[6]);
  poly(g, [[x + 47, y - 13], [x + 60, y - 13], [x + 58, y - 18], [x + 49, y - 18]], PAL.green[3]); hline(g, x + 49, y - 18, 9, PAL.green[6]); hline(g, x + 47, y - 13, 13, PAL.green[1]);
  hline(g, x + 48, y - 12, 11, PAL.gold[5]); ditherOverlay(g, x + 46, y - 11, 15, 3, PAL.gold[6], 0.5);
  glow(g, x + 53, y + 2, 20, 8, PAL.gold[5], 0.16, 4);
  const ax = x + 61; rect(g, ax, y - 4, 5, 6, PAL.teal[3]); hline(g, ax, y - 4, 5, PAL.teal[6]); vline(g, ax, y - 4, 6, PAL.teal[5]); hline(g, ax, y + 1, 5, PAL.teal[1]);
  for (const [dx, hh, c] of [[1, 6, PAL.red[4]], [2, 9, PAL.gold[4]], [3, 7, PAL.blue[4]], [4, 5, PAL.paper[5]]]) { vline(g, ax + dx, y - 4 - hh, hh, c); px(g, ax + dx, y - 4 - hh, PAL.ink[0]); }
  const cx = 121, cy = 56;
  dropShadow(g, cx, cy, 35, 12, 1, 1, 0.5);
  rect(g, cx, cy, 35, 12, PAL.paper[6]); hline(g, cx, cy, 35, PAL.paper[7]); hline(g, cx, cy + 11, 35, PAL.paper[3]);
  rect(g, cx, cy, 35, 3, PAL.red[3]);
  kit.micro(g, 'ROTATIVA', cx + 17, cy + 5, PAL.red[2], { align: 'center' });
  pin(g, cx + 2, cy + 2, PAL.gold[5]); pin(g, cx + 32, cy + 2, PAL.gold[5]);
  for (let yy = cy + 12; yy < 80; yy++) px(g, 148 + ((yy & 1) ? 1 : 0), yy, PAL.ink[1]);    // el cable rizado baja de la pared al teléfono
}

function drawAuroraDesk(g) {
  // mesa de Aurora: tablero, travesaño, pata derecha y, a la izquierda, NINGUNA pata: la sostienen el Libro de Estilo y
  // la tableta de Desarrollo (son objetos: se pintan aparte)
  const x = 246, y = 82, w = 52;
  shadowEllipse(g, x + w / 2 + 2, 99, w / 2 + 6, 3, 0.7);
  poly(g, [[x + 3, y], [x + w - 3, y], [x + w, y + 6], [x, y + 6]], (xx, yy) => ditherPick(xx, yy, [PAL.wood[5], PAL.wood[6]], 0.3 + (yy - y) / 6 * 0.6));
  rect(g, x, y + 6, w, 3, PAL.wood[3]); hline(g, x, y + 6, w, PAL.wood[7]); hline(g, x, y + 8, w, PAL.wood[1]);
  rect(g, x + 4, y + 9, w - 8, 3, PAL.wood[2]);
  rect(g, x + w - 6, y + 9, 4, 9, PAL.wood[2]); vline(g, x + w - 6, y + 9, 9, PAL.wood[4]); hline(g, x + w - 6, y + 17, 4, PAL.ink[1]);
  // papeles con correcciones y la taza
  poly(g, [[x + 6, y + 1], [x + 40, y + 1], [x + 42, y + 5], [x + 4, y + 5]], PAL.paper[4]); hline(g, x + 6, y + 1, 34, PAL.paper[6]);
  for (let i = 0; i < 9; i++) px(g, x + 6 + i * 4, y + 3 + (i & 1), i % 3 ? PAL.red[4] : PAL.blue[3]);
  mug(g, x + 3, y + 3, { color: PAL.paper, logo: PAL.red[4] });
  // el boli muerto, tumbado: descolorido
  line(g, x + 37, y + 5, x + 49, y + 4, '#7a4638'); line(g, x + 37, y + 6, x + 49, y + 5, '#5a2c24');
  px(g, x + 49, y + 4, PAL.ink[0]); px(g, x + 37, y + 4, '#a07a6a'); px(g, x + 44, y + 3, PAL.paper[3]);
}
/** Bote con bolis rojos, a la derecha de la mesa de Aurora (objeto bolis_aurora). */
function drawBolis(g) {
  const bx = 286;
  rect(g, bx, 72, 9, 10, PAL.metal[3]); vline(g, bx, 72, 10, PAL.metal[6]); vline(g, bx + 8, 72, 10, PAL.metal[1]); hline(g, bx, 72, 9, PAL.metal[7]); hline(g, bx, 81, 9, PAL.ink[1]);
  rect(g, bx + 1, 75, 7, 3, PAL.red[3]); hline(g, bx + 1, 75, 7, PAL.red[5]);
  for (const [dx, dy, c] of [[0, -10, PAL.red[4]], [2, -12, PAL.red[5]], [4, -9, PAL.red[4]], [6, -11, PAL.red[3]], [8, -8, PAL.red[5]]]) {
    line(g, bx + 1 + (dx >> 1), 72, bx + dx, 72 + dy, c); px(g, bx + dx, 72 + dy - 1, PAL.ink[0]);
  }
  kit.cantoVivo(g, bx - 1, 62, 11, 20);
}

/** Libro de Estilo: 900 páginas calzando la pata de la mesa de Aurora (28×10). */
function drawLibroEstilo(g) {
  const x = 244, y = 89, w = 28, h = 11;
  shadowEllipse(g, x + w / 2, y + h, w / 2 + 3, 2, 0.6);
  gradV(g, x, y, w, h - 3, [PAL.red[4], PAL.red[3], PAL.red[2]]);
  hline(g, x, y, w, PAL.red[6]); vline(g, x, y, h - 3, PAL.red[5]); vline(g, x + w - 1, y, h - 3, PAL.red[1]);
  for (const bx of [x + 4, x + 8, x + w - 9, x + w - 5]) { vline(g, bx, y + 1, h - 5, PAL.gold[4]); vline(g, bx + 1, y + 1, h - 5, PAL.gold[2]); }
  rect(g, x + 11, y + 1, 6, 4, PAL.gold[4]); frameRect(g, x + 11, y + 1, 6, 4, PAL.gold[2]);
  rect(g, x + 1, y + h - 3, w - 2, 3, PAL.paper[6]);
  for (let i = 0; i < w - 2; i += 2) px(g, x + 1 + i, y + h - 2, PAL.paper[4]);
  hline(g, x, y + h - 3, w, PAL.red[1]); hline(g, x + 1, y + h, w - 2, PAL.paper[2]);
  rect(g, x + 22, y - 2, 2, 3, PAL.gold[5]); rect(g, x + 4, y - 1, 3, 2, PAL.gold[5]);
  // la pata de la mesa descansa encima
  rect(g, x + 4, y - 3, 4, 3, PAL.wood[2]); vline(g, x + 4, y - 3, 3, PAL.wood[4]);
  kit.cantoVivo(g, x, y, w, h);
}

/** La «tableta» (CORRECTOR IA, Desarrollo): de pie bajo la mesa de Aurora, haciendo de segunda pata (14×12). */
function drawCorrector(g) {
  const x = 275, y = 88, w = 14, h = 12;
  shadowEllipse(g, x + w / 2, y + h, w / 2 + 2, 1.5, 0.6);
  rect(g, x, y, w, h, PAL.ink[0]); frameRect(g, x, y, w, h, PAL.metal[3]);
  rect(g, x + 1, y + 1, w - 2, h - 3, '#101c34');
  gradV(g, x + 1, y + 1, w - 2, h - 3, [PAL.blue[4], PAL.blue[2]]);
  kit.micro(g, 'IA', x + (w >> 1), y + 2, PAL.paper[7], { align: 'center' });
  line(g, x + 2, y + 8, x + 11, y + 8, PAL.red[5]);              // un «detrás mío» tachado
  px(g, x + (w >> 1), y + h - 1, PAL.metal[5]);
  glow(g, x + (w >> 1), y + 5, 10, 6, PAL.blue[6], 0.2, 3);
  rect(g, x - 1, y - 3, w + 2, 3, PAL.wood[2]);                   // el tablero que se apoya en ella
  kit.cantoVivo(g, x, y, w, h);
}

function drawCartelAurora(g) {
  const x = 248, y = 41;
  dropShadow(g, x, y, 49, 29, 2, 2, 0.5);
  poly(g, [[x, y + 1], [x + 49, y], [x + 50, y + 28], [x + 1, y + 29]], '#e6d070');
  gradV(g, x, y, 50, 29, ['#ead679', '#d8c15c']);
  hline(g, x, y, 49, '#f3e69a'); vline(g, x, y, 29, '#f3e69a'); hline(g, x + 1, y + 29, 49, '#a58f3a');
  pin(g, x + 3, y + 3); pin(g, x + 46, y + 2, PAL.blue[4]);
  cap(g, 'NO HABLO', x + 24, y + 3, PAL.red[2], { align: 'center' });
  cap(g, 'ANTES DEL', x + 24, y + 12, PAL.red[2], { align: 'center' });
  cap(g, 'CAFÉ.', x + 22, y + 22, PAL.red[2], { align: 'center' });
  ellipse(g, x + 40, y + 24, 3, 2, '#bd9a3a'); ellipse(g, x + 40, y + 24, 2, 1, '#d8c15c');
}

function drawArchivo(g) {
  bookshelf(g, 301, 38, 18, 60, { ramp: OLDW, seed: 31, shelves: 5 });
  for (let sy = 40; sy < 94; sy += 12) hline(g, 302, sy + 9, 16, PAL.gold[3]);
  ditherOverlay(g, 301, 38, 18, 60, PAL.shadow, 0.25);
}

function drawCamastro(g) {
  const x = 42, y = 50;
  rect(g, x, y, 36, 47, PAL.ink[1]);
  paint(g, x + 1, y + 1, 34, 46, (xx, yy) => ditherPick(xx, yy, [TOB[0], TOB[1], TOB[2]], 0.15 + (yy - y) / 47 * 0.3));
  rect(g, x + 28, y + 6, 4, 9, PAL.ink[2]); poly(g, [[x + 28, y + 15], [x + 32, y + 15], [x + 34, y + 22], [x + 26, y + 22]], '#3a4650');
  line(g, 50, 84, 48, 92, PAL.metal[2]); line(g, 70, 84, 72, 92, PAL.metal[2]); line(g, 50, 92, 70, 84, PAL.metal[2]);
  rect(g, 46, 80, 28, 5, PAL.metal[3]); hline(g, 46, 80, 28, PAL.metal[5]);
  poly(g, [[48, 73], [74, 73], [76, 82], [46, 82]], PAL.red[2]);
  paint(g, 46, 73, 31, 10, (xx, yy) => ((xx >> 2) + (yy >> 1)) % 2 === 0 ? ((xx >> 2) % 2 ? PAL.red[3] : PAL.red[1]) : null);
  for (let i = 0; i < 6; i++) vline(g, 49 + i * 5, 74, 8, PAL.paper[4]);
  hline(g, 47, 78, 29, PAL.paper[4]);
  hline(g, 48, 73, 26, PAL.red[5]); hline(g, 46, 82, 30, PAL.red[0]);
  rect(g, 49, 70, 11, 5, PAL.paper[5]); hline(g, 49, 70, 11, PAL.paper[7]); hline(g, 49, 74, 11, PAL.paper[2]); greek(g, 51, 72, 6, 1, PAL.paper[3], 4);
  rect(g, 54, 91, 6, 3, PAL.ink[2]); rect(g, 62, 91, 6, 3, PAL.ink[2]); hline(g, 54, 91, 6, PAL.metal[3]);
  rect(g, 73, 83, 2, 6, PAL.paper[5]); px(g, 73, 88, PAL.paper[3]);
  shadowEllipse(g, 60, 96, 18, 3, 0.7);
  // cortina entreabierta
  rect(g, 39, 48, 42, 2, PAL.wood[1]); hline(g, 39, 48, 42, PAL.wood[5]);
  const cur = [PAL.purple[1], PAL.purple[2], PAL.purple[3], PAL.purple[4], PAL.purple[5]];
  fabric(g, 40, 50, 10, 45, cur, { fold: 4, phase: 1 });
  poly(g, [[69, 50], [79, 50], [81, 95], [66, 95]], (xx, yy) => ditherPick(xx, yy, cur, 0.15 + Math.abs(Math.sin(xx * 0.9)) * 0.7));
  hline(g, 40, 95, 10, PAL.ink[0]); hline(g, 66, 95, 15, PAL.ink[0]);
  for (let i = 0; i < 6; i++) px(g, 41 + i * 4, 49, PAL.metal[6]);
  for (let i = 0; i < 5; i++) px(g, 68 + i * 3, 49, PAL.metal[6]);
  line(g, 40, 80, 50, 83, PAL.gold[4]); rect(g, 50, 82, 2, 2, PAL.gold[5]);
  ditherOverlay(g, 50, 52, 6, 40, PAL.shadow, 0.3);
}

function drawRug(g) {
  // alfombra raída bajo la mesa de Teodoro (zona 1), con su canto de flecos
  const quad = [[54, 108], [166, 108], [172, 138], [44, 138]];
  poly(g, quad, (x, y) => {
    const v = hash2(x >> 1, y, 3);
    return v < 0.1 ? PAL.red[0] : ditherPick(x, y, [PAL.red[1], PAL.red[2]], 0.4 + hash2(x, y >> 1, 8) * 0.3);
  });
  const [a, b, c, d] = quad;
  const ins = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const tl = ins(a, c, 0.07), tr = ins(b, d, 0.07), br = ins(c, a, 0.07), bl = ins(d, b, 0.07);
  for (const [p, q] of [[tl, tr], [tr, br], [br, bl], [bl, tl]]) line(g, Math.round(p[0]), Math.round(p[1]), Math.round(q[0]), Math.round(q[1]), PAL.gold[2]);
  ellipse(g, 108, 123, 22, 6, (x, y, dd) => dd > 0.8 ? PAL.gold[2] : dd > 0.5 ? PAL.red[3] : PAL.red[1]);
  for (let i = 0; i < 16; i++) px(g, 46 + i * 7, 138 + (i & 1), PAL.paper[3]);
  ditherOverlay(g, 54, 108, 112, 6, PAL.shadow, 0.35);
}

function drawChair(g) {
  // la silla de Teodoro, de madera vieja, tras su espalda (él se sienta de perfil, mirando al fax)
  const x = 83, y = 80;
  shadowEllipse(g, x + 5, 101, 8, 2, 0.6);
  rect(g, x, y, 4, 18, PAL.wood[3]); vline(g, x, y, 18, PAL.wood[5]); vline(g, x + 3, y, 18, PAL.wood[1]);
  for (let k = 0; k < 3; k++) rect(g, x + 4, y + 1 + k * 5, 2, 3, PAL.wood[2]);
  rect(g, x, y + 18, 14, 3, PAL.wood[3]); hline(g, x, y + 18, 14, PAL.wood[6]);
  rect(g, x + 1, y + 21, 2, 7, PAL.wood[2]); rect(g, x + 11, y + 21, 2, 7, PAL.wood[2]);
}

function drawFloorProps(g) {
  newspaperStack(g, 289, 100, 15, 7); newspaperStack(g, 301, 100, 13, 4);
  for (const [x, y] of [[124, 118], [196, 123], [60, 130], [262, 132], [150, 136]]) { poly(g, [[x, y], [x + 6, y - 1], [x + 7, y + 2], [x + 1, y + 3]], PAL.paper[5]); hline(g, x + 1, y + 1, 4, PAL.paper[3]); }
  trashBin(g, 70, 102, { w: 11, h: 12 });
}

function drawLight(g) {
  for (const [bx, by] of [[92, 24], [142, 22], [252, 22], [292, 22]]) {
    vline(g, bx, 14, by - 14, PAL.ink[0]);
    rect(g, bx - 1, by, 3, 3, PAL.metal[3]);
    ellipse(g, bx, by + 6, 3, 4, PAL.gold[6]); px(g, bx - 1, by + 5, PAL.white);
    glow(g, bx, by + 8, 44, 26, PAL.gold[5], 0.12, 5);
    glow(g, bx, by + 8, 20, 12, PAL.light, 0.12, 3);
  }
  glow(g, 134, 86, 50, 14, PAL.gold[5], 0.10, 4);
  glow(g, 272, 80, 38, 12, PAL.gold[5], 0.10, 4);
  lightCone(g, 156, 76, 6, 22, 14, PAL.gold[5], 0.12);
}

// primer plano: dos bobinas de papel prensa en el rincón de la puerta (nadie queda tras ellas)
function foreground(g) {
  const reel = (cx, base, rx, h) => {
    shadowEllipse(g, cx, base + 1, rx + 3, 2, 0.7);
    rect(g, cx - rx, base - h, rx * 2, h, PAL.paper[6]);
    paint(g, cx - rx, base - h, rx * 2, h, (xx, yy) => ditherPick(xx, yy, [PAL.paper[3], PAL.paper[5], PAL.paper[7]], 0.9 - (xx - (cx - rx)) / (rx * 2) * 0.9));
    for (let yy = base - h + 3; yy < base - 1; yy += 4) hline(g, cx - rx, yy, rx * 2, PAL.paper[2]);
    ellipse(g, cx, base, rx, 2, PAL.paper[4]); ellipse(g, cx, base - h, rx, 2, PAL.paper[7]);
    ellipse(g, cx, base - h, 3, 1, PAL.wood[3]); px(g, cx, base - h, PAL.wood[1]);
    vline(g, cx - rx, base - h, h, PAL.paper[7]); vline(g, cx + rx - 1, base - h, h, PAL.paper[1]);
    rect(g, cx - rx, base - 7, rx * 2, 2, PAL.red[3]);                      // la goma de embalaje
  };
  reel(11, 141, 9, 21);
  reel(22, 135, 6, 13);
}

export default {
  room: 'catacumba',
  width: 320,
  rediseno: true,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  // suelo con forma: la mesa de Teodoro (frente hasta y 110) y las bobinas del rincón quedan fuera del suelo
  walkboxes: [
    { id: 'izq', poly: [[8, 104], [100, 104], [100, 142], [30, 142], [30, 116], [8, 116]] },
    { id: 'centro', poly: [[98, 111], [312, 111], [318, 142], [98, 142]] },
    { id: 'fondo_der', poly: [[168, 104], [312, 104], [312, 112], [168, 112]] },
  ],
  entries: { pecera: [32, 116, 'right'] },
  layout,
  draw(g) {
    drawCeiling(g);
    drawWall(g);
    drawFloor(g);
    drawDoor(g);
    drawGaleradas(g);
    drawTalleres(g);                 // delante de las galeradas: cuelga del mismo cordel
    drawCamastro(g);
    drawChair(g);
    drawReloj(g);
    drawFotos(g);
    drawFaxEnmarcado(g);
    drawCajonera(g);
    drawArchivo(g);
    kit.pilastra(g, 80, 15, FL); kit.pilastra(g, 169, 15, FL); kit.pilastra(g, 239, 15, FL);
    kit.rotuloZona(g, 205, 10, 'papel');
    drawTeodoroProps(g);
    drawAuroraDesk(g);
    drawCartelAurora(g);
    drawBolis(g);
    drawLibroEstilo(g);
    drawCorrector(g);
    drawFloorProps(g);
    drawLight(g);
    vignette(g, W, 144, 0.55);
  },
  foreground(g) { foreground(g); },
  animate(g, view, t) {
    const f = (Math.sin(t / 380) + Math.sin(t / 137) * 0.6) * 0.5;
    if (f > 0.55) glow(g, 122, 30, 30, 18, PAL.light, 0.08, 3);
    for (let i = 0; i < 4; i++) { const ph = ((t / 700) + i * 0.25) % 1; px(g, 130 + Math.round(Math.sin(ph * 6 + i) * 2), 80 - Math.floor(ph * 14), PAL.paper[5]); }
  },
  overlay(g, view, t) {
    for (let i = 0; i < 14; i++) {
      const x = (hash2(i, 1, 4) * 320 + Math.sin(t / 2000 + i) * 6 + t * 0.002) % 320;
      const y = 20 + (hash2(i, 2, 4) * 76 + t * 0.004 * (1 + (i % 3))) % 76;
      px(g, Math.floor(x), Math.floor(y), (i & 1) ? PAL.gold[6] : PAL.paper[6]);
    }
  },
};
