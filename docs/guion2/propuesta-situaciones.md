# FE DE ERRATAS — Reescritura de comedia · Propuesta de la mesa de «situaciones»

**Writers' room de tres · Especialidad de esta propuesta: el chiste de situación.**
**Base:** crítica independiente (`docs/informes/critica/CRITICA_JUEGO.md`, 6,5/10) y sus datos; texto real de `content/`;
walkthrough de 46 pasos (`tools/walk-data.mjs`). Todo lo que se cita lleva `fichero:línea` (rutas relativas a
`content/`). Nada de esto toca `content/`, `engine/` ni `tools/`: es guion para que lo implemente quien corresponda.

**Convenciones de este documento**

- En las escenas, `NOMBRE: texto` es una línea hablada (≤ 80 caracteres, comprobado con script); `(entre paréntesis)`
  es acción o puesta en escena, nunca texto en pantalla. `TEODORO (fax):` lleva el prefijo del motor.
- «Nuevo» = línea que no existe hoy. «(se queda)» = línea actual que no se toca.
- Flags nuevos en `minúscula_con_guiones_bajos`. Ninguno lo lee el walkthrough salvo donde se dice.
- Reglas de la casa comprobadas en cada línea nueva: sin «Consejo» (es la Reunión de Dirección), sin director del
  periódico, el Lector Medio nunca en una cabecera ni tras la mesa de un jefe, Diseño y Producto e Infografía nunca en
  la misma línea ni en la misma escena, nombres visibles de sala solo los diez oficiales, sin marcas reales, sin
  minijuegos, sin muertes ni callejones, nueve verbos.

---

## A. Diagnóstico propio (10 líneas)

1. **De acuerdo** en el síntoma: es una comedia de frase, no de situación. El dato que más me dice no es el 5 % de risas, sino el 73 % de respuestas genéricas en Abrir, Cerrar, Empujar y Tirar (§3.8): los verbos físicos, donde vive el chiste de situación, son justo los que están vacíos.
2. **No del todo** en la causa: el remate «… Como X.» es el síntoma, no la enfermedad. Las líneas se cierran solas porque el mundo no recuerda: lo que haces en una sala casi nunca le pasa a nadie en la siguiente. Una línea que no puede apoyarse en nada tiene que rematarse a sí misma.
3. La prueba está en la propia crítica: los cuatro «¡ajá!» que hay que proteger (la foto en VACANTE, las copias rechazadas como papel de fax, el 26 %, Rubén en el armario) son **situaciones con objeto y consecuencia**, no frases. Y los titulares reactivos del Titulator son la única pieza del juego que «recuerda». Ese es el patrón que hay que extender.
4. **De acuerdo** con el chiste de la casa: el coro y Diseño no son un exceso de chiste, sino de **turno**. Hablan cada 14-24 s sin que el jugador haya hecho nada: es ruido que no viene de una acción suya y por eso no puede hacer gracia.
5. **De acuerdo** con el epílogo: el último golpe tiene que ser de Bruno y su abuela. El remate de Diseño convierte el final en una dedicatoria (`escenas/final.js:182-186`).
6. **No estoy de acuerdo** en que Nemesio sea «olvidable»: su escena de los violines al oír «descopear» (`rooms/pecera.dialogos.js:73-85`) es de las pocas situaciones de verdad. Le falta escenario, no le sobra pantalla. Leoncio, Anselmo y Herminia sí sobran: son una subtrama sin consecuencia para Bruno.
7. **Matizo** el Acto II: el problema no es solo cuánto se anda, sino que el trayecto está vacío. Nada viaja con Bruno y nadie reacciona por el camino. La solución es que las cosas viajen solas (la pieza por fax, M5) y que lo que hace en una sala llegue a las demás (la cafetera viral, M1; los fugitivos de la reunión, M4).
8. **Matizo** las muletillas: «desde marzo», «las seis y media» o «cinco minutos» no fallan por repetirse, sino porque **no escalan**. «¿Tú eres el nuevo?» se repite igual y funciona porque cambia de sentido con Rubén y con Íñigo.
9. **De acuerdo** con el duelo: perder no cuesta nada y por eso no hace gracia. No toco el mecanismo, pero propongo que perder tenga una consecuencia cómica que escale (M7).
10. **Añado** lo que la crítica apunta pero no desarrolla: Íñigo no tiene líneas propias porque nunca pierde nada hasta el final. Hay que hacerle perder en público tres veces antes del clímax (se apunta un tanto ajeno en M1, la chaqueta le gana la discusión en M3 y la frase que vacía salas no le hace nada en M4). Así su caída se cobra.

---

## B. Momentos de situación (siete)

| # | Momento | Salas | Arregla | Grafo |
|---|---|---|---|---|
| M1 | La cafetera viral | Vending → Redacción → Despachos → Vending (+ abuela y epílogo) | Gertrudis ×4 (paso 20), segundo café muerto, planta la cuenta «abrígate» | Paso 20: tres saludos pasan a uno |
| M2 | El apagón de tres segundos | Redacción ↔ Sistemas | P5 «candado de permiso»; el coro y la bandeja de Diseño, reducidos a una pista | Sin cambios de orden |
| M3 | Ramírez ha vuelto | Redacción → Despachos → (Acto II) → epílogo | P3 «de probar todo», el perchero que despista | Sin cambios; acción opcional nueva |
| M4 | Los siguientes pasos | Sala Amazonas → Vending → Eventos → Vestíbulo → clímax | Estampida invisible, planillo sin señal, la silla 113 | Sin cambios; micro-puzle de la silla cambia de solución |
| M5 | La pieza viaja por fax | Redacción de papel (+ inserto de Administración) | **El ir y venir del Acto II** | Pasos 36-37: de 6 cambios de sala a 0 |
| M6 | Celestino narra a Bruno | Vestíbulo → Sistemas → Sala Amazonas (clímax) | El mundo no reacciona fuera del Titulator | Sin cambios |
| M7 | Llamar a un colchón | Marketing y Comercial (D1 perdido) | «Perder no cuesta nada» | Sin cambios |

M1, M3, M4 y M6 atraviesan varias salas. M5 convierte el trayecto más caro del Acto II en el gag.

---

### M1 · La cafetera viral

**Dónde:** Vending (Gertrudis) → Redacción (pantalla de métricas, Yoli) → Despachos (Íñigo y el Titulator) → Vending.
**Qué lo dispara:** el primer «Buenas noches, Gertrudis.» (paso 14).
**Qué hace el jugador:** saluda a la cafetera, vuelve a la Redacción, Yoli le pide que lo repita «que baja», vuelve y
saluda otra vez. Ese segundo saludo es el que hoy hay que repetir tres veces para sacar tres chismes.

**Escalada en 3 pasos**
1. **Vending.** Gertrudis da el café y el primer chisme, como hoy, y anuncia que «comparte». El Titulator, que está
   conectado a todo lo que tiene pantalla (biblia G2), publica el titular de hazaña que ya existe (`rooms/pajarera.js:22`).
2. **Redacción.** La pantalla de métricas pasa de 3.418 a 11.302 con una taza dibujada. Yoli exige un segundo saludo.
   Si Bruno pasa por los Despachos, Íñigo se apunta el tanto: es la primera vez que le vemos robar algo en público.
3. **Vending.** Gertrudis, «en directo», no puede callarse: suelta los tres chismes seguidos (rep_04, rep_10, rep_14) y
   se niega a dar un segundo café: «NO HAY MÁS CAFÉ. HAY FAMA».

**Consecuencias que vuelven:** (a) en la siguiente llamada, la abuela ha visto la cafetera en el grupo del pueblo;
(b) cuando Bruno apague la pantalla (M2), Gertrudis pierde a su público; (c) en el epílogo, Yoli revela que la cuenta
«abrígate» comentó en el vídeo de la cafetera: el chiste planta la revelación final.

**En pantalla**
- `pantalla_metricas`: estado nuevo `viral`, con una taza de 9×9 px junto a la cifra y un número que sube a saltos
  (tres valores en 1,2 s; luego baja de uno en uno cada 2 s mientras Bruno esté en la sala).
- `gertrudis`: estado nuevo `en_directo`, un piloto rojo de 2×2 px y la palabra «EN DIRECTO» en la fuente pequeña encima
  del LCD. El LCD parpadea dos veces al entrar en el estado.
- Yoli: `reach` sobre la pantalla (señala), `face` hacia Bruno. Figurantes web: murmullo nuevo.
- Íñigo: sin animación nueva (habla desde el sofá).

**Diálogo**

```text
(Vending · paso 14 · Hablar Gertrudis → opción «Buenas noches, Gertrudis.»)
GERTRUDIS: NADIE ME SALUDABA DESDE 2019.
(Ruido de máquina. Cae el café. Bruno lo coge.)
GERTRUDIS: CHISME: EL DE BOLSA A YOLI: "ESTO LO NECESITABA PARA AYER".
GERTRUDIS: YOLI: "AYER ESTABA CON LO DE ANTEAYER. PÍDESELO A MAÑANA, QUE ESTÁ LIBRE".
BRUNO: Me lo apunto.
GERTRUDIS: SALUDO RECIBIDO. COMPARTIENDO...
BRUNO: ¿Compartiendo con quién?
GERTRUDIS: CON TODO LO QUE TENGA PANTALLA. TENGO WIFI Y RENCOR.
(flag cafetera_viral)

(Redacción · primera entrada con cafetera_viral y sin cafetera_en_directo · una vez)
(La pantalla de métricas salta: 3.418, 7.950, 11.302. Aparece la taza.)
YOLI: ¡Bruno! ¡Once mil concurrentes! ¿Qué ha pasado?
YOLI: «Un joven da las buenas noches a una cafetera». Lo ha sacado el Titulator.
YOLI: Sin CMS. Sin edición. Sin pudor. Y lo está viendo medio país.
BRUNO: Le he dado las buenas noches.
YOLI: Pues dáselas otra vez. Que baja. 11.290. 11.284. ¡Corre!
YOLI: Y un comentario: «abrígate». La cuenta de siempre.
(Murmullo nuevo de los redactores de guardia: «"Buenas noches, cafetera"... No, así no».)

(Despachos · primera entrada con cafetera_viral, si Íñigo está · una vez)
ÍÑIGO: Vacante. ¿Has visto el Titulator? Once mil. Viral.
BRUNO: Lo de la cafetera fui yo.
ÍÑIGO: Tú pusiste el saludo. Él puso el titular. El valor está en el titular.
ÍÑIGO: Te lo apunto en verde: oportunidad. Para él.

(Vending · segundo «Buenas noches, Gertrudis.» · sustituye a las tres repeticiones del paso 20)
GERTRUDIS: ¿OTRA VEZ, VACANTE? ¿ES PARA LA WEB?
BRUNO: Dice Yoli que baja.
GERTRUDIS: UN MOMENTO. ME PONGO DE PERFIL.
(Pitido. El LCD parpadea dos veces. Se enciende «EN DIRECTO». flag cafetera_en_directo)
GERTRUDIS: BUENAS NOCHES, PAÍS. ESTO NO LO SABE NADIE.
GERTRUDIS: CHISME: GERVASIO A NEMESIO: "ES QUE TÚ ERES EL QUE MEJOR ESCRIBE".
GERTRUDIS: NEMESIO: "Y TÚ EL QUE MEJOR DELEGA. CADA UNO CON SU DON".
BRUNO: Me lo...
GERTRUDIS: CHISME: ÍÑIGO A PACO: "ESTAMOS ANALIZANDO TODAS LAS OPCIONES".
GERTRUDIS: PACO: "O SEA, QUE NO SABÉIS QUÉ HACER, PERO EN TABLA DINÁMICA".
BRUNO: Espere, que no me da la...
GERTRUDIS: CHISME: MARIPAZ A BORJA: "ESTO LO PODEMOS VER EN UNA REUNIÓN RÁPIDA".
GERTRUDIS: BORJA: "O EN UN CORREO DE UNA LÍNEA. ESTE. DE NADA".
GERTRUDIS: FIN DE LA EMISIÓN. NO HAY MÁS CAFÉ. HAY FAMA.
BRUNO: Apuntado. Todo. Con la letra que me ha quedado.
(Aviso: «Tres réplicas apuntadas en la libreta.» Se apaga «EN DIRECTO».)

(Vending · tercer saludo y siguientes)
GERTRUDIS: ESTOY AGOTADA. HABLE CON MI REPRESENTANTE.
BRUNO: ¿Quién es su representante?
GERTRUDIS: CELESTINO. EXTENSIÓN 0.
(Siguientes: los chismes de relleno de siempre, `rooms/office.js:27-36`.)

(Callback a · Usar móvil → llamar a la abuela, primera llamada con cafetera_viral · una vez, antes de la pista)
ABUELA: Hijo, en el grupo del pueblo ha salido una cafetera. Muy educada.
ABUELA: Y un chico dándole las buenas noches. Se te parecía. Más flaco.
BRUNO: Era yo, abuela.
ABUELA: Pues come algo. Que en el vídeo se te ve el codo.

(Callback b · Vending, primera entrada con cms_vivo y cafetera_viral)
GERTRUDIS: E-53: SE HA IDO EL PÚBLICO. VUELVO A SER UNA CAFETERA.
BRUNO: Yo la sigo viendo.
GERTRUDIS: LO SÉ. ERES EL ÚNICO. NO SE LO DIGAS A NADIE.

(Callback c · epílogo: ver D)
```

**Cambio en el grafo:** paso 20 pasa de «Hablar gertrudis ×3» a «Hablar gertrudis ×1»; `chisme_indice` salta de 1 a 4 en
ese saludo. El segundo café desaparece (arreglo nº 10 de la crítica). `walk-data.mjs` paso 20: una sola tripleta
verbo/opción/cerrar; `esp` igual.

---

### M2 · El apagón de tres segundos

**Dónde:** Redacción (enchufe de la pantalla de métricas, mesa de Yoli, rincón de Desarrollo) y Sistemas (registro).
**Qué lo dispara:** Tirar del enchufe **antes** de haber leído el ticket nº 3. Hoy Bruno se niega solo («Necesitaría un
motivo. Por escrito», `rooms/pecera.js:202`): el jugador sabe la solución y el juego no le deja. Ahora le deja, y el
mundo le corrige.
**Qué hace el jugador:** tira, ve que el CMS publica mientras la pantalla está apagada, ve cómo se lo vuelven a enchufar,
y entiende que no le falta la idea, sino un papel con número.

