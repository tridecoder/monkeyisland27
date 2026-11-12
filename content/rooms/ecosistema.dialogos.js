// SALA `ecosistema` — ÁRBOLES DE DIÁLOGO (paquete D). Biblia §7.7.8 (Borja), §7.7.9 (Maripaz); adenda §4.5 (portátil de
// Tadeo), rumores §8.1 paso 3 (Borja), §8.3 paso 3 (Maripaz), §8.4 paso 1 (Borja). Importado por ./ecosistema.js.
import { flash, gong, SFX } from '../escenas/planta_noble.js';

const BORJA = 'borja_engagement', MARIPAZ = 'maripaz_remitido';
const sayB = (api, t) => api.sayAs(BORJA, t);
const sayM = (api, t) => api.sayAs(MARIPAZ, t);
const tadeo = (api, t) => api.sayFrom('portatil_tadeo', t);

/** P07: «La página 7 está pendiente desde marzo» → duelo D1 (Hablar M0 opción 2 y Dar planillo). */
export async function abrirDueloMaripaz(api, conFrase) {
  if (conFrase) await api.say('La página 7 está pendiente desde marzo.');
  await sayM(api, '¿Desde marzo sin confirmar? Eso no es un cliente, es un exnovio.');
  await sayM(api, 'Vale, los paso a la web. Pero alguien tiene que llamar a Siestatón.');
  await api.duel('maripaz');
}

/** biblia 5.5 `bruno_sellado_frente` (opcional): un comentario por PNJ, una vez. */
async function frente(api, who) {
  if (api.flag('bruno_sellado_frente') && api.once('frente_' + who)) await api.sayAs(who, 'Llevas RECHAZADO en la frente.');
}

export default {
  // ---------------------------------------------------------------- §7.7.8 Borja
  borja: {
    actor: BORJA, start: 'BJ0',
    onStart: async (api) => {
      await flash(api);
      await sayB(api, '¡Gracias! ¡Eso es contenido!');
      // rumores (adenda 8): como mucho uno por conversación; prioridad A, luego D
      if ((api.flag('rumor_firma_n') || 0) === 2) {
        api.inc('rumor_firma_n');
        await sayB(api, '¡Me dicen que vas a comprar el periódico! ¡Foto de propietario!');
        await flash(api);
        await sayB(api, '¡Sonríe como si tuvieras liquidez!');
      } else if (api.flag('acto_2_iniciado') && (api.flag('rumor_plaza_n') || 0) === 0) {
        api.inc('rumor_plaza_n');
        await sayB(api, '¡Dicen que Gervasio deja la plaza 7! ¡Se ha comprado una bici!');
      }
      await frente(api, BORJA);
    },
    nodes: {
      BJ0: {
        options: [
          { text: '¿Para qué es el photocall?', reply: 'Lo que no está en el photocall no ha ocurrido.' },
          { text: '¿Qué evento hay hoy?', once: true, reply: 'Ninguno. Pero lo estamos montando. Es una experiencia de marca con canapé.' },
          { text: '¿Me prestas el álbum?', if: ['ruben_encontrado', '!oyo_descopear'],
            reply: ['¿Mi álbum? Es contenido. Te lo presto si lo compartes.', 'Por cierto: hemos descopeado la ética del Q3. Por si te sirve.'],
            lines: [['player', 'Descopear. Me lo apunto.']],
            do: async (api) => { api.give('album_borja'); api.setFlag('oyo_descopear', true); api.sfx('pickup'); return 'exit'; } },
          { text: 'Me voy.', exit: true, do: async (api) => { await flash(api); await sayB(api, '¡Salida de escena! ¡Contenido!'); } },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- §7.7.9 Maripaz
  maripaz: {
    actor: MARIPAZ, start: 'M0',
    onStart: async (api) => {
      if ((api.flag('rumor_teodoro_n') || 0) === 2) {
        api.inc('rumor_teodoro_n');
        await sayM(api, 'Teodoro es el dueño del edificio, cariño. Lo compró en el 97. Por fax.');
      }
      await frente(api, MARIPAZ);
      await sayM(api, '¿Esa cara? Te la patrocino. «Agobio, con Tilas Calmín».');
    },
    nodes: {
      M0: {
        options: [
          { text: '¿Qué vende Comercial?', reply: 'No vendemos anuncios, cariño. Vendemos contenido que paga.' },
          { text: 'La página 7 está pendiente desde marzo.', if: ['has:planillo', '!duelo_maripaz_ganado'],
            do: async (api) => { await abrirDueloMaripaz(api, false); return 'exit'; } },
          { text: '¿Qué tal con Siestatón?', if: 'duelo_maripaz_ganado', reply: 'Encantados. Ahora la web respira. El banner, digo.' },
          { text: 'Me voy.', exit: true, do: async (api) => { gong(api); await sayM(api, 'Eso ha sido una despedida. La facturo.'); } },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- adenda §4.5 · el asistente de Tadeo (habla el portátil)
  portatil_tadeo: {
    actor: 'tadeo_adjunto', start: 'TA0',
    onStart: async (api) => {
      await tadeo(api, 'Tadeo no está. Soy su asistente. ¡Excelente pregunta!');
      await api.say('No he preguntado nada.');
      await tadeo(api, '¡Excelente silencio! ¿Quieres que te lo resuma en una tabla?');
    },
    nodes: {
      TA0: {
        options: [
          { text: '¿Dónde está Tadeo?', once: true,
            do: async (api) => { await tadeo(api, ['En casa, desde las seis. Pero sigue muy presente.', 'Presente en todas las bandejas de entrada del edificio.']); } },
          { text: '¿Tadeo lee lo que reenvía?', once: true,
            do: async (api) => { await tadeo(api, 'Tadeo confía. Leer es para quien duda.'); } },
          { text: '¿Qué son las Core Web Vitals?', once: true,
            do: async (api) => { await tadeo(api, ['Tres medidas de la página: carga, respuesta y estabilidad.', 'Tadeo propuso quitar la página. Para que cargue antes.']); } },
          { text: 'Deja de reenviar.',
            do: async (api) => {
              await tadeo(api, '¡Entendido! Reenvío tu petición a todo el edificio.');
              for (let i = 0; i < 3; i++) { api.sfx(SFX.plin); await api.wait(220); }
            } },
          { text: '¿Os contesta alguien?', if: 'ruben_encontrado', once: true,
            do: async (api) => { await tadeo(api, ['Una cuenta: Titulator 3000. Siempre: «Gracias, Tadeo».', 'Es nuestro mejor cliente. No compra nada.']); } },
          { text: 'Me voy.', exit: true,
            do: async (api) => {
              await tadeo(api, '¿Quieres que reenvíe tu salida?');
              await api.say('No.');
              api.sfx(SFX.plin);
              await tadeo(api, 'Reenviada.');
            } },
        ],
      },
    },
  },
};
