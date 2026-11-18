// DATOS COMUNES del duelo «RESPONDER A TODOS» (biblia §6; plan de comedia §7; ENMIENDA E2 §4.3, §5.5, §7.5).
// E2 — lo que va en las SALAS (no aquí): mazos de D1 (igual), D2 sin R03 (['R06', 'R02', 'R09'], remate en atScore 2,
// P3; E6 §5.1: atScore 3 y `cabe` de la R09), D3 sin R14 (['R07', 'R01', 'R03', 'R05'], remate en atScore 2, P2; E6 §5.2:
// mazo ['R07', 'R03', 'R01', 'R05']) y D4 (['R10', 'R12', 'R13', 'R05', 'R16',
// 'R01', 'R07', 'R15'], PUNTOS_D4 = 5, remate C con `correo_evaristo` en atScore 5, P4). ARCHIVO COMPARTIDO: no lo edita ningún autor de sala.
// Cada rival (mazo, asunto, líneas, remates) lo define el autor de SU sala en `duels: { <id>: {...} }`
// de su archivo de lógica — ver docs/CONTENT_SCHEMA.md §10. Ids de duelo: maripaz, teodoro, gervasio, inigo.

import { DONDE } from './pistas.js';

// E6 §4.3: dos ramas de la misma floja (la de por defecto y la de Maripaz): una constante
const SALUD = 'Estupendamente. La plaza no se hereda.';

