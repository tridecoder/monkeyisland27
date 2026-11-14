// SALA `ecosistema` (a la vista: «Marketing y Comercial») — LÓGICA. Dueño: P4.
// ENMIENDA E2 (docs/guion2/ENMIENDA_E2.md): §3 Borja DESAPARECE como personaje: queda su aro de luz con el móvil en el
// centro, que publica solo (plantillas sin rellenar, lo que oye, el silencio); §3.6 el portátil de Tadeo, seis reenvíos;
// §4.4 Maripaz, directora de Comercial, ve cada píxel como hueco publicitario: el anuncio antes de entrar (interstitial,
// §4.2.4), el monitor de Comercial con el vídeo que se pone solo (`pantalla_comercial`), sus verbos y los de su planta;
// §6 L36; §8 (piel de plátano). Árboles en ./ecosistema.dialogos.js. Arte y geometría en ./art/ecosistema.art.js.
// EVENTOS tiene sala propia (`eventos`, puerta `ecosistema_a_eventos`).
// Flags globales que pone y lee (flags.js, E2 §10.2): aro_borja_mirar_n, aro_borja_hablar_n, maripaz_empujon_n,
// ecosistema_interstitial, pantalla_comercial_n.
import { buildRoom } from '../lib/room.js';
import art, { interstitialComercial, portadaComercial } from './art/ecosistema.art.js';
import dialogos from './ecosistema.dialogos.js';
import { gong, SFX, rota } from '../escenas/planta_noble.js';
import { ascensorObjeto } from '../lib/ascensor.js';

const MARIPAZ = 'maripaz_remitido';
const sayM = (api, t) => api.sayAs(MARIPAZ, t);
const movil = (api, t) => api.pantalla('aro_borja', t);              // §3.1: sin prefijo, en #4FD8E8
const video = (api, t) => api.pantalla('pantalla_comercial', t);     // §4.4: sin prefijo, en #FF8A60
const tadeo = (api, t) => api.sayFrom('portatil_tadeo', t);
const acto = (api) => (api.flag('acto_3_iniciado') ? 3 : api.flag('acto_2_iniciado') ? 2 : 1);

