// SALA `pajarera` — LÓGICA. Dueño: paquete B · «La web y el poder» (biblia §9.1). Biblia §3.5, 7.7.4, 7.7.6 (nodo
// Pajarera), 7.7.7, 8.3 (rotación del Titulator); adenda §3.4, 4.7 (Íñigo), 8.2 (rumor B paso 3), 8bis, 9.9.
// El arte y la geometría están en ./art/pajarera.art.js (artista de fondos). Ids = claves de `layout` del arte.
// Actos I-II: Íñigo (sofá) y el Lector Medio; Gervasio en su mesa con `reunion_terminada`. Acto III: vacía.
// `puerta_sala`: Actos I-II, libre. Acto III: exige sala_abierta + ruben_libre + acta_reunion + ticket_n1; entonces entra
// en la Sala Amazonas, cuyo onEnter (paquete D) lanza el clímax 7.4.
import { buildRoom } from '../lib/room.js';
import art from './art/pajarera.art.js';
import { talk, seq, here, num } from './pecera.voces.js';

const I = 'inigo_sinergia', G = 'gervasio_acta', LM = 'lector_medio';
const GRABACION = 'A mí lo que me interesa es la economía. Y ahorrar.';
const acto3 = (api) => !!api.flag('acto_3_iniciado');

// ------------------------------------------------------------------ biblia 8.3 + adenda 9.9: el Titulator
// Titulares de hazaña (G4): flag que lo activa → titular. Sale primero el más reciente sin mostrar (aproximamos «más
// reciente» con el orden de la tabla, que es el orden en que se consiguen en el walkthrough).
const HAZANAS = [
  ['torno_abierto', 'BECARIO SE PEGA A UN ORGANIGRAMA. EL ORGANIGRAMA, EN SHOCK'],
  ['chaqueta_en_lector', 'UN BECARIO VISTE AL LECTOR MEDIO: LA CHAQUETA QUE LO CAMBIÓ TODO'],
  ['gertrudis_saludada', 'UN JOVEN DA LAS BUENAS NOCHES A UNA CAFETERA. LA CAFETERA, VIRAL'],
  ['cms_vivo', 'ALGUIEN DESENCHUFA UNA PANTALLA. LO QUE PASÓ DESPUÉS TE DEJARÁ CIEGO'],
  ['reunion_terminada', 'UN BECARIO PREGUNTA POR LOS SIGUIENTES PASOS. HAY HERIDOS'],
  ['nota_gasto_presentada', 'ADMINISTRACIÓN, EN ALERTA: UN BECARIO JUSTIFICA CON AZÚCAR'],
  ['casilla_hueco', 'UN COLCHÓN SE MUDA A INTERNET. LOS EXPERTOS NO LO ENTIENDEN'],
  ['herminia_de_alta', 'UNA HERRAMIENTA CONSIGUE CONTRATO EN 40 SEGUNDOS. UN BECARIO, EN SHOCK'],
  ['custodia_ablandada', 'UN BECARIO CONSIGUE UN BOLI. LO DEVUELVE A LOS DIEZ SEGUNDOS'],
  ['correo_evaristo_listo', 'UN SEÑOR ANUNCIA UN CORREO. LO QUE PASÓ DESPUÉS: NADA, DE MOMENTO'],
];
const GENERICOS = [
  'EL IBEX ABRE PLANO. PLANO. ¿POR QUÉ NADIE HABLA DE ESTO?',
  'UN EMPRESARIO SE HACE RICO CON ESTE SENCILLO TRUCO: HEREDAR',
  'LA PRIMA DE RIESGO SUBE TRES PUNTOS: ASÍ AFECTA A TU PERRO',
  'LOS 7 ERRORES CON TU PLAN DE PENSIONES. EL 4 ES TENER PLAN',
  '¿CUÁNTO COBRA UN BECARIO EN 2026? TE LO CONTAMOS CUANDO COBRE',
  'EL VALOR REFUGIO DE 2026: TENER PISO Y CALLARSE',
  '10 RAZONES POR LAS QUE EL PAPEL HA MUERTO. LA 7 ES LA 3 OTRA VEZ',
];

