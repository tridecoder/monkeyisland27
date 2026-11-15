// SALA `pecera` (Redacción) — EL TITULADOR DE YOLI (ENMIENDA E4 §3bis): el monitor de Yoli a pantalla grande. Tres
// casillas (autoridad / asunto / gancho), el titular compuesto en una tarjeta de Discover, el contador de USUARIOS
// CONCURRENTES (sube o se desploma al publicar) y la gráfica de la sesión. Cinco publicaciones por sesión, salida libre,
// récord guardado en la partida.
//
// LAS PIEZAS SON DATOS: ./pecera.titulador.datos.js, generado por tools/gen-titulador.mjs desde
// docs/guion2/e4/piezas.json. Esta lógica no nombra ningún id de autoridad, asunto o gancho: la demo del paso 34, el
// titular de Bruno («honesto»), el ganador por defecto, los secretos, las categorías y las líneas de Yoli salen del
// fichero de datos. `titular`, `usuarios`, `categoria` y `voz` son copia de docs/guion2/e4/gen.mjs (el generador de
// referencia); tools/test-e4.mjs compara las 1.344 combinaciones con él.
//
// Uso (pecera.js, pecera.dialogos.js, pecera.escenas.js):
//   await titulador(api)                                   sesión del jugador (5 publicaciones; Esc / «Dejarlo» / un
//                                                          toque fuera del monitor la cierran en cualquier momento)
//   await titulador(api, { demo: P.demo_paso_34 })         la demo muda del paso 34 (sin récord, sin flags)
// Locales de `pecera` (pecera.js `flags`): pecera_disc_record, pecera_disc_record_k, pecera_disc_hist, pecera_disc_dichas,
// pecera_disc_partidas, pecera_disc_ganador_k. Globales: discover_ganador, opa_posit.
import P from './pecera.titulador.datos.js';
import { PAL, rect, hline, vline, frameRect } from '../../engine/draw.js';
import { drawText, measure, wrap } from '../../engine/font.js';
import { micro, microLineas, miles } from '../lib/kit.js';

export { P };
const Y = 'yoli_tendencias';
const PLIN = { notes: ['E6', 'B6'], step: 0.07, wave: 'triangle', vol: 0.1 };
const ROSA = '#FF78B8', VERDE = '#7aff7a', ROJO = '#ff5a4a', ORO = '#f6dc7a';
const PUBLICACIONES = 5, ANIM_MS = 1400;

// ======================================================================== fórmula (copia de docs/guion2/e4/gen.mjs)
export const A = P.autoridades, S = P.asuntos, G = P.ganchos;
export const TABLAS = [A, S, G];
const byId = (L, id) => L.find(x => x.id === id);
const fill = (t, s) => t
  .replaceAll('{S}', s.S).replaceAll('{C}', s.C).replaceAll('{P}', s.P).replaceAll('{ES}', s.ES)
  .replaceAll('{E}', s.E).replaceAll('{N}', s.N).replaceAll('{s}', s.s ?? '')
  .replace(/\ba el\b/g, 'al').replace(/\bde el\b/g, 'del');
const cap = t => t[0].toUpperCase() + t.slice(1);
/** Clave `a|s|g` de una combinación (lista de ids o clave). */
export const clave = (c) => (Array.isArray(c) ? c.join('|') : String(c));
/** [autoridad, asunto, gancho] de una clave o lista de ids. */
export const piezas = (c) => { const [a, s, g] = Array.isArray(c) ? c : String(c).split('|'); return [byId(A, a), byId(S, s), byId(G, g)]; };
/** El titular de Bruno (el primero de la demo del paso 34): la categoría «honesto». */
export const BRUNO = clave(P.demo_paso_34[0]);

