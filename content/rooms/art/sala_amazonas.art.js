// SALA `sala_amazonas` — ARTE Y GEOMETRÍA. Dueño: artista de fondos. Biblia: §3.6; adenda §3.9 y §11.3.
// Sala de reuniones «Amazonas» (papel pintado de selva, moqueta verde): puerta abierta que nadie usa, cartel «SALIDA: AL TERMINAR
// EL ORDEN DEL DÍA», carteles en guerra, pantalla con el orden del día (que en el Acto III es la diapositiva 247/248 del
// proyector), ventanal con lluvia, tele de videollamadas con su caja de cables y la mesa larga con doce sillas.
//
// Objetos con estado/animación: orden_del_dia (tachado tras reunion_terminada; diapositiva en el Acto III según el estado del
// proyector), proyector (Acto III: lente encendida), tele_amazonas (pantalla según tele_n), figurantes_mercados (tres
// redactores desplomados), planillo_mesa, botellines (lleva la mesa: capa 'sorted' para que Lector Medio/figurantes queden
// DETRÁS de ella). `overlay`: penumbra del Acto III.
import {
  PAL, rect, hline, vline, frameRect, px, line, poly, ellipse, paint, bevel, ditherOverlay, gradV, gradH, noise,
  glow, lightCone, shadowEllipse, ditherPick, hash2, rng, fadeRows, vignette, wall, wainscot, baseboard, floorTiles,
  cityWindow, wallClock, door, mix, shade, label,
} from '../../../engine/draw.js';
import {
  tiny, postit, POSTIT, lcd, JACKETS, chairBack, blinds, rainOnGlass, rainyGlassStatic, cable,
} from './lib-oficina.js';

const W = 320;
const FL = 98;
const OK = { x: 104, y: 17, w: 120, h: 40 };      // pantalla del orden del día

const cacheDraw = (() => {
  const store = {};
  return (key, x, y, w, h, fn) => (g) => {
    let c = store[key];
    if (!c) {
      c = document.createElement('canvas'); c.width = w; c.height = h;
      const cg = c.getContext('2d'); cg.translate(-x, -y); fn(cg);
      store[key] = c;
    }
    g.drawImage(c, x, y);
  };
})();

// ------------------------------------------------------------------ gente
function personFront(g, cx, top, o = {}) {
  const sk = o.skin || PAL.skin, hair = o.hair || PAL.wood[1], suit = o.suit || JACKETS.grey, tilt = o.tilt || 0;
  // torso desplomado
  poly(g, [[cx - 11, top + 20], [cx - 8, top + 11], [cx + 8, top + 11], [cx + 11, top + 20], [cx + 12, top + 34], [cx - 12, top + 34]],
    (xx, yy) => ditherPick(xx, yy, [suit[3], suit[2], suit[1]], (xx - cx + 11) / 24 * 0.9 + (yy - top) / 70));
  // camisa/corbata
  poly(g, [[cx - 3, top + 11], [cx + 3, top + 11], [cx + 1, top + 18], [cx - 1, top + 18]], PAL.paper[6]);
  if (o.tie) { rect(g, cx - 1, top + 13, 2, 8, o.tie); }
  vline(g, cx, top + 20, 14, suit[1]);
  // cabeza
  const hx = cx + tilt;
  rect(g, hx - 2, top + 9, 4, 3, sk[3]);
  ellipse(g, hx, top + 5, 5, 6, (xx, yy, d) => (d > 0.8 ? sk[2] : sk[4]));
  ellipse(g, hx, top + 1, 5, 3, hair); hline(g, hx - 5, top + 2, 10, hair);
  // ojos cansados
  hline(g, hx - 3, top + 5, 2, PAL.ink[1]); hline(g, hx + 1, top + 5, 2, PAL.ink[1]);
  hline(g, hx - 3, top + 6, 2, sk[2]); hline(g, hx + 1, top + 6, 2, sk[2]);
  hline(g, hx - 1, top + 9, 3, sk[1]);
  if (o.beard) { ellipse(g, hx, top + 8, 4, 4, PAL.ink[2]); rect(g, hx - 1, top + 9, 3, 1, PAL.metal[3]); hline(g, hx - 3, top + 5, 2, PAL.ink[1]); hline(g, hx + 1, top + 5, 2, PAL.ink[1]); }
  // oreja
  px(g, hx - 5, top + 5, sk[3]); px(g, hx + 5, top + 5, sk[2]);
}

