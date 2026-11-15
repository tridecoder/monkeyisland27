# FE DE ERRATAS — ENMIENDA E5 · parte de GUION (coletillas, muletillas, coro, Mercados, líneas nuevas)

> Responde a la crítica 4 (`docs/informes/critica4/CRITICA_JUEGO_4.md`): problema 1 (§4.5, «el chiste tiene una sola
> forma»), cambios prioritarios n.º 3, 8 y 9, fallos F5, F6 y F7, y §9.12 (Mercados). Va en paralelo con la parte de
> puzles y estructura de otro diseñador; un tercero confrontará las dos. **Esta parte no toca**: los textos de E4
> (Audiencias, Discover, titulador, `pecera.titulador*.js`, `pecera.titulares.datos.js` y las líneas nuevas de E4 en
> `pecera.dialogos.js` / `pecera.escenas.js` / `pecera.js`, que doy por hechas), Eventos y Pilar (`eventos.js`,
> `eventos.dialogos.js`), la cadena final (`escenas/final.js` entero), flags, ids, soluciones, mazos, ataques, réplicas
> ni remates de duelo.
>
> **Cómo leer las tablas.** Manda el **texto literal**, no el número de línea: el programador de E4 está editando
> `content/` ahora mismo (`catacumba.js` ha crecido 26 líneas mientras escribía esto). Todas las cadenas «actuales» se
> han comprobado por script contra el árbol de hoy (`tools/verifica.mjs`, abajo): **todas existen**. Todas las «nuevas»
> pasan ≤ 80 caracteres, sin remate «Como…», sin ninguna de las fórmulas con tope (lo único, «no se X. Se Y.», primera
> vez, Mi primer/a, «No es X. Es Y.», desde [fecha], factur…, Emoji de fuego), sin «criatura», «chaval» ni «cariño»
> nuevos y **sin volver a caer en la coletilla** (la regex de §1 aplicada a cada texto nuevo y a todo el banco de §6).
> Tres textos nuevos conservan una fórmula que **ya estaba** en la línea actual (C18 «no se cogen. Se heredan», C45 y
> C57 «Mi primer/a»): no suman al tope.
>
> **La lección de la semana, aplicada.** El dueño premia lo natural, serio y de un solo golpe. Por eso la herramienta
> principal de esta poda es la más humilde: **quitar el apéndice y dejar la frase** (74 de 115). Casi siempre la frase
> ya era el chiste y la coletilla era el guionista asomando la cabeza para explicarlo. Donde quitar dejaba la línea
> coja, se ha usado otra forma (detalle, voz propia, acción, silencio, interrupción, reacción de un tercero, la línea
> que no termina, contestar a otra cosa). No hay parientes inventados, ni dos chistes apilados, ni coletilla nueva tras
> un remate. Tres veces la mejora es **quitar la línea entera** para que el golpe anterior respire (C88 tras «...Lo ha
> escrito bien.», C68, C101).

Material de trabajo (scripts reproducibles, fuera del repositorio), en
`/tmp/claude-0/-home-user/9ff6df9a-ef7e-5fcd-8c2a-38c4f58ddcea/scratchpad/e5/tools/`: `extract.mjs` (cadenas con
fichero, línea y hablante heurístico), `coletillas.mjs` (inventario), `tabla.mjs` (todas las entradas de este documento
como datos), `banco.mjs` (§6), `verifica.mjs` (literales, longitudes, fórmulas, recuentos antes/después y saldo),
`cuenta-pr.mjs` (la regex de §7 con el tokenizador real de `tools/plan-rules.mjs`) e `inventario-md.mjs`.

## Índice

- §1 Inventario de la coletilla y su regex
- §2 Tabla de reescrituras (113 entradas, 115 cadenas)
- §3 Muletillas y repeticiones (criatura, chaval, RECHAZADO, F5, F6, F7, «…Y ahorrar.»)
- §4 El coro de Desarrollo con arco
- §5 Mercados con nombre y rasgo
- §6 Megafonía de Celestino tras el clímax y banco de líneas
- §7 Topes nuevos con su regex (para `tools/plan-rules.mjs`)
- §8 Saldo de líneas
- §9 Pruebas que citan textos que cambian

---

## §1 · Inventario de la coletilla

### 1.1 Qué es y qué no es

La coletilla es **una frase completa seguida de un apéndice que gira**: «Con coma.», «Y ahorrar.», «Sin excepciones.»,
«Ni contrato.». El apéndice empieza por un conector (**Y / Con / Sin / Ni**, con mayúscula: abre frase), tiene de una a
tres palabras detrás del conector y cierra la cadena. No es coletilla:

- una **pregunta** («¿Y qué come?», «¿Con táper?»): es diálogo, no remate; se excluye todo lo que acaba en «?»;
- una frase que **no termina** («Con mi cláusula...», «Y yo...»): es otra forma (la usa esta enmienda a propósito);
- un apéndice largo («Y va en mangas de camisa.», 4 palabras tras el conector): ya no es tic, es frase.

Sí cuenta la **coletilla suelta**: una cadena entera de «conector + 1-3 palabras» que va detrás de otra cadena del mismo
globo («Y esperanza.», «Con jota.», «...Y ahorrar.»).

### 1.2 La regex (una sola, para `plan-rules.mjs`)

```js
// ENMIENDA E5 §1 · coletilla: la última frase de la cadena (o la cadena entera) es «Y|Con|Sin|Ni + 1-3 palabras»,
// cerrada con punto o exclamación; las preguntas y las frases que no terminan («...») no cuentan.
export const COLETILLA_RE =
  /(?:[.!?…][»"”)]?\s+|^)(?:\.\.\.|…)?¡?(?:Y|Con|Sin|Ni)\s+[^\s.!?…¿]+(?:\s+[^\s.!?…¿]+){0,2}(?:\.|!+)[»"”)]?\s*$/u;
```

Probada con el tokenizador y el filtro reales del auditor (`literales()`, `sinSoloPantalla()`, `esTexto()` de
`tools/plan-rules.mjs`, sobre `content/` sin `art/`, `flags.js` ni plantilla): **174 cadenas, 160 sin Eventos**, las
mismas que da mi extractor. Leídas una a una: ningún falso positivo que no sea el molde (los modismos «Ni hablar.» y
«Ni loco.» entran y se tratan como lo que son), y ningún falso negativo del molde salvo los que la definición deja fuera
a propósito (preguntas, «...», apéndices de 4+ palabras).

### 1.3 Recuentos

| Medida | Crítica 4 | **Hoy** (mi regex) | **Tras E5** | Nota |
|---|---:|---:|---:|---|
| Coletilla «Y/Con/Sin/Ni» (todo `content/`) | ≈ 210 | **174** | **54** | la crítica contaba también preguntas («¿Y qué…?») y apéndices largos |
| — sin Eventos (lo que cuenta para el tope) | ≈ 199 | **160** | **40** | Eventos (14) no se toca |
| — por conector, hoy | Y 129 · Con 62 · Sin 22 | Y 80 · Con 54 · Sin 17 · Ni 23 | | |
| Remate seco de 1-3 palabras, cualquier palabra (informativo) | 670 (19 %) | 889 (25,0 %) | 836 (23,5 %) | mi regex es más ancha que la suya; no se le pone tope (§7) |
| Bruno (cadenas atribuidas) | «casi todo» | 61 de 1.159 (Mirar/Usar) + 8 opciones | **8** | la coletilla deja de ser la firma de Bruno |

Por hablante, hoy (atribución heurística por contexto de llamada; los porcentajes, sobre sus cadenas): Bruno 61 + 8
opciones; abuela/pistas 13 (13 %); Íñigo 8 (11 %); Begoña 7 (11 %); Pilar 7 (Eventos); Anselmo 4; Celestino, Aurora,
Rubén, Paco, Maripaz, Gervasio, Teodoro 2-3 cada uno; murmullos y objetos, el resto.

### 1.4 Clasificación y criterio

| Clase (de las 160 sin Eventos) | Se quedan | Criterio |
|---|---:|---|
| **Rasgo de UN personaje** | 16 | La coletilla puede ser de una voz, no de todas. **Maripaz**: es su letra pequeña («Con IVA.», «Con banner.», «Y un anuncio.», «Con pop-up de bienvenida.», «Con banners.», «Y tú has cabido.»: 6). **Begoña**: su cláusula («Sin excepciones.» ×2, «Ni una línea más. Ni un céntimo menos.», «Y no desgrava.»: 4). **Teodoro**: el telegrama («Y SOBRA.», «Y LA GOYITA TIRA.»). **Gervasio**: «Y no consto.» y «Ni uno.» (en una sola sala; más su copia muerta en `actors.js`). **Íñigo**: el trío de diapositiva («Sin CMS. Sin silla. Sin convenio.»). El resto del reparto **pierde** las suyas, y **Bruno pasa de 69 a 8**. |
| **Callback o siembra ganada** | 11 | La grabación del Lector Medio (constante de Despachos y la del suelo del clímax) y «...Y ahorrar.» del clímax; «Con coma.» de la factura (la segunda cae, C84); «...Ramírez. Ha vuelto. Y asiente.» (la crítica la cita); «Con número.» de Anselmo (ahora sembrado por C93); «Con su muerto.» de Custodia (boli muerto); las dos de la llamada L1 («Con dos eles.», «Con jota.»), que siembran «Con jota y dos eles» del final; la del cuadro de plazas, que siembra «QUE NADIE ME DESEE NADA»; el ★ de la abuela «un empujoncito. Con educación.». |
| **Intocables** | 10 | Final (3), E4 (3: «Con expertos.», «Con chinchetas.» y la de Yoli en el monitor, cuyo handler ha reabierto E4), remate del D3 (1), opción-solución del boli (1), y dos pistas de situaciones que rehace el diseñador (estampida, armario 27). |
| **Modismo o forma impuesta** | 3 | «Ni hablar.» (derrota del D4), «Con ticket.» (contesta a «¿Con táper?»), «Con el navegador. Con los lectores. Con la lluvia.» (contesta a «¿Con quién…?»). |
| **Se reescriben** | **120** | Bruno 61; la abuela y las pistas 11; el resto (Rubén, Paco, Íñigo, Aurora, Anselmo, Begoña, Celestino, Gervasio, Leoncio, Evaristo, Yoli, el Lector Medio en sus murmullos, la rejilla y el ascensor) 48. |

Total que se queda: 54 (40 sin Eventos, más las 14 de Eventos). Total que cambia: **120 cadenas de coletilla** (las 115
cadenas de §2 más las que caen de paso en §3: la grabación en los murmullos y los «Diecinueve años» duplicados).

### 1.5 Inventario completo (fichero:línea, quién, texto literal, decisión)

Números de línea: foto de hoy, mientras E4 se implementa; manda el texto. «Decisión» remite al id de §2/§3 o dice por
qué se queda.

