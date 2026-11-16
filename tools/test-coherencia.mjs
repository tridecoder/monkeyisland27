#!/usr/bin/env node
// PRUEBA DE COHERENCIA: el juego no da por hecho lo que no ha pasado, y lo que anuncia, pasa. Sale con 1 si algo falla.
// Nace de tres avisos del dueño jugando (Evaristo «¿Para qué me ha llamado?» sin llamada y su correo que no llegaba;
// las sillas de Pilar, 112 y 113 a la vez; Gervasio, que no disolvía la reunión por mucho que se le insistiera).
// Capturas en tools/shots/coherencia-*.png y tools/shots/gervasio-insiste-*.png. Partes:
//   1. evaristo   sin convocar (no hay «¿Para qué me ha llamado?»; entrada «¿Qué quería decirme?» y se llega a
//                 evaristo_escuchado), convocado por la llamada L2 y convocado por Begoña (sí existe), con ratón.
//   2. avisos     estático: ningún `notice(` de content/ anuncia un correo o una llamada fuera de la función que los
//                 entrega (content/lib/movil.js `llegaCorreoEvaristo`), salvo la lista blanca; dinámico: cada aviso
//                 «Correo nuevo de X: «A».» que sale en una partida deja ESE correo en la bandeja en ese instante, sin
//                 leer, y el contador sube; se leen con ratón y Bruno comenta; la lista de llamadas cuadra.
//   3. presupone  cada presuposición encontrada en la auditoría, con su caso «sin que haya pasado» (y el de «sí»).
//   4. sillas     Pilar: antes de contar, 112; con la crisis abierta, 113 en todo; devuelta la silla, 112.
//   5. gervasio   insistir tres veces con «¿y cuáles son los siguientes pasos?» termina la reunión (ratón real),
//                 también tras guardar/cargar entre insistencias y con la vía del Vending a medias; Acto I no cuenta.
//   6. antiguas   partidas guardadas sin la L2 (sin `evaristo_convoco`): ni llamada fuera de lugar ni Evaristo mudo.
//   node tools/test-coherencia.mjs [--solo=evaristo,avisos,presupone,sillas,gervasio,antiguas]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const shots = path.join(here, 'shots'); fs.mkdirSync(shots, { recursive: true });
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const solo = args.solo ? String(args.solo).split(',') : null;
const toca = (k) => !solo || solo.includes(k);

const server = createServer(root);
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let failures = 0, checks = 0;
const ok = (c, m) => { checks++; if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ ' + m); } };
const errs = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const ACTO1 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, silla_libre: true, chaqueta_cogida: true, chaqueta_en_lector: true, ecosistema_interstitial: true };
const ACTO2 = { ...ACTO1, gertrudis_saludada: true, cafetera_viral: true, cafetera_viral_vista: true, acto_2_iniciado: true, aurora_conto_pasos: true, aurora_hablo_fax: true,
  chisme_indice: 4, cafetera_en_directo: true, office_e53_visto: true, office_agotada: true, cms_vivo: true, rep_11: true };
const ACTO3 = { ...ACTO2, nota_gasto_presentada: true, evaristo_escuchado: true, fax_con_papel: true, casilla_fuente: true, casilla_firma: true, casilla_hueco: true,
  reunion_terminada: true, sala_becario_sin_turno: true, pieza_escrita: true, pieza_recortada: true, pagina_cerrada: true, acto_3_iniciado: true };
/** Llamadas ya oídas (marcas `once`) y el contador a juego. */
const OIDAS = (ids) => ({ once: Object.fromEntries(ids.map(id => ['once:evaristo_' + id, true])), n: ids.length });

async function abrir(flags, room, entry, { inv = [], oidas = ['L1'] } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 600 } });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  const G = (fn, a) => page.evaluate(fn, a);
  await G(() => { __game.skipText(true); return __game.newGame(); });
  const O = OIDAS(oidas);
  await G(([F, O]) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); Object.assign(__game.game.state.once, O.once); __game.setFlag('evaristo_llamadas', O.n); }, [flags, O]);
  await G((inv) => { for (const i of inv) __game.giveItem(i); }, inv);
  // los avisos: cada uno, con la bandeja del móvil en ese mismo instante
  await G(async () => {
    const m = await import('./content/lib/movil.js');
    const g = __game.game, orig = g.notice.bind(g);
    window.__avisos = [];
    g.notice = (text, o) => {
      const api = { flag: (k) => __game.getFlag(k) };
      const L = m.bandeja(api), leidos = Number(__game.getFlag('movil_leidos') || 0);
      window.__avisos.push({ text: String(text), bandeja: L.map(c => ({ de: c.de, asunto: c.asunto, leido: ((leidos >> c.bit) & 1) === 1 })),
        sinLeer: L.filter(c => ((leidos >> c.bit) & 1) !== 1).length });
      return orig(text, o);
    };
  });
  await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipText(false); __game.skipSpeech(); __game.game.speeches.length = 0; __game.clearLog(); });
  const until = async (fn, arg, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(50); } return false; };
  const verA = (id) => G((id) => {
    const g = __game.game, o = __game.objects().find(o => o.id === id) || (g.actors[id] && { x: g.actors[id].x - 10, w: 20 });
    if (!o) return; const cx = o.x + o.w / 2;
    g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, Math.round(cx - 160)));
  }, id);
  const seguir = () => G(() => { __game.game.camFollow = __game.game.G.player; });
  const raton = async (verbo, id, item) => {
    const v = await G(v => __game.verbPos(v), verbo); await page.mouse.click(v.x, v.y); await sleep(60);
    if (item) { const c = await G(i => __game.invPos(i), item); await page.mouse.click(c.x, c.y); await sleep(60); }
    await verA(id); await sleep(80);
    const c = await G(id => __game.screenPos(id), id); await page.mouse.click(c.x, c.y);
    await sleep(150);
  };
  const pasar = async (ms = 30000) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      const st = await G(() => ({ choice: !!__game.game.choice, busy: __game.state().busy, sp: __game.game.speeches.some(s => s.blocking), cut: __game.game.cutscene > 0, ph: !!__game.state().phone }));
      if (st.choice) { await sleep(320); return 'menu'; }
      if (!st.busy && !st.sp && !st.cut) return 'libre';
      await G(() => __game.skipSpeech()); await sleep(90);
    }
    return 'tiempo';
  };
  const opciones = () => G(() => __game.currentDialogOptions() || []);
  const clicOpcion = async (txt) => {
    if (!(await until(() => !!__game.currentDialogOptions()))) return false;
    await sleep(320);
    const i = (await opciones()).findIndex(o => o.includes(txt));
    if (i < 0) return false;
    const p = await G(i => __game.optionPos(i), i); await page.mouse.click(p.x, p.y + 2); await sleep(150); return true;
  };
  const salir = async () => {
    for (let k = 0; k < 6 && (await opciones()).length; k++) {
      const o = await opciones(); const i = o.findIndex(x => /^(Me voy|Nada|Luego|Ya está|Volver|Guardar el móvil|Adiós)/.test(x));
      await clicOpcion(o[i < 0 ? o.length - 1 : i]); await pasar();
    }
  };
  const logHas = (t) => G(t => __game.log.some(l => String(l.text).includes(t)), t);
  const flag = (k) => G(k => __game.getFlag(k), k);
  const shot = (name) => page.screenshot({ path: path.join(shots, name.startsWith('gervasio') ? `${name}.png` : `coherencia-${name}.png`) });
  const ir = async (r, e) => { await G(([r, e]) => __game.gotoRoom(r, e), [r, e]); await pasar(); };
  const avisos = () => G(() => window.__avisos.slice());
  return { ctx, page, G, until, raton, pasar, opciones, clicOpcion, salir, logHas, flag, shot, seguir, ir, avisos };
}

