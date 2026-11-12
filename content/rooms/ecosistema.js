// SALA `ecosistema` — LÓGICA. Dueño: paquete D · «Planta noble y Consejo» (biblia §9.1). Biblia: §3.7, §7.7.8, §7.7.9,
// §6.4-6.5 (duelo D1, Maripaz), P07, P14a. Adenda: §3.7 (portátil de Tadeo), §4.5 (su asistente), §8bis (piel de plátano),
// rumores A3 / C3 / D1 (§8), murmullos y combinaciones (§4.8).
// El arte y la geometría están en ./art/ecosistema.art.js (artista de fondos). Árboles en ./ecosistema.dialogos.js.
import { buildRoom } from '../lib/room.js';
import art from './art/ecosistema.art.js';
import dialogos, { abrirDueloMaripaz } from './ecosistema.dialogos.js';
import { flash, gong, SFX, rota } from '../escenas/planta_noble.js';

const BORJA = 'borja_engagement', MARIPAZ = 'maripaz_remitido';
const sayB = (api, t) => api.sayAs(BORJA, t);
const sayM = (api, t) => api.sayAs(MARIPAZ, t);
const tadeo = (api, t) => api.sayFrom('portatil_tadeo', t);
const acto = (api) => (api.flag('acto_3_iniciado') ? 3 : api.flag('acto_2_iniciado') ? 2 : 1);

// adenda §3.7: rotación del portátil de Tadeo (Mirar). La (2) enseña R15.
const PORTATIL = [
  ['«¡Equipo! La IA dice que el LCP es el elemento más grande».', '«Propongo quitarlo. Por si os sirve!!».'],
  null,
  ['«RV: Lo más grande de la web es el logo. Propongo quitar el logo».', '«A la e ya le falta un tornillo. Es una señal».'],
  ['«RV: Nuestro CLS es 0,25. La IA dice que lo bueno es 0,1».', '«Mide cuánto se mueve la página. Propongo atornillarla».',
    '«He pedido presupuesto a Ferretería Hermanos Tornillo».'],
  ['«RV: LCP de 4,1 segundos. Lo bueno es 2,5».', '«Propongo que la Redacción escriba más rápido».'],
  ['«RV: INP alto: la web tarda en responder al lector».', '«Propongo que el lector espere sentado. Si encuentra silla».'],
  ['«RV: Lazy loading: cargar las cosas solo cuando hacen falta».', '«Propongo aplicarlo a las reuniones».',
    'Es lo primero sensato que leo hoy. Lo ha escrito una máquina.'],
  ['«RV: 4.000 líneas de código de la IA para el CMS».', '«No las he leído, pero tienen colores. ¡Vamos, equipo!».'],
  ['«RV: He pedido a la IA un resumen de mis correos».', '«Me ha mandado un correo. Os lo reenvío».'],
];
async function mirarPortatil(api) {
  if (api.flag('ecosistema_portatil_cerrado')) { await api.say(['Cerrado. Por primera vez desde las seis.', 'Se oye la moqueta.']); return; }
  if ((api.flag('portatil_tadeo_n') || 0) === 0) await api.say(['El portátil de Tadeo, de Negocio. Se fue a las seis.', 'Su portátil, no.']);
  const n = api.inc('portatil_tadeo_n');
  const k = n <= 9 ? n : 3 + ((n - 10) % 7);          // tras la (9) vuelve a la (3)
  if (k === 2) {
    await api.say(['Un hilo. Tadeo: «Lo he consultado con la IA y está de acuerdo conmigo».',
      'Leoncio contesta: «Normal. Se lo has preguntado tú». Me la apunto.']);
    api.learnReply('rep_15');
    await api.say('Debajo, la IA de Tadeo: «¡Excelente observación!».');
    return;
  }
  await api.say(PORTATIL[k - 1]);
}

async function cerrarPortatil(api) {
  if (api.flag('ecosistema_portatil_cerrado')) { await api.say('Ya está cerrado. Por fin descansa. La impresora, no.'); return; }
  const a = acto(api);
  if (a === 1) {
    await api.say('Lo cierro. Se abre solo.');
    await tadeo(api, '«He detectado que querías cerrarme. ¿Te ayudo a cerrarme?».');
  } else if (a === 2) {
    api.sfx(SFX.plin);
    await api.say('Lo cierro. Antes de apagarse, reenvía: «RV: Me han cerrado».');
  } else {
    await api.say('Lo cierro. Silencio. Toda la planta suspira.');
    api.sfx(SFX.plin);
    await api.say(['(¡PLIN!) Ahora reenvía desde la impresora de la tercera.', 'Pantalla de la impresora: «ATASCO EN BANDEJA DE SALIDA».']);
    api.setFlag('ecosistema_portatil_cerrado', true);
  }
}

