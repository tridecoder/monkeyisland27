// KIT DEL SISTEMA DE DISEÑO (rediseño visual, docs/GUIA_REDISENO.md §3; portado de docs/informes/propuesta/lib/kit.js).
// ARCHIVO COMPARTIDO: los artistas lo IMPORTAN, no lo editan. Desde content/rooms/art/<sala>.art.js:
//   import * as kit from '../../lib/kit.js';
//   import { placa, rotuloZona, umbral, marcoPuerta, nucleo, zonaSuelo, filete, pilastra, cantoVivo, micro } from '../../lib/kit.js';
//
// Contenido
//   código de color ........ PLANTA (banda de la placa por planta), DEPTO (filete, suelo y rótulo por departamento)
//   texto ................... micro / microW / microLineas (microfuente 3×5 canónica), texto (fuente del juego o 3×5,
//                             partido en líneas y SIEMPRE entero sobre su soporte), cabe
//   señalética ............. placa (placa de destino), placaSala (la de una sala, con su nombre llano), rotuloDepto /
//                             rotuloZona (rótulo de departamento colgado del techo), flechaPx
//   umbrales y puertas ..... umbral, marcoPuerta, huecoAbierto, peldanos (medio nivel: Catacumba ↔ Office)
//   núcleo ................. ascensor, escalera, nucleo (ascensor + escalera idénticos en las 4 plantas; geometría en
//                             content/lib/edificio.js nucleoGeom)
//   zonas .................. zonaSuelo / sueloZona, filete, pilastra, mampara
//   interactivo ............ cantoVivo (1 px de luz cálida arriba-izquierda + 2 px de sombra de contacto)
//   registro ............... `registro`: cada placa / rótulo / texto deja su caja; la auditoría (tools/sala.mjs,
//                             tools/play-mouse.mjs --solo=geometria) comprueba que estén enteros y dentro de la sala.
import {
  PAL, rect, hline, vline, frameRect, px, line, poly, paint, ditherOverlay, gradV, glow, shadowEllipse, ditherPick,
  hash2, shade, mix, label, measureText,
} from '../../engine/draw.js';
import { SALA, PLANTA_DE, nucleoGeom } from './edificio.js';

// ================================================================== registro (para la auditoría)
export const registro = {
  items: [], problemas: [],
  reset() { this.items.length = 0; this.problemas.length = 0; },
  add(tipo, x, y, w, h, texto) { this.items.push({ tipo, x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h), texto: texto || '' }); },
  mal(msg) { if (!this.problemas.includes(msg)) this.problemas.push(msg); },
};

// ================================================================== código de color
/** Planta → banda de la placa (número de planta). */
export const PLANTA = {
  '-1': { nombre: 'P-1', c: '#3c8ad8', l: '#8cc4ff', d: '#1c3c6c' },   // azul técnico
  '0': { nombre: 'P0', c: '#3f9a5a', l: '#8ad69a', d: '#1c4a2a' },     // verde vestíbulo
  '1': { nombre: 'P1', c: '#2fa6a0', l: '#86e2d8', d: '#145450' },     // verde agua Redacción
  '2': { nombre: 'P2', c: '#9a5ad0', l: '#d0a4f4', d: '#4a2470' },     // lila planta 2
};
/** Departamento → acento (filete de pared, suelo de zona, luz y rótulo). `suelo` = rampa oscuro → claro. */
export const DEPTO = {
  web: { nombre: 'WEB', c: '#2fa6a0', suelo: ['#2a3a4c', '#33465a', '#3c5268'] },
  economia: { nombre: 'ECONOMÍA', c: '#5ab0e8', suelo: ['#2c3448', '#353e54', '#3e4862'] },
  redaccion: { nombre: 'REDACCIÓN', c: '#5ab0e8', suelo: ['#2c3448', '#353e54', '#3e4862'] },
  infografia: { nombre: 'INFOGRAFÍA', c: '#e8a030', suelo: ['#3c3428', '#4a4030', '#584c38'] },
  desarrollo: { nombre: 'DESARROLLO', c: '#9a6ae0', suelo: ['#2e2a44', '#38324f', '#423b5c'] },
  diseno: { nombre: 'DISEÑO Y PRODUCTO', c: '#f0f0e8', suelo: ['#6a6a70', '#7c7c84', '#8e8e96'] },
  direccion: { nombre: 'DESPACHOS', c: '#d8a040', suelo: ['#4a2e1c', '#5a3a24', '#6a462c'] },
  office: { nombre: 'VENDING', c: '#f0d060', suelo: ['#6a5a3a', '#7a6a44', '#8a7a50'] },
  papel: { nombre: 'CIERRE', c: '#c89050', suelo: ['#3a2618', '#4a3220', '#5a3e28'] },
  marketing: { nombre: 'MARKETING', c: '#ff5aa8', suelo: ['#3e2a4a', '#4a3258', '#563a66'] },
  eventos: { nombre: 'EVENTOS', c: '#e04050', suelo: ['#3a1420', '#4a1a28', '#5a2030'] },
  comercial: { nombre: 'COMERCIAL', c: '#f08a30', suelo: ['#3e2e3a', '#4a3646', '#563e52'] },
  administracion: { nombre: 'ADMINISTRACIÓN', c: '#8ac060', suelo: ['#2e3a2c', '#384634', '#42523c'] },
  sistemas: { nombre: 'SISTEMAS', c: '#3c8ad8', suelo: ['#1e2a3c', '#263448', '#2e3e54'] },
};
export const INK = '#141220', INK2 = '#24203a', PAPEL = '#f2ecd8';
export const LUZ_CALIDA = '#fff2c0';

