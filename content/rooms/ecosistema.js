// SALA `ecosistema` (a la vista: «Marketing y Comercial») — LÓGICA. Dueño: P4 (plan de comedia §5.16 Borja y el portátil de
// Tadeo, §5.17 Maripaz: fuera el duelo D1, que se muda a la Sala Amazonas; su «cariño» pasa a letra pequeña; tras D1, su
// llamada a Siestatón como ambiente). Antes: paquete D · «Planta noble y Dirección» (biblia §9.1). Biblia: §3.7, §7.7.8, §7.7.9,
// §6.4-6.5 (duelo D1, Maripaz), P07, P14a. Adenda: §3.7 (portátil de Tadeo), §4.5 (su asistente), §8bis (piel de plátano),
// rumores A3 / C3 / D1 (§8), murmullos y combinaciones (§4.8).
// El arte y la geometría están en ./art/ecosistema.art.js (artista de fondos). Árboles en ./ecosistema.dialogos.js.
// EVENTOS tiene sala propia (`eventos`, la Sala Polivalente, puerta `ecosistema_a_eventos`): Pilar, el photocall, el aro
// de luz, las cajas de lanyards, el gong, el álbum y el ¡FLASH! de entrada viven allí. Aquí queda Marketing + Comercial.
import { buildRoom } from '../lib/room.js';
import art from './art/ecosistema.art.js';
import dialogos from './ecosistema.dialogos.js';
import { gong, SFX, rota } from '../escenas/planta_noble.js';
import { ascensorObjeto } from '../lib/ascensor.js';

const BORJA = 'borja_engagement', MARIPAZ = 'maripaz_remitido';
const sayB = (api, t) => api.sayAs(BORJA, t);
const sayM = (api, t) => api.sayAs(MARIPAZ, t);
const tadeo = (api, t) => api.sayFrom('portatil_tadeo', t);
const acto = (api) => (api.flag('acto_3_iniciado') ? 3 : api.flag('acto_2_iniciado') ? 2 : 1);

