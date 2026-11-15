# CRÍTICA 5 · «FE DE ERRATAS»

*Crítica independiente. Fase 1 jugada a ciegas, con ratón real (Playwright, Chromium, 960×600, deviceScaleFactor 1) y un tramo en móvil horizontal. La sección 3 se escribió ANTES de abrir `docs/`, `content/` o las herramientas de recorrido; el resto se añadió después.*

Etiquetas: **[J]** jugado a ciegas · **[C]** leído en contenido o código · **[T]** herramienta.

## 1. Veredicto en cinco líneas

**Mejor que la versión de la crítica 4, y esta vez por diseño, no solo por pulido.** Los grandes cambios que pedía la crítica 4 han entrado y funcionan a ciegas:

- la estampida ya es un puzle lateral (Gertrudis por la tele);
- el armario 27 ya no castiga;
- el Acto III pide pensar (columna del kanban);
- hay señal tras el clímax;
- el coro tiene arco;
- el ascensor tiene atajos.

Me reí más (**22 carcajadas frente a 14**) y el final sigue siendo excelente. **No es todavía un 8,5: es un 8,0.** Faltan cuatro cosas:

- que las nuevas piezas de situación las vea todo el mundo (el apagón se puede saltar y el atasco pasa desapercibido);
- que dos de los cuatro duelos dejen de ser trámite;
- que el Acto II pierda su último ir y venir;
- que el chiste cambie de forma más a menudo: el 22 % de las líneas siguen acabando en remate seco de 1-3 palabras.

## 2. Notas

| Apartado | C1 | C2 | C3 | C4 | **C5** | Por qué |
|---|---:|---:|---:|---:|---:|---|
| Comedia y guion | 6 | 6,5 | 7 | 7,5 | **8,0** | +8 carcajadas a ciegas; momentos provocados nuevos (tele, columna, penalti); el coro paga. El molde de remate seco sigue |
| Puzles y diseño | 6 | 7 | 7 | 7 | **7,5** | Pasa de 6 a ~10 pasos de deducción real; sin antipatrones. Duelos 3 y 4 de trámite; dos piezas nuevas que se pueden perder |
| Historia y estructura | 6 | 7,5 | 8 | 8 | **8,5** | Todas las siembras pagan (coma, becario del 98, táper, «salida en valor» escrita por Zacarías). La revelación del armario llega sobreexplicada |
| Interfaz y usabilidad | 6 | 7 | 7 | 7,5 | **8,0** | Ascensor con atajos (lo usé siempre), señal tras el clímax, Custodia sin cierre. Quedan «Mirar a Bruno» tapado por hotspots y la 5.ª publicación del titulador |
| Apartado visual | 8 | 8 | 8 | 8 | **8,0** | Sin cambios de fondo; el apagón y el titulador están bien resueltos |
| Audio (provisional, no oído) | 6 | 6,5 | 6,5 | 6,5 | **6,5** | No he podido oírlo; se mantiene como referencia, no como juicio |
| Técnica y estabilidad | 8 | 8 | 8,5 | 8,5 | **8,5** | `test-all` **20/20 OK** en 1.036 s; cero errores de consola en la partida completa y en móvil |
| **Global** | **6,5** | **7,0** | **7,5** | **7,5 alto** | **8,0** | Sube medio punto por diversión, no por limpieza. Para 8,5: §9 |

No inflo nada. La subida viene de algo que he medido: más risa a ciegas, más deducción y un Acto III que ya es juego. Visual, audio y técnica no se mueven porque no han cambiado de forma apreciable.

---

## 3. Notas de la partida a ciegas (tal cual)

### Declaraciones de ayudas

- **README.** Lo leí para arrancar el juego. Su tabla de pruebas me destripó, sin querer, varias palabras clave: «Evaristo en el camino», «el apagón y el regletero», «la estampida por la tele», «la columna del kanban», «ticket 0.441», «armario 27», «rotulador» y «señal tras el clímax». No me dieron ninguna solución, pero sí sabía que existían. Lo declaro.
- **Estado expuesto (`window.__game`).** Lo usé para tres cosas. La primera, localizar coordenadas de hotspots que ya había visto (equivale al botón «ver hotspots»). La segunda, transcribir lo que se dice en pantalla. La tercera, elegir opciones de diálogo con índice > 9, que no tienen tecla. **No lo usé** para leer flags, respuestas correctas ni contenido. Ninguna respuesta de duelo salió del estado: todas las elegí leyendo el correo en pantalla.
- **Pistas del juego.** Pedí **2**, las dos en el mismo puzle: el rotulador para la columna del kanban (Acto III). La de nivel 1 decía «haz tú el sitio» y la de nivel 2, «La de los anuncios tiene uno». Ninguna más.
- **Ritmo.** Texto a velocidad «Normal» toda la partida, sin modo rápido. Salté con Esc solo un trozo de la intro en la prueba de móvil.

### Tiempo

Fueron unos **123 minutos de reloj** de inicio a créditos, incluida la lentitud de manejar el juego por herramienta. Estimo **100–130 min** para un humano a ciegas que lo mire todo y **60–75 min** sabiendo el camino. Por actos (mi reloj):

- **Acto I** (torno, silla, café, ficha): unos 38 min.
- **Acto II** (hueco, fuente, firma): unos 55 min.
- **Acto III + final**: unos 30 min.

### Cronología, atascos y reacciones

