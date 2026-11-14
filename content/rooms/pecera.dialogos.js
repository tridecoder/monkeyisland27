// SALA `pecera` (Redacción) — ÁRBOLES DE DIÁLOGO. Paquete P2 (docs/guion2/ENMIENDA_E2.md §2.5 Leoncio y Anselmo, §2.6
// fusión Nemesio → Anselmo con AN_ALBUM_INTRO / AN_ALBUM / salida en valor, §2.7 Yoli, §7.6 coro). Importado desde
// ./pecera.js. Opciones con el texto LITERAL del guion (el walkthrough las busca por texto). Valentín no tiene árbol
// (cameo mudo, ver pecera.js). Herminia no tiene árbol: es el portátil `herminia_portatil` y solo escribe en su
// pantalla ('H' → api.pantalla, «HERMINIA (IA) › …»). Nemesio ya no existe (E2 §2.6): Desarrollo es Anselmo y el coro.
import { talk } from './pecera.voces.js';
import art from './art/pecera.art.js';
import { PECERA_DESPLAZ as D } from '../lib/edificio.js';

const Y = 'yoli_tendencias', L = 'leoncio_quesitos', A = 'anselmo_monolito', R = 'ruben';

/** Anselmo cruza la frontera hasta la mesa de Infografía (o vuelve). Para no cruzar la sala entera a cámara, aparece
 *  justo fuera de cuadro y anda los últimos ochenta píxeles (E1.8: «walkActor ≈ 80 px»). */
export const MESA_INFOGRAFIA = [906, 121];   // a la derecha del portátil, sin taparlo
export async function anselmoALaMesa(api) {
  const cam = Math.round(api.game.camX);
  api.placeActor(A, 'pecera', Math.max(cam + 330, MESA_INFOGRAFIA[0] + 70), MESA_INFOGRAFIA[1], 'left');
  await api.walkActor(A, MESA_INFOGRAFIA[0], MESA_INFOGRAFIA[1]);
  api.faceActor(A, 'left');
}
export async function anselmoASuMesa(api, hasta = 960) {
  await api.walkActor(A, hasta, 122);
  api.faceActor(A, 'left');
}
/** Devuelve a Anselmo a su sitio de siempre (fuera de cámara, sin paseo). */
export function anselmoEnSuSitio(api) {
  const at = (art.layout[A] && art.layout[A].at) || [1082, 118, 'left'];
  api.placeActor(A, 'pecera', at[0], at[1], at[2] || 'left');
}

/** Al Dar el álbum, el árbol de Anselmo empieza en AN_ALBUM_INTRO sin saludo (pecera.js pone `sinSaludo`). */
export const anselmoCtx = { sinSaludo: false };

