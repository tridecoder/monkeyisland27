// SALA `ecosistema` — LÓGICA. Dueño: paquete D · «Planta noble y Dirección» (biblia §9.1). Biblia: §3.7, §7.7.8, §7.7.9,
// §6.4-6.5 (duelo D1, Maripaz), P07, P14a. Adenda: §3.7 (portátil de Tadeo), §4.5 (su asistente), §8bis (piel de plátano),
// rumores A3 / C3 / D1 (§8), murmullos y combinaciones (§4.8).
// El arte y la geometría están en ./art/ecosistema.art.js (artista de fondos). Árboles en ./ecosistema.dialogos.js.
// EVENTOS tiene sala propia (`eventos`, la Sala Polivalente, puerta `ecosistema_a_eventos`): Pilar, el photocall, el aro
// de luz, las cajas de lanyards, el gong, el álbum y el ¡FLASH! de entrada viven allí. Aquí queda Marketing + Comercial.
import { buildRoom } from '../lib/room.js';
import art from './art/ecosistema.art.js';
import dialogos, { abrirDueloMaripaz } from './ecosistema.dialogos.js';
import { gong, SFX, rota } from '../escenas/planta_noble.js';
import { ascensorObjeto } from '../lib/ascensor.js';

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
    // el flag va ANTES de las líneas (guía §11): el portátil se ve cerrado y la impresora reenvía mientras se cuenta
    api.setFlag('ecosistema_portatil_cerrado', true);
    await api.say('Lo cierro. Silencio. Toda la planta suspira.');
    api.sfx(SFX.plin);
    await api.say(['Ahora reenvía desde la impresora de la tercera.', 'Pantalla de la impresora: «ATASCO EN BANDEJA DE SALIDA».']);
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
  // plan §7 (paquete común): CC que crece, derrota propia y titular. La escena de derrota (Siestatón) es de P4:
  // `defeatScene: '<escena>'` o `onLose(api, duel, 'lost')`; `duel.perdidos` = derrotas hasta ahora.
  cc1: 'Colchones Siestatón',
  defeatLine: 'RESPUESTA AUTOMÁTICA DE COMERCIAL: «Te llamamos nosotros.»',
  defeatHeadline: 'BECARIO LLAMA A UN COLCHÓN UN VIERNES. EL COLCHÓN NO LO COGE',
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
const PAPELES = ['fotocopia_nota_direccion', 'mensaje_fp', 'pieza_opa', 'ficha_pagina_7', 'posit_baja_ruben', 'ticket_n1', 'acta_reunion', 'album_eventos'];
const impresoraPapel = Object.fromEntries(PAPELES.map(i => ['usar:' + i, '«ATASCO EN BANDEJA 2». Le da igual lo que le dé.']));