1. **Intro (1,4 min).** Buen ritmo. Sonrisas con «Eso es una bebida, hijo», «Lo he dicho en el grupo del pueblo. Abrígate.» y «Pues no te ha visto ni el torno».
2. **Torno.** El chicle de Celestino («O para pegar algo») va en la tarjeta, la tarjeta en la casilla VACANTE del organigrama y luego al torno. Remate: «BIENVENIDO, VACANTE. …Vacante. Bueno. Es un cargo.» (carcajada suave). Está telegrafiado, pero es satisfactorio como primer puzle. Sin atasco.
3. **Llegada a la Redacción.** La escena de Íñigo y el Titulator dura más de 90 s y presenta bien el conflicto. La Redacción tiene una densidad de chistes de objeto muy alta y buena. Lo mejor: el pósit «Contratar al becario de marzo – 1998» en HECHO (PERO NO), el semáforo «Verde: 14 de agosto. Estaban de vacaciones» y «Es que lo escribí yo. Ayuda bastante» (Yoli).
4. **Silla.** La chaqueta de Ramírez (Yoli: «que sea para dejarla en un sitio con más autoridad») va al perchero («Encima de alguien que asiente, sí») y de ahí al Lector Medio. Pide algo de deducción, aunque la dan en dos tiempos. Sin atasco.
5. **Gertrudis.** Hay que saludar a la cafetera dos veces para que suelte los chismes, que son las réplicas: «TENGO WIFI Y RENCOR», «NO HAY MÁS CAFÉ. HAY FAMA.». Lo provoqué yo y luego vi las consecuencias: titular viral y Yoli con once mil lectores. Me gustó mucho.
6. **Aurora.** Café a cambio de la ficha de la página 7. Fin del Acto I. «Han sido treinta años muy buenos» fue carcajada. Hubo otra con la puntuación de la Secretaría («¿Qué quiere.»), que remata Aurora: «Abre interrogación y cierra con punto… Es una sentencia.».
7. **Sala Amazonas.** Aurora ya me había dado la clave: «pregunta por el punto que nadie toca». Gervasio responde que «los becarios no tienen turno… pregunta la mesa y los conectados». La tele busca «alguien con wifi y rencor»: le pregunto a Gertrudis y luego enciendo la tele. Es bonito, pero exige ir y volver entre Amazonas y Vending (seis cambios de sala). La estampida de Mercados por la puerta es graciosa de ver.
8. **Duelo con Maripaz.** Perdí el primero porque me faltaba la réplica de «desde el cariño más absoluto». Los comodines no se comportan igual: uno no penalizó y otro creo que sí. El rematador es «¿quién me firma que esa página es noticia?» y se gana adjuntando la ficha sellada por Aurora. Gané el segundo. Carcajada con «La X mide un píxel. —La semana pasada medía dos. Optimizamos.». Siestatón: «Si ya duerme, no pulse. Le atenderemos en sueños.»
9. **CMS en Sistemas.** El registro de tickets dice que la nº 3 cuelga el CMS por la pantalla de la Redacción y la manda a la regleta R‑3. En la Redacción hay una brida «R‑3» en el enchufe y en el regletero un pósit tapa la R‑3. Es **deducción real**, la mejor del juego. R‑1 y R‑5 tienen fallos graciosos. «CORO: ¡Ha sido Diseño!» / «He sido yo. Pero gracias.»
10. **Eutimio.** Carcajada suave con «Puestas. Ahora se ve perfectamente que no hay carretera.». También «No, mamá, el wifi no se ha caído. Has dejado de merecerlo.» (callback) y «Me entero de todo. No arreglo nada. Es el equilibrio.»
11. **Comercial.** Al entrar salta un interstitial de 5 s. Maripaz: «Esto. Ya lo has consumido. Son doce euros.» (carcajada). Borja y Tadeo repiten la misma fórmula en la misma sala: «se fue a las seis. Su móvil/portátil, no».
12. **Administración.** Begoña es excelente. «Varios» lleva a «RECHAZADO, en la frente. Mi primer documento oficial.» (carcajada). «Correcta. Aprobada. Vete. Me has hecho daño.» (carcajada). El puzle de diálogo con el sobre de azúcar da la fotocopia de la nota de Gervasio (cuyo reverso dice «OPA ROBLEDAL») y dos copias rechazadas. Es ingenioso: un solo trámite te da fuente y papel.
13. **Evaristo.** Hay que escucharle «hasta el final»: si eliges «¿Falta mucho?», se corta. La revelación de la coma, por la que 48,000 son 48 €, está muy bien sembrada.
14. **Fax.** Las copias rechazadas sirven de papel. Salen los faxes de Teodoro de toda la tarde («GOYITA, ¿ME OYES? TÚ AGUANTA.») y el de F.P., que llega con borde perforado de matricial. Precioso encaje.
15. **Aurora y las fuentes.** «Una anónima y otra con IVA. Me vale.» (carcajada). Valida la coma de Evaristo y me da su correo, para enviarlo «cuando alguien diga que una coma es un detalle sin importancia». Es una pistola de Chéjov bien cargada.
16. **Ordenador.** La pieza sale de 31 líneas para un hueco de 23: sobra un 26 %, el mismo recorte estándar del cartel de Administración. Deducción limpia. Begoña: «Pero en la conclusión explico por qué la opa es import… —Recortado.» (carcajada).
17. **Minijuego TITULADOR** (monitor de Yoli). Dos sesiones, diez publicaciones; los titulares están en la §4. Tuve tres carcajadas y varias sonrisas. **Fallo de UX:** la quinta publicación de cada sesión cierra el panel enseguida y no deja ver ni el titular ni la cifra.
18. **Firma.** El duelo por fax con Teodoro tiene dos réplicas y un rematador, «lo que está cerrado no tiene respuesta», que se gana adjuntando el manual del fax (página 9, respuesta automática). Sale un bucle de autorrespuestas y luego «ES LO MÁS BONITO QUE ME HAN ESCRITO EN VEINTINUEVE AÑOS… BRUNO PELLEJO. TRECE CON ESPACIOS. CABE.» / «…Lo ha escrito bien.». Es el mejor momento emotivo antes del final. El duelo es corto y fácil.
19. **Acto III, armario 27.** Zacarías titula hasta cuando habla. Bruno: «UN BECARIO VIVE EN UN ARMARIO. EL 4 TE SORPRENDERÁ» —«Mejor.» —«…Ya hablo como tú.» (carcajada). La revelación, eso sí, **llega sobretelegrafiada**: justo antes caen tres pistas seguidas (Herminia: «consumo: atún» y «pausas de 5 min»; Evaristo: los atunes de la máquina; Bruno, que lo dice en voz alta: «Eso no es un modelo. Eso es un compañero»).
20. **Kanban.** Aquí está **mi único atasco** (unos 6 min, dos pistas): no se me ocurrió coger el termómetro de ventas, aunque estaba «pintado a rotulador». Las columnas posibles son DESPEDIDOS («Eso es "muerto" con corbata», buen fallo) y SALIDA EN VALOR, que es la correcta porque la frase la escribió Zacarías y por tanto «es de la casa». La deducción es buena y respeta la lógica de Anselmo, pero Bruno la **sobreexplica**: «La frase con la que Íñigo despide a la gente acaba de liberar a Zacarías». Coro: «¿Lo del Titulator ha sido Diseño? —No.» y después «Hemos sido nosotros. —No lo repitas.» (carcajada).
21. **Gervasio.** El duelo es cortísimo: una réplica y el rematador con la fotocopia de la comida («Se comió. Pero no se habló. Bueno. Se habló un poco.»). Da el acta: «Acuerdos: uno, pedir más café. Dos, ninguno más.»
22. **Clímax con Íñigo («Responder a todos»).** Seis intercambios con tres adjuntos: ticket nº 1, acta y correo de Evaristo. «Hola. Soy la inversión.» fue carcajada. Evaristo aparece por megafonía con los 191.808 € y el Lector Medio habla por fin: «…Y ahorrar.». Todas las siembras pagan. Es muy satisfactorio.
23. **Tras el clímax.** El control vuelve sin indicación en el diálogo. La pista llega por la megafonía de Celestino («¡El cartón se tambalea y nadie lo toca!»), así que empujé al Lector Medio a la primera. Un jugador que no lea el globo de arriba puede quedarse mirando. El momento lo provoca uno y se disfruta: «¡Penalti clarísimo!» / «…Lo que diga el árbitro.» (carcajada).
24. **Epílogo y final.** Lo más fuerte del juego. Íñigo resulta ser el becario de marzo del 98, que paga el pósit del kanban: «Fui un perfil junior con mucho recorrido» (carcajada). La plaza 1 de Teodoro: «No tengo coche. —Ni bici.» (carcajada). La lectora de 47 minutos. La abuela: «El papel lo dejé en 2011, que me manchaba el sofá.» (carcajada con nudo), y después «Abrígate tú.» / «¡Me ha contestado el periódico!». La tarjeta acaba en «Lamentamos el acierto.». El epílogo dura unos 3 minutos y se sostiene.

### Recuento honesto de risa

