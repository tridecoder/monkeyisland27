#!/usr/bin/env node
// PRUEBA DEL PAQUETE PA DE LA ENMIENDA E5 (Sala Amazonas y Vending; docs/guion2/ENMIENDA_E5.md §2.1, §2.6, §5.2, §5.4),
// con RATÓN REAL en los pasos clave. Capturas en tools/shots/e5-pa-*.png. Cubre:
//   §2.1 la «pregunta del público»: orden del día → Gervasio («…y los conectados») → Gertrudis → Usar la tele →
//   estampida y el ATASCO, que con [P11] es una escena automática (el anuncio de Maripaz y el cruasán de Jacinto; antes
//   había cuatro vías jugables); intentos fuera de orden; Esc en la escena; cargar una partida con el atasco forzado;
//   el Acto III (ni opción de Gertrudis ni tele especial); pistas de la tele («wifi y rencor», móvil «once mil»).
//   §2.6 la señal tras D4: caras al cartón, crujido con `tamb3`, megafonía a los 10, 25 y 45 s de tiempo QUIETO (el ratón
//   moviéndose no la impide; con un menú abierto no suena), Gervasio M34 y el empujón hasta el final.
//   node tools/test-e5-pa.mjs            (≈ 2 min; usa tiempo real para los relojes)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });
const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const consoleErrors = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Acto II con el café a Aurora hecho (paso 16) y lo anterior: la Sala con Gervasio, Mercados y Maripaz
const FLAGS_A2 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, acto_2_iniciado: true, silla_libre: true,
  gertrudis_saludada: true, cafetera_viral: true, cafetera_viral_vista: true, chaqueta_cogida: true, chaqueta_en_lector: true,
  aurora_conto_pasos: true, aurora_hablo_fax: true, chisme_indice: 4, cafetera_en_directo: true, cms_vivo: true,
  office_e53_visto: true, office_agotada: true };

async function open(flags = FLAGS_A2, room = 'sala_amazonas', entry = 'pajarera') {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 600 } });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  await page.goto(base + '?room=pecera');
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  const G = (fn, a) => page.evaluate(fn, a);
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); __game.giveItem('movil'); }, flags);
  const T = { ctx, page, G };
  await goto(T, room, entry);
  await G(() => __game.clearLog());
  return T;
}
async function goto({ G }, room, entry) {
  await G(() => __game.skipText(true));
  await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipSpeech(); __game.game.speeches.length = 0; });     // (el texto sigue en modo rápido)
}
/** Sin modo rápido: espera `cond` saltando los globos que no sean `keep` (texto que se quiere ver). */
async function saltando(G, cond, keep = null, ms = 40000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const r = await G(([c, k]) => { const g = __game.game; if (new Function('return ' + c)()) return true;
      if (g.speeches.length && !(k && g.speeches.some(s => String(s.text).includes(k)))) __game.skipSpeech(); return false; }, [cond, keep]);
    if (r) return true;
    await sleep(80);
  }
  return false;
}
const shot = (page, name) => page.screenshot({ path: path.join(shots, `e5-pa-${name}.png`) });
const until = async (G, fn, arg, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(60); } return false; };
const flag = (G, k) => G((k) => __game.getFlag(k), k);
const logHas = (G, t) => G((t) => __game.log.some(l => String(l.text).includes(t)), t);
const logCount = (G, t) => G((t) => __game.log.filter(l => String(l.text).includes(t)).length, t);
const idle = (G) => until(G, () => !__game.state().busy && !__game.game.speeches.some(s => s.blocking), null, 60000);
/** Texto rápido: salta los globos que vayan saliendo mientras se espera (para no tardar el texto real). */
const rapido = (G, on = true) => G((on) => __game.skipText(on), on);

