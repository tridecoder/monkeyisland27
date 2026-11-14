// SALA `ecosistema` — Marketing y Comercial (planta 2, «el Ecosistema»). Arte y geometría. Rediseño P4 (docs/GUIA_REDISENO.md
// §3, §7; propuesta §4.7). Biblia §3.7 + adenda §3.7, §8bis y §13.4. 432 px con scroll, cinco zonas de izquierda a derecha
// (content/lib/edificio.js ECOSISTEMA_ZONAS), cada una con suelo, filete, pilastra y (los departamentos) rótulo colgado:
//   NÚCLEO 0-96 ........... el kit del edificio (kit.nucleo, FL = 94): escalera que BAJA «1 REDACCIÓN ▼» y ascensor «2».
//                           Marketing le ha puesto los PUFS delante al ascensor (gag A§14.2), sin tapar la botonera.
//   MARKETING 96-190 ...... moqueta lila gruesa, Memphis: el embudo «VEN · MIRA · COMPARTE · ?», la pizarra SINERGIA sobre
//                           la mesa vacía de Tadeo (con su portátil, que nunca se cierra) y el aro de luz de Borja (E2: Borja ya no está;
//                           su móvil, en el aro, publica solo).
//   puerta de EVENTOS 190-242 doble hoja ciruela con ojos de buey por los que se escapan los focos, piloto «5 MIN»,
//                           placa «2 EVENTOS» (en la fila de placas y rótulos, y 2) y umbral granate.
//   COMERCIAL 242-384 ..... roll-up «SU ANUNCIO AQUÍ» (desplegado / enrollado), termómetro de ventas al 97 %, el lema
//                           ENTERO en 4 líneas, la mesa de Maripaz con el monitor de Comercial (E2 §4.4).
//   PASILLO 384-432 ....... boca de 46 px (dibujada en coordenadas de 400 px, `corrido` +32) en perspectiva hacia Administración (ventanilla al fondo, placa
//                           «2 ADMINISTRACIÓN ►»), con la impresora de la tercera ENTERA dentro y, en el suelo delante
//                           de su bandeja, la piel de plátano de la plaza 7.
// Paleta: lila y fucsia (Marketing), ciruela y granate (Eventos), naranja melocotón (Comercial), verde oliva (pasillo).
import { PAL, px, rect, hline, vline, frameRect, line, poly, ellipse, paint, ditherPick, ditherOverlay, glow, gradV,
  rng, hash2, shade, shadowEllipse, bevel, vignette, mug, label } from '../../../engine/draw.js';
import * as kit from '../../lib/kit.js';
import { drawText } from '../../../engine/font.js';
import { nucleoGeom } from '../../lib/edificio.js';

const W = 432, FL = 94;
const PX = 32;                       // el pasillo (y la impresora) se corren 32 px: Comercial ganó pared para que las placas respiren
/** pinta `fn` corrido PX px a la derecha (el pasillo está dibujado en las coordenadas de la sala de 400 px) */
const corrido = (fn) => (g, ...a) => { g.save(); g.translate(PX, 0); try { return fn(g, ...a); } finally { g.restore(); } };
const N = nucleoGeom('ecosistema', FL);
const LIL = ['#5a3c6c', '#6c4a80', '#7e5894', '#9268a8', '#a67cbc', '#bc94d0'];      // pared de Marketing
const PLUM = ['#24142e', '#33203f', '#432a52', '#563666'];                             // pared de la puerta de Eventos
const PEACH = ['#7a4a3a', '#8e5a46', '#a26a52', '#b67c60', '#c68e70'];               // pared de Comercial
const OLIVA = ['#2e3a2c', '#3a4a36', '#4a5c42', '#5c704e'];                           // pasillo de Administración
const CORAL = [PAL.dusk[3], PAL.dusk[4], PAL.dusk[5], PAL.dusk[6]];
const LEMA = 'TODO ES UNA OPORTUNIDAD SI TIENE UN MÓDULO AL LADO';
const PUERTA_EV = { x: 199, y: 38, w: 34, h: FL - 38 };       // hueco de la doble hoja de Eventos

const layout = {
  // núcleo (geometría común del edificio)
  ecosistema_a_pecera: { rect: N.escaleras.baja.rect, walkTo: N.escaleras.baja.walkTo, face: N.escaleras.baja.face },
  ascensor_ecosistema: { rect: N.ascensor.rect, walkTo: N.ascensor.walkTo, face: 'up' },
  pufs: { rect: [52, 91, 38, 14], walkTo: [72, 116], face: 'up' },
  // Marketing
  embudo_marketing: { rect: [100, 32, 36, 42], walkTo: [130, 116], face: 'up' },
  pizarra_sinergia: { rect: [140, 30, 46, 30], walkTo: [162, 112], face: 'up' },
  portatil_tadeo: { rect: [148, 60, 28, 18], walkTo: [162, 112], face: 'up', priority: 1, draw: drawPortatil },
  // la puerta de Eventos
  ecosistema_a_eventos: { rect: [194, 24, 44, 74], walkTo: [216, 108], face: 'up' },
  // Comercial
  rollup_comercial: { rect: [244, 32, 20, 64], walkTo: [254, 112], face: 'up', cache: true,
    sprites: { desplegado: (g) => drawRollup(g, false), enrollado: (g) => drawRollup(g, true), default: (g) => drawRollup(g, false) } },
  termometro_ventas: { rect: [267, 30, 22, 52], walkTo: [278, 112], face: 'up' },
  lema_enmarcado: { rect: [290, 18, 62, 33], walkTo: [318, 114], face: 'up' },
  // la piel de plátano, en el suelo JUSTO delante de la bandeja de la impresora (donde se para quien recoge un folio);
  // Bruno la mira desde su izquierda, sin tapar a Maripaz ni la impresora
  piel_platano: { rect: [377, 100, 19, 10], walkTo: [366, 112], face: 'right', priority: 2, draw: drawPlatano },
  // el pasillo a Administración, con la impresora dentro (la impresora, a la izquierda de la boca; la salida, el resto)
  impresora_tercera: { rect: [354 + PX, 56, 20, 40], walkTo: [366 + PX, 108], face: 'up', priority: 1, draw: (g, v, t) => corrido(drawImpresora)(g, v, t) },
  ecosistema_a_administracion: { rect: [370 + PX, 20, 28, 80], walkTo: [384 + PX, 108], face: 'right' },
  // [P4] E2 §3.2: el aro de luz de Borja (Borja ya no está): trípode con ruedas delante del embudo, móvil en el centro
  aro_borja: { rect: [107, 62, 24, 48], walkTo: [94, 124], face: 'right', priority: 2, layer: 'sorted', zy: 109, draw: drawAro },
  // [P4] E2 §4.4: el monitor de Comercial, sobre la mesa de Maripaz (la portada de la web como la ve Comercial)
  pantalla_comercial: { rect: [291, 56, 28, 23], walkTo: [302, 114], face: 'up', priority: 1, draw: drawPantallaComercial },
  // PNJ (guía §10): Maripaz de pie junto a su mesa, con el lema detrás
  maripaz_remitido: { at: [328, 104, 'left'], walkTo: [302, 124], face: 'right' },
};

