// SALA `eventos` — ÁRBOL DE PILAR ESCALETA. Adenda §13.2 (árbol original, intacto: mismas opciones, mismas líneas,
// mismo orden) + §13.5 (opciones nuevas de la Sala Polivalente, añadidas antes de «Me voy.»).
// Importado por ./eventos.js. Sala PROTEGIDA: solo los cambios que nombra la ENMIENDA E2 (P4):
//  · §3.5 (C7): Borja ya no existe; el «descopear» lo publica su móvil, oído por la puerta de Marketing
//    (`movilBorjaSeOye`; Pilar: «¡Ese móvil!»). Fuera «O sea, quitado del plan» y «Me lo apunto. Por si acaso.».
//  · §7.6: `once: true` en «¿Para qué es el photocall?» y «¿Hay catering?» (sin tocar el texto).
//  · §7.4 (pasos 23 y 39): fuera el rumor C de Pilar (la cadena queda Aurora → Maripaz → Teodoro).
const PILAR = 'pilar_escaleta';
const sayP = (api, t) => api.sayAs(PILAR, t);
const movilBorja = (api, t) => api.pantalla('eventos_a_ecosistema', t);   // E2 §3.5: #4FD8E8, sin prefijo

/** biblia 5.5 `bruno_sellado_frente` (opcional): un comentario por PNJ, una vez. */
async function frente(api, who) {
  if (api.flag('bruno_sellado_frente') && api.once('frente_' + who)) await api.sayAs(who, 'Llevas RECHAZADO en la frente.');
}

/** E2 §3.5 · P14a: Pilar presta el álbum; por la puerta de Marketing, entornada, el aro de luz se enciende solo y el
 *  móvil de Borja publica. Nadie entra en la sala. */
async function movilBorjaSeOye(api) {
  api.sfx('beep');
  await movilBorja(api, 'Publicando: Hemos descopeado la ética del trimestre. Emoji de fuego.');
  await api.say('Descopear. Quitar algo sin que se note.');
  await sayP(api, '¡Ese móvil! Sin acreditación, de la puerta no se pasa.');
  await movilBorja(api, 'Publicando: Nos vamos. Pero esto lo contamos. En vertical.');
}

const sillasN = (api) => api.flag('ecosistema_sillas_n') || 0;

export default {
  // ---------------------------------------------------------------- EVENTOS · Pilar Escaleta (adenda §13.2)
  // Todo está «a cinco minutos de empezar»; cuenta sillas; tres personas juntas ya son un evento con acreditación;
  // obsesión con el catering. Presta el álbum de Eventos (P14a).
  pilar: {
    actor: PILAR, start: 'PE0',
    onStart: async (api) => {
      await frente(api, PILAR);
      await sayP(api, '¿Vienes acreditado? Empezamos en cinco minutos.');
    },
    nodes: {
      PE0: {
        options: [
          { text: '¿Qué evento hay hoy?', once: true,
            reply: ['Ninguno. Pero siempre estamos a cinco minutos de empezar.', 'Así nunca llegamos tarde. Ni a lo que no hay.'] },
          { text: '¿Para qué es el photocall?', once: true,
            reply: ['Lo que no está en el photocall no ha ocurrido.', 'Lo que está, tampoco. Pero sale mejor iluminado.'] },
          { text: '¿Cuántas sillas hay?',                                                  // (se queda)
            do: async (api) => {
              const n = api.inc('ecosistema_sillas_n');
              await sayP(api, n === 1 ? 'Ciento doce. ...Ciento doce. ...Ciento trece. ¿Quién ha traído una?' : 'Ciento doce. Las cuento cada cinco minutos. Por si se van.');
            } },
          { text: '¿Por qué hay que acreditarse?', once: true,
            reply: ['Tres personas juntas ya son un evento. Y un evento sin acreditar es un caos.', 'Ayer acredité a la cola de la máquina de café. Funcionó.'] },
          { text: '¿Hay catering?', once: true,                                                       // (se queda)
            reply: ['Croquetas a las 21:05. Si el cierre se retrasa, se enfrían.', 'Una croqueta fría es una crisis de reputación.'] },
          { text: '¿Me prestas el álbum?', if: ['ruben_encontrado', '!oyo_descopear'],
            reply: ['¿El de la cena de Navidad? Está acreditado. Firma aquí. Y aquí.', 'Cuídamelo. Sale todo el mundo. Hasta el chico del táper.'],
            do: async (api) => { await movilBorjaSeOye(api); api.give('album_eventos'); api.setFlag('oyo_descopear', true); api.sfx('pickup'); return 'exit'; } },
          { text: '¿Qué es esa cinta en la muñeca?', once: true,
            reply: ['Cinta americana. Con ella acredito, señalizo y arreglo un atril.', 'Una vez sujeté un evento entero. Con dos tiras.'] },
          // ---- §13.5 · opciones nuevas de la Sala Polivalente
          { id: 'tema', text: '¿Y de qué va el evento?',                                     // (se queda; escala)
            do: async (api) => {
              const n = api.inc('eventos_tema_n');
              if (n === 1) await sayP(api, ['Es un encuentro. Con ponente, photocall y croquetas.', 'El tema lo trae el ponente. El ponente, por confirmar.']);
              else if (n === 2) await sayP(api, ['Es una jornada de... de... Mira, estamos a cinco minutos.', 'No me líes, que pierdo la cuenta.']);
              else await sayP(api, 'Va de empezar. Cuando empiece, ya sabremos de qué iba.');
            } },
          { id: 'crisis', text: '¿Estás bien, Pilar?', if: (api) => sillasN(api) >= 1 && !api.flag('eventos_silla_devuelta'),
            do: async (api) => {
              await sayP(api, ['Ciento trece, Bruno. Una silla de más es un asistente que no existe.', '¿Y si se sienta? ¿A quién acredito? ¿Al vacío?']);
              await sayP(api, 'Esa silla ha venido de fuera. Tiene que tener dueño.');
            } },
          { id: 'reloj', text: '¿Por qué no baja la cuenta atrás?', once: true,
            reply: ['La puse a cinco minutos el día que entré. Y ahí la dejé.', 'Si baja, hay que empezar. Y eso ya es otro presupuesto.'] },
          { id: 'abuela', text: '¿Puedes acreditar a mi abuela?', once: true,
            reply: ['¿Por teléfono? Tú, ella y la compañía: tres. ¡Evento!', 'Acreditada: «Abuela de Bruno. Acceso: todo. Que se abrigue».'] },
          { id: 'croqueta', text: 'Gracias por la croqueta.', once: true, if: 'eventos_croqueta',
            reply: ['No me las des. Te he apuntado como catering.', 'Y si alguien pregunta, a las 21:05 estaban todas.'] },
          { text: 'Me voy.', exit: true, reply: '¡Hasta ahora! Te guardo la silla ciento trece.' },
        ],
      },
    },
  },
};
