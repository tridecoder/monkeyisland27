# CRÍTICA 4 — «FE DE ERRATAS»

> Crítica independiente. La sección 3 (partida a ciegas) se escribió **antes** de abrir `docs/`, `content/` o las
> herramientas de recorrido, y no se ha retocado después. Las secciones 1, 2 y 4–9 son de la Fase 2 (con todo abierto:
> guion vigente, enmiendas E1-E3, críticas 1-3, contenido, recorrido con extras, `test-all` y auditor de textos).
> Etiquetas: **[J]** jugado · **[C]** leído en contenido/código · **[T]** herramienta.

## 1. Veredicto en cinco líneas

**Mejor que la versión de la crítica 3, pero por pulido, no por salto.** Se han arreglado de verdad casi todos los
fallos de aquella (el atasco de la réplica del ordenador, «Mirar a Bruno» desfasado, el fax tapado por Aurora, la rama
del organigrama, la salida de los Despachos, el coro hablando a distancia) y la E3 ha podado las fórmulas señaladas
(«lo único» 57→6, «no se X. Se Y.» 35→5, «factur…» 31→9). A ciegas me reí más (14 carcajadas frente a 10) y me atasqué
menos (3 min frente a 20). Pero el chiste sigue teniendo **una sola forma** (frase + coletilla corta: «Con coma.», «Y
ahorrar.», «Sin excepciones.»), el Acto II sigue siendo un ir y venir de ascensores y el Acto III apenas pide pensar.

## 2. Notas

| Apartado | Crítica 1 | Crítica 2 | Crítica 3 | **Crítica 4** | Por qué |
|---|---:|---:|---:|---:|---|
| Comedia y guion | 6 | 6,5 | 7,0 | **7,5** | Fórmulas podadas de verdad; más carcajadas a ciegas; aparece un tic nuevo (la coletilla) |
| Puzles y diseño | 6 | 7,0 | 7,0 | **7,0** | Más justo (sin la trampa R11, pistas que dicen dónde), igual de llano; una acción negada que luego es la solución |
| Historia y estructura | 6 | 7,5 | 8,0 | **8,0** | Igual de redonda; los añadidos de Maripaz no cambian el arco |
| Interfaz y usabilidad | 6 | 7,0 | 7,0 | **7,5** | «Mirar a Bruno» es ya una brújula fiable; directorio con atajos; móvil a pantalla completa. Siguen los paseos |
| Apartado visual | 8 | 8,0 | 8,0 | **8,0** | Sin cambios apreciables |
| Audio (provisional, no oído) | 6 | 6,5 | 6,5 | **6,5** | No he podido oírlo; mantengo la cifra como referencia, no como juicio |
| Técnica y estabilidad | 8 | 8,0 | 8,5 | **8,5** | `test-all` 18/18 (ver §7); cero errores en mi partida completa, en el tramo móvil y en los 79 pasos de extras |
| **Global** | **6,5** | **7,0** | **7,5** | **7,5** | Un 7,5 alto. Para el 8 falta lo de §9: picos de comedia de situación y un Acto II menos de recadero |

No subo el global: lo arreglado eran defectos, no techo. El juego es hoy más limpio y más justo; no es todavía más
divertido en la misma proporción.

---

## 3. Notas de la partida a ciegas (tal cual)

### Cómo jugué y qué ayudas usé (declaración)

- Chromium con Playwright, servidor estático propio (que además devolvía 404 a `/docs`), **ratón real**: todos los
  verbos, objetos, diálogos y duelos se han hecho con clics en el lienzo (y con las teclas 1-9 para elegir opciones de
  diálogo, que el README documenta). Capturas a 2× con `deviceScaleFactor` 1.
- **Lo que leí antes de terminar**: `README.md`, `tools/serve.mjs`, y del motor `engine/main.js` (la API de pruebas,
  para saber qué estado leer) y `engine/core.js` (solo `resize()` y el registro de líneas). Nada de `docs/`, `content/`
  ni de las herramientas de recorrido/pruebas.
- **Estado leído**: el registro de líneas dichas (lo mismo que sale en pantalla, para no perder bocadillos), la sala,
  el inventario y la frase de la línea de acción. **Ventaja declarada**: en vez de buscar píxeles con el ojo, barría la
  pantalla con eventos `pointermove` y leía la línea «Ir a …» para listar los puntos calientes visibles. Es lo que haría
  un jugador pasando el ratón, pero sin cansarse: un humano tardará más y se le escaparán objetos pequeños.
- **Fuga en el primer duelo**: mi script volcó en consola el estado del duelo de Maripaz en su primer asalto, incluido
  `correctIndex: -1`. Eso me dijo que ninguna de las cinco respuestas valía, y por eso elegí la floja. Corregí el script
  al momento; no volví a ver índices correctos.
- **Duelo de Gervasio**: elegí con un bucle de «opción 0» por prisa; coincidió con las respuestas que habría elegido
  (los emparejamientos eran evidentes). Lo declaro igualmente.
- **Pistas del juego**: **3 llamadas a la abuela**, las tres en el mismo atasco (armario 27). Usé «Mirar a Bruno» 6-7
  veces como brújula de objetivos y la ficha de la página 7 3 veces.
- **Tiempo**: 117 minutos de reloj desde «Nueva partida» hasta los créditos, conduciendo con scripts (que añaden y
  quitan tiempo a la vez). Estimo **100-120 min** para un jugador fluido que no lo agote todo y **2,5-3 h** para uno
  que lo pruebe todo con calma.

### Diario (minuto aproximado)

- **0 · Título.** La portada de periódico con el «Pellizco» tachado y la fe de erratas es una carta de presentación
  excelente. El reloj 20:59 en una esquina, bien.
- **1 · Intro con la abuela.** «En el de papel, digo. En el de verdad. El que mancha» (sonrisa). «Ya está. Lo he dicho
  en el grupo del pueblo» (sonrisa). Funciona: en un minuto sé qué quiero (firmar en papel) y por qué importa (la
  abuela).
- **1-8 · Vestíbulo.** Celestino como locutor deportivo del Ibex es un acierto inmediato: «Pues no te ha visto ni el
  torno», «Entra un becario. Pregunta tonterías. ¡Partidazo!», «El mostrador, cuarenta. Tiene peor rodilla».
  **Carcajada 1**: el cotilleo del ascensor, «de aquí no sale ni el wifi… ¡Tres años sin hablarse! ¡Y el wifi sigue
  sin salir!». Objetos con buenas líneas: ficus de plástico «la que más tiempo lleva en plantilla», «Aquí todo está
  inventariado menos yo», «Ha sobrevivido a tres ERE». Correo de Eventos «reenviado cada cinco minutos desde [marzo]…
  Ya no sé si llego tarde o si no empieza» (sonrisa).
  **Puzle 1** (chicle + tarjeta + casilla VACANTE del organigrama → torno): 8 minutos sin pistas. Bruno telegrafía el
  chicle («o para pegar algo»), pero el razonamiento es del jugador. **Carcajada 2**: «BIENVENIDO, VACANTE. —…Vacante.
  Bueno. Es un cargo.»
