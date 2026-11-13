// INVENTARIO de FE DE ERRATAS (biblia §4, 18 objetos + `boli_muerto` de la adenda 6.1). ARCHIVO COMPARTIDO: no lo edita ningún autor de sala.
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
  },
  planillo(g) {
    sheet(g, 3, 1, 22, 16, [P.paper[3], P.paper[5], P.paper[6], P.paper[7]]);
    for (let xx = 5; xx < 24; xx += 5) vline(g, xx, 2, 14, P.paper[3]);
    for (let yy = 4; yy < 16; yy += 4) hline(g, 4, yy, 20, P.paper[3]);
    rect(g, 15, 10, 9, 6, P.blue[5]); hline(g, 15, 10, 9, P.blue[6]);   // faldón vendido
    rect(g, 5, 2, 9, 2, P.red[3]);
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
  posit_baja_ruben(g) {
    poly(g, [[6, 2], [22, 1], [23, 16], [7, 17]], (xx, yy) => ditherPick(xx, yy, ['#b0a020', '#e0d040', '#f4e660', '#fff8a0'], 0.9 - (xx - 6) / 40 - (yy - 1) / 30));
    line(g, 9, 6, 19, 5, P.ink[2]); line(g, 9, 9, 17, 9, P.ink[2]); line(g, 9, 12, 15, 12, P.ink[2]);
    line(g, 18, 14, 22, 16, '#b0a020');
  },
  ticket_n1(g) {
    sheet(g, 7, 0, 14, 18);
    for (let xx = 7; xx < 21; xx += 2) px(g, xx, 17, P.paper[2]);
    drawText(g, 'Nº1', 8, -1, P.ink[2], { outline: null });
    textLines(g, 9, 9, 9, 2, P.paper[2], 2);
    stamp(g, 9, 12, 10, 5, P.leaf[4]);
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
const N_REPLICAS = 16;       // adenda 6.1: «[N] de 16» (14 de la biblia + R15/R16)

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
    handlers: { mirar: 'La chaqueta de Ramírez. Huele a 2019 y a sala de prensa.' },
  },
  sobre_azucar: {
    name: 'sobre de azúcar', icon: icons.sobre_azucar,
    handlers: { mirar: 'Sobre de azúcar caducado en 2021. Pone «Cafetería». Es casi un ticket.' },
  },
  ficha_pagina_7: {
    name: 'ficha de la página 7', icon: icons.ficha_pagina_7,
    iconKey: (v) => ['casilla_hueco', 'casilla_fuente', 'casilla_firma'].map(f => (v.flag(f) ? 1 : 0)).join(''),
    handlers: {
      mirar: async (api) => {
        const c = f => (api.flag(f) ? '[✓]' : '[ ]');
        if (api.flag('casilla_hueco') && api.flag('casilla_fuente') && api.flag('casilla_firma')) {
          await api.say('Tres casillas llenas. Es lo más parecido a un contrato que he tenido.');
          return;
        }
        await api.say([`Ficha de la página 7. HUECO ${c('casilla_hueco')} · FUENTE ${c('casilla_fuente')} · FIRMA ${c('casilla_firma')}.`, 'Sin las tres, Teodoro no cierra.']);
      },
    },
  },
  planillo: {
    name: 'planillo de maqueta', icon: icons.planillo,
    handlers: { mirar: say(['Planillo. Página 7: COLCHONES SIESTATÓN. Faldón, 23 líneas.', '«Pendiente de confirmar desde marzo».']) },
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
        await api.say(['Fax de F.P.: «La opa de Hidrovoltia sobre Banco Robledal es verdad».', '«Falta la segunda fuente: mira los gastos de Dirección. — F.P.»',
          'Borde perforado. Esto no viene de un fax: viene de una matricial.']);
        api.setFlag('vio_borde_perforado', true);
      },
    },
  },
  manual_fax: {
    name: 'manual del fax', icon: icons.manual_fax,
    handlers: { mirar: say(['Manual del fax de la Catacumba. Página 9: «Respuesta automática».', 'Las demás páginas son fotos del fax. Posando.']) },
  },
  pieza_opa: {
    name: 'mi exclusiva', icon: icons.pieza_opa,
    iconKey: (v) => (v.flag('pieza_recortada') ? 'recortada' : ''),
    handlers: {
      mirar: async (api) => {
        if (api.flag('pieza_recortada')) await api.say(['Veintitrés líneas exactas. Begoña ha quitado la conclusión.', 'Y una coma que le caía mal.']);
        else await api.say('Mi exclusiva. Treinta y una líneas. El faldón tiene veintitrés.');
      },
    },
  },
  album_eventos: {
    name: 'álbum de Eventos', icon: icons.album_eventos,
    handlers: { mirar: say(['En todas las fotos, al fondo, Rubén. Cena de Navidad, presentación, photocall.', 'Siempre yendo al baño. Siempre con un táper.']) },
  },
  posit_baja_ruben: {
    name: 'pósit «Baja becario Rubén»', icon: icons.posit_baja_ruben,
    handlers: { mirar: '«Baja becario Rubén». Descopeado. Es el pósit más importante de mi vida.' },
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
    combine: { ficha_pagina_7: 'No escribe. Pero lo intenta. Como yo.' },     // adenda 4.8 (A)
  },
};