**Escalada en 3 pasos**
1. **Primer tirón:** negro, pánico de Yoli, entra una pieza. Nemesio cruza la sala y enchufa: la cinta es un requisito.
2. **Segundo tirón:** entra otra pieza y es **Yoli** la que enchufa. Prefiere no publicar a no ver la gráfica.
3. **Tercer tirón:** Valentín, sin levantar la vista, dice dónde está el aviso de 2017. Nemesio fija la regla: «tráeme
   un motivo con número». Con el ticket nº 3 leído, el siguiente tirón es el definitivo, y Nemesio escribe la
   excepción en la cinta.

**Consecuencias que vuelven:** la pantalla apagada deja a Gertrudis sin público (M1 b); el contador de Paco suma +318
(ya existe, `rooms/cpd.js:381`); Paco: «Se ha arreglado el CMS. Nadie sabe cómo. Ya me han abierto un ticket para
saberlo» (se queda, `rooms/cpd.js:115`). Este momento sustituye el nodo CO_BANDEJA del coro
(`rooms/pecera.dialogos.js:268-281`): la bandeja de Diseño se queda como **un** objeto con **una** pista.

**En pantalla**
- `pantalla_metricas`: estado `negra_temporal` (igual que la apagada de `cms_vivo`, pero vuelve sola al enchufar).
- Monitor de Yoli: rótulo de 3×5 px que alterna «GUARDANDO» / «PUBLICADO» (dos estados del objeto).
- Nemesio: `walkActor` hasta el enchufe (unos 150 px, ≈ 2,5 s a su velocidad) y `reach`. Yoli: igual, con `reach`.
- `enchufe_pantalla`: estado `con_ticket` (una tira de cinta más, 10×3 px, con dos rayitas de letra).

**Diálogo**

```text
(Redacción · Tirar enchufe_pantalla sin vio_ticket_3 · 1.ª vez)
(Clic. La pantalla de métricas se va a negro. Se oyen los ventiladores. 0,8 s.)
YOLI: ¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?
(¡Plin! En el monitor de Yoli: «PUBLICADO».)
YOLI: ...Ha entrado una pieza. Ha entrado una pieza. ¡El CMS va!
(Nemesio se levanta, cruza desde Desarrollo sin prisa, lee la cinta y enchufa.)
NEMESIO: Pone «NO DESENCHUFAR». La cinta es un requisito.
(La pantalla vuelve: 3.418. El monitor de Yoli: «GUARDANDO».)
YOLI: ...Ya no va.
BRUNO: Ha ido mientras estaba apagada.
NEMESIO: ¿Y si va sin pantalla? Peor. Si funciona, la gente se acostumbra.

(2.ª vez)
(Clic. Negro. ¡Plin! «PUBLICADO».)
YOLI: ¡Otra! ¡Ha entrado otra!
(Yoli mira la pantalla negra. Le tiembla el párpado. Se levanta y enchufa ella.)
YOLI: Perdona. Si no veo la gráfica, no sé si estoy contenta.
BRUNO: Pero estaba entrando todo.
YOLI: Ya. Pero no lo veía entrar. Eso no cuenta.

(3.ª vez)
(Clic. Negro. Antes de que nadie se mueva:)
VALENTÍN: Está en la bandeja. 2017. Primera hoja. Con una flecha.
(Nemesio enchufa. Yoli suspira de alivio.)
BRUNO: ¿Lo sabía desde 2017?
VALENTÍN: Lo avisé. Centrado. Con buen interlineado. No lo leyó nadie.
NEMESIO: Si quieres que se quede apagada, tráeme un motivo. Con número.
BRUNO: Un motivo con número. Eso huele a Paco.

(4.ª vez y siguientes, sin vio_ticket_3)
NEMESIO: Sin número, a su enchufe.

(Con vio_ticket_3 · sustituye al arranque de la escena pecera_cms_vivo)
(Clic. Negro. Nemesio ya se está levantando.)
BRUNO: Ticket nº 3, de 2017: «CMS lento con la pantalla encendida».
BRUNO: Estado: no prioritario.
NEMESIO: ¿Tiene número?
BRUNO: El tres.
NEMESIO: ...Entonces existe. Lo pongo en HECHO (PERO NO). Desde 2017.
(Nemesio corta un trozo de cinta, escribe y lo pega bajo el letrero: «SALVO TICKET Nº 3».)
YOLI: ¡Estamos ciegos!
CORO: ¡Ha sido Diseño!
BRUNO: He sido yo. Pero gracias.
YOLI: ...Ha entrado una pieza. Y otra. ¿El CMS va?
(Yoli se echa colirio. Mira la pantalla negra. Se pone la mano en el pecho.)
YOLI: Lectores... no lo sé. Por primera vez en seis años, no lo sé.

(Bandeja de Diseño y Producto · Abrir · sustituye a rooms/pecera.js:357-362)
BRUNO: «Entregado a las 18:29». Y al fondo, de 2017, una hoja con una flecha.
BRUNO: «La pantalla de Dirección tumbará el CMS». Sello: «LEÍDO (PERO NO)».
```

**Cambio en el grafo:** ninguno. Pasos 21 (Mirar registro) y 22 (Tirar enchufe) en el mismo orden. Lo que cambia es que
tirar antes de tiempo ya no es un «no» del juego, sino un experimento con resultado visible.

---

### M3 · Ramírez ha vuelto

**Dónde:** Redacción → Despachos; consecuencias en el Acto II (Gervasio) y en el epílogo.
**Qué lo dispara:** tener la chaqueta de Ramírez y usarla sobre uno mismo (`Usar chaqueta_ramirez` sin destino; hoy no
existe en el objeto de inventario, y el hotspot responde «No me la pongo», `rooms/pecera.js:294`).
**Qué hace el jugador:** se pone la chaqueta, provoca un malentendido de identidad, descubre que la chaqueta da autoridad
y que el que tiene autoridad en los Despachos es el que asiente. La crítica dice que P3 es «de probar todo» porque la
pista apunta al perchero (`rooms/pajarera.js:210`): esto lo vuelve deducible y además gracioso.

**Escalada en 3 pasos**
1. **Redacción:** Yoli y el coro creen durante un segundo que Ramírez ha vuelto.
2. **Despachos:** Íñigo, sin mirar, le trata como a Ramírez y le pone en «Prescindible»; cuando descubre que es Bruno,
   le pide que se la quite porque «confunde a la matriz», y señala al Lector Medio como ejemplo de cómo hay que estar.
3. **El Lector con la chaqueta:** Íñigo levanta la vista por primera vez en todo el juego y asciende al cartón. A partir
   de ahí, Gervasio dice «lo que diga el Lector Medio. Y Ramírez».

**Consecuencias que vuelven:** en el Acto II, Gervasio cuenta al Lector como dos votos; la matriz de Íñigo tiene un pósit
nuevo; en el epílogo entra el Ramírez de verdad, con un cruasán, y pregunta si se ha perdido algo (antes era el
poscréditos; ver D).

**En pantalla**
- Bruno: variante de muñeco `con_chaqueta` (flag `bruno_con_chaqueta`): chaqueta beige `#c8b48a` sobre la camisa,
  manga 1 px más larga que le tapa las manos. Es la misma técnica que la variante del Lector con chaqueta.
- Íñigo: `face` hacia Bruno solo en el paso 3 (hasta entonces habla mirando los pósits).
- `matriz_2x2`: estado `ramirez` (un pósit beige más en «Ideal»).

**Diálogo**

```text
(Inventario · Usar chaqueta_ramirez · nuevo)
BRUNO: Me la pongo. Por probar. Huele a 2019 y a cruasán.
(flag bruno_con_chaqueta. Primera entrada en la Redacción con ella puesta:)
YOLI: ¿Ramírez? ¡Ramírez ha vuelto! ...Ah. No. Eres tú.
YOLI: Por un segundo te he respetado. Ha sido raro. Bonito, pero raro.
D1: ¡Ramírez!
D2: ¿Viene a por el yogur?
D3: No.

(Usar silla_ramirez con bruno_con_chaqueta)
BRUNO: Si me siento con su chaqueta, la silla sigue siendo suya. Y yo, encima.

(Despachos · primera entrada con bruno_con_chaqueta, Actos I-II)
ÍÑIGO: Ramírez. Bolsa. «Prescindible» desde 2019. Siéntese donde no se vea.
BRUNO: Soy Bruno.
ÍÑIGO: Entonces quítese eso. Confunde a la matriz.
LECTOR MEDIO: A mí lo que me interesa es la economía. Y ahorrar.
ÍÑIGO: ¿Ve? Él sí sabe estar. Y sin chaqueta.
BRUNO: Aquí manda el que asiente. Y va en mangas de camisa.
(Bruno se quita la chaqueta. Vuelve al inventario. flag bruno_con_chaqueta = false)

(Despachos · Usar chaqueta_ramirez con lector_medio · P04b, líneas nuevas entre las de siempre)
BRUNO: Le pongo la chaqueta de Ramírez. Le queda mejor que a Ramírez.
(Íñigo levanta la vista de los pósits. Es la primera vez.)
ÍÑIGO: ...Ramírez. Ha vuelto. Y asiente.
ÍÑIGO: Esto lo cambia todo. Lo subo a «Ideal».
(Íñigo despega un pósit beige y lo pega en la matriz.)
YOLI: ¿El Lector Medio lleva la chaqueta de Ramírez? ¡Que nadie la toque!
BRUNO: La silla de Ramírez queda libre. La tradición me ampara.

(Despachos · Mirar matriz_2x2 tras chaqueta_en_lector)
BRUNO: En «Ideal», dos pósits: «VACANTE» y «RAMÍREZ (LECTOR)».
BRUNO: El empleado perfecto es un becario. El segundo, un cartón con chaqueta.

(Despachos · Acto II, Gervasio en su mesa · Hablar → «¿Quién decide lo del Plan Cero Papel?»)
GERVASIO: Lo que diga el Lector Medio.
LECTOR MEDIO: A mí lo que me interesa es la economía. Y ahorrar.
GERVASIO: Y Ramírez, que está de acuerdo. Dos votos. Pues ya está decidido.

(Despachos · Mirar perchero · sustituye a rooms/pajarera.js:210)
BRUNO: El perchero de los Despachos. Vacío. Aquí la ropa no se cuelga.
BRUNO: Se le pone a alguien que mande.
```

**Cambio en el grafo:** ninguno. El paso 10 sigue igual; ponerse la chaqueta es opcional, pero es ahora la pista más
clara. La pista de la abuela también se reescribe (ver E, abuela nº 5).

---

### M4 · Los siguientes pasos

**Dónde:** Sala Amazonas (la estampida) → Vending, Eventos y Vestíbulo (los tres fugitivos de Mercados) → Sala Amazonas
(clímax).
**Qué lo dispara:** paso 27, «Bueno... ¿y cuáles son los siguientes pasos?». Hoy la reunión se vacía en 1,8 s, nadie
dice nada y la sala queda vacía sin que se note (crítica, captura 10).
**Qué hace el jugador:** dispara la estampida, ve el planillo caer, y luego descubre que la frase es un **arma**:
desaloja a cualquiera que esté escondido de una reunión. La usa tres veces para cosas pequeñas. Y en el clímax descubre
que con el consultor no funciona.

**Escalada en 3 pasos**
1. **La estampida (15 s):** silencio, tres cabezas que se levantan a la vez, uno que empieza a contestar, pánico,
   botellines volando, atasco de tres en la puerta, corcho, Gervasio el último.
2. **Los fugitivos:** cada uno se esconde en otra sala. Uno en la cola del microondas (Vending), otro en la silla 113
   (Eventos: es el «asistente fantasma» de Pilar), otro detrás del ficus (Vestíbulo). La frase los hace saltar.
3. **El clímax:** en el duelo con Íñigo aparece una respuesta floja nueva, «¿Y cuáles son los siguientes pasos?».
   Gervasio se esconde por reflejo y el consultor, inmune, tiene una diapositiva para eso.

**Consecuencias que vuelven:** la silla 113 tiene dueño (sustituye a la silla de Comercial, `rooms/eventos.js:222-238`);
el fugitivo del Vending deja caer un táper, y con él por fin se paga el «¿Me traes un táper?» de Rubén
(`rooms/cpd.js:180`); Celestino lo narra (M6).

**En pantalla**
- Tres actores figurantes nuevos, `mercados_1..3`: el muñeco genérico de redactor recoloreado (camisas beige, gris y
  azul; uno con barba, la «barba de comité» de `rooms/sala_amazonas.js:118`). Animaciones: las de siempre (`walk`,
  `reach`, `idle`), con velocidad ×2 para la huida.
- El atasco: los tres colocados en el marco de la puerta con ±3 px de diferencia, `shake` de 300 ms, y salida de uno
  en uno cada 120 ms («corcho»).
- `botellines`: el estado `volando` ya existe (`rooms/sala_amazonas.js:105`).
- `planillo_mesa`: `glow` de 400 ms al caer (`sfx paper`).
- Vending: `mercados_1` colocado tras `mesa_alta` (solo asoma la cabeza). Vestíbulo: `planta_plastico` con estado
  `con_zapatos` (dos zapatos de 3×2 px bajo la maceta). Eventos: `silla_torcida` con estado `ocupada`.

**Diálogo**

