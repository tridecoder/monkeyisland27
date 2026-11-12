// PLANTILLA DE LÓGICA DE SALA (no registrada; el motor la ignora). Las 9 salas ya existen como stubs:
// edita content/rooms/<id>.js directamente. Esta plantilla muestra TODAS las piezas disponibles.
// La pareja de arte es content/rooms/art/_plantilla.art.js. Referencia: docs/CONTENT_SCHEMA.md.
import { buildRoom } from '../lib/room.js';
import art from './art/_plantilla.art.js';
// import dialogosExtra from './plantilla.dialogos.js';     // tus archivos extra: content/rooms/<id>.<algo>.js
// import { escenaFinal } from '../escenas/final.js';         // o content/escenas/<nombre>.js

export default buildRoom({
  id: 'plantilla',                       // = nombre del archivo = clave en la biblia §3
  name: 'Sala de ejemplo',               // sale en las ranuras de guardado
  // music: 'm_plantilla',               // por defecto 'm_<id>'; null = silencio
  flags: {                               // flags LOCALES (solo esta sala los lee): prefijo '<id>_'
    plantilla_cajon_visto: 'bool · Mirar cajón · Mirar cajón (2.ª vez)',
  },

  objects: [
    // Mirar con estado, Coger que da un objeto, Usar con un objeto de inventario
    {
      id: 'cajon', name: 'cajón', state: 'cerrado', states: ['cerrado', 'abierto'],   // `states` documenta los sprites del arte
      handlers: {
        mirar: async (api) => {
          if (api.getState('cajon') === 'abierto') await api.say('Abierto. Huele a 1994.');
          else await api.say(api.flag('plantilla_cajon_visto') ? 'Sigue cerrado.' : 'Un cajón. Cerrado.');
          api.setFlag('plantilla_cajon_visto', true);
        },
        abrir: async (api) => { api.setState('cajon', 'abierto'); api.sfx('open'); await api.say('Lo abro.'); },
        'usar:tarjeta_becario': 'No es una ranura. Es un cajón.',
        'dar:*': 'No acepta regalos.',
      },
    },
    // objeto que solo existe mientras se cumple una condición (`when`: se evalúa en cada frame)
    { id: 'papel', name: 'papel', when: ['acto_2_iniciado', '!has:planillo'], desc: 'Un papel.' },
    // SALIDA: deja siempre `exit: { room }` (el walkthrough y check.mjs usan ese grafo).
    // El bloqueo va en handlers.ir (se mira antes que `exit`); la entrada por defecto es el id de esta sala.
    {
      id: 'plantilla_a_vestibulo', name: 'puerta', exit: { room: 'vestibulo' },
      handlers: {
        ir: async (api) => {
          if (!api.flag('torno_abierto')) { await api.say('Cerrado. Como todo lo bueno.'); return; }
          api.sfx('door'); await api.goto('vestibulo', 'plantilla');
        },
        mirar: 'La puerta.',
      },
    },
  ],

  // PNJ: posición en el arte (layout[id].at y .positions). `when` = presencia (al entrar y al acabar cada script).
  actors: [
    {
      id: 'gervasio_acta', when: 'reunion_terminada', pos: (v) => (v.flag('acto_3_iniciado') ? 'rincon' : 'mesa'),
      handlers: {
        hablar: async (api) => { await api.dialog('gervasio_plantilla'); },
        mirar: 'Gervasio. Tres móviles y ninguna tarea.',
        'dar:planillo': async (api) => { await api.sayAs('gervasio_acta', 'Eso lo coges tú. Ah, que ya lo tienes. Pues eso.'); },
      },
    },
  ],

  dialogs: {
    gervasio_plantilla: {
      actor: 'gervasio_acta', start: 'inicio',
      nodes: {
        inicio: {
          options: [
            { text: '¿Qué se decide aquí?', reply: 'Lo que diga el Lector Medio.' },
            { text: '¿Me deja la página 7?', once: true, reply: ['Eso lo coges tú.', 'Lo hablamos.'] },
            { text: 'Necesito el acta.', if: 'acto_3_iniciado', do: async (api) => { await api.duel('ejemplo'); return 'exit'; } },
            { text: 'Me voy.', exit: true, reply: 'Lo hablamos.' },
          ],
        },
      },
    },
  },

  // DUELOS de esta sala (§6). `api.duel('ejemplo')` desde cualquier sitio. Ver CONTENT_SCHEMA §10.
  duels: {
    ejemplo: {
      actor: 'gervasio_acta',
      subject: 'Redactar el acta de la última Reunión de Dirección',     // el motor añade los «RE: »
      assigned: 'Vacante (becario)',                      // «Asignado a:» inicial
      deck: ['R07', 'R01', 'R14', 'R03', 'R05'],          // orden fijo (§6.4)
      winScore: 3,                                        // sin remates: gana a 3 aciertos; 3 fallos = derrota
      intro: ['Ah, Vacante. El acta de la reunión hay que redactarla.', 'Te lo pongo por escrito.'],
      hurt: ['Eso habría que hablarlo.', 'Lo hablamos. Bueno, no.'],   // rotan en orden
      taunt: ['Lo hablamos. O no.', 'Eso lo coges tú, que tienes la agenda limpia.'],
      defeatLines: ['Asignada a ti. El acta, digo. Tráemela mañana. Lo hablamos.'],
      onWin: async (api) => { await api.sayAs('gervasio_acta', 'Diecinueve años sin un marrón.'); },
      // remates (jefes): finishers: [{ atScore: 3, text: '...', object: 'manual_fax', script: async (api, duel) => {}, wrongObject: { movil: '...' } }]
    },
  },

  scenes: {
    // api.scene('plantilla_saludo') desde cualquier sala
    plantilla_saludo: async (api) => { await api.say('Hola.'); },
  },

  defaults: {},                          // respuestas por defecto solo para esta sala
  ambient: [
    { every: [9000, 16000], if: '!acto_3_iniciado', run: async (api) => { await api.sayAs('gervasio_acta', 'Lo hablamos.'); } },
  ],

  async onEnter(api) {
    // en CADA entrada y al cargar partida: idempotente. Escenas de primera vez con api.once():
    if (api.once('plantilla_primera_vez')) await api.say('Primera vez aquí.');
  },
  async onExit(api) {},
}, art);
