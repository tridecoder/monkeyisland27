#!/usr/bin/env node
// GUION NUEVO · TANDA 3 (docs/GUION_PROPUESTA_LIMPIO.md): EVENTOS ([P12], con lo que corrigen [P14] y [P15]). Cada puerta
// nueva o movida se juega (ratón donde importa) y se comprueba: (a) que si se intenta antes de tiempo hay una respuesta
// que orienta; (b) que la abuela y la nota de Bruno mandan al sitio correcto en cada estado; (c) que se puede hacer en
// varios órdenes (mirar la silla o preguntarle a Brais; Eventos antes o después de Brais; pedir el álbum antes de saber lo
// de la silla; fallar el sitio de la 112); (d) que las partidas del juego ANTERIOR a mitad de bloque cargan y se terminan.
//   · Acto I: la presentación siembra el brindis; el «CONFIRMADO» de Pilar; la 112 que falta («Se la llevó un señor de
//     traje en julio»); la pancarta y la silla del ponente por estados; Íñigo: el brindis y la silla.
//   · Acto II: el rider (el «RV:» de Tadeo, la entrada con el walkie, «¿Qué ha pedido el ponente?» → la memoria → el
//     botón «no está conectado a nada»); la trituradora, el pulsador, sin lista de papel; el ambiente de la puerta.
//   · Acto III: la entrada (trituradora, «La 112, sin aparecer»); la línea de la trituradora en la revelación de Brais;
//     la silla del armario (mirarla o preguntarle a Brais); la negativa; «Creo que sé dónde está tu 112.» con sus tres
//     sitios; «…Entonces se sentó.», el álbum y la croqueta; el kanban con una sola palabra; el walkie del clímax.
//   · Fuera «descopear» (todo el juego), la silla 113 y el crédito del móvil de Borja.
//   node tools/test-guion3-t3.mjs        (capturas en tools/shots/guion3-t3-*.png)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';
import { STEPS } from './walk-data.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });
const server = createServer(root);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const T0 = Date.now();
const step = (t) => console.log(`\n[${Math.round((Date.now() - T0) / 1000)} s] ` + t);
const consoleErrors = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const G = (fn, a) => page.evaluate(fn, a);
const R = createRunner(page);
const until = async (fn, arg, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(40); } return false; };
const idle = () => G(() => __game.waitIdle());
const state = () => G(() => __game.state());
const flag = (k) => G(k => __game.getFlag(k), k);
const tiene = (i) => G(i => __game.state().inventory.includes(i), i);
const cuantos = (i) => G(i => __game.state().inventory.filter(x => x === i).length, i);
const logHas = (t) => G(t => __game.log.some(l => String(l.text).includes(t)), t);
const logIdx = (t) => G(t => __game.log.findIndex(l => String(l.text).includes(t)), t);
const logOf = (who) => G(w => __game.log.filter(l => l.who === w).map(l => String(l.text)), who);
const clearLog = () => G(() => __game.clearLog());
const rapido = (on) => G(on => __game.skipText(on), on);
const shot = (n) => page.screenshot({ path: path.join(shots, `guion3-t3-${n}.png`) });
const verb = (v, t, i) => G(([v, t, i]) => __game.doVerb(v, t, i || null), [v, t, i]);
const objState = (id) => G(id => __game.game.getObjState(id).state, id);
const opciones = () => G(() => __game.currentDialogOptions() || []);
const sinDismisser = () => G(() => { if (window.__dismisser) clearInterval(window.__dismisser); window.__dismisser = null; });
const conDismisser = () => R.startDismisser();
/** Lanza una acción sin esperarla (texto real) y hace la captura cuando sale la línea `t`. */
async function capturaEn(lanzar, t, nombre, ms = 60000, extra = 350) {
  await rapido(false);
  await clearLog();
  await G(lanzar);
  const visto = await until(t => __game.log.some(l => String(l.text).includes(t)), t, ms);
  if (visto) { await sleep(extra); await shot(nombre); }
  await rapido(true);
  await idle();
  return visto;
}

// ---- ratón
const verA = (id) => G((id) => {
  const g = __game.game, o = __game.objects().find(o => o.id === id) || (g.actors[id] && { x: g.actors[id].x - 10, w: 20 });
  if (!o) return;
  g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, Math.round(o.x + o.w / 2 - 160)));
}, id);
const seguir = () => G(() => { __game.game.camFollow = __game.game.G.player; });
const clicVerbo = async (v) => { const c = await G(v => __game.verbPos(v), v); await page.mouse.click(c.x, c.y); await sleep(40); };
const clicInv = async (it) => { const c = await G(i => __game.invPos(i), it); await page.mouse.click(c.x, c.y); await sleep(40); };
async function raton(verbo, id, item, esperar = true) {
  await clicVerbo(verbo);
  if (item) await clicInv(item);
  await verA(id); await sleep(60);
  const c = await G(id => __game.screenPos(id), id);
  await page.mouse.click(c.x, c.y);
  if (esperar) { await sleep(150); await idle(); await seguir(); }
}
async function clicOpcion(texto, esperar = true) {
  if (!(await until(() => !!__game.currentDialogOptions(), null, 15000))) return false;
  await sleep(330);
  const o = await opciones();
  const i = o.findIndex(x => x.replace(/^› /, '') === texto || x.includes(texto));
  if (i < 0) return false;
  const p = await G(i => __game.optionPos(i), i);
  await page.mouse.click(p.x, p.y + 2);
  if (!esperar) return true;                             // (para capturar una línea a mitad de la escena)
  await sleep(150);
  await idle();
  return true;
}
async function salir() {
  for (let k = 0; k < 4; k++) {
    const o = await opciones(); if (!o.length) return;
    const i = o.findIndex(x => /^(Me voy|Nada|Luego vuelvo|Ahora vuelvo|Mejor no|Gracias)/.test(x));
    await G(i => __game.chooseDialog(i), i < 0 ? o.length - 1 : i); await idle();
  }
}

