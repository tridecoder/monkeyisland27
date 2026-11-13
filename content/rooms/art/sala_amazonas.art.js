// SALA `sala_amazonas` — ARTE Y GEOMETRÍA (rediseño P4, docs/GUIA_REDISENO.md §5; portado de la prueba pintada
// docs/informes/propuesta/arte/sala_amazonas.propuesta.art.js con la ORDEN DE DIRECCIÓN (ii) aplicada).
// Biblia §3.6; adenda §3.9 y §11.3. Sala de reuniones «Amazonas» de la planta 1 (Dirección): papel pintado de selva,
// moqueta verde con ALFOMBRA DE REUNIÓN (canto dorado) y una mesa de nogal que cruza la sala.
//
//  · CABECERA a la DERECHA, contra el ventanal y bajo el downlight grande: el sillón burdeos ES DE GERVASIO. Preside
//    SENTADO en los Actos I-II; en el III está de pie junto a su sillón vacío. No hay ninguna placa «PRESIDENCIA».
//  · El LECTOR MEDIO (Acto III) es un expositor de Marketing aparcado a la IZQUIERDA de la pantalla de proyección,
//    delante del pie de la mesa, con su propio foco (penumbra + `luz: 1`). Nunca en la cabecera (≥ 186 px de ella).
//    Al empujarlo cae hacia la derecha, delante de la mesa, y los catorce botellines (que están justo ahí) vuelan.
//  · Estado «huida» (reunion_terminada, Actos I-II): sillas desordenadas, una volcada, papeles por el suelo; el
//    planillo queda en la mesa; el orden del día, tachado.
//  · Acto III: penumbra del motor (`penumbra`, nunca un overlay que oscurezca actores): quedan iluminados la pantalla
//    (diapositiva 247 → 248), el Lector Medio y, tenue, el sillón vacío. La tele, muerta; la caja de cables, quieta.
//  · Señalética común: placa «1 DIRECCIÓN ◄» del kit sobre la puerta (nunca «Pajarera»), marco y umbral de Dirección.
// Mobiliario que tapa actores: la mesa y las sillas cercanas las pinta el objeto `botellines` (`layer: 'sorted'`,
// `prop: true`); el sillón presidencial y las sillas lejanas son fondo (detrás de todo el que está de pie).
import {
  PAL, rect, hline, vline, frameRect, px, line, poly, ellipse, paint, bevel, ditherOverlay, gradV,
  glow, shadowEllipse, ditherPick, hash2, rng, fadeRows, vignette, cityWindow, wallClock, shade, label,
} from '../../../engine/draw.js';
import { POSTIT, JACKETS, chairBack, blinds, rainOnGlass, rainyGlassStatic, cable } from './lib-oficina.js';
import { paperDoll, getFrame } from '../../../engine/sprites.js';
import * as kit from '../../lib/kit.js';

const W = 320, FL = 96;
const PANT = { x: 122, y: 22, w: 120, h: 40 };          // pantalla del orden del día / proyección
const VENT = { x: 282, y: 18, w: 38, h: 50 };           // ventanal tras la cabecera
const TELE = { x: 248, y: 19, w: 28, h: 19 };           // tele de videollamadas en su brazo (credencia debajo)
const MESA = { fx0: 96, fx1: 272, fy: 82, nx0: 86, nx1: 282, ny: 96, panel: 7 };   // canto lejano, cercano, faldón
const CAB = 284;                                         // x de la cabecera (sillón de Gervasio)
const TAB = { x: 38, y: 57, w: 74, h: 35 };             // tablón de los carteles en guerra
// pies del Lector Medio (Acto III): EXPOSITOR DE MARKETING a la izquierda de la pantalla (x 118-246), delante del pie de
// la mesa, con su propio foco. NUNCA en la cabecera ni junto a una placa de presidencia (orden de dirección ii).
export const LECTOR_AT = [100, 120];
const BOT = { x: 116, y: 81 };                           // los catorce botellines (x 116-171), junto a la caída
const a3 = (v) => !!v.flag('acto_3_iniciado');
const huida = (v) => !!v.flag('reunion_terminada') && !a3(v);

// ------------------------------------------------------------------ utilidades
function hoja(g, x, y, len, ang, cs, seed) {
  // hoja de monstera/palma: perfil seno, nervio central claro y cortes
  const ca = Math.cos(ang), sa = Math.sin(ang);
  for (let k = 0; k < len; k++) {
    const wd = Math.sin((k / len) * Math.PI) * len * 0.34 + 0.5;
    for (let s = -wd; s <= wd; s += 0.5) {
      const xx = Math.round(x + ca * k - sa * s), yy = Math.round(y + sa * k + ca * s);
      if ((k % 7 === 3) && Math.abs(s) > wd * 0.45) continue;
      px(g, xx, yy, s < 0 ? cs[2] : (hash2(xx, yy, seed) < 0.1 ? cs[0] : cs[1]));
    }
    px(g, Math.round(x + ca * k), Math.round(y + sa * k), cs[3]);
  }
}
const cacheStore = {};
/** Pinta `fn` una vez en un lienzo propio (clave → lienzo) y lo copia: lo que no cambia con el tiempo. */
function cached(key, x, y, w, h, fn) {
  return (g) => {
    let c = cacheStore[key];
    if (!c) {
      c = document.createElement('canvas'); c.width = w; c.height = h;
      const cg = c.getContext('2d'); cg.translate(-x, -y); fn(cg);
      cacheStore[key] = c;
    }
    g.drawImage(c, x, y);
  };
}
const TEAL = [PAL.teal[0], PAL.teal[1], PAL.teal[2], PAL.teal[3], PAL.teal[4]];
function sillaFrente(g, cx, by, o = {}) {
  // silla de la cara lejana vista de frente (respaldo alto acolchado); by = suelo (tapado por la mesa)
  const c = o.col || TEAL;
  const t = by - 30 + (o.dy || 0);
  const sk = o.giro || 0;
  poly(g, [[cx - 7 + sk, t], [cx + 7 + sk, t], [cx + 8, t + 16], [cx - 8, t + 16]], (xx, yy) => ditherPick(xx, yy, [c[1], c[2], c[3]], 0.35 + (xx - cx) / 30 + (yy - t) / 60));
  hline(g, cx - 6 + sk, t, 13, c[4]); hline(g, cx - 7 + sk, t + 1, 15, c[3]);
  vline(g, cx - 8, t + 4, 12, c[0]); vline(g, cx + 8, t + 4, 12, c[0]);
  for (let i = 0; i < 3; i++) hline(g, cx - 5 + sk, t + 4 + i * 4, 11, c[1]);
  rect(g, cx - 1, t + 16, 3, 4, PAL.metal[2]);
  rect(g, cx - 8, t + 19, 17, 3, c[2]); hline(g, cx - 8, t + 19, 17, c[4]);
}
function sillaVolcada(g, x, y) {
  shadowEllipse(g, x + 10, y + 2, 13, 2, 0.7);
  rect(g, x, y - 5, 16, 6, PAL.teal[2]); hline(g, x, y - 5, 16, PAL.teal[4]); hline(g, x, y, 16, PAL.teal[0]);
  for (let i = 0; i < 3; i++) hline(g, x + 2, y - 4 + i * 2, 12, PAL.teal[1]);
  rect(g, x + 16, y - 9, 4, 10, PAL.teal[1]); vline(g, x + 16, y - 9, 10, PAL.teal[3]);
  line(g, x + 4, y - 6, x + 1, y - 13, PAL.metal[3]); line(g, x + 8, y - 6, x + 9, y - 14, PAL.metal[4]);
  line(g, x + 6, y - 6, x + 5, y - 14, PAL.metal[4]);
  px(g, x + 1, y - 14, PAL.ink[0]); px(g, x + 9, y - 15, PAL.ink[0]); px(g, x + 5, y - 15, PAL.ink[0]);
}

