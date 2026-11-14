// SALA `catacumba` — en pantalla, «Cierre» (la Redacción de papel). LÓGICA. Dueño: paquete P3 de la reescritura de
// comedia (docs/guion2/PLAN_COMEDIA.md): §5.3 Aurora (la fotocopia vuelve a Bruno en A_FUENTE), §5.6 Teodoro (sin
// cambios de función: `teodoro_intentos_n`, sus réplicas de voz pasan al fax), §4.5 el fax en dos golpes (A: «el fax
// vomita la tarde» al darle papel; B: la pieza viaja por fax con tres teclas y Begoña recorta a distancia, con factura),
// §7.4-7.7 el duelo D2 (paráfrasis, entrada, derrota con «VUELVE» en seis folios). Se conservan: escena 7.3a, rumor C,
// el boli muerto (MP3), el inserto de la coma (adenda 9.3).
// El arte y la geometría están en ./art/catacumba.art.js.
//
// Regla de Teodoro: NUNCA habla. Sus líneas salen del fax, EN MAYÚSCULAS (telegrama), con su color y el prefijo
// «TEODORO (fax):» (api.sayFrom('fax', ...), helper `fax()`); sin `fax_con_papel` teclea, el fax pita y no sale nada.
// Solo habla en voz alta una vez, al teléfono rojo, en la escena 7.3a (api.sayAs('teodoro_cuerpodoce', ...)).
// Estados del objeto `fax` para el arte: 'sin_papel' / 'con_papel' / 'imprimiendo' (el papel sale 2 px cada 80 ms).
import { buildRoom } from '../lib/room.js';
import art from './art/catacumba.art.js';

const TEO = 'teodoro_cuerpodoce';
const AUR = 'aurora_galerada';
const EV = 'evaristo_salvedad';
const PREFIJO = 'TEODORO (fax): ';
const BEGONA_FAX = { prefijo: 'BEGOÑA (fax): ', color: '#C0A2F6' };
const arr = (x) => (Array.isArray(x) ? x : [x]);
const MAY = (s) => String(s).toLocaleUpperCase('es-ES');

/** Sin papel, cada cosa que Bruno le dice, le da o le usa a Teodoro queda pendiente de respuesta (máx. 3, plan §4.5). */
function intento(api) {
  if (api.flag('fax_con_papel')) return;
  if ((api.flag('teodoro_intentos_n') || 0) < 3) api.inc('teodoro_intentos_n');
}

/** Teodoro «habla»: cada línea sale del fax (si hay papel). Si no hay papel, teclea, pita y no sale nada. */
async function fax(api, lines) {
  if (!api.flag('fax_con_papel')) { await sinPapel(api); return false; }
  api.sfx('typewriter');
  for (const l of arr(lines)) await api.sayFrom('fax', PREFIJO + MAY(l));
  return true;
}
/** Begoña contesta por el fax de Teodoro (golpe B): su color, su prefijo. */
async function faxBegona(api, lines) {
  for (const l of arr(lines)) await api.sayFrom('fax', BEGONA_FAX.prefijo + l, { color: BEGONA_FAX.color });
}
/** El fax imprime n hojas (estado `imprimiendo` y ruido de papel). */
async function imprime(api, n = 1, ms = 420) {
  api.setState('fax', 'imprimiendo');
  for (let i = 0; i < n; i++) { api.sfx('paper'); await api.wait(ms); }
  api.setState('fax', api.flag('fax_con_papel') ? 'con_papel' : 'sin_papel');
}
/** El fax sin papel: Teodoro teclea, pita, no sale nada (respuesta corta, para los Dar/Usar). */
async function sinPapel(api) {
  intento(api);
  api.sfx('typewriter');
  await api.anim(TEO, 'reach', 500);
  api.sfx('beep');
  await api.say('Teclea una respuesta. El fax pita. Sin papel, Teodoro es un mimo.');
}
/** Sin papel, a Teodoro solo le queda la palmada (teléfono rojo, tipómetro). */
async function palmada(api) {
  intento(api);
  await api.anim(TEO, 'reach', 300);
  api.sfx('hit');
  await api.say('¡Au! Una palmada en la mano. Sin papel, Teodoro se expresa así.');
}
const aurora = (api, lines) => api.sayAs(AUR, lines);
/** Golpecito con el boli al cartel (Aurora antes del café). Siempre va con una línea de Bruno. */
async function golpecito(api, n = 1) {
  for (let i = 0; i < n; i++) { api.sfx('click'); await api.anim(AUR, 'reach', 260); await api.wait(120); }
}
/** Aurora antes del café: toc al cartel y Bruno lo traduce. */
async function tocSinCafe(api, linea, n = 1) { await golpecito(api, n); await api.say(linea); }

// ------------------------------------------------------------------ P12 (b): Dar la ficha a Teodoro
async function darFicha(api) {
  if (!api.flag('fax_con_papel')) { await sinPapel(api); return; }
  if (api.flag('duelo_teodoro_ganado') && !api.flag('casilla_firma')) {
    await fax(api, 'Dame tu ficha.');
    await api.anim(TEO, 'reach', 400);
    await fax(api, 'Bruno Pellejo. Trece con espacios. Cabe.');
    api.sfx('hit');                       // ¡SELLO!
    api.setFlag('casilla_firma', true);
    await api.say('...Lo ha escrito bien.', { ms: 1800 });
    return;
  }
  if (!api.flag('duelo_teodoro_ganado')) { await fax(api, 'Una ficha no es una firma. Gánatela.'); return; }
  if (!api.flag('casilla_hueco')) { await fax(api, 'Sin hueco no hay página. Hay un deseo.'); return; }
  if (!api.flag('casilla_fuente')) { await fax(api, 'Sin fuentes, eso es una columna de opinión.'); return; }
  if (!api.flag('pieza_escrita') || !api.has('pieza_opa')) { await fax(api, 'Sin texto, eso es una esquela con firma.'); return; }
  if (!api.flag('pieza_recortada')) { await fax(api, 'Me sobran ocho líneas. No recorto: yo solo mido.'); return; }
  await api.scene('acto_3a');
}

