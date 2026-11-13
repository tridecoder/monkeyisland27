// SALA `cpd` — LÓGICA. Dueño: paquete A · «Puerta, sótano y común» (biblia §9.1). Biblia: §3.9, §5.2 (P05a, P13, P14c),
// §7.3 (revelación de Rubén), §7.6.4 (Paco), §7.7.10 (Rubén), §8.1, §8.5, §8.7. Adenda: §1.9 y §4.6b (cameo de
// Valentín Retícula), §3.2 (rejilla, monitor de Valentín), §4.7 (opciones nuevas de Paco y Rubén), MP1 paso 3
// (alta de Herminia), §8.2/§8.4 (rumores B1, D2 y desmentido B).
// Escena que registra (global): `revelacion_ruben` (§7.3; la lanza Tirar papel_continuo en el Acto III).
// Valentín Retícula y su monitor ya NO están aquí: trabajan en la Pecera, junto a la bandeja de Diseño (pecera.js).
// El ascensor usa la botonera común (../lib/ascensor.js): -1 · 0 · 1 · 2.
// El arte y la geometría están en ./art/cpd.art.js (artista de fondos).
// Estados que el arte puede dibujar (sprites por estado): `armario_27`: 'cerrado' | 'abierto' (Rubén dentro, desde
// ruben_encontrado) | 'vacio' (desde ruben_libre). Flag que puede leer: paco_tickets (cifra del contador LED).
import { buildRoom } from '../lib/room.js';
import art from './art/cpd.art.js';
import { ascensorObjeto } from '../lib/ascensor.js';

const P = 'paco_ticket', R = 'ruben';
const acto3 = (api) => !!api.flag('acto_3_iniciado');
const miles = (n) => String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const say = (...lines) => async (api) => { await api.say(lines); };
const paco = (...lines) => async (api) => { await api.sayAs(P, lines); };
const rub = (...lines) => async (api) => { await api.sayAs(R, lines); };
const estadoArmario = (api) => (api.flag('ruben_libre') ? 'vacio' : api.flag('ruben_encontrado') ? 'abierto' : 'cerrado');

// ------------------------------------------------------------------ §7.3 La revelación de Rubén (P13)
async function revelacionRuben(api) {
  await api.cutscene(async () => {
    await api.walkTo('papel_continuo');
    for (let i = 0; i < 3; i++) { await api.anim('bruno', 'reach', 380); api.sfx('paper'); await api.wait(200); }
    api.shake(300, 1);
    await api.sayFrom('armario_27', '¡EH! ¡QUE ES MI BORRADOR!', { color: '#B6FF4D' });
    // Bruno da un paso atrás (estaba delante del armario y taparía la puerta) y mira cómo se abre
    const L = art.layout.ruben || {};
    const wt = L.walkTo || [206, 112];
    await api.walkTo(wt[0] + 6, wt[1] + 2);
    api.face('armario_27');
    // «La puerta del armario se abre hacia fuera»: ñiiic en dos tiempos; dentro, el nido y Rubén de pie
    api.sfx('open');
    api.setState('armario_27', 'entreabierto');
    await api.wait(350);
    const dentro = (L.positions && L.positions.dentro && L.positions.dentro.at) || [187, 93, 'down'];
    api.placeActor(R, 'cpd', dentro[0], dentro[1], 'down'); api.show(R);
    api.setState('armario_27', 'abierto');
    api.shake(200, 1);
    await api.wait(600);
    await api.sayAs(R, 'BECARIO DETECTADO. LO QUE PASÓ DESPUÉS TE SORPRENDERÁ.');
    // sale del armario y se queda a su lado (deja ver el nido)
    const at = L.at || [178, 105, 'down'];
    await api.walkActor(R, at[0], at[1]);
    api.faceActor(R, 'bruno');
    api.face(R);
    await api.say('...¿Tú eres el Titulator?');
    await api.sayAs(R, ['Rubén. Becario de verano.', 'Del verano pasado.']);
    await api.say('¿Y qué haces en un armario?');
    await api.sayAs(R, ['Nadie cerró mi alta. Para Sistemas sigo activo.', 'Para Íñigo, soy una licencia. Factura 48.000 euros al mes.']);
    await api.say('¿Y a ti cuánto te paga?');
    await api.sayAs(R, 'Bocadillos de máquina. De los de atún. Los de chorizo son para socios.');
    await api.say('Los titulares sobre mí... ¿eras tú?');
    await api.sayAs(R, 'Te he titulado toda la noche. Perdona. Eras lo único que pasaba.');
    await api.say('¿Y el fax de F.P.?');
    await api.sayAs(R, ['Fuentes Próximas. Muy próximas: la impresora de Íñigo sale aquí.',
      'Íñigo también asesora a Hidrovoltia. Lo imprime todo. Lo leo todo.', 'Alguien tenía que saber lo de la opa. Te tocó a ti.',
      '¿Tú eres el nuevo?']);
    await api.say('Llevo seis años.');
    await api.sayAs(R, 'Ah. Yo, cuatro meses. Entonces el nuevo soy yo.');
    await api.wait(700);
    await api.sayAs(R, 'Qué ilusión. Nunca había sido el nuevo de nada.');
    await api.say('Sal de ahí. Vámonos.');
    await api.sayAs(R, ['No puedo. Mi baja es un pósit en el tablero de Nerea. Desde julio.',
      'Si salgo sin baja, Íñigo me factura las horas de sol.', 'Y Nerea no mueve un pósit sin pruebas de que el becario existió.',
      'Nadie me ha hecho nunca una foto.']);
    await api.wait(700);
    await api.sayAs(R, ['Bueno. La de Eventos. Pero salgo al fondo. Yendo al baño.', '¿Me traes un táper, ya que vas?']);
  });
  api.setFlag('ruben_encontrado', true);
  api.setState('armario_27', 'abierto');
}

