// Debug overlay (?debug=1): walkboxes, hotspots, actor positions, mouse coords, and a console.
import { drawText } from './font.js';
import { line, frameRect, px } from './draw.js';

export class Debug {
  constructor(game, on) {
    this.game = game;
    this.on = on;
    this.overlay = on;
    this.el = null;
    if (on) this.makeConsole();
  }
  consoleFocused() { return this.input && document.activeElement === this.input; }
  key(e) {
    if (!this.on) return;
    if (e.key === 'F2' || e.key === '`') { this.overlay = !this.overlay; e.preventDefault(); }
    if (e.key === 'F3' && this.input) { this.input.focus(); e.preventDefault(); }
  }
  makeConsole() {
    const wrap = document.createElement('div');
    wrap.id = 'debug-console';
    wrap.innerHTML = '<pre id="debug-out"></pre><input id="debug-in" placeholder="consola: goto sala [entrada] | give item | giveall | take item | flag nombre [valor] | verb verbo obj [item] | state | o JS (g = __game.game)" autocomplete="off">';
    document.body.appendChild(wrap);
    this.out = wrap.querySelector('#debug-out');
    this.input = wrap.querySelector('#debug-in');
    this.input.addEventListener('keydown', e => {
      e.stopPropagation();
      if (e.key === 'Enter') { this.exec(this.input.value); this.input.value = ''; }
      if (e.key === 'Escape') this.input.blur();
    });
  }
  print(s) {
    if (!this.out) return;
    this.out.textContent = (this.out.textContent + '\n' + s).split('\n').slice(-8).join('\n');
  }
  async exec(cmd) {
    const g = this.game;
    const [c, ...a] = cmd.trim().split(/\s+/);
    try {
      let r;
      switch (c) {
        case 'goto': r = await window.__game.gotoRoom(a[0], a[1]); break;
        case 'give': g.state.inventory.includes(a[0]) || window.__game.giveItem(a[0]); r = g.state.inventory; break;
        case 'giveall': r = window.__game.giveAll(); break;
        case 'take': window.__game.takeItem(a[0]); r = g.state.inventory; break;
        case 'flag': if (a.length > 1) window.__game.setFlag(a[0], JSON.parse(a[1])); r = g.state.flags[a[0]]; break;
        case 'verb': r = await window.__game.doVerb(a[0], a[1], a[2]); break;
        case 'state': r = window.__game.state(); break;
        case 'fast': window.__game.skipText(a[0] !== 'off'); r = g.fast; break;
        default: { const fn = new Function('g', '__game', 'return (' + cmd + ')'); r = await fn(g, window.__game); }
      }
      this.print('> ' + cmd + '\n' + JSON.stringify(r)?.slice(0, 400));
    } catch (e) { this.print('> ' + cmd + '\n! ' + e.message); }
  }
  drawRoom(g) {
    if (!this.on || !this.overlay) return;
    const G = this.game, rt = G.room;
    if (!rt) return;
    for (const b of rt.walk.boxes) {
      const c = b.enabled ? '#40ff60' : '#ff4040';
      for (let i = 0; i < b.poly.length; i++) { const p = b.poly[i], q = b.poly[(i + 1) % b.poly.length]; line(g, p[0], p[1], q[0], q[1], c); }
    }
    for (const n of rt.walk.nodes) px(g, Math.round(n[0]), Math.round(n[1]), '#ffff40');
    for (const o of G.roomObjects()) {
      const st = G.getObjState(o.id);
      const c = !st.visible ? '#604060' : o.hotspot === false ? '#606060' : o.exit ? '#40c0ff' : '#ff60ff';
      if (o.poly) { for (let i = 0; i < o.poly.length; i++) { const p = o.poly[i], q = o.poly[(i + 1) % o.poly.length]; line(g, p[0], p[1], q[0], q[1], c); } }
      else if (o.w) frameRect(g, o.x, o.y, o.w, o.h, c);
      const lx = o.poly ? o.poly[0][0] : o.x, ly = o.poly ? o.poly[0][1] : o.y;
      if (st.visible) drawText(g, o.id, lx + 1, ly + 1, c, {});
      if (o.walkTo) { px(g, o.walkTo[0], o.walkTo[1], '#ffffff'); px(g, o.walkTo[0] + 1, o.walkTo[1], c); }
    }
    for (const a of Object.values(G.actors)) {
      if (a.room !== rt.def.id) continue;
      const b = G.actorBox(a);
      frameRect(g, Math.round(b.x), Math.round(b.y), Math.round(b.w), Math.round(b.h), '#ffa040');
      px(g, Math.round(a.x), Math.round(a.y), '#ffffff');
    }
  }
  draw(g) {
    if (!this.on || !this.overlay) return;
    const G = this.game;
    const m = G.mouse;
    const rx = Math.round(m.x + (G.camX || 0));
    const s = `${G.room ? G.room.def.id : G.mode} ${m.x},${m.y} sala:${rx},${m.y}${G.busy ? ' OCUPADO' : ''}${G.fast ? ' RÁPIDO' : ''}`;
    drawText(g, s, 2, 1, '#ffff80');
  }
}