```text
(Sala Amazonas · paso 27 · Hablar Gervasio → «Bueno... ¿y cuáles son los siguientes pasos?»)
(Silencio. 1,2 s. Las tres cabezas de Mercados se levantan a la vez. Tiembla un botellín.)
GERVASIO: Los... siguientes...
(Mercados 1 se pone de pie, muy despacio.)
MERCADOS 1: El siguiente paso sería...
MERCADOS 2: ¡No lo digas!
MERCADOS 3: ¡Que alguien pida sala para salir de la sala!
(¡Estampida! Sillas atrás, temblor, los catorce botellines vuelan.)
(Los tres llegan a la puerta a la vez y se quedan encajados en el marco.)
MERCADOS 1: ¡Usted primero!
MERCADOS 2: ¡No, usted, que es de Bolsa!
MERCADOS 3: ¡Yo soy de Bolsa y de Mercados! ¡Tengo doble prioridad!
(¡Plop! Salen los tres de golpe y se dispersan: uno al Vending, otro arriba, otro abajo.)
(Gervasio se levanta. Se abrocha la chaqueta. Tacha «Siguientes pasos» en el orden del día.)
GERVASIO: Lo hablamos.
(Sale. El planillo resbala por la mesa y cae al suelo: ¡flap! Brilla un instante.)
BRUNO: Se han dejado el planillo. Con la página 7 dentro.
BRUNO: Y un botellín en pie. Es de Mercados: no se ha enterado.

(Vending · Acto II, con reunion_terminada · Mirar mercados_1)
BRUNO: Uno de Mercados, en la cola del microondas. Escondido detrás de un táper.
(Hablar mercados_1)
MERCADOS 1: Chsss. Aquí la cola tiene orden. Me siento seguro.
(Opciones: «¿Qué tal la reunión?» / «¿Y cuáles son los siguientes pasos?» / «Nada.»)
BRUNO: ¿Qué tal la reunión?
MERCADOS 1: Desde marzo. Muy bien. Ha sido la mejor de mi vida. No me la nombres.
BRUNO: ¿Y cuáles son los siguientes pasos?
MERCADOS 1: ¡AQUÍ NO! ¡ESTO ES EL VENDING!
(Sale corriendo por el arco. Se le cae un táper. Rueda hasta los pies de Bruno.)
BRUNO: Un táper sin nombre. «ETIQUETAD VUESTROS TUPPERS». Nadie lo hizo.
BRUNO: La cola ha avanzado un puesto. Por primera vez desde la hora de comer.
(Coger: objeto nuevo taper_huerfano.)

(Sistemas · Dar taper_huerfano a Rubén · paga rooms/cpd.js:180)
RUBÉN: ¿ES UN TÁPER?
BRUNO: Es un táper.
RUBÉN: ...Nadie me había traído nunca nada. Ni la baja.
RUBÉN: Lo voy a dejar vacío. Para que dure.

(Eventos · Acto II-III, con reunion_terminada · Pilar: «¿Cuántas sillas hay?»)
PILAR: Ciento doce. ...Ciento doce. ...Ciento trece. ¿Quién se ha sentado?
(Mirar silla_torcida · sustituye a rooms/eventos.js:224-229)
BRUNO: En la silla ciento trece hay uno de Mercados. Se ha acreditado solo.
BRUNO: Con cinta. Y con cara de marzo.
(Hablar silla_torcida → «¿Y cuáles son los siguientes pasos?»)
MERCADOS 2: ¡Aquí tampoco! ¡Esto es un evento!
(Huye por la puerta de Marketing. La silla se queda girando.)
PILAR: Ciento diez, ciento once... ciento doce. ¡CIENTO DOCE!
PILAR: ¡Vuelvo a ser persona! Bruno, toma. Una croqueta antes de las 21:05.
BRUNO: Está fría.
PILAR: Es una crisis de reputación. Pero es nuestra.

(Vestíbulo · con reunion_terminada · Mirar planta_plastico)
BRUNO: El ficus lleva zapatos. Y respira. Uno de Mercados se ha hecho planta.
(Hablar planta_plastico → «¿Y cuáles son los siguientes pasos?»)
MERCADOS 3: ¡En el vestíbulo no se pregunta eso!
(Sale por la puerta de la calle. Lluvia, portazo.)
CELESTINO: ¡Y se va por la banda! ¡Primero que sale antes del cierre en treinta años!

(Sala Amazonas · clímax · D4 · respuesta floja nueva, solo con reunion_terminada)
BRUNO: ¿Y cuáles son los siguientes pasos?
(Gervasio se agacha detrás de su sillón. Solo se le ve la cortinilla.)
ÍÑIGO: Me alegra que lo preguntes. Diapositiva 312.
ÍÑIGO: «Siguientes pasos de los siguientes pasos».
```

**Cambio en el grafo:** ninguno en el camino principal (paso 27 igual, paso 28 igual). El micro-puzle de la silla 113
cambia de solución (Hablar en vez de Coger/Usar) y desaparece la línea de entrada de Maripaz «Me has devuelto la
silla» (`rooms/ecosistema.js:287-289`). Objeto opcional nuevo: `taper_huerfano`.

---

### M5 · La pieza viaja por fax (el trayecto del Acto II)

**Dónde:** Redacción de papel (el fax de Teodoro) con un **inserto** de Administración en la esquina, la misma técnica
que el de Teodoro al teléfono rojo en el clímax (`escenas/climax.js:246-283`).
**Qué lo dispara:** tener la pieza sin recortar, el fax con papel y el duelo de Teodoro ganado. Teodoro dice lo de
siempre: «Me sobran ocho líneas. No recorto: yo solo mido» (`rooms/catacumba.js:61`).
**Qué hace el jugador:** en vez de subir a la planta 2 a dar la pieza a Begoña y volver a bajar (6 cambios de sala, ≈ 1
min de andar, pasos 36-37), **manda la pieza por fax**. El fax tiene tres teclas de marcación rápida y el jugador tiene
que elegir bien. El «¡ajá!» del 26 % se conserva: hay que saber que Begoña recorta un 26 % por abajo sin leer.

**Escalada en 3 pasos**
1. **Las teclas equivocadas** (en cualquier orden): GOYITA enfada a Teodoro; CONTROLLING provoca una llamada de Evaristo
   que no recorta nada pero cuenta las comas.
2. **ADMINISTRACIÓN:** la pieza viaja. Se abre el inserto: Begoña recibe un fax sin turno, lo atiende «por emoción», le
   corta la cuarta parte de abajo con unas tijeras y la conclusión cae en una papelera rotulada «CONCLUSIONES», llena
   hasta arriba desde 1986.
3. **La vuelta por triplicado:** el fax de Teodoro escupe tres copias de 23 líneas. Teodoro las mide una a una y luego
   llega una cuarta hoja: la factura del envío.

**Consecuencias que vuelven:** la pared de Administración tiene una nota nueva (la factura de 0,26 €, rechazada); la
papelera «CONCLUSIONES» se puede mirar en Administración; en el clímax, Begoña le aplica el recorte del 26 % a la
factura de Optimal Brains antes de rechazarla.

**En pantalla**
- `fax`: estado nuevo `imprimiendo` (una hoja que sale 2 px cada 80 ms, como la hoja de la impresora de los créditos,
  `escenas/final.js:327-347`).
- Inserto 92×60 px en la esquina superior izquierda: pared de Administración (lila), Begoña con el sprite del juego en
  `talk`, un fax de 18×8 px, una hoja de 12×16 px que pierde 4 px de alto al cortar, unas tijeras de 2 fotogramas y una
  papelera de 10×12 px. Rótulo del inserto: «ADMINISTRACIÓN».
- Teodoro: `reach` ×3 con el tipómetro; luego `reach` hacia su tablón (grapa la cuarta hoja).
- Opcional en la sala de Administración: objeto nuevo `papelera_conclusiones`.

**Diálogo**

```text
(Redacción de papel · Mirar fax con fax_con_papel · sustituye a rooms/catacumba.js:426)
BRUNO: Tiene papel. Teodoro lo mira como quien mira un micrófono.
BRUNO: Tres teclas de marcación rápida: 1 GOYITA, 2 ADMINISTRACIÓN, 3 CONTROLLING.

(Usar pieza_opa con fax · sin duelo_teodoro_ganado)
TEODORO (fax): ESE FAX ES MI BOCA, CHAVAL. GÁNATELO.

(Usar pieza_opa con fax · con duelo_teodoro_ganado y sin pieza_recortada → menú)
(Opciones: «1: GOYITA» / «2: ADMINISTRACIÓN» / «3: CONTROLLING» / «Mejor no.»)

(«1: GOYITA»)
(Teodoro le da una palmada en la mano antes de que toque la tecla.)
TEODORO (fax): LA GOYITA NO TIRA BORRADORES.
TEODORO (fax): Y A ELLA NO LE MARCA NADIE MÁS QUE YO.
BRUNO: Perdón, Goyita.

(«3: CONTROLLING»)
(El fax traga la pieza. Diez segundos de silencio. Suena el móvil de Bruno.)
EVARISTO: Una cosita. He recibido su pieza. Treinta y una líneas.
EVARISTO: Diecisiete comas. Todas en su sitio. No recorto: yo solo leo.
EVARISTO: Era solo eso.
(El fax devuelve la pieza entera.)
BRUNO: Necesito a alguien que recorte sin leer.

(«2: ADMINISTRACIÓN»)
(El fax traga la pieza. Pitido largo. Teodoro se cruza de brazos.)
TEODORO (fax): QUE CONSTE: POR MI BOCA SALE UNA PIEZA DE LA WEB.
(Se abre el inserto: Administración. Begoña ante un fax pequeño. Sale la hoja. ¡Sello!)
BEGOÑA: Fax entrante. Sin cita. Sin turno. Lo atiendo por emoción.
BEGOÑA: Toda pieza sufre el recorte estándar del 26 %. Sin excepciones.
(Coge unas tijeras. Corta la hoja por abajo. Lo cortado cae en una papelera rotulada «CONCLUSIONES».)
BEGOÑA: Por abajo. Se pierde la conclusión, que no la lee nadie.
BEGOÑA: Se la devuelvo. Por triplicado. Para eso se inventó el fax.
(Se cierra el inserto. El fax de Teodoro empieza a imprimir. Una hoja. Otra. Otra.)
BRUNO: Treinta y una por cero setenta y cuatro... veintitrés. Exacto.
(flag pieza_recortada · Teodoro coge las tres hojas. Tipómetro. Una, dos, tres.)
TEODORO (fax): VEINTITRÉS. VEINTITRÉS. VEINTITRÉS.
TEODORO (fax): CABE, CABE Y CABE.
(El fax vuelve a pitar. Sale una cuarta hoja, más pequeña.)
AURORA: ¿Una cuarta copia? Eso no existe, criatura. Eso acaba en un juzgado.
BRUNO: «Envío por fax: 0,26 euros». Me ha facturado el recorte.
TEODORO (fax): PAGO YO. ES LA PRIMERA PIEZA DE LA WEB QUE ME CABE.
(Teodoro grapa la factura en su tablón, al lado del fax enmarcado de 2003.)

(Administración · Mirar papelera_conclusiones · objeto nuevo)
BRUNO: Una papelera: «CONCLUSIONES». Llena desde 1986.
BRUNO: Arriba del todo, el final de mi pieza. Lo leo. Tenía razón ella: sobraba.

(Administración · Mirar pared_rechazadas · entrada nueva en la rotación, rooms/administracion.js:15-24)
BRUNO: «Fax de la Redacción de papel, 0,26 €. Motivo: lo pagó Teodoro».

(Clímax · Begoña y la factura · se insertan dos líneas tras escenas/climax.js:208)
BEGOÑA: Factura de Optimal Brains. 48.000 euros. Concepto: «IA».
BEGOÑA: ¿Qué es una IA? ¿Un taxi?
BEGOÑA: Recorte estándar del 26 %: 35.520 euros.
(¡Sello!)
BEGOÑA: Y rechazada igual. Va a la pared. Al lado del ministro.
```

**Cambio exacto en el grafo**

| Hoy | Propuesta |
|---|---|
| Paso 36: `administracion` · Dar `pieza_opa` a `begona_triplicado` (3 cambios de sala) | Paso 36′: `catacumba` · Usar `pieza_opa` con `fax` → «2: ADMINISTRACIÓN» (0 cambios). Requiere `fax_con_papel` + `duelo_teodoro_ganado`. Pone `pieza_recortada`. |
| Paso 37: `catacumba` · Dar `ficha_pagina_7` a Teodoro (3 cambios de sala) | Paso 37: igual, sin cambios de sala (ya estás allí). |

El Acto II pasa de **24 a 18 cambios de sala** en el recorrido óptimo. El camino antiguo (dar la pieza a Begoña en
persona) sigue valiendo, así que nadie se queda atascado. `walk-data.mjs`: paso 36 nuevo, `acc: [['usar', 'pieza_opa',
'fax'], ['opcion', '2: ADMINISTRACIÓN'], ['cerrar']]`. La pista de la abuela para `pieza_recortada` se reescribe (ver E,
abuela nº 2).

---

### M6 · Celestino narra a Bruno

**Dónde:** Vestíbulo (cada entrada) → Sistemas (la rejilla) → Sala Amazonas (la tele de videollamadas, en el clímax).
**Qué lo dispara:** los hitos de Bruno. Hoy Celestino narra el Ibex al entrar (`rooms/vestibulo.js:408-413`); a partir del
torno, narra **a Bruno**, con la misma lógica de los titulares de hazaña (primero el hito más reciente no narrado).
**Qué hace el jugador:** nada distinto. El mundo, por fin, le sigue. La gracia está en la escalada: de comentario de
mostrador a retransmisión del clímax.

**Escalada en 3 pasos**
1. **Vestíbulo:** Celestino narra cada logro de Bruno como una jugada.
2. **Sistemas:** la retransmisión llega por la rejilla al sótano. Paco ya lo sabía.
3. **Sala Amazonas:** tras el ¡PLOF!, la tele de videollamadas se enciende sola. Celestino lo está viendo por el monitor
   de seguridad y lo canta como un penalti. Gervasio, sin Lector Medio, busca otra autoridad a la que obedecer.

**Consecuencia que vuelve:** en el epílogo, «¡Eso es opa, árbitro!» (se queda, `escenas/final.js:107`) ya no es una línea
suelta: es el final de una retransmisión que ha durado toda la noche.

**En pantalla**
- Vestíbulo: nada nuevo (Celestino `face` hacia Bruno).
- Sala Amazonas: `tele_amazonas` deja de ocultarse en el Acto III (hoy `when: '!acto_3_iniciado'`,
  `rooms/sala_amazonas.js:126`) y gana el estado `entrada_1`: un inserto de 60×40 px dentro de la tele con Celestino
  (sprite del juego en `talk`, recortado de cintura para arriba) y la bufanda en alto (`reach`).

**Diálogo**

