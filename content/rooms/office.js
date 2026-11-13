// SALA `office` — en pantalla, «VENDING» (orden de dirección 1; el id interno no cambia). LÓGICA. Dueño: paquete C ·
// «El papel y el café» (biblia §9.1). Biblia: §3.3, §5.2 (P02, P15), §6.3 (chismes de Gertrudis), §6.4-6.5 (duelo D3,
// Gervasio), §7.7.3 (Gertrudis), §7.7.6 (nodo GV_OFFICE). Adenda: §4.8 (combinaciones C), §8.1 (rumor A, paso 2:
// Gertrudis), §8bis (porra_plazas, chisme del garaje, murmullo de Gervasio).
// Solo tiene una puerta, a la Redacción (orden 2: ya no hay puerta a la Redacción de papel). La Secretaría de Redacción
// (Custodia) se mudó a la Redacción (orden 3): ./pecera.secretaria.js.
// El arte y la geometría están en ./art/office.art.js (artista de fondos).
//
// Gertrudis es un ACTOR (su LCD sale encima, en #39FF14, en MAYÚSCULAS): api.sayAs('gertrudis', ...).
import { buildRoom } from '../lib/room.js';
import art from './art/office.art.js';

const GER = 'gertrudis';
const GV = 'gervasio_acta';
const lcd = (api, lines) => api.sayAs(GER, lines);
const gv = (api, lines) => api.sayAs(GV, lines);

// ------------------------------------------------------------------ Gertrudis (§6.3, §7.7.3, adenda 3.5 y 8bis)
// chismes con réplica: [pantalla 1, pantalla 2, réplica]
const CHISMES = [
  ['CHISME: EL DE BOLSA A YOLI: "ESTO LO NECESITABA PARA AYER".', 'YOLI: "AYER ESTABA CON LO DE ANTEAYER. PÍDESELO A MAÑANA, QUE ESTÁ LIBRE".', 'rep_03'],
  ['CHISME: GERVASIO A NEREA: "ES QUE TÚ ERES LA QUE MEJOR ESCRIBE".', 'NEREA: "Y TÚ EL QUE MEJOR DELEGA. CADA UNO CON SU DON".', 'rep_04'],
  ['CHISME: ÍÑIGO A PACO: "ESTAMOS ANALIZANDO TODAS LAS OPCIONES".', 'PACO: "O SEA, QUE NO SABÉIS QUÉ HACER, PERO EN TABLA DINÁMICA".', 'rep_10'],
  ['CHISME: MARIPAZ A BORJA: "ESTO LO PODEMOS VER EN UNA REUNIÓN RÁPIDA".', 'BORJA: "O EN UN CORREO DE UNA LÍNEA. ESTE. DE NADA".', 'rep_14'],
];
// chismes de relleno (rotan): los tres de la biblia, los cuatro de la adenda 3.5 y el del garaje (8bis, al final)
const RELLENO = [
  'CHISME: EL MICROONDAS Y YO NO NOS HABLAMOS. ÉL SABE POR QUÉ.',
  'CHISME: LA PLANTA DEL VESTÍBULO ES DE PLÁSTICO. NO SE LO DIGÁIS.',
  'CHISME: TEODORO DUERME AQUÍ. LA ROTATIVA LO SABE Y CALLA.',
  'CHISME: LAS PAREDES OYEN. YO SOY UNA PARED CON CAFÉ.',
  'CHISME: DESARROLLO INTENTÓ ACTUALIZARME. LE DI UN E-47.',
  'CHISME: LA DE LA PERSIANA DICE QUE LE DEBO CATORCE CAFÉS. ME DEBE QUINCE.',
  'CHISME: EVARISTO ME REVISÓ EL "1,20". ESTABA BIEN. NOS EMOCIONAMOS.',
  'CHISME: LA PORRA DEL GARAJE VA TRES A UNO. YO NO APUESTO: ESTOY ENCHUFADA.',
];
const ERRORES = ['E-47: LLAMAR A SISTEMAS.', 'E-48: SISTEMAS NO CONTESTA.', 'E-49: YA SÉ QUE ERES TÚ OTRA VEZ.', 'E-50: ESTOY EN UNA REUNIÓN.'];

