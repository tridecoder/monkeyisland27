// SALA `pecera` (Redacción) — ÁRBOLES DE DIÁLOGO. Paquete P2 (docs/guion2/ENMIENDA_E2.md §2.5 Leoncio y Anselmo, §2.6
// fusión Nemesio → Anselmo, §2.7 Yoli, §7.6 coro) y ENMIENDA E5 §2.5 (PB): el álbum se valida en AN_ALBUM_INTRO («Las
// fotos me valen. Pero yo no escribo columnas nuevas.»; fuera AN_ALBUM) y la columna la escribe Bruno con el rotulador
// de Comercial (`columnas`, `salida`; los llama el tablero, pecera.js). Importado desde
// ./pecera.js. Opciones con el texto LITERAL del guion (el walkthrough las busca por texto). Valentín no tiene árbol
// (cameo mudo, ver pecera.js). Herminia no tiene árbol: es el portátil `herminia_portatil` y solo escribe en su
// pantalla ('H' → api.pantalla, «HERMINIA (IA) › …»). Nemesio ya no existe (E2 §2.6): Desarrollo es Anselmo y el coro.
import { talk } from './pecera.voces.js';
import art from './art/pecera.art.js';
import { PECERA_DESPLAZ as D } from '../lib/edificio.js';
import { titulador } from './pecera.titulador.js';

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
    // E4 S2 · paso 23: la 1.ª vez, la siembra de la borrasca (le habla al monitor)
    onStart: async (api) => {
      if (api.once('pecera_yoli_borrasca')) {
        api.faceActor(Y, 'up');
        await api.sayAs(Y, 'Ponle nombre. Venga. Ponle nombre a la borrasca.');
        api.faceActor(Y, api.player);
        await api.sayAs(Y, ['Hola Bruno, Bruno becario, becario elContable, cuánto cobra un becario.',
          'Perdona. Sin nombre no la pincha nadie. La borrasca, digo.']);
      } else await api.sayAs(Y, ['Hola Bruno, Bruno becario, becario elContable, cuánto cobra un becario.', 'Perdona, me sale solo.']);
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
          // E4 §4.2 (O17-O20): Yoli se cree lo que publica
          { text: '¿Tú te crees esos titulares?', once: true,
            do: async (api) => talk(api, [[Y, 'Bajo las persianas todas las tardes. Lo leí en un sitio fiable.'], ['B', '¿Cuál?'], [Y, 'El nuestro.']]) },
          // E4 §3bis.2 (O5): el titulador, repetible (tiene `if`, §7.6)
          { text: '¿Me dejas tu titulador?', if: 'pieza_escrita', do: async (api) => { await titulador(api); return 'Y0'; } },
          { text: 'Íñigo va a cerrar el papel.', once: true, if: 'acto_3_iniciado',
            reply: 'Si cierra el papel, ¿quién me va a odiar con criterio?' },
          // E4 M3: la despedida (se oye una vez, la del paso 23) siembra la opa menguante
          { text: 'Me voy.', exit: true, reply: 'Y cuando escribas algo, avísame. Te lo coloco en Discover. Con expertos.' },
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
            reply: ['Me los pone desde su pantalla.', 'Un quesito que suma 130 %. Yo los hacía de 100. Vieja escuela.',
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
              [A, 'Peor. Si funciona, la gente se acostumbra.'], [A, 'Y si se rompe a las tres, ¿quién baja? Eutimio abre ticket. Bajo yo.']]) },
          { text: '¿Y tú no usas IA?', once: true,
            do: async (api) => {
              await talk(api, [[A, 'Mucha. Para los demás departamentos.'], [A, 'Un corrector para Aurora. Notas de gasto generativas para Begoña.'],
                ['B', '¿Y esa IA no es de fuera?']]);
              // E5 §2.8 (M20, D19): la frase entera se oye UNA vez, en pecera_herminia_mide; aquí, el eco o la pregunta
              if (api.flag('herminia_midio')) await api.sayAs(A, 'Ya te lo he dicho. Lo escribí yo. En mayúsculas.');
              else await api.sayAs(A, '¿Tú de qué departamento vienes?');
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
          { text: 'Necesito la baja de Zacarías.', once: true, if: ['ruben_encontrado', '!has:album_eventos', '!album_validado', '!posit_descopeado'],
            reply: ['¿Zacarías? «Baja becario Zacarías». En POR HACER. Letra de julio.', 'De mi tablero se sale de dos formas: hecho o muerto.',
              'Para darlo por hecho, pruebas de que existió. Fotos. Actas. Algo.', 'Y que no venga de fuera.'] },
          { text: 'Mira este álbum.', if: 'has:album_eventos', goto: 'AN_ALBUM_INTRO' },
          { text: 'El Titulator era un becario.', once: true, if: ['ruben_encontrado', '!ruben_libre'],
            do: async (api) => talk(api, [[A, 'Tenía alta. Estaba en mis sistemas. Todo en regla.'], ['wait', 1500],
              [A, '...En un armario de mis sistemas. Lo miro en la próxima versión.']]) },
          { text: 'Me voy.', exit: true, reply: 'Cierra la frontera al salir. No tiene puerta. Ciérrala igual.' },
        ],
      },
      // E2 §2.6.3 (también al Dar album_eventos) + E5 §2.5.3: las fotos valen; la columna, que la escriba otro.
      AN_ALBUM_INTRO: {
        onEnter: async (api) => {
          await api.sayAs(A, '¿De dónde vienen estas fotos? De Eventos. De fuera.');
          await api.anim(A, 'reach', 600);                  // (pasa hojas; se detiene)
          await api.sayAs(A, ['Cena de Navidad. Al fondo, un chico pálido con un táper.',
            'Photocall. Al fondo, el mismo. Yendo al baño. Es de la casa: sale en todas.',
            'Pero darle de baja es despedir. Y despedir no es una columna de mi tablero.']);
          // (Se queda el álbum. Grapa una foto al pósit de Rubén: el tablero la pinta con album_validado.)
          api.take('album_eventos');
          api.setFlag('album_validado', true);
          api.sfx('paper');
          api.repaint();
          await api.sayAs(A, 'Las fotos me valen. Pero yo no escribo columnas nuevas.');
          return 'exit';
        },
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

// ------------------------------------------------------------------ E5 §2.5.4 · el menú de columnas (Usar rotulador con kanban)
// Cámara: tablero → ventana (Rubén) → Infografía (el portátil) → Bruno. Infografía y Diseño y Producto nunca en el mismo
// plano: con la cámara en la ventana (Valentín a la vista) no habla nadie de Infografía; en Infografía (≤ 1000) no se ve
// a Valentín (1240).
const TABLERO_X = 530 + D, TABLERO_Y = 124;              // kanban.walkTo
/** Columnas equivocadas: lo que dice Anselmo al borrarlas con la manga (§3.5). */
const MAL = ['Eso es «muerto» con corbata.', '«De verdad» no es un estado.', 'Eso es tuyo. Mi tablero no es tu diario.'];
/** El menú (texto de pantalla). Bruno ya está delante del tablero. */
export async function columnas(api) {
  const ops = [['DESPEDIDOS', 0], ['HECHO (DE VERDAD)', 1], ['FIRMAR EN PAPEL', 2]];
  if (api.flag('rep_13')) ops.push(['SALIDA EN VALOR', 3]);
  if (api.flag('oyo_descopear')) ops.push(['DESCOPEADO', 4]);
  ops.push(['Mejor no.', -1]);
  api.face('up');
  const i = await api.choose(ops.map(o => o[0]), { escape: ops.length - 1 });
  const via = i >= 0 && ops[i] ? ops[i][1] : -1;
  if (via < 0) return;
  if (via >= 3) { await salida(api, via); return; }
  await columnaMal(api, via);
}
/** Anselmo vuelve a su mesa sin bloquear (el jugador ya puede probar otra columna). */
function anselmoVuelve(api) {
  const at = (art.layout[A] && art.layout[A].at) || [1082, 118, 'left'];
  api.background(async (api) => { await api.walkActor(A, at[0], at[1]); api.faceActor(A, at[2] || 'left'); });
}
/** Bruno se aparta del tablero (a la izquierda, mirándolo) para que se lea la columna. */
async function apartarse(api) {
  await api.walkTo(TABLERO_X - 44, TABLERO_Y + 4);
  api.face('right');
}
/** Una columna equivocada: Bruno escribe; Anselmo cruza y la borra con la manga. */
async function columnaMal(api, via) {
  try {
    await api.cutscene(async (api) => {
      await api.anim(api.player, 'reach', 600);
      api.sfx('paper');
      api.setState('kanban', 'mal_' + via);            // (la columna, a rotulador, con mala letra)
      api.repaint();                                   // (el tablero es un `prop`: se pinta en caché)
      await apartarse(api);                            // (Bruno da un paso atrás: que se lea)
      await api.wait(500);
      api.cameraTo(TABLERO_X + 60);
      await api.walkActor(A, TABLERO_X + 40, TABLERO_Y);
      api.faceActor(A, 'up');
      await api.anim(A, 'reach', 600);                 // (la borra con la manga)
      api.sfx('paper');
      api.setState('kanban', null);
      api.repaint();
      api.faceActor(A, api.player);
      await api.sayAs(A, MAL[via]);
      if (api.inc('pecera_columna_mal_n') === 3 && !api.flag('rep_13') && !api.flag('oyo_descopear')) {
        await api.sayAs(A, 'Tráeme algo que no sea ni hecho ni muerto. Eso no existe.');
      }
    });
  } finally {
    if (api.getState('kanban')) { api.setState('kanban', null); api.repaint(); }
    api.cameraFollow();
  }
  anselmoVuelve(api);
}

// ------------------------------------------------------------------ E2 §2.6.4 + E5 §2.5.5 · paso 46: la salida en valor
async function salida(api, via) {
  try {
    await api.cutscene(async (api) => {
      // (Bruno escribe la columna nueva a rotulador; coge el pósit de Rubén y lo cambia de columna.)
      api.face('up');
      await api.anim(api.player, 'reach', 700);
      api.sfx('paper');
      api.setFlag('columna_kanban', via === 3 ? 'salida' : 'descopeado');
      api.repaint();
      await api.wait(250);
      await api.anim(api.player, 'reach', 700);
      api.sfx('paper');
      api.setFlag('posit_descopeado', true);
      api.repaint();
      await apartarse(api);
      // (Las tres espaldas del coro se giran. 1,5 s. Anselmo se acerca, mira la columna, mira el rotulador.)
      api.setState('coro_desarrollo', 'girados');
      await api.wait(1500);
      api.cameraTo(TABLERO_X + 60);
      await api.walkActor(A, TABLERO_X + 40, TABLERO_Y);
      api.faceActor(A, 'up');
      await api.wait(600);
      api.faceActor(A, api.player);
      await api.wait(400);
      await api.sayAs(A, '¿Con qué has escrito eso? ...Rotulador de Comercial. De fuera.');
      if (via === 3) {
        await api.sayAs(A, ['Salida en valor. Ni hecho ni muerto, pero sale.',
          'La frase la escribió Zacarías. Zacarías tenía alta. ...Entonces es de la casa.']);
      } else await api.sayAs(A, 'Descopear. Quitar sin que se note. Eso es infraestructura.');
      api.setState('coro_desarrollo', null);
      await api.sayAs(A, ['Columna nueva. La primera que no dice que no.', 'El tablero va conectado al registro de Eutimio.',
        'Y en nuestros corazones, Zacarías está en HECHO.']);
      // (Tin. El ascensor se abre. Vacío. En el suelo, un papel.)
      api.sfx('beep');
      await api.wait(400);
      api.give('ticket_n1');
      api.sfx('pickup');
      await api.say(['«Ticket nº 1: Alta becario Zacarías. CERRADO.»', '«No subo. Nunca subo. Eutimio.»']);
      // (Tin. Sale Rubén del ascensor. Va derecho a la ventana; con el táper en la mano si se lo dieron, §2.5.5.)
      api.sfx('beep');
      api.setFlag('ruben_libre', true);
      api.cameraTo(1110);
      api.placeActor(R, 'pecera', 1000, 124, 'right');
      api.show(R);
      if (api.flag('taper_dado')) api.sostener(R, 'taper_huerfano');
      await api.walkActor(R, 1258, 114);
      api.faceActor(R, 'up');
      await talk(api, [[R, 'Eutimio ha mandado primero el papeleo. Es el procedimiento.'],
        [R, 'Estoy esperando a que salga el sol. Me han dicho que existe.']]);
      // (La pantalla de Anselmo cambia sola: «ACCESO REVOCADO: TITULATOR 3000».) En plano: tablero, pantalla e Infografía.
      api.cameraTo(960);
      api.sfx('bad');
      api.repaint();
      await api.wait(500);
      api.faceActor(A, 'right');
      await talk(api, [[A, 'Revocado. Fecha: hoy. Efectos: julio.'],
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
      await talk(api, [['B', 'La frase con la que Íñigo despide a la gente acaba de liberar a Zacarías.']]);
      await api.sayAs(R, 'Y la escribí yo. SEGUIREMOS INFORMANDO. Perdón.');
    });
  } finally {
    // por si se salta la escena: el estado final no depende de la cinemática
    if (!api.flag('columna_kanban')) api.setFlag('columna_kanban', via === 3 ? 'salida' : 'descopeado');
    api.setFlag('posit_descopeado', true);
    if (api.getState('coro_desarrollo')) api.setState('coro_desarrollo', null);
    if (api.has('album_eventos')) api.take('album_eventos');
    if (!api.has('ticket_n1')) api.give('ticket_n1');
    api.setFlag('ruben_libre', true);
    anselmoEnSuSitio(api);
    api.faceActor(L, 'down');
    api.cameraFollow();
    api.refreshActors();
  }
}
