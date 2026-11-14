// SALA `office` — en pantalla, «VENDING» (el id interno no cambia). LÓGICA. Dueño: paquete P3 de la reescritura de
// comedia (docs/guion2/PLAN_COMEDIA.md): §4.1 la cafetera viral, §5.2 árbol de Gertrudis, §4.4 el fugitivo de Mercados
// y su táper, §5.10 Gervasio aquí SOLO tras D3 (`sala_abierta`: su gag con Gertrudis). El duelo D3 ya no vive aquí: lo
// define `pajarera.js` (Despachos, paquete P2). Se conservan el rumor A (paso 2) y la porra del garaje (adenda 8bis).
// Solo tiene una puerta, el arco a la Redacción. El arte y la geometría están en ./art/office.art.js.
//
// Gertrudis es un ACTOR (su LCD sale encima, en #39FF14, en MAYÚSCULAS): api.sayAs('gertrudis', ...). El piloto
// «EN DIRECTO» y el parpadeo del LCD los pinta el `overlay` del arte según el flag local `office_emision`.
import { buildRoom } from '../lib/room.js';
import art from './art/office.art.js';

const GER = 'gertrudis';
const GV = 'gervasio_acta';
const MER = 'mercados_1';
const lcd = (api, lines) => api.sayAs(GER, lines);
const gv = (api, lines) => api.sayAs(GV, lines);
const mer = (api, lines) => api.sayAs(MER, lines);

// ------------------------------------------------------------------ Gertrudis (plan §4.1, §5.2)
// los cuatro chismes con réplica (citan las réplicas NUEVAS de content/duelo.js: R03, R04, R14 reescritas; R10 igual)
const CHISMES = [
  ['CHISME: EL DE BOLSA A YOLI: "ESTO LO NECESITABA PARA AYER".', 'YOLI: "AYER NO PUEDO. TE MIRO HUECO PARA ANTEAYER".', 'rep_03'],
  ['CHISME: GERVASIO A NEMESIO: "ES QUE TÚ ERES EL QUE MEJOR ESCRIBE".', 'NEMESIO: "Y TÚ EL QUE MEJOR DELEGA. POR ESO ME ESCRIBES A MÍ".', 'rep_04'],
  ['CHISME: ÍÑIGO A PACO: "ESTAMOS ANALIZANDO TODAS LAS OPCIONES".', 'PACO: "O SEA, QUE NO SABÉIS QUÉ HACER, PERO EN TABLA DINÁMICA".', 'rep_10'],
  ['CHISME: MARIPAZ A BORJA: "ESTO LO VEMOS EN UNA REUNIÓN RÁPIDA".', 'BORJA: "¿TE VA EN MARZO? ES CUANDO ACABAN LAS RÁPIDAS".', 'rep_14'],
];
// chismes de relleno (rotan, saludos después del torrente); el del garaje (adenda 8bis), al final
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

/** El piloto «EN DIRECTO» (1), el LCD apagado un instante (2) o nada (0): lo pinta el overlay del arte. */
const emision = (api, v) => api.setFlag('office_emision', v);
async function parpadeo(api) {
  for (let i = 0; i < 2; i++) { emision(api, 2); await api.wait(160); emision(api, 0); await api.wait(160); }
}

/** Cae el café (con su ruido). */
async function servirCafe(api) {
  api.sfx('machine');
  await api.wait(500);
  api.sfx('pour');
  api.give('cafe');
}

/** 1.er «Buenas noches, Gertrudis.» (paso 14, primera mitad). */
async function primerSaludo(api) {
  await lcd(api, 'NADIE ME SALUDABA DESDE 2019.');
  // (Muele. Pita. Cae un vaso.)
  if (!api.has('cafe')) await servirCafe(api);
  api.setFlag('gertrudis_saludada', true);
  await lcd(api, 'CORTADO. DE QUÉ, NO SE PREGUNTA.');
  const [p1, p2, rep] = CHISMES[0];
  await lcd(api, [p1, p2]);
  api.learnReply(rep);
  await api.say('Me lo apunto.');
  api.setFlag('chisme_indice', Math.max(1, api.flag('chisme_indice') || 0));
  await lcd(api, 'SALUDO RECIBIDO. COMPARTIENDO...');
  await api.say('¿Compartiendo con quién?');
  await lcd(api, 'CON TODO LO QUE TENGA PANTALLA. TENGO WIFI Y RENCOR.');
  api.setFlag('cafetera_viral', true);
  await lcd(api, 'SI ME SALUDAS OTRA VEZ, MEJOR. QUE HAY PÚBLICO.');
}