// ------------------------------------------------------------ objetos dibujados por su hotspot
function drawPlatano(g) {
  // piel de plátano de 16×8, amarillo saturado, con canto vivo (y su pósit «PLAZA 7»)
  const x = 378, y = 101;
  shadowEllipse(g, x + 8, y + 7, 9, 2, 0.6);
  poly(g, [[x + 1, y + 4], [x + 8, y + 1], [x + 15, y + 4], [x + 9, y + 7], [x + 4, y + 7]], '#ffd21e');
  poly(g, [[x + 6, y + 4], [x + 11, y + 6], [x + 15, y + 8], [x + 9, y + 8]], '#e8b010');
  line(g, x + 1, y + 3, x - 2, y + 6, '#ffd21e'); line(g, x + 15, y + 3, x + 17, y + 7, '#e8b010');
  hline(g, x + 4, y + 3, 6, '#fff07a'); px(g, x + 8, y + 1, PAL.wood[2]); px(g, x + 8, y, PAL.wood[1]);
  rect(g, x + 11, y - 1, 5, 4, PAL.paper[7]); kit.micro(g, '7', x + 12, y - 1, PAL.red[3], { registrar: false });
  kit.cantoVivo(g, x, y, 16, 8);
}
/** [P4] E2 §3.2 · el aro de luz de Borja, solo: trípode con ruedas, el anillo encendido y el móvil en el centro con la
 *  pantalla viva; encima, el piloto «DIRECTO» que parpadea (2 frames). Borja se fue a las seis; el móvil, no. */
function drawAro(g, view, t) {
  const cx = 119, cy = 76;
  const on = Math.floor((t || 0) / 520) % 2 === 0;
  // trípode con ruedas
  shadowEllipse(g, cx, 110, 12, 2, 0.6);
  vline(g, cx, cy + 9, 20, PAL.metal[4]); vline(g, cx + 1, cy + 9, 20, PAL.metal[2]);
  line(g, cx, cy + 27, cx - 9, 108, PAL.metal[4]); line(g, cx + 1, cy + 27, cx + 10, 108, PAL.metal[3]); line(g, cx, cy + 27, cx + 1, 109, PAL.metal[5]);
  for (const wx of [cx - 9, cx + 10, cx + 1]) { rect(g, wx - 1, 108, 3, 2, PAL.ink[1]); px(g, wx, 108, PAL.metal[3]); }
  // el halo y el anillo (hueco por dentro: se ve el embudo detrás)
  glow(g, cx, cy, 16, 14, '#fff6d8', 0.16, 4);
  for (let dy = -10; dy <= 10; dy++) for (let dx = -10; dx <= 10; dx++) {
    const d = Math.hypot(dx, dy * 1.05);
    if (d >= 6.6 && d <= 9.4) px(g, cx + dx, cy + dy, d < 7.6 ? '#fffbe8' : d < 8.6 ? '#ffe8a8' : '#c8a868');
  }
  // brazo del soporte y el móvil en el centro, con la pantalla encendida (publicando)
  hline(g, cx - 1, cy + 7, 3, PAL.metal[3]);
  rect(g, cx - 2, cy - 4, 5, 9, PAL.ink[0]);
  rect(g, cx - 1, cy - 3, 3, 7, on ? '#4FD8E8' : '#2a9ab0');
  px(g, cx, cy - 2, PAL.white); hline(g, cx - 1, cy + 1, 3, on ? '#e8fcff' : '#7ad8e8');
  // el piloto «DIRECTO»
  const py = cy - 15;
  rect(g, cx - 15, py, 31, 7, on ? '#d82020' : '#6a1414'); frameRect(g, cx - 15, py, 31, 7, PAL.ink[0]);
  kit.micro(g, 'DIRECTO', cx + 1, py + 1, on ? PAL.white : '#d0a0a0', { align: 'center', registrar: false });
  if (on) glow(g, cx, py + 3, 16, 5, '#ff4040', 0.18, 3);
}
/** [P4] E2 §4.4 · el monitor de Comercial: la portada de la web con cuatro anuncios, un vídeo con su ▶ y una franja
 *  gris finísima (la noticia). Mientras «reproduce» (estado `video`), el vídeo se mueve y suena. */
function drawPantallaComercial(g, view, t) {
  const x = 293, y = 58, w = 23, h = 15;
  const video = String(view.objState ? view.objState('pantalla_comercial') : view.state) === 'video';
  // pie y peana sobre la mesa
  rect(g, x + 9, y + h + 1, 5, 4, PAL.metal[3]); rect(g, x + 6, y + h + 4, 11, 2, PAL.metal[4]);
  rect(g, x - 1, y - 1, w + 2, h + 2, PAL.ink[0]); frameRect(g, x - 1, y - 1, w + 2, h + 2, PAL.metal[3]);
  rect(g, x, y, w, h, '#f4efe0');
  // cuatro anuncios
  rect(g, x + 1, y + 1, 7, 4, '#3a7ac8'); rect(g, x + 15, y + 1, 7, 4, '#2c9a4c');
  rect(g, x + 1, y + 10, 7, 4, '#c83a8a'); rect(g, x + 15, y + 10, 7, 4, '#ffcc33');
  // el vídeo (centro) con su ▶; reproduciéndose, parpadea en colores de colchón
  const vc = video ? (Math.floor((t || 0) / 140) % 2 ? '#2a3c78' : '#5a7ad8') : '#1c2a58';
  rect(g, x + 9, y + 1, 5, 7, vc);
  if (!video) { px(g, x + 11, y + 3, PAL.white); px(g, x + 11, y + 4, PAL.white); px(g, x + 12, y + 4, PAL.white); px(g, x + 11, y + 5, PAL.white); }
  else { px(g, x + 10, y + 3, PAL.white); px(g, x + 12, y + 5, PAL.white); }
  // la noticia: una línea gris de 1 px
  hline(g, x + 9, y + 10, 5, '#a8a49a');
  // el pósit «Se ve demasiado» pegado al marco
  rect(g, x + w - 2, y + 8, 5, 5, '#ffe14a'); hline(g, x + w - 1, y + 10, 3, PAL.ink[3]);
  glow(g, x + w / 2, y + h / 2, 18, 12, video ? '#9fc0ff' : '#fff4e0', video ? 0.2 : 0.1, 3);
}

