// SALA `pecera` (en pantalla: «Redacción») — LÓGICA. Paquete P2 del plan de comedia (docs/guion2/PLAN_COMEDIA.md §4.1-4.3,
// §5.4, §5.5, §5.14, §5.15, §6.3; ENMIENDA E1.4-E1.8). El arte y la geometría están en ./art/pecera.art.js.
// Archivos propios: ./pecera.dialogos.js (árboles), ./pecera.escenas.js (escenas), ./pecera.voces.js (ayudas de voz),
// ./pecera.secretaria.js (Custodia).
//
// ESTADOS QUE LEE EL ARTE (la lógica pone el flag o el estado ANTES de la línea que lo comenta):
//  - pantalla_metricas: apagada con `cms_vivo`; estados de escena 'negra' (apagón), 'viral' y 'viral_baja' (§4.1).
//  - enchufe_pantalla: estado 'con_ticket' (camino antiguo: «SALVO TICKET Nº 3»). monitor_yoli: 'publicado' | 'guardando'.
//  - herminia_portatil (E1.8, 4 estados): por flags `cinta_1` → `cinta_2` (herminia_midio) → `paquete` (dos_ias_vista) →
//    `anexionada` (infografia_integrada); durante la anexión, estado explícito 'desenvuelta' / 'anexionada'.
//  - frontera_carrocero: solo recta; con `infografia_integrada`, marca de pegamento (E1.3.4).
//  - pantalla_anselmo: DENEGADO · REVOCADO con `ruben_libre` (cambia sola en N_SALIDA, E1.4.3) · OK con integrada.
//  - kanban: columna SALIDA EN VALOR con `posit_descopeado`. silla_ramirez / ordenador_bruno: `silla_libre`.
import { buildRoom } from '../lib/room.js';
import art from './art/pecera.art.js';
import dialogos from './pecera.dialogos.js';
import escenas from './pecera.escenas.js';
import { talk, seq, num, PREFIX } from './pecera.voces.js';
import { ascensorObjeto } from '../lib/ascensor.js';
import { dialogoCustodia, objetosSecretaria, flagsSecretaria } from './pecera.secretaria.js';
import { darTaper } from './cpd.js';                      // [integrador] el táper también vale con Rubén en la Redacción

const Y = 'yoli_tendencias', N = 'nerea_backlog', L = 'leoncio_quesitos', A = 'anselmo_monolito', R = 'ruben', V = 'valentin_reticula';
const ley = (...lines) => async (api) => { await api.sayAs(L, lines); };
const ans = (...lines) => async (api) => { await api.sayAs(A, lines); };

// ------------------------------------------------------------------ rumores (se quedan A y C; fuera B y D, §5.1)
async function rumorYoli(api) {
  if (num(api, 'rumor_firma_n') === 3) {                                    // A, paso 4
    api.setFlag('rumor_firma_n', 4);
    await api.sayAs(Y, 'Dicen que eres el nuevo dueño del Contable. Ya es tendencia en tu pueblo.');
  } else if (num(api, 'rumor_teodoro_n') === 1) {                           // C, paso 2
    api.setFlag('rumor_teodoro_n', 2);
    await api.sayAs(Y, 'Teodoro vive en la Redacción de papel. Empadronado. Lo dice el wifi.');
  }
}

// ------------------------------------------------------------------ §5.14: el coro, las cuatro discusiones (una sobre Diseño)
const VOCES_CORO = Object.fromEntries(Object.entries(PREFIX).map(([k, p]) => [k, { from: 'coro_desarrollo', prefijo: p }]));
const DISCUSIONES = [
  (api) => (api.flag('cms_vivo') ? [] : [['D1', '¡Se ha caído el CMS!'], ['D2', '¡Hay que levantarlo!'], ['D1', '¿Cómo?'],
    ['D2', '...Gritando más alto.'], ['D3', 'No.']]),
  [['D1', 'Ha llovido y ha bajado el tráfico.'], ['D2', '¡Abrid una incidencia a la lluvia!'], ['D1', 'La lluvia no es nuestra.'], ['D3', 'No.']],
  [['D1', '¿Quién ha puesto este margen de ocho píxeles?'], ['D2', 'Diseño.'], ['D1', '...Queda bien.'], ['D2', 'No se lo digas.']],
  [['D1', 'Internet está mal hecho.'], ['D2', 'Desde el principio.'], ['D3', '...Sí.']],
];
// «De fondo» (§5.14, VELADO): queda solo una, una vez por partida, sin comentario, sin opción y sin objeto.
const FONDO_YOLI = [[['D1', 'Le he explicado a Yoli su artículo de buscadores.'], ['D2', '¿Y?'],
  ['D1', 'Lo ha entendido a la primera.'], [Y, 'Es que lo escribí yo. Ayuda bastante.']]];
// E1.6: murmullos de Leoncio y Anselmo, como mucho UNO por visita entre los dos, en la misma cola que el coro
const MURMULLOS = [
  [L, 'Esto, en barras. Esto, en tarta. Esto, en tarta pero triste.'],
  [A, 'Esto no ha pasado por mí. Esto tampoco. Esto, de refilón.'],
  [L, 'Cuarenta y un pósits a Anselmo. Cuarenta y un "no". Serie muy estable.'],
  [A, '(al termo) Tú sí eres de la casa.'],
];
let murmuradoEstaVisita = false;
async function murmullo(api) {
  if (murmuradoEstaVisita) return;
  murmuradoEstaVisita = true;
  const [who, text] = MURMULLOS[(api.inc('pecera_murmullo_n') - 1) % MURMULLOS.length];
  await api.sayAs(who, text);
}