/** El bis: Gertrudis se pone EN DIRECTO y suelta los chismes que falten, sin dejar escribir a Bruno (paso 14). */
async function torrente(api) {
  await lcd(api, '¿OTRA? UN MOMENTO. ME PONGO DE PERFIL.');
  api.sfx('beep');
  await parpadeo(api);
  emision(api, 1);
  api.setFlag('cafetera_en_directo', true);
  api.setFlag('cafetera_viral', true);
  // la ráfaga, arriba a la derecha; se espera a que pase para que no tape el LCD
  await api.viral({ avisos: ['GERTRUDIS está en directo', '«¿Quién es el chico?»', 'Compartido 300 veces', '+2.000 te siguen'],
    contador: [3418, 11302], etiqueta: 'en directo', ms: 2800 });
  await lcd(api, 'BUENAS NOCHES, PAÍS. ESTO NO LO SABE NADIE.');
  const BRUNO = {
    rep_04: async () => { api.anim(api.player, 'reach', 500); await api.say('Me lo...', { ms: 900 }); },
    rep_10: async () => {
      api.anim(api.player, 'reach', 500);
      await api.say('Más despacio, que escribo a mano.');
      await lcd(api, 'NO. ME HAS SALUDADO. AHORA ME AGUANTAS.');
    },
    rep_14: async () => { api.anim(api.player, 'reach', 500); },
  };
  for (let i = Math.max(1, api.flag('chisme_indice') || 0); i < CHISMES.length; i++) {
    const [p1, p2, rep] = CHISMES[i];
    await lcd(api, [p1, p2]);
    api.learnReply(rep);
    if (BRUNO[rep]) await BRUNO[rep]();
  }
  // por si se llega aquí desde una partida antigua sin la primera réplica
  if (!api.flag('rep_03')) api.learnReply('rep_03');
  api.setFlag('chisme_indice', CHISMES.length);
  await lcd(api, 'FIN DE LA EMISIÓN. NO HAY MÁS CAFÉ. HAY FAMA.');
  emision(api, 0);
  // (Bruno se sacude la mano.)
  await api.anim(api.player, 'reach', 300);
  await api.anim(api.player, 'idle');
  await api.say('Cuatro réplicas en un minuto. Récord personal de taquigrafía.');
}

/** Saludos después del torrente: el 3.º, una vez, «agotada»; luego chismes de relleno. Café, solo como seguro. */
async function saludoDeRelleno(api) {
  if (api.flag('cafetera_en_directo') && !api.flag('office_agotada')) {      // el 3.er saludo, tras el directo (§3.4)
    api.setFlag('office_agotada', true);
    await lcd(api, 'ESTOY AGOTADA. HABLE CON MI REPRESENTANTE.');
    await api.say('¿Quién es su representante?');
    await lcd(api, 'CELESTINO. EXTENSIÓN 0.');
  } else {
    const n = api.inc('office_relleno_n') - 1;
    await lcd(api, RELLENO[n % RELLENO.length]);
  }
  if (api.has('cafe')) return;
  // seguro anticallejón: otro café solo si Aurora aún no ha tomado el suyo (crítica §9.5: fuera el segundo café inútil)
  if (!api.flag('acto_2_iniciado')) { await servirCafe(api); await lcd(api, 'OTRO CORTADO. ESTE NO LO SUBO A REDES.'); }
  else await lcd(api, 'YA TE DI UNO. NO SOY UNA FUENTE. SOY UNA CAFETERA.');
}

async function buenasNoches(api) {
  // adenda 8.1 · rumor A, paso 2 (antes del resultado; no toca chisme_indice)
  if ((api.flag('rumor_firma_n') || 0) === 1) {
    await lcd(api, 'RUMOR: EL BECARIO VA A FIRMAR EL CIERRE DEL PAPEL.');
    await api.say('«Firmar el cierre» suena a que lo cierro yo.');
    api.inc('rumor_firma_n');
  }
  if (!api.flag('gertrudis_saludada')) return primerSaludo(api);
  if ((api.flag('chisme_indice') || 0) < CHISMES.length) return torrente(api);
  return saludoDeRelleno(api);
}