// ------------------------------------------------------------------ P_BAJA (P14c): también al Dar posit_baja_ruben
async function pacoBaja(api) {
  await api.sayAs(P, ['Un pósit. Descopeado. En papel.', 'Me repugna, pero es reglamentario.',
    'Ticket nº 1: «Alta becario Rubén». Abierto en julio.', 'Asignado a: Titulator 3000. Optimal Brains.']);
  api.sfx('typewriter'); await api.wait(700); api.sfx('machine'); await api.wait(500);
  api.take('posit_baja_ruben');
  await api.sayAs(P, ['Estado: CERRADO.', 'El primer ticket que cierro en mi vida.', 'Toma el justificante. Enmárcalo. O úsalo contra alguien.']);
  api.give('ticket_n1');
  api.sfx('good');
  api.setFlag('ruben_libre', true);
  api.setState('armario_27', 'vacio');
  if (api.game.actors[R] && api.game.actors[R].room === 'cpd') {
    api.sfx('open');
    await api.anim(R, 'reach', 500);                                           // se estira, cruje
    await api.sayAs(R, 'Gracias. Voy a buscar una ventana.');
    const out = (art.layout.ascensor_cpd && art.layout.ascensor_cpd.walkTo) || [26, 112];
    await api.walkActor(R, out[0], out[1]);
    api.sfx('door');
  }
}

