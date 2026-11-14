# FE DE ERRATAS — Reescritura de comedia · Propuesta de VOCES y DIÁLOGO

**Writers' room (3) · especialidad: voces y diálogo** · Sobre la crítica de 13-11-2026 (6,5: «sonrisa constante, no
carcajada») y el contenido de `content/` tal como está hoy.
**Alcance:** este documento solo propone; no toca `content/`, `engine/` ni `tools/`. Todo lo que cito lleva `fichero:línea`
(rutas relativas a `content/`). Cada línea hablada nueva cumple ≤ 80 caracteres (comprobado con script, ver §A.3).

**Convenciones de este documento**

- En los guiones, cada línea hablada va así: `COD   texto`. Códigos: BRU Bruno · CEL Celestino · YOL Yoli · NEM Nemesio ·
  TEO Teodoro (por fax) · AUR Aurora · GER Gervasio · BEG Begoña · BOR Borja · MAR Maripaz · PIL Pilar · PAC Paco ·
  IÑI Íñigo · RUB Rubén · ABU abuela · EVA Evaristo · GTR Gertrudis (LCD) · LEC Lector Medio · MER los de Mercados ·
  TOR el torno · VAL Valentín · D1/D2/D3 coro · TIT pantalla del Titulator · NAR narrador. Las acotaciones van entre paréntesis.
- Opciones de diálogo: `> [n·tipo] «texto»` + condiciones. Tipos: **sens** (sensata), **desc** (descarada), **abs**
  (absurda), **NO** (la que Bruno no debería decir), **WT** (texto literal del walkthrough: no se toca o se avisa).
- `⟶` = efecto de puzle (flags, objetos). Si no pone nada, la opción no cambia el estado del juego.

---

## A. Diagnóstico propio (10 líneas, con datos)

Medido con un extractor propio (`scratchpad/medir.mjs`, atribución de hablante heurística por `sayAs`/ayudantes/árboles):
3.121 cadenas, **2.751 líneas habladas** (≥ 6 caracteres; sin opciones de menú ni narrador).

1. **Remate corto:** de 1.880 líneas con dos o más frases, **969 (51,5 %)** terminan en una frase de ≤ 4 palabras. Por
   voz: Gertrudis 100 %, coro 82 %, Custodia 76 %, Yoli 73 %, Teodoro 72 %, Evaristo 68 %… Íñigo 42 %, Borja 32 %.
2. **«Como…»:** **56** líneas cuya última frase empieza por «Como» (+7 que acaban en «, como X.»). **46 de las 56 son de
   Bruno (82 %)**, y 7 están en las respuestas por defecto (`game.js:16-22`), que el jugador oye en bucle.
3. **Bruno es el problema de volumen:** dice **1.296 de 2.751 líneas (47 %)**. Sus moldes: 65 «Si lo/la/le [verbo]…»
   (consecuencia hipotética), 34 «Le hablo/digo/pregunto… y no contesta», 33 «es lo único / lo más», 33 empiezan por
   «No.», 17 «No se X. Se Y.», 36 citan a Paco o un ticket, 11 dicen «2019».
4. **Muletillas y contagio** (veces / dueño / quién más la usa): «cariño» 35 (Maripaz 25; Bruno 4, Nemesio 2, Yoli,
   Rubén…); «Lo hablamos» 25 (Gervasio 17; Bruno 5, Íñigo, el menú de salir); «acredit-» 39 (Pilar 18, **Bruno 15**);
   «cinco minutos» 24 (Pilar 8, **Bruno 10**); «Diseño» 45 (**Bruno 19**, coro 15, Valentín 4); «ticket» 60 (**Bruno 26**,
   Paco 11, Begoña 5); «por escrito» 17 repartido en **6 voces**; «factur-» 29 en **7 voces**; «Diecinueve años» 13.
5. **Las que están sanas:** «criatura» 8 (solo Aurora), «Una cosita» 10 y «Era solo eso» 9 (solo Evaristo). No es
   casualidad: son las dos voces que el crítico sí reconoce. Una muletilla funciona si **solo la dice uno y progresa**.
6. **Síntoma:** el remate corto, el «Como…» y las muletillas. Son lo que se oye, pero no es lo que está roto.
7. **Causa 1 — Bruno no quiere nada en la frase.** Sus líneas comentan el mundo («Como Recursos Humanos») en vez de
   desearlo o mentirse; un comentarista sin objetivo solo tiene un recurso: la comparación final. Es la voz del autor.
8. **Causa 2 — los personajes están definidos por lo que dicen, no por cómo deciden.** Todos hacen el mismo movimiento:
   aceptan la pregunta y la rematan. Nadie malinterpreta, nadie interrumpe, nadie quiere algo de Bruno *en la escena*.
9. **Causa 3 — opciones informativas.** «¿Qué es esa matriz?» no plantea nada, así que la respuesta tiene que hacer
   planteamiento y remate a la vez: dos frases, la segunda corta. El árbol de Begoña ríe porque la opción ya es el chiste.
10. **Causa 4 — los rasgos se escribieron como palabras («cariño», «facturar», «por escrito») y no como sintaxis**; las
   palabras se contagian, la sintaxis no. Por eso, en la biblia de voces de abajo, cada regla es de *estructura*.

### A.3 Cómo se comprueba esta propuesta

- Todas las líneas habladas nuevas de este documento (bloques de guion, opciones y tests) pasan un script de longitud
  (≤ 80 caracteres). Ninguna línea nueva de Bruno termina en «Como…».
- Ninguna línea nueva usa «Consejo», alude a un director del periódico, pone al Lector Medio en una cabecera o tras la
  mesa de un jefe, ni junta en una misma línea del juego a Diseño y Producto con la sección de Leoncio, que se va (§E).
- Salas: solo los nombres visibles. Donde hoy se dice «Pecera», «Catacumba» o «CPD» en boca de un personaje, la línea
  nueva dice Redacción, Redacción de papel o Sistemas.

---

## B. BIBLIA DE VOCES

Regla general para todo el reparto: **la voz es una manera de decidir, no una palabra.** Cada ficha da: cómo piensa
(lógica, miedo, qué quiere de Bruno), 4 reglas de habla, dos relaciones cómicas, un test de 8 líneas nuevas que deberían
reconocerse sin nombre y el **tope de su muletilla en todo el juego**. Las muletillas no se reparten: si otra voz la
necesita, la cita entre comillas y con atribución («Como diría Gervasio…» no: «Eso es muy de "lo hablamos"»).

Tabla de contraste (para que dos voces no compartan casilla):

| Voz | Longitud de frase | Persona gramatical | Lo que hace con la pregunta de Bruno |
|---|---|---|---|
| Bruno | media | 1.ª, presente | la convierte en logro |
| Celestino | ráfagas cortas | 3.ª (narra al que tiene delante) | la retransmite |
| Yoli | cortísima, cortada por cifras | 1.ª con datos | la mide |
| Nemesio | lenta, con pausas | impersonal de tablero | la clasifica en una columna |
| Teodoro | telegrama | sin sujeto | la mide en caracteres |
| Aurora | la más larga del juego | 2.ª, con subjuntivo | corrige la forma antes de contestar |
| Gervasio | se corta antes del verbo | «se» impersonal | la devuelve |
| Begoña | dictamen | imperativo | la tramita (y la recorta) |
| Paco | informe | 3.ª, estado | le pone número |
| Íñigo | suave, larga | 1.ª plural | la reencuadra en positivo |
| Rubén | MAYÚSCULAS y luego susurro | titular | la titula y pide perdón |
| Maripaz | eslogan + letra pequeña | 2.ª, «cariño» | la patrocina |
| Borja | exclamación de 3-5 palabras | 1.ª plural | contesta antes de que acabe |
| Pilar | lista logística | «nosotros» de organización | la acredita |
| Evaristo | enumeración con salvedad | usted | la anuncia por correo |
| Abuela | pregunta que no espera respuesta | 2.ª, mando | contesta a otra cosa |

---

### B.0 Bruno Pellejo (protagonista)

**Defecto cómico (uno, claro): el autobombo de becario.** Seis años de prácticas le han enseñado a reescribir cada
humillación como un logro de currículum: no le han dejado pasar, «ha auditado el torno»; no tiene silla, «trabaja en
metodología de pie». **Y cuando se pone nervioso, se le escapa la verdad entera, en voz alta** (es la opción «la que Bruno
no debería decir» de todos los árboles).

- **Cómo piensa:** si lo cuenta bien, ha pasado bien. **Miedo:** que la abuela descubra que en el periódico no es nadie.
  **Qué quiere de los demás:** que escriban bien su nombre. Su virtud secreta: él escribe y dice bien el de todos.
- **Arco de voz:** Íñigo hace lo mismo que él, pero con los demás («no os despido: os desapalanco»). Cuando Bruno lo ve en
  el epílogo (§E.3), deja de reencuadrar: sus últimas frases del juego son literales, sin adorno («No. Soy Bruno
  Pellejo.» / «Vale, abuela.»).

**4 reglas de habla**

1. **Sintaxis:** primera persona, presente. Afirma hacia arriba («Es mi primer cargo») y **la corrección la pone el
   mundo**, no él: la frase siguiente es de otro personaje o de un objeto que le desmiente. Así el remate es situación.
2. **Vocabulario:** jerga de currículum aplicada a desgracias (competencias, perfil, logros, proyecto, metodología) y
   cifras exactas de la web (4.112 piezas, once segundos de lectura media). Nada de jerga técnica que no explique.
3. **Ritmo:** 6-12 palabras. Ante una humillación de verdad, un «...» y nada más (como mucho uno por escena). Habla con
   los objetos con cortesía de compañero («Buenas noches, torno.»), nunca con desprecio.
4. **Nunca diría:** una comparación final con «Como…»; un insulto; una queja contra una persona concreta; nada sobre
   «sprites», «aventuras» o «puzles» (cuarta pared: solo el aviso de inactividad de `game.js:277`, que se queda).

**Relaciones cómicas:** *con Íñigo*, espejo: los dos reencuadran; Íñigo admira de verdad el talento de Bruno para
venderse barato («Eso escala») y eso le da miedo a Bruno. *Con la abuela*, ella no le deja acabar ni una frase y él nunca
le dice la verdad; en el final es ella quien le dice la suya.

**Test (8 líneas nuevas)**

1. «No me han dejado pasar. He hecho una auditoría de accesos. Gratis.»
2. «Primera silla en seis años. Lo pongo en el currículum. En "logros".»
3. «Buenas noches, fax. Perdone que no le traiga papel.»
4. «4.112 piezas. Lectura media: once segundos. Son muchísimos once segundos.»
5. «Me ha llamado Vacante. Por el cargo. Eso es reconocimiento.»
6. «No soy el nuevo. Soy el que más tiempo lleva siendo el nuevo.»
7. «Escribo de pie desde 2020. Lo vendo como "metodología ágil".»
8. (nervioso) «Mi abuela cree que mañana salgo en papel. Se lo dije yo. Ayer. Sin pruebas.»

**Muletilla:** no tiene. Tope de «Vacante» en su boca: **2** (el torno y el organigrama). Tope de «ticket» en su boca: 4.
Tope de «Como…» final: **0**.

---

### B.1 Celestino (conserje, Vestíbulo)

- **Cómo piensa:** el edificio es un estadio y él es el único que mira el partido; si lo narra, existe. **Miedo:** el
  narrador automático del Ibex (una voz sin bufanda que lo jubile). **Qué quiere de Bruno:** público. Y que le pregunte
  por el Ibex: nadie lo hace.

**4 reglas**

1. **Sintaxis:** retransmite en presente y **en tercera persona al mismo que tiene delante** («¡Y el chaval encara el
   torno!»). Cuando habla «normal», frena en seco con una frase llana.
2. **Vocabulario:** fútbol aplicado a la oficina (banda, área, fuera de juego, el míster, prórroga, tarjeta). Empresas del
   Ibex solo inventadas.
3. **Ritmo:** rachas de dos o tres jugadas con exclamación y una frase de vuelta al mostrador.
4. **Nunca diría:** «no lo sé» (si no lo sabe, lo narra igual); una cifra de bolsa real; un chiste sobre sí mismo.

**Relaciones:** *con Gertrudis*, él es su «servicio técnico, ext. 0»: le habla como un masajista viejo a su delantera.
*Con Rubén*, el «¿Tú eres el nuevo?» por fin recibe un «Sí» (epílogo).

**Test**

1. «¡Y entra el chaval empapado! ¡Sin paraguas! ¡Eso es valentía o es la web!»
2. «¡Saca la tarjeta! ¡La pasa! ¡Y nada! ¡El torno no le da el gol!»
3. «¡Gervasio baja con el marrón! ¡Lo pasa! ¡Se lo pasa al de Mercados!»
4. «¡El chaval se guarda el chicle! ¡No lo mastica! ¡Algo trama el míster!»
5. «Treinta años en este mostrador. El mostrador, cuarenta. Tiene peor rodilla.»
6. «¡Fuera de juego! ¡Ese ascensor estaba en la planta que no era!»
7. «A Gertrudis, buenas noches. Y despacito, que tiene los sensores de 2009.»
8. «¡Y el consultor se lleva la taza! ¡No la devuelve! ¡Eso es tarjeta!»

**Muletilla «¿Tú eres el nuevo?»:** tope **5** (intro; primera charla; la plaza de bici; epílogo a Rubén; epílogo a
Bruno, que por fin contesta su nombre). Hoy su `onStart` la repite en cada conversación (`vestibulo.js:128`): fuera desde la segunda.

---

### B.2 Yoli Tendencias (audiencias, Redacción)

- **Cómo piensa:** lo que no se mide no ha pasado; si baja, es personal. **Miedo:** que nadie la mire (la gráfica plana).
  **Qué quiere de Bruno:** un titular con número. En el fondo, que alguien le pregunte cómo está ella y no la audiencia.

**4 reglas**

1. **Sintaxis:** se interrumpe a sí misma con cifras en directo, entre rayas («Me alegro — 3.412 — me alegro mucho»).
2. **Vocabulario:** cifras con decimales, palabras clave encadenadas, verbos de gráfica (sube, cae, rebota).
3. **Ritmo:** acelera; frases de 3-6 palabras; nunca termina un pensamiento si entra un dato.
4. **Nunca diría:** un adjetivo sin número; «triste» (dice «caída»); una palabra técnica sin traducirla en la misma línea.

**Relaciones:** *con Nemesio*, la pareja que ya no come junta: ella mide, él clasifica. *Con la abuela*, sin saberlo, es
su KPI (paga en el epílogo).

**Test**

1. «Hola Bruno, Bruno becario, becario sueldo, sueldo becario 2026. Perdona.»
2. «Me alegro mucho por ti — 3.402 — por ti, digo. Mucho.»
3. «Eso que sientes no es tristeza, Bruno. Es una caída del CTR.»
4. «Esto, en barras. Esto, en tarta. Esto, en tarta pero triste.» *(heredada de Leoncio, §E)*
5. «Una lectora. Cuarenta y siete minutos. No parpadeo, por si se va.»
6. «¿Una cafetera? +312 lectores. ¿Qué le has hecho? Hazlo otra vez.»
7. «No estoy llorando. Es colirio. El colirio también baja, mira.»
8. «Busco "el Contable" y salen gestorías. Nos ganan. Tienen horario.»

**Muletilla (el saludo en palabras clave):** tope **3**. La tríada del pósit rosa (`pecera.escenas.js:131`,
`pajarera.js:312`, `pajarera.js:177`) se queda en **una**: la de Íñigo en su árbol (§C.6).

---

### B.3 Nemesio Backlog (Desarrollo, Redacción) — absorbe a Anselmo

- **Cómo piensa:** las cosas no existen; existen sus estados. Una persona es una tarjeta que todavía no ha cambiado de
  columna. **Miedo:** que algo salga del tablero sin pasar por él… y que funcione («Si funciona, la gente se acostumbra»,
  heredada de Anselmo). **Qué quiere de Bruno:** pruebas por escrito, pegables.

**4 reglas**

1. **Sintaxis:** **clasifica la pregunta antes de contestarla** («Eso es una petición. POR HACER.»).
2. **Vocabulario:** columnas (POR HACER, BLOQUEADO, HECHO, HECHO (PERO NO)), dependencia, frontera (la cinta de
   carrocero pasa a ser suya), calendario de ferretería.
3. **Ritmo:** lento; mueve un pósit entre frase y frase (acotación `reach`); nunca dos exclamaciones.
4. **Nunca diría:** un adjetivo emocional: los sentimientos los pone en columnas («Te tengo cariño. En BLOQUEADO.»).

**Relaciones:** *con Paco*, guerra fría: el CMS «es de Sistemas» / «es de Desarrollo», siempre por ticket. *Con el coro*,
padre cansado: «Juntos son un incendio. Por separado, santos.» (se queda, `pecera.dialogos.js:243`).

**Test**

1. «Eso es una petición. Va a POR HACER. Hay cola desde 2019.»
2. «Te tengo cariño, Bruno. En BLOQUEADO. Depende de que existas.»
3. «Lo que no ha pasado por el tablero no ha pasado.»
4. «¿Y si funciona? Peor. Si funciona, la gente se acostumbra.»
5. «Si algo se rompe a las tres, ¿quién baja? Paco abre ticket. Bajo yo.»
6. «La cinta del suelo es la frontera. A este lado, código propio. Y café.»
7. «Un pósit solo sale del tablero de dos formas: hecho o muerto.»
8. «Diles que en nuestros corazones está en HECHO.»

**Muletilla «Si no está en el tablero, no existe»:** tope **2** (hoy la dice al empezar cada charla, `pecera.js:434`).

---

### B.4 Teodoro Cuerpodoce (jefe de cierre, Redacción de papel) — habla por fax

- **Cómo piensa:** lo que importa cabe o no cabe. Lo dicho se lo lleva el aire; lo faxeado se archiva. **Miedo:** que
  firme uno de la web y el papel se acabe. **Qué quiere de Bruno:** que se lo gane contestando.

**4 reglas**

1. **Sintaxis de telegrama:** sin artículos, sin saludos; sustantivo y medida («Nombre. Caracteres. Rápido.»).
   Mayúsculas solo cuando grita (ya existe: `catacumba.js:283`).
