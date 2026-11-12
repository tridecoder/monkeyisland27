// SALA `pecera` — LÓGICA. Dueño: paquete B · «La web y el poder» (biblia §9.1). Biblia §3.2; adenda §3.3, §4.1-4.3, §8, §8bis, §9.1-9.2.
// El arte y la geometría están en ./art/pecera.art.js (artista de fondos). Ids = claves de `layout` del arte.
// Archivos propios del paquete B: ./pecera.dialogos.js (árboles), ./pecera.escenas.js (7.2 y P05), ./pecera.voces.js (ayudas).
//
// NOTA PARA EL ARTISTA (los estados visuales los decide el arte leyendo flags; la lógica no los fuerza):
//  - pantalla_metricas: apagada con `cms_vivo`. silla_ramirez: sin chaqueta con `chaqueta_cogida`; arrimada a la mesa
//    de Bruno con `silla_libre`. kanban: hueco + pósit nuevo con `posit_descopeado`.
//  - frontera_carrocero (adenda 3.3): Acto I en 420 px; `acto_2_iniciado` → 400 px; `acto_3_iniciado` y sin
//    `infografia_integrada` → además un lazo alrededor de la mesa de Leoncio; con `infografia_integrada` → sin cinta.
//  - semaforo_ruido: estado de objeto 'rojo' (siempre) | 'ambar' | 'verde' (solo durante las escenas CO_BANDEJA y
//    CO_HERMINIA del coro): si el arte pone `sprites`, que use exactamente esos nombres.
import { buildRoom } from '../lib/room.js';
import art from './art/pecera.art.js';
import dialogos from './pecera.dialogos.js';
import escenas from './pecera.escenas.js';
import { talk, seq, num } from './pecera.voces.js';
import { ascensorObjeto } from '../lib/ascensor.js';

const Y = 'yoli_tendencias', N = 'nerea_backlog', L = 'leoncio_quesitos', A = 'anselmo_monolito', R = 'ruben', V = 'valentin_reticula';
const val = (...lines) => async (api) => { await api.sayAs(V, lines); };

// ------------------------------------------------------------------ rumores (adenda §8): una versión, una vez, al empezar
// a Hablar, cuando su contador está en el paso anterior; como mucho un rumor por conversación (prioridad A, B, C, D).
async function rumorYoli(api) {
  if (num(api, 'rumor_firma_n') === 3) {                                    // A, paso 4
    api.setFlag('rumor_firma_n', 4);
    await api.sayAs(Y, 'Dicen que eres el nuevo dueño del Contable. Ya es tendencia en tu pueblo.');
  } else if (num(api, 'rumor_teodoro_n') === 1) {                           // C, paso 2
    api.setFlag('rumor_teodoro_n', 2);
    await api.sayAs(Y, 'Teodoro vive en la Catacumba. Está hasta empadronado. Lo dice el wifi.');
  }
}
async function rumorNerea(api) {
  if (num(api, 'rumor_atun_n') === 1) {                                     // B, paso 2
    api.setFlag('rumor_atun_n', 2);
    await api.sayAs(N, 'Dicen que el Titulator consume mucho. Lo ha oído Paco.');
  } else if (num(api, 'rumor_plaza_n') === 2) {                             // D, paso 3
    api.setFlag('rumor_plaza_n', 3);
    await api.sayAs(N, 'Dicen que la plaza de Ramírez sale a subasta. Ya tiene columna en el tablero.');
  }
}

