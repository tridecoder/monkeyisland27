// INVENTARIO de FE DE ERRATAS (biblia §4, 18 objetos + `boli_muerto` de la adenda 6.1 + `correo_evaristo` de la E2 §5.3). ARCHIVO COMPARTIDO: no lo edita ningún autor de sala.
// Contiene: nombre, icono (28×18), Mirar (con estados), Usar del móvil (pistas), y las combinaciones
// objeto+objeto que no dependen de una sala (P01b chicle+tarjeta, §8.1 azúcar+café).
// Las interacciones «objeto con objeto de sala / PNJ» las implementa la sala en su lógica
// (handlers 'usar:<item>' / 'dar:<item>' del hotspot o del PNJ).
// Regla anti-callejón (§4): ningún objeto se gasta salvo en su uso correcto.
import { PAL, rect, px, hline, vline, ellipse, poly, ditherPick, frameRect, line } from '../engine/draw.js';
import { drawText } from '../engine/font.js';
import { menuMovil } from './lib/movil.js';

/** La libreta de réplicas: cuántas llevo y la lista en el panel (cualquier opción, Esc o un toque fuera la cierran). */
async function abrirLibreta(api) {
  const D = api.game.content.duels;
  const learned = (D.pairs || []).filter(p => api.flag(p.flag));
  await api.say(`Mi libreta de réplicas: ${learned.length} de ${N_REPLICAS}. En otra empresa esto sería un máster.`);
  if (!learned.length) return;
  await api.choose(learned.map(p => '«' + p.reply + '»').concat(['[Cerrar la libreta]']), { escape: learned.length });
}

// ------------------------------------------------------------------ icon helpers
const P = PAL;
function sheet(g, x, y, w, h, ramp = [P.paper[4], P.paper[5], P.paper[6], P.paper[7]]) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
    g.fillStyle = ditherPick(xx, yy, ramp, 0.85 - (xx - x) / (w * 2.2) - (yy - y) / (h * 3)); g.fillRect(xx, yy, 1, 1);
  }
  vline(g, x + w - 1, y + 1, h - 1, ramp[0]); hline(g, x + 1, y + h - 1, w - 1, ramp[0]);
}
function textLines(g, x, y, w, n, c = P.paper[1], gap = 2, seed = 3) {
  for (let i = 0; i < n; i++) { const lw = w - ((i * 7 + seed) % 5); hline(g, x, y + i * gap, Math.max(2, lw), c); }
}
function stamp(g, x, y, w, h, c) { frameRect(g, x, y, w, h, c); hline(g, x + 2, y + 2, w - 4, c); if (h > 5) hline(g, x + 2, y + h - 3, w - 6, c); }

