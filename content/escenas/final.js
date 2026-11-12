// ESCENA FINAL — paquete A (biblia §7.5 «Final y créditos» + adenda 9.8 a-d y 8bis.2). La registra content/rooms/vestibulo.js.
//
//   await api.scene('final')       (alias: 'epilogo')
//
// La lanza el paquete D al terminar la escena 7.4 (tras «BRUNO: Eso es el papel.» y `lector_derribado`), como ÚLTIMA
// instrucción de su script: cuando el jugador sale de los créditos el juego vuelve al título y ya no hay partida.
// Orden: (rótulo) Sábado, 6:00 → vestíbulo (Rubén, Íñigo, Gervasio, el periódico, Celestino, [9.8a Evaristo],
// 8bis.2 plaza de garaje, la abuela [+ 9.8b]) → Pecera (Yoli, [9.8c infografía], el coro) → fundido a negro,
// `juego_terminado` → créditos (recuadro de la fe de erratas, «Asignado a:» + 9.8d, plano de Aurora en la Catacumba,
// LCD de Gertrudis, hilo de Tadeo en la esquina) → poscréditos (Ramírez en la Pecera) → la impresora: «BANDEJA 2
// INSTALADA» → FIN → título.
// Los créditos van con `api.credits()` (vuelven solos a la partida para el poscréditos) y la última imagen con
// `api.ending()` (clic → título). En modo rápido de pruebas (`__game.skipText(true)`) todo se resuelve al instante, de
// principio a fin; el estado de la partida terminada queda en `__game.state().finished`.
import { PAL, rect, hline, vline, frameRect, gradV, ellipse, line, ditherOverlay, glow } from '../../engine/draw.js';
import { drawText, measure, wrap, LINE_H } from '../../engine/font.js';
import game from '../game.js';
import vestArt from '../rooms/art/vestibulo.art.js';

const C = 'celestino', A = 'abuela_remedios', Y = 'yoli_tendencias', R = 'ruben', I = 'inigo_sinergia', GV = 'gervasio_acta', EV = 'evaristo_salvedad';
const CORO = '#7FFFD4';
const at = (layout, id, fb) => (layout && layout[id] && layout[id].at) || fb;
const LH = LINE_H + 2;

// ------------------------------------------------------------------ primer plano del periódico (HUD del motor)
function periodicoHud(g) {
  const x = 30, y = 30, w = 260, h = 110;
  ditherOverlay(g, 0, 0, 320, 144, PAL.ink[0], 0.5);
  rect(g, x + 3, y + 3, w, h, PAL.ink[0]);
  rect(g, x, y, w, h, PAL.paper[5]);
  frameRect(g, x, y, w, h, PAL.paper[2]);
  drawText(g, 'elContable.es', x + 6, y + 3, PAL.ink[2], { outline: null, bold: true });
  drawText(g, 'Sábado · Pág. 7', x + w - 6, y + 3, PAL.paper[1], { outline: null, align: 'right' });
  hline(g, x + 4, y + 15, w - 8, PAL.ink[2]);
  for (let c = 0; c < 3; c++) for (let ly = y + 20; ly < y + 62; ly += 3) hline(g, x + 6 + c * 85, ly, 76 - ((ly * 7 + c * 3) % 9), PAL.paper[2]);
  // faldón
  rect(g, x + 4, y + 66, w - 8, h - 70, PAL.paper[6]);
  frameRect(g, x + 4, y + 66, w - 8, h - 70, PAL.ink[3]);
  drawText(g, 'Hidrovoltia lanza una opa sobre Banco Robledal', x + w / 2, y + 71, PAL.ink[0], { outline: null, align: 'center' });
  drawText(g, 'Por Bruno Pellejo', x + w / 2, y + 84, PAL.red[3], { outline: null, align: 'center' });
  for (let ly = y + 97; ly < y + h - 5; ly += 3) hline(g, x + 10, ly, w - 24 - ((ly * 5) % 11), PAL.paper[2]);
}

