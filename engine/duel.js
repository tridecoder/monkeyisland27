// "RESPONDER A TODOS" — data-driven verbal duel (bible section 6). See docs/CONTENT_SCHEMA.md#10-duelos
//
// Rules implemented here (bible 6.2 / 6.8):
//  - only the rival attacks, with a fixed-order deck; a missed attack goes to the end of the deck
//  - the reply menu = every learned pair (flag rep_XX set, in pair order) + weak replies + the comodín
//  - hit = +1 point (attack leaves the deck); miss = one more "RE:" in the subject; 3 misses = defeat
//  - finishers (remates) at given scores: replies greyed out, only [Usar objeto] / [Retirarse del hilo];
//    a wrong object only gets a line (not a miss); retiring = defeat without punishment
//  - nothing is learned in a duel; points always restart from 0
//  - HUD = mail window: De / Para / Asunto (RE: RE: ...) / Asignado a:
import { drawText, measure } from './font.js';
import { rect, hline, vline, frameRect } from './draw.js';

const asArray = x => x == null ? [] : Array.isArray(x) ? x : [x];

export async function runDuel(game, api, idOrDef) {
  const D = game.content.duels;
  const opp = typeof idOrDef === 'object' ? idOrDef : D.opponents[idOrDef];
  const id = typeof idOrDef === 'object' ? (idOrDef.id || 'duelo') : idOrDef;
  if (!opp) { game.error('Duelo desconocido: ' + idOrDef); return false; }
  const T = { to: 'Todos', useObject: '[Usar objeto]', retire: '[Retirarse del hilo]', pickPrompt: 'Adjuntar al hilo:',
    defeatPrefix: 'RV: ', defeatCc: 'Dirección', defeatAssigned: 'Vacante', plusOne: null, notReady: null, defeatLine: null, ...(D.texts || {}) };
  const pairs = new Map((D.pairs || []).map(p => [p.id, p]));
  const flags = game.state.flags;
  const learned = () => (D.pairs || []).filter(p => flags[p.flag]);
  const actorId = opp.actor || id;
  const oppActor = game.actors[actorId];
  const fromName = opp.from || (oppActor && oppActor.name) || id;
  const deck = asArray(opp.deck).filter(p => { if (!pairs.has(p)) game.error(`duelo ${id}: pareja desconocida ${p}`); return pairs.has(p); });
  const finishers = asArray(opp.finishers).slice().sort((a, b) => a.atScore - b.atScore);
  const target = finishers.length ? finishers[finishers.length - 1].atScore : (opp.winScore || 3);
  const maxMisses = opp.maxMisses || 3;
  const fax = opp.style === 'fax';
  const rot = { hurt: 0, taunt: 0 };
  const next = (k) => { const l = asArray(opp[k]); return l.length ? l[rot[k]++ % l.length] : null; };

  // ---- shared duel state (read by the HUD, the test API and finisher scripts)
  const S = {
    id, phase: 'intro', hits: 0, misses: 0, re: opp.re ?? 1, subject: opp.subject || '', cc: opp.cc || null,
    assigned: opp.assigned || 'Vacante', from: fromName, to: opp.to || T.to, style: fax ? 'fax' : 'mail',
    thread: null, result: null, finIdx: 0,
  };
  const info = game.duelInfo = { id, opponent: actorId, phase: 'intro', attack: null, options: null, correctIndex: -1, correctItem: null, get hits() { return S.hits; }, get misses() { return S.misses; }, get subject() { return subjectText(S); }, get assigned() { return S.assigned; } };
  const ctl = {   // handed to finisher scripts and onHit
    get hits() { return S.hits; }, get misses() { return S.misses; },
    setAssigned: (t) => { S.assigned = t; }, setSubject: (t) => { S.subject = t; }, setCc: (t) => { S.cc = t; },
    thread: (from, text, ms = 3200) => { S.thread = { from, text, until: game.realTime + ms }; },
    hide: () => { game.hud = null; }, show: () => { game.hud = hud; },
  };

  const say = async (who, line) => {
    if (line == null) return;
    if (Array.isArray(line)) { [who, line] = line; }
    if (who === 'player') await api.say(line);
    else if (who === 'narrator') await api.narrate(line);
    else if (who === 'rival') { if (opp.say) await opp.say(api, line); else await api.sayAs(actorId, line); }
    else if (typeof who === 'string' && who.startsWith('obj:')) await api.sayFrom(who.slice(4), line);
    else await api.sayAs(who, line);
  };
  const sayList = async (list) => { for (const l of asArray(list)) await say(Array.isArray(l) ? l[0] : 'rival', Array.isArray(l) ? l[1] : l); };

  const prevMusic = game.audio.requestedId ?? game.audio.currentId;
  const music = opp.music !== undefined ? opp.music : D.music;
  const hud = (g) => drawHud(g, game, S);
  game.inDialog = (game.inDialog || 0) + 1;
  let won = false;
  try {
    if (music) api.music(music, 0.6);
    // rule 10: fair warning when Bruno does not know enough replies of this deck
    const known = deck.filter(p => flags[pairs.get(p).flag]).length;
    if (T.notReady && known < Math.min(target, deck.length)) await say('player', T.notReady);
    await sayList(opp.intro);
    game.hud = hud; game.hudTop = 50;
    let guard = 0;
    while (guard++ < 300) {
      // ---- finisher pending?
      const fin = finishers[S.finIdx];
      if (fin && S.hits >= fin.atScore) {
        const r = await runFinisher(fin);
        if (r === 'retire') { S.result = 'retired'; break; }
        if (r === 'won') { S.result = 'won'; break; }
        continue;                    // finisher solved, duel continues
      }
      if (!finishers.length && S.hits >= target) { S.result = 'won'; break; }
      if (!deck.length) { S.result = S.hits >= target ? 'won' : 'lost'; break; }
      // ---- rival attacks with the first card of the deck
      const pid = deck[0], pair = pairs.get(pid);
      info.phase = 'reply'; info.attack = pid; S.phase = 'reply';
      await say('rival', (opp.attackText && opp.attackText[pid]) || pair.attack);
      const L = learned();
      const opts = L.map(p => ({ text: p.reply, pair: p.id, kind: 'reply' }))
        .concat(asArray(D.weakReplies).map(w => ({ text: w.text, kind: 'weak', w })));
      if (D.comodin) opts.push({ text: D.comodin.text, kind: 'comodin' });
      info.options = opts.map(o => o.text);
      info.correctIndex = opts.findIndex(o => o.pair === pid);
      const i = await game.choose(opts.map(o => o.text));
      const ch = opts[Math.max(0, i)];
      info.options = null; info.correctIndex = -1;
      await say('player', ch.text);
      if (ch.kind === 'reply' && ch.pair === pid) {
        S.hits++; deck.shift(); api.sfx('good');
        if (T.plusOne) ctl.thread(T.plusOne.from, T.plusOne.text);
        if (opp.onHit) await opp.onHit(api, ctl);
        const pending = finishers[S.finIdx];
        const ending = (!finishers.length && S.hits >= target) || (pending && S.hits >= pending.atScore);
        // adenda 7.2: `hurtByPair` (duelo.js u opp) manda sobre la rotación `hurt`; 7.4: cameo único tras el 1.er acierto
        const hp = (opp.hurtByPair && opp.hurtByPair[pid]) || (D.hurtByPair && D.hurtByPair[id] && D.hurtByPair[id][pid]);
        if (!ending) await say('rival', hp || next('hurt'));
        const cam = D.cameos && D.cameos[id];
        if (cam && S.hits === 1 && api.once('cameo:' + id)) ctl.thread(cam.from, cam.text, cam.ms);
        continue;
      }
      if (ch.kind === 'comodin' && !S.comodinUsed) {
        S.comodinUsed = true;
        await say('rival', fax && D.comodin.answerFax ? D.comodin.answerFax : (opp.comodinAnswer || D.comodin.answer));
        continue;                    // same attack again, no score change
      }
      // ---- miss
      S.misses++; S.re++; deck.push(deck.shift()); api.sfx('bad');
      if (S.misses >= maxMisses) { S.result = 'lost'; break; }
      if (ch.kind === 'weak') {
        // adenda 7.3: grito en off la 1.ª vez en toda la partida; contestación propia por rival (`answers[id]`)
        if (ch.w.offOnce && api.once('weak:' + ch.w.text)) await say(ch.w.offOnce[0], ch.w.offOnce[1]);
        await say('rival', (ch.w.answers && ch.w.answers[id]) || (fax && ch.w.answerFax) || ch.w.answer);
      }
      else if (ch.kind === 'comodin') await say('rival', D.comodin.again);
      else await say('rival', next('taunt'));
    }
    won = S.result === 'won';
    info.phase = 'end'; S.phase = 'end';
    if (won) {
      S.assigned = opp.assignedWin || fromName;
      api.sfx('good');
      await api.wait(900);
      game.hud = null; game.hudTop = 0;
      api.setFlag('duel:' + id + ':won', true);
      if (opp.onWin) await opp.onWin(api, ctl);
    } else {
      S.defeat = true; S.cc = T.defeatCc; S.assigned = T.defeatAssigned;
      if (T.defeatLine) await say(T.defeatLine[0], T.defeatLine[1]);
      await api.wait(700);
      game.hud = null; game.hudTop = 0;
      await sayList(opp.defeatLines);
      if (opp.onLose) await opp.onLose(api, ctl, S.result);
    }
    game.lastDuel = { id, result: S.result, hits: S.hits, misses: S.misses };
    return won;
  } finally {
    game.inDialog = Math.max(0, (game.inDialog || 1) - 1);
    game.hud = null; game.hudTop = 0;
    game.duelInfo = null;
    if (music) api.music(prevMusic || null, 0.8);
  }

  async function runFinisher(fin) {
    S.phase = 'finisher'; info.phase = 'finisher'; info.attack = null; info.correctItem = fin.object || null;
    await say('rival', fin.text);
    for (let g2 = 0; g2 < 100; g2++) {
      const greyed = learned().map(p => ({ text: p.reply, disabled: true }));
      const opts = greyed.concat([{ text: T.useObject }, { text: T.retire }]);
      info.options = opts.map(o => o.text);
      info.correctIndex = greyed.length;
      const i = await game.choose(opts);
      info.options = null;
      if (i === greyed.length + 1) return 'retire';
      if (i !== greyed.length) continue;
      info.phase = 'pick';
      const item = await game.pickItem(T.pickPrompt);
      info.phase = 'finisher';
      if (!item) continue;
      if (item === fin.object) {
        S.finIdx++;
        info.phase = 'finisher-script';
        if (fin.script) await fin.script(api, ctl);
        const last = S.finIdx >= finishers.length;
        return (fin.end ?? last) ? 'won' : 'continue';
      }
      const W = D.wrongObject || {};
      const key = opp.wrongObjectKey || id;
      const line = (fin.wrongObject && fin.wrongObject[item]) || (opp.wrongObject && opp.wrongObject[item])
        || (W[key] && W[key][item]) || (opp.wrongObject && opp.wrongObject['*']) || (W[key] && W[key]['*']) || W['*'] || '...';
      await say('rival', line);
    }
    return 'retire';
  }
}