/** [P4] E2 §4.2.4 · el anuncio antes de entrar (interstitial): un cartel de Colchones Siestatón a toda la caja, con
 *  colchón, luna y zetas. La cuenta atrás («Podrá continuar en 5… 1», «Saltar anuncio ›») la pinta el motor. */
export function interstitialComercial(g, r, t) {
  const { x, y, w, h } = r;
  gradV(g, x, y, w, h, ['#0e1636', '#1c2a58', '#2a3c78']);
  // estrellas y luna
  for (let i = 0; i < 28; i++) px(g, x + Math.floor(hash2(i, 3, 7) * w), y + Math.floor(hash2(i, 5, 7) * (h * 0.55)), i % 3 ? '#8aa0d8' : '#ffffff');
  ellipse(g, x + w - 30, y + 20, 10, 10, '#fff4c0'); ellipse(g, x + w - 26, y + 17, 9, 9, '#1c2a58');
  // la marca, grande
  drawText(g, 'COLCHONES SIESTATÓN', x + (w >> 1), y + 8, '#ffffff', { align: 'center', outline: '#0e1430', scale: 1 });
  drawText(g, 'DUERMA YA', x + (w >> 1), y + 24, '#ffcc33', { align: 'center', outline: '#0e1430', scale: 2 });
  // el colchón con su almohada, y las zetas que suben
  const kx = x + (w >> 1) - 50, ky = y + h - 36;
  rect(g, kx + 2, ky + 14, 100, 4, '#0a0f24');
  rect(g, kx, ky, 100, 14, '#e8ecf8'); frameRect(g, kx, ky, 100, 14, '#9aa8c8');
  for (let i = 1; i < 10; i++) vline(g, kx + i * 10, ky + 2, 10, '#d0d8ee');
  rect(g, kx + 6, ky - 7, 26, 8, '#ffffff'); frameRect(g, kx + 6, ky - 7, 26, 8, '#9aa8c8');
  const z = Math.floor((t || 0) / 450) % 4;
  for (let i = 0; i < z; i++) drawText(g, 'z', kx + 40 + i * 9, ky - 12 - i * 6, '#ffffff', { outline: '#0e1430' });
  // letra pequeña de verdad (la del anuncio, no la de Maripaz)
  kit.micro(g, 'SIESTATÓN: DORMIR TAMBIÉN ES TRABAJAR', x + 4, y + h - 7, '#6a7ab0', { registrar: false });
}

/** [P4] E2 §4.4 · plano detalle de la portada de la web en el monitor de Maripaz (Mirar, 1.ª vez): anuncio, anuncio,
 *  vídeo, UNA línea de noticia, anuncio. 180×90. */
export function portadaComercial(g, r, t) {
  const { x, y, w, h } = r;
  rect(g, x, y, w, h, '#f4efe0');
  rect(g, x, y, w, 9, '#2a2430');
  kit.micro(g, 'PORTADA', x + 4, y + 2, '#f4efe0', { registrar: false });
  rect(g, x + w - 26, y + 2, 22, 5, '#ff7a20'); kit.micro(g, 'OFERTA', x + w - 15, y + 2, '#ffffff', { align: 'center', registrar: false });
  // anuncio, anuncio
  rect(g, x + 3, y + 11, (w >> 1) - 5, 16, '#3a7ac8'); kit.micro(g, 'ANUNCIO', x + 3 + ((w >> 1) - 5) / 2, y + 17, '#ffffff', { align: 'center', registrar: false });
  rect(g, x + (w >> 1) + 2, y + 11, (w >> 1) - 5, 16, '#2c9a4c'); kit.micro(g, 'ANUNCIO', x + (w >> 1) + 2 + ((w >> 1) - 5) / 2, y + 17, '#ffffff', { align: 'center', registrar: false });
  // el vídeo que se pone solo, con su ▶ y el altavoz a tope
  const vx = x + 3, vy = y + 30, vw = w - 6, vh = 30;
  gradV(g, vx, vy, vw, vh, ['#1c2a58', '#2a3c78']);
  poly(g, [[vx + (vw >> 1) - 5, vy + 8], [vx + (vw >> 1) + 7, vy + 15], [vx + (vw >> 1) - 5, vy + 22]], '#ffffff');
  kit.micro(g, 'SIESTATÓN', vx + 4, vy + 3, '#ffcc33', { registrar: false });
  rect(g, vx + vw - 14, vy + vh - 8, 4, 4, '#ffffff'); poly(g, [[vx + vw - 10, vy + vh - 9], [vx + vw - 7, vy + vh - 11], [vx + vw - 7, vy + vh - 1], [vx + vw - 10, vy + vh - 3]], '#ffffff');
  const k = Math.floor((t || 0) / 300) % 3;
  for (let i = 0; i <= k; i++) vline(g, vx + vw - 5 + i * 2, vy + vh - 9 - i, 5 + i * 2, '#ffffff');
  // UNA línea de noticia (gris, 1 px) con su pósit
  const ny = y + 64;
  hline(g, x + 30, ny, w - 70, '#9a968c');
  kit.micro(g, 'NOTICIA', x + 4, ny - 2, '#9a968c', { registrar: false });
  rect(g, x + w - 38, ny - 4, 34, 9, '#ffe14a'); kit.micro(g, 'SE VE', x + w - 21, ny - 2, PAL.ink[2], { align: 'center', registrar: false });
  // otro anuncio
  rect(g, x + 3, y + 70, w - 6, h - 72, '#c83a8a'); kit.micro(g, 'TILAS CALMÍN', x + (w >> 1), y + 74, '#ffffff', { align: 'center', registrar: false });
}

