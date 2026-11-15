// Datos del walkthrough de la ENMIENDA E5 §7 (50 pasos): E2 §10.1 + E4 (24, 38, 45) + E5 (19-22, 26-29, 43, 45-46).
// Compartido por walkthrough.mjs, extras.mjs, fuzz.mjs, play-mouse.mjs y text-audit.mjs. Acciones y `esp`: ver la cabecera
// de walkthrough.mjs. Los pasos marcados [E5] son nuevos o cambian; «(antes N)» es su número en el recorrido de E2/E4.
// Paso 20 en modo rápido: la ventana a oscuras dura 0 ms (apagon_n 1 sin cms_vivo). Paso 29 en modo rápido: el atasco se
// resuelve por la vía del anuncio dentro de la escena. Paso 21: el regletero abre un menú (la R-3 es la del pósit).
// ------------------------------------------------------------------ E5 §7.2
export const STEPS = [
  { n: 1, sala: '—', txt: '(Intro automática, 7.1)', acc: [], esp: {flags: ['intro_vista'], sala: 'vestibulo'} },
  { n: 2, sala: 'vestibulo', txt: 'Hablar celestino → nervios', acc: [['verbo', 'hablar', 'celestino'], ['opcion', '¿Tiene algo para los nervios?'], ['cerrar']], esp: {tiene: ['chicle'], flags: ['celestino_dio_chicle']} },
  { n: 3, sala: 'vestibulo', txt: 'Hablar celestino → café', acc: [['verbo', 'hablar', 'celestino'], ['opcion', '¿Dónde hay café en esta casa?'], ['cerrar']], esp: {flags: ['celestino_pista_gertrudis']} },
  { n: 4, sala: 'vestibulo', txt: 'Hablar celestino → cotilleo', acc: [['verbo', 'hablar', 'celestino'], ['opcion', '¿Algún cotilleo?'], ['cerrar']], esp: {flags: ['rep_05']} },
  { n: 5, sala: 'vestibulo', txt: 'Usar chicle con tarjeta_becario', acc: [['usar', 'chicle', 'tarjeta_becario']], esp: {flags: ['tarjeta_con_chicle'], notiene: ['chicle']} },
  { n: 6, sala: 'vestibulo', txt: 'Usar tarjeta_becario con organigrama', acc: [['usar', 'tarjeta_becario', 'organigrama']], esp: {flags: ['foto_en_organigrama']} },
  { n: 7, sala: 'vestibulo', txt: 'Usar tarjeta_becario con torno', acc: [['usar', 'tarjeta_becario', 'torno']], esp: {flags: ['torno_abierto']} },
  { n: 8, sala: 'pecera', txt: '(entrar) → escena 7.2', acc: [['ir', 'pecera']], esp: {flags: ['inigo_presentado']} },
  { n: 9, sala: 'pecera', txt: 'Coger chaqueta_ramirez_hotspot', acc: [['verbo', 'coger', 'chaqueta_ramirez_hotspot']], esp: {tiene: ['chaqueta_ramirez', 'sobre_azucar'], flags: ['chaqueta_cogida']} },
  { n: 10, sala: 'pajarera', txt: 'Usar chaqueta_ramirez con lector_medio', acc: [['ir', 'pajarera'], ['usar', 'chaqueta_ramirez', 'lector_medio']], esp: {flags: ['chaqueta_en_lector', 'silla_libre'], notiene: ['chaqueta_ramirez']} },
  { n: 11, sala: 'pajarera', txt: 'Mirar ordenador_gervasio', acc: [['verbo', 'mirar', 'ordenador_gervasio']], esp: {flags: ['rep_07']} },
  { n: 12, sala: 'pajarera', txt: 'Mirar pantalla_titulator ×3', acc: [['verbo', 'mirar', 'pantalla_titulator'], ['verbo', 'mirar', 'pantalla_titulator'], ['verbo', 'mirar', 'pantalla_titulator']], esp: {flags: ['vio_armario_27']} },
  { n: 13, sala: 'pecera', txt: 'Mirar ordenador_bruno', acc: [['ir', 'pecera'], ['verbo', 'mirar', 'ordenador_bruno']], esp: {flags: ['rep_11']} },
  { n: 14, sala: 'office', txt: 'Gertrudis: saludo + bis (cafetera viral)', acc: [['ir', 'office'], ['verbo', 'hablar', 'gertrudis'], ['opcion', 'Buenas noches, Gertrudis.'], ['opcion', 'Buenas noches otra vez.'], ['cerrar']], esp: {tiene: ['cafe'], flags: {gertrudis_saludada: true, cafetera_viral: true, 'rep_03':true, 'rep_04':true, 'rep_10':true, 'rep_14':true, chisme_indice: 4}} },
  { n: 15, sala: 'office', txt: 'Mirar tablon', acc: [['verbo', 'mirar', 'tablon']], esp: {flags: ['rep_01']} },
  { n: 16, sala: 'catacumba', txt: 'Dar cafe a aurora_galerada', acc: [['ir', 'catacumba'], ['dar', 'cafe', 'aurora_galerada'], ['cerrar']], esp: {tiene: ['ficha_pagina_7'], flags: ['aurora_conto_pasos', 'aurora_hablo_fax', 'acto_2_iniciado'], notiene: ['cafe']} },
  { n: 17, sala: 'catacumba', txt: 'Hablar aurora → Teodoro', acc: [['verbo', 'hablar', 'aurora_galerada'], ['opcion', '¿Por qué no se hablan usted y Teodoro?'], ['cerrar']], esp: {flags: ['rep_02']} },
  { n: 18, sala: 'catacumba', txt: 'Mirar fax_enmarcado', acc: [['verbo', 'mirar', 'fax_enmarcado']], esp: {flags: ['rep_06']} },
  { n: 19, sala: 'catacumba', txt: '[E5] Mirar fax → pegatina «Ticket 0.441»', acc: [['verbo', 'mirar', 'fax']], esp: {flags: ['vio_pegatina_fax']} },
  { n: 20, sala: 'pecera', txt: '[E5] Tirar enchufe_pantalla → apagón 1 (ventana a oscuras: 0 ms en modo rápido)', acc: [['ir', 'pecera'], ['verbo', 'tirar', 'enchufe_pantalla']], esp: {flags: {apagon_n: 1, cms_vivo: false}} },
  { n: 21, sala: 'cpd', txt: '[E5] Regletero → R-3 (la del pósit)', acc: [['ir', 'cpd'], ['verbo', 'tirar', 'regleta_r3'], ['opcion', 'R-3']], esp: {flags: ['cms_vivo']} },
  { n: 22, sala: 'cpd', txt: '[E5] Eutimio → «Ticket 0.441. El fax de Teodoro.»', acc: [['verbo', 'hablar', 'paco_ticket'], ['opcion', 'Ticket 0.441'], ['cerrar']], esp: {tiene: ['manual_fax'], flags: ['paco_dio_manual']} },
  { n: 23, sala: 'cpd', txt: 'Hablar paco → consultor (antes 22)', acc: [['verbo', 'hablar', 'paco_ticket'], ['opcion', '¿Algún cotilleo del consultor?'], ['cerrar']], esp: {flags: ['rep_12']} },
  { n: 24, sala: 'pecera', txt: 'Hablar yoli → hilo (antes 23)', acc: [['ir', 'pecera'], ['verbo', 'hablar', 'yoli_tendencias'], ['opcion', '¿Algún hilo bueno esta noche?'], ['cerrar']], esp: {flags: ['rep_08']} },
  { n: 25, sala: 'pecera', txt: 'Hablar anselmo → Yoli (antes 24)', acc: [['verbo', 'hablar', 'anselmo_monolito'], ['opcion', '¿Qué tal con Yoli?'], ['cerrar']], esp: {flags: ['rep_09']} },
  { n: 26, sala: 'sala_amazonas', txt: '[E5] Mirar orden_del_dia → el punto 3', acc: [['ir', 'sala_amazonas'], ['verbo', 'mirar', 'orden_del_dia']], esp: {flags: ['sala_amazonas_orden_visto']} },
  { n: 27, sala: 'sala_amazonas', txt: '[E5] Gervasio → «Los becarios no tienen turno»', acc: [['verbo', 'hablar', 'gervasio_acta'], ['opcion', '¿y cuáles son los siguientes pasos?'], ['cerrar']], esp: {flags: {sala_becario_sin_turno: true, reunion_terminada: false}} },
  { n: 28, sala: 'office', txt: '[E5] Gertrudis → «¿Y cuáles son los siguientes pasos?»', acc: [['ir', 'office'], ['verbo', 'hablar', 'gertrudis'], ['opcion', '¿Y cuáles son los siguientes pasos?'], ['cerrar']], esp: {flags: ['gertrudis_pregunta']} },
  { n: 29, sala: 'sala_amazonas', txt: '[E5] Usar tele → Gertrudis pregunta en directo → estampida (atasco: vía del anuncio en modo rápido)', acc: [['ir', 'sala_amazonas'], ['verbo', 'usar', 'tele_amazonas']], esp: {flags: ['reunion_terminada', 'sala_amazonas_estampida']} },
  { n: 30, sala: 'sala_amazonas', txt: 'Maripaz → D1 (pop-up antes del menú) (antes 26)', acc: [['verbo', 'hablar', 'maripaz_remitido'], ['opcion', 'Siestatón no ha confirmado la página 7.'], ['duelo', ['R08', 'R04', 'R11', {objeto: 'ficha_pagina_7'}]], ['cerrar']], esp: {flags: ['duelo_maripaz_ganado', 'casilla_hueco', 'bruno_con_banner'], tiene: ['ficha_pagina_7']} },
  { n: 31, sala: 'administracion', txt: 'Begoña: nota de gasto (antes 27)', acc: [['ir', 'administracion'], ['verbo', 'hablar', 'begona_triplicado'], ['opcion', 'Quiero presentar una nota de gasto.'], ['opcion', 'Café para entender el capitalismo.'], ['opcion', 'Lo que sea.'], ['opcion', 'Aquí tiene. Un sobre de azúcar. Es casi un ticket.'], ['opcion', 'Pues enséñeme cómo es una nota bien hecha'], ['cerrar']], esp: {tiene: ['fotocopia_nota_direccion', 'copias_rechazadas'], flags: ['nota_gasto_presentada'], notiene: ['sobre_azucar']} },
  { n: 32, sala: 'administracion', txt: 'Evaristo: escuchar hasta el final (antes 28)', acc: [['verbo', 'hablar', 'evaristo_salvedad'], ['opcion', '¿Para qué me ha llamado?'], ['opcion', '¿De qué trata?'], ['opcion', 'Siga.'], ['cerrar']], esp: {flags: ['evaristo_escuchado', 'rep_16']} },
  { n: 33, sala: 'catacumba', txt: 'Usar copias_rechazadas con fax (antes 29)', acc: [['ir', 'catacumba'], ['usar', 'copias_rechazadas', 'fax']], esp: {flags: ['fax_con_papel'], tiene: ['mensaje_fp'], notiene: ['copias_rechazadas']} },
  { n: 34, sala: 'catacumba', txt: 'Mirar mensaje_fp (antes 30)', acc: [['verbo', 'mirar', 'mensaje_fp']], esp: {flags: ['vio_borde_perforado']} },
  { n: 35, sala: 'catacumba', txt: 'Dar fotocopia a aurora → FUENTE (antes 31)', acc: [['dar', 'fotocopia_nota_direccion', 'aurora_galerada'], ['cerrar']], esp: {flags: ['casilla_fuente'], notiene: ['mensaje_fp'], tiene: ['fotocopia_nota_direccion']} },
  { n: 36, sala: 'catacumba', txt: 'Aurora: la coma de Evaristo → correo por fax (y quita el adhesivo) (antes 32)', acc: [['verbo', 'hablar', 'aurora_galerada'], ['opcion', 'Don Evaristo pregunta si su coma está bien.'], ['cerrar']], esp: {flags: {coma_bendecida: true, correo_evaristo_listo: true, bruno_con_banner: false}, tiene: ['correo_evaristo']} },
  { n: 37, sala: 'catacumba', txt: 'Teodoro → D2 (antes 33)', acc: [['verbo', 'hablar', 'teodoro_cuerpodoce'], ['opcion', 'Quiero firmar en tu página 7.'], ['duelo', ['R06', 'R02', {objeto: 'manual_fax'}]], ['cerrar']], esp: {flags: ['duelo_teodoro_ganado', 'casilla_firma']} },
  { n: 38, sala: 'pecera', txt: 'Usar ordenador_bruno (antes 34)', acc: [['ir', 'pecera'], ['verbo', 'usar', 'ordenador_bruno']], esp: {tiene: ['pieza_opa'], flags: ['pieza_escrita', 'herminia_midio']} },
  { n: 39, sala: 'catacumba', txt: 'Usar pieza_opa con fax → tecla 2 (antes 35)', acc: [['ir', 'catacumba'], ['usar', 'pieza_opa', 'fax'], ['opcion', '2: ADMINISTRACIÓN'], ['cerrar']], esp: {flags: ['pieza_recortada'], tiene: ['pieza_opa']} },
  { n: 40, sala: 'catacumba', txt: 'Dar ficha a teodoro → 7.3a (antes 36)', acc: [['dar', 'ficha_pagina_7', 'teodoro_cuerpodoce'], ['cerrar']], esp: {flags: ['pagina_cerrada', 'acto_3_iniciado'], notiene: ['ficha_pagina_7', 'pieza_opa']} },
  { n: 41, sala: 'cpd', txt: 'Redacción (momento 8) → tirar papel_continuo → 7.3 (antes 37)', acc: [['ir', 'pecera'], ['ir', 'cpd'], ['verbo', 'tirar', 'papel_continuo']], esp: {flags: ['dos_ias_vista', 'anselmo_dijo_regla', 'ruben_encontrado']} },
  { n: 42, sala: 'cpd', txt: 'Hablar ruben → discursos (antes 38)', acc: [['verbo', 'hablar', 'ruben'], ['opcion', '¿Escribiste tú los discursos de Íñigo?'], ['cerrar']], esp: {flags: ['rep_13']} },
  { n: 43, sala: 'ecosistema', txt: '[E5] Coger termometro_ventas → rotulador de objetivos', acc: [['ir', 'ecosistema'], ['verbo', 'coger', 'termometro_ventas']], esp: {tiene: ['rotulador_rojo']} },
  { n: 44, sala: 'eventos', txt: 'Pilar → álbum (antes 39)', acc: [['ir', 'eventos'], ['verbo', 'hablar', 'pilar_escaleta'], ['opcion', '¿Me prestas el álbum?'], ['cerrar']], esp: {tiene: ['album_eventos'], flags: ['oyo_descopear']} },
  { n: 45, sala: 'pecera', txt: '[E5] Álbum a Anselmo → «Las fotos me valen» (E4 S5 salta al entrar)', acc: [['ir', 'pecera'], ['dar', 'album_eventos', 'anselmo_monolito'], ['cerrar']], esp: {flags: {album_validado: true, discover_ganador: '*'}, notiene: ['album_eventos']} },
  { n: 46, sala: 'pecera', txt: '[E5] Rotulador + kanban → SALIDA EN VALOR (Bruno mueve el pósit)', acc: [['ir', 'pecera'], ['usar', 'rotulador_rojo', 'kanban'], ['opcion', 'SALIDA EN VALOR']], esp: {tiene: ['ticket_n1', 'rotulador_rojo'], flags: {posit_descopeado: true, ruben_libre: true, columna_kanban: 'salida'}} },
  { n: 47, sala: 'pajarera', txt: 'Gervasio en la puerta → D3 (antes 41)', acc: [['ir', 'pajarera'], ['verbo', 'hablar', 'gervasio_acta'], ['opcion', 'Necesito el acta de la última reunión.'], ['duelo', ['R07', 'R01', {objeto: 'fotocopia_nota_direccion'}]], ['cerrar']], esp: {flags: ['duelo_gervasio_ganado', 'sala_abierta'], tiene: ['acta_reunion'], notiene: ['fotocopia_nota_direccion']} },
  { n: 48, sala: 'pajarera', txt: 'Usar puerta_sala → 7.4 (antes 42)', acc: [['ir', 'pajarera'], ['verbo', 'usar', 'puerta_sala']], esp: {sala: 'sala_amazonas'} },
  { n: 49, sala: 'sala_amazonas', txt: 'Duelo D4 (Íñigo), tres remates (antes 43)', acc: [['duelo', ['R10', 'R12', {objeto: 'ticket_n1'}, 'R13', 'R05', {objeto: 'acta_reunion'}, 'R16', {objeto: 'correo_evaristo'}]]], esp: {flags: ['duelo_inigo_ganado'], notiene: []} },
  { n: 50, sala: 'sala_amazonas', txt: 'Empujar lector_medio → final (antes 44)', acc: [['verbo', 'empujar', 'lector_medio']], esp: {flags: ['lector_derribado', 'juego_terminado']} },
];

// E5 §7.3: Begoña y Evaristo (31-32) antes de Yoli, Anselmo y la Sala (24-30); el fax y la FIRMA antes de la FUENTE (33, 37,
// 34-36); en el Acto III, el acta (47) antes del álbum, y el ROTULADOR DESPUÉS de validar el álbum (44, 45, 43, 46):
// prueba el peor caso (volver a la planta 2 con el atajo del ascensor).
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
export const ALT = [...range(1, 23), 31, 32, 24, 25, 26, 27, 28, 29, 30, 33, 37, 34, 35, 36, ...range(38, 42), 47, 44, 45, 43, 46, 48, 49, 50];
