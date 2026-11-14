// SALA `pecera` (Redacción) — ESCENAS. Paquete P2 del plan de comedia. Importado desde ./pecera.js; las escenas son
// globales: api.scene('<nombre>').
//   presentacion_villano   escena 7.2 (E2 §2.3.1: Íñigo, el Titulator y la IA de Leoncio; sin Valentín ni coro)
//   pecera_cms_vivo        camino antiguo del enchufe con el ticket nº 3 leído (§4.2)
//   pecera_apagon          Tirar enchufe_pantalla sin vio_ticket_3: la escalada de tres apagones (§4.2 + E1.7)
//   pecera_herminia_mide   paso 34, «Herminia mide la pieza» (E2 §2.3.2: «El modelo es de fuera. El prompt es de dentro.»)
//   pecera_dos_ias         momento 8, «Dos IAs» (E2 §2.3.3)
//   pecera_banner          E2 §4.2.3: Yoli ve el adhesivo «SU ANUNCIO AQUÍ» en la espalda de Bruno (una vez)
//   pecera_anexion         MP1, la anexión de Infografía (E1.5)
//   pecera_viral           primera entrada con cafetera_viral (§4.1)
//   pecera_cms_entrada     primera entrada con cms_vivo (§4.2)
//   pecera_chaqueta        Bruno con la chaqueta de Ramírez en la Redacción (§4.3; también desde items.js al ponérsela)
// Las acotaciones del plan (entre paréntesis) son acciones, nunca texto. Infografía y Diseño y Producto no coinciden en
// plano: las escenas de Leoncio, Anselmo y el portátil encuadran entre 640 y 1000 (Valentín está en 1240).
import { talk } from './pecera.voces.js';
import { anselmoALaMesa, anselmoASuMesa, anselmoEnSuSitio, MESA_INFOGRAFIA } from './pecera.dialogos.js';
import { PECERA_DESPLAZ as D } from '../lib/edificio.js';
import art from './art/pecera.art.js';
import { PAL, rect, hline, frameRect, gradV, label, glow } from '../../engine/draw.js';

const Y = 'yoli_tendencias', I = 'inigo_sinergia', L = 'leoncio_quesitos', A = 'anselmo_monolito';
const TITULATOR = '#B6FF4D';
const PLIN = { notes: ['E6', 'B6'], step: 0.07, wave: 'triangle', vol: 0.1 };
/** el enchufe, la pantalla de métricas y el monitor de Yoli (coordenadas de sala) */
const ENCHUFE = [622, 112], YOLI_EN = [719, 116], SPOT_YOLI = [[692, 68, 26, 10]];

/** PLANO DETALLE: el portátil plateado de Íñigo con el Titulator escupiendo el titular línea a línea. */
function portatilTitulator(g, r, t) {
  const LINES = ['EL IBEX ABRE PLANO.', 'PLANO.', '¿POR QUÉ NADIE', 'HABLA DE ESTO?'];
  const { x, y, w, h } = r;
  rect(g, x, y, w, h, '#000');
  gradV(g, x, y, w, h - 10, [PAL.metal[6], PAL.metal[5], PAL.metal[4]]);
  frameRect(g, x, y, w, h - 10, PAL.metal[2]);
  rect(g, x + 6, y + 5, w - 12, h - 22, '#06140a'); frameRect(g, x + 5, y + 4, w - 10, h - 20, PAL.ink[1]);
  rect(g, x + 6, y + 5, w - 12, 9, '#1c3a10');
  label(g, 'TITULATOR 3000', x + (w >> 1), y + 3, '#B6FF4D', { align: 'center' });
  const n = Math.min(LINES.length, Math.floor(t / 260) + 1);
  LINES.slice(0, n).forEach((l, i) => label(g, l, x + 10, y + 13 + i * 10, '#B6FF4D'));
  if ((Math.floor(t / 300) & 1) === 0) rect(g, x + 10 + 2, y + 15 + n * 10, 5, 1, '#B6FF4D');
  glow(g, x + (w >> 1), y + 34, 60, 26, '#B6FF4D', 0.08, 3);
  rect(g, x, y + h - 10, w, 8, PAL.metal[5]); hline(g, x, y + h - 10, w, PAL.metal[7]); hline(g, x, y + h - 3, w, PAL.metal[2]);
  for (let i = 0; i < 13; i++) rect(g, x + 4 + i * 9, y + h - 8, 7, 2, PAL.metal[3]);
  rect(g, x + w - 18, y + h - 9, 10, 2, PAL.ink[2]);
}