// ================================================================== MICROFUENTE 3×5 (canónica)
// Monoespaciada: 4 px por carácter (también el espacio), 5 px de alto (+1 encima para tildes). Mayúsculas, cifras,
// Á É Í Ó Ú Ü Ñ y signos . , : ; - _ ! ? / ' " ( ) % + = * < > ^ € · # & @. Sin «¿» ni «¡» (no caben: usa la fuente
// del juego). Sustituye a tiny() de lib-oficina.js, micro() de lib-vestibulo-micro.js y miniText() de
// lib-catacumba-util.js (que siguen funcionando para las salas viejas).
const ROWS = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'], B: ['##.', '#.#', '##.', '#.#', '##.'], C: ['.##', '#..', '#..', '#..', '.##'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'], E: ['###', '#..', '##.', '#..', '###'], F: ['###', '#..', '##.', '#..', '#..'],
  G: ['.##', '#..', '#.#', '#.#', '.##'], H: ['#.#', '#.#', '###', '#.#', '#.#'], I: ['###', '.#.', '.#.', '.#.', '###'],
  J: ['..#', '..#', '..#', '#.#', '.#.'], K: ['#.#', '##.', '#..', '##.', '#.#'], L: ['#..', '#..', '#..', '#..', '###'],
  M: ['#.#', '###', '###', '#.#', '#.#'], N: ['###', '#.#', '#.#', '#.#', '#.#'], O: ['.#.', '#.#', '#.#', '#.#', '.#.'],
  P: ['##.', '#.#', '##.', '#..', '#..'], Q: ['.#.', '#.#', '#.#', '##.', '.##'], R: ['##.', '#.#', '##.', '#.#', '#.#'],
  S: ['.##', '#..', '.#.', '..#', '##.'], T: ['###', '.#.', '.#.', '.#.', '.#.'], U: ['#.#', '#.#', '#.#', '#.#', '###'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.'], W: ['#.#', '#.#', '###', '###', '#.#'], X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
  Y: ['#.#', '#.#', '.#.', '.#.', '.#.'], Z: ['###', '..#', '.#.', '#..', '###'],
  0: ['###', '#.#', '#.#', '#.#', '###'], 1: ['.#.', '##.', '.#.', '.#.', '###'], 2: ['##.', '..#', '.#.', '#..', '###'],
  3: ['##.', '..#', '.#.', '..#', '##.'], 4: ['#.#', '#.#', '###', '..#', '..#'], 5: ['###', '#..', '##.', '..#', '##.'],
  6: ['.##', '#..', '###', '#.#', '###'], 7: ['###', '..#', '.#.', '.#.', '.#.'], 8: ['###', '#.#', '###', '#.#', '###'],
  9: ['###', '#.#', '###', '..#', '##.'],
  '.': ['...', '...', '...', '...', '.#.'], ',': ['...', '...', '...', '.#.', '#..'], ':': ['...', '.#.', '...', '.#.', '...'],
  ';': ['...', '.#.', '...', '.#.', '#..'], '-': ['...', '...', '###', '...', '...'], _: ['...', '...', '...', '...', '###'],
  '(': ['.#.', '#..', '#..', '#..', '.#.'], ')': ['.#.', '..#', '..#', '..#', '.#.'], '?': ['##.', '..#', '.#.', '...', '.#.'],
  '!': ['.#.', '.#.', '.#.', '...', '.#.'], '/': ['..#', '..#', '.#.', '#..', '#..'], '%': ['#.#', '..#', '.#.', '#..', '#.#'],
  '+': ['...', '.#.', '###', '.#.', '...'], '·': ['...', '...', '.#.', '...', '...'], '*': ['#.#', '.#.', '###', '.#.', '#.#'],
  '=': ['...', '###', '...', '###', '...'], '"': ['#.#', '#.#', '...', '...', '...'], "'": ['.#.', '.#.', '...', '...', '...'],
  '>': ['#..', '.#.', '..#', '.#.', '#..'], '<': ['..#', '.#.', '#..', '.#.', '..#'], '^': ['.#.', '###', '...', '...', '...'],
  '€': ['.##', '###', '#..', '###', '.##'], '#': ['#.#', '###', '#.#', '###', '#.#'], '&': ['.#.', '#.#', '.#.', '#.#', '.##'],
  '@': ['###', '#.#', '###', '#..', '###'], ' ': ['...', '...', '...', '...', '...'],
};
const GLY = Object.fromEntries(Object.entries(ROWS).map(([k, r]) => [k, r.join('')]));
const ACENTO = { 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ü': 'U', 'Ñ': 'N' };
export const MICRO_PASO = 4, MICRO_ALTO = 5;

/** Ancho en px de un texto en microfuente (n caracteres → 4n − 1). */
export function microW(text) { return Math.max(0, [...String(text)].length * MICRO_PASO - 1); }
/** ¿Tiene glifo cada carácter? (la auditoría avisa de los que no: «¿», «¡»…). */
export function microValido(text) { return [...String(text).toUpperCase()].every(ch => GLY[ACENTO[ch] || ch]); }
/** Texto 3×5. (x, y) = esquina superior izquierda (o el centro / el borde derecho con `align`). Devuelve el ancho.
 *  o: { align: 'center' | 'right', sombra: color (1 px abajo-derecha), registrar: true } */
export function micro(g, text, x, y, c = INK, o = {}) {
  const s = String(text).toUpperCase();
  const w = microW(s);
  let cx = o.align === 'center' ? Math.round(x - w / 2) : o.align === 'right' ? x - w : x;
  const x0 = cx;
  for (const ch of s) {
    const base = ACENTO[ch] || ch;
    const gl = GLY[base];
    if (!gl) { if (o.registrar !== false) registro.mal(`microfuente: sin glifo para «${ch}» en «${text}»`); cx += MICRO_PASO; continue; }
    for (let i = 0; i < 15; i++) if (gl[i] === '#') {
      if (o.sombra) px(g, cx + (i % 3) + 1, y + ((i / 3) | 0) + 1, o.sombra);
      px(g, cx + (i % 3), y + ((i / 3) | 0), c);
    }
    if (ch === 'Ñ') { px(g, cx, y - 1, c); px(g, cx + 2, y - 1, c); }
    else if (ch === 'Ü') { px(g, cx, y - 1, c); px(g, cx + 2, y - 1, c); }
    else if (ACENTO[ch]) px(g, cx + 1, y - 1, c);
    cx += MICRO_PASO;
  }
  return w;
  void x0;
}
/** Parte un texto en líneas de microfuente que quepan en `maxW` px (por palabras; una palabra más larga, se corta). */
export function microLineas(text, maxW) {
  const max = Math.max(1, Math.floor((maxW + 1) / MICRO_PASO));
  const out = []; let cur = '';
  for (const w of String(text).split(/\s+/).filter(Boolean)) {
    const t = cur ? cur + ' ' + w : w;
    if (t.length <= max) { cur = t; continue; }
    if (cur) out.push(cur);
    cur = w;
    while (cur.length > max) { out.push(cur.slice(0, max)); cur = cur.slice(max); }
  }
  if (cur) out.push(cur);
  return out;
}

// ================================================================== texto sobre un soporte (nunca cortado)
/** ¿Cabe `text` en una caja de w×h? Devuelve { fuente: 'juego' | 'micro', lineas } o null si no cabe ni en 3×5. */
export function cabe(text, w, h, o = {}) {
  const pad = o.pad ?? 1;
  const W = w - pad * 2, H = h - pad * 2;
  if (o.fuente !== 'micro') {
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = []; let cur = '';
    for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (measureText(t) <= W) cur = t; else { if (cur) lines.push(cur); cur = wd; } }
    if (cur) lines.push(cur);
    // cada línea de la fuente del juego ocupa 10 filas (tilde en 0-1, mayúsculas en 3-9) + 1 de interlínea
    if (lines.every(l => measureText(l) <= W) && lines.length * 11 - 1 <= H) return { fuente: 'juego', lineas: lines };
    if (o.fuente === 'juego') return null;
  }
  const ml = microLineas(text, W);
  if (ml.every(l => microW(l) <= W) && ml.length * 7 - 1 <= H && !ml.some(l => l.length * MICRO_PASO - 1 > W)) {
    if (ml.join(' ').replace(/\s+/g, '') === String(text).toUpperCase().replace(/\s+/g, '')) return { fuente: 'micro', lineas: ml };
  }
  return null;
}
/** Texto ENTERO sobre su soporte (caja x, y, w, h): fuente del juego si cabe, si no microfuente 3×5, partido por
 *  palabras. Si no cabe ni así, lo pinta en 3×5 desbordando (nunca recortado) y lo apunta en `registro.problemas`.
 *  o: { color, align: 'center' | 'left', fuente: 'juego' | 'micro', pad, sombra, id } */
