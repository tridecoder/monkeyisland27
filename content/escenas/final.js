// ESCENA FINAL — P1 (docs/guion2/PLAN_COMEDIA.md §9 entero; ENMIENDA E1: epílogo y créditos sin Infografía ni Diseño).
// La registra content/rooms/vestibulo.js.
//
//   await api.scene('final')       (alias: 'epilogo')
//
// La lanza el clímax (P4) al terminar la escena 7.4, como ÚLTIMA instrucción de su script: cuando el jugador sale de los
// créditos el juego vuelve al título y ya no hay partida.
// Orden (§9 + ENMIENDA E2 §4.5, §5.8, §7.4, fase B (5), (10)-(12), (16), (17)): Sábado, 6:00 → Vestíbulo (Íñigo y la
// taza, el periódico, Maripaz y su banner a rotulador, Evaristo —siempre—, Ramírez, la plaza 1, Yoli) → la abuela
// («Abrígate tú.» → «¡Me ha contestado el periódico!») → fundido, `juego_terminado` → tarjeta fija
// FE DE ERRATAS (`api.tarjeta`) → créditos cortos (`api.ending`, con la viñeta de Aurora y el LCD de Gertrudis) → título.
// Nada después: ni poscréditos ni impresora. En modo rápido de pruebas (`__game.skipText(true)`) todo se resuelve al
// instante; el estado de la partida terminada queda en `__game.state().finished`.
import { PAL, rect, hline, vline, frameRect, gradV, ellipse, line, glow } from '../../engine/draw.js';
import { drawText, LINE_H } from '../../engine/font.js';
import game from '../game.js';
import vestArt, { drawCajaInigo, drawCruasan, drawPeriodicoMaripaz } from '../rooms/art/vestibulo.art.js';

const C = 'celestino', A = 'abuela_remedios', Y = 'yoli_tendencias', R = 'ruben', I = 'inigo_sinergia', MP = 'maripaz_remitido',
  EV = 'evaristo_salvedad', RA = 'ramirez';
const at = (layout, id, fb) => (layout && layout[id] && layout[id].at) || fb;
const LH = LINE_H + 2;

// ------------------------------------------------------------------ plano detalle: la página 7
// Titular en tipografía de periódico (negrita a doble tamaño, filetes, columnas, firma en rojo). Coordenadas de PANTALLA
// dentro del marco r = { x, y, w, h } (api.detalle, engine/detalle.js).
export function paginaSiete(g, r) {
  const { x, y, w, h } = r;
  rect(g, x, y, w, h, '#e8e0c8');
  for (let yy = y; yy < y + h; yy += 2) hline(g, x, yy, w, (yy & 2) ? '#e4dcc2' : '#ece4cc');            // papel con grano
  rect(g, x, y, w, 2, '#d8cfb0'); rect(g, x, y + h - 2, w, 2, '#d8cfb0');
  drawText(g, 'elContable.es', x + 5, y + 2, '#141220', { outline: null, bold: true });
  drawText(g, 'SÁBADO · PÁGINA 7', x + w - 5, y + 3, '#5a4a38', { outline: null, align: 'right' });
  rect(g, x + 4, y + 15, w - 8, 2, '#141220'); hline(g, x + 4, y + 18, w - 8, '#141220');
  for (let c = 0; c < 2; c++) for (let ly = y + 21; ly < y + 33; ly += 2) hline(g, x + 5 + c * 36, ly, 31 - ((ly * 7 + c * 5) % 7), '#a89c80');
  rect(g, x + 78, y + 21, 1, 12, '#a89c80');
  rect(g, x + 4, y + 36, w - 8, 2, '#141220');
  drawText(g, 'Hidrovoltia lanza', x + (w >> 1), y + 37, '#0c0a12', { outline: null, bold: true, align: 'center', scale: 2 });
  drawText(g, 'una opa', x + (w >> 1), y + 51, '#0c0a12', { outline: null, bold: true, align: 'center', scale: 2 });
  drawText(g, 'sobre Banco Robledal', x + (w >> 1), y + 76, '#2a2418', { outline: null, bold: true, align: 'center' });
  hline(g, x + 40, y + 87, w - 80, '#141220');
  drawText(g, 'Por Bruno Pellejo', x + (w >> 1), y + 89, '#b02a22', { outline: null, align: 'center' });
}

