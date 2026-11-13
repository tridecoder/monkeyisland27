// SALA `pecera` (la Redacción) — ARTE Y GEOMETRÍA. Paquete P2 del rediseño (docs/GUIA_REDISENO.md §3, §6, §10-§12).
// 1260×144, planta 1, FL = 94. Zonas de izquierda a derecha (content/lib/edificio.js PECERA_ZONAS), cada una con las
// cuatro capas: suelo propio con canto de goma, pared con filete de su color, pilastra en el cambio y rótulo colgado.
//   NÚCLEO 0-96 ............ kit.nucleo: escalera que SUBE a P2 (arriba), que BAJA a P0 (abajo) y ascensor «1»
//   VESTÍBULO DE PLANTA .... 96-344 (el reparto, orden del director «sin aire»): el tótem-directorio (100-148) y dos
//                            huecos con pared lisa a los lados y UNA placa cada uno a la misma altura (y 16):
//                            DESPACHOS (168-224): frente de CRISTAL por el que se ven el sofá blanco, la pared de pósits
//                            y, al fondo, la puerta de la Sala de Reuniones; VENDING (260-316): ARCO ABIERTO por el que
//                            se ven el azulejo, el resplandor de la máquina de vending y la silueta de Gertrudis.
//                            En el suelo, una franja guía y un felpudo de color que lleva a cada hueco.
//   PAPEL (bisagra) ........ 344-580: la Secretaría de Redacción en su propio hueco (ventanuco 370-406, cajonera, timbre,
//                            placa «SECRETARÍA», el cartel a la derecha, sitio para Bruno al lado) y la PUERTA DOBLE a la
//                            Redacción de papel (490-550) con el umbral de latón y aire a los dos lados
//   WEB .................... 580-720 · ECONOMÍA 720-796 · INFOGRAFÍA 796-890 · (cinta en 890)
//   DESARROLLO ............. 890-1140: kanban EXENTO, calendario, semáforo, pantalla de Anselmo, el coro de espaldas, la
//                            taza «NO» y, en los 50 px nuevos, el rincón del «comité de igualdad»: el diploma «EQUIPO
//                            100 % CONCIENCIADO», el logo morado del 8 de marzo y el buzón «COMPAÑERAS» con telarañas
//   DISEÑO Y PRODUCTO ...... 1140-1260: ventanal (Rubén, Acto III; amanecer en el epílogo), bandeja ENTREGAS, Valentín
// De Web a Desarrollo, el dibujo y los objetos están escritos en las coordenadas de la sala de 800 px y se pintan con
// un desplazamiento de PECERA_DESPLAZ = 410 px (`desplazado`, `D`); Diseño y Producto, PECERA_DESPLAZ_DISENO = 460 (`D2`).
// El layout suma lo mismo (`mover`).
// Tres planos: fondo (pared), plano medio (kanban exento, silla de Ramírez: `layer: 'sorted'` + walkbox con muescas) y
// primer plano (`foreground`: ficus del vestíbulo de planta y canto de una mesa de Desarrollo, por debajo de los torsos).
// Estados (se dibujan por el ESTADO del objeto o por el flag que la lógica pone ANTES de la línea que lo comenta):
// pantalla_metricas / enchufe_pantalla (cms_vivo), ordenador_bruno + silla_ramirez (silla_libre), chaqueta (when),
// kanban (posit_descopeado), frontera_carrocero (acto_2_iniciado / acto_3_iniciado / infografia_integrada),
// semaforo_ruido (estado rojo/ambar/verde), bandeja_diseno (bandeja_diseno_abierta), pantalla_anselmo
// (ruben_encontrado / infografia_integrada), ventana (estado `amanecer`, que pone el epílogo), buzon_companeras
// (acto_3_iniciado: la telaraña tiene ya una araña con acreditación).
import {
  PAL, rect, hline, vline, frameRect, px, line, poly, ellipse, paint, bevel, ditherOverlay, gradV,
  glow, lightCone, shadowEllipse, ditherPick, hash2, rng, fadeRows, vignette, fluorescent, cityWindow, wallClock,
  deskLamp, framed, monitor, papers, mug, shade, mix, label, bayer, plant, extinguisher,
} from '../../../engine/draw.js';
import { postit, POSTIT, lcd, JACKETS, chairBack, jacketOn, deskFront, blinds, rainOnGlass, rainyGlassStatic, cable, personBack } from './lib-oficina.js';
import * as kit from '../../lib/kit.js';
import { nucleoGeom, PECERA_ZONAS, PECERA_PUERTAS, PECERA_DESPLAZ, PECERA_DESPLAZ_DISENO, PECERA_DIRECTORIO, ANCHO } from '../../lib/edificio.js';
import { hatchFrame, secretaria, drawCustodia, SECRETARIA_RECTS, HATCH, CARTEL_LADO } from './lib-secretaria.js';

const W = ANCHO.pecera;              // 1270
const D = PECERA_DESPLAZ;            // 410: lo que se corren las zonas de Web a Desarrollo (arte en coordenadas de 800 px)
const D2 = PECERA_DESPLAZ_DISENO;    // 470: Diseño y Producto (Desarrollo creció 60 px)
const SDX = 370 - HATCH.x;           // la Secretaría, dibujada en coordenadas del antiguo Office: ventanuco en x 370
/** pinta `fn` corrido D px a la derecha (dibujo escrito en las coordenadas de la sala de 800 px) */
const desplazado = (fn, dx = D) => (g, ...a) => { g.save(); g.translate(dx, 0); try { return fn(g, ...a); } finally { g.restore(); } };
const FL = 94;                       // línea pared/suelo (obligatoria en las salas con núcleo, §3)
const DT = 80;                       // tapa de las mesas pegadas a la pared
const VPX = W >> 1, VPY = -150;         // fuga del suelo: juntas y cantos suaves que se abren desde el centro de la sala
const N = nucleoGeom('pecera', FL);
const { micro } = kit;
const INK = kit.INK;

/** x en la línea de suelo de un punto (x, y) del suelo, y su inversa */
const aSuelo = (x, y) => VPX + (x - VPX) * (FL - VPY) / (y - VPY);
const deSuelo = (xb, y) => VPX + (xb - VPX) * (y - VPY) / (FL - VPY);
const zonaEn = (xb) => PECERA_ZONAS.find(z => xb < z.x1) || PECERA_ZONAS[PECERA_ZONAS.length - 1];
const Z = Object.fromEntries(PECERA_ZONAS.map(z => [z.id, z]));
const libre = (v) => !!v.flag('silla_libre');

// ================================================================== SUELOS (una pasada: cada píxel sabe en qué zona cae)
const RAMPA = {
  nucleo: ['#34363e', '#42444e', '#50525c', '#5e606a'],
  hall: ['#4a4c54', '#56585f', '#62646b', '#6e7077'],                              // linóleo claro del vestíbulo de planta
  // moquetas (de oscuro a claro): cada zona se distingue por color Y por tamaño de loseta
  web: { r: ['#28323e', '#303c4a', '#3a4858', '#465668'], loseta: 14 },             // azul pizarra
  economia: { r: ['#1c2a4c', '#243462', '#2e4078', '#3a4e8c'], loseta: 10 },        // azul
  infografia: { r: ['#3a3024', '#4a3e2c', '#5a4c36', '#6a5a40'], loseta: 12 },      // cálida
  desarrollo: { r: ['#28223e', '#322a4e', '#3c335e', '#463c70'], loseta: 16 },      // violeta
  diseno: { r: ['#5a5a62', '#6a6a72', '#7a7a82', '#8a8a92'], loseta: 20 },          // gris perla
  papel: { r: ['#3a2616', '#4a321c', '#5a3e24', '#6a4a2c'], loseta: 5 },             // parqué viejo de tablilla (Redacción de papel)
};
function suelos(g) {
  paint(g, 0, FL, W, 144 - FL, (x, y) => {
    const xb = aSuelo(x, y), z = zonaEn(xb), t = (y - FL) / 50, n = hash2(x, y, 4);
    if (z.id === 'nucleo') {              // terrazo: base gris con chinas claras y oscuras
      if (n < 0.05) return '#7a7c86';
      if (n > 0.965) return '#26282e';
      return ditherPick(x, y, RAMPA.nucleo, 0.2 + t * 0.6);
    }
    if (z.id === 'hall') {                 // linóleo claro y liso, con brillo de pasillo
      const brillo = Math.abs(y - 112) < 3 ? 0.14 : 0;
      return ditherPick(x, y, RAMPA.hall, 0.3 + t * 0.45 + brillo + (n < 0.03 ? -0.2 : 0));
    }
    // moqueta en losetas: cada zona con la rampa de su departamento y la loseta girada al tresbolillo
    const M = RAMPA[z.id] || { r: kit.DEPTO[z.depto].suelo, loseta: 12 };
    const lx = Math.floor((xb - z.x0) / M.loseta), ly = Math.floor(Math.log(y - VPY) * 260 / M.loseta);
    const tile = ((lx + ly) & 1) ? 0.12 : -0.05;
    return ditherPick(x, y, M.r, 0.22 + t * 0.6 + tile + (n < 0.05 ? -0.18 : 0));
  });
  // cantos de goma entre zonas (líneas de fuga claras); en 480 manda la cinta (objeto)
  for (const z of PECERA_ZONAS) {
    if (z.x0 === 0 || z.x0 === Z.desarrollo.x0) continue;
    const xe = Math.round(deSuelo(z.x0, 144));
    line(g, z.x0, FL, xe, 144, '#c4c8d4'); line(g, z.x0 + 1, FL, xe + 1, 144, '#4a4e5c');
  }
  guiasSuelo(g);
  // marquetería de latón en el terrazo del núcleo, ante el ascensor: «P1» (se sabe en qué planta se está al llegar)
  ellipse(g, 60, 126, 13, 5, '#5e606a'); ellipse(g, 60, 126, 12, 4, (xx, yy, d) => (d > 0.78 ? '#c8a050' : '#4a4c56'));
  micro(g, 'P1', 60, 124, '#e0c070', { align: 'center' });
  // sombra de contacto de la pared
  ditherOverlay(g, 0, FL, W, 3, PAL.ink[0], 0.55);
  fadeRows(g, 0, FL + 3, W, 6, PAL.ink[0], 0.28, 0, 3);
  // migas, pelusas y algún cable
  const r = rng(77);
  for (let i = 0; i < 30; i++) {
    const x = 100 + Math.floor(r() * (W - 110)), y = 108 + Math.floor(r() * 34);
    ditherOverlay(g, x, y, 2 + Math.floor(r() * 4), 1, PAL.ink[0], 0.3);
  }
}

// ================================================================== PAREDES, TECHO, PILASTRAS, RÓTULOS
function pared(g, x0, x1, c, o = {}) {
  const r = [shade(c, -0.22), shade(c, -0.08), c, shade(c, 0.1)];
  paint(g, x0, 15, x1 - x0, FL - 15, (x, y) => ditherPick(x, y, r, 0.9 - (y - 15) / 95 + (hash2(x >> 1, y >> 1, 11) < 0.05 ? -0.15 : 0)));
  // zócalo alto (friso más oscuro bajo el filete) y rodapié
  ditherOverlay(g, x0, 69, x1 - x0, FL - 73, shade(c, -0.5), 0.22);
  rect(g, x0, FL - 4, x1 - x0, 4, shade(c, -0.48)); hline(g, x0, FL - 4, x1 - x0, shade(c, 0.05));
  if (o.depto) kit.filete(g, x0, x1, 66, o.depto);
}
function techo(g) {
  gradV(g, 0, 0, W, 15, [PAL.ink[0], PAL.ink[1], PAL.metal[1]]);
  for (let x = 0; x < W; x += 24) vline(g, x, 0, 14, PAL.ink[0]);
  hline(g, 0, 7, W, PAL.ink[0]); hline(g, 0, 14, W, PAL.ink[1]);
  // fluorescentes por zona (coordenadas de 800 px: Diseño y Producto, desde 680, va con D2)
  const dx = (x) => x + (x >= 680 ? D2 : D);
  for (const x of [190, 250, 326, 412, 500, 560, 620, 700, 760]) fluorescent(g, dx(x), 10, 30, true);
  // en la zona de papel, dos lámparas de campana de las de antes (la luz de la Redacción de papel asoma hasta aquí)
  for (const x of [388, 520]) { vline(g, x, 0, 9, PAL.metal[2]); poly(g, [[x - 5, 13], [x + 5, 13], [x + 3, 9], [x - 3, 9]], PAL.green[3]); hline(g, x - 5, 13, 11, PAL.green[5]); hline(g, x - 3, 14, 7, '#fff2c0'); glow(g, x, 26, 18, 14, '#ffd890', 0.18, 3); }
  // rejillas del aire, rociadores y la bandeja de cables de Desarrollo (con cables que cuelgan)
  for (const x of [222, 362, 456, 668, 742]) { rect(g, dx(x), 2, 12, 5, PAL.metal[2]); for (let k = 0; k < 12; k += 2) vline(g, dx(x) + k, 3, 3, PAL.ink[1]); }
  for (const x of [280, 470, 540, 720]) { px(g, dx(x), 13, PAL.metal[5]); px(g, dx(x) - 1, 14, PAL.red[3]); px(g, dx(x) + 1, 14, PAL.red[3]); }
  rect(g, 486 + D, 4, 240, 2, PAL.metal[3]); hline(g, 486 + D, 6, 240, PAL.ink[0]);
  cable(g, 520 + D, 6, 548 + D, 6, 4, '#3a2a5a', 10); cable(g, 600 + D, 6, 640 + D, 6, 6, PAL.ink[0], 12); cable(g, 650 + D, 6, 672 + D, 6, 3, '#5a2a2a', 8);
}
function pilastras(g) {
  for (const z of PECERA_ZONAS) if (z.x0 > 0) kit.pilastra(g, z.x0 - 3, 15, FL);
}
function rotulos(g) {
  for (const z of PECERA_ZONAS) {
    if (!z.rotulo) continue;
    const claro = z.id === 'diseno';           // sobre la pared blanca, el rótulo de Diseño va en tinta
    kit.rotuloZona(g, (z.x0 + z.x1) / 2, 15, z.depto, { texto: z.rotulo, colgado: 15, ...(claro ? { fondo: '#2a2c36', color: '#f6f6f2' } : {}) });
  }
}