/** Mueve la cámara a `x` y espera a que llegue. */
async function encuadre(api, x) {
  const g = api.game;
  api.cameraTo(x);
  const t = Math.max(0, Math.min(g.room.width - 320, x - 160));
  for (let i = 0; i < 60 && !g.instant && Math.abs(g.camX - t) > 2; i++) await api.wait(50);
}
/** Lleva a Bruno a (x, y): andando si está cerca; con un fundido si está lejos (la Redacción mide 1270 px). */
export async function junto(api, x, y = 124, cam = x + 40) {
  const p = api.actorPos(api.player);
  if (!p || Math.abs(p.x - x) > 150) {
    await api.fadeOut(220);
    api.placeActor(api.player, 'pecera', x, y, 'right');
    api.cameraTo(cam);
    api.game.snapCamera();
    await api.fadeIn(220);
  } else {
    await api.walkTo(x, y);
    await encuadre(api, cam);
  }
}

// ================================================================== 7.2 · presentación del villano (E2 §2.3.1)
// De 26 a 17 líneas: Íñigo y el Titulator frente a la IA de Leoncio. Encuadres: Íñigo en 232+D; Infografía en 800
// (Valentín, en 1240, fuera de plano). Sin coro, sin Nemesio, sin el cierre de Bruno. El portátil está `limpio` hasta que
// Anselmo le da la primera vuelta de cinta en escena (estado `cinta_1`).
async function presentacionVillano(api) {
  await api.cutscene(async (api) => {
    const SITIO_BRUNO = [184 + D, 124], SITIO_IN = (art.layout[I] && art.layout[I].at) || [246 + D, 122, 'down'];
    if (api.actorPos(api.player).x > 330 + D) {
      await api.fadeOut(250);
      api.placeActor(api.player, 'pecera', 140 + D, 122, 'right');
      api.cameraFollow();
      api.game.snapCamera();
      await api.fadeIn(250);
    }
    await api.walkTo(SITIO_BRUNO[0], SITIO_BRUNO[1]);
    api.face('right');
    api.cameraTo(232 + D);
    await api.anim(Y, 'reach', 700);
    await api.sayAs(Y, '¡No entra nada! El CMS, el programa de publicar, lleva dos horas colgado.');
    // (Las luces parpadean. Entra Íñigo con un portátil plateado bajo el brazo.)
    for (let i = 0; i < 2; i++) { await api.fadeOut(70); await api.fadeIn(70); }
    const door = art.layout.pecera_a_vestibulo.walkTo || [25, 108];
    const at = SITIO_IN;
    api.placeActor(I, 'pecera', door[0] + 6, door[1] + 4, 'right');
    api.show(I);
    api.sfx('door');
    api.cameraTo(door[0] + 140);
    await api.walkActor(I, door[0] + 230, at[1]);
    api.placeActor(I, 'pecera', at[0] - 190, at[1], 'right');
    api.cameraTo(232 + D);
    await api.walkActor(I, at[0], at[1]);
    api.cameraTo(232 + D);
    api.faceActor(I, 'down');
    api.face(I);
    await talk(api, [
      [I, 'Buenas noches. Íñigo Sinergia, Optimal Brains. No vengo a despedir a nadie.'],
      [I, 'Vengo a reimaginar el perímetro.'],
      [I, 'Os presento al Titulator 3000. Inteligencia artificial de titulares.'],
    ]);
    await api.anim(I, 'reach', 500);
    api.sfx('computer');
    await api.detalle({ titulo: 'EL PORTÁTIL DE ÍÑIGO', x: 94, y: 6, w: 132, h: 76, draw: portatilTitulator }, async (api) => {
      await api.wait(500);
      await api.sayAs(I, 'EL IBEX ABRE PLANO. PLANO. ¿POR QUÉ NADIE HABLA DE ESTO?', { color: TITULATOR, at: [160 + Math.round(api.game.camX), 108] });
    });
    await talk(api, [[I, 'Trescientos titulares esta tarde. Sin CMS. Sin silla. Sin convenio.']]);
    // (Encuadre de Infografía. Leoncio, sin levantarse, señala su portátil con el lápiz.)
    await encuadre(api, 800);
    api.faceActor(I, 'right');
    api.faceActor(L, 'left');
    await api.anim(L, 'reach', 500);
    await talk(api, [[L, 'Aquí ya tenemos una IA. Herminia. Hace sola las infografías.'], [I, '¿Cuánto factura?'],
      [L, 'Nada. La hice yo. En tres fines de semana.'], [I, 'Entonces no es una IA. Es un hobby.']]);
    // (Anselmo cruza su cinta, llega a la mesa de Infografía y da una vuelta de cinta al portátil. Rasss. Estado cinta_1.)
    await anselmoALaMesa(api);
    await api.anim(A, 'reach', 600);
    api.sfx('paper');
    api.setState('herminia_portatil', 'cinta_1');
    await api.sayAs(A, 'Y no ha pasado por mis sistemas.');
    await talk(api, [['H', 'cinta de Desarrollo · tiras: 1 · motivo: no consta']]);
    // (Anselmo vuelve a su lado. Encuadre de Íñigo.)
    await anselmoASuMesa(api, 975);
    await encuadre(api, 232 + D);
    api.faceActor(L, 'down');
    api.faceActor(I, 'down');
    await talk(api, [[I, 'A las nueve, la Reunión de Dirección aprueba el Plan Cero Papel. Sin rotativa.'],
      ['B', '¿Sin papel? Pero si mañana firmo yo en papel.']]);
    api.faceActor(I, api.player);
    await api.wait(500);
    await talk(api, [[I, '¿Y tú eres...?'], ['B', 'Bruno Pellejo. Becario senior. Senior en becario.']]);
    // (Íñigo apunta en un pósit rosa.)
    await api.anim(I, 'reach', 600);
    api.sfx('paper');
    await talk(api, [[I, 'Coste cero, disponibilidad total. Te tengo en la matriz, Vacante.']]);
    // (Sale hacia los Despachos.)
    const exitP = art.layout.pecera_a_pajarera.walkTo || [196, 108];
    await api.walkActor(I, at[0] - 190, at[1]);
    api.placeActor(I, 'pecera', exitP[0] + 150, at[1], 'left');
    api.cameraTo(exitP[0] + 60);
    await api.walkActor(I, exitP[0], exitP[1]);
    api.sfx('door');
    api.placeActor(I, null);
    api.setFlag('inigo_presentado', true);
    api.cameraFollow();
  });
  api.setFlag('inigo_presentado', true);
  api.setState('herminia_portatil', null);   // a partir de aquí, el estado lo dan los flags (cinta_1)
  anselmoEnSuSitio(api);
}

