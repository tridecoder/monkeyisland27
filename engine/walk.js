// Walkable areas: union of polygons with visibility-graph A* pathfinding.

export function pointInPoly(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function closestOnSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy || 1;
  let t = ((px - ax) * dx + (py - ay) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return [ax + dx * t, ay + dy * t];
}

export class WalkMap {
  /** boxes: [{ id, poly:[[x,y],...], enabled, when }] — `when` (a condition, docs §8) is evaluated by the game
   *  (Game.refreshWalkboxes) on room entry, after every flag change and when a blocking script ends. */
  constructor(boxes = []) {
    this.boxes = boxes.map((b, i) => ({ id: b.id || ('box' + i), poly: b.poly, enabled: b.enabled !== false, when: b.when, scale: b.scale }));
    this.scaled = this.boxes.some(b => b.scale != null);      // alguna zona con escala propia (Game.roomScale)
    this.rebuild();
  }
  setEnabled(id, on) {
    const b = this.boxes.find(b => b.id === id);
    if (!b) { console.warn('[walk] unknown walkbox', id); return; }
    b.enabled = !!on; this.rebuild();
  }
  get active() { return this.boxes.filter(b => b.enabled); }
  inside(x, y) { return this.active.some(b => pointInPoly(x, y, b.poly)); }
  /** Walkbox activo que contiene el punto (con `scaledOnly`, solo los que tienen escala propia; gana el último). */
  boxAt(x, y, scaledOnly = false) {
    let hit = null;
    for (const b of this.active) if ((!scaledOnly || b.scale != null) && pointInPoly(x, y, b.poly)) hit = b;
    return hit;
  }
  rebuild() {
    this.nodes = [];
    for (const b of this.active) {
      const P = b.poly, n = P.length;
      for (let i = 0; i < n; i++) {
        const [x, y] = P[i];
        // try candidates around vertex, preferring the bisector toward the inside
        const [px0, py0] = P[(i + n - 1) % n], [nx, ny] = P[(i + 1) % n];
        let bx = (px0 - x) / (Math.hypot(px0 - x, py0 - y) || 1) + (nx - x) / (Math.hypot(nx - x, ny - y) || 1);
        let by = (py0 - y) / (Math.hypot(px0 - x, py0 - y) || 1) + (ny - y) / (Math.hypot(nx - x, ny - y) || 1);
        const bl = Math.hypot(bx, by) || 1; bx /= bl; by /= bl;
        const cands = [[x + bx * 2.5, y + by * 2.5], [x - bx * 2.5, y - by * 2.5]];
        for (let k = 0; k < 8; k++) cands.push([x + Math.cos(k * Math.PI / 4) * 3, y + Math.sin(k * Math.PI / 4) * 3]);
        const c = cands.find(([cx, cy]) => this.inside(cx, cy));
        if (c) this.nodes.push(c);
      }
    }
    // node visibility graph
    const N = this.nodes.length;
    this.adj = Array.from({ length: N }, () => []);
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      if (this.clear(this.nodes[i], this.nodes[j])) {
        const d = Math.hypot(this.nodes[i][0] - this.nodes[j][0], this.nodes[i][1] - this.nodes[j][1]);
        this.adj[i].push([j, d]); this.adj[j].push([i, d]);
      }
    }
  }
  /** Straight segment stays inside the walkable union. */
  clear(a, b) {
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const steps = Math.max(1, Math.ceil(d / 1.5));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      if (!this.inside(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)) return false;
    }
    return true;
  }
  /** Nearest walkable point to (x,y). */
  nearest(x, y) {
    if (this.inside(x, y)) return [x, y];
    let best = null, bd = Infinity;
    for (const b of this.active) {
      const P = b.poly;
      for (let i = 0; i < P.length; i++) {
        const [cx, cy] = closestOnSeg(x, y, P[i][0], P[i][1], P[(i + 1) % P.length][0], P[(i + 1) % P.length][1]);
        const d = Math.hypot(cx - x, cy - y);
        if (d < bd) { bd = d; best = [cx, cy, b]; }
      }
    }
    if (!best) return [x, y];
    // nudge inward
    let [cx, cy] = best;
    const P = best[2].poly;
    const mx = P.reduce((s, p) => s + p[0], 0) / P.length, my = P.reduce((s, p) => s + p[1], 0) / P.length;
    for (let k = 0; k < 12 && !this.inside(cx, cy); k++) {
      const dl = Math.hypot(mx - cx, my - cy) || 1;
      cx += (mx - cx) / dl * 0.75; cy += (my - cy) / dl * 0.75;
    }
    if (!this.inside(cx, cy)) {
      for (let r = 1; r < 6; r++) for (let k = 0; k < 8; k++) {
        const tx = best[0] + Math.cos(k * Math.PI / 4) * r, ty = best[1] + Math.sin(k * Math.PI / 4) * r;
        if (this.inside(tx, ty)) return [tx, ty];
      }
    }
    return [cx, cy];
  }
  /** Path from a to b as list of points (excluding a). Unreachable -> closest reachable point. */
  findPath(a, b) {
    if (!this.active.length) return [b];
    const start = this.inside(a[0], a[1]) ? a : this.nearest(a[0], a[1]);
    const goal = this.nearest(b[0], b[1]);
    const prefix = start === a ? [] : [start];
    if (this.clear(start, goal)) return [...prefix, goal];
    const N = this.nodes.length;
    const S = N, G = N + 1;
    const pos = i => (i === S ? start : i === G ? goal : this.nodes[i]);
    const neigh = i => {
      if (i === S) {
        const r = [];
        for (let j = 0; j < N; j++) if (this.clear(start, this.nodes[j])) r.push([j, Math.hypot(start[0] - this.nodes[j][0], start[1] - this.nodes[j][1])]);
        return r;
      }
      const r = this.adj[i].slice();
      if (this.clear(this.nodes[i], goal)) r.push([G, Math.hypot(goal[0] - this.nodes[i][0], goal[1] - this.nodes[i][1])]);
      return r;
    };
    const dist = new Map([[S, 0]]), prev = new Map(), open = new Set([S]), closed = new Set();
    const h = i => Math.hypot(pos(i)[0] - goal[0], pos(i)[1] - goal[1]);
    while (open.size) {
      let cur = null, cf = Infinity;
      for (const i of open) { const f = dist.get(i) + h(i); if (f < cf) { cf = f; cur = i; } }
      if (cur === G) break;
      open.delete(cur); closed.add(cur);
      for (const [j, d] of neigh(cur)) {
        if (closed.has(j)) continue;
        const nd = dist.get(cur) + d;
        if (nd < (dist.has(j) ? dist.get(j) : Infinity)) { dist.set(j, nd); prev.set(j, cur); open.add(j); }
      }
    }
    let target = G;
    if (!dist.has(G)) {
      // unreachable: walk to the reachable node closest to the goal
      let best = S, bd = h(S);
      for (const i of dist.keys()) if (h(i) < bd) { bd = h(i); best = i; }
      target = best;
    }
    const path = [];
    for (let c = target; c !== S && c !== undefined; c = prev.get(c)) path.unshift(pos(c));
    return [...prefix, ...path];
  }
}