// ------------------------------------------------------------------ fondo
function techo(g, v) {
  gradV(g, 0, 0, W, 14, [PAL.ink[0], PAL.ink[1], PAL.metal[1]]);
  for (let x = 0; x < W; x += 20) vline(g, x, 0, 13, PAL.ink[0]);
  hline(g, 0, 6, W, PAL.ink[0]); hline(g, 0, 13, W, PAL.ink[1]);
  ditherOverlay(g, 0, 0, W, 13, PAL.metal[3], 0.08);
  // downlights; el de la cabecera, más grande (es el sillón de Gervasio)
  for (const x of [52, 214]) { ellipse(g, x, 11, 6, 2, PAL.metal[5]); ellipse(g, x, 11, 4, 1, a3(v) ? PAL.metal[3] : '#fff8e0'); }
  ellipse(g, CAB, 11, 8, 2.4, PAL.metal[5]); ellipse(g, CAB, 11, 6, 1.4, a3(v) ? '#c8b890' : '#fff4d0');
  // carril con el foco orientable del expositor (Marketing lo dejó para «su» Lector)
  rect(g, 84, 3, 34, 2, PAL.metal[3]); hline(g, 84, 3, 34, PAL.metal[5]);
  rect(g, 104, 5, 2, 3, PAL.metal[3]);
  poly(g, [[101, 7], [108, 7], [110, 12], [99, 12]], PAL.ink[2]); hline(g, 100, 12, 10, a3(v) ? '#fff0c8' : PAL.metal[4]);
  // soporte del proyector
  rect(g, 182, 0, 2, 4, PAL.metal[3]);
}
function pared(g) {
  paint(g, 0, 14, W, 48, (x, y) => {
    const t = (y - 14) / 48;
    const n = hash2(x >> 2, y >> 2, 31);
    return ditherPick(x, y, [PAL.green[2], PAL.green[3], PAL.green[4]], 0.75 - t * 0.35 + (n < 0.07 ? -0.15 : 0));
  });
  const r = rng(77);
  for (let i = 0; i < 9; i++) { const x = 8 + Math.floor(r() * 300); hoja(g, x, 22 + Math.floor(r() * 30), 7 + Math.floor(r() * 4), r() * 3, [PAL.green[3], PAL.green[3], PAL.green[2], PAL.green[4]], i); }
  // friso de selva (papel pintado «Amazonas»): banda y 62-92 bajo moldura de madera
  paint(g, 0, 62, W, 30, (x, y) => ditherPick(x, y, [PAL.leaf[0], PAL.leaf[1], PAL.leaf[2]], 0.35 + (y - 62) / 80));
  const r2 = rng(909);
  for (let i = 0; i < 46; i++) {
    const x = Math.floor(r2() * W), y = 64 + Math.floor(r2() * 28);
    hoja(g, x, y, 8 + Math.floor(r2() * 9), -0.6 - r2() * 2.0, [PAL.leaf[2], PAL.leaf[3], PAL.leaf[1], PAL.leaf[5]], i);
  }
  // loros (dos manchitas de color: la sala tiene humor)
  for (const [x, y, c] of [[214, 70, PAL.red[4]], [26, 86, PAL.gold[5]]]) { rect(g, x, y, 3, 2, c); px(g, x + 3, y, PAL.gold[6]); px(g, x - 1, y + 2, shade(c, -0.3)); }
  rect(g, 0, 60, W, 2, PAL.wood[5]); hline(g, 0, 60, W, PAL.wood[6]); hline(g, 0, 62, W, PAL.wood[1]);
  // filete de Dirección (latón) sobre la moldura y zócalo
  hline(g, 0, 59, W, shade(kit.DEPTO.direccion.c, -0.2));
  rect(g, 0, 92, W, 4, PAL.wood[2]); hline(g, 0, 92, W, PAL.wood[4]); hline(g, 0, 95, W, PAL.ink[0]);
}
function suelo(g, v) {
  // moqueta verde de la sala + ALFOMBRA DE REUNIÓN con canto dorado (zona de reunión; el perímetro es zona de paso)
  paint(g, 0, FL, W, 144 - FL, (x, y) => {
    const t = (y - FL) / 48;
    const n = hash2(x, y, 5);
    return ditherPick(x, y, ['#183a2c', '#21483a', '#2a5646', '#336252'], 0.15 + t * 0.7 + (n < 0.05 ? -0.2 : 0));
  });
  const q = [[70, 99], [300, 99], [314, 126], [56, 126]];
  poly(g, q, (x, y) => ditherPick(x, y, ['#2a2418', '#3a2e1c', '#463624'], 0.3 + (y - 99) / 60 + (hash2(x >> 1, y, 8) < 0.06 ? 0.2 : 0)));
  for (const [a, b] of [[q[0], q[1]], [q[3], q[2]], [q[0], q[3]], [q[1], q[2]]]) line(g, a[0], a[1], b[0], b[1], PAL.gold[3]);
  line(g, 59, 123, 311, 123, PAL.gold[2]);
  // migas y papeles (reunión eterna)
  const r = rng(808);
  for (let i = 0; i < 14; i++) { const x = 10 + Math.floor(r() * 300), y = 128 + Math.floor(r() * 14); ditherOverlay(g, x, y, 3 + Math.floor(r() * 4), 1, PAL.ink[0], 0.35); }
  for (let i = 0; i < 4; i++) { const x = 40 + Math.floor(r() * 240), y = 130 + Math.floor(r() * 10); rect(g, x, y, 4, 2, PAL.paper[6]); px(g, x + 3, y + 1, PAL.paper[4]); }
  if (huida(v)) {        // papeles de la huida, un vaso tumbado y una carpeta abierta
    for (let i = 0; i < 11; i++) { const x = 64 + Math.floor(r() * 230), y = 118 + Math.floor(r() * 22); rect(g, x, y, 5, 3, PAL.paper[7]); hline(g, x, y + 2, 5, PAL.paper[4]); px(g, x + 1, y + 1, PAL.ink[3]); }
    rect(g, 232, 132, 4, 3, PAL.teal[6]); px(g, 236, 133, PAL.white); ditherOverlay(g, 236, 134, 8, 2, PAL.teal[5], 0.5);
    poly(g, [[200, 136], [212, 134], [214, 139], [202, 141]], PAL.blue[4]); hline(g, 203, 138, 9, PAL.paper[6]);
  }
  ditherOverlay(g, 0, FL, W, 3, PAL.ink[0], 0.5);
  // UMBRAL de la puerta (color del destino: Dirección)
  kit.umbral(g, 4, 98, 36, 6, kit.DEPTO.direccion.c);
}
function puerta(g) {
  const x = 8, y = 30, w = 28, h = 62;
  kit.marcoPuerta(g, x, y, w, h, { ramp: PAL.wood });
  kit.huecoAbierto(g, x, y, w, h, { luz: '#ffd890', suelo: ['#3a2a1c', '#5a3a24'], hoja: PAL.wood });
  // al fondo, Dirección: la mesa RESERVADO y una lámpara de nogal
  rect(g, x + 4, y + 40, 14, 8, PAL.wood[3]); hline(g, x + 4, y + 40, 14, PAL.wood[5]); rect(g, x + 8, y + 37, 6, 3, PAL.paper[6]);
  vline(g, x + 15, y + 22, 14, PAL.wood[2]); poly(g, [[x + 12, y + 22], [x + 18, y + 22], [x + 19, y + 26], [x + 11, y + 26]], PAL.gold[4]);
  glow(g, x + 15, y + 26, 8, 6, '#ffe0a0', 0.25, 3);
  // cuña que la mantiene abierta (nadie la usa)
  poly(g, [[x + 2, y + h + 1], [x + 9, y + h + 1], [x + 9, y + h + 3], [x, y + h + 3]], PAL.wood[5]);
  // placa común de destino: «1 DIRECCIÓN ◄» (nombre llano, orden de dirección i)
  kit.placaSala(g, 4, 14, 'pajarera', { flecha: '<' });
}
function cartelSalida(g) {
  const x = 44, y = 30, w = 58, h = 26;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.45);
  rect(g, x, y, w, h, PAL.paper[7]); frameRect(g, x, y, w, h, PAL.red[3]); frameRect(g, x + 1, y + 1, w - 2, h - 2, PAL.red[5]);
  label(g, 'SALIDA:', x + (w >> 1), y - 1, PAL.red[3], { align: 'center' });
  kit.micro(g, 'AL TERMINAR EL', x + (w >> 1), y + 12, PAL.ink[2], { align: 'center' });
  kit.micro(g, 'ORDEN DEL DÍA', x + (w >> 1), y + 19, PAL.ink[2], { align: 'center' });
  poly(g, [[x - 5, y + 21], [x - 1, y + 18], [x - 1, y + 24]], PAL.red[3]);    // flecha a la puerta
  for (const cx of [x - 1, x + w - 6]) rect(g, cx, y - 1, 7, 2, '#d8cfa0');
}
function tablonGuerra(g) {
  // tablón de corcho con la GUERRA DE CARTELES: tazas, vending y reservas de sala, uno encima de otro sin taparse el texto
  const { x, y, w, h } = TAB;
  rect(g, x - 1, y - 1, w + 2, h + 2, PAL.wood[1]); rect(g, x, y, w, h, PAL.wood[4]);
  ditherOverlay(g, x, y, w, h, PAL.wood[2], 0.35);
  const hojas = [
    [x + 1, y + 1, 36, 11, PAL.gold[6], ['NO DEJÉIS', 'TAZAS'], PAL.ink[2]],
    [x + 37, y + 1, 36, 11, PAL.paper[7], ['Y DÓNDE', 'LAS DEJO?'], PAL.blue[3]],
    [x + 1, y + 12, 36, 11, '#f4c0c8', ['NO ES EL', 'VENDING'], PAL.red[3]],
    [x + 37, y + 12, 36, 11, PAL.teal[6], ['QUIÉN', 'CAMBIÓ?'], PAL.ink[2]],
    // reservas de sala, en guerra: la hoja impresa (Ramírez, viernes 20:59) y la réplica a mano de Íñigo
    [x + 1, y + 23, 36, 11, PAL.paper[6], ['RESERVA:', 'VIE 20:59'], PAL.ink[2]],
    [x + 37, y + 23, 36, 11, POSTIT.o, ['CARTEL', 'RESERVADO'], PAL.ink[2]],
  ];
  for (const [hx, hy, hw, hh, c, ls, ink] of hojas) {
    ditherOverlay(g, hx + 1, hy + 1, hw, hh, PAL.shadow, 0.5);
    rect(g, hx, hy, hw, hh, c); hline(g, hx, hy, hw, shade(c, 0.25)); hline(g, hx, hy + hh - 1, hw, shade(c, -0.25));
    ls.forEach((s, i) => kit.micro(g, s, hx + (hw >> 1), hy + 1 + i * 5 + (i ? 0 : 0), ink, { align: 'center' }));
    px(g, hx + (hw >> 1), hy - 1, PAL.red[4]);
    kit.registro.add('texto', hx, hy, hw, hh, ls.join(' '));
  }
  // flecha de réplica entre carteles
  line(g, x + 35, y + 6, x + 39, y + 6, PAL.red[4]); px(g, x + 38, y + 5, PAL.red[4]); px(g, x + 38, y + 7, PAL.red[4]);
}
function pantallaMarco(g) {
  const { x, y, w, h } = PANT;
  ditherOverlay(g, x - 1, y + h + 3, w + 4, 2, PAL.ink[0], 0.5);
  rect(g, x - 3, y - 3, w + 6, h + 6, PAL.metal[5]); frameRect(g, x - 3, y - 3, w + 6, h + 6, PAL.metal[2]);
  hline(g, x - 2, y - 2, w + 4, PAL.metal[7]);
  rect(g, x + (w >> 1) - 8, y + h + 3, 16, 2, PAL.metal[3]);   // altavoz de la sala
}
function ventanal(g) {
  const { x, y, w, h } = VENT;
  cityWindow(g, x, y, w, h, { sky: 'night', seed: 44, mullions: true });
  rainyGlassStatic(g, x, y, w, h, 7);
  blinds(g, x, y + 1, w, h, { down: 10, color: PAL.paper });
}
function sillasLejanas(g, v) {
  const xs = [120, 146, 172, 198, 224, 250];
  xs.forEach((cx, i) => {
    if (huida(v)) { if (i === 2) return; sillaFrente(g, cx + (i % 2 ? 4 : -3), FL + 2, { giro: i % 2 ? 2 : -2, dy: i === 4 ? 3 : 0 }); }
    else sillaFrente(g, cx, FL + 2);
  });
}
function sillonPresidencial(g) {
  // el sillón de la cabecera (cuero burdeos, respaldo alto con remaches): de Gervasio. En el Acto III, vacío.
  const x = CAB, by = 104;
  const R = PAL.red;
  shadowEllipse(g, x, by, 12, 2, 0.7);
  rect(g, x - 9, by - 50, 18, 34, R[2]);
  paint(g, x - 8, by - 49, 16, 32, (xx, yy) => ditherPick(xx, yy, [R[1], R[2], R[3]], 0.6 - (xx - x) / 24 + (hash2(xx, yy, 2) - 0.5) * 0.2));
  hline(g, x - 8, by - 50, 16, R[4]); vline(g, x + 8, by - 49, 33, R[0]); vline(g, x - 9, by - 49, 33, R[3]);
  for (let i = 0; i < 6; i++) px(g, x - 7 + i * 3, by - 47, PAL.gold[5]);
  for (let i = 0; i < 3; i++) hline(g, x - 6, by - 42 + i * 8, 13, R[1]);                  // capitoné
  rect(g, x - 9, by - 18, 18, 5, R[2]); hline(g, x - 9, by - 18, 18, R[4]); hline(g, x - 9, by - 14, 18, R[0]);
  rect(g, x - 1, by - 13, 2, 8, PAL.metal[3]);
  hline(g, x - 7, by - 3, 15, PAL.metal[4]); px(g, x - 7, by - 2, PAL.ink[0]); px(g, x + 7, by - 2, PAL.ink[0]);
}
function proyectorCuerpo(g) {
  const x = 175, y = 4;
  bevel(g, x, y, 16, 7, PAL.paper[4], PAL.paper[6], PAL.paper[2]);
  rect(g, x + 2, y + 2, 4, 3, PAL.ink[1]); ellipse(g, x + 4, y + 3, 1.5, 1.5, PAL.metal[1]);
  px(g, x + 12, y + 2, PAL.red[1]);
}
function credencia(g) {
  // brazo de pared de la tele + CREDENCIA baja (la caja de cables vive encima)
  const { x, y, w, h } = TELE;
  rect(g, x + (w >> 1) - 1, y + h, 3, 4, PAL.metal[2]);
  const cx = 244, cy = 64;
  shadowEllipse(g, cx + 18, FL, 22, 2, 0.6);
  rect(g, cx, cy, 36, 18, PAL.wood[3]); hline(g, cx, cy, 36, PAL.wood[6]); hline(g, cx, cy + 1, 36, PAL.wood[5]);
  vline(g, cx + 17, cy + 3, 14, PAL.wood[1]); rect(g, cx + 8, cy + 9, 4, 1, PAL.gold[4]); rect(g, cx + 24, cy + 9, 4, 1, PAL.gold[4]);
  rect(g, cx + 2, cy + 18, 2, 14, PAL.wood[1]); rect(g, cx + 32, cy + 18, 2, 14, PAL.wood[1]);
}