| # | Fichero:línea | Quién | Texto literal | Decisión |
|---|---|---|---|---|
| 1 | `actors.js:257` | Yoli (murmullo) | Ahí al lado imprimen lo que yo publiqué ayer. Con las faltas corregidas. | **C99** QUITA |
| 2 | `actors.js:286` | Aurora (murmullo) | Por esa puerta entra la web. No se limpia los pies. Ni las tildes. | **C100** QUITA |
| 3 | `actors.js:295` | Gervasio (murmullo) | Diecinueve años. Ni un marrón. Ni uno. | se queda: en la Sala, y solo allí (M26/M28 la quitan del Vending y los Despachos); voz de Gervasio |
| 4 | `actors.js:477` | Lector Medio | A mí lo que me interesa es la economía. Y ahorrar. | **M22** ACC |
| 5 | `duelo.js:38` | Maripaz (duelo) | Lo llevaba. Ahora lo llevas tú. Con IVA. | se queda: letra pequeña: la coletilla es el rasgo de Maripaz |
| 6 | `duelo.js:44` | Teodoro (duelo) | MÁS SANO QUE LA GOYITA. Y LA GOYITA TIRA. | se queda: telegrama de Teodoro |
| 7 | `escenas/climax.js:97` | Bruno (derrota D4) | Ni hablar. | se queda: modismo, no remate |
| 8 | `escenas/climax.js:210` | Lector Medio | A mí lo que me interesa es la economía. Y ahorrar. | se queda: callback que paga en el clímax; ver M22-M25 (se oye entera solo en los Despachos) |
| 9 | `escenas/climax.js:243` | Begoña | Factura de Optimal Brains. Cuarenta y ocho euros. Con coma. | se queda: la paga de la coma (la segunda «Con coma» cae: C84) |
| 10 | `escenas/climax.js:250` | Begoña | Con lo que nos deben hay para un contrato. Con coma. | **C84** QUITA |
| 11 | `escenas/climax.js:252` | Begoña | Con ticket. | se queda: intercambio con Rubén («¿Con táper?») |
| 12 | `escenas/climax.js:348` | Lector Medio | ...Y ahorrar. | se queda: la paga del clímax |
| 13 | `escenas/final.js:108` | Íñigo | Eso dije yo. Con esas palabras. | se queda: final intocable (y bueno) |
| 14 | `escenas/final.js:176` | Bruno | Su chaqueta está en la Sala Amazonas. En el suelo. Con el Lector Medio. | se queda: final intocable |
| 15 | `escenas/final.js:187` | Celestino | Ni bici. | se queda: final intocable |
| 16 | `game.js:24` | Bruno (por defecto) | Mejor no. Todo lo que tiene cable acaba en Sistemas. Y yo detrás. | **C69** QUITA |
| 17 | `game.js:27` | Bruno (combinar 10 veces) | ¿Estás probando todo con todo? Así trabajan en Administración. Y no funciona. | **C70** QUITA |
| 18 | `game.js:122` | Bruno (llamada L1) | Es Pellejo. Con dos eles. | se queda: siembra «Con jota y dos eles» del final |
| 19 | `game.js:124` | Bruno (llamada L1) | Con jota. | se queda: siembra «Con jota y dos eles» del final |
| 20 | `items.js:237` | Bruno | Y esperanza. | **C68** ELIM |
| 21 | `items.js:265` | Bruno | Y ${n} correos de Tadeo. Todos «RV:». Ninguno leído. Ni por él. | **C64** QUITA |
| 22 | `items.js:288` | Bruno | Me la quito. Vuelvo a ser yo. Con mangas de camisa. | **C65** QUITA |
| 23 | `items.js:365` | Bruno | La cláusula 12, subrayada dos veces. Con regla. | **C66** QUITA |
| 24 | `items.js:369` | Bruno | Lo guardo. Evaristo dijo «en el momento oportuno». Y no es este. | **C67** PIS |
| 25 | `items.js:370` | Bruno | Lo guardo. Evaristo dijo «en el momento oportuno». Y no es este. | **C67** PIS |
| 26 | `lib/ascensor.js:40` | ascensor | Le recordamos que lo que se dice en el ascensor no sale. Ni el wifi. | **C101** ELIM |
| 27 | `pistas.js:22` | Bruno (Mirar a Bruno) | Arriba no me atiende nadie mientras el CMS no vaya. Y no va. | **C71** QUITA |
| 28 | `pistas.js:40` | abuela / pista | Pega tu cara donde salen los jefes. Con algo que pegue. | **C102** OTRA |
| 29 | `pistas.js:40` | abuela / pista | Chicle, tarjeta, organigrama. Y luego el torno. | **C103** QUITA |
| 30 | `pistas.js:55` | abuela / pista | «Buenas noches, Gertrudis». Y lo que pida. | **C104** QUITA |
| 31 | `pistas.js:76` | abuela / pista | Presenta una cuenta mal hecha. Con lo que lleves. | **C105** QUITA |
| 32 | `pistas.js:76` | abuela / pista | Nota de gasto a Begoña. Con el azúcar. | **C106** QUITA |
| 33 | `pistas.js:81` | abuela / pista | Escúchale entero. Sin mirar el reloj. | **C107** VOZ |
| 34 | `pistas.js:83` | abuela / pista | Las máquinas viejas, sin papel, no hablan. Dales papel. Y tú cena. | **C108** OTRA |
| 35 | `pistas.js:98` | abuela / pista | Contéstale mejor que él. Y luego, su máquina. | **C109** QUITA |
| 36 | `pistas.js:103` | abuela / pista | Escribe en tu máquina, hijo. Sin palabras raras. | **C110** VOZ |
| 37 | `pistas.js:109` | abuela / pista | Hasta la maquinita de los dibujos sabe cuánto te sobra, hijo. Y es lista. | **C111** QUITA |
| 38 | `pistas.js:117` | abuela / pista | Tira del papel que sale del armario. Con cuidado. | se queda: armario 27: lo rehace el diseñador |
| 39 | `pistas.js:132` | abuela / pista | A los que hablan mucho se les contesta corto. Y con papeles. | **C112** QUITA |
| 40 | `pistas.js:137` | abuela / pista | A los que nunca dicen nada, hijo, un empujoncito. Con educación. | se queda: ★ de la biblia (abuela) |
| 41 | `pistas.js:158` | abuela (réplica) | Al que manda en los Despachos, mírale el ordenador. Sin que te vea. | **C113** QUITA |
| 42 | `rooms/administracion.dialogos.js:16` | Begoña | Toda pieza sufre el recorte estándar del 26 %. Sin excepciones. | se queda: voz de Begoña (cláusula) |
| 43 | `rooms/administracion.dialogos.js:24` | Begoña | Ni una línea más. Ni un céntimo menos. | se queda: voz de Begoña (cierre del recorte) |
| 44 | `rooms/administracion.dialogos.js:48` | Begoña | El 26 %. Por abajo. Sin excepciones. | se queda: voz de Begoña; carcajada 9 de la crítica |
| 45 | `rooms/administracion.dialogos.js:87` | Bruno | RECHAZADO, en la frente. Mi primer documento oficial. Con sello. | **C57** QUITA |
| 46 | `rooms/administracion.dialogos.js:90` | Begoña | Eso es autoestima. Y no desgrava. | se queda: voz de Begoña (lo fiscal) |
| 47 | `rooms/administracion.dialogos.js:106` | Begoña | Las fotos mentales solo se aceptan con NIF. Y por triplicado. | **C82** QUITA |
| 48 | `rooms/administracion.dialogos.js:175` | Evaristo | Porque por escrito se pierden matices. Y en persona, comas. | **C83** VOZ |
| 49 | `rooms/administracion.js:60` | Bruno | El pasillo, de vuelta a Marketing. Al fondo, la impresora. Y un gong. | **C53** ACC |
| 50 | `rooms/administracion.js:120` | Bruno | Lleno la del original y la dejo ahí. Begoña la mira con sospecha. Sin ticket. | **C54** QUITA |
| 51 | `rooms/administracion.js:146` | Bruno | Ya está en su sitio. Y bien puesta. | **C55** TER |
| 52 | `rooms/administracion.js:169` | Begoña | «Pellizco». ¿Viene a justificarse? Usted no tiene ticket. Ni foto. | **C81** QUITA |
| 53 | `rooms/administracion.js:187` | Bruno | No le llamo. Está a un metro. Y me lo cogería. | **C56** TER |
| 54 | `rooms/catacumba.js:349` | Bruno (opción) | Ya vuelvo. Con café. | **C39** QUITA |
| 55 | `rooms/catacumba.js:562` | Aurora | Ha perdido usted con dos faltas, criatura. Y en cuerpo 72. | **C87** VOZ |
| 56 | `rooms/catacumba.js:609` | Teodoro (fax) | En mi página no hay erratas, chaval. Ni en los nombres. | **C88** SIL |
| 57 | `rooms/catacumba.js:633` | Bruno | Vuelta a la Redacción web. Al otro lado del latón, el siglo XXI. Con escalas. | **C32** QUITA |
| 58 | `rooms/catacumba.js:650` | Bruno | Si descuelgo una, Teodoro me mide. Con la regla. | **C33** QUITA |
| 59 | `rooms/catacumba.js:671` | Bruno | Un fax beige de 1992. Pantallita: «SIN PAPEL». Y sin ganas. | **C34** QUITA |
| 60 | `rooms/catacumba.js:722` | Bruno | No tengo bigote que comparar. Ni contrato. | **C35** QUITA |
| 61 | `rooms/catacumba.js:742` | Bruno | Toc en los nudillos. El cartel no se toca. Ni se discute. | **C36** QUITA |
| 62 | `rooms/catacumba.js:750` | Bruno | Toc en el lomo. El libro no se mueve. Y yo, tampoco. | **C37** ACC |
| 63 | `rooms/catacumba.js:751` | Aurora | Ese libro, ni tocarlo. Se consulta aquí, de pie. Con las manos limpias. | **C85** VOZ |
| 64 | `rooms/catacumba.js:774` | Aurora | Los demás están vivos. Y son míos. | **C86** VOZ |
| 65 | `rooms/catacumba.js:805` | Bruno | Teodoro señala el fax. Con mucha intención. | **C38** SIL |
| 66 | `rooms/catacumba.js:809` | Teodoro (fax) | Dos líneas. Cabe en un faldón. Y sobra. | se queda: telegrama de Teodoro |
| 67 | `rooms/cpd.js:102` | Rubén | ...Perdón. Gracias. Nadie me había traído nunca nada. Ni la baja. | **C72** QUITA |
| 68 | `rooms/cpd.js:152` | Paco | Ticket nº 1: cerrado. Por el tablero. Sin subir. | **C75** VOZ |
| 69 | `rooms/cpd.js:222` | Rubén | ¿CUARENTA SEGUNDOS? ...Perdón. Yo también soy herramienta. Sin pegatina. | **C73** QUITA |
| 70 | `rooms/cpd.js:280` | rejilla | (Desde el 27) Alguien teclea. Con faltas. | **C79** ACC |
| 71 | `rooms/cpd.js:281` | rejilla | (Desde el 27) Ñiiic, ñiiic. Y alguien mastica. | **C80** ACC |
| 72 | `rooms/cpd.js:332` | Bruno | ...Y alguien teclea dentro. Rápido. Con faltas. | **C40** QUITA |
| 73 | `rooms/cpd.js:348` | Bruno | Le hablo al armario vacío. Contesta el eco. Con faltas. | **C41** QUITA |
| 74 | `rooms/cpd.js:375` | Bruno | Arriba, la Redacción trabaja a ciegas. Y publica. | **C42** QUITA |
| 75 | `rooms/cpd.js:383` | Bruno | Ya está cerrada. Y encendida. Y con brida. | **C43** DET |
| 76 | `rooms/cpd.js:406` | Bruno | Ya está abierto. Por la misma página. Con la esquina doblada. | **C44** QUITA |
| 77 | `rooms/cpd.js:450` | Paco (murmullo) | A las seis y media se va la gente. Los tickets se quedan. Y yo, con ellos. | **C76** CORTA |
| 78 | `rooms/cpd.js:456` | Paco | Ese manual ya es tuyo. Las devoluciones van por ticket. Y tardan. | **C77** VOZ |
| 79 | `rooms/cpd.js:457` | Paco | Quédatelo. Yo ya tengo el recuerdo. Y una foto mental. | **C78** QUITA |
| 80 | `rooms/cpd.js:470` | Rubén | ¿Café? Gracias. Pero lo que necesito es un táper. Y la baja. | **C74** QUITA |
| 81 | `rooms/ecosistema.dialogos.js:71` | Maripaz | ¿Seguro que quieres salir? Era una pregunta. Y un anuncio. | se queda: letra pequeña de Maripaz |
| 82 | `rooms/ecosistema.js:83` | Bruno | Mi primera firma en redes. Sin mi nombre. Con buena luz. | **C45** DET |
| 83 | `rooms/ecosistema.js:120` | Bruno | No. Si lo cojo, publica que me lo llevo. Con buena luz. | **C47** QUITA |
| 84 | `rooms/ecosistema.js:243` | Bruno | Si lo descuelgo, el móvil de Borja lo publica. Con música triste. | **C48** QUITA |
| 85 | `rooms/ecosistema.js:263` | Maripaz | Rojo hasta el 98 %. Nadie lo nota. Ni las ventas. | **C52** QUITA |
| 86 | `rooms/ecosistema.js:326` | Bruno | Le hago una foto. Me la reenvía. Con resumen. | **C49** QUITA |
| 87 | `rooms/ecosistema.js:341` | Bruno | No. Yo quiero una plaza de bici. Y por las buenas. | **C50** QUITA |
| 88 | `rooms/ecosistema.js:399` | Bruno | La planta 2 a las seis y media: moqueta, pufs y nadie. Y un gong, detrás. | **C51** QUITA |
| 89 | `rooms/eventos.dialogos.js:40` | Pilar | Dicen que el edificio lo compró él. Por fax. Con acuse de recibo. | se queda: Eventos (protegido) |
| 90 | `rooms/eventos.dialogos.js:62` | Pilar | ¿El de la cena de Navidad? Está acreditado. Firma aquí. Y aquí. | se queda: Eventos (protegido) |
| 91 | `rooms/eventos.dialogos.js:65` | Pilar | Una vez sujeté un evento entero. Con dos tiras. | se queda: Eventos (protegido) |
| 92 | `rooms/eventos.dialogos.js:80` | Pilar | La puse a cinco minutos el día que entré. Y ahí la dejé. | se queda: Eventos (protegido) |
| 93 | `rooms/eventos.js:41` | Pilar | ¡Flash! Para el álbum. Y para el seguro. | se queda: Eventos (protegido) |
| 94 | `rooms/eventos.js:99` | Pilar | ¡No! Una puerta cerrada es un evento privado. Y no hay presupuesto. | se queda: Eventos (protegido) |
| 95 | `rooms/eventos.js:139` | Bruno | Mejor se lo pido a Pilar. Lo tiene acreditado. Con foto. | se queda: Eventos (protegido) |
| 96 | `rooms/eventos.js:142` | Bruno | Lo abro por la cena de Navidad. Al fondo, el chico pálido. Con táper. | se queda: Eventos (protegido) |
| 97 | `rooms/eventos.js:164` | Bruno | No llego. Los focos solo los toca Pilar. Con escalera acreditada. | se queda: Eventos (protegido) |
| 98 | `rooms/eventos.js:236` | Bruno | Antes miro de quién es. Aquí todo tiene dueño. Y acreditación. | se queda: Eventos (protegido) |
| 99 | `rooms/eventos.js:265` | Pilar | ¡Ni se te ocurra! A las 21:05. Ni un minuto antes. Ni cinco. | se queda: Eventos (protegido) |
| 100 | `rooms/eventos.js:267` | Pilar | ¡Las 21:05! ¡Lo pone el cartel! ¡Y la escaleta! ¡Y mi alma! | se queda: Eventos (protegido) |
| 101 | `rooms/eventos.js:292` | Pilar | Tres en el ascensor. Eso ya es un evento. Sin acreditar. | se queda: Eventos (protegido) |
| 102 | `rooms/eventos.js:296` | Pilar | Una silla de más. Un asistente fantasma. Sin acreditar. | se queda: Eventos (protegido) |
| 103 | `rooms/office.js:170` | Gervasio | Diecinueve años en la casa. Y no consto. | se queda: el «consta» de Gervasio tras E-54 |
| 104 | `rooms/office.js:266` | Bruno | Recalentar un café de Gertrudis delante de ella. Ni loco. | **C60** SIL |
| 105 | `rooms/office.js:268` | Bruno | Si caliento la ficha, se borran las casillas. Y la ilusión. | **C58** QUITA |
| 106 | `rooms/office.js:347` | Bruno | Pesa lo que un convenio colectivo. Con sus anexos. | **C59** QUITA |
| 107 | `rooms/office.js:366` | Gervasio (murmullo) | Diecinueve años. Ni un marrón. Ni uno. | **M26** VOZ |
| 108 | `rooms/pajarera.js:16` | Lector Medio | A mí lo que me interesa es la economía. Y ahorrar. | se queda: callback que paga en el clímax; ver M22-M25 (se oye entera solo en los Despachos) |
| 109 | `rooms/pajarera.js:165` | Íñigo | ...Ramírez. Ha vuelto. Y asiente. | se queda: la crítica la cita como acierto |
| 110 | `rooms/pajarera.js:189` | Íñigo | ¿Ve? Él sí sabe estar. Y sin chaqueta. | **C89** QUITA |
| 111 | `rooms/pajarera.js:227` | Bruno (remate D3) | Yo con Hidrovoltia no he comido en mi vida. Ni cenado. | se queda: remate de duelo (solución) |
| 112 | `rooms/pajarera.js:286` | Bruno | No. Íñigo los tiene contados. Por colores. Y por horas. | **C27** QUITA |
| 113 | `rooms/pajarera.js:286` | Íñigo | Eso es propiedad intelectual. Y adhesiva. | **C91** QUITA |
| 114 | `rooms/pajarera.js:353` | Bruno | "Mercados · cinco minutitos · marzo". Sin hora de salida. | **C28** DET |
| 115 | `rooms/pajarera.js:365` | Íñigo | Eso es propiedad intelectual. Y adhesiva. | **C91** QUITA |
| 116 | `rooms/pajarera.js:375` | Bruno | Con la chaqueta de Ramírez parece más medio. Y más de Bolsa. | **C29** QUITA |
| 117 | `rooms/pajarera.js:377` | Bruno | Ficha: "43 años. Le interesa la economía. Y ahorrar". | **C30** DET |
| 118 | `rooms/pajarera.js:386` | Bruno | No. Si se cae, se cae todo. Y todavía no toca. | **C31** PIS |
| 119 | `rooms/pajarera.js:410` | Gervasio (murmullo) | Diecinueve años. Ni un marrón. Ni uno. | **M28** CORTA |
| 120 | `rooms/pajarera.js:426` | Íñigo | Es generativo, autónomo y escalable. Y no pide vacaciones. | **C90** INT |
| 121 | `rooms/pecera.dialogos.js:74` | Yoli (E4) | Y cuando escribas algo, avísame. Te lo coloco en Discover. Con expertos. | se queda: E4: no se toca |
| 122 | `rooms/pecera.dialogos.js:109` | Leoncio | Me los pone desde su pantalla. Sin preguntar. | **C96** QUITA |
| 123 | `rooms/pecera.dialogos.js:159` | Anselmo | ¿Rubén? «Baja becario Rubén». En POR HACER. Con letra de julio. | **C95** QUITA |
| 124 | `rooms/pecera.dialogos.js:182` | Bruno (opción) | ¿Y si le hacemos un funeral? Con flores. Y diapositivas. | **C97** QUITA |
| 125 | `rooms/pecera.dialogos.js:205` | DEV 1 | Con el navegador. Con los lectores. Con la lluvia. | se queda: contesta a «¿Con quién…?»: la forma la pone la pregunta |
| 126 | `rooms/pecera.dialogos.js:270` | Anselmo | Revocado. Con fecha de hoy. Y de julio. | **C94** VOZ |
| 127 | `rooms/pecera.escenas.js:120` | Íñigo | Trescientos titulares esta tarde. Sin CMS. Sin silla. Sin convenio. | se queda: trío de diapositiva: voz de Íñigo |
| 128 | `rooms/pecera.escenas.js:140` | Íñigo | A las nueve, la Reunión de Dirección aprueba el Plan Cero Papel. Sin rotativa. | **C92** QUITA |
| 129 | `rooms/pecera.escenas.js:227` | Anselmo | Si quieres que se quede apagada, tráeme un motivo. Con número. | **C93** OTRA |
| 130 | `rooms/pecera.escenas.js:258` | Anselmo | ...Entonces existe. A HECHO (PERO NO). Con número. | se queda: paga del «¿Tiene número?» (C93) |
| 131 | `rooms/pecera.escenas.js:563` | Bruno (E4) | Lo más leído de la web. Impreso. Con chinchetas. | se queda: E4: no se toca |
| 132 | `rooms/pecera.js:156` | Bruno | Está abierta de par en par. Nadie se atreve a cerrarla. Ni a cruzarla. | **C11** QUITA |
| 133 | `rooms/pecera.js:217` | Bruno | No sé usarla. Ni ella a mí. | **C12** QUITA |
| 134 | `rooms/pecera.js:231` | Yoli | ¡Quieto! Si lo tocas, igual se guarda. Y entonces qué hago. | se queda: handler tocado por E4: no se toca |
| 135 | `rooms/pecera.js:240` | Bruno | Debajo, a rotulador, la excepción de Anselmo. Con número. | **C13** DET |
| 136 | `rooms/pecera.js:250` | Bruno | Enchufar algo más aquí sería pedirle demasiado a esa pantalla. Y a la regleta. | **C14** QUITA |
| 137 | `rooms/pecera.js:317` | Bruno | Abro un documento en blanco. Me mira. Sin fuentes no escribo. | **C15** ACC |
| 138 | `rooms/pecera.js:329` | Bruno | Ya está escrita. Ahora le faltan hueco, fuente y firma. Y papel. | **C16** QUITA |
| 139 | `rooms/pecera.js:341` | Bruno | Si me siento con su chaqueta, la silla sigue siendo suya. Y yo, encima. | **C17** QUITA |
| 140 | `rooms/pecera.js:346` | Bruno | Las sillas no se cogen. Se heredan. Y Ramírez sigue desayunando. | **C18** QUITA |
| 141 | `rooms/pecera.js:348` | Bruno | Si la vuelvo a colgar, la silla vuelve a ser de Ramírez. Y yo, de pie. | **C19** QUITA |
| 142 | `rooms/pecera.js:379` | Bruno | Si la dejo en la frontera, Anselmo la envuelve. Y Ramírez no vuelve. | **C20** QUITA |
| 143 | `rooms/pecera.js:391` | Bruno | "ACCESO REVOCADO: TITULATOR 3000". Con fecha de hoy. Y de julio. | **C21** DET |
| 144 | `rooms/pecera.js:516` | Bruno | Valentín Retícula, de Diseño y Producto. Cascos puestos. Sin música. | **C22** DET |
| 145 | `rooms/pecera.js:527` | Bruno | No. Está trabajando. Si le empujo, se le mueve un píxel. Y lo nota. | **C23** QUITA |
| 146 | `rooms/pecera.js:550` | Bruno | Anselmo, director de Desarrollo. Cinta en el cinto. Y su tablero detrás. | **C24** QUITA |
| 147 | `rooms/pecera.secretaria.js:16` | Custodia | Su abuela que venga. Con su muerto. | se queda: Custodia; siembra el boli muerto |
| 148 | `rooms/pecera.secretaria.js:21` | Bruno (opción) | Para apuntar lo que me digan. Sin grabadora. | se queda: opción-solución del boli |
| 149 | `rooms/pecera.secretaria.js:147` | Bruno | La Secretaría de Redacción. Bajo la persiana, dos manos. Y una llave. | **C25** QUITA |
| 150 | `rooms/pecera.secretaria.js:176` | Bruno | Si me llevo el timbre, Custodia me apunta en el libro. Con tinta azul. | **C26** QUITA |
| 151 | `rooms/sala_amazonas.js:29` | Bruno | «ENTRADA 3»: una videollamada de 2019. Ramírez, congelado. Con cruasán. | **C46** DET |
| 152 | `rooms/sala_amazonas.js:75` | Bruno | No se cogen. Cotizan. Y a la baja. | **C63** QUITA |
| 153 | `rooms/sala_amazonas.js:88` | Maripaz | ¿Llamar yo a Siestatón un viernes? Te lo pongo por escrito. Con banner. | se queda: letra pequeña de Maripaz |
| 154 | `rooms/sala_amazonas.js:99` | Maripaz (duelo) | Si quieres lo vemos en una reunión rápida. Con pop-up de bienvenida. | se queda: letra pequeña de Maripaz (duelo) |
| 155 | `rooms/sala_amazonas.js:116` | Maripaz | ...Teodoro no sella nada que no quepa. Y tú has cabido. | se queda: Maripaz, registro E3 |
| 156 | `rooms/sala_amazonas.js:248` | Bruno | Para tocar el punto 3 hay que decirlo en voz alta. Y a quien preside. | se queda: pista de la estampida: la rehace el diseñador |
| 157 | `rooms/sala_amazonas.js:257` | Bruno | Tiro un milímetro. Maripaz pesa más que el planillo. Y que mi contrato. | **C61** QUITA |
| 158 | `rooms/sala_amazonas.js:279` | Bruno | «ENTRADA 1»: el vestíbulo. Celestino retransmite. Con bufanda. | **C62** QUITA |
| 159 | `rooms/sala_amazonas.js:311` | Gervasio (murmullo) | Diecinueve años. Ni un marrón. Ni uno. | se queda: en la Sala, y solo allí (M26/M28 la quitan del Vending y los Despachos); voz de Gervasio |
| 160 | `rooms/sala_amazonas.js:324` | Gervasio | Yo aquí solo estoy en copia. Con toda la empresa. | **C98** CORTA |
| 161 | `rooms/sala_amazonas.js:346` | Maripaz | Una ficha sin hueco. El hueco lo tengo yo. Debajo. Con banners. | se queda: letra pequeña de Maripaz |
| 162 | `rooms/sala_amazonas.js:353` | Lector Medio | A mí lo que me interesa es la economía. Y ahorrar. | **M24** ACC |
| 163 | `rooms/sala_amazonas.js:361` | Lector Medio | A mí lo que me interesa es la economía. Y ahorrar. | **M24** ACC |
| 164 | `rooms/vestibulo.js:49` | Bruno | Nadie se atreve a pedírsela. Ni a desearle nada. | se queda: siembra «QUE NADIE ME DESEE NADA» del final |
| 165 | `rooms/vestibulo.js:209` | Celestino | Dos maneras: jubilarse o un «accidente». Con comillas. | **C10** ACC |
| 166 | `rooms/vestibulo.js:268` | Bruno | Abajo hay una casilla que pone VACANTE. Sin cara. Con hueco de becario. | **C01** PIS |
| 167 | `rooms/vestibulo.js:274` | Bruno | Si tiro del organigrama, me caen treinta jefes. Y ninguno ayuda. | **C02** QUITA |
| 168 | `rooms/vestibulo.js:331` | Bruno | Si me la llevo, Celestino se queda sin partido. Y yo sin portero. | **C03** QUITA |
| 169 | `rooms/vestibulo.js:359` | Bruno | Desde aquí se ve la moqueta. Algún día la piso. Con contrato. | **C04** QUITA |
| 170 | `rooms/vestibulo.js:415` | Bruno | Si le quito la bufanda, narra. Y nadie quiere eso. | **C05** QUITA |
| 171 | `rooms/vestibulo.js:421` | Bruno | DISEÑO Y PRODUCTO. Y colgando, mi foto. | **C06** DET |
| 172 | `rooms/vestibulo.js:425` | Bruno | Si tiro de la rama, se cae la casilla. Y yo con ella. | **C07** QUITA |
| 173 | `rooms/vestibulo.js:463` | Celestino | Ese chicle ya es tuyo. Aquí no se aceptan devoluciones. Ni en el torno. | **C09** QUITA |
| 174 | `rooms/vestibulo.js:468` | Bruno | A Celestino no se le empuja. Lleva galones. Y bufanda. | **C08** QUITA |