async function golpeGong(api) {
  const n = rota(api, 'ecosistema_gong_n');
  gong(api);
  if (n === 0) {
    await api.say('¡GOOONG! La planta entera aplaude: creen que he vendido algo.');
    await sayM(api, '¡Ese gong es mío, cariño! Bueno, da igual: lo facturo.');
  } else {
    await api.say('¡GOOONG! Esta vez aplaude menos gente. El mercado se satura.');
    await sayM(api, 'Otro, cariño. A la tercera te hago una factura proforma.');
  }
}

// ---- duelo D1 (biblia §6.4-6.5)
const duelMaripaz = {
  actor: MARIPAZ,
  from: 'Maripaz Remitido',
  subject: 'Llamar a Colchones Siestatón para pasarlos a la web (viernes, 19:07)',
  assigned: 'B. Pollejo',
  deck: ['R08', 'R04', 'R11', 'R14'],
  winScore: 3,
  intro: ['¿Llamar yo a Siestatón un viernes a estas horas?', 'Te lo pongo por escrito, cariño.'],
  hurt: ['Uy. Eso tiene tarifa.', 'Me lo apunto para un patrocinio.'],
  taunt: ['Eso no lo patrocina nadie, cariño.', 'Muy bonito. Cero euros.'],
  defeatLines: ['Asignado a ti, cariño. El teléfono de Siestatón es este. Suerte.',
    ['player', 'No pienso llamar a un colchón a estas horas.']],
  onWin: async (api) => {
    await sayM(api, 'Vale, llamo yo.');
    api.sfx('phone');
    await sayM(api, '¿Siestatón? Os paso a la web. Con un banner que respira.');
    await sayM(api, 'Hueco libre. Faldón de 23 líneas. Impar, cariño: que se vea.');
    api.take('planillo');
    api.setFlag('duelo_maripaz_ganado', true);
    api.setFlag('casilla_hueco', true);
    gong(api);
    await api.wait(700);
  },
};

// «Usar cualquier papel» con la impresora (§3.7)
const PAPELES = ['fotocopia_nota_direccion', 'mensaje_fp', 'pieza_opa', 'ficha_pagina_7', 'posit_baja_ruben', 'ticket_n1', 'acta_consejo', 'album_borja'];
const impresoraPapel = Object.fromEntries(PAPELES.map(i => ['usar:' + i, '«ATASCO EN BANDEJA 2». Le da igual lo que le dé.']));