// ================================================================== NÚCLEO (kit) y VESTÍBULO DE PLANTA (el reparto)
const PLACA_Y = 16;                  // TODAS las placas del reparto, a la misma altura (una por acceso, nunca apiladas)
const HUECO_Y = 40;                  // dintel común de los huecos (Despachos, Vending, puerta doble)
const HALL = { x0: 96, x1: 344 };
function nucleo(g) {
  kit.nucleo(g, 'pecera', FL, { sinSuelo: true });
  // extintor al pie de la escalera (decorado, sin canto vivo)
  extinguisher(g, 92, 92);
}
/** Franja guía y felpudos de color: cada acceso tiene su «alfombra» que baja hasta la franja del vestíbulo (y ≈ 117). */
function guiasSuelo(g) {
  const yA = FL + 7, yB = 117;
  // la franja: una banda de linóleo más oscuro con filete claro a lo largo del reparto, del núcleo a la Redacción de papel
  for (let y = yB - 3; y <= yB + 3; y++) {
    const xa = Math.round(deSuelo(HALL.x0 + 4, y)), xb = Math.round(deSuelo(Z.papel.x1 - 30, y));
    ditherOverlay(g, xa, y, xb - xa, 1, '#2a2c36', y === yB - 3 || y === yB + 3 ? 0 : 0.35);
  }
  line(g, Math.round(deSuelo(HALL.x0 + 4, yB - 4)), yB - 4, Math.round(deSuelo(Z.papel.x1 - 30, yB - 4)), yB - 4, '#8a8c96');
  line(g, Math.round(deSuelo(HALL.x0 + 4, yB + 4)), yB + 4, Math.round(deSuelo(Z.papel.x1 - 30, yB + 4)), yB + 4, '#24262e');
  // de cada acceso, una lengua del color de su destino hasta la franja
  const lenguas = [
    [PECERA_PUERTAS.pecera_a_pajarera, kit.DEPTO.direccion.c],
    [PECERA_PUERTAS.pecera_a_office, kit.DEPTO.office.c],
    [[HATCH.x + SDX, HATCH.w], kit.DEPTO.papel.c],
    [PECERA_PUERTAS.pecera_a_catacumba, PAL.gold[4]],
  ];
  for (const [[x, w], c] of lenguas) {
    const a = x + 8, b = x + w - 8;
    const q = [[a, yA], [b, yA], [Math.round(deSuelo(b, yB - 5)), yB - 5], [Math.round(deSuelo(a, yB - 5)), yB - 5]];
    poly(g, q, (xx, yy) => ditherPick(xx, yy, [shade(c, -0.5), shade(c, -0.36)], 0.35 + ((xx + yy) & 1) * 0.2));
    line(g, q[0][0], yA, q[3][0], yB - 5, shade(c, -0.05)); line(g, q[1][0], yA, q[2][0], yB - 5, shade(c, -0.05));
    const m = (a + b) / 2;                                                       // el filete central, como una flecha
    for (let yy = yA + 2; yy < yB - 6; yy += 3) px(g, Math.round(deSuelo(m, yy)), yy, shade(c, 0.1));
  }
}
/** Pared lisa del vestíbulo de planta: yeso gris azulado, zócalo de piedra clara, junquillo a la altura del filete. */
function paredHall(g) {
  const { x0, x1 } = HALL;
  const c = Z.hall.pared, r = [shade(c, -0.2), shade(c, -0.06), c, shade(c, 0.1)];
  paint(g, x0, 15, x1 - x0, FL - 15, (x, y) => ditherPick(x, y, r, 0.85 - (y - 15) / 100 + (hash2(x >> 1, y >> 1, 21) < 0.04 ? -0.12 : 0)));
  hline(g, x0, 66, x1 - x0, '#8a90a0'); hline(g, x0, 67, x1 - x0, '#363a46');
  rect(g, x0, FL - 5, x1 - x0, 5, '#7a7c84'); hline(g, x0, FL - 5, x1 - x0, '#a8aab2'); hline(g, x0, FL - 1, x1 - x0, '#3a3c44');
  // un foco por hueco: el charco de luz en la pared ayuda a leer cada acceso
  for (const cx of [124, 196, 288]) {
    rect(g, cx - 3, 13, 7, 2, PAL.metal[4]); hline(g, cx - 2, 15, 5, '#fff2c0');
    lightCone(g, cx, 16, 4, 22, 20, '#fff0d0', 0.1);
  }
}
/** Placa común sobre el dintel, centrada en el hueco. */
function placaHueco(g, cx, room, o = {}) {
  const w = kit.placaSalaW(room, o);
  vline(g, Math.round(cx - w / 2) + 4, 14, 2, PAL.metal[3]); vline(g, Math.round(cx + w / 2) - 5, 14, 2, PAL.metal[3]);
  kit.placaSala(g, Math.round(cx - w / 2), PLACA_Y, room, o);
}
/** DESPACHOS: frente de cristal de suelo a techo con su puerta de cristal; dentro se VE la antesala de los despachos
 *  (sofá blanco, pared de pósits, lámpara cálida) y, al fondo, la puerta de la Sala de Reuniones con su pilotito. */
function huecoDespachos(g) {
  const [x, w] = PECERA_PUERTAS.pecera_a_pajarera, y = HUECO_Y, h = FL - y;
  kit.marcoPuerta(g, x, y, w, h, { ramp: [PAL.ink[1], '#3a3428', '#4a4232', '#5a5040', '#8a7a58', '#a89464', '#c8b078'] });
  // dentro: nogal cálido, al fondo el pasillo con la puerta de la Sala de Reuniones
  paint(g, x, y, w, h, (xx, yy) => ditherPick(xx, yy, ['#3a2416', '#4a3020', '#5a3c28', '#6a4830'], 0.45 + ((xx * 5 + (yy >> 2)) % 13) / 40 - (yy - y) / 160));
  glow(g, x + w / 2, y + 12, w * 0.6, 14, '#ffe0a0', 0.18, 3);
  rect(g, x, y + h - 12, w, 12, '#3a2a1e'); for (let k = 0; k < w; k += 6) vline(g, x + k, y + h - 12, 12, '#2e2016');   // parqué
  // pared de pósits (la matriz de Íñigo, en pequeño) a la izquierda
  rect(g, x + 4, y + 6, 22, 16, PAL.paper[6]); frameRect(g, x + 4, y + 6, 22, 16, PAL.metal[3]);
  for (let i = 0; i < 8; i++) rect(g, x + 6 + (i % 4) * 5, y + 8 + (i >> 2) * 6, 4, 4, [POSTIT.p, POSTIT.y, POSTIT.b, POSTIT.g][(i * 3) % 4]);
  // al fondo a la derecha: la puerta de la Sala de Reuniones (verde «libre» encendido) y su placa en pequeño
  rect(g, x + w - 18, y + 14, 13, h - 26, '#1e140c'); frameRect(g, x + w - 19, y + 13, 15, h - 24, PAL.gold[3]);
  rect(g, x + w - 16, y + 9, 9, 3, INK); hline(g, x + w - 15, y + 10, 7, '#c8c4d8'); px(g, x + w - 8, y + 18, '#4ae86a');
  // el sofá blanco y una lámpara de pie
  rect(g, x + 6, y + h - 20, 26, 9, '#e8e4dc'); rect(g, x + 6, y + h - 24, 26, 5, '#f6f2ea'); rect(g, x + 4, y + h - 22, 3, 11, '#d8d4cc'); rect(g, x + 31, y + h - 22, 3, 11, '#d8d4cc');
  hline(g, x + 6, y + h - 11, 26, '#9a9488');
  vline(g, x + 38, y + 12, h - 24, PAL.gold[3]); poly(g, [[x + 35, y + 12], [x + 41, y + 12], [x + 40, y + 8], [x + 36, y + 8]], '#fff0c0');
  glow(g, x + 38, y + 18, 18, 14, '#ffd890', 0.35, 3);
  // el cristal: reflejos, montantes, junta y persiana a media altura «desde 2015» (solo una franja arriba)
  blinds(g, x, y + 1, w, 6, { down: 5, color: PAL.paper });
  g.save(); g.globalAlpha = 0.16; poly(g, [[x + 2, y + h], [x + 10, y + h], [x + 30, y], [x + 22, y]], '#ffffff'); poly(g, [[x + 34, y + h], [x + 38, y + h], [x + 52, y + 12], [x + 48, y + 12]], '#ffffff'); g.restore();
  g.save(); g.globalAlpha = 0.1; rect(g, x, y, w, h, '#bfe4ff'); g.restore();                   // el tinte del cristal
  g.save(); g.globalAlpha = 0.35; rect(g, x, y + 27, w, 3, '#f4f8ff'); g.restore();               // banda esmerilada a la altura de los ojos
  vline(g, x + (w >> 1), y, h, '#c8b078'); vline(g, x + (w >> 1) + 1, y, h, '#5a5040');            // junta de las dos hojas
  rect(g, x + (w >> 1) - 4, y + 22, 2, 14, PAL.gold[5]); rect(g, x + (w >> 1) + 3, y + 22, 2, 14, PAL.gold[5]);   // tiradores
  kit.umbral(g, x - 2, FL + 1, w + 4, 6, kit.DEPTO.direccion.c);
  kit.cantoVivo(g, x - 3, y - 3, w + 6, h + 3);
  placaHueco(g, x + w / 2, 'pajarera', { sub: 'SALA DE REUNIONES >' });
}
/** VENDING: arco abierto, sin puerta: se ven el azulejo, la máquina de vending con su resplandor y la silueta de
 *  Gertrudis con su LCD verde. Nadie necesita leer la placa. */
function huecoVending(g) {
  const [x, w] = PECERA_PUERTAS.pecera_a_office, y = HUECO_Y, h = FL - y;
  // jamba y arco de piedra clara
  const r = 10;
  rect(g, x - 4, y + r - 2, 4, h - r + 2, '#9a9ca4'); rect(g, x + w, y + r - 2, 4, h - r + 2, '#7a7c84');
  vline(g, x - 4, y + r - 2, h - r + 2, '#c8cad2'); vline(g, x + w + 3, y + r - 2, h - r + 2, '#5a5c64');
  const archY = (xx) => { const d = Math.abs(xx - (x + w / 2)) - (w / 2 - r); return d <= 0 ? y : y + r - Math.sqrt(Math.max(0, r * r - d * d)); };
  for (let xx = x - 4; xx < x + w + 4; xx++) { const ya = Math.round(archY(Math.min(x + w - 1, Math.max(x, xx)))); vline(g, xx, ya - 4, 4, xx < x + w / 2 ? '#a4a6ae' : '#84868e'); px(g, xx, ya - 4, '#c8cad2'); }
  // el interior: azulejo crema en cuadrícula, con el friso amarillo del Vending
  paint(g, x, y, w, h, (xx, yy) => {
    if (yy < archY(xx)) return null;
    const jx = (xx - x) % 5 === 0, jy = (yy - y) % 5 === 0;
    if (yy > y + h - 12) return ((xx >> 2) + (yy >> 1)) & 1 ? '#8a7a5a' : '#6a5c44';            // suelo de baldosa
    return jx || jy ? '#b8b090' : ditherPick(xx, yy, ['#d8d0b0', '#e8e0c0', '#f4ecd0'], 0.6 - (yy - y) / 120);
  });
  hline(g, x, y + 24, w, kit.DEPTO.office.c); hline(g, x, y + 25, w, shade(kit.DEPTO.office.c, -0.3));
  // la máquina de vending, a la izquierda: frente iluminado con filas de productos
  const mx = x + 5, my = y + 10, mw = 18, mh = h - 12;
  rect(g, mx - 1, my - 1, mw + 2, mh + 1, '#14121a'); rect(g, mx, my, mw, mh, '#2a2838');
  rect(g, mx + 2, my + 3, 11, mh - 12, '#dff4ff');
  for (let k = 0; k < 5; k++) for (let i = 0; i < 3; i++) rect(g, mx + 3 + i * 4, my + 4 + k * 5, 3, 3, [PAL.red[4], PAL.gold[5], PAL.teal[4], PAL.blue[4], PAL.leaf[5]][(k + i) % 5]);
  rect(g, mx + 14, my + 4, 3, 10, '#4a4858'); for (let k = 0; k < 4; k++) hline(g, mx + 14, my + 5 + k * 2, 3, '#8a8898');
  rect(g, mx + 2, my + mh - 7, 11, 4, '#0c0a12');
  glow(g, mx + 8, my + 18, 22, 22, '#bfe8ff', 0.45, 3);
  // Gertrudis, a la derecha: silueta cromada en contraluz, con su LCD verde
  const gx = x + w - 22, gy = y + 20, gw = 17, gh = h - 22;
  rect(g, gx, gy, gw, gh, '#3a3c46'); vline(g, gx, gy, gh, '#8a8c98'); vline(g, gx + 1, gy, gh, '#5a5c68'); hline(g, gx, gy, gw, '#9a9ca8');
  rect(g, gx + 3, gy + 4, 11, 4, '#06140a'); for (let i = 0; i < 5; i++) rect(g, gx + 4 + i * 2, gy + 5, 1, 2, '#39ff14');
  glow(g, gx + 8, gy + 6, 14, 8, '#39ff14', 0.3, 3);
  rect(g, gx + 4, gy + 14, 9, 4, '#14121a'); rect(g, gx + 2, gy + gh - 4, 13, 3, '#24262e');
  // la luz del Vending se derrama al vestíbulo
  glow(g, x + w / 2, FL + 6, 34, 8, '#fff0b0', 0.22, 3);
  kit.umbral(g, x - 2, FL + 1, w + 4, 6, kit.DEPTO.office.c);
  kit.cantoVivo(g, x - 4, y - 4, w + 8, h + 4);
  placaHueco(g, x + w / 2, 'office');
}
function vestibuloPlanta(g) {
  paredHall(g);
  huecoDespachos(g);
  huecoVending(g);
}

