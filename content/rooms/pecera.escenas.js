// SALA `pecera` (Redacción) — ESCENAS. Paquete P2 del plan de comedia. Importado desde ./pecera.js; las escenas son
// globales: api.scene('<nombre>').
//   presentacion_villano   escena 7.2 (E2 §2.3.1: Íñigo, el Titulator y la IA de Leoncio; sin Valentín ni coro)
//   pecera_cms_vivo        camino antiguo del enchufe con el ticket nº 3 leído (§4.2)
//   pecera_apagon          Tirar enchufe_pantalla sin vio_ticket_3: la escalada de tres apagones (§4.2 + E1.7); el
//                          primero, JUGABLE a oscuras (ENMIENDA E5 §2.2, §3.2: interceptor, ventana de 12 s, `apagonCierre`)
//   pecera_herminia_mide   paso 34, «Herminia mide la pieza» (E2 §2.3.2: «El modelo es de fuera. El prompt es de dentro.»)
//   pecera_dos_ias         momento 8, «Dos IAs» (E2 §2.3.3)
//   pecera_banner          E2 §4.2.3: Yoli ve el adhesivo «SU ANUNCIO AQUÍ» en la espalda de Bruno (una vez)
//   pecera_anexion         MP1, la anexión de Infografía (E1.5)
//   pecera_viral           primera entrada con cafetera_viral (§4.1)
//   pecera_cms_entrada     primera entrada con cms_vivo (§4.2)
//   pecera_chaqueta        Bruno con la chaqueta de Ramírez en la Redacción (§4.3; también desde items.js al ponérsela)
//   pecera_opa_ab          ENMIENDA E4 S4, paso 34: Yoli prueba la opa en su titulador (demo muda) y se lo presta
//   pecera_opa_ganadora    ENMIENDA E4 S5, paso 40: ya hay ganador; la opa, «en la dirección web. Donde no molesta.»
// Y la hoja impresa «LO MÁS LEÍDO» (E4 S3: `mirarHoja`, `hojaTop`), con sus versiones por acto (./pecera.titulares.datos.js).
// Las acotaciones del plan (entre paréntesis) son acciones, nunca texto. Infografía y Diseño y Producto no coinciden en
// plano: las escenas de Leoncio, Anselmo y el portátil encuadran entre 640 y 1000 (Valentín está en 1240).
import { talk } from './pecera.voces.js';
import { anselmoALaMesa, anselmoASuMesa, anselmoEnSuSitio, MESA_INFOGRAFIA } from './pecera.dialogos.js';
import { PECERA_DESPLAZ as D } from '../lib/edificio.js';
import art from './art/pecera.art.js';
import { PAL, rect, hline, vline, frameRect, gradV, label, glow } from '../../engine/draw.js';
import { drawText, measure } from '../../engine/font.js';
import { micro, miles } from '../lib/kit.js';
import { titulador, P as PIEZAS, combinacion, ganadorK, asuntoDe, versionesDefecto, urlBruno, BRUNO, usuariosK } from './pecera.titulador.js';
import { FIJOS, RAFAGA, HOJA, FILA_CAFETERA, FILA_IBEX } from './pecera.titulares.datos.js';

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
export async function encuadre(api, x) {
  const g = api.game;
  api.cameraTo(x);
  const t = Math.max(0, Math.min(g.room.width - 320, x - 160));
  for (let i = 0; i < 60 && !g.instant && Math.abs(g.camX - t) > 2; i++) await api.wait(50);
}
/** Lleva a Bruno a (x, y). Cerca (≤ 150 px), andando. Lejos (la Redacción mide 1270 px), ENMIENDA E5 §2.8 F4: sin
 *  fundido ni teletransporte: la cámara se va ≤ 700 ms a `quien` le llama (gesto y PLIN/pitido), vuelve a seguir a Bruno
 *  y Bruno va CORRIENDO. Con `game.instant` (modo rápido), como siempre: aparece allí. */