// ------------------------------------------------------------------ el teléfono rojo (7.3a): Teodoro va a su mesa,
// descuelga (objeto `telefono_rojo` → 'descolgado' y el auricular en su mano: `auricular` lo pinta el drawExtra de
// content/actors.js), habla por él y cuelga. El sitio y la pose salen del arte (layout.teodoro_cuerpodoce.positions.telefono).
const sitioTelefono = () => {
  const p = art.layout.teodoro_cuerpodoce.positions && art.layout.teodoro_cuerpodoce.positions.telefono;
  return (p && p.at) || [148, 106, 'left'];
};
async function descolgar(api) {
  const [x, y, dir] = sitioTelefono();
  await api.walkActor(TEO, x, y);
  api.faceActor(TEO, dir || 'left');
  await api.anim(TEO, 'reach', 450);
  api.sfx('click');
  api.setState('telefono_rojo', 'descolgado');
  api.game.actors[TEO].auricular = true;
  api.faceActor(TEO, 'down');
  api.sfx('phone');
  await api.wait(700);
}
async function colgar(api) {
  await api.wait(300);
  api.faceActor(TEO, sitioTelefono()[2] || 'left');
  await api.anim(TEO, 'reach', 400);
  api.game.actors[TEO].auricular = false;
  api.setState('telefono_rojo', 'colgado');
  api.sfx('click');
  await api.wait(250);
  const at = art.layout.teodoro_cuerpodoce.at;
  await api.walkActor(TEO, at[0], at[1]);
  api.faceActor(TEO, at[2] || 'left');
}

// ------------------------------------------------------------------ Escena 7.3a · Inicio del Acto III
async function escenaActo3a(api) {
  await api.cutscene(async (api) => {
    // (Teodoro coge la ficha y la pieza. Las mide con el tipómetro. Dos veces.)
    api.take('ficha_pagina_7');
    api.take('pieza_opa');
    // los flags van primero: pase lo que pase en la escena, el Acto III queda iniciado
    api.setFlag('pagina_cerrada', true);
    api.setFlag('acto_3_iniciado', true);
    api.sfx('paper');
    await api.anim(TEO, 'reach', 600);
    await api.wait(300);
    await api.anim(TEO, 'reach', 600);
    await fax(api, ['Veintitrés líneas. Hueco, fuente y firma.', 'Página 7 cerrada.']);
    if ((api.flag('evaristo_llamadas') || 0) >= 3) await fax(api, 'Y la coma de Controlling, en su sitio. Ese hombre lee.');  // adenda 9.3
    // (Descuelga el teléfono rojo. Por primera vez se le oye la voz: ronca, bajita.)
    await descolgar(api);
    await api.sayAs(TEO, 'Goyita. Página 7 cerrada. Esta noche firma un chaval.');
    await colgar(api);
    await aurora(api, 'Ha hablado. En voz alta. Desde 1996 no...');
    // (Se abre la puerta. Entra Íñigo con dos pósits azules.)
    const prev = api.actorPos('inigo_sinergia');
    api.sfx('door');
    // (entra por la puerta doble de la Redacción, a la izquierda, y se queda ante el camastro: Bruno habla a Teodoro desde [66, 124])
    api.placeActor('inigo_sinergia', 'catacumba', 30, 112, 'right');
    api.show('inigo_sinergia');
    await api.walkActor('inigo_sinergia', 46, 119);
    await api.sayAs('inigo_sinergia', [
      'Qué bonito. Una página. Lástima que no se vaya a imprimir.',
      'La Reunión de Dirección es ahora, en la Sala Amazonas.',
      'A las nueve aprueba el Plan Cero Papel. Y la Goyita, al desguace.',
    ]);
    await fax(api, 'Lo que está cerrado no se abre.');
    await api.sayAs('inigo_sinergia', 'Lo que está cerrado se reimagina.');
    await api.walkActor('inigo_sinergia', 30, 112);
    if (prev) api.placeActor('inigo_sinergia', prev.room, prev.x, prev.y, prev.dir);
    else api.placeActor('inigo_sinergia', null);
    await fax(api, ['Chaval. Si no hay rotativa, no hay firma.', 'Haz algo. Y hazlo rápido.']);
    await aurora(api, 'Y con buena letra, criatura.');
    await api.narrate('ACTO III: CIERRE', { ms: 2600 });
  });
}

// ------------------------------------------------------------------ plan §4.5 · golpe A: el fax vomita la tarde (paso 28)
async function faxConPapel(api) {
  if (api.flag('fax_con_papel')) { await api.say('Ya tiene papel. Más papel sería un archivo.'); return; }
  api.take('copias_rechazadas');
  api.sfx('paper');
  await api.say('El duplicado y el triplicado. El fax los traga con hambre.');
  api.setFlag('fax_con_papel', true);
  // (Arranca. Teodoro levanta la vista. Papel saliendo sin parar.)
  api.sfx('machine');
  api.faceActor(TEO, 'down');
  await imprime(api, 2, 300);
  api.setState('fax', 'imprimiendo');
  const n = api.flag('teodoro_intentos_n') || 0;
  const atrasadas = ['18:01. Respuesta a Aurora: ya lo sé.'];
  if (n >= 1) atrasadas.push('18:42. Respuesta a «¿hola?»: no.');
  if (n >= 2) atrasadas.push('18:55. Respuesta a «¿me oye?»: sí. Por desgracia.');
  if (n >= 3) atrasadas.push('19:10. Respuesta a todo lo demás: ver respuestas anteriores.');
  atrasadas.push('19:12. Goyita, ¿me oyes? Tú aguanta.');
  for (const l of atrasadas) { api.sfx('paper'); await fax(api, l); }
  api.faceActor(TEO, 'right');
  await aurora(api, 'Lleva toda la tarde contestándote, criatura; nadie le había dado papel.');
  // (El último pliego sale torcido, con borde perforado.)
  api.sfx('paper');
  api.setState('fax', 'con_papel');
  await api.say('Y esto no es de Teodoro. «F.P.» Atascado desde las seis.');
  api.give('mensaje_fp');
  api.sfx('pickup');
  await fax(api, 'Ese no es mío. Mío, todo lo demás.');
}