// ================================================================== WEB
function web(g) {
  // soporte de la pantalla gigante (el panel lo pinta el objeto) y la etiqueta en su bisel inferior
  rect(g, 222, 64, 8, 4, PAL.metal[2]);
  // enchufe en el zócalo: regleta de pared, el cable lo pinta el objeto
  rect(g, 186, 88, 18, 5, PAL.paper[5]); frameRect(g, 186, 88, 18, 5, PAL.paper[2]);
  // sillas con chaqueta: dos puestos vacíos con la pantalla encendida (se fueron a las 18:30)
  deskFront(g, 218, DT, 36, 18, { drawers: false });
  lcd(g, 220, DT - 15, 15, 13, { kind: 'article', seed: 3 });
  lcd(g, 237, DT - 15, 15, 13, { kind: 'dash', seed: 5 });
  mug(g, 236, DT + 2, { color: PAL.teal });
  chairBack(g, 227, 104, { jacket: JACKETS.navy });
  chairBack(g, 245, 105, { jacket: JACKETS.olive, turn: 1 });
  // mesa de la guardia (los dos figurantes, objeto)
  deskFront(g, 254, DT, 30, 18, { drawers: false });
  lcd(g, 255, DT - 15, 14, 13, { kind: 'chart', seed: 9 });
  lcd(g, 270, DT - 15, 13, 13, { kind: 'article', seed: 11 });
  // mesa de Yoli: tres monitores, colirio y el pósit de la keyword del día
  deskFront(g, 285, DT, 22, 18, { drawers: 'right', top: [PAL.paper[4], PAL.paper[5], PAL.paper[6]] });
  for (let i = 0; i < 3; i++) { const mx = 285 + i * 7; rect(g, mx, DT - 12, 7, 9, PAL.ink[1]); rect(g, mx + 1, DT - 11, 5, 6, [PAL.blue[4], PAL.crt[3], PAL.red[4]][i]); hline(g, mx + 1, DT - 9, 4, PAL.paper[6]); }
  rect(g, 295, DT - 3, 2, 3, PAL.metal[3]);
  postit(g, 286, DT - 21, POSTIT.p, { w: 11, h: 8, lines: false }); micro(g, 'KW', 288, DT - 19, PAL.ink[2]);
  rect(g, 302, DT - 4, 2, 4, PAL.blue[5]); px(g, 302, DT - 5, PAL.paper[7]);                                    // colirio
  glow(g, 296, DT - 8, 14, 10, '#8ecfff', 0.14, 3);
  // reloj de pared (siempre las 20:59) y la lista impresa de las más leídas, con chinchetas
  wallClock(g, 296, 36, 6);
  ditherOverlay(g, 287, 48, 18, 16, PAL.shadow, 0.4);
  rect(g, 286, 47, 18, 16, PAL.paper[7]); frameRect(g, 286, 47, 18, 16, PAL.paper[3]);
  micro(g, 'TOP', 295, 48, PAL.red[3], { align: 'center' });
  for (let i = 0; i < 3; i++) { px(g, 288, 55 + i * 3, PAL.ink[2]); hline(g, 290, 55 + i * 3, 12 - i * 3, PAL.metal[3]); }
  px(g, 287, 47, PAL.red[4]); px(g, 302, 47, PAL.blue[5]);
}

// ================================================================== ECONOMÍA
function economia(g) {
  // corcho de Bolsa con recortes legibles
  const cx = 314, cy = 34;
  rect(g, cx - 1, cy - 1, 34, 11, PAL.wood[1]); rect(g, cx, cy, 32, 9, PAL.wood[4]); ditherOverlay(g, cx, cy, 32, 9, PAL.wood[2], 0.3);
  rect(g, cx + 2, cy + 1, 17, 7, PAL.paper[6]); micro(g, 'IBEX', cx + 3, cy + 2, PAL.ink[2]);
  rect(g, cx + 21, cy + 1, 9, 7, PAL.paper[7]); line(g, cx + 22, cy + 6, cx + 25, cy + 2, PAL.red[3]); line(g, cx + 25, cy + 2, cx + 29, cy + 5, PAL.red[3]);
  px(g, cx + 9, cy + 1, PAL.red[4]); px(g, cx + 24, cy + 1, PAL.blue[5]);
  // calendario de Ramírez, parado en marzo de 2019
  const kx = 356, ky = 34;
  ditherOverlay(g, kx + 1, ky + 1, 20, 24, PAL.shadow, 0.5);
  rect(g, kx, ky, 20, 24, PAL.paper[7]); rect(g, kx, ky, 20, 7, PAL.red[3]); micro(g, 'MAR', kx + 4, ky + 1, PAL.paper[7]);
  label(g, '19', kx + 4, ky + 7, PAL.ink[2]);
  for (let i = 0; i < 3; i++) hline(g, kx + 2, ky + 19 + i * 2, 16, PAL.paper[4]);
  // mesa de Bruno (sin silla: las marcas de ruedas las pinta el ordenador) y mesa de Ramírez
  deskFront(g, 314, DT, 32, 18, { drawers: 'right' });
  deskFront(g, 348, DT, 32, 18, { drawers: 'left' });
  monitor(g, 352, 61, { on: false, w: 20, h: 15, keyboard: true });
  ditherOverlay(g, 352, 61, 20, 3, PAL.paper[2], 0.5);                                // polvo de 2019
  for (let i = 0; i < 3; i++) { rect(g, 374 - (i & 1), DT - 2 - i * 2, 4, 2, i % 2 ? PAL.paper[5] : PAL.paper[6]); }
  // papelera bajo la mesa de Bruno y regleta con cables
  rect(g, 336, 86, 7, 8, PAL.metal[2]); frameRect(g, 336, 86, 7, 8, PAL.metal[1]); rect(g, 337, 86, 5, 2, PAL.paper[6]);
  rect(g, 344, 92, 10, 2, PAL.paper[5]); px(g, 346, 92, PAL.red[4]);
  // planta de Economía (la riega alguien que no es Ramírez)
  plant(g, 383, 94, { size: 14, seed: 4, leaves: 9, potW: 6, pot: PAL.metal });
  glow(g, 346, 46, 40, 24, '#f0fff8', 0.06, 3);
}

// ================================================================== INFOGRAFÍA
function infografia(g) {
  // póster de quesitos de Leoncio y bocetos de barras
  framed(g, 392, 36, 26, 20, (gg, x, y) => {
    rect(gg, x, y, 26, 20, PAL.paper[7]);
    ellipse(gg, x + 9, y + 10, 7, 7, (xx, yy) => { const a = Math.atan2(yy - (y + 10), xx - (x + 9)); return a < -1 ? kit.DEPTO.infografia.c : a < 1.2 ? PAL.teal[4] : PAL.red[4]; });
    for (let i = 0; i < 3; i++) rect(gg, x + 18, y + 4 + i * 5, 6, 3, [kit.DEPTO.infografia.c, PAL.teal[4], PAL.red[4]][i]);
  }, { ramp: PAL.wood });
  for (const [x, y, c] of [[424, 36, PAL.paper[7]], [438, 39, '#f4e8c8']]) {
    ditherOverlay(g, x + 1, y + 1, 12, 10, PAL.shadow, 0.5); rect(g, x, y, 12, 10, c);
    for (let i = 0; i < 3; i++) rect(g, x + 2 + i * 3, y + 7 - i * 2, 2, 2 + i * 2, [PAL.teal[4], kit.DEPTO.infografia.c, PAL.red[4]][i]);
    px(g, x + 6, y, PAL.red[4]);
  }
  // la mesita de Herminia (el portátil lo pinta el objeto)
  deskFront(g, 444, 82, 34, 15, { top: [PAL.metal[4], PAL.metal[5], PAL.metal[6]], body: [PAL.metal[1], PAL.metal[2], PAL.metal[3]] });
  // dos sillas vacías con chaqueta, de cara a Herminia («mirándola»)
  chairBack(g, 452, 104, { jacket: JACKETS.camel, turn: -1 });
  chairBack(g, 470, 104, { jacket: JACKETS.black, turn: 1 });
  glow(g, 432, 66, 46, 28, '#ffd890', 0.08, 3);
}

// ================================================================== DESARROLLO
function desarrollo(g) {
  // estantería baja de manuales tras las patas del kanban (lomos de colores: ninguna marca)
  rect(g, 496, 70, 92, 22, PAL.metal[1]); hline(g, 496, 70, 92, PAL.metal[3]); hline(g, 496, 80, 92, PAL.metal[2]);
  const r = rng(61);
  for (let x = 498; x < 586; x += 3) { const hh = 6 + Math.floor(r() * 3); rect(g, x, 80 - hh, 2, hh, [PAL.purple[4], PAL.blue[4], PAL.red[3], PAL.gold[3], PAL.teal[4]][Math.floor(r() * 5)]); }
  for (let x = 498; x < 586; x += 4) { const hh = 6 + Math.floor(r() * 3); rect(g, x, 90 - hh, 3, hh, [PAL.metal[4], PAL.purple[3], PAL.paper[4]][Math.floor(r() * 3)]); }
  // el escritorio largo del coro (las espaldas y las manos son el objeto)
  deskFront(g, 602, DT, 76, 18, { drawers: false, top: [PAL.metal[4], PAL.metal[5], PAL.metal[6]], body: [PAL.metal[1], PAL.metal[2], PAL.metal[3]] });
  for (const [mx, s] of [[618, 51], [636, 52], [654, 53]]) lcd(g, mx, DT - 15, 15, 13, { kind: 'code', seed: s });
  mug(g, 634, DT + 2, { color: PAL.paper, logo: PAL.blue[4] }); mug(g, 652, DT + 2, { color: PAL.paper, logo: PAL.blue[4] });
  rect(g, 670, DT - 8, 4, 8, PAL.metal[5]); rect(g, 670, DT - 9, 4, 2, PAL.ink[1]); px(g, 671, DT - 5, PAL.red[4]);   // termo de Anselmo
  // pared: soporte de la pantalla de Anselmo
  rect(g, 659, 52, 4, 6, PAL.metal[2]);
  glow(g, 560, 58, 80, 36, '#9a7ae0', 0.07, 3);
  glow(g, 640, 70, 36, 16, '#b48cff', 0.08, 3);
}

