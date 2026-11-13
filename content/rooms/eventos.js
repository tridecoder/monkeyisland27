// SALA `eventos` — LA SALA POLIVALENTE (Eventos, planta 2). LÓGICA. Dueño: paquete D. Adenda §13 (Pilar Escaleta) y
// §13.4-13.6 (sala propia de Eventos, encargo de dirección). El arte y la geometría están en ./art/eventos.art.js; el
// árbol de Pilar en ./eventos.dialogos.js.
//
// Se entra (y se sale) por la puerta del Ecosistema (`ecosistema_a_eventos` ↔ `eventos_a_ecosistema`); el ascensor
// sigue llegando al Ecosistema. Lo que era de Eventos en el Ecosistema vive aquí con sus mismos ids y líneas:
// `photocall`, `aro_luz`, `cajas_lanyards`, `gong`, `album_eventos_hotspot`, Pilar y el ¡FLASH! de entrada.
// Gags nuevos (adenda §13.5): la cuenta atrás clavada en 00:05:00 (por actos; paga en los créditos), las sillas
// (112 → 113 → crisis de Pilar → micro-puzle opcional: devolver la silla de Comercial → croqueta), la lista de
// acreditados cada vez más absurda (por actos), el evento del que nadie sabe el tema (Pilar, atril, pancarta).
import { buildRoom } from '../lib/room.js';
import art from './art/eventos.art.js';
import dialogos from './eventos.dialogos.js';
import { flash, gong, SFX, rota } from '../escenas/planta_noble.js';

const MARIPAZ = 'maripaz_remitido', PILAR = 'pilar_escaleta';
const sayP = (api, t) => api.sayAs(PILAR, t);
const sayM = (api, t) => api.sayAs(MARIPAZ, t);
const acto = (api) => (api.flag('acto_3_iniciado') ? 3 : api.flag('acto_2_iniciado') ? 2 : 1);
const crisis = (f) => (f('ecosistema_sillas_n') || 0) >= 1 && !f('eventos_silla_devuelta');

// ¡GONG! (adenda §13.3): es de Eventos. Maripaz no está en la sala, pero el dinero tiene buen oído: contesta desde
// Comercial, al otro lado de la puerta (su voz llega arriba, sin globo sobre nadie).
async function golpeGong(api) {
  const n = rota(api, 'ecosistema_gong_n');
  gong(api);
  if (n === 0) {
    await api.say('¡GOOONG! La planta entera aplaude: creen que he vendido algo.');
    await sayP(api, '¡Ese gong es de Eventos! ¡Y aún faltan cinco minutos!');
    await sayM(api, 'Si suena, cariño, yo facturo. Es el acuerdo.');
    await api.say('Lo ha oído desde Comercial. El dinero tiene muy buen oído.');
  } else {
    await api.say('¡GOOONG! Esta vez aplaude menos gente. El mercado se satura.');
    await sayM(api, 'Otro, cariño. A la tercera te hago una factura proforma.');
  }
}

// ¡FLASH! al entrar: lo dispara el photocall de Eventos y Pilar acredita al que llega (rota en orden)
const ENTRADAS = ['¡Acreditado! Empezamos en cinco minutos.', '¡Foto de entrada hecha! Cinco minutos y empezamos.',
  'Uno más. Ya sois tres. Eso es un evento. ¡Acreditación!', '¡Flash! Para el álbum. Y para el seguro.'];

// Lista de acreditados (Mirar mesa_acreditaciones): crece por actos y se lee en orden.
const LISTA = [
  [1, '«Cola de la máquina de café: doce personas y una máquina».'],
  [1, '«El ascensor. Tres veces. Con acompañante: el hilo musical».'],
  [1, '«Gertrudis, máquina de café. Acceso total. Ya lo tenía».'],
  [2, '«La impresora de la tercera. Con su bandeja 2». La bandeja no consta.'],
  [2, '«Piel de plátano, plaza 7. Asistencia: por confirmar».'],
  [3, '«Titulator 3000: DENEGADA. Motivo: trae su propio atún».'],
  [3, '«El chico del táper. Acreditado desde 2021. Sale en todas las fotos».'],
];
async function mirarLista(api) {
  const disp = LISTA.filter(([a]) => a <= acto(api));
  const n = api.inc('eventos_lista_n'), max = api.flag('eventos_lista_max') || 0;
  let i = (n - 1) % disp.length;
  if (max < disp.length) { i = max; api.setFlag('eventos_lista_max', max + 1); }   // lo nuevo de cada acto, primero
  if (n === 1) await api.say('La mesa de acreditaciones. Hay una lista pegada con cinta.');
  await api.say(disp[i][1]);
  if (i === LISTA.length - 1) await api.say('Al final, a boli: «Bruno. Acceso: hasta el canapé». Subrayado.');
}