// ------------------------------------------------------------------ escena
async function final(api) {
  const G = api.game;
  const L = vestArt.layout || {};
  const EP = vestArt.epilogo;
  await api.cutscene(async () => {
    await api.fadeOut(700);
    api.music('m_final', 2);
    await api.narrate('Sábado, 6:00.');
    // --- reparto del amanecer en el vestíbulo (sitios del arte: vestArt.epilogo)
    await api.goto('vestibulo', 'inicio');
    await api.fadeOut(0);
    const pc = at(L, C, [224, 98, 'down']);
    api.placeActor(C, 'vestibulo', pc[0], pc[1], 'down');
    const pr = EP.ruben;
    api.placeActor(R, 'vestibulo', pr[0], pr[1], pr[2]); api.show(R);
    api.placeActor('bruno', 'vestibulo', EP.bruno[0], EP.bruno[1], EP.bruno[2]); api.show('bruno');
    await api.fadeIn(900);
    await api.wait(400);
    await api.sayAs(R, '¿Sigue gobernando el mismo?');
    api.faceActor(C, R);
    await api.sayAs(C, '¿Tú eres el nuevo?');
    api.faceActor(R, C);
    await api.sayAs(R, 'Sí.');
    // Íñigo con su caja (sale del ascensor)
    const ei = EP.inigo_sinergia, eg = EP.gervasio_acta;
    api.placeActor(I, 'vestibulo', ei.from[0], ei.from[1], ei.from[2]); api.show(I);
    api.sfx('door');
    await api.walkActor(I, ei.at[0], ei.at[1]);
    await api.sayAs(C, '¿Íñigo? ¿El becario de marzo del 98? ¡Te dejaste la taza!');
    api.faceActor(I, C);
    api.sfx('pickup');
    await api.anim(C, 'reach', 500);
    await api.sayAs(I, '...Me la quedo.');
    api.placeActor(GV, 'vestibulo', eg.from[0], eg.from[1], eg.from[2]); api.show(GV);
    api.sfx('door');
    await api.walkActor(GV, eg.at[0], eg.at[1]);
    await api.sayAs(GV, 'Íñigo. Hay una beca en Mercados. Lo hablamos.');
    api.faceActor(I, GV);
    await api.sayAs(I, '¿Cuándo?');
    await api.sayAs(GV, 'Ahora. Lo estamos hablando, ¿no?');
    api.background(async (b) => { await b.walkActor(I, EP.salida[0], EP.salida[1]); b.hide(I); });
    await api.walkActor(GV, eg.salida[0], eg.salida[1]);
    api.hide(GV);
    // el fardo de periódicos
    api.sfx('drop');
    await api.sayAs(C, 'Ha llegado la furgoneta del polígono. Recién salidos.');
    await api.walkTo(EP.periodicos[0], EP.periodicos[1]); api.face('up');
    await api.anim('bruno', 'reach', 400);
    api.sfx('paper');
    G.hud = periodicoHud;
    try {
      await api.narrate(['Hidrovoltia lanza una opa sobre Banco Robledal', 'Por Bruno Pellejo'], { color: '#F4ECD8' });
      await api.say('Bien escrito. Bruno. Pellejo. Con las dos eles.');
    } finally { G.hud = null; }
    api.face('down');
    await api.sayAs(C, '¡Hidrovoltia se lanza a por el Robledal! ¡Eso es opa, árbitro!');
    api.face(C);
    await api.say('Celestino, que la noticia es mía.');
    await api.sayAs(C, '¿Tú eres el nuevo?');
    // adenda 9.8a · Evaristo, solo con correo_evaristo_listo
    if (api.flag('correo_evaristo_listo')) {
      const pe = at(L, EV, [196, 112, 'left']);
      api.placeActor(EV, 'vestibulo', 300, pe[1], 'left'); api.show(EV);
      await api.walkActor(EV, pe[0] + 12, pe[1]);
      api.faceActor(EV, 'bruno'); api.face(EV);
      await api.sayAs(EV, ['Pellejo. Lo he revisado en el periódico. Con jota y dos eles.', 'Correcto.']);
      await api.say('Gracias, don Evaristo.');
      await api.sayAs(EV, 'Le escribiré un correo para felicitarle.');
      await api.say('¿Y si me lo dice ahora?');
      await api.wait(1400);                                                  // (se lo piensa. Mucho.)
      await api.sayAs(EV, ['...Felicidades.', 'Es la primera vez que lo digo sin adjunto.']);
      await api.walkActor(EV, 300, pe[1]); api.hide(EV);
    }
    // adenda 8bis.2 · la plaza de garaje (siempre)
    api.sfx('paper');
    api.face(C);
    await api.sayAs(C, ['Y esto ha llegado por fax. De la Catacumba. Para ti.',
      '«PLAZA 1. NO LA USO DESDE 1997. ES TUYA, CHAVAL.»', '«Y QUE NADIE ME DESEE NADA.»']);
    await api.say('No tengo coche.');
    await api.sayAs(C, 'Ni bici.');
    api.face('down');
    await api.say('Seis años sin plaza de bici. Y ahora tengo una de coche.');
    api.sfx('paper');
    api.setState('vestibulo.cuadro_plazas', 'tachado');
    await api.sayAs(C, 'La línea de sucesión acaba de enloquecer.');
    // la abuela
    api.sfx('phone'); await api.wait(700); api.sfx('phone'); await api.wait(700);
    await api.sayAs(A, '¿Bruno? ¿Has comido?');
    await api.say('Abuela. Salgo en el papel. Página 7. Con mi nombre bien escrito.');
    await api.sayAs(A, 'Ay, hijo. El papel lo dejé en 2011, que me manchaba el sofá.');
    await api.say('...');
    await api.sayAs(A, 'Yo te leo todas las mañanas en el móvil. Te pongo un corazoncito.');
    await api.say('¿En todo?');
    await api.sayAs(A, ['En todo. Hasta en lo del Euríbor.', 'No lo entiendo, pero lo escribes muy bonito.']);
    if ((api.flag('rumor_firma_n') || 0) >= 4) {                           // adenda 9.8b
      await api.sayAs(A, 'En el pueblo digo que eres el dueño. Que suena más.');
      await api.say('Abuela...');
      await api.sayAs(A, ['Tú déjame. Los rumores, en el pueblo, son como el periódico.', 'Si lo dice mucha gente, sale.']);
    }
    await api.sayAs(A, 'Y te pongo «abrígate». Que nunca contestas.');
    api.sfx('click');
    await api.wait(500);

    // --- corte a la Pecera
    await api.fadeOut(500);
    await api.goto('pecera', 'vestibulo');
    for (const id of ['nerea_backlog', 'leoncio_quesitos', 'anselmo_monolito', R, I, GV, 'lector_medio']) if (G.actors[id]) api.hide(id);
    const py = at(G.content.rooms.pecera && G.content.rooms.pecera.layout, Y, [282, 112, 'down']);
    api.placeActor('bruno', 'pecera', py[0] - 30, py[1] + 4, 'right');
    api.faceActor(Y, 'bruno');
    await api.fadeIn(500);
    await api.sayAs(Y, ['Bruno. Esa cuenta que comenta «abrígate» en todo...', 'Tiempo medio de permanencia: cuarenta y siete minutos.',
      'Es el récord de la historia del medio.']);
    await api.say('¿Cuántos lectores?');
    await api.sayAs(Y, ['Una. Pero se lo lee TODO. La tengo como KPI.', 'Y desde esta noche, otro. Comenta «gracias por sacarme». En mayúsculas.']);
    if (api.flag('infografia_integrada')) {                                // adenda 9.8c
      await api.sayAs(Y, ['La infografía de la opa: permanencia, más de un 40 %.', 'Firmada por dos departamentos. Bueno, firmada no. Reclamada.']);
    }
    const coro = async (t) => { await api.sayFrom('pecera.coro_desarrollo', t, { color: CORO }); };
    await coro('DEV 1: La web ha publicado la opa a las 00:01. Sin un fallo.');
    await coro('DEV 2: Ni uno.');
    await coro('DEV 1: ¿Y a quién se lo damos?');
    await coro('CORO: ...Diseño.');
    await api.say('Diseño soy yo. Lo pone el organigrama.');
    await coro('DEV 2: Pues enhorabuena, Diseño.');
    await coro('CORO: Enhorabuena, Diseño.');
    api.face('down');
    await api.say(['Por fin tengo departamento. Y es el que tenía razón.',
      'Si has llegado hasta aquí...', '...tu tiempo de permanencia es mejor que el de la portada.']);
    await api.fadeOut(1200);
  });
  api.setFlag('juego_terminado', true);
  await creditosYPoscreditos(api);
}