// ------------------------------------------------------------------ props
function openDoor(g) {
  const x = 8, y = 30, w = 28, h = 66;
  rect(g, x - 3, y - 3, w + 6, h + 3, PAL.wood[1]);
  rect(g, x - 2, y - 2, w + 4, h + 2, PAL.wood[3]); hline(g, x - 2, y - 2, w + 4, PAL.wood[5]); vline(g, x - 2, y - 2, h + 2, PAL.wood[5]);
  // el hueco: pasillo/Pajarera cálida al fondo
  gradV(g, x, y, w, h, [PAL.ink[0], PAL.ink[1], PAL.wood[1], PAL.wood[2]]);
  glow(g, x + 12, y + h - 6, 18, 12, PAL.gold[5], 0.4);
  rect(g, x + 6, y + 40, 14, 20, PAL.wood[2]); rect(g, x + 8, y + 42, 10, 16, PAL.gold[2]);   // la Pajarera, a lo lejos
  rect(g, x + 10, y + 36, 5, 5, PAL.paper[3]);
  // hoja de la puerta abierta, vista de canto, hacia dentro
  poly(g, [[x + w - 1, y], [x + w + 1, y + 2], [x + w + 1, y + h], [x + w - 1, y + h]], PAL.wood[4]);
  rect(g, x + w - 5, y, 5, h, PAL.wood[3]); vline(g, x + w - 5, y, h, PAL.wood[5]); vline(g, x + w - 1, y, h, PAL.wood[1]);
  rect(g, x + w - 4, y + 34, 2, 3, PAL.gold[4]);
  // cuña de madera que la mantiene abierta
  poly(g, [[x + 2, y + h + 1], [x + 8, y + h + 1], [x + 8, y + h + 3], [x, y + h + 3]], PAL.wood[5]);
}

function cartelSalida(g) {
  const x = 40, y = 30, w = 62, h = 30;
  ditherOverlay(g, x + 2, y + 2, w, h, PAL.shadow, 0.4);
  rect(g, x, y, w, h, PAL.paper[7]); frameRect(g, x, y, w, h, PAL.red[3]); frameRect(g, x + 1, y + 1, w - 2, h - 2, PAL.red[4]);
  label(g, 'SALIDA:', x + (w >> 1), y - 1, PAL.red[3], { align: 'center' });
  tiny(g, 'AL TERMINAR EL', x + (w >> 1), y + 12, PAL.ink[2], { align: 'center' });
  tiny(g, 'ORDEN DEL DÍA', x + (w >> 1), y + 19, PAL.ink[2], { align: 'center' });
  // flecha que apunta a la puerta
  poly(g, [[x + 4, y + 24], [x + 9, y + 21], [x + 9, y + 27]], PAL.red[3]); hline(g, x + 9, y + 24, 6, PAL.red[3]);
  // cinta en las esquinas
  for (const [cx, cy] of [[x - 2, y - 1], [x + w - 5, y - 1]]) rect(g, cx, cy, 7, 3, PAL.paper[4]);
}

function carteles(g) {
  // carteles a mano pegados unos encima de otros, en guerra
  const sheets = [
    [41, 62, 38, 13, PAL.gold[5], ['NO DEJEIS', 'TAZAS'], PAL.ink[2]],
    [60, 64, 34, 13, PAL.paper[7], ['LAS TAZAS', 'SON DE DIR.'], PAL.blue[3]],
    [41, 74, 36, 13, '#f4c0c8', ['NO ES UN', 'OFFICE'], PAL.red[3]],
    [58, 77, 36, 13, PAL.teal[6], ['CARTEL', 'RESERVADO'], PAL.ink[2]],
    [44, 83, 49, 11, PAL.paper[6], ['QUIEN CAMBIO'], PAL.ink[3]],
  ];
  for (const [x, y, w, h, c, ls, ink] of sheets) {
    ditherOverlay(g, x + 1, y + 1, w, h, PAL.shadow, 0.4);
    rect(g, x, y, w, h, c); hline(g, x, y, w, shade(c, 0.25)); hline(g, x, y + h - 1, w, shade(c, -0.2));
    ls.forEach((s, i) => tiny(g, s, x + 2, y + 2 + i * 6, ink));
    rect(g, x + (w >> 1) - 2, y - 1, 5, 2, PAL.paper[4]);
  }
}

