// SALA `sala_amazonas` — LÓGICA. Dueño: P4 (plan de comedia §11). Plan: §4.4 (la reunión y la estampida), §5.9 (Gervasio
// y Maripaz en la Sala, Acto II), §7.4-7.7 (duelo D1 de Maripaz; derrota con Siestatón), §4.7 (la tele `entrada_1` del
// clímax) y el clímax 7.4 (en ../escenas/climax.js).
// ENMIENDA E2 §4.2-4.3: Maripaz ve cada píxel como hueco publicitario. El pop-up de la X menguante antes de cada menú
// (`maripaz_popup_n`: 3 px, 1 px, sin X + «Podrá cerrar en 3»), la página 7 según Comercial (plano detalle), el anuncio
// de la estampida, el árbol `maripaz_sala`, sus verbos y D1 entero; al ganar, el adhesivo «SU ANUNCIO AQUÍ» en la
// mochila de Bruno (`bruno_con_banner`, lo pinta el sprite; lo quita Aurora, P3). §6 L22-L25, L33; §8 (sus fechas).
// El arte y la geometría están en ./art/sala_amazonas.art.js. Estados del objeto `proyector`: 'diapo_247' / 'diapo_248'.
// Cruces (§11.1): pone `reunion_terminada` (lo leen P3 —el fugitivo de Mercados en el Vending— y P0) y, con D1,
// `duelo_maripaz_ganado` y `casilla_hueco` (Maripaz vuelve a Marketing y Comercial: ./ecosistema.js).
// [PA] ENMIENDA E5 §2.1 · «Pregunta del público»: Mirar el orden del día (`sala_amazonas_orden_visto`) → Gervasio «Los
// becarios no tienen turno… y los conectados» (`sala_becario_sin_turno`, G) → Gertrudis lo reenvía (office.js,
// `gertrudis_pregunta`, G) → Usar la tele (`teleSegunTurno`, escena `sala_tele_gertrudis`) → estampida con ATASCO
// JUGABLE (`sala_amazonas_atasco`; vías empujar / cruasán / hablar / anuncio a los 10 s quieto; `resolverAtasco`).
// [PA] ENMIENDA E6 §2.2 · el atasco se anuncia (plano de la puerta, «¿Necesitan ayuda?», Mirar = N2, anuncio a los 20 s);
// §2.3 · Hablar con la tele con «sin turno»: árbol `tele_sala` (opciones del Vending) → `teleGertrudis({ sintonizada })`;
// la vía del Vending sigue entera. §4.1 (E179-E209, X7, X14) y §4.3 (constantes, bajas de claves duplicadas).
// §2.6 · la señal tras el clímax (`update`: crujido con `tamb3` y megafonía de Celestino a 10/25/45 s de tiempo quieto).
// §5.2 Mercados con nombre (Fermín, Rogelio, Jacinto) · §5.4 el Lector Medio asiente sin globo · textos §4 (C46, C61-C63,
// C98, M15, M24, M29-M32, M34, X04-X08, X10, D02-D05).
import { buildRoom } from '../lib/room.js';
import art, { popupComercial, paginaComercial, tabletaEnAlto } from './art/sala_amazonas.art.js';
import { gong, SFX, rota } from '../escenas/planta_noble.js';
import { duelInigo, climaxActivo, climaxEntrada, climaxReintento, climaxEmpujon, replicasD4, PUNTOS_D4 } from '../escenas/climax.js';
import { tambaleo } from '../actors.js';
import { MEGAFONIA_TAMBALEO, MEGAFONIA_TAMBALEO_S } from '../lib/celestino.js';
import ITEMS from '../items.js';

const GERV = 'gervasio_acta', INIGO = 'inigo_sinergia', LECTOR = 'lector_medio', MARIPAZ = 'maripaz_remitido';
const MERC = ['mercados_1', 'mercados_2', 'mercados_3'];
const PUERTA = [24, 112];
const sayG = (api, t) => api.sayAs(GERV, t);
const sayI = (api, t) => api.sayAs(INIGO, t);
const sayM = (api, t) => api.sayAs(MARIPAZ, t);
const sayMe = (api, n, t) => api.sayAs(MERC[n - 1], t);
const aqui = (api, id) => { const p = api.actorPos(id); return !!(p && p.room === 'sala_amazonas' && api.isVisible(id)); };
// [PA] E6 §4.3: una constante por cadena que se oye en dos ramas del mismo objeto
const MARIPAZ_PAGINA7 = '¡Uy! Si me mueves a mí, se mueve la página 7.';
const BOCA_ABAJO = 'Boca abajo en el suelo, delante de la mesa.';
const POR_ESCRITO = 'Eso, por escrito. Si no está en el hilo, no escala.';

// la tele de videollamadas, Actos I-II (rota con `tele_n`; tras la 5 vuelve a la 1)
const TELE = [
  ['Sale la cámara del vestíbulo. Celestino le narra el Ibex al ficus.'],
  ['«ENTRADA 2»: el tiempo de ayer. En diferido.'],
  ['«ENTRADA 3»: una videollamada de 2019. Ramírez, congelado a medio cruasán.'],
  ['«BUSCANDO SEÑAL». La busca con más ganas que yo.'],
  ['«ENTRADA 5»: «PLAN CERO PAPEL · DIAPOSITIVAS: 400 · DATOS: 0».'],
];
async function usarTele(api) {
  if (api.flag('acto_3_iniciado')) { await api.say('No se enciende. El mando lo tiene alguien de Mercados, en el Vending.'); return; }
  const n = api.inc('tele_n'); await api.say(TELE[(n - 1) % TELE.length]);
}

// ---- [PA] E5 §2.1.5 · la tele según el turno: una sola puerta para Usar / Hablar / Cerrar la tele y Usar la caja de cables
// su voz sale de la tele, pero el globo va a su izquierda (sobre la pantalla del orden del día) para no tapar su LCD
const GERTRUDIS_TV = { color: '#39FF14', at: [186, 62], width: 104 };
const CONVOCADA = 'CONVOCADA. TODA LA EMPRESA EN COPIA. EMPIEZA EN CINCO MINUTITOS.';
const TELE_E00 = 'E-00: DE NADA. ESO TAMBIÉN SE DICE.';
/** [PA] E6 §2.3 · Hablar con la tele. Con «sin turno» (y sin la pregunta hecha en el Vending), la tele la sintoniza si se
 *  la llama como a ella: con educación (árbol `tele_sala`, opciones del Vending, literal). La vía del Vending sigue entera:
 *  con `gertrudis_pregunta`, la escena sale directamente (va antes que el árbol). */
