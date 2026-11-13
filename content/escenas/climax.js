// PAQUETE D · CLÍMAX (biblia §7.4, P16) con los insertos de la adenda §9.4, §9.5, §9.6 (A/B) y §9.7 (orden final),
// duelo D4 de Íñigo (biblia §6.4-6.5; mazo ampliado con R15/R16 al final, adenda §7.2). Lo importa ./../rooms/sala_amazonas.js.
// Al acabar, lanza la escena del FINAL 7.5 del paquete A: api.scene('final') (si no existe, el motor solo avisa).
import { SFX, sello, fundidoBlanco } from './planta_noble.js';
import artAdmin from '../rooms/art/administracion.art.js';
import artSala, { LECTOR_AT } from '../rooms/art/sala_amazonas.art.js';
import { getFrame } from '../../engine/sprites.js';
import { PAL, rect, hline, vline, frameRect, gradV, label } from '../../engine/draw.js';
import { auricularRojo, cableRizado } from '../actors.js';

const INIGO = 'inigo_sinergia', GERV = 'gervasio_acta', LECTOR = 'lector_medio', RUBEN = 'ruben', BEGONA = 'begona_triplicado';
const EV = 'evaristo_salvedad';
const sayI = (api, t) => api.sayAs(INIGO, t);
const sayG = (api, t) => api.sayAs(GERV, t);
const sayR = (api, t) => api.sayAs(RUBEN, t);
const sayBe = (api, t) => api.sayAs(BEGONA, t);
const sayEv = (api, t) => api.sayAs(EV, t);

// staging (coordenadas de la sala; la puerta es la entrada `pajarera` del arte)
const PUERTA = [30, 118];
// (el Lector Medio está junto a la pantalla, a la derecha, y cae hacia la derecha: nadie se pone delante de él caído)
const SITIO_RUBEN = [178, 128];      // entre Íñigo y el Lector, sin tapar el cartón caído ni la pegatina
const SITIO_BEGONA = [148, 130];     // frente a Íñigo, a la izquierda del Lector caído (no lo tapa)
const SITIO_TRAS_EMPUJON = [206, 126];   // Bruno, tras el ¡PLOF!: a la izquierda del Lector caído, sin taparlo

export const DECK_D4 = ['R10', 'R12', 'R13', 'R05', 'R01', 'R07', 'R15', 'R16'];
export const PUNTOS_D4 = 4;          // 2 + remate A + 2 + remate B

/** ¿Están puestas las condiciones de entrada al clímax (P16: «Usar puerta_sala con todo»)? */
export const climaxActivo = (api) => !!(api.flag('acto_3_iniciado') && api.flag('sala_abierta') && api.flag('ruben_libre'));
/** Réplicas del mazo D4 que Bruno conoce. */
export const replicasD4 = (api) => DECK_D4.filter(r => api.knowsReply(r)).length;
const enSala = (api, id) => { const p = api.actorPos(id); return !!(p && p.room === 'sala_amazonas' && api.isVisible(id)); };

