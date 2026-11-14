// SALA `vestibulo` — LÓGICA. Dueño: P1 · «Vestíbulo, Sistemas y final» (docs/guion2/PLAN_COMEDIA.md §11 P1).
// Plan de comedia: §5.1 (árbol de Celestino), §4.7 (Celestino narra los hitos al entrar), §4.1 (el torno saluda con la
// cafetera viral), §6.3 (líneas de Bruno de esta sala), §10.1 (fuera el rumor D y su desmentido). Se quedan: la intro
// (7.1), el rumor A1 (planta), la frente sellada, el Ibex, el cuadro de plazas (8bis) y la rama del organigrama.
// Escenas que registra esta sala (globales): `intro` (§7.1, la lanza game.onStart) y, desde ../escenas/final.js,
// `final` (§9: epílogo, fe de erratas y créditos; la lanza el clímax de P4) con su alias `epilogo`.
// El arte y la geometría están en ./art/vestibulo.art.js: aquí no hay ni una coordenada propia.
// Estados que el arte puede dibujar (sprites por estado): `cuadro_plazas`: 'normal' | 'tachado' (epílogo, 8bis.2);
// `puerta_calle`: 'noche' | 'amanecer' (epílogo: final.js lo pone al empezar la escena; cambia cielo, luz del suelo y lluvia).
// Flags que el arte puede leer: torno_abierto (alas recogidas + LED verde + franja de luz; la lógica lo pone ANTES de la
// línea que lo comenta), foto_en_organigrama (foto en VACANTE), planta_empujada_n ≥ 1 (micrófono a la vista).
// Objetos decorativos del arte (hotspot: false): torno_luces, fardo_periodicos (oculto hasta 7.5). Paragüero y cartel: solo Mirar.
// La sala es `dynamic` para que el fondo se repinte cuando cambian.
import { buildRoom } from '../lib/room.js';
import art from './art/vestibulo.art.js';
import { finalScenes } from '../escenas/final.js';
import { ascensorObjeto } from '../lib/ascensor.js';
import { narrarHito } from '../lib/celestino.js';

const C = 'celestino';
const LED = '#FF7E6A';
const acto = (api) => (api.flag('acto_3_iniciado') ? 3 : api.flag('acto_2_iniciado') ? 2 : 1);
const enEpilogo = (api) => !!api.flag('lector_derribado');
const say = (...lines) => async (api) => { await api.say(lines); };
const cel = (...lines) => async (api) => { await api.sayAs(C, lines); };

// §8.4: el Ibex de Celestino, por acto (rota dentro de cada acto)
const IBEX = {
  1: ['¡Ibersideral entra por la banda! ¡Sube un 0,2! ¡Qué técnica!',
    '¡Las eléctricas tocan, tocan, tocan... y nada! ¡Plano!',
    '¡Banco Robledal se duerme en el área! ¡Así no, chaval!'],
  2: ['¡Penalti a las eléctricas! ¡Eso no era! ¡Árbitro, que mire el supervisor!',
    '¡Hidrovoltia calienta en la banda! ¡Algo trama el míster!',
    'Cierre plano. Empate a cero. Y el árbitro sin añadir descuento.',
    '¡Me han puesto un narrador automático! ¡Narra sin bufanda! ¡Fuera de juego!'],
  3: ['¡Prórroga! ¡El mercado americano mete presión! ¡Aguanta, Ibex, aguanta!',
    '¡El Robledal pide la hora! ¡No quiere que acabe el partido!'],
};
const ibexLine = (api, n) => { const l = IBEX[acto(api)]; return l[(Math.max(1, n) - 1) % l.length]; };

// adenda 8bis.1: el cuadro de llaves rota 1…5 (la 5, solo en el Acto III) y después entre la 2 y la última
const PLAZAS = [
  ['El cuadro de llaves del garaje. Doce plazas. Ciento doce aspirantes.', 'Debajo, a lápiz, la línea de sucesión. Hay más tachones que nombres.'],
  ['«Plaza 3: Ramírez. Libre desde 2019. Ocupada por su ausencia».', 'Es la más codiciada. Nadie la usa y todos la quieren.'],
  ['«Sucesión plaza 3: Maripaz, Borja, Yoli, el ficus».', 'Me busco. Debajo del ficus: «Vacante (bici)». Tachado.'],
  ['«Plaza 1: Teodoro C., 1997». No ha salido del edificio desde entonces.', 'Nadie se atreve a pedírsela. Ni a desearle nada.'],
  ['«Plaza 9: Optimal Brains, hasta 2031». Pegado encima de tres herederos.'],
];