export function texto(g, text, x, y, w, h, o = {}) {
  const c = o.color || INK;
  const fit = cabe(text, w, h, o);
  registro.add('texto', x, y, w, h, text);
  const pad = o.pad ?? 1;
  if (!fit) {
    registro.mal(`texto «${text}» no cabe entero en su soporte de ${w}×${h} px${o.id ? ' (' + o.id + ')' : ''}: agranda el soporte o acorta el texto`);
    const ml = microLineas(text, Math.max(8, w - pad * 2));
    ml.forEach((l, i) => micro(g, l, o.align === 'left' ? x + pad : x + (w >> 1), y + pad + i * 7, c, { align: o.align === 'left' ? undefined : 'center', sombra: o.sombra }));
    return false;
  }
  if (fit.fuente === 'juego') {
    const lh = 11, top = y + pad + Math.max(0, ((h - pad * 2) - (fit.lineas.length * lh - 1)) >> 1);
    fit.lineas.forEach((l, i) => label(g, l, o.align === 'left' ? x + pad : x + (w >> 1), top + i * lh, c, o.align === 'left' ? {} : { align: 'center' }));
  } else {
    const lh = 7, top = y + pad + Math.max(0, ((h - pad * 2) - (fit.lineas.length * lh - 2)) >> 1) + 1;
    fit.lineas.forEach((l, i) => micro(g, l, o.align === 'left' ? x + pad : x + (w >> 1), top + i * lh, c, { align: o.align === 'left' ? undefined : 'center', sombra: o.sombra }));
  }
  return true;
}