const icons = {
  tarjeta_becario(g, x, y, v, k) {
    // lanyard + plastic card with photo slot
    line(g, 9, 0, 12, 3, P.red[3]); line(g, 19, 0, 16, 3, P.red[3]); rect(g, 12, 2, 5, 2, P.metal[5]);
    rect(g, 4, 4, 21, 13, P.paper[6]); hline(g, 4, 4, 21, P.paper[7]); vline(g, 24, 5, 12, P.paper[3]); hline(g, 5, 16, 20, P.paper[3]);
    rect(g, 4, 4, 21, 3, P.red[3]); hline(g, 4, 4, 21, P.red[4]);
    if (k === 'sinfoto') { frameRect(g, 6, 8, 7, 7, P.paper[2]); px(g, 8, 10, P.paper[3]); px(g, 10, 12, P.paper[3]); }
    else {
      rect(g, 6, 8, 7, 7, P.blue[5]); rect(g, 7, 9, 5, 4, '#e8b48c'); rect(g, 7, 8, 5, 2, '#6a4026'); px(g, 10, 7, '#6a4026');
      rect(g, 7, 13, 5, 2, '#9cc8ec'); px(g, 8, 10, P.ink[0]); px(g, 10, 10, P.ink[0]);
    }
    textLines(g, 14, 9, 9, 3, P.paper[2], 2);
    if (k === 'chicle') { ellipse(g, 22, 15, 3, 2, '#f080b0'); px(g, 21, 14, '#ffc0d8'); }
  },
  libreta_replicas(g) {
    rect(g, 6, 2, 17, 15, P.blue[3]); hline(g, 6, 2, 17, P.blue[5]); vline(g, 22, 3, 14, P.blue[1]); hline(g, 7, 16, 16, P.blue[1]);
    rect(g, 9, 4, 12, 11, P.paper[6]); textLines(g, 10, 6, 10, 4, P.blue[4], 2);
    for (let yy = 3; yy < 17; yy += 2) { px(g, 5, yy, P.metal[6]); px(g, 6, yy, P.metal[3]); }
    rect(g, 18, 1, 2, 5, P.red[4]);   // bookmark
  },
  movil(g) {
    rect(g, 9, 1, 11, 17, P.ink[2]); hline(g, 10, 1, 9, P.metal[3]); vline(g, 9, 2, 15, P.metal[2]);
    for (let yy = 3; yy < 14; yy++) for (let xx = 11; xx < 18; xx++) { g.fillStyle = ditherPick(xx, yy, [P.blue[3], P.blue[4], P.blue[5], P.blue[6]], 0.9 - (yy - 3) / 14 - (xx - 11) / 30); g.fillRect(xx, yy, 1, 1); }
    rect(g, 12, 5, 5, 2, P.paper[6]); hline(g, 12, 9, 4, P.blue[7]); hline(g, 12, 11, 3, P.blue[7]);
    ellipse(g, 18, 3, 1.6, 1.6, P.red[4]);  // missed call
    rect(g, 13, 15, 3, 1, P.metal[4]);
  },
  chicle(g) {
    poly(g, [[4, 9], [22, 4], [24, 10], [6, 15]], (xx, yy) => ditherPick(xx, yy, ['#a03068', '#d04888', '#f080b0', '#ffc0d8'], 0.85 - (yy - 4) / 14 - (xx - 4) / 50));
    line(g, 10, 7, 12, 13, P.paper[6]); line(g, 16, 6, 18, 12, P.paper[6]);
    px(g, 7, 9, '#ffe0ec'); px(g, 8, 9, '#ffe0ec');
  },
  cafe(g) {
    // paper cup «cortado», with steam
    poly(g, [[8, 5], [21, 5], [19, 17], [10, 17]], (xx, yy) => ditherPick(xx, yy, [P.paper[3], P.paper[5], P.paper[6], P.paper[7]], 0.95 - (xx - 8) / 16));
    rect(g, 7, 4, 15, 2, P.paper[7]); hline(g, 7, 5, 15, P.paper[3]);
    rect(g, 9, 9, 11, 4, P.wood[3]); hline(g, 9, 9, 11, P.wood[5]); px(g, 11, 10, P.wood[6]);
    for (let i = 0; i < 3; i++) { px(g, 11 + i * 3, 2 - (i % 2), '#dcdcec'); px(g, 12 + i * 3, i % 2, '#b8b8d0'); }
  },
  chaqueta_ramirez(g) {
    const c = ['#6e583e', '#a08a68', '#c8b088', '#e0cca8'];
    const shape = [[9, 2], [12, 1], [14, 6], [16, 1], [19, 2], [24, 5], [27, 15], [23, 16], [21, 10], [21, 17], [7, 17], [7, 10], [5, 16], [1, 15], [4, 5]];
    poly(g, shape, (xx, yy) => ditherPick(xx, yy, c, 0.95 - (xx - 1) / 36 - (yy - 1) / 44));
    poly(g, [[12, 1], [14, 9], [16, 1]], P.paper[6]);                    // shirt V
    line(g, 11, 2, 13, 10, c[0]); line(g, 17, 2, 15, 10, c[0]); vline(g, 14, 10, 7, c[0]);
    line(g, 7, 10, 5, 15, c[0]); line(g, 21, 10, 23, 15, c[0]);           // sleeve seams
    px(g, 13, 12, P.wood[2]); px(g, 13, 15, P.wood[2]);
    hline(g, 16, 12, 4, c[0]); rect(g, 17, 10, 2, 2, P.paper[7]);          // pocket with the sugar sachet
  },
  sobre_azucar(g) {
    poly(g, [[5, 5], [23, 3], [24, 14], [6, 16]], (xx, yy) => ditherPick(xx, yy, [P.paper[4], P.paper[5], P.paper[6], P.paper[7]], 0.6 + (yy - 3) * 0.02 - (xx - 5) * 0.02));
    for (let xx = 6; xx < 24; xx += 2) px(g, xx, 5 - Math.round((xx - 5) / 9), P.paper[2]);
    rect(g, 9, 8, 11, 4, P.blue[4]); hline(g, 9, 8, 11, P.blue[6]);
    px(g, 11, 9, P.white); px(g, 13, 10, P.white); px(g, 15, 9, P.white); px(g, 17, 10, P.white);
  },
  ficha_pagina_7(g, x, y, v) {
    sheet(g, 6, 0, 17, 18);
    drawText(g, '7', 8, -2, P.red[3], { outline: null, bold: true });
    textLines(g, 14, 3, 7, 2, P.paper[2], 2);
    const marks = [v && v.flag('casilla_hueco'), v && v.flag('casilla_fuente'), v && v.flag('casilla_firma')];
    marks.forEach((on, i) => {
      const yy = 8 + i * 3;
      frameRect(g, 8, yy, 3, 3, P.ink[2]);
      if (on) { px(g, 9, yy + 1, P.leaf[4]); px(g, 10, yy, P.leaf[5]); px(g, 11, yy - 1, P.leaf[5]); }
      hline(g, 13, yy + 1, 7, P.paper[2]);
    });
    if (v && v.flag('pieza_escrita')) hline(g, 8, 17, 12, v.flag('pieza_recortada') ? P.leaf[4] : P.red[3]);   // la pieza
  },
  copias_rechazadas(g) {
    sheet(g, 3, 3, 16, 14, [P.paper[3], P.paper[4], P.paper[5], P.paper[6]]);
    sheet(g, 8, 0, 16, 15);
    textLines(g, 10, 2, 12, 3, P.paper[2], 2);
    stamp(g, 10, 8, 12, 6, P.red[3]); px(g, 21, 13, P.red[2]);
  },
  fotocopia_nota_direccion(g) {
    sheet(g, 5, 0, 18, 18, [P.metal[3], P.metal[5], P.metal[6], P.metal[7]]);
    textLines(g, 7, 2, 13, 3, P.metal[2], 2);
    drawText(g, '312', 7, 7, P.ink[2], { outline: null });
    hline(g, 7, 15, 14, P.metal[2]); px(g, 19, 14, P.blue[3]); px(g, 20, 13, P.blue[3]);   // boli del reverso
  },
  mensaje_fp(g) {
    // continuous paper with perforated edges
    sheet(g, 5, 0, 18, 18, [P.paper[4], P.paper[5], P.paper[6], P.paper[7]]);
    for (let yy = 1; yy < 18; yy += 3) { px(g, 6, yy, P.paper[1]); px(g, 21, yy, P.paper[1]); }
    vline(g, 8, 0, 18, P.paper[3]); vline(g, 19, 0, 18, P.paper[3]);
    drawText(g, 'F.P.', 10, 1, P.ink[2], { outline: null });
    textLines(g, 10, 12, 8, 3, P.paper[1], 2);
  },
  manual_fax(g) {
    rect(g, 6, 1, 17, 17, P.paper[3]); hline(g, 6, 1, 17, P.paper[5]); vline(g, 22, 2, 16, P.paper[1]);
    rect(g, 6, 1, 3, 17, P.paper[1]);
    rect(g, 11, 6, 9, 6, P.paper[5]); rect(g, 12, 4, 7, 2, P.paper[6]); rect(g, 12, 8, 3, 2, P.ink[3]); rect(g, 16, 8, 3, 1, P.crt[4]);
    drawText(g, '9', 17, 9, P.red[3], { outline: null });
  },
  boli_muerto(g) {
    // bolígrafo rojo sin tinta, tumbado en diagonal: cuerpo rojo, capuchón con clip, punta seca y una cruz de despedida
    line(g, 5, 15, 22, 5, P.red[2], 4); line(g, 5, 14, 22, 4, P.red[4], 2); line(g, 6, 13, 21, 4, P.red[5]);
    line(g, 18, 6, 25, 2, P.ink[2], 3); line(g, 18, 5, 25, 1, P.metal[5]);                      // capuchón con clip
    line(g, 21, 6, 22, 3, P.metal[6]);
    px(g, 3, 16, P.ink[3]); px(g, 4, 16, P.ink[2]); px(g, 3, 17, P.metal[2]);                     // la punta seca
    line(g, 9, 17, 13, 13, P.ink[1]); line(g, 9, 13, 13, 17, P.ink[1]);                           // cruz: murió corrigiendo
    px(g, 8, 11, P.paper[6]); px(g, 14, 9, P.paper[6]);                                           // brillo del plástico
  },
  pieza_opa(g, x, y, v, k) {
    const h = k === 'recortada' ? 13 : 18;
    sheet(g, 6, 0, 16, h);
    rect(g, 8, 2, 12, 2, P.ink[2]);
    textLines(g, 8, 6, 12, k === 'recortada' ? 4 : 6, P.paper[2], 2, 1);
    if (k === 'recortada') { for (let xx = 4; xx < 25; xx += 2) px(g, xx, 15, P.red[4]); line(g, 21, 13, 25, 17, P.metal[5]); line(g, 25, 13, 21, 17, P.metal[5]); }
  },
  album_eventos(g) {
    rect(g, 3, 2, 22, 15, '#1e5adc'); hline(g, 3, 2, 22, '#4a80f0'); vline(g, 24, 3, 14, '#123a90'); hline(g, 4, 16, 21, '#123a90');
    vline(g, 13, 2, 15, '#123a90');
    rect(g, 5, 4, 7, 5, P.paper[6]); rect(g, 6, 5, 5, 3, P.dusk[4]); px(g, 10, 7, '#d4dcb4');
    rect(g, 15, 4, 8, 5, P.paper[6]); rect(g, 16, 5, 6, 3, P.teal[4]); px(g, 21, 6, '#d4dcb4');
    rect(g, 5, 10, 7, 5, P.paper[6]); rect(g, 6, 11, 5, 3, P.gold[4]);
    rect(g, 15, 10, 8, 5, P.paper[6]); rect(g, 16, 11, 6, 3, P.red[4]); px(g, 20, 12, '#d4dcb4');
  },
  ticket_n1(g) {
    sheet(g, 7, 0, 14, 18);
    for (let xx = 7; xx < 21; xx += 2) px(g, xx, 17, P.paper[2]);
    drawText(g, 'Nº1', 8, -1, P.ink[2], { outline: null });
    textLines(g, 9, 9, 9, 2, P.paper[2], 2);
    stamp(g, 9, 12, 10, 5, P.leaf[4]);
  },
  correo_evaristo(g) {
    // E2 §5.3: folio impreso con membrete de Controlling y una coma roja, enorme, subrayada dos veces
    sheet(g, 5, 0, 18, 18);
    rect(g, 7, 2, 14, 2, '#33427a'); px(g, 8, 2, '#f2ecc4'); px(g, 11, 2, '#f2ecc4');           // membrete (su corbata)
    textLines(g, 7, 6, 11, 2, P.paper[2], 2, 2);
    rect(g, 16, 9, 3, 3, P.red[3]); px(g, 17, 12, P.red[3]); px(g, 16, 13, P.red[3]);            // la coma
    hline(g, 13, 15, 8, P.red[4]); hline(g, 14, 16, 7, P.red[4]);                                // subrayada dos veces, con regla
    textLines(g, 7, 10, 7, 2, P.paper[2], 2, 4);
  },
  acta_reunion(g) {
    sheet(g, 3, 0, 22, 18);
    drawText(g, 'ACTA', 5, -1, P.ink[2], { outline: null });
    line(g, 7, 10, 18, 10, P.blue[3]); line(g, 7, 13, 14, 13, P.blue[3]);
    ellipse(g, 18, 14, 3, 2, (xx, yy, d) => (d > 0.6 ? P.wood[4] : null));   // coffee ring
    px(g, 11, 9, P.red[4]); px(g, 15, 12, P.red[4]);   // two typos, Aurora would cry
  },
};