// ---------------------------------------------------------------- duelo D4
export const duelInigo = {
  actor: INIGO,
  from: 'Íñigo Sinergia',
  to: 'Todos',
  cc: 'Toda la empresa',
  subject: 'Plan Cero Papel – Llamar a la rotativa para apagarla',
  assigned: 'Vacante (perfil ideal)',
  assignedWin: 'Íñigo Sinergia',
  deck: DECK_D4,
  maxMisses: 3,
  intro: [],                          // la entrada la dice la escena (§7.4): «Perfecto. Te lo pongo por escrito.»
  hurt: ['Ese input no lo tenía en el framework.', 'Interesante. Lo pongo en azul.'],
  taunt: ['Ese input no escala.', 'Rosa. Emociones. Siguiente.'],
  finishers: [
    { atScore: 2, text: 'El Titulator es una inversión de 48.000 € al mes. Perfectamente auditada.', object: 'ticket_n1',
      wrongObject: { acta_reunion: 'Un acta. Muy analógico. Luego la leemos.' },
      script: async (api, duel) => {
        await api.say('¿Auditada por quién? Para Sistemas, tu IA es un becario. Alta: julio.');
        if (!enSala(api, RUBEN)) {
          duel.hide();
          api.sfx('door');
          api.placeActor(RUBEN, 'sala_amazonas', PUERTA[0], PUERTA[1], 'right');
          api.show(RUBEN);
          await api.walkActor(RUBEN, SITIO_RUBEN[0], SITIO_RUBEN[1]);
          api.faceActor(RUBEN, INIGO);
          duel.show();
        }
        await sayR(api, 'Hola. Soy la inversión.');
        await sayI(api, '...Eso es una alucinación.');
        await sayR(api, 'No. Es un becario. Es más barato, pero se nota.');
      } },
    { atScore: 4, text: 'Esto ya lo ha decidido la Reunión de Dirección.', object: 'acta_reunion',
      wrongObject: { ticket_n1: 'Eso ya me lo has enseñado. No escala dos veces.' },
      script: async (api) => {
        await api.say('Acta de la última reunión. Acuerdos: uno, pedir más café. Dos, ninguno más.');
        await sayG(api, 'Es la única que hay. Las demás no las escribí.');
      } },
  ],
  defeatLines: ['Asignado a Vacante. Llama tú a la rotativa. Es un perfil ideal para despedir.',
    ['player', 'Ni hablar. Lo vuelvo a intentar.']],
  onWin: async (api) => {
    api.setFlag('duelo_inigo_ganado', true);
    await sayI(api, ['Eso es un acta de hace un mes. Me da igual el acta.',
      '¡El Lector Medio lleva tres semanas asintiendo a mis diapositivas!',
      'Ni un gesto en contra. Ni una pregunta. El mejor lector que he tenido.']);
  },
  onLose: async (api) => {
    // «el duelo vuelve a empezar: Íñigo regresa a la diapositiva 247» (se reintenta Hablando con él, regla 6.2.6)
    await sayI(api, 'Siguiente.');
    if (replicasD4(api) >= PUNTOS_D4) await api.say('Le vuelvo a hablar. Un consultor siempre tiene un hueco en la agenda.');
    else await api.say('Me faltan réplicas. Tengo que cotillear más. La 247 no se va a mover.');
  },
};

async function abrirDuelo(api) {
  await api.duel('inigo');
}

// ---------------------------------------------------------------- 7.4 · entrada (con el inserto 9.4)
export async function climaxEntrada(api) {
  api.music('m_climax', 1);
  const primera = !api.flag('sala_amazonas_climax_visto');
  await api.cutscene(async () => {
    if (primera) {
      await api.wait(600);
      await sayI(api, 'Siguiente.');
      await api.wait(700);
      await sayI(api, ['Siguiente.', 'Perfecto. Como veis, la 247 tiene mucho recorrido.']);
      await api.say(['El proyector se colgó en la 247 hace tres semanas.', 'Él cree que avanza. El Lector Medio cree que asiente.']);
      await sayI(api, ['...y en la fase 3, el papel pasa a ser un recuerdo de marca.',
        '¿Vacante? Esto es una Reunión de Dirección. Los becarios no tienen voz.']);
      await api.say('Pero tienen correo.');
      await api.anim('bruno', 'reach', 500);
      await api.say('Respondo a todos.');
    } else {
      await sayI(api, 'Siguiente.');
      await api.anim('bruno', 'reach', 400);
      await api.say('Respondo a todos.');
    }
    await sayI(api, 'Perfecto. Te lo pongo por escrito.');
  });
  api.setFlag('sala_amazonas_climax_visto', true);
  await abrirDuelo(api);
}

/** Hablar a Íñigo en el clímax antes de ganar: el duelo vuelve a empezar desde 0. */
export async function climaxReintento(api) {
  await sayI(api, 'Siguiente.');
  await api.say('Respondo a todos. Otra vez.');
  await sayI(api, 'Perfecto. Te lo pongo por escrito.');
  await abrirDuelo(api);
}