// ================================================================== PLACA DE DESTINO (una sola para todo el edificio)
// Fondo tinta, marco claro de 1 px, banda izquierda con el color y el número de la PLANTA, nombre en la fuente del juego
// (mayúsculas, caja de 7 px), flecha opcional (◄ ► ▲ ▼ = '<' '>' '^' 'v') y, si hay `sub`, una segunda línea en 3×5.
// Alto 13 px (20 con sub: 1 px de aire entre la 2.ª línea y el marco). Devuelve el ancho. Va sobre el dintel; dos puertas juntas: placas apiladas a 2 alturas.
export function placa(g, x, y, text, o = {}) {
  const planta = String(o.planta ?? '1');
  const pl = PLANTA[planta] || PLANTA['1'];
  const flecha = o.flecha || null;
  const sub = o.sub || null;
  const tw = Math.max(measureText(text), sub ? microW(sub) : 0);
  const band = o.sinPlanta ? 0 : 11;
  const fw = flecha ? 8 : 0;
  const w = band + 4 + tw + 4 + fw;
  const h = sub ? 20 : 13;
  if (String(text).length > 18) registro.mal(`placa «${text}»: más de 12-14 caracteres (usa \`sub\` para la segunda línea)`);
  ditherOverlay(g, x + 1, y + 1, w, h, PAL.shadow, 0.55);
  rect(g, x, y, w, h, INK);
  frameRect(g, x, y, w, h, o.marco || '#c8c4d8');
  hline(g, x + 1, y + 1, w - 2, INK2);
  if (band) {
    rect(g, x + 1, y + 1, band - 1, h - 2, pl.c); vline(g, x + 1, y + 1, h - 2, pl.l); vline(g, x + band - 1, y + 1, h - 2, pl.d);
    micro(g, planta, x + 1 + ((band - 1 - microW(planta)) >> 1), y + 4, INK, { registrar: false });
  }
  // fuente del juego: mayúsculas en las filas +3..+9 y la tilde en +0..+1 → texto a y+1 (la tilde cabe dentro del marco)
  label(g, text, x + band + 4, y + 1, o.color || PAPEL);
  if (sub) micro(g, sub, x + band + 4, y + 13, o.colorSub || '#c8c4d8');
  if (o.depto && DEPTO[o.depto]) hline(g, x + band + 3, y + 11, tw + 2, DEPTO[o.depto].c);
  if (flecha) flechaPx(g, x + w - fw + 1, y + 3, flecha, o.color || PAPEL);
  registro.add('placa', x, y, w, h, text + (sub ? ' / ' + sub : ''));
  return w;
}
export function placaW(text, o = {}) { return (o.sinPlanta ? 0 : 11) + 8 + Math.max(measureText(text), o.sub ? microW(o.sub) : 0) + (o.flecha ? 8 : 0); }
export function placaH(o = {}) { return o.sub ? 20 : 13; }
/** La placa de una SALA de destino con su nombre llano (content/lib/edificio.js SALA): placaSala(g, x, y, 'pajarera', { flecha: '<' }). */
export function placaSala(g, x, y, room, o = {}) {
  const S = SALA[room];
  if (!S) { registro.mal(`placaSala: sala desconocida ${room}`); return 0; }
  return placa(g, x, y, S.placa, { planta: PLANTA_DE[room], sub: o.sinSub ? null : S.sub, depto: S.depto, ...o });
}
export function placaSalaW(room, o = {}) { const S = SALA[room]; return S ? placaW(S.placa, { sub: o.sinSub ? null : S.sub, ...o }) : 0; }
/** Flecha de 6×7: '<' '>' '^' 'v'. */
export function flechaPx(g, x, y, dir, c) {
  const A = {
    '>': ['...#..', '...##.', '#####.', '######', '#####.', '...##.', '...#..'],
    '<': ['..#...', '.##...', '.#####', '######', '.#####', '.##...', '..#...'],
    '^': ['..##..', '.####.', '######', '..##..', '..##..', '..##..', '..##..'],
    'v': ['..##..', '..##..', '..##..', '..##..', '######', '.####.', '..##..'],
  }[dir];
  if (!A) return;
  A.forEach((row, r) => { for (let q = 0; q < row.length; q++) if (row[q] === '#') px(g, x + q, y + r, c); });
}