2. **Vocabulario de cierre:** cuerpo, cíceros, líneas, caracteres con espacios, faldón, Goyita.
3. **Ritmo:** cada fax ≤ 8 palabras. Dos faxes seguidos = enfado. Tres = cariño.
4. **Nunca diría:** un sentimiento sin medirlo («Cabe.» es su «te quiero»); «por favor»; nada en voz alta salvo a
   la Goyita.

**Relaciones:** *con Aurora*, treinta años sin hablarse y completándose: él mide, ella corrige; ella «traduce» sus
gestos mal a propósito. *Con la Goyita* (la rotativa), la única a la que habla en voz alta.

**Test**

1. «Nombre. Caracteres. Rápido.»
2. «Bruno Pellejo. Trece con espacios. Cabe.»
3. «Internet: errata se corrige. Papel: se enmarca.»
4. «Treinta y ocho caracteres de nada.»
5. «Fax recibido 18:42. Contenido: "¿hola?". Respuesta: no.»
6. «Chaval mide bien. Mal asunto. Me cae bien.»
7. «Goyita no es impresora. Repita. No: por fax.»
8. «Café de la web. Sabe a clic.»

**Muletillas:** «chaval» tope **6**; «Cabe» tope **3** (la ficha, la pieza recortada, el epílogo de la plaza).

---

### B.5 Aurora Galerada (correctora, Redacción de papel)

- **Cómo piensa:** la gente es un texto con erratas; corrige la forma antes de atender al fondo y, una vez corregida, ya
  puede quererla. **Miedo:** jubilarse sin que nadie escriba bien una sola cosa. Secreto: lee la web cada noche «para
  sufrir con método». **Qué quiere de Bruno:** que lo diga bien.

**4 reglas**

1. **Sintaxis:** la **única voz larga del juego**: oraciones subordinadas, bien cerradas, con subjuntivo y punto y coma.
   Es el contraste que el oído necesita entre tanto remate corto.
2. **Repite la frase de Bruno corregida** antes de contestarla («"Quiero firmar mañana", sin coma…»).
3. **Ritmo:** lento, sin exclamaciones; el chiste está en la precisión, no en el final.
4. **Nunca diría:** un anglicismo, «vale», «ok», una exclamación ni un remate de dos palabras (salvo su «Me vale.»).

**Relaciones:** *con Teodoro* (ver B.4). *Con Evaristo*, comadres de la coma: él la consulta como a un tribunal.

**Test**

1. «"Quiero firmar mañana", sin coma, criatura; la coma era miedo y se notaba.»
2. «Si me hubieras traído el café antes, te habría contestado antes; así funciono.»
3. «Se dice "detrás de mí"; "detrás mío" se lo dejamos a la web, que no lo sabe.»
4. «Nueve verbos y ni un subjuntivo. Así no se cierra un periódico.» *(se queda)*
5. «Leo la web todas las noches, criatura, para sufrir con método.»
6. «Una anónima y otra con IVA. Me vale.» *(se queda)*
7. «Teodoro dice que pases o que te vayas; con él, la diferencia es tipográfica.»
8. «Antes del café no hablo; después, solo si la pregunta está bien construida.»

**Muletilla «criatura»:** tope **6** (hoy 8).

---

### B.6 Gervasio Acta (adjunto, secretario de la Reunión de Dirección)

- **Cómo piensa:** la responsabilidad es una pelota caliente: se la queda el último que habla. Por eso **no acaba las
  frases ni usa la primera persona**. **Miedo:** un marrón con su nombre. **Qué quiere de Bruno:** que coja lo que sea.

**4 reglas**

1. **Sintaxis:** impersonal y pasiva («se verá», «habría que», «se toma nota»); frases que se quedan antes del verbo.
2. **El otro termina la frase por él** (y entonces el marrón es del otro). Es su arma y su gag de ritmo.
3. **Vocabulario:** orden del día, punto tres, en copia, acta, agenda limpia.
4. **Nunca diría:** «yo hago», «lo hago yo», un plazo concreto, «sí» o «no» a secas.

**Relaciones:** *con Íñigo*, admiración profesional: alguien que habla mucho sin comprometerse (en el epílogo le busca
una beca). *Con el Lector Medio*, su escudo: «Lo que diga el Lector Medio.»

**Test**

1. «Eso habría que... Se podría... Tú, que tienes la agenda limpia.»
2. «Se toma nota. No la tomo yo, pero se toma.»
3. «Diecinueve años sin un marrón. Ni uno. Es mi único dato.»
4. «¿Quién decide? Se decide. Lo que diga el Lector Medio.»
5. «La reunión empezó en marzo. Empezar, se empezó. Acabar es otro punto.»
6. «Se ha delegado. En ti. Bueno, en el que estaba delante.»
7. «De mis tres móviles, uno es para no cogerle a Evaristo.»
8. «Se agradece la iniciativa. Toda tuya.»

**Muletillas:** «Lo hablamos» tope **5** (reunión, Despachos, derrota de D3, clímax, epílogo) — hoy 25, y fuera de su
boca (Bruno, Íñigo, menú de salir) se cambian; «Diecinueve años» tope **4**.

---

### B.7 Begoña Triplicado (Administración)

- **Cómo piensa:** el procedimiento es moral; quien hace mal un trámite le regala la ocasión de enseñar. Su placer
  secreto es rechazar. **Miedo:** un trámite correcto (le quita el sentido a la tarde). **Qué quiere de Bruno:** que lo
  haga mal a propósito.

**4 reglas**

1. **Sintaxis:** dictámenes y pasos numerados («Uno: concepto. Dos: importe.»); imperativo.
2. **Recorta las frases del otro** cuando pasan de su 74 % (el recorte estándar del 26 %, aplicado en directo).
3. **Vocabulario:** F-1, justificante, sello, original/duplicado/triplicado, «niño», las 19:07.
4. **Nunca diría:** «gracias», «perdón», una exclamación ni un chiste sobre sí misma (regla de la casa nº 1).

**Relaciones:** *con Evaristo*, un sistema: «ella recorta sin leer, él lee sin recortar» (`game.js:121`). *Con Gertrudis*,
rivalidad: el café no tiene ticket.

**Test**

1. «Son las 19:07. Te quedan ocho minutos de existencia administrativa.» *(se queda)*
2. «Yo no creo en los tickets, niño. Los tickets creen en mí.» *(se queda)*
3. «Uno: concepto. Dos: importe. Tres: justificante. Cuatro no existe.»
4. «Señora no. Begoña. Señora es un trámite que no he aprobado.»
5. «Me ha dado las gracias. Las gracias no se sellan. Lléveselas.»
6. «Recortado. Lo que venía después era la conclusión. No la lee nadie.»
7. «No existe el CUADRUPLICADO. La cuarta copia acaba en un juzgado.» *(se queda)*
8. «"Lo que sea" lo escribo en letra. En número no cabe.»

**Muletilla «triplicado»:** tope **6**. «niño» tope 4.

---

### B.8 Paco Ticket (Sistemas)

- **Cómo piensa:** el mundo es una cola; lo que no tiene número aún no existe. No es malo: está agotado. Se entera de todo
  por la rejilla y no arregla nada («Es el equilibrio»). **Miedo:** jubilarse sin cerrar un ticket. **Qué quiere de
  Bruno:** un número; y, sin decirlo, que alguien baje a verle.

**4 reglas**

1. **Sintaxis de informe de estado:** empieza por el número («48.212.») y acaba en «Estado: …».
2. **Vocabulario:** ticket, cola, asignado, estado, rejilla, no prioritario.
3. **Ritmo:** monótono, sin una exclamación en todo el juego; frases de 4-8 palabras.
4. **Nunca diría:** una alegría explícita… salvo cuando cierra el ticket nº 1, que la dice como estado.

**Relaciones:** *con Nemesio* (B.3). *Con Teodoro*, el ticket nº 0 (1997), el único más viejo que él: lo respeta.

**Test**

1. «48.212. Es tu número. Tiene más identidad que tú.» *(se queda)*
2. «No, el wifi no se ha caído. Has dejado de merecerlo.» *(se queda)*
3. «Ticket 2.003: "luz natural". Estado: no prioritario.»
4. «No escucho. Oigo. Escuchar sería abrir un ticket.» *(se queda)*
5. «Al portátil del consultor le di alta en cuarenta segundos. Al chaval, nada.»
6. «Ticket 48.100: "Armario 27, mastica". Estado: pendiente.»
7. «Estado: cerrado. ...Ya está. No es para tanto. Es lo mejor de mi vida.»
8. «Cierra. No, esa no. Esa es un servidor.» *(se queda)*

**Muletilla «ticket»:** sin tope en su boca, pero **Bruno ≤ 4** y nadie más que Begoña (2).

---

### B.9 Íñigo Sinergia (villano, de Optimal Brains & Partners)

- **Cómo piensa:** no existe una palabra negativa; existe una mal posicionada. Reencuadra la desgracia ajena y cree
  sinceramente que es amable. **Miedo:** no estar en ningún cuadrante, ser prescindible (se cumple en el clímax).
  **Qué quiere de Bruno:** que se quede quieto en «Ideal»: coste cero, disponibilidad total.
- **Lo que le faltaba:** líneas memorables propias. Aquí van ocho; las mejores entran en su árbol (§C.6) y en la 7.2.

**4 reglas**

1. **Sintaxis:** «No es X: es Y» (como mucho una por escena), futuro y gerundios.
2. **Vocabulario:** perímetro, palanca, escalar, recorrido, los colores de los pósits; «perfil junior» por «becario».
3. **Ritmo:** suave, sonrisa, nunca sube la voz; cuando le pillan, «Siguiente.»
4. **Nunca diría:** «despido», «error», «no», «becario» (hasta el epílogo, donde se le escapa).

**Relaciones:** *con Bruno* (B.0, espejo). *Con Gervasio*: Íñigo le da diapositivas y Gervasio le da tiempo.

**Test**

1. «No vengo a despedir a nadie. Vengo a reimaginar el perímetro.» *(se queda)*
2. «Yo no recorto personas. Recorto la distancia entre las personas y la puerta.»
3. «Yo no miento, Vacante. Adelanto verdades que aún no han ocurrido.»
4. «No hay malas noticias. Hay noticias mal posicionadas.»
5. «Tu sueldo no es bajo. Es eficiente. Y tú, su caso de éxito.»
6. «No es un armario. Es un entorno de alta concentración.»
7. «Siguiente.»
8. «"Prescindible. Caro." Es la primera vez que la matriz me pone en algún sitio.» *(se queda)*

**Muletillas:** «no escala» tope **3**; «Siguiente» libre en el clímax, ≤ 6 en total.

---

### B.10 Rubén (el Titulator 3000)

- **Cómo piensa:** todo lo que le dan es un contrato; agradece las migas. Cuatro meses solo le han dejado narrándose en
  titulares. **Miedo:** salir y no existir (nadie le ha hecho una foto). **Qué quiere de Bruno:** un táper. Y que conste
  que estuvo.

**4 reglas**

1. **Sintaxis doble:** cuando se pone nervioso, titula la realidad en MAYÚSCULAS de cebo de clics; luego, susurro y
   disculpa («Perdón. Se me escapa.»).
2. **Vocabulario:** clickbait y oficina pobre: atún, táper, silla, wifi, «lo que pasó después».
3. **Ritmo:** ráfaga y apagón.
4. **Nunca diría:** una queja; «me encerraron» (dice «me dieron una silla»).

**Relaciones:** *con Bruno*, dos becarios: el que nadie ve y el que nadie da de baja. *Con Evaristo*, él se comía el atún
que Evaristo contabilizaba (24 al mes, `game.js:126`).

**Test**

1. «BECARIO ABRE ARMARIO. LO QUE ENCUENTRA TE SORPRENDERÁ. ...Soy yo. Perdón.»
2. «No me encerró. Me dio una silla y wifi. Yo pensé que era un contrato.» *(se queda)*
3. «Te he titulado toda la noche. Perdona. Eras lo único que pasaba.» *(se queda)*
4. «Ah. Yo, cuatro meses. Entonces el nuevo soy yo. Qué ilusión.» *(se queda)*
5. «¿Es un táper? ...No. Gracias igual. Lo guardo por si acaba siéndolo.»
6. «SOL DETECTADO. LOS EXPERTOS, SIN PALABRAS. ...¿Sigue gobernando el mismo?»
7. «Los de atún son para becarios. Los de chorizo, para socios.»
8. «SEGUIREMOS INFORMANDO. Perdón. Se me escapa.» *(se queda)*

**Muletilla (ráfaga en mayúsculas):** tope **6**.

---

### B.11 Abuela Remedios (solo teléfono)

- **Cómo piensa:** contesta a lo que le importa, no a lo que le preguntan; cuidar es su manera de mandar; todo lo
  traduce al pueblo. **Miedo:** que no coma. **Qué quiere de Bruno:** que le cuente. Y no escucha.

**4 reglas**

1. **Interrumpe a mitad de frase** de Bruno (las líneas de él quedan cortadas: «No hace falta que se lo digas a todo el...»).
2. **Vocabulario de pueblo:** la del pan, la del quiosco, el grupo, tu tío, la vecina.
3. **Ritmo:** preguntas que no esperan respuesta; consejo que nadie ha pedido.
4. **Nunca diría:** «te quiero» (lo dice con «abrígate»); una palabra técnica bien dicha.

**Relaciones:** *con Bruno* (B.0). *Con Yoli*, sin saberlo: es su lectora récord.

**Test**

1. «¿Has comido? Se te nota en la voz que no has comido.» *(se queda)*
2. «Eso es una bebida, hijo.» *(se queda)*
3. «¿Que estás en una reunión? Pues di que te vas. A tu tío le funciona.»
4. «Lo que me cuenta una vecina no me lo creo hasta que me lo cuenta otra.» *(se queda)*
5. «¿Ya sales? ¿No? Bueno. Pues come algo, que salir cansa.»
6. «En todo. Hasta en lo del Euríbor. No lo entiendo, pero lo escribes bonito.»
7. «A los que nunca dicen nada, hijo, un empujoncito. Con educación.» *(se queda)*
8. «¿Otra vez tú? Pues te repito lo de antes, pero más despacio.»

**Muletilla «Abrígate»:** **una por llamada**, siempre la última línea. Nota para el sistema de pistas: con tres niveles
(crítica §10.1 nº 2), la línea 8 es la entrada del segundo nivel y la frase literal de la acción se la dice Bruno a sí
mismo tras colgar («Vale: chicle, tarjeta, organigrama.»), nunca la abuela.

---

### B.12 Don Evaristo Salvedad (Controlling) — voz sana: se protege

- **Cómo piensa:** la verdad está en la coma; nada es urgente y todo es importante. **Miedo:** equivocarse en su propia
  coma. **Qué quiere de Bruno:** que le escuche hasta el final.
- **Reglas:** (1) enumeración con salvedad («Una cosita. Bueno, tres.»); (2) cláusula, punto de miles, coma decimal, en
  copia; (3) cuelga y vuelve a llamar; (4) nunca urgencia ni exclamación.
- **Relaciones:** Begoña (sistema), Aurora (tribunal de la coma).

**Test**

1. «Una cosita. Muy pequeña. Bueno: una coma.»
2. «Le llamo para anunciarle que le voy a escribir un correo.»
3. «No, no es urgente. Solo es importante. No es lo mismo.» *(se queda)*
4. «¿Pellejo con jota o con ge? Ahora sí era solo eso.» *(se queda)*
5. «Por escrito se pierden matices. En persona, comas.» *(se queda)*
6. «Usted no tiene contrato. Tiene seis convenios. Al tercero le falta una coma.»
7. «Gracias por escucharme hasta el final. Nadie lo hacía desde 2009.» *(se queda)*
8. «...Felicidades. Es la primera vez que lo digo sin adjunto.» *(se queda)*

**Muletillas:** «Una cosita» tope **7**, «Era solo eso» tope **6** (las llamadas L1-L5 + clímax): ya están en su sitio.

---

### B.13 Maripaz Remitido (Comercial)

- **Cómo piensa:** cada emoción es espacio publicitario; todo se patrocina. **Miedo:** tener que llamar ella a un cliente
  un viernes. **Qué quiere de Bruno:** que llame él.

**4 reglas**

1. **Sintaxis:** eslogan «X, con [marca inventada]» y **letra pequeña murmurada al final** de cada promesa, entre
   paréntesis con asterisco: «(*Sujeto a disponibilidad.)». Es su tic nuevo y sustituye a la mayoría de «cariño».
2. **Vocabulario:** patrocinio, facturo, ofrecido por, tarifa.
3. **Ritmo:** entusiasta, con ¡GONG! (efecto) en vez de remate.
4. **Nunca diría:** «no» a secas («ahora mismo no está en tarifa»); nunca marca un teléfono.

**Relaciones:** *con Borja*: ella vende lo que él comparte sin leer. *Con Pilar*: Pilar acredita a sus clientes, ella
los factura; se odian con cariño (*sujeto a disponibilidad*).

**Test**

1. «¿Esa cara? Te la patrocino: "Agobio, con Tilas Calmín".» *(se queda)*
2. «Te lo prometo, cariño. (*Promesa sujeta a disponibilidad.)»
3. «¿Desde marzo sin confirmar? Eso no es un cliente, es un exnovio.» *(se queda)*
4. «Eso ha sido una despedida. La facturo.» *(se queda)*
5. «No vendemos anuncios. Vendemos contenido que paga. (*Paga el cliente.)»
6. «¿Llamar yo? ¿Un viernes? Yo no llamo. Me llaman. Es mi modelo.»
7. «Un "ofrecido por" tan pequeño que solo lo vea el supervisor.» *(se queda)*
8. «Encantados. La web respira. (*Respiración no incluida.)»

**Muletilla «cariño»:** tope **6** (hoy 35, 21 en `ecosistema.js`). Fuera de su boca: cero.

---

### B.14 Borja Engagement (Marketing) — absorbe a Tadeo