// la pantalla del móvil con los comentarios de la pieza (modo aplicación de engine/phone.js)
const COMENTARIOS = (conRespuesta) => ({
  title: 'Comentarios', hora: '6:12',
  rows: [
    { text: 'Página 7: la opa', sub: 'Por Bruno Pellejo' },
    { text: 'abrígate', sub: 'Abrígate.' },
    ...(conRespuesta ? [{ text: 'Bruno Pellejo', sub: 'Abrígate tú.', dot: true }] : []),
  ],
});

// ------------------------------------------------------------------ escena
async function final(api) {
  const L = vestArt.layout || {};
  const EP = vestArt.epilogo;
  await api.cutscene(async () => {
    await api.fadeOut(700);
    api.music('m_final', 2);
    await api.narrate('Sábado, 6:00.');
    // --- el Vestíbulo al amanecer (sitios del arte: vestArt.epilogo)
    await api.goto('vestibulo', 'inicio');
    await api.fadeOut(0);
    api.setState('vestibulo.puerta_calle', 'amanecer');
    const pc = at(L, C, [170, 97, 'down']);
    api.placeActor(C, 'vestibulo', pc[0], pc[1], 'down');
    const pr = EP.ruben;
    api.placeActor(R, 'vestibulo', pr[0], pr[1], 'left'); api.show(R);       // junto al cristal, mira la calle como un estreno
    api.placeActor('bruno', 'vestibulo', EP.bruno[0], EP.bruno[1], EP.bruno[2]); api.show('bruno');
    await api.fadeIn(900);
    await api.wait(500);
    // (E2 fase B (10): fuera Rubén y Celestino «¿Tú eres el nuevo?»; el epílogo empieza con Íñigo y su caja)

    // Íñigo sale del ascensor con su caja
    const ei = EP.inigo_sinergia;
    api.placeActor(I, 'vestibulo', ei.from[0], ei.from[1], ei.from[2]); api.show(I);
    api.sostener(I, { draw: drawCajaInigo });                                  // pósits, la matriz y el portátil
    api.sfx('door');
    api.faceActor(C, I);
    api.background(async (b) => { await b.walkActor(I, ei.at[0], ei.at[1]); });
    await api.sayAs(C, '¡Y sale el consultor por la banda! ¡Con la caja! ¡Con...!');
    await api.walkActor(I, ei.at[0], ei.at[1]);
    await api.wait(900);                                                       // deja de narrar; le mira la cara
    await api.sayAs(C, '¿Íñigo? ¿El becario de marzo del 98? ¡Te dejaste la taza!');
    api.faceActor(I, C);
    api.sfx('pickup');
    await api.anim(C, 'reach', 500);                                           // la taza «BECARIO 98», de objetos perdidos
    await api.sayAs(I, 'Yo no fui becario. Fui un perfil junior con mucho recorrido.');
    await api.sayAs(C, 'Cuatro meses. Sin baja. Saliste por esa puerta con un táper.');
    await api.wait(1500);                                                      // silencio largo; Íñigo mira la taza
    await api.sayAs(I, '...Me la quedo.');
    api.face(I);
    await api.say('¿Y qué hiciste después?');
    api.faceActor(I, 'bruno');
    await api.sayAs(I, 'Me fui. Y volví facturando. Es lo que se hace.');
    await api.say('Yo no voy a hacer eso.');
    await api.sayAs(I, 'Eso dije yo. Con esas palabras.');
    await api.anim(I, 'reach', 400);                                           // mete la taza en la caja
    await api.sayAs(I, 'Suerte, Bruno.');
    await api.wait(1200);                                                      // primera vez que dice su nombre; Bruno no contesta
    // E2 fase B (5): sin Gervasio ni beca; Íñigo sale solo, con su caja (y sin el «¡Se retiran los dos!» de Celestino)
    api.faceActor(C, 'left');
    await api.walkActor(I, EP.salida[0], EP.salida[1]); api.hide(I);

    // el fardo de periódicos
    api.sfx('drop');
    api.shake(150, 1);
    api.show('vestibulo.fardo_periodicos');
    api.faceActor(C, 'bruno');
    await api.sayAs(C, '¡Furgoneta del polígono! ¡Recién salidos! ¡Todavía manchan!');
    await api.walkTo(EP.periodicos[0], EP.periodicos[1]); api.face(C);
    await api.anim('bruno', 'reach', 400);
    api.sfx('paper');
    // E2 §9 B9: el titular ya se lee en el plano; fuera las dos líneas del narrador
    await api.detalle({ titulo: 'PÁGINA 7', x: 40, y: 3, w: 240, h: 100, draw: paginaSiete, color: '#f2ecd8', oscurecer: 0.55,
      lines: [['player', 'Bien escrito. Bruno. Pellejo. Con jota y dos eles.']] });
    await api.sayAs(C, '¡Hidrovoltia se lanza a por el Robledal! ¡Eso es opa, árbitro!');
    await api.say('Celestino, que la noticia es mía.');
    await api.sayAs(C, '¿Tú eres el nuevo?');
    await api.say('No. Soy Bruno Pellejo.');
    await api.wait(1000);
    await api.sayAs(C, '...Pues bienvenido, Bruno Pellejo. Ya te ve hasta el torno.');

    // E2 §4.5: Maripaz, del ascensor, con el periódico abierto por la página 7 y un rotulador (el sitio de Gervasio)
    const em = EP.maripaz_remitido;
    api.placeActor(MP, 'vestibulo', em.from[0], em.from[1], em.from[2]); api.show(MP);
    api.sostener(MP, { draw: drawPeriodicoMaripaz });
    api.sfx('door');
    api.faceActor(C, MP);
    await api.walkActor(MP, em.at[0], em.at[1]);
    api.faceActor(MP, 'bruno'); api.face(MP);
    await api.sayAs(MP, ['Página 7. Tu noticia, entera. Ni un anuncio. Me ha dolido, cariño.',
      'Aunque mira: entre línea y línea todavía cabía un banner.']);
    await api.anim(MP, 'reach', 700);                                          // lo dibuja con el rotulador, entre dos líneas
    api.sostener(MP, { draw: (g, x, y, sc, dir) => drawPeriodicoMaripaz(g, x, y, sc, dir, true) });
    api.sfx('click');
    await api.wait(500);
    await api.say('Es papel. No se le puede hacer clic.');
    await api.sayAs(MP, 'Eso te lo arreglo con un pop-up. De cartulina.');
    api.sfx('hit'); api.shake(150, 1);                                         // golpe de mazo en el fardo. Pum.
    await api.wait(400);
    await api.walkActor(MP, EP.salida[0], EP.salida[1]); api.hide(MP);         // sale a la calle

    // E2 §5.8: Evaristo, siempre (deja de depender de correo_evaristo_listo), en tres líneas
    const pe = at(L, EV, [196, 113, 'left']);
    api.placeActor(EV, 'vestibulo', 300, pe[1], 'left'); api.show(EV);
    await api.walkActor(EV, pe[0] + 12, pe[1]);
    api.faceActor(EV, 'bruno'); api.face(EV);
    await api.sayAs(EV, 'Pellejo. Lo he revisado en el periódico. Con jota y dos eles.');
    await api.say('Gracias, don Evaristo.');
    await api.wait(1400);                                                      // se lo piensa. Mucho.
    await api.sayAs(EV, '...Felicidades. Es la primera vez que lo digo sin adjunto.');
    await api.walkActor(EV, 300, pe[1]); api.hide(EV);

    // Ramírez entra por la puerta de la calle, con un cruasán mordido (paga el momento 4.3)
    const era = EP.ramirez;
    api.placeActor(RA, 'vestibulo', era.from[0], era.from[1], era.from[2]); api.show(RA);
    api.sostener(RA, { draw: drawCruasan });
    api.sfx('door');
    await api.walkActor(RA, era.at[0], era.at[1]);
    api.faceActor(RA, 'bruno'); api.face(RA);
    await api.sayAs(RA, 'Buenos días. ¿Me he perdido algo?');
    api.faceActor(C, RA);
    await api.sayAs(C, '¡Vuelve Ramírez! ¡Del desayuno más largo de la historia del club!');
    await api.say('Su chaqueta está en la Sala Amazonas. En el suelo. Con el Lector Medio.');
    // (E2 fase B (12): fuera «...¿Y qué ha decidido?» / «Que la rotativa no se apaga.» / «Siempre fue muy sensata.»)
    const esc = (L.vestibulo_a_redaccion && L.vestibulo_a_redaccion.walkTo) || [300, 112];
    api.background(async (b) => { await b.walkActor(RA, esc[0], esc[1]); b.hide(RA); });   // sube la escalera, masticando

    // la plaza 1, por fax
    api.sfx('paper');
    api.faceActor(C, 'bruno'); api.face(C);
    await api.sayAs(C, ['Y esto ha llegado por fax. De la Redacción de papel. Para ti.',
      '«PLAZA 1. NO LA USO DESDE 1997. TUYA, CHAVAL. QUE NADIE ME DESEE NADA.»']);
    await api.say('No tengo coche.');
    await api.sayAs(C, 'Ni bici.');
    api.sfx('paper');
    await api.anim(C, 'reach', 400);
    api.setState('vestibulo.cuadro_plazas', 'tachado');                        // tacha una línea en el cuadro de llaves
    await api.wait(700);                                                       // (E2 §7.4: sin «La línea de sucesión…»)
    api.hide(RA);

    // Yoli baja por la escalera, con el abrigo puesto y el colirio en la mano
    const ey = EP.yoli_tendencias;
    api.placeActor(Y, 'vestibulo', ey.from[0], ey.from[1], ey.from[2]); api.show(Y);
    await api.walkActor(Y, ey.at[0], ey.at[1]);
    api.faceActor(Y, 'bruno'); api.face(Y);
    await api.sayAs(Y, ['Bruno. Esa cuenta que comenta «abrígate» en todo...',
      'Se ha leído tu opa entera. Cuarenta y siete minutos. La portada dura nueve.']);
    await api.say('¿Cuántos lectores?');
    await api.sayAs(Y, 'Una. Pero se lo lee TODO. La he puesto de objetivo de empresa.');   // E2 L28 (fase B (16): sin la cafetera)
    await api.sayAs(Y, 'Y desde esta noche, otro. Comenta «gracias por sacarme». En mayúsculas.');
    api.faceActor(R, Y);
    await api.walkActor(Y, EP.salida[0], EP.salida[1]); api.hide(Y);
    api.face('down');

    // la abuela (llamada con el móvil de Bruno en primer plano)
    await api.phone.call({ caller: A, label: 'Abuela', ringMs: 2000 }, async () => {
      await api.phone.say('¿Bruno? ¿Has comido?');
      await api.say('Abuela. Salgo en el papel. Página 7. Con mi nombre bien escrito.');
      await api.phone.say('Ay, hijo. El papel lo dejé en 2011, que me manchaba el sofá.');
      await api.say('...');
      await api.phone.say('Yo te leo todas las mañanas en el móvil. Te pongo un corazoncito.');
      // (E2 fase B (17): fuera «¿En todo?» / «En todo. Hasta en lo del Euríbor.» / «…muy bonito.»; (1): fuera el rumor A)
      await api.phone.say('Y te pongo «abrígate». Que nunca contestas.');
    });
    // Bruno baja el móvil y teclea con el pulgar, despacio: primer plano, bajo su pieza, un comentario nuevo
    await api.wait(600);
    await api.phone.app(COMENTARIOS(false));
    await api.anim('bruno', 'reach', 900);
    api.sfx('click');
    await api.phone.app(COMENTARIOS(true));
    await api.narrate('Bruno Pellejo ha respondido: «Abrígate tú.»');
    await api.wait(1200);
    await api.phone.read(A, '...¡Ay! ¡Me ha contestado el periódico!');
    await api.phone.close();
    // Celestino, sin decir nada, le enrolla al cuello la bufanda del Ibex
    await api.walkTo(L.celestino && L.celestino.walkTo ? L.celestino.walkTo[0] : 138, 122);
    api.face(C); api.faceActor(C, 'bruno');
    await api.anim(C, 'reach', 900);
    api.vestir('bruno', 'con_bufanda');                  // unos píxeles: la bufanda verde con la raya roja, ya en Bruno
    api.vestir(C, 'sin_bufanda');
    api.sfx('pickup');
    await api.wait(700);
    // Bruno sale a la calle con el periódico bajo el brazo. Fundido a negro.
    api.music(null, 2.5);
    api.background(async (b) => { await b.walkTo(EP.salida[0], EP.salida[1]); });
    await api.wait(1800);
    await api.fadeOut(1600);
  });
  api.setFlag('juego_terminado', true);
  await feDeErratasYCreditos(api);
}