function tableAndChairs(g) {
  const Wd = PAL.wood;
  // mesa
  shadowEllipse(g, 190, 103, 100, 4, 0.7);
  poly(g, [[102, 82], [280, 82], [288, 96], [94, 96]], (xx, yy) => ditherPick(xx, yy, [Wd[3], Wd[4], Wd[5], Wd[6]], 0.05 + (yy - 82) / 14 * 0.75));
  paint(g, 94, 82, 194, 14, (xx, yy) => ((hash2(xx >> 3, yy, 3) < 0.05) ? Wd[2] : (yy === 89 + ((xx >> 4) & 1) ? Wd[3] : null)));
  hline(g, 102, 82, 178, Wd[5]); hline(g, 94, 96, 194, Wd[7]); hline(g, 94, 97, 194, Wd[2]);
  gradV(g, 94, 98, 194, 5, [Wd[3], Wd[1]]);
  rect(g, 94, 98, 4, 5, Wd[1]); rect(g, 284, 98, 4, 5, Wd[0]);
  // brillo de la barniz (luz del techo)
  ditherOverlay(g, 120, 84, 70, 3, '#fff4c8', 0.3); ditherOverlay(g, 210, 85, 40, 2, '#fff4c8', 0.25); ditherOverlay(g, 100, 90, 60, 2, '#fff4c8', 0.2);
  // arañas de conferencia y cajas de conexión
  ellipse(g, 190, 89, 6, 2, PAL.ink[1]); px(g, 190, 88, PAL.metal[5]); for (const dx of [-4, 4]) px(g, 190 + dx, 89, PAL.metal[4]);
  rect(g, 150, 91, 4, 2, PAL.ink[2]); rect(g, 262, 91, 4, 2, PAL.ink[2]);
  // MINI-CRUASANES: bandeja de acero con migas y medio cruasán
  {
    const x = 128, y = 86;
    ellipse(g, x + 12, y + 3, 13, 3, PAL.metal[5]); ellipse(g, x + 12, y + 2, 12, 2, PAL.metal[7]);
    ellipse(g, x + 7, y + 1, 3, 1.6, PAL.gold[4]); px(g, x + 6, y, PAL.gold[6]);
    ellipse(g, x + 14, y + 2, 2, 1.2, PAL.gold[3]);
    for (let i = 0; i < 9; i++) px(g, x + 3 + Math.floor(hash2(i, 1, 4) * 18), y + 1 + Math.floor(hash2(i, 2, 4) * 3), PAL.gold[2 + (i % 3)]);
    px(g, x + 19, y + 2, PAL.gold[5]); px(g, x + 20, y + 3, PAL.gold[5]);
  }
  // CATORCE BOTELLINES sin abrir, alineados
  for (let i = 0; i < 14; i++) {
    const bx = 176 + i * 4, by = 84;
    rect(g, bx, by + 2, 3, 7, PAL.teal[5]); vline(g, bx, by + 2, 7, PAL.teal[7]); vline(g, bx + 2, by + 3, 6, PAL.teal[3]);
    rect(g, bx + 1, by, 1, 2, PAL.teal[6]); px(g, bx + 1, by - 1, PAL.white);
    hline(g, bx, by + 5, 3, PAL.paper[6]);
  }
  // sillas del lado cercano (de espaldas), una arrimada y otra empujada
  chairBack(g, 166, 107, { jacket: null, turn: 1, col: [PAL.teal[0], PAL.teal[1], PAL.teal[2], PAL.teal[3], PAL.teal[4]] });
  chairBack(g, 249, 106, { jacket: null, turn: -1, col: [PAL.teal[0], PAL.teal[1], PAL.teal[2], PAL.teal[3], PAL.teal[4]] });
}
const drawTable = cacheDraw('sala-mesa', 70, 60, 240, 56, tableAndChairs);

