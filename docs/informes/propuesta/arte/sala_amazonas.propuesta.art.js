// PROPUESTA ALTERNATIVA · `sala_amazonas` pintada (prueba de que la propuesta es realizable). Contrato de content/rooms/art.
// Cambios frente al arte actual (docs/informes/INFORME_AJUSTE_VISUAL.md §4.6, problemas 1, 5, 11, 19, 20):
//  - La mesa se acerca a cámara y recorre la sala de lado a lado; la CABECERA está en el extremo derecho, contra el ventanal
//    y bajo un foco cenital: ahí preside Gervasio (sentado) en los Actos I-II y ahí está el Lector Medio en el Acto III,
//    recortado contra la ciudad, FUERA del haz del proyector. Al empujarlo cae a lo largo de la mesa, sobre los 14 botellines.
//  - Alfombra de reunión con canto dorado = zona de reunión; perímetro libre = zona de paso. Walkbox en U alrededor de la mesa.
//  - Figurantes más grandes (escala 0,92 al fondo, pose sentada), uno desplomado sobre la mesa y otro con barba.
//  - Estado «huida» (tras reunion_terminada): sillas desordenadas, una volcada; el planillo queda en la mesa.
//  - Penumbra del Acto III pintada en el FONDO (no encima de los actores) + foco de presidencia encendido.
//  - Señalética común: placa «PAJARERA» sobre la puerta, rótulo de sala «AMAZONAS», umbral con el color de Dirección.
import {
  PAL, rect, hline, vline, frameRect, px, line, poly, ellipse, paint, bevel, ditherOverlay, gradV, gradH,
  glow, lightCone, shadowEllipse, ditherPick, hash2, rng, fadeRows, vignette, cityWindow, wallClock, mix, shade, label,
} from '../../../../engine/draw.js';
import { tiny, tinyW, POSTIT, JACKETS, chairBack, blinds, rainOnGlass, rainyGlassStatic, cable } from '../../../../content/rooms/art/lib-oficina.js';
import { placa, umbral, marcoPuerta, huecoAbierto, DEPTO, cantoVivo } from '../lib/kit.js';

const W = 320, FL = 96;
const PANT = { x: 122, y: 22, w: 120, h: 40 };          // pantalla del orden del día / proyección
const VENT = { x: 282, y: 18, w: 38, h: 50 };           // ventanal tras la cabecera
const TELE = { x: 248, y: 22, w: 28, h: 20 };           // tele de videollamadas en la pared (brazo) + credencia debajo
const MESA = { fx0: 96, fx1: 272, fy: 82, nx0: 86, nx1: 282, ny: 96, panel: 7 };   // canto lejano, canto cercano, faldón
const CAB = 284;                                         // x de la cabecera
const a3 = (v) => !!v.flag('acto_3_iniciado');
const huida = (v) => !!v.flag('reunion_terminada') && !a3(v);

// ------------------------------------------------------------------ utilidades
function hoja(g, x, y, len, ang, cs, seed) {
  // hoja de monstera/palma: perfil seno, nervio central claro y dos o tres cortes
  const ca = Math.cos(ang), sa = Math.sin(ang);
  for (let k = 0; k < len; k++) {
    const wd = Math.sin((k / len) * Math.PI) * len * 0.34 + 0.5;
    for (let s = -wd; s <= wd; s += 0.5) {
      const xx = Math.round(x + ca * k - sa * s), yy = Math.round(y + sa * k + ca * s);
      const corte = (k % 7 === 3) && Math.abs(s) > wd * 0.45;
      if (corte) continue;
      px(g, xx, yy, s < 0 ? cs[2] : (hash2(xx, yy, seed) < 0.1 ? cs[0] : cs[1]));
    }
    px(g, Math.round(x + ca * k), Math.round(y + sa * k), cs[3]);
  }
}
function sillaFrente(g, cx, by, o = {}) {
  // silla de la cara lejana vista de frente (respaldo alto acolchado); by = suelo (en general tapado por la mesa)
  const c = o.col || [PAL.teal[0], PAL.teal[1], PAL.teal[2], PAL.teal[3], PAL.teal[4]];
  const t = by - 30 + (o.dy || 0);
  const sk = o.giro || 0;
  poly(g, [[cx - 7 + sk, t], [cx + 7 + sk, t], [cx + 8, t + 16], [cx - 8, t + 16]], (xx, yy) => ditherPick(xx, yy, [c[1], c[2], c[3]], 0.35 + (xx - cx) / 30 + (yy - t) / 60));
  hline(g, cx - 6 + sk, t, 13, c[4]); hline(g, cx - 7 + sk, t + 1, 15, c[3]);
  vline(g, cx - 8, t + 4, 12, c[0]); vline(g, cx + 8, t + 4, 12, c[0]);
  for (let i = 0; i < 3; i++) hline(g, cx - 5 + sk, t + 4 + i * 4, 11, c[1]);  // capitoné
  rect(g, cx - 1, t + 16, 3, 4, PAL.metal[2]);
  rect(g, cx - 8, t + 19, 17, 3, c[2]); hline(g, cx - 8, t + 19, 17, c[4]);     // asiento
}
function sillaVolcada(g, x, y) {
  shadowEllipse(g, x + 10, y + 2, 13, 2, 0.7);
  rect(g, x, y - 5, 16, 6, PAL.teal[2]); hline(g, x, y - 5, 16, PAL.teal[4]); hline(g, x, y, 16, PAL.teal[0]);
  rect(g, x + 16, y - 9, 4, 10, PAL.teal[1]); vline(g, x + 16, y - 9, 10, PAL.teal[3]);
  line(g, x + 4, y - 6, x + 1, y - 13, PAL.metal[3]); line(g, x + 8, y - 6, x + 9, y - 14, PAL.metal[4]);
  px(g, x + 1, y - 14, PAL.ink[0]); px(g, x + 9, y - 15, PAL.ink[0]);
}

