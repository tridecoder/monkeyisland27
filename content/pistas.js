// OBJETIVOS, PISTAS DE LA ABUELA Y HORA DEL MÓVIL (plan de comedia §8). ARCHIVO COMPARTIDO (paquete común): no lo
// edita ningún autor de sala; si un texto cambia, se pide al jefe de guion.
//
// Cada objetivo: id · hecho (condición, §8 de CONTENT_SCHEMA) · activo (desde cuándo cuenta) · salas (dónde «toca»;
// '*' = todas) · meta (lo que dice Bruno al mirarse, §8.2) · niveles: 1 y 2 = la abuela; 3 = [abuela, Bruno al colgar]
// · extra (opcional): { si: condición, abuela: 'línea' } que la abuela añade en el nivel 3.
// · previa (opcional): { si: condición, nivel, abuela: 'línea' } que la abuela dice ANTES de la pista de ese nivel.
// · acto (crítica 3 · N2): 1, 2 o 3 (o [2, 3]: sigue valiendo en el Acto III). «Mirar a Bruno» y la abuela miran antes
//   los objetivos del acto en curso (`actoActual`), para que uno viejo que siga pendiente no tape la meta del acto.
// · duelo (crítica 3 · N1): id del duelo del objetivo. Si a Bruno le falta alguna réplica de su mazo, en el nivel 2 la
//   abuela dice dónde está la primera que falta y en el nivel 3 Bruno, al colgar, dice sitio y objeto de cada una
//   (`DONDE`, más abajo). Lo hace content/game.js (`pistas`).
// El motor (engine/objetivos.js) elige el objetivo y el nivel; content/game.js (`pistas`) dice las líneas.
// Los autores de sala no tienen que tocar nada: cada objetivo se da por hecho con su flag. Si un hito no tiene flag,
// `api.objetivo.marcar('<id>')`.

const M = {      // §8.2: la meta en la voz de Bruno (qué quiere ahora, nunca cómo)
  torno: 'Seis años aquí y el torno no sabe quién soy. Tengo que constar en algo.',
  silla: 'Necesito sentarme. Seis años de pie: tengo rodillas de becario senior.',
  correo: 'Tengo silla. Ya puedo mirar mi ordenador como un adulto.',
  cafe: 'La correctora no habla antes del café. Necesito un café que no sea para mí.',
  cms: 'Arriba no me atiende nadie mientras el CMS no vaya.',   // E5 C71
  hff: 'Hueco, fuente y firma. Lo pone la ficha.',
  cierre: 'Lo tengo todo. Solo falta que Teodoro diga «cabe».',
  acto3: 'A las nueve apagan la rotativa. Y alguien teclea en el armario 27.',
  // [integrador] con Rubén ya fuera del armario, la línea del armario 27 se queda vieja (álbum y baja)
  baja: 'A las nueve apagan la rotativa. Y Brais sigue de alta en un armario.',
  acta: 'Para entrar en la Sala hace falta un acta. Gervasio no ha escrito una nunca.',
  climax: 'Respondo a todos. Por fin algo que sé hacer.',
  empujon: 'El Lector Medio se tambalea. Un empujoncito y deja de asentir.',   // crítica 3 §9.9: la señal del empujón
  // E2 §10.3: la coma de Evaristo (pasos 28 y 32)
  // ENMIENDA E5 §2.1 y §2.5: la estampida por la tele y la columna nueva del kanban
  turno: 'En esa reunión solo pregunta quien sale en la tele. Yo no salgo en nada.',
  columna: 'Anselmo ya cree que Brais existe. Lo que no hay es columna para que se vaya.',
  coma: 'Evaristo me llama y Begoña me manda a verle. Algo le quita el sueño.',   // integración: en el paso 28 solo ha sonado la L1
  bendicion: 'Evaristo duda de su propia coma. Necesita a alguien que sepa de comas.',
};