// ------------------------------------------------------------------ la fe de erratas (tarjeta fija, §9)
// Repartida a mano: el texto de la tarjeta tiene 216 px de ancho y ninguna línea debe partirse sola.
export const FE_DE_ERRATAS = [
  'En la edición de ayer, donde decía',
  '«inteligencia artificial»',
  'debía decir «Rubén».',
  '',
  'Donde decía «Por Bruno Pellejo»',
  'debía decir «Por Bruno Pellejo».',
  '',
  'Lamentamos el acierto.',
];

// ------------------------------------------------------------------ créditos (cortos, informativos, sin gag de cierre)
function creditos(api) {
  const asig = (title, ...lines) => [{ text: title, title: true }, ...lines, ''];
  return [
    { text: 'FE DE ERRATAS', title: true },
    'Una aventura de cierre',
    '', '',
    ...asig('Guion', 'Asignado a: el equipo de guion', '(tras tres reuniones rápidas)'),
    ...asig('Puzles y duelos', 'Asignado a: quien no se escaqueó'),
    ...asig('Motor y pegamento', 'Asignado a: Sistemas. Ticket nº 4.', 'Estado: cerrado.'),
    ...asig('Fondos', 'Asignado a: tres artistas con tipómetro'),
    { text: 'Música', title: true }, MARCA_PLANO,
    ...Array(PLANO_N).fill(''),                                               // hueco: la viñeta de Aurora
    ...asig('Café', 'Asignado a: Gertrudis. Se lo había ganado.'),
    ...asig('Audiencia', 'Asignado a: una lectora. Cuarenta y siete minutos.'),
    ...asig('Controlling', 'Asignado a: don Evaristo Salvedad. Leyó hasta el final.'),          // E2 §5.8
    ...asig('Eventos', 'Asignado a: Pilar Escaleta. Empezamos en cinco minutos.'),
    ...asig('Marketing', 'Asignado a: el móvil de Borja. Lo publicó a las nueve.'),              // E2 §3.3
    ...asig('Reenvíos', 'Asignado a: Tadeo Adjunto. La IA estaba de acuerdo.'),
    ...asig('Material', 'Asignado a: Custodia Precinto. Devuélvanle el boli.'),
    ...asig('Salas', 'Asignado a: Ramírez (viernes, 20:59, recurrente)'),
    ...asig('Rumores', 'Asignado a: la planta del vestíbulo (micrófono de 1994)'),
    ...asig('Plazas de garaje', 'Asignado a: Bruno Pellejo (plaza 1, sin coche)'),
    ...asig('Lector Medio', 'Atrezo. Focus group 2014. Asintió.'),
    ...asig('Sala Polivalente', 'Cuenta atrás: 00:04:59. Por fin empezamos.'),
    'Ninguna rotativa fue apagada',
    'durante el desarrollo de este juego.',
    '', '',
    'Gracias por jugar.',
    'Abrígate.',
  ];
}
const PLANO_N = 10;                 // líneas en blanco que deja la viñeta de Aurora (10 × 13 px)
const MARCA_PLANO = 'Asignado a: un secuenciador de onda cuadrada';

