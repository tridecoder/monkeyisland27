// SALA `administracion` — LÓGICA. Dueño: paquete D · «Planta noble y Dirección» (biblia §9.1). Biblia: §3.8, §7.6.2
// (Begoña), P08 (la peor nota de gasto), P11 (recorte del 26 %). Adenda: §3.8 (despacho de Controlling), §4.6 (don
// Evaristo Salvedad, MP2), §4.7 y §8bis (opciones de Begoña, yunque), §4.8 (combinaciones), murmullos.
// Reescritura de comedia, paquete P3 (docs/guion2/PLAN_COMEDIA.md): §5.8 Begoña, §4.5 la entrada nueva de la pared
// (la factura del fax de la Redacción de papel), §6.3-6.4 líneas sueltas. El cartel del recorte lo firma Administración.
// El arte y la geometría están en ./art/administracion.art.js (artista de fondos). Árboles en ./administracion.dialogos.js.
import { buildRoom } from '../lib/room.js';
import art from './art/administracion.art.js';
import dialogos, { recorte } from './administracion.dialogos.js';
import { sello, rota } from '../escenas/planta_noble.js';

const BEGONA = 'begona_triplicado', EV = 'evaristo_salvedad';
const sayBe = (api, t) => api.sayAs(BEGONA, t);
const sayEv = (api, t) => api.sayAs(EV, t);

// §3.8 + adenda §3.8 y §8bis: la pared rota una por cada Mirar (las de la adenda, al final de la rotación)
const PARED = [
  '«Comida con fuente. Motivo: las fuentes no comen».',
  '«Cena con el ministro. Motivo: el ministro pagó».',
  '«Taxi a un canutazo. Motivo: un canutazo no es una dirección».',
  '«Paraguas. Motivo: la lluvia no es gasto de empresa».',
  '«Doble fila durante exclusiva. Motivo: la exclusiva no salió».',
  '«Flores para una fuente. Motivo: las fuentes no se riegan».',
  '«Nota de gasto generada por IA (Desarrollo). Motivo: la IA no come».',
  '«Yunque, una unidad. Motivo: un yunque no es material de oficina».',
];
const PARED_FAX = '«Fax de la Redacción de papel, 0,26 €. Motivo: lo pagó Teodoro».';

// adenda 3.8: «al Usar la puerta, sale a la puerta». Bruno se aparta a un lado, Evaristo sale de pie a la puerta de
// cristal (posición `puerta` del arte), se habla, y vuelve a su despacho (posición `despacho`).
const posEv = (k) => art.layout.evaristo_salvedad.positions[k];
const hablarEvaristo = async (api) => {
  const here = api.actorPos(EV);
  if (!here || here.room !== 'administracion') return api.dialog('evaristo');
  const P = posEv('puerta'), D = posEv('despacho');
  await api.walkTo(P.walkTo[0], P.walkTo[1]);
  api.sfx('door');
  api.placeActor(EV, 'administracion', P.at[0], P.at[1], P.at[2]);
  api.face('right');
  try { await api.dialog('evaristo'); }
  finally {
    api.sfx('doorClose');
    api.placeActor(EV, 'administracion', D.at[0], D.at[1], D.at[2]);
  }
};