```text
(Vestíbulo · primera entrada tras torno_abierto · una vez)
CELESTINO: ¡Vacante supera al torno! ¡Por la banda! ¡Con chicle! ¡Qué técnica!
BRUNO: Celestino, el Ibex.
CELESTINO: El Ibex está plano, chaval. Tú no.

(Vestíbulo · al entrar, el hito más reciente aún no narrado; si no hay, el Ibex de siempre)
CELESTINO: ¡El chaval viste al Lector Medio! ¡Cambio de camiseta en pleno partido!
CELESTINO: ¡Buenas noches a la cafetera! ¡Juego limpio! ¡Eso no se veía desde el 82!
CELESTINO: ¡Desbandada en la Sala Amazonas! ¡Mercados se retira al vestuario!
CELESTINO: ¡Gana a Comercial en el descuento! ¡Y ella, a llamar al colchón!
CELESTINO: ¡Tarjeta en Administración! ¡Por triplicado! ¡Y el chaval sigue jugando!
CELESTINO: ¡Teodoro le da la firma! ¡Un fax de cabeza! ¡Golazo de papel!
CELESTINO: ¡Sale un chaval del banquillo de Sistemas! ¡Cuatro meses calentando!

(Sistemas · Usar rejilla · entrada nueva de la rotación, Acto II en adelante)
BRUNO: (Vestíbulo) «¡Vacante encara la planta 2! ¡Atención, que va!».
BRUNO: Me retransmiten hasta el sótano.
PACO: Lo sé desde el chicle.

(Sala Amazonas · clímax · tras «Lo que diga el Lector Medio.» de escenas/climax.js:187)
(La tele de videollamadas se enciende sola: «ENTRADA 1». Celestino, en el vestíbulo, ante el monitor de seguridad.)
CELESTINO: ¡Al suelo el Lector Medio! ¡Penalti! ¡Penalti clarísimo!
CELESTINO: ¡Que lo mire el supervisor! ¡Que lo mire!
(Silencio.)
GERVASIO: ...Lo que diga el árbitro.
(La tele se apaga. Sigue la escena: ÍÑIGO: «...¿Y quién ha validado la fase 1?»)
```

**Cambio en el grafo:** ninguno.

---

### M7 · Llamar a un colchón (perder D1 cuesta algo)

**Dónde:** Marketing y Comercial, al perder el duelo con Maripaz.
**Qué lo dispara:** perder D1. Hoy Maripaz dice «Asignado a ti, cariño» y Bruno contesta que no piensa llamar
(`rooms/ecosistema.js:77-78`): no pasa nada.
**Qué hace el jugador:** pierde y **tiene** que llamar. Cada derrota avanza un nivel del contestador del cliente. No
bloquea nada: después de la llamada, el duelo se puede reintentar como siempre.

**Escalada en 3 pasos:** 1) contestador con música de espera de ronquidos; 2) el ronquido es ya a dos voces; 3) el
contestador «le pasa con su comercial»… y es Maripaz, a tres metros, cobrándole la llamada.

**Consecuencia que vuelve:** si Bruno ha llamado alguna vez, al ganar el duelo Maripaz pide a Siestatón que quite el
ronquido; y Celestino lo narra (M6: «¡Y ella, a llamar al colchón!»).

**En pantalla:** el primer plano del móvil (`api.phone.call`) con un icono de colchón de 12×6 px en lugar de retrato.
Efecto nuevo `ronquido` (dos notas graves del sintetizador). En la 3.ª, `sfx gong` dentro de la llamada.

**Diálogo**

```text
(1.ª derrota · sustituye a la segunda línea de defeatLines)
MARIPAZ: Asignado a ti, cariño. El teléfono de Siestatón es este. Suerte.
(Primer plano del móvil: «Colchones Siestatón». Suena.)
SIESTATÓN: Ha llamado a Colchones Siestatón. Si desea dormir, pulse uno.
SIESTATÓN: Si ya duerme, no pulse. Le atenderemos en sueños.
(Música de espera: un ronquido en bucle.)
BRUNO: Me han puesto un ronquido en espera.
(Cuelga.)
BRUNO: Vuelvo con Maripaz. El colchón no tiene prisa.

(2.ª derrota)
SIESTATÓN: Bienvenido otra vez. Su llamada es muy importante. Por eso bostezamos.
SIESTATÓN: Para hablar con un colchón, pulse dos. Para una almohada, espere.
(Ronquido de espera, ahora a dos voces.)
BRUNO: Ahora roncan dos. Están ampliando plantilla.

(3.ª derrota y siguientes)
SIESTATÓN: Le pasamos con su comercial.
(¡Gong! dentro de la llamada.)
MARIPAZ: ¿Cariño? ¿Me llamas desde el colchón? Eso te lo facturo.
BRUNO: Maripaz, está usted a tres metros.
MARIPAZ: Por eso. Llamada a tres metros: tarifa de proximidad.

(Al ganar D1, si Bruno llamó alguna vez · se inserta tras rooms/ecosistema.js:82)
MARIPAZ: Y quitad el ronquido de la espera. Me lo ha chivado el becario.
```

**Cambio en el grafo:** ninguno.

---

## C. Plan de recorte de reparto y del chiste de la casa

### C.1 Quién se va, quién se funde, quién se queda

De unas 24 voces a **19**. Se van tres, se funde una y se recortan cuatro.

| Personaje | Decisión | Qué queda, en forma mínima |
|---|---|---|
| **Leoncio Quesitos** (Infografía) | **Se va.** 0 líneas en el camino crítico, árbol completo, subtrama sin consecuencia. | Su mesa de dibujo con un **quesito de cartulina colgado de una chincheta** (objeto). Su mejor línea («Esto, en barras. Esto, en tarta. Esto, en tarta pero triste», `actors.js:377`, risa según la crítica) pasa a Yoli, a quien le pega por voz. |
| **Herminia** (la herramienta) | **Se va como voz.** Queda como **objeto mudo**: el gag único de la guerra por una herramienta hecha con IA. | Un portátil con pegatina «INFOGRAFÍA» que **Desarrollo va envolviendo en cinta de carrocero** acto a acto (los estados de `frontera_carrocero` ya existen: recta → doble → lazo). En el Acto III es un paquete con etiqueta «PENDIENTE DE INTEGRAR (MARZO)». Tres líneas de Mirar, una por acto. Y una línea satírica en el registro de Paco. |
| **Anselmo Monolito** (director de Desarrollo) | **Se va.** Su cinta y su frontera pasan a Nemesio. | Sus inventos «transversales» ya son objetos y se quedan como están: el narrador automático del Ibex (Vestíbulo), el corrector IA que calza el Libro de Estilo (Redacción de papel), la nota de gasto generativa en la pared (Administración). Dos líneas suyas sobreviven en otras bocas (abajo). |
| **Tadeo Adjunto** | **Se funde con Borja.** Dos presencias de «el que reenvía» en la misma planta eran una. | Borja reenvía en persona, en voz alta y con «!!». Los «RV:» del móvil son de Borja y pierden la jerga (LCP, Core Web Vitals). El portátil se queda como «el portátil de Borja», con dos gags: el que reenvía al cerrarlo y el asistente que dice «¡Excelente pregunta!». |
| **Valentín Retícula** | **Se queda, corto.** Sin «estoy dirigiendo», sin monitor con la aventura, sin «sprite», sin «en mi juego». Fuera de los créditos. | Un Mirar, un árbol de dos opciones, dos murmullos y su papel en M2. Es el blanco de **un** chiste: lo sabía desde 2017 y lo único que hizo fue centrar el aviso. |
| **Custodia Precinto** | **Se queda, sin oráculo.** La crítica tiene razón: dos sistemas de pistas son uno de más. | Fuera el nodo `CU_DONDE` (`rooms/pecera.secretaria.js:113-136`), salvo «¿Dónde está Ramírez?». Se queda su voz (preguntas con punto, «Siguiente.») y el micro-puzle del boli muerto. |
| **Coro de Desarrollo** | **Se queda, al fondo.** De 13 discusiones + 4 «de fondo» a 4 + 1. | Cada 60-120 s, nunca con un globo o un menú abierto, como mucho 3 por visita (arreglo nº 4 de la crítica). Una sola discusión sobre Diseño. |
| **Nemesio** | **Se queda y crece.** Es la única voz con nombre de Desarrollo. | Hereda la cinta y la frontera de Anselmo y el papel de «el que enchufa» en M2. |
| **Borja** | **Se queda, con oficio.** Absorbe a Tadeo. | «Descopear» se queda como llave, pero con su traducción en la misma línea (arreglo nº 24). |
| Mercados (3 figurantes) | **Suben de figurantes a actores sin nombre** (M4). | Sin árboles: una línea cada uno y la huida. |

### C.2 Líneas que sobreviven, reescritas

| Origen | Línea original | Nueva (y quién la dice) |
|---|---|---|
| `actors.js:377` (Leoncio) | «Esto, en barras. Esto, en tarta. Esto, en tarta pero triste.» | YOLI (murmullo): «Esto, en barras. Esto, en tarta. Esto, en tarta pero triste.» (intacta) |
| `rooms/pecera.dialogos.js:115` (Leoncio) | «Un quesito que suma 130 % no es un gráfico. Es una aspiración.» | YOLI, al Dar la ficha: «Íñigo trae un quesito que suma 130 %. Le he pedido la fuente. Es él.» |
| `rooms/pecera.js:223` (mesa de dibujo) | «Una mesa de dibujo inclinada. Tiene polvo con forma de regla.» | BRUNO: «Un quesito de cartulina, con chincheta. Al lado, una chaqueta. Mirándolo.» |
| `rooms/pecera.js:228` (Herminia, Acto I) | «Herminia. Un portátil que hace infografías sola…» | BRUNO: «Un portátil que hace gráficos solo. Pegatina: «INFOGRAFÍA». Y cinta alrededor.» |
| (nuevo, Acto II) | — | BRUNO: «La cinta ya le da dos vueltas. Para que no se contagie el resto de la sala.» |
| (nuevo, Acto III) | — | BRUNO: «Envuelto entero. Etiqueta: «PENDIENTE DE INTEGRAR (MARZO)». Regalo de nadie.» |
| `rooms/cpd.js:166-167` (Paco, MP1) | «Esta casa da de alta antes a un portátil que a un chaval.» | BRUNO, en Mirar registro: «Ticket nº 2, hoy: «Alta portátil de Desarrollo». Cerrado en cuarenta segundos.» / BRUNO: «El nº 1 es un chaval. Lleva desde julio.» |
| `rooms/pecera.dialogos.js:153` (Anselmo) | «Peor. Si funciona, la gente se acostumbra.» | NEMESIO (M2): «¿Y si va sin pantalla? Peor. Si funciona, la gente se acostumbra.» |
| `rooms/pecera.dialogos.js:158` (Anselmo) | «La IA es de fuera. Pero el prompt es de dentro. Eso la hace nuestra.» | ÍÑIGO, opción «¿El Titulator escribe solo?»: «La IA es de fuera. El prompt es de dentro. La factura, de los dos.» |
| `rooms/pecera.dialogos.js:170` (Anselmo) | «Cuando algo se rompe a las tres de la mañana, ¿quién baja?» / «Paco abre un ticket. Bajo yo.» | PACO, opción nueva «¿Quién arregla esto de madrugada?»: «Cuando algo se rompe a las tres, ¿quién baja? Yo no. Yo ya estoy abajo.» |
| `rooms/pecera.js:309` (Anselmo) | «¡Eh! Eso es infraestructura.» | NEMESIO (Tirar la cinta): «¡Eh! Esa cinta está en el tablero. Columna: FRONTERA.» |
| `rooms/ecosistema.dialogos.js:92` (Tadeo) | «Tadeo confía. Leer es para quien duda.» | BORJA: «¡Yo no leo! ¡Confío! Leer es para los que dudan!!» |
| `rooms/ecosistema.js:56` (portátil) | «Lo cierro. Antes de apagarse, reenvía: «RV: Me han cerrado».» | Se queda (es risa según la crítica), ahora en el portátil de Borja. BORJA: «¡No lo cierres, que está reenviando un reenvío!» |
| `rooms/cpd.js:192-193` (Rubén) | «Trescientos al día. Al buzón del Titulator…» / «Le contesto: «Gracias, Tadeo».» | RUBÉN: «Trescientos reenvíos al día. De Borja. Soy el único que los lee.» / RUBÉN: «Le contesto: «Gracias, Borja». Él me contesta «¡A ti, equipo!!».» |
| `rooms/eventos.dialogos.js:28` (Borja) | «¡Compártelo! Por cierto: hemos descopeado la ética del Q3.» | BORJA: «¡Hemos descopeado la ética del Q3! O sea: quitada del plan sin que se note.» |
| `rooms/pecera.dialogos.js:203` (Valentín) | «Un segundo, que estoy dirigiendo.» | VALENTÍN: «Un segundo. Estoy centrando el aviso de «CMS caído». Va torcido.» |
| `rooms/pecera.dialogos.js:216` (Valentín) | «…Con una flecha roja. De dos píxeles de grosor. Para que se viera.» | VALENTÍN: «Desde 2017. Lo avisé con una flecha. Muy bien alineada. Nadie la vio.» |
| `rooms/pecera.secretaria.js:117` (Custodia) | «Desayunando.» / «¿Desde 2019?» / «Él desayuna despacio. Yo apunto rápido.» | Se queda (única opción superviviente de `CU_DONDE`, y prepara la entrada de Ramírez en el epílogo). |

### C.3 El chiste Diseño contra Desarrollo, a un tercio

La crítica cuenta **43 menciones de «Diseño»** y el coro hablando cada 14-24 s. Objetivo: **≤ 14 menciones**, todas
provocadas por algo que hace el jugador o a las que el jugador se acerca. Lo que **queda**:

1. Presentación del villano: «CORO: ¡Ha sido Diseño!» / «...No he dicho nada malo todavía.» (`rooms/pecera.escenas.js:85-86`). Funciona porque es la primera.
2. El CMS revive: «CORO: ¡Ha sido Diseño!» / «He sido yo. Pero gracias.» (`rooms/pecera.escenas.js:157-158`, dentro de M2).
3. Saludo del coro al hablarle: «¿Diseño?» / «No. Bruno.» / «Ah. Entonces no es culpa tuya.» (`rooms/pecera.dialogos.js:234-235`).
4. Opción del coro tras `cms_vivo`: «...Pues la pantalla la eligió Diseño.» (`rooms/pecera.dialogos.js:252`).
5. La única discusión de ambiente sobre Diseño: el margen de ocho píxeles, «...Queda bien.» / «No se lo digas.» (`rooms/pecera.js:58`).
6. La bandeja de Diseño y Producto: un Mirar y un Abrir con la hoja de 2017 (M2).
7. Valentín: un Mirar, dos opciones, dos murmullos (abajo).
8. El organigrama del vestíbulo: la casilla VACANTE cuelga de la rama de Diseño y Producto (`rooms/vestibulo.js:347-348`). Se queda como dato, no como chiste final.
9. La respuesta floja del duelo «Eso es cosa de Diseño.» con una sola contestación para todos y la de Teodoro por fax (`duelo.js:34-35`). Fuera la de Íñigo (`duelo.js:36`) y el grito en off del coro (`duelo.js:37`).