// ================================================================== §4.2 · el apagón y el enchufe
/** Alguien (Anselmo) cruza hasta el enchufe desde fuera de cuadro y lo enchufa. */
async function alEnchufe(api, id) {
  if (id === Y) { await api.walkActor(Y, ENCHUFE[0] + 14, ENCHUFE[1]); }
  else {
    const cam = Math.round(api.game.camX);
    api.placeActor(id, 'pecera', cam + 330, 122, 'left');
    await api.walkActor(id, ENCHUFE[0] + 16, ENCHUFE[1]);
  }
  api.faceActor(id, 'up');
  await api.anim(id, 'reach', 500);
}
async function deVuelta(api, id) {
  if (id === Y) { await api.walkActor(Y, YOLI_EN[0], YOLI_EN[1]); api.faceActor(Y, 'down'); return; }
  const cam = Math.round(api.game.camX);
  await api.walkActor(id, cam + 330, 122);
  const p = art.layout[id] && art.layout[id].at;
  if (p) api.placeActor(id, 'pecera', p[0], p[1], p[2]);
}
async function luzVuelve(api) {
  api.sfx('click');
  await api.apagon(false);
  api.setState('pantalla_metricas', null);
}

async function apagonEscena(api) {
  const n = api.inc('apagon_n');
  try {
    await api.cutscene(async (api) => {
      await api.walkTo(ENCHUFE[0] - 16, ENCHUFE[1] + 4);
      api.face('up');
      api.cameraTo(ENCHUFE[0] + 40);
      await api.anim(api.player, 'reach', 500);
      api.setState('pantalla_metricas', 'negra');
      api.apagon({ ms: 0, spots: SPOT_YOLI });
      await api.wait(600);
      if (n === 1) {
        await api.sayAs(Y, '¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?');
        api.sfx(PLIN); api.setState('monitor_yoli', 'publicado');
        await api.sayAs(Y, '...Ha entrado una pieza. ¡Ha entrado una pieza! ¡El CMS va!');
        // (Anselmo se levanta sin prisa, cruza su cinta, lee la del enchufe y enchufa.)
        await alEnchufe(api, A);
        await luzVuelve(api);
        api.setState('monitor_yoli', 'guardando');
        await talk(api, [[A, 'Ese enchufe está en mis sistemas. Desenchufar es un cambio sin revisar.'],
          [Y, '...Ya no va.'], ['B', 'Iba mientras estaba apagada.'],
          [A, '¿Y si va sin pantalla? Peor. Si funciona, la gente se acostumbra.']]);
        await deVuelta(api, A);
      } else if (n === 2) {
        api.sfx(PLIN); api.setState('monitor_yoli', 'publicado');
        await api.sayAs(Y, '¡Otra! ¡Ha entrado otra!');
        // (Le tiembla el párpado. Se levanta y enchufa ella.)
        await alEnchufe(api, Y);
        await luzVuelve(api);
        api.setState('monitor_yoli', 'guardando');
        await talk(api, [[Y, 'Perdona. Si no veo la gráfica, no sé si estoy contenta.'], ['B', 'Pero estaba entrando todo.'],
          [Y, 'Ya. Pero no lo veía entrar. Eso no cuenta.']]);
        await deVuelta(api, Y);
      } else if (n === 3) {
        // (Anselmo cruza su cinta, enchufa sin mirar y vuelve.)
        await alEnchufe(api, A);
        await luzVuelve(api);
        await talk(api, [[A, 'Tercera vez. Te paso a BLOQUEADO.'], [A, 'Si quieres que se quede apagada, tráeme un motivo. Con número.'],
          [A, 'Y mira la brida. Ese cable no acaba aquí.']]);
        await deVuelta(api, A);
        await api.say('Un motivo con número y un cable que baja. Eso huele a Paco.');
      } else {
        await api.wait(500);
        await luzVuelve(api);
        await api.sayAs(A, 'Sin número, a su enchufe.');
      }
    });
  } finally {
    if (api.game.apagon) await api.apagon(false);
    api.setState('pantalla_metricas', null);
    api.refreshActors();
  }
}

