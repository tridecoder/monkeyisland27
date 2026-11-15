#!/usr/bin/env node
// PRUEBA DEL PAQUETE P0 DE LA ENMIENDA E5 (motor, docs/guion2/ENMIENDA_E5.md §6.1-6.10), con ratón y dedo reales donde
// importa. Capturas en tools/shots/e5-motor-*.png. Cubre:
//   6.1 api.walkTo(…, { run }) · 6.2 apagón con foco que sigue a un actor, nombres a oscuras e interceptor · 6.3
//   api.sinCongelar · 6.4 estampida({ esperar }) + soltar + cambio de sala + carga · 6.5 api.quieto · 6.6
//   api.sinGuardar (menú en gris, sin autoguarda) · 6.7 holgura táctil (taza «NO», monitor de Yoli, tableta, teléfono
//   rojo, dedo desplazado 6 px; un objeto grande detrás) · 6.8 doble clic al borde → parada, con la cámara moviéndose,
//   sobre un objeto; cámara adelantada al correr · 6.9 sfx('crujido') · 6.10 ascensor con submenú (ratón y dedo),
//   Escape → rellano, la Sala no sale en el III, sin submenú en −1 y 0, sin C101 ni R1.
//   node tools/test-e5-motor.mjs
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

// flags para recorrer las salas sin escenas de entrada (7.2, viral, CMS…) que tapen lo que se prueba
const FLAGS = { intro_vista: true, torno_abierto: true, inigo_presentado: true, acto_2_iniciado: true, silla_libre: true,
  gertrudis_saludada: true, cafetera_viral: true, cafetera_viral_vista: true, chaqueta_cogida: true, chaqueta_en_lector: true };

async function open(ctxOpts = { viewport: { width: 960, height: 600 } }) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  await page.goto(base + '?room=pecera');
  await page.waitForFunction(() => window.__game && __game.state().mode === 'play');
  const G = (fn, a) => page.evaluate(fn, a);
  await G(() => { __game.skipText(true); return __game.waitIdle(); });
  await G((F) => { for (const [k, v] of Object.entries(F)) __game.setFlag(k, v); }, FLAGS);
  await G(() => __game.skipText(false));
  return { ctx, page, G };
}
const shot = (page, name) => page.screenshot({ path: path.join(shots, `e5-motor-${name}.png`) });
const until = async (G, fn, arg, ms = 5000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await G(fn, arg)) return true; await sleep(50); } return false; };
/** Lleva a una sala con el texto rápido (sus escenas de entrada, si las hay, se pasan solas) y deja el control. */
async function goto(G, room, entry) {
  await G(() => __game.skipText(true));
  await G(([r, e]) => __game.gotoRoom(r, e), [room, entry]);
  await G(() => { __game.skipSpeech(); return __game.waitIdle(); });
  await G(() => { __game.skipText(false); __game.skipSpeech(); __game.game.speeches.length = 0; });
}