// ------------------------------------------------------------------ monitores de la guardia web (Mirar figurantes_web)
const MONITORES = [
  '"Pensiones: lo que debes saber si cobras, vas a cobrar o conoces a alguien".',
  '"Última hora del Ibex 35 hoy, en directo: sigue el directo del directo".',
  '"Calendario laboral 2027: todos los puentes (y cómo pedir el lunes)".',
];

// ------------------------------------------------------------------ E1.6 / E1.8: Herminia, el portátil
/** Estado de dibujo del portátil: el explícito de una escena o el que dan los flags. */
export function estadoPortatil(api) {
  const st = api.getState('herminia_portatil');
  if (st) return st;
  if (api.flag('infografia_integrada')) return 'anexionada';
  if (api.flag('dos_ias_vista')) return 'paquete';
  if (api.flag('herminia_midio')) return 'cinta_2';
  return 'cinta_1';
}
const casillas = (api) => ['casilla_hueco', 'casilla_fuente', 'casilla_firma'].filter(f => api.flag(f)).length;

async function portatilPieza(api) {
  if (!api.flag('herminia_midio')) { await api.say('Se la acerco. La pantalla parpadea. Aún no la ha leído nadie.'); return; }
  if (estadoPortatil(api) === 'paquete') { await api.say('No se puede. La han integrado en un paquete.'); return; }
  if (api.flag('pieza_recortada')) {
    await talk(api, [['H', '› pieza_opa · 23 líneas · faldón: 23 · cabe'], [L, 'Cabe. Ni ella ni yo hemos tocado nada. Mi parte favorita.']]);
  } else {
    await talk(api, [['H', '› pieza_opa · ya medida · sobra: 26 % · sin cambios'], [L, 'Medida dos veces, mismo resultado. Eso, en mi época, era un milagro.']]);
  }
}