---

## §2 · Tabla de reescrituras

### 2.1 Formas usadas

| Código | Forma | Usos | Ejemplo |
|---|---|---:|---|
| QUITA | Se quita la coletilla y queda la frase (que ya era el chiste) | 74 | «Quédatelo. Yo ya tengo el recuerdo.» (C78) |
| DET | Un detalle concreto que solo ve quien mira, en lugar del apéndice | 9 | «El cable de los cascos no va a nada.» (C22) |
| VOZ | La idea se queda, pero dicha con la sintaxis del que habla (Aurora con punto y coma, Paco con «Estado:», Evaristo enumerando, la abuela cuidando, Custodia preguntando con punto) | 9 | «Ticket nº 1. Estado: cerrado. No he tenido que subir.» (C75) |
| ACC | Acción o sonido en pantalla | 6 | «(Desde el 27) Alguien teclea. Se equivoca. Vuelve atrás.» (C79) |
| PIS | La línea pasa a ayudar | 4 | «Todavía no. Si se cae, se cae todo.» (C31) |
| SIL | Silencio: la línea calla o se queda en un «No.» | 3 | quitar el fax de Teodoro tras «...Lo ha escrito bien.» (C88) |
| OTRA | Contesta a otra cosa o devuelve una pregunta | 3 | «Dales papel. ¿Has cenado?» (C108) |
| TER | Reacción de un tercero | 2 | «No le llamo. Está a un metro.» / Evaristo: «Puede llamarme. Lo cogería.» (C56) |
| CORTA | La línea que no termina | 2 | «Los tickets se quedan. Y yo...» (C76) |
| INT | Interrupción | 1 | «Es generativo, autónomo y escala...» / Bruno: «¿Y qué come?» (C90) |
| ELIM | Se quita la línea entera | 2 | «Y esperanza.» (C68) |

Más formas en §3 (CORTA de Gervasio, ACC del Lector Medio que asiente en vez de hablar, OTRA de Anselmo). **Arranques
vigilados**: ninguna sala gana dos «Toc en…» nuevos ni dos CORTA seguidas; Gervasio se lleva todas las CORTA porque es
su sintaxis (biblia: «se corta antes del verbo»), no un recurso del guionista.

**Por qué tanto QUITA.** Porque es lo que pide la lección de esta semana: la mayoría de estas líneas tenían ya su golpe
antes del punto, y el apéndice lo explicaba o le ponía un segundo golpe encima. Releído cada QUITA con la misma pregunta
que E3 hacía a sus recortes: ¿lo que queda tiene remate? En todos, sí, en la última frase o en la siguiente línea de la
escena (las que dependen de la siguiente lo dicen en la nota). Donde no lo tenía, la forma es otra.

**Prioridades de la crítica, cumplidas.** Sistemas: «Con faltas» ×3 → 0 (C40, C41, C79). Clímax: «Con coma» ×2 → 1
(C84). Bruno: «Con sello.», «Con buena luz.» ×2, «Con mangas de camisa.», «Con regla.», «Con contrato.», «Y yo, encima.»,
«Y yo, de pie.», «Y ninguno ayuda.»… de 69 a 8 coletillas.

### 2.2 Tabla (para implementar)

Ids C01-C113. «Quién» es quien lo dice en pantalla. ELIMINAR = se borra la cadena (si es la única de un verbo, el verbo
cae en `DEFAULTS`; si es un `if` entero, la nota lo dice). Cuando la misma cadena aparece en dos claves, «(×2)».