// La silla 113 (micro-puzle opcional, no toca el grafo principal): mirarla descubre la pegatina de Comercial;
// devolverla (Usar / Coger / Empujar, ya sabiendo de quién es) cierra la crisis de Pilar y trae la croqueta.
async function devolverSilla(api) {
  await api.say('Es de Comercial. Se la devuelvo a Maripaz, que es de donde ha venido.');
  api.sfx(SFX.sillas);
  api.setFlag('eventos_silla_devuelta', true);
  await api.wait(400);
  await sayP(api, ['Ciento diez, ciento once... ciento doce.', '¡CIENTO DOCE! ¡Vuelvo a ser persona!']);
  await sayP(api, 'Bruno, eso merece algo. Toma: una croqueta antes de las 21:05.');
  await api.say('Está fría.');
  await sayP(api, 'Es una crisis de reputación. Pero es nuestra.');
  api.setFlag('eventos_croqueta', true);
}
async function tocarSilla(api) {
  if (api.flag('eventos_silla_mirada')) { await devolverSilla(api); return; }
  await api.say('La pongo recta en su cruz.');
  await sayP(api, 'Ciento doce... ciento trece. ¡No es la postura, es la silla!');
}

export default buildRoom({
  id: 'eventos',
  name: 'Eventos',
  music: 'm_eventos',
  flags: {
    eventos_tema_n: 'int · D · eventos · +1 por «¿Y de qué va el evento?» (escala)',
    eventos_lista_n: 'int · D · eventos · +1 por Mirar mesa_acreditaciones (rota la lista)',
    eventos_lista_max: 'int · D · eventos · entradas de la lista ya leídas (las nuevas de cada acto salen antes)',
    eventos_silla_mirada: 'bool · D · eventos · Mirar silla_torcida (descubre la pegatina de Comercial)',
    eventos_reloj_n: 'int · D · eventos · +1 por Mirar cuenta_atras',
  },

  objects: [
    { id: 'eventos_a_ecosistema', name: 'puerta a Marketing', exit: { room: 'ecosistema', tipo: 'puerta_doble' }, handlers: {
      mirar: 'La puerta a Marketing y Comercial. Por la rendija entra luz lila y sale el gong.',
      usar: async (api) => { api.sfx('door'); await api.goto('ecosistema', 'eventos'); },
      abrir: 'Está entornada. Pilar la deja así: «para que fluya el público».',
      cerrar: async (api) => { await sayP(api, '¡No! Una puerta cerrada es un evento privado. Y no hay presupuesto.'); },
      empujar: 'La empujo. Pilar me acredita al salir. Y al volver, por si acaso.',
      hablar: '«¿Hay alguien?». Desde Comercial: «Depende de lo que pagues, cariño».',
    } },
    // ---- de Eventos, traídos del Ecosistema con sus ids y líneas intactas (adenda §13.3)
    { id: 'photocall', name: 'photocall', handlers: {
      mirar: 'Treinta logos y un hueco en medio: «Espacio premium para tu cara».',
      usar: async (api) => {
        await api.say('Me pongo en el hueco.');
        await flash(api);
        await sayP(api, '¡Foto de acreditación! Ya constas en un evento.');
      },
      coger: '¿Me llevo el photocall? Sin él, Eventos dejaría de existir.',
      empujar: 'Si se cae el photocall, la planta 2 no ha ocurrido nunca.',
      hablar: 'Le hablo al photocall. Treinta logos me escuchan. Ninguno paga.',
      'usar:tarjeta_becario': async (api) => {
        await api.say('Pongo mi tarjeta en el hueco. «Bruno Pellizco», premium.');
        await flash(api);
        await sayP(api, '«Pellizco», acreditado. Con foto. Acceso: hasta el canapé.');
      },
      // nuevo (§13.5)
      'usar:album_eventos': async (api) => {
        await api.say('Pongo el álbum en el hueco. Al fondo de la foto, el chico del táper.');
        await flash(api);
        await sayP(api, 'Una foto de un álbum de fotos. Eso ya es un archivo. ¡Acreditado!');
      },
    } },
    { id: 'aro_luz', name: 'aro de luz', handlers: {
      mirar: 'Un aro de luz. Te pone cara de haber dormido. Mentira institucional.',
      usar: 'Me pongo delante. Por fin parezco alguien con contrato.',
      coger: 'Si me lo llevo, mañana en la Pecera se nos ven las ojeras de verdad.',
      cerrar: 'Ya está apagado. Solo se enciende cuando hay alguien importante. Nunca.',
      abrir: 'Es un aro. No tiene por dónde. Por eso le cabe todo el mundo.',
    } },
    { id: 'album_eventos_hotspot', name: 'álbum de Eventos', when: '!oyo_descopear', handlers: {
      mirar: async (api) => {
        await api.say(['El álbum de Eventos. En todas las fotos sale al fondo un chico pálido.',
          'Siempre yendo al baño. Con un táper. Pilar lo llama «el extra».']);
      },
      coger: async (api) => {
        if (api.flag('ruben_encontrado')) await api.say('Mejor se lo pido a Pilar. Lo tiene acreditado. Con foto.');
        else await sayP(api, '¡Eh! Ese álbum está acreditado. Pídemelo con un motivo.');
      },
      abrir: 'Lo abro por la cena de Navidad. Al fondo, el chico pálido. Con táper.',
      usar: 'Paso páginas. Photocall, canapé, chico pálido. Photocall, canapé, chico.',
    } },
    { id: 'cajas_lanyards', name: 'cajas de lanyards', handlers: {
      mirar: 'Lanyards de Eventos. Para acreditar dos veces a la ONU.',
      coger: 'Si me pongo uno más, Pilar me cuenta como asistente.',
      abrir: 'Dentro, más lanyards. Y debajo, tazas con logo. Es un ecosistema.',
      usar: 'Me acredito a mí mismo. Me lo deniego. Tengo criterio.',
      empujar: 'No se mueven. Pesan más que mi currículum. Literalmente.',
    } },
    { id: 'gong', name: 'gong', handlers: {
      mirar: 'El gong de Eventos: suena para empezar. Maripaz lo usa por cada venta.',
      usar: golpeGong,
      empujar: golpeGong,
      coger: async (api) => { await sayP(api, 'El gong no se mueve. Tiene la marca de cinta en el suelo.'); },
      hablar: 'Le digo algo bonito al gong. No suena. Solo suena por dinero.',
      tirar: 'Se balancea. Maripaz me mira como a un cliente moroso.',
    } },
    // ---- nuevos de la Sala Polivalente (§13.5)
    { id: 'focos', name: 'focos', handlers: {
      mirar: async (api) => api.say(['Una barra de focos. Dos parpadean. Pilar dice que es «ambiente».',
        'El tercero parpadea desde la cena de Navidad. Ya es de la plantilla.']),
      usar: 'No llego. Los focos solo los toca Pilar. Con escalera acreditada.',
      coger: 'Si me llevo un foco, la Redacción me verá por fin. No estoy preparado.',
      tirar: async (api) => { await api.say('Tiro de un cable. Parpadean todos a la vez.'); await sayP(api, '¡Eso! ¡Eso es ambiente!'); },
      hablar: 'Le pido al foco que deje de parpadear. Parpadea dos veces: es un no.',
    } },
    { id: 'cuenta_atras', name: 'cuenta atrás', handlers: {
      mirar: async (api) => {
        const n = api.inc('eventos_reloj_n'), a = acto(api);
        if (a === 1) await api.say(n === 1 ? ['Una cuenta atrás: 00:05:00. No se mueve.', 'Todos los relojes de la casa marcan las 20:59. Este, cinco minutos.']
          : 'Sigue en 00:05:00. Pilar dice que así nadie llega tarde. Funciona: nadie llega.');
        else if (a === 2) await api.say(['00:05:00. Juraría que he visto un 04:59.', 'Pilar le ha dado un golpe con la escaleta. Ha vuelto a 05:00.']);
        else await api.say(['00:05:00. Mientras el edificio arde, aquí siempre faltan cinco minutos.', 'Es lo más estable de la casa. El CLS de Tadeo lo envidia.']);
      },
      usar: 'Busco el botón de empezar. Solo hay uno, y pone «+5 MIN».',
      coger: 'Está pegada con cinta americana. A la pared y al tiempo.',
      tirar: 'Está pegada con cinta americana. A la pared y al tiempo.',
      hablar: async (api) => { await api.say('«¿Cuánto falta?».'); await sayP(api, '¡Cinco minutos! ...Perdona, creía que me hablabas a mí.'); },
      'usar:movil': 'Le hago una foto. En el móvil también pone 00:05:00. Se contagia.',
    } },
    { id: 'pancarta_evento', name: 'pancarta', handlers: {
      mirar: async (api) => api.say(['Una pancarta: «BIENVENIDOS A». El nombre, tapado con cinta americana.',
        'Debajo de la cinta, otra cinta. Es cinta hasta el fondo.']),
      tirar: 'Despego una esquina. Debajo pone «POR CONFIRMAR». La vuelvo a pegar.',
      usar: 'Despego una esquina. Debajo pone «POR CONFIRMAR». La vuelvo a pegar.',
      coger: 'La pancarta se queda. Es lo único confirmado del evento: «BIENVENIDOS».',
      hablar: '«Bienvenidos a...». Ni la pancarta lo sabe. Pero lo dice con ilusión.',
    } },
    { id: 'atril', name: 'atril', handlers: {
      mirar: async (api) => api.say(['Un atril con micro. Encima, el discurso: «Buenas noches y bienvenidos a...».',
        'Ahí se acaba. Lleva así desde 2019, esperando un sustantivo.']),
      usar: async (api) => { await api.say('«Buenas noches y bienvenidos a...».'); await sayP(api, '¡Aún no! ¡Faltan cinco minutos! ...Pero muy bien proyectado.'); },
      hablar: async (api) => { await api.say('«Sí, sí, probando». El micro me devuelve un eco.'); await sayP(api, '¡Probando, cambio! Se te oye en Comercial.'); },
      coger: 'Si me llevo el atril, empiezo yo el evento. Y no sé de qué va.',
      empujar: 'No. Tiene su cruz de cinta. Y Pilar tiene memoria fotográfica de cruces.',
      'usar:ficha_pagina_7': 'Leo la ficha desde el atril: tres casillas. Ovación de ciento doce sillas.',
      'usar:libreta_replicas': 'Ensayo réplicas en el atril. El eco me las devuelve mejoradas.',
    } },
    { id: 'sillas_evento', name: 'sillas', handlers: {
      mirar: async (api) => {
        if (api.flag('eventos_silla_devuelta')) { await api.say(['Todas en su cruz. Ciento doce, según el plano.', 'Pilar respira en mayúsculas.']); return; }
        const a = acto(api);
        if (a === 1) await api.say(['Filas de sillas, cada una en su cruz de cinta. Cuento cincuenta y seis.', 'Pilar dice que son ciento doce. Las otras están «en el plano».']);
        else if (a === 2) await api.say(['Las sillas. Una sobresale por la derecha.', 'Pilar la mira de reojo cada cinco minutos.']);
        else await api.say('Ciento doce sillas para un evento sin tema. La ocupación media es Pilar.');
      },
      usar: async (api) => { await api.say('Me siento un momento en la última fila.'); await sayP(api, '¡Público! ¡Ya tenemos uno! Cuatro minutos y medio.'); await api.say('Me levanto. Vuelven a ser cinco.'); },
      coger: 'Si me llevo una, Pilar tendrá que contar hacia atrás. Y eso es el reloj.',
      empujar: 'No. Cada silla está en su cruz. Si muevo una, Pilar lo nota en el walkie.',
      hablar: '«¿Hay alguien?». Ciento doce sillas en silencio. El mejor público de la casa.',
      'dar:*': 'Si dejo algo en una silla, Pilar lo acredita como asistente.',
    } },
    { id: 'silla_reservado', name: 'silla con «RESERVADO»', handlers: {
      mirar: async (api) => api.say(['Un folio en una silla: «RESERVADO». Debajo, más pequeño: «Ponente».',
        '«Por confirmar». La silla lleva años confirmando que no viene nadie.']),
      usar: 'No me siento. Si me siento, me toca hablar. Y no sé de qué va.',
      coger: async (api) => { await sayP(api, '¡Esa no! Es la del ponente. El día que venga, que la encuentre.'); },
      hablar: 'Le pregunto al ponente si viene. El folio ni se mueve. Eso es un «ya veremos».',
      'usar:chaqueta_ramirez': 'La chaqueta de Ramírez reserva sillas sola. Pero esta ya está pillada.',
    } },
    { id: 'silla_torcida', name: 'silla torcida', when: '!eventos_silla_devuelta', handlers: {
      mirar: async (api) => {
        if (!api.flag('eventos_silla_mirada')) {
          api.setFlag('eventos_silla_mirada', true);
          await api.say(['Una silla torcida, fuera de su cruz de cinta. Saca una pata al pasillo.',
            'Debajo del asiento, una pegatina: «PROPIEDAD DE COMERCIAL. NO TOCAR, CARIÑO».']);
          if (crisis((k) => api.flag(k))) await api.say('La silla ciento trece. Tiene dueña.');
        } else await api.say('La silla de Comercial. Maripaz se la trajo para oír el gong sentada.');
      },
      usar: tocarSilla,
      empujar: tocarSilla,
      coger: async (api) => {
        if (api.flag('eventos_silla_mirada')) await devolverSilla(api);
        else await api.say('Antes miro de quién es. Aquí todo tiene dueño. Y acreditación.');
      },
      hablar: '«¿De quién eres?». La silla no contesta. Tiene contrato de confidencialidad.',
    } },
    { id: 'mesa_sonido', name: 'mesa de sonido', color: '#cfd8c8', murmurColor: '#cfd8c8',
      murmurs: ['WALKIE: Catering a Eventos: croquetas en posición. Cambio.', 'WALKIE: ¿Empezamos? ...Cambio. No. Cambio.',
        'WALKIE: Foco tres, deja de parpadear. Cambio. Foco tres no contesta.'],
      handlers: {
        mirar: async (api) => api.say(['La mesa de sonido. Doce faders y un pósit: «NO TOCAR. YA ESTÁ A 5 MIN».',
          'Al lado, el cargador. Cuatro walkies cargando. Uno dice «cambio» solo.']),
        usar: 'Subo un fader. Suena una freidora. Es el canal del catering.',
        tirar: 'Tiro de un cable. Se apaga el foco tres. Lo enchufo: sigue parpadeando.',
        hablar: async (api) => { await api.say('Cojo un walkie: «¿Hola?».'); await api.sayFrom('mesa_sonido', 'WALKIE: Cinco minutos. Cambio.'); },
        abrir: 'Abro la tapa del cargador. Pilas de 2009 y un caramelo. Cierro.',
        coger: 'Cojo un walkie. Pilar me lo quita sin mirar. Tiene seis acreditaciones.',
        'usar:movil': 'Conecto el móvil. Suena mi tono a todo volumen. Lo oyen ciento doce sillas.',
      } },
    { id: 'mesa_acreditaciones', name: 'mesa de acreditaciones', handlers: {
      mirar: mirarLista,
      usar: async (api) => { await api.say('Me pongo detrás de la mesa, a acreditar.'); await sayP(api, '¡Fuera de mi mesa! Acreditar es un oficio. Tiene escaleta.'); },
      coger: 'La mesa es de Eventos. Lo pone el mantel. Lo pone todo.',
      empujar: 'No se mueve. Está pegada al suelo con cinta. Es su marca.',
      'usar:tarjeta_becario': async (api) => { await api.say('Dejo mi tarjeta en la mesa.'); await sayP(api, '«Pellizco», otra vez. Te hago la segunda. Por si pierdes la primera.'); },
    } },
    { id: 'catering_croquetas', name: 'catering', handlers: {
      mirar: async (api) => {
        if (api.flag('eventos_croqueta')) { await api.say(['Falta una croqueta. Pilar ha tapado el hueco con cinta americana.', 'Ahí no ha pasado nada.']); return; }
        await api.say(['Una campana de catering con un cartel: «21:05». Debajo, croquetas.', 'Tienen su propio foco. Son las únicas que están listas.']);
      },
      abrir: async (api) => { await sayP(api, '¡Ni se te ocurra! A las 21:05. Ni un minuto antes. Ni cinco.'); },
      coger: async (api) => { await sayP(api, 'Las croquetas están acreditadas para las 21:05. Tú, para el canapé.'); },
      usar: async (api) => { await sayP(api, '¡Las 21:05! ¡Lo pone el cartel! ¡Y la escaleta! ¡Y mi alma!'); },
      hablar: 'Les susurro a las croquetas: «¿Falta mucho?». No contestan. Están en su papel.',
      'usar:cafe': async (api) => { await api.say('Dejo el café junto a la campana.'); await sayP(api, 'Café junto al catering. Eso ya es una pausa. ¡Apuntado!'); },
    } },
    { id: 'flight_cases', name: 'flight cases', handlers: {
      mirar: async (api) => api.say(['Flight cases de Eventos. Uno pone «FRÁGIL». Otro, «5 MIN».', 'Encima, un rollo de cinta. El de repuesto del de repuesto.']),
      abrir: 'Dentro: cinta americana, cinta americana y un rollo de cinta de emergencia.',
      empujar: 'Ruedan un palmo. Pilar los mira. Vuelven solos a su marca de cinta.',
      coger: 'Pesa como un evento entero. Que es justo lo que lleva dentro.',
      usar: 'Me subo a uno para ver el escenario. Desde arriba también faltan cinco minutos.',
    } },
    { id: 'marcas_cinta', name: 'marcas de cinta', handlers: {
      mirar: async (api) => api.say(['Cruces de cinta en el suelo. Una por silla, por atril y por persona.', 'Hay una con mi nombre. Pilar me ha marcado antes de que llegara.']),
      usar: 'Me pongo en mi marca. Por fin sé dónde tengo que estar.',
      coger: 'Despego una esquina. Pilar lo nota desde el photocall. La vuelvo a pegar.',
      tirar: 'Tiro de la cinta. Debajo sale otra. Esto es arqueología de eventos.',
      hablar: 'Le pregunto a mi cruz si me quedo. Las cruces no prometen nada.',
    } },
  ],

  actors: [
    { id: PILAR,
      // §13.2 (seis murmullos de siempre) + §13.5 (nuevos, según la crisis de la silla 113)
      murmurs: (view) => [
        'Cinco minutos. Siempre cinco minutos. Es mi zona horaria.', 'Ciento diez, ciento once, ciento doce... ¿Quién se ha sentado?',
        'Cinta en el suelo, cinta en el cable, cinta en el alma.', 'Tres en el ascensor. Eso ya es un evento. Sin acreditar.',
        'Si no hay croquetas, no es un evento. Es una reunión.', 'Aquí Eventos, cambio. Sí, a cinco minutos. Cambio y corto.',
        'Foco tres, me parpadeas. No, cambio, foco tres. Tú.', 'Ponente: por confirmar. Croquetas: confirmadísimas.',
        'Si alguien dice «empezamos ya», que me lo pase por escrito.',
        ...(crisis((k) => view.flag(k)) ? ['Ciento trece. Que alguien me diga que es una errata.', 'Una silla de más. Un asistente fantasma. Sin acreditar.'] : []),
        ...(view.flag('eventos_silla_devuelta') ? ['Ciento doce. Qué paz. Hasta el walkie suena más bajito.'] : []),
      ],
      handlers: {
        mirar: async (api) => api.say(['Pilar Escaleta, de Eventos. Cascos, walkie, escaleta y seis acreditaciones.',
          'En la muñeca, un rollo de cinta americana. Por si hay que acreditar algo.']),
        hablar: async (api) => api.dialog('pilar'),
        'dar:cafe': async (api) => { await sayP(api, 'Café sin catering es un café. Con catering, una pausa. Apuntado.'); },
        'dar:tarjeta_becario': async (api) => { await sayP(api, '«Pellizco». Te la repito bien: «Bruno. Acceso: hasta el canapé».'); },
        'dar:ficha_pagina_7': async (api) => { await sayP(api, '¿Una ficha con tres casillas? ¡Eso es una escaleta! Me encanta.'); },
        'dar:album_eventos': async (api) => { await sayP(api, 'Quédatelo hasta que acabes. Lo tengo apuntado: «Bruno, álbum, 19:40».'); },
        'usar:movil': async (api) => { await sayP(api, '¡Sin fotos sin acreditación! ...Bueno, una. Salgo mejor de perfil.'); },
        'dar:*': async (api) => { await sayP(api, 'Gracias. Lo acredito y lo pongo en la mesa de bienvenida.'); },
        empujar: 'No. Está contando sillas. Si la empujo, empieza otra vez.',
        coger: 'A Pilar no se la coge. Se la avisa con cinco minutos.',
        tirar: 'Le tiro del cable de los cascos. Me mira como a un micro que acopla.',
      } },
  ],

  dialogs: dialogos,
  scenes: {},
  defaults: {},
  ambient: [],

  async onEnter(api) {
    // ¡FLASH! al entrar (cada vez): el photocall de Eventos dispara y Pilar acredita al que llega. Cargar partida no es entrar.
    if (api.restoring) return;
    await flash(api);
    await sayP(api, ENTRADAS[(api.inc('ecosistema_entradas_n') - 1) % ENTRADAS.length]);
    if (api.once('eventos_primera_vez')) {
      await api.say(['La Sala Polivalente. Vale para todo.', 'Sobre todo, para estar a punto de empezar.']);
    }
  },
}, art);
