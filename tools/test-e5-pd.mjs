#!/usr/bin/env node
// PRUEBA DEL PAQUETE PD DE LA ENMIENDA E5 (Papel y Despachos: docs/guion2/ENMIENDA_E5.md §10, fila PD).
//   · §2.3 la pegatina del fax: Mirar fax con RATÓN REAL (verbo y objeto con clic) → la línea fundida y `vio_pegatina_fax`;
//     con papel, el flag sin línea; guardar/cargar a mitad; Mirar otra vez (no se rompe);
//   · §2.8 N6: `aurora_tadeo` solo con un «RV:» leído (`rvLeido`): con RV sin leer, el programador de ambiente lo intenta
//     muchas veces y Aurora calla; leer el RV1 en el Papel (móvil, menú real) → Aurora lo dice en ese momento, una vez;
//     leído fuera y luego en el Papel → ya es elegible; antes del café, nunca;
//   · textos de §4: D01, C32-C39, C85-C88, M02-M08 (Papel); C27-C31, C89-C91, M23, M25, M28, R3 (Despachos);
//   · §5.4 el Lector Medio asiente sin globo en la opción de Gervasio (fotograma `tamb2`/`tamb2j`, sin línea suya); su
//     frase entera sigue en Hablar y en la escena de la chaqueta;
//   · COINCIDO y corregirPosit de E4 siguen en su sitio (lo de test-e4 que toca a esta sala).
//   Capturas: tools/shots/e5-pd-*.png.      node tools/test-e5-pd.mjs
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

const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
await page.goto(base + '?room=pecera');
await page.waitForFunction(() => window.__game && __game.state().mode === 'play').catch(async e => { console.log(consoleErrors, await page.evaluate(() => window.__game && __game.state().mode)); throw e; });
const G = (fn, a) => page.evaluate(fn, a);
const idle = () => G(() => __game.waitIdle());
const flag = (k) => G(k => __game.getFlag(k), k);
const clearLog = () => G(() => __game.clearLog());
const logHas = (t) => G(t => __game.log.some(l => String(l.text).includes(t)), t);
const logCount = (t) => G(t => __game.log.filter(l => String(l.text).includes(t)).length, t);
const logTexts = () => G(() => __game.log.map(l => `${l.who || '-'}: ${l.text}`));
const shot = (name, clip) => page.screenshot({ path: path.join(shots, `e5-pd-${name}.png`), ...(clip ? { clip } : {}) });

const BASE = { intro_vista: true, torno_abierto: true, inigo_presentado: true, gertrudis_saludada: true, cafetera_viral: true,
  cafetera_viral_vista: true, chaqueta_cogida: true };
/** Partida nueva en `room`, con `flags`, texto rápido para las escenas de entrada y el control devuelto. */
async function partida(room, flags = {}, items = []) {
  await G(() => __game.skipText(true));
  await G(() => __game.newGame());
  await G(([F, I]) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); for (const i of I) __game.giveItem(i); }, [{ ...BASE, ...flags }, items]);
  await G(r => __game.gotoRoom(r), room);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipText(false); __game.skipSpeech(); __game.game.speeches.length = 0; });
  await clearLog();
}
/** Con texto rápido: un verbo y que acabe. */
async function verb(v, t, i) {
  await G(() => __game.skipText(true));
  await G(([v, t, i]) => __game.doVerb(v, t, i), [v, t, i || null]);
  await idle();
  await G(() => __game.skipText(false));
}
async function choose(txt) { await G(() => __game.skipText(true)); const r = await G(t => __game.chooseText(t), txt); await idle(); await G(() => __game.skipText(false)); return r; }