- **Carcajadas** (incluidas las suaves): **22**. Torno «Es un cargo», «Lo leímos todos», «¿Qué quiere.» → «Es una sentencia», «treinta años muy buenos», «la X mide un píxel», «Son doce euros», «RECHAZADO en la frente», «Me has hecho daño», «Me ha puesto en copia a mi madre», «carretera», «una anónima y otra con IVA», «Recortado», mejillones, «Dejé a la opa», PIB, «EL 4 TE SORPRENDERÁ», «Hemos sido nosotros», «Soy la inversión», penalti, «perfil junior», «Ni bici», abuela y el sofá.
- **Sonrisas:** unas **60**.
- **Densidad:** aproximadamente **una carcajada cada 5 minutos y una sonrisa cada 2**. Es muy alta para el género.

### Qué me aburrió o chirrió

- **Desplazamientos del Acto II.** Hay ida y vuelta Amazonas ↔ Vending, y Planta 2 ↔ Papel dos veces. El ascensor con atajos ayuda mucho, pero el puzle de la tele obliga a cruzar seis veces el mismo pasillo.
- **Duelos 3 y 4** (Teodoro y Gervasio): son demasiado cortos para llamarse duelos.
- **Fórmulas repetidas.** Detecté de oído:
  - «de 2019» y el año como chiste (pipas, yogur, Gertrudis, «huele a 2019» dos veces literal: chaqueta y silla);
  - «X se fue a las seis. Su Y, no» (Borja y Tadeo);
  - «Era solo eso» de Evaristo (es su coletilla y funciona, pero sale en todas sus llamadas);
  - «cariño» en Maripaz;
  - «criatura» en Aurora;
  - «Lo miro en la próxima versión» en Anselmo (tres veces);
  - «Siguiente» en Íñigo;
  - el titular del Titulator entre escenas (es un buen tic, pero muy frecuente).
- **Sobreexplicaciones de Bruno:** «Eso no es un modelo. Eso es un compañero.» y «La frase con la que Íñigo despide a la gente acaba de liberar a Zacarías.»
- **Valentín** no tiene diálogo: Bruno pregunta y se contesta él solo («…Nada. Perdone.»). Más tarde sale «Está en la bandeja». Es un personaje de una línea.

### Fallos encontrados (con pasos)

1. **Clic sobre Bruno cuando está encima de un hotspot.**
   - Pasos: Redacción, Bruno de pie sobre la cinta de carrocero (o en la puerta de la Sala Amazonas), verbo Mirar y clic sobre Bruno.
   - Resultado: describe la cinta o la puerta, no a Bruno.
   - Variante: Bruno tapa a Leoncio, «Hablar con Leoncio» y no pasa nada, sin mensaje.
   - Severidad: baja-media («Mirar a Bruno» es el sistema de objetivos que anuncia el README).
2. **Titulador: la quinta publicación cierra el panel antes de ver el resultado.**
   - Pasos: monitor de Yoli tras escribir la pieza, publicar cinco veces.
   - Resultado: tras la quinta, el detalle desaparece en menos de 1,2 s; ni titular ni cifra.
   - Severidad: media (le roba el remate al minijuego).
3. **Comodines del duelo de Maripaz incoherentes.**
   - Pasos: duelo de Maripaz, elegir «Enviado desde mi móvil…» y después «¿Eso no lo llevaba otro departamento?».
   - Resultado: el primero no cuenta como fallo (repite el insulto); el segundo creo que sí (el marcador pasó a 1 fallo sin que fallara ninguna réplica real).
   - Severidad: baja. Pendiente de confirmar.
4. **La réplica correcta no siempre está entre las opciones.**
   - Primer intento contra Maripaz: ya tenía en la libreta «Gracias por avisar antes de faltármelo», pero nunca apareció entre las cinco opciones. No sé si es la correcta para «desde el cariño más absoluto».
   - Severidad: por verificar.
5. **Escala en móvil con DPR 1.**
   - Con viewport 844×390, DPR 1 y puntero táctil, el lienzo queda a 1x (320×200 en medio de la pantalla). Con DPR 3 (iPhone real) ocupa todo el alto y se juega bien.
   - Severidad: baja (son pocos dispositivos).
6. **Ids internos viejos.** `paco_ticket` para Eutimio y `ruben` para Zacarías. No se ven en pantalla. Cosmético.
7. **Sin errores de JavaScript** en toda la partida (consola y pageerror vacíos).

### Móvil horizontal (844×390, DPR 3, táctil)

Jugué el torno completo y la subida a la Redacción con toques. El lienzo ocupa todo el alto y los verbos y el inventario son legibles y tocables. El menú de pausa se lee perfectamente. No probé la pulsación larga, porque Playwright no la emula bien con toques. Sin incidencias.

### Juicio a ciegas, en caliente

Es el juego más gracioso que he jugado en este formato desde hace tiempo. La estructura de siembra y pago del Acto II al final es de manual LucasArts. Lo flojo:

- dos duelos de trámite;
- el ida y vuelta del Acto II;
- la revelación del armario, que llega masticada;
- tics de Bruno explicando el chiste.

---

> **Aclaraciones de la fase 2 sobre las notas a ciegas** (no retoco el texto de arriba, solo lo matizo):
>
> - **Fallo 3 (comodines).** Es intencionado. El comodín no cuenta la primera vez y las flojas sí, según `engine/duel.js` (154-171) y `content/duelo.js` (31 y 70). Pasa a ser una nota de diseño: el jugador no puede distinguir uno de otras.
> - **Fallo 4 (réplica ausente).** No es fallo. La réplica de «desde el más absoluto cariño» es la de Yoli («…modo avión»), que yo aún no tenía; el motor ofrece la correcta solo si se ha aprendido.
> - **Valentín.** Es un cameo mudo a propósito (`pecera.js:546`): se quita un casco, mira y Bruno se disculpa. A 320×200 el gesto no se lee y parece un diálogo roto.
> - **Apagón.** No lo vi nunca. Fui a Sistemas, deduje la R-3 con el registro y el regletero lo permite sin el apagón (E5 §2.2.4, «sin gate»). Lo jugué en la fase 2 (`img/18_apagon_fase2.png`).
> - **Atasco.** Lo resolvió la vía «anuncio» a los 10 s de tiempo quieto mientras mi herramienta esperaba. A ciegas no supe que era jugable.
> - **Táper de Zacarías.** Existe y se entrega (el táper huérfano de Mercados en el Vending), pero no lo encontré porque no volví al Vending tras la estampida.

---

## 4. Comedia

### 4.1 Densidad de risa medida

| Medida | C3 | C4 | **C5** |
|---|---|---|---|
| Carcajadas a ciegas | 10 en ~110 min | 14 en ~110 min | **22 en ~120 min** (1 cada 5,5 min) |
| Sonrisas | ≈1/min | 56 fuertes + ≈80 leves | ≈60 fuertes (no conté las leves) |
| Momentos que provoca el jugador y disfruta viendo | 2 | 2 (Gertrudis viral, fax) | **6**: Gertrudis viral, Gertrudis en la tele y la estampida, el bucle de autorrespuestas del fax, la columna SALIDA EN VALOR, el penalti al Lector Medio, el titulador |
| Atasco a ciegas | 20 min | 3 min | 6 min (rotulador), con 2 pistas |

La mejora se debe a dos cosas, en este orden:

1. **Más gags con forma propia.** Gertrudis pregunta en directo, el coro se culpa a sí mismo y los titulares del minijuego ya no son una frase con coletilla: son situación, interfaz o acción.
2. **Líneas nuevas que funcionan.** «Dejé a la opa de Hidrovoltia hace un año y esto es lo que aprendí», «Hemos sido nosotros. —No lo repitas.», «La X mide un píxel» (que ya estaba).