async function hablarTele(api) {
  if (api.flag('sala_amazonas_atasco')) { await api.sayFrom('tele_amazonas', CONVOCADA, GERTRUDIS_TV); return; }
  if (api.flag('gertrudis_pregunta') && !api.flag('reunion_terminada')) { await api.scene('sala_tele_gertrudis'); return; }
  if (api.flag('sala_becario_sin_turno') && !api.flag('reunion_terminada')) {
    await api.dialog('tele_sala');
    if (api.flag('gertrudis_pregunta')) await api.scene('sala_tele_gertrudis', { sintonizada: true });
    else api.setState('tele_amazonas', 'normal');
    return;
  }
  await api.say(['«¿Me veis la pantalla?». La tele no contesta.', 'Es la experiencia completa.']);
  if (!api.flag('reunion_terminada') && aqui(api, 'mercados_2')) await sayMe(api, 2, 'Se te ha congelado.');
}
async function teleSegunTurno(api, deHoy) {
  // con el atasco abierto, la tele sigue con Gertrudis: lo repite (0 líneas nuevas; no es una vía, §12.1)
  if (api.flag('sala_amazonas_atasco')) { await api.sayFrom('tele_amazonas', CONVOCADA, GERTRUDIS_TV); return; }
  if (api.flag('gertrudis_pregunta') && !api.flag('reunion_terminada')) { await api.scene('sala_tele_gertrudis'); return; }
  if (api.flag('sala_becario_sin_turno') && !api.flag('gertrudis_pregunta') && !api.flag('reunion_terminada')) {
    api.setState('tele_amazonas', 'buscando');
    api.sfx('click');
    await api.wait(1000);
    await api.say('«BUSCANDO SEÑAL». Alguien con wifi y rencor la encontraría enseguida.');
    api.setState('tele_amazonas', 'normal');
    return;
  }
  await deHoy(api);
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
  // E5 §2.1.6: la única salida es la puerta atascada; Ir/Usar la puerta = vía `empujar` (Bruno no sale: mira la escena)
  if (atascoAbierto(api)) { await resolverAtasco(api, 'empujar'); return; }
  if (climaxActivo(api) && !api.flag('lector_derribado')) {
    if (api.flag('duelo_inigo_ganado')) { await api.say('Todavía no. A Íñigo le queda un dato. Asiente junto a la pantalla.'); return; }
    if (replicasD4(api) >= PUNTOS_D4) { await api.say('No me voy. Íñigo sigue en la 247 y yo sigo en copia.'); return; }
    await api.say('Vuelvo enseguida. La 247 no se va a mover.');
  }
  api.sfx('door');
  await api.goto('pajarera', 'sala_amazonas');
}

// los tres de Mercados (Actos I-II, hasta la estampida): sentados tras la mesa. E5 §5.2: Fermín Plazofijo (que nada se
// mueva), Rogelio Diferido (siempre con retraso), Jacinto Dividendo (cobrar dos veces).
const MERCADOS_MIRAR = [
  'Fermín Plazofijo, de Mercados. Cuando empezó la reunión, era lampiño.',
  'Rogelio Diferido, de Mercados. Sigue una videollamada que ya ha acabado.',
  'Jacinto Dividendo, de Mercados. Gafas de cerca y dos dietas por reunión.',
];
const MERCADOS_HABLAR = [
  'Chsss. Punto tres. Mientras no se mueva nada, yo estoy bien.',
  '¿Sigue siendo marzo?',
  'Propongo otra reunión para ver el punto tres. Yo cobro dieta por cada una.',
];
// X10: cada uno murmura lo suyo (Fermín pide procedimiento, Rogelio sigue en la videollamada, Jacinto convoca)
const MERCADOS_MURMURA = [['Que alguien pida sala para salir de la sala.'], ['¿Me veis la pantalla? ...¿Hola? ¿Me veis?'],
  ['Entramos cinco minutitos. En marzo.']];
// el atasco de la puerta (estampida): sus tres líneas de hoy, que durante el atasco también son sus murmullos (§2.1.7)
const MERCADOS_ENCAJADOS = 'Los tres de Mercados, encajados en el marco, sin ceder un palmo.';
const MERCADOS_ATASCO = ['¡Usted primero!', '¡No, usted, que es de Bolsa!', '¡Yo soy de Bolsa y de Mercados! ¡Tengo doble prioridad!'];
const mercadosActor = (id, i) => ({
  id, when: ['!reunion_terminada', '!acto_3_iniciado', '!sala_amazonas_estampida'],
  // con el atasco abierto están en la puerta: Bruno se les acerca por la franja de la izquierda (art `positions.atasco`)
  pos: (v) => (v.flag('sala_amazonas_atasco') ? 'atasco' : 'mesa'),
  murmurs: (v) => (v.flag('sala_amazonas_atasco') ? [MERCADOS_ATASCO[i]] : MERCADOS_MURMURA[i]),
  handlers: {
    // [PA] E6 §2.2.3 (N2): con el atasco, Mirar a cualquiera de los tres describe el atasco (una línea para los tres)
    mirar: async (api) => { await api.say(api.flag('sala_amazonas_atasco') ? MERCADOS_ENCAJADOS : MERCADOS_MIRAR[i]); },
    hablar: async (api) => {
      if (atascoAbierto(api)) { await resolverAtasco(api, 'hablar'); return; }
      await sayMe(api, i + 1, MERCADOS_HABLAR[i]);
    },
    empujar: async (api) => {
      if (atascoAbierto(api)) { await resolverAtasco(api, 'empujar'); return; }
      await api.say('No reaccionan. Están en modo «a la espera de resultados».');
    },
    coger: 'No se cogen. Cotizan.',
    'dar:cafe': 'Lo miran como a un dato nuevo. No se atreven: no está en el orden del día.',
    'dar:*': 'Lo miran. No lo cogen. Hasta que no se vote, no es suyo.',
  },
});