export default buildRoom({
  id: 'pecera',
  name: 'Redacción',
  music: 'm_pecera',
  flags: {
    pecera_figurantes_n: 'int · P2 · +1 por Mirar figurantes_web (monitores)',
    pecera_sillas_n: 'int · P2 · +1 por Mirar sillas_con_chaqueta',
    pecera_pantalla_anselmo_n: 'int · P2 · +1 por Mirar pantalla_anselmo (rotación Acto II)',
    pecera_valentin_n: 'int · P2 · +1 por Hablar con Valentín (1.ª: el casco)',
    pecera_bandeja_abierta: 'bool · integrador · Abrir bandeja_diseno · arte (la bandeja de arriba, sacada)',
    pecera_murmullo_n: 'int · P2 · rotación de los murmullos de Leoncio y Anselmo',
    pecera_album_n: 'int · P2 · Nemesio N_ALBUM: «hecho» y «funeral» probados',
    ...flagsSecretaria,
  },

  objects: [
    // ---------------------------------------------------------------- salidas
    { id: 'pecera_a_vestibulo', name: 'escalera al vestíbulo', exit: { room: 'vestibulo', tipo: 'escalera' }, handlers: {
      mirar: async (api) => { await api.say(['La escalera de bajada al vestíbulo. Planta 0.', 'Abajo espera el torno. Ya no me da miedo. Un poco.']); },
      abrir: 'Es una escalera. Está abierta desde 1987. Lo cerrado es el torno de abajo.',
      usar: async (api) => api.goto('vestibulo', 'pecera'),
      cerrar: 'Una escalera no se cierra. Para eso ya está el torno, abajo.',
      empujar: 'Empujar a alguien escaleras abajo sería una salida en valor. No.',
    } },
    { id: 'pecera_a_pajarera', name: 'Despachos', exit: { room: 'pajarera', tipo: 'cristal' }, handlers: {
      mirar: async (api) => { await api.say(['Los Despachos. Cristal de arriba abajo: se ven las broncas, pero no se oyen.', 'Al fondo, la puerta de la Sala de Reuniones.']); },
      abrir: async (api) => api.goto('pajarera', 'pecera'), usar: async (api) => api.goto('pajarera', 'pecera'),
      hablar: 'Golpeo el cristal con los nudillos. Al otro lado lo apuntan en un pósit.',
      cerrar: 'Ya está cerrada. En los Despachos las puertas no se cierran: se delegan.',
    } },
    { id: 'pecera_a_office', name: 'Vending', exit: { room: 'office', tipo: 'arco' }, handlers: {
      mirar: 'El Vending. Un arco sin puerta: se ve la máquina y a Gertrudis. Ahí vive ella.',
      cerrar: 'No tiene puerta. Gertrudis no necesita puertas: necesita público.',
      abrir: async (api) => api.goto('office', 'pecera'), usar: async (api) => api.goto('office', 'pecera'),
      hablar: '¡Buenas noches, Gertrudis! No contesta. Habrá que decírselo a la cara.',
    } },
    { id: 'pecera_a_catacumba', name: 'Redacción de papel', exit: { room: 'catacumba', tipo: 'puerta_doble' }, handlers: {
      mirar: async (api) => { await api.say(['La Redacción de papel. Misma planta, otro siglo.', 'El umbral de latón es la frontera. Nadie lo pisa sin motivo.']); },
      abrir: 'Está abierta de par en par. Desde 1994. Nadie se atreve a cerrarla.',
      cerrar: 'Si cierro esa puerta, Teodoro lo publica en la página 7.',
      usar: async (api) => api.goto('catacumba', 'pecera'),
      hablar: '"¿Hola?" Me contesta un fax. Dentro de un rato.',
      empujar: 'Está abierta. Empujarla sería meterme en la guerra fría a traición.',
    } },
    ...objetosSecretaria,
    { id: 'directorio_planta', name: 'directorio de la planta', handlers: {
      mirar: seq([['B', 'Directorio de la planta 1: Despachos, Vending, Secretaría, Papel y Redacción.'], ['B', 'Un punto rojo: «ESTÁ AQUÍ». Es la primera vez que algo me ubica.']]),
      usar: 'Busco «becario» en la lista. No sale. Será que va dentro de «Redacción».',
      empujar: 'No se mueve. Es lo único de esta planta que está donde dice que está.',
      coger: 'Es un tótem. Se consulta, no se adopta.',
    } },
    ascensorObjeto('ascensor_pecera', {
      mirar: 'El ascensor. Espejo, moqueta y un cartel: «8 personas o 1 consultor».',
      cerrar: 'Se cierra solo. Despacio, para que dé tiempo a arrepentirse.',
      empujar: 'Pulso el botón. Viene enseguida. Me emociono un poco. No estoy acostumbrado.',
      tirar: 'Tiro de la puerta del ascensor. No cede. Pulso el botón, avergonzado.',
      hablar: '«¿Sube o baja?». Hace «tin». Es la conversación más clara de la planta.',
    }),
    { id: 'pecera_a_ecosistema', name: 'escalera a la planta 2', exit: { room: 'ecosistema', tipo: 'escalera' }, handlers: {
      mirar: 'Escalera a la planta 2. La moqueta engorda dos centímetros: ahí está el dinero.',
      usar: async (api) => api.goto('ecosistema', 'pecera'),
      hablar: '"¿Hay alguien arriba?" Me contesta un gong. Eso es que sí.',
      empujar: '¿Empujar una escalera? Tengo un máster, pero no de eso.',
    } },

    // ---------------------------------------------------------------- WEB
    { id: 'figurantes_web', name: 'redactores',
      murmurs: ['"Lo siento muchísimo. ¿Y la plaza?" ...No, así no.', '"Era un gran compañero. Aparcaba de lujo".', '"Mi más sentido pésame. Y mi matrícula, por si acaso".'],
      handlers: {
        mirar: async (api) => {
          const n = api.inc('pecera_figurantes_n');
          if (n === 1) await api.say('Dos redactores. Teclean desde las tres. Uno escribe "pensiones" en bucle.');
          else if (n === 2) await api.say('Los dos únicos que quedan. Están de guardia. Lo demás son chaquetas.');
          else await api.say(['En sus pantallas:', MONITORES[(n - 3) % MONITORES.length]]);
        },
        hablar: 'Ni me miran. Están en directo desde 2020.',
        coger: 'No se cogen. Son la guardia. Si me llevo uno, la web cae a la mitad.',
        empujar: 'Ni se inmutan. Llevan en directo desde las tres: un empujón no es noticia.',
        'dar:cafe': 'Les dejo el café al lado. Lo titulan sin mirarlo: "Café, en directo".',
      } },
    { id: 'sillas_con_chaqueta', name: 'sillas con chaqueta', handlers: {
      mirar: async (api) => {
        if (api.inc('pecera_sillas_n') === 1) await api.say(['Sillas vacías con chaqueta. Se fueron a las seis y media.', 'La chaqueta ficha por ellos.']);
        else await api.say('Pantallas encendidas, sillas vacías. Si llama alguien, contesta la chaqueta.');
      },
      usar: 'Son de Mercados. Una silla no cambia de sección sin reunión previa.',
      coger: 'Esa chaqueta está fichando. Si la quito, a su dueño le ponen falta.',
      empujar: 'Giran. Las chaquetas, no. Tienen más arraigo que yo.',
      'usar:chaqueta_ramirez': 'Una chaqueta más no se notaría. Ese es el problema: busco que se note.',
    } },
    { id: 'pantalla_metricas', name: 'pantalla de métricas', handlers: {
      mirar: async (api) => api.say(api.flag('cms_vivo')
        ? 'Apagada. La Redacción trabaja a ciegas. Y publica. Lo apunto como mío.'
        : 'Lectores concurrentes: 3.418. Se refresca cada segundo. Igual que Yoli.'),
      usar: 'No sé usarla. Ni ella a mí.',
      hablar: async (api) => api.say(api.flag('cms_vivo')
        ? 'Le hablo. Está apagada. Es la primera vez que no me contesta con una cifra.'
        : '"¿Me lees?" Baja a 3.417. Creo que se ha ido el que me leía.'),
      tirar: 'Está atornillada a la pared. Es lo único fijo de esta planta.',
      empujar: 'Ni la toco. Se refresca cada segundo: me vería venir.',
    } },
    { id: 'monitor_yoli', name: 'monitor de Yoli', handlers: {
      mirar: async (api) => {
        if (api.flag('cms_vivo')) await api.say('El monitor de Yoli: «PUBLICADO». Y otra. Y otra. Ella no se fía.');
        else await api.say('El monitor de Yoli. El CMS dice «GUARDANDO BORRADOR» desde las cuatro.');
      },
      usar: async (api) => api.sayAs(Y, '¡Quieto! Si lo tocas, igual se guarda. Y entonces qué hago.'),
      coger: 'Es el monitor de Yoli. Separarla de él sería un despido.',
    } },
    { id: 'enchufe_pantalla', name: 'enchufe', handlers: {
      mirar: async (api) => {
        await api.say(['Cinta: «NO DESENCHUFAR». Y una brida que baja por la pared.', 'Etiqueta de la brida: «R-3, SISTEMAS. PACO».']);
        if (api.getState('enchufe_pantalla') === 'con_ticket') await api.say('Debajo, a rotulador, la excepción de Nemesio. Con número.');
      },
      tirar: async (api) => {
        if (api.flag('cms_vivo')) { await api.say('Ya está fuera. Y el CMS, dentro. Que siga así.'); return; }
        if (api.flag('vio_ticket_3')) { await api.scene('pecera_cms_vivo'); return; }   // camino antiguo
        await api.scene('pecera_apagon');                                                  // §4.2, la escalada
      },
      empujar: async (api) => api.say(api.flag('cms_vivo')
        ? 'Ni hablar. Nueve años esperando a que alguien la desenchufara.'
        : 'Ya está enchufado. Lo dicen la cinta, el cable y Nemesio con la mirada.'),
      usar: 'Enchufar algo más aquí sería pedirle demasiado a esa pantalla. Y a la regleta.',
      coger: 'La cinta dice NO DESENCHUFAR. No dice NO COGER. Pero se sobreentiende.',
    } },
    { id: 'taza_abandonada', name: 'taza abandonada', handlers: {
      mirar: 'Una taza con costra de café de la crisis de la deuda. Debería cotizar.',
      coger: 'Es de alguien. O de algo que ahora vive en ella.',
      usar: 'Beber de ahí sería datar la crisis con carbono 14.',
      'usar:cafe': 'Echarle café nuevo a esa taza es reabrir la crisis de la deuda.',
      empujar: 'La empujo. No se mueve: la costra la tiene soldada a la mesa.',
    } },

    // ---------------------------------------------------------------- INFOGRAFÍA (E1: Leoncio y su mesa se quedan)
    { id: 'mesa_dibujo', name: 'mesa de dibujo', handlers: {
      mirar: 'Una mesa de dibujo inclinada. Tiene polvo con forma de regla.',
      usar: 'Dibujo un quesito. El portátil de al lado lo corrige en una décima.',
      empujar: 'Está inclinada desde 2024. Si la enderezo, Leoncio me pide el gráfico.',
    } },
    { id: 'herminia_portatil', name: 'Herminia (portátil)', color: '#FF8C3C', handlers: {
      mirar: async (api) => {
        const st = estadoPortatil(api);
        if (st === 'anexionada' || st === 'desenvuelta') await api.say('Sin cinta. Pegatina nueva: «DESARROLLO». Los gráficos, idénticos.');
        else if (st === 'paquete') await api.say(['Envuelta entera. «PENDIENTE DE INTEGRAR».', 'Por un hueco, la pantalla trabaja.']);
        else if (st === 'cinta_2') await api.say('Dos tiras de cinta. Por debajo, la pantalla sigue haciendo gráficos.');
        else await api.say('Herminia. Un portátil con pegatina «INFOGRAFÍA». Y una tira de cinta encima.');
      },
      usar: async (api) => {
        const st = estadoPortatil(api);
        if (st === 'paquete') { await api.say('No se puede. La han integrado en un paquete.'); return; }
        if (st === 'anexionada') { await talk(api, [['H', '› propietario: Desarrollo · cambios en los gráficos: 0']]); return; }
        await talk(api, [['H', '› quesito de Desarrollo · suma: 130 % · corrección: bloqueada'],
          [L, 'Ella lo arreglaría en una décima. No la dejan. Él lo publica.']]);
      },
      hablar: async (api) => {
        if (estadoPortatil(api) === 'paquete') { await api.say('Le digo hola al paquete. Por el hueco, una barra sube un poco.'); return; }
        await talk(api, [['H', '› saludo recibido · hola: 100 %'], ['B', 'Un gráfico de un saludo. Me ha entendido.']]);
      },
      'usar:ficha_pagina_7': async (api) => {
        const n = casillas(api);
        await talk(api, [['H', `› ficha página 7 · casillas hechas: ${n} de 3 · semáforo: ${n >= 3 ? 'verde' : n ? 'ámbar' : 'rojo'}`]]);
      },
      'usar:pieza_opa': portatilPieza,
      coger: ley('Herminia no sale de esta mesa. Fuera está Anselmo.'),
      cerrar: ley('Ni se te ocurra. Con nombre de persona no se la apaga.'),
      tirar: async (api) => {
        if (api.flag('infografia_integrada')) await api.say('Ya no tiene cinta de la que tirar. Solo una pegatina nueva.');
        else await api.sayAs(A, '¡Eh! Eso es infraestructura.');
      },
    } },

    // ---------------------------------------------------------------- ECONOMÍA: mesas de Bruno y Ramírez
    { id: 'ordenador_bruno', name: 'mi ordenador', handlers: {
      mirar: async (api) => {
        if (!api.flag('silla_libre')) { await api.say('Mi ordenador. Escribo de pie desde 2020. Para leer el correo necesito silla.'); return; }
        if (!api.flag('rep_11')) {
          await api.say(['Con silla, el correo se ve. Bandeja de entrada. Un hilo de 2019.', 'Ramírez: "Quedo a la espera de tus comentarios".',
            'Respuesta: "Espera sentado. Si encuentras silla". Me la apunto.']);
          api.learnReply('rep_11');
          await api.say(['Y una autorrespuesta de Rubén, de Sistemas:', '"Estoy fuera de la oficina desde julio".', '"Bueno, fuera no. Dentro. Muy dentro".']);
        } else {
          await api.say(['Bandeja de entrada. Ramírez sigue a la espera de mis comentarios.', 'Y Rubén sigue fuera de la oficina. Bueno, dentro. Muy dentro.']);
        }
      },
      usar: async (api) => {
        if (!api.flag('silla_libre')) { await api.say('Sin silla no hay ordenador. Lo dice la ergonomía y lo dice Begoña.'); return; }
        if (api.flag('pieza_escrita')) { await api.say('Ya está escrita. Si la toco más, le salen adjetivos.'); return; }
        if (!api.flag('casilla_fuente')) { await api.say('Abro un documento en blanco. Me mira. Sin fuentes no escribo.'); return; }
        // paso 32
        await api.anim(api.player, 'reach', 400);
        api.sfx('typewriter');
        await api.wait(900);
        api.give('pieza_opa');
        api.setFlag('pieza_escrita', true);
        await api.say(['Lo escribo fuera del CMS: ahí dentro vive el Titulator.', 'Treinta y una líneas. Sin adjetivos. Bueno, con uno.']);
        if (!api.flag('herminia_midio')) await api.scene('pecera_herminia_mide');           // E1.4.1
      },
      'usar:cafe': async (api) => api.say(['Tentador. Pero el teclado de al lado ya lo probó en 2017.', 'Sigue escribiendo en negrita.']),
      'usar:pieza_opa': 'Ya está escrita. Ahora le faltan hueco, fuente y firma. Y papel.',
      hablar: 'Le susurro "papel". Se le acelera el ventilador. Le ha dado miedo.',
      coger: 'Es del Contable. Lo pone una pegatina. Con mi nombre mal escrito.',
      cerrar: 'Lo cierro. Cuatro mil ciento doce piezas me miran desde el escritorio.',
    } },
    { id: 'silla_ramirez', name: 'silla de Ramírez', handlers: {
      mirar: async (api) => {
        if (!api.flag('chaqueta_cogida')) await api.say(['La única silla libre. Tiene una chaqueta: Ramírez, el de Bolsa.', 'Bajó a desayunar en 2019. No ha vuelto.']);
        else await api.say('Una silla. Libre. Me tiembla algo que no sabía que tenía.');
      },
      usar: async (api) => {
        if (!api.flag('chaqueta_cogida')) await api.say('No. Chaqueta en silla es propiedad privada. Lo sabe todo el mundo.');
        else if (api.flag('bruno_con_chaqueta')) await api.say('Si me siento con su chaqueta, la silla sigue siendo suya. Y yo, encima.');
        else if (!api.flag('silla_libre')) await api.say('Si me siento con su chaqueta en la mano, Ramírez vuelve. Es tradición.');
        else if (api.once('pecera_silla_arrimada')) { api.sfx('step'); await api.say('La arrimo a mi mesa. Primera silla en seis años. Huele a 2019.'); }
        else await api.say('Me siento. Me levanto. Me vuelvo a sentar. Es que puedo.');
      },
      coger: 'Las sillas no se cogen. Se heredan. Y Ramírez sigue desayunando.',
      empujar: 'Tiene ruedas. Se mueve dos centímetros y vuelve. Echa de menos a Ramírez.',
      'usar:chaqueta_ramirez': 'Si la vuelvo a colgar, la silla vuelve a ser de Ramírez. Y yo, de pie.',
    } },
    { id: 'chaqueta_ramirez_hotspot', name: 'chaqueta beige', when: '!chaqueta_cogida', handlers: {
      mirar: 'Chaqueta beige de entretiempo. Del bolsillo asoma un sobre de azúcar.',
      coger: async (api) => {                                                // paso 9
        await api.sayAs(Y, ['¡Quieto! Una chaqueta en una silla es propiedad.', 'Si la quitas, que sea para dejarla en un sitio con más autoridad.']);
        await api.anim(api.player, 'reach', 500);
        api.sfx('pickup');
        api.give('chaqueta_ramirez');
        api.give('sobre_azucar');
        api.setFlag('chaqueta_cogida', true);
        api.repaint();
        await api.say('Del bolsillo cae un sobre de azúcar. Me lo quedo. Todo aquí es de 2019.');
      },
      usar: 'No me la pongo aún. Primero la descuelgo. Hay un orden.',
      tirar: 'Tiro un poco. Cruje. Hace siete años que nadie la mueve.',
      hablar: '"¿Ramírez?" La chaqueta no contesta. Igual que Ramírez desde 2019.',
    } },

    // ---------------------------------------------------------------- DESARROLLO y DISEÑO Y PRODUCTO
    { id: 'frontera_carrocero', name: 'cinta de carrocero', handlers: {
      mirar: async (api) => {
        if (api.flag('infografia_integrada')) await api.say('Ya no hay cinta. Queda la marca del pegamento.');
        else await api.say('Cinta de carrocero en el suelo. La frontera de Desarrollo. Recta, de momento.');
      },
      tirar: async (api) => {
        if (api.flag('infografia_integrada')) await api.say('Ya no queda de qué tirar. Solo pegamento con nostalgia.');
        else await api.sayAs(A, '¡Eh! Eso es infraestructura.');
      },
      coger: 'Si me llevo un trozo, Anselmo me reclama soberanía.',
      'usar:chicle': 'No. Un chicle en una frontera es un tratado.',
      'usar:chaqueta_ramirez': 'Si la dejo en la frontera, Anselmo la envuelve. Y Ramírez no vuelve.',
      empujar: 'La piso. Anselmo me mira el zapato como a un paquete sin declarar.',
    } },
    { id: 'cartel_frontera', name: 'cartel de la frontera', handlers: {
      mirar: seq([['B', '"DESARROLLO · A PARTIR DE AQUÍ, SOLO CÓDIGO PROPIO".'], ['B', 'Debajo, a boli: "Y café propio".']]),
      coger: 'Es un cartel de frontera. Si me lo llevo, me convierto en contrabando.',
      empujar: 'Se tambalea y vuelve. La política de integración, igual.',
    } },
    { id: 'pantalla_anselmo', name: 'pantalla de Anselmo', handlers: {
      mirar: async (api) => {
        const n = api.inc('pecera_pantalla_anselmo_n');
        if (api.flag('infografia_integrada')) await api.say('"ACCESO CONCEDIDO: HERMINIA (DESARROLLO)". Lo de Infografía, tachado.');
        else if (api.flag('ruben_libre')) await api.say('"ACCESO REVOCADO: TITULATOR 3000". Con fecha de hoy. Y de julio.');
        else if (api.flag('acto_2_iniciado') && n >= 2) {
          await api.say(n % 2 === 0 ? 'Un gráfico de Desarrollo en la sección de Infografía: un quesito que suma 130 %.' : '"Lectores por continente". Gana la Antártida, con un 40 %.');
        } else await api.say(['"ACCESO DENEGADO: HERMINIA (INFOGRAFÍA)".', 'Debajo: "ACCESO CONCEDIDO: TITULATOR 3000 (USUARIO INTERNO)".']);
      },
      usar: ans('Esa sesión es mía. Hasta el salvapantallas pasó revisión.'),
      hablar: 'Le pregunto por Herminia. Me pide credenciales. Las de Anselmo.',
    } },
    { id: 'coro_desarrollo', name: 'coro de Desarrollo', color: '#7FFFD4', defaultVerb: 'hablar', handlers: {
      mirar: seq([['B', 'Tres espaldas de Desarrollo. Se les ven las manos.'], ['B', 'Las manos están enfadadas.']]),
      hablar: async (api) => api.dialog('coro'),
      'dar:cafe': seq([['CORO', '¿De quién es?'], ['B', 'De Gertrudis.'], ['D1', 'Café de fuera.'], ['D3', 'No.']]),
      empujar: 'La silla gira. Su dueño sigue gritando. No se ha dado cuenta.',
      coger: seq([['D3', 'No.']]),
      'dar:*': seq([['D1', '¿Eso quién lo ha hecho?'], ['D2', 'Alguien de fuera.'], ['D3', 'No.']]),
    } },
    { id: 'semaforo_ruido', name: 'semáforo de ruido', state: 'rojo', states: ['rojo', 'ambar', 'verde'], handlers: {
      mirar: seq([['B', 'Semáforo de ruido de Prevención. Rojo.'], ['B', 'Pósit de Nemesio: "Verde: 14 de agosto. Estaban de vacaciones".']]),
      usar: 'Lo toco. Se pone más rojo. Existe un rojo más rojo.',
      tirar: async (api) => api.sayAs(N, 'No. Es lo único que les mide sin que se enfaden.'),
      hablar: '"Shhh", le digo. Es la primera vez que alguien le da la razón.',
      coger: 'Si me lo llevo, Desarrollo deja de hacer ruido oficialmente. No sería verdad.',
    } },
    { id: 'taza_no', name: 'taza «NO»', handlers: {
      mirar: 'Una taza que pone "NO". Es de la tercera espalda. La define.',
      coger: seq([['D3', 'No.']]),
      usar: seq([['D3', 'No.']]),
      'usar:cafe': seq([['B', 'Le sirvo un poco de café.'], ['D3', '...No.'], ['B', 'Pero se lo bebe.']]),
    } },
    { id: 'bandeja_diseno', name: 'bandeja de Diseño y Producto', handlers: {
      mirar: seq([['B', 'Una bandeja: "ENTREGAS DE DISEÑO Y PRODUCTO". Llena hasta arriba.'], ['B', 'Todo con fecha y a su hora. Desde Desarrollo no la abre nadie.']]),
      abrir: async (api) => {
        api.sfx('paper');
        api.setFlag('pecera_bandeja_abierta', true);      // solo el dibujo (fuera el flag cruzado bandeja_diseno_abierta, §3.4)
        await api.say(['«Entregado a las 18:29». Y al fondo, de 2017, una hoja con una flecha.', '«La pantalla tumbará el CMS». Sello: «LEÍDO (PERO NO)».']);
      },
      coger: async (api) => api.sayAs(N, 'Déjala. Es lo único ordenado del rincón. Y no es nuestro.'),
      cerrar: 'Ya está cerrada. Es una bandeja: lo suyo es que alguien la abra.',
      'usar:pieza_opa': 'No. Si la dejo aquí, la leen en 2033. Con sello de LEÍDO (PERO NO).',
    } },
    { id: 'kanban', name: 'tablero kanban', handlers: {
      mirar: async (api) => {
        const lines = ['Columnas: POR HACER, EN CURSO, BLOQUEADO, HECHO y HECHO (PERO NO).'];
        if (api.flag('posit_descopeado')) lines.push('Y una nueva, a rotulador: SALIDA EN VALOR. Dentro, el pósit de Rubén.');
        else if (api.flag('acto_3_iniciado')) lines.push('En POR HACER, desde julio: "Baja becario Rubén".');
        await api.say(lines);
      },
      coger: async (api) => api.sayAs(N, 'Ni se te ocurra. Un pósit solo sale del tablero hecho o muerto.'),
      empujar: 'Tiene ruedas. Lo empujo un palmo y Nemesio lo devuelve a su sitio con la mirada.',
      tirar: 'Si tiro, se caen los pósits. Y Nemesio me pone en BLOQUEADO.',
      usar: 'Me escribo un pósit: "Firmar en papel". Lo pego en POR HACER. Desde hoy.',
    } },
    { id: 'posit_1998', name: 'pósit amarillísimo', handlers: {
      mirar: seq([['B', 'Un pósit amarillísimo: "Contratar al becario de marzo – 1998".'], ['B', 'Está en HECHO (PERO NO). Nadie lo hizo.']]),
      coger: async (api) => api.sayAs(N, 'Ni se te ocurra. Un pósit solo sale del tablero hecho o muerto.'),
      usar: 'No lo muevo. En HECHO (PERO NO) se está calentito.',
    } },
    { id: 'calendario_ferreteria', name: 'calendario de ferretería', handlers: {
      mirar: seq([['B', 'Calendario de Ferretería Hermanos Tornillo. Nemesio solo se fía de este.'], ['B', 'Trae santoral, fases de la luna y una oferta de tacos del 8.']]),
      tirar: async (api) => api.sayAs(N, '¡Quieto! Es la única fuente fiable de este departamento.'),
      coger: 'Si me lo llevo, Nemesio no sabría en qué día vive.',
      abrir: 'Lo hojeo. En diciembre regalan una llave inglesa. Hay que llegar a diciembre.',
    } },
    { id: 'ventana', name: 'ventana', handlers: {
      mirar: 'Ahí fuera hay un mundo real. Sin contador de lectores. Qué descanso.',
      abrir: 'No se abre. El aire acondicionado lo consideraría una amenaza.',
      cerrar: 'Las ventanas de oficina se abren una vez: para la foto de inauguración.',
      usar: 'Pego la frente al cristal. La ciudad sigue ahí. No se ha enterado del cierre.',
    } },
  ],

  // ---------------------------------------------------------------- PNJ
  actors: [
    { id: Y, handlers: {
      mirar: 'Yoli, audiencias. Le tiembla el párpado al ritmo de la gráfica.',
      hablar: async (api) => {
        await rumorYoli(api);
        if (!api.flag('cms_vivo')) {
          await api.sayAs(Y, ['Bruno, Bruno becario, becario sin silla... Ahora no. Se nos cae el CMS.',
            'Vuelve con un titular con número. El siete. El siete convierte.']);
          return;
        }
        await api.dialog('yoli');
      },
      'dar:cafe': async (api) => api.sayAs(Y, '¿Café? Llevo cuatro. El quinto lo mido.'),
      'dar:ficha_pagina_7': seq([[Y, '¿Una ficha de papel? ¿Tiene palabra clave?'], ['B', 'Tiene casillas.'], [Y, 'Qué vintage.']]),
      'dar:pieza_opa': async (api) => api.sayAs(Y, '¿Sin número en el titular? ¿Sin "lo que nadie te cuenta"? Valiente.'),
      'dar:album_eventos': async (api) => api.sayAs(Y, ['¿Fotos de eventos? Eso no lo ve nadie.', 'Bueno. Uno. El del fondo.']),
    },
      murmurs: ['Esto sube — 3.402 — esto baja — 3.398 — esto soy yo.', 'Busco "el Contable" y salen gestorías. Nos ganan. Tienen horario.'] },
    { id: N, when: '!lector_derribado', handlers: {
      mirar: 'Nemesio, Desarrollo. Mueve pósits con precisión de cirujano.',
      hablar: async (api) => api.dialog('nerea'),
      'dar:album_eventos': async (api) => api.dialog('nerea', 'N_ALBUM_INTRO'),
    },
      murmurs: ['Esto a POR HACER. Esto a BLOQUEADO. Esto a la basura, pero con cariño.', 'Mañana es sábado. Lo dice la ferretería.',
        'No hay urgentes. Hay POR HACER escrito más fuerte.'] },
    { id: R, when: ['ruben_libre', '!lector_derribado'], handlers: {
      mirar: 'Rubén mira por la ventana. Espera al sol como quien espera una nómina.',
      hablar: async (api) => {
        // E1.5 (si ya lo oyó desde el armario, cpd.js `cpd_ruben_oyo_alta`, no lo pregunta otra vez)
        if (api.flag('herminia_de_alta') && !api.flag('cpd_ruben_oyo_alta') && api.once('pecera_ruben_herminia')) {
          await talk(api, [[R, '¿A ella le dieron el alta en cuarenta segundos?'], ['B', 'Es una herramienta.'], [R, 'Yo también. Pero sin pegatina.']]);
        }
        await api.sayAs(R, 'Estoy esperando a que salga el sol. Me han dicho que existe.');
      },
      'dar:cafe': async (api) => api.sayAs(R, 'Gracias. Es lo primero caliente desde julio. Sin contar el armario.'),
      'dar:ticket_n1': async (api) => api.sayAs(R, 'Guárdalo tú. Si lo toco, me vuelvo a dar de alta.'),
      'dar:taper_huerfano': darTaper,
    },
      murmurs: ['AMANECER DETECTADO. LO QUE PASÓ DESPUÉS... Perdón. Aún no ha salido.', '¿El sol también va con ticket?'] },
    // §5.14: Valentín Retícula, cameo MUDO junto a la bandeja (fuera de 7.2, epílogo y créditos)
    { id: V, when: '!lector_derribado', handlers: {
      mirar: async (api) => api.say('Valentín Retícula, de Diseño y Producto. Cascos puestos. Sin música.'),
      hablar: async (api) => {
        if (api.inc('pecera_valentin_n') === 1) {
          await api.say('¿No le molesta que le culpen de todo?');
          await api.anim(V, 'reach', 500);                 // (se quita un casco; mira a Bruno; espera)
          await api.wait(1400);
          await api.say('...Nada. Perdone.');
          await api.anim(V, 'reach', 400);                 // (se lo vuelve a poner)
        } else await api.sayAs(V, 'Está en la bandeja.');
      },
      'dar:*': 'Se lo dejo en la mesa. Lo alinea con el borde sin mirarlo.',
      empujar: 'No. Está trabajando. Si le empujo, se le mueve un píxel. Y lo nota.',
      tirar: 'No le tiro de la americana. Es de buen corte. Hasta yo lo noto.',
    },
      murmurs: null },
    // solo durante la escena 7.2: la escena lo coloca con api.placeActor
    { id: 'inigo_sinergia', when: () => false, handlers: {} },
    // E1.6 · Leoncio Quesitos (Infografía), con árbol
    { id: L, when: '!lector_derribado', handlers: {
      mirar: 'Leoncio, Infografía. Un quesito de cartulina prendido en el pecho. Se lo dio él.',
      hablar: async (api) => api.dialog('leoncio'),
      'dar:cafe': ley('Gracias. Herminia dice que es mi quinto. Me lo ha puesto en barras. Suben.'),
      'dar:ficha_pagina_7': ley('Tres casillas. Herminia lo pinta en semáforo. Estás en ámbar.'),
      'dar:acta_reunion': ley('En tarta: 50 % café, 50 % nada. El gráfico más honesto del año.'),
      'dar:pieza_opa': async (api) => {
        if (api.flag('pieza_recortada')) await api.sayAs(L, 'Veintitrés líneas. Cabe. Ella lo dijo antes que Teodoro.');
        else await api.sayAs(L, 'Sobra un 26 %. Te la ha medido ella. Yo te la sostengo, que pesa.');
      },
      'dar:*': ley('Herminia ya lo ha contado. Yo lo sostengo. Es mi parte.'),
      empujar: 'No. Está mirando a Herminia trabajar. Es lo único que hace.',
    },
      murmurs: null },
    // E1.6 · Anselmo Monolito (Desarrollo), con árbol
    { id: A, when: '!lector_derribado', handlers: {
      mirar: 'Anselmo, director de Desarrollo. Un rollo de cinta en el cinto. Cargado.',
      hablar: async (api) => api.dialog('anselmo'),
      'dar:pieza_opa': ans('¿Escrita fuera del CMS? Sistema paralelo. Te abro expediente. Mental.'),
      'dar:cafe': ans('¿De Gertrudis? No. Yo bebo de mi termo. Café de la casa.'),
      'dar:ticket_n1': ans('Un ticket cerrado. Es de Sistemas. Yo no lo he visto.'),
      'dar:album_eventos': ans('Fotos de Eventos. ¿De dónde vienen? Ya. Bonitas, pero no.'),
      'dar:*': ans('¿De dónde viene? Si no lo sabes, no lo cojo.'),
      empujar: 'Está detrás de su cinta. Empujarle sería cruzar sin visado.',
    },
      murmurs: null },
  ],

  dialogs: { ...dialogos, custodia: dialogoCustodia },
  scenes: escenas,
  // §5.14: el motor decide cuándo (60-120 s, máx. 3 por visita, nunca encima de otro texto); aquí, solo las líneas.
  ambientRules: { max: 3, every: [60000, 120000] },
  ambient: [
    { id: 'coro', if: '!lector_derribado', voces: VOCES_CORO, discusiones: DISCUSIONES },
    { id: 'murmullos', if: '!lector_derribado', run: murmullo },
    { id: 'fondo', if: '!lector_derribado', voces: VOCES_CORO, discusiones: FONDO_YOLI },
  ],

  async onEnter(api) {
    murmuradoEstaVisita = false;
    // epílogo (lector_derribado): la escena final coloca a la gente ella misma; aquí no se hace nada
    if (api.flag('lector_derribado') || api.flag('juego_terminado') || api.restoring) return;
    // como mucho una escena de entrada por visita, por este orden
    if (api.flag('torno_abierto') && !api.flag('inigo_presentado')) { await api.scene('presentacion_villano'); return; }
    if (api.flag('acto_3_iniciado') && !api.flag('dos_ias_vista')) { await api.scene('pecera_dos_ias'); return; }
    if (api.flag('herminia_de_alta') && !api.flag('infografia_integrada')) { await api.scene('pecera_anexion'); return; }
    if (api.flag('cms_vivo') && api.once('pecera_cms_entrada')) { await api.scene('pecera_cms_entrada'); return; }
    if (api.flag('cafetera_viral') && api.once('pecera_viral')) { await api.scene('pecera_viral'); return; }
    if (api.flag('bruno_con_chaqueta')) await api.scene('pecera_chaqueta');
  },
}, art);