// ------------------------------------------------------------------ árboles
const pacoDialog = {
  actor: P, start: 'P',
  onStart: async (api) => {
    // rumores (adenda 8): uno por conversación como mucho; prioridad B, luego D
    if (!acto3(api) && !(api.flag('rumor_atun_n') > 0)) {
      await api.sayAs(P, 'Por la rejilla del 27 se oye masticar. A deshoras.');
      api.setFlag('rumor_atun_n', 1);
    } else if (api.flag('rumor_plaza_n') === 1) {
      await api.sayAs(P, 'Dicen que Gervasio se va a vivir al garaje. Para no perder la plaza.');
      api.setFlag('rumor_plaza_n', 2);
    }
    if (api.flag('bruno_sellado_frente') && api.once('cpd_paco_frente')) await api.sayAs(P, ['Llevas RECHAZADO en la frente.', 'Eso es de Administración. Sin ticket no te lo quito.']);
    if (!api.flag('cms_vivo')) await api.sayAs(P, ['No atiendo. Tengo 312 tickets que dicen «el CMS no va».', 'Y uno que dice «el CMS no va, URGENTE». Es el mismo con mayúsculas.']);
    else await api.sayAs(P, ['Se ha arreglado el CMS. Nadie sabe cómo.', 'Ya me han abierto un ticket para saberlo.']);
  },
  nodes: {
    P: { onEnter: async (api) => (api.flag('cms_vivo') ? 'P1' : 'P0') },
    P0: {
      options: [
        { text: '¿Y por qué no va?', once: true, exit: true, reply: ['Si lo supiera, tendría 311.', 'Está todo en el registro. Nadie lo lee.'] },
        { text: '¿Tú eres el de Sistemas?', once: true, exit: true, reply: 'Tu problema ya tiene número: el 48.212. Tiene más identidad que tú.' },
        { text: '¿Qué hay en el armario 27?', goto: 'P_27' },
        { text: '¿Escuchas por la rejilla?', goto: 'P',                                // adenda 4.7 (se queda)
          reply: ['No escucho. Oigo. Escuchar sería abrir un ticket.', 'Me entero de todo. No arreglo nada. Es el equilibrio.'] },
        { text: 'Me voy.', exit: true, reply: 'Cierra. No, esa no. Esa es un servidor.' },
      ],
    },
    P1: {
      options: [
        { text: '¿Sabes algo del fax de la Catacumba?', if: '!paco_dio_manual',
          reply: ['¿El de Teodoro? Ese fax tiene más años que tú y más paciencia que yo.',
            'Lo único de esta empresa que contesta a todo el mundo sin cabrearse...', '...es la respuesta automática. Es mi mejor empleada.',
            'Ese fax la tiene. Menú 9. Nadie la ha tocado desde 1999.', 'Toma el manual. Página 9. Lo demás son fotos del fax. Posando.'],
          do: async (api) => { api.sfx('pickup'); api.give('manual_fax'); }, setFlag: 'paco_dio_manual' },
        { text: '¿Algún cotilleo del consultor?', once: true,
          reply: ['Íñigo me dijo: «Hay que poner las luces largas».', 'Le dije: «Las pongo, pero el coche es de empresa y no pasa la ITV».',
            'Me ha puesto en azul. Excusas.'],
          do: async (api) => { api.learnReply('rep_12'); } },
        { text: '¿Qué hay en el armario 27?', goto: 'P_27' },                          // (se queda)
        { text: 'Te traigo una baja.', if: 'has:posit_baja_ruben', do: async (api) => { await pacoBaja(api); return 'exit'; } },
        { text: 'Quiero dar de alta a una becaria.', if: ['leoncio_acepta_alta', '!herminia_de_alta'],   // adenda 4.7 / MP1
          reply: '¿Persona o herramienta?', goto: 'P_ALTA' },
        { text: '¿Escuchas por la rejilla?',                                            // adenda 4.7 (se queda)
          reply: ['No escucho. Oigo. Escuchar sería abrir un ticket.', 'Me entero de todo. No arreglo nada. Es el equilibrio.'] },
        { text: '¿Te escribe mucho Tadeo?',                                             // adenda 4.7 (se queda)
          reply: ['Cada correo de Tadeo es un ticket. Tengo una carpeta: «La IA dice».', 'Le contesta mi respuesta automática. Ya sabes: mi mejor empleada.'] },
        { text: '¿Se ha caído el wifi?', reply: 'No, el wifi no se ha caído. Has dejado de merecerlo.' },   // (se queda)
        { text: 'Me voy.', exit: true, reply: 'Cierra. No, esa no. Esa es un servidor.' },
      ],
    },
    P_27: {
      onEnter: async (api) => {
        await api.sayAs(P, ['Lo alquiló el consultor. Dice que dentro «se enfría el modelo».',
          'Hace ruido de matricial. La única matricial que queda está ahí.', 'Imprime sola desde julio. Por respeto, nadie la apaga.']);
        return 'P';
      },
    },
    P_ALTA: {
      options: [
        { text: 'Persona.', goto: 'P1',                                                 // (se queda)
          reply: 'Pendiente. Te pongo detrás del nº 1. Desde julio.', lines: [['player', 'Mejor no. Por Herminia.']] },
        { text: 'Herramienta.', goto: 'P1',
          do: async (api) => {
            api.sfx('typewriter');
            await api.sayAs(P, ['Las herramientas van por otro circuito. El rápido.', '«Herminia. Becaria de Desarrollo.» Alta: cuarenta segundos.',
              'Rubén lleva desde julio.', 'Esta casa da de alta antes a un portátil que a un chaval.']);
          }, setFlag: 'herminia_de_alta' },
      ],
    },
  },
};