// §5.1: saludos de Celestino a partir de la 2.ª conversación (rotan; el 2.º, solo con el torno abierto)
const SALUDOS = [
  () => '¡Vuelve el chaval al vestíbulo! ¡Sin balón, pero con ganas!',
  (api) => (api.flag('torno_abierto') ? '¡Vacante entra por la banda! ¡Se le nota el organigrama!' : null),
  () => '¡Otra vez aquí! ¡Este chaval pisa más área que el portero!',
];

// ------------------------------------------------------------------ §7.1 Intro
async function intro(api) {
  await api.cutscene(async () => {
    await api.fadeOut(0);
    api.music(null, 0);
    await api.narrate(['Viernes, 18:30. Cierre de la edición del sábado: 21:00.', 'A las 18:30 ya se ha ido casi todo el mundo.',
      'Bruno Pellejo. Seis años de becario. 4.112 piezas en la web.', 'Cero en papel.']);
    api.music('m_vestibulo', 1.5);
    api.face('right');
    await api.fadeIn(900);
    api.sfx('step');
    await api.walkTo(74, 120);
    await api.anim('bruno', 'reach', 300);                                  // se sacude la lluvia
    api.face('down');
    api.faceActor(C, 'up');                                                  // Celestino, de espaldas con su periódico: no pinta nada en la llamada
    const A = 'abuela_remedios';
    // la llamada con el móvil de Bruno en primer plano (api.phone): se ve QUIÉN llama y que habla desde el móvil
    await api.phone.call({ caller: A, label: 'Abuela' }, async () => {
      await api.phone.say(['¿Bruno? ¿Has comido? Se te nota en la voz que no has comido.']);
      await api.say('He comido, abuela. Un café.');
      await api.phone.say('Eso es una bebida, hijo. ¿Y mañana sales en el periódico?');
      await api.say('Salgo todos los días, abuela. En la web.');
      await api.phone.say('En el de papel, digo. En el de verdad. El que mancha.');
      await api.say('...');
      await api.say('Mañana. Mañana salgo en el de papel. Te lo prometo.');
      await api.phone.say('¡Ay, qué ilusión! Se lo digo a la del quiosco. Y a la del pan.');
      await api.say('No hace falta que se lo digas a todo el...');
      await api.phone.say('Ya está. Lo he dicho en el grupo del pueblo. Abrígate.');
    });
    await api.wait(300);
    await api.say(['Vale. Tengo hasta las nueve para firmar en papel.', 'Y a todo un pueblo esperando en el quiosco.']);
    await api.walkTo('torno');
    await api.anim('bruno', 'reach', 350);
    api.sfx('error');
    await api.sayFrom('torno', 'USUARIO NO CONSTA EN ORGANIGRAMA.', { color: LED });
    api.faceActor(C, 'bruno');
    await api.sayAs(C, '¿Tú eres el nuevo?');
    api.face(C);
    await api.say('Llevo seis años.');
    await api.sayAs(C, 'Pues no te ha visto ni el torno.');
  });
  api.setFlag('intro_vista', true);
}

// ------------------------------------------------------------------ salidas
// GEOGRAFÍA (ver la cabecera del arte): calle y mostrador | línea de tornos | vestíbulo interior con ascensor y escalera.
// Cruzar el torno abierto = pasar por el carril, cruzar el vestíbulo interior y subir la escalera a la Redacción.
async function cruzarTorno(api) {
  api.sfx('click');
  await api.walkTo(246, 112);                       // por el carril de atrás, ya al otro lado
  await subirRedaccion(api);
}
async function subirRedaccion(api) {
  if (!api.flag('torno_abierto')) { await api.say('La escalera está al otro lado del torno. Y el torno, de su lado.'); return; }
  await api.walkTo('vestibulo_a_redaccion');
  api.sfx('step');
  await api.goto('pecera', 'vestibulo');
}
// el ascensor está detrás de los tornos: sin torno_abierto, Bruno se queda en la línea y no hay botonera
const ascensorBloqueado = async (api) => {
  if (api.flag('torno_abierto')) return false;
  await api.say('El ascensor está al otro lado del torno. Le saludo desde aquí. Por si acaso.');
  return true;
};