const TEAL = [PAL.teal[0], PAL.teal[1], PAL.teal[2], PAL.teal[3], PAL.teal[4]];
function farChairs(g) {
  // sillas de la cara lejana (de frente a nosotros; las ocupadas las tapan los figurantes en su objeto) y la cabecera
  for (const [cx, by] of [[112, 94], [136, 95], [160, 94], [184, 95], [208, 94], [236, 95], [257, 94], [278, 95]]) chairBack(g, cx, by, { jacket: null, col: TEAL });
  chairBack(g, 92, 99, { jacket: null, turn: 1, col: [PAL.red[0], PAL.red[1], PAL.red[2], PAL.red[3], PAL.red[4]] });
}

function windowRight(g) {
  const x = 232, y = 22, w = 52, h = 42;
  cityWindow(g, x, y, w, h, { sky: 'night', seed: 44, mullions: true });
  rainyGlassStatic(g, x, y, w, h, 7);
  blinds(g, x, y + 1, w, h, { down: 12, color: PAL.paper });
}

function jungleWallpaper(g) {
  gradV(g, 0, 76, W, 22, [PAL.leaf[2], PAL.leaf[1], PAL.leaf[1]]);
  const r = rng(909);
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(r() * W), y = 78 + Math.floor(r() * 18), ang = r() * Math.PI;
    const l = 4 + Math.floor(r() * 5);
    for (let k = 0; k < l; k++) {
      const wd = Math.max(1, Math.round(Math.sin((k / l) * Math.PI) * 2));
      rect(g, Math.round(x + Math.cos(ang) * k), Math.round(y + Math.sin(ang) * k), wd, 1, [PAL.leaf[3], PAL.leaf[4], PAL.leaf[2]][i % 3]);
    }
  }
  hline(g, 0, 76, W, PAL.wood[6]); hline(g, 0, 77, W, PAL.wood[4]); hline(g, 0, 78, W, PAL.wood[1]);
}

function cartTele(g) {
  // tele apagada en la pared (la pantalla encendida la pinta el objeto, solo Actos I-II)
  const x = 288, y = 24, w = 30, h = 26;
  rect(g, x + 13, y + h, 4, 4, PAL.metal[3]);
  rect(g, x - 1, y - 1, w + 2, h + 2, PAL.ink[0]); frameRect(g, x - 1, y - 1, w + 2, h + 2, PAL.metal[2]);
  gradV(g, x, y, w, h, [PAL.ink[2], PAL.ink[0]]);
  g.save(); g.globalAlpha = 0.1; poly(g, [[x + 3, y + h], [x + 10, y + h], [x + 22, y], [x + 15, y]], '#ffffff'); g.restore();
  // pegatina: PULSAR ENTRADA 3. NO, LA 2. NO.
  rect(g, x - 2, y + h + 3, 34, 13, POSTIT.y); hline(g, x - 2, y + h + 3, 34, '#fff48a');
  tiny(g, 'PULSA 3.', x, y + h + 4, PAL.ink[2]); tiny(g, 'NO, LA 2', x, y + h + 10, PAL.ink[2]);
  // caja de cables desbordada sobre un carrito
  const bx = 290, by = 70;
  shadowEllipse(g, bx + 14, 98, 17, 3, 0.7);
  rect(g, bx, by + 6, 28, 20, PAL.metal[3]); hline(g, bx, by + 6, 28, PAL.metal[6]); vline(g, bx, by + 6, 20, PAL.metal[5]); vline(g, bx + 27, by + 6, 20, PAL.metal[1]);
  rect(g, bx + 2, by + 8, 24, 4, PAL.ink[1]);
  rect(g, bx + 2, by + 26, 3, 3, PAL.ink[0]); rect(g, bx + 23, by + 26, 3, 3, PAL.ink[0]);
  const r = rng(1414);
  const cc = [PAL.ink[0], PAL.metal[4], PAL.red[4], PAL.blue[4], PAL.gold[4], PAL.paper[6]];
  for (let i = 0; i < 14; i++) {
    const sx = bx + 3 + Math.floor(r() * 22), sy = by + 7;
    cable(g, sx, sy, sx + Math.floor((r() - 0.5) * 22), by + 20 + Math.floor(r() * 10), 4 + Math.floor(r() * 4), cc[i % cc.length], 12);
  }
  for (let i = 0; i < 7; i++) { const ax = bx + 3 + Math.floor(r() * 20); rect(g, ax, by + 4, 3, 3, PAL.ink[2]); px(g, ax + 1, by + 4, PAL.metal[6]); }
  // un cable que encaja consigo mismo (feliz)
  ellipse(g, bx + 8, by + 22, 3, 2, PAL.red[3]); ellipse(g, bx + 8, by + 22, 1.5, 1, PAL.ink[1]);
}