export function titular(a, s, g) {
  const k = `${a.id}|${s.id}|${g.id}`;
  if (P.especiales[k]) return P.especiales[k];
  const t = (s.dom === 'casa' && a.tObj && a.tObj[g.id]) || a.t[g.id];
  return cap(fill(t, s));
}
const redondeo = u => u < 100 ? Math.max(3, Math.round(u)) : u < 10000 ? Math.round(u / 10) * 10 : Math.round(u / 100) * 100;
export function usuarios(a, s, g) {
  let u = s.B * a.k * g.k;
  for (const f of P.afinidades) if (f.a === a.id && f.s === s.id && (!f.g || f.g === g.id)) u *= f.k;
  if (/\bopa\b/i.test(titular(a, s, g))) u *= P.formula.castigo_opa;
  return redondeo(u);
}
const linea = (id) => (P.categorias.find(x => x.id === id) || {}).linea || null;
export function categoria(a, s, g, u, uPrev) {
  const k = `${a.id}|${s.id}|${g.id}`;
  const sec = P.secretos.find(x => x.combo === k);
  if (sec) return { id: 'secreto:' + k, etiqueta: sec.etiqueta, linea: sec.linea };
  const t = titular(a, s, g);
  const G2 = { corte: 'corte', obvio: 'obvio', senales: 'senales', probe: 'probe', prisa: 'prisa', curioso: 'curioso', truco: 'truco' };
  const id = k === BRUNO ? 'honesto'
    : /\bopa\b/i.test(t) ? 'opa'
    : g.id === 'punto' ? 'dato'
    : u >= 200000 ? 'pico'
    : P.sentimentales.includes(a.id) && s.dom === 'eco' ? 'corazon'
    : s.dom === 'eco' && u < 20000 ? 'economia'
    : G2[g.id] ? G2[g.id]
    : u > uPrev ? 'sube' : u < uPrev ? 'baja' : 'igual';
  const c = P.categorias.find(x => x.id === id);
  return { id, etiqueta: c.etiqueta, linea: c.linea };
}
/** Lo que dice Yoli: la línea de la categoría si no se ha dicho; si no, la de «sube» / «baja»; si no, nada (muda). */
export function voz(cat, u, uPrev, dichas) {
  for (const id of [cat.linea, u > uPrev ? linea('sube') : u < uPrev ? linea('baja') : null])
    if (id && !dichas.has(id)) { dichas.add(id); return id; }
  return null;
}
export const titularK = (c) => titular(...piezas(c));
export const usuariosK = (c) => usuarios(...piezas(c));
/** Titular «tal cual» de una clave y sus usuarios. */
export const combinacion = (c) => ({ k: clave(c), t: titularK(c), u: usuariosK(c) });

// ======================================================================== ganador (paso 40), historial y récord
/** La combinación ganadora: el récord del jugador si llega a lo del ganador por defecto; si no, el ganador por defecto.
 *  Una vez fijado en el paso 40 (`pecera_disc_ganador_k`), ese. */
export function ganadorK(api) {
  const fijado = api.flag('pecera_disc_ganador_k');
  if (fijado) return fijado;
  const rk = api.flag('pecera_disc_record_k'), r = api.flag('pecera_disc_record') || 0;
  return rk && r >= usuariosK(P.ganador_por_defecto) ? rk : P.ganador_por_defecto;
}
/** El asunto (objeto de piezas.json) de una clave. */
export const asuntoDe = (k) => piezas(k)[1];
/** Versiones tachadas del resultado del paso 40 si el jugador no ha publicado: la escalera de los datos (las
 *  combinaciones de la demo y de los secretos por debajo del ganador, de menos a más; las cuatro últimas). */
export function versionesDefecto() {
  const tope = usuariosK(P.ganador_por_defecto);
  const ks = [...new Set([...P.demo_paso_34.slice(1).map(clave), ...P.secretos.map(x => x.combo)])]
    .filter(k => k !== BRUNO && k !== P.ganador_por_defecto).map(combinacion).filter(c => c.u < tope).sort((x, y) => x.u - y.u);
  return ks.slice(-4);
}
/** URL de la pieza de Bruno (la opa queda en la dirección web): `elcontable.es/mercados/<slug>`. */
export function urlBruno() {
  const slug = titularK(BRUNO).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return 'elcontable.es/mercados/' + slug;
}

// ======================================================================== estado y bucle
function nuevoEstado(demo) {
  const ini = (demo && demo[0]) || P.demo_paso_34[0];
  const u = usuariosK(ini);
  return { combo: [...ini], u, serie: [u], dirs: [0], pubs: 0, anim: null, etiqueta: '', recordFlash: null, abierta: null,
    cursor: null, flash: null, ir: null, demo: !!demo };
}
const quedan = (st) => PUBLICACIONES - st.pubs;
const menuCasilla = (i, st) => byId(TABLAS[i], st.combo[i]).menu;