// ------------------------------------------------------------------ créditos
function creditos(api) {
  const f = (k) => !!api.flag(k);
  const asig = (title, ...lines) => [{ text: title, title: true }, ...lines, ''];
  return [
    { text: 'FE DE ERRATAS', title: true },
    'En la edición de ayer, donde decía «inteligencia artificial»',
    'debía decir «Rubén».',
    'Donde decía «Por Bruno Pellejo»',
    'debía decir «Por Bruno Pellejo».',
    'Lamentamos el acierto.',
    '', '', '',
    ...asig('Guion', 'Asignado a: el equipo de guion'),
    ...asig('Duelos', 'Asignado a: quien no se escaqueó'),
    ...asig('Motor y pegamento', 'Asignado a: Sistemas (ticket nº 2)'),
    ...asig('Fondos', 'Asignado a: tres artistas con tipómetro'),
    { text: 'Música', title: true }, 'Asignado a: un secuenciador de onda cuadrada',
    ...Array(PLANO_N).fill(''),                                               // hueco: plano de la Catacumba (Aurora)
    ...asig('Infografía', 'Asignado a: Herminia.', f('infografia_integrada') ? '(becaria de Desarrollo, alta en 40 segundos)' : 'Integración: pendiente de revisión (marzo).'),
    ...asig('Diseño y Producto', 'Asignado a: Diseño y Producto. Entregado a las 18:29.'),
    ...asig('Errores', 'Asignado a: Diseño (que no fue).'),
    ...asig('Controlling', f('correo_evaristo_listo') ? 'Asignado a: el único que leyó hasta el final.' : 'Asignado a: un correo que nadie quiso oír.'),
    ...asig('Material', 'Asignado a: Custodia Precinto. Devuélvanle el boli.'),
    ...asig('Salas', 'Asignado a: Ramírez (viernes, 20:59, recurrente).'),
    ...asig('Reenvíos', 'Asignado a: la impresora de la tercera, la única que leía a Tadeo.'),
    ...asig('Rumores', 'Asignado a: la planta del vestíbulo (micrófono de 1994).'),
    ...asig('Plazas de garaje', 'Asignado a: Bruno Pellejo (plaza 1, sin coche).'),
    ...asig('Dirección de arte', 'Asignado a: Valentín Retícula (lo entregó a las 18:29).'),
    '',
    'Ninguna rotativa fue apagada durante el desarrollo de este juego.',
    '',
    'Gracias por jugar. Abrígate.',
    ...Array(4).fill(''),
  ];
}
const PLANO_N = 10;                 // líneas en blanco que deja el plano de Aurora (10 × 13 px)
const MARCA_PLANO = 'Asignado a: un secuenciador de onda cuadrada';
const HILO = [
  ['De: Tadeo Adjunto', 'RV: Fe de erratas · «¡Equipo! ¿Esto lo ha escrito la IA?!!»'],
  ['De: Bruno Pellejo', 'RE: No. Un becario.'],
  ['De: Tadeo Adjunto', 'RE: ¡Qué modelo más bueno! ¿Cuánto cuesta?'],
  ['De: Evaristo Salvedad', 'RE: Cuarenta y ocho euros. Con coma.'],
];

