// PROPUESTA ALTERNATIVA · catálogo de piezas (imágenes) que genera render.mjs. Cada pieza devuelve un canvas.
import { renderSala, ampliar, cargarImg } from './lib/escena.js';
import { capa, leyenda, etiqueta } from './lib/maqueta.js';
import { actor as pintaActor, sentado } from './lib/actores.js';
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

// ------------------------------------------------------------------ MAQUETAS DE LAS 10 SALAS
import { SALAS, ORDEN } from './lib/datos.js';
import { pintaGreybox } from './lib/greybox.js';
export function datosSala(id) {
  const d = SALAS[id];
  if (!d.desdeArte) return d;
  const base = salaMaq('a3');
  const a1 = salaMaq('a1');
  return { ...d, ...base, hs: a1.hs, npcs: [...base.npcs, { id: 'gervasio_acta', at: [287, 99], sentado: true, talk: [256, 124], txt: 'Gervasio preside (I-II)' }] };
}
async function maqueta(id) {
  const d = datosSala(id);
  let base;
  if (d.desdeArte) base = sala('a3');
  else base = pintaGreybox(d);
  const c = ampliar(base, S); const g = c.getContext('2d');
  g.fillStyle = 'rgba(10,8,20,0.28)'; g.fillRect(0, 0, c.width, c.height);
  capa(g, d, S);
  const L = lamina([[{ c, t: `${d.nombre} (\`${id}\`) · ${d.width}×144 · planta ${d.planta} · maqueta a escala real (3×)` }]], { extraTop: 26, titulo: 'Maqueta propuesta · ' + d.nombre });
  leyenda(L.getContext('2d'), 12, 40);
  return L;
}
for (const id of ORDEN) PIEZAS['maqueta-' + id] = () => maqueta(id);

// ------------------------------------------------------------------ MAPA Y SISTEMA DE DISEÑO
import { mapaEdificio } from './lib/mapa.js';
import { placa, rotuloDepto, rotuloDeptoW, umbral, marcoPuerta, huecoAbierto, ascensor as kitAscensor, escalera as kitEscalera, mampara, cantoVivo, DEPTO, PLANTA } from './lib/kit.js';
import { tiny as tiny35 } from '../../../content/rooms/art/lib-oficina.js';
import { gradV, paint, ditherPick, hash2 } from '../../../engine/draw.js';
PIEZAS['mapa-edificio'] = async () => mapaEdificio();
PIEZAS['sistema-kit'] = async () => {
  const c = document.createElement('canvas'); c.width = 400; c.height = 230; const g = c.getContext('2d');
  rect(g, 0, 0, 400, 230, '#24223a');
  // placas por planta
  let y = 6;
  for (const [p, t, f] of [['-1', 'SISTEMAS', null], ['0', 'VESTÍBULO', 'v'], ['1', 'REDACCIÓN', '^'], ['2', 'ECOSISTEMA', '<']]) { placa(g, 6, y, t, { planta: p, flecha: f }); y += 17; }
  // rótulos de departamento
  let x = 120, yy = 6;
  for (const dep of Object.keys(DEPTO)) { const w = rotuloDeptoW(dep); if (x + w > 396) { x = 120; yy += 18; } rotuloDepto(g, x, yy, dep); x += w + 4; }
  // kit de salida: puerta abierta + umbral, ascensor, escaleras
  const base = 168;
  rect(g, 0, 84, 400, base - 84, '#3a3a48'); paint(g, 0, base, 400, 230 - base, (xx, yy2) => ditherPick(xx, yy2, ['#2a2a34', '#3a3a46'], 0.3 + (yy2 - base) / 90));
  marcoPuerta(g, 10, 110, 28, 58); huecoAbierto(g, 10, 110, 28, 58, { luz: '#ffd890' }); umbral(g, 6, 170, 36, 6, DEPTO.direccion.c); placa(g, 4, 94, 'PAJARERA', { planta: '1' });
  kitAscensor(g, 74, 112, 30, 56, '1'); umbral(g, 70, 170, 38, 6, PLANTA['1'].c);
  kitEscalera(g, 130, 112, 40, 56, 'sube'); umbral(g, 128, 170, 44, 6, PLANTA['2'].c);
  kitEscalera(g, 186, 136, 40, 32, 'baja'); umbral(g, 184, 170, 44, 6, PLANTA['0'].c);
  mampara(g, 240, 168, 50, 20, DEPTO.desarrollo.c, { texto: 'DESARROLLO' });
  // interactivo vs decorado
  rect(g, 304, 140, 18, 12, '#d8cca0'); cantoVivo(g, 304, 140, 18, 12); tiny35(g, 'SÍ', 307, 143, '#141220');
  rect(g, 340, 140, 18, 12, '#9a9aa8'); tiny35(g, 'NO', 343, 143, '#141220');
  // tipografía: fuente del juego (rótulo) y 3x5 (micro)
  label(g, 'ROTULO 7 PX', 300, 92, '#f2ecd8'); tiny35(g, 'MICRO 3X5 MIN.', 300, 110, '#f2ecd8'); tiny35(g, 'MAX 9 CAR./36 PX', 300, 118, '#c8c4d8');
  const k = ampliar(c, 3); const kg = k.getContext('2d');
  const T = (t, x2, y2) => etiqueta(kg, t, x2 * 3, y2 * 3, '#fff27a', { size: 12 });
  T('PLACA: banda = planta, flecha = dirección', 6, 74);
  T('RÓTULO DE ZONA: filete = color del departamento', 150, 74);
  T('puerta + umbral', 4, 178); T('ascensor', 72, 178); T('escalera ▲', 128, 178); T('escalera ▼', 186, 178); T('mampara baja', 240, 178);
  T('canto vivo = interactivo', 300, 158); T('tipografía', 300, 80);
  return lamina([[{ c: k, t: 'Kit común (dibujado con engine/draw.js + lib/kit.js) a 3×' }]], { titulo: 'Sistema de diseño · señalética, umbrales, puertas, ascensor, escalera' });
};

