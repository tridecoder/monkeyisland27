// PROPUESTA · capa de maqueta (a 3x, vectorial y nítida) sobre un fondo 1x: zonas, walkbox con profundidad, hotspots por
// categoría con su id, PNJ y puntos de habla de Bruno, líneas de visión, oclusores y la franja de globos (y < 45).
import { escalaSala, cajaActor, nombre } from './actores.js';

export const CAT = {
  salida: { c: '#33d6ff', txt: 'salida' },
  coger: { c: '#ffd23f', txt: 'se coge' },
  estado: { c: '#ff4fd8', txt: 'cambia de estado' },
  pnj: { c: '#ff8a30', txt: 'PNJ' },
  deco: { c: '#b4b4c8', txt: 'decorado con texto' },
};

function dashed(g, pts, color, w = 2, dash = [6, 4], close = true) {
  g.save(); g.strokeStyle = color; g.lineWidth = w; g.setLineDash(dash);
  g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); if (close) g.closePath(); g.stroke(); g.restore();
}
function etiqueta(g, txt, x, y, color, o = {}) {
  g.save();
  g.font = `${o.bold ? 'bold ' : ''}${o.size || 11}px "DejaVu Sans Mono", monospace`;
  const w = g.measureText(txt).width + 6, h = (o.size || 11) + 4;
  let lx = x, ly = y;
  if (o.align === 'center') lx = x - w / 2;
  if (o.align === 'right') lx = x - w;
  lx = Math.max(1, Math.min(g.canvas.width - w - 1, lx));
  ly = Math.max(1, Math.min(g.canvas.height - h - 1, ly));
  g.globalAlpha = o.alpha ?? 0.86; g.fillStyle = o.bg || '#0b0a14'; g.fillRect(lx, ly, w, h);
  g.globalAlpha = 1; g.fillStyle = color; g.fillText(txt, lx + 3, ly + h - 4);
  if (o.borde) { g.strokeStyle = color; g.lineWidth = 1; g.strokeRect(lx + 0.5, ly + 0.5, w - 1, h - 1); }
  g.restore();
  return { x: lx, y: ly, w, h };
}
export { etiqueta };

