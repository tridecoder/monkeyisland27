// SALA `pecera` (en pantalla: «Redacción») — LÓGICA. Paquete P2 del plan de comedia (docs/guion2/PLAN_COMEDIA.md §4.1-4.3,
// §5.4, §5.14, §5.15, §6.3; ENMIENDA E1.4-E1.8) y de la ENMIENDA E2 (§2 Anselmo, Infografía e IA, fusión Nemesio →
// Anselmo; §6 L8-L13, L29, L38; §7.4 paso 13; §8; §9 B4, C4-C6). El arte y la geometría están en ./art/pecera.art.js.
// Archivos propios: ./pecera.dialogos.js (árboles), ./pecera.escenas.js (escenas), ./pecera.voces.js (ayudas de voz),
// ./pecera.secretaria.js (Custodia).
//
// ESTADOS QUE LEE EL ARTE (la lógica pone el flag o el estado ANTES de la línea que lo comenta):
//  - pantalla_metricas: apagada con `cms_vivo`; estados de escena 'negra' (apagón), 'viral' y 'viral_baja' (§4.1).
//  - monitor_yoli: 'publicado' | 'guardando'. ([P15] tanda 4: fuera el estado 'con_ticket' del enchufe, del camino antiguo)
//  - herminia_portatil (E1.8 + E2 §2.2): por flags `limpio` (sin inigo_presentado) → `cinta_1` → `cinta_2` (herminia_midio)
//    → `paquete` (dos_ias_vista) → `anexionada` (infografia_integrada); en la 7.2 la escena pone `cinta_1` a mano; durante
//    la anexión, estado explícito 'desenvuelta' / 'anexionada'. Pegatina «IA» junto a la de «INFOGRAFÍA» (no en paquete).
//  - frontera_carrocero: solo recta; con `infografia_integrada`, marca de pegamento (E1.3.4).
//  - pantalla_anselmo: DENEGADO · REVOCADO con `ruben_libre` (cambia sola en la salida en valor, E2 §2.6.4) · OK con integrada.
//  - mesa_guardia (E2 §2.6.5): la mesa vacía donde estaba Nemesio, con la silla vacía y sus pósits de guardia.
//  - kanban: columna SALIDA EN VALOR con `posit_descopeado` (id técnico: el pósit ya ha salido). silla_ramirez / ordenador_bruno: `silla_libre`.
import { buildRoom } from '../lib/room.js';
import art from './art/pecera.art.js';
import dialogos, { anselmoCtx, anselmoEnSuSitio, columnas } from './pecera.dialogos.js';
import escenas from './pecera.escenas.js';
import { talk, seq, PREFIX } from './pecera.voces.js';
import { ascensorObjeto } from '../lib/ascensor.js';
import { usarDirectorio, DIRECTORIO_COLOR, SIN_DESTINO } from '../lib/directorio.js';   // crítica 3 §9.8 · E6 E344: la línea del punto rojo, importada
import { dialogoCustodia, objetosSecretaria, flagsSecretaria } from './pecera.secretaria.js';
import { darTaper } from './cpd.js';                      // [integrador] el táper también vale con Rubén en la Redacción
import { titulador } from './pecera.titulador.js';          // ENMIENDA E4 §3bis: el titulador de Yoli
import { mirarHoja, limpiarOscuras } from './pecera.escenas.js';   // E4 S3: la hoja «lo más leído» · E5 §2.2: carga a oscuras

const Y = 'yoli_tendencias', L = 'leoncio_quesitos', A = 'anselmo_monolito', R = 'ruben', V = 'valentin_reticula';
const ley = (...lines) => async (api) => { await api.sayAs(L, lines); };
const ans = (...lines) => async (api) => { await api.sayAs(A, lines); };

// (E2 §7.5 fase B (1) y §7.4 pasos 23/39: Yoli ya no cuenta rumores; la cadena C es Aurora → Maripaz → Teodoro.)

// ------------------------------------------------------------------ §5.14: el coro, las cuatro discusiones (una sobre Diseño)
const VOCES_CORO = Object.fromEntries(Object.entries(PREFIX).map(([k, p]) => [k, { from: 'coro_desarrollo', prefijo: p }]));
// E5 §5.1 (K01-K04) · el coro con arco «a quién culpan»: Acto I a los de fuera (DISCUSIONES, ahora dos; fuera la lluvia
// e Internet), Acto II unos a otros (CORO_ACTO_2, con el CMS vivo), Acto III a sí mismos (CORO_ACTO_3, con Rubén libre).
// Van ANTES en `ambient` para que, cuando toquen, sean las siguientes; las tres, solo con Bruno cerca (`cercaDelCoro`).
const DISCUSIONES = [
  (api) => (api.flag('cms_vivo') ? [] : [['D1', '¡Se ha caído el CMS!'], ['D2', '¡Hay que levantarlo!'], ['D1', '¿Cómo?'],
    ['D2', '...Gritando más alto.'], ['D3', 'No.']]),
  [['D1', '¿Quién ha puesto este margen de ocho píxeles?'], ['D2', 'Diseño.'], ['D1', '...Queda bien.'], ['D2', 'No se lo digas.']],
];
const CORO_ACTO_2 = [[['D1', 'El CMS se colgaba por una pantalla. ¿Quién la enchufó?'], ['D2', 'Tú.'],
  ['D1', 'Yo no. Él.']]];
const CORO_ACTO_3 = [[['D2', '¿Lo del Titulator ha sido Diseño?'], ['D3', 'No.'], ['wait', 1500],
  ['D3', 'Hemos sido nosotros.'], ['D1', 'No lo repitas.']]];
