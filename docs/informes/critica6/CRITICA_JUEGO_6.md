# CRÍTICA 6 · «FE DE ERRATAS»

*Crítica independiente. La sección 3 se escribió entera al terminar la partida a ciegas, antes de abrir `README.md`, `docs/`, `tools/` (salvo para lanzar `serve.mjs`), `content/` o `engine/`, y no se ha retocado: las correcciones de la fase 2 van en un recuadro al final de esa sección.*

Etiquetas: **[J]** jugado a ciegas · **[C]** leído en contenido o código · **[T]** herramienta.

## 1. Veredicto en cinco líneas

1. **Igual de bueno que en la crítica 5, no mejor de forma apreciable: sigue siendo un 8,0, no un 8,5.** La E6 arregló casi todo lo que se pidió (titulador, apagón, atasco, armario, duelo de Teodoro, rotulador, DPR 1) y casi todo funciona a ciegas.
2. Lo mejor nuevo es el duelo de Teodoro, con la réplica que tiene que «caber» en 38 caracteres: es el primer duelo que pide pensar en la forma, no solo emparejar.
3. Pero la poda del remate seco (727 → 514 cadenas) ha quitado más golpes buenos de los que dice la tabla. Las descripciones de objetos ganan en limpieza y pierden una sonrisa de cada tres, y he contado menos risa: **11 carcajadas y ~45 sonrisas, frente a 22 y ~60** en la crítica 5.
4. El centro del Acto II sigue siendo el punto flaco: me atasqué ~15 minutos y gasté dos pistas en el nudo CMS → nota de gasto «mal hecha» → fax. Y el atajo nuevo de la tele no lo encontré: hice el ida y vuelta al Vending igual.
5. Le faltan cuatro cosas concretas para el 8,5 (§9): desatascar ese nudo, devolver unos 20 golpes podados, que Usar la tele lleve al atajo y otro duelo con mecánica propia.

## 2. Notas

| Apartado | C1 | C2 | C3 | C4 | C5 | **C6** | Por qué |
|---|---:|---:|---:|---:|---:|---:|---|
| Comedia y guion | 6 | 6,5 | 7 | 7,5 | 8 | **8,0** | Los grandes momentos siguen intactos y Bruno explica menos. La poda deja descripciones más planas («Suben.», «Estoy de miedo.», «Tienen horario.», «Ayuda bastante.») y un tic nuevo («…, por respeto/por principios/por reglamento»). Ni sube ni baja |
| Puzles y diseño | 6 | 7 | 7 | 7 | 7,5 | **7,5** | Mejor: Teodoro en tres asaltos con la regla de los 38 caracteres, el atasco anunciado, el rotulador visible. Igual: el nudo CMS-nota de gasto (dos pistas a ciegas), Gervasio sigue siendo trámite y el atajo de la tele no se descubre con Usar |
| Historia y estructura | 6 | 7,5 | 8 | 8 | 8,5 | **8,5** | El armario ya no llega masticado y todas las siembras pagan (pósit de 1998, coma, «abrígate»). La escena de Anselmo tras el kanban sigue liando |
| Interfaz y usabilidad | 6 | 7 | 7 | 7,5 | 8 | **8,0** | Arreglados: quinta publicación del titulador, «Mirar a Bruno» con prioridad, móvil a DPR 1. Nuevos: el verbo se queda colgado tras adjuntar en un duelo, «Cómo se juega» no menciona «Mirar a Bruno» y «¿Falta mucho?» corta sin explicar |
| Apartado visual | 8 | 8 | 8 | 8 | 8 | **8,0** | Sin cambios de fondo. Sigue siendo lo más vistoso del proyecto |
| Audio (provisional, no oído) | 6 | 6,5 | 6,5 | 6,5 | 6,5 | **6,5** | No he podido oírlo; se mantiene la cifra como referencia, no como juicio |
| Técnica y estabilidad | 8 | 8 | 8,5 | 8,5 | 8,5 | **8,5** | `test-all` **21/21 OK** en 1.369 s (ver §7); cero mensajes de consola en la partida entera y en el tramo de móvil |
| **Global** | **6,5** | **7,0** | **7,5** | **7,5 alto** | **8,0** | **8,0** | No sube: lo arreglado era lo que pedía la crítica 5, pero la textura cómica ha perdido algo. No baja: nada se ha roto y los picos siguen |

Sobre la comparación de risa: no es del todo homogénea. Mi «carcajada» es más estricta que la de la crítica 5, que incluía las «suaves». Sus 22 carcajadas siguen en el juego, todas, y yo las conté como carcajada o como sonrisa fuerte. La diferencia real está en la capa de sonrisas pequeñas, que es justo la que ha podado la E6 (§4.7).

## 3. Notas de la partida a ciegas (tal cual)

**Cómo jugué.** Chromium vía Playwright, ventana 960×600 (lienzo a ×3), `deviceScaleFactor` 1, ratón real (clics en coordenadas del lienzo). Texto a velocidad «Normal» (la de serie) todo el tiempo; no salté ninguna escena. Leí lo que salía en pantalla y, para no perder líneas, lo transcribí también desde `__game.log` (solo texto ya mostrado). Para apuntar a cosas que ya veía en pantalla usé `__game.objects()` / `invPos()` / `optionPos()` (coordenadas), y el «Ver objetos de la sala» (tecla H) del propio juego, que es una función para el jugador.

**Declaración de contaminación (honesta).** Al primer minuto, para saber qué exponía el juego, volqué una vez `__game.state()` y vi de refilón nombres de *flags*: `coma_bendecida`, `infografia_integrada`, `herminia_de_alta`, `album_validado`, `columna_kanban`, `custodia_regla`, `boli_muerto_cogido`, `rumor_teodoro_n`… No los usé para elegir nada, pero me anticiparon que habría una coma «bendecida», un álbum y una columna de kanban. No leí nunca qué respuesta era la correcta en un duelo ni en un menú; todas las elecciones de diálogo las hice leyendo la pantalla (y en dos casos me equivoqué, ver duelos).

**Ayudas del juego usadas: 3 llamadas a la abuela.**
1. Tras ~15 min atascado con FUENTE y FIRMA (el fax sin papel). Pista: «La tele de tu abuelo no iba si él la miraba. Apágale algo a alguien.» → me llevó al enchufe de la pantalla de métricas (CMS).
2. Seguía sin papel para el fax ni segunda fuente. Pista: «¿Has hecho la cuenta de gastos? Hazla mal. Te enseñan una buena.» → nota de gasto mal hecha → fotocopia de Gervasio (fuente) + copias rechazadas (papel del fax).
3. Acto III, sin saber qué hacer tras integrar a nadie: «Si de un armario sale papel, es que alguien escribe dentro, hijo.» → armario 27.

**Tiempo.** El reloj interno del juego marcó 134 min al llegar a la tarjeta final, pero incluye la sobrecarga de mi arnés (esperas, reinicios, capturas). Estimo **75–95 minutos** para un jugador curioso que lo mire todo con 2–3 pistas, y **50–60** para uno que vaya al grano. Ritmo: Acto I ~12 min, Acto II ~50 min, Acto III ~15 min + final ~4 min.

### Diario

