// SALA `ecosistema` (a la vista: «Marketing y Comercial») — ÁRBOLES DE DIÁLOGO. Dueño: P4. Plan de comedia §5.16 (Borja,
// cuatro opciones; el asistente de Tadeo, tres) y §5.17 (Maripaz: su «cariño» pasa a letra pequeña; el duelo D1 se ha
// mudado a la Sala Amazonas). Rumores: se quedan A3 (Borja) y C3 (Maripaz); fuera B y D (§10.1). Importado por ./ecosistema.js.
// El árbol de Pilar Escaleta (Eventos) vive en ./eventos.dialogos.js.
import { gong, SFX } from '../escenas/planta_noble.js';

const BORJA = 'borja_engagement', MARIPAZ = 'maripaz_remitido';
const sayB = (api, t) => api.sayAs(BORJA, t);
const sayM = (api, t) => api.sayAs(MARIPAZ, t);
const tadeo = (api, t) => api.sayFrom('portatil_tadeo', t);

/** biblia 5.5 `bruno_sellado_frente` (opcional): un comentario por PNJ, una vez. */
async function frente(api, who) {
  if (api.flag('bruno_sellado_frente') && api.once('frente_' + who)) await api.sayAs(who, 'Llevas RECHAZADO en la frente.');
}

export default {
  // ---------------------------------------------------------------- §5.16 Borja (la cara de Marketing)
  borja: {
    actor: BORJA, start: 'BJ0',
    onStart: async (api) => {
      await sayB(api, '¡Bruno! ¡Justo hablábamos de tu marca personal!');
      // rumor A3 (se queda): como mucho uno por conversación
      if ((api.flag('rumor_firma_n') || 0) === 2) {
        api.inc('rumor_firma_n');
        await sayB(api, '¡Me dicen que vas a comprar el periódico! ¡Eso es un lanzamiento!');
        await sayB(api, 'Te hago la campaña: «Sonríe como si tuvieras liquidez».');
      }
      await frente(api, BORJA);
    },
    nodes: {
      BJ0: {
        options: [
          { text: '¿Qué hacéis en Marketing?', once: true,
            reply: ['¡Contenido! Todo lo que pasa delante de mí es contenido.', '¡No te muevas! ¡Así, triste! ¡Eso en vertical lo peta!'] },
          { text: '¿Has leído mi pieza?', once: true, reply: 'No lo he leído. Lo he compartido. Es más rápido.' },
          { text: 'Esta noche hay una opa.', once: true, reply: '¿Una opa? ¡Qué bonito! ¿Es un evento? ¿Hay croquetas?' },
          { text: 'Me voy.', exit: true, do: async (api) => { await sayB(api, '¿Te vas? ¡Eso es una salida de escena! ¡Lo subo!'); } },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- §5.17 Maripaz (Acto I y tras D1)
  maripaz: {
    actor: MARIPAZ, start: 'M0',
    onStart: async (api) => {
      if ((api.flag('rumor_teodoro_n') || 0) === 2) {
        api.inc('rumor_teodoro_n');
        await sayM(api, 'Teodoro es el dueño del edificio. Lo compró en el 97. Por fax. (*Fuente: yo.)');
      }
      await frente(api, MARIPAZ);
      await sayM(api, '¿Esa cara? Te la patrocino. «Agobio, con Tilas Calmín».');
    },
    nodes: {
      M0: {
        options: [
          { text: '¿Qué vende Comercial?', reply: 'No vendemos anuncios. Vendemos contenido que paga. (*Paga usted.)' },
          { text: '¿Qué tal con Siestatón?', if: 'duelo_maripaz_ganado', reply: 'Encantados. Ahora la web respira. El banner, digo.' },
          { text: 'Me voy.', exit: true, do: async (api) => { gong(api); await sayM(api, 'Eso ha sido una despedida. La facturo.'); } },
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