function drawRoom(g, v) {
  techo(g, v);
  pared(g);
  suelo(g, v);
  puerta(g);
  cartelSalida(g);
  tablonGuerra(g);
  wallClock(g, 111, 36, 6);
  credencia(g);
  pantallaMarco(g);
  ventanal(g);
  sillasLejanas(g, v);
  sillonPresidencial(g);
  proyectorCuerpo(g);
  if (!a3(v)) { glow(g, 52, 30, 30, 22, '#fff4d8', 0.08); glow(g, 214, 30, 40, 20, '#fff4d8', 0.06); glow(g, CAB, 40, 26, 30, '#fff0c8', 0.1, 3); }
  else {
    // Acto III: el foco del expositor (cono cálido hasta el suelo) y el charco de luz bajo el sillón vacío
    g.save(); g.globalAlpha = 0.1;
    poly(g, [[101, 12], [109, 12], [124, 124], [80, 124]], '#fff0c8');
    g.restore();
    glow(g, LECTOR_AT[0], LECTOR_AT[1], 22, 5, '#fff0c8', 0.22, 3);
    glow(g, CAB, 104, 16, 4, '#fff0c8', 0.14, 3);
  }
  fadeRows(g, 0, FL, W, 6, PAL.ink[0], 0.3, 0, 3);
  vignette(g, W, 144, 0.36);
}