/** Camino antiguo: Tirar enchufe_pantalla con vio_ticket_3 (Anselmo escribe la excepción en la cinta, E2 §2.6.5). */
async function cmsVivo(api) {
  try {
    await api.cutscene(async (api) => {
      await api.walkTo(ENCHUFE[0] - 16, ENCHUFE[1] + 4);
      api.face('up');
      api.cameraTo(ENCHUFE[0] + 40);
      await api.anim(api.player, 'reach', 600);
      api.setState('pantalla_metricas', 'negra');
      api.apagon({ ms: 0, spots: SPOT_YOLI });
      await api.wait(400);
      // (Clic. Negro. Anselmo ya se está levantando.)
      await alEnchufe(api, A);
      await talk(api, [['B', 'Ticket nº 3, de 2017: «El CMS se cuelga con esta pantalla».'], [A, '¿Tiene número?'], ['B', 'El tres.'],
        [A, '...Entonces existe. A HECHO (PERO NO). Con número.']]);
      // (Corta cinta y pega bajo el letrero: «SALVO TICKET Nº 3».)
      await api.anim(A, 'reach', 600);
      api.sfx('paper');
      api.setState('enchufe_pantalla', 'con_ticket');
      api.setFlag('cms_vivo', true);
      api.setState('monitor_yoli', 'publicado');
      api.repaint();
      await api.apagon(false);
      await talk(api, [['CORO', '¡Ha sido Diseño!'], ['B', 'He sido yo. Pero gracias.']]);
      await deVuelta(api, A);
    });
  } finally {
    if (api.game.apagon) await api.apagon(false);
    api.setState('pantalla_metricas', null);
    api.setState('enchufe_pantalla', 'con_ticket');
    api.setFlag('cms_vivo', true);
    api.refreshActors();
  }
}