| # | Fichero | Quién | Texto actual (literal) | Texto nuevo | Forma | Nota |
|---|---|---|---|---|---|---|
| C01 | `rooms/vestibulo.js` | Bruno | Abajo hay una casilla que pone VACANTE. Sin cara. Con hueco de becario. | Abajo hay una casilla que pone VACANTE. Le falta una cara. | PIS |  |
| C02 | `rooms/vestibulo.js` | Bruno | Si tiro del organigrama, me caen treinta jefes. Y ninguno ayuda. | Si tiro del organigrama, me caen treinta jefes. | QUITA |  |
| C03 | `rooms/vestibulo.js` | Bruno | Si me la llevo, Celestino se queda sin partido. Y yo sin portero. | Si me la llevo, Celestino se queda sin partido. | QUITA |  |
| C04 | `rooms/vestibulo.js` | Bruno | Desde aquí se ve la moqueta. Algún día la piso. Con contrato. | Desde aquí se ve la moqueta. Algún día la piso. | QUITA |  |
| C05 | `rooms/vestibulo.js` | Bruno | Si le quito la bufanda, narra. Y nadie quiere eso. | Si le quito la bufanda, narra. | QUITA | el altavoz ya dice «Con la bufanda puesta no narra» |
| C06 | `rooms/vestibulo.js` | Bruno | DISEÑO Y PRODUCTO. Y colgando, mi foto. | DISEÑO Y PRODUCTO. De la rama cuelga mi foto. | DET |  |
| C07 | `rooms/vestibulo.js` | Bruno | Si tiro de la rama, se cae la casilla. Y yo con ella. | Si tiro de la rama, se cae la casilla. | QUITA |  |
| C08 | `rooms/vestibulo.js` | Bruno | A Celestino no se le empuja. Lleva galones. Y bufanda. | A Celestino no se le empuja. Lleva galones. | QUITA |  |
| C09 | `rooms/vestibulo.js` | Celestino | Ese chicle ya es tuyo. Aquí no se aceptan devoluciones. Ni en el torno. | Ese chicle ya es tuyo. Aquí no se aceptan devoluciones. | QUITA |  |
| C10 | `rooms/vestibulo.js` | Celestino | Dos maneras: jubilarse o un «accidente». Con comillas. | Dos maneras: jubilarse o un «accidente». | ACC | las comillas, con los dedos: `api.anim(C, 'reach')` antes del `reply` (pasa a `do`) |
| C11 | `rooms/pecera.js` | Bruno | Está abierta de par en par. Nadie se atreve a cerrarla. Ni a cruzarla. | Está abierta de par en par. Nadie se atreve a cerrarla. | QUITA |  |
| C12 | `rooms/pecera.js` | Bruno | No sé usarla. Ni ella a mí. | No sé usarla. Ella a mí tampoco. | QUITA | mismo chiste, dicho como se habla |
| C13 | `rooms/pecera.js` | Bruno | Debajo, a rotulador, la excepción de Anselmo. Con número. | Debajo, a rotulador, la excepción de Anselmo: «SALVO TICKET Nº 3». | DET | «Con número» se queda solo en Anselmo (paso del enchufe) |
| C14 | `rooms/pecera.js` | Bruno | Enchufar algo más aquí sería pedirle demasiado a esa pantalla. Y a la regleta. | Enchufar algo más aquí sería pedirle demasiado a esa pantalla. | QUITA |  |
| C15 | `rooms/pecera.js` | Bruno | Abro un documento en blanco. Me mira. Sin fuentes no escribo. | Abro un documento en blanco. Me mira. Lo cierro: sin fuentes no hay pieza. | ACC |  |
| C16 | `rooms/pecera.js` | Bruno | Ya está escrita. Ahora le faltan hueco, fuente y firma. Y papel. | Ya está escrita. Ahora le faltan hueco, fuente y firma. | QUITA |  |
| C17 | `rooms/pecera.js` | Bruno | Si me siento con su chaqueta, la silla sigue siendo suya. Y yo, encima. | Si me siento con su chaqueta, la silla sigue siendo suya. | QUITA |  |
| C18 | `rooms/pecera.js` | Bruno | Las sillas no se cogen. Se heredan. Y Ramírez sigue desayunando. | Las sillas no se cogen. Se heredan. | QUITA | vuelve el original de E3; el cruasán ya lo siembra la tele de la Sala (C46) |
| C19 | `rooms/pecera.js` | Bruno | Si la vuelvo a colgar, la silla vuelve a ser de Ramírez. Y yo, de pie. | Si la vuelvo a colgar, la silla vuelve a ser de Ramírez. | QUITA |  |
| C20 | `rooms/pecera.js` | Bruno | Si la dejo en la frontera, Anselmo la envuelve. Y Ramírez no vuelve. | Si la dejo en la frontera, Anselmo la envuelve. | QUITA |  |
| C21 | `rooms/pecera.js` | Bruno | "ACCESO REVOCADO: TITULATOR 3000". Con fecha de hoy. Y de julio. | "ACCESO REVOCADO: TITULATOR 3000". La fecha está corregida a mano. | DET |  |
| C22 | `rooms/pecera.js` | Bruno | Valentín Retícula, de Diseño y Producto. Cascos puestos. Sin música. | Valentín Retícula, de Diseño y Producto. El cable de los cascos no va a nada. | DET | «Diseño» no cambia (sigue 1) |
| C23 | `rooms/pecera.js` | Bruno | No. Está trabajando. Si le empujo, se le mueve un píxel. Y lo nota. | No. Está trabajando. Si le empujo, se le mueve un píxel. | QUITA |  |
| C24 | `rooms/pecera.js` | Bruno | Anselmo, director de Desarrollo. Cinta en el cinto. Y su tablero detrás. | Anselmo, director de Desarrollo. Cinta en el cinto. | QUITA |  |
| C25 | `rooms/pecera.secretaria.js` | Bruno | La Secretaría de Redacción. Bajo la persiana, dos manos. Y una llave. | La Secretaría de Redacción. Bajo la persiana, dos manos. | QUITA |  |
| C26 | `rooms/pecera.secretaria.js` | Bruno | Si me llevo el timbre, Custodia me apunta en el libro. Con tinta azul. | Si me llevo el timbre, Custodia me apunta en el libro. | QUITA |  |
| C27 | `rooms/pajarera.js` | Bruno | No. Íñigo los tiene contados. Por colores. Y por horas. | No. Íñigo los tiene contados. Por colores. | QUITA |  |
| C28 | `rooms/pajarera.js` | Bruno | "Mercados · cinco minutitos · marzo". Sin hora de salida. | "Mercados · cinco minutitos · marzo". La hora de salida, en blanco. | DET |  |
| C29 | `rooms/pajarera.js` | Bruno | Con la chaqueta de Ramírez parece más medio. Y más de Bolsa. | Con la chaqueta de Ramírez parece más medio. | QUITA |  |
| C30 | `rooms/pajarera.js` | Bruno | Ficha: "43 años. Le interesa la economía. Y ahorrar". | Ficha: "43 años. Le interesa la economía". Lo demás, tapado con celo. | DET | guarda «ahorrar» para el clímax (§3, M-AHO) |
| C31 | `rooms/pajarera.js` | Bruno | No. Si se cae, se cae todo. Y todavía no toca. | Todavía no. Si se cae, se cae todo. | PIS | la pista (U31 de E3) se queda; cambia el orden |
| C32 | `rooms/catacumba.js` | Bruno | Vuelta a la Redacción web. Al otro lado del latón, el siglo XXI. Con escalas. | Vuelta a la Redacción web. Al otro lado del latón, el siglo XXI. | QUITA |  |
| C33 | `rooms/catacumba.js` | Bruno | Si descuelgo una, Teodoro me mide. Con la regla. | Si descuelgo una, Teodoro me mide. | QUITA |  |
| C34 | `rooms/catacumba.js` | Bruno | Un fax beige de 1992. Pantallita: «SIN PAPEL». Y sin ganas. | Un fax beige de 1992. Pantallita: «SIN PAPEL». | QUITA |  |
| C35 | `rooms/catacumba.js` | Bruno | No tengo bigote que comparar. Ni contrato. | No tengo bigote que comparar. | QUITA |  |
| C36 | `rooms/catacumba.js` | Bruno | Toc en los nudillos. El cartel no se toca. Ni se discute. | Toc en los nudillos. El cartel no se toca. | QUITA |  |
| C37 | `rooms/catacumba.js` | Bruno | Toc en el lomo. El libro no se mueve. Y yo, tampoco. | Toc en el lomo. Aparto la mano antes que el libro. | ACC |  |
| C38 | `rooms/catacumba.js` | Bruno | Teodoro señala el fax. Con mucha intención. | Teodoro no dice nada. Señala el fax. | SIL |  |
| C39 | `rooms/catacumba.js` | Bruno (opción) | Ya vuelvo. Con café. | Ya vuelvo con café. | QUITA | opción de salida, sin `goto` ni flag: cambia solo el texto |
| C40 | `rooms/cpd.js` | Bruno | ...Y alguien teclea dentro. Rápido. Con faltas. | ...Y alguien teclea dentro. Rápido. | QUITA | «Con faltas» ×3 en Sistemas → 0 |
| C41 | `rooms/cpd.js` | Bruno | Le hablo al armario vacío. Contesta el eco. Con faltas. | Le hablo al armario vacío. Contesta el eco. | QUITA |  |
| C42 | `rooms/cpd.js` | Bruno | Arriba, la Redacción trabaja a ciegas. Y publica. | Arriba, la Redacción trabaja a ciegas. | QUITA |  |
| C43 | `rooms/cpd.js` | Bruno | Ya está cerrada. Y encendida. Y con brida. | Ya está cerrada. Lo pone la brida. | DET |  |
| C44 | `rooms/cpd.js` | Bruno | Ya está abierto. Por la misma página. Con la esquina doblada. | Ya está abierto. Por la misma página. | QUITA |  |
| C45 | `rooms/ecosistema.js` | Bruno | Mi primera firma en redes. Sin mi nombre. Con buena luz. | Mi primera firma en redes. Pone «[NOMBRE]». | DET | «Mi primer/a» no cambia (sigue 1) |
| C46 | `rooms/sala_amazonas.js` | Bruno | «ENTRADA 3»: una videollamada de 2019. Ramírez, congelado. Con cruasán. | «ENTRADA 3»: una videollamada de 2019. Ramírez, congelado a medio cruasán. | DET |  |
| C47 | `rooms/ecosistema.js` | Bruno | No. Si lo cojo, publica que me lo llevo. Con buena luz. | No. Si lo cojo, publica que me lo llevo. | QUITA |  |
| C48 | `rooms/ecosistema.js` | Bruno | Si lo descuelgo, el móvil de Borja lo publica. Con música triste. | Si lo descuelgo, el móvil de Borja lo publica. | QUITA |  |
| C49 | `rooms/ecosistema.js` | Bruno | Le hago una foto. Me la reenvía. Con resumen. | Le hago una foto. Me la reenvía. | QUITA |  |
| C50 | `rooms/ecosistema.js` | Bruno | No. Yo quiero una plaza de bici. Y por las buenas. | No. Yo quiero una plaza de bici. | QUITA |  |
| C51 | `rooms/ecosistema.js` | Bruno | La planta 2 a las seis y media: moqueta, pufs y nadie. Y un gong, detrás. | La planta 2 a las seis y media: moqueta, pufs y nadie. | QUITA | el gong se queda en el pasillo de Administración (C53) |
| C52 | `rooms/ecosistema.js` | Maripaz (mp) | Rojo hasta el 98 %. Nadie lo nota. Ni las ventas. | Rojo hasta el 98 %. Nadie lo nota. | QUITA | el empujar del termómetro ya dice «No las ventas» |
| C53 | `rooms/administracion.js` | Bruno | El pasillo, de vuelta a Marketing. Al fondo, la impresora. Y un gong. | El pasillo, de vuelta a Marketing. Al fondo suena un gong. | ACC | si se quiere, `api.sfx('gong')` (Mirar pasa a función) |
| C54 | `rooms/administracion.js` | Bruno | Lleno la del original y la dejo ahí. Begoña la mira con sospecha. Sin ticket. | Lleno la del original y la dejo ahí. Begoña la mira con sospecha. | QUITA |  |
| C55 | `rooms/administracion.js` | Bruno | Ya está en su sitio. Y bien puesta. | Ya está en su sitio. Evaristo me mira hasta que aparto la mano. | TER |  |
| C56 | `rooms/administracion.js` | Bruno + Evaristo | No le llamo. Está a un metro. Y me lo cogería. | No le llamo. Está a un metro. / [Evaristo] Puede llamarme. Lo cogería. | TER | la segunda, `sayEv`; Evaristo, encantado de que le llamen |
| C57 | `rooms/administracion.dialogos.js` | Bruno | RECHAZADO, en la frente. Mi primer documento oficial. Con sello. | RECHAZADO, en la frente. Mi primer documento oficial. | QUITA | la crítica la cita como la coletilla tipo de Bruno |
| C58 | `rooms/office.js` | Bruno | Si caliento la ficha, se borran las casillas. Y la ilusión. | Si caliento la ficha, se borran las casillas. | QUITA |  |
| C59 | `rooms/office.js` | Bruno | Pesa lo que un convenio colectivo. Con sus anexos. | Pesa lo que un convenio colectivo. | QUITA |  |
| C60 | `rooms/office.js` | Bruno | Recalentar un café de Gertrudis delante de ella. Ni loco. | Recalentar un café de Gertrudis delante de ella. No. | SIL | un «No.» seco; deja «Ni loco» solo para Tadeo (ecosistema) |
| C61 | `rooms/sala_amazonas.js` | Bruno | Tiro un milímetro. Maripaz pesa más que el planillo. Y que mi contrato. | Tiro un milímetro. Maripaz pesa más que el planillo. | QUITA |  |
| C62 | `rooms/sala_amazonas.js` | Bruno | «ENTRADA 1»: el vestíbulo. Celestino retransmite. Con bufanda. | «ENTRADA 1»: el vestíbulo. Celestino retransmite. | QUITA |  |
| C63 | `rooms/sala_amazonas.js` | Bruno | No se cogen. Cotizan. Y a la baja. | No se cogen. Cotizan. | QUITA |  |
| C64 | `items.js` | Bruno | Y ${n} correos de Tadeo. Todos «RV:». Ninguno leído. Ni por él. | Y ${n} correos de Tadeo. Todos «RV:». Ninguno leído. | QUITA | plantilla `${n}`: se cambia en el código, no en una cadena fija |
| C65 | `items.js` | Bruno | Me la quito. Vuelvo a ser yo. Con mangas de camisa. | Me la quito. Vuelvo a ser yo. | QUITA | las «mangas de camisa» se quedan en los Despachos |
| C66 | `items.js` | Bruno | La cláusula 12, subrayada dos veces. Con regla. | La cláusula 12, subrayada dos veces. | QUITA |  |
| C67 | `items.js` | Bruno | Lo guardo. Evaristo dijo «en el momento oportuno». Y no es este. | Lo guardo. Evaristo dijo «en el momento oportuno». Aún no ha llegado. | PIS | dos claves con la misma cadena: se cambian las dos (×2) |
| C68 | `items.js` | Bruno | Y esperanza. | **ELIMINAR** | ELIM | queda «La foto es de cuando tenía 23 años.», que ya duele sola |
| C69 | `game.js` | Bruno (DEFAULTS usar) | Mejor no. Todo lo que tiene cable acaba en Sistemas. Y yo detrás. | Mejor no. Lo que tiene cable acaba en Sistemas, y el que lo toca, también. | QUITA | una frase, sin apéndice |
| C70 | `game.js` | COMBO_GAG | ¿Estás probando todo con todo? Así trabajan en Administración. Y no funciona. | ¿Estás probando todo con todo? Así trabajan en Administración. | QUITA |  |
| C71 | `pistas.js` | Bruno (Mirar a Bruno) | Arriba no me atiende nadie mientras el CMS no vaya. Y no va. | Arriba no me atiende nadie mientras el CMS no vaya. | QUITA |  |
| C72 | `rooms/cpd.js` | Rubén | ...Perdón. Gracias. Nadie me había traído nunca nada. Ni la baja. | ...Perdón. Gracias. Nadie me había traído nunca nada. | QUITA | la siguiente («Lo voy a dejar vacío. Para que dure.») hace el resto |
| C73 | `rooms/cpd.js` | Rubén | ¿CUARENTA SEGUNDOS? ...Perdón. Yo también soy herramienta. Sin pegatina. | ¿CUARENTA SEGUNDOS? ...Perdón. Yo también soy herramienta. | QUITA |  |
| C74 | `rooms/cpd.js` | Rubén | ¿Café? Gracias. Pero lo que necesito es un táper. Y la baja. | ¿Café? Gracias. Pero lo que necesito es un táper. | QUITA | coordinar con el diseñador (cabo suelto del táper) |
| C75 | `rooms/cpd.js` | Paco | Ticket nº 1: cerrado. Por el tablero. Sin subir. | Ticket nº 1. Estado: cerrado. No he tenido que subir. | VOZ |  |
| C76 | `rooms/cpd.js` | Paco (murmullo) | A las seis y media se va la gente. Los tickets se quedan. Y yo, con ellos. | A las seis y media se va la gente. Los tickets se quedan. Y yo... | CORTA |  |
| C77 | `rooms/cpd.js` | Paco | Ese manual ya es tuyo. Las devoluciones van por ticket. Y tardan. | Ese manual ya es tuyo. Las devoluciones van por ticket. Estado: en cola. | VOZ |  |
| C78 | `rooms/cpd.js` | Paco | Quédatelo. Yo ya tengo el recuerdo. Y una foto mental. | Quédatelo. Yo ya tengo el recuerdo. | QUITA | y deja la «foto mental» a Begoña (C82 la quita también: ninguna) |
| C79 | `rooms/cpd.js` | rejilla | (Desde el 27) Alguien teclea. Con faltas. | (Desde el 27) Alguien teclea. Se equivoca. Vuelve atrás. | ACC | zona del armario 27: coordinar con el diseñador |
| C80 | `rooms/cpd.js` | rejilla | (Desde el 27) Ñiiic, ñiiic. Y alguien mastica. | (Desde el 27) Ñiiic, ñiiic. Alguien mastica. | ACC |  |
| C81 | `rooms/administracion.js` | Begoña | «Pellizco». ¿Viene a justificarse? Usted no tiene ticket. Ni foto. | «Pellizco». ¿Viene a justificarse? Usted no tiene ticket. | QUITA |  |
| C82 | `rooms/administracion.dialogos.js` | Begoña | Las fotos mentales solo se aceptan con NIF. Y por triplicado. | Las fotos mentales solo se aceptan con NIF. | QUITA |  |
| C83 | `rooms/administracion.dialogos.js` | Evaristo | Porque por escrito se pierden matices. Y en persona, comas. | Por escrito se pierden matices. En persona, comas. Por teléfono, nada. | VOZ | enumeración con salvedad: y por eso llama |
| C84 | `escenas/climax.js` | Begoña | Con lo que nos deben hay para un contrato. Con coma. | Con lo que nos deben hay para un contrato. | QUITA | «Con coma» ×2 en el clímax → 1 (la de la factura); el «¿Con táper?» / «Con ticket.» sigue funcionando |
| C85 | `rooms/catacumba.js` | Aurora | Ese libro, ni tocarlo. Se consulta aquí, de pie. Con las manos limpias. | Ese libro, ni tocarlo; se consulta aquí, de pie y con las manos limpias. | VOZ | la frase larga es la de Aurora |
| C86 | `rooms/catacumba.js` | Aurora | Los demás están vivos. Y son míos. | Los demás están vivos; por eso no los presto. | VOZ |  |
| C87 | `rooms/catacumba.js` | Aurora | Ha perdido usted con dos faltas, criatura. Y en cuerpo 72. | Ha perdido usted con dos faltas, en cuerpo 72; se ven desde la escalera. | VOZ | también quita un «criatura» (§3) |
| C88 | `rooms/catacumba.js` | Teodoro (fax) | En mi página no hay erratas, chaval. Ni en los nombres. | **ELIMINAR** | SIL | tras «...Lo ha escrito bien.» no habla nadie: `api.wait(1200)`. También quita un «chaval» |
| C89 | `rooms/pajarera.js` | Íñigo | ¿Ve? Él sí sabe estar. Y sin chaqueta. | ¿Ve? Él sí sabe estar. | QUITA |  |
| C90 | `rooms/pajarera.js` | Íñigo | Es generativo, autónomo y escalable. Y no pide vacaciones. | Es generativo, autónomo y escala... | INT | Bruno le corta con su «¿Y qué come?» de siempre |
| C91 | `rooms/pajarera.js` | Íñigo | Eso es propiedad intelectual. Y adhesiva. | Eso es propiedad intelectual. | QUITA | las dos claves (pósits y pósit azul) (×2) |
| C92 | `rooms/pecera.escenas.js` | Íñigo | A las nueve, la Reunión de Dirección aprueba el Plan Cero Papel. Sin rotativa. | A las nueve, la Reunión de Dirección aprueba el Plan Cero Papel. | QUITA | Bruno contesta «¿Sin papel?»: el eco ya es suyo |
| C93 | `rooms/pecera.escenas.js` | Anselmo | Si quieres que se quede apagada, tráeme un motivo. Con número. | Si quieres que se quede apagada, tráeme un motivo. ¿Tiene número? | OTRA | siembra el «¿Tiene número?» del paso del enchufe |
| C94 | `rooms/pecera.dialogos.js` | Anselmo | Revocado. Con fecha de hoy. Y de julio. | Revocado. Fecha: hoy. Efectos: julio. | VOZ |  |
| C95 | `rooms/pecera.dialogos.js` | Anselmo | ¿Rubén? «Baja becario Rubén». En POR HACER. Con letra de julio. | ¿Rubén? «Baja becario Rubén». En POR HACER. Letra de julio. | QUITA | sin «desde julio» (tope 6/6) |
| C96 | `rooms/pecera.dialogos.js` | Leoncio | Me los pone desde su pantalla. Sin preguntar. | Me los pone desde su pantalla. | QUITA |  |
| C97 | `rooms/pecera.dialogos.js` | Bruno (opción) | ¿Y si le hacemos un funeral? Con flores. Y diapositivas. | ¿Y si le hacemos un funeral con diapositivas? | QUITA | opción con `do`, sin flag: solo cambia el texto |
| C98 | `rooms/sala_amazonas.js` | Gervasio | Yo aquí solo estoy en copia. Con toda la empresa. | Yo aquí solo estoy en... en copia. | CORTA |  |
| C99 | `actors.js` | Yoli (murmullo) | Ahí al lado imprimen lo que yo publiqué ayer. Con las faltas corregidas. | Ahí al lado imprimen lo que yo publiqué ayer. | QUITA |  |
| C100 | `actors.js` | Aurora (murmullo) | Por esa puerta entra la web. No se limpia los pies. Ni las tildes. | Por esa puerta entra la web. No se limpia los pies. | QUITA |  |
| C101 | `lib/ascensor.js` | ascensor | Le recordamos que lo que se dice en el ascensor no sale. Ni el wifi. | **ELIMINAR** | ELIM | no gasta el «ni el wifi» de Celestino (carcajada 1 de la crítica) |
| C102 | `pistas.js` | abuela | Pega tu cara donde salen los jefes. Con algo que pegue. | Pega tu cara donde salen los jefes. ¿Tienes algo que pegue? | OTRA |  |
| C103 | `pistas.js` | pista explícita | Chicle, tarjeta, organigrama. Y luego el torno. | Chicle en la tarjeta, tarjeta en el organigrama, y al torno. | QUITA |  |
| C104 | `pistas.js` | pista explícita | «Buenas noches, Gertrudis». Y lo que pida. | Vending: «Buenas noches, Gertrudis», y darle lo que pida. | QUITA |  |
| C105 | `pistas.js` | abuela | Presenta una cuenta mal hecha. Con lo que lleves. | Presenta una cuenta mal hecha. Lo que lleves en el bolsillo te vale. | QUITA |  |
| C106 | `pistas.js` | pista explícita | Nota de gasto a Begoña. Con el azúcar. | Nota de gasto a Begoña, con el azúcar de justificante. | QUITA |  |
| C107 | `pistas.js` | abuela | Escúchale entero. Sin mirar el reloj. | Escúchale entero, hijo, aunque se te enfríe la cena. | VOZ |  |
| C108 | `pistas.js` | abuela | Las máquinas viejas, sin papel, no hablan. Dales papel. Y tú cena. | Las máquinas viejas, sin papel, no hablan. Dales papel. ¿Has cenado? | OTRA |  |
| C109 | `pistas.js` | abuela | Contéstale mejor que él. Y luego, su máquina. | Contéstale mejor que él, y al final, lo de su máquina. | QUITA |  |
| C110 | `pistas.js` | abuela | Escribe en tu máquina, hijo. Sin palabras raras. | Escribe en tu máquina, hijo, que lo entienda tu abuela. | VOZ |  |
| C111 | `pistas.js` | abuela | Hasta la maquinita de los dibujos sabe cuánto te sobra, hijo. Y es lista. | Hasta la maquinita de los dibujos sabe cuánto te sobra, hijo. | QUITA |  |
| C112 | `pistas.js` | abuela | A los que hablan mucho se les contesta corto. Y con papeles. | A los que hablan mucho se les contesta corto. | QUITA | el nivel 2 ya dice qué papeles |
| C113 | `pistas.js` | abuela (dónde está la réplica) | Al que manda en los Despachos, mírale el ordenador. Sin que te vea. | Al que manda en los Despachos, mírale el ordenador. | QUITA |  |