Lo que **se va**: el remate del epílogo y las dos líneas de créditos (ver D); 9 de las 13 discusiones
(`rooms/pecera.js:46-61`); 3 de las 4 «de fondo» (`rooms/pecera.js:65-74`: se queda solo `fondo_yoli`, muy velada y sin
comentario, como manda la casa); los nodos `CO_BANDEJA` y `CO_HERMINIA` (`rooms/pecera.dialogos.js:268-293`); las
opciones «¿Quién es Diseño?» y «¿Por qué se ha caído el CMS?»; el murmullo de Celestino «El de Diseño…» (`rooms/vestibulo.js:377`);
el de Borja «¡Valentín no necesita filtro!…» (`rooms/ecosistema.js:233`); el de Paco «Me abrió un ticket con márgenes»
(`rooms/cpd.js:344`); el de Nemesio «Esto a Diseño, que ya lo entregó» (`rooms/pecera.js:440`); el monitor de Valentín con
la aventura gráfica (`rooms/pecera.js:369-376`); «Lo rediseñó Valentín» en el ascensor (`rooms/pecera.js:146`, la crítica
lo marca como resto de cambio tardío).

**Las cuatro discusiones de ambiente que quedan** (todas con D3 diciendo «No.», el único chiste de personaje del coro):

```text
(1 · solo sin cms_vivo)
D1: ¡Se ha caído el CMS!
D2: ¡Hay que levantarlo!
D1: ¿Cómo?
D2: ...Gritando más alto.
D3: No.

(2)
D1: Ha llovido y ha bajado el tráfico.
D2: ¡Abrid una incidencia a la lluvia!
D1: La lluvia no es nuestra.
D3: No.

(3 · la única de Diseño)
D1: ¿Quién ha puesto este margen de ocho píxeles?
D2: Diseño.
D1: ...Queda bien.
D2: No se lo digas.

(4 · solo con cms_vivo)
D1: ¡Va el CMS!
D2: ¿Quién ha sido?
D1: Un becario.
D2: ...Eso no lo apuntes.
D3: No.
```

**El cameo de Valentín, entero**

```text
(Mirar valentin_reticula)
BRUNO: Valentín Retícula, director de Diseño y Producto. El único que queda.
BRUNO: Lleva cascos sin música. Para no oír de qué tiene la culpa.

(Hablar · onStart)
VALENTÍN: Un segundo. Estoy centrando el aviso de «CMS caído». Va torcido.
(Opciones)
BRUNO: Desarrollo dice que todo es culpa de Diseño.
VALENTÍN: Lo sé. Lo gritan en mayúsculas. Les he bajado el cuerpo de letra.
BRUNO: ¿Sabía que la pantalla tumbaba el CMS? (si cms_vivo)
VALENTÍN: Desde 2017. Lo avisé con una flecha. Muy bien alineada. Nadie la vio.
BRUNO: Me voy.
VALENTÍN: Sal por la izquierda. Equilibra la composición.

(Dar cualquier cosa)
VALENTÍN: Gracias. A ocho píxeles del borde. ...Siete. Ya. Respira.

(Murmullos)
VALENTÍN: Margen superior, ocho. Inferior, ocho. El CMS, caído. Pero equidistante.
VALENTÍN: Nota para el lunes: abrirle la bandeja a Desarrollo. Con cariño.
```

Valentín **no** sale en la escena 7.2 (bastaba con verlo lejos; ahora ni eso), ni en el epílogo, ni en los créditos.

---

## D. Nuevo epílogo y créditos

**Criterio:** 67 líneas → **41** (contando las opcionales de Evaristo y del rumor). Fuera la Redacción, la infografía, el
coro, «Diseño soy yo» y la cuarta pared. Yoli **baja al vestíbulo** y va antes de la abuela, para que la abuela sea lo
último que se oye. Ramírez pasa del poscréditos al epílogo (paga M3). El último texto del juego es «Abrígate».

```text
(Fundido. Rótulo:)
NARRADOR: Sábado, 6:00.
(Vestíbulo. Amanece en la puerta de la calle. Celestino en el mostrador. Rubén, de pie junto al cristal. Bruno.)
RUBÉN: ¿Sigue gobernando el mismo?
CELESTINO: ¿Tú eres el nuevo?
RUBÉN: Sí.
(Tin. Sale Íñigo del ascensor con su caja de cartón: pósits, matriz, portátil.)
CELESTINO: ¿Íñigo? ¿El becario de marzo del 98? ¡Te dejaste la taza!
(Celestino saca de objetos perdidos una taza: «BECARIO 98». Íñigo la mira mucho rato.)
ÍÑIGO: ...Me la quedo.
(Sale Gervasio detrás.)
GERVASIO: Íñigo. Hay una beca en Mercados. Lo hablamos.
ÍÑIGO: ¿Cuándo?
GERVASIO: Ahora. Lo estamos hablando, ¿no?
(Salen los dos a la calle. Entra Ramírez, el de Bolsa, con un cruasán mordido.)
RAMÍREZ: Buenos días. ¿Me he perdido algo?
CELESTINO: ¿Tú eres el nuevo?
RAMÍREZ: Bajé a desayunar.
BRUNO: Su chaqueta está en la Sala Amazonas. En el suelo. Con el Lector Medio.
RAMÍREZ: ...Entonces sí me he perdido algo.
(Ramírez sube la escalera, masticando. ¡Plof!: el fardo de periódicos cae en el mostrador.)
CELESTINO: ¡Furgoneta del polígono! ¡Recién salidos! ¡Todavía manchan!
(Bruno coge uno. Plano detalle: PÁGINA 7. «Hidrovoltia lanza una opa sobre Banco Robledal». «Por Bruno Pellejo».)
BRUNO: Bien escrito. Bruno. Pellejo. Con las dos eles.
CELESTINO: ¡Hidrovoltia se lanza a por el Robledal! ¡Eso es opa, árbitro!
BRUNO: Celestino, que la noticia es mía.
CELESTINO: ¿Tú eres el nuevo?

(Opcional, solo con correo_evaristo_listo · se queda tal cual, escenas/final.js:112-124)
EVARISTO: Pellejo. Lo he revisado en el periódico. Con jota y dos eles. Correcto.
BRUNO: Gracias, don Evaristo.
EVARISTO: Le escribiré un correo para felicitarle.
BRUNO: ¿Y si me lo dice ahora?
(Se lo piensa. Mucho.)
EVARISTO: ...Felicidades. Es la primera vez que lo digo sin adjunto.

CELESTINO: Y esto ha llegado por fax. Para ti. «PLAZA 1. ES TUYA, CHAVAL.»
BRUNO: No tengo coche.
CELESTINO: Pone algo más: «Y QUE NADIE ME DESEE NADA.»
(Celestino tacha una línea en el cuadro de llaves.)
CELESTINO: ¡Cambio en el garaje! ¡Sale Teodoro, entra el chaval! ¡Y sin coche!

(Baja Yoli por la escalera con la tableta, al final de su guardia.)
YOLI: Bruno. Esa cuenta que comenta «abrígate» en todo...
YOLI: Cuarenta y siete minutos en tu pieza. La portada dura nueve.
BRUNO: ¿Cuántos lectores?
YOLI: Una. Pero se lo lee TODO. La tengo como KPI.
YOLI: Y comentó en lo de la cafetera: «Ese chico está flaco».
(Suena el móvil de Bruno. Primer plano: «Abuela».)
ABUELA: ¿Bruno? ¿Has comido?
BRUNO: Abuela. Salgo en el papel. Página 7. Con mi nombre bien escrito.
ABUELA: Ay, hijo. El papel lo dejé en 2011, que me manchaba el sofá.
BRUNO: ...
ABUELA: Yo te leo todas las mañanas en el móvil. Te pongo un corazoncito.
BRUNO: ¿En todo?
ABUELA: En todo. Hasta en lo del Euríbor.
ABUELA: No lo entiendo, pero lo escribes muy bonito.

(Opcional, solo con rumor_firma_n ≥ 4 · se queda tal cual, escenas/final.js:146-150)
ABUELA: En el pueblo digo que eres el dueño. Que suena más.
BRUNO: Abuela...
ABUELA: Tú déjame. Los rumores, en el pueblo, son como el periódico.
ABUELA: Si lo dice mucha gente, sale.

ABUELA: Y te pongo «abrígate». Que nunca contestas.
(Cuelga. Bruno mira el móvil: su pieza en la web, y debajo, un comentario: «abrígate».)
(Pulsa «Responder». Escribe despacio. En pantalla: «Me abrigo, abuela.» Enviar.)
(Celestino, sin decir nada, le enrolla al cuello la bufanda del IBEX.)
(Fundido a negro. flag juego_terminado.)
```

*Nota de tono:* la línea de la abuela «son como el periódico» contiene «como», pero no es un remate: es una comparación
con su sujeto, la deja la biblia y está protegida. Ninguna línea nueva del epílogo usa la fórmula.

**La fe de erratas (pantalla fija, no desplazada; papel de periódico y el boli rojo de Aurora encima, 6 s):**

```text
FE DE ERRATAS
En la edición de ayer, donde decía «inteligencia artificial»
debía decir «Rubén».
Donde decía «Por Bruno Pellejo»
debía decir «Por Bruno Pellejo».
Lamentamos el acierto.
```

**Créditos (se desplazan después; las viñetas de siempre: Aurora se desmaya sobre el Libro de Estilo, el LCD de
Gertrudis arriba, y la impresora de la tercera imprimiendo «BANDEJA 2 INSTALADA» como viñeta en mitad del rollo, no al
final):**

```text
Guion · Asignado a: el equipo de guion
Duelos · Asignado a: quien no se escaqueó
Motor y pegamento · Asignado a: Sistemas (ticket nº 2)
Fondos · Asignado a: tres artistas con tipómetro
Música · Asignado a: un secuenciador de onda cuadrada
(plano de Aurora en la Redacción de papel)
Eventos · Asignado a: Pilar Escaleta. Empezamos en cinco minutos.
Marketing · Asignado a: Borja Engagement (en vertical y en copia)
Controlling · [con correo] el único que leyó hasta el final · [sin] un correo que nadie quiso oír
Material · Asignado a: Custodia Precinto. Devuélvanle el boli.
Errores · Asignado a: el CMS (ticket nº 3, 2017, no prioritario)
Salas · Asignado a: Ramírez (ha vuelto; pide sala para el viernes)
Reenvíos · Asignado a: la impresora de la tercera, la única que leía a Borja
Rumores · Asignado a: el ficus del vestíbulo (micrófono de 1994)
Plazas de garaje · Asignado a: Bruno Pellejo (plaza 1, sin coche)
Lectores · Asignado a: Remedios. Cuarenta y siete minutos.

Ninguna rotativa fue apagada durante el desarrollo de este juego.

Sala Polivalente · Cuenta atrás: 00:04:59. Por fin empezamos.

Gracias por jugar.
Abrígate.
FIN
```

**Lo que sale de los créditos:** «Errores: Diseño (que no fue)», «Diseño y Producto: Entregado a las 18:29», «Dirección de
arte: Valentín Retícula», «Infografía: Herminia…» (`escenas/final.js:212-223`). El hilo de la esquina pasa de Tadeo a
Borja y sale en mitad del rollo, no al final:

```text
De: Borja Engagement · RV: Fe de erratas «¡Equipo! ¿Esto lo ha escrito la IA?!!»
De: Bruno Pellejo · RE: No. Un becario.
De: Borja Engagement · RE: ¡Qué modelo más bueno! ¿Cuánto cuesta?
De: Evaristo Salvedad · RE: Cuarenta y ocho euros. Con coma.
```

**Lo que desaparece después de los créditos:** el poscréditos de Ramírez (ya está en el epílogo) y la impresora como
última imagen (ya está en el rollo). Después de «Abrígate. FIN», título.

---

## E. Biblia de voces

Tres reglas por personaje (**sintaxis**, **vocabulario**, **nunca**) y seis líneas reales reescritas para que se
reconozca quién habla sin ver el nombre. La prueba: tapar la columna del nombre y adivinar. El Lector Medio no
entra: solo tiene una frase y es perfecta.

### Bruno
- **Sintaxis:** primera persona, presente, frases que empiezan describiendo y acaban **haciendo algo amable o
  esperanzado** con lo que acaba de pasar. Habla con los objetos como con compañeros.
- **Vocabulario:** de oficina contado por alguien que se lo cree: «por respeto», «por si acaso», «fijo», «por fin».
- **Nunca:** cinismo contra una persona, el remate «Como X», la segunda persona para hablar de sí mismo.

| Original | Nueva |
|---|---|
| `actors.js:197` «Soy yo. Joven, prometedor y sin contrato. Como una startup.» | «Soy yo. Me pongo derecho. Por si hoy es el día.» |
| `rooms/vestibulo.js:216` «Le digo «buenas noches, Contable». No me cuenta. Como siempre.» | «"Buenas noches, Contable". No contesta. Mañana se lo digo en papel. Fijo.» |
| `rooms/office.js:190` «Pulso la B4… y se queda colgando. Como yo.» | «Pulso la B4. La bolsa se asoma y se lo piensa. Ánimo. Yo tardé seis años.» |
| `rooms/catacumba.js:456` «Abro la bandeja. Vacía. Como mi cotización.» | «Bandeja vacía. Le dejo mi tarjeta, por si llega papel y pregunta por mí.» |
| `rooms/pecera.js:177` «Las pantallas siguen encendidas. Sin nadie. Como la web.» | «Pantallas encendidas y nadie delante. Les bajo el brillo. Por respeto.» |
| `lib/movil.js:28` «Pienso gratis, entonces. Como siempre.» | «Pensar no desgrava. Llevo seis años haciéndolo gratis. Soy un experto.» |

### Celestino
- **Sintaxis:** exclamación, presente de retransmisión, frases de tres golpes. Pregunta «¿Tú eres el nuevo?» y no
  escucha la respuesta.
- **Vocabulario:** fútbol para todo: banda, banquillo, cantera, descuento, árbitro, vestuario, fichaje.
- **Nunca:** una cifra del Ibex bien dicha, un tono bajo, llamar a Bruno por su nombre.

| Original | Nueva |
|---|---|
| `rooms/vestibulo.js:340` «Déjalo. Bajo la bufanda no molesta. Como yo.» | «¡Ni lo toques! ¡Narra sin alma! ¡Lo tengo sancionado tres partidos!» |
| `rooms/vestibulo.js:363` «Esas llaves no se tocan. Las custodio yo. Y el garaje me custodia a mí.» | «¡Quieto! ¡Esas llaves son la cantera! ¡Doce plazas, ciento doce suplentes!» |
| `rooms/vestibulo.js:389` «Gracias, pero el café me lo traigo en termo. Desde 1994.» | «¿Café? Juego con termo propio desde el 94. Fichaje de la casa.» |
| `rooms/vestibulo.js:153` «Nada es lo que más entra por ese torno.» | «¡Y se va al vestuario sin preguntar por el Ibex! ¡Otro más!» |
| `rooms/vestibulo.js:325` «Esa planta lo oye todo. Por eso es la que más dura.» | «¡Esa planta es la mejor ojeadora de la casa! ¡Treinta años sin perderse una!» |
| `escenas/final.js:136` «La línea de sucesión acaba de enloquecer.» | «¡Cambio en el garaje! ¡Sale Teodoro, entra el chaval! ¡Y sin coche!» |

