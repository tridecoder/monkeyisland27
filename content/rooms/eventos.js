// SALA `eventos` — LA SALA POLIVALENTE (Eventos, planta 2). LÓGICA. Adenda §13 (Pilar Escaleta) y §13.4-13.6 (sala
// propia de Eventos). El arte y la geometría están en ./art/eventos.art.js; el árbol de Pilar en ./eventos.dialogos.js.
//
// Se entra (y se sale) por la puerta del Ecosistema (`ecosistema_a_eventos` ↔ `eventos_a_ecosistema`); el ascensor
// sigue llegando al Ecosistema. Lo que era de Eventos en el Ecosistema vive aquí con sus mismos ids y líneas:
// `photocall`, `aro_luz`, `cajas_lanyards`, `gong`, `album_eventos_hotspot`, Pilar y el ¡FLASH! de entrada.
// [P12] guion nuevo, tanda 3 (docs/GUION_PROPUESTA_LIMPIO.md, «Eventos / Sala Polivalente», con [P14]): esta noche hay
// evento. Íñigo es el ponente (brindis del Plan Cero Papel, 21:05); desde el Acto II su rider deja la sala sin papel
// (pancarta tapada, la silla del ponente y la lista de acreditados sin folio), trae una trituradora y un pulsador rojo
// que «no está conectado a nada»; en el Acto III el álbum de los descartes espera en la boca de la trituradora (21:04).
// Las sillas: ciento doce en el plano, ciento once en la sala; la 112 (la cruz vacía de la última fila) está en el
// armario 27, debajo de Brais. Fuera la silla 113 de Comercial y su micropuzle (su croqueta, ahora, premia la 112).
import { buildRoom } from '../lib/room.js';
import art from './art/eventos.art.js';
import dialogos, { acto, presentado, encontrada, entradaActo3 } from './eventos.dialogos.js';
import { flash, gong, rota } from '../escenas/planta_noble.js';

const MARIPAZ = 'maripaz_remitido', PILAR = 'pilar_escaleta';
const sayP = (api, t) => api.sayAs(PILAR, t);
const sayM = (api, t) => api.sayAs(MARIPAZ, t);
// [P12] el recuento, al día: ciento once en la sala hasta encontrar la 112; ciento doce después
const sillas = (api) => (encontrada(api) ? 'ciento doce' : 'ciento once');
const Sillas = (api) => (encontrada(api) ? 'Ciento doce' : 'Ciento once');

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

// [P12] [P14] La lista de acreditados (Mirar mesa_acreditaciones). Acto I: la lista pegada con cinta (gana el ponente
// confirmado desde la presentación). Desde el Acto II, por el rider, no hay papel: Pilar se la sabe. Tras el álbum, un
// folio nuevo, el único papel de la sala. Cada entrada: [quién, líneas]; P = Pilar, B = Bruno.
const LISTA_I = [
  '«Cola de la máquina de café: doce personas y una máquina».',
  '«El ascensor. Tres veces. Con acompañante: el hilo musical».',
  '«Gertrudis, máquina de café. Acceso total. Ya lo tenía».',
];
const PONENTE = '«Ponente: Íñigo Sinergia. Confirmado». Subrayado tres veces.';
const SIN_LISTA = ['No hay lista. Era papel. Pilar se la sabe.', 'Queda un trozo de cinta con mi nombre: «Bruno. Hasta el canapé».'];
const TITULATOR = '«Titulator 3000: DENEGADA. Motivo: trae su propio atún».';
async function mirarLista(api) {
  const n = api.inc('eventos_lista_n'), a = acto(api);
  if (a === 1) {
    const L = presentado(api) ? [...LISTA_I, PONENTE] : LISTA_I;
    const i = (n - 1) % L.length;
    if (n === 1) await api.say('La mesa de acreditaciones. Hay una lista pegada con cinta.');
    await api.say(L[i]);
    if (i === L.length - 1) await api.say('Al final, a boli: «Bruno. Acceso: hasta el canapé». Subrayado.');
    return;
  }
  if (a === 2) { await api.say(SIN_LISTA); return; }
  const R = encontrada(api)
    ? [['B', ['Un folio nuevo, a boli: «Brais. Silla 112».', 'Es el único papel de la sala. Y la letra más grande.']], ['B', TITULATOR]]
    : [['B', SIN_LISTA], ['P', 'El extra: sin acreditar. No se sienta. Sale en todas las fotos.'], ['B', TITULATOR]];
  const [who, t] = R[(n - 1) % R.length];
  if (who === 'P') await sayP(api, t); else await api.say(t);
}

