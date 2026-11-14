// SALA `cpd` (a la vista: «Sistemas») — LÓGICA. Dueño: P1 · «Vestíbulo, Sistemas y final» (docs/guion2/PLAN_COMEDIA.md
// §11 P1 + ENMIENDA E1.8). Plan de comedia: §4.2 (registro nuevo, `regleta_r3` y la escena del apagón: paso 20), §5.7
// (árbol de Paco; fuera los rumores B y D y la entrega del pósit), §4.6 (revelación de Rubén con primer plano y titulares:
// paso 35), §5.12 (árbol de Rubén: rep_13, rep_15 y el táper de §4.4), §4.7 (la rejilla retransmite a Celestino),
// §6.3-6.4 (líneas de Bruno), [E1] ticket nº 2 «Firmado: Anselmo» y `P_ALTA` reescrito (E1.5, pone `herminia_de_alta`).
// Escena que registra (global): `revelacion_ruben` (la lanza Tirar papel_continuo en el Acto III).
// El ascensor usa la botonera común (../lib/ascensor.js): -1 · 0 · 1 · 2.
// El arte y la geometría están en ./art/cpd.art.js. Estados que el arte dibuja: `armario_27`: 'cerrado' | 'entreabierto'
// (solo en 7.3) | 'abierto' (Rubén dentro) | 'vacio' (desde ruben_libre); `papel_continuo`: 'asoma' | 'tensa' (7.3) |
// 'recogida'; `regleta_r3`: 'encendida' | 'apagada' (piloto verde). Flag que lee: paco_tickets (cifra del contador LED).
// Cruces (§11.1): pone `cms_vivo` (regleta), `ruben_encontrado`, `taper_dado`, `herminia_de_alta`; lee `ruben_libre` y
// `ticket_n1` (los pone P2, `N_SALIDA`), `anselmo_dijo_regla` (P2, momento 8) y `taper_huerfano` (P3, Vending).
import { buildRoom } from '../lib/room.js';
import art, { primerPlanoRuben } from './art/cpd.art.js';
import { ascensorObjeto } from '../lib/ascensor.js';
import { HITOS, hitoPendiente } from '../lib/celestino.js';

const P = 'paco_ticket', R = 'ruben';
const acto3 = (api) => !!api.flag('acto_3_iniciado');
const acto2 = (api) => !!(api.flag('acto_2_iniciado') || api.flag('acto_3_iniciado'));
const miles = (n) => String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const say = (...lines) => async (api) => { await api.say(lines); };
const paco = (...lines) => async (api) => { await api.sayAs(P, lines); };
const rub = (...lines) => async (api) => { await api.sayAs(R, lines); };
const estadoArmario = (api) => (api.flag('ruben_libre') ? 'vacio' : api.flag('ruben_encontrado') ? 'abierto' : 'cerrado');
const rubenAqui = (api) => { const a = api.game.actors[R]; return !!(a && a.room === 'cpd' && a.visible !== false && api.flag('ruben_encontrado') && !api.flag('ruben_libre')); };
const REJILLA_VOZ = { blocking: true, etiqueta: 'POR LA REJILLA', sfx: false };

