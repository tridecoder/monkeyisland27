// SALA `eventos` — ÁRBOL DE PILAR ESCALETA. Importado por ./eventos.js.
// [P12] guion nuevo, tanda 3 (docs/GUION_PROPUESTA_LIMPIO.md, «Eventos · Árbol: Pilar», con [P14]): Pilar tiene su
// noche. Íñigo es su primer ponente (el brindis del Plan Cero Papel, 21:05) y su rider deja la sala sin papel; el álbum
// de los descartes va a la trituradora a las 21:04. Le falta la silla 112 (se la llevó «un señor de traje» en julio): es
// la de Brais en el armario 27. «Creo que sé dónde está tu 112.» sale tras mirar la silla del armario o preguntarle a
// Brais (`silla_112_vista`) y pide elegir el sitio; con el armario, «…Entonces se sentó.» y el álbum. Fuera el
// préstamo del álbum («¿Me prestas el álbum?» es ahora la negativa), el móvil de Borja y su «otra palabra», y el
// micropuzle de la silla 113 (su «¡CIENTO DOCE!» y su croqueta pasan a la 112). Las croquetas se quedan todas.
// [P15] Seis opciones a la vez, como mucho: las opciones se encadenan por tema (`CADENAS`, abajo); en el Acto III las
// tres cadenas comparten un hueco. «Creo que sé dónde está tu 112.» nunca queda detrás de otra.
const PILAR = 'pilar_escaleta', INIGO = 'inigo_sinergia';
const sayP = (api, t) => api.sayAs(PILAR, t);

export const acto = (api) => (api.flag('acto_3_iniciado') ? 3 : api.flag('acto_2_iniciado') ? 2 : 1);
/** ¿Ha anunciado ya Íñigo el brindis? (desde la presentación del villano, el ponente está confirmado) */
export const presentado = (api) => !!api.flag('inigo_presentado');
/** La 112 ya «consta»: Pilar sabe dónde está y le ha dado el álbum a Bruno. */
export const encontrada = (api) => !!api.flag('eventos_album_dado');

/** biblia 5.5 `bruno_sellado_frente` (opcional): un comentario por PNJ, una vez. */
async function frente(api, who) {
  if (api.flag('bruno_sellado_frente') && api.once('frente_' + who)) await api.sayAs(who, 'Llevas RECHAZADO en la frente.');
}

/** Primera entrada del Acto III (camino principal): la trituradora, el álbum en la boca y la 112 que falta. La lanza
 *  `onEnter`; si la partida se cargó ya dentro de Eventos (cargar no es entrar), la lanza el árbol al abrirse. */
export async function entradaActo3(api) {
  api.setFlag('eventos_acto3_entrada', true);
  api.setFlag('eventos_falta_112', true);
  await sayP(api, '...ciento diez, ciento once. La 112, sin aparecer.');
  api.sfx('beep');
  await sayP(api, 'Ponente, aquí Eventos. Sala lista. Trituradora lista. Cambio.');
  // contesta Íñigo por el walkie de Pilar (no está en la sala): el globo sale del walkie, con su color
  const p = api.game.actors[PILAR];
  await api.sayAs(INIGO, 'Siguiente.', p && p.room === 'eventos' ? { at: [p.x + 10, p.y - 40] } : {});
  await sayP(api, '21:04, trituradora. 21:05, brindis. Lo tengo todo.');
}

/** «Creo que sé dónde está tu 112.» → el armario 27: Pilar cuenta la del sótano, apaga la trituradora y da el álbum. */
async function salvaElAlbum(api) {
  await api.say('Con Brais sentado encima. Cuatro meses.');
  await api.wait(600);
  api.faceActor(PILAR, 'cruz_112');
  await api.wait(500);
  await sayP(api, ['...Entonces se sentó.', 'Una silla de Eventos ocupada es un asistente. Y un asistente consta.']);
  await api.wait(700);                                         // cuenta con el dedo: las filas, la puerta, el ascensor, el sótano
  await sayP(api, '¡CIENTO DOCE! ¡Vuelvo a ser persona!');
  api.faceActor(PILAR, api.player);
  api.sfx('click');                                            // apaga la trituradora con el pie
  api.setFlag('eventos_album_dado', true);
  await api.wait(300);
  await sayP(api, 'Llévatelo. Que conste que ha venido.');
  api.give('album_eventos');
  api.sfx('pickup');
  await api.say('Si sale bien, igual te quedas sin ponente.');
  await sayP(api, 'Sin ponente sé hacerlo. Lo he hecho siempre.');
  api.sfx('paper');                                            // en la mesa de acreditaciones escribe algo a boli
}