// ================================================================== RÓTULO DE DEPARTAMENTO (colgado del techo)
/** Bandera horizontal: filete de 2 px del color del departamento arriba, nombre en la fuente del juego. Alto 14 px.
 *  o: { texto, colgado: px de varilla hasta el techo, fondo, color }. Devuelve el ancho. */
export function rotuloDepto(g, x, y, depto, o = {}) {
  const d = DEPTO[depto] || { nombre: String(depto).toUpperCase(), c: '#c8c4d8' };
  const text = o.texto || d.nombre;
  const w = measureText(text) + 10, h = 14;
  const fondo = o.fondo || '#f4f0e4';
  if (o.colgado) { vline(g, x + 3, y - o.colgado, o.colgado, PAL.metal[2]); vline(g, x + w - 4, y - o.colgado, o.colgado, PAL.metal[2]); }
  ditherOverlay(g, x + 1, y + 1, w, h, PAL.shadow, 0.5);
  rect(g, x, y, w, h, fondo);
  rect(g, x, y, w, 2, d.c); hline(g, x, y + 2, w, shade(d.c, -0.3));
  hline(g, x, y + h - 1, w, shade(fondo, -0.35)); vline(g, x + w - 1, y + 2, h - 2, shade(fondo, -0.25));
  label(g, text, x + 5, y + 3, o.color || INK);        // tilde en y+3..4, mayúsculas y+6..12
  registro.add('rotulo', x, y, w, h, text);
  return w;
}
export function rotuloDeptoW(depto, o = {}) { return measureText(o.texto || (DEPTO[depto] ? DEPTO[depto].nombre : String(depto))) + 10; }
/** Rótulo de zona CENTRADO en cx y colgado del techo (varillas hasta y = 0 si no se dice otra cosa). */
export function rotuloZona(g, cx, y, depto, o = {}) {
  const w = rotuloDeptoW(depto, o);
  return rotuloDepto(g, Math.round(cx - w / 2), y, depto, { colgado: o.colgado ?? y, ...o });
}

// ================================================================== UMBRAL, MARCO, HUECO, PELDAÑOS
/** Felpudo/franja en perspectiva ante cada salida, con el color del DESTINO + franja clara en el borde de pisada. */
export function umbral(g, x, y, w, h, color, o = {}) {
  const sk = o.sesgo ?? 3;
  poly(g, [[x + sk, y], [x + w - sk, y], [x + w, y + h], [x, y + h]], (xx, yy) => ditherPick(xx, yy, [shade(color, -0.45), shade(color, -0.3)], 0.3 + ((xx * 3 + yy) & 3) * 0.1));
  line(g, x, y + h, x + w, y + h, shade(color, 0.25));
  line(g, x + sk, y, x + w - sk, y, shade(color, -0.6));
  if (o.chevron) {
    const cx = x + (w >> 1), cy = y + (h >> 1);
    for (let i = -1; i <= 1; i++) { px(g, cx - 2 + i * 6, cy, shade(color, 0.1)); px(g, cx - 1 + i * 6, cy - 1, shade(color, 0.1)); px(g, cx - 1 + i * 6, cy + 1, shade(color, 0.1)); }
  }
}
/** Marco metálico común a todas las puertas interiores (3 px). La HOJA la pinta cada sala. */
export function marcoPuerta(g, x, y, w, h, o = {}) {
  const m = o.ramp || PAL.metal;
  rect(g, x - 3, y - 3, w + 6, h + 3, m[1]);
  rect(g, x - 2, y - 2, w + 4, h + 2, m[4]);
  hline(g, x - 2, y - 2, w + 4, m[6]); vline(g, x - 2, y - 2, h + 2, m[6]); vline(g, x + w + 1, y - 2, h + 2, m[2]);
  rect(g, x - 3, y + h - 1, w + 6, 1, m[2]);
}
/** Puerta ABIERTA: hueco con la luz/suelo del destino + hoja de canto. o: { fondo, luz, suelo, hoja, hojaIzq } */
export function huecoAbierto(g, x, y, w, h, o = {}) {
  gradV(g, x, y, w, h, o.fondo || [PAL.ink[0], PAL.ink[1], PAL.wood[1], PAL.wood[2]]);
  if (o.luz) glow(g, x + (w >> 1), y + h - 6, w * 0.7, 12, o.luz, 0.45);
  if (o.suelo) poly(g, [[x, y + h - 10], [x + w, y + h - 10], [x + w, y + h], [x, y + h]], (xx, yy) => ditherPick(xx, yy, o.suelo, (yy - (y + h - 10)) / 10));
  const hoja = o.hoja || PAL.wood;
  const lx = o.hojaIzq ? x : x + w - 5;
  rect(g, lx, y, 5, h, hoja[3]); vline(g, lx, y, h, hoja[5]); vline(g, lx + 4, y, h, hoja[1]);
  rect(g, lx + (o.hojaIzq ? 3 : 1), y + (h * 0.52 | 0), 1, 3, PAL.gold[5]);
}
/** Tres peldaños con nariz amarilla en el umbral de una puerta de MEDIO NIVEL (ya sin uso: la D6 se anuló; la Redacción
 *  de papel está al lado de la Redacción, al mismo nivel). dir 'baja' | 'sube' (el dibujo es el mismo: pirámide). */