/** Plano de la Catacumba (§7.5): Aurora lee la fe de erratas, se quita las gafas y se desmaya sobre el Libro de
 *  Estilo, que por fin sostiene algo. Viñeta que sube con los créditos; `k` = 0 (entra por abajo) … 1 (sale arriba). */
function planoAurora(g, x, y, w, h, k) {
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.ink[0]);
  gradV(g, x, y, w, h, ['#2a1c16', '#3a281c', '#4a3422']);
  glow(g, x + w * 0.35, y + 14, 50, 22, PAL.gold[5], 0.16);
  vline(g, x + w * 0.35, y, 8, PAL.metal[2]); rect(g, x + w * 0.35 - 6, y + 7, 13, 4, PAL.gold[3]);  // lámpara de techo
  // mesa
  const my = y + h - 26;
  rect(g, x + 8, my, w - 16, 20, PAL.wood[3]); rect(g, x + 8, my, w - 16, 5, PAL.wood[4]); hline(g, x + 8, my, w - 16, PAL.wood[6]); rect(g, x + 12, my + 5, 4, 21, PAL.wood[2]); rect(g, x + w - 16, my + 5, 4, 21, PAL.wood[2]);
  // el Libro de Estilo, gordísimo
  const bx = x + w / 2 - 4, by = my - 11;
  rect(g, bx, by, 34, 11, '#5a1a1a'); hline(g, bx, by, 34, '#8a3030'); rect(g, bx + 2, by + 3, 30, 1, PAL.paper[5]); rect(g, bx + 2, by + 7, 30, 1, PAL.paper[5]);
  drawText(g, 'LIBRO DE ESTILO', x + w / 2, my + 8, PAL.paper[4], { outline: null, align: 'center' });   // en el canto de la mesa
  // Aurora (rebeca burdeos, moño gris con boli rojo, gafas de media luna)
  const ax = x + w / 2 - 26;
  const fase = k < 0.38 ? 'lee' : k < 0.6 ? 'gafas' : 'desmayo';
  const skin = '#e0b494', card = '#7a2032', hair = '#b8b8bc';
  if (fase !== 'desmayo') {
    rect(g, ax - 7, my - 22, 16, 22, card); rect(g, ax - 6, my - 21, 2, 20, '#922a3e');      // torso
    ellipse(g, ax + 1, my - 29, 6, 7, skin);                                                  // cabeza
    ellipse(g, ax + 1, my - 36, 5, 3, hair); line(g, ax + 3, my - 41, ax + 7, my - 33, PAL.red[3]);   // moño + boli
    if (fase === 'lee') {
      hline(g, ax - 3, my - 29, 9, PAL.ink[1]);                                               // gafas
      rect(g, ax + 6, my - 26, 16, 12, PAL.paper[6]); frameRect(g, ax + 6, my - 26, 16, 12, PAL.paper[2]);   // la fe de erratas
      for (let i = 0; i < 4; i++) hline(g, ax + 8, my - 24 + i * 3, 11 - i, PAL.paper[1]);
    } else {
      rect(g, ax + 9, my - 18, 6, 2, PAL.ink[1]); line(g, ax + 9, my - 18, ax + 7, my - 22, PAL.metal[4]);   // gafas en la mano
      px2(g, ax - 1, my - 30); px2(g, ax + 3, my - 30);                                       // ojos muy abiertos
    }
  } else {
    // desplomada sobre el libro: brazos y cabeza encima
    rect(g, ax - 4, my - 13, 26, 13, card);
    ellipse(g, bx + 8, by - 5, 7, 5, skin);
    ellipse(g, bx + 4, by - 9, 5, 3, hair); line(g, bx + 1, by - 12, bx + 9, by - 9, PAL.red[3]);
    rect(g, bx + 18, by - 2, 7, 2, PAL.ink[1]);                                               // gafas sobre el libro
    if (Math.floor(k * 40) % 4 < 2) drawText(g, 'z', bx + 22, by - 18, PAL.paper[4], { outline: null });
  }
  frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.paper[2]);
}
function px2(g, x, y) { rect(g, x, y, 1, 1, PAL.ink[0]); }