export default buildRoom({
  id: 'ecosistema',
  name: 'El Ecosistema',
  music: 'm_ecosistema',
  flags: {
    ecosistema_portatil_cerrado: 'bool · D · Cerrar portátil de Tadeo (Acto III) · D (Mirar portátil, impresora)',
    ecosistema_gong_n: 'int · D · ecosistema · +1 por Usar/Empujar gong · D',
    ecosistema_pufs_n: 'int · D · ecosistema · +1 por Usar pufs · D',
  },

  objects: [
    { id: 'ecosistema_a_pecera', name: 'escalera', exit: { room: 'pecera' }, handlers: {
      mirar: 'La escalera de bajada. A Redacción, donde la moqueta es de verdad.',
      usar: async (api) => { api.sfx('door'); await api.goto('pecera', 'ecosistema'); },
      empujar: 'Empujar una escalera es bajar sin decidirlo. Aquí se decide todo en Q3.',
    } },
    { id: 'photocall', name: 'photocall', handlers: {
      mirar: 'Treinta logos y un hueco en medio: «Espacio premium para tu cara».',
      usar: async (api) => {
        await api.say('Me pongo en el hueco.');
        await flash(api);
        await sayB(api, '¡Eso es contenido!');
      },
      coger: '¿Me llevo el photocall? Sin él, Borja dejaría de existir.',
      empujar: 'Si se cae el photocall, la planta 2 no ha ocurrido nunca.',
      hablar: 'Le hablo al photocall. Treinta logos me escuchan. Ninguno paga.',
      'usar:tarjeta_becario': async (api) => {
        await api.say('Pongo mi tarjeta en el hueco. «Bruno Pellizco», premium.');
        await flash(api);
        await sayB(api, '¡Un becario patrocinado! ¡Contenido!');
      },
    } },
    { id: 'aro_luz', name: 'aro de luz', handlers: {
      mirar: 'Un aro de luz. Te pone cara de haber dormido. Mentira institucional.',
      usar: 'Me pongo delante. Por fin parezco alguien con contrato.',
      coger: 'Si me lo llevo, mañana en la Pecera se nos ven las ojeras de verdad.',
      cerrar: 'Ya está apagado. Solo se enciende cuando hay alguien importante. Nunca.',
      abrir: 'Es un aro. No tiene por dónde. Por eso le cabe todo el mundo.',
    } },
    { id: 'pizarra_sinergia', name: 'pizarra', handlers: {
      mirar: 'Pone SINERGIA en tres colores. Si la miras fijamente, aparece un velero.',
      usar: 'Debajo escribo «¿Y qué es?». Se borra solo. Por vergüenza.',
      coger: 'No me llevo la pizarra. Es lo único que Marketing tiene por escrito.',
      empujar: 'La empujo. Se ve otro velero. Hay más sinergia de la que parece.',
      hablar: 'Le pregunto qué es sinergia. Me contesta un velero.',
    } },
    { id: 'pufs', name: 'pufs', handlers: {
      mirar: 'Pufs. Aquí nadie se sienta: se «ubica».',
      usar: async (api) => {
        const n = rota(api, 'ecosistema_pufs_n');
        await api.say(n === 0 ? 'Me ubico. Me hundo. Me desubico.' : 'Otra vez no. Aún tengo la forma del puf en la espalda.');
      },
      coger: 'Un puf no se coge. Se adopta. Y no tengo piso.',
      empujar: 'Rueda hasta el photocall. Hasta el puf tiene más visibilidad que yo.',
      tirar: 'Tiro. Suspira. Es el único de la planta que se queja con razón.',
    } },
    { id: 'album_borja_hotspot', name: 'álbum de Borja', when: '!oyo_descopear', handlers: {
      mirar: async (api) => {
        await api.say(['El álbum de eventos de Borja. En todas las fotos sale al fondo un chico pálido.',
          'Siempre yendo al baño. Con un táper. Borja lo llama «el extra».']);
      },
      coger: async (api) => {
        if (api.flag('ruben_encontrado')) await api.say('Mejor se lo pido. Borja es de los que denuncian a un puf.');
        else await sayB(api, '¡Eh! Eso es contenido. Pídemelo con un motivo.');
      },
      abrir: 'Lo abro por la cena de Navidad. Al fondo, el chico pálido. Con táper.',
      usar: 'Paso páginas. Photocall, canapé, chico pálido. Photocall, canapé, chico.',
    } },
    { id: 'cajas_lanyards', name: 'cajas de lanyards', handlers: {
      mirar: 'Lanyards para acreditar dos veces a la ONU.',
      coger: 'Si me pongo uno más, Borja me cobra la entrada.',
      abrir: 'Dentro, más lanyards. Y debajo, tazas con logo. Es un ecosistema.',
      usar: 'Me acredito a mí mismo. Me lo deniego. Tengo criterio.',
      empujar: 'No se mueven. Pesan más que mi currículum. Literalmente.',
    } },
    { id: 'gong', name: 'gong', handlers: {
      mirar: 'Un gong. Suena por cada venta. Y por cada promesa de venta.',
      usar: golpeGong,
      empujar: golpeGong,
      coger: async (api) => { await sayM(api, 'Ese gong no se mueve de mi mesa, cariño. Está facturado.'); },
      hablar: 'Le digo algo bonito al gong. No suena. Solo suena por dinero.',
      tirar: 'Se balancea. Maripaz me mira como a un cliente moroso.',
    } },
    { id: 'lema_enmarcado', name: 'lema enmarcado', handlers: {
      mirar: '«TODO ES UNA OPORTUNIDAD SI TIENE UN MÓDULO AL LADO.»',
      coger: 'Si lo descuelgo, detrás habrá un módulo. Mejor no mirar.',
      usar: 'Me pongo al lado. Soy una oportunidad. Nadie me compra.',
      hablar: 'Le leo el lema en voz alta. Maripaz asiente: lo patrocina ella.',
    } },
    { id: 'impresora_tercera', name: 'impresora', handlers: {
      mirar: async (api) => {
        if (api.flag('ecosistema_portatil_cerrado')) await api.say(['Pantalla: «ATASCO EN BANDEJA DE SALIDA».', 'Ahora reenvía ella. Con más criterio que Tadeo.']);
        else await api.say(['Pantalla: «ATASCO EN BANDEJA 2». No tiene bandeja 2.', 'Empiezo a dudar de la bandeja 1.']);
      },
      abrir: 'Dentro hay un folio de 2016 que pone «PRUEBA». Superada.',
      cerrar: 'La cierro. «ATASCO EN BANDEJA 2». Cerrada, pero con dudas.',
      usar: 'Pulso imprimir. «ATASCO EN BANDEJA 2». Por lo menos es coherente.',
      empujar: 'No. Una impresora a la que empujas siempre se acuerda.',
      hablar: 'Le pregunto por la bandeja 2. Se calla. Lleva años callándoselo.',
      ...impresoraPapel,
      'usar:planillo': '«ATASCO EN BANDEJA 2». Ni el planillo la convence.',
      'usar:copias_rechazadas': 'Le doy papel. Dice «ATASCO EN BANDEJA 2». Le da igual: es de principios.',
      'usar:manual_fax': 'El manual es del fax. La impresora no se deja ayudar por un fax.',
    } },
    { id: 'ecosistema_a_administracion', name: 'pasillo a Administración', exit: { room: 'administracion' }, handlers: {
      mirar: 'Pasillo a Administración. Al fondo, una ventanilla brilla como un faro.',
      usar: async (api) => { api.sfx('door'); await api.goto('administracion', 'ecosistema'); },
      empujar: 'El pasillo no se empuja. Se recorre. Como el procedimiento.',
    } },
    // ADENDA §3.7 · portátil de Tadeo (presencia sin sprite: habla en su color, encima del portátil)
    { id: 'portatil_tadeo', name: 'portátil de Tadeo', color: '#FFCC99', handlers: {
      mirar: mirarPortatil,
      hablar: async (api) => api.dialog('portatil_tadeo'),
      cerrar: cerrarPortatil,
      abrir: async (api) => {
        if (api.flag('ecosistema_portatil_cerrado')) await api.say('Mejor no. Ahora está en paz. La impresora, no.');
        else await api.say('Ya está abierto. Nunca se ha cerrado. Como su bandeja de salida.');
      },
      coger: 'Si lo cojo, me reenvía a mí.',
      usar: 'No me siento. Si me siento, reenvío.',
      empujar: 'Lo empujo un centímetro. Reenvía «RV: Me han movido». A todos.',
      'usar:movil': 'Le hago una foto. Me la reenvía. Con resumen.',
      'dar:pieza_opa': 'Ni loco. La reenvía a todos, con resumen y sin leer.',
      'usar:pieza_opa': 'Ni loco. La reenvía a todos, con resumen y sin leer.',
      'dar:*': 'Si le doy algo, lo reenvía. Con «Por si os sirve!!».',
    } },
    // ADENDA §8bis · la piel de plátano (guiño del garaje)
    { id: 'piel_platano', name: 'piel de plátano', handlers: {
      mirar: async (api) => {
        const n = api.flag('piel_platano_n') || 0;
        api.inc('piel_platano_n');
        if (n === 0) await api.say(['Una piel de plátano junto a la impresora. Pósit: «Para Gervasio (plaza 7)».', 'Gervasio no imprime nunca. El plan tiene un fallo.']);
        else await api.say('Lleva aquí desde marzo. Es más antigua que yo en esta planta.');
      },
      coger: async (api) => { await sayM(api, '¡Deja eso, cariño! Es una inversión a largo plazo.'); },
      empujar: 'La aparto con el pie. Aquí no se cae nadie: aquí la gente se jubila.',
      usar: 'No. Yo quiero una plaza de bici. Y por las buenas.',
      hablar: 'Le pregunto a quién espera. El pósit lo dice todo.',
    } },
  ],

  actors: [
    { id: BORJA,
      murmurs: ['Sí, el photocall en el baño también. La marca empieza donde empieza.',
        'Esto es contenido. Aquello es contenido. ¿Tú eres contenido?',
        'Tadeo y yo hacemos sinergia. Él reenvía. Yo fotografío lo que reenvía.',
        'Si alguien deja su plaza, el photocall del pésame lo pongo yo.',
        '¡Valentín no sale en el photocall! ¡El photocall sale en Valentín!'],
      handlers: {
        mirar: 'Borja Engagement. Nueve acreditaciones al cuello y ningún evento hoy.',
        hablar: async (api) => api.dialog('borja'),
        coger: async (api) => { await flash(api); await sayB(api, '¡Me has cogido del brazo! ¡Foto de alianza!'); },
        empujar: async (api) => { await flash(api); await sayB(api, '¡Contacto físico! ¡Eso es engagement!'); },
        'dar:cafe': async (api) => { await flash(api); await sayB(api, '¡Café en mano! ¡Bodegón corporativo! Quédatelo, que sales mejor.'); },
        'dar:album_borja': async (api) => { await sayB(api, '¡No me lo devuelvas sin compartirlo! El contenido no vuelve: se viraliza.'); },
        'dar:tarjeta_becario': async (api) => { await sayB(api, '¿«Pellizco»? Te hago una acreditación mejor. Pone «Contenido».'); },
        'dar:ficha_pagina_7': async (api) => { await sayB(api, '¿Una ficha? Ponle un photocall. Si no, no la firma nadie.'); },
        'usar:movil': async (api) => { await flash(api); await sayB(api, '¡Selfi de vuelta! ¡Me has fotografiado fotografiando!'); },
        'dar:*': async (api) => { await flash(api); await sayB(api, '¡Gracias! Lo subo. Luego te lo devuelvo, si no se viraliza.'); },
      } },
    { id: MARIPAZ,
      murmurs: ['Te pongo un «ofrecido por» tan pequeño que solo lo verá el supervisor.',
        '¿Y una portada desplegable con olor a chorizo? Piénsalo.',
        'Tadeo, cariño, te patrocino el reenvío. «Por si os sirve, con...»',
        'Gervasio, cariño, ¿y tú cómo te encuentras? De salud, digo.'],
      handlers: {
        mirar: 'Maripaz, Comercial. Lleva el mazo del gong como otros el bolso.',
        hablar: async (api) => api.dialog('maripaz'),
        'dar:planillo': async (api) => {
          if (!api.has('ficha_pagina_7')) { await sayM(api, '¿Y la ficha de tu página? Sin ficha no te firmo ni el hueco, cariño.'); return; }
          await abrirDueloMaripaz(api, true);
        },
        'dar:ficha_pagina_7': async (api) => {
          if (api.flag('casilla_hueco')) await sayM(api, 'Ya te he firmado, cariño. Firmar dos veces es un contrato.');
          else await sayM(api, 'Una ficha sin hueco. Tráeme el planillo y hablamos de huecos, cariño.');
        },
        'dar:cafe': async (api) => { await sayM(api, '¿Café? Te lo patrocino: «Despertar, con Cafés Madrugón».'); },
        'dar:tarjeta_becario': async (api) => { await sayM(api, '¿«Pellizco»? Eso no es un nombre, cariño. Es un formato publicitario.'); },
        'dar:pieza_opa': async (api) => { await sayM(api, '¿Una exclusiva sin módulo al lado? Qué desperdicio, cariño.'); },
        'usar:movil': async (api) => { await sayM(api, 'Si me fotografías, cobro por impresión, cariño.'); },
        empujar: async (api) => { gong(api); await sayM(api, 'Uy, cariño. Eso lo facturo como experiencia de usuario.'); },
        coger: async (api) => { await sayM(api, 'A mí no se me coge, cariño. Se me contrata.'); },
      } },
  ],

  dialogs: dialogos,
  duels: { maripaz: duelMaripaz },
  scenes: {},
  defaults: {},
  ambient: [],

  async onEnter(api) {
    // §3.7 ambiente: ¡FLASH! al entrar (cada vez). §8.7: la primera vez que entra en el Acto I.
    await flash(api);
    await sayB(api, '¡Gracias! ¡Eso es contenido!');
    if (!api.flag('acto_2_iniciado') && api.once('ecosistema_entrada_1830')) {
      await api.say('La planta 2 a las seis y media: moqueta, pufs y nadie. Bueno, un gong.');
    }
  },
}, art);
