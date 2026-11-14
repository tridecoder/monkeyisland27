// SALA `pajarera` (en pantalla: «Despachos») — LÓGICA. Paquete P2 del plan de comedia (docs/guion2/PLAN_COMEDIA.md §4.1,
// §4.3, §5.10, §5.11, §6.3, §7.4-7.7, §8.3; ENMIENDA E1.5). El arte y la geometría están en ./art/pajarera.art.js.
// Actos I-II: Íñigo (sofá) y el Lector Medio (expositor junto a los pósits: nunca en una mesa de mando); Gervasio en su
// mesa tras la reunión (`reunion_terminada`). Acto III: Gervasio EN LA PUERTA de la Sala hasta ganarle el duelo D3 (que
// se define aquí: se muda desde office.js); luego se va al Vending.
// `puerta_sala`: Actos I-II, libre. Acto III: exige sala_abierta + ruben_libre + acta_reunion + ticket_n1; entonces entra
// en la Sala Amazonas, cuyo onEnter (P4) lanza el clímax 7.4.
// Al entrar, el Titulator anuncia la hazaña más reciente sin anunciar (§8.3), sin bloquear.
import { buildRoom } from '../lib/room.js';
import art, { salaCerrada } from './art/pajarera.art.js';
import { talk, seq, here, num } from './pecera.voces.js';
import { PAL, rect, hline, glow, ditherOverlay, label } from '../../engine/draw.js';

const I = 'inigo_sinergia', G = 'gervasio_acta', LM = 'lector_medio';
const GRABACION = 'A mí lo que me interesa es la economía. Y ahorrar.';
const acto3 = (api) => !!api.flag('acto_3_iniciado');
const gv = (api, lines) => api.sayAs(G, lines);

// ------------------------------------------------------------------ §8.3: el Titulator anuncia tus hazañas
// [clave, condición, titular]. Sale la más reciente sin anunciar (aproximamos «más reciente» con el orden de la tabla,
// que es el orden del recorrido). La clave se guarda en `pajarera_titulares_vistos`.
const HAZANAS = [
  ['torno_abierto', 'torno_abierto', 'BECARIO SE PEGA A UN ORGANIGRAMA. EL ORGANIGRAMA, EN SHOCK'],
  ['chaqueta_en_lector', 'chaqueta_en_lector', 'UN BECARIO VISTE AL LECTOR MEDIO: LA CHAQUETA QUE LO CAMBIÓ TODO'],
  ['gertrudis_saludada', 'gertrudis_saludada', 'UN JOVEN DA LAS BUENAS NOCHES A UNA CAFETERA. LA CAFETERA, VIRAL'],
  ['apagon_3', (api) => num(api, 'apagon_n') >= 3 && !api.flag('cms_vivo'), 'ALGUIEN DESENCHUFA UNA PANTALLA TRES VECES. LA PANTALLA, BLOQUEADA'],
  ['cms_vivo', 'cms_vivo', 'UN BECARIO APAGA LA REDACCIÓN DESDE EL SÓTANO. ARRIBA, NI SE ENTERAN'],
  ['reunion_terminada', 'reunion_terminada', 'UN BECARIO PREGUNTA POR LOS SIGUIENTES PASOS. HAY HERIDOS'],
  ['mercados_huido', 'mercados_huido', 'UN REDACTOR DE MERCADOS HUYE DEL VENDING. DEJA UN TÁPER Y UN VACÍO'],
  ['maripaz_perdido', (api) => num(api, 'duel:maripaz:perdido_n') >= 1, 'BECARIO LLAMA A UN COLCHÓN UN VIERNES. EL COLCHÓN NO LO COGE'],
  ['casilla_hueco', 'casilla_hueco', 'UNA COMERCIAL SE QUEDA SOLA EN UNA REUNIÓN. Y FACTURA LA SALA'],
  ['nota_gasto_presentada', 'nota_gasto_presentada', 'ADMINISTRACIÓN, EN ALERTA: UN BECARIO JUSTIFICA CON AZÚCAR'],
  ['casilla_firma', 'casilla_firma', 'UN HOMBRE QUE SOLO HABLA POR FAX SE CONTESTA A SÍ MISMO. LLORA'],
  ['pieza_recortada', 'pieza_recortada', 'ADMINISTRACIÓN RECORTA A DISTANCIA. LA CONCLUSIÓN, DESAPARECIDA'],
  ['custodia_ablandada', 'custodia_ablandada', 'UN BECARIO CONSIGUE UN BOLI. LO DEVUELVE A LOS DIEZ SEGUNDOS'],
  ['correo_evaristo_listo', 'correo_evaristo_listo', 'UN SEÑOR ANUNCIA UN CORREO. LO QUE PASÓ DESPUÉS: NADA, DE MOMENTO'],
  ['herminia_de_alta', 'herminia_de_alta', 'UNA HERRAMIENTA CONSIGUE CONTRATO EN 40 SEGUNDOS. UN BECARIO, EN SHOCK'],
];
const cumple = (api, c) => (typeof c === 'function' ? c(api) : !!api.flag(c));
function hazanaNueva(api) {
  const vistos = Array.isArray(api.flag('pajarera_titulares_vistos')) ? api.flag('pajarera_titulares_vistos') : [];
  const nueva = HAZANAS.filter(([k, c]) => cumple(api, c) && !vistos.includes(k)).pop();
  if (nueva) api.setFlag('pajarera_titulares_vistos', [...vistos, nueva[0]]);
  return nueva;
}
const GENERICOS = [
  'EL IBEX ABRE PLANO. PLANO. ¿POR QUÉ NADIE HABLA DE ESTO?',
  'UN EMPRESARIO SE HACE RICO CON ESTE SENCILLO TRUCO: HEREDAR',
  'LA PRIMA DE RIESGO SUBE TRES PUNTOS: ASÍ AFECTA A TU PERRO',
  'LOS 7 ERRORES CON TU PLAN DE PENSIONES. EL 4 ES TENER PLAN',
  '¿CUÁNTO COBRA UN BECARIO EN 2026? TE LO CONTAMOS CUANDO COBRE',
  'EL VALOR REFUGIO DE 2026: TENER PISO Y CALLARSE',
  '10 RAZONES POR LAS QUE EL PAPEL HA MUERTO. LA 7 ES LA 3 OTRA VEZ',
];