// ------------------------------------------------------------------ ratón real (como tools/play-mouse.mjs)
async function vclick(x, y) {
  const p = await G(([x, y]) => __game.virtualToClient(x, y), [x, y]);
  await page.mouse.move(p.x, p.y); await sleep(40);
  await page.mouse.click(p.x, p.y); await sleep(50);
}
async function clickVerb(v) {
  const p = await G(v => __game.verbPos(v), v);
  await page.mouse.move(p.x, p.y); await sleep(40); await page.mouse.click(p.x, p.y); await sleep(50);
}
/** Un punto de pantalla donde un clic elige exactamente este objetivo (pickAt). */
async function pointFor(id) {
  return G((id) => {
    const g = __game.game, cam = Math.round(g.camX);
    const o = __game.objects().find(o => o.id === id && o.visible !== false);
    if (!o) return null;
    const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
    let best = null, bd = Infinity;
    for (let y = Math.max(0, Math.floor(o.y)); y < Math.min(144, o.y + o.h); y++) for (let x = Math.max(cam, Math.floor(o.x)); x < Math.min(cam + 320, o.x + o.w); x++) {
      const t = g.pickAt(x - cam, y);
      if (t && t.id === id) { const d = Math.hypot(x - cx, y - cy); if (d < bd) { bd = d; best = [x - cam, y]; } }
    }
    return best;
  }, id);
}
/** Deja correr el juego pasando globos con clic real en un punto neutro del panel. */
async function settle(ms = 30000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const s = await G(() => { const g = __game.game; return { busy: g.busy > 0 || !!g.acting, choice: !!g.choice, sp: g.speeches.filter(x => x.blocking).length, walk: Object.values(g.actors).some(a => a.path.length) }; });
    if (s.choice) return;
    if (!s.busy && !s.sp && !s.walk) { await sleep(80); if (!(await G(() => __game.game.busy || __game.game.acting))) return; continue; }
    if (s.sp) { await sleep(300); await vclick(302, 147); continue; }
    await sleep(80);
  }
  throw new Error('settle: tiempo agotado');
}