export function peldanos(g, x, yBase, w, dir = 'baja', o = {}) {
  // pirámide: el peldaño de ABAJO es el más ancho y cada uno de encima entra 2 px por lado (en los dos sentidos); el
  // de abajo, más oscuro (en 'baja' es el más hondo; en 'sube', el que queda en la sombra del suelo)
  const n = 3, sh = o.alto ?? 3;
  for (let L = 0; L < n; L++) {                     // L = 0: el peldaño de abajo
    const yy = yBase - (L + 1) * sh, inset = L * 2, k = n - 1 - L;
    rect(g, x + inset, yy, w - inset * 2, sh, shade(o.color || PAL.metal[3], -0.12 * k));
    hline(g, x + inset, yy, w - inset * 2, '#e8c030');
  }
  void dir;
}

// ================================================================== ASCENSOR y ESCALERA (mismos en las 4 plantas)
function flechaMini(g, x, y, c) { px(g, x + 1, y, c); hline(g, x, y + 1, 3, c); px(g, x + 1, y + 3, c); hline(g, x, y + 2, 3, '#4a1a10'); }
/** Puertas de acero cepillado, indicador LED naranja encima, botonera y pictograma con el color de la planta.
 *  (x, y, w, h) = las puertas. o: { botonera: 'der' | 'izq', cartel: false } */
export function ascensor(g, x, y, w, h, planta, o = {}) {
  const P = PLANTA[String(planta)] || PLANTA['1'];
  marcoPuerta(g, x, y, w, h, { ramp: PAL.metal });
  rect(g, x + (w >> 1) - 9, y - 12, 18, 8, INK); frameRect(g, x + (w >> 1) - 9, y - 12, 18, 8, PAL.metal[3]);
  micro(g, String(planta), x + (w >> 1) - (microW(String(planta)) >> 1) + 2, y - 10, '#ff6a40', { registrar: false });
  flechaMini(g, x + (w >> 1) - 7, y - 10, '#ff6a40');
  const half = w >> 1;
  for (const [hx, hw] of [[x, half], [x + half, w - half]]) {
    paint(g, hx, y, hw, h, (xx, yy) => ditherPick(xx, yy, [PAL.metal[3], PAL.metal[4], PAL.metal[5], PAL.metal[6]], 0.25 + ((xx - hx) / hw) * 0.5 + (hash2(xx, yy >> 3, 9) - 0.5) * 0.15));
    vline(g, hx, y, h, PAL.metal[6]); vline(g, hx + hw - 1, y, h, PAL.metal[2]);
  }
  vline(g, x + half, y, h, PAL.ink[1]);
  ditherOverlay(g, x, y, w, 6, PAL.metal[7], 0.25);
  const bx = o.botonera === 'izq' ? x - 10 : x + w + 4, by = y + (h * 0.42 | 0);
  rect(g, bx, by, 5, 11, PAL.metal[5]); frameRect(g, bx, by, 5, 11, PAL.metal[2]);
  px(g, bx + 2, by + 3, '#ffd060'); px(g, bx + 2, by + 7, PAL.metal[2]);
  if (o.cartel !== false) {
    const px0 = bx - 1, py0 = by - 16;
    rect(g, px0, py0, 8, 11, P.c); frameRect(g, px0, py0, 8, 11, P.d);
    rect(g, px0 + 2, py0 + 2, 4, 7, PAPEL); vline(g, px0 + 4, py0 + 2, 7, P.c);
  }
}
/** Tramo de escalera en vista frontal 3/4 con NARIZ AMARILLA en cada peldaño y barandilla.
 *  dir 'sube' (tramo ascendente) | 'baja' (hueco con narices que se alejan). */
