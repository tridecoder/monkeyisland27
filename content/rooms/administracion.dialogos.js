// SALA `administracion` — ÁRBOLES DE DIÁLOGO (paquete D; reescritura de comedia P3: plan §5.8 Begoña, §6.4 y §5.13
// las líneas de Evaristo). Biblia §7.6.2 (Begoña: P08 y P11).
// Adenda §4.6 (don Evaristo Salvedad y el micro-puzle MP2 «Escuchar hasta el final»), §4.7 (opción nueva de Begoña),
// §8bis (opción del yunque). Importado por ./administracion.js.
// ENMIENDA E2 (P3): §5.2 (paso 28: escuchar a Evaristo hasta el final, dos aciertos, `evaristo_escuchado` y `rep_16`;
// Begoña le manda a Controlling al cerrar el paso 27), §7.4 (paso 27 y 35), §7.5 fase B (7) (tres sellos, una línea),
// §7.6 (`once`), §8 (la única fecha de la sala: «Nadie lo hacía desde 2009.»).
import { sello } from '../escenas/planta_noble.js';

const BEGONA = 'begona_triplicado', EV = 'evaristo_salvedad';
const sayBe = (api, t) => api.sayAs(BEGONA, t);
const sayEv = (api, t) => api.sayAs(EV, t);

/** P11 · recorte() (Dar pieza_opa o «Necesito recortar ocho líneas.»): plan §5.8, el camino en persona. */
export async function recorte(api) {
  await sayBe(api, ['Toda pieza sufre el recorte estándar del 26 %. Sin excepciones.',
    'Por abajo, que manda la pirámide invertida. Se pierde la conclusión.']);
  await api.say('Pero en la conclusión explico por qué la opa es import...');
  sello(api);
  await sayBe(api, 'Recortado.');
  api.sfx('typewriter');
  await api.wait(500);
  api.setFlag('pieza_recortada', true);
  await sayBe(api, 'Ni una línea más. Ni un céntimo menos.');
}

/** biblia 5.5 `bruno_sellado_frente` (opcional): un comentario por PNJ, una vez. */
async function frente(api, who, text) {
  if (api.flag('bruno_sellado_frente') && api.once('frente_' + who)) await api.sayAs(who, text);
}