// §5.16: el portátil de Tadeo baja a cuatro mensajes sin siglas (rotan). Con Rubén encontrado, el hilo del cuarto (la
// pareja R15) tiene respuesta del Titulator: la réplica nueva, «Lo sé. Me lo ha contado ella. Se llama Rubén.» (§7.3).
const PORTATIL = [
  ['En pantalla: «La IA dice que lo más pesado de la web es el logo».'],
  ['Debajo: «Propongo quitar el logo. Por si os sirve!!». Enviado a todos.'],
  ['«La IA dice que la gente no lee. RV: a todos. Para que lo lean».'],
  ['«La IA está de acuerdo conmigo. Adjunto pantallazo de la IA de acuerdo».'],
];
async function mirarPortatil(api) {
  if (api.flag('ecosistema_portatil_cerrado')) { await api.say(['Cerrado. Por primera vez desde las seis.', 'Se oye la moqueta.']); return; }
  if ((api.flag('portatil_tadeo_n') || 0) === 0) await api.say(['El portátil de Tadeo, de Negocio. Se fue a las seis.', 'Su portátil, no.']);
  const n = api.inc('portatil_tadeo_n');
  const k = (n - 1) % PORTATIL.length;
  await api.say(PORTATIL[k]);
  if (k === 3 && api.flag('ruben_encontrado')) {
    await api.say(['Contesta el Titulator: «Lo sé. Me lo ha contado ella. Se llama Rubén».',
      'Tadeo no lo ha leído. Yo sí. Me la apunto.']);
    api.learnReply('rep_15');
  }
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

// Maripaz (§5.17): fuera de la planta en el Acto II hasta ganar D1 (está en la Sala Amazonas, sentada en el planillo)
const maripazAqui = (api) => { const p = api.actorPos(MARIPAZ); return !!(p && p.room === 'ecosistema'); };
/** Maripaz contesta si está; si no, la línea de Bruno. */
async function mp(api, linea, sinElla) {
  if (maripazAqui(api)) await sayM(api, linea); else await api.say(sinElla);
}

// «Usar cualquier papel» con la impresora (§3.7)
const PAPELES = ['fotocopia_nota_direccion', 'mensaje_fp', 'pieza_opa', 'ficha_pagina_7', 'ticket_n1', 'acta_reunion', 'album_eventos'];
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
      hablar: '«¿Bajas?». Hace «tin». Comercial me lo factura como conversación.',
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
      usar: async (api) => { await api.say('Me pongo delante del roll-up.'); await mp(api, 'Ahora tú eres el anuncio. Te cobro el metro cuadrado. (*IVA aparte.)', 'Soy el anuncio. Nadie lo contrata. Ni yo.'); },
      empujar: async (api) => { api.setState('rollup_comercial', 'enrollado'); await api.say('¡Zas! Se enrolla solo.'); await mp(api, 'Eso es una baja de campaña. Te la facturo. (*Sin preaviso.)', 'Sin Maripaz delante, se enrolla sin factura. Lo disfruto.'); },
      coger: async (api) => { await mp(api, 'El roll-up no se toca. Está contratado hasta 2030. (*Renovable.)', 'Contratado hasta 2030. Lo pone abajo, en pequeño.'); },
      tirar: async (api) => { api.setState('rollup_comercial', 'desplegado'); await api.say('Tiro de la lona. Sube como una persiana con objetivos.'); },
    } },
    { id: 'termometro_ventas', name: 'termómetro de ventas', handlers: {
      mirar: async (api) => api.say(['Un termómetro pintado a rotulador: «OBJETIVO Q3». Rojo hasta el 97 %.', 'El 3 % que falta se lo lleva el gong de al lado.']),
      usar: async (api) => { await api.say('Le pinto un poquito más de rojo.'); await mp(api, 'Eso no es una venta. Es una ilusión. Y no la facturo. (*Todavía.)', 'Rojo hasta el 98 %. Nadie lo nota. Igual que mis ventas.'); },
      empujar: 'Si lo empujo, sube la temperatura. No las ventas.',
      coger: 'Es la única cosa de la planta que sube sola. No lo toco.',
      hablar: async (api) => { await api.say('«¿Cuándo llegas al cien?».'); await mp(api, 'El día que pagues tú. (*Tarifa becario: la misma.)', 'No contesta. Le falta el 3 %. Y a mí, el contrato.'); },
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
      hablar: 'Le leo el lema en voz alta. Suena a anuncio. Lo patrocina Comercial.',
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
      'usar:copias_rechazadas': 'Le doy papel. Dice «ATASCO EN BANDEJA 2». Le da igual: es de principios.',
      'usar:manual_fax': 'El manual es del fax. La impresora no se deja ayudar por un fax.',
    } },
    { id: 'ecosistema_a_administracion', name: 'pasillo a Administración', exit: { room: 'administracion', tipo: 'pasillo' }, handlers: {
      mirar: 'Pasillo a Administración. Al fondo, una ventanilla brilla como un faro.',
      usar: async (api) => { await api.goto('administracion', 'ecosistema'); },
      abrir: 'Es un pasillo. Ya viene abierto. Lo que se abre al fondo es un expediente.',
      empujar: '¿Empujar un pasillo? ¿Hacia Administración? Ya va él solo.',
    } },
    // ADENDA §3.7 · portátil de Tadeo (presencia sin sprite: habla en su color, encima del portátil)
    { id: 'portatil_tadeo', name: 'portátil de Tadeo', color: '#FFCC99', handlers: {
      mirar: mirarPortatil,
      hablar: async (api) => api.dialog('portatil_tadeo'),
      cerrar: cerrarPortatil,
      abrir: async (api) => {
        if (api.flag('ecosistema_portatil_cerrado')) await api.say('Mejor no. Ahora está en paz. La impresora, no.');
        else await api.say('Ya está abierto. Nunca se ha cerrado. Su bandeja de salida, tampoco.');
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
      coger: async (api) => { await mp(api, '¡Deja eso! Es una inversión a largo plazo. (*Rentabilidad no garantizada.)', 'Mejor la dejo. Alguien la ha puesto con mucha planificación.'); },
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
        'Si alguien deja su plaza, el post del pésame lo escribo yo.'],
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
    // §5.17: en Marketing y Comercial en el Acto I y tras ganar D1 (en el Acto II, hasta D1, está en la Sala Amazonas)
    { id: MARIPAZ, when: (api) => !api.flag('acto_2_iniciado') || !!api.flag('casilla_hueco'),
      murmurs: ['Te pongo un «ofrecido por» tan pequeño que solo lo verá el supervisor.',
        '¿Y una portada desplegable con olor a chorizo? Piénsalo.',
        'Tadeo, te patrocino el reenvío. «Por si os sirve...» (*Sin existencias.)',
        'Gervasio, ¿y tú cómo te encuentras? De salud, digo. (*Pregunta sin compromiso.)'],
      handlers: {
        mirar: 'Maripaz, Comercial. Lleva el mazo del gong como otros el bolso.',
        hablar: async (api) => api.dialog('maripaz'),
        'dar:ficha_pagina_7': async (api) => {
          if (api.flag('casilla_hueco')) await sayM(api, 'Ya te he firmado. Firmar dos veces es un contrato. (*De permanencia.)');
          else await sayM(api, 'Una ficha sin hueco. El hueco está en la Sala Amazonas. (*Debajo de mí.)');
        },
        'dar:cafe': async (api) => { await sayM(api, '¿Café? Te lo patrocino: «Despertar, con Cafés Madrugón».'); },
        'dar:tarjeta_becario': async (api) => { await sayM(api, '¿«Pellizco»? Eso no es un nombre. Es un formato publicitario. (*Robapáginas.)'); },
        'dar:pieza_opa': async (api) => { await sayM(api, '¿Una exclusiva sin módulo al lado? Qué desperdicio. (*Módulo no incluido.)'); },
        'usar:movil': async (api) => { await sayM(api, 'Si me fotografías, cobro por impresión. (*Mil impresiones mínimo.)'); },
        empujar: async (api) => { gong(api); await sayM(api, 'Uy. Eso lo facturo como experiencia de usuario. (*Contacto incluido.)'); },
        coger: async (api) => { await sayM(api, 'A mí no se me coge. Se me contrata. (*Mínimo un trimestre.)'); },
      } },
  ],

  dialogs: dialogos,
  scenes: {},
  defaults: {},
  // §5.9: tras D1, Maripaz llama a Siestatón desde su mesa (una vez, cuando el motor encuentre hueco)
  ambient: [{ id: 'maripaz_siestaton', if: 'casilla_hueco', voces: { M: 'maripaz_remitido' },
    discusiones: [[['M', '¿Siestatón? Os paso a la web. Con un banner que respira.']]] }],

  async onEnter(api) {
    // El ¡FLASH! de entrada ya no es de esta planta: es del photocall de Eventos, en la Sala Polivalente (`eventos`).
    // §8.7: la primera vez que entra en el Acto I. Cargar partida no es entrar.
    // el roll-up enrollado no dura: al volver a la planta, Maripaz ya lo ha desplegado (también al cargar)
    if (api.getState('rollup_comercial') === 'enrollado') api.setState('rollup_comercial', 'desplegado');
    if (api.restoring) return;
    if (!api.flag('acto_2_iniciado') && api.once('ecosistema_entrada_1830')) {
      await api.say('La planta 2 a las seis y media: moqueta, pufs y nadie. Y un gong, detrás.');
    }
  },
}, art);