// ------------------------------------------------------------------ discusiones de fondo del coro (adenda 3.3 y 4.6b)
const DISCUSIONES = [
  [['D1', '¿Quién ha llamado "botón2" a un botón?'], ['D2', 'Era el segundo botón.'], ['D1', '¡Hay cuatro!'], ['D3', 'No.']],
  [['D1', 'Ha llovido y ha bajado el tráfico.'], ['D2', '¡Abrid una incidencia a la lluvia!'], ['D1', 'La lluvia no es nuestra.'], ['CORO', '¡Diseño!']],
  [['D2', '¡El navegador no respeta nada!'], ['D1', '¡Ni el mío!'], ['D2', '¡El tuyo menos!']],
  [['D1', 'El aire está a veintidós.'], ['D2', 'En hexadecimal eso es otra cosa.'], ['D1', '¡No lo pasemos a hexadecimal!'], ['D3', 'No.']],
  [['D1', '¿Quién ha tocado mi silla?'], ['D2', 'Tu silla gira. Se ha tocado sola.'], ['D1', '¡Fallo de diseño!'], ['CORO', '¡DISEÑO!']],
  [['D2', '¡Se ha ido todo el mundo!'], ['D1', '¡Diseño se fue a las seis y media!'], ['D2', '¡Con todo entregado! ¡Provocadores!']],
  [['D1', 'Internet está mal hecho.'], ['D2', 'Desde el principio.'], ['D3', '...Sí.']],
  [['D1', '¡Diseño sigue en el edificio!'], ['D2', '¡Su director! ¡A dos metros!'], ['D1', '...Pues que arregle el CMS.'], ['D2', 'Más bajo, que te oye.'], ['D3', 'No.']],
  // Valentín trabaja a dos metros, junto a la bandeja de Diseño: el coro baja la voz, culpa a Diseño... y él ni levanta la vista
  [['D2', '¡Esto es culpa de Dis...!'], ['D1', '¡Chsss! Que está ahí.'], ['D2', '...de Dirección. Culpa de Dirección.']],
  [['D1', '¡Diseño tiene la culpa!'], [V, 'Está en la bandeja.'], ['D1', '...'], ['D3', 'No.']],
  [['D1', '¿Quién ha puesto este margen de ocho píxeles?'], ['D2', 'Diseño.'], ['D1', '...Queda bien.'], ['D2', 'No se lo digas.']],
  [['CORO', '¡Diseño!'], ['D3', 'Ni nos mira.'], ['D1', 'Nunca mira.'], ['D2', 'Es que lo entregó todo.']],
  [['D2', '¿Le abrimos una incidencia a Diseño?'], ['D1', '¿Con qué? Lo tiene todo en la bandeja.'], ['D2', 'Pues a la bandeja.']],
];
let discusionN = 0;

// ------------------------------------------------------------------ biblia 8.3: monitores de la Pecera (Mirar figurantes_web)
const MONITORES = [
  '"Pensiones: lo que debes saber si cobras, vas a cobrar o conoces a alguien".',
  '"Última hora del Ibex 35 hoy, en directo: sigue el directo del directo".',
  '"Calendario laboral 2027: todos los puentes (y cómo pedir el lunes)".',
];