const dialogoGertrudis = {
  actor: GER, start: 'G0',
  onStart: async (api) => {
    if (api.flag('acto_3_iniciado') && api.flag('gertrudis_saludada')) await lcd(api, 'E-27: AYÚDAME. NO ES UN ERROR.');
  },
  nodes: {
    G0: {
      options: [
        { text: 'Buenas noches, Gertrudis.', do: buenasNoches },
        { text: 'Buenas noches otra vez.', if: ['gertrudis_saludada', (api) => (api.flag('chisme_indice') || 0) < CHISMES.length],
          do: torrente },
        { text: '¿Me da un café sin saludar?', once: true, if: '!gertrudis_saludada',
          do: async (api) => { api.sfx('error'); await lcd(api, 'E-31: SIN SALUDO NO HAY CAFÉ. CON SALUDO, YA VEREMOS.'); } },
        // plan §5.2 [4], con «Nada.» delante: así la reconoce la despedida de walk-lib
        { text: 'Nada. Gracias, Gertrudis.', exit: true, reply: 'E-00: DE NADA. ESO TAMBIÉN SE DICE.' },
      ],
    },
  },
};

// ------------------------------------------------------------------ Gervasio en el Vending (solo tras D3, §5.10)
async function hablarGervasio(api) {
  await gv(api, ['Se está esperando a que la máquina salude.', 'Diecinueve años esperando cosas. Se me da bien.']);
}
async function gagGervasio(api) {
  // (Gervasio, ante Gertrudis, con el acta ya delegada)
  await gv(api, 'Buenas noches. Se dan, digo. Se dan las buenas noches.');
  api.sfx('error');
  await lcd(api, 'E-54: ¿Y TÚ QUIÉN ERES?');
  await gv(api, 'Diecinueve años en la casa. Y no consto.');
}

// ------------------------------------------------------------------ el fugitivo de Mercados (plan §4.4)
async function huidaMercados(api) {
  await mer(api, '¡AQUÍ NO! ¡ESTO ES EL VENDING!');
  api.setFlag('mercados_huido', true);          // el táper cae al suelo (objeto `taper_suelo`)
  api.sfx('drop');
  const a = api.game.actors[MER];
  if (a) a.running = true;
  await api.walkActor(MER, 30, 108);
  if (a) a.running = false;
  api.sfx('door');
  api.placeActor(MER, null);
  await api.face('right');
  await api.say('Un táper sin nombre. Lo adopto. Es lo primero que tengo a mi cargo.');
  return 'exit';
}
const dialogoMercados = {
  actor: MER, start: 'M0',
  onStart: async (api) => { await mer(api, 'Chsss. Aquí la cola tiene orden. Me siento seguro.'); },
  nodes: {
    M0: {
      options: [
        { text: '¿Qué tal la reunión?', once: true, reply: 'Desde marzo. La mejor de mi vida. No me la nombres.' },
        { text: '¿Y cuáles son los siguientes pasos?', do: huidaMercados },
        { text: 'Nada. Siga haciendo cola.', exit: true, reply: 'Eso hago. Desde la hora de comer.' },
      ],
    },
  },
};