// ------------------------------------------------------------------ plan §4.5 · golpe B: la pieza viaja por fax (paso 33)
async function teclaGoyita(api) {
  if (!api.flag('catacumba_tecla1')) {
    api.setFlag('catacumba_tecla1', true);
    // (Teodoro le da una palmada en la mano antes de que toque la tecla.)
    await api.anim(api.player, 'reach', 300);
    await api.anim(TEO, 'reach', 250);
    api.sfx('hit');
    await fax(api, ['La Goyita no tira borradores.', 'Y a ella no le marca nadie más que yo.']);
    await api.say('Perdón, Goyita.');
    api.inc('fax_tecla_n');
    return;
  }
  await api.anim(TEO, 'reach', 250);
  api.sfx('hit');
  await fax(api, 'Otra vez. Te mido la mano. No cabe.');
}
async function teclaControlling(api) {
  if (api.flag('catacumba_tecla3')) { await api.say('Necesito a alguien que recorte sin leer.'); return; }
  api.setFlag('catacumba_tecla3', true);
  // (El fax traga la pieza. Diez segundos. Suena el móvil de Bruno: Evaristo.)
  api.sfx('typewriter');
  await imprime(api, 1, 500);
  await api.wait(500);
  await api.phone.call({ caller: EV, label: 'Evaristo', sub: 'Controlling', ringMs: 1000 }, async () => {
    await api.phone.say(['Una cosita. He recibido su pieza. Treinta y una líneas.',
      'Diecisiete comas. Todas en su sitio. No recorto: yo solo leo.', 'Era solo eso.']);
  });
  // (El fax devuelve la pieza entera.)
  await imprime(api, 1, 400);
  await api.say('Necesito a alguien que recorte sin leer.');
  api.inc('fax_tecla_n');
}
async function teclaAdministracion(api) {
  await fax(api, 'Que conste: por mi boca sale una pieza de la web.');
  // (El fax traga la pieza. Pitido largo. Diez segundos. Timbre.)
  api.sfx('typewriter');
  await api.wait(400);
  api.sfx('beep');
  await api.wait(900);
  api.sfx('phone');
  await faxBegona(api, ['ADMINISTRACIÓN. RECIBIDO A LAS 19:07. AQUÍ SIEMPRE SON LAS 19:07.',
    'TODA PIEZA SUFRE EL RECORTE ESTÁNDAR DEL 26 %. SIN EXCEPCIONES.',
    'POR ABAJO. SE PIERDE LA CONCLUSIÓN, QUE NO LA LEE NADIE.']);
  // (El fax imprime. Una hoja. Otra. Otra. Con sello rojo.)
  await imprime(api, 3, 380);
  api.sfx('hit');
  await api.say('Treinta y una por cero setenta y cuatro... veintitrés. Exacto.');
  // (Teodoro coge las tres hojas. Tipómetro. Una, dos, tres.)
  for (let i = 0; i < 3; i++) { await api.anim(TEO, 'reach', 300); api.sfx('click'); }
  api.setFlag('pieza_recortada', true);
  await fax(api, ['Veintitrés. Veintitrés. Veintitrés.', 'Cabe, cabe y cabe.']);
  // (El fax vuelve a pitar. Sale una cuarta hoja, pequeña.)
  api.sfx('beep');
  await imprime(api, 1, 400);
  await aurora(api, '¿Una cuarta copia? Eso no existe. Eso acaba en un juzgado.');
  await api.say('«Envío por fax: 0,26 euros». Me ha facturado el recorte.');
  await fax(api, 'Pago yo. Es la primera pieza de la web que me entra.');
  // (Teodoro grapa la factura en su tablón.)
  await api.anim(TEO, 'reach', 500);
  api.sfx('hit');
  api.setFlag('catacumba_factura', true);
}
async function usarPiezaConFax(api) {
  if (!api.flag('fax_con_papel')) { await api.say('Sin papel, este fax no traga ni una coma.'); return; }
  if (api.flag('pieza_recortada')) { await api.say('Ya está recortada. Si la vuelvo a enviar, me la facturan dos veces.'); return; }
  const i = await api.choose(['1: GOYITA', '2: ADMINISTRACIÓN', '3: CONTROLLING', 'Mejor no.'], { escape: 3 });
  if (i === 0) await teclaGoyita(api);
  else if (i === 1) await teclaAdministracion(api);
  else if (i === 2) await teclaControlling(api);
  else await api.say('Lo pienso. Un fax mal marcado no se borra. Se archiva.');
}

// ------------------------------------------------------------------ Árbol de Aurora (plan §5.3)
const unaFuente = (api) => !api.flag('casilla_fuente') && api.has('mensaje_fp') !== api.has('fotocopia_nota_direccion');
const dosFuentes = (api) => !api.flag('casilla_fuente') && api.has('mensaje_fp') && api.has('fotocopia_nota_direccion');
const UNA_FUENTE = ['Con una fuente se hace un rumor; con dos, una noticia.', 'Con tres, un libro, y no estamos para libros.'];