- **Título y arranque (bien).** Portada de periódico con la fe de erratas del propio nombre: entra por los ojos. La llamada de la abuela («Eso es una bebida, hijo») presenta al personaje y la apuesta en 30 segundos. El «USUARIO NO CONSTA EN ORGANIGRAMA» y «Pues no te ha visto ni el torno» marcan el tono. Bien.
- **Vestíbulo / torno.** Primer puzle limpio y deducible: Celestino da chicle «para los nervios», Bruno dice «lo reservo… o para pegar algo», el organigrama tiene la casilla VACANTE. Chicle a la tarjeta, tarjeta a la casilla, torno: «BIENVENIDO, VACANTE». Me sonreí. Es el mejor puzle de apertura de las versiones que conozco del género amateur: enseña la lógica del juego (la burocracia se engaña con su propio formulario).
- **Celestino** narrando el Ibex como un partido es un hallazgo y no cansa porque sale poco y con variaciones («¡Ibersideral entra por la banda!»). Funciona luego como coro del edificio por la megafonía.
- **Redacción (pecera).** Sala larga con *scroll*, muy poblada. La escena de presentación (Íñigo, el Titulator, Plan Cero Papel, «Te tengo en la matriz, Vacante») plantea el conflicto rápido. Visualmente es lo mejor del juego.
- **Gertrudis la cafetera** es el primer momento que *provoqué y disfruté viendo*: saludarla dos veces la hace viral, suelta tres chismes que van a la libreta, y Yoli sube a 11.302 concurrentes; luego el «abrígate» de la abuela aparece en los comentarios. Me enteré de que podía insistir porque ella misma lo pide («Si me saludas otra vez, mejor. Que hay público»). Carcajada con «O SEA, QUE NO SABÉIS QUÉ HACER, PERO EN TABLA DINÁMICA».
- **Redacción de papel.** Aurora y Teodoro son la mejor pareja del juego. «No me ha vuelto a dirigir la palabra. Han sido treinta años muy buenos» (carcajada). «Con dos fuentes y media. La media dijo "yo no te he dicho nada"» (carcajada). La ficha HUECO / FUENTE / FIRMA es una estructura de tres pruebas clara, a lo *Monkey Island 1*, y la ficha se actualiza en el inventario: siempre sé qué me falta. Muy bien.
- **HUECO (Sala Amazonas).** El chiste de la reunión eterna está bien escenificado (orden del día, «Rogelio sigue una videollamada que ya ha acabado»). El puzle: «los becarios no tienen turno; pregunta la mesa y los conectados». Lo resolví volviendo a Gertrudis, que tenía una opción nueva «¿Y cuáles son los siguientes pasos?» → la tele de la sala sintoniza a Gertrudis → la pregunta llega «del público». Es bonito, pero la opción nueva en Gertrudis aparece sola: es medio deducción, medio *ir a ver qué ha cambiado*. Antes, la chaqueta de Ramírez sobre el Lector Medio (pista de Yoli: «que sea para dejarla en un sitio con más autoridad»; y el perchero: «encima de alguien que asiente, sí») es deducción de la buena, con un remate visual estupendo.
- **Duelo con Maripaz.** Interfaz de «RESPONDER A TODOS» con aciertos/fallos, «Asignado a: B. Pollejo». Es un juego de emparejar el tono de cada frase con la réplica de la libreta: la mitad de las veces la correspondencia es casi literal («reunión rápida» → «¿te va en marzo?»), la otra mitad es ambigua y fallé una. El remate con «[Usar objeto]» (la ficha sellada por Aurora) sí es juego: hay que entender quién «firma que es noticia». Duración justa.
- **Boli muerto / Custodia.** Bien escrito (la ventanilla sin cara, «¿Qué quiere.» con punto), y el remate «Ya ha firmado. Ya lo ha usado. Devuélvamelo… Para que sepa lo que se siente» es carcajada. El puzle en sí es de prueba y error (tres respuestas, sin coste).
- **Atasco serio: FUENTE y FIRMA.** Aquí el juego se me hizo largo. Sabía que necesitaba papel y dos fuentes; recorrí planta 2 (Marketing/Comercial, Eventos, Administración), miré todo, hablé con todos; nada encajaba. La primera pista me llevó al enchufe (CMS); la cadena enchufe → Anselmo → regleta R-3 de Sistemas está bien atada (el registro de tickets lo explica), pero yo no habría ido sin pista porque el CMS colgado no parecía *mi* problema. La segunda pista («hazla mal») es la clave de todo el acto y es contraintuitiva: lo natural es hacer bien la nota. Hice «Varios» (sello en la frente: carcajada) y «Importe cero» (aprobada: no da nada); solo el camino café → importe → sobre de azúcar → «enséñeme cómo es una nota bien hecha» da la fotocopia y las copias. Sin la abuela me habría quedado aquí. **Este es el punto débil de diseño del juego.**
- **Desplazamientos del Acto II.** Planta 2 → planta 1 → planta −1 → planta 1 → planta 2… El ascensor con submenú de salas (y el directorio) lo hacen llevadero, pero hay muchas idas y vueltas para entregar una frase (llevarle a Aurora la duda de Evaristo; volver a Begoña con la pieza). Se nota más porque varios recados son de *mensajería*: no piden pensar, piden caminar.
- **Evaristo y la coma.** Running gag de llamadas («¿Pellejo con jota o con ge?»; llama a la abuela para preguntar si «Remedios» lleva tilde) que paga a lo grande: la cláusula 12, «48,000» son 48 euros. El «Escúchele hasta el final» de Begoña convierte el chiste de *el pesado* en mecánica. De lo mejor.
- **Fax de Teodoro (FIRMA).** Mejor duelo del juego: la segunda ronda exige una respuesta de 38 caracteres y hay que elegir la versión corta de la réplica; la tercera se gana adjuntando la página 9 del manual (la respuesta automática), y Teodoro se emociona con su propio fuera-de-oficina. «...Lo ha escrito bien.» Momento redondo.
- **La pieza y el 26 %.** Herminia mide la pieza (31 líneas, sobra un 26 %) y el cartel de Administración dice «recorte estándar 26 %». Llevarla a Begoña es deducción limpia, y el «Recortado.» cortándole la frase a Bruno es callback perfecto.
- **Minijuego del titulador** (monitor de Yoli). Lo jugué 3 sesiones (13 titulares). Tiene meta («LA CASA: 225.000 · TÚ: …»; mi récord quedó en 260.000 y el final lo recoge: «Tus persianas: un millón cien mil»). Me reí con varios titulares. Ver sección 4.
- **Acto III.** Armario 27: «Alguien deja de teclear. Y vuelve a teclear más bajito» (carcajada). Brais hablando en titulares y Bruno contagiándose («UN BECARIO VIVE EN UN ARMARIO. EL 4 TE SORPRENDERÁ» — «Mejor.») es muy bueno. «Fuentes Próximas» cierra el misterio del fax de F.P. La alta de Herminia «herramienta» (40 segundos) frente a Brais (ticket de julio) es la tesis del juego, y Eutimio la dice en voz alta («Esta casa da de alta antes a un portátil que a un chaval»): sobra la frase. El kanban: tres columnas inventadas y DESCOPEADO, que estaba sembrado en el móvil de Borja en Eventos («Descopear. Quitar algo sin que se note»). Bien sembrado, deducible.
- **Escena de Anselmo tras el kanban**: confusa. Integra a Herminia, luego revoca al Titulator, luego Herminia vuelve a «propietaria: Infografía», «Lo miro en la próxima versión»; Leoncio lo explica («Integró una IA que era un becario. Y rechaza una IA que es una IA»). Tuve que leerlo dos veces para entender quién estaba dentro y quién fuera.
- **Clímax (Reunión de Dirección).** Duelo de Gervasio para conseguir el acta (bien: la fotocopia de la comida con Hidrovoltia se reutiliza) y duelo final con Íñigo: ticket nº 1 («Hola. Soy la inversión.» — carcajada), réplicas, acta, y el correo de Evaristo en «el momento oportuno», justo cuando Íñigo dice «es un detalle sin importancia». Fallé una ronda por precipitarme. **Tras el clímax** el juego me deja en control con el Lector Medio iluminado en el centro; ¿se entiende qué hacer? Sí, gracias a tres cosas: el foco, Celestino por megafonía («¡El cartón se tambalea y nadie lo toca!») y que en el Acto II el Lector Medio ya decía «Todavía no. Si se cae, se cae todo». Empujarlo es el momento que provocas y disfrutas: «¡Penalti clarísimo!», «¿Y quién ha validado la fase 1?».
- **Final.** Sábado 6:00, Íñigo resulta ser el becario de marzo del 98 (el pósit amarillísimo del kanban: sembrado desde el principio; me encantó), Celestino «Ya te ve hasta el torno», la plaza 1 de Teodoro por fax («No tengo coche.» «Ni bici.»), y la abuela: **«El papel lo dejé en 2011, que me manchaba el sofá»**. Carcajada y nudo en la garganta a la vez: el «abrígate» de toda la partida era ella leyéndole en la web. «Abrígate tú.» Tarjeta «Lamentamos el acierto». Es un final de verdad, con giro y emoción. Lo mejor del juego.

### Recuentos honestos

- **Carcajadas: 11.** (1) «Lo leímos todos. Por eso no contestó nadie». (2) «O sea, que no sabéis qué hacer, pero en tabla dinámica». (3) «Con dos fuentes y media…». (4) «Han sido treinta años muy buenos». (5) Begoña recortando la pregunta de Bruno a media frase («Lo que venía después era la conclusión. No la lee nadie»). (6) Custodia: «Para que sepa lo que se siente». (7) «Puestas. Ahora se ve perfectamente que no hay carretera». (8) «Alguien deja de teclear. Y vuelve a teclear más bajito». (9) «Una IA que come a las dos y va once veces al baño». (10) «Hola. Soy la inversión.» / «Es más barato, pero se nota». (11) La abuela y el sofá.
- **Sonrisas: ~45** (muchas en descripciones de objetos: «Galeradas colgadas como jamones», «Taza con costra de café de la crisis de la deuda», «Las manos están enfadadas», «Lleva años esperando un sustantivo», «Es mi zona horaria», «Esto. Ya lo has consumido. Son doce euros», «Recorto la distancia entre las personas y la puerta», «RECHAZADO en la frente. Mi primer documento oficial», «Tickets: el CMS ya va», «¿Qué es una IA? ¿Un taxi?»…).
- Densidad: con ~85 min de juego, una carcajada cada ~8 min y una sonrisa cada ~2 min. La densidad es alta en Acto I y en el tramo final; baja en el ecuador del Acto II (planta 2), donde hay muchas descripciones correctas que no hacen reír.

### Lo que me aburrió