/** §4.1 · el torno también ha visto el vídeo de la cafetera (una vez, con cafetera_viral y el torno abierto). */
async function tornoViral(api) {
  if (!api.flag('cafetera_viral') || !api.flag('torno_abierto') || !api.once('vestibulo_torno_viral')) return false;
  await api.walkTo('torno');
  await api.say('Buenas noches, torno.');
  api.sfx('beep');
  await api.wait(700);                                                       // pitido largo
  await api.sayFrom('torno', 'BUENAS NOCHES, VACANTE. GRACIAS POR PREGUNTAR.', { color: LED });
  await api.say('No he preguntado nada.');
  await api.sayFrom('torno', 'YA. NADIE PREGUNTA.', { color: LED });
  return true;
}

// ------------------------------------------------------------------ Celestino (plan §5.1)
const celestinoDialog = {
  actor: C, start: 'C0',
  onStart: async (api) => {
    // rumor A, paso 1 (se queda): la planta lo ha oído todo
    if (api.flag('planta_oyo') && !(api.flag('rumor_firma_n') > 0)) {
      await api.sayAs(C, '¡Me informa la planta! ¡Que el chaval quiere firmar en papel!');
      await api.say('¿La planta habla?');
      await api.sayAs(C, 'Hablar no. Pero oye. Y yo oigo a la planta.');
      api.setFlag('rumor_firma_n', 1);
    }
    if (api.flag('bruno_sellado_frente') && api.once('vestibulo_celestino_frente')) {
      await api.sayAs(C, '¡Y el chaval aparece con tarjeta en la frente! ¡Roja! ¡Directa!');
    }
    if (api.once('vestibulo_celestino_primera')) { await api.sayAs(C, '¿Tú eres el nuevo?'); return; }
    const n = api.inc('vestibulo_saludo_n');
    for (let k = 0; k < SALUDOS.length; k++) {
      const l = SALUDOS[(n - 1 + k) % SALUDOS.length](api);
      if (l) { await api.sayAs(C, l); return; }
    }
  },
  nodes: {
    C0: {
      options: [
        { id: 'torno', text: 'El torno no me deja pasar.', if: '!torno_abierto', once: true,
          reply: ['¡El chaval encara el torno! ¡Saca la tarjeta! ¡Y nada! ¡No consta!',
            'El torno solo deja pasar a los que salen en esa pared.'],
          do: async (api) => {
            api.faceActor(C, 'left');                                              // señala el organigrama con la barbilla, sin mirarlo
            await api.wait(500);
            api.faceActor(C, 'bruno');
            await api.say('Yo salgo en la web. 4.112 veces.');
            await api.sayAs(C, 'La web no tiene pared, chaval.');
          } },
        { id: 'chicle', text: '¿Tiene algo para los nervios?', if: '!celestino_dio_chicle',
          reply: 'Chicle. Menta. Desde el Mundial del 82. Mira qué calma tengo.',
          do: async (api) => {
            await api.anim(C, 'reach', 350);
            api.sfx('pickup'); api.give('chicle');
            await api.sayAs(C, '¡Y el chaval se lo guarda! ¡No lo mastica! ¡Algo trama el míster!');
            await api.say('Lo reservo para una ocasión importante. O para pegar algo.');
          }, setFlag: 'celestino_dio_chicle' },
        { id: 'cafe', text: '¿Dónde hay café en esta casa?', once: true,
          reply: 'En el Vending. Gertrudis. La cafetera.',
          lines: [['player', '¿Y cómo se le pide?'], [C, 'Pedir, no. Se saluda. Dale las buenas noches.'],
            [C, 'Desde 2019 no se las da nadie. Yo sí, que soy su servicio técnico.']],
          setFlag: 'celestino_pista_gertrudis' },
        { id: 'cotilleo', text: '¿Algún cotilleo?', once: true,
          reply: ['¡Jugada de ascensor, ayer! Gervasio, al de Mercados:', '«Que esto no salga de aquí».',
            '¡Y el de Mercados la devuelve de primeras! «Tranquilo: de aquí no sale...»', '¡Y se cierra la puerta! ¡No oigo el final!'],
          lines: [['player', '¿«...ni el wifi»?'], [C, '¡Eso! ¡Ni el wifi! ¿Tú cómo lo sabes?'], ['player', 'Porque aquí no sale.']],
          do: async (api) => { api.learnReply('rep_05'); } },
        { id: 'ibex', text: '¿Cómo va el Ibex?',                                            // (rota, se queda)
          do: async (api) => {
            if (api.once('vestibulo_ibex_primera')) {
              await api.sayAs(C, '¿Me preguntas por el Ibex? ¿A mí? ¿En treinta años?');
              await api.anim(C, 'reach', 400);                                    // se ajusta la bufanda
              await api.wait(500);
            }
            await api.sayAs(C, ibexLine(api, api.inc('vestibulo_ibex_pregunta')));
          } },
        { id: 'aburre', text: '¿Y usted no se aburre aquí?', once: true,
          reply: ['¿Aburrirme? Entra la de la limpieza. Sale la de la limpieza.', 'Entra un becario. Pregunta tonterías. ¡Partidazo!'] },
        { id: 'jubilan', text: 'Si ponen el narrador automático, ¿le jubilan?', if: 'acto_2_iniciado', once: true,
          do: async (api) => {
            await api.wait(900);                                                   // deja de mascar
            await api.sayAs(C, ['...', 'Ese aparato no sabe lo que es una prórroga.', 'Tú pregúntame por el Ibex de vez en cuando. Por si acaso.']);
            await api.say('Perdone. Lo he dicho en voz alta. Era para dentro.');
          } },
        { id: 'plaza', text: '¿Cómo se consigue una plaza de garaje?',                        // adenda 8bis.1 (se queda)
          reply: ['Dos maneras: jubilarse o un «accidente». Con comillas.', 'La segunda no ha funcionado nunca. Pero se entrena mucho.'],
          lines: [['player', '¿Y una plaza de bici?'], [C, '¿Tú eres el nuevo?']] },
        { id: 'nada', text: 'Nada, Celestino.', exit: true, reply: '¡Y el chaval se retira al vestuario sin marcar!' },
      ],
    },
  },
};