- **9-11 · Escena de Íñigo en la Redacción.** Presentación clara del conflicto (Titulator, Plan Cero Papel, Reunión de
  Dirección a las nueve). «Senior en becario», «Entonces no es una IA. Es un hobby», «Esto, en tarta pero triste».
  «Reimaginar el perímetro» es tópico de consultor ya muy visto.
- **11-28 · Redacción (1.270 px) y Despachos.** El departamento de Desarrollo se lee bien: Anselmo y tres espaldas
  («Las manos están enfadadas»). Kanban con columna «HECHO (PERO NO)» y el pósit «Contratar al becario de marzo – 1998»
  (lo apunto: luego paga). Anselmo: «Lo vacío no se integra, pero tampoco molesta», «El modelo es de fuera. El prompt es
  de dentro. Eso lo hace nuestro». **Carcajada 3**: «Tráeme el contexto. Le hago una pieza aparte: “El contexto,
  explicado”». El coro: «Le he explicado a Yoli su artículo… —Lo ha entendido a la primera. —Es que lo escribí yo.
  Ayuda bastante».
  Leoncio e Infografía: personaje melancólico que funciona. «Me duele, pero me incluyo», «En su tipografía, que es fea»,
  **carcajada 4**: «Ya lo ha hecho. En septiembre. No se lo he dicho a nadie. Ni a ella. Es muy sensible a los datos».
  Herminia como portátil que habla en líneas de log («HERMINIA (IA) › saludo recibido · hola: 100 %») es un objeto con
  carácter sin ser personaje: bien resuelto.
  **Puzle 2** (silla): Coger la chaqueta → Yoli avisa «que sea para dejarla en un sitio con más autoridad» → el perchero
  la rechaza orientando («Encima de alguien que asiente») → chaqueta al Lector Medio de cartón pluma. Justo y gracioso:
  «…Ramírez. Ha vuelto. Y asiente. Lo subo a “Ideal”». Despachos: «Soy el empleado perfecto. No existo», informe en
  blanco «Se nota que lo ha validado».
  **Problema de ritmo**: la Redacción es enorme y el doble clic para correr solo te lleva hasta el borde de la pantalla.
  Cruzarla son 5-8 clics. Lo noto ya en el minuto 20 y se agrava en el Acto II.
- **28-37 · Vending y Redacción de papel.** Gertrudis (cafetera con rencor) es de lo mejor del juego: **carcajada 5**
  «TENGO WIFI Y RENCOR»; «Te miro hueco para anteayer», «pero en tabla dinámica», «NO HAY MÁS CAFÉ. HAY FAMA»; pantalla
  «PRECALENTANDO RENCOR». El hilo del yogur: «Lo leímos todos. Por eso no contestó nadie». Las réplicas para los duelos
  salen del cotilleo de forma natural: muy bien integrado.
  Redacción de papel: galeradas «como jamones, curadas en tinta», «El bigote también era de plantilla», la tableta del
  corrector IA «calza el Libro de Estilo. Por fin sirve». Aurora es el mejor personaje escrito: «Este café está mal
  escrito, pero se entiende», la coma de 1989 «que no pasó nada y yo lo sé», **carcajada 6** «No me ha vuelto a dirigir
  la palabra. Han sido treinta años muy buenos», «Nueve verbos y ni un subjuntivo», «Eso no es entusiasmo, criatura. Es
  inglés». Pero ya noto el «criatura» en casi cada intervención.
  Fin del Acto I en el minuto 37; la ficha HUECO / FUENTE / FIRMA ordena el Acto II con claridad.
- **44-51 · Sala Amazonas y primer duelo.** «Cuando empezó la reunión, era lampiño», el cable «que encaja consigo
  mismo. Lo dejo así: es feliz». Gervasio con frases sin acabar es un buen tic. La estampida se resuelve eligiendo
  «¿y cuáles son los siguientes pasos?», que es literalmente lo que Aurora acababa de decir: **demasiado fácil**.
  Maripaz: **carcajada 7** «—La X mide un píxel. —La semana pasada medía dos. Optimizamos». «Eso no es un cliente,
  cariño. Es un exnovio». El duelo «Responder a todos» luce muy bien (cabecera de correo, «Asignado a: B. Pollejo»).
  3-1 a la primera. Remate con la ficha sellada → hueco libre. Bruno sale con un anuncio pegado en la espalda (detalle
  bonito que otros personajes comentan).
- **52-58 · Sistemas.** Paco Ticket está muy bien: «No es intuición: es fontanería», «Asignado a: nadie. Es el más
  estable que tengo», «Me entero de todo. No arreglo nada. Es el equilibrio», **carcajada 8** «Puestas. Ahora se ve
  perfectamente que no hay carretera», «No, el wifi no se ha caído. Has dejado de merecerlo». La regleta R-3 es un
  puzle trivial: el registro de tickets te dice exactamente qué apagar. Recompensa simpática: «CORO: ¡Ha sido Diseño!
  —(a la rejilla) He sido yo. Pero gracias».
  **Fórmula repetida**: «No escucho. Oigo» (Paco) es el mismo chiste que «Las paredes no oyen. Oigo yo» (Custodia).
  «Las demás páginas son fotos del fax. Posando» se dice dos veces casi seguidas.
- **59-72 · Planta 2 y Administración.** Las frases del espejo del ascensor varían y son buenas («Para que el becario se
  vea subir, aunque sea aquí»). Pizarra SINERGIA «si la miras fijamente, aparece un velero». Plátano «para Gervasio
  (plaza 7). Gervasio no imprime nunca. El plan tiene un fallo». Maripaz en su sitio sigue siendo fuerte («Esto. Ya lo
  has consumido. Son doce euros», «mientras lo cierras, no te das cuenta»): la he entendido como la jefa del inventario
  publicitario, y todo lo suyo gira en torno a vender huecos. Bien.
  Begoña: «Varios» → sello RECHAZADO en la frente: «Mi primer documento oficial. Con sello». **Carcajada 9**: la
  pregunta recortada un 26 % por abajo, «No lo sabremos nunca. Así es más limpio». «Si lo aprobara, tendría que
  justificar la caída». El árbol de la nota de gasto (concepto, importe, justificante = sobre de azúcar) está bien
  armado y termina dando dos cosas útiles (la fotocopia con el reverso de la opa y las copias que serán papel de fax).
  **Evaristo, el de las comas**: la premisa es la mejor idea de guion del juego (cláusula de «punto de miles y coma
  decimal»: «48,000» son 48 euros). «Una coma también lo era. Hasta que alguien la firmó». En persona es menos
  gracioso que su idea; su gracia está en la insistencia («¿Tiene un segundo? Son tres»).
- **73-85 · Vuelta a la planta 1.** El fax tragándose el duplicado y el triplicado con toda la tarde de respuestas de
  Teodoro en cola («SÍ. POR DESGRACIA», «VER RESPUESTAS ANTERIORES») es un buen gag de acumulación. Aurora con las dos
  fuentes: «Una anónima y otra con IVA. Me vale». La pieza en el ordenador: Herminia mide «sobra: 26 %», que enlaza con
  el recorte de Begoña: **muy buen encaje entre salas**… que obliga a subir otra vez a la planta 2 solo para eso y
  volver. Con la Redacción de 1.270 px en medio, este tramo se hace largo.
  Duelo por fax con Teodoro: 2/2. «LA MEDIA FUENTE ERA YO. NO LO REPITAS». Remate con la página 9 del manual (respuesta
  automática: «PARA CUALQUIER URGENCIA, CONTACTE CON USTED MISMO»). **Carcajada 10 y mejor momento de la partida**:
  «BRUNO PELLEJO. TRECE CON ESPACIOS. CABE. —…Lo ha escrito bien.» Tras toda la tarde de Pellizco y Pollejo, se me
  encogió algo.
