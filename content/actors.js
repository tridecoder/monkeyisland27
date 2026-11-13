// REPARTO de FE DE ERRATAS (biblia §2). ARCHIVO COMPARTIDO: no lo edita ningún autor de sala.
// Ids, nombres y colores de texto exactos de la biblia. La colocación en salas la hace cada sala
// (lógica: `actors: [{ id, when, handlers }]`; arte: `layout[id] = { at: [x, y, dir] }`).
// `murmurs` = murmullos de ambiente de §8.5 (el motor los reproduce al pasar el ratón 0,7 s o tras 20 s quieto).
// Hoja de contactos de todos: node tools/actors.mjs → tools/shots/actores.png
import { paperDoll, defineSprite } from '../engine/sprites.js';
import { PAL, rect, px, hline, vline, line, ditherPick, frameRect } from '../engine/draw.js';
import { retratoAbuela, retratoEvaristo } from './lib/retratos.js';
import { tiny } from './rooms/art/lib-oficina.js';

// ------------------------------------------------------------------ Gertrudis (cafetera con LCD, §2.14)
const gertrudisSprite = defineSprite({
  w: 34, h: 44, ox: 17, oy: 43, headY: 2, hitW: 34,
  anims: { idle: { frames: 2, fps: 2 }, talk: { frames: 2, fps: 6 } },
  dirs: ['down'], outline: '#140e1a', shadow: false,
  draw(g, anim, dir, frame) {
    const M = PAL.metal;
    // chrome body, light from the upper left
    for (let y = 4; y < 38; y++) for (let x = 3; x < 31; x++) {
      const t = 0.85 - (x - 3) / 40 - (y - 4) / 120 + (x === 5 || x === 6 ? 0.25 : 0);
      g.fillStyle = ditherPick(x, y, [M[2], M[3], M[4], M[5], M[6], M[7]], t); g.fillRect(x, y, 1, 1);
    }
    rect(g, 2, 2, 30, 3, M[5]); hline(g, 2, 2, 30, M[7]); rect(g, 4, 0, 26, 2, M[3]);       // cup warmer
    rect(g, 9, 0, 4, 2, PAL.paper[6]); rect(g, 15, 0, 4, 2, PAL.red[4]); rect(g, 21, 0, 4, 2, PAL.paper[5]);
    // LCD: one green line
    rect(g, 6, 7, 22, 7, '#06140a'); frameRect(g, 5, 6, 24, 9, M[1]);
    for (let i = 0; i < 9; i++) if ((i * 7 + frame * 3) % 5 !== 0) rect(g, 7 + i * 2, 9, 1, 3, '#39ff14');
    // pósit «Servicio técnico: CELESTINO, ext. 0»
    rect(g, 25, 15, 6, 6, '#f0e050'); hline(g, 26, 17, 4, '#a09020'); hline(g, 26, 19, 3, '#a09020');
    rect(g, 7, 17, 2, 2, '#c03030'); rect(g, 11, 17, 2, 2, '#40a0e0'); rect(g, 15, 17, 2, 2, M[6]);
    for (const gx of [8, 19]) { rect(g, gx, 22, 7, 3, M[1]); rect(g, gx + 1, 25, 5, 2, M[2]); rect(g, gx + 6, 25, 5, 1, '#1a1018'); }
    rect(g, 4, 34, 26, 4, M[2]); hline(g, 4, 34, 26, M[5]); for (let x = 6; x < 29; x += 2) px(g, x, 35, M[1]);
    rect(g, 3, 38, 28, 5, M[1]); hline(g, 3, 38, 28, M[4]);
    rect(g, 9, 30, 4, 4, PAL.paper[6]); hline(g, 9, 30, 4, PAL.paper[7]);
  },
});