Siete de mis 22 carcajadas son líneas que ya celebraba la crítica 4. El aumento neto es real, pero menos espectacular de lo que sugiere la cifra.

### 4.2 Los diez mejores momentos

1. **«BRUNO PELLEJO. TRECE CON ESPACIOS. CABE.» / «…Lo ha escrito bien.»** Sigue siendo el corazón del juego. Ahora lo precede el bucle de respuestas automáticas, que añade un gag de interfaz. [J]
2. **«Lamentamos el acierto.»** La tarjeta final no ha perdido nada. [J] `img/13_tarjeta.png`
3. **La abuela: «El papel lo dejé en 2011, que me manchaba el sofá.» → «Abrígate tú.» → «¡Me ha contestado el periódico!»** Risa y nudo en tres líneas. [J]
4. **Gertrudis pregunta en la tele: «PREGUNTA DEL PÚBLICO: ¿Y CUÁLES SON LOS SIGUIENTES PASOS?»** y Mercados se encaja en la puerta («¡Tengo doble prioridad!»). Es el mejor puzle nuevo y lo he ganado yo. [J] `img/04_estampida.png`
5. **Titulador: «Las personas que hablan con los mejillones de lata tienen esto en común, según la psicología» / «Qué le pasa a tu cuerpo si comes el PIB todos los días».** La sátira de Discover funciona como juguete. [J] `img/07`, `img/09`
6. **«—Hola. Soy la inversión. —…Eso es una alucinación. —No. Es un becario. Es más barato, pero se nota.»** [J]
7. **El penalti al Lector Medio** («¡Penalti clarísimo!» / «…Lo que diga el árbitro.») y luego «Es la primera vez que la matriz me pone en algún sitio». [J]
8. **Begoña: «Varios» → «RECHAZADO, en la frente. Mi primer documento oficial.»** y el recorte a media palabra («…por qué la opa es import… —Recortado.»). [J]
9. **Íñigo, becario de marzo del 98: «Fui un perfil junior con mucho recorrido.»** Paga el pósit del kanban del minuto 15. [J]
10. **El coro de Desarrollo: «¿Lo del Titulator ha sido Diseño? —No. (…) —Hemos sido nosotros. —No lo repitas.»** El arco de tres actos que pedía la crítica 4 da un remate seco y perfecto. [J+C]

Menciones: «Lo leímos todos. Por eso no contestó nadie»; «Han sido treinta años muy buenos»; «¿Qué quiere.» → «Es una sentencia»; «Esto. Ya lo has consumido. Son doce euros»; «Una anónima y otra con IVA. Me vale»; «No tengo coche. —Ni bici.»

### 4.3 Las diez peores líneas o momentos

1. **«Armario 27. Atún. Baño. Eso no es un modelo. Eso es un compañero.»** (Bruno, `pecera.escenas.js:471`). Llega justo después de que Herminia y Leoncio hayan dicho «come a las dos y va once veces al baño», y justo antes de que Evaristo llame por los atunes. Tres pistas y la conclusión en voz alta: la revelación del armario pierde la sorpresa. [J+C]
2. **«La frase con la que Íñigo despide a la gente acaba de liberar a Zacarías.»** (`pecera.dialogos.js:350`). Explica el chiste que el jugador acaba de construir. La propia E5 §3.5 dice «nadie la explica» y la deja. [J+C]
3. **El atasco de Mercados, invisible.** Tras «¡Tengo doble prioridad!» el control vuelve sin ningún indicio de que se pueda hacer algo. A los 10 s Maripaz lo resuelve. Las tres vías buenas (empujar, medio cruasán, «¿Y la próxima reunión?») las verá muy poca gente. [J+C]
4. **El apagón, saltable.** Es la mejor comedia de situación del Acto II (Yoli «¡Estamos ciegos!», «Diecisiete. Dieciocho.», la linterna de Anselmo) y quien lee el registro de tickets va directo al regletero y no la ve. Premiar al que deduce está bien; que se pierda el gag, no. [J+C]
5. **Valentín: «¿No le molesta que le culpen de todo? / …Nada. Perdone.»** El gesto del casco no se lee a esta resolución y parece que Bruno habla solo. [J]
6. **«Huele a 2019»** dos veces literal (chaqueta, `items.js:297/303`, y silla, `pecera.js:357`). El año como chiste vuelve a ser tic: 66 cadenas con año, 9 con «2019». [J+C]
7. **Borja y Tadeo, la misma fórmula en la misma sala**: «Se fue a las seis. Su móvil/portátil, no.» [J]
8. **Las llamadas de Evaristo**: «Una cosita» ×8 y «Era solo eso» ×9. Es su voz y la idea es la mejor del juego, pero a la cuarta llamada se oye la plantilla. [J+C]
9. **«¡Hidrovoltia se lanza a por el Robledal! ¡Eso es opa, árbitro!»** y «¡Golazo de papel!». La megafonía de Celestino en el epílogo es relleno con su fórmula. [J]
10. **«Teodoro es el dueño del edificio. Lo compró en el 97. Por fax.»** (Maripaz al entrar, y Pilar casi igual). Es un rumor que no paga nada y suena a frase de relleno de saludo. [J]

### 4.4 Personaje por personaje

| Personaje | Funciona | No funciona |
|---|---|---|
| **Bruno** | Voz seca; «Mirar a Bruno» como brújula; «Ya hablo como tú» | Sigue explicando conclusiones (peores 1 y 2) |
| **Abuela** | Marco emocional; pistas con chiste (Evaristo le pregunta si «Remedios» lleva tilde) | La pista de nivel 1 es demasiado vaga para el rotulador («haz tú el sitio») |
| **Celestino** | Locutor de principio a fin. La megafonía tras el clímax ahora sirve para algo | En el epílogo, más ruido que chiste |
| **Íñigo** | Entrada sin «reimaginar el perímetro»; clímax y revelación del 98 | Vocabulario de consultor previsible al principio («Siguiente» ×8) |
| **Yoli (Audiencias)** | Ha ganado mucho: «Es que lo escribí yo», «Me ha puesto en copia a mi madre», la lectora de 47 minutos, el titulador. Es la que más ha crecido | Su tic («Hola Bruno, Bruno becario, becario elContable…») se repite en cada saludo |
| **Anselmo** (director de Desarrollo) | «De fuera / de la casa» como lógica que el jugador usa para resolver la columna. Eso es caracterización convertida en puzle | «Lo miro en la próxima versión» ×5 |
| **Coro de Desarrollo** | Arco completo (culpan a Diseño → «Hemos sido nosotros»). Funciona | «D3: No.» ×11: el gag de la taza ya se gasta |
| **Leoncio + Herminia** | Tierno; Herminia como objeto con log está muy bien | Su gráfico del Titulator es la primera de las tres pistas que delatan a Zacarías |
| **Custodia (Secretaría)** | «¿Qué quiere.» y la sentencia de Aurora; árbol que ya no se cierra | — |
| **Gertrudis** | El mejor objeto-personaje, y ahora con un puzle a su medida | — |
| **Aurora** | La mejor escrita; «criatura» bajado a 6 | — |
| **Teodoro** | El fax y la firma | Su duelo es de trámite (2 réplicas + remate obvio) |
| **Gervasio** | Frases que no acaba | Su duelo: 1 réplica + remate; «Diecinueve años» en 10 cadenas |
| **Mercados** (Fermín, Rogelio, Jacinto) | Por fin tienen nombre y rasgo («¿Sigue siendo marzo?») | Su escena jugable (atasco) se pierde |
| **Maripaz** (directora de Comercial) | Coherente con el inventario publicitario: interstitial al entrar, la X que mengua, el gong, «Ya lo has consumido. Son doce euros», «entre línea y línea todavía cabía un banner». Su duelo es el más vistoso y la ficha como remate es justa | «cariño» 14 (dentro del tope pero se oye); «Teodoro compró el edificio por fax» no le pega |
| **Begoña** | Diálogo-puzle, el recorte, «Me has hecho daño» | — |
| **Evaristo** | Idea, llamadas, payoff de 191.808 € | Fórmula de llamada (ver peores) |
| **Eutimio** | Igual de bueno que Paco: «Has dejado de merecerlo», «Me entero de todo. No arreglo nada» | — |
| **Zacarías** | Voz de titular con ternura; «La IA era yo. Le decía que sí. Por no discutir» | Su revelación llega masticada |
| **Pilar / Eventos** | (Sala protegida; no se toca.) | — |
| **Valentín, Ramírez** | Ramírez vuelve en el epílogo («¿Me he perdido algo?») | Valentín no se lee (peores, 5) |