/** Viñeta de los créditos (★ del plan): Aurora lee la fe de erratas, se quita las gafas y se desmaya sobre el Libro de
 *  Estilo. Sube con los créditos; `k` = 0 (entra por abajo) … 1 (sale arriba). */
function planoAurora(g, x, y, w, h, k) {
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.ink[0]);
  gradV(g, x, y, w, h, ['#2a1c16', '#3a281c', '#4a3422']);
  glow(g, x + w * 0.35, y + 14, 50, 22, PAL.gold[5], 0.16);
  vline(g, x + w * 0.35, y, 8, PAL.metal[2]); rect(g, x + w * 0.35 - 6, y + 7, 13, 4, PAL.gold[3]);  // lámpara de techo
  const my = y + h - 26;
  rect(g, x + 8, my, w - 16, 20, PAL.wood[3]); rect(g, x + 8, my, w - 16, 5, PAL.wood[4]); hline(g, x + 8, my, w - 16, PAL.wood[6]); rect(g, x + 12, my + 5, 4, 21, PAL.wood[2]); rect(g, x + w - 16, my + 5, 4, 21, PAL.wood[2]);
  const bx = x + w / 2 - 4, by = my - 11;
  rect(g, bx, by, 34, 11, '#5a1a1a'); hline(g, bx, by, 34, '#8a3030'); rect(g, bx + 2, by + 3, 30, 1, PAL.paper[5]); rect(g, bx + 2, by + 7, 30, 1, PAL.paper[5]);
  drawText(g, 'LIBRO DE ESTILO', x + w / 2, my + 8, PAL.paper[4], { outline: null, align: 'center' });
  const ax = x + w / 2 - 26;
  const fase = k < 0.38 ? 'lee' : k < 0.6 ? 'gafas' : 'desmayo';
  const skin = '#e0b494', card = '#7a2032', hair = '#b8b8bc';
  if (fase !== 'desmayo') {
    rect(g, ax - 7, my - 22, 16, 22, card); rect(g, ax - 6, my - 21, 2, 20, '#922a3e');
    ellipse(g, ax + 1, my - 29, 6, 7, skin);
    ellipse(g, ax + 1, my - 36, 5, 3, hair); line(g, ax + 3, my - 41, ax + 7, my - 33, PAL.red[3]);
    if (fase === 'lee') {
      hline(g, ax - 3, my - 29, 9, PAL.ink[1]);
      rect(g, ax + 6, my - 26, 16, 12, PAL.paper[6]); frameRect(g, ax + 6, my - 26, 16, 12, PAL.paper[2]);
      for (let i = 0; i < 4; i++) hline(g, ax + 8, my - 24 + i * 3, 11 - i, PAL.paper[1]);
    } else {
      rect(g, ax + 9, my - 18, 6, 2, PAL.ink[1]); line(g, ax + 9, my - 18, ax + 7, my - 22, PAL.metal[4]);
      rect(g, ax - 1, my - 30, 1, 1, PAL.ink[0]); rect(g, ax + 3, my - 30, 1, 1, PAL.ink[0]);
    }
  } else {
    rect(g, ax - 4, my - 13, 26, 13, card);
    ellipse(g, bx + 8, by - 5, 7, 5, skin);
    ellipse(g, bx + 4, by - 9, 5, 3, hair); line(g, bx + 1, by - 12, bx + 9, by - 9, PAL.red[3]);
    rect(g, bx + 18, by - 2, 7, 2, PAL.ink[1]);
    if (Math.floor(k * 40) % 4 < 2) drawText(g, 'z', bx + 22, by - 18, PAL.paper[4], { outline: null });
  }
  frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.paper[2]);
}