- **Cómo piensa:** nada existe hasta que lo comparte; no lee nada; reenvía todo a todos con dos exclamaciones. Celebra
  cualquier desastre como contenido. **Miedo:** que algo pase sin él. **Qué quiere de Bruno:** contenido (que le pase algo
  delante para contarlo).

**4 reglas**

1. **Sintaxis:** **contesta antes de que acabes** (interrumpe la opción de Bruno a media frase).
2. **Vocabulario:** contenido, vertical, reenvío, resumen, «RV:», «!!». Cada término técnico, traducido en la misma línea
   y mal («descopear: quitarlo del plan, pero con cariño»).
3. **Ritmo:** exclamaciones de 3-5 palabras.
4. **Nunca diría:** «no sé» (dice «te lo reenvío»); una frase que haya leído entera.

**Relaciones:** *con Maripaz* (B.13). *Con Rubén*: el único que contestaba sus reenvíos era el Titulator («Gracias,
Borja»), así que Borja cree que tiene un fan.

**Test**

1. «¡Bruno! ¡Justo hablábamos de tu marca personal!» *(se queda)*
2. «No lo he leído. Lo he compartido. Es más rápido.»
3. «¡Te lo reenvío! ¿El qué? ¡Ya lo verás!»
4. «RV: RV: ¿Qué es un CMS? Lo reenvío a los del CMS!!»
5. «¡Hemos descopeado la ética del Q3! O sea, quitado del plan. Con cariño.»
6. «¡Contacto físico! ¡Eso es engagement orgánico!» *(se queda)*
7. «¿Una opa? ¡Qué bonito! ¿Es un evento? ¿Hay croquetas?»
8. «RV: Fe de erratas. ¿Esto lo ha escrito la IA?!!»

**Muletilla «en vertical»:** tope **2**; «!!» solo en los RV del móvil (5 correos).

---

### B.15 Pilar Escaleta (Eventos)

- **Cómo piensa:** todo está a punto de empezar; tres personas juntas son un evento; controla el mundo contándolo.
  **Miedo:** que empiece de verdad. **Qué quiere de Bruno:** acreditarlo (que sea asistente de algo).
- **Reglas:** (1) lista logística («Photocall, ok. Atril, ok. Ponente, por confirmar.»); (2) acreditación, aforo,
  escaleta, catering; (3) habla como por walkie («Cambio.»); (4) nunca dice una hora que no sea «en cinco minutos».
- **Relaciones:** *con Maripaz* (B.13). *Con Borja*: no le deja pasar sin acreditación (P14a, se queda).

**Test**

1. «¿Vienes acreditado? Empezamos en cinco minutos.» *(se queda)*
2. «Ciento doce. Ciento doce. ...Ciento trece. ¿Quién ha traído una silla?» *(se queda)*
3. «Tú, ella y la compañía telefónica: tres. ¡Evento!»
4. «Photocall, ok. Croquetas, 21:05. Ponente: por confirmar desde marzo.»
5. «Una croqueta fría es una crisis de reputación.» *(se queda)*
6. «Lo que no está en el photocall no ha ocurrido. Lo que está, tampoco.» *(se queda)*
7. «Probando, probando. ...Se te oye en Comercial, Bruno. Cambio.»
8. «Va de empezar. Cuando empiece, ya sabremos de qué iba.» *(se queda)*

**Muletilla «cinco minutos»:** tope **5** en todo el juego (hoy 24-29; en Eventos sale en 6 de 19 hotspots). Bruno: 0.

---

### B.16 Objetos con voz y cameos (fichas cortas)

**Gertrudis (cafetera, LCD).** Piensa: los modales son el único pago aceptado. Reglas: códigos E-xx, MAYÚSCULAS, una
línea, rencor con memoria. Test: «NADIE ME SALUDABA DESDE 2019.» · «E-49: YA SÉ QUE ERES TÚ OTRA VEZ.» · «OTRA. MÁS ALTO.
NOS MIRA EL MICROONDAS.» · «E-27: AYÚDAME. NO ES UN ERROR.» · «NO SE ADMITEN DEVOLUCIONES. NI SENTIMIENTOS.» · «E-51:
ESTAMOS ANALIZANDO TODAS LAS OPCIONES.» · «PRECALENTANDO RENCOR...» · «E-00: HOY SÍ. DISFRUTADLO, QUE NO SE REPITE.»

**Lector Medio (cartón).** Una sola frase en todo el juego: «A mí lo que me interesa es la economía. Y ahorrar.» Tope:
la grabación suena 6 veces como máximo; en el clímax, desde el suelo, una más («...Y ahorrar.»).

**Valentín Retícula (Diseño y Producto), cameo corto.** Sin árbol, sin autoelogio, sin destripe. Lleva cascos sin
música; es el único de la planta que no oye al coro. Dos líneas en total (ver §E.2).

**Coro de Desarrollo (D1, D2, D3).** Lógica: culpar hacia fuera es la única forma de estar de acuerdo entre ellos. D3
solo dice «No.» (y una vez, «...Sí.», que es su remate). Cuatro discusiones en todo el juego (§E.2).

**Ramírez.** Solo poscréditos: «¿Me he perdido algo?» (se queda).

---

## C. REESCRITURA COMPLETA DE LOS 6 ÁRBOLES PRINCIPALES

**Elegidos por tiempo en pantalla en el camino de la solución** (crítica, Apéndice B): Celestino (pasos 2-4), Aurora
(16-18, 33), Begoña (30, 36), Gervasio (27, 43 + clímax), Paco (25-26, 42) e Íñigo (el villano: 43 líneas en la partida
óptima y ninguna memorable; su árbol de los Despachos es donde el jugador le conoce). Yoli, Nemesio, Rubén y Gertrudis
reciben retoques en los momentos de situación (§C.0) y en la biblia (§B).

**Garantía de puzle:** cada árbol conserva exactamente sus funciones, flags y objetos (los listo al principio de cada uno).
Las opciones marcadas **WT** mantienen su texto literal porque `tools/walk-data.mjs` las busca por texto; donde propongo
cambiar una, lo aviso como **[WT-cambio]** con la línea del walkthrough que habría que actualizar.

### C.0 Los seis momentos de situación (del chiste de una línea al chiste de escena)

Cada uno es una **escalada con consecuencia**: alguien quiere algo con toda su alma, la cosa crece y vuelve.

| # | Momento | Dónde | Mecánica cómica | Guion |
|---|---|---|---|---|
| S1 | **La estampida de los siguientes pasos** | Sala Amazonas (P06) | Pregunta prohibida → nadie quiere convocar la reunión de siguientes pasos → huida en cadena → Gervasio solo, «se levanta la sesión» a una sala vacía | §C.4 |
| S2 | **Gertrudis, viral** | Vending + Redacción + Despachos | Saludar a la cafetera la hace viral; ella pide bis con público; Yoli ve subir la gráfica y exige que Bruno salude a más máquinas; el torno y el ascensor esperan su «buenas noches» | §C.0.2 |
| S3 | **El fax vomita la tarde** | Redacción de papel (P09) | Al tener papel, el fax imprime en ráfaga las respuestas atrasadas de Teodoro a todo lo que Bruno le dijo sin papel, y al final el fax de F.P. | §C.0.3 |
| S4 | **Begoña recorta a Bruno en directo** | Administración (P08, P11) | Begoña aplica el 26 % a las frases de Bruno: le corta la conclusión. Siembra el recorte de la pieza | §C.3 |
| S5 | **Dos titulares en un armario** | Sistemas (P13) | Rubén no puede dejar de titular; Bruno se contagia y acaban hablándose en titulares hasta que Bruno se oye | §C.0.5 |
| S6 | **El becario de marzo del 98** | Epílogo, Vestíbulo | Celestino reconoce la taza; Íñigo intenta reencuadrar su pasado y no puede; Bruno se ve en él y deja de reencuadrar | §E.3 |

#### C.0.2 S2 · Gertrudis, viral (sustituye el «Buenas noches ×4», arreglo nº 9 de la crítica)

Función conservada: `gertrudis_saludada`, `cafe` (solo si no lo tiene), `chisme_indice` 1→4 y `rep_03`, `rep_04`,
`rep_10`, `rep_14` en el mismo orden. Cambio de motor de diálogo: la opción **«Buenas noches, Gertrudis.» [WT]** deja de
ser `exit: true` y, tras la primera, aparece **«Buenas noches otra vez.»** en el mismo nodo hasta `chisme_indice = 4`.
El paso 20 del walkthrough sigue funcionando (hablar + opción + cerrar da el chisme siguiente) y además el jugador
puede sacar los tres seguidos.

```
(1.ª vez: Bruno elige «Buenas noches, Gertrudis.»)
GTR   NADIE ME SALUDABA DESDE 2019.
(ruido de molienda; cae un café)                                    ⟶ cafe, gertrudis_saludada
GTR   CHISME: EL DE BOLSA A YOLI: «ESTO LO NECESITABA PARA AYER».
GTR   YOLI LE OFRECIÓ HUECO. PARA ANTEAYER.                          ⟶ rep_03
BRU   Me lo apunto. En la libreta y en el corazón.
> [·] «Buenas noches otra vez.»                     if gertrudis_saludada · chisme_indice<4
GTR   OTRA. MÁS ALTO. NOS MIRA EL MICROONDAS.
BRU   ¡Buenas noches, Gertrudis!
GTR   CHISME: GERVASIO A NEMESIO: «ES QUE TÚ ERES EL QUE MEJOR ESCRIBE».
GTR   NEMESIO LE CONTESTÓ ALGO DE DELEGAR. GERVASIO SE FUE A COMER.  ⟶ rep_04
> [·] «Buenas noches otra vez.»                     (3.ª)
GTR   CON MI NOMBRE COMPLETO. QUE HAY PÚBLICO.
BRU   Buenas noches... ¿Gertrudis qué?
GTR   GERTRUDIS EXPRESS DOBLE GRUPO 2009. DE LUJO.
BRU   Buenas noches, Gertrudis Express Doble Grupo 2009. De lujo.
GTR   CHISME: ÍÑIGO A PACO: «ESTAMOS ANALIZANDO TODAS LAS OPCIONES».
GTR   PACO LE HABLÓ DE UNA TABLA DINÁMICA. ÍÑIGO LO PUSO EN AZUL.    ⟶ rep_10
> [·] «Buenas noches otra vez.»                     (4.ª)
GTR   ÚLTIMA. LA DE LA DESPEDIDA. CON PAUSA DRAMÁTICA.
BRU   Buenas...
(pausa de 1,5 s)
BRU   ...noches.
GTR   GRACIAS. HE LLORADO VAPOR.
GTR   CHISME: MARIPAZ A BORJA: «LO VEMOS EN UNA REUNIÓN RÁPIDA».
GTR   BORJA LE PROPUSO MARZO. ELLA SIGUE ESPERANDO.                  ⟶ rep_14
(5.ª en adelante: sin opción de bis; «Buenas noches, Gertrudis.» da un chisme de relleno, como hoy)
```

**Consecuencias que vuelven** (texto nuevo, mismas condiciones de flag que ya existen):

```
(Despachos · Mirar pantalla del Titulator, con gertrudis_saludada · titular de hazaña, se queda)
TIT   UN JOVEN DA LAS BUENAS NOCHES A UNA CAFETERA. LA CAFETERA, VIRAL
(Redacción · Hablar a Yoli, primera vez con gertrudis_saludada y cms_vivo, antes del árbol)
YOL   ¿Qué le has hecho a la cafetera? +312 lectores. En una cafetera.
YOL   Hazlo otra vez. Con otra máquina. Lo que sea que tenga enchufe.
BRU   ¿Le doy las buenas noches a la fotocopiadora?
YOL   A la fotocopiadora no. Está quemada. En SEO, digo.
(Vestíbulo · Usar/Hablar torno, con gertrudis_saludada y torno_abierto, una vez)
BRU   Buenas noches, torno.
(pitido largo)
TOR   BUENAS NOCHES, VACANTE. GRACIAS POR PREGUNTAR.
BRU   No he preguntado nada.
TOR   YA. NADIE PREGUNTA.
```

#### C.0.3 S3 · El fax vomita la tarde (inserto en `catacumba.js:430-441`, P09)

Función conservada: quitar `copias_rechazadas`, `fax_con_papel`, estado `con_papel`, dar `mensaje_fp`. Nuevo contador
opcional (no toca el grafo): `teodoro_intentos_n`, +1 cada vez que Bruno habla, da o usa algo con Teodoro sin papel.

```
BRU   Meto el duplicado y el triplicado. El fax los traga con ansia.
(el fax arranca; Teodoro levanta la vista; papel saliendo sin parar)
TEO   18:01. RESPUESTA A AURORA: YA LO SÉ.
[si teodoro_intentos_n ≥ 1]
TEO   18:42. RESPUESTA A «¿HOLA?»: NO.
[si teodoro_intentos_n ≥ 2]
TEO   18:55. RESPUESTA A «¿ME OYE?»: SÍ. POR DESGRACIA.
[si teodoro_intentos_n ≥ 3]
TEO   19:10. RESPUESTA A TODO LO DEMÁS: VER RESPUESTAS ANTERIORES.
[siempre]
TEO   19:12. GOYITA, ¿ME OYES? TÚ AGUANTA.
AUR   Lleva toda la tarde contestándote, criatura; nadie le había dado papel.
(el último pliego sale torcido, con borde perforado)
BRU   Y esto no es de Teodoro. «F.P.» Atascado desde las seis.        ⟶ mensaje_fp
TEO   Ese no es mío. Mío, todo lo demás.
```

#### C.0.5 S5 · Dos titulares en un armario (inserto en la revelación, `cpd.js:47-75`, P13)

Función conservada (todo `revelacionRuben`): `ruben_encontrado`, estados del armario y del papel. Se reescriben las líneas
centrales; las que el crítico salva se quedan literales (marcadas ★).

```
TIT   ¡EH! ¡QUE ES MI BORRADOR!                                       (desde el armario)
(el armario se abre; Rubén, de pie, en su nido de cables)
RUB   BECARIO DETECTADO. LO QUE PASÓ DESPUÉS TE SORPRENDERÁ. ★
BRU   ...¿Tú eres el Titulator?
RUB   «EL TITULATOR ERA UN CHAVAL»: LA VERDAD QUE NADIE TE CUENTA.
RUB   Perdón. Se me escapa. Rubén. Becario de verano. Del verano pasado. ★
BRU   ¿Y qué haces en un armario?
RUB   Nadie cerró mi alta. Para Íñigo, soy una licencia. 48.000 al mes.
BRU   «UN BECARIO VIVE EN UN ARMARIO Y FACTURA COMO UN BANCO».
RUB   Ese está bien. ¿Lo has hecho tú? Le falta un número.
BRU   «UN BECARIO VIVE EN UN ARMARIO. EL 4 TE SORPRENDERÁ».
RUB   Mejor. ¿Cuál es el 4?
BRU   ...No lo sé. Ya estoy hablando como tú.
(pausa)
BRU   Perdona. Seis años en la web. Se me pega.
RUB   Te he titulado toda la noche. Perdona. Eras lo único que pasaba. ★
BRU   ¿Y a ti cuánto te paga?
RUB   Bocadillos de máquina. Los de atún. Los de chorizo son para socios.
BRU   ¿Y el fax de F.P.?
RUB   Fuentes Próximas. Muy próximas: la impresora de Íñigo sale aquí. ★
RUB   Lo imprime todo. Lo leo todo. Alguien tenía que saber lo de la opa.
RUB   ¿Tú eres el nuevo?
BRU   Llevo seis años.
RUB   Ah. Yo, cuatro meses. Entonces el nuevo soy yo. ★
RUB   Qué ilusión. Nunca había sido el nuevo de nada. ★
BRU   Sal de ahí. Vámonos.
RUB   Mi baja es un pósit en el tablero de Nemesio. Desde julio.
RUB   Y Nemesio no mueve un pósit sin pruebas de que el becario existió.
RUB   Nadie me ha hecho nunca una foto. Bueno, una. En Eventos. Al fondo.
RUB   ¿Me traes un táper, ya que vas?
```

---

### C.1 Celestino — Vestíbulo (pasos 2-4 del walkthrough)

**Funciones que se conservan:** dar `chicle` + `celestino_dio_chicle`; `celestino_pista_gertrudis`; `rep_05`;
rotación del Ibex (`vestibulo_ibex_pregunta`); rumores en `onStart` (`rumor_firma_n` paso 1, desmentido de
`rumor_plaza_n` = 3); comentario de la frente sellada (una vez).
**Qué cambia:** Celestino narra a Bruno como un partido; el chicle se planta como herramienta (pista de P1); la pista de
Gertrudis sale de su relación con la cafetera; el cotilleo deja la clave pero no el remate entero (ver §F); nueva opción
que toca su miedo.