export default {
  // ---------------------------------------------------------------- §7.6.2 Begoña
  begona: {
    actor: BEGONA, start: 'B0',
    onStart: async (api) => { await sayBe(api, 'Son las 19:07. Te quedan ocho minutos de existencia administrativa.'); },
    nodes: {
      B0: {
        options: [
          { text: 'Quiero presentar una nota de gasto.', if: '!nota_gasto_presentada', goto: 'B_NOTA' },
          { text: 'Llevan siendo las 19:07 toda la tarde.', once: true, reply: 'Por eso sigo abierta. El horario se cumple.' },
          // plan §5.8 [3]: el recorte del 26 %, en directo, sobre una pregunta (siembra el paso 33)
          { text: 'Begoña, con todo el respeto, yo solo venía a preguntarle si...', once: true,
            do: async (api) => {
              sello(api);                                    // (Begoña levanta un sello. Bruno se calla en seco.)
              await sayBe(api, 'Recortado. Lo que venía después era la conclusión. No la lee nadie.');
              await api.say('¿Me ha recortado una pregunta?');
              await sayBe(api, 'El 26 %. Por abajo. Sin excepciones.');
              await api.say('¿Y qué le iba a preguntar?');
              await sayBe(api, 'No lo sabremos nunca. Así es más limpio.');
            } },
          { text: 'Vengo a ver la pared. Dicen que es un museo de facturas.', once: true,
            reply: ['Mi favorita: «Cena con el ministro». Motivo: «el ministro pagó».',
              'Algún día enmarcaré una buena. Para que se vea la diferencia.'] },
          { text: '¿Usted ha sido feliz alguna vez?', if: 'nota_gasto_presentada', once: true,
            do: async (api) => {
              await sayBe(api, 'Rellene el F-1 de Felicidad. Por triplicado.');
              await api.say('¿Y cuándo me contesta?');
              await sayBe(api, 'En marzo. Con los demás F-1. Hay uno de 1987.');
            } },
          { text: 'Necesito recortar ocho líneas.', if: ['has:pieza_opa', '!pieza_recortada'],
            do: async (api) => { await recorte(api); return 'exit'; } },
          // adenda 4.7 y 8bis (antes de la despedida; se quedan)
          { text: '¿Qué le parece Custodia, la de Secretaría?', once: true,
            reply: ['¿Custodia? No es burocracia, niño. Es temperamento.', 'Eso no se sella.'] },
          { text: '¿Le han pedido algo raro hoy?', once: true,
            reply: ['Un yunque. Por nota de gasto. Concepto: «Sucesión, plaza 7».',
              'Rechazado. Si lo aprobara, tendría que justificar la caída.'] },
          { text: 'Nada. Me iba.', exit: true, reply: 'Salida sin trámite. La anoto como lo más eficiente del día.' },
        ],
      },
      B_NOTA: {
        onEnter: async (api) => { await sayBe(api, ['Uno: concepto. Dos: importe. Tres: justificante.', 'Y como me escribas «varios», te sello la frente.']); },
        options: [
          { text: 'Nada. Importe cero. No he gastado nada.', once: true, goto: 'B0',
            do: async (api) => {
              await api.wait(900);                         // (Pausa. Revisa la nada por las dos caras.)
              await sayBe(api, '...Correcta. Aprobada. Vete. Me has hecho daño.');
              await api.say('He hecho un trámite bien. Primera vez. Lo pongo en «logros».');
            } },
          { text: 'Café para entender el capitalismo.', goto: 'B_IMPORTE' },
          { text: 'Varios.', once: true, goto: 'B0',
            do: async (api) => {
              await sayBe(api, 'Te lo he avisado.');
              sello(api);
              api.setFlag('bruno_sellado_frente', true);
              await api.say('RECHAZADO, en la frente. Mi primer documento oficial. Con sello.');
            } },
          { text: 'Representación. Me represento a mí mismo.', once: true,
            reply: 'Eso no es representación. Es autoestima. Y no desgrava.' },
        ],
      },
      B_IMPORTE: {
        onEnter: async (api) => { await sayBe(api, '«Café para entender el capitalismo». Importe.'); },
        options: [
          { text: 'Lo que sea.', reply: '«Lo que sea». Lo escribo en letra. En número no cabe.', goto: 'B_JUST' },
          { text: '1,40 €, más IVA espiritual.', reply: 'El espíritu no tributa, niño. Por eso no lo veo por aquí.', goto: 'B_JUST' },
          { text: 'Cero. Me lo invitó la máquina.', reply: 'Una invitación es retribución en especie. Se lo comunico a Gertrudis.', goto: 'B_JUST' },
        ],
      },
      B_JUST: {
        onEnter: async (api) => { await sayBe(api, '¿Y el justificante?'); },
        options: [
          { text: 'Aquí tiene. Un sobre de azúcar. Es casi un ticket.', if: 'has:sobre_azucar', goto: 'B_INSULTO' },
          { text: 'Mi palabra de honor.', reply: 'La palabra de honor dejó de ser moneda de curso legal con la peseta.' },
          { text: 'Una foto mental. ¿Se la describo?', reply: 'Las fotos mentales solo se aceptan con NIF. Y por triplicado.' },
          { text: '¿Usted cree en los tickets, Begoña? Pero de verdad.', reply: 'Yo no creo en los tickets, niño. Los tickets creen en mí.' },
          { text: 'Lo busco y vuelvo.', if: '!has:sobre_azucar', exit: true, reply: 'Aquí estaré. A las 19:07.' },
        ],
      },
      B_INSULTO: {
        onEnter: async (api) => {
          if (api.once('administracion_b_insulto')) {
            await sayBe(api, ['Un sobre de azúcar. Caducado en 2021. Del bolsillo de Ramírez, por el olor.',
              'Cuarenta años en esta ventanilla. He visto un ticket en sánscrito.']);
          } else await sayBe(api, 'Esto... esto sigue siendo un insulto a la contabilidad.');
        },
        options: [
          { text: 'Pues enséñeme cómo es una nota bien hecha, si tan lista es.', goto: 'B_EJEMPLAR' },
          // plan §5.8 [2·NO] (sin «Dirección» en Administración: la nota buena es de los Despachos)
          { text: 'Seguro que en los Despachos las hacen peor.', goto: 'B_EJEMPLAR',
            do: async (api) => { await sayBe(api, '¿Peor? ¿Las de los Despachos? Siéntese. Bueno, no hay silla. Mire.'); } },
          { text: 'Lo siento. En la universidad no dimos tickets.', goto: 'B_EJEMPLAR' },
          { text: '¿Me la aprueba o no?', reply: 'Se la apruebo el día que el CMS no se caiga.' },
        ],
      },
      B_EJEMPLAR: {
        onEnter: async (api) => {
          api.sfx('open');
          await api.wait(600);
          await sayBe(api, ['Esto. Esto es una nota de gasto. Como Dios manda.', 'Concepto claro. Importe con céntimos. NIF. Firma.',
            '«Comida de trabajo con Hidrovoltia. 312,00 euros. Firmado: Gervasio.»']);
          await api.say('¿Gervasio come con Hidrovoltia?');
          await sayBe(api, 'Gervasio come con quien haga falta. Y lo justifica. Es su gran talento.');
          api.sfx('machine');
          api.give('fotocopia_nota_direccion');
          await sayBe(api, 'Te la fotocopio, para que aprendas. Y la tuya, por triplicado.');
          // E2 fase B (7): tres sellos, una línea
          for (let i = 0; i < 3; i++) { sello(api); await api.wait(180); }
          await sayBe(api, 'Original. Duplicado. Triplicado.');
          await sayBe(api, 'Rechazadas las tres. El original, para mí. Las copias, para su archivo.');
          api.give('copias_rechazadas');
          api.take('sobre_azucar');
          api.setFlag('nota_gasto_presentada', true);
          api.sfx('pickup');
          // E2 §5.2: Begoña le manda a Controlling (sustituye a la llamada L2)
          await sayBe(api, 'Y pase por Controlling. Don Evaristo le espera. Escúchele hasta el final.');
        },
        options: [
          { text: '¿Y qué hago yo con dos copias de un rechazo?', goto: 'B0',
            reply: 'Nadie lo sabe. Llevo cuarenta años dándolas y nadie vuelve a decírmelo.' },
          { text: '¿Me hace una cuarta copia, para mi abuela?', goto: 'B0',
            lines: [['begona_triplicado', 'No existe el CUADRUPLICADO.'], ['player', '¿Por qué?'],
              ['begona_triplicado', 'Porque la cuarta copia siempre acaba en un juzgado.']] },
          { text: 'Gracias, Begoña.', exit: true, reply: 'No me dé las gracias. Las gracias no se pueden sellar.' },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- E2 §5.2 · don Evaristo Salvedad (paso 28)
  // Humor amable: su manía es la que salva el periódico. Hay que escucharle hasta el final: «¿Para qué me ha llamado?»
  // → «¿De qué trata?» → «Siga.». Cualquier prisa le devuelve a su mesa; se repite desde E0, sin coste.
  evaristo: {
    actor: EV, start: 'E0',
    onStart: async (api) => {
      if (api.once('administracion_evaristo_saludo')) await sayEv(api, 'Pellejo, con jota. Pase un segundo. Una cosita. Muy pequeña.');
      else await sayEv(api, 'Disculpe. ¿Tiene un segundo? Son tres.');
      await frente(api, EV, 'Lleva «RECHAZADO» en la frente. Bien centrado. Begoña tiene pulso.');
    },
    nodes: {
      E0: {
        options: [
          { text: '¿Para qué me ha llamado?', if: ['acto_2_iniciado', '!evaristo_escuchado'], goto: 'E_CORREO' },
          { text: '¿Por qué llama tanto?', once: true, reply: 'Porque por escrito se pierden matices. Y en persona, comas.' },
          { text: '¿Qué hay en esas carpetas?', once: true,
            reply: ['Todos los contratos de la casa. Leídos. Sobre todo la letra pequeña.', 'La grande la lee cualquiera.'] },
          { text: '¿Ha visto mi contrato?', once: true,
            reply: ['Usted no tiene contrato. Tiene seis convenios de prácticas.',
              'Al tercero le falta una coma. No le cambia nada. Pero me quita el sueño.'] },
          { text: '¿Begoña trabaja para usted?', once: true,
            reply: 'Begoña trabaja para el procedimiento. Yo le reviso los triplicados.',
            lines: [[BEGONA, 'Una vez encontró una coma distinta en uno. No dormí en un año.']] },
          { text: '¿Ha enviado ya el correo?', if: 'correo_evaristo_listo',
            reply: 'Programado. Para el momento oportuno. Lo lleva usted en la mano.' },
          { text: 'Me voy.', exit: true, reply: 'Gracias por venir. Le escribiré un correo para agradecérselo.' },
        ],
      },
      E_CORREO: {
        onEnter: async (api) => { await sayEv(api, 'Le he llamado para comunicarle que le voy a escribir un correo.'); },
        options: [
          { text: '¿Y no me lo puede decir ahora?', once: true, reply: 'Ahora no. Lo verbal no lleva comas.' },
          { text: '¿Falta mucho?', exit: true,
            do: async (api) => {
              await sayEv(api, 'Si tiene prisa, se lo pongo por escrito.');
              api.sfx('typewriter');                       // (Teclea. Vuelve a su mesa.)
              await api.wait(700);
              await api.say('Le he mirado el reloj y se ha dado cuenta.');
            } },
          { text: '¿De qué trata?', goto: 'E_DET' },
        ],
      },
      E_DET: {
        onEnter: async (api) => { await sayEv(api, 'De una coma.'); },
        options: [
          { text: 'Siga.', goto: 'E_REVELA' },
          { text: '¿Una coma? ¿Solo?', exit: true, reply: 'Usted también es solo un becario. Y mire. Otro día se lo cuento.' },
        ],
      },
      E_REVELA: {
        onEnter: async (api) => {
          await sayEv(api, 'Contrato de Optimal Brains. El Titulator. Cláusula 4: «48,000 euros al mes».');
          await api.say('Cuarenta y ocho mil.');
          await sayEv(api, ['Eso dice todo el mundo. Por eso nadie llega a la cláusula 12.',
            'La añadí yo: «punto de miles y coma decimal». Con mi cláusula...',
            '...«48,000» son cuarenta y ocho euros. Y pagamos cuarenta y ocho mil.']);
          await api.say('¿Y por qué no lo ha dicho?');
          await sayEv(api, ['Lo dije. El consultor me contestó: «Eso es un detalle sin importancia».',
            'Y yo: «Una coma también lo era. Hasta que alguien la firmó».']);
          api.learnReply('rep_16');
          api.setFlag('evaristo_escuchado', true);
          await sayEv(api, ['Pero ahora dudo de mi propia coma. Me falta una segunda opinión.',
            'De alguien que sepa de comas de verdad.',
            'Gracias por escucharme hasta el final. Nadie lo hacía desde 2009.']);
          return 'exit';
        },
      },
    },
  },
};
