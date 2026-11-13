// PROPUESTA · corte del edificio (plantas −1, 0, 1, 2) con UN núcleo vertical (ascensor + escalera) y las 10 salas.
import { PLANTA, DEPTO } from './kit.js';

export function mapaEdificio() {
  const W = 1700, H = 1080;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#16141f'; g.fillRect(0, 0, W, H);
  const T = (t, x, y, col = '#f2ecd8', sz = 15, b = false, al = 'left') => { g.font = `${b ? 'bold ' : ''}${sz}px "DejaVu Sans", sans-serif`; g.fillStyle = col; g.textAlign = al; g.fillText(t, x, y); g.textAlign = 'left'; };
  T('Corte del edificio propuesto · elContable.es', 20, 34, '#f2ecd8', 24, true);
  T('Un solo NÚCLEO vertical (ascensor + escalera) en la misma columna en las 4 plantas. En P0 la sala queda a su izquierda (la calle); en P−1, P1 y P2, a su derecha.', 20, 60, '#c8c4d8', 14);
  const CX = 520, CW = 120;               // núcleo
  const fy = { '2': 110, '1': 330, '0': 600, '-1': 790 }, fh = { '2': 190, '1': 240, '0': 160, '-1': 150 };
  // bandas de planta
  for (const p of ['2', '1', '0', '-1']) {
    const P = PLANTA[p];
    g.fillStyle = P.c + '22'; g.fillRect(10, fy[p], W - 20, fh[p]);
    g.fillStyle = P.c; g.fillRect(10, fy[p], 46, fh[p]);
    T(P.nombre, 33, fy[p] + fh[p] / 2 + 8, '#141220', 22, true, 'center');
    g.fillStyle = '#c8c4d8'; g.fillRect(10, fy[p] + fh[p] - 3, W - 20, 3);
  }
  // núcleo
  const top = fy['2'], bot = fy['-1'] + fh['-1'];
  g.fillStyle = '#2a2a38'; g.fillRect(CX, top, CW, bot - top);
  g.strokeStyle = '#9aa0b0'; g.lineWidth = 3; g.strokeRect(CX, top, CW, bot - top);
  g.fillStyle = '#4a4e5c'; g.fillRect(CX + 8, top + 6, 44, bot - top - 12);              // hueco del ascensor
  T('ASCENSOR', CX + 30, top + 26, '#f2ecd8', 11, true, 'center'); T('-1·0·1·2', CX + 30, top + 42, '#ffb070', 11, false, 'center');
  g.strokeStyle = '#e8c030'; g.lineWidth = 2;                                           // escalera en zigzag
  for (const p of ['2', '1', '0']) {
    const y0 = fy[p] + fh[p] - 6, y1 = fy[p === '2' ? '2' : p] + 10;
    if (p === '2') continue;
    const yUp = fy[String(Number(p) + 1)] + fh[String(Number(p) + 1)] - 6;
    g.beginPath(); g.moveTo(CX + 60, y0); g.lineTo(CX + 112, yUp); g.stroke(); void y1;
  }
  T('ESCALERA', CX + 90, top + 26, '#e8c030', 11, true, 'center');
  T('NÚCLEO', CX + CW / 2, bot + 22, '#9aa0b0', 14, true, 'center');
  // cajas de sala
  const sala = (x, y, w, h, nom, id, col, sub = []) => {
    g.fillStyle = col + '55'; g.fillRect(x, y, w, h); g.strokeStyle = col; g.lineWidth = 3; g.strokeRect(x, y, w, h);
    T(nom, x + 10, y + 24, '#ffffff', 17, true); T('`' + id + '`', x + 10, y + 42, '#c8c4d8', 12);
    sub.forEach((s, i) => T(s, x + 10, y + 62 + i * 17, '#e8e4f0', 12));
  };
  const puerta = (x, y, t, col = '#33d6ff') => { g.fillStyle = col; g.fillRect(x - 5, y - 9, 10, 18); if (t) T(t, x + 8, y + 5, col, 11); };
  // P2
  sala(CX + CW, fy['2'] + 70, 560, 110, 'Ecosistema (400 px)', 'ecosistema', DEPTO.marketing.c, ['núcleo · MARKETING · puerta EVENTOS · COMERCIAL · pasillo']);
  sala(CX + CW + 1, fy['2'] + 70, 0, 0, '', '', '#000');
  sala(CX + CW + 690, fy['2'] + 70, 260, 110, 'Administración', 'administracion', DEPTO.administracion.c, ['espera · VENTANILLA · Controlling', 'archivo']);
  sala(CX + CW + 240, fy['2'] + 4, 330, 56, 'Sala Polivalente (512 px)', 'eventos', DEPTO.eventos.c);
  puerta(CX + CW + 290, fy['2'] + 68, 'puerta (al fondo)', '#e04050');
  g.strokeStyle = '#8ac060'; g.setLineDash([8, 6]); g.beginPath(); g.moveTo(CX + CW + 560, fy['2'] + 125); g.lineTo(CX + CW + 690, fy['2'] + 125); g.stroke(); g.setLineDash([]);
  T('pasillo', CX + CW + 600, fy['2'] + 118, '#8ac060', 12);
  // P1
  sala(CX + CW, fy['1'] + 110, 1000, 125, 'Pecera (800 px)', 'pecera', DEPTO.web.c, ['núcleo │ PASILLO DIRECCIÓN │ WEB │ ECONOMÍA │ INFOGRAFÍA ‖cinta‖ DESARROLLO │ DISEÑO Y PRODUCTO']);
  sala(CX + CW + 40, fy['1'] + 8, 170, 82, 'Pajarera', 'pajarera', DEPTO.direccion.c, ['cristal a la Pecera']);
  sala(CX + CW + 230, fy['1'] + 8, 180, 82, 'Sala Amazonas', 'sala_amazonas', DEPTO.direccion.c, ['tras la Pajarera']);
  sala(CX + CW + 430, fy['1'] + 8, 150, 82, 'Office', 'office', DEPTO.office.c);
  sala(CX + CW + 600, fy['1'] + 30, 220, 74, 'Catacumba (½ nivel ↓)', 'catacumba', DEPTO.papel.c, ['3 peldaños bajo el Office']);
  puerta(CX + CW + 110, fy['1'] + 100, ''); puerta(CX + CW + 400, fy['1'] + 50, ''); puerta(CX + CW + 180, fy['1'] + 100, ''); puerta(CX + CW + 590, fy['1'] + 70, '▼3');
  g.strokeStyle = '#33d6ff'; g.lineWidth = 2; g.beginPath(); g.moveTo(CX + CW + 180, fy['1'] + 100); g.lineTo(CX + CW + 500, fy['1'] + 90); g.stroke();
  T('las dos puertas del PASILLO DE DIRECCIÓN (x 96-170) llevan a Pajarera y Office', CX + CW + 10, fy['1'] + 250 - 0, '#9ad8ff', 12);
  // P0
  sala(60, fy['0'] + 30, CX - 60, 120, 'Vestíbulo', 'vestibulo', '#3f9a5a', ['calle │ ENTRADA │ CONTROL (mostrador bajo + tornos) │ INTERIOR', 'el núcleo queda DETRÁS de los tornos (A§14.1)']);
  T('◄ calle', 70, fy['0'] + 22, '#c8c4d8', 12);
  // P-1
  sala(CX + CW, fy['-1'] + 30, 360, 110, 'Sistemas y CPD', 'cpd', DEPTO.sistemas.c, ['solo ascensor · PASILLO FRÍO · puesto de Paco']);
  // conexiones del núcleo por planta
  const conex = [['2', 'ascensor + escalera ▼ P1'], ['1', 'escalera ▼ P0 / ▲ P2 + ascensor'], ['0', 'escalera ▲ P1 + ascensor (tras el torno)'], ['-1', 'solo ascensor']];
  for (const [p, t] of conex) T(t, CX + CW / 2, fy[p] + fh[p] - 12, '#ffd890', 11, false, 'center');
  // notas de contradicciones resueltas
  const notas = [
    '✔ Se acaba la puerta «VESTÍBULO» a ras de suelo en la Pecera: se llega SUBIENDO por la escalera del núcleo (#8).',
    '✔ Ascensor y escalera juntos en las 4 plantas, como en el vestíbulo (A§14.1-14.2).',
    '✔ La Catacumba tiene techo bajo porque está medio nivel por debajo del Office, no porque sea un sótano.',
    '✔ La Pajarera es «pecera dentro de la Pecera»: su pared izquierda es de cristal hacia la Redacción.',
    '✔ Cada salida usa la misma placa: número de planta + destino + flecha (en vez de 5 estilos).',
  ];
  notas.forEach((n, i) => T(n, 20, H - 106 + i * 19, '#b8ffb0', 13));
  return c;
}