/** §8.3: al entrar, si hay una hazaña nueva, la pantalla pita y la dice sola (no bloquea). En el Acto III el atril está
 *  vacío: tras la revelación de Rubén, el titular lo dice Bruno, contagiado (§4.6); antes, se guarda para luego. */
function titularAlEntrar(api) {
  if (acto3(api) && !api.flag('ruben_encontrado')) return;
  const nueva = hazanaNueva(api);
  if (!nueva) return;
  if (!acto3(api)) { api.sfx('beep'); api.titular(nueva[2], { from: 'pantalla_titulator', blocking: false }); }
  else api.titular(nueva[2], { blocking: false });
}

// La SÚPLICA de Rubén: plano detalle de la pantalla del Titulator; el titular se rompe en «AYÚDAME / ESTOY EN EL /
// ARMARIO 27», que se queda hasta el clic (≥ 4 s). Hasta que aparece Rubén, cada Mirar par la repite.
const SUPLICA = 'AYÚDAME ESTOY EN EL ARMARIO 27';
const ROTURA_MS = 1100;
function pantallaSuplica(g, r, t) {
  const { x, y, w, h } = r;
  const roto = t >= ROTURA_MS;
  rect(g, x, y, w, h, roto ? '#2a0606' : '#06140a');
  for (let yy = y; yy < y + h; yy += 2) hline(g, x, yy, w, roto ? '#1a0404' : '#041008');
  if (!roto) {
    const k = t / ROTURA_MS;
    ['EL IBEX ABRE', 'PLANO. PLANO.', '¿POR QUÉ NADIE?'].forEach((l, i) => {
      const dx = Math.round(Math.sin(t / 37 + i * 2) * 10 * k * k);
      label(g, l, x + 10 + dx, y + 12 + i * 14, '#B6FF4D');
    });
    if (k > 0.5) for (let i = 0; i < 6; i++) ditherOverlay(g, x, y + ((i * 13 + Math.floor(t / 40) * 7) % h), w, 2, '#ff4a3a', 0.5 * k);
  } else {
    const parpadeo = (Math.floor(t / 90) % 23) === 0;
    ['AYÚDAME', 'ESTOY EN EL', 'ARMARIO 27'].forEach((l, i) => {
      label(g, l, x + w / 2 + (parpadeo ? 2 : 0), y + 10 + i * 18, i === 2 ? '#ffe0d8' : '#ff6a5a', { align: 'center', scale: 1 });
    });
    glow(g, x + w / 2, y + h / 2, w * 0.6, h * 0.5, '#ff3a30', 0.18, 3);
  }
  void PAL;
}
async function suplica(api, primera) {
  api.sfx('beep');
  api.setState('pantalla_titulator', 'ayudame');
  const lectura = 4200 * ((api.game.settings && api.game.settings.textSpeed) || 1);
  try {
    await api.detalle({ titulo: 'EL TITULATOR', texto: SUPLICA, w: 176, h: 64, color: '#ff8a7a', draw: pantallaSuplica }, async (api) => {
      await api.wait(ROTURA_MS);
      api.sfx('bad');
      await talk(api, [['T', SUPLICA, { ms: lectura, color: '#ff6a5a' }]]);
    });
  } finally { api.setState('pantalla_titulator', 'rotando'); }
  if (primera) {
    await api.say('Un titular pidiendo socorro. Con número de armario. Eso no es clickbait.');
    if (here(api, I)) await api.sayAs(I, 'Alucinaciones. Es normal en modelos tan avanzados.');
  } else {
    await api.say('Otra vez: «ARMARIO 27». Los titulares no se repiten. Las personas, sí.');
    if (here(api, I)) await api.sayAs(I, 'Sigue alucinando. Eso es que aprende.');
  }
}