/** Abre el titulador. `demo`: [[a, s, g] inicial, …, [a, s, g] final] (paso 34; muda: sin récord ni flags). */
export async function titulador(api, { demo } = {}) {
  const game = api.game, gen = game.gen;
  // vuelta con el pósit corregido por Aurora (S8): una sola vez, antes del plano
  if (!demo && api.flag('opa_posit') === 2 && api.once('pecera_yoli_posit')) {
    await api.sayAs(Y, '¿Quién te ha tocado el pósit? Es letra de Aurora. Qué profesional. Qué miedo.');
  }
  const st = nuevoEstado(demo);
  st.record = api.flag('pecera_disc_record') || 0;
  let D = null;
  const vivo = () => game.gen === gen && !!D && game.detalle === D;
  await api.detalle({
    titulo: demo ? 'TITULADOR · PRUEBA' : 'TITULADOR · DISCOVER', x: 4, y: 4, w: 312, h: 104, color: ROSA, oscurecer: 0.6,
    draw: (g, r, t) => drawTitulador(g, r, t, st),
    click: demo ? null : (x, y) => clicTitulador(game, st, x, y),
  }, async (api) => {
    D = game.detalle;
    if (demo) { await jugarDemo(api, st, demo); return; }
    let abrir = null;
    while (st.pubs < PUBLICACIONES && vivo()) {
      let i = abrir;
      abrir = null;
      if (i == null) {
        i = await api.choose([`Autoridad: ${menuCasilla(0, st)}`, `Asunto: ${menuCasilla(1, st)}`, `Gancho: ${menuCasilla(2, st)}`,
          `¡Publicar! (quedan ${quedan(st)})`, 'Dejarlo'], { escape: 4, duel: true });
      }
      if (!vivo()) break;
      if (i === -2) { if (st.ir != null) { abrir = st.ir; st.ir = null; } continue; }   // toque en una casilla del monitor
      if (i < 0 || i === 4) break;
      if (i < 3) {
        const L = TABLAS[i];
        st.abierta = i;
        const j = await api.choose([...L.map(p => (p.id === st.combo[i] ? '› ' : '') + p.menu), 'Volver'],
          { escape: L.length, inicio: Math.max(0, L.findIndex(p => p.id === st.combo[i])) });
        st.abierta = null;
        if (!vivo()) break;
        if (j === -2) { if (st.ir != null && st.ir !== i) abrir = st.ir; st.ir = null; continue; }
        if (j >= 0 && j < L.length) {
          if (L[j].id !== st.combo[i]) { st.combo[i] = L[j].id; st.flash = { i, t: game.time }; }
          api.sfx('click');
        }
        continue;
      }
      await publicar(api, st);
    }
    if (st.pubs >= PUBLICACIONES && vivo()) await api.wait(1200);
  });
  if (demo || game.gen !== gen) return;                // la demo no guarda nada; una partida cargada a mitad, tampoco
  await alSalir(api, st);
}

/** Toque dentro del monitor: en una casilla, abre su menú; en el resto, nada (no cierra el titulador). */
function clicTitulador(game, st, x, y) {
  const ch = game.choice;
  if (!ch) return false;                                // (Yoli hablando: el toque pasa una línea, como siempre)
  const i = casillaEn(x, y);
  if (i != null && ch.resolve) { st.ir = i; game.audio.sfx('click'); ch.resolve(-2); }
  return true;
}