/** Portátil de Tadeo: abierto con notificaciones y un globo que parpadea; cerrado (Acto III) apagado y en silencio. */
function drawPortatil(g, view, t) {
  const x = 148, y = 60;
  if (view.flag('ecosistema_portatil_cerrado')) {
    // cerrado: tapa plateada sin luz, una pegatina «¡VAMOS!» y nada más (por fin)
    poly(g, [[x + 1, y + 13], [x + 27, y + 13], [x + 25, y + 17], [x + 3, y + 17]], PAL.metal[5]);
    rect(g, x + 2, y + 10, 24, 4, PAL.metal[4]); hline(g, x + 2, y + 10, 24, PAL.metal[6]);
    rect(g, x + 11, y + 11, 6, 2, PAL.dusk[5]);
    px(g, x + 24, y + 15, PAL.ink[1]);
    kit.cantoVivo(g, x + 1, y + 10, 26, 7);
    return;
  }
  const f = ((t || 0) % 900) < 450;
  rect(g, x + 2, y + 3, 24, 13, PAL.metal[2]); frameRect(g, x + 2, y + 3, 24, 13, PAL.metal[4]); hline(g, x + 2, y + 3, 24, PAL.metal[6]);
  rect(g, x + 4, y + 5, 20, 9, f ? PAL.blue[7] : PAL.blue[6]);
  for (let i = 0; i < 4; i++) { const yy = y + 6 + i * 2; rect(g, x + 5, yy, 2, 1, i % 2 ? PAL.red[4] : PAL.gold[4]); hline(g, x + 8, yy, 6 + ((i * 5) % 7), PAL.blue[3]); }
  poly(g, [[x, y + 16], [x + 28, y + 16], [x + 26, y + 19], [x + 2, y + 19]], PAL.metal[5]); hline(g, x, y + 16, 28, PAL.metal[7]);
  hline(g, x + 4, y + 18, 20, PAL.metal[3]);
  glow(g, x + 14, y + 10, 16, 10, '#a8c8ff', 0.18, 3);
  // el globo de «RV:» que no para
  const by = f ? y - 2 : y;
  poly(g, [[x + 16, by], [x + 27, by], [x + 27, by + 6], [x + 21, by + 6], [x + 19, by + 9], [x + 19, by + 6], [x + 16, by + 6]], f ? PAL.paper[7] : PAL.red[4]);
  frameRect(g, x + 16, by, 12, 7, PAL.ink[1]);
  kit.micro(g, 'RV', x + 18, by + 1, f ? PAL.red[3] : PAL.paper[7], { registrar: false });
  kit.cantoVivo(g, x + 2, y + 3, 26, 17);
}
/** La impresora de la tercera, ENTERA, dentro del pasillo: piloto rojo de atasco; con el portátil cerrado, reenvía. */
function drawImpresora(g, view, t) {
  const x = 356, y = 58;
  shadowEllipse(g, x + 9, FL + 1, 12, 2, 0.7);
  bevel(g, x, y + 10, 18, 26, PAL.paper[4], PAL.paper[6], PAL.paper[1]);
  rect(g, x - 1, y + 6, 20, 6, PAL.paper[3]); hline(g, x - 1, y + 6, 20, PAL.paper[7]);
  rect(g, x + 2, y + 1, 14, 6, PAL.paper[5]); hline(g, x + 2, y + 1, 14, PAL.white);
  // pantallita: «ATASCO» no cabe; un aviso rojo que parpadea y la bandeja 2 (que no existe) abierta
  rect(g, x + 2, y + 13, 14, 6, PAL.ink[1]);
  const on = ((t || 0) % 1200) < 700;
  rect(g, x + 3, y + 14, 12, 4, on ? PAL.red[3] : PAL.red[1]); kit.micro(g, '2', x + 8, y + 14, PAL.paper[7], { registrar: false });
  for (const [by, c] of [[y + 22, PAL.metal[3]], [y + 28, PAL.metal[2]]]) { rect(g, x + 2, by, 14, 5, c); hline(g, x + 2, by, 14, PAL.metal[5]); rect(g, x + 7, by + 2, 4, 1, PAL.ink[1]); }
  rect(g, x + 1, y + 36, 16, 2, PAL.ink[2]);
  // un folio atascado asomando, arrugado
  poly(g, [[x + 3, y + 20], [x + 15, y + 20], [x + 14, y + 23], [x + 9, y + 21], [x + 2, y + 23]], PAL.paper[7]);
  if (view.flag('ecosistema_portatil_cerrado')) {
    // reenvía ella: folios que salen por la bandeja de salida (y uno en el suelo)
    const k = Math.floor((t || 0) / 300) % 3;
    for (let i = 0; i <= k; i++) { rect(g, x + 4, y - 2 - i * 2, 10, 2, PAL.paper[7]); hline(g, x + 5, y - 2 - i * 2, 7, PAL.ink[3]); }
    poly(g, [[x + 18, FL - 1], [x + 26, FL - 3], [x + 28, FL + 1], [x + 20, FL + 2]], PAL.paper[7]);
  }
  ditherOverlay(g, x + 18, y + 8, 2, 30, PAL.shadow, 0.35);
  kit.cantoVivo(g, x - 1, y + 1, 20, 37);
}
/** Roll-up de Comercial: desplegado («SU ANUNCIO AQUÍ», la extensión de Maripaz) o ENROLLADO (lona recogida en su
 *  base, el mástil desnudo y el anuncio enrollado: cambia la forma y el color). */
function drawRollup(g, enrollado) {
  const x = 246, y = 34, w = 16, h = 58;
  shadowEllipse(g, x + 8, FL + 1, 11, 2, 0.6);
  rect(g, x - 2, y + h, w + 4, 4, PAL.metal[4]); hline(g, x - 2, y + h, w + 4, PAL.metal[6]); hline(g, x - 2, y + h + 3, w + 4, PAL.metal[2]);
  if (enrollado) {
    vline(g, x + 8, y + 4, h - 4, PAL.metal[4]); vline(g, x + 9, y + 4, h - 4, PAL.metal[6]);
    rect(g, x - 1, y + h - 4, w + 2, 4, '#ff7a52'); hline(g, x - 1, y + h - 4, w + 2, '#ffb090'); hline(g, x - 1, y + h - 1, w + 2, '#c03a28');
    px(g, x + 8, y + 3, PAL.metal[7]);
    kit.cantoVivo(g, x - 1, y + h - 4, w + 2, 5);
    return;
  }
  vline(g, x + 8, y - 2, 2, PAL.metal[4]);
  rect(g, x, y, w, h, '#fff4ec'); frameRect(g, x, y, w, h, PAL.metal[3]);
  rect(g, x + 1, y + 1, w - 2, 9, '#ff7a52'); kit.micro(g, 'SU', x + 8, y + 3, PAL.white, { align: 'center' });
  kit.micro(g, 'ANUN', x + 8, y + 13, '#c03a28', { align: 'center' });
  kit.micro(g, 'CIO', x + 8, y + 19, '#c03a28', { align: 'center' });
  kit.micro(g, 'AQUÍ', x + 8, y + 26, '#c03a28', { align: 'center' });
  ellipse(g, x + 8, y + 38, 4, 4, PAL.gold[5]); ellipse(g, x + 8, y + 38, 2, 2, '#ff7a52');
  rect(g, x + 1, y + 46, w - 2, 8, '#ff7a52'); kit.micro(g, '247', x + 8, y + 48, PAL.white, { align: 'center' });
  ditherOverlay(g, x + w, y + 2, 2, h, PAL.shadow, 0.4);
  kit.cantoVivo(g, x, y, w, h);
}

