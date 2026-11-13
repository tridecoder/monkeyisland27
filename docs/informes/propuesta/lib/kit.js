// PROPUESTA ALTERNATIVA · kit del sistema de diseño (señalética, umbrales, puertas, ascensor, escalera, zonas).
// Se apoya SOLO en los helpers y la paleta del juego (engine/draw.js, lib-oficina.js), en lectura. Pensado para portarse
// tal cual a content/rooms/art/lib-kit.js (o a engine/draw.js) cuando la dirección apruebe la propuesta.
import {
  PAL, rect, hline, vline, frameRect, px, line, poly, ellipse, paint, bevel, ditherOverlay, gradV, gradH, noise,
  glow, shadowEllipse, ditherPick, hash2, shade, mix, label, measureText, fadeRows,
} from '../../../../engine/draw.js';
import { tiny, tinyW } from '../../../../content/rooms/art/lib-oficina.js';

// ------------------------------------------------------------------ código de color
// Planta → banda de la placa (número de planta). Departamento → acento (filete, suelo de zona, luz).
export const PLANTA = {
  '-1': { nombre: 'P-1', c: '#3c8ad8', l: '#8cc4ff', d: '#1c3c6c' },   // azul técnico
  '0': { nombre: 'P0', c: '#3f9a5a', l: '#8ad69a', d: '#1c4a2a' },     // verde vestíbulo
  '1': { nombre: 'P1', c: '#2fa6a0', l: '#86e2d8', d: '#145450' },     // verde agua Redacción
  '2': { nombre: 'P2', c: '#9a5ad0', l: '#d0a4f4', d: '#4a2470' },     // lila planta 2
};
export const DEPTO = {
  web: { nombre: 'WEB', c: '#2fa6a0', suelo: ['#2a3a4c', '#33465a', '#3c5268'] },
  infografia: { nombre: 'INFOGRAFÍA', c: '#e8a030', suelo: ['#3c3428', '#4a4030', '#584c38'] },
  redaccion: { nombre: 'REDACCIÓN', c: '#5ab0e8', suelo: ['#2c3448', '#353e54', '#3e4862'] },
  desarrollo: { nombre: 'DESARROLLO', c: '#9a6ae0', suelo: ['#2e2a44', '#38324f', '#423b5c'] },
  diseno: { nombre: 'DISEÑO Y PRODUCTO', c: '#f0f0e8', suelo: ['#6a6a70', '#7c7c84', '#8e8e96'] },
  direccion: { nombre: 'DIRECCIÓN', c: '#d8a040', suelo: ['#4a2e1c', '#5a3a24', '#6a462c'] },
  office: { nombre: 'OFFICE', c: '#f0d060', suelo: ['#6a5a3a', '#7a6a44', '#8a7a50'] },
  papel: { nombre: 'PAPEL', c: '#c89050', suelo: ['#3a2618', '#4a3220', '#5a3e28'] },
  marketing: { nombre: 'MARKETING', c: '#ff5aa8', suelo: ['#3e2a4a', '#4a3258', '#563a66'] },
  eventos: { nombre: 'EVENTOS', c: '#e04050', suelo: ['#3a1420', '#4a1a28', '#5a2030'] },
  comercial: { nombre: 'COMERCIAL', c: '#f08a30', suelo: ['#3e2e3a', '#4a3646', '#563e52'] },
  administracion: { nombre: 'ADMINISTRACIÓN', c: '#8ac060', suelo: ['#2e3a2c', '#384634', '#42523c'] },
  sistemas: { nombre: 'SISTEMAS', c: '#3c8ad8', suelo: ['#1e2a3c', '#263448', '#2e3e54'] },
};

const INK = '#141220', INK2 = '#24203a', PAPEL = '#f2ecd8';