- **86-101 · Acto III.** «Ha hablado. En voz alta. Delante de mí.» Herminia envuelta en cinta: «Parece un regalo. De
  nadie». **Carcajada 11**: el gráfico del Titulator, «Una IA que come a las dos y va once veces al baño». Evaristo
  cruza atunes con nóminas: «Alguien que come y no cobra. Eso es un becario».
  **Único atasco serio (min 89-92)**: el armario 27. En el Acto II ya había probado «Tirar del papel continuo» y el juego
  me lo negó («Igual es la nómina»), así que no se me ocurrió repetirlo. Pedí **las tres pistas** de la abuela: la 1
  («si de un armario sale papel, es que alguien escribe dentro») y la 2 («esos titulares salen de un armario») no me
  sacaron; la 3 es explícita («Tira del papel»). Problema clásico: una acción rechazada antes que pasa a ser la
  solución sin que nada te invite a repetirla.
  Rubén, el becario de verano que *era* el Titulator, habla en titular de clickbait: «LO QUE PASÓ DESPUÉS TE
  SORPRENDERÁ», «No me encerró. Me dio una silla y wifi. Yo pensé que era un contrato», «UN BECARIO VIVE EN UN ARMARIO.
  EL 4 TE SORPRENDERÁ. —Mejor. —…Ya hablo como tú». Muy bueno.
  Paco da de alta a Herminia «como herramienta»: «Esta casa da de alta antes a un portátil que a un chaval». Eventos
  (Pilar) se mantiene simpática («La ocupación media es Pilar», «Es cinta hasta el fondo»), pero el álbum se consigue
  con una pregunta: sin puzle. Anselmo + álbum + «descopear» (palabra aprendida de un móvil que publica solo en Eventos)
  → Rubén liberado. «Integró una IA que era un becario. Y rechaza una IA que es una IA». **Cabo suelto**: Rubén me
  pidió un táper y nunca hizo falta.
  Ya son tres los personajes que comentan el «RECHAZADO en la frente» (Evaristo, Paco, Pilar): la reactividad se
  agradece, pero a la tercera es plantilla.
- **102-107 · Acta y clímax.** Duelo con Gervasio por el acta; remate con su propia nota de gasto («Se comió. Pero no
  se habló. Bueno. Se habló un poco»). Reunión de Dirección: «Los becarios no tienen voz. —Pero tienen correo. Respondo a
  todos». Duelo final a 5 con dos remates. **Carcajada 12**: «—Hola. Soy la inversión. —…Eso es una alucinación. —No.
  Es un becario. Es más barato, pero se nota». Un fallo mío en «No es un despido: es una salida en valor» (no tenía
  réplica). El correo de Evaristo como último remate está tan telegrafiado (Aurora te dice cuándo usarlo veinte minutos
  antes) que no sorprende, pero se siente ganado. «De mis tres móviles, uno es para no cogerle».
- **107-108 · Tras el clímax.** **La escena se queda quieta sin ninguna indicación**. Nadie dice nada; el Lector Medio
  está ahí, Íñigo está ahí. Solo «Mirar a Bruno» revela «Un empujoncito y deja de asentir». Yo lo saqué en un minuto
  porque llevaba todo el juego usando a Bruno de brújula; un jugador que no lo haga puede quedarse mirando la sala sin
  saber que el juego espera algo de él.
- **108-117 · Final.** Empujar el Lector Medio: «¡Penalti clarísimo!», «Lo que diga el árbitro», «Es la primera vez
  que la matriz me pone en algún sitio». Íñigo era el becario de marzo del 98 (paga el pósit del kanban: gran
  callback) y la línea «—Yo no voy a hacer eso. —Eso dije yo. Con esas palabras» tiene veneno de verdad. Celestino:
  «Ya te ve hasta el torno». La abuela: **carcajada 13**, «Ay, hijo. El papel lo dejé en 2011, que me manchaba el
  sofá», y «¡Me ha contestado el periódico!» (tierno). Tarjeta final, **carcajada 14**: «Lamentamos el acierto».
  Créditos cortos con «Asignado a: el equipo de guion (tras tres reuniones rápidas)». Final redondo.

### Recuento honesto

- **Carcajadas** (risa en voz alta o casi): **14** en ~110 min → una cada 8 minutos.
- **Sonrisas fuertes** (la línea me hace gracia de verdad): **56**.
- **Sonrisas leves** (ingenio que reconozco, sin risa): **≈80**.
- Densidad de algo-que-funciona: más de una por minuto de juego. Lo que falta no es cantidad, es **picos**: hay muy
  pocos gags físicos o de situación largos; casi todo es línea ingeniosa suelta.

### Lo que me aburrió

1. Cruzar la Redacción (1.270 px) y encadenar ascensores: planta 1 → 2 (recorte) → 1 (fax) → −1 → 2 (Eventos) → 1.
   El directorio con atajos existe, pero solo en la planta 1 y lejos de donde estás casi siempre.
2. Diálogos que se cierran tras cada pregunta (Secretaría): hay que volver a hablar seis veces.
3. Puzles de «elige la opción obvia» (estampida, álbum, regleta): el Acto III en especial pide poco al jugador.

### Líneas que chirrían

- «Vengo a reimaginar el perímetro» (consultor de manual).
- «Capacidad: ocho personas o una reunión que pudo ser un correo» (chiste de oficina de tazón).
- «El modelo es de fuera. El prompt es de dentro» dicho dos veces, idéntico, por Anselmo.
- «Las demás páginas son fotos del fax. Posando» dos veces seguidas (al recibir el manual y al mirarlo).
- El tercer «Llevas RECHAZADO en la frente».

### Fórmulas que se repiten (oído, sin contar todavía)

- «criatura» (Aurora) en casi cada intervención; «cariño» (Maripaz) igual.
- «No escucho. Oigo» / «Las paredes no oyen. Oigo yo».
- «X años sin Y» / «desde [año]» como remate (Gertrudis 2019, Rubén julio, F-1 de 1987, Teodoro 1997, 1996, 1989…).
- Personaje que dice algo y Bruno lo resume con una frase corta de tres palabras al final.
- Remates con número exacto («312 tickets», «48.212», «Trescientos dieciocho», «ochenta y tres bolis»).

### Fallos y rarezas detectados (con reproducción)

1. **Teletransporte al entrar a la Redacción** (menor, desorientador). Desde el Vending («Usar Redacción») o al llegar
   en ascensor a la planta 1 tras ciertos hitos, Bruno aparece en x≈690-790 (zona Economía/Infografía), no en la
   puerta por la que sale. Pasó al menos tres veces (tras el Vending en el Acto I, tras Administración en el II y al
   empezar el III). Parece una escena que lo coloca para un comentario de Yoli/Leoncio/Anselmo, pero no hay transición:
   se pierde la orientación. Captura: `img/10_llegada_ascensor_x690.png`.