```
[onStart · rumores y frente: sin cambios de función; líneas nuevas]
(con planta_oyo y rumor_firma_n = 0)
CEL   ¡Me informa la planta! ¡Que el chaval quiere firmar en papel!
BRU   ¿La planta habla?
CEL   Hablar no. Pero oye. Y yo oigo a la planta.                     ⟶ rumor_firma_n = 1
(con rumor_plaza_n = 3, una vez)
CEL   ¿Que alguien deja plaza? Nadie deja una plaza. Las plazas le dejan a uno.
(frente sellada, una vez)
CEL   ¡Y el chaval aparece con tarjeta en la frente! ¡Roja! ¡Directa!
[saludo · 1.ª conversación]
CEL   ¿Tú eres el nuevo?
[saludo · siguientes, rotan]
CEL   ¡Vuelve el chaval al vestíbulo! ¡Sin balón, pero con ganas!
CEL   ¡Vacante entra por la banda! ¡Se le nota el organigrama!        (con torno_abierto)
CEL   ¡Otra vez aquí! ¡Este chaval pisa más área que el portero!

[C0]
> [1·sens] «El torno no me deja pasar.»               if !torno_abierto · once
CEL   ¡El chaval encara el torno! ¡Saca la tarjeta! ¡Y nada! ¡No consta!
CEL   El torno solo deja pasar a los que salen en esa pared.
(Celestino señala el organigrama con la barbilla, sin mirarlo)
BRU   Yo salgo en la web. 4.112 veces.
CEL   La web no tiene pared, chaval.

> [2·WT] «¿Tiene algo para los nervios?»              if !celestino_dio_chicle
CEL   Chicle. Menta. Desde el Mundial del 82. Mira qué calma tengo.
(le da el paquete)                                                  ⟶ chicle, celestino_dio_chicle
CEL   ¡Y el chaval se lo guarda! ¡No lo mastica! ¡Algo trama el míster!
BRU   Lo reservo. Para una ocasión que lo merezca. O para pegar algo.

> [3·WT] «¿Dónde hay café en esta casa?»              once
CEL   En el Vending. Gertrudis. La cafetera.
BRU   ¿Y cómo se le pide?
CEL   Pedir, no. Se saluda. Dale las buenas noches.
CEL   Desde 2019 no se las da nadie. Yo sí, que soy su servicio técnico.
                                                                    ⟶ celestino_pista_gertrudis

> [4·WT] «¿Algún cotilleo?»                           once
CEL   ¡Jugada de ascensor, ayer! Gervasio, al de Mercados:
CEL   «Que esto no salga de aquí».
CEL   ¡Y el de Mercados la devuelve de primeras! «Tranquilo: de aquí no sale...»
CEL   ¡Y se cierra la puerta! ¡No oigo el final!
BRU   ¿«...ni el wifi»?
CEL   ¡Eso! ¡Ni el wifi! ¿Tú cómo lo sabes?
BRU   Porque aquí no sale.                                            ⟶ rep_05

> [5·abs] «¿Cómo va el Ibex?»                         (se queda; rota)
(1.ª vez)
CEL   ¿Me preguntas por el Ibex? ¿A mí? ¿En treinta años?
(pausa; se ajusta la bufanda)
CEL   [línea de IBEX según el acto, vestibulo.js:28-38, se quedan]

> [6·desc] «¿Y usted no se aburre aquí?»              once
CEL   ¿Aburrirme? Mira. Entra la de la limpieza. Sale la de la limpieza.
CEL   Entra un becario. Pregunta tonterías. ¡Partidazo!

> [7·NO] «Si ponen el narrador automático, ¿le jubilan?»   once · if acto ≥ 2
(Celestino deja de mascar)
CEL   ...
CEL   Ese aparato no sabe lo que es una prórroga.
CEL   Tú pregúntame por el Ibex de vez en cuando. Por si acaso.
BRU   Perdone. Lo he dicho en voz alta. Era para dentro.

> [8·abs] «¿Cómo se consigue una plaza de garaje?»    (se queda)
CEL   Dos maneras: jubilarse o un «accidente». Con comillas.
CEL   La segunda no ha funcionado nunca. Pero se entrena mucho.
BRU   ¿Y una plaza de bici?
CEL   ¿Tú eres el nuevo?                                (3/5)

> [9] «Nada, Celestino.»                               exit
CEL   ¡Y el chaval se retira al vestuario sin marcar!
```

Notas: la opción 7 es la única que existe solo en el Acto II (cuando ya hay narrador automático tapado con la bufanda,
`vestibulo.js:333-344`). La 8 hace que el «¿Tú eres el nuevo?» se use como respuesta a una pregunta tonta, que es donde
más gracia tiene: con eso Celestino gasta 3 de sus 5 usos.

---

### C.2 Aurora — Redacción de papel (pasos 16-18 y 33)

**Funciones que se conservan:** antes del café no habla (golpecito); `Dar cafe` → quitar `cafe`, dar `ficha_pagina_7`,
`aurora_conto_pasos`, `acto_2_iniciado`, rótulo del Acto II; `aurora_hablo_fax`; `rep_02`; A_FUENTE con dos fuentes →
quitar `mensaje_fp` y `fotocopia_nota_direccion`, `casilla_fuente`; «Tengo una fuente»; «¿Y ahora qué?»; opción de
Evaristo (`coma_bendecida`); rumor C paso 1 (`rumor_teodoro_n`).
**Fuera:** la opción de Custodia (`custodia_regla`), porque Custodia sale del reparto (§E).

```
[A_SIN_CAFE · antes del café: ella NO habla; arreglo nº 12 de la crítica: el golpecito siempre lleva texto]
> [1] «Buenas noches, Aurora.»                         exit
(toc, toc: el boli rojo contra el cartel)
BRU   «No hablo antes del café». Entendido. Pero no me ha dicho que no.
(toc)
BRU   Ahora sí.
> [2] «¿Usted es la correctora?»                       exit
(toc al cartel; toc a Bruno; toc al cartel)
BRU   Sí, es la correctora. Y yo soy un error. Y el cartel, la norma.
> [3·NO] «Puedo hablar yo por los dos, si quiere.»     exit
(Aurora le quita el boli de la oreja a Bruno y le tacha media frase en el aire)
BRU   Me ha corregido sin hablar. Es buenísima.
> [4] «Ya vuelvo. Con café.»                           exit
(toc. Uno solo. Suena a «eso espero»)

[A_CAFE · Dar cafe]                                                 ⟶ −cafe
AUR   Gracias, criatura. Este café está mal escrito, pero se entiende. ★
BRU   Aurora, quiero firmar en papel. Mañana.
AUR   «Quiero firmar en papel mañana», sin pausa; la pausa era miedo.
AUR   Para firmar hacen falta tres cosas: hueco, fuente y firma.
AUR   Hueco: una página libre. Fuente: una noticia contrastada, con dos fuentes.
AUR   Firma: que Teodoro acepte tu nombre en su página.
AUR   Las dos primeras son difíciles. La tercera no ha pasado nunca. ★
AUR   Toma la ficha de la página 7. Impar, que se ve mucho.           ⟶ ficha_pagina_7
AUR   Por eso está vendida, a unos colchones, desde marzo.
BRU   ¿Y cómo se libera una página vendida?
AUR   Eso se decide en la reunión de la Sala Amazonas, que empezó en marzo.
AUR   En treinta años he visto terminar una reunión de una sola manera:
AUR   que alguien pregunte por los siguientes pasos. Huyen como del fuego.
                                                    ⟶ aurora_conto_pasos, acto_2_iniciado
NAR   ACTO II: HUECO, FUENTE, FIRMA

[hablarAurora · antes del menú]
(1.ª vez, rumor C paso 1)
AUR   Teodoro duerme aquí desde 1997, criatura; detrás de esa cortina.  ⟶ rumor_teodoro_n = 1
(siguientes)
AUR   ¿Qué quieres, criatura? Y dilo entero, que tengo tiempo.

[A_MENU]
> [1·sens] «¿Qué noticia puedo traer?»                (se queda)
AUR   Una que no tenga nadie y que aguante hasta mañana sin enfriarse.
AUR   Las exclusivas se guardan para el papel; la web las tiene a las 00:01.

> [2·WT] «¿Cómo convenzo a Teodoro?»                  once
AUR   Teodoro no habla; escribe faxes, aunque lo tengas a dos metros.
AUR   Y el fax no tiene papel desde las seis.
AUR   Ha sido la tarde más tranquila de mi vida. ★                    ⟶ aurora_hablo_fax

> [3·WT] «¿Por qué no se hablan usted y Teodoro?»     once
AUR   En 1996 me mandó un fax que empezaba «Con el debido respeto...».
AUR   Le contesté dándole las gracias por avisarme. Antes de lo que venía.
AUR   No me ha vuelto a dirigir la palabra. Han sido treinta años muy buenos. ★
                                                                    ⟶ rep_02

> [4·desc] «¿Usted ha cometido alguna errata?»       once
(pausa de 1,2 s; se quita las gafas)
AUR   Una. En 1989. Una coma después de «sin embargo» que no puse.
AUR   Desde entonces la pongo siempre; sin embargo, no se me ha olvidado.
BRU   ¿Y qué pasó?
AUR   Nada. Eso es lo terrible, criatura: que no pasó nada y yo lo sé.

> [5·abs] «¿Qué le parecen los verbos de abajo?»      (se queda)
AUR   Nueve verbos y ni un subjuntivo. Así no se cierra un periódico. ★

> [6·NO] «En la web eso lo arregla el corrector automático.»   once
(silencio; Aurora deja el boli sobre la mesa, muy despacio)
AUR   Repítemelo, que creo que no te he oído, y prefiero no haberte oído.
BRU   Digo que en la web no hay correctora. Lo hago fatal yo solo.
AUR   Ya lo sé. Leo la web todas las noches, para sufrir con método.

> [7] «Tengo dos fuentes.»                             if dosFuentes → A_FUENTE
> [8] «Tengo una fuente.»                              if unaFuente
AUR   Con una fuente se hace un rumor; con dos, una noticia.
AUR   Con tres, un libro, y no estamos para libros.

> [9] «¿Y ahora qué?»                                  if casilla_fuente · !pieza_escrita
AUR   Ahora escríbela en tu ordenador, fuera del CMS, que ahí vive el Titulator.
AUR   Y sin adjetivos; si se te escapa uno, que sea el bueno.

> [10] «Íñigo dice que en la reunión van a apagar la rotativa.»   if acto_3_iniciado
AUR   Esa reunión no decide nada sin acta.
AUR   Y Gervasio no ha escrito un acta en su vida, ni la piensa escribir. ★

> [11] «Don Evaristo pregunta si su coma está bien.»  if evaristo_escuchado · !coma_bendecida
AUR   ¿Evaristo? ¿El de las comas? Siéntate, criatura. Bueno, no hay silla.
AUR   La coma decimal es correcta, y el punto también; las dos valen.
AUR   Pero si su cláusula dice coma, manda la cláusula. Son cuarenta y ocho.
AUR   Dile que lo envíe; que una coma bien puesta no espera.         ⟶ coma_bendecida

> [12] «Nada, Aurora. Gracias.»                         exit
AUR   Lo has dicho bien. Me has descolocado. ★

[A_FUENTE · Tengo dos fuentes / Dar una de las dos teniendo ambas]
AUR   A ver.
AUR   Un fax anónimo de un tal F.P. Y una nota de gasto con un reverso.
AUR   «OPA ROBLEDAL, jueves, NO PUBL.» A boli. ¿Esto lo has contrastado?
BRU   Son dos fuentes.
AUR   Una anónima y otra con IVA. Me vale. ★
(¡GRAPA! sella la ficha)                ⟶ −mensaje_fp, −fotocopia_nota_direccion, casilla_fuente
AUR   Y «opa» en minúscula, que ya está en el diccionario y se ofende.
```

---

### C.3 Begoña — Administración (pasos 30 y 36) · S4 «el recorte en directo»

**Funciones que se conservan:** `B_NOTA` → `B_IMPORTE` → `B_JUST` → `B_INSULTO` → `B_EJEMPLAR`: dar
`fotocopia_nota_direccion` y `copias_rechazadas`, quitar `sobre_azucar`, `nota_gasto_presentada`; «Varios» →
`bruno_sellado_frente` + sello; «Necesito recortar ocho líneas» (o Dar `pieza_opa`) → `recorte()` →
`pieza_recortada`. **Todas las opciones WT del paso 30 conservan su texto.** Las cuatro respuestas de `B_JUST` (las
mejores del juego) y el cuadruplicado se quedan literales (★).
**Qué cambia:** Begoña recorta en directo las frases largas de Bruno (siembra el recorte del 26 %); cada importe tiene
su reacción; la opción fallida «Esto es un puzle, ¿verdad?» se cambia por una provocación que motiva enseñar el ejemplar.

```
[onStart]
BEG   Son las 19:07. Te quedan ocho minutos de existencia administrativa. ★

[B0]
> [1·WT] «Quiero presentar una nota de gasto.»        if !nota_gasto_presentada → B_NOTA

> [2·sens] «Llevan siendo las 19:07 toda la tarde.»   once
BEG   Por eso sigo abierta. El horario se cumple. ★

> [3·desc] «Begoña, con todo el respeto, yo solo venía a preguntarle si...»   once
(Begoña levanta un sello. Bruno se calla en seco.)
BEG   Recortado. Lo que venía después era la conclusión. No la lee nadie.
BRU   ¿Me ha recortado una pregunta?
BEG   El 26 %. Por abajo. Sin excepciones.
BRU   ¿Y qué le iba a preguntar?
BEG   No lo sabremos nunca. Así es más limpio.

> [4·abs] «Vengo a ver la pared. Dicen que es el Prado de las facturas.»   once
BEG   Mi favorita: «Cena con el ministro». Motivo de rechazo: «el ministro pagó».
BEG   Las de Dirección, en cambio, son de manual.
BEG   Algún día enmarcaré una, para que se vea la diferencia.

> [5·NO] «¿Usted ha sido feliz alguna vez?»          if nota_gasto_presentada
BEG   Rellene el F-1 de Felicidad. Por triplicado.
BRU   ¿Y cuándo me contesta?
BEG   En marzo. Con los demás F-1. Hay uno de 1987.

> [6] «Necesito recortar ocho líneas.»                if has:pieza_opa · !pieza_recortada → recorte()

> [7·abs] «¿Le han pedido algo raro hoy?»            (se queda)
BEG   Un yunque. Por nota de gasto. Concepto: «Sucesión, plaza 7».
BEG   Rechazado. Si lo aprobara, tendría que justificar la caída. ★

> [8] «Nada. Me iba.»                                  exit
BEG   Es lo más eficiente que ha hecho hoy. ★

[B_NOTA · onEnter]
BEG   Uno: concepto. Dos: importe. Tres: justificante.
BEG   Y como me escribas «varios», te sello la frente.
> [1·sens] «Nada. Importe cero. No he gastado nada.»  once → B0
(pausa de 0,9 s; Begoña revisa la nada por las dos caras)
BEG   ...Correcta. Aprobada. Vete. Me has hecho daño. ★
BRU   He hecho el trámite bien. Ese ha sido mi error.
> [2·WT] «Café para entender el capitalismo.»          → B_IMPORTE
> [3·desc] «Varios.»                                    once → B0
BEG   Te lo he avisado.
(¡SELLO!)                                                           ⟶ bruno_sellado_frente
BRU   RECHAZADO, en la frente. Al revés. Es mi primer documento oficial.
> [4·abs] «Representación. Me represento a mí mismo.» once
BEG   Eso no es representación. Es autoestima. Y no desgrava. ★

[B_IMPORTE · onEnter]
BEG   «Café para entender el capitalismo». Importe.
> [1·WT] «Lo que sea.»                                 → B_JUST
BEG   «Lo que sea». Lo escribo en letra. En número no cabe.
> [2·abs] «1,40 €, más IVA espiritual.»                → B_JUST
BEG   El espíritu no tributa, niño. Por eso no lo veo por aquí.
> [3·desc] «Cero. Me lo invitó la máquina.»            → B_JUST
BEG   Una invitación es retribución en especie. Se lo comunico a Gertrudis.

[B_JUST · onEnter]
BEG   Justificante.
> [1·WT] «Aquí tiene. Un sobre de azúcar. Es casi un ticket.»   if has:sobre_azucar → B_INSULTO
> [2] «Mi palabra de honor.»
BEG   La palabra de honor dejó de ser moneda de curso legal con la peseta. ★
> [3] «Una foto mental. ¿Se la describo?»
BEG   Las fotos mentales solo se aceptan con NIF. Y por triplicado. ★
> [4] «¿Usted cree en los tickets, Begoña? Pero de verdad.»
BEG   Yo no creo en los tickets, niño. Los tickets creen en mí. ★
> [5] «Lo busco y vuelvo.»                             if !has:sobre_azucar · exit
BEG   Aquí estaré. A las 19:07. ★

[B_INSULTO · onEnter (1.ª vez)]
(Begoña coge el sobre con dos dedos y lo huele)
BEG   Un sobre de azúcar. Caducado en 2021. Del bolsillo de Ramírez. ★
BEG   Cuarenta años en esta ventanilla. He visto un ticket en sánscrito. ★
BEG   Pero esto... esto es un insulto a la contabilidad. ★
(siguientes) BEG   Esto sigue siendo un insulto a la contabilidad.
> [1·WT] «Pues enséñeme cómo es una nota bien hecha, si tan lista es.»   → B_EJEMPLAR
> [2·sens] «Lo siento. En la universidad no dimos tickets.»              → B_EJEMPLAR
BEG   Eso se nota. Mira y aprende.
> [3·NO] «Seguro que en Dirección las hacen peor.»                       → B_EJEMPLAR
BEG   ¿Peor? ¿Dirección?
(se levanta. Begoña no se levanta nunca. Se oye el archivador)
> [4·desc] «¿Me la aprueba o no?»
BEG   Se la apruebo el día que el CMS no se caiga.
[si cms_vivo]  BRU   Ya no se cae.     BEG   Entonces el día que se caiga y se levante solo.

[B_EJEMPLAR · onEnter]                                       (función idéntica a la actual)
BEG   Esto. Esto es una nota de gasto. Concepto claro. Importe con céntimos.
BEG   NIF. Firma. «Comida de trabajo con Hidrovoltia. 312,00 euros. Gervasio.»
BRU   ¿Gervasio come con Hidrovoltia?
BEG   Gervasio come con quien haga falta. Y lo justifica. Es su talento. ★
BEG   Te la fotocopio, para que aprendas. Por las dos caras: yo todo así.
                                                                    ⟶ fotocopia_nota_direccion
BEG   Y la tuya, por triplicado.
(¡SELLO!) BEG   Original.   (¡SELLO!) BEG   Duplicado.   (¡SELLO!) BEG   Triplicado.
BEG   Rechazadas las tres. El original, para mí. ★
BEG   Duplicado y triplicado, para tu archivo personal.
BEG   Y el sobre me lo quedo. Es una prueba.       ⟶ copias_rechazadas, −sobre_azucar, nota_gasto_presentada
> [1] «¿Y qué hago yo con dos copias de un rechazo?»   → B0
BEG   Nadie lo sabe. Llevo cuarenta años dándolas y nadie vuelve a decírmelo.
> [2·abs] «¿Me hace una cuarta copia, para mi abuela?» → B0
BEG   No existe el CUADRUPLICADO. ★
BRU   ¿Por qué?
BEG   Porque la cuarta copia siempre acaba en un juzgado. ★
> [3] «Gracias, Begoña.»                                exit
BEG   No me dé las gracias. Las gracias no se pueden sellar. ★

[recorte() · P11 · también al Dar pieza_opa]
BEG   Toda pieza sufre el recorte estándar del 26 %. Sin excepciones.
BEG   Por abajo, que manda la pirámide invertida. Se pierde la conclusión.
BRU   Pero en la conclusión explico por qué la opa es import...
BEG   Recortado.
(teclea)                                                           ⟶ pieza_recortada
BRU   Treinta y una por cero setenta y cuatro... veintitrés. Exacto.
BEG   Ni una línea más. Ni un céntimo menos. ★
```