// paso 13 (E2 §7.4): sentado, el correo se ve; la réplica R11 (contra Maripaz). Con Mirar o con Usar el ordenador
// (crítica 3 · N1); una sola vez: con `rep_11` ya sabida, cada verbo dice lo suyo.
async function leerCorreoRamirez(api) {
  // [P9] R11: el correo de Ramírez pregunta; la respuesta es un borrador de Bruno que nunca mandó
  await api.say(['Con silla, el correo se ve. Ramírez, en 2019: «¿Has podido verlo?».',
    'En borradores, mi respuesta: «Poder, he podido».', 'Nunca la mandé. La apunto.']);
  api.learnReply('rep_11');
  await api.say(['Y una autorrespuesta de Brais: «Estoy fuera de la oficina desde julio».', '«Bueno, fuera no. Dentro. Muy dentro».']);
}

// crítica 3 · N11: el coro (D1-D3) solo habla con Bruno cerca de su zona (umbral en x desde el centro de su mesa; la
// pantalla mide 320: con 200 px el coro está a la vista o justo fuera). Desde la otra punta de la Redacción, nada.
// Vale también para la discusión de fondo con Yoli (FONDO_YOLI): la empieza el coro.
export const CORO_UMBRAL = 200;
const CORO_X = art.layout.coro_desarrollo.rect[0] + art.layout.coro_desarrollo.rect[2] / 2;
function cercaDelCoro(api) {
  const b = api.actorPos('bruno');
  return !!b && Math.abs(b.x - CORO_X) <= CORO_UMBRAL;
}
// «De fondo» (§5.14, VELADO): queda solo una, una vez por partida, sin comentario, sin opción y sin objeto.
const FONDO_YOLI = [[['D1', 'Le he explicado a Yoli su artículo de buscadores.'], ['D2', '¿Y?'],
  ['D1', 'Lo ha entendido a la primera.'], [Y, 'Es que lo escribí yo. Ayuda bastante.']]];
// E2 §2.5: murmullos de Leoncio y Anselmo, como mucho UNO por visita entre los dos, en la misma cola que el coro
const MURMULLOS = [
  [L, 'Esto, en barras. Esto, en tarta. Esto, en tarta pero triste.'],
  [A, 'Esto no ha pasado por mí. Esto tampoco. Esto, de refilón.'],
  [A, '(al termo) Tú sí eres de la casa.'],
  [A, 'Mañana es sábado. Lo dice la ferretería. Es de fuera, pero acierta.'],
];
let murmuradoEstaVisita = false;
async function murmullo(api) {
  if (murmuradoEstaVisita) return;
  murmuradoEstaVisita = true;
  const [who, text] = MURMULLOS[(api.inc('pecera_murmullo_n') - 1) % MURMULLOS.length];
  await api.sayAs(who, text);
}

// ------------------------------------------------------------------ E5 §2.5.4: rotulador con el tablero (o el pósit)
async function rotuladorEnTablero(api) {
  if (api.flag('posit_descopeado')) { await api.sayAs(A, 'Una columna nueva por noche. La siguiente, en la próxima versión.'); return; }
  if (!api.flag('album_validado')) { await api.sayAs(A, 'Ni se te ocurra. De mi tablero se sale hecho o muerto.'); return; }
  await api.walkTo('kanban');
  await columnas(api);
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
  if (!api.flag('inigo_presentado')) return 'limpio';
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
    await talk(api, [['H', 'pieza_opa · 23 líneas · hueco: 23 · cabe'], [L, 'Cabe. Ni ella ni yo hemos tocado nada.']]);
  } else {
    await talk(api, [['H', 'pieza_opa · ya medida · sobra: 26 % · sin cambios'], [L, 'Medida dos veces, mismo resultado. Eso, en mi época, era un milagro.']]);
  }
}