/** pinta la capa de maqueta sobre `g` (canvas a escala S de una sala de ancho W). d: datos de la sala (ver datos.js) */
export function capa(g, d, S = 3, o = {}) {
  const W = d.width || 320;
  const P = (p) => p.map(([x, y]) => [x * S, y * S]);
  g.save();
  // franja de globos
  if (o.globos !== false) {
    g.fillStyle = 'rgba(255,255,255,0.05)'; g.fillRect(0, 0, W * S, 45 * S);
    dashed(g, [[0, 45 * S], [W * S, 45 * S]], 'rgba(255,255,255,0.35)', 1, [3, 5], false);
    etiqueta(g, 'y<45: franja de globos y ventana de duelo (sin pistas de puzle)', W * S - 4, 45 * S - 18, '#d8d8e8', { align: 'right', size: 10, alpha: 0.6 });
  }
  // zonas
  for (const z of d.zonas || []) {
    const pts = z.poly || [[z.r[0], z.r[1]], [z.r[0] + z.r[2], z.r[1]], [z.r[0] + z.r[2], z.r[1] + z.r[3]], [z.r[0], z.r[1] + z.r[3]]];
    g.save(); g.globalAlpha = 0.16; g.fillStyle = z.c; g.beginPath(); P(pts).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); g.restore();
    dashed(g, P(pts), z.c, 2, [10, 5]);
    const lx = (z.lx ?? pts[0][0] + 2) * S, ly = (z.ly ?? (pts[pts.length - 1][1] - 12)) * S;
    etiqueta(g, z.nombre, lx, ly, z.c, { bold: true, size: 12, borde: true });
  }
  // walkbox(es)
  for (const wb of d.walk || []) {
    g.save(); g.globalAlpha = 0.13; g.fillStyle = '#5aff7a'; g.beginPath(); P(wb.poly).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); g.restore();
    dashed(g, P(wb.poly), wb.when ? '#b8ff5a' : '#5aff7a', 2, [4, 3]);
    if (wb.id) { const [x, y] = wb.poly[wb.poly.length - 1]; etiqueta(g, 'walkbox ' + wb.id + (wb.when ? ' (' + wb.when + ')' : ''), x * S + 4, y * S - 22, '#5aff7a', { size: 10 }); }
  }
  // bandas de profundidad (escala)
  if (d.scale && o.escalas !== false) {
    for (const y of [d.scale.yFar, d.scale.yNear]) {
      dashed(g, [[0, y * S], [16 * S, y * S]], '#5aff7a', 2, [2, 2], false);
      etiqueta(g, `y${y} ×${escalaSala(d.scale, y).toFixed(2)}`, 2, y * S - 16, '#5aff7a', { size: 9, alpha: 0.7 });
    }
  }
  // oclusores (primer plano / mobiliario que tapa)
  for (const oc of d.oclusores || []) {
    const [x, y, w, h] = oc.r.map(v => v * S);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.strokeStyle = 'rgba(255,90,90,0.55)'; g.lineWidth = 1.5;
    for (let k = -h; k < w; k += 9) { g.beginPath(); g.moveTo(x + k, y + h); g.lineTo(x + k + h, y); g.stroke(); }
    g.restore();
    g.strokeStyle = '#ff6a6a'; g.lineWidth = 1.5; g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    if (oc.txt) etiqueta(g, oc.txt, x + 2, y + h - 16, '#ff9a9a', { size: 9 });
  }
  // hotspots
  const placed = [];
  for (const h of d.hs || []) {
    const cat = CAT[h.cat] || CAT.deco;
    const [x, y, w, hh] = h.r.map(v => v * S);
    g.save(); g.globalAlpha = 0.12; g.fillStyle = cat.c; g.fillRect(x, y, w, hh); g.restore();
    g.strokeStyle = cat.c; g.lineWidth = h.nuevo ? 3 : 2; g.setLineDash(h.cat === 'salida' ? [8, 3] : []);
    g.strokeRect(x + 1, y + 1, w - 2, hh - 2); g.setLineDash([]);
    // etiqueta: evitar solapes desplazando hacia abajo
    let ly = y + 2, lx = x + 3;
    if (h.lab) { lx = (h.lab[0]) * S; ly = (h.lab[1]) * S; }
    for (let k = 0; k < 6; k++) {
      const hit = placed.find(p => lx < p.x + p.w && lx + (h.id.length * 7 + 8) > p.x && ly < p.y + p.h && ly + 15 > p.y);
      if (!hit) break; ly = hit.y + hit.h + 1;
    }
    placed.push(etiqueta(g, h.id, lx, ly, cat.c, { size: 10 }));
    if (h.walkTo && o.walkTo !== false) { g.fillStyle = cat.c; g.fillRect(h.walkTo[0] * S - 2, h.walkTo[1] * S - 2, 4, 4); }
  }
  // líneas de visión (escena clave)
  for (const v of d.vistas || []) {
    g.save(); g.strokeStyle = v.c || '#fff27a'; g.lineWidth = 2; g.setLineDash([3, 4]);
    g.beginPath(); g.moveTo(v.de[0] * S, v.de[1] * S); g.lineTo(v.a[0] * S, v.a[1] * S); g.stroke(); g.setLineDash([]);
    const ang = Math.atan2(v.a[1] - v.de[1], v.a[0] - v.de[0]);
    g.fillStyle = v.c || '#fff27a'; g.beginPath(); g.moveTo(v.a[0] * S, v.a[1] * S);
    g.lineTo(v.a[0] * S - 10 * Math.cos(ang - 0.4), v.a[1] * S - 10 * Math.sin(ang - 0.4));
    g.lineTo(v.a[0] * S - 10 * Math.cos(ang + 0.4), v.a[1] * S - 10 * Math.sin(ang + 0.4)); g.closePath(); g.fill();
    if (v.txt) etiqueta(g, v.txt, ((v.de[0] + v.a[0]) / 2) * S, ((v.de[1] + v.a[1]) / 2) * S - 8, v.c || '#fff27a', { size: 10, align: 'center' });
    g.restore();
  }
  // PNJ: caja del sprite, pies y punto de habla de Bruno
  for (const n of d.npcs || []) {
    const s = escalaSala(d.scale, n.at[1]);
    const b = n.caja || (n.id.startsWith('_') ? { x: n.at[0] - 8, y: n.at[1] - 50, w: 16, h: 50 } : cajaActor(n.id, n.at[0], n.at[1], s, n.variante));
    if (n.sentado) { b.h = Math.round(b.h * 0.66); b.y = n.at[1] - b.h; }
    g.strokeStyle = CAT.pnj.c; g.lineWidth = 2; g.setLineDash([2, 2]); g.strokeRect(b.x * S, b.y * S, b.w * S, b.h * S); g.setLineDash([]);
    g.fillStyle = CAT.pnj.c; g.beginPath(); g.arc(n.at[0] * S, n.at[1] * S, 5, 0, Math.PI * 2); g.fill();
    etiqueta(g, (n.txt || nombre(n.id)) + (n.sentado ? ' (sentado)' : ''), b.x * S, (b.y - 0) * S - 17, CAT.pnj.c, { size: 10, bold: true });
    if (n.talk) {
      const [tx, ty] = n.talk;
      g.save(); g.strokeStyle = '#ffffff'; g.lineWidth = 2; g.setLineDash([2, 3]);
      g.beginPath(); g.moveTo(tx * S, ty * S); g.lineTo(n.at[0] * S, (n.at[1] - 4) * S); g.stroke(); g.restore();
      g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(tx * S, ty * S - 7); g.lineTo(tx * S + 7, ty * S); g.lineTo(tx * S, ty * S + 7); g.lineTo(tx * S - 7, ty * S); g.closePath(); g.fill();
      g.fillStyle = '#0b0a14'; g.font = 'bold 9px monospace'; g.fillText('B', tx * S - 3, ty * S + 3);
    }
  }
  // notas libres
  for (const nt of d.notas || []) etiqueta(g, nt.txt, nt.x * S, nt.y * S, nt.c || '#ffffff', { size: nt.size || 10, align: nt.align, bold: nt.bold });
  g.restore();
}

