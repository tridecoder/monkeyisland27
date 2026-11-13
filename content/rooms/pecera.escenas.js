// SALA `pecera` — ESCENAS (paquete B). Importado desde ./pecera.js; las escenas son globales: api.scene('<nombre>').
//   presentacion_villano   biblia 7.2 (+ inserto 9.1 de la adenda) y la línea de entrada 8.7 de la Pecera
//   pecera_cms_vivo        P05b: Tirar de enchufe_pantalla con vio_ticket_3 (biblia 5.2 P05 + inserto 9.2 de la adenda)
// Las acotaciones de la biblia (entre paréntesis) son acciones, nunca texto.
import { talk } from './pecera.voces.js';
import { PECERA_DESPLAZ as D } from '../lib/edificio.js';
import art from './art/pecera.art.js';
import { PAL, rect, hline, vline, frameRect, gradV, label, glow } from '../../engine/draw.js';

const Y = 'yoli_tendencias', N = 'nerea_backlog', I = 'inigo_sinergia';
const TITULATOR = '#B6FF4D';

/** PLANO DETALLE (api.detalle, engine/detalle.js): el portátil plateado de Íñigo, girado hacia la redacción, con el
 *  Titulator escupiendo el titular línea a línea. r = recuadro del inserto (coordenadas de pantalla), t = ms. */
function portatilTitulator(g, r, t) {
  const LINES = ['EL IBEX ABRE PLANO.', 'PLANO.', '¿POR QUÉ NADIE', 'HABLA DE ESTO?'];
  const { x, y, w, h } = r;
  rect(g, x, y, w, h, '#000');
  // tapa plateada con su pegatina y la pantalla
  gradV(g, x, y, w, h - 10, [PAL.metal[6], PAL.metal[5], PAL.metal[4]]);
  frameRect(g, x, y, w, h - 10, PAL.metal[2]);
  rect(g, x + 6, y + 5, w - 12, h - 22, '#06140a'); frameRect(g, x + 5, y + 4, w - 10, h - 20, PAL.ink[1]);
  rect(g, x + 6, y + 5, w - 12, 9, '#1c3a10');
  label(g, 'TITULATOR 3000', x + (w >> 1), y + 3, '#B6FF4D', { align: 'center' });
  const n = Math.min(LINES.length, Math.floor(t / 260) + 1);
  LINES.slice(0, n).forEach((l, i) => label(g, l, x + 10, y + 13 + i * 10, '#B6FF4D'));
  if ((Math.floor(t / 300) & 1) === 0) rect(g, x + 10 + 2, y + 15 + n * 10, 5, 1, '#B6FF4D');
  glow(g, x + (w >> 1), y + 34, 60, 26, '#B6FF4D', 0.08, 3);
  // la base (teclado) en perspectiva
  rect(g, x, y + h - 10, w, 8, PAL.metal[5]); hline(g, x, y + h - 10, w, PAL.metal[7]); hline(g, x, y + h - 3, w, PAL.metal[2]);
  for (let i = 0; i < 13; i++) rect(g, x + 4 + i * 9, y + h - 8, 7, 2, PAL.metal[3]);
  rect(g, x + w - 18, y + h - 9, 10, 2, PAL.ink[2]);
}

/** Mueve la cámara a `x` y espera a que llegue (así nadie habla con la cámara aún de camino). */
async function encuadre(api, x) {
  const g = api.game;
  api.cameraTo(x);
  const t = Math.max(0, Math.min(g.room.width - 320, x - 160));
  for (let i = 0; i < 60 && !g.instant && Math.abs(g.camX - t) > 2; i++) await api.wait(50);
}