export default buildRoom({
  id: 'pecera',
  name: 'La Pecera',
  music: 'm_pecera',
  flags: {
    pecera_figurantes_n: 'int · B · +1 por Mirar figurantes_web (biblia, 8.7, monitores 8.3)',
    pecera_sillas_n: 'int · B · +1 por Mirar sillas_con_chaqueta (adenda 3.3)',
    pecera_pantalla_anselmo_n: 'int · B · +1 por Mirar pantalla_anselmo (rotación Acto II)',
  },

  objects: [
    // ---------------------------------------------------------------- salidas (biblia 3.0: ninguna bloqueada)
    { id: 'pecera_a_vestibulo', name: 'puerta del vestíbulo', exit: { room: 'vestibulo' }, handlers: {
      mirar: 'El vestíbulo. Desde aquí se ve el torno. Ya no me da miedo. Un poco.',
      abrir: async (api) => api.goto('vestibulo', 'pecera'), usar: async (api) => api.goto('vestibulo', 'pecera'),
      cerrar: 'Ya está cerrada. El torno se encarga de que no entre nadie más.',
      empujar: 'Empujar una puerta de cristal es dejar huellas en la escena del cierre.',
    } },
    { id: 'pecera_a_pajarera', name: 'puerta de la Pajarera', exit: { room: 'pajarera' }, handlers: {
      mirar: 'La Pajarera. Despacho de cristal: se ven las broncas, pero no se oyen.',
      abrir: async (api) => api.goto('pajarera', 'pecera'), usar: async (api) => api.goto('pajarera', 'pecera'),
      hablar: 'Golpeo el cristal con los nudillos. Al otro lado lo apuntan en un pósit.',
      cerrar: 'Ya está cerrada. Dirección no cierra puertas: las delega.',
    } },
    { id: 'pecera_a_office', name: 'puerta del Office', exit: { room: 'office' }, handlers: {
      mirar: 'El Office. Ahí vive Gertrudis.',
      abrir: async (api) => api.goto('office', 'pecera'), usar: async (api) => api.goto('office', 'pecera'),
      hablar: '¡Buenas noches, Gertrudis! No contesta. Habrá que decírselo a la cara.',
    } },
    ascensorObjeto('ascensor_pecera', {
      mirar: 'El ascensor. Lo rediseñó Valentín. No se nota nada: eso es lo bueno.',
      cerrar: 'Se cierra solo. Con un margen de ocho píxeles exactos.',
      empujar: 'No se empuja. Se llama. Como a Paco, pero contesta.',
      tirar: 'Tiro de la puerta. Nada. Va por botonera, como los adultos.',
      hablar: '«¿Sube o baja?». Hace «tin». Es la conversación más clara de la planta.',
    }),
    { id: 'pecera_a_ecosistema', name: 'escalera a la planta 2', exit: { room: 'ecosistema' }, handlers: {
      mirar: 'Escalera a la planta 2. La moqueta engorda dos centímetros: ahí está el dinero.',
      usar: async (api) => api.goto('ecosistema', 'pecera'),
      hablar: '"¿Hay alguien arriba?" Me contesta un gong. Eso es que sí.',
      empujar: 'Una escalera no se empuja. Se sube. Como el IPC.',
    } },

    // ---------------------------------------------------------------- 80-260 px: la redacción de las 18:30
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
        else await api.say('Las pantallas siguen encendidas. Sin nadie. Como la web.');
      },
      usar: 'Son de Mercados. Una silla no cambia de sección sin Consejo.',
      coger: 'Esa chaqueta está fichando. Si la quito, a su dueño le ponen falta.',
      empujar: 'Giran. Las chaquetas, no. Tienen más arraigo que yo.',
      'usar:chaqueta_ramirez': 'Una chaqueta más no se notaría. Ese es el problema: busco que se note.',
    } },
    { id: 'pantalla_metricas', name: 'pantalla de métricas', handlers: {
      mirar: async (api) => api.say(api.flag('cms_vivo')
        ? 'Apagada. La Pecera trabaja a ciegas. Y publica. Es un milagro.'
        : 'Lectores concurrentes: 3.418. Se refresca cada segundo. Igual que Yoli.'),
      usar: 'No sé usarla. Ni ella a mí.',
      hablar: async (api) => api.say(api.flag('cms_vivo')
        ? 'Le hablo. Está apagada. Es la primera vez que no me contesta con una cifra.'
        : '"¿Me lees?" Baja a 3.417. Creo que se ha ido el que me leía.'),
      tirar: 'Está atornillada a la pared. Es lo único fijo de esta planta.',
      empujar: 'Ni la toco. Se refresca cada segundo: me vería venir.',
    } },
    { id: 'enchufe_pantalla', name: 'enchufe', handlers: {
      mirar: 'Cinta de carrocero: "NO DESENCHUFAR – PANTALLA DE DIRECCIÓN".',
      tirar: async (api) => {
        if (api.flag('cms_vivo')) { await api.say('Ya está fuera. Y el CMS, dentro. Que siga así.'); return; }
        if (!api.flag('vio_ticket_3')) {
          if (api.flag('bandeja_diseno_abierta')) {                        // adenda 3.3 (sustituye a la 2.ª línea)
            await api.say(['Pone NO DESENCHUFAR. Diseño avisó, pero un aviso no es un ticket.', 'Paco tendrá el número.']);
          } else await api.say(['Pone NO DESENCHUFAR. Cuando algo lo pone, me da por obedecer.', 'Necesitaría un motivo. Por escrito.']);
          return;
        }
        await api.scene('pecera_cms_vivo');                                 // P05b
      },
      empujar: async (api) => api.say(api.flag('cms_vivo')
        ? 'Ni hablar. El ticket nº 3 tenía razón. Nueve años esperando.'
        : 'Ya está enchufado. Más enchufado no se puede. Como el sobrino de alguien.'),
      usar: 'Enchufar algo más aquí sería pedirle demasiado a Dirección.',
      coger: 'La cinta dice NO DESENCHUFAR. No dice NO COGER. Pero se sobreentiende.',
    } },
    { id: 'taza_abandonada', name: 'taza abandonada', handlers: {
      mirar: 'Una taza con costra de café de la crisis de la deuda. Debería cotizar.',
      coger: 'Es de alguien. O de algo que ahora vive en ella.',
      usar: 'Beber de ahí sería datar la crisis con carbono 14.',
      'usar:cafe': 'Echarle café nuevo a esa taza es reabrir la crisis de la deuda.',
      empujar: 'La empujo. No se mueve: la costra la tiene soldada a la mesa.',
    } },

    // ---------------------------------------------------------------- 180-260 px: Infografía (adenda 3.3)
    { id: 'mesa_dibujo', name: 'mesa de dibujo', handlers: {
      mirar: 'Una mesa de dibujo inclinada. Tiene polvo con forma de regla.',
      usar: 'Dibujo un quesito. Herminia lo corrige desde la pantalla. Me lo merezco.',
      empujar: 'Está inclinada desde 2024. Si la enderezo, Leoncio me pide el gráfico.',
    } },
    { id: 'herminia_portatil', name: 'Herminia', color: '#FF8C3C', handlers: {
      mirar: seq([['B', 'Herminia. Un portátil que hace infografías sola. Con nuestra tipografía.'], ['B', 'Delante, dos sillas vacías con chaqueta. Mirándola.']]),
      usar: async (api) => api.sayAs(L, 'No la toques. Está en racha desde 2024.'),
      hablar: 'Le digo hola. Me contesta con un gráfico de barras: "hola", 100 %.',
      coger: async (api) => api.sayAs(L, 'Herminia no sale de esta mesa. Fuera hay cinta.'),
      cerrar: async (api) => api.sayAs(L, 'Ni se te ocurra. Con nombre de persona no se la apaga.'),
      'usar:pieza_opa': async (api) => talk(api, [['H', 'PIEZA: 31 LÍNEAS. ADJETIVOS: 1. EN TARTA: 97 % OPA.'], ['B', 'Hasta los adjetivos me los cuenta.']]),
    } },

    // ---------------------------------------------------------------- 260-420 px: mesas de Yoli, Bruno y Ramírez
    { id: 'ordenador_bruno', name: 'mi ordenador', handlers: {
      mirar: async (api) => {
        if (!api.flag('silla_libre')) { await api.say('Mi ordenador. De pie no se ve. Sin silla soy un becario de pie.'); return; }
        if (!api.flag('rep_11')) {
          await api.say(['Bandeja de entrada. Un hilo de 2019.', 'Ramírez: "Quedo a la espera de tus comentarios".',
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
        // P10b
        await api.anim(api.player, 'reach', 400);
        api.sfx('typewriter');
        await api.wait(900);
        api.give('pieza_opa');
        api.setFlag('pieza_escrita', true);
        await api.say(['Lo escribo fuera del CMS: ahí dentro vive el Titulator.', 'Treinta y una líneas. Sin adjetivos. Bueno, con uno.']);
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
      coger: async (api) => {                                                // P04a
        await api.sayAs(Y, ['¡Quieto! Una chaqueta en una silla es propiedad.', 'Si la quitas, que sea para dejarla en un sitio con más autoridad.']);
        await api.anim(api.player, 'reach', 500);
        api.sfx('pickup');
        api.give('chaqueta_ramirez');
        api.give('sobre_azucar');
        api.setFlag('chaqueta_cogida', true);
        api.repaint();
        await api.say('Del bolsillo cae un sobre de azúcar. Me lo quedo. Todo aquí es de 2019.');
      },
      usar: 'No me la pongo. Me quedaría de Bolsa, y yo soy de la web.',
      tirar: 'Tiro un poco. Cruje. Hace siete años que nadie la mueve.',
      hablar: '"¿Ramírez?" La chaqueta no contesta. Igual que Ramírez desde 2019.',
    } },

    // ---------------------------------------------------------------- 420-640 px: rincón de Desarrollo
    { id: 'frontera_carrocero', name: 'cinta de carrocero', handlers: {
      mirar: async (api) => {
        if (api.flag('infografia_integrada')) await api.say('Ya no hay cinta. Queda la marca del pegamento.');
        else if (api.flag('acto_3_iniciado')) await api.say('Ahora rodea la mesa de Leoncio. Infografía es un enclave.');
        else if (api.flag('acto_2_iniciado')) await api.say(['La cinta ha avanzado veinte píxeles hacia Infografía.', 'Nadie la ha visto moverse.']);
        else await api.say('Cinta de carrocero en el suelo. Es la frontera de Desarrollo.');
      },
      tirar: async (api) => {
        if (api.flag('infografia_integrada')) await api.say('Ya no queda de qué tirar. Solo pegamento con nostalgia.');
        else await api.sayAs(A, '¡Eh! Eso es infraestructura.');
      },
      coger: 'Si me llevo un trozo, Anselmo me reclama soberanía.',
      'usar:chicle': 'No. Un chicle en una frontera es un tratado.',
      'usar:chaqueta_ramirez': 'Si la dejo en la frontera, Anselmo la integra. Y Ramírez no vuelve.',
      empujar: 'La piso. Anselmo me mira el zapato como a un paquete sin declarar.',
    } },
    { id: 'cartel_frontera', name: 'cartel de la frontera', handlers: {
      mirar: seq([['B', '"DESARROLLO · A PARTIR DE AQUÍ, SOLO CÓDIGO PROPIO".'], ['B', 'Debajo, a boli: "Y café propio".']]),
      coger: 'Es un cartel de frontera. Si me lo llevo, me convierto en contrabando.',
      empujar: 'Se tambalea y vuelve. Como la política de integración.',
    } },
    { id: 'pantalla_anselmo', name: 'pantalla de Anselmo', handlers: {
      mirar: async (api) => {
        const n = api.inc('pecera_pantalla_anselmo_n');
        if (api.flag('infografia_integrada')) await api.say('"ACCESO CONCEDIDO: HERMINIA (DESARROLLO)". Lo de Infografía, tachado.');
        else if (api.flag('ruben_encontrado')) await api.say('"ACCESO REVOCADO: TITULATOR 3000". Con fecha de hoy. Y de julio.');
        else if (api.flag('acto_2_iniciado') && n >= 2) {
          await api.say(n % 2 === 0 ? 'Un gráfico de Desarrollo: un quesito que suma 130 %.' : '"Lectores por continente". Gana la Antártida, con un 40 %.');
        } else await api.say(['"ACCESO DENEGADO: HERMINIA (INFOGRAFÍA)".', 'Debajo: "ACCESO CONCEDIDO: TITULATOR 3000 (USUARIO INTERNO)".']);
      },
      usar: async (api) => api.sayAs(A, 'Esa sesión es mía. Hasta el salvapantallas pasó revisión.'),
      hablar: 'Le pregunto por Herminia. Me pide credenciales. Las de Anselmo.',
    } },
    { id: 'coro_desarrollo', name: 'coro de Desarrollo', color: '#7FFFD4', defaultVerb: 'hablar', handlers: {
      mirar: seq([['B', 'Tres espaldas de Desarrollo. Se les ven las manos.'], ['B', 'Las manos están enfadadas.']]),
      hablar: async (api) => api.dialog('coro'),
      'dar:cafe': seq([['CORO', '¿De quién es?'], ['B', 'De Gertrudis.'], ['D1', 'Taza mal diseñada.'], ['CORO', '¡Diseño!']]),
      empujar: 'La silla gira. Su dueño sigue gritando. No se ha dado cuenta.',
      coger: seq([['D3', 'No.']]),
      'dar:*': seq([['D1', '¿Eso quién lo ha diseñado?'], ['CORO', '¡Diseño!']]),
    } },
    { id: 'semaforo_ruido', name: 'semáforo de ruido', state: 'rojo', states: ['rojo', 'ambar', 'verde'], handlers: {
      mirar: seq([['B', 'Semáforo de ruido de Prevención. Rojo.'], ['B', 'Pósit de Nerea: "Verde: 14 de agosto. Estaban de vacaciones".']]),
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
        if (!api.flag('bandeja_diseno_abierta')) {
          api.sfx('paper');
          await api.say(['Arriba: "Entregado a las 18:29. Todo en la carpeta. Buen fin de semana".', 'Al fondo, de 2017: "La pantalla de Dirección tumbará el CMS".',
            'Sello de Desarrollo: "LEÍDO (PERO NO)".']);
          api.setFlag('bandeja_diseno_abierta', true);
        } else await api.say(['Diseño se fue a las seis y media. Con todo entregado.', 'Menos su director, que está ahí al lado. Ni levanta la vista.']);
      },
      coger: async (api) => api.sayAs(N, 'Déjala. Es lo único ordenado del rincón. Y no es nuestro.'),
      cerrar: 'Ya está cerrada. Es una bandeja: lo suyo es que alguien la abra.',
      'usar:pieza_opa': 'No. Si la dejo aquí, la leen en 2033. Con sello de LEÍDO (PERO NO).',
    } },
    // ADENDA 3.2 (trasladado del CPD): el puesto de Valentín, junto a la bandeja de Diseño
    { id: 'monitor_valentin', name: 'monitor de Valentín', when: '!lector_derribado', handlers: {
      mirar: seq([['B', 'En su monitor, una aventura gráfica. Es esta Redacción. En pequeño.'], ['B', 'Hay un becario mirando un monitor. Me saludo. Me devuelvo el saludo.']]),
      usar: seq([[V, 'No toques, que estoy en el clímax.'], ['B', '¿Y cómo acaba?'], [V, 'Con un empujón. Con educación.']]),
      coger: 'Es la única pantalla calibrada de la planta. No se toca. Se respeta.',
      empujar: 'Si la muevo dos píxeles, Valentín lo nota. Y yo también, en pequeño.',
      hablar: 'Le hablo al becario del monitor. Me contesta lo mismo. Con más resolución.',
      'usar:cafe': val('Ni una gota cerca del monitor. Está calibrado. Yo también.'),
    } },
    { id: 'kanban', name: 'tablero kanban', handlers: {
      mirar: async (api) => {
        const lines = ['Columnas: POR HACER, EN CURSO, BLOQUEADO, HECHO y HECHO (PERO NO).'];
        if (api.flag('posit_descopeado')) lines.push('En el hueco, un pósit nuevo: "Aquí estuvo Rubén. Descopeado con amor".');
        else if (api.flag('acto_3_iniciado')) lines.push('En POR HACER, desde julio: "Baja becario Rubén".');
        await api.say(lines);
      },
      coger: async (api) => api.sayAs(N, 'Ni se te ocurra. Un pósit solo sale del tablero hecho o muerto.'),
      empujar: 'Tiene ruedas. Lo empujo un palmo y Nerea lo devuelve a su sitio con la mirada.',
      tirar: 'Si tiro, se caen los pósits. Y Nerea me pone en BLOQUEADO.',
      usar: 'Me escribo un pósit: "Firmar en papel". Lo pego en POR HACER. Desde hoy.',
    } },
    { id: 'posit_1998', name: 'pósit amarillísimo', handlers: {
      mirar: seq([['B', 'Un pósit amarillísimo: "Contratar al becario de marzo – 1998".'], ['B', 'Está en HECHO (PERO NO). Nadie lo hizo.']]),
      coger: async (api) => api.sayAs(N, 'Ni se te ocurra. Un pósit solo sale del tablero hecho o muerto.'),
      usar: 'No lo muevo. En HECHO (PERO NO) se está calentito.',
    } },
    { id: 'calendario_ferreteria', name: 'calendario de ferretería', handlers: {
      mirar: seq([['B', 'Calendario de Ferretería Hermanos Tornillo. Nerea solo se fía de este.'], ['B', 'Trae santoral, fases de la luna y una oferta de tacos del 8.']]),
      tirar: async (api) => api.sayAs(N, '¡Quieto! Es la única fuente fiable de este departamento.'),
      coger: 'Si me lo llevo, Nerea no sabría en qué día vive.',
      abrir: 'Lo hojeo. En diciembre regalan una llave inglesa. Hay que llegar a diciembre.',
    } },
    { id: 'ventana', name: 'ventana', handlers: {
      mirar: 'Ahí fuera hay un mundo real. Bajísimo tiempo de permanencia.',
      abrir: 'No se abre. El aire acondicionado lo consideraría una amenaza.',
      cerrar: 'Ya está cerrada. Por dentro. Como la redacción a las seis y media.',
      usar: 'Pego la frente al cristal. La ciudad sigue ahí. No se ha enterado del cierre.',
    } },
  ],

  // ---------------------------------------------------------------- PNJ (biblia 3.0 «Estados por acto»; adenda 1)
  // Epílogo (lector_derribado): en la Pecera solo quedan Yoli y Bruno (biblia 3.0); el coro sigue de espaldas (adenda 9.8c).
  actors: [
    { id: Y, handlers: {
      mirar: 'Yoli, audiencias. Le tiembla el párpado al ritmo de la gráfica.',
      hablar: async (api) => {
        await rumorYoli(api);
        if (!api.flag('cms_vivo')) {
          await api.sayAs(Y, '¡No entra nada! El CMS no va. Paco dice que es de Desarrollo.');
          await api.sayAs(N, 'El CMS no es nuestro, es de Sistemas.');
          return;
        }
        await api.dialog('yoli');
      },
      'dar:cafe': async (api) => api.sayAs(Y, '¿Café? Llevo cuatro. El quinto lo mido.'),
      'dar:ficha_pagina_7': seq([[Y, '¿Una ficha de papel? ¿Tiene keyword?'], ['B', 'Tiene casillas.'], [Y, 'Qué vintage.']]),
      'dar:pieza_opa': async (api) => api.sayAs(Y, '¿Sin número en el titular? ¿Sin "lo que nadie te cuenta"? Valiente.'),
      'dar:album_borja': async (api) => api.sayAs(Y, ['¿Fotos de eventos? Eso no lo ve nadie.', 'Bueno. Uno. El del fondo.']),
    },
      murmurs: ['Precio café hoy, precio café 2026, precio café por qué...', 'Si baja otra vez, me pongo colirio en el alma.',
        'Busco "el Contable" y salen gestorías. Nos ganan en SEO.', 'Hacen más ruido que mi gráfica cuando baja.'] },
    { id: N, when: '!lector_derribado', handlers: {
      mirar: 'Nerea, Desarrollo. Mueve pósits con precisión de cirujana.',
      hablar: async (api) => {
        await rumorNerea(api);
        if (!api.flag('cms_vivo')) { await api.sayAs(N, 'El CMS no es nuestro, es de Sistemas. Y no, no tengo un momento.'); return; }
        await api.sayAs(N, ['Si vienes a pedirme algo, está en el tablero.', 'Si no está en el tablero, no existe.']);
        await api.dialog('nerea');
      },
      'dar:album_borja': async (api) => api.dialog('nerea', 'N_ALBUM_INTRO'),     // P14b
    },
      murmurs: ['Esto a POR HACER. Esto a BLOQUEADO. Esto a la basura, pero con cariño.', 'Mañana es sábado. Lo dice la ferretería.',
        'Esto a POR HACER. Esto a BLOQUEADO. Esto a Diseño, que ya lo entregó.', 'Diseño entrega antes de que lo pida el tablero. Me descoloca.'] },
    { id: R, when: ['ruben_libre', '!lector_derribado'], handlers: {
      mirar: 'Rubén mira por la ventana. Espera al sol como quien espera una nómina.',
      hablar: async (api) => {
        if (api.flag('herminia_de_alta') && api.once('pecera_ruben_herminia')) {          // adenda 3.3
          await talk(api, [[R, '¿A ella le dieron el alta en cuarenta segundos?'], ['B', 'Es una herramienta.'], [R, 'Yo también. Pero sin pegatina.']]);
        }
        await api.sayAs(R, 'Estoy esperando a que salga el sol. Me han dicho que existe.');
      },
      'dar:cafe': async (api) => api.sayAs(R, 'Gracias. Es lo primero caliente desde julio. Sin contar el armario.'),
      'dar:ticket_n1': async (api) => api.sayAs(R, 'Guárdalo tú. Si lo toco, me vuelvo a dar de alta.'),
    },
      murmurs: ['AMANECER DETECTADO. LO QUE PASÓ DESPUÉS... Perdón. Aún no ha salido.', '¿El sol también va con ticket?'] },
    // cameo (adenda 1.9 / 4.6b): Valentín Retícula trabaja aquí, a dos metros del coro de Desarrollo. No está en el
    // epílogo ni en los poscréditos (sábado 6:00: Diseño ya lo había entregado todo). En la escena 7.2 está, lejos (x 712).
    { id: V, when: '!lector_derribado', handlers: {
      mirar: seq([['B', 'Valentín Retícula, director de Diseño y Producto.'], ['B', 'El único de Diseño que queda. Va mejor vestido que la planta entera.']]),
      hablar: async (api) => api.dialog('valentin'),
      'dar:cafe': val('Gracias. Lo dejo en la esquina superior derecha. Ahí no molesta.'),
      'dar:ficha_pagina_7': val('Buena ficha. Le subiría un punto el interlineado. Por lo demás, perfecta.'),
      'dar:pieza_opa': val('Buen titular. Cabe en una línea. Eso también es diseño.'),
      'dar:*': val('Gracias. Lo coloco donde no estorbe. Eso es casi todo mi trabajo.'),
      empujar: 'No. Está dirigiendo. Si le empujo, me salgo del encuadre.',
      tirar: 'No le tiro de la americana. Es de buen corte. Hasta yo lo noto.',
    },
      murmurs: ['Margen superior, ocho. Inferior, ocho. Paz.', '«¡Diseño!». Sí, hola. Está en la bandeja.',
        'Lo entregué a las 18:29. Lo demás es literatura.'] },
    // solo durante la escena 7.2: la escena lo coloca con api.placeActor (art.layout.inigo_sinergia.at)
    { id: 'inigo_sinergia', when: () => false, handlers: {} },
    { id: L, when: '!lector_derribado', handlers: {
      mirar: 'Leoncio, Infografía. Lleva un quesito de cartulina como una medalla.',
      hablar: async (api) => api.dialog('leoncio'),
      'dar:pieza_opa': async (api) => api.sayAs(L, ['Herminia la lee en un segundo. Ya tiene infografía. Papel, web, redes.', 'No la publico: no está integrada. Pero existe.']),
      'dar:planillo': async (api) => api.sayAs(L, 'Herminia lo pone en tarta: 100 % Siestatón. Desde marzo.'),
      'dar:ficha_pagina_7': async (api) => api.sayAs(L, 'Tres casillas. Herminia lo pinta como un semáforo. Estás en ámbar.'),
      'dar:acta_consejo': async (api) => api.sayAs(L, 'En tarta: 50 % café, 50 % nada. El gráfico más honesto del año.'),
      'dar:cafe': async (api) => api.sayAs(L, 'Gracias. Herminia dice que es mi quinto. Me lo ha puesto en barras.'),
      empujar: 'No. Está dibujando algo en el aire. Si lo empujo, se le sale del eje.',
    } },
    { id: A, when: '!lector_derribado', handlers: {
      mirar: seq([['B', 'Anselmo Monolito, director de Desarrollo.'], ['B', 'Lleva cinta de carrocero en el cinto. Por si alguien integra algo.']]),
      hablar: async (api) => api.dialog('anselmo'),
      'dar:pieza_opa': async (api) => api.sayAs(A, '¿Escrita fuera del CMS? Te abro un expediente. Mental.'),
      'dar:cafe': async (api) => api.sayAs(A, '¿Café de Gertrudis? No. Yo bebo del termo. Café propio.'),
      'dar:ticket_n1': async (api) => api.sayAs(A, 'Un ticket cerrado. Eso es de Sistemas. Yo no lo he visto.'),
      empujar: 'Ni hablar. Está detrás de su cinta. Empujarlo sería invadir.',
    } },
  ],

  dialogs: dialogos,
  scenes: escenas,
  ambient: [
    // discusiones de fondo del coro de Desarrollo (adenda 3.3 y 4.6b), en orden
    { every: [14000, 24000], if: '!lector_derribado', run: async (api) => {
      const d = DISCUSIONES[discusionN++ % DISCUSIONES.length];
      await talk(api, d);
    } },
  ],

  async onEnter(api) {
    // biblia 7.2: primera entrada con torno_abierto → presentación del villano (desde onEnter, para que no salgan avisos)
    // epílogo y poscréditos (lector_derribado): la escena final coloca a la gente ella misma; aquí no se hace nada
    if (api.flag('lector_derribado') || api.flag('juego_terminado')) return;
    if (api.flag('torno_abierto') && !api.flag('inigo_presentado')) await api.scene('presentacion_villano');
  },
}, art);