// ------------------------------------------------------------ fondo
function techo(g) {
  gradV(g, 0, 0, W, 15, [PAL.ink[1], PAL.metal[1], PAL.metal[2]]);
  for (let x = 0; x < W; x += 24) vline(g, x, 0, 14, PAL.ink[0]);
  hline(g, 0, 7, W, PAL.ink[0]); hline(g, 0, 14, W, PAL.ink[1]);
  for (const lx of [110, 174, 262, 318]) {
    rect(g, lx, 4, 30, 4, PAL.metal[3]); rect(g, lx + 1, 5, 28, 2, '#fbfdff');
    glow(g, lx + 15, 12, 26, 8, '#f0f4ff', 0.1, 3);
  }
  // guirnalda Memphis de Marketing (solo en su zona)
  for (let x = 98; x < 188; x++) px(g, x, 11 + ((x >> 2) & 1), [PAL.dusk[5], PAL.teal[5], PAL.gold[5], '#ff5aa8'][(x >> 3) & 3]);
}
function paredes(g) {
  // MARKETING: lila con trama suave + formas Memphis
  paint(g, 96, 14, 94, FL - 14, (x, y) => ditherPick(x, y, LIL, 0.85 - (y - 14) / (FL - 14) * 0.5 + (hash2(x >> 3, y >> 2, 4) - 0.5) * 0.06));
  ellipse(g, 108, 82, 4, 4, PAL.gold[4]); ellipse(g, 107, 81, 2, 2, PAL.gold[5]);
  poly(g, [[176, 86], [182, 78], [188, 86]], PAL.teal[5]);
  for (let i = 0; i < 6; i++) px(g, 140 + i * 3, 84 + (i & 1) * 2, CORAL[1]);
  // EVENTOS (la puerta): ciruela oscuro
  paint(g, 190, 14, 52, FL - 14, (x, y) => ditherPick(x, y, PLUM, 0.75 - (y - 14) / (FL - 14) * 0.4));
  // COMERCIAL: melocotón cálido con rayas finas de papel pintado
  paint(g, 242, 14, 110 + PX, FL - 14, (x, y) => ditherPick(x, y, PEACH, 0.8 - (y - 14) / (FL - 14) * 0.45 + ((x % 12) === 0 ? -0.08 : 0)));
  // PASILLO: verde oliva (el de Administración)
  paint(g, 352 + PX, 14, 48, FL - 14, (x, y) => ditherPick(x, y, OLIVA, 0.6 - (y - 14) / (FL - 14) * 0.3));
  // zócalo alto (moldura) y zócalo de suelo en toda la planta (menos el núcleo, que lleva el suyo)
  for (const [x0, x1, c] of [[96, 190, LIL[1]], [190, 242, PLUM[0]], [242, 352 + PX, PEACH[0]], [352 + PX, W, OLIVA[0]]]) {
    rect(g, x0, FL - 4, x1 - x0, 4, shade(c, -0.2)); hline(g, x0, FL - 4, x1 - x0, shade(c, 0.25)); hline(g, x0, FL - 1, x1 - x0, PAL.ink[0]);
  }
  // filetes de departamento a la altura del zócalo alto
  kit.filete(g, 96, 190, 66, 'marketing');
  kit.filete(g, 190, 242, 66, 'eventos');
  kit.filete(g, 242, 352 + PX, 66, 'comercial');
  ditherOverlay(g, 96, 14, W - 96, 4, PAL.shadow, 0.3);
}
function suelos(g) {
  // moqueta gruesa de la planta 2 por zona (canto de goma claro en cada cambio)
  kit.zonaSuelo(g, 96, 190, FL, 'marketing', { vpx: 200, vpy: 24, borde: true });
  kit.zonaSuelo(g, 190, 242, FL, 'eventos', { vpx: 200, vpy: 24, borde: true });
  kit.zonaSuelo(g, 242, 352 + PX, FL, 'comercial', { vpx: 200, vpy: 24, borde: true });
  kit.zonaSuelo(g, 352 + PX, W, FL, 'administracion', { vpx: 200, vpy: 24, trama: 'baldosa', borde: true });
  // trama de moqueta gruesa (Marketing y Comercial)
  paint(g, 96, FL, 256 + PX, 144 - FL, (x, y) => (hash2(x, y, 11) < 0.05 ? '#2a1c34' : null));
  ditherOverlay(g, 96, FL, W - 96, 3, PAL.shadow, 0.45);
}

/** Pilastras en los cambios de zona. */
function pilastras(g) {
  for (const x of [94, 188, 240, 350 + PX]) kit.pilastra(g, x, 14, FL, { w: 5 });
}