// ================================================================== E2 §2.3.2 · paso 34: Herminia mide la pieza
async function herminiaMide(api) {
  await api.cutscene(async (api) => {
    await encuadre(api, 800);
    // (Pitido. Entre la cinta, la pantalla de Herminia se enciende.)
    api.sfx('beep');
    await api.wait(300);
    await talk(api, [['H', 'tu pieza · 31 líneas · hueco de la página 7: 23 · sobra: 26 %']]);
    api.faceActor(L, api.player);
    await talk(api, [[L, 'Ya te la ha leído. Yo no, ¿eh? Yo ya no leo. Superviso.'], ['B', '¿Y quién quita un 26 %?'],
      [L, 'Ella no. Ella mide. Quitar siempre es de otro departamento.']]);
    api.sfx('beep');                         // (Segundo pitido.)
    await talk(api, [['H', 'infografía de la opa · hecha en 0,4 s · publicar: bloqueado'],
      [L, 'Cuatro décimas. Yo tardaba una semana. Bien hecha, eso sí.']]);
    // (Anselmo cruza la cinta y llega a la mesa. Segunda vuelta de cinta. Rasss. Estado cinta_2.)
    await anselmoALaMesa(api);
    await api.anim(A, 'reach', 600);
    api.sfx('paper'); await api.wait(250); api.sfx('paper');
    api.setFlag('herminia_midio', true);
    await talk(api, [[A, 'Hecha con una IA de fuera. No entra en ninguna pieza.'], [A, 'Encintar, no. Aislar el componente.']]);
    api.faceActor(A, api.player);
    await talk(api, [['B', '¿Y vosotros no usáis IA de fuera?'], [A, 'El modelo es de fuera. El prompt es de dentro.'], [A, 'Eso lo hace nuestro.'],
      [L, 'El prompt de Herminia lo escribí yo. En esta mesa.']]);
    api.faceActor(A, 'left');
    await talk(api, [[A, 'A un metro de mi cinta. Fuera.']]);
    await anselmoASuMesa(api, 975);          // (Anselmo vuelve a su lado de la frontera.)
  });
  api.setFlag('herminia_midio', true);
  anselmoEnSuSitio(api);
  api.faceActor(L, 'down');
  api.cameraFollow();
}

