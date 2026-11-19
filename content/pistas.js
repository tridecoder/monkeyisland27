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
  cms: 'Sin web, Maripaz no pasa a Siestatón. Y la web no publica desde las cuatro.',   // [P11] el CMS, condición del HUECO
  nota: 'Teodoro no habla sin papel. Y en esta casa no queda un folio sin sellar.',   // E7 F1 (N6)
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
  // [P11] fuera `bendicion`: Evaristo ya no duda de su coma (el correo lo da él; la escena de Aurora es opcional)
  // [bloqueos] metas propias donde antes se repetía «Hueco, fuente y firma» (no decía qué toca ahora)
  reunion: 'La página 7 se decide en esa reunión. Y esa reunión no se acaba nunca.',
  hueco: 'Maripaz se ha quedado sentada en el planillo. La página 7 está debajo.',
  papel: 'El fax de Teodoro sigue sin papel. Y yo llevo un taco de copias rechazadas.',
  fuente: 'Un fax anónimo y una nota con reverso. Dos fuentes, si alguien las contrasta.',
  firma: 'Teodoro no firma a nadie de la web. Habrá que contestarle mejor que él.',
  pieza: 'Ya tengo fuente. Falta escribir la pieza, y tengo silla para hacerlo.',
  recorte: 'Mi pieza tiene 31 líneas y el hueco, 23. Alguien tiene que cortar.',
};

// [bloqueos] niveles 1-3: el 1 sugiere, el 2 dice quién o dónde, el 3 (Bruno al colgar) dice sitio, objeto y verbo.
// `sub`: sub-estados (engine/objetivos.js `variante`): el primero que se cumple sustituye niveles / meta / extra / previa.
// [P12] el álbum ya conseguido (en la mano, en manos de Anselmo o el pósit ya fuera del tablero)
const tieneAlbum = (api) => api.has('album_eventos') || !!api.flag('eventos_album_dado') || !!api.flag('album_validado') || !!api.flag('posit_descopeado');
const NEGATIVA = 'Pilar no suelta el álbum: quien no se sienta no asiste. Y le falta una silla.';
const SILLA_PILAR = [
  'La que cuenta las sillas sabe siempre quién falta, hijo.',
  'Esa silla que le falta, ¿no la has visto tú en algún sitio?',
  ['Mira bien en qué se sienta el chico del armario, hijo.', 'Sistemas: Mirar la silla del armario 27. O preguntarle a Brais de dónde es.']];
const SILLA_PILAR_VISTA = [
  'La que cuenta las sillas sabe siempre quién falta, hijo.',
  'Esa silla que le falta la has visto tú, hijo. Con alguien encima.',
  ['Dile a la de las fiestas dónde está su silla. Y quién se sienta.', 'Eventos: a Pilar, «Creo que sé dónde está tu 112». En el armario 27.']];