export default buildRoom({
  id: 'administracion',
  name: 'Administración',
  music: 'm_administracion',
  flags: {
    administracion_pared_n: 'int · D · administracion · +1 por Mirar pared_rechazadas · D (rotación)',
    administracion_turno: 'bool · D · administracion · Coger dispensador_turnos · D (Mirar dispensador)',
  },

  objects: [
    // la boca del pasillo, SIN puerta: la misma que se ve desde Marketing y Comercial (tipo 'pasillo')
    { id: 'administracion_a_ecosistema', name: 'pasillo a Marketing', exit: { room: 'ecosistema', tipo: 'pasillo' }, handlers: {
      mirar: 'El pasillo, de vuelta a Marketing. Al fondo, la impresora. Y un gong.',
      usar: async (api) => { await api.goto('ecosistema', 'administracion'); },
      abrir: 'Es un pasillo: viene abierto de serie. Begoña lo tiene en revisión.',
      cerrar: 'Si cierro el pasillo, Begoña me pide el F-3 de Pasillos. Por triplicado.',
      empujar: 'El pasillo no se empuja. Se recorre. Con número de turno.',
    } },
    { id: 'cartel_horario', name: 'cartel del horario', handlers: {
      mirar: async (api) => { await api.say(['«ATENCIÓN: 19:00 A 19:15». Según Begoña son las 19:07.', 'Llevan siéndolo toda la tarde.']); },
      coger: async (api) => { await sayBe(api, 'Ese cartel es el horario. Sin él, son las 19:08. Y eso no lo consiento.'); },
      hablar: 'Le pregunto la hora al cartel. Las 19:07. Es coherente.',
    } },
    { id: 'dispensador_turnos', name: 'dispensador de turnos', handlers: {
      mirar: async (api) => {
        if (api.flag('administracion_turno')) await api.say('Ahora marca 1. Begoña aún no se ha recuperado.');
        else await api.say('Dispensador de turnos. Marca 0. Si no hay cola, no hay control.');
      },
      coger: async (api) => {
        if (api.flag('administracion_turno')) { await api.say('Ya tengo el 1. Si cojo el 2, hago cola conmigo mismo.'); return; }
        api.setFlag('administracion_turno', true);
        api.sfx('paper');
        await api.say('Cojo número. El 1. Begoña me mira como a un milagro.');
      },
      tirar: 'Tiro del papelito. Sale el 1. Aquí hasta la cola es de una persona.',
      usar: 'Le doy al botón. Pita. Begoña se pone las gafas de atender.',
    } },
    { id: 'pared_rechazadas', name: 'pared de notas rechazadas', handlers: {
      mirar: async (api) => {
        // plan §4.5: con la pieza recortada por fax, la factura de Teodoro entra en la rotación (la primera vez, la primera)
        if (api.flag('catacumba_factura') && api.once('administracion_pared_fax')) { await api.say(PARED_FAX); return; }
        const lista = api.flag('catacumba_factura') ? PARED.concat([PARED_FAX]) : PARED;
        const n = rota(api, 'administracion_pared_n');
        await api.say(lista[n % lista.length]);
      },
      coger: async (api) => { await sayBe(api, 'Eso es patrimonio. Esas notas no se tocan: se rechazan.'); },
      empujar: 'Una nota se tuerce. Begoña la endereza sin mirar. Tiene un sexto sentido.',
      'usar:copias_rechazadas': 'Las mías no son de pared. Son de archivo personal. Lo dijo ella.',
    } },
    { id: 'cartel_recorte', name: 'cartel del recorte', handlers: {
      mirar: async (api) => { await api.say(['«TODA PIEZA O NOTA SUFRE EL RECORTE ESTÁNDAR (26 %). SIN EXCEPCIONES».', '«Firmado: Administración (también recortada)».']); },
      coger: 'Si lo quito, el cartel sufre el recorte. Un 26 % de cartel no se entiende.',
      tirar: 'Tiro de una esquina. Se recorta sola. Un 26 %. Exacto.',
    } },
    // muebles de plano medio (solo dibujo: tapan lo que queda tras ellos; sin hotspot)
    { id: 'mostrador_ventanilla', name: 'mostrador', hotspot: false },
    { id: 'banco_espera', name: 'banco de espera', hotspot: false },
    { id: 'mesa_evaristo', name: 'mesa de Evaristo', hotspot: false },
    { id: 'ventanilla', name: 'ventanilla', handlers: {
      mirar: async (api) => { await api.say(['Una ventanilla dentro de una oficina.', 'Nadie sabe por qué. Begoña la defiende igual.']); },
      abrir: async (api) => { await sayBe(api, 'La ventanilla no se abre. Se atiende por el agujerito, como manda la norma.'); },
      empujar: async (api) => { await sayBe(api, 'Ese cristal es de 1986. Aguantó una auditoría. Te aguanta a ti.'); },
      hablar: async (api) => api.dialog('begona'),
      usar: async (api) => api.dialog('begona'),
    } },
    { id: 'sellos', name: 'sellos', handlers: {
      mirar: 'ORIGINAL, DUPLICADO, TRIPLICADO. Y uno escondido: RECHAZADO. Es el que más usa.',
      coger: async (api) => { await sayBe(api, 'Toca un sello y te sello la mano. Y la mano no desgrava.'); },
      usar: async (api) => { await sayBe(api, 'Los sellos los uso yo. Usted, como mucho, los padece.'); },
    } },
    { id: 'tazas_begona', name: 'tazas', handlers: {
      mirar: 'Tres tazas vacías. Una por copia.',
      coger: async (api) => { await sayBe(api, 'Esa es la del duplicado. Si se la lleva, quedo en original y triplicado.'); },
      'usar:cafe': 'Lleno la del original y la dejo ahí. Begoña la mira con sospecha. Sin ticket.',
    } },
    { id: 'archivador_ejemplares', name: 'archivador EJEMPLARES', handlers: {
      mirar: '«EJEMPLARES». Once notas bien hechas en cuarenta años. Una por cuatrienio.',
      abrir: async (api) => { await sayBe(api, 'Las notas son confidenciales. Las nóminas, también. Y la receta de la tortilla.'); },
      coger: async (api) => { await sayBe(api, 'Los ejemplares no salen de aquí. Salen sus fotocopias. Por las dos caras.'); },
      empujar: 'No se mueve. Lo sujetan cuarenta años de notas bien hechas.',
    } },
    // ADENDA §3.8 · despacho de Controlling
    { id: 'puerta_controlling', name: 'puerta de Controlling', handlers: {
      mirar: async (api) => { await api.say(['«CONTROLLING Y FINANZAS». Detrás del cristal, un señor lee con lupa.', 'Lee un contrato. Por la cláusula 12. Lleva ahí desde julio.']); },
      usar: hablarEvaristo,
      abrir: hablarEvaristo,
      empujar: async (api) => { await sayBe(api, 'A don Evaristo no se le empuja. Se le espera.'); },
      cerrar: 'Ya está cerrada. Don Evaristo la cierra con doble vuelta. Y con nota al pie.',
      hablar: hablarEvaristo,
    } },
    { id: 'contratos_evaristo', name: 'carpetas de contratos', handlers: {
      mirar: 'Carpetas: «CONTRATOS (LEÍDOS)». La única estantería sincera de la casa.',
      coger: async (api) => { await sayEv(api, 'Esas no. Están leídas. Si las toca, hay que releerlas.'); },
      abrir: async (api) => { await sayEv(api, 'Si la abre, se pierde la página. Y la página es lo de menos: la coma.'); },
    } },
    { id: 'coma_enmarcada', name: 'coma enmarcada', handlers: {
      mirar: 'Una coma enmarcada. Placa: «Cláusula 7, 2009. Nos ahorró una fusión».',
      hablar: 'Le digo que es preciosa. Desde dentro, Evaristo asiente.',
      coger: async (api) => { await sayEv(api, 'Esa coma no se presta. Ya hizo bastante en 2009.'); },
      usar: 'Una coma no se usa. Se pone en su sitio. Y ella ya está.',
    } },
  ],

  actors: [
    { id: BEGONA,
      murmurs: ['Original. Duplicado. Triplicado. Original. Duplicado...', 'Las 19:07. Qué rápido pasa la tarde. No pasa.',
        'Se ha ido todo el mundo. Yo cierro a las 19:15. Por principios.',
        'Esto es el Contable, niño. Aquí cuadra todo menos las nóminas.',
        'Don Evaristo me ha llamado para decirme que me llamará. Qué hombre.'],
      handlers: {
        mirar: async (api) => { await api.say(['Begoña Triplicado. Manguitos, gafas rojas y tres sellos.', 'Uno por mano y otro por si acaso.']); },
        hablar: async (api) => api.dialog('begona'),
        'dar:pieza_opa': async (api) => {
          if (api.flag('pieza_recortada')) { await sayBe(api, 'Recortar dos veces es de Marketing.'); return; }
          await recorte(api);
        },
        'dar:cafe': async (api) => {
          await sayBe(api, '¿Tiene ticket?');
          await api.say('Es de Gertrudis.');
          await sayBe(api, 'Entonces este café no ha existido.');
        },
        'dar:sobre_azucar': async (api) => { await sayBe(api, '¿Un sobre de azúcar? Sin nota de gasto, esto es azúcar.'); },
        'dar:tarjeta_becario': async (api) => { await sayBe(api, '«Pellizco». ¿Viene a justificarse? Usted no tiene ticket. Ni foto.'); },
        'dar:ticket_n1': async (api) => {
          await sayBe(api, 'Un ticket cerrado. Lo sello por emoción.');
          sello(api);
          await sayBe(api, 'Sigue cerrado.');
        },
        'dar:copias_rechazadas': async (api) => { await sayBe(api, 'Eso es suyo. Para su archivo personal. Yo ya tengo el original.'); },
        'dar:fotocopia_nota_direccion': async (api) => { await sayBe(api, 'Quédesela y estúdiela. Por las dos caras, como se la he dado.'); },
        'dar:acta_reunion': async (api) => { await sayBe(api, '¿Un acta de Gervasio? La sello para que conste que existe.'); sello(api); },
        'dar:ficha_pagina_7': async (api) => { await sayBe(api, 'Tres casillas. Bien. Pero ninguna dice «importe».'); },
        'usar:movil': async (api) => { await sayBe(api, 'Aquí no se hacen fotos. Se hacen fotocopias.'); },
        empujar: 'A Begoña no se la empuja. Se la tramita.',
        coger: async (api) => { await sayBe(api, 'Toca algo de esta ventanilla y lo sello. A usted también.'); },
      } },
    { id: EV,
      handlers: {
        mirar: async (api) => { await api.say(['Don Evaristo Salvedad, Controlling. Corbata de comas. Lupa al cuello.', 'Y un inalámbrico en la mano. Por si hay que llamar.']); },
        hablar: hablarEvaristo,
        'usar:movil': 'No le llamo. Está a un metro. Y me lo cogería.',
        'dar:pieza_opa': async (api) => { await sayEv(api, 'Treinta y una líneas. Diecisiete comas. Todas en su sitio.'); },
        'dar:copias_rechazadas': async (api) => {
          await sayEv(api, 'El triplicado tiene una coma distinta.');
          await sayEv(api, '...Es broma. Es lo único que sé hacer de broma.');
        },
        'dar:ticket_n1': async (api) => { await sayEv(api, '«Asignado a: Titulator 3000». ¿Facturamos a un ticket? Lo apunto.'); },
        'dar:acta_reunion': async (api) => { await sayEv(api, 'Dos faltas y ninguna coma. Casi es poesía. Mala, pero poesía.'); },
        'dar:cafe': async (api) => { await sayEv(api, 'Gracias. ¿Lleva ticket? No lo digo yo. Lo diría Begoña.'); },
        'dar:tarjeta_becario': async (api) => { await sayEv(api, '«Pellizco». Se lo corrijo a lápiz. Rojo el error, azul usted.'); },
        'dar:boli_muerto': async (api) => { await sayEv(api, 'Sin tinta. Ni para una coma. Lo siento por él.'); },
        'dar:ficha_pagina_7': async (api) => { await sayEv(api, 'Tres casillas y ninguna coma. Así cualquiera firma.'); },
        'dar:*': async (api) => { await sayEv(api, 'Gracias. Lo leo y le escribo. Un correo. Muy pequeño.'); },
        empujar: async (api) => { await sayBe(api, 'A don Evaristo no se le empuja. Se le espera.'); },
        coger: async (api) => { await sayEv(api, 'Una cosita: no me coja. Si me muevo, pierdo la línea.'); },
      } },
  ],

  dialogs: dialogos,
  duels: {},
  scenes: {},
  defaults: {},
  ambient: [],
}, art);