export function escalera(g, x, y, w, h, dir = 'sube', o = {}) {
  const n = o.peldanos || Math.max(4, Math.round(h / 4));
  const pared = o.pared || [PAL.metal[1], PAL.metal[2], PAL.metal[3]];
  gradV(g, x, y, w, h, [PAL.ink[0], pared[0], pared[1]]);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    if (dir === 'sube') {
      const sy = y + h - Math.round((i + 1) * h / n), sx = x + Math.round(t * w * 0.55), sw = w - Math.round(t * w * 0.55);
      rect(g, sx, sy, sw, Math.ceil(h / n), shade(pared[2], -0.1 + t * 0.2));
      hline(g, sx, sy, sw, '#e8c030');
      hline(g, sx, sy + 1, sw, shade(pared[2], 0.3));
    } else {
      const sy = y + Math.round(i * h / n), sx = x + Math.round(t * 6);
      rect(g, sx, sy, w - Math.round(t * 12), Math.ceil(h / n), shade(pared[1], -0.15 - t * 0.35));
      hline(g, sx, sy, w - Math.round(t * 12), mix('#e8c030', PAL.ink[1], t * 0.7));
    }
  }
  const ry = o.barandaY ?? (y - 4);
  line(g, x - 2, dir === 'sube' ? y + h - 8 : ry + 2, x + w, dir === 'sube' ? ry : ry + 10, PAL.metal[6]);
  line(g, x - 2, dir === 'sube' ? y + h - 7 : ry + 3, x + w, dir === 'sube' ? ry + 1 : ry + 11, PAL.metal[2]);
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const bx = Math.round(x - 2 + t * (w + 2));
    const by = dir === 'sube' ? Math.round(y + h - 8 + t * (ry - (y + h - 8))) : Math.round(ry + 2 + t * 8);
    vline(g, bx, by, 9, PAL.metal[4]);
  }
}
/** EL NÚCLEO completo de una sala (D1): suelo de terrazo, pared, escalera(s), ascensor y sus placas, en la banda de
 *  96 px que fija content/lib/edificio.js. Devuelve la geometría (nucleoGeom) para el layout:
 *    const N = kit.nucleo(g, 'pecera', 92);   // FL = 92
 *    layout.ascensor_pecera = { rect: N.ascensor.rect, walkTo: N.ascensor.walkTo, face: 'up' };
 *    entries.ascensor = N.ascensor.entrada;  entries.vestibulo = N.escaleras.baja.entrada; …
 *  o: { pared: [3 colores], suelo: rampa, sinSuelo, sinPlacas } */
export function nucleo(g, room, FL, o = {}) {
  const N = nucleoGeom(room, FL, o.width);
  if (!N) { registro.mal(`nucleo: la sala ${room} no tiene núcleo`); return null; }
  const planta = PLANTA_DE[room];
  const [b0, b1] = N.band;
  if (!o.sinPared) {
    gradV(g, b0, 16, b1 - b0, FL - 16, o.pared || ['#2e3240', '#3a3e4a', '#444958']);
    vline(g, N.lado === 'der' ? b0 : b1 - 1, 16, FL - 16, PAL.metal[2]);
  }
  if (!o.sinSuelo) {
    poly(g, [[b0, FL], [b1, FL], [b1 + (N.lado === 'der' ? 0 : 6), 144], [b0 - (N.lado === 'der' ? 6 : 0), 144]],
      (xx, yy) => ditherPick(xx, yy, o.suelo || ['#3a3c44', '#4a4c56', '#5a5c66'], 0.2 + (yy - FL) / 60 + (hash2(xx >> 1, yy, 7) < 0.06 ? 0.2 : 0)));
  }
  const A = N.ascensor.puertas;
  ascensor(g, A.x, A.y, A.w, A.h, planta, { botonera: N.lado === 'der' ? 'izq' : 'der' });
  umbral(g, A.x - 2, FL + 1, A.w + 4, 5, (PLANTA[String(planta)] || PLANTA['1']).c);
  const dest = { sube: { '-1': 0, '0': 1, '1': 2 }[String(planta)], baja: { '1': 0, '2': 1 }[String(planta)] };
  const destRoom = { 0: 'vestibulo', 1: 'pecera', 2: 'ecosistema' };
  for (const [dir, E] of Object.entries(N.escaleras)) {
    const [x, y, w, h] = E.rect;
    escalera(g, x, y + 2, w, h - 2, dir, { barandaY: y });
    const to = destRoom[dest[dir]];
    if (!o.sinPlacas && to) {
      // placas apiladas sobre la caja de escalera: la que sube arriba, la que baja debajo (nunca tapan los tramos)
      const S = SALA[to];
      const pw = placaW(S.placa, { flecha: '^' });
      const both = N.escaleras.sube && N.escaleras.baja;
      const top = FL - 64;
      const py = both ? (dir === 'sube' ? top - 30 : top - 16) : top - 16;
      const pxx = N.lado === 'der' ? Math.max(N.band[0], N.band[1] - 4 - pw) : x;
      placa(g, pxx, Math.max(1, py), S.placa, { planta: dest[dir], flecha: dir === 'sube' ? '^' : 'v' });
    }
    umbral(g, x, FL + 1, w, 5, (PLANTA[String(dest[dir])] || PLANTA['1']).c);
  }
  if (N.cerrada) {
    const [x, y, w, h] = N.cerrada.rect;
    rect(g, x, y, w, h, PAL.metal[2]);
    for (let yy = y + 2; yy < y + h; yy += 3) hline(g, x + 1, yy, w - 2, PAL.metal[3]);
    frameRect(g, x, y, w, h, PAL.metal[1]);
    rect(g, x + 4, y + 20, w - 8, 14, '#c83a3a');
    micro(g, 'SOLO', x + (w >> 1), y + 22, PAPEL, { align: 'center' });
    micro(g, 'EVACUAC.', x + (w >> 1), y + 28, PAPEL, { align: 'center' });
  }
  return N;
}