async function pedirCafe(api) {
  const i = api.flag('gertrudis_error_indice') || 0;
  api.inc('gertrudis_error_indice');
  api.sfx('error');
  let txt;
  if (i < 4 || !api.flag('acto_2_iniciado')) txt = ERRORES[Math.min(i, 3)];
  else txt = (i - 4) % 2 === 0 ? 'E-51: ESTAMOS ANALIZANDO TODAS LAS OPCIONES.' : 'E-52: ESE CAFÉ ESTÁ SACADO DE CONTEXTO.';
  await lcd(api, txt);
  if (txt.startsWith('E-51') && !api.flag('office_e51_visto')) {
    api.setFlag('office_e51_visto', true);
    await api.say('Hasta la cafetera tiene gabinete de prensa.');
  }
}

async function buenasNoches(api) {
  // adenda 8.1 · rumor A, paso 2 (antes del resultado; no toca chisme_indice)
  if ((api.flag('rumor_firma_n') || 0) === 1) {
    await lcd(api, 'RUMOR: EL BECARIO VA A FIRMAR EL CIERRE DEL PAPEL.');
    await api.say('"Firmar el cierre" suena a que lo cierro yo.');
    api.inc('rumor_firma_n');
  }
  await lcd(api, api.flag('gertrudis_saludada') ? 'BUENAS NOCHES, VACANTE.' : 'NADIE ME SALUDABA DESDE 2019.');
  api.setFlag('gertrudis_saludada', true);
  if (!api.has('cafe')) {
    api.sfx('machine');
    await api.wait(500);
    api.sfx('pour');
    api.give('cafe');
  }
  const n = api.flag('chisme_indice') || 0;
  if (n < CHISMES.length) {
    const [p1, p2, rep] = CHISMES[n];
    await lcd(api, [p1, p2]);
    api.learnReply(rep);
    await api.say('Me lo apunto.');
  } else {
    await lcd(api, RELLENO[(n - CHISMES.length) % RELLENO.length]);
  }
  api.inc('chisme_indice');
}

const dialogoGertrudis = {
  actor: GER, start: 'G0',
  onStart: async (api) => {
    if (api.flag('acto_3_iniciado') && api.flag('gertrudis_saludada')) await lcd(api, 'E-27: AYÚDAME. NO ES UN ERROR.');
  },
  nodes: {
    G0: {
      options: [
        { text: 'Un café, por favor.', exit: true, do: pedirCafe },
        { text: 'Buenas noches, Gertrudis.', exit: true, do: buenasNoches },
        { text: 'Nada, solo miraba.', exit: true, reply: 'ESO DICEN TODOS.' },
      ],
    },
  },
};

// ------------------------------------------------------------------ Gervasio en el Vending (§7.7.6 GV_OFFICE, Acto III)
const dialogoGervasio = {
  actor: GV, start: 'GV_OFFICE',
  nodes: {
    GV_OFFICE: {
      options: [
        { text: '¿Ha probado a darle las buenas noches?', once: true,
          reply: '¿A una máquina? Yo no saludo a lo que no está en el organigrama.' },
        { text: 'Necesito el acta de la última reunión.', do: async (api) => { await api.duel('gervasio'); return 'exit'; } },
        { text: 'Me voy.', exit: true, reply: 'Lo hablamos.' },
      ],
    },
  },
};

async function hablarGervasio(api) {
  if (api.flag('duelo_gervasio_ganado')) {
    await gv(api, ['Estoy esperando a que la máquina me salude.', 'Diecinueve años esperando cosas. Se me da bien.']);
    return;
  }
  await gv(api, 'Esta máquina no me reconoce. Diecinueve años y no me reconoce.');
  await api.dialog('gervasio_office', 'GV_OFFICE');
}

