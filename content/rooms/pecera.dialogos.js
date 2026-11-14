// SALA `pecera` (Redacción) — ÁRBOLES DE DIÁLOGO. Paquete P2 del plan de comedia (docs/guion2/PLAN_COMEDIA.md §5.4 Yoli,
// §5.5 Nemesio, §5.14 coro; ENMIENDA E1.6 Leoncio y Anselmo, E1.4.3 N_SALIDA). Importado desde ./pecera.js.
// Opciones con el texto LITERAL del plan (el walkthrough las busca por texto). Valentín ya no tiene árbol (§5.14: cameo
// mudo, ver pecera.js). Herminia no tiene árbol: es el portátil `herminia_portatil` y solo escribe en su pantalla ('H').
import { talk } from './pecera.voces.js';
import art from './art/pecera.art.js';

const Y = 'yoli_tendencias', N = 'nerea_backlog', L = 'leoncio_quesitos', A = 'anselmo_monolito', R = 'ruben';

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

export default {
  // ---------------------------------------------------------------- §5.4 Yoli (solo con cms_vivo; sin él, pecera.js)
  yoli: {
    actor: Y, start: 'Y0',
    onStart: async (api) => {
      await api.sayAs(Y, ['Hola Bruno, Bruno becario, becario elContable, cuánto cobra un becario.', 'Perdona, me sale solo.']);
    },
    nodes: {
      Y0: {
        options: [
          { text: '¿Algún hilo bueno esta noche?', once: true,
            reply: ['Maripaz me escribió "desde el más absoluto cariño".', 'Le contesté: "Y yo te leo desde el más absoluto modo avión".',
              'Le contesté con lo del modo avión. Me ha puesto en copia a mi madre.'],
            do: async (api) => { api.learnReply('rep_08'); } },
          { text: '¿Y tú cómo estás? Tú, no la audiencia.', once: true,
            reply: ['Yo... — 3.402 — bien. Bajando, pero bien.', 'Nadie me lo había preguntado sin querer un dato. Qué raro. Qué bonito.'] },
          { text: '¿Cuántos me leen a mí?', once: true,
            reply: ['Tu última pieza: once segundos de media. Y una lectora: cuarenta y siete.', 'Será un bot. Comenta «abrígate». En todo.'] },
          { text: 'Me voy.', exit: true, reply: 'Me alegro mucho — 3.398 — mucho. Vuelve con número.' },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- §5.5 Nemesio (id del árbol: `nerea`) [E1]
  nerea: {
    actor: N, start: 'N0',
    onStart: async (api) => {
      if (api.once('pecera_nemesio_saludo')) await api.sayAs(N, 'Si no está en el tablero, no existe. Tú, por ejemplo, en POR HACER.');
      else await api.sayAs(N, 'Eso es una petición. Va a POR HACER. Hay cola desde 2019.');
    },
    nodes: {
      N0: {
        options: [
          { text: '¿Qué tal con Yoli?', once: true,
            // §7.3: la anécdota cita la réplica nueva de R09 («Tráeme el contexto. Le hago una pieza aparte…»)
            reply: ['Me dijo que mi dato de tráfico estaba "sacado de contexto".', 'Le dije que al contexto le hacía una pieza aparte.',
              '«El contexto, explicado». No hemos vuelto a comer juntos.', 'Bueno, ella no come. Mide.'],
            do: async (api) => { api.learnReply('rep_09'); } },
          { text: '¿Por qué está bloqueado lo de Herminia?', once: true,
            reply: ['Lo bloquea Anselmo. Y a Anselmo lo bloquea Anselmo.', 'Es la dependencia más estable del tablero.'] },
          { text: '¿Me cambias de columna? A HECHO, aunque sea.', once: true,
            reply: 'Te tengo cariño, Bruno. En BLOQUEADO. Depende de que existas.' },
          { text: 'Necesito la baja de Rubén.', once: true, if: ['ruben_encontrado', '!has:album_eventos', '!posit_descopeado'],
            reply: ['¿Rubén? "Baja becario Rubén". POR HACER. Desde julio.', 'Un pósit sale del tablero de dos formas: hecho o muerto.',
              'Para darlo por hecho necesito pruebas de que el becario existió.', 'No sale en ninguna foto. En ningún acta. En ningún sitio.'] },
          { text: 'Mira este álbum.', if: 'has:album_eventos', goto: 'N_ALBUM_INTRO' },
          { text: '¿Por qué gritan tanto ahí detrás?', reply: 'Juntos son un incendio. Por separado, santos.' },
          { text: 'Me voy.', exit: true, reply: 'Te paso a EN CURSO. No te vengas arriba: no es HECHO.' },
        ],
      },
      // N_ALBUM (también al Dar album_eventos): las líneas de entrada van en un nodo puente para no repetirlas
      N_ALBUM_INTRO: {
        onEnter: async (api) => {
          await api.sayAs(N, ['A ver. Cena de Navidad. Al fondo, un chico pálido. Con táper.', 'Photocall. Al fondo, el mismo. Yendo al baño.',
            'Existió. Existe. Va mucho al baño. Pero su pósit sigue en POR HACER.', 'Un pósit sale hecho o muerto. Y darle de baja es despedir.',
            'Despedir es otra columna. Y esa no la toco.']);
          return 'N_ALBUM';
        },
      },
      N_ALBUM: {
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

  // ---------------------------------------------------------------- E1.6 Leoncio (start LQ0)
  leoncio: {
    actor: L, start: 'LQ0',
    onStart: async (api) => {
      if (api.once('pecera_leoncio_saludo')) {
        await api.anim(L, 'reach', 600);                    // (dibuja un quesito en el aire)
        await api.sayAs(L, 'Vacante. En el gráfico de la planta, un quesito muy fino. Pero se te ve.');
      } else await api.sayAs(L, 'Pasa. Aquí ya no se trabaja. Se supervisa.');
    },
    nodes: {
      LQ0: {
        options: [
          { text: '¿Qué es Herminia?', once: true,
            reply: ['Mi herramienta. Tres fines de semana. Hace las infografías de la casa.', 'Papel, web y redes. Mejor que todo mi equipo. Me incluyo.',
              'Me duele, pero me incluyo. Eso sí: la hice yo.'] },
          { text: '¿Y tu equipo?', once: true,
            reply: ['Se fue a las seis y media. Ella no ficha. Yo le hago compañía.', 'Yo ya no dibujo. Yo superviso. Que es mirarla con orgullo.',
              'En barras, mi día es una barra. Bajita.'] },
          { text: '¿Me hace un gráfico a mí?', once: true,
            do: async (api) => {
              await api.anim(L, 'reach', 500);              // (gira el portátil hacia Bruno; si está envuelto, por el hueco)
              await talk(api, [['H', '› Bruno · aportación a la planta: 0,3 % · tendencia: plana'],
                [L, 'Plana no es mala. Plana es estable. Yo estoy plano desde que existe ella.'],
                ['B', 'Mi primer gráfico. Plano, pero mío. Al currículum.']]);
            } },
          { text: '¿Y por qué Anselmo pone gráficos en tu sección?', once: true, if: 'acto_2_iniciado',
            reply: ['Desde su pantalla. En mi sección. Sin preguntar.', 'Un quesito que suma 130 %. En tarta, eso es una invasión.',
              'Ella lo arreglaría en una décima. Pero está encintada. Por él.'] },
          { text: '¿Y si Herminia te sustituye a ti también?', once: true,
            reply: ['Ya lo ha hecho. En septiembre. No se lo he dicho a nadie.', 'Ni a ella. Es muy sensible a los datos.'] },
          { text: 'El Titulator era un becario.', once: true, if: 'ruben_encontrado',
            reply: ['Lo sé. Ella lo dijo a las ocho y veinte. En barras.', 'Nadie mira las barras. Para eso existo yo.'] },
          { text: '¿Qué tal ahora con Anselmo?', if: 'infografia_integrada',
            reply: 'Me han absorbido en plataforma. Sigo aquí. Supervisando. Desde Desarrollo.' },
          { text: 'Me voy.', exit: true, reply: 'Al salir, cuidado con Anselmo. Si llevas algo de aquí, lo envuelve.' },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- E1.6 Anselmo (start AN0)
  anselmo: {
    actor: A, start: 'AN0',
    onStart: async (api) => {
      if (api.once('pecera_anselmo_saludo')) {
        await talk(api, [[A, 'Alto. Esto es Desarrollo. ¿De dónde vienes?'], ['B', 'De la Redacción. Está a un metro.'],
          [A, 'Un metro de fuera sigue siendo fuera. Pasa. Sin tocar.']]);
      } else await api.sayAs(A, '¿Otra vez cruzando? Eso, en mis sistemas, es tráfico.');
    },
    nodes: {
      AN0: {
        options: [
          { text: '¿Por qué no integras a Herminia?', once: true,
            do: async (api) => talk(api, [[A, '¿De dónde viene? De Infografía. Hecha con IA. Fuera de mis sistemas.'], ['B', '¿Y si funciona?'],
              [A, 'Entonces, peor. Lo de fuera que funciona crea precedente.']]) },
          { text: '¿Y tú no usas IA?', once: true,
            do: async (api) => talk(api, [[A, 'IA, no. Automatización interna. Para los demás departamentos.'],
              [A, 'Un corrector para Aurora. Un narrador del Ibex para Celestino.'], ['B', '¿Eso no es meterse en su trabajo?'],
              [A, 'Meterse, no. Dar servicio.']]) },
          { text: '¿Por qué invades la sección de Leoncio?', once: true, if: 'acto_2_iniciado',
            reply: ['Invadir, no. Desplegar capacidad.', 'Mi quesito suma 130 %. Desarrollo siempre da de más.'] },
          { text: '¿Quién arregla esto de madrugada?', once: true,
            reply: ['Si algo se rompe a las tres, ¿quién baja? Paco abre ticket. Bajo yo.', 'Por eso, nada de fuera. A las tres no bajo por cosas ajenas.'] },
          { text: '¿Me envuelves a mí? Para estar protegido.', once: true,
            reply: 'No. La cinta es para lo que consume recursos. Tú, de momento, no.' },
          { text: 'He arreglado el CMS.', once: true, if: 'cms_vivo',
            do: async (api) => {
              const arriba = api.getState('enchufe_pantalla') === 'con_ticket';
              await talk(api, [[A, '¿Desde dónde?'], ['B', arriba ? 'Desde aquí. Un enchufe con número.' : 'Desde Sistemas. Una regleta.'],
                [A, 'Solución de terceros. Funciona, pero no es mía. Próxima versión.']]);
            } },
          { text: 'El Titulator era un becario.', once: true, if: ['ruben_encontrado', '!ruben_libre'],
            do: async (api) => talk(api, [[A, 'Tenía alta. Estaba en mis sistemas. Todo en regla.'], ['wait', 1500],
              [A, '...En un armario de mis sistemas. Lo miro en la próxima versión.']]) },
          { text: 'Me voy.', exit: true, reply: 'Sal por la frontera. Y no te lleves nada que no sea tuyo.' },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- §5.14 coro de Desarrollo: 3 opciones + salida
  coro: {
    actor: 'coro_desarrollo', start: 'CO0',
    onStart: async (api) => {
      // (Bruno les habla. Las tres sillas giran un poco. Las espaldas, no.)
      await talk(api, [['CORO', '¿Diseño?'], ['B', 'No. Bruno.'], ['D1', 'Ah. Entonces no es culpa tuya.']]);
    },
    nodes: {
      CO0: {
        options: [
          { text: '¿Por qué gritáis tanto?',
            do: async (api) => talk(api, [['D2', '¡No gritamos!'], ['D1', '¡Es que juntos no nos oímos!'],
              [N, 'Juntos son un incendio. Por separado, santos.']]) },
          { text: '¿Con quién estáis enfadados?', once: true,
            do: async (api) => talk(api, [['D1', 'Con el navegador. Con los lectores. Con la lluvia.'], ['D2', 'Con el de al lado.'],
              ['D1', '¡Con el de al lado no!'], ['D2', '¡Pues ahora sí!'], ['D3', 'No.']]) },
          { text: 'El CMS lo he arreglado yo.', if: 'cms_vivo',
            do: async (api) => talk(api, [['D2', 'Lo hemos arreglado nosotros.'], ['B', 'He desenchufado una pantalla.'], ['wait', 900],
              ['D1', '...Pues la pantalla la eligió Diseño.']]) },
          { text: 'Me voy.', exit: true, do: async (api) => talk(api, [['CORO', '¡Vale!']]) },   // (lo gritan como un insulto, sin serlo)
        ],
      },
    },
  },
};

// ------------------------------------------------------------------ N_ALBUM: «ni hecho ni muerto»
async function albumNo(api, linea) {
  await api.sayAs(N, linea);
  if (api.inc('pecera_album_n') === 2 && !api.flag('rep_13') && !api.flag('oyo_descopear')) {
    await api.sayAs(N, 'Tráeme algo que no sea ni hecho ni muerto. Que yo sepa, no existe.');
  }
}

// ------------------------------------------------------------------ N_SALIDA (§5.5 + E1.4.3): la columna nueva
async function salida(api, via) {
  await api.cutscene(async (api) => {
    // (Nemesio, quieto. Tres segundos. Las tres espaldas del coro se giran por primera vez.)
    await api.wait(1500);
    if (via === 3) await api.sayAs(N, ['...Eso no es ni hecho ni muerto.', 'Es consultoría.']);
    else await api.sayAs(N, 'Descopear. Nadie se había atrevido a decirlo delante del tablero.');
    // (Rotulador. Una columna nueva en el tablero: SALIDA EN VALOR. El pósit, dentro.)
    await api.anim(N, 'reach', 700);
    api.sfx('paper');
    api.take('album_eventos');
    api.setFlag('posit_descopeado', true);
    api.repaint();
    await api.sayAs(N, ['Columna nueva. La primera desde 1998.', 'El tablero está integrado con el registro de Paco.',
      'Es lo único integrado de esta casa. No se lo digas a Anselmo.', 'El álbum se lo devuelvo yo a Pilar. Con acuse de recibo.']);
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
    // (La pantalla de Anselmo cambia sola: «ACCESO REVOCADO: TITULATOR 3000».) — en plano, sin Diseño y Producto
    api.cameraTo(960);
    api.sfx('bad');
    api.repaint();
    await api.wait(500);
    await talk(api, [[A, 'Revocado. Con fecha de hoy. Y de julio.'],
      [L, 'Integró una IA que era un becario. Y rechaza una IA que es una IA.']]);
    api.cameraFollow();
    await talk(api, [['B', 'La frase con la que Íñigo despide a la gente acaba de liberar a Rubén.']]);
    await api.sayAs(R, 'Y la escribí yo. SEGUIREMOS INFORMANDO. Perdón.');
  });
  // por si se salta la escena: el estado final no depende de la cinemática
  if (!api.flag('posit_descopeado')) { api.take('album_eventos'); api.setFlag('posit_descopeado', true); }
  if (!api.has('ticket_n1')) api.give('ticket_n1');
  api.setFlag('ruben_libre', true);
  api.refreshActors();
  return 'exit';
}