// §3.6: el portátil de Tadeo, seis reenvíos sin siglas (rotan). El cuarto (k === 3) es el de la pareja R15: con Rubén
// encontrado, contesta el Titulator con la réplica nueva (§7.3 del plan).
const PORTATIL = [
  ['En pantalla: «La IA dice que lo más pesado de la web es el logo».'],
  ['Debajo: «Propongo quitar el logo. Por si os sirve!!». Enviado a todos.'],
  ['«La IA dice que la gente no lee. RV: a todos. Para que lo lean».'],
  ['«La IA está de acuerdo conmigo. Adjunto pantallazo de la IA de acuerdo».'],
  ['«RV: La IA dice que nuestra web se mueve mucho al cargar».', '«Propongo atornillarla».',
    '«He pedido presupuesto a Ferretería Hermanos Tornillo».'],
  ['«RV: La IA dice: cargar las cosas solo cuando hacen falta».', '«Propongo aplicarlo a las reuniones».',
    'Es lo primero sensato que leo hoy. Lo ha escrito una máquina.'],
];
async function mirarPortatil(api) {
  if (api.flag('ecosistema_portatil_cerrado')) { await api.say(['Cerrado. Por primera vez desde las seis.', 'Se oye la moqueta.']); return; }
  if ((api.flag('portatil_tadeo_n') || 0) === 0) await api.say(['El portátil de Tadeo, de Negocio. Se fue a las seis.', 'Su portátil, no.']);
  const n = api.inc('portatil_tadeo_n');
  const k = (n - 1) % PORTATIL.length;
  await api.say(PORTATIL[k]);
  if (k === 3 && api.flag('ruben_encontrado')) {
    await api.say(['Contesta el Titulator: «Lo sé. Me lo ha contado ella. Se llama Rubén».',
      'Tadeo no lo ha leído. Yo sí.']);
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

// ---------------------------------------------------------------- §3.2 el aro de luz de Borja (objeto `aro_borja`)
const ARO_PROGRAMADO = [
  'En pantalla: «Programado: lunes, 9:00. Feliz lunes, [NOMBRE].»',
  'En pantalla: «Programado: viernes. Cerramos semana con [LOGRO].»',
  'En pantalla: «Programado: domingo. Desconectar también es [VALOR].»',
];
async function mirarAro(api) {
  if (!api.flag('aro_borja_mirar_n')) {
    api.inc('aro_borja_mirar_n');
    await api.say(['Un aro de luz con el móvil de Borja. Borja se fue a las seis.',
      'El móvil no. Tiene publicaciones programadas hasta el lunes.']);
    return;
  }
  // §3.1 (B3): nada de la opa, la pieza ni la página 7 antes de `pagina_cerrada`
  if (api.flag('pagina_cerrada') && api.once('aro_borja_pagina')) {
    api.sfx('beep');
    await movil(api, 'Publicando: Exclusiva en la página 7, por [NOMBRE]. Emoji de fuego.');
    await api.say('Mi primera firma en redes. Sin mi nombre. Con buena luz.');
    return;
  }
  const n = api.inc('aro_borja_mirar_n');
  await api.say(ARO_PROGRAMADO[(n - 2) % ARO_PROGRAMADO.length]);
}
async function hablarAro(api) {
  const n = api.inc('aro_borja_hablar_n');
  if (n === 1) {
    await api.say('¿Hola?');
    await movil(api, 'Publicando: «¿Hola?». Emoji de fuego.');
    await api.say('Me ha publicado un hola.');
  } else if (n === 2) {
    await api.say('Deja de publicar lo que digo.');
    await movil(api, 'Publicando: «Deja de publicar lo que digo». Emoji de fuego.');
  } else {
    // (Bruno abre la boca. No dice nada. Silencio de 1,5 s.)
    await api.anim('bruno', 'talk', 450);
    await api.wait(1050);
    await movil(api, 'Publicando: [SILENCIO INCÓMODO]. Emoji de fuego.');
  }
}
const aroObjeto = {
  id: 'aro_borja', name: 'aro de luz de Borja', color: '#4FD8E8', murmurColor: '#4FD8E8',
  // §3.2: la cola de ambiente de la sala (uno por visita; el motor no los dice encima de nadie)
  murmurs: ['Publicando: Viernes noche y aquí seguimos. Emoji de fuego.',
    'Publicando: ¿Sabías que [DATO]? Comenta abajo. Emoji de ojos.',
    'Publicando: Orgulloso de mi equipo: [AÑADIR EQUIPO]. Emoji de fuego.'],
  handlers: {
    mirar: mirarAro,
    hablar: hablarAro,
    usar: async (api) => {
      if (api.once('aro_borja_usado')) {
        await api.say('Me pongo delante. El aro me ilumina. Salgo favorecido por primera vez.');
        await movil(api, 'Publicando: Damos la bienvenida a [NOMBRE]. Emoji de aplausos.');
      } else await movil(api, 'Publicando: [NOMBRE], otra vez. Emoji de aplausos.');
    },
    coger: 'No. Si lo cojo, publica que me lo llevo. Con buena luz.',
    empujar: async (api) => { api.sfx('step'); await movil(api, 'Publicando: Movimiento en la oficina. Emoji de cohete.'); },
    cerrar: async (api) => {
      await movil(api, 'Publicando: Nos vamos. Volvemos en cinco minutos. Emoji de fuego.');
      await api.say('Sigue encendido. Lo de «faltan cinco minutos» se lo ha copiado a Pilar.');
    },
    'usar:movil': async (api) => { api.sfx('click'); await movil(api, 'Publicando: Alguien me hace una foto. Emoji de cámara.'); },
    'dar:album_eventos': async (api) => { await movil(api, 'Publicando: Recuerdos de [EVENTO]. Emoji de lágrima.'); },
    'dar:*': async (api) => { await movil(api, 'Publicando: Abrimos la caja de [OBJETO]. Emoji de caja.'); },
  },
};

// ---------------------------------------------------------------- §4.4 el monitor de Comercial (`pantalla_comercial`)
const pantallaObjeto = {
  id: 'pantalla_comercial', name: 'monitor de Comercial', color: '#FF8A60', state: 'normal', states: ['normal', 'video'],
  handlers: {
    mirar: async (api) => {
      const n = api.inc('pantalla_comercial_n');
      if (n === 1) {
        await api.detalle({ titulo: 'LA PORTADA, SEGÚN COMERCIAL', w: 180, h: 90, draw: portadaComercial }, async (api) => {
          await api.say(['La portada de la web, en el monitor de Maripaz.',
            'Un anuncio. Otro. Un vídeo. Una línea de noticia. Otro anuncio.']);
        });
      } else await api.say('La línea de noticia tiene un pósit al lado: «Se ve demasiado».');
    },
    usar: async (api) => {
      api.setState('pantalla_comercial', 'video');
      try {
        api.sfx('beep');
        await video(api, '¡COLCHONES SIESTATÓN! ¡DUERMA COMO NUNCA!');
        await api.say('Lo silencio. Se vuelve a poner. Tiene más iniciativa que yo.');
      } finally { api.setState('pantalla_comercial', 'normal'); }
    },
    cerrar: 'Busco la X del vídeo. Es un píxel. Le doy. Se abre otro vídeo.',
    hablar: 'Le digo «para». Lo entiende como «reproducir».',
    coger: 'Es de Comercial. Si lo toco, me lo cobran como clic.',
  },
};

// Maripaz: en Marketing y Comercial en el Acto I y tras ganar D1 (en el Acto II, hasta D1, está en la Sala Amazonas)
const maripazAqui = (api) => { const p = api.actorPos(MARIPAZ); return !!(p && p.room === 'ecosistema' && api.isVisible(MARIPAZ)); };
/** Maripaz contesta si está (`con`: su línea); si no, la de Bruno (`sin`). */
async function mp(api, con, sin) {
  if (maripazAqui(api)) await sayM(api, con); else await api.say(sin);
}

// §4.2.4 · el anuncio antes de entrar: Maripaz se planta delante con el anuncio; cuenta atrás de 5 s que un clic no
// salta (Esc y el modo rápido, sí); «Se llama interstitial. Son ingresos.»
async function anuncioAntesDeEntrar(api) {
  api.setFlag('ecosistema_interstitial', true);
  await api.cutscene(async () => {
    const b = api.actorPos('bruno'), m = api.actorPos(MARIPAZ);
    const lado = m.x >= b.x ? 1 : -1;
    const v = api.game && api.game.actors && api.game.actors[MARIPAZ];
    const v0 = v && v.speed;
    const casa = [m.x, m.y];
    try {
      if (v) v.speed = v0 * 2.6;                         // tiene prisa: es un anuncio
      await api.walkActor(MARIPAZ, Math.round(b.x + lado * 30), Math.round(Math.max(110, b.y)));
      api.faceActor(MARIPAZ, 'bruno');
      api.face(lado > 0 ? 'right' : 'left');
      await sayM(api, 'Bienvenido a Comercial. Podrás pasar en cinco segundos.');
      // (la cuenta atrás; Bruno espera; mira al techo)
      api.face('up');
      await api.detalle({ titulo: 'ANUNCIO', w: 280, h: 104, oscurecer: 0.85, draw: interstitialComercial, ms: 5600,
        cuenta: { ms: 5000, texto: 'Podrá continuar en {n}', fin: 'Saltar anuncio ›' } });
      api.face(lado > 0 ? 'right' : 'left');
      await api.say('¿Qué ha sido eso?');
      await sayM(api, 'Un anuncio antes de entrar. Se llama interstitial. Son ingresos.');
      gong(api);
      await api.walkActor(MARIPAZ, casa[0], casa[1]);
    } finally {
      if (v) v.speed = v0;
      api.placeActor(MARIPAZ, 'ecosistema', casa[0], casa[1], 'left');
    }
  });
}

// «Usar cualquier papel» con la impresora (§3.7)
const PAPELES = ['fotocopia_nota_direccion', 'mensaje_fp', 'pieza_opa', 'ficha_pagina_7', 'ticket_n1', 'acta_reunion', 'album_eventos', 'correo_evaristo'];
const impresoraPapel = Object.fromEntries(PAPELES.map(i => ['usar:' + i, '«ATASCO EN BANDEJA 2». Le da igual lo que le dé.']));

export default buildRoom({
  id: 'ecosistema',
  name: 'Marketing y Comercial',
  music: 'm_ecosistema',
  flags: {
    ecosistema_portatil_cerrado: 'bool · P4 · Cerrar portátil de Tadeo (Acto III) · P4 (Mirar portátil, impresora)',
    ecosistema_pufs_n: 'int · P4 · ecosistema · +1 por Usar pufs · P4',
  },

  objects: [
    { id: 'ecosistema_a_pecera', name: 'escalera a la Redacción', exit: { room: 'pecera', tipo: 'escalera' }, handlers: {
      mirar: 'La escalera de bajada. A Redacción, donde la moqueta es de verdad.',
      usar: async (api) => { api.sfx('step'); await api.goto('pecera', 'ecosistema'); },
      // E2 §6 L36
      empujar: 'Empujar una escalera es bajar sin decidirlo. Aquí se decide todo en trimestres.',
    } },
    ascensorObjeto('ascensor_ecosistema', {
      mirar: async (api) => api.say(['El ascensor. Marketing le ha puesto pufs delante.', 'Para que la gente no se vaya. Que se «ubique».']),
      cerrar: 'Se cierra solo. Es lo único de la planta que no pide feedback.',
      empujar: 'No se empuja. Se activa. Lo dice el vinilo.',
      tirar: 'Tiro de la puerta. El móvil de Borja lo publica: «Abriendo caminos».',
      hablar: async (api) => {
        if (maripazAqui(api)) await api.say('«¿Bajas?». Hace «tin». Maripaz quiere ponerle un anuncio al «tin».');
        else await api.say('«¿Bajas?». Hace «tin». Es la conversación más barata de la planta.');
      },
    }),
    // ---- la puerta de EVENTOS (Sala Polivalente)
    { id: 'ecosistema_a_eventos', name: 'puerta de Eventos', exit: { room: 'eventos', tipo: 'puerta_doble' }, handlers: {
      mirar: async (api) => api.say(['La puerta de Eventos. Por la rendija salen focos, un gong y prisa.',
        'Encima, un piloto verde: «PRÓXIMO EVENTO: 5 MIN». No se apaga nunca.']),
      usar: async (api) => { api.sfx('door'); await api.goto('eventos', 'ecosistema'); },
      abrir: async (api) => { api.sfx('door'); await api.goto('eventos', 'ecosistema'); },
      cerrar: 'Ya está entornada. Más cerrada, Pilar lo llama «evento privado».',
      empujar: 'Empujo. Desde dentro: «¡Faltan cinco minutos!». Empujo con más respeto.',
      hablar: '«¿Se puede?». Contesta un walkie: «Con acreditación. Cambio».',
    } },
    aroObjeto,
    { id: 'embudo_marketing', name: 'embudo de Marketing', handlers: {
      mirar: async (api) => api.say(['Un embudo de Marketing: «VEN · MIRA · COMPARTE · ¿?».', 'El último paso es una interrogación. Es el único honesto.']),
      usar: 'Me meto en el embudo. Salgo por abajo convertido. En becario.',
      // E2 §3.3: lo que contestaba Borja lo publica ahora su móvil
      hablar: async (api) => { await api.say('¿Y qué hay al final del embudo?'); await movil(api, 'Publicando: ¿Qué hay al final del embudo? Emoji de embudo.'); },
      coger: 'Si lo descuelgo, el móvil de Borja lo publica. Con música triste.',
      empujar: 'Lo enderezo. Debajo, un pósit de Borja: «Torcido convierte más».',
    } },
    // estados: 'desplegado' / 'enrollado' (Empujar lo enrolla; Tirar lo sube; al volver, Maripaz ya lo ha desplegado)
    { id: 'rollup_comercial', name: 'roll-up de Comercial', state: 'desplegado', states: ['desplegado', 'enrollado'], handlers: {
      mirar: async (api) => api.say(['Un roll-up: «SU ANUNCIO AQUÍ». Y la extensión de Maripaz, en grande.', 'Lleva aquí tanto tiempo que ya se anuncia a sí mismo.']),
      usar: async (api) => {
        if (!maripazAqui(api)) { await api.say('Me pongo delante. Soy el anuncio. Nadie me contrata.'); return; }
        await api.say('Me pongo delante del roll-up.');
        await sayM(api, 'Ahora tú eres el anuncio, cariño. Te cobro el metro cuadrado.');
      },
      empujar: async (api) => {
        api.setState('rollup_comercial', 'enrollado'); api.sfx('whoosh');
        await mp(api, 'Eso es una baja de campaña, cariño. Te la facturo.', 'Se enrolla sin factura. Lo disfruto.');
      },
      coger: async (api) => { await mp(api, 'El roll-up no se toca. Está contratado hasta 2030.', 'Contratado hasta 2030. Lo pone abajo, en pequeño.'); },
      tirar: async (api) => { api.setState('rollup_comercial', 'desplegado'); await api.say('Tiro de la lona. Sube como una persiana con objetivos.'); },
    } },
    { id: 'termometro_ventas', name: 'termómetro de ventas', handlers: {
      mirar: async (api) => api.say(['Un termómetro pintado a rotulador: «OBJETIVO Q3». Rojo hasta el 97 %.', 'El 3 % que falta se lo lleva el gong de al lado.']),
      usar: async (api) => { await api.say('Le pinto un poquito más de rojo.'); await mp(api, 'Eso no es una venta. Es una ilusión. Y no la facturo.', 'Rojo hasta el 98 %. Nadie lo nota. Ni las ventas.'); },
      empujar: 'Si lo empujo, sube la temperatura. No las ventas.',
      coger: 'Es la única cosa de la planta que sube sola. No lo toco.',
      hablar: async (api) => { await api.say('¿Cuándo llegas al cien?'); await mp(api, 'Cuando la noticia ocupe una línea. Vamos por dos.', 'No contesta. Le falta el 3 %. A mí, el contrato.'); },
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
      hablar: async (api) => {
        if (maripazAqui(api)) await api.say('Le leo el lema en voz alta. Maripaz asiente y le busca hueco a un banner.');
        else await api.say('Le leo el lema en voz alta. Suena a anuncio.');
      },
    } },
    pantallaObjeto,
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
        else await api.say('Sigue ahí. Nadie la pisa. Aquí todo el mundo mira dónde pone el pie.');
      },
      coger: async (api) => { await mp(api, '¡Deja eso! Lleva un adhesivo de patrocinio. Por debajo.', 'Mejor la dejo. Alguien la ha puesto con mucha planificación.'); },
      empujar: 'La aparto con el pie. Aquí no se cae nadie: aquí la gente se jubila.',
      usar: 'No. Yo quiero una plaza de bici. Y por las buenas.',
      hablar: 'Le pregunto a quién espera. El pósit lo dice todo.',
    } },
  ],

  actors: [
    // §4.4: en Marketing y Comercial en el Acto I y tras ganar D1 (en el Acto II, hasta D1, está en la Sala Amazonas).
    // Sus murmullos son los de actors.js (E2 §4.4).
    { id: MARIPAZ, when: (api) => !api.flag('acto_2_iniciado') || !!api.flag('casilla_hueco'),
      handlers: {
        mirar: async (api) => { await api.say(['Maripaz, Comercial. Lleva el mazo del gong como otros el bolso.', 'La funda del móvil lleva anuncio.']); },
        hablar: async (api) => api.dialog('maripaz'),
        usar: async (api) => { await api.say('Le toco el hombro.'); await sayM(api, 'Has hecho clic en un anuncio. Ahora te sigo toda la noche.'); },
        coger: async (api) => { await sayM(api, 'A mí no se me coge. Se me contrata. Por impresiones.'); },
        empujar: async (api) => {
          if (api.inc('maripaz_empujon_n') === 1) { gong(api); await sayM(api, 'Uy. Eso en la web se llama «interacción». Te la facturo.'); }
          else await sayM(api, 'Segunda interacción: tarifa plana. Ya puedes empujar lo que quieras.');
        },
        'dar:cafe': async (api) => { await sayM(api, '¿Café? Te lo patrocino: «Despertar, con Cafés Madrugón». El vaso ya es soporte.'); },
        'dar:tarjeta_becario': async (api) => { await sayM(api, '¿«Pellizco»? Eso no es un nombre, cariño. Es un formato publicitario.'); },
        'dar:ficha_pagina_7': async (api) => {
          if (api.flag('casilla_hueco')) await sayM(api, 'Ya te he firmado. Firmar dos veces es un contrato de permanencia.');
          else await sayM(api, 'Una ficha sin hueco. El hueco lo tengo yo. En la Sala Amazonas.');
        },
        'dar:pieza_opa': async (api) => { await sayM(api, '¿Toda esta noticia sin un anuncio en medio? Se ve demasiado.'); },
        'dar:acta_reunion': async (api) => { await sayM(api, '¿Un acta? Con un banner arriba sería rentable. Por primera vez.'); },
        'dar:correo_evaristo': async (api) => { await sayM(api, '¿Evaristo? Me revisa los contratos. Por él cobro lo pactado. Qué pena.'); },
        'usar:movil': async (api) => { await sayM(api, 'Si me fotografías, cobro por impresión.'); },
        'dar:*': async (api) => { await sayM(api, 'Si no lleva logo, no lo cojo. Y si lo lleva, lo cobro.'); },
      } },
  ],

  dialogs: dialogos,
  scenes: {},
  defaults: {},
  // §4.4: tras D1, Maripaz llama a Siestatón desde su mesa (una vez, cuando el motor encuentre hueco)
  ambient: [{ id: 'maripaz_siestaton', if: 'casilla_hueco', voces: { M: 'maripaz_remitido' },
    discusiones: [[['M', '¿Siestatón? Os paso a la web. Con un vídeo que se pone solo.']]] }],

  async onEnter(api) {
    // el roll-up enrollado no dura: al volver a la planta, Maripaz ya lo ha desplegado (también al cargar)
    if (api.getState('rollup_comercial') === 'enrollado') api.setState('rollup_comercial', 'desplegado');
    if (api.getState('pantalla_comercial') === 'video') api.setState('pantalla_comercial', 'normal');
    if (api.restoring) return;
    if (!api.flag('acto_2_iniciado') && api.once('ecosistema_entrada_1830')) {
      await api.say('La planta 2 a las seis y media: moqueta, pufs y nadie. Y un gong, detrás.');
    }
    // §4.2.4: el anuncio antes de entrar, una vez, la primera vez que Maripaz está en la planta
    if (maripazAqui(api) && !api.flag('ecosistema_interstitial')) { await anuncioAntesDeEntrar(api); return; }
    // §4.4: la silla 113 (pago del micropuzle de Pilar), una vez, con Maripaz delante
    if (api.flag('eventos_silla_devuelta') && maripazAqui(api) && api.once('ecosistema_silla_113')) {
      await sayM(api, 'Me has devuelto la silla. Ya le he puesto un anuncio en el respaldo.');
    }
  },
}, art);