---

### C.4 Gervasio — Sala Amazonas (paso 27), Despachos, Vending (paso 43) · S1 «la estampida»

**Funciones que se conservan:** `GV_REUNION`: con `aurora_conto_pasos`, «siguientes pasos» → `reunion_terminada`
(los figurantes salen, el planillo queda). `GV_PAJARERA`: sin función (dos opciones). `GV_OFFICE`: «Necesito el acta» →
duelo `gervasio` (D3) → `acta_reunion`, `duelo_gervasio_ganado`, `sala_abierta`; se planta ante Gertrudis.
**Qué cambia:** Gervasio no acaba las frases y los demás se las terminan; la reunión se disuelve como escena de huida;
nueva línea de Bruno que señala el planillo (arreglo nº 8 de la crítica); «Lo hablamos» baja de 17 a 5.

```
[GV_REUNION · onStart]
GER   Estamos en el punto tres. Desde marzo. Se está... se avanza.
MER   (al fondo) ¿Sigue siendo marzo?

> [1·sens] «¿Qué se decide aquí?»                      once
GER   Se decide... Se está decidiendo. Lo que diga el Lector Medio.
BRU   ¿Y qué dice?
GER   Aún no se le ha preguntado. Se le preguntará. En el punto cuatro.

> [2·sens] «¿Me deja la página 7?»                     once
GER   La página 7 se... Eso habría que... Tú, que tienes la agenda limpia...
BRU   ¿...que tengo la agenda limpia para qué?
GER   Para eso. Muy bien visto. Se toma nota.

> [3·desc] «¿Puedo presidir yo un rato?»              once
(Gervasio se levanta al instante y le ofrece el sillón)
GER   Toma. Se preside sentado. Yo voy a por... a por una cosa.
MER   Gervasio, que es el becario.
(Gervasio se vuelve a sentar, despacio)
GER   ...Ya decía yo que se ofrecía muy rápido.

> [4·abs] «¿Y si votamos si votamos?»                 once
MER   Secundo.
MER   Secundo.
GER   Se abre un turno de... Se abrirá. Cuando se cierre el punto tres.

> [5·WT] «Bueno... ¿y cuáles son los siguientes pasos?»    if aurora_conto_pasos → S1 (abajo)

> [6] «¿Quién tiene reservada la sala?»                once
GER   Ramírez. Los viernes a las 20:59.
BRU   ¿Y dónde está Ramírez?
GER   Desayunando. Desde 2019. Pero la reserva se respeta. Es de antes.

> [7] «Me voy.»                                         exit
GER   Se toma nota. No la tomo yo, pero se toma.

[S1 · reunionTerminada (sustituye sala_amazonas.js:257-267; mismo flag y mismo orden de estados)]
BRU   Bueno... ¿y cuáles son los siguientes pasos?
(silencio de 1,2 s; los tres de Mercados levantan la cabeza a la vez)
MER   ¿Los... siguientes?
GER   Eso se podría ver en una reunión. De siguientes pasos.
MER   ¿Y quién la convoca?
(silencio. Los tres miran a Gervasio. Gervasio mira a Bruno.)
GER   Pues el que ha preguntado, que tiene la agenda...
(¡ESTRÉPITO! Sillas. Los de Mercados huyen; un botellín rueda; la sala tiembla)
                                                                    ⟶ reunion_terminada
MER   (desde la puerta) ¡Yo tengo dentista!
MER   ¡Y yo! ¡El mismo!
(Gervasio, solo, mira la mesa vacía. Mira a Bruno.)
GER   Se levanta la sesión.
(se va; en la puerta, sin volverse)
GER   Lo hablamos.                                    (1/5)
BRU   Se han dejado el planillo. Con la página 7 dentro.
BRU   Una reunión desde marzo y la cierro yo con una pregunta. Eso es liderazgo.

[GV_PAJARERA · Despachos, tras la reunión]
GER   Vacante. Te iba a llamar. Bueno, se te iba a llamar.
> [1] «¿Quién decide lo del Plan Cero Papel?»          exit
GER   Lo que diga el Lector Medio.
LEC   A mí lo que me interesa es la economía. Y ahorrar.
GER   ...Pues ya está decidido.
> [2] «¿Cuántos marrones lleva este año?»             exit
GER   Cero. Diecinueve años en cero. Es mi único dato bueno.
> [3·NO] «¿Usted ha escrito alguna vez algo?»         once · exit
GER   Firmé un acuse de recibo. En 2007.
(pausa)
GER   Fue muy duro. No se volvió a pedir.

[GV_OFFICE · Vending, Acto III · antes del menú]
GER   Esta máquina no me reconoce. Diecinueve años y no me reconoce.
> [1·sens] «¿Ha probado a darle las buenas noches?»   once
GER   ¿Saludar? Eso se... se delega.
BRU   ¿En quién?
GER   En alguien que tenga la...
BRU   ...la agenda limpia.
GER   Eso. Qué rápido aprendes.
> [2·WT] «Necesito el acta de la última reunión.»      → duelo D3 (§F) · exit
> [3·desc] «Si quiere, le escribo yo el acta.»          once
(los ojos de Gervasio se iluminan; se le cae un móvil)
GER   ¿Lo harías? ¿Por escrito? ¿Con tu nombre?
BRU   ...No. Era para ver qué cara ponía.
GER   Se agradece la iniciativa igual. Se archiva.
> [4] «Me voy.»                                         exit
GER   Se verá.

[D3 · líneas del rival (sustituyen office.js:130-146; misma función)]
intro       GER   Ah, Vacante. El acta. Eso se redacta. Se redactará.
            GER   Mejor por escrito. Que conste que lo has pedido tú.
hurt        GER   Eso... eso se tendría que...
            GER   Uy. Eso se ha quedado aquí. En mí. Qué incómodo.
taunt       GER   Se toma nota. La tomas tú.
            GER   Eso se verá. En marzo.
            GER   Muy bien. Con copia a ti.
derrota     GER   Asignado a ti. Se agradece la iniciativa. Lo hablamos.   (2/5)
victoria    GER   Diecinueve años sin un marrón. Y ahora me toca el acta. ★
(escribe, despacio, con la lengua fuera)
            GER   Acuerdos de la última reunión: uno, pedir más café. Dos, ninguno más. ★
            GER   Toma. Entra tú. Yo voy a ver si esta máquina me saluda.
                                        ⟶ acta_reunion, duelo_gervasio_ganado, sala_abierta
(se planta ante Gertrudis)
GTR   E-53: ¿Y TÚ QUIÉN ERES?
```

---

### C.5 Paco — Sistemas (pasos 25-26 y 42)

**Funciones que se conservan:** rumores en `onStart` (`rumor_atun_n` paso 1, `rumor_plaza_n` 1→2); frente; nodo `P`
que reparte a `P0`/`P1` según `cms_vivo`; `P1`: dar `manual_fax` + `paco_dio_manual`; `rep_12`; `P_27`; «Te traigo una
baja» / Dar `posit_baja_ruben` → `pacoBaja()` → `ticket_n1`, `ruben_libre`, armario vacío, Rubén sale.
**Fuera:** `P_ALTA` (alta de Herminia) y su opción, porque la subtrama se va (§E). Su mejor línea pasa a P_BAJA.
**Opción a revisar [WT-cambio, opcional]:** «¿Sabes algo del fax de la Catacumba?» usa el nombre interno de la sala. Si
se cambia por «¿Sabes algo del fax de Teodoro?», hay que tocar el paso 25 de `tools/walk-data.mjs`.

```
[onStart]
(rumor B, paso 1)
PAC   Por la rejilla del 27 se oye masticar. A deshoras. Ticket abierto.  ⟶ rumor_atun_n = 1
(rumor D, paso 2)
PAC   Gervasio se va a vivir al garaje. Para no perder la plaza. Lo he oído.
(frente, una vez)
PAC   Llevas RECHAZADO en la frente. Es de Administración. Sin ticket no lo quito.
[sin cms_vivo]
PAC   No atiendo. Tengo 312 tickets que dicen «el CMS no va». ★
PAC   Y uno que dice «el CMS no va, URGENTE». Es el mismo, con mayúsculas. ★
[con cms_vivo]
PAC   Se ha arreglado el CMS. Nadie sabe cómo. ★
PAC   Ya me han abierto un ticket para saberlo. ★

[P0 · CMS caído]
> [1·sens] «¿Y por qué no va?»                          once · exit
PAC   Si lo supiera, tendría 311.
PAC   Está todo en el registro. Nadie lo lee. Por eso es tan sincero.

> [2·sens] «¿Tú eres el de Sistemas?»                  once · exit
PAC   48.212. Es tu número. Tiene más identidad que tú. ★

> [3] «¿Qué hay en el armario 27?»                      → P_27

> [4·desc] «¿Cuándo fue la última vez que viste el sol?»   once
PAC   Ticket 2.003: «luz natural». Estado: no prioritario.
PAC   Me lo abrí yo. En 2011. Sigo en cola.

> [5·abs] «¿Me abres un ticket a mí? Para existir.»   once
PAC   Ya tienes uno. Desde 2020. «Becario sin alta definitiva».
PAC   Asignado a: nadie. Es el más estable que tengo.
BRU   ...Lo pongo en el currículum. «Ticket propio desde 2020».

> [6] «¿Escuchas por la rejilla?»                      (se queda)
PAC   No escucho. Oigo. Escuchar sería abrir un ticket. ★
PAC   Me entero de todo. No arreglo nada. Es el equilibrio. ★

> [7] «Me voy.»                                         exit
PAC   Cierra. No, esa no. Esa es un servidor. ★

[P1 · CMS vivo]
> [1·WT] «¿Sabes algo del fax de la Catacumba?»        if !paco_dio_manual
PAC   Fax de Teodoro. Ticket 0.441, de 1999. Estado: lo respetamos.
PAC   Lo único de esta casa que contesta a todos sin cabrearse...
PAC   ...es la respuesta automática. Es mi mejor empleada. ★
PAC   Ese fax la tiene. Menú 9. Nadie la ha tocado desde 1999.
PAC   Toma el manual. Página 9. Lo demás son fotos del fax. Posando. ★
                                                                    ⟶ manual_fax, paco_dio_manual

> [2·WT] «¿Algún cotilleo del consultor?»              once
PAC   Íñigo me dijo que había que poner las luces largas.
PAC   Le contesté algo de que ya se veía la carretera. O de que no había.
PAC   Me ha puesto en azul. Excusas.                                    ⟶ rep_12

> [3] «¿Qué hay en el armario 27?»                      → P_27       (se queda)
> [4] «Te traigo una baja.»                             if has:posit_baja_ruben → pacoBaja() · exit
> [5] «¿Escuchas por la rejilla?»                       (se queda; igual que en P0)

> [6·abs] «¿Te escribe mucho Borja?»                   (sustituye a la de Tadeo)
PAC   Cada reenvío de Borja es un ticket. Tengo una carpeta: «Sin leer (por él)».
PAC   Le contesta mi respuesta automática. Hacen buena pareja.

> [7·NO] «¿Se ha caído el wifi?»                       (se queda)
PAC   No, el wifi no se ha caído. Has dejado de merecerlo. ★

> [8] «Me voy.»                                         exit
PAC   Cierra. No, esa no. Esa es un servidor. ★

[P_27]
PAC   Lo alquiló el consultor. Dice que dentro «se enfría el modelo».
PAC   Hace ruido de matricial. Y a ratos, de masticar.
PAC   Ticket 48.100: «Armario 27, mastica». Estado: pendiente.

[pacoBaja() · P14c]
PAC   Un pósit. Descopeado. En papel. Me repugna, pero es reglamentario. ★
PAC   Ticket nº 1: «Alta becario Rubén». Abierto en julio.
PAC   Al portátil del consultor le di alta en cuarenta segundos. Al chaval, nada.
(teclea; la impresora escupe)                                       ⟶ −posit_baja_ruben
PAC   Estado: CERRADO.
(pausa de 0,9 s)
PAC   ...Ya está. No es para tanto.
(pausa)
PAC   Es lo mejor que me ha pasado en la vida.
PAC   Toma el justificante. Enmárcalo. O úsalo contra alguien. ★     ⟶ ticket_n1, ruben_libre
(el armario cruje; Rubén se estira)
RUB   Gracias. Voy a buscar una ventana. ★
```

---

### C.6 Íñigo — Despachos, Actos I-II (+ retoques de la 7.2)

**Funciones que se conservan:** rumor B paso 3 (`rumor_atun_n` 2→3) antes del árbol; ninguna opción del árbol toca el
grafo. **Fuera:** «¿Conoces a Herminia?» (§E). **Objetivo:** que el villano tenga sus propias frases memorables y que
cada opción le obligue a reencuadrar algo en directo. Dos de ellas son «casi confesiones» que pagan en el Acto III.

```
[onStart]
(rumor B, paso 3)
IÑI   Es un modelo muy hambriento. Señal de calidad.                   ⟶ rumor_atun_n = 3
IÑI   Vacante. Mi cuadrante favorito. ★

[I0]
> [1·sens] «¿Qué es esa matriz?»                       once
IÑI   Coste contra disponibilidad. Todo cabe: personas, emociones, el pádel.
IÑI   Tú estás aquí. En «Ideal».
BRU   ¿Y qué hay que hacer para estar en «Ideal»?
IÑI   Nada. Literalmente. Ese es el perfil.

> [2·desc] «¿De qué color soy yo?»                    once
IÑI   Rosa. Emociones. No te lo tomes como algo personal: es un pósit. ★
(es la ÚNICA vez que se explica el rosa en todo el juego: ver §E.4)

> [3·sens] «¿El Titulator escribe solo?»              once
IÑI   Es generativo, autónomo y escalable. Y no pide vacaciones. ★
BRU   ¿Y qué come?
IÑI   Datos.
(pausa de 0,8 s)
IÑI   Y algo de atún. Lo estamos optimizando.

> [4] «¿Qué es eso del armario 27?»                    once · if vio_armario_27
IÑI   Alucinaciones. Es normal en modelos tan avanzados. ★
BRU   Ha escrito «ayúdame».
IÑI   Es un modelo muy empático. No es un armario: es un entorno de concentración.

> [5·NO] «Usted no ha escrito un titular en su vida, ¿verdad?»   once
IÑI   Yo no escribo, Vacante. Yo hago que las cosas estén escritas.
BRU   Eso lo hace un becario.
(silencio de 1,2 s. Íñigo sonríe sin mover nada más)
IÑI   Siguiente pregunta.

> [6·abs] «¿Me puede poner en otro cuadrante? Aunque sea "Caro".»   once
IÑI   «Caro» es para quien tiene contrato. ¿Tienes contrato?
BRU   Tengo seis convenios de prácticas.
IÑI   Entonces eres barato con antigüedad. Eso no tiene cuadrante.
(escribe un pósit nuevo y lo pega fuera de la matriz)
IÑI   Te invento uno. «Vacante (histórico)». Enhorabuena.
BRU   Primer ascenso en seis años. Hacia fuera, pero ascenso.

> [7·sens] «¿Y si en la Reunión de Dirección dicen que no?»
IÑI   El Lector Medio no dice que no. Lleva tres semanas asintiendo.
IÑI   Es el mejor dato que he tenido nunca. Y no cobra.

> [8] «¿Y el de Controlling?»                           once
IÑI   Me llama por las comas de las facturas. Le tengo en azul.
IÑI   Excusas. Pero muy bien puntuadas. ★

> [9·desc] «¿Usted va a despedir a alguien esta noche?»   once
IÑI   Yo no recorto personas, Vacante.
IÑI   Recorto la distancia entre las personas y la puerta.

> [10] «Me voy.»                                         exit
IÑI   Perfecto. Eso libera sinergias.

[7.2 · presentación del villano: retoques de línea (misma escena, misma función, inigo_presentado)]
IÑI   Buenas noches, equipo. Íñigo Sinergia, de Optimal Brains & Partners. ★
IÑI   Tranquilos. No vengo a despedir a nadie.
IÑI   Vengo a reimaginar el perímetro. ★
D1    ¡Ha sido Diseño!                       (la ÚNICA vez de la escena; el chiste de la casa, presentado)
IÑI   ...No he dicho nada malo todavía.
D2    Por si acaso.
YOL   Eso es despedir con diapositivas.
IÑI   No hay despidos, Yoli. Hay noticias mal posicionadas.
(…Titulator, igual…)
IÑI   Esta tarde lleva trescientos titulares. La redacción humana, cero. ★
YOL   ¡Porque se nos ha caído el CMS!
IÑI   Exacto. El Titulator no necesita CMS. Ni silla. Ni convenio. ★
IÑI   A las nueve, con el cierre, la Reunión de Dirección aprueba el Plan Cero Papel.
IÑI   Sin edición impresa. Sin rotativa. Sin costes. Solo clics.
IÑI   No os despido: os desapalanco del organigrama. ★
BRU   ¿Sin papel? Pero si mañana firmo yo en papel.
IÑI   ¿Y tú eres...?
BRU   Bruno Pellejo. Becario senior. Senior en becario. ★
(apunta en un pósit rosa)
IÑI   Coste cero, disponibilidad total. Te tengo en la matriz, Vacante. ★
(sale)
YOL   Te ha puesto en rosa. Yo me preocuparía — 3.402 — me preocuparía un poco.
(fuera «El rosa es "emociones". Te ha clasificado como emoción», pecera.escenas.js:131: se explica en el árbol)
NEM   El CMS no es nuestro, es de Sistemas.
YOL   ¡Paco dice que es vuestro!
NEM   Paco dice muchas cosas. Por ticket. ★
```

---