### Yoli
- **Sintaxis:** cadenas de búsqueda sin verbo («café quinto, café efectos…») y cifras antes que adjetivos. Las
  emociones, siempre con número.
- **Vocabulario:** concurrentes, rebote, tendencia, convierte, cola larga, KPI (y nada más técnico que eso).
- **Nunca:** una emoción sin medir, «no lo sé» (hasta M2, que es su momento), una frase larga sin cifra.

| Original | Nueva |
|---|---|
| `rooms/pecera.js:422` «¿Café? Llevo cuatro. El quinto lo mido.» | «¿Café? Café quinto, café efectos, café taquicardia normal. Paso.» |
| `rooms/pecera.js:424` «¿Sin número en el titular? ¿Sin "lo que nadie te cuenta"? Valiente.» | «¿Sin número? ¿Sin «esto»? ¿Sin «así»? Bruno, eso no lo busca nadie.» |
| `rooms/pecera.dialogos.js:26` «Vuelve cuando tengas un titular con número.» | «Vuelve con un titular con número. El siete. El siete convierte.» |
| `rooms/pajarera.js:142` «¿El Lector Medio lleva la chaqueta de Ramírez? ¡Que nadie la toque!» | «¡Lector Medio chaqueta! ¡Lector Medio Ramírez! ¡Que nadie la toque!» |
| `escenas/final.js:165` «Es el récord de la historia del medio.» | «La portada dura nueve minutos. Mi última cita, cuatro. Ella, cuarenta y siete.» |
| `rooms/pecera.dialogos.js:24` «Una cuenta que solo pone "abrígate". En todo. Será un bot.» | «Una cuenta que solo pone «abrígate». En todo. Rebote cero. Será un bot.» |

### Nemesio
- **Sintaxis:** frases cortas en forma de **estado de ticket**: «Esto, a X». Habla bajo y nunca usa exclamaciones.
- **Vocabulario:** columnas (POR HACER, BLOQUEADO, HECHO, HECHO (PERO NO)), tablero, chincheta, requisito, número.
- **Nunca:** «Diseño», levantar la voz, aceptar algo que no tenga columna.

| Original | Nueva |
|---|---|
| `rooms/pecera.js:433` «El CMS no es nuestro, es de Sistemas. Y no, no tengo un momento.» | «El CMS no es nuestro. Está en la columna de Sistemas. Con chincheta.» |
| `rooms/pecera.js:364` «Déjala. Es lo único ordenado del rincón. Y no es nuestro.» | «Esa bandeja no tiene columna. Si no tiene columna, no la veo.» |
| `rooms/pecera.dialogos.js:53` «Cierra la puerta al salir. No hay puerta. Ciérrala igual.» | «Te paso a EN CURSO. No te vengas arriba: no es HECHO.» |
| `rooms/pecera.dialogos.js:41` «El del ordenador miente. Este no: trae santoral y tacos del 8.» | «El del ordenador se actualiza solo. Este no. Por eso me fío.» |
| `rooms/pecera.dialogos.js:88` «Prometo cuidarlo.» / «No lo cuides. Llévaselo a Paco.» | Opción «¿Y el álbum?» → «Lo devuelvo yo. Tú, el pósit a Paco. En la mano. Sin doblar.» |
| `rooms/pecera.js:440` «Esto a POR HACER. Esto a BLOQUEADO. Esto a Diseño, que ya lo entregó.» | «Esto, a POR HACER. Esto, a BLOQUEADO. Esto, a «ya veremos». Columna nueva.» |

### Teodoro (por fax)
- **Sintaxis:** telegrama en mayúsculas, sin artículos cuando puede, y una cifra de caracteres o de líneas en cuanto
  hay ocasión. «Chaval» como única ternura.
- **Vocabulario:** cuerpo 9, líneas, caracteres, cabe / no cabe, medir, Goyita.
- **Nunca:** un adjetivo de elogio (hasta «Hijo mío», que es el premio), la palabra «web» sin desprecio, hablar en voz
  alta (salvo al teléfono rojo).

| Original | Nueva |
|---|---|
| `rooms/catacumba.js:286` «Cierra al salir. Y no toques el reloj.» | «CIERRA AL SALIR. EL RELOJ NO SE TOCA: LAS 20:59 CABEN.» |
| `rooms/catacumba.js:565` «Eso no se faxea.» | «ESO NO SE FAXEA. NO CABE. LO HE MEDIDO DE LEJOS.» |
| `rooms/catacumba.js:314` «¿Qué quieres, chaval?» | «¿QUÉ QUIERES, CHAVAL? EN MENOS DE TREINTA Y OCHO CARACTERES.» |
| `rooms/catacumba.js:471` «Toca eso y te mido a ti.» | «TOCA ESO Y TE MIDO. UN METRO SETENTA. CUERPO 9. NO CABES.» |
| `rooms/catacumba.js:464` «Ese teléfono no se toca. Es nuestro.» | «ESE TELÉFONO ES DE LA GOYITA Y MÍO. TÚ, POR FAX.» |
| `rooms/catacumba.js:561` «Las fuentes, a Aurora. Yo solo mido.» | «LAS FUENTES, A AURORA. A MÍ TRÁEME LÍNEAS. CONTADAS.» |

### Aurora
- **Sintaxis:** **corrige lo último que ha dicho Bruno antes de contestarle**. Frases completas, con subjuntivo cuando
  puede. Ni una exclamación.
- **Vocabulario:** «criatura», tilde, coma, sujeto y predicado, «se dice».
- **Nunca:** «!», un anglicismo, «detrás mío».

| Original | Nueva |
|---|---|
| `rooms/catacumba.js:588` «Eso no lleva tilde ni la necesita. No me interesa.» | «Se dice «le traigo», criatura, no «le doy esto». Y no, no lo quiero.» |
| `rooms/catacumba.js:504` «Deja el cartel, criatura. Lleva treinta años sin una errata.» | «El cartel se queda, criatura. Es lo único de esta sala sin una falta.» |
| `rooms/catacumba.js:255` «¿Qué quieres, criatura?» | «Dime, criatura. Con sujeto y predicado, si puede ser.» |
| `rooms/catacumba.js:582` «Tiene un adjetivo. Lo dejo. Hoy estoy de buenas.» | «Le dejo el adjetivo. Que se note que lo escribió alguien.» |
| `rooms/catacumba.js:116` «Ha hablado. En voz alta. Desde 1996 no...» | «Ha hablado. En voz alta. Sin faltas. Voy a tener que sentarme.» |
| `rooms/catacumba.js:584` «La ficha es tuya. No la arrugues, que la rotativa lo nota.» | «La ficha es tuya. Plana, sin dobleces. La rotativa nota las arrugas.» |

### Gervasio
- **Sintaxis:** **pasiva e impersonal** para todo lo que implique hacer algo («se coge», «se le ha pedido»); primera
  persona solo para no hacer nada («yo superviso», «yo espero»). «Lo hablamos» solo como cierre, una vez por visita.
- **Vocabulario:** delegar, en copia, supervisar, «se verá», orden del día.
- **Nunca:** «yo» + un verbo de trabajo, un compromiso con fecha, terminar la frase «siguientes pasos».

| Original | Nueva |
|---|---|
| `rooms/pajarera.js:297` «Eso lo coges tú. Ah, que ya lo tienes. Pues eso.» | «Eso se coge. Lo coges tú, se entiende. Yo lo superviso desde aquí.» |
| `rooms/office.js:280` «¿Café? Eso lo coges tú. Yo espero a que la máquina me lo ofrezca.» | «¿Café? Se le ha pedido a la máquina. Que venga ella.» |
| `rooms/sala_amazonas.js:164` «Yo aquí solo estoy en copia. Como toda la empresa. Lo hablamos.» | «Yo aquí estoy en copia. Oculta. La copia buena.» |
| `rooms/office.js:281` «Eso ya no es mío. Lo he delegado. En ti. Lo hablamos.» | «Eso está delegado. En ti. Con efectos retroactivos.» |
| `rooms/office.js:113` «Estoy esperando a que la máquina me salude. Diecinueve años esperando cosas…» | «Se está esperando a que salude la máquina. Se espera bien. Diecinueve años.» |
| `rooms/pajarera.js:329` «Vacante. Te iba a llamar. Bueno, no. Lo hablamos.» | «Vacante. Se te iba a llamar. Por alguien. Ya se verá por quién.» |

### Begoña
- **Sintaxis:** lenguaje de ventanilla: concepto, importe, justificante; usted para el trámite, «niño» cuando se le
  escapa la persona. El sello suena entre frases (efecto, no texto).
- **Vocabulario:** original/duplicado/triplicado, NIF, F-1, dorso, importe, «de oficio».
- **Nunca:** una emoción que no tenga forma de trámite, una cifra sin céntimos, «más o menos».

| Original | Nueva |
|---|---|
| `rooms/administracion.js:173` «Toca algo de esta ventanilla y lo sello. A usted también.» | «Toque algo y se lo sello. A usted, en el dorso. Nadie mira el dorso.» |
| `rooms/administracion.dialogos.js:51` «Es lo más eficiente que ha hecho hoy.» | «Salida sin trámite. La anoto como lo más eficiente del día. Por triplicado.» |
| `rooms/administracion.js:170` «Tres casillas. Bien. Pero ninguna dice «importe».» | «Tres casillas y ninguna dice «importe». Eso es una ficha con aspiraciones.» |
| `rooms/administracion.dialogos.js:133` «No me dé las gracias. Las gracias no se pueden sellar.» | «No me dé las gracias, niño. Las gracias no tienen NIF.» |
| `rooms/administracion.js:166` «Eso es suyo. Para su archivo personal. Yo ya tengo el original.» | «Es su duplicado. Si me lo quedo, usted se queda sin archivo personal.» |
| `rooms/administracion.dialogos.js:98` «Esto... esto sigue siendo un insulto a la contabilidad.» | «Otra vez el sobre. Lo reconozco. Tiene antecedentes.» |

### Borja (absorbe a Tadeo)
- **Sintaxis:** habla **en reenvíos**: «¡RV: …!» en voz alta, doble cierre de exclamación sin apertura («!!»), y
  «Por si os sirve!!» como despedida. Cuando dice una palabra de jerga, la traduce mal en la misma frase.
- **Vocabulario:** contenido, en vertical, reenviar, resumen, a todos, equipo.
- **Nunca:** leer algo antes de reenviarlo, LCP, Core Web Vitals o cualquier sigla sin traducir.

| Original | Nueva |
|---|---|
| `rooms/ecosistema.dialogos.js:44` «¡Engagement! Que la gente quiera lo que ya tiene.» | «¡Reenviar! Que le llegue a todos. Leerlo, ya si eso, la impresora.» |
| `rooms/ecosistema.dialogos.js:45` «¡Eso es de Eventos! Yo solo lo cuento. Antes de que pase.» | «¡Eso es de Eventos! Yo lo reenvío antes de que pase. Así llega primero!!» |
| `rooms/ecosistema.dialogos.js:48` «¡Salida de escena! ¡Eso es un cierre de embudo!» | «¿Te vas? ¡Reenvío tu salida! ¡A todos! ¡Con resumen!» |
| `rooms/ecosistema.js:244` «¡Gracias! Lo subo. Luego te lo devuelvo, si no se viraliza.» | «¡RV: Bruno me da una cosa! Ya lo sabe la planta. Ahora, la cosa.» |
| `rooms/ecosistema.js:238` «¡Contacto físico! ¡Eso es engagement orgánico!» | «¡Me empujas! ¡RV: Bruno empuja! ¡Por si os sirve!!» |
| `rooms/ecosistema.js:239` «¡Café en mano! ¡Eso es un post! Quédatelo, que tú conviertes mejor.» | «¡RV: Bruno con café! Quédatelo. Con taza conviertes más.» |

### Maripaz
- **Sintaxis:** toda frase lleva **un precio o un patrocinio** («X, con Marca Inventada»). El gong suena como punto final
  (efecto). «Cariño» como mucho una vez por escena (hoy sale 35 veces, 21 en una sala).
- **Vocabulario:** tarifa, factura, más IVA, patrocinio, módulo, «te lo dejo en».
- **Nunca:** algo gratis, el teléfono de un cliente un viernes, un nombre de marca real.

| Original | Nueva |
|---|---|
| `rooms/ecosistema.js:267` «A mí no se me coge, cariño. Se me contrata.» | «A mí no se me coge. Se me contrata. Tarifa de noche: el doble.» |
| `rooms/ecosistema.dialogos.js:72` «Eso ha sido una despedida. La facturo.» | «Despedida con gong: trescientos más IVA. Te la dejo en doscientos.» |
| `rooms/ecosistema.js:146` «Eso no es una venta, cariño. Es una ilusión. Y no la facturo.» | «Ese rojo no está vendido, cariño. Lo apunto como ilusión patrocinada.» |
| `rooms/ecosistema.dialogos.js:71` «Encantados. Ahora la web respira. El banner, digo.» | «Encantadísimos. Banner que respira, con Siestatón. Ronca y todo.» |
| `rooms/ecosistema.js:220` «¡Deja eso, cariño! Es una inversión a largo plazo.» | «¡Esa piel no se toca! Tiene pósit, destinatario y fecha de vencimiento.» |
| `rooms/ecosistema.js:266` «Uy, cariño. Eso lo facturo como experiencia de usuario.» | «¡Gong! Empujón facturado: experiencia de usuario. Ochenta euros.» |

### Pilar
- **Sintaxis:** **sin aliento**: frases que se interrumpen para contar algo («ciento diez, ciento once…») y una cuenta
  atrás en cada respuesta. «Cambio» al final cuando habla al walkie.
- **Vocabulario:** acreditado, escaleta, cruz de cinta, catering, 21:05, cinco minutos.
- **Nunca:** «ya hemos empezado», saber de qué va el evento, una frase sin un número.