// ------------------------------------------------------------------ helpers for handlers
const say = (lines) => async (api) => { await api.say(lines); };
const N_REPLICAS = 16;
/** Una línea de un PNJ si está en la sala; si no, la dice Bruno citándole (los «Dar» del correo, E2 §5.3). */
const dice = (who, line) => async (api) => {
  const p = api.actorPos(who);
  if (p && p.room === api.room) await api.sayAs(who, line); else await api.say(line);
};       // adenda 6.1: «[N] de 16» (14 de la biblia + R15/R16)

// ------------------------------------------------------------------ plan §8.1: la ficha viva (textos literales del plan)
export const FICHA = {
  titulo: 'Ficha de la página 7. Hueco, fuente, firma.',
  hueco: ['HUECO: vendida a Siestatón, sin confirmar. Lo decide la Sala Amazonas.',          // E2 L34
    'HUECO: la reunión ha acabado. Maripaz no. Sigue sentada en el planillo.',
    'HUECO, hecho: Siestatón, a la web. Veintitrés líneas abajo, mías.'],
  fuente: ['FUENTE: dos fuentes, dice Aurora. Tengo cero.',
    'FUENTE: tengo una nota de gasto con un reverso. Me falta otra fuente.',
    'FUENTE, hecho: una anónima y otra con IVA.'],
  firma: ['FIRMA: Teodoro solo habla por fax. Y el fax no tiene papel.',
    'FIRMA: el fax ya habla. Ahora hay que ganárselo contestando.',
    'FIRMA, hecho: «Trece con espacios. Cabe.»'],
  margen: 'Al margen, a lápiz: «Arriba no me atiende nadie. El CMS está en coma».',
  pieza: ['PIEZA: sin escribir. Primero las fuentes; luego, mi ordenador.',
    'PIEZA: treinta y una líneas. El hueco, veintitrés. Me sobran ocho.',                    // E2 L34
    'PIEZA: veintitrés líneas. Lista para Teodoro.',
    'PIEZA: treinta y una líneas. Sobra un 26 %, dice Herminia. ¿Quién recorta?'],      // E1.4.1 (herminia_midio)
  // E2 §10.4: notas a lápiz de la trama de la coma (Evaristo)
  evaristo: ['Al margen, a lápiz: «Evaristo me ha llamado. Planta 2. Escucharle entero».',
    'Al margen, a lápiz: «La coma de Evaristo, a Aurora».',
    'Al margen, a lápiz: «El correo, en el momento oportuno».'],
};
/** Las líneas de Mirar la ficha según el estado de la partida (también las usa tools/test-fase0.mjs). */
export function fichaViva(api) {
  const f = (k) => !!api.flag(k);
  const out = [FICHA.titulo];
  out.push(FICHA.hueco[f('casilla_hueco') ? 2 : f('reunion_terminada') ? 1 : 0]);
  out.push(FICHA.fuente[f('casilla_fuente') ? 2 : (api.has('fotocopia_nota_direccion') || api.has('mensaje_fp')) ? 1 : 0]);
  out.push(FICHA.firma[f('casilla_firma') ? 2 : f('fax_con_papel') ? 1 : 0]);
  if (!f('cms_vivo')) out.push(FICHA.margen);
  if (f('casilla_fuente') || f('pieza_escrita')) out.push(FICHA.pieza[f('pieza_recortada') ? 2 : f('pieza_escrita') ? (f('herminia_midio') ? 3 : 1) : 0]);
  // E2 §10.4: la coma de Evaristo (una nota como mucho)
  if (api.has('correo_evaristo') && !f('duelo_inigo_ganado')) out.push(FICHA.evaristo[2]);
  else if (f('evaristo_escuchado') && !f('coma_bendecida')) out.push(FICHA.evaristo[1]);
  else if (f('nota_gasto_presentada') && !f('evaristo_escuchado')) out.push(FICHA.evaristo[0]);
  return out;
}