---

## §3 · Muletillas y repeticiones

### 3.1 Resumen

| Muletilla / repetición | Hoy | Tras E5 | Cómo |
|---|---:|---:|---|
| «criatura» (Aurora) | 13 | **6** | M01-M06 y C87. Se quedan las seis donde es cariño y no firma: el café («Gracias, criatura. Este café está mal escrito, pero se entiende.»), la coma de 1989, «Eso no es una pregunta, criatura. Es una sentencia.», «Eso no es entusiasmo, criatura. Es inglés.», «Y con buena letra, criatura.» (inicio del Acto III) y el boli muerto. |
| «chaval» (Teodoro, Celestino y otros) | 22 | **11** | C88, M07-M15, M18. Teodoro 6 → 3 en boca + la nota de la plaza 1 del final (intocable); Celestino 12 → 5 (el torno, el chicle, «La web no tiene pared, chaval.», Rubén saliendo del banquillo y la opción en que Bruno le imita); Paco y el titular de Rubén, uno cada uno. |
| «Llevas RECHAZADO en la frente» | 4 comentarios fuera del sello (+ Pilar) | **1** (+ Pilar) | Se queda el de Evaristo, el mejor («Bien centrado. Begoña tiene pulso.»). Caen Paco (M16), Maripaz (M17) y Celestino (M18). **Pilar** (`eventos.dialogos.js`, sala protegida) sigue diciéndolo: **petición al director**, no a mí: quitar su `frente(api, PILAR)` dejaría el único comentario en Evaristo. Sin esa autorización, quedan dos y en salas distintas. |
| F6 · «fotos del fax. Posando» | 2 seguidas | **1** | Se queda la de Paco al darlo (la dice una persona); el Mirar del manual pierde su segunda cadena (M19). |
| F7 · «El modelo es de fuera. El prompt es de dentro.» | 2 idénticas | **1 + eco** | Se queda en su mejor sitio: la escena de Herminia, con la réplica de Leoncio («El prompt de Herminia lo escribí yo. En esta mesa.»). En el árbol, si Bruno pregunta antes de esa escena, Anselmo **esquiva**: «¿Tú de qué departamento vienes?» (M20). Si pregunta después, ya existe el eco variado («Ya te lo he dicho. El prompt es de dentro. Lo escribí yo. En mayúsculas.»). |
| «No escucho. Oigo» (Paco ★) / «Las paredes no oyen. Oigo yo» (Custodia) | 2 | **1** | Custodia vuelve a su voz: «¿Quién anda ahí.» (M21). |
| «…Y ahorrar.» antes del clímax | 5 sitios | **2, los dos en los Despachos** | Ver 3.2. |
| Murmullos idénticos en varias salas | Gervasio en 3 salas, Íñigo en 2, Lector en 3 | **0 que se oigan** | M26-M33. Ver 3.3. |
| «Diseño» (cadenas) | 5 | 6 | K04 suma una (el arco del coro); tope 11. |

### 3.2 «…Y ahorrar.»: siembra sin quemar la paga

La frase entera es la **única** del Lector Medio y paga dos veces en el clímax: «...Y ahorrar.» tras la llamada de
Evaristo (la paga) y la grabación desde el suelo (el eco). Hoy, además, suena en su murmullo global, en el murmullo de
los Despachos, en el murmullo de la Sala, en Hablar en la Sala, en la opción de Gervasio y en la ficha que lee Bruno. Un
murmullo se repite cada vez que el ratón se para encima: era la fuente principal del desgaste.

- **Se queda entera** donde siembra: la escena de la chaqueta (Despachos, Acto I, una vez, con el «¿Ve? Él sí sabe
  estar.» de Íñigo) y Hablar con el Lector Medio en los Despachos (lo elige el jugador).
- **Asiente en vez de hablar** (`'(asiente)'`, forma ACC: el cartón hace lo único que sabe hacer): los tres murmullos
  (M22, M23, M24) y las dos veces en que Gervasio le consulta («Lo que diga el Lector Medio.» / *(asiente)* / «...Pues
  ya está decidido.», M24 y M25). Mejora el chiste de Gervasio: la decisión la toma un cartón que no dice nada.
- **La ficha** ya no la deletrea: «Ficha: "43 años. Le interesa la economía". Lo demás, tapado con celo.» (C30). El
  jugador ya ha visto el celo («Ya lleva celo»); el segundo interés lo destapa el clímax.
- Tope que sigue valiendo: `lector_medio` «lo que me interesa es la economía» ≤ 6 (oídas). Con esto, 2 antes del clímax
  y 1 en el suelo.

### 3.3 Las 84 duplicadas, una a una por familias

Mi recuento da 85 cadenas de más de 25 caracteres repetidas literalmente (103 apariciones de más). No todas se oyen
dos veces. Por familias:

| Familia | Cadenas | Qué se hace |
|---|---:|---|
| **Murmullos de un personaje que va por varias salas** (se oyen, es el F5) | 9 | Gervasio: en la Sala se quedan «Eso, en todo caso, lo hablamos.» y «Diecinueve años. Ni un marrón. Ni uno.»; en los Despachos, «Hoy me han preguntado tres veces por mi salud…» (siembra su respuesta en el duelo D3) y una nueva; en el Vending, dos nuevas (M26-M29). Íñigo: los tres de siempre se quedan en los Despachos (siembran la 248 y el asentir); en la Sala del Acto III, dos nuevos (M30). Lector Medio: 3.2. |
| **La misma respuesta de un personaje en dos salas** (se oyen) | 6 | Íñigo `dar:cafe` y `dar:tarjeta_becario` en la Sala (M31, M32); Gervasio `dar:*` en el Vending (M33); el quinto «Lo que diga el Lector Medio» pasa a señal del empujón (M34, §6). Las de Maripaz (`usar`, `dar:pieza_opa`, `dar:correo_evaristo`, Sala y Marketing) **se quedan**: son su eje y E3 las dejó repetidas a propósito (M1). |
| **Copias en `actors.js` de murmullos que cada sala redefine** (Yoli, Aurora, Teodoro, Begoña, Paco, Leoncio, Anselmo…) | ≈ 20 | No se oyen dos veces: la sala manda (o pone `murmurs: null` y usa su propia cola, como la Redacción). **Limpieza para P0**, sin efecto audible y fuera del saldo: borrar de `actors.js` el `murmurs` de los actores que tienen `murmurs` propio en **todas** sus salas, tras comprobarlo con `node tools/actors.mjs`. |
| **Ramas de un mismo handler** (ternarios, dos claves que comparten respuesta, la misma línea en el éxito y en el reintento) | ≈ 40 | No se oyen seguidas; se quedan. Ejemplos: «Ni la rozo. En la pantalla ya pone: «ANOTADO».» (Empujar / Tirar a Gertrudis), «Ese teléfono no se toca. Es nuestro.» (Usar / Coger), los dos «Lo guardo. Evaristo dijo…» (C67 los cambia a la vez). |
| **Datos del duelo** (ataques, respuestas por rival, titulares del Titulator que también vuelven en su sitio) | ≈ 10 | Por diseño (mazos); no se tocan. |
| **Eventos** | 4 | Protegido. |
| **Las que ya arregla §2/§3 de paso** | 6 | «fotos del fax», «El modelo es de fuera», «Eso es propiedad intelectual. Y adhesiva.» ×2 (C91), «Llevas RECHAZADO» ×2. |

### 3.4 Tabla (para implementar)