// ------------------------------------------------------------------ El Lector Medio (§2.14, G5)
// Recortable de cartón pluma a tamaño real del *buyer persona* que Marketing encargó en 2014: ilustración genérica de
// banco de imágenes (sonrisa de anuncio, jersey azul claro sobre camisa blanca, chinos, un periódico doblado que nunca
// abre; SIN rasgos de nadie real), una ficha pegada al pecho («LECTOR MEDIO · 43 años · ...») y un altavocito pegado
// con celo en el hombro. Borde blanco de cartón. Variantes automáticas: normal / con la chaqueta beige de Ramírez
// (`chaqueta_en_lector`) / caído de cara, con la pegatina «Atrezo – Focus group 2014» (`lector_derribado`).
const C = {
  skin: '#f4cca4', skinD: '#dcab84', hair: '#7c5632', hairD: '#5a3c22', hairL: '#9a7048',
  sweat: '#9fc0e2', sweatD: '#7ea0c8', sweatL: '#bcd6ee', shirt: '#f6f6f0',
  pants: '#d2bf92', pantsD: '#b09c70', shoe: '#6e4c30', shoeD: '#4a3220',
  paper: '#e6dfcc', paperD: '#b8b09a', ink: '#4a4a52',
  card: '#fbfaf2', cardD: '#b9b1a0', red: '#c83a3a',
  board: '#cdbb8e', boardL: '#e4d8b4', boardD: '#a8946a',
  jac: '#c8b088', jacD: '#a08a68', jacL: '#e0cca8',
  spk: '#686c76', spkD: '#454852', tape: '#f4ecb0',
};
function lectorFront(g, jacket) {
  // base de apoyo de cartón (la pestaña que lo mantiene en pie)
  rect(g, 6, 63, 20, 2, C.board); hline(g, 6, 63, 20, C.boardL); hline(g, 6, 64, 20, C.boardD);
  // piernas (chinos) y zapatos pegados a la base
  rect(g, 10, 41, 5, 19, C.pants); rect(g, 17, 41, 5, 19, C.pants); rect(g, 15, 46, 2, 14, C.pantsD);
  vline(g, 10, 42, 17, C.pantsD); vline(g, 21, 42, 17, C.pantsD); hline(g, 10, 41, 12, C.pantsD);
  rect(g, 9, 59, 7, 3, C.shoe); rect(g, 16, 59, 7, 3, C.shoe); hline(g, 9, 61, 7, C.shoeD); hline(g, 16, 61, 7, C.shoeD);
  // torso: jersey azul claro con cuello de camisa blanco en uve
  rect(g, 7, 18, 18, 24, C.sweat); vline(g, 7, 19, 22, C.sweatL); vline(g, 24, 19, 22, C.sweatD); hline(g, 7, 41, 18, C.sweatD);
  hline(g, 9, 17, 14, C.sweat);
  for (let i = 0; i < 5; i++) hline(g, 13 + i, 17 + i, 6 - 2 * i, C.shirt);     // uve del cuello
  hline(g, 7, 36, 18, C.sweatD);                                                     // canesú del jersey
  // brazos
  rect(g, 4, 19, 4, 20, C.sweat); vline(g, 4, 20, 18, C.sweatL); hline(g, 4, 38, 4, C.sweatD); rect(g, 4, 39, 4, 3, C.skin); hline(g, 4, 41, 4, C.skinD);
  rect(g, 24, 19, 4, 18, C.sweat); vline(g, 27, 20, 16, C.sweatD); hline(g, 24, 36, 4, C.sweatD);
  if (jacket) {
    // chaqueta beige de Ramírez puesta sobre el cartón: hombros anchos, solapas abiertas, bolsillo
    rect(g, 5, 17, 22, 28, C.jac); hline(g, 6, 16, 20, C.jac); vline(g, 5, 18, 26, C.jacL); vline(g, 26, 18, 26, C.jacD); hline(g, 5, 44, 22, C.jacD);
    rect(g, 2, 18, 4, 23, C.jac); vline(g, 2, 19, 21, C.jacL); hline(g, 2, 40, 4, C.jacD); rect(g, 2, 41, 4, 2, C.skin);
    rect(g, 26, 18, 4, 21, C.jac); vline(g, 29, 19, 19, C.jacD); hline(g, 26, 38, 4, C.jacD);
    for (let i = 0; i < 9; i++) { hline(g, 12 + (i >> 1), 17 + i, 8 - i, C.sweat); }            // la uve deja ver el jersey
    for (let i = 0; i < 4; i++) hline(g, 14 + (i >> 1), 17 + i, 4 - i, C.shirt);
    line(g, 12, 17, 16, 27, C.jacD); line(g, 20, 17, 16, 27, C.jacD); vline(g, 16, 28, 16, C.jacD);
    px(g, 15, 33, '#6a5238'); px(g, 15, 38, '#6a5238');
    rect(g, 19, 36, 5, 1, C.jacD); rect(g, 20, 34, 3, 2, C.paper);                              // bolsillo con el sobre de azúcar
  }
  // cuello y cabeza (sonrisa de anuncio)
  rect(g, 14, 15, 4, 3, C.skinD);
  rect(g, 12, 3, 8, 12, C.skin); rect(g, 11, 5, 10, 8, C.skin); rect(g, 13, 14, 6, 1, C.skin);
  vline(g, 20, 5, 8, C.skinD); px(g, 19, 13, C.skinD); px(g, 18, 14, C.skinD);
  rect(g, 11, 2, 10, 3, C.hair); rect(g, 12, 1, 8, 1, C.hair); rect(g, 10, 4, 2, 4, C.hair); rect(g, 20, 4, 2, 4, C.hairD);
  rect(g, 12, 4, 5, 1, C.hairL); hline(g, 17, 4, 3, C.hair); px(g, 12, 5, C.hair); px(g, 19, 5, C.hairD);       // raya a un lado
  px(g, 13, 7, C.hairD); px(g, 14, 7, C.hairD); px(g, 17, 7, C.hairD); px(g, 18, 7, C.hairD);                      // cejas
  px(g, 13, 8, '#fdfdf8'); px(g, 14, 8, '#2a3a5a'); px(g, 17, 8, '#2a3a5a'); px(g, 18, 8, '#fdfdf8');           // ojos
  px(g, 16, 9, C.skinD); px(g, 16, 10, C.skinD);                                                                   // nariz
  hline(g, 13, 11, 6, '#9a3a3a'); hline(g, 14, 12, 4, '#fdfdf8'); px(g, 13, 12, C.skinD); px(g, 18, 12, C.skinD);   // sonrisa con dientes
  px(g, 12, 11, C.skinD); px(g, 19, 11, C.skinD);
  // altavocito pegado con celo en el hombro
  rect(g, 7, 15, 6, 5, C.spk); frameRect(g, 7, 15, 6, 5, C.spkD);
  px(g, 9, 17, C.spkD); px(g, 11, 17, C.spkD); px(g, 10, 18, C.spkD); px(g, 8, 16, '#8a8e98');
  hline(g, 6, 14, 8, C.tape); hline(g, 6, 20, 8, C.tape); px(g, 6, 15, C.tape); px(g, 13, 19, C.tape);          // celo en cruz
  // ficha pegada al pecho: «LECTOR MEDIO · 43 años · "la economía" y "ahorrar" · Fuente: Marketing, 2014»
  rect(g, 11, 24, 11, 10, C.card); frameRect(g, 11, 24, 11, 10, C.cardD); rect(g, 12, 25, 9, 2, C.red);
  hline(g, 12, 28, 8, C.ink); hline(g, 12, 30, 6, C.cardD); hline(g, 12, 32, 7, C.cardD); px(g, 20, 30, C.ink);
  // periódico doblado bajo el brazo: nunca lo abre
  rect(g, 22, 33, 8, 11, C.paper); frameRect(g, 22, 33, 8, 11, C.paperD); hline(g, 23, 35, 6, C.ink); hline(g, 23, 37, 6, C.paperD);
  hline(g, 23, 39, 5, C.paperD); hline(g, 23, 41, 6, C.paperD); vline(g, 26, 34, 9, C.paperD);
  rect(g, 24, 32, 4, 3, C.skin); hline(g, 24, 34, 4, C.skinD);                                                      // la mano que lo sujeta
}
const lectorBase = defineSprite({
  w: 32, h: 66, ox: 16, oy: 65, headY: 0, hitW: 26,
  anims: { idle: { frames: 1, fps: 0 }, talk: { frames: 1, fps: 0 } },    // sonrisa congelada: no parpadea
  dirs: ['down'], outline: '#ece2c8', shadow: true,
  draw(g) { lectorFront(g, false); },
});
const lectorChaqueta = defineSprite({
  w: 32, h: 66, ox: 16, oy: 65, headY: 0, hitW: 28,
  anims: { idle: { frames: 1, fps: 0 }, talk: { frames: 1, fps: 0 } },
  dirs: ['down'], outline: '#ece2c8', shadow: true,
  draw(g) { lectorFront(g, true); },
});
// LA CAÍDA (clímax 7.4, Bruno lo empuja): tres fotogramas inclinados (`cae1`..`cae3`: 22°, 50°, 76°), girando sobre la
// esquina derecha de la base (8 px a la derecha de sus pies), y el cartón tumbado en el suelo (`caido`).
// La escena pone el flag local de sala `sala_amazonas_lector_cae` (1, 2, 3) y luego `lector_derribado`.
const CAE_PIVOT = [24, 64];                 // esquina derecha de la pestaña de la base, en coordenadas del dibujo de pie
function lectorInclinado(deg, jacket) {
  const W = 96, H = 78, PX = 34, PY = 70;   // el pivote cae en (PX, PY) del lienzo girado
  return defineSprite({
    w: W, h: H, ox: PX - (CAE_PIVOT[0] - 16), oy: PY + 1, headY: 0, hitW: 40,
    anims: { idle: { frames: 1, fps: 0 }, talk: { frames: 1, fps: 0 } },
    dirs: ['down'], outline: '#ece2c8', shadow: false,
    draw(g) {
      const src = document.createElement('canvas'); src.width = 32; src.height = 66;
      const sg = src.getContext('2d'); lectorFront(sg, jacket);
      const d = sg.getImageData(0, 0, 32, 66).data;
      const a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        // destino → origen (giro inverso, vecino más próximo: píxeles nítidos)
        const dx = x - PX, dy = y - PY;
        const sx = Math.round(dx * ca + dy * sa + CAE_PIVOT[0]), sy = Math.round(-dx * sa + dy * ca + CAE_PIVOT[1]);
        if (sx < 0 || sy < 0 || sx >= 32 || sy >= 66) continue;
        const i = (sy * 32 + sx) * 4;
        if (d[i + 3] < 128) continue;
        g.fillStyle = `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`; g.fillRect(x, y, 1, 1);
      }
    },
  });
}
const lectorCae = [22, 50, 76].map(deg => lectorInclinado(deg, false));
const lectorCaeChaqueta = [22, 50, 76].map(deg => lectorInclinado(deg, true));
// Caído de cara en el suelo, a la derecha de donde estaba (la cabeza a la derecha; el actor queda en el CENTRO del
// cartón: la escena lo recoloca al caer, `xCaido()` en content/escenas/climax.js): el reverso de cartón crudo, el
// puntal plegado, el altavoz boca abajo y la pegatina «ATREZO · FOCUS GROUP 2014» (el texto lo pinta drawExtra a 1:1,
// sin escalar, para que se lea).
const lectorCaido = defineSprite({
  w: 78, h: 14, ox: 39, oy: 12, headY: -4, hitW: 72,
  dirs: ['down'], outline: '#ece2c8', shadow: false,
  draw(g) {
    // sombra de contacto
    for (let x = 2; x < 76; x += 1) if ((x & 1) === 0) px(g, x, 13, '#1a1620');
    // el tablero (perspectiva: un trapecio largo y bajo), los pies a la izquierda, la cabeza a la derecha
    for (let y = 3; y < 12; y++) hline(g, 3 + ((11 - y) >> 2), y, 70 - ((11 - y) >> 1), y < 5 ? C.boardL : y > 9 ? C.boardD : C.board);
    rect(g, 64, 2, 11, 9, C.board); hline(g, 65, 1, 9, C.boardL); vline(g, 74, 3, 7, C.boardD);       // la cabeza (reverso)
    hline(g, 64, 2, 11, C.boardL);
    rect(g, 2, 7, 6, 5, C.shoeD); hline(g, 2, 7, 6, C.shoe);                                          // punteras
    rect(g, 8, 4, 6, 7, C.boardD); hline(g, 8, 4, 6, '#8a7650');                                      // la pestaña de la base
    rect(g, 44, 3, 3, 8, C.boardD); hline(g, 44, 3, 3, '#8a7650');                                    // puntal plegado
    // pegatina blanca grande (el texto, en drawExtra)
    rect(g, 18, 3, 25, 8, C.card); frameRect(g, 18, 3, 25, 8, C.cardD); hline(g, 19, 4, 23, '#fffef8');
    // celo y altavoz boca abajo en el hombro
    rect(g, 54, 4, 6, 5, C.spk); hline(g, 52, 6, 10, C.tape);
    hline(g, 3, 12, 72, '#5a5040');
  },
});

