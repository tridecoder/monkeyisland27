#!/usr/bin/env node
// PRUEBA DEL PAQUETE PC DE LA ENMIENDA E5 (Sistemas y Vestíbulo: docs/guion2/ENMIENDA_E5.md §2.2.4, §2.3, §2.4 y §4), con
// RATÓN REAL (clic en verbo, clic en el objeto, clic en la opción del menú; clics para pasar los globos). `window.__game`
// solo se usa para preparar el estado (flags del acto) y para comprobar resultados. Capturas en tools/shots/e5-pc-*.png.
// Cubre:
//   1 regletero: Mirar → plano detalle con las cinco etiquetas; R-1, R-2, R-4 desenchufan un segundo, no ponen `cms_vivo`
//     y suben `cpd_regleta_mal_n`; R-5 no se tira (ni sube); «Mejor no.» nada; R-3 → `cms_vivo`, sin «¡ESTAMOS CIEGOS!»
//     por la rejilla ni «Ya me han abierto otro ticket»; antes del apagón (apagon_n = 0) también vale
//   2 ticket 0.441: sin pegatina, Paco dice que no dos veces (dos líneas distintas) y no da el manual; con la pegatina,
//     «Ticket 0.441» → manual y sus dos líneas; sin el CMS, la opción no está
//   3 armario 27: Acto II, Tirar papel ×2 → las dos líneas, sin `ruben_encontrado`; Acto III: al entrar, estado `corre` y
//     la línea una vez (otra entrada, no); Mirar papel y Tirar armario con el texto nuevo; Tirar papel → `revelacion_ruben`
//   4 guardar/cargar a mitad: tras un fallo del regletero, cargar devuelve el contador y la regleta encendida; en el III,
//     cargar con el papel corriendo no repite la línea ni lo para
//   5 Vestíbulo: textos C01-C10, M12-M14 y M18 (sin «chaval» en el Ibex/saludos; sin tarjeta en la frente)
//   node tools/test-e5-pc.mjs
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
class Fail extends Error {}
const fail = (m) => { throw new Fail(m); };

const ACTO2 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, acto_2_iniciado: true, silla_libre: true,
  gertrudis_saludada: true, cafetera_viral: true, cafetera_viral_vista: true, chaqueta_cogida: true, chaqueta_en_lector: true,
  aurora_conto_pasos: true, aurora_hablo_fax: true };