export const OBJETIVOS = [
  { id: 'torno', acto: 1, hecho: 'torno_abierto', salas: ['vestibulo'], meta: M.torno, niveles: [
    'En el pueblo, el que no sale en la foto no existe. Ponte en la foto.',
    'Si el torno no te conoce, preséntate en ese cuadro de caras.',
    ['Pega tu cara donde salen los jefes. ¿Tienes algo que pegue?', 'Vestíbulo: chicle en la tarjeta, tarjeta en el organigrama, y al torno.']],
    extra: { si: ['!has:chicle', '!tarjeta_con_chicle'], abuela: 'El del mostrador siempre está mascando algo: pídeselo.' } },
  { id: 'silla', acto: 1, hecho: 'silla_libre', activo: 'torno_abierto',      // [integrador] desde el torno (antes, entre el torno y la 7.2 Bruno decía la meta final)
    salas: ['pecera', 'pajarera'], meta: M.silla, niveles: [
    '¿Estás de pie? Siéntate, hijo. La silla es del que llega.',
    'Esa silla la guarda una chaqueta. Sin chaqueta, no la guarda nadie.',
    ['Coge la chaqueta de esa silla, hijo, que no muerde.', 'Redacción: Coger la chaqueta de Ramírez. Y ponérsela al Lector Medio.']],
    sub: [{ si: 'has:chaqueta_ramirez', niveles: [
      'Tu abuelo, con chaqueta, mandaba en el bar. Pónsela a alguien que mande.',
      'En los despachos hay uno que dice a todo que sí. Ese manda.',
      ['Ponle la chaqueta al que dice a todo que sí.', 'Despachos: Usar la chaqueta de Ramírez con el Lector Medio.']] }] },
  { id: 'correo', acto: 1, hecho: (api) => !!api.flag('rep_11') || !!api.flag('casilla_hueco'),   // N1: R11 solo sirve contra Maripaz
    activo: 'silla_libre', salas: ['pecera'], meta: M.correo, niveles: [
    'Ahora que estás sentado, mira lo tuyo. Que nunca lo miras.',
    'En el ordenador tendrás cartas sin abrir. Tu tío tiene el buzón igual.',
    ['Mira tu ordenador, hijo. Con silla ya se ve.', 'Redacción: Mirar mi ordenador, ya sentado.']] },
  { id: 'cafe', acto: 1, hecho: 'gertrudis_saludada', activo: 'inigo_presentado', salas: ['office', 'pecera', 'catacumba'], meta: M.cafe, niveles: [   // [bloqueos] delante de Aurora sin café, el café (no el correo)
    '¿Has saludado a todo el mundo? A las máquinas también.',
    'La cafetera esa no da café por botones. Lo da por educación.',
    ['Dale las buenas noches a la cafetera, en alto.', 'Vending: hablar con Gertrudis, «Buenas noches, Gertrudis».']] },
  { id: 'aurora', acto: 1, hecho: 'acto_2_iniciado', activo: 'has:cafe', salas: ['catacumba', 'office'], meta: M.cafe, niveles: [
    'Los que corrigen siempre están cansados. Tu abuelo corregía la quiniela.',
    'A la señora del cartel no le hables: dale. Primero el café.',
    ['Dale el café a la que corrige. La del boli rojo.', 'Redacción de papel: Dar el café a Aurora.']] },
  // [P11] el CMS es la condición del HUECO: cuenta desde que Maripaz lo dice (en la Sala, antes de la estampida o al
  // negarse al D1); antes, la abuela manda a la reunión. Los tres niveles y la línea de Bruno no cambian.
  { id: 'cms', acto: 2, hecho: 'cms_vivo', activo: ['acto_2_iniciado', 'maripaz_pide_web'], salas: ['pecera', 'cpd', 'sala_amazonas'], meta: M.cms, niveles: [
    'La tele de tu abuelo no iba si él la miraba. Apágale algo a alguien.',
    'Si te la vuelven a enchufar, apágala donde no lleguen. Sigue el cable.',                     // E5 §2.2
    ['El cable baja a los ordenadores. Apaga la regleta que no dice lo que es.', 'Sistemas: Tirar de la R-3 del regletero. La del pósit de Eutimio.']] },
  // ENMIENDA E5 §2.1: la reunión se parte en dos (preguntar a quien preside → que pregunte quien sale en la tele)
  // [bloqueos] la pregunta a Gervasio ya no pide Mirar el orden del día; el nivel 2 cambia si ya lo ha mirado
  { id: 'reunion', acto: 2, hecho: (api) => !!api.flag('sala_becario_sin_turno') || !!api.flag('reunion_terminada'), activo: 'acto_2_iniciado',
    salas: ['pajarera', 'sala_amazonas'], meta: M.reunion, niveles: [
    'Las reuniones se acaban cuando alguien pregunta lo que nadie quiere tocar.',
    'En esa reunión tienen los puntos en una pantalla. Mira cuál no tocan.',
    ['Pregúntale al que preside por los pasos que vienen, hijo.', 'Sala Amazonas: a Gervasio, «¿y cuáles son los siguientes pasos?».']],
    sub: [{ si: 'sala_amazonas_orden_visto', niveles: [
      'Las reuniones se acaban cuando alguien pregunta lo que nadie quiere tocar.',
      'Ese punto que nadie toca, pregúntaselo al que preside. En alto.',
      ['Pregúntale al que preside por los pasos que vienen, hijo.', 'Sala Amazonas: a Gervasio, «¿y cuáles son los siguientes pasos?».']] }] },
  // [bloqueos] tres sub-estados: sin turno (tele o Vending), la pregunta ya mandada por Gertrudis, el atasco
  { id: 'turno', acto: 2, hecho: 'reunion_terminada', activo: 'sala_becario_sin_turno', salas: ['sala_amazonas', 'office', 'pecera'], meta: M.turno, niveles: [
    'Si a ti no te dejan preguntar, que pregunte alguien que salga en la tele.',
    'Esa cafetera tan educada sale en todas las pantallas, hijo. Hasta en la mía.',
    ['A esa tele dale las buenas noches, como a la cafetera, y pregúntale.', 'Sala Amazonas: a la tele, «Buenas noches, Gertrudis». Y lo de los pasos.']],
    // [P11] fuera la variante del atasco: ya no es jugable (se resuelve solo dentro de la escena de la estampida)
    sub: [
      { si: 'gertrudis_pregunta', meta: 'Gertrudis ya ha mandado la pregunta. Falta una pantalla que la sintonice.', niveles: [
        'La cafetera ya lo ha mandado. Ahora alguien tiene que sintonizarla.',
        'La cafetera sale en la primera tele que se encienda. Prueba la de la reunión.',
        ['Enciende la tele de la reunión, hijo, que la cafetera ya ha hablado.', 'Sala Amazonas: Usar la tele, o hablarle.']] },
    ] },
  { id: 'hueco', acto: 2, hecho: 'casilla_hueco', activo: 'reunion_terminada', salas: ['sala_amazonas'], meta: M.hueco, niveles: [
    'La que se queda sentada es que quiere que le hables.',
    'Si alguien tiene algo apartado y no lo usa, ya no es suyo.',                                 // E2 §8 / §10.3
    ['Díselo por escrito, que es como se dicen las cosas.', 'Sala Amazonas: a Maripaz, «Siestatón no ha confirmado la página 7».']],
    duelo: 'maripaz' },                                                   // N1: dónde está cada réplica que falta
  { id: 'nota', acto: 2, hecho: 'nota_gasto_presentada', activo: 'acto_2_iniciado', salas: ['catacumba', 'ecosistema', 'administracion'], meta: M.nota, niveles: [   // E7 F1
    'En las oficinas sin papel siempre hay una que lo gasta en decir que no.',
    '¿Has hecho la cuenta de gastos? Hazla mal, que las malas vuelven con copia.',
    ['Lo que lleves en el bolsillo vale de justificante. Y pídele una bien hecha.', 'Administración: nota de gasto a Begoña, con el azúcar. Y una bien hecha.']] },
  // E2 §10.3 · paso 28: escuchar a Evaristo hasta el final (Administración)
  { id: 'coma', acto: [2, 3], hecho: 'evaristo_escuchado', activo: 'nota_gasto_presentada', salas: ['administracion', 'ecosistema'], meta: M.coma, niveles: [
    'A los mayores hay que dejarlos acabar, hijo. Lo bueno lo dicen al final.',
    'Ese señor que te llama tanto quiere contarte algo. No le metas prisa.',
    ['Escúchale entero, hijo, aunque se te enfríe la cena.', 'Administración: escuchar a Evaristo, «¿De qué trata?» y «Siga». Y su correo.']] },   // [P11]
  { id: 'papel_fax', acto: 2, hecho: 'fax_con_papel', activo: 'nota_gasto_presentada', salas: ['catacumba'], meta: M.papel, niveles: [
    'Las máquinas viejas, sin papel, no hablan. Dales papel. ¿Has cenado?',
    'Ese papel que te rechazaron tiene la espalda en blanco.',
    ['Lo que no te sirve a ti le sirve a una máquina.', 'Redacción de papel: Usar las copias rechazadas con el fax.']] },
  { id: 'fuente', acto: 2, hecho: 'casilla_fuente', activo: 'fax_con_papel', salas: ['catacumba'], meta: M.fuente, niveles: [
    'Lo que me cuenta una vecina no me lo creo hasta que me lo cuenta otra.',
    'Tienes un papel del fax y otro de la ventanilla: dos vecinas.',
    ['Llévale las dos vecinas a la que corrige.', 'Redacción de papel: Dar la fotocopia de la nota a Aurora.']] },
  // [P11] fuera el objetivo `bendicion`: el correo lo da Evaristo; la coma con Aurora es opcional y sin pista
  { id: 'firma', acto: 2, hecho: 'casilla_firma', activo: 'fax_con_papel', salas: ['catacumba'], meta: M.firma, niveles: [
    'Tu tío pone el contestador y se contesta solo. Hazle eso a ese señor.',
    'Si el del fax se pone terco, que le conteste su propia máquina.',
    ['Contéstale mejor que él, y al final, lo de su máquina.', 'Redacción de papel: a Teodoro, «Quiero firmar». Remate: el manual.']], duelo: 'teodoro',
    // [bloqueos] sin el manual, el nivel 2 y el 3 dicen dónde está · [P11] [P15] lo da Eutimio al apagar la R-3
    sub: [{ si: '!has:manual_fax', niveles: [
      'Tu tío pone el contestador y se contesta solo. Hazle eso a ese señor.',
      'El de los cables guarda el manual de esa máquina. Arréglale lo suyo.',
      ['Apaga la regleta que no dice lo que es, y el de los cables te da el manual.', 'Sistemas: el manual lo tiene Eutimio. Me lo da con su hueco, al apagar la R-3.']] }] },
  { id: 'pieza', acto: 2, hecho: 'pieza_escrita', activo: 'casilla_fuente', salas: ['pecera'], meta: M.pieza, niveles: [
    '¿Y has escrito ya? Siéntate en tu silla y escribe.',
    'Lo de escribir, en tu mesa. Que te ha costado la silla.',
    ['Escribe en tu máquina, hijo, que lo entienda tu abuela.', 'Redacción: Usar mi ordenador. A escribir.']] },
  { id: 'recorte', acto: 2, hecho: 'pieza_recortada', activo: 'pieza_escrita', salas: ['catacumba', 'administracion'], meta: M.recorte, niveles: [
    'Si te sobra, dáselo a quien corta. La que me hace los bajos no pregunta.',
    'La de la ventanilla no lee: corta. Y el fax llega a todas partes.',
    ['Mándaselo a la que corta, por la máquina o en mano.', 'Redacción de papel: la pieza al fax, tecla 2. O en mano, a Begoña.']],
    // E1.4.1: con `herminia_midio`, antes del nivel 1
    previa: { si: 'herminia_midio', nivel: 1, abuela: 'Hasta la maquinita de los dibujos sabe cuánto te sobra, hijo.' } },   // E2 §10.3
  { id: 'cierre', acto: 2, hecho: 'pagina_cerrada', activo: ['casilla_hueco', 'casilla_fuente', 'casilla_firma', 'pieza_recortada'], salas: ['*'], meta: M.cierre, niveles: [
    '¿Y a qué esperas para darle los papeles a ese señor del fax?',
    'Tienes las tres cosas, hijo. Llévalas a quien manda en el papel.',
    ['Al señor del fax llévale los papeles de mi parte.', 'Redacción de papel: Dar la ficha a Teodoro.']] },
  { id: 'armario', acto: 3, hecho: 'ruben_encontrado', activo: 'acto_3_iniciado', salas: ['cpd', 'pecera'], meta: M.acto3, niveles: [
    'Si de un armario sale papel, es que alguien escribe dentro, hijo.',
    'Antes tiraban desde dentro. Ahora el de dentro está muy liado escribiendo.',                 // E5 §2.4
    ['Tira con ganas del papel del armario, hijo.', 'Sistemas: tirar del papel continuo del 27.']] },
  // [P12] [P15] «El álbum»: desde que aparece Brais hasta la primera entrada en Eventos del Acto III (o la negativa de
  // Pilar). Su nivel 3 ya no manda a pedir el álbum (eso solo lleva a la negativa): manda a subir a Eventos.
  { id: 'album', acto: 3, hecho: (api) => tieneAlbum(api) || !!api.flag('eventos_acto3_entrada') || !!api.flag('pilar_nego_album'),
    activo: 'ruben_encontrado', salas: ['eventos', 'cpd'], meta: M.baja, niveles: [
    'Para que dejen irse a alguien, hay que demostrar que estuvo.',
    'Las fotos de las fiestas las guarda la que las organiza.',
    ['Sube a ver a la de las fiestas, hijo, y escúchala. Algo le falta.', 'Eventos: ver a Pilar antes de las 21:04. El álbum está en su trituradora.']] },
  // [P12] [P14] [P15] «La silla de Pilar» (aprobado en [P15]; aquí porque sin él el álbum quedaba sin orientación): desde
  // que Pilar cuenta al entrar que le falta la 112 (o desde su negativa) hasta tener el álbum. Sin mirar la silla del
  // armario (ni preguntarle a Brais), la abuela manda a la silla; con eso, a Pilar.
  { id: 'silla_pilar', acto: 3, hecho: tieneAlbum, activo: (api) => !!api.flag('ruben_encontrado') && (!!api.flag('eventos_acto3_entrada') || !!api.flag('pilar_nego_album')),
    salas: ['eventos', 'cpd'], meta: 'El álbum va a la trituradora a las 21:04. Y a Pilar le falta una silla.', niveles: SILLA_PILAR,
    sub: [
      { si: ['silla_112_vista', 'pilar_nego_album'], meta: NEGATIVA, niveles: SILLA_PILAR_VISTA },
      { si: 'silla_112_vista', niveles: SILLA_PILAR_VISTA },
      { si: 'pilar_nego_album', meta: NEGATIVA },
    ] },
  // ENMIENDA E5 §2.5: `baja` = enseñar el álbum (album_validado); `columna` = escribir la columna con el rotulador
  { id: 'baja', acto: 3, hecho: 'album_validado', activo: (api) => api.has('album_eventos'), salas: ['pecera'], meta: M.baja, niveles: [
    'Las fotos, enséñaselas al que lleva la lista. Que vea que el chico existe.',
    'El del tablero no se cree nada sin pruebas. Ya tienes pruebas.',
    ['Enséñale las fotos al del tablero.', 'Redacción: Dar el álbum a Anselmo.']] },
  // [bloqueos] `columna` por sub-estados: falta la frase (Brais o Eventos), o solo escribirla. [P11] El rotulador llega
  // siempre con el D1 (antes del Acto III): fuera la variante «sin el rotulador».
  { id: 'columna', acto: 3, hecho: 'ruben_libre', activo: 'album_validado', salas: ['pecera', 'ecosistema'], meta: M.columna, niveles: [
    'Ya tienes con qué y qué escribir. Al tablero, hijo.',
    'Escribe en el tablero la frase fina del chico, y mueve tú el papelito.',
    ['El rotulador, al tablero del que no se cree nada.', 'Redacción: Usar el rotulador con el kanban. «SALIDA EN VALOR».']],
    sub: [
      // [P12] solo cambia la condición: ya no existe la otra palabra
      { si: '!rep_13', meta: 'Para sacar a Brais del tablero hace falta una columna que no diga «despedido».', niveles: [
        'Para que alguien se vaya sin que parezca que lo echan, hay palabras finas.',
        'El chico del armario escribía discursos finos. Pregúntale por ellos.',
        ['Pregúntale al chico por los discursos de ese señor del traje.', 'Sistemas: a Brais, «¿Escribiste tú los discursos de Íñigo?».']] },
    ] },
  { id: 'acta', acto: 3, hecho: 'sala_abierta', activo: 'acto_3_iniciado', salas: ['pajarera'], meta: M.acta, niveles: [
    'En una reunión manda el que escribe el acta. Que la escriba otro.',
    'A ese señor no le pises las frases, hijo. Espera a que se le acaben.',
    ['Cuando deje de escribir, contéstale. Y al final, su cuenta de la comida.', 'Despachos: a Gervasio, que acabe de escribir. Remate: su nota de la comida.']], duelo: 'gervasio' },
  { id: 'inigo', acto: 3, hecho: 'duelo_inigo_ganado', activo: ['sala_abierta', 'ruben_libre'], salas: ['sala_amazonas', 'pajarera'], meta: M.climax, niveles: [
    'A los que hablan mucho se les contesta corto.',
    'Cuando pida papeles, dale lo del chico, lo de la reunión y lo de las comas.',                   // E2 §10.3
    ['Primero lo del chico; luego la reunión; luego la coma.', 'Sala Amazonas, remates: el ticket nº 1, el acta y el correo de Evaristo.']], duelo: 'inigo',
    extra: { si: '!has:correo_evaristo', abuela: 'Y el papel del señor de las comas, que lo vas a necesitar.' } },
  { id: 'empujon', acto: 3, hecho: 'lector_derribado', activo: 'duelo_inigo_ganado', salas: ['sala_amazonas'], meta: M.empujon, niveles: [
    'A los que nunca dicen nada, hijo, un empujoncito con educación.',
    'Ese de cartón lleva semanas diciendo que sí. Que diga otra cosa.',
    ['Empújalo, que es de cartón y no se hace daño.', 'Sala Amazonas: Empujar al Lector Medio.']] },
  // [bloqueos] micropuzle OPCIONAL del boli muerto (Custodia ↔ Aurora): no hace falta para acabar. Solo sale cuando el
  // jugador lo intenta (`api.objetivo.foco('boli')`, en catacumba.js y pecera.secretaria.js) y en sus salas.
  { id: 'boli', opcional: true, hecho: 'custodia_ablandada', activo: (api) => !!api.flag('custodia_regla') || api.flag('obj:foco') === 'boli',
    salas: ['pecera', 'catacumba'], meta: 'Custodia da un boli nuevo por uno muerto. Muerto de trabajar.', niveles: [
    'Los bolis que mueren trabajando, hijo, mueren en la mesa del que más corrige.',
    'La del boli rojo los gasta todos. Mira en su mesa, después del café.',
    ['Coge el boli sin tinta de la mesa de la que corrige.', 'Redacción de papel: Coger los bolis de Aurora, después del café.']],
    sub: [
      { si: '!custodia_regla', meta: 'Un boli muerto. A alguien le servirá. A mí, de momento, no.', niveles: [
        'Un boli gastado no le sirve a nadie, hijo. Bueno, a una sí.',
        'La del ventanuco de tu planta da bolis. Pregúntale cómo se consiguen.',
        ['Pídele un boli a la del ventanuco y pregúntale cómo se consigue.', 'Redacción: a Custodia, «¿Me deja un boli?» y «¿Y cómo se consigue…?».']] },
      { si: 'has:boli_muerto', meta: 'Llevo un boli muerto en el bolsillo. Custodia lo estará esperando.', niveles: [
        'Ese boli sin tinta, llévaselo a la que lo pidió.',
        'La del ventanuco te preguntará para qué. Dile la verdad.',
        ['Dile que es para apuntar lo que te digan, hijo. Que es verdad.', 'Redacción: Dar el boli muerto a Custodia. «Para apuntar lo que me digan».']] },
    ] },
];