async function publicar(api, st) {
  const game = api.game;
  const [a, s, g] = piezas(st.combo);
  const u = usuarios(a, s, g), prev = st.u;
  const cat = categoria(a, s, g, u, prev);
  st.anim = { de: prev, a: u, t0: null, sube: u > prev };
  api.sfx(u > prev ? PLIN : 'bad');
  if (!game.instant) await api.wait(ANIM_MS);
  st.u = u; st.serie.push(u); st.dirs.push(Math.sign(u - prev)); st.pubs++; st.etiqueta = cat.etiqueta;
  if (st.demo) return;
  const k = clave(st.combo);
  const hist = [...(api.flag('pecera_disc_hist') || []), [...st.combo, u]].slice(-4);
  api.setFlag('pecera_disc_hist', hist);
  if (u > (api.flag('pecera_disc_record') || 0)) {
    api.setFlag('pecera_disc_record', u);
    api.setFlag('pecera_disc_record_k', k);
    st.record = u;
    st.recordFlash = { t0: null };
  }
  // la Redacción reacciona sin texto
  if (u >= 200000) {
    api.shake(150, 1);
    for (let n = 0; n < 3; n++) { api.sfx(PLIN); if (!game.instant) await api.wait(140); }
    api.anim(Y, 'reach', 400);
  } else if (u <= 40) api.sfx('bad');
  // Yoli: cada línea, una vez por partida
  const dichas = new Set(api.flag('pecera_disc_dichas') || []);
  const id = voz(cat, u, prev, dichas);
  if (id && P.lineas[id]) {
    api.setFlag('pecera_disc_dichas', [...dichas]);
    await api.sayAs(Y, P.lineas[id]);
  } else await api.anim(Y, 'reach', 300);
}

async function jugarDemo(api, st, demo) {
  const game = api.game;
  await api.wait(1200);
  const fin = demo[demo.length - 1];
  for (let i = 0; i < 3; i++) {
    st.cursor = { i, t: game.time };
    await api.wait(400);
    if (st.combo[i] !== fin[i]) { st.combo[i] = fin[i]; st.flash = { i, t: game.time }; api.sfx('click'); }
  }
  st.cursor = { i: 3, t: game.time };
  await api.wait(300);
  st.cursor = null;
  await publicar(api, st);
  await api.wait(1500);
}

async function alSalir(api, st) {
  api.inc('pecera_disc_partidas');
  // el pósit en la pieza (S8): solo entre los pasos 34 y 36, cuando Bruno lleva la pieza
  if (api.has('pieza_opa') && (api.flag('pecera_disc_record') || 0) > usuariosK(BRUNO) && !api.flag('opa_posit')) {
    await api.anim(Y, 'reach', 500);
    api.sfx('paper');
    await api.sayAs(Y, 'Te pego el mejor en un pósit. Por si cambias de idea en la escalera.');
    api.setFlag('opa_posit', 1);
  }
  void st;
}

// ======================================================================== dibujo (ventana de 312 × 104)
const easeOutCubic = (k) => 1 - Math.pow(1 - k, 3);
/** Geometría de las tres casillas (relativa a la ventana). */
const CHIP = { y: 57, h: 13, x: [4, 107, 210], w: 100 };
function casillaEn(x, y) {
  if (y < CHIP.y || y >= CHIP.y + CHIP.h) return null;
  for (let i = 0; i < 3; i++) if (x >= CHIP.x[i] && x < CHIP.x[i] + CHIP.w) return i;
  return null;
}
/** Valor que enseña el contador en el instante `t` (la animación de `publicar`). */
function valorContador(st, t) {
  const A = st.anim;
  if (!A) return { v: st.u, fase: 0 };
  if (A.t0 == null) A.t0 = t;
  const k = Math.min(1, (t - A.t0) / ANIM_MS);
  if (k >= 1) return { v: A.a, fase: 0, sube: A.sube, fin: true, dt: t - A.t0 };
  if (!A.sube) return { v: A.a, fase: k, sube: false, dt: t - A.t0 };          // baja: cae de golpe
  return { v: Math.round(A.de + (A.a - A.de) * easeOutCubic(k)), fase: k, sube: true, dt: t - A.t0 };
}
const LOGMAX = Math.log10(600000);
const altura = (u) => Math.max(0, Math.min(1, Math.log10(u + 1) / LOGMAX));