// ---------------------------------------------------------------- 7.4 · Empujar al Lector Medio (orden de la adenda 9.7)
/** Dónde queda el actor del Lector Medio caído: el centro del cartón tumbado (sprite `caido` de actors.js, origen en el
 *  centro), con los pies donde estaba la base y la cabeza hacia la derecha, delante de la mesa. */
function posCaido(api) {
  const p = api.actorPos(LECTOR);
  const x0 = (p && p.room === 'sala_amazonas' && !api.flag('lector_derribado')) ? p.x : LECTOR_AT[0];
  return [Math.round(x0 + 8 + 31 * 0.95), LECTOR_AT[1] + 4];
}
/** El Lector Medio queda caído (idempotente). */
function caer(api) {
  if (api.flag('lector_derribado')) return;
  const [x, y] = posCaido(api);
  api.setFlag('lector_derribado', true);
  api.setFlag('sala_amazonas_lector_cae', 0);
  api.placeActor(LECTOR, 'sala_amazonas', x, y, 'down');
}
void artSala;
export async function climaxEmpujon(api) {
  await api.cutscene(async () => {
    // Bruno se acerca por la izquierda del Lector Medio (de perfil, mirándole) y le da un toquecito
    await api.walkTo(LECTOR);
    api.face('right');
    await api.wait(300);
    await api.anim('bruno', 'reach', 450);
    // «Se inclina. Se inclina más.» (tres fotogramas: la variante `caeN` de actors.js, por el flag local)
    api.sfx('whoosh');
    api.setFlag('sala_amazonas_lector_cae', 1); await api.wait(260);
    api.setFlag('sala_amazonas_lector_cae', 2); await api.wait(170);
    api.setFlag('sala_amazonas_lector_cae', 3); await api.wait(110);
    // ¡PLOF! de cara contra el suelo, delante de la mesa: rebota, tiembla la sala, vuelan los catorce botellines
    caer(api);
    api.sfx(SFX.plof); api.shake(500, 3);
    api.setState('botellines', 'volando');
    api.sfx(SFX.botellines);
    const [x, y] = posCaido(api);
    api.placeActor(LECTOR, 'sala_amazonas', x, y - 3, 'down'); await api.wait(90);      // rebote
    api.placeActor(LECTOR, 'sala_amazonas', x, y, 'down'); await api.wait(90);
    api.placeActor(LECTOR, 'sala_amazonas', x, y - 1, 'down'); await api.wait(70);
    api.placeActor(LECTOR, 'sala_amazonas', x, y, 'down');
    await api.wait(520);
    api.setState('botellines', 'tumbados');
    api.sfx(SFX.botellines);
    // Bruno da un paso atrás (sin tapar al Lector Medio caído ni la pegatina) y lo mira
    await api.walkTo(SITIO_TRAS_EMPUJON[0], SITIO_TRAS_EMPUJON[1]);
    api.face('right');
    await api.wait(700);
    await api.sayAs(LECTOR, 'A mí lo que me interesa es la economía. Y ahorrar.');
    await sayG(api, 'Lo que diga el Lector Medio.');
    await api.wait(1200);                                          // (silencio)
    await sayI(api, '...¿Y quién ha validado la fase 1?');
    await api.wait(1800);                                          // (silencio largo; alguien deja de teclear)
    await sayG(api, 'Diecinueve años y nadie lo había preguntado.');
    await sayI(api, 'Sin Lector Medio no hay plan. Era mi único dato.');
    await api.wait(700);                                           // saca su matriz 2x2. Se busca. Se encuentra.
    await sayI(api, ['«Prescindible. Caro.»', 'Es la primera vez que la matriz me pone en algún sitio.']);
    // adenda 9.5 · la diapositiva 248
    api.sfx('computer');
    api.setState('proyector', 'diapo_248');
    await api.wait(500);
    await api.sayFrom('proyector', 'EL VIAJE CONTINÚA');
    await sayI(api, '...Ahora no.');
    await api.say('Quedan ciento cincuenta y dos. No las verá nadie.');
    // Begoña y la factura (Rubén se la ha bajado del armario)
    api.sfx('door');
    api.placeActor(BEGONA, 'sala_amazonas', PUERTA[0], PUERTA[1], 'right');
    api.show(BEGONA);
    await api.walkActor(BEGONA, SITIO_BEGONA[0], SITIO_BEGONA[1]);
    api.faceActor(BEGONA, INIGO);
    await sayBe(api, ['Factura de Optimal Brains. 48.000 euros. Concepto: «IA».', '¿Qué es una IA? ¿Un taxi?']);
    sello(api);
    await sayBe(api, 'Rechazada. Va a la pared. Al lado del ministro.');
    // adenda 9.6 · el héroe de la coma (refuerzo opcional, A o B)
    if (api.flag('correo_evaristo_listo')) await heroeDeLaComa(api);
    else await correoQueSeEscapa(api);
    // «Goyita. Tira.» (por los altavoces, la voz de Teodoro por el teléfono rojo): un inserto en la esquina enseña
    // la Catacumba, con Teodoro al aparato, el auricular en la oreja y el cable rizado hasta el teléfono descolgado.
    api.sfx('phone');
    api.game.hud = insertoTeodoro(api.game); api.game.hudTop = 0;
    try {
      await api.wait(700);
      await api.sayAs('teodoro_cuerpodoce', 'Goyita. Tira.', { at: [INSERTO.x + (INSERTO.w >> 1), INSERTO.y + INSERTO.h + 16] });
      await api.wait(300);
    } finally { api.game.hud = null; }
    api.sfx(SFX.rotativa); api.shake(1800, 1);
    api.sfx(SFX.botellines);
    await api.wait(1400);
    if (!enSala(api, RUBEN)) { api.placeActor(RUBEN, 'sala_amazonas', SITIO_RUBEN[0], SITIO_RUBEN[1], 'up'); api.show(RUBEN); }
    api.faceActor(RUBEN, 'up');
    await sayR(api, '¿Eso que suena es el papel?');
    await api.say('Eso es el papel.');
  });
  caer(api);
  // fundido a blanco → final 7.5 (paquete A)
  const quitarBlanco = await fundidoBlanco(api, 1000);
  const [bx, by, bd] = (artAdmin.layout && artAdmin.layout[BEGONA] && artAdmin.layout[BEGONA].at) || [214, 96, 'down'];
  api.placeActor(BEGONA, 'administracion', bx, by, bd);
  if (api.game.content.scenes.final) {
    await api.fadeOut(0);
    quitarBlanco();
    await api.scene('final');
  } else {
    quitarBlanco();
    await api.scene('final');                                      // aún no existe: el motor solo avisa
  }
}