// ------------------------------------------------------------------ Duelo D3 · Gervasio (§6.4 / §6.5)
const dueloGervasio = {
  actor: GV,
  from: 'Gervasio Acta',
  subject: 'Redactar el acta de la última Reunión de Dirección',
  assigned: 'Vacante (becario)',
  assignedWin: 'Gervasio Acta',
  deck: ['R07', 'R01', 'R14', 'R03', 'R05'],
  winScore: 3,
  maxMisses: 3,
  intro: ['Ah, Vacante. El acta de la reunión hay que redactarla. Te lo pongo por escrito.'],
  hurt: ['Eso habría que hablarlo.', 'Lo hablamos. Bueno, no.'],
  taunt: ['Lo hablamos. O no.', 'Eso lo coges tú, que tienes la agenda limpia.'],
  defeatLines: ['Asignada a ti. El acta, digo. Tráemela mañana. Lo hablamos.'],
  onWin: async (api) => {
    await gv(api, 'Diecinueve años sin un marrón. Y ahora me toca el acta.');
    // (escribe, despacio, con la lengua fuera)
    api.sfx('paper');
    await api.anim(GV, 'reach', 900);
    await api.anim(GV, 'reach', 900);
    await gv(api, ['Acuerdos de la última reunión: uno, pedir más café. Dos, ninguno más.', 'Toma. Entra tú. Yo voy a ver si esta máquina me saluda.']);
    api.give('acta_reunion');
    api.sfx('pickup');
    api.setFlag('duelo_gervasio_ganado', true);
    api.setFlag('sala_abierta', true);
    await api.walkActor(GV, 170, 119);        // se planta delante de Gertrudis (su cabeza queda bajo el LCD)
    api.faceActor(GV, GER);
  },
};