export default buildRoom({
  id: 'vestibulo',
  name: 'Vestíbulo',
  music: 'm_vestibulo',
  dynamic: true,
  flags: {
    vestibulo_organigrama_visto: 'bool · 1.ª Mirar del organigrama hecha',
    vestibulo_logo_visto: 'bool · 1.ª Mirar del logo hecha (las siguientes, §8.8)',
    vestibulo_ibex_pregunta: 'int · rotación de «¿Cómo va el Ibex?» (Celestino)',
    vestibulo_buzon_abierto: 'bool · ya se ha leído la sugerencia del buzón',
    vestibulo_saludo_n: 'int · P1 · rotación del saludo de Celestino (plan §5.1)',
  },

  objects: [
    // estado `amanecer` (epílogo): final.js lo pone al empezar la escena; el arte cambia cielo, luz y lluvia
    { id: 'puerta_calle', name: 'puerta de la calle', state: 'noche', states: ['noche', 'amanecer'], handlers: {
      mirar: 'La calle. Ahí fuera hay gente que lee el periódico. Dicen.',
      abrir: 'Si salgo ahora, mi abuela se entera por otro.',
      usar: 'Si salgo ahora, mi abuela se entera por otro.',
      empujar: 'Hacia fuera, no. Si salgo, mi abuela se entera antes que yo.',
      tirar: 'Es de empujar. Lo pone. Lo pone en todas las puertas que no abro.',
      cerrar: 'Ya está cerrada. Lo que entra a estas horas no sale hasta el cierre.',
      hablar: 'Le digo a la lluvia que mañana salgo en papel. Sigue a lo suyo.',
    } },
    { id: 'organigrama', name: 'organigrama', handlers: {
      mirar: async (api) => {
        if (api.flag('foto_en_organigrama')) await api.say('Ahí estoy, en VACANTE. Es la primera vez que salgo en un organigrama.');
        else if (!api.flag('vestibulo_organigrama_visto')) await api.say('Un árbol genealógico en el que todos son primos y nadie sabe quién es el abuelo.');
        else await api.say('Abajo hay una casilla que pone VACANTE. Sin cara. Con hueco de becario.');
        api.setFlag('vestibulo_organigrama_visto', true);
      },
      'usar:tarjeta_becario': async (api) => {
        if (api.flag('foto_en_organigrama')) { await api.say('Ya estoy colgado. Dos veces sería duplicidad. Begoña me lo sellaría.'); return; }
        await api.anim('bruno', 'reach', 400);
        if (!api.flag('tarjeta_con_chicle')) {
          api.sfx('drop');
          await api.say('La pongo en la casilla. Se cae. Ni mi foto quiere estar en el organigrama.');
          return;
        }
        api.sfx('paper');
        api.setFlag('foto_en_organigrama', true);
        await api.say('Ya consto. Mi cara en el organigrama, con chicle. Huele a menta y a futuro.');
      },
      'usar:chicle': 'El chicle solo no. Necesito algo que pegar. Por ejemplo, mi cara.',
      coger: 'Es de la empresa. Y la empresa es del organigrama.',
      empujar: 'Si lo empujo, se reestructura solo. Y luego me lo facturan.',
      tirar: 'Si tiro del organigrama, me caen treinta jefes. Y ninguno ayuda.',
      hablar: 'Le hablo al organigrama. Treinta caras y ninguna me contesta. Es un comité.',
    } },
    { id: 'logo_pared', name: 'logo', handlers: {
      mirar: async (api) => {
        if (!api.flag('vestibulo_logo_visto')) await api.say('Letras de metal: «elContable.es». A la «e» le falta un tornillo.');
        else await api.say(['Un periódico económico que se llama el Contable.', 'Es lo más honesto que ha hecho nunca un periódico económico.']);
        api.setFlag('vestibulo_logo_visto', true);
      },
      coger: 'Si me llevo la «e», se queda en «lContable». Suena a gestoría con prisas.',
      tirar: 'Le falta un tornillo. Si tiro, le faltan dos. Y a mí, el trabajo.',
      empujar: 'No llego. Y si llego, la «e» se cae con todo su tornillo.',
      hablar: '«Buenas noches, Contable». La «e» se mueve un poco. Lo tomo como un sí.',
    } },
    { id: 'torno', name: 'torno', color: LED, exit: { room: 'pecera', tipo: 'torno' }, handlers: {
      ir: async (api) => {
        if (api.flag('torno_abierto')) { await cruzarTorno(api); return; }
        await api.say(api.flag('foto_en_organigrama') ? 'Primero la tarjeta. El torno es muy de protocolo.' : 'El torno no gira. Para él, no existo. Tendría que constar en algún sitio.');
      },
      mirar: 'Un torno con pantallita. Me mira como si yo fuera un ticket sin IVA.',
      usar: async (api) => {
        if (api.flag('torno_abierto')) { await tornoViral(api); await cruzarTorno(api); return; }
        await api.say('Sin tarjeta no gira. Y con tarjeta, de momento, tampoco.');
      },
      'usar:tarjeta_becario': async (api) => {
        await api.anim('bruno', 'reach', 350);
        if (!api.flag('foto_en_organigrama')) {
          api.sfx('error');
          await api.sayFrom('torno', 'USUARIO NO CONSTA EN ORGANIGRAMA.', { color: LED });
          await api.say('Consto en la web. 4.112 veces.');
          return;
        }
        api.sfx('beep');
        await api.sayFrom('torno', 'BIENVENIDO, VACANTE.', { color: LED });
        if (!api.flag('torno_abierto')) {
          api.setFlag('torno_abierto', true);
          await api.say('...Vacante. Bueno. Es un cargo.');
          // §4.7: primera retransmisión de la noche, desde el mostrador
          api.faceActor(C, 'bruno');
          if (await narrarHito(api)) {
            api.face(C);
            await api.say('Celestino, el Ibex.');
            await api.sayAs(C, 'El Ibex está plano, chaval. Tú no.');
          }
        } else await cruzarTorno(api);
      },
      'usar:chicle': 'Pegar un chicle en el torno es vandalismo. Pegarlo en el organigrama, gestión.',
      'dar:*': 'El torno no acepta regalos. Solo credenciales. Y la mía no le convence.',
      abrir: async (api) => {
        if (api.flag('torno_abierto')) { await cruzarTorno(api); return; }
        await api.say('Se abre con tarjeta. La mía dice «Pellizco». El torno, con razón, duda.');
      },
      empujar: 'Empujar un torno es pedir permiso a gritos.',
      tirar: 'Tirar de un torno es pedir perdón a gritos.',
      hablar: async (api) => {
        if (await tornoViral(api)) return;
        await api.say('Le explico quién soy en treinta segundos. A los veinte, pita.');
      },
      coger: 'No cabe en la mochila. Y tiene más antigüedad que yo.',
    } },
    { id: 'pantalla_ibex', name: 'pantalla del Ibex', handlers: {
      mirar: 'Rojo, verde, rojo, verde. Es un semáforo que te debe dinero.',
      usar: 'No se toca. Celestino la tiene como la tele del bar.',
      coger: 'Si me la llevo, Celestino se queda sin partido. Y yo sin portero.',
      hablar: '¡Arriba, Ibersideral! ...No me hace caso. Solo atiende a Celestino.',
      cerrar: 'No se puede cerrar. El mercado cierra solo. A las 17:30, puntual.',
      empujar: 'Si la tumbo, el Ibex baja de verdad. No quiero esa responsabilidad.',
    } },
    { id: 'buzon_sugerencias', name: 'buzón de sugerencias', handlers: {
      mirar: 'Buzón de sugerencias. Tiene polvo en la ranura.',
      abrir: async (api) => {
        api.sfx('open');
        await api.say('Dentro hay una sola sugerencia: «Más sugerencias». Firmado: el buzón.');
        api.setFlag('vestibulo_buzon_abierto', true);
      },
      usar: 'Escribo «Más becarios con contrato». La ranura la escupe. Polvo y principios.',
      'dar:*': 'Eso no es una sugerencia. Es un objeto. Aquí no se aceptan pruebas.',
      cerrar: 'Lleva cerrado desde que se inventó el correo electrónico.',
      coger: 'Está atornillado. Es lo único de esta casa que tiene estabilidad.',
      hablar: 'Le sugiero algo en voz alta. El polvo ni se mueve.',
    } },
    { id: 'radio_celestino', name: 'radio', handlers: {
      mirar: 'Una radio de bolsillo. Retransmite la bolsa de las cinco y media. En diferido.',
      coger: cel('Esa radio no se toca. Es la del Mundial del 82.'),
      usar: 'La subo: «...y el Ibex cierra plano». Llevan así desde las cinco y media.',
      hablar: 'Le pregunto por el Ibex. Me contesta en diferido.',
      cerrar: 'Si la apago, Celestino me narra a mí. Prefiero el Ibex.',
    } },
    ascensorObjeto('ascensor_vestibulo', {
      mirar: async (api) => api.say(api.flag('torno_abierto')
        ? 'Botones: 2, 1, 0 y -1. El -1 está gastadísimo: Sistemas no sube nunca.'
        : ['El ascensor. Detrás de los tornos, con su moqueta y su logo.', 'Desde aquí se ve la moqueta. Algún día la piso. Con contrato.']),
      cerrar: 'Se cierra solo. Es lo único automático del edificio. Bueno, y Gertrudis.',
      empujar: 'Si empujo el ascensor, me lo cobra Sistemas como horas extra.',
      tirar: 'Tiro de la puerta. No cede. Va con cita previa, como Paco.',
      hablar: '¿Baja? Hace «tin». Es lo más amable que me han dicho hoy.',
    }, ascensorBloqueado),
    // la escalera del vestíbulo interior (detrás de los tornos): sube a la Redacción, como el torno abierto
    { id: 'vestibulo_a_redaccion', name: 'escalera a la Redacción', exit: { room: 'pecera', tipo: 'escalera' }, handlers: {
      ir: subirRedaccion, usar: subirRedaccion,
      mirar: async (api) => api.say(api.flag('torno_abierto')
        ? 'La escalera a la Redacción. Moqueta roja: aquí ya se nota que constas.'
        : 'La escalera a la Redacción. Al otro lado de los tornos. A seis años y un torno.'),
      empujar: 'Una escalera no se empuja. Se sube. Si te deja el torno.',
      hablar: '«¿Hay alguien arriba?». Contesta un teclado. Eso es que sí.',
    } },
    // bancada delantera de tornos, carril fuera de servicio (decorado: tapa a quien pase detrás)
    { id: 'torno_bancada', name: 'torno', hotspot: false },
    // decorado del arte (sin hotspot): lector y franja de luz del carril de Bruno (cambian con torno_abierto), paraguas,
    // cartel de suelo mojado y el fardo de periódicos del epílogo (oculto hasta que llega la furgoneta)
    { id: 'torno_luces', name: 'torno', hotspot: false },
    { id: 'paraguero', name: 'paragüero', poly: [[43, 90], [61, 90], [61, 102], [43, 102]], handlers: { mirar: 'Un paragüero con tres paraguas. Ninguno es mío.' } },
    { id: 'cartel_suelo', name: 'cartel de suelo mojado', handlers: { mirar: 'Un cartel de suelo mojado. El suelo está mojado.' } },
    { id: 'fardo_periodicos', name: 'fardo de periódicos', hotspot: false, visible: false },
    { id: 'planta_plastico', name: 'ficus', handlers: {
      mirar: async (api) => {
        if (api.flag('planta_oyo')) await api.say('Juraría que tiene una hoja girada hacia mí. La de la oreja.');
        else await api.say('Es de plástico. Aun así, es la que más tiempo lleva en plantilla.');
      },
      hablar: async (api) => {
        await api.say('Le cuento lo de la firma. No me juzga. No me pide ticket.');
        api.setFlag('planta_oyo', true);
      },
      coger: 'No. Es la única que ha sobrevivido a todos los ERE.',
      'dar:cafe': 'No bebe. Por eso dura tanto.',
      'dar:*': 'No acepta nada. Ni regalos ni sugerencias. Por eso sigue en plantilla.',
      empujar: async (api) => {
        const n = api.inc('planta_empujada_n');
        api.sfx('whoosh');
        if (n === 1) {
          await api.say(['La giro. Debajo de una hoja, un micrófono de 1994.', 'Etiqueta: «SEGURIDAD — NO RETIRAR». Sigue encendido.']);
          await api.sayAs(C, 'Esa planta lo oye todo. Por eso es la que más dura.');
        } else if (n === 2) await api.sayAs(C, 'De ahí saco los cotilleos de ascensor.');
        else await api.say('La dejo como estaba. No quiero que me oiga empujar.');
      },
      tirar: 'Si le tiro de una hoja, me la deja en la mano. Es de plástico, pero digna.',
      usar: 'La riego con la mirada. No necesita más. Es de plástico.',
    } },
    // ADENDA 3.1: el narrador automático del Ibex (de Desarrollo), amordazado
    { id: 'altavoz_ibex', name: 'altavoz', color: '#CCCCCC', handlers: {
      mirar: say('Un altavoz: «NARRADOR AUTOMÁTICO DEL IBEX (DESARROLLO)».', 'Celestino lo ha tapado con su bufanda.'),
      usar: async (api) => {
        api.sfx('beep');
        await api.sayFrom('altavoz_ibex', 'El índice muestra una volatilidad moderada.', { color: '#CCCCCC' });
        await api.sayAs(C, '¿Lo ves? Sin alma. Ni un «¡qué técnica!».');
      },
      coger: cel('Déjalo. Con la bufanda puesta no narra. Solo respira.'),
      hablar: 'Le pregunto por el Ibex. Me contesta con un índice. Sin bufanda no hay charla.',
      tirar: 'Si le quito la bufanda, narra. Y nadie quiere eso.',
      cerrar: 'Celestino lo ha amordazado con la bufanda. El altavoz no ha opinado.',
    } },
    // la rama de abajo del organigrama (la única mención del departamento en esta sala, plan §5.14)
    { id: 'rama_diseno', name: 'rama del organigrama', handlers: {
      mirar: async (api) => {
        if (api.flag('foto_en_organigrama')) await api.say(['DISEÑO Y PRODUCTO. Y colgando, mi foto.', 'Pidieron a alguien en 2021. Llego tarde, pero llego.']);
        else await api.say(['La rama de abajo: DISEÑO Y PRODUCTO.', 'De ella cuelga la casilla VACANTE. «Plaza pedida en 2021».']);
      },
      coger: 'La rama es suya. Yo solo cuelgo.',
      tirar: 'Si tiro de la rama, se cae la casilla. Y yo con ella.',
      empujar: 'Es la única rama del organigrama que está recta. La dejo.',
      hablar: 'Le pregunto a la rama si me quiere. No contesta. Se fue a las 18:30.',
    } },
    // ADENDA 8bis.1
    { id: 'cuadro_plazas', name: 'cuadro de llaves', state: 'normal', states: ['normal', 'tachado'], handlers: {
      mirar: async (api) => {
        const n = api.inc('cuadro_plazas_n');
        const list = PLAZAS.slice(0, acto(api) === 3 ? 5 : 4);
        const i = n <= list.length ? n - 1 : 1 + ((n - list.length - 1) % (list.length - 1));
        await api.say(list[i]);
      },
      coger: cel('Esas llaves no se tocan. Las custodio yo. Y el garaje me custodia a mí.'),
      'usar:tarjeta_becario': 'La tarjeta no abre el garaje. Seis años y no tengo ni plaza de bici.',
      abrir: 'Las plazas no se abren. Se heredan.',
      tirar: 'Si tiro de una llave, la línea de sucesión se reordena. Y me echan a mí.',
      hablar: 'Le pregunto qué hay que hacer para tener plaza. El cuadro calla. Sabe cosas.',
    } },
  ],

  actors: [
    { id: 'celestino',
      murmurs: (v) => [
        'Treinta años en este mostrador. El mostrador, cuarenta. Tiene peor rodilla.', 'Si me preguntan por el Ibex, digo que va.',
        'A las seis y media sale todo el mundo. A las seis y treinta y uno, silencio.',          // §8.7
        'A estas horas quedan los de guardia, los que viven aquí y los que no se van.',          // §8.7
        ...(v.flag('acto_2_iniciado') ? ['Hoy tres me han preguntado por mi salud. Con mucho interés. Estoy de miedo.'] : []),   // 8bis.1
      ],
      handlers: {
        mirar: say('Celestino, el conserje. Bufanda del Ibex.',
          'Un chicle que no descansa desde el 82. Y un paquete abierto en el mostrador.'),
        hablar: async (api) => { await api.dialog('celestino'); },
        'dar:tarjeta_becario': async (api) => {
          await api.sayAs(C, '¿Pellizco? Aquí pone Pellizco.');
          await api.say('Es Pellejo.');
          await api.sayAs(C, 'Pues díselo al torno, que es el que manda.');
        },
        'dar:cafe': cel('Gracias, pero el café me lo traigo en termo. Desde 1994.'),
        'dar:chicle': cel('Ese chicle ya es tuyo. Aquí no se aceptan devoluciones. Ni en el torno.'),
        'dar:ficha_pagina_7': cel('¿Una ficha de la página 7? Eso, a la Redacción de papel. Yo solo veo pasar.'),
        'dar:ticket_n1': cel('¿Un ticket cerrado? Eso no lo había visto nunca. Y llevo aquí treinta años.'),
        'dar:taper_huerfano': cel('¿Un táper sin nombre? Eso no es para mí. Es para alguien con hambre de verdad.'),
        'dar:*': cel('Eso, a objetos perdidos. Ahí guardo desde paraguas hasta becarios.'),
        empujar: 'A Celestino no se le empuja. Lleva galones. Y bufanda.',
        tirar: 'Le tiro de la bufanda. Grita «¡fuera de juego!». Lo dejo.',
        coger: '¿Coger a Celestino? ¿Y quién narra el vestíbulo? No tengo bufanda.',
      } },
    // solo en el epílogo: lo coloca ../escenas/final.js con art.layout.evaristo_salvedad.at
    { id: 'evaristo_salvedad', when: () => false, handlers: {} },
  ],

  dialogs: { celestino: celestinoDialog },
  duels: {},
  scenes: { intro, ...finalScenes },
  defaults: {},
  ambient: [],

  async onEnter(api) {
    if (!api.flag('intro_vista') || enEpilogo(api) || api.restoring) return;   // intro, epílogo y cargar partida: nada aquí
    // §4.7: si hay un hito sin narrar, Celestino lo retransmite; si no, una línea del Ibex (rotan dentro de cada acto)
    if (await narrarHito(api)) return;
    const n = api.inc('celestino_ibex_n');
    await api.sayAs(C, ibexLine(api, n));
  },
}, art);