export function drawTitulador(g, r, t, st) {
  const { x, y, w, h } = r;
  rect(g, x, y, w, h, PAL.blue[0]);
  // ---------------------------------------------------------------- tarjeta de Discover (titular: 190 px, 3 líneas)
  const cx = x + 4, cy = y + 4, cw = 222, chh = 46;
  rect(g, cx + 1, cy + 1, cw, chh, '#060a1c');
  rect(g, cx, cy, cw, chh, '#f4efe2');
  hline(g, cx, cy, cw, '#ffffff');
  const asunto = byId(S, st.combo[1]);
  miniatura(g, cx + 4, cy + 5, asunto ? asunto.id : '');
  if (st.flash && st.flash.t0 == null) st.flash.t0 = t;
  const flashT = st.flash ? t - st.flash.t0 : 9999;
  wrap(titularK(st.combo), 190).slice(0, 3).forEach((l, i) => drawText(g, l, cx + 31, cy + 2 + i * 11, flashT < 260 ? '#8a2a5a' : '#141220', { outline: null }));
  micro(g, 'DISCOVER', cx + 4, cy + chh - 7, ROSA);
  micro(g, 'ELCONTABLE.ES · HACE 1 MIN', cx + 31, cy + chh - 7, '#8a8070');
  // ---------------------------------------------------------------- contador (el protagonista)
  const kx = x + 230, kw = 78, kc = kx + (kw >> 1);
  micro(g, 'USUARIOS', kc, y + 3, '#9fb0d8', { align: 'center' });
  micro(g, 'CONCURRENTES', kc, y + 10, '#9fb0d8', { align: 'center' });
  const c = valorContador(st, t);
  const txt = miles(c.v);
  const color = c.sube === true ? VERDE : c.sube === false ? ROJO : '#ffffff';
  let dx = 0, dy = 0;
  if (c.sube === false && c.dt < 300) dx = (Math.floor(c.dt / 40) & 1) ? 1 : -1;      // baja: tiembla 1 px
  if (c.sube === true && !c.fin) dy = (Math.floor(t / 50) & 1);                      // sube: los dígitos «ruedan»
  const ny = y + 18;
  if (measure(txt) * 2 <= 70) drawText(g, txt, kc + dx, ny + dy, color, { align: 'center', scale: 2 });
  else drawText(g, txt, kc + dx, ny + 6 + dy, color, { align: 'center', bold: true });
  if (st.recordFlash) {
    if (st.recordFlash.t0 == null) st.recordFlash.t0 = t;
    const e = t - st.recordFlash.t0;
    if (e < 2000 && (Math.floor(e / 200) & 1) === 0) frameRect(g, kx, ny - 3, kw, 30, ORO);
  }
  if (st.etiqueta) microLineas(st.etiqueta, kw).slice(0, 2).forEach((l, i) => micro(g, l, kc, y + 44 + i * 7, ROSA, { align: 'center' }));
  // ---------------------------------------------------------------- las tres casillas (un toque abre su menú)
  const NOMBRES = ['AUTORIDAD', 'ASUNTO', 'GANCHO'];
  for (let i = 0; i < 3; i++) {
    const bx = x + CHIP.x[i], by = y + CHIP.y;
    const on = st.abierta === i || (st.cursor && st.cursor.i === i);
    const fl = st.flash && st.flash.i === i && flashT < 400;
    rect(g, bx, by, CHIP.w, CHIP.h, fl ? '#5a2a48' : on ? '#2a2050' : '#141a3a');
    frameRect(g, bx, by, CHIP.w, CHIP.h, on || fl ? ROSA : '#3a4680');
    micro(g, NOMBRES[i], bx + 3, by + 2, '#7a88c0');
    const m = String(byId(TABLAS[i], st.combo[i]).menu).replace(/[«»]/g, '"').toUpperCase();
    micro(g, m.length > 23 ? m.slice(0, 22) + '.' : m, bx + CHIP.w - 3, by + 7, '#f0f2fa', { align: 'right' });
  }
  if (st.cursor) {                                                              // el cursor de la demo (paso 34)
    const i = st.cursor.i;
    cursorFlecha(g, i < 3 ? x + CHIP.x[i] + CHIP.w - 14 : kc + 10, i < 3 ? y + CHIP.y + 6 : ny + 16);
  }
  // ---------------------------------------------------------------- gráfica (eje logarítmico) de la sesión
  const gx = x + 4, gy = y + 73, gw = 304, gh = 19;
  rect(g, gx, gy, gw, gh, '#0a1028');
  hline(g, gx, gy + gh, gw, '#3a4680');
  const py0 = (u) => gy + gh - 2 - Math.round(altura(u) * (gh - 4));
  const y100 = py0(100000);
  for (let i = 0; i < gw; i += 4) rect(g, gx + i, y100, 2, 1, '#44507a');
  micro(g, '100.000', gx + gw - 2, y100 + 2, '#5a6898', { align: 'right' });
  const paso = (gw - 40) / PUBLICACIONES;
  const px0 = (i) => gx + 8 + Math.round(i * paso);
  const pts = st.serie.map((u, i) => [px0(i), py0(u), st.dirs[i]]);
  const enCurso = st.anim && st.anim.t0 != null && st.serie.length === st.pubs + 1 && !c.fin;
  for (let i = 1; i < pts.length; i++) segmento(g, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], pts[i][2] > 0 ? VERDE : pts[i][2] < 0 ? ROJO : '#c8d0e8');
  if (enCurso) {                                                                // el tramo nuevo, con la animación
    const last = pts[pts.length - 1];
    const k = easeOutCubic(Math.min(1, (t - st.anim.t0) / ANIM_MS));
    const ex = px0(pts.length), ey = py0(st.anim.a);
    let yy = last[1] + (ey - last[1]) * k;
    if (st.anim.a <= 40 && k > 0.85) yy = ey - Math.round(Math.sin((k - 0.85) / 0.15 * Math.PI) * 3);   // rebote en el suelo
    segmento(g, last[0], last[1], Math.round(last[0] + (ex - last[0]) * k), Math.round(yy), st.anim.sube ? VERDE : ROJO);
  }
  pts.forEach(([px, py, d]) => rect(g, px - 1, py - 1, 3, 3, d > 0 ? VERDE : d < 0 ? ROJO : '#ffffff'));
  // ---------------------------------------------------------------- pie: instrucciones, récord y publicaciones
  const fy = y + h - 7;
  micro(g, 'ELIGE. PUBLICA. DISCOVER DECIDE.', x + 4, fy, '#8a96c8');
  if (!st.demo) {
    const fl = st.recordFlash && st.recordFlash.t0 != null && t - st.recordFlash.t0 < 2000 && (Math.floor((t - st.recordFlash.t0) / 200) & 1);
    micro(g, `RÉCORD: ${miles(st.record || 0)}`, x + 196, fy, fl ? '#ffffff' : ORO, { align: 'center' });
  }
  for (let i = 0; i < PUBLICACIONES; i++) {
    const bx = x + w - 9 - (PUBLICACIONES - 1 - i) * 7;
    if (i < st.pubs) rect(g, bx, fy, 5, 5, ROSA);
    else frameRect(g, bx, fy, 5, 5, '#6a78b0');
  }
}
function segmento(g, x0, y0, x1, y1, c) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) rect(g, Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), 1, 1, c);
}
function cursorFlecha(g, x, y) {
  const F = ['#', '##', '#.#', '#..#', '#...#', '#..##', '##.#', '#..#'];
  F.forEach((row, j) => { for (let i = 0; i < row.length; i++) rect(g, x + i, y + j, 1, 1, row[i] === '#' ? '#08060e' : '#ffffff'); });
}