2. **Acción negada que luego es la solución** (diseño): «Tirar del papel continuo» en el Acto II → «No tiro de algo que
   imprime solo». En el Acto III es la solución y nada (salvo la tercera pista) invita a repetirla.
3. **Fin del clímax sin indicación** (diseño): tras el último remate de Evaristo el juego espera un «Empujar Lector
   Medio» sin que nadie lo sugiera en pantalla. `img/12_tras_climax_sin_indicacion.png`.
4. **Táper de Rubén** (cabo suelto): lo pide y no se usa.
5. **Doble clic para correr** solo te lleva hasta el borde visible de la pantalla en salas con scroll; en la Redacción
   obliga a 5-8 dobles clics por trayecto.
6. Hotspots muy pequeños (taza «NO», monitor de Yoli, tableta del corrector): en mi barrido salían en 1-2 puntos de una
   rejilla de 8 px; en un móvil son blancos de 8-16 px reales.

### Tramo en móvil horizontal (844×390, táctil, dpr 3)

- El lienzo ocupa todo el alto (624×390) con escalado fraccionario: nítido y legible. El aviso de girar no aparece en
  horizontal. Con dpr 1 (portátil pequeño con pantalla táctil, o emulación) cae a escala entera ×1 y queda diminuto
  (320×200 en una ventana de 844×390); en un teléfono real no pasa.
- Verbo + objeto + inventario con toques: funciona. El puzle del torno se resuelve igual de rápido.
- Diálogos: caben 4 opciones; el resto con flechas ▲▼ a la derecha, que responden bien. Con 8 opciones (Celestino) hay
  que pulsar la flecha tres veces para llegar a «Nada, Celestino».
- Texto de bocadillos legible a esta escala. Los hotspots pequeños (ver arriba) son el único problema serio en táctil.
- Capturas: `img/14_movil_dialogo.png`, `img/15_movil_scroll.png`.

### Sobre los puntos que me pidieron mirar (impresión a ciegas)

- **Ritmo del Acto II y desplazamientos**: la estructura HUECO/FUENTE/FIRMA es clara y la ficha viva ayuda mucho; el
  problema es físico: demasiados viajes entre plantas para entregas de una línea (el recorte de Begoña es el peor).
- **Tras el clímax**: no se entiende sin «Mirar a Bruno» (ver fallo 3).
- **Directora de Comercial (Maripaz)**: de los mejores personajes. Coherente (todo es hueco, banner, pop-up), su duelo
  es el más vistoso y el más fácil. «Cariño» le sobra la mitad de las veces.
- **Desarrollo**: Anselmo + coro funciona; el coro es poco (tres frases en toda la partida). Anselmo tiene un tic
  bueno («¿De dónde viene? De fuera») y un arco con remate («Esta tarde eran de fuera. Ahora son nuestros. Se nota en el
  trazo»). Repite literal una frase.
- **Infografía y su IA**: Leoncio es el personaje con más corazón después de Aurora; Herminia como objeto con «log»
  funciona y tiene su propio arco (bloqueada → absorbida → devuelta a Infografía).
- **El de las comas (Evaristo)**: mejor idea de guion del juego; personaje algo plano en pantalla; su payoff en el
  clímax es claro y satisfactorio.
- **Duelo de correos**: vistoso y bien integrado con el cotilleo. Fácil: perdí 2 asaltos en 4 duelos, siempre por no
  tener réplica. Las pistas de la abuela no hablan de réplicas (no las necesité); la libreta lleva la cuenta (x de 16)
  pero no te dice dónde faltan.
- **Final**: redondo, con dos sorpresas de verdad (Íñigo becario del 98; la abuela no lee papel) y una tarjeta perfecta.

---

## 4. Comedia

### 4.1 Densidad de risa medida

| Medida | Crítica 3 (a ciegas) | **Crítica 4 (a ciegas)** |
|---|---|---|
| Carcajadas | 10 en ~110 min (1 cada 11 min, con 20 min de atasco dentro) | **14 en ~110 min (1 cada 8 min; atasco de 3 min)** |
| Sonrisas | «≈1 por minuto» | 56 fuertes + ≈80 leves (≈1,2 por minuto) |
| Momento emocional | Teodoro y la firma; la abuela | Los mismos, igual de eficaces |

La mejora es real pero hay que leerla con cuidado: la mitad de mis carcajadas son **las mismas líneas** que ya
señalaba la crítica 3 (Vacante, Begoña, Rubén, «Y ahorrar», la tarjeta). El aumento viene sobre todo de que el
jugador ya no pasa 20 minutos atascado sin chistes nuevos, y de que la poda de fórmulas deja respirar a las buenas.

### 4.2 Los diez mejores momentos

1. **«BRUNO PELLEJO. TRECE CON ESPACIOS. CABE.» / «…Lo ha escrito bien.»** Tras el duelo por fax con Teodoro. El
   running gag de Pellizco/Pollejo paga con emoción, no con chiste. Es el mejor momento del juego. [J]
2. **«Lamentamos el acierto.»** La tarjeta final, con «Donde decía “Por Bruno Pellejo” debía decir “Por Bruno
   Pellejo”». Perfecta. [J] `img/13_tarjeta_final.png`
3. **«Ay, hijo. El papel lo dejé en 2011, que me manchaba el sofá.»** La abuela desmonta la premisa con cariño; «¡Me
   ha contestado el periódico!» la cierra. [J]
4. **«—Hola. Soy la inversión. —…Eso es una alucinación. —No. Es un becario. Es más barato, pero se nota.»** El mejor
   intercambio del clímax. [J]
5. **«No me ha vuelto a dirigir la palabra. Han sido treinta años muy buenos.»** Aurora en estado puro. [J]
6. **Begoña recorta la pregunta de Bruno un 26 %: «No lo sabremos nunca. Así es más limpio.»** Y luego le recorta la
   pieza a media palabra («…por qué la opa es import— Recortado»). Gag con forma propia (corte físico). [J]
7. **Gertrudis: «TENGO WIFI Y RENCOR»**, el directo viral y «NO HAY MÁS CAFÉ. HAY FAMA». La mejor escena de
   descubrimiento del Acto I. [J] `img/05_gertrudis.png`
8. **Íñigo era el becario de marzo del 98**: «—Yo no voy a hacer eso. —Eso dije yo. Con esas palabras.» Paga el pósit
   amarillísimo del kanban del minuto 15. [J]
9. **Maripaz: «—La X mide un píxel. —La semana pasada medía dos. Optimizamos.»** Y en Marketing: «Esto. Ya lo has
   consumido. Son doce euros.» [J]
10. **Leoncio: «Ya lo ha hecho. En septiembre. No se lo he dicho a nadie. Ni a ella. Es muy sensible a los datos.»** Y
    el gráfico del Titulator: «Una IA que come a las dos y va once veces al baño.» [J]

Menciones: Paco «Puestas. Ahora se ve perfectamente que no hay carretera»; «BIENVENIDO, VACANTE. —…Vacante. Bueno.
Es un cargo»; Rubén «EL 4 TE SORPRENDERÁ. —Mejor. —…Ya hablo como tú»; el espejo del ascensor.

### 4.3 Las diez peores líneas o momentos