- Los paseos del Acto II llevando recados (Evaristo → Aurora → Evaristo no; Aurora → ordenador → Begoña → Teodoro).
- La planta 2 en conjunto (Marketing/Comercial): Maripaz tiene buenas líneas, pero la sala es un escaparate de objetos con descripción y poca acción; los pufs, el embudo, la pizarra, el lema… cada uno un chiste de una línea del mismo corte.
- Repasar opciones de diálogo que se repiten igual (Pilar «¿Cuántas sillas hay?» se queda en el menú y repite la misma frase infinitamente).

### Líneas que chirrían

- «Esta casa da de alta antes a un portátil que a un chaval» (Eutimio): la tesis dicha en voz alta justo después de que la escena la ha mostrado.
- «Integró una IA que era un becario. Y rechaza una IA que es una IA» (Leoncio): explica el chiste y además lo necesitas porque la escena es confusa.
- «Abre interrogación y cierra con punto. Eso no es una pregunta, criatura. Es una sentencia» (Aurora explicando la puntuación de Custodia, que ya se veía).
- «Y en nuestros corazones, Brais está en HECHO» (Anselmo): no le pega al personaje.
- «La cuenta de siempre» (Yoli, sobre el «abrígate»): adelanta el giro final; mejor no subrayarlo.
- «Él cree que avanza. El Lector Medio cree que asiente» (Bruno, en la reunión): explicación de lo que estamos viendo.
- Leoncio repite «Cuatro décimas. Yo tardaba una semana» dos veces en pocos minutos.

### Fórmulas que noté repetidas (a ciegas)

- **«…ya es de la plantilla / lleva más tiempo en plantilla»**: la planta de plástico, el foco que parpadea, el bigote de los jefes, el Libro de Estilo («más grueso que la plantilla fija»). Cuatro veces el mismo chiste.
- **«X se fue a las seis. Y no.»**: el móvil de Borja («Borja se fue a las seis. El móvil no»), el portátil de Tadeo («Se fue a las seis. Su portátil, no»), las chaquetas de Infografía («se fueron a las seis y media; la chaqueta ficha por ellos»).
- **Fechas como remate** («desde el Mundial del 82», «desde 2019», «desde la cena de Navidad», «en 1989», «en 1996», «del 97», «marzo del 98», «desde julio»…): no molesta una a una, pero es el recurso por defecto.
- **«…con rencor»** (Gertrudis: «PRECALENTANDO RENCOR», «wifi y rencor», «anotado con rencor»): es su firma, está bien, pero el tablero de la tele lo cita también.
- **Muletillas de personaje** (asumidas, funcionan): «criatura» (Aurora), «cariño» (Maripaz), «Era solo eso» (Evaristo), «¿De dónde viene? / de la casa» (Anselmo), «Lo pongo en azul / Siguiente» (Íñigo), «cinco minutos» (Pilar), «Lo hablamos» (Gervasio).
- **«En otra empresa esto sería un máster»** cada vez que miras la libreta.

### Fallos encontrados a ciegas

1. **Tras adjuntar un objeto en un duelo, la barra de acción se queda con «Usar <objeto>» pendiente** (vi «Usar ficha de la página 7» y «Usar correo de Evaristo»). Reproducción: en el duelo de Maripaz, elige «[Usar objeto]», haz clic en la ficha; acabada la escena la línea de acción sigue diciendo «Usar ficha de la página 7». Leve.
2. **Mirar el banco de espera de Administración responde «Hueco, fuente y firma. Lo pone la ficha.»** Reproducción: planta 2 → Administración → Mirar → banco de espera. Parece un texto genérico de reserva mal asignado. Leve.
3. **Pilar repite «¿Cuántas sillas hay?» indefinidamente** con la misma respuesta («Las cuento cada cinco minutos. Por si se van»). No es un error de código, pero tras la segunda vez debería salir del menú o variar. Leve.
4. **«Cómo se juega»**: línea partida «llamar a la abuela, / que da pistas, o leer el correo» con salto feo; y contradicción: «Clic derecho (o pulsación larga): la acción más obvia» frente a «Toque largo: ver objetos». En móvil comprobé que las dos cosas ocurren según dónde pulses (sobre objeto: acción; sobre suelo: etiquetas). Leve, de texto.
5. **Evaristo**: elegir «¿Falta mucho?» cierra la conversación entera en vez de volver al menú. Leve.
6. Dos veces un clic en una opción de diálogo no se registró a la primera (correo del móvil, menú de Evaristo). No lo pude reproducir a voluntad; puede ser mi arnés (opciones mostradas mientras aún terminaba una línea). Sin confirmar.

### Móvil en horizontal (844×390, táctil)

Jugué el arranque con toques: nueva partida, Celestino, chicle, tarjeta, organigrama, torno. Todo responde. El lienzo se escala a ~×1,95 con bandas laterales; el texto de diálogo usa un cuerpo mayor y muestra 4 opciones con flechas de desplazamiento (en escritorio, 5). Legible. El toque largo sobre el suelo muestra las etiquetas de la sala (útil; en el vestíbulo se amontonan mucho). Sin fallos.

### Veredicto en caliente

Un juego que ya es divertido de verdad, con un final excelente y tres o cuatro escenas memorables (Gertrudis viral, Teodoro y su fuera-de-oficina, la coma de Evaristo, Brais en el armario, la abuela). Su gran problema es el centro del Acto II: la pista clave («haz mal la nota de gasto») es contraintuitiva y está escondida, y alrededor hay demasiados recados de ida y vuelta. Los duelos funcionan cuando piden algo más que emparejar frases (38 caracteres, adjuntar la respuesta automática, adjuntar la ficha); el resto de rondas son emparejar por palabra clave.

---

> **Aclaraciones de la fase 2 sobre las notas a ciegas.** No toco el texto de arriba; solo lo matizo.
>
> - **Fallo 2 («Mirar el banco» → «Hueco, fuente y firma»). No es fallo:** es «Mirar a Bruno». El banco de espera no tiene hotspot (`administracion.js:104`, `hotspot: false`) y, tras el paseo, Bruno quedó bajo el cursor. La línea es su meta del momento (`pistas.js:23`). Eso sí: a ciegas **no supe que existía «Mirar a Bruno»**, y «Cómo se juega» no lo menciona (`game.js:348-357`). La mejor brújula del juego está escondida.
> - **Fallo 5 («¿Falta mucho?» corta la conversación). Es intencionado**, pero lo ha empeorado la poda: la E6 (B9) quitó «Le he mirado el reloj y se ha dado cuenta.» y dejó solo una animación `reach` de 400 ms (`administracion.dialogos.js:188-193`). A 320×200 el gesto no se lee, así que el corte parece un error. Lo trato en §4.7.
> - **Fallo 3 (Pilar y las sillas).** Es la sala de Eventos, protegida por decisión del dueño. Lo dejo como observación, no como cambio.
> - **Columna del kanban.** Escribí DESCOPEADO porque había oído «descopear» al móvil de Borja (`pecera.dialogos.js:231`, `oyo_descopear`). La columna de diseño de E5/E6 es SALIDA EN VALOR (`rep_13`), que no se me ofreció porque no tenía esa réplica. Hay dos soluciones válidas y las dos son deducción.
> - **Contaminación por los nombres de *flags*.** Confirmo que no me sirvió para nada concreto: la coma «bendecida» la entendí cuando Evaristo pidió «una segunda opinión».
> - **Lo que no vi:** el corte «MIENTRAS, EN LA REDACCIÓN» (E6 §2.1). Fui por el enchufe, así que vi el apagón «de verdad» y oí a Yoli. Tampoco vi el árbol nuevo de la tele (§2.3), porque probé Usar y no Hablar (§5).
> - **Consola:** cero mensajes de consola o de página en toda la partida y en el tramo de móvil. Mi controlador solo escribe fichero si llega alguno, y no llegó ninguno.

---

## 4. Comedia

### 4.1 Densidad de risa medida

| Medida | C3 | C4 | C5 | **C6** |
|---|---|---|---|---|
| Carcajadas a ciegas | 10 en ~110 min | 14 en ~110 min | 22 en ~120 min (con «suaves») | **11 en ~85 min** (1 cada ~8 min), con un criterio más estricto |
| Sonrisas | ≈1/min | 56 fuertes + ≈80 leves | ≈60 fuertes | **≈45** (1 cada ~2 min) |
| Momentos que provoca el jugador y disfruta viendo | 2 | 2 | 6 | **6**: Gertrudis viral, Gertrudis en la tele y la estampida, el atasco («¿Necesitan ayuda?» y el empujoncito), el fuera-de-oficina en bucle de Teodoro, la columna del kanban, el penalti al Lector Medio. Más el titulador como juguete |
| Atasco a ciegas | 20 min | 3 min | 6 min, 2 pistas | **~15 min, 2 pistas** (CMS y nota de gasto) + 1 pista en el armario |

**Dónde está la risa.** Acto I (vestíbulo, Gertrudis, Aurora) y el último cuarto de hora (armario, reunión, epílogo) concentran ocho de mis once carcajadas. En el ecuador del Acto II (planta 2 y Sistemas antes de la regleta) pasé unos 20 minutos con sonrisas sueltas y ninguna carcajada. Ahí es donde la poda más se nota, porque ese tramo vive de descripciones de objetos.