// El álbum de los descartes: en la mesa en los Actos I-II; en el Acto III, en la boca de la trituradora hasta que
// Pilar lo salva. Dos hotspots (dos sitios) con las mismas respuestas salvo «Coger».
const ALBUM = {
  mirar: async (api) => api.say(['El álbum de Eventos: los descartes. En todas sale alguien comiendo.',
    'Al fondo, siempre, un chico pálido con un táper. Pilar lo llama «el extra».']),
  abrir: 'Lo abro por la barbacoa de julio. Al fondo, el chico pálido. Con táper.',
  usar: 'Paso páginas. Photocall, canapé, chico pálido. Photocall, canapé, chico.',
};

// La trituradora (desde el Acto II) y el pulsador rojo del brindis (desde el Acto II, junto al atril)
const NO_TRITURO = 'No. Esto es lo único de papel que me ha salido bien.';
export default buildRoom({
  id: 'eventos',
  name: 'Eventos',
  music: 'm_eventos',
  flags: {
    eventos_tema_n: 'int · D · eventos · +1 por «¿Y de qué va el evento?» (escala)',
    eventos_lista_n: 'int · D · eventos · +1 por Mirar mesa_acreditaciones (rota la lista)',
    eventos_reloj_n: 'int · D · eventos · +1 por Mirar cuenta_atras',
    eventos_rider_oido: 'bool · [P12] · eventos · «¿Qué ha pedido el ponente?» (abre «¿Y sin papel…?»)',
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
      mirar: async (api) => {
        // [P12] un «Mirar» nuevo en el Acto II: cruza Eventos con la exclusiva sin decir nada de Íñigo
        if (acto(api) === 2) await api.say(['Treinta logos. Hidrovoltia, pegada al logo del Banco Robledal.', 'Pilar dice que lo pidieron ellos. Por escrito, y pagaron el suplemento.']);
        else await api.say('Treinta logos y un hueco en medio: «Espacio premium para tu cara».');
      },
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
      'usar:album_eventos': async (api) => {
        await api.say('Pongo el álbum en el hueco. Al fondo de la foto, el chico del táper.');
        await flash(api);
        await sayP(api, 'Una foto de un álbum de fotos. Eso ya es un archivo. ¡Acreditado!');
      },
    } },
    { id: 'aro_luz', name: 'aro de luz', handlers: {
      mirar: 'Un aro de luz. Te pone cara de haber dormido. Mentira institucional.',
      usar: 'Me pongo delante. Por fin parezco alguien con contrato.',
      coger: '¿Llevarme el aro de luz? Mañana la Redacción amanecería con su cara de verdad.',
      cerrar: 'Ya está apagado. Solo se enciende cuando hay alguien importante. Nunca.',
      abrir: 'Es un aro. No tiene por dónde. Por eso le cabe todo el mundo.',
    } },
    // [P12] el álbum, en la mesa de acreditaciones (Actos I-II)
    { id: 'album_eventos_hotspot', name: 'álbum de Eventos', when: '!acto_3_iniciado', handlers: {
      ...ALBUM,
      coger: async (api) => { await sayP(api, '¡Eh! Ese álbum está acreditado. Pídemelo con un motivo.'); },
    } },
    // [P12] … y en el Acto III, en la boca de la trituradora, hasta que Pilar lo salva
    { id: 'album_trituradora', name: 'álbum de Eventos', when: ['acto_3_iniciado', '!eventos_album_dado'], handlers: {
      ...ALBUM,
      coger: async (api) => { await sayP(api, '¡Quieto! Ese álbum tiene hora: 21:04.'); },
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
        else await api.say(['00:05:00. Pilar tiene el dedo encima del botón.', 'A las 21:00 piensa soltarlo.']);   // [P12]
      },
      usar: 'Busco el botón de empezar. Solo hay uno, y pone «+5 MIN».',
      coger: 'Está pegada con cinta americana. A la pared y al tiempo.',
      tirar: 'Está pegada con cinta americana. A la pared y al tiempo.',
      hablar: async (api) => { await api.say('«¿Cuánto falta?».'); await sayP(api, '¡Cinco minutos! ...Perdona, creía que me hablabas a mí.'); },
      'usar:movil': 'Le hago una foto. En el móvil también pone 00:05:00. Se contagia.',
    } },
    // [P12] la pancarta, con dos estados: el Acto I (antes y después de que Íñigo anuncie el brindis) y los Actos II-III
    { id: 'pancarta_evento', name: 'pancarta', handlers: {
      mirar: async (api) => {
        if (acto(api) >= 2) await api.say(['«BIENVENIDOS A». El resto, tapado con cinta otra vez.', 'La pancarta era de papel. El ponente, no.']);
        else if (presentado(api)) await api.say(['«BIENVENIDOS A LA PRESENTACIÓN DEL PLAN CERO PAPEL».', 'Pilar le ha quitado la cinta por primera vez. La pancarta parece asustada.']);
        else await api.say(['Una pancarta: «BIENVENIDOS A». El nombre, tapado con cinta americana.', 'Debajo de la cinta, otra cinta. Es cinta hasta el fondo.']);
      },
      tirar: async (api) => api.say(acto(api) >= 2 ? 'Despego una esquina. Debajo pone «CERO PAPEL». En papel. La vuelvo a pegar.' : 'Despego una esquina. Debajo pone «POR CONFIRMAR». La vuelvo a pegar.'),
      usar: async (api) => api.say(acto(api) >= 2 ? 'Despego una esquina. Debajo pone «CERO PAPEL». En papel. La vuelvo a pegar.' : 'Despego una esquina. Debajo pone «POR CONFIRMAR». La vuelvo a pegar.'),
      coger: 'La pancarta se queda. Es lo único confirmado del evento: «BIENVENIDOS».',
      hablar: '«Bienvenidos a...». Ni la pancarta lo sabe. Pero lo dice con ilusión.',
    } },
    { id: 'atril', name: 'atril', handlers: {
      mirar: async (api) => api.say(['Un atril con micro. Encima, el discurso: «Buenas noches y bienvenidos a...».',
        'Ahí se acaba. Lleva años esperando un sustantivo.']),
      usar: async (api) => { await api.say('«Buenas noches y bienvenidos a...».'); await sayP(api, '¡Aún no! ¡Faltan cinco minutos! ...Pero muy bien proyectado.'); },
      hablar: async (api) => { await api.say('«Sí, sí, probando». El micro me devuelve un eco.'); await sayP(api, '¡Probando, cambio! Se te oye en Comercial.'); },
      coger: 'Si me llevo el atril, empiezo yo el evento. Y no sé de qué va.',
      empujar: 'No. Tiene su cruz de cinta. Y Pilar tiene memoria fotográfica de cruces.',
      'usar:ficha_pagina_7': async (api) => api.say(`Leo la ficha desde el atril: tres casillas. Ovación de ${sillas(api)} sillas.`),
      'usar:libreta_replicas': 'Ensayo réplicas en el atril. El eco me las devuelve mejoradas.',
    } },
    // [P12] desde el Acto II, junto al atril: el «apagado simbólico» del brindis (no está conectado a nada)
    { id: 'pulsador_rojo', name: 'pulsador rojo', when: 'acto_2_iniciado', handlers: {
      mirar: 'Un pulsador rojo, gordo, en un pedestal. Pone «APAGADO».',
      usar: async (api) => { await sayP(api, 'El botón no sale de su cruz. Lo pulsa el ponente.'); },
      coger: async (api) => { await sayP(api, 'El botón no sale de su cruz. Lo pulsa el ponente.'); },
    } },
    { id: 'sillas_evento', name: 'sillas', handlers: {
      mirar: async (api) => {
        if (encontrada(api)) { await api.say(['Ciento doce, según Pilar. Ciento once aquí y una en el sótano.', 'La cruz vacía tiene ahora un pósit: «112 · OCUPADA (ARMARIO 27)».']); return; }
        const a = acto(api);
        if (a === 3) await api.say(['Ciento once sillas para un ponente que quiere el evento de pie.', 'La ocupación media es Pilar.']);
        else if (a === 1 && api.once('eventos_sillas_contadas')) await api.say(['Filas de sillas, cada una en su cruz de cinta. Cuento ciento once.', 'Pilar dice que son ciento doce. La otra está «en el plano».']);
        else await api.say(['En la última fila, una cruz de cinta sin silla.', 'Pilar la mira de reojo cada cinco minutos.']);
      },
      usar: async (api) => { await api.say('Me siento un momento en la última fila.'); await sayP(api, '¡Público! ¡Ya tenemos uno! Cuatro minutos y medio.'); await api.say('Me levanto. Vuelven a ser cinco.'); },
      coger: 'Si me llevo una, Pilar tendrá que contar hacia atrás. Y eso es el reloj.',
      empujar: 'No. Cada silla está en su cruz. Si muevo una, Pilar lo nota en el walkie.',
      hablar: async (api) => api.say(`«¿Hay alguien?». ${Sillas(api)} sillas en silencio. El mejor público de la casa.`),
      'dar:*': 'Si dejo algo en una silla, Pilar lo acredita como asistente.',
    } },
    // [P12] la cruz vacía de la última fila: el sitio de la 112 (sustituye a la silla torcida de Comercial)
    { id: 'cruz_112', name: 'cruz vacía', handlers: {
      mirar: async (api) => api.say(['Una cruz de cinta sin silla. Al lado, a boli: «112».',
        encontrada(api) ? 'La cruz vacía tiene ahora un pósit: «112 · OCUPADA (ARMARIO 27)».' : 'Es el sitio de alguien que no está.']),
      usar: async (api) => { await api.say('Me pongo en la cruz.'); await sayP(api, '¡Tú no eres la 112! Tú eres de pie.'); },
      hablar: '«¿Hay alguien?». La cruz no contesta. Lleva meses sin nadie que la pise.',
      coger: 'No. Si despego la cruz, Pilar pierde la cuenta. Y la esperanza.',
      tirar: 'No. Si despego la cruz, Pilar pierde la cuenta. Y la esperanza.',
    } },
    // [P12] la silla del ponente sigue la noche de Pilar: «por confirmar» → confirmado → sin folio (era papel)
    { id: 'silla_reservado', name: 'silla con «RESERVADO»', handlers: {
      mirar: async (api) => {
        if (acto(api) >= 2) await api.say(['La silla del ponente, sin folio: era papel.', 'El ponente hablará de pie. La silla espera igual.']);
        else if (presentado(api)) await api.say(['Un folio en una silla: «RESERVADO · Ponente: CONFIRMADO».', '«Confirmado» está escrito encima de «por confirmar». Apretando.']);
        else await api.say(['Un folio en una silla: «RESERVADO». Debajo, más pequeño: «Ponente».', '«Por confirmar». La silla lleva años confirmando que no viene nadie.']);
      },
      usar: 'No me siento. Si me siento, me toca hablar. Y no sé de qué va.',
      coger: async (api) => { await sayP(api, '¡Esa no! Es la del ponente. Hoy viene. Que la encuentre.'); },
      hablar: 'Le pregunto al ponente si viene. El folio ni se mueve. Eso es un «ya veremos».',
      'usar:chaqueta_ramirez': 'La chaqueta de Ramírez reserva sillas sola. Pero esta ya está pillada.',
    } },
    { id: 'mesa_sonido', name: 'mesa de sonido', color: '#cfd8c8', murmurColor: '#cfd8c8',
      murmurs: ['WALKIE: Catering a Eventos: croquetas en posición. Cambio.', 'WALKIE: ¿Empezamos? ...Cambio. No. Cambio.',
        'WALKIE: Foco tres, deja de parpadear. Cambio. Foco tres no contesta.'],
      handlers: {
        // [P12] desde el Acto II, el cuarto walkie lo lleva el ponente (siembra el walkie del clímax)
        mirar: async (api) => api.say(['La mesa de sonido. Doce faders y un pósit: «NO TOCAR. YA ESTÁ A 5 MIN».',
          acto(api) >= 2 ? 'Tres walkies cargando. El cuarto lo lleva el ponente.' : 'Al lado, el cargador. Cuatro walkies cargando. Uno dice «cambio» solo.']),
        usar: 'Subo un fader. Suena una freidora. Es el canal del catering.',
        tirar: 'Tiro de un cable. Se apaga el foco tres. Lo enchufo: sigue parpadeando.',
        hablar: async (api) => { await api.say('Cojo un walkie: «¿Hola?».'); await api.sayFrom('mesa_sonido', 'WALKIE: Cinco minutos. Cambio.'); },
        abrir: 'Abro la tapa del cargador. Pilas de 2009 y un caramelo. Cierro.',
        coger: 'Cojo un walkie. Pilar me lo quita sin mirar. Tiene seis acreditaciones.',
        'usar:movil': async (api) => api.say(`Conecto el móvil. Suena mi tono a todo volumen. Lo oyen ${sillas(api)} sillas.`),
      } },
    { id: 'mesa_acreditaciones', name: 'mesa de acreditaciones', handlers: {
      mirar: mirarLista,
      usar: async (api) => { await api.say('Me pongo detrás de la mesa, a acreditar.'); await sayP(api, '¡Fuera de mi mesa! Acreditar es un oficio. Tiene escaleta.'); },
      coger: 'La mesa es de Eventos. Lo pone el mantel. Lo pone todo.',
      empujar: 'No se mueve. Está pegada al suelo con cinta. Es su marca.',
      'usar:tarjeta_becario': async (api) => { await api.say('Dejo mi tarjeta en la mesa.'); await sayP(api, '«Pellizco», otra vez. Te hago la segunda. Por si pierdes la primera.'); },
    } },
    // [P12] la trituradora del rider (desde el Acto II), con pegatina de Optimal Brains
    { id: 'trituradora', name: 'trituradora', when: 'acto_2_iniciado', handlers: {
      mirar: async (api) => {
        if (encontrada(api)) await api.say('Apagada. Pilar le ha puesto su cruz de cinta. Ya consta, como mueble.');
        else if (acto(api) === 3) await api.say(['La trituradora, zumbando. Encima, el álbum de Eventos.', 'Pilar la ha puesto en la escaleta: 21:04.']);
        else await api.say(['Una trituradora nueva. Pegatina: «OPTIMAL BRAINS · CERO PAPEL».', 'Viene con un manual de cuarenta páginas. En papel.']);
      },
      usar: async (api) => { await sayP(api, '¡Quieto! A las 21:04. Ni un minuto antes.'); },
      'usar:tarjeta_becario': 'Si tritura mi tarjeta, vuelvo a no constar. Ya he estado ahí.',
      'usar:fotocopia_nota_direccion': 'Ni hablar. Gervasio todavía tiene que reconocer esa comida.',
      'usar:correo_evaristo': 'Lo guardo. Evaristo dijo «en el momento oportuno». Aún no ha llegado.',
      'usar:manual_fax': NO_TRITURO,
      'usar:libreta_replicas': NO_TRITURO,
      hablar: 'Zumba. Está esperando a las 21:04 como Pilar a las 21:05.',
      empujar: async (api) => { await sayP(api, 'Esa no se mueve. La ha traído el ponente. Con su manual.'); },
      coger: async (api) => { await sayP(api, 'Esa no se mueve. La ha traído el ponente. Con su manual.'); },
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
      // [P12] de doce murmullos a ocho: fuera los que contaban sillas de más o repetían otro chiste; ninguno de croquetas
      murmurs: (view) => [
        'Cinco minutos. Siempre cinco minutos. Es mi zona horaria.',
        'Si no hay croquetas, no es un evento. Es una reunión.',
        'Cinta en el suelo, cinta en el cable, cinta en el alma.',
        'Aquí Eventos, cambio. Sí, a cinco minutos. Cambio y corto.',
        'Si alguien dice «empezamos ya», que me lo pase por escrito.',
        view.flag('inigo_presentado') ? 'Ponente: confirmado. Croquetas: confirmadísimas.' : 'Ponente: por confirmar. Croquetas: confirmadísimas.',
        view.flag('eventos_album_dado') ? 'Ciento doce. Qué paz. Hasta el walkie suena más bajito.' : 'Ciento once. Y la 112, de proyecto.',
      ],
      handlers: {
        mirar: async (api) => api.say(acto(api) >= 2 ? ['Pilar Escaleta. Cascos, walkie y ninguna escaleta: era papel.', 'La lleva en la cabeza. Al minuto.']
          : ['Pilar Escaleta, de Eventos. Cascos, walkie, escaleta y seis acreditaciones.', 'En la muñeca, un rollo de cinta americana. Por si hay que acreditar algo.']),
        hablar: async (api) => api.dialog('pilar'),
        'dar:cafe': async (api) => { await sayP(api, 'Café sin catering es un café. Con catering, una pausa. Apuntado.'); },
        'dar:tarjeta_becario': async (api) => { await sayP(api, '«Pellizco». Te la repito bien: «Bruno. Acceso: hasta el canapé».'); },
        'dar:ficha_pagina_7': async (api) => { await sayP(api, '¿Una ficha con tres casillas? ¡Eso es una escaleta! Me encanta.'); },
        'dar:album_eventos': async (api) => { await sayP(api, 'Quédatelo hasta que acabes. Lo tengo apuntado: «Bruno, álbum, 20:40».'); },
        'dar:correo_evaristo': async (api) => { await sayP(api, 'Un correo impreso. No me lo enseñes, que el rider dice cero papel.'); },
        'dar:acta_reunion': async (api) => { await sayP(api, '«Pedir más café». Eso lo tenía yo en la escaleta. 20:58.'); },
        'dar:ticket_n1': async (api) => { await sayP(api, '«Alta becario Brais». ¿Ves? Ya consta en dos sitios.'); },
        'dar:taper_huerfano': async (api) => { await sayP(api, 'El extra siempre llevaba uno. Nunca llegaba al catering.'); },
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
    const a = acto(api);
    if (a === 3 && !api.flag('eventos_acto3_entrada') && !encontrada(api)) {
      // [P12] primera entrada del Acto III (camino principal): la trituradora zumba, el álbum en la boca; Pilar cuenta
      api.faceActor(PILAR, 'cruz_112');
      await entradaActo3(api);
      api.faceActor(PILAR, api.player);
    } else if (a === 2 && api.once('eventos_acto2_entrada')) {
      // [P12] primera entrada del Acto II (opcional): Pilar despega la pancarta de papel y la tapa con cinta, sin mirar
      api.sfx('beep');
      await sayP(api, '¿Sin turno de preguntas? ...Recibido. Desenchufo el micro de sala. Cambio.');
    } else await sayP(api, ENTRADAS[(api.inc('ecosistema_entradas_n') - 1) % ENTRADAS.length]);
    if (api.once('eventos_primera_vez')) {
      await api.say(['La Sala Polivalente. Vale para todo.', 'Sobre todo, para estar a punto de empezar.']);
    }
  },
}, art);