const dialogoAurora = {
  actor: AUR, start: 'A_MENU',
  nodes: {
    // antes del café no habla; el golpecito siempre lleva texto de Bruno
    A_SIN_CAFE: {
      options: [
        { text: 'Buenas noches, Aurora.', exit: true,
          do: async (api) => { await tocSinCafe(api, '«No hablo antes del café». Entendido. Pero no me ha dicho que no.'); } },
        { text: '¿Usted es la correctora?', exit: true,
          do: async (api) => { await api.face(AUR); await tocSinCafe(api, 'Sí, es la correctora. Yo soy la errata. Y el cartel, la norma.', 3); } },
        { text: 'Puedo hablar yo por los dos, si quiere.', exit: true,
          do: async (api) => {
            // (Aurora le quita el boli de la oreja y le tacha media frase en el aire.)
            await api.anim(AUR, 'reach', 500); api.sfx('click'); await api.anim(AUR, 'reach', 300);
            await api.say('Me ha corregido sin hablar. Es buenísima.');
          } },
        { text: 'Ya vuelvo. Con café.', exit: true,
          do: async (api) => { await golpecito(api); await api.say('Un toc. Uno solo. Suena a «eso espero».'); } },
      ],
    },
    A_CAFE: {
      onEnter: async (api) => {
        api.take('cafe');
        api.sfx('drink');
        await aurora(api, 'Gracias, criatura. Este café está mal escrito, pero se entiende.');
        await api.say('Aurora, quiero firmar en papel. Mañana.');
        await aurora(api, [
          '«Quiero firmar en papel mañana», sin pausa; la pausa era miedo.',
          'Para firmar hacen falta tres cosas: hueco, fuente y firma.',
          'Hueco: una página libre. Fuente: una noticia con dos fuentes.',
          'Firma: que Teodoro acepte tu nombre en su página.',
          'Teodoro no habla; escribe faxes, aunque lo tengas a dos metros.',
          'Y el fax no tiene papel desde las seis. Ha sido una tarde preciosa.',
          'Toma la ficha de la página 7. Impar, que se ve mucho.',
        ]);
        api.give('ficha_pagina_7');
        api.sfx('pickup');
        await aurora(api, 'Por eso está vendida, a unos colchones, desde marzo.');
        await api.say('¿Y cómo se libera una página vendida?');
        await aurora(api, [
          'Eso se decide en la reunión de la Sala Amazonas, que empezó en marzo.',
          'En treinta años he visto acabar una reunión de una sola manera:',
          'que alguien pregunte por los siguientes pasos. Huyen como del fuego.',
          'Ah, y el CMS está en coma; arriba no te atenderá nadie hasta que vuelva.',
        ]);
        api.setFlag('aurora_conto_pasos', true);
        api.setFlag('aurora_hablo_fax', true);
        api.setFlag('acto_2_iniciado', true);
        await api.narrate('ACTO II: HUECO, FUENTE, FIRMA', { ms: 2600 });
        return 'A_MENU';
      },
    },
    A_FUENTE: {
      onEnter: async (api) => {
        await aurora(api, 'A ver.');
        api.sfx('paper');
        await aurora(api, [
          'Un fax anónimo de un tal F.P. Y una nota de gasto con un reverso.',
          '«OPA ROBLEDAL, jueves, NO PUBL.» A boli. ¿Esto lo has contrastado?',
        ]);
        await api.say('Son dos fuentes.');
        await aurora(api, 'Una anónima y otra con IVA. Me vale.');
        // (¡GRAPA! Sella la ficha con el fax de F.P.; la fotocopia vuelve a Bruno: hace falta en el remate de D3)
        api.sfx('hit');
        api.take('mensaje_fp');
        api.setFlag('casilla_fuente', true);
        await aurora(api, ['La nota te la devuelvo; las fuentes no se quedan, se citan.',
          'Y «opa» en minúscula, que ya está en el diccionario y se ofende.']);
        return 'A_MENU';
      },
    },
    A_MENU: {
      options: [
        { text: '¿Qué noticia puedo traer?',
          do: async (api) => { await aurora(api, ['Una que no tenga nadie. Y que aguante hasta mañana.', 'Una exclusiva se guarda para el papel. La web la tiene a las 00:01.']); } },
        { text: '¿Cómo convenzo a Teodoro?', once: true,
          reply: 'Contestándole. Teodoro solo respeta al que le contesta mejor que él.' },
        { text: '¿Por qué no se hablan usted y Teodoro?', once: true,
          do: async (api) => {
            await aurora(api, ['En 1996 me mandó un fax que empezaba «Con el debido respeto...».',
              'Le contesté dándole las gracias por avisarme. Antes de lo que venía.',
              'No me ha vuelto a dirigir la palabra. Han sido treinta años muy buenos.']);
            api.learnReply('rep_02');
          } },
        { text: '¿Usted ha cometido alguna errata?', once: true,
          do: async (api) => {
            await api.wait(1200);              // (Pausa. Se quita las gafas.)
            await aurora(api, ['Una. En 1989. Una coma después de «sin embargo» que no puse.',
              'Desde entonces la pongo siempre; sin embargo, no se me ha olvidado.']);
            await api.say('¿Y qué pasó?');
            await aurora(api, 'Nada. Eso es lo terrible, criatura: que no pasó nada y yo lo sé.');
          } },
        { text: '¿Qué le parecen los verbos de abajo?',
          do: async (api) => { await aurora(api, 'Nueve verbos y ni un subjuntivo. Así no se cierra un periódico.'); } },
        { text: 'En la web eso lo arregla el corrector automático.', once: true,
          do: async (api) => {
            // (Silencio. Deja el boli sobre la mesa, muy despacio.)
            await api.wait(1000);
            await aurora(api, 'Repítemelo, que creo que no te he oído, y prefiero no haberte oído.');
            await api.say('Digo que en la web no hay correctora. Lo hago fatal yo solo.');
            await aurora(api, 'Ya lo sé. Leo la web todas las noches, para sufrir con método.');
          } },
        { text: 'Tengo dos fuentes.', if: dosFuentes, goto: 'A_FUENTE' },
        { text: 'Tengo una fuente.', if: unaFuente, do: async (api) => { await aurora(api, UNA_FUENTE); } },
        { text: '¿Y ahora qué?', if: ['casilla_fuente', '!pieza_escrita'],
          do: async (api) => { await aurora(api, ['Ahora escríbela en tu ordenador, fuera del CMS, que ahí vive el Titulator.', 'Y sin adjetivos; si se te escapa uno, que sea el bueno.']); } },
        { text: '¿Ha oído cómo pregunta Custodia?', if: 'custodia_regla',
          do: async (api) => { await aurora(api, ['Abre interrogación y cierra con punto.', 'Eso no es una pregunta, criatura. Es una sentencia.']); } },
        { text: 'Íñigo dice que en la reunión van a apagar la rotativa.', if: 'acto_3_iniciado',
          do: async (api) => { await aurora(api, ['Esa reunión no decide nada sin acta.', 'Y Gervasio no ha escrito un acta en su vida.']); } },
        // adenda 4.7 (MP2, paso 2)
        { text: 'Don Evaristo pregunta si su coma está bien.', if: ['evaristo_escuchado', '!coma_bendecida'],
          do: async (api) => {
            await aurora(api, [
              '¿Evaristo? ¿El de las comas? Siéntate, criatura. Bueno, no hay silla.',
              'La coma decimal es correcta, y el punto también; las dos valen.',
              'Pero si su cláusula dice coma, manda la cláusula. Son cuarenta y ocho.',
              'Dile que lo envíe; que una coma bien puesta no espera.',
            ]);
            api.setFlag('coma_bendecida', true);
          } },
        { text: 'Nada, Aurora. Gracias.', exit: true, reply: 'Lo has dicho bien. Me has descolocado.' },
      ],
    },
  },
};

async function hablarAurora(api) {
  if (!api.flag('acto_2_iniciado')) { await api.dialog('aurora', 'A_SIN_CAFE'); return; }
  // adenda 8.3 · rumor C, paso 1 (una sola vez, antes del árbol)
  if (!(api.flag('rumor_teodoro_n') > 0)) {
    await aurora(api, 'Teodoro duerme aquí desde 1997. Detrás de esa cortina.');
    api.inc('rumor_teodoro_n');
  } else await aurora(api, 'Dime, criatura. Con sujeto y predicado, si puede ser.');
  await api.dialog('aurora', 'A_MENU');
}

/** Dar fotocopia_nota_direccion o mensaje_fp a Aurora (paso 30). */
async function darFuente(api) {
  if (!api.flag('acto_2_iniciado')) { await tocSinCafe(api, 'Toc al cartel. Antes del café, ni fuentes ni nada.'); return; }
  if (api.flag('casilla_fuente')) { await aurora(api, 'Ya está citada, criatura. Una fuente no se cita dos veces; se gasta.'); return; }
  if (dosFuentes(api)) { await api.dialog('aurora', 'A_FUENTE'); return; }
  await aurora(api, UNA_FUENTE);
}