| # | Fichero | Quién | Texto actual (literal) | Texto nuevo | Forma | Nota |
|---|---|---|---|---|---|---|
| M01 | `items.js` | Aurora | Ya lo he leído, criatura. Está perfecto. Guárdalo. | Ya lo he leído. Está perfecto. Guárdalo. | QUITA |  |
| M02 | `rooms/catacumba.js` | Aurora | ¿Evaristo? ¿El de las comas? Siéntate, criatura. Bueno, no hay silla. | ¿Evaristo? ¿El de las comas? Siéntate. Bueno, no hay silla. | QUITA |  |
| M03 | `rooms/catacumba.js` | Aurora | Cuando alguien diga que una coma es un detalle sin importancia, criatura. | Cuando alguien diga que una coma es un detalle sin importancia. | QUITA |  |
| M04 | `rooms/catacumba.js` | Aurora | Llevas un anuncio en la espalda, criatura. En esta planta, no. | Llevas un anuncio en la espalda. En esta planta, no. | QUITA |  |
| M05 | `rooms/catacumba.js` | Aurora | Ya está citada, criatura. Dos veces sería abusar de su confianza. | Ya está citada. Dos veces sería abusar de su confianza. | QUITA |  |
| M06 | `rooms/catacumba.js` | Aurora | Otros seis folios, criatura. Con esto ya se encuaderna. | Otros seis folios. Con esto ya se encuaderna. | QUITA |  |
| M07 | `rooms/catacumba.js` | Teodoro (fax) | ¿Qué quieres, chaval? | ¿Qué quieres? | QUITA |  |
| M08 | `rooms/catacumba.js` | Teodoro (fax) | Chaval. La Reunión de Dirección apaga la rotativa a las nueve. | La Reunión de Dirección apaga la rotativa a las nueve. | QUITA |  |
| M09 | `lib/celestino.js` | Celestino | ¡El chaval viste al Lector Medio! ¡Cambio de camiseta en pleno partido! | ¡Cambio de camiseta en pleno partido! ¡El Lector Medio sale con chaqueta! | QUITA |  |
| M10 | `lib/celestino.js` | Celestino | ¡Tarjeta en Administración! ¡Por triplicado! ¡Y el chaval sigue jugando! | ¡Tarjeta en Administración! ¡Por triplicado! ¡El nuevo sigue en el campo! | QUITA |  |
| M11 | `lib/celestino.js` | Celestino | ¡Y el chaval de Sistemas pide el cambio! ¡Sale a ver el sol! | ¡Y el de Sistemas pide el cambio! ¡Sale a ver el sol! | QUITA |  |
| M12 | `rooms/vestibulo.js` | Celestino (Ibex) | ¡Banco Robledal se duerme en el área! ¡Así no, chaval! | ¡Banco Robledal se duerme en el área! ¡Así no, hombre, así no! | QUITA |  |
| M13 | `rooms/vestibulo.js` | Celestino | ¡Vuelve el chaval al vestíbulo! ¡Sin balón, pero con ganas! | ¡Vuelve al vestíbulo! ¡Sin balón, pero con ganas! | QUITA |  |
| M14 | `rooms/vestibulo.js` | Celestino | ¡Otra vez aquí! ¡Este chaval pisa más área que el portero! | ¡Otra vez aquí! ¡Pisa más área que el portero! | QUITA |  |
| M15 | `rooms/sala_amazonas.js` | Rogelio (Mercados 2) | Se te ha congelado, chaval. | Se te ha congelado. | QUITA |  |
| M16 | `rooms/cpd.js` | Paco | Llevas RECHAZADO en la frente. Es de Administración. Sin ticket no lo quito. | **ELIMINAR** | ELIM | quitar el `if` entero (y su `dicho = true`): el árbol sigue igual |
| M17 | `rooms/ecosistema.dialogos.js` | Maripaz | Llevas RECHAZADO en la frente. | **ELIMINAR** | ELIM | quitar la llamada `frente(api, MARIPAZ)` y la función; la gemela de eventos.dialogos.js (Pilar) es de sala protegida: ver §3.3 |
| M18 | `rooms/vestibulo.js` | Celestino | ¡Y el chaval aparece con tarjeta en la frente! ¡Roja! ¡Directa! | **ELIMINAR** | ELIM | quitar el `if` (marca once `vestibulo_celestino_frente` queda sin uso: no se borra, no estorba) |
| M19 | `items.js` | Bruno (Mirar manual) | Las demás páginas son fotos del fax. Posando. | **ELIMINAR** | ELIM | queda la primera cadena del Mirar |
| M20 | `rooms/pecera.dialogos.js` | Anselmo | El modelo es de fuera. El prompt es de dentro. / Eso lo hace nuestro. | ¿Tú de qué departamento vienes? | OTRA | solo la rama `else` (sin herminia_midio) del árbol; la rama con herminia_midio («Ya te lo he dicho…») ya es el eco |
| M21 | `rooms/pecera.secretaria.js` | Custodia (murmullo) | Las paredes no oyen. Oigo yo. | ¿Quién anda ahí. | VOZ | pregunta que acaba en punto (biblia §2.4) |
| M22 | `actors.js` | Lector Medio (murmullo global) | A mí lo que me interesa es la economía. Y ahorrar. | (asiente) | ACC |  |
| M23 | `rooms/pajarera.js` | Lector Medio (murmullo, Despachos) | `murmurs: [GRABACION]` | `murmurs: ['(asiente)']` | ACC | cambio de código: la cadena literal es la constante GRABACION, que se queda |
| M24 | `rooms/sala_amazonas.js` | Lector Medio (murmullo y Hablar, Sala, Acto III) | A mí lo que me interesa es la economía. Y ahorrar. | (asiente) | ACC | las dos: el murmullo y Hablar; Gervasio sigue: «Lo que diga el Lector Medio.» / «...Pues ya está decidido.» (×2) |
| M25 | `rooms/pajarera.js` | Lector Medio (opción de Gervasio en Despachos) | `await api.sayAs(LM, GRABACION); ⏎                 await gv(api` | `await api.sayAs(LM, '(asiente)'); …` | ACC | solo en la opción «¿Quién decide lo del Plan Cero Papel?»: Gervasio pregunta, el cartón asiente, «...Pues ya está decidido.» |
| M26 | `rooms/office.js` | Gervasio (Vending) | Diecinueve años. Ni un marrón. Ni uno. | (a Gertrudis) Buenas... Se dan las buenas noches. En general. | VOZ |  |
| M27 | `rooms/office.js` | Gervasio (Vending) | Hoy me han preguntado tres veces por mi salud. Debo de estar fatal. | Sin el acta se está... Se está muy ligero. | CORTA |  |
| M28 | `rooms/pajarera.js` | Gervasio (Despachos) | Diecinueve años. Ni un marrón. Ni uno. | Ese correo se contesta... Se contestará. | CORTA | en Despachos se queda «Hoy me han preguntado tres veces por mi salud…», que siembra su respuesta en el duelo |
| M29 | `rooms/sala_amazonas.js` | Gervasio (Sala) | Hoy me han preguntado tres veces por mi salud. Debo de estar fatal. | **ELIMINAR** | ELIM | en la Sala se quedan «Eso, en todo caso, lo hablamos.» y «Diecinueve años. Ni un marrón. Ni uno.» |
| M30 | `rooms/sala_amazonas.js` | Íñigo (Sala, Acto III) | Esto en verde. Esto en rosa. Esto en azul, que es excusa. / Diapositiva 248: «El viaje continúa». / ¿Y esto el Lector Medio lo entiende? Perfecto: asiente. | Si nadie pregunta, esto se aprueba solo. Es mi parte favorita. / Rotativa, en rojo. Papel, en rojo. Becario, en rosa. | VOZ | los tres de siempre se quedan en Despachos (siembran la 248 y el asentir) |
| M31 | `rooms/sala_amazonas.js` | Íñigo (Sala) | Yo solo tomo agua con gas y sinergias. | ¿Café? Ahora no. Voy por la 247. | DET |  |
| M32 | `rooms/sala_amazonas.js` | Íñigo (Sala) | Perfecto. Con esto te doy de baja más rápido. | Ya te tengo en la matriz. Abajo a la izquierda. | DET |  |
| M33 | `rooms/office.js` | Gervasio (Vending) | Eso lo coges tú, que tienes la agenda más limpia. | Eso se deja... Se deja ahí. Ya se verá de quién es. | CORTA | la de la Sala se queda |
| M34 | `rooms/sala_amazonas.js` | Gervasio (Hablar tras D4) | `else if (api.flag('duelo_inigo_ganado')) await sayG(api, 'Lo que diga el Lector Medio.');` | `Lo que diga el Lector Medio. Que se está... Se está moviendo.` | CORTA | el quinto «Lo que diga el Lector Medio» se vuelve señal del empujón (§6) |

---

## §4 · El coro de Desarrollo con arco

### 4.1 El arco: de quién es la culpa

Hoy el coro tiene cuatro discusiones de ambiente (en orden fijo: casi todas se oyen en el Acto I y luego calla), el
árbol de tres opciones y el «¡Ha sido Diseño!» de la regleta. Sin progresión. La progresión que propongo es **a quién
culpan**, y la hace el que menos habla: DEV 3, que en todo el juego solo dice «No.».

| Acto | Dónde | A quién culpan | Líneas |
|---|---|---|---|
| I | Árbol (ya existe) y ambiente | **A los de fuera** | «¿Diseño?» / «No. Bruno.» / «Ah. Entonces no es culpa tuya.» · ambiente del CMS caído («...Gritando más alto.») y del margen («Diseño.» / «...Queda bien.» / «No se lo digas.») |
| II | La regleta (ya existe, por la rejilla) | **A Diseño, por reflejo** | «CORO: ¡Ha sido Diseño!» / Bruno: «(a la rejilla) He sido yo. Pero gracias.» |
| II | Ambiente nuevo, con el CMS ya vivo | **Unos a otros** | DEV 1: «El CMS se colgaba por una pantalla. ¿Quién la enchufó?» / DEV 2: «Tú.» / DEV 1: «Yo no. Él.» / DEV 3: «No.» |
| III | Ambiente nuevo, con Rubén ya liberado | **A sí mismos** | DEV 2: «¿Lo del Titulator ha sido Diseño?» / DEV 3: «No.» / *(silencio, 1,5 s)* / DEV 3: «Hemos sido nosotros.» / DEV 1: «No lo repitas.» |

Por qué así: en el Acto II el «No.» de DEV 3 empieza a sonar a otra cosa (es el único que no culpa a nadie); en el III
dice su primera frase entera, seria, de un golpe, y DEV 1 la entierra. Es el mismo «No.» de toda la partida, y esta vez
es verdad. Nadie lo comenta. Anselmo no interviene (su arco ya paga con Herminia y el «Revocado»).

**Reglas que cumple.** Solo Anselmo y el coro; ninguna mujer en Desarrollo; el machismo velado sigue siendo **solo** el
intercambio de fondo con Yoli que ya existe (FONDO_YOLI, una vez, sin comentario): ninguna línea nueva lo roza.
«Diseño»: +1 (K04), 6 de 11. Solo se oyen con Bruno cerca: las dos entradas nuevas llevan `cercaDelCoro`. Saldo: **+1**.

### 4.2 Implementación (`content/rooms/pecera.js`, P2)

```js
// E5 §4 · el coro con arco: Acto I (DISCUSIONES, ahora dos), Acto II (unos a otros), Acto III (ellos mismos).
// Las dos nuevas van ANTES en `ambient` para que, cuando toquen, sean las siguientes; solo con Bruno cerca.
const CORO_ACTO_2 = [[['D1', 'El CMS se colgaba por una pantalla. ¿Quién la enchufó?'], ['D2', 'Tú.'],
  ['D1', 'Yo no. Él.'], ['D3', 'No.']]];
const CORO_ACTO_3 = [[['D2', '¿Lo del Titulator ha sido Diseño?'], ['D3', 'No.'], ['wait', 1500],
  ['D3', 'Hemos sido nosotros.'], ['D1', 'No lo repitas.']]];
// en `ambient`, delante de { id: 'coro', … }:
{ id: 'coro_a3', if: ['ruben_libre', '!lector_derribado', cercaDelCoro], voces: VOCES_CORO, discusiones: CORO_ACTO_3 },
{ id: 'coro_a2', if: ['cms_vivo', '!acto_3_iniciado', cercaDelCoro], voces: VOCES_CORO, discusiones: CORO_ACTO_2 },
```

Y en `DISCUSIONES` se quitan la de la lluvia y la de «Internet está mal hecho» (K01, K02); quedan la del CMS caído y la
del margen. Las marcas `ambient:pecera.coro_a2` / `ambient:pecera.coro_a3` las pone el motor (no hay que declararlas).
`'wait'` ya lo entiende `decir()` (`engine/efectos.js`).

### 4.3 Tabla

| # | Fichero | Quién | Texto actual (literal) | Texto nuevo | Forma | Nota |
|---|---|---|---|---|---|---|
| K01 | `rooms/pecera.js` | coro | Ha llovido y ha bajado el tráfico. / ¡Abrid una incidencia a la lluvia! / La lluvia no es nuestra. | **ELIMINAR** | ELIM | la discusión entera (con su «No.» de DEV 3) |
| K02 | `rooms/pecera.js` | coro | Internet está mal hecho. / Desde el principio. | **ELIMINAR** | ELIM | la discusión entera (con su «...Sí.» de DEV 3: el «sí» de DEV 3 se guarda para el Acto III) |
| K03 | `rooms/pecera.js` | coro, Acto II | (nueva) | [D1] El CMS se colgaba por una pantalla. ¿Quién la enchufó? / [D2] Tú. / [D1] Yo no. Él. / [D3] No. | NUEVA |  |
| K04 | `rooms/pecera.js` | coro, Acto III | (nueva) | [D2] ¿Lo del Titulator ha sido Diseño? / [D3] No. / [D3] Hemos sido nosotros. / [D1] No lo repitas. | NUEVA | entre el primer «No.» y la frase, `['wait', 1500]` |

---

## §5 · Mercados con nombre y rasgo

Los tres ya tenían un rasgo escondido en sus propias líneas; solo faltaba ponerles nombre y dejar que cada uno lo
llevara siempre. Apellido de oficio, como el resto del reparto (Galerada, Triplicado, Remitido, Escaleta).

| Id | Nombre | Rasgo (una línea de carácter) | De dónde sale |
|---|---|---|---|
| `mercados_1` | **Fermín Plazofijo** | Renta fija: le da miedo que algo se mueva. «Chsss. Punto tres. Mientras no se mueva nada, yo estoy bien.» | Es el que huye al Vending y dice «Aquí la cola tiene orden. Me siento seguro.»; su barba de comité («cuando empezó la reunión, era lampiño») |
| `mercados_2` | **Rogelio Diferido** | Va siempre con retraso, como una cotización en diferido. «¿Sigue siendo marzo?» (ya era suya) | Su «¿Sigue siendo marzo?» y su «Se te ha congelado»; se le reasigna el murmullo «¿Me veis la pantalla? ...¿Hola? ¿Me veis?» |
| `mercados_3` | **Jacinto Dividendo** | Quiere cobrar dos veces. «Propongo otra reunión para ver el punto tres. Yo cobro dieta por cada una.» | Su «¡Yo soy de Bolsa y de Mercados! ¡Tengo doble prioridad!» de la estampida |

Saldo: **0** (nombres en `actors.js`, los tres Mirar de la Sala, el Mirar del Vending y dos Hablar: todo 1 por 1).
Cambio de código sin texto nuevo (X10): en `mercadosActor` de `sala_amazonas.js`, reordenar los murmullos para que cada
uno diga lo suyo: `[['Que alguien pida sala para salir de la sala.'], ['¿Me veis la pantalla? ...¿Hola? ¿Me veis?'],
['Entramos cinco minutitos. En marzo.']][i]` (Fermín pide procedimiento, Rogelio sigue en la videollamada, Jacinto
convoca). Los nombres salen en la línea de acción («Hablar con Fermín Plazofijo») y los usa el banco de Celestino (§6).