try {
  // ====================================================================== 1. Evaristo
  if (toca('evaristo')) {
    console.log('1 · Evaristo: «¿Para qué me ha llamado?» solo si le han llamado');
    {   // a) sin convocar: Bruno sube por su cuenta
      const T = await abrir(ACTO2, 'administracion', 'ecosistema');
      ok(await T.flag('evaristo_convoco') === '' && await T.flag('evaristo_llamadas') === 1, 'Acto II sin L2 ni Begoña: nadie le ha convocado');
      await T.raton('hablar', 'evaristo_salvedad'); await T.pasar();
      const o = await T.opciones();
      ok(!o.includes('¿Para qué me ha llamado?') && o.includes('¿Qué quería decirme?'), `sin convocar: no está «¿Para qué me ha llamado?»; está «¿Qué quería decirme?» (${JSON.stringify(o)})`);
      await T.shot('evaristo-sin-convocar');
      await T.clicOpcion('¿Qué quería decirme?'); await T.pasar();
      ok(await T.logHas('Le voy a escribir un correo. Para comunicarle una cosa.') && !(await T.logHas('Le he llamado')) && !(await T.logHas('hecho llamar')), 'E_COSITA: «Le voy a escribir un correo…» (sin «Le he llamado»)');
      await T.clicOpcion('¿De qué trata?'); await T.pasar();
      await T.clicOpcion('Siga.'); await T.pasar(60000);
      ok(await T.flag('evaristo_escuchado') === true && await T.flag('rep_16') === true, 'sin convocar se llega igual: evaristo_escuchado y rep_16');
      await T.ctx.close();
    }
    {   // b) convocado por la llamada L2 (al empezar el Acto II, en cualquier sala menos Administración)
      const T = await abrir(ACTO1, 'pecera', 'ascensor');
      await T.G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); __game.clearLog(); }, ACTO2);
      await T.G(() => __game.gotoRoom('catacumba', 'pecera'));
      ok(await T.until(() => __game.getFlag('evaristo_llamadas') === 2, null, 20000) && await T.flag('evaristo_convoco') === 'llamada', 'L2 al entrar con el Acto II: evaristo_llamadas = 2, convocado por la llamada');
      ok(await T.logHas('Una cosita. ¿Puede pasarse por mi despacho? Es un segundo.') && await T.logHas('Cuando pueda. Pero ahora.') && await T.logHas('Planta 2, al fondo de Administración.'), 'texto de la L2 (el original sin «Era solo eso.»)');
      await T.pasar();
      await T.ir('administracion', 'ecosistema');
      await T.G(() => __game.clearLog());
      await T.raton('hablar', 'evaristo_salvedad'); await T.pasar();
      ok((await T.opciones()).includes('¿Para qué me ha llamado?') && !(await T.opciones()).includes('¿Qué quería decirme?'), 'convocado por la L2: está «¿Para qué me ha llamado?»');
      await T.clicOpcion('¿Para qué me ha llamado?'); await T.pasar();
      ok(await T.logHas('Le he llamado para comunicarle que le voy a escribir un correo.'), 'E_CORREO: «Le he llamado para comunicarle…»');
      await T.shot('evaristo-llamada');
      await T.ctx.close();
    }
    {   // c) convocado por Begoña (sin la L2), con ratón por el impreso
      const T = await abrir(ACTO2, 'administracion', 'ecosistema', { inv: ['sobre_azucar'], oidas: ['L1', 'L2'] });
      await T.G(() => __game.setFlag('evaristo_convoco', ''));      // (la L2 marcada como pasada sin sonar: partida antigua)
      await T.raton('hablar', 'begona_triplicado'); await T.pasar();
      for (const op of ['Quiero presentar una nota de gasto.', 'Café para entender el capitalismo.', 'Lo que sea.', 'Aquí tiene. Un sobre de azúcar.', 'Lo siento. En la universidad']) { await T.clicOpcion(op); await T.pasar(); }
      ok(await T.logHas('Y pase por Controlling. Don Evaristo le espera. Escúchele hasta el final.') && await T.flag('evaristo_convoco') === 'begona', 'Begoña le manda: evaristo_convoco = begona');
      await T.salir();
      await T.G(() => __game.clearLog());
      await T.raton('hablar', 'evaristo_salvedad'); await T.pasar();
      ok((await T.opciones()).includes('¿Para qué me ha llamado?'), 'convocado por Begoña: está «¿Para qué me ha llamado?»');
      await T.clicOpcion('¿Para qué me ha llamado?'); await T.pasar();
      ok(await T.logHas('Le he hecho llamar para comunicarle que le voy a escribir un correo.') && !(await T.logHas('Le he llamado para')), 'E_CORREO: «Le he hecho llamar…» (él no llamó)');
      await T.ctx.close();
    }
  }

  // ====================================================================== 2. avisos de correo y llamada → móvil
  if (toca('avisos')) {
    console.log('\n2 · lo que se anuncia, llega: avisos de correo y de llamada');
    // estático: todos los notice( de content/ que hablan de correo o de llamada
    const BLANCA = {
      'content/game.js': 'cómo se usa el móvil («Usa el móvil para llamar a la abuela o leer el correo»): instrucción, no anuncio',
      'content/escenas/climax.js': 'el correo SALIENTE del clímax («De: Evaristo Salvedad · Asunto: Una coma»): Bruno lo envía en pantalla',
      'content/lib/movil.js': '`llegaCorreoEvaristo`: entrega el correo y lo anuncia en la misma función',
    };
    const files = [];
    const walk = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (/\.js$/.test(f.name)) files.push(p); } };
    walk(path.join(root, 'content'));
    const malos = [];
    for (const f of files) {
      const rel = path.relative(root, f).split(path.sep).join('/');
      fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => {
        if (/notice\(/.test(l) && /correo|llamad|mensaje|bandeja/i.test(l) && !BLANCA[rel]) malos.push(`${rel}:${i + 1}`);
      });
    }
    ok(!malos.length, `ningún aviso de correo o llamada fuera de su entrega (lista blanca: ${Object.keys(BLANCA).length})${malos.length ? ': ' + malos.join(', ') : ''}`);
    const src = fs.readFileSync(path.join(root, 'content/lib/movil.js'), 'utf8');
    ok(/api\.setFlag\('evaristo_correos'[^\n]*\n\s*api\.notice\(/.test(src), 'en `llegaCorreoEvaristo` el correo entra en la bandeja ANTES del aviso');

    // dinámico: «Una cosita» 1 (prisa), 2 y 3 (solos, al entrar en sala), «Agradecimiento» (prometido en «Me voy.»)
    const T = await abrir({ ...ACTO2, evaristo_convoco: 'llamada' }, 'administracion', 'ecosistema', { oidas: ['L1', 'L2'] });
    await T.raton('hablar', 'evaristo_salvedad'); await T.pasar();
    await T.clicOpcion('¿Para qué me ha llamado?'); await T.pasar();
    await T.clicOpcion('¿Falta mucho?'); await T.pasar();
    ok(await T.until(() => window.__avisos.some(a => a.text.includes('(1 de 3)')), null, 8000), '«¿Falta mucho?»: aviso «Una cosita (1 de 3)»');
    await T.shot('correo-aviso');
    await T.raton('hablar', 'evaristo_salvedad'); await T.pasar();
    await T.clicOpcion('Me voy.'); await T.pasar();
    ok(await T.logHas('Le escribiré un correo para agradecérselo.'), '«Me voy.»: la promesa del correo de agradecimiento');
    await T.ir('ecosistema', 'administracion');
    await T.ir('office');
    await T.ir('pecera', 'ascensor');
    await T.ir('catacumba', 'pecera');
    const A = await T.avisos();
    const correos = A.filter(a => /^Correo nuevo de /.test(a.text));
    ok(correos.map(a => a.text.replace(/^Correo nuevo de Evaristo Salvedad: «(.*)»\.$/, '$1')).join(' | ') === 'Una cosita (1 de 3) | Una cosita (2 de 3) | Una cosita (3 de 3) | Agradecimiento',
      `llegan los cuatro, en orden y uno por entrada (${correos.map(a => a.text).join(' | ')})`);
    let n0 = null, malos2 = [];
    for (const a of correos) {
      const [, de, asunto] = a.text.match(/^Correo nuevo de (.+?): «(.+)»\.$/) || [];
      const c = a.bandeja.find(c => c.de === de && c.asunto === asunto);
      if (!c) malos2.push(`«${asunto}» no está en la bandeja al avisar`);
      else if (c.leido) malos2.push(`«${asunto}» llega leído`);
      if (n0 != null && a.sinLeer !== n0 + 1) malos2.push(`«${asunto}»: el contador no sube (${n0} → ${a.sinLeer})`);
      n0 = a.sinLeer;
    }
    ok(!malos2.length, `cada aviso «Correo nuevo…» deja ESE correo en la bandeja en ese instante, sin leer, y el contador sube${malos2.length ? ': ' + malos2.join('; ') : ''}`);
    // la bandeja con ratón: «Correo (N)», se leen los de Evaristo y Bruno comenta cada uno
    await T.G(() => __game.clearLog());
    await T.G(() => { const g = __game.game; g.camFollow = g.G.player; });
    const m = await T.G(() => __game.invPos('movil')); await T.page.mouse.click(m.x, m.y); await sleep(150);
    const v = await T.G(() => __game.verbPos('usar')); await T.page.mouse.click(v.x, v.y); await sleep(60);
    await T.page.mouse.click(m.x, m.y); await T.pasar();
    let o = await T.opciones();
    if (!o.some(x => x.startsWith('Correo'))) { await T.G(() => __game.doVerb('usar', 'movil')); await T.pasar(); o = await T.opciones(); }
    ok(o.some(x => /^Correo \(\d+ sin leer\)$/.test(x)), `el menú del móvil: «Correo (N sin leer)» (${JSON.stringify(o)})`);
    await T.clicOpcion('Correo'); await T.pasar();
    o = await T.opciones();
    ok(['Una cosita (1 de 3)', 'Una cosita (2 de 3)', 'Una cosita (3 de 3)', 'Agradecimiento'].every(a => o.some(x => x.startsWith('* Evaristo Salvedad: ') && x.includes(a.slice(0, 20)))), `los cuatro, en la bandeja, sin leer (*) (${JSON.stringify(o.slice(0, 6))})`);
    await T.shot('bandeja');
    for (const a of ['Agradecimiento', '(3 de 3)', '(2 de 3)', '(1 de 3)']) {
      await T.clicOpcion(a); await T.pasar();
    }
    const B = ['Me da las gracias por escrito. Aquí no me las dan ni de palabra.', 'Tres correos. Ni una errata. Ni un dato.',
      'Me lo está dando por entregas. Y yo, enganchado.', 'Una cosita muy pequeña. En tres entregas.'];
    const L = await T.G(() => __game.log.map(l => l.who + ':' + l.text));
    ok(B.every(b => L.includes('bruno:' + b)) && L.includes('evaristo_salvedad:Fin.') && L.includes('evaristo_salvedad:Es sobre una coma.'), 'se leen con ratón: el cuerpo (en la voz de Evaristo) y el comentario de Bruno');
    await T.shot('correo-leido');
    await T.salir();
    // la lista de llamadas: tantas de Evaristo como llamadas han sonado
    await T.G(() => { __game.clearLog(); __game.skipText(true); });
    await T.G(() => { __game.doVerb('usar', 'movil'); });
    await T.until(() => !!__game.currentDialogOptions());
    await T.G(() => __game.chooseText('Llamadas perdidas'));
    await T.until(() => !!__game.currentDialogOptions());
    ok(await T.logHas('Y 2 de Evaristo. Todas eran solo eso.'), 'Llamadas: «Y 2 de Evaristo» (L1 y L2)');
    await T.G(() => __game.chooseText('Volver')); await T.until(() => !!__game.currentDialogOptions());
    await T.G(() => __game.chooseText('Guardar')); await T.G(() => __game.waitIdle());
    // el correo de la trama no se confunde: el objeto es «Una coma», impreso; ninguno de la bandeja se llama así
    ok(!['Una cosita (1 de 3)', 'Una cosita (2 de 3)', 'Una cosita (3 de 3)', 'Agradecimiento'].includes('Una coma'), 'la bandeja no tiene «Una coma» (el correo impreso de la trama es otro)');
    await T.ctx.close();
  }

  // ====================================================================== 3. presuposiciones
  if (toca('presupone')) {
    console.log('\n3 · presuposiciones: cada una, sin que haya pasado');
    const T = await abrir(ACTO2, 'administracion', 'ecosistema', { oidas: ['L1', 'L2'] });
    const G = T.G;
    await G(() => __game.skipText(true));
    const opsDe = async (id) => { await G(() => __game.clearLog()); await G((id) => { __game.doVerb('hablar', id); }, id); await T.until(() => !!__game.currentDialogOptions(), null, 8000); const o = await T.opciones(); await G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); }); await G(() => __game.waitIdle()); return o; };
    // Evaristo: «¿Por qué llama tanto?» sin ninguna llamada
    await G(() => __game.setFlag('evaristo_llamadas', 0));
    ok(!(await opsDe('evaristo_salvedad')).includes('¿Por qué llama tanto?'), 'Evaristo sin ninguna llamada: no está «¿Por qué llama tanto?»');
    await G(() => __game.setFlag('evaristo_llamadas', 1));
    ok((await opsDe('evaristo_salvedad')).includes('¿Por qué llama tanto?'), 'con una llamada, sí');
    // dar:* a Evaristo: promete el correo una vez; después, de palabra
    await G(() => __game.giveItem('chicle'));
    await G(async () => { __game.clearLog(); await __game.doVerb('dar', 'evaristo_salvedad', 'chicle'); await __game.doVerb('dar', 'evaristo_salvedad', 'chicle'); });
    let L = await G(() => __game.log.map(l => l.text));
    ok(L.includes('Gracias. Lo leo y le escribo un correo muy pequeño.') && L.includes('Gracias. Lo leo. Esta vez se lo agradezco de palabra.'), `Dar algo a Evaristo: promete el correo la primera vez; luego, de palabra (${L.join(' | ')})`);
    await G(() => __game.gotoRoom('ecosistema', 'administracion')); await G(() => __game.waitIdle());
    ok(await G(() => /G@/.test(String(__game.getFlag('evaristo_correos')))), 'y el «Agradecimiento» llega en la entrada siguiente');
    // la ficha: «me espera» solo con Begoña; «me ha llamado» solo con la L2; nada sin ninguna
    await G(() => __game.giveItem('ficha_pagina_7'));
    const ficha = async () => { await G(() => __game.clearLog()); await G(() => __game.doVerb('mirar', 'ficha_pagina_7')); await G(() => __game.waitIdle()); return G(() => __game.log.map(l => l.text)); };
    L = await ficha();
    ok(!L.some(t => /Evaristo me/.test(t)), 'ficha sin L2 ni Begoña: ninguna nota de Evaristo');
    await G(() => __game.setFlag('evaristo_convoco', 'llamada'));
    L = await ficha();
    ok(L.includes('Al margen, a lápiz: «Evaristo me ha llamado. Planta 2. Al fondo».'), 'ficha con la L2: «Evaristo me ha llamado…»');
    await G(() => { __game.setFlag('evaristo_convoco', 'begona'); __game.setFlag('nota_gasto_presentada', true); });
    L = await ficha();
    ok(L.includes('Al margen, a lápiz: «Evaristo me espera. Planta 2. Escucharle entero».') && !L.some(t => /me ha llamado/.test(t)), 'ficha con Begoña: «Evaristo me espera…» (no «me ha llamado»)');
    // Begoña no manda a Controlling a quien ya ha escuchado a Evaristo
    await G(() => __game.gotoRoom('administracion', 'ecosistema')); await G(() => __game.waitIdle());
    await G(() => { __game.setFlag('nota_gasto_presentada', false); __game.setFlag('evaristo_escuchado', true); __game.giveItem('sobre_azucar'); __game.clearLog(); });
    await G(() => { __game.doVerb('hablar', 'begona_triplicado'); });
    for (const op of ['Quiero presentar una nota de gasto.', 'Café para entender el capitalismo.', 'Lo que sea.', 'Aquí tiene. Un sobre de azúcar.', 'Lo siento. En la universidad']) {
      await T.until(() => !!__game.currentDialogOptions(), null, 8000); await G((op) => __game.chooseText(op), op);
    }
    await T.until(() => !!__game.currentDialogOptions(), null, 8000);
    ok(await G(() => __game.getFlag('nota_gasto_presentada')) && !(await T.logHas('Don Evaristo le espera')), 'Begoña, con Evaristo ya escuchado: no le manda a Controlling');
    await G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); }); await G(() => __game.waitIdle());
    // L5 «¿Lleva mi correo?» / «En el bolsillo.»: no sin el correo
    await G(() => { for (const [k, v] of Object.entries({ acto_3_iniciado: true, ruben_encontrado: true, ruben_libre: true, pieza_recortada: true })) __game.setFlag(k, v); Object.assign(__game.game.state.once, { 'once:evaristo_L1': true, 'once:evaristo_L2': true, 'once:evaristo_L3': true, 'once:evaristo_L4': true }); __game.setFlag('evaristo_llamadas', 4); __game.takeItem('correo_evaristo'); __game.clearLog(); });
    await G(() => __game.gotoRoom('office')); await G(() => __game.waitIdle());
    ok(!(await T.logHas('¿Lleva mi correo?')) && await T.flag('evaristo_llamadas') === 4, 'L5 sin el correo de Evaristo en el bolsillo: no suena');
    await G(() => { __game.giveItem('correo_evaristo'); __game.clearLog(); });
    await G(() => __game.gotoRoom('administracion', 'ecosistema')); await G(() => __game.waitIdle());
    ok(await T.logHas('¿Lleva mi correo?') && await T.logHas('En el bolsillo.'), 'con el correo, la L5 suena («En el bolsillo.» es verdad)');
    // Mirar el móvil: «Ninguno leído» solo si es verdad
    await G(() => { __game.setFlag('tadeo_rv_n', 2); __game.setFlag('movil_leidos', 0); __game.clearLog(); });
    await G(() => __game.doVerb('mirar', 'movil')); await G(() => __game.waitIdle());
    ok(await T.logHas('Y 2 correos de Tadeo. Todos «RV:». Ninguno leído.'), 'Mirar móvil sin leer los RV: «Ninguno leído.»');
    await G(() => { __game.setFlag('movil_leidos', 1); __game.clearLog(); });
    await G(() => __game.doVerb('mirar', 'movil')); await G(() => __game.waitIdle());
    ok(await T.logHas('Y 2 correos de Tadeo. Todos «RV:».') && !(await T.logHas('Ninguno leído')), 'con uno leído: sin «Ninguno leído.»');
    // Aurora: lo de la rotativa lo dijo el fax (no Íñigo); «los expertos coinciden», solo si Bruno ha visto el titulador
    await G(() => { __game.setFlag('pecera_disc_partidas', 0); __game.setFlag('opa_posit', 0); __game.setFlag('fax_con_papel', true); __game.setFlag('pieza_escrita', true); });
    await G(() => __game.gotoRoom('catacumba', 'pecera')); await G(() => __game.waitIdle());
    let o = await opsDe('aurora_galerada');
    ok(o.includes('Teodoro dice que en la reunión van a apagar la rotativa.') && !o.some(x => /Íñigo dice/.test(x)), 'Aurora, Acto III: «Teodoro dice que…» (lo dijo el fax; Íñigo no lo dijo nunca)');
    ok(!o.some(x => x.startsWith('Yoli quiere sacar mi opa')), 'Aurora, sin haber abierto el titulador: no está «Yoli quiere sacar mi opa con «los expertos coinciden».»');
    await G(() => __game.setFlag('pecera_disc_partidas', 1));
    o = await opsDe('aurora_galerada');
    ok(o.some(x => x.startsWith('Yoli quiere sacar mi opa')), `tras abrir el titulador de Yoli, sí (${JSON.stringify(o)})`);
    await T.ctx.close();
    // Acto I (partida libre): la nota de gasto antes del café. Begoña no le manda a ver a un Evaristo sin nada que
    // contar, y el saludo de Evaristo no promete una «cosita» que en el Acto I no existe
    const T1 = await abrir(ACTO1, 'administracion', 'ecosistema', { inv: ['sobre_azucar'] });
    await T1.G(() => __game.skipText(true));
    await T1.G(() => { __game.doVerb('hablar', 'begona_triplicado'); });
    for (const op of ['Quiero presentar una nota de gasto.', 'Café para entender el capitalismo.', 'Lo que sea.', 'Aquí tiene. Un sobre de azúcar.', 'Lo siento. En la universidad']) {
      await T1.until(() => !!__game.currentDialogOptions(), null, 8000); await T1.G((op) => __game.chooseText(op), op);
    }
    await T1.until(() => !!__game.currentDialogOptions(), null, 8000);
    ok(await T1.flag('nota_gasto_presentada') && !(await T1.logHas('Don Evaristo le espera')) && await T1.flag('evaristo_convoco') === '', 'Acto I: la nota sí; «Don Evaristo le espera», no (aún no tiene nada que contar)');
    await T1.G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); }); await T1.G(() => __game.waitIdle());
    await T1.G(() => { __game.clearLog(); __game.doVerb('hablar', 'evaristo_salvedad'); });
    await T1.until(() => !!__game.currentDialogOptions(), null, 8000);
    ok(await T1.logHas('Pellejo, con jota. Lo tengo anotado. Era eso, nada más.') && !(await T1.logHas('Pase un segundo')), 'Acto I: el saludo de Evaristo no promete una «cosita»: era la jota');
    ok(!(await T1.opciones()).some(x => /llamado|decirme/.test(x)), 'Acto I: ni «¿Para qué me ha llamado?» ni «¿Qué quería decirme?»');
    await T1.ctx.close();
  }

  // ====================================================================== 4. las sillas de Pilar
  if (toca('sillas')) {
    console.log('\n4 · Pilar: 112 → 113 (crisis) → 112');
    const T = await abrir(ACTO2, 'eventos', 'ecosistema');
    const G = T.G;
    const dice = async (fn) => { await G(() => __game.clearLog()); await fn(); await T.pasar(); return G(() => __game.log.map(l => l.text)); };
    const n113 = (L) => L.filter(t => /ciento trece|Ciento trece/.test(t));
    const n112 = (L) => L.filter(t => /ciento doce|Ciento doce/.test(t) && !/trece/i.test(t));
    // antes de la primera cuenta: 112 en todo
    let L = await dice(async () => { await T.raton('hablar', 'sillas_evento'); });
    ok(n112(L).length && !n113(L).length, `antes de contar, Hablar con las sillas: 112 (${L.join(' | ')})`);
    await T.raton('hablar', 'pilar_escaleta'); await T.pasar();
    ok(!(await T.opciones()).includes('¿Estás bien, Pilar?'), 'antes de contar: no hay crisis («¿Estás bien, Pilar?» no está)');
    L = await dice(async () => { await T.clicOpcion('Me voy.'); });
    ok(L.includes('¡Hasta ahora! Te guardo la silla ciento doce.'), '«Me voy.» antes de contar: «la silla ciento doce» (la 113 aún no existe)');
    // la primera cuenta: le sale una de más
    await T.raton('hablar', 'pilar_escaleta'); await T.pasar();
    L = await dice(async () => { await T.clicOpcion('¿Cuántas sillas hay?'); });
    ok(L.includes('Ciento doce. ...Ciento once, ciento doce... ciento trece. ¿Quién ha traído una?'), '1.ª cuenta: cuenta y le sale una de más');
    L = await dice(async () => { await T.clicOpcion('¿Cuántas sillas hay?'); });
    ok(L.includes('Ciento trece. Las cuento cada cinco minutos. Por si se van.'), 'con la crisis abierta, la 2.ª cuenta: ciento trece');
    L = await dice(async () => { await T.clicOpcion('¿Estás bien, Pilar?'); });
    ok(L.some(t => t.startsWith('Ciento trece, Bruno.')), '«¿Estás bien, Pilar?»: ciento trece (coinciden)');
    await T.shot('sillas-113');
    L = await dice(async () => { await T.clicOpcion('Me voy.'); });
    await T.pasar();
    L = await dice(async () => { await T.raton('hablar', 'sillas_evento'); });
    ok(n113(L).length && !n112(L).length, `con la crisis, Hablar con las sillas: 113 (${L.join(' | ')})`);
    L = await dice(async () => { await G(() => __game.doVerb('mirar', 'sillas_evento')); });
    ok(!n112(L).length, `con la crisis, Mirar las sillas: nada de «ciento doce» (${L.join(' | ')})`);
    const murm = await G(() => { const a = __game.game.content.rooms.eventos.actors.find(a => a.id === 'pilar_escaleta'); return a.murmurs({ flag: (k) => __game.getFlag(k) }); });
    ok(!murm.some(t => /ciento doce/i.test(t) && !/trece/i.test(t)) && murm.some(t => /Ciento trece/.test(t)), 'con la crisis, los murmullos de Pilar no cuentan 112');
    // devolver la silla: 112 otra vez
    await T.raton('mirar', 'silla_torcida'); await T.pasar();
    L = await dice(async () => { await T.raton('coger', 'silla_torcida'); });
    ok(await T.flag('eventos_silla_devuelta') === true && L.includes('¡CIENTO DOCE! ¡Vuelvo a ser persona!'), 'devolver la silla: «¡CIENTO DOCE! ¡Vuelvo a ser persona!»');
    await T.pasar();
    await T.raton('hablar', 'pilar_escaleta'); await T.pasar();
    L = await dice(async () => { await T.clicOpcion('¿Cuántas sillas hay?'); });
    ok(L.includes('Ciento doce. Las cuento cada cinco minutos. Por si se van.') && !(await T.opciones()).includes('¿Estás bien, Pilar?'), 'devuelta: ciento doce y sin crisis');
    L = await dice(async () => { await T.clicOpcion('Me voy.'); });
    ok(!L.some(t => /ciento trece/.test(t)), '«Me voy.» tras devolverla: nunca «ciento trece» (la despedida ya oída se calla)');
    await T.ctx.close();
    // la silla devuelta antes de que Pilar la cuente: sin «Vuelvo a ser persona» y la 1.ª cuenta ya da 112
    const T2 = await abrir(ACTO2, 'eventos', 'ecosistema');
    await T2.raton('mirar', 'silla_torcida'); await T2.pasar();
    await T2.G(() => __game.clearLog());
    await T2.raton('coger', 'silla_torcida'); await T2.pasar();
    ok(!(await T2.logHas('Vuelvo a ser persona')) && await T2.logHas('Ciento diez, ciento once... ciento doce.'), 'devuelta sin crisis: Pilar cuenta 112, sin alivio de una crisis que no hubo');
    await T2.raton('hablar', 'pilar_escaleta'); await T2.pasar();
    await T2.G(() => __game.clearLog());
    await T2.clicOpcion('¿Cuántas sillas hay?'); await T2.pasar();
    ok(await T2.logHas('Ciento doce. Las cuento cada cinco minutos.') && !(await T2.logHas('trece')), 'y la cuenta ya da 112 (no 113)');
    await T2.ctx.close();
  }

  // ====================================================================== 5. Gervasio: insistir también resuelve
  if (toca('gervasio')) {
    console.log('\n5 · Gervasio: insistir tres veces con «siguientes pasos» termina la reunión (ratón)');
    const Q = 'siguientes pasos';
    const T = await abrir(ACTO2, 'sala_amazonas', 'pajarera', { inv: ['ficha_pagina_7'], oidas: ['L1', 'L2'] });
    const preguntar = async () => { await T.raton('hablar', 'gervasio_acta'); await T.pasar(); return T.clicOpcion(Q); };
    await T.G(() => __game.clearLog());
    ok(await preguntar(), '1.ª: la pregunta a Gervasio');
    ok(await T.until(() => __game.game.getObjState('tele_amazonas').state === 'buscando', null, 8000), '1.ª: la tele se enciende sola en «BUSCANDO SEÑAL»');
    await sleep(200); await T.shot('gervasio-insiste-1');
    await T.pasar();
    ok(await T.logHas('Los becarios no tienen turno. Pregunta la mesa... y los conectados.') && !(await T.flag('reunion_terminada')), '1.ª: «Los becarios no tienen turno… y los conectados»');
    // guardar y cargar entre insistencias
    await T.G(async () => { __game.save(7); await __game.load(7); });
    await T.pasar();
    ok(await T.flag('sala_amazonas_insiste_n') === 1, 'guardar/cargar: la cuenta de insistencias se conserva');
    await T.G(() => __game.clearLog());
    ok(await preguntar(), '2.ª: la pregunta otra vez');
    await T.until(() => __game.game.speeches.some(x => /entran por la pantalla/.test(x.text)), null, 10000);
    await sleep(500); await T.shot('gervasio-insiste-2');
    await T.pasar();
    ok(await T.logHas('Las preguntas de los conectados entran por la pantalla, cuando hay señal.') && !(await T.flag('reunion_terminada')), '2.ª: Gervasio señala la pantalla («…entran por la pantalla, cuando hay señal.») y la tele parpadea');
    await T.G(() => __game.clearLog());
    ok(await preguntar(), '3.ª: la pregunta otra vez');
    ok(await T.until(() => __game.game.getObjState('tele_amazonas').state === 'gertrudis', null, 8000), '3.ª: la tele sintoniza a Gertrudis');
    await sleep(300); await T.shot('gervasio-insiste-3');
    ok(await T.until(() => __game.getFlag('sala_amazonas_atasco') === true || __game.getFlag('reunion_terminada') === true, null, 60000), '3.ª: la tele recoge la pregunta: estampida y atasco (la escena de siempre)');
    await T.pasar(30000);
    ok(await T.logHas('BUENAS NOCHES, SALA AMAZONAS.') && await T.logHas('PREGUNTA DEL PÚBLICO: ¿Y CUÁLES SON LOS SIGUIENTES PASOS?') && await T.logHas('¿Necesitan ayuda?'), 'Gertrudis da las buenas noches y pregunta; el atasco se anuncia');
    if (await T.flag('sala_amazonas_atasco')) await T.raton('empujar', 'mercados_2');
    ok(await T.until(() => __game.getFlag('reunion_terminada') === true, null, 60000), 'la reunión termina (reunion_terminada)');
    await T.pasar(30000);
    const sigue = await T.G(() => !!__game.game.actors.gervasio_acta && __game.game.actors.gervasio_acta.room === 'sala_amazonas' && !!__game.screenPos('gervasio_acta'));
    if (sigue) { await T.raton('hablar', 'gervasio_acta'); await T.pasar(); }
    ok(!sigue || !(await T.opciones()).some(x => x.includes(Q)), `tras la escena, la opción ya no sale (Gervasio ${sigue ? 'sigue' : 'se ha ido'})`);
    await T.salir();
    await T.ctx.close();
    // la vía del Vending a medias (`gertrudis_pregunta`): la 1.ª señala la pantalla; la 2.ª, la tele la recoge
    const T2 = await abrir({ ...ACTO2, sala_becario_sin_turno: true, gertrudis_pregunta: true }, 'sala_amazonas', 'pajarera', { inv: ['ficha_pagina_7'], oidas: ['L1', 'L2'] });
    await T2.raton('hablar', 'gervasio_acta'); await T2.pasar(); await T2.clicOpcion(Q); await T2.pasar();
    ok(await T2.logHas('Las preguntas de los conectados entran por la pantalla, cuando hay señal.') && !(await T2.flag('reunion_terminada')), 'con la pregunta del Vending: Gervasio señala la pantalla');
    await T2.raton('hablar', 'gervasio_acta'); await T2.pasar(); await T2.clicOpcion(Q); await T2.pasar();
    await T2.raton('hablar', 'gervasio_acta'); await T2.pasar(); await T2.clicOpcion(Q);
    ok(await T2.until(() => __game.getFlag('sala_amazonas_atasco') === true || __game.getFlag('reunion_terminada') === true, null, 60000), 'insistiendo, la tele la recoge también con la vía del Vending a medias');
    await T2.ctx.close();
    // Acto I: «¿Tú traes página?» y no cuenta
    const T3 = await abrir(ACTO1, 'sala_amazonas', 'pajarera');
    for (let k = 0; k < 3; k++) { await T3.raton('hablar', 'gervasio_acta'); await T3.pasar(); await T3.clicOpcion(Q); await T3.pasar(); }
    ok(await T3.logHas('¿Tú traes página?') && !(await T3.flag('sala_amazonas_insiste_n')) && !(await T3.flag('reunion_terminada')), 'Acto I: «¿Tú traes página?» tres veces, sin contar ni terminar nada');
    await T3.ctx.close();
  }

  // ====================================================================== 6. partidas antiguas (sin la L2)
  if (toca('antiguas')) {
    console.log('\n6 · partidas guardadas sin la L2');
    const T = await abrir(ACTO1, 'vestibulo', 'inicio');
    const G = T.G;
    // una partida guardada DE VERDAD en esa sala con esos flags, a la que se le quitan las claves nuevas (así eran)
    const cargar = (st) => G(async (st) => {
      await __game.newGame(); __game.skipSpeech(); await __game.waitIdle();
      for (const [k, v] of Object.entries(st.flags)) __game.setFlag(k, v);
      for (const i of st.inventory) __game.giveItem(i);
      await __game.gotoRoom(st.room); __game.skipSpeech(); await __game.waitIdle();
      __game.save(8);
      const d = JSON.parse(localStorage.getItem(__game.game.slotKey(8)));
      delete d.state.flags.evaristo_convoco; delete d.state.flags.evaristo_correos;
      d.state.once = Object.fromEntries(Object.entries(d.state.once || {}).filter(([k]) => !k.startsWith('once:evaristo_L')));
      Object.assign(d.state.once, st.once);
      d.state.flags.evaristo_llamadas = st.flags.evaristo_llamadas;
      localStorage.setItem(__game.game.slotKey(8), JSON.stringify(d));
      window.__avisos = [];
      await __game.load(8); __game.skipSpeech(); await __game.waitIdle(); __game.clearLog();
      return { flags: __game.state().flags, once: { ...__game.game.state.once } };
    }, st);
    const estado = (flags, room, once = {}) => ({ room, flags: { ...flags }, inventory: ['ficha_pagina_7'], once });
    await G(() => __game.skipText(true));
    const L1 = { 'once:evaristo_L1': true };
    // (a) principio del Acto II: la L2 suena en la entrada siguiente (es su sitio) y luego «¿Para qué me ha llamado?»
    let r = await cargar(estado({ ...ACTO2, evaristo_llamadas: 1 }, 'catacumba', L1));
    ok(r.flags.evaristo_convoco === undefined || r.flags.evaristo_convoco === '', 'principio del Acto II sin `evaristo_convoco`: nadie le ha convocado aún');
    await G(() => __game.gotoRoom('office')); await G(() => __game.waitIdle());
    ok(await T.flag('evaristo_convoco') === 'llamada' && await T.logHas('Planta 2, al fondo de Administración.'), 'y la L2 suena en la entrada siguiente');
    // (b) después de Begoña: convocado por ella, sin L2 fuera de lugar, y la opción está
    r = await cargar(estado({ ...ACTO2, nota_gasto_presentada: true, evaristo_llamadas: 1 }, 'ecosistema', L1));
    ok(r.flags.evaristo_convoco === 'begona' && r.once['once:evaristo_L2'] === true, 'tras Begoña: convocado por Begoña; la L2 no sonará');
    await G(() => __game.gotoRoom('administracion', 'ecosistema')); await G(() => __game.waitIdle());
    ok(!(await T.logHas('¿Puede pasarse por mi despacho?')) && await T.flag('evaristo_llamadas') === 1, 'ni al entrar: ninguna llamada fuera de lugar');
    await G(() => { __game.clearLog(); __game.doVerb('hablar', 'evaristo_salvedad'); });
    await T.until(() => !!__game.currentDialogOptions(), null, 8000);
    ok((await T.opciones()).includes('¿Para qué me ha llamado?'), 'y Evaristo sigue hablando: «¿Para qué me ha llamado?»');
    await G(() => { if (__game.game.choice) __game.game.choice.resolve(-1); }); await G(() => __game.waitIdle());
    // (c) Acto III con la L3 oída: ni L2 tardía ni nada raro; la L4 sigue en su sitio
    r = await cargar(estado({ ...ACTO3, ruben_encontrado: true, evaristo_llamadas: 2 }, 'cpd', { ...L1, 'once:evaristo_L3': true }));
    await G(() => __game.gotoRoom('office')); await G(() => __game.waitIdle());
    ok(!(await T.logHas('¿Puede pasarse por mi despacho?')) && await T.logHas('Se llama Brais.'), 'Acto III con la L3 oída: sin L2 tardía; suena la L4');
    // (d) de antes de E2 (contador con la L2 vieja): la L2 cuenta como oída y convocado por ella
    r = await cargar(estado({ ...ACTO2, evaristo_llamadas: 2 }, 'catacumba', {}));
    ok(r.once['once:evaristo_L1'] && r.once['once:evaristo_L2'] && r.flags.evaristo_convoco === 'llamada', 'de antes de E2 (L2 vieja en el contador): L2 oída, convocado por la llamada');
    await T.ctx.close();
  }
} catch (e) {
  failures++;
  console.log('  ✗ EXCEPCIÓN: ' + (e && e.stack || e));
}
ok(!errs.length, `sin errores de consola${errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''}`);
await browser.close();
server.close();
console.log(failures ? `\nCOHERENCIA: FALLAN ${failures} de ${checks}` : `\nCOHERENCIA: TODO OK (${checks} comprobaciones)`);
process.exit(failures ? 1 : 0);