export default {
  // [P9] (con [P15]): nueve réplicas nuevas (R02, R03, R04, R05, R07, R08, R09, R11, R13); ataque nuevo en R02, R04 y R11.
  // §6.3 — las 14 parejas (+ R15/R16 de la adenda 7.1). `flag` = cómo se aprende (api.learnReply('rep_XX')). El menú las muestra en este orden.
  pairs: [
    { id: 'R01', flag: 'rep_01', attack: 'Como ya comenté en mi anterior correo, que parece que nadie ha leído...', reply: 'Lo leímos todos. Por eso no contestó nadie.' },
    { id: 'R02', flag: 'rep_02', attack: 'Corrígeme si me equivoco.', reply: 'Con mucho gusto: te equivocas.' },
    { id: 'R03', flag: 'rep_03', attack: 'Esto lo necesitaba para ayer.', reply: 'Ayer fue cuando empezaste la frase.' },
    { id: 'R04', flag: 'rep_04', attack: 'Esto te va a dar mucha visibilidad.', reply: 'Si valiera algo, me la cobrarías.' },
    { id: 'R05', flag: 'rep_05', attack: 'Que esto no salga de aquí.', reply: 'Me lo estás diciendo en un responder a todos.' },
    { id: 'R06', flag: 'rep_06', attack: '¿Esto lo has contrastado?', reply: 'Con dos fuentes y media. La media dijo «yo no te he dicho nada».' },
    { id: 'R07', flag: 'rep_07', attack: 'Me consta que esto ya lo hablamos.', reply: '¿En qué acta consta?' },
    { id: 'R08', flag: 'rep_08', attack: 'Te escribo desde el más absoluto cariño.', reply: 'Se nota. Has puesto a mi jefe en copia.' },
    { id: 'R09', flag: 'rep_09', attack: 'Ese dato está sacado de contexto.', reply: 'Claro que lo saqué. El contexto no cabía en la pieza.' },
    { id: 'R10', flag: 'rep_10', attack: 'Estamos analizando todas las opciones.', reply: 'O sea, que no sabéis qué hacer, pero en tabla dinámica.' },
    { id: 'R11', flag: 'rep_11', attack: '¿Has podido verlo?', reply: 'Poder, he podido.' },
    { id: 'R12', flag: 'rep_12', attack: 'Hay que poner las luces largas.', reply: 'Puestas. Ahora se ve perfectamente que no hay carretera.' },
    { id: 'R13', flag: 'rep_13', attack: 'No es un despido: es una salida en valor.', reply: '¿A cuántos días por año?' },
    { id: 'R14', flag: 'rep_14', attack: 'Esto lo podemos ver en una reunión rápida.', reply: 'Perfecto. ¿Te va en marzo? Es cuando acaban las rápidas.' },
    // adenda 7.1: solo las usa D4 (Íñigo), al final del mazo
    { id: 'R15', flag: 'rep_15', attack: 'Lo he consultado con la IA y está de acuerdo conmigo.', reply: 'Lo sé. Me lo ha contado ella. Se llama Brais.' },
    // E2 §5.2: se aprende al escuchar a Evaristo hasta el final (E_REVELA, paso 28); en D4 va QUINTA (mazo de P4)
    { id: 'R16', flag: 'rep_16', attack: 'Eso es un detalle sin importancia.', reply: 'Una coma también lo era. Hasta que alguien la firmó.' },
  ],

  // plan §7.5 — FLOJAS: en el menú sale UNA cada asalto, rotando por rival (el comodín entra en la rotación). Fallan
  // siempre y cada rival contesta con su línea (`answers[<id de duelo>]`; si no, `answerFax` para el fax, si no `answer`).
  // `only: [ids]` = solo en esos duelos. La contestación se dice SIEMPRE, también en el tercer fallo.
  weakReplies: [
    { text: 'Te lo miro y te digo.', answer: 'Ya. Te lo miro yo también.',
      answers: { maripaz: '¿Me lo miras? Eso es una impresión. Te la cobro.', teodoro: 'MIRAR NO CUENTA. MEDIR, SÍ.', gervasio: 'Eso es mío. No me lo copies.', inigo: 'Perfecto. Te pongo en «Pendiente». Es azul.' } },
    { text: '¿Eso no lo llevaba otro departamento?', answer: 'Lo llevaba. Ahora lo llevas tú.',
      answers: { maripaz: 'Lo llevaba. Ahora lo llevas tú. Con IVA.', teodoro: 'AQUÍ NO HAY OTRO. HAY ESTE.', gervasio: 'Lo llevaba. Se ha delegado. Mira quién está delante.', inigo: 'Ya no hay departamentos. Hay cuadrantes.' } },
    { text: '¿Me lo pones por escrito?', answer: 'Te lo estoy poniendo por escrito. Es un correo.',
      answers: { maripaz: 'Por escrito es más caro. Lleva anuncio.', teodoro: 'ES UN FAX, CHAVAL. MÁS ESCRITO, IMPOSIBLE.', gervasio: '¿Por escrito? ¿Con mi nombre? No, no, no.', inigo: 'Ya está por escrito. En la diapositiva 247.' } },
    { text: 'Eso lo ha hecho la IA.', answer: 'Pues que conteste ella.',
      answers: { maripaz: '¿La IA? ¿Y quién la patrocina?', teodoro: 'LA IA NO MIDE. NO CABE.', gervasio: 'Pues se le delega a la IA. ¿Tiene agenda?', inigo: 'La IA no se equivoca, Vacante. Se optimiza.' } },
    { text: '¿Y usted cómo se encuentra? De salud, digo.', answer: SALUD,
      answers: { maripaz: SALUD, teodoro: 'MÁS SANO QUE LA BENITA. Y LA BENITA TIRA.', gervasio: 'Hoy me lo han preguntado tres veces. ¿Estoy mal?', inigo: 'Yo no tengo plaza. Tengo chófer. Es escalable.' } },
    { text: '¿Y cuáles son los siguientes pasos?', only: ['inigo'], answer: 'Me alegra que lo preguntes. Diapositiva 312.',
      answers: { inigo: ['Me alegra que lo preguntes. Diapositiva 312.', '«Siguientes pasos de los siguientes pasos».'] } },
  ],

  // plan §7.6 — acertar hace gracia: { <id de duelo>: { <pareja>: línea | [líneas] | [[actor, línea], ...] } }. Manda
  // sobre la rotación `hurt` del rival. Otro actor (Rubén en D4) solo habla si está en la sala.
  hurtByPair: {
    // E2 §4.3 (y C9: «Me lo apunto» es de Bruno, no de Maripaz)
    // [P9]: R08 y R11 citaban las réplicas viejas; R04, nueva. Con R14 no hay reacción propia ([P15]).
    maripaz: { R04: 'Tienes razón. Mañana sale con tarifa.', R08: 'Uy. Esa copia iba oculta.', R11: 'Pues te lo vuelvo a poner. Sin poder saltarlo.' },
    // E6 §5.1: D2 a tres asaltos; el «...CABE.» pasa de la R02 a la R09 (la versión corta que cabe en 38: `cabe` de la sala)
    teodoro: { R02: 'ESO ME LO DIJO ELLA. EN 1996.', R06: 'LA MEDIA FUENTE ERA YO. NO LO REPITAS.', R09: '...CABE.' },
    // E2 fase B (15): D3 pierde R14 (mazo ['R07', 'R01', 'R03', 'R05'], P2); la línea de R14 se queda sin uso hasta entonces
    // [P9]: R03 nueva (va con su réplica); R01 y R05, las «opcionales» del guion (líneas extra)
    gervasio: { R07: 'Me consta que... Bueno. Se constaba.', R03: 'La frase se... se empezó en plazo.', R01: 'Se leyó. Se... Se agradece.',
      R05: '...Se ha... se ha enviado solo.', R14: '¿Marzo? Marzo está muy bien. Se agradece. Pero no.' },
    inigo: {
      R10: 'Interesante. Lo pongo en azul.',
      R12: '...Eso es una visión muy pesimista de la carretera.',
      R13: [['inigo_sinergia', 'Eso lo escribió alguien brillante.'], ['ruben', 'Yo. Perdón.']],
      R15: [['inigo_sinergia', '...Brais, ¿tú le has contado algo?'], ['ruben', 'TODO. Se me escapa todo.']],
      R16: 'Esa coma no estaba en mi framework.',
      // [P9]: las «opcionales» del guion (líneas extra). La de R07, solo después del remate del acta (`remates` ≥ 2; si
      // una revancha trae la R07 antes, sale la rotación general)
      R01: 'Leído y sin respuesta. En mi sector eso es engagement.',
      R05: 'Eso es una filtración. Lo pongo en rojo.',
      R07: (duel) => (duel.remates >= 2 ? 'El acta es un formato legacy.' : null),
    },
  },
  // adenda 7.4: cameo decorativo (no suma ni resta): tras el PRIMER acierto de Bruno en ese duelo, una sola vez
  // en toda la partida, entra esta línea en el hilo del correo.
  // Rediseño del duelo: sale como NOTIFICACIÓN en el móvil, «Tadeo: «RV: …»!!» (`quien` = actor del nombre y el color).
  cameos: {
    inigo: { quien: 'tadeo_adjunto', text: '«RV: Resumen IA: todos de acuerdo»!!', ms: 4200 },
  },
  // Rediseño del duelo (decisión 7): quién da cada «+1» al acertar, por duelo y en orden (un acierto, una notificación
  // «Celestino: +1» en el móvil). Gente de la casa que está en el edificio en ese momento (ids de actor: nombre y color).
  masUno: {
    maripaz: ['celestino', 'yoli_tendencias', 'gertrudis'],                                   // Acto II
    teodoro: ['begona_triplicado', 'celestino', 'yoli_tendencias'],    // Acto II, por fax (Aurora es su «En copia»)
    gervasio: ['paco_ticket', 'anselmo_monolito'],                                            // D3 se gana con 2
    inigo: ['yoli_tendencias', 'paco_ticket', 'aurora_galerada', 'begona_triplicado', 'celestino'],   // clímax: 5 aciertos
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
      tarjeta_becario: 'Una tarjeta sin foto. Sin cara no hay cuerpo.',
      libreta_replicas: 'Ya te he leído las réplicas. No caben.',
      boli_muerto: 'ESQUELA: UN BOLI DE AURORA. MURIÓ CORRIGIENDO. CABE EN UNA LÍNEA.',      // adenda 7.5
      '*': 'Eso no se faxea.',
    },
    inigo: {
      movil: 'Grábame. Lo subimos como caso de éxito. Tú sales en «aprendizajes».',
      tarjeta_becario: 'Sin foto no estás en mi matriz. Ah, sí: en «Prescindible».',   // [P11] desde la FIRMA
      libreta_replicas: 'Bonito cuaderno. Low-cost.',
      manual_fax: '¿Un manual? Nosotros lo resumimos en una diapositiva. La 247.',
      boli_muerto: '¿Un boli? Yo firmo con el dedo. En la tableta.',            // adenda 7.5
      '*': 'Ese input no escala.',
      // «ticket_n1 en el remate B» y «acta_reunion en el remate A» van en el `wrongObject` de cada remate (paquete D)
      // E2 §5.5: el correo de Evaristo es el remate C (`atScore: 5`); antes de su momento, el `wrongObject` de cada remate
    },
  },

  // Textos fijos de la ventana de correo (§6.2; rediseño: docs/guion2/duelo/DUELO_REDISENO.md).
  texts: {
    to: 'Todos',
    // rediseño (la ventana es el móvil de Bruno con la app de correo): barra, «Tú», «En copia», la pestaña sobre el menú
    // de réplicas y la ayuda del primer duelo de la partida (una línea gris hasta el primer acierto)
    app: 'Correo',
    you: 'Tú',
    enCopia: 'En copia:',
    escribiendo: 'escribiendo',
    libreta: 'LIBRETA · réplicas oídas por la casa',
    ayuda: 'Contesta con la réplica que la desmonte.',
    useObject: '[Usar objeto]',
    retire: '[Retirarse del hilo]',
    pickPrompt: 'Adjuntar al hilo:',
    defeatCc: 'Toda la empresa',
    defeatAssigned: 'Vacante',
    // Línea de derrota POR DEFECTO (rótulo del narrador). Cada rival pone la suya en su sala: `defeatLine` (plan §7.7).
    defeatLine: ['narrator', 'RESPUESTA AUTOMÁTICA: «Su correo es muy importante. Por eso lo archivamos.»'],
    // §7.1.5: quién entra en copia tras el CC propio del rival (`ccSteps` / `cc1` del rival): 2.º fallo, 3.º fallo
    ccSteps: ['Toda la planta', 'Toda la empresa'],
    // §7.1.10: retirarse no tiene consecuencia; el hilo lo dice
    retireThread: { from: 'RV:', text: 'Bruno ha abandonado el hilo.' },
    // crítica 3 · N7: lo que dice Bruno al retirarse (solo se puede en un remate: le falta el adjunto). Un rival puede
    // poner la suya con `retireLine` en su bloque `duels.<id>`.
    retireLine: 'Me salgo del hilo. Vuelvo cuando tenga algo que adjuntar.',
  },

  // [P7] aprender perdiendo: cada ataque recibido sin su réplica apunta en la libreta dónde se aprende (la nota de Bruno
  // de content/pistas.js `DONDE`, sin texto nuevo). `flag` = bits de las parejas en el orden de `pairs` (R01 = bit 0).
  pistas: {
    flag: 'libreta_pistas',
    aviso: 'Pista apuntada en la libreta.',
    repaso: 'Me faltan réplicas. Están apuntadas en la libreta.',
    de: (pair) => (DONDE[pair.flag] || [])[1] || null,
  },

  music: 'm_duelo',
};
