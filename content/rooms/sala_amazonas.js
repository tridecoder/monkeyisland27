// SALA `sala_amazonas` — LÓGICA. Dueño: paquete D · «Planta noble y Dirección» (biblia §9.1). Biblia: §3.6, §7.7.6 (nodo
// Reunión de Gervasio), §7.7.4 (Lector Medio), P06 (la reunión infinita), P16 y clímax §7.4 (en ../escenas/climax.js).
// Adenda: §3.9 (tele, caja de cables, carteles), §4.7 (opción nueva de Gervasio), §9.4-9.7 (insertos del clímax), murmullos.
// El arte y la geometría están en ./art/sala_amazonas.art.js (artista de fondos).
// Estados del objeto `proyector` (para el artista): 'diapo_247' (Acto III) y 'diapo_248' (tras el ¡PLOF!, adenda 9.5).
import { buildRoom } from '../lib/room.js';
import art from './art/sala_amazonas.art.js';
import { SFX, rota } from '../escenas/planta_noble.js';
import { duelInigo, climaxActivo, climaxEntrada, climaxReintento, climaxEmpujon, replicasD4, PUNTOS_D4 } from '../escenas/climax.js';

const GERV = 'gervasio_acta', INIGO = 'inigo_sinergia', LECTOR = 'lector_medio';
const sayG = (api, t) => api.sayAs(GERV, t);
const sayI = (api, t) => api.sayAs(INIGO, t);
const gervasioAqui = (api) => { const p = api.actorPos(GERV); return !!(p && p.room === 'sala_amazonas' && api.isVisible(GERV)); };

// adenda §3.9 · la tele de videollamadas (rota con `tele_n`; tras la 5 vuelve a la 1)
const TELE = [
  ['Sale la cámara del vestíbulo. Celestino le narra el Ibex al ficus.'],
  ['«ENTRADA 2»: el tiempo de ayer. En diferido.'],
  ['«ENTRADA 3»: una videollamada de 2019. Ramírez, congelado. Con cruasán.'],
  ['«BUSCANDO SEÑAL». La busca con más ganas que yo.'],
  ['«ENTRADA 5»: «PLAN CERO PAPEL · DIAPOSITIVAS: 400 · DATOS: 0».', 'Alguien ha enchufado aquí a Herminia. Por cable.'],
];
async function usarTele(api) { const n = api.inc('tele_n'); await api.say(TELE[(n - 1) % TELE.length]); }

const CARTELES = [
  '«NO DEJÉIS TAZAS. – Dirección».',
  '«LAS TAZAS SON DE DIRECCIÓN. – Mercados».',
  '«ESTA SALA NO ES EL VENDING». Firmado por la cafetera.',
  '«ESTE CARTEL ESTÁ RESERVADO. – Íñigo».',
  '«¿QUIÉN HA CAMBIADO LOS CARTELES? – Todos».',
];

// §3.0: en el Acto III no se sale hasta ganar (salvo que falten réplicas: sin callejones, §0)
async function salir(api) {
  if (climaxActivo(api) && !api.flag('lector_derribado')) {
    if (api.flag('duelo_inigo_ganado')) { await api.say('Todavía no. A Íñigo le queda un dato. Asiente junto a la pantalla.'); return; }
    if (replicasD4(api) >= PUNTOS_D4) { await api.say('No me voy. Íñigo sigue en la 247 y yo sigo en copia.'); return; }
    await api.say('Vuelvo enseguida. La 247 no se va a mover.');
  }
  api.sfx('door');
  await api.goto('pajarera', 'sala_amazonas');
}

