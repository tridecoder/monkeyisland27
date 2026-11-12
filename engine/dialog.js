// Data-driven dialog trees. See docs/CONTENT_SCHEMA.md#dialogs
//
// dialog = { actor: 'npcId', start: 'nodeId', onStart?, onEnd?, nodes: { nodeId: {
//   onEnter?: async api => (nodeId|'exit'|void),
//   options: [ { id?, text, say?, silent?, if?, once?, reply?, lines?, do?, goto?, exit? } ] } } }

export function findDialog(game, id) {
  const room = game.room && game.room.def;
  return (room && room.dialogs && room.dialogs[id]) || game.content.dialogs[id] || null;
}

function txt(game, t, api) {
  try { return typeof t === 'function' ? String(t(api)) : String(t); } catch (e) { game.error('texto de opción falló', e); return '???'; }
}

export async function runDialog(game, api, id, startNode) {
  const def = typeof id === 'object' ? id : findDialog(game, id);
  const dId = typeof id === 'object' ? (id.id || 'anon') : id;
  if (!def) { game.error('Diálogo desconocido: ' + id); return; }
  const nodes = def.nodes || {};
  let nodeId = startNode || def.start || Object.keys(nodes)[0];
  const usedKey = (n, o, i) => `${dId}.${n}.${o.id || i}`;
  game.state.dialogs = game.state.dialogs || {};
  const npc = def.actor;
  game.inDialog = (game.inDialog || 0) + 1;
  try { await dialogLoop(); } finally { game.inDialog = Math.max(0, game.inDialog - 1); }
  async function dialogLoop() {
  if (def.onStart) await def.onStart(api);
  let guard = 0;
  while (nodeId && nodeId !== 'exit') {
    if (++guard > 500) { game.error('Diálogo en bucle: ' + dId); break; }
    const node = nodes[nodeId];
    if (!node) { game.error(`Nodo de diálogo desconocido: ${dId}.${nodeId}`); break; }
    if (node.onEnter) {
      const r = await node.onEnter(api);
      if (r === 'exit') break;
      if (typeof r === 'string' && r !== nodeId) { nodeId = r; continue; }
    }
    const all = node.options || [];
    const avail = [];
    all.forEach((o, i) => {
      if (o.once && game.state.dialogs[usedKey(nodeId, o, i)]) return;
      let ok = true;
      try { ok = game.cond(o.if, api); } catch (e) { game.error('condición de opción falló', e); ok = false; }
      if (ok) avail.push({ o, i });
    });
    if (!avail.length) { if (node.fallback) { nodeId = node.fallback; continue; } break; }
    const idx = await game.choose(avail.map(a => txt(game, a.o.text, api)));
    if (idx < 0) break;
    const { o, i } = avail[idx];
    if (o.once) game.state.dialogs[usedKey(nodeId, o, i)] = true;
    if (!o.silent) await api.say(o.say != null ? (typeof o.say === 'function' ? o.say(api) : o.say) : txt(game, o.text, api));
    if (o.reply != null) await api.sayAs(o.replyBy || npc, typeof o.reply === 'function' ? o.reply(api) : o.reply);
    if (o.lines) for (const [who, line] of o.lines) {
      if (who === 'player' || who === game.G.player) await api.say(line);
      else if (who === 'narrator') await api.narrate(line);
      else await api.sayAs(who, line);
    }
    let r;
    if (o.do) r = await o.do(api);
    if (o.setFlag) { for (const [k, v] of Object.entries(typeof o.setFlag === 'string' ? { [o.setFlag]: true } : o.setFlag)) api.setFlag(k, v); }
    if (r === 'exit' || (o.exit && typeof r !== 'string')) break;
    nodeId = typeof r === 'string' ? r : (o.goto || nodeId);
  }
  if (def.onEnd) await def.onEnd(api);
  }
}