// ------------------------------------------------------------------ objetos
const DIAPO = { t0: null };
function drawOrden(g, view, t) {
  const { x, y, w, h } = PANT;
  if (a3(view)) {
    // proyección: diapositiva 247 de 400 (o 248, adenda 9.5). El número va GRANDE en la barra y la 248 es OTRA
    // diapositiva (azul noche, una carretera que se pierde, rótulo dorado): el salto se ve sin leer el número.
    const s248 = /248/.test(String(view.objState('proyector') ?? ''));
    if (s248) { if (DIAPO.t0 == null || t < DIAPO.t0) DIAPO.t0 = t; } else DIAPO.t0 = null;
    if (!s248) {
      rect(g, x, y, w, h, '#eef2f4');
      rect(g, x, y, w, 10, PAL.blue[3]);
      kit.micro(g, 'ELCONTABLE.ES', x + 3, y + 3, PAL.paper[7]);
      label(g, '247/400', x + w - 3, y - 1, PAL.gold[6], { align: 'right' });
      label(g, 'SINERGIAS', x + (w >> 1), y + 9, PAL.blue[3], { align: 'center' });
      kit.micro(g, 'EXPONENCIALES:', x + (w >> 1), y + 23, PAL.red[3], { align: 'center' });
      kit.micro(g, 'EL VIAJE', x + (w >> 1), y + 30, PAL.ink[2], { align: 'center' });
      for (let i = 0; i < 6; i++) rect(g, x + 8 + i * 3, y + 35 - ((i * i) >> 3), 2, 2, PAL.teal[4]);
      for (let i = 0; i < 6; i++) rect(g, x + w - 26 + i * 3, y + 35 - ((i * i) >> 3), 2, 2, PAL.gold[4]);
      ditherOverlay(g, x, y, w, 3, '#ffffff', 0.12);
      return;
    }
    gradV(g, x, y, w, h, [PAL.night[2], PAL.night[3], PAL.dusk[3]]);
    rect(g, x, y, w, 10, PAL.gold[4]);
    kit.micro(g, 'ELCONTABLE.ES', x + 3, y + 3, PAL.ink[1]);
    label(g, '248/400', x + w - 3, y - 1, PAL.red[2], { align: 'right' });
    poly(g, [[x + 48, y + h], [x + 72, y + h], [x + 61, y + 29], [x + 59, y + 29]], PAL.ink[2]);
    for (let k = 0; k < 3; k++) rect(g, x + 60, y + 31 + k * 3, 1, 2, PAL.gold[6]);
    hline(g, x, y + 29, w, PAL.dusk[5]);
    label(g, 'EL VIAJE', x + (w >> 1), y + 8, PAL.gold[6], { align: 'center' });
    label(g, 'CONTINÚA', x + (w >> 1), y + 17, PAL.gold[6], { align: 'center' });
    const k = DIAPO.t0 == null ? 1 : (t - DIAPO.t0) / 380;
    if (k < 1) { g.save(); g.globalAlpha = 0.85 * (1 - k); g.fillStyle = '#ffffff'; g.fillRect(x, y, w, h); g.restore(); }
    return;
  }
  const done = !!view.flag('reunion_terminada');
  rect(g, x, y, w, h, PAL.paper[7]);
  rect(g, x, y, w, 8, PAL.blue[4]);
  kit.micro(g, 'ORDEN DEL DÍA', x + (w >> 1), y + 2, PAL.paper[7], { align: 'center' });
  ['1. PREVISIÓN', '2. PREVISIÓN DE LA PREVISIÓN', '3. SIGUIENTES PASOS'].forEach((s, i) => {
    const ly = y + 12 + i * 9;
    kit.micro(g, s, x + 6, ly, PAL.ink[2]);
    if (done) { hline(g, x + 4, ly + 2, kit.microW(s) + 4, PAL.red[3]); hline(g, x + 4, ly + 3, kit.microW(s) + 4, PAL.red[4]); }
  });
  if (!done) { ellipse(g, x + w - 14, y + 31, 4, 3, PAL.wood[5]); ellipse(g, x + w - 14, y + 31, 2, 1, PAL.wood[3]); }
  else kit.micro(g, 'FIN', x + w - 16, y + 30, PAL.red[3]);
  if ((Math.floor(t / 700) & 1) === 0) px(g, x + w - 4, y + h - 3, PAL.crt[4]);
  ditherOverlay(g, x, y, w, 3, '#ffffff', 0.12);
}
function drawProyector(g, view, t) {
  const x = 175, y = 4;
  rect(g, x + 2, y + 2, 4, 3, '#fffbe0'); glow(g, x + 4, y + 4, 8, 6, '#ffffff', 0.4, 3);
  px(g, x + 12, y + 2, (Math.floor(t / 500) & 1) ? '#ff4030' : PAL.red[1]);
  // haz de la lente a los cuatro lados de la pantalla: no toca ni al Lector ni la cabecera
  g.save(); g.globalAlpha = 0.12;
  poly(g, [[x + 3, y + 4], [x + 5, y + 4], [PANT.x + PANT.w, PANT.y + PANT.h], [PANT.x, PANT.y + PANT.h]], '#fffbe8');
  g.globalAlpha = 0.08; poly(g, [[x + 3, y + 4], [x + 5, y + 4], [PANT.x + PANT.w, PANT.y], [PANT.x, PANT.y]], '#fffbe8');
  g.restore();
  for (let i = 0; i < 7; i++) { const k = (t / 40 + i * 37) % 40; px(g, 150 + ((i * 23) % 70), 10 + (k | 0) % 14, '#fffbe8'); }
}