/** Clic real: verbo y después el objetivo. */
async function clic({ page, G }, verbo, id) {
  const vp = await G((v) => __game.verbPos(v), verbo);
  await page.mouse.click(vp.x, vp.y); await sleep(80);
  const c = await G((id) => __game.screenPos(id), id);
  if (!c) { ok(false, `clic: ${id} no está en pantalla`); return; }
  await page.mouse.click(c.x, c.y); await sleep(120);
}
const opciones = (G) => G(() => __game.currentDialogOptions() || []);
async function clicOpcion({ page, G }, txt) {
  await until(G, () => !!__game.game.choice, null, 15000);
  await sleep(250);
  const i = (await opciones(G)).findIndex(o => o.includes(txt));
  if (i < 0) return false;
  const p = await G((i) => __game.optionPos(i), i);
  await page.mouse.click(p.x, p.y + 3);
  return true;
}
async function cerrarDialogo(G) {
  for (let k = 0; k < 6 && await G(() => !!__game.game.choice); k++) {
    const o = await opciones(G);
    const i = o.findIndex(x => /^(Me voy|Nada|Luego)/.test(x));
    await G((i) => __game.chooseDialog(i < 0 ? __game.currentDialogOptions().length - 1 : i), i);
    await sleep(100);
  }
  await idle(G);
}
/** Prepara la Sala con la pregunta ya enviada (por ESTADO) y abre el atasco con la tele (texto rápido, sin modo rápido
 *  durante el atasco: el control vuelve al jugador). */
async function hastaAtasco(T) {
  const { G } = T;
  await G(() => { __game.setFlag('sala_amazonas_orden_visto', true); __game.setFlag('sala_becario_sin_turno', true); __game.setFlag('gertrudis_pregunta', true); });
  await rapido(G, false);
  await G(() => { __game.game.runScript(api => api.scene('sala_tele_gertrudis'), { label: 'test tele' }); });
  return hastaFinAtasco(G);
}
/** [P11] El atasco es una escena automática: se salta el texto hasta que la reunión acaba y el control vuelve. Devuelve si
 *  en algún momento el jugador tuvo el control con el atasco abierto (no debe). */
async function hastaFinAtasco(G) {
  let abierto = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 90000) {
    const st = await G(() => { if (__game.game.speeches.length) __game.skipSpeech(); return { at: !!__game.getFlag('sala_amazonas_atasco'), fin: !!__game.getFlag('reunion_terminada'), busy: __game.state().busy, cut: __game.game.cutscene > 0 }; });
    if (st.at && !st.busy && !st.cut) abierto = true;
    if (st.fin && !st.busy && !st.cut) break;
    await sleep(80);
  }
  return abierto;
}
// [P11] el atasco ya no es jugable: una sola salida, la escena del anuncio de Maripaz (con el medio cruasán de Jacinto)
const viaLines = {
  empujar: 'Les doy un empujoncito.', hablar: '¿Y la próxima reunión, cuándo es?', anuncio: '¡Un momento! ¡Antes de salir, un anuncio',
};
async function comprobarVia(T, via) {
  const { G } = T;
  await rapido(G, true);
  await until(G, () => __game.getFlag('reunion_terminada') && !__game.state().busy, null, 60000);
  const n = {}; for (const [k, t] of Object.entries(viaLines)) n[k] = await logCount(G, t);
  ok(n[via] === 1 && Object.entries(n).every(([k, c]) => k === via || c === 0) && await logCount(G, '¡Ese medio cruasán es mío!') === 1, `vía ${via}: el anuncio (y el cruasán de Jacinto), sin las otras vías ${JSON.stringify(n)}`);
  const st = await G(() => { const s = __game.state(); return { rt: s.flags.reunion_terminada, est: s.flags.sala_amazonas_estampida, at: s.flags.sala_amazonas_atasco,
    merc: ['mercados_1', 'mercados_2', 'mercados_3'].filter(id => s.actors[id] && s.actors[id].room === 'sala_amazonas'), gerv: s.actors.gervasio_acta && s.actors.gervasio_acta.room,
    noSave: __game.game.noSave, tele: __game.game.getObjState('tele_amazonas').state, bot: __game.game.getObjState('botellines').state, reg: __game.game.salaAtasco }; });
  ok(st.rt && st.est && !st.at && !st.merc.length && st.gerv !== 'sala_amazonas' && !st.noSave, `vía ${via}: reunión terminada, Mercados y Gervasio fuera, atasco cerrado, se puede guardar ${JSON.stringify(st)}`);
  ok(st.reg && st.reg.regreso === true, `vía ${via}: Jacinto vuelve a por el cruasán (${JSON.stringify(st.reg)})`);
  ok(await logHas(G, 'Se levanta la sesión. Lo hablamos.') && await logHas(G, '¿Usted no huye?'), `vía ${via}: «Se levanta la sesión» y Maripaz`);
  ok((st.tele || 'normal') === 'normal' && st.bot === 'tumbados', `vía ${via}: la tele vuelve a lo de siempre y los botellines quedan tumbados (${st.tele}, ${st.bot})`);
}