function subjectText(S) {
  return (S.defeat ? 'RV: ' : '') + 'RE: '.repeat(Math.max(0, S.re)) + S.subject;
}

function fit(text, maxW) {
  if (measure(text) <= maxW) return text;
  let t = text;
  while (t.length > 3 && measure(t + '...') > maxW) t = t.slice(0, -1);
  return t.trimEnd() + '...';
}

/** Mail (or fax) window at the top of the room view. */
function drawHud(g, game, S) {
  const fax = S.style === 'fax';
  const C = fax
    ? { bg: '#e8dfc6', bar: '#b4a68a', barText: '#3a3020', label: '#6e6454', text: '#2a2218', line: '#92856e', edge: '#4e463c', assign: '#952a24', win: '#1e5a2a' }
    : { bg: '#141a30', bar: '#2c5098', barText: '#e8f0ff', label: '#7e90c0', text: '#e8ecf8', line: '#26305c', edge: '#06080f', assign: '#f2d468', win: '#9cf0a4' };
  const x = 6, y = 2, w = 308, h = 45;
  g.save(); g.globalAlpha = fax ? 0.97 : 0.93; rect(g, x, y, w, h, C.bg); g.restore();
  frameRect(g, x - 1, y - 1, w + 2, h + 2, C.edge);
  rect(g, x, y, w, 9, C.bar);
  if (fax) { for (let i = x + 2; i < x + w - 2; i += 6) rect(g, i, y + 4, 2, 1, C.line); }
  drawText(g, fax ? 'FAX  ·  TALLERES  ·  Nº 0001' : 'RESPONDER A TODOS', x + 4, y - 1, C.barText, { outline: null, bold: !fax });
  if (!fax) { for (let i = 0; i < 3; i++) rect(g, x + w - 8 - i * 6, y + 3, 4, 3, i === 0 ? '#e86040' : '#8aa0d0'); }
  const row = (yy, label, value, col) => {
    drawText(g, label, x + 4, yy, C.label, { outline: null });
    const lw = measure(label) + 4;
    drawText(g, fit(value, w - lw - 8), x + 4 + lw, yy, col || C.text, { outline: null });
  };
  const para = 'Para: ' + S.to + (S.cc ? '   CC: ' + S.cc : '');
  row(y + 8, 'De:', S.from + '   ' + para);
  row(y + 19, 'Asunto:', subjectText(S));
  hline(g, x + 3, y + 31, w - 6, C.line);
  drawText(g, 'Asignado a:', x + 4, y + 32, C.label, { outline: null });
  const lw = measure('Asignado a:') + 5;
  const won = S.result === 'won';
  drawText(g, S.assigned, x + 4 + lw, y + 32, won ? C.win : C.assign, { outline: fax ? null : '#000000', bold: true });
  // hits as "+1" stamps, misses as small crosses, right-aligned
  let rx = x + w - 6;
  for (let i = 0; i < 3; i++) {
    const on = i < S.misses;
    rx -= 6; rect(g, rx, y + 36, 5, 5, on ? (fax ? '#952a24' : '#e86040') : C.line);
    if (on) { rect(g, rx + 1, y + 38, 3, 1, C.bg); }
  }
  rx -= 6;
  for (let i = 0; i < S.hits; i++) { const tw = measure('+1'); rx -= tw + 3; drawText(g, '+1', rx, y + 32, C.win, { outline: fax ? null : '#000000' }); }
  if (S.thread && game.realTime < S.thread.until) {
    const t = S.thread.from + ' ' + S.thread.text;
    const tw = Math.min(300, measure(t) + 8);
    g.save(); g.globalAlpha = 0.85; rect(g, 160 - tw / 2, y + h + 1, tw, 11, fax ? '#d2c6a8' : '#0c1020'); g.restore();
    drawText(g, fit(t, 296), 160, y + h + 1, fax ? '#2a2218' : '#9cf0a4', { align: 'center', outline: null });
  }
  void vline;
}
