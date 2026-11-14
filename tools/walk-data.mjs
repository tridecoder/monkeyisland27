// Datos del walkthrough del PLAN DE COMEDIA §3.2 (42 pasos, 28 cambios de sala) con la ENMIENDA E1.4.4 (pasos 32 y 35).
// Compartido por walkthrough.mjs, extras.mjs, fuzz.mjs y play-mouse.mjs. Acciones y `esp`: ver la cabecera de walkthrough.mjs.
// ------------------------------------------------------------------ plan §3.2 + E1.4.4
export const STEPS = [
  { n: 1, sala: '—', txt: '(Intro automática, 7.1)', acc: [], esp: { flags: ['intro_vista'], sala: 'vestibulo' } },
  { n: 2, sala: 'vestibulo', txt: 'Hablar celestino → nervios', acc: [['verbo', 'hablar', 'celestino'], ['opcion', '¿Tiene algo para los nervios?'], ['cerrar']], esp: { tiene: ['chicle'], flags: ['celestino_dio_chicle'] } },
  { n: 3, sala: 'vestibulo', txt: 'Hablar celestino → café', acc: [['verbo', 'hablar', 'celestino'], ['opcion', '¿Dónde hay café en esta casa?'], ['cerrar']], esp: { flags: ['celestino_pista_gertrudis'] } },
  { n: 4, sala: 'vestibulo', txt: 'Hablar celestino → cotilleo', acc: [['verbo', 'hablar', 'celestino'], ['opcion', '¿Algún cotilleo?'], ['cerrar']], esp: { flags: ['rep_05'] } },
  { n: 5, sala: 'vestibulo', txt: 'Usar chicle con tarjeta_becario', acc: [['usar', 'chicle', 'tarjeta_becario']], esp: { flags: ['tarjeta_con_chicle'], notiene: ['chicle'] } },
  { n: 6, sala: 'vestibulo', txt: 'Usar tarjeta_becario con organigrama', acc: [['usar', 'tarjeta_becario', 'organigrama']], esp: { flags: ['foto_en_organigrama'] } },
  { n: 7, sala: 'vestibulo', txt: 'Usar tarjeta_becario con torno', acc: [['usar', 'tarjeta_becario', 'torno']], esp: { flags: ['torno_abierto'] } },
  { n: 8, sala: 'pecera', txt: '(entrar) → escena 7.2', acc: [['ir', 'pecera']], esp: { flags: ['inigo_presentado'] } },
  { n: 9, sala: 'pecera', txt: 'Coger chaqueta_ramirez_hotspot', acc: [['verbo', 'coger', 'chaqueta_ramirez_hotspot']], esp: { tiene: ['chaqueta_ramirez', 'sobre_azucar'], flags: ['chaqueta_cogida'] } },
  { n: 10, sala: 'pajarera', txt: 'Usar chaqueta_ramirez con lector_medio', acc: [['ir', 'pajarera'], ['usar', 'chaqueta_ramirez', 'lector_medio']], esp: { flags: ['chaqueta_en_lector', 'silla_libre'], notiene: ['chaqueta_ramirez'] } },
  { n: 11, sala: 'pajarera', txt: 'Mirar ordenador_gervasio', acc: [['verbo', 'mirar', 'ordenador_gervasio']], esp: { flags: ['rep_07'] } },
  { n: 12, sala: 'pajarera', txt: 'Mirar pantalla_titulator ×3', acc: [['verbo', 'mirar', 'pantalla_titulator'], ['verbo', 'mirar', 'pantalla_titulator'], ['verbo', 'mirar', 'pantalla_titulator']], esp: { flags: ['vio_armario_27'] } },
  { n: 13, sala: 'pecera', txt: 'Mirar ordenador_bruno', acc: [['ir', 'pecera'], ['verbo', 'mirar', 'ordenador_bruno']], esp: { flags: ['rep_11'] } },
  { n: 14, sala: 'office', txt: 'Gertrudis: saludo + bis (cafetera viral)', acc: [['ir', 'office'], ['verbo', 'hablar', 'gertrudis'], ['opcion', 'Buenas noches, Gertrudis.'], ['opcion', 'Buenas noches otra vez.'], ['cerrar']], esp: { tiene: ['cafe'], flags: { gertrudis_saludada: true, cafetera_viral: true, rep_03: true, rep_04: true, rep_10: true, rep_14: true, chisme_indice: 4 } } },
  { n: 15, sala: 'office', txt: 'Mirar tablon', acc: [['verbo', 'mirar', 'tablon']], esp: { flags: ['rep_01'] } },
  { n: 16, sala: 'catacumba', txt: 'Dar cafe a aurora_galerada', acc: [['ir', 'catacumba'], ['dar', 'cafe', 'aurora_galerada'], ['cerrar']], esp: { tiene: ['ficha_pagina_7'], flags: ['aurora_conto_pasos', 'aurora_hablo_fax', 'acto_2_iniciado'], notiene: ['cafe'] } },
  { n: 17, sala: 'catacumba', txt: 'Hablar aurora → Teodoro', acc: [['verbo', 'hablar', 'aurora_galerada'], ['opcion', '¿Por qué no se hablan usted y Teodoro?'], ['cerrar']], esp: { flags: ['rep_02'] } },
  { n: 18, sala: 'catacumba', txt: 'Mirar fax_enmarcado', acc: [['verbo', 'mirar', 'fax_enmarcado']], esp: { flags: ['rep_06'] } },
  { n: 19, sala: 'cpd', txt: 'Mirar registro_tickets', acc: [['ir', 'cpd'], ['verbo', 'mirar', 'registro_tickets']], esp: { flags: ['vio_ticket_3'] } },
  { n: 20, sala: 'cpd', txt: 'Tirar regleta_r3 → apagón definitivo', acc: [['verbo', 'tirar', 'regleta_r3']], esp: { flags: ['cms_vivo'] } },
  { n: 21, sala: 'cpd', txt: 'Hablar paco → fax', acc: [['verbo', 'hablar', 'paco_ticket'], ['opcion', '¿Sabes algo del fax de la Redacción de papel?'], ['cerrar']], esp: { tiene: ['manual_fax'], flags: ['paco_dio_manual'] } },
  { n: 22, sala: 'cpd', txt: 'Hablar paco → consultor', acc: [['verbo', 'hablar', 'paco_ticket'], ['opcion', '¿Algún cotilleo del consultor?'], ['cerrar']], esp: { flags: ['rep_12'] } },
  { n: 23, sala: 'pecera', txt: 'Hablar yoli → hilo', acc: [['ir', 'pecera'], ['verbo', 'hablar', 'yoli_tendencias'], ['opcion', '¿Algún hilo bueno esta noche?'], ['cerrar']], esp: { flags: ['rep_08'] } },
  { n: 24, sala: 'pecera', txt: 'Hablar nemesio → Yoli', acc: [['verbo', 'hablar', 'nerea_backlog'], ['opcion', '¿Qué tal con Yoli?'], ['cerrar']], esp: { flags: ['rep_09'] } },
  { n: 25, sala: 'sala_amazonas', txt: 'Siguientes pasos → estampida', acc: [['ir', 'sala_amazonas'], ['verbo', 'hablar', 'gervasio_acta'], ['opcion', '¿y cuáles son los siguientes pasos?'], ['cerrar']], esp: { flags: ['reunion_terminada'] } },
  { n: 26, sala: 'sala_amazonas', txt: 'Maripaz → D1', acc: [['verbo', 'hablar', 'maripaz_remitido'], ['opcion', 'La página 7 está pendiente desde marzo.'], ['duelo', ['R08', 'R04', 'R11', { objeto: 'ficha_pagina_7' }]], ['cerrar']], esp: { flags: ['duelo_maripaz_ganado', 'casilla_hueco'], tiene: ['ficha_pagina_7'] } },
  { n: 27, sala: 'administracion', txt: 'Begoña: nota de gasto', acc: [['ir', 'administracion'], ['verbo', 'hablar', 'begona_triplicado'],
    ['opcion', 'Quiero presentar una nota de gasto.'], ['opcion', 'Café para entender el capitalismo.'], ['opcion', 'Lo que sea.'],
    ['opcion', 'Aquí tiene. Un sobre de azúcar. Es casi un ticket.'], ['opcion', 'Pues enséñeme cómo es una nota bien hecha'], ['cerrar']],
    esp: { tiene: ['fotocopia_nota_direccion', 'copias_rechazadas'], flags: ['nota_gasto_presentada'], notiene: ['sobre_azucar'] } },
  { n: 28, sala: 'catacumba', txt: 'Usar copias_rechazadas con fax', acc: [['ir', 'catacumba'], ['usar', 'copias_rechazadas', 'fax']], esp: { flags: ['fax_con_papel'], tiene: ['mensaje_fp'], notiene: ['copias_rechazadas'] } },
  { n: 29, sala: 'catacumba', txt: 'Mirar mensaje_fp', acc: [['verbo', 'mirar', 'mensaje_fp']], esp: { flags: ['vio_borde_perforado'] } },
  { n: 30, sala: 'catacumba', txt: 'Dar fotocopia a aurora → FUENTE', acc: [['dar', 'fotocopia_nota_direccion', 'aurora_galerada'], ['cerrar']], esp: { flags: ['casilla_fuente'], notiene: ['mensaje_fp'], tiene: ['fotocopia_nota_direccion'] } },
  { n: 31, sala: 'catacumba', txt: 'Teodoro → D2', acc: [['verbo', 'hablar', 'teodoro_cuerpodoce'], ['opcion', 'Quiero firmar en tu página 7.'], ['duelo', ['R06', 'R02', 'R03', { objeto: 'manual_fax' }]], ['cerrar']], esp: { flags: ['duelo_teodoro_ganado', 'casilla_firma'] } },
  { n: 32, sala: 'pecera', txt: 'Usar ordenador_bruno', acc: [['ir', 'pecera'], ['verbo', 'usar', 'ordenador_bruno']], esp: { tiene: ['pieza_opa'], flags: ['pieza_escrita', 'herminia_midio'] } }, // [E1]
  { n: 33, sala: 'catacumba', txt: 'Usar pieza_opa con fax → tecla 2', acc: [['ir', 'catacumba'], ['usar', 'pieza_opa', 'fax'], ['opcion', '2: ADMINISTRACIÓN'], ['cerrar']], esp: { flags: ['pieza_recortada'], tiene: ['pieza_opa'] } },
  { n: 34, sala: 'catacumba', txt: 'Dar ficha a teodoro → 7.3a', acc: [['dar', 'ficha_pagina_7', 'teodoro_cuerpodoce'], ['cerrar']], esp: { flags: ['pagina_cerrada', 'acto_3_iniciado'], notiene: ['ficha_pagina_7', 'pieza_opa'] } },
  { n: 35, sala: 'cpd', txt: 'Redacción (momento 8) → tirar papel_continuo → 7.3', acc: [['ir', 'pecera'], ['ir', 'cpd'], ['verbo', 'tirar', 'papel_continuo']], esp: { flags: ['dos_ias_vista', 'anselmo_dijo_regla', 'ruben_encontrado'] } }, // [E1]
  { n: 36, sala: 'cpd', txt: 'Hablar ruben → discursos', acc: [['verbo', 'hablar', 'ruben'], ['opcion', '¿Escribiste tú los discursos de Íñigo?'], ['cerrar']], esp: { flags: ['rep_13'] } },
  { n: 37, sala: 'eventos', txt: 'Pilar → álbum', acc: [['ir', 'eventos'], ['verbo', 'hablar', 'pilar_escaleta'], ['opcion', '¿Me prestas el álbum?'], ['cerrar']], esp: { tiene: ['album_eventos'], flags: ['oyo_descopear'] } },
  { n: 38, sala: 'pecera', txt: 'Álbum a Nemesio → salida en valor', acc: [['ir', 'pecera'], ['dar', 'album_eventos', 'nerea_backlog'], ['opcion', 'No es un despido: es una salida en valor.'], ['cerrar']], esp: { tiene: ['ticket_n1'], flags: ['posit_descopeado', 'ruben_libre'], notiene: ['album_eventos'] } },
  { n: 39, sala: 'pajarera', txt: 'Gervasio en la puerta → D3', acc: [['ir', 'pajarera'], ['verbo', 'hablar', 'gervasio_acta'], ['opcion', 'Necesito el acta de la última reunión.'], ['duelo', ['R07', 'R01', 'R14', { objeto: 'fotocopia_nota_direccion' }]], ['cerrar']], esp: { flags: ['duelo_gervasio_ganado', 'sala_abierta'], tiene: ['acta_reunion'], notiene: ['fotocopia_nota_direccion'] } },
  { n: 40, sala: 'pajarera', txt: 'Usar puerta_sala → 7.4', acc: [['ir', 'pajarera'], ['verbo', 'usar', 'puerta_sala']], esp: { sala: 'sala_amazonas' } },
  { n: 41, sala: 'sala_amazonas', txt: 'Duelo D4 (Íñigo)', acc: [['duelo', ['R10', 'R12', { objeto: 'ticket_n1' }, 'R13', 'R05', { objeto: 'acta_reunion' }]]], esp: { flags: ['duelo_inigo_ganado'] } },
  { n: 42, sala: 'sala_amazonas', txt: 'Empujar lector_medio → final', acc: [['verbo', 'empujar', 'lector_medio']], esp: { flags: ['lector_derribado', 'juego_terminado'] } },
];


// Orden alternativo (plan §3.1, «Libertad de orden en el Acto II»): tras el 22, el ascensor de Sistemas a la planta 2
// (paso 27, Begoña) antes de Yoli, Nemesio y la Sala (23-26; D1 pide la réplica de Yoli); el fax y la FIRMA antes de la
// FUENTE (28, 31, 29, 30) y la pieza; en el Acto III, el acta de Gervasio (39) antes del álbum (37-38).
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
export const ALT = [...range(1, 22), 27, 23, 24, 25, 26, 28, 31, 29, 30, ...range(32, 36), 39, 37, 38, ...range(40, 42)];