async function mirarTitulator(api) {
  if (acto3(api)) {
    await api.say(['El atril está vacío. Íñigo se ha llevado el Titulator a la reunión.', 'Sin titulares, los Despachos parecen una oficina normal.']);
    return;
  }
  const n = api.inc('titulator_mirar_n');
  if (n === 3) {                                                    // paso 12: la 3.ª mirada
    await suplica(api, true);
    api.setFlag('vio_armario_27', true);
    return;
  }
  const nueva = hazanaNueva(api);
  // hasta que aparece Rubén, cada Mirar par repite la súplica (un titular recién ganado sale antes)
  if (!nueva && n > 3 && n % 2 === 0 && !api.flag('ruben_encontrado')) { await suplica(api, false); return; }
  if (nueva) { await talk(api, [['T', nueva[2]]]); return; }
  const g = num(api, 'pajarera_generico_n');
  api.setFlag('pajarera_generico_n', g + 1);
  await talk(api, [['T', GENERICOS[g % GENERICOS.length]]]);
  if (g % GENERICOS.length === 6 && api.once('pajarera_razones_repetidas')) {
    await api.say('Son nueve razones. La séptima está repetida. Escribe como un becario.');
  }
}

// ------------------------------------------------------------------ puerta de la Sala Amazonas
async function entrarSala(api) {
  if (!acto3(api)) { api.sfx('door'); await api.goto('sala_amazonas', 'pajarera'); return; }
  if (!api.flag('sala_abierta') || !api.has('acta_reunion')) {
    if (here(api, G)) await gv(api, ['Sin acta de la anterior no se abre la siguiente. Es el reglamento.', 'Se escribió en una reunión.']);
    else await api.say('OCUPADO hasta 2031. Llamar a esta puerta es pedir una prórroga.');
    return;
  }
  if (!api.flag('ruben_libre') || !api.has('ticket_n1')) {
    await api.say('Tengo el acta. Pero sin lo de Rubén, Íñigo me desapalanca.');
    return;
  }
  api.sfx('door');
  await api.goto('sala_amazonas', 'pajarera');                     // el clímax 7.4 lo lanza la Sala (P4)
}

// ------------------------------------------------------------------ paso 10 (§4.3): la chaqueta al Lector Medio
async function vestirLector(api) {
  await api.anim(api.player, 'reach', 700);
  api.sfx('pickup');
  api.setFlag('bruno_con_chaqueta', false);
  api.take('chaqueta_ramirez');
  api.setFlag('chaqueta_en_lector', true);
  api.setFlag('silla_libre', true);
  api.repaint();
  await api.say('Le pongo la chaqueta de Ramírez. Le queda mejor que a Ramírez.');
  if (here(api, I)) {
    // (Íñigo levanta la vista de los pósits. Es la primera vez.)
    api.faceActor(I, LM);
    await api.wait(600);
    await api.sayAs(I, ['...Ramírez. Ha vuelto. Y asiente.', 'Esto lo cambia todo. Lo subo a «Ideal».']);
    // (Despega un pósit beige y lo pega en la matriz.)
    await api.anim(I, 'reach', 600);
    api.sfx('paper');
    api.faceActor(I, 'down');
  }
  await api.sayAs('yoli_tendencias', '¿El Lector Medio lleva la chaqueta de Ramírez? ¡Que nadie la toque!');    // desde la Redacción
  await api.say('La silla de Ramírez queda libre. Por tradición, es mía. Por antigüedad, también.');
}

async function grabacion(api) {
  api.sfx('beep');
  await api.sayAs(LM, GRABACION);
  if (here(api, G) && !acto3(api)) await gv(api, ['Lo que diga el Lector Medio.', '...Pues ya está decidido.']);
}

// ------------------------------------------------------------------ escenas de entrada (§4.1, §4.3)
async function escenaChaqueta(api) {
  if (api.room !== 'pajarera' || !api.flag('bruno_con_chaqueta') || !here(api, I)) return;
  if (!api.once('pajarera_chaqueta_vista')) return;
  await api.cutscene(async (api) => {
    await talk(api, [[I, 'Ramírez. Bolsa. «Prescindible» desde 2019. Siéntese donde no se vea.'], ['B', 'Soy Bruno.'],
      [I, 'Entonces quítese eso. Confunde a la matriz.']]);
    api.sfx('beep');
    await talk(api, [[LM, GRABACION], [I, '¿Ve? Él sí sabe estar. Y sin chaqueta.'],
      ['B', 'Aquí manda el que asiente. Y va en mangas de camisa.']]);
    // (Bruno se la quita. Vuelve al inventario.)
    await api.anim(api.player, 'reach', 500);
    api.setFlag('bruno_con_chaqueta', false);
  });
  api.setFlag('bruno_con_chaqueta', false);
}
async function escenaViral(api) {
  await api.cutscene(async (api) => {
    await talk(api, [[I, 'Vacante. ¿Has visto el Titulator? Once mil. Viral.'], ['B', 'Lo de la cafetera fui yo.'],
      [I, 'Tú pusiste el saludo. Él puso el titular. El valor está en el titular.'],
      [I, 'Te lo apunto en verde: oportunidad. Para él.']]);
  });
}