### 4.2 Los diez mejores momentos

1. **El fax de Teodoro, ahora con «que quepa».** El tercer asalto pide contestar en 38 caracteres. La réplica larga se corta («NO CABE»), la corta gana «…CABE.», y el remate es su propia respuesta automática en bucle: «…ES LO MÁS BONITO QUE ME HAN ESCRITO EN VEINTINUEVE AÑOS.» / «BRUNO PELLEJO. TRECE CON ESPACIOS. CABE.» / «…Lo ha escrito bien.». Es el mejor duelo y el mejor momento emotivo antes del final. [J] `img/04_redaccion_papel.png`
2. **La abuela: «El papel lo dejé en 2011, que me manchaba el sofá.»** → «Abrígate tú.» → «¡Me ha contestado el periódico!». Y la tarjeta: «Lamentamos el acierto.». [J] `img/12_tarjeta_final.png`
3. **La coma de Evaristo.** Un pesado que llama por la jota de Pellejo y a la abuela por la tilde de Remedios resulta tener la clave del clímax: «48,000» son cuarenta y ocho euros. «Una coma también lo era. Hasta que alguien la firmó.» [J]
4. **Gertrudis viral.** Saludar dos veces a la cafetera la pone «de perfil», en directo, con chismes que van a la libreta («O SEA, QUE NO SABÉIS QUÉ HACER, PERO EN TABLA DINÁMICA»). Luego sale en el titulador y en los comentarios aparece «abrígate». [J] `img/03_vending_hotspots.png`
5. **Brais en el armario.** «¿Hola? …Alguien deja de teclear. Y vuelve a teclear más bajito.». Después, «UN BECARIO VIVE EN UN ARMARIO. EL 4 TE SORPRENDERÁ» / «Mejor.» / «…Ya hablo como tú.». [J]
6. **«—Hola. Soy la inversión. —…Eso es una alucinación. —No. Es un becario. Es más barato, pero se nota.»** [J]
7. **Custodia: «Firme aquí que se lo lleva. … Ya ha firmado. Ya lo ha usado. Devuélvamelo. —…¿Y para qué me lo ha dado? —Para que sepa lo que se siente.»** [J]
8. **Begoña recorta.** Corta la pregunta de Bruno a media frase («Lo que venía después era la conclusión. No la lee nadie.») y luego la pieza a media palabra («…por qué la opa es import… —Recortado.»). El mismo gag dos veces, con forma de interfaz. [J]
9. **El titulador: «Si la hipoteca hace esto, no te quiere», «Los expertos piden purgar el PIB antes de encender la calefacción», «Tráfico avisa: si ves la deuda pública en la carretera, reduce la velocidad».** [J] `img/08_titulador_sesion2.png`
10. **Íñigo era el becario de marzo del 98.** Paga el pósit amarillísimo del kanban que se ve en el minuto 15: «Yo no fui becario. Fui un perfil junior con mucho recorrido.» / «Yo no voy a hacer eso.» / «Eso dije yo. Con esas palabras.» [J]

Menciones: «Han sido treinta años muy buenos», «Con dos fuentes y media…», «Puestas. Ahora se ve perfectamente que no hay carretera», «Una IA que come a las dos y va once veces al baño», «BIENVENIDO, VACANTE», «Esto. Ya lo has consumido. Son doce euros», «Una anónima y otra con IVA. Me vale», «No tengo coche. —Ni bici.».

### 4.3 Las diez peores líneas o momentos

1. **El nudo del Acto II se oye poco.** No es una línea sino un silencio: entre que Aurora da la ficha y la primera pista de la abuela, nadie en la planta 2 ni en Sistemas te empuja hacia la nota de gasto. Al darle el sobre de azúcar a Begoña, contesta «Sin nota de gasto, esto es azúcar.» y pasa a hablar de su horario. Es la frase que debería abrir la puerta y la cierra. [J+C]
2. **«Esta casa da de alta antes a un portátil que a un chaval.»** (Eutimio, `cpd.js`). Es la tesis del juego dicha en voz alta justo después de mostrarla con los 40 segundos frente al ticket de julio. Brais la salva («¿CUARENTA SEGUNDOS? …Perdón. Yo también soy herramienta.»), pero sobra. [J+C]
3. **La escena de Anselmo tras el kanban** (`pecera.escenas.js`): integra, revoca, «Nos hemos quedado sin IA de la casa», Herminia vuelve a «propietaria: Infografía», «Lo miro en la próxima versión», y Leoncio lo traduce: «Integró una IA que era un becario. Y rechaza una IA que es una IA.». Es el único momento del juego que tuve que releer. Y además mete «Y en nuestros corazones, Brais está en HECHO», que no es de Anselmo. [J]
4. **«Abre interrogación y cierra con punto. Eso no es una pregunta, criatura. Es una sentencia.»** El chiste de Custodia se ve en pantalla en cada línea suya. Que Aurora lo explique le quita la gracia de descubrirlo (la crítica 5 lo celebró; yo, que ya lo había visto, no). [J]
5. **«Él cree que avanza. El Lector Medio cree que asiente.»** (Bruno en la reunión). Narra lo que se ve en el proyector. [J]
6. **«¿Falta mucho?» → «Si tiene prisa, se lo pongo por escrito.» y fin de la conversación.** Sin la línea podada y con un gesto ilegible, parece un error (§4.7). [J+C]
7. **«…ya es de la plantilla»** cinco veces: la planta de plástico, el buzón («por eso sigue en plantilla»), el foco, el bigote y el Libro de Estilo. [J+C]
8. **«X se fue a las seis (y media). Y no.»** seis veces: el móvil de Borja, el portátil de Tadeo, las chaquetas de Infografía, el departamento de Leoncio, los tuppers del microondas y los tickets de Eutimio. [J+C]
9. **Leoncio: «Cuatro décimas. Yo tardaba una semana.»** dos veces en dos minutos, la segunda con «Qué semanas aquellas». [J]
10. **«La cuenta de siempre»** (Yoli, sobre el «abrígate»). Subraya la pista del giro final; sin esa coletilla, el «abrígate» sería más misterioso. Se podó «Me han mirado», pero esta se quedó. [J]

### 4.4 Personaje por personaje

| Personaje | Funciona | No funciona |
|---|---|---|
| **Bruno** | Voz seca. Explica bastante menos que en la crítica 5 (se fueron 9 líneas). «…Ya hablo como tú.» y «…Lo ha escrito bien.» | Le quedan dos o tres narraciones («Él cree que avanza…»). Su mejor herramienta, «Mirar a Bruno», no se enseña |
| **Abuela** | Las tres pistas que pedí eran de nivel 1, con chiste y eficaces. Evaristo la llama por la tilde. El final | — |
| **Celestino** | Locutor del Ibex, megafonía útil tras el clímax («¡El cartón se tambalea!»), «Ya te ve hasta el torno» | «¡Golazo de papel!» y «¡Eso es opa, árbitro!» son relleno |
| **Íñigo** | «Recorto la distancia entre las personas y la puerta», «Y algo de atún», la revelación del 98 | Arranque de consultor de manual («Siguiente» ×4) |
| **Yoli** | El titulador y sus comentarios («Tres otra vez. Ya nos conocemos los tres.»). La lectora de 47 minutos | La poda le quitó sus dos mejores segundos golpes («Ayuda bastante.», «Tienen horario.») |
| **Anselmo** (director de Desarrollo) | «¿De dónde viene?» como lógica de puzle. «Se nota en el trazo» | Escena post-kanban confusa (peores, 3) |
| **Coro de Desarrollo** | «Las manos están enfadadas», «¡Ha sido Diseño! / He sido yo. Pero gracias», «Hemos sido nosotros. —No lo repitas.» | — |
| **Leoncio + Herminia** | «Ni a ella. Es muy sensible a los datos.», «Una IA que come a las dos…». Herminia como objeto con log | Tiene que explicar a Anselmo (peores, 3) |
| **Custodia** | «¿Qué quiere.», el boli que se devuelve, «pregúnteme dónde está la gente» | Su chiste se explica (peores, 4) |
| **Gertrudis** | El mejor objeto-personaje. Los errores E-xx, «E-00: DE NADA. ESO TAMBIÉN SE DICE.» | — |
| **Aurora** | La mejor escrita | «criatura» ×6 (tope cumplido); una explicación de más |
| **Teodoro** | El fax, la Goyita, el duelo de los 38 caracteres | — |
| **Gervasio** | Frases sin acabar; «Se comió. Pero no se habló. Bueno. Se habló un poco.» | Su duelo sigue siendo de dos asaltos y sin mecánica propia |
| **Mercados** | Nombres y rasgo; el atasco ya se ve y se juega | — |
| **Maripaz** (directora de Comercial) | Gira entera alrededor del inventario: interstitial, la X de un píxel, el gong, el rotulador «lo cobro como espacio», el banner en la espalda de Bruno. Su duelo tiene el mejor remate de objeto (la ficha sellada) | «cariño» ×11 (fuera de Eventos), en tope |
| **Begoña** | Puzle de diálogo, recorte, «Me has hecho daño», «¿Qué es una IA? ¿Un taxi?» | Su «Sin nota de gasto, esto es azúcar» no orienta (peores, 1) |
| **Evaristo** | La mejor idea del guion. Las llamadas ya no cansan («Era solo eso» ×5, en tope) | — |
| **Eutimio** | «Has dejado de merecerlo», «Me entero de todo. No arreglo nada», los tickets | Dice la tesis (peores, 2) |
| **Brais** | Voz de titular con ternura; «Hola. Soy la inversión.»; «¿Con táper?» | — |
| **Pilar / Eventos** | (Sala protegida.) «Es mi zona horaria», «¡Vuelvo a ser persona!» | — |
| **Valentín** | Cameo mudo con globo «…» | Sigue sin leerse como gesto a esta resolución, pero es decisión del dueño y ya no parece un error |