// ------------------------------------------------------------------ Árbol de Teodoro, por fax (plan §5.6 + adenda 4.7)
const dialogoTeodoro = {
  actor: TEO, start: 'T0',
  nodes: {
    T0: {
      options: [
        { text: 'Quiero firmar en tu página 7.', if: '!duelo_teodoro_ganado',
          do: async (api) => { await api.duel('teodoro'); return 'exit'; } },
        { text: '¿Por qué solo habla por fax?',
          do: async (api) => { await fax(api, 'Lo que se dice se lo lleva el aire. Lo que se faxea, se archiva.'); } },
        { text: '¿Con quién habla por el teléfono rojo?', once: true,
          do: async (api) => { await fax(api, ['Con la Goyita. La rotativa. Vive en el polígono.', 'No me pide likes. Solo papel, tinta y que no la llame impresora.']); } },
        { text: '¿Qué le pasa con la web?', once: true,
          do: async (api) => { await fax(api, ['En internet una errata se corrige, chaval. En papel se enmarca.', 'Si firma uno de la web, el papel se acaba. Lo sé. Lo noto.']); } },
        { text: 'He encontrado una página perdida del Libro de Estilo.', if: 'profecia_leida', once: true,
          do: async (api) => { await fax(api, ['¿«Nota del autor: tengo sueño»? La escribí yo. En 1998.', 'No se lo digas a Aurora.']); } },
        // [E1.8] se queda: casa con el paso 32 («Teodoro le manda faxes»)
        { text: '¿Conoce a Herminia, la de Infografía?', once: true,
          do: async (api) => { await fax(api, ['La máquina de Leoncio respeta el cuerpo 9. Es la única.', 'Le mando faxes. Me contesta con un quesito. Nos entendemos.']); } },
        { text: '¿Conoce a don Evaristo?', once: true,
          do: async (api) => { await fax(api, ['Es de los nuestros. Él cuenta comas. Yo, líneas.', 'Una vez me devolvió un fax corregido. Lo tengo enmarcado.']); } },
        { text: 'Me voy.', exit: true, do: async (api) => { await fax(api, 'Cierra al salir. El reloj no se toca: las 20:59 caben.'); } },
      ],
    },
  },
};

async function hablarTeodoro(api) {
  if (!api.flag('fax_con_papel')) {
    intento(api);
    // Teodoro teclea en el fax; pita; no sale nada.
    api.sfx('typewriter');
    await api.anim(TEO, 'reach', 700);
    api.sfx('beep');
    await api.wait(300);
    if (api.flag('acto_2_iniciado')) {
      if (api.once('catacumba_aurora_sinpapel')) await aurora(api, 'Sin papel no habla. Lleva así desde las seis. Qué paz.');
      else await api.say('Teclea. Pita. Ni una línea. Me lo guarda todo para cuando haya papel.');
    } else {
      // Aurora no habla antes del café: señala su cartel en vez de explicarlo.
      await tocSinCafe(api, 'El fax pita. Aurora señala su cartel. Aquí nadie me habla sin requisitos.');
    }
    return;
  }
  // adenda 8.3 · desmentido del rumor C (una sola vez, con el rumor en el paso 3)
  if ((api.flag('rumor_teodoro_n') || 0) >= 3 && !api.flag('catacumba_desmentido_c')) {
    api.setFlag('catacumba_desmentido_c', true);
    await fax(api, ['No estoy empadronado.', 'Estoy maquetado.']);
  }
  await fax(api, '¿Qué quieres, chaval?');
  await api.dialog('teodoro', 'T0');
}

// ------------------------------------------------------------------ Duelo D2 · Teodoro, por fax (plan §7.4-7.7)
async function remateRespuestaAutomatica(api, duel) {
  await api.say('Página 9: respuesta automática.');
  await api.anim(api.player, 'reach', 300); api.sfx('beep');
  await api.anim(api.player, 'reach', 300); api.sfx('beep');
  api.sfx('success');
  const auto = (l, o) => api.sayFrom('fax', l, o);
  await auto(['ESTOY FUERA DE LA OFICINA HASTA QUE EL PAPEL DEJE DE EXISTIR.', 'PARA CUALQUIER URGENCIA, CONTACTE CON USTED MISMO.']);
  duel.setAssigned('Respuesta automática');
  // (Teodoro manda otro; otra respuesta; otro; otra. El rollo de papel se agota.)
  for (const ms of [1500, 1000]) {
    api.sfx('typewriter');
    await api.anim(TEO, 'reach', 400);
    await auto('ESTOY FUERA DE LA OFICINA HASTA QUE EL PAPEL DEJE DE EXISTIR.', { ms });
  }
  api.sfx('machine');
  await api.wait(600);
  await api.sayFrom('fax', PREFIJO + MAY('...Es lo más bonito que me han escrito en veintinueve años.'));
  api.setFlag('duelo_teodoro_ganado', true);
}

/** Derrota de D2 (plan §7.7): el fax escupe «VUELVE» en cuerpo 72, una letra por hoja. Escala con la 2.ª derrota. */
async function derrotaTeodoro(api, { perdidos } = {}) {
  api.setState('fax', 'imprimiendo');
  for (const letra of ['V', 'U', 'E', 'L', 'V', 'E']) {
    api.sfx('paper');
    await api.sayFrom('fax', letra, { ms: 380 });
  }
  api.setState('fax', 'con_papel');
  if ((perdidos || 1) <= 1) {
    await aurora(api, 'Ha perdido usted con dos faltas, criatura. Y en cuerpo 72.');
    await api.say('Seis folios para una palabra. Es mi pieza más larga en papel.');
  } else {
    await aurora(api, 'Otros seis folios, criatura. Con esto ya se encuaderna.');
    await api.say('Doce folios. Ya tengo una obra completa. En una palabra.');
  }
}

const dueloTeodoro = {
  actor: TEO,
  from: 'Teodoro Cuerpodoce',
  subject: 'Firma de la web en papel. Asignado a: quien se atreva',
  assigned: 'EL DE LA WEB',
  assignedWin: 'Teodoro Cuerpodoce',
  deck: ['R06', 'R02', 'R03', 'R09'],
  maxMisses: 3,
  style: 'fax',
  say: async (api, line) => { await api.sayFrom('fax', PREFIJO + MAY(line)); },
  // plan §7.4: la paráfrasis de cada ataque, en telegrama
  attackText: {
    R06: '¿CONTRASTADO? FUENTES. NÚMERO.',
    R02: 'CON TODO EL RESPETO QUE ME MERECE LA WEB. QUE ES POCO.',
    R03: 'ESTA FIRMA LA QUERÍA AYER. Y ANTEAYER, EN PLOMO.',
    R09: 'DATO SIN CONTEXTO. Y DE LA WEB, QUE ES PEOR.',
  },
  intro: ['¿Tú? ¿El de la web? ¿En mi página? Contesta.'],
  hurt: ['Hum. Cabe.', 'Eso, en mis tiempos, era una portada.'],
  taunt: ['Treinta y ocho caracteres de nada.', 'Respuesta a otro fax. Devuelto.'],
  finishers: [
    { atScore: 3, text: 'Esto está cerrado. Y lo que está cerrado no tiene respuesta.', object: 'manual_fax',
      wrongObject: {
        ficha_pagina_7: 'La ficha, después. Primero, contéstame. Si puedes.',
        pieza_opa: 'Eso es texto. Yo te he pedido una respuesta.',
        cafe: 'Café de la web. Sabe a clic.',
      },
      script: remateRespuestaAutomatica },
  ],
  cc1: 'Aurora',
  defeatLine: 'RESPUESTA AUTOMÁTICA DEL FAX: «SIN PAPEL PARA USTED.»',
  defeatScene: 'teodoro_derrota',
  defeatHeadline: 'UN BECARIO RECIBE SEIS FOLIOS PARA UNA PALABRA. LA PALABRA, CRUEL',
  onWin: async (api) => {
    api.setFlag('duelo_teodoro_ganado', true);
    if (api.has('ficha_pagina_7')) {
      await fax(api, ['Dame tu ficha.', 'Bruno Pellejo. Trece con espacios. Cabe.']);
      api.sfx('hit');                     // ¡SELLO!
      api.setFlag('casilla_firma', true);
      await api.say('...Lo ha escrito bien.', { ms: 1800 });
      await fax(api, 'En mi página no hay erratas, chaval. Ni en los nombres.');
    } else {
      await fax(api, 'Tráeme la ficha y te la sello.');
    }
  },
};

