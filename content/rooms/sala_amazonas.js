// SALA `sala_amazonas` — LÓGICA. Dueño: P4 (plan de comedia §11). Plan: §4.4 (la reunión y la estampida), §5.9 (Gervasio
// y Maripaz en la Sala, Acto II), §7.4-7.7 (duelo D1 de Maripaz: se muda aquí desde Marketing y Comercial; derrota con
// Siestatón), §4.7 (la tele `entrada_1` del clímax) y el clímax 7.4 (en ../escenas/climax.js).
// El arte y la geometría están en ./art/sala_amazonas.art.js. Estados del objeto `proyector`: 'diapo_247' / 'diapo_248'.
// Cruces (§11.1): pone `reunion_terminada` (lo leen P3 —el fugitivo de Mercados en el Vending— y P0) y, con D1,
// `duelo_maripaz_ganado` y `casilla_hueco` (Maripaz vuelve a Marketing y Comercial: ./ecosistema.js).
import { buildRoom } from '../lib/room.js';
import art from './art/sala_amazonas.art.js';
import { gong, SFX, rota } from '../escenas/planta_noble.js';
import { duelInigo, climaxActivo, climaxEntrada, climaxReintento, climaxEmpujon, replicasD4, PUNTOS_D4 } from '../escenas/climax.js';

const GERV = 'gervasio_acta', INIGO = 'inigo_sinergia', LECTOR = 'lector_medio', MARIPAZ = 'maripaz_remitido';
const MERC = ['mercados_1', 'mercados_2', 'mercados_3'];
const PUERTA = [24, 112];
const sayG = (api, t) => api.sayAs(GERV, t);
const sayI = (api, t) => api.sayAs(INIGO, t);
const sayM = (api, t) => api.sayAs(MARIPAZ, t);
const sayMe = (api, n, t) => api.sayAs(MERC[n - 1], t);
const aqui = (api, id) => { const p = api.actorPos(id); return !!(p && p.room === 'sala_amazonas' && api.isVisible(id)); };

// la tele de videollamadas, Actos I-II (rota con `tele_n`; tras la 5 vuelve a la 1)
const TELE = [
  ['Sale la cámara del vestíbulo. Celestino le narra el Ibex al ficus.'],
  ['«ENTRADA 2»: el tiempo de ayer. En diferido.'],
  ['«ENTRADA 3»: una videollamada de 2019. Ramírez, congelado. Con cruasán.'],
  ['«BUSCANDO SEÑAL». La busca con más ganas que yo.'],
  ['«ENTRADA 5»: «PLAN CERO PAPEL · DIAPOSITIVAS: 400 · DATOS: 0».'],
];
async function usarTele(api) {
  if (api.flag('acto_3_iniciado')) { await api.say('No se enciende. El mando lo tiene alguien de Mercados. En el Vending.'); return; }
  const n = api.inc('tele_n'); await api.say(TELE[(n - 1) % TELE.length]);
}

const CARTELES = [
  '«NO DEJÉIS TAZAS. – Gervasio».',
  '«LAS TAZAS SON DE GERVASIO. – Mercados».',
  '«ESTA SALA NO ES EL VENDING». Firmado por la cafetera.',
  '«ESTE CARTEL ESTÁ RESERVADO. – Íñigo».',
  '«¿QUIÉN HA CAMBIADO LOS CARTELES? – Todos».',
];

// §3.0: en el Acto III no se sale hasta ganar (salvo que falten réplicas: sin callejones, §0)
async function salir(api) {
  if (climaxActivo(api) && !api.flag('lector_derribado')) {
    if (api.flag('duelo_inigo_ganado')) { await api.say('Todavía no. A Íñigo le queda un dato. Asiente junto a la pantalla.'); return; }
    if (replicasD4(api) >= PUNTOS_D4) { await api.say('No me voy. Íñigo sigue en la 247 y yo sigo en copia.'); return; }
    await api.say('Vuelvo enseguida. La 247 no se va a mover.');
  }
  api.sfx('door');
  await api.goto('pajarera', 'sala_amazonas');
}

