#!/usr/bin/env node
// Walkthrough de EXTRAS (adenda §12): reproduce el walkthrough 5.4 completo (walk-data.mjs) INTERCALANDO los pasos X
// de la tabla 12.2 de docs/GUION_ADENDA.md en el sitio indicado (`tras: N` = justo después del paso N de la biblia).
//   node tools/extras.mjs              todo
//   node tools/extras.mjs --hasta=X10  se para (con éxito) tras ese paso X (o tras el paso numérico, p. ej. --hasta=20)
//   node tools/extras.mjs --lento      sin modo rápido y con capturas
// Tras cada paso de la biblia se comprueban sus resultados; tras cada paso X, los de la tabla 12.2. Las llamadas de
// Evaristo, los «RV:» de Tadeo y los rumores salen solos (entrar en salas / Hablar): el test cierra el globo y sigue
// (walk-lib.mjs `startDismisser`) y comprueba los CONTADORES en los puntos de control (filas «—»).
// Mientras falten las partes de la adenda por implementar FALLARÁ en el primer paso X pendiente: es lo esperado.
// Acciones y formato de `esp`: ver la cabecera de walkthrough.mjs.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { STEPS } from './walk-data.mjs';
import { createRunner, StepFail } from './walk-lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));

const V = (verbo, obj) => ['verbo', verbo, obj];
const O = (t) => ['opcion', t];
const SALIR = ['cerrar'];
// ------------------------------------------------------------------ adenda 12.2 (X1…X26)
const X = [
  { n: 'X1', tras: 7, sala: 'vestibulo', txt: 'Hablar planta_plastico', acc: [V('hablar', 'planta_plastico')], esp: { flags: ['planta_oyo'] } },
  { n: 'X2', tras: 7, sala: 'vestibulo', txt: 'Empujar planta_plastico', acc: [V('empujar', 'planta_plastico')], esp: { flags: { planta_empujada_n: 1 } } },
  { n: 'X3', tras: 7, sala: 'vestibulo', txt: 'Hablar celestino → (rumor A1) → «Nada, Celestino.»', acc: [V('hablar', 'celestino'), SALIR], esp: { flags: { rumor_firma_n: 1 } } },
  { n: 'X4', tras: 7, sala: 'vestibulo', txt: 'Mirar rama_diseno · Usar altavoz_ibex', acc: [V('mirar', 'rama_diseno'), V('usar', 'altavoz_ibex')], esp: {} },
  { n: 'X4b', tras: 7, sala: 'vestibulo', txt: 'Mirar cuadro_plazas ×3 · Hablar celestino → «¿Cómo se consigue una plaza de garaje?»', acc: [V('mirar', 'cuadro_plazas'), V('mirar', 'cuadro_plazas'), V('mirar', 'cuadro_plazas'), V('hablar', 'celestino'), O('¿Cómo se consigue una plaza de garaje?'), SALIR], esp: { flags: { cuadro_plazas_n: 3 } } },
  { n: '—10', tras: 10, sala: 'pajarera', txt: 'Control: al entrar en la pajarera salió la llamada L1', acc: [], esp: { flags: { evaristo_llamadas: 1 } } },
  { n: 'X5', tras: 13, sala: 'pecera', txt: 'Mirar sillas_con_chaqueta · Hablar leoncio_quesitos → «¿Qué es Herminia?»', acc: [V('mirar', 'sillas_con_chaqueta'), V('hablar', 'leoncio_quesitos'), O('¿Qué es Herminia?'), SALIR], esp: {} },
  { n: '—14', tras: 14, sala: 'office', txt: 'Control: el «Buenas noches» llevó antes el rumor A2', acc: [], esp: { flags: { rumor_firma_n: 2 } } },
  { n: '—17', tras: 17, sala: 'catacumba', txt: 'Control: A_MENU llevó antes el rumor C1', acc: [], esp: { flags: { rumor_teodoro_n: 1 } } },
  { n: '—20', tras: 20, sala: 'office', txt: 'Control: L2 ya salió', acc: [], esp: { flags: { evaristo_convoco: true, evaristo_llamadas: 2 } } },
  { n: 'X6', tras: 20, sala: 'office', txt: 'Hablar custodia_precinto → «¿Me deja un boli?» → «¿Y cómo se consigue un boli aquí?»', acc: [V('hablar', 'custodia_precinto'), O('¿Me deja un boli?'), O('¿Y cómo se consigue un boli aquí?'), SALIR], esp: { flags: ['custodia_regla'] } },
  { n: '—23', tras: 23, sala: 'pecera', txt: 'Control: Y0 llevó antes el rumor C2', acc: [], esp: { flags: { rumor_teodoro_n: 2 } } },
  { n: 'X7', tras: 24, sala: 'pecera', txt: 'Hablar anselmo_monolito → «¿Y el Titulator? Ese sí entró.»', acc: [V('hablar', 'anselmo_monolito'), O('¿Y el Titulator? Ese sí entró.'), O('Me voy.'), SALIR], esp: { flags: ['anselmo_dijo_regla'] } },
  { n: 'X8', tras: 24, sala: 'pecera', txt: 'Hablar leoncio_quesitos → «¿Y si Herminia tuviera alta en Sistemas?»', acc: [V('hablar', 'leoncio_quesitos'), O('¿Y si Herminia tuviera alta en Sistemas?'), SALIR], esp: { flags: ['leoncio_acepta_alta'] } },
  { n: 'X9', tras: 24, sala: 'pecera', txt: 'Abrir bandeja_diseno · Hablar coro_desarrollo → «Diseño os avisó de lo del CMS. En 2017.»', acc: [V('abrir', 'bandeja_diseno'), V('hablar', 'coro_desarrollo'), O('Diseño os avisó de lo del CMS. En 2017.'), SALIR], esp: { flags: ['bandeja_diseno_abierta'] } },
  { n: '—25', tras: 25, sala: 'cpd', txt: 'Control: P1 llevó antes el rumor B1', acc: [], esp: { flags: { rumor_atun_n: 1 } } },
  { n: 'X10', tras: 26, sala: 'cpd', txt: 'Hablar paco_ticket → «Quiero dar de alta a una becaria.» → «Herramienta.»', acc: [V('hablar', 'paco_ticket'), O('Quiero dar de alta a una becaria.'), O('Herramienta.'), SALIR], esp: { flags: ['herminia_de_alta'] } },
  { n: 'X11', tras: 26, sala: 'cpd', txt: 'Usar rejilla_cpd', acc: [V('usar', 'rejilla_cpd')], esp: { flags: { rejilla_n: 1 } } },
  { n: 'X12', tras: 26, sala: 'pecera', txt: 'Hablar anselmo_monolito → «Hay una becaria nueva en Desarrollo.»', acc: [['ir', 'pecera'], V('hablar', 'anselmo_monolito'), O('Hay una becaria nueva en Desarrollo.'), SALIR], esp: { flags: ['infografia_integrada'] } },
  { n: 'X11b', tras: 26, sala: 'pecera', txt: 'Hablar valentin_reticula → «¿Qué está dirigiendo?» → «¿Por qué trabaja aquí, al lado de Desarrollo?» → «¿Sabía que la pantalla tumbaba el CMS?» · Usar monitor_valentin', acc: [V('hablar', 'valentin_reticula'), O('¿Qué está dirigiendo?'), O('¿Por qué trabaja aquí, al lado de Desarrollo?'), O('¿Sabía que la pantalla tumbaba el CMS?'), O('Me voy.'), SALIR, V('usar', 'monitor_valentin')], esp: {} },
  { n: 'X13', tras: 26, sala: 'pecera', txt: 'Hablar coro_desarrollo → «Herminia ahora es de Desarrollo.»', acc: [V('hablar', 'coro_desarrollo'), O('Herminia ahora es de Desarrollo.'), SALIR], esp: {} },
  { n: 'X14', tras: 26, sala: 'pecera', txt: 'Hablar nerea_backlog → (rumor B2) → «Nada, ya me voy.»', acc: [V('hablar', 'nerea_backlog'), SALIR], esp: { flags: { rumor_atun_n: 2 } } },
  { n: 'X15', tras: 26, sala: 'pajarera', txt: 'Hablar inigo_sinergia → (rumor B3) → «Me voy.»', acc: [['ir', 'pajarera'], V('hablar', 'inigo_sinergia'), SALIR], esp: { flags: { rumor_atun_n: 3 } } },
  { n: 'X16', tras: 28, sala: 'ecosistema', txt: 'Mirar portatil_tadeo ×2', acc: [['ir', 'ecosistema'], V('mirar', 'portatil_tadeo'), V('mirar', 'portatil_tadeo')], esp: { flags: { portatil_tadeo_n: 2, rep_15: true } } },
  { n: 'X17', tras: 28, sala: 'ecosistema', txt: 'Hablar borja_engagement → (rumor A3 tras el ¡FLASH!) → «Me voy.»', acc: [V('hablar', 'borja_engagement'), SALIR], esp: { flags: { rumor_firma_n: 3 } } },
  { n: 'X17b', tras: 28, sala: 'ecosistema', txt: 'Hablar borja_engagement → (rumor D1) · Mirar piel_platano', acc: [V('hablar', 'borja_engagement'), SALIR, V('mirar', 'piel_platano')], esp: { flags: { rumor_plaza_n: 1, piel_platano_n: 1 } } },
  { n: '—29', tras: 28, sala: 'ecosistema', txt: 'Hablar maripaz_remitido → rumor C3 → «Me voy.» (antes de Dar planillo)', acc: [V('hablar', 'maripaz_remitido'), SALIR], esp: { flags: { rumor_teodoro_n: 3 } } },
  { n: 'X18', tras: 30, sala: 'administracion', txt: 'Usar puerta_controlling → «¿Algún cotilleo?»', acc: [['ir', 'administracion'], V('usar', 'puerta_controlling'), O('¿Algún cotilleo?'), SALIR], esp: { flags: ['rep_16'] } },
  { n: 'X18b', tras: 30, sala: 'administracion', txt: 'Hablar begona_triplicado → «¿Le han pedido algo raro hoy?»', acc: [V('hablar', 'begona_triplicado'), O('¿Le han pedido algo raro hoy?'), SALIR], esp: {} },
  { n: 'X19', tras: 30, sala: 'administracion', txt: 'Hablar evaristo_salvedad → «¿Para qué me ha llamado?» → «¿De qué trata?» → «Siga.» → «Siga, siga.» → «No pare.»', acc: [V('hablar', 'evaristo_salvedad'), O('¿Para qué me ha llamado?'), O('¿De qué trata?'), O('Siga.'), O('Siga, siga.'), O('No pare.'), SALIR], esp: { flags: ['evaristo_escuchado'] } },
  { n: 'X20', tras: 31, sala: 'catacumba', txt: 'Coger bolis_aurora', acc: [['ir', 'catacumba'], V('coger', 'bolis_aurora')], esp: { tiene: ['boli_muerto'], flags: ['boli_muerto_cogido'] } },
  { n: 'X21', tras: 33, sala: 'catacumba', txt: 'Hablar aurora_galerada → «Don Evaristo pregunta si su coma está bien.»', acc: [V('hablar', 'aurora_galerada'), O('Don Evaristo pregunta si su coma está bien.'), SALIR], esp: { flags: ['coma_bendecida'] } },
  { n: '—35', tras: 35, sala: 'catacumba', txt: 'Control: T0 llevó antes el desmentido C de Teodoro', acc: [], esp: { flags: { rumor_teodoro_n: 3 } } },
  { n: 'X22', tras: 36, sala: 'administracion', txt: 'Hablar evaristo_salvedad → «Aurora dice que su coma está bien.»', acc: [['ir', 'administracion'], V('hablar', 'evaristo_salvedad'), O('Aurora dice que su coma está bien.'), SALIR], esp: { flags: ['correo_evaristo_listo'] } },
  { n: '—37', tras: 37, sala: 'catacumba', txt: 'Control: al entrar en la catacumba salió L3', acc: [], esp: { flags: { evaristo_llamadas: 3 } } },
  { n: 'X23', tras: 37, sala: 'office', txt: 'Dar boli_muerto a custodia_precinto → «Para apuntar lo que me digan. Sin grabadora.» (al entrar en el Office sale L4)', acc: [['ir', 'office'], ['dar', 'boli_muerto', 'custodia_precinto'], O('Para apuntar lo que me digan. Sin grabadora.'), SALIR], esp: { flags: { custodia_ablandada: true, evaristo_llamadas: 4 }, notiene: ['boli_muerto'] } },
  { n: 'X24', tras: 37, sala: 'office', txt: 'Hablar custodia_precinto → «¿Dónde está...?» → «¿Dónde está el Titulator?» → «Ya está.»', acc: [V('hablar', 'custodia_precinto'), O('¿Dónde está...?'), O('¿Dónde está el Titulator?'), O('Ya está.'), SALIR], esp: {} },
  { n: '—38', tras: 37, sala: 'cpd', txt: 'Control: L4 (sin Rubén) salió al entrar en el Office de X23; L5 al pasar hacia el CPD', acc: [['ir', 'cpd']], esp: { flags: { evaristo_llamadas: 5 } } },
  { n: 'X23b', tras: 37, sala: 'cpd', txt: 'Hablar paco_ticket → (rumor D2) → «Me voy.» (antes de Tirar, paso 38)', acc: [V('hablar', 'paco_ticket'), SALIR], esp: { flags: { rumor_plaza_n: 2 } } },
  { n: '—39', tras: 39, sala: 'cpd', txt: 'Control: R0 llevó antes el desmentido B de Rubén', acc: [], esp: {} },
  { n: 'X25b', tras: 40, sala: 'pecera', txt: 'Hablar nerea_backlog → (rumor D3) → «Nada, ya me voy.» (antes del paso 41)', acc: [['ir', 'pecera'], V('hablar', 'nerea_backlog'), SALIR], esp: { flags: { rumor_plaza_n: 3 } } },
  { n: 'X25', tras: 41, sala: 'pecera', txt: 'Hablar yoli_tendencias → (rumor A4) → «Me voy.»', acc: [V('hablar', 'yoli_tendencias'), SALIR], esp: { flags: { rumor_firma_n: 4 } } },
  { n: '—42', tras: 42, sala: 'cpd', txt: 'Control: L1-L5 y RV1-RV5 ya han salido (RV5 en una entrada de los pasos 37-42)', acc: [], esp: { flags: { evaristo_llamadas: 5, tadeo_rv_n: 5 } } },
  { n: 'X26', tras: 42, sala: 'vestibulo', txt: 'Hablar celestino → (desmentido D) → «Nada, Celestino.»', acc: [['ir', 'vestibulo'], V('hablar', 'celestino'), SALIR], esp: {} },
];
const hasta = args.hasta ?? null;
const order = [];
for (const s of STEPS) { order.push(s); for (const x of X) if (x.tras === s.n) order.push(x); }
const stopIdx = hasta == null ? order.length : order.findIndex(s => String(s.n) === String(hasta)) + 1 || order.length;