// ------------------------------------------------------------------ STORYBOARDS EN GREYBOX (resto de remates)
import { glow as glowK, ellipse as ellK, line as lineK, poly as polyK } from '../../../engine/draw.js';
function cuadro(id, npcs, extra, cam) {
  const d = { ...SALAS[id], npcs };
  const c = pintaGreybox(d, { extra });
  if (cam == null) return c;
  const k = document.createElement('canvas'); k.width = 320; k.height = 144; k.getContext('2d').drawImage(c, -cam, 0); return k;
}
function pantallaTexto(g, x, y, w, h, lineas, col = '#ffd23f', fondo = '#0e1830') {
  rect(g, x - 2, y - 2, w + 4, h + 4, '#c8ccd8'); rect(g, x, y, w, h, fondo);
  lineas.forEach((l, i) => tiny35(g, l, x + (w >> 1), y + 3 + i * 7, col, { align: 'center' }));
}
PIEZAS['pecera-storyboard'] = async () => {
  const yo = { id: 'yoli_tendencias', at: [300, 116], dir: 'left' }, br = { id: 'bruno', at: [150, 124], dir: 'right' };
  const f1 = cuadro('pecera', [yo, br], null, 100);
  const f2 = cuadro('pecera', [yo, br, { id: 'inigo_sinergia', at: [118, 118], dir: 'right' }], null, 100);
  const f3 = cuadro('pecera', [yo, br, { id: 'inigo_sinergia', at: [232, 120], dir: 'down' }], (g) => {
    rect(g, 226, 84, 14, 9, '#c8ccd8'); rect(g, 227, 85, 12, 7, '#2a4a8a'); glowK(g, 233, 88, 14, 10, '#9ac8ff', 0.3, 3);
  }, 100);
  const f4 = cuadro('pecera', [yo, br, { id: 'inigo_sinergia', at: [232, 120], dir: 'down' }], null, 100);
  const g4 = f4.getContext('2d');
  rect(g4, 40, 16, 240, 92, '#0b0a14'); frameRect(g4, 40, 16, 240, 92, '#f2ecd8');
  rect(g4, 60, 24, 200, 70, '#a8acb8'); rect(g4, 66, 28, 188, 56, '#ffffff'); rect(g4, 66, 28, 188, 9, '#1c2a52');
  tiny35(g4, 'TITULATOR 3000', 160, 30, '#ffd23f', { align: 'center' });
  label(g4, 'EL IBEX ABRE PLANO.', 160, 38, '#141220', { align: 'center' }); label(g4, 'PLANO.', 160, 49, '#141220', { align: 'center' });
  label(g4, '¿POR QUÉ NADIE HABLA DE ESTO?', 160, 60, '#c83030', { align: 'center' });
  rect(g4, 222, 76, 14, 6, '#ffd23f'); tiny35(g4, ':)', 225, 77, '#141220');
  label(g4, 'PLANO DETALLE · 2 s', 46, 96, '#f2ecd8');
  return tira([{ c: f1, t: 'Bruno sube del vestíbulo; Yoli y su gráfica' }, { c: f2, t: 'Entra Íñigo por el núcleo' }, { c: f3, t: '«Os presento al Titulator»: gira el portátil' }, { c: f4, t: 'Plano detalle de la pantalla (no globo)' }], 'Pecera · escena 7.2 (presentación del villano) en greybox', 2);
};
PIEZAS['cpd-storyboard'] = async () => {
  const paco = { id: 'paco_ticket', at: [274, 96], sentado: true };
  const tiraPapel = (g, n) => { for (let i = 0; i < n; i++) { rect(g, 186 + i * 6, 96 + i * 7, 9, 7, '#f2ecd8'); px(g, 187 + i * 6, 98 + i * 7, '#9aa0b0'); px(g, 193 + i * 6, 98 + i * 7, '#9aa0b0'); } };
  const cerrado = (g) => { rect(g, 168, 16, 34, 80, '#1a1e2a'); frameRect(g, 168, 16, 34, 80, '#4a5468'); rect(g, 176, 40, 18, 8, '#e8d040'); tiny35(g, 'NO ABRIR', 185, 41, '#141220', { align: 'center' }); };
  const abierto = (g) => { rect(g, 168, 16, 34, 80, '#0a1a10'); glowK(g, 185, 60, 30, 34, '#7aff9a', 0.35, 4); polyK(g, [[168, 16], [150, 24], [150, 104], [168, 96]], '#2a3040'); rect(g, 154, 50, 10, 6, '#e8d040'); for (let i = 0; i < 6; i++) lineK(g, 170 + i * 5, 20, 172 + i * 4, 90, ['#c83030', '#3070d0', '#e8c040'][i % 3]); };
  const f1 = cuadro('cpd', [paco, { id: 'bruno', at: [222, 120], dir: 'left' }], (g) => { cerrado(g); tiraPapel(g, 2); });
  const f2 = cuadro('cpd', [paco, { id: 'bruno', at: [236, 124], dir: 'left' }], (g) => { cerrado(g); tiraPapel(g, 5); label(g, '¡EH! ¡QUE ES MI BORRADOR!', 160, 20, '#b6ff4d', { align: 'center', outline: '#000' }); });
  const f3 = cuadro('cpd', [paco, { id: 'bruno', at: [236, 124], dir: 'left' }, { id: 'ruben', at: [185, 94] }], (g) => { abierto(g); tiraPapel(g, 5); });
  const f4 = cuadro('cpd', [paco, { id: 'bruno', at: [214, 122], dir: 'left' }, { id: 'ruben', at: [185, 94] }], (g) => { abierto(g); });
  return tira([{ c: f1, t: 'Tirar: la tira sale de la rendija del 27' }, { c: f2, t: 'Sale un metro, dos, tres… voz dentro' }, { c: f3, t: 'El 27 se ABRE (estado abierto al empezar)' }, { c: f4, t: 'Rubén asomado; armario abierto ya para siempre' }], 'CPD · revelación de Rubén (7.3) en greybox', 2);
};
PIEZAS['catacumba-storyboard'] = async () => {
  const au = { id: 'aurora_galerada', at: [232, 108], dir: 'left' }, br = { id: 'bruno', at: [70, 124], dir: 'right' };
  const te = { id: 'teodoro_cuerpodoce', at: [104, 99], sentado: true };
  const tel = (g, desc) => { rect(g, 122, 70, 16, 8, '#c82020'); if (!desc) rect(g, 121, 67, 18, 3, '#e83a3a'); };
  const f1 = cuadro('catacumba', [au, br, te], (g) => { tel(g, false); rect(g, 92, 72, 26, 3, '#e8c040'); });
  const f2 = cuadro('catacumba', [au, br, te], (g) => { tel(g, true); rect(g, 108, 58, 4, 10, '#e83a3a'); for (let i = 0; i < 6; i++) px(g, 112 + i * 2, 70 + (i & 1) * 2, '#e83a3a'); });
  const f3 = cuadro('catacumba', [au, br, te], (g) => { tel(g, true); });
  const g3 = f3.getContext('2d');
  const sp = document.createElement('canvas'); sp.width = 40; sp.height = 30; sentado(sp.getContext('2d'), 'teodoro_cuerpodoce', 20, 30, { escala: 1 });
  insertoDetalle(g3, sp, 6, 0, 28, 22, 160, 14, 4, '');
  rect(g3, 196, 52, 6, 30, '#e83a3a');
  label(g3, 'GOYITA. PÁGINA 7 CERRADA.', 160, 112, '#D9CFA6', { align: 'center', outline: '#000' });
  const f4 = cuadro('catacumba', [{ ...au, dir: 'left' }, br, te, { id: 'inigo_sinergia', at: [30, 112], dir: 'right' }], (g) => { tel(g, false); });
  return tira([{ c: f1, t: 'Mide la ficha con el tipómetro (dos veces)' }, { c: f2, t: 'DESCUELGA el teléfono rojo (estado descolgado)' }, { c: f3, t: 'Primer plano: primera voz en alto' }, { c: f4, t: 'Aurora se quita las gafas; entra Íñigo' }], 'Catacumba · inicio del Acto III (7.3a) en greybox', 2);
};
PIEZAS['vestibulo-storyboard'] = async () => {
  const amanecer = (g) => {
    const gr = g.createLinearGradient(0, 24, 0, 98); gr.addColorStop(0, '#ffb070'); gr.addColorStop(1, '#ffe8b0');
    g.fillStyle = gr; g.fillRect(4, 24, 40, 74);
    g.save(); g.globalAlpha = 0.25; polyK(g, [[44, 40], [44, 98], [200, 144], [120, 144]], '#ffd890'); g.restore();
  };
  const ce = { id: 'celestino', at: [178, 97] };
  const fardo = (g) => { rect(g, 160, 80, 22, 8, '#e8e4d8'); for (let i = 0; i < 3; i++) hline(g, 160, 81 + i * 2, 22, '#9a9aa8'); lineK(g, 171, 80, 171, 88, '#c83030'); };
  const f1 = cuadro('vestibulo', [ce, { id: 'ruben', at: [56, 116], dir: 'right' }, { id: 'bruno', at: [120, 126], dir: 'right' }], amanecer);
  const f2 = cuadro('vestibulo', [ce, { id: 'inigo_sinergia', at: [134, 120], dir: 'right' }, { id: 'bruno', at: [92, 126], dir: 'right' }], (g) => { amanecer(g); rect(g, 136, 92, 16, 12, '#a8845a'); hline(g, 136, 92, 16, '#c8a070'); rect(g, 138, 88, 6, 5, '#f49ab8'); });
  const f3 = cuadro('vestibulo', [ce, { id: 'gervasio_acta', at: [120, 122], dir: 'right' }, { id: 'bruno', at: [140, 128], dir: 'right' }], (g) => { amanecer(g); fardo(g); });
  const f4 = document.createElement('canvas'); f4.width = 320; f4.height = 144; const g4 = f4.getContext('2d');
  rect(g4, 0, 0, 320, 144, '#e8e2d0'); rect(g4, 0, 0, 320, 12, '#141220'); label(g4, 'elContable · SÁBADO · PÁGINA 7', 160, 0, '#f2ecd8', { align: 'center' });
  for (let i = 0; i < 9; i++) hline(g4, 12, 20 + i * 4, 140, '#b8b0a0');
  rect(g4, 10, 70, 300, 2, '#141220');
  label(g4, 'Hidrovoltia lanza una opa', 160, 78, '#141220', { align: 'center', scale: 2, bold: true });
  label(g4, 'sobre Banco Robledal', 160, 102, '#141220', { align: 'center', scale: 1, bold: true });
  label(g4, 'Por Bruno Pellejo', 160, 120, '#c83030', { align: 'center' });
  return tira([{ c: f1, t: 'Sábado 6:00: el cristal de la calle amanece' }, { c: f2, t: 'Íñigo con su caja (pósits, matriz, portátil)' }, { c: f3, t: 'El fardo de periódicos, en el mostrador' }, { c: f4, t: 'Página 7 en tipografía de periódico' }], 'Vestíbulo · epílogo (7.5) en greybox', 2);
};
PIEZAS['pecera-maqueta-prueba'] = async () => {
  const full = renderSala(peceraProp, { actores: [{ id: 'yoli_tendencias', x: 309, y: 116, dir: 'right' }, { id: 'leoncio_quesitos', x: 434, y: 114 }, { id: 'nerea_backlog', x: 606, y: 114, dir: 'left' }] });
  const big = ampliar(full, S); const g = big.getContext('2d');
  g.fillStyle = 'rgba(10,8,20,0.3)'; g.fillRect(0, 0, big.width, big.height);
  const d = SALAS.pecera;
  capa(g, { ...d, walk: peceraProp.walkboxes, npcs: d.npcs.filter(n => ['yoli_tendencias', 'leoncio_quesitos', 'nerea_backlog'].includes(n.id)), vistas: [], oclusores: [{ r: [488, 82, 108, 22], txt: 'patas del kanban (sorted)' }, { r: [350, 86, 28, 24], txt: 'silla (sorted)' }] }, S, { escalas: false });
  const k = document.createElement('canvas'); k.width = 320 * S; k.height = 144 * S; k.getContext('2d').drawImage(big, -300 * S, 0);
  const L = lamina([[{ c: k, t: 'PROPUESTA + maqueta · Pecera x 300-620' }]], { titulo: 'Pecera · capa de maqueta sobre la prueba pintada', extraTop: 24 });
  leyenda(L.getContext('2d'), 12, 40); return L;
};