const rubenDialog = {
  actor: R, start: 'R0',
  onStart: async (api) => {
    if ((api.flag('rumor_atun_n') || 0) >= 3 && api.once('cpd_rumor_b_desmentido')) {          // adenda 8.2
      await api.sayAs(R, 'Me han dicho que mi consumo es altísimo. Es atún. Del de máquina.');
    }
    await api.sayAs(R, '¿Me traes un táper?');
  },
  nodes: {
    R0: {
      options: [
        { text: '¿Cómo te encerró aquí Íñigo?', once: true, reply: 'No me encerró. Me dio una silla y wifi. Yo pensé que era un contrato.' },
        { text: '¿Escribiste tú los discursos de Íñigo?', once: true,
          reply: ['Todos. «No es un despido: es una salida en valor». Mía.', 'Le escribí también la respuesta. Por si un día alguien se la decía.',
            '«Claro. Y la carta de despido es una newsletter personalizada».'],
          do: async (api) => { api.learnReply('rep_13'); } },
        { text: '¿Qué es lo primero que vas a hacer al salir?', once: true, reply: 'Mirar el sol. Y preguntar quién gobierna.' },
        { text: '¿Te llegaban correos de Tadeo?', once: true,                          // adenda 4.7
          reply: ['Trescientos al día. Al buzón del Titulator.', 'Soy el único que los lee. Le contesto: «Gracias, Tadeo».',
            'Él me contesta «¡A ti, equipo!!». Somos un equipo.'] },
        { text: 'Ahora vuelvo.', exit: true, reply: 'SEGUIREMOS INFORMANDO. Perdón. Se me escapa.' },
      ],
    },
  },
};

// adenda 3.2: la rejilla del falso suelo (rota con rejilla_n)
const REJILLA = [
  () => ['(Planta 2) «Te escribo desde el más absoluto cariño». Maripaz.', '(¡GONG!)'],
  () => ['(Administración) «Original. Duplicado. Triplicado. Original...»'],
  () => ['(Pajarera) «Amarillo, facturación. Verde, oportunidades...»'],
  () => ['(Vestíbulo) «¡Ibersideral entra por la banda!». También narra para el sótano.'],
  (api) => (acto3(api) && !api.flag('ruben_libre') ? ['(Desde el 27) Alguien teclea. Con faltas.']
    : api.flag('ruben_libre') ? ['(Desde el 27) Nada. Solo la matricial, imprimiendo por respeto.']
      : ['(Desde el 27) Ñiiic, ñiiic. Y alguien mastica.', '...Eso no viene de arriba.']),
  () => ['(Office) «...Buenas noches.» Una voz de mujer, muy bajita.', 'Alguien más saluda a Gertrudis.'],
];

