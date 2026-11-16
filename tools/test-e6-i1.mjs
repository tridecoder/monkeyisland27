#!/usr/bin/env node
// PRUEBA DEL PAQUETE I1 DE LA ENMIENDA E6 (comunes; docs/guion2/ENMIENDA_E6.md §10 I1). No depende del texto de las salas:
//   §2.5 L4: suena DESPUÉS de abrir el armario (`ruben_encontrado`, sin `ruben_libre`), con «Se llama Brais.»; no suena
//        antes (solo `acto_3_iniciado`) ni con Brais ya libre. Guardar/cargar con la L4 pendiente.
//   §6.4 «Hablar con Bruno» = «Mirar a Bruno» (la meta), también sin meta (la de reserva).
//   §6.5 Valentín: variante `casco_fuera` (sin cascos en la cabeza; el auricular en la mano) y vuelta a la normal. Captura.
//   §5.1 `hurtByPair.teodoro`: «...CABE.» en la R09, no en la R02.
//   §6.7 walk-lib: en un duelo con `cabe`, un id elige la corta y 'R09:larga' la larga (no suma fallo; el ataque se repite).
//   §2.3 / §2.9 pistas `turno` y `columna`; E344 `SIN_DESTINO`; §4.1 de los comunes (muestra); §4.3 murmullos.
//   node tools/test-e6-i1.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';
import { createRunner } from './walk-lib.mjs';

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

// ---------------------------------------------------------------- datos (sin navegador)
console.log('Datos comunes');
const pistas = await import('../content/pistas.js');
const duelo = (await import('../content/duelo.js')).default;
const { SIN_DESTINO } = await import('../content/lib/directorio.js');
const actors = (await import('../content/actors.js')).default;
const obj = (id) => pistas.OBJETIVOS.find(o => o.id === id);
ok(/rotulador/.test(obj('columna').niveles[0]), 'abuela, `columna` nivel 1: habla del rotulador');
ok(obj('columna').niveles[1] === 'La de los anuncios pinta sus objetivos a rotulador: pídeselo.', '`columna` nivel 2 (E361)');
ok(obj('turno').niveles[2][0] === 'A esa tele dale las buenas noches, como a la cafetera, y pregúntale.'
  && obj('turno').niveles[2][1] === 'La tele: «Buenas noches, Gertrudis». Y lo de los pasos.', '`turno` nivel 3: la tele (E362, E363; E7 P-turno3)');
ok(SIN_DESTINO === 'Un punto rojo: «ESTÁ AQUÍ». Gracias. Me hacía falta.', 'SIN_DESTINO (E344; E7: vuelve el original)');
ok(duelo.hurtByPair.teodoro.R09 === '...CABE.' && duelo.hurtByPair.teodoro.R02 === 'ESO ME LO DIJO ELLA. EN 1996.', 'D2: «...CABE.» pasa de la R02 a la R09');
ok(actors.bruno.handlers.hablar === actors.bruno.handlers.mirar, 'bruno.handlers.hablar = mirar');
ok(actors.valentin_reticula.variants && actors.valentin_reticula.variants.casco_fuera, 'Valentín: variante casco_fuera');
const murm = (id) => (Array.isArray(actors[id].murmurs) ? actors[id].murmurs : []);
ok(!murm('gervasio_acta').length && !murm('inigo_sinergia').length && !murm('anselmo_monolito').length && !murm('paco_ticket').length,
  'murmullos por defecto duplicados fuera de actors.js (§4.3)');
ok(!murm('celestino').includes('Si me preguntan por el Ibex, digo que va.'), 'Celestino: la del Ibex vive en el Vestíbulo');

async function open(flags, room) {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 600 } });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  await page.goto(base + '?room=vestibulo');
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  const G = (fn, a) => page.evaluate(fn, a);
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); }, flags);
  if (room) { await G((r) => __game.gotoRoom(r), room); await G(() => { __game.skipSpeech(); return __game.waitIdle(); }); }
  await G(() => { __game.clearLog(); });
  return { ctx, page, G };
}
const log = (G) => G(() => __game.log.filter(l => l.who !== 'aviso').map(l => l.who + ': ' + l.text));
// L1 y L3 ya oídas: la siguiente pendiente es la L4
const OIDAS = async (G) => G(() => { const o = __game.game.state.once || (__game.game.state.once = {}); o['once:evaristo_L1'] = true; o['once:evaristo_L3'] = true; __game.setFlag('evaristo_llamadas', 2); });
const ACTO3 = { intro_vista: true, torno_abierto: true, inigo_presentado: true, acto_2_iniciado: true, acto_3_iniciado: true, pieza_recortada: true, pagina_cerrada: true };

