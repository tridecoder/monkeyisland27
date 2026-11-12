// SALA `pecera` — ÁRBOLES DE DIÁLOGO (paquete B). Importado desde ./pecera.js.
// Biblia 7.7.2 (Yoli), 7.6.3 (Nerea); adenda 4.1 (Leoncio), 4.2 (Anselmo), 4.3 (coro de Desarrollo) y 4.7 (Nerea).
// Opciones con el texto LITERAL de la biblia/adenda (el walkthrough las busca por texto).
// Convención de la biblia 7.6: una opción ya usada que no cambia nada desaparece (once) salvo «(se queda)».
import { talk } from './pecera.voces.js';

const Y = 'yoli_tendencias', N = 'nerea_backlog', L = 'leoncio_quesitos', A = 'anselmo_monolito';

export default {
  // ---------------------------------------------------------------- 7.7.2 Yoli (solo con cms_vivo; sin él, ver pecera.js)
  yoli: {
    actor: Y, start: 'Y0',
    onStart: async (api) => {
      await api.sayAs(Y, ['Hola Bruno, Bruno becario, becario elContable, cuánto cobra un becario.', 'Perdona, me sale solo.']);
    },
    nodes: {
      Y0: {
        options: [
          { text: '¿Qué tal la audiencia?', reply: 'Eso que sientes no es tristeza, Bruno. Es una caída del CTR.' },
          { text: '¿Algún hilo bueno esta noche?', once: true,
            reply: ['Maripaz me escribió "desde el más absoluto cariño".', 'Le contesté: "Y yo te leo desde el más absoluto modo avión".', 'Me ha puesto en copia a mi madre.'],
            do: async (api) => { api.learnReply('rep_08'); } },
          { text: '¿Quién comenta mis piezas?', once: true, reply: 'Una cuenta que solo pone "abrígate". En todo. Será un bot.' },
          { text: 'Íñigo va a cerrar el papel.', if: 'acto_3_iniciado', reply: 'Si cierra el papel, ¿quién me va a odiar con criterio?' },
          { text: 'Me voy.', exit: true, reply: 'Vuelve cuando tengas un titular con número.' },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- 7.6.3 Nerea (+ adenda 4.7)
  nerea: {
    actor: N, start: 'N0',
    nodes: {
      N0: {
        options: [
          { text: '¿Qué es ese pósit tan amarillo?', once: true,
            reply: ['"Contratar al becario de marzo, 1998". Alguien lo movió a HECHO (PERO NO).', 'Nadie lo hizo. Le tenemos cariño.'] },
          { text: '¿Por qué un calendario de ferretería?', once: true,
            reply: 'El del ordenador miente. Este no: trae santoral y tacos del 8.' },
          { text: '¿Qué tal con Yoli?', once: true,
            reply: ['Me dijo que mi dato de tráfico estaba "sacado de contexto".', 'Le contesté: "Dame el contexto y lo pongo en el subtítulo".',
              '"Que ahí no lo lee nadie". No hemos vuelto a comer juntas.', 'Bueno, ella no come. Mide.'],
            do: async (api) => { api.learnReply('rep_09'); } },
          { text: 'Necesito la baja de Rubén.', once: true, if: ['ruben_encontrado', '!has:album_borja', '!posit_descopeado'],
            reply: ['¿Rubén?', 'Ah. "Baja becario Rubén". Por Hacer. Desde julio.', 'Un pósit solo sale del tablero de dos formas: hecho o muerto.',
              'Y para darlo por hecho necesito pruebas de que el becario existió.', 'No sale en ninguna foto, ninguna acta, ningún sitio. Es como tú.'] },
          { text: 'Mira este álbum.', if: 'has:album_borja', goto: 'N_ALBUM_INTRO' },
          // adenda 4.7 (se queda)
          { text: '¿Por qué está bloqueado lo de Herminia?',
            reply: ['Lo bloquea Anselmo. Y a Anselmo lo bloquea Anselmo.', 'Es la dependencia más estable del tablero.'] },
          { text: 'Nada, ya me voy.', exit: true, reply: 'Cierra la puerta al salir. No hay puerta. Ciérrala igual.' },
        ],
      },
      // N_ALBUM (también al Dar album_borja): las líneas de entrada van en un nodo puente para no repetirlas
      N_ALBUM_INTRO: {
        onEnter: async (api) => {
          await api.sayAs(N, ['Al fondo... en todas. Un chico pálido. Con un táper.', 'En la cena de Navidad, yendo al baño. En el photocall, yendo al baño.',
            'Existió. Existe. Va mucho al baño.', 'Pero sigue sin estar hecho. Y muerto no está. Creo.']);
          return 'N_ALBUM';
        },
      },
      N_ALBUM: {
        options: [
          { text: '¿Y si lo damos por hecho?', reply: 'Hecho sería que alguien le hubiera dado de baja. Nadie lo ha hecho.' },
          { text: '¿Y si le hacemos un funeral? Con flores. Y diapositivas.', reply: 'No me tientes. Ya tengo la plantilla.' },
          { text: '¿Y si... lo descopeamos?', if: 'oyo_descopear', goto: 'N_DESCOPE' },
          { text: 'Lo pienso y vuelvo.', exit: true, reply: 'Eso dijo Rubén en julio.' },
        ],
      },
      N_DESCOPE: {
        onEnter: async (api) => {
          // (Nerea se queda quieta. De su ordenador salen violines que nadie ha puesto.)
          api.sfx('good');
          await api.wait(700);
          await api.sayAs(N, ['Nadie... nadie se había atrevido a decirlo en voz alta.', 'Descopear. Es lo más bonito que me han dicho delante del tablero.']);
          // (Despega el pósit con dos dedos, como quien retira una medalla.)
          await api.anim(N, 'reach', 700);
          api.sfx('paper');
          api.give('posit_baja_ruben');
          api.take('album_borja');
          api.setFlag('posit_descopeado', true);
          api.repaint();
          await api.sayAs(N, 'El álbum se lo devuelvo yo a Borja. Es contenido.');
        },
        options: [
          { text: 'Prometo cuidarlo.', exit: true, reply: 'No lo cuides. Llévaselo a Paco. Es lo que Rubén habría querido.' },
          { text: '¿Le digo algo a la familia?', exit: true, reply: 'Diles que en nuestros corazones está en Hecho.' },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- adenda 4.1 Leoncio
  leoncio: {
    actor: L, start: 'LQ0',
    onStart: async (api) => {
      await api.anim(L, 'reach', 600);                    // (dibuja algo en el aire)
      await api.sayAs(L, 'Vacante. En tarta, eres un quesito muy fino.');
    },
    nodes: {
      LQ0: {
        options: [
          { text: '¿Qué es Herminia?',
            reply: ['Mi herramienta. La hice con IA en tres fines de semana.', 'Infografías para papel, web y redes. Con el estilo de la casa.',
              'Lo hace mejor que todo mi departamento. Me incluyo.', 'Me duele, pero me incluyo.'] },
          { text: '¿Y tu departamento?', once: true,
            reply: ['Se fue a las seis y media. Herminia no ficha.', 'Dejaron las chaquetas en las sillas, mirándola. Por respeto.'] },
          { text: '¿Por qué no se publica lo que hace?', once: true,
            reply: ['Porque Anselmo no la integra. Dice que no ha pasado por Desarrollo.', 'Le he mandado cuarenta y un pósits. Me los devuelve con un "NO".',
              'En su tipografía, que es fea.'] },
          { text: '¿Y esos gráficos de Desarrollo?', once: true, if: 'acto_2_iniciado',
            reply: ['Soluciones de Anselmo. Me las pone en mi sección sin preguntar.', 'Su quesito suma 130 %.',
              'Un quesito que suma 130 % no es un gráfico. Es una aspiración.'] },
          { text: '¿Y si Herminia tuviera alta en Sistemas?', if: ['anselmo_dijo_regla', '!leoncio_acepta_alta'], goto: 'LQ_ALTA' },
          { text: 'El Titulator era un becario.', once: true, if: 'ruben_encontrado',
            do: async (api) => {
              await talk(api, [['wait', 900], [L, 'Integró una IA que era un becario. Y rechaza una IA que es una IA.'],
                [L, 'Herminia lo ha puesto en un gráfico. Se sale del eje.']]);
            } },
          { text: '¿Qué tal ahora con Anselmo?', if: 'infografia_integrada',
            reply: 'Me han anexionado. Pero integrada. Que es lo que quería. Creo.' },
          { text: 'Me voy.', exit: true, reply: 'Cuidado con la cinta. Se ha movido desde que has llegado.' },
        ],
      },
      LQ_ALTA: {
        onEnter: async (api) => {
          await api.sayAs(L, '¿Alta? ¿Como a una persona?');
          await api.anim(L, 'reach', 900);                  // (dibuja un quesito en el aire; se le queda a medias)
          await api.sayAs(L, ['Llevo veinte años aquí y a mí nunca me dieron de alta en nada.', 'Hazlo. Pero que conste que es mía. Aunque sea suya.']);
          api.setFlag('leoncio_acepta_alta', true);
          return 'exit';
        },
      },
    },
  },

  // ---------------------------------------------------------------- adenda 4.2 Anselmo
  anselmo: {
    actor: A, start: 'AN0',
    onStart: async (api) => {
      if (api.once('pecera_anselmo_saludo')) {
        await talk(api, [[A, 'Alto. Esto es Desarrollo. ¿Traes algo de fuera?'], ['B', 'Solo a mí.'], [A, '¿Eres de Desarrollo?'], ['B', 'Soy Vacante.'],
          [A, 'Pase. Lo vacío no se integra, pero tampoco molesta.']]);
      } else await api.sayAs(A, '¿Otra vez cruzando? Te voy a pedir visado.');
    },
    nodes: {
      AN0: {
        options: [
          { text: '¿Por qué no integras la herramienta de Leoncio?', once: true,
            do: async (api) => talk(api, [[A, 'Está hecha con IA. En otro departamento.'], [A, 'En mis sistemas solo entra lo que sale de mis sistemas.'],
              ['B', '¿Y si funciona?'], [A, 'Peor. Si funciona, la gente se acostumbra.']]) },
          { text: '¿Y tú no usas IA?', once: true,
            do: async (api) => talk(api, [[A, 'Mucha. Desde Desarrollo. Para los demás.'], [A, 'Un corrector para Aurora. Un narrador del Ibex para Celestino.'],
              [A, 'Y notas de gasto generativas para Begoña.'], ['B', '¿Y eso no es meterse en su trabajo?'], [A, 'No es meterse. Es transversalidad.']]) },
          { text: '¿Tu IA no es de fuera también?', once: true,
            reply: ['La IA es de fuera. Pero el prompt es de dentro.', 'Eso la hace nuestra.'] },
          { text: '¿Y el Titulator? Ese sí entró.',
            do: async (api) => {
              if (!api.flag('ruben_encontrado')) {
                await api.sayAs(A, ['Tenía alta de usuario. Personal interno.', 'Lo que tiene alta en Sistemas es de la casa. Lo de la casa entra.']);
              } else {
                await talk(api, [['B', 'El Titulator era un becario. En un armario.'], [A, 'En un armario de mis sistemas. Todo en regla.'],
                  ['wait', 1500], [A, '...Lo revoco. Con fecha de hoy. Y de julio.'], [A, 'Lo que tiene alta es de la casa. Aunque sea un chaval.']]);
              }
              api.setFlag('anselmo_dijo_regla', true);
            } },
          { text: '¿Por qué eres tan celoso de tus sistemas?',
            do: async (api) => talk(api, [[A, 'Cuando algo se rompe a las tres de la mañana, ¿quién baja?'], ['B', '¿Paco?'], [A, 'Paco abre un ticket. Bajo yo.']]) },
          { text: 'He arreglado el CMS.', if: 'cms_vivo',
            do: async (api) => talk(api, [[A, '¿Cómo?'], ['B', 'Desenchufando una pantalla.'], [A, 'Solución de terceros. La pongo en mi revisión.'],
              [A, 'Mi revisión es en marzo.']]) },
          { text: 'Hay una becaria nueva en Desarrollo.', if: ['herminia_de_alta', '!infografia_integrada'], goto: 'AN_HERMINIA' },
          { text: 'Me voy.', exit: true, reply: 'Sal por la frontera. La de entrada está en mantenimiento.' },
        ],
      },
      AN_HERMINIA: {
        onEnter: async (api) => {
          await talk(api, [[A, '¿Una becaria? ¿En mi equipo? ¿Con alta?'], ['B', 'Con alta de Sistemas. Cuarenta segundos.'],
            [A, '"Herminia. Becaria de Desarrollo. Herramienta."'], [A, '...Es de la casa. Entonces es estupenda.'],
            [A, 'Mira qué infografías. Con nuestro estilo. Lo llevamos en la sangre.']]);
          // (Anselmo se agacha y despega la cinta de carrocero. Toda. Un ruido largo.)
          await api.anim(A, 'reach', 900);
          api.sfx('paper'); await api.wait(500); api.sfx('paper');
          api.setFlag('infografia_integrada', true);
          api.repaint();
          await talk(api, [[A, 'Ya no hace falta frontera. Ahora todo esto es Desarrollo.'], [L, 'Me han anexionado.'],
            [L, '...Pero integrada. Que es lo que quería. Creo.'], [N, 'Si no está en el tablero, no existe.']]);
          // (Nerea pega un pósit: «HERMINIA — HECHO»)
          await api.anim(N, 'reach', 600);
          api.sfx('paper');
          return 'exit';
        },
      },
    },
  },

  // ---------------------------------------------------------------- adenda 4.6b · cameo de Valentín Retícula
  // Trabaja en la Pecera, junto a la bandeja de Diseño, a dos metros del coro que culpa a Diseño de todo.
  valentin: {
    actor: 'valentin_reticula', start: 'VR0',
    onStart: async (api) => { await api.sayAs('valentin_reticula', 'Un segundo, que estoy dirigiendo.'); },
    nodes: {
      VR0: {
        options: [
          { text: '¿Qué está dirigiendo?', once: true,
            reply: ['Una aventura gráfica sobre esta redacción. Nueve salas. Nueve verbos.', 'Ahora mismo, un becario me pregunta qué estoy dirigiendo.'],
            lines: [['player', '...¿Ese soy yo?'], ['valentin_reticula', 'Eres un sprite muy bien resuelto. El remolino, sobre todo.']] },
          { text: '¿Por qué trabaja aquí, al lado de Desarrollo?', once: true,
            reply: ['Porque aquí se entrega. La bandeja está a dos metros.', 'Y desde aquí oigo en directo de qué tengo la culpa.'],
            lines: [['player', '¿Y no le molesta?'], ['valentin_reticula', 'Llevo cascos. Sin música. Es aislamiento por diseño.']] },
          { text: 'Desarrollo dice que todo es culpa de Diseño.',                       // (se queda)
            reply: ['Lo sé. Lo dicen a dos metros. Yo lo entrego a las 18:29.', 'Diseño tiene la culpa de todo lo que Desarrollo no abre.'] },
          { text: '¿Sabía que la pantalla tumbaba el CMS?', once: true, if: 'cms_vivo',
            reply: ['Desde 2017. Está en la bandeja. Primera hoja.', 'Con una flecha roja. De dos píxeles de grosor. Para que se viera.'] },
          { text: '¿Es verdad que le quieren fusionar con Infografía?', once: true,
            reply: ['Tercera vez esta semana. No.', 'Infografía hace gráficos. Diseño hace que se entiendan. Son dos oficios.',
              'Íñigo me lo propuso en una matriz. Se la devolví alineada.'] },
          { text: '¿Algún consejo?',                                                     // (se queda)
            reply: ['Si te atascas, llama a tu abuela. La diseñamos como sistema de pistas.', 'Y prueba cosas raras. Aquí todo lo raro está probado.'] },
          { text: '¿Usted sabía lo del Titulator?', if: 'ruben_encontrado', once: true,
            reply: ['En mi juego, el Titulator ya era un becario.', 'Una IA no pone las tildes con tanto cariño.'] },
          { text: '¿Cómo va siempre tan bien vestido?',                                  // (se queda)
            reply: 'Me visto como entrego: a tiempo y sin adornos de más.' },
          { text: 'Me voy.', exit: true, reply: 'Sal por el ascensor. Lo he rediseñado. No se nota: eso es lo bueno.' },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- adenda 4.3 coro de Desarrollo
  coro: {
    actor: 'coro_desarrollo', start: 'CO0',
    onStart: async (api) => {
      // (Bruno les habla. Las tres sillas giran un poco. Las espaldas, no.)
      await talk(api, [['CORO', '¿Diseño?'], ['B', 'No. Bruno.'],
        api.flag('foto_en_organigrama') ? ['D2', 'Cuelgas de Diseño en el organigrama. Algo será.'] : ['D1', 'Ah. Entonces no es culpa tuya.']]);
      // (Vuelven a gritar.)
    },
    nodes: {
      CO0: {
        options: [
          { text: '¿Por qué gritáis tanto?',
            do: async (api) => talk(api, [['D2', '¡No gritamos!'], ['D1', '¡Es que juntos no nos oímos!'],
              [N, 'Juntos son un incendio. Por separado, santos.'], [N, 'El problema es que nunca están por separado.']]) },
          { text: '¿Con quién estáis enfadados?', once: true,
            do: async (api) => talk(api, [['D1', 'Con el navegador. Con los lectores. Con la lluvia.'], ['D2', 'Con el de al lado.'],
              ['D1', '¡Con el de al lado no!'], ['D2', '¡Pues ahora sí!'], ['D3', 'No.']]) },
          { text: '¿Por qué se ha caído el CMS?', once: true, if: '!cms_vivo',
            do: async (api) => talk(api, [['CORO', '¡Diseño!'], [N, 'El CMS no es nuestro, es de Sistemas.'],
              ['D1', 'Pues Sistemas lo habrá diseñado mal. ¡Diseño!']]) },
          { text: 'El CMS lo he arreglado yo.', if: 'cms_vivo',
            do: async (api) => talk(api, [['D2', 'Lo hemos arreglado nosotros.'], ['B', 'He desenchufado una pantalla.'], ['wait', 900],
              ['D1', '...Pues la pantalla la eligió Diseño.']]) },
          { text: '¿Quién es Diseño?',
            do: async (api) => {
              if (!api.flag('foto_en_organigrama')) {
                await talk(api, [['D2', 'Diseño y Producto. Se fueron a las seis y media. Menos su director.'],
                  ['D1', 'Que está ahí mismo. Con todo entregado. Qué poca vergüenza.'], ['D3', 'No.']]);
              } else {
                await talk(api, [['D2', 'Se fueron. Pero en el organigrama les queda uno. El de VACANTE.'], ['B', 'Vacante soy yo.'],
                  ['D1', 'Pues has roto el CMS.'], ['B', 'Llevo aquí diez minutos.'], ['D2', 'Suficiente para Diseño.']]);
              }
            } },
          { text: 'Diseño os avisó de lo del CMS. En 2017.', once: true, if: 'bandeja_diseno_abierta', goto: 'CO_BANDEJA' },
          { text: 'Herminia ahora es de Desarrollo.', once: true, if: 'infografia_integrada', goto: 'CO_HERMINIA' },
          { text: 'Me voy.', exit: true, do: async (api) => talk(api, [['CORO', '¡Vale!']]) },   // (lo gritan como un insulto, sin serlo)
        ],
      },
      CO_BANDEJA: {
        onEnter: async (api) => {
          await talk(api, [['B', 'Está en vuestra bandeja. Firmado: Diseño y Producto, 2017.'],
            // (DEV 1 lee en voz alta, cada vez más bajo.)
            ['D1', '"La pantalla de Dirección consulta el CMS cada segundo..."'], ['D1', '"...Lo tumbará. Proponemos apagarla."']]);
          api.setState('semaforo_ruido', 'ambar');           // (Silencio. El semáforo de ruido baja a ámbar.)
          await api.wait(900);
          await talk(api, [['D2', '...Lo entregaron a su hora.'], [N, 'Lo tengo en HECHO (PERO NO). Desde 2017. Lo moví yo.'],
            [A, 'Eso no pasó por Desarrollo.'], [N, 'Sí pasó. Por la bandeja.'], ['D3', '...Perdón.'],
            ['CORO', 'Perdón, Diseño.'], ['D1', 'No se lo digáis. Que no se entere.'], ['valentin_reticula', 'Ya lo sé.']]);
          api.setState('semaforo_ruido', 'rojo');
          return 'exit';
        },
      },
      CO_HERMINIA: {
        onEnter: async (api) => {
          // (En la pantalla de Herminia aparece un gráfico. Las tres espaldas se giran.)
          await talk(api, [['H', 'CULPAS A DISEÑO: 3.112. CON RAZÓN: 0.'], ['D2', '...¿Cero?'],
            ['D1', 'Es de Herminia. Ahora es nuestra. Así que es verdad.']]);
          api.setState('semaforo_ruido', 'verde');          // (Silencio largo. El semáforo se pone verde. Por primera vez.)
          await api.wait(1400);
          await talk(api, [['D3', '...A Sistemas.'], ['CORO', '¡SISTEMAS!'], ['paco_ticket', 'Otro ticket.']]);
          api.setState('semaforo_ruido', 'rojo');
          return 'exit';
        },
      },
    },
  },
};