// ------------------------------------------------------------------ §7.4-7.7: el duelo D3 · Gervasio (se muda aquí)
async function remateHidrovoltia(api, duel) {
  await api.say('«Comida de trabajo con Hidrovoltia. 312 euros». Firma: usted.');
  await api.wait(500);
  await gv(api, '...Se comió. Pero no se habló. Bueno. Se habló un poco.');
  api.take('fotocopia_nota_direccion');
  duel.setAssigned('Gervasio Acta');
}
const dueloGervasio = {
  actor: G,
  from: 'Gervasio Acta',
  subject: 'Redactar el acta de la última Reunión de Dirección',
  assigned: 'Vacante (becario)',
  assignedWin: 'Gervasio Acta',
  deck: ['R07', 'R01', 'R14', 'R03', 'R05'],
  winScore: 3,
  maxMisses: 3,
  attackText: {
    R07: 'Esto ya se... se habló. Me consta. Lo hablamos.',
    R01: 'Ya se dijo en el otro correo. Ese que no se leyó...',
    R14: 'Esto se podría ver en una reunión rápida. Que se convocaría.',
    R03: 'El acta se necesitaba para ayer. Por alguien. No digo quién.',
    R05: 'Lo del acta, entre tú y yo. Que no salga de esta puerta.',
  },
  intro: ['Mejor por escrito. Que conste que lo has pedido tú.'],
  hurt: ['Eso habría que verlo. Se verá.', 'Se toma nota. Por alguien.'],
  taunt: ['Eso se... Eso no venía a cuento. Se agradece.', 'Se toma nota. La tomas tú.'],
  wrongObject: { '*': 'Eso no es mío. Ni lo ha sido nunca. Siguiente adjunto.' },
  finishers: [
    { atScore: 3, text: 'Yo con Hidrovoltia no he comido en mi vida. Ni cenado.', object: 'fotocopia_nota_direccion',
      script: remateHidrovoltia },
  ],
  cc1: 'Sus tres móviles',
  defeatLine: 'RESPUESTA AUTOMÁTICA DE GERVASIO: «Fuera de la oficina hasta nueva acta.»',
  defeatScene: 'gervasio_derrota',
  defeatHeadline: 'UN BECARIO REDACTA UN ACTA. GERVASIO LA ARCHIVA EN "DIARIOS"',
  onWin: async (api) => {
    await gv(api, 'Diecinueve años sin un marrón. Y ahora me toca el acta.');
    // (Escribe, despacio, con la lengua fuera.)
    api.sfx('paper');
    await api.anim(G, 'reach', 900);
    await api.anim(G, 'reach', 900);
    await gv(api, ['Acuerdos de la última reunión: uno, pedir más café. Dos, ninguno más.', 'Toma. Entra tú. Se va a ver si esa máquina saluda.']);
    if (api.has('fotocopia_nota_direccion')) api.take('fotocopia_nota_direccion');
    api.give('acta_reunion');
    api.sfx('pickup');
    api.setFlag('duelo_gervasio_ganado', true);
    api.setFlag('sala_abierta', true);
    api.repaint();
    // (Se va hacia la Redacción. Más tarde, en el Vending, ante Gertrudis: P3.)
    const door = (art.layout.pajarera_a_pecera && art.layout.pajarera_a_pecera.walkTo) || [24, 110];
    await api.walkActor(G, door[0] + 4, door[1] + 2);
    api.placeActor(G, null);
  },
};
async function gervasioDerrota(api, info = {}) {
  await gv(api, '...¿Yo? Asignado a ti. El acta, digo.');
  await api.anim(api.player, 'reach', 700);                    // (Bruno escribe en la libreta, despacio.)
  if ((info.perdidos || 1) > 1) await api.say('«Acuerdos: uno, perder otro duelo». Mi segunda acta. Ya tengo archivo.');
  else await api.say('«Acuerdos: uno, perder un duelo». Ya está. Mi primera acta.');
  await gv(api, 'Un acta escrita por un becario no es un acta. Es un diario.');
}