// ------------------------------------------------------------------ el teléfono rojo de Teodoro (7.3a y «Goyita. Tira.»)
/** Auricular rojo de baquelita, vertical, con la parte de oír arriba (x, y = esquina superior izquierda, 4x11). */
export function auricularRojo(g, x, y) {
  rect(g, x, y, 4, 3, '#c83a3a'); hline(g, x, y, 4, '#f07060');          // oído
  rect(g, x + 1, y + 3, 2, 5, '#a82a2a'); vline(g, x + 1, y + 3, 5, '#d85048');
  rect(g, x, y + 8, 4, 3, '#c83a3a'); hline(g, x, y + 10, 4, '#7a1a1a');  // boca
  px(g, x - 1, y + 1, '#4a1010'); px(g, x - 1, y + 9, '#4a1010');
}
/** Cable rizado de (x0, y0) a (x1, y1): espiral de píxeles oscuros con brillos rojos. */
export function cableRizado(g, x0, y0, x1, y1) {
  const n = Math.max(4, Math.round(Math.hypot(x1 - x0, y1 - y0)));
  for (let i = 0; i <= n; i++) {
    const k = i / n, sag = Math.sin(k * Math.PI) * 4;
    const x = Math.round(x0 + (x1 - x0) * k), y = Math.round(y0 + (y1 - y0) * k + sag);
    px(g, x + ((i & 1) ? 1 : 0), y, (i % 3) ? '#8a2020' : '#e05040');
  }
}