/** Miniatura de 24 × 24 por asunto (las del guion, §3bis.5); un asunto nuevo sin dibujo propio lleva un periódico. */
function miniatura(g, x, y, id) {
  rect(g, x, y, 24, 24, '#dcd4c0'); frameRect(g, x, y, 24, 24, '#8a8070');
  const ink = '#2a2638', r = PAL.red[4], b = PAL.blue[4], gr = PAL.green[4], go = PAL.gold[4];
  const pct = (px, py, c) => { rect(g, px, py, 2, 2, c); rect(g, px + 5, py + 6, 2, 2, c); for (let i = 0; i < 7; i++) rect(g, px + 6 - i, py + i, 1, 1, c); };
  switch (id) {
    case 'persianas': for (let i = 0; i < 6; i++) { rect(g, x + 4, y + 4 + i * 3, 16, 2, PAL.paper[7]); hline(g, x + 4, y + 5 + i * 3, 16, PAL.paper[2]); } vline(g, x + 20, y + 3, 18, ink); break;
    case 'mejillones': rect(g, x + 3, y + 8, 18, 10, PAL.metal[5]); rect(g, x + 3, y + 8, 18, 3, PAL.metal[6]); rect(g, x + 5, y + 12, 14, 4, r); rect(g, x + 7, y + 13, 6, 2, '#2a2040'); break;
    case 'hipoteca': rect(g, x + 6, y + 11, 12, 9, PAL.paper[6]); for (let i = 0; i < 7; i++) hline(g, x + 12 - i, y + 4 + i, 1 + i * 2, r); pct(x + 9, y + 12, ink); break;
    case 'nomina': rect(g, x + 3, y + 7, 18, 12, PAL.paper[7]); frameRect(g, x + 3, y + 7, 18, 12, ink); for (let i = 0; i < 6; i++) { rect(g, x + 4 + i, y + 8 + i, 1, 1, ink); rect(g, x + 19 - i, y + 8 + i, 1, 1, ink); } break;
    case 'euribor': pct(x + 8, y + 7, b); pct(x + 9, y + 8, b); break;
    case 'plazofijo': rect(g, x + 5, y + 9, 14, 9, '#e890b0'); rect(g, x + 18, y + 11, 3, 3, '#e890b0'); rect(g, x + 8, y + 18, 2, 3, '#c06890'); rect(g, x + 15, y + 18, 2, 3, '#c06890'); rect(g, x + 10, y + 9, 4, 1, ink); break;
    case 'hacienda': rect(g, x + 5, y + 5, 14, 14, r); frameRect(g, x + 6, y + 6, 12, 12, '#ffd0c0'); micro(g, 'AEAT', x + 12, y + 10, '#ffffff', { align: 'center' }); break;
    case 'robledal': for (let i = 0; i < 4; i++) rect(g, x + 5 + i * 4, y + 9, 2, 9, PAL.paper[2]); rect(g, x + 3, y + 18, 18, 2, PAL.paper[1]); for (let i = 0; i < 5; i++) hline(g, x + 12 - i * 2, y + 4 + i, 1 + i * 4, PAL.paper[1]); break;
    case 'prima': pct(x + 5, y + 9, r); vline(g, x + 17, y + 5, 14, gr); for (let i = 0; i < 3; i++) hline(g, x + 17 - i, y + 5 + i, 1 + i * 2, gr); break;
    case 'deuda': rect(g, x + 3, y + 7, 18, 11, PAL.paper[7]); frameRect(g, x + 3, y + 7, 18, 11, go); micro(g, 'PAGARÉ', x + 12, y + 10, ink, { align: 'center' }); break;
    case 'pib': [6, 10, 14].forEach((hh, i) => rect(g, x + 5 + i * 5, y + 20 - hh, 4, hh, [b, gr, go][i])); hline(g, x + 3, y + 20, 18, ink); break;
    case 'ipc': rect(g, x + 4, y + 11, 16, 8, PAL.wood[5]); for (let i = 0; i < 4; i++) vline(g, x + 6 + i * 4, y + 11, 8, PAL.wood[3]); rect(g, x + 7, y + 7, 2, 4, r); rect(g, x + 12, y + 6, 3, 5, gr); break;
    case 'ibex': hline(g, x + 3, y + 12, 16, ink); hline(g, x + 3, y + 13, 16, ink); for (let i = 0; i < 4; i++) vline(g, x + 18 + i, y + 10 + i, 6 - i * 2, ink); break;
    case 'opa': rect(g, x + 4, y + 9, 16, 10, PAL.wood[2]); rect(g, x + 9, y + 6, 6, 3, PAL.wood[1]); hline(g, x + 4, y + 13, 16, PAL.wood[0]); rect(g, x + 11, y + 12, 2, 3, go); break;
    default: rect(g, x + 4, y + 4, 16, 16, PAL.paper[7]); rect(g, x + 6, y + 6, 12, 3, ink); for (let i = 0; i < 4; i++) hline(g, x + 6, y + 11 + i * 2, 12, PAL.paper[2]);
  }
}
