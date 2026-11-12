// DATOS COMUNES del duelo «RESPONDER A TODOS» (biblia §6). ARCHIVO COMPARTIDO: no lo edita ningún autor de sala.
// Cada rival (mazo, asunto, líneas, remates) lo define el autor de SU sala en `duels: { <id>: {...} }`
// de su archivo de lógica — ver docs/CONTENT_SCHEMA.md §10. Ids de duelo: maripaz, teodoro, gervasio, inigo.

export default {
  // §6.3 — las 14 parejas (+ R15/R16 de la adenda 7.1). `flag` = cómo se aprende (api.learnReply('rep_XX')). El menú las muestra en este orden.
  pairs: [
    { id: 'R01', flag: 'rep_01', attack: 'Como ya comenté en mi anterior correo, que parece que nadie ha leído...', reply: 'Lo leímos todos. Por eso no contestó nadie.' },
    { id: 'R02', flag: 'rep_02', attack: 'Con el debido respeto...', reply: 'Gracias por avisar antes de faltármelo.' },
    { id: 'R03', flag: 'rep_03', attack: 'Esto lo necesitaba para ayer.', reply: 'Ayer estaba con lo de anteayer. Pídeselo a mañana, que está libre.' },
    { id: 'R04', flag: 'rep_04', attack: 'Es que tú eres el que mejor escribe.', reply: 'Y tú el que mejor delega. Cada uno con su don.' },
    { id: 'R05', flag: 'rep_05', attack: 'Que esto no salga de aquí.', reply: 'Tranquilo: de aquí no sale ni el wifi.' },
    { id: 'R06', flag: 'rep_06', attack: '¿Esto lo has contrastado?', reply: 'Con dos fuentes y media. La media dijo «yo no te he dicho nada».' },
    { id: 'R07', flag: 'rep_07', attack: 'Me consta que esto ya lo hablamos.', reply: 'A ti te consta. A mí me consta que hablabas tú.' },
    { id: 'R08', flag: 'rep_08', attack: 'Te escribo desde el más absoluto cariño.', reply: 'Y yo te leo desde el más absoluto modo avión.' },
    { id: 'R09', flag: 'rep_09', attack: 'Ese dato está sacado de contexto.', reply: 'Dame el contexto y lo pongo en el subtítulo, que ahí no lo lee nadie.' },
    { id: 'R10', flag: 'rep_10', attack: 'Estamos analizando todas las opciones.', reply: 'O sea, que no sabéis qué hacer, pero en tabla dinámica.' },
    { id: 'R11', flag: 'rep_11', attack: 'Quedo a la espera de tus comentarios.', reply: 'Espera sentado. Si encuentras silla.' },
    { id: 'R12', flag: 'rep_12', attack: 'Hay que poner las luces largas.', reply: 'Las pongo, pero el coche es de empresa y no pasa la ITV.' },
    { id: 'R13', flag: 'rep_13', attack: 'No es un despido: es una salida en valor.', reply: 'Claro. Y la carta de despido es una newsletter personalizada.' },
    { id: 'R14', flag: 'rep_14', attack: 'Esto lo podemos ver en una reunión rápida.', reply: 'O en un correo de una línea. Este. De nada.' },
    // adenda 7.1: solo las usa D4 (Íñigo), al final del mazo
    { id: 'R15', flag: 'rep_15', attack: 'Lo he consultado con la IA y está de acuerdo conmigo.', reply: 'Normal. Se lo has preguntado tú.' },
    { id: 'R16', flag: 'rep_16', attack: 'Eso es un detalle sin importancia.', reply: 'Una coma también lo era. Hasta que alguien la firmó.' },
  ],

  // §6.6 — respuestas flojas: siempre en el menú, siempre fallan. `answer` lo dice el rival; `answerFax`, Teodoro.
  weakReplies: [
    { text: 'Te lo miro y te digo.', answer: 'Ya. Como lo del trimestre pasado.' },
    { text: '¿Eso no lo llevaba otro departamento?', answer: 'Lo llevaba. Ahora lo llevas tú.' },
    { text: '¿Me lo pones por escrito?', answer: 'Te lo estoy poniendo por escrito. Es un correo.', answerFax: 'Es un fax, chaval. Más por escrito, imposible.' },
    // adenda 7.3: `answers[<id de duelo>]` = contestación propia de ese rival (si no, `answerFax` / `answer`).
    // `offOnce` = [actor, línea]: se oye en off la PRIMERA vez en toda la partida (no suma ni resta).
    { text: 'Eso es cosa de Diseño.', answer: 'Diseño se fue a las seis y media. Con todo entregado.',
      answerFax: 'DISEÑO ME MANDA LAS PÁGINAS A SU HORA. NO COMO OTROS.',
      answers: { inigo: 'Diseño entrega a tiempo. No sé en qué cuadrante ponerlos.' },
      offOnce: ['coro_desarrollo', 'CORO: ¡ESO! ¡DISEÑO!'] },
    // adenda 7.3 (guiño 8, plazas de garaje)
    { text: '¿Y usted cómo se encuentra? De salud, digo.', answer: 'Estupendamente. La plaza no se hereda, Vacante.',
      answerFax: 'MÁS SANO QUE LA GOYITA. Y LA GOYITA TIRA.',
      answers: { inigo: 'Yo no tengo plaza. Tengo chófer. Es escalable.' } },
  ],

  // adenda 7.2: `hurt` específico de un rival al recibir una pareja concreta { <id de duelo>: { <pareja>: línea } }.
  // Tiene prioridad sobre la rotación `hurt` del rival (que define su sala).
  hurtByPair: {
    inigo: { R15: '...Lo pongo en azul.', R16: 'Esa coma no estaba en mi framework.' },
  },
  // adenda 7.4: cameo decorativo (no suma ni resta): tras el PRIMER acierto de Bruno en ese duelo, una sola vez
  // en toda la partida, entra esta línea en el hilo del correo.
  cameos: {
    inigo: { from: 'Tadeo Adjunto respondió a todos:', text: '«RV: Resumen IA: todos de acuerdo»!!', ms: 4200 },
  },
  // §6.6 — comodín: la 1.ª vez en un duelo no suma ni resta (el rival repite el ataque); la 2.ª cuenta como fallo.
  comodin: {
    text: 'Enviado desde mi móvil, disculpa la brevedad.',
    answer: 'Te espero.',
    answerFax: 'Enviado desde mi fax. Disculpa la longitud.',
    again: 'Llevas toda la noche con el móvil. Ya no te creo.',
  },

  // §6.7 — objetos equivocados en un remate (no cuentan como fallo). Por id de duelo; '*' = cualquier otro.
  // Un remate puede añadir/sobrescribir con su propio `wrongObject`.
  wrongObject: {
    '*': 'Eso no encaja en este hilo.',
    teodoro: {
      movil: '¿Me vas a llamar? Estoy aquí. A dos metros.',
      tarjeta_becario: 'Una tarjeta sin foto. Como tu firma.',
      libreta_replicas: 'Ya te he leído las réplicas. No caben.',
      boli_muerto: 'LOS MUERTOS NO SE FAXEAN. SE ENTIERRAN EN CUERPO 9.',      // adenda 7.5
      '*': 'Eso no se faxea.',
    },
    inigo: {
      movil: 'Si me grabas, te facturo los derechos de imagen.',
      tarjeta_becario: 'Sin foto no estás en mi matriz. Ah, sí: en «Ideal».',
      libreta_replicas: 'Bonito cuaderno. Low-cost.',
      manual_fax: '¿Un manual? Yo no leo manuales: los facturo.',
      boli_muerto: '¿Un boli? Yo firmo con el dedo. En la tableta.',            // adenda 7.5
      '*': 'Ese input no escala.',
      // «ticket_n1 en el remate B» y «acta_consejo en el remate A» van en el `wrongObject` de cada remate (paquete D)
    },
  },

  // Textos fijos de la ventana de correo (§6.2).
  texts: {
    to: 'Todos',
    plusOne: { from: 'planta.vestibulo@:', text: '+1. Totalmente de acuerdo con Bruno.' },
    useObject: '[Usar objeto]',
    retire: '[Retirarse del hilo]',
    pickPrompt: 'Adjuntar al hilo:',
    notReady: 'Aún no tengo con qué contestarle. Debería cotillear más.',
    defeatCc: 'Dirección',
    defeatAssigned: 'Vacante',
    // §6.2.6 (v2): «RESPUESTA AUTOMÁTICA DE DIRECCIÓN: Lo que diga Gervasio.» Ya no la dice el cartón (el Lector Medio
    // solo reproduce su grabación): sale como rótulo del narrador.
    defeatLine: ['narrator', 'RESPUESTA AUTOMÁTICA DE DIRECCIÓN: «Lo que diga Gervasio.»'],
  },

  music: 'm_duelo',
};