function creditsDraw(api) {
  const G = api.game, base = game.ending && game.ending.draw;
  return (g, t) => {
    if (base) base(g, t); else gradV(g, 0, 0, 320, 200, [PAL.ink[0], PAL.night[1], PAL.night[2]]);
    const e = G.ending; if (!e) return;
    const y0 = 200 - t / 1000 * (e.def.speed || 14) + (e.def.startY ?? 0);
    // recuadro de la fe de erratas (primeras 6 líneas)
    const by = Math.round(y0) - 4;
    if (by < 200 && by + 6 * LH + 8 > 0) {
      g.save(); g.globalAlpha = 0.85; rect(g, 18, by, 284, 6 * LH + 6, '#100c18'); g.restore();
      frameRect(g, 18, by, 284, 6 * LH + 6, PAL.paper[3]); frameRect(g, 20, by + 2, 280, 6 * LH + 2, PAL.paper[1]);
    }
    // plano de Aurora, en el hueco tras la marca
    const im = e.lines.findIndex(l => l.t === MARCA_PLANO);
    if (im >= 0) {
      const py = Math.round(y0 + (im + 1) * LH) + 6, ph = PLANO_N * LH - 12;
      if (py < 200 && py + ph > 0) {
        try { planoAurora(g, 92, py, 136, ph, 1 - (py + ph) / (200 + ph)); } catch (err) { /* decorativo */ }
      }
    }
  };
}
/** Por encima del texto: el LCD de Gertrudis (game.ending.overlay) y el hilo de Tadeo en la esquina opuesta, que
 *  entra cuando ya no queda texto abajo. */
