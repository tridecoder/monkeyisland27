// AUDITORÍA DE GEOMETRÍA de la sala actual (se ejecuta DENTRO de la página: page.evaluate(auditRoom, opts)).
// La comparten tools/play-mouse.mjs (--solo=geometria) y tools/sala.mjs. opts: { tag, estricto, kit: URL de content/lib/kit.js }.
// Comprueba (errores): aproximación en el suelo y alcanzable desde cada entrada (lo que solo separa un walkbox
// condicional cerrado —`when`, p. ej. el torno del vestíbulo en a0— se devuelve en `condicionales`, no es error; y lo
// listado en SEPARADOS DEBE ser inalcanzable mientras su condicional esté cerrado); cobertura (ningún hotspot tapado
// entero); PNJ con ≥ 80 % de cabeza y torso a la vista (también con Bruno en su punto de conversación) y zona de clic
// propia. Reglas de la propuesta (errores si la sala es rediseñada —arte `rediseno: true`— o con `estricto`; si no,
// avisos): R1 interactivo ≥ 12×10 px · R2 solapes ≤ 30 % · R3 Bruno habla desde un lado (≥ 24 px) · R4 placas y
// rótulos del kit enteros · R5 nada fuera de la sala.
export const auditRoom = async (o) => {
    const tag = o.tag || '';
    const g = __game.game, rt = g.room, def = rt.def, out = [];
    // reglas de la propuesta (docs/GUIA_REDISENO.md §8): ERRORES en una sala rediseñada (arte con `rediseno: true`, o
    // con --estricto), AVISOS en las demás
    const estricto = !!(o.estricto || (def.art && def.art.rediseno));
    const avisos = [];
    const regla = (m) => (estricto ? out : avisos).push(`${tag} ${def.id}: ${m}`);
    const entries = Object.entries(def.entries || {}).map(([k, e]) => [k, Array.isArray(e) ? [e[0], e[1]] : [e.x, e.y]]);
    const camSave = g.camX, W = rt.width;
    const pickRoom = (x, y) => { g.camX = Math.max(0, Math.min(W - 320, x - 160)); const t = g.pickAt(x - Math.round(g.camX), y); return t ? t.id : null; };
    // walkboxes condicionales (`when`) cerrados ahora: el mapa con todos abiertos sirve para distinguir «separado a
    // propósito» de «inalcanzable». ESPERADOS: lo que DEBE quedar al otro lado mientras un condicional esté cerrado.
    const cerrados = rt.walk.boxes.filter(b => b.when != null && !b.enabled);
    const abierta = cerrados.length ? new rt.walk.constructor(rt.walk.boxes.map(b => ({ ...b, enabled: b.enabled || b.when != null }))) : null;
    const alcanza = (wm, e, ap, nearest) => { const path = wm.findPath(e, [ap.x, ap.y]); const end = path.length ? path[path.length - 1] : e; return Math.hypot(end[0] - nearest[0], end[1] - nearest[1]) <= 3; };
    const SEPARADOS = { vestibulo: { paso_torno: { desde: ['inicio'], detras: ['ascensor_vestibulo', 'vestibulo_a_redaccion'] } } };
    const ESPERA_CERRADO = (id, k) => cerrados.some(b => { const S = (SEPARADOS[def.id] || {})[b.id]; return S && S.desde.includes(k) && S.detras.includes(id); });
    const condicionales = [];
    for (const b of cerrados) { const S = (SEPARADOS[def.id] || {})[b.id]; if (S) for (const id of S.detras) if (!g.roomObjects().some(o => o.id === id)) out.push(`${tag} ${def.id}: «${id}» (detrás de ${b.id}) no existe`); }
    const targets = [];
    for (const o of g.roomObjects()) { const st = g.getObjState(o.id); if (st.visible && o.hotspot !== false) targets.push(g.objectTarget(o)); }
    for (const a of Object.values(g.actors)) if (a.room === def.id && a.visible && a.id !== g.G.player && a.def.hotspot !== false) targets.push(g.actorTarget(a));
    for (const t of targets) {
      // 1) aproximación: en el suelo y alcanzable desde cada entrada
      if (!(t.def.walk === false)) {
        const ap = g.approachPoint(t);
        const inside = rt.walk.inside(ap.x, ap.y);
        const nearest = rt.walk.nearest(ap.x, ap.y);
        const off = Math.hypot(nearest[0] - ap.x, nearest[1] - ap.y);
        if (!inside && off > 1.5) out.push(`${tag} ${def.id}: «${t.id}» walkTo (${Math.round(ap.x)},${Math.round(ap.y)}) fuera del suelo (a ${off.toFixed(1)} px)`);
        for (const [k, e] of entries) {
          if (alcanza(rt.walk, e, ap, nearest)) { if (ESPERA_CERRADO(t.id, k)) out.push(`${tag} ${def.id}: «${t.id}» se alcanza desde '${k}' con ${cerrados.map(b => b.id).join(', ')} cerrado (debía quedar al otro lado)`); continue; }
          // ¿lo separa solo un walkbox condicional cerrado (`when`)? Entonces es a propósito (el torno del vestíbulo
          // en a0): no es error si con los condicionales abiertos se llega
          if (abierta && alcanza(abierta, e, ap, abierta.nearest(ap.x, ap.y))) { condicionales.push(`«${t.id}» desde '${k}'`); continue; }
          out.push(`${tag} ${def.id}: «${t.id}» inalcanzable desde la entrada '${k}'`);
        }
      }
      // 2) cobertura: algún píxel de su área se elige como este objetivo
      let box;
      if (t.kind === 'actor') { const b = g.actorBox(t.actor); box = { x: b.x, y: b.y, w: b.w, h: b.h, hit: () => true }; }
      else {
        const d = t.def;
        if (d.poly) { const xs = d.poly.map(p => p[0]), ys = d.poly.map(p => p[1]); box = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; }
        else box = { x: d.x, y: d.y, w: d.w, h: d.h };
        box.hit = (x, y) => g.hitObject(d, x, y);
      }
      let tot = 0, mine = 0; const who = {};
      for (let y = Math.ceil(box.y); y < Math.min(144, box.y + box.h); y++) for (let x = Math.ceil(box.x); x < box.x + box.w; x++) {
        if (x < 0 || x >= W || !box.hit(x, y)) continue;
        tot++;
        const p = pickRoom(x, y);
        if (p === t.id) mine++; else if (p) who[p] = (who[p] || 0) + 1;
      }
      if (tot && !mine) out.push(`${tag} ${def.id}: «${t.id}» TAPADO entero por ${Object.keys(who).join(', ') || '¿nada?'}`);
      else if (tot && mine / tot < 0.12 && tot > 40) out.push(`${tag} ${def.id}: «${t.id}» casi tapado (${Math.round(100 * mine / tot)} % clicable; lo tapan ${Object.keys(who).join(', ')})`);
    }

    // ---------------------------------------------------------------- reglas de la propuesta (rediseño)
    const boxOf = (d) => { if (d.poly) { const xs = d.poly.map(p => p[0]), ys = d.poly.map(p => p[1]); return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; } return { x: d.x, y: d.y, w: d.w, h: d.h }; };
    const objs = targets.filter(t => t.kind === 'obj');
    for (const t of objs) {
      const b = boxOf(t.def);
      // (R1) tamaño mínimo de lo interactivo: 12×10 px (el motor amplía al tacto hasta 16×12)
      if (b.w < 12 || b.h < 10) regla(`«${t.id}» mide ${b.w}×${b.h} px (mín. 12×10)`);
      // (R5) nada interactivo pegado al borde de la sala (4 px)
      if (b.x < 0 || b.x + b.w > W || b.y < 0 || b.y + b.h > 144) regla(`«${t.id}» se sale de la sala (${b.x},${b.y},${b.w}×${b.h})`);
    }
    // (R2) solapes entre hotspots ≤ 30 % del menor
    for (let i = 0; i < objs.length; i++) for (let j = i + 1; j < objs.length; j++) {
      const a = boxOf(objs[i].def), b = boxOf(objs[j].def);
      const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)), iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
      const inter = ix * iy, small = Math.min(a.w * a.h, b.w * b.h) || 1;
      if (inter / small > 0.3) regla(`«${objs[i].id}» y «${objs[j].id}» se solapan un ${Math.round(100 * inter / small)} % (máx. 30 %)`);
    }
    // (R3) PNJ con Hablar: Bruno le habla desde un LADO (≥ 24 px en horizontal) y nunca delante
    for (const t of targets.filter(t => t.kind === 'actor' && t.handlers && t.handlers.hablar && t.def.walk !== false)) {
      const ap = g.approachPoint(t), a = t.actor;
      const dx = Math.abs(ap.x - a.x);
      if (dx < 24) regla(`PNJ «${t.id}»: Bruno le habla a ${Math.round(dx)} px en horizontal (mín. 24: siempre desde un lado)`);
    }
    // (R4) placas, rótulos y textos del kit enteros y dentro de la sala (content/lib/kit.js `registro`)
    if (o.kit) {
      const K = await import(o.kit);
      K.registro.reset(); g.paintRoom();
      for (const it of K.registro.items) if (it.x < 0 || it.y < 0 || it.x + it.w > W || it.y + it.h > 144) regla(`${it.tipo} «${it.texto}» cortado por el borde de la sala (${it.x},${it.y},${it.w}×${it.h})`);
      for (const p of K.registro.problemas) regla(p);
    }
    // 3) PNJ reconocibles (problema 4 del director): cabeza, hombros y torso (el 60 % superior del sprite) a la vista,
    //    y una zona de clic propia generosa. Se pinta la sala de verdad con el PNJ convertido en silueta magenta y se
    //    cuentan los píxeles que sobreviven a muebles, mostradores, cristales y primer plano.
    const VIS_MIN = 0.8, CLICK_MIN = 0.6, CLICK_PX = 120;
    const cv = document.createElement('canvas'); cv.width = 320; cv.height = 144;
    const sc = document.createElement('canvas'); sc.width = 320; sc.height = 144;
    const cg = cv.getContext('2d'), sg = sc.getContext('2d');
    const origDraw = g.drawActor;
    const npcs = Object.values(g.actors).filter(a => a.room === def.id && a.visible && a.id !== g.G.player && a.def.hotspot !== false);
    const vis = [];
    const measure = (a) => {
      g.camX = Math.max(0, Math.min(W - 320, a.x - 160));
      const cam = Math.round(g.camX);
      const b = g.actorBox(a);
      let tint = '#ff00ff';
      const silhouette = (ctx) => {
        sg.setTransform(1, 0, 0, 1, 0, 0); sg.globalCompositeOperation = 'source-over'; sg.clearRect(0, 0, 320, 144);
        sg.setTransform(ctx.getTransform()); origDraw.call(g, sg, a);
        sg.setTransform(1, 0, 0, 1, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = tint; sg.fillRect(0, 0, 320, 144);
        sg.globalCompositeOperation = 'source-over';
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(sc, 0, 0); ctx.restore();
      };
      const shadow = g.drawActor;
      g.drawActor = (ctx, x) => (x === a ? silhouette(ctx) : origDraw.call(g, ctx, x));
      const shake = g.shakeUntil; g.shakeUntil = 0;
      // dos pasadas (silueta magenta / cian): donde difieren, el PNJ se ve (aunque haya un cristal o una penumbra encima)
      const pass = (c) => { tint = c; cg.setTransform(1, 0, 0, 1, 0, 0); cg.clearRect(0, 0, 320, 144); g.renderRoom(cg); return cg.getImageData(0, 0, 320, 144).data; };
      let scene, scene2;
      try { scene = pass('#ff00ff'); scene2 = pass('#00ffff'); } finally { g.drawActor = shadow; g.shakeUntil = shake; tint = '#ff00ff'; }
      // referencia: la silueta sola
      cg.setTransform(1, 0, 0, 1, 0, 0); cg.clearRect(0, 0, 320, 144); cg.translate(-cam, 0); silhouette(cg); cg.setTransform(1, 0, 0, 1, 0, 0);
      const alone = cg.getImageData(0, 0, 320, 144).data;
      const y0 = Math.max(0, Math.floor(b.y)), y1 = Math.min(144, Math.floor(b.y + (b.h - 2) * 0.6));
      let tot = 0, seen = 0;
      for (let y = y0; y < y1; y++) for (let x = 0; x < 320; x++) {
        const i = (y * 320 + x) * 4;
        if (alone[i + 3] < 128) continue;
        tot++;
        if (Math.abs(scene[i] - scene2[i]) + Math.abs(scene[i + 1] - scene2[i + 1]) > 150) seen++;
      }
      // zona de clic propia: píxeles de su caja donde un clic elige a este PNJ
      let box = 0, mine = 0;
      for (let y = Math.ceil(b.y); y < Math.min(144, b.y + b.h); y++) for (let x = Math.ceil(b.x); x < b.x + b.w; x++) {
        if (x < 0 || x >= W) continue;
        box++;
        const t = g.pickAt(x - cam, y); if (t && t.id === a.id) mine++;
      }
      return { fv: tot ? seen / tot : 0, fc: box ? mine / box : 0, mine };
    };
    const P = g.player, pSave = { x: P.x, y: P.y, dir: P.dir, room: P.room };
    for (const a of npcs) {
      const { fv, fc, mine } = measure(a);
      // (C) con Bruno de pie en el punto desde el que se le habla: el PNJ no queda tapado por Bruno
      const t = g.actorTarget(a);
      let fh = null;
      if (t.handlers && t.handlers.hablar && t.def.walk !== false) {
        const ap = g.approachPoint(t);
        P.room = def.id; P.x = ap.x; P.y = ap.y;
        if (ap.face) P.dir = ap.face; else if (ap.faceTo) g.faceTowards(P, ap.faceTo[0], ap.faceTo[1]);
        fh = measure(a).fv;
        Object.assign(P, pSave);
        if (fh < VIS_MIN) out.push(`${tag} ${def.id}: PNJ «${a.id}» TAPADO POR BRUNO al hablarle: con Bruno en su punto de conversación (${Math.round(g.approachPoint(t).x)},${Math.round(g.approachPoint(t).y)}) solo se ve el ${Math.round(fh * 100)} % de cabeza y torso (mín. ${VIS_MIN * 100} %)`);
      }
      vis.push(`${a.id} ${Math.round(fv * 100)}%/${mine}px${fh == null ? '' : ` · hablando ${Math.round(fh * 100)}%`}`);
      if (fv < VIS_MIN) out.push(`${tag} ${def.id}: PNJ «${a.id}» medio escondido: solo se ve el ${Math.round(fv * 100)} % de cabeza y torso (mín. ${VIS_MIN * 100} %)`);
      if (fc < CLICK_MIN || mine < CLICK_PX) out.push(`${tag} ${def.id}: PNJ «${a.id}» con poca zona de clic propia (${mine} px, ${Math.round(fc * 100)} % de su caja)`);
    }
    g.camX = camSave;
    return { n: targets.length, issues: out, avisos, vis, estricto, condicionales, cerrados: cerrados.map(b => b.id) };
  };