export default {
  // ---------------------------------------------------------------- protagonista
  bruno: {
    name: 'Bruno', color: '#FFFFFF', speed: 66, defaultVerb: 'mirar',
    doll: {
      skin: '#e8b48c', hair: '#6a4026', hairStyle: 'cowlick', shirt: '#9cc8ec', untucked: true,
      badge: '#c83030', backpack: '#4a6070', pants: '#3a4562', shoes: '#c8c0b0', build: 'slim', height: 1.02,
    },
    // §8.6 cuarta pared: el propio sprite es clicable
    handlers: {
      mirar: 'Soy yo. Joven, prometedor y sin contrato. Como una startup.',
      'usar:tarjeta_becario': 'Me identifico. Me reconozco. Es más de lo que hace el torno.',
    },
  },

  // ---------------------------------------------------------------- PNJ
  celestino: {
    name: 'Celestino', color: '#E8C170', speed: 50,
    doll: {
      skin: '#d8a07a', hair: '#cfcfd4', hairStyle: 'short', mustache: true, shirt: '#d8d8d0', jacket: '#6a6e78',
      epaulettes: '#e0b840', scarf: '#2a8a3a', scarfStripe: '#d03030', earpiece: '#202020',
      pocketItem: '#303034', pocketKind: 'radio', pants: '#5a5e68', shoes: '#1a1a1e', height: 0.96, build: 'normal', belly: true,
    },
    murmurs: ['Treinta años en este mostrador. El mostrador, cuarenta.', 'Si me preguntan por el Ibex, digo que va.',
      'Chof, chof... Menta. Lo único de esta casa que no caduca.'],
    // mastica chicle de menta sin parar: de vez en cuando, una pompa rosa (solo de frente)
    drawExtra(g, a, t, c) {
      if (a.dir !== 'down' || !c) return;
      const ph = (t + 1500) % 7200;
      if (ph > 3000) return;
      const r = Math.round((1 + (ph / 2700) * 3.4) * c.s * 0.9), x = Math.round(a.x + 1 * c.s), y = Math.round(c.box.y + 15 * c.s);
      g.fillStyle = ph < 2700 ? '#ff9ac8' : '#ffc8e0';
      if (ph < 2700) { g.fillRect(x - r + 1, y - r, Math.max(1, 2 * r - 2), 2 * r + 1); g.fillRect(x - r, y - r + 1, 2 * r + 1, Math.max(1, 2 * r - 1)); g.fillStyle = '#ffd8ea'; g.fillRect(x - r + 1, y - r + 1, 1, 1); }
      else { g.fillRect(x - 5, y - 3, 2, 1); g.fillRect(x + 4, y - 4, 2, 1); g.fillRect(x - 1, y - 6, 1, 2); g.fillRect(x - 3, y + 2, 2, 1); g.fillRect(x + 3, y + 2, 2, 1); }
    },
  },
  yoli_tendencias: {
    name: 'Yoli', color: '#FF78B8', speed: 70,
    doll: {
      skin: '#f0c4a0', hair: '#3a2018', hairStyle: 'highponytail', hairStreak: '#FF78B8', glasses: 'thick', glassesColor: '#1a1418',
      shirt: '#4a5a80', emblem: '#FF78B8', pants: '#2a2a3a', shoes: '#f0f0f0', prop: 'eyedrops', build: 'slim', height: 0.97,
    },
    murmurs: ['Precio café hoy, precio café 2026, precio café por qué...', 'Si baja otra vez, me pongo colirio en el alma.',
      'Ahí al lado imprimen lo que yo publiqué ayer. Con las faltas corregidas.',   // orden 2: la Redacción de papel, al lado
      'Busco "el Contable" y salen gestorías. Nos ganan en SEO.', 'Hacen más ruido que mi gráfica cuando baja.'],
  },
  nerea_backlog: {
    name: 'Nerea', color: '#7FE08A', speed: 60,
    doll: {
      skin: '#e0aa84', hair: '#2e1c14', hairStyle: 'curlybun', hairPencil: '#e8c040', shirt: '#ece4d4', vest: '#d4a020',
      sleeveNotes: '#f0e050', pencil: true, pencilColor: '#3070d0', pants: '#4a3a32', shoes: '#2a1a14', height: 1.0,
    },
    murmurs: ['Esto a POR HACER. Esto a BLOQUEADO. Esto a la basura, pero con cariño.', 'Mañana es sábado. Lo dice la ferretería.',
      'Esto a POR HACER. Esto a BLOQUEADO. Esto a Diseño, que ya lo entregó.', 'Diseño entrega antes de que lo pida el tablero. Me descoloca.'],
  },
  teodoro_cuerpodoce: {
    // No habla: sus líneas salen del fax (prefijo «TEODORO (fax):», §3.4). Solo habla en voz alta al teléfono rojo.
    name: 'Teodoro', color: '#D9CFA6', speed: 44,
    doll: {
      skin: '#e0b090', hair: '#dcdcdc', hairStyle: 'balding', shirt: '#f4f0e8', suspenders: '#8a2a2a', cuffs: '#202848',
      hat: 'visor', hatColor: '#2a8a4a', pocketItem: '#c0a060', pocketKind: 'ruler', pants: '#3a3a42', shoes: '#8a5a4a',
      height: 0.94, build: 'normal',
    },
    murmurs: ['CUERPO 9. INTERLINEADO 10. CORAZÓN 12.', 'GOYITA, ¿ME OYES? TÚ AGUANTA.',
      'AL OTRO LADO DEL LATÓN PUBLICAN SIN CERRAR. YO CIERRO SIN PUBLICAR.'],
    // escena 7.3a: con el teléfono rojo descolgado (la escena pone `auricular` en el actor), el auricular en la oreja
    // y el cable rizado que baja hasta el teléfono de su mesa (catacumba, x≈141 y≈80)
    drawExtra(g, a, t, c) {
      if (!a.auricular || !c) return;
      const hx = Math.round(a.x - 9 * c.s), hy = Math.round(c.box.y + 5 * c.s);
      auricularRojo(g, hx, hy);
      cableRizado(g, hx + 1, hy + 10, 141, 80);
    },
  },
  aurora_galerada: {
    name: 'Aurora', color: '#FF8A7A', speed: 48,
    doll: {
      skin: '#f0c8a8', hair: '#a8a8b0', hairStyle: 'bun', hairPencil: '#d02020', glasses: 'half', glassesColor: '#6a5040',
      glassesChain: '#d0b060', shirt: '#e8e0d8', jacket: '#7a2234', skirt: '#4a3a40', shoes: '#2a1a20', height: 0.92, build: 'slim',
    },
    murmurs: ['«Detrás mío». Ha dicho «detrás mío». En esta planta.', 'Una tilde. Solo pido una tilde.',
      'Por esa puerta entra la web. No se limpia los pies. Ni las tildes.'],
  },
  gervasio_acta: {
    name: 'Gervasio', color: '#AEC6E6', speed: 52,
    doll: {
      skin: '#e0a888', hair: '#3a3030', hairStyle: 'combover', shirt: '#e0e4ec', jacket: '#4a4c56', tie: '#7a1f2c',
      pocketItem: '#202028', pocketKind: 'phones', prop: 'folder', propColor: '#c8a868',
      pants: '#4a4c56', shoes: '#1a1a1e', build: 'heavy', belly: true, height: 1.0,
    },
    murmurs: ['Eso, en todo caso, lo hablamos.', 'Diecinueve años. Ni un marrón. Ni uno.', 'Hoy me han preguntado tres veces por mi salud. Debo de estar fatal.'],
  },
  begona_triplicado: {
    name: 'Begoña', color: '#C0A2F6', speed: 46,
    doll: {
      skin: '#eab894', hair: '#8a3a22', hairStyle: 'bouffant', glasses: 'thick', glassesColor: '#c82020', shirt: '#cdb8e0',
      armbands: '#34343e', prop: 'stamps', skirt: '#3a3448', shoes: '#2a1a24', lipstick: '#b03040', earrings: '#e0c050', height: 0.95,
    },
    murmurs: ['Original. Duplicado. Triplicado. Original. Duplicado...', 'Las 19:07. Qué rápido pasa la tarde. No pasa.'],
  },
  // Marketing (problema 8 del director): sin cámara ni acreditaciones (eso es de Eventos). Flipado de manual: móvil en
  // la mano como si fuera un micro, tupé, americana eléctrica y zapatillas blancas.
  borja_engagement: {
    name: 'Borja', color: '#4FD8E8', speed: 72,
    doll: {
      skin: '#e8b890', hair: '#2a1810', hairStyle: 'quiff', shirt: '#f2f2f2', jacket: '#1e5adc',
      prop: 'phone', propColor: '#202024', pants: '#2a3048', shoes: '#ffffff', build: 'slim', height: 1.04,
    },
    murmurs: ['Esto es contenido. Aquello es contenido. ¿Tú eres contenido?', 'Si no está en vertical, no ha pasado.'],
  },
  // EVENTOS (problema 8): Pilar Escaleta. Negro de equipo técnico, cascos con micro, walkie al cinto, la escaleta en
  // una carpeta, seis acreditaciones al cuello y cinta americana en la muñeca. Todo está «a cinco minutos de empezar».
  pilar_escaleta: {
    name: 'Pilar', color: '#A8F07A', speed: 80,
    doll: {
      skin: '#d8a07a', hair: '#3a2418', hairStyle: 'highponytail', shirt: '#26242c', headset: '#18181c',
      badge: '#ffcc00', badges: 6, prop: 'folder', propColor: '#d8d8d0', pocketItem: '#2a2a30', pocketKind: 'radio',
      armbands: '#a8a8b4', pants: '#1c1c22', shoes: '#3a3a44', build: 'athletic', height: 0.98,
    },
    murmurs: ['Cinco minutos. Siempre cinco minutos. Es mi zona horaria.'],
  },
  maripaz_remitido: {
    name: 'Maripaz', color: '#FF8A60', speed: 56,
    doll: {
      skin: '#f0c098', hair: '#f0d070', hairStyle: 'mane', shirt: '#fff0e8', jacket: '#ff7a52', skirt: '#ff7a52',
      headset: '#2a2a30', bracelets: '#e8c040', earrings: '#e8c040', lipstick: '#d04060', prop: 'mallet', propColor: '#b03028',
      shoes: '#a02838', height: 1.0,
    },
    murmurs: ['Te pongo un «ofrecido por» tan pequeño que solo lo verá el supervisor.', '¿Y una portada desplegable con olor a chorizo? Piénsalo.'],
  },
  paco_ticket: {
    name: 'Paco', color: '#92C0FF', speed: 50,
    doll: {
      skin: '#ecdccc', hair: '#4a3a2a', hairStyle: 'short', beard: 'long', glasses: 'square', glassesColor: '#2a2a2a',
      glassesTape: '#f4f4f4', shirt: '#74767e', emblem: '#c8ccd8', keys: '#b8bcc4', pants: '#3a3a44', shoes: '#2a2a2a',
      build: 'heavy', height: 1.0,
    },
    murmurs: ['48.213... 48.214... Esto no para.', 'No, mamá, el wifi no se ha caído. Has dejado de merecerlo.'],
  },
  inigo_sinergia: {
    name: 'Íñigo', color: '#FFD23F', speed: 64,
    doll: {
      skin: '#e8b890', hair: '#1a1410', hairStyle: 'parted', shirt: '#f4f6fa', jacket: '#1c2a52', pants: '#1c2a52',
      shoes: '#ffffff', prop: 'postits', build: 'slim', height: 1.05,
    },
    murmurs: ['Esto en verde. Esto en rosa. Esto en azul, que es excusa.', 'Diapositiva 248: «El viaje continúa».',
      '¿Y esto el Lector Medio lo entiende? Perfecto: asiente.'],
  },
  ruben: {
    name: 'Rubén', color: '#B6FF4D', speed: 58,
    doll: {
      skin: '#d4dcb4', hair: '#5a4a3a', hairStyle: 'short', shirt: '#86888e', hood: '#86888e', neckphones: '#202024',
      eyebags: true, crumbs: '#e8c880', pants: '#3a3c48', shoes: '#5a5a60', build: 'slim', height: 0.98,
    },
    // solo murmura mientras sigue en el armario 27
    murmurs: (v) => (!v.flag('ruben_libre') ? ['UN BECARIO ENCUENTRA UN ARMARIO. EL ARMARIO, OCUPADO.', '¿Hay alguien? ¿Traéis táper?'] : null),
  },
  abuela_remedios: {
    // SOLO TELÉFONO: nunca se coloca en una sala. Habla por el primer plano del móvil (api.phone.open / api.phone.say):
    // `portrait` es el retrato animado (content/lib/retratos.js) que sale en la pantalla del móvil de Bruno.
    name: 'Abuela Remedios', color: '#FFC2D9', hotspot: false, portrait: retratoAbuela,
    doll: {
      skin: '#f0c8a8', hair: '#f4f4f4', hairStyle: 'bun', glasses: 'round', glassesColor: '#8a6a5a', shirt: '#7aa0d8',
      skirt: '#7aa0d8', dots: '#ffd0e4', prop: 'phone', propColor: '#e060c0', shoes: '#5a4050', height: 0.88, build: 'normal',
    },
  },
  ramirez: {
    // Ramírez, el de Bolsa: solo en la escena poscréditos (§7.5). La biblia no fija su color.
    name: 'Ramírez', color: '#F2C060', speed: 50,
    doll: {
      skin: '#d89a70', hair: '#9a9aa4', hairStyle: 'balding', mustache: true, glasses: 'square', shirt: '#b8cce0',
      jacket: '#c8b088', tie: '#8a2a2a', pants: '#4a3a30', shoes: '#2a1a14', build: 'heavy', belly: true, height: 1.0,
    },
  },

  // ---------------------------------------------------------------- ADENDA §1: reparto nuevo (guiños de la casa)
  // Criterio de tacto (adenda 0.1): sprites SOLO por ropa y atrezo. Ids, nombres y colores = adenda 1 y 11.2.
  leoncio_quesitos: {
    // Jefe de Infografía (pecera, 180-260 px). Delantal de dibujante con manchas de rotulador de colores, compás en el
    // bolsillo del pecho, carpeta de cartulinas bajo el brazo y un quesito de cartulina prendido como una medalla.
    // Sus rótulos (Herminia) salen en el mismo color.
    name: 'Leoncio', color: '#3CE0C6', speed: 56,
    doll: {
      skin: '#e4b894', hair: '#4a3a30', hairStyle: 'short', shirt: '#f2e6d0', vest: '#e8dfc6', crumbs: '#e0508c',
      emblem: '#3CE0C6', pocketItem: '#c8ccd4', pocketKind: 'ruler', prop: 'folder', propColor: '#e8d49a',
      sleeves: 'short', pants: '#4e5a48', shoes: '#3a2e26', height: 0.99,
    },
    murmurs: ['Esto, en barras. Esto, en tarta. Esto, en tarta pero triste.', 'Cuarenta y un pósits. Cuarenta y un «NO». Es una serie muy estable.', 'Si la cinta avanza otro palmo, me piden pasaporte para el Vending.'],
  },
  anselmo_monolito: {
    // Director de Desarrollo (pecera, 560-610 px). Chaleco acolchado gris con muchos bolsillos, un rollo de cinta de
    // carrocero colgado del cinturón como una pistolera (`keys`, color cinta), un archivador bajo el brazo.
    name: 'Anselmo', color: '#E496FF', speed: 54,
    doll: {
      skin: '#dcae88', hair: '#2e2830', hairStyle: 'short', shirt: '#b4503c', vest: '#8c9098', keys: '#e8d8a0',
      prop: 'folder', propColor: '#2f4f86', pants: '#5c5c46', shoes: '#34281c', height: 1.02, build: 'normal',
    },
    murmurs: ['Esto no ha pasado por Desarrollo. Esto tampoco. Esto sí, de refilón.', 'Transversal. No invasivo. Transversal.', 'Revisión: marzo. Qué bien suena marzo.', '(al termo) Tú sí eres de Desarrollo.'],
  },
  evaristo_salvedad: {
    // Director de Controlling y Financiero (administracion; epílogo, vestibulo). Chaqueta de punto gris perla abrochada,
    // corbata con estampado de comas diminutas, lupa colgada de un cordón, lápiz bicolor y un inalámbrico en la mano.
    // En globos: EVARISTO. En el clímax solo suena por el teléfono de conferencias (sin sprite).
    name: 'Evaristo', color: '#F0F0A8', speed: 46, portrait: retratoEvaristo,
    doll: {
      skin: '#e8c4a4', hair: '#b4b6bc', hairStyle: 'parted', shirt: '#f4f2ea', jacket: '#b9bcc4', tie: '#33427a', tieDots: '#f2ecc4',
      loupe: '#F0F0A8', pencil: true, pencilColor: '#c03030', prop: 'phone', propColor: '#f0f0f2',
      pants: '#54545e', shoes: '#2e2420', height: 0.97, build: 'slim',
    },
    murmurs: ['Coma. Coma. Punto y coma. Esto es un punto y coma disfrazado.', 'Cláusula 12... sigue ahí. Bien. Buenas noches, cláusula 12.', '(al teléfono) No, no es urgente. Solo es importante. No es lo mismo.', 'Plaza 3, sucesión en disputa. Esto no es un garaje. Es una herencia.'],
  },
  valentin_reticula: {
    // Cameo: director de Diseño y Producto (cpd, mesa plegable entre los armarios 24 y 25). Alto, sin barba, con gafas,
    // atlético sin llegar a muy musculado; moderno y muy bien vestido: americana de buen corte verde botella, camiseta
    // blanca lisa, pantalón negro pitillo, zapatillas blancas y reloj. Prendas y colores a confirmar por el retratado.
    name: 'Valentín', color: '#C0E8FF', speed: 62,
    doll: {
      skin: '#eac4a2', hair: '#2c2422', hairStyle: 'short', glasses: 'round', glassesColor: '#0a0a10',
      shirt: '#f8f8fa', jacket: '#2f7058', pants: '#202028', shoes: '#f6f6f6', bracelets: '#c4c8d0',
      height: 1.13, build: 'athletic',
    },
    murmurs: ['Esto, dos píxeles a la izquierda. Ahora sí.', 'Nota para el lunes: abrirle la bandeja a Desarrollo. Con cariño.', '(al monitor) Venga, becario. Que tú puedes.'],
  },

  // ---------------------------------------------------------------- ADENDA §1/11.2: presencias SIN sprite
  // Son actores solo para tener nombre y color al hablar (`api.sayAs`): NUNCA se colocan en una sala (el hotspot que
  // las representa es un objeto de la sala con el mismo id, o un objeto cercano). Para que el texto salga encima de
  // su objeto usa `api.sayFrom('<objeto>', texto)`, que toma el `color` del objeto (declarado igual en el stub).
  custodia_precinto: { name: 'Custodia', color: '#A0A0FF', hotspot: false, presence: 'manos bajo una persiana metálica (Secretaría de Redacción, en la pecera)', doll: {} },
  tadeo_adjunto: { name: 'Tadeo', color: '#FFCC99', hotspot: false, presence: 'portátil (ecosistema) y móvil (avisos RV:)', doll: {} },
  herminia: { name: 'Herminia', color: '#FF8C3C', hotspot: false, presence: 'rótulos en el portátil de Leoncio (pecera)', doll: {} },
  coro_desarrollo: { name: 'CORO', color: '#7FFFD4', hotspot: false, presence: 'los tres devs, a la vez', doll: {} },
  dev_1: { name: 'DEV 1', color: '#7FFFD4', hotspot: false, presence: 'del coro: indignado', doll: {} },
  dev_2: { name: 'DEV 2', color: '#7FFFD4', hotspot: false, presence: 'del coro: más indignado', doll: {} },
  dev_3: { name: 'DEV 3', color: '#7FFFD4', hotspot: false, presence: 'del coro: solo dice «No.»', doll: {} },
  altavoz_ibex: { name: 'ALTAVOZ', color: '#CCCCCC', hotspot: false, presence: 'voz de objeto (vestibulo)', doll: {} },

  // ---------------------------------------------------------------- objetos con carácter (§2.14)
  gertrudis: {
    // LCD verde, SIEMPRE EN MAYÚSCULAS. Es un actor para que su texto salga encima con su color.
    name: 'Gertrudis', color: '#39FF14', sprite: gertrudisSprite, scale: 1.5, defaultVerb: 'hablar',
    murmurs: ['PRECALENTANDO RENCOR...', 'LIMPIEZA AUTOMÁTICA: NADIE ME LIMPIA.'],
  },
  lector_medio: {
    // El Lector Medio (§2.14): solo reproduce su grabación (#E8C8A8; antes #CCCCCC, que se confundía con Gervasio): «A mí lo que me interesa es la economía. Y ahorrar.»
    // Variantes automáticas: con la chaqueta de Ramírez (chaqueta_en_lector) y caído (lector_derribado).
    name: 'Lector Medio', color: '#E8C8A8', defaultVerb: 'mirar', speed: 1,
    sprite: lectorBase,
    // su grabación, como murmullo (calla en cuanto lo derriban)
    murmurs: (v) => (v.flag('lector_derribado') ? null : ['A mí lo que me interesa es la economía. Y ahorrar.']),
    variants: {
      chaqueta: { sprite: lectorChaqueta },
      caido: { sprite: lectorCaido },
      cae1: { sprite: lectorCae[0] }, cae2: { sprite: lectorCae[1] }, cae3: { sprite: lectorCae[2] },
      cae1j: { sprite: lectorCaeChaqueta[0] }, cae2j: { sprite: lectorCaeChaqueta[1] }, cae3j: { sprite: lectorCaeChaqueta[2] },
    },
    variant: (v) => {
      if (v.flag('lector_derribado')) return 'caido';
      const k = Number(v.flag('sala_amazonas_lector_cae')) || 0;          // clímax: fotogramas de la caída
      if (k >= 1 && k <= 3) return 'cae' + k + (v.flag('chaqueta_en_lector') ? 'j' : '');
      return v.flag('chaqueta_en_lector') ? 'chaqueta' : null;
    },
    // la pegatina del reverso, legible (a escala 1, sin el escalado de la perspectiva)
    drawExtra(g, a, t, c) {
      if (!c || !a.variants || !c.sprite || c.sprite !== a.variants.caido) return;
      const x0 = Math.round(a.x + (18 - 39) * c.s), y0 = Math.round(a.y + (3 - 12) * c.s);
      const w = Math.max(26, Math.round(25 * c.s) + 2);
      g.fillStyle = '#fbfaf2'; g.fillRect(x0 - 1, y0 - 1, w, 9);
      g.fillStyle = '#b9b1a0'; g.fillRect(x0 - 1, y0 + 7, w, 1);
      tiny(g, 'ATREZO', x0 + 1, y0 + 1, '#c83a3a');
    },
  },
};