// La MESA (nogal, cruza la sala) y las sillas cercanas de espaldas: mueble que tapa a quien está detrás (Gervasio
// sentado, los figurantes). Se pinta con el objeto `botellines` (capa ordenada), una vez por estado.
function mesa(g, modo) {
  const Wd = PAL.wood;
  const { fx0, fx1, fy, nx0, nx1, ny, panel } = MESA;
  shadowEllipse(g, (nx0 + nx1) / 2, ny + panel + 3, (nx1 - nx0) / 2 + 4, 3, 0.75);
  poly(g, [[fx0, fy], [fx1, fy], [nx1, ny], [nx0, ny]], (xx, yy) => {
    const t = (yy - fy) / (ny - fy);
    const veta = ((yy * 7 + (xx >> 3)) % 11 === 0) ? -0.12 : 0;
    return ditherPick(xx, yy, [Wd[2], Wd[3], Wd[4], Wd[5]], 0.25 + t * 0.55 + veta);
  });
  hline(g, fx0, fy, fx1 - fx0, Wd[6]); hline(g, nx0, ny, nx1 - nx0, Wd[7]);
  if (modo !== 'a3') { ditherOverlay(g, 190, fy + 2, 60, 2, '#fff4c8', 0.35); ditherOverlay(g, 120, fy + 7, 50, 2, '#fff4c8', 0.2); }
  ditherOverlay(g, 246, fy + 3, 34, 6, '#fff0c0', modo === 'a3' ? 0.12 : 0.25);     // la cabecera, bajo su downlight
  // faldón frontal: tapa las piernas de quien se sienta detrás
  gradV(g, nx0, ny + 1, nx1 - nx0, panel, [Wd[3], Wd[2], Wd[1]]);
  hline(g, nx0, ny + 1, nx1 - nx0, Wd[1]);
  for (let x = nx0 + 20; x < nx1 - 10; x += 32) vline(g, x, ny + 2, panel - 2, Wd[1]);
  rect(g, nx0, ny + 1, 3, panel + 2, Wd[1]); rect(g, nx1 - 3, ny + 1, 3, panel + 2, Wd[0]);
  // canto de la cabecera (lado derecho visto)
  poly(g, [[fx1, fy], [nx1, ny], [nx1, ny + panel], [fx1 + 2, fy + panel - 2]], (xx, yy) => ditherPick(xx, yy, [Wd[1], Wd[2]], 0.5));
  // araña de conferencias y cajas de conexión
  ellipse(g, 186, 89, 6, 2, PAL.ink[1]); px(g, 186, 88, PAL.metal[5]); px(g, 182, 89, PAL.metal[4]); px(g, 190, 89, PAL.metal[4]);
  rect(g, 232, 92, 4, 2, PAL.ink[2]);
  if (modo === 'reunion') {
    // carpetas, vasos y un portátil de Mercados con un gráfico que baja
    for (const [x, y] of [[178, 86], [256, 89]]) { rect(g, x, y, 10, 4, PAL.paper[7]); hline(g, x, y + 3, 10, PAL.paper[4]); }
    for (const x of [176, 228]) { rect(g, x, 83, 3, 4, PAL.teal[6]); hline(g, x, 83, 3, '#ffffff'); }
    rect(g, 236, 79, 12, 6, PAL.metal[2]); rect(g, 237, 80, 10, 4, PAL.blue[6]); line(g, 238, 81, 246, 83, PAL.red[4]);
    poly(g, [[234, 85], [250, 85], [252, 87], [232, 87]], PAL.metal[4]);
  } else if (modo === 'huida') {
    // la huida: carpetas abiertas, un vaso volcado, una silla de menos y la reunión ida
    for (const [x, y] of [[178, 87], [214, 85]]) { poly(g, [[x, y], [x + 10, y - 1], [x + 12, y + 3], [x + 2, y + 4]], PAL.paper[7]); hline(g, x + 2, y + 3, 9, PAL.paper[4]); }
    rect(g, 236, 88, 5, 2, PAL.teal[6]); ditherOverlay(g, 240, 89, 10, 2, PAL.teal[5], 0.5);
  } else {
    // Acto III: el portátil de Íñigo en el extremo, cables hacia el proyector
    rect(g, 230, 80, 14, 7, PAL.metal[5]); rect(g, 231, 81, 12, 5, '#cfe4ff'); poly(g, [[228, 87], [246, 87], [248, 89], [226, 89]], PAL.metal[6]);
    cable(g, 246, 88, 262, 90, 2, PAL.ink[0], 10);
  }
  // sillas del lado cercano, de espaldas (tapan el faldón)
  const col = TEAL;
  if (modo === 'huida') {
    chairBack(g, 116, 121, { col, turn: -1 }); chairBack(g, 190, 125, { col, turn: 1 }); chairBack(g, 248, 118, { col, turn: -1 });
    sillaVolcada(g, 146, 122);
  } else if (modo === 'a3') {
    for (const cx of [196, 232, 262]) chairBack(g, cx, 116, { col });       // las de la izquierda, apartadas para la presentación
  } else {
    for (const cx of [128, 166, 204, 242]) chairBack(g, cx, 116, { col });
  }
}
const mesaCache = { reunion: null, huida: null, a3: null };
function drawMesa(g, view) {
  const modo = a3(view) ? 'a3' : huida(view) ? 'huida' : 'reunion';
  if (!mesaCache[modo]) mesaCache[modo] = cached('sala-mesa-' + modo, 76, 60, 220, 70, (cg) => mesa(cg, modo));
  mesaCache[modo](g);
}