const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const G = (fn, a) => page.evaluate(fn, a);
const wait = (ms) => page.waitForTimeout(ms);
const st = () => G(() => __game.state());
const flag = (k) => G(k => __game.getFlag(k), k);
const norm = s => String(s).toLowerCase().replace(/[«»"“”'’]/g, '').replace(/\s+/g, ' ').trim();
const shot = (name) => page.screenshot({ path: path.join(shots, `e5-pc-${name}.png`) });
const logTexts = () => G(() => __game.log.map(l => l.text));
const logHas = async (s) => (await logTexts()).some(t => String(t).includes(s));
const logCount = async (s) => (await logTexts()).filter(t => String(t).includes(s)).length;

// ------------------------------------------------------------------ ratón real (como tools/play-mouse.mjs)
const SAFE = [302, 147];
async function vclick(x, y, button = 'left') {
  const p = await G(([x, y]) => __game.virtualToClient(x, y), [x, y]);
  await page.mouse.move(p.x, p.y); await wait(35);
  await page.mouse.click(p.x, p.y, { button }); await wait(45);
}
/** Deja correr el juego pasando cada globo con un clic real; vuelve con menú abierto o con el juego libre. */
async function settle(timeout = 60000, onDetalle = null) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const s = await G(() => { const g = __game.game; return { mode: g.mode, busy: g.busy > 0 || !!g.acting, choice: !!g.choice, speaking: g.speeches.filter(x => x.blocking).length, detalle: g.detalle ? g.detalle.titulo : null }; });
    if (s.detalle && onDetalle) { const f = onDetalle; onDetalle = null; await f(s.detalle); }
    if (s.choice) return s;
    if (!s.busy) { await wait(60); if (!(await G(() => __game.game.busy || __game.game.acting || __game.game.choice))) return s; continue; }
    if (s.speaking) { await wait(140); await vclick(...SAFE); continue; }
    await wait(80);
  }
  fail('settle: tiempo agotado');
}
async function pointFor(id) {
  const r = await G((id) => {
    const g = __game.game, cam = Math.round(g.camX);
    const o = __game.objects().find(o => o.id === id && o.visible !== false);
    if (!o) return { missing: true };
    const cx = o.x + o.w / 2; let best = null, bd = Infinity;
    for (let y = Math.max(0, Math.floor(o.y)); y < Math.min(144, o.y + o.h); y++) for (let x = Math.max(cam, Math.floor(o.x)); x < Math.min(cam + 320, o.x + o.w); x++) {
      const t = g.pickAt(x - cam, y);
      if (t && t.id === id) { const d = Math.hypot(x - cx, y - (o.y + o.h * 0.5)); if (d < bd) { bd = d; best = [x - cam, y]; } }
    }
    return best ? { pt: best } : { covered: true };
  }, id);
  if (r.missing) fail(`«${id}» no está en la sala`);
  if (r.covered) fail(`«${id}» está tapado: ningún píxel lo elige`);
  return r.pt;
}
async function clickVerb(v) { const p = await G(v => { const i = __game.game.verbs.findIndex(x => x.id === v); return [[6, 57, 107][Math.floor(i / 3)] + 10, [157, 171, 185][i % 3] + 6]; }, v); await vclick(...p); }
async function verbOn(v, id, onDetalle) { await settle(); const pt = await pointFor(id); await clickVerb(v); await vclick(...pt); return settle(60000, onDetalle); }
async function chooseOption(want) {
  await settle();
  for (let k = 0; k < 30; k++) {
    const r = await G((want) => {
      const g = __game.game, ch = g.choice; if (!ch) return { none: true };
      const nrm = s => String(s).toLowerCase().replace(/[«»"“”'’]/g, '').replace(/\s+/g, ' ').trim();
      const i = ch.options.findIndex(o => nrm(o).includes(nrm(want)));
      if (i < 0) return { notfound: ch.options };
      const lines = ch.layout; if (!lines) return { wait: true };
      if (ch.escape != null && g.realTime - ch.t0 < 320) return { wait: true };
      const li = lines.findIndex(l => l.opt === i), sc = ch.scroll || 0;
      if (li < sc) return { arrow: [310, 152] };
      if (li >= sc + 5) return { arrow: [310, 186] };
      return { pt: [24, 145 + (li - sc) * 10 + 6] };
    }, want);
    if (r.none) fail(`no hay opciones en pantalla para «${want}»`);
    if (r.notfound) fail(`no existe la opción «${want}»: ${JSON.stringify(r.notfound)}`);
    if (r.wait) { await wait(60); continue; }
    if (r.pt) { await vclick(...r.pt); return settle(); }
    await vclick(...r.arrow);
  }
  fail(`no llego a la opción «${want}»`);
}
async function options() { await settle(); return G(() => __game.currentDialogOptions()); }
async function closeMenu() {
  for (let k = 0; k < 4; k++) {
    const o = await options(); if (!o) return;
    const f = o.find(x => /^me voy|^ahora vuelvo|^mejor no/i.test(norm(x)));
    if (!f) fail('sin despedida: ' + JSON.stringify(o));
    await chooseOption(f);
  }
}
/** Partida nueva en Sistemas con los flags dados (sin escenas de entrada que tapen). */
async function fresh(flags, room = 'cpd') {
  await page.goto(base + '?room=vestibulo');
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); }, flags);
  await G(([r]) => __game.gotoRoom(r, 'ascensor'), [room]);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipText(false); __game.clearLog(); });
}