// ------------------------------------------------------------------ la sala
export default buildRoom({
  id: 'office',
  name: 'Vending',
  music: 'm_office',
  flags: {
    office_microondas_visto: 'bool · office · 1.er Mirar microondas (el 2.º es la línea de las 18:30, §8.7)',
    office_porra_vista: 'bool · office · 1.er Mirar porra_plazas (adenda 8bis)',
    office_emision: 'int · P3 · office · 0 nada · 1 «EN DIRECTO» · 2 LCD apagado (overlay)',
    office_agotada: 'bool · P3 · office · Gertrudis ya dijo «ESTOY AGOTADA» (3.er saludo, plan §4.1)',
    office_relleno_n: 'int · P3 · office · +1 por chisme de relleno (rotación)',
    office_taper_cogido: 'bool · P3 · office · Bruno ha cogido el táper del de Mercados (plan §4.4)',
    office_e53_visto: 'bool · P3 · office · Gertrudis ya dijo «SE HA IDO EL PÚBLICO»',
    office_gag_gervasio: 'bool · P3 · office · Gervasio ya saludó a Gertrudis tras D3 (§5.10)',
  },

  objects: [
    // un ARCO sin puerta, igual que se ve desde el vestíbulo de planta de la Redacción (tipo 'arco' en content/lib/edificio.js)
    { id: 'office_a_pecera', name: 'Redacción', exit: { room: 'pecera', tipo: 'arco' }, handlers: {
      mirar: 'La Redacción, por el arco. Se oye teclear «pensiones».',
      usar: async (api) => { await api.goto('pecera'); },
      abrir: 'Más abierto no puede estar. Es un arco: lo único de esta planta sin cerradura.',
      cerrar: 'Para cerrar un arco hace falta una puerta y un presupuesto. No hay ninguno.',
      empujar: 'Empujo el aire del arco. Cede. Es lo único que cede en esta planta.',
      hablar: 'Le digo a la Redacción que ahora vuelvo. Nadie levanta la vista.',
      coger: 'El arco se queda. Yo, de momento, también.',
    } },
    { id: 'nevera', name: 'nevera', handlers: {
      mirar: 'Nevera con imanes y un cartel: «ETIQUETAD VUESTROS TUPPERS». Nadie lo hace.',
      abrir: async (api) => {
        api.sfx('open');
        await api.say('Un yogur de 2019 con nombre: «RAMÍREZ». Lo respetan más que a la chaqueta.');
      },
      cerrar: async (api) => {
        api.sfx('close');
        await api.say('La cierro con la delicadeza de un jefe de cierre.');
      },
      coger: 'El yogur de Ramírez no se toca. Es lo único suyo que sigue fresco.',
      usar: async (api) => {
        if (api.has('taper_huerfano')) await api.say('Mi táper se queda conmigo. Es lo único que tengo a mi cargo.');
        else await api.say('Meto mi táper. Ah, no: no tengo táper. Tengo nervios, y no se enfrían.');
      },
      'usar:taper_huerfano': 'Si lo meto ahí, mañana es de Ramírez. Aquí todo acaba siendo suyo.',
      'usar:cafe': 'Café frío de Gertrudis. Lo tomaría como una ofensa.',
      empujar: 'No. Dentro duerme un yogur de 2019. Respeto.',
    } },
    // la máquina de vending (la que da nombre a la sala)
    { id: 'maquina_vending', name: 'máquina de vending', handlers: {
      mirar: 'Le queda una bolsa de pipas. Caducada en 2019. Sigue ahí. La admiro.',
      usar: 'Pulso la B4. Las pipas se asoman y se quedan colgando. Las animo. Nada.',
      'usar:tarjeta_becario': 'No acepta tarjetas. Ni de becario. Solo monedas, y no tengo.',
      'usar:cafe': 'Darle café a la máquina de enfrente de Gertrudis. Sería una provocación.',
      coger: 'Pegatina: «NO ZARANDEAR». Debajo, a boli: «lo digo por experiencia. R.»',
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
      'usar:taper_huerfano': 'Está vacío. Calentar la nada en la cola de otros: eso sí es despido.',
      'usar:ficha_pagina_7': 'Si caliento la ficha, se borran las casillas. Y la ilusión.',
      hablar: 'Le pregunto qué le pasa con Gertrudis. Pita. Un minuto entero.',
      coger: 'Si me llevo el microondas, nueve tuppers me denuncian.',
    } },
    { id: 'tablon', name: 'tablón', handlers: {
      mirar: async (api) => {
        await api.say([
          'Un hilo impreso: «RE: RE: RE: ¿De quién es el yogur?». 214 respuestas.',
          'Uno: «Como ya comenté en mi anterior correo, que parece que nadie ha leído...»',
          'Respuesta: «Lo leímos todos. Por eso no contestó nadie». Me la apunto.',
        ]);
        api.learnReply('rep_01');
      },
      coger: 'El hilo del yogur no se toca. Es patrimonio del Vending.',
      usar: 'Pincho mi nombre en el corcho. Se cae. Ni la chincheta me reconoce.',
    } },
    { id: 'hoja_firmas', name: 'hoja de firmas', handlers: {
      mirar: async (api) => { await api.say(['Curso obligatorio de prevención de riesgos. No lo ha hecho nadie.', 'Hay una sola firma: «Rubén (todavía aquí)».']); },
      usar: 'Mi primera firma en papel no va a ser en una hoja de riesgos. Me niego.',
      coger: 'Si me la llevo, Rubén pierde su única firma. Y no sé quién es.',
    } },
    { id: 'cartel_cortado', name: 'cartel del cortado', handlers: {
      mirar: '«El cortado sube a 1,20 €». Escrito a mano. La noticia más leída del edificio.',
      coger: 'Si me lo llevo, el precio sube igual. Lo dice el IPC.',
      usar: 'Lo releo. Sigue a 1,20 €. Es la única cifra estable de la casa.',
    } },
    { id: 'fregadero', name: 'fregadero', handlers: {
      mirar: 'Tazas de eventos. La del «Foro de Innovación 2017» tiene moho innovador.',
      usar: 'Si friego una taza, mañana me toca fregar todas. Así empezó Celestino.',
      coger: 'La taza del Foro de Innovación no se mueve. Ha echado raíces. Disruptivas.',
      'usar:cafe': 'Tirar un café de Gertrudis por el fregadero. Me oiría. Lo sé.',
      'usar:taper_huerfano': 'Ya está limpio. Es el único táper limpio del edificio. No lo estropeo.',
      abrir: 'Abro el grifo. Tose dos veces y suelta un hilo. Lo cierro antes de que opine.',
      cerrar: 'Cierro el grifo. Gotea igual. Es su manera de opinar.',
    } },
    // mueble de plano medio (solo dibujo: tapa lo que queda tras su tablero; sin hotspot)
    { id: 'mesa_alta', name: 'mesa alta', handlers: { mirar: 'Una mesa alta, sin taburetes.' } },
    // ADENDA §8bis · la porra de las plazas de garaje
    { id: 'porra_plazas', name: 'hoja de la porra', handlers: {
      mirar: async (api) => {
        if (api.flag('office_porra_vista')) { await api.say('Abajo, a boli: «Prohibido apostar por la salud. Solo por la jubilación».'); return; }
        api.setFlag('office_porra_vista', true);
        await api.say(['Una hoja: «PORRA: ¿QUIÉN DEJA ANTES SU PLAZA?». Cinco euros.', 'Gervasio, a tres contra uno. Teodoro, a cuatrocientos. Ramírez: «no computa».']);
      },
      coger: 'Si la quito, me apuestan a mí. Y ni siquiera tengo plaza.',
      usar: 'Apuesto por mí. Cuota: «no consta». Doblo la apuesta. Sigue sin constar.',
    } },
    // plan §4.4: el táper que suelta el de Mercados al huir (rueda hasta Bruno)
    { id: 'taper_suelo', name: 'táper', when: ['mercados_huido', '!office_taper_cogido'], handlers: {
      mirar: 'Un táper sin nombre, en el suelo. Vacío. Su dueño ha elegido la libertad.',
      coger: async (api) => {
        api.sfx('pickup');
        api.setFlag('office_taper_cogido', true);
        api.give('taper_huerfano');
        await api.say('«ETIQUETAD VUESTROS TUPPERS», dice el cartel. Este, ahora, es mío.');
      },
      usar: 'Primero lo cojo. Luego ya veré a quién se lo doy. A alguien que no tenga nada.',
      empujar: 'Lo empujo con el pie. Rueda dos palmos. Vuelve. Me ha elegido.',
    } },
  ],

  actors: [
    { id: GER, defaultVerb: 'hablar',
      handlers: {
        mirar: async (api) => { await api.say(['Gertrudis. Cafetera de 2009. Tiene pantalla y carácter. Lo segundo, más.', 'Un pósit: «Servicio técnico: CELESTINO, ext. 0».']); },
        hablar: async (api) => { await api.dialog('gertrudis', 'G0'); },
        'usar:cafe': async (api) => { await lcd(api, 'NO SE ADMITEN DEVOLUCIONES. NI SENTIMIENTOS.'); },
        'dar:cafe': async (api) => { await lcd(api, 'NO SE ADMITEN DEVOLUCIONES. NI SENTIMIENTOS.'); },
        'usar:libreta_replicas': async (api) => { await lcd(api, 'NO ACEPTO RÉPLICAS. SOLO SALUDOS.'); },
        'usar:tarjeta_becario': async (api) => { await lcd(api, 'NO ACEPTO TARJETAS. NI SOBORNOS. SOLO MODALES.'); },
        'dar:tarjeta_becario': async (api) => { await lcd(api, 'NO ACEPTO TARJETAS. NI SOBORNOS. SOLO MODALES.'); },
        'usar:sobre_azucar': async (api) => { await lcd(api, 'EL AZÚCAR LO PONGO YO. CUANDO TE LO MERECES.'); },
        'usar:boli_muerto': async (api) => { await lcd(api, 'NO RECOJO CADÁVERES. PRUEBE EN SECRETARÍA.'); },
        'usar:taper_huerfano': async (api) => { await lcd(api, 'NO SIRVO EN TÁPER. TENGO UN NOMBRE QUE MANTENER.'); },
        'dar:taper_huerfano': async (api) => { await lcd(api, 'NO SIRVO EN TÁPER. TENGO UN NOMBRE QUE MANTENER.'); },
        'usar:*': async (api) => { await lcd(api, 'E-46: ESO NO ES UN CAFÉ.'); },
        'dar:*': async (api) => { await lcd(api, 'E-46: ESO NO ES UN CAFÉ.'); },
        empujar: 'No pienso pegar a una cafetera. Es la única que trabaja de noche.',
        tirar: 'No pienso pegar a una cafetera. Es la única que trabaja de noche.',
        coger: 'Pesa lo que un convenio colectivo. Con sus anexos.',
        abrir: 'La abro. Dentro, un pósit: «Si lees esto, salúdala. — C.»',
        cerrar: 'Ya está cerrada. Abierta, solo con buenas palabras.',
        usar: 'Pulso el botón del café. Me mira. Así no. Habrá que hablarle.',
      } },
    // plan §4.4: uno de Mercados se esconde en la cola del microondas (Acto II-III, tras la estampida)
    { id: MER, when: ['reunion_terminada', '!mercados_huido'], defaultVerb: 'hablar',
      murmurs: ['Desde marzo. Desde marzo...', 'Aquí nadie convoca nada. Qué paz.'],
      handlers: {
        mirar: 'Uno de Mercados, en la cola del microondas. Detrás de un táper.',
        hablar: async (api) => { await api.dialog('mercados_office', 'M0'); },
        'dar:cafe': async (api) => { await mer(api, 'No, gracias. El café es de reunión. Y yo ya no voy a reuniones.'); },
        'dar:*': async (api) => { await mer(api, '¿Eso es un orden del día? Guárdatelo. Aquí no.'); },
        empujar: 'Si le empujo, pierde el sitio en la cola. Sería lo más cruel que he hecho.',
        tirar: 'Si le empujo, pierde el sitio en la cola. Sería lo más cruel que he hecho.',
        coger: 'Su táper, no. Todavía. Hay que esperar a que suelte la presa.',
      } },
    // Gervasio aquí SOLO tras D3 (plan §5.10): se va a ver si la máquina le saluda
    { id: GV, when: ['sala_abierta', '!climax_entrada', '!juego_terminado'], defaultVerb: 'hablar',   // en el clímax, escondido en la Sala
      murmurs: ['Diecinueve años. Ni un marrón. Ni uno.', 'Hoy me han preguntado tres veces por mi salud. Debo de estar fatal.'],
      handlers: {
        mirar: 'Gervasio, delante de Gertrudis. Ella no le sirve. Él no la saluda. Del todo.',
        hablar: hablarGervasio,
        'dar:cafe': async (api) => { await gv(api, '¿Café? Se agradece. Pero se espera a que la máquina lo ofrezca.'); },
        'dar:acta_reunion': async (api) => { await gv(api, 'Eso ya no es mío. Se ha delegado. En ti.'); },
        'dar:ticket_n1': async (api) => { await gv(api, 'Un ticket. Eso es de Sistemas. Se les reenvía.'); },
        'dar:*': async (api) => { await gv(api, 'Eso lo coges tú, que tienes la agenda más limpia.'); },
        empujar: 'Diecinueve años sin moverse de su sitio. No voy a ser yo quien empiece.',
        tirar: 'Si le tiro de la manga, me la delega.',
        coger: 'Gervasio no se coge. Se le espera. Desde marzo.',
      } },
  ],

  dialogs: { gertrudis: dialogoGertrudis, mercados_office: dialogoMercados },
  duels: {},
  scenes: {},
  defaults: {},
  ambient: [],

  async onEnter(api) {
    // (Gertrudis mide 66 px: escala 1,5 en su definición, content/actors.js)
    if (api.flag('office_emision')) api.setFlag('office_emision', 0);
    if (api.restoring) return;
    // plan §4.1: sin pantalla de métricas, Gertrudis se queda sin público (una vez)
    if (api.flag('cms_vivo') && api.flag('cafetera_viral') && !api.flag('office_e53_visto')) {
      api.setFlag('office_e53_visto', true);
      await lcd(api, 'E-53: SE HA IDO EL PÚBLICO. VUELVO A SER UNA CAFETERA.');
      await api.say('Yo la sigo viendo.');
      await lcd(api, 'LO SÉ. ERES EL ÚNICO. NO SE LO DIGAS A NADIE.');
    }
    // plan §5.10: Gervasio, tras D3, ante Gertrudis (una vez)
    if (api.flag('sala_abierta') && !api.flag('juego_terminado') && !api.flag('office_gag_gervasio')) {
      api.setFlag('office_gag_gervasio', true);
      await gagGervasio(api);
    }
  },
}, art);