// ------------------------------------------------------------------ los catorce botellines (estado del objeto)
//   'en_fila'  catorce botellines sin abrir, alineados en el pie de la mesa
//   'volando'  el ¡PLOF! del Lector Medio: saltan en abanico (fotogramas por tiempo desde que entra el estado)
//   'tumbados' después: tumbados por la mesa, uno en pie, tres en el suelo (estos, en `animate`) y un charco
function botellin(g, bx, by) {
  rect(g, bx, by + 2, 3, 8, PAL.teal[5]); vline(g, bx, by + 2, 8, PAL.teal[7]); vline(g, bx + 2, by + 3, 7, PAL.teal[3]);
  rect(g, bx + 1, by, 1, 2, PAL.teal[6]); px(g, bx + 1, by - 1, PAL.white);
  hline(g, bx, by + 5, 3, PAL.paper[6]);
}
function botellinTumbado(g, bx, by, izq) {
  rect(g, bx, by, 7, 3, PAL.teal[5]); hline(g, bx, by, 7, PAL.teal[7]); hline(g, bx, by + 2, 7, PAL.teal[3]);
  vline(g, bx + 3, by, 3, PAL.paper[6]);
  if (izq) { rect(g, bx - 2, by + 1, 2, 1, PAL.teal[6]); px(g, bx - 3, by + 1, PAL.white); }
  else { rect(g, bx + 7, by + 1, 2, 1, PAL.teal[6]); px(g, bx + 9, by + 1, PAL.white); }
}
const VUELO = { t0: null };
function drawBotellines(g, view, t) {
  drawMesa(g, view);
  const st = String(view.state || 'en_fila');
  if (st === 'volando') {
    if (VUELO.t0 == null || t < VUELO.t0) VUELO.t0 = t;
    const p = Math.min(1, (t - VUELO.t0) / 650);
    for (let i = 0; i < 14; i++) {
      const bx0 = BOT.x + i * 4, dir = (i - 4) / 7;
      const h = 12 + ((i * 7) % 11);
      const x = Math.round(bx0 + dir * 30 * p), y = Math.round(BOT.y - Math.sin(p * Math.PI) * h + (i % 3 === 0 ? p * 30 : p * 4));
      if ((i + Math.floor(t / 70)) & 1) botellin(g, x, y); else botellinTumbado(g, x - 2, y + 4, i & 1);
    }
    // salpicaduras
    for (let i = 0; i < 6; i++) px(g, BOT.x + 10 + i * 7, Math.round(BOT.y - 4 - Math.sin(p * Math.PI + i) * 6), PAL.teal[7]);
    return;
  }
  VUELO.t0 = null;
  if (st === 'tumbados') {
    const r = rng(1406);
    for (let i = 0; i < 10; i++) botellinTumbado(g, 112 + Math.floor(r() * 84), 84 + Math.floor(r() * 9), r() < 0.5);
    botellin(g, 182, 82);                                                   // el único que aguanta en pie (de Mercados)
    ditherOverlay(g, 128, 91, 46, 3, PAL.teal[6], 0.45);                    // charco
    return;
  }
  for (let i = 0; i < 14; i++) botellin(g, BOT.x + i * 4, BOT.y);
}
function drawBotellinesSuelo(g, view) {
  if (String(view.objState('botellines') || '') !== 'tumbados') return;
  botellinTumbado(g, 176, 116, false); botellinTumbado(g, 196, 130, true); botellinTumbado(g, 214, 138, false);
}
function drawCruasanes(g) {
  const x = 196, y = 85;
  ellipse(g, x + 13, y + 4, 14, 3, PAL.metal[4]); ellipse(g, x + 13, y + 3, 13, 2, PAL.metal[7]);
  ellipse(g, x + 8, y + 2, 4, 1.8, PAL.gold[4]); px(g, x + 6, y + 1, PAL.gold[6]); px(g, x + 10, y + 2, PAL.gold[2]);   // medio cruasán
  for (let i = 0; i < 10; i++) px(g, x + 3 + Math.floor(hash2(i, 1, 4) * 20), y + 2 + Math.floor(hash2(i, 2, 4) * 3), PAL.gold[2 + (i % 3)]);
  kit.cantoVivo(g, x + 1, y + 1, 26, 5);
}
function drawPlanillo(g) {
  const x = 90, y = 88;
  poly(g, [[x + 2, y], [x + 20, y], [x + 22, y + 6], [x, y + 6]], PAL.paper[7]);
  hline(g, x, y + 6, 22, PAL.paper[3]);
  for (let i = 0; i < 4; i++) vline(g, x + 5 + i * 4, y, 6, PAL.blue[5]);
  hline(g, x + 1, y + 3, 20, PAL.blue[5]);
  rect(g, x + 7, y + 1, 4, 2, PAL.red[3]); rect(g, x + 13, y + 4, 4, 2, PAL.teal[5]);
  kit.cantoVivo(g, x, y, 23, 7);
}