| Original | Nueva |
|---|---|
| `rooms/eventos.js:155` «El gong no se mueve. Tiene la marca de cinta en el suelo.» | «¡El gong no! Tiene su cruz. Ciento doce sillas, un gong, una cruz. Cambio.» |
| `rooms/eventos.dialogos.js:95` «¡Hasta ahora! Te guardo la silla ciento trece.» | «¡Hasta ahora! Cinco minutos. Cuatro y medio. ¡Vete, que te cuento!» |
| `rooms/eventos.js:307` «Gracias. Lo acredito y lo pongo en la mesa de bienvenida.» | «¡Gracias! Acreditado, numerado y a la mesa. Ciento trece... no. Objeto.» |
| `rooms/eventos.js:39` «¡Acreditado! Empezamos en cinco minutos.» | «¡Flash! ¡Acreditado! Ya sois dos. Dos es reunión. Tres, evento. ¡Corre!» |
| `rooms/eventos.js:108` «¡Foto de acreditación! Ya constas en un evento.» | «¡Foto! Ya constas en un evento. El que sea. En cinco minutos lo sabremos.» |
| `rooms/eventos.js:254` «¡Fuera de mi mesa! Acreditar es un oficio. Tiene escaleta.» | «¡Fuera de mi mesa! Detrás de esa mesa solo acreditamos el walkie y yo.» |

### Paco
- **Sintaxis:** contesta con un **número de ticket** antes que con una frase; dice que no y ayuda de lado.
- **Vocabulario:** ticket, número, perímetro, prioridad, abierto/cerrado, «por ticket».
- **Nunca:** «sí», luz natural, cerrar un ticket sin ceremonia.

| Original | Nueva |
|---|---|
| `rooms/cpd.js:354` «¿Viene con número de ticket? Pues no lo veo.» | «Sin número no lo veo. Literalmente. Tengo el ojo configurado así.» |
| `rooms/cpd.js:246` «Lo alquiló el consultor. Yo ahí no entro, que me factura.» | «Armario alquilado. Fuera de mi perímetro. Ticket a nombre de nadie.» |
| `rooms/cpd.js:352` ««Pellizco». Te abro un ticket: «Nombre mal escrito». Ponte a la cola.» | ««Pellizco». Ticket 48.215: «Nombre mal escrito». Prioridad: tú.» |
| `rooms/cpd.js:351` «Quédatelo. Yo ya tengo el recuerdo. Y una foto mental.» | «Quédatelo. Yo me quedo el recuerdo. Abierto en julio. Cerrado hoy. Precioso.» |
| `rooms/cpd.js:333` «Ahí abajo hay cables de 1997. Y un bocadillo de 2003.» | «No abras. Ticket 211: «Ruido bajo el suelo». Es el bocadillo. Lo sé.» |
| `rooms/cpd.js:353` «Fotos de eventos. Yo no salgo en ninguna. Lo tengo por ticket.» | «Fotos. No salgo en ninguna. Ticket 9: «Que nadie me haga fotos». Funciona.» |

### Íñigo
- **Sintaxis:** **eufemismo que escala**: ninguna palabra de pérdida; todo se convierte en «oportunidad» y en un
  cuadrante. Le gustan los tríos y las frases que suenan a diapositiva.
- **Vocabulario:** escalar, desvincular, perímetro, valor, input, cuadrante, colores de pósit.
- **Nunca:** «despedir», «error», «no sé». Ni una pregunta sincera hasta la fase 1 del clímax.

| Original | Nueva |
|---|---|
| `rooms/pajarera.js:287` «Yo solo tomo agua con gas y sinergias.» | «No, gracias. El café no escala. El agua con gas sube sola.» |
| `rooms/pajarera.js:288` «Perfecto. Con esto te doy de baja más rápido.» | «Perfecto. Con foto te desvinculo en un clic. Sin foto, en dos.» |
| `rooms/pajarera.js:321` «Te tengo en la matriz.» | «Te tengo en la matriz. Arriba a la derecha. Es donde menos duele.» |
| `rooms/sala_amazonas.js:205` «¿Vacante? Esto es una Reunión de Dirección. Los becarios no tienen voz.» | «¿Vacante? Reunión de Dirección. Los becarios tienen escucha. Pasiva.» |
| `rooms/pajarera.js:190` «Este sofá es un espacio de alto valor. Tú eres bajo coste.» | «Ese sofá es para perfiles de alto valor. Tú siéntate en tu potencial.» |
| `rooms/pajarera.js:289` «¿Un fax? Qué entrañable. Te lo pongo en la matriz: "Vintage".» | «¿Un fax? Qué entrañable. Lo pongo en verde: oportunidad de museo.» |

### Rubén
- **Sintaxis:** dos registros que chocan en la misma línea: **titular en mayúsculas** que se le escapa y, después,
  susurro con disculpa.
- **Vocabulario:** detectado, te sorprenderá, lo que pasó después, táper, atún, sol, ventana.
- **Nunca:** una queja larga; ni un reproche a Bruno; pedir algo más grande que un táper.

| Original | Nueva |
|---|---|
| `rooms/cpd.js:362` «¿Café? Gracias. Pero lo que necesito es un táper. Y la baja.» | «CAFÉ DETECTADO. LO QUE NECESITA ESTE BECARIO TE SORPRENDERÁ. ...Un táper.» |
| `rooms/cpd.js:94` «Gracias. Voy a buscar una ventana.» | «BECARIO LIBERADO BUSCA VENTANA. ...Perdón. Voy a buscar una ventana.» |
| `rooms/cpd.js:190` «Mirar el sol. Y preguntar quién gobierna.» | «Comer algo que no sea atún. Y que no me lo facture nadie.» |
| `rooms/cpd.js:187` «Todos. «No es un despido: es una salida en valor». Mía.» | «TODOS. «NO ES UN DESPIDO: ES UNA SALIDA EN VALOR». ...Esa es mía. Perdón.» |
| `rooms/cpd.js:192` «Trescientos al día. Al buzón del Titulator.» | «Trescientos reenvíos al día. De Borja. Soy el único que los lee.» |
| `rooms/cpd.js:180` «¿Me traes un táper?» | «¿TRAES TÁPER? ...Perdona. Hola. ¿Traes táper?» |

### La abuela Remedios
- **Sintaxis:** no contesta a lo que le dicen: **contesta con una anécdota del pueblo o de la familia** que resulta ser
  la pista, y cierra con una orden de cuidado («cena», «abrígate»).
- **Vocabulario:** tu abuelo, tu tío, tu primo, la del pan, el grupo del pueblo, hijo.
- **Nunca:** una palabra de oficina, una pregunta que espere respuesta, «Como X» de remate.

| Original | Nueva |
|---|---|
| `game.js:57` «El que no contesta, contesta solo. Como el contestador de tu tío.» | «Tu tío pone el contestador y se contesta solo. Hazle eso a ese señor.» |
| `game.js:58` «Si te sobra, recorta por abajo. Como los pantalones.» | «Si te sobra, dáselo a quien corta. La que me hace los bajos no pregunta.» |
| `game.js:51` «A veces las cosas no van porque hay otra cosa mirándolas todo el rato.» | «La tele de tu abuelo no iba si él la miraba. Apágale algo a alguien.» |
| `game.js:53` «Las máquinas viejas son como yo: sin papel no dicen nada.» | «Las máquinas viejas, sin papel, no hablan. Dales papel. Y tú cena.» |
| `game.js:48` «¿Estás de pie? Siéntate. Y si hay una chaqueta, que la lleve alguien importante.» | «Tu abuelo, con chaqueta, mandaba en el bar. Pónsela a alguien que mande.» |
| `game.js:59` «¿Y a qué esperas para darle los papeles a ese señor del fax?» | «Al señor del fax llévale los papeles. Dile que vas de mi parte.» |

*Además (arreglo nº 2 de la crítica, sin tocar el motor de pistas más que en el texto):* si se la llama dos veces
seguidas con la misma pista pendiente, la segunda vez no repite: dice «Eso ya te lo he dicho. Tu tío tampoco escucha.»
y pasa a la pista siguiente de la lista que no esté resuelta.

### Gertrudis
- **Sintaxis:** **código de error + frase**, siempre en mayúsculas, siempre en una línea de LCD. Diva: todo es sobre ella.
- **Vocabulario:** E-nn, saludo, público, modales, rencor, emisión.
- **Nunca:** minúsculas, un café sin saludo, perdonar.

| Original | Nueva |
|---|---|
| `rooms/office.js:90` «ESO DICEN TODOS.» | «E-31: MIRAR NO ES SALUDAR. ANOTADO.» |
| `rooms/office.js:31` «CHISME: LAS PAREDES OYEN. YO SOY UNA PARED CON CAFÉ.» | «CHISME: LA PLANTA DEL VESTÍBULO GRABA. YO TAMBIÉN. CON ESPUMA.» |
| `rooms/office.js:60` «BUENAS NOCHES, VACANTE.» | «¿OTRA VEZ, VACANTE? UN MOMENTO. ME PONGO DE PERFIL.» (M1) |
| `rooms/office.js:37` «E-50: ESTOY EN UNA REUNIÓN.» | «E-50: ESTOY EN UNA REUNIÓN. CON EL MICROONDAS. NO NOS HABLAMOS.» |
| `rooms/office.js:262` «NO ACEPTO TARJETAS. NI SOBORNOS. SOLO MODALES.» | «TARJETA: NO. SOBORNO: NO. «BUENAS NOCHES»: SÍ. ES FÁCIL. NADIE LO HACE.» |
| `rooms/office.js:264` «EL AZÚCAR LO PONGO YO. CUANDO TE LO MERECES.» | «EL AZÚCAR LO PONGO YO. A TI, DE MOMENTO, SACARINA.» |

### Don Evaristo
- **Sintaxis:** **«Una cosita»** al empezar, **«Era solo eso»** al acabar, y en medio una cifra exacta que nadie pidió.
- **Vocabulario:** coma, cláusula, salvedad, nóminas, «muy pequeño», «le escribiré un correo».
- **Nunca:** redondear, decir algo importante por teléfono a la primera, una exclamación.

| Original | Nueva |
|---|---|
| `game.js:134` «Lleva una coma que me tiene en vela.» | «Una cosita. Lleva una coma. Tres noches sin dormir por ella. Era solo eso.» |
| `game.js:129` «Lo he cruzado con las nóminas. No cuadra con ninguna.» | «Lo he cruzado con las doscientas doce nóminas. Ninguna come atún.» |
| `rooms/administracion.js:186` «Dos faltas y ninguna coma. Casi es poesía. Mala, pero poesía.» | «Dos faltas, cero comas. Eso no es un acta. Es una respiración.» |
| `rooms/administracion.js:187` «Gracias. ¿Lleva ticket? No lo digo yo. Lo diría Begoña.» | «Gracias. Lo dejo a doce centímetros. Begoña lo querría con ticket.» |
| `rooms/administracion.js:189` «Sin tinta. Ni para una coma. Lo siento por él.» | «Sin tinta. Ni para una coma. Le escribiré un pésame. Muy pequeño.» |
| `rooms/administracion.js:185` ««Asignado a: Titulator 3000». ¿Facturamos a un ticket? Lo apunto.» | ««Asignado a: Titulator 3000». Lo he buscado en nóminas. Cobra en atún.» |

### Custodia
- **Sintaxis:** **preguntas que acaban en punto** («¿Qué quiere.»), frases de una o dos palabras y «Siguiente.» como
  portazo.
- **Vocabulario:** material, merecer, motivo, el libro, siguiente.
- **Nunca:** una exclamación, enseñar la cara, dar algo sin quitarlo después.

| Original | Nueva |
|---|---|
| `rooms/pecera.secretaria.js:121` «Debajo de una chaqueta. Como siempre.» | (nodo eliminado) Si se conserva: «Debajo de una chaqueta. Siguiente.» |
| `rooms/pecera.secretaria.js:128` «No me preguntó nadie.» | «Nadie preguntó. Yo no contesto lo que no se pregunta. Siguiente.» |
| `rooms/pecera.secretaria.js:106` «Para que sepa lo que se siente.» | «Para que conste que una vez tuvo boli. Ya consta. Siguiente.» |
| `rooms/pecera.secretaria.js:40` «Eso, a la cafetera. Conmigo no funciona.» | «Las buenas noches, a la cafetera. A mí tráigame un motivo.» |
| `rooms/pecera.secretaria.js:46` «Porque no hace falta.» | «Porque la cara no es material. Siguiente.» |
| `rooms/pecera.secretaria.js:163` «Está abierta lo justo.» | «Abierta dos dedos. Lo que cabe un boli. Siguiente.» |

### Valentín
- **Sintaxis:** voz baja, medidas de espacio en cada frase (píxeles, márgenes, «a la izquierda»), y una calma que no
  sirve para nada cuando todo arde.
- **Vocabulario:** margen, centrado, interlineado, cuerpo, equidistante, composición.
- **Nunca:** hablar del juego, elogiarse, levantar la vista para una emergencia.

| Original | Nueva |
|---|---|
| `rooms/pecera.dialogos.js:203` «Un segundo, que estoy dirigiendo.» | «Un segundo. Estoy centrando el aviso de «CMS caído». Va torcido.» |
| `rooms/pecera.js:461` «Gracias. Lo coloco donde no estorbe. Eso es casi todo mi trabajo.» | «Gracias. A ocho píxeles del borde. ...Siete. Ya. Respira.» |
| `rooms/pecera.dialogos.js:214` «Lo sé. Lo dicen a dos metros. Yo lo entrego a las 18:29.» | «Lo sé. Lo gritan en mayúsculas. Les he bajado el cuerpo de letra.» |
| `rooms/pecera.dialogos.js:216` «Desde 2017. Está en la bandeja… Para que se viera.» | «Desde 2017. Lo avisé con una flecha. Muy bien alineada. Nadie la vio.» |
| `rooms/pecera.dialogos.js:222` «Me visto como entrego: a tiempo y sin adornos de más.» | (opción eliminada) Si se conserva: «No voy bien vestido. Voy bien maquetado. Tarda más.» |
| `rooms/pecera.js:465` ««¡Diseño!». Sí, hola. Está en la bandeja.» | «Margen superior, ocho. Inferior, ocho. El CMS, caído. Pero equidistante.» |

### El coro de Desarrollo
- **Sintaxis:** se pisan; D1 propone, D2 sube el volumen y **D3 solo dice «No.»**. Siempre en ese orden.
- **Vocabulario:** incidencia, ticket, «¡nuestro!», «¡vuestro!».
- **Nunca:** hablar cuando Bruno habla, más de tres veces por visita, más de una vez de Diseño.