Los nombres **Eutimio** y **Brais** (decisión del dueño) funcionan: Eutimio es de la quinta de Celestino y Evaristo, y Brais, nombre de chaval de ahora, recupera el contraste generacional que Zacarías había perdido. Los ids internos siguen siendo `paco_ticket` y `ruben` (cosmético, no se ve).

### 4.5 Fórmulas repetidas (recuento propio)

Extractor propio (3.550 cadenas de `content/`, sin `art/`, `flags.js` ni `music.js`, sin comentarios), con expresiones mías e independiente del auditor. El auditor da **E6: OK**: 514 de 3.558 cadenas (14,4 %) acaban en remate seco y ninguna sala pasa del 22 % [T]. Mi expresión, más estricta, da **505 / 3.550 = 14,2 %**. Las cifras coinciden: el molde ha bajado de verdad (crítica 5: 21,8 %).

| Fórmula | C5 | **C6** | Lectura |
|---|---:|---:|---|
| Remate seco (última frase de 1-3 palabras) | 21,8 % | **14,2 %** | Bajada real |
| Año 19xx/20xx | 66 | **31** | Resuelto |
| «táper» | 33 | **17** | Resuelto (y ahora paga) |
| «Huele a 2019» | 2 | **1** | Resuelto |
| «Era solo eso» / «Una cosita» | 9 / 8 | **7 / 8** | El auditor cuenta 5 oídas; bien |
| «criatura» / «cariño» (sin Ev.) / «chaval» | 6 / 14 / 11 | **6 / 11 / 10** | En tope |
| «Siguiente» (Íñigo) | 8 | **4** | Resuelto |
| «Perdón/Perdone» | 20 | **15** | Baja |
| «…» al empezar (pausa dramática) | 56 | **46** | Baja algo; sigue siendo muletilla |
| «de fuera» / «de la casa» | 17 / 18 | **17 / 16** | Lógica de Anselmo; fuera de él, sobra |

**Tics nuevos o que la poda no vio:**

| Tic | Recuento | Ejemplos |
|---|---:|---|
| **Final «…, por X.»** (lo crea la fusión) | **11** | «…se abre la siguiente, por reglamento.», «…suena más bajito, por respeto.», «…mirándola, por respeto.», «…el papeleo, por procedimiento.», «…a las 19:15, por principios.», «…del Titulator, por curiosidad.». Es el antiguo «. Por respeto.» con coma: el remate sigue ahí, pero ya no golpea |
| **«…ya es / sigue en / lleva más tiempo en plantilla»** | **5** | Planta de plástico, buzón, foco de Eventos, bigote, Libro de Estilo |
| **«Se fue(ron) a las seis (y media). Y no.»** | **6** | Borja, Tadeo, chaquetas, Leoncio, tuppers, tickets |
| **Fusión con dos puntos «X: Y.»** | 117 cadenas | Muchas son buenas, pero 30-40 vienen de la E6 y le quitan el aire a una pausa que era el chiste («Cinta de carrocero en el suelo: la frontera de Desarrollo, recta de momento.») |
| **«cinco minutos»** | 23 | Casi todo Eventos (protegido) y es su gag; fuera de Eventos, 5 |

**Lectura.** La E6 ha hecho lo que pedía la crítica 5 en las cifras, y **el molde de cierre ya no se oye como molde**. Pero ha sido una poda más que un cambio de forma: el peso del «. Por X.» ha pasado a «, por X.» y el de muchos remates a nada. Las formas nuevas que pedían las críticas 4 y 5 (interrupción, acción, tercero que contesta) aparecen en los sitios de siempre: Begoña, el fax, el atasco. En la capa de descripciones no han entrado.

### 4.6 El minijuego del titulador

Tres sesiones a ciegas, **13 publicaciones**. Diez titulares que me salieron, con su cifra:

1. «Hidrovoltia lanza una opa sobre Banco Robledal.» → 3. «Tres otra vez. Ya nos conocemos los tres.» *Sonrisa.*
2. «Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las…» → **260.000, PICO DE LA NOCHE**. Bate a la casa. *Sonrisa.*
3. «Comí los mejillones de lata todos los días durante un mes y esto pasó» → 140.400, «LE PASÓ A ALGUIEN». *Sonrisa.*
4. «El pueblo de España que regala Hacienda si te empadronas antes de diciembre» → 24.000, «ANTES DE LAS OCHO (SON LAS 20:59)». *Sonrisa* (por la etiqueta).
5. «El truco de la bola de papel de aluminio para el Euríbor» → 20.400, «TRUCO DE TODA LA VIDA». *Sonrisa.*
6. «Por qué los analistas guardan el Ibex 35 en la nevera» → 76, «SECCIÓN DE ECONOMÍA». *Sonrisa.*
7. «Si la hipoteca hace esto, no te quiere» → 48.600, «ECONOMÍA, SECCIÓN CORAZÓN». ***Carcajada.***
8. «Tráfico avisa: si ves la deuda pública en la carretera, reduce la velocidad» → 2.460. ***Carcajada.***
9. «Los expertos piden purgar el PIB antes de encender la calefacción» → 1.600. ***Carcajada.***
10. «Qué significa soñar con las persianas, según la psicología: es señal de…» → 170.000, «LOS PUNTOS TRABAJAN». *Sonrisa.*

(Y además «Confirmado: la nómina se puede meter en el microondas si…», «Los meteorólogos ponen fecha a la llegada de la opa…: será el…» → 140, «SOLO LOS DE HIDROVOLTIA», y «Los cocineros coinciden: los mejillones de lata no se cocinan.» → 4.860, «DICHO. NADIE ENTRA».)

**Juicio.** Es un buen juguete y ya **tiene meta**. El pie «LA CASA: 225.000 · TÚ: 260.000» en oro dice si lo has hecho bien, la quinta publicación se lee y el epílogo recoge el récord («Tus persianas: un millón cien mil»). Me reí tres veces y sonreí en casi todas. Tiene dos pegas:

1. **La meta se bate a la primera.** Batí a la casa en mi segunda publicación de la primera sesión, sin saber la ley. Después no hay escalón siguiente: ni récord del redactor de Bolsa ni nada que perseguir. Le añadiría un segundo listón «secreto» (el de las siete), que Yoli anuncia al batir la casa.
2. **La regla se aprende en una sesión** (persianas o mejillones con gancho que corta). Rejugable dos o tres sesiones; para un opcional, la medida justa.

### 4.7 ¿La poda ha aplanado la comedia o la ha mejorado?

He comparado **33 líneas** de `docs/guion2/e6/tabla.md` (texto anterior frente al actual, leídas en su contexto en `content/`) y he mirado `tumbadas.md` para ver lo que se salvó.