try {
  // ================================================================ §2.1 orden inverso y pistas
  console.log('\n§2.1 (e) intentos fuera de orden');
  {
    const T = await open();
    const { G } = T;
    await G(() => __game.doVerb('hablar', 'gervasio_acta'));
    // [bloqueos] la pregunta ya no pide Mirar el orden del día (era una puerta oculta): está siempre
    ok((await opciones(G)).some(o => o.includes('siguientes pasos')), 'sin Mirar el orden del día, Gervasio ya ofrece la pregunta (bloqueos)');
    await cerrarDialogo(G);
    await G(() => __game.doVerb('usar', 'tele_amazonas'));
    ok(!(await logHas(G, 'wifi y rencor')) && !(await flag(G, 'sala_amazonas_atasco')) && await logHas(G, 'Celestino le narra'), 'tele antes de Gervasio: la rotación de siempre');
    await G(() => __game.doVerb('usar', 'tele_amazonas', 'movil'));
    ok(!(await logHas(G, 'once mil')), 'móvil con la tele antes del «sin turno»: el genérico');
    await goto(T, 'office', 'pecera');
    await G(() => __game.doVerb('hablar', 'gertrudis'));
    ok(!(await opciones(G)).some(o => o.includes('siguientes pasos')), 'Gertrudis antes que Gervasio: la opción no está');
    await cerrarDialogo(G);
    await T.ctx.close();
  }

  console.log('\n§2.1 (a-d) orden del día, Gervasio (clic), pistas de la tele, Gertrudis (clic)');
  {
    const T = await open();
    const { page, G } = T;
    await clic(T, 'mirar', 'orden_del_dia'); await idle(G);
    ok(await flag(G, 'sala_amazonas_orden_visto'), 'clic en Mirar orden del día → sala_amazonas_orden_visto');
    await clic(T, 'usar', 'orden_del_dia'); await idle(G);
    ok(await logHas(G, 'Para tocar el punto 3 hay que decirlo en voz alta, a quien preside.'), 'Usar orden del día: D02');
    await clic(T, 'hablar', 'gervasio_acta');
    ok(await clicOpcion(T, 'siguientes pasos?'), 'clic en «Bueno... ¿y cuáles son los siguientes pasos?»');
    await rapido(G, true); await idle(G);
    const s1 = await G(() => ({ st: __game.getFlag('sala_becario_sin_turno'), rt: __game.getFlag('reunion_terminada'), dlg: !!__game.game.choice }));
    ok(await logHas(G, 'Pregunta la mesa... y los conectados.') && s1.st && !s1.rt && !s1.dlg, `«…y los conectados», sin turno, sin reunion_terminada, diálogo cerrado ${JSON.stringify(s1)}`);
    ok(await logCount(G, 'Se toma nota. No la tomo yo') === 0, '`return exit`: no se gasta «Me voy.»');
    await G(() => { __game.clearLog(); return __game.doVerb('hablar', 'gervasio_acta'); });
    // [bloqueos] repetida, la opción sigue; [coherencia] a la 2.ª Gervasio señala la pantalla (a la 3.ª, la tele la recoge)
    ok(await G(() => __game.chooseText('siguientes pasos')) !== false && await logHas(G, 'Las preguntas de los conectados entran por la pantalla, cuando hay señal.') && !(await G(() => __game.getFlag('reunion_terminada'))), 'tras el «sin turno», la opción sigue: la 2.ª, Gervasio señala la pantalla (bloqueos, coherencia)');
    await cerrarDialogo(G);
    await rapido(G, false);
    await clic(T, 'mirar', 'tele_amazonas');   // E7 F2: la pista, con Mirar (Usar abre el árbol de la tele)
    await until(G, () => __game.game.getObjState('tele_amazonas').state === 'buscando', null, 8000);
    await sleep(300);
    await shot(page, 'tele-buscando');
    await rapido(G, true); await idle(G);
    ok(await logHas(G, 'Alguien con wifi y rencor la encontraría enseguida.'), 'Mirar tele con «sin turno»: «wifi y rencor» (E7 F2)');
    await G(() => __game.doVerb('usar', 'tele_amazonas', 'movil'));
    ok(await logHas(G, 'Los once mil son de la cafetera.'), 'Usar móvil con la tele: «once mil»');
    // el puntito verde (cafetera en redes, reunión en marcha): se pinta 450 ms de cada 4 s
    await goto(T, 'office', 'pecera');
    await clic(T, 'hablar', 'gertrudis');
    ok(await clicOpcion(T, '¿Y cuáles son los siguientes pasos?'), 'Gertrudis (con office_agotada y E-53 vistos): clic en la opción');
    await rapido(G, true); await idle(G);
    ok(await flag(G, 'gertrudis_pregunta') && await logHas(G, 'LA MANDO A LA PRÓXIMA PANTALLA QUE ME SINTONICE'), '→ gertrudis_pregunta y el LCD');
    ok(await G(() => __game.getFlag('office_emision') === 1 && !__game.game.choice), 'piloto EN DIRECTO puesto y diálogo cerrado');
    await G(() => __game.doVerb('hablar', 'gertrudis'));
    ok(!(await opciones(G)).some(o => o.includes('siguientes pasos')), 'la opción de Gertrudis no se repite');
    await cerrarDialogo(G);

    console.log('\n§2.1 (f) clic en la tele → Gertrudis en directo, estampida, atasco con el control devuelto');
    await goto(T, 'sala_amazonas', 'pajarera');
    await G(() => __game.clearLog());
    await rapido(G, false);
    await clic(T, 'usar', 'tele_amazonas');
    await saltando(G, "__game.game.speeches.some(s => String(s.text).includes('PREGUNTA DEL PÚBLICO'))");
    await sleep(700);
    await shot(page, 'tele-gertrudis');
    await saltando(G, "__game.game.speeches.some(s => String(s.text).startsWith('CONVOCADA'))", 'PREGUNTA DEL');
    await sleep(700);
    await shot(page, 'tele-convocada');
    // [P11] el atasco, escena automática: el control no vuelve con los tres encajados; Maripaz anuncia, plop, cruasán
    await saltando(G, "__game.getFlag('sala_amazonas_atasco')");
    await sleep(500);
    await shot(page, 'atasco');
    const abierto = await hastaFinAtasco(G);
    ok(await logHas(G, 'PREGUNTA DEL PÚBLICO: ¿Y CUÁLES SON LOS SIGUIENTES PASOS?') && await logHas(G, '¡Se ve! ¡Por fin se ve la pantalla!'), 'Rogelio «¡Se ve!» y Gertrudis por la tele');
    ok(await logHas(G, '¡Yo soy de Bolsa y de Mercados! ¡Tengo doble prioridad!'), 'las tres líneas del atasco');
    ok(!abierto, '[P11] el jugador no recupera el control con el atasco abierto: se resuelve solo');
    await comprobarVia(T, 'anuncio');
    await sleep(300);
    await shot(page, 'tras-atasco');
    // tras la estampida, todo como hoy
    await G(() => __game.clearLog());
    await G(() => __game.doVerb('usar', 'tele_amazonas'));
    ok(!(await flag(G, 'sala_amazonas_atasco')) && !(await logHas(G, 'PREGUNTA DEL PÚBLICO')), 'tele con la pregunta enviada, tras la estampida: la rotación de siempre');
    await G(() => __game.doVerb('hablar', 'maripaz_remitido'));
    ok(await G(() => !!__game.game.choice || !!__game.game.detalle), 'Maripaz, tras la estampida: su pop-up / su menú (D1 disponible)');
    await T.ctx.close();
  }

  // [P11] fuera las vías del atasco (empujar, cruasán, hablar, el anuncio a los 20 s): (g) y las «otras puertas» se van
  console.log('\n§2.1 [P11] saltar la escena de la tele con Esc: el atasco se resuelve igual (es escena)');
  {
    const T = await open();
    const { page, G } = T;
    await G(() => { __game.setFlag('sala_amazonas_orden_visto', true); __game.setFlag('sala_becario_sin_turno', true); __game.setFlag('gertrudis_pregunta', true); });
    await rapido(G, false);
    await G(() => { __game.game.runScript(api => api.scene('sala_tele_gertrudis'), { label: 'test tele (Esc)' }); });
    await until(G, () => __game.game.cutscene > 0, null, 5000);
    await sleep(400);
    await page.keyboard.press('Escape');
    const abierto = await hastaFinAtasco(G);
    const s = await G(() => ({ at: __game.getFlag('sala_amazonas_atasco'), rt: __game.getFlag('reunion_terminada'), ns: __game.game.noSave,
      merc: ['mercados_1', 'mercados_2', 'mercados_3'].filter(id => __game.game.actors[id].room === 'sala_amazonas').length }));
    ok(!abierto && !s.at && s.rt && !s.ns && s.merc === 0, `Esc en la escena: la reunión termina igual, sin control con el atasco abierto, se puede guardar ${JSON.stringify(s)}`);
    await T.ctx.close();
  }

  console.log('\n§2.1 (h) cargar una partida con el atasco forzado → resuelto en silencio');
  {
    const T = await open();
    const { G } = T;
    await G(() => { __game.setFlag('sala_becario_sin_turno', true); __game.setFlag('gertrudis_pregunta', true); __game.setFlag('sala_amazonas_atasco', true); __game.save(3); });
    await G(() => { __game.setFlag('sala_amazonas_atasco', false); __game.clearLog(); });
    await G(() => __game.load(3));
    await idle(G);
    const s = await G(() => { const s = __game.state(); return { at: s.flags.sala_amazonas_atasco, est: s.flags.sala_amazonas_estampida, rt: s.flags.reunion_terminada,
      merc: ['mercados_1', 'mercados_2', 'mercados_3', 'gervasio_acta'].filter(id => s.actors[id] && s.actors[id].room === 'sala_amazonas'), bot: __game.game.getObjState('botellines').state, log: __game.log.filter(l => l.who !== 'aviso').length }; });
    ok(!s.at && s.est && s.rt && !s.merc.length && s.bot === 'tumbados' && s.log === 0, `cargada: atasco resuelto, Mercados y Gervasio fuera, botellines tumbados, sin líneas ${JSON.stringify(s)}`);
    await T.ctx.close();
  }

  console.log('\n§2.1 (i) Acto III: ni opción de Gertrudis ni tele especial');
  {
    const T = await open({ ...FLAGS_A2, acto_3_iniciado: true, sala_becario_sin_turno: true, gertrudis_pregunta: false, reunion_terminada: true, sala_abierta: true }, 'office', 'pecera');
    const { G } = T;
    await G(() => __game.doVerb('hablar', 'gertrudis'));
    ok(!(await opciones(G)).some(o => o.includes('siguientes pasos')), 'Acto III: Gertrudis no ofrece la pregunta');
    await cerrarDialogo(G);
    await G(() => __game.setFlag('gertrudis_pregunta', true));
    await goto(T, 'sala_amazonas', 'pajarera');
    await G(() => __game.clearLog());
    await G(() => __game.doVerb('usar', 'tele_amazonas'));
    ok(await logHas(G, 'No se enciende.') && !(await flag(G, 'sala_amazonas_atasco')), 'Acto III: la tele, lo de hoy');
    await T.ctx.close();
  }

  // ================================================================ §2.6 la señal tras el clímax
  console.log('\n§2.6 señal tras D4: caras al cartón, crujido, megafonía a 10/25/45 s quietos');
  {
    const F3 = { ...FLAGS_A2, acto_3_iniciado: true, reunion_terminada: true, sala_abierta: true, ruben_libre: true, ruben_encontrado: true,
      sala_amazonas_climax_visto: true, climax_entrada: true, duelo_inigo_ganado: true, duelo_maripaz_ganado: true, casilla_hueco: true };
    const T = await open(F3);
    const { page, G } = T;
    await rapido(G, false);
    await G(() => { const g = __game.game; g.__sfx = []; const o = g.audio.sfx.bind(g.audio); g.audio.sfx = (n, ...r) => { g.__sfx.push([n, Math.round(g.time)]); return o(n, ...r); }; });
    // Brais en la sala, como tras el remate A; luego el onWin de Íñigo (su línea + las caras)
    await G(() => __game.game.runScript(async api => {
      api.placeActor('ruben', 'sala_amazonas', 276, 130, 'left');
      api.faceActor('inigo_sinergia', 'right'); api.faceActor('gervasio_acta', 'right');
      await api.game.room.def.duels.inigo.onWin(api);
    }, { label: 'test onWin' }));
    await saltando(G, "!__game.state().busy");
    await G(() => { __game.skipSpeech(); __game.game.speeches.length = 0; __game.clearLog(); });
    const caras = await G(() => { const g = __game.game, L = g.actors.lector_medio; return ['inigo_sinergia', 'gervasio_acta', 'ruben'].map(id => { const a = g.actors[id]; return [id, a.dir, Math.sign(L.x - a.x)]; }); });
    ok(caras.every(([, d, s]) => d === (s < 0 ? 'left' : 'right')), `onWin: Íñigo, Gervasio y Brais miran al cartón ${JSON.stringify(caras)}`);
    await page.mouse.move(400, 250);
    // con un menú abierto (12 s) no suena nada: el tiempo no cuenta
    await G(() => { __game.game.__pc = __game.game.choose(['Uno', 'Dos'], { escape: 1 }); });
    await sleep(12000);
    ok(await logCount(G, 'Balón suelto') === 0, 'con un menú abierto, 12 s: ninguna megafonía');
    await G(() => { __game.game.choice.resolve(1); });
    await sleep(200);
    // 10 s quietos con el ratón moviéndose
    const t0 = Date.now();
    let k = 0, shotCaras = false;
    while (Date.now() - t0 < 11500 && !(await logHas(G, 'Balón suelto'))) {
      await page.mouse.move(300 + (k++ % 30) * 8, 420 + (k % 7) * 4); await sleep(100);
      if (!shotCaras && Date.now() - t0 > 2000) {
        await until(G, () => { const g = __game.game; return g.actors.lector_medio && g.room.def.id === 'sala_amazonas' && (Math.floor((g.time % 3200) / 160) === 2); }, null, 4000);
        await shot(page, 'caras-carton'); shotCaras = true;
      }
    }
    const meg = await G(() => __game.log.find(l => String(l.text).includes('Balón suelto')));
    ok(!!meg && meg.tag === 'MEGAFONÍA' && meg.who === 'celestino', `10 s quietos (con el ratón moviéndose): «Balón suelto…» por MEGAFONÍA (${Date.now() - t0} ms)`);
    await sleep(1200);
    await shot(page, 'megafonia-10s');
    const cr = await G(() => __game.game.__sfx.filter(([n]) => n === 'crujido').length);
    ok(cr >= 2, `crujido con el fotograma tamb3 (${cr} veces)`);
    // Gervasio M34 (rompe la quietud un momento: no pasa nada)
    await rapido(G, true);
    await G(() => __game.doVerb('hablar', 'gervasio_acta'));
    await rapido(G, false);
    ok(await logHas(G, 'Lo que diga el Lector Medio. Que se está... Se está moviendo.'), 'Gervasio tras D4: M34');
    await G(() => { __game.skipSpeech(); __game.game.speeches.length = 0; });
    ok(await until(G, () => __game.log.some(l => String(l.text).startsWith('Ahí sigue. De pie')), null, 22000), '25 s: «Ahí sigue…»');
    ok(await until(G, () => __game.log.some(l => String(l.text).includes('Que alguien le dé un empujón')), null, 30000), '45 s: «…Que alguien le dé un empujón…»');
    ok(await logCount(G, 'Balón suelto') === 1, 'cada megafonía, una sola vez');
    // el Lector asiente sin globo
    await G(() => __game.clearLog());
    await rapido(G, true);
    await G(() => __game.doVerb('hablar', 'lector_medio'));
    ok(!(await G(() => __game.log.some(l => l.who === 'lector_medio'))) && await logHas(G, '...Pues ya está decidido.'), 'Hablar al Lector: asiente sin globo; Gervasio decide');
    // el empujón: la cadena final, intacta (juego terminado)
    await rapido(G, true);
    await G(() => { __game.doVerb('empujar', 'lector_medio'); });
    ok(await until(G, () => { const s = __game.state(); return (s.flags && s.flags.juego_terminado) || (s.finished && s.finished.flags.juego_terminado); }, null, 90000), 'Empujar al Lector → final (juego_terminado)');
    ok(await logHas(G, 'Con lo que nos deben hay para un contrato.') && !(await logHas(G, 'para un contrato. Con coma.')), 'C84 en el clímax');
    await T.ctx.close();
  }
} catch (e) {
  failures++; console.log('  ✗ excepción: ' + (e && e.stack || e));
} finally {
  const errs = consoleErrors.filter(e => !/favicon/.test(e));
  ok(errs.length === 0, `sin errores de consola${errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''}`);
  await browser.close();
  server.close();
  console.log(`\n${checks - failures}/${checks} comprobaciones OK`);
  process.exit(failures ? 1 : 0);
}