/** leyenda horizontal de categorías */
export function leyenda(g, x, y) {
  let cx = x;
  const items = [...Object.values(CAT).map(c => [c.c, c.txt, 'box']), ['#5aff7a', 'walkbox', 'dash'], ['#ffffff', 'Bruno habla aquí', 'rombo'], ['#fff27a', 'línea de visión', 'arrow'], ['#ff6a6a', 'oclusor / 1.er plano', 'hatch']];
  g.save(); g.font = '12px "DejaVu Sans Mono", monospace';
  for (const [c, t, k] of items) {
    g.strokeStyle = c; g.fillStyle = c; g.lineWidth = 2;
    if (k === 'box') g.strokeRect(cx, y, 14, 12);
    else if (k === 'dash') { g.setLineDash([4, 3]); g.strokeRect(cx, y, 14, 12); g.setLineDash([]); }
    else if (k === 'rombo') { g.beginPath(); g.moveTo(cx + 7, y); g.lineTo(cx + 14, y + 6); g.lineTo(cx + 7, y + 12); g.lineTo(cx, y + 6); g.closePath(); g.fill(); }
    else if (k === 'arrow') { g.setLineDash([3, 3]); g.beginPath(); g.moveTo(cx, y + 6); g.lineTo(cx + 14, y + 6); g.stroke(); g.setLineDash([]); }
    else { g.strokeRect(cx, y, 14, 12); g.beginPath(); g.moveTo(cx, y + 12); g.lineTo(cx + 12, y); g.stroke(); }
    g.fillStyle = '#e8e8f0'; g.fillText(t, cx + 19, y + 11);
    cx += 19 + g.measureText(t).width + 18;
  }
  g.restore();
  return cx;
}
void dashed;