export default buildRoom({
  id: 'pajarera',
  name: 'Despachos',                 // «Pajarera» no se enseña nunca (id interno)
  music: 'm_pajarera',
  flags: {
    pajarera_titulares_vistos: 'lista · P2 · titulares de hazaña (§8.3) ya anunciados',
    pajarera_generico_n: 'int · P2 · siguiente titular genérico del Titulator',
  },

  objects: [
    { id: 'pajarera_a_pecera', name: 'cristal de la Redacción', exit: { room: 'pecera', tipo: 'cristal' }, handlers: {
      mirar: 'Tras el cristal, la Redacción. Desde aquí parece un acuario con wifi.',
      abrir: async (api) => api.goto('pecera', 'pajarera'), usar: async (api) => api.goto('pecera', 'pajarera'),
      hablar: 'Le hago gestos al tótem del vestíbulo. Me contesta: «AQUÍ». Ya lo sé.',
      empujar: 'Empujo el cristal. Desde la Redacción parece que pido auxilio. Un poco sí.',
    } },
    { id: 'persiana', name: 'persiana', handlers: {
      mirar: 'Persiana a media altura desde 2015. Mitad transparencia, mitad no preguntes.',
      tirar: 'No. Si sube, se ve todo. Si baja, se sospecha todo.',
      abrir: 'Subirla del todo sería transparencia. Aquí eso va en otra partida.',
      cerrar: 'Bajarla del todo sería reconocer algo. No pienso reconocer nada.',
      empujar: 'Si la toco, alguien de Mercados lo interpreta como una señal.',
    } },
    { id: 'postits', name: 'pósits', handlers: {
      mirar: 'Cuatro colores. Uno por estado de ánimo. Íñigo los tiene contados.',
      coger: async (api) => (acto3(api) ? api.say('No. Íñigo los tiene contados. Por colores. Y por horas.') : api.sayAs(I, 'Eso es propiedad intelectual. Y adhesiva.')),
      usar: 'Me pego uno verde en el pecho: "Oportunidad". Nadie lo ve.',
      tirar: 'Si tiro de uno, cae la pared entera. Es una estructura muy apalancada.',
    } },
    { id: 'matriz_2x2', name: 'matriz 2x2', handlers: {
      mirar: async (api) => {
        if (api.flag('chaqueta_en_lector')) {
          await api.say(['En «Ideal», dos pósits: «VACANTE» y «RAMÍREZ (LECTOR)».', 'El empleado perfecto es un becario. El segundo, un cartón con chaqueta.']);
        } else {
          await api.say(['Matriz 2x2: COSTE contra DISPONIBILIDAD. Toda la plantilla en "Prescindible".', 'En "Ideal" hay un solo pósit: "VACANTE". Soy el empleado perfecto. No existo.']);
        }
      },
      usar: 'Me muevo de cuadrante con el dedo. El pósit vuelve solo a "Ideal".',
      coger: 'Si me quito de "Ideal", la matriz se queda sin empleado perfecto.',
      tirar: 'Tiro del pósit VACANTE. No sale. Lo ha pegado alguien con convicción.',
    } },
    { id: 'sofa', name: 'sofá', handlers: {
      mirar: async (api) => api.say(acto3(api) ? 'Un sofá blanco. Sin consultor parece todavía más caro.' : 'Un sofá blanco en el que nunca se sentó nadie. Ahora se sienta el consultor.'),
      usar: async (api) => (acto3(api) ? api.say('Me siento. Me hundo. Me levanto antes de que me lo facturen.') : api.sayAs(I, 'Este sofá es un espacio de alto valor. Tú eres bajo coste.')),
      empujar: 'Pesa como un contrato de consultoría. No se mueve sin adenda.',
      coger: 'Es de cuero blanco. Si lo toco, le dejo la huella de un sueldo bajo.',
    } },
    { id: 'pantalla_titulator', name: 'pantalla del Titulator', color: '#B6FF4D', handlers: {
      mirar: mirarTitulator,
      usar: async (api) => (acto3(api) ? api.say('No hay nada que usar. Solo el atril y un cable que se va hacia la Sala.') : api.sayAs(I, 'No toques el modelo. Se enfría.')),
      'usar:movil': 'No le hago fotos. Luego me titula: "BECARIO FOTOGRAFÍA UNA IA. LA IA, INCÓMODA".',
      hablar: async (api) => (acto3(api) ? api.say('Le hablo a un atril vacío. Contesta lo mismo que la Reunión de Dirección.') : api.say('Le pregunto quién le escribe los titulares. Parpadea. En mayúsculas.')),
      coger: async (api) => (acto3(api) ? api.say('Se lo ha llevado Íñigo. Con cuidado de que no se enfríe.') : api.sayAs(I, 'No se coge. Se licencia. Cuarenta y ocho mil al mes.')),
    } },
    { id: 'mesa_direccion', name: 'mesa grande', handlers: {
      mirar: seq([['B', 'Una mesa enorme. Encima, un informe: "Lo que quiere el Lector Medio".'], ['B', 'Lo abro. Está en blanco. Se nota que lo ha validado.']]),
      coger: '¿El informe en blanco? Es lo único validado de esta planta. Se queda.',
      abrir: 'El cajón tiene llave. La mesa, no. Aquí decide el cajón.',
      usar: 'No me siento ahí. Esa mesa tiene más cargos que yo.',
      'usar:pieza_opa': 'Si la dejo en esta mesa, la validan. En blanco.',
      hablar: 'El cartelito dice «RESERVADO». Desde 2015. Para una reunión que nunca empieza.',
    } },
    { id: 'perchero', name: 'perchero', handlers: {
      mirar: 'El perchero de los Despachos, vacío. Aquí colgada no asiente nadie.',
      'usar:chaqueta_ramirez': 'En el perchero no asiente. Encima de alguien que asiente, sí.',
      usar: 'Me cuelgo la mochila. El perchero se tambalea. No está hecho para becarios.',
      coger: 'Es el único mueble de los Despachos sin pósit. No pienso estropearlo.',
    } },
    { id: 'ordenador_gervasio', name: 'ordenador de Gervasio', handlers: {
      mirar: async (api) => leerEnviados(api),
      usar: async (api) => leerEnviados(api),
      hablar: 'Le hablo. Me contesta con una notificación: "Se verá".',
      cerrar: 'No lo cierro. Una sesión abierta aquí es lo más parecido a un acta.',
    } },
    { id: 'puerta_sala', name: 'puerta de la Sala Amazonas', exit: { room: 'sala_amazonas', tipo: 'puerta' }, handlers: {
      mirar: async (api) => {
        if (acto3(api)) await api.say('"OCUPADO – hasta 2031".');
        else if (api.flag('reunion_terminada')) await api.say('"LIBRE". Es la primera vez que lo veo.');
        else await api.say('Pantallita: "REUNIÓN EN CURSO – DESDE MARZO".');
      },
      ir: entrarSala, usar: entrarSala, abrir: entrarSala, empujar: entrarSala,
      hablar: async (api) => api.say(acto3(api) ? 'Toc, toc. Desde dentro: "Siguiente diapositiva". No era a mí.' : 'Toc, toc en el marco. Desde dentro: "Siguiente punto".'),
      cerrar: async (api) => api.say(salaCerrada(api) ? 'Cerrada por dentro. Se oye pasar una diapositiva. Muy despacio.'
        : 'Tiene una cuña desde marzo. Si la quito, alguien tendría que salir.'),
    } },
    { id: 'hoja_reservas', name: 'hoja de reservas', handlers: {
      mirar: async (api) => {
        const n = api.inc('hoja_reservas_n');
        if (acto3(api)) { await api.say(['"Reunión · Íñigo · hasta 2031". Pegado encima de lo de Ramírez.', 'Ha pisado la reserva de un hombre que no está. Eso es nivel.']); return; }
        if (api.flag('reunion_terminada') && api.once('pajarera_reservas_libre')) { await api.say('La pantallita dice LIBRE. La hoja sigue diciendo Ramírez.'); return; }
        const ROT = [
          '"Viernes, 20:59 · Seguimiento · Org.: Ramírez · recurrente".',
          'Todos los relojes marcan las 20:59. La sala es de Ramírez. Siempre.',
          '"Mercados · cinco minutitos · marzo". Sin hora de salida.',
          '"RESERVADA – Gervasio". Tachado: "RESERVADA DE VERDAD – Gervasio".',
          '"Esta anula las anteriores – Íñigo". Debajo: "Y esta, la tuya – Maripaz".',
          '"Reunión para decidir quién reserva la sala". 2.ª convocatoria.',
        ];
        await api.say(ROT[(n - 1) % ROT.length]);
      },
      coger: 'Si quito la hoja, la sala queda libre. Aquí eso es un golpe de Estado.',
      usar: 'Me apunto: "Bruno · firmar en papel · hoy". Lo tacho yo. Por si acaso.',
    } },
    { id: 'posit_evaristo', name: 'pósit azul', handlers: {
      mirar: seq([['B', 'Un pósit azul: "EVARISTO (CONTROLLING). PESADO. BAJO IMPACTO".'], ['B', 'Azul. Excusas. Íñigo le ha puesto en excusas.']]),
      coger: async (api) => (acto3(api) ? api.say('Lo dejo. Que Evaristo se entere por escrito. Le gustará.') : api.sayAs(I, 'Eso es propiedad intelectual. Y adhesiva.')),
      usar: 'Le pongo una coma al pósit: "PESADO, BAJO IMPACTO". Mejora.',
    } },
  ],

  // ---------------------------------------------------------------- PNJ
  actors: [
    { id: LM, when: '!acto_3_iniciado', murmurs: [GRABACION], handlers: {
      mirar: async (api) => {
        if (api.flag('chaqueta_en_lector')) {
          await api.say(['El Lector Medio. Cartón pluma a tamaño real. Lo encargó Marketing en 2014.', 'Con la chaqueta de Ramírez parece más medio. Y más de Bolsa.']);
        } else {
          await api.say(['El Lector Medio. Cartón pluma a tamaño real. Lo encargó Marketing en 2014.', 'Ficha: "43 años. Le interesa la economía. Y ahorrar".',
            'Aquí se le consulta todo. No ha leído nada. Siempre está de acuerdo.']);
        }
      },
      'usar:chaqueta_ramirez': vestirLector,                                   // paso 10
      'dar:chaqueta_ramirez': vestirLector,
      'usar:chicle': 'No. Ya lleva celo. Dos adhesivos en un lector es golpe de Estado.',
      hablar: grabacion,
      'dar:*': grabacion,
      empujar: 'No. Es la única autoridad de esta planta. Si se cae, se cae todo.',
      tirar: 'Si tiro, se dobla. Un lector doblado ya no se endereza.',
      coger: 'No puedo llevármelo. Es el único lector que nunca se da de baja.',
      abrir: 'Le abro el periódico. Lo tiene pintado cerrado. Lee los titulares desde fuera.',
    } },
    { id: I, when: '!acto_3_iniciado', handlers: {
      mirar: seq([['B', 'Íñigo Sinergia. Traje de dos mil euros y zapatillas de trescientos.'], ['B', 'El uniforme oficial de quien dice "disruptivo" sin mover la cara.']]),
      hablar: async (api) => api.dialog('inigo'),
      'dar:cafe': async (api) => api.sayAs(I, 'Yo solo tomo agua con gas y sinergias.'),
      'dar:tarjeta_becario': async (api) => api.sayAs(I, 'Perfecto. Con esto te doy de baja más rápido.'),
      'dar:mensaje_fp': async (api) => api.sayAs(I, '¿Un fax? Qué entrañable. Te lo pongo en la matriz: "Vintage".'),
      empujar: 'Un consultor no se empuja. Te factura el empujón y el desplazamiento.',
    },
      murmurs: ['Esto en verde. Esto en rosa. Esto en azul, que es excusa.', 'Diapositiva 248: «El viaje continúa».',
        '¿Y esto el Lector Medio lo entiende? Perfecto: asiente.'] },
    // Gervasio: Acto II en su mesa (tras la reunión); Acto III en la puerta de la Sala hasta el duelo D3 (§5.10)
    { id: G, when: (api) => (api.flag('acto_3_iniciado') ? !api.flag('duelo_gervasio_ganado') : !!api.flag('reunion_terminada')),
      pos: (view) => (view.flag('acto_3_iniciado') ? 'puerta' : 'mesa'),
      handlers: {
        mirar: async (api) => api.say(acto3(api) ? 'Gervasio, de guardia en la puerta de la Sala. Tres móviles y un reglamento.'
          : 'Gervasio, en su mesa. Tres móviles y ninguna tarea.'),
        hablar: async (api) => api.dialog('gervasio_puerta'),
        'dar:fotocopia_nota_direccion': async (api) => gv(api, ['Eso es confidencial.', 'Además, no me acuerdo de esa comida. Había vino.']),
      },
      murmurs: ['Diecinueve años. Ni un marrón. Ni uno.', 'Hoy me han preguntado tres veces por mi salud. Debo de estar fatal.'] },
  ],

  dialogs: {
    // §5.11 Íñigo (Actos I-II)
    inigo: {
      actor: I, start: 'I0',
      onStart: async (api) => { await api.sayAs(I, 'Vacante. Mi cuadrante favorito.'); },
      nodes: {
        I0: {
          options: [
            { text: '¿Qué es esa matriz?', once: true,
              do: async (api) => talk(api, [[I, 'Coste contra disponibilidad. Todo cabe: personas, emociones, el pádel.'], [I, 'Tú estás aquí. En «Ideal».'],
                ['B', '¿Y qué hay que hacer para estar en «Ideal»?'], [I, 'Nada. Literalmente. Ese es el perfil.']]) },
            { text: '¿De qué color soy yo?', once: true, reply: 'Rosa. Emociones. No te lo tomes como algo personal: es un pósit.' },
            { text: '¿El Titulator escribe solo?', once: true,
              do: async (api) => talk(api, [[I, 'Es generativo, autónomo y escalable. Y no pide vacaciones.'], ['B', '¿Y qué come?'], [I, 'Datos.'],
                ['wait', 800], [I, 'Y algo de atún. Lo estamos optimizando.']]) },
            { text: '¿Qué es eso del armario 27?', once: true, if: 'vio_armario_27',
              do: async (api) => talk(api, [[I, 'Alucinaciones. Es normal en modelos tan avanzados.'], ['B', 'Ha escrito «ayúdame».'],
                [I, 'Es un modelo muy empático. No es un armario: es un entorno de concentración.']]) },
            { text: 'Usted no ha escrito un titular en su vida, ¿verdad?', once: true,
              do: async (api) => talk(api, [[I, 'Yo no escribo, Vacante. Yo hago que las cosas estén escritas.'], ['B', 'Eso lo hace un becario.'],
                ['wait', 1200], [I, 'Siguiente pregunta.']]) },
            { text: '¿Me puede poner en otro cuadrante? Aunque sea "Caro".', once: true,
              do: async (api) => {
                await talk(api, [[I, '«Caro» es para quien tiene contrato. ¿Tienes contrato?'], ['B', 'Tengo seis convenios de prácticas.'],
                  [I, 'Entonces eres barato con antigüedad. Eso no tiene cuadrante.']]);
                await api.anim(I, 'reach', 500);              // (escribe un pósit y lo pega fuera de la matriz)
                api.sfx('paper');
                await talk(api, [[I, 'Te invento uno: «Vacante (histórico)». Enhorabuena.'], ['B', 'Primer ascenso en seis años. Hacia fuera, pero ascenso.']]);
              } },
            { text: '¿Usted va a despedir a alguien esta noche?', once: true,
              reply: ['Yo no recorto personas, Vacante.', 'Recorto la distancia entre las personas y la puerta.'] },
            { text: '¿Y si en la Reunión de Dirección dicen que no?', reply: 'El Lector Medio nunca dice que no. Lleva tres semanas asintiendo.' },
            { text: '¿Y el de Controlling?', once: true,
              reply: ['Me llama por las comas de las facturas. Le tengo en azul.', 'Excusas. Pero muy bien puntuadas.'] },
            { text: 'Me voy.', exit: true, reply: 'Perfecto. Eso libera sinergias.' },
          ],
        },
      },
    },
    // §5.10 Gervasio: en su mesa (Acto II) y en la puerta de la Sala (Acto III, con el duelo D3)
    gervasio_puerta: {
      actor: G, start: 'GV_PUERTA',
      onStart: async (api) => { await gv(api, 'Vacante. Se te iba a llamar. Por alguien. Ya se verá por quién.'); },
      nodes: {
        GV_PUERTA: {
          options: [
            { text: 'Necesito el acta de la última reunión.', if: 'acto_3_iniciado',
              do: async (api) => { await api.duel('gervasio'); return 'exit'; } },
            { text: '¿Quién decide lo del Plan Cero Papel?', once: true,
              do: async (api) => {
                if (acto3(api)) { await gv(api, 'Lo que diga el Lector Medio. Ahí dentro, asintiendo desde las seis.'); return; }
                await gv(api, 'Lo que diga el Lector Medio.');
                api.sfx('beep');
                await api.sayAs(LM, GRABACION);
                await gv(api, '...Pues ya está decidido.');
              } },
            { text: '¿Cuántos marrones lleva este año?', once: true, reply: 'Cero. Diecinueve años en cero. Es mi único dato bueno.' },
            { text: '¿Usted ha escrito alguna vez algo?', once: true,
              do: async (api) => talk(api, [[G, 'Se firmó un acuse de recibo. En 2007.'], ['wait', 900], [G, 'Fue muy duro. No se volvió a pedir.']]) },
            { text: 'Si quiere, le escribo yo el acta.', once: true,
              do: async (api) => {
                api.sfx('drop');                              // (se le iluminan los ojos; se le cae un móvil)
                await talk(api, [[G, '¿Lo harías? ¿Por escrito? ¿Con tu nombre?'], ['B', '...No. Era para ver qué cara ponía.'],
                  [G, 'Se agradece la iniciativa igual. Se archiva.']]);
              } },
            { text: 'Me voy.', exit: true, reply: 'Se verá.' },
          ],
        },
      },
    },
  },
  duels: { gervasio: dueloGervasio },
  scenes: { gervasio_derrota: gervasioDerrota, pajarera_chaqueta: escenaChaqueta },

  async onEnter(api) {
    if (api.restoring || api.flag('lector_derribado')) return;
    if (api.flag('bruno_con_chaqueta') && here(api, I)) await escenaChaqueta(api);
    else if (api.flag('cafetera_viral') && here(api, I) && api.once('pajarera_viral')) await escenaViral(api);
    titularAlEntrar(api);
  },
}, art);

async function leerEnviados(api) {
  if (here(api, G)) { await api.say('Con Gervasio delante, leerle el correo sería periodismo de investigación.'); return; }
  await api.say(['Sesión abierta. Enviados.', 'Gervasio a Teodoro: "Me consta que esto ya lo hablamos".',
    'Teodoro, por fax escaneado: "A ti te consta. A mí me consta que hablabas tú".', 'Me la apunto.']);
  api.learnReply('rep_07');
}