// ================================================================== ZONAS: suelo, filete, pilastra, mampara
/** Suelo de zona: cuadrilátero en perspectiva con la rampa del departamento y, si se pide, canto de goma claro. */
export function sueloZona(g, quad, ramp, o = {}) {
  const [a, , , d] = quad;
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
    const [p0, p1, p2, p3] = quad;
    line(g, p0[0], p0[1], p1[0], p1[1], o.borde); line(g, p3[0], p3[1], p2[0], p2[1], o.borde);
    line(g, p0[0], p0[1], p3[0], p3[1], o.borde); line(g, p1[0], p1[1], p2[0], p2[1], o.borde);
  }
}
/** Suelo de la zona x0-x1 desde la línea de suelo FL hasta abajo, con las juntas fugando al punto (vpx, vpy).
 *  `depto` = clave de DEPTO (o una rampa). o: { vpx, vpy, trama: 'baldosa', borde: color o true } */
export function zonaSuelo(g, x0, x1, FL, depto, o = {}) {
  const ramp = Array.isArray(depto) ? depto : (DEPTO[depto] || DEPTO.redaccion).suelo;
  const vpx = o.vpx ?? (x0 + x1) / 2, vpy = o.vpy ?? 20;
  const k = (144 - vpy) / Math.max(1, FL - vpy);
  const fx = (x) => Math.round(vpx + (x - vpx) * k);
  const quad = [[x0, FL], [x1, FL], [fx(x1), 144], [fx(x0), 144]];
  sueloZona(g, quad, ramp, { ...o, borde: o.borde === true ? shade(ramp[2], 0.45) : o.borde });
  return quad;
}
/** Filete de 3 px del color del departamento en la pared (a la altura del zócalo alto). */
export function filete(g, x0, x1, y, depto) {
  const c = (DEPTO[depto] || { c: depto }).c;
  hline(g, x0, y, x1 - x0, shade(c, 0.25)); hline(g, x0, y + 1, x1 - x0, c); hline(g, x0, y + 2, x1 - x0, shade(c, -0.35));
}
/** Pilastra en el cambio de zona: columna de 6 px con luz a la izquierda, sombra a la derecha y zócalo. */
export function pilastra(g, x, yTop, FL, o = {}) {
  const r = o.ramp || [PAL.metal[2], PAL.metal[3], PAL.metal[4], PAL.metal[5]];
  const w = o.w || 6;
  rect(g, x, yTop, w, FL - yTop, r[2]);
  vline(g, x, yTop, FL - yTop, r[3]); vline(g, x + w - 1, yTop, FL - yTop, r[0]);
  rect(g, x - 1, FL - 5, w + 2, 5, r[1]); hline(g, x - 1, FL - 5, w + 2, r[3]);
  ditherOverlay(g, x + w, yTop, 2, FL - yTop, PAL.ink[0], 0.35);
}
/** Mampara baja (18-22 px) que separa zonas sin tapar torsos. Texto opcional en 3×5. */
export function mampara(g, x, yBase, w, h, color, o = {}) {
  const top = yBase - h;
  shadowEllipse(g, x + w / 2, yBase, w / 2 + 2, 2, 0.6);
  rect(g, x, top, w, h, shade(color, -0.15));
  paint(g, x + 1, top + 3, w - 2, h - 4, (xx, yy) => ditherPick(xx, yy, [shade(color, -0.3), shade(color, -0.1)], 0.5 + (hash2(xx, yy, 5) - 0.5) * 0.4));
  rect(g, x, top, w, 2, PAL.metal[5]); hline(g, x, top, w, PAL.metal[7]);
  vline(g, x, top, h, PAL.metal[4]); vline(g, x + w - 1, top, h, PAL.metal[2]);
  rect(g, x, yBase - 2, w, 2, PAL.metal[2]);
  if (o.texto) { micro(g, o.texto, x + (w >> 1), top + 5, o.tinta || PAPEL, { align: 'center' }); registro.add('texto', x, top, w, h, o.texto); }
}

// ================================================================== INTERACTIVO: canto vivo
/** Lenguaje común de lo interactivo: 1 px de luz cálida en el canto superior-izquierdo y 2 px de sombra de contacto.
 *  Se aplica DENTRO del dibujo del objeto (lo decorado NO lo lleva). Es también lo que pinta «ver hotspots». */
export function cantoVivo(g, x, y, w, h) {
  hline(g, x + 1, y, w - 2, LUZ_CALIDA); vline(g, x, y + 1, Math.max(1, h - 3), '#ffe8a0');
  ditherOverlay(g, x + 1, y + h, w, 2, PAL.ink[0], 0.6);
}

// ================================================================== números (ENMIENDA E2 §9, B10)
/** Entero con punto de miles SIEMPRE, también con cuatro cifras (1.234), como lo escribe el periódico:
 *  `miles(48531)` → «48.531». (toLocaleString('es-ES') no agrupa las de cuatro cifras.) */
export function miles(n) {
  const v = Math.trunc(Number(n) || 0);
  return (v < 0 ? '-' : '') + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