function creditsOverlay(api) {
  const G = api.game, base = game.ending && game.ending.overlay;
  return (g, t) => {
    if (base) base(g, t);
    const e = G.ending; if (!e) return;
    const y0 = 200 - t / 1000 * (e.def.speed || 14) + (e.def.startY ?? 0);
    const lastY = y0 + (e.lines.length - 5) * LH;
    if (lastY < 112) {
      const rows = [];
      for (const [de, txt] of HILO) { rows.push([de, '#FFCC99']); for (const w of wrap(txt, 196)) rows.push(['  ' + w, '#e8dcc8']); }
      const bh = rows.length * 10 + 6, bx = 4, byy = 196 - bh;
      g.save(); g.globalAlpha = 0.9; rect(g, bx, byy, 212, bh, '#0c0a14'); g.restore();
      frameRect(g, bx, byy, 212, bh, '#5a4a3a');
      rows.forEach(([s, col], i) => drawText(g, s, bx + 4, byy + 3 + i * 10, col, { outline: null }));
    }
  };
}

/** Última imagen (§7.5): la impresora de la tercera, sola, imprime una hoja: «BANDEJA 2 INSTALADA». Luego, FIN. */
function impresoraDraw(g, t) {
  gradV(g, 0, 0, 320, 200, [PAL.ink[0], PAL.night[0], PAL.ink[1]]);
  glow(g, 160, 120, 90, 40, PAL.blue[4], 0.12);
  const px0 = 116, py0 = 112;
  // hoja que sale
  const k = Math.max(0, Math.min(1, (t - 1200) / 4200));
  const sh = Math.round(46 * k);
  if (sh > 0) {
    rect(g, px0 + 14, py0 - sh, 60, sh, PAL.paper[6]); frameRect(g, px0 + 14, py0 - sh, 60, sh, PAL.paper[3]);
    g.save(); g.beginPath(); g.rect(px0 + 14, py0 - sh, 60, sh); g.clip();
    drawText(g, 'BANDEJA 2', px0 + 44, py0 - 40, PAL.ink[1], { outline: null, align: 'center', bold: true });
    drawText(g, 'INSTALADA', px0 + 44, py0 - 28, PAL.ink[1], { outline: null, align: 'center', bold: true });
    g.restore();
  }
  // impresora
  rect(g, px0, py0, 88, 30, PAL.metal[4]); hline(g, px0, py0, 88, PAL.metal[6]); rect(g, px0 + 10, py0 - 3, 68, 4, PAL.metal[2]);
  rect(g, px0 + 6, py0 + 8, 20, 6, '#0c1810'); drawText(g, k < 1 ? '...' : 'OK', px0 + 16, py0 + 6, '#7cff7c', { outline: null, align: 'center' });
  rect(g, px0 + 70, py0 + 9, 3, 3, Math.floor(t / 300) % 2 ? '#7cff7c' : '#1c3a1c');
  rect(g, px0 + 4, py0 + 30, 80, 3, PAL.metal[2]); rect(g, px0 + 8, py0 + 33, 4, 6, PAL.metal[1]); rect(g, px0 + 76, py0 + 33, 4, 6, PAL.metal[1]);
  if (t > 6200) drawText(g, 'FIN', 160, 34, '#f2d468', { align: 'center', scale: 2 });
}