// los tres de Mercados (Actos I-II, hasta la estampida): sentados tras la mesa
const MERCADOS_MIRAR = [
  'Uno de Mercados, con barba de comité. Lleva aquí desde marzo. La barba, también.',
  'Otro de Mercados. Mira la pantalla como a un valor refugio.',
  'El tercero de Mercados. Gafas de cerca para mirar el punto tres de lejos.',
];
const MERCADOS_HABLAR = [
  'Chsss. Estamos en el punto tres.',
  '¿Sigue siendo marzo?',
  'Yo propongo una reunión para ver el punto tres. Entramos cinco minutitos.',
];
const mercadosActor = (id, i) => ({
  id, when: ['!reunion_terminada', '!acto_3_iniciado', '!sala_amazonas_estampida'],
  murmurs: [['¿Me veis la pantalla? ...¿Hola? ¿Me veis?'], ['Que alguien pida sala para salir de la sala.'], ['Entramos cinco minutitos. En marzo.']][i],
  handlers: {
    mirar: MERCADOS_MIRAR[i],
    hablar: async (api) => { await sayMe(api, i + 1, MERCADOS_HABLAR[i]); },
    empujar: 'No reaccionan. Están en modo «a la espera de resultados».',
    coger: 'No se cogen. Cotizan. Y a la baja desde marzo.',
    'dar:cafe': 'Lo miran como a un dato nuevo. No se atreven: no está en el orden del día.',
    'dar:*': 'Lo miran. No lo cogen. Hasta que no se vote, no es suyo.',
  },
});

// ---- D1 (plan §7.4-7.7): Maripaz, en la Sala. Mazo R08, R04, R11, R14; remate con la ficha de la página 7.
export const duelMaripaz = {
  actor: MARIPAZ,
  from: 'Maripaz Remitido',
  subject: 'Llamar a Siestatón para pasarlos a la web',
  assigned: 'B. Pollejo',
  deck: ['R08', 'R04', 'R11', 'R14'],
  attackText: {
    R08: 'Esto te lo escribo desde el cariño más absoluto, cariño.',
    R04: 'Hazlo tú, que escribes divinamente. Lo digo como clienta.',
    R11: 'Me quedo a la espera de tus comentarios. Facturando.',
    R14: 'Si quieres lo vemos en una reunión cortita. Con catering.',
  },
  intro: ['¿Llamar yo a Siestatón un viernes? Te lo mando por correo. Con copia.'],
  hurt: ['Uy. Eso tiene tarifa.', 'Me lo apunto para un patrocinio.'],
  taunt: ['Eso es de otro hilo. Y de otro cliente. (*Y de otra tarifa.)', '¿Me contestas a otra? Eso se llama spam.'],
  finishers: [
    { atScore: 3, text: '¿Y quién me firma que esa página es de la redacción, cariño?', object: 'ficha_pagina_7',
      wrongObject: { '*': 'Eso no lo facturo. Ni lo firmo. Ni lo entiendo.' },
      script: async (api) => { await api.say('Ficha de la página 7. Sellada por Aurora. Impar.'); } },
  ],
  cc1: 'Colchones Siestatón',
  defeatLine: 'RESPUESTA AUTOMÁTICA DE COMERCIAL: «Te llamamos nosotros.»',
  defeatLines: ['Asignado a ti. El teléfono de Siestatón es este. Suerte.'],
  defeatScene: 'd1_siestaton',
  defeatHeadline: 'BECARIO LLAMA A UN COLCHÓN UN VIERNES. EL COLCHÓN NO LO COGE',
  onWin: async (api) => {
    await sayM(api, ['...Aurora no sella nada sin café. Has invitado a la correctora.',
      'Vale, llamo yo. Desde mi mesa: el teléfono de aquí es de Ramírez.']);
    // se levanta; debajo, el planillo: lo dobla y se lo da a Bruno, que lo mete en la ficha
    api.pose(MARIPAZ, 'de_pie');
    api.hide('planillo_bajo_maripaz');
    api.sfx('pickup');
    await api.anim('bruno', 'reach', 400);
    await sayM(api, 'Hueco libre. Faldón de 23 líneas. Impar, cariño: que se vea.');
    if ((api.flag('duel:maripaz:perdido_n') || 0) > 0) await sayM(api, 'Y quitad el ronquido de la espera. Me lo ha chivado el becario.');
    gong(api);
    // sale hacia los Despachos por detrás de la mesa (walkbox `fondo` solo para esta salida)
    api.setWalkbox('fondo', true);
    try { await api.walkActor(MARIPAZ, PUERTA[0], PUERTA[1]); } finally { api.setWalkbox('fondo', false); }
    api.sfx('door');
    api.placeActor(MARIPAZ, null);
    api.pose(MARIPAZ, null);
    api.setFlag('duelo_maripaz_ganado', true);
    api.setFlag('casilla_hueco', true);
  },
};