// ---------------------------------------------------------------- inserto: Teodoro al teléfono rojo, en la Catacumba
const INSERTO = { x: 6, y: 6, w: 92, h: 60 };
function insertoTeodoro(game) {
  const t0 = game.time;
  return (g) => {
    const { x, y, w, h } = INSERTO;
    const k = Math.min(1, (game.time - t0) / 180);                     // el inserto «se abre» de arriba abajo
    const hh = Math.max(2, Math.round(h * k));
    g.save();
    g.fillStyle = '#000'; g.fillRect(x - 2, y - 2, w + 4, hh + 4);
    frameRect(g, x - 1, y - 1, w + 2, hh + 2, '#e8c070');
    g.beginPath(); g.rect(x, y, w, hh); g.clip();
    // pared de la Catacumba (tabaco), zócalo verde y la mesa de Teodoro
    gradV(g, x, y, w, h, ['#5f4829', '#7a5f35', '#957845']);
    rect(g, x, y + 38, w, 8, PAL.green[2]); hline(g, x, y + 38, w, PAL.green[4]);
    rect(g, x, y + 46, w, h - 46, PAL.wood[3]); hline(g, x, y + 46, w, PAL.wood[5]);
    // cartel «ROTATIVA» y el teléfono rojo descolgado
    rect(g, x + 5, y + 22, 38, 12, PAL.paper[6]); rect(g, x + 5, y + 22, 38, 2, PAL.red[3]);
    label(g, 'GOYITA', x + 24, y + 22, PAL.red[2], { align: 'center' });
    const bx = x + 14, by = y + 44;
    rect(g, bx, by, 18, 6, PAL.red[3]); hline(g, bx, by, 18, PAL.red[5]); hline(g, bx, by + 5, 18, PAL.red[1]);
    rect(g, bx + 1, by - 2, 2, 2, PAL.red[2]); rect(g, bx + 15, by - 2, 2, 2, PAL.red[2]);
    // Teodoro (sprite del juego, a escala 1), hablando
    const a = game.actors.teodoro_cuerpodoce;
    if (a) {
      const sp = game.spriteOf(a);
      const fr = Math.floor(game.time / 160) % 3;
      const { canvas } = getFrame(sp, 'talk', 'down', fr);
      const tx = x + 62, ty = y + h + 6;                             // pies (fuera del inserto: plano medio)
      g.drawImage(canvas, Math.round(tx - (sp.ox + 1)), Math.round(ty - (sp.oy + 1)));
      const top = ty - (sp.oy - (sp.headY || 0));
      auricularRojo(g, tx - 9, Math.round(top + 5));
      cableRizado(g, tx - 8, Math.round(top + 15), bx + 17, by + 2);
    }
    label(g, 'CATACUMBA', x + 3, y - 1, '#f4e4b0');
    g.restore();
  };
}