1. **Tras el clímax, silencio.** Ganado el duelo final, nadie dice nada y el juego espera un «Empujar». El tambaleo
   del Lector Medio existe en código (4° y 2°, cada 3,2 s, `actors.js:144-148`) pero yo no lo vi; solo «Mirar a Bruno»
   lo dice. Es un momento muerto justo antes del mejor tramo. [J+C] `img/12_tras_climax_sin_indicacion.png`
2. **La estampida de la Sala Amazonas se dispara con la opción literal que Aurora acaba de dictar** («¿y cuáles son los
   siguientes pasos?»). Gran gag de situación desperdiciado como puzle: no hay nada que deducir. [J]
3. **«Vengo a reimaginar el perímetro.»** / **«El uniforme oficial de quien dice “disruptivo” sin mover la cara.»**
   Íñigo arranca con tópicos de consultor que cualquier tira cómica ya ha hecho. Mejora mucho después. [J]
4. **«Capacidad: ocho personas o una reunión que pudo ser un correo.»** Chiste de taza de oficina. [J]
5. **«El modelo es de fuera. El prompt es de dentro. / Eso lo hace nuestro.»** Dicho dos veces, idéntico (árbol de
   Anselmo y escena del ordenador). Sé que la E2 (D1) la quiere en ambos sitios; la segunda debería ser una variación o
   un eco de Leoncio, no la misma frase. [J+C]
6. **«Las demás páginas son fotos del fax. Posando.»** Dos veces en un minuto (al recibir el manual y al mirarlo). [J]
7. **El tercer «Llevas RECHAZADO en la frente»** (Evaristo, Paco, Pilar; Pilar además antes de saludar). La
   reactividad se agradece; a la tercera es plantilla. [J]
8. **Aurora: «Dos exclamaciones de cierre y ninguna de apertura. / Eso no es entusiasmo, criatura. Es inglés.»** Muy
   buena línea que suena sin contexto: reacciona a un RV de Tadeo que llega mudo al buzón y que el jugador no ha leído
   (`catacumba.js:826`, condición `tadeo_rv_n ≥ 1`). Parece contestar a Bruno. Es el N6 de la crítica 3, sin
   arreglar. [J+C]
9. **Murmullos que se repiten idénticos por sala**: «Diecinueve años. Ni un marrón. Ni uno.» y «Hoy me han preguntado
   tres veces por mi salud…» están en 4 sitios; «A mí lo que me interesa es la economía. Y ahorrar.» en 5. El remate
   del clímax («…Y ahorrar.») pierde fuerza si el jugador la ha oído cuatro veces antes en Despachos. [C]
10. **«Cuarenta años en esta ventanilla. He visto un ticket en sánscrito.»** y **«¡Hidrovoltia se lanza a por el
    Robledal! ¡Eso es opa, árbitro!»**: relleno sin giro. [J]

### 4.4 Personaje por personaje

| Personaje | Funciona | No funciona |
|---|---|---|
| **Bruno** | Voz seca y simpática; «Mirar a Bruno» es útil y tiene gracia; los remates cortos le van | Remata casi todo con la misma coletilla («Con sello.», «Con faltas.»); a veces explica el chiste del otro |
| **Abuela Remedios** | Marco emocional perfecto; pistas con personalidad («se te ve el codo»); final | Las pistas de nivel 1-2 son vagas (ver §5) |
| **Celestino** | Locutor deportivo de principio a fin; el wifi; «Ya te ve hasta el torno» | La megafonía en el Acto III es más ruido que chiste («¡Golazo de papel!») |
| **Íñigo** | Fase final y revelación del 98; «Es la primera vez que la matriz me pone en algún sitio» | Entrada tópica; su vocabulario de consultor es el más previsible del reparto |
| **Yoli** | Tic de SEO; «Creo que esto es estar tranquila»; siembra la cuenta «abrígate» | Pocas apariciones interactivas (no atiende hasta el CMS) |
| **Anselmo** (director de Desarrollo) | «¿De dónde viene? De fuera» como manía con contradicción; arco con Herminia («Se nota en el trazo») | Repite literal su mejor frase |
| **Coro de Desarrollo** | «Las manos están enfadadas», «¡Ha sido Diseño! / He sido yo. Pero gracias» | Tres apariciones en toda la partida; sin progresión (ver §8) |
| **Leoncio + Herminia** | El personaje con más corazón tras Aurora; Herminia como objeto con «log» es una solución excelente | Herminia acaba en un baile de estados (absorbida, revocada, «propietaria: Infografía») difícil de seguir |
| **Custodia** | Preguntas con punto; «Todo. Siguiente.» | Árbol que se cierra tras cada opción; su «Oigo yo» y el «Oigo» de Paco son el mismo chiste |
| **Gertrudis** | El mejor objeto-personaje del juego | — |
| **Aurora** | La mejor escrita | «criatura» en casi todas sus intervenciones (13 en total, casi todas suyas) |
| **Teodoro** | El fax como voz; la firma; «Goyita. Tira.» | — |
| **Gervasio** | Frases sin acabar; «Se comió. Pero no se habló. Bueno. Se habló un poco.» | Sus murmullos se repiten idénticos en cuatro salas |
| **Mercados 1/2/3** | La estampida | Siguen sin nombre ni rasgo (crítica 3 §9.12) |
| **Maripaz** (directora de Comercial) | Coherente y siempre en su tema: inventario, huecos, banners. «Ya lo has consumido. Son doce euros.» La E3 le da una lectura de periódico que funciona («Para vender un hueco hay que leer lo de al lado») | «cariño» (14 sin Eventos) se oye más que su ingenio; su duelo es el más fácil |
| **Paco** | Constante: fontanería, tickets, «Has dejado de merecerlo» | Ninguna pega seria |
| **Rubén** | Voz de clickbait con ternura | Aparece tarde; su encargo del táper es opcional y no se anuncia como tal |
| **Begoña** | Diálogo-puzle de la nota de gasto; el recorte | — |
| **Evaristo** (las comas) | La mejor idea de guion; payoff en el clímax con cuentas correctas | En pantalla es amable y poco más; sus llamadas («Era solo eso», 10; «Una cosita», 8) se oyen como fórmula |
| **Pilar / Eventos** | (Sala protegida; no se toca.) «La ocupación media es Pilar». | (Solo observo: el álbum se entrega con una pregunta.) |
| **Ramírez / Lector Medio / Valentín** | El Lector Medio es el mejor accesorio del juego | Ramírez y Valentín siguen siendo un solo chiste cada uno |

### 4.5 Fórmulas repetidas (recuento propio)

Recuento sobre 3.488 cadenas de texto extraídas de `content/` (sin `art/`, `flags.js` ni plantillas) con un script
propio, independiente de `tools/text-audit.mjs`. «Sin Ev.» = sin `eventos*.js`.

**Las de la crítica 3 (ya con tope y auditor, E3):** el auditor da `lo único 6/8`, `no se X. Se Y. 5/6`, `primera vez
4/5`, `Mi primer/a 5/6`, `No es X. Es Y. 10/12`, `factur… 9/11`, `cariño 14/20`, `desde [fecha] 6/6` (en el tope) [T].
Es una poda de verdad, no cosmética: las he buscado con mis propias expresiones y salen cifras compatibles.