// ---- partidas
const paso = (n) => STEPS.find(s => s.n === n);
async function jugar(lista) {
  await rapido(true);
  for (const n of lista) {
    const s = paso(n);
    for (const a of s.acc) await R.run(a);
    await idle();
    await R.check(s.esp);
  }
}
const pasos = (a, b) => STEPS.filter(s => s.n >= a && s.n <= b).map(s => s.n);
async function nueva() { await rapido(true); await G(() => __game.newGame()); await idle(); }
const guardar = (slot) => G(s => __game.save(s), slot);
const cargar = async (slot) => { await G(s => __game.load(s), slot); await idle(); };
/** Copia de una ranura retocada como partida del juego ANTERIOR (flags/objetos/inventario/once). */
async function partidaVieja(slot, nuevaSlot, cambio) {
  await G(([s, n, c]) => {
    const k = __game.game.slotKey(s), d = JSON.parse(localStorage.getItem(k));
    const st = d.state, fn = new Function('st', c);
    fn(st);
    localStorage.setItem(__game.game.slotKey(n), JSON.stringify(d));
  }, [slot, nuevaSlot, cambio]);
  await cargar(nuevaSlot);
}
/** Pista de la abuela en la sala `sala` (llamada entera, en modo rápido): sus líneas y las de Bruno al colgar. */
async function abuela(sala) {
  return G(async (sala) => {
    const g = __game.game, real = g.state.room;
    if (sala) g.state.room = sala;
    __game.clearLog(); __game.skipText(true);
    try { await __game.scene('pistas'); } finally { g.state.room = real; }
    return { abuela: __game.log.filter(l => l.who === 'abuela_remedios').map(l => String(l.text)), bruno: __game.log.filter(l => l.who === 'bruno').map(l => String(l.text)),
      obj: g.state.flags.abuela_obj, nivel: g.state.flags.abuela_nivel };
  }, sala);
}
const meta = (sala) => G(async (sala) => { const m = await import('./engine/objetivos.js'); return m.meta(__game.game, sala); }, sala);
const ficha = () => G(async () => { const m = await import('./content/items.js'); const g = __game.game; return m.fichaViva({ flag: (k) => g.state.flags[k], has: (i) => g.state.inventory.includes(i) }); });
const fin = () => G(() => __game.state().finished);

const fuera = (o) => o.map(x => x.replace(/^› /, ''));
const verObj = (id) => G(id => { const o = __game.objects().find(o => o.id === id); return o ? o.visible : null; }, id);
const NUEVAS = "for (const k of ['eventos_falta_112','eventos_acto3_entrada','silla_112_vista','pilar_nego_album','eventos_album_dado']) delete st.flags[k];";
const ordenLog = async (...ts) => { const ix = []; for (const t of ts) ix.push(await logIdx(t)); return ix.every((v, i) => v >= 0 && (i === 0 || v > ix[i - 1])); };
async function hablarPilar() { await raton('hablar', 'pilar_escaleta', null, false); await until(() => !!__game.currentDialogOptions(), null, 30000); await sleep(200); return fuera(await opciones()); }
async function terminar(desde, sin = []) {
  let terminada = true;
  try { await jugar(STEPS.map(s => s.n).filter(n => n >= desde && !sin.includes(n))); } catch (e) { terminada = false; console.log('    ' + (e instanceof StepFail ? e.message : e)); }
  return terminada && !!((await fin()) && (await fin()).flags.juego_terminado);
}