// tele de videollamadas (objeto): canales según tele_n; en el Acto III, muerta (el objeto se oculta, el aparato no)
function drawTele(g, view, t) {
  const { x, y, w, h } = TELE;
  rect(g, x - 1, y - 1, w + 2, h + 2, PAL.ink[0]); frameRect(g, x - 1, y - 1, w + 2, h + 2, PAL.metal[2]);
  hline(g, x - 1, y - 1, w + 2, PAL.metal[4]);
  const sx = x, sy = y, sw = w, sh = h;
  if (a3(view)) {
    gradV(g, sx, sy, sw, sh, [PAL.ink[2], PAL.ink[0]]);
    g.save(); g.globalAlpha = 0.1; poly(g, [[sx + 3, sy + sh], [sx + 9, sy + sh], [sx + 20, sy], [sx + 14, sy]], '#ffffff'); g.restore();
    px(g, sx + sw - 2, sy + sh + 1, PAL.red[1]);                     // piloto de reposo, apagado
  } else {
    const n = Number(view.flag('tele_n')) || 0;
    const m = n === 0 ? 0 : ((n - 1) % 5) + 1;
    if (m === 0) { rect(g, sx, sy, sw, sh, PAL.blue[2]); for (let i = 0; i < 5; i++) rect(g, sx + 2 + (i * 3) % 9, sy + 2 + i * 3, 4 + (i * 5) % 7, 1, PAL.blue[4]); }
    else if (m === 1) { rect(g, sx, sy, sw, sh, PAL.paper[3]); rect(g, sx, sy + 12, sw, 8, PAL.paper[2]); ellipse(g, sx + 20, sy + 10, 3, 5, PAL.leaf[4]); rect(g, sx + 18, sy + 14, 4, 4, PAL.red[3]); rect(g, sx + 6, sy + 7, 5, 9, PAL.blue[3]); ellipse(g, sx + 8, sy + 5, 2, 2, PAL.skin[3]); }
    else if (m === 2) { gradV(g, sx, sy, sw, sh, [PAL.blue[3], PAL.blue[5]]); ellipse(g, sx + 9, sy + 7, 4, 3, PAL.paper[7]); ellipse(g, sx + 13, sy + 8, 5, 3, PAL.paper[6]); for (let i = 0; i < 5; i++) vline(g, sx + 6 + i * 3, sy + 12, 4, PAL.blue[7]); }
    else if (m === 3) { rect(g, sx, sy, sw, sh, PAL.teal[2]); ellipse(g, sx + 13, sy + 8, 4, 5, PAL.skin[4]); rect(g, sx + 8, sy + 13, 11, 7, PAL.paper[4]); ellipse(g, sx + 20, sy + 10, 3, 1.5, PAL.gold[5]); ditherOverlay(g, sx, sy, sw, sh, PAL.metal[6], 0.15); }
    else if (m === 4) { rect(g, sx, sy, sw, sh, PAL.ink[1]); const k = Math.floor(t / 250) % 4; for (let i = 0; i <= k; i++) px(g, sx + 8 + i * 3, sy + 10, PAL.paper[6]); }
    else { rect(g, sx, sy, sw, sh, PAL.paper[6]); rect(g, sx, sy, sw, 5, PAL.blue[3]); kit.micro(g, '400/0', sx + (sw >> 1), sy + 8, PAL.red[3], { align: 'center' }); rect(g, sx + 10, sy + 15, 9, 3, PAL.metal[5]); }
    const lab = ['SEÑAL?', 'ENTR.1', 'ENTR.2', 'ENTR.3', 'BUSCA', 'ENTR.5'][m];
    if (m === 0 || m === 4) kit.micro(g, lab, sx + (sw >> 1), sy + sh - 6, PAL.paper[6], { align: 'center' });
    ditherOverlay(g, sx, sy, sw, 2, '#ffffff', 0.15);
    glow(g, x + w / 2, y + h / 2, 22, 16, m === 1 || m === 5 ? '#f4ffe0' : '#8ec8ff', 0.12, 3);
    px(g, sx + sw - 2, sy + sh + 1, PAL.crt[5]);
  }
  // pegatina legible bajo la pantalla: «PULSA 3. NO, LA 2»
  rect(g, x - 3, y + h + 3, w + 6, 13, POSTIT.y); hline(g, x - 3, y + h + 3, w + 6, '#fff48a'); hline(g, x - 3, y + h + 15, w + 6, '#c8a83a');
  kit.micro(g, 'PULSA 3.', x + (w >> 1), y + h + 4, PAL.ink[2], { align: 'center' });
  kit.micro(g, 'NO, LA 2', x + (w >> 1), y + h + 10, PAL.ink[2], { align: 'center' });
  if (!a3(view)) kit.cantoVivo(g, x - 1, y - 1, w + 2, h + 2);
}
function drawCaja(g, view, t) {
  // caja de cables desbordada sobre la credencia, cables colgando por delante; un adaptador encaja consigo mismo
  const bx = 250, by = 57;
  const r = rng(1414); const cc = [PAL.ink[0], PAL.metal[4], PAL.red[4], PAL.blue[4], PAL.gold[4]];
  for (let i = 0; i < 10; i++) { const sx = bx + 1 + Math.floor(r() * 20); cable(g, sx, by + 7, sx + Math.floor((r() - 0.5) * 16), by + 15 + Math.floor(r() * 12), 2 + Math.floor(r() * 3), cc[i % cc.length], 10); }
  rect(g, bx, by, 24, 8, PAL.paper[3]); hline(g, bx, by, 24, PAL.paper[5]); vline(g, bx + 23, by, 8, PAL.paper[1]); hline(g, bx, by + 7, 24, PAL.paper[1]);
  for (let i = 0; i < 7; i++) { const ax = bx + 2 + i * 3; rect(g, ax, by - 2, 2, 3, cc[(i + 1) % cc.length]); }
  ellipse(g, bx + 6, by + 4, 3, 2, PAL.red[3]); ellipse(g, bx + 6, by + 4, 1.5, 1, PAL.ink[1]);
  kit.micro(g, '14', bx + 16, by + 2, PAL.ink[2]);
  if (view.visible) kit.cantoVivo(g, bx, by - 2, 24, 10);
  void t;
}

// figurantes de Mercados (Actos I-II): dos sentados a escala 0,92 (uno con barba de comité) y uno desplomado («Zzz»)
const FIG = {
  a: { skin: '#d8a888', hair: '#2a2024', hairStyle: 'parted', shirt: '#e8ecf0', jacket: '#5a5e68', tie: '#9a2a2a', pants: '#3a3a44', build: 'normal', eyebags: true },
  b: { skin: '#e0b090', hair: '#5a4632', hairStyle: 'balding', beard: 'long', shirt: '#d8d0c0', jacket: '#4a5a3a', pants: '#3a3a30', build: 'heavy', belly: true },
};
const figSp = {};
function figuranteSentado(g, key, cx, headTop, s, t) {
  const sp = figSp[key] || (figSp[key] = paperDoll(FIG[key]));
  const { canvas } = getFrame(sp, 'idle', 'down', 0);
  const rows = 30;                                         // cabeza, hombros y pecho: la mesa tapa el resto
  const dw = Math.round(canvas.width * s), dh = Math.round(rows * s);
  const bob = Math.round(Math.sin(t / 900 + cx) * 0.6);
  const top0 = 14;                                         // fila de la coronilla en el lienzo del paper doll
  g.save(); g.imageSmoothingEnabled = false;
  g.drawImage(canvas, 0, top0, canvas.width, rows, Math.round(cx - dw / 2), headTop + bob, dw, dh);
  g.restore();
}
function drawFigurantes(g, view, t) {
  figuranteSentado(g, 'a', 146, 58, 0.92, t);
  figuranteSentado(g, 'b', 200, 58, 0.92, t);
  // el «desplomado»: cabeza sobre los brazos cruzados, encima de la mesa
  const cx = 172, y = 75;
  rect(g, cx - 9, y + 2, 18, 6, JACKETS.navy[2]); hline(g, cx - 9, y + 2, 18, JACKETS.navy[4]);
  ellipse(g, cx, y + 3, 6, 4, PAL.wood[1]); hline(g, cx - 3, y, 5, PAL.wood[3]);
  rect(g, cx - 11, y + 7, 5, 2, PAL.skin[4]); rect(g, cx + 6, y + 7, 5, 2, PAL.skin[4]);
  const z = Math.floor(t / 700) % 2;
  kit.micro(g, 'Z', cx + 8, y - 6 - z, PAL.paper[6]);
  kit.micro(g, 'Z', cx + 12, y - 12 - z, PAL.paper[5]);
}