async function mirarTitulator(api) {
  if (acto3(api)) {
    await api.say(['El atril está vacío. Íñigo se ha llevado el Titulator a la reunión.', 'Sin titulares, los Despachos parecen una oficina normal.']);
    return;
  }
  const n = api.inc('titulator_mirar_n');
  if (n === 3) {                                                    // G4: la 3.ª mirada, medio segundo
    api.sfx('beep');
    api.setState('pantalla_titulator', 'ayudame');                 // la pantalla lo enseña mientras dura la línea (§11)
    await talk(api, [['T', 'AYÚDAME ESTOY EN EL ARMARIO 27', { ms: 500 }]]);
    api.setState('pantalla_titulator', 'rotando');
    if (here(api, I)) await api.sayAs(I, 'Alucinaciones. Es normal en modelos tan avanzados.');
    api.setFlag('vio_armario_27', true);
    return;
  }
  const vistos = Array.isArray(api.flag('pajarera_titulares_vistos')) ? api.flag('pajarera_titulares_vistos') : [];
  const nuevo = HAZANAS.filter(([f]) => api.flag(f) && !vistos.includes(f)).pop();
  if (nuevo) {
    api.setFlag('pajarera_titulares_vistos', [...vistos, nuevo[0]]);
    await talk(api, [['T', nuevo[1]]]);
    return;
  }
  const g = num(api, 'pajarera_generico_n');
  api.setFlag('pajarera_generico_n', g + 1);
  await talk(api, [['T', GENERICOS[g % GENERICOS.length]]]);
  if (g % GENERICOS.length === 6 && api.once('pajarera_razones_repetidas')) {
    await api.say('Son nueve razones. La séptima está repetida. Escribe como un becario.');
  }
}

// ------------------------------------------------------------------ puerta de la Sala Amazonas (biblia 3.5)
async function entrarSala(api) {
  if (!acto3(api)) { api.sfx('door'); await api.goto('sala_amazonas', 'pajarera'); return; }
  if (!api.flag('sala_abierta') || !api.has('acta_reunion')) {
    await api.say('OCUPADO hasta 2031. Llamar a esta puerta es pedir una prórroga.');
    return;
  }
  if (!api.flag('ruben_libre') || !api.has('ticket_n1')) {
    await api.say('Tengo el acta. Pero sin lo de Rubén, Íñigo me desapalanca.');
    return;
  }
  api.sfx('door');
  await api.goto('sala_amazonas', 'pajarera');                     // el clímax 7.4 lo lanza la Sala (paquete D)
}

// ------------------------------------------------------------------ P04b: la chaqueta al Lector Medio
async function vestirLector(api) {
  await api.anim(api.player, 'reach', 700);
  api.sfx('pickup');
  api.take('chaqueta_ramirez');
  api.setFlag('chaqueta_en_lector', true);
  api.setFlag('silla_libre', true);
  api.repaint();
  await api.say('Le pongo la chaqueta de Ramírez. Le queda mejor que a Ramírez.');
  await api.sayAs('yoli_tendencias', '¿El Lector Medio lleva la chaqueta de Ramírez? ¡Que nadie la toque!');    // desde la Pecera
  await api.say('La silla de Ramírez queda libre. La tradición me ampara.');
}

async function grabacion(api) {
  api.sfx('beep');
  await api.sayAs(LM, GRABACION);
  if (here(api, G)) await api.sayAs(G, ['Lo que diga el Lector Medio.', '...Pues ya está decidido.']);      // 7.7.4
}