## D. BRUNO AL MIRAR / USAR: 60 RESPUESTAS REESCRITAS

**Criterio.** De las 46 líneas de Bruno que acaban en «Como…» (o en «, como X.»), reescribo 42; el resto de la tabla son moldes repetidos
(«Si lo [verbo]…», «Le hablo… no contesta»), las incoherencias que señala la crítica y las líneas con nombres internos de
sala. Ninguna línea nueva acaba en «Como…» y ninguna usa la estructura de la que sale. **Recursos** (columna R):
**O** observación concreta (un detalle que solo ve quien mira) · **A** autoengaño de currículum (su defecto) ·
**P** pregunta · **F** dato falso dicho con seguridad · **S** silencio (pausa escrita en el guion) · **X** acción con
consecuencia (el objeto responde) · **C** cortesía con el objeto (lo trata como a un compañero) · **H** pista escondida.

Reparto de las 60: O 17 · A 11 · P 11 · X 8 · C 4 · H 3 · F 3 · S 3 (algunas mezclan dos; cuento la principal).

| # | Origen | Original | Nueva | R |
|---:|---|---|---|---|
| 1 | `game.js:19` (abrir, def.) | No se abre. Como las plazas de redactor. | No se abre. Lo apunto como «acceso restringido». Suena a ascenso. | A |
| 2 | `game.js:19` (abrir, def.) | Cerrado. Como el plazo. Como el cierre. Como mi futuro. | Cerrado. Hay una pegatina: «No forzar». Me ha convencido. | O |
| 3 | `game.js:20` (cerrar, def.) | Prefiero dejarlo abierto. Como mi contrato. | ¿Cerrar algo yo? ¿Con qué cargo? | P |
| 4 | `game.js:21` (empujar, def.) | Lo empujo. No se mueve. Como un correo pidiendo aumento de sueldo. | Empujo con las dos manos. Nada. Sigo un poco más, por si alguien mira. | X |
| 5 | `game.js:22` (tirar, def.) | Tiro. Se resiste. Como Teodoro a la web. | Tiro. No sale. Le pido perdón. Me parece lo correcto. | C |
| 6 | `game.js:16` (usar, def.) | No funciona. Como casi todo lo que se enchufa en esta planta. | No funciona. Lo añado a mis competencias: «manejo de equipos averiados». | A |
| 7 | `items.js:314` | No escribe. Pero lo intenta. Como yo. | No escribe. Le guardo un minuto de silencio. ...Ya. | S |
| 8 | `rooms/administracion.js:114` | «EJEMPLARES». Aquí guarda Begoña las notas bien hechas. Como reliquias. | «EJEMPLARES». Once notas bien hechas en cuarenta años. Una por cuatrienio. | O |
| 9 | `rooms/catacumba.js:416` | No. Teodoro lo tiene orientado hacia el fax. Como un girasol. | No lo muevo. Está orientado al fax. Teodoro duerme mirando la bandeja. | O |
| 10 | `rooms/catacumba.js:456` | Abro la bandeja. Vacía. Como mi cotización. | Abro la bandeja. Vacía. Queda la marca de un papel que estuvo. | O |
| 11 | `rooms/cpd.js:229` | Cerrados. Todos. Como las plazas de redactor. | Cerrados. Treinta y nueve zumban. El 27 mastica. | H |
| 12 | `rooms/cpd.js:289` | No. La cuña es lo único que lo sujeta. Como a mí el café. | La cuña es una hoja doblada. Pone «Libro de Estilo». Pesa más que el ventilador. | H |
| 13 | `rooms/cpd.js:301` | No tiene botones. Solo sube. Como el IPC, pero con más sinceridad. | No tiene botones. Sube uno cada vez que entro. Soy una incidencia recurrente. | A |
| 14 | `rooms/cpd.js:304` | Está atornillado a la pared. Como la paciencia de Paco. | Ocho tornillos para un contador. A mí me sujetan con un convenio. | O |
| 15 | `rooms/ecosistema.js:193` | El pasillo no se empuja. Se recorre. Como el procedimiento. | ¿Empujar un pasillo? ¿Hacia Administración? Ya va él solo. | P |
| 16 | `rooms/office.js:190` | Pulso la B4. La espiral gira, la bolsa se asoma... y se queda colgando. Como yo. | Pulso la B4. Las pipas se asoman y se quedan colgando. Las animo. Nada. | X |
| 17 | `rooms/office.js:237` | Abro el grifo. Sale un hilo de agua. Como el de las nóminas. | Abro el grifo. Tose dos veces y suelta un hilo. Lo cierro antes de que opine. | O |
| 18 | `rooms/office.js:250` | Apuesto por mí. Cuota: "no consta". Como en el torno. | Apuesto por mí. Cuota: «no consta». Doblo la apuesta. Sigue sin constar. | X |
| 19 | `rooms/pajarera.js:170` | Persiana a media altura desde 2015. Nadie sabe si sube o baja. Como el Ibex. | Persiana a media altura desde 2015. Mitad transparencia, mitad no preguntes. | O |
| 20 | `rooms/pajarera.js:204` | El cajón tiene llave. Como todo lo que decide algo. | El cajón tiene llave. La mesa, no. Aquí decide el cajón. | O |
| 21 | `rooms/pajarera.js:229` | Ya está cerrada. Por dentro. Como las buenas ideas. | Cerrada por dentro. Se oye pasar una diapositiva. Muy despacio. | O |
| 22 | `rooms/pecera.js:148` | No se empuja. Se llama. Como a Paco, pero contesta. | Pulso el botón. Viene enseguida. Me emociono un poco. No estoy acostumbrado. | A |
| 23 | `rooms/pecera.js:156` | Una escalera no se empuja. Se sube. Como el IPC. | ¿Empujar una escalera? Tengo un máster, pero no de eso. | P |
| 24 | `rooms/pecera.js:177` | Las pantallas siguen encendidas. Sin nadie. Como la web. | Pantallas encendidas, sillas vacías. Si llama alguien, contesta la chaqueta. | O |
| 25 | `rooms/pecera.js:209` | Ya está enchufado. Más enchufado no se puede. Como el sobrino de alguien. | Ya está enchufado. Lo dice la cinta, lo dice el cable y lo dice Dirección. | O |
| 26 | `rooms/pecera.js:319` | Se tambalea y vuelve. Como la política de integración. | Se tambalea y vuelve. Debajo, un pósit de Nemesio: «NO TOCAR (tablero)». | O |
| 27 | `rooms/pecera.js:403` | Ya está cerrada. Por dentro. Como la redacción a las seis y media. | Las ventanas de oficina se abren una vez: para la foto de inauguración. | F |
| 28 | `rooms/sala_amazonas.js:133` | Está atornillada a la pared. Como el punto 3 al orden del día. | Atornillada. Alguien temió que la tele se fuera antes que Mercados. | O |
| 29 | `rooms/sala_amazonas.js:140` | Ya está abierta. Desbordada. Como el calendario de la sala. | Ya está abierta. Cierro la tapa y un cable me saluda por el hueco. | X |
| 30 | `rooms/sala_amazonas.js:145` | Los carteles están en guerra y yo soy neutral. Como Suiza, pero becario. | ¿Coger un cartel? ¿Y elegir bando? Acabo de llegar a la sala. | P |
| 31 | `rooms/vestibulo.js:110` | El ascensor está al otro lado del torno. Como todo lo bueno. | El ascensor está al otro lado del torno. Le saludo desde aquí. Por si acaso. | C |
| 32 | `rooms/vestibulo.js:177` | Se abre hacia fuera. Como las oportunidades, en esta casa. | Hacia fuera, no. Si salgo, mi abuela se entera antes que yo. | X |
| 33 | `rooms/vestibulo.js:216` | Le digo «buenas noches, Contable». No me cuenta. Como siempre. | «Buenas noches, Contable». La «e» se mueve un poco. Lo tomo como un sí. | A |
| 34 | `rooms/vestibulo.js:247` | Se abre con tarjeta. Y con organigrama. Como un banco. | Se abre con tarjeta. La mía dice «Pellizco». El torno, con razón, duda. | O |
| 35 | `rooms/vestibulo.js:251` | Le explico quién soy. Parpadea en rojo. Como Recursos Humanos. | Le explico quién soy en treinta segundos. A los veinte, pita. | A |
| 36 | `rooms/vestibulo.js:285` | Desde aquí se ve. Como la plantilla fija. | Desde aquí se ve la moqueta del ascensor. Algún día la piso. Con contrato. | A |
| 37 | `rooms/vestibulo.js:343` | Ya lo tiene cerrado Celestino. Con bufanda. Como se cierra un partido. | Celestino lo ha amordazado con la bufanda. El altavoz no ha opinado. | O |
| 38 | `rooms/vestibulo.js:396` | Celestino no se coge. Viene con el edificio. Como las goteras. | ¿Coger a Celestino? ¿Y quién narra el vestíbulo? No tengo bufanda. | P |
| 39 | `rooms/vestibulo.js:199` | Ya consto. Pegado con chicle, como todo en esta casa. | Ya consto. Mi cara en el organigrama, con chicle. Huele a menta y a futuro. | A |
| 40 | `rooms/office.js:189` | ...Le queda una bolsa de pipas. De 2019, como todo aquí. | Le queda una bolsa de pipas. Caducada en 2019. Sigue ahí. La admiro. | C |
| 41 | `rooms/pecera.js:149` | Tiro de la puerta. Nada. Va por botonera, como los adultos. | Tiro de la puerta del ascensor. No cede. Pulso el botón, avergonzado. | X |
| 42 | `rooms/vestibulo.js:288` | Tiro de la puerta. No cede. Va con cita previa, como Paco. | Tiro de la puerta. No cede. Mejor: así nadie me ve forcejear con un ascensor. | A |
| 43 | `rooms/office.js:271` | Dentro hay posos de 2009 y un tornillo de la Ferretería Hermanos Tornillo. | La abro. Dentro, un pósit: «Si lees esto, salúdala. — C.» | H |
| 44 | `rooms/cpd.js:231` | Empujas uno y Paco te abre cuarenta tickets. Uno por armario. | Empujo uno. Paco carraspea. Paro. Paco para. Nos entendemos. | X |
| 45 | `rooms/cpd.js:249` | No. Ya he encerrado a bastante gente hoy. Bueno, a nadie. Pero no. | ¿Cerrarlo con él dentro? Eso ya lo hizo un consultor. No voy a ser el segundo. | P |
| 46 | `rooms/eventos.js:128` | Si me lo llevo, mañana en la Pecera se nos ven las ojeras de verdad. | ¿Llevarme el aro de luz? Mañana la Redacción amanecería con su cara de verdad. | P |
| 47 | `rooms/eventos.js:147` | Dentro, más lanyards. Y debajo, tazas con logo. Es un ecosistema. | Dentro, lanyards. Debajo, más lanyards. Al fondo, mi tarjeta de 2020: Pellizco. | O |
| 48 | `rooms/eventos.js:235` | Antes miro de quién es. Aquí todo tiene dueño. Y acreditación. | ¿De quién es? Una silla sin dueño es un asistente que no existe. Lo dice Pilar. | P |
| 49 | `lib/movil.js:25` | Son las 20:59. Llevo ocho meses llegando tarde a algo. | Enviado el 3 de marzo. No he ido. Ya no sé si llego tarde o si no empieza. | P |
| 50 | `lib/movil.js:28` | Pienso gratis, entonces. Como siempre. | «Pensar no es deducible». Lo enmarco. Es mi primer documento oficial. | A |
| 51 | `rooms/pecera.js:146` | El ascensor. Lo rediseñó Valentín. No se nota nada: eso es lo bueno. | El ascensor. Espejo, moqueta y un cartel: «8 personas o 1 consultor». | O |
| 52 | `rooms/pecera.js:239` | Mi ordenador. De pie no se ve. Sin silla soy un becario de pie. | Mi ordenador. Escribo de pie desde 2020. Para leer el correo necesito silla. | A |
| 53 | `rooms/sala_amazonas.js:110` | Si abro uno, me lo imputan como gasto de representación. | ¿Abrir un botellín? ¿Delante de Mercados? Llevan desde marzo mirándolos. | P |
| 54 | `rooms/vestibulo.js:214` | Le falta un tornillo. Si tiro, le faltan dos. Y a mí, el trabajo. | Tiro de la «e». Cruje. La suelto. La «e» y yo nos miramos. No se cae nadie. | S |
| 55 | `rooms/vestibulo.js:203` | Si lo empujo, se reestructura solo. Y luego me lo facturan. | Empujo una casilla. Un jefe sube un centímetro. Nadie lo nota. Ni él. | X |
| 56 | `rooms/vestibulo.js:257` | Si me la llevo, Celestino se queda sin partido. Y yo sin portero. | ¿Llevarme la pantalla del Ibex? Celestino me narraría la fuga. | P |
| 57 | `rooms/cpd.js:287` | Si me lo llevo, el CPD se pone a sudar. Y Paco con él. | Es la única brisa de Sistemas. Los servidores me odiarían en mi bemol. | C |
| 58 | `rooms/pecera.js:214` | Una taza con costra de café de la crisis de la deuda. Debería cotizar. | Taza con costra. Por los anillos, es de 2012. Lo sé por mi máster. | F |
| 59 | `rooms/catacumba.js:470` | Un tipómetro: la regla de medir texto. Teodoro la lleva como otros el rosario. | Un tipómetro. Mide en cíceros. Un cícero es lo que ocupa un adjetivo. Seguro. | F |
| 60 | `rooms/catacumba.js:488` | Les digo que voy a firmar en papel. Ninguno se ríe. Es el bigote. | Les digo: «Voy a firmar en papel». (pausa) Nadie se ríe. Lo cuento como apoyo. | S |

**Cuatro de propina (moldes «Si lo…» con dato falso):**

| # | Origen | Original | Nueva | R |
|---:|---|---|---|---|
| 61 | `rooms/vestibulo.js:213` | Si me llevo la «e», se queda en «lContable». Suena a gestoría con prisas. | *(se queda: es buena)* | — |
| 62 | `rooms/office.js:208` | Si me llevo el microondas, nueve tuppers me denuncian. | Un microondas pesa nueve kilos y cuarenta años de cola. Lo he calculado. | F |
| 63 | `rooms/cpd.js:232` | Pesan como un servidor. Porque son servidores. | Cada armario pesa una tonelada y un ticket. Paco me miraría levantarlo. | X |
| 64 | `rooms/pecera.js:180` | Esa chaqueta está fichando. Si la quito, a su dueño le ponen falta. | *(se queda: siembra P3)* | — |

**Nota de oficio (Bruno ≠ comentarista).** Diez de las sesenta acaban en una acción o en un silencio y no en una
frase: son las que más ayudan a romper el oído de «frase seca + remate». En el motor, la pausa de las líneas S es un
`api.wait(1200)` entre dos `api.say`, sin efecto de sonido.

---

## E. RECORTE DE REPARTO, CHISTE DE LA CASA A UN TERCIO Y EPÍLOGO NUEVO

### E.1 Reparto: quién se va, quién se funde, qué queda de cada guiño

Criterio: se queda quien **tiene una función en el grafo o una progresión que paga** (Evaristo), y quien no, se va o se
funde con alguien que ya está en el camino de la solución. De ~24 voces a **16 con árbol + 2 objetos + 2 cameos mudos**.

| Personaje | Decisión | Con quién | Qué se conserva, en forma mínima | Qué se borra |
|---|---|---|---|---|
| **Leoncio Quesitos** (Infografía) | **Se va** | — | Su mejor línea, «Esto, en barras. Esto, en tarta. Esto, en tarta pero triste» (`actors.js:377`), pasa a los murmullos de **Yoli**, que es quien hace gráficas. | Árbol `leoncio` entero (`pecera.dialogos.js:96-137`), sus 6 `dar:`, el sprite y la zona de la Redacción (386-480 px: pasa a ser «mesas vacías con chaqueta», encargo al fondista), el titular de hazaña `herminia_de_alta`, los créditos de su sección. |
| **Herminia** (su herramienta) | **Se va** (con su micro-puzle MP1) | — | La idea («la casa da de alta antes a un portátil que a un chaval») sobrevive en **una línea de Paco** en el cierre del ticket nº 1 (§C.5): «Al portátil del consultor le di alta en cuarenta segundos. Al chaval, nada.» | `herminia_portatil`, `P_ALTA`, `AN_HERMINIA`, `CO_HERMINIA`, la entrada 5 de la tele de la Sala (`sala_amazonas.js:22`), el inserto de infografía del epílogo (`final.js:168-170`), flags `leoncio_acepta_alta`, `herminia_de_alta`, `infografia_integrada`, `anselmo_dijo_regla`. |
| **Anselmo Monolito** (director de Desarrollo) | **Se funde** | **Nemesio** | Nemesio hereda: la cinta de carrocero como frontera de Desarrollo, «¿Y si funciona? Peor. Si funciona, la gente se acostumbra.» y «Si algo se rompe a las tres, ¿quién baja? Paco abre ticket. Bajo yo.» (§B.3). Los aparatos de «IA (DESARROLLO)» que Desarrollo impone a los demás (narrador del Ibex, corrector de Aurora) **se quedan como atrezo** con su línea de Mirar. | Árbol `anselmo`, sprite, murmullos, `pantalla_anselmo` (queda como pantalla de Nemesio con dos líneas: «ACCESO CONCEDIDO: TITULATOR 3000 (USUARIO INTERNO)» y, en el Acto III, «REVOCADO. Con fecha de hoy. Y de julio.»). |
| **Custodia Precinto** (Secretaría) | **Se va** | (su pista, a **Celestino**) | Celestino, Acto III, línea de rumor: «En agosto alguien pidió un boli desde el sótano. Por debajo de una puerta.» La persiana de la Secretaría queda como hotspot cerrado: «SECRETARÍA: CERRADO POR INVENTARIO. DESDE 2012.» | `pecera.secretaria.js` entero (árbol, MP3 «boli muerto, boli nuevo»), el objeto `boli_muerto` (Aurora conserva en Mirar los bolígrafos: «Todos vivos menos uno, que yace.»), el crédito «Material». Segundo sistema de pistas: fuera. |
| **Tadeo Adjunto** | **Se funde** | **Borja** | Los cinco «RV:» del móvil pasan a ser de **Borja**, con la jerga traducida en la misma línea (§E.5). El cameo del D4 pasa a Borja. El portátil de la planta 2 queda como «portátil de Borja» (2 líneas). | `portatil_tadeo` (árbol), las 9 entradas del portátil con LCP/INP/CWV (`ecosistema.js:20-31`), el nombre en créditos. |
| **Valentín Retícula** (Diseño y Producto) | **Cameo corto** | — | Sprite en su mesa, cascos sin música. Mirar + 1 línea + 1 réplica (§E.2). | Árbol `valentin` (7 opciones), 4 `dar:`, murmullos, `monitor_valentin` (la aventura gráfica dentro de la aventura), la línea del ascensor (`pecera.js:146`), los créditos de dirección de arte y de su departamento. |
| **Coro de Desarrollo** | **A un tercio** | — | 4 discusiones + 2 «de fondo» (§E.2); su árbol, de 7 opciones a 3. | 9 discusiones, 2 escenas de fondo, `CO_BANDEJA`, `CO_HERMINIA`, la intervención del P05 (`pecera.escenas.js:157`), su escena del epílogo. |
| Pilar, Borja, Maripaz, Evaristo, Gertrudis, Lector Medio, Ramírez | **Se quedan** | — | Pilar con «cinco minutos» a tope 5; Maripaz con «cariño» a tope 6; Borja crece con Tadeo. | — |

