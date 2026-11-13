// PROPUESTA · composición de láminas (varias imágenes con título) para el informe.
export function lamina(filas, o = {}) {
  const pad = o.pad ?? 12, th = (o.titulo ? 34 : 0) + (o.extraTop || 0), lh = 22;
  const anchos = filas.map(f => f.reduce((s, it) => s + it.c.width, 0) + pad * (f.length + 1));
  const W = Math.max(...anchos, o.minW || 0);
  const H = th + filas.reduce((s, f) => s + Math.max(...f.map(it => it.c.height)) + lh + pad, pad);
  const k = document.createElement('canvas'); k.width = W; k.height = H;
  const g = k.getContext('2d'); g.imageSmoothingEnabled = false;
  g.fillStyle = o.fondo || '#16141f'; g.fillRect(0, 0, W, H);
  if (o.titulo) { g.fillStyle = '#f2ecd8'; g.font = 'bold 20px "DejaVu Sans", sans-serif'; g.fillText(o.titulo, pad, 25); }
  let y = th + pad;
  for (const f of filas) {
    let x = pad;
    const fh = Math.max(...f.map(it => it.c.height));
    for (const it of f) {
      g.font = 'bold 14px "DejaVu Sans", sans-serif';
      g.fillStyle = it.color || (it.t && /^ACTUAL/.test(it.t) ? '#ff9a7a' : /^PROPUESTA/.test(it.t || '') ? '#7affa0' : '#d8d4e8');
      if (it.t) g.fillText(it.t, x, y + 15);
      g.drawImage(it.c, x, y + lh);
      x += it.c.width + pad;
    }
    y += fh + lh + pad;
  }
  return k;
}
/** recorta una captura del juego al visor de sala (320×144 de 320×200) a la escala que traiga */
export function visor(img) {
  const s = img.width / 320;
  const k = document.createElement('canvas'); k.width = img.width; k.height = Math.round(144 * s);
  k.getContext('2d').drawImage(img, 0, 0);
  return k;
}
export function copia(c) { const k = document.createElement('canvas'); k.width = c.width; k.height = c.height; k.getContext('2d').drawImage(c, 0, 0); return k; }