// ================================================================== DISEÑO Y PRODUCTO
function diseno(g) {
  // retícula de 12 columnas sobre la bandeja de entregas
  {
    const x = 688, y = 30, w = 24, h = 16;
    ditherOverlay(g, x + 1, y + 1, w + 1, h + 1, PAL.shadow, 0.3);
    rect(g, x - 1, y - 1, w + 2, h + 2, PAL.ink[1]); rect(g, x, y, w, h, '#fbfbf6');
    for (let c = 0; c < 12; c++) vline(g, x + 1 + c * 2, y + 1, h - 2, '#f6d0d0');
    rect(g, x + 2, y + 2, 12, 3, PAL.ink[1]); rect(g, x + 2, y + 7, 8, 7, PAL.red[4]); rect(g, x + 12, y + 7, 10, 3, PAL.blue[4]); rect(g, x + 12, y + 11, 10, 3, PAL.gold[5]);
  }
  // carta de colores inventada «COLORÍN» (nada de marcas reales), sobre el monitor de Valentín
  const cols = [PAL.ink[1], PAL.red[4], PAL.gold[5], PAL.teal[5], PAL.blue[4], PAL.paper[7]];
  ditherOverlay(g, 725, 31, 32, 16, PAL.shadow, 0.3);
  rect(g, 724, 30, 32, 16, '#fbfbf6'); frameRect(g, 724, 30, 32, 16, PAL.metal[3]);
  cols.forEach((c, i) => { rect(g, 726 + i * 5, 32, 4, 6, c); frameRect(g, 726 + i * 5, 32, 4, 6, PAL.metal[4]); });
  micro(g, 'COLORÍN', 740, 40, PAL.metal[1], { align: 'center' });
  // planta de verdad en maceta blanca, entre la bandeja y la mesa
  plantita(g, 719, 99);
  // la mesa blanca de Valentín, impecable (el monitor y lo de encima, el objeto)
  {
    const x = 722, y = DT, w = 36;
    shadowEllipse(g, x + w / 2, 99, w / 2 + 4, 3, 0.55);
    for (const lx of [x + 1, x + w - 3]) { rect(g, lx, y + 4, 2, 15, PAL.metal[5]); vline(g, lx, y + 4, 15, PAL.metal[7]); }
    rect(g, x + 6, y + 4, w - 12, 2, PAL.metal[4]);
    rect(g, x - 2, y, w + 4, 4, '#f6f6f2'); hline(g, x - 2, y, w + 4, '#ffffff'); hline(g, x - 2, y + 3, w + 4, PAL.metal[4]);
    bevel(g, x + w - 14, y + 6, 11, 12, '#ecece6', '#ffffff', PAL.metal[4]); rect(g, x + w - 11, y + 9, 5, 1, PAL.metal[3]); rect(g, x + w - 11, y + 14, 5, 1, PAL.metal[3]);
  }
  // radiador bajo el ventanal
  rect(g, 764, 78, 32, 10, PAL.paper[5]); for (let i = 0; i < 32; i += 3) vline(g, 764 + i, 78, 10, PAL.paper[3]); hline(g, 764, 78, 32, PAL.paper[7]);
  glow(g, 740, 70, 40, 26, '#ffe6b8', 0.12, 4);
  glow(g, 740, 112, 60, 10, '#fff0d0', 0.07, 4);
}
function plantita(g, x, y) {
  shadowEllipse(g, x, y, 6, 2, 0.6);
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 + (i - 4) * 0.33, len = 10 + (i % 3) * 3;
    for (let s = 0; s < len; s++) px(g, Math.round(x + Math.cos(a) * s), Math.round(y - 9 + Math.sin(a) * s + (s * s) / 60), s > len - 3 ? PAL.leaf[6] : PAL.leaf[3 + (i & 1)]);
  }
  poly(g, [[x - 5, y - 9], [x + 5, y - 9], [x + 4, y], [x - 4, y]], (xx) => (xx < x ? PAL.paper[7] : PAL.paper[5]));
  hline(g, x - 5, y - 9, 10, PAL.white || '#ffffff');
}

/** De Web a Desarrollo, en las coordenadas de la sala de 800 px (se pinta corrido D px); Diseño y Producto, D2. */
function zonasDeRedaccion(g) {
  desplazado((g) => {
    web(g);
    economia(g);
    infografia(g);
    desarrollo(g);
    // charcos de luz de los fluorescentes y de las pantallas
    for (const x of [205, 265, 341, 427, 515, 575, 635]) glow(g, x, 124, 34, 8, '#e8fff0', 0.06, 4);
    glow(g, 226, 104, 50, 6, '#8ec8ff', 0.1, 3);
    glow(g, 412, 106, 30, 6, '#ffd890', 0.12, 3);                    // el flexo de Infografía
    glow(g, 636, 104, 40, 6, '#b48cff', 0.1, 3);                     // las pantallas del coro
    // canaleta de cables en el suelo de Web (pisada mil veces) y papelera de latas en Desarrollo
    poly(g, [[204, 101], [262, 104], [262, 106], [204, 103]], '#20242c'); line(g, 204, 101, 262, 104, '#4a505c');
    rect(g, 597, 92, 6, 7, PAL.metal[3]); frameRect(g, 597, 92, 6, 7, PAL.metal[1]);
    for (let k = 0; k < 2; k++) rect(g, 598 + k * 2, 90 + k, 2, 3, [PAL.red[4], PAL.teal[5]][k]);
  })(g);
  desplazado((g) => {
    diseno(g);
    for (const x of [715, 775]) glow(g, x, 124, 34, 8, '#e8fff0', 0.06, 4);
  }, D2)(g);
  rinconComite(g);
}

// ================================================================== ZONA DE PAPEL: Secretaría + puerta doble a la Redacción de papel
/** La bisagra entre las dos redacciones (órdenes de dirección 2 y 3). Pared de nogal viejo con friso; la Secretaría de
 *  Redacción (Custodia) en su propio hueco, con su placa encima y el cartel al lado; aire; y la puerta doble, abierta, a
 *  la Redacción de papel con el umbral de latón: de un lado moqueta y clic, del otro parqué y tinta. */
function zonaPapel(g) {
  const z = Z.papel;
  // friso de tablas bajo el filete (lo viejo empieza aquí)
  for (let x = z.x0 + 3; x < z.x1; x += 9) vline(g, x, 70, FL - 74, '#3a2614');
  hline(g, z.x0, 69, z.x1 - z.x0, '#8a6440');
  // la Secretaría (dibujo del antiguo Office, + SDX), con el cartel A LA DERECHA del ventanuco
  desplazado((gg) => { hatchFrame(gg, { cartel: CARTEL_LADO }); secretaria(gg); }, SDX)(g);
  const hx = HATCH.x + SDX;
  glow(g, hx + HATCH.w / 2, 30, 26, 14, '#ffe8b0', 0.12, 3);
  {
    const sub = 'DE REDACCIÓN', w = kit.placaW('SECRETARÍA', { sinPlanta: true, sub });
    const px0 = Math.round(hx + HATCH.w / 2 - w / 2);
    vline(g, px0 + 4, 14, 2, PAL.metal[3]); vline(g, px0 + w - 5, 14, 2, PAL.metal[3]);
    kit.placa(g, px0, PLACA_Y, 'SECRETARÍA', { sinPlanta: true, sub, depto: 'papel' });
  }
  // la PUERTA DOBLE (abierta de par en par) a la Redacción de papel
  const [x, w] = PECERA_PUERTAS.pecera_a_catacumba, y = HUECO_Y, h = FL - y;
  kit.marcoPuerta(g, x, y, w, h, { ramp: PAL.wood });
  // dentro: la Redacción de papel (pared de nicotina, galeradas colgadas, una lámpara de banquero y el reloj parado)
  gradV(g, x, y, w, h, ['#2c2016', '#45321f', '#5f4829']);
  paint(g, x, y + h - 14, w, 14, (xx, yy) => ditherPick(xx, yy, ['#3a2818', '#4a3420', '#5a4028'], (yy - (y + h - 14)) / 14 + (((xx + yy * 3) >> 2) & 1) * 0.1));
  hline(g, x, y + 3, w, PAL.paper[2]);
  for (let k = 0; k < 7; k++) { const gx = x + 4 + k * 8; vline(g, gx + 2, y + 3, 2, PAL.paper[3]); rect(g, gx, y + 5, 5, 12 + (k % 3) * 2, PAL.paper[5 + (k & 1)]); for (let l = y + 7; l < y + 15 + (k % 3) * 2; l += 2) hline(g, gx + 1, l, 3, PAL.paper[2]); }
  wallClock(g, x + w - 10, y + 24, 5, 20 + 59 / 60);
  rect(g, x + 10, y + 36, 30, 3, PAL.wood[4]); rect(g, x + 12, y + 39, 2, 10, PAL.wood[2]); rect(g, x + 36, y + 39, 2, 10, PAL.wood[2]);   // una mesa
  rect(g, x + 22, y + 30, 6, 3, PAL.green[3]); vline(g, x + 25, y + 33, 3, PAL.gold[4]); hline(g, x + 22, y + 30, 6, PAL.green[5]);       // lámpara de banquero
  glow(g, x + 25, y + 34, 18, 10, '#ffd890', 0.35, 3);
  // las dos hojas, abiertas contra el marco (madera vieja con su ventanuco)
  for (const [lx, d] of [[x, 1], [x + w - 6, -1]]) {
    rect(g, lx, y, 6, h, PAL.wood[3]); vline(g, lx + (d > 0 ? 0 : 5), y, h, PAL.wood[5]); vline(g, lx + (d > 0 ? 5 : 0), y, h, PAL.wood[1]);
    rect(g, lx + 1, y + 8, 4, 12, '#c8a870'); frameRect(g, lx + 1, y + 8, 4, 12, PAL.wood[1]);
  }
  ditherOverlay(g, x, y + h - 5, w, 5, PAL.ink[0], 0.3);
  // la frontera: umbral de latón con su chevrón, del color del destino
  kit.umbral(g, x - 4, FL + 1, w + 8, 7, kit.DEPTO.papel.c, { chevron: true });
  line(g, x - 6, FL + 9, x + w + 6, FL + 9, PAL.gold[5]); line(g, x - 7, FL + 10, x + w + 7, FL + 10, PAL.gold[2]);
  kit.cantoVivo(g, x - 3, y - 3, w + 6, h + 3);
  // la placa del kit sobre el dintel: «1 REDACCIÓN / DE PAPEL · CIERRE» (nombre llano, orden de dirección)
  placaHueco(g, x + w / 2, 'catacumba');
}

// ================================================================== FONDO
function drawRoom(g) {
  techo(g);
  for (const z of PECERA_ZONAS) if (z.id !== 'nucleo' && z.id !== 'hall') pared(g, z.x0, z.x1, z.pared, { depto: z.depto });
  suelos(g);
  nucleo(g);
  vestibuloPlanta(g);
  zonaPapel(g);
  zonasDeRedaccion(g);
  pilastras(g);
  rotulos(g);
  glow(g, 520, 106, 30, 6, '#ffc870', 0.16, 3);                    // la luz ámbar de la Redacción de papel, en el umbral
  vignette(g, W, 144, 0.32);
}

/** Primer plano (cacheado): ficus del pasillo y el canto de una mesa de Desarrollo. Nunca por encima de y 118. */
function drawFrente(g) {
  // gran ficus en maceta en el vestíbulo de planta, junto a la pilastra de la zona de papel (entre huecos, nunca delante
  // de uno), recortado por el borde inferior (silueta oscura con luz de borde)
  const x = 336, y = 144;
  const r = rng(8);
  for (let i = 0; i < 22; i++) {
    const a = -Math.PI / 2 + (r() - 0.5) * 2.2, len = 14 + r() * 16;
    for (let s2 = 4; s2 < len; s2++) {
      const lx = Math.round(x + Math.cos(a) * s2), ly = Math.round(y - 14 + Math.sin(a) * s2 + s2 * s2 / 50);
      if (ly < 116 || ly > 140) continue;
      const hoja = s2 > len - 6;
      px(g, lx, ly, hoja ? '#163420' : '#0c1c12'); px(g, lx + 1, ly, hoja ? '#0f2618' : '#08140c');
      if (hoja && s2 === Math.floor(len - 4)) { ellipse(g, lx, ly, 3, 1.5, '#183a22'); px(g, lx - 1, ly - 1, '#2e6a3a'); }
    }
  }
  poly(g, [[x - 11, y - 14], [x + 11, y - 14], [x + 9, y], [x - 9, y]], (xx) => (xx < x - 4 ? '#2a2c36' : '#16161e'));
  hline(g, x - 11, y - 14, 22, '#4a4c58'); hline(g, x - 10, y - 13, 20, '#20222a');
  // canto de mesa en primer plano (Desarrollo), con un portátil cerrado y cables
  desplazado((g) => {
    poly(g, [[514, 134], [588, 134], [592, 144], [510, 144]], '#16141f');
    hline(g, 514, 134, 74, '#3a364c'); hline(g, 514, 135, 74, '#262234');
    rect(g, 540, 130, 22, 4, '#2a2838'); hline(g, 540, 130, 22, '#4a4660');
    cable(g, 590, 136, 606, 144, 3, '#0c0a14', 10);
  })(g);
}