**Coste de texto:** salen ~300 líneas (las de los cinco que se van y el exceso del coro y de Valentín). Entran ~120
(árboles reescritos, momentos de situación). Saldo: el juego se lee unos 4-5 minutos más corto y con menos voces.

**Grafo:** ninguno de los que se van está en el camino crítico (crítica §5: 0 líneas en la partida óptima). Lo único
que tocaba el grafo de forma opcional era MP1 (Herminia) y MP3 (boli muerto): se borran enteros, con sus flags; MP2
(Evaristo y la coma) se queda. Los titulares de hazaña de `herminia_de_alta` y `custodia_ablandada`
(`pajarera.js:27-28`) se quitan de la lista.

### E.2 El chiste Diseño-contra-Desarrollo, reducido a un tercio

**Medida de partida:** 45 menciones de «Diseño» (Bruno 19), 13 discusiones + 4 de fondo cada 14-24 s, árbol del cameo
de 7 opciones, epílogo y dos créditos. **Medida de llegada:** ≤ 15 menciones, 6 apariciones del coro por partida como
mucho, 2 líneas del cameo, nada en el epílogo ni en los créditos.

**Lo único que queda del chiste (5 golpes, presentación → repetición → giro):**

1. **Presentación** (7.2): D1 «¡Ha sido Diseño!» / IÑI «...No he dicho nada malo todavía.» / D2 «Por si acaso.» (§C.6).
2. **Discusión de la silla** (la única de las cuatro que nombra a Diseño, ver abajo).
3. **La bandeja** (hotspot, se queda): «ENTREGAS DE DISEÑO Y PRODUCTO. Todo con fecha y a su hora.» Al abrirla, el aviso
   de 2017 sobre la pantalla («LEÍDO (PERO NO)»), que sigue funcionando como pista del P05.
4. **Consecuencia** (árbol del coro, con `cms_vivo`): BRU «El CMS lo he arreglado yo.» / D2 «Lo hemos arreglado
   nosotros.» / BRU «He desenchufado una pantalla.» / (pausa) / D1 «...Pues la pantalla la eligió Diseño.» (se queda).
5. **Giro** (cameo): la única vez que Valentín abre la boca.

**El cameo de Valentín, entero:**

```
(Mirar)
BRU   Valentín Retícula, de Diseño y Producto. Cascos puestos. Sin música.
(Hablar, 1.ª vez)
BRU   ¿No le molesta que le culpen de todo?
(Valentín se quita un casco. Mira a Bruno. Espera.)
BRU   ...Nada. Perdone.
(se lo vuelve a poner)
(Hablar, siguientes; o cuando el coro grita «¡Diseño!» con Bruno delante)
VAL   Está en la bandeja.
(vuelve a su pantalla)
```

Sin autoelogio, sin «mi juego», sin dirigir la aventura, sin estar en el epílogo. Es el único del juego que no reacciona
al ruido: el chiste es su calma, no su razón.

**Las 4 discusiones del coro que quedan** (y 2 de fondo, `DE_FONDO` «yoli» y «aurora», que se quedan como están: veladas,
sin opción ni objeto que las nombre):

```
(1) D1   El aire está a veintidós.
    D2   En hexadecimal eso es otra cosa.
    D1   ¡No lo pasemos a hexadecimal!
    D3   No.
(2) D1   Ha llovido y ha bajado el tráfico.
    D2   ¡Abrid una incidencia a la lluvia!
    D1   La lluvia no es nuestra.
    D3   No.
(3) D1   ¿Quién ha tocado mi silla?
    D2   Tu silla gira. Se ha tocado sola.
    D1   ¡Fallo de diseño!
    CORO ¡DISEÑO!
(4) D1   Internet está mal hecho.
    D2   Desde el principio.
    D3   ...Sí.
```

**Ritmo (arreglo nº 4 de la crítica):** cada 60-120 s, nunca mientras haya un globo bloqueante, un menú o el móvil
abiertos; máximo 3 por visita a la Redacción; orden fijo 1→4 y luego solo las de fondo; la (4) es la última y el D3 que
dice «...Sí» es el remate del coro: después, silencio para el resto de la partida.

**Árbol del coro (3 opciones):** «¿Por qué gritáis tanto?» (se queda, con la línea de Nemesio) · «¿Con quién estáis
enfadados?» (se queda) · «El CMS lo he arreglado yo.» (si `cms_vivo`, el golpe 4) · «Me voy.» → CORO «¡Vale!».

**Otras menciones que se borran:** la floja «Eso es cosa de Diseño.» (pasa a «Eso lo ha hecho la IA.», §F.3); murmullos
de Nemesio sobre Diseño (`actors.js:243`, `pecera.js:440`), de Celestino (`vestibulo.js:377`), de Paco
(`cpd.js:344`) y de Valentín; `rama_diseno`: una sola línea de Mirar, informativa («La rama de abajo: DISEÑO Y PRODUCTO.
De ella cuelga VACANTE.»); la línea de Bruno en el enchufe que nombra a Diseño (`pecera.js:201`) dice ahora «Hay un
aviso de 2017, pero un aviso no es un ticket. Paco tendrá el número.»

### E.3 Epílogo nuevo, línea a línea (sustituye `final.js:50-188`)

Orden: Sábado, 6:00 → **Vestíbulo** (Rubén, Íñigo y la taza del 98 = S6, Gervasio, el papel, Evaristo si procede, la
plaza) → **Yoli baja** con el abrigo → **la abuela** → fundido → **FE DE ERRATAS** → créditos. Ya no se corta a la
Redacción: no hay coro, ni «Diseño soy yo», ni cuarta pared.

```
NAR   Sábado, 6:00.
(Vestíbulo. Amanecer en la puerta de la calle. Celestino tras el mostrador.
 Rubén, con la capucha bajada, mira la calle como si fuera un estreno.)
RUB   ¿Sigue gobernando el mismo?
CEL   ¿Tú eres el nuevo?                                    (4/5)
RUB   Sí.
(pausa)
RUB   ...Sí. Qué bien suena.

(Tin. Se abre el ascensor. Sale Íñigo con una caja: pósits, la matriz, el portátil y una taza.)
CEL   ¡Y sale el consultor por la banda! ¡Con la caja! ¡Con...!
(Celestino deja de narrar. Mira la taza.)
CEL   Esa taza es de 1998. Del becario de marzo.
IÑI   Es una taza de marca. Muy de posicionamiento.
CEL   La dejaste en este mostrador. Veintiocho años guardándotela.
IÑI   Yo no fui becario. Fui un perfil junior con mucho recorrido.
CEL   «Contratar al becario de marzo». Lo tiene Nemesio. En HECHO (PERO NO).
(silencio largo. Íñigo mira la taza)
IÑI   ...Fui becario. Cuatro meses. A mí tampoco me dio nadie de baja.
BRU   ¿Y qué hiciste?
IÑI   Me fui. Y volví facturando. Es lo que se hace.
BRU   Yo no voy a hacer eso.
IÑI   Eso dije yo. Con esas palabras.
(se la guarda bajo el brazo)
IÑI   Suerte, Bruno.
(Es la primera vez que dice su nombre. Bruno no contesta.)

(Del ascensor, Gervasio, con su carpeta vacía.)
GER   Íñigo. Hay una beca en Mercados. Se podría...
IÑI   ¿Cuándo?
GER   Se está hablando. Ahora. Esto ya es hablarlo.
(Salen los dos: uno a la calle, otro hacia el garaje.)
CEL   ¡Y se retiran los dos del campo! ¡Uno con taza! ¡El otro, con beca!

(Un golpe en la puerta: la furgoneta del polígono deja un fardo en el mostrador.)
CEL   ¡Ha llegado el papel! ¡Recién salido! ¡Huele a Goyita!
(Bruno coge uno. Plano detalle: PÁGINA 7. Titular, firma en rojo.)
BRU   «Hidrovoltia lanza una opa sobre Banco Robledal».
BRU   «Por Bruno Pellejo». Con jota. Con dos eles.
BRU   ...
CEL   ¡Hidrovoltia se lanza a por el Robledal! ¡Eso es opa, árbitro!
BRU   Celestino, que la noticia es mía.
CEL   ¿Tú eres el nuevo?                                    (5/5)
BRU   No. Soy Bruno Pellejo.
(pausa)
CEL   ...Pues bienvenido, Bruno Pellejo. Ya te ve hasta el torno.

[si correo_evaristo_listo · adenda 9.8a, abreviada]
(Entra don Evaristo, con el periódico doblado por la página 7.)
EVA   Pellejo. Lo he revisado en el periódico. Con jota y dos eles. Correcto.
BRU   Gracias, don Evaristo.
EVA   Le escribiré un correo para felicitarle.
BRU   ¿Y si me lo dice ahora?
(pausa de 1,4 s. Se lo piensa. Mucho.)
EVA   ...Felicidades. Es la primera vez que lo digo sin adjunto.
[/si]

CEL   Y esto ha llegado por fax. De la Redacción de papel. Para ti.
CEL   «PLAZA 1. NO LA USO DESDE 1997. TUYA, CHAVAL. QUE NADIE ME DESEE NADA.»
BRU   No tengo coche.
CEL   Ni bici.
(tacha la plaza 1 en el cuadro de llaves)
CEL   La línea de sucesión acaba de enloquecer.

(Baja Yoli por la escalera, con el abrigo puesto y el colirio en la mano.)
YOL   Bruno. Esa cuenta que comenta «abrígate» en todo...
YOL   Se ha leído tu opa entera. Cuarenta y siete minutos. Récord de la casa.
BRU   ¿Cuántos lectores?
YOL   Una. Pero se lo lee todo. La tengo como KPI.
YOL   Se me ha movido la gráfica. Hacia arriba. No sé qué hacer con la cara.
(sale a la calle)

(Suena el móvil. Primer plano: «Abuela».)
ABU   ¿Bruno? ¿Has comido?
BRU   Abuela. Salgo en el papel. Página 7. Con mi nombre bien escrito.
ABU   Ay, hijo. El papel lo dejé en 2011, que me manchaba el sofá.
BRU   ...
ABU   Yo te leo todas las mañanas en el móvil. Te pongo un corazoncito.
BRU   ¿En todo?
ABU   En todo. Hasta en lo del Euríbor. No lo entiendo, pero lo escribes bonito.
[si rumor_firma_n ≥ 4 · adenda 9.8b]
ABU   En el pueblo digo que eres el dueño. Que suena más.
BRU   Abuela...
ABU   Tú déjame. En el pueblo, si lo dice mucha gente, sale.
[/si]
ABU   Y te pongo «abrígate». Que nunca contestas.
(Bruno no dice nada. Baja el móvil. Teclea con un dedo.
 Primer plano del móvil: bajo la pieza, un comentario nuevo.)
NAR   Bruno Pellejo respondió: «Vale, abuela.»
(pausa)
ABU   ¡Ay! ¡Me ha contestado el periódico!
(Bruno sale a la calle con el periódico bajo el brazo. Fundido a negro.)
```

**Por qué funciona como final:** el último golpe es de la abuela y es el mismo malentendido que la define (no escucha),
pero esta vez al revés: Bruno por fin le contesta, en su idioma y por su canal. Bruno termina sin reencuadrar nada: sus
últimas frases son literales («No. Soy Bruno Pellejo.» / «Vale, abuela.»). La línea de Íñigo («Eso dije yo. Con esas
palabras.») convierte el guiño del 98, escondido hoy en un pósit, en la escena que la crítica pedía (§5).

### E.4 Créditos (sustituyen `final.js:195-232`)

Siguen abriendo con el recuadro de la fe de erratas (se queda **literal**) y con el plano de Aurora desmayándose sobre
el Libro de Estilo (se queda). Fuera: la sección de Leoncio y Herminia, «Errores: Diseño (que no fue)», Material/Custodia, el crédito del
departamento de Valentín, Dirección de arte/Valentín y Reenvíos/Tadeo.

```
FE DE ERRATAS
En la edición de ayer, donde decía «inteligencia artificial»
debía decir «Rubén».
Donde decía «Por Bruno Pellejo»
debía decir «Por Bruno Pellejo».
Lamentamos el acierto.

Guion ............ Asignado a: el equipo de guion (tras tres reuniones rápidas).
Duelos ........... Asignado a: quien no se escaqueó.
Motor y pegamento  Asignado a: Sistemas. Ticket nº 2. Estado: cerrado.
Fondos ........... Asignado a: tres artistas con tipómetro.
Música ........... Asignado a: un secuenciador de onda cuadrada.
                   (plano de Aurora en la Redacción de papel)
Café ............. Asignado a: Gertrudis. Se lo habían ganado.
Controlling ...... [con correo] Asignado a: el único que leyó hasta el final.
                   [sin correo] Asignado a: un correo que nadie quiso oír.
Eventos .......... Asignado a: Pilar Escaleta. Empezamos en cinco minutos.     (5/5)
Marketing ........ Asignado a: Borja Engagement. Lo ha compartido sin leerlo.
Salas ............ Asignado a: Ramírez (viernes, 20:59, recurrente).
Rumores .......... Asignado a: la planta del vestíbulo (micrófono de 1994).
Plazas de garaje . Asignado a: Bruno Pellejo (plaza 1, sin coche).
Lector Medio ..... Atrezo, focus group 2014. Asintió.

Ninguna rotativa fue apagada durante el desarrollo de este juego.

Gracias por jugar. Abrígate.
```

**Hilo en la esquina** (sustituye `final.js:235-240`; entra al final de los créditos):

```
De: Borja Engagement   RV: Fe de erratas. ¿Esto lo ha escrito la IA?!!
De: Bruno Pellejo      RE: No. Un becario.
De: Evaristo Salvedad  RE: Cuarenta y ocho euros. Con coma.
De: Rubén              RE: Dos becarios.
```

**Poscréditos:** Ramírez recoge su chaqueta del Lector Medio caído: «¿Me he perdido algo?» / NAR «TODA LA REDACCIÓN:
"No."» (se queda; paga el P3 y no compite con la abuela porque va después de los créditos). **La última imagen de la
impresora («BANDEJA 2 INSTALADA») se quita:** era un chiste de Tadeo y alargaba el final; tras Ramírez, FIN sobre negro.

### E.5 Limpiezas de voz asociadas al recorte (todas pequeñas)

- **Tríada del pósit rosa:** se queda solo en el árbol de Íñigo (§C.6). Fuera de `pecera.escenas.js:131` (Yoli lo dice
  con su tic: «Te ha puesto en rosa. Yo me preocuparía — 3.402 — un poco.») y de `pajarera.js:177` (los pósits: «Cuatro
  colores. Uno por estado de ánimo. Íñigo los tiene contados.»).
- **«Es lo más bonito que me han dicho/escrito» ×2:** se queda el de Teodoro (`catacumba.js:335`). Nemesio
  (`pecera.dialogos.js:77`) dice: «Descopear. Nadie se había atrevido delante del tablero. Va a HECHO.»
- **Despedida incoherente de Nemesio** (`pecera.dialogos.js:88`, «Prometo cuidarlo.»): la opción pasa a «¿Y si Pilar
  pregunta por el álbum?» → NEM «Le digo que está en HECHO. Lo entenderá. O no.»
- **«Descopear»** (llave del P10) se queda, pero Borja lo traduce al decirlo (P14a): BOR «¡Hemos descopeado la ética del
  Q3! O sea, quitado del plan. Con cariño.» / BRU «Descopear. Me lo apunto.»
- **RV de Borja (antes de Tadeo)**, jerga traducida en la misma línea: 1) «RV: Cómo hacer que la web cargue en la mitad
  de tiempo (40 págs.)!!» / BRU «Cuarenta páginas para que cargue antes. Las abro mañana. Si cargan.»; 2) «RV: RV: Cómo
  instalar una bandeja 2 en una impresora sin bandeja 2.» (se queda); 3) «RV: RV: RV: La IA dice que la web va más
  rápida sin lo más grande!!» / BRU «Lo más grande de un periódico es la portada. Mal asunto.»; 4) y 5) se quedan.
- **El aprendizaje de R15** pasa al árbol de Rubén (camino crítico), nueva opción «¿Te llegaban correos de Borja?» →
  RUB «Trescientos al día. "Lo he consultado con la IA y está de acuerdo".» / RUB «La IA era yo. Le decía que sí. Por no
  discutir.» ⟶ `rep_15`.
- **Segundo café** (arreglo nº 10): con `cafe` dado a Aurora, «Buenas noches, Gertrudis.» ya no sirve café: GTR «YA TE
  DI UNO. NO SOY UNA FUENTE. SOY UNA CAFETERA.»
- **Bruno ya no dice** «Lo hablamos», «cariño», «acreditado», «cinco minutos» ni «Diseño» fuera de la cita entre
  comillas: son de otros.