export default buildRoom({
  id: 'sala_amazonas',
  name: 'Sala Amazonas',
  music: 'm_sala_amazonas',
  flags: {
    sala_amazonas_climax_visto: 'bool · D · primera entrada del clímax 7.4 · D (versión corta al volver)',
    sala_amazonas_carteles_n: 'int · D · sala_amazonas · +1 por Mirar carteles_amazonas · D (rotación)',
    sala_amazonas_orden_n: 'int · D · sala_amazonas · +1 por Usar orden_del_dia · D',
    sala_amazonas_lector_cae: 'int · D · 7.4: caída del Lector (1-3; 0 de pie) · actors.js',
  },

  objects: [
    { id: 'sala_a_pajarera', name: 'puerta de los Despachos', exit: { room: 'pajarera' }, handlers: {
      ir: salir,
      usar: salir,
      abrir: 'Ya está abierta. Nadie sale. Es un hecho cultural.',
      cerrar: 'Si la cierro, esto se convierte en una reunión de verdad. No me atrevo.',
      mirar: 'La puerta. Abierta. Nadie la usa: el orden del día no lo permite.',
    } },
    { id: 'cartel_salida', name: 'cartel de salida', handlers: {
      mirar: '«SALIDA: AL TERMINAR EL ORDEN DEL DÍA». La puerta está abierta y nadie sale.',
      coger: 'Si me lo llevo, no sabrán cuándo salir. Bueno, ya no lo saben.',
      hablar: 'Le pregunto cuándo termina el orden del día. Me mira como un pósit.',
      empujar: 'Empujo la puerta de al lado. Estaba abierta. Nadie lo había comprobado.',
    } },
    { id: 'proyector', name: 'proyector', when: 'acto_3_iniciado', state: 'diapo_247', color: '#B4E4FF', handlers: {
      mirar: async (api) => {
        if (api.getState('proyector') === 'diapo_248') await api.say('Diapositiva 248: «El viaje continúa». Ya no la mira nadie.');
        else await api.say('Diapositiva 247 de 400: «Sinergias exponenciales: el viaje». No hay vuelta.');
      },
      usar: 'Le doy a «siguiente». La 247 se queda. Tiene más estabilidad que yo.',
      empujar: 'Lo empujo un poco. Zumba. La 247 aguanta.',
      cerrar: 'Si lo apago, Íñigo presenta a oscuras. Lo haría igual.',
      coger: 'Está atornillado al techo. Tadeo lo propuso para toda la web.',
    } },
    { id: 'orden_del_dia', name: 'orden del día', handlers: {
      mirar: async (api) => {
        if (api.flag('reunion_terminada')) await api.say('Todo tachado. Hasta «Siguientes pasos». Alguien lloraba.');
        else await api.say(['ORDEN DEL DÍA: 1. Previsión. 2. Previsión de la previsión. 3. Siguientes pasos.',
          'El punto 3 lleva sin tocarse desde marzo. Nadie se atreve.']);
      },
      usar: async (api) => {
        if (api.flag('reunion_terminada')) await api.say('Ya no queda nada que tratar. Es la pantalla más feliz del edificio.');
        else await api.say('Para tocar el punto 3 hay que decirlo en voz alta. Y a quien preside.');
      },
      coger: 'Es una pantalla. Si me la llevo, la reunión me sigue a casa.',
      hablar: 'Leo el punto 3 en voz baja. Uno de Mercados se estremece.',
    } },
    { id: 'planillo_mesa', name: 'planillo', when: ['reunion_terminada', '!has:planillo', '!duelo_maripaz_ganado'],
      pickup: 'planillo', pickupText: 'Me lo llevo. Aquí nadie lo echará de menos hasta marzo.', handlers: {
        mirar: 'El planillo de maqueta. Alguien lo ha soltado al huir.',
        usar: 'Lo leo en la mesa: página 7, Colchones Siestatón. Mejor me lo llevo.',
        tirar: 'Tiro de una esquina. Se deja. Es un planillo sin dueño desde hace un minuto.',
      } },
    { id: 'minicruasanes', name: 'mini-cruasanes', handlers: {
      mirar: async (api) => { await api.say(['Ochenta mini-cruasanes para cuarenta periodistas.', 'Las matemáticas nunca fallan: no llegan.']); },
      coger: 'Queda medio. Es de Mercados: lo tienen en cartera.',
      usar: 'Me como una miga. Sabe a reunión de marzo.',
      empujar: 'Acerco la bandeja a Mercados. Ni la miran. Están en el punto 3.',
    } },
    { id: 'botellines', name: 'botellines', state: 'en_fila', states: ['en_fila', 'volando', 'tumbados'], handlers: {
      mirar: async (api) => {
        if (api.getState('botellines') === 'tumbados') await api.say('Catorce botellines por los suelos. Uno sigue en pie. Es de Mercados.');
        else await api.say('Catorce botellines sin abrir. Aquí nadie bebe: se nota que se piensa.');
      },
      coger: 'Si abro uno, me lo imputan como gasto de representación.',
      abrir: 'Abrir uno es asumir un gasto. Mejor me deshidrato con dignidad.',
      empujar: async (api) => { api.sfx(SFX.botellines); await api.say('Los alineo. Catorce en fila. Parecen un comité.'); },
    } },
    { id: 'figurantes_mercados', name: 'redactores de Mercados', when: '!reunion_terminada', color: '#E0CCA4',
      murmurs: ['¿Sigue siendo marzo?', 'Yo propongo una reunión para ver el punto tres.', 'Entramos cinco minutitos. En marzo.',
        '¿Me veis la pantalla? ...¿Hola? ¿Me veis?', 'Que alguien pida sala para salir de la sala.'],
      handlers: {
        mirar: 'Tres redactores de Mercados. Aquí desde marzo. Uno tiene barba de comité.',
        hablar: 'Me miran como a un dividendo. Con esperanza y sin fe.',
        empujar: 'No reaccionan. Están en modo «a la espera de resultados».',
        coger: 'No se cogen. Cotizan. Y a la baja desde marzo.',
        'dar:cafe': 'Lo miran como a un dato nuevo. No se atreven: no está en el orden del día.',
        'dar:*': 'Lo miran. No lo cogen. Hasta que no se vote, no es suyo.',
      } },
    // ADENDA §3.9 (Actos I-II)
    { id: 'tele_amazonas', name: 'tele de videollamadas', when: '!acto_3_iniciado', handlers: {
      mirar: 'Una tele de videollamadas. Pegatina: «PULSAR ENTRADA 3. NO, LA 2. NO».',
      usar: usarTele,
      hablar: async (api) => {
        await api.say(['«¿Me veis la pantalla?». La tele no contesta.', 'Es la experiencia completa.']);
        if (!api.flag('reunion_terminada')) await api.sayFrom('figurantes_mercados', 'Se te ha congelado, chaval.');
      },
      coger: 'Está atornillada a la pared. Como el punto 3 al orden del día.',
      cerrar: 'La apago. Se enciende sola en «BUSCANDO SEÑAL». No se rinde.',
    } },
    { id: 'caja_cables', name: 'caja de cables', when: '!acto_3_iniciado', handlers: {
      mirar: async (api) => { await api.say(['Catorce cables y siete adaptadores. Uno adapta un adaptador a otro.', 'Hay uno que encaja consigo mismo. Lo dejo así: es feliz.']); },
      usar: usarTele,                         // «Usar con tele_amazonas: igual que Usar la tele»
      coger: 'Si me llevo un cable, alguien no podrá presentar. Tentador. No.',
      abrir: 'Ya está abierta. Desbordada. Como el calendario de la sala.',
      tirar: 'Tiro de un cable. Sale otro. Y otro. Es un truco de magia sin final.',
    } },
    { id: 'carteles_amazonas', name: 'carteles', when: '!acto_3_iniciado', handlers: {
      mirar: async (api) => { const n = rota(api, 'sala_amazonas_carteles_n'); await api.say(CARTELES[n % CARTELES.length]); },
      coger: 'Los carteles están en guerra y yo soy neutral. Como Suiza, pero becario.',
      'usar:movil': 'Les hago una foto. Así queda constancia de quién empezó.',
    } },
  ],

  actors: [
    { id: GERV, when: (api) => !api.flag('reunion_terminada') || api.flag('sala_abierta'),
      pos: (v) => (v.flag('acto_3_iniciado') ? 'rincon' : 'preside'),
      murmurs: ['Eso, en todo caso, lo hablamos.', 'Diecinueve años. Ni un marrón. Ni uno.',
        'Hoy me han preguntado tres veces por mi salud. Debo de estar fatal.'],
      handlers: {
        mirar: async (api) => {
          if (api.flag('acto_3_iniciado')) await api.say('Gervasio, en un rincón. Con un café que no le han servido.');
          else await api.say('Gervasio preside. Lleva en el punto 3 desde marzo.');
        },
        hablar: async (api) => {
          if (!api.flag('acto_3_iniciado')) { await api.dialog('gervasio_reunion'); return; }
          if (api.flag('lector_derribado')) await sayG(api, 'Diecinueve años y nadie lo había preguntado.');
          else if (api.flag('duelo_inigo_ganado')) await sayG(api, 'Lo que diga el Lector Medio.');
          else await sayG(api, 'Yo aquí solo estoy en copia. Como toda la empresa. Lo hablamos.');
        },
        'dar:planillo': async (api) => { await sayG(api, 'Eso lo coges tú. Ah, que ya lo tienes. Pues eso.'); },
        'dar:cafe': async (api) => { await sayG(api, '¿Un café? ¿A mí? Esto no estaba en el orden del día. Lo hablamos.'); },
        'dar:acta_reunion': async (api) => { await sayG(api, 'No, no. El acta es tuya. Yo ya cumplí. Por primera vez.'); },
        'dar:*': async (api) => { await sayG(api, 'Eso lo coges tú, que tienes la agenda más limpia.'); },
        empujar: 'Gervasio no se mueve. Diecinueve años esquivando marrones dan estabilidad.',
      } },
    { id: LECTOR, when: 'acto_3_iniciado',
      murmurs: ['A mí lo que me interesa es la economía. Y ahorrar.'],
      handlers: {
        mirar: async (api) => {
          if (api.flag('lector_derribado')) await api.say(['Boca abajo en el suelo, delante de la mesa.', 'Por detrás: «Atrezo – Focus group 2014».']);
          else if (api.flag('chaqueta_en_lector')) await api.say('Junto a la pantalla, el Lector Medio, con la chaqueta de Ramírez. Asiente.');
          else await api.say('Junto a la pantalla, el Lector Medio. Asiente.');
        },
        hablar: async (api) => {
          await api.sayAs(LECTOR, 'A mí lo que me interesa es la economía. Y ahorrar.');
          if (gervasioAqui(api) && !api.flag('lector_derribado')) await sayG(api, ['Lo que diga el Lector Medio.', '...Pues ya está decidido.']);
        },
        empujar: async (api) => {
          if (api.flag('lector_derribado')) { await api.say('Ya está en el suelo. Empujarlo más sería ensañarse con un cartón.'); return; }
          if (!api.flag('duelo_inigo_ganado') || !climaxActivo(api)) { await api.say('Todavía no. Primero, por escrito.'); return; }
          await api.scene('climax_empujon');
        },
        coger: 'Es más alto que yo y tiene más autoridad. No se coge: se consulta.',
        tirar: 'No tiro de la chaqueta de Ramírez. Aún tiene que volver a por ella.',
        'usar:chicle': 'No. Ya lleva celo. Dos adhesivos en un lector es golpe de Estado.',
        'dar:*': 'Se lo enseño. Asiente. Asiente a todo: es su único dato.',
      } },
    { id: INIGO, when: 'acto_3_iniciado',
      murmurs: ['Esto en verde. Esto en rosa. Esto en azul, que es excusa.', 'Diapositiva 248: «El viaje continúa».',
        '¿Y esto el Lector Medio lo entiende? Perfecto: asiente.'],
      handlers: {
        mirar: async (api) => {
          if (api.flag('lector_derribado')) await api.say('Íñigo se busca en su matriz. Se ha encontrado. No le gusta el cuadrante.');
          else await api.say('Íñigo, de pie, con el portátil. Para él, la 247 avanza.');
        },
        hablar: async (api) => {
          if (api.flag('lector_derribado')) { await sayI(api, '«Prescindible. Caro.» Lo pone mi propia matriz.'); return; }
          if (api.flag('duelo_inigo_ganado')) { await sayI(api, 'Ni un gesto en contra. Ni una pregunta. El mejor lector que he tenido.'); return; }
          if (!climaxActivo(api)) { await sayI(api, '¿Vacante? Esto es una Reunión de Dirección. Los becarios no tienen voz.'); return; }
          await climaxReintento(api);
        },
        'dar:cafe': async (api) => { await sayI(api, 'Yo solo tomo agua con gas y sinergias.'); },
        'dar:tarjeta_becario': async (api) => { await sayI(api, 'Perfecto. Con esto te doy de baja más rápido.'); },
        'dar:ticket_n1': async (api) => { await sayI(api, 'Eso, por escrito. Si no está en el hilo, no escala.'); },
        'dar:acta_reunion': async (api) => { await sayI(api, 'Eso, por escrito. Si no está en el hilo, no escala.'); },
        'dar:*': async (api) => { await sayI(api, 'Ese input no escala.'); },
        empujar: 'A un consultor no se le empuja. Se le factura. Y eso ya lo hace él.',
      } },
  ],

  dialogs: {
    // §7.7.6 · nodo Reunión (+ opción nueva de la adenda 4.7, antes de la despedida)
    gervasio_reunion: {
      actor: GERV, start: 'GV_REUNION',
      onStart: async (api) => { await sayG(api, 'Estamos en el punto tres. Llevamos en el punto tres desde marzo.'); },
      nodes: {
        GV_REUNION: {
          options: [
            { text: '¿Qué se decide aquí?', once: true, reply: 'Lo que diga el Lector Medio.' },
            { text: '¿Me deja la página 7?', once: true, reply: 'Eso lo coges tú, que tienes la agenda más limpia. Lo hablamos.' },
            { text: 'Bueno... ¿y cuáles son los siguientes pasos?', if: 'aurora_conto_pasos',
              do: async (api) => { await reunionTerminada(api); return 'exit'; } },
            { text: '¿Quién tiene reservada la sala?', once: true,
              reply: 'Ramírez. Los viernes a las 20:59.',
              lines: [['player', '¿Y dónde está Ramírez?'], [GERV, 'Desayunando. Desde 2019. Pero la reserva se respeta. Lo hablamos.']] },
            { text: 'Me voy.', exit: true, reply: 'Lo hablamos.' },
          ],
        },
      },
    },
  },
  duels: { inigo: duelInigo },
  scenes: {
    climax_entrada: climaxEntrada,
    climax_empujon: climaxEmpujon,
  },
  defaults: {},
  ambient: [],

  async onEnter(api) {
    // idempotente (también al cargar): tras el ¡PLOF! los botellines siguen tumbados y el Lector, en el suelo
    const bot = api.flag('lector_derribado') ? 'tumbados' : 'en_fila';
    if (api.getState('botellines') !== bot) api.setState('botellines', bot);
    if (api.flag('sala_amazonas_lector_cae')) api.setFlag('sala_amazonas_lector_cae', 0);
    // P16: «Usar puerta_sala con todo» (lo abre el paquete B) → escena 7.4 y duelo D4. Nunca tras ganar.
    if (climaxActivo(api) && !api.flag('duelo_inigo_ganado')) await api.scene('climax_entrada');
  },
}, art);

// P06 · «¿y cuáles son los siguientes pasos?»: se levantan todos a la vez, como palomas
async function reunionTerminada(api) {
  await api.wait(1200);                                // silencio; los tres de Mercados levantan la cabeza a la vez
  await sayG(api, 'Los... siguientes...');
  api.sfx(SFX.sillas); api.shake(500, 2);
  api.setFlag('reunion_terminada', true);              // los figurantes salen (su `when`); el planillo queda en la mesa
  await api.wait(600);
  await api.walkActor(GERV, 'sala_a_pajarera');
  api.faceActor(GERV, 'right');
  await sayG(api, 'Lo hablamos.');
  api.sfx('door');
}
