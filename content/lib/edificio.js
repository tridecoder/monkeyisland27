// EL EDIFICIO (contrato del rediseño, docs/GUIA_REDISENO.md). ARCHIVO COMPARTIDO: datos, sin dibujo.
// Fuente única de: plantas, nombre visible de cada sala en placas y rótulos, anchos de sala, el NÚCLEO vertical
// (ascensor + escalera, mismo aspecto y misma posición relativa en las 4 plantas) y las zonas de la Pecera (D2).
// Lo leen content/lib/kit.js (placas, núcleo) y las herramientas (tools/sala.mjs, la auditoría de geometría).
// Si un dato de aquí no cuadra con tu sala, NO lo cambies: dilo en tu informe (lo cambia el responsable del motor).

/** Planta de cada sala. La Redacción de papel (`catacumba`) está en la planta 1, AL LADO de la Redacción web (`pecera`),
 *  al mismo nivel: se pasa por una puerta doble en la pared de la Redacción (orden de dirección 2; anula la D6). */
export const PLANTA_DE = {
  cpd: -1, vestibulo: 0, pecera: 1, office: 1, catacumba: 1, pajarera: 1, sala_amazonas: 1,
  ecosistema: 2, eventos: 2, administracion: 2,
};

/** Ancho final de cada sala (px). Ecosistema: 320 → 400 (D3) → 432 (aire entre placas); Redacción: 1270 (vestíbulo de planta). */
export const ANCHO = {
  vestibulo: 320, pecera: 1270, office: 320, catacumba: 320, pajarera: 320, sala_amazonas: 320,
  ecosistema: 432, eventos: 512, administracion: 320, cpd: 320,
};

/** NOMBRE VISIBLE de cada sala en placas, rótulos, botonera y frases (orden de dirección): el apodo puede ir debajo
 *  o en boca de los personajes, pero la placa lleva SIEMPRE el nombre llano. «Pajarera» NO se enseña nunca: es
 *  «Despachos» (antes «Dirección»: la sala es la antesala de los despachos que lleva a la Sala de Reuniones; la reunión
 *  sigue siendo la «Reunión de Dirección»). `placa` ≤ 12 caracteres (fuente del juego); `sub` = segunda línea en
 *  microfuente 3×5 (≤ 19). */
export const SALA = {
  vestibulo: { placa: 'VESTÍBULO', sub: null, depto: null, apodo: null },
  pecera: { placa: 'REDACCIÓN', sub: 'REDACCIÓN WEB', depto: 'redaccion', apodo: 'la Pecera' },
  office: { placa: 'VENDING', sub: null, depto: 'office', apodo: null },          // «Vending» (orden 1; id interno `office`)
  catacumba: { placa: 'REDACCIÓN', sub: 'DE PAPEL · CIERRE', depto: 'papel', apodo: 'la Catacumba' },
  pajarera: { placa: 'DESPACHOS', sub: null, depto: 'direccion', apodo: null },        // «Pajarera»: solo id interno
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
// x0-x1 en px de sala (ancho total 1270). `depto` = clave de DEPTO del kit (color de suelo, filete y rótulo colgado).
// El VESTÍBULO DE PLANTA (hall, 96-344) es el reparto: cada acceso en su propio hueco, con pared lisa a los dos lados
// (≥ 24 px entre huecos), UNA placa por acceso a la misma altura (y 14) y un tótem-directorio junto al núcleo.
export const PECERA_ZONAS = [
  { id: 'nucleo', x0: 0, x1: 96, depto: null, rotulo: null, pared: '#3a3e4a', suelo: 'terrazo' },
  { id: 'hall', x0: 96, x1: 344, depto: null, rotulo: null, pared: '#4c5260', suelo: 'linoleo' },
  // la bisagra entre las dos redacciones (órdenes 2 y 3): la Secretaría de Redacción (Custodia) y la puerta doble a la
  // Redacción de papel, con el umbral de latón como frontera
  { id: 'papel', x0: 344, x1: 580, depto: 'papel', rotulo: null, pared: '#5a3e26', suelo: 'parque' },
  { id: 'web', x0: 580, x1: 720, depto: 'web', rotulo: 'WEB', pared: '#2c6a66', suelo: 'moqueta' },
  { id: 'economia', x0: 720, x1: 796, depto: 'economia', rotulo: 'ECONOMÍA', pared: '#3a5a6c', suelo: 'moqueta' },
  { id: 'infografia', x0: 796, x1: 890, depto: 'infografia', rotulo: 'INFOGRAFÍA', pared: '#7a6448', suelo: 'moqueta' },
  { id: 'desarrollo', x0: 890, x1: 1150, depto: 'desarrollo', rotulo: 'DESARROLLO', pared: '#3e3656', suelo: 'moqueta' },
  { id: 'diseno', x0: 1150, x1: 1270, depto: 'diseno', rotulo: 'DISEÑO Y PRODUCTO', pared: '#c8c8c0', suelo: 'moqueta' },
];
/** Desplazamiento de las zonas de Web a Desarrollo: su arte está escrito en las coordenadas de la sala de 800 px (Web
 *  empezaba en 170) y se pinta corrido PECERA_DESPLAZ. Diseño y Producto va además PECERA_DESPLAZ_DISENO px más allá
 *  (Desarrollo creció 60 px para su rincón del «comité de igualdad»). */
export const PECERA_DESPLAZ = 410;
export const PECERA_DESPLAZ_DISENO = 470;
/** Accesos de la Redacción (hueco, sin marco; el marco del kit va por fuera). [x, ancho] */
export const PECERA_PUERTAS = { pecera_a_pajarera: [168, 56], pecera_a_office: [260, 56], pecera_a_catacumba: [490, 60] };
/** La Secretaría de Redacción (Custodia): el ventanuco con persiana, en su propio hueco de la zona de papel. */
export const PECERA_SECRETARIA = { x: 370, y: 40, w: 36, h: 18 };
/** El tótem-directorio de la planta, junto al núcleo. */
export const PECERA_DIRECTORIO = { x: 100, w: 48 };

// ------------------------------------------------------------------ ECOSISTEMA (D3): 432 px (Comercial ganó 32 px de pared)
export const ECOSISTEMA_ZONAS = [
  { id: 'nucleo', x0: 0, x1: 96, depto: null },
  { id: 'marketing', x0: 96, x1: 190, depto: 'marketing', rotulo: 'MARKETING' },
  { id: 'puerta_eventos', x0: 190, x1: 242, depto: 'eventos', rotulo: null },
  { id: 'comercial', x0: 242, x1: 384, depto: 'comercial', rotulo: 'COMERCIAL' },
  { id: 'pasillo', x0: 384, x1: 432, depto: 'administracion', rotulo: null },
];

/** Salas rediseñadas: las herramientas aplican las reglas estrictas (≥ 12×10, solapes ≤ 30 %, rótulos enteros…) a las
 *  salas cuyo arte declara `rediseno: true` (art file). Esta lista solo documenta el reparto en paquetes. */
export const PAQUETES = {
  P1: ['vestibulo', 'cpd'],
  P2: ['pecera', 'pajarera'],
  P3: ['office', 'catacumba', 'administracion'],
  P4: ['sala_amazonas', 'ecosistema', 'eventos'],
};
