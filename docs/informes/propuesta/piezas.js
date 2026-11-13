// PROPUESTA ALTERNATIVA · catálogo de piezas (imágenes) que genera render.mjs. Cada pieza devuelve un canvas.
import { renderSala, ampliar, cargarImg } from './lib/escena.js';
import { capa, leyenda, etiqueta } from './lib/maqueta.js';
import { actor as pintaActor } from './lib/actores.js';
import { PAL, rect, hline, px, frameRect, label } from '../../../engine/draw.js';
import { lamina, visor, copia } from './lib/lamina.js';
import salaProp from './arte/sala_amazonas.propuesta.art.js';

const IMG = './img/';
const S = 3;

// ------------------------------------------------------------------ SALA AMAZONAS (prueba pintada)
const FIG_A = { skin: '#d8a888', hair: '#2a2024', hairStyle: 'parted', shirt: '#e8ecf0', jacket: '#5a5e68', tie: '#9a2a2a', pants: '#3a3a44', build: 'normal', eyebags: true };
const FIG_B = { skin: '#e0b090', hair: '#5a4632', hairStyle: 'balding', beard: 'long', shirt: '#d8d0c0', jacket: '#4a5a3a', pants: '#3a3a30', build: 'heavy', belly: true };
const salaActores = {
  a1: [
    { id: 'gervasio_acta', x: 287, y: 99, dir: 'down', sentado: true, z: 104 },
    { id: '_figA', doll: FIG_A, x: 146, y: 94, dir: 'down', sentado: true, z: 90, escala: 0.92 },
    { id: '_figB', doll: FIG_B, x: 200, y: 94, dir: 'down', sentado: true, z: 90, escala: 0.92 },
    { id: 'bruno', x: 252, y: 126, dir: 'right' },
  ],
  a2: [{ id: 'bruno', x: 66, y: 124, dir: 'right' }],
  a3: [
    { id: 'lector_medio', variante: 'chaqueta', x: 284, y: 104 },
    { id: 'inigo_sinergia', x: 98, y: 122, dir: 'left', anim: 'talk', frame: 1 },
    { id: 'gervasio_acta', x: 56, y: 106, dir: 'right' },
    { id: 'bruno', x: 30, y: 120, dir: 'right' },
  ],
  empuje: [
    { id: 'lector_medio', variante: 'chaqueta', x: 284, y: 104 },
    { id: 'inigo_sinergia', x: 98, y: 122, dir: 'right' },
    { id: 'gervasio_acta', x: 56, y: 106, dir: 'right' },
    { id: 'bruno', x: 306, y: 120, dir: 'left' },
  ],
  plof: [
    { id: 'lector_medio', variante: 'caido', x: 250, y: 92, z: 108, escala: 1 },
    { id: 'inigo_sinergia', x: 98, y: 122, dir: 'right' },
    { id: 'gervasio_acta', x: 56, y: 106, dir: 'right' },
    { id: 'bruno', x: 306, y: 120, dir: 'left' },
  ],
};
const F3 = { acto_3_iniciado: true, reunion_terminada: true, sala_abierta: true, chaqueta_en_lector: true, duelo_inigo_ganado: true };
const salaEstados = {
  a1: { flags: {}, actores: salaActores.a1, ocultar: ['planillo_mesa'] },
  a2: { flags: { reunion_terminada: true }, actores: salaActores.a2, ocultar: ['figurantes_mercados'] },
  a3: { flags: F3, actores: salaActores.a3, ocultar: ['figurantes_mercados', 'planillo_mesa'] },
  empuje: { flags: F3, actores: salaActores.empuje, ocultar: ['figurantes_mercados', 'planillo_mesa'] },
  plof: { flags: { ...F3, lector_derribado: true }, actores: salaActores.plof, ocultar: ['figurantes_mercados', 'planillo_mesa'] },
};
const sala = (k, extra = {}) => renderSala(salaProp, { ...salaEstados[k], ...extra });