const sillasN = (api) => api.flag('ecosistema_sillas_n') || 0;

// [P15] seis opciones a la vez, como mucho. Cada cadena enseña su primera opción pendiente (la siguiente aparece al
// agotar la anterior, en el mismo hueco); en el Acto III las tres comparten un hueco: la del ponente; si no queda, la de
// los cinco minutos; si no, la de la sala.
const CADENAS = [
  ['rider', 'memoria', 'rotativa', 'crisis'],                     // el ponente (desde el Acto II)
  ['empezados', 'reloj', 'catering'],                             // los cinco minutos
  ['photocall', 'cinta', 'acreditarse', 'abuela'],                // la sala
];
const BASE = {
  rider: (api) => acto(api) >= 2,
  memoria: (api) => !!api.flag('eventos_rider_oido'),
  rotativa: (api) => acto(api) >= 2,
  crisis: (api) => acto(api) >= 2 && !encontrada(api),            // caduca al darle el álbum
};
const cabeza = (api, cadena) => cadena.find(id => !api.elegida('pilar.PE0.' + id) && (!BASE[id] || BASE[id](api))) || null;
/** Condición de una opción encadenada: sale si es la pendiente de su cadena (en el Acto III, del hueco compartido). */
const enCadena = (id) => (api) => {
  if (acto(api) === 3) { for (const c of CADENAS) { const h = cabeza(api, c); if (h) return h === id; } return false; }
  return cabeza(api, CADENAS.find(c => c.includes(id))) === id;
};
const NO_ESTA = 'Ahí ya la he buscado. Con el plano y con el walkie.';