| Fila | Antes | Ahora | Juicio |
|---|---|---|---|
| E099 | «La frase con la que Íñigo despide a la gente acaba de liberar a Brais.» | (fuera) | **Mejora** |
| E120 | «Armario 27. Atún. Baño. Eso no es un modelo. Eso es un compañero.» | (fuera) | **Mejora**: el armario llega como sorpresa |
| E217 | «Sin papel no habla. Qué paz.» | «Sin papel no habla. Es su mejor época.» | **Mejora** (me reí) |
| E224 | «Galeradas colgadas como jamones. Curadas en tinta.» | «Galeradas colgadas como jamones.» | **Mejora** |
| E230 | «…está enmarcado. Más contraste, imposible.» | «…está enmarcado.» | **Mejora** |
| E132 | «Por un segundo te he respetado. Ha sido raro. Bonito, pero raro.» | «Por un segundo te he respetado.» | **Mejora** |
| E023 | «Treinta años en este mostrador. El mostrador, cuarenta. Tiene peor rodilla.» | «…y el mostrador tiene peor rodilla que yo.» | **Mejora** |
| E028 | «Consto en la web. 4.112 veces.» | (fuera) | **Mejora** |
| E022 | «El cuadro calla. Sabe cosas.» | «El cuadro calla.» | Neutra |
| E032 | «Caducada en 2019. Sigue ahí. La admiro.» | «Lleva años a punto de caer.» | Neutra |
| E045 | «Doblo la apuesta. Sigue sin constar.» | «En la cuota pone «no consta».» | Neutra |
| E071 | «Me emociono un poco. No estoy acostumbrado.» | «No estoy acostumbrado a eso.» | Neutra |
| E197 | «Tentador. No.» | «Tentador.» | Neutra |
| E276 | «Cuarenta y ocho mil. Con coma. Esa coma la conozco.» | (fuera) | Neutra |
| E100 | «Y la escribí yo. SEGUIREMOS INFORMANDO. Perdón.» | «SEGUIREMOS INFORMANDO.» | Neutra |
| E323 | «…Bien centrado. Begoña tiene pulso.» | «…Bien centrado.» | Neutra |
| X3 | «Me entero de todo. No arreglo nada. Es el equilibrio.» | sin el tercero | Neutra |
| E075 | «…café de la crisis de la deuda. Debería cotizar.» | sin «Debería cotizar» | **Aplana** (leve) |
| E042 | «Ha echado raíces. Disruptivas.» | «ha echado raíces en el escurridor» | **Aplana** |
| E033 | «Las pipas se asoman y se quedan colgando. Las animo. Nada.» | sin «Las animo. Nada.» | **Aplana** |
| E046 | «Tiene pantalla y carácter. Lo segundo, más.» | sin «Lo segundo, más.» | **Aplana** (leve) |
| E017 | «La ranura la escupe. Polvo y principios.» | sin «Polvo y principios.» | **Aplana** |
| E024 | «Hoy tres me han preguntado por mi salud. Con mucho interés. Estoy de miedo.» | «…por mi salud, con mucho interés.» | **Aplana**: sin el giro no queda chiste |
| E057 | «NO SE ADMITEN DEVOLUCIONES. NI SENTIMIENTOS.» | «NO SE ADMITEN DEVOLUCIONES.» | **Aplana**: era la voz de Gertrudis |
| E094 | «Me lo ha puesto en barras. Suben.» | sin «Suben.» | **Aplana**: «Suben» era el chiste (Bruno, por fin, en positivo) |
| E152 | «Mi segunda acta. Ya tengo archivo.» | sin «Ya tengo archivo.» | **Aplana** (leve) |
| E268 | «Siempre al fondo. Es mi encuadre.» | sin «Es mi encuadre.» | **Aplana** |
| E286 | «Se borra solo. Por vergüenza.» | sin «Por vergüenza.» | **Aplana** |
| E312 | «Once notas bien hechas en cuarenta años. Una por cuatrienio.» | sin el remate | **Aplana** (leve) |
| X8 | «Es que lo escribí yo. Ayuda bastante.» | «Es que lo escribí yo.» | **Aplana**: la crítica 5 la puso entre lo mejor de Yoli |
| X10 | «Busco "el Contable" y salen gestorías. Nos ganan. Tienen horario.» | sin «Nos ganan. Tienen horario.» | **Aplana**: «Tienen horario» era el golpe |
| E326 | «Le he mirado el reloj y se ha dado cuenta.» | (fuera; gesto de 400 ms) | **Aplana y confunde**: a ciegas lo apunté como fallo |
| E313 | «Yo cierro a las 19:15. Por principios.» | «…, por principios.» | Neutra (pero alimenta el tic «, por X.») |

**Saldo: 8 mejoras, 10 neutras y 15 que aplanan** (4 claramente: E024, X8, X10 y E326). Las mejoras están casi todas donde las pedía la crítica 5: Bruno y los remates que explicaban. Lo que aplana está en la capa de descripciones y en los segundos golpes de personaje (Yoli, Gertrudis, Celestino). Allí la regla «un solo golpe» se aplicó como si todo segundo golpe fuera coletilla, y muchos eran el chiste: el primer golpe preparaba y el segundo giraba.

**Juicio.** No ha aplanado la comedia del juego: los picos están intactos, la tabla de tumbadas salvó lo más valioso (E016 «Es un comité», E034 «Se lo piensa. Se queda.», E140 Custodia…) y el texto se lee más limpio. **Sí ha aplanado su textura.** Calculo que entre 30 y 50 sonrisas de la capa de exploración se han perdido, y eso explica buena parte de mis ~45 sonrisas frente a las ~60 de la crítica 5. La corrección no es volver atrás. Es repasar las ~120 filas «M R / A R» que solo «quitan» y devolver el segundo golpe cuando ese golpe *gira* la frase en lugar de comentarla (lista de partida en §8, cambio 2).

---

## 5. Puzles

### 5.1 Uno por uno (a ciegas)

| # | Puzle | ¿Deducción u obediencia? | Justicia | Mi atasco |
|---|---|---|---|---|
| 1 | Torno: chicle → tarjeta → casilla VACANTE → torno | Deducción guiada | Justo | No |
| 2 | Chaqueta → (perchero orienta) → Lector Medio → silla libre | Deducción guiada | Muy justo | No |
| 3 | Café: saludar a Gertrudis (dos veces para los chismes) | Obediencia (Celestino) + descubrimiento | Justo | No |
| 4 | Café → Aurora → ficha | Obediencia (cartel) | Justo | No |
| 5 | Reunión: «los conectados» → Gertrudis → tele | Deducción lateral | Justo | ~5 min, sobre todo en paseos |
| 6 | Atasco de Mercados (anunciado) | Ahora sí se ve como jugable: «¿Necesitan ayuda?» invita y empujar es natural | Justo | No |
| 7 | Duelo de Maripaz + ficha | Emparejar + remate de objeto bueno | Justo | Fallé 1 |
| 8 | Boli muerto → Custodia → «para apuntar» | Prueba y error (3 opciones, sin coste) | Justo | No |
| 9 | **CMS**: enchufe → Anselmo «que te la apague Eutimio» → registro → R-3 | Deducción, una vez sabes que el CMS es *tu* problema | Justo en la cadena, **débil en la entrada**: solo lo dice una nota al margen de la ficha | **Sí: pista 1** |
| 10 | **Nota de gasto «mal hecha»** (café → 1,40 € → sobre → «enséñeme una bien hecha») → fotocopia + copias | Exploración de árbol; la pista del mundo («casi un ticket de gasto») existe, pero Dar el sobre a Begoña no reconduce | **Lo más injusto del juego**: hay cuatro intentos naturales que fallan en silencio | **Sí: pista 2** |
| 11 | Copias rechazadas como papel de fax | Deducción (la mejor conexión entre plantas) | Justo | (vino con la pista) |
| 12 | Ticket 0.441 → manual | Deducción ligera | Justo | No |
| 13 | Dos fuentes → Aurora | Obediencia | Justo | No |
| 14 | Escuchar a Evaristo hasta el final | Paciencia (Begoña lo dice) | Justo | No |
| 15 | Coma → Aurora | Obediencia (llevar una frase) | Recado | No |
| 16 | Pieza 31 líneas → 26 % → Begoña | Deducción limpia | Justo | No |
| 17 | **Duelo de Teodoro** (3 asaltos, 38 caracteres, manual) | Deducción de forma: el mejor duelo | Justo | No |
| 18 | Armario 27: tirar del papel | Siembra en el II + aviso en el III | Justo | **Pista 3** (no volví a probar «tirar») |
| 19 | Herminia: «¿persona o herramienta?» | Deducción con chiste | Justo | No |
| 20 | Álbum de Pilar → Anselmo | Obediencia (Brais lo pide) | Justo | No |
| 21 | Columna del kanban (rotulador + DESCOPEADO o SALIDA EN VALOR) | **Deducción** de palabra sembrada | Justo | No |
| 22 | Duelo de Gervasio (2 asaltos) + fotocopia | Emparejar + remate obvio | Trámite | No |
| 23 | Clímax (6 asaltos, 3 adjuntos) | Emparejar + remates bien sembrados | Justo | Fallé 1 por prisa |
| 24 | Empujar al Lector Medio | Señal clara (foco + megafonía + siembra del II) | Justo | No |

**Balance.** **~11 pasos de deducción real** (1, 2, 5, 9, 11, 12, 16, 17, 19, 21 y parte de 23), **~7 de obediencia o recado** y **4 duelos**. Igual que en la crítica 5, con un duelo mejor. El reparto entre actos sigue cojo: el Acto II tiene la deducción más difícil (9-10) y la más fácil (13-15) juntas.

### 5.2 Pistas

Pedí **3**, todas de nivel 1, y las tres me sacaron del atasco: «Apágale algo a alguien» (CMS), «Hazla mal. Te enseñan una buena» (nota de gasto) y «Si de un armario sale papel…» (armario). Es un sistema de pistas excelente: graduado, con voz y con chiste. El problema no es la pista, es que **dos de los tres atascos están en el mismo tramo**. La dificultad del juego está mal repartida, no mal calibrada.

### 5.3 Los duelos: ¿trámite o juego?

