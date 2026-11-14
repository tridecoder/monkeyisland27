// OBJETIVOS, PISTAS DE LA ABUELA Y HORA DEL MÓVIL (plan de comedia §8). ARCHIVO COMPARTIDO (paquete común): no lo
// edita ningún autor de sala; si un texto cambia, se pide al jefe de guion.
//
// Cada objetivo: id · hecho (condición, §8 de CONTENT_SCHEMA) · activo (desde cuándo cuenta) · salas (dónde «toca»;
// '*' = todas) · meta (lo que dice Bruno al mirarse, §8.2) · niveles: 1 y 2 = la abuela; 3 = [abuela, Bruno al colgar]
// · extra (opcional): { si: condición, abuela: 'línea' } que la abuela añade en el nivel 3.
// · previa (opcional): { si: condición, nivel, abuela: 'línea' } que la abuela dice ANTES de la pista de ese nivel.
// El motor (engine/objetivos.js) elige el objetivo y el nivel; content/game.js (`pistas`) dice las líneas.
// Los autores de sala no tienen que tocar nada: cada objetivo se da por hecho con su flag. Si un hito no tiene flag,
// `api.objetivo.marcar('<id>')`.

const M = {      // §8.2: la meta en la voz de Bruno (qué quiere ahora, nunca cómo)
  torno: 'Seis años aquí y el torno no sabe quién soy. Tengo que constar en algo.',
  silla: 'Necesito sentarme. Seis años de pie: tengo rodillas de becario senior.',
  correo: 'Tengo silla. Ya puedo mirar mi ordenador como un adulto.',
  cafe: 'La correctora no habla antes del café. Necesito un café que no sea para mí.',
  cms: 'Arriba no me atiende nadie mientras el CMS no vaya. Y no va.',
  hff: 'Hueco, fuente y firma. Lo pone la ficha. La ficha manda.',
  cierre: 'Lo tengo todo. Solo falta que Teodoro diga «cabe».',
  acto3: 'A las nueve apagan la rotativa. Y alguien teclea en el armario 27.',
  // [integrador] con Rubén ya fuera del armario, la línea del armario 27 se queda vieja (álbum y baja)
  baja: 'A las nueve apagan la rotativa. Y Rubén sigue de alta en un armario.',
  acta: 'Para entrar en la Sala hace falta un acta. Gervasio no ha escrito una nunca.',
  climax: 'Respondo a todos. Es lo único que sé hacer bien.',
};
const faltanD1 = (api) => ['rep_08', 'rep_04', 'rep_11'].filter(f => !api.flag(f)).length > 0;

