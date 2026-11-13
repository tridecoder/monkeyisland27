// PROPUESTA ALTERNATIVA · `pecera`, tramo x 300-620 pintado (prueba). Contrato de content/rooms/art (ancho 800).
// Fuera del tramo el fondo es un relleno neutro: la distribución completa está en la maqueta (img/maqueta-pecera.png).
// Problemas que resuelve (INFORME_AJUSTE_VISUAL.md): 6 (zonas sin delimitar), 7 (kanban tapado por el coro), 19 (rótulos
// cortados: «BRU/PEL», «HERMINI», «DESARR.»), 20 (señalética), y la lectura de P04 (silla con chaqueta → silla en la mesa).
// Orden propuesto de la Pecera (izq.→dcha.): NÚCLEO 0-96 · PASILLO DE DIRECCIÓN 96-170 · WEB 170-310 · ECONOMÍA 310-390 ·
// INFOGRAFÍA 390-474 · ‖cinta‖ · DESARROLLO 474-640 · DISEÑO Y PRODUCTO 640-800.
import {
  PAL, rect, hline, vline, frameRect, px, line, poly, ellipse, paint, bevel, ditherOverlay, gradV, gradH,
  glow, lightCone, shadowEllipse, ditherPick, hash2, rng, fadeRows, vignette, monitor, deskLamp, framed, mix, shade, label,
} from '../../../../engine/draw.js';
import { tiny, tinyW, POSTIT, postit, JACKETS, chairBack, jacketOn, deskFront, personBack, cable } from '../../../../content/rooms/art/lib-oficina.js';
import { DEPTO, rotuloDepto, rotuloDeptoW, cantoVivo } from '../lib/kit.js';

const W = 800, FL = 92;
const X0 = 290, X1 = 630;                         // tramo pintado
const VP = { x: 450, y: 8 };                      // punto de fuga del suelo
const LIM = [{ x: 310, de: 'web', a: 'redaccion' }, { x: 386, de: 'redaccion', a: 'infografia' }, { x: 480, de: 'infografia', a: 'desarrollo' }];
const zonaDe = (xb) => (xb < 310 ? 'web' : xb < 386 ? 'redaccion' : xb < 480 ? 'infografia' : 'desarrollo');
const aSuelo = (x, y) => VP.x + (x - VP.x) * (FL - VP.y) / Math.max(1, y - VP.y);   // x proyectada en la línea de suelo
const deSuelo = (xb, y) => VP.x + (xb - VP.x) * (y - VP.y) / (FL - VP.y);             // inversa
const a3 = (v) => !!v.flag('acto_3_iniciado');
const libre = (v) => !!v.flag('silla_libre');