- **Maripaz.** Es juego en el remate (adjuntar la ficha sellada) y trámite en las rondas: se empareja por palabra clave («reunión rápida» → «¿te va en marzo?»).
- **Teodoro.** **Juego.** La regla de los 38 caracteres obliga a mirar la forma de la réplica. Además, la réplica larga no penaliza y deja ver «NO CABE», lo que enseña la regla jugando, y el remate (la respuesta automática) es una idea propia. Es el modelo a seguir.
- **Gervasio.** **Trámite.** Son dos asaltos y el segundo («El acta se necesitaba para... para...») está bien, pero es una sola réplica que completar y un adjunto evidente.
- **Clímax (Íñigo).** Buen cierre: seis asaltos y tres adjuntos, y cada réplica es algo que te contaron durante la tarde. Mi único fallo vino de contestar a una frase de Íñigo que no era la que estaba en pantalla, porque llegan muy seguidas. Se podría marcar mejor el cambio de ataque.

Veredicto: de cuatro duelos, dos son juego (Teodoro y el clímax), uno es medio juego (Maripaz) y uno es trámite (Gervasio). La crítica 5 contaba dos de trámite.

### 5.4 Ritmo del Acto II y desplazamientos

El ascensor con submenú de salas y el directorio funcionan. Lo usé siempre y sin él el Acto II sería insoportable. Aun así, en el Acto II cambié de planta más de una docena de veces, y cerca de la mitad fue para **llevar una frase o un papel** (Evaristo → Aurora; Aurora → ordenador → Begoña → Teodoro; Gertrudis ↔ Sala). Los dos que más pesan:

1. **El ida y vuelta Sala ↔ Vending sigue existiendo para quien usa el verbo Usar.** La E6 añadió la vía «Hablar con la tele → Buenas noches, Gertrudis», pero Usar la tele contesta «Alguien con wifi y rencor la encontraría enseguida», que manda al Vending. Yo fui al Vending.
2. **La duda de Evaristo a Aurora**: se baja a la planta 1 para traer una frase que Aurora resuelve sin necesitar ningún objeto.

---

## 6. Estado de cada punto de la crítica 5

### 6.1 Fallos N1-N11

| # | Fallo C5 | Estado | Cómo lo sé |
|---|---|---|---|
| N1 | Quinta publicación del titulador ilegible | **Resuelto** | [J] la leí en la primera sesión y el panel espera a «Dejarlo»; [T] e4/e6 OK |
| N2 | Apagón saltable | **Resuelto** | [J] lo vi por el camino del enchufe; [C] `cpd.js` dispara el corte «MIENTRAS, EN LA REDACCIÓN» si no hubo apagón; [T] e6 OK |
| N3 | Atasco invisible | **Resuelto** | [J] «¿Necesitan ayuda?» y empujé sin dudar |
| N4 | «Mirar a Bruno» tapado por hotspots | **Resuelto** | [J] me salió «Mirar a Bruno» sin querer en Administración (aclaración del fallo 2) |
| N5 | «Hablar con» un actor tapado por Bruno | **Resuelto** (no reproducido a ciegas) | [C] E6 §6; [T] `test-e6-motor` lo comprueba |
| N6 | Revelación del armario sobreexplicada | **Resuelto en lo esencial** | [J] Herminia y Leoncio siguen sembrando (atún, baño), pero ya no hay conclusión en voz alta y la llamada de Evaristo llega después (la oí al salir del armario) |
| N7 | Bruno explica la columna | **Resuelto** | [J] no la oí |
| N8 | Cameo de Valentín ilegible | **Parcial** | [J] hay globo «…», pero el gesto no se ve a 320×200. Ya no parece un error |
| N9 | «Huele a 2019» ×2 | **Resuelto** | [T] 1/1 |
| N10 | Ids `paco_ticket` / `ruben` | **No** (cosmético) | [C] siguen |
| N11 | Táctil a 1× con DPR 1 | **Resuelto** | [J] 844×390 a DPR 1: lienzo a ~×1,95 |

### 6.2 Los diez cambios prioritarios de la crítica 5

| # | Cambio | Estado | Comentario |
|---|---|---|---|
| 1 | Que todos vean el apagón | **Resuelto** | — |
| 2 | Anunciar el atasco | **Resuelto** | Con una línea y sin explicar: bien |
| 3 | Quitar el ida y vuelta de la estampida | **Parcial** | El atajo existe, pero solo con Hablar. Con Usar (el verbo natural para una tele) se sigue mandando al Vending. A ciegas hice el viaje |
| 4 | Duelos de Teodoro y Gervasio con cuerpo | **Parcial** | Teodoro, **resuelto y muy bien**. Gervasio sigue en dos asaltos sin mecánica propia |
| 5 | Desmasticar el armario | **Resuelto** | — |
| 6 | Bruno deja de explicar | **Parcial** | Las 9 de Bruno, fuera. Quedan explicaciones en boca de otros (Eutimio, Leoncio, Aurora) y una de Bruno en la reunión |
| 7 | Titulador: quinta y meta | **Resuelto** | La meta es demasiado baja (§4.6) |
| 8 | Atacar el molde de cierre seco | **Resuelto en cifras, parcial en forma** | 21,8 % → 14,2 %; año 66 → 31; táper 33 → 17. Pero se ha hecho quitando, no cambiando de forma, y nace «, por X.» (§4.5, §4.7) |
| 9 | Segunda pista del rotulador | **Resuelto** | El termómetro y el hotspot del cordel; lo cogí en el Acto II sin buscarlo |
| 10 | Lote de interfaz (N4, N5, N8, comodín) | **Casi todo** | N8 parcial; el comodín marcado no lo vi destacar en pantalla [C: `engine/duel.js:144`, sí existe] |

### 6.3 Lo que la crítica 5 pedía para el 8,5 (§9)

1. **Piezas de situación para todos:** resuelto.
2. **Acto II sin el ida y vuelta:** parcial (§5.4).
3. **Cuatro duelos que se sientan como duelos:** tres de cuatro.
4. **Sorpresas sin masticar:** resuelto en el armario y la columna; quedan explicaciones de otros personajes.

---

## 7. Fallos nuevos (y técnica)

**Pruebas** [T]:

- `node tools/test-all.mjs`: ver tabla de abajo.
- `node tools/text-audit.mjs --estatico --plan --e2 --e5 --e6 --recuento` → **PLAN: OK, E2: OK, E5: OK, E6: OK** (remate seco 514/3.558 = 14,4 %; táper 17/17; año 33/35; «D3: No.» 6/6; ninguna sala por encima del 22 %; la peor es `ecosistema.js`, con 21,7 %).
- Partida a ciegas completa y tramo de móvil: **cero mensajes de consola y de página**.

**`node tools/test-all.mjs` → TODO OK (21) en 1.369 s** [T]:

| Prueba | Estado | s | Resumen |
|---|---|---:|---|
| play-mouse | OK | 915 | 81 comprobaciones |
| e6 | OK | 548 | 23 comprobaciones (incluye `test-e6-motor`: `cabe`, COMODÍN, N4, N5, N11) |
| fase0 | OK | 509 | 92 comprobaciones |
| e5 | OK | 453 | 17 comprobaciones |
| fuzz | OK | 417 | 52 comprobaciones |
| e4 | OK | 242 | 23 comprobaciones |
| extras | OK | 217 | 107 pasos |
| smoke · contrast · text-audit · motor | OK | 96 · 70 · 56 · 56 | TODO OK · CONTRASTE OK · TEXTOS OK · 35 |
| comedia p1 / p2 / p3 / p4 | OK | 95 / 4 / 4 / 40 | 17 / 21 / 97 / 146 |
| critica3 · heredado · movil · check | OK | 40 · 4 · 10 · 0 | 28 · 8 · OK · OK |
| walkthrough / --alt | OK | 5 / 5 | 49 pasos |

| # | Gravedad | Descripción | Reproducción |
|---|---|---|---|
| F1 | **Media (diseño)** | El nudo CMS → nota de gasto del Acto II no tiene entrada en el mundo. Dar el sobre a Begoña cierra en vez de reconducir, y la nota «el CMS está en coma» solo va al margen de la ficha | Acto II con la ficha: recorrer planta 2 y Sistemas sin pedir pistas; Dar sobre de azúcar a Begoña → «Sin nota de gasto, esto es azúcar.» y nada más |
| F2 | **Media (diseño)** | El atajo de la tele (E6 §2.3) solo se activa con Hablar. Usar la tele, el verbo natural, manda al Vending | Tras «los becarios no tienen turno», Usar tele → «Alguien con wifi y rencor la encontraría enseguida.» |
| F3 | Baja (UX) | Tras adjuntar un objeto en un duelo, la línea de acción se queda con «Usar <objeto>» pendiente | Duelo de Maripaz → [Usar objeto] → ficha; al acabar: «Usar ficha de la página 7». Igual en el clímax con el correo de Evaristo. `img/11_tras_climax.png` (barra inferior) |
| F4 | Baja (UX/texto) | «¿Falta mucho?» con Evaristo cierra la conversación sin explicación legible (efecto de la poda E326) | Administración → Hablar con Evaristo → «¿Para qué me ha llamado?» → «¿Falta mucho?» |
| F5 | Baja (UX) | «Cómo se juega» no menciona «Mirar a Bruno» (la brújula de objetivos), parte una línea («llamar a la abuela, / que da pistas…») y se contradice («Clic derecho (o pulsación larga): la acción más obvia» frente a «Toque largo: ver objetos») | Pausa → Cómo se juega. `img/15_como_se_juega.png` |
| F6 | Baja (texto) | Escena de Anselmo tras el kanban confusa; Leoncio tiene que traducirla | Acto III, escribir la columna |
| F7 | Baja (texto) | Leoncio repite «Cuatro décimas. Yo tardaba una semana.» con un minuto de diferencia | Usar mi ordenador con la pieza y volver a usar el titulador |
| F8 | Baja (duelo) | En el clímax, dos ataques de Íñigo llegan muy seguidos y es fácil contestar al anterior | Clímax, tras el ticket nº 1: «No es un despido: es una salida en valor.» y «Que esto no salga de aquí.» casi juntos |
| F9 | Cosmético | Ids internos `paco_ticket` y `ruben` | `__game.state()` |