function projectorBody(g) {
  const x = 152, y = 3;
  rect(g, x + 7, 0, 2, 4, PAL.metal[3]);
  bevel(g, x, y, 16, 8, PAL.paper[4], PAL.paper[6], PAL.paper[2]);
  rect(g, x + 10, y + 2, 4, 4, PAL.ink[1]); ellipse(g, x + 12, y + 4, 2, 2, PAL.metal[1]);
  px(g, x + 3, y + 3, PAL.red[3]);
  rect(g, x + 2, y + 6, 8, 1, PAL.paper[1]);
}

// ------------------------------------------------------------------ fondo
function drawRoom(g) {
  gradV(g, 0, 0, W, 15, [PAL.ink[1], PAL.metal[1], PAL.metal[2]]);
  for (let x = 0; x < W; x += 40) vline(g, x, 0, 14, PAL.ink[0]);
  hline(g, 0, 6, W, PAL.ink[1]); hline(g, 0, 14, W, PAL.metal[1]);
  wall(g, 0, 15, W, 62, [PAL.green[3], PAL.green[4], PAL.green[5], PAL.green[6]], { seed: 6 });
  // friso de hojas en la pared (selva)
  jungleWallpaper(g);
  baseboard(g, 0, 94, W, 4, PAL.wood);
  floorTiles(g, { x: 0, y: FL, w: W, h: 46, vpx: 160, vpy: 30, tile: 22, rowPx: 9, colors: ['#2e5a48', '#295040'], colors3: '#244838', grout: '#1a3328', far: PAL.ink[1], fade: 0.42 });
  ditherOverlay(g, 0, FL, W, 4, PAL.ink[0], 0.5);
  // migas y papeles en la moqueta (reunión eterna)
  { const r = rng(808); for (let i = 0; i < 18; i++) { const x = 20 + Math.floor(r() * 280), y = 107 + Math.floor(r() * 32); ditherOverlay(g, x, y, 3 + Math.floor(r() * 5), 1 + Math.floor(r() * 2), PAL.ink[0], 0.3); } for (let i = 0; i < 5; i++) { const x = 30 + Math.floor(r() * 250), y = 112 + Math.floor(r() * 26); rect(g, x, y, 4, 2, PAL.paper[6]); } }

  for (const x of [24, 140, 256]) fluorescent3(g, x);
  for (const x of [24, 140, 256]) glow(g, x + 18, 20, 48, 22, '#e8fff0', 0.1);

  openDoor(g);
  cartelSalida(g);
  carteles(g);
  wallClock(g, 78, 22, 6);
  // pantalla (marco; el contenido es del objeto orden_del_dia)
  rect(g, OK.x - 3, OK.y - 3, OK.w + 6, OK.h + 6, PAL.metal[5]); frameRect(g, OK.x - 3, OK.y - 3, OK.w + 6, OK.h + 6, PAL.metal[2]);
  hline(g, OK.x - 2, OK.y - 2, OK.w + 4, PAL.metal[7]);
  windowRight(g);
  farChairs(g);
  cartTele(g);
  projectorBody(g);
  ditherOverlay(g, 0, 15, W, 5, PAL.ink[0], 0.12);
  fadeRows(g, 0, FL, W, 8, PAL.ink[0], 0.35, 0, 4);
  vignette(g, W, 144, 0.42);
}
function fluorescent3(g, x) {
  rect(g, x - 1, 10, 38, 5, PAL.metal[2]); rect(g, x, 11, 36, 3, '#fbfff0'); ditherOverlay(g, x - 6, 15, 48, 3, '#eef4e0', 0.25);
}