// ------------------------------------------------------------------ la sala
export default buildRoom({
  id: 'catacumba',
  name: 'Cierre',
  music: 'm_catacumba',
  flags: {
    catacumba_galeradas_n: 'int · catacumba · +1 por Mirar galeradas (la 2.ª, titular de los áridos, §8.3)',
    catacumba_desmentido_c: 'bool · catacumba · Teodoro ya desmintió el rumor C (adenda 8.3)',
    catacumba_reloj_n: 'int · catacumba · +1 por Empujar reloj_2147',
    catacumba_tecla1: 'bool · P3 · catacumba · ya se probó la tecla 1 (GOYITA) del fax',
    catacumba_tecla3: 'bool · P3 · catacumba · ya se probó la tecla 3 (CONTROLLING): Evaristo',
    catacumba_factura: 'bool · P3 · catacumba · factura del fax (0,26 €) · P3 (tablón, pared)',
  },

  objects: [
    // la Redacción (web) está AL LADO, al mismo nivel, tras la puerta doble y el umbral de latón
    { id: 'catacumba_a_pecera', name: 'Redacción', exit: { room: 'pecera', tipo: 'puerta_doble' }, handlers: {
      mirar: 'Vuelta a la Redacción web. Al otro lado del latón, el siglo XXI. Con escalas.',
      abrir: 'Está abierta de par en par. Aquí lo que se cierra son páginas.',
      usar: async (api) => api.goto('pecera', 'catacumba'),
      cerrar: 'Ya lo intentó Teodoro en 2009. La web entró igual. Por el fax.',
      hablar: 'Le digo adiós a 1994. 1994 no contesta: está maquetando.',
      coger: 'Esta puerta separa 1994 del clic. No se toca.',
    } },
    // mueble de plano medio (solo dibujo: tapa las rodillas de Teodoro, sentado tras él; sin hotspot)
    { id: 'mesa_teodoro', name: 'mesa de Teodoro', hotspot: false },
    { id: 'galeradas', name: 'galeradas', handlers: {
      mirar: async (api) => {
        const n = api.inc('catacumba_galeradas_n');
        if (n !== 2) { await api.say('Galeradas colgadas como jamones. Curadas en tinta.'); return; }
        await api.say(['«El supervisor abre expediente sancionador al sector de los áridos»', '«en el marco normativo».', 'Ochenta y siete caracteres con espacios.']);
        if (api.flag('fax_con_papel')) await fax(api, 'Has contado. Sin que te lo pida. Hijo mío.');
        else await api.say('Teodoro asiente. Sin papel, es lo más parecido a un abrazo.');
      },
      coger: 'Si descuelgo una, Teodoro me mide. Con la regla.',
      tirar: 'No. Las galeradas no se tiran: se curan.',
      usar: 'Las leo. Tienen más erratas que la web, pero se notan menos.',
      hablar: 'Les leo el titular en voz alta. Aquí eso es casi una misa.',
    } },
    { id: 'camastro', name: 'camastro', handlers: {
      mirar: 'Detrás de la cortina, un camastro. Teodoro no sale del edificio desde 1997.',
      usar: 'No. Si me tumbo aquí, mañana soy de papel.',
      coger: 'La manta de cuadros es de Teodoro. Los cuadros, de 1997.',
      empujar: 'No lo muevo. Está orientado al fax. Teodoro duerme mirando la bandeja.',
      abrir: 'La cortina ya está entreabierta. Aquí solo se cierran páginas.',
      cerrar: 'Corro la cortina. Teodoro la vuelve a abrir sin mirar. Vigila el fax.',
    } },
    { id: 'fax', name: 'fax', color: '#D9CFA6', state: 'sin_papel', states: ['sin_papel', 'con_papel', 'imprimiendo'],
      // el fax «escupe solo» (murmullos de Teodoro) — solo si tiene papel
      murmurs: (v) => (v.flag('fax_con_papel') ? ['CUERPO 9. INTERLINEADO 10. CORAZÓN 12.', 'GOYITA, ¿ME OYES? TÚ AGUANTA.'] : []),
      murmurColor: '#D9CFA6',
      handlers: {
        mirar: async (api) => {
          if (api.flag('fax_con_papel')) {
            await api.say(['Tiene papel. Teodoro lo mira como quien mira a un hijo que vuelve.',
              'Tres teclas de marcación rápida: 1 GOYITA, 2 ADMINISTRACIÓN, 3 CONTROLLING.']);
          } else await api.say('Un fax beige de 1992. Pantallita: «SIN PAPEL». Y sin ganas.');
        },
        // paso 28 · golpe A
        'usar:copias_rechazadas': faxConPapel,
        // paso 33 · golpe B
        'usar:pieza_opa': usarPiezaConFax,
        'usar:ficha_pagina_7': 'La ficha no se faxea. Se sella.',
        'usar:cafe': 'Teodoro me mira. El fax me mira. Los dos han visto cosas peores.',
        'usar:manual_fax': 'Página 9: respuesta automática. La guardo para cuando conteste él.',
        'usar:mensaje_fp': 'Devolverle a un fax su propio fax es de mala educación.',
        'usar:fotocopia_nota_direccion': '¿Faxear una fuente? Mañana sale en otro periódico.',
        'usar:boli_muerto': 'Un boli muerto en un fax. Ni con eso se queja.',
        'usar:taper_huerfano': 'Un táper no se faxea. Aunque esté vacío. Sobre todo si está vacío.',
        usar: async (api) => {
          if (api.flag('fax_con_papel')) await api.say('Tres teclas. Sin nada que enviar, cualquiera de ellas es una grosería.');
          else { api.sfx('beep'); await api.say('Pulso un botón. Me contesta «SIN PAPEL» con más énfasis.'); }
        },
        abrir: async (api) => {
          if (api.flag('fax_con_papel')) await api.say('Dentro, mi nota de gasto rechazada. Por fin sirve para algo.');
          else await api.say('Abro la bandeja. Vacía. Queda la marca de un papel que estuvo.');
        },
        coger: 'Es un fax de 1992. Pesa lo que pesa una década.',
        hablar: async (api) => { intento(api); await api.say('Le hablo al fax. Teodoro lo considera una grosería.'); },
        empujar: 'No. Es la única boca de Teodoro. Y muerde.',
      } },
    { id: 'telefono_rojo', name: 'teléfono rojo', state: 'colgado', states: ['colgado', 'descolgado'], handlers: {
      mirar: async (api) => { await api.say(['Línea directa con la rotativa, en el polígono.', 'Teodoro la usa para hablar de sentimientos.']); },
      usar: async (api) => { if (api.flag('fax_con_papel')) await fax(api, 'Ese teléfono no se toca. Es nuestro.'); else await palmada(api); },
      coger: async (api) => { if (api.flag('fax_con_papel')) await fax(api, 'Ese teléfono no se toca. Es nuestro.'); else await palmada(api); },
      hablar: 'Digo «¿hola?». La rotativa no me conoce. Solo contesta a Teodoro.',
      tirar: 'Tirar del cable del teléfono rojo es cortarle la línea a una pareja.',
    } },
    { id: 'tipometro', name: 'tipómetro', handlers: {
      mirar: 'Un tipómetro: la regla de medir texto. Teodoro lo lleva encima. Duerme con él.',
      coger: async (api) => { if (api.flag('fax_con_papel')) await fax(api, 'Toca eso y te mido. Un metro setenta. No cabes.'); else await palmada(api); },
      usar: 'No sé medir en cíceros. En la web medimos en clics y en disgustos.',
      empujar: 'Lo empujo un centímetro. Teodoro lo devuelve a su sitio. Exacto.',
    } },
    { id: 'reloj_2147', name: 'reloj', handlers: {
      mirar: 'Parado en las 20:59 desde 2019. Siempre falta un minuto para el cierre.',
      usar: 'No. Si lo arreglo, aquí alguien se jubila de golpe.',
      coger: 'Si lo descuelgo, se acaba el minuto. Y con él, el periódico.',
      empujar: async (api) => {
        if (api.inc('catacumba_reloj_n') === 1) await api.say('Le doy un toquecito. Sigue en las 20:59. Tiene más aguante que yo.');
        else await api.say('Nada. Las 20:59. Es el minuto más largo de la historia del periodismo.');
      },
      tirar: 'No. Las agujas están así por convenio.',
    } },
    { id: 'fotos_jefes_cierre', name: 'fotos de jefes de cierre', handlers: {
      mirar: async (api) => { await api.say(['Jefes de cierre en blanco y negro. Todos con bigote.', 'El bigote también era de plantilla.']); },
      coger: 'No. Llevan cuarenta años colgadas. Es la única antigüedad que se respeta.',
      hablar: 'Les digo que voy a firmar en papel. Ninguno se ríe. Es el bigote.',
      usar: 'No tengo bigote que comparar. Ni contrato.',
    } },
    { id: 'fax_enmarcado', name: 'fax enmarcado', handlers: {
      mirar: async (api) => {
        await api.say(['Un fax enmarcado de 2003: «¿Esto lo has contrastado?».', 'Debajo, a mano: «Con dos fuentes y media.', 'La media dijo "yo no te he dicho nada"».', 'Me la apunto.']);
        api.learnReply('rep_06');
      },
      coger: 'Un fax enmarcado no se coge. Se hereda.',
      abrir: 'Si abro el marco, se escapa la réplica. Mejor me la apunto.',
      usar: 'Ya lo he contrastado: está enmarcado. Más contraste, imposible.',
    } },
    // plan §4.5: la factura del envío, grapada en la pared de Teodoro (golpe B)
    { id: 'factura_fax', name: 'factura del fax', when: 'catacumba_factura', handlers: {
      mirar: 'Grapada: «Envío por fax: 0,26 €». Pagado: Teodoro. Lo mira más que a mí.',
      coger: async (api) => { await fax(api, 'Eso es mío. La primera pieza de la web que pago.'); },
      usar: 'Ya está pagada. Es la factura más sentimental de la casa.',
    } },
    { id: 'cartel_aurora', name: 'cartel', handlers: {
      mirar: '«NO HABLO ANTES DEL CAFÉ. NI DESPUÉS, PERO ANTES MENOS.»',
      coger: async (api) => {
        if (!api.flag('acto_2_iniciado')) { await tocSinCafe(api, 'Toc en los nudillos. El cartel no se toca. Ni se discute.'); return; }
        await aurora(api, 'Deja el cartel, criatura. Lleva treinta años sin una errata.');
      },
      usar: 'Lo señalo. Aurora me señala a mí. Hemos llegado a un acuerdo.',
    } },
    { id: 'libro_estilo', name: 'Libro de Estilo', handlers: {
      mirar: async (api) => { await api.say(['El Libro de Estilo. Más grueso que la plantilla fija.', 'Página 1: «No se dice a nivel de». Página 2: «A nivel de comas, ver pág. 3».']); },
      coger: async (api) => {
        if (!api.flag('acto_2_iniciado')) { await tocSinCafe(api, 'Toc en el lomo. El libro no se mueve. Y yo, tampoco.'); return; }
        await aurora(api, 'Ese libro no se mueve. Es lo único que sostiene esta mesa.');
      },
      abrir: 'Lo abro por cualquier página: «Así no se dice». Tiene razón. Siempre.',
      usar: 'Consulto «becario senior». Remite a «contradicción».',
      empujar: 'Si lo empujo, se cae la mesa. Y con ella, la ortografía de la casa.',
    } },
    // ADENDA §3.6
    { id: 'bolis_aurora', name: 'bolígrafos rojos', handlers: {
      mirar: async (api) => {
        if (api.flag('boli_muerto_cogido')) await api.say('Bolígrafos rojos. Todos vivos. Al muerto lo llevo yo.');
        else await api.say('Bolígrafos rojos. Todos vivos menos uno, que yace.');
      },
      coger: async (api) => {
        // antes del café: el golpecito, con texto (crítica §10.1.12)
        if (!api.flag('acto_2_iniciado')) { await golpecito(api); await api.say('¡Au! Me ha corregido la mano. En rojo.'); return; }
        if (!api.flag('custodia_regla')) { await aurora(api, '¿Un boli muerto? ¿Para qué quieres tú un cadáver, criatura?'); return; }
        if (!api.flag('boli_muerto_cogido')) {
          await aurora(api, 'Ese murió corrigiendo un «detrás mío». Llévatelo. Que se sepa.');
          api.give('boli_muerto');
          api.sfx('pickup');
          api.setFlag('boli_muerto_cogido', true);
          return;
        }
        await aurora(api, 'Los demás están vivos. Y son míos.');
      },
      usar: 'Pruebo uno en la mano. Me corrige la línea de la vida.',
    } },
    { id: 'corrector_aurora', name: 'tableta', handlers: {
      mirar: async (api) => { await api.say(['Una tableta: «CORRECTOR IA (DESARROLLO)». Calza el Libro de Estilo.', 'Por fin sirve.']); },
      coger: async (api) => {
        if (!api.flag('acto_2_iniciado')) { await tocSinCafe(api, 'Toc en la tableta. La tableta calla. Aurora, también.'); return; }
        await aurora(api, ['Déjala. Me cambiaba «detrás de mí» por «detrás mío».', 'La desenchufé con el boli. Rojo.']);
      },
      usar: 'Si la saco, se cae la mesa. Es su única función con futuro.',
      hablar: 'Le digo «detrás de mí». Se queda callada. Ha aprendido.',
    } },
  ],

  actors: [
    { id: TEO, defaultVerb: 'hablar', murmurs: null,   // sus murmullos los escupe el fax (objeto `fax`)
      handlers: {
        mirar: async (api) => { await api.say(['Teodoro Cuerpodoce, jefe de cierre.', 'Tirantes, visera y veintinueve años sin ver la calle.']); },
        hablar: hablarTeodoro,
        'dar:ficha_pagina_7': darFicha,
        'dar:pieza_opa': async (api) => {
          if (api.flag('pieza_recortada')) { await fax(api, 'Veintitrés. Cabe. Ahora dame la ficha: sin ficha no hay página.'); return; }
          await fax(api, ['Treinta y una líneas. El faldón, veintitrés.', 'Me sobran ocho. No recorto: yo solo mido.']);
        },
        'dar:cafe': async (api) => { await fax(api, 'Café de la web. Sabe a clic.'); },
        'dar:manual_fax': async (api) => { await fax(api, 'Ese manual lo escribí yo. Hay una errata en la página 9. Déjala.'); },
        'dar:boli_muerto': async (api) => { await fax(api, 'Descanse en cuerpo 9.'); },
        'dar:copias_rechazadas': async (api) => {
          intento(api);
          await api.anim(TEO, 'reach', 500);
          await api.say('Teodoro señala el fax. Con mucha intención.');
        },
        'dar:mensaje_fp': async (api) => { await fax(api, 'Las fuentes, a Aurora. Yo solo mido.'); },
        'dar:fotocopia_nota_direccion': async (api) => { await fax(api, 'Las fuentes, a Aurora. Yo solo mido.'); },
        'dar:acta_reunion': async (api) => { await fax(api, 'Dos líneas. Cabe en un faldón. Y sobra.'); },
        'dar:tarjeta_becario': async (api) => { await fax(api, '«Pellizco». Once con espacios. Mal medido y peor escrito.'); },
        'dar:taper_huerfano': async (api) => { await fax(api, 'Un táper. Vacío. Cabe todo. No lo quiero.'); },
        'dar:*': async (api) => { await fax(api, 'Eso no se faxea. No cabe. Lo he medido de lejos.'); },
        empujar: 'No se empuja a un jefe de cierre. Se le entrega a tiempo.',
        tirar: 'Tirarle de los tirantes sería el último gesto de mi carrera.',
        coger: 'No. Teodoro no sale de aquí desde 1997. Yo no voy a ser el primero.',
      } },
    { id: AUR, defaultVerb: 'hablar',
      handlers: {
        mirar: 'Aurora, correctora. Tiene un boli rojo clavado en el moño. Por si acaso.',
        hablar: hablarAurora,
        // paso 16 · el café de Aurora
        'dar:cafe': async (api) => {
          if (!api.flag('acto_2_iniciado')) { await api.dialog('aurora', 'A_CAFE'); return; }
          await aurora(api, 'Ya me he tomado uno. El segundo me vuelve amable. No te conviene.');
        },
        // paso 30 · dos fuentes
        'dar:fotocopia_nota_direccion': darFuente,
        'dar:mensaje_fp': darFuente,
        'dar:pieza_opa': async (api) => { await aurora(api, 'Tiene un adjetivo. Lo dejo. Hoy estoy de buenas.'); },
        'dar:acta_reunion': async (api) => { await aurora(api, 'Dos faltas en dos líneas. Para ser la primera acta, prometedora.'); },
        'dar:ficha_pagina_7': async (api) => { await aurora(api, 'La ficha es tuya. No la arrugues, que la rotativa lo nota.'); },
        'dar:boli_muerto': async (api) => { await aurora(api, 'No me lo devuelvas. A los muertos no se les corrige.'); },
        'dar:*': async (api) => {
          if (!api.flag('acto_2_iniciado')) { await tocSinCafe(api, 'Toc. Señala el cartel. Primero el café; luego, lo demás.'); return; }
          await aurora(api, 'Eso no lleva tilde ni la necesita. No me interesa.');
        },
        empujar: 'Ni se me ocurre. Me corregiría la postura.',
        tirar: 'Tirarle del boli del moño es quitarle la espoleta a una granada.',
      } },
  ],

  dialogs: { aurora: dialogoAurora, teodoro: dialogoTeodoro },
  duels: { teodoro: dueloTeodoro },
  scenes: { acto_3a: escenaActo3a, teodoro_derrota: derrotaTeodoro },
  defaults: {},
  ambient: [
    // adenda 3.6: reacción de Aurora a los «!!» de Tadeo (con tadeo_rv_n ≥ 1 y acto_2_iniciado). Una sola vez.
    { id: 'aurora_tadeo', if: ['acto_2_iniciado', (api) => (api.flag('tadeo_rv_n') || 0) >= 1], voces: { A: AUR },
      discusiones: [[['A', 'Dos exclamaciones de cierre y ninguna de apertura.'], ['A', 'Eso no es entusiasmo, criatura. Es inglés.']]] },
  ],

  async onEnter(api) {
    // idempotente: el estado del fax sigue al flag (también tras cargar o si otro paquete lo ha puesto)
    const st = api.flag('fax_con_papel') ? 'con_papel' : 'sin_papel';
    if (api.getState('fax') !== st) api.setState('fax', st);
    // el teléfono rojo solo está descolgado mientras Teodoro habla en la escena 7.3a
    if (api.getState('telefono_rojo') !== 'colgado') api.setState('telefono_rojo', 'colgado');
    if (api.game.actors[TEO]) api.game.actors[TEO].auricular = false;
  },
}, art);