try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game && __game.state().mode === 'title');
  await R.startDismisser();

  // ====================================================================== datos
  step('Datos: pistas, el móvil, «descopear» y la silla 113 fuera, créditos');
  {
    const P = await import('../content/pistas.js');
    const mov = await import('../content/lib/movil.js');
    const o = (id) => P.OBJETIVOS.find(x => x.id === id);
    ok(o('album').niveles[2][0] === 'Sube a ver a la de las fiestas, hijo, y escúchala. Algo le falta.'
      && o('album').niveles[2][1] === 'Eventos: ver a Pilar antes de las 21:04. El álbum está en su trituradora.', 'objetivo «El álbum»: el nivel 3 manda a subir a Eventos (no a pedir el álbum)');
    const sp = o('silla_pilar');
    ok(!!sp && sp.niveles[2][1] === 'Sistemas: Mirar la silla del armario 27. O preguntarle a Brais de dónde es.'
      && sp.sub[1].niveles[2][1] === 'Eventos: a Pilar, «Creo que sé dónde está tu 112». En el armario 27.', 'objetivo «La silla de Pilar»: a la silla y, con la silla vista, a Pilar');
    ok(o('columna').sub.length === 1 && o('columna').sub[0].si === '!rep_13', 'columna del kanban: una sola variante (sin la otra palabra)');
    ok(mov.RV_TADEO[1][1] === 'RV: RV: Rider del ponente: agua con gas, cero papel, sin preguntas!!' && mov.RV_TADEO[1][2] === 'Lo ha reenviado a toda la empresa. Nadie ha preguntado.', 'el «RV:» del Acto II es el rider del ponente');
    const b0 = mov.bandeja({ flag: () => 0 }), b1 = mov.bandeja({ flag: (k) => (k === 'inigo_presentado' ? true : 0) });
    ok(!b0.some(c => c.asunto === 'CONFIRMADO') && b1.findIndex(c => c.asunto === 'CONFIRMADO') === b1.findIndex(c => c.asunto === '¡Empezamos en 5 minutos!') - 1,
      'el «CONFIRMADO» de Pilar: tras la presentación, encima de los fijos');
    const scan = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? scan(path.join(dir, d.name)) : /\.m?js$/.test(d.name) ? [path.join(dir, d.name)] : []);
    const textos = [...scan(path.join(root, 'content')), ...scan(path.join(root, 'engine'))].map(f => fs.readFileSync(f, 'utf8'));
    // los ids técnicos (`posit_descopeado`) se quedan; ningún texto dice «descopear»
    // (lo que se puede leer o oír: fuera los comentarios, los ids técnicos y la migración de partidas viejas de game.js)
    const visible = (t) => t.split('\n').map(l => l.replace(/\/\/.*$/, '')).join('\n').replace(/posit_descopeado|'oyo_descopear'|columna_kanban === 'descopeado'/g, '');
    ok(!textos.some(t => /descope(ar|ado|amos|ó)\b|DESCOPE/i.test(visible(t))), 'fuera «descopear/descopeado» de content/ y engine/ (salvo ids técnicos y la migración)');
    ok(!textos.some(t => t.includes('silla_torcida') || t.includes('Ciento trece')), 'fuera la silla 113 (objeto y recuento)');
    const fin_ = fs.readFileSync(path.join(root, 'content/escenas/final.js'), 'utf8');
    ok(!/móvil de Borja/.test(fin_) && !/Lo publicó a las nueve/.test(fin_), 'créditos: sin el del móvil de Borja');
    ok(fin_.includes("asig('Eventos', 'Asignado a: Pilar Escaleta. Empezamos en cinco minutos.')"), 'créditos: el de Eventos, intacto');
  }

  // ====================================================================== Acto I
  step('Acto I · la presentación siembra el brindis; Eventos con ponente confirmado; falta la 112');
  await nueva();
  await jugar(pasos(1, 15));
  ok(await ordenLog('A las nueve, la Reunión de Dirección aprueba el Plan Cero Papel.', 'Y a las nueve y cinco, brindis en Eventos. Con croquetas.', '¿Sin papel? Pero si mañana firmo yo en papel.'),
    'presentación: «Y a las nueve y cinco, brindis en Eventos. Con croquetas.» (entre el plan y «¿Sin papel?»)');
  await guardar('t3_a1');
  await R.run(['ir', 'eventos']); await idle();
  ok((await verObj('trituradora')) === false && (await verObj('pulsador_rojo')) === false && (await verObj('album_eventos_hotspot')) === true, 'Acto I: sin trituradora ni pulsador; el álbum, en la mesa');
  await clearLog();
  await raton('mirar', 'pancarta_evento');
  ok(await logHas('«BIENVENIDOS A LA PRESENTACIÓN DEL PLAN CERO PAPEL».'), 'pancarta (Acto I, con ponente): «BIENVENIDOS A LA PRESENTACIÓN DEL PLAN CERO PAPEL»');
  await raton('mirar', 'silla_reservado');
  ok(await logHas('Un folio en una silla: «RESERVADO · Ponente: CONFIRMADO».'), 'silla del ponente: CONFIRMADO');
  await raton('coger', 'album_eventos_hotspot');
  ok(await logHas('¡Eh! Ese álbum está acreditado. Pídemelo con un motivo.') && !(await tiene('album_eventos')), 'Coger el álbum (Acto I): «Pídemelo con un motivo.» (no se lo lleva)');
  let op = await hablarPilar();
  ok(op.includes('¿Qué evento hay hoy?') && op.includes('¿Cuántos eventos habéis empezado este año?') && !op.includes('¿Qué ha pedido el ponente?') && !op.includes('¿Me prestas el álbum?') && !op.some(x => x.includes('112')),
    'Pilar (Acto I): «¿Qué evento hay hoy?» y «¿Cuántos eventos…?»; sin el ponente ni el álbum');
  await clicOpcion('¿Qué evento hay hoy?');
  ok(await logHas('Presentación del Plan Cero Papel. A las 21:05. Ponente: confirmado.') && await logHas('Confirmado. Le he llamado tres veces para oírselo.'), '«¿Qué evento hay hoy?»: ponente confirmado');
  await clicOpcion('¿Cuántos eventos habéis empezado este año?');
  ok(await ordenLog('Ninguno. Pero siempre estamos a cinco minutos de empezar.', 'Así nunca llegamos tarde. Ni a lo que no hay.', 'Hoy empiezo uno.'), '«¿Cuántos eventos…?»: su mejor línea, literal, y «Hoy empiezo uno.»');
  await clicOpcion('¿Cuántas sillas hay?');
  ok(await logHas('Ciento doce. ...ciento diez, ciento once. ...Ciento once.') && await logHas('Falta la 112. Se la llevó un señor de traje en julio. «Para un proyecto».') && await flag('eventos_falta_112') === true,
    '«¿Cuántas sillas hay?»: ciento once; «Falta la 112. Se la llevó un señor de traje en julio.»');
  await clicOpcion('¿Cuántas sillas hay?');
  ok(await logHas('Ciento once. Las cuento cada cinco minutos. Por si vuelve.'), 'la segunda vez: «Por si vuelve.»');
  await clicOpcion('¿Por qué no baja la cuenta atrás?');
  ok(await logHas('Esta noche hay presupuesto. Lo paga el ponente.'), '«¿Por qué no baja la cuenta atrás?»: «Esta noche hay presupuesto.»');
  await salir();
  await clearLog();
  await raton('mirar', 'cruz_112');
  ok(await logHas('Una cruz de cinta sin silla. Al lado, a boli: «112».') && await logHas('Es el sitio de alguien que no está.'), 'la cruz vacía de la 112');
  await raton('usar', 'cruz_112');
  ok(await logHas('¡Tú no eres la 112! Tú eres de pie.'), 'Usar la cruz: «¡Tú no eres la 112! Tú eres de pie.»');
  await verA('pancarta_evento'); await sleep(250); await shot('eventos-acto1'); await seguir();
  // Íñigo, en los Despachos: el brindis y la silla
  await R.run(['ir', 'pajarera']); await idle();
  await clearLog();
  await raton('hablar', 'inigo_sinergia', null, false);
  await until(() => !!__game.currentDialogOptions(), null, 20000);
  op = fuera(await opciones());
  ok(op.includes('¿Y el brindis de Eventos?') && op.includes('¿Se llevó usted una silla de Eventos?'), 'Íñigo: «¿Y el brindis de Eventos?» y, oída Pilar, «¿Se llevó usted una silla de Eventos?»');
  await clicOpcion('¿Y el brindis de Eventos?');
  await clicOpcion('¿Se llevó usted una silla de Eventos?');
  ok(await logHas('Lanzamiento interno. De pie: las sillas generan jerarquía.') && await logHas('Reasigné un activo infrautilizado. En la última fila no se sienta nadie.'), 'Íñigo: «De pie: las sillas generan jerarquía.» / «Reasigné un activo infrautilizado.»');
  await salir();

  // ====================================================================== Acto II
  step('Acto II · el rider: el «RV:», la entrada, la memoria y el botón');
  await cargar('t3_a1');
  await jugar(pasos(16, 38));
  await guardar('t3_a2');
  ok(await G(() => Number(__game.getFlag('tadeo_rv_n')) >= 2), 'el «RV:» del rider ha llegado al correo');
  await clearLog();
  await R.run(['ir', 'eventos']); await idle();
  ok(await logHas('¿Sin turno de preguntas? ...Recibido. Desenchufo el micro de sala. Cambio.'), 'primera entrada del Acto II: Pilar, al walkie, recibe el rider');
  ok((await verObj('trituradora')) === true && (await verObj('pulsador_rojo')) === true, 'desde el Acto II: la trituradora y el pulsador rojo');
  await clearLog();
  await raton('mirar', 'trituradora');
  ok(await logHas('Una trituradora nueva. Pegatina: «OPTIMAL BRAINS · CERO PAPEL».'), 'la trituradora (Acto II): «OPTIMAL BRAINS · CERO PAPEL»');
  await raton('mirar', 'pulsador_rojo');
  await raton('usar', 'pulsador_rojo');
  ok(await logHas('Un pulsador rojo, gordo, en un pedestal. Pone «APAGADO».') && await logHas('El botón no sale de su cruz. Lo pulsa el ponente.'), 'el pulsador rojo: «APAGADO»; «Lo pulsa el ponente.»');
  await raton('mirar', 'mesa_acreditaciones');
  ok(await logHas('No hay lista. Era papel. Pilar se la sabe.'), 'la mesa: «No hay lista. Era papel.»');
  await raton('mirar', 'pancarta_evento');
  ok(await logHas('«BIENVENIDOS A». El resto, tapado con cinta otra vez.'), 'la pancarta, tapada otra vez');
  await raton('mirar', 'pilar_escaleta');
  ok(await logHas('Pilar Escaleta. Cascos, walkie y ninguna escaleta: era papel.'), 'Mirar a Pilar (Acto II): ninguna escaleta');
  await clearLog();
  op = await hablarPilar();
  ok(await logHas('Teodoro tiene acreditación vitalicia. Del 97. Plastificada a mano.'), 'al abrir, el rumor de Teodoro (una vez)');
  ok(op.includes('¿Qué ha pedido el ponente?') && !op.includes('¿Y sin papel, cómo acreditas?') && op.includes('¿Sabes que el plan es apagar la rotativa?') && op.includes('¿Estás bien, Pilar?'),
    'Pilar (Acto II): el ponente, la rotativa y «¿Estás bien?»; «¿Y sin papel…?» espera al rider');
  await clicOpcion('¿Qué ha pedido el ponente?');
  ok(await ordenLog('Agua con gas. Cero papel en sala. Y sin turno de preguntas.', '¿Un evento sin preguntas?', 'Lo piden todos. Él lo ha puesto por escrito.'), '«¿Qué ha pedido el ponente?»');
  await clicOpcion('¿Y sin papel, cómo acreditas?');
  ok(await ordenLog('De memoria. Me he aprendido la escaleta y las caras.', '¿La mía también?', 'Bruno. Acceso: hasta el canapé.'), '«¿Y sin papel, cómo acreditas?»');
  await clicOpcion('¿Sabes que el plan es apagar la rotativa?');
  ok(await ordenLog('Lo pone mi escaleta. 21:00, rotativa apagada. 21:01, aplauso espontáneo.', '¿Y te parece bien?', 'Yo hago eventos, Bruno. El contenido lo trae el ponente.',
    'Si te sirve de algo, el botón no está conectado a nada.'), '«¿Sabes que el plan…?»: «el botón no está conectado a nada»');
  await clicOpcion('¿Estás bien, Pilar?');
  ok(await logHas('Tengo ponente, Bruno. Lo demás lo arreglo con cinta.'), '«¿Estás bien, Pilar?»');
  await salir();
  await verA('pulsador_rojo'); await sleep(250); await shot('eventos-acto2'); await seguir();
  {
    const eco = (await import('../content/rooms/ecosistema.js')).default;
    const amb = [].concat(eco.ambient || (eco.def && eco.def.ambient) || []).find(a => a.id === 'pilar_rider');
    ok(!!amb && JSON.stringify(amb.discusiones).includes('¿De pie? ...Recibido. Ciento once sillas de pie. Cambio.') && JSON.stringify(amb.discusiones).includes('Cero papel. Recibido. Me lo aprendo. Cambio.'),
      'Marketing (Acto II): el ambiente de la puerta de Eventos, Pilar recibiendo el rider');
  }

  // ====================================================================== Acto III · (c) Eventos antes de Brais
  step('Acto III · Eventos ANTES de encontrar a Brais: la entrada, la trituradora; nada del álbum aún');
  await cargar('t3_a2');
  await jugar([39]);
  await guardar('t3_a3');
  await sinDismisser();
  await conDismisser();
  await R.run(['ir', 'ecosistema']); await idle();
  await sinDismisser();
  const vEnt = await capturaEn(() => { __game.doVerb('usar', 'ecosistema_a_eventos'); }, '...ciento diez, ciento once. La 112, sin aparecer.', 'eventos-acto3-entrada', 60000, 600);
  await conDismisser();
  if ((await G(() => __game.state().room)) !== 'eventos') { await R.run(['ir', 'eventos']); await idle(); }
  ok(vEnt && await ordenLog('...ciento diez, ciento once. La 112, sin aparecer.', 'Ponente, aquí Eventos. Sala lista. Trituradora lista. Cambio.', 'Siguiente.', '21:04, trituradora. 21:05, brindis. Lo tengo todo.')
    && await flag('eventos_acto3_entrada') === true, 'primera entrada del Acto III: «La 112, sin aparecer», el walkie («Siguiente.») y «21:04, trituradora. 21:05, brindis.»');
  ok((await verObj('album_trituradora')) === true && (await verObj('album_eventos_hotspot')) === false, 'el álbum, en la boca de la trituradora');
  await clearLog();
  await raton('coger', 'album_trituradora');
  ok(await logHas('¡Quieto! Ese álbum tiene hora: 21:04.') && !(await tiene('album_eventos')), '(a) Coger el álbum de la trituradora: «¡Quieto! Ese álbum tiene hora: 21:04.»');
  await raton('mirar', 'trituradora');
  ok(await logHas('La trituradora, zumbando. Encima, el álbum de Eventos.'), 'Mirar la trituradora (Acto III)');
  for (let k = 0; k < 3; k++) await verb('mirar', 'mesa_acreditaciones');
  await idle();
  ok(await logHas('El extra: sin acreditar. No se sienta. Sale en todas las fotos.'), 'la mesa (Acto III): Pilar, «El extra: sin acreditar…»');
  await clearLog();
  op = await hablarPilar();
  ok(await logHas('¿Vienes acreditado? Esta noche los cinco minutos son de verdad.') && !op.includes('¿Me prestas el álbum?') && !op.includes('Creo que sé dónde está tu 112.'),
    'Pilar (Acto III, sin Brais): «Esta noche los cinco minutos son de verdad.»; sin el álbum ni la 112');
  await salir();
  let a = await abuela('eventos');
  ok(a.obj === 'armario', `(b) la abuela, aún sin Brais: el armario 27 (${a.obj})`);
  ok(await meta('eventos') === 'A las nueve apagan la rotativa. Y alguien teclea en el armario 27.', 'Mirar a Bruno: el armario 27');
  // Brais: la revelación con la línea de la trituradora; el primer plano con la silla
  await clearLog();
  await R.run(['ir', 'pecera']); await idle();
  await R.run(['ir', 'cpd']); await idle();
  await sinDismisser(); await rapido(false);
  await G(() => { __game.doVerb('tirar', 'papel_continuo'); });
  if (await until(() => !!__game.state().detalle, null, 60000)) { await sleep(900); await shot('brais-primer-plano'); }
  await rapido(true); await idle(); await conDismisser();
  const nRev = (await logIdx('Esta tarde Íñigo ha impreso aquí: «Álbum de Eventos: trituradora, 21:04».')) - (await logIdx('BECARIO DETECTADO')) + 1;
  ok(await flag('ruben_encontrado') === true && nRev > 0 && nRev <= 21, `revelación: Brais cuenta lo de la trituradora («…trituradora, 21:04».), ${nRev} líneas de la escena (≤ 21)`);
  ok((await logIdx('Esta tarde Íñigo ha impreso aquí')) > (await logIdx('Solo salgo de fondo, en las de Eventos.')), '…justo después de «Solo salgo de fondo, en las de Eventos.»');
  await guardar('t3_brais_pre');
  a = await abuela('cpd');
  ok(a.obj === 'silla_pilar' && a.abuela.includes('La que cuenta las sillas sabe siempre quién falta, hijo.'), `(b) con la 112 ya oída en Eventos, la abuela pasa a la silla de Pilar (${a.obj}, nivel ${a.nivel})`);
  a = await abuela('cpd'); a = await abuela('cpd');
  ok(a.abuela.includes('Mira bien en qué se sienta el chico del armario, hijo.') && a.bruno.includes('Sistemas: Mirar la silla del armario 27. O preguntarle a Brais de dónde es.'), '(b) nivel 3: la silla del armario (o preguntarle a Brais)');
  ok(await meta('cpd') === 'El álbum va a la trituradora a las 21:04. Y a Pilar le falta una silla.', 'Mirar a Bruno: «El álbum va a la trituradora a las 21:04. Y a Pilar le falta una silla.»');
  ok((await verObj('silla_armario')) === true, 'la silla plegable del armario, a la vista');
  await verA('silla_armario'); await sleep(250); await shot('armario-silla'); await seguir();
  // (c) la otra vía: preguntárselo a Brais
  await clearLog();
  await raton('hablar', 'ruben', null, false);
  await until(() => !!__game.currentDialogOptions(), null, 20000);
  ok(fuera(await opciones()).includes('¿De dónde es esa silla?'), 'Brais: «¿De dónde es esa silla?» (desde «Me dio una silla y wifi»)');
  await clicOpcion('¿De dónde es esa silla?');
  ok(await logHas('Me la trajo Íñigo. Dijo que en la última fila no se sentaba nadie.') && await flag('silla_112_vista') === true, '(c) preguntarle a Brais abre la opción de Pilar');
  await clicOpcion('¿Escribiste tú los discursos de Íñigo?');
  await salir();
  a = await abuela('cpd');
  ok(a.obj === 'silla_pilar' && a.nivel === 1, '(b) con la silla sabida, la abuela vuelve al nivel 1 de la variante');
  a = await abuela('cpd');
  ok(a.abuela.includes('Esa silla que le falta la has visto tú, hijo. Con alguien encima.'), '(b) nivel 2 de la variante: «Con alguien encima.»');
  a = await abuela('cpd');
  ok(a.bruno.includes('Eventos: a Pilar, «Creo que sé dónde está tu 112». En el armario 27.'), '(b) nivel 3: a Pilar, «Creo que sé dónde está tu 112». En el armario 27.');
  // la 112, con ratón: primero un sitio equivocado
  await R.run(['ir', 'eventos']); await idle();
  ok(!(await logHas('...ciento diez, ciento once. La 112, sin aparecer.')) || (await logIdx('...ciento diez, ciento once. La 112, sin aparecer.')) < (await logIdx('Me la trajo Íñigo.')), 'la entrada del Acto III no se repite');
  await clearLog();
  op = await hablarPilar();
  ok(op.includes('Creo que sé dónde está tu 112.') && op.includes('¿Me prestas el álbum?'), 'Pilar: «Creo que sé dónde está tu 112.» (y «¿Me prestas el álbum?»)');
  await clicOpcion('Creo que sé dónde está tu 112.', false);
  await until(() => (__game.currentDialogOptions() || []).some(o => o.includes('En el armario 27')), null, 30000);
  await sleep(300);
  op = fuera(await opciones());
  ok(op.length === 3 && op.includes('En los Despachos.') && op.includes('En la Sala Amazonas.') && op.includes('En el armario 27, en Sistemas.'), 'tres sitios: los Despachos, la Sala Amazonas, el armario 27');
  ok(await ordenLog('¿Mi 112? ¿La de la última fila?', '¿Dónde?'), '«¿Mi 112? ¿La de la última fila?» / «¿Dónde?»');
  await shot('pilar-112-opciones');
  await clicOpcion('En los Despachos.');
  ok(await logHas('Ahí ya la he buscado. Con el plano y con el walkie.') && !(await G(() => !!__game.currentDialogOptions())) && !(await tiene('album_eventos')), '(a) sitio equivocado: «Ahí ya la he buscado…» y se cierra (sin álbum)');
  await clearLog();
  op = await hablarPilar();
  ok(op.includes('Creo que sé dónde está tu 112.'), 'repetible hasta acertar');
  await clicOpcion('Creo que sé dónde está tu 112.');
  await sinDismisser(); await rapido(false);
  const p112 = await (async () => {
    const pos = await G(() => { const o = __game.currentDialogOptions() || []; const i = o.findIndex(x => x.includes('En el armario 27')); return i < 0 ? null : __game.optionPos(i); });
    if (!pos) return false;
    await page.mouse.click(pos.x, pos.y + 2);
    const v = await until(() => __game.log.some(l => String(l.text).includes('¡CIENTO DOCE! ¡Vuelvo a ser persona!')), null, 60000);
    if (v) { await sleep(400); await shot('ciento-doce'); }
    return v;
  })();
  await rapido(true); await idle(); await conDismisser();
  ok(p112 && await ordenLog('Con Brais sentado encima. Cuatro meses.', '...Entonces se sentó.', 'Una silla de Eventos ocupada es un asistente. Y un asistente consta.', '¡CIENTO DOCE! ¡Vuelvo a ser persona!',
    'Llévatelo. Que conste que ha venido.', 'Si sale bien, igual te quedas sin ponente.', 'Sin ponente sé hacerlo. Lo he hecho siempre.'), 'el armario 27: «…Entonces se sentó.», «¡CIENTO DOCE!», «Sin ponente sé hacerlo.»');
  ok(await tiene('album_eventos') && await flag('eventos_album_dado') === true && (await verObj('album_trituradora')) === false, 'Bruno recibe el álbum (la trituradora, apagada)');
  await clearLog();
  op = await hablarPilar();
  ok(await ordenLog('Bruno, eso merece algo. Toma: una croqueta antes de las 21:05.', 'Está fría.', 'Es una crisis de reputación. Pero es nuestra.') && op.includes('Gracias por la croqueta.')
    && !op.includes('Creo que sé dónde está tu 112.') && !op.includes('¿Me prestas el álbum?') && !op.includes('¿Estás bien, Pilar?'), 'al volver a hablarle: la croqueta, entera; «Gracias por la croqueta.»');
  await clicOpcion('Gracias por la croqueta.');
  await clicOpcion('¿Cuántas sillas hay?');
  ok(await logHas('No me las des. Te he apuntado como catering.') && await logHas('Ciento doce. Una está en el sótano, pero cuenta.'), '«Gracias por la croqueta.» y «Ciento doce. Una está en el sótano, pero cuenta.»');
  await salir();
  await clearLog();
  await raton('mirar', 'sillas_evento'); await raton('mirar', 'trituradora'); await raton('mirar', 'catering_croquetas');
  ok(await logHas('La cruz vacía tiene ahora un pósit: «112 · OCUPADA (ARMARIO 27)».') && await logHas('Apagada. Pilar le ha puesto su cruz de cinta. Ya consta, como mueble.')
    && await logHas('Falta una croqueta. Pilar ha tapado el hueco con cinta americana.'), 'después: el pósit de la 112, la trituradora apagada, la croqueta que falta');
  for (let k = 0; k < 2; k++) await verb('mirar', 'mesa_acreditaciones');
  await idle();
  ok(await logHas('Un folio nuevo, a boli: «Brais. Silla 112».'), 'la mesa: «Un folio nuevo, a boli: «Brais. Silla 112».»');
  await verA('trituradora'); await sleep(250); await shot('eventos-salvado'); await seguir();
  // el kanban con una sola columna buena; y el clímax con el walkie
  await jugar([44]);
  await clearLog();
  await G(() => { __game.doVerb('usar', 'kanban', 'rotulador_rojo'); });
  await until(() => !!__game.currentDialogOptions(), null, 20000);
  op = fuera(await opciones());
  ok(JSON.stringify(op) === JSON.stringify(['DESPEDIDOS', 'HECHO (DE VERDAD)', 'FIRMAR EN PAPEL', 'SALIDA EN VALOR', 'Mejor no.']), `el menú de columnas: una sola palabra buena (${op.join(' · ')})`);
  await G(() => __game.chooseText('Mejor no.')); await idle();
  await jugar([45, 46, 47, 48]);
  await sinDismisser();
  const vW = await capturaEn(() => { __game.doVerb('empujar', 'lector_medio'); }, 'Recibido. Empezamos sin ponente. Cambio y corto.', 'climax-walkie', 120000, 300);
  await conDismisser();
  ok(vW && await ordenLog('...Ahora no.', 'Ponente, aquí Eventos. Croquetas en posición. ¿Subes? Cambio.', 'Recibido. Empezamos sin ponente. Cambio y corto.', 'Factura de Optimal Brains. Cuarenta y ocho euros. Con coma.', 'Tira, Teodoro.', 'Benita. Tira.'),
    'clímax: el walkie de Pilar («¿Subes?», «Empezamos sin ponente.») antes de Begoña y de «Tira, Teodoro.»');
  ok(!!((await fin()) && (await fin()).flags.juego_terminado) || await until(() => !!__game.state().finished, null, 60000), 'la partida se termina');

  // ====================================================================== (c) la negativa antes de la silla
  step('Acto III · pedir el álbum antes de saber lo de la silla (la negativa), mirar la silla y la Sala Amazonas');
  await cargar('t3_a3');
  await jugar([40, 41]);
  await guardar('t3_brais');
  await R.run(['ir', 'eventos']); await idle();
  await clearLog();
  op = await hablarPilar();
  ok(op.includes('¿Me prestas el álbum?') && !op.includes('Creo que sé dónde está tu 112.'), '(a) sin la silla: no sale «Creo que sé…»; sí «¿Me prestas el álbum?»');
  await clicOpcion('¿Me prestas el álbum?');
  ok(await ordenLog('Hoy no. El ponente lo quiere en la trituradora. A las 21:04.', 'En ese álbum sale Brais. Es la única prueba de que existe.', 'Son los descartes. Foto con comida no se publica.',
    '¿El extra? Nunca se sentó. Siempre de pie, al fondo, yendo al baño.', 'Quien no se sienta no asiste. Y lo que no asiste, se tritura.') && await flag('pilar_nego_album') === true && !(await tiene('album_eventos')),
  '(a) la negativa: «Quien no se sienta no asiste. Y lo que no asiste, se tritura.»');
  await clicOpcion('¿Me prestas el álbum?');
  ok(await logHas('21:04, Bruno. Lo pone el rider. Subrayado.'), 'la segunda vez: «21:04, Bruno. Lo pone el rider. Subrayado.»');
  await salir();
  ok(await meta('eventos') === 'Pilar no suelta el álbum: quien no se sienta no asiste. Y le falta una silla.', '(b) Mirar a Bruno tras la negativa');
  a = await abuela('eventos'); a = await abuela('eventos'); a = await abuela('eventos');
  ok(a.obj === 'silla_pilar' && a.bruno.includes('Sistemas: Mirar la silla del armario 27. O preguntarle a Brais de dónde es.'), '(b) la abuela, tras la negativa: la silla del armario');
  await R.run(['ir', 'cpd']); await idle();
  await clearLog();
  await raton('mirar', 'silla_armario');
  ok(await logHas('Una silla plegable con una cruz de cinta pegada a las patas.') && await logHas('Debajo del asiento: «EVENTOS · 112 · NO SACAR DE SU CRUZ».') && await flag('silla_112_vista') === true, 'Mirar la silla del armario: «EVENTOS · 112»');
  await raton('coger', 'silla_armario');
  ok(await logHas('Es mi silla. Bueno. Es la única cosa que tengo con número.'), 'Coger la silla: Brais, «la única cosa que tengo con número»');
  await R.run(['ir', 'eventos']); await idle();
  await hablarPilar();
  await clicOpcion('Creo que sé dónde está tu 112.');
  await clicOpcion('En la Sala Amazonas.');
  ok(!(await tiene('album_eventos')), 'la Sala Amazonas: tampoco');
  await hablarPilar();
  await clicOpcion('Creo que sé dónde está tu 112.');
  await clicOpcion('En el armario 27, en Sistemas.');
  ok(await tiene('album_eventos'), 'y el armario 27: el álbum');
  ok(await terminar(44), '(c) esta vía (negativa, mirar la silla, un sitio equivocado) se termina');

  // ====================================================================== (d) partidas del juego anterior
  step('Partidas del juego anterior a mitad de bloque: cargan y se terminan');
  await cargar('t3_brais');
  await jugar([42, 43, 44]);
  await guardar('t3_validado');
  await jugar([45]);
  await guardar('t3_libre');
  const viejas = [
    ['Acto III, el álbum prestado por la vía vieja (con la otra palabra oída)', 't3_brais', 44,
      NUEVAS + " st.inventory.push('album_eventos'); st.flags.oyo_descopear = true;",
      async () => ok(await flag('eventos_album_dado') === true && await flag('oyo_descopear') === undefined && await tiene('album_eventos'), '  el álbum cuenta como salvado; fuera `oyo_descopear`')],
    ['Acto III, la columna escrita con la otra palabra', 't3_libre', 46,
      NUEVAS + " st.flags.columna_kanban = 'descopeado'; st.flags.oyo_descopear = true;",
      async () => {
        ok(await flag('columna_kanban') === 'salida', '  la columna pasa a ser SALIDA EN VALOR');
        await R.run(['ir', 'pecera']); await idle(); await clearLog(); await raton('mirar', 'kanban');
        ok(await logHas('Y una nueva, a rotulador: SALIDA EN VALOR. Dentro, el pósit de Brais.') && !(await logHas('DESCOPE')), '  Mirar el kanban: SALIDA EN VALOR');
      }],
    ['Acto III, álbum validado con la otra palabra y sin «salida en valor»', 't3_validado', 45,
      NUEVAS + " st.flags.oyo_descopear = true; st.flags.rep_13 = false; delete st.dialogs['ruben.R0.discursos'];",
      async () => {
        await R.run(['ir', 'pecera']); await idle();
        await G(() => { __game.doVerb('usar', 'kanban', 'rotulador_rojo'); });
        await until(() => !!__game.currentDialogOptions(), null, 20000);
        const o = fuera(await opciones());
        ok(!o.includes('SALIDA EN VALOR') && !o.some(x => /DESCOPE/.test(x)), '  el menú, sin la palabra buena (ni la otra)');
        await G(() => __game.chooseText('Mejor no.')); await idle();
        const ab = await abuela('pecera'); const ab2 = await abuela('pecera'); const ab3 = await abuela('pecera');
        ok(ab.obj === 'columna' && ab3.bruno.includes('Sistemas: a Brais, «¿Escribiste tú los discursos de Íñigo?».'), '  la abuela manda a Brais por la frase');
        await R.run(['ir', 'cpd']); await idle();
        await R.run(['verbo', 'hablar', 'ruben']); await R.run(['opcion', '¿Escribiste tú los discursos de Íñigo?']); await R.run(['cerrar']); await idle();
        ok(await flag('rep_13') === true, '  R13, con Brais');
      }],
    ['Acto II, con la silla 113 devuelta y la croqueta dada (y opciones de Pilar ya gastadas)', 't3_a2', 39,
      NUEVAS + " st.flags.eventos_silla_devuelta = true; st.flags.eventos_croqueta = true; st.flags.ecosistema_sillas_n = 2; st.dialogs = st.dialogs || {}; st.dialogs['pilar.PE0.0'] = true; st.dialogs['pilar.PE0.4'] = true;",
      async () => {
        ok(await flag('eventos_silla_devuelta') === undefined && await flag('ecosistema_sillas_n') === 0, '  fuera la silla 113; el recuento vuelve a empezar');
        await R.run(['ir', 'eventos']); await idle(); await clearLog();
        const o = await hablarPilar();
        ok(!o.includes('¿Cuántos eventos habéis empezado este año?') && !o.includes('¿Hay catering?') && o.includes('Gracias por la croqueta.'), '  las opciones ya gastadas siguen gastadas (por id); «Gracias por la croqueta.»');
        await clicOpcion('¿Cuántas sillas hay?');
        ok(await logHas('Falta la 112. Se la llevó un señor de traje en julio. «Para un proyecto».'), '  Pilar cuenta ciento once: falta la 112');
        await salir();
        await R.run(['ir', 'catacumba']); await idle();
      }],
    ['Acto III, Brais encontrado y sin álbum (cargada dentro de Eventos)', 't3_brais', 42,
      NUEVAS + " st.room = 'eventos'; if (st.actors) delete st.actors.bruno;",
      async () => {
        await clearLog();
        await hablarPilar();
        ok(await ordenLog('...ciento diez, ciento once. La 112, sin aparecer.', '¿Vienes acreditado? Esta noche los cinco minutos son de verdad.'), '  cargada en Eventos: al hablarle, Pilar cuenta la 112 antes de saludar');
        await salir();
        await R.run(['ir', 'cpd']); await idle();
      }],
  ];
  for (const [nom, slot, desde, cambio, alCargar] of viejas) {
    await partidaVieja(slot, 't3_vieja', cambio);
    await alCargar();
    ok(await terminar(desde), `${nom}: carga y se termina`);
  }

  const errs = await G(() => __game.errors.filter(e => !e.warn).map(e => e.msg));
  ok(!errs.length, 'sin errores del motor ' + errs.join(' | '));
} catch (e) {
  failures++;
  console.log('\n  ✗ FALLO: ' + (e instanceof StepFail ? e.message : (e && e.stack) || e));
  try {
    const log = await G(() => __game.log.slice(-12).map(l => `${l.who || '—'}: ${l.text}`));
    console.log('    últimas líneas:\n      ' + log.join('\n      '));
    await shot('fallo');
  } catch (_) { /* ignore */ }
}
if (consoleErrors.length) { failures++; console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  ')); }
console.log(failures ? `\nGUION3-T3: FALLA (${failures} de ${checks})` : `\nGUION3-T3: OK (${checks} comprobaciones)`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