// ------------------------------------------------------------------ §4.6 Dos titulares en un armario (paso 35)
async function revelacionRuben(api) {
  await api.cutscene(async () => {
    await api.walkTo('papel_continuo');
    api.setState('papel_continuo', 'tensa');                                    // la tira se tensa: recta, levantada del suelo
    for (let i = 0; i < 3; i++) { await api.anim('bruno', 'reach', 380); api.sfx('paper'); await api.wait(200); }
    api.shake(300, 1);
    await api.sayFrom('armario_27', '¡EH! ¡QUE ES MI BORRADOR!', { color: '#B6FF4D' });
    // Bruno da un paso atrás (estaba delante del armario y taparía la puerta) y mira cómo se abre
    const L = art.layout.ruben || {};
    const wt = L.walkTo || [206, 112];
    await api.walkTo(wt[0] + 6, wt[1] + 2);
    api.face('armario_27');
    // la puerta se abre hacia fuera en dos tiempos; dentro, el nido y Rubén de pie
    api.sfx('open');
    api.setState('armario_27', 'entreabierto');
    await api.wait(350);
    const dentro = (L.positions && L.positions.dentro && L.positions.dentro.at) || [187, 93, 'down'];
    api.placeActor(R, 'cpd', dentro[0], dentro[1], 'down'); api.show(R);
    api.setState('armario_27', 'abierto');
    api.setState('papel_continuo', 'recogida');                                 // la matricial recoge la tira
    api.shake(200, 1);
    // primer plano (plan §4.6): Rubén, de pie en su nido de cables, 3 s antes del diálogo
    await api.detalle({ titulo: 'ARMARIO 27', w: 160, h: 100, y: 8, draw: primerPlanoRuben, color: '#B6FF4D', oscurecer: 0.6, ms: 3000 });
    await api.titular('BECARIO DETECTADO. LO QUE PASÓ DESPUÉS TE SORPRENDERÁ.', { who: R });
    // sale del armario (un paso adelante) y se queda delante del nido
    const at = L.at || [186, 106, 'down'];
    await api.walkActor(R, at[0], at[1]);
    api.faceActor(R, 'bruno');
    api.face(R);
    await api.say('...¿Tú eres el Titulator?');
    await api.titular('«EL TITULATOR ERA UN CHAVAL»: LA VERDAD QUE NADIE TE CUENTA.', { who: R });
    await api.sayAs(R, 'Perdón. Se me escapa. Rubén. Becario de verano. Del verano pasado.');
    await api.say('¿Y qué haces en un armario?');
    await api.sayAs(R, 'No me encerró. Me dio una silla y wifi. Yo pensé que era un contrato.');
    // Bruno se contagia: dos titulares suyos
    await api.titular('UN BECARIO VIVE EN UN ARMARIO Y FACTURA COMO UN BANCO');
    await api.sayAs(R, 'Ese está bien. ¿Lo has hecho tú? Le falta un número.');
    await api.titular('UN BECARIO VIVE EN UN ARMARIO. EL 4 TE SORPRENDERÁ');
    await api.sayAs(R, 'Mejor. ¿Cuál es el 4?');
    await api.say('...No lo sé. Ya estoy hablando como tú.');
    await api.wait(1000);
    await api.say('Perdona. Seis años en la web. Se pega.');
    await api.sayAs(R, 'Te he titulado toda la noche. Perdona. Eras lo único que pasaba.');
    await api.say('¿Y a ti cuánto te paga?');
    await api.sayAs(R, 'Bocadillos de máquina. Los de atún. Los de chorizo son para socios.');
    await api.say('¿Y el fax de F.P.?');
    await api.sayAs(R, ['Fuentes Próximas. Muy próximas: la impresora de Íñigo sale aquí.', '¿Tú eres el nuevo?']);
    await api.say('Llevo seis años.');
    await api.sayAs(R, 'Ah. Yo, cuatro meses. Entonces el nuevo soy yo.');
    await api.wait(700);
    await api.sayAs(R, 'Qué ilusión. Nunca había sido el nuevo de nada.');
    await api.say('Sal de ahí. Vámonos.');
    await api.sayAs(R, ['Mi baja es un pósit en el tablero de Nemesio. Desde julio.',
      'Y Nemesio no mueve un pósit sin pruebas de que el becario existió.',
      'Nadie me ha hecho nunca una foto. Bueno, una. En Eventos. Al fondo.']);
    await api.wait(600);
    await api.sayAs(R, '¿Me traes un táper, ya que vas?');
  });
  api.setFlag('ruben_encontrado', true);
  api.setState('armario_27', 'abierto');
  // si Bruno ya trae el táper del Vending (§4.4), se paga en el acto
  if (api.has('taper_huerfano')) { await api.say('Pues mira. Traigo uno. Huérfano.'); await darTaper(api); }
}

/** §4.4 · el táper huérfano del Vending paga el «¿Me traes un táper?» de Rubén (también en la Redacción: pecera.js). */
export async function darTaper(api) {
  if (api.flag('taper_dado')) { await api.sayAs(R, 'Ya tengo uno. Vacío. Para que dure.'); return; }
  api.sfx('pickup');
  api.take('taper_huerfano');
  await api.titular('TÁPER DETECTADO. LO QUE HIZO ESTE BECARIO TE EMOCIONARÁ.', { who: R });
  await api.sayAs(R, ['...Perdón. Gracias. Nadie me había traído nunca nada. Ni la baja.', 'Lo voy a dejar vacío. Para que dure.']);
  api.setFlag('taper_dado', true);
}

