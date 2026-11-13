// EL EDIFICIO (contrato del rediseño, docs/GUIA_REDISENO.md). ARCHIVO COMPARTIDO: datos, sin dibujo.
// Fuente única de: plantas, nombre visible de cada sala en placas y rótulos, anchos de sala, el NÚCLEO vertical
// (ascensor + escalera, mismo aspecto y misma posición relativa en las 4 plantas) y las zonas de la Pecera (D2).
// Lo leen content/lib/kit.js (placas, núcleo) y las herramientas (tools/sala.mjs, la auditoría de geometría).
// Si un dato de aquí no cuadra con tu sala, NO lo cambies: dilo en tu informe (lo cambia el responsable del motor).

/** Planta de cada sala. La Catacumba está en la planta 1, MEDIO NIVEL por debajo del Office (D6). */
export const PLANTA_DE = {
  cpd: -1, vestibulo: 0, pecera: 1, office: 1, catacumba: 1, pajarera: 1, sala_amazonas: 1,
  ecosistema: 2, eventos: 2, administracion: 2,
};

/** Ancho final de cada sala (px). Ecosistema pasa de 320 a 400 (D3). */
export const ANCHO = {
  vestibulo: 320, pecera: 800, office: 320, catacumba: 320, pajarera: 320, sala_amazonas: 320,
  ecosistema: 400, eventos: 512, administracion: 320, cpd: 320,
};

/** NOMBRE VISIBLE de cada sala en placas, rótulos, botonera y frases (orden de dirección): el apodo puede ir debajo
 *  o en boca de los personajes, pero la placa lleva SIEMPRE el nombre llano. «Pajarera» NO se enseña nunca: es
 *  «Dirección». `placa` ≤ 12 caracteres (fuente del juego); `sub` = segunda línea en microfuente 3×5 (≤ 18). */
export const SALA = {
  vestibulo: { placa: 'VESTÍBULO', sub: null, depto: null, apodo: null },
  pecera: { placa: 'REDACCIÓN', sub: 'LA PECERA', depto: 'redaccion', apodo: 'la Pecera' },
  office: { placa: 'OFFICE', sub: null, depto: 'office', apodo: null },
  catacumba: { placa: 'CIERRE', sub: 'REDACCIÓN DE PAPEL', depto: 'papel', apodo: 'la Catacumba' },
  pajarera: { placa: 'DIRECCIÓN', sub: null, depto: 'direccion', apodo: null },        // «Pajarera»: solo id interno
  sala_amazonas: { placa: 'AMAZONAS', sub: 'SALA DE REUNIONES', depto: 'direccion', apodo: null },
  ecosistema: { placa: 'MARKETING', sub: 'Y COMERCIAL', depto: 'marketing', apodo: 'el Ecosistema' },
  eventos: { placa: 'EVENTOS', sub: 'SALA POLIVALENTE', depto: 'eventos', apodo: null },
  administracion: { placa: 'ADMINISTRACIÓN', sub: null, depto: 'administracion', apodo: 'la Ventanilla' },
  cpd: { placa: 'SISTEMAS', sub: 'CPD', depto: 'sistemas', apodo: null },
};

// ------------------------------------------------------------------ NÚCLEO vertical (D1)
// Banda de 96 px en el extremo de la sala: a la IZQUIERDA (x 0-96) en P−1 (cpd), P1 (pecera) y P2 (ecosistema); a la
// DERECHA (x 224-320) en P0 (vestibulo: detrás de los tornos). Medidas desde la pared exterior (el borde de la sala):
//   escalera  4 … 46   (42 px; si sube y baja: tramo que sube arriba, tramo que baja abajo)
//   ascensor 54 … 84   (puertas de 30 × 54 sobre la línea de suelo; indicador encima; botonera 88-93, hacia dentro)
// `FL` es la línea de suelo de la sala (pared/suelo). Todo lo demás lo calcula nucleoGeom().
export const NUCLEO = {
  ancho: 96,
  escalera: { x: 4, w: 42, h: 64 },
  ascensor: { x: 54, w: 30, h: 54, botonera: 88 },
  salas: {
    cpd: { lado: 'izq', sube: false, baja: false, cerrada: true },      // P−1: solo ascensor; la caja de escalera, cerrada
    vestibulo: { lado: 'der', sube: true, baja: false },                 // P0: escalera que SUBE a la Redacción
    pecera: { lado: 'izq', sube: true, baja: true },                     // P1: sube a P2, baja a P0
    ecosistema: { lado: 'izq', sube: false, baja: true },                // P2: baja a P1
  },
  // salida de escalera de cada sala con núcleo: id del hotspot → dirección
  escaleras: {
    vestibulo: { vestibulo_a_redaccion: 'sube' },
    pecera: { pecera_a_ecosistema: 'sube', pecera_a_vestibulo: 'baja' },
    ecosistema: { ecosistema_a_pecera: 'baja' },
  },
  ascensores: { cpd: 'ascensor_cpd', vestibulo: 'ascensor_vestibulo', pecera: 'ascensor_pecera', ecosistema: 'ascensor_ecosistema' },
};

