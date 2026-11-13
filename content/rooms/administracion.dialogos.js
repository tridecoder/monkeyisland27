// SALA `administracion` — ÁRBOLES DE DIÁLOGO (paquete D). Biblia §7.6.2 (Begoña: P08 y P11).
// Adenda §4.6 (don Evaristo Salvedad y el micro-puzle MP2 «Escuchar hasta el final»), §4.7 (opción nueva de Begoña),
// §8bis (opción del yunque). Importado por ./administracion.js.
import { sello, SFX } from '../escenas/planta_noble.js';

const BEGONA = 'begona_triplicado', EV = 'evaristo_salvedad';
const sayBe = (api, t) => api.sayAs(BEGONA, t);
const sayEv = (api, t) => api.sayAs(EV, t);

/** P11 · B_RECORTE (también al Dar pieza_opa sin recortar). */
export async function recorte(api) {
  await sayBe(api, ['Toda pieza sufre el recorte estándar del 26 %. Sin excepciones.',
    'Recorto por abajo, como manda la pirámide invertida.', 'Se pierde la conclusión, que no la lee nadie.']);
  api.sfx('typewriter');
  await api.wait(500);
  api.setFlag('pieza_recortada', true);
  await api.say('Treinta y una por cero setenta y cuatro... veintitrés. Exacto.');
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
          { text: '¿Me deja ver la nota de gasto de Dirección?', once: true,
            reply: 'Las notas son confidenciales. Como las nóminas y la receta de la tortilla.' },
          { text: 'Vengo a ver la pared. Dicen que es el Prado de las facturas.', once: true,
            reply: ['Mi favorita: «Cena con el ministro».', '«Motivo de rechazo: el ministro pagó».',
              'Las de Dirección, en cambio, son de manual.', 'Algún día enmarcaré una, para que se vea la diferencia.'] },
          { text: 'Necesito recortar ocho líneas.', if: ['has:pieza_opa', '!pieza_recortada'],
            do: async (api) => { await recorte(api); return 'exit'; } },
          { text: '¿Usted ha sido feliz alguna vez?', if: 'nota_gasto_presentada',
            reply: 'Rellene el F-1 de Felicidad. Por triplicado. Se lo contesto en marzo.' },
          // adenda 4.7 y 8bis (antes de la despedida; se quedan)
          { text: '¿Qué le parece Custodia, la de Secretaría?',
            reply: ['¿Custodia? No es burocracia, niño. Es temperamento.', 'Eso no se sella.'] },
          { text: '¿Le han pedido algo raro hoy?',
            reply: ['Un yunque. Por nota de gasto. Concepto: «Sucesión, plaza 7».',
              'Rechazado. Si lo aprobara, tendría que justificar la caída.'] },
          { text: 'Nada. Me iba.', exit: true, reply: 'Es lo más eficiente que ha hecho hoy.' },
        ],
      },
      B_NOTA: {
        onEnter: async (api) => { await sayBe(api, ['Concepto, importe y justificante.', 'Y como me escribas «varios», te sello la frente.']); },
        options: [
          { text: 'Nada. Importe cero. No he gastado nada.', once: true, goto: 'B0',
            do: async (api) => {
              await api.wait(900);
              await sayBe(api, '...Correcta. Aprobada. Vete. Me has hecho daño.');
              await api.say('He hecho el trámite bien. Ese ha sido mi error.');
            } },
          { text: 'Café para entender el capitalismo.', goto: 'B_IMPORTE' },
          { text: 'Varios.', once: true, goto: 'B0',
            do: async (api) => {
              await sayBe(api, 'Te lo he avisado.');
              sello(api);
              api.setFlag('bruno_sellado_frente', true);
              await api.say('Me ha sellado la frente. RECHAZADO. Al revés, pero se lee.');
            } },
          { text: 'Representación. Me represento a mí mismo.', once: true,
            reply: 'Eso no es representación. Es autoestima. Y no desgrava.' },
        ],
      },
      B_IMPORTE: {
        onEnter: async (api) => { await sayBe(api, '«Café para entender el capitalismo». ¿Importe?'); },
        options: [
          { text: 'Lo que sea.', reply: 'Ajá.', goto: 'B_JUST' },
          { text: '1,40 €, más IVA espiritual.', reply: 'Ajá.', goto: 'B_JUST' },
          { text: 'Cero. Me lo invitó la máquina.', reply: 'Ajá.', goto: 'B_JUST' },
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
              'Cuarenta años en esta ventanilla. He visto un ticket en sánscrito.', 'Pero esto... esto es un insulto a la contabilidad.']);
          } else await sayBe(api, 'Esto... esto sigue siendo un insulto a la contabilidad.');
        },
        options: [
          { text: 'Pues enséñeme cómo es una nota bien hecha, si tan lista es.', goto: 'B_EJEMPLAR' },
          { text: 'Lo siento. En la universidad no dimos tickets.', goto: 'B_EJEMPLAR' },
          { text: '¿Me la aprueba o no?', reply: 'Se la apruebo el día que el CMS no se caiga.' },
          { text: 'Esto es un puzle, ¿verdad? Lo noto en el aire.',
            reply: ['Aquí no hay puzles. Hay procedimientos.', 'Para usted es lo mismo, pero con multa.'] },
        ],
      },
      B_EJEMPLAR: {
        onEnter: async (api) => {
          api.sfx('open');
          await api.wait(600);
          await sayBe(api, ['Esto. Esto es una nota de gasto. Como Dios manda.', 'Concepto claro. Importe con céntimos. NIF. Firma.',
            '«Comida de trabajo con Hidrovoltia. 312,00 euros. Firmado: Gervasio.»']);
          await api.say('¿Gervasio come con Hidrovoltia?');
          await sayBe(api, ['Gervasio come con quien haga falta. Y lo justifica. Es su gran talento.', 'Te la fotocopio, para que aprendas. Por las dos caras: yo todo así.']);
          api.sfx('machine');
          api.give('fotocopia_nota_direccion');
          await sayBe(api, 'Y la tuya, por triplicado.');
          for (const c of ['Original.', 'Duplicado.', 'Triplicado.']) { sello(api); await sayBe(api, c); }
          await sayBe(api, ['Rechazadas las tres. El original, para mí.', 'Duplicado y triplicado, para tu archivo personal.',
            'Y el sobre me lo quedo. Es una prueba.']);
          api.give('copias_rechazadas');
          api.take('sobre_azucar');
          api.setFlag('nota_gasto_presentada', true);
          api.sfx('pickup');
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

  // ---------------------------------------------------------------- adenda §4.6 · don Evaristo Salvedad
  evaristo: {
    actor: EV, start: 'E0',
    onStart: async (api) => {
      if (api.once('administracion_evaristo_saludo')) {
        await sayEv(api, (api.flag('evaristo_llamadas') || 0) >= 1 ? 'Pellejo, con jota. Pase un segundo.' : '¿Pellizco? Pase un segundo.');
        await sayEv(api, 'Una cosita. Muy pequeña.');
      } else await sayEv(api, 'Disculpe. ¿Tiene un segundo? Son tres.');
      await frente(api, EV, 'Lleva RECHAZADO en la frente. Del revés. Lo he leído igual.');
    },
    nodes: {
      E0: {
        options: [
          { text: '¿Para qué me ha llamado?', if: ['evaristo_convoco', '!evaristo_escuchado'], goto: 'E_CORREO' },
          { text: '¿Por qué llama tanto?',
            reply: ['Porque por escrito se pierden matices. Y en persona, comas.', 'Por teléfono no se pierde nada. Solo tiempo. Y no es mío.'] },
          { text: '¿Qué hay en esas carpetas?', once: true,
            reply: ['Todos los contratos de la casa. Leídos. Hasta la letra pequeña.', 'Sobre todo la pequeña. La grande la lee cualquiera.'] },
          { text: '¿Algún cotilleo?', once: true,
            reply: ['El consultor me dijo: «Eso es un detalle sin importancia».', 'Le contesté: «Una coma también lo era. Hasta que alguien la firmó».',
              'Me puso en un pósit azul. Excusas.', 'Yo no pongo excusas. Pongo salvedades.'],
            lines: [['player', 'Me la apunto.']],
            do: async (api) => { api.learnReply('rep_16'); } },
          { text: '¿Ha visto mi contrato?', once: true,
            reply: ['Usted no tiene contrato. Tiene seis convenios de prácticas.', 'Los he leído todos. Al tercero le falta una coma.',
              'No le cambia nada. Pero me quita el sueño.'] },
          { text: '¿Begoña trabaja para usted?', once: true,
            reply: ['Begoña no trabaja para nadie. Trabaja para el procedimiento.', 'Yo le reviso los triplicados. Los tres. Por separado.'],
            lines: [[BEGONA, 'Una vez encontró una coma distinta en uno.'], [BEGONA, 'No dormí en un año.']] },
          { text: '¿Por qué convoca a la gente para anunciar correos?',
            reply: ['Porque nadie lee los correos.', 'Pero todo el mundo viene a un despacho. Por miedo.',
              'Bueno. Venir, no viene nadie. Por eso convoco más.'] },
          { text: '¿Por qué sigue aquí? Se ha ido todo el mundo.',
            reply: ['A las seis y media se va la gente. Los contratos se quedan.',
              'Trabajo en un periódico que se llama el Contable. Alguien tiene que contar.'] },
          { text: 'Aurora dice que su coma está bien.', if: ['coma_bendecida', '!correo_evaristo_listo'], goto: 'E_ENVIO' },
          { text: '¿Ha enviado ya el correo?', if: 'correo_evaristo_listo',
            reply: 'Está programado. Para el momento oportuno. Con todos en copia.' },
          { text: 'Me voy.', exit: true, reply: 'Gracias por venir. Le escribiré un correo para agradecérselo.' },
        ],
      },
      // MP2: hay que escucharle hasta el final; cualquier prisa le devuelve a su mesa (se repite desde E0, sin coste)
      E_CORREO: {
        onEnter: async (api) => { await sayEv(api, 'Le he llamado para comunicarle que le voy a escribir un correo.'); },
        options: [
          { text: '¿Y no me lo puede decir ahora?', reply: 'Ahora no. Lo verbal no lleva comas.' },
          { text: '¿Falta mucho?', exit: true,
            reply: 'Si tiene prisa, se lo pongo por escrito.',
            do: async (api) => {
              api.sfx('typewriter');
              await api.wait(700);
              await api.say('He perdido a un hombre por mirar el reloj. Que está parado.');
            } },
          { text: '¿De qué trata?', goto: 'E_DET1' },
        ],
      },
      E_DET1: {
        onEnter: async (api) => { await sayEv(api, 'De una coma.'); },
        options: [
          { text: 'Siga.', goto: 'E_DET2' },
          { text: '¿Una coma? ¿Solo?', exit: true,
            reply: ['Usted también es solo un becario. Y mire.', 'Bueno. Otro día se lo cuento. Le escribo.'] },
          { text: '¿Esto va por lo de Pellizco?', reply: 'Eso es otro expediente. No mezclemos.' },
        ],
      },
      E_DET2: {
        onEnter: async (api) => {
          await sayEv(api, ['Contrato de Optimal Brains. Cláusula 4. Precio mensual.', 'Pone: cuarenta y ocho. Coma. Cero, cero, cero. Euros.']);
        },
        options: [
          { text: 'Siga, siga.', goto: 'E_DET3' },
          { text: 'Bueno, eso son cuarenta y ocho mil.', reply: 'Eso es lo que dice todo el mundo. Por eso nadie lo lee.' },
          { text: 'Tengo que ir a cerrar una página.', exit: true, reply: 'Lo entiendo. Las páginas cierran. Los contratos, no.' },
        ],
      },
      E_DET3: {
        onEnter: async (api) => {
          await sayEv(api, ['Cláusula 12. La añadí yo en la revisión. Nadie la leyó.',
            '«Las cantidades se expresan con punto de miles y coma decimal.»']);
        },
        options: [
          { text: 'No pare.', goto: 'E_REVELA' },
          { text: '¿Y eso qué significa?', reply: 'Que se lo iba a decir ahora. Si no me interrumpe.' },
        ],
      },
      E_REVELA: {
        onEnter: async (api) => {
          await sayEv(api, ['Con mi cláusula, «48,000» son cuarenta y ocho euros.', 'Nos facturan cuarenta y ocho mil al mes. Desde julio.',
            'Pagamos 47.952 euros de más. Cada mes.']);
          await api.say('¿Y por qué no lo ha enviado?');
          await sayEv(api, ['Porque no estoy seguro de mi propia coma.', 'Llevo tres semanas revisando mi correo. Coma a coma.',
            'Me falta una segunda opinión. De alguien que sepa de comas de verdad.',
            'Gracias por escucharme hasta el final. Nadie lo hacía desde 2009.']);
          api.setFlag('evaristo_escuchado', true);
          return 'exit';
        },
      },
      E_ENVIO: {
        onEnter: async (api) => {
          await sayEv(api, '¿Aurora Galerada? ¿Lo ha dicho ella? ¿Con esas palabras?');
          await api.say('Ha dicho que una coma bien puesta no espera.');
          await api.wait(900);
          api.sfx('computer');
          await sayEv(api, ['Entonces lo envío.', 'En el momento oportuno. Con todos en copia. Como debe ser.']);
          api.sfx(SFX.plin);
          api.setFlag('correo_evaristo_listo', true);
          return 'exit';
        },
      },
    },
  },
};