// ------------------------------------------------------------------ fondo
const PARED = {
  web: [PAL.teal[2], PAL.teal[3], PAL.teal[4]],
  redaccion: ['#3a5a6c', '#46687a', '#527688'],
  infografia: ['#7a6448', '#8a7452', '#9a845e'],
  desarrollo: ['#3e3656', '#4a4064', '#564c72'],
};
function techo(g) {
  gradV(g, X0, 0, X1 - X0, 15, [PAL.ink[0], PAL.ink[1], PAL.metal[1]]);
  for (let x = X0 - (X0 % 24); x < X1; x += 24) vline(g, x, 0, 14, PAL.ink[0]);
  hline(g, X0, 7, X1 - X0, PAL.ink[0]); hline(g, X0, 14, X1 - X0, PAL.ink[1]);
  for (const x of [300, 350, 420, 470, 540, 600]) { rect(g, x - 1, 10, 30, 4, PAL.metal[2]); rect(g, x, 11, 28, 2, '#f4fff4'); }
}
function paredes(g) {
  for (const [x0, x1, z] of [[X0, 310, 'web'], [310, 386, 'redaccion'], [386, 480, 'infografia'], [480, X1, 'desarrollo']]) {
    const r = PARED[z];
    paint(g, x0, 15, x1 - x0, FL - 15, (x, y) => ditherPick(x, y, r, 0.85 - (y - 15) / 120 + (hash2(x >> 1, y >> 1, 11) < 0.05 ? -0.15 : 0)));
    // filete de departamento a la altura del zócalo alto (código de color de la zona)
    rect(g, x0, 66, x1 - x0, 3, DEPTO[z].c); hline(g, x0, 69, x1 - x0, shade(DEPTO[z].c, -0.45));
    // zócalo
    rect(g, x0, FL - 4, x1 - x0, 4, shade(r[0], -0.35)); hline(g, x0, FL - 4, x1 - x0, shade(r[2], 0.1));
  }
  // pilastras en los cambios de zona (la pared «se quiebra»: frontera física)
  for (const x of [310, 386, 480]) {
    rect(g, x - 3, 15, 6, FL - 15, PAL.metal[3]); vline(g, x - 3, 15, FL - 15, PAL.metal[5]); vline(g, x + 2, 15, FL - 15, PAL.metal[1]);
    rect(g, x - 4, FL - 5, 8, 5, PAL.metal[2]);
  }
}
function suelos(g, v) {
  const rampas = { web: DEPTO.web.suelo, redaccion: DEPTO.redaccion.suelo, infografia: DEPTO.infografia.suelo, desarrollo: DEPTO.desarrollo.suelo };
  paint(g, X0, FL, X1 - X0, 144 - FL, (x, y) => {
    const xb = aSuelo(x, y);
    const z = zonaDe(xb);
    const t = (y - FL) / 52;
    const n = hash2(x, y, 4);
    // trama de moqueta en losetas (cada zona su loseta)
    const lx = Math.floor((xb - 300) / 10), ly = Math.floor(Math.log(y - VP.y) * 9);
    const tile = ((lx + ly) & 1) ? 0.08 : -0.04;
    return ditherPick(x, y, rampas[z], 0.2 + t * 0.6 + tile + (n < 0.05 ? -0.2 : 0));
  });
  // cantos de goma entre zonas (líneas de perspectiva claras)
  for (const L of LIM) {
    if (L.x === 480) continue;   // ahí manda la cinta
    line(g, L.x, FL, Math.round(deSuelo(L.x, 144)), 144, '#c8ccd8');
    line(g, L.x + 1, FL, Math.round(deSuelo(L.x, 144)) + 1, 144, '#5a6070');
  }
  ditherOverlay(g, X0, FL, X1 - X0, 3, PAL.ink[0], 0.55);
  // marcas de las ruedas de la silla que falta (mesa de Bruno, Acto I)
  if (!libre(v)) for (const [dx, dy] of [[-5, 0], [5, 0], [0, -2], [-3, 3], [3, 3]]) px(g, 330 + dx, 108 + dy, '#20283a');
}
function rotulos(g) {
  // rótulos de departamento colgados del techo, uno por zona y centrados en ella
  for (const [z, cx, txt] of [['redaccion', 348, 'ECONOMÍA'], ['infografia', 433, 'INFOGRAFÍA'], ['desarrollo', 556, 'DESARROLLO']]) {
    const w = rotuloDeptoW(z, { texto: txt });
    rotuloDepto(g, cx - (w >> 1), 18, z, { texto: txt, colgado: 4 });
  }
}
// ---------------- WEB (borde izquierdo del tramo): la mesa de Yoli, tres monitores
function mesaYoli(g) {
  deskFront(g, 284, 78, 24, 16, { top: [PAL.paper[4], PAL.paper[5], PAL.paper[6]] });
  for (let i = 0; i < 3; i++) { rect(g, 284 + i * 8, 64, 8, 10, PAL.ink[1]); rect(g, 285 + i * 8, 65, 6, 7, [PAL.blue[4], PAL.crt[2], PAL.red[3]][i]); }
  rect(g, 300, 74, 2, 4, PAL.metal[3]);
  postit(g, 296, 56, POSTIT.p, { lines: false }); tiny(g, 'KW', 297, 57, PAL.ink[2]);
  glow(g, 296, 70, 16, 10, '#8ecfff', 0.14, 3);
}
// ---------------- ECONOMÍA
function economia(g, v) {
  // corcho de Bolsa con recortes (titulares en 3x5 legibles)
  const cx = 314, cy = 35;
  rect(g, cx - 1, cy - 1, 34, 11, PAL.wood[1]); rect(g, cx, cy, 32, 9, PAL.wood[4]); ditherOverlay(g, cx, cy, 32, 9, PAL.wood[2], 0.3);
  rect(g, cx + 2, cy + 1, 17, 7, PAL.paper[6]); tiny(g, 'IBEX', cx + 3, cy + 2, PAL.ink[2]);
  rect(g, cx + 21, cy + 1, 9, 7, PAL.paper[7]); line(g, cx + 22, cy + 6, cx + 25, cy + 2, PAL.red[3]); line(g, cx + 25, cy + 2, cx + 29, cy + 5, PAL.red[3]);
  px(g, cx + 9, cy + 1, PAL.red[4]); px(g, cx + 24, cy + 1, PAL.blue[5]);
  // calendario de Ramírez, parado en marzo de 2019
  const kx = 358, ky = 35;
  ditherOverlay(g, kx + 1, ky + 1, 20, 24, PAL.shadow, 0.5);
  rect(g, kx, ky, 20, 24, PAL.paper[7]); rect(g, kx, ky, 20, 7, PAL.red[3]); tiny(g, 'MAR', kx + 4, ky + 1, PAL.paper[7]);
  label(g, '19', kx + 4, ky + 6, PAL.ink[2]);
  for (let i = 0; i < 4; i++) hline(g, kx + 2, ky + 18 + i * 1, 16, i % 2 ? PAL.paper[4] : PAL.paper[5]);
  // mesa de Bruno: sin silla
  deskFront(g, 314, 78, 30, 16, { drawers: 'right' });
  // mesa de Ramírez
  deskFront(g, 346, 78, 34, 16, { drawers: 'left' });
  monitor(g, 350, 59, { on: false, w: 22, h: 17, keyboard: true });
  ditherOverlay(g, 350, 59, 22, 3, PAL.paper[2], 0.5);                                // polvo de 2019
  // papeles de Ramírez (pila de periódicos de 2019) y papelera bajo la mesa de Bruno
  for (let i = 0; i < 4; i++) { rect(g, 352 + (i & 1), 75 - i * 2, 12, 2, i % 2 ? PAL.paper[5] : PAL.paper[6]); hline(g, 352, 76 - i * 2, 12, PAL.paper[3]); }
  rect(g, 320, 84, 8, 9, PAL.metal[2]); frameRect(g, 320, 84, 8, 9, PAL.metal[1]); rect(g, 321, 84, 6, 2, PAL.paper[6]);
  // regleta y cables bajo las mesas
  rect(g, 336, 92, 12, 2, PAL.paper[5]); px(g, 338, 92, PAL.red[4]); line(g, 340, 91, 344, 84, PAL.ink[0]); line(g, 342, 91, 360, 86, PAL.ink[0]);
  // planta de Economía (la única que riega alguien: Ramírez no)
  rect(g, 381, 78, 1, 1, PAL.leaf[4]);
  void v;
}
function drawOrdenadorBruno(g, view, t) {
  // monitor viejo ENCENDIDO y el pósit LEGIBLE «BRUNO / PELLIZCO» (gag G1) pegado a la pared, sobre el monitor
  monitor(g, 318, 59, { on: true, screen: libre(view) ? 'blue' : 'text', w: 24, h: 17, keyboard: true, t });
  glow(g, 330, 66, 14, 9, libre(view) ? '#8ec8ff' : '#7aff9a', 0.14, 3);
  const px0 = 312, py0 = 46;
  ditherOverlay(g, px0 + 1, py0 + 1, 35, 13, PAL.shadow, 0.5);
  rect(g, px0, py0, 35, 13, POSTIT.y); hline(g, px0, py0, 35, '#fff6a0'); hline(g, px0, py0 + 12, 35, '#c8a83a');
  tiny(g, 'BRUNO', px0 + 17, py0 + 1, PAL.ink[2], { align: 'center' });
  tiny(g, 'PELLIZCO', px0 + 17, py0 + 7, PAL.red[3], { align: 'center' });
  rect(g, px0 + 14, py0 - 1, 7, 2, '#d8cfa0');
  cantoVivo(g, 318, 59, 24, 17);
}
function drawSillaRamirez(g, view) {
  // silla de Ramírez en el plano medio (grande, con chaqueta beige bien visible). Tras P04, arrimada a la mesa de Bruno.
  if (libre(view)) { chairBack(g, 330, 104, { col: [PAL.metal[1], PAL.metal[2], PAL.metal[3], PAL.metal[4], PAL.metal[5]] }); return; }
  chairBack(g, 364, 110, { col: [PAL.metal[1], PAL.metal[2], PAL.metal[3], PAL.metal[4], PAL.metal[5]], jacket: view.flag('chaqueta_cogida') ? null : ['#6a5434', '#8a7046', '#a88c5a', '#c8aa74', '#e4c890'], turn: -1 });
  if (!view.flag('chaqueta_cogida')) { // sobre de azúcar asomando del bolsillo + canto vivo
    rect(g, 366, 93, 3, 2, PAL.paper[7]); px(g, 368, 93, PAL.red[4]);
    hline(g, 357, 85, 14, '#fff2c0');
  }
}
function drawTaza(g) {
  // taza abandonada (8×9) con costra y una mosca: se lee a 1x
  const x = 370, y = 68;
  ditherOverlay(g, x + 1, y + 9, 9, 2, PAL.ink[0], 0.6);
  rect(g, x, y, 7, 9, PAL.paper[6]); vline(g, x, y, 9, PAL.paper[7]); vline(g, x + 6, y, 9, PAL.paper[3]);
  rect(g, x + 7, y + 2, 2, 4, PAL.paper[4]); px(g, x + 8, y + 3, PAL.ink[1]); px(g, x + 8, y + 4, PAL.ink[1]);
  hline(g, x + 1, y + 1, 5, PAL.wood[1]); px(g, x + 2, y + 2, PAL.wood[2]); px(g, x + 4, y + 3, PAL.wood[2]);   // costra
  rect(g, x + 2, y + 5, 3, 2, PAL.red[3]);                                                                     // logo
  px(g, x + 3, y - 3, PAL.ink[0]); px(g, x + 2, y - 4, PAL.metal[5]); px(g, x + 4, y - 4, PAL.metal[5]);         // mosca
}
// ---------------- INFOGRAFÍA
function infografia(g) {
  // póster de quesitos enmarcado (Leoncio Quesitos) y bocetos
  framed(g, 392, 38, 26, 20, (gg, x, y, w, h) => {
    rect(gg, x, y, w, h, PAL.paper[7]);
    ellipse(gg, x + 9, y + 11, 7, 7, (xx, yy) => { const a = Math.atan2(yy - (y + 11), xx - (x + 9)); return a < -1 ? DEPTO.infografia.c : a < 1.2 ? PAL.teal[4] : PAL.red[4]; });
    for (let i = 0; i < 3; i++) rect(gg, x + 18, y + 4 + i * 5, 6, 3, [DEPTO.infografia.c, PAL.teal[4], PAL.red[4]][i]);
  }, { ramp: PAL.wood });
  for (const [x, y, c] of [[424, 38, PAL.paper[7]], [438, 40, '#f4e8c8']]) {
    ditherOverlay(g, x + 1, y + 1, 12, 10, PAL.shadow, 0.5); rect(g, x, y, 12, 10, c);
    for (let i = 0; i < 3; i++) rect(g, x + 2 + i * 3, y + 7 - i * 2, 2, 2 + i * 2, [PAL.teal[4], DEPTO.infografia.c, PAL.red[4]][i]);
    px(g, x + 6, y, PAL.red[4]);
  }
}
function drawMesaDibujo(g) {
  // mesa de dibujo inclinada con un gráfico de barras a medias, flexo con su charco de luz cálida
  const x = 390, y = 64;
  shadowEllipse(g, x + 17, FL + 1, 20, 2, 0.6);
  line(g, x + 4, y + 16, x + 2, FL, PAL.metal[3]); line(g, x + 30, y + 16, x + 32, FL, PAL.metal[2]);
  line(g, x + 4, y + 22, x + 30, y + 22, PAL.metal[2]);
  poly(g, [[x + 2, y + 2], [x + 34, y], [x + 36, y + 14], [x, y + 17]], PAL.paper[7]);
  line(g, x, y + 17, x + 36, y + 14, PAL.wood[2]); line(g, x, y + 18, x + 36, y + 15, PAL.wood[1]);
  for (let i = 0; i < 5; i++) rect(g, x + 6 + i * 5, y + 13 - i * 2 - (i === 3 ? 3 : 0), 3, 2 + i * 2 + (i === 3 ? 3 : 0), [PAL.teal[4], DEPTO.infografia.c, PAL.red[4], DEPTO.infografia.c, PAL.teal[3]][i]);
  line(g, x + 5, y + 4, x + 30, y + 3, PAL.ink[3]);
  const L = deskLamp(g, x + 36, y + 2, { color: [PAL.gold[0], PAL.gold[1], PAL.gold[2], PAL.gold[3], PAL.gold[4], PAL.gold[5]], on: true });
  lightCone(g, L.lx - 4, L.ly, 4, 26, 18, '#fff0c0', 0.25);
  cantoVivo(g, x + 2, y, 33, 16);
}
function drawHerminia(g, view, t) {
  // la mesita de Herminia y su portátil de cara: la etiqueta «HERMINIA» cabe entera (33 px) en la barra de título
  const x = 444, y = 80;
  deskFront(g, x, y, 34, 13, { top: [PAL.metal[4], PAL.metal[5], PAL.metal[6]], body: [PAL.metal[1], PAL.metal[2], PAL.metal[3]] });
  const sx = x + 1, sy = y - 21;
  rect(g, sx, sy, 32, 20, PAL.metal[5]); frameRect(g, sx, sy, 32, 20, PAL.metal[2]);
  rect(g, sx + 2, sy + 2, 28, 15, PAL.ink[1]);
  rect(g, sx + 2, sy + 2, 28, 6, '#ff8c3c'); tiny(g, 'HERMINIA', sx + 16, sy + 2, PAL.ink[1], { align: 'center' });
  const k = Math.floor(t / 400) % 5;
  for (let i = 0; i < 5; i++) rect(g, sx + 5 + i * 5, sy + 15 - (i <= k ? 2 + i : 1), 3, (i <= k ? 2 + i : 1), i <= k ? '#ff8c3c' : PAL.metal[2]);
  poly(g, [[sx - 1, y - 1], [sx + 33, y - 1], [sx + 35, y + 1], [sx - 3, y + 1]], PAL.metal[4]);
  glow(g, sx + 16, sy + 10, 16, 10, '#ffb070', 0.12, 3);
  cantoVivo(g, sx, sy, 32, 20);
}
function drawCartelFrontera(g) {
  // cartel de la frontera, a mano, pegado en la pilastra de la cinta: legible entero
  const x = 456, y = 37;
  ditherOverlay(g, x + 1, y + 1, 30, 15, PAL.shadow, 0.5);
  rect(g, x, y, 30, 15, PAL.paper[7]); frameRect(g, x, y, 30, 15, PAL.red[3]);
  tiny(g, 'SOLO', x + 15, y + 2, PAL.red[3], { align: 'center' }); tiny(g, 'CÓDIGO', x + 15, y + 8, PAL.red[3], { align: 'center' });
  rect(g, x - 2, y - 1, 6, 2, '#d8cfa0'); rect(g, x + 26, y - 1, 6, 2, '#d8cfa0');
  poly(g, [[x + 31, y + 5], [x + 35, y + 8], [x + 31, y + 11]], PAL.red[3]);
}
function drawCinta(g, view) {
  // FRONTERA: cinta de carrocero en el suelo (beige con trama), del zócalo al borde de pantalla; en el Acto III, lazo
  // alrededor de Infografía.
  const tira = (x0, y0, x1, y1) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
      const w = 2 + Math.round((y - FL) / 26);
      for (let k = 0; k < w; k++) px(g, x + k, y, ((x + y + k) % 5 === 0) ? '#b8a878' : '#e8dcb0');
    }
  };
  const xb = 480;
  tira(xb, FL, Math.round(deSuelo(xb, 144)), 144);
  if (a3(view)) {
    // lazo: sale por delante y rodea Infografía hasta la pared en x 390
    tira(Math.round(deSuelo(xb, 128)), 128, Math.round(deSuelo(386, 128)), 128);
    tira(Math.round(deSuelo(386, 128)), 128, 386, FL);
  }
}
// ---------------- DESARROLLO
function desarrollo(g) {
  // puesto del coro (borde derecho): uno de espaldas con cascos y su pantalla de código
  deskFront(g, 610, 78, 30, 16, { top: [PAL.metal[4], PAL.metal[5], PAL.metal[6]], body: [PAL.metal[1], PAL.metal[2], PAL.metal[3]] });
  rect(g, 614, 60, 22, 15, PAL.ink[0]); rect(g, 615, 61, 20, 13, '#101828');
  for (let i = 0; i < 5; i++) hline(g, 616 + (i % 2) * 2, 63 + i * 2, 8 + ((i * 5) % 8), [PAL.purple[5], PAL.crt[4], PAL.gold[4], PAL.teal[5], PAL.red[4]][i]);
  glow(g, 625, 68, 18, 12, '#b48cff', 0.15, 3);
  // uno del coro, de espaldas con cascos (el coro empieza aquí: el kanban queda 18 px a su izquierda)
  personBack(g, 626, 70, { cans: true, shirt: JACKETS.navy, hair: PAL.ink[2] });
  // semáforo de ruido en la pared (ahora con rótulo)
  const sx = 598, sy = 30;
  rect(g, sx, sy, 10, 26, PAL.ink[1]); frameRect(g, sx, sy, 10, 26, PAL.metal[3]);
  for (let i = 0; i < 3; i++) ellipse(g, sx + 5, sy + 5 + i * 8, 3, 3, i === 0 ? '#ff4a3a' : PAL.ink[2]);
  glow(g, sx + 5, sy + 5, 8, 8, '#ff4a3a', 0.2, 3);
}
function drawKanban(g, view) {
  // KANBAN con ruedas, EXENTO en el plano medio (pies en y 104), lejos del coro. Cabeceras legibles en 3x5.
  const x = 490, y = 34, w = 102, h = 48;
  shadowEllipse(g, x + w / 2, 105, w / 2, 3, 0.7);
  // patas y ruedas
  for (const lx of [x + 6, x + w - 8]) { rect(g, lx, y + h, 2, 104 - (y + h) - 2, PAL.metal[3]); rect(g, lx - 4, 102, 10, 2, PAL.metal[2]); px(g, lx - 4, 104, PAL.ink[0]); px(g, lx + 5, 104, PAL.ink[0]); }
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.metal[4]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.metal[2]); hline(g, x - 1, y - 1, w + 2, PAL.metal[6]);
  rect(g, x, y, w, h, '#f4f6f8');
  const cols = [['POR', 'HACER', PAL.blue[4]], ['EN', 'CURSO', PAL.gold[4]], ['BLOQ.', '', PAL.red[4]], ['HECHO', '', PAL.leaf[4]], ['HECHO', 'NO', PAL.purple[4]]];
  cols.forEach(([a, b, c], i) => {
    const cx = x + i * 20 + 1;
    rect(g, cx, y + 1, 19, 12, c); hline(g, cx, y + 1, 19, shade(c, 0.3));
    tiny(g, a, cx + 9, y + 2, PAL.ink[0], { align: 'center' });
    if (b) tiny(g, b, cx + 9, y + 7, i === 4 ? '#ffffff' : PAL.ink[0], { align: 'center' });
    if (i === 4) { hline(g, cx + 1, y + 4, 18, '#ffffff'); }   // «HECHO» tachado + «NO»: HECHO (PERO NO)
    if (i > 0) vline(g, cx - 1, y + 1, h - 2, PAL.metal[5]);
  });
  // pósits por columna
  const r = rng(27);
  const colores = [POSTIT.y, POSTIT.g, POSTIT.p, POSTIT.b, POSTIT.o];
  for (let i = 0; i < 5; i++) for (let k = 0; k < 3; k++) {
    if (i === 4 && k > 0) continue;
    if (i === 0 && k === 0) continue;
    const px0 = x + i * 20 + 3 + Math.floor(r() * 3), py0 = y + 15 + k * 10 + Math.floor(r() * 2);
    postit(g, px0, py0, colores[(i + k) % 5], { w: 13, h: 8 });
  }
  // «BAJA RUBÉN» en POR HACER desde julio (Acto III: pósit «descopeado» tras P14)
  const descopeado = !!view.flag('posit_descopeado');
  rect(g, x + 1, y + 15, 19, 12, descopeado ? POSTIT.g : POSTIT.p); hline(g, x + 1, y + 15, 19, '#ffffff');
  tiny(g, descopeado ? 'AQUÍ' : 'BAJA', x + 10, y + 16, PAL.ink[1], { align: 'center' });
  tiny(g, 'RUBÉN', x + 10, y + 21, descopeado ? PAL.ink[1] : PAL.red[2], { align: 'center' });
  // rotulador colgando
  line(g, x + w - 4, y + h, x + w - 6, y + h + 8, PAL.metal[3]); rect(g, x + w - 8, y + h + 8, 2, 5, PAL.blue[4]);
}
function drawPosit1998(g) {
  // el pósit amarillísimo de 1998 en HECHO (PERO NO): grande, amarillo saturado y con «1998» legible
  const x = 572, y = 49;
  rect(g, x, y, 19, 12, '#ffe830'); hline(g, x, y, 19, '#fffaa0'); hline(g, x, y + 11, 19, '#b8a010');
  tiny(g, '1998', x + 10, y + 3, PAL.ink[1], { align: 'center' });
  ditherOverlay(g, x, y + 8, 19, 3, '#c8b020', 0.5);
}