**Sobre los nombres nuevos.** **Eutimio** suena muy bien para un técnico de sótano: es de la misma quinta que Celestino, Gervasio y Evaristo, y «Eutimio Ticket» tiene ritmo. **Zacarías** funciona como chiste de nombre viejo para un becario, pero le quita a Zacarías el contraste generacional que tenía con el reparto. El texto lo compensa con la voz de titular, así que no lo veo como problema. Los ids internos `paco_ticket` y `ruben` siguen en el estado y en el código (solo cosmético).

### 4.5 Fórmulas repetidas (recuento propio)

Contadas sobre **4.216 cadenas** extraídas de `content/` (sin `art/` ni `flags.js`) con mis propias expresiones, independientes del auditor. Entre paréntesis, sin `eventos*`.

| Fórmula | C4 | **C5** | Lectura |
|---|---:|---:|---|
| Coletilla final «Y …» (frase final que empieza por Y) | 129 | **107** (90 sin Ev.) | Baja ~17 % |
| Coletilla final «Con …» | 62 | **46** | Baja |
| Coletilla final «Sin …» | 22 | **23** | Igual |
| Coletilla final «Ni …» | — | **18** | «Ni bici», «Ni uno», «Ni un marrón» |
| Auditor E5 (Y/Con/Sin/Ni + 1-3 palabras) | — | **38 / 46** | En tope, pero mide solo la forma más corta |
| **Frase final de 1-3 palabras** (remate seco) | ≈19 % | **21,8 %** (917) | **No baja: sube un poco.** El molde sigue |
| Año concreto 19xx/20xx | 58 | **66** | Sube: tic vivo («2019» ×9, «Huele a 2019» ×2 literal) |
| «X años» | 41 | **45** | Igual |
| «chaval» | 22 | **11** | Resuelto |
| «criatura» | 13 | **6** | Resuelto |
| «cariño» | 14 sin Ev. | **14** sin Ev. | Igual (tope 20) |
| RECHAZADO en la frente comentado | 3 | **2** | Resuelto |
| «Una cosita» / «Era solo eso» | 8 / 10 | **8 / 9** | Igual |
| Cifra con punto de miles | 17 | **22** | Sube (titulador, tickets) |
| Murmullos duplicados (>25 car.) | 84 | **85** cadenas (96 copias) | Sin arreglar: «Lo que diga el Lector Medio.» ×8, «Diecinueve años» ×10 |

**Tics nuevos que han ocupado el sitio de los viejos:**

| Tic nuevo | Recuento | Ejemplos |
|---|---:|---|
| **«táper»** | **33** cadenas | El hilo del táper paga (Zacarías, Íñigo «Saliste por esa puerta con un táper»), pero 33 es exceso: el táper se ha convertido en el nuevo «2019» |
| **«…» de pausa al empezar** | 56 | «…Lo ha escrito bien», «…Ya hablo como tú», «…Lo miro en la próxima versión». La pausa dramática como muletilla |
| **«de fuera / de la casa»** | 17 + 18 | Es la lógica de Anselmo y está bien. Fuera de Anselmo sobra |
| **«Perdón.» de Zacarías** | 20 «Perdón/Perdone» en total | «SEGUIREMOS INFORMANDO. Perdón.», «Yo. Perdón.», «Se me escapa» |
| **«Lo pongo en azul» (Íñigo)** | 12 «azul» | Buen tic de personaje; al límite |
| **«D3: No.»** | 11 | Gag de la taza «NO» ya muy gastado |
| **«Siguiente»** | 8 | Íñigo |

**Lectura.** La E5 ha cumplido sus topes: el auditor da `PLAN: OK, E2: OK, E5: OK` [T]. Pero el molde de fondo (afirmación + remate de 1-3 palabras) ha **subido** del 19 % al 22 %. Es lo que la crítica 4 temía: al poner tope a las coletillas, el peso se ha ido a otros cierres secos («Ni bici.», «Con ticket.», «Mejor.», «Perdón.») y al año/cifra exacta. La diferencia con la crítica 4 es que ahora hay más piezas de otra forma (tele, apagón, atasco, columna, titulador), y eso hace que el molde canse menos de lo que dicen los números.

### 4.6 El minijuego: TITULADOR

Lo jugué en dos sesiones a ciegas, **diez publicaciones**. Diez titulares que salieron:

1. «Hidrovoltia lanza una opa sobre Banco Robledal.» → **3 lectores** («Tres otra vez. Ya nos conocemos los tres.»). La honesta no la lee nadie: el chiste de tesis, bien colocado de primero.
2. «Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las…» → **260.000**, «PICO DE LA NOCHE». *Sonrisa.*
3. «Las personas que hablan con los mejillones de lata tienen esto en común, según la psicología» → 110.200, «NADIE LO SABÍA». ***Carcajada.***
4. «El truco de la bola de papel de aluminio para Hacienda» → 25.500, «TRUCO DE TODA LA VIDA». *Sonrisa.*
5. «Dejé a la opa de Hidrovoltia hace un año y esto es lo que aprendí» → 110, «SOLO LOS DE HIDROVOLTIA». ***Carcajada.***
6. «Las 5 señales de que la hipoteca se ha puesto mala» → 35.600, «SEÑALES INEQUÍVOCAS». *Sonrisa.*
7. «Alerta naranja por el Euríbor en media España» → 24.300, «ANTES DE LAS OCHO (SON LAS 20:59)». *Sonrisa* (por la etiqueta).
8. «Qué le pasa a tu cuerpo si comes el PIB todos los días» → 2.250, «SECCIÓN DE ECONOMÍA». ***Carcajada.***
9. y 10. Las quintas publicaciones de cada sesión: **no pude leerlas**, el panel se cierra a los ~1,2 s (`pecera.titulador.js`, `api.wait(1200)` tras la última).

**Juicio.** Es el mejor añadido desde la crítica 4. Tiene cosas muy buenas:

- La gramática de plantillas (autoridad × asunto × gancho, 1.344 combinaciones) produce frases verosímiles que son a la vez sátira exacta de Discover. Me reí **tres veces de verdad** y sonreí en casi todas.
- Las etiquetas bajo la cifra («SOLO LOS DE HIDROVOLTIA», «SECCIÓN DE ECONOMÍA») son a menudo mejores que el titular.
- Yoli comenta con su voz («No dice nada y lo lee media España. Me tiembla el párpado.»).
- Encaja en la trama: la opa menguante, «en la dirección web, donde no molesta», el epílogo con «tus persianas: un millón cien mil».

Tiene tres pegas:

1. **La quinta publicación se pierde.** Es un fallo, no una decisión.
2. **No hay meta visible.** El récord personal está, pero el récord de la casa y la ley que E4 quiere que el jugador descubra («cuanto menos dice, más entra») solo se intuyen por los comentarios de Yoli. Yo no supe si lo estaba haciendo «bien».
3. Tras dos sesiones ya conocía la mayoría de las piezas de gancho: **rejugable unas 3 sesiones, no más**. Para un minijuego opcional dentro de una aventura, es la medida justa.

---

## 5. Puzles

### 5.1 Uno por uno (a ciegas)

| # | Puzle | ¿Deducción u obediencia? | Justicia | Atasco a ciegas |
|---|---|---|---|---|
| 1 | Torno: chicle → tarjeta → casilla VACANTE → torno | Deducción guiada (Bruno telegrafía «para pegar algo») | Justo | No |
| 2 | Silla: chaqueta → perchero (rechazo que orienta) → Lector Medio | Deducción guiada | Muy justo | No |
| 3 | Café: saludar a Gertrudis (dos veces para los chismes) | Obediencia (Celestino lo dice) + descubrimiento | Justo | No |
| 4 | Aurora: café → ficha | Obediencia (cartel) | Justo | No |
| 5 | **Estampida**: punto 3 → Gervasio «los conectados» → tele «wifi y rencor» → Gertrudis → tele | **Deducción lateral real**, la mejor del Acto II. El riesgo 1 de la E5 (el salto «conectados → Gertrudis») **se supera a ciegas**: la línea de la tele basta | Justo | No (≈4 min, sobre todo en paseos) |
| 6 | Atasco de Mercados | Ni una cosa ni otra: **no se percibe como jugable** | — | — |
| 7 | Duelo de Maripaz + ficha como remate | Emparejamiento + remate deducible | Justo; perder es barato | Perdí 1 |
| 8 | **CMS**: registro (ticket 3) + brida R-3 + pósit del regletero / o el apagón | **Deducción real** por cruce de tres pistas (o por eliminación) | Muy justo | No |
| 9 | Nota de gasto con Begoña (sobre de azúcar → «enséñeme una bien hecha») | Exploración de árbol; da dos objetos | Justo | No |
| 10 | Escuchar a Evaristo hasta el final | Paciencia (castiga «¿Falta mucho?» con un corte suave) | Justo | No |
| 11 | Copias rechazadas como papel de fax | **Deducción** (la mejor conexión entre salas) | Justo | No |
| 12 | Ticket 0.441 (pegatina del fax) | Deducción ligera | Justo | No |
| 13 | Dos fuentes → Aurora | Obediencia | Justo | No |
| 14 | Pieza de 31 líneas, sobra 26 % → Begoña | **Deducción** (cartel del recorte estándar) | Justo | No |
| 15 | Duelo de Teodoro + manual del fax | Emparejamiento + remate deducible y bonito | Demasiado corto | No |
| 16 | Armario 27: tirar del papel | Siembra en el II («alguien tira más fuerte») + aviso en el III: **resuelto** | Justo | No |
| 17 | Álbum de Eventos | Obediencia (Zacarías lo pide) | Justo | No |
| 18 | **Columna del kanban**: rotulador de Maripaz + SALIDA EN VALOR | **Deducción doble**: dónde hay un rotulador (el termómetro «pintado a rotulador», visto en el Acto II) y qué columna acepta Anselmo («la escribió Zacarías → es de la casa») | Justo, pero la pista del rotulador es una sola línea vista 40 minutos antes | **Sí, ≈6 min, 2 pistas** |
| 19 | Duelo de Gervasio + fotocopia | Remate obvio (la fotocopia es suya) | Trámite | No |
| 20 | Clímax: 6 asaltos con ticket nº 1, acta y correo | Remates deducibles; el correo, telegrafiado (Aurora dice cuándo) pero ganado | Justo y satisfactorio | No |
| 21 | Empujar al Lector Medio | Señal por megafonía | Resuelto | No |

**Balance.** ~**10 pasos de deducción real** (1, 2, 5, 8, 11, 12, 14, 18, 20 y en parte 9), ~**7 de obediencia** y **4 duelos**. La crítica 4 contaba 6 frente a 10+. El Acto III ya pide algo (la columna) y el Acto II tiene su puzle lateral (la tele). Es un salto claro.

### 5.2 Pistas

Usé **2 de 2 posibles** en el rotulador:

- **Nivel 1:** «Si en un tablero no hay sitio para lo que quieres, hijo, haz tú el sitio.» No me ayudó: ya sabía que había que escribir una columna; me faltaba el objeto.
- **Nivel 2:** «Una columna nueva se escribe con rotulador. La de los anuncios tiene uno.» Resolvió.

La escala sigue siendo algo plana: el nivel 1 repite lo que ya dijo Anselmo. Pero las pistas siguen siendo un placer de oír (el chiste de Evaristo y la tilde de Remedios). La ficha de la página 7 y «Mirar a Bruno» dan siempre el objetivo vigente: la orientación es de 9.

### 5.3 Duelos

- **Maripaz.** Vistoso y con remate de objeto. Perdí el primero por falta de réplica, sin coste.
- **Teodoro y Gervasio.** **Son un trámite**: 2 y 1 asaltos antes del remate. Con el sistema de cabecera, copia y «Asignado a: B. Pollejo», un duelo de un asalto apenas se nota como duelo.
- **Clímax (Íñigo).** Muy bueno: seis asaltos, tres adjuntos, y cada réplica es una que te ha contado un personaje durante la tarde. Es el «insult sword fighting» bien entendido.
- **Comodín y flojas.** El comodín no penaliza la primera vez y las flojas sí, pero el jugador no puede saber cuál es cuál. Daría igual si las dos fueran gratis o si el comodín se marcara («[comodín]»).

---

## 6. Estado de cada punto de la crítica 4

### 6.1 Los diez cambios prioritarios