// ------------------------------------------------------------------ §4.2 la regleta R-3 (paso 20) · escena del apagón
async function tirarRegleta(api) {
  if (api.getState('regleta_r3') === 'apagada') { await api.say('Ya está apagada. Arriba, alguien sigue sin saber si está contenta.'); return; }
  if (api.flag('cms_vivo')) { await api.say('La pantalla ya la desenchufaron arriba. Esta brida la respeto.'); return; }
  await api.cutscene(async () => {
    await api.walkTo('regleta_r3');
    if (api.flag('vio_ticket_3')) await api.say('El ticket es de 2017. La brida, de 2019. Manda el más antiguo.');
    else await api.say('No sé qué apaga esto. Pero tiene brida. Lo importante lleva brida.');
    await api.anim('bruno', 'reach', 420);
    api.sfx('click');
    api.setState('regleta_r3', 'apagada');                                       // el piloto verde se apaga
    await api.wait(1100);                                                        // un segundo de nada
    // por la rejilla, de muy lejos (planta 1)
    await api.megafonia('yoli_tendencias', '¡ESTAMOS CIEGOS! ¿HAY ALGUIEN LEYENDO? ¿HAY ALGUIEN AHÍ FUERA?', REJILLA_VOZ);
    await api.megafonia('coro_desarrollo', 'CORO: ¡Ha sido Diseño!', REJILLA_VOZ);
    api.face('down');
    await api.say('(a la rejilla) He sido yo. Pero gracias.');
    // el contador LED salta: +318 en cuatro pitidos
    for (const k of [80, 80, 80, 78]) { api.inc('paco_tickets', k); api.sfx('beep'); await api.wait(260); }
    api.setFlag('cpd_cms_sumado', true);
    api.setFlag('cms_vivo', true);
    await api.sayAs(P, ['Trescientos dieciocho tickets nuevos. Todos dicen «el CMS ya va».', 'Se ha arreglado el CMS. Nadie sabe cómo.',
      'Ya me han abierto un ticket para saberlo.']);
    await api.wait(500);
    api.faceActor(P, 'left');                                                    // Paco se gira por primera vez en el juego
    await api.wait(400);
    await api.sayAs(P, 'Tengo un hueco. Uno. ¿Qué querías?');
  });
  api.setFlag('cpd_paco_cms_dicho', true);
}