// ------------------------------------------------------------------ PLACA DE DESTINO (una sola para todo el edificio)
// Fondo tinta, marco claro de 1 px, banda izquierda con el color de la PLANTA y su número, nombre en la fuente del juego
// (mayúsculas, 7 px de altura de caja) y flecha opcional. Altura fija 13 px. Devuelve el ancho.
export function placa(g, x, y, texto, o = {}) {
  const pl = PLANTA[o.planta ?? '1'];
  const flecha = o.flecha || null;            // '<' '>' '^' 'v' | null
  const tw = measureText(texto);
  const band = o.sinPlanta ? 0 : 11;
  const fw = flecha ? 8 : 0;
  const w = band + 4 + tw + 4 + fw;
  const h = 13;
  ditherOverlay(g, x + 1, y + 1, w, h, PAL.shadow, 0.55);
  rect(g, x, y, w, h, INK);
  frameRect(g, x, y, w, h, o.marco || '#c8c4d8');
  hline(g, x + 1, y + 1, w - 2, INK2);
  if (band) {
    rect(g, x + 1, y + 1, band - 1, h - 2, pl.c); vline(g, x + 1, y + 1, h - 2, pl.l); vline(g, x + band - 1, y + 1, h - 2, pl.d);
    tiny(g, String(o.planta ?? '1').replace('-', '-'), x + 1 + ((band - 1 - tinyW(String(o.planta ?? '1'))) >> 1), y + 4, INK);
  }
  label(g, texto, x + band + 4, y - 1, o.color || PAPEL);
  if (o.depto) hline(g, x + band + 3, y + h - 3, tw + 2, DEPTO[o.depto].c);
  if (flecha) flechaPx(g, x + w - fw + 1, y + 3, flecha, o.color || PAPEL);
  return w;
}
export function placaW(texto, o = {}) { return (o.sinPlanta ? 0 : 11) + 8 + measureText(texto) + (o.flecha ? 8 : 0); }
// flecha de 6x7
export function flechaPx(g, x, y, dir, c) {
  const A = {
    '>': ['..#...', '..##..', '######', '#######'.slice(0, 6), '######', '..##..', '..#...'],
    '<': ['...#..', '..##..', '######', '######', '######', '..##..', '...#..'],
    '^': ['..##..', '.####.', '######', '..##..', '..##..', '..##..', '..##..'],
    'v': ['..##..', '..##..', '..##..', '..##..', '######', '.####.', '..##..'],
  }[dir];
  if (!A) return;
  A.forEach((row, r) => { for (let q = 0; q < row.length; q++) if (row[q] === '#') px(g, x + q, y + r, c); });
}

// ------------------------------------------------------------------ RÓTULO DE DEPARTAMENTO (colgado del techo o en la pared)
// Bandera horizontal: filete de color del departamento arriba (2 px), nombre en la fuente del juego. Altura 14 px.
export function rotuloDepto(g, x, y, depto, o = {}) {
  const d = DEPTO[depto];
  const texto = o.texto || d.nombre;
  const w = measureText(texto) + 10, h = 14;
  if (o.colgado) { vline(g, x + 3, y - (o.colgado), o.colgado, PAL.metal[2]); vline(g, x + w - 4, y - (o.colgado), o.colgado, PAL.metal[2]); }
  ditherOverlay(g, x + 1, y + 1, w, h, PAL.shadow, 0.5);
  rect(g, x, y, w, h, o.fondo || '#f4f0e4');
  rect(g, x, y, w, 2, d.c); hline(g, x, y + 2, w, shade(d.c, -0.3));
  hline(g, x, y + h - 1, w, shade(o.fondo || '#f4f0e4', -0.35)); vline(g, x + w - 1, y + 2, h - 2, shade(o.fondo || '#f4f0e4', -0.25));
  label(g, texto, x + 5, y + 1, o.color || INK);
  return w;
}
export function rotuloDeptoW(depto, o = {}) { return measureText(o.texto || DEPTO[depto].nombre) + 10; }

// ------------------------------------------------------------------ UMBRAL (felpudo/franja de suelo ante cada salida)
// Cuadrilátero en perspectiva con el color de la planta/departamento de DESTINO + franja clara de 1 px en el borde de pisada.
export function umbral(g, x, y, w, h, color, o = {}) {
  const sk = o.sesgo ?? 3;
  poly(g, [[x + sk, y], [x + w - sk, y], [x + w, y + h], [x, y + h]], (xx, yy) => ditherPick(xx, yy, [shade(color, -0.45), shade(color, -0.3)], 0.3 + ((xx * 3 + yy) & 3) * 0.1));
  line(g, x, y + h, x + w, y + h, shade(color, 0.25));
  line(g, x + sk, y, x + w - sk, y, shade(color, -0.6));
  if (o.chevron) { // chevrones de dirección (gastados)
    const cx = x + (w >> 1), cy = y + (h >> 1);
    for (let i = -1; i <= 1; i++) { px(g, cx - 2 + i * 6, cy, shade(color, 0.1)); px(g, cx - 1 + i * 6, cy - 1, shade(color, 0.1)); px(g, cx - 1 + i * 6, cy + 1, shade(color, 0.1)); }
  }
}

// ------------------------------------------------------------------ JAMBA de puerta con placa (kit de puerta)
// Marco metálico común a todas las puertas interiores (3 px), con tope inferior; la hoja la pinta cada sala.
export function marcoPuerta(g, x, y, w, h, o = {}) {
  const m = o.ramp || PAL.metal;
  rect(g, x - 3, y - 3, w + 6, h + 3, m[1]);
  rect(g, x - 2, y - 2, w + 4, h + 2, m[4]);
  hline(g, x - 2, y - 2, w + 4, m[6]); vline(g, x - 2, y - 2, h + 2, m[6]); vline(g, x + w + 1, y - 2, h + 2, m[2]);
  rect(g, x - 3, y + h - 1, w + 6, 1, m[2]);
}