const server = createServer(path.resolve(here, '..'));
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
const R = createRunner(page);
const { run, check, state, G } = R;

let lastOk = '—', failed = null, done = 0;
try {
  await page.goto(base);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* ignore */ } });
  await page.reload();
  await page.waitForFunction(() => !!window.__game);
  if (!args.lento) await G(() => __game.skipText(true));
  await R.startDismisser();
  await G(() => __game.newGame());
  console.log('Walkthrough de extras (adenda §12): §5.4 + pasos X intercalados\n');
  for (const s of order.slice(0, stopIdx)) {
    try {
      for (const a of s.acc) await run(a);
      await G(() => __game.waitIdle());
      await check(s.esp);
      console.log(`  ✓ ${String(s.n).padStart(4)} [${s.sala}] ${s.txt}`);
      lastOk = s.n; done++;
      if (args.lento) await page.screenshot({ path: path.join(here, 'shots', `extras-${String(s.n).replace(/\W/g, '_')}.png`) });
    } catch (e) {
      if (!(e instanceof StepFail)) throw e;
      failed = { s, msg: e.message };
      break;
    }
  }
} catch (e) {
  failed = failed || { s: null, msg: 'error del script: ' + (e && e.stack || e) };
}
if (failed) {
  const st = await state().catch(() => null);
  const log = await G(() => __game.log.slice(-6).map(l => `${l.who || '—'}: ${l.text}`)).catch(() => []);
  console.log(`\n  ✗ ${failed.s ? `PASO ${failed.s.n} [${failed.s.sala}] ${failed.s.txt}` : 'FALLO'}`);
  console.log(`    motivo: ${failed.msg}`);
  if (st) console.log(`    contexto: sala=${st.room} inventario=[${st.inventory.join(', ')}] diálogo=${JSON.stringify(st.dialog)} aviso=${st.aviso}`);
  if (log.length) console.log('    últimas líneas:\n      ' + log.join('\n      '));
  fs.mkdirSync(path.join(here, 'shots'), { recursive: true });
  try { await page.screenshot({ path: path.join(here, 'shots', 'extras-fallo.png') }); console.log('    captura: tools/shots/extras-fallo.png'); } catch (_) { /* ignore */ }
}
if (consoleErrors.length) console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  '));
console.log(failed ? `\nÚltimo paso correcto: ${lastOk} (${done} de ${stopIdx}). Fallo esperado mientras la adenda no esté implementada en las salas.` : `\nEXTRAS COMPLETO (${done} pasos)`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