export const OBJETIVOS = [
  { id: 'torno', hecho: 'torno_abierto', salas: ['vestibulo'], meta: M.torno, niveles: [
    'En el pueblo, el que no sale en la foto no existe. Ponte en la foto.',
    'Si el torno no te conoce, preséntate en ese cuadro de caras.',
    ['Pega tu cara donde salen los jefes. Con algo que pegue.', 'Chicle, tarjeta, organigrama. Y luego el torno.']],
    extra: { si: ['!has:chicle', '!tarjeta_con_chicle'], abuela: 'El del mostrador siempre está mascando algo. Pídeselo.' } },
  { id: 'silla', hecho: 'silla_libre', activo: 'torno_abierto',      // [integrador] desde el torno (antes, entre el torno y la 7.2 Bruno decía la meta final)
    salas: ['pecera', 'pajarera'], meta: M.silla, niveles: [
    '¿Estás de pie? Siéntate, hijo. La silla es del que llega.',
    'Tu abuelo, con chaqueta, mandaba en el bar. Pónsela a alguien que mande.',
    ['El que manda ahí es el que dice a todo que sí.', 'La chaqueta de Ramírez, al Lector Medio.']] },
  { id: 'correo', hecho: 'rep_11', activo: 'silla_libre', salas: ['pecera'], meta: M.correo, niveles: [
    'Ahora que estás sentado, mira lo tuyo. Que nunca lo miras.',
    'En el ordenador tendrás cartas sin abrir. Tu tío tiene el buzón igual.',
    ['Mira tu ordenador, hijo. Con silla ya se ve.', 'Mirar mi ordenador. Sentado.']] },
  { id: 'cafe', hecho: 'gertrudis_saludada', activo: 'inigo_presentado', salas: ['office', 'pecera'], meta: M.cafe, niveles: [
    '¿Has saludado a todo el mundo? A las máquinas también.',
    'La cafetera esa no da café por botones. Lo da por educación.',
    ['Dale las buenas noches a la cafetera. En alto.', '«Buenas noches, Gertrudis». Y lo que pida.']] },
  { id: 'aurora', hecho: 'acto_2_iniciado', activo: 'has:cafe', salas: ['catacumba'], meta: M.cafe, niveles: [
    'Los que corrigen siempre están cansados. Tu abuelo corregía la quiniela.',
    'A la señora del cartel no le hables: dale. Primero el café.',
    ['Dale el café a la que corrige. La del boli rojo.', 'El café, a Aurora.']] },
  { id: 'cms', hecho: 'cms_vivo', activo: 'acto_2_iniciado', salas: ['pecera', 'cpd'], meta: M.cms, niveles: [
    'La tele de tu abuelo no iba si él la miraba. Apágale algo a alguien.',
    'Eso se arregla abajo, donde los cables. Lo pone en un papel.',
    ['Baja a donde los cables y lee el papel de las quejas.', 'Sistemas: el registro y la regleta R-3.']] },
  { id: 'reunion', hecho: 'reunion_terminada', activo: 'acto_2_iniciado', salas: ['pajarera', 'sala_amazonas'], meta: M.hff, niveles: [
    'Las reuniones se acaban cuando alguien pregunta qué hay que hacer.',
    'Por eso tu tío no pregunta nunca. Tú sí. En esa reunión de marzo.',
    ['Pregunta lo que viene después. Verás cómo corren.', 'A Gervasio: «¿y los siguientes pasos?».']] },
  { id: 'hueco', hecho: 'casilla_hueco', activo: 'reunion_terminada', salas: ['sala_amazonas'], meta: M.hff, niveles: [
    'La que se queda sentada es que quiere que le hables.',
    'Si alguien tiene algo apartado desde marzo, ya no es suyo.',
    ['Díselo por escrito, que es como se dicen las cosas.', 'A Maripaz: la página 7, desde marzo.']],
    extra: { si: faltanD1, abuela: 'Y antes apúntate contestaciones, hijo. Cotillea, que es gratis.' } },
  { id: 'nota', hecho: 'nota_gasto_presentada', activo: 'acto_2_iniciado', salas: ['ecosistema', 'administracion'], meta: M.hff, niveles: [
    '¿Has hecho la cuenta de gastos? Hazla mal. Te enseñan una buena.',
    'La de la ventanilla enseña las buenas si le das una mala.',
    ['Presenta una cuenta mal hecha. Con lo que lleves.', 'Nota de gasto a Begoña. Con el azúcar.']] },
  { id: 'papel_fax', hecho: 'fax_con_papel', activo: 'nota_gasto_presentada', salas: ['catacumba'], meta: M.hff, niveles: [
    'Las máquinas viejas, sin papel, no hablan. Dales papel. Y tú cena.',
    'Ese papel que te rechazaron tiene la espalda en blanco.',
    ['Lo que no te sirve a ti le sirve a una máquina.', 'Las copias rechazadas, al fax de Teodoro.']] },
  { id: 'fuente', hecho: 'casilla_fuente', activo: 'fax_con_papel', salas: ['catacumba'], meta: M.hff, niveles: [
    'Lo que me cuenta una vecina no me lo creo hasta que me lo cuenta otra.',
    'Tienes un papel del fax y otro de la ventanilla. Dos vecinas.',
    ['Llévale las dos vecinas a la que corrige.', 'El fax de F.P. y la nota, a Aurora.']] },
  { id: 'firma', hecho: 'casilla_firma', activo: 'fax_con_papel', salas: ['catacumba'], meta: M.hff, niveles: [
    'Tu tío pone el contestador y se contesta solo. Hazle eso a ese señor.',
    'Si el del fax se pone terco, que le conteste su propia máquina.',
    ['Contéstale mejor que él. Y luego, su máquina.', 'Duelo con Teodoro. Remate: el manual.']],
    extra: { si: '!has:manual_fax', abuela: 'El manual lo tiene el de los ordenadores. Pregúntale por el fax.' } },
  { id: 'pieza', hecho: 'pieza_escrita', activo: 'casilla_fuente', salas: ['pecera'], meta: M.hff, niveles: [
    '¿Y has escrito ya? Siéntate en tu silla y escribe.',
    'Lo de escribir, en tu mesa. Que te ha costado la silla.',
    ['Escribe en tu máquina, hijo. Sin palabras raras.', 'Mi ordenador. A escribir.']] },
  { id: 'recorte', hecho: 'pieza_recortada', activo: 'pieza_escrita', salas: ['catacumba', 'administracion'], meta: M.hff, niveles: [
    'Si te sobra, dáselo a quien corta. La que me hace los bajos no pregunta.',
    'La de la ventanilla no lee: corta. Y el fax llega a todas partes.',
    ['Mándaselo a la que corta, por la máquina o en mano.', 'La pieza a Begoña: fax, tecla 2, o subir.']],
    // E1.4.1: con `herminia_midio`, antes del nivel 1
    previa: { si: 'herminia_midio', nivel: 1, abuela: 'Hasta la maquinita de los dibujos sabe cuánto te sobra, hijo.' } },
  { id: 'cierre', hecho: 'pagina_cerrada', activo: ['casilla_hueco', 'casilla_fuente', 'casilla_firma', 'pieza_recortada'], salas: ['*'], meta: M.cierre, niveles: [
    '¿Y a qué esperas para darle los papeles a ese señor del fax?',
    'Tienes las tres cosas, hijo. Llévalas a quien manda en el papel.',
    ['Al señor del fax llévale los papeles. De mi parte.', 'La ficha, a Teodoro.']] },
  { id: 'armario', hecho: 'ruben_encontrado', activo: 'acto_3_iniciado', salas: ['cpd', 'pecera'], meta: M.acto3, niveles: [
    'Si de un armario sale papel, es que alguien escribe dentro, hijo.',
    'Esos titulares tan raros salen de abajo. De un armario.',
    ['Tira del papel que sale del armario. Con cuidado.', 'Sistemas: el papel continuo del 27.']] },
  { id: 'album', hecho: (api) => api.has('album_eventos') || !!api.flag('posit_descopeado'), activo: 'ruben_encontrado', salas: ['eventos', 'cpd'], meta: M.baja, niveles: [
    'Para que dejen irse a alguien, hay que demostrar que estuvo.',
    'Las fotos de las fiestas las guarda la que las organiza.',
    ['Pídele las fotos a la de las fiestas.', 'El álbum de Pilar. Rubén sale al fondo.']] },
  { id: 'baja', hecho: 'ruben_libre', activo: (api) => api.has('album_eventos') || !!api.flag('posit_descopeado'), salas: ['pecera'], meta: M.baja, niveles: [
    'A los que echan con palabras bonitas se les saca con las mismas.',
    'Ese chico te dio una frase de despedir sin despedir. Úsala.',
    ['Dile al de los papelitos esa frase tan fina.', 'El álbum a Nemesio. «Salida en valor».']],
    extra: { si: ['!rep_13', '!oyo_descopear'], abuela: 'Pero antes pregúntale al chico por los discursos de ese señor.' } },
  { id: 'acta', hecho: 'sala_abierta', activo: 'acto_3_iniciado', salas: ['pajarera'], meta: M.acta, niveles: [
    'En una reunión manda el que escribe el acta. Que la escriba otro.',
    'El de la puerta quiere un acta. Y que no se sepa con quién comió.',
    ['Gánale al de la puerta y enséñale su cuenta de la comida.', 'Duelo con Gervasio. Remate: su nota.']] },
  { id: 'inigo', hecho: 'duelo_inigo_ganado', activo: 'sala_abierta', salas: ['sala_amazonas'], meta: M.climax, niveles: [
    'A los que hablan mucho se les contesta corto. Y con papeles.',
    'Cuando pida papeles, dale lo del chico y lo de la reunión.',
    ['Primero el papel del chico; luego el de la reunión.', 'Remates: el ticket nº 1 y el acta.']] },
  { id: 'empujon', hecho: 'lector_derribado', activo: 'duelo_inigo_ganado', salas: ['sala_amazonas'], meta: M.climax, niveles: [
    'A los que nunca dicen nada, hijo, un empujoncito. Con educación.',
    'Ese de cartón lleva semanas diciendo que sí. Que diga otra cosa.',
    ['Empújalo, que es de cartón y no se hace daño.', 'Empujar al Lector Medio.']] },
];