// ================================================================== OBJETOS CON ESTADO
/** pantalla gigante de métricas: «LECTORES CONCURRENTES 3.418» y la línea roja que baja; con cms_vivo, apagada */
function drawMetricas(g, view, t) {
  const x = 178, y = 31, w = 96, h = 30;
  const off = !!view.flag('cms_vivo');
  rect(g, x - 2, y - 2, w + 4, h + 12, PAL.ink[0]); frameRect(g, x - 2, y - 2, w + 4, h + 12, PAL.metal[2]);
  hline(g, x - 1, y - 1, w + 2, PAL.metal[4]);
  // etiqueta de cinta en el bisel inferior
  rect(g, x + 5, y + h + 1, 87, 7, PAL.paper[4]); hline(g, x + 5, y + h + 1, 87, PAL.paper[6]); hline(g, x + 5, y + h + 7, 87, PAL.paper[2]);
  micro(g, 'PANTALLA DE DIRECCIÓN', x + 48, y + h + 2, PAL.ink[2], { align: 'center' });
  if (off) {
    gradV(g, x, y, w, h, [PAL.ink[1], PAL.ink[0]]);
    g.save(); g.globalAlpha = 0.1; poly(g, [[x + 6, y + h], [x + 22, y + h], [x + 44, y], [x + 28, y]], '#ffffff'); g.restore();
    ditherOverlay(g, x, y, w, h, PAL.metal[2], 0.06);
    px(g, x + w - 3, y + h - 3, PAL.red[3]);
  } else {
    gradV(g, x, y, w, h, [PAL.blue[1], PAL.blue[0]]);
    micro(g, 'LECTORES CONCURRENTES', x + 3, y + 2, PAL.blue[7]);
    hline(g, x + 3, y + 8, w - 6, PAL.blue[3]);
    const n = ['3', '.', '4', '1', String(8 - (Math.floor(t / 1000) % 3 === 0 ? 1 : 0))];
    let nx = x + 4;
    n.forEach(ch => { label(g, ch, nx, y + 6, '#fff4c8'); nx += ch === '.' ? 3 : 7; });
    micro(g, 'EN DIRECTO', x + w - 4, y + 11, PAL.crt[5], { align: 'right' });
    const gx = x + 4, gy = y + 18, gw = w - 8, gh = 10;
    rect(g, gx, gy, gw, gh, PAL.ink[1]);
    for (let yy = gy + 2; yy < gy + gh; yy += 3) for (let xx = gx; xx < gx + gw; xx += 3) px(g, xx, yy, PAL.blue[2]);
    const k = Math.floor(t / 1000);
    let prev = gy + 1;
    for (let i = 0; i < gw; i++) {
      const base = gy + 1 + (i / gw) * (gh - 4);
      const yy = Math.max(gy, Math.min(gy + gh - 1, Math.round(base + (hash2(i + k, 3, 5) - 0.5) * 2.2)));
      px(g, gx + i, yy, '#ff5a48'); if (Math.abs(yy - prev) > 1) vline(g, gx + i, Math.min(yy, prev), Math.abs(yy - prev), '#ff5a48');
      prev = yy;
    }
    if ((Math.floor(t / 500) & 1) === 0) rect(g, x + w - 6, y + 2, 3, 3, '#ff3a30');
    ditherOverlay(g, x, y, w, 2, '#ffffff', 0.08);
    glow(g, x + w / 2, y + h / 2, 70, 30, '#8ec8ff', 0.14, 4);
  }
  kit.cantoVivo(g, x - 2, y - 2, w + 4, h + 12);
}
/** enchufe del zócalo: la cinta «NO / DESENCHUFAR» sujeta el cable a la pared; con cms_vivo, el cable cuelga */
function drawEnchufe(g, view) {
  const pulled = !!view.flag('cms_vivo');
  const sx = 192, sy = 88;                         // la toma, en la regleta del zócalo
  // la toma
  rect(g, sx, sy, 7, 5, PAL.paper[7]); frameRect(g, sx, sy, 7, 5, PAL.paper[3]); px(g, sx + 2, sy + 2, INK); px(g, sx + 4, sy + 2, INK);
  if (!pulled) {
    vline(g, sx + 3, 69, sy - 69, PAL.ink[0]); vline(g, sx + 4, 69, sy - 69, PAL.ink[2]);   // el cable baja por la pared
    rect(g, sx + 1, sy - 1, 5, 5, PAL.ink[2]); rect(g, sx + 2, sy, 3, 2, PAL.metal[4]);      // clavija dentro
    px(g, sx + 6, sy - 3, '#7aff7a');                                                         // piloto verde
  } else {
    vline(g, sx + 3, 69, 8, PAL.ink[0]);
    cable(g, sx + 3, 77, sx + 16, 98, 6, PAL.ink[0], 16);                                       // cuelga y llega al suelo
    rect(g, sx + 14, 97, 5, 4, PAL.ink[2]); px(g, sx + 15, 100, PAL.metal[5]); px(g, sx + 17, 100, PAL.metal[5]);
    px(g, sx + 6, sy - 3, PAL.red[3]);
  }
  // la cinta de carrocero: dos tiras cruzadas sobre el cable, con rotulador
  const tx = 174, ty = 73, tw = 46, th = 14;
  ditherOverlay(g, tx + 1, ty + 1, tw, th, PAL.shadow, 0.4);
  rect(g, tx, ty, tw, th, PAL.paper[4]); hline(g, tx, ty, tw, PAL.paper[6]); hline(g, tx, ty + th - 1, tw, PAL.paper[2]);
  px(g, tx - 1, ty + 2, PAL.paper[4]); px(g, tx + tw, ty + th - 3, PAL.paper[4]);
  if (pulled) line(g, tx + 2, ty + th - 2, tx + tw - 3, ty + 1, PAL.paper[2]);                // la cinta, arrancada en diagonal
  label(g, 'NO', tx + (tw >> 1), ty - 2, PAL.red[3], { align: 'center' });
  micro(g, 'DESENCHUFAR', tx + 2, ty + 8, PAL.red[2]);
  kit.cantoVivo(g, tx, ty, tw, th);
}

/** la guardia de la web: dos de espaldas que teclean */
function drawFigurantes(g, view, t) {
  const spec = [{ cx: 262, hair: PAL.wood[1], shirt: JACKETS.grey, y: 62 }, { cx: 277, hair: PAL.ink[3], shirt: JACKETS.burdeos, y: 63 }];
  spec.forEach((s, i) => {
    chairBack(g, s.cx, 104, { jacket: null, col: [PAL.metal[0], PAL.metal[1], PAL.metal[2], PAL.metal[3], PAL.metal[4]] });
    personBack(g, s.cx, s.y, { hair: s.hair, shirt: s.shirt, hw: 5 });
    const k = Math.floor(t / (110 + i * 40)) % 4;
    rect(g, s.cx - 9 + (k & 1), s.y + 19, 2, 2, PAL.skin[3]); rect(g, s.cx + 7 + ((k >> 1) & 1), s.y + 19, 2, 2, PAL.skin[3]);
  });
  kit.cantoVivo(g, 254, 60, 30, 44);
}

/** ordenador de Bruno: monitor viejo (texto verde; con silla_libre, correo azul), pósit «BRUNO / PELLIZCO» legible
 *  y, sin silla, las marcas de las ruedas de la silla que no tiene */
function drawOrdenadorBruno(g, view, t) {
  const on = libre(view);
  monitor(g, 318, 60, { on: true, screen: on ? 'blue' : 'text', w: 24, h: 16, keyboard: true, t });
  glow(g, 330, 66, 14, 9, on ? '#8ec8ff' : '#7aff9a', 0.14, 3);
  const px0 = 312, py0 = 45;
  ditherOverlay(g, px0 + 1, py0 + 1, 35, 14, PAL.shadow, 0.5);
  rect(g, px0, py0, 35, 14, POSTIT.y); hline(g, px0, py0, 35, '#fff6a0'); hline(g, px0, py0 + 13, 35, '#c8a83a');
  micro(g, 'BRUNO', px0 + 18, py0 + 1, PAL.ink[2], { align: 'center' });
  micro(g, 'PELLIZCO', px0 + 18, py0 + 8, PAL.red[3], { align: 'center' });
  rect(g, px0 + 14, py0 - 1, 7, 2, '#d8cfa0');
  if (!on) for (const [dx, dy] of [[-5, 0], [5, 0], [0, -2], [-3, 3], [3, 3]]) { px(g, 330 + dx, 110 + dy, '#1a2232'); px(g, 331 + dx, 110 + dy, '#24304a'); }
  kit.cantoVivo(g, 312, 45, 36, 47);
}
/** silla de Ramírez, plano medio (pies y 112): junto a su mesa; con silla_libre, arrimada a la mesa de Bruno */
function drawSillaRamirez(g, view) {
  const col = [PAL.metal[1], PAL.metal[2], PAL.metal[3], PAL.metal[4], PAL.metal[5]];
  if (libre(view)) {
    chairBack(g, 332, 112, { col });
    glow(g, 332, 98, 10, 8, '#fff2c0', 0.12, 3);                // la silla nueva, recién estrenada
    kit.cantoVivo(g, 325, 87, 15, 26);
  } else {
    chairBack(g, 364, 112, { col, turn: -1 });
    kit.cantoVivo(g, 357, 87, 15, 26);
  }
}
/** chaqueta beige de entretiempo en el respaldo de la silla de Ramírez, con el sobre de azúcar asomando */
function drawChaqueta(g) {
  const top = 112 - 25 + 1;
  jacketOn(g, 364, top, ['#6a5434', '#8a7046', '#a88c5a', '#c8aa74', '#e4c890'], { w: 15 });
  rect(g, 367, top + 6, 3, 3, PAL.paper[7]); px(g, 368, top + 7, PAL.red[4]);
  hline(g, 357, top - 2, 14, '#fff2c0');
}
/** taza abandonada (8×9) con costra y una mosca */
function drawTaza(g) {
  const x = 370, y = 67;
  ditherOverlay(g, x + 1, y + 9, 9, 2, PAL.ink[0], 0.6);
  rect(g, x, y, 7, 9, PAL.paper[6]); vline(g, x, y, 9, PAL.paper[7]); vline(g, x + 6, y, 9, PAL.paper[3]);
  rect(g, x + 7, y + 2, 2, 4, PAL.paper[4]); px(g, x + 8, y + 3, PAL.ink[1]); px(g, x + 8, y + 4, PAL.ink[1]);
  hline(g, x + 1, y + 1, 5, PAL.wood[1]); px(g, x + 2, y + 2, PAL.wood[2]); px(g, x + 4, y + 3, PAL.wood[2]);
  rect(g, x + 2, y + 5, 3, 2, PAL.red[3]);
  px(g, x + 3, y - 3, PAL.ink[0]); px(g, x + 2, y - 4, PAL.metal[5]); px(g, x + 4, y - 4, PAL.metal[5]);
  kit.cantoVivo(g, x, y, 9, 9);
}

/** mesa de dibujo inclinada con un gráfico a medias y el flexo con su charco de luz cálida */
function drawMesaDibujo(g) {
  const x = 390, y = 64;
  shadowEllipse(g, x + 17, FL + 3, 20, 2, 0.6);
  line(g, x + 4, y + 16, x + 2, FL + 2, PAL.metal[3]); line(g, x + 30, y + 16, x + 32, FL + 2, PAL.metal[2]);
  line(g, x + 4, y + 22, x + 30, y + 22, PAL.metal[2]);
  poly(g, [[x + 2, y + 2], [x + 34, y], [x + 36, y + 14], [x, y + 17]], PAL.paper[7]);
  ditherOverlay(g, x + 2, y + 1, 32, 14, PAL.paper[3], 0.12);
  line(g, x, y + 17, x + 36, y + 14, PAL.wood[2]); line(g, x, y + 18, x + 36, y + 15, PAL.wood[1]);
  for (let i = 0; i < 5; i++) rect(g, x + 6 + i * 5, y + 13 - i * 2 - (i === 3 ? 3 : 0), 3, 2 + i * 2 + (i === 3 ? 3 : 0), [PAL.teal[4], kit.DEPTO.infografia.c, PAL.red[4], kit.DEPTO.infografia.c, PAL.teal[3]][i]);
  line(g, x + 5, y + 4, x + 30, y + 3, PAL.ink[3]);
  rect(g, x + 4, y + 7, 15, 2, '#fffcf4');                                                // la marca limpia de la regla
  const L = deskLamp(g, x + 36, y + 2, { color: [PAL.gold[0], PAL.gold[1], PAL.gold[2], PAL.gold[3], PAL.gold[4], PAL.gold[5]], on: true });
  lightCone(g, L.lx - 4, L.ly, 4, 26, 18, '#fff0c0', 0.25);
  kit.cantoVivo(g, x, y, 37, 18);
}
/** Herminia: portátil de cara con «HERMINIA» entero en la barra de título y las barras que crecen */
function drawHerminia(g, view, t) {
  const sx = 443, sy = 58, sw = 36, sh = 22;
  rect(g, sx, sy, sw, sh, PAL.metal[5]); frameRect(g, sx, sy, sw, sh, PAL.metal[2]);
  rect(g, sx + 1, sy + 1, sw - 2, sh - 3, PAL.ink[1]);
  rect(g, sx + 1, sy + 1, sw - 2, 7, '#ff8c3c'); micro(g, 'HERMINIA', sx + (sw >> 1), sy + 2, PAL.ink[1], { align: 'center' });
  const k = Math.floor(t / 400) % 6;
  for (let i = 0; i < 6; i++) rect(g, sx + 4 + i * 5, sy + sh - 3 - (i <= k ? 2 + i : 1), 3, (i <= k ? 2 + i : 1), i <= k ? '#ff8c3c' : PAL.metal[2]);
  poly(g, [[sx - 1, sy + sh], [sx + sw + 1, sy + sh], [sx + sw + 3, sy + sh + 2], [sx - 3, sy + sh + 2]], PAL.metal[4]);
  glow(g, sx + 18, sy + 11, 18, 11, '#ffb070', 0.12, 3);
  kit.cantoVivo(g, sx, sy, sw, sh + 2);
}
/** cartel de la frontera, a mano, pegado en la pilastra de 480: «SOLO CÓDIGO» entero */
function drawCartelFrontera(g) {
  const x = 458, y = 36, w = 30, h = 15;
  ditherOverlay(g, x + 1, y + 1, w, h, PAL.shadow, 0.5);
  rect(g, x, y, w, h, PAL.paper[7]); frameRect(g, x, y, w, h, PAL.red[3]);
  micro(g, 'SOLO', x + 15, y + 2, PAL.red[3], { align: 'center' }); micro(g, 'CÓDIGO', x + 15, y + 8, PAL.red[3], { align: 'center' });
  rect(g, x - 2, y - 1, 6, 2, '#d8cfa0'); rect(g, x + w - 4, y - 1, 6, 2, '#d8cfa0');
  kit.cantoVivo(g, x, y, w, h);
}
/** LA FRONTERA: cinta de carrocero EN EL SUELO sobre el cambio de moqueta. Acto I recta · Acto II doble (ha avanzado
 *  veinte píxeles hacia Infografía) · Acto III lazo que encierra Infografía · infografia_integrada: solo el pegamento */