/** §7.7 · derrota de D1: Bruno llama a Colchones Siestatón (primer plano del móvil); escala con la 2.ª y la 3.ª. */
async function d1Siestaton(api, info = {}) {
  const n = info.perdidos || 1;
  await api.phone.call({ caller: 'siestaton', label: 'Colchones Siestatón', outgoing: true }, async (api) => {
    if (n === 1) {
      await api.phone.say(['Ha llamado a Colchones Siestatón. Si desea dormir, pulse uno.',
        'Si ya duerme, no pulse. Le atenderemos en sueños.', 'Rrrrr... fiuuu... Rrrrr... fiuuu...']);
      await api.say('Me han puesto un ronquido en espera. Cuelgo. Vuelvo con Maripaz.');
    } else if (n === 2) {
      await api.phone.say(['Bienvenido otra vez. Su llamada nos importa. Por eso bostezamos.', 'Rrrrr... RRRRR... fiuuu... fiuuu...']);
      await api.say('Ahora roncan dos. Están ampliando plantilla.');
    } else {
      await api.phone.say('Le pasamos con su comercial.');
      gong(api);
      await sayM(api, '¿Cariño? ¿Me llamas desde el colchón? Eso te lo facturo.');
      await api.say('Maripaz, está usted a tres metros.');
      await sayM(api, 'Por eso. Llamada a tres metros: tarifa de proximidad.');
    }
  });
}