// plano detalle del clímax (7.4): el reverso del cartón caído con la pegatina «Atrezo – Focus group 2014», a 3×
export function detalleAtrezo(g, r, t) {
  const { x, y, w, h } = r;
  gradV(g, x, y, w, h, ['#1a3a2c', '#21483a', '#2a5646']);
  // el cartón de espaldas (marrón de cartón, con su pestaña) ocupando el inserto
  const cx = x + 8, cy = y + 10, cw = w - 16, ch = h - 22;
  rect(g, cx, cy, cw, ch, '#cdbb8e'); frameRect(g, cx, cy, cw, ch, '#a8946a');
  for (let i = 4; i < cw; i += 9) vline(g, cx + i, cy + 1, ch - 2, '#c0ad80');
  hline(g, cx, cy, cw, '#e4d8b4');
  rect(g, cx + cw - 22, cy + ch - 10, 18, 6, '#a8946a');
  // la pegatina
  const px0 = cx + 10, py0 = cy + 8, pw = cw - 20, ph = 30;
  rect(g, px0 + 2, py0 + 2, pw, ph, '#6e6252');
  rect(g, px0, py0, pw, ph, '#fbfaf2'); frameRect(g, px0, py0, pw, ph, '#b9b1a0');
  rect(g, px0, py0, pw, 3, '#c83a3a');
  label(g, 'ATREZO', px0 + (pw >> 1), py0 + 4, '#c83a3a', { align: 'center' });
  label(g, 'FOCUS GROUP 2014', px0 + (pw >> 1), py0 + 16, PAL.ink[2], { align: 'center' });
  // celo amarillento
  rect(g, px0 - 3, py0 - 2, 10, 4, 'rgba(244,236,176,0.7)'); rect(g, px0 + pw - 7, py0 + ph - 2, 10, 4, 'rgba(244,236,176,0.7)');
  void t;
}

// ------------------------------------------------------------------ geometría
const layout = {
  sala_a_pajarera: { rect: [4, 28, 36, 70], walkTo: [26, 112], face: 'left' },
  cartel_salida: { rect: [42, 28, 62, 29], walkTo: [70, 114], face: 'up' },
  carteles_amazonas: { rect: [38, 57, 74, 35], walkTo: [70, 114], face: 'up' },
  orden_del_dia: { rect: [118, 18, 128, 46], walkTo: [182, 124], face: 'up', draw: drawOrden },
  proyector: { rect: [170, 0, 26, 14], walkTo: [182, 124], face: 'up', priority: 2, layer: 'front', draw: drawProyector },
  figurantes_mercados: { rect: [134, 60, 76, 21], walkTo: [168, 124], face: 'up', priority: 1, layer: 'sorted', zy: 90, draw: drawFigurantes },
  planillo_mesa: { rect: [88, 86, 26, 11], walkTo: [100, 122], face: 'up', priority: 2, layer: 'sorted', zy: 108, draw: drawPlanillo },
  botellines: { rect: [114, 80, 60, 13], walkTo: [144, 124], face: 'up', priority: 1, layer: 'sorted', zy: 106, prop: true, draw: drawBotellines },
  minicruasanes: { rect: [194, 83, 30, 10], walkTo: [210, 124], face: 'up', priority: 1, layer: 'sorted', zy: 108, draw: drawCruasanes },
  // ADENDA §3.9: la tele (muerta en el Acto III, cuando el objeto se oculta) y la caja de cables, sobre la credencia
  tele_amazonas: { rect: [244, 17, 36, 37], walkTo: [262, 124], face: 'up', prop: true, draw: drawTele },
  caja_cables: { rect: [246, 55, 32, 25], walkTo: [262, 124], face: 'up', prop: true, draw: drawCaja },
  // PNJ (docs/GUIA_REDISENO.md §5). Gervasio PRESIDE SENTADO en la cabecera (derecha) en los Actos I-II; en el III,
  // de pie junto a su sillón vacío. Bruno le habla siempre desde la izquierda, a ≥ 24 px.
  gervasio_acta: {
    at: [286, 101, 'left'], pose: 'sentado', walkTo: [256, 124], face: 'right',
    positions: {
      preside: { at: [286, 101, 'left'], pose: 'sentado', walkTo: [256, 124], face: 'right' },
      rincon: { at: [304, 112, 'left'], walkTo: [278, 124], face: 'right' },
    },
  },
  // Lector Medio (Acto III): expositor de Marketing a la IZQUIERDA de la pantalla, delante del pie de la mesa, con su
  // foco (`luz: 1`). Bruno lo empuja desde su izquierda; cae hacia la derecha, delante de la mesa (climax.js).
  lector_medio: { at: [LECTOR_AT[0], LECTOR_AT[1], 'down'], walkTo: [LECTOR_AT[0] - 24, LECTOR_AT[1] + 4], face: 'right', luz: 1 },
  inigo_sinergia: { at: [222, 122, 'left'], walkTo: [198, 124], face: 'right' },
};

export default {
  room: 'sala_amazonas',
  width: W,
  rediseno: true,
  dynamic: true,
  scale: { yFar: 96, far: 0.92, yNear: 142, near: 1.04 },
  // walkbox en U: perímetro libre alrededor de la mesa (izquierda junto a la puerta, franja delantera y la cabecera)
  walkboxes: [{ id: 'suelo', poly: [[4, 102], [84, 102], [84, 118], [282, 118], [282, 100], [316, 100], [318, 142], [2, 142]] }],
  entries: { pajarera: [28, 114, 'right'] },
  layout,
  draw: drawRoom,
  foreground(g, view) {
    // 1.er plano: ficus en la esquina delantera izquierda (marca la profundidad; no tapa la entrada ni a nadie)
    const x = 7, y = 144;
    const r = rng(5);
    vline(g, x + 1, y - 34, 22, PAL.wood[2]); vline(g, x + 2, y - 30, 18, PAL.wood[1]);
    for (let i = 0; i < 30; i++) { const a = -2.9 + r() * 2.6; const sy = y - 14 - Math.floor(r() * 24); hoja(g, x + 1, sy, 8 + Math.floor(r() * 8), a, [PAL.leaf[1], PAL.leaf[3], PAL.leaf[0], PAL.leaf[4]], i); }
    rect(g, x - 6, y - 13, 15, 13, PAL.red[2]); hline(g, x - 6, y - 13, 15, PAL.red[4]); hline(g, x - 6, y - 12, 15, PAL.red[3]); vline(g, x + 8, y - 13, 13, PAL.red[0]);
    // caja de suelo de la sala (tomas) en la franja de paso
    rect(g, 290, 136, 10, 4, PAL.metal[3]); hline(g, 290, 136, 10, PAL.metal[5]); px(g, 293, 138, PAL.ink[0]); px(g, 296, 138, PAL.ink[0]);
    void view;
  },
  animate(g, view, t) {
    rainOnGlass(g, VENT.x, VENT.y, VENT.w, VENT.h, t, 6);
    drawBotellinesSuelo(g, view);
  },
  // PENUMBRA del Acto III (motor): se oscurece la sala; los actores solo el 22 % (el Lector Medio, nada: `luz: 1`).
  // A salvo: la pantalla, el foco del Lector Medio (de pie o, al caer, en el suelo) y, tenue, el sillón vacío.
  penumbra(view) {
    if (!a3(view)) return null;
    const [lx, ly] = LECTOR_AT;
    const spots = [{ rect: [PANT.x - 3, PANT.y - 3, PANT.w + 6, PANT.h + 6] }, [CAB, 84, 14, 22, 0.55]];
    if (view.flag('lector_derribado')) spots.push([lx + 37, ly + 1, 44, 13], [lx + 70, ly - 10, 22, 10, 0.6]);
    else spots.push([lx + 1, ly - 32, 17, 40], [lx + 2, ly, 24, 8]);
    return { color: '#080c24', alpha: 0.66, spots };
  },
};
export { PANT, VENT, MESA, CAB };