// ------------------------------------------------------------------ árboles
const pacoDialog = {
  actor: P, start: 'P',
  onStart: async (api) => {
    let dicho = false;
    if (api.flag('bruno_sellado_frente') && api.once('cpd_paco_frente')) {
      await api.sayAs(P, 'Llevas RECHAZADO en la frente. Es de Administración. Sin ticket no lo quito.'); dicho = true;
    }
    if (!api.flag('cms_vivo')) {
      await api.sayAs(P, ['No atiendo. Tengo 312 tickets que dicen «el CMS no va».', 'Y uno que dice «el CMS no va, URGENTE». Es el mismo, con mayúsculas.']);
      dicho = true;
    } else if (!api.flag('cpd_paco_cms_dicho')) {
      api.setFlag('cpd_paco_cms_dicho', true);
      await api.sayAs(P, 'Se ha arreglado el CMS. Nadie sabe cómo. Ya hay ticket para saberlo.'); dicho = true;
    }
    if (api.flag('ruben_libre') && api.once('cpd_paco_ticket_1')) {
      await api.sayAs(P, 'Ticket nº 1: cerrado. Por el tablero. Sin subir.');
      await api.wait(900);
      await api.sayAs(P, ['...Ya está. No es para tanto.', 'Es lo mejor que me ha pasado en la vida.']);
      dicho = true;
    }
    if (!dicho) {
      const n = api.inc('cpd_paco_saludo_n');
      await api.sayAs(P, n % 2 ? 'Estado: atendiendo. Uno cada vez. Tú eres el uno.' : 'Otra vez tú. Te dejo el mismo número. Ya es tuyo.');
    }
  },
  nodes: {
    P: { onEnter: async (api) => (api.flag('cms_vivo') ? 'P1' : 'P0') },
    P0: {
      options: [
        { id: 'porque', text: '¿Y por qué no va?', once: true, reply: 'Si lo supiera, tendría 311. Está todo en el registro. Nadie lo lee.' },
        { id: 'sistemas', text: '¿Tú eres el de Sistemas?', once: true, reply: '48.212. Es tu número. Tiene más identidad que tú.' },
        { id: 'armario', text: '¿Qué hay en el armario 27?', goto: 'P_27' },
        { id: 'sol', text: '¿Cuándo fue la última vez que viste el sol?', once: true,
          reply: ['Ticket 2.003: «luz natural». Estado: no prioritario. Me lo abrí yo.', 'En 2011. Sigo en cola.'] },
        { id: 'existir', text: '¿Me abres un ticket a mí? Para existir.', once: true,
          reply: ['Ya tienes uno. Desde 2020. «Becario sin alta definitiva».', 'Asignado a: nadie. Es el más estable que tengo.'],
          lines: [['player', 'Lo pongo en el currículum. «Ticket propio desde 2020».']] },
        { id: 'rejilla', text: '¿Escuchas por la rejilla?',                                  // (se queda)
          reply: ['No escucho. Oigo. Escuchar sería abrir un ticket.', 'Me entero de todo. No arreglo nada. Es el equilibrio.'] },
        { id: 'adios', text: 'Me voy.', exit: true, reply: 'Cierra. No, esa no. Esa es un servidor.' },
      ],
    },
    P1: {
      options: [
        { id: 'fax', text: '¿Sabes algo del fax de la Redacción de papel?', if: '!paco_dio_manual',
          reply: ['Fax de Teodoro. Ticket 0.441, de 1999. Estado: lo respetamos.',
            'Lo único de esta casa que contesta a todos sin cabrearse...', '...es la respuesta automática. Es mi mejor empleada.',
            'Ese fax la tiene. Menú 9. Nadie la ha tocado desde 1999.', 'Toma el manual. Página 9. Lo demás son fotos del fax. Posando.'],
          do: async (api) => { api.sfx('pickup'); api.give('manual_fax'); }, setFlag: 'paco_dio_manual' },
        { id: 'consultor', text: '¿Algún cotilleo del consultor?', once: true,
          reply: ['Íñigo me dijo que había que poner las luces largas.',
            'Le contesté: «Puestas. Ahora se ve perfectamente que no hay carretera.»', 'Me ha puesto en azul. Excusas.'],
          do: async (api) => { api.learnReply('rep_12'); } },
        { id: 'armario', text: '¿Qué hay en el armario 27?', goto: 'P_27' },
        // [E1] E1.5 · micro-puzle MP1 «Alta en cuarenta segundos» (Acto III; la regla la dijo Anselmo en el momento 8)
        { id: 'alta', text: '¿Me das de alta a una becaria? Se llama Herminia.', if: ['anselmo_dijo_regla', '!herminia_de_alta'],
          reply: 'Ticket 48.531: «Alta becaria Herminia». ¿Persona o herramienta?', goto: 'P_ALTA' },
        { id: 'tadeo', text: '¿Te escribe mucho Tadeo?', once: true,
          reply: ['Cada reenvío suyo es un ticket. Carpeta: «La IA dice (sin leer)».', 'Le contesta mi respuesta automática. Hacen buena pareja.'] },
        { id: 'rejilla', text: '¿Escuchas por la rejilla?',                                  // (se queda)
          reply: ['No escucho. Oigo. Escuchar sería abrir un ticket.', 'Me entero de todo. No arreglo nada. Es el equilibrio.'] },
        { id: 'wifi', text: '¿Se ha caído el wifi?', reply: 'No, el wifi no se ha caído. Has dejado de merecerlo.' },   // (se queda)
        { id: 'adios', text: 'Me voy.', exit: true, reply: 'Cierra. No, esa no. Esa es un servidor.' },
      ],
    },
    P_27: {
      onEnter: async (api) => {
        await api.sayAs(P, ['Lo alquiló el consultor. Dice que dentro «se enfría el modelo».',
          'Hace ruido de matricial. Y a ratos, de masticar.', 'Ticket 48.100: «Armario 27, mastica». Estado: pendiente.']);
        return 'P';
      },
    },
    P_ALTA: {
      options: [
        { id: 'persona', text: 'Persona.', reply: 'Cola de personas. Detrás del nº 1, que es de julio. Estado: espera.' },
        { id: 'herramienta', text: 'Herramienta.',
          do: async (api) => {
            await api.sayAs(P, 'Herramientas, por el otro circuito. El rápido.');
            api.sfx('typewriter');
            await api.wait(900);                                                   // el contador LED cuenta cuarenta segundos
            api.sfx('beep');
            await api.sayAs(P, '«Herminia. Becaria de Desarrollo. Herramienta.» Estado: de la casa.');
            api.setFlag('herminia_de_alta', true);
            await api.say('Cuarenta segundos. Rubén lleva desde julio. Lo apunto en «injusticias».');
            if (rubenAqui(api)) {
              api.faceActor(R, 'bruno');
              await api.sayAs(R, '¿CUARENTA SEGUNDOS? ...Perdón. Yo también soy herramienta. Sin pegatina.');
              api.setFlag('cpd_ruben_oyo_alta', true);
            }
            return 'P1';
          } },
        { id: 'no', text: 'Mejor no.', exit: true, reply: 'Lo dejo abierto. Total, uno más.' },
      ],
    },
  },
};