| # C4 | Cambio | Estado | Cómo lo sé |
|---|---|---|---|
| 1 | Estampida como puzle de situación | **Resuelto** | [J] la resolví a ciegas por Gertrudis y la tele; [C] E5 §2.1 |
| 2 | Antipatrón del armario 27 | **Resuelto** | [J] «Desde dentro, alguien tira más fuerte» en el II; en el III, al primer tirón |
| 3 | Romper el molde con formas nuevas | **Parcial** | [J] hay formas nuevas (tele, apagón, columna, titulador); [C] el remate seco sube al 21,8 % y el año como chiste a 66 (§4.5) |
| 4 | Dos o tres piezas de situación largas en II-III | **Parcial** | [C] apagón jugable, atasco con tres vías, Mercados con nombre. [J] **no vi ninguna de las dos piezas**: el apagón se salta y el atasco no se anuncia |
| 5 | Cortar viajes en el Acto II | **Parcial** | [J] el ascensor con atajos se usa siempre y ahorra mucho. Pero la estampida añade un ida y vuelta Sala ↔ Vending (seis cambios de sala) y el recorte sigue exigiendo subir a la planta 2 |
| 6 | Señal tras el clímax | **Resuelto** | [J] la megafonía a los 10 s me orientó a la primera |
| 7 | Que el Acto III pida algo | **Resuelto** | [J] la columna me atascó 6 min: ahora es puzle de verdad |
| 8 | Arco del coro y eco de Anselmo | **Resuelto** | [J] «Hemos sido nosotros. —No lo repitas.»; [C] la frase del prompt solo una vez (E5 §2.8) |
| 9 | Repeticiones literales y muletillas | **Parcial** | [T] criatura 13→6, chaval 22→11, frente 3→2, F6/F7 resueltos; murmullos duplicados 84→85 sin tocar («Lo que diga el Lector Medio.» ×8) |
| 10 | Táctil y lote pequeño | **Casi todo** | [C] F9 (Custodia) y N6 (Aurora) resueltos, F8 en motor (`movil` OK); N9 sin tocar (decisión E5: «nada») |

### 6.2 Fallos de la crítica 4

| # C4 | Fallo | Estado |
|---|---|---|
| F1 | Acción negada que luego es solución (armario) | **Resuelto** [J] |
| F2 | Momento muerto tras el clímax | **Resuelto** [J] |
| F3 | Doble clic se para en el borde | **Resuelto** [C] (`Mov.paradaBorde`, E5 §6.8); no lo noté jugando |
| F4 | Teletransporte al entrar en la Redacción | **Resuelto** [J] (no lo vi; `junto()` con paneo) |
| F5 | Murmullos idénticos en varias salas | **No** [C] 85 cadenas duplicadas |
| F6 | «Posando» dos veces | **Resuelto** [C] (solo en `items.js:341`) |
| F7 | Anselmo repite la frase del prompt | **Resuelto** [C] |
| F8 | Hotspots pequeños en táctil | **Resuelto en motor** [T] (`movil` OK); no lo verifiqué con el dedo |
| F9 | Árbol de Custodia que se cierra | **Resuelto** [J] |
| N6 | Aurora y los «!!» de Tadeo sin contexto | **Resuelto** [C] (`catacumba.js:865`, `rvLeido`) |
| N9 | Comillas anidadas | **No** (decisión E5: nada) |
| Táper de Rubén | Cabo suelto | **Resuelto** [C] (táper huérfano → Zacarías; también en el final) |
| Mercados sin nombre | — | **Resuelto** [J] |

---

## 7. Fallos nuevos (y técnica)

**Pruebas** [T]:

- `node tools/test-all.mjs`: **TODO OK (20) en 1.036 s**. Destacan play-mouse 77 comprobaciones, fase0 92, e5 17, e4 22, extras 100 pasos, walkthrough 50 pasos en los dos órdenes, fuzz 53, comedia p1-p4 17/21/97/146 y critica3 28.
- `node tools/text-audit.mjs --estatico --plan --e2 --e5 --recuento`: **PLAN: OK, E2: OK, E5: OK**.
- Partida a ciegas completa y tramo en móvil: **cero errores de consola y de página**.

| # | Gravedad | Descripción | Reproducción |
|---|---|---|---|
| N1 | **Media (UX)** | La 5.ª publicación del titulador cierra el panel a ~1,2 s: no se lee ni el titular ni la cifra | Escribir la pieza → Usar monitor de Yoli → publicar 5 veces. `img/10_titulador_quinta_se_cierra.png`; `pecera.titulador.js` (`if (st.pubs >= PUBLICACIONES …) await api.wait(1200)`) |
| N2 | **Media (diseño)** | El apagón, la mejor pieza de situación nueva, se puede saltar entera: quien lee el registro va al regletero y nunca lo ve | Acto II: Sistemas → Mirar registro → Usar regletero → R-3, sin haber tirado del enchufe |
| N3 | **Media (diseño)** | El atasco jugable no se anuncia: tras «¡Tengo doble prioridad!» el control vuelve en silencio y a los 10 s se resuelve solo | Usar la tele con la pregunta de Gertrudis enviada y no tocar nada |
| N4 | Baja-media (UX) | «Mirar a Bruno» falla si Bruno está sobre otro hotspot: describe la cinta o la puerta | Redacción, Bruno sobre la cinta de carrocero (x≈900) → Mirar → clic en Bruno. También en la puerta de la Sala Amazonas |
| N5 | Baja (UX) | Si Bruno tapa a un actor, «Hablar con» ese actor cae en Bruno y no pasa nada, sin mensaje | Redacción, Bruno de pie delante de Leoncio → Hablar → clic en Leoncio |
| N6 | Baja (texto) | Revelación del armario sobreexplicada (Herminia + Leoncio + Bruno «Eso es un compañero» + Evaristo) | Acto III, entrar en la Redacción y bajar a Sistemas |
| N7 | Baja (texto) | Bruno explica la columna («La frase con la que Íñigo despide…») | Columna SALIDA EN VALOR |
| N8 | Baja (legibilidad) | El cameo mudo de Valentín se lee como diálogo roto | Hablar con Valentín la primera vez |
| N9 | Baja (texto) | «Huele a 2019» literal dos veces (chaqueta y silla) | Coger la chaqueta; arrimar la silla |
| N10 | Cosmético | Ids internos `paco_ticket` y `ruben` (Eutimio y Zacarías) | `window.__game.state()` |
| N11 | Baja (heredado C4) | Táctil con DPR 1: el lienzo queda a 1× (320×200) en 844×390 | Emulación táctil con `deviceScaleFactor` 1 |

No he encontrado bloqueos ni estados imposibles. La técnica es sólida y la batería de pruebas, de las mejores que he visto en un proyecto así. Como en la crítica 4, conviene saber qué no mide: ninguna prueba detecta que una pieza de comedia se pueda saltar (N2), que pase desapercibida (N3) o que un remate se explique (N6, N7).

---

## 8. Los diez cambios prioritarios (por impacto en la diversión)