try {
  // ================================================================ 1 · el regletero
  console.log('§2.2.4 El regletero (Acto II, antes del apagón: apagon_n = 0)');
  await fresh(ACTO2);
  ok((await flag('apagon_n')) ? false : true, 'antes del apagón (sin gate: el regletero funciona igual)');
  const nombre = await G(() => __game.objects().find(o => o.id === 'regleta_r3').name);
  ok(nombre === 'regletero', `el objeto conserva el id regleta_r3 y se llama «${nombre}»`);
  await shot('regletero-sala');
  let det = null;
  await verbOn('mirar', 'regleta_r3', async (t) => { det = t; await wait(500); await shot('regletero'); });
  ok(det === 'REGLETERO', `Mirar → plano detalle «${det}» con las cinco etiquetas (captura e5-pc-regletero.png)`);
  ok(await logHas('Cinco regletas: NÓMINAS, ASCENSOR, un pósit, GERTRUDIS y NO TOCAR NUNCA.') && await logHas('«ni aunque lo diga el ticket 3»'), 'Mirar: las dos líneas nuevas (D08)');

  const fallos = [
    ['R-1', 'Esa es la de las nóminas. Si la tocas, no cobra nadie. Tú tampoco.', 1],
    ['R-2', '¡Ascensor parado en mitad de la jugada! ¡Tiempo muerto!', 2],
    ['R-4', 'E-55: UN SEGUNDO SIN CORRIENTE. ANOTADO CON RENCOR.', 3],
    ['R-5', 'Pone «NUNCA». Paco la mira con ternura. No la toco.', 3],
  ];
  let primero = true;
  for (const [r, linea, n] of fallos) {
    await verbOn('tirar', 'regleta_r3');
    const o = await options();
    if (primero) {
      ok(o && o.length === 6 && o[2] === 'R-3 · (un pósit tapa la etiqueta)' && o[5] === 'Mejor no.', `Tirar → menú de seis: ${JSON.stringify(o)}`);
      ok((await st()).detalle && (await st()).detalle.titulo === 'REGLETERO', 'con el menú abierto, el plano detalle sigue a la vista');
      await shot('regletero-menu'); primero = false;
    }
    let apagada = null;
    const pollOff = (async () => { for (let i = 0; i < 40 && apagada == null; i++) { const v = await G(async () => (await import('./content/rooms/art/cpd.art.js')).REGLETERO.off); if (v) apagada = v; await wait(50); } })();
    await chooseOption(r);
    await pollOff;
    const s = await st();
    ok(!s.flags.cms_vivo && (s.flags.cpd_regleta_mal_n || 0) === n && await logHas(linea),
      `${r}: «${linea.slice(0, 40)}…», sin cms_vivo, cpd_regleta_mal_n = ${s.flags.cpd_regleta_mal_n}${r !== 'R-5' ? ` (se apagó la ${apagada} un segundo)` : ''}`);
    if (r === 'R-5') ok(apagada == null, 'R-5: no se tira');
    else ok(apagada === Number(r.slice(2)), `${r}: su piloto se apaga y se vuelve a enchufar`);
    ok(s.objects.regleta_r3 ? s.objects.regleta_r3.state === 'encendida' : true, `${r}: la R-3 sigue encendida`);
  }
  await verbOn('tirar', 'regleta_r3');
  await chooseOption('Mejor no.');
  ok(!(await flag('cms_vivo')) && (await flag('cpd_regleta_mal_n')) === 3, '«Mejor no.»: nada');

  // ================================================================ 4a · guardar/cargar a mitad del regletero
  console.log('\n§4 Guardar y cargar a mitad del regletero');
  await G(() => __game.save('e5pc'));
  await verbOn('tirar', 'regleta_r3');
  await G(() => __game.clearLog());
  await chooseOption('R-3');
  let s = await st();
  ok(s.flags.cms_vivo && s.objects.regleta_r3.state === 'apagada', 'R-3 → cms_vivo y la regleta apagada');
  ok(await logHas('CORO: ¡Ha sido Diseño!') && await logHas('Trescientos dieciocho tickets nuevos') && await logHas('Tengo un hueco. Uno.'), 'R-3: el coro por la rejilla, los +318 y Paco que se gira');
  ok(!(await logHas('ESTAMOS CIEGOS')) && !(await logHas('Ya me han abierto otro ticket')) && !(await logHas('No sé qué apaga esto')), 'R-3: sin la megafonía de Yoli, sin «Ya me han abierto…» ni «No sé qué apaga esto…» (D10-D12)');
  await G(() => __game.clearLog());
  await verbOn('mirar', 'regleta_r3');
  ok(await logHas('El regletero. La del pósit, apagada.') && await logHas('Arriba, la Redacción trabaja a ciegas.'), 'Mirar con la R-3 apagada (D09, C42)');
  await verbOn('cerrar', 'regleta_r3');
  ok(await logHas('Arriba ya se han acostumbrado'), 'Cerrar con la R-3 apagada: la de hoy');
  await verbOn('tirar', 'regleta_r3');
  ok(!(await st()).dialog && await logHas('Ya está apagada.'), 'Tirar otra vez: sin menú, la de hoy');
  await G(() => __game.load('e5pc'));
  s = await st();
  ok(!s.flags.cms_vivo && s.flags.cpd_regleta_mal_n === 3 && (!s.objects.regleta_r3 || s.objects.regleta_r3.state === 'encendida'), 'cargar: sin cms_vivo, tres fallos y la R-3 encendida');
  await G(() => __game.clearLog());
  await verbOn('cerrar', 'regleta_r3');
  ok(await logHas('Ya está cerrado. Cinco bridas lo dicen.'), 'Cerrar (C43)');

  // ================================================================ 2 · el ticket 0.441
  console.log('\n§2.3 Paco y el ticket 0.441');
  await fresh({ ...ACTO2 });
  await verbOn('hablar', 'paco_ticket');
  let o = await options();
  ok(!o.some(x => /fax/i.test(x)), `sin el CMS (nodo P0), ninguna opción del fax: ${JSON.stringify(o)}`);
  await closeMenu();
  await G(() => { __game.setFlag('cms_vivo', true); __game.setFlag('cpd_cms_sumado', true); __game.setFlag('cpd_paco_cms_dicho', true); });
  await verbOn('hablar', 'paco_ticket');
  o = await options();
  ok(o.includes('¿Sabes algo del fax de la Redacción de papel?') && !o.some(x => x.startsWith('Ticket 0.441')), 'con el CMS y sin pegatina: la pregunta vaga, no la del número');
  await chooseOption('¿Sabes algo del fax');
  ok(await logHas('¿Qué fax? Sin número de ticket, para mí no hay fax.'), '1.ª negativa');
  await chooseOption('¿Sabes algo del fax');
  ok(await logHas('Todo lo que mantengo lleva mi pegatina. Ese fax también.'), '2.ª negativa (empuja: «pegatina»)');
  await chooseOption('¿Sabes algo del fax');
  ok(await logCount('Todo lo que mantengo lleva mi pegatina') === 2, '3.ª: repite la segunda');
  s = await st();
  ok(!s.inventory.includes('manual_fax') && !s.flags.paco_dio_manual && s.flags.cpd_paco_fax_n === 3, 'sin pegatina no hay manual');
  await closeMenu();
  await G(() => __game.setFlag('vio_pegatina_fax', true));          // Mirar fax en la Redacción de papel (paquete PD)
  await G(() => __game.clearLog());
  await verbOn('hablar', 'paco_ticket');
  o = await options();
  ok(o.includes('Ticket 0.441. El fax de Teodoro.') && !o.includes('¿Sabes algo del fax de la Redacción de papel?'), 'con la pegatina: «Ticket 0.441. El fax de Teodoro.» en lugar de la vaga');
  await chooseOption('Ticket 0.441');
  s = await st();
  ok(s.inventory.includes('manual_fax') && s.flags.paco_dio_manual, 'manual_fax y paco_dio_manual');
  ok(await logHas('0.441. De 1999. Estado: lo respetamos.') && await logHas('Toma el manual. Página 9: la respuesta automática. Mi mejor empleada.'), 'las dos líneas de Paco (D13)');
  ok(!(await logHas('Lo único de esta casa')) && !(await logHas('Posando')), 'fuera «Lo único de esta casa…» y «Posando» de Paco');
  o = await options();
  ok(!o.some(x => /fax/i.test(x)), 'con el manual dado, no vuelve ninguna opción del fax');
  await closeMenu();

  // ================================================================ 3 · el armario 27
  console.log('\n§2.4 El armario 27');
  await fresh({ ...ACTO2 });
  await verbOn('tirar', 'papel_continuo');
  ok(await logHas('Tiro un poco. Desde dentro, alguien tira más fuerte.'), 'Acto II, 1.er tirón');
  await verbOn('tirar', 'papel_continuo');
  ok(await logHas('Desde dentro no sueltan. El de ahí no está distraído.'), 'Acto II, 2.º tirón');
  s = await st();
  ok(!s.flags.ruben_encontrado && s.flags.cpd_papel_tirones === 2 && s.objects.papel_continuo.state === 'asoma', 'sin ruben_encontrado; el papel vuelve a asomar');
  await verbOn('tirar', 'armario_27');
  ok(await logHas('La puerta no cede. El papel de abajo es otra cosa.'), 'Tirar armario (D15)');
  await verbOn('mirar', 'papel_continuo');
  ok(await logHas('Papel continuo con borde perforado.'), 'Mirar papel en el II: la de siempre');

  // Acto III: entrar
  await fresh({ ...ACTO2, acto_3_iniciado: true, pagina_cerrada: true, dos_ias_vista: true, anselmo_dijo_regla: true }, 'vestibulo');
  await G(() => __game.skipText(false));
  await G(async () => { __game.game.runScript(api => api.goto('cpd', 'ascensor'), { label: 'test' }); });
  await settle();
  s = await st();
  ok(s.room === 'cpd' && s.objects.papel_continuo.state === 'corre', `Acto III: al entrar, papel en estado «${s.objects.papel_continuo.state}»`);
  ok(await logCount('El papel del 27 sale a chorro. El de dentro está muy ocupado.') === 1, 'Bruno lo dice al entrar');
  await wait(1500);
  await shot('armario-chorro');
  // la tira avanza: dos fotogramas distintos de la zona del papel
  const cambia = await G(async () => {
    const c = document.querySelector('canvas'); const x = c.getContext('2d');
    const r = c.width / 320; const img1 = x.getImageData(Math.round(176 * r), Math.round(90 * r), Math.round(20 * r), Math.round(20 * r)).data;
    await new Promise(res => setTimeout(res, 400));
    const img2 = x.getImageData(Math.round(176 * r), Math.round(90 * r), Math.round(20 * r), Math.round(20 * r)).data;
    let d = 0; for (let i = 0; i < img1.length; i++) if (img1[i] !== img2[i]) d++; return d;
  });
  ok(cambia > 0, `la tira se mueve (${cambia} valores distintos en 400 ms)`);
  await verbOn('mirar', 'papel_continuo');
  ok(await logHas('Papel continuo, saliendo a chorro. Nadie lo sujeta desde dentro.'), 'Mirar papel en el III (D16)');
  await verbOn('mirar', 'armario_27');
  ok(await logHas('...Y alguien teclea dentro. Rápido.') && !(await logHas('Con faltas')), 'Mirar armario en el III (C40)');
  // guardar/cargar con el papel corriendo
  await G(() => __game.save('e5pc3'));
  await G(() => __game.clearLog());
  await G(() => __game.load('e5pc3'));
  s = await st();
  ok(s.objects.papel_continuo.state === 'corre' && !(await logHas('sale a chorro')), 'cargar en el III: el papel sigue corriendo y la línea no se repite');
  // otra entrada: sin línea
  await G(() => __game.skipText(true));
  await G(() => __game.gotoRoom('pecera', 'cpd'));
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipText(false); __game.clearLog(); });
  await G(async () => { __game.game.runScript(api => api.goto('cpd', 'ascensor'), { label: 'test' }); });
  await settle();
  ok((await st()).objects.papel_continuo.state === 'corre' && !(await logHas('sale a chorro')), 'otra entrada en el III: corre, sin repetir la línea');
  await G(() => __game.skipText(true));
  await verbOn('tirar', 'papel_continuo');
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => __game.skipText(false));
  s = await st();
  ok(s.flags.ruben_encontrado && s.objects.papel_continuo.state === 'recogida' && s.objects.armario_27.state === 'abierto' && await logHas('¡EH! ¡QUE ES MI BORRADOR!'), 'Tirar papel en el III → revelacion_ruben (papel recogido, armario abierto)');
  await G(() => __game.clearLog());
  await verbOn('dar', 'ruben').catch(() => {});
  await G(() => { __game.game.ui.verb = null; __game.game.ui.item = null; });
  await G(async () => { await __game.doVerb('hablar', 'ruben'); });
  await G(() => __game.chooseText('Ahora vuelvo'));
  await G(() => __game.waitIdle());

  // ================================================================ 5 · Vestíbulo
  console.log('\n§4 Vestíbulo: C01-C10, M12-M14, M18');
  await fresh({ ...ACTO2, bruno_sellado_frente: true, vestibulo_organigrama_visto: true }, 'vestibulo');
  await G(() => __game.skipText(true));
  const v = await G(async () => {
    const out = {};
    const run = async (verb, id) => { __game.clearLog(); await __game.doVerb(verb, id); await __game.waitIdle(); return __game.log.map(l => l.text).join(' / '); };
    out.organigrama = await run('mirar', 'organigrama');
    out.tirarOrg = await run('tirar', 'organigrama');
    out.ibex = await run('coger', 'pantalla_ibex');
    out.altavoz = await run('tirar', 'altavoz_ibex');
    out.empujarC = await run('empujar', 'celestino');
    out.tirarRama = await run('tirar', 'rama_diseno');
    __game.setFlag('foto_en_organigrama', true);
    out.rama = await run('mirar', 'rama_diseno');
    __game.clearLog(); await __game.doVerb('dar', 'celestino', 'chicle'); out.chicle = '';
    return out;
  });
  ok(v.organigrama.includes('Abajo hay una casilla que pone VACANTE. Le falta una cara.'), 'C01');
  ok(v.tirarOrg.endsWith('Si tiro del organigrama, me caen treinta jefes.'), 'C02');
  ok(v.ibex.endsWith('Si me la llevo, Celestino se queda sin partido.'), 'C03');
  ok(v.altavoz.endsWith('Si le quito la bufanda, narra.'), 'C05');
  ok(v.empujarC.endsWith('A Celestino no se le empuja. Lleva galones.'), 'C08');
  ok(v.tirarRama.endsWith('Si tiro de la rama, se cae la casilla.'), 'C07');
  ok(v.rama.includes('DISEÑO Y PRODUCTO. De la rama cuelga mi foto.'), 'C06');
  await G(() => { __game.giveItem('chicle'); });
  const v2 = await G(async () => {
    const run = async (verb, id, item) => { __game.clearLog(); await __game.doVerb(verb, id, item); await __game.waitIdle(); return __game.log.map(l => l.text).join(' / '); };
    const out = {};
    out.chicle = await run('dar', 'celestino', 'chicle');
    __game.setFlag('torno_abierto', false);
    out.asc = await run('mirar', 'ascensor_vestibulo');
    __game.setFlag('torno_abierto', true);
    __game.clearLog(); await __game.doVerb('hablar', 'celestino'); await __game.waitIdle();
    out.saludo = __game.log.map(l => l.text).join(' / ');
    out.opts = __game.currentDialogOptions();
    return out;
  });
  ok(v2.chicle.endsWith('Ese chicle ya es tuyo. Aquí no se aceptan devoluciones.'), 'C09');
  ok(v2.asc.includes('Desde aquí se ve la moqueta. Algún día la piso.') && !v2.asc.includes('Con contrato'), 'C04');
  ok(!v2.saludo.includes('frente'), 'M18: Celestino ya no comenta la tarjeta en la frente');
  await G(() => __game.skipText(false));
  await chooseOption('plaza de garaje');
  ok(await logHas('Dos maneras: jubilarse o un «accidente».') && !(await logHas('Con comillas')) && await logHas('¿Y una plaza de bici?'), 'C10: sin «Con comillas» (las hace con los dedos) y la plaza de bici detrás');
  await closeMenu().catch(async () => { await chooseOption('Nada, Celestino.'); });
  const src = fs.readFileSync(path.resolve(here, '../content/rooms/vestibulo.js'), 'utf8');
  ok(src.includes('¡Así no, hombre, así no!') && src.includes('¡Vuelve al vestíbulo! ¡Sin balón, pero con ganas!') && src.includes('¡Otra vez aquí! ¡Pisa más área que el portero!'), 'M12-M14 (Ibex y saludos sin «chaval»)');
} catch (e) {
  failures++;
  console.log('  ✗ ABORTADO: ' + (e instanceof Fail ? e.message : e.stack));
  await shot('fallo').catch(() => {});
}

const errs = consoleErrors.filter(e => !/favicon/i.test(e));
ok(!errs.length, `sin errores de consola${errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''}`);
const gerr = await G(() => (__game.errors || []).map(e => String(e.msg || e))).catch(() => []);
ok(!gerr.length, `sin errores del juego${gerr.length ? ': ' + gerr.slice(0, 5).join(' | ') : ''}`);
console.log(`\n${checks - failures}/${checks} comprobaciones OK`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