export default buildRoom({
  id: 'pajarera',
  name: 'Despachos',                 // «Pajarera» no se enseña nunca (id interno); antes «Dirección» (antesala de los
                                     // despachos que lleva a la Sala de Reuniones; la reunión sigue siendo «de Dirección»)
  music: 'm_pajarera',
  flags: {
    pajarera_titulares_vistos: 'lista · B · titulares de hazaña (8.3/9.9) ya mostrados por pantalla_titulator',
    pajarera_generico_n: 'int · B · siguiente titular genérico del Titulator (8.3)',
  },

  objects: [
    { id: 'pajarera_a_pecera', name: 'cristal de la Redacción', exit: { room: 'pecera' }, handlers: {
      mirar: 'La Pecera, a través del cristal. Desde aquí parecen peces de verdad.',
      abrir: async (api) => api.goto('pecera', 'pajarera'), usar: async (api) => api.goto('pecera', 'pajarera'),
      hablar: 'Le hago gestos a Yoli por el cristal. Me contesta con una gráfica.',
      empujar: 'Empujo el cristal. Desde la Pecera parece que estoy pidiendo auxilio.',
    } },
    { id: 'persiana', name: 'persiana', handlers: {
      mirar: 'Persiana a media altura desde 2015. Nadie sabe si sube o baja. Como el Ibex.',
      tirar: 'No. Si sube, se ve todo. Si baja, se sospecha todo.',
      abrir: 'Subirla del todo sería transparencia. Aquí eso va en otra partida.',
      cerrar: 'Bajarla del todo sería reconocer algo. No pienso reconocer nada.',
      empujar: 'Si la toco, alguien de Mercados lo interpreta como una señal.',
    } },
    { id: 'postits', name: 'pósits', handlers: {
      mirar: seq([['B', 'Pósits de cuatro colores. Amarillo, facturación. Verde, oportunidades.'], ['B', 'Rosa, emociones. Azul, excusas. El azul es el que más se gasta.']]),
      coger: async (api) => (acto3(api) ? api.say('No. Íñigo los tiene contados. Por colores. Y por horas.') : api.sayAs(I, 'Eso es propiedad intelectual. Y adhesiva.')),
      usar: 'Me pego uno verde en el pecho: "Oportunidad". Nadie lo ve.',
      tirar: 'Si tiro de uno, cae la pared entera. Es una estructura muy apalancada.',
    } },
    { id: 'matriz_2x2', name: 'matriz 2x2', handlers: {
      mirar: seq([['B', 'Matriz 2x2: COSTE contra DISPONIBILIDAD. Toda la plantilla en "Prescindible".'], ['B', 'En "Ideal" hay un solo pósit: "VACANTE". Soy el empleado perfecto. No existo.']]),
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
      hablar: async (api) => (acto3(api) ? api.say('Le hablo a un atril vacío. Es como escribir a Dirección.') : api.say('Le pregunto quién le escribe los titulares. Parpadea. En mayúsculas.')),
      coger: async (api) => (acto3(api) ? api.say('Se lo ha llevado Íñigo. Con cuidado de que no se enfríe.') : api.sayAs(I, 'No se coge. Se licencia. Cuarenta y ocho mil al mes.')),
    } },
    { id: 'mesa_direccion', name: 'mesa grande', handlers: {
      mirar: seq([['B', 'Una mesa enorme. Encima, un informe: "Lo que quiere el Lector Medio".'], ['B', 'Lo abro. Está en blanco. Se nota que lo ha validado.']]),
      coger: '¿El informe en blanco? Es lo único validado de esta planta. Se queda.',
      abrir: 'El cajón tiene llave. Como todo lo que decide algo.',
      usar: 'No me siento ahí. Esa mesa tiene más cargos que yo.',
      'usar:pieza_opa': 'Si la dejo en esta mesa, la validan. En blanco.',
      hablar: 'El cartelito dice «RESERVADO». Desde 2015. Para una reunión que nunca empieza.',
    } },
    { id: 'perchero', name: 'perchero', handlers: {
      mirar: seq([['B', 'El perchero de los Despachos. Vacío.'], ['B', 'Colgar algo aquí le quitaría autoridad a la chaqueta.']]),
      'usar:chaqueta_ramirez': 'En el perchero se vería. Encima del Lector Medio, se respetaría.',
      usar: 'Me cuelgo la mochila. El perchero se tambalea. No está hecho para becarios.',
      coger: 'Es el único mueble de los Despachos sin pósit. No pienso estropearlo.',
    } },
    { id: 'ordenador_gervasio', name: 'ordenador de Gervasio', handlers: {
      mirar: async (api) => leerEnviados(api),
      usar: async (api) => leerEnviados(api),
      hablar: 'Le hablo. Me contesta con una notificación: "Lo hablamos".',
      cerrar: 'No lo cierro. Una sesión abierta en estos despachos es lo más parecido a un acta.',
    } },
    { id: 'puerta_sala', name: 'puerta de la Sala Amazonas', exit: { room: 'sala_amazonas' }, handlers: {
      mirar: async (api) => {
        if (acto3(api)) await api.say('"OCUPADO – hasta 2031".');
        else if (api.flag('reunion_terminada')) await api.say('"LIBRE". Es la primera vez que lo veo.');
        else await api.say('Pantallita: "REUNIÓN EN CURSO – DESDE MARZO".');
      },
      ir: entrarSala, usar: entrarSala, abrir: entrarSala, empujar: entrarSala,
      hablar: async (api) => api.say(acto3(api) ? 'Toc, toc. Desde dentro: "Siguiente diapositiva". No era a mí.' : 'Toc, toc. Desde dentro: "Lo hablamos".'),
      cerrar: 'Está cerrada desde marzo. Por dentro. Como las buenas ideas.',
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
          '"RESERVADA – Dirección". Tachado: "RESERVADA DE VERDAD – Gervasio".',
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
      'usar:chaqueta_ramirez': vestirLector,                                   // P04b
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
      hablar: async (api) => {
        if (num(api, 'rumor_atun_n') === 2) {                              // adenda 8.2, rumor B paso 3
          api.setFlag('rumor_atun_n', 3);
          await api.sayAs(I, 'Es un modelo muy hambriento. Señal de calidad.');
        }
        await api.dialog('inigo');
      },
      'dar:cafe': async (api) => api.sayAs(I, 'Yo solo tomo agua con gas y sinergias.'),
      'dar:tarjeta_becario': async (api) => api.sayAs(I, 'Perfecto. Con esto te doy de baja más rápido.'),
      'dar:mensaje_fp': async (api) => api.sayAs(I, '¿Un fax? Qué entrañable. Te lo pongo en la matriz: "Vintage".'),
      empujar: 'Un consultor no se empuja. Te factura el empujón y el desplazamiento.',
    },
      murmurs: ['Esto en verde. Esto en rosa. Esto en azul, que es excusa.', 'Diapositiva 248: «El viaje continúa».',
        '¿Y esto el Lector Medio lo entiende? Perfecto: asiente.'] },
    { id: G, when: ['reunion_terminada', '!acto_3_iniciado'], handlers: {
      mirar: 'Gervasio, en su mesa. Tres móviles y ninguna tarea.',
      hablar: async (api) => api.dialog('gervasio_pajarera'),
      'dar:planillo': async (api) => api.sayAs(G, 'Eso lo coges tú. Ah, que ya lo tienes. Pues eso.'),
      'dar:fotocopia_nota_direccion': async (api) => api.sayAs(G, ['Eso es confidencial.', 'Además, no me acuerdo de esa comida. Había vino.']),
    },
      murmurs: ['Eso, en todo caso, lo hablamos.', 'Diecinueve años. Ni un marrón. Ni uno.', 'Hoy me han preguntado tres veces por mi salud. Debo de estar fatal.'] },
  ],

  dialogs: {
    // 7.7.7 Íñigo (Actos I-II) + adenda 4.7
    inigo: {
      actor: I, start: 'I0',
      onStart: async (api) => { await api.sayAs(I, 'Vacante. Mi cuadrante favorito.'); },
      nodes: {
        I0: {
          options: [
            { text: '¿Qué es esa matriz?', once: true, reply: 'Todo cabe en una matriz 2x2. Las personas, las emociones, el pádel.' },
            { text: '¿De qué color soy yo?', once: true, reply: 'Rosa. Emociones. No te lo tomes como algo personal: es un pósit.' },
            { text: '¿El Titulator escribe solo?', once: true, reply: 'Es generativo, autónomo y escalable. Y no pide vacaciones.' },
            { text: '¿Qué es eso del armario 27?', once: true, if: 'vio_armario_27',
              reply: ['Alucinaciones. Es normal en modelos tan avanzados.', 'Lo estamos analizando con todas las opciones.'] },
            { text: '¿Y si en la Reunión de Dirección dicen que no?', reply: 'El Lector Medio nunca dice que no. Lleva tres semanas asintiendo.' },
            { text: '¿Conoces a Herminia?', once: true,
              reply: ['La herramienta de Infografía. Gratis. No escala.', 'Lo que no se factura no existe. Es como un pósit sin color.'] },
            { text: '¿Y el de Controlling?', once: true,
              reply: ['Me llama por las comas de las facturas. Le tengo en azul.', 'Excusas. Pero muy bien puntuadas.'] },
            { text: 'Me voy.', exit: true, reply: 'Te tengo en la matriz.' },
          ],
        },
      },
    },
    // 7.7.6 Gervasio, nodo Pajarera
    gervasio_pajarera: {
      actor: G, start: 'GV_PAJARERA',
      onStart: async (api) => { await api.sayAs(G, 'Vacante. Te iba a llamar. Bueno, no. Lo hablamos.'); },
      nodes: {
        GV_PAJARERA: {
          options: [
            { text: '¿Quién decide lo del Plan Cero Papel?', exit: true,
              lines: [[G, 'Lo que diga el Lector Medio.'], [LM, GRABACION], [G, '...Pues ya está decidido.']] },
            { text: '¿Cuántos marrones lleva este año?', exit: true, reply: 'Cero. Diecinueve años en cero. Es mi único dato bueno.' },
          ],
        },
      },
    },
  },

  async onEnter() { /* nada de primera vez: la Pajarera no tiene escena de entrada (los avisos comunes salen solos) */ },
}, art);

async function leerEnviados(api) {
  if (here(api, G)) { await api.say('Con Gervasio delante, leerle el correo sería periodismo de investigación.'); return; }
  await api.say(['Sesión abierta. Enviados.', 'Gervasio a Teodoro: "Me consta que esto ya lo hablamos".',
    'Teodoro, por fax escaneado: "A ti te consta. A mí me consta que hablabas tú".', 'Me la apunto.']);
  api.learnReply('rep_07');
}