export default buildRoom({
  id: 'sala_amazonas',
  name: 'Sala Amazonas',
  music: 'm_sala_amazonas',
  flags: {
    sala_amazonas_climax_visto: 'bool · P4 · primera entrada del clímax 7.4 · P4 (versión corta), P0',
    sala_amazonas_carteles_n: 'int · P4 · sala_amazonas · +1 por Mirar carteles_amazonas · P4 (rotación)',
    sala_amazonas_orden_n: 'int · P4 · sala_amazonas · +1 por Usar orden_del_dia · P4',
    sala_amazonas_lector_cae: 'int · P4 · 7.4: caída del Lector (1-3; 0 de pie) · actors.js',
    sala_amazonas_estampida: 'bool · P4 · §4.4: Mercados ha huido por la puerta · P4 (presencia)',
    sala_amazonas_gervasio_agachado: 'bool · P4 · D4, floja «siguientes pasos»: Gervasio agachado · arte',
    sala_amazonas_fondo_abierto: 'bool · P4 · nunca se pone: walkbox `fondo` (api.setWalkbox) · arte',
  },

  objects: [
    { id: 'sala_a_pajarera', name: 'puerta de los Despachos', exit: { room: 'pajarera', tipo: 'puerta' }, handlers: {
      ir: salir,
      usar: salir,
      abrir: 'Ya está abierta. Nadie sale. Es un hecho cultural.',
      cerrar: 'Si la cierro, esto se convierte en una reunión de verdad. No me atrevo.',
      mirar: 'La puerta. Abierta. Nadie la usa: el orden del día no lo permite.',
    } },
    { id: 'cartel_salida', name: 'cartel de salida', handlers: {
      mirar: '«SALIDA: AL TERMINAR EL ORDEN DEL DÍA». La puerta está abierta y nadie sale.',
      coger: 'Si me lo llevo, no sabrán cuándo salir. Bueno, ya no lo saben.',
      hablar: 'Le pregunto cuándo termina el orden del día. Me mira como un pósit.',
      empujar: 'Empujo la puerta de al lado. Estaba abierta. Nadie lo había comprobado.',
    } },
    { id: 'proyector', name: 'proyector', when: 'acto_3_iniciado', state: 'diapo_247', color: '#B4E4FF', handlers: {
      mirar: async (api) => {
        if (api.getState('proyector') === 'diapo_248') await api.say('Diapositiva 248: «El viaje continúa». Ya no la mira nadie.');
        else await api.say('Diapositiva 247 de 400: «Sinergias exponenciales: el viaje». No hay vuelta.');
      },
      usar: 'Le doy a «siguiente». La 247 se queda. Tiene más estabilidad que yo.',
      empujar: 'Lo empujo un poco. Zumba. La 247 aguanta.',
      cerrar: 'Si lo apago, Íñigo presenta a oscuras. Lo haría igual.',
      coger: 'Está atornillado al techo. Tadeo lo propuso para toda la web.',
    } },
    { id: 'orden_del_dia', name: 'orden del día', handlers: {
      mirar: async (api) => {
        if (api.flag('reunion_terminada')) await api.say('Todo tachado. Hasta «Siguientes pasos». Alguien lloraba.');
        else await api.say(['ORDEN DEL DÍA: 1. Previsión. 2. Previsión de la previsión. 3. Siguientes pasos.',
          'El punto 3 lleva sin tocarse desde marzo. Nadie se atreve.']);
      },
      usar: async (api) => {
        if (api.flag('reunion_terminada')) await api.say('Ya no queda nada que tratar. Es la pantalla más feliz del edificio.');
        else await api.say('Para tocar el punto 3 hay que decirlo en voz alta. Y a quien preside.');
      },
      coger: 'Es una pantalla. Si me la llevo, la reunión me sigue a casa.',
      hablar: 'Leo el punto 3 en voz baja. Uno de Mercados se estremece.',
    } },
    // §4.4: Maripaz incuba el planillo (8×3 px bajo ella). Se ve, no se coge: se negocia (D1).
    { id: 'planillo_bajo_maripaz', name: 'planillo', when: ['acto_2_iniciado', '!casilla_hueco', '!acto_3_iniciado'], handlers: {
      mirar: 'Asoma un borde del planillo. Página 7: «Colchones Siestatón». Encima, Maripaz.',
      coger: async (api) => { await sayM(api, 'Ese planillo no se coge, cariño. Se negocia.'); },
      tirar: 'Tiro un milímetro. Maripaz pesa más que el planillo. Y que mi contrato.',
      usar: 'Para usarlo tendría que levantarse Maripaz. Eso se negocia aparte.',
      empujar: 'Lo empujo hacia dentro. Maripaz se acomoda encima. Ha ganado terreno.',
    } },
    { id: 'minicruasanes', name: 'mini-cruasanes', handlers: {
      mirar: async (api) => { await api.say(['Ochenta mini-cruasanes para cuarenta periodistas.', 'Las matemáticas nunca fallan: no llegan.']); },
      coger: 'Queda medio. Es de Mercados: lo tienen en cartera.',
      usar: 'Me como una miga. Sabe a reunión de marzo.',
      empujar: 'Acerco la bandeja a Mercados. Ni la miran. Están en el punto 3.',
    } },
    { id: 'botellines', name: 'botellines', state: 'en_fila', states: ['en_fila', 'volando', 'tumbados'], handlers: {
      mirar: async (api) => {
        if (api.getState('botellines') === 'tumbados') await api.say('Catorce botellines por los suelos. Uno sigue en pie. Es de Mercados.');
        else await api.say('Catorce botellines sin abrir. Aquí nadie bebe: se nota que se piensa.');
      },
      coger: 'Si abro uno, me lo imputan como gasto de representación.',
      abrir: 'Abrir uno es asumir un gasto. Mejor me deshidrato con dignidad.',
      empujar: async (api) => { api.sfx(SFX.botellines); await api.say('Los alineo. Catorce en fila. Parecen un comité.'); },
    } },
    // la tele: Actos I-II, canales; Acto III, apagada hasta que la enciende Celestino en el clímax (estado `entrada_1`)
    { id: 'tele_amazonas', name: 'tele de videollamadas', states: ['normal', 'entrada_1'], handlers: {
      mirar: async (api) => {
        if (api.getState('tele_amazonas') === 'entrada_1') await api.say('«ENTRADA 1»: el vestíbulo. Celestino retransmite. Con bufanda.');
        else if (api.flag('acto_3_iniciado')) await api.say('Apagada. Solo el piloto rojo, en reposo. Lo único que descansa aquí.');
        else await api.say('Una tele de videollamadas. Pegatina: «PULSAR ENTRADA 3. NO, LA 2. NO».');
      },
      usar: usarTele,
      hablar: async (api) => {
        await api.say(['«¿Me veis la pantalla?». La tele no contesta.', 'Es la experiencia completa.']);
        if (!api.flag('reunion_terminada') && aqui(api, 'mercados_2')) await sayMe(api, 2, 'Se te ha congelado, chaval.');
      },
      coger: 'Atornillada. Alguien temió que la tele se fuera antes que Mercados.',
      cerrar: async (api) => {
        if (api.flag('acto_3_iniciado')) await api.say('Ya está apagada. Más apagada sería una sala de espera.');
        else await api.say('La apago. Se enciende sola en «BUSCANDO SEÑAL». No se rinde.');
      },
    } },
    { id: 'caja_cables', name: 'caja de cables', when: '!acto_3_iniciado', handlers: {
      mirar: async (api) => { await api.say(['Catorce cables y siete adaptadores. Uno adapta un adaptador a otro.', 'Hay uno que encaja consigo mismo. Lo dejo así: es feliz.']); },
      usar: usarTele,                         // «Usar con tele_amazonas: igual que Usar la tele»
      coger: 'Si me llevo un cable, alguien no podrá presentar. Tentador. No.',
      abrir: 'Ya está abierta. Cierro la tapa y un cable me saluda por el hueco.',
      tirar: 'Tiro de un cable. Sale otro. Y otro. Es un truco de magia sin final.',
    } },
    { id: 'carteles_amazonas', name: 'carteles', when: '!acto_3_iniciado', handlers: {
      mirar: async (api) => { const n = rota(api, 'sala_amazonas_carteles_n'); await api.say(CARTELES[n % CARTELES.length]); },
      coger: '¿Coger un cartel? ¿Y elegir bando? Acabo de llegar a la sala.',
      'usar:movil': 'Les hago una foto. Así queda constancia de quién empezó.',
    } },
  ],

  actors: [
    { id: GERV, when: (api) => !api.flag('reunion_terminada') || api.flag('sala_abierta'),
      pos: (v) => (v.flag('acto_3_iniciado') ? 'rincon' : 'preside'),
      murmurs: ['Eso, en todo caso, lo hablamos.', 'Diecinueve años. Ni un marrón. Ni uno.',
        'Hoy me han preguntado tres veces por mi salud. Debo de estar fatal.'],
      handlers: {
        mirar: async (api) => {
          if (api.flag('acto_3_iniciado')) await api.say('Gervasio, de pie junto a su sillón. Con un café que no le han servido.');
          else await api.say('Gervasio preside. Lleva en el punto 3 desde marzo.');
        },
        hablar: async (api) => {
          if (!api.flag('acto_3_iniciado')) { await api.dialog('gervasio_reunion'); return; }
          if (api.flag('lector_derribado')) await sayG(api, 'Diecinueve años y nadie lo había preguntado.');
          else if (api.flag('duelo_inigo_ganado')) await sayG(api, 'Lo que diga el Lector Medio.');
          else await sayG(api, 'Yo aquí solo estoy en copia. Con toda la empresa.');
        },
        'dar:cafe': async (api) => { await sayG(api, '¿Un café? ¿A mí? Esto no estaba en el orden del día. Se agradece.'); },
        'dar:acta_reunion': async (api) => { await sayG(api, 'No, no. El acta es tuya. Yo ya cumplí. Por primera vez.'); },
        'dar:*': async (api) => { await sayG(api, 'Eso lo coges tú, que tienes la agenda más limpia.'); },
        empujar: 'Gervasio no se mueve. Diecinueve años esquivando marrones dan estabilidad.',
      } },
    ...MERC.map(mercadosActor),
    // §5.9 · Maripaz en la Sala (Acto II hasta ganar D1), al fondo de la mesa, sentada en el planillo
    { id: MARIPAZ, when: ['acto_2_iniciado', '!casilla_hueco', '!acto_3_iniciado'],
      murmurs: ['Esta silla la facturo por horas. Y el planillo, por día.'],
      handlers: {
        mirar: 'Maripaz, sentada sobre el planillo. Lo incuba. Con patrocinio.',
        hablar: async (api) => {
          if (!api.flag('reunion_terminada')) { await sayM(api, 'Ahora no. Estoy en una reunión. Facturándola.'); return; }
          await api.dialog('maripaz_sala');
        },
        coger: 'A Maripaz no se la coge. Se la contrata. Por trimestres.',
        empujar: 'No se mueve. Tiene la sala pagada. Y el planillo, debajo.',
        'dar:ficha_pagina_7': async (api) => { await sayM(api, 'Una ficha sin hueco. El hueco lo tengo yo. Debajo.'); },
        'dar:cafe': async (api) => { await sayM(api, 'Ya tengo café. Patrocinado. (*Por mí.)'); },
        'dar:*': async (api) => { await sayM(api, 'Si no lleva logo, no lo cojo. (*Y si lo lleva, lo cobro.)'); },
      } },
    { id: LECTOR, when: 'acto_3_iniciado',
      murmurs: ['A mí lo que me interesa es la economía. Y ahorrar.'],
      handlers: {
        mirar: async (api) => {
          if (api.flag('lector_derribado')) await api.say(['Boca abajo en el suelo, delante de la mesa.', 'Por detrás: «Atrezo – Focus group 2014».']);
          else if (api.flag('chaqueta_en_lector')) await api.say('Junto a la pantalla, el Lector Medio, con la chaqueta de Ramírez. Asiente.');
          else await api.say('Junto a la pantalla, el Lector Medio. Asiente.');
        },
        hablar: async (api) => {
          await api.sayAs(LECTOR, 'A mí lo que me interesa es la economía. Y ahorrar.');
          if (aqui(api, GERV) && !api.flag('lector_derribado')) await sayG(api, ['Lo que diga el Lector Medio.', '...Pues ya está decidido.']);
        },
        empujar: async (api) => {
          if (api.flag('lector_derribado')) { await api.say('Ya está en el suelo. Empujarlo más sería ensañarse con un cartón.'); return; }
          if (!api.flag('duelo_inigo_ganado') || !climaxActivo(api)) { await api.say('Todavía no. Primero, por escrito.'); return; }
          await api.scene('climax_empujon');
        },
        coger: 'Es más alto que yo y tiene más autoridad. No se coge: se consulta.',
        tirar: 'No tiro de la chaqueta de Ramírez. Aún tiene que volver a por ella.',
        'usar:chicle': 'No. Ya lleva celo. Dos adhesivos en un lector es golpe de Estado.',
        'dar:*': 'Se lo enseño. Asiente. Asiente a todo: es su único dato.',
      } },
    { id: INIGO, when: 'acto_3_iniciado',
      murmurs: ['Esto en verde. Esto en rosa. Esto en azul, que es excusa.', 'Diapositiva 248: «El viaje continúa».',
        '¿Y esto el Lector Medio lo entiende? Perfecto: asiente.'],
      handlers: {
        mirar: async (api) => {
          if (api.flag('lector_derribado')) await api.say('Íñigo se busca en su matriz. Se ha encontrado. No le gusta el cuadrante.');
          else await api.say('Íñigo, de pie, con el portátil. Para él, la 247 avanza.');
        },
        hablar: async (api) => {
          if (api.flag('lector_derribado')) { await sayI(api, '«Prescindible. Caro.» Lo pone mi propia matriz.'); return; }
          if (api.flag('duelo_inigo_ganado')) { await sayI(api, 'Ni un gesto en contra. Ni una pregunta. El mejor lector que he tenido.'); return; }
          if (!climaxActivo(api)) { await sayI(api, '¿Vacante? Esto es una Reunión de Dirección. Los becarios no tienen voz.'); return; }
          await climaxReintento(api);
        },
        'dar:cafe': async (api) => { await sayI(api, 'Yo solo tomo agua con gas y sinergias.'); },
        'dar:tarjeta_becario': async (api) => { await sayI(api, 'Perfecto. Con esto te doy de baja más rápido.'); },
        'dar:ticket_n1': async (api) => { await sayI(api, 'Eso, por escrito. Si no está en el hilo, no escala.'); },
        'dar:acta_reunion': async (api) => { await sayI(api, 'Eso, por escrito. Si no está en el hilo, no escala.'); },
        'dar:*': async (api) => { await sayI(api, 'Ese input no escala.'); },
        empujar: 'A un consultor no se le empuja. Se le factura. Y eso ya lo hace él.',
      } },
  ],

  dialogs: {
    // §5.9 · nodo GV_REUNION (Gervasio preside; Mercados y, en el Acto II, Maripaz)
    gervasio_reunion: {
      actor: GERV, start: 'GV_REUNION',
      onStart: async (api) => {
        if (!api.once('sala_amazonas_reunion_saludo')) { await sayG(api, 'Seguimos en el punto tres. Se avanza.'); return; }
        await sayG(api, 'Estamos en el punto tres. Desde marzo. Se está... se avanza.');
        if (aqui(api, MARIPAZ)) await sayM(api, 'Y yo esperando a Siestatón desde marzo. El café, patrocinado.');
        if (aqui(api, 'mercados_2')) await sayMe(api, 2, '¿Sigue siendo marzo?');
      },
      nodes: {
        GV_REUNION: {
          options: [
            { text: '¿Qué se decide aquí?', once: true,
              do: async (api) => {
                await sayG(api, 'Se decide... Se está decidiendo. Lo que diga el Lector Medio.');
                if (api.flag('chaqueta_en_lector')) await sayG(api, 'Y Ramírez, que ha vuelto. Asiente mucho.');
                await api.say('¿Y qué dice el Lector Medio?');
                await sayG(api, 'Aún no se le ha preguntado. Se le preguntará. En el punto cuatro.');
              } },
            { text: '¿Me deja la página 7?', once: true,
              do: async (api) => {
                await sayG(api, 'La página 7 se... Eso habría que... Tú, que tienes la agenda limpia...');
                await api.say('¿...que tengo la agenda limpia para qué?');
                await sayG(api, 'Para eso. Muy bien visto. Se toma nota.');
              } },
            { text: '¿Puedo presidir yo un rato?', once: true,
              do: async (api) => {
                api.pose(GERV, 'de_pie');
                await sayG(api, 'Toma. Se preside sentado. Yo voy a por... a por una cosa.');
                if (aqui(api, 'mercados_1')) await sayMe(api, 1, 'Gervasio, que es el becario.');
                await api.wait(500);
                api.pose(GERV, null);
                await sayG(api, '...Ya decía yo que se ofrecía muy rápido.');
              } },
            { text: '¿Y si votamos si votamos?', once: true,
              do: async (api) => {
                if (aqui(api, 'mercados_1')) await sayMe(api, 1, 'Secundo.');
                if (aqui(api, 'mercados_3')) await sayMe(api, 3, 'Secundo.');
                await sayG(api, 'Se abre un turno de... Se abrirá. Cuando se cierre el punto tres.');
              } },
            { text: 'Bueno... ¿y cuáles son los siguientes pasos?', if: 'aurora_conto_pasos',
              do: async (api) => { await reunionTerminada(api); return 'exit'; } },
            { text: '¿Quién tiene reservada la sala?', once: true,
              reply: 'Ramírez. Los viernes a las 20:59.',
              lines: [['player', '¿Y dónde está Ramírez?'], [GERV, 'Desayunando. Desde 2019. Pero la reserva se respeta. Es de antes.']] },
            { text: 'Me voy.', exit: true, reply: 'Se toma nota. No la tomo yo, pero se toma.' },
          ],
        },
      },
    },
    // §5.9 · Maripaz en la Sala, tras la estampida
    maripaz_sala: {
      actor: MARIPAZ, start: 'MP_SALA',
      nodes: {
        MP_SALA: {
          options: [
            { text: 'La página 7 está pendiente desde marzo.', if: '!casilla_hueco',
              do: async (api) => {
                await sayM(api, ['¿Desde marzo sin confirmar? Eso no es un cliente, es un exnovio.',
                  'Vale, los paso a la web. Pero alguien tiene que llamar a Siestatón.']);
                await api.duel('maripaz');
                return 'exit';
              } },
            { text: '¿Me patrocina la cara de susto?', once: true,
              reply: 'Ya está: «Agobio, con Tilas Calmín». (*Agobio no incluido.)' },
            { text: 'Luego vuelvo.', exit: true, reply: 'Aquí estaré. Amortizando.' },
          ],
        },
      },
    },
  },
  duels: { inigo: duelInigo, maripaz: duelMaripaz },
  scenes: {
    climax_entrada: climaxEntrada,
    climax_empujon: climaxEmpujon,
    d1_siestaton: d1Siestaton,
  },
  defaults: {},
  ambient: [],

  async onEnter(api) {
    // idempotente (también al cargar): tras la estampida, los botellines siguen tumbados hasta el Acto III; tras el
    // ¡PLOF!, otra vez tumbados y el Lector, en el suelo
    const bot = api.flag('lector_derribado') ? 'tumbados'
      : (api.flag('reunion_terminada') && !api.flag('acto_3_iniciado')) ? 'tumbados' : 'en_fila';
    if (api.getState('botellines') !== bot) api.setState('botellines', bot);
    if (api.flag('sala_amazonas_lector_cae')) api.setFlag('sala_amazonas_lector_cae', 0);
    if (api.flag('sala_amazonas_gervasio_agachado')) api.setFlag('sala_amazonas_gervasio_agachado', false);
    if (api.getState('tele_amazonas') === 'entrada_1' && !api.flag('lector_derribado')) api.setState('tele_amazonas', 'normal');
    // P16: «Usar puerta_sala con todo» (lo abre P2) → escena 7.4 y duelo D4. Nunca tras ganar.
    if (climaxActivo(api) && !api.flag('duelo_inigo_ganado')) await api.scene('climax_entrada');
  },
}, art);