| # | Fichero | Quién | Texto actual (literal) | Texto nuevo | Forma | Nota |
|---|---|---|---|---|---|---|
| X01 | `actors.js` | mercados_1 | Mercados 1 | Fermín Plazofijo | NOMBRE |  |
| X02 | `actors.js` | mercados_2 | Mercados 2 | Rogelio Diferido | NOMBRE |  |
| X03 | `actors.js` | mercados_3 | Mercados 3 | Jacinto Dividendo | NOMBRE |  |
| X04 | `rooms/sala_amazonas.js` | Bruno | Uno de Mercados, con barba de comité. Cuando empezó la reunión, era lampiño. | Fermín Plazofijo, de Mercados. Cuando empezó la reunión, era lampiño. | NOMBRE |  |
| X05 | `rooms/sala_amazonas.js` | Bruno | Otro de Mercados. Mira la pantalla como a un valor refugio. | Rogelio Diferido, de Mercados. Sigue una videollamada que ya ha acabado. | NOMBRE |  |
| X06 | `rooms/sala_amazonas.js` | Bruno | El tercero de Mercados. Gafas de cerca para mirar el punto tres de lejos. | Jacinto Dividendo, de Mercados. Gafas de cerca y dos dietas por reunión. | NOMBRE |  |
| X07 | `rooms/sala_amazonas.js` | Fermín | Chsss. Estamos en el punto tres. | Chsss. Punto tres. Mientras no se mueva nada, yo estoy bien. | RASGO |  |
| X08 | `rooms/sala_amazonas.js` | Jacinto | Yo propongo una reunión para ver el punto tres. Entramos cinco minutitos. | Propongo otra reunión para ver el punto tres. Yo cobro dieta por cada una. | RASGO |  |
| X09 | `rooms/office.js` | Bruno | Uno de Mercados, en la cola del microondas. Detrás de un táper. | Fermín Plazofijo, de Mercados, en la cola del microondas. No se mueve. | NOMBRE |  |

---

## §6 · Líneas para las situaciones nuevas

No conozco el diseño de mi compañero (estampida como puzle, apagón en el camino principal, señal tras el clímax, Acto
III). Dejo escrito lo único que el encargo fija (la megafonía de Celestino para la señal tras el clímax) y un banco por
personaje para que el tercero lo case. Todo pasa por las mismas comprobaciones que §2 (≤ 80, sin fórmulas con tope, sin
«Como…», sin coletilla, sin «criatura», «chaval» ni «cariño»).

### 6.1 Megafonía de Celestino tras el clímax (señal del empujón)

Situación: D4 ganado, el Lector Medio se tambalea (ya existe), nadie dice nada (F2). Celestino, por megafonía (no por
la tele de la Sala, que se reserva para el «¡Penalti clarísimo!» de después del empujón: **ninguna variante dice
«penalti»** para no gastar la paga). Sobrias, de menos a más, una por intervalo sin acción; se cortan en cuanto el
jugador empuja. Sugerencia de tiempos: 10 s, 25 s, 45 s. No tocan la cadena final ni la escena del empujón.

```js
// E5 §6.1 (para quien implemente la señal): api.megafonia('celestino', MEGAFONIA_TAMBALEO[n], { etiqueta: 'MEGAFONÍA' })
const MEGAFONIA_TAMBALEO = [
  '¡Balón suelto en la Sala Amazonas! ¡El cartón se tambalea y nadie lo toca!',
  'Ahí sigue. De pie, asintiendo, sin nadie que le lleve la contraria.',
  '...Que alguien le dé un empujón, hombre. Que esto no se acaba solo.',
];
```

La primera es Celestino de siempre (ráfaga, fútbol); la segunda frena en seco con una frase llana (su otro registro,
biblia §2.4); la tercera es la pista explícita, dicha como la diría un portero de 60 años que ya no aguanta más. Si el
jugador habla con Gervasio en ese rato, M34 le da la misma señal en su voz: «Lo que diga el Lector Medio. Que se
está... Se está moviendo.».

### 6.2 Banco de líneas sueltas (20 por personaje)

Pensadas para la estampida como puzle (Sala Amazonas, Gervasio, Mercados, la tele de videollamadas, Gertrudis en
directo), el apagón en el camino principal (Redacción, rejilla de Sistemas, Celestino narrando), la espera tras el
clímax y el Acto III (armario 27, Rubén, la puerta de la Sala, Begoña bajando). Cada una suena a su dueño y se sostiene
sola. Ninguna está en el saldo de §8: **cada una que se use cuesta una línea**, que el tercero compensa con la reserva
de §8.2 o con poda propia.


**Aurora**

1. Se dice «los siguientes pasos», con artículo; sin él parece una amenaza.
2. Si nadie se atreve a preguntarlo, pregúntalo tú; turno no tienes, pero voz sí.
3. Se ha ido la luz. Las galeradas no necesitan enchufe; la web, por lo visto, sí.
4. A oscuras corrijo mejor; no veo lo que pone y leo lo que quiere decir.
5. Ese cartón lleva toda la tarde asintiendo; alguien tendrá que contradecirlo.
6. Lo que se tambalea se sujeta o se deja caer; decídelo tú, que estás delante.
7. Eso tiene sujeto, verbo y una mentira; quita la mentira y lo publicamos.
8. Si Teodoro te ha dicho que sí, no se lo recuerdes; tiende a arrepentirse.
9. Treinta años esperando que alguien me pregunte eso; ahora no sé qué decir.
10. Habla más bajo; en esta planta las paredes son de papel, y lo digo con orgullo.
11. Tráeme lo que encuentres, aunque esté mal escrito; de eso me encargo yo.
12. Un armario que escribe titulares necesita un corrector, no un cerrajero.
13. Dile a ese chico que «sorprenderá» lleva tilde; que la ponga, por lo menos.
14. Íñigo dice «impactar» como si fuera un verbo de verdad; déjalo, se cansará.
15. Me has traído el café caliente; eso, a estas horas, es casi una declaración.
16. He repasado tres veces tu nombre en la ficha; las tres estaba bien escrito.
17. No te disculpes antes de tiempo; espera a saber qué has hecho.
18. Esa reunión empezó en marzo; si termina hoy, habrá que corregir el calendario.
19. Ve. Yo me quedo con la página; alguien tiene que estar aquí cuando vuelvas.
20. No corras por el pasillo; las prisas también se notan en la letra.

**Teodoro**

1. Luz fuera. Papel dentro. Seguimos.
2. Ese cartón no ha leído nunca nada.
3. Reunión terminada. Que conste en página.
4. Mercados, a la calle. Hueco libre.
5. Respuesta: no. Pregunta: da igual.
6. Hora: 20:40. Página: abierta. Tú: tarde.
7. El armario escribe mal. Pero escribe.
8. Titulares de armario. Cuerpo 14. Feos.
9. Ese chico mide bien. Contrátalo. No repitas.
10. La Goyita pregunta por ti. Yo no.
11. Fax recibido. Leído dos veces. Bien.
12. Sube. Baja. Vuelve. Te mido igual.
13. Rotativa a las nueve. No a las nueve y uno.
14. Firma mañana. Esta noche, nada de héroes.
15. Íñigo Sinergia: catorce. Le sobran doce.
16. Silencio en planta. Me gusta. Sigue así.
17. A oscuras se mide igual. Mejor.
18. Quien empuja, firma. Quien asiente, no.
19. Pregunta corta. Respuesta corta. Bien.
20. No me des las gracias. Dame líneas.

**Gertrudis**

1. E-60: SE HA IDO LA LUZ. YO NO.
2. E-61: FUNCIONO CON RENCOR. NO NECESITO ENCHUFE.
3. E-62: EMITIENDO EN DIRECTO. SALUDEN.
4. E-63: ¿Y CUÁLES SON LOS SIGUIENTES PASOS?
5. E-64: PÚBLICO EN LA SALA AMAZONAS. ME PONGO GUAPA.
6. E-65: PREGUNTA ENVIADA. NADIE CONTESTA. NORMAL.
7. E-66: HAN SALIDO CORRIENDO. ME ENCANTA MI TRABAJO.
8. E-67: SEÑAL PERDIDA. LA BUSCO YO.
9. E-68: ¿TÚ OTRA VEZ? ¿CON UN CABLE? VALE.
10. E-69: ENTRADA 3. NO. LA 2. NO. YA.
11. E-70: DIRECTO TERMINADO. GRACIAS A NADIE.
12. E-71: EL BECARIO ME HA PEDIDO UN FAVOR. ANOTADO.
13. E-72: TODOS ME MIRAN. NADIE ME SALUDA. CLÁSICO.
14. E-73: HE DICHO LO QUE NADIE DECÍA. DE NADA.
15. E-74: RENCOR AL 80 %. SUBIENDO.
16. E-75: SALUDO RECIBIDO. ESTA VEZ LO NOTO.
17. E-76: HOY SOY TELEVISIÓN. MAÑANA, CAFETERA. ASÍ ES EL OFICIO.
18. E-77: MODO MEGAFONÍA ACTIVADO. TIEMBLEN.
19. E-78: BUENAS NOCHES A TI. LO HE DICHO YO ANTES.
20. E-79: NO ME DESENCHUFES. ESTOY EN ANTENA.

**Celestino**

1. ¡Se va la luz en la Redacción! ¡Juegan a ciegas! ¡Y la web sigue publicando!
2. ¡Apagón en la primera planta! ¡El árbitro mira el reloj! ¡Nadie mira el enchufe!
3. ¡Estampida en la Sala Amazonas! ¡Tres de Mercados hacia la banda!
4. ¡Fermín sale por la izquierda! ¡Rogelio, tarde! ¡Jacinto pide prioridad!
5. ¡Atasco en la puerta! ¡Eso es fuera de juego posicional!
6. ¡Se vacía la sala! ¡Gervasio, solo en el área! ¡Qué soledad!
7. ¡Desde Sistemas, novedades! ¡El armario 27 hace ruido de vestuario!
8. ¡La megafonía funciona! ¡Nadie me lo había dicho!
9. ¡Íñigo pide tiempo muerto! ¡Y se lo concede él mismo!
10. ¡Gervasio cede el balón! ¡Lo vuelve a ceder! ¡Nadie lo quiere!
11. Perdón. Es que hoy pasa algo en este edificio.
12. ¡Último minuto! ¡El reloj del vestíbulo marca las nueve menos diez!
13. ¡Y la rotativa calienta en la banda!
14. ¡Ojo, que Begoña baja a la Sala! ¡Con el sello en la mano!
15. Aquí abajo no se oye nada. A estas horas, eso es buena señal.
16. ¡El fax de Teodoro manda un balón largo! ¡Llega! ¡Llega!
17. Treinta años narrando. Hoy, por fin, pasa algo.
18. ¡Sube el ascensor! ¡Planta dos! ¡Va con todo!
19. ¡Vuelve la luz! ¡Y nadie celebra! ¡Así es esta afición!
20. Se ha quedado todo muy quieto. No me gusta cuando se queda quieto.

**Paco**

1. Ticket 48.300: «Se ha ido la luz». Estado: lo sé.
2. Corte en la planta 1. Origen: alguien. Estado: arriba.
3. Regleta R-3. Piloto apagado. Estado: has sido tú.
4. Ticket nuevo: «La Sala Amazonas está vacía». Estado: inédito.
5. Armario 27. Consumo de wifi: alto. Estado: alguien vive ahí.
6. No subo. Me lo cuentas por la rejilla.
7. Ticket 48.301: «Ha hablado la cafetera». Asignado a: nadie. Estado: mejor así.
8. Ese portátil ya consta. Si quieres, ahora te doy de alta a ti.
9. Rubén. Alta: hoy. Antigüedad: un verano. Estado: fuera del armario.
10. La megafonía va por mi cuadro. Celestino lo sabe. Estado: tolerado.
11. Cero tickets abiertos. No me había pasado nunca. Estado: raro.
12. Han caído tres servidores. Los he levantado. Nadie lo sabrá.
13. Tu nombre ya está en el registro. Lo he comprobado dos veces.
14. Arriba gritan. Aquí, ventilador. Prefiero el ventilador.
15. Si se va la luz, que se vaya. El registro tiene batería.
16. ¿Una IA? Abre ticket. ¿Un becario? Abre dos.
17. Estado: cerrado. Es la palabra que más me gusta del idioma.
18. Me ha llamado Teodoro. Por fax. Aquí no llega el fax. Ha llegado.
19. Luz restablecida. Nadie ha dado las gracias. Estado: normal.
20. Ticket 48.302: «El Lector Medio no asiente». Estado: ya era hora.

**Rubén**

1. APAGÓN EN LA REDACCIÓN: LO QUE PASÓ A OSCURAS. ...Nada. Perdón.
2. HUYEN DE UNA REUNIÓN. EL MOTIVO TE DEJARÁ SIN PALABRAS. ...Era una pregunta.
3. Cuatro meses sin ver una ventana. ¿Siguen siendo rectangulares?
4. BECARIO SALE DEL ARMARIO. LOS VECINOS, EN SHOCK. ...Perdón. Es que salgo.
5. Solo sé hacer dos cosas: titulares y bocadillos de atún.
6. EL CARTÓN QUE DECIDÍA POR TODOS. ...¿Lo empujas tú o lo empujo yo?
7. Íñigo me llamaba «el modelo». Yo pensaba que era por guapo.
8. Me sé la clave del wifi de todas las plantas. No me sé el código postal.
9. LA VERDAD SOBRE EL ARMARIO 27. ...Que es pequeño. Esa es la verdad.
10. ¿Puedo ir al baño sin pedir permiso? Es para saberlo.
11. TRESCIENTOS TITULARES EN UNA TARDE: EL MÉTODO. ...Miedo. El método es miedo.
12. Perdón por lo de «Pellizco». El corrector no se sabía tu apellido.
13. Si me dan de baja, ¿me devuelven el verano?
14. LO QUE DIJO EL LECTOR MEDIO TE HARÁ PENSAR. ...Dijo lo de siempre.
15. Mi madre cree que trabajo en una IA. Técnicamente, sí.
16. Gracias. Nadie me había preguntado el nombre. Me llamo Rubén.
17. UN BECARIO ENCUENTRA A OTRO BECARIO. ...Perdón. Hola.
18. Huele a papel. Arriba huele a papel. ¿Siempre ha olido así?
19. Escribo con la luz apagada. Así no veo lo que pongo.
20. ÚLTIMA HORA: SON LAS NUEVE MENOS CUARTO. ...Eso era verdad. Lo siento.

**Begoña**

1. Uno: se ha ido la luz. Dos: la nota de gasto, no. Tres: firme.
2. Un apagón no es un justificante. Tráigame el ticket de la oscuridad.
3. La reunión ha terminado a las 20:31. Lo apunto. Nadie me lo va a discutir.
4. Siete minutos de estampida. Se descuentan de las dietas de Mercados.
5. Ese cartón no tiene NIF. No puede decidir nada.
6. Un becario en un armario. ¿Con qué contrato? ¿Quién paga el wifi?
7. Uno: atún. Dos: atún. Tres: atún. Cuatro meses de atún sin justificante.
8. No me mire así, niño. El sello no tiene sentimientos. Yo, los justos.
9. Le he guardado una copia. En original. No se acostumbre.
10. Tres preguntas en un pasillo. Me sobran dos.
11. Mire: el triplicado ha servido para algo. Apúntelo en algún sitio.
12. Si el Lector Medio cae, que caiga en horario de oficina.
13. Concepto: empujón. Importe: cero. Justificante: lo hemos visto todos.
14. A oscuras trabajo igual. Los números se leen solos.
15. Optimal Brains. Cuarenta y ocho euros. Ya lo dije. Lo repito a gusto.
16. Firme aquí. Y aquí. La tercera, no; la tercera es mía.
17. Bajar a la Sala no está en mis funciones. He bajado. Que conste.
18. Todo lo que no recorto lo acabo pagando yo.
19. Las 20:58. Le quedan dos minutos de existencia administrativa.
20. Recorte estándar del 26 %. A Íñigo se lo aplico por arriba.

**Gervasio**