try {
  // ================================================================ §2.3 · la pegatina del fax, con ratón real
  console.log('§2.3 Mirar fax (ratón real) → pegatina y vio_pegatina_fax');
  await partida('catacumba');
  ok(!(await flag('vio_pegatina_fax')), 'partida nueva: sin vio_pegatina_fax');
  const pFax = await pointFor('fax');
  ok(!!pFax, `el fax se puede elegir con el ratón (punto ${JSON.stringify(pFax)})`);
  await clickVerb('mirar');
  const pv = await G(([x, y]) => __game.virtualToClient(x, y), pFax);
  await page.mouse.move(pv.x, pv.y); await sleep(150);
  ok(await G(() => __game.state().hover) === 'fax', 'el ratón sobre el fax lo apunta (verbo Mirar elegido con clic)');
  await vclick(...pFax);
  await page.waitForFunction(() => __game.game.speeches.some(s => String(s.text).includes('0.441')), null, { timeout: 15000 });
  await sleep(300);
  await shot('fax-mirar');                     // con el globo de la pegatina
  await settle();
  ok(await logHas('Un fax de 1992: «SIN PAPEL». Pegatina: «Mantenimiento: Sistemas. Ticket 0.441».'), 'D20/C34: «Un fax de 1992: «SIN PAPEL». Pegatina: «Mantenimiento: Sistemas. Ticket 0.441».»');
  ok(!(await logHas('Y sin ganas.')), 'la línea vieja («Y sin ganas.») ya no sale');
  ok(await flag('vio_pegatina_fax') === true, 'Mirar fax pone vio_pegatina_fax (G)');
  ok((await logTexts()).filter(l => l.startsWith('-: ') || l.startsWith('bruno')).length >= 1, 'una sola línea de Bruno en el Mirar');
  // captura ampliada del fax: la pegatina se ve
  const box = await G(() => { const g = __game.game, cam = Math.round(g.camX); const a = __game.virtualToClient(103 - cam - 6, 77 - 8), b = __game.virtualToClient(103 - cam + 32, 77 + 26); return { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y }; });
  await shot('pegatina-zoom', box);
  const pix = await G(() => {
    const c = document.querySelector('canvas'), g = __game.game, cam = Math.round(g.camX);
    const ctx = c.getContext('2d'); const sx = c.width / 320, sy = c.height / 200;
    const d = ctx.getImageData(Math.floor((103 + 6 - cam + 0.5) * sx), Math.floor((77 + 8 + 0.5) * sy), 1, 1).data;
    return [d[0], d[1], d[2]];
  }).catch(() => null);
  ok(!pix || (pix[0] > 200 && pix[1] > 200 && pix[2] > 190), `la pegatina se pinta (píxel del frontal ${JSON.stringify(pix)}: blanco roto)`);

  // guardar a mitad y cargar: el flag se conserva; Mirar otra vez no rompe nada
  await G(() => __game.save(7));
  await G(() => __game.setFlag('vio_pegatina_fax', false));
  await G(() => __game.load(7));
  ok(await flag('vio_pegatina_fax') === true, 'guardar/cargar: vio_pegatina_fax se conserva');
  await clearLog();
  await verb('mirar', 'fax');
  ok(await logCount('Ticket 0.441') === 1 && await flag('vio_pegatina_fax') === true, 'Mirar fax otra vez: la misma línea, el flag sigue');

  // con papel: las dos de hoy y el flag sin línea
  await partida('catacumba', { acto_2_iniciado: true, fax_con_papel: true });
  await verb('mirar', 'fax');
  ok(await logHas('Tiene papel. Teodoro lo mira') && !(await logHas('Ticket 0.441')), 'con papel: las dos líneas de hoy, sin la de la pegatina');
  ok(await flag('vio_pegatina_fax') === true, 'con papel: vio_pegatina_fax puesto sin línea');
  await shot('fax-con-papel');

  // ================================================================ §2.8 · N6 (rvLeido)
  console.log('\n§2.8 N6 · Aurora y los «RV:» de Tadeo');
  const KEY = 'ambient:catacumba.aurora_tadeo';
  const AU1 = 'Dos exclamaciones de cierre y ninguna de apertura.';
  /** Fuerza al programador de ambiente a intentarlo `n` veces seguidas (equivale a minutos de espera en la sala). */
  async function forzarAmbiente(n = 12) {
    for (let i = 0; i < n; i++) {
      await G(() => { const g = __game.game, A = g.room.amb; if (A) { A.next = g.time; A.count = 0; } g.finDialogo = null; });
      await sleep(250);
    }
    await idle();
  }
  await partida('catacumba', { acto_2_iniciado: true, tadeo_rv_n: 2, movil_leidos: 0 });
  await forzarAmbiente();
  ok(!(await logHas(AU1)) && !(await G(k => __game.game.state.flags[k], KEY)), 'con dos RV llegados y sin leer: Aurora no dice nada (ambiente forzado 12 veces)');
  // leer el RV1 en el Papel con el móvil (menú del móvil, opción a opción)
  await G(() => __game.skipText(true));
  G(() => __game.doVerb('usar', 'movil'));
  await page.waitForFunction(() => !!__game.game.choice);
  await G(() => __game.chooseText('Correo'));
  await page.waitForFunction(() => !!__game.game.choice && __game.game.choice.options.some(o => o.includes('Tadeo')));
  const opts = await G(() => __game.currentDialogOptions());
  const iRV1 = opts.findIndex(o => o.includes('Cómo hacer que la web'));
  ok(iRV1 >= 0, `el RV1 está en la bandeja (${opts.length - 1} correos)`);
  await G(i => __game.chooseDialog(i), iRV1);
  await page.waitForFunction(() => !!__game.game.choice && __game.game.choice.options.includes('Volver'));
  ok(await logHas(AU1) && await logHas('Eso no es entusiasmo, criatura. Es inglés.'), 'leer el RV1 en el Papel → Aurora dice su par en ese momento');
  ok(await G(k => __game.game.state.flags[k], KEY) === 1, 'el par queda gastado (mismo contador que el ambiente)');
  await G(() => __game.chooseText('Volver'));
  await page.waitForFunction(() => !!__game.game.choice && __game.game.choice.options.includes('Guardar el móvil'));
  await G(() => __game.chooseText('Guardar el móvil'));
  await idle();
  await G(() => __game.skipText(false));
  await forzarAmbiente(4);
  ok(await logCount(AU1) === 1, 'no se repite');
  // leído fuera del Papel: al entrar, el ambiente ya puede decirlo
  await partida('pecera', { acto_2_iniciado: true, tadeo_rv_n: 2, movil_leidos: 1 });
  await G(() => __game.skipText(true)); await G(() => __game.gotoRoom('catacumba')); await idle(); await G(() => __game.skipText(false));
  await clearLog();
  await forzarAmbiente(8);
  ok(await logHas(AU1), 'RV1 leído en otra sala: en el Papel, el ambiente lo dice');
  // antes del café, aunque esté leído: no
  await partida('catacumba', { tadeo_rv_n: 1, movil_leidos: 1 });
  await forzarAmbiente(6);
  ok(!(await logHas(AU1)), 'antes del café (sin acto_2_iniciado): nada, aunque esté leído');
  // un correo fijo leído (bit 8) no cuenta como RV
  await partida('catacumba', { acto_2_iniciado: true, tadeo_rv_n: 2, movil_leidos: 1 << 8 });
  await forzarAmbiente(6);
  ok(!(await logHas(AU1)), 'leer un correo fijo no cuenta como RV leído');

  // ================================================================ textos del Papel (§4)
  console.log('\n§4 Textos de la Redacción de papel');
  await partida('catacumba', {}, ['copias_rechazadas']);
  const T = async (v, t, i, nuevo, viejo, msg) => {
    await clearLog(); await verb(v, t, i);
    ok(await logHas(nuevo) && (!viejo || !(await logHas(viejo))), `${msg}: «${nuevo}»`);
  };
  await T('mirar', 'catacumba_a_pecera', null, 'Vuelta a la Redacción web. Al otro lado del latón, el siglo XXI.', 'Con escalas.', 'C32');
  await T('coger', 'galeradas', null, 'Si descuelgo una, Teodoro me mide.', 'Con la regla.', 'C33');
  await T('usar', 'fotos_jefes_cierre', null, 'No tengo bigote que comparar.', 'Ni contrato.', 'C35');
  await T('coger', 'cartel_aurora', null, 'Toc en los nudillos. El cartel no se toca.', 'Ni se discute.', 'C36');
  await T('coger', 'libro_estilo', null, 'Toc en el lomo. El libro no se mueve.', 'Y yo, tampoco.', 'C37');
  await T('dar', 'teodoro_cuerpodoce', 'copias_rechazadas', 'Teodoro no dice nada. Señala el fax.', 'Con mucha intención.', 'C38');
  await G(() => __game.skipText(true));
  G(() => __game.doVerb('hablar', 'aurora_galerada'));
  await page.waitForFunction(() => !!__game.game.choice);
  const sinCafe = await G(() => __game.currentDialogOptions());
  ok(sinCafe.includes('Ya vuelvo con café.') && !sinCafe.includes('Ya vuelvo. Con café.'), 'C39: opción «Ya vuelvo con café.»');
  await G(() => __game.chooseText('Ya vuelvo con café.')); await idle();
  await G(() => __game.skipText(false));
  // el café: D01
  await G(() => __game.giveItem('cafe'));
  await T('dar', 'aurora_galerada', 'cafe', 'Y una reunión solo se acaba cuando alguien pregunta por el punto que nadie toca.', 'por los siguientes pasos', 'D01');
  ok(await flag('aurora_conto_pasos') && await flag('acto_2_iniciado'), 'el café sigue poniendo aurora_conto_pasos y acto_2_iniciado');
  await G(() => { if (__game.game.choice) __game.chooseText('Nada, Aurora'); }); await idle();
  await T('coger', 'libro_estilo', null, 'Ese libro, ni tocarlo; se consulta aquí, de pie y con las manos limpias.', 'Con las manos limpias.', 'C85');
  // bolis de Aurora: con el boli muerto ya cogido, la pista de que los demás están vivos (C86)
  await G(() => { __game.setFlag('custodia_regla', true); });
  await T('coger', 'bolis_aurora', null, 'Ese murió corrigiendo', null, 'boli muerto (sin cambios)');
  await T('coger', 'bolis_aurora', null, 'Los demás están vivos; por eso no los presto.', 'Y son míos.', 'C86');
  // derrotas de D2: C87 y M06
  await G(() => __game.setFlag('fax_con_papel', true));
  await clearLog(); await G(() => __game.skipText(true)); await G(() => __game.scene('teodoro_derrota', { perdidos: 1 })); await idle();
  ok(await logHas('Ha perdido usted con dos faltas, en cuerpo 72; se ven desde la escalera.') && !(await logHas('criatura')), 'C87');
  await clearLog(); await G(() => __game.scene('teodoro_derrota', { perdidos: 2 })); await idle();
  ok(await logHas('Otros seis folios. Con esto ya se encuaderna.') && !(await logHas('criatura')), 'M06');
  await G(() => __game.skipText(false));
  // M07: Teodoro con papel
  await clearLog();
  await G(() => __game.skipText(true));
  G(() => __game.doVerb('hablar', 'teodoro_cuerpodoce'));
  await page.waitForFunction(() => !!__game.game.choice);
  ok(await logHas('TEODORO (fax): ¿QUÉ QUIERES?') && !(await logHas('CHAVAL')), 'M07: «¿Qué quieres?» (sin «chaval»)');
  await G(() => __game.chooseText('Me voy.')); await idle();
  // M05: fuente ya citada
  await G(() => { __game.setFlag('casilla_fuente', true); __game.giveItem('mensaje_fp'); });
  await T('dar', 'aurora_galerada', 'mensaje_fp', 'Ya está citada. Dos veces sería abusar de su confianza.', 'criatura', 'M05');
  // M04 (adhesivo), M02/M03 (la coma de Evaristo), con COINCIDO y corregirPosit de E4 en el mismo árbol
  await G(() => { __game.setFlag('bruno_con_banner', true); __game.setFlag('evaristo_escuchado', true); __game.setFlag('rumor_teodoro_n', 1); });
  await clearLog();
  await G(() => __game.skipText(true));
  G(() => __game.doVerb('hablar', 'aurora_galerada'));
  await page.waitForFunction(() => !!__game.game.choice);
  ok(await logHas('Llevas un anuncio en la espalda. En esta planta, no.') && await flag('bruno_con_banner') === false, 'M04 (y el adhesivo, fuera)');
  await G(() => __game.chooseText('Don Evaristo pregunta si su coma'));
  await page.waitForFunction(() => !!__game.game.choice);
  ok(await logHas('¿Evaristo? ¿El de las comas? Siéntate. Bueno, no hay silla.'), 'M02');
  ok(await logHas('Cuando alguien diga que una coma es un detalle sin importancia.') && !(await logHas('importancia, criatura')), 'M03');
  ok(await flag('coma_bendecida') && await G(() => __game.state().inventory.includes('correo_evaristo')), 'la coma sigue bendecida (correo_evaristo)');
  await G(() => __game.chooseText('Nada, Aurora')); await idle();
  // E4: corregirPosit y COINCIDO intactos
  await G(() => { __game.setFlag('opa_posit', 1); __game.setFlag('pieza_escrita', true); __game.giveItem('pieza_opa'); });
  await clearLog();
  G(() => __game.doVerb('hablar', 'aurora_galerada'));
  await page.waitForFunction(() => !!__game.game.choice);
  ok(await flag('opa_posit') === 2 && await logHas('Cuatro tachones para volver a mi titular.'), 'E4 S8: corregirPosit sigue (opa_posit = 2)');
  await G(() => __game.chooseText('Yoli quiere sacar mi opa')); await page.waitForFunction(() => !!__game.game.choice);
  ok(await logHas('RESPUESTA A AURORA: COINCIDO.') && await logHas('EN QUE PIDE COMPLEMENTO.'), 'E4 S7: COINCIDO sigue');
  await G(() => __game.chooseText('Nada, Aurora')); await idle();
  // C88: tras ganar D2 con la ficha, «...Lo ha escrito bien.» y nadie habla
  await G(() => { __game.giveItem('ficha_pagina_7'); __game.setFlag('casilla_firma', false); });
  await clearLog();
  const c88 = await G(async () => { const g = __game.game; const t0 = performance.now(); await g.runScript(api => g.content.rooms.catacumba.duels.teodoro.onWin(api)); return performance.now() - t0; });
  await idle();
  ok(await logHas('...Lo ha escrito bien.') && !(await logHas('NO HAY ERRATAS')) && await flag('casilla_firma'), `C88: tras «...Lo ha escrito bien.» no habla nadie (sin la línea del fax; ${Math.round(c88)} ms)`);
  // M08: escena 7.3a
  await G(() => { __game.setFlag('casilla_hueco', true); __game.setFlag('pieza_recortada', true); __game.giveItem('pieza_opa'); });
  await clearLog();
  await G(() => __game.scene('acto_3a')); await idle();
  ok(await logHas('TEODORO (fax): LA REUNIÓN DE DIRECCIÓN APAGA LA ROTATIVA A LAS NUEVE.') && !(await logHas('CHAVAL. LA REUNIÓN')), 'M08: sin «Chaval.» delante');
  ok(await logHas('SI NO HAY ROTATIVA, NO HAY FIRMA.') && await flag('acto_3_iniciado'), '7.3a sigue entera (Acto III iniciado)');
  await G(() => __game.skipText(false));

  // ================================================================ Despachos (§4, §5.4)
  console.log('\n§4/§5.4 Despachos');
  await partida('pajarera', { acto_2_iniciado: true, reunion_terminada: true });
  const defs = await G(() => { const r = __game.game.content.rooms.pajarera; const a = (id) => r.actors.find(x => x.id === id); return { lm: a('lector_medio').murmurs, gv: a('gervasio_acta').murmurs, glob: __game.game.content.actors.lector_medio.murmurs }; });
  ok(Array.isArray(defs.lm) && defs.lm.length === 0 && defs.glob.length === 0, 'M23: el Lector Medio sin murmullo (Despachos y global)');
  ok(defs.gv.includes('Ese correo se contesta... Se contestará.') && !defs.gv.some(l => l.includes('Diecinueve años. Ni un marrón')), 'M28: murmullo de Gervasio');
  // M25: asentir sin globo (sin chaqueta y con ella), por el árbol real de Gervasio
  async function asentirGervasio(tag) {
    G(() => __game.doVerb('hablar', 'gervasio_acta'));
    await G(() => __game.skipText(true)); await page.waitForFunction(() => !!__game.game.choice); await G(() => __game.skipText(false));
    await clearLog();
    await G(() => { window.__var = []; window.__lmSp = 0; const g = __game.game; window.__iv = setInterval(() => { const a = g.actors.lector_medio; if (a && a.variante) window.__var.push(a.variante); if (g.speeches.some(s => s.actor === 'lector_medio')) window.__lmSp++; }, 15); });
    G(() => __game.chooseText('¿Quién decide lo del Plan Cero Papel?'));
    await page.waitForFunction(() => window.__var.length > 0 || __game.log.some(l => String(l.text).includes('ya está decidido')), null, { timeout: 20000 });
    await shot('asentir' + tag);
    await settle();
    const as = await G(() => { clearInterval(window.__iv); return { v: [...new Set(window.__var)], sp: window.__lmSp, fin: __game.game.actors.lector_medio.variante || null }; });
    await G(() => __game.chooseText('Me voy.')); await idle();
    return as;
  }
  let as = await asentirGervasio('');
  ok(await logHas('Lo que diga el Lector Medio.') && await logHas('...Pues ya está decidido.'), 'M25: Gervasio dice sus dos líneas');
  ok(as.v.includes('tamb2') && as.sp === 0 && !(await logHas('A mí lo que me interesa')), `M25 / §5.4: el Lector Medio asiente (fotograma ${as.v.join(', ')}) sin globo ni línea`);
  ok(as.fin === null, 'tras asentir vuelve a su sprite de siempre');
  await partida('pajarera', { acto_2_iniciado: true, reunion_terminada: true, chaqueta_en_lector: true, silla_libre: true });
  as = await asentirGervasio('-chaqueta');
  ok(as.v.includes('tamb2j') && as.sp === 0, `con la chaqueta asiente con tamb2j (${as.v.join(', ')}), sin globo`);
  // Hablar con el Lector: su frase entera se queda (siembra)
  await clearLog(); await verb('hablar', 'lector_medio');
  ok(await logHas('A mí lo que me interesa es la economía. Y ahorrar.'), 'Hablar con el Lector Medio: su frase sigue (siembra)');
  // Mirar / Empujar el Lector
  await G(() => __game.setFlag('chaqueta_en_lector', false));
  await T('mirar', 'lector_medio', null, 'Ficha: "43 años. Le interesa la economía". Lo demás, tapado con celo.', 'Y ahorrar".', 'C30');
  await G(() => __game.setFlag('chaqueta_en_lector', true));
  await T('mirar', 'lector_medio', null, 'Con la chaqueta de Ramírez parece más medio.', 'Y más de Bolsa.', 'C29');
  await T('empujar', 'lector_medio', null, 'Todavía no. Si se cae, se cae todo.', 'Y todavía no toca.', 'C31');
  await T('mirar', 'inigo_sinergia', null, 'Íñigo Sinergia. Traje de dos mil euros y zapatillas de trescientos.', 'disruptivo', 'R3');
  await T('coger', 'postits', null, 'Eso es propiedad intelectual.', 'Y adhesiva.', 'C91 (pósits)');
  await T('coger', 'posit_evaristo', null, 'Eso es propiedad intelectual.', 'Y adhesiva.', 'C91 (pósit azul)');
  // C28: la 3.ª de la hoja de reservas (con la reunión aún en curso)
  await G(() => __game.setFlag('reunion_terminada', false));
  await clearLog(); for (let i = 0; i < 3; i++) await verb('mirar', 'hoja_reservas');
  ok(await logHas('"Mercados · cinco minutitos · marzo". La hora de salida, en blanco.'), 'C28');
  // C90: Íñigo y el Titulator
  await G(() => __game.skipText(true));
  G(() => __game.doVerb('hablar', 'inigo_sinergia'));
  await page.waitForFunction(() => !!__game.game.choice);
  await clearLog();
  await G(() => __game.chooseText('¿El Titulator escribe solo?')); await page.waitForFunction(() => !!__game.game.choice);
  ok(await logHas('Es generativo, autónomo y escala...') && await logHas('¿Y qué come?') && !(await logHas('no pide vacaciones')), 'C90: Íñigo cortado por «¿Y qué come?»');
  await G(() => __game.chooseText('Me voy.')); await idle();
  // C89: la escena de la chaqueta (Bruno con la chaqueta puesta)
  await partida('pecera', { bruno_con_chaqueta: true });
  await G(() => __game.skipText(true)); await G(() => __game.gotoRoom('pajarera')); await idle(); await G(() => __game.skipText(false));
  ok(await logHas('¿Ve? Él sí sabe estar.') && !(await logHas('Y sin chaqueta.')), 'C89');
  ok(await logHas('A mí lo que me interesa es la economía. Y ahorrar.'), 'la escena de la chaqueta conserva la frase del Lector (siembra)');
  // C27: Acto III, Coger pósits
  await G(() => { __game.setFlag('acto_3_iniciado', true); });
  await T('coger', 'postits', null, 'No. Íñigo los tiene contados por colores.', 'Y por horas.', 'C27 (E6 §4.1 E156: fundida)');
  await shot('despachos');
} catch (e) {
  failures++;
  console.log('  ✗ EXCEPCIÓN: ' + (e && e.stack || e));
  await shot('error').catch(() => {});
}

const errs = consoleErrors.concat(await G(() => (__game.errors || []).map(String)).catch(() => []));
ok(!errs.length, `sin errores de consola${errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''}`);
console.log(`\n${checks - failures}/${checks} comprobaciones OK`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