/** crítica 3 · N2: el acto en curso (lo registra content/game.js como `acto`; lo usa engine/objetivos.js). */
export function actoActual(api) {
  if (api.flag('acto_3_iniciado')) return 3;
  if (api.flag('acto_2_iniciado')) return 2;
  return 1;
}

/** [P7] La nota de Bruno (`[1]`) es también la pista que el duelo apunta en la libreta (content/duelo.js `pistas`).
 *  crítica 3 · N1: dónde se aprende cada réplica (flag → [abuela, nivel 2-3; Bruno al colgar, nivel 3: sitio y objeto]).
 *  Si cambia dónde se aprende una réplica (content/flags.js, descripción de `rep_XX`), se cambia aquí. */
export const DONDE = {
  rep_01: ['En el cuarto del café hay un corcho con cartas. Léelo, que es gratis.', 'Vending: Mirar el tablón. El hilo del yogur.'],
  rep_02: ['La del boli rojo y el del fax no se hablan. Pregúntale por qué.', 'Redacción de papel: a Aurora, por qué no se habla con Teodoro.'],
  rep_03: ['La cafetera esa cuenta chismes si la saludas, hijo.', 'Vending: «Buenas noches, Gertrudis», el primer chisme.'],
  rep_04: ['A esa cafetera salúdala otra vez, hijo, que le quedan chismes.', 'Vending: saludar otra vez a Gertrudis. Suelta todos los chismes.'],
  rep_05: ['El del mostrador de abajo sabe lo que se dice en las cartas de todos.', 'Vestíbulo: a Celestino, «¿Algún cotilleo?».'],   // [P15]
  rep_06: ['Encima de la mesa del fax hay un papel con marco: léelo.', 'Redacción de papel: Mirar el fax enmarcado, sobre la mesa de Teodoro.'],
  rep_07: ['Al que manda en los Despachos, mírale el ordenador.', 'Despachos: Mirar el ordenador de Gervasio, los enviados.'],
  rep_08: ['La chica de los números tiene hilos buenos. Cuando le vaya el ordenador.', 'Redacción, con el CMS vivo: a Yoli, «¿Algún hilo bueno esta noche?».'],
  rep_09: ['Pregúntale al del tablero cómo se lleva con la chica de los números.', 'Redacción: a Anselmo, «¿Qué tal con Yoli?».'],
  rep_10: ['A esa cafetera salúdala otra vez, hijo, que le quedan chismes.', 'Vending: saludar otra vez a Gertrudis. Suelta todos los chismes.'],
  rep_11: ['Mira tu ordenador, hijo, sentado. Tienes cartas sin contestar.', 'Redacción: mi ordenador, sentado. Ramírez pregunta si he podido verlo.'],
  rep_12: ['El de los cables sabe cosas del señor del traje. Pregúntale.', 'Sistemas: a Eutimio, «¿Algún cotilleo del consultor?».'],   // [P11]
  rep_13: ['El chico del armario escribía los discursos. Pregúntale.', 'Sistemas: a Brais, «¿Escribiste tú los discursos de Íñigo?».'],
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
  if (f('lector_derribado') || f('juego_terminado')) return '21:00';            // «Benita. Tira.»
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