/** Créditos + poscréditos + última imagen. `api.credits()` muestra los créditos y, cuando el texto ha salido de
 *  pantalla, vuelve sola a la partida (misma sala, modo 'play') para el poscréditos; `api.ending()` cierra el juego. */
async function creditosYPoscreditos(api) {
  const G = api.game;
  await api.credits({ credits: creditos(api), draw: creditsDraw(api), overlay: creditsOverlay(api), theEnd: false, holdY: -14, holdMs: 600, music: 'm_creditos' });
  if (!G.state) return;
  // ---- poscréditos: la Pecera, vacía
  await api.fadeOut(0);
  api.music(null, 1);
  await api.cutscene(async () => {
    const Lp = (G.content.rooms.pecera && G.content.rooms.pecera.layout) || {};
    const silla = (Lp.silla_ramirez && Lp.silla_ramirez.walkTo) || [346, 116];
    for (const id of [Y, 'bruno', 'nerea_backlog', 'leoncio_quesitos', 'anselmo_monolito', R]) if (G.actors[id]) api.hide(id);
    api.placeActor('lector_medio', 'pecera', silla[0] + 30, silla[1] + 2, 'down'); api.show('lector_medio');
    api.placeActor('ramirez', 'pecera', Math.max(24, silla[0] - 140), silla[1] + 2, 'right'); api.show('ramirez');
    api.cameraTo(silla[0]);
    await api.fadeIn(800);
    await api.wait(500);
    await api.walkActor('ramirez', silla[0] + 18, silla[1] + 2);
    api.faceActor('ramirez', 'right');
    await api.anim('ramirez', 'reach', 700);                                 // le quita la chaqueta al Lector Medio caído
    api.sfx('pickup');
    await api.wait(300);
    await api.walkActor('ramirez', silla[0], silla[1]);
    api.faceActor('ramirez', 'down');
    await api.wait(400);
    await api.sayAs('ramirez', '¿Me he perdido algo?');
    await api.narrate('TODA LA REDACCIÓN: «No.»');
    await api.wait(600);
    await api.fadeOut(900);
  });
  // ---- última imagen: la impresora de la tercera
  api.sfx('machine');
  await api.ending({ credits: [], draw: impresoraDraw, overlay: null, topY: 0, theEnd: false, holdY: 60 });
}

export const finalScenes = { final, epilogo: final };
export { creditos as creditosFinales };