async function presentacionVillano(api) {
  await api.cutscene(async (api) => {
    // (La Pecera. La pantalla gigante marca 3.418 y baja. Yoli se echa colirio.)
    // Rediseño (docs/GUIA_REDISENO.md §3, §6): el núcleo (escaleras y ascensor) y el pasillo de Dirección están a la
    // IZQUIERDA; las entradas caen en x < 300 (con la puerta de la Redacción de papel). La Web empieza en 310 (desde la
    // orden 2, todo lo de Web a Diseño está 140 px más a la derecha: PECERA_DESPLAZ). Si Bruno estuviera lejos, fundido.
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
    api.cameraTo(232 + D);                   // Bruno, la pantalla de métricas y Yoli en el mismo plano
    await api.anim(Y, 'reach', 700);
    await api.sayAs(Y, '¡No entra nada! ¡El CMS lleva dos horas en "Guardando borrador"!');
    // (Las luces parpadean. Entra Íñigo con un portátil plateado bajo el brazo.) Sube por la escalera del núcleo.
    for (let i = 0; i < 2; i++) { await api.fadeOut(70); await api.fadeIn(70); }
    const door = art.layout.pecera_a_vestibulo.walkTo || [25, 108];
    const at = SITIO_IN;
    api.placeActor(I, 'pecera', door[0] + 6, door[1] + 4, 'right');
    api.show(I);
    api.sfx('door');
    api.cameraTo(150);
    await api.walkActor(I, at[0], at[1]);
    api.cameraTo(232 + D);
    api.faceActor(I, 'down');
    api.face(I);
    await talk(api, [
      [I, 'Buenas noches, equipo. Íñigo Sinergia, de Optimal Brains & Partners.'],
      [I, 'Tranquilos. No vengo a despedir a nadie.'],
      [I, 'Vengo a reimaginar el perímetro.'],
      // adenda 9.1
      ['CORO', '¡Ha sido Diseño!'],
      [I, '...No he dicho nada malo todavía.'],
      ['D1', 'Por si acaso.'],
      [Y, 'Eso es despedir con diapositivas.'],
      [I, 'Os presento al Titulator 3000. Inteligencia artificial de titulares.'],
    ]);
    // (Gira el portátil. En pantalla: «EL IBEX ABRE PLANO. PLANO. ¿POR QUÉ NADIE HABLA DE ESTO?»)
    // Primer plano del portátil girado (informe visual, problema 9): el titular se VE en su pantalla.
    await api.anim(I, 'reach', 500);
    api.sfx('computer');
    await api.detalle({ titulo: 'EL PORTÁTIL DE ÍÑIGO', x: 94, y: 6, w: 132, h: 76, draw: portatilTitulator }, async (api) => {
      await api.wait(500);
      await api.sayAs(I, 'EL IBEX ABRE PLANO. PLANO. ¿POR QUÉ NADIE HABLA DE ESTO?', { color: TITULATOR, at: [160 + Math.round(api.game.camX), 108] });
    });
    await talk(api, [
      [I, 'Esta tarde lleva trescientos titulares. La redacción humana, cero.'],
      [Y, '¡Porque se nos ha caído el CMS!'],
      [I, 'Exacto. El Titulator no necesita CMS. Ni silla. Ni convenio.'],
      [I, 'A las nueve, con el cierre, la Reunión de Dirección aprueba el Plan Cero Papel.'],
      [I, 'Sin edición impresa. Sin rotativa. Sin costes. Solo clics.'],
      [I, 'No os despido: os desapalanco del organigrama.'],
      ['B', '¿Sin papel? Pero si mañana firmo yo en papel.'],
    ]);
    // (lo mira de arriba abajo)
    api.faceActor(I, api.player);
    await api.wait(500);
    await talk(api, [
      [I, '¿Y tú eres...?'],
      ['B', 'Bruno Pellejo. Becario senior. Senior en becario.'],
    ]);
    // (apunta en un pósit rosa)
    await api.anim(I, 'reach', 600);
    api.sfx('paper');
    await talk(api, [
      [I, 'Coste cero, disponibilidad total.'],
      [I, 'Te tengo en la matriz, Vacante. Cuadrante "Ideal". No te muevas.'],
    ]);
    // (Íñigo sale hacia la Pajarera.)
    const exitP = art.layout.pecera_a_pajarera.walkTo || [115, 108];
    api.cameraTo(170);
    await api.walkActor(I, exitP[0], exitP[1]);
    api.sfx('door');
    api.placeActor(I, null);
    await encuadre(api, 232 + D);            // de vuelta a Yoli (Web) antes de que hable
    await talk(api, [[Y, '¿Pósit rosa? El rosa es "emociones". Te ha clasificado como emoción.']]);
    await encuadre(api, 452 + D);            // Yoli (Web, 449) y Nerea (Desarrollo, 738) en el mismo plano
    await api.wait(200);
    await talk(api, [
      [N, 'El CMS no es nuestro, es de Sistemas.'],
      [Y, '¡Paco dice que es vuestro!'],
      [N, 'Paco dice muchas cosas. Por ticket.'],
    ]);
    api.setFlag('inigo_presentado', true);
    api.cameraFollow();
    await api.wait(300);
    // biblia 8.7: entrada de la Pecera en el Acto I (tras la escena 7.2)
    await api.say('Las seis y media. Se ha ido todo el mundo. Las pantallas no se han enterado.');
  });
}

async function cmsVivo(api) {
  await api.cutscene(async (api) => {
    await api.anim(api.player, 'reach', 700);
    api.sfx('click');
    api.setFlag('cms_vivo', true);           // (la pantalla gigante se apaga)
    api.repaint();
    await api.wait(500);
    await talk(api, [
      [Y, '¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?'],
      // adenda 9.2
      ['CORO', '¡Ha sido Diseño!'],
      ['B', 'He sido yo. Pero gracias.'],
      [Y, '...Ha entrado una pieza. Y otra. ¿El CMS va?'],
    ]);
  });
}

export default {
  presentacion_villano: presentacionVillano,
  pecera_cms_vivo: cmsVivo,
};