**Tics que han ocupado su sitio (no tienen tope):**

| Fórmula | Todo | Sin Ev. | Ejemplos |
|---|---:|---:|---|
| **Coletilla «Y X.» al final** | 129 | 119 | «Y ahorrar.» ×5, «Y no es este.» ×2, «Y no desgrava.», «Y la mano no desgrava.», «Y yo detrás.», «Y no va.» |
| **Coletilla «Con X.» al final** | 62 | 57 | «Con faltas.» ×3 (las tres en Sistemas), «Con coma.» ×2 (las dos en el clímax), «Con jota y dos eles.» ×2, «Con buena luz.» ×2, «Con sello.», «Con regla.», «Con la regla.», «Con IVA.» |
| **Coletilla «Sin X.» al final** | 22 | 20 | «Sin excepciones.» ×2, «Sin acreditar.» ×2, «Sin ticket», «Sin adjunto» |
| **Frase final de 1-3 palabras** (el remate seco en general) | 670 | 629 | ≈ 19 % de todas las cadenas acaban así |
| Año concreto (19xx/20xx) | 58 | 57 | 2019 (cafetera, pipas, chaqueta), 2021, 2011, 1997, 1996, 1989, 1987… |
| «X años» | 41 | 41 | «treinta años», «diecinueve años» (×5 en Gervasio), «veintinueve años», «seis años» |
| Cifra exacta con punto de miles | 17 | 17 | 48.212, 4.112, 191.808, 11.302… |
| «chaval» | 22 | 22 | Teodoro y Celestino |
| «Perdón/perdone» | 17 | 16 | |
| «consta» | 17 | 16 | (es el tic de Gervasio, bien) |
| «Era solo eso» / «Una cosita» | 10 / 8 | | Evaristo |
| «de la/esta casa» | 17 | 14 | «Es de la casa», «lo más… de la casa» |
| Murmullos idénticos en varias salas | 84 cadenas duplicadas de más de 25 caracteres | | Gervasio, Íñigo, Lector Medio, Yoli, Leoncio |

Lectura: las tres coletillas suman **≈210 cadenas** (≈6 % del texto). No todas son malas («Con jota y dos eles» en el
final es justo), pero es la misma máquina que la crítica 3 describía: **afirmación + apéndice corto que gira**. Al
podar «no se X. Se Y.» el peso ha pasado al apéndice. Si se le pone tope sin dar al guion otras formas de chiste, saldrá
un cuarto tic. La solución no es otra cuota; es meter más comedia de **situación, interrupción, acción y silencio**
(ver §8, cambios 3 y 4).

---

## 5. Puzles

**Lógica y justicia.** Las cadenas son lógicas y se cruzan con gracia (copias rechazadas = papel de fax; el 26 % de
Herminia = el recorte de Begoña; la fotocopia de la nota de Gervasio = fuente y remate). La ficha de la página 7 viva y
«Mirar a Bruno» por acto (`pistas.js`, crítica 3 N2) hacen que **nunca dudé de qué buscaba**, solo de cómo. Esto es
de lo mejor del juego y está a nivel de las aventuras modernas bien hechas.

**El problema es la profundidad.** Contando a ciegas, de los ~20 pasos que exigen decidir algo:
- **Deducción real** (6): chicle + tarjeta + organigrama; chaqueta al Lector Medio; nota de gasto con el sobre de
  azúcar; copias rechazadas al fax; manual del fax como remate; Herminia «herramienta» en Sistemas.
- **Te lo dicen y lo haces** (10+): estampida (Aurora dicta la frase), regleta R-3 (el ticket dice cuál), café (Celestino
  dice «salúdala»), segunda opinión de Aurora, recorte de Begoña, álbum (se pide), descopear, acta, empujón.
- **Duelos** (4): emparejamiento casi literal. Ganados 3-1, 2-0, 2-0 y 5-1. Perder no cuesta casi nada.

El Acto III es el más pobre: una vez en el armario, todo es un recado con instrucciones explícitas.

**Atascos (a ciegas).** Uno solo, de 3 minutos, en el armario 27: «Tirar del papel continuo» se niega en el Acto II
(«No tiro de algo que imprime solo. Igual es la nómina», `cpd.js:362`) y es la solución en el III. Es un antipatrón
clásico (Sierra lo hacía a menudo): el jugador que ya lo probó no vuelve a probarlo. La pista visual que lo resolvería
existe, pero está en otra planta: la pantalla del Titulator en los Despachos dice «AYÚDAME ESTOY EN EL ARMARIO 27»
(extras), y yo no volví allí en ese momento.

**Pistas de la abuela.** Tres niveles bien escalados en voz, mal escalados en contenido para este punto: los niveles 1
y 2 («si de un armario sale papel…», «esos titulares salen de un armario») repiten lo que el jugador ya sabe al llegar al
armario; solo el 3 da la acción. Para el resto del juego no las necesité. **Para el duelo** el sistema ya dice dónde
está la primera réplica que falta (`game.js:58`, N1): resuelto.

**Duelos.** Vistosos, bien integrados con el cotilleo (las réplicas se oyen como chismes, no como tutorial) y con
contestaciones a las flojas que son graciosas. Pero los cuatro se ganan a la primera emparejando frases casi literales
(«Es que tú eres el que mejor escribe» → «Y tú el que mejor delega»). El remate con objeto es la parte más ingeniosa
(manual del fax, fotocopia, ticket nº 1, acta, correo de Evaristo). En el final hay dos remates más un ataque, «No es un
despido: es una salida en valor», cuya réplica (R13) solo se aprende hablando con Rubén en el armario; yo no la tenía
y perdí ese asalto sin consecuencias. Bien: la derrota escala y no castiga.

---

## 6. Estado de cada punto de la crítica 3