function drawFrontera(g, view) {
  const dS = (xb, y) => deSuelo(xb + D, y) - D;          // la fuga del suelo, en las coordenadas de 800 px del dibujo
  const a2 = !!view.flag('acto_2_iniciado'), a3 = !!view.flag('acto_3_iniciado'), inte = !!view.flag('infografia_integrada');
  const tira = (x0, y0, x1, y1) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    const horiz = Math.abs(x1 - x0) > Math.abs(y1 - y0);
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
      const w = horiz ? 2 + Math.round((y - FL) / 40) : 2 + Math.round((y - FL) / 22);
      for (let k = 0; k < w; k++) {
        const c = ((x + y + k) % 5 === 0) ? '#b8a878' : '#eadfb4';
        if (horiz) px(g, x, y + k, c); else px(g, x + k, y, c);
      }
      if (horiz) px(g, x, y + w, '#3a3428'); else px(g, x + w, y, '#3a3428');
    }
  };
  const recta = (xb) => tira(xb, FL + 1, Math.round(dS(xb, 143)), 143);
  if (inte) {                                        // solo queda la marca del pegamento
    for (let y = FL + 2; y < 144; y += 2) { const xx = Math.round(dS(480, y)); ditherOverlay(g, xx, y, 3 + Math.floor((y - FL) / 22), 1, PAL.paper[2], 0.4); }
    return;
  }
  recta(480);
  if (a2 || a3) recta(460);                   // doble: la cinta nueva, 20 px más allá
  if (a3) {                                          // lazo: rodea Infografía por delante hasta la pilastra de 386
    const yl = 128;
    tira(Math.round(dS(460, yl)), yl, Math.round(dS(386, yl)), yl);
    tira(Math.round(dS(386, yl)), yl, 386, FL + 1);
  }
}

/** KANBAN con ruedas, EXENTO en el plano medio (pies y 106), con las cabeceras legibles, el pósit «BAJA / RUBÉN» en
 *  POR HACER (con posit_descopeado: «AQUÍ / RUBÉN» verde) y el pósit amarillísimo de 1998 en HECHO (PERO NO) */
function drawKanban(g, view) {
  const x = 490, y = 34, w = 102, h = 48;
  shadowEllipse(g, x + w / 2, 106, w / 2 + 2, 3, 0.75);
  for (const lx of [x + 6, x + w - 8]) {
    rect(g, lx, y + h, 2, 104 - (y + h), PAL.metal[3]); vline(g, lx, y + h, 104 - (y + h), PAL.metal[5]);
    rect(g, lx - 5, 102, 12, 2, PAL.metal[2]); hline(g, lx - 5, 102, 12, PAL.metal[4]);
    ellipse(g, lx - 4, 105, 1.5, 1.5, PAL.ink[0]); ellipse(g, lx + 6, 105, 1.5, 1.5, PAL.ink[0]);
  }
  rect(g, x + 6, 96, w - 12, 2, PAL.metal[3]);                                  // travesaño
  rect(g, x - 2, y - 2, w + 4, h + 4, PAL.metal[4]); frameRect(g, x - 2, y - 2, w + 4, h + 4, PAL.metal[2]); hline(g, x - 1, y - 1, w + 2, PAL.metal[6]);
  rect(g, x, y, w, h, '#f4f6f8');
  const cols = [['POR', 'HACER', PAL.blue[5]], ['EN', 'CURSO', PAL.gold[5]], ['BLOQ.', '', PAL.red[5]], ['HECHO', '', PAL.leaf[6]], ['HECHO', 'NO', PAL.purple[5]]];
  cols.forEach(([, , c], i) => {
    const cx = x + i * 20 + 1;
    rect(g, cx, y + 1, 19, 12, c); hline(g, cx, y + 1, 19, shade(c, 0.3));
    if (i > 0) vline(g, cx - 1, y + 1, h - 2, PAL.metal[5]);
  });
  // cabeceras en una segunda pasada, alineadas al píxel (5 letras = 19 px: la columna entera)
  cols.forEach(([a, b], i) => {
    const cx = x + i * 20 + 1;
    micro(g, a, cx + Math.floor((19 - kit.microW(a)) / 2), y + 2, INK);
    if (b) micro(g, b, cx + Math.floor((19 - kit.microW(b)) / 2), y + 7, i === 4 ? '#ffffff' : INK);
    if (i === 4) hline(g, cx + 1, y + 4, 18, '#ffffff');            // «HECHO» tachado + «NO»: HECHO (PERO NO)
  });
  const r = rng(27);
  const colores = [POSTIT.y, POSTIT.g, POSTIT.p, POSTIT.b, POSTIT.o];
  for (let i = 0; i < 4; i++) for (let k = 0; k < 3; k++) {
    if (i === 0 && k === 0) continue;
    const px0 = x + i * 20 + 3 + Math.floor(r() * 3), py0 = y + 15 + k * 10 + Math.floor(r() * 2);
    postit(g, px0, py0, colores[(i + k) % 5], { w: 13, h: 8 });
  }
  // «BAJA / RUBÉN» desde julio (Acto III: tras P14, «AQUÍ / RUBÉN», verde)
  const desc = !!view.flag('posit_descopeado');
  rect(g, x + 1, y + 15, 19, 13, desc ? '#a6f08c' : '#f49ab8'); hline(g, x + 1, y + 15, 19, '#ffffff'); hline(g, x + 1, y + 27, 19, desc ? '#5aa048' : '#c0607e');
  micro(g, desc ? 'AQUÍ' : 'BAJA', x + 3, y + 17, INK);
  micro(g, 'RUBÉN', x + 1, y + 22, desc ? INK : PAL.red[2]);
  if (desc) { px(g, x + 18, y + 16, PAL.red[4]); px(g, x + 17, y + 17, PAL.red[4]); }
  // el pósit de 1998, en HECHO (PERO NO): amarillísimo, viejo, con «1998» legible
  const qx = x + 82, qy = y + 15;
  rect(g, qx, qy, 18, 13, '#ffe830'); hline(g, qx, qy, 18, '#fffaa0'); hline(g, qx, qy + 12, 18, '#b8a010');
  micro(g, '1998', qx + 9, qy + 4, INK, { align: 'center' });
  ditherOverlay(g, qx, qy + 9, 18, 3, '#c8b020', 0.5); px(g, qx + 17, qy + 12, PAL.paper[0]);
  // rotulador colgando
  line(g, x + w - 4, y + h, x + w - 6, y + h + 8, PAL.metal[3]); rect(g, x + w - 8, y + h + 8, 2, 5, PAL.blue[4]);
  kit.cantoVivo(g, x - 2, y - 2, w + 4, h + 4);
}

/** calendario de papel de Ferretería Hermanos Tornillo */
function drawCalendario(g) {
  const x = 596, y = 32, w = 34, h = 26;
  ditherOverlay(g, x + 1, y + 1, w, h, PAL.shadow, 0.4);
  rect(g, x, y, w, h, PAL.paper[6]); frameRect(g, x, y, w, h, PAL.paper[3]);
  rect(g, x, y, w, 8, PAL.red[3]); hline(g, x, y, w, PAL.red[5]);
  micro(g, 'TORNILLO', x + (w >> 1), y + 2, PAL.paper[7], { align: 'center' });
  rect(g, x + 3, y + 10, 6, 2, PAL.metal[5]); rect(g, x + 5, y + 12, 2, 6, PAL.metal[4]);                 // el martillo de regalo
  for (let r2 = 0; r2 < 4; r2++) for (let c = 0; c < 6; c++) px(g, x + 12 + c * 3, y + 11 + r2 * 3, c === 5 ? PAL.red[4] : PAL.ink[2]);
  ellipse(g, x + 6, y + 21, 2, 2, PAL.paper[3]);                                                          // fase lunar
  px(g, x + (w >> 1), y - 2, PAL.metal[4]);
  kit.cantoVivo(g, x, y, w, h);
}
/** el coro: tres espaldas con cascos, de cara a sus pantallas; las manos, enfadadas, a la altura del teclado */
function drawCoro(g, view, t) {
  const spec = [{ cx: 626, hair: PAL.wood[2], hood: JACKETS.navy }, { cx: 644, hair: PAL.ink[2], hood: JACKETS.burdeos }, { cx: 662, hair: PAL.wood[1], hood: JACKETS.black }];
  spec.forEach((s, i) => {
    chairBack(g, s.cx, 104, { jacket: null, col: [PAL.purple[0], PAL.purple[1], PAL.purple[2], PAL.purple[3], PAL.purple[4]], turn: i === 1 ? 1 : 0 });
    personBack(g, s.cx, 62, { hair: s.hair, shirt: s.hood, hw: 5, cans: true });
    const ph = t / 160 + i * 1.7;
    for (const side of [-1, 1]) {
      const sw = Math.sin(ph + (side > 0 ? 1.4 : 0));
      const bx = s.cx + side * 8, by = 76;
      const hx = Math.round(bx + side * (2 + sw * 2)), hy = Math.round(by - 3 - Math.abs(Math.cos(ph + side)) * 3);
      line(g, bx, by + 2, hx, hy + 2, s.hood[2], 2);
      ellipse(g, hx, hy, 2.5, 2.5, PAL.skin[3]);
      px(g, hx - 2, hy - 3, PAL.skin[4]); px(g, hx, hy - 4, PAL.skin[4]); px(g, hx + 2, hy - 3, PAL.skin[4]);
    }
  });
  kit.cantoVivo(g, 618, 58, 52, 38);
}
/** semáforo de ruido de Prevención: carcasa vertical con visera; se enciende la lámpara del ESTADO del objeto */
function drawSemaforo(g, view) {
  const x = 632, y = 26, w = 12, h = 30;
  const st = String(view.state || 'rojo');
  const lit = /^[aá]mb/.test(st) ? 1 : st.startsWith('ver') ? 2 : 0;
  rect(g, x + 5, y - 4, 2, 4, PAL.metal[3]);
  rect(g, x, y, w, h, PAL.ink[1]); frameRect(g, x, y, w, h, PAL.metal[3]); vline(g, x + 1, y + 1, h - 2, PAL.metal[2]);
  const cols = [['#ff3a30', '#4a1210'], ['#ffc83a', '#4a3a10'], ['#4ae86a', '#10401c']];
  for (let i = 0; i < 3; i++) {
    const ly = y + 5 + i * 9;
    hline(g, x + 2, ly - 4, 8, PAL.metal[2]);                                           // visera
    ellipse(g, x + 6, ly, 3, 3, i === lit ? cols[i][0] : cols[i][1]);
    if (i === lit) { px(g, x + 5, ly - 1, '#ffffff'); glow(g, x + 6, ly, 12, 10, cols[i][0], 0.4, 4); }
  }
  kit.cantoVivo(g, x, y, w, h);
}
/** la taza «NO» (de la tercera espalda), con el «NO» en rojo de 3×5 */
function drawTazaNo(g) {
  const x = 605, y = 69;
  ditherOverlay(g, x + 1, y + 11, 11, 2, PAL.ink[0], 0.6);
  rect(g, x, y, 10, 11, PAL.paper[7]); vline(g, x, y, 11, '#ffffff'); vline(g, x + 9, y, 11, PAL.paper[3]);
  rect(g, x + 10, y + 3, 2, 5, PAL.paper[5]); px(g, x + 11, y + 4, PAL.ink[1]); px(g, x + 11, y + 6, PAL.ink[1]);
  hline(g, x + 1, y + 1, 8, PAL.wood[1]);
  micro(g, 'NO', x + 5, y + 4, PAL.red[3], { align: 'center' });
  kit.cantoVivo(g, x, y, 12, 11);
}
/** pantalla de Anselmo, en un brazo de pared: DENEGADO / REVOCADO / (integrada) ACCESO OK, siempre entera */
function drawAnselmoScreen(g, view, t) {
  const x = 644, y = 27, w = 36, h = 25;
  const inte = !!view.flag('infografia_integrada'), found = !!view.flag('ruben_encontrado');
  rect(g, x, y, w, h, PAL.metal[1]); frameRect(g, x, y, w, h, PAL.metal[3]); hline(g, x, y, w, PAL.metal[4]);
  const sx = x + 2, sy = y + 2, sw = w - 4, sh = h - 4;
  rect(g, sx, sy, sw, sh, inte ? PAL.crt[0] : found ? '#3a0c0c' : '#1a0a0a');
  const L = inte ? [['HERMINIA', PAL.crt[6]], ['ACCESO', PAL.crt[5]], ['OK', PAL.crt[6]]]
    : found ? [['ACCESO', '#ff5a48'], ['REVOCADO', '#ffb0a0'], ['T-3000', '#ff8a70']]
      : [['ACCESO', '#ff5a48'], ['DENEGADO', '#ffb0a0'], ['HERMINIA', '#ff8a70']];
  L.forEach(([s, c], i) => micro(g, s, sx + (sw >> 1), sy + 1 + i * 7, c, { align: 'center' }));
  if ((Math.floor(t / 500) & 1) === 0) px(g, sx + sw - 2, sy + sh - 2, '#ffffff');
  glow(g, x + w / 2, y + h / 2, 22, 14, inte ? '#4ae86a' : '#ff3a30', 0.1, 3);
  kit.cantoVivo(g, x, y, w, h);
}

/** bandeja de entregas de Diseño y Producto, en la frontera con Desarrollo: mueble blanco con «ENTREGAS» entero y la
 *  torre de tres bandejas llenas; abierta (bandeja_diseno_abierta), la de arriba sacada, el aviso de 2017 asomando y
 *  el sello rojo de Desarrollo a la vista */
