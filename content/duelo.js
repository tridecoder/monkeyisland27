// DATOS COMUNES del duelo «RESPONDER A TODOS» (biblia §6; plan de comedia §7). ARCHIVO COMPARTIDO: no lo edita ningún autor de sala.
// Cada rival (mazo, asunto, líneas, remates) lo define el autor de SU sala en `duels: { <id>: {...} }`
// de su archivo de lógica — ver docs/CONTENT_SCHEMA.md §10. Ids de duelo: maripaz, teodoro, gervasio, inigo.

export default {
  // §6.3 — las 14 parejas (+ R15/R16 de la adenda 7.1). `flag` = cómo se aprende (api.learnReply('rep_XX')). El menú las muestra en este orden.
  pairs: [
    { id: 'R01', flag: 'rep_01', attack: 'Como ya comenté en mi anterior correo, que parece que nadie ha leído...', reply: 'Lo leímos todos. Por eso no contestó nadie.' },
    { id: 'R02', flag: 'rep_02', attack: 'Con el debido respeto...', reply: 'Gracias por avisar antes de faltármelo.' },
    { id: 'R03', flag: 'rep_03', attack: 'Esto lo necesitaba para ayer.', reply: 'Ayer no puedo. Te miro hueco para anteayer.' },
    { id: 'R04', flag: 'rep_04', attack: 'Es que tú eres el que mejor escribe.', reply: 'Y tú el que mejor delega. Por eso me escribes a mí.' },
    { id: 'R05', flag: 'rep_05', attack: 'Que esto no salga de aquí.', reply: 'Tranquilo: de aquí no sale ni el wifi.' },
    { id: 'R06', flag: 'rep_06', attack: '¿Esto lo has contrastado?', reply: 'Con dos fuentes y media. La media dijo «yo no te he dicho nada».' },
    { id: 'R07', flag: 'rep_07', attack: 'Me consta que esto ya lo hablamos.', reply: 'A ti te consta. A mí me consta que hablabas tú.' },
    { id: 'R08', flag: 'rep_08', attack: 'Te escribo desde el más absoluto cariño.', reply: 'Y yo te leo desde el más absoluto modo avión.' },
    { id: 'R09', flag: 'rep_09', attack: 'Ese dato está sacado de contexto.', reply: 'Tráeme el contexto. Le hago una pieza aparte: «El contexto, explicado».' },
    { id: 'R10', flag: 'rep_10', attack: 'Estamos analizando todas las opciones.', reply: 'O sea, que no sabéis qué hacer, pero en tabla dinámica.' },
    { id: 'R11', flag: 'rep_11', attack: 'Quedo a la espera de tus comentarios.', reply: 'Espera sentado. Si encuentras silla.' },
    { id: 'R12', flag: 'rep_12', attack: 'Hay que poner las luces largas.', reply: 'Puestas. Ahora se ve perfectamente que no hay carretera.' },
    { id: 'R13', flag: 'rep_13', attack: 'No es un despido: es una salida en valor.', reply: 'Claro. Y la carta de despido es una newsletter personalizada.' },
    { id: 'R14', flag: 'rep_14', attack: 'Esto lo podemos ver en una reunión rápida.', reply: 'Perfecto. ¿Te va en marzo? Es cuando acaban las rápidas.' },
    // adenda 7.1: solo las usa D4 (Íñigo), al final del mazo
    { id: 'R15', flag: 'rep_15', attack: 'Lo he consultado con la IA y está de acuerdo conmigo.', reply: 'Lo sé. Me lo ha contado ella. Se llama Rubén.' },
    { id: 'R16', flag: 'rep_16', attack: 'Eso es un detalle sin importancia.', reply: 'Una coma también lo era. Hasta que alguien la firmó.' },
  ],

  // plan §7.5 — FLOJAS: en el menú sale UNA cada asalto, rotando por rival (el comodín entra en la rotación). Fallan
  // siempre y cada rival contesta con su línea (`answers[<id de duelo>]`; si no, `answerFax` para el fax, si no `answer`).
  // `only: [ids]` = solo en esos duelos. La contestación se dice SIEMPRE, también en el tercer fallo.
  weakReplies: [
    { text: 'Te lo miro y te digo.', answer: 'Ya. Te lo miro yo también.',
      answers: { maripaz: 'Te lo miro y te facturo.', teodoro: 'MIRAR NO CUENTA. MEDIR, SÍ.', gervasio: 'Eso es mío. No me lo copies.', inigo: 'Perfecto. Te pongo en «Pendiente». Es azul.' } },
    { text: '¿Eso no lo llevaba otro departamento?', answer: 'Lo llevaba. Ahora lo llevas tú.',
      answers: { maripaz: 'Lo llevaba. Ahora lo llevas tú. Con IVA.', teodoro: 'AQUÍ NO HAY OTRO. HAY ESTE.', gervasio: 'Lo llevaba. Se ha delegado. Mira quién está delante.', inigo: 'Ya no hay departamentos. Hay cuadrantes.' } },
    { text: '¿Me lo pones por escrito?', answer: 'Te lo estoy poniendo por escrito. Es un correo.',
      answers: { maripaz: 'Por escrito es más caro. (*Tinta aparte.)', teodoro: 'ES UN FAX, CHAVAL. MÁS ESCRITO, IMPOSIBLE.', gervasio: '¿Por escrito? ¿Con mi nombre? No, no, no.', inigo: 'Ya está por escrito. En la diapositiva 247.' } },
    { text: 'Eso lo ha hecho la IA.', answer: 'Pues que conteste ella.',
      answers: { maripaz: '¿La IA? ¿Y quién la patrocina?', teodoro: 'LA IA NO MIDE. NO CABE.', gervasio: 'Pues se le delega a la IA. ¿Tiene agenda?', inigo: 'La IA no se equivoca, Vacante. Se optimiza.' } },
    { text: '¿Y usted cómo se encuentra? De salud, digo.', answer: 'Estupendamente. La plaza no se hereda.',
      answers: { maripaz: 'Estupendamente. La plaza no se hereda.', teodoro: 'MÁS SANO QUE LA GOYITA. Y LA GOYITA TIRA.', gervasio: 'Hoy me lo han preguntado tres veces. ¿Estoy mal?', inigo: 'Yo no tengo plaza. Tengo chófer. Es escalable.' } },
    { text: '¿Y cuáles son los siguientes pasos?', only: ['inigo'], answer: 'Me alegra que lo preguntes. Diapositiva 312.',
      answers: { inigo: ['Me alegra que lo preguntes. Diapositiva 312.', '«Siguientes pasos de los siguientes pasos».'] } },
  ],

  // plan §7.6 — acertar hace gracia: { <id de duelo>: { <pareja>: línea | [líneas] | [[actor, línea], ...] } }. Manda
  // sobre la rotación `hurt` del rival. Otro actor (Rubén en D4) solo habla si está en la sala.
  hurtByPair: {
    maripaz: { R08: '¿Modo avión? Eso me lo patrocina una aerolínea. (*No.)', R11: 'Me lo apunto.' },
    teodoro: { R02: ['ESO ME LO DIJO ELLA. EN 1996.', '...CABE.'], R06: 'LA MEDIA FUENTE ERA YO. NO LO REPITAS.' },
    gervasio: { R07: 'Me consta que... Bueno. Se constaba.', R14: '¿Marzo? Marzo está muy bien. Se agradece. Pero no.' },
    inigo: {
      R10: 'Interesante. Lo pongo en azul.',
      R12: '...Eso es una visión muy pesimista de la carretera.',
      R13: [['inigo_sinergia', 'Eso lo escribió alguien brillante.'], ['ruben', 'Yo. Perdón.']],
      R15: [['inigo_sinergia', '...Rubén, ¿tú le has contado algo?'], ['ruben', 'TODO. Perdón. Se me escapa.']],
      R16: 'Esa coma no estaba en mi framework.',
    },
  },
  // adenda 7.4: cameo decorativo (no suma ni resta): tras el PRIMER acierto de Bruno en ese duelo, una sola vez
  // en toda la partida, entra esta línea en el hilo del correo.
  cameos: {
    inigo: { from: 'Tadeo Adjunto respondió a todos:', text: '«RV: Resumen IA: todos de acuerdo»!!', ms: 4200 },
  },
  // §7.1.13 — comodín: entra en la rotación de flojas; la 1.ª vez en un duelo no suma ni resta (el rival repite el
  // ataque); la 2.ª cuenta como fallo.
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
      // «ticket_n1 en el remate B» y «acta_reunion en el remate A» van en el `wrongObject` de cada remate (paquete D)
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
    defeatCc: 'Toda la empresa',
    defeatAssigned: 'Vacante',
    // Línea de derrota POR DEFECTO (rótulo del narrador). Cada rival pone la suya en su sala: `defeatLine` (plan §7.7).
    defeatLine: ['narrator', 'RESPUESTA AUTOMÁTICA: «Su correo es muy importante. Por eso lo archivamos.»'],
    // §7.1.5: quién entra en copia tras el CC propio del rival (`ccSteps` / `cc1` del rival): 2.º fallo, 3.º fallo
    ccSteps: ['Toda la planta', 'Toda la empresa'],
    // §7.1.10: retirarse no tiene consecuencia; el hilo lo dice
    retireThread: { from: 'RV:', text: 'Bruno ha abandonado el hilo.' },
  },

  music: 'm_duelo',
};