export const OBJETIVOS = [
  { id: 'torno', acto: 1, hecho: 'torno_abierto', salas: ['vestibulo'], meta: M.torno, niveles: [
    'En el pueblo, el que no sale en la foto no existe. Ponte en la foto.',
    'Si el torno no te conoce, preséntate en ese cuadro de caras.',
    ['Pega tu cara donde salen los jefes. ¿Tienes algo que pegue?', 'Chicle en la tarjeta, tarjeta en el organigrama, y al torno.']],
    extra: { si: ['!has:chicle', '!tarjeta_con_chicle'], abuela: 'El del mostrador siempre está mascando algo: pídeselo.' } },
  { id: 'silla', acto: 1, hecho: 'silla_libre', activo: 'torno_abierto',      // [integrador] desde el torno (antes, entre el torno y la 7.2 Bruno decía la meta final)
    salas: ['pecera', 'pajarera'], meta: M.silla, niveles: [
    '¿Estás de pie? Siéntate, hijo. La silla es del que llega.',
    'Tu abuelo, con chaqueta, mandaba en el bar. Pónsela a alguien que mande.',
    ['El que manda ahí es el que dice a todo que sí.', 'La chaqueta de Ramírez, al Lector Medio.']] },
  { id: 'correo', acto: 1, hecho: (api) => !!api.flag('rep_11') || !!api.flag('casilla_hueco'),   // N1: R11 solo sirve contra Maripaz
    activo: 'silla_libre', salas: ['pecera'], meta: M.correo, niveles: [
    'Ahora que estás sentado, mira lo tuyo. Que nunca lo miras.',
    'En el ordenador tendrás cartas sin abrir. Tu tío tiene el buzón igual.',
    ['Mira tu ordenador, hijo. Con silla ya se ve.', 'Mirar mi ordenador, sentado.']] },
  { id: 'cafe', acto: 1, hecho: 'gertrudis_saludada', activo: 'inigo_presentado', salas: ['office', 'pecera'], meta: M.cafe, niveles: [
    '¿Has saludado a todo el mundo? A las máquinas también.',
    'La cafetera esa no da café por botones. Lo da por educación.',
    ['Dale las buenas noches a la cafetera, en alto.', 'Vending: «Buenas noches, Gertrudis», y darle lo que pida.']] },
  { id: 'aurora', acto: 1, hecho: 'acto_2_iniciado', activo: 'has:cafe', salas: ['catacumba'], meta: M.cafe, niveles: [
    'Los que corrigen siempre están cansados. Tu abuelo corregía la quiniela.',
    'A la señora del cartel no le hables: dale. Primero el café.',
    ['Dale el café a la que corrige. La del boli rojo.', 'El café, a Aurora.']] },
  { id: 'cms', acto: 2, hecho: 'cms_vivo', activo: 'acto_2_iniciado', salas: ['pecera', 'cpd'], meta: M.cms, niveles: [
    'La tele de tu abuelo no iba si él la miraba. Apágale algo a alguien.',
    'Si te la vuelven a enchufar, apágala donde no lleguen. Sigue el cable.',                     // E5 §2.2
    ['El cable baja a los ordenadores. Apaga la regleta que no dice lo que es.', 'Sistemas: en el regletero, la R-3. La del pósit de Eutimio.']] },
  // ENMIENDA E5 §2.1: la reunión se parte en dos (preguntar a quien preside → que pregunte quien sale en la tele)
  { id: 'reunion', acto: 2, hecho: (api) => !!api.flag('sala_becario_sin_turno') || !!api.flag('reunion_terminada'), activo: 'acto_2_iniciado',
    salas: ['pajarera', 'sala_amazonas'], meta: M.hff, niveles: [
    'Las reuniones se acaban cuando alguien pregunta lo que nadie quiere tocar.',
    'En esa reunión tienen los puntos en una pantalla. Busca el que nadie toca.',
    ['Pregúntale al que preside por ese punto.', 'Orden del día, punto 3. A Gervasio: «¿y los siguientes pasos?».']] },
  { id: 'turno', acto: 2, hecho: 'reunion_terminada', activo: 'sala_becario_sin_turno', salas: ['sala_amazonas', 'office', 'pecera'], meta: M.turno, niveles: [
    'Si a ti no te dejan preguntar, que pregunte alguien que salga en la tele.',
    'Esa cafetera tan educada sale en todas las pantallas, hijo. Hasta en la mía.',
    ['A esa tele dale las buenas noches, como a la cafetera, y pregúntale.', 'Hablar con la tele: «Buenas noches, Gertrudis». Y lo de los pasos.']],
    previa: { si: 'gertrudis_pregunta', nivel: 1, abuela: 'La cafetera ya lo ha mandado. Ahora alguien tiene que sintonizarla.' } },
  { id: 'hueco', acto: 2, hecho: 'casilla_hueco', activo: 'reunion_terminada', salas: ['sala_amazonas'], meta: M.hff, niveles: [
    'La que se queda sentada es que quiere que le hables.',
    'Si alguien tiene algo apartado y no lo usa, ya no es suyo.',                                 // E2 §8 / §10.3
    ['Díselo por escrito, que es como se dicen las cosas.', 'A Maripaz: «Siestatón no ha confirmado la página 7».']],
    duelo: 'maripaz' },                                                   // N1: dónde está cada réplica que falta
  { id: 'nota', acto: 2, hecho: 'nota_gasto_presentada', activo: 'acto_2_iniciado', salas: ['ecosistema', 'administracion'], meta: M.hff, niveles: [
    '¿Has hecho la cuenta de gastos? Hazla mal. Te enseñan una buena.',
    'La de la ventanilla enseña las buenas si le das una mala.',
    ['Presenta una cuenta mal hecha. Lo que lleves en el bolsillo te vale.', 'Nota de gasto a Begoña, con el azúcar de justificante.']] },
  // E2 §10.3 · paso 28: escuchar a Evaristo hasta el final (Administración)
  { id: 'coma', acto: [2, 3], hecho: 'evaristo_escuchado', activo: 'nota_gasto_presentada', salas: ['administracion', 'ecosistema'], meta: M.coma, niveles: [
    'A los mayores hay que dejarlos acabar, hijo. Lo bueno lo dicen al final.',
    'Ese señor que te llama tanto quiere contarte algo. No le metas prisa.',
    ['Escúchale entero, hijo, aunque se te enfríe la cena.', 'Evaristo: «¿De qué trata?» y «Siga».']] },
  { id: 'papel_fax', acto: 2, hecho: 'fax_con_papel', activo: 'nota_gasto_presentada', salas: ['catacumba'], meta: M.hff, niveles: [
    'Las máquinas viejas, sin papel, no hablan. Dales papel. ¿Has cenado?',
    'Ese papel que te rechazaron tiene la espalda en blanco.',
    ['Lo que no te sirve a ti le sirve a una máquina.', 'Las copias rechazadas, al fax de Teodoro.']] },
  { id: 'fuente', acto: 2, hecho: 'casilla_fuente', activo: 'fax_con_papel', salas: ['catacumba'], meta: M.hff, niveles: [
    'Lo que me cuenta una vecina no me lo creo hasta que me lo cuenta otra.',
    'Tienes un papel del fax y otro de la ventanilla: dos vecinas.',
    ['Llévale las dos vecinas a la que corrige.', 'El fax de F.P. y la nota, a Aurora.']] },
  // E2 §10.3 · paso 32: Aurora bendice la coma y la manda por el fax (Redacción de papel)
  { id: 'bendicion', acto: [2, 3], hecho: 'coma_bendecida', activo: ['evaristo_escuchado', 'fax_con_papel'], salas: ['catacumba'], meta: M.bendicion, niveles: [
    'Si dudas de una coma, pregúntale a la que corrige.',
    'La señora del boli rojo sabe de comas más que el cura.',
    ['Pregúntale a la del boli por la coma de ese señor.', 'A Aurora: la coma de Evaristo.']] },
  { id: 'firma', acto: 2, hecho: 'casilla_firma', activo: 'fax_con_papel', salas: ['catacumba'], meta: M.hff, niveles: [
    'Tu tío pone el contestador y se contesta solo. Hazle eso a ese señor.',
    'Si el del fax se pone terco, que le conteste su propia máquina.',
    ['Contéstale mejor que él, y al final, lo de su máquina.', 'Duelo con Teodoro. Remate: el manual.']], duelo: 'teodoro',
    extra: { si: '!has:manual_fax', abuela: 'El de los ordenadores no da nada sin número. Míralo en la máquina.' } },   // E5 §2.3
  { id: 'pieza', acto: 2, hecho: 'pieza_escrita', activo: 'casilla_fuente', salas: ['pecera'], meta: M.hff, niveles: [
    '¿Y has escrito ya? Siéntate en tu silla y escribe.',
    'Lo de escribir, en tu mesa. Que te ha costado la silla.',
    ['Escribe en tu máquina, hijo, que lo entienda tu abuela.', 'Mi ordenador, a escribir.']] },
  { id: 'recorte', acto: 2, hecho: 'pieza_recortada', activo: 'pieza_escrita', salas: ['catacumba', 'administracion'], meta: M.hff, niveles: [
    'Si te sobra, dáselo a quien corta. La que me hace los bajos no pregunta.',
    'La de la ventanilla no lee: corta. Y el fax llega a todas partes.',
    ['Mándaselo a la que corta, por la máquina o en mano.', 'La pieza a Begoña: fax, tecla 2, o subir.']],
    // E1.4.1: con `herminia_midio`, antes del nivel 1
    previa: { si: 'herminia_midio', nivel: 1, abuela: 'Hasta la maquinita de los dibujos sabe cuánto te sobra, hijo.' } },   // E2 §10.3
  { id: 'cierre', acto: 2, hecho: 'pagina_cerrada', activo: ['casilla_hueco', 'casilla_fuente', 'casilla_firma', 'pieza_recortada'], salas: ['*'], meta: M.cierre, niveles: [
    '¿Y a qué esperas para darle los papeles a ese señor del fax?',
    'Tienes las tres cosas, hijo. Llévalas a quien manda en el papel.',
    ['Al señor del fax llévale los papeles de mi parte.', 'La ficha, a Teodoro.']] },
  { id: 'armario', acto: 3, hecho: 'ruben_encontrado', activo: 'acto_3_iniciado', salas: ['cpd', 'pecera'], meta: M.acto3, niveles: [
    'Si de un armario sale papel, es que alguien escribe dentro, hijo.',
    'Antes tiraban desde dentro. Ahora el de dentro está muy liado escribiendo.',                 // E5 §2.4
    ['Tira con ganas del papel del armario, hijo.', 'Sistemas: tirar del papel continuo del 27.']] },
  { id: 'album', acto: 3, hecho: (api) => api.has('album_eventos') || !!api.flag('album_validado') || !!api.flag('posit_descopeado'),   // E5: el álbum se lo queda Anselmo
    activo: 'ruben_encontrado', salas: ['eventos', 'cpd'], meta: M.baja, niveles: [
    'Para que dejen irse a alguien, hay que demostrar que estuvo.',
    'Las fotos de las fiestas las guarda la que las organiza.',
    ['Pídele las fotos a la de las fiestas.', 'El álbum de Pilar. Brais sale al fondo.']] },
  // ENMIENDA E5 §2.5: `baja` = enseñar el álbum (album_validado); `columna` = escribir la columna con el rotulador
  { id: 'baja', acto: 3, hecho: 'album_validado', activo: (api) => api.has('album_eventos'), salas: ['pecera'], meta: M.baja, niveles: [
    'Las fotos, enséñaselas al que lleva la lista. Que vea que el chico existe.',
    'El del tablero no se cree nada sin pruebas. Ya tienes pruebas.',
    ['Enséñale las fotos al del tablero.', 'El álbum, a Anselmo.']] },
  { id: 'columna', acto: 3, hecho: 'ruben_libre', activo: 'album_validado', salas: ['pecera', 'ecosistema'], meta: M.columna, niveles: [
    'En esa pizarra se escribe con rotulador, hijo, y no con el de ese señor.',
    'La de los anuncios pinta sus objetivos a rotulador: pídeselo.',
    ['Escribe en el tablero la frase fina del chico, y mueve tú el papelito.', 'Rotulador de Maripaz y tablero de Anselmo: «SALIDA EN VALOR».']],
    extra: { si: ['!rep_13', '!oyo_descopear'], abuela: 'Pero antes pregúntale al chico por los discursos de ese señor.' } },
  { id: 'acta', acto: 3, hecho: 'sala_abierta', activo: 'acto_3_iniciado', salas: ['pajarera'], meta: M.acta, niveles: [
    'En una reunión manda el que escribe el acta. Que la escriba otro.',
    'El de la puerta quiere un acta. Y que no se sepa con quién comió.',
    ['Gánale al de la puerta y enséñale su cuenta de la comida.', 'Duelo con Gervasio. Remate: su nota.']], duelo: 'gervasio' },
  { id: 'inigo', acto: 3, hecho: 'duelo_inigo_ganado', activo: 'sala_abierta', salas: ['sala_amazonas'], meta: M.climax, niveles: [
    'A los que hablan mucho se les contesta corto.',
    'Cuando pida papeles, dale lo del chico, lo de la reunión y lo de las comas.',                   // E2 §10.3
    ['Primero lo del chico; luego la reunión; luego la coma.', 'Remates: el ticket nº 1, el acta y el correo de Evaristo.']], duelo: 'inigo',
    extra: { si: '!has:correo_evaristo', abuela: 'Y el papel del señor de las comas, que lo vas a necesitar.' } },
  { id: 'empujon', acto: 3, hecho: 'lector_derribado', activo: 'duelo_inigo_ganado', salas: ['sala_amazonas'], meta: M.empujon, niveles: [
    'A los que nunca dicen nada, hijo, un empujoncito con educación.',
    'Ese de cartón lleva semanas diciendo que sí. Que diga otra cosa.',
    ['Empújalo, que es de cartón y no se hace daño.', 'Empujar al Lector Medio.']] },
];