export default {
  // ---------------------------------------------------------------- EVENTOS · Pilar Escaleta
  pilar: {
    actor: PILAR, start: 'PE0',
    onStart: async (api) => {
      // rumor C de Pilar (Eventos protegida): gag autónomo, una vez, con el Acto II empezado
      if (api.flag('acto_2_iniciado') && api.once('eventos_pilar_rumor')) {
        await sayP(api, 'Teodoro tiene acreditación vitalicia. Del 97. Plastificada a mano.');
        await sayP(api, 'Dicen que el edificio lo compró él. Por fax. Con acuse de recibo.');
      }
      await frente(api, PILAR);
      // partida cargada dentro de Eventos en el Acto III sin haber visto la entrada: Pilar cuenta antes de saludar
      if (acto(api) === 3 && !api.flag('eventos_acto3_entrada') && !encontrada(api)) await entradaActo3(api);
      await sayP(api, acto(api) === 3 ? '¿Vienes acreditado? Esta noche los cinco minutos son de verdad.' : '¿Vienes acreditado? Empezamos en cinco minutos.');
      // la croqueta: la primera vez que se abre después de dar el álbum (antes premiaba devolver la silla de más)
      if (encontrada(api) && !api.flag('eventos_croqueta')) {
        api.sfx('click');                                       // levanta un dedo la campana del catering
        await sayP(api, 'Bruno, eso merece algo. Toma: una croqueta antes de las 21:05.');
        await api.say('Está fría.');
        await sayP(api, 'Es una crisis de reputación. Pero es nuestra.');
        api.setFlag('eventos_croqueta', true);
      }
    },
    nodes: {
      PE0: {
        options: [
          { id: 'hoy', text: '¿Qué evento hay hoy?', once: true, if: 'inigo_presentado',             // el evento: «¿Qué evento…?» → «¿Y de qué va…?»
            do: async (api) => {
              if (acto(api) === 3 && encontrada(api)) await sayP(api, 'El de las 21:05. Con ponente o sin él. Eso lo decidís abajo.');
              else await sayP(api, ['Presentación del Plan Cero Papel. A las 21:05. Ponente: confirmado.', 'Confirmado. Le he llamado tres veces para oírselo.']);
            } },
          { id: 'tema', text: '¿Y de qué va el evento?', if: (api) => !presentado(api) || api.elegida('pilar.PE0.hoy'),   // (escala)
            do: async (api) => {
              const n = api.inc('eventos_tema_n');
              if (n === 1) await sayP(api, presentado(api) ? 'Del Plan Cero Papel. Con ponente, photocall y croquetas.'
                : ['Es un encuentro. Con ponente, photocall y croquetas.', 'El tema lo trae el ponente. El ponente, por confirmar.']);
              else if (n === 2) await sayP(api, presentado(api) ? ['De quitar el papel. Creo.', 'Me dijeron «ponente confirmado» y ya no oí más.']
                : ['Es una jornada de... de... Mira, estamos a cinco minutos.', 'No me líes, que pierdo la cuenta.']);
              else await sayP(api, 'Va de empezar. Cuando empiece, ya sabremos de qué iba.');
            } },
          { id: 'sillas', text: '¿Cuántas sillas hay?',                                    // (se queda; repetible)
            do: async (api) => {
              if (encontrada(api)) { await sayP(api, 'Ciento doce. Una está en el sótano, pero cuenta.'); return; }
              const n = api.inc('ecosistema_sillas_n');
              if (n === 1) {
                await sayP(api, ['Ciento doce. ...ciento diez, ciento once. ...Ciento once.', 'Falta la 112. Se la llevó un señor de traje en julio. «Para un proyecto».']);
                api.setFlag('eventos_falta_112', true);
              } else await sayP(api, 'Ciento once. Las cuento cada cinco minutos. Por si vuelve.');
            } },
          { id: 'photocall', text: '¿Para qué es el photocall?', once: true, if: enCadena('photocall'),
            reply: ['Lo que no está en el photocall no ha ocurrido.', 'Lo que está, tampoco. Pero sale mejor iluminado.'] },
          { id: 'cinta', text: '¿Qué es esa cinta en la muñeca?', once: true, if: enCadena('cinta'),
            reply: ['Cinta americana. Con ella acredito, señalizo y arreglo un atril.', 'Una vez sujeté un evento entero. Con dos tiras.'] },
          { id: 'acreditarse', text: '¿Por qué hay que acreditarse?', once: true, if: enCadena('acreditarse'),
            reply: ['Tres personas juntas ya son un evento. Y un evento sin acreditar es un caos.', 'Ayer acredité a la cola de la máquina de café. Funcionó.'] },
          { id: 'abuela', text: '¿Puedes acreditar a mi abuela?', once: true, if: enCadena('abuela'),
            reply: ['¿Por teléfono? Tú, ella y la compañía: tres. ¡Evento!', 'Acreditada: «Abuela de Bruno. Acceso: todo. Que se abrigue».'] },
          { id: 'empezados', text: '¿Cuántos eventos habéis empezado este año?', once: true, if: enCadena('empezados'),
            do: async (api) => {
              await sayP(api, ['Ninguno. Pero siempre estamos a cinco minutos de empezar.', 'Así nunca llegamos tarde. Ni a lo que no hay.']);
              api.faceActor(PILAR, 'cuenta_atras');
              await api.wait(600);
              await sayP(api, 'Hoy empiezo uno.');
              api.faceActor(PILAR, api.player);
            } },
          { id: 'reloj', text: '¿Por qué no baja la cuenta atrás?', once: true, if: enCadena('reloj'),
            do: async (api) => {
              await sayP(api, ['La puse a cinco minutos el día que entré. Y ahí la dejé.', 'Si baja, hay que empezar. Y eso ya es otro presupuesto.']);
              if (acto(api) < 3) await sayP(api, 'Esta noche hay presupuesto. Lo paga el ponente.');
            } },
          { id: 'catering', text: '¿Hay catering?', once: true, if: enCadena('catering'),   // (se queda)
            reply: ['Croquetas a las 21:05. Si el cierre se retrasa, se enfrían.', 'Una croqueta fría es una crisis de reputación.'] },
          // ---- [P12] el rider del ponente (desde el Acto II)
          { id: 'rider', text: '¿Qué ha pedido el ponente?', once: true, if: enCadena('rider'),
            do: async (api) => {
              await sayP(api, 'Agua con gas. Cero papel en sala. Y sin turno de preguntas.');
              await api.say('¿Un evento sin preguntas?');
              await sayP(api, 'Lo piden todos. Él lo ha puesto por escrito.');
              api.setFlag('eventos_rider_oido', true);
            } },
          { id: 'memoria', text: '¿Y sin papel, cómo acreditas?', once: true, if: enCadena('memoria'),
            do: async (api) => {
              await sayP(api, 'De memoria. Me he aprendido la escaleta y las caras.');
              await api.say('¿La mía también?');
              await sayP(api, 'Bruno. Acceso: hasta el canapé.');
            } },
          { id: 'rotativa', text: '¿Sabes que el plan es apagar la rotativa?', once: true, if: enCadena('rotativa'),
            do: async (api) => {
              await sayP(api, 'Lo pone mi escaleta. 21:00, rotativa apagada. 21:01, aplauso espontáneo.');
              await api.say('¿Y te parece bien?');
              await sayP(api, 'Yo hago eventos, Bruno. El contenido lo trae el ponente.');
              api.face('pulsador_rojo');                       // Bruno mira el pulsador rojo del atril
              await api.wait(700);
              await sayP(api, 'Si te sirve de algo, el botón no está conectado a nada.');
              api.face(PILAR);
            } },
          { id: 'crisis', text: '¿Estás bien, Pilar?', once: true, if: enCadena('crisis'),
            reply: 'Tengo ponente, Bruno. Lo demás lo arreglo con cinta.' },
          // ---- [P12] [P14] el álbum (Acto III)
          { id: 'album', text: '¿Me prestas el álbum?', if: (api) => !!api.flag('ruben_encontrado') && !encontrada(api),   // se puede saltar
            do: async (api) => {
              if (api.flag('pilar_nego_album')) { await sayP(api, '21:04, Bruno. Lo pone el rider. Subrayado.'); return; }
              await sayP(api, 'Hoy no. El ponente lo quiere en la trituradora. A las 21:04.');
              await api.say('En ese álbum sale Brais. Es la única prueba de que existe.');
              await sayP(api, ['Son los descartes. Foto con comida no se publica.', '¿El extra? Nunca se sentó. Siempre de pie, al fondo, yendo al baño.',
                'Quien no se sienta no asiste. Y lo que no asiste, se tritura.']);
              api.setFlag('pilar_nego_album', true);
            } },
          { id: 'la112', text: 'Creo que sé dónde está tu 112.', goto: 'PE112',                      // camino principal
            if: (api) => acto(api) === 3 && !!api.flag('silla_112_vista') && !encontrada(api),
            do: async (api) => { await sayP(api, ['¿Mi 112? ¿La de la última fila?', '¿Dónde?']); } },
          { id: 'croqueta', text: 'Gracias por la croqueta.', once: true, if: 'eventos_croqueta',
            reply: ['No me las des. Te he apuntado como catering.', 'Y si alguien pregunta, a las 21:05 estaban todas.'] },
          { id: 'adios', text: 'Me voy.', exit: true,
            reply: (api) => (encontrada(api) ? '¡Hasta ahora! Te guardo la ciento once. La 112 está ocupada.' : '¡Hasta ahora! Te guardo la silla ciento once.') },
        ],
      },
      // [P14] hay que elegir dónde está: los Despachos son la trampa razonable (el «señor de traje» es Íñigo)
      PE112: {
        options: [
          { id: 'despachos', text: 'En los Despachos.', exit: true, siempre: true, reply: NO_ESTA },
          { id: 'sala', text: 'En la Sala Amazonas.', exit: true, siempre: true, reply: NO_ESTA },
          { id: 'armario', text: 'En el armario 27, en Sistemas.', siempre: true,
            do: async (api) => { await salvaElAlbum(api); return 'exit'; } },
        ],
      },
    },
  },
};