try {
  const { ctx, page, G } = await open();
  await goto(G, 'pecera', 'ascensor');

  // ================================================================ 6.1 walkTo con run (y 6.8d: cámara adelantada)
  console.log('§6.1 api.walkTo(…, { run }) y cámara adelantada al correr');
  const w = await G(async () => {
    const g = __game.game, p = g.player;
    p.x = 140; p.y = 120; p.path = []; g.snapCamera();
    let corre = false, lead = -999;
    const fin = g.runScript(async api => { await api.walkTo(760, 122, { run: true }); });
    for (let i = 0; i < 40 && p.path.length === 0; i++) await new Promise(r => setTimeout(r, 10));
    const t0 = performance.now();
    while (p.path.length && performance.now() - t0 < 6000) {
      corre = corre || p.running;
      if (p.x > 400 && p.x < 700 && p.dir === 'right') lead = Math.max(lead, Math.round(g.camGoal - (p.x - 160)));
      await new Promise(r => setTimeout(r, 30));
    }
    await fin;
    const llega = Math.abs(p.x - 760) < 2;
    // api.walkTo('objeto', { run }) y sin opts (no corre)
    let corre2 = false; const f2 = g.runScript(async api => { const q = api.walkTo('kanban', { run: true }); corre2 = p.running; await q; }); await f2;
    let corre3 = true; const f3 = g.runScript(async api => { const q = api.walkTo(600, 122); corre3 = p.running; await q; }); await f3;
    return { corre, llega, lead, corre2, corre3, running: p.running };
  });
  ok(w.corre && w.llega && !w.running, `api.walkTo(x, y, { run: true }): corre y llega (y deja de correr al llegar)`);
  ok(w.corre2 && !w.corre3, `api.walkTo('kanban', { run: true }) corre; sin opts no corre`);
  ok(w.lead === 60, `corriendo hacia la derecha, la cámara apunta 60 px por delante (${w.lead} px; andando, 30)`);

  // ================================================================ 6.2 apagón: foco que sigue al actor, nombres, interceptor
  console.log('\n§6.2 api.apagon({ spots: [{ actor }], nombres, interceptar })');
  await G(() => { const g = __game.game, p = g.player; p.x = 900; p.y = 124; p.path = []; g.snapCamera(); });
  await G(async () => {
    const g = __game.game;
    window.__icp = [];
    // nameDark de prueba (lo pondrá PB en el arte): objeto y actor
    g.content.rooms.pecera.objects.find(o => o.id === 'taza_no').nameDark = 'algo que dice que no';
    g.runScript(async api => {
      api.apagon({ ms: 0, nombres: true, spots: [[700, 70, 14, 10], { actor: 'anselmo_monolito', rx: 10, ry: 8 }],
        interceptar: async (api, verbo, id, item) => {
          window.__icp.push([verbo, id, item]);
          if (verbo === 'mirar' && id === 'ordenador_bruno') return false;              // este sigue
          if (verbo === 'hablar' && id === 'yoli_tendencias') { await api.sayAs(id, '¡Chsss! Estoy contando.'); return true; }
          await api.say('No veo nada.'); return true;
        } });
    });
  });
  await sleep(400);
  const sp = await G(async () => {
    const g = __game.game, Fx = await import('./engine/efectos.js');
    const a = g.actors.anselmo_monolito;
    const s1 = Fx.spotsDe(g, g.apagon)[1];
    const x0 = a.x; a.x -= 40;
    const s2 = Fx.spotsDe(g, g.apagon)[1];
    a.x = x0;
    return { s1, s2, ax: a.x, ay: a.y };
  });
  ok(sp.s1 && sp.s1[0] === Math.round(sp.ax) && sp.s1[1] === Math.round(sp.ay - 22) && sp.s2[0] === sp.s1[0] - 40, `foco { actor } sigue al actor cada fotograma (dy −22): ${JSON.stringify(sp.s1)} → ${JSON.stringify(sp.s2)}`);
  const lum = await G(() => {
    const g = __game.game, a = g.actors.anselmo_monolito;
    g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, a.x - 160));
    const c = document.createElement('canvas'); c.width = 320; c.height = 200; const x = c.getContext('2d');
    const L = (px, py) => { const d = x.getImageData(Math.round(px - g.camX), Math.round(py), 1, 1).data; return d[0] + d[1] + d[2]; };
    const px = a.x - 7, py = a.y - 22 - 5;                     // junto a la mano, fuera del sprite
    g.renderRoom(x); const con = L(px, py);
    const sp = g.apagon.spots; g.apagon.spots = sp.slice(0, 1); x.clearRect(0, 0, 320, 200); g.renderRoom(x); const sin = L(px, py); g.apagon.spots = sp;
    g.camFollow = g.G.player;
    return { foco: con, lejos: sin };
  });
  ok(lum.foco > lum.lejos + 20, `la linterna ilumina junto al actor (luz ${lum.foco} con el foco; ${lum.lejos} sin él)`);
  // nombres a oscuras: hover con el ratón
  const nombre = async (id) => {
    const p = await G((id) => { const o = __game.objects().find(o => o.id === id); const g = __game.game; g.camFollow = null; g.camTarget = null;
      g.camX = Math.max(0, Math.min(g.room.width - 320, (o.kind === 'actor' ? o.x + o.w / 2 : o.x + o.w / 2) - 160)); return true; }, id);
    void p;
    await sleep(50);
    const c = await G((id) => __game.screenPos(id), id);
    await page.mouse.move(c.x, c.y); await sleep(120);
    return G(() => __game.game.sentenceText());
  };
  const nTaza = await nombre('taza_no'), nOrd = await nombre('ordenador_bruno'), nYoli = await nombre('yoli_tendencias');
  ok(/algo que dice que no$/.test(nTaza) && /algo$/.test(nOrd) && /alguien$/.test(nYoli), `nombres a oscuras: «${nTaza}» · «${nOrd}» · «${nYoli}»`);
  const hsN = await G(() => __game.showHotspots().filter(t => ['taza_no', 'kanban', 'yoli_tendencias'].includes(t.id)).map(t => t.name));
  ok(hsN.every(n => /^(algo|alguien)/.test(n)), `«ver hotspots» a oscuras tampoco dice los nombres: ${JSON.stringify(hsN)}`);
  await shot(page, 'apagon');
  // interceptor: clic real en la salida al Vending → no sale; Hablar con Yoli → su línea; Mirar el ordenador → sigue
  await G(() => { __game.clearLog(); const g = __game.game; g.camFollow = g.G.player; });
  await goPlayer(G, 300);
  const pv = await G(() => __game.screenPos('pecera_a_office'));
  const x0 = await G(() => __game.game.player.x);
  await page.mouse.click(pv.x, pv.y);
  await sleep(300); await G(() => __game.waitIdle());
  const tras = await G(() => ({ room: __game.state().room, x: __game.game.player.x, icp: window.__icp.slice(), log: __game.log.map(l => l.text) }));
  ok(tras.room === 'pecera' && Math.abs(tras.x - x0) < 2 && tras.icp.some(c => c[0] === 'ir' && c[1] === 'pecera_a_office') && tras.log.includes('No veo nada.'),
    `interceptor: clic en la salida del Vending → no anda, no sale y contesta (${JSON.stringify(tras.icp)})`);
  await G(() => __game.doVerb('hablar', 'yoli_tendencias'));
  await G(() => __game.doVerb('mirar', 'ordenador_bruno'));
  const tras2 = await G(() => ({ log: __game.log.filter(l => l.who !== 'aviso').map(l => l.who + ': ' + l.text), icp: window.__icp.slice() }));
  const mirOrd = tras2.log.filter(l => l.startsWith('bruno:') && !/No veo nada/.test(l));
  ok(tras2.log.includes('yoli_tendencias: ¡Chsss! Estoy contando.'), 'interceptor: Hablar con Yoli → su línea (devuelve true: no sigue)');
  ok(mirOrd.length >= 1, `interceptor que devuelve false: Mirar el ordenador sigue como siempre («${(mirOrd[0] || '').slice(0, 50)}…»)`);
  ok(tras2.icp.length === 3, `el interceptor ve todos los verbos del jugador (${tras2.icp.length})`);
  // ascensor y directorio, también
  await G(() => __game.doVerb('ir', 'ascensor_pecera'));
  ok(await G(() => !__game.game.choice && __game.state().room === 'pecera'), 'interceptor: el ascensor no abre la botonera a oscuras');
  // cambio de sala: fuera el apagón (y vuelven los nombres)
  await goto(G, 'office', 'pecera');
  ok(await G(() => !__game.game.apagon), 'cambiar de sala quita el apagón (con su interceptor)');
  await goto(G, 'pecera', 'office');
  ok(await G(() => !__game.game.apagon && /taza/i.test(__game.game.objectTarget(__game.game.roomObjects().find(o => o.id === 'taza_no')).name)), 'con luz, los nombres de siempre');

  // ================================================================ 6.3 sinCongelar
  console.log('\n§6.3 api.sinCongelar');
  const congela = async (sin) => {
    await G((sin) => {
      const g = __game.game, a = g.actors.anselmo_monolito;
      a.x = 1060; a.y = 124; a.path = []; g.player.x = 800; g.player.y = 124; g.player.path = []; g.snapCamera();
      g.camFollow = null; g.camTarget = null; g.camX = 880;
      g.runScript(async api => { if (sin) api.sinCongelar('anselmo_monolito'); await api.walkActor('anselmo_monolito', 900, 124); }, { blocking: false });
    }, sin);
    await sleep(100);
    const vp = await G(() => __game.verbPos('hablar'));
    await page.mouse.click(vp.x, vp.y);                                   // verbo elegido con el ratón
    const ax0 = await G(() => __game.game.actors.anselmo_monolito.x);
    for (let k = 0; k < 10; k++) { const c = await G(() => __game.screenPos('anselmo_monolito')); if (c) await page.mouse.move(c.x, c.y); await sleep(100); }
    const ax1 = await G(() => __game.game.actors.anselmo_monolito.x);
    await G(() => { const g = __game.game; g.ui.verb = null; const a = g.actors.anselmo_monolito; a.path = []; if (a.walkResolve) { const r = a.walkResolve; a.walkResolve = null; r(false); } g.camFollow = g.G.player; });
    await page.mouse.move(5, 5);
    return Math.round(ax0 - ax1);
  };
  const quietoSin = await congela(false), andaCon = await congela(true);
  ok(quietoSin === 0 && andaCon > 20, `apuntado 1 s con «Hablar con»: sin sinCongelar se para (${quietoSin} px); con sinCongelar sigue (${andaCon} px)`);
  await goto(G, 'office', 'pecera'); await goto(G, 'pecera', 'office');
  ok(await G(() => !__game.game.actors.anselmo_monolito.noFreeze), 'al entrar en una sala, sinCongelar se borra');

  // ================================================================ 6.4 estampida({ esperar })
  console.log('\n§6.4 api.estampida(ids, { esperar: true })');
  const MERC = ['mercados_1', 'mercados_2', 'mercados_3'];
  const ponerMerc = () => G((M) => { const g = __game.game; M.forEach((id, i) => { const a = g.actors[id]; a.room = 'pecera'; a.x = 520 + i * 20; a.y = 124; a.visible = true; a.path = []; });
    g.player.x = 700; g.player.y = 124; g.player.path = []; g.snapCamera(); }, MERC);
  const abrirAtasco = () => G((M) => __game.game.runScript(async api => {
    await api.cutscene(async () => {
      window.__ctl = await api.estampida(M, { puerta: [440, 122], esperar: true, enAtasco: async (api, c) => { c.alFrente(M[0]); await api.sayAs(M[0], '¡Usted primero!'); } });
    });
  }), MERC);
  await ponerMerc();
  await G(() => __game.clearLog());
  const pr = abrirAtasco();
  await until(G, () => window.__ctl && !__game.game.busy, null, 15000);
  await pr;
  const at = await G(async (M) => {
    const g = __game.game, a = g.actors[M[0]];
    const xs = []; for (let i = 0; i < 6; i++) { xs.push(Math.round(a.x * 10) / 10); await new Promise(r => setTimeout(r, 60)); }
    return { activo: window.__ctl.activo, en: M.every(id => g.actors[id].room === 'pecera'), busy: g.busy, xs, n: (g.atascos || []).length, dijo: __game.log.some(l => l.text === '¡Usted primero!') };
  }, MERC);
  ok(at.activo && at.en && !at.busy && at.n === 1 && at.dijo, 'esperar: tras enAtasco resuelve con ctl, devuelve el control y los deja en la sala (ctl.activo)');
  ok(new Set(at.xs).size > 1, `siguen encajados y temblando con el control devuelto (${at.xs.join(', ')})`);
  await sleep(1500);
  ok(await G(() => window.__ctl.activo), 'el temblor no tiene tope: sigue encajado 1,5 s después');
  await shot(page, 'atasco');
  await G(() => __game.game.runScript(async () => { await window.__ctl.soltar(); }));
  ok(await G((M) => !window.__ctl.activo && M.every(id => !__game.game.actors[id].room) && !(__game.game.atascos || []).length, MERC), 'ctl.soltar(): ¡plop!, salen los tres de uno en uno');
  // cambio de sala con el atasco abierto
  await ponerMerc(); await G(() => { window.__ctl = null; });
  abrirAtasco(); await until(G, () => window.__ctl && !__game.game.busy, null, 15000);
  await goto(G, 'office', 'pecera');
  ok(await G((M) => !window.__ctl.activo && M.every(id => __game.game.actors[id].room !== 'pecera') && !(__game.game.atascos || []).length, MERC), 'cambio de sala con el atasco abierto: se sueltan sin animación');
  await G(() => __game.game.runScript(async () => { await window.__ctl.soltar(); }));
  ok(true, 'soltar() después de cambiar de sala no falla (idempotente)');
  // cargar con el atasco abierto
  await goto(G, 'pecera', 'office');
  await G(() => __game.save(3));
  await ponerMerc(); await G(() => { window.__ctl = null; });
  abrirAtasco(); await until(G, () => window.__ctl && !__game.game.busy, null, 15000);
  await G(() => __game.load(3));
  ok(await G(() => !window.__ctl.activo && !(__game.game.atascos || []).length), 'cargar partida con el atasco abierto: el atasco se cierra (la sala lo resuelve en su onEnter)');
  // sin esperar: lo de siempre
  await ponerMerc();
  const sinEsp = await G((M) => new Promise(res => __game.game.runScript(async api => { const r = await api.estampida(M, { puerta: [440, 122] }); res({ r: r === undefined, fuera: M.every(id => !__game.game.actors[id].room) }); })), MERC);
  ok(sinEsp.r && sinEsp.fuera, 'sin esperar: igual que siempre (resuelve con todos fuera)');
  await G((M) => { M.forEach(id => { __game.game.actors[id].room = null; }); }, MERC);

  // ================================================================ 6.5 quieto
  console.log('\n§6.5 api.quieto()');
  await G(() => { __game.skipSpeech(); __game.game.speeches.length = 0; __game.game.notices = []; });
  const q = await G(async () => {
    const g = __game.game, api = (await import('./engine/script.js')).makeApi(g, {});
    const r = {};
    r.libre = api.quieto();
    g.mouse.x = 100; g.mouse.y = 50; g.updateHover(); r.raton = api.quieto();
    const pc = g.choose(['a', 'b'], { escape: 1 }); r.menu = api.quieto(); g.choice.resolve(1); await pc;
    g.speak('bruno', 'Una línea.', { blocking: false }); r.globo = api.quieto(); g.speeches.length = 0;
    api.apagon({ ms: 0 }); r.apagon = api.quieto(); api.apagon(false);
    g.cutscene++; r.cine = api.quieto(); g.cutscene--;
    r.fin = api.quieto();
    return r;
  });
  ok(q.libre && q.raton && !q.menu && !q.globo && !q.apagon && !q.cine && q.fin, `quieto: ${JSON.stringify(q)} (el ratón no cuenta)`);

  // ================================================================ 6.6 sinGuardar
  console.log('\n§6.6 api.sinGuardar(on)');
  await G(() => { __game.save('auto'); });
  const d0 = await G(() => __game.game.slotInfo('auto').date);
  await sleep(30);
  await G(() => __game.game.runScript(async api => { api.sinGuardar(true); }));
  await G(() => __game.game.autosave());
  ok(await G((d0) => __game.game.slotInfo('auto').date === d0, d0), 'sin guardar: la autoguarda se salta');
  await page.mouse.click(10, 10);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => __game.game.menu && __game.game.menu.layout);
  const it = await G(() => { const i = __game.game.menu.layout.find(i => i.act === 'save'); return { en: i.enabled, c: __game.virtualToClient(i.x + 6, i.y + 5) }; });
  await shot(page, 'guardar-gris');
  await page.mouse.click(it.c.x, it.c.y);
  ok(it.en === false && await G(() => __game.game.menu && __game.game.menu.page === 'main'), '«Guardar partida» sale en gris en el menú y el clic no abre las ranuras');
  await page.keyboard.press('Escape');
  await goto(G, 'office', 'pecera');
  ok(await G(() => !__game.game.noSave), 'al cambiar de sala vuelve a poder guardarse');
  await G(() => __game.game.runScript(async api => { api.sinGuardar(true); }));
  await G(() => __game.load(3));
  ok(await G(() => !__game.game.noSave), 'al cargar partida, también');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => __game.game.menu && __game.game.menu.layout);
  ok(await G(() => __game.game.menu.layout.find(i => i.act === 'save').enabled !== false), 'sin sinGuardar, «Guardar partida» activo');
  await page.keyboard.press('Escape');

  // ================================================================ 6.8 doble clic
  console.log('\n§6.8 doble clic: borde → parada, cámara moviéndose, sobre un objeto');
  await goto(G, 'pecera', 'office');
  const PARADAS = ['directorio_planta', 'pecera_a_catacumba', 'ordenador_bruno', 'monitor_yoli', 'herminia_portatil', 'kanban'];
  await G((P) => { for (const o of __game.game.content.rooms.pecera.objects) if (P.includes(o.id)) o.parada = true; }, PARADAS);
  const dblBorde = async () => {
    await G(() => { const g = __game.game, p = g.player; p.x = 140; p.y = 118; p.path = []; g.camFollow = g.G.player; g.camTarget = null; g.snapCamera(); });
    await sleep(80);
    const c = await G(() => __game.virtualToClient(310, 124));
    await page.mouse.click(c.x, c.y); await sleep(120); await page.mouse.click(c.x, c.y);
    await sleep(60);
    const r = await G(() => { const p = __game.game.player; const e = p.path.length ? p.path[p.path.length - 1] : [p.x, p.y]; return { run: p.running, end: e.map(Math.round), cam: Math.round(__game.game.camX) }; });
    await until(G, () => !__game.game.player.path.length, null, 15000);
    return r;
  };
  const sigP = await G(() => { const g = __game.game; const xs = g.roomObjects().filter(o => o.parada && o.walkTo).map(o => o.walkTo); const cx = Math.round(Math.max(0, Math.min(g.room.width - 320, 140 - 160))) + 310; return xs.filter(w => w[0] > cx + 4).sort((a, b) => a[0] - b[0])[0]; });
  const b1 = await dblBorde();
  ok(b1.run && b1.end[0] === sigP[0] && b1.end[1] === sigP[1], `doble clic en x=310 (≤ 28 px del borde): corre a la siguiente parada ${JSON.stringify(sigP)} (destino ${JSON.stringify(b1.end)})`);
  await G((P) => { for (const o of __game.game.content.rooms.pecera.objects) if (P.includes(o.id)) delete o.parada; }, PARADAS);
  const b2 = await dblBorde();
  const W = await G(() => __game.game.room.width);
  ok(b2.run && b2.end[0] > W - 80, `sin paradas: hasta el final del suelo (x ${b2.end[0]} de ${W})`);
  // con la cámara moviéndose: dos clics a 300 ms en el mismo punto del MUNDO (siguiéndolo con el ratón)
  await G(() => { const g = __game.game, p = g.player; p.x = 300; p.y = 120; p.path = []; g.snapCamera(); g.walkActor(p.id, 900, 122); });
  await sleep(500);
  const wx = await G(() => Math.round(__game.game.camX) + 200);
  const c1 = await G((wx) => __game.roomPointToClient(wx, 126), wx);
  const cam1 = await G(() => Math.round(__game.game.camX));
  await page.mouse.click(c1.x, c1.y); await sleep(300);
  const c2 = await G((wx) => __game.roomPointToClient(wx, 126), wx);
  const cam2 = await G(() => Math.round(__game.game.camX));
  await page.mouse.click(c2.x, c2.y); await sleep(50);
  ok(cam2 !== cam1 && await G(() => __game.game.player.running), `cámara moviéndose (${cam1} → ${cam2}): dos clics a 300 ms sobre el mismo punto del mundo cuentan como doble (corre)`);
  await until(G, () => !__game.game.player.path.length, null, 8000);
  // y con la mano quieta (mismo punto de pantalla) también
  await G(() => { const g = __game.game, p = g.player; p.x = 300; p.y = 120; p.path = []; g.snapCamera(); g.walkActor(p.id, 900, 122); });
  await sleep(500);
  const c3 = await G(() => __game.virtualToClient(200, 126));
  await page.mouse.click(c3.x, c3.y); await sleep(300); await page.mouse.click(c3.x, c3.y); await sleep(50);
  ok(await G(() => __game.game.player.running), 'mano quieta con la cámara moviéndose: también cuenta como doble');
  await until(G, () => !__game.game.player.path.length, null, 8000);
  // sobre un objeto que no es salida: corre hasta él y el verbo sigue
  await G(() => { const g = __game.game, p = g.player; p.x = 700; p.y = 120; p.path = []; g.camFollow = g.G.player; g.camTarget = null; g.snapCamera(); __game.clearLog(); });
  await sleep(150);
  const vm = await G(() => __game.verbPos('mirar'));
  await page.mouse.click(vm.x, vm.y);
  const kc = await G(() => __game.screenPos('herminia_portatil'));
  await page.mouse.click(kc.x, kc.y); await sleep(120); await page.mouse.click(kc.x, kc.y); await sleep(60);
  const corriendo = await G(() => __game.game.player.running);
  await G(() => __game.waitIdle());
  const llego = await G(() => { const g = __game.game, o = g.roomObjects().find(o => o.id === 'herminia_portatil'); return { x: Math.round(g.player.x), w: o.walkTo, log: __game.log.filter(l => l.who === 'bruno').length }; });
  ok(corriendo && Math.abs(llego.x - llego.w[0]) < 2 && llego.log > 0, `doble clic sobre un objeto (Mirar el portátil): corre hasta él y el verbo elegido sigue (${JSON.stringify({ corriendo, ...llego })})`);
  await G(() => { const g = __game.game; g.camFollow = g.G.player; g.camTarget = null; });

  // ================================================================ 6.9 crujido
  console.log('\n§6.9 sfx(«crujido»)');
  const cr = await G(async () => { const A = await import('./engine/audio.js'); const d = A.SFX_PRESETS.crujido; __game.game.audio.sfx('crujido'); return d ? Math.max(...d.map(l => (l.at || 0) + l.dur)) : null; });
  ok(cr != null && cr <= 0.125, `sfx('crujido'): ruido corto filtrado (${cr} s)`);

  // ================================================================ 6.10 ascensor con submenú (ratón)
  console.log('\n§6.10 ascensor con atajos (ratón)');
  await G(() => { const v = __game.game.state.visitadas; for (const r of ['pecera', 'catacumba', 'pajarera', 'sala_amazonas', 'office', 'ecosistema', 'eventos', 'cpd', 'vestibulo']) if (!v.includes(r)) v.push(r); });
  await G(() => { const g = __game.game, E = g.enterRoom.bind(g); window.__entradas = []; g.enterRoom = (id, entry, o) => { window.__entradas.push([id, entry || null]); return E(id, entry, o); }; });
  await goto(G, 'cpd', 'ascensor');
  const opciones = () => G(() => __game.currentDialogOptions());
  const clicOpcion = async (txt) => { await sleep(300); const i = (await opciones()).findIndex(o => o.includes(txt)); const p = await G((i) => __game.optionPos(i), i); await page.mouse.click(p.x, p.y + 3); return i; };
  const usarAscensor = async (id) => {
    await G(() => { const g = __game.game; g.camFollow = g.G.player; g.camTarget = null; g.snapCamera(); });
    const c = await G((id) => __game.screenPos(id), id); await page.mouse.click(c.x, c.y);
    if (!(await until(G, () => !!__game.game.choice, null, 8000))) console.log('    (sin botonera: ' + JSON.stringify(await G(() => ({ room: __game.state().room, busy: __game.game.busy, sp: __game.game.speeches.map(s => s.text), cut: __game.game.cutscene }))) + ')');
  };
  await usarAscensor('ascensor_cpd');
  await clicOpcion('Planta 1');
  await until(G, () => !!__game.game.choice, null, 8000);
  const sub = await opciones();
  ok(sub && sub[0] === 'Redacción' && sub.includes('Redacción de papel') && sub.includes('Despachos') && sub.includes('Sala Amazonas') && sub.includes('Vending') && !sub.some(o => /planta/.test(o)), `submenú de la planta 1: ${JSON.stringify(sub)}`);
  await shot(page, 'ascensor-submenu');
  await clicOpcion('Redacción de papel');
  await until(G, () => __game.state().room === 'catacumba' && !__game.game.busy, null, 15000);
  const ent = await G(() => ({ room: __game.state().room, e: window.__entradas[window.__entradas.length - 1], todas: window.__entradas, log: __game.log.slice(-5).map(l => l.text) }));
  if (ent.room !== 'catacumba') console.log('    ' + JSON.stringify(ent));
  ok(ent.room === 'catacumba' && ent.e[0] === 'catacumba' && ent.e[1] === 'pecera', `Sistemas → «Redacción de papel»: sala catacumba, entrada «pecera» (${JSON.stringify(ent.e)})`);
  // Escape → rellano
  await goto(G, 'cpd', 'ascensor');
  await usarAscensor('ascensor_cpd'); await clicOpcion('Planta 1');
  await until(G, () => !!__game.game.choice, null, 8000);
  await page.keyboard.press('Escape');
  await until(G, () => __game.state().room === 'pecera' && !__game.game.busy, null, 15000);
  const ent2 = await G(() => ({ room: __game.state().room, e: window.__entradas[window.__entradas.length - 1] }));
  ok(ent2.room === 'pecera' && ent2.e[1] === 'ascensor', `Escape en el submenú → el rellano de siempre (${JSON.stringify(ent2.e)})`);
  // desde la planta 1: a −1 y a 0 sin submenú; a 2 con submenú
  for (const [pl, room] of [['Planta -1', 'cpd'], ['Planta 0', 'vestibulo']]) {
    await goto(G, 'pecera', 'ascensor');
    await usarAscensor('ascensor_pecera'); await clicOpcion(pl);
    await until(G, (room) => (__game.state().room === room && !__game.game.busy) || !!__game.game.choice, room, 15000);
    const r = await G(() => ({ room: __game.state().room, choice: !!__game.game.choice }));
    ok(r.room === room && !r.choice, `${pl}: sin submenú, directo a ${room}`);
    await G(() => __game.waitIdle());
  }
  await goto(G, 'pecera', 'ascensor');
  await usarAscensor('ascensor_pecera'); await clicOpcion('Planta 2');
  await until(G, () => !!__game.game.choice, null, 8000);
  const sub2 = await opciones();
  ok(sub2 && sub2[0] === 'Marketing y Comercial' && sub2.includes('Eventos') && !sub2.includes('Administración'), `planta 2: ${JSON.stringify(sub2)} (Administración sin pisar, no sale)`);
  await clicOpcion('Eventos');
  await until(G, () => __game.state().room === 'eventos' && !__game.game.busy, null, 15000);
  ok(await G(() => __game.state().room === 'eventos'), 'planta 2 → «Eventos»');
  await G(() => __game.waitIdle());
  // Acto III: la Sala no sale
  await G(() => { __game.setFlag('acto_3_iniciado', true); __game.setFlag('dos_ias_vista', true); });
  await goto(G, 'cpd', 'ascensor');
  await usarAscensor('ascensor_cpd'); await clicOpcion('Planta 1');
  await until(G, () => !!__game.game.choice, null, 8000);
  const sub3 = await opciones();
  ok(sub3 && !sub3.includes('Sala Amazonas') && sub3.includes('Despachos'), `Acto III: la Sala Amazonas no sale (${JSON.stringify(sub3)})`);
  await page.keyboard.press('Escape');
  await until(G, () => __game.state().room === 'pecera' && !__game.game.busy, null, 15000);
  await G(() => { __game.setFlag('acto_3_iniciado', false); });
  const fr = await G(async () => { const m = await import('./content/lib/ascensor.js'); return m.FRASES; });
  ok(!fr.some(f => /Ni el wifi|Capacidad: ocho/.test(f)), `frases del ascensor sin C101 ni R1 (${fr.length})`);
  await ctx.close();

  // ================================================================ táctil: 6.7 holgura y ascensor con el dedo
  console.log('\nTáctil (iPhone): §6.7 holgura y §6.10 ascensor con el dedo');
  const T = await open({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  await goto(T.G, 'pecera', 'office');
  const PEQ = [['pecera', 'taza_no'], ['pecera', 'monitor_yoli'], ['catacumba', 'corrector_aurora'], ['catacumba', 'telefono_rojo']];
  for (const [room, id] of PEQ) {
    await goto(T.G, room);
    const r = await T.G(async (id) => {
      const g = __game.game, HS = await import('./engine/hotspots.js');
      const o = g.roomObjects().find(o => o.id === id), b = HS.bbox(o), cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, cx - 160));
      const cam = Math.round(g.camX);
      const out = [];
      for (const [dx, dy] of [[6, 0], [-6, 0], [0, 6], [0, -6], [6, 6], [-6, 6], [6, -6], [-6, -6]]) {
        const sx = Math.round(cx + dx - cam), sy = Math.round(cy + dy);
        g.mouse.touch = false; const m = g.pickAt(sx, sy);
        g.mouse.touch = true; const t = g.pickAt(sx, sy);
        // ¿la caja crecida (20×16) del pequeño contiene el toque?
        const enCaja = Math.abs(sx + cam - cx) <= Math.max(b.w, 20) / 2 && Math.abs(sy - cy) <= Math.max(b.h, 16) / 2;
        const mb = m && m.kind === 'obj' ? HS.bbox(m.def) : null;
        const grande = !!(mb && mb.w * mb.h > 4 * Math.max(b.w, 20) * Math.max(b.h, 16));
        out.push({ dx, dy, raton: m && m.id, dedo: t && t.id, enCaja, grande, actor: !!(m && m.kind === 'actor') });
      }
      g.mouse.touch = true; g.camFollow = g.G.player;
      return { b, out };
    }, id);
    const malos = r.out.filter(x => x.enCaja && !x.actor && (x.raton == null || x.raton === id || x.grande) && x.dedo !== id);
    const ganaAlFondo = r.out.filter(x => x.raton && x.raton !== id && !x.grande && x.dedo !== x.raton && !(x.raton == null));
    ok(!malos.length && !ganaAlFondo.length, `${id} (${r.b.w}×${r.b.h}): dedo a 6 px → «${id}» en ${r.out.filter(x => x.dedo === id).length}/8 direcciones; donde el ratón da otro pequeño o un actor, se respeta (${r.out.map(x => `${x.dx},${x.dy}:${x.raton || '—'}/${x.dedo || '—'}`).join(' ')})`);
  }
  // un objeto GRANDE detrás (de prueba): al tacto gana el pequeño, con ratón el de detrás
  await goto(T.G, 'pecera');
  const big = await T.G(async () => {
    const g = __game.game, R = g.content.rooms.pecera, HS = await import('./engine/hotspots.js');
    const t = R.objects.find(o => o.id === 'taza_no'), b = HS.bbox(t);
    const fondo = { id: 'fondo_prueba_e5', name: 'fondo de prueba', x: b.x - 40, y: b.y - 30, w: 120, h: 70, handlers: {} };
    R.objects.unshift(fondo);
    g.camFollow = null; g.camTarget = null; g.camX = Math.max(0, Math.min(g.room.width - 320, b.x - 160));
    const cam = Math.round(g.camX), sx = Math.round(b.x + b.w / 2 + 6 + 3 - cam), sy = Math.round(b.y + b.h / 2);   // 9,5 px: fuera de la taza
    g.mouse.touch = false; const m = g.pickAt(sx, sy);
    g.mouse.touch = true; const d = g.pickAt(sx, sy);
    const lejos = g.pickAt(Math.round(b.x - 30 - cam), sy);
    R.objects.shift(); g.camFollow = g.G.player;
    return { raton: m && m.id, dedo: d && d.id, lejos: lejos && lejos.id };
  });
  ok(big.raton === 'fondo_prueba_e5' && big.dedo === 'taza_no' && big.lejos === 'fondo_prueba_e5', `objeto grande detrás: ratón → ${big.raton}; dedo junto a la taza → ${big.dedo}; dedo lejos → ${big.lejos}`);
  // ascensor con el dedo
  await T.G(() => { const v = __game.game.state.visitadas; for (const r of ['pecera', 'catacumba', 'pajarera', 'sala_amazonas', 'office', 'cpd']) if (!v.includes(r)) v.push(r); });
  await goto(T.G, 'cpd', 'ascensor');
  const tc = await T.G(() => __game.screenPos('ascensor_cpd'));
  await T.page.touchscreen.tap(tc.x, tc.y);
  await until(T.G, () => !!__game.game.choice, null, 8000);
  await sleep(350);
  const tapOpcion = async (txt) => { const o = await T.G(() => __game.currentDialogOptions()); const i = o.findIndex(x => x.includes(txt)); const p = await T.G((i) => __game.optionPos(i), i); await T.page.touchscreen.tap(p.x, p.y + 2); };
  await tapOpcion('Planta 1');
  await until(T.G, () => !!__game.game.choice && __game.game.choice.options[0] === 'Redacción', null, 8000);
  await sleep(350);
  await T.page.screenshot({ path: path.join(shots, 'e5-motor-ascensor-tactil.png') });
  await tapOpcion('Despachos');
  await until(T.G, () => __game.state().room === 'pajarera' && !__game.game.busy, null, 15000);
  ok(await T.G(() => __game.state().room === 'pajarera'), 'táctil: ascensor → Planta 1 → «Despachos» con el dedo');
  // un toque fuera del submenú = Escape (el rellano)
  await goto(T.G, 'cpd', 'ascensor');
  await T.page.touchscreen.tap(tc.x, tc.y);
  await until(T.G, () => !!__game.game.choice, null, 8000); await sleep(350);
  await tapOpcion('Planta 1');
  await until(T.G, () => !!__game.game.choice && __game.game.choice.options[0] === 'Redacción', null, 8000); await sleep(350);
  const fuera = await T.G(() => __game.virtualToClient(160, 60));
  await T.page.touchscreen.tap(fuera.x, fuera.y);
  await until(T.G, () => __game.state().room === 'pecera' && !__game.game.busy, null, 15000);
  ok(await T.G(() => __game.state().room === 'pecera'), 'táctil: un toque en la sala con el submenú abierto → el rellano');
  await T.ctx.close();
} catch (e) {
  failures++;
  console.log('\n  ✗ ' + (e && e.stack || e));
}
async function goPlayer(G, x) { await G((x) => { const g = __game.game, p = g.player; p.x = x; p.y = 120; p.path = []; g.camFollow = g.G.player; g.camTarget = null; g.snapCamera(); }, x); await sleep(100); }
if (consoleErrors.length) { failures++; console.log('\nErrores de consola:\n  ' + consoleErrors.join('\n  ')); }
console.log(failures ? `\nE5 MOTOR: ${failures} FALLOS (${checks} comprobaciones)` : `\nE5 MOTOR: OK (${checks} comprobaciones)`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