// ================================================================== E2 §2.3.3 · momento 8: Dos IAs
async function dosIAs(api) {
  await api.cutscene(async (api) => {
    await junto(api, 790, 124, 840);
    api.placeActor(A, 'pecera', MESA_INFOGRAFIA[0], MESA_INFOGRAFIA[1], 'left');
    // (Anselmo, en Infografía, da la última vuelta de cinta. Rasss. Estado paquete.)
    await api.anim(A, 'reach', 700);
    api.sfx('paper'); await api.wait(300); api.sfx('paper'); await api.wait(300); api.sfx('paper');
    api.setFlag('dos_ias_vista', true);
    await talk(api, [[A, 'Última vuelta. Integración: en la próxima versión.'], [L, 'Envuelta. Parece un regalo. De nadie.']]);
    await anselmoASuMesa(api, 975);          // (Anselmo vuelve a su mesa. Leoncio se gira hacia Bruno.)
    api.faceActor(L, api.player);
    await talk(api, [[L, 'Antes de que la envolviera le pedí un gráfico del Titulator. Por curiosidad.']]);
    // (Por un hueco de la cinta, la pantalla.)
    api.sfx('beep');
    await talk(api, [['H', 'titulares por hora · picos: 14:00 y 14:30 · pausas de 5 min: 11'],
      ['H', 'origen: Sistemas, armario 27 · consumo: atún'],
      [L, 'Una IA que come a las dos y va once veces al baño.']]);
    api.faceActor(A, 'left');                // (desde su mesa)
    await talk(api, [[A, 'Tiene alta de usuario interno. Lo que tiene alta es de la casa.']]);
    api.setFlag('anselmo_dijo_regla', true);
    await api.say('Armario 27. Atún. Baño. Eso no es un modelo. Eso es un compañero.');
  });
  api.setFlag('dos_ias_vista', true);
  api.setFlag('anselmo_dijo_regla', true);
  anselmoEnSuSitio(api);
  api.faceActor(L, 'down');
  api.cameraFollow();
}

// ================================================================== E1.5 · la anexión (MP1, opcional)
async function anexion(api) {
  await api.cutscene(async (api) => {
    await junto(api, 790, 124, 840);
    api.placeActor(A, 'pecera', 975, 122, 'left');
    // (La pantalla de Anselmo pita. La lee. Se levanta despacio.)
    api.sfx('beep');
    await api.wait(500);
    await talk(api, [[A, '«Herminia. Becaria de Desarrollo.» ¿Procedencia? ...De la casa.'], [A, 'Entonces es estupenda.']]);   // integración: sin el 5.º «¿De dónde viene?» (tope 4)
    await api.walkActor(A, MESA_INFOGRAFIA[0], MESA_INFOGRAFIA[1]);
    api.faceActor(A, 'left');
    // (Cruza la frontera y desenvuelve el portátil. Rasss, al revés. Largo.)
    await api.anim(A, 'reach', 900);
    api.sfx('paper'); await api.wait(300); api.sfx('paper'); await api.wait(300); api.sfx('paper');
    api.setState('herminia_portatil', 'desenvuelta');
    await talk(api, [[L, 'Son los mismos gráficos de esta tarde.'], [A, 'Esta tarde eran de fuera. Ahora son nuestros. Se nota en el trazo.']]);
    // (Despega la pegatina «INFOGRAFÍA» y pega una de «DESARROLLO». Estado anexionada.)
    await api.anim(A, 'reach', 500);
    api.setState('herminia_portatil', 'anexionada');
    await talk(api, [[L, '¿Me la estás quitando?'], [A, 'Quitar, no. Absorber en plataforma.'],
      ['H', '› propietario: Desarrollo · cambios en los gráficos: 0']]);
    // (Anselmo se agacha y arranca la cinta del suelo. Toda.)
    await api.walkActor(A, 900, 126);
    await api.anim(A, 'reach', 900);
    api.sfx('paper'); await api.wait(400); api.sfx('paper');
    api.setFlag('infografia_integrada', true);
    api.repaint();
    await talk(api, [[A, 'Ya no hace falta frontera. Todo esto es Desarrollo.'],
      [L, 'Me han anexionado. Pero integrada, que es lo que quería. Creo.']]);
    await anselmoASuMesa(api, 975);
  });
  api.setFlag('infografia_integrada', true);
  api.setState('herminia_portatil', null);
  anselmoEnSuSitio(api);
  api.cameraFollow();
}