/** Geometría del núcleo de una sala: rects de hotspot [x, y, w, h], walkTo y entradas. FL = línea de suelo. */
export function nucleoGeom(room, FL, width = ANCHO[room] || 320) {
  const N = NUCLEO.salas[room];
  if (!N) return null;
  const der = N.lado === 'der';
  const X = (dx, w) => (der ? width - dx - w : dx);          // de «medida desde la pared exterior» a x de sala
  const E = NUCLEO.escalera, A = NUCLEO.ascensor;
  const band = der ? [width - NUCLEO.ancho, width] : [0, NUCLEO.ancho];
  const asc = { x: X(A.x, A.w), y: FL - A.h, w: A.w, h: A.h };
  const out = {
    lado: N.lado, band, FL,
    ascensor: { puertas: asc, rect: [asc.x - 4, FL - A.h - 12, A.w + 12, A.h + 12], walkTo: [asc.x + (A.w >> 1), FL + 14], face: 'up', entrada: [asc.x + (A.w >> 1), FL + 16, 'down'], botonera: X(A.botonera, 6) },
    escaleras: {},
  };
  const ex = X(E.x, E.w);
  const tramos = N.sube && N.baja ? [['sube', FL - E.h, 30], ['baja', FL - 32, 32]] : N.sube ? [['sube', FL - E.h, E.h]] : N.baja ? [['baja', FL - E.h, E.h]] : [];
  for (const [dir, y, h] of tramos) {
    out.escaleras[dir] = { rect: [ex, y, E.w, h], walkTo: [ex + (E.w >> 1), FL + 14], face: der ? 'right' : 'left', entrada: [ex + (E.w >> 1) + (der ? -6 : 6), FL + 18, der ? 'left' : 'right'] };
  }
  if (N.cerrada) out.cerrada = { rect: [ex, FL - E.h, E.w, E.h] };
  return out;
}

// ------------------------------------------------------------------ PECERA (D2): zonas de izquierda a derecha
// x0-x1 en px de sala (ancho total 800). `depto` = clave de DEPTO del kit (color de suelo, filete y rótulo colgado).
export const PECERA_ZONAS = [
  { id: 'nucleo', x0: 0, x1: 96, depto: null, rotulo: null, pared: '#3a3e4a', suelo: 'terrazo' },
  { id: 'pasillo_direccion', x0: 96, x1: 170, depto: 'direccion', rotulo: null, pared: '#4a3020', suelo: 'linoleo' },
  { id: 'web', x0: 170, x1: 310, depto: 'web', rotulo: 'WEB', pared: '#2c6a66', suelo: 'moqueta' },
  { id: 'economia', x0: 310, x1: 386, depto: 'economia', rotulo: 'ECONOMÍA', pared: '#3a5a6c', suelo: 'moqueta' },
  { id: 'infografia', x0: 386, x1: 480, depto: 'infografia', rotulo: 'INFOGRAFÍA', pared: '#7a6448', suelo: 'moqueta' },
  { id: 'desarrollo', x0: 480, x1: 680, depto: 'desarrollo', rotulo: 'DESARROLLO', pared: '#3e3656', suelo: 'moqueta' },
  { id: 'diseno', x0: 680, x1: 800, depto: 'diseno', rotulo: 'DISEÑO Y PROD.', pared: '#c8c8c0', suelo: 'moqueta' },
];
/** Puertas del pasillo de Dirección (hueco de puerta, sin marco; el marco del kit va por fuera). */
export const PECERA_PUERTAS = { pecera_a_pajarera: [100, 30], pecera_a_office: [136, 30] };   // [x, ancho]

// ------------------------------------------------------------------ ECOSISTEMA (D3): 400 px
export const ECOSISTEMA_ZONAS = [
  { id: 'nucleo', x0: 0, x1: 96, depto: null },
  { id: 'marketing', x0: 96, x1: 190, depto: 'marketing', rotulo: 'MARKETING' },
  { id: 'puerta_eventos', x0: 190, x1: 242, depto: 'eventos', rotulo: null },
  { id: 'comercial', x0: 242, x1: 352, depto: 'comercial', rotulo: 'COMERCIAL' },
  { id: 'pasillo', x0: 352, x1: 400, depto: 'administracion', rotulo: null },
];

/** Salas rediseñadas: las herramientas aplican las reglas estrictas (≥ 12×10, solapes ≤ 30 %, rótulos enteros…) a las
 *  salas cuyo arte declara `rediseno: true` (art file). Esta lista solo documenta el reparto en paquetes. */
export const PAQUETES = {
  P1: ['vestibulo', 'cpd'],
  P2: ['pecera', 'pajarera'],
  P3: ['office', 'catacumba', 'administracion'],
  P4: ['sala_amazonas', 'ecosistema', 'eventos'],
};