try {
  console.log('§2.5 L4');
  {
    const { ctx, G } = await open(ACTO3, 'cpd');
    await OIDAS(G);
    await G(() => __game.gotoRoom('ecosistema')); await G(() => __game.waitIdle());
    let L = await log(G);
    ok(!L.some(l => /atunes/.test(l)), 'con el Acto III y sin abrir el armario, la L4 no suena');
    await G(() => __game.setFlag('ruben_encontrado', true));
    await G(() => __game.save('i1'));
    await G(() => __game.load('i1'));
    await G(() => __game.gotoRoom('administracion')); await G(() => __game.waitIdle());
    L = await log(G);
    ok(L.includes('evaristo_salvedad: Una cosita. La máquina de la planta -1 vende veinticuatro atunes al mes.'), 'tras abrir el armario (y cargar), la L4 suena al cambiar de sala');
    ok(L.includes('evaristo_salvedad: Alguien come ahí abajo y no cobra.') && L.includes('bruno: Se llama Brais.'), 'L4: «…no cobra.» y Bruno «Se llama Brais.»');
    ok(!L.some(l => /Eso es un becario|Era solo eso/.test(l)), 'L4 sin «Eso es un becario» ni «Era solo eso»');
    await ctx.close();
  }
  {
    const { ctx, G } = await open({ ...ACTO3, ruben_encontrado: true, ruben_libre: true }, 'cpd');
    await OIDAS(G);
    await G(() => __game.gotoRoom('ecosistema')); await G(() => __game.waitIdle());
    ok(!(await log(G)).some(l => /atunes/.test(l)), 'con Brais ya libre, la L4 se pierde (salta)');
    await ctx.close();
  }

  console.log('§6.4 Hablar con Bruno');
  {
    const { ctx, G } = await open({ intro_vista: true }, null);
    await G(() => __game.doVerb('hablar', 'bruno')); await G(() => __game.waitIdle());
    const L1 = await log(G);
    await G(() => __game.clearLog());
    await G(() => __game.doVerb('mirar', 'bruno')); await G(() => __game.waitIdle());
    const L2 = await log(G);
    ok(L1.length && L1[0].startsWith('bruno: ') && JSON.stringify(L1) === JSON.stringify(L2), `Hablar con Bruno dice la meta, igual que Mirar (${L1[0]})`);
    await ctx.close();
  }

  console.log('§6.5 Valentín casco_fuera');
  {
    const { ctx, page, G } = await open({ intro_vista: true, torno_abierto: true, inigo_presentado: true }, 'pecera');
    const v = await G(() => { const a = __game.game.actors.valentin_reticula; return a ? { room: a.room, x: a.x } : null; });
    ok(v && v.room === 'pecera', 'Valentín está en la Redacción');
    if (v) {
      // Bruno al lado (a su izquierda, como en §6.5) y la cámara con él
      await G((x) => { const g = __game.game; g.player.x = x - 26; g.player.path = []; g.camFollow = null; g.camTarget = x - 160; g.camX = x - 160; }, v.x);
      await sleep(600);
      await page.screenshot({ path: path.join(shots, 'e6-i1-valentin-cascos.png') });
      await G(() => __game.game.runScript(async (api) => { api.vestir('valentin_reticula', 'casco_fuera'); }, { label: 'vestir' }));
      await sleep(300);
      ok(await G(() => __game.game.spriteOf(__game.game.actors.valentin_reticula) === __game.game.actors.valentin_reticula.variants.casco_fuera), 'vestir casco_fuera cambia el sprite');
      await page.screenshot({ path: path.join(shots, 'e6-i1-valentin-casco-fuera.png') });
      await G(() => __game.game.runScript(async (api) => { api.vestir('valentin_reticula', null); }, { label: 'vestir' }));
      ok(await G(() => __game.game.spriteOf(__game.game.actors.valentin_reticula) === __game.game.actors.valentin_reticula.sprite), 'vestir null lo devuelve a los cascos');
    }
    await ctx.close();
  }

  console.log('§6.7 walk-lib con `cabe`');
  {
    const { ctx, page, G } = await open({ intro_vista: true }, null);
    const R = createRunner(page);
    await G(() => { __game.skipText(true); const a = __game.game.condApi(); for (const f of ['rep_06', 'rep_02', 'rep_09']) a.learnReply(f); });
    await G(() => __game.giveItem('manual_fax'));
    const D = `({ id: 'prueba_cabe', actor: 'celestino', from: 'Prueba', subject: 'Prueba de cabe (no es de la biblia)', assigned: 'B. Pellizco',
      deck: ['R06', 'R02', 'R09'], intro: ['Prueba.'], hurt: ['¡Uy!'], taunt: ['Treinta y ocho caracteres de nada.'], defeatLines: ['Asignado.'],
      cabe: { R09: { max: 38, corta: 'Tráeme el contexto.', noCabe: 'NO CABE. REPITA EN TREINTA Y OCHO.' } },
      finishers: [{ atScore: 3, text: 'Cerrado.', object: 'manual_fax', script: async () => {} }] })`;
    G(code => __game.game.runScript(api => api.duel(eval(code)), { label: 'duelo cabe' }), D);
    let err = null;
    try { await R.run(['duelo', ['R06', 'R02', 'R09:larga', 'R09:larga', 'R09', { objeto: 'manual_fax' }]]); } catch (e) { err = e.message; }
    ok(!err, 'playDuel con R09:larga ×2 y luego la corta: ' + (err || 'gana'));
    const st = await G(() => __game.state());
    ok(st.lastDuel && st.lastDuel.result === 'won', `resultado: ${st.lastDuel && st.lastDuel.result}`);
    const L = await log(G);
    ok(L.filter(l => /NO CABE\. REPITA/.test(l)).length === 1 && L.some(l => /Treinta y ocho caracteres de nada/.test(l)), 'la larga: 1.ª «NO CABE…», 2.ª el taunt');
    ok(L.includes('bruno: Tráeme el contexto.'), 'la corta se dice');
    await ctx.close();
  }
} catch (e) { failures++; console.log('  ✗ excepción: ' + (e.stack || e.message)); }

if (consoleErrors.length) { failures++; console.log('Errores de consola:\n  ' + [...new Set(consoleErrors)].join('\n  ')); }
console.log(`\nTEST E6 I1: ${checks - (failures - (consoleErrors.length ? 1 : 0))}/${checks} ${failures ? 'CON FALLOS' : 'OK'}`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