export default buildRoom({
  id: 'cpd',
  name: 'Sistemas y CPD',
  music: 'm_cpd',
  flags: {
    cpd_cms_sumado: 'bool · ya se sumaron los +318 tickets del CMS (primera entrada tras cms_vivo)',
  },

  objects: [
    ascensorObjeto('ascensor_cpd', {
      mirar: 'El ascensor. Sube. Es lo único que sube aquí sin abrir ticket.',
      cerrar: 'Se cierra solo. Lo programó Paco. Tiene número de ticket.',
      empujar: 'No. Si lo empujo, Paco me abre un ticket por «impulso no autorizado».',
      hablar: '«Subo». No contesta. Pero sube. Ya es más que la mayoría.',
    }),
    { id: 'armarios', name: 'armarios', handlers: {
      mirar: 'Cuarenta armarios iguales. Zumban en mi bemol.',
      abrir: 'Cerrados. Todos. Como las plazas de redactor.',
      hablar: 'Les hablo. Me contestan en mi bemol. Es más de lo que hace Dirección.',
      empujar: 'Empujas uno y Paco te abre cuarenta tickets. Uno por armario.',
      coger: 'Pesan como un servidor. Porque son servidores.',
      tirar: 'Tiro de un cable. Paco carraspea a seis metros. Lo suelto.',
    } },
    { id: 'armario_27', name: 'armario 27', state: 'cerrado', states: ['cerrado', 'abierto', 'vacio'], handlers: {
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
        if (api.flag('ruben_encontrado') && !api.flag('ruben_libre')) await api.say('No. Ya he encerrado a bastante gente hoy. Bueno, a nadie. Pero no.');
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
    } },
    { id: 'papel_continuo', name: 'papel continuo', handlers: {
      mirar: async (api) => {
        await api.say('Papel continuo con borde perforado.');
        if (api.flag('vio_borde_perforado')) await api.say('...Como el del fax de F.P.');
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
    { id: 'ventilador', name: 'ventilador', handlers: {
      mirar: 'Un ventilador con una cuña de papel. Hace un ruido como de prosa.',
      tirar: async (api) => {
        if (api.flag('profecia_leida')) { await api.say('Ya leí la profecía. La cuña vuelve a su sitio. El ventilador lo agradece.'); return; }
        api.sfx('paper');
        await api.say(['Es una página perdida del Libro de Estilo.', '«El día que firme en papel uno de la web, el periódico saldrá igual».',
          '«(Nota del autor: tengo sueño).» La vuelvo a poner. El ventilador la necesita.']);
        api.setFlag('profecia_leida', true);
      },
      coger: 'Si me lo llevo, el CPD se pone a sudar. Y Paco con él.',
      usar: 'Ya está encendido. Desde 2003. Nadie sabe dónde está el botón.',
      empujar: 'No. La cuña es lo único que lo sujeta. Como a mí el café.',
      hablar: 'Le hablo. Me contesta con prosa. Ventilada.',
    } },
    { id: 'libro_visitas', name: 'libro de visitas', handlers: {
      mirar: 'Libro de visitas del CPD: «Rubén. Entrada: julio. Salida: —».',
      usar: 'Firmo: «Bruno. Entrada: 2020. Salida: —». Quedo igual que Rubén.',
      coger: 'Si me lo llevo, Paco no sabe quién ha venido. Que es nadie, pero apuntado.',
      abrir: 'Ya está abierto. Por la misma página desde julio.',
      cerrar: 'Si lo cierro, Rubén no sale ni en el libro. Lo dejo abierto.',
    } },
    { id: 'contador_tickets', name: 'contador de tickets', handlers: {
      mirar: async (api) => { await api.say(`TICKETS ABIERTOS: ${miles(api.flag('paco_tickets'))}. Sube cada vez que respiro. Lo he comprobado.`); },
      usar: 'No tiene botones. Solo sube. Como el IPC, pero con más sinceridad.',
      empujar: async (api) => { api.inc('paco_tickets'); api.sfx('beep'); await api.say('Lo empujo. Sube uno. Me lo apunta a mí.'); },
      hablar: 'Le pido que baje. Sube. Es su forma de decir que no.',
      coger: 'Está atornillado a la pared. Como la paciencia de Paco.',
    } },
    { id: 'registro_tickets', name: 'registro de tickets', handlers: {
      mirar: async (api) => {
        await api.say(['Registro de tickets. Nadie lo lee. Por eso es tan sincero.', 'Ticket nº 3, 2017: «CMS lento con la pantalla de la Pecera encendida».',
          'Estado: no prioritario.']);
        api.setFlag('vio_ticket_3', true);
        await api.say(['Ticket nº 1, julio: «Alta becario Rubén». Pendiente.', 'Ticket nº 0, 1997: «Alta jefe de cierre, Teodoro C.». No ha salido nunca.']);
      },
      abrir: async (api) => { await api.say('Lo abro por donde siempre: por el principio. Nadie llega al final.'); },
      coger: 'Pesa más que la paciencia de Paco. No me lo llevo.',
      cerrar: 'Ya está cerrado. Es lo único cerrado de todo el registro.',
      hablar: 'Le leo en voz alta el ticket nº 3. Paco suspira desde su silla.',
    } },
    { id: 'cementerio_ratones', name: 'caja de ratones', handlers: {
      mirar: 'Una caja de ratones de bola. Paco no los tira. Dice que aún ruedan por dentro.',
      coger: 'Si me llevo uno, Paco abre un ticket. Y lo cierra cuando ruede.',
      usar: 'Muevo una bola. Rueda por dentro. Paco tenía razón.',
      hablar: 'Les doy el pésame. Uno rueda. Lo tomo como un sí.',
      empujar: 'La caja no se mueve. Pesa como treinta jefes de Sistemas.',
    } },
    // ADENDA 3.2
    { id: 'rejilla_cpd', name: 'rejilla', handlers: {
      mirar: say('Una rejilla del falso suelo. Por aquí suben las voces del edificio.', 'Paco lo sabe todo. No es intuición: es fontanería.'),
      usar: async (api) => {
        const n = api.inc('rejilla_n');
        await api.say(REJILLA[(n - 1) % REJILLA.length](api));
      },
      abrir: paco('Ahí abajo hay cables de 1997. Y un bocadillo de 2003.'),
      hablar: 'Hablo por la rejilla: «¿Hola?». Arriba alguien contesta: «Lo hablamos».',
      coger: 'Está atornillada. Si me la llevo, el edificio se queda sin oídos.',
      empujar: 'La piso. Suena a planta 2. Me aparto, por si me oyen.',
    } },
  ],

  actors: [
    { id: P,
      murmurs: ['48.213... 48.214... Esto no para.', 'No, mamá, el wifi no se ha caído. Has dejado de merecerlo.',
        'A las seis y media se va la gente. Los tickets se quedan. Como yo.',            // §8.7
        'Me abrió un ticket con márgenes. Lo tengo enmarcado.'],                          // adenda 4.6b
      handlers: {
        mirar: 'Paco Ticket. No le da la luz natural desde que había fax en cada mesa.',
        hablar: async (api) => { await api.dialog('paco'); },
        'dar:posit_baja_ruben': async (api) => { await pacoBaja(api); },
        'dar:cafe': paco('¿Tiene número de ticket? Pues no es un café: es un rumor.'),
        'dar:manual_fax': paco('Ese manual ya es tuyo. Las devoluciones van por ticket. Y tardan.'),
        'dar:ticket_n1': paco('Quédatelo. Yo ya tengo el recuerdo. Y una foto mental.'),
        'dar:tarjeta_becario': paco('«Pellizco». Te abro un ticket: «Nombre mal escrito». Ponte a la cola.'),
        'dar:album_eventos': paco('Fotos de eventos. Yo no salgo en ninguna. Lo tengo por ticket.'),
        'dar:*': paco('¿Viene con número de ticket? Pues no lo veo.'),
        empujar: 'A Paco no se le empuja. Se le abre un ticket. Y se espera.',
        tirar: 'Le tiro del forro polar. Me mira como a una impresora sin driver.',
        coger: 'Paco no se mueve del CPD. Es infraestructura.',
      } },
    { id: R, when: ['ruben_encontrado', '!ruben_libre'], handlers: {
      mirar: 'Rubén, alias Titulator 3000. Sudadera, ojeras y migas de bocadillo de máquina.',
      hablar: async (api) => { await api.dialog('ruben'); },
      'dar:cafe': rub('¿Café? Gracias. Pero lo que necesito es un táper. Y la baja.'),
      'dar:album_eventos': rub('Ahí salgo. Al fondo. Siempre al fondo. Es mi encuadre.'),
      'dar:posit_baja_ruben': rub('Eso no es para mí. Es para Paco. Yo solo soy el que se va.'),
      'dar:*': rub('¿ES UN TÁPER? ...No. Pues gracias igual.'),
      empujar: 'No. Bastante empujado está. Lleva cuatro meses en un armario.',
      tirar: 'No puedo sacarlo a tirones. Sin baja, Íñigo le factura las horas de sol.',
    } },
  ],

  dialogs: { paco: pacoDialog, ruben: rubenDialog },
  duels: {},
  scenes: { revelacion_ruben: revelacionRuben },
  defaults: {},
  ambient: [],

  async onEnter(api) {
    // §3.9: el contador empieza en 48.211 y suma +1 por entrada; +318 la primera vez que se entra tras cms_vivo
    if (!api.flag('paco_tickets')) api.setFlag('paco_tickets', 48211);
    if (!api.restoring) api.inc('paco_tickets');              // cargar partida no es una entrada
    if (api.flag('cms_vivo') && !api.flag('cpd_cms_sumado')) { api.inc('paco_tickets', 318); api.setFlag('cpd_cms_sumado', true); }
    const st = estadoArmario(api);
    if (api.getState('armario_27') !== st) api.setState('armario_27', st);
  },
}, art);