// ------------------------------------------------------------------ objetos
function drawOrden(g, view, t) {
  const { x, y, w, h } = OK;
  const a3 = !!view.flag('acto_3_iniciado');
  if (a3) {
    // proyección: diapositiva 247 de 400 (o 248)
    const st = String(view.objState('proyector') ?? '');
    const s248 = /248/.test(st);
    rect(g, x, y, w, h, '#eef2f4');
    rect(g, x, y, w, 7, PAL.blue[3]);
    tiny(g, 'ELCONTABLE.ES', x + 4, y + 1, PAL.paper[7]);
    tiny(g, s248 ? '248 / 400' : '247 / 400', x + w - 4, y + 1, PAL.gold[5], { align: 'right' });
    label(g, 'SINERGIAS', x + (w >> 1), y + 6, PAL.blue[3], { align: 'center' });
    tiny(g, 'EXPONENCIALES:', x + (w >> 1), y + 20, PAL.red[3], { align: 'center' });
    tiny(g, s248 ? 'EL VIAJE CONTINUA' : 'EL VIAJE', x + (w >> 1), y + 28, PAL.ink[2], { align: 'center' });
    // flecha circular absurda
    for (let i = 0; i < 6; i++) rect(g, x + 8 + i * 3, y + 33 - ((i * i) >> 3), 2, 2, PAL.teal[4]);
    for (let i = 0; i < 6; i++) rect(g, x + w - 26 + i * 3, y + 33 - ((i * i) >> 3), 2, 2, PAL.gold[4]);
    return;
  }
  const done = !!view.flag('reunion_terminada');
  rect(g, x, y, w, h, PAL.paper[7]);
  rect(g, x, y, w, 8, PAL.blue[4]);
  tiny(g, 'ORDEN DEL DÍA', x + (w >> 1), y + 2, PAL.paper[7], { align: 'center' });
  const lines = ['1. PREVISIÓN', '2. PREVISIÓN DE LA PREVISIÓN', '3. SIGUIENTES PASOS'];
  lines.forEach((s, i) => {
    const ly = y + 12 + i * 9;
    tiny(g, s, x + 6, ly, PAL.ink[2]);
    if (done) { hline(g, x + 4, ly + 2, 4 * s.length + 1, PAL.red[3]); hline(g, x + 4, ly + 3, 4 * s.length + 1, PAL.red[4]); }
  });
  // el punto 3 lleva tocado desde marzo: sombra de dedo; si no, mancha de café
  if (!done) ellipse(g, x + w - 14, y + 31, 4, 3, PAL.wood[5]);
  if ((Math.floor(t / 700) & 1) === 0) px(g, x + w - 4, y + h - 3, PAL.crt[4]);
  ditherOverlay(g, x, y, w, 3, '#ffffff', 0.12);
}

function drawProyector(g, view, t) {
  const x = 152, y = 3;
  rect(g, x + 10, y + 2, 4, 4, '#fffbe0'); ellipse(g, x + 12, y + 4, 2, 2, '#ffffff');
  glow(g, x + 12, y + 5, 10, 8, '#ffffff', 0.4, 3);
  px(g, x + 3, y + 3, (Math.floor(t / 500) & 1) ? '#ff4030' : PAL.red[1]);
  // haz de luz hacia la pantalla
  lightCone(g, x + 12, y + 6, 4, 120, 44, '#fffbe8', 0.3);
}