// datos de maqueta de la sala derivados del propio arte (la maqueta y la prueba no pueden discrepar)
const CATS_SALA = { sala_a_pajarera: 'salida', planillo_mesa: 'coger', orden_del_dia: 'estado', proyector: 'estado', botellines: 'estado', tele_amazonas: 'estado', minicruasanes: 'deco', cartel_salida: 'deco', carteles_amazonas: 'deco', caja_cables: 'deco', figurantes_mercados: 'pnj' };
export function datosDesdeArte(def, cats, extra = {}, ocultar = []) {
  const hs = [];
  for (const [id, L] of Object.entries(def.layout)) {
    if (id.startsWith('_') || !L.rect || ocultar.includes(id)) continue;
    hs.push({ id, r: L.rect, cat: cats[id] || 'deco', walkTo: L.walkTo });
  }
  return { width: def.width, scale: def.scale, walk: def.walkboxes, hs, ...extra };
}
const salaMaq = (estado) => datosDesdeArte(salaProp, CATS_SALA, {
  zonas: [
    { nombre: 'ZONA DE REUNIÓN (alfombra)', c: '#d8a040', poly: [[70, 99], [300, 99], [314, 124], [58, 124]], lx: 120, ly: 125 },
  ],
  npcs: estado === 'a3' ? [
    { id: 'lector_medio', at: [284, 104], talk: [306, 120], variante: 'chaqueta', txt: 'Lector Medio (cabecera)' },
    { id: 'inigo_sinergia', at: [98, 122], talk: [62, 124] },
    { id: 'gervasio_acta', at: [56, 106], txt: 'Gervasio (rincón)' },
  ] : [
    { id: 'gervasio_acta', at: [287, 99], sentado: true, talk: [256, 124], txt: 'Gervasio preside' },
  ],
  vistas: estado === 'a3' ? [
    { de: [98, 92], a: [270, 70], txt: 'Íñigo presenta al Lector', c: '#fff27a' },
    { de: [284, 66], a: [236, 88], txt: 'caída sobre la mesa', c: '#ff7a7a' },
  ] : [{ de: [256, 80], a: [282, 72], txt: 'Bruno ↔ Gervasio', c: '#fff27a' }],
  oclusores: [
    { r: [86, 96, 196, 10], txt: 'faldón de la mesa' },
    { r: [112, 90, 136, 26], txt: 'sillas de espaldas (sorted)' },
  ],
}, estado === 'a3' ? ['figurantes_mercados', 'planillo_mesa', 'carteles_amazonas', 'tele_amazonas', 'caja_cables', 'minicruasanes'] : ['planillo_mesa']);

async function actual(n) { return visor(await cargarImg(IMG + 'actual-' + n + '.png')); }

export const PIEZAS = {
  async 'sala-propuesta-a1'() { return ampliar(sala('a1'), S); },
  async 'sala-propuesta-a2'() { return ampliar(sala('a2'), S); },
  async 'sala-propuesta-a3'() { return ampliar(sala('a3'), S); },
  async 'sala-propuesta-plof'() { return ampliar(sala('plof'), S); },
  async 'sala-comparativa'() {
    return lamina([
      [{ c: await actual('sala-a1'), t: 'ACTUAL · Actos I-II: reunión infinita' }, { c: ampliar(sala('a1'), S), t: 'PROPUESTA · Gervasio preside sentado en la cabecera' }],
      [{ c: await actual('sala-a3'), t: 'ACTUAL · Acto III: el Lector «holograma» tras la mesa' }, { c: ampliar(sala('a3'), S), t: 'PROPUESTA · Lector en la cabecera, contra el ventanal y bajo el foco' }],
      [{ c: await actual('sala-plof'), t: 'ACTUAL · tras el ¡PLOF!: no se ve nada' }, { c: ampliar(sala('plof'), S), t: 'PROPUESTA · cae a lo largo de la mesa; botellines por el aire' }],
    ], { titulo: 'Sala Amazonas · actual frente a propuesta (fondos a 3×, personajes reales del juego)' });
  },
  async 'sala-maqueta-prueba'() {
    const filas = [];
    for (const [k, t] of [['a1', 'Actos I-II'], ['a3', 'Acto III · clímax']]) {
      const c = ampliar(sala(k), S); const g = c.getContext('2d');
      g.fillStyle = 'rgba(10,8,20,0.35)'; g.fillRect(0, 0, c.width, c.height);
      capa(g, salaMaq(k), S);
      filas.push([{ c, t: 'PROPUESTA + maqueta · ' + t }]);
    }
    const L = lamina(filas, { titulo: 'Sala Amazonas · capa de maqueta sobre la prueba pintada', extraTop: 24 });
    leyenda(L.getContext('2d'), 12, 40);
    return L;
  },
  async 'sala-estado-huida'() {
    return lamina([[{ c: ampliar(sala('a1'), 2), t: 'reunion_terminada = no' }, { c: ampliar(sala('a2'), 2), t: 'reunion_terminada = sí · sillas en huida, una volcada, planillo en la mesa' }]], { titulo: 'Sala Amazonas · el estado «huida» se ve (problema 11)' });
  },
};
void copia; void etiqueta;