/** El embudo de conversión de Marketing en vinilo: «VEN · MIRA · COMPARTE · ?». */
function drawEmbudo(g) {
  const x = 102, y = 34, w = 32, h = 38;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.45);
  rect(g, x, y, w, h, '#f6f2fc'); frameRect(g, x, y, w, h, LIL[0]);
  const bands = [[PAL.dusk[5], 28], [PAL.teal[5], 21], [PAL.gold[5], 14], [PAL.dusk[3], 7]];
  bands.forEach(([c, bw], i) => {
    const by = y + 3 + i * 8, nx = bands[i + 1] ? bands[i + 1][1] : 3;
    poly(g, [[x + (w - bw) / 2, by], [x + (w + bw) / 2, by], [x + (w + nx) / 2, by + 7], [x + (w - nx) / 2, by + 7]], c);
    hline(g, x + Math.round((w - bw) / 2), by, bw, shade(c, 0.3));
  });
  kit.micro(g, 'VEN', x + w / 2, y + 4, PAL.white, { align: 'center' });
  kit.micro(g, 'MIRA', x + w / 2, y + 12, PAL.white, { align: 'center' });
  kit.micro(g, 'COMP', x + w / 2, y + 20, PAL.ink[2], { align: 'center' });
  kit.micro(g, '?', x + w / 2, y + 28, PAL.white, { align: 'center' });
  rect(g, x + 15, y + 35, 3, 2, PAL.dusk[2]);
  line(g, x + 2, y + 6, x + 2, y + 30, PAL.dusk[4]); poly(g, [[x, y + 29], [x + 5, y + 29], [x + 2, y + 33]], PAL.dusk[4]);
  // el neón «MARKETING» (los apodos solo en boca de los personajes): pequeño, sobre el embudo, en fucsia
  rect(g, x - 3, y - 13, 42, 10, PAL.ink[1]); frameRect(g, x - 3, y - 13, 42, 10, PAL.ink[3]);
  glow(g, x + w / 2, y - 8, 26, 7, '#ff4aa8', 0.16, 4);
  kit.texto(g, 'MARKETING', x - 3, y - 13, 42, 10, { color: '#ff6ec0', id: 'neón' });
}
/** La pizarra SINERGIA (con su velero) sobre la mesa vacía de Tadeo. */
function drawPizarra(g) {
  const x = 142, y = 32, w = 42, h = 26;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.5);
  rect(g, x - 1, y - 1, w + 2, h + 2, PAL.metal[5]); frameRect(g, x - 1, y - 1, w + 2, h + 2, PAL.metal[3]);
  gradV(g, x, y, w, h, ['#fbfdff', '#e8eef6', '#d6dfec']);
  const cs = ['#d83c4a', '#2c5cc8', '#2c9a4c'];
  let cx = x + 2;
  for (let i = 0; i < 'SINERGIA'.length; i++) { kit.micro(g, 'SINERGIA'[i], cx, y + 3, cs[i % 3], { registrar: false }); cx += 5; }
  kit.registro.add('texto', x, y, w, h, 'SINERGIA');
  // el velero que aparece si la miras fijamente
  poly(g, [[x + 21, y + 11], [x + 21, y + 21], [x + 13, y + 21]], '#d4dcec'); line(g, x + 21, y + 11, x + 21, y + 22, '#aab6cc');
  poly(g, [[x + 23, y + 14], [x + 23, y + 21], [x + 29, y + 21]], '#dbe3f0');
  line(g, x + 10, y + 23, x + 31, y + 23, '#b2bed2');
  frameRect(g, x + 33, y + 13, 6, 6, '#c05060');
  line(g, x + 3, y + 13, x + 8, y + 16, '#2c5cc8'); line(g, x + 8, y + 16, x + 3, y + 19, '#2c5cc8');
  rect(g, x, y + h, w, 2, PAL.metal[4]); rect(g, x + 4, y + h - 1, 4, 2, '#d83c4a'); rect(g, x + 10, y + h - 1, 4, 2, '#2c5cc8');
}
/** La mesa VACÍA de Tadeo (se fue a las seis): silla arrimada, taza, la planta de plástico y su placa «TADEO». */
function drawMesaTadeo(g) {
  const x = 140, y = 76, w = 48;
  shadowEllipse(g, x + w / 2, FL + 1, 26, 2, 0.7);
  poly(g, [[x + 2, y], [x + w - 2, y], [x + w, y + 4], [x, y + 4]], PAL.paper[6]); hline(g, x + 2, y, w - 4, PAL.white);
  rect(g, x, y + 4, w, 3, PAL.paper[3]); hline(g, x, y + 4, w, PAL.paper[5]);
  rect(g, x + 2, y + 7, 3, FL - y - 7, PAL.metal[4]); rect(g, x + w - 5, y + 7, 3, FL - y - 7, PAL.metal[4]);
  ditherOverlay(g, x + 5, y + 7, w - 10, 6, PAL.shadow, 0.3);
  mug(g, x + 38, y - 5, { color: PAL.blue });
  // placa «TADEO» atornillada al canto de la mesa
  rect(g, x + 3, y + 4, 23, 7, PAL.ink[2]); hline(g, x + 3, y + 4, 23, PAL.metal[4]);
  kit.micro(g, 'TADEO', x + 15, y + 5, PAL.gold[5], { align: 'center' });
  // silla arrimada, vacía
  const cx = x + 36;
  rect(g, cx - 6, y + 6, 13, 9, PAL.ink[2]); hline(g, cx - 6, y + 6, 13, PAL.metal[3]);
  rect(g, cx - 1, y + 15, 2, 3, PAL.metal[3]); hline(g, cx - 5, FL - 1, 11, PAL.metal[2]);
}

/** La puerta de EVENTOS (Sala Polivalente): doble hoja ciruela con ojos de buey, barras antipánico, piloto «5 MIN»
 *  en el montante, placa «2 EVENTOS», marco común y umbral granate. */
function drawPuertaEventos(g) {
  const { x, y, w, h } = PUERTA_EV;
  kit.marcoPuerta(g, x, y, w, h);
  const PL = ['#1c1228', '#2a1a3a', '#3a2650', '#4c3262', '#5e4076'];
  const hw = w >> 1;
  for (const [dx, dw] of [[0, hw], [hw, w - hw]]) {
    paint(g, x + dx, y, dw, h, (xx, yy) => ditherPick(xx, yy, PL, 0.75 - (yy - y) / h * 0.4 - (xx - x - dx) / dw * 0.15));
    frameRect(g, x + dx, y, dw, h, PAL.ink[1]);
    frameRect(g, x + dx + 3, y + 32, dw - 6, 20, PL[1]);
    const ox = x + dx + (dw >> 1), oy = y + 13;
    ellipse(g, ox, oy, 6, 6, PAL.metal[4]); ellipse(g, ox, oy, 5, 5, PAL.ink[0]);
    ellipse(g, ox, oy, 4, 4, (xx, yy, d) => ditherPick(xx, yy, [PAL.ink[1], '#5a2a5a', '#c86aa8', '#fff0c0'], Math.max(0, 1 - d - (yy - oy) * 0.05)));
    px(g, ox - 2, oy - 2, PAL.white);
    rect(g, x + dx + 3, y + 26, dw - 6, 2, PAL.metal[5]); hline(g, x + dx + 3, y + 26, dw - 6, PAL.metal[7]);
  }
  vline(g, x + hw, y + 2, h - 4, '#ffd890');                                     // la rendija de luz
  glow(g, x + hw, y + 30, 8, 30, '#ffe8b0', 0.16, 4);
  // montante con el piloto verde «5 MIN» (no se apaga nunca)
  const my = y - 10;
  rect(g, x - 2, my, w + 4, 8, PAL.ink[0]); frameRect(g, x - 2, my, w + 4, 8, PAL.metal[3]);
  glow(g, x + hw, my + 4, 18, 5, '#a8f07a', 0.18, 3);
  kit.micro(g, '5 MIN', x + hw, my + 2, '#a8f07a', { align: 'center' });
  // placa común de destino
  const pw = kit.placaSalaW('eventos', { sinSub: true });
  // en la misma fila que el resto de placas y rótulos de la planta (y 2), con varillas hasta el techo
  vline(g, x + hw - (pw >> 1) + 4, 0, 2, PAL.metal[3]); vline(g, x + hw + (pw >> 1) - 5, 0, 2, PAL.metal[3]);
  kit.placaSala(g, x + hw - (pw >> 1), 2, 'eventos', { sinSub: true });
  kit.umbral(g, x - 3, FL + 1, w + 6, 6, kit.DEPTO.eventos.c);
}