function drawTele(g, view, t) {
  const x = 288, y = 24, w = 30, h = 26;
  const n = Number(view.flag('tele_n')) || 0;
  const m = n === 0 ? 0 : ((n - 1) % 5) + 1;
  const sx = x + 1, sy = y + 1, sw = w - 2, sh = h - 2;
  const lab = ['SEÑAL?', 'ENTR.1', 'ENTR.2', 'ENTR.3', 'BUSCA', 'ENTR.5'][m];
  if (m === 0) {
    rect(g, sx, sy, sw, sh, PAL.blue[2]);
    for (let i = 0; i < 6; i++) { const ww = 4 + (i * 5) % 7; rect(g, sx + 2 + (i * 3) % 10, sy + 2 + i * 3, ww, 1, PAL.blue[4]); }
  } else if (m === 1) {          // cámara del vestíbulo: Celestino narrándole el Ibex al ficus
    rect(g, sx, sy, sw, sh, PAL.paper[3]); rect(g, sx, sy + 14, sw, 9, PAL.paper[2]);
    ellipse(g, sx + 20, sy + 12, 4, 6, PAL.leaf[4]); rect(g, sx + 18, sy + 17, 4, 4, PAL.red[3]);
    rect(g, sx + 6, sy + 8, 5, 10, PAL.blue[3]); ellipse(g, sx + 8, sy + 6, 2, 2, PAL.skin[3]);
    rect(g, sx + 3, sy + 4, 5, 1, PAL.red[4]);
  } else if (m === 2) {          // el tiempo de ayer, en diferido
    gradV(g, sx, sy, sw, sh, [PAL.blue[3], PAL.blue[5]]);
    ellipse(g, sx + 9, sy + 8, 4, 3, PAL.paper[7]); ellipse(g, sx + 13, sy + 9, 5, 3, PAL.paper[6]);
    for (let i = 0; i < 5; i++) vline(g, sx + 6 + i * 3, sy + 14, 4, PAL.blue[7]);
  } else if (m === 3) {          // Ramírez congelado con cruasán, 2019
    rect(g, sx, sy, sw, sh, PAL.teal[2]);
    ellipse(g, sx + 14, sy + 10, 4, 5, PAL.skin[4]); rect(g, sx + 9, sy + 15, 11, 8, PAL.paper[4]);
    ellipse(g, sx + 21, sy + 11, 3, 1.5, PAL.gold[5]);
    hline(g, sx, sy + 3, sw, PAL.teal[5]);
    ditherOverlay(g, sx, sy, sw, sh, PAL.metal[6], 0.15);
  } else if (m === 4) {
    rect(g, sx, sy, sw, sh, PAL.ink[1]);
    const k = Math.floor(t / 250) % 4;
    for (let i = 0; i <= k; i++) px(g, sx + 6 + i * 3, sy + 11, PAL.paper[6]);
  } else {
    rect(g, sx, sy, sw, sh, PAL.paper[6]);
    rect(g, sx, sy, sw, 5, PAL.blue[3]);
    tiny(g, 'CERO PAPEL', sx + 15, sy + 6, PAL.ink[2], { align: 'center' });
    tiny(g, '400/0', sx + 15, sy + 12, PAL.red[3], { align: 'center' });
    // Herminia, enchufada por cable
    rect(g, sx + 11, sy + 18, 9, 4, PAL.metal[5]);
  }
  tiny(g, lab, sx + 1, sy + sh - 6, m === 0 || m === 4 ? PAL.paper[6] : PAL.ink[2]);
  ditherOverlay(g, sx, sy, sw, 2, '#ffffff', 0.12);
  glow(g, x + w / 2, y + h / 2, 30, 20, m === 1 || m === 5 ? '#f4ffe0' : '#8ec8ff', 0.13, 3);
}

function drawFigurantes(g, view, t) {
  const b = Math.round(Math.sin(t / 900) * 0.6 + 0.3);
  personFront(g, 236, 62 + b, { hair: PAL.ink[3], suit: JACKETS.grey, tie: PAL.red[4], tilt: -1 });
  personFront(g, 257, 64 + b, { hair: PAL.wood[2], suit: JACKETS.navy, tilt: 1 });
  personFront(g, 278, 62 - b, { hair: PAL.ink[2], suit: JACKETS.olive, beard: true, tie: PAL.gold[4] });
}