| # C3 | Punto | Estado | Cómo lo sé |
|---|---|---|---|
| N1 | Réplica R11 solo con *Mirar* ordenador; pistas que no dicen dónde | **Resuelto** | [J] *Usar* el ordenador con silla me dio la réplica; [C] `pecera.js:300`, `game.js:58` (la abuela dice dónde está la réplica que falta) |
| N2 | «Mirar a Bruno» con objetivo viejo | **Resuelto** | [J] lo usé 6-7 veces y siempre dio el objetivo vigente; [C] `pistas.js:8`, `game.js:338` |
| N3 | Fax enmarcado detrás de Aurora | **Resuelto** | [J] lo miré sin problemas; [C] `catacumba.art.js:25` (pared de Teodoro) |
| N4 | «Rama del organigrama» no aceptaba la tarjeta | **Resuelto** | [J] la usé con la rama y funcionó |
| N5 | Salida de los Despachos como «cristal de la Redacción» | **Resuelto** | [J] ahora se llama «Redacción» |
| N6 | Ambiente de Aurora sobre los «!!» de Tadeo sin contexto | **No** | [J] sonó tras mirar la ficha, sin Tadeo a la vista; [C] `catacumba.js:826` solo exige `tadeo_rv_n ≥ 1` (los RV llegan mudos al buzón) |
| N7 | Retirarse del hilo sin línea | **Resuelto** (no probado jugando) | [C] `engine/duel.js:184-189` |
| N8 | «Sellada por Aurora» aunque sellara Teodoro | **Resuelto** | [C] `sala_amazonas.js:84-87` |
| N9 | Comillas anidadas «…«El contexto, explicado».» | **No** | [C] `duelo.js:19` sigue con «» dentro de «» |
| N10 | Titulares del Titulator registrados como de Bruno | **Resuelto** | [C] `engine/duel.js:207` |
| N11 | El coro habla a distancia | **Resuelto** | [C] `pecera.js:51`; [J] no lo oí fuera de su zona |
| §9.4 | Coro de Desarrollo | *Decisión del dueño: se queda.* No lo cuento como incumplimiento | — |
| §9.5 | Cuotas a «X no se coge. Se Y.» y «Es lo único» con auditor | **Resuelto** (y ampliado a seis fórmulas) | [T] `text-audit --recuento` |
| §9.6 | Segundo registro para Maripaz; menos «factur…» | **Resuelto** (acotado, como pedía E3) | [J] «¿Usted se lee el periódico?»; [T] factur 9/11 |
| §9.7 | Sin pop-up obligatorio en las revanchas | **Resuelto** (no probado jugando: gané a la primera) | [C] `sala_amazonas.js:339` |
| §9.8 | Atajo de desplazamiento en el Acto II | **Parcial** | [C] `lib/directorio.js`: existe, pero solo en el núcleo de la planta 1. [J] lo vi al pasar el ratón y no lo usé: no se anuncia y no está donde lo necesitas (planta 2, −1). El doble clic sigue parándose en el borde de la pantalla |
| §9.9 | Señal tras el clímax | **Parcial** | [C] tambaleo cada 3,2 s y «Mirar a Bruno»; [J] no lo vi; me orientó Bruno |
| §9.10 | Lote de arreglos pequeños | **Casi todo** (falta N6 y N9) | arriba |
| §9.11 | Bandas negras del iPhone | **Parcial** | [J] el lienzo ya ocupa todo el alto con escalado fraccionario (bien); las bandas laterales siguen vacías |
| §9.12 | Nombres a Mercados | **No** | [C] `actors.js:438-448` |
| §9.13 | Pagar la silla 113 de Eventos | **Resuelto** (opcional) | [C] `ecosistema.js:403-404` |
| §5.2 | Molde de chiste | **Parcial** | Las fórmulas señaladas están podadas; el molde general (remate seco + coletilla) sigue (§4.5) |
| §8.3 | Acto II de ida y vuelta | **No** | [J] planta 1 → 2 → 1 → −1 → 2 → 1 solo en el tramo final del II |

---

## 7. Fallos nuevos (y técnica)

**Pruebas.** `node tools/test-all.mjs`: ver tabla al final de esta sección. `node tools/text-audit.mjs --estatico --plan
--e2 --recuento`: **PLAN: OK, E2: OK** [T]. Mi copia del recorrido de extras (79 pasos, con volcado del registro):
**EXTRAS COMPLETO (79 pasos)**, sin errores de consola [T]. Mi partida a ciegas y el tramo móvil: cero errores de consola
y de página [J].

| # | Gravedad | Descripción | Reproducción |
|---|---|---|---|
| F1 | **Media (diseño)** | Acción negada que luego es la solución: «Tirar papel continuo» se niega en Actos I-II y resuelve el III sin que nada invite a repetirla | Sistemas en el Acto II: Tirar papel continuo → «No tiro de algo que imprime solo». En el III, el objetivo es el armario 27 y Abrir/Hablar no sirven |
| F2 | Media (diseño) | Momento muerto tras el clímax: ninguna línea ni gesto evidente pide el empujón | Ganar D4; esperar 30 s sin pulsar nada: no pasa nada en pantalla salvo un tambaleo de 4° muy breve |
| F3 | Baja (UX) | El doble clic para correr se detiene en el borde visible en salas con scroll; cruzar la Redacción pide 5-8 dobles clics | Redacción, doble clic en el borde derecho repetidas veces |
| F4 | Baja (UX) | Escenas automáticas al entrar en la Redacción (`pecera.js:557-565`: viral, CMS, anexión, dos IAs) colocan a Bruno en x≈690-790 sin transición; al salir del Vending o del ascensor apareces en otra zona | Saludar dos veces a Gertrudis y volver a la Redacción; o volver tras herminia_de_alta. `img/10_llegada_ascensor_x690.png` |
| F5 | Baja (texto) | Murmullos idénticos en varias salas (84 cadenas duplicadas), incluido el remate del clímax «…Y ahorrar.» (5 sitios) | Pasar por Despachos y Sala Amazonas en el Acto II |
| F6 | Baja (texto) | «Las demás páginas son fotos del fax. Posando.» dos veces seguidas | Paco da el manual; Mirar manual |
| F7 | Baja (texto) | Anselmo repite literal «El modelo es de fuera. El prompt es de dentro.» | Hablar con Anselmo (árbol) y luego Usar el ordenador con la pieza |
| F8 | Baja (táctil) | Hotspots de 1-2 celdas de 8 px (taza «NO», monitor de Yoli, tableta del corrector, teléfono rojo) | Móvil 844×390: intentar tocarlos |
| F9 | Cosmético | El árbol de Custodia se cierra tras cada pregunta: hay que volver a hablar seis veces | Secretaría, Hablar |
| (N6, N9) | Baja | Heredados de la crítica 3, sin arreglar | ver §6 |

No he encontrado bloqueos, cuelgues ni estados imposibles. La técnica es sólida.

**`node tools/test-all.mjs` — TODO OK (18) en 803 s** [T] (la herramienta deja sus registros en
`tools/shots/test-all/`, como hace siempre):

| Prueba | Estado | s | Resumen |
|---|---|---:|---|
| play-mouse | OK | 803 | PLAY-MOUSE: OK (62 comprobaciones) |
| fase0 | OK | 502 | TODO OK (92 comprobaciones) |
| fuzz | OK | 214 | FUZZ: OK (44 comprobaciones) |
| comedia-p1 / p2 / p3 / p4 | OK | 101 / 3 / 3 / 40 | 17 / 21 / 98 / 145 comprobaciones |
| smoke | OK | 95 | TODO OK |
| contrast | OK | 69 | CONTRASTE: OK |
| motor | OK | 58 | 35 comprobaciones |
| text-audit | OK | 49 | TEXTOS: OK |
| critica3 | OK | 39 | 27 comprobaciones (prueba nueva que cubre los arreglos de la crítica 3) |
| walkthrough / --alt | OK | 5 / 5 | 44 pasos |
| extras | OK | 7 | 79 pasos |
| movil, heredado, check | OK | 9 / 4 / 0 | — |

La batería pasa entera, pero conviene saber qué no mide: ninguna prueba detecta un momento muerto (F2), una acción
negada que luego es la solución (F1) ni una coletilla repetida (§4.5). Son problemas de diseño y escritura, no de
código.

---

## 8. Los diez cambios prioritarios (por impacto en la diversión)

1. **Hacer de la estampida un puzle de situación, no una opción de menú.** Hoy Aurora dicta la frase y la eliges. 
   Propuesta: Bruno, becario, no puede preguntar en la Reunión (Gervasio: «Los becarios no tienen turno»). Tiene que
   *hacer que lo pregunte otro*: por ejemplo, conectar la emisión de Gertrudis (ya viral) a la «tele de videollamadas»
   («PULSAR ENTRADA 3. NO, LA 2. NO») y que la cafetera suelte «¿Y CUÁLES SON LOS SIGUIENTES PASOS?» en directo; o
   meter la pregunta en el orden del día con el rotulador de Pilar. Usa objetos que ya existen y convierte el mejor
   gag del Acto II en un momento ganado.