// ---- D1 (plan §7.4-7.7; E2 §4.3): Maripaz, en la Sala. Mazo R08, R04, R11, R14; remate con la ficha de la página 7.
// La entrada (`intro`) va vacía: el duelo se abre siempre desde el árbol `maripaz_sala`, que ya dice su línea (E2 §7.4,
// paso 26); la de «Te lo pongo por escrito. Con banner.» la dice el árbol en las revanchas.
// crítica 3 · N8: quién ha sellado de verdad la ficha. La da Aurora con su sello; si antes de D1 Bruno ha ganado a
// Teodoro (D2) y él la ha sellado (casilla_firma), el sello que se ve es el de Teodoro.
const selloTeodoro = (api) => !!api.flag('casilla_firma');
const fichaSellada = (api) => `Ficha de la página 7. Sellada por ${selloTeodoro(api) ? 'Teodoro' : 'Aurora'}. Impar.`;
const INTRO_REVANCHA = '¿Llamar yo a Siestatón un viernes? Te lo pongo por escrito.';
export const duelMaripaz = {
  actor: MARIPAZ,
  from: 'Maripaz Remitido',
  subject: 'Llamar a Siestatón para pasarlos a la web (contiene publicidad)',
  assigned: 'B. Pollejo',
  deck: ['R08', 'R04', 'R11', 'R14'],
  attackText: {
    R08: 'Te escribo desde el cariño más absoluto. Con un banner en la firma.',
    R04: 'Hazlo tú, que escribes divinamente. Entre tus párrafos caben tres banners.',
    R11: 'Me quedo a la espera de tus comentarios. Mientras, te pongo un vídeo.',
    R14: 'Si quieres lo vemos en una reunión rápida. Con pop-up de bienvenida.',
  },
  intro: [],
  hurt: ['Uy, eso tiene tarifa.', 'Bien dicho. Eso, al lado de un anuncio de tiritas.'],
  taunt: ['Eso no lo patrocina nadie.', 'Muy bonito. Pero sin anuncio no es contenido.'],
  finishers: [
    { atScore: 3, text: '¿Y quién me firma que esa página es noticia y no un hueco para anuncios?', object: 'ficha_pagina_7',
      wrongObject: { '*': 'Eso no lleva sello. Sin sello, para mí es un hueco. Y los huecos los vendo.' },
      script: async (api) => { await api.say(fichaSellada(api)); } },
  ],
  cc1: 'Colchones Siestatón',
  defeatLine: 'RESPUESTA AUTOMÁTICA DE COMERCIAL: «Cierre este anuncio para leer la respuesta».',
  defeatLines: ['Asignado a ti, cariño. El teléfono de Siestatón es este. Antes, un anuncio.'],
  defeatScene: 'd1_siestaton',
  defeatHeadline: 'BECARIO LLAMA A UN COLCHÓN UN VIERNES. EL COLCHÓN NO LO COGE',
  onWin: async (api) => {
    // crítica 3 · N8: si ha sellado Teodoro (D2 antes que D1), Maripaz no habla del café de Aurora
    await sayM(api, [selloTeodoro(api) ? '...Teodoro no sella nada que no quepa. Y tú has cabido.' : '...Aurora no sella nada sin café. Has invitado a la correctora.',
      'Vale. Siestatón, a la web. Allí caben en todas partes.']);
    // se levanta; debajo, el planillo: lo dobla y se lo da a Bruno, que lo mete en la ficha
    api.pose(MARIPAZ, 'de_pie');
    api.hide('planillo_bajo_maripaz');
    api.sfx('pickup');
    await api.anim('bruno', 'reach', 400);
    await sayM(api, 'Hueco libre: veintitrés líneas. Impar, y sin un banner.');
    // E2 §4.2.3: al pasar por detrás de Bruno, le pega en la mochila un adhesivo «SU ANUNCIO AQUÍ» (golpe de mazo)
    api.setWalkbox('fondo', true);
    try {
      api.face('right');                                            // Bruno mira a la mesa: la mochila, hacia la puerta
      const b = api.actorPos('bruno');
      await api.walkActor(MARIPAZ, PUERTA[0] + 30, 112);
      await api.walkActor(MARIPAZ, Math.max(30, Math.round(b.x) - 14), Math.round(b.y));
      api.faceActor(MARIPAZ, 'right');
      await api.anim(MARIPAZ, 'reach', 350);
      api.setFlag('bruno_con_banner', true);
      api.sfx('hit');
      await sayM(api, 'Y esto, por las molestias. Tenías la espalda desaprovechada.');
      if ((api.flag('duel:maripaz:perdido_n') || 0) > 0) await sayM(api, 'Y quitad el ronquido de la espera. Me lo ha chivado el becario.');
      // sale hacia los Despachos
      await api.walkActor(MARIPAZ, PUERTA[0], PUERTA[1]);
    } finally { api.setWalkbox('fondo', false); }
    api.sfx('door');
    api.placeActor(MARIPAZ, null);
    api.pose(MARIPAZ, null);
    api.setFlag('duelo_maripaz_ganado', true);
    api.setFlag('casilla_hueco', true);
    if (!api.flag('bruno_con_banner')) api.setFlag('bruno_con_banner', true);
  },
};

// ---- E2 §4.2.1 · el pop-up de la X menguante: cada vez que Bruno le habla tras la estampida, antes del menú
async function popupMaripaz(api) {
  const n = api.inc('maripaz_popup_n');
  const base = { titulo: 'PUBLICIDAD', w: 150, h: 60, draw: popupComercial, oscurecer: 0.35 };
  if (n === 1) {
    await api.detalle({ ...base, cerrarX: 3 }, async (api) => {
      await api.say('¿Dónde se cierra esto?');
      await sayM(api, 'En la X, cariño.');
      await api.say('La X mide un píxel.');
      await sayM(api, 'La semana pasada medía dos. Optimizamos.');
    });
  } else if (n === 2) {
    await api.detalle({ ...base, cerrarX: 1 }, async (api) => {
      await api.say('Ahora la X es un punto.');
      await sayM(api, 'Un punto muy bien situado.');
    });
  } else {
    // 3.ª y siguientes: sin X; «Podrá cerrar en 3» (el clic no lo cierra en esos 3 s; Esc y el modo rápido, sí)
    await api.detalle({ ...base, cerrarX: 0, ms: 3700, cuenta: { ms: 3000, texto: 'Podrá cerrar en {n}', fin: 'Cerrar ›' } });
  }
}

/** E2 §4.2.2 · la página 7 según Comercial (plano detalle, opción del árbol). */
async function paginaSegunComercial(api) {
  await sayM(api, 'Mi propuesta para la página 7. Mira.');
  await api.detalle({ titulo: 'PÁGINA 7 · PROPUESTA DE COMERCIAL', w: 200, h: 100, draw: paginaComercial }, async (api) => {
    await sayM(api, '¿Ves esa línea gris?');
    await api.say('¿La noticia?');
    await sayM(api, 'Se ve demasiado; estoy en ello.');
  });
}