function drawPlanillo(g) {
  const x = 100, y = 84;
  poly(g, [[x + 2, y], [x + 18, y], [x + 20, y + 6], [x, y + 6]], PAL.paper[7]);
  hline(g, x, y + 6, 20, PAL.paper[3]);
  for (let i = 0; i < 4; i++) vline(g, x + 4 + i * 4, y, 6, PAL.blue[5]);
  hline(g, x + 1, y + 3, 18, PAL.blue[5]);
  rect(g, x + 6, y + 1, 4, 2, PAL.red[3]); rect(g, x + 12, y + 4, 4, 2, PAL.teal[5]);
}

// ------------------------------------------------------------------ geometría
const layout = {
  sala_a_pajarera: { rect: [2, 26, 36, 72], walkTo: [28, 109], face: 'left' },
  cartel_salida: { rect: [38, 28, 62, 33], walkTo: [60, 110], face: 'up' },
  proyector: { rect: [148, 0, 24, 16], walkTo: [160, 108], face: 'up', priority: 2, layer: 'front', draw: drawProyector },
  orden_del_dia: { rect: [102, 14, 126, 46], walkTo: [162, 108], face: 'up', draw: drawOrden },
  planillo_mesa: { rect: [98, 82, 24, 10], walkTo: [108, 116], face: 'up', priority: 1, layer: 'sorted', zy: 104, draw: drawPlanillo },
  minicruasanes: { rect: [126, 83, 30, 11], walkTo: [140, 116], face: 'up' },
  botellines: { rect: [174, 80, 60, 15], walkTo: [204, 116], face: 'up', layer: 'sorted', zy: 103, draw: drawTable },
  figurantes_mercados: { rect: [222, 58, 66, 38], walkTo: [256, 114], face: 'up', priority: 1, draw: drawFigurantes },
  // ADENDA
  tele_amazonas: { rect: [286, 22, 34, 42], walkTo: [304, 112], face: 'up', draw: drawTele },
  caja_cables: { rect: [288, 70, 32, 30], walkTo: [304, 113], face: 'up' },
  carteles_amazonas: { rect: [40, 62, 54, 30], walkTo: [64, 110], face: 'up' },
  // PNJ
  gervasio_acta: { at: [84, 106, 'right'], positions: { preside: { at: [84, 106, 'right'] }, rincon: { at: [292, 112, 'left'] } } },
  lector_medio: { at: [160, 92, 'down'], walkTo: [160, 114], face: 'up' },
  inigo_sinergia: { at: [222, 114, 'left'] },
};
void noise; void gradH; void hash2; void bevel; void door; void mix; void lcd; void postit; void wainscot; void floorTiles; void wall;

export default {
  room: 'sala_amazonas',
  width: W,
  scale: { yFar: 100, far: 0.86, yNear: 142, near: 1.0 },
  walkboxes: [{ id: 'suelo', poly: [[4, 104], [316, 104], [318, 142], [2, 142]] }],
  entries: { pajarera: [30, 114, 'right'] },
  layout,
  draw: drawRoom,
  animate(g, view, t) {
    rainOnGlass(g, 232, 22, 52, 42, t, 6);
  },
  // penumbra del Acto III (la pantalla del proyector queda iluminada)
  overlay(g, view, t) {
    if (!view.flag('acto_3_iniciado')) return;
    g.save();
    g.beginPath();
    g.rect(0, 0, W, 144);
    g.rect(OK.x - 3, OK.y - 3, OK.w + 6, OK.h + 6);
    g.clip('evenodd');
    g.globalAlpha = 0.44; g.fillStyle = '#080c24'; g.fillRect(0, 0, W, 144);
    g.restore();
    g.save(); g.globalAlpha = 0.07 + 0.02 * Math.sin(t / 300); glow(g, 164, 40, 90, 34, '#f0f8ff', 0.5, 4); g.restore();
  },
};