export async function junto(api, x, y = 124, cam = x + 40, quien = null) {
  const g = api.game, p = api.actorPos(api.player);
  if (p && Math.abs(p.x - x) <= 150) {
    await api.walkTo(x, y);
    await encuadre(api, cam);
    return;
  }
  if (g.instant) {
    api.placeActor(api.player, 'pecera', x, y, 'right');
    api.cameraTo(cam);
    g.snapCamera();
    return;
  }
  const q = quien && api.actorPos(quien);
  if (q && q.room === 'pecera') {
    api.cameraTo(q.x);                                  // (la cámara busca a quien llama)
    api.anim(quien, 'reach', 500);                      // (gesto: «¡ven!»)
    api.sfx(quien === Y ? PLIN : 'beep');
    const t = Math.max(0, Math.min(g.room.width - 320, q.x - 160));
    for (let ms = 0; ms < 700 && Math.abs(g.camX - t) > 2; ms += 50) await api.wait(50);
  }
  api.cameraFollow();
  await api.walkTo(x, y, { run: true });
  await encuadre(api, cam);
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
    await talk(api, [[I, 'A las nueve, la Reunión de Dirección aprueba el Plan Cero Papel.'],
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

// ------------------------------------------------------------------ ENMIENDA E5 §2.2 · el primer apagón, JUGABLE
// Tirar el enchufe (apagon_n = 1): cutscene corta (Yoli y el PLIN, dentro, para que nadie se los pierda) y luego una
// VENTANA a oscuras de ≤ 12 s (L `pecera_oscuras`, sin guardar): dos focos (el monitor de Yoli y la linterna de Anselmo,
// que le sigue), nombres a oscuras (`nameDark`) y los verbos por el interceptor del motor (`aOscuras`). Anselmo cruza de
// su mesa al enchufe sin prisa (guion no bloqueante, `sinCongelar`); cada 2 s, PLIN y el monitor parpadea en PUBLICADO.
// Se cierra con lo primero de: Anselmo llega · Bruno Usa el enchufe · 12 s (en modo rápido, 0) → `apagonCierre`.
const VENTANA_MS = 12000, PLIN_MS = 2000;
const ANSELMO_SIN_PRISA = 40;                 // px/s (54 de serie): de su mesa al enchufe, ≈ 11 s
/** Estado de la ventana (de módulo: no se guarda; al cargar, `limpiarOscuras` desde el onEnter de la sala). */
const V = { abierta: false, llego: false, v0: null, gen: -1 };
const focos = () => [SPOT_YOLI[0], { actor: A, rx: 10, ry: 8 }];

/** Verbos a oscuras (§2.2.2): todos pasan por aquí antes de andar; `true` = no sigue (Bruno no sale de la sala). */
async function aOscuras(api, verbo, id, item) {
  if (!V.abierta) return false;
  if (verbo === 'usar' && id === 'enchufe_pantalla' && !item) { await apagonCierre(api, 'bruno'); return true; }
  if (verbo === 'hablar' && id === Y) { await api.sayAs(Y, '¡Chsss! Estoy contando. Diecisiete. Dieciocho.'); return true; }
  if ((verbo === 'hablar' || verbo === 'empujar') && id === A) { await api.sayAs(A, 'No me tapes la linterna. Voy a mi enchufe.'); return true; }
  if (verbo === 'coger' && id === 'taza_no') { await talk(api, [['D3', 'No.']]); return true; }
  await api.say('No veo nada. Solo a Yoli, a la luz del monitor, contando.');
  return true;
}

/** Deja la Redacción con luz y sin ventana (cierre, cambio de sala o partida cargada con `pecera_oscuras`). */
export function limpiarOscuras(api) {
  V.abierta = false;
  const a = api.game.actors[A];
  if (a && V.v0 != null) { a.speed = V.v0; V.v0 = null; }
  api.sinCongelar(A, false);
  api.sinGuardar(false);
  if (api.flag('pecera_oscuras')) api.setFlag('pecera_oscuras', false);
  if (api.game.apagon) api.apagon(false);
  if (api.getState('pantalla_metricas') === 'negra') api.setState('pantalla_metricas', null);
}

async function apagonJugable(api) {
  let dentro = false;
  try {
    await api.cutscene(async (api) => {
      await api.walkTo(ENCHUFE[0] - 16, ENCHUFE[1] + 4);
      api.face('up');
      api.cameraTo(ENCHUFE[0] + 40);
      await api.anim(api.player, 'reach', 500);
      anselmoEnSuSitio(api);                           // (Anselmo, en su mesa: de ahí sale la linterna)
      api.setState('pantalla_metricas', 'negra');
      api.apagon({ ms: 0, nombres: true, spots: focos(), interceptar: aOscuras });
      await api.wait(600);
      await api.sayAs(Y, '¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?');
      api.sfx(PLIN); api.setState('monitor_yoli', 'publicado');
      await api.sayAs(Y, '...Ha entrado una pieza. ¡Ha entrado una pieza! ¡El CMS va!');
      // (Anselmo se levanta con la linterna del móvil y echa a andar hacia el enchufe, sin prisa.)
      api.faceActor(A, 'left');
    });
    dentro = true;
  } finally {
    if (!dentro) { limpiarOscuras(api); api.setState('monitor_yoli', null); }
  }
  api.setFlag('pecera_oscuras', true);
  api.sinGuardar(true);
  V.abierta = true; V.llego = false; V.gen = api.game.gen;
  api.cameraFollow();
  if (api.game.instant) { await apagonCierre(api, 'tiempo'); return; }   // modo rápido: ventana de 0 ms
  api.background(ventana);
}

/** Espera de la ventana que siempre cede el paso (en modo rápido `api.wait` resuelve al momento y el bucle no soltaría
 *  el hilo). */
const pausa = (api, ms) => (api.game.instant ? new Promise(r => setTimeout(r, ms)) : api.wait(ms));
/** La ventana (guion NO bloqueante): Anselmo cruza; PLIN cada 2 s; a los 12 s o al llegar él, `apagonCierre`. */
async function ventana(api) {
  const g = api.game, gen = g.gen, t0 = g.time, a = g.actors[A];
  if (a && V.v0 == null) { V.v0 = a.speed; a.speed = ANSELMO_SIN_PRISA; }
  api.sinCongelar(A);
  api.walkActor(A, ENCHUFE[0] + 16, ENCHUFE[1]).then((ok) => { if (ok !== false) V.llego = true; });
  let plin = t0 + PLIN_MS;
  const sigue = () => V.abierta && g.gen === gen && g.room && g.room.def.id === 'pecera';
  while (sigue() && !V.llego && g.time - t0 < VENTANA_MS) {
    if (g.time >= plin) {
      plin += PLIN_MS;
      api.sfx(PLIN);                                   // (y el monitor parpadea en PUBLICADO)
      api.setState('monitor_yoli', 'guardando');
      pausa(api, 140).then(() => { if (sigue()) api.setState('monitor_yoli', 'publicado'); });
    }
    await pausa(api, 80);
  }
  if (!sigue()) return;
  while (g.busy && sigue()) await pausa(api, 50);        // si Bruno está hablando a oscuras, que acabe la frase
  if (!sigue()) return;
  g.runScript((api2) => apagonCierre(api2, V.llego ? 'anselmo' : 'tiempo'), { label: 'pecera:apagonCierre' });
}

/** Cierre de la ventana (§3.2): enchufa Anselmo (o ya enchufó Bruno); luz; «…Que te la apague Paco.». */
async function apagonCierre(api, via) {
  V.abierta = false;
  const an = api.game.actors[A];
  if (an && V.v0 != null) { an.speed = V.v0; V.v0 = null; }         // con luz, Anselmo vuelve a su paso de siempre
  try {
    await api.cutscene(async (api) => {
      if (via === 'bruno') {
        await api.walkTo(ENCHUFE[0] - 16, ENCHUFE[1] + 4);
        api.face('up');
        await api.anim(api.player, 'reach', 500);     // (Bruno enchufa)
        await luzVuelve(api);
        api.setState('monitor_yoli', 'guardando');
        const p = api.actorPos(A);
        const cam = Math.round(api.game.camX);
        if (p && p.x > cam + 330) api.placeActor(A, 'pecera', cam + 330, 122, 'left');
        await api.walkActor(A, ENCHUFE[0] + 16, ENCHUFE[1], { run: true });
        api.faceActor(A, 'up');
      } else {
        const p = api.actorPos(A);
        const lejos = !p || Math.abs(p.x - (ENCHUFE[0] + 16)) > 60;     // (a los 12 s aún no ha llegado: aprieta el paso)
        if (!p || Math.abs(p.x - (ENCHUFE[0] + 16)) > 3) await api.walkActor(A, ENCHUFE[0] + 16, ENCHUFE[1], { run: lejos });
        api.faceActor(A, 'up');
        await api.anim(A, 'reach', 500);              // (Anselmo enchufa)
        await luzVuelve(api);
        api.setState('monitor_yoli', 'guardando');
      }
      api.cameraTo(ENCHUFE[0] + 40);
      api.faceActor(A, api.player);
      await talk(api, [[A, 'Ese enchufe está en mis sistemas. Desenchufar es un cambio sin revisar.'],
        [Y, '...Ya no va.'], ['B', 'Iba mientras estaba apagada.'],
        [A, '¿La quieres apagada? Ese cable baja a Sistemas. Que te la apague Eutimio.']]);
      limpiarOscuras(api);
      await deVuelta(api, A);
    });
  } finally {
    limpiarOscuras(api);
    api.setState('monitor_yoli', null);
    api.setState('pantalla_metricas', null);
    anselmoEnSuSitio(api);
    api.cameraFollow();
    api.refreshActors();
  }
}

async function apagonEscena(api) {
  const n = api.inc('apagon_n');
  if (n === 1) { await apagonJugable(api); return; }
  try {
    await api.cutscene(async (api) => {
      await api.walkTo(ENCHUFE[0] - 16, ENCHUFE[1] + 4);
      api.face('up');
      api.cameraTo(ENCHUFE[0] + 40);
      await api.anim(api.player, 'reach', 500);
      api.setState('pantalla_metricas', 'negra');
      api.apagon({ ms: 0, spots: SPOT_YOLI });
      await api.wait(600);
      if (n === 2) {
        api.sfx(PLIN); api.setState('monitor_yoli', 'publicado');
        await api.sayAs(Y, '¡Otra! ¡Ha entrado otra!');
        // (Le tiembla el párpado. Se levanta y enchufa ella.)
        await alEnchufe(api, Y);
        await luzVuelve(api);
        api.setState('monitor_yoli', 'guardando');
        await talk(api, [[Y, 'Perdona. Si no veo la gráfica, no sé si estoy contenta.'], ['B', 'Pero estaba entrando todo.'],
          [Y, 'Ya. Pero si no lo veo entrar, no cuenta.']]);
        await deVuelta(api, Y);
      } else if (n === 3) {
        // (Anselmo cruza su cinta, enchufa sin mirar y vuelve.)
        await alEnchufe(api, A);
        await luzVuelve(api);
        await talk(api, [[A, 'Tercera vez. Te paso a BLOQUEADO.'], [A, 'Si quieres que se quede apagada, tráeme un motivo. ¿Tiene número?']]);
        await deVuelta(api, A);
        await api.say('Un motivo con número y un cable que baja. Eso huele a Eutimio.');
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
      // E6 §2.1.4: a oscuras, Yoli también se queda ciega por este camino (las dos líneas de siempre, 0 nuevas)
      await api.sayAs(Y, '¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?');
      // (Clic. Negro. Anselmo ya se está levantando.)
      await alEnchufe(api, A);
      await talk(api, [['B', 'Ticket nº 3: «El CMS se cuelga con esta pantalla».'], [A, '¿Tiene número?'], ['B', 'El tres.'],
        [A, '...Entonces existe. A HECHO (PERO NO).']]);
      // (Corta cinta y pega bajo el letrero: «SALVO TICKET Nº 3».)
      await api.anim(A, 'reach', 600);
      api.sfx('paper');
      api.setState('enchufe_pantalla', 'con_ticket');
      api.setFlag('cms_vivo', true);
      api.setState('monitor_yoli', 'publicado');
      api.repaint();
      api.sfx(PLIN);
      await api.sayAs(Y, '...Ha entrado una pieza. ¡Ha entrado una pieza! ¡El CMS va!');
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
    await talk(api, [[A, 'Hecha con una IA de fuera. No entra en ninguna pieza.'], [A, 'Encintar, no: aislar el componente.']]);
    api.faceActor(A, api.player);
    // [bloqueos] si Bruno ya oyó la frase en el árbol de Anselmo, aquí solo el eco; si no, entera
    if (api.flag('pecera_prompt_oido')) {
      await talk(api, [['B', '¿Y lo vuestro no viene de fuera?'], [A, 'Ya te lo dije. Lo que cuenta es lo de dentro.'],
        [L, 'El prompt de Herminia lo escribí yo. En esta mesa.']]);
    } else {
      await talk(api, [['B', '¿Y vosotros no usáis IA de fuera?'], [A, 'El modelo es de fuera. El prompt es de dentro.'], [A, 'Eso lo hace nuestro.'],
        [L, 'El prompt de Herminia lo escribí yo. En esta mesa.']]);
      api.setFlag('pecera_prompt_oido', true);
    }
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
    await junto(api, 790, 124, 840, L);
    api.placeActor(A, 'pecera', MESA_INFOGRAFIA[0], MESA_INFOGRAFIA[1], 'left');
    // (Anselmo, en Infografía, da la última vuelta de cinta. Rasss. Estado paquete.)
    await api.anim(A, 'reach', 700);
    api.sfx('paper'); await api.wait(300); api.sfx('paper'); await api.wait(300); api.sfx('paper');
    api.setFlag('dos_ias_vista', true);
    await talk(api, [[A, 'Última vuelta. Integración: en la próxima versión.'], [L, 'Envuelta. Parece un regalo. De nadie.']]);
    await anselmoASuMesa(api, 975);          // (Anselmo vuelve a su mesa. Leoncio se gira hacia Bruno.)
    api.faceActor(L, api.player);
    await talk(api, [[L, 'Antes de que la envolviera le pedí un gráfico del Titulator.']]);
    // (Por un hueco de la cinta, la pantalla.)
    api.sfx('beep');
    await talk(api, [['H', 'titulares por hora · picos: 14:00 y 14:30 · pausas de 5 min: 11'],
      ['H', 'origen: Sistemas, armario 27 · consumo: atún'],
      [L, 'Una IA que come a las dos y va once veces al baño.']]);
    api.faceActor(A, 'left');                // (desde su mesa)
    await talk(api, [[A, 'Tiene alta de usuario interno. Lo que tiene alta es de la casa.']]);
    api.setFlag('anselmo_dijo_regla', true);
    // E6 §2.5.1 (B2): Bruno ya no saca la conclusión; mira hacia el ascensor, sin línea
    await api.wait(800);
    api.face('right');
    await api.wait(600);
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
    await junto(api, 790, 124, 840, L);
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
    await talk(api, [[L, '¿Me la estás quitando?'], [A, 'Quitar, no: absorber en plataforma.'],
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
    await junto(api, 690, 124, 700, Y);
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
    await junto(api, 690, 124, 700, Y);
    api.face('right');
    // E4 S1: el CMS escupe la cola de la tarde en el monitor de Yoli (cinco avisos, solo se ven; la pantalla, negra)
    api.setState('monitor_yoli', 'publicado');
    await api.viral({ avisos: RAFAGA, color: '#7aff7a', cada: 420, ms: 3600, sfx: PLIN });
    api.setState('monitor_yoli', null);
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
    if (!p || Math.abs(p.x - YOLI_EN[0]) > 200) await junto(api, 690, 124, 700, Y);
    await talk(api, [[Y, '¿Ramírez? ¡Ramírez ha vuelto! ...Ah. No. Eres tú.'],
      [Y, 'Por un segundo te he respetado.'],
      ['D1', '¡Ramírez!'], ['D2', '¿Viene a por el yogur?']]);
  });
}

// ================================================================== E2 §4.2.3 · el adhesivo en la espalda (Yoli, una vez)
async function banner(api) {
  if (!api.flag('bruno_con_banner') || api.flag('lector_derribado')) return;
  if (!api.once('pecera_yoli_banner')) return;
  await api.cutscene(async (api) => {
    await encuadre(api, YOLI_EN[0] - 30);   // (la cámara busca a Yoli; ella mira la espalda de Bruno)
    await talk(api, [[Y, '¿Llevas un banner en la espalda? ...Pues convierte.']]);
  });
  api.cameraFollow();
}


// ================================================================== ENMIENDA E4 · S4 · paso 34: la prueba A/B
async function opaAB(api) {
  if (!api.once('pecera_opa_ab')) return;
  await api.cutscene(async (api) => {
    await encuadre(api, 720);
    api.faceActor(Y, api.player);
    await api.sayAs(Y, 'No me has avisado. Te la he leído por encima del hombro.');
    await titulador(api, { demo: PIEZAS.demo_paso_34 });            // muda: el titular de Bruno y la versión de Yoli
    await api.sayAs(Y, ['Tu titular: tres. Uno era yo, comprobando.', 'Te dejo mi titulador. Cuando quieras, pruebas tú.']);
  });
  api.cameraFollow();
}

// ================================================================== ENMIENDA E4 · S5 · paso 40: el ganador
/** Plano del resultado: versiones tachadas arriba, la de Bruno con candado y, grande, el ganador con su corona. */
function resultado(gan, versiones, bruno, url) {
  return (g, r, t) => {
    const { x, y, w, h } = r;
    rect(g, x, y, w, h, PAL.blue[0]);
    versiones.forEach((v, i) => {
      const yy = y + 4 + i * 8;
      const tt = v.t.length > 58 ? v.t.slice(0, 57) + '...' : v.t;
      const ww = micro(g, tt, x + 6, yy, '#9fb0d8');
      micro(g, miles(v.u), x + w - 6, yy, '#9fb0d8', { align: 'right' });
      hline(g, x + 5, yy + 2, ww + 2, '#ff5a4a');                       // tachada en rojo
    });
    const by = y + 4 + versiones.length * 8;
    rect(g, x + 6, by, 3, 3, PAL.metal[5]); frameRect(g, x + 5, by - 2, 5, 3, PAL.metal[4]);   // candado
    micro(g, `${bruno.t.replace(/\.$/, '')} · ${bruno.u}`, x + 13, by, '#7a7a88');
    // el ganador, en grande (tarjeta de papel) con la coronita
    const cy = by + 10, ch = h - (cy - y) - 14;
    rect(g, x + 6, cy, w - 12, ch, '#f4efe2');
    const vis = t > 300;
    if (vis) {
      const lines = wrapTit(gan.t, w - 60);
      lines.slice(0, 3).forEach((l, i) => drawText(g, l, x + 12, cy + 4 + i * 11, '#141220', { outline: null, bold: true }));
      const cx = x + w - 30, cyy = cy + 6;
      for (const [dx, dh] of [[0, 4], [4, 6], [8, 4]]) rect(g, cx + dx, cyy + 6 - dh, 3, dh, PAL.gold[4]);
      rect(g, cx, cyy + 6, 11, 3, PAL.gold[3]); rect(g, cx + 5, cyy - 1, 1, 1, PAL.red[4]);
      drawText(g, miles(gan.u), x + w - 12, cy + 16, '#1a7a2a', { align: 'right', bold: true, outline: null });
    }
    // la URL, en gris, con «opa» en rojo
    const uy = y + h - 9;
    const partes = url.split(/(\bopa\b)/);
    let ux = x + 8;
    for (const p of partes) ux += micro(g, p, ux, uy, p === 'opa' ? '#ff5a4a' : '#8a96b8') + 1;
  };
}
function wrapTit(t, maxW) {
  const out = []; let cur = '';
  for (const wd of t.split(' ')) { const n = cur ? cur + ' ' + wd : wd; if (measure(n, { bold: true }) <= maxW || !cur) cur = n; else { out.push(cur); cur = wd; } }
  if (cur) out.push(cur);
  return out;
}

async function opaGanadora(api) {
  const k = ganadorK(api);
  await api.cutscene(async (api) => {
    await junto(api, 690, 124, 700, Y);
    api.face('right');
    // (Yoli se levanta de un salto. Tres plins.)
    api.anim(Y, 'reach', 600);
    for (let i = 0; i < 3; i++) { api.sfx(PLIN); await api.wait(160); }
    await api.sayAs(Y, '¡Bruno! Ya hay ganador. A las 00:01 le meto tu opa dentro.');
    const hist = (api.flag('pecera_disc_hist') || []).slice(-4).map(([a, s, g]) => combinacion([a, s, g])).filter(c => c.k !== k);
    const versiones = (hist.length ? hist : versionesDefecto()).slice(-4);
    await api.detalle({ titulo: 'PRUEBA · RESULTADO', w: 296, h: 106, x: 12, y: 2, color: '#FF78B8',
      draw: resultado(combinacion(k), versiones, combinacion(BRUNO), urlBruno()) }, async (api) => {
      await api.wait(1500);
      await api.say('¿Y dónde se ve la opa?');
      await api.sayAs(Y, 'En la dirección web. Donde no molesta.');
    });
  });
  api.setFlag('pecera_disc_ganador_k', k);
  api.setFlag('discover_ganador', asuntoDe(k).id);
  api.cameraFollow();
}

// ================================================================== ENMIENDA E4 · S3 · la hoja «LO MÁS LEÍDO»
const corta = (t) => (t.length > 34 ? t.slice(0, 34).trimEnd() + '...' : t.endsWith('...') ? t : t.slice(0, 34) + '...');
/** Filas de la hoja de la versión `version` ([n, titular, lecturas]), con la cafetera y el ganador. */
export function filasHoja(api, version) {
  const H = HOJA[version];
  const filas = H.filas.map(([f, n], i) => [i + 1, FIJOS[f].t, miles(n)]);
  if (version === 'II' && api.flag('cafetera_viral')) filas[2] = [3, FILA_CAFETERA[0], miles(FILA_CAFETERA[1])];
  if (version === 'III' && api.flag('discover_ganador')) filas[4] = [5, combinacion(ganadorK(api)).t, '00:01'];
  return { kw: H.kw, filas, extra: H.extra ? [H.extra[0], FIJOS[H.extra[1]].t, miles(H.extra[2])] : null };
}
/** Dibujo de la hoja impresa: folio blanco, filete rosa, chinchetas; cada titular cortado a 34 caracteres + «...». */
export function hojaTop(datos, ibex, hora) {
  return (g, r) => {
    const { x, y, w, h } = r;
    rect(g, x, y, w, h, '#3a2a30');
    rect(g, x + 3, y + 2, w - 6, h - 4, PAL.paper[7]);
    frameRect(g, x + 3, y + 2, w - 6, h - 4, '#FF78B8');
    rect(g, x + 5, y + 3, 3, 3, PAL.red[4]); rect(g, x + w - 8, y + 3, 3, 3, PAL.blue[5]);   // chinchetas
    micro(g, `LO MÁS LEÍDO · ${hora} · KW: ${datos.kw}`, x + (w >> 1), y + 6, '#c83a6a', { align: 'center' });
    hline(g, x + 8, y + 13, w - 16, '#FF78B8');
    const fila = (yy, n, t, l, col = '#141220', cortar = true) => {
      drawText(g, String(n), x + 22, yy, col, { outline: null, align: 'right' });
      drawText(g, cortar ? corta(t) : t, x + 27, yy, col, { outline: null });
      drawText(g, l, x + w - 9, yy, col, { outline: null, align: 'right' });
    };
    datos.filas.forEach(([n, t, l], i) => fila(y + 15 + i * 10, n, t, l));
    let yy = y + 15 + datos.filas.length * 10;
    drawText(g, '···', x + 22, yy - 4, '#8a8070', { outline: null });
    yy += 5;
    if (datos.extra) { fila(yy, ...datos.extra, '#5a5248'); yy += 10; }
    fila(yy, FILA_IBEX, FIJOS.F5.t, String(ibex), '#9a9488', false);
  };
}
/** Mirar la hoja (lista_mas_leidas, S3): la 2.ª vez y siguientes Yoli arranca la hoja y clava otra. */
export async function mirarHoja(api) {
  const n = api.inc('pecera_top_n');
  if (n >= 2) {
    if (n === 2) await api.sayAs(Y, 'Esa ya está vieja. Te imprimo otra.');
    api.anim(Y, 'reach', 500); api.sfx('paper');
  }
  const III = api.flag('acto_3_iniciado');
  const version = III ? 'III' : api.flag('cms_vivo') ? 'II' : 'I';
  const ibex = III ? (api.flag('discover_ganador') ? 0 : 1) : Math.max(1, 4 - n);
  let lines;
  if (n === 1) lines = [['player', 'Lo más leído de la web, impreso y clavado con chinchetas.']];
  else if (III && api.once('pecera_top_borrasca')) lines = [['player', 'Por fin salgo el primero. Soy una borrasca.']];
  else if (III && api.flag('discover_ganador') && api.once('pecera_top_ibex0')) {
    const C = (asuntoDe(ganadorK(api)) || {}).C || 'Discover';
    lines = [['player', `El Ibex, a cero. El que lo escribe se ha ido a ${C}.`.replace(/\ba el\b/g, 'al')]];
  }
  const datos = filasHoja(api, version);
  const filas = datos.filas.length + (datos.extra ? 1 : 0) + 1;
  await api.detalle({ titulo: 'LO MÁS LEÍDO', w: 300, h: 18 + filas * 10 + 8, x: 10, y: 2, color: '#FF78B8',
    draw: hojaTop(datos, ibex, api.hora()), ...(lines ? { lines } : { ms: 2400 }) });
}
void usuariosK; void vline;

export default {
  pecera_opa_ab: opaAB,
  pecera_opa_ganadora: opaGanadora,
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