/** §7.7 · derrota de D1: Bruno llama a Colchones Siestatón (primer plano del móvil); escala con la 2.ª y la 3.ª. */
async function d1Siestaton(api, info = {}) {
  const n = info.perdidos || 1;
  await api.phone.call({ caller: 'siestaton', label: 'Colchones Siestatón', outgoing: true }, async (api) => {
    if (n === 1) {
      await api.phone.say(['Ha llamado a Colchones Siestatón. Si desea dormir, pulse uno.',
        'Si ya duerme, no pulse. Le atenderemos en sueños.', 'Rrrrr... fiuuu... Rrrrr... fiuuu...']);
      await api.say('Me han puesto un ronquido en espera. Cuelgo y vuelvo con Maripaz.');
    } else if (n === 2) {
      await api.phone.say(['Bienvenido otra vez. Su llamada nos importa, por eso bostezamos.', 'Rrrrr... RRRRR... fiuuu... fiuuu...']);
      await api.say('Ahora roncan dos. Están ampliando plantilla.');
    } else {
      await api.phone.say('Le pasamos con su comercial.');
      gong(api);
      await sayM(api, '¿Sí? ¿Me llamas desde un colchón? Buena elección.');
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
    sala_amazonas_orden_visto: 'bool · PA · E5 §2.1.2 · Mirar orden_del_dia · opción de Gervasio',
    sala_amazonas_atasco: 'bool · PA · E5 §2.1.6 · Mercados encajados en la puerta · vías (E6: 20 s)',
  },

  objects: [
    { id: 'sala_a_pajarera', name: 'puerta de los Despachos', exit: { room: 'pajarera', tipo: 'puerta' }, handlers: {
      ir: salir,
      usar: salir,
      abrir: 'Ya está abierta. Nadie sale. Es un hecho cultural.',
      cerrar: 'Si la cierro, esto se convierte en una reunión de verdad.',
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
        else await api.say('Diapositiva 247 de 400: «Sinergias exponenciales: el viaje».');
      },
      usar: 'Le doy a «siguiente». La 247 se queda. Tiene más estabilidad que yo.',
      empujar: 'Lo empujo un poco. Zumba, y la 247 aguanta.',
      cerrar: 'Si lo apago, Íñigo presenta a oscuras, y lo haría igual.',
      coger: 'Está atornillado al techo. Tadeo lo propuso para toda la web.',
    } },
    { id: 'orden_del_dia', name: 'orden del día', handlers: {
      mirar: async (api) => {
        if (api.flag('reunion_terminada')) await api.say('Todo tachado, hasta «Siguientes pasos». La tinta está corrida.');
        else {
          await api.say(['ORDEN DEL DÍA: 1. Previsión. 2. Previsión de la previsión. 3. Siguientes pasos.',
            'El punto 3. Nadie lo toca: dicen que muerde.']);
          api.setFlag('sala_amazonas_orden_visto', true);           // E5 §2.1.2: abre la pregunta a Gervasio
        }
      },
      usar: async (api) => {
        if (api.flag('reunion_terminada')) await api.say('Ya no queda nada que tratar. Es la pantalla más feliz del edificio.');
        else await api.say('Para tocar el punto 3 hay que decirlo en voz alta, a quien preside.');
      },
      coger: 'Es una pantalla. Si me la llevo, la reunión me sigue a casa.',
      hablar: 'Leo el punto 3 en voz baja. Fermín se estremece.',
    } },
    // §4.4: Maripaz incuba el planillo (8×3 px bajo ella). Se ve, no se coge: se negocia (D1).
    { id: 'planillo_bajo_maripaz', name: 'planillo', when: ['acto_2_iniciado', '!casilla_hueco', '!acto_3_iniciado'], handlers: {
      mirar: 'Asoma un borde del planillo. Página 7: «Colchones Siestatón». Encima, Maripaz.',
      coger: async (api) => { await sayM(api, 'Ese planillo tiene un hueco. Es mío hasta que alguien llame a Siestatón.'); },
      tirar: 'Tiro un milímetro. Maripaz pesa más que el planillo.',
      usar: 'Para usarlo tendría que levantarse Maripaz. Eso se negocia aparte.',
      empujar: 'Lo empujo hacia dentro y Maripaz se acomoda encima.',
    } },
    { id: 'minicruasanes', name: 'mini-cruasanes', handlers: {
      mirar: async (api) => { await api.say(['Ochenta mini-cruasanes para cuarenta periodistas.', 'Las matemáticas nunca fallan: no llegan.']); },
      coger: async (api) => {
        if (atascoAbierto(api)) { await resolverAtasco(api, 'cruasan'); return; }
        await api.say('Queda medio. Es de Mercados: lo tienen en cartera.');
      },
      usar: async (api) => {
        if (atascoAbierto(api)) { await resolverAtasco(api, 'cruasan'); return; }
        await api.say('Me como una miga. Sabe a reunión de marzo.');
      },
      empujar: 'Acerco la bandeja a Mercados. Ni la miran. Están en el punto 3.',
    } },
    { id: 'botellines', name: 'botellines', state: 'en_fila', states: ['en_fila', 'volando', 'tumbados'], handlers: {
      mirar: async (api) => {
        if (api.getState('botellines') === 'tumbados') await api.say('Catorce botellines por los suelos. Uno sigue en pie. Es de Mercados.');
        else await api.say('Catorce botellines sin abrir. Aquí nadie bebe: se nota que se piensa.');
      },
      coger: 'Si abro uno, me lo imputan como gasto de representación.',
      abrir: 'Abrir uno es asumir un gasto. Mejor me deshidrato con dignidad.',
      empujar: async (api) => { api.sfx(SFX.botellines); await api.say('Los alineo. Catorce en fila parecen un comité.'); },
    } },
    // la tele: Actos I-II, canales; Acto III, apagada hasta que la enciende Celestino en el clímax (estado `entrada_1`)
    // E5 §2.1.5: estados `buscando` (nieve, «BUSCANDO SEÑAL») y `gertrudis` (su LCD a pantalla completa, EN DIRECTO)
    { id: 'tele_amazonas', name: 'tele de videollamadas', states: ['normal', 'entrada_1', 'buscando', 'gertrudis'], handlers: {
      mirar: async (api) => {
        if (api.getState('tele_amazonas') === 'entrada_1') await api.say('«ENTRADA 1»: el vestíbulo. Celestino retransmite.');
        else if (api.flag('acto_3_iniciado')) await api.say('Apagada. Solo el piloto rojo, en reposo. Se lo ha ganado.');
        else await api.say('Una tele de videollamadas. Pegatina: «PULSAR ENTRADA 3. NO, LA 2. NO».');
      },
      usar: (api) => teleSegunTurno(api, usarTele),
      hablar: hablarTele,                           // [PA] E6 §2.3: con «sin turno», el árbol `tele_sala`
      coger: 'Atornillada. Alguien temió que la tele se fuera antes que Mercados.',
      cerrar: (api) => teleSegunTurno(api, async (api) => {
        if (api.flag('acto_3_iniciado')) await api.say('Ya está apagada. Más apagada sería una sala de espera.');
        else await api.say('La apago y se enciende sola en «BUSCANDO SEÑAL».');
      }),
      // E5 §2.1.5 (pista 3): el móvil no sintoniza; el resto del juego, el genérico del móvil
      'usar:movil': async (api) => {
        if (api.flag('sala_becario_sin_turno') && !api.flag('reunion_terminada')) {
          await api.say('Desde mi móvil no me sintoniza nadie. Los once mil son de la cafetera.');
          return;
        }
        // [PA] E6 §4.3: el genérico del móvil se importa de items.js, no se copia
        const g = ITEMS.movil.handlers['usar:*'];
        if (typeof g === 'function') await g(api); else await api.say(g);
      },
    } },
    { id: 'caja_cables', name: 'caja de cables', when: '!acto_3_iniciado', handlers: {
      mirar: async (api) => { await api.say(['Catorce cables y siete adaptadores. Uno adapta un adaptador a otro.', 'Hay uno que encaja consigo mismo. Lo dejo así: es feliz.']); },
      usar: (api) => teleSegunTurno(api, usarTele),   // «Usar con tele_amazonas: igual que Usar la tele»
      coger: 'Si me llevo un cable, alguien no podrá presentar. Tentador.',
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
      murmurs: ['Eso, en todo caso, lo hablamos.'],     // E5 M29: fuera la de la salud · [PA] E6 E198: fuera «Diecinueve años…»
      handlers: {
        mirar: async (api) => {
          if (api.flag('acto_3_iniciado')) await api.say('Gervasio, de pie junto a su sillón. Con un café que no le han servido.');
          else await api.say('Gervasio preside. Lleva tanto en el punto 3 que ya lo tutea.');
        },
        hablar: async (api) => {
          if (atascoAbierto(api)) { await resolverAtasco(api, 'hablar'); return; }
          if (!api.flag('acto_3_iniciado')) { await api.dialog('gervasio_reunion'); return; }
          // E2 §4.2.3: la reacción al adhesivo (una vez, compartida con la de Despachos)
          if (api.flag('bruno_con_banner') && api.once('pajarera_gervasio_banner')) { await sayG(api, 'Ese anuncio en la espalda... se agradece. Pero lo hablamos.'); return; }
          if (api.flag('lector_derribado')) await sayG(api, 'Diecinueve años y nadie lo había preguntado.');
          else if (api.flag('duelo_inigo_ganado')) await sayG(api, 'Lo que diga el Lector Medio. Que se está... Se está moviendo.');   // M34
          else await sayG(api, 'Yo aquí solo estoy en... en copia.');
        },
        'dar:cafe': async (api) => { await sayG(api, '¿Un café? ¿A mí? Esto no estaba en el orden del día.'); },
        'dar:acta_reunion': async (api) => { await sayG(api, 'No, no. El acta es tuya. Yo ya... Se ha cumplido.'); },
        'dar:*': async (api) => { await sayG(api, 'Eso lo coges tú, que tienes la agenda más limpia.'); },
        empujar: 'Gervasio no se mueve. Esquivar marrones da mucha estabilidad.',
      } },
    ...MERC.map(mercadosActor),
    // §5.9 · Maripaz en la Sala (Acto II hasta ganar D1), al fondo de la mesa, sentada en el planillo (E2 §4.3)
    { id: MARIPAZ, when: ['acto_2_iniciado', '!casilla_hueco', '!acto_3_iniciado'],
      murmurs: ['Entre esta silla y aquella cabe un banner. Lo he medido.', 'Esta reunión, con un pop-up al principio, ya sería rentable.'],
      handlers: {
        mirar: 'Maripaz, Comercial. Sentada en el planillo, con una tableta llena de anuncios.',
        hablar: async (api) => {
          if (atascoAbierto(api)) { await resolverAtasco(api, 'anuncio'); return; }
          if (!api.flag('reunion_terminada')) { await sayM(api, 'Ahora no. Le estoy vendiendo el orden del día a Mercados.'); return; }
          // crítica 3 · punto 12: en las revanchas (D1 ya perdido) no hay pop-up obligatorio; solo antes del primer intento
          if (!((api.flag('duel:maripaz:perdido_n') || 0) > 0)) await popupMaripaz(api);
          await api.dialog('maripaz_sala');
        },
        // [PA] E6 §4.3: «Has hecho clic en un anuncio…» se queda en Comercial; aquí, Usar = su Empujar
        usar: async (api) => { api.sfx('hit'); await sayM(api, MARIPAZ_PAGINA7); },
        coger: async (api) => { await sayM(api, '¿Cogerme? Antes, el formulario de contacto, cariño: catorce campos.'); },
        empujar: async (api) => { api.sfx('hit'); await sayM(api, MARIPAZ_PAGINA7); },
        'dar:ficha_pagina_7': async (api) => { await sayM(api, 'Una ficha sin hueco. El hueco lo tengo yo, aquí debajo.'); },
        'dar:cafe': async (api) => { await sayM(api, '¿Café? Ya tengo. Y la taza lleva anuncio. Mira: Cafés Madrugón.'); },
        // [PA] E6 E202 y §4.3: `dar:pieza_opa` y `dar:correo_evaristo` caen en su `dar:*` (las dos se quedan en Comercial)
        'dar:*': async (api) => { await sayM(api, 'Si no lleva logo, no lo cojo. Y si lo lleva, lo cobro.'); },
      } },
    // E5 §5.4 / M24: antes del clímax el cartón no habla ni lleva globo; asiente (gesto) y Gervasio decide por él
    { id: LECTOR, when: 'acto_3_iniciado',
      murmurs: [],
      handlers: {
        mirar: async (api) => {
          if (api.flag('lector_derribado')) await api.say([BOCA_ABAJO, 'Por detrás: «Atrezo – Focus group 2014».']);
          else if (api.flag('chaqueta_en_lector')) await api.say('Junto a la pantalla, el Lector Medio, con la chaqueta de Ramírez, asintiendo.');
          else await api.say('Junto a la pantalla, el Lector Medio, asintiendo.');
        },
        hablar: async (api) => {
          if (api.flag('lector_derribado')) { await api.say(BOCA_ABAJO); return; }
          const g = aqui(api, GERV);
          if (g) await sayG(api, 'Lo que diga el Lector Medio.');
          await asentir(api);
          if (g) await sayG(api, '...Pues ya está decidido.');
        },
        empujar: async (api) => {
          if (api.flag('lector_derribado')) { await api.say('Ya está en el suelo. Empujarlo más sería ensañarse con un cartón.'); return; }
          if (!api.flag('duelo_inigo_ganado') || !climaxActivo(api)) { await api.say('Todavía no. Primero, por escrito.'); return; }
          await api.scene('climax_empujon');
        },
        coger: 'Lo levanto un poco. Pesa lo que un folio, y asiente igual.',
        tirar: 'No tiro de la chaqueta de Ramírez. Aún tiene que volver a por ella.',
        // [PA] E6 §4.3: «Usar adhesivo» → defecto (la del celo se queda en Despachos)
        'dar:*': 'Se lo enseño. Asiente. Antes le ha asentido al proyector.',
      } },
    { id: INIGO, when: 'acto_3_iniciado',
      murmurs: ['Si nadie pregunta, esto se aprueba solo. Es mi parte favorita.',          // E5 M30 (los de siempre, en Despachos)
        'Rotativa, en rojo. Papel, en rojo. Becario, en rosa.'],
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
        'dar:cafe': async (api) => { await sayI(api, '¿Café? Ahora no. Voy por la 247.'); },
        'dar:tarjeta_becario': async (api) => { await sayI(api, 'Ya te tengo en la matriz. Abajo a la izquierda.'); },
        'dar:ticket_n1': async (api) => { await sayI(api, POR_ESCRITO); },
        'dar:acta_reunion': async (api) => { await sayI(api, POR_ESCRITO); },
        'dar:*': async (api) => { await sayI(api, 'Ese input no escala.'); },
        empujar: 'No. Está presentando. Si le empujo, pasa a la diapositiva 248.',
      } },
  ],

  dialogs: {
    // [PA] E6 §2.3 · la tele, con «sin turno»: las opciones de Bruno son las del Vending (office.js `G0`), literal; la
    // tele dice una sola línea nueva (N3). Sin actor (globo de Bruno), sin saludo.
    tele_sala: {
      actor: null, start: 'TV0',
      nodes: {
        TV0: {
          options: [
            { text: 'Buenas noches, Gertrudis.',
              do: async (api) => {
                api.setState('tele_amazonas', 'buscando'); api.sfx('click');
                await api.wait(600);
                api.setState('tele_amazonas', 'gertrudis'); api.sfx('beep');
                await api.sayFrom('tele_amazonas', 'BUENAS NOCHES, SALA AMAZONAS.', GERTRUDIS_TV);
                return 'TV1';
              } },
            { text: 'Nada.', exit: true, silent: true },              // la tele, como estaba
          ],
        },
        TV1: {
          options: [
            { text: '¿Y cuáles son los siguientes pasos?',
              do: async (api) => { api.setFlag('gertrudis_pregunta', true); return 'exit'; } },
            { text: 'Nada. Gracias, Gertrudis.', exit: true,
              do: async (api) => { await api.sayFrom('tele_amazonas', TELE_E00, GERTRUDIS_TV); } },
          ],
        },
      },
    },
    // §5.9 · nodo GV_REUNION (Gervasio preside; Mercados y, en el Acto II, Maripaz)
    gervasio_reunion: {
      actor: GERV, start: 'GV_REUNION',
      onStart: async (api) => {
        if (!api.once('sala_amazonas_reunion_saludo')) { await sayG(api, 'Seguimos en el punto tres. Se avanza.'); return; }
        await sayG(api, 'Estamos en el punto tres. Desde marzo. Se está... se avanza.');
        if (aqui(api, MARIPAZ)) await sayM(api, 'Y yo, esperando a Siestatón. Mientras, le vendo el punto tres a Mercados.');
        if (aqui(api, 'mercados_2')) await sayMe(api, 2, '¿Sigue siendo marzo?');
      },
      nodes: {
        GV_REUNION: {
          options: [
            { text: '¿Qué se decide aquí?', once: true,
              do: async (api) => {
                await sayG(api, 'Se decide... Se está decidiendo por quien corresponda.');
                if (api.flag('chaqueta_en_lector')) await sayG(api, 'Y Ramírez, que ha vuelto. Asiente mucho.');
                await api.say('¿Y qué dice el Lector Medio?');
                await sayG(api, 'Aún no se le ha preguntado. Se le preguntará. En el punto cuatro.');
              } },
            { text: '¿Me deja la página 7?', once: true,
              do: async (api) => {
                await sayG(api, 'La página 7 se... Eso habría que... Tú, que tienes la agenda limpia...');
                await api.say('¿...que tengo la agenda limpia para qué?');
                await sayG(api, 'Para eso. Muy bien visto, se toma nota.');
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
            // E5 §2.1.3: ya no termina la reunión: Gervasio le niega el turno al becario… y se lo da a «los conectados»
            { text: 'Bueno... ¿y cuáles son los siguientes pasos?', if: ['aurora_conto_pasos', 'sala_amazonas_orden_visto', '!sala_becario_sin_turno'],
              do: async (api) => {
                await api.wait(800);                                   // las tres cabezas se levantan y vuelven a bajar
                await sayG(api, 'Los becarios no tienen turno. Pregunta la mesa... y los conectados.');
                if (aqui(api, 'mercados_2')) api.faceActor('mercados_2', 'tele_amazonas');   // Rogelio mira la tele
                api.setFlag('sala_becario_sin_turno', true);
                return 'exit';                                         // no gasta «Me voy.»
              } },
            { text: '¿Quién tiene reservada la sala?', once: true,
              reply: 'Ramírez. Los viernes a las 20:59.',
              lines: [['player', '¿Y dónde está Ramírez?'], [GERV, 'Desayunando. La reserva se respeta: puede volver en cualquier momento.']] },
            { text: 'Me voy.', exit: true, reply: 'Se toma nota. No la tomo yo, pero se toma.' },
          ],
        },
      },
    },
    // E2 §4.3 · Maripaz en la Sala, tras la estampida (antes del menú, el pop-up: `popupMaripaz`)
    maripaz_sala: {
      actor: MARIPAZ, start: 'MP_SALA',
      nodes: {
        MP_SALA: {
          options: [
            { text: 'Siestatón no ha confirmado la página 7.', if: '!casilla_hueco',
              do: async (api) => {
                if ((api.flag('duel:maripaz:perdido_n') || 0) > 0) await sayM(api, INTRO_REVANCHA);
                else {
                  await sayM(api, ['¿Ocho meses sin confirmar? Eso no es un cliente, cariño. Es un exnovio.',
                    'Los paso a la web, que allí cabe todo. Pero alguien tiene que llamarles.']);
                }
                await api.duel('maripaz');
                return 'exit';
              } },
            { text: '¿Qué hace usted con el planillo?', once: true, do: paginaSegunComercial },
            { text: '¿Y si la gente no quiere anuncios?', once: true,
              reply: ['Para eso está la X. Cada mes la hago un poco más pequeña.', 'Nadie se ha quejado. No la encuentran.'] },
            { text: 'Luego vuelvo.', exit: true, reply: 'Aquí estaré. Si me cierras, vuelvo a aparecer.' },
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
    sala_tele_gertrudis: teleGertrudis,
  },
  defaults: {},
  ambient: [],

  // E5 §2.1.6 (anuncio a los 20 s quietos con el atasco abierto, E6 §2.2) y §2.6 (señal tras el clímax: crujido y megafonía)
  update(api, dt) {
    if (api.flag('sala_amazonas_atasco')) {
      if (A.ctl && !A.resolviendo && api.quieto()) {
        A.quieto += dt;
        if (A.quieto >= ATASCO_ANUNCIO_S) {
          A.resolviendo = true;                                // (resolverAtasco lo vuelve a comprobar)
          api.game.runScript((api) => resolverAtasco(api, 'anuncio', true), { label: 'atasco: anuncio (20 s)' });
        }
      }
      return;
    }
    if (!api.flag('duelo_inigo_ganado') || api.flag('lector_derribado') || !climaxActivo(api)) return;
    if (api.flag('sala_amazonas_lector_cae')) return;          // la caída manda (climaxEmpujon)
    const tb = tambaleo(api.game.time);
    if (tb === 'tamb3' && S.tamb !== 'tamb3' && aqui(api, LECTOR)) api.sfx('crujido');
    S.tamb = tb;
    // el reloj cuenta el tiempo SIN ACTUAR (el ratón no cuenta): no se para con los globos que no son del jugador
    // (murmullos, ambiente, la propia megafonía), que si no retrasan la tercera hasta pasado el minuto
    if (!sinActuar(api)) return;
    S.quieto += dt;
    if (!api.quieto()) return;                                 // …pero la megafonía no pisa un globo: espera a que acabe
    for (let i = 0; i < MEGAFONIA_TAMBALEO_S.length; i++) {
      if (S.quieto >= MEGAFONIA_TAMBALEO_S[i] && api.once('sala_lector_meg_' + i)) {
        api.megafonia('celestino', MEGAFONIA_TAMBALEO[i], { etiqueta: 'MEGAFONÍA' });
        break;
      }
    }
  },

  async onEnter(api) {
    S.quieto = 0; S.tamb = null;
    A.ctl = null; A.resolviendo = false; A.quieto = 0;
    // E5 §2.1.6: una partida cargada (o una sala reabierta) con el atasco a medias se resuelve EN SILENCIO
    if (api.flag('sala_amazonas_atasco')) {
      api.setFlag('sala_amazonas_atasco', false);
      api.setFlag('sala_amazonas_estampida', true);
      api.setFlag('reunion_terminada', true);
      for (const id of MERC) if (aqui(api, id)) api.placeActor(id, null);
      if (aqui(api, GERV)) api.placeActor(GERV, null);
      api.refreshActors();
    }
    { const st = api.getState('tele_amazonas'); if (st === 'buscando' || st === 'gertrudis') api.setState('tele_amazonas', 'normal'); }
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

// ---------------------------------------------------------------- [PA] E5 §2.1 · «Pregunta del público» y el atasco
// Estado de módulo (no se guarda: con el atasco abierto no se puede guardar, y `onEnter` lo pone a cero).
const S = { quieto: 0, tamb: null };                       // §2.6: segundos de tiempo quieto tras D4; último fotograma
const A = { ctl: null, resolviendo: false, quieto: 0 };    // §2.1.6: el atasco (ctl de api.estampida), reloj de 20 s
const ATASCO_ANUNCIO_S = 20;                               // [PA] E6 §2.2.1 (antes, 10)
/** §2.6 · ¿el jugador está sin actuar? Como `api.quieto()` (engine/efectos.js `quiet`), pero los globos que no
 *  bloquean (murmullos, ambiente, megafonía) no cuentan como actividad. */
function sinActuar(api) {
  if (api.quieto()) return true;
  const g = api.game;
  if (g.mode !== 'play' || !g.room) return false;
  if (g.busy || g.acting || g.choice || g.itemPick || g.menu || g.phone || g.detalle || g.hud || g.card || g.apagon || g.burst) return false;
  if (g.cutscene > 0 || g.inDialog > 0 || g.duelInfo) return false;
  if (g.notices.some(n => g.realTime < n.until)) return false;
  return g.speeches.every(s => !s.blocking);
}
const atascoAbierto = (api) => !!api.flag('sala_amazonas_atasco') && !A.resolviendo;

/** §5.4 · el Lector Medio asiente (gesto, sin globo). */
async function asentir(api, id = LECTOR) {
  const j = api.flag('chaqueta_en_lector') ? 'j' : '';
  api.vestir(id, 'tamb2' + j); api.sfx('paper'); await api.wait(350); api.vestir(id, null);
}

/** §3.1 · Usar la tele con `gertrudis_pregunta`: Gertrudis pregunta en directo, estampida y atasco en la puerta. Al acabar
 *  la cinemática el control vuelve al jugador con `sala_amazonas_atasco` puesto (en modo rápido, vía `anuncio` aquí).
 *  [PA] E6 §2.3.3: con `opts.sintonizada` (árbol `tele_sala`) la tele ya está en `gertrudis`: sin «BUSCANDO SEÑAL».
 *  [PA] E6 §2.2.2: al final, plano de la puerta (1 s), los tres se giran hacia Bruno y él pregunta «¿Necesitan ayuda?». */
async function teleGertrudis(api, opts = {}) {
  await api.cutscene(async () => {
    if (!opts.sintonizada || api.getState('tele_amazonas') !== 'gertrudis') {
      api.setState('tele_amazonas', 'buscando'); api.sfx('click');
      await api.wait(600);
    }
    api.setState('tele_amazonas', 'gertrudis'); api.sfx('beep');
    for (const id of [...MERC, GERV]) if (aqui(api, id)) api.faceActor(id, 'tele_amazonas');
    if (aqui(api, 'mercados_2')) await sayMe(api, 2, '¡Se ve! ¡Por fin se ve la pantalla!');
    await api.sayFrom('tele_amazonas', 'PREGUNTA DEL PÚBLICO: ¿Y CUÁLES SON LOS SIGUIENTES PASOS?', GERTRUDIS_TV);
    await api.wait(1200);                              // silencio; tiembla un botellín
    api.shake(200, 1);
    await sayG(api, 'Pregunta de un conectado. Consta. Los... siguientes...');
    api.pose('mercados_1', 'de_pie');
    await sayMe(api, 1, 'El siguiente paso sería...');
    await sayMe(api, 2, '¡No lo digas!');
    await sayG(api, 'Eso se podría ver en una reunión. De siguientes pasos.');
    await sayMe(api, 3, '¿Y quién la convoca?');
    for (const id of [...MERC, GERV]) if (aqui(api, id)) api.faceActor(id, 'tele_amazonas');   // todos miran a la tele
    await api.wait(700);
    await api.sayFrom('tele_amazonas', CONVOCADA, GERTRUDIS_TV);
    // ¡estampida! sillas atrás, el dominó de botellines; salen por detrás de la mesa y se encajan en la puerta
    for (const id of MERC) api.pose(id, 'de_pie');
    api.sfx(SFX.sillas); api.shake(500, 2);
    api.setState('botellines', 'volando'); api.sfx(SFX.botellines);
    api.setWalkbox('fondo', true);
    let ctl = null;
    try {
      ctl = await api.estampida(MERC, { puerta: PUERTA, esperar: true, enAtasco: async (api, c) => {
        for (let i = 0; i < MERC.length; i++) { c.alFrente(MERC[i]); await sayMe(api, i + 1, MERCADOS_ATASCO[i]); }
      } });
    } finally { api.setWalkbox('fondo', false); }
    api.setState('botellines', 'tumbados');
    A.ctl = ctl; A.quieto = 0; A.resolviendo = false;
    api.setFlag('sala_amazonas_atasco', true);
    api.sinGuardar(true);                              // §2.1.6: nada de guardar con el atasco abierto
    // [PA] E6 §2.2.2: el atasco se anuncia (dentro de la cinemática: no se come segundos del plazo de 20 s)
    api.cameraTo(PUERTA[0] + 30); api.shake(200, 1);  // plano de la puerta, 1 s: los tres tiemblan encajados
    await api.wait(700);
    for (const id of MERC) if (aqui(api, id)) api.faceActor(id, api.player);   // se giran hacia Bruno, sin soltarse
    await api.say('¿Necesitan ayuda?');                // nadie contesta
    await api.wait(600);
    api.cameraFollow();
  });
  if (api.game.fast) await resolverAtasco(api, 'anuncio');     // modo rápido (recorridos): sin soltar el control
}

/** §2.1.6 · fin del atasco por una vía ('empujar' | 'cruasan' | 'hablar' | 'anuncio'): una sola línea de vía, el plop, la
 *  sala vacía, «Se levanta la sesión», `reunion_terminada` y Maripaz. `desdeUpdate`: lo lanza el reloj de 20 s. */
async function resolverAtasco(api, via, desdeUpdate = false) {
  if (!api.flag('sala_amazonas_atasco')) { A.resolviendo = false; return; }
  if (A.resolviendo && !desdeUpdate) return;
  A.resolviendo = true;
  const ctl = A.ctl;
  if (via === 'anuncio' && !aqui(api, MARIPAZ)) via = 'empujar';            // (sin Maripaz no hay anuncio)
  api.game.salaAtasco = { via, regreso: false };                             // solo para las pruebas
  try {
    await api.cutscene(async () => {
      if (via === 'empujar') {
        const b = api.actorPos(api.player);
        if (!b || b.x > 70) await api.walkTo(56, 116);
        api.face('left');
        await api.anim(api.player, 'reach', 400);
        api.sfx('hit');
        await api.say('Les doy un empujoncito. Salen los tres de golpe.');
      } else if (via === 'cruasan') {
        await api.anim(api.player, 'reach', 350);                            // Bruno coge el medio cruasán…
        if (ctl) ctl.alFrente('mercados_3');
        await sayMe(api, 3, '¡Ese medio cruasán es mío! ¡Lo he cobrado dos veces!');
        await api.anim(api.player, 'reach', 300);                            // …y lo devuelve a la bandeja
        await api.walkTo(236, 126);                                          // se aparta: Jacinto viene a por él
        api.face('left');
      } else if (via === 'hablar') {
        await api.say('¿Y la próxima reunión, cuándo es?');
        api.shake(250, 2);                                                   // desbandada
      } else {
        // la de hoy: Maripaz, de pie, con la tableta en alto (nadie la mira)
        api.pose(MARIPAZ, 'de_pie'); api.faceActor(MARIPAZ, 'left'); api.sostener(MARIPAZ, tabletaEnAlto);
        try { await sayM(api, '¡Un momento! ¡Antes de salir, un anuncio de cinco segundos!'); }
        finally { api.sostener(MARIPAZ, null); api.pose(MARIPAZ, null); api.faceActor(MARIPAZ, 'down'); }
      }
      // plop, plop, plop
      if (ctl && ctl.activo) await ctl.soltar();
      for (const id of MERC) if (aqui(api, id)) api.placeActor(id, null);
      api.setFlag('sala_amazonas_atasco', false);
      api.setFlag('sala_amazonas_estampida', true);
      api.setState('botellines', 'tumbados');
      api.setState('tele_amazonas', 'normal');
      // Jacinto vuelve a por el medio cruasán: mudo y por la puerta (las otras vías) o ya sin pasar por ella (cruasán:
      // es el último en salir, con su cruasán)
      if (via !== 'cruasan') { await api.wait(400); api.sfx('door'); api.game.salaAtasco.regreso = true; }
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
      if (aqui(api, GERV)) {
        api.sostener(GERV, 'movil');
        api.pose(GERV, 'de_pie');
        await sayG(api, 'Se levanta la sesión. Lo hablamos.');
        await api.walkActor(GERV, PUERTA[0], PUERTA[1]);
        api.sostener(GERV, null);
        api.sfx('door'); api.shake(250, 1);                                  // portazo
      }
      api.setFlag('reunion_terminada', true);                                // Gervasio sale de la sala (su `when`)
      api.pose(GERV, null);
      await api.wait(500);
      if (!aqui(api, MARIPAZ)) return;
      api.face(MARIPAZ);
      await api.say('¿Usted no huye?');
      await sayM(api, ['¿Huir? Esta sala la tengo pagada hasta las nueve, cariño. La amortizo.',
        'Y estoy sentada en el planillo. La página 7 no se mueve sin mí.']);
    });
  } finally {
    if (!api.flag('reunion_terminada')) {                                    // (una cinemática cortada a medias)
      api.setFlag('sala_amazonas_atasco', false); api.setFlag('sala_amazonas_estampida', true); api.setFlag('reunion_terminada', true);
    }
    api.sinGuardar(false);
    A.ctl = null; A.resolviendo = false; A.quieto = 0;
  }
}