// ------------------------------------------------------------------ PECERA (tramo pintado)
import peceraProp from './arte/pecera.tramo.propuesta.art.js';
const PEC_CAM = 300;
const pecera = (k) => renderSala(peceraProp, {
  cam: PEC_CAM,
  flags: k === 'a3' ? { acto_3_iniciado: true, silla_libre: true, chaqueta_cogida: true } : {},
  actores: k === 'a3'
    ? [{ id: 'yoli_tendencias', x: 309, y: 116, dir: 'right' }, { id: 'leoncio_quesitos', x: 434, y: 114 }, { id: 'nerea_backlog', x: 606, y: 114, dir: 'left' }, { id: 'bruno', x: 352, y: 126, dir: 'left' }]
    : [{ id: 'yoli_tendencias', x: 309, y: 116, dir: 'right' }, { id: 'leoncio_quesitos', x: 434, y: 114 }, { id: 'nerea_backlog', x: 606, y: 114, dir: 'left' }, { id: 'bruno', x: 340, y: 128, dir: 'right' }],
});
Object.assign(PIEZAS, {
  async 'pecera-propuesta-a1'() { return ampliar(pecera('a1'), S); },
  async 'pecera-propuesta-a3'() { return ampliar(pecera('a3'), S); },
  async 'pecera-comparativa'() {
    return lamina([
      [{ c: await actual('pecera-460'), t: 'ACTUAL · x 300-620, Acto I (chaqueta en la silla)' }, { c: ampliar(pecera('a1'), S), t: 'PROPUESTA · Economía | Infografía | cinta | Desarrollo, Acto I' }],
      [{ c: await actual('pecera-460-a3'), t: 'ACTUAL · mismo tramo, Acto III (silla libre)' }, { c: ampliar(pecera('a3'), S), t: 'PROPUESTA · tras P04 la silla está en la mesa de Bruno; lazo de cinta' }],
    ], { titulo: 'Pecera (tramo central) · actual frente a propuesta (3×, personajes reales)' });
  },
});

// ------------------------------------------------------------------ STORYBOARDS
export function tira(frames, titulo, esc = 2, cols = 2) {
  const it = frames.map((f, i) => ({ c: ampliar(f.c, esc), t: (i + 1) + '. ' + f.t }));
  const filas = []; for (let i = 0; i < it.length; i += cols) filas.push(it.slice(i, i + cols));
  return lamina(filas, { titulo });
}
function botellasAire(g, n, seed) {
  for (let i = 0; i < n; i++) {
    const x = 214 + ((i * 37 + seed * 11) % 70), y = 52 + ((i * 23 + seed * 7) % 28);
    const ang = (i + seed) % 3;
    if (ang === 0) { rect(g, x, y, 3, 7, PAL.teal[5]); hline(g, x, y, 3, PAL.teal[7]); }
    else if (ang === 1) { rect(g, x, y, 7, 3, PAL.teal[5]); hline(g, x, y, 7, PAL.teal[7]); }
    else { for (let k = 0; k < 5; k++) px(g, x + k, y + k, PAL.teal[5]); px(g, x, y, PAL.white); }
    px(g, x + 1, y - 2, PAL.teal[7]); px(g, x + 3, y - 3, PAL.teal[6]);
  }
}
/** inserto de PLANO DETALLE (función de motor propuesta): recorte ampliado con marco y rótulo, encima del cuadro */
export function insertoDetalle(g, fuente, sx, sy, sw, sh, dx, dy, zoom, rotulo) {
  g.save(); g.imageSmoothingEnabled = false;
  rect(g, dx - 2, dy - 2, sw * zoom + 4, sh * zoom + 4 + 12, '#0b0a14');
  frameRect(g, dx - 2, dy - 2, sw * zoom + 4, sh * zoom + 4 + 12, '#f2ecd8');
  g.drawImage(fuente, sx, sy, sw, sh, dx, dy, sw * zoom, sh * zoom);
  label(g, rotulo, dx + 2, dy + sh * zoom - 1, '#f2ecd8');
  g.restore();
}
Object.assign(PIEZAS, {
  async 'sala-storyboard'() {
    const f1 = sala('a3');
    const f2 = sala('empuje');
    const f3 = renderSala(salaProp, { flags: F3, ocultar: ['figurantes_mercados', 'planillo_mesa'], actores: [
      { id: 'lector_medio', variante: 'chaqueta', x: 284, y: 104, rot: -0.62 },
      { id: 'inigo_sinergia', x: 98, y: 122, dir: 'right' }, { id: 'gervasio_acta', x: 56, y: 106, dir: 'right' },
      { id: 'bruno', x: 306, y: 120, dir: 'left', anim: 'talk', frame: 1 }] });
    botellasAire(f3.getContext('2d'), 3, 1);
    const f4 = sala('plof');
    const g4 = f4.getContext('2d');
    botellasAire(g4, 6, 2);
    label(g4, '¡PLOF!', 196, 22, '#ffffff', { outline: '#000000', scale: 2 });
    // inserto: la pegatina del reverso, a 4x
    const lecC = document.createElement('canvas'); lecC.width = 60; lecC.height = 20;
    pintaActor(lecC.getContext('2d'), 'lector_medio', 30, 16, { variante: 'caido', escala: 1, sombra: false });
    insertoDetalle(g4, lecC, 6, 2, 48, 16, 12, 18, 3, 'ATREZO - FOCUS GROUP 2014');
    return tira([
      { c: f1, t: 'Entrada: penumbra; el Lector, en la cabecera y bajo el foco' },
      { c: f2, t: 'Tras D4: Bruno va a la cabecera (lado libre)' },
      { c: f3, t: 'Empujar: se inclina hacia la mesa' },
      { c: f4, t: '¡PLOF! botellines + plano detalle de la pegatina' },
    ], 'Sala Amazonas · storyboard del clímax (7.4), con el fondo propuesto', 2);
  },
});