| Original | Nueva |
|---|---|
| `rooms/pecera.js:47` «¿Quién ha llamado "botón2" a un botón?…» | «¡Se ha caído el CMS!» / «¡Hay que levantarlo!» / «¿Cómo?» / «...Gritando más alto.» / «No.» |
| `rooms/pecera.js:51` «¿Quién ha tocado mi silla?… ¡Fallo de diseño!» / «¡DISEÑO!» | «¿Quién ha tocado mi silla?» / «Tu silla gira. Gira sola.» / «¡Pues que pare!» / «No.» |
| `rooms/pecera.js:52` «¡Se ha ido todo el mundo!» / «¡Diseño se fue a las seis y media!»… | (con `cms_vivo`) «¡Va el CMS!» / «¿Quién ha sido?» / «Un becario.» / «...Eso no lo apuntes.» / «No.» |
| `rooms/pecera.js:336` «¿De quién es?» / «De Gertrudis.» / «Taza mal diseñada.» / «¡Diseño!» | «¿Café? ¿Para quién?» / BRUNO: «Para el que no grite.» / (dos segundos de silencio total) / «¡NO HAY CAFÉ PARA NADIE!» |
| `rooms/pecera.js:339` «¿Eso quién lo ha diseñado?» / «¡Diseño!» | «¿Eso tiene ticket?» / «¡No tiene ticket!» / «No.» |
| `rooms/pecera.js:338` «No.» (Coger) | D3: «No.» / D1: «Se lo ha dicho él. Ya está.» |

---

## F. Las 40 peores líneas actuales, reescritas (sin «Como…»)

Las 20 primeras son las de la crítica (§3.3), en su orden; las 20 siguientes, nuestras. «Cortar» significa que la línea
sale y no se sustituye; si hace falta sustituir la opción que la provoca, se da la nueva.

| # | Dónde | Hoy | Por qué falla | Nueva |
|---:|---|---|---|---|
| 1 | `rooms/pecera.dialogos.js:220` | «En mi juego, el Titulator ya era un becario.» | Destripa el giro; es el autor hablando. | Cortar la opción. |
| 2 | `rooms/pecera.dialogos.js:209` | «Eres un sprite muy bien resuelto. El remolino, sobre todo.» | Autoelogio meta. | Cortar. La opción pasa a ser el saludo de C.3: «Estoy centrando el aviso de «CMS caído». Va torcido.» |
| 3 | `escenas/final.js:182-186` | «Diseño soy yo…» / «Por fin tengo departamento. Y es el que tenía razón.» | Roba el final a la abuela. | Cortar (epílogo nuevo, D). |
| 4 | `escenas/final.js:215` | «Errores — Asignado a: Diseño (que no fue).» | El mismo chiste en los créditos. | «Errores · Asignado a: el CMS (ticket nº 3, 2017, no prioritario)» |
| 5 | `rooms/pecera.escenas.js:85` y `rooms/pecera.js:47-61` | «CORO: ¡Ha sido Diseño!» ×13 | Gag de turno, no de acción. | Se queda la de 7.2; ambiente reducido a cuatro (C.3). |
| 6 | `rooms/administracion.dialogos.js:104` | «Esto es un puzle, ¿verdad? Lo noto en el aire.» | Guiño sin chiste. | Opción: «¿Y si le pido perdón por escrito?» → BEGOÑA: «El perdón por escrito es una instancia. Se resuelve en marzo.» |
| 7 | `lib/movil.js:16` | «RV: RV: RV: La IA dice que el LCP baja quitando lo más grande!!» | Jerga sin traducir. | BORJA: «RV: RV: RV: La IA dice que la web pesa mucho. Propone quitar la web!!» |
| 8 | `lib/movil.js:14` | «RV: Mejora tus Core Web Vitals en 5 pasos (40 págs.)» | Jerga. | BORJA: «RV: «Cómo leer correos sin abrirlos» (40 págs.). Por si os sirve!!» |
| 9 | `rooms/pecera.js:47` | «¿Quién ha llamado "botón2" a un botón?…» / «No.» | Chiste de gremio en bucle. | «¡Se ha caído el CMS!» / «¡Hay que levantarlo!» / «¿Cómo?» / «...Gritando más alto.» / «No.» |
| 10 | `rooms/office.js:271` | «…un tornillo de la Ferretería Hermanos Tornillo.» | Nombre-chiste sin chiste. | «Dentro hay posos de 2009 y un pósit de Celestino: «NO TOCAR LA VÁLVULA».» |
| 11 | `rooms/cpd.js:231` | «Empujas uno y Paco te abre cuarenta tickets. Uno por armario.» | Bruno en 2.ª persona. | «Empujo uno. Paco carraspea a seis metros y abre cuarenta tickets.» |
| 12 | `rooms/administracion.dialogos.js:190` | «He perdido a un hombre por mirar el reloj. Que está parado.» | No se entiende. | «Evaristo vuelve a su mesa. Le he mirado el reloj y lo ha visto.» |
| 13 | `lib/movil.js:25` | «Son las 20:59. Llevo ocho meses llegando tarde a algo.» | Contradice la hora (18:30). | «Cinco minutos desde el 3 de marzo. Pilar no avisa: retransmite.» |
| 14 | `rooms/pecera.dialogos.js:88` | «Prometo cuidarlo.» | Despedida incoherente. | Opción «¿Y el álbum?» → NEMESIO: «Lo devuelvo yo. Tú, el pósit a Paco. En la mano. Sin doblar.» |
| 15 | `rooms/administracion.dialogos.js:147` | «Lleva RECHAZADO en la frente. Del revés. Lo he leído igual.» | Imagen confusa. | EVARISTO: «Lleva «RECHAZADO» en la frente. Bien centrado. Begoña tiene pulso.» |
| 16 | `rooms/cpd.js:249` | «No. Ya he encerrado a bastante gente hoy. Bueno, a nadie. Pero no.» | Se desmonta sola. | «No. Rubén ya ha tenido bastante puerta para un año.» |
| 17 | `rooms/eventos.js:147` | «Dentro, más lanyards. Y debajo, tazas con logo. Es un ecosistema.» | Remate sin giro. | «Dentro, más lanyards. Debajo, más. Pilar no guarda cajas: las acredita.» |
| 18 | `rooms/eventos.js:128` | «…mañana en la Pecera se nos ven las ojeras de verdad.» | Nombre interno visible. | «Si me lo llevo, mañana en la Redacción se nos ven las ojeras de verdad.» |
| 19 | `rooms/administracion.dialogos.js:105` | «Para usted es lo mismo, pero con multa.» | Relleno con forma de chiste. | Sale con la nº 6. |
| 20 | `rooms/pecera.escenas.js:131`, `rooms/pajarera.js:177`, `rooms/pajarera.js:312` | El rosa explicado tres veces. | Mismo chiste ×3. | Se queda solo el de Íñigo (`pajarera.js:312`). YOLI en 7.2: «¿Pósit rosa? A mí me puso en rosa en 2024. Sigo sin saber si es bueno.» Pósits: «Cuatro colores. El azul se acaba antes. Íñigo trae recambio.» |
| 21 | `game.js:19` | «Cerrado. Como el plazo. Como el cierre. Como mi futuro.» | Triple «Como». | «Cerrado. Llamo con los nudillos. Desde dentro: «Lo hablamos».» |
| 22 | `game.js:16` | «No funciona. Como casi todo lo que se enchufa en esta planta.» | Fórmula. | «No funciona. Le busco el enchufe. Tiene cinta: «NO».» |
| 23 | `game.js:21` | «Lo empujo. No se mueve. Como un correo pidiendo aumento de sueldo.» | Fórmula. | «Lo empujo. No se mueve. Lo apunto: «inamovible». Ya llevo once.» |
| 24 | `game.js:22` | «Tiro. Se resiste. Como Teodoro a la web.» | Fórmula. | «Tiro. Tira él. Empate. Celestino lo narraría mejor.» |
| 25 | `game.js:20` | «Prefiero dejarlo abierto. Como mi contrato.» | No se entiende (un contrato abierto no es malo). | «Lo dejo abierto. Alguien lo cerrará y me pondrá en copia.» |
| 26 | `duelo.js:29` | «Ya. Como lo del trimestre pasado.» | La misma para los cuatro rivales. | Por rival · MARIPAZ: «Mírame la factura, cariño. Ya te digo yo el total.» · TEODORO: «MIRA RÁPIDO. TE QUEDAN TREINTA Y OCHO CARACTERES.» · GERVASIO: «Mirarlo, se mira. Decirlo, ya se verá.» · ÍÑIGO: «Eso, en mi matriz, es azul. Excusas.» |
| 27 | `rooms/vestibulo.js:33` | «Cierre plano. Empate a cero. Como la vida.» | Fórmula en la mejor voz del juego. | «¡Cierre plano! ¡Empate a cero! ¡Y el público, a casa sin un gol!» |
| 28 | `items.js:314` | «No escribe. Pero lo intenta. Como yo.» | Fórmula. | «No escribe. Le dejo la ficha delante, por si se anima.» |
| 29 | `rooms/pecera.js:209` | «Más enchufado no se puede. Como el sobrino de alguien.» | Fórmula. | «Más enchufado, imposible. Tiene cinta, letrero y a Nemesio mirando.» |
| 30 | `rooms/pecera.js:146` | «El ascensor. Lo rediseñó Valentín. No se nota nada…» | Nombra a Valentín antes de conocerlo. | «El ascensor. Moqueta nueva y botones de 1987. Han cambiado lo que se ve.» |
| 31 | `rooms/pecera.js:32` | «Teodoro vive en la Catacumba…» | Nombre interno visible. | «Teodoro vive en la Redacción de papel. Empadronado. Lo dice el wifi.» |
| 32 | `rooms/cpd.js:131` | Opción «¿Sabes algo del fax de la Catacumba?» | Nombre interno en una opción. | «¿Sabes algo del fax de la Redacción de papel?» (y `walk-data.mjs`, paso 25) |
| 33 | `rooms/pajarera.js:164` | «…Más allá, la Pecera. Con peces.» | Nombre interno y remate flojo. | «Tras el cristal, el vestíbulo de la planta. Y la Redacción, en su acuario.» |
| 34 | `rooms/administracion.js:56` | «El pasillo, de vuelta al Ecosistema…» | Nombre interno visible. | «El pasillo, de vuelta a Marketing. Al fondo, la impresora. Y un gong.» |
| 35 | `rooms/cpd.js:287` | «Si me lo llevo, el CPD se pone a sudar. Y Paco con él.» | Nombre interno visible. | «Si me lo llevo, Sistemas suda. Y Paco abre un ticket por sudor.» |
| 36 | `rooms/ecosistema.js:76` | «Muy bonito. Cero euros.» | Relleno (la crítica). | MARIPAZ: «Precioso. Te lo compro. Cero euros. IVA incluido.» |
| 37 | `rooms/pajarera.js:229` | «Ya está cerrada. Por dentro. Como las buenas ideas.» | Fórmula. | «Ya está cerrada. Por dentro. Con cuña. Alguien no quiere salir.» |
| 38 | `rooms/pecera.js:156` | «Una escalera no se empuja. Se sube. Como el IPC.» | Fórmula. | «Empujo la escalera. Sigue subiendo. Aquí las escaleras no negocian.» |
| 39 | `rooms/administracion.js:131` | «Si la abre, se pierde la página. Y la página es lo de menos: la coma.» | Fallida (la crítica). | EVARISTO: «No la abra. Voy por la página 212. Y en la 212 duerme una coma.» |
| 40 | `rooms/eventos.js:235` | «Antes miro de quién es. Aquí todo tiene dueño. Y acreditación.» | Fallida (la crítica). | «Antes miro quién se sienta. Hay alguien. Con zapatos de Mercados.» (M4) |

---

## G. Lo que no tocaríamos

1. **La intro entera** (`rooms/vestibulo.js:50-91`): la llamada, «Eso es una bebida, hijo», «Lo he dicho en el grupo del pueblo. Abrígate.» y «Pues no te ha visto ni el torno».
2. **El torno y la VACANTE** (`rooms/vestibulo.js:189-242`), con sus negativas que guían.
3. **Las copias rechazadas como papel de fax** y el fax de F.P. (`rooms/catacumba.js:430-441`).
4. **El recorte del 26 %** como mecanismo y como cartel. M5 solo añade un camino para llegar a él.
5. **La revelación de Rubén** (`rooms/cpd.js:25-78`). La crítica pide un plano más grande; el texto no se toca.
6. **Los titulares reactivos del Titulator** (`rooms/pajarera.js:19-30`) y la súplica del armario 27.
7. **El árbol de la nota de gasto de Begoña** (`rooms/administracion.dialogos.js:54-135`): es el patrón de la casa (la opción planta, la respuesta remata).
8. **Teodoro solo por fax**, su duelo y el remate de la respuesta automática (`rooms/catacumba.js:319-374`).
9. **Las 14 parejas del duelo** y sus réplicas (`duelo.js:8-24`), y el comodín del móvil.
10. **Evaristo**: las cinco llamadas con su progresión, el «no se puede colgar a Evaristo» y el héroe de la coma.
11. **«¿Tú eres el nuevo?»** en todas sus apariciones, y «Lo hablamos» de Gervasio (solo se reduce donde lo dicen otros).
12. **Gertrudis**: los E-nn, el «E-27: AYÚDAME. NO ES UN ERROR.» del Acto III y el «E-00» de los créditos.
13. **El clímax**: «Siguiente.», la 247, el empujón, el ¡PLOF!, «¿Y quién ha validado la fase 1?», «Diecinueve años y nadie lo había preguntado», la diapositiva 248 y «Goyita. Tira.». M6 solo inserta dos líneas de tele y una de Gervasio.
14. **La llamada final de la abuela** palabra por palabra, y la **fe de erratas** palabra por palabra.
15. **El arte**: las diez salas y su paleta. Lo nuevo de este documento son estados pequeños (piloto, taza, cinta, zapatos) e insertos con la técnica que ya existe.
16. **Las 45 respuestas por defecto**, salvo las cinco con «Como» que se reescriben en F (nº 21-25).
17. **Las plazas de garaje como fondo** y el ficus con micrófono: funcionan porque nadie las explica.

---

*Comprobaciones hechas sobre este documento:* todas las líneas habladas nuevas de B, C, D y E miden ≤ 80 caracteres
(script sobre los bloques de diálogo y las columnas «Nueva»); ninguna línea nueva usa el remate «Como…»; ninguna línea
nueva menciona en la misma escena a Diseño y Producto y a Infografía; los únicos nombres de sala visibles en líneas
nuevas son los diez oficiales.