/** Llamada repetida en el nivel 3 (§8.5.5): nunca una llamada idéntica. */
export const OTRA_VEZ = 'Te lo digo otra vez, hijo, que no comes.';
export const SALUDOS = ['¿Bruno? ¿Has comido?', 'Hijo, ¿ya sales en el periódico?', 'Te llamo porque no me llamas.'];
/** Primera llamada con `cafetera_viral` (§4.1), una vez, antes de la pista: [quién, línea]. */
export const ABUELA_VIRAL = [
  ['A', 'Hijo, en el grupo del pueblo ha salido una cafetera. Muy educada.'],
  ['A', 'Y un chico dándole las buenas noches. Se te parecía. Más flaco.'],
  ['B', 'Era yo, abuela. Once mil personas. Es mi récord de audiencia.'],
  ['A', 'Pues come algo. Que en el vídeo se te ve el codo.'],
];
export const DESPEDIDA = 'Abrígate.';

// ------------------------------------------------------------------ §8.4 la hora del móvil, por hitos
/** Hora de la historia (siempre creciente: el motor guarda la mayor). Los relojes del edificio siguen en 20:59. */
export function horaMovil(api) {
  const f = (k) => !!api.flag(k);
  if (f('lector_derribado') || f('juego_terminado')) return '21:00';            // «Goyita. Tira.»
  if (f('sala_amazonas_climax_visto') || f('climax_entrada')) return '20:59';   // entrada en el clímax
  if (f('sala_abierta')) return '20:53';
  if (f('ruben_libre')) return '20:44';
  if (f('ruben_encontrado')) return '20:31';
  if (f('acto_3_iniciado')) return '20:22';
  if (f('acto_2_iniciado')) {
    const n = ['casilla_hueco', 'casilla_fuente', 'casilla_firma'].filter(f).length;
    const m = Math.min(20 * 60 + 17, 19 * 60 + 7 + 20 * n + (f('cms_vivo') ? 5 : 0) + (f('pieza_recortada') ? 5 : 0));
    return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  }
  if (f('gertrudis_saludada')) return '18:55';
  if (f('silla_libre')) return '18:48';
  if (f('torno_abierto')) return '18:41';
  return '18:30';
}
/** Los hitos de la tabla §8.4, para las pruebas y la documentación: [flag, hora]. */
export const HITOS_HORA = [
  [null, '18:30'], ['torno_abierto', '18:41'], ['silla_libre', '18:48'], ['gertrudis_saludada', '18:55'], ['acto_2_iniciado', '19:07'],
  ['acto_3_iniciado', '20:22'], ['ruben_encontrado', '20:31'], ['ruben_libre', '20:44'], ['sala_abierta', '20:53'],
  ['sala_amazonas_climax_visto', '20:59'], ['lector_derribado', '21:00'],
];
export const RELOJES_EDIFICIO = '20:59';