function drawRoom(g, v) {
  // relleno neutro fuera del tramo (ver maqueta)
  rect(g, 0, 0, W, 144, '#141220');
  techo(g);
  paredes(g);
  suelos(g, v);
  rotulos(g);
  mesaYoli(g);
  economia(g, v);
  infografia(g);
  desarrollo(g);
  // luz por zona: Economía fluorescente neutra, Infografía cálida, Desarrollo violeta tenue
  glow(g, 350, 40, 40, 30, '#f0fff8', 0.06, 3);
  glow(g, 432, 70, 44, 30, '#ffd890', 0.08, 3);
  glow(g, 560, 60, 70, 40, '#9a7ae0', 0.07, 3);
  fadeRows(g, X0, FL, X1 - X0, 6, PAL.ink[0], 0.3, 0, 3);
  vignette(g, 340, 144, 0.35, PAL.shadow, X0, 0);
}

const layout = {
  ordenador_bruno: { rect: [310, 42, 38, 50], walkTo: [330, 120], face: 'up', draw: drawOrdenadorBruno },
  silla_ramirez: { rect: [350, 82, 28, 30], walkTo: [362, 124], face: 'up', layer: 'sorted', zy: 110, draw: drawSillaRamirez },
  chaqueta_ramirez_hotspot: { rect: [354, 84, 20, 18], walkTo: [362, 124], face: 'up', priority: 1 },
  taza_abandonada: { rect: [364, 62, 18, 16], walkTo: [372, 120], face: 'up', draw: drawTaza },
  mesa_dibujo: { rect: [388, 56, 44, 38], walkTo: [408, 120], face: 'up', draw: drawMesaDibujo },
  herminia_portatil: { rect: [442, 56, 38, 26], walkTo: [460, 120], face: 'up', draw: drawHerminia },
  cartel_frontera: { rect: [454, 34, 38, 18], walkTo: [470, 118], face: 'up', draw: drawCartelFrontera },
  frontera_carrocero: { poly: [[478, 92], [486, 92], [502, 144], [492, 144]], walkTo: [490, 126], face: 'down', layer: 'back', draw: drawCinta },
  kanban: { rect: [488, 30, 108, 76], walkTo: [540, 124], face: 'up', layer: 'sorted', zy: 104, draw: drawKanban },
  posit_1998: { rect: [570, 46, 24, 18], walkTo: [578, 124], face: 'up', priority: 1, layer: 'sorted', zy: 105, draw: drawPosit1998 },
  // PNJ del tramo
  yoli_tendencias: { at: [304, 116, 'right'] },
  leoncio_quesitos: { at: [434, 114, 'down'], walkTo: [410, 126], face: 'right' },
  nerea_backlog: { at: [606, 114, 'left'], walkTo: [626, 124], face: 'left' },
};

export default {
  room: 'pecera',
  width: W,
  scale: { yFar: 96, far: 0.9, yNear: 142, near: 1.04 },
  // la franja transitable gana profundidad: de y 100 (al pie de las mesas) a 142; el kanban es un obstáculo exento
  walkboxes: [{ id: 'suelo', poly: [[4, 100], [486, 100], [486, 108], [596, 108], [596, 100], [796, 100], [798, 142], [2, 142]] }],
  entries: { vestibulo: [40, 118, 'right'] },
  layout,
  draw: drawRoom,
  dynamic: true,
};
export { X0, X1 };
void gradH; void bevel; void mix; void cable; void personBack; void jacketOn; void tinyW; void label;