// Puerta ABIERTA hacia otra estancia: hueco con la luz/suelo del destino + hoja de canto.
export function huecoAbierto(g, x, y, w, h, o = {}) {
  const fondo = o.fondo || [PAL.ink[0], PAL.ink[1], PAL.wood[1], PAL.wood[2]];
  gradV(g, x, y, w, h, fondo);
  if (o.luz) glow(g, x + (w >> 1), y + h - 6, w * 0.7, 12, o.luz, 0.45);
  if (o.suelo) poly(g, [[x, y + h - 10], [x + w, y + h - 10], [x + w, y + h], [x, y + h]], (xx, yy) => ditherPick(xx, yy, o.suelo, (yy - (y + h - 10)) / 10));
  // hoja de canto, hacia dentro
  const lx = o.hojaIzq ? x : x + w - 5;
  rect(g, lx, y, 5, h, (o.hoja || PAL.wood)[3]); vline(g, lx, y, h, (o.hoja || PAL.wood)[5]); vline(g, lx + 4, y, h, (o.hoja || PAL.wood)[1]);
  rect(g, lx + (o.hojaIzq ? 3 : 1), y + (h * 0.52 | 0), 1, 3, PAL.gold[5]);
}

// ------------------------------------------------------------------ ASCENSOR (mismo en las 4 plantas)
export function ascensor(g, x, y, w, h, planta, o = {}) {
  marcoPuerta(g, x, y, w, h, { ramp: PAL.metal });
  // indicador de planta encima
  rect(g, x + (w >> 1) - 9, y - 12, 18, 8, INK); frameRect(g, x + (w >> 1) - 9, y - 12, 18, 8, PAL.metal[3]);
  tiny(g, String(planta), x + (w >> 1) - (tinyW(String(planta)) >> 1) + 2, y - 10, '#ff6a40');
  flechaMini(g, x + (w >> 1) - 7, y - 10, '#ff6a40');
  // hojas de acero cepillado
  const half = w >> 1;
  for (const [hx, hw] of [[x, half], [x + half, w - half]]) {
    paint(g, hx, y, hw, h, (xx, yy) => ditherPick(xx, yy, [PAL.metal[3], PAL.metal[4], PAL.metal[5], PAL.metal[6]], 0.25 + ((xx - hx) / hw) * 0.5 + (hash2(xx, yy >> 3, 9) - 0.5) * 0.15));
    vline(g, hx, y, h, PAL.metal[6]); vline(g, hx + hw - 1, y, h, PAL.metal[2]);
  }
  vline(g, x + half, y, h, PAL.ink[1]);
  ditherOverlay(g, x, y, w, 6, PAL.metal[7], 0.25);
  // botonera a la derecha
  const bx = x + w + 4, by = y + (h * 0.42 | 0);
  rect(g, bx, by, 5, 11, PAL.metal[5]); frameRect(g, bx, by, 5, 11, PAL.metal[2]);
  px(g, bx + 2, by + 3, '#ffd060'); px(g, bx + 2, by + 7, PAL.metal[2]);
  if (o.cartel !== false) {
    // pictograma ascensor sobre la banda de planta
    const px0 = bx - 1, py0 = by - 16;
    rect(g, px0, py0, 8, 11, PLANTA[String(planta)].c); frameRect(g, px0, py0, 8, 11, PLANTA[String(planta)].d);
    rect(g, px0 + 2, py0 + 2, 4, 7, PAPEL); vline(g, px0 + 4, py0 + 2, 7, PLANTA[String(planta)].c);
  }
}
function flechaMini(g, x, y, c) { px(g, x + 1, y, c); hline(g, x, y + 1, 3, c); px(g, x + 1, y + 3, c); hline(g, x, y + 2, 3, '#4a1a10'); }