export default {
  // ---------------------------------------------------------------- E2 §2.7 Yoli (solo con cms_vivo; sin él, pecera.js)
  yoli: {
    actor: Y, start: 'Y0',
    onStart: async (api) => {
      await api.sayAs(Y, ['Hola Bruno, Bruno becario, becario elContable, cuánto cobra un becario.', 'Perdona, me sale solo.']);
    },
    nodes: {
      Y0: {
        options: [
          { text: '¿Algún hilo bueno esta noche?', once: true,
            reply: ['Maripaz me escribió «desde el más absoluto cariño».', 'Le contesté: «Y yo te leo desde el más absoluto modo avión».',
              'Me ha puesto en copia a mi madre.'],
            do: async (api) => { api.learnReply('rep_08'); } },
          { text: '¿Y tú cómo estás? Tú, no la audiencia.', once: true,
            do: async (api) => {
              await api.sayAs(Y, 'Yo...');
              api.faceActor(Y, 'up');                         // (mira la gráfica)
              await api.wait(700);
              api.faceActor(Y, api.player);
              await api.sayAs(Y, ['...bien. Bajando, pero bien.', 'Nadie me lo había preguntado sin querer un dato. Qué raro. Qué bonito.']);
            } },
          { text: '¿Cuántos me leen a mí?', once: true,
            reply: ['Tu última pieza: once segundos de media.', 'Menos una lectora: cuarenta y siete minutos. Comenta «abrígate». En todo.'] },
          { text: 'Íñigo va a cerrar el papel.', once: true, if: 'acto_3_iniciado',
            reply: 'Si cierra el papel, ¿quién me va a odiar con criterio?' },
          { text: 'Me voy.', exit: true, reply: 'Vuelve con un titular con número. El siete convierte.' },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- E2 §2.5 Leoncio (start LQ0)
  leoncio: {
    actor: L, start: 'LQ0',
    onStart: async (api) => {
      if (api.once('pecera_leoncio_saludo')) {
        await api.anim(L, 'reach', 600);                    // (dibuja un quesito en el aire)
        await api.sayAs(L, 'Vacante. En tarta, eres un quesito muy fino.');
      } else await api.sayAs(L, 'Pasa. Aquí ya no se trabaja. Se supervisa.');
    },
    nodes: {
      LQ0: {
        options: [
          { text: '¿Qué es Herminia?', once: true,
            reply: ['Mi IA. La hice yo, en tres fines de semana.', 'Hace sola las infografías de la casa. Papel, web y redes.',
              'Mejor que todo mi departamento. Me incluyo.', 'Me duele, pero me incluyo.'] },
          { text: '¿Y tu departamento?', once: true,
            reply: ['Se fue a las seis y media. Herminia no ficha.', 'Dejaron las chaquetas en las sillas, mirándola. Por respeto.',
              'Yo ya no dibujo. Superviso. Que es mirarla con orgullo.'] },
          { text: '¿Por qué no se publica lo que hace?', once: true,
            reply: ['Porque Anselmo no la integra. Dice que no ha pasado por Desarrollo.',
              'Le he mandado cuarenta y un pósits. Me los devuelve con un «NO».', 'En su tipografía, que es fea.'] },
          { text: '¿Me hace un gráfico a mí?', once: true,
            do: async (api) => {
              await api.anim(L, 'reach', 500);              // (gira el portátil hacia Bruno; con el paquete, por el hueco)
              await talk(api, [['H', 'Bruno · aportación a la planta: 0,3 % · tendencia: plana'],
                [L, 'Plana no es mala. Plana es estable. Yo estoy plano desde que existe ella.']]);
              await api.anim(L, 'reach', 900);              // L14: (vuelve a girar el portátil hacia sí, despacio)
            } },
          { text: '¿Y esos gráficos de Anselmo en tu sección?', once: true, if: 'acto_2_iniciado',
            reply: ['Me los pone desde su pantalla. Sin preguntar.', 'Un quesito que suma 130 % no es un gráfico. Es una aspiración.',
              'Herminia lo arreglaría en una décima. Pero está encintada.'] },
          { text: '¿Y si Herminia te sustituye a ti también?', once: true,
            reply: ['Ya lo ha hecho. En septiembre. No se lo he dicho a nadie.', 'Ni a ella. Es muy sensible a los datos.'] },
          { text: 'El Titulator era un becario.', once: true, if: 'ruben_encontrado',
            reply: ['Lo sé. Ella lo dijo a las ocho y veinte. En barras.', 'Nadie mira las barras. Para eso existo yo.'] },
          { text: '¿Qué tal ahora con Anselmo?', if: 'infografia_integrada',
            reply: 'Me han absorbido en plataforma. Sigo aquí. Supervisando. Desde Desarrollo.' },
          { text: 'Me voy.', exit: true, reply: 'Cuidado con la cinta. Se ha movido desde que has llegado.' },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- E2 §2.5 + §2.6 Anselmo (start AN0): hereda a Nemesio
  anselmo: {
    actor: A, start: 'AN0',
    onStart: async (api) => {
      if (anselmoCtx.sinSaludo) { anselmoCtx.sinSaludo = false; return; }
      if (api.once('pecera_anselmo_saludo')) {
        await talk(api, [[A, 'Alto. Esto es Desarrollo. ¿Traes algo de fuera?'], ['B', 'Solo a mí.'],
          [A, 'Pasa. Lo vacío no se integra, pero tampoco molesta.']]);
      } else await api.sayAs(A, '¿Otra vez cruzando? Te voy a pedir visado.');
    },
    nodes: {
      AN0: {
        options: [
          { text: '¿Por qué bloqueas a Herminia?', once: true,
            do: async (api) => talk(api, [[A, '¿De dónde viene? De Infografía. Hecha con IA. Fuera de mis sistemas.'], ['B', '¿Y si funciona?'],
              [A, 'Peor. Si funciona, la gente se acostumbra.'], [A, 'Y si se rompe a las tres, ¿quién baja? Paco abre ticket. Bajo yo.']]) },
          { text: '¿Y tú no usas IA?', once: true,
            do: async (api) => {
              await talk(api, [[A, 'Mucha. Para los demás departamentos.'], [A, 'Un corrector para Aurora. Notas de gasto generativas para Begoña.'],
                ['B', '¿Y esa IA no es de fuera?']]);
              if (api.flag('herminia_midio')) await api.sayAs(A, 'Ya te lo he dicho. El prompt es de dentro. Lo escribí yo. En mayúsculas.');
              else await api.sayAs(A, ['El modelo es de fuera. El prompt es de dentro.', 'Eso lo hace nuestro.']);
            } },
          { text: '¿Qué tal con Yoli?', once: true,                 // paso 24 (heredado de Nemesio): cita la réplica de R09
            reply: ['Me dijo que mi dato de tráfico estaba «sacado de contexto».', '¿El contexto? ¿De dónde viene? De la web. No entra.',
              'Le dije: «Tráeme el contexto. Le hago una pieza aparte».', '«El contexto, explicado». No hemos vuelto a comer juntos.'],
            do: async (api) => { api.learnReply('rep_09'); } },
          { text: '¿Por qué invades la sección de Leoncio?', once: true, if: 'acto_2_iniciado',
            reply: ['Invadir, no. Desplegar capacidad.', 'Mi quesito suma 130 %. Desarrollo siempre da de más.'] },
          { text: 'He arreglado el CMS.', once: true, if: 'cms_vivo',
            do: async (api) => {
              const arriba = api.getState('enchufe_pantalla') === 'con_ticket';
              await talk(api, [[A, '¿Desde dónde?'], ['B', arriba ? 'Desde aquí. Un enchufe con número.' : 'Desde Sistemas. Una regleta.'],
                [A, 'Solución de terceros. Funciona, pero no es mía. Próxima versión.']]);
            } },
          { text: 'Necesito la baja de Rubén.', once: true, if: ['ruben_encontrado', '!has:album_eventos', '!posit_descopeado'],
            reply: ['¿Rubén? «Baja becario Rubén». En POR HACER. Con letra de julio.', 'De mi tablero se sale de dos formas: hecho o muerto.',
              'Para darlo por hecho, pruebas de que existió. Fotos. Actas. Algo.', 'Y que no venga de fuera.'] },
          { text: 'Mira este álbum.', if: 'has:album_eventos', goto: 'AN_ALBUM_INTRO' },
          { text: 'El Titulator era un becario.', once: true, if: ['ruben_encontrado', '!ruben_libre'],
            do: async (api) => talk(api, [[A, 'Tenía alta. Estaba en mis sistemas. Todo en regla.'], ['wait', 1500],
              [A, '...En un armario de mis sistemas. Lo miro en la próxima versión.']]) },
          { text: 'Me voy.', exit: true, reply: 'Cierra la frontera al salir. No tiene puerta. Ciérrala igual.' },
        ],
      },
      // E2 §2.6.3 (también al Dar album_eventos): las líneas de entrada van en un nodo puente para no repetirlas
      AN_ALBUM_INTRO: {
        onEnter: async (api) => {
          await api.sayAs(A, '¿De dónde vienen estas fotos? De Eventos. De fuera.');
          await api.anim(A, 'reach', 600);                  // (pasa hojas; se detiene)
          await api.sayAs(A, ['Cena de Navidad. Al fondo, un chico pálido con un táper.',
            'Photocall. Al fondo, el mismo. Yendo al baño. Es de la casa: sale en todas.',
            'Pero darle de baja es despedir. Y despedir no es una columna de mi tablero.']);
          return 'AN_ALBUM';
        },
      },
      AN_ALBUM: {
        options: [
          { text: '¿Y si lo damos por hecho?', do: async (api) => albumNo(api, 'Hecho sería que alguien le hubiera dado de baja. Nadie lo ha hecho.') },
          { text: '¿Y si le hacemos un funeral? Con flores. Y diapositivas.', do: async (api) => albumNo(api, 'No me tientes. Ya tengo la plantilla.') },
          { text: 'No es un despido: es una salida en valor.', if: 'rep_13', do: async (api) => salida(api, 3) },
          { text: '¿Y si... lo descopeamos?', if: 'oyo_descopear', do: async (api) => salida(api, 4) },
          { text: 'Lo pienso y vuelvo.', exit: true, reply: 'Eso dijo Rubén en julio.' },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- §5.14 coro de Desarrollo (E2 §7.6: todo `once`)
  coro: {
    actor: 'coro_desarrollo', start: 'CO0',
    onStart: async (api) => {
      // (Bruno les habla. Las tres sillas giran un poco. Las espaldas, no.)
      await talk(api, [['CORO', '¿Diseño?'], ['B', 'No. Bruno.'], ['D1', 'Ah. Entonces no es culpa tuya.']]);
    },
    nodes: {
      CO0: {
        options: [
          { text: '¿Por qué gritáis tanto?', once: true,
            do: async (api) => talk(api, [['D2', '¡No gritamos!'], ['D1', '¡Es que juntos no nos oímos!'],
              [A, 'Juntos son un incendio. Por separado, santos.']]) },
          { text: '¿Con quién estáis enfadados?', once: true,
            do: async (api) => talk(api, [['D1', 'Con el navegador. Con los lectores. Con la lluvia.'], ['D2', 'Con el de al lado.'],
              ['D1', '¡Con el de al lado no!'], ['D2', '¡Pues ahora sí!'], ['D3', 'No.']]) },
          { text: 'El CMS lo he arreglado yo.', once: true, if: 'cms_vivo',
            do: async (api) => talk(api, [['D2', 'Lo hemos arreglado nosotros.'], ['B', 'He desenchufado una pantalla.'], ['wait', 900],
              ['D1', '...Pues la pantalla la eligió Diseño.']]) },
          { text: 'Me voy.', exit: true, do: async (api) => talk(api, [['CORO', '¡Vale!']]) },   // (lo gritan como un insulto, sin serlo)
        ],
      },
    },
  },
};

// ------------------------------------------------------------------ AN_ALBUM: «ni hecho ni muerto»
async function albumNo(api, linea) {
  await api.sayAs(A, linea);
  if (api.inc('pecera_album_n') === 2 && !api.flag('rep_13') && !api.flag('oyo_descopear')) {
    await api.sayAs(A, 'Tráeme algo que no sea ni hecho ni muerto. Eso no existe.');
  }
}

// ------------------------------------------------------------------ E2 §2.6.4 AN_SALIDA · paso 40: la salida en valor
// Cámara: tablero → ventana (Rubén) → Infografía (el portátil) → Bruno. Infografía y Diseño y Producto nunca en el mismo
// plano: con la cámara en la ventana (Valentín a la vista) no habla nadie de Infografía; en Infografía (≤ 1000) no se ve
// a Valentín (1240).
const TABLERO_X = 530 + D, TABLERO_Y = 124;              // kanban.walkTo
async function salida(api, via) {
  await api.cutscene(async (api) => {
    // (Anselmo, quieto. Tres segundos. Las tres espaldas del coro se giran por primera vez.)
    await api.wait(1500);
    if (via === 3) await api.sayAs(A, ['...Eso no es ni hecho ni muerto. Es consultoría.', 'Despedir, no. Salida en valor. ...Eso sí lo sé hacer yo.']);
    else await api.sayAs(A, 'Descopear. Quitar sin que se note. Eso es infraestructura.');
    // (Anda al tablero. Rotulador. Una columna nueva: SALIDA EN VALOR. El pósit, dentro.)
    api.cameraTo(TABLERO_X + 40);
    await api.walkActor(A, TABLERO_X + 16, TABLERO_Y);
    api.faceActor(A, 'up');
    await api.anim(A, 'reach', 700);
    api.sfx('paper');
    api.take('album_eventos');
    api.setFlag('posit_descopeado', true);
    api.repaint();
    api.faceActor(A, api.player);
    await api.sayAs(A, ['Columna nueva. La primera que no dice que no.', 'El tablero va conectado al registro de Paco. Lo único integrado de la casa.',
      'Y en nuestros corazones, Rubén está en HECHO.']);
    // (Tin. El ascensor se abre. Vacío. En el suelo, un papel.)
    api.sfx('beep');
    await api.wait(400);
    api.give('ticket_n1');
    api.sfx('pickup');
    await api.say(['«Ticket nº 1: Alta becario Rubén. CERRADO.»', '«No subo. Nunca subo. Paco.»']);
    // (Tin. Sale Rubén del ascensor. Va derecho a la ventana.)
    api.sfx('beep');
    api.setFlag('ruben_libre', true);
    api.cameraTo(1110);
    api.placeActor(R, 'pecera', 1000, 124, 'right');
    api.show(R);
    await api.walkActor(R, 1258, 114);
    api.faceActor(R, 'up');
    await talk(api, [[R, 'Paco ha mandado primero el papeleo. Es el procedimiento.'],
      [R, 'Estoy esperando a que salga el sol. Me han dicho que existe.']]);
    // (La pantalla de Anselmo cambia sola: «ACCESO REVOCADO: TITULATOR 3000».) En plano: tablero, pantalla e Infografía.
    api.cameraTo(960);
    api.sfx('bad');
    api.repaint();
    await api.wait(500);
    api.faceActor(A, 'right');
    await talk(api, [[A, 'Revocado. Con fecha de hoy. Y de julio.'],
      [L, 'Integró una IA que era un becario. Y rechaza una IA que es una IA.']]);
    // (Anselmo mira el portátil envuelto. Da un paso hacia Infografía.)
    api.cameraTo(840);
    await api.walkActor(A, TABLERO_X - 20, TABLERO_Y - 2);
    api.faceActor(A, 'left');
    await api.sayAs(A, 'Nos hemos quedado sin IA de la casa.');
    // (Leoncio pone las dos manos encima del paquete. No dice nada.)
    api.faceActor(L, 'up');
    await api.anim(L, 'reach', 1500);
    await talk(api, [['H', 'alta de usuario: no · propietaria: Infografía']]);
    await api.sayAs(A, '...Lo miro en la próxima versión.');
    // (Anselmo vuelve a su sitio.)
    api.faceActor(L, 'down');
    api.cameraFollow();
    await api.walkActor(A, 672 + D, 118);
    api.faceActor(A, 'left');
    await talk(api, [['B', 'La frase con la que Íñigo despide a la gente acaba de liberar a Rubén.']]);
    await api.sayAs(R, 'Y la escribí yo. SEGUIREMOS INFORMANDO. Perdón.');
  });
  // por si se salta la escena: el estado final no depende de la cinemática
  if (!api.flag('posit_descopeado')) { api.take('album_eventos'); api.setFlag('posit_descopeado', true); }
  if (api.has('album_eventos')) api.take('album_eventos');
  if (!api.has('ticket_n1')) api.give('ticket_n1');
  api.setFlag('ruben_libre', true);
  anselmoEnSuSitio(api);
  api.faceActor(L, 'down');
  api.refreshActors();
  return 'exit';
}
