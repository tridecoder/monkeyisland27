// PROPUESTA · «greybox» de sala a 1x: paredes y suelos por zona (con su color), muebles, objetos como bloques, kit de
// puertas/ascensor/escalera/placas real y los PNJ con sus sprites reales. Sirve de base a la maqueta (capa a 3x encima).
import { PAL, rect, hline, vline, frameRect, poly, paint, ditherPick, hash2, bevel, gradV, ditherOverlay, shade, vignette } from '../../../../engine/draw.js';
import { tiny } from '../../../../content/rooms/art/lib-oficina.js';
import { placa, rotuloDepto, rotuloDeptoW, ascensor, escalera, umbral, PLANTA } from './kit.js';
import { actor, sentado, escalaSala } from './actores.js';

const VPY = 10;
export function pintaGreybox(d, o = {}) {
  const W = d.width, FL = d.FL || 96;
  const c = document.createElement('canvas'); c.width = W; c.height = 144;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  const vpx = W / 2;
  const zonas = d.zonas && d.zonas.length ? d.zonas : [{ x0: 0, x1: W, pared: '#3a3a48', suelo: ['#2a2a34', '#34343e', '#3e3e48'] }];
  // techo
  gradV(g, 0, 0, W, 14, [PAL.ink[0], PAL.ink[1], PAL.metal[1]]);
  for (let x = 6; x < W; x += 40) { rect(g, x, 10, 26, 3, PAL.metal[2]); rect(g, x + 1, 11, 24, 1, '#e8f0e8'); }
  // paredes por zona (+ filete de color de zona)
  for (const z of zonas) {
    paint(g, z.x0, 14, z.x1 - z.x0, FL - 14, (x, y) => ditherPick(x, y, [shade(z.pared, -0.12), z.pared, shade(z.pared, 0.1)], 0.7 - (y - 14) / 140 + (hash2(x >> 1, y >> 1, 3) < 0.05 ? -0.2 : 0)));
    if (z.c) { rect(g, z.x0, 66, z.x1 - z.x0, 2, z.c); hline(g, z.x0, 68, z.x1 - z.x0, shade(z.c, -0.5)); }
    rect(g, z.x0, FL - 3, z.x1 - z.x0, 3, shade(z.pared, -0.4));
    if (z.x0 > 0) { rect(g, z.x0 - 2, 14, 4, FL - 14, PAL.metal[3]); vline(g, z.x0 - 2, 14, FL - 14, PAL.metal[5]); }
  }
  // suelos por zona en perspectiva
  const aSuelo = (x, y) => vpx + (x - vpx) * (FL - VPY) / Math.max(1, y - VPY);
  paint(g, 0, FL, W, 144 - FL, (x, y) => {
    const xb = aSuelo(x, y);
    const z = zonas.find(zz => xb >= zz.x0 && xb < zz.x1) || zonas[xb < 0 ? 0 : zonas.length - 1];
    const t = (y - FL) / (144 - FL);
    return ditherPick(x, y, z.suelo, 0.2 + t * 0.6 + (hash2(x, y, 9) < 0.05 ? -0.2 : 0));
  });
  for (const z of zonas) if (z.x0 > 0) {
    const x2 = vpx + (z.x0 - vpx) * (144 - VPY) / (FL - VPY);
    g.save(); g.strokeStyle = '#c8ccd8'; g.lineWidth = 1; g.beginPath(); g.moveTo(z.x0 + 0.5, FL); g.lineTo(x2 + 0.5, 144); g.stroke(); g.restore();
  }
  ditherOverlay(g, 0, FL, W, 3, PAL.ink[0], 0.5);
  // escaleras y ascensores del kit
  for (const e of d.escaleras || []) escalera(g, e.x, e.y, e.w, e.h, e.dir);
  for (const a of d.ascensores || []) ascensor(g, a.x, a.y, a.w, a.h, a.planta);
  // objetos (hotspots) como bloques: salidas oscuras, el resto claro
  for (const h of d.hs || []) {
    const [x, y, w, hh] = h.r;
    if (h.cat === 'salida') {
      if ((d.escaleras || []).some(e => x <= e.x + 2 && x + w >= e.x + e.w - 2 && Math.abs(e.y - y) < 20)) continue;
      if ((d.ascensores || []).some(a => Math.abs(a.x - x) < 10)) continue;
      rect(g, x - 2, y - 2, w + 4, hh + 2, PAL.metal[2]); gradV(g, x, y, w, hh, [PAL.ink[0], PAL.ink[1], PAL.ink[2]]);
      umbral(g, x - 2, Math.min(140, y + hh + 2), w + 4, 5, (PLANTA[d.planta] || PLANTA['1']).c);
      continue;
    }
    const base = h.cat === 'pnj' ? '#b0a8c8' : h.cat === 'estado' ? '#b8b0b8' : h.cat === 'coger' ? '#d8cca0' : '#9a9aa8';
    bevel(g, x, y, w, hh, shade(base, -0.25), shade(base, 0.05), shade(base, -0.55));
    if (w > 18 && hh > 8) tiny(g, (h.corto || h.id.split('_')[0]).toUpperCase().slice(0, Math.floor((w - 2) / 4)), x + 2, y + 2, '#1a1824');
  }
  // muebles (no interactivos)
  for (const m of d.muebles || []) {
    const [x, y, w, h] = m.r;
    bevel(g, x, y, w, h, shade(m.c, -0.1), shade(m.c, 0.25), shade(m.c, -0.5));
    if (m.t && w > 4 * m.t.length) tiny(g, m.t, x + (w >> 1), y + (h >> 1) - 2, '#141220', { align: 'center' });
  }
  // rótulos y placas
  for (const [dep, cx, txt] of d.rotulos || []) { const w = rotuloDeptoW(dep, { texto: txt }); rotuloDepto(g, Math.round(cx - w / 2), 16, dep, { texto: txt, colgado: 2 }); }
  for (const p of d.placas || []) placa(g, p.x, p.y, p.txt, { planta: p.planta, flecha: p.sinFlecha ? null : p.flecha });
  vignette(g, W, 144, 0.25);
  // PNJ reales
  const lista = [...(d.npcs || [])].sort((a, b) => a.at[1] - b.at[1]);
  for (const n of lista) {
    if (n.id.startsWith('_') || n.caja) continue;
    const s = escalaSala(d.scale, n.at[1]);
    if (n.sentado) sentado(g, n.id, n.at[0], n.at[1], { escala: s, dir: n.dir || 'down' });
    else actor(g, n.id, n.at[0], n.at[1], { escala: s, dir: n.dir || 'down', variante: n.variante });
  }
  // los oclusores se repintan encima de los PNJ sentados (mesa/mostrador tapan el regazo)
  for (const oc of d.oclusores || []) {
    const m = (d.muebles || []).find(mm => mm.r.join() === oc.r.join());
    if (m) { const [x, y, w, h] = m.r; bevel(g, x, y, w, h, shade(m.c, -0.1), shade(m.c, 0.25), shade(m.c, -0.5)); if (m.t) tiny(g, m.t, x + (w >> 1), y + (h >> 1) - 2, '#141220', { align: 'center' }); }
  }
  if (o.extra) o.extra(g);
  return c;
}
void frameRect;