2. **Quitar el antipatrón del armario 27** (F1). En el Acto II, que la negativa siembre en vez de cerrar («Tiro un
   poco… y algo tira desde dentro. Lo suelto. Ya volveré.»); en el III, que Bruno lo diga al entrar en Sistemas («El
   papel continuo se mueve. Alguien escribe ahí dentro.») y que la pantalla «AYÚDAME ESTOY EN EL ARMARIO 27» salga
   también en el monitor de Yoli o en el contador de Paco. Subir la pista 1 de la abuela a algo accionable («Ese papel
   que sale del armario, tira de él, que no muerde»).
3. **Romper el molde con formas nuevas, no con cuotas.** Reescribir 50-60 de las ~210 coletillas «Con X./Y X./Sin X.»
   en otras formas: interrupción (Begoña ya lo hace), reacción física (Bruno hace algo en vez de decirlo), silencio
   («…»), contestación de un tercero, gag de interfaz (como el fax o la X menguante). Prioridad: Sistemas («Con faltas»
   ×3), clímax («Con coma» ×2) y Bruno. Añadir entonces un tope informativo en el auditor.
4. **Dos o tres piezas de comedia de situación más largas en el Acto II-III**, que es donde baja la risa: el apagón de
   la Redacción (ya existe como extra) en el camino principal; una secuencia con Mercados (que tengan nombre y un rasgo
   cada uno) persiguiendo a Bruno por la «reunión de siguientes pasos»; Celestino narrando en directo una huida de
   Íñigo en el epílogo con algo que el jugador provoque.
5. **Cortar viajes en el Acto II.** Directorio con atajos en el núcleo de **cada** planta (o como menú del ascensor:
   «Planta 2 · Administración» lleva a la puerta de Begoña); doble clic que corra hasta el punto real del mundo (con la
   cámara siguiendo) y no hasta el borde. Si se quiere quitar un viaje de diseño: que Begoña recorte la pieza por correo
   interno («Responder a todos» con Begoña en copia) desde el ordenador de Bruno, con su línea «Recortado.» por
   teléfono.
6. **Una señal inequívoca tras el clímax** (F2). Que el tambaleo sea mayor y vaya con sonido (crujido de cartón) y, a
   los 8-10 s sin acción, Celestino por megafonía: «¡El Lector Medio se tambalea! ¡Nadie se atreve!» o Gervasio: «Lo que
   diga el Lector Medio… que no dice nada.» Una línea basta.
7. **Que el Acto III pida algo**: el álbum se consigue con una pregunta y Rubén se libera eligiendo «descopear».
   Propuesta sin tocar Eventos: que en el tablero de Anselmo el jugador tenga que *mover el pósit él mismo* (Usar álbum
   con tablero kanban → Anselmo pide «una columna nueva, que no diga que no» → Bruno escribe «DESCOPEADO» con el boli
   rojo de Aurora o el rotulador del termómetro de Maripaz). Dos objetos de dos plantas en vez de una opción.
8. **Desarrollo: dar arco al coro** (dentro de la decisión «director + coro»). Hoy son tres apariciones sin progresión.
   Propuesta: una por acto con escalada del «¡Ha sido Diseño!»: Acto I, culpan a Diseño; Acto II (regleta), «¡Ha sido
   Diseño!» / Bruno «He sido yo»; Acto III (Rubén liberado), el coro se culpa a sí mismo por primera vez («DEV 3: …Hemos
   sido nosotros. / DEV 1: No lo repitas.»). Y que la segunda frase de Anselmo sea un eco que la varíe.
9. **Repeticiones literales y muletillas**: «criatura» de 13 a ~6 (que vuelva a sonar a cariño, no a firma), «chaval»
   (22) a la mitad, un solo comentario sobre el RECHAZADO de la frente (el de Evaristo, el mejor), murmullos sin
   duplicar entre salas (sobre todo «…Y ahorrar.», que debe guardarse para el clímax), y F6/F7.
10. **Táctil y lote pequeño**: hotspots de al menos 12×12 px virtuales en móvil (F8), mantener abierto el árbol de
    Custodia (F9), N6 (que Aurora reaccione solo si el RV se ha leído en el móvil o se ha visto el portátil de Tadeo) y
    N9 (comillas “ ” dentro de « »).

---

## 9. Qué le falta para un 8,5

Un 8,5 en este género es una aventura que se recomienda sin matices: *Thimbleweed Park*, *Kathy Rain*, los Wadjet Eye
buenos. A *Fe de erratas* ya no le falta limpieza ni justicia; le falta **ambición de diseño cómico**:

1. **Tres o cuatro momentos que el jugador provoque y recuerde** (como el «insult sword fighting» o el perro de Day of
   the Tentacle), no solo frases buenas. Ya tiene dos (Gertrudis viral, el fax de Teodoro); necesita la estampida y el
   armario a ese nivel, y algo más en el Acto III.
2. **Más puzles de deducción que de recado**: hoy la proporción es 6 de deducción por 10 de «te lo dicen». Con dos o
   tres cadenas más que obliguen a combinar dos salas (como copias rechazadas → fax), el Acto II dejaría de sentirse
   como ir a buscar firmas.
3. **Variedad en la forma del chiste**: la escritura ya es de oficio y casi nunca falla; lo que cansa es que casi
   siempre suena igual (afirmación + coletilla). Con un 30 % de chistes de situación, acción, interrupción o silencio,
   las mismas líneas buenas brillarían más.
4. **Un Acto II con menos viajes** y un Acto III con un último obstáculo de verdad antes del clímax.
5. **Oír la música** y comprobar que acompaña: no la he podido evaluar, y en este género pesa.

Con 1, 2 y 4 el juego estaría en 8; con 3 y un buen sonido, en 8,5.

---

## Apéndice

- **Capturas** (`img/`, a 2×, `deviceScaleFactor` 1 salvo las de móvil, tomadas con dpr 3 y escaladas a CSS):
  `01_titulo`, `02_vestibulo`, `03_desarrollo_infografia`, `04_despachos`, `05_gertrudis`, `06_redaccion_papel`,
  `07_sala_amazonas`, `08_duelo_maripaz`, `09_planta2`, `10_llegada_ascensor_x690`, `11_eventos`,
  `12_tras_climax_sin_indicacion`, `13_tarjeta_final`, `14_movil_dialogo`, `15_movil_scroll`, `16_creditos`.
- **Material de trabajo** (fuera del repositorio, en el directorio temporal de la sesión): el controlador de Playwright
  de la partida a ciegas, el registro completo de esa partida, el volcado de texto de los 79 pasos de extras y los
  scripts de recuento de §4.5.
- **Herramientas del repositorio ejecutadas**: `tools/test-all.mjs` (completo) y `tools/text-audit.mjs --estatico
  --plan --e2 --recuento`. No se ha modificado nada fuera de `docs/informes/critica4/` y no se ha hecho ninguna
  operación de git.