export default {
  tarjeta_becario: {
    name: 'tarjeta de becario', icon: icons.tarjeta_becario,
    iconKey: (v) => (v.flag('foto_en_organigrama') ? 'sinfoto' : v.flag('tarjeta_con_chicle') ? 'chicle' : ''),
    handlers: {
      mirar: async (api) => {
        if (api.flag('foto_en_organigrama')) await api.say('Sin foto. Ya no la necesito: mi cara está en el organigrama.');
        else if (api.flag('tarjeta_con_chicle')) await api.say('Con chicle detrás. Es lo primero que se me pega en esta empresa.');
        else await api.say(['Tarjeta de becario: «Bruno Pellizco». La foto es de cuando tenía 23 años.', 'Y esperanza.']);
      },
    },
    // P01b: lo implementa el inventario común (en cualquier sala)
    combine: {
      chicle: async (api) => {
        api.take('chicle');
        api.setFlag('tarjeta_con_chicle', true);
        api.sfx('pickup');
        await api.say('Le pego el chicle por detrás a la foto. Ahora mi cara se adhiere a cosas.');
      },
    },
  },
  libreta_replicas: {
    name: 'libreta de réplicas', icon: icons.libreta_replicas,
    solo: true,                     // se usa sola: «Usar libreta» la abre (como Mirar), sin «con…»
    handlers: {
      usar: async (api) => abrirLibreta(api),
      mirar: async (api) => abrirLibreta(api),
    },
  },
  movil: {
    name: 'móvil', icon: icons.movil,
    solo: true,                     // se usa solo: Usar, Usar con Bruno, clic derecho y doble toque abren su menú
    handlers: {
      // adenda 2.2: con `tadeo_rv_n` ≥ 1 sustituye a la línea de la biblia
      mirar: async (api) => {
        const n = api.flag('tadeo_rv_n') || 0;
        if (n >= 1) await api.say(['Mi móvil. Una llamada perdida de la abuela.', `Y ${n} correos de Tadeo. Todos «RV:». Ninguno leído. Ni por él.`]);
        else await api.say('Mi móvil. Una llamada perdida de la abuela. Siempre hay una.');
      },
      usar: async (api) => { await menuMovil(api); },                 // el menú del móvil: abuela (§5.6), correo, llamadas
      'usar:*': 'No le hago fotos. Luego me pide derechos de imagen.',
    },
  },
  chicle: {
    name: 'chicle', icon: icons.chicle,
    handlers: { mirar: 'Chicle de Celestino. «Para los nervios del cierre. Y para lo que surja».' },
  },
  cafe: {
    name: 'café', icon: icons.cafe,
    handlers: { mirar: 'Un café de Gertrudis. Pone «cortado». No especifica de qué.' },
    // §8.1 (común A)
    combine: { sobre_azucar: 'Echarle azúcar al café de Gertrudis es corregirla. No me atrevo.' },
  },
  chaqueta_ramirez: {
    name: 'chaqueta de Ramírez', icon: icons.chaqueta_ramirez,
    handlers: {
      mirar: 'La chaqueta de Ramírez. Huele a 2019 y a sala de prensa.',
      // plan §4.3: Usar la chaqueta sin destino = ponérsela (el sprite de Bruno cambia: actors.js `con_chaqueta`)
      usar: async (api) => {
        if (api.flag('bruno_con_chaqueta')) { api.setFlag('bruno_con_chaqueta', false); await api.say('Me la quito. Vuelvo a ser yo. Con mangas de camisa.'); return; }
        await api.anim(api.player, 'reach', 400);
        api.setFlag('bruno_con_chaqueta', true);
        await api.say(['Me la pongo. Por probar. Huele a 2019 y a cruasán.', 'Me queda grande. De hombros y de cargo.']);   // E2 §7.2
        if (api.room === 'pecera') await api.scene('pecera_chaqueta');   // [P2] §4.3: Yoli y el coro, si se la pone allí
        else if (api.room === 'pajarera') await api.scene('pajarera_chaqueta');   // [P2] §4.3: Íñigo le confunde
      },
    },
  },
  sobre_azucar: {
    name: 'sobre de azúcar', icon: icons.sobre_azucar,
    handlers: { mirar: 'Sobre de azúcar caducado en 2021. Pone «Cafetería». Es casi un ticket.' },
  },
  ficha_pagina_7: {
    // plan §8.1: la ficha es una LISTA VIVA. Mirar dice el título, las tres casillas en su estado (la hecha, corta; la
    // pendiente, qué falta y dónde), la nota al margen sin CMS y la línea de la pieza. El icono marca cada casilla y la
    // pieza (raya roja = escrita; con «23» = recortada).
    name: 'ficha de la página 7', icon: icons.ficha_pagina_7,
    iconKey: (v) => ['casilla_hueco', 'casilla_fuente', 'casilla_firma', 'pieza_escrita', 'pieza_recortada'].map(f => (v.flag(f) ? 1 : 0)).join(''),
    handlers: { mirar: async (api) => { await api.say(fichaViva(api)); } },
  },
  copias_rechazadas: {
    name: 'duplicado y triplicado', icon: icons.copias_rechazadas,
    handlers: { mirar: 'Duplicado y triplicado de mi nota de gasto. Sello: RECHAZADA. Dos veces.' },
  },
  fotocopia_nota_direccion: {
    name: 'fotocopia de la nota de Gervasio', icon: icons.fotocopia_nota_direccion,
    handlers: { mirar: say(['Nota de gasto de Gervasio: «Comida de trabajo, Hidrovoltia. 312,00 €».', 'Por detrás, a boli: «OPA ROBLEDAL — jueves — NO PUBL.» Begoña no mira reversos.']) },
  },
  mensaje_fp: {
    name: 'fax de F.P.', icon: icons.mensaje_fp,
    handlers: {
      mirar: async (api) => {
        await api.say(['Fax de F.P.: «La opa de Hidrovoltia sobre Banco Robledal es verdad».', '«Falta la segunda fuente: mira las notas de gasto. — F.P.»',
          'Borde perforado. Esto no viene de un fax: viene de una matricial.']);
        api.setFlag('vio_borde_perforado', true);
      },
    },
  },
  manual_fax: {
    name: 'manual del fax', icon: icons.manual_fax,
    handlers: { mirar: say(['Manual del fax de la Redacción de papel. Página 9: «Respuesta automática».', 'Las demás páginas son fotos del fax. Posando.']) },
  },
  pieza_opa: {
    name: 'mi exclusiva', icon: icons.pieza_opa,
    iconKey: (v) => (v.flag('pieza_recortada') ? 'recortada' : ''),
    handlers: {
      mirar: async (api) => {
        if (api.flag('pieza_recortada')) await api.say(['Veintitrés líneas exactas. Begoña ha quitado la conclusión.', 'Y una coma que le caía mal.']);
        else await api.say('Mi exclusiva. Treinta y una líneas. El hueco tiene veintitrés.');   // E2 C10: «faldón» → «hueco»
      },
    },
  },
  album_eventos: {
    name: 'álbum de Eventos', icon: icons.album_eventos,
    handlers: { mirar: say(['En todas las fotos, al fondo, Rubén. Cena de Navidad, presentación, photocall.', 'Siempre yendo al baño. Siempre con un táper.']) },
  },
  ticket_n1: {
    name: 'ticket nº 1', icon: icons.ticket_n1,
    handlers: { mirar: say(['Ticket nº 1: «Alta becario Rubén». Asignado a: Titulator 3000.', 'Estado: CERRADO. El primer ticket que cierra Paco en su vida.']) },
  },
  acta_reunion: {
    name: 'acta de la reunión', icon: icons.acta_reunion,
    handlers: { mirar: say(['Acta de la última Reunión de Dirección: «1. Pedir más café. 2. Ninguno más».', 'La primera acta en diecinueve años. Tiene dos faltas. Aurora lloraría.']) },
  },
  boli_muerto: {
    // adenda 6.1 (#19): se consigue en la Catacumba (Coger bolis_aurora, MP3) y se gasta al Dar a custodia_precinto.
    // Combinaciones con salas/PNJ (4.8): las implementa la sala (handlers 'dar:boli_muerto').
    name: 'boli muerto', icon: icons.boli_muerto,
    handlers: { mirar: 'Un boli rojo sin tinta. Murió corrigiendo un «detrás mío».' },
    combine: { ficha_pagina_7: 'No escribe. Le guardo un minuto de silencio. ...Ya.' },     // adenda 4.8 (A)
  },
  // E2 §5.3: el correo de Evaristo, impreso por el fax (lo da P3 en el paso 32, con `coma_bendecida` y
  // `correo_evaristo_listo`); es el TERCER REMATE del duelo final (P4, D4 `atScore: 5`). No se gasta antes.
  correo_evaristo: {
    name: 'correo de Evaristo', icon: icons.correo_evaristo,
    handlers: {
      mirar: say(['Asunto: «Una coma». Todos en copia. Envío: «en el momento oportuno».', 'La cláusula 12, subrayada dos veces. Con regla.']),
      'dar:begona_triplicado': dice('begona_triplicado', 'Una copia de un correo. Esto ya es casi un triplicado.'),
      'dar:aurora_galerada': dice('aurora_galerada', 'Ya lo he leído, criatura. Está perfecto. Guárdalo.'),
      'dar:inigo_sinergia': dice('inigo_sinergia', 'Eso, por escrito. Si no está en el hilo, no escala.'),
      'dar:*': 'Lo guardo. Evaristo dijo «en el momento oportuno». Y no es este.',
      'usar:*': 'Lo guardo. Evaristo dijo «en el momento oportuno». Y no es este.',
    },
  },
  // [P3] plan §4.4: el táper que suelta el de Mercados al huir del Vending; se da a `ruben` en Sistemas (P1, `taper_dado`)
  taper_huerfano: {
    name: 'táper sin nombre',
    icon(g) {
      // táper de plástico translúcido con tapa azul, vacío y sin etiqueta (28×18)
      rect(g, 5, 6, 18, 10, '#cfd8dc'); rect(g, 6, 7, 16, 8, '#e4ecee'); hline(g, 6, 14, 16, '#a8b4b8');
      vline(g, 5, 6, 10, '#9aa6aa'); vline(g, 22, 6, 10, '#9aa6aa'); hline(g, 5, 15, 18, '#8a9498');
      rect(g, 4, 3, 20, 4, '#3a7ac8'); hline(g, 4, 3, 20, '#6aa0e0'); hline(g, 4, 6, 20, '#2a5a98');
      rect(g, 2, 4, 2, 2, '#3a7ac8'); rect(g, 24, 4, 2, 2, '#3a7ac8');
      px(g, 8, 9, '#ffffff'); px(g, 9, 8, '#ffffff');
    },
    handlers: { mirar: 'Un táper sin nombre. Vacío. Huele a lentejas de ayer y a huida.' },
  },
};