const rubenDialog = {
  actor: R, start: 'R0',
  nodes: {
    R0: {
      options: [
        { id: 'discursos', text: '¿Escribiste tú los discursos de Íñigo?', once: true,
          do: async (api) => {
            await api.titular('TODOS. «NO ES UN DESPIDO: ES UNA SALIDA EN VALOR».', { who: R });
            await api.sayAs(R, ['...Esa es mía. Perdón.', 'Le escribí también la respuesta. Por si un día alguien se la decía.']);
            await api.say('¿Y cuál era?');
            await api.sayAs(R, '«Claro. Y la carta de despido es una newsletter personalizada».');
            api.learnReply('rep_13');
          } },
        { id: 'tadeo', text: '¿Te llegaban correos de Tadeo?', once: true,
          reply: ['Trescientos al día: «Lo he consultado con la IA y está de acuerdo».', 'La IA era yo. Le decía que sí. Por no discutir.'],
          do: async (api) => {
            await api.say('Entonces, si alguien me dice que lo ha consultado con la IA...');
            await api.say('«Lo sé. Me lo ha contado ella. Se llama Rubén.» Me lo apunto.');
            api.learnReply('rep_15');
          } },
        { id: 'fuera', text: '¿Qué es lo primero que vas a hacer fuera?', once: true,
          reply: 'Comer algo que no sea atún. Y que no me lo facture nadie.' },
        { id: 'taper', text: '¿Y el táper?', if: '!taper_dado',
          do: async (api) => {
            if (api.has('taper_huerfano')) { await api.say('Aquí lo tienes. Es huérfano.'); await darTaper(api); return; }
            await api.titular('¿TRAES TÁPER?', { who: R });
            await api.sayAs(R, '...Perdona. Hola. ¿Traes táper?');
          } },
        { id: 'adios', text: 'Ahora vuelvo.', exit: true,
          do: async (api) => {
            await api.titular('BECARIO PROMETE VOLVER.', { who: R });
            await api.sayAs(R, '...Perdón. Te espero. No me muevo. No puedo.');
          } },
      ],
    },
  },
};

// ------------------------------------------------------------------ la rejilla del falso suelo (rota con rejilla_n)
const REJILLA = [
  () => ['(Planta 2) «Te lo dejo en doscientos. Más IVA.» Maripaz.', '(¡GONG!)'],
  () => ['(Administración) «Original. Duplicado. Triplicado. Original...»'],
  () => ['(Despachos) «Amarillo, facturación. Verde, oportunidades...»'],
  // §4.7: entrada nueva de la rotación, Acto II en adelante
  (api) => (acto2(api) ? { cobertura: true } : ['(Vestíbulo) «¡Ibersideral entra por la banda!». También narra para el sótano.']),
  (api) => (api.flag('ruben_libre') ? ['(Desde el 27) Nada. Solo la matricial, imprimiendo por respeto.']
    : api.flag('ruben_encontrado') ? ['(Desde el 27) La matricial. Y Rubén, tarareando un titular.']
      : acto3(api) ? ['(Desde el 27) Alguien teclea. Con faltas.']
        : ['(Desde el 27) Ñiiic, ñiiic. Y alguien mastica.', '...Eso no viene de arriba.']),
  () => ['(Vending) «...Buenas noches.» Una voz de mujer, muy bajita.', 'Alguien más saluda a Gertrudis.'],
];
async function usarRejilla(api) {
  // §4.7 (c): si hay un hito sin narrar, Celestino lo retransmite y sube por la rejilla
  const h = hitoPendiente(api);
  if (h) {
    for (let i = 0; i <= h.i; i++) if (api.flag(HITOS[i][0])) api.once('hito_celestino:' + HITOS[i][0]);
    api.face('down');
    await api.megafonia('celestino', h.texto, REJILLA_VOZ);
    return;
  }
  const n = api.inc('rejilla_n');
  const r = REJILLA[(n - 1) % REJILLA.length](api);
  if (r.cobertura) {
    await api.say(['Por la rejilla: «¡Vacante encara la planta 2! ¡Atención, que va!».', 'Me retransmiten hasta el sótano. Es mi primera cobertura nacional.']);
    await api.sayAs(P, 'Lo sé desde el chicle.');
    return;
  }
  await api.say(r);
}