// ------------------------------------------------------------------ fondo
function techo(g, v) {
  gradV(g, 0, 0, W, 14, [PAL.ink[0], PAL.ink[1], PAL.metal[1]]);
  for (let x = 0; x < W; x += 20) vline(g, x, 0, 13, PAL.ink[0]);
  hline(g, 0, 6, W, PAL.ink[0]); hline(g, 0, 13, W, PAL.ink[1]);
  ditherOverlay(g, 0, 0, W, 13, PAL.metal[3], 0.08);
  // downlights; el de la cabecera, más grande (foco de presidencia)
  for (const x of [52, 176]) { ellipse(g, x, 11, 6, 2, PAL.metal[5]); ellipse(g, x, 11, 4, 1, a3(v) ? PAL.metal[3] : '#fff8e0'); }
  ellipse(g, CAB, 11, 8, 2.4, PAL.metal[5]); ellipse(g, CAB, 11, 6, 1.4, '#fff4d0');
  // soporte del proyector
  rect(g, 182, 0, 2, 4, PAL.metal[3]);
}
function pared(g) {
  // pared alta: verde institucional con trama de hojas muy suave (el nombre de la sala, sin texto)
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
  for (const [x, y, c] of [[214, 70, PAL.red[4]], [36, 84, PAL.gold[5]]]) { rect(g, x, y, 3, 2, c); px(g, x + 3, y, PAL.gold[6]); px(g, x - 1, y + 2, shade(c, -0.3)); }
  rect(g, 0, 60, W, 2, PAL.wood[5]); hline(g, 0, 60, W, PAL.wood[6]); hline(g, 0, 62, W, PAL.wood[1]);
  // zócalo
  rect(g, 0, 92, W, 4, PAL.wood[2]); hline(g, 0, 92, W, PAL.wood[4]); hline(g, 0, 95, W, PAL.ink[0]);
}
function suelo(g, v) {
  // moqueta verde de la sala (identidad que se conserva) + ALFOMBRA DE REUNIÓN con canto dorado
  paint(g, 0, FL, W, 144 - FL, (x, y) => {
    const t = (y - FL) / 48;
    const n = hash2(x, y, 5);
    return ditherPick(x, y, ['#183a2c', '#21483a', '#2a5646', '#336252'], 0.15 + t * 0.7 + (n < 0.05 ? -0.2 : 0));
  });
  // alfombra (zona de reunión): trapecio bajo la mesa
  const q = [[70, 99], [300, 99], [314, 124], [58, 124]];
  poly(g, q, (x, y) => ditherPick(x, y, ['#2a2418', '#3a2e1c', '#463624'], 0.3 + (y - 99) / 60 + (hash2(x >> 1, y, 8) < 0.06 ? 0.2 : 0)));
  for (const [a, b] of [[q[0], q[1]], [q[3], q[2]], [q[0], q[3]], [q[1], q[2]]]) line(g, a[0], a[1], b[0], b[1], PAL.gold[3]);
  line(g, 61, 121, 311, 121, PAL.gold[2]);
  // migas y papeles (reunión eterna)
  const r = rng(808);
  for (let i = 0; i < 14; i++) { const x = 10 + Math.floor(r() * 300), y = 126 + Math.floor(r() * 16); ditherOverlay(g, x, y, 3 + Math.floor(r() * 4), 1, PAL.ink[0], 0.35); }
  for (let i = 0; i < 4; i++) { const x = 40 + Math.floor(r() * 240), y = 128 + Math.floor(r() * 12); rect(g, x, y, 4, 2, PAL.paper[6]); px(g, x + 3, y + 1, PAL.paper[4]); }
  if (huida(v)) { // papeles de la huida
    for (let i = 0; i < 9; i++) { const x = 70 + Math.floor(r() * 220), y = 120 + Math.floor(r() * 20); rect(g, x, y, 5, 3, PAL.paper[7]); hline(g, x, y + 2, 5, PAL.paper[4]); }
  }
  // sombra de la unión pared/suelo
  ditherOverlay(g, 0, FL, W, 3, PAL.ink[0], 0.5);
  // UMBRAL de la puerta (color de destino: Dirección)
  umbral(g, 4, 98, 36, 6, DEPTO.direccion.c);
}
function puerta(g) {
  const x = 8, y = 30, w = 28, h = 62;
  marcoPuerta(g, x, y, w, h, { ramp: PAL.wood });
  huecoAbierto(g, x, y, w, h, { luz: '#ffd890', suelo: ['#3a2a1c', '#5a3a24'], hoja: PAL.wood });
  // a lo lejos: la mesa RESERVADO de la Pajarera
  rect(g, x + 4, y + 40, 14, 8, PAL.wood[3]); hline(g, x + 4, y + 40, 14, PAL.wood[5]); rect(g, x + 8, y + 37, 6, 3, PAL.paper[6]);
  // cuña
  poly(g, [[x + 2, y + h + 1], [x + 9, y + h + 1], [x + 9, y + h + 3], [x, y + h + 3]], PAL.wood[5]);
  placa(g, 4, 16, 'PAJARERA', { planta: '1', flecha: '<', depto: 'direccion' });
}
function rotuloSala(g) {
  // vinilo de sala en la pared, sobre el cartel de salida
  const x = 46, y = 18;
  rect(g, x, y, 54, 9, PAL.green[1]);
  label(g, 'AMAZONAS', x + 3, y - 2, PAL.leaf[6]);
  hoja(g, x + 50, y + 1, 6, 1.9, [PAL.leaf[4], PAL.leaf[5], PAL.leaf[3], PAL.leaf[6]], 3);
}
function cartelSalida(g) {
  const x = 44, y = 30, w = 58, h = 26;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.45);
  rect(g, x, y, w, h, PAL.paper[7]); frameRect(g, x, y, w, h, PAL.red[3]); frameRect(g, x + 1, y + 1, w - 2, h - 2, PAL.red[5]);
  label(g, 'SALIDA:', x + (w >> 1), y - 1, PAL.red[3], { align: 'center' });
  tiny(g, 'AL TERMINAR EL', x + (w >> 1), y + 12, PAL.ink[2], { align: 'center' });
  tiny(g, 'ORDEN DEL DÍA', x + (w >> 1), y + 18, PAL.ink[2], { align: 'center' });
  poly(g, [[x - 5, y + 21], [x - 1, y + 18], [x - 1, y + 24]], PAL.red[3]);    // flecha a la puerta
  for (const cx of [x - 1, x + w - 6]) rect(g, cx, y - 1, 7, 2, '#d8cfa0');
}
function tablonGuerra(g) {
  // tablón con los carteles en guerra: cuatro hojas LEGIBLES (ninguna corta a otra) y flechas de réplica
  const x = 38, y = 58, w = 74, h = 24;
  rect(g, x - 1, y - 1, w + 2, h + 2, PAL.wood[1]); rect(g, x, y, w, h, PAL.wood[4]);
  ditherOverlay(g, x, y, w, h, PAL.wood[2], 0.35);
  const hojas = [
    [x + 1, y + 1, 36, 11, PAL.gold[6], ['NO DEJÉIS', 'TAZAS'], PAL.ink[2]],
    [x + 37, y + 1, 36, 11, PAL.paper[7], ['Y DÓNDE', 'LAS DEJO?'], PAL.blue[3]],
    [x + 1, y + 12, 36, 11, '#f4c0c8', ['NO ES UN', 'OFFICE'], PAL.red[3]],
    [x + 37, y + 12, 36, 11, PAL.teal[6], ['QUIÉN', 'CAMBIÓ?'], PAL.ink[2]],
  ];
  for (const [hx, hy, hw, hh, c, ls, ink] of hojas) {
    ditherOverlay(g, hx + 1, hy + 1, hw, hh, PAL.shadow, 0.5);
    rect(g, hx, hy, hw, hh, c); hline(g, hx, hy, hw, shade(c, 0.25)); hline(g, hx, hy + hh - 1, hw, shade(c, -0.25));
    ls.forEach((s, i) => tiny(g, s, hx + (hw >> 1), hy + 1 + i * 5, ink, { align: 'center' }));
    px(g, hx + (hw >> 1), hy - 1, PAL.red[4]);
  }
  // flecha de réplica entre carteles (están en guerra)
  
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
function proyectorCuerpo(g) {
  const x = 175, y = 4;
  bevel(g, x, y, 16, 7, PAL.paper[4], PAL.paper[6], PAL.paper[2]);
  rect(g, x + 2, y + 2, 4, 3, PAL.ink[1]); ellipse(g, x + 4, y + 3, 1.5, 1.5, PAL.metal[1]);
  px(g, x + 12, y + 2, PAL.red[3]);
}

function drawRoom(g, v) {
  techo(g, v);
  pared(g);
  suelo(g, v);
  puerta(g);
  cartelSalida(g);
  tablonGuerra(g);
  wallClock(g, 111, 36, 6);
  teleBrazo(g);
  pantallaMarco(g);
  ventanal(g);
  sillasLejanas(g, v);
  proyectorCuerpo(g);
  // luz de los downlights sobre la pared
  if (!a3(v)) { glow(g, 52, 30, 30, 22, '#fff4d8', 0.08); glow(g, 176, 30, 40, 20, '#fff4d8', 0.06); }
  fadeRows(g, 0, FL, W, 6, PAL.ink[0], 0.3, 0, 3);
  vignette(g, W, 144, 0.38);
  if (a3(v)) {
    // PENUMBRA del Acto III pintada en el fondo (no sobre los actores), con la pantalla y la cabecera a salvo
    g.save();
    g.beginPath(); g.rect(0, 0, W, 144); g.rect(PANT.x - 3, PANT.y - 3, PANT.w + 6, PANT.h + 6); g.clip('evenodd');
    g.globalAlpha = 0.5; g.fillStyle = '#0a0e26'; g.fillRect(0, 0, W, 144); g.restore();
    // foco de presidencia (pintado en el fondo): cono y charco de luz en la cabecera
    lightCone(g, CAB - 4, 12, 12, 46, 90, '#fff0c8', 0.2);
    glow(g, CAB, 102, 28, 6, '#fff0c8', 0.22, 3);
    glow(g, VENT.x + 18, VENT.y + 24, 30, 30, '#8ea8e0', 0.1, 3);
  }
}

// ------------------------------------------------------------------ objetos
function drawOrden(g, view, t) {
  const { x, y, w, h } = PANT;
  if (a3(view)) {
    const s248 = /248/.test(String(view.objState('proyector') ?? ''));
    rect(g, x, y, w, h, '#eef2f4'); rect(g, x, y, w, 7, PAL.blue[3]);
    tiny(g, 'ELCONTABLE.ES', x + 4, y + 1, PAL.paper[7]);
    tiny(g, s248 ? '248 / 400' : '247 / 400', x + w - 4, y + 1, PAL.gold[5], { align: 'right' });
    label(g, 'SINERGIAS', x + (w >> 1), y + 6, PAL.blue[3], { align: 'center' });
    tiny(g, 'EXPONENCIALES:', x + (w >> 1), y + 20, PAL.red[3], { align: 'center' });
    tiny(g, s248 ? 'EL VIAJE CONTINÚA' : 'EL VIAJE', x + (w >> 1), y + 27, PAL.ink[2], { align: 'center' });
    for (let i = 0; i < 6; i++) rect(g, x + 8 + i * 3, y + 34 - ((i * i) >> 3), 2, 2, PAL.teal[4]);
    for (let i = 0; i < 6; i++) rect(g, x + w - 26 + i * 3, y + 34 - ((i * i) >> 3), 2, 2, PAL.gold[4]);
    return;
  }
  const done = !!view.flag('reunion_terminada');
  rect(g, x, y, w, h, PAL.paper[7]);
  rect(g, x, y, w, 8, PAL.blue[4]);
  tiny(g, 'ORDEN DEL DÍA', x + (w >> 1), y + 2, PAL.paper[7], { align: 'center' });
  ['1. PREVISIÓN', '2. PREVISIÓN DE LA PREVISIÓN', '3. SIGUIENTES PASOS'].forEach((s, i) => {
    const ly = y + 12 + i * 9;
    tiny(g, s, x + 6, ly, PAL.ink[2]);
    if (done) { hline(g, x + 4, ly + 2, tinyW(s) + 4, PAL.red[3]); hline(g, x + 4, ly + 3, tinyW(s) + 4, PAL.red[4]); }
  });
  if (!done) { ellipse(g, x + w - 14, y + 31, 4, 3, PAL.wood[5]); ellipse(g, x + w - 14, y + 31, 2, 1, PAL.wood[3]); }
  if ((Math.floor(t / 700) & 1) === 0) px(g, x + w - 4, y + h - 3, PAL.crt[4]);
  ditherOverlay(g, x, y, w, 3, '#ffffff', 0.12);
}
function drawProyector(g, view, t) {
  const x = 175, y = 4;
  rect(g, x + 2, y + 2, 4, 3, '#fffbe0'); glow(g, x + 4, y + 4, 8, 6, '#ffffff', 0.4, 3);
  px(g, x + 12, y + 2, (Math.floor(t / 500) & 1) ? '#ff4030' : PAL.red[1]);
  // haz hacia la pantalla (de la lente a los cuatro lados de la pantalla): NO toca la cabecera
  g.save(); g.globalAlpha = 0.12;
  poly(g, [[x + 3, y + 4], [x + 5, y + 4], [PANT.x + PANT.w, PANT.y + PANT.h], [PANT.x, PANT.y + PANT.h]], '#fffbe8');
  g.globalAlpha = 0.08; poly(g, [[x + 3, y + 4], [x + 5, y + 4], [PANT.x + PANT.w, PANT.y], [PANT.x, PANT.y]], '#fffbe8');
  g.restore();
  // motas de polvo en el haz
  for (let i = 0; i < 7; i++) { const k = (t / 40 + i * 37) % 60; px(g, 150 + ((i * 23) % 70), 14 + (k | 0) % 40, '#fffbe8'); }
}
function drawMesa(g, view) {
  const Wd = PAL.wood;
  const { fx0, fx1, fy, nx0, nx1, ny, panel } = MESA;
  shadowEllipse(g, (nx0 + nx1) / 2, ny + panel + 3, (nx1 - nx0) / 2 + 4, 3, 0.75);
  // tablero (nogal barnizado) con veta y reflejo de los downlights
  poly(g, [[fx0, fy], [fx1, fy], [nx1, ny], [nx0, ny]], (xx, yy) => {
    const t = (yy - fy) / (ny - fy);
    const veta = ((yy * 7 + (xx >> 3)) % 11 === 0) ? -0.12 : 0;
    return ditherPick(xx, yy, [Wd[2], Wd[3], Wd[4], Wd[5]], 0.25 + t * 0.55 + veta);
  });
  hline(g, fx0, fy, fx1 - fx0, Wd[6]); hline(g, nx0, ny, nx1 - nx0, Wd[7]);
  if (!a3(view)) { ditherOverlay(g, 150, fy + 2, 60, 2, '#fff4c8', 0.35); ditherOverlay(g, 120, fy + 7, 50, 2, '#fff4c8', 0.2); }
  else { ditherOverlay(g, 236, fy + 3, 44, 6, '#fff0c0', 0.25); }        // la cabecera, bajo el foco
  // faldón frontal (modesty panel): tapa las piernas de quien se sienta detrás
  gradV(g, nx0, ny + 1, nx1 - nx0, panel, [Wd[3], Wd[2], Wd[1]]);
  hline(g, nx0, ny + 1, nx1 - nx0, Wd[1]);
  for (let x = nx0 + 20; x < nx1 - 10; x += 32) vline(g, x, ny + 2, panel - 2, Wd[1]);
  rect(g, nx0, ny + 1, 3, panel + 2, Wd[1]); rect(g, nx1 - 3, ny + 1, 3, panel + 2, Wd[0]);
  // canto de la cabecera (lado derecho visto): marca la «presidencia»
  poly(g, [[fx1, fy], [nx1, ny], [nx1, ny + panel], [fx1 + 2, fy + panel - 2]], (xx, yy) => ditherPick(xx, yy, [Wd[1], Wd[2]], 0.5));
  // centro de conferencias (araña) y cajas de conexión
  ellipse(g, 186, 89, 6, 2, PAL.ink[1]); px(g, 186, 88, PAL.metal[5]); px(g, 182, 89, PAL.metal[4]); px(g, 190, 89, PAL.metal[4]);
  rect(g, 148, 92, 4, 2, PAL.ink[2]);
  // placa «PRESIDENCIA» en la cabecera (texto de 3x5 sobre latón: sobrevive a 1x)
  rect(g, 252, 90, 26, 6, PAL.gold[4]); hline(g, 252, 90, 26, PAL.gold[6]); hline(g, 252, 95, 26, PAL.gold[1]);
  tiny(g, 'PRESID.', 254, 91, PAL.ink[1]);
  // carpetas y vasos de la reunión
  if (!a3(view)) {
    for (const [x, y] of [[132, 86], [204, 84], [160, 90]]) { rect(g, x, y, 10, 4, PAL.paper[7]); hline(g, x, y + 3, 10, PAL.paper[4]); }
    for (const x of [144, 222]) { rect(g, x, 84, 3, 4, PAL.teal[6]); hline(g, x, 84, 3, '#ffffff'); }
  }
}
function drawBotellines(g, view, t) {
  // 14 botellines alineados en la mitad de la cabecera: la caída del Lector los hace volar
  const caido = !!view.flag('lector_derribado');
  for (let i = 0; i < 14; i++) {
    let bx = 214 + i * 4, by = 82;
    if (caido) {
      const r = hash2(i, 3, 77);
      if (r < 0.55) { // tumbado y rodando por la mesa
        bx = 196 + Math.floor(hash2(i, 1, 77) * 80); by = 86 + Math.floor(hash2(i, 2, 77) * 8);
        rect(g, bx, by + 1, 7, 3, PAL.teal[5]); hline(g, bx, by + 1, 7, PAL.teal[7]); rect(g, bx + 7, by + 2, 2, 1, PAL.teal[6]); hline(g, bx + 3, by + 2, 2, PAL.paper[6]);
        continue;
      }
      if (r < 0.75) { // en el suelo, delante
        bx = 190 + Math.floor(hash2(i, 4, 77) * 110); by = 112 + Math.floor(hash2(i, 5, 77) * 14);
        rect(g, bx, by, 7, 3, PAL.teal[5]); hline(g, bx, by, 7, PAL.teal[7]); px(g, bx + 7, by + 1, PAL.white);
        continue;
      }
    }
    rect(g, bx, by + 2, 3, 8, PAL.teal[5]); vline(g, bx, by + 2, 8, PAL.teal[7]); vline(g, bx + 2, by + 3, 7, PAL.teal[3]);
    rect(g, bx + 1, by, 1, 2, PAL.teal[6]); px(g, bx + 1, by - 1, PAL.white);
    hline(g, bx, by + 5, 3, PAL.paper[6]);
  }
  if (caido) { // charco y salpicaduras
    ditherOverlay(g, 230, 92, 40, 3, PAL.teal[6], 0.4);
  }
  void t;
}
function drawCruasanes(g) {
  const x = 108, y = 86;
  ellipse(g, x + 13, y + 4, 14, 3, PAL.metal[4]); ellipse(g, x + 13, y + 3, 13, 2, PAL.metal[7]);
  ellipse(g, x + 8, y + 2, 4, 1.8, PAL.gold[4]); px(g, x + 6, y + 1, PAL.gold[6]); px(g, x + 10, y + 2, PAL.gold[2]);   // medio cruasán
  for (let i = 0; i < 10; i++) px(g, x + 3 + Math.floor(hash2(i, 1, 4) * 20), y + 2 + Math.floor(hash2(i, 2, 4) * 3), PAL.gold[2 + (i % 3)]);
  cantoVivo(g, x + 1, y + 1, 26, 5);
}
function drawPlanillo(g) {
  const x = 94, y = 89;
  poly(g, [[x + 2, y], [x + 20, y], [x + 22, y + 6], [x, y + 6]], PAL.paper[7]);
  hline(g, x, y + 6, 22, PAL.paper[3]);
  for (let i = 0; i < 4; i++) vline(g, x + 5 + i * 4, y, 6, PAL.blue[5]);
  hline(g, x + 1, y + 3, 20, PAL.blue[5]);
  rect(g, x + 7, y + 1, 4, 2, PAL.red[3]); rect(g, x + 13, y + 4, 4, 2, PAL.teal[5]);
  cantoVivo(g, x, y, 23, 7);
}
function drawSillasCerca(g, view) {
  // sillas del lado cercano, de espaldas: tapan el faldón; en «huida», desordenadas y una volcada
  const col = [PAL.teal[0], PAL.teal[1], PAL.teal[2], PAL.teal[3], PAL.teal[4]];
  if (huida(view)) {
    chairBack(g, 112, 120, { col, turn: -1 }); chairBack(g, 176, 124, { col, turn: 1 }); chairBack(g, 236, 118, { col, turn: -1 });
    sillaVolcada(g, 140, 121);
    return;
  }
  for (const cx of [124, 162, 200, 238]) chairBack(g, cx, 116, { col });
}
function drawPresidencial(g, view) {
  // sillón de la cabecera (cuero burdeos, respaldo alto con remaches): en el Acto III, apartado contra el ventanal
  const x = a3(view) ? 308 : CAB, by = a3(view) ? 100 : 104;
  const R = PAL.red;
  shadowEllipse(g, x, by, 10, 2, 0.7);
  rect(g, x - 7, by - 44, 14, 28, R[2]);
  paint(g, x - 6, by - 43, 12, 26, (xx, yy) => ditherPick(xx, yy, [R[1], R[2], R[3]], 0.6 - (xx - x) / 20 + (hash2(xx, yy, 2) - 0.5) * 0.2));
  hline(g, x - 7, by - 44, 14, R[4]); vline(g, x + 6, by - 43, 27, R[0]);
  for (let i = 0; i < 4; i++) px(g, x - 5 + i * 3, by - 41, PAL.gold[5]);
  rect(g, x - 9, by - 18, 18, 5, R[2]); hline(g, x - 9, by - 18, 18, R[4]); hline(g, x - 9, by - 14, 18, R[0]);   // asiento/brazos
  rect(g, x - 1, by - 13, 2, 8, PAL.metal[3]);
  hline(g, x - 7, by - 3, 15, PAL.metal[4]); px(g, x - 7, by - 2, PAL.ink[0]); px(g, x + 7, by - 2, PAL.ink[0]);
}
function teleBrazo(g) {
  // brazo de pared + CREDENCIA baja bajo la tele (mueble: la caja de cables vive encima)
  const { x, y, w, h } = TELE;
  rect(g, x + (w >> 1) - 1, y + h, 3, 4, PAL.metal[2]);
  const cx = 244, cy = 64;
  shadowEllipse(g, cx + 18, FL, 22, 2, 0.6);
  rect(g, cx, cy, 36, 18, PAL.wood[3]); hline(g, cx, cy, 36, PAL.wood[6]); hline(g, cx, cy + 1, 36, PAL.wood[5]);
  vline(g, cx + 17, cy + 3, 14, PAL.wood[1]); rect(g, cx + 8, cy + 9, 4, 1, PAL.gold[4]); rect(g, cx + 24, cy + 9, 4, 1, PAL.gold[4]);
  rect(g, cx + 2, cy + 18, 2, 14, PAL.wood[1]); rect(g, cx + 32, cy + 18, 2, 14, PAL.wood[1]);
}
function drawTele(g, view, t) {
  const { x, y, w, h } = TELE;
  rect(g, x - 1, y - 1, w + 2, h + 2, PAL.ink[0]); frameRect(g, x - 1, y - 1, w + 2, h + 2, PAL.metal[2]);
  const n = Number(view.flag('tele_n')) || 0;
  if (a3(view)) gradV(g, x, y, w, h, [PAL.ink[2], PAL.ink[0]]);
  else {
    const m = n === 0 ? 0 : ((n - 1) % 5) + 1;
    gradV(g, x, y, w, h, m === 0 ? [PAL.blue[2], PAL.blue[3]] : [PAL.teal[2], PAL.teal[4]]);
    tiny(g, ['SEÑAL?', 'ENTR.1', 'ENTR.2', 'ENTR.3', 'BUSCA', 'ENTR.5'][m], x + (w >> 1), y + 8, PAL.paper[7], { align: 'center' });
    glow(g, x + w / 2, y + h / 2, 22, 16, '#8ec8ff', 0.12, 3);
  }
  ditherOverlay(g, x, y, w, 2, '#ffffff', 0.15);
  // pegatina legible bajo la pantalla
  rect(g, x - 2, y + h + 2, w + 4, 12, POSTIT.y); hline(g, x - 2, y + h + 2, w + 4, '#fff48a'); hline(g, x - 2, y + h + 13, w + 4, '#c8a83a');
  tiny(g, 'PULSA 3', x + (w >> 1), y + h + 3, PAL.ink[2], { align: 'center' }); tiny(g, 'NO, LA 2', x + (w >> 1), y + h + 8, PAL.ink[2], { align: 'center' });
  void t;
}
function drawCaja(g) {
  // caja de cables desbordada sobre la credencia
  const bx = 250, by = 57;
  const r = rng(1414); const cc = [PAL.ink[0], PAL.metal[4], PAL.red[4], PAL.blue[4], PAL.gold[4]];
  // cables que rebosan y cuelgan por el frente de la credencia
  for (let i = 0; i < 10; i++) { const sx = bx + 1 + Math.floor(r() * 20); cable(g, sx, by + 6, sx + Math.floor((r() - 0.5) * 16), by + 14 + Math.floor(r() * 10), 2 + Math.floor(r() * 3), cc[i % cc.length], 10); }
  rect(g, bx, by, 22, 7, PAL.paper[3]); hline(g, bx, by, 22, PAL.paper[5]); vline(g, bx + 21, by, 7, PAL.paper[1]);
  for (let i = 0; i < 6; i++) { const ax = bx + 2 + i * 3; rect(g, ax, by - 2, 2, 3, cc[(i + 1) % cc.length]); }
  ellipse(g, bx + 6, by + 3, 3, 2, PAL.red[3]); ellipse(g, bx + 6, by + 3, 1.5, 1, PAL.ink[1]);
}
function drawFigurantes(g) {
  // el «desplomado»: cabeza sobre los brazos cruzados, encima de la mesa (los otros dos son dolls sentados; ver render)
  const cx = 172, y = 76;
  rect(g, cx - 10, y + 6, 20, 4, JACKETS.navy[2]); hline(g, cx - 10, y + 6, 20, JACKETS.navy[4]);
  ellipse(g, cx, y + 4, 6, 4, PAL.wood[1]); hline(g, cx - 3, y + 1, 5, PAL.wood[3]);
  rect(g, cx - 12, y + 9, 5, 2, PAL.skin[4]); rect(g, cx + 7, y + 9, 5, 2, PAL.skin[4]);
  // «Zzz» a 3x5 (se entiende sin leer el nombre)
  tiny(g, 'Z', cx + 8, y - 6, PAL.paper[6]); tiny(g, 'Z', cx + 12, y - 11, PAL.paper[5]);
}

const layout = {
  sala_a_pajarera: { rect: [4, 28, 36, 70], walkTo: [26, 112], face: 'left' },
  cartel_salida: { rect: [40, 28, 64, 30], walkTo: [70, 114], face: 'up' },
  carteles_amazonas: { rect: [36, 56, 78, 28], walkTo: [70, 114], face: 'up' },
  orden_del_dia: { rect: [118, 18, 128, 48], walkTo: [182, 122], face: 'up', draw: drawOrden },
  proyector: { rect: [170, 0, 26, 14], walkTo: [182, 122], face: 'up', layer: 'front', draw: drawProyector },
  minicruasanes: { rect: [106, 84, 32, 10], walkTo: [124, 122], face: 'up', layer: 'sorted', zy: 107, draw: drawCruasanes },
  planillo_mesa: { rect: [92, 87, 26, 10], walkTo: [104, 122], face: 'up', layer: 'sorted', zy: 107, draw: drawPlanillo },
  botellines: { rect: [210, 78, 64, 14], walkTo: [242, 122], face: 'up', layer: 'sorted', zy: 107, prop: true, draw: drawBotellines },
  figurantes_mercados: { rect: [134, 52, 104, 34], walkTo: [182, 122], face: 'up', layer: 'sorted', zy: 107, draw: drawFigurantes },
  tele_amazonas: { rect: [244, 20, 36, 32], walkTo: [262, 122], face: 'up', draw: drawTele },
  caja_cables: { rect: [244, 52, 36, 30], walkTo: [262, 122], face: 'up', draw: drawCaja },
  // mobiliario sin hotspot propio (props que tapan actores)
  _mesa: { rect: [86, 82, 196, 24], layer: 'sorted', zy: 106, prop: true, draw: drawMesa },
  _sillas_cerca: { rect: [100, 88, 160, 40], layer: 'sorted', zy: 116, prop: true, draw: drawSillasCerca },
  _presidencial: { rect: [274, 54, 34, 52], layer: 'sorted', zy: 103, prop: true, draw: drawPresidencial },
  // PNJ: cabecera = x 284. Bruno nunca habla desde delante del PNJ (separación ≥ 24 px en x).
  gervasio_acta: { at: [286, 101, 'left'], sentado: true, walkTo: [256, 124], face: 'right', positions: { preside: { at: [286, 101, 'left'], sentado: true }, rincon: { at: [56, 106, 'right'] } } },
  lector_medio: { at: [284, 104, 'down'], walkTo: [306, 120], face: 'left' },
  inigo_sinergia: { at: [98, 122, 'left'], walkTo: [62, 124], face: 'right' },
};

export default {
  room: 'sala_amazonas',
  width: W,
  scale: { yFar: 96, far: 0.92, yNear: 142, near: 1.04 },
  // walkbox en U: perímetro libre alrededor de la mesa (izquierda junto a la puerta, franja delantera, acceso a la cabecera)
  walkboxes: [{ id: 'suelo', poly: [[4, 102], [84, 102], [84, 118], [288, 118], [288, 102], [316, 102], [318, 142], [2, 142]] }],
  entries: { pajarera: [28, 114, 'right'] },
  layout,
  draw: drawRoom,
  dynamic: true,
  foreground(g, view) {
    // 1.er plano: ficus en la esquina delantera izquierda (marca la profundidad; no tapa la entrada ni a nadie)
    const x = 7, y = 144;
    const r = rng(5);
    vline(g, x + 1, y - 34, 22, PAL.wood[2]); vline(g, x + 2, y - 30, 18, PAL.wood[1]);
    for (let i = 0; i < 30; i++) { const a = -2.9 + r() * 2.6; const sy = y - 14 - Math.floor(r() * 24); hoja(g, x + 1, sy, 8 + Math.floor(r() * 8), a, [PAL.leaf[1], PAL.leaf[3], PAL.leaf[0], PAL.leaf[4]], i); }
    rect(g, x - 6, y - 13, 15, 13, PAL.red[2]); hline(g, x - 6, y - 13, 15, PAL.red[4]); hline(g, x - 6, y - 12, 15, PAL.red[3]); vline(g, x + 8, y - 13, 13, PAL.red[0]);
    if (a3(view)) { g.save(); g.globalAlpha = 0.45; g.fillStyle = '#0a0e26'; g.fillRect(0, 100, 26, 44); g.restore(); }
    // caja de suelo de la sala (tomas) en la franja de paso
    rect(g, 196, 132, 10, 4, PAL.metal[3]); hline(g, 196, 132, 10, PAL.metal[5]); px(g, 199, 134, PAL.ink[0]); px(g, 202, 134, PAL.ink[0]);
  },
  animate(g, view, t) { rainOnGlass(g, VENT.x, VENT.y, VENT.w, VENT.h, t, 6); },
  overlay(g, view, t) {
    if (!a3(view)) return;
    // penumbra suave también sobre los actores, salvo la pantalla y la CABECERA (el objetivo del remate queda iluminado)
    g.save();
    g.beginPath(); g.rect(0, 0, W, 144); g.rect(PANT.x - 3, PANT.y - 3, PANT.w + 6, PANT.h + 6); g.rect(CAB - 22, 30, 44, 80); g.clip('evenodd');
    g.globalAlpha = 0.22; g.fillStyle = '#0a0e26'; g.fillRect(0, 0, W, 144); g.restore();
    void t;
  },
};
export { PANT, VENT, MESA, CAB };
void lightCone; void gradH; void mix; void glow; void frameRect;