export default buildRoom({
  id: 'ecosistema',
  name: 'Marketing y Comercial',
  music: 'm_ecosistema',
  flags: {
    ecosistema_portatil_cerrado: 'bool · D · Cerrar portátil de Tadeo (Acto III) · D (Mirar portátil, impresora)',
    ecosistema_pufs_n: 'int · D · ecosistema · +1 por Usar pufs · D',
  },

  objects: [
    { id: 'ecosistema_a_pecera', name: 'escalera a la Redacción', exit: { room: 'pecera', tipo: 'escalera' }, handlers: {
      mirar: 'La escalera de bajada. A Redacción, donde la moqueta es de verdad.',
      usar: async (api) => { api.sfx('step'); await api.goto('pecera', 'ecosistema'); },
      empujar: 'Empujar una escalera es bajar sin decidirlo. Aquí se decide todo en Q3.',
    } },
    ascensorObjeto('ascensor_ecosistema', {
      mirar: async (api) => api.say(['El ascensor. Marketing le ha puesto pufs delante.', 'Para que la gente no se vaya. Que se «ubique».']),
      cerrar: 'Se cierra solo. Es lo único de la planta que no pide feedback.',
      empujar: 'No se empuja. Se activa. Lo dice el vinilo.',
      tirar: 'Tiro de la puerta. Borja lo cuenta en vertical: «Bruno abriendo caminos».',
      hablar: '«¿Bajas?». Hace «tin». Maripaz me lo factura como conversación.',
    }),
    // ---- la puerta de EVENTOS (Sala Polivalente) y lo que llena la pared que dejó el photocall
    { id: 'ecosistema_a_eventos', name: 'puerta de Eventos', exit: { room: 'eventos', tipo: 'puerta_doble' }, handlers: {
      mirar: async (api) => api.say(['La puerta de Eventos. Por la rendija salen focos, un gong y prisa.',
        'Encima, un piloto verde: «PRÓXIMO EVENTO: 5 MIN». No se apaga nunca.']),
      usar: async (api) => { api.sfx('door'); await api.goto('eventos', 'ecosistema'); },
      abrir: async (api) => { api.sfx('door'); await api.goto('eventos', 'ecosistema'); },
      cerrar: 'Ya está entornada. Más cerrada, Pilar lo llama «evento privado».',
      empujar: 'Empujo. Desde dentro: «¡Faltan cinco minutos!». Empujo con más respeto.',
      hablar: '«¿Se puede?». Contesta un walkie: «Con acreditación. Cambio».',
    } },
    { id: 'embudo_marketing', name: 'embudo de Marketing', handlers: {
      mirar: async (api) => api.say(['Un embudo de Marketing: «VEN · MIRA · COMPARTE · ¿?».', 'El último paso es una interrogación. Es el único honesto.']),
      usar: 'Me meto en el embudo. Salgo por abajo convertido. En becario.',
      coger: 'Borja lo tiene en vertical. Si lo descuelgo, se queda en horizontal y llora.',
      hablar: async (api) => { await api.say('«¿Y qué hay al final del embudo?».'); await sayB(api, '¡No le hables al embudo! ¡El embudo te habla a ti!'); },
      empujar: 'Lo enderezo. Borja lo vuelve a torcer: «Así convierte más».',
    } },
    // estados (guía §11): 'desplegado' / 'enrollado' (Empujar lo enrolla; Tirar lo vuelve a subir; al volver a la
    // planta, Maripaz ya lo ha desplegado: está contratado hasta 2030)
    { id: 'rollup_comercial', name: 'roll-up de Comercial', state: 'desplegado', states: ['desplegado', 'enrollado'], handlers: {
      mirar: async (api) => api.say(['Un roll-up: «SU ANUNCIO AQUÍ». Y la extensión de Maripaz, en grande.', 'Lleva aquí tanto tiempo que ya se anuncia a sí mismo.']),
      usar: async (api) => { await api.say('Me pongo delante del roll-up.'); await sayM(api, 'Ahora tú eres el anuncio, cariño. Te cobro el metro cuadrado.'); },
      empujar: async (api) => { api.setState('rollup_comercial', 'enrollado'); await api.say('¡Zas! Se enrolla solo.'); await sayM(api, 'Eso, cariño, es una baja de campaña. Te la facturo.'); },
      coger: async (api) => { await sayM(api, 'El roll-up no se toca, cariño. Está contratado hasta 2030.'); },
      tirar: async (api) => { api.setState('rollup_comercial', 'desplegado'); await api.say('Tiro de la lona. Sube como una persiana con objetivos.'); },
    } },
    { id: 'termometro_ventas', name: 'termómetro de ventas', handlers: {
      mirar: async (api) => api.say(['Un termómetro pintado a rotulador: «OBJETIVO Q3». Rojo hasta el 97 %.', 'El 3 % que falta se lo lleva el gong de al lado.']),
      usar: async (api) => { await api.say('Le pinto un poquito más de rojo.'); await sayM(api, 'Eso no es una venta, cariño. Es una ilusión. Y no la facturo.'); },
      empujar: 'Si lo empujo, sube la temperatura. No las ventas.',
      coger: 'Es la única cosa de la planta que sube sola. No lo toco.',
      hablar: async (api) => { await api.say('«¿Cuándo llegas al cien?».'); await sayM(api, 'El día que pagues tú, cariño.'); },
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
      empujar: 'Rueda hacia la puerta de Eventos. Hasta el puf quiere salir en una foto.',
      tirar: 'Tiro. Suspira. Es el único de la planta que se queja con razón.',
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
    { id: 'ecosistema_a_administracion', name: 'pasillo a Administración', exit: { room: 'administracion', tipo: 'pasillo' }, handlers: {
      mirar: 'Pasillo a Administración. Al fondo, una ventanilla brilla como un faro.',
      usar: async (api) => { await api.goto('administracion', 'ecosistema'); },
      abrir: 'Es un pasillo. Ya viene abierto. Lo que se abre al fondo es un expediente.',
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
      murmurs: ['Hay que hablarle al lector de tú. Y en vertical. Y con un emoji.',
        'Esto es contenido. Aquello es contenido. ¿Tú eres contenido?',
        'Tadeo y yo hacemos sinergia. Él reenvía. Yo lo convierto en hilo.',
        'Si alguien deja su plaza, el post del pésame lo escribo yo.',
        '¡Valentín no necesita filtro! ¡El filtro necesita a Valentín!'],
      handlers: {
        mirar: 'Borja Engagement, Marketing. Habla al móvil como a un micro. Aunque no grabe.',
        hablar: async (api) => api.dialog('borja'),
        coger: async (api) => { await sayB(api, '¡Me has cogido del brazo! ¡Eso es una alianza estratégica!'); },
        empujar: async (api) => { await sayB(api, '¡Contacto físico! ¡Eso es engagement orgánico!'); },
        'dar:cafe': async (api) => { await sayB(api, '¡Café en mano! ¡Eso es un post! Quédatelo, que tú conviertes mejor.'); },
        'dar:album_eventos': async (api) => { await sayB(api, '¡No lo devuelvas sin compartirlo! El contenido no vuelve: se viraliza.'); },
        'dar:tarjeta_becario': async (api) => { await sayB(api, '¿«Pellizco»? ¡Eso es un naming! Te lo registro como marca.'); },
        'dar:ficha_pagina_7': async (api) => { await sayB(api, '¿Una ficha? Hazle un carrusel. Si no, no la firma nadie.'); },
        'usar:movil': async (api) => { await sayB(api, '¡Me grabas! ¡Eso es contenido generado por becario!'); },
        'dar:*': async (api) => { await sayB(api, '¡Gracias! Lo subo. Luego te lo devuelvo, si no se viraliza.'); },
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
    // El ¡FLASH! de entrada ya no es de esta planta: es del photocall de Eventos, en la Sala Polivalente (`eventos`).
    // §8.7: la primera vez que entra en el Acto I. Cargar partida no es entrar.
    // el roll-up enrollado no dura: al volver a la planta, Maripaz ya lo ha desplegado (también al cargar)
    if (api.getState('rollup_comercial') === 'enrollado') api.setState('rollup_comercial', 'desplegado');
    if (api.restoring) return;
    if (!api.flag('acto_2_iniciado') && api.once('ecosistema_entrada_1830')) {
      await api.say('La planta 2 a las seis y media: moqueta, pufs y nadie. Y un gong, detrás.');
    }
    // micro-puzle de la silla 113 (eventos): Maripaz ha recuperado su silla
    if (api.flag('eventos_silla_devuelta') && api.once('ecosistema_silla_maripaz')) {
      await sayM(api, 'Me has devuelto la silla, cariño. Te la facturo como mudanza.');
    }
  },
}, art);