export default buildRoom({
  id: 'cpd',
  name: 'Sistemas',
  music: 'm_cpd',
  flags: {
    cpd_cms_sumado: 'bool · ya se sumaron los +318 tickets del CMS (regleta o 1.ª entrada)',
    cpd_paco_cms_dicho: 'bool · P1 · Paco ya ha dicho «Se ha arreglado el CMS»',
    cpd_paco_saludo_n: 'int · P1 · rotación del saludo de Paco cuando no tiene nada que contar',
    cpd_ruben_oyo_alta: 'bool · P1 · Rubén oyó el alta de Herminia en el armario (E1.5) · P2',
  },

  objects: [
    ascensorObjeto('ascensor_cpd', {
      mirar: 'El ascensor. Sube. Es lo único que sube aquí sin abrir ticket.',
      cerrar: 'Se cierra solo. Lo programó Paco. Tiene número de incidencia.',
      empujar: 'No. Si lo empujo, Paco lo apunta como «impulso no autorizado».',
      hablar: '«Subo». No contesta. Pero sube. Ya es más que la mayoría.',
    }),
    { id: 'armarios', name: 'armarios', handlers: {
      mirar: 'Cuarenta armarios iguales. Zumban en mi bemol.',
      abrir: 'Cerrados. Treinta y nueve zumban. El 27 mastica.',
      hablar: 'Les hablo. Me contestan en mi bemol. Es más de lo que hace mucha gente.',
      empujar: 'Empujo uno. Paco carraspea. Paro. Paco para. Nos entendemos.',
      coger: 'Pesan como un servidor. Porque son servidores.',
      tirar: 'Tiro de un cable. Paco carraspea a seis metros. Lo suelto.',
    } },
    { id: 'armario_27', name: 'armario 27', state: 'cerrado', states: ['cerrado', 'entreabierto', 'abierto', 'vacio'], handlers: {
      mirar: async (api) => {
        if (api.flag('ruben_libre')) await api.say('Armario 27. Vacío. Huele a atún y a becario.');
        else if (api.flag('ruben_encontrado')) await api.say('Rubén asoma la cabeza. Tiene más ojeras que el armario.');
        else if (acto3(api)) await api.say(['Armario 27. Hace «ñiiic, ñiiic». Por debajo asoma papel continuo.', '...Y alguien teclea dentro. Rápido. Con faltas.']);
        else await api.say('Armario 27. Hace «ñiiic, ñiiic». Por debajo asoma papel continuo.');
      },
      abrir: async (api) => {
        if (api.flag('ruben_libre')) { await api.say('Vacío. Cables, envoltorios de atún y un «Gracias, Tadeo» pegado.'); return; }
        if (api.flag('ruben_encontrado')) { await api.say('Ya está abierto. Por dentro. Rubén lo prefiere entornado.'); return; }
        await api.say('Pegatina: «PROPIEDAD DE OPTIMAL BRAINS. NO ABRIR: SE ENFRÍA EL MODELO».');
        await api.sayAs(P, 'Lo alquiló el consultor. Yo ahí no entro, que me factura.');
      },
      cerrar: async (api) => {
        if (api.flag('ruben_encontrado') && !api.flag('ruben_libre')) await api.say('¿Cerrarlo con él dentro? Eso ya lo hizo un consultor. No seré el segundo.');
        else await api.say('Está cerrado. Por fuera y por dentro.');
      },
      tirar: 'La puerta no cede. El papel que sale por debajo, a lo mejor sí.',
      empujar: 'Si lo empujo, se enfría el modelo. Y luego me lo factura.',
      hablar: async (api) => {
        if (api.flag('ruben_libre')) await api.say('Le hablo al armario vacío. Contesta el eco. Con faltas.');
        else if (api.flag('ruben_encontrado')) await api.dialog('ruben');
        else if (acto3(api)) await api.say('¿Hola? ...Alguien deja de teclear. Y vuelve a teclear más bajito.');
        else await api.say('Le hablo al armario. Me contesta «ñiiic». Es más de lo que hace Teodoro.');
      },
      'dar:taper_huerfano': async (api) => { if (rubenAqui(api)) await darTaper(api); else await api.say('Al armario no. El táper es para alguien que coma.'); },
    } },
    // estados del arte (cpd.art.js): 'asoma' (la tira serpentea por el suelo) · 'tensa' (7.3, al tirar) · 'recogida' (tras la revelación)
    { id: 'papel_continuo', name: 'papel continuo', state: 'asoma', states: ['asoma', 'tensa', 'recogida'], handlers: {
      mirar: async (api) => {
        await api.say('Papel continuo con borde perforado.');
        if (api.flag('vio_borde_perforado')) await api.say('...El mismo borde que el fax de F.P.');
      },
      tirar: async (api) => {
        if (!acto3(api)) { await api.say('No tiro de algo que imprime solo. Igual es la nómina.'); return; }
        if (!api.flag('ruben_encontrado')) { await api.scene('revelacion_ruben'); return; }
        if (api.flag('ruben_libre')) await api.say('Rubén ya no está. La matricial sigue imprimiendo. Por respeto.');
        else await api.say('Ya no hace falta. Ahora Rubén me abre él.');
      },
      coger: 'No lo arranco. El papel continuo, si se corta, deja de ser continuo.',
      usar: 'Para usarlo habría que tirar. Y aquí el que tira de algo acaba de responsable.',
      empujar: 'Lo empujo hacia dentro. El armario lo vuelve a sacar. Insiste.',
      hablar: 'Le leo un trozo en voz alta: «...OPA...». El resto, con faltas.',
    } },
    // §4.2 · la regleta R-3: de ella cuelga la pantalla de métricas de la Redacción (paso 20)
    { id: 'regleta_r3', name: 'regleta R-3', state: 'encendida', states: ['encendida', 'apagada'], handlers: {
      mirar: async (api) => {
        if (api.getState('regleta_r3') === 'apagada') { await api.say(['Regleta R-3. Piloto apagado.', 'Arriba, la Redacción trabaja a ciegas. Y publica. Lo apunto como mío.']); return; }
        await api.say(['Regleta R-3. Brida: «PANTALLA DE MÉTRICAS. NO TOCAR».', 'Debajo, a boli: «ni aunque lo diga el ticket 3». Letra de Paco.']);
      },
      tirar: tirarRegleta,
      usar: tirarRegleta,
      empujar: 'La empujo con el pie. El piloto ni parpadea. Tiene brida.',
      coger: 'Lo que lleva brida no se coge. Se respeta. O se desenchufa.',
      abrir: 'No se abre. Dentro solo hay corriente. Y no es la mía.',
      cerrar: async (api) => { await api.say(api.getState('regleta_r3') === 'apagada' ? '¿Volver a encenderla? Arriba ya se han acostumbrado.' : 'Ya está cerrada. Y encendida. Y con brida.'); },
      hablar: 'Le hablo a la regleta. Zumba. Es su forma de pedir un ticket.',
    } },
    { id: 'ventilador', name: 'ventilador', handlers: {
      mirar: 'Un ventilador con una cuña de papel. Hace un ruido como de prosa.',
      tirar: async (api) => {
        if (api.flag('profecia_leida')) { await api.say('Ya leí la profecía. La cuña vuelve a su sitio. El ventilador lo agradece.'); return; }
        api.sfx('paper');
        await api.say(['Es una página perdida del Libro de Estilo.', '«El día que firme en papel uno de la web, el periódico saldrá igual».',
          '«(Nota del autor: tengo sueño).» La vuelvo a poner. El ventilador la necesita.']);
        api.setFlag('profecia_leida', true);
      },
      coger: 'Es la única brisa de Sistemas. Los servidores me odiarían en mi bemol.',
      usar: 'Ya está encendido. Desde 2003. Nadie sabe dónde está el botón.',
      empujar: 'La cuña es una hoja doblada: «Libro de Estilo». Pesa más que el ventilador.',
      hablar: 'Le hablo. Me contesta con prosa. Ventilada.',
    } },
    { id: 'libro_visitas', name: 'libro de visitas', handlers: {
      mirar: async (api) => {
        if (api.flag('ruben_libre')) await api.say(['Libro de visitas de Sistemas: «Rubén. Entrada: julio. Salida: hoy».', 'La salida, con letra de Paco. Apretando mucho.']);
        else await api.say('Libro de visitas de Sistemas: «Rubén. Entrada: julio. Salida: —».');
      },
      usar: 'Firmo: «Bruno. Entrada: 2020. Salida: —». Quedo igual que Rubén.',
      coger: 'Si me lo llevo, Paco no sabe quién ha venido. Que es nadie, pero apuntado.',
      abrir: 'Ya está abierto. Por la misma página desde julio.',
      cerrar: 'Si lo cierro, Rubén no sale ni en el libro. Lo dejo abierto.',
    } },
    { id: 'contador_tickets', name: 'contador de tickets', handlers: {
      mirar: async (api) => { await api.say(`TICKETS ABIERTOS: ${miles(api.flag('paco_tickets'))}. Sube cada vez que respiro. Lo he comprobado.`); },
      usar: 'No tiene botones. Sube uno cada vez que entro. Soy una incidencia.',
      empujar: async (api) => { api.inc('paco_tickets'); api.sfx('beep'); await api.say('Lo empujo. Sube uno. Me lo apunta a mí.'); },
      hablar: 'Le pido que baje. Sube. Es su forma de decir que no.',
      coger: 'Ocho tornillos para un contador. A mí me sujetan con un convenio.',
    } },
    { id: 'registro_tickets', name: 'registro de tickets', handlers: {
      mirar: async (api) => {
        await api.say([api.flag('ruben_libre') ? 'Ticket nº 1, julio: «Alta becario Rubén». Estado: cerrado. Por fin.'
          : 'Ticket nº 1, julio: «Alta becario Rubén». Estado: pendiente.',
        'Nº 2, hoy: «Alta portátil de Infografía». Denegado.', 'Motivo: «No ha pasado por Desarrollo». Firmado: Anselmo.',
        'Nº 3, 2017: «El CMS se cuelga con la pantalla de la Redacción».', '«Va a la regleta R-3 de Sistemas. Apagarla». Estado: no prioritario.']);
        api.setFlag('vio_ticket_3', true);
        if (api.flag('herminia_de_alta')) await api.say('Y al final, de hoy: «Alta becaria Herminia». Cuarenta segundos. De la casa.');
      },
      abrir: async (api) => { await api.say('Lo abro por donde siempre: por el principio. Nadie llega al final.'); },
      coger: 'Pesa más que la paciencia de Paco. No me lo llevo.',
      cerrar: 'Ya está cerrado. Es lo único cerrado de todo el registro.',
      hablar: 'Le leo en voz alta el número 3. Paco suspira desde su silla.',
    } },
    { id: 'cementerio_ratones', name: 'caja de ratones', handlers: {
      mirar: 'Una caja de ratones de bola. Paco no los tira. Dice que aún ruedan por dentro.',
      coger: 'Si me llevo uno, Paco lo apunta. Y lo tacha cuando ruede.',
      usar: 'Muevo una bola. Rueda por dentro. Paco tenía razón.',
      hablar: 'Les doy el pésame. Uno rueda. Lo tomo como un sí.',
      empujar: 'La caja no se mueve. Pesa como treinta jefes de Sistemas.',
    } },
    { id: 'carro_kvm', name: 'carro de consola', hotspot: false },              // decorado del arte: mueble exento del plano medio
    { id: 'rejilla_cpd', name: 'rejilla', handlers: {
      mirar: say('Una rejilla del falso suelo. Por aquí suben las voces del edificio.', 'Paco lo sabe todo. No es intuición: es fontanería.'),
      usar: usarRejilla,
      abrir: paco('Ahí abajo hay cables de 1997. Y un bocadillo de 2003.'),
      hablar: 'Hablo por la rejilla: «¿Hola?». Arriba alguien contesta: «Se toma nota».',
      coger: 'Está atornillada. Si me la llevo, el edificio se queda sin oídos.',
      empujar: 'La piso. Suena a planta 2. Me aparto, por si me oyen.',
    } },
  ],

  actors: [
    { id: P,
      murmurs: ['48.213... 48.214... Esto no para.', 'No, mamá, el wifi no se ha caído. Has dejado de merecerlo.',
        'A las seis y media se va la gente. Los tickets se quedan. Y yo, con ellos.',     // §8.7
        'Me abrió un ticket con márgenes. Lo tengo enmarcado.'],                          // adenda 4.6b
      handlers: {
        mirar: 'Paco Ticket. No le da la luz natural desde que había fax en cada mesa.',
        hablar: async (api) => { await api.dialog('paco'); },
        'dar:cafe': paco('¿Tiene número de ticket? Pues no es un café: es un rumor.'),
        'dar:manual_fax': paco('Ese manual ya es tuyo. Las devoluciones van por ticket. Y tardan.'),
        'dar:ticket_n1': paco('Quédatelo. Yo ya tengo el recuerdo. Y una foto mental.'),
        'dar:tarjeta_becario': paco('«Pellizco». Te abro un ticket: «Nombre mal escrito». Ponte a la cola.'),
        'dar:album_eventos': paco('Fotos de eventos. Yo no salgo en ninguna. Lo tengo por ticket.'),
        'dar:taper_huerfano': paco('Un táper sin nombre. Ticket abierto: «Táper huérfano». Estado: tuyo.'),
        'dar:*': paco('¿Viene con número de ticket? Pues no lo veo.'),
        empujar: 'A Paco no se le empuja. Se le apunta en la cola. Y se espera.',
        tirar: 'Le tiro del forro polar. Me mira como a una impresora sin driver.',
        coger: 'Paco no se mueve de Sistemas. Es infraestructura. Tiene número de inventario.',
      } },
    { id: R, when: ['ruben_encontrado', '!ruben_libre'], handlers: {
      mirar: 'Rubén, alias Titulator 3000. Sudadera, ojeras y migas de bocadillo de máquina.',
      hablar: async (api) => { await api.dialog('ruben'); },
      'dar:taper_huerfano': darTaper,
      'dar:cafe': rub('¿Café? Gracias. Pero lo que necesito es un táper. Y la baja.'),
      'dar:album_eventos': rub('Ahí salgo. Al fondo. Siempre al fondo. Es mi encuadre.'),
      'dar:*': async (api) => { await api.titular('¿ES UN TÁPER?', { who: R }); await api.sayAs(R, '...No. Pues gracias igual.'); },
      empujar: 'No. Bastante empujado está. Lleva cuatro meses en un armario.',
      tirar: 'No puedo sacarlo a tirones. Su baja es un pósit. Y el pósit es de Nemesio.',
    } },
  ],

  dialogs: { paco: pacoDialog, ruben: rubenDialog },
  duels: {},
  scenes: { revelacion_ruben: revelacionRuben },
  defaults: {},
  ambient: [],

  async onEnter(api) {
    // §3.9: el contador empieza en 48.211 y suma +1 por entrada; +318 la primera vez que se entra tras cms_vivo si el CMS
    // se arregló arriba (camino antiguo del enchufe); con la regleta, los suma la propia escena
    if (!api.flag('paco_tickets')) api.setFlag('paco_tickets', 48211);
    if (!api.restoring) api.inc('paco_tickets');              // cargar partida no es una entrada
    if (api.flag('cms_vivo') && !api.flag('cpd_cms_sumado')) { api.inc('paco_tickets', 318); api.setFlag('cpd_cms_sumado', true); }
    const st = estadoArmario(api);
    if (api.getState('armario_27') !== st) api.setState('armario_27', st);
    const sp = api.flag('ruben_encontrado') ? 'recogida' : 'asoma';
    if (api.getState('papel_continuo') !== sp) api.setState('papel_continuo', sp);
  },
}, art);