// ------------------------------------------------------------------ la sala
export default buildRoom({
  id: 'office',
  name: 'Vending',
  music: 'm_office',
  flags: {
    office_e51_visto: 'bool · office · Bruno ya comentó el primer E-51 de Gertrudis (§7.7.3)',
    office_microondas_visto: 'bool · office · 1.er Mirar microondas (el 2.º es la línea de las 18:30, §8.7)',
    office_porra_vista: 'bool · office · 1.er Mirar porra_plazas (adenda 8bis)',
  },

  objects: [
    { id: 'office_a_pecera', name: 'puerta de la Redacción', exit: { room: 'pecera' }, handlers: {
      mirar: 'La Redacción. Se oye teclear "pensiones".',
      abrir: async (api) => { api.sfx('door'); await api.goto('pecera'); },
      usar: async (api) => { api.sfx('door'); await api.goto('pecera'); },
      cerrar: 'Ya está cerrada. La web se escapa igual.',
      hablar: 'Le digo a la Pecera que ahora vuelvo. Nadie levanta la vista. Es la web.',
      coger: 'La puerta se queda. Yo, de momento, también.',
    } },
    { id: 'nevera', name: 'nevera', handlers: {
      mirar: 'Nevera con imanes y un cartel: "ETIQUETAD VUESTROS TUPPERS". Nadie lo hace.',
      abrir: async (api) => {
        api.sfx('open');
        await api.say('Un yogur de 2019 con nombre: "RAMÍREZ". Lo respetan más que a la chaqueta.');
      },
      cerrar: async (api) => {
        api.sfx('close');
        await api.say('La cierro con la delicadeza de un jefe de cierre.');
      },
      coger: 'El yogur de Ramírez no se toca. Es lo único suyo que sigue fresco.',
      usar: 'Meto mi táper. Ah, no: no tengo táper. Tengo nervios, y no se enfrían.',
      'usar:cafe': 'Café frío de Gertrudis. Lo tomaría como una ofensa.',
      empujar: 'No. Dentro duerme un yogur de 2019. Respeto.',
    } },
    // la máquina de vending (orden de dirección 1: la que da nombre a la sala)
    { id: 'maquina_vending', name: 'máquina de vending', handlers: {
      mirar: 'La máquina de vending. Le queda una bolsa de pipas. De 2019, como todo aquí.',
      usar: 'Pulso la B4. La espiral gira, la bolsa se asoma... y se queda colgando. Como yo.',
      'usar:tarjeta_becario': 'No acepta tarjetas. Ni de becario. Solo monedas, y no tengo.',
      'usar:cafe': 'Darle café a la máquina de enfrente de Gertrudis. Sería una provocación.',
      coger: 'Pegatina: "NO ZARANDEAR". Debajo, a boli: "lo digo por experiencia. R."',
      empujar: 'La empujo un poco. La bolsa se asoma. Se lo piensa. Se queda.',
      hablar: 'Le pregunto si tiene algo para los nervios. Me ofrece pipas. Es un sí.',
      abrir: 'Se abre con llave. La llave la tiene Custodia. Las pipas, también.',
    } },
    { id: 'microondas', name: 'microondas', handlers: {
      mirar: async (api) => {
        if (api.flag('office_microondas_visto')) await api.say('Sus dueños se fueron a las seis y media. Los tuppers siguen en la cola.');
        else { api.setFlag('office_microondas_visto', true); await api.say('Nueve tuppers en cola. El primero lleva ahí desde la hora de comer.'); }
      },
      usar: 'Hay cola. Colarse en el microondas es lo único que aquí es despido procedente.',
      abrir: 'Dentro gira un plato vacío. Nadie se atreve a pararlo.',
      'usar:cafe': 'Recalentar un café de Gertrudis delante de ella. Ni loco.',
      'usar:ficha_pagina_7': 'Si caliento la ficha, se borran las casillas. Y la ilusión.',
      hablar: 'Le pregunto qué le pasa con Gertrudis. Pita. Un minuto entero.',
      coger: 'Si me llevo el microondas, nueve tuppers me denuncian.',
    } },
    { id: 'tablon', name: 'tablón', handlers: {
      mirar: async (api) => {
        await api.say([
          'Un hilo impreso: "RE: RE: RE: ¿De quién es el yogur?". 214 respuestas.',
          'Uno: "Como ya comenté en mi anterior correo, que parece que nadie ha leído..."',
          'Respuesta: "Lo leímos todos. Por eso no contestó nadie". Me la apunto.',
        ]);
        api.learnReply('rep_01');
      },
      coger: 'El hilo del yogur no se toca. Es patrimonio del Vending.',
      usar: 'Pincho mi nombre en el corcho. Se cae. Ni la chincheta me reconoce.',
    } },
    { id: 'hoja_firmas', name: 'hoja de firmas', handlers: {
      mirar: async (api) => { await api.say(['Curso obligatorio de prevención de riesgos. No lo ha hecho nadie.', 'Hay una sola firma: "Rubén (todavía aquí)".']); },
      usar: 'Mi primera firma en papel no va a ser en una hoja de riesgos. Me niego.',
      coger: 'Si me la llevo, Rubén pierde su única firma. Y no sé quién es.',
    } },
    { id: 'cartel_cortado', name: 'cartel del cortado', handlers: {
      mirar: '"El cortado sube a 1,20 €". Escrito a mano. La noticia más leída del edificio.',
      coger: 'Si me lo llevo, el precio sube igual. Lo dice el IPC.',
      usar: 'Lo releo. Sigue a 1,20 €. Es la única cifra estable de la casa.',
    } },
    { id: 'fregadero', name: 'fregadero', handlers: {
      mirar: 'Tazas de eventos. La del "Foro de Innovación 2017" tiene moho innovador.',
      usar: 'Si friego una taza, mañana me toca fregar todas. Así empezó Celestino.',
      coger: 'La taza del Foro de Innovación no se mueve. Ha echado raíces. Disruptivas.',
      'usar:cafe': 'Tirar un café de Gertrudis por el fregadero. Me oiría. Lo sé.',
      abrir: 'Abro el grifo. Sale un hilo de agua. Como el de las nóminas.',
      cerrar: 'Cierro el grifo. Gotea igual. Es su manera de opinar.',
    } },
    // mueble de plano medio (solo dibujo: tapa lo que queda tras su tablero; sin hotspot)
    { id: 'mesa_alta', name: 'mesa alta', hotspot: false },
    // ADENDA §8bis · la porra de las plazas de garaje
    { id: 'porra_plazas', name: 'hoja de la porra', handlers: {
      mirar: async (api) => {
        if (api.flag('office_porra_vista')) { await api.say('Abajo, a boli: "Prohibido apostar por la salud. Solo por la jubilación".'); return; }
        api.setFlag('office_porra_vista', true);
        await api.say(['Una hoja: "PORRA: ¿QUIÉN DEJA ANTES SU PLAZA?". Cinco euros.', 'Gervasio, a tres contra uno. Teodoro, a cuatrocientos. Ramírez: "no computa".']);
      },
      coger: 'Si la quito, me apuestan a mí. Y ni siquiera tengo plaza.',
      usar: 'Apuesto por mí. Cuota: "no consta". Como en el torno.',
    } },
  ],

  actors: [
    { id: GER, defaultVerb: 'hablar',
      handlers: {
        mirar: async (api) => { await api.say(['Gertrudis. Cafetera de 2009. Tiene pantalla y carácter. Lo segundo, más.', 'Un pósit: "Servicio técnico: CELESTINO, ext. 0".']); },
        hablar: async (api) => { await api.dialog('gertrudis', 'G0'); },
        'usar:cafe': async (api) => { await lcd(api, 'NO SE ADMITEN DEVOLUCIONES. NI SENTIMIENTOS.'); },
        'dar:cafe': async (api) => { await lcd(api, 'NO SE ADMITEN DEVOLUCIONES. NI SENTIMIENTOS.'); },
        'usar:libreta_replicas': async (api) => { await lcd(api, 'NO ACEPTO RÉPLICAS. SOLO SALUDOS.'); },
        'usar:tarjeta_becario': async (api) => { await lcd(api, 'NO ACEPTO TARJETAS. NI SOBORNOS. SOLO MODALES.'); },
        'dar:tarjeta_becario': async (api) => { await lcd(api, 'NO ACEPTO TARJETAS. NI SOBORNOS. SOLO MODALES.'); },
        'usar:sobre_azucar': async (api) => { await lcd(api, 'EL AZÚCAR LO PONGO YO. CUANDO TE LO MERECES.'); },
        'usar:boli_muerto': async (api) => { await lcd(api, 'NO RECOJO CADÁVERES. PRUEBE EN SECRETARÍA.'); },
        'usar:*': async (api) => { await lcd(api, 'E-46: ESO NO ES UN CAFÉ.'); },
        'dar:*': async (api) => { await lcd(api, 'E-46: ESO NO ES UN CAFÉ.'); },
        empujar: 'No pienso pegar a una cafetera. Es la única que trabaja de noche.',
        tirar: 'No pienso pegar a una cafetera. Es la única que trabaja de noche.',
        coger: 'Pesa como un convenio colectivo.',
        abrir: 'Dentro hay posos de 2009 y un tornillo de la Ferretería Hermanos Tornillo.',
        cerrar: 'Ya está cerrada. Abierta, solo con buenas palabras.',
        usar: 'Pulso el botón del café. Me mira. Así no. Habrá que hablarle.',
      } },
    { id: GV, when: ['acto_3_iniciado', '!juego_terminado'], defaultVerb: 'hablar',
      murmurs: ['Eso, en todo caso, lo hablamos.', 'Diecinueve años. Ni un marrón. Ni uno.', 'Hoy me han preguntado tres veces por mi salud. Debo de estar fatal.'],
      handlers: {
        mirar: 'Gervasio, delante de Gertrudis. Ella no le sirve. Él no la saluda.',
        hablar: hablarGervasio,
        'dar:cafe': async (api) => { await gv(api, '¿Café? Eso lo coges tú. Yo espero a que la máquina me lo ofrezca.'); },
        'dar:acta_reunion': async (api) => { await gv(api, 'Eso ya no es mío. Lo he delegado. En ti. Lo hablamos.'); },
        'dar:ticket_n1': async (api) => { await gv(api, 'Un ticket. Eso es de Sistemas. Lo hablamos con Sistemas.'); },
        'dar:*': async (api) => { await gv(api, 'Eso lo coges tú, que tienes la agenda más limpia.'); },
        empujar: 'Diecinueve años sin moverse de su sitio. No voy a ser yo quien empiece.',
        tirar: 'Si le tiro de la manga, me la delega.',
        coger: 'Gervasio no se coge. Se le espera. Desde marzo.',
      } },
  ],

  dialogs: { gertrudis: dialogoGertrudis, gervasio_office: dialogoGervasio },
  duels: { gervasio: dueloGervasio },
  scenes: {},
  defaults: {},
  ambient: [],

  async onEnter(api) {
    // (Gertrudis mide 66 px: escala 1,5 en su definición, content/actors.js)
    // sin escenas de entrada: deja pasar los avisos automáticos (adenda §2)
  },
}, art);