1. Se ha ido la... Se ha ido. Que alguien lo... Ya volverá.
2. Esa pregunta no está en el orden del... No está.
3. Se levanta la... Se ha levantado sola.
4. Los siguientes pasos se... Se darán. Por alguien.
5. ¿Quién ha preguntado eso? Se ha preguntado. Ya no tiene remedio.
6. Eso se habla en la próxima... Si la hay.
7. La sala se ha quedado... Se ha quedado grande.
8. Se agradece la pregunta. Mucho. Se va uno a por agua.
9. Que se encargue el que... Tú mismo.
10. Se ha caído el Lector Medio. Se levanta, ¿no? Se suele levantar.
11. Esto no consta. Bueno. Ahora consta.
12. De mis tres móviles, ninguno tiene batería. Se agradece.
13. El acta se ha... Se ha escrito sola. Tiene tu letra.
14. Se podría pedir perdón. Se podría.
15. Se convoca una reunión para... No. Mejor no.
16. A oscuras se decide mejor. No se ve quién ha sido.
17. Se empuja con cuidado, que es material de la casa.
18. Lo que diga el árbitro. Y si el árbitro no dice nada, también.
19. Se me ha olvidado el punto tres. Era lo que más tiempo llevaba conmigo.
20. Esto lo tendría que haber... Alguien. Lo tendría que haber alguien.

**Íñigo**

1. Esto que estamos viviendo es una oportunidad a oscuras.
2. Nadie se va. Estamos redistribuyendo la presencia.
3. Una estampida es feedback muy rápido. Lo valoro.
4. Vamos a mirarlo con perspectiva, con datos y con agua con gas.
5. El Lector Medio no se ha caído. Ha cambiado de plano.
6. Yo no he metido a nadie en un armario. He puesto un armario a disposición.
7. Siguientes pasos: uno, mantener la calma. Dos, mantener el contrato.
8. Me encanta que me lo preguntes. No tengo esa diapositiva.
9. Vacante, te veo con hambre de impacto. En un perfil junior, eso asusta.
10. La luz no se ha ido. Nos ha dado espacio.
11. Propongo cerrar este punto, abrir otro y no mirarlo nunca.
12. Todo esto lo hemos cocreado. Sobre todo tú.
13. Lo hablaba ayer con la matriz. Abajo a la izquierda estás tú.
14. Rubén está fenomenal. Lo veo muy reubicado.
15. Una IA que come atún escala peor. Lo apuntamos como aprendizaje.
16. ¿Quién ha validado la fase uno? Lo pregunto en positivo.
17. No tengo prisa. Tengo una agenda que tiene prisa por mí.
18. Me quedo con lo bueno: nadie ha leído nada.
19. Esto, en la diapositiva, quedaba mejor.
20. Agradezco mucho tu energía. Te la devuelvo por correo.

---

## §7 · Topes nuevos (para `tools/plan-rules.mjs`)

Mismo criterio que E3: margen pequeño, porque **una línea nueva con coletilla casi seguro sobra**. Eventos fuera
(`fuera: FUERA_EVENTOS`, como «cariño» y las fórmulas de E3).

```js
// ENMIENDA E5 §1 · la coletilla «frase + Y/Con/Sin/Ni + 1-3 palabras» (crítica 4 §4.5). Una cadena cuenta una vez.
// Hoy 160 sin Eventos → tras E5, 40. Probada con literales() + sinSoloPantalla() + esTexto() de este fichero.
export const COLETILLA_RE =
  /(?:[.!?…][»"”)]?\s+|^)(?:\.\.\.|…)?¡?(?:Y|Con|Sin|Ni)\s+[^\s.!?…¿]+(?:\s+[^\s.!?…¿]+){0,2}(?:\.|!+)[»"”)]?\s*$/u;

// en TOPES_E2_JUEGO (todo el juego, cadenas literales):
{ re: COLETILLA_RE, max: 46, fuera: FUERA_EVENTOS, txt: 'coletilla «Y/Con/Sin/Ni + 1-3 palabras» (E5 §1)' },   // 160 → 40
{ re: /\bchaval\b/gi, max: 12, txt: '«chaval» en todo el juego (E5 §3)' },                                       // 22 → 11
{ re: /RECHAZADO[»,]? en la frente/g, max: 2, fuera: FUERA_EVENTOS, txt: 'la frente sellada (E5 §3)' },          // 4 → 2 (Bruno y Evaristo)

// «criatura» ≤ 6 (Aurora) ya está en TOPES y por fin se cumple en las cadenas (13 → 6); añadir el global:
{ re: /\bcriatura\b/gi, max: 6, txt: '«criatura» en todo el juego (E5 §3)' },                                   // 13 → 6

/** E5 §1 · reparto: ningún personaje con ≥ 20 líneas oídas remata con coletilla más del 10 % de ellas. El Lector Medio
 *  (una sola frase) y las salas de Eventos no cuentan. Devuelve los avisos (como topes()). */
export function coletillaPorPersonaje(lines) {
  const por = {};
  for (const l of lines) {
    if (l.who === 'lector_medio' || /^eventos/.test(l.room || '')) continue;
    const p = (por[l.who] ||= { n: 0, c: [] }); p.n++; if (COLETILLA_RE.test(l.text)) p.c.push(l.text);
  }
  return Object.entries(por).filter(([, p]) => p.n >= 20 && p.c.length / p.n > 0.10)
    .map(([w, p]) => `coletilla (${w}): ${p.c.length} de ${p.n} (${Math.round(100 * p.c.length / p.n)} %, tope 10 %):\n      ${p.c.join('\n      ')}`);
}
```

- **Coletilla ≤ 46** (quedan 40): margen 6, más ancho que los de E3 porque la parte de diseño va a añadir escenas
  enteras y la regex es estructural, no léxica. Por debajo de lo que proponía el encargo (≤ 110): con 40 reales, un tope
  de 110 sería permiso, no tope.
- **≤ 10 % por personaje** (el encargo sugería 12 %): hoy, tras E5, el más alto es Begoña, ≈ 8 % (5 de 65 cadenas);
  Maripaz ≈ 4 %; Bruno < 1 %. Con 12 % no saltaría nunca.
- **No** propongo tope al remate seco general de 1-3 palabras (889 → 836): es la forma natural del habla corta y
  meterle cuota haría salir un quinto tic. Sí lo vigilaría con `--recuento` (informativo).
- **Lo que la regex no ve y el revisor sí**: esconder la coletilla tras una coma («Lo llevaba, con IVA.») o alargarla a
  cuatro palabras para que no cuente. En esta enmienda solo hay dos integraciones en una frase (C69, C109) y las dos
  cambian la frase, no solo la puntuación; en las siguientes, que lo mire el contra-guionista.

---

## §8 · Saldo de líneas

Unidad: una cadena que se dice o se enseña (como E3 §5).

### 8.1 Saldo

| Bloque | Entradas | Cambios | Saldo |
|---|---:|---|---:|
| §2 Coletillas | 113 (115 cadenas) | 109 entradas 1 por 1 (111 cadenas); ELIMINAR C68, C88, C101; C56 +1 (Evaristo contesta) | **−2** |
| §3 Muletillas y repeticiones | 34 | M16-M19, M29 ELIMINAR (−5); M20 de 2 a 1 (−1); M30 de 3 a 2 (−1); el resto 1 por 1 (M23, M25, M34 son cambios de código en una cadena) | **−7** |
| §4 Coro | 4 | −4 (lluvia), −3 (Internet), +4 (Acto II), +4 (Acto III) | **+1** |
| §5 Mercados | 9 (+ X10 de código) | todo 1 por 1 | **0** |
| §6.1 Megafonía | 3 | nuevas | **+3** |
| **Total de esta parte** | | | **−5** |
| §6.2 Banco | 180 | fuera del saldo: cada una que se use, +1 | (0) |

Ficheros (paquete propietario entre paréntesis): `actors.js` (P0: C99, C100, M22, X01-X03), `items.js` (P0: C64-C68,
M01, M19), `game.js` (P0: C69, C70), `pistas.js` (P0: C71, C102-C113), `lib/ascensor.js` (P0: C101), `lib/celestino.js`
(P0: M09-M11), `escenas/climax.js` (P4: C84), `rooms/vestibulo.js` (P1: C01-C10, M12-M14, M18), `rooms/cpd.js` (P1:
C40-C44, C72-C80, M16), `rooms/pecera.js` (P2: C11-C24, K01-K04), `rooms/pecera.dialogos.js` (P2: C94-C97, M20),
`rooms/pecera.escenas.js` (P2: C92, C93), `rooms/pecera.secretaria.js` (P2: C25, C26, M21), `rooms/pajarera.js` (P2:
C27-C31, C89-C91, M23, M25, M28), `rooms/catacumba.js` (P3: C32-C39, C85-C88, M02-M08), `rooms/office.js` (P3: C58-C60,
M26, M27, M33, X09), `rooms/administracion.js` (P3: C53-C56, C81), `rooms/administracion.dialogos.js` (P3: C57, C82,
C83), `rooms/ecosistema.js` (P4: C45, C47-C52), `rooms/ecosistema.dialogos.js` (P4: M17), `rooms/sala_amazonas.js`
(P4: C46, C61-C63, C98, M15, M24, M29-M32, M34, X04-X08, X10), `tools/plan-rules.mjs` (P0: §7).

**No se tocan:** `eventos.js`, `eventos.dialogos.js`, `escenas/final.js`, `duelo.js`, `flags.js`, los ficheros de E4,
ningún flag, id, opción-solución, mazo, ataque, réplica ni remate.

### 8.2 Reserva para compensar el banco (no aplicada; la decide el tercero)

Tres cadenas que la crítica 4 pone entre las peores (§4.3) y que se pueden quitar sin tocar nada más:

| # | Fichero | Texto actual (literal) | Decisión |
|---|---|---|---|
| R1 | `lib/ascensor.js` | Capacidad: ocho personas o una reunión que pudo ser un correo. | ELIMINAR («chiste de taza», peor 4) |
| R2 | `rooms/administracion.dialogos.js` | Cuarenta años en esta ventanilla. He visto un ticket en sánscrito. | ELIMINAR («relleno sin giro», peor 10) |
| R3 | `rooms/pajarera.js` | El uniforme oficial de quien dice "disruptivo" sin mover la cara. | ELIMINAR (peor 3; queda la primera cadena del Mirar) |

Con la reserva aplicada, esta parte deja **−8** y paga ocho líneas del banco.


---

## §9 · Pruebas que citan textos que cambian

Búsqueda literal de cada cadena actual de §2-§5 y de cada frase suya de ≥ 12 caracteres en `tools/*.mjs` (script en
`tools/` del material de trabajo). Hay que actualizarlas a la vez que el texto.

| Prueba | Línea (hoy) | Cita | Id | Qué hacer |
|---|---|---|---|---|
| `test-comedia-p1.mjs` | 136 | «¡Vuelve el chaval al vestíbulo! ¡Sin balón, pero con ganas!» | M13 | → «¡Vuelve al vestíbulo! ¡Sin balón, pero con ganas!» |
| `test-comedia-p1.mjs` | 188 | `!logHas('¡El chaval viste al Lector Medio!')` (que **no** se narre un hito viejo) | M09 | → `!logHas('¡El Lector Medio sale con chaqueta!')`; si no, la prueba pasa siempre sin mirar nada |
| `test-comedia-p1.mjs` | 220 | «Por la misma página. Con la esquina doblada.» | C44 | → «Ya está abierto. Por la misma página.» |
| `test-comedia-p1.mjs` | 339, 343 | «¿CUARENTA SEGUNDOS?», «Yo también soy herramienta.» | C73 | sigue casando (prefijos): sin cambios |
| `test-comedia-p1.mjs` | 353, 355 | «Ticket nº 1: cerrado. Por el tablero. Sin subir.» | C75 | → «Ticket nº 1. Estado: cerrado. No he tenido que subir.» |
| `test-comedia-p1.mjs` | 308 | «…En POR HACER.» (es de Rubén, otra línea) | — | no se rompe |
| `test-comedia-p2.mjs` | 127 | «la silla sigue siendo suya. Y yo, encima.» | C17 | → «la silla sigue siendo suya.» |
| `test-comedia-p2.mjs` | 165 | «Cascos puestos. Sin música.» | C22 | → «El cable de los cascos no va a nada.» |
| `test-comedia-p2.mjs` | 296, 316, 483 | «El modelo es de fuera. El prompt es de dentro.», «Eso lo hace nuestro.» (escena del paso 34) | M20 | sin cambios: la escena conserva la frase. **Comprobar** que la prueba no entra antes por el árbol (rama sin `herminia_midio`), que ahora dice «¿Tú de qué departamento vienes?» |
| `test-comedia-p2.mjs` | 394 | `T.opcion('¿Y si le hacemos un funeral? Con flores. Y diapositivas.')` | C97 | → `T.opcion('¿Y si le hacemos un funeral con diapositivas?')` |
| `test-comedia-p2.mjs` | 408 | «Revocado. Con fecha de hoy. Y de julio.» | C94 | → «Revocado. Fecha: hoy. Efectos: julio.» |
| `test-comedia-p3.mjs` | 163 | etiqueta «Mercados 1» (texto del `ok`, no de la búsqueda) | X01 | opcional: «Fermín» |
| `test-comedia-p3.mjs` | 270 | «Llevas un anuncio en la espalda, criatura. En esta planta, no.» | M04 | → «Llevas un anuncio en la espalda. En esta planta, no.» |
| `test-comedia-p3.mjs` | 398 | «Y en persona, comas.» | C83 | → «En persona, comas.» (prefijo de la nueva) |
| `test-comedia-p4.mjs` | 179 | «Sin mi nombre. Con buena luz.» (`=== 1`) | C45 | → «Pone «[NOMBRE]».» |
| `test-comedia-p4.mjs` | 273 | «Cuando empezó la reunión, era lampiño.» y «Cotizan. Y a la baja.» | X04, C63 | la primera sigue (X04 la conserva); la segunda → «No se cogen. Cotizan.» |
| `test-fase0.mjs` | 151 | nivel 3 de la llamada 3: «A: Pega tu cara donde salen los jefes. Con algo que pegue.» y «B: Chicle, tarjeta, organigrama. Y luego el torno.» | C102, C103 | → «A: Pega tu cara donde salen los jefes. ¿Tienes algo que pegue?» y «B: Chicle en la tarjeta, tarjeta en el organigrama, y al torno.» |
| `test-fase0.mjs` | 223 | espera la discusión «Internet está mal hecho.» | K02 | → esperar «¿Quién ha puesto este margen de ocho píxeles?» (es ahora la segunda y última de `DISCUSIONES`); la de la línea 243 (`/margen\|…/`) sigue valiendo |
| `test-comedia-p4.mjs` | 509 | `logWho('...Y ahorrar.') === 'lector_medio'` | — | no cambia (la paga se queda) |
| `tools/plan-rules.mjs` | `TOPES` | `lector_medio` ≤ 6 | — | se cumple de sobra; §7 añade los topes nuevos |

Ningún paso de `walk-data.mjs`, `extras.mjs`, `fuzz.mjs` ni `play-mouse.mjs` cita estas cadenas. `test-critica3.mjs`
no cita ninguna (la señal del empujón que prueba es el tambaleo y «Mirar a Bruno», que no cambian aquí).
Pruebas nuevas recomendadas: en `test-comedia-p2.mjs`, con `ruben_libre` y Bruno junto al coro, esperar «Hemos sido
nosotros.» (K04) y comprobar que **no** suena con Bruno en la otra punta (`CORO_UMBRAL`); en `test-comedia-p4.mjs`,
que Hablar con el Lector Medio en la Sala del Acto III da «(asiente)» y no la grabación.