// ================================================================== §4.1 · primera entrada con cafetera_viral
async function viral(api) {
  await api.cutscene(async (api) => {
    await junto(api, 690, 124, 700);
    api.face('right');
    // (La pantalla de métricas salta: 3.418, 7.950, 11.302. Aparece la taza.)
    if (!api.flag('cms_vivo')) api.setState('pantalla_metricas', 'viral');
    await api.viral({ avisos: ['Gertrudis, en directo', '+300 compartidos', 'abrígate comentó'], contador: [3418, 11302],
      etiqueta: 'en directo' });
    await talk(api, [[Y, '¡Bruno! ¡Once mil concurrentes! ¿Qué ha pasado?'],
      [Y, '«Un joven da las buenas noches a una cafetera». Lo ha sacado el Titulator.'],
      ['B', 'Le he dado las buenas noches. Dos veces. Tengo don de gentes.'],
      [Y, 'Hazlo otra vez. Con otra máquina. Lo que sea que tenga enchufe.']]);
    api.setState('pantalla_metricas', 'viral_baja');
    await talk(api, [[Y, '11.290 — 11.284 — ...Ya está. Era un pico. Qué bonito ha sido.'],
      [Y, 'Y un comentario: «abrígate». La cuenta de siempre.']]);
  });
  api.setState('pantalla_metricas', null);
}

// ================================================================== §4.2 · primera entrada con cms_vivo
async function cmsEntrada(api) {
  await api.cutscene(async (api) => {
    await junto(api, 690, 124, 700);
    api.face('right');
    // (La pantalla de métricas, negra. Yoli se echa colirio. Se pone la mano en el pecho.)
    await api.anim(Y, 'reach', 900);
    await api.wait(400);
    await talk(api, [[Y, 'Lectores... no lo sé. Por primera vez en seis años, no lo sé.'],
      [Y, 'Me siento rarísima. Creo que esto es estar tranquila.']]);
  });
}

// ================================================================== §4.3 · Ramírez ha vuelto (la chaqueta en la Redacción)
async function chaqueta(api) {
  if (api.room !== 'pecera' || !api.flag('bruno_con_chaqueta') || api.flag('lector_derribado')) return;
  if (!api.once('pecera_chaqueta_vista')) return;
  await api.cutscene(async (api) => {
    const p = api.actorPos(api.player);
    if (!p || Math.abs(p.x - YOLI_EN[0]) > 200) await junto(api, 690, 124, 700);
    await talk(api, [[Y, '¿Ramírez? ¡Ramírez ha vuelto! ...Ah. No. Eres tú.'],
      [Y, 'Por un segundo te he respetado. Ha sido raro. Bonito, pero raro.'],
      ['D1', '¡Ramírez!'], ['D2', '¿Viene a por el yogur?'], ['D3', 'No.']]);
  });
}

// ================================================================== E2 §4.2.3 · el adhesivo en la espalda (Yoli, una vez)
async function banner(api) {
  if (!api.flag('bruno_con_banner') || api.flag('lector_derribado')) return;
  if (!api.once('pecera_yoli_banner')) return;
  await api.cutscene(async (api) => {
    await encuadre(api, YOLI_EN[0] - 30);   // (la cámara busca a Yoli; ella mira la espalda de Bruno)
    await talk(api, [[Y, '¿Llevas un banner en la espalda? ...Pues convierte. Me han mirado.']]);
  });
  api.cameraFollow();
}

export default {
  pecera_banner: banner,
  presentacion_villano: presentacionVillano,
  pecera_cms_vivo: cmsVivo,
  pecera_apagon: apagonEscena,
  pecera_herminia_mide: herminiaMide,
  pecera_dos_ias: dosIAs,
  pecera_anexion: anexion,
  pecera_viral: viral,
  pecera_cms_entrada: cmsEntrada,
  pecera_chaqueta: chaqueta,
};