function drawBandeja(g, view) {
  const x = 684, y = 60, w = 34, abierta = !!view.flag('bandeja_diseno_abierta');
  shadowEllipse(g, x + w / 2, 99, w / 2 + 2, 2, 0.6);
  // mueble blanco con su rótulo
  rect(g, x, y + 18, w, 20, '#ecece6'); frameRect(g, x, y + 18, w, 20, PAL.metal[3]); hline(g, x + 1, y + 19, w - 2, '#ffffff');
  rect(g, x + 1, y + 23, w - 2, 8, PAL.ink[1]);
  micro(g, 'ENTREGAS', x + (w >> 1), y + 24, '#ffffff', { align: 'center' });
  hline(g, x + 2, y + 34, w - 4, PAL.metal[4]); rect(g, x + 15, y + 33, 4, 1, PAL.metal[3]);
  rect(g, x + 2, y + 38, 2, 1, PAL.metal[3]); rect(g, x + w - 4, y + 38, 2, 1, PAL.metal[3]);
  // la torre de bandejas, llenas y en orden
  for (let i = 0; i < 3; i++) {
    const by = y + 14 - i * 6, dx = (i === 2 && abierta) ? 6 : 0;
    rect(g, x + 5 + dx, by, 24, 4, PAL.metal[4]); hline(g, x + 5 + dx, by, 24, PAL.metal[7]); hline(g, x + 5 + dx, by + 3, 24, PAL.metal[1]);
    for (let k = 0; k < 5; k++) rect(g, x + 6 + dx + k * 5, by - 2, 4, 2, k === 2 ? PAL.paper[7] : PAL.paper[6]);
  }
  rect(g, x + 4, y + 2, 1, 16, PAL.metal[3]); rect(g, x + 29, y + 2, 1, 16, PAL.metal[3]);
  if (abierta) {
    rect(g, x + 14, y - 6, 16, 9, PAL.paper[7]); frameRect(g, x + 14, y - 6, 16, 9, PAL.paper[3]);
    hline(g, x + 16, y - 4, 11, PAL.ink[3]); rect(g, x + 17, y - 1, 9, 3, PAL.red[4]);   // aviso de 2017 + sello «LEÍDO (PERO NO)»
    glow(g, x + 22, y - 2, 10, 7, '#ffffff', 0.25, 3);
  }
  kit.cantoVivo(g, x, y - 4, w, 42);
}

/** el ventanal de Diseño y Producto: noche con lluvia (estado por defecto) o AMANECER (estado `amanecer`, que pone el
 *  epílogo al empezar: cielo cálido, sol rasante y su luz sobre la moqueta) */
function ventana(g, t, amanecer) {
  const x = 762, y = 30, w = 34, h = 40;
  rect(g, x - 3, y - 3, w + 6, h + 6, PAL.metal[4]); frameRect(g, x - 3, y - 3, w + 6, h + 6, PAL.metal[2]); hline(g, x - 2, y - 2, w + 4, PAL.metal[7]);
  cityWindow(g, x, y, w, h, { sky: amanecer ? 'dusk' : 'night', seed: 33, mullions: true });
  if (amanecer) {
    glow(g, x + 22, y + h - 8, 16, 10, '#fff0b0', 0.55, 4);
    ellipse(g, x + 22, y + h - 7, 4, 4, '#fff4c8');
    g.save(); g.globalAlpha = 0.16; poly(g, [[x, y + h + 3], [x + w, y + h + 3], [x + w - 10, 144], [x - 70, 144]], '#ffd8a0'); g.restore();
  } else {
    rainyGlassStatic(g, x, y, w, h, 9);
    rainOnGlass(g, x, y, w, h, t, 8);
  }
  vline(g, x + (w >> 1), y, h, PAL.metal[5]); hline(g, x, y + 16, w, PAL.metal[5]);
  rect(g, x - 4, y + h + 3, w + 8, 2, PAL.paper[6]); hline(g, x - 4, y + h + 3, w + 8, '#ffffff');      // alféizar
  kit.cantoVivo(g, x - 3, y - 3, w + 6, h + 6);
}

/** Puesto de Valentín: monitor grande y fino; en él, la Redacción en miniatura (sus siete franjas de color, la pantalla
 *  de métricas —apagada con cms_vivo— y un Bruno de un píxel que se pasea), teclado alineado, taza en la esquina
 *  superior derecha («ahí no molesta») y flexo cálido. `prop`: la mesa se pinta también en el epílogo. */
function drawMonitorValentin(g, view, t) {
  const mx = 724, my = 48, mw = 32, mh = 22, y = DT;
  rect(g, mx + 14, my + mh, 4, y - my - mh - 1, PAL.metal[6]); rect(g, mx + 10, y - 1, 12, 1, PAL.metal[6]);
  rect(g, mx - 1, my - 1, mw + 2, mh + 2, PAL.ink[1]);
  const sx = mx + 1, sy = my + 1, sw = mw - 2, sh = mh - 2;
  // la Redacción en miniatura: techo, siete franjas de pared, suelo
  rect(g, sx, sy, sw, 2, PAL.ink[2]);
  const franjas = [['#3a3e4a', 4], ['#4a3020', 3], ['#2c6a66', 5], ['#3a5a6c', 3], ['#7a6448', 4], ['#3e3656', 7], ['#c8c8c0', 4]];
  let fx = sx;
  for (const [c, fw] of franjas) { rect(g, fx, sy + 2, fw, 10, c); hline(g, fx, sy + 9, fw, kit.DEPTO.web.c); fx += fw; }
  rect(g, sx, sy + 12, sw, sh - 12, '#2e3446');
  rect(g, sx + 9, sy + 4, 5, 3, view.flag('cms_vivo') ? PAL.ink[1] : PAL.blue[2]); if (!view.flag('cms_vivo')) hline(g, sx + 10, sy + 5, 3, '#ff5a48');
  rect(g, sx + 20, sy + 5, 5, 4, '#f4f6f8');                                                             // el kanban, en pequeño
  rect(g, sx + 2, sy + 6, 2, 6, PAL.metal[4]);                                                           // el ascensor, en pequeño
  const bx = sx + 3 + Math.round(((view.t || t || 0) / 1200) % 22);
  rect(g, bx, sy + 11, 2, 1, PAL.wood[2]); rect(g, bx, sy + 12, 2, 3, PAL.blue[5]); rect(g, bx, sy + 15, 2, 2, PAL.ink[2]);
  rect(g, sx + 26, sy + 10, 1, 1, PAL.skin[4]); rect(g, sx + 26, sy + 11, 1, 5, PAL.ink[2]);           // y Valentín, en pequeño
  ditherOverlay(g, sx, sy, sw, 2, '#ffffff', 0.15);
  glow(g, mx + 16, my + 11, 24, 16, '#c8e8ff', 0.1, 3);
  // teclado alineado al píxel, ratón, taza blanca en la esquina superior derecha, cuaderno cuadriculado
  rect(g, mx + 4, y - 2, 22, 2, '#f2f2ee'); hline(g, mx + 4, y - 1, 22, PAL.metal[4]); rect(g, mx + 28, y - 2, 3, 2, '#f2f2ee');
  rect(g, mx + 31, y - 6, 4, 5, '#ffffff'); hline(g, mx + 31, y - 2, 4, PAL.metal[4]); px(g, mx + 35, y - 4, PAL.metal[5]);
  rect(g, mx - 2, y - 2, 5, 2, PAL.paper[7]); px(g, mx - 1, y - 2, PAL.red[4]);
  // flexo cálido calibrado
  const lx = 718, ly = y;
  rect(g, lx + 1, ly - 2, 6, 2, PAL.metal[3]);
  line(g, lx + 3, ly - 2, lx + 2, ly - 12, PAL.metal[6]); line(g, lx + 2, ly - 12, lx + 6, ly - 17, PAL.metal[6]);
  poly(g, [[lx + 5, ly - 19], [lx + 9, ly - 17], [lx + 8, ly - 14], [lx + 4, ly - 15]], PAL.metal[7]);
  hline(g, lx + 5, ly - 14, 3, '#fff4c8');
  g.save(); g.globalAlpha = 0.12; poly(g, [[lx + 5, ly - 14], [lx + 8, ly - 14], [lx + 12, ly + 1], [lx + 1, ly + 1]], '#ffe6b0'); g.restore();
  if (view.visible !== false) kit.cantoVivo(g, mx - 1, my - 1, mw + 2, mh + 2);
}

// ================================================================== TÓTEM-DIRECTORIO y RINCÓN DEL COMITÉ
/** Tótem-directorio de la planta, de pie junto al núcleo: «PLANTA 1» y lo que hay en ella, cada cosa con el color de su
 *  felpudo. Sin Infografía ni Diseño por separado: la Redacción entera es una línea (regla de la casa). */
const DIRECTORIO = [
  ['DESPACHOS', kit.DEPTO.direccion.c], ['>REUNIONES', kit.DEPTO.direccion.c], ['VENDING', kit.DEPTO.office.c],
  ['SECRETARÍA', kit.DEPTO.papel.c], ['PAPEL', PAL.gold[4]], ['REDACCIÓN', kit.DEPTO.web.c],
];
function drawDirectorio(g) {
  const { x, w } = PECERA_DIRECTORIO, y = 30, h = FL + 4 - y;
  shadowEllipse(g, x + w / 2, FL + 5, w / 2 + 2, 2.5, 0.7);
  rect(g, x + 6, FL - 2, w - 12, 6, '#2a2c34'); hline(g, x + 6, FL - 2, w - 12, '#5a5c66');            // peana
  rect(g, x, y, w, h - 6, '#24262e'); frameRect(g, x, y, w, h - 6, '#6a6e7a'); vline(g, x + 1, y + 1, h - 8, '#8a8e9a');
  // cabecera con la banda de la planta (verde agua, P1)
  rect(g, x + 2, y + 2, w - 4, 11, kit.PLANTA['1'].c); hline(g, x + 2, y + 2, w - 4, kit.PLANTA['1'].l);
  label(g, 'PLANTA 1', x + w / 2, y + 2, INK, { align: 'center' });
  // la lista, en microfuente, con su punto de color
  DIRECTORIO.forEach(([t, c], i) => {
    const ly = y + 16 + i * 6;
    rect(g, x + 3, ly + 1, 3, 3, c);
    micro(g, t, x + 7, ly, '#e8eaf2');
  });
  hline(g, x + 3, y + h - 17, w - 6, '#4a4e5a');
  ellipse(g, x + 6, y + h - 13, 2, 2, '#ff5a48'); micro(g, 'AQUÍ', x + 11, y + h - 15, '#ffb0a0');
  kit.cantoVivo(g, x, y, w, h - 6);
}
/** fondo del rincón (60 px nuevos de Desarrollo): corcho viejo tras el logo morado y un pósit «JUEVES · COMITÉ» */
function rinconComite(g) {
  const x = 1092, y = 50;
  rect(g, x, y, 54, 18, PAL.wood[2]); ditherOverlay(g, x, y, 54, 18, PAL.wood[4], 0.4); frameRect(g, x, y, 54, 18, PAL.wood[1]);
  postit(g, x + 36, y + 3, POSTIT.y, { w: 15, h: 12, lines: false });
  micro(g, 'JUE', x + 38, y + 5, INK); micro(g, 'COM', x + 38, y + 10, PAL.purple[2]);
  glow(g, 1120, 60, 30, 26, '#b48cff', 0.06, 3);
}
/** el diploma que se dieron ellos mismos, en marco dorado: «EQUIPO 100 % CONCIENCIADO», firmado por los cuatro */
function drawDiploma(g) {
  const x = 1093, y = 21, w = 52, h = 26;
  ditherOverlay(g, x + 1, y + 1, w + 1, h + 1, PAL.shadow, 0.5);
  rect(g, x, y, w, h, PAL.gold[3]); frameRect(g, x, y, w, h, PAL.gold[1]); hline(g, x + 1, y + 1, w - 2, PAL.gold[6]);
  rect(g, x + 2, y + 2, w - 4, h - 4, '#f8f0d8');
  micro(g, 'EQUIPO 100 %', x + w / 2, y + 4, PAL.purple[2], { align: 'center' });
  micro(g, 'CONCIENCIADO', x + w / 2, y + 10, PAL.purple[2], { align: 'center' });
  for (let i = 0; i < 4; i++) line(g, x + 4 + i * 9, y + 20, x + 10 + i * 9, y + 19, PAL.ink[3]);    // cuatro firmas
  ellipse(g, x + w - 7, y + h - 6, 3, 3, PAL.red[4]); px(g, x + w - 7, y + h - 6, PAL.gold[5]);           // el sello
  kit.cantoVivo(g, x, y, w, h);
}
/** el logo del periódico impreso en morado el 8 de marzo, con dos chinchetas y el borde ya amarillo */
function drawLogoMorado(g) {
  const x = 1096, y = 49, w = 30, h = 21;
  ditherOverlay(g, x + 1, y + 1, w, h, PAL.shadow, 0.5);
  rect(g, x, y, w, h, '#f2ecd0'); ditherOverlay(g, x, y + h - 4, w, 4, '#d8c890', 0.5); vline(g, x + w - 1, y, h, '#d8cc9c');
  ellipse(g, x + 9, y + 9, 6, 6, '#8a3ac8'); ellipse(g, x + 9, y + 9, 3, 3, '#f2ecd0'); rect(g, x + 4, y + 9, 11, 2, '#8a3ac8');   // la «e» morada
  micro(g, '8M', x + 18, y + 4, '#8a3ac8');
  micro(g, 'HECHO', x + 3, y + 15, PAL.leaf[3]);
  px(g, x + 2, y + 1, PAL.red[4]); px(g, x + w - 3, y + 1, PAL.blue[5]);
  kit.cantoVivo(g, x, y, w, h);
}
/** el buzón de sugerencias «COMPAÑERAS», con candado y telarañas; en el Acto III, con su araña */
function drawBuzon(g, view) {
  const x = 1098, y = 72, w = 46, h = 17;
  const a3 = !!view.flag('acto_3_iniciado');
  rect(g, x + 4, y + h, 2, FL - y - h, PAL.metal[2]); rect(g, x + w - 6, y + h, 2, FL - y - h, PAL.metal[2]);     // patas a la pared
  ditherOverlay(g, x + 1, y + 1, w + 1, h + 1, PAL.shadow, 0.5);
  rect(g, x, y, w, h, '#6a4aa0'); frameRect(g, x, y, w, h, '#3a2860'); hline(g, x + 1, y + 1, w - 2, '#9a7ad0');
  rect(g, x + 10, y + 3, w - 20, 2, INK);                                                                 // la ranura
  rect(g, x + 2, y + 8, w - 4, 7, '#f4f0e4'); micro(g, 'COMPAÑERAS', x + w / 2, y + 9, PAL.purple[2], { align: 'center' });
  rect(g, x + w - 6, y + 3, 3, 3, PAL.gold[4]);                                                           // candado
  // telarañas en las dos esquinas de arriba (y una hebra hasta el diploma)
  for (const [cx, sgn] of [[x, 1], [x + w - 1, -1]]) {
    line(g, cx, y, cx + sgn * 7, y + 5, '#d8d8e0'); line(g, cx + sgn * 3, y, cx + sgn * 2, y + 6, '#b8b8c4'); line(g, cx + sgn * 5, y + 1, cx + sgn * 1, y + 3, '#b8b8c4');
  }
  line(g, x + 20, y, x + 22, 45, '#9a9aa8');
  if (a3) { ellipse(g, x + 22, y - 6, 1.5, 1.5, INK); for (const d of [-2, 2]) { px(g, x + 22 + d, y - 7, INK); px(g, x + 22 + d, y - 5, INK); } }
  kit.cantoVivo(g, x, y, w, h);
}

