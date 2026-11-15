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
| Técnica y estabilidad | 8 | 8,0 | 8,5 | **8,5** | `test-all` 18/18 (ver §7) y cero errores de consola en dos partidas completas |
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