// §4.4 · «¿y cuáles son los siguientes pasos?»: la pregunta prohibida, el atasco en la puerta y la sala vacía
async function reunionTerminada(api) {
  await api.wait(1200);                                // silencio; las tres cabezas de Mercados se levantan a la vez
  api.shake(200, 1);                                   // tiembla un botellín
  await sayG(api, 'Los... siguientes...');
  api.pose('mercados_1', 'de_pie');
  await sayMe(api, 1, 'El siguiente paso sería...');
  await sayMe(api, 2, '¡No lo digas!');
  await sayG(api, 'Eso se podría ver en una reunión. De siguientes pasos.');
  await sayMe(api, 3, '¿Y quién la convoca?');
  for (const id of MERC) api.faceActor(id, GERV);
  await api.wait(700);
  api.faceActor(GERV, 'bruno');
  await sayG(api, 'Pues el que ha preguntado, que tiene la agenda...');
  // ¡estampida! sillas atrás, el dominó de botellines; salen por detrás de la mesa y se encajan en la puerta
  for (const id of MERC) api.pose(id, 'de_pie');
  api.sfx(SFX.sillas); api.shake(500, 2);
  api.setState('botellines', 'volando'); api.sfx(SFX.botellines);
  api.setWalkbox('fondo', true);
  try {
    await api.estampida(MERC, { puerta: PUERTA, atascoMs: 900, enAtasco: async (api, atasco) => {
      atasco.alFrente('mercados_1'); await sayMe(api, 1, '¡Usted primero!');
      atasco.alFrente('mercados_2'); await sayMe(api, 2, '¡No, usted, que es de Bolsa!');
      atasco.alFrente('mercados_3'); await sayMe(api, 3, '¡Yo soy de Bolsa y de Mercados! ¡Tengo doble prioridad!');
    } });
  } finally { api.setWalkbox('fondo', false); }
  api.setState('botellines', 'tumbados');
  api.setFlag('sala_amazonas_estampida', true);
  // ¡plop! Uno vuelve, coge medio cruasán y sale
  const v = api.game && api.game.actors && api.game.actors.mercados_3;
  const v0 = v && v.speed;
  try {
    if (v) v.speed = v0 * 2.4;
    api.placeActor('mercados_3', 'sala_amazonas', PUERTA[0], PUERTA[1], 'right');
    api.pose('mercados_3', 'de_pie');
    await api.walkActor('mercados_3', 204, 120);
    api.faceActor('mercados_3', 'up');
    await api.anim('mercados_3', 'reach', 300);
    await api.walkActor('mercados_3', PUERTA[0], PUERTA[1]);
  } finally {
    if (v) v.speed = v0;
    api.placeActor('mercados_3', null);
  }
  api.sfx('door');
  // Gervasio levanta la sesión ante una sala vacía (salvo Maripaz) y sale el último
  api.sostener(GERV, 'movil');
  api.pose(GERV, 'de_pie');
  await sayG(api, 'Se levanta la sesión. Lo hablamos.');
  await api.walkActor(GERV, PUERTA[0], PUERTA[1]);
  api.sostener(GERV, null);
  api.sfx('door'); api.shake(250, 1);                  // portazo
  api.setFlag('reunion_terminada', true);              // Gervasio sale de la sala (su `when`)
  api.pose(GERV, null);
  await api.wait(500);
  if (!aqui(api, MARIPAZ)) return;
  api.face(MARIPAZ);
  await api.say('¿Usted no huye?');
  await sayM(api, ['Esta sala la tengo pagada hasta las nueve, cariño. La amortizo.',
    'Y estoy sentada en el planillo. La página 7 no se mueve sin mí.']);
  await api.say('Una reunión desde marzo y la cierro yo con una pregunta. Liderazgo.');
}