/** crítica 3 · N2: el acto en curso (lo registra content/game.js como `acto`; lo usa engine/objetivos.js). */
export function actoActual(api) {
  if (api.flag('acto_3_iniciado')) return 3;
  if (api.flag('acto_2_iniciado')) return 2;
  return 1;
}

/** crítica 3 · N1: dónde se aprende cada réplica (flag → [abuela, nivel 2-3; Bruno al colgar, nivel 3: sitio y objeto]).
 *  Si cambia dónde se aprende una réplica (content/flags.js, descripción de `rep_XX`), se cambia aquí. */
export const DONDE = {
  rep_01: ['En el cuarto del café hay un corcho con cartas. Léelo, que es gratis.', 'Vending: Mirar el tablón. El hilo del yogur.'],
  rep_02: ['La del boli rojo y el del fax no se hablan; pregúntale por qué.', 'Redacción de papel: a Aurora, por qué no se habla con Teodoro.'],
  rep_03: ['La cafetera esa cuenta chismes si la saludas, hijo.', 'Vending: «Buenas noches, Gertrudis», el primer chisme.'],
  rep_04: ['A esa cafetera salúdala otra vez, hijo, que le quedan chismes.', 'Vending: saludar otra vez a Gertrudis. Suelta todos los chismes.'],
  rep_05: ['El del mostrador de abajo sabe lo que se dice en el ascensor.', 'Vestíbulo: a Celestino, «¿Algún cotilleo?».'],
  rep_06: ['Encima de la mesa del fax hay un papel con marco: léelo.', 'Redacción de papel: Mirar el fax enmarcado, sobre la mesa de Teodoro.'],
  rep_07: ['Al que manda en los Despachos, mírale el ordenador.', 'Despachos: Mirar el ordenador de Gervasio, los enviados.'],
  rep_08: ['La chica de los números tiene hilos buenos. Cuando le vaya el ordenador.', 'Redacción, con el CMS vivo: a Yoli, «¿Algún hilo bueno esta noche?».'],
  rep_09: ['Pregúntale al del tablero cómo se lleva con la chica de los números.', 'Redacción: a Anselmo, «¿Qué tal con Yoli?».'],
  rep_10: ['A esa cafetera salúdala otra vez, hijo, que le quedan chismes.', 'Vending: saludar otra vez a Gertrudis. Suelta todos los chismes.'],
  rep_11: ['Mira tu ordenador, hijo, sentado. Tienes cartas sin contestar.', 'Redacción: mi ordenador, sentado. Ramírez espera mis comentarios.'],
  rep_12: ['El de los cables sabe cosas del señor del traje; pregúntale.', 'Sistemas, con el CMS vivo: a Eutimio, «¿Algún cotilleo del consultor?».'],
  rep_13: ['El chico del armario escribía los discursos; pregúntale.', 'Sistemas: a Brais, «¿Escribiste tú los discursos de Íñigo?».'],
  rep_14: ['A esa cafetera salúdala otra vez, hijo, que le quedan chismes.', 'Vending: saludar otra vez a Gertrudis. Suelta todos los chismes.'],
  rep_15: ['Pregúntale al chico del armario por los correos de ese Tadeo.', 'Sistemas: a Brais, «¿Te llegaban correos de Tadeo?».'],
  rep_16: ['Al señor de las comas, escúchale hasta el final.', 'Administración: escuchar entero a Evaristo. «¿De qué trata?» y «Siga».'],
};
/** Bruno, al colgar en el nivel 3, antes de los sitios de las réplicas que faltan. */
export const FALTAN_REPLICAS = 'Me faltan réplicas.';

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