No he encontrado bloqueos ni estados imposibles. La batería sigue sin medir lo que más pesa en la diversión: que un puzle no tenga entrada (F1), que un atajo no se descubra con el verbo natural (F2) o que una poda deje un gesto ilegible (F4).

---

## 8. Los diez cambios prioritarios (por impacto en la diversión)

1. **Dar entrada al nudo del Acto II** (F1). Tres retoques sin puzle nuevo:
   - Que Dar o Usar el sobre de azúcar con Begoña reconduzca: «¿Esto es un justificante? Pues preséntemelo en una nota de gasto, niño, como Dios manda.», y que abra el árbol de la nota.
   - Que la ficha de la página 7 gane una cuarta casilla visible, «CMS: en coma», en lugar de la nota al margen.
   - Que en el Vending o en la Redacción alguien diga en voz alta lo que cuesta un fax sin papel en una empresa sin papel. Por ejemplo, Aurora: «Papel en esta casa solo tiene Begoña. Y solo para rechazar.» Es una línea que siembra sin resolver.
   
   Es el cambio que más minutos de atasco quita.
2. **Devolver unos 20 segundos golpes podados que giraban la frase** (§4.7). Lista de partida: X8 («Ayuda bastante.»), X10 («Nos ganan. Tienen horario.»), E094 («Suben.»), E024 («Estoy de miedo.»), E057 («NI SENTIMIENTOS.»), E042 («Disruptivas.»), E033 («Las animo. Nada.»), E017 («Polvo y principios.»), E268 («Es mi encuadre.»), E286 («Por vergüenza.»), E152, E312, E046, E075. Criterio: si el segundo golpe *comenta* el primero, fuera; si lo *gira*, vuelve. Y revisar las 11 «…, por X.»: o punto y golpe, o fuera.
3. **Que Usar la tele lleve al atajo** (F2). Con «sin turno», Usar tele = Hablar tele (el árbol «Buenas noches, Gertrudis»). La línea «Alguien con wifi y rencor…» puede quedarse como primer Mirar. Con eso desaparece el último ida y vuelta del Acto II.
4. **Gervasio, un duelo con mecánica propia** como la de Teodoro. Propuesta: Gervasio no acaba frases y el menú solo se abre cuando su frase se corta. Si contestas antes (hay un tiempo visible), «Me has interrumpido. Se apunta.» y repite; si contestas después, la réplica completa su frase. Es «que quepa» al revés: «que llegue a tiempo». Sin réplicas nuevas.
5. **Aclarar la escena del kanban** (F6). Que pase en dos tiempos claros: (a) Anselmo revoca al Titulator («Revocado. Fecha: hoy. Efectos: julio.»); (b) mira a Herminia, la mira otra vez y se va sin decir nada, y Herminia escribe en su log «propietaria: Infografía · motivo: no consta». Fuera la frase de Leoncio que lo traduce y fuera «Y en nuestros corazones…».
6. **Quitar las cuatro explicaciones que quedan**: Eutimio («Esta casa da de alta antes…»), Aurora («Abre interrogación y cierra con punto…»; que diga solo «Eso, criatura, es una sentencia.»), Bruno en la reunión («Él cree que avanza…») y Yoli («La cuenta de siempre»).
7. **«Mirar a Bruno» en «Cómo se juega»** (F5): una línea, «Mirar a Bruno: qué toca ahora». Arreglar el salto de línea y la contradicción del toque largo. Y que al soltar un adjunto en un duelo se limpie el verbo (F3).
8. **Romper los dos tics nuevos**: «ya es de la plantilla» (5 → 1: que se quede solo la planta de plástico) y «se fue a las seis. Su X, no» (6 → 2: el móvil de Borja y las chaquetas de Infografía, que son las que mejor lo usan).
9. **Titulador: un segundo listón.** Al batir la casa, que Yoli diga que el récord de verdad es «el de las siete» (312.000) y que el pie pase a «RÉCORD DE LAS SIETE: ???». Así la ley de E4 se persigue y no se cumple por casualidad en la segunda publicación.
10. **«¿Falta mucho?» legible** (F4). Que el gesto de mirar el reloj se vea (dos fotogramas más largos, o un `sfx` de reloj) y que Evaristo cierre con algo que diga que se ha ofendido: «Si tiene prisa, se lo pongo por escrito.» seguido de un «tac» de máquina de escribir más largo, con Evaristo de espaldas. Es un gag de acción en lugar de explicación, que es lo que la E6 quería.

---

## 9. Qué le falta para un 8,5 y para un 9

**Dónde está.** Un 8,0 firme. Tiene oficio de escritura, un sistema propio (los duelos por correo) con un clímax a la altura y uno de los mejores finales que he visto en una aventura de este tamaño. La E6 cumplió casi todo lo pedido, y por eso no baja. No sube porque los arreglos eran *defectos* señalados y la ronda le ha costado algo de textura cómica en la exploración.

**Para el 8,5 hace falta exactamente esto** (cambios 1-4 de §8):

1. **Que el Acto II no dependa de pistas en su nudo central** (cambio 1). Un jugador a ciegas no debería necesitar dos llamadas a la abuela en el mismo tramo.
2. **Recuperar la sonrisa de exploración** que se llevó la poda (cambio 2). No hace falta volver a las 727 cadenas: bastan unos 20 golpes devueltos y las 11 «, por X.» resueltas.
3. **Cerrar el último ida y vuelta** con Usar = Hablar en la tele (cambio 3).
4. **Tres duelos con mecánica propia de cuatro** (cambio 4), para que «Responder a todos» sea juego, no un menú con cabecera bonita.

Con esos cuatro, sin tocar nada más, mi nota sería 8,5.

**Para el 9:**

1. **Una secuencia firma de las que se cuentan.** El fax de Teodoro está a un paso. Si se llevara a escena entera (Bruno y Teodoro duelándose en directo mientras el fax se queda sin papel y hay que alimentarlo con lo que tengas en el inventario), sería el «insult sword fighting» de este juego.
2. **Comedia de forma variada en la capa de exploración**, no solo en las escenas. Hoy las descripciones de objetos son frase + golpe o, tras la E6, solo frase. Hace falta que en cada sala dos o tres objetos reaccionen con otra forma: un tercero que contesta, un cambio de estado visible o un objeto que se queja por megafonía.
3. **Un Acto II con la dificultad repartida**, de modo que el tramo central tenga una deducción difícil y justa en lugar de dos medio escondidas.
4. **Oír el audio.** Sigue sin evaluar.

---

## Apéndice

- **Capturas** (`img/`, 960×600 a `deviceScaleFactor` 1 salvo las de móvil, que son de 844×390 a DPR 1):
  - `01_titulo`, `02_redaccion_hotspots`, `03_vending_hotspots`, `04_redaccion_papel`, `05_sala_amazonas`
  - `06_duelo_maripaz`, `07_titulador_persianas`, `08_titulador_sesion2`, `09_titulador_sesion3`, `10_duelo_gervasio_adjuntar`
  - `11_tras_climax` (con el «Usar correo de Evaristo» colgado), `12_tarjeta_final`
  - `13_movil_dialogo`, `14_movil_toque_largo`, `15_como_se_juega`, `16_acto3_redaccion`
- **Material de trabajo** (fuera del repositorio, en el directorio temporal de la sesión): el controlador de Playwright, las transcripciones de la partida, el extractor de 3.550 cadenas y el script de recuento de §4.5.
- **Herramientas del repositorio ejecutadas**:
  - `tools/serve.mjs`;
  - `tools/test-all.mjs` completo (deja sus registros en `tools/shots/test-all/`, como siempre);
  - `tools/text-audit.mjs --estatico --plan --e2 --e5 --e6 --recuento`.
  
  No he modificado nada fuera de `docs/informes/critica6/` ni he hecho operaciones de git.
- **Documentos leídos en la fase 2**:
  - las críticas 4 y 5;
  - la ENMIENDA E6 (§1-§3 enteras, §4 a través de `e6/tabla.md` y `e6/tumbadas.md`);
  - el contenido citado.
  
  **No he leído enteros** el PLAN_COMEDIA (3.406 líneas) ni las enmiendas E2-E5: trabajo sobre lo que cambió desde la crítica 5, como pedía el encargo.
