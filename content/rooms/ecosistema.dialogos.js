// SALA `ecosistema` (a la vista: «Marketing y Comercial») — ÁRBOLES DE DIÁLOGO. Dueño: P4.
// ENMIENDA E2: §3 Borja ya no es personaje (fuera su árbol: lo que queda de él es su aro de luz, objeto de ./ecosistema.js);
// §4.4 el árbol de Maripaz (cada píxel es espacio publicitario; «cariño» y gong, de condimento); el rumor C pasa por ella
// en segundo lugar (Aurora 1 → Maripaz 2 → desmentido de Teodoro). El asistente de Tadeo, igual.
// El árbol de Pilar Escaleta (Eventos) vive en ./eventos.dialogos.js.
import { gong, SFX } from '../escenas/planta_noble.js';

const MARIPAZ = 'maripaz_remitido';
const sayM = (api, t) => api.sayAs(MARIPAZ, t);
const tadeo = (api, t) => api.sayFrom('portatil_tadeo', t);

/** biblia 5.5 `bruno_sellado_frente` (opcional): un comentario por PNJ, una vez. */
async function frente(api, who) {
  if (api.flag('bruno_sellado_frente') && api.once('frente_' + who)) await api.sayAs(who, 'Llevas RECHAZADO en la frente.');
}

export default {
  // ---------------------------------------------------------------- E2 §4.4 Maripaz (Acto I y tras D1)
  maripaz: {
    actor: MARIPAZ, start: 'M0',
    onStart: async (api) => {
      // rumor C (Aurora lo deja en 1; Maripaz lo sube a 2; Teodoro lo desmiente con >= 2)
      if ((api.flag('rumor_teodoro_n') || 0) === 1) {
        api.inc('rumor_teodoro_n');
        await sayM(api, 'Teodoro es el dueño del edificio. Lo compró en el 97. Por fax.');
      }
      await frente(api, MARIPAZ);
      if (api.once('ecosistema_maripaz_saludo')) await sayM(api, '¿Esa cara? Te la patrocino. «Agobio, con Tilas Calmín».');
      else if (api.flag('duelo_maripaz_ganado') && api.once('ecosistema_maripaz_comision')) await sayM(api, 'Mi becario favorito. Te debo una comisión. No te la voy a pagar.');
      else await sayM(api, '¿Vuelves? En la web eso se llama fidelización. Se cobra el doble.');
    },
    nodes: {
      M0: {
        options: [
          { text: '¿Qué vende Comercial?', once: true,
            do: async (api) => {
              await sayM(api, ['Contenido que paga. Lo vuestro es contenido que no paga.',
                'Branded content: una noticia que es un anuncio, pero no lo dice.']);
              await api.say('¿Eso no es engañar al lector?');
              await sayM(api, 'Es contarle una historia. De una marca. Que paga.');
            } },
          { text: '¿Me vende algo a mí?', once: true,
            do: async (api) => {
              await sayM(api, 'Tengo tres paquetes. Básico, Premium y Gong.');
              await api.say('¿Qué lleva el Gong?');
              gong(api);
              await api.wait(500);
              await sayM(api, 'Esto. Ya lo has consumido. Son doce euros.');
            } },
          { text: 'La web va muy lenta.', once: true,
            do: async (api) => {
              await sayM(api, 'Eso te lo arreglo con un pop-up, cariño.');
              await api.say('¿Un pop-up la hace más rápida?');
              await sayM(api, 'No. Pero mientras lo cierras, no te das cuenta.');
            } },
          { text: 'Mi abuela dice que no encuentra las noticias.', once: true,
            reply: ['Están ahí. Debajo del vídeo que se pone solo.', 'Que baje un poco. Y otro poco. Ahí, entre los colchones.'] },
          { text: '¿Por qué tiene un gong?', once: true,
            do: async (api) => {
              await sayM(api, 'Cada vez que vendo un banner, lo toco.');
              await api.say('¿Y cuando no vende ninguno?');
              await sayM(api, 'Lo toco más fuerte. Que parezca.');
            } },
          { text: '¿Qué tal con Siestatón?', if: 'duelo_maripaz_ganado', once: true,
            reply: 'Encantados. En la web caben en todas partes. Hasta en la X de cerrar.' },
          { text: 'Me voy.', exit: true,
            do: async (api) => { gong(api); await sayM(api, '¿Seguro que quieres salir? Era una pregunta. Y un anuncio.'); } },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- §5.16 · el asistente de Tadeo (habla el portátil)
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
          { text: '¿Quién es Tadeo?', once: true,
            do: async (api) => { await tadeo(api, '¡Excelente pregunta! Tadeo es tu usuario favorito.'); } },
          { text: '¿Lees lo que te reenvía?', once: true,
            do: async (api) => { await tadeo(api, '¡Excelente pregunta! No. Él tampoco.'); } },
          { text: 'Adiós.', exit: true,
            do: async (api) => {
              await tadeo(api, '¡Excelente despedida! ¿Quieres que la reenvíe?');
              api.sfx(SFX.plin);
            } },
        ],
      },
    },
  },
};