1. **Que todo jugador vea el apagón** (N2). Si se entra al regletero sin haber visto el apagón y se apaga la R-3, que la propia R-3 lo dispare. Un corte de 6-8 s a la Redacción a oscuras con las líneas que ya existen: Yoli «¡Estamos ciegos!… ¡Ha entrado una pieza!», «Diecisiete. Dieciocho.» y la linterna de Anselmo. Después, vuelta a Sistemas con «CORO: ¡Ha sido Diseño!». No hay gate ni línea nueva, y se recupera el mejor gag del Acto II para quien deduce.
2. **Anunciar el atasco** (N3). Un plano de 1 s sobre la puerta y una línea de Bruno, por ejemplo «Están encajados. Alguien tendría que hacer algo.». Subir el plazo de 10 a 20 s de tiempo quieto. Así las tres vías (empujar, medio cruasán, «¿Y la próxima reunión, cuándo es?») se juegan en vez de perderse.
3. **Quitar el último ida y vuelta de la estampida.** Proponer que, una vez sintonizada, **la tele de la Sala sea Gertrudis**. Primer Usar tele: aparece «BUENAS NOCHES, PAÍS» (lo dice si ya es viral). Hablar con la tele: Bruno le hace la pregunta allí mismo. Se conserva la deducción («los conectados» → la cafetera viral sale en las pantallas) y se ahorran seis cambios de sala. Si se quiere mantener el viaje al Vending, que sea opcional.
4. **Dar cuerpo a los duelos de Teodoro y Gervasio** (§5.3). Teodoro: tres asaltos, y que una réplica tenga que «caber» (el fax corta lo que pasa de N caracteres y el jugador elige la versión que cabe), un gag de interfaz con su obsesión. Gervasio: dos asaltos con frases que no acaba y que Bruno termina con la réplica. Sin tocar el resultado ni los remates.
5. **Desmasticar la revelación del armario** (N6). Quitar «Eso no es un modelo. Eso es un compañero.» (`pecera.escenas.js:471`) y mover la llamada de Evaristo por los atunes a **después** de abrir el armario, como remate («Alguien come ahí abajo y no cobra. —Ya lo sé. Se llama Zacarías.»). Basta el gráfico de Herminia para que el jugador sospeche solo.
6. **Bruno deja de explicar** (N7). Quitar `pecera.dialogos.js:350`. Hacer una pasada con grep por las líneas de Bruno que empiezan por «Eso es…» o «O sea…» tras un gag ajeno: dejar el silencio, una acción («(Bruno mira la columna. Mira el rotulador. Se lo guarda.)») o una reacción de un tercero.
7. **Titulador: arreglar la quinta y darle meta** (N1). Que la última publicación espere un clic («Haz clic para cerrar») y que el pie muestre el **récord de la casa** («RÉCORD DE LA CASA: 1.100.000 · Confirmado: el Euríbor sube, baja o se queda igual»). Si se supera, Yoli tiene una línea y la pantalla de métricas un fogonazo. Así la ley de E4 («cuanto menos dice, más entra») se convierte en objetivo.
8. **Atacar el molde de cierre seco donde más se oye.** Bajar el remate de 1-3 palabras del 22 % al 15 % en las salas de paso (Redacción, Vending, Despachos) cambiando la forma, no la palabra: interrupción, réplica de un tercero, acción, silencio. Además:
   - año como chiste: de 66 a ~40, y fuera el segundo «Huele a 2019»;
   - «táper»: de 33 a ~15 (que vuelva a ser pista y no muletilla);
   - «D3: No.»: de 11 a 6;
   - murmullos duplicados: de 85 a 0 (sobre todo «Lo que diga el Lector Medio.» y «Diecinueve años»).
   Y que el auditor mida el porcentaje de remate seco por sala como aviso, no como tope.
9. **Dar una segunda pista del rotulador en el mundo** (puzle 18). En el Acto III, que Mirar el termómetro de ventas diga «Pintado a rotulador. El rotulador cuelga de un cordel, como un boli de banco», y que Anselmo, al rechazar escribir la columna, añada «Con mi rotulador, no. Busca uno que pinte objetivos». Que la pista 1 de la abuela sea sobre el objeto, no sobre la idea.
10. **Lote de interfaz**:
    - que el clic sobre Bruno tenga prioridad sobre el hotspot del suelo o la puerta (N4);
    - que «Hablar con» un actor tapado por Bruno funcione o diga algo (N5);
    - que el cameo de Valentín se lea (N8): un sfx de casco y un globo vacío «…» de Valentín antes del «…Nada. Perdone.» de Bruno;
    - marcar el comodín del duelo como tal.

---

## 9. Qué le falta para un 8,5 y para un 9

**Dónde está.** Es un 8,0 sin discusión. Es ya una aventura que recomendaría a quien guste del género y entienda una redacción. Escribe mejor que la media de los indies de este tamaño, su final es de los que se recuerdan y tiene un sistema propio (los duelos por correo) con un clímax a la altura. Lo que la separa del 8,5 ya no es la limpieza ni la justicia, sino **que lo mejor que se ha añadido no llegue a todos los jugadores** y que el Acto II siga teniendo un tramo de recadero.

**Para el 8,5** (cambios 1-6 de §8):

1. **Que las piezas de situación se vean siempre**: apagón y atasco (cambios 1 y 2). Con eso, el Acto II pasa a tener tres momentos de los que provoca el jugador (tele, apagón, atasco) en vez de uno.
2. **Un Acto II sin el ida y vuelta de la estampida** (cambio 3). Es lo último que me sacó del juego.
3. **Cuatro duelos que se sientan como duelos** (cambio 4). Hoy dos son un adjunto con prólogo.
4. **Las sorpresas, sin masticar** (cambios 5 y 6). El armario y la columna deben llegar al jugador como descubrimiento, no como explicación.

**Para el 9:**

1. **Variedad de forma del chiste de verdad**: que el remate seco baje del 15 % y que haya un 30 % de comedia de situación, interfaz o acción. Ya tiene las herramientas (megafonía, apagón, tele, fax, titulador); falta usarlas más allá de un momento por sala.
2. **Una secuencia firma de las que se cuentan**, como la de «Monkey Island 2» con el escupitajo o la del hámster en «Day of the Tentacle». Los candidatos que ya existen son el titulador como arma del clímax (que el último asalto contra Íñigo se gane publicando un titular) o el bucle de respuestas automáticas del fax llevado a escena entera.
3. **Oír el audio y evaluarlo.** No he podido. En el género pesa, y la nota sigue provisional.
4. **El titulador con meta y con eco en el final**, para que el minijuego no sea un juguete sino parte del arco de Yoli.

Con 1-4 de la lista del 8,5 el juego está en 8,5. Para el 9 hace falta, sobre todo, la secuencia firma y que el molde de cierre seco deje de ser la forma por defecto.

---

## Apéndice

- **Capturas** (`img/`, `deviceScaleFactor` 1 salvo las de móvil, tomadas a DPR 3 y reducidas a tamaño CSS):
  `01_titulo`, `02_torno_vacante`, `03_lector_medio_chaqueta`, `04_estampida`, `05_duelo_maripaz`, `06_sistemas`, `07_titulador_mejillones`, `08_titulador_opa`, `09_titulador_tres`, `10_titulador_quinta_se_cierra`, `11_climax`, `12_tras_climax`, `13_tarjeta`, `14_redaccion_desarrollo`, `15_redaccion_papel`, `16_movil_horizontal`, `17_movil_menu`, `18_apagon_fase2` (este, de la fase 2).
- **Material de trabajo** (fuera del repositorio, en el directorio temporal de la sesión): el controlador de Playwright, las notas crudas de la partida, el extractor de 4.216 cadenas y el script de recuento de §4.5.
- **Herramientas del repositorio ejecutadas**: `tools/test-all.mjs` (completo; deja sus registros en `tools/shots/test-all/`, como siempre) y `tools/text-audit.mjs --estatico --plan --e2 --e5 --recuento`. No he modificado nada fuera de `docs/informes/critica5/` ni he hecho operaciones de git.
- **Documentos leídos en la fase 2**: la crítica 4 entera, la ENMIENDA E5 (§1-§3, §5, §9.3 y §12.4), el arranque de la E4 y las partes del contenido citadas. **No he leído enteros** PLAN_COMEDIA (3.406 líneas), E2, E3 ni las críticas 2 y 3: las cifras de esas críticas proceden de la tabla de la crítica 4, que las resume.