// adenda 9.6, versión A (con `correo_evaristo_listo`)
async function heroeDeLaComa(api) {
  api.sfx('beep');
  await api.wait(500);                                             // el teléfono de conferencias: CONTROLLING
  await sayEv(api, 'Buenas noches. Una cosita. Muy pequeña.');
  await sayI(api, '¿Quién es Evaristo?');
  await sayG(api, 'El que llama. De mis tres móviles, uno es para no cogerle.');
  await sayEv(api, 'Les anuncié un correo. Lo envío ahora. Con todos en copia.');
  for (let i = 0; i < 4; i++) { api.sfx(SFX.plin); await api.wait(160); }
  api.notice('De: Evaristo Salvedad · Asunto: Una coma', { color: '#F0F0A8', ms: 2600 });
  await api.say(['«Contrato Optimal Brains. Cláusula 4: 48,000 euros al mes.»',
    '«Cláusula 12: punto de miles y coma decimal. Son 48 euros.»']);
  await sayI(api, '¡Es formato internacional! ¡Lo entiende todo el mundo!');
  await sayEv(api, ['Cláusula 13: ley española. Y lo oscuro, contra quien lo escribe.',
    'Hemos pagado cuarenta y ocho mil al mes. El contrato dice cuarenta y ocho.',
    'Cuatro meses. Nos deben 191.808 euros. Lo he revisado tres veces.']);
  await sayBe(api, 'Cuatro. La cuarta la he hecho yo.');
  await sayBe(api, '...Una cuarta copia. Esto acaba en un juzgado.');
  await sayEv(api, 'Exacto, Begoña. Esta vez, a favor.');
  await sayR(api, 'Cuarenta y ocho euros al mes... Es lo que me como en atún.');
  await sayEv(api, ['Veinticuatro bocadillos a dos euros. La única cifra que cuadraba.',
    'Con lo que nos deben hay partida para un contrato. Con coma.']);
  await sayR(api, '¿Con táper?');
  await sayEv(api, 'El táper, con ticket. Era solo eso. Buenas noches.');
  api.sfx('click');
  await api.wait(500);
  await api.sayAs(LECTOR, '...Y ahorrar.');
}

// adenda 9.6, versión B (sin `correo_evaristo_listo`)
async function correoQueSeEscapa(api) {
  api.sfx('phone');
  await api.wait(600);                                             // vibra uno de los tres móviles de Gervasio
  await sayG(api, ['Es Evaristo. Dice que nos va a escribir un correo.', 'Lo hablamos.']);
  api.sfx('click');
  await api.say('Algo importante se nos acaba de escapar. Por una coma.');
}