/** Comercial: el termómetro de ventas de Maripaz en un papelógrafo: «OBJETIVO Q3», al 97 %. */
function drawTermometro(g) {
  const x = 268, y = 32, w = 20, h = 48;
  // caballete
  line(g, x + 3, y + h, x, FL, PAL.wood[3]); line(g, x + w - 3, y + h, x + w, FL, PAL.wood[3]); line(g, x + w / 2, y + h, x + w / 2 + 3, FL, PAL.wood[2]);
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.45);
  rect(g, x, y, w, h, PAL.paper[7]); frameRect(g, x, y, w, h, PAL.paper[3]);
  rect(g, x - 1, y - 2, w + 2, 3, PAL.wood[3]);
  kit.micro(g, 'Q3', x + 2, y + 3, '#c03a28');
  kit.micro(g, '97', x + w - 2, y + 3, '#c03a28', { align: 'right' });
  const tx = x + 6, ty = y + 10, th = 30;
  rect(g, tx, ty, 5, th, PAL.paper[5]); frameRect(g, tx, ty, 5, th, PAL.ink[3]);
  const fill = Math.round(th * 0.97);
  rect(g, tx + 1, ty + th - fill, 3, fill, '#d83c2a'); vline(g, tx + 1, ty + th - fill, fill, '#ff7a5a');
  ellipse(g, tx + 2, ty + th + 3, 4, 3, PAL.ink[3]); ellipse(g, tx + 2, ty + th + 3, 3, 2, '#d83c2a');
  for (let i = 0; i <= 3; i++) hline(g, tx + 6, ty + i * 9, 2, PAL.ink[3]);
}
/** El lema enmarcado de Comercial, ENTERO en 4 líneas 3×5 (antes «TODO ES…»). */
function drawLema(g) {
  const x = 292, y = 20, w = 58, h = 29;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.5);
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.gold[2]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.gold[1]);
  hline(g, x - 2, y - 2, w + 4, PAL.gold[6]); vline(g, x - 2, y - 2, h + 4, PAL.gold[5]);
  gradV(g, x, y, w, h, [PAL.night[2], PAL.night[1]]);
  kit.texto(g, LEMA, x, y, w, h, { color: PAL.gold[6], id: 'lema_enmarcado' });
}
/** La mesa de Maripaz (Comercial): frente naranja, teléfono, calculadora con rollo, la agenda «FACTURAS». */
function drawMesaMaripaz(g) {
  const x = 290, y = 78, w = 34;
  shadowEllipse(g, x + w / 2, FL + 1, 20, 2, 0.7);
  poly(g, [[x + 2, y], [x + w - 2, y], [x + w, y + 4], [x, y + 4]], PAL.paper[6]); hline(g, x + 2, y, w - 4, PAL.white);
  gradV(g, x, y + 4, w, FL - y - 4, [PAL.dusk[5], PAL.dusk[4], PAL.dusk[3]]);
  hline(g, x, y + 4, w, PAL.dusk[6]); vline(g, x, y + 4, FL - y - 4, PAL.dusk[5]); vline(g, x + w - 1, y + 4, FL - y - 4, PAL.dusk[2]);
  rect(g, x + 4, y + 8, w - 8, 6, PAL.dusk[3]); frameRect(g, x + 4, y + 8, w - 8, 6, PAL.dusk[2]);
  for (let i = 0; i < 5; i++) rect(g, x + 6 + i * 5, y + 9, 3, 4, i % 2 ? PAL.gold[5] : PAL.paper[6]);
  // [P4] el teléfono, a la derecha del monitor de Comercial (el monitor es el objeto `pantalla_comercial`)
  rect(g, x + 26, y - 4, 8, 4, PAL.ink[2]); rect(g, x + 25, y - 6, 10, 2, PAL.ink[3]);
  rect(g, x + 1, y - 2, 9, 2, '#c03a28'); hline(g, x + 1, y - 2, 9, '#ff7a52');
}
/** El PASILLO a Administración: boca de 46 px en perspectiva, linóleo verde oliva, fluorescente y la ventanilla al
 *  fondo que «brilla como un faro». La placa «2 ADMINISTRACIÓN ►» cuelga encima. */