function creditsDraw(api) {
  const G = api.game, base = game.ending && game.ending.draw;
  return (g, t) => {
    if (base) base(g, t); else gradV(g, 0, 0, 320, 200, [PAL.ink[0], PAL.night[1], PAL.night[2]]);
    const e = G.ending; if (!e) return;
    const y0 = 200 - t / 1000 * (e.def.speed || 14) + (e.def.startY ?? 0);
    const im = e.lines.findIndex(l => l.t === MARCA_PLANO);
    if (im >= 0) {
      const py = Math.round(y0 + (im + 1) * LH) + 6, ph = PLANO_N * LH - 12;
      if (py < 200 && py + ph > 0) {
        try { planoAurora(g, 92, py, 136, ph, 1 - (py + ph) / (200 + ph)); } catch (err) { /* decorativo */ }
      }
    }
  };
}

/** Tarjeta fija de la fe de erratas (mínimo 6 s, luego espera al clic) y créditos. Tras los créditos, el título. */
async function feDeErratasYCreditos(api) {
  await api.tarjeta({ titulo: 'FE DE ERRATAS', lineas: FE_DE_ERRATAS, minMs: 6000 });
  await api.ending({ credits: creditos(api), draw: creditsDraw(api), music: 'm_creditos', theEnd: 'FIN' });
}

export const finalScenes = { final, epilogo: final };
export { creditos as creditosFinales };