export default buildRoom({
  id: 'pecera',
  name: 'Redacción',
  music: 'm_pecera',
  flags: {
    pecera_prompt_oido: 'bool · bloqueos · la frase del prompt de Anselmo, ya oída · el eco',
    pecera_figurantes_n: 'int · P2 · +1 por Mirar figurantes_web (monitores)',
    pecera_sillas_n: 'int · P2 · +1 por Mirar sillas_con_chaqueta',
    pecera_pantalla_anselmo_n: 'int · P2 · +1 por Mirar pantalla_anselmo (rotación Acto II)',
    pecera_valentin_n: 'int · P2 · +1 por Hablar con Valentín (1.ª: el casco)',
    pecera_bandeja_abierta: 'bool · integrador · Abrir bandeja_diseno · arte (la bandeja de arriba, sacada)',
    pecera_murmullo_n: 'int · P2 · rotación de los murmullos de Leoncio y Anselmo',
    pecera_columna_mal_n: 'int · PB · +1 por columna equivocada (E5 §2.5.4)',
    pecera_oscuras: 'bool · PB · ventana a oscuras del 1.er apagón (E5 §2.2)',
    // ENMIENDA E4 §3bis.7 · el titulador y la hoja «lo más leído» (pecera.titulador.js, pecera.escenas.js)
    pecera_top_n: 'int · P2 · +1 por Mirar lista_mas_leidas (2.ª: Yoli reimprime)',
    pecera_disc_record: 'int · P2 · titulador: récord de usuarios de la partida',
    pecera_disc_record_k: 'str · P2 · titulador: combinación a|s|g del récord',
    pecera_disc_hist: 'lista · P2 · titulador: las 4 últimas publicaciones [a, s, g, u]',
    pecera_disc_dichas: 'lista · P2 · titulador: líneas de Yoli ya dichas (ids)',
    pecera_disc_partidas: 'int · P2 · titulador: sesiones jugadas',
    pecera_disc_ganador_k: 'str · P2 · paso 40: combinación ganadora (hoja III)',
    ...flagsSecretaria,
  },

  objects: [
    // ---------------------------------------------------------------- salidas
    { id: 'pecera_a_vestibulo', name: 'escalera al vestíbulo', exit: { room: 'vestibulo', tipo: 'escalera' }, handlers: {
      mirar: async (api) => { await api.say(['La escalera de bajada al vestíbulo. Planta 0.', 'Abajo espera el torno. Ya no me da miedo. Un poco.']); },
      abrir: 'Es una escalera. No tiene puerta. Lo cerrado es el torno de abajo.',
      usar: async (api) => api.goto('vestibulo', 'pecera'),
      cerrar: 'Una escalera no se cierra. Para eso ya está el torno, abajo.',
      empujar: 'Empujar a alguien escaleras abajo sería una salida en valor. No.',
    } },
    { id: 'pecera_a_pajarera', name: 'Despachos', exit: { room: 'pajarera', tipo: 'cristal' }, handlers: {
      mirar: async (api) => { await api.say(['Los Despachos. Cristal de arriba abajo: se ven las broncas, pero no se oyen.', 'Al fondo, la puerta de la Sala de Reuniones.']); },
      abrir: async (api) => api.goto('pajarera', 'pecera'), usar: async (api) => api.goto('pajarera', 'pecera'),
      hablar: 'Golpeo el cristal con los nudillos. Al otro lado lo apuntan en un pósit.',
    } },
    { id: 'pecera_a_office', name: 'Vending', exit: { room: 'office', tipo: 'arco' }, handlers: {
      mirar: 'El Vending. Un arco sin puerta: se ve la máquina y a Gertrudis. Ahí vive ella.',
      cerrar: 'No tiene puerta. Gertrudis no necesita puertas: necesita público.',
      abrir: async (api) => api.goto('office', 'pecera'), usar: async (api) => api.goto('office', 'pecera'),
      hablar: '¡Buenas noches, Gertrudis! No contesta. Habrá que decírselo a la cara.',
    } },
    { id: 'pecera_a_catacumba', name: 'Redacción de papel', parada: true, exit: { room: 'catacumba', tipo: 'puerta_doble' }, handlers: {
      mirar: async (api) => { await api.say(['La Redacción de papel. Misma planta, otro siglo.', 'El umbral de latón es la frontera. Nadie lo pisa sin motivo.']); },
      abrir: 'Está abierta de par en par. Nadie se atreve a cerrarla.',
      cerrar: 'Si cierro esa puerta, Teodoro lo publica en la página 7.',
      usar: async (api) => api.goto('catacumba', 'pecera'),
      hablar: '"¿Hola?" Me contesta un fax. Dentro de un rato.',
      empujar: 'Está abierta. Empujarla sería meterme en la guerra fría a traición.',
    } },
    ...objetosSecretaria,
    // crítica 3 §9.8: el directorio con atajos (content/lib/directorio.js): Ir a / Usar / Mirar abren la lista de las salas
    // ya pisadas; la 1.ª vez, Mirar dice antes lo de siempre
    { id: 'directorio_planta', name: 'directorio con atajos', parada: true, defaultVerb: 'usar', color: DIRECTORIO_COLOR, handlers: {
      ir: usarDirectorio, usar: usarDirectorio,
      mirar: async (api) => {
        if (api.once('pecera_directorio_mirado')) await seq([['B', 'Directorio de la planta 1: Despachos, Vending, Secretaría, Papel y Redacción.'], ['B', SIN_DESTINO]])(api);
        await usarDirectorio(api);
      },
      empujar: 'No se mueve. Está donde dice que está.',
      coger: 'Es un tótem. Se consulta, no se adopta.',
    } },
    ascensorObjeto('ascensor_pecera', {
      mirar: 'El ascensor. Espejo, moqueta y un cartel: «8 personas o 1 consultor».',
      cerrar: 'Se cierra solo. Despacio, para que dé tiempo a arrepentirse.',
      empujar: 'Pulso el botón y viene enseguida. No estoy acostumbrado a eso.',
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
          else if (n === 2) await api.say('Siguen tecleando. De guardia. El resto de la planta son chaquetas.');
          else await api.say(['En sus pantallas:', MONITORES[(n - 3) % MONITORES.length]]);
        },
        hablar: 'Ni me miran. Están en directo. Yo no soy noticia.',
        coger: 'No se cogen. Son la guardia. Si me llevo uno, la web cae a la mitad.',
        empujar: 'Ni se inmutan. Un empujón no es noticia. Si me caigo, quizá.',
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
        ? 'Apagada. Y la web publica. Nadie se atreve a decirlo en voz alta.'
        : 'Lectores concurrentes: 3.418. Se refresca cada segundo. Igual que Yoli.'),
      usar: 'No sé usarla. Ella a mí tampoco.',
      hablar: async (api) => api.say(api.flag('cms_vivo')
        ? 'Le hablo. Está apagada. No me da ni una cifra.'
        : '"¿Me lees?" Baja a 3.417. Creo que se ha ido el que me leía.'),
      tirar: 'Está atornillada a la pared. Y Yoli, a la pantalla.',
      empujar: 'Ni la toco. Se refresca cada segundo: me vería venir.',
      // [bloqueos] apagarla es razonable (la pista del CMS): no tiene botón, tiene un enchufe
      cerrar: async (api) => api.say(api.flag('cms_vivo') ? 'Ya está apagada. Que no se entere Yoli.' : 'No tiene botón. Solo un cable que baja a un enchufe.'),
    } },
    { id: 'monitor_yoli', name: 'monitor de Yoli', parada: true, handlers: {
      mirar: async (api) => {
        if (api.flag('cms_vivo')) await api.say('El monitor de Yoli: «PUBLICADO». Y otra. Y otra. Ella no se fía.');
        else await api.say('El monitor de Yoli. El CMS dice «GUARDANDO BORRADOR» desde las cuatro.');
      },
      usar: async (api) => {                                                // E4 §3bis.2: con la pieza, el titulador
        if (api.flag('pieza_escrita')) { await titulador(api); return; }
        await api.sayAs(Y, '¡Quieto! Si lo tocas, igual se guarda. Y entonces qué hago.');
      },
      coger: 'Es el monitor de Yoli. Separarla de él sería un despido.',
    } },
    // ENMIENDA E4 S3: la hoja impresa «LO MÁS LEÍDO» (el fondo ya la pinta; solo Mirar, el resto al genérico)
    { id: 'lista_mas_leidas', name: 'lo más leído', handlers: { mirar: mirarHoja } },
    { id: 'enchufe_pantalla', name: 'enchufe', handlers: {
      mirar: async (api) => {
        await api.say(['Cinta: «NO DESENCHUFAR». Y una brida que baja por la pared.', 'Etiqueta de la brida: «R-3, SISTEMAS. EUTIMIO».']);
      },
      tirar: async (api) => {
        if (api.flag('cms_vivo')) { await api.say('Ya está fuera, y el CMS, dentro.'); return; }
        await api.scene('pecera_apagon');                                                  // §4.2, la escalada ([P11] fuera el ticket nº 3)
      },
      empujar: async (api) => api.say(api.flag('cms_vivo')
        ? 'Ni hablar. Nueve años esperando a que alguien la desenchufara.'
        : 'Ya está enchufado. Lo dicen la cinta, el cable y Anselmo con la mirada.'),
      usar: 'Enchufar algo más aquí sería pedirle demasiado a esa pantalla.',
      coger: 'La cinta dice NO DESENCHUFAR. No dice NO COGER, pero se sobreentiende.',
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
      empujar: 'Está inclinada. Si la enderezo, Leoncio tendría que volver a dibujar.',
    } },
    { id: 'herminia_portatil', name: 'Herminia, la IA de Infografía', parada: true, color: '#FF8C3C', handlers: {
      mirar: async (api) => {
        const st = estadoPortatil(api);
        if (st === 'anexionada' || st === 'desenvuelta') await api.say('Sin cinta. Pegatina nueva: «DESARROLLO». Los gráficos, idénticos.');
        else if (st === 'paquete') await api.say('Envuelta entera. «PENDIENTE DE INTEGRAR». Por un hueco, la pantalla trabaja.');
        else if (st === 'cinta_2') await api.say('Dos tiras de cinta de Desarrollo. Por debajo, la IA sigue haciendo gráficos.');
        else {
          await api.say(['Herminia, la IA de Leoncio: un portátil que hace solo las infografías.',
            st === 'limpio' ? 'Delante, dos sillas vacías con chaqueta. Mirándola.'
              : 'Delante, dos sillas vacías con chaqueta. Mirándola. Encima, una tira de cinta.']);
        }
      },
      usar: async (api) => {
        const st = estadoPortatil(api);
        if (st === 'paquete') { await api.say('No se puede. La han integrado en un paquete.'); return; }
        if (st === 'anexionada') { await talk(api, [['H', 'propietario: Desarrollo · cambios en los gráficos: 0']]); return; }
        await talk(api, [['H', 'quesito de Desarrollo · suma: 130 % · corregir: bloqueado'],
          [L, 'Ella lo arreglaría en una décima. No la dejan. Él lo publica.']]);
      },
      hablar: async (api) => {
        if (estadoPortatil(api) === 'paquete') { await api.say('Le digo hola al paquete. Por el hueco, una barra sube un poco.'); return; }
        await talk(api, [['H', 'saludo recibido · hola: 100 %']]);          // E6 §2.6 B6: la pantalla es el chiste
      },
      'usar:ficha_pagina_7': async (api) => {
        const n = casillas(api);
        await talk(api, [['H', `ficha página 7 · casillas hechas: ${n} de 3 · semáforo: ${n >= 3 ? 'verde' : n ? 'ámbar' : 'rojo'}`]]);
      },
      'usar:pieza_opa': portatilPieza,
      coger: ley('Herminia no sale de esta mesa: fuera está Anselmo.'),
      cerrar: ley('Ni se te ocurra. Con nombre de persona no se la apaga.'),
      tirar: async (api) => {
        if (api.flag('infografia_integrada')) await api.say('Ya no tiene cinta de la que tirar. Solo una pegatina nueva.');
        else await api.sayAs(A, '¡Eh! Eso es infraestructura.');
      },
    } },

    // ---------------------------------------------------------------- ECONOMÍA: mesas de Bruno y Ramírez
    { id: 'ordenador_bruno', name: 'mi ordenador', parada: true, handlers: {
      mirar: async (api) => {
        if (!api.flag('silla_libre')) { await api.say('Mi ordenador. De pie llego al teclado. A la pantalla, no.'); return; }
        if (!api.flag('rep_11')) {                                          // paso 13 (E2 §7.4)
          await leerCorreoRamirez(api);
        } else {
          await api.say(['Bandeja de entrada. Ramírez sigue preguntando si he podido.', 'Y Brais sigue fuera de la oficina. Bueno, dentro. Muy dentro.']);
        }
      },
      usar: async (api) => {
        if (!api.flag('silla_libre')) { await api.say('Sin silla no hay ordenador. Lo dice la ergonomía y lo dice Begoña.'); return; }
        if (!api.flag('rep_11')) { await leerCorreoRamirez(api); return; }   // crítica 3 · N1: Usar también lee el correo
        if (api.flag('pieza_escrita')) { await api.say('Ya está escrita. Si la toco más, le salen adjetivos.'); return; }
        if (!api.flag('casilla_fuente')) { await api.say('Abro un documento en blanco. Me mira. Lo cierro: sin fuentes no hay pieza.'); return; }
        // paso 32
        await api.anim(api.player, 'reach', 400);
        api.sfx('typewriter');
        await api.wait(900);
        api.give('pieza_opa');
        api.setFlag('pieza_escrita', true);
        await api.say(['Lo escribo fuera del CMS: ahí dentro vive el Titulator.', 'Treinta y una líneas. Sin adjetivos. Bueno, con uno.']);
        if (!api.flag('herminia_midio')) await api.scene('pecera_herminia_mide');           // E1.4.1
        await api.scene('pecera_opa_ab');                                                     // E4 S4 (una vez)
      },
      'usar:cafe': async (api) => api.say(['Tentador. Pero el teclado de al lado ya lo probó en 2017.', 'Sigue escribiendo en negrita.']),
      'usar:pieza_opa': 'Ya está escrita. Ahora le faltan hueco, fuente y firma.',
      hablar: 'Le susurro "papel". Se le acelera el ventilador. Le ha dado miedo.',
      coger: 'Es de El Incontable. Lo pone una pegatina. Con mi nombre mal escrito.',
      cerrar: 'Lo cierro. Cuatro mil ciento doce piezas me miran desde el escritorio.',
    } },
    { id: 'silla_ramirez', name: 'silla de Ramírez', handlers: {
      mirar: async (api) => {
        if (!api.flag('chaqueta_cogida')) await api.say(['Una silla libre. Tiene una chaqueta: Ramírez, el de Bolsa.', 'En el bolsillo, un tique: «1 cruasán. Para tomar aquí».']);
        else await api.say('Una silla. Libre. Me tiembla algo que no sabía que tenía.');
      },
      usar: async (api) => {
        if (!api.flag('chaqueta_cogida')) await api.say('No. Chaqueta en silla es propiedad privada. Lo sabe todo el mundo.');
        else if (api.flag('bruno_con_chaqueta')) await api.say('Si me siento con su chaqueta, la silla sigue siendo suya.');
        else if (!api.flag('silla_libre')) await api.say('Si me siento con su chaqueta en la mano, Ramírez vuelve: es tradición.');
        else if (api.once('pecera_silla_arrimada')) { api.sfx('step'); await api.say('La arrimo a mi mesa. Primera silla en seis años.'); }
        else await api.say('Me siento. Me levanto. Me vuelvo a sentar. Es que puedo.');
      },
      coger: 'Las sillas no se cogen. Se heredan.',
      empujar: 'Tiene ruedas. Se mueve dos centímetros y vuelve. Echa de menos a Ramírez.',
      'usar:chaqueta_ramirez': 'Si la vuelvo a colgar, la silla vuelve a ser de Ramírez.',
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
        await api.say('Del bolsillo cae un sobre de azúcar. Me lo quedo. Es casi un ticket de gasto.');
      },
      usar: 'No me la pongo aún. Primero la descuelgo.',
      tirar: 'Tiro un poco. Cruje. Hace siete años que nadie la mueve.',
      hablar: '"¿Ramírez?" La chaqueta no contesta. Uno de la guardia, sin mirar: «Presente».',
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
      'usar:chaqueta_ramirez': 'Si la dejo en la frontera, Anselmo la envuelve.',
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
        else if (api.flag('ruben_libre')) await api.say('"ACCESO REVOCADO: TITULATOR 3000". La fecha está corregida a mano.');
        else if (api.flag('acto_2_iniciado') && n >= 2) {
          await api.say(n % 2 === 0 ? 'Un gráfico de Desarrollo en la sección de Infografía: un quesito que suma 130 %.' : '"Lectores por continente". Gana la Antártida, con un 40 %.');
        } else await api.say(['"ACCESO DENEGADO: HERMINIA (INFOGRAFÍA)".', 'Debajo: "ACCESO CONCEDIDO: TITULATOR 3000 (USUARIO INTERNO)".']);
      },
      usar: ans('Esa sesión es mía. Hasta el salvapantallas pasó revisión.'),
      hablar: 'Le pregunto por Herminia. Me pide credenciales. Las de Anselmo.',
    } },
    { id: 'coro_desarrollo', name: 'coro de Desarrollo', nameDark: 'tres sombras enfadadas', color: '#7FFFD4', defaultVerb: 'hablar', handlers: {
      mirar: seq([['B', 'Tres espaldas de Desarrollo. Se les ven las manos.'], ['B', 'Las manos están enfadadas.']]),
      hablar: async (api) => api.dialog('coro'),
      'dar:cafe': seq([['CORO', '¿De quién es?'], ['B', 'De Gertrudis.'], ['D1', 'Café de fuera.']]),
      empujar: 'La silla gira. Su dueño sigue gritando. No se ha dado cuenta.',
      coger: seq([['D1', 'Yo no. Él.']]),
      'dar:*': seq([['D1', '¿Eso quién lo ha hecho?'], ['D2', 'Alguien de fuera.']]),
    } },
    { id: 'semaforo_ruido', name: 'semáforo de ruido', state: 'rojo', states: ['rojo', 'ambar', 'verde'], handlers: {
      mirar: seq([['B', 'Semáforo de ruido de Prevención. Rojo.'], ['B', 'Pósit de Anselmo: "Verde: 14 de agosto. Estaban de vacaciones".']]),
      usar: 'Lo toco. Se pone más rojo. Existe un rojo más rojo.',
      tirar: async (api) => api.sayAs(A, 'No. Es de Prevención. El pósit, mío.'),
      // E3 P8: lo que dice la línea pasa en pantalla: verde un segundo (con el globo ya fuera) y vuelta al rojo
      hablar: async (api) => {
        api.setState('semaforo_ruido', 'verde');
        const vuelta = api.wait(1000).then(() => api.setState('semaforo_ruido', 'rojo'));
        // el globo, a los pies de Bruno: encima de su cabeza taparía el semáforo justo cuando se pone verde
        const b = api.actorPos('bruno');
        try { await api.say('"Shhh", le digo. Se pone verde un segundo. Luego, rojo otra vez.', b ? { at: [b.x, 141] } : undefined); await vuelta; }
        finally { api.setState('semaforo_ruido', 'rojo'); }
      },
      coger: 'Si me lo llevo, Desarrollo deja de hacer ruido oficialmente. No sería verdad.',
    } },
    { id: 'taza_no', name: 'taza «NO»', nameDark: 'algo que dice que no', handlers: {
      mirar: 'Una taza que pone "NO". Es de la tercera espalda.',
      coger: seq([['D3', 'No.']]),
      usar: seq([['D3', 'No.']]),
      'usar:cafe': seq([['B', 'Le sirvo un poco de café.'], ['D3', '...No.'], ['B', 'Pero se lo bebe.']]),
    } },
    { id: 'bandeja_diseno', name: 'bandeja de Diseño y Producto', handlers: {
      mirar: seq([['B', 'Una bandeja: "ENTREGAS DE DISEÑO Y PRODUCTO". Llena hasta arriba.'], ['B', 'Todo con fecha y a su hora. Desde Desarrollo no la abre nadie.']]),
      abrir: async (api) => {
        api.sfx('paper');
        api.setFlag('pecera_bandeja_abierta', true);      // solo el dibujo (fuera el flag cruzado bandeja_diseno_abierta, §3.4)
        await api.say(['«Entregado a las 18:29». Y al fondo, una hoja con una flecha.', '«La pantalla tumbará el CMS». Sello: «LEÍDO (PERO NO)».']);
      },
      coger: async (api) => api.sayAs(A, 'Déjala. Está ordenada. Se nota que no es nuestra.'),
      cerrar: 'Ya está cerrada. Es una bandeja: lo suyo es que alguien la abra.',
      'usar:pieza_opa': 'No. Si la dejo aquí, le ponen el sello de LEÍDO (PERO NO).',
    } },
    // E5 §2.5.4: la columna nueva la escribe Bruno con el rotulador de Comercial, con el álbum ya validado
    { id: 'kanban', name: 'tablero kanban', nameDark: 'algo con pósits', parada: true, handlers: {   // estados de escena: mal_0..2 (columna equivocada)
      mirar: async (api) => {
        const lines = ['Columnas: POR HACER, EN CURSO, BLOQUEADO, HECHO y HECHO (PERO NO).'];
        if (api.flag('posit_descopeado')) {
          lines.push('Y una nueva, a rotulador: SALIDA EN VALOR. Dentro, el pósit de Brais.');   // [P12] fuera la otra palabra
        } else if (api.flag('acto_3_iniciado')) lines.push('En POR HACER, amarillo de puro viejo: "Baja becario Brais".');
        await api.say(lines);
      },
      coger: async (api) => api.sayAs(A, 'Ni se te ocurra. De mi tablero se sale hecho o muerto.'),
      empujar: 'Tiene ruedas. Lo empujo un palmo y Anselmo lo devuelve con la mirada.',
      tirar: 'Si tiro, se caen los pósits. Y Anselmo me pone en BLOQUEADO.',
      usar: async (api) => {
        // [P15] tanda 4: el rotulador llega siempre con el D1 (antes del Acto III): fuera la línea de Anselmo sin él
        if (api.flag('album_validado') && !api.flag('posit_descopeado')) { await columnas(api); return; }
        await api.say('Me escribo un pósit: "Firmar en papel". Lo pego en POR HACER.');
      },
      'usar:rotulador_rojo': rotuladorEnTablero,
      'usar:boli_muerto': 'Un boli no pinta en pizarra. Este, ni en papel.',
      'usar:album_eventos': 'El tablero no mira fotos. Anselmo, sí: el tablero es suyo.',   // [bloqueos] → Dar el álbum a Anselmo
    } },
    { id: 'posit_1998', name: 'pósit amarillísimo', handlers: {
      mirar: seq([['B', 'Un pósit amarillísimo: "Contratar al becario de marzo – 1998".'], ['B', 'Está en HECHO (PERO NO).']]),
      coger: async (api) => api.sayAs(A, 'Ni se te ocurra. De mi tablero se sale hecho o muerto.'),
      usar: 'No lo muevo. En HECHO (PERO NO) se está calentito.',
      'usar:rotulador_rojo': rotuladorEnTablero,
      'usar:boli_muerto': 'Un boli no pinta en pizarra. Este, ni en papel.',
      'usar:album_eventos': 'El tablero no mira fotos. Anselmo, sí: el tablero es suyo.',   // [bloqueos] → Dar el álbum a Anselmo
    } },
    { id: 'calendario_ferreteria', name: 'calendario de ferretería', handlers: {
      mirar: seq([['B', 'Calendario de Ferretería Hermanos Tornillo. Anselmo solo se fía de este.'], ['B', 'Trae santoral, fases de la luna y una oferta de tacos del 8.']]),
      tirar: async (api) => api.sayAs(A, '¡Quieto! Es de fuera, pero trae tacos del 8. Tiene permiso.'),
      coger: 'Si me lo llevo, Anselmo no sabría en qué día vive.',
      abrir: 'Lo hojeo. En diciembre regalan una llave inglesa. Hay que llegar a diciembre.',
    } },
    // E2 §2.6.5: la mesa vacía de Desarrollo (donde estaba Nemesio). Anselmo hace la guardia. Y la guardia de la guardia.
    { id: 'mesa_guardia', name: 'mesa vacía de Desarrollo', handlers: {
      mirar: seq([['B', 'Una mesa de Desarrollo, vacía. Pósit: «GUARDIA: ANSELMO».'], ['B', 'Debajo, otro: «GUARDIA DE LA GUARDIA: ANSELMO».']]),
      usar: 'No me siento. Es de Desarrollo. Hasta el polvo pasa por sus sistemas.',
      coger: 'Si me llevo un pósit, Anselmo me abre expediente. Mental.',
    } },
    { id: 'ventana', name: 'ventana', parada: true, handlers: {
      mirar: 'Ahí fuera hay un mundo real, sin contador de lectores.',
      abrir: 'No se abre. El aire acondicionado lo consideraría una amenaza.',
      cerrar: 'Las ventanas de oficina se abren una vez: para la foto de inauguración.',
      usar: 'Pego la frente al cristal. La ciudad sigue ahí. No se ha enterado del cierre.',
    } },
  ],

  // ---------------------------------------------------------------- PNJ
  actors: [
    { id: Y, nameDark: 'alguien que cuenta', handlers: {
      mirar: 'Yoli, audiencias. Le tiembla el párpado al ritmo de la gráfica.',
      hablar: async (api) => {
        if (!api.flag('cms_vivo')) {                                        // E2 §9 B4
          await api.sayAs(Y, [api.flag('silla_libre') ? 'Bruno, Bruno becario, becario con silla... ¿Con silla? Ahora no. Se cae el CMS.'
            : 'Bruno, Bruno becario, becario sin silla... Ahora no. Se nos cae el CMS.',
          'Vuelve con un titular con número. El siete convierte.']);
          return;
        }
        await api.dialog('yoli');
      },
      'dar:cafe': async (api) => api.sayAs(Y, '¿Café? Llevo cuatro. El quinto lo mido.'),
      'dar:ficha_pagina_7': seq([[Y, '¿Una ficha de papel? ¿Tiene palabra clave?'], ['B', 'Tiene casillas.'], [Y, 'Qué vintage.']]),
      'dar:pieza_opa': async (api) => {                                     // E4 §3bis.2: la 1.ª vez, «Valiente.»; luego, el titulador
        if (api.once('pecera_yoli_valiente')) await api.sayAs(Y, '¿Sin número en el titular? ¿Sin "lo que nadie te cuenta"? Valiente.');
        await titulador(api);
      },
      'dar:album_eventos': async (api) => api.sayAs(Y, ['¿Fotos de eventos? Eso no lo ve nadie.', 'Bueno. Uno. El del fondo.']),
    },
      murmurs: ['Esto sube. Esto baja. Esto soy yo.', '"Incontable": cero búsquedas al mes.',
        '«Los expertos coinciden»... Ya buscaré expertos. Primero, que coincidan.'] },   // L29 + E4 O21
    // (E2 §2.6: Nemesio, `nerea_backlog`, ya no está: su mesa es el hotspot `mesa_guardia` y lo suyo lo hace Anselmo.)
    { id: R, when: ['ruben_libre', '!lector_derribado'], handlers: {
      mirar: 'Brais mira por la ventana. Espera al sol como quien espera una nómina.',
      hablar: async (api) => {
        // E1.5 (si ya lo oyó desde el armario, cpd.js `cpd_ruben_oyo_alta`, no lo pregunta otra vez)
        if (api.flag('herminia_de_alta') && !api.flag('cpd_ruben_oyo_alta') && api.once('pecera_ruben_herminia')) {
          await talk(api, [[R, '¿A ella le dieron el alta en cuarenta segundos?'], ['B', 'Es una herramienta.'], [R, 'Yo también. Pero sin pegatina.']]);
        }
        await api.sayAs(R, 'Estoy esperando a que salga el sol. Me han dicho que existe.');
      },
      'dar:cafe': async (api) => api.sayAs(R, 'Gracias. Lo primero caliente que no es un servidor.'),
      'dar:ticket_n1': async (api) => api.sayAs(R, 'Guárdalo tú. Si lo toco, me vuelvo a dar de alta.'),
      'dar:taper_huerfano': darTaper,
    },
      murmurs: ['AMANECER DETECTADO. LO QUE PASÓ DESPUÉS... Perdón. Aún no ha salido.', '¿El sol también va con ticket?'] },
    // §5.14: Valentín Retícula, cameo MUDO junto a la bandeja (fuera de 7.2, epílogo y créditos)
    { id: V, when: '!lector_derribado', handlers: {
      mirar: async (api) => api.say('Valentín Retícula, de Diseño y Producto. El cable de los cascos no va a nada.'),
      hablar: async (api) => {
        if (api.inc('pecera_valentin_n') === 1) {
          // E6 §6.5 (N8): cameo MUDO. Bruno a su izquierda (no le tapa); Valentín le mira, se quita un auricular
          // (variante `casco_fuera`, I1), espera con un globo «…» sin palabras y se lo vuelve a poner.
          await api.walkTo(V);
          api.faceActor(V, api.player);
          await api.say('¿No le molesta que le culpen de todo?');
          api.sfx('click');
          await api.anim(V, 'reach', 300);
          api.vestir(V, 'casco_fuera');
          await api.sayAs(V, '…', { ms: 1400 });
          const b = api.actorPos('bruno');                 // globo a los pies: encima de la cabeza le taparía el gesto
          await api.say('...Nada. Perdone.', b ? { at: [b.x, 141] } : undefined);
          api.vestir(V, null);
          api.sfx('click');
          await api.anim(V, 'reach', 300);
        } else await api.sayAs(V, 'Está en la bandeja.');
      },
      'dar:*': 'Se lo dejo en la mesa. Lo alinea con el borde sin mirarlo.',
      empujar: 'No. Está trabajando. Si le empujo, se le mueve un píxel.',
      tirar: 'No le tiro de la americana. Es de buen corte. Hasta yo lo noto.',
    },
      murmurs: null },
    // solo durante la escena 7.2: la escena lo coloca con api.placeActor
    { id: 'inigo_sinergia', when: () => false, handlers: {} },
    // E2 §2.5 · Leoncio Quesitos (Infografía), con árbol
    { id: L, when: '!lector_derribado', handlers: {
      mirar: 'Leoncio, Infografía. Ya no dibuja: mira dibujar a su IA.',
      hablar: async (api) => api.dialog('leoncio'),
      'dar:cafe': ley('Gracias. Herminia dice que es mi quinto. Me lo ha puesto en barras. Suben.'),
      'dar:ficha_pagina_7': ley('Tres casillas. Herminia lo pinta en semáforo. Estás en ámbar.'),
      'dar:acta_reunion': ley('En tarta: 50 % café, 50 % nada. El gráfico más honesto del año.'),
      'dar:pieza_opa': async (api) => {
        if (api.flag('pieza_recortada')) await api.sayAs(L, 'Veintitrés líneas. Cabe. Ella lo dijo antes que Teodoro.');
        else await api.sayAs(L, 'Sobra un 26 %. Te la ha medido ella. Yo te la sostengo, que pesa.');
      },
      'dar:*': ley('Herminia ya lo ha contado. Yo lo sostengo. Es mi parte.'),
      empujar: 'No. Está mirando a Herminia trabajar.',
    },
      murmurs: null },
    // E2 §2.5-2.6 · Anselmo Monolito, director de Desarrollo y dueño del tablero (hereda a Nemesio), con árbol
    { id: A, when: '!lector_derribado', handlers: {
      mirar: 'Anselmo, director de Desarrollo. Cinta en el cinto.',
      hablar: async (api) => api.dialog('anselmo'),
      'dar:album_eventos': async (api) => { anselmoCtx.sinSaludo = true; await api.dialog('anselmo', 'AN_ALBUM_INTRO'); },
      'dar:correo_evaristo': ans('¿Un correo impreso? De Controlling. De fuera. Pero con buena puntuación.'),
      'dar:pieza_opa': ans('¿Escrita fuera del CMS? Sistema paralelo. Te abro expediente. Mental.'),
      'dar:cafe': ans('¿De Gertrudis? No. Yo bebo de mi termo. Café de la casa.'),
      'dar:ticket_n1': ans('Un ticket cerrado. Es de Sistemas. Yo no lo he visto.'),
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
    { id: 'coro_a3', if: ['ruben_libre', '!lector_derribado', cercaDelCoro], voces: VOCES_CORO, discusiones: CORO_ACTO_3 },
    { id: 'coro_a2', if: ['cms_vivo', '!acto_3_iniciado', cercaDelCoro], voces: VOCES_CORO, discusiones: CORO_ACTO_2 },
    { id: 'coro', if: ['!lector_derribado', '!acto_3_iniciado', cercaDelCoro], voces: VOCES_CORO, discusiones: DISCUSIONES },
    { id: 'murmullos', if: '!lector_derribado', run: murmullo },
    { id: 'fondo', if: ['!lector_derribado', cercaDelCoro], voces: VOCES_CORO, discusiones: FONDO_YOLI },
  ],

  async onEnter(api) {
    murmuradoEstaVisita = false;
    if (api.getState('semaforo_ruido') !== 'rojo') api.setState('semaforo_ruido', 'rojo');   // E3 P8: el verde dura un segundo, nunca una partida
    // E5 §2.2.3: partida cargada a oscuras (o vieja): luz, Anselmo en su mesa y sin ventana; apagon_n se queda
    if (api.flag('pecera_oscuras')) {
      limpiarOscuras(api);
      anselmoEnSuSitio(api);
      api.setState('monitor_yoli', null);
    }
    if (api.getState('kanban')) { api.setState('kanban', null); api.repaint(); }
    if (api.getState('coro_desarrollo')) api.setState('coro_desarrollo', null);
    // epílogo (lector_derribado): la escena final coloca a la gente ella misma; aquí no se hace nada
    if (api.flag('lector_derribado') || api.flag('juego_terminado') || api.restoring) return;
    // como mucho una escena de entrada por visita, por este orden
    if (api.flag('torno_abierto') && !api.flag('inigo_presentado')) { await api.scene('presentacion_villano'); return; }
    // [P11] Íñigo pasa a Bruno a «Prescindible»: antes que cualquier otra escena de entrada salvo la presentación
    if (api.flag('casilla_firma') && !api.flag('acto_3_iniciado') && !api.flag('inigo_prescindible')) { await api.scene('pecera_inigo_prescindible'); return; }
    if (api.flag('acto_3_iniciado') && !api.flag('dos_ias_vista')) { await api.scene('pecera_dos_ias'); return; }
    if (api.flag('herminia_de_alta') && !api.flag('infografia_integrada')) { await api.scene('pecera_anexion'); return; }
    // E4 S5 · paso 40: el ganador de Discover (después de la anexión, para no romper XE4; §8.1)
    if (api.flag('acto_3_iniciado') && api.flag('pieza_escrita') && !api.flag('discover_ganador')) { await api.scene('pecera_opa_ganadora'); return; }
    if (api.flag('cms_vivo') && api.once('pecera_cms_entrada')) { await api.scene('pecera_cms_entrada'); return; }
    // [P4] la pantalla parpadea: primera entrada del Acto II con el CMS colgado (una vez)
    if (api.flag('acto_2_iniciado') && !api.flag('acto_3_iniciado') && !api.flag('cms_vivo') && api.once('pecera_parpadeo')) { await api.scene('pecera_parpadeo'); return; }
    if (api.flag('cafetera_viral') && api.once('pecera_viral')) { await api.scene('pecera_viral'); return; }
    if (api.flag('bruno_con_chaqueta')) { await api.scene('pecera_chaqueta'); return; }
    if (api.flag('bruno_con_banner')) await api.scene('pecera_banner');            // E2 §4.2.3 (una vez)
  },
}, art);