function drawPasillo(g) {
  const x0 = 354, x1 = 398, top = 20;
  const fx0 = 368, fx1 = 388, ftop = 40, fbot = 78;                        // el fondo del pasillo
  // marco de la boca (común)
  kit.marcoPuerta(g, x0, top, x1 - x0, FL - top, { ramp: [PAL.metal[0], PAL.metal[1], PAL.metal[2], PAL.metal[3], PAL.metal[4], PAL.metal[5], PAL.metal[6], PAL.metal[7]] });
  // techo, paredes y suelo en perspectiva
  poly(g, [[x0, top], [x1, top], [fx1, ftop], [fx0, ftop]], OLIVA[0]);
  poly(g, [[x0, top], [fx0, ftop], [fx0, fbot], [x0, FL]], (xx, yy) => ditherPick(xx, yy, OLIVA, 0.55 - (xx - x0) / 30));
  poly(g, [[x1, top], [fx1, ftop], [fx1, fbot], [x1, FL]], (xx, yy) => ditherPick(xx, yy, OLIVA, 0.35 + (x1 - xx) / 40));
  poly(g, [[x0, FL], [fx0, fbot], [fx1, fbot], [x1, FL]], (xx, yy) => ditherPick(xx, yy, kit.DEPTO.administracion.suelo, 0.3 + (yy - fbot) / 20));
  for (let k = 0; k < 3; k++) { const t = k / 3; line(g, Math.round(x0 + (fx0 - x0) * t), Math.round(FL + (fbot - FL) * t), Math.round(x1 + (fx1 - x1) * t), Math.round(FL + (fbot - FL) * t), OLIVA[1]); }
  // fluorescentes del pasillo
  for (const t of [0.25, 0.6]) { const yy = Math.round(top + (ftop - top) * t), xa = Math.round(x0 + (fx0 - x0) * t) + 8, xb = Math.round(x1 + (fx1 - x1) * t) - 8; hline(g, xa, yy + 1, xb - xa, '#e8ffe0'); }
  // el fondo: la ventanilla de Administración, iluminada
  rect(g, fx0, ftop, fx1 - fx0, fbot - ftop, OLIVA[2]);
  rect(g, fx0 + 4, ftop + 10, 12, 12, '#d8f0b0'); frameRect(g, fx0 + 3, ftop + 9, 14, 14, PAL.metal[4]);
  rect(g, fx0 + 3, ftop + 23, 14, 3, PAL.wood[3]);
  glow(g, fx0 + 10, ftop + 16, 16, 14, '#e0ffb0', 0.3, 4);
  rect(g, fx0 + 7, ftop + 2, 6, 5, kit.DEPTO.administracion.c);
  // placa de destino colgada sobre la boca (alineada a la derecha, dentro de la sala)
  const pw = kit.placaSalaW('administracion', { flecha: '>' });
  const WX = W - PX;                                         // (este dibujo va corrido PX: el borde de la sala, en sus coordenadas)
  vline(g, WX - 30, 0, 2, PAL.metal[3]); vline(g, WX - pw + 10, 0, 2, PAL.metal[3]);
  kit.placaSala(g, WX - 2 - pw, 2, 'administracion', { flecha: '>' });
  kit.umbral(g, x0 + 2, FL + 1, x1 - x0 - 4, 6, kit.DEPTO.administracion.c);
}
/** Los pufs (Marketing los ha puesto delante del ascensor para que la gente «se ubique»): sin tapar la botonera. */
function drawPufs(g) {
  shadowEllipse(g, 70, 102, 20, 3, 0.7);
  const DU = [PAL.dusk[2], PAL.dusk[3], PAL.dusk[4], PAL.dusk[5], PAL.dusk[6], PAL.dusk[7]];
  const defs = [[60, 98, 9, 7, PAL.teal], [74, 99, 10, 8, DU], [85, 100, 6, 5, PAL.gold]];
  for (const [cx, cy, rx, ry, ramp] of defs) {
    ellipse(g, cx, cy - 1, rx, ry, (x, y, d) => ditherPick(x, y, [ramp[2], ramp[3], ramp[4], ramp[5]], Math.max(0, Math.min(1, 1 - d * 0.9 - (x - cx) * 0.03 + (cy - y) * 0.02))));
    ellipse(g, cx - 2, cy - ry + 1, Math.max(1, rx * 0.5), Math.max(1, ry * 0.3), ramp[Math.min(6, ramp.length - 1)]);
    hline(g, cx - rx + 2, cy + ry - 1, rx * 2 - 3, ramp[1]);
  }
  // el vinilo de Marketing en el suelo del núcleo: «ESPACIO DE ENCUENTRO» (no cabe: «ENCUENTRO»)
  kit.micro(g, 'UBÍCATE', 70, 108, '#ff6ec0', { align: 'center', registrar: false });
}
function luces(g) {
  glow(g, 143, 40, 46, 30, '#ff4aa8', 0.06, 4);                 // Marketing, neón
  glow(g, 216, 70, 26, 36, '#c86aa8', 0.08, 4);                 // los focos que se escapan por los ojos de buey
  glow(g, 216, 104, 24, 6, '#ffe0a0', 0.14, 4);                 // la lengua de luz en el umbral
  glow(g, 300, 50, 50, 34, '#ffc890', 0.07, 4);                 // Comercial, cálido
  glow(g, 376 + PX, 60, 20, 30, '#e0ffb0', 0.06, 4);            // el pasillo
}

export default {
  room: 'ecosistema',
  width: W,
  rediseno: true,
  scale: { yFar: 98, far: 0.88, yNear: 142, near: 1.04 },
  walkboxes: [{ id: 'suelo', poly: [[4, 100], [356 + PX, 100], [360 + PX, 98], [396 + PX, 98], [398 + PX, 142], [2, 142]] }],
  entries: { pecera: N.escaleras.baja.entrada, ascensor: N.ascensor.entrada, eventos: [216, 114, 'down'], administracion: [372 + PX, 116, 'left'] },
  layout,
  draw(g) {
    techo(g);
    paredes(g);
    suelos(g);
    kit.nucleo(g, 'ecosistema', FL);
    pilastras(g);
    kit.rotuloZona(g, 143, 2, 'marketing', { colgado: 2 });
    kit.rotuloZona(g, 290, 2, 'comercial', { colgado: 2 });          // centrado entre la placa de Eventos y la de Administración
    drawEmbudo(g);
    drawPizarra(g);
    drawMesaTadeo(g);
    drawPuertaEventos(g);
    drawTermometro(g);
    drawLema(g);
    drawMesaMaripaz(g);
    corrido(drawPasillo)(g);
    drawPufs(g);
    luces(g);
    vignette(g, W, 144, 0.4);
  },
  animate(g, view, t) {
    // los ojos de buey: los focos de Eventos laten detrás del cristal
    const k = (Math.sin(t / 260) + Math.sin(t / 97)) > 0.6;
    if (k) for (const ox of [PUERTA_EV.x + 8, PUERTA_EV.x + 25]) { px(g, ox, PUERTA_EV.y + 12, '#fff0c0'); px(g, ox + 1, PUERTA_EV.y + 13, '#ffd0f0'); }
    // el piloto «5 MIN»: un parpadeo de nada, cada mucho
    if ((t % 4000) < 120) rect(g, PUERTA_EV.x + 4, PUERTA_EV.y - 9, PUERTA_EV.w - 8, 6, PAL.ink[0]);
  },
};
void label; void N;