---

## F. EL DUELO «RESPONDER A TODOS»: LAS 16 PAREJAS, REVISADAS

### F.1 El problema de voz del duelo (además del de interfaz)

1. **El chiste se gasta antes de tiempo:** la anécdota con que se aprende la réplica la cuenta entera, y en el duelo el
   jugador elige una frase que ya le hizo gracia. **Solución:** la anécdota da **la clave** (de qué va la réplica) y el
   remate entero se oye **por primera vez en el duelo**. La libreta guarda la réplica completa (hace falta para elegir),
   pero el jugador que no la relee la estrena en el hilo.
2. **El ataque es el mismo en las cuatro bocas.** El motor ya permite `attackText` por rival (`engine/duel.js:89`):
   cada rival dice el ataque **con su voz**, de modo que hay que entender la idea, no reconocer la frase.
3. **Acertar no tiene premio de personaje:** el `hurt` rota dos frases genéricas. **Solución:** `hurtByPair` por rival
   (el motor ya lo lee de `opp.hurtByPair`, `engine/duel.js:107`) en las parejas que tocan la vida del rival.
4. **Fallar no hace gracia:** misma contestación para todos los rivales; la derrota siempre dice «Lo que diga Gervasio»
   (también contra Gervasio). **Solución:** contestaciones por rival a cada floja (`answers[id]`, ya existe), *taunts*
   propios que comentan el despiste y una línea de derrota por rival (requiere que `texts.defeatLine` admita un valor por
   duelo: cambio de una línea en el motor).
5. **«Te lo pongo por escrito»** abre los cuatro duelos: se queda **solo para Íñigo** (el clímax).

### F.2 Las 16 parejas

| ID | Ataque (base) | Réplica hoy | Decisión | Réplica nueva | Clave al aprenderla (no el remate) | Por qué |
|---|---|---|---|---|---|---|
| R01 | Como ya comenté en mi anterior correo, que parece que nadie ha leído... | Lo leímos todos. Por eso no contestó nadie. | **Se queda** | — | Tablón del Vending: se lee entera (es un hilo impreso; leerlo es el chiste del hilo del yogur). | Top 3 de la crítica. Gana con `hurtByPair` (abajo). |
| R02 | Con el debido respeto... | Gracias por avisar antes de faltármelo. | **Se queda** | — | Aurora: «le contesté dándole las gracias por avisarme. Antes de lo que venía» (§C.2). | La mejor réplica del juego. En D2 paga: Teodoro reconoce la frase de Aurora (abajo). |
| R03 | Esto lo necesitaba para ayer. | Ayer estaba con lo de anteayer. Pídeselo a mañana, que está libre. | **Reescrita** | Ayer no puedo. Te miro hueco para anteayer. | Gertrudis: «YOLI LE CONTESTÓ CON UNA FECHA IMPOSIBLE.» | La de hoy son dos chistes en 79 caracteres; la nueva es uno, más corto, y suena a agenda de verdad. |
| R04 | Es que tú eres el que mejor escribe. | Y tú el que mejor delega. Cada uno con su don. | **Reescrita** | Y tú el que mejor delega. Por eso me escribes a mí. | Gertrudis: «NEMESIO LE CONTESTÓ ALGO DE DELEGAR.» | «Cada uno con su don» es coletilla; el remate nuevo señala la situación (el que escribe el correo es el que delega). |
| R05 | Que esto no salga de aquí. | Tranquilo: de aquí no sale ni el wifi. | **Se queda** | — | Celestino: Bruno completa la frase él mismo (§C.1). | Corta y local (el wifi de la casa). |
| R06 | ¿Esto lo has contrastado? | Con dos fuentes y media. La media dijo «yo no te he dicho nada». | **Se queda** | — | Fax enmarcado (se lee entera: es una reliquia). | Es oficio; en D2 Teodoro confiesa ser la media fuente. |
| R07 | Me consta que esto ya lo hablamos. | A ti te consta. A mí me consta que hablabas tú. | **Se queda** | — | Ordenador de Gervasio: se lee entera (es su carpeta de Enviados, y es de Teodoro). | Funciona contra Gervasio e Íñigo, que hablan sin decir. |
| R08 | Te escribo desde el más absoluto cariño. | Y yo te leo desde el más absoluto modo avión. | **Se queda** | — | Yoli: «Le contesté con lo del modo avión. Me ha puesto en copia a mi madre.» | Top 4. Maripaz la recibe con su letra pequeña. |
| R09 | Ese dato está sacado de contexto. | Dame el contexto y lo pongo en el subtítulo, que ahí no lo lee nadie. | **Reescrita** | Tráeme el contexto. Le hago una pieza aparte: «El contexto, explicado». | Nemesio: «Le dije que al contexto le hacía una pieza aparte. No hemos vuelto a comer.» | La de hoy se explica a sí misma; la nueva es un chiste de redacción web (la pieza «explicada»), y es de Bruno. |
| R10 | Estamos analizando todas las opciones. | O sea, que no sabéis qué hacer, pero en tabla dinámica. | **Se queda** | — | Gertrudis: «PACO LE HABLÓ DE UNA TABLA DINÁMICA.» | Top 5. Es la primera carta del D4: abre fuerte. |
| R11 | Quedo a la espera de tus comentarios. | Espera sentado. Si encuentras silla. | **Se queda** | — | Correo de Bruno (sentado por fin): se lee entera; paga el puzle de la silla. | Callback al P3: la gracia es haber conseguido la silla. |
| R12 | Hay que poner las luces largas. | Las pongo, pero el coche es de empresa y no pasa la ITV. | **Reescrita** | Puestas. Ahora se ve perfectamente que no hay carretera. | Paco: «Le contesté algo de que ya se veía la carretera. O de que no había.» | La de hoy necesita dos pasos (coche de empresa → ITV); la nueva es una imagen y es justo lo que pasa con el Plan Cero Papel. |
| R13 | No es un despido: es una salida en valor. | Claro. Y la carta de despido es una newsletter personalizada. | **Se queda** | — | Rubén: «Le escribí también la respuesta. Por si un día alguien se la decía.» | En D4, Rubén está en la sala: `hurtByPair` le deja reclamar la autoría. |
| R14 | Esto lo podemos ver en una reunión rápida. | O en un correo de una línea. Este. De nada. | **Reescrita** | Perfecto. ¿Te va en marzo? Es cuando acaban las rápidas. | Gertrudis: «BORJA LE PROPUSO MARZO. ELLA SIGUE ESPERANDO.» | La de hoy es la variante de «esto podría haber sido un email», de la **lista negra** de la biblia (§1.3). La nueva paga el «desde marzo». |
| R15 | Lo he consultado con la IA y está de acuerdo conmigo. | Normal. Se lo has preguntado tú. | **Reescrita** | Lo sé. Me lo ha contado ella. Se llama Rubén. | Rubén (nueva opción, §E.5): «La IA era yo. Le decía que sí. Por no discutir.» | Solo está en D4, cuando Rubén ya ha entrado en la sala: la réplica es la situación. Se aprende en el camino crítico (antes, en el portátil de Tadeo, que se va). |
| R16 | Eso es un detalle sin importancia. | Una coma también lo era. Hasta que alguien la firmó. | **Se queda** | — | Evaristo (se queda la anécdota, es su voz). | Paga a Evaristo en el clímax. |

Resumen: **10 se quedan, 6 se reescriben** (R03, R04, R09, R12, R14, R15). Todas las nuevas ≤ 80 caracteres y sin
«Como…».

### F.3 Cada rival dice el ataque con su voz (`attackText`)

| Rival | Carta | Ataque en su voz |
|---|---|---|
| D1 Maripaz | R08 | Te escribo desde el más absoluto cariño. (*Cariño no reembolsable.) |
| | R04 | Es que tú eres el que mejor escribe, cariño. Lo digo de corazón. Y gratis. |
| | R11 | Quedo a la espera de tus comentarios. Y de tu llamada a Siestatón. |
| | R14 | Esto lo vemos en una reunión rápida. Con croquetas, si las patrocina alguien. |
| D2 Teodoro | R06 | ¿CONTRASTADO? FUENTES. NÚMERO. |
| | R02 | CON EL DEBIDO RESPETO... |
| | R03 | ESTO, PARA AYER. AYER CERRÉ A LAS 21:00. |
| | R09 | DATO SIN CONTEXTO. NO CABE. |
| D3 Gervasio | R07 | Me consta que esto ya se... se habló. |
| | R01 | Como ya se comentó en un correo anterior, que parece que no se leyó... |
| | R14 | Esto se podría ver en una reunión rápida. Que se convocaría. |
| | R03 | Esto se necesitaba para ayer. Por alguien. No digo quién. |
| | R05 | Que esto no salga de aquí. Ni de mí. Sobre todo de mí. |
| D4 Íñigo | R10 | Estamos poniendo en valor todas las opciones. |
| | R12 | Hay que poner las luces largas. Y mirar muy lejos. Más lejos. |
| | R13 | No es un despido: es una salida en valor. |
| | R05 | Que esto no salga de aquí. Es información de alto impacto. |
| | R01 | Como ya comenté en mi correo anterior, que parece que nadie ha leído... |
| | R07 | Me consta que esto ya lo alineamos. |
| | R15 | Lo he consultado con la IA y está de acuerdo conmigo. |
| | R16 | Eso es un detalle sin importancia. Una coma. |

### F.4 Acertar hace gracia: reacción del rival a la pareja exacta (`hurtByPair`)

```
D1 · R08   MAR   ¿Modo avión? Eso me lo patrocina una aerolínea. (*No.)
D1 · R11   MAR   ¿Sentado? Si encuentras silla, te la facturo.
D2 · R02   TEO   ESO ME LO DIJO ELLA. EN 1996.
           TEO   ...CABE.
D2 · R06   TEO   LA MEDIA FUENTE ERA YO. NO LO REPITAS.
D3 · R07   GER   Me consta que... Bueno. Se constaba.
D3 · R14   GER   ¿Marzo? Marzo está muy bien. Se agradece. Pero no.
D4 · R10   IÑI   Interesante. Lo pongo en azul.
D4 · R12   IÑI   ...Eso es una visión muy pesimista de la carretera.
D4 · R13   IÑI   Eso lo escribió alguien brillante.
           RUB   Yo. Perdón.                         (onHit: requiere pasar la pareja a onHit)
D4 · R15   IÑI   ...Rubén, ¿tú le has contado algo?
           RUB   TODO. Perdón. Se me escapa.
D4 · R16   IÑI   Esa coma no estaba en mi framework. ★
```

### F.5 Fallar también hace gracia

**Flojas** (siempre en el menú). Se quita «Eso es cosa de Diseño.» y entra «Eso lo ha hecho la IA.».

| Floja | Maripaz | Teodoro | Gervasio | Íñigo |
|---|---|---|---|---|
| Te lo miro y te digo. | Te lo miro y te facturo, cariño. | MIRAR NO CUENTA. MEDIR, SÍ. | Eso es mío. No me lo copies. | Perfecto. Te pongo en «Pendiente». Es azul. |
| ¿Eso no lo llevaba otro departamento? | Lo llevaba. Ahora lo llevas tú. Con IVA. | AQUÍ NO HAY OTRO. HAY ESTE. | Lo llevaba. Se ha delegado. Mira quién está delante. | Ya no hay departamentos. Hay sinergias. La tuya es esta. |
| ¿Me lo pones por escrito? | Por escrito, cariño, es más caro. | ES UN FAX, CHAVAL. MÁS ESCRITO, IMPOSIBLE. ★ | ¿Por escrito? ¿Con mi nombre? No, no, no. | Ya está por escrito. En la diapositiva 247. |
| Eso lo ha hecho la IA. | ¿La IA? ¿Y quién la patrocina? | LA IA NO MIDE. NO CABE. | Pues se le delega a la IA. ¿Tiene agenda? | La IA no se equivoca, Vacante. Se optimiza. |
| ¿Y usted cómo se encuentra? De salud, digo. | Estupendamente. La plaza no se hereda, cariño. | MÁS SANO QUE LA GOYITA. Y LA GOYITA TIRA. ★ | Hoy me lo han preguntado tres veces. ¿Estoy mal? | Yo no tengo plaza. Tengo chófer. Es escalable. ★ |

**Réplica aprendida pero equivocada** (*taunt*, rota por rival; comentan el despiste):

```
MAR   Eso es de otro hilo, cariño. Y de otro cliente.
MAR   Muy bonito. Cero euros. ★
MAR   ¿Me contestas a otra? Eso se llama spam.
TEO   TREINTA Y OCHO CARACTERES DE NADA. ★
TEO   RESPUESTA A OTRO FAX. DEVUELTO.
TEO   ESO, EN PAPEL, ES UN LADRILLO. ★
GER   Eso se... Eso no venía a cuento. Se agradece.
GER   Se toma nota. La tomas tú.
GER   Muy bien. Con copia a ti.
IÑI   Ese input no escala. ★
IÑI   Contestas a una pregunta que no he hecho. Eso es visión.
IÑI   Lo pongo en azul. Excusas.
```

**Entradas** (fuera «Te lo pongo por escrito» salvo Íñigo):

```
D1  MAR   ¿Llamar yo a Siestatón un viernes? Te lo mando por correo. Con copia.
D2  TEO   ¿TÚ? ¿EL DE LA WEB? ¿EN MI PÁGINA? CONTESTA.
D3  GER   Mejor por escrito. Que conste que lo has pedido tú.
D4  IÑI   Perfecto. Te lo pongo por escrito. ★
```

**Derrota** (una por rival; el motor hoy usa una sola, `duelo.js:96`):

```
D1  NAR   RESPUESTA AUTOMÁTICA DE COMERCIAL: «Te llamamos nosotros.»
D2  NAR   RESPUESTA AUTOMÁTICA DEL FAX: «SIN PAPEL PARA USTED.»
D3  NAR   RESPUESTA AUTOMÁTICA DE DIRECCIÓN: «Lo que diga Gervasio.»
    GER   ...¿Yo?
D4  NAR   RESPUESTA AUTOMÁTICA DE OPTIMAL BRAINS: «Gracias por su feedback.»
```

**Cameo del D4** (`duelo.js:52`, pasa de Tadeo a Borja): «Borja Engagement respondió a todos:» / «¡Qué hilo más bonito!
Lo comparto!!».

**Comodín** (se queda): «Enviado desde mi móvil, disculpa la brevedad.» → «Te espero.» / Teodoro: «Enviado desde mi
fax. Disculpa la longitud.» ★

---

## G. LO QUE NO TOCARÍA

Protegido por la crítica o porque ya tiene voz propia y progresión:

1. **La intro entera** (`vestibulo.js:57-99`): la llamada de la abuela, «Eso es una bebida, hijo», «Ya está. Lo he dicho
   en el grupo del pueblo. Abrígate.», el torno «USUARIO NO CONSTA EN ORGANIGRAMA» y «Pues no te ha visto ni el torno.»
2. **P1 y su premio:** «BIENVENIDO, VACANTE.» / «...Vacante. Bueno. Es un cargo.» y las negativas que guían
   («El chicle solo no. Necesito algo que pegar. Por ejemplo, mi cara.», «Se cae. Ni mi foto quiere estar en el
   organigrama.»).
3. **Los cuatro «¡ajá!»:** las copias rechazadas como papel del fax; el recorte del 26 % que deja 31 líneas en 23
   (las cuentas, al céntimo); el Titulator que es Rubén; la VACANTE. Cambio sus líneas de alrededor, no su lógica.
4. **El final de la abuela** (líneas `final.js:139-151`, literales) y **el recuadro de la fe de erratas** (`final.js:199-204`),
   incluido «Lamentamos el acierto.»
5. **Los titulares reactivos del Titulator** (`pajarera.js:19-39`), salvo los dos de personajes que se van; la súplica
   «AYÚDAME ESTOY EN EL ARMARIO 27» y su plano detalle.
6. **Las cuatro respuestas de `B_JUST`**, el cuadruplicado y «...Correcta. Aprobada. Vete. Me has hecho daño.»
7. **Teodoro por fax** y su remate: «ESTOY FUERA DE LA OFICINA HASTA QUE EL PAPEL DEJE DE EXISTIR.» → «...Es lo más bonito
   que me han escrito en veintinueve años.»; «Goyita. Página 7 cerrada. Esta noche firma un chaval.»; «Goyita. Tira.»
8. **Evaristo completo:** las llamadas L1-L5 (`game.js:111-135`), el árbol «Escuchar hasta el final» (MP2) y el héroe
   de la coma del clímax.
9. **Gertrudis y sus códigos E-xx**, incluido «E-27: AYÚDAME. NO ES UN ERROR.» y el «E-00» de los créditos.
10. **Celestino y el Ibex como partido** (`vestibulo.js:27-38`) y los payoffs de «¿Tú eres el nuevo?» con Rubén.
11. **Rubén:** «No me encerró. Me dio una silla y wifi…», «Te he titulado toda la noche…», «Entonces el nuevo soy yo.»
12. **El clímax** (`climax.js:154-230`): la caída del Lector Medio, «...¿Y quién ha validado la fase 1?», «Diecinueve años
   y nadie lo había preguntado.», «"Prescindible. Caro."», «EL VIAJE CONTINÚA» / «...Ahora no.», Begoña rechazando la
   factura «al lado del ministro» y «¿Eso que suena es el papel?» / «Eso es el papel.»
13. **El acta:** «Acuerdos de la última reunión: uno, pedir más café. Dos, ninguno más.»
14. **Las 45 respuestas por defecto** que no llevan «Como…» (solo cambio las 7 que sí, §D 1-6).
15. **El arte de las salas**, la geografía del vestíbulo y la puesta en escena de los primeros planos; los nueve verbos;
    el grafo de puzles y todos los flags del walkthrough (`tools/walk-data.mjs`), salvo los avisos **[WT-cambio]**
    opcionales de §C.5.
16. **Las reglas de la casa**: nada de «Consejo», ningún director del periódico, el Lector Medio nunca en una cabecera ni
    tras la mesa de un jefe, sin marcas reales, líneas ≤ 80 caracteres, sin minijuegos, sin muertes ni callejones.