// ================================================================== GEOMETRÍA
/** [x, y, w, h] + dx */
function mueveR(r, dx) { return [r[0] + dx, r[1], r[2], r[3]]; }
/** Corre `dx` px (D por defecto) un grupo de entradas de layout (y envuelve sus dibujos para que se pinten corridos). */
function mover(L, dx = D) {
  const out = {};
  for (const [k, v] of Object.entries(L)) {
    const o = { ...v };
    if (o.rect) o.rect = mueveR(o.rect, dx);
    if (o.poly) o.poly = o.poly.map(([x, y]) => [x + dx, y]);
    if (o.walkTo) o.walkTo = [o.walkTo[0] + dx, o.walkTo[1]];
    if (o.at) o.at = [o.at[0] + dx, ...o.at.slice(1)];
    if (o.draw) o.draw = desplazado(o.draw, dx);
    if (o.sprites) o.sprites = Object.fromEntries(Object.entries(o.sprites).map(([st, fn]) => [st, desplazado(fn, dx)]));
    if (o.positions) o.positions = Object.fromEntries(Object.entries(o.positions).map(([pk, pv]) => [pk, pv && pv.at ? { ...pv, at: [pv.at[0] + dx, ...pv.at.slice(1)] } : pv]));
    out[k] = o;
  }
  return out;
}
const PD = PECERA_PUERTAS;
const puertaR = ([x, w], y = HUECO_Y) => [x - 3, y - 3, w + 6, FL - y + 3];
const layout = {
  // NÚCLEO (kit; geometría de content/lib/edificio.js nucleoGeom)
  pecera_a_ecosistema: { rect: N.escaleras.sube.rect, walkTo: N.escaleras.sube.walkTo, face: N.escaleras.sube.face },
  pecera_a_vestibulo: { rect: N.escaleras.baja.rect, walkTo: N.escaleras.baja.walkTo, face: N.escaleras.baja.face },
  ascensor_pecera: { rect: N.ascensor.rect, walkTo: N.ascensor.walkTo, face: 'up' },
  // VESTÍBULO DE PLANTA: tótem, Despachos (cristal) y Vending (arco abierto), cada uno en su hueco
  directorio_planta: { rect: [PECERA_DIRECTORIO.x, 30, PECERA_DIRECTORIO.w, FL - 30], walkTo: [124, 110], face: 'up', draw: drawDirectorio },
  pecera_a_pajarera: { rect: puertaR(PD.pecera_a_pajarera), walkTo: [PD.pecera_a_pajarera[0] + 28, 108], face: 'up' },
  pecera_a_office: { rect: puertaR(PD.pecera_a_office), walkTo: [PD.pecera_a_office[0] + 28, 108], face: 'up' },
  // ZONA DE PAPEL: la Secretaría de Redacción (Custodia, orden 3), en su hueco, y la puerta doble a la Redacción de papel
  pecera_a_catacumba: { rect: puertaR(PD.pecera_a_catacumba), walkTo: [PD.pecera_a_catacumba[0] + 30, 108], face: 'up' },
  cartel_material: { rect: [CARTEL_LADO[0] + SDX, CARTEL_LADO[1], 46, 22], walkTo: [CARTEL_LADO[0] + SDX + 23, 108], face: 'up' },
  custodia_precinto: { rect: mueveR(SECRETARIA_RECTS.custodia_precinto, SDX), walkTo: [HATCH.x + SDX + 6, 108], face: 'up', priority: 1, draw: desplazado((g, v, t) => drawCustodia(g, v, t), SDX) },
  timbre_secretaria: { rect: mueveR(SECRETARIA_RECTS.timbre_secretaria, SDX), walkTo: [HATCH.x + SDX + 23, 108], face: 'up', priority: 2 },
  // DESARROLLO, rincón del comité (coordenadas de sala, ya corridas)
  diploma_concienciado: { rect: [1093, 21, 52, 26], walkTo: [1118, 114], face: 'up', draw: drawDiploma },
  logo_morado: { rect: [1096, 49, 30, 21], walkTo: [1112, 114], face: 'up', priority: 1, draw: drawLogoMorado },
  buzon_companeras: { rect: [1098, 71, 46, 19], walkTo: [1122, 114], face: 'up', draw: drawBuzon },
  // DE WEB A DESARROLLO: coordenadas de la sala de 800 px; `mover` les suma D (rects, walkTo, at, poly y el dibujo)
  ...mover({
  // WEB
    pantalla_metricas: { rect: [176, 29, 100, 42], walkTo: [226, 112], face: 'up', draw: drawMetricas },
    enchufe_pantalla: { rect: [174, 72, 46, 22], walkTo: [196, 110], face: 'up', priority: 1, draw: drawEnchufe },
    sillas_con_chaqueta: { rect: [218, 64, 36, 40], walkTo: [236, 112], face: 'up' },
    figurantes_web: { rect: [254, 60, 30, 44], walkTo: [268, 112], face: 'up', draw: drawFigurantes },
    // ECONOMÍA
    ordenador_bruno: { rect: [312, 44, 36, 48], walkTo: [330, 120], face: 'up', draw: drawOrdenadorBruno },
    silla_ramirez: { rect: [322, 98, 60, 16], walkTo: [350, 122], face: 'up', layer: 'sorted', zy: 112, draw: drawSillaRamirez },
    chaqueta_ramirez_hotspot: { rect: [355, 84, 20, 16], walkTo: [362, 122], face: 'up', priority: 2, layer: 'sorted', zy: 113, draw: drawChaqueta },
    taza_abandonada: { rect: [368, 64, 14, 14], walkTo: [378, 120], face: 'up', priority: 1, draw: drawTaza },
    // INFOGRAFÍA
    mesa_dibujo: { rect: [388, 60, 46, 36], walkTo: [404, 118], face: 'up', draw: drawMesaDibujo },
    herminia_portatil: { rect: [442, 56, 38, 28], walkTo: [460, 120], face: 'up', draw: drawHerminia },
    cartel_frontera: { rect: [456, 34, 34, 19], walkTo: [470, 116], face: 'up', draw: drawCartelFrontera },
    // la cinta, en el suelo (debajo de los actores)
    frontera_carrocero: { poly: [[456, 95], [488, 95], [508, 143], [466, 143]], walkTo: [482, 126], face: 'down', layer: 'back', draw: drawFrontera },
    // DESARROLLO
    kanban: { rect: [488, 30, 84, 78], walkTo: [530, 124], face: 'up', layer: 'sorted', zy: 106, prop: true, draw: drawKanban },
    posit_1998: { rect: [572, 47, 20, 15], walkTo: [580, 124], face: 'up', priority: 1 },
    calendario_ferreteria: { rect: [596, 32, 34, 26], walkTo: [612, 112], face: 'up', draw: drawCalendario },
    semaforo_ruido: { rect: [632, 22, 12, 34], walkTo: [638, 112], face: 'up', draw: drawSemaforo },
    pantalla_anselmo: { rect: [644, 27, 36, 25], walkTo: [658, 112], face: 'up', draw: drawAnselmoScreen },
    taza_no: { rect: [604, 68, 13, 14], walkTo: [610, 120], face: 'up', priority: 1, draw: drawTazaNo },
    coro_desarrollo: { rect: [618, 58, 52, 38], walkTo: [644, 116], face: 'up', draw: drawCoro },
    // PNJ (docs/GUIA_REDISENO.md §10): Bruno siempre a un lado, a ≥ 24 px
    yoli_tendencias: { at: [309, 116, 'down'], walkTo: [284, 126], face: 'right' },
    leoncio_quesitos: { at: [434, 114, 'down'], walkTo: [410, 126], face: 'right' },
    nerea_backlog: { at: [598, 114, 'left'], walkTo: [624, 126], face: 'left' },
    anselmo_monolito: { at: [672, 118, 'left'], walkTo: [696, 128], face: 'left' },
    // solo en la escena 7.2 (pecera.escenas.js): presenta bajo la pantalla de métricas, entre Bruno y Yoli
    inigo_sinergia: { at: [246, 122, 'down'] },
  }),
  // DISEÑO Y PRODUCTO: coordenadas de 800 px + D2
  ...mover({
    bandeja_diseno: { rect: [684, 56, 34, 42], walkTo: [700, 112], face: 'up', draw: drawBandeja },
    ventana: { rect: [759, 27, 40, 46], walkTo: [778, 116], face: 'up',
      sprites: { default: (g, view, t) => ventana(g, t, false), amanecer: (g, view, t) => ventana(g, t, true) } },
    monitor_valentin: { rect: [721, 46, 38, 30], walkTo: [740, 114], face: 'up', prop: true, draw: drawMonitorValentin },
    // Valentín, de pie y a cuerpo entero, junto a su mesa mirando su monitor; Rubén (Acto III), en el ventanal
    valentin_reticula: { at: [770, 112, 'left'], walkTo: [746, 126], face: 'right' },
    ruben: { at: [788, 114, 'up'], walkTo: [764, 126], face: 'right' },
  }, D2),
};

export default {
  room: 'pecera',
  width: W,
  rediseno: true,
  scale: { yFar: 100, far: 0.9, yNear: 142, near: 1.04 },
  // suelo con muescas: el kanban exento (pies en 106) y la silla de Ramírez (pies en 112) quedan en el plano medio; la
  // muesca de la silla se mueve con ella (silla_libre)
  walkboxes: [
    { id: 'suelo', poly: [[4, 100], [320 + D, 100], [320 + D, 115], [378 + D, 115], [378 + D, 100], [486 + D, 100], [486 + D, 108], [594 + D, 108], [594 + D, 100], [W - 4, 100], [W - 2, 142], [2, 142]] },
    { id: 'hueco_mesa_bruno', poly: [[319 + D, 100], [351 + D, 100], [351 + D, 116], [319 + D, 116]], when: '!silla_libre' },
    { id: 'hueco_silla_ramirez', poly: [[349 + D, 100], [379 + D, 100], [379 + D, 116], [349 + D, 116]], when: 'silla_libre' },
  ],
  // entradas: se llaman como la sala de la que se viene (§9); Bruno aparece delante de su hueco, mirando a la sala
  entries: {
    vestibulo: N.escaleras.baja.entrada, ecosistema: N.escaleras.sube.entrada, ascensor: N.ascensor.entrada,
    pajarera: [PD.pecera_a_pajarera[0] + 28, 110, 'down'], office: [PD.pecera_a_office[0] + 28, 110, 'down'],
    catacumba: [PD.pecera_a_catacumba[0] + 30, 110, 'down'],
  },
  layout,
  draw: drawRoom,
  foreground: drawFrente,
  animate: desplazado((g, view, t) => {
    lcd(g, 220, DT - 15, 15, 13, { kind: (Math.floor(t / 4000) & 1) ? 'saver' : 'article', seed: 3, t });
    lcd(g, 255, DT - 15, 14, 13, { kind: (Math.floor(t / 3000) & 1) ? 'bars' : 'chart', seed: 9, t });
    // un fluorescente moribundo parpadea sobre Infografía
    if (hash2(Math.floor(t / 120), 5, 2) < 0.1) { rect(g, 412, 10, 30, 4, PAL.metal[3]); g.save(); g.globalAlpha = 0.18; rect(g, 386, 15, 94, 30, PAL.ink[0]); g.restore(); }
  }),
};
void mix; void bayer; void papers; void frameRect; void vline;