// ------------------------------------------------------------------ ESCALERA (tramo que sube o baja, vista frontal 3/4)
// Barandilla con pasamanos, peldaños con NARIZ AMARILLA (lenguaje común de «aquí cambias de planta»).
export function escalera(g, x, y, w, h, dir = 'sube', o = {}) {
  const n = o.peldanos || 8;
  const pared = o.pared || [PAL.metal[1], PAL.metal[2], PAL.metal[3]];
  gradV(g, x, y, w, h, [PAL.ink[0], pared[0], pared[1]]);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    if (dir === 'sube') {
      const sy = y + h - Math.round((i + 1) * h / n), sx = x + Math.round(t * w * 0.55);
      rect(g, sx, sy, w - Math.round(t * w * 0.55), Math.ceil(h / n), shade(pared[2], -0.1 + t * 0.2));
      hline(g, sx, sy, w - Math.round(t * w * 0.55), '#e8c030');
      hline(g, sx, sy + 1, w - Math.round(t * w * 0.55), shade(pared[2], 0.3));
    } else {
      // baja: hueco con peldaños que se alejan hacia abajo (se ven las narices)
      const sy = y + Math.round(i * h / n), sx = x + Math.round(t * 6);
      rect(g, sx, sy, w - Math.round(t * 12), Math.ceil(h / n), shade(pared[1], -0.15 - t * 0.35));
      hline(g, sx, sy, w - Math.round(t * 12), mix('#e8c030', PAL.ink[1], t * 0.7));
    }
  }
  // barandilla
  const ry = o.barandaY ?? (y - 4);
  line(g, x - 2, dir === 'sube' ? y + h - 8 : ry + 2, x + w, dir === 'sube' ? ry : ry + 10, PAL.metal[6]);
  line(g, x - 2, (dir === 'sube' ? y + h - 7 : ry + 3), x + w, (dir === 'sube' ? ry + 1 : ry + 11), PAL.metal[2]);
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const bx = Math.round(x - 2 + t * (w + 2));
    const by = dir === 'sube' ? Math.round(y + h - 8 + t * (ry - (y + h - 8))) : Math.round(ry + 2 + t * 8);
    vline(g, bx, by, dir === 'sube' ? Math.round(h * (1 - t) * 0.9) + 6 : 12, PAL.metal[4]);
  }
}

// ------------------------------------------------------------------ SUELO DE ZONA (moqueta/linóleo por departamento)
// Cuadrilátero en perspectiva con la rampa del departamento, trama suave y BORDE de 2 px (canto de goma) en su perímetro.
export function sueloZona(g, quad, ramp, o = {}) {
  const [a, b, c, d] = quad;
  const seed = o.seed || 3;
  poly(g, quad, (xx, yy) => {
    const t = (yy - a[1]) / Math.max(1, d[1] - a[1]);
    const n = hash2(xx >> 1, yy, seed);
    if (o.trama === 'baldosa') {
      const gx = ((xx - (a[0] + (d[0] - a[0]) * t)) / (10 + t * 8)) | 0, gy = ((yy - a[1]) / (4 + t * 6)) | 0;
      return ditherPick(xx, yy, ramp, 0.25 + t * 0.5 + (((gx + gy) & 1) ? 0.12 : -0.05) + (n - 0.5) * 0.1);
    }
    return ditherPick(xx, yy, ramp, 0.2 + t * 0.6 + (n < 0.08 ? -0.2 : 0));
  });
  if (o.borde) {
    line(g, a[0], a[1], b[0], b[1], o.borde); line(g, d[0], d[1], c[0], c[1], o.borde);
    line(g, a[0], a[1], d[0], d[1], o.borde); line(g, b[0], b[1], c[0], c[1], o.borde);
  }
}

// ------------------------------------------------------------------ MAMPARA BAJA (separa zonas sin tapar a nadie: 18-22 px)
export function mampara(g, x, yBase, w, h, color, o = {}) {
  const top = yBase - h;
  shadowEllipse(g, x + w / 2, yBase, w / 2 + 2, 2, 0.6);
  rect(g, x, top, w, h, shade(color, -0.15));
  paint(g, x + 1, top + 3, w - 2, h - 4, (xx, yy) => ditherPick(xx, yy, [shade(color, -0.3), shade(color, -0.1)], 0.5 + (hash2(xx, yy, 5) - 0.5) * 0.4));
  rect(g, x, top, w, 2, PAL.metal[5]); hline(g, x, top, w, PAL.metal[7]);
  vline(g, x, top, h, PAL.metal[4]); vline(g, x + w - 1, top, h, PAL.metal[2]);
  rect(g, x, yBase - 2, w, 2, PAL.metal[2]);
  if (o.texto) tiny(g, o.texto, x + (w >> 1), top + 5, o.tinta || PAPEL, { align: 'center' });
}

// ------------------------------------------------------------------ BRILLO DE INTERACTIVO (lenguaje común: 1 px de luz cálida en el canto superior-izquierdo
// + sombra de contacto de 2 px; lo decorado NO lleva ese canto). Se aplica dentro del dibujo del objeto.
export function cantoVivo(g, x, y, w, h) {
  hline(g, x + 1, y, w - 2, '#fff2c0'); vline(g, x, y + 1, Math.max(1, h - 3), '#ffe8a0');
  ditherOverlay(g, x + 1, y + h, w, 2, PAL.ink[0], 0.6);
}

export { INK, INK2, PAPEL };
void noise; void gradH; void bevel; void ellipse; void fadeRows; void glow;
