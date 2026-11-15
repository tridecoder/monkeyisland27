// E6 §3 · líneas NUEVAS (rev. 2, la contra). `cuenta: false` = texto de pantalla o menú (no es línea hablada).
// `reusa: true` = el texto ya existe hoy literal en content/ (se dice en un sitio más; no es cadena nueva).
// `actual` = la cadena de hoy a la que sustituye (verifica.mjs comprueba que existe literal).
export const NUEVOS = [
  { id: 'N1', f: 'rooms/sala_amazonas.js', quien: 'BRUNO', texto: '¿Necesitan ayuda?', donde: 'fin de la cinemática de la tele, con los tres encajados (§2.2)' },
  { id: 'N2', f: 'rooms/sala_amazonas.js', quien: 'BRUNO (Mirar a Fermín/Rogelio/Jacinto con el atasco)', texto: 'Los tres de Mercados, encajados en el marco, sin ceder un palmo.', donde: '§2.2' },
  { id: 'N3', f: 'rooms/sala_amazonas.js', quien: 'GERTRUDIS (en la tele)', texto: 'BUENAS NOCHES, SALA AMAZONAS.', donde: '§2.3, al saludarla en la tele (rev. 2: sin «¿QUÉ PREGUNTA EL PÚBLICO?», que pisaba su «PREGUNTA DEL PÚBLICO» de diez segundos después)' },
  { id: 'N4', f: 'rooms/office.js', quien: 'BRUNO (opción, en la Sala)', texto: 'Buenas noches, Gertrudis.', reusa: true, donde: '§2.3 (el mismo texto que en el Vending)' },
  { id: 'N5', f: 'rooms/office.js', quien: 'BRUNO (opción, en la Sala)', texto: '¿Y cuáles son los siguientes pasos?', reusa: true, donde: '§2.3 (ídem)' },
  { id: 'N6', f: 'rooms/office.js', quien: 'BRUNO (opción de salida) → GERTRUDIS «E-00: DE NADA. ESO TAMBIÉN SE DICE.»', texto: 'Nada. Gracias, Gertrudis.', reusa: true, donde: '§2.3 (rev. 2: la del Vending, no «Nada, gracias.»)' },
  { id: 'N7', f: 'rooms/catacumba.js', quien: 'TEODORO (ataque R09 en D2, fax)', texto: 'DATO SIN CONTEXTO. CONTESTA EN UNA LÍNEA: TREINTA Y OCHO CARACTERES.', actual: 'DATO SIN CONTEXTO. Y DE LA WEB, QUE ES PEOR.', donde: '§5.1' },
  { id: 'N8', f: 'rooms/catacumba.js', quien: 'BRUNO (réplica corta de R09, solo en D2)', texto: 'Tráeme el contexto.', donde: '§5.1' },
  { id: 'N9', f: 'rooms/catacumba.js', quien: 'TEODORO (la réplica larga, 1.ª vez)', texto: 'NO CABE. REPITA EN TREINTA Y OCHO.', donde: '§5.1 (2.ª vez y siguientes: su taunt «Treinta y ocho caracteres de nada.», de hoy)' },
  { id: 'N10', f: 'rooms/pajarera.js', quien: 'GERVASIO (ataque R03 en D3)', texto: 'El acta se necesitaba para... para...', actual: 'El acta se necesitaba para ayer. Por alguien. No digo quién.', donde: '§5.2' },
  { id: 'N11', f: 'rooms/pecera.js', quien: 'ANSELMO (Usar el tablero con el álbum validado y sin rotulador)', texto: 'Mi rotulador no sale de Desarrollo. Que te lo preste alguien de fuera.', actual: 'Una columna nueva pide rotulador. El de Anselmo no sale de Desarrollo.', donde: '§2.9 (sustituye a la de Bruno)' },
  { id: 'P1', f: 'rooms/cpd.js', quien: 'rótulo del plano', texto: 'MIENTRAS, EN LA REDACCIÓN', cuenta: false, donde: '§2.1' },
  { id: 'P2', f: 'rooms/pecera.titulador.js', quien: 'pie del titulador', texto: 'LA CASA: 225.000', cuenta: false, donde: '§2.7 (rev. 2: 225.000; lo superan 7 combinaciones, 4 sin secreto)' },
  { id: 'P3', f: 'engine/duel.js', quien: 'etiqueta del menú', texto: 'COMODÍN', cuenta: false, donde: '§6' },
];
