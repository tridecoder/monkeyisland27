# FE DE ERRATAS — Adenda de producción: «Guiños de la casa»


> **Cierre del rediseño (órdenes de dirección iii-v, vinculantes):** la sala del café se llama **Vending** (id `office`);
> la Redacción de papel (`catacumba`) está **al lado** de la Redacción, al mismo nivel, tras una puerta doble con umbral
> de latón (ya no se entra por el Vending); la **Secretaría de Custodia** vive en la Redacción, junto a esa puerta. Todas
> las líneas e ids de Custodia siguen igual; MP3 queda «a unos metros»: el boli muerto de Aurora está en la sala de al lado.
> Nuevas líneas de vecindad (murmullos): YOLI «Ahí al lado imprimen lo que yo publiqué ayer. Con las faltas corregidas.» ·
> AURORA «Por esa puerta entra la web. No se limpia los pies. Ni las tildes.» · TEODORO «AL OTRO LADO DEL LATÓN PUBLICAN
> SIN CERRAR. YO CIERRO SIN PUBLICAR.» · y los Mirar de la puerta doble (biblia §3.0).
> Documento canónico del jefe de guion, complemento de `GUION_BIBLIA.md`.
> **Todo lo de aquí es aditivo y opcional.** No cambia ningún id, flag, puzle, objeto ni paso del walkthrough 5.4 de la biblia. Si algo de aquí contradice la biblia, **manda la biblia**, salvo en los insertos de texto que se indican expresamente (sección 9).
> Si algo de las propuestas `writers-room/guinos-absurdo.md` o `writers-room/guinos-satira.md` no está aquí, **no entra**.
> Convenciones de la biblia (sección 0): línea sin nombre = Bruno; ` // ` = dos globos; **ninguna intervención pasa de 80 caracteres**; 9 verbos; sin minijuegos; cifras contadas dos veces. Hora de juego: **viernes, de 18:30 a 21:00 (cierre)**; los relojes del edificio están parados en las **20:59**. El medio se llama **elContable.es** («el Contable»). **No hay director del periódico** en el juego: la figura de cartón es **el Lector Medio** (`lector_medio`; ids renombrados en el registro de la biblia).

### Índice
0. Criterios y veredictos (qué entra de cada propuesta)
1. Reparto nuevo: fichas
2. Avisos al entrar en sala (llamadas de Evaristo y «RV:» de Tadeo)
3. Salas: hotspots nuevos (con descripción para el artista)
4. Árboles de diálogo nuevos y opciones nuevas en árboles existentes
5. Micro-puzles opcionales (3)
6. Objetos y flags nuevos
7. Duelo: réplicas, mazo, floja nueva, objetos en remate
8. Rumores que mutan («las paredes oyen»)
8bis. Guiño 8: las plazas de garaje
9. Insertos exactos en escenas existentes
10. Running gags nuevos (escalada y remate)
11. Reparto por paquetes y lista para ficheros comunes y artistas
12. Walkthrough de extras y verificación

---

## 0. Criterios y veredictos

### 0.1 Criterio de tacto (obligatorio para todo lo nuevo)
1. **Se parodia la dinámica, no a la persona.** Nombres inventados con apellido-chiste, como en la biblia. Ningún nombre de pila coincide con los de las propuestas en conflicto («Fermín» queda **eliminado** del juego).
2. **Sprites solo por ropa y atrezo.** Nada de edad, cuerpo, pelo, cara ni gestos personales reconocibles.
3. **Cada retratado gana algo.** Leoncio tiene la mejor herramienta del edificio; Anselmo de verdad baja a las tres de la mañana; Tadeo es generoso y la impresora acaba leyéndole; Evaristo **salva la empresa**; Custodia es la única que sabe dónde está todo; Diseño y Producto **tenía razón desde 2017**.
4. **Diseño y Producto** es un departamento propio, inocente, al que culpan siempre. Su equipo se fue a las 18:30 con todo entregado (bandeja de entregas); **solo queda su director, Valentín Retícula** (cameo, 1.9), ocupadísimo. Sale siempre bien: el más puntual, el mejor vestido y el que tenía razón.
5. **La redacción de las 18:30** (gag oficial, biblia 1.4b y 8.7): cada personaje nuevo tiene un motivo para seguir aquí, y se dice una vez.
6. Lista negra de la biblia (1.3) respetada. Vetados de las propuestas por lista negra o meme: «Odio los lunes», cualquier chiste de viernes y despliegues.
7. **Ningún director del periódico** en pantalla ni aludido. Los jefes que salen son de departamento (Desarrollo, Controlling, Diseño y Producto) o intermedios ficticios (Gervasio).
8. **Garaje (guiño 8):** humor negro de dibujos animados. Nadie se hace daño, todos los planes fallan y «accidente» va siempre entre comillas.

### 0.2 Veredicto por guiño

| # | Guiño | Entra | Se mata | Por qué |
|---|---|---|---|---|
| 1 | Infografía con IA vs director de Desarrollo celoso | **Fusión.** Del absurdo: **Herminia** (herramienta con nombre de persona «para que no la desenchufen», eco de la Goyita), la **cinta de carrocero** que avanza por actos y el micro-puzle **«dar de alta a Herminia como becaria»** («Esta casa da de alta antes a un portátil que a un chaval»). De la sátira: la pantalla **«ACCESO DENEGADO: HERMINIA / ACCESO CONCEDIDO: TITULATOR 3000 (USUARIO INTERNO)»**, «Es transversalidad», «Peor. Si funciona, la gente se acostumbra», «Mi revisión es en marzo», «Lo revoco. Con fecha de hoy. Y de julio» y el «bajo yo a las tres». | El Tartómetro, QuIAque, BegoñIA/CelestIAno (juego de palabras que se explica solo una vez), la mampara, los infografistas figurantes (cuestan arte y la redacción está vacía: quedan sus chaquetas), el micro-puzle de la infografía al papel (un objeto más y un cuarto micro-puzle). | El chiste que se entiende en una línea es «la IA de verdad no entra; la falsa entró porque tenía alta». El alta une el guiño con Rubén sin código nuevo. |
| 2 | Negocio reenvía sin leer lo que dice la IA | **Sátira, con nombre del absurdo.** **Tadeo Adjunto** (el apellido «Remitido» ya es de Maripaz). Presencia **sin sprite**: se fue a las seis, **su portátil no**. Mensajes de Core Web Vitals con cifras reales y propuestas absurdas («Propongo atornillarla»), Cerrar el portátil por actos, R15. Del absurdo: los avisos «RV:» en el móvil y la coda **la impresora es la única que le leía** («BANDEJA 2 INSTALADA», ya canónica). | El robot de telepresencia (arte y animación), la llamada de Lorenzo, el hilo de créditos largo, las siglas inventadas («Lectores Con Prisa»: el chiste es que la IA acierta y él no la entiende). | Encaja con «a las 18:30 se ha ido todo el mundo» y cuesta un hotspot. |
| 3 | Controlling quisquilloso y heroico | **Fusión.** Del absurdo: **«escúchele hasta el final»** como micro-puzle (la mecánica es la dinámica al revés), la cláusula 12 «punto de miles y coma decimal», la cuarta copia de Begoña y el «Felicidades. Es la primera vez que lo digo sin adjunto». De la sátira: el apellido **Salvedad** (oficio de auditor), «Una cosita. Muy pequeña.», la coma del precio de la opa (salva la exclusiva), el **atún de la −1** (pista de P13 con una hoja de cálculo), la entrada por sorpresa en la Reunión de Dirección (aquí, por el **teléfono de conferencias** de la Sala) y un remate que se lo da la grabación del Lector Medio caído: **«...Y ahorrar.»** | El cable rizado que recorre el edificio (tres hotspots), el fijo de cable, la versión del clímax siempre activa. | Es el único que lee hasta el final y por eso gana. El refuerzo es **opcional** (versión A con el micro-puzle, B sin él). |
| 4 | Desarrollo ruidoso que culpa a Diseño | **Absurdo en forma** (tres figurantes **de espaldas**, solo manos; la tercera espalda solo dice «No.»); **sátira en remate**: la casilla VACANTE cuelga de **DISEÑO Y PRODUCTO** («plaza pedida en 2021») y el epílogo «Enhorabuena, Diseño». **Nuevo remate humillante:** la **bandeja de entregas de Diseño** contiene, desde 2017, el aviso de que la pantalla de Dirección tumbaría el CMS. Sello de Desarrollo: «LEÍDO (PERO NO)». | La figurante sola en el Vending, prefijos largos por sprite. | Diseño sale bien: inocente, puntual y con razón. Desarrollo queda humillado con cariño. |
| 5 | Secretaría de Redacción temible | **Fusión.** De la sátira: **Custodia Precinto**, «Dejar es prestar. Prestar es perder.», la única respuesta buena («Para apuntar lo que me digan. Sin grabadora.»), «No me preguntó nadie» sobre Rubén, el saludo secreto a Gertrudis. Del absurdo: el tic **«¿Para qué.»** (abre interrogación, cierra con punto), el cadáver de Aurora y el gag **«Ya ha firmado. Ya lo ha usado. Devuélvamelo.»** | El oráculo de pistas completo (duplica a la abuela), la libreta de reportero y el boli de Custodia como objetos (dos objetos más), el sprite completo. | **Presencia sin sprite:** detrás de una persiana metálica a media altura solo se ven sus manos y la llave. Nadie le ha visto la cara. Da más miedo y cuesta menos. |
| 6 | Guerra de salas y pantallas que fallan | **Fusión.** Absurdo: reserva fantasma de **Ramírez** (recurrente a la hora de los relojes parados: siempre), carteles en guerra, **proyector colgado en la 247 durante tres semanas** (explica el «asentir» del Lector Medio) y la 248 «EL VIAJE CONTINÚA» tras el ¡PLOF!. Sátira: la odisea de entradas de la tele («ENTRADA 3: Ramírez, congelado. Con cruasán»), «cinco minutitos» desde marzo. | El inserto «SIN SEÑAL» con adaptadores en el clímax (duplica la 247), el mando del proyector. | Todo es texto y tres hotspots. |
| 7 | Rumores y paredes que oyen | **Absurdo en mecánica** (cada versión sale una vez, en orden, como línea inicial al hablar). **Tres rumores**: la firma de Bruno (remata la abuela: «Si lo dice mucha gente, sale»), el atún del Titulator (lo corrige Evaristo) y Teodoro vive aquí («ESTOY MAQUETADO»). Paredes: **micrófono de 1994 en la planta** y **rejilla del CPD**. | Rumores sobre Begoña, Gertrudis y personajes nuevos; el vaso en la pared; la rejilla del Vending. | Tres cadenas bastan para el gag; más cadenas son más ganchos entre paquetes. |
| 8 | Plazas de garaje (encargo directo de dirección) | Escrito por el jefe de guion (sección 8bis): cuadro de llaves con **línea de sucesión dinástica**, porra, pésames ensayados, piel de plátano para quien no imprime, yunque rechazado por nota de gasto, «¿y usted cómo se encuentra, de salud?», un rumor más y el remate: Teodoro, que no sale desde 1997, le regala su plaza a Bruno, que no tiene coche. | Cualquier daño real o violencia. | Humor negro de dibujos animados, sin víctimas. |
| — | Cameo del director de Diseño y Producto (encargo de dirección) | **Valentín Retícula** (nombre provisional, lo confirma el retratado), en la Pecera, junto a la bandeja de Diseño y a dos metros del coro de Desarrollo, «dirigiendo» una aventura gráfica sobre esta redacción. Cuarta pared corta, autoparódica y que deja bien a Diseño. | — | Cierra con elegancia el guiño 4. |

**Recuento de reparto nuevo:** **4 PNJ con sprite** (Leoncio, Anselmo, Evaristo y el cameo de Valentín: el tope de 4 se cumple exacto) y **4 presencias sin sprite**: Custodia (persiana), Tadeo (portátil), Herminia (portátil con pegatina), el coro de Desarrollo (tres figurantes de espaldas). El resto de Diseño y Producto es una **ausencia** (bandeja y casilla del organigrama).

---

## 1. Reparto nuevo: fichas

Colores elegidos para no confundirse con los de la biblia (sección 2).

### 1.1 `leoncio_quesitos` — Leoncio Quesitos (PNJ con sprite)
- **Departamento / sala:** jefe de Infografía · `pecera`, zona **180-260 px** (entre `sillas_con_chaqueta` y la mesa de Yoli). Todos los actos; en el epílogo no sale.
- **Aspecto (solo ropa y atrezo):** delantal de dibujante con manchas de rotulador de seis colores, un compás en el bolsillo del pecho como una pluma, carpeta de cartulinas bajo el brazo y, prendido como una medalla, un **quesito de cartulina** (sector de gráfico de tarta). Idle: dibuja algo en el aire con el dedo antes de hablar. Delante, una mesa de dibujo inclinada que ya no usa y el portátil **Herminia**.
- **Color de texto:** `#00C2A8`. Los rótulos de Herminia salen en el mismo color.
- **Voz / tic:** lo traduce todo a gráfico, con seriedad («Eso, en tarta, es un quesito triste»). Habla de Herminia con un orgullo que le asusta.
- **Por qué sigue a las 18:30:** su departamento se fue a las seis y media; Herminia no ficha, y alguien tiene que mirarla.
- **Muestras:** «Lo hace mejor que todo mi departamento. Me incluyo.» // «Me duele, pero me incluyo.» · «Un quesito que suma 130 % no es un gráfico. Es una aspiración.»
- **Quiere:** que Herminia salga publicada. **En el fondo:** que alguien de Desarrollo le diga «está bien».

### 1.2 `herminia` — Herminia (herramienta, presencia sin sprite)
- El portátil de Leoncio (hotspot `herminia_portatil`). En pantalla, en bucle, infografías perfectas con el estilo de la casa (papel, web, redes). «Habla» solo con rótulos en pantalla, color `#00C2A8`.
- Leoncio le puso nombre de persona «porque a las herramientas con nombre de persona no se las desenchufa». Es el criterio de Teodoro con la Goyita; nadie lo comenta.

### 1.3 `anselmo_monolito` — Anselmo Monolito (PNJ con sprite)
- **Departamento / sala:** director de Desarrollo (jefe de Nerea y del coro) · `pecera`, zona **560-610 px**, de pie junto a su mesa, entre el kanban y la ventana.
- **Aspecto (solo ropa y atrezo):** chaleco acolchado gris con muchos bolsillos, un **rollo de cinta de carrocero** colgado del cinturón como una pistolera, un termo con la pegatina «PROPIEDAD DE DESARROLLO» y, bajo el brazo, un archivador con el lomo «PROTOCOLO DE INTEGRACIÓN v.1 (2009)». Idle: vigila la cinta del suelo.
- **Color de texto:** `#D96CFF`.
- **Voz / tic:** «Eso no ha pasado por Desarrollo.» Lo que otros hacen con IA es «de fuera»; lo que él mete con IA en los departamentos de los demás es **«transversalidad»**. Todo lo aplaza a «mi revisión, que es en marzo».
- **Por qué sigue a las 18:30:** el CMS está caído. Cuando algo se rompe, baja él.
- **Su momento bueno:** «Paco abre un ticket. Bajo yo.» Lo dice una vez y no lo repite.
- **Quiere:** que no entre nada que luego tenga que arreglar él a las tres de la mañana.

### 1.4 `evaristo_salvedad` — Don Evaristo Salvedad (PNJ con sprite)
- **Departamento / sala:** director de Controlling y Financiero · `administracion`, despacho acristalado nuevo al fondo, a la izquierda del archivador EJEMPLARES. Sale a la puerta cuando se le llama. En el clímax, **solo por el teléfono de conferencias** de la Sala (no sale el sprite). En el epílogo (versión A), en el `vestibulo`.
- **Aspecto (solo ropa y atrezo):** chaqueta de punto gris perla abrochada, **corbata con estampado de comas diminutas**, una lupa colgada de un cordón, un lápiz bicolor (rojo y azul) y, siempre en la mano, un **teléfono inalámbrico de oficina** con antena. En la mesa, torres de carpetas «CONTRATOS (LEÍDOS)».
- **Color de texto:** `#B5A642` (latón de clip).
- **Voz / tic:** educadísimo, de usted. Abre **«Una cosita. Muy pequeña.»** y cierra **«Era solo eso.»** Llama por cualquier detalle. Convoca a la gente a su despacho **para anunciarle que le va a escribir un correo**. Lee los contratos hasta la última coma.
- **Por qué sigue a las 18:30:** «A las seis y media se va la gente. Los contratos se quedan.»
- **Su momento bueno:** el clímax (9.6). Y antes, la coma del precio de la opa (aviso L3).
- **Quiere:** que alguien le escuche hasta el final. **En el fondo:** enviar por fin ese correo.

### 1.5 `custodia_precinto` — Custodia Precinto (presencia sin sprite)
- **Departamento / sala:** Secretaría de Redacción · `pecera` (orden de dirección v: antes en el Vending), detrás de un **ventanuco con persiana metálica a media altura** en la pared de la Redacción, en la bisagra con la Redacción de papel (x 179-215, junto a la puerta doble). Detrás se intuye el armario del material.
- **Lo que se ve:** solo **las manos** bajo la persiana (guantes de punto sin dedos), una **llave colgada de una cinta roja** y, a veces, la esquina de un libro de tapas negras («EL LIBRO»: quién tiene cada boli desde 1989). Nadie le ha visto la cara desde 2012.
- **Color de texto:** `#A0A0FF` (antes `#C04E7A` y `#FF94BE`: en la Redacción se confundía con Yoli, y el lila con Anselmo).
- **Voz / tic:** pregunta **sin entonación**, abre interrogación y cierra con punto: **«¿Para qué.»** Corta con «Siguiente.» aunque no haya nadie. Nunca grita. De usted con todo el mundo.
- **En qué se diferencia de Begoña (y tiene que notarse):** Begoña da miedo por el procedimiento (sellos, copias, horario). Custodia da miedo por ella misma: **no tiene formularios, ni sellos, ni horario**. «Begoña tiene formularios. Yo tengo memoria.» Quien escriba sus líneas: nunca «sello», «copia», «procedimiento» ni horas.
- **Por qué sigue a las 18:30:** la Secretaría cierra cuando cierra el periódico.
- **Su momento bueno:** sabe dónde está todo, y es la única que sabía que Rubén existía («No me preguntó nadie.»). Da las buenas noches a Gertrudis cada noche; no lo sabe nadie.
- **Regla de oro:** «Boli muerto, boli nuevo.»

### 1.6 `tadeo_adjunto` — Tadeo Adjunto (presencia sin sprite)
- **Departamento:** responsable de Desarrollo de Negocio. **Se fue a las seis.** Su portátil (`portatil_tadeo`, `ecosistema`) sigue reenviando a todo el edificio lo que le dice la IA.
- **Color de texto:** `#FFCC99` (sus mensajes y su asistente).
- **Voz / tic:** «¡Equipo!» al empezar; **«Por si os sirve!!»** al acabar (dos exclamaciones de cierre y ninguna de apertura, que Aurora sufre). Reenvía sin leer y añade su propuesta, siempre peor que lo que dice la IA.
- **Por qué es querible:** no tiene maldad, tiene ganas. Y en cuatro meses es el único que le ha escrito a Rubén.

### 1.7 `coro_desarrollo` — El coro del rincón (3 figurantes, presencia sin árbol largo)
- **Sala:** `pecera`, rincón de Desarrollo (**≈450-540 px**), entre la mesa de Nerea y Anselmo.
- **Aspecto:** **de espaldas**, tres sillas giratorias, tres pares de cascos y, por encima de los monitores, solo **las manos**, que gesticulan. Tres tazas: «DEV», «DEV» y «NO». En la pared, un **semáforo de ruido** de Prevención, siempre en rojo.
- **Prefijos:** `DEV 1:` (indignado), `DEV 2:` (más indignado), `DEV 3:` (solo dice «No.»; dos veces en todo el juego dice otra cosa). A la vez: `CORO:`. Color `#7FFFD4` los tres.
- **Tic:** juntos discuten a gritos por todo y con todos; ante cualquier fallo, **«¡Ha sido Diseño!»**
- **Por qué siguen a las 18:30:** guardia del CMS caído.
- **Su momento bueno:** tienen razón en una cosa: internet está mal hecho.

### 1.8 Diseño y Producto (departamento)
- Departamento propio. Su equipo se fue a las **18:30** con todo entregado en su bandeja (`bandeja_diseno`, pecera). Solo queda su director (1.9). En el organigrama, la casilla **VACANTE** cuelga de su rama («plaza pedida en 2021»): desde P01, para el coro, «Diseño» es Bruno.
- Toda línea sobre Diseño en boca de quien **no** es del coro le da la razón a Diseño.

### 1.9 `valentin_reticula` — Valentín Retícula (cameo, PNJ con sprite)
- **Departamento / sala:** director de Diseño y Producto · `pecera`, en su puesto de Diseño y Producto (mesa blanca impecable, flexo cálido, póster de retícula, muestras de color), **junto a la bandeja de entregas de Diseño y a dos metros del coro de Desarrollo**, que culpa a Diseño de todo sin saber que lo tiene al lado. Actos I-III (`!lector_derribado`); no sale en el epílogo ni en los poscréditos. *(Antes estaba en el CPD; el director lo trasladó: la proximidad con quien le culpa es la gracia.)*
- **Cameo:** lo interpreta el director real de Diseño y Producto del proyecto. **Nombre provisional**: lo confirma él. Retícula = la rejilla con la que se ordena una página.
- **Aspecto (datos confirmados por dirección; prendas y colores concretos, parámetros del sprite a confirmar por el retratado):** alto, sin barba, con gafas, atlético sin llegar a muy musculado; moderno y **muy bien vestido**: americana de buen corte, prendas con gusto, nada de traje rancio. Es, con diferencia, el mejor vestido de la redacción, y se comenta. Idle: mueve el ratón con precisión y se ajusta las gafas mirando su monitor. **En el monitor, en pequeño, se ve esta misma sala, la Pecera, con un becario mirando un monitor.** De pie, a cuerpo entero, a la derecha de su mesa; ni levanta la vista cuando el coro grita «¡Diseño!».
- **Color de texto:** `#C0E8FF` (antes `#E0E0FF`, demasiado cerca del blanco de Bruno; ver legibilidad, §15).
- **Voz / tic:** tranquilo, preciso, con una pizca de autoparodia. «Un segundo, que estoy dirigiendo.»
- **Por qué sigue a las 18:30:** su equipo entregó a las 18:29 y se fue; él se ha quedado «dirigiendo» algo en su pantalla: una aventura gráfica sobre la propia redacción.
- **Su momento bueno:** sabe que todo lo que se culpa a Diseño está en una bandeja sin abrir, y no lo dice con rencor.

---

## 2. Avisos al entrar en sala (paquete A, común)

**Mecánica única** para las llamadas de Evaristo (G-COMA) y los «RV:» de Tadeo (G-RV):
1. Al **entrar en una sala** (nunca si la entrada dispara una escena, nunca durante un duelo, nunca en `sala_amazonas` con `acto_3_iniciado`), se mira la cola de avisos.
2. Sale **como mucho un aviso por entrada**: primero la **siguiente llamada** cuya condición se cumpla; si no hay, el **siguiente RV:**.
3. Los avisos salen **en orden numérico**; uno no salta a otro. Si su condición no se cumple, espera.
4. Ninguno pone ni lee flags de la biblia (salvo leer condiciones). No bloquean nada. El jugador cierra el globo con un clic.
5. Llamada: vibra el móvil, pantalla «EVARISTO (CONTROLLING)», `evaristo_llamadas` +1. RV: suena «¡ding!», globo con el asunto, `tadeo_rv_n` +1.
6. Bruno intenta colgar a Evaristo (si el jugador pulsa fuera del globo durante una llamada, una vez en toda la partida): «No se puede colgar a Evaristo. Lo he intentado. Me ha anotado.»

### 2.1 Llamadas de Evaristo (`evaristo_llamadas`)

| n | Condición | Llamada |
|---|---|---|
| L1 | `torno_abierto` | EVARISTO: «Una cosita. Muy pequeña. Evaristo Salvedad, Controlling.» // EVARISTO: «Su tarjeta pone "Pellizco". ¿Es correcto?» // «No. Es Pellejo.» // EVARISTO: «¿Con una ele o con dos?» // «Con dos.» // EVARISTO: «Anotado. Era solo eso.» // (cuelga; vuelve a sonar) // EVARISTO: «Perdone. ¿Pellejo con jota o con ge?» // «Con jota.» // EVARISTO: «Ahora sí era solo eso.» // BRUNO (al jugador): «Es el primero que me lo pregunta.» |
| L2 | `acto_2_iniciado` | EVARISTO: «Una cosita. ¿Puede pasarse por mi despacho? Es un segundo.» // «¿Ahora?» // EVARISTO: «Cuando pueda. Pero ahora.» // EVARISTO: «Planta 2, al fondo de Administración. Era solo eso.» → `evaristo_convoco` |
| L3 | `pieza_recortada` | EVARISTO: «Una cosita. Begoña me manda el triplicado de lo que recorta.» // EVARISTO: «Ella recorta sin leer. Yo leo sin recortar. Somos un sistema.» // EVARISTO: «Línea dos de su pieza: "a 4,15 euros por acción".» // EVARISTO: «Le han quitado la coma. Pone "415".» // «...Una opa a cuatrocientos quince euros la acción.» // EVARISTO: «Mañana se nos ríe la Bolsa. Y Celestino lo narra.» // EVARISTO: «Le he mandado la coma a Teodoro. Por fax. Era solo eso.» |
| L4 | `acto_3_iniciado` | Sin `ruben_encontrado`: EVARISTO: «Una cosita. La máquina de la planta −1 vende atún desde julio.» // EVARISTO: «Veinticuatro bocadillos al mes. En Sistemas no come atún nadie.» // EVARISTO: «Lo he cruzado con las nóminas. No cuadra con ninguna.» // EVARISTO: «Alguien come ahí abajo y no cobra. Era solo eso.» // BRUNO (al jugador): «Alguien que come y no cobra. Eso es un becario.» · Con `ruben_encontrado`: EVARISTO: «Una cosita. Ya sé quién comía el atún de la −1.» // EVARISTO: «Veinticuatro al mes, a dos euros. Enhorabuena por encontrarle.» // EVARISTO: «Era solo eso.» |
| L5 | `acto_3_iniciado` (y L4 ya salió) | Sin `correo_evaristo_listo`: EVARISTO: «Una cosita. ¿Le ha llegado mi correo?» // «No.» // EVARISTO: «Correcto. Aún no lo he enviado. Quería ver si funcionaba.» // EVARISTO: «Lleva una coma que me tiene en vela.» (pista de MP2) · Con: EVARISTO: «Una cosita. El correo está programado. Para el momento oportuno.» // EVARISTO: «Era solo eso.» |

> **Cifras:** 4,15 € por acción con coma; sin coma, 415 €. La pieza recortada de la biblia ya dice «Y una coma que le caía mal» (Mirar de `pieza_opa`): L3 explica cuál era; ese texto no cambia. 24 bocadillos × 2,00 € = 48 €. Contado dos veces.

**Saludo nuevo de la abuela** (pistas 5.6, paquete A): una sola vez, en la primera llamada a la abuela con `evaristo_llamadas` ≥ 2, **antes** de la pista (la pista no cambia): ABUELA: «Me ha llamado un señor de tu trabajo, muy educado.» // ABUELA: «Quería saber si "Remedios" lleva tilde. Le he dicho que no.» // ABUELA: «Y que te abrigues. Me ha dicho que era solo eso.»

### 2.2 «RV:» de Tadeo (`tadeo_rv_n`)

| n | Condición | Globo del móvil (color `#FFCC99`) | Bruno |
|---|---|---|---|
| RV1 | `inigo_presentado` | «RV: Mejora tus Core Web Vitals en 5 pasos (40 págs.). Por si os sirve!!» | «Para Redacción, Sistemas, Papel y Conserjería. Celestino, en copia.» |
| RV2 | `gertrudis_saludada` | «RV: RV: Cómo instalar una bandeja 2 en una impresora sin bandeja 2.» | «La impresora de la tercera está en copia. Me identifico con ella.» |
| RV3 | `acto_2_iniciado` | «RV: RV: RV: La IA dice que el LCP baja quitando lo más grande!!» | «Lo más grande de un periódico es la portada. Mal asunto.» |
| RV4 | `cms_vivo` | «RV x4: ¿Qué es un CMS? Lo reenvío a los del CMS!!» | «Paco tendrá un ticket nuevo. Le contestará su mejor empleada.» |
| RV5 | `acto_3_iniciado` | «RV x5: Reflexión sobre armarios: "AYÚDAME ESTOY EN EL ARMARIO 27"» | «Lo ha visto toda la empresa. Y nadie lo ha leído.» (pista extra de P13) |

**Mirar `movil`** (añadido, paquete A, con `tadeo_rv_n` ≥ 1): sustituye a la línea de la biblia: «Mi móvil. Una llamada perdida de la abuela.» // «Y [tadeo_rv_n] correos de Tadeo. Todos "RV:". Ninguno leído. Ni por él.»

---

## 3. Salas: hotspots nuevos

> Formato de la biblia: verbos no listados usan las respuestas por defecto (8.2). **Descripción para el artista** en cada sala. Ningún hotspot nuevo bloquea una salida ni tapa un hotspot existente.

### 3.1 `vestibulo` (paquete A)

**Para el artista:** (1) junto al monitor del Ibex, un **altavoz pequeño** con pegatina blanca, tapado a medias con la bufanda verde y roja de Celestino; (2) en el organigrama, la **rama inferior** se rotula «DISEÑO Y PRODUCTO» y de ella cuelga la casilla VACANTE (es el mismo marco: solo cambia el rótulo de la rama); (3) en la `planta_plastico`, una hoja girada que deja ver un **micrófono antiguo** (solo visible tras Empujar).

| id | Mirar | Interacciones especiales |
|---|---|---|
| `altavoz_ibex` | «Un altavoz: "NARRADOR AUTOMÁTICO DEL IBEX (DESARROLLO)".» // «Celestino lo ha tapado con su bufanda.» | **Usar:** ALTAVOZ: «El índice muestra una volatilidad moderada.» // CELESTINO: «¿Lo ves? Sin alma. Ni un "¡qué técnica!".» · **Coger:** CELESTINO: «Déjalo. Bajo la bufanda no molesta. Como yo.» |
| `rama_diseno` | Sin `foto_en_organigrama`: «La rama de abajo: DISEÑO Y PRODUCTO.» // «De ella cuelga la casilla VACANTE. "Plaza pedida en 2021".» · Con: «DISEÑO Y PRODUCTO. Y colgando, mi foto.» // «Pidieron a alguien en 2021. Llego tarde, pero llego.» | **Coger:** «La rama es suya. Yo solo cuelgo.» |
| `planta_plastico` (existe; **añadido**) | Con `planta_oyo`: «Juraría que tiene una hoja girada hacia mí. La de la oreja.» | **Hablar:** la línea de la biblia no cambia y además pone `planta_oyo`. · **Empujar** (nuevo; `planta_empujada_n` +1): 1.ª: «La giro. Debajo de una hoja, un micrófono de 1994.» // «Etiqueta: "SEGURIDAD — NO RETIRAR". Sigue encendido.» // CELESTINO: «Esa planta lo oye todo. Por eso es la que más dura.» · 2.ª: CELESTINO: «De ahí saco los cotilleos de ascensor.» · 3.ª y siguientes: «La dejo como estaba. No quiero que me oiga empujar.» |

**Línea del Ibex nueva** (8.4, Acto II, se añade a la rotación): CELESTINO: «¡Me han puesto un narrador automático! ¡Narra sin bufanda! ¡Fuera de juego!»

### 3.2 `cpd` (paquete A)

**Para el artista:** (1) en el suelo técnico, en primer plano entre el ascensor y la mesa de Paco, una **rejilla** de ventilación con lamas (sprite de suelo); (2) *(revisado)* el hueco que ocupaba el rincón de Valentín lo llenan **dos armarios más (22 y 23)** y una maraña de latiguillos con una etiqueta «DYP?» (Diseño se fue; el cable, no). Valentín y su monitor están ahora en la Pecera (3.3). (3) Paco, a cuerpo descubierto tras su mesa, con una **mampara gris clara** detrás para que su silueta se lea; el registro de tickets yace plano y el CRT está en la otra punta (no le tapan).

| id | Mirar | Interacciones especiales |
|---|---|---|
| `rejilla_cpd` | «Una rejilla del falso suelo. Por aquí suben las voces del edificio.» // «Paco lo sabe todo. No es intuición: es fontanería.» | **Usar** (escuchar; rota con `rejilla_n` +1): 1 «(Planta 2) "Te escribo desde el más absoluto cariño". Maripaz.» // «(¡GONG!)» · 2 «(Administración) "Original. Duplicado. Triplicado. Original..."» · 3 «(Pajarera) "Amarillo, facturación. Verde, oportunidades..."» · 4 «(Vestíbulo) "¡Ibersideral entra por la banda!". También narra para el sótano.» · 5 Actos I-II: «(Desde el 27) Ñiiic, ñiiic. Y alguien mastica.» // «...Eso no viene de arriba.» · Acto III: «(Desde el 27) Alguien teclea. Con faltas.» · 6 «(Vending) "...Buenas noches." Una voz de mujer, muy bajita.» // «Alguien más saluda a Gertrudis.» · 7 vuelve a 1. · **Abrir:** PACO: «Ahí abajo hay cables de 1997. Y un bocadillo de 2003.» |

### 3.3 `pecera` (paquete B)

**Para el artista (800 px; antes 640: se añadió a la derecha la zona de Diseño y Producto y el ascensor):**
- **80-180 px:** en las filas de mesas, **sillas vacías con chaqueta** colgada en el respaldo (ocho o diez visibles) y **pantallas encendidas sin nadie** (salvapantallas y gráficas). Los dos figurantes de la biblia siguen al fondo.
- **180-260 px (Infografía):** Leoncio de pie; una **mesa de dibujo inclinada** con polvo en forma de regla; encima, el portátil **Herminia** con una pegatina escrita a mano «HERMINIA» y, en pantalla, infografías en bucle (animación de 3-4 frames). Delante, **dos sillas vacías con chaqueta, giradas hacia la pantalla**.
- **Suelo, 420 px:** una línea de **cinta de carrocero** de lado a lado y, en un atril, el **cartel de frontera**. Estados: Acto I en 420 px; Acto II en 400 px; Acto III sin `infografia_integrada`: además, un **lazo de cinta alrededor de la mesa de Leoncio**; con `infografia_integrada`: sin cinta, solo una marca de pegamento.
- **450-540 px (coro):** tres sillas de espaldas, tres pares de cascos, manos animadas por encima de los monitores, tazas «DEV», «DEV», «NO»; en la pared, un **semáforo** de tres luces (rojo; los estados ámbar y verde solo en escenas). Bajo el kanban, en una mesita, la **bandeja de entregas de Diseño y Producto** (bandeja de oficina de tres pisos, llena, con etiqueta).
- **560-610 px:** Anselmo; detrás, su mesa con una pantalla que muestra un letrero (texto en Mirar, no hace falta legible).

| id | Mirar | Interacciones especiales |
|---|---|---|
| `sillas_con_chaqueta` | 1.ª: «Sillas vacías con chaqueta. Se fueron a las seis y media.» // «La chaqueta ficha por ellos.» · Siguientes: «Las pantallas siguen encendidas. Sin nadie. Como la web.» | **Usar:** «Son de Mercados. Una silla no cambia de sección sin reunión previa.» · **Coger:** «Esa chaqueta está fichando. Si la quito, a su dueño le ponen falta.» |
| `leoncio_quesitos` (PNJ) | «Leoncio, Infografía. Lleva un quesito de cartulina como una medalla.» | **Hablar:** árbol 4.1. · Dar: ver 4.10. |
| `herminia_portatil` | «Herminia. Un portátil que hace infografías sola. Con nuestra tipografía.» // «Delante, dos sillas vacías con chaqueta. Mirándola.» | **Usar:** LEONCIO: «No la toques. Está en racha desde 2024.» · **Hablar:** «Le digo hola. Me contesta con un gráfico de barras: "hola", 100 %.» · **Coger:** LEONCIO: «Herminia no sale de esta mesa. Fuera hay cinta.» · **Cerrar:** LEONCIO: «Ni se te ocurra. Con nombre de persona no se la apaga.» |
| `mesa_dibujo` | «Una mesa de dibujo inclinada. Tiene polvo con forma de regla.» | **Usar:** «Dibujo un quesito. Herminia lo corrige desde la pantalla. Me lo merezco.» |
| `frontera_carrocero` | Acto I: «Cinta de carrocero en el suelo. Es la frontera de Desarrollo.» · Acto II: «La cinta ha avanzado veinte píxeles hacia Infografía.» // «Nadie la ha visto moverse.» · Acto III sin `infografia_integrada`: «Ahora rodea la mesa de Leoncio. Infografía es un enclave.» · Con `infografia_integrada`: «Ya no hay cinta. Queda la marca del pegamento.» | **Tirar:** ANSELMO: «¡Eh! Eso es infraestructura.» · **Coger:** «Si me llevo un trozo, Anselmo me reclama soberanía.» · **Usar `chicle`:** «No. Un chicle en una frontera es un tratado.» |
| `cartel_frontera` | «"DESARROLLO · A PARTIR DE AQUÍ, SOLO CÓDIGO PROPIO".» // «Debajo, a boli: "Y café propio".» | — |
| `anselmo_monolito` (PNJ) | «Anselmo Monolito, director de Desarrollo.» // «Lleva cinta de carrocero en el cinto. Por si alguien integra algo.» | **Hablar:** árbol 4.2. · Dar: ver 4.10. |
| `pantalla_anselmo` | Sin `ruben_encontrado`: «"ACCESO DENEGADO: HERMINIA (INFOGRAFÍA)".» // «Debajo: "ACCESO CONCEDIDO: TITULATOR 3000 (USUARIO INTERNO)".» · Con `acto_2_iniciado`, 2.ª Mirar y siguientes, rota: «Un gráfico de Desarrollo: un quesito que suma 130 %.» · «"Lectores por continente". Gana la Antártida, con un 40 %.» · Con `ruben_encontrado`: «"ACCESO REVOCADO: TITULATOR 3000". Con fecha de hoy. Y de julio.» · Con `infografia_integrada` (manda sobre todo): «"ACCESO CONCEDIDO: HERMINIA (DESARROLLO)". Lo de Infografía, tachado.» | **Usar:** ANSELMO: «Esa sesión es mía. Hasta el salvapantallas pasó revisión.» |
| `coro_desarrollo` | «Tres espaldas de Desarrollo. Se les ven las manos.» // «Las manos están enfadadas.» | **Hablar:** árbol 4.3. · **Dar `cafe`:** CORO: «¿De quién es?» // «De Gertrudis.» // DEV 1: «Taza mal diseñada.» // CORO: «¡Diseño!» · **Empujar:** «La silla gira. Su dueño sigue gritando. No se ha dado cuenta.» |
| `semaforo_ruido` | «Semáforo de ruido de Prevención. Rojo.» // «Pósit de Nerea: "Verde: 14 de agosto. Estaban de vacaciones".» | **Usar:** «Lo toco. Se pone más rojo. Existe un rojo más rojo.» · **Tirar:** NEREA: «No. Es lo único que les mide sin que se enfaden.» |
| `taza_no` | «Una taza que pone "NO". Es de la tercera espalda. La define.» | **Coger:** DEV 3: «No.» |
| `bandeja_diseno` | «Una bandeja: "ENTREGAS DE DISEÑO Y PRODUCTO". Llena hasta arriba.» // «Todo con fecha y a su hora. Desde este lado no la abre nadie.» | **Abrir** (pone `bandeja_diseno_abierta`): «Arriba: "Entregado a las 18:29. Todo en la carpeta. Buen fin de semana".» // «Al fondo, de 2017: "La pantalla de Dirección tumbará el CMS".» // «Sello de Desarrollo: "LEÍDO (PERO NO)".» · Siguientes: «Diseño se fue a las seis y media. Con todo entregado. Como la gente sana.» · **Coger:** NEREA: «Déjala. Es lo único ordenado del rincón. Y no es nuestro.» |
| `enchufe_pantalla` (existe; **añadido**) | — | **Tirar** con `bandeja_diseno_abierta` y sin `vio_ticket_3` (sustituye a la 2.ª línea de la biblia): «Pone NO DESENCHUFAR. Diseño avisó, pero un aviso no es un ticket.» // «Paco tendrá el número.» (no pone flags) |

**Murmullos nuevos (8.5):**
- `leoncio_quesitos`: «Esto, en barras. Esto, en tarta. Esto, en tarta pero triste.» · «Cuarenta y un pósits. Cuarenta y un "NO". Es una serie muy estable.» · «Si la cinta avanza otro palmo, me piden pasaporte para el Vending.»
- `anselmo_monolito`: «Esto no ha pasado por Desarrollo. Esto tampoco. Esto sí, de refilón.» · «Transversal. No invasivo. Transversal.» · «Revisión: marzo. Qué bien suena marzo.» · (al termo) «Tú sí eres de Desarrollo.»
- `coro_desarrollo` (discusiones de fondo; cada una, globos encadenados):
  1. DEV 1: «¿Quién ha llamado "botón2" a un botón?» // DEV 2: «Era el segundo botón.» // DEV 1: «¡Hay cuatro!» // DEV 3: «No.»
  2. DEV 1: «Ha llovido y ha bajado el tráfico.» // DEV 2: «¡Abrid una incidencia a la lluvia!» // DEV 1: «La lluvia no es nuestra.» // CORO: «¡Diseño!»
  3. DEV 2: «¡El navegador no respeta nada!» // DEV 1: «¡Ni el mío!» // DEV 2: «¡El tuyo menos!» // (se gritan cuatro segundos)
  4. DEV 1: «El aire está a veintidós.» // DEV 2: «En hexadecimal eso es otra cosa.» // DEV 1: «¡No lo pasemos a hexadecimal!» // DEV 3: «No.»
  5. DEV 1: «¿Quién ha tocado mi silla?» // DEV 2: «Tu silla gira. Se ha tocado sola.» // DEV 1: «¡Fallo de diseño!» // CORO: «¡DISEÑO!»
  6. DEV 2: «¡Se ha ido todo el mundo!» // DEV 1: «¡Diseño se fue a las seis y media!» // DEV 2: «¡Con todo entregado! ¡Provocadores!»
  7. DEV 1: «Internet está mal hecho.» // DEV 2: «Desde el principio.» // DEV 3: «...Sí.» // (silencio; nadie lo comenta)
- `nerea_backlog` (nuevo): «Esto a POR HACER. Esto a BLOQUEADO. Esto a Diseño, que ya lo entregó.»
- `yoli_tendencias` (nuevo): «Hacen más ruido que mi gráfica cuando baja.»

**Rubén en la Pecera** (con `ruben_libre`), al Hablar, una sola vez si `herminia_de_alta`, antes de su línea de la biblia: RUBÉN: «¿A ella le dieron el alta en cuarenta segundos?» // «Es una herramienta.» // RUBÉN: «Yo también. Pero sin pegatina.»

- **600-800 px (Diseño y Producto, ampliación):** pared blanco roto con zócalo gris y moqueta gris perla; rótulo colgado «DISEÑO Y PRODUCTO»; la **bandeja de entregas** (trasladada aquí desde debajo del kanban: es la frontera de entregas con Desarrollo) con el cartelito «ENTREGAS»; el **puesto de Valentín** (`monitor_valentin`: mesa blanca, flexo cálido, monitor con la Pecera en miniatura y un Bruno de un píxel que se mueve, taza blanca en la esquina superior derecha), póster de retícula de 12 columnas, muestras de color, una planta de verdad; **Valentín de pie, a cuerpo entero**, a la derecha de su mesa; el **ascensor** (`ascensor_pecera`, 14) y la escalera a la planta 2, ahora a la derecha del ascensor, con el cartel «PLANTA 2 · MARKETING · EVENTOS · COMERCIAL · ADMINISTRACIÓN».

| id | Mirar | Interacciones especiales |
|---|---|---|
| `valentin_reticula` (PNJ) | «Valentín Retícula, director de Diseño y Producto.» // «El único de Diseño que queda. Va mejor vestido que la planta entera.» | **Hablar:** árbol 4.6b. · **Dar `cafe`:** VALENTÍN: «Gracias. Lo dejo en la esquina superior derecha. Ahí no molesta.» · **Dar `ficha_pagina_7`:** VALENTÍN: «Buena ficha. Le subiría un punto el interlineado. Por lo demás, perfecta.» |
| `monitor_valentin` | «En su monitor, una aventura gráfica. Es esta Redacción. En pequeño.» // «Hay un becario mirando un monitor. Me saludo. Me devuelvo el saludo.» | **Usar:** VALENTÍN: «No toques, que estoy en el clímax.» // «¿Y cómo acaba?» // VALENTÍN: «Con un empujón. Con educación.» |
| `ascensor_pecera` | «El ascensor. Lo rediseñó Valentín. No se nota nada: eso es lo bueno.» | **Ir a / Usar / Abrir:** botonera (14). · **Cerrar:** «Se cierra solo. Con un margen de ocho píxeles exactos.» · **Empujar:** «No se empuja. Se llama. Como a Paco, pero contesta.» · **Tirar:** «Tiro de la puerta. Nada. Va por botonera, como los adultos.» · **Hablar:** «"¿Sube o baja?". Hace "tin". Es la conversación más clara de la planta.» |

### 3.4 `pajarera` (paquete B)

**Para el artista:** (1) pegada en `puerta_sala`, bajo la pantallita, una **hoja de reservas** llena de tachones y pósits (en el Acto III, un folio impreso grande encima); (2) en la `matriz_2x2`, un **pósit azul** más en el cuadrante «Prescindible».

| id | Mirar | Interacciones especiales |
|---|---|---|
| `hoja_reservas` | Actos I-II, rota (`hoja_reservas_n` +1): «"Viernes, 20:59 · Seguimiento · Org.: Ramírez · recurrente".» · (2.ª) «Todos los relojes marcan las 20:59. La sala es de Ramírez. Siempre.» · «"Mercados · cinco minutitos · marzo". Sin hora de salida.» · «"RESERVADA – Dirección". Tachado: "RESERVADA DE VERDAD – Gervasio".» · «"Esta anula las anteriores – Íñigo". Debajo: "Y esta, la tuya – Maripaz".» · «"Reunión para decidir quién reserva la sala". 2.ª convocatoria.» · Con `reunion_terminada` (Acto II), primera vez: «La pantallita dice LIBRE. La hoja sigue diciendo Ramírez.» · Acto III: «"Reunión · Íñigo · hasta 2031". Pegado encima de lo de Ramírez.» // «Ha pisado la reserva de un hombre que no está. Eso es nivel.» | **Coger:** «Si quito la hoja, la sala queda libre. Aquí eso es un golpe de Estado.» |
| `posit_evaristo` | «Un pósit azul: "EVARISTO (CONTROLLING). PESADO. BAJO IMPACTO".» // «Azul. Excusas. Íñigo le ha puesto en excusas.» | **Coger:** ÍÑIGO (Actos I-II): «Eso es propiedad intelectual. Y adhesiva.» |

### 3.5 `office` (paquete C)

**Para el artista:** *(construido en la Redacción, zona de papel, x 174-220: orden v)* en la pared del fondo, un **ventanuco** con **persiana metálica a media altura** y un mostrador estrecho. Bajo la persiana: **dos manos con guantes de punto sin dedos** (idle: tamborilean; a veces cuentan con los dedos), una **llave con cinta roja** colgando, y la esquina de un libro negro. Encima del ventanuco, un cartel; sobre el mostrador, un **timbre** con pegatina «NO». En las escenas de Custodia: la mano sale y vuelve a entrar (dos frames).

| id | Mirar | Interacciones especiales |
|---|---|---|
| `custodia_precinto` (presencia) | «La Secretaría de Redacción. Bajo la persiana, dos manos. Y una llave.» // «Nadie le ha visto la cara desde 2012. Se le oye la mirada.» | **Hablar:** árbol 4.4. · **Dar `boli_muerto`:** nodo CU_CADAVER. · **Dar** cualquier otra cosa: CUSTODIA: «Eso no es material. Siguiente.» · **Abrir** (la persiana): CUSTODIA: «Está abierta lo justo.» · **Empujar / Tirar:** CUSTODIA: «Empuje algo suyo.» |
| `cartel_material` | «"EL MATERIAL NO SE PIDE. SE MERECE".» | — |
| `timbre_secretaria` | «Un timbre de mostrador. Pegatina: "NO".» | **Usar:** «¡Ding!» // CUSTODIA: «Estoy delante.» // «Ya. Perdón.» · 2.ª vez y siguientes: CUSTODIA: «Tóquelo otra vez y le apunto en el libro.» |

**Murmullos de `custodia_precinto`:** «Ochenta y tres bolis. Los tengo contados. Los que faltan.» · «Siguiente.» (no hay nadie) · «Las paredes no oyen. Oigo yo.» · (muy bajito, hacia el pasillo del Vending; antes, hacia Gertrudis) «...Buenas noches.»

**Chismes de relleno nuevos de Gertrudis** (6.3, se añaden **detrás** de los tres de la biblia, en este orden): «CHISME: LAS PAREDES OYEN. YO SOY UNA PARED CON CAFÉ.» · «CHISME: DESARROLLO INTENTÓ ACTUALIZARME. LE DI UN E-47.» · «CHISME: LA DE LA PERSIANA DICE QUE LE DEBO CATORCE CAFÉS. ME DEBE QUINCE.» · «CHISME: EVARISTO ME REVISÓ EL "1,20". ESTABA BIEN. NOS EMOCIONAMOS.»

### 3.6 `catacumba` (paquete C)

**Para el artista:** (1) en la mesa de Aurora, junto a los bolígrafos rojos de la biblia, **un bote** con bolis rojos, uno tumbado (el muerto); (2) bajo el Libro de Estilo, asomando, una **tableta** con pegatina que calza la mesa.

| id | Mirar | Interacciones especiales |
|---|---|---|
| `bolis_aurora` | «Bolígrafos rojos. Todos vivos menos uno, que yace.» | **Coger:** sin `acto_2_iniciado`: Aurora da un golpecito al cartel. · Con `acto_2_iniciado` y sin `custodia_regla`: AURORA: «¿Un boli muerto? ¿Para qué quieres tú un cadáver, criatura?» · Con `acto_2_iniciado`, `custodia_regla` y sin `boli_muerto_cogido`: AURORA: «Ese murió corrigiendo un "detrás mío". Llévatelo. Que se sepa.» → `boli_muerto`, `boli_muerto_cogido`. · Después: AURORA: «Los demás están vivos. Y son míos.» |
| `corrector_aurora` | «Una tableta: "CORRECTOR IA (DESARROLLO)". Calza el Libro de Estilo.» // «Por fin sirve.» | **Coger:** AURORA: «Déjala. Me cambiaba "detrás de mí" por "detrás mío".» // AURORA: «La desenchufé con el boli. Rojo.» |

**Reacción de Aurora a los «!!»** (murmullo nuevo, solo con `tadeo_rv_n` ≥ 1 y `acto_2_iniciado`): AURORA: «Dos exclamaciones de cierre y ninguna de apertura.» // AURORA: «Eso no es entusiasmo, criatura. Es inglés.»

### 3.7 `ecosistema` (paquete D)

**Para el artista:** al fondo, junto a la `pizarra_sinergia`, una **mesa vacía** con su silla y una chaqueta, y encima un **portátil abierto** con la pantalla llena de notificaciones y un globo que parpadea (2 frames).

| id | Mirar | Interacciones especiales |
|---|---|---|
| `portatil_tadeo` | 1.ª vez, antes de la rotación: «El portátil de Tadeo, de Negocio. Se fue a las seis.» // «Su portátil, no.» · Rota (`portatil_tadeo_n` +1): **(1)** «"¡Equipo! La IA dice que el LCP es el elemento más grande".» // «"Propongo quitarlo. Por si os sirve!!".» · **(2)** «Un hilo. Tadeo: "Lo he consultado con la IA y está de acuerdo conmigo".» // «Leoncio contesta: "Normal. Se lo has preguntado tú". Me la apunto.» → `rep_15` // «Debajo, la IA de Tadeo: "¡Excelente observación!".» · **(3)** «"RV: Lo más grande de la web es el logo. Propongo quitar el logo".» // «"A la e ya le falta un tornillo. Es una señal".» · **(4)** «"RV: Nuestro CLS es 0,25. La IA dice que lo bueno es 0,1".» // «"Mide cuánto se mueve la página. Propongo atornillarla".» // «"He pedido presupuesto a Ferretería Hermanos Tornillo".» · **(5)** «"RV: LCP de 4,1 segundos. Lo bueno es 2,5".» // «"Propongo que la Redacción escriba más rápido".» · **(6)** «"RV: INP alto: la web tarda en responder al lector".» // «"Propongo que el lector espere sentado. Si encuentra silla".» · **(7)** «"RV: Lazy loading: cargar las cosas solo cuando hacen falta".» // «"Propongo aplicarlo a las reuniones".» // «Es lo primero sensato que leo hoy. Lo ha escrito una máquina.» · **(8)** «"RV: 4.000 líneas de código de la IA para el CMS".» // «"No las he leído, pero tienen colores. ¡Vamos, equipo!".» · **(9)** «"RV: He pedido a la IA un resumen de mis correos".» // «"Me ha mandado un correo. Os lo reenvío".» · después vuelve a (3). | **Hablar:** árbol 4.5. · **Cerrar** (por acto): I: «Lo cierro. Se abre solo.» // «"He detectado que querías cerrarme. ¿Te ayudo a cerrarme?".» · II: «Lo cierro. Antes de apagarse, reenvía: "RV: Me han cerrado".» · III: «Lo cierro. Silencio. Toda la planta suspira.» // «(¡PLIN!) Ahora reenvía desde la impresora de la tercera.» // «Pantalla de la impresora: "ATASCO EN BANDEJA DE SALIDA".» · **Abrir:** «Ya está abierto. Nunca se ha cerrado. Como su bandeja de salida.» · **Coger:** «Si lo cojo, me reenvía a mí.» · **Usar:** «No me siento. Si me siento, reenvío.» |

> **Core Web Vitals, para que no nos pille un desarrollador:** LCP bueno ≤ 2,5 s; INP bueno ≤ 200 ms; CLS bueno ≤ 0,1. La IA de Tadeo cita bien; él lo entiende todo mal.

**Murmullos nuevos:** MARIPAZ (al portátil): «Tadeo, cariño, te patrocino el reenvío. "Por si os sirve, con..."» · BORJA: «Tadeo y yo hacemos sinergia. Él reenvía. Yo fotografío lo que reenvía.»

### 3.8 `administracion` (paquete D)

**Para el artista:** la pared del fondo, a la izquierda del archivador EJEMPLARES, se convierte en un **despacho acristalado pequeño** con puerta de cristal rotulada; dentro, torres de carpetas, **una coma enmarcada** en la pared y Evaristo leyendo con lupa (sprite sentado detrás del cristal; al Usar la puerta, sale a la puerta: sprite de pie).

| id | Mirar | Interacciones especiales |
|---|---|---|
| `puerta_controlling` | «"CONTROLLING Y FINANZAS". Detrás del cristal, un señor lee con lupa.» // «Lee un contrato. Por la cláusula 12. Lleva ahí desde julio.» | **Usar / Abrir:** sale Evaristo → árbol 4.6. · **Empujar:** BEGOÑA: «A don Evaristo no se le empuja. Se le espera.» |
| `evaristo_salvedad` (PNJ) | «Don Evaristo Salvedad, Controlling. Corbata de comas. Lupa al cuello.» // «Y un inalámbrico en la mano. Por si hay que llamar.» | **Hablar:** árbol 4.6. · Dar: ver 4.10. · **Usar `movil`:** «No le llamo. Está a un metro. Y me lo cogería.» |
| `contratos_evaristo` | «Carpetas: "CONTRATOS (LEÍDOS)". La única estantería sincera de la casa.» | **Coger:** EVARISTO: «Esas no. Están leídas. Si las toca, hay que releerlas.» |
| `coma_enmarcada` | «Una coma enmarcada. Placa: "Cláusula 7, 2009. Nos ahorró una fusión".» | **Hablar:** «Le digo que es preciosa. Desde dentro, Evaristo asiente.» |
| `pared_rechazadas` (existe; **añadido**) | Entrada nueva en la rotación: «"Nota de gasto generada por IA (Desarrollo). Motivo: la IA no come".» | — |

**Murmullos:** EVARISTO (tras el cristal): «Coma. Coma. Punto y coma. Esto es un punto y coma disfrazado.» · «Cláusula 12... sigue ahí. Bien. Buenas noches, cláusula 12.» · (al teléfono) «No, no es urgente. Solo es importante. No es lo mismo.» · BEGOÑA (nuevo): «Don Evaristo me ha llamado para decirme que me llamará. Qué hombre.»

### 3.9 `sala_amazonas` (paquete D)

**Para el artista (Actos I-II):** en la pared lateral, una **tele de videollamadas** con pegatina; debajo, una **caja de cables** desbordada; junto a la puerta, por dentro, **carteles a mano pegados unos encima de otros**. En el Acto III (clímax) la tele está apagada y no tiene interacción.

| id | Mirar | Interacciones especiales |
|---|---|---|
| `tele_amazonas` (Actos I-II) | «Una tele de videollamadas. Pegatina: "PULSAR ENTRADA 3. NO, LA 2. NO".» | **Usar** (rota con `tele_n` +1): 1 «Sale la cámara del vestíbulo. Celestino le narra el Ibex al ficus.» · 2 «"ENTRADA 2": el tiempo de ayer. En diferido.» · 3 «"ENTRADA 3": una videollamada de 2019. Ramírez, congelado. Con cruasán.» · 4 «"BUSCANDO SEÑAL". La busca con más ganas que yo.» · 5 «"ENTRADA 5": "PLAN CERO PAPEL · DIAPOSITIVAS: 400 · DATOS: 0".» // «Alguien ha enchufado aquí a Herminia. Por cable.» · 6 vuelve a 1. · **Hablar:** «"¿Me veis la pantalla?". La tele no contesta. Es la experiencia completa.» // FIGURANTE (si hay reunión): «Se te ha congelado, chaval.» |
| `caja_cables` (Actos I-II) | «Catorce cables y siete adaptadores. Uno adapta un adaptador a otro.» // «Hay uno que encaja consigo mismo. Lo dejo así: es feliz.» | **Usar con `tele_amazonas`:** igual que Usar la tele (avanza la rotación). · **Coger:** «Si me llevo un cable, alguien no podrá presentar. Tentador. No.» |
| `carteles_amazonas` | Rota: «"NO DEJÉIS TAZAS. – Dirección".» · «"LAS TAZAS SON DE DIRECCIÓN. – Mercados".» · «"ESTA SALA NO ES UN VENDING". Firmado por la cafetera.» · «"ESTE CARTEL ESTÁ RESERVADO. – Íñigo".» · «"¿QUIÉN HA CAMBIADO LOS CARTELES? – Todos".» | **Coger:** «Los carteles están en guerra y yo soy neutral. Como Suiza, pero becario.» |

**Murmullos nuevos de `figurantes_mercados`:** «Entramos cinco minutitos. En marzo.» · «¿Me veis la pantalla? ...¿Hola? ¿Me veis?» · «Que alguien pida sala para salir de la sala.»

---

## 4. Árboles de diálogo nuevos y opciones nuevas

Formato de la biblia (7.6): `[NODO] condición` · opciones · `→` salto · `{efecto}`. Las opciones nuevas en árboles existentes van **antes de la opción de despedida** y no ponen flags de la biblia.

### 4.1 `leoncio_quesitos` (pecera, paquete B)
```
[LQ0] LEONCIO: (dibuja algo en el aire) Vacante. En tarta, eres un quesito muy fino.
  1. «¿Qué es Herminia?» (se queda)
     LEONCIO: Mi herramienta. La hice con IA en tres fines de semana.
     LEONCIO: Infografías para papel, web y redes. Con el estilo de la casa.
     LEONCIO: Lo hace mejor que todo mi departamento. Me incluyo.
     LEONCIO: Me duele, pero me incluyo.  → LQ0
  2. «¿Y tu departamento?»
     LEONCIO: Se fue a las seis y media. Herminia no ficha.
     LEONCIO: Dejaron las chaquetas en las sillas, mirándola. Por respeto.  → LQ0
  3. «¿Por qué no se publica lo que hace?»
     LEONCIO: Porque Anselmo no la integra. Dice que no ha pasado por Desarrollo.
     LEONCIO: Le he mandado cuarenta y un pósits. Me los devuelve con un "NO".
     LEONCIO: En su tipografía, que es fea.  → LQ0
  4. [acto_2_iniciado] «¿Y esos gráficos de Desarrollo?»
     LEONCIO: Soluciones de Anselmo. Me las pone en mi sección sin preguntar.
     LEONCIO: Su quesito suma 130 %.
     LEONCIO: Un quesito que suma 130 % no es un gráfico. Es una aspiración.  → LQ0
  5. [anselmo_dijo_regla Y !leoncio_acepta_alta] «¿Y si Herminia tuviera alta en Sistemas?»
     → LQ_ALTA
  6. [ruben_encontrado] «El Titulator era un becario.»
     LEONCIO: (deja de dibujar en el aire)
     LEONCIO: Integró una IA que era un becario. Y rechaza una IA que es una IA.
     LEONCIO: Herminia lo ha puesto en un gráfico. Se sale del eje.  → LQ0
  7. [infografia_integrada] «¿Qué tal ahora con Anselmo?» (se queda)
     LEONCIO: Me han anexionado. Pero integrada. Que es lo que quería. Creo.  → LQ0
  8. «Me voy.»
     LEONCIO: Cuidado con la cinta. Se ha movido desde que has llegado.  → FIN

[LQ_ALTA]
  LEONCIO: ¿Alta? ¿Como a una persona?
  LEONCIO: (dibuja un quesito en el aire; se le queda a medias)
  LEONCIO: Llevo veinte años aquí y a mí nunca me dieron de alta en nada.
  LEONCIO: Hazlo. Pero que conste que es mía. Aunque sea suya.
  {leoncio_acepta_alta}  → FIN
```

### 4.2 `anselmo_monolito` (pecera, paquete B)
```
[AN0] 1.ª vez:
  ANSELMO: Alto. Esto es Desarrollo. ¿Traes algo de fuera?
  BRUNO: Solo a mí.
  ANSELMO: ¿Eres de Desarrollo?
  BRUNO: Soy Vacante.
  ANSELMO: Pase. Lo vacío no se integra, pero tampoco molesta.
[AN0] siguientes: ANSELMO: ¿Otra vez cruzando? Te voy a pedir visado.
  1. «¿Por qué no integras la herramienta de Leoncio?»
     ANSELMO: Está hecha con IA. En otro departamento.
     ANSELMO: En mis sistemas solo entra lo que sale de mis sistemas.
     BRUNO: ¿Y si funciona?
     ANSELMO: Peor. Si funciona, la gente se acostumbra.  → AN0
  2. «¿Y tú no usas IA?»
     ANSELMO: Mucha. Desde Desarrollo. Para los demás.
     ANSELMO: Un corrector para Aurora. Un narrador del Ibex para Celestino.
     ANSELMO: Y notas de gasto generativas para Begoña.
     BRUNO: ¿Y eso no es meterse en su trabajo?
     ANSELMO: No es meterse. Es transversalidad.  → AN0
  3. «¿Tu IA no es de fuera también?»
     ANSELMO: La IA es de fuera. Pero el prompt es de dentro.
     ANSELMO: Eso la hace nuestra.  → AN0
  4. «¿Y el Titulator? Ese sí entró.» (se queda)
     si !ruben_encontrado:
       ANSELMO: Tenía alta de usuario. Personal interno.
       ANSELMO: Lo que tiene alta en Sistemas es de la casa. Lo de la casa entra.
     si ruben_encontrado:
       BRUNO: El Titulator era un becario. En un armario.
       ANSELMO: En un armario de mis sistemas. Todo en regla.
       ANSELMO: (pausa larga) ...Lo revoco. Con fecha de hoy. Y de julio.
       ANSELMO: Lo que tiene alta es de la casa. Aunque sea un chaval.
     {anselmo_dijo_regla}  → AN0
  5. «¿Por qué eres tan celoso de tus sistemas?» (se queda)
     ANSELMO: Cuando algo se rompe a las tres de la mañana, ¿quién baja?
     BRUNO: ¿Paco?
     ANSELMO: Paco abre un ticket. Bajo yo.  → AN0
  6. [cms_vivo] «He arreglado el CMS.» (se queda)
     ANSELMO: ¿Cómo?
     BRUNO: Desenchufando una pantalla.
     ANSELMO: Solución de terceros. La pongo en mi revisión.
     ANSELMO: Mi revisión es en marzo.  → AN0
  7. [herminia_de_alta Y !infografia_integrada] «Hay una becaria nueva en Desarrollo.»
     → AN_HERMINIA
  8. «Me voy.»
     ANSELMO: Sal por la frontera. La de entrada está en mantenimiento.  → FIN

[AN_HERMINIA]
  ANSELMO: ¿Una becaria? ¿En mi equipo? ¿Con alta?
  BRUNO: Con alta de Sistemas. Cuarenta segundos.
  ANSELMO: (lee su pantalla) "Herminia. Becaria de Desarrollo. Herramienta."
  ANSELMO: ...Es de la casa. Entonces es estupenda.
  ANSELMO: Mira qué infografías. Con nuestro estilo. Lo llevamos en la sangre.
  (Anselmo se agacha y despega la cinta de carrocero. Toda. Un ruido largo.)
  ANSELMO: Ya no hace falta frontera. Ahora todo esto es Desarrollo.
  LEONCIO: (desde lejos) Me han anexionado.
  LEONCIO: ...Pero integrada. Que es lo que quería. Creo.
  NEREA: Si no está en el tablero, no existe. (pega un pósit: "HERMINIA — HECHO")
  {infografia_integrada}  → FIN
```

### 4.3 `coro_desarrollo` (pecera, paquete B)
```
[CO0] (Bruno les habla. Las tres sillas giran un poco. Las espaldas, no.)
  CORO: ¿Diseño?
  BRUNO: No. Bruno.
  si !foto_en_organigrama: DEV 1: Ah. Entonces no es culpa tuya.
  si foto_en_organigrama:  DEV 2: Cuelgas de Diseño en el organigrama. Algo será.
  (Vuelven a gritar.)
  1. «¿Por qué gritáis tanto?» (se queda)
     DEV 2: ¡No gritamos!
     DEV 1: ¡Es que juntos no nos oímos!
     NEREA: (sin levantar la vista) Juntos son un incendio. Por separado, santos.
     NEREA: El problema es que nunca están por separado.  → CO0
  2. «¿Con quién estáis enfadados?»
     DEV 1: Con el navegador. Con los lectores. Con la lluvia.
     DEV 2: Con el de al lado.
     DEV 1: ¡Con el de al lado no!
     DEV 2: ¡Pues ahora sí!
     DEV 3: No.  → CO0
  3. [!cms_vivo] «¿Por qué se ha caído el CMS?»
     CORO: ¡Diseño!
     NEREA: El CMS no es nuestro, es de Sistemas.
     DEV 1: Pues Sistemas lo habrá diseñado mal. ¡Diseño!  → CO0
  4. [cms_vivo] «El CMS lo he arreglado yo.» (se queda)
     DEV 2: Lo hemos arreglado nosotros.
     BRUNO: He desenchufado una pantalla.
     (Silencio.)
     DEV 1: ...Pues la pantalla la eligió Diseño.  → CO0
  5. «¿Quién es Diseño?» (se queda)
     si !foto_en_organigrama:
       DEV 2: Diseño y Producto. Se fueron a las seis y media. Menos su director.
       DEV 1: Con todo entregado. Qué poca vergüenza.
       DEV 3: No.  → CO0
     si foto_en_organigrama:
       DEV 2: Se fueron. Pero en el organigrama les queda uno. El de VACANTE.
       BRUNO: Vacante soy yo.
       DEV 1: Pues has roto el CMS.
       BRUNO: Llevo aquí diez minutos.
       DEV 2: Suficiente para Diseño.  → CO0
  6. [bandeja_diseno_abierta] «Diseño os avisó de lo del CMS. En 2017.»  → CO_BANDEJA
  7. [infografia_integrada] «Herminia ahora es de Desarrollo.»  → CO_HERMINIA
  8. «Me voy.»
     CORO: ¡Vale! (lo gritan como un insulto, sin serlo)  → FIN

[CO_BANDEJA] (una vez; después la opción 6 desaparece)
  BRUNO: Está en vuestra bandeja. Firmado: Diseño y Producto, 2017.
  (DEV 1 lee en voz alta, cada vez más bajo.)
  DEV 1: "La pantalla de Dirección consulta el CMS cada segundo..."
  DEV 1: "...Lo tumbará. Proponemos apagarla."
  (Silencio. El semáforo de ruido baja a ámbar.)
  DEV 2: ...Lo entregaron a su hora.
  NEREA: Lo tengo en HECHO (PERO NO). Desde 2017. Lo moví yo.
  ANSELMO: (de fondo) Eso no pasó por Desarrollo.
  NEREA: Sí pasó. Por la bandeja.
  DEV 3: ...Perdón.
  CORO: (muy bajito, a la vez) Perdón, Diseño.
  DEV 1: No se lo digáis. Ya se han ido.  → FIN

[CO_HERMINIA] (una vez)
  (En la pantalla de Herminia aparece un gráfico. Las tres espaldas se giran.)
  (rótulo, color de Leoncio) CULPAS A DISEÑO: 3.112. CON RAZÓN: 0.
  DEV 2: ...¿Cero?
  DEV 1: Es de Herminia. Ahora es nuestra. Así que es verdad.
  (Silencio largo. El semáforo de ruido se pone verde. Por primera vez.)
  DEV 3: ...A Sistemas.
  CORO: ¡SISTEMAS!
  PACO: (por los altavoces, desde la planta −1) Otro ticket.  → FIN
```

### 4.4 `custodia_precinto` (Secretaría de Redacción, en `pecera` desde la orden v; antes `office`; paquete C)
```
[CU0] 1.ª vez: CUSTODIA: (la persiana no se mueve) ¿Qué quiere.
      siguientes: CUSTODIA: Otra vez usted. ¿Qué quiere.
  1. «¿Me deja un boli?» (se queda)  → CU_PARAQUE
  2. «¿Me da una libreta?»
     CUSTODIA: Ya tiene una.
     BRUNO: Está a medias.
     CUSTODIA: Pues acábela. Las libretas a medias son de los que no acaban.
     CUSTODIA: Siguiente.  → FIN
  3. «Buenas noches.»
     CUSTODIA: Eso, a la cafetera. Conmigo no funciona.  → CU0
  4. «Por favor. Es una emergencia.»
     CUSTODIA: Una emergencia es que se pare la rotativa.
     CUSTODIA: Lo suyo es un capricho con prisa.  → CU0
  5. «Me manda Gervasio.»
     CUSTODIA: Gervasio no manda. Delega. Y a mí no se me delega.  → CU0
  6. «Begoña dice que hay que rellenar algo.»
     CUSTODIA: Begoña tiene formularios. Yo tengo memoria.
     CUSTODIA: La memoria no se rellena. Se gana.  → CU0
  7. «¿Por qué no se le ve la cara?» (se queda)
     CUSTODIA: Porque no hace falta.  → CU0
  8. [!custodia_ablandada] «¿Usted sabe dónde está todo?»
     CUSTODIA: Todo. Siguiente.  → FIN
     [custodia_ablandada] «¿Dónde está...?» (se queda)  → CU_DONDE
  9. [lleva boli_muerto] «Le traigo un muerto.»  → CU_CADAVER
 10. «Nada, perdone.»
     CUSTODIA: Perdonado. Siguiente.  → FIN

[CU_PARAQUE]
  CUSTODIA: ¿Para qué.
  1. «Para escribir.»
     CUSTODIA: Escribir se escribe con la cabeza. El boli es para firmar.
     CUSTODIA: ¿Va a firmar algo.
     BRUNO: Algún día.
     CUSTODIA: Pues vuelva ese día.  → FIN
  2. «Para firmar en papel. En la página 7.»
     CUSTODIA: Ja.
     (No se ríe. Lo dice. Es una sílaba.)
     CUSTODIA: Seis años en la web y viene a pedirme un boli para el papel.
     CUSTODIA: Siguiente.  → FIN
  3. «Para tenerlo. Por si acaso.»
     CUSTODIA: "Por si acaso" es como desaparecen ochenta y tres bolis al año.  → FIN
  4. «¿Y cómo se consigue un boli aquí?»
     (Por primera vez, la persiana sube un centímetro.)
     CUSTODIA: Boli muerto, boli nuevo.
     CUSTODIA: Tráigame el cadáver. Gastado de trabajar, no de perderlo.
     CUSTODIA: Eso lo noto.
     {custodia_regla}  → FIN

[CU_CADAVER] (Dar boli_muerto, o opción 9)
  si !custodia_regla:
     CUSTODIA: Un muerto sin que se lo pida. Qué raro. Siguiente.  → FIN (no se gasta)
  CUSTODIA: (la mano coge el boli y lo levanta a contraluz, despacio)
  CUSTODIA: Rojo. Sin tinta. Gastado hasta el final.
  CUSTODIA: Esto es de Aurora. Es la única que los acaba. Ha muerto trabajando.
  CUSTODIA: ¿Y para qué quiere el nuevo.
  1. «Para firmar en papel.»
     CUSTODIA: Firmar no gasta. No doy bolis para gestos.  → CU_CADAVER_2
  2. «Para lo que surja.»
     CUSTODIA: Lo que surja, apúntelo en la mano.  → CU_CADAVER_2
  3. «Para mi abuela.»
     CUSTODIA: Su abuela que venga. Con su muerto.  → CU_CADAVER_2
  4. «Para apuntar lo que me digan. Sin grabadora.»  → CU_DA

[CU_CADAVER_2]
  CUSTODIA: No. Otra vez. ¿Para qué.
  (vuelven las opciones de CU_CADAVER, sin las que ya han fallado; el muerto
   sigue en la mano de Custodia y no se gasta hasta CU_DA; si Bruno sale del
   diálogo, se lo devuelve: CUSTODIA: Llévese a su muerto. Vuelva con una razón.)

[CU_DA]
  (Silencio. La mano se queda quieta.)
  CUSTODIA: ...Eso hacía la gente antes.
  (Gira la llave. La mano sale con un boli azul, como quien saca un anillo.)
  CUSTODIA: Azul. El rojo es de Aurora.
  CUSTODIA: Firme aquí que se lo lleva.
  (Bruno firma en EL LIBRO.)
  CUSTODIA: Ya ha firmado. Ya lo ha usado. Devuélvamelo.
  (Bruno se lo devuelve. La mano lo guarda.)
  BRUNO: ...¿Y para qué me lo ha dado?
  CUSTODIA: Para que sepa lo que se siente.
  CUSTODIA: Desde hoy, pregúnteme dónde están las cosas. No se acostumbre.
  {−boli_muerto, custodia_ablandada}  → FIN

[CU_DONDE] (con custodia_ablandada)
  CUSTODIA: Diga.
  1. «¿Dónde está Ramírez?»
     CUSTODIA: Desayunando.
     BRUNO: ¿Desde 2019?
     CUSTODIA: Él desayuna despacio. Yo apunto rápido.  → CU_DONDE
  2. «¿Dónde está la bandeja 2 de la impresora de la tercera?»
     CUSTODIA: No existe. Por eso es la única bandeja que no se atasca.  → CU_DONDE
  3. [!silla_libre] «¿Dónde hay una silla libre?»
     CUSTODIA: Debajo de una chaqueta. Como siempre.  → CU_DONDE
  4. [!cms_vivo] «¿Dónde está el problema del CMS?»
     CUSTODIA: En el registro de Paco. Ticket nº 3. Nadie lo lee. Yo sí.  → CU_DONDE
  5. [acto_3_iniciado Y !ruben_encontrado] «¿Dónde está el Titulator?»
     CUSTODIA: Armario 27. En agosto me pidió un boli por debajo de la puerta.
     CUSTODIA: Le pasé dos. Sin muerto.
     BRUNO: ¿Y no se lo dijo a nadie?
     CUSTODIA: No me preguntó nadie.  → CU_DONDE
  6. «¿Dónde está la gente? La redacción está vacía.»
     CUSTODIA: En su casa. Desde las seis y media. Donde tiene que estar.
     CUSTODIA: Lo raro es usted.  → CU_DONDE
  7. «¿Dónde está mi nombre bien escrito?»
     CUSTODIA: En ningún sitio. Todavía.
     CUSTODIA: Pero el todavía, en esta casa, ya es mucho.  → CU_DONDE
  8. «Ya está.»
     CUSTODIA: Siguiente.  → FIN
```

### 4.5 `portatil_tadeo` — el asistente de Tadeo (ecosistema, paquete D)
Habla con el color de Tadeo. Todo lo contesta con ganas.
```
[TA0]
  PORTÁTIL: Tadeo no está. Soy su asistente. ¡Excelente pregunta!
  BRUNO: No he preguntado nada.
  PORTÁTIL: ¡Excelente silencio! ¿Quieres que te lo resuma en una tabla?
  1. «¿Dónde está Tadeo?»
     PORTÁTIL: En casa, desde las seis. Pero sigue muy presente.
     PORTÁTIL: Presente en todas las bandejas de entrada del edificio.  → TA0
  2. «¿Tadeo lee lo que reenvía?»
     PORTÁTIL: Tadeo confía. Leer es para quien duda.  → TA0
  3. «¿Qué son las Core Web Vitals?»
     PORTÁTIL: Tres medidas de la página: carga, respuesta y estabilidad.
     PORTÁTIL: Tadeo propuso quitar la página. Para que cargue antes.  → TA0
  4. «Deja de reenviar.» (se queda)
     PORTÁTIL: ¡Entendido! Reenvío tu petición a todo el edificio.
     (¡PLIN! ¡PLIN! ¡PLIN! por toda la planta)  → TA0
  5. [ruben_encontrado] «¿Os contesta alguien?»
     PORTÁTIL: Una cuenta: Titulator 3000. Siempre: "Gracias, Tadeo".
     PORTÁTIL: Es nuestro mejor cliente. No compra nada.  → TA0
  6. «Me voy.»
     PORTÁTIL: ¿Quieres que reenvíe tu salida?
     BRUNO: No.
     PORTÁTIL: Reenviada.  → FIN
```

### 4.6 `evaristo_salvedad` (administracion, paquete D)
```
[E0] 1.ª vez:
  con evaristo_llamadas ≥ 1: EVARISTO: Pellejo, con jota. Pase un segundo.
  sin:                       EVARISTO: ¿Pellizco? Pase un segundo.
  EVARISTO: Una cosita. Muy pequeña.
[E0] siguientes: EVARISTO: Disculpe. ¿Tiene un segundo? Son tres.
  1. [evaristo_convoco Y !evaristo_escuchado] «¿Para qué me ha llamado?»  → E_CORREO
  2. «¿Por qué llama tanto?» (se queda)
     EVARISTO: Porque por escrito se pierden matices. Y en persona, comas.
     EVARISTO: Por teléfono no se pierde nada. Solo tiempo. Y no es mío.  → E0
  3. «¿Qué hay en esas carpetas?»
     EVARISTO: Todos los contratos de la casa. Leídos. Hasta la letra pequeña.
     EVARISTO: Sobre todo la pequeña. La grande la lee cualquiera.  → E0
  4. «¿Algún cotilleo?»
     EVARISTO: El consultor me dijo: "Eso es un detalle sin importancia".
     EVARISTO: Le contesté: "Una coma también lo era. Hasta que alguien la firmó".
     EVARISTO: Me puso en un pósit azul. Excusas.
     EVARISTO: Yo no pongo excusas. Pongo salvedades.
     BRUNO: Me la apunto.  {rep_16}  → E0
  5. «¿Ha visto mi contrato?»
     EVARISTO: Usted no tiene contrato. Tiene seis convenios de prácticas.
     EVARISTO: Los he leído todos. Al tercero le falta una coma.
     EVARISTO: No le cambia nada. Pero me quita el sueño.  → E0
  6. «¿Begoña trabaja para usted?»
     EVARISTO: Begoña no trabaja para nadie. Trabaja para el procedimiento.
     EVARISTO: Yo le reviso los triplicados. Los tres. Por separado.
     BEGOÑA: (desde la ventanilla) Una vez encontró una coma distinta en uno.
     BEGOÑA: No dormí en un año.  → E0
  7. «¿Por qué convoca a la gente para anunciar correos?» (se queda)
     EVARISTO: Porque nadie lee los correos.
     EVARISTO: Pero todo el mundo viene a un despacho. Por miedo.
     EVARISTO: Bueno. Venir, no viene nadie. Por eso convoco más.  → E0
  8. «¿Por qué sigue aquí? Se ha ido todo el mundo.» (se queda)
     EVARISTO: A las seis y media se va la gente. Los contratos se quedan.
     EVARISTO: Trabajo en un periódico que se llama el Contable. Alguien tiene que contar.  → E0
  9. [coma_bendecida Y !correo_evaristo_listo] «Aurora dice que su coma está bien.»
     → E_ENVIO
 10. [correo_evaristo_listo] «¿Ha enviado ya el correo?» (se queda)
     EVARISTO: Está programado. Para el momento oportuno. Con todos en copia.  → E0
 11. «Me voy.»
     EVARISTO: Gracias por venir. Le escribiré un correo para agradecérselo.  → FIN

[E_CORREO] (micro-puzle MP2: hay que escucharle hasta el final)
  EVARISTO: Le he llamado para comunicarle que le voy a escribir un correo.
  1. «¿Y no me lo puede decir ahora?» (se queda)
     EVARISTO: Ahora no. Lo verbal no lleva comas.  → E_CORREO
  2. «¿Falta mucho?»
     EVARISTO: Si tiene prisa, se lo pongo por escrito.
     (Vuelve a su mesa. Se pone a escribir. No vuelve.)
     BRUNO (al jugador): He perdido a un hombre por mirar el reloj. Que está parado.
     → FIN (se repite desde E0)
  3. «¿De qué trata?»  → E_DET1

[E_DET1]
  EVARISTO: De una coma.
  1. «Siga.»  → E_DET2
  2. «¿Una coma? ¿Solo?»
     EVARISTO: Usted también es solo un becario. Y mire.
     EVARISTO: Bueno. Otro día se lo cuento. Le escribo.  → FIN (se repite desde E0)
  3. «¿Esto va por lo de Pellizco?»
     EVARISTO: Eso es otro expediente. No mezclemos.  → E_DET1

[E_DET2]
  EVARISTO: Contrato de Optimal Brains. Cláusula 4. Precio mensual.
  EVARISTO: Pone: cuarenta y ocho. Coma. Cero, cero, cero. Euros.
  1. «Siga, siga.»  → E_DET3
  2. «Bueno, eso son cuarenta y ocho mil.»
     EVARISTO: Eso es lo que dice todo el mundo. Por eso nadie lo lee.  → E_DET2
  3. «Tengo que ir a cerrar una página.»
     EVARISTO: Lo entiendo. Las páginas cierran. Los contratos, no.
     → FIN (se repite desde E0)

[E_DET3]
  EVARISTO: Cláusula 12. La añadí yo en la revisión. Nadie la leyó.
  EVARISTO: "Las cantidades se expresan con punto de miles y coma decimal."
  1. «No pare.»  → E_REVELA
  2. «¿Y eso qué significa?»
     EVARISTO: Que se lo iba a decir ahora. Si no me interrumpe.  → E_DET3

[E_REVELA]
  EVARISTO: Con mi cláusula, "48,000" son cuarenta y ocho euros.
  EVARISTO: Nos facturan cuarenta y ocho mil al mes. Desde julio.
  EVARISTO: Pagamos 47.952 euros de más. Cada mes.
  BRUNO: ¿Y por qué no lo ha enviado?
  EVARISTO: Porque no estoy seguro de mi propia coma.
  EVARISTO: Llevo tres semanas revisando mi correo. Coma a coma.
  EVARISTO: Me falta una segunda opinión. De alguien que sepa de comas de verdad.
  EVARISTO: Gracias por escucharme hasta el final. Nadie lo hacía desde 2009.
  {evaristo_escuchado}  → FIN

[E_ENVIO]
  EVARISTO: ¿Aurora Galerada? ¿Lo ha dicho ella? ¿Con esas palabras?
  BRUNO: Ha dicho que una coma bien puesta no espera.
  (Se sienta despacio. Coge el inalámbrico. Lo deja. Coge el ratón.)
  EVARISTO: Entonces lo envío.
  EVARISTO: En el momento oportuno. Con todos en copia. Como debe ser.
  {correo_evaristo_listo}  → FIN
```

> **Oficio:** la Ortografía académica admite coma y punto como separador decimal; Evaristo **no** dice que lo correcto sea la coma: dice que **manda su cláusula**. Aurora lo matiza (4.7). En el clímax añade la cláusula de ley española y el principio del Código Civil (art. 1288): lo oscuro de un contrato no favorece a quien lo redactó.

### 4.6b `valentin_reticula` (pecera, paquete B; antes cpd)
```
[VR0] VALENTÍN: (sin apartar la vista de la pantalla) Un segundo, que estoy dirigiendo.
  1. «¿Qué está dirigiendo?»
     VALENTÍN: Una aventura gráfica sobre esta redacción. Diez salas. Nueve verbos.
     VALENTÍN: Ahora mismo, un becario me pregunta qué estoy dirigiendo.
     BRUNO: ...¿Ese soy yo?
     VALENTÍN: Eres un sprite muy bien resuelto. El remolino, sobre todo.  → VR0
  2. «¿Por qué trabaja aquí, al lado de Desarrollo?»
     VALENTÍN: Porque aquí se entrega. La bandeja está a dos metros.
     VALENTÍN: Y desde aquí oigo en directo de qué tengo la culpa.
     BRUNO: ¿Y no le molesta?
     VALENTÍN: Llevo cascos. Sin música. Es aislamiento por diseño.  → VR0
  3. «Desarrollo dice que todo es culpa de Diseño.» (se queda)
     VALENTÍN: Lo sé. Lo dicen a dos metros. Yo lo entrego a las 18:29.
     VALENTÍN: Diseño tiene la culpa de todo lo que Desarrollo no abre.  → VR0
  3b. [cms_vivo] «¿Sabía que la pantalla tumbaba el CMS?»
     VALENTÍN: Desde 2017. Está en la bandeja. Primera hoja.
     VALENTÍN: Con una flecha roja. De dos píxeles de grosor. Para que se viera.  → VR0
  4. «¿Algún truco?» (se queda)
     VALENTÍN: Si te atascas, llama a tu abuela. La diseñamos como sistema de pistas.
     VALENTÍN: Y prueba cosas raras. Aquí todo lo raro está probado.  → VR0
  5. [ruben_encontrado] «¿Usted sabía lo del Titulator?»
     VALENTÍN: En mi juego, el Titulator ya era un becario.
     VALENTÍN: Una IA no pone las tildes con tanto cariño.  → VR0
  6. «¿Cómo va siempre tan bien vestido?» (se queda)
     VALENTÍN: Me visto como entrego: a tiempo y sin adornos de más.  → VR0
  7. «Me voy.»
     VALENTÍN: Sal por el ascensor. Lo he rediseñado. No se nota: eso es lo bueno.  → FIN
```
**Murmullos de `valentin_reticula`:** «Margen superior, ocho. Inferior, ocho. Paz.» · ««¡Diseño!». Sí, hola. Está en la bandeja.» · «Lo entregué a las 18:29. Lo demás es literatura.»

**Lo que se dice de él (líneas nuevas para otros):** CELESTINO (murmullo, A): «El de Diseño. Es de Diseño: hasta su sombra está maquetada.» · PACO (murmullo, A): «Me abrió un ticket con márgenes. Lo tengo enmarcado.» · BORJA (murmullo, D): «¡Valentín no necesita filtro! ¡El filtro necesita a Valentín!» · NEREA (murmullo, B): «Diseño entrega antes de que lo pida el tablero. Me descoloca.» · Coro, discusiones de fondo (B; Valentín trabaja **a dos metros**: el coro baja la voz, se corrige o le culpa sin que él levante la vista):
  - DEV 1: «¡Diseño sigue en el edificio!» // DEV 2: «¡Su director! ¡A dos metros!» // DEV 1: «...Pues que arregle el CMS.» // DEV 2: «Más bajo, que te oye.» // DEV 3: «No.»
  - DEV 2: «¡Esto es culpa de Dis...!» // DEV 1: «¡Chsss! Que está ahí.» // DEV 2: «...de Dirección. Culpa de Dirección.»
  - DEV 1: «¡Diseño tiene la culpa!» // VALENTÍN (sin levantar la vista): «Está en la bandeja.» // DEV 1: «...» // DEV 3: «No.»
  - DEV 1: «¿Quién ha puesto este margen de ocho píxeles?» // DEV 2: «Diseño.» // DEV 1: «...Queda bien.» // DEV 2: «No se lo digas.»
  - CORO: «¡Diseño!» // DEV 3: «Ni nos mira.» // DEV 1: «Nunca mira.» // DEV 2: «Es que lo entregó todo.»
  - DEV 2: «¿Le abrimos una incidencia a Diseño?» // DEV 1: «¿Con qué? Lo tiene todo en la bandeja.» // DEV 2: «Pues a la bandeja.»
  - En el árbol del coro, «¿Quién es Diseño?»: DEV 1: «Que está ahí mismo. Con todo entregado. Qué poca vergüenza.» · Al final de CO_BANDEJA: DEV 1: «No se lo digáis. Que no se entere.» // VALENTÍN: «Ya lo sé.»
  - Bandeja (Abrir, siguientes veces): «Diseño se fue a las seis y media. Con todo entregado.» // «Menos su director, que está ahí al lado. Ni levanta la vista.»
  - En escenas montadas en la Pecera: está en la 7.2 (lejos, en su puesto; no se cruza con Íñigo) y no está en el epílogo ni en los poscréditos (`!lector_derribado`).

### 4.7 Opciones nuevas en árboles existentes

| Árbol (paquete) | Nodo | Opción nueva | Texto |
|---|---|---|---|
| `aurora_galerada` 7.6.1 (C) | A_MENU | [evaristo_escuchado Y !coma_bendecida] «Don Evaristo pregunta si su coma está bien.» | AURORA: «¿Evaristo? ¿El de las comas? Siéntate, criatura. Bueno, no hay silla.» // AURORA: «La coma decimal es correcta. El punto también. Las dos valen.» // AURORA: «Pero si su cláusula dice coma, manda la cláusula. Son cuarenta y ocho.» // AURORA: «Dile que lo envíe. Que una coma bien puesta no espera.» // AURORA: «Y que su corbata es lo único bien puntuado de esta casa.» {coma_bendecida} → A_MENU |
| `aurora_galerada` (C) | A_MENU | [custodia_regla] «¿Ha oído cómo pregunta Custodia?» (se queda) | AURORA: «Abre interrogación y cierra con punto.» // AURORA: «Eso no es una pregunta, criatura. Es una sentencia.» → A_MENU |
| `paco_ticket` 7.6.4 (A) | P1 | [leoncio_acepta_alta Y !herminia_de_alta] «Quiero dar de alta a una becaria.» | PACO: «¿Persona o herramienta?» → 1. «Persona.» (se queda): PACO: «Pendiente. Te pongo detrás del nº 1. Desde julio.» // BRUNO (al jugador): «Mejor no. Por Herminia.» → P1 · 2. «Herramienta.»: PACO: «(teclea) Las herramientas van por otro circuito. El rápido.» // PACO: «"Herminia. Becaria de Desarrollo." Alta: cuarenta segundos.» // PACO: «Rubén lleva desde julio.» // PACO: «Esta casa da de alta antes a un portátil que a un chaval.» {herminia_de_alta} → P1 |
| `paco_ticket` (A) | P0 y P1 | «¿Escuchas por la rejilla?» (se queda) | PACO: «No escucho. Oigo. Escuchar sería abrir un ticket.» // PACO: «Me entero de todo. No arreglo nada. Es el equilibrio.» |
| `paco_ticket` (A) | P1 | «¿Te escribe mucho Tadeo?» (se queda) | PACO: «Cada correo de Tadeo es un ticket. Tengo una carpeta: "La IA dice".» // PACO: «Le contesta mi respuesta automática. Ya sabes: mi mejor empleada.» |
| `ruben` 7.7.10 (A) | R0 | «¿Te llegaban correos de Tadeo?» | RUBÉN: «Trescientos al día. Al buzón del Titulator.» // RUBÉN: «Soy el único que los lee. Le contesto: "Gracias, Tadeo".» // RUBÉN: «(bajito) Él me contesta "¡A ti, equipo!!". Somos un equipo.» → R0 |
| `inigo_sinergia` 7.7.7 (B) | I0 | «¿Conoces a Herminia?» | ÍÑIGO: «La herramienta de Infografía. Gratis. No escala.» // ÍÑIGO: «Lo que no se factura no existe. Es como un pósit sin color.» → I0 |
| `inigo_sinergia` (B) | I0 | «¿Y el de Controlling?» | ÍÑIGO: «Me llama por las comas de las facturas. Le tengo en azul.» // ÍÑIGO: «Excusas. Pero muy bien puntuadas.» → I0 |
| `gervasio_acta` 7.7.6 (D) | GV_REUNION | «¿Quién tiene reservada la sala?» | GERVASIO: «Ramírez. Los viernes a las 20:59.» // «¿Y dónde está Ramírez?» // GERVASIO: «Desayunando. Desde 2019. Pero la reserva se respeta. Lo hablamos.» → GV_REUNION |
| `teodoro_cuerpodoce` 7.7.5 (C) | T0 | «¿Conoce a Herminia, la de Infografía?» | TEODORO (fax): «LA MÁQUINA DE LEONCIO RESPETA EL CUERPO 9. ES LA ÚNICA.» // TEODORO (fax): «LE MANDO FAXES. ME CONTESTA CON UN QUESITO. NOS ENTENDEMOS.» → T0 |
| `teodoro_cuerpodoce` (C) | T0 | «¿Conoce a don Evaristo?» | TEODORO (fax): «ES DE LOS NUESTROS. ÉL CUENTA COMAS. YO, LÍNEAS.» // TEODORO (fax): «UNA VEZ ME DEVOLVIÓ UN FAX CORREGIDO. LO TENGO ENMARCADO.» → T0 |
| `nerea_backlog` 7.6.3 (B) | N0 (con cms_vivo) | «¿Por qué está bloqueado lo de Herminia?» (se queda) | NEREA: «Lo bloquea Anselmo. Y a Anselmo lo bloquea Anselmo.» // NEREA: «Es la dependencia más estable del tablero.» → N0 |
| `begona_triplicado` 7.6.2 (D) | B0 | «¿Qué le parece Custodia, la de Secretaría?» (se queda) | BEGOÑA: «¿Custodia? No es burocracia, niño. Es temperamento.» // BEGOÑA: «Eso no se sella.» → B0 |

### 4.8 Combinaciones nuevas (Dar / Usar)

| Combinación | Respuesta | Paq. |
|---|---|---|
| Dar `pieza_opa` a `leoncio_quesitos` | LEONCIO: «(Herminia la lee en un segundo) Ya tiene infografía. Papel, web, redes.» // LEONCIO: «No la publico: no está integrada. Pero existe.» | B |
| Dar `planillo` a `leoncio_quesitos` | LEONCIO: «Herminia lo pone en tarta: 100 % Siestatón. Desde marzo.» | B |
| Dar `ficha_pagina_7` a `leoncio_quesitos` | LEONCIO: «Tres casillas. Herminia lo pinta como un semáforo. Estás en ámbar.» | B |
| Dar `acta_reunion` a `leoncio_quesitos` | LEONCIO: «En tarta: 50 % café, 50 % nada. El gráfico más honesto del año.» | B |
| Dar `cafe` a `leoncio_quesitos` | LEONCIO: «Gracias. Herminia dice que es mi quinto. Me lo ha puesto en barras.» | B |
| Dar `pieza_opa` a `anselmo_monolito` | ANSELMO: «¿Escrita fuera del CMS? Te abro un expediente. Mental.» | B |
| Dar `cafe` a `anselmo_monolito` | ANSELMO: «¿Café de Gertrudis? No. Yo bebo del termo. Café propio.» | B |
| Dar `ticket_n1` a `anselmo_monolito` | ANSELMO: «Un ticket cerrado. Eso es de Sistemas. Yo no lo he visto.» | B |
| Usar `chaqueta_ramirez` con `frontera_carrocero` | «Si la dejo en la frontera, Anselmo la integra. Y Ramírez no vuelve.» | B |
| Dar `pieza_opa` a `evaristo_salvedad` | EVARISTO: «(lupa) Treinta y una líneas. Diecisiete comas. Todas en su sitio.» | D |
| Dar `copias_rechazadas` a `evaristo_salvedad` | EVARISTO: «El triplicado tiene una coma distinta.» // EVARISTO: «...Es broma. Es lo único que sé hacer de broma.» | D |
| Dar `ticket_n1` a `evaristo_salvedad` | EVARISTO: «"Asignado a: Titulator 3000". ¿Facturamos a un ticket? Lo apunto.» | D |
| Dar `acta_reunion` a `evaristo_salvedad` | EVARISTO: «Dos faltas y ninguna coma. Casi es poesía. Mala, pero poesía.» | D |
| Dar `cafe` a `evaristo_salvedad` | EVARISTO: «Gracias. ¿Lleva ticket? No lo digo yo. Lo diría Begoña.» | D |
| Dar `tarjeta_becario` a `evaristo_salvedad` | EVARISTO: «"Pellizco". Se lo corrijo a lápiz. Rojo el error, azul usted.» | D |
| Dar `boli_muerto` a `evaristo_salvedad` | EVARISTO: «Sin tinta. Ni para una coma. Lo siento por él.» | D |
| Dar `boli_muerto` a `teodoro_cuerpodoce` (con papel) | TEODORO (fax): «DESCANSE EN CUERPO 9.» | C |
| Usar `boli_muerto` con `ficha_pagina_7` | «No escribe. Pero lo intenta. Como yo.» | A |
| Dar `cafe` a `custodia_precinto` | CUSTODIA: «¿Me soborna con un café de Gertrudis.» // CUSTODIA: «Gertrudis me debe catorce. No cuenta.» | C |
| Dar `tarjeta_becario` a `custodia_precinto` | CUSTODIA: «"Pellizco". Seis años y nunca me ha pedido un boli.» // CUSTODIA: «O es respeto o es miedo. Las dos me valen.» | C |
| Dar `ticket_n1` a `custodia_precinto` | CUSTODIA: «Rubén. Por fin alguien lo apunta. Me debe dos bolis.» | C |
| Dar `pieza_opa` a `portatil_tadeo` | «Ni loco. La reenvía a todos, con resumen y sin leer.» | D |

---

## 5. Micro-puzles opcionales (3)

Ninguno lo pide el juego principal; ninguno gasta objetos del juego principal; ninguno se puede bloquear.

### MP1 · «La becaria Herminia» — `pecera` + `cpd`
- **Precondición:** `cms_vivo` (Paco solo atiende con el CMS vivo).
- **Pasos:**
  1. Hablar `anselmo_monolito` → «¿Y el Titulator? Ese sí entró.» → `anselmo_dijo_regla` («Lo que tiene alta en Sistemas es de la casa»).
  2. Hablar `leoncio_quesitos` → «¿Y si Herminia tuviera alta en Sistemas?» → `leoncio_acepta_alta`.
  3. Hablar `paco_ticket` (nodo P1) → «Quiero dar de alta a una becaria.» → «Herramienta.» → `herminia_de_alta`.
  4. Hablar `anselmo_monolito` → «Hay una becaria nueva en Desarrollo.» → `infografia_integrada`.
- **Premio:** la cinta desaparece; `pantalla_anselmo` cambia; opción CO_HERMINIA del coro; titular del Titulator; línea de Rubén; líneas de Yoli en el epílogo; créditos.
- **Pista justa:** `pantalla_anselmo` («ACCESO CONCEDIDO: TITULATOR 3000 (USUARIO INTERNO)»), la regla de Anselmo y la cara de Leoncio («¿Alta? ¿Como a una persona?»).

### MP2 · «Escuchar hasta el final» — `administracion` + `catacumba`
- **Precondiciones:** `evaristo_convoco` (aviso L2) y `acto_2_iniciado`.
- **Pasos:**
  1. Hablar `evaristo_salvedad` → «¿Para qué me ha llamado?» → «¿De qué trata?» → «Siga.» → «Siga, siga.» → «No pare.» → `evaristo_escuchado`. Cualquier prisa le devuelve a su mesa; se repite desde E0 sin coste.
  2. Hablar `aurora_galerada` → «Don Evaristo pregunta si su coma está bien.» → `coma_bendecida`.
  3. Hablar `evaristo_salvedad` → «Aurora dice que su coma está bien.» → `correo_evaristo_listo`.
- **Premio:** versión A (heroica) del refuerzo del clímax (9.6), escena del epílogo (9.8), línea de créditos y un titular del Titulator.
- **Pista justa:** L2 («Cuando pueda. Pero ahora.»), L5 («Lleva una coma que me tiene en vela»), Begoña («A don Evaristo no se le empuja. Se le espera.»), E_REVELA («Me falta una segunda opinión. De alguien que sepa de comas de verdad.»).

### MP3 · «Boli muerto, boli nuevo» — `office` + `catacumba`
- **Precondición:** `acto_2_iniciado` (Aurora habla).
- **Pasos:**
  1. Hablar `custodia_precinto` → «¿Me deja un boli?» → «¿Y cómo se consigue un boli aquí?» → `custodia_regla`.
  2. Coger `bolis_aurora` → `boli_muerto`, `boli_muerto_cogido`.
  3. Dar `boli_muerto` a `custodia_precinto` → «Para apuntar lo que me digan. Sin grabadora.» → `custodia_ablandada`; −`boli_muerto`.
- **Premio:** CU_DONDE (incluye una pista extra de P13 y de P04/P05), titular del Titulator, créditos.
- **Pista justa:** el cartel («EL MATERIAL NO SE PIDE. SE MERECE»), la regla («Gastado de trabajar, no de perderlo») y Mirar `bolis_aurora` («uno, que yace»).

---

## 6. Objetos y flags nuevos

### 6.1 Objeto nuevo (inventario, paquete A)

| # | id | Nombre | Dónde | Mirar | Usos |
|---|---|---|---|---|---|
| 19 | `boli_muerto` | Boli muerto | Coger `bolis_aurora` (MP3) | «Un boli rojo sin tinta. Murió corrigiendo un "detrás mío".» | Dar a `custodia_precinto` (MP3). **Se gasta.** Combinaciones en 4.8. |

**Texto común que cambia (paquete A):** Mirar `libreta_replicas`: «[N] de 14» pasa a **«[N] de 16»**.

### 6.2 Flags nuevos (todos opcionales; el walkthrough 5.4 no lee ninguno)

| Flag | Tipo | Lo pone (paquete · sala · cuándo) | Lo leen |
|---|---|---|---|
| `evaristo_llamadas` | int | A · común · +1 por llamada (2.1) | A (cola de avisos, saludo de la abuela) · C (línea opcional de 7.3a, ≥ 3) |
| `evaristo_convoco` | bool | A · común · llamada L2 | D (E0, opción 1) |
| `evaristo_escuchado` | bool | D · administracion · E_REVELA | C (Aurora, opción de la coma) · D (ocultar opción 1) |
| `coma_bendecida` | bool | C · catacumba · Aurora, opción de la coma | D (E0, opción 9) |
| `correo_evaristo_listo` | bool | D · administracion · E_ENVIO | D (clímax 9.6 A/B) · A (aviso L5, epílogo 9.8, créditos) · B (titular) |
| `tadeo_rv_n` | int | A · común · +1 por RV: (2.2) | A (Mirar `movil`) · C (murmullo de Aurora) |
| `portatil_tadeo_n` | int | D · ecosistema · +1 por Mirar | D |
| `rep_15` | bool | D · ecosistema · 2.ª Mirar de `portatil_tadeo` | módulo de duelo (A) |
| `rep_16` | bool | D · administracion · E0, opción 4 | módulo de duelo (A) |
| `anselmo_dijo_regla` | bool | B · pecera · AN0, opción 4 | B (LQ0, opción 5) |
| `leoncio_acepta_alta` | bool | B · pecera · LQ_ALTA | A (Paco P1) |
| `herminia_de_alta` | bool | A · cpd · Paco «Herramienta.» | B (AN0 opción 7, Rubén en la Pecera, titular) |
| `infografia_integrada` | bool | B · pecera · AN_HERMINIA | B (cinta, pantalla, Leoncio, coro) · D (nada) · A (epílogo, créditos) |
| `bandeja_diseno_abierta` | bool | B · pecera · Abrir `bandeja_diseno` | B (coro opción 6, `enchufe_pantalla`) |
| `custodia_regla` | bool | C · office · CU_PARAQUE opción 4 | C (`bolis_aurora`, CU_CADAVER, Aurora) |
| `boli_muerto_cogido` | bool | C · catacumba · Coger `bolis_aurora` | C (no se vuelve a dar) |
| `custodia_ablandada` | bool | C · office · CU_DA | C (CU_DONDE) · B (titular) · A (créditos) |
| `planta_oyo` | bool | A · vestibulo · Hablar `planta_plastico` | A (Mirar planta; arranque del rumor A) |
| `planta_empujada_n` | int | A · vestibulo · +1 por Empujar planta | A |
| `rejilla_n` | int | A · cpd · +1 por Usar rejilla | A |
| `hoja_reservas_n` | int | B · pajarera · +1 por Mirar | B |
| `tele_n` | int | D · sala_amazonas · +1 por Usar tele/cables | D |
| `rumor_firma_n` | int | A, C, D, B · lo suma quien cuenta (8.1) | el siguiente de la cadena · A (epílogo, ≥ 4) |
| `rumor_atun_n` | int | A, B · lo suma quien cuenta (8.2) | el siguiente · A (Rubén, ≥ 3) |
| `rumor_teodoro_n` | int | C, B, D · lo suma quien cuenta (8.3) | el siguiente · C (Teodoro, = 3) |
| `rumor_plaza_n` | int | D, A, B · lo suma quien cuenta (8.4) | el siguiente · A (Celestino, = 3) |
| `cuadro_plazas_n` | int | A · vestibulo · +1 por Mirar `cuadro_plazas` | A |
| `piel_platano_n` | int | D · ecosistema · +1 por Mirar `piel_platano` | D |

---

## 7. Duelo: «Responder a Todos» (datos comunes, paquete A)

### 7.1 Parejas nuevas (se añaden a la tabla 6.3)

| id | Ataque | Réplica | Flag | Cómo se aprende | Sala | Rivales |
|---|---|---|---|---|---|---|
| R15 | «Lo he consultado con la IA y está de acuerdo conmigo.» | «Normal. Se lo has preguntado tú.» | `rep_15` | 2.ª Mirar de `portatil_tadeo` (hilo de Tadeo y Leoncio) | ecosistema | D4 |
| R16 | «Eso es un detalle sin importancia.» | «Una coma también lo era. Hasta que alguien la firmó.» | `rep_16` | Evaristo, opción «¿Algún cotilleo?» | administracion | D4 |

### 7.2 Mazo D4 (tabla 6.4)
**R10, R12, R13, R05, R01, R07, R15, R16.** Las dos nuevas van **al final**; el orden determinista no cambia. Con el walkthrough (acierto a la primera) el duelo termina en R05, antes de llegar a ellas. Si el jugador falla, el ataque fallado va detrás de R16 (regla 7). Los demás mazos no cambian.
- `hurt` de Íñigo al recibir R15: «...Lo pongo en azul.» · al recibir R16: «Esa coma no estaba en mi framework.»

### 7.3 Floja nueva (tabla 6.6; siempre en el menú, siempre falla)

| Respuesta de Bruno | Contestación |
|---|---|
| «Eso es cosa de Diseño.» | Cualquiera: «Diseño se fue a las seis y media. Con todo entregado.» · Teodoro (fax): «DISEÑO ME MANDA LAS PÁGINAS A SU HORA. NO COMO OTROS.» · Íñigo: «Diseño entrega a tiempo. No sé en qué cuadrante ponerlos.» |

La primera vez en toda la partida que Bruno la elige, se oye el coro por las paredes, en off: CORO: «¡ESO! ¡DISEÑO!» (no suma ni resta).

**Segunda floja nueva (guiño 8):**

| Respuesta de Bruno | Contestación |
|---|---|
| «¿Y usted cómo se encuentra? De salud, digo.» | Cualquiera: «Estupendamente. La plaza no se hereda, Vacante.» · Teodoro (fax): «MÁS SANO QUE LA GOYITA. Y LA GOYITA TIRA.» · Íñigo: «Yo no tengo plaza. Tengo chófer. Es escalable.» |

### 7.4 Cameo de Tadeo (decorativo, D4)
Tras el **primer acierto** de Bruno en D4, una vez, entra en el hilo: «Tadeo Adjunto respondió a todos: "RV: Resumen IA: todos de acuerdo"!!» No suma, no resta.

### 7.5 Objetos equivocados en un remate (tabla 6.7)

| Objeto | Teodoro (remate T) | Íñigo (remates A y B) |
|---|---|---|
| `boli_muerto` | «LOS MUERTOS NO SE FAXEAN. SE ENTIERRAN EN CUERPO 9.» | «¿Un boli? Yo firmo con el dedo. En la tableta.» |

---

## 8. Rumores que mutan («las paredes oyen»)

**Regla de implementación (todos los paquetes):** cada versión sale **una sola vez**, como **primera línea** al **Hablar** con el PNJ que la cuenta, **antes** de su árbol, cuando su contador está en el paso anterior. Luego el árbol sigue normal. Un PNJ cuenta **como mucho un rumor por conversación** (prioridad: A, luego B, luego C, luego D). Si el jugador se salta a alguien, el rumor espera; nunca sale fuera de orden. Los rumores no enseñan réplicas ni ponen flags de la biblia.

### 8.1 Rumor A · «El becario quiere firmar» (`rumor_firma_n`)
Origen: Bruno le cuenta lo de la firma a la planta del vestíbulo (Hablar `planta_plastico` → `planta_oyo`). La planta tiene micrófono.

| Paso | Lo cuenta (paquete) | Condición | Versión |
|---|---|---|---|
| 1 | CELESTINO (A) | `planta_oyo` | «Me ha dicho la planta que quieres firmar en papel.» // «¿La planta habla?» // CELESTINO: «Hablar no. Pero oye. Y yo oigo a la planta.» |
| 2 | GERTRUDIS (C, LCD, antes del resultado; no toca `chisme_indice`) | paso 1 | «RUMOR: EL BECARIO VA A FIRMAR EL CIERRE DEL PAPEL.» // «"Firmar el cierre" suena a que lo cierro yo.» |
| 3 | BORJA (D, al empezar a hablar) | paso 2 | «¡Me dicen que vas a comprar el periódico! ¡Eso es un lanzamiento!» // BORJA: «Te hago la campaña: "Sonríe como si tuvieras liquidez".» |
| 4 | YOLI (B, al empezar Y0) | paso 3 | «Dicen que eres el nuevo dueño del Contable. Ya es tendencia en tu pueblo.» |
| Remate | ABUELA (A, epílogo, 9.8) | paso 4 | «En el pueblo digo que eres el dueño. Que suena más.» |

### 8.2 Rumor B · «El Titulator come» (`rumor_atun_n`)

| Paso | Lo cuenta (paquete) | Condición | Versión |
|---|---|---|---|
| 1 | PACO (A, P0 o P1) | sin `acto_3_iniciado` | «Por la rejilla del 27 se oye masticar. A deshoras.» |
| 2 | NEREA (B, al empezar N0) | paso 1 | «Dicen que el Titulator consume mucho. Lo ha oído Paco.» |
| 3 | ÍÑIGO (B, I0, Actos I-II) | paso 2 | «Es un modelo muy hambriento. Señal de calidad.» |
| Corrección | EVARISTO (A, aviso L4) | — | «Veinticuatro bocadillos al mes. En Sistemas no come atún nadie.» |
| Desmentido | RUBÉN (A, R0 en el CPD) | paso 3 y `ruben_encontrado` | «Me han dicho que mi consumo es altísimo. Es atún. Del de máquina.» |

### 8.3 Rumor C · «Teodoro vive aquí» (`rumor_teodoro_n`)

| Paso | Lo cuenta (paquete) | Condición | Versión |
|---|---|---|---|
| 1 | AURORA (C, al empezar A_MENU) | `acto_2_iniciado` | «Teodoro duerme aquí desde 1997. Detrás de esa cortina, criatura.» |
| 2 | YOLI (B, al empezar Y0) | paso 1 | «Teodoro vive en la Catacumba. Está hasta empadronado. Lo dice el wifi.» |
| 3 | MARIPAZ (D, al empezar M0) | paso 2 | «Teodoro es el dueño del edificio, cariño. Lo compró en el 97. Por fax.» |
| Desmentido | TEODORO (C, fax, al empezar T0) | paso 3 y `fax_con_papel` | «NO ESTOY EMPADRONADO.» // «ESTOY MAQUETADO.» |

### 8.4 Rumor D · «Alguien deja su plaza» (`rumor_plaza_n`, guiño 8)

| Paso | Lo cuenta (paquete) | Condición | Versión |
|---|---|---|---|
| 1 | BORJA (D, al empezar a hablar) | `acto_2_iniciado` | «¡Dicen que Gervasio deja la plaza 7! ¡Se ha comprado una bici!» |
| 2 | PACO (A, P0 o P1) | paso 1 | «Dicen que Gervasio se va a vivir al garaje. Para no perder la plaza.» |
| 3 | NEREA (B, al empezar N0) | paso 2 | «Dicen que la plaza de Ramírez sale a subasta. Ya tiene columna en el tablero.» |
| Desmentido | CELESTINO (A, al empezar C0) | paso 3 | «Nadie deja una plaza. Las plazas dejan a la gente. Cuando se jubilan.» |

---

## 8bis. Guiño 8 · Las plazas de garaje

**La dinámica:** hay pocas plazas y muchos aspirantes; entre los nuevos corre el deseo de que a alguien con plaza le pase un «accidente» para heredarla. **Tono:** humor negro de dibujos animados. Nadie se hace daño; todos los planes son absurdos y fallan; la palabra va siempre entre comillas; quien tiene plaza está estupendamente.

**Escalada:** (1) el cuadro de llaves con su **línea de sucesión** (vestíbulo) → (2) la porra (Vending) → (3) pésames ensayados (Pecera) → (4) la piel de plátano para quien no imprime (Ecosistema) → (5) el yunque por nota de gasto (Administración) → (6) «¿y usted cómo se encuentra, de salud?» (Maripaz, floja del duelo) → (7) rumor D → **remate** en el epílogo: Teodoro, que no sale del edificio desde 1997, le cede la plaza 1 a Bruno, que no tiene coche. Ni bici.

### 8bis.1 Hotspots y líneas

**`vestibulo` (paquete A).** *Para el artista:* detrás del mostrador de Celestino, un **cuadro de llaves** con doce ganchos y etiquetas; debajo, una hoja larga escrita a lápiz (la línea de sucesión), con tachones.

| id | Mirar | Interacciones especiales |
|---|---|---|
| `cuadro_plazas` | Rota (`cuadro_plazas_n` +1): **1** «El cuadro de llaves del garaje. Doce plazas. Ciento doce aspirantes.» // «Debajo, a lápiz, la línea de sucesión. Como en una monarquía.» · **2** «"Plaza 3: Ramírez. Libre desde 2019. Ocupada por su ausencia".» // «Es la más codiciada. Nadie la usa y todos la quieren.» · **3** «"Sucesión plaza 3: Maripaz, Borja, Yoli, el ficus".» // «Me busco. Debajo del ficus: "Vacante (bici)". Tachado.» · **4** «"Plaza 1: Teodoro C., 1997". No ha salido del edificio desde entonces.» // «Nadie se atreve a pedírsela. Ni a desearle nada.» · **5** (Acto III) «"Plaza 9: Optimal Brains, hasta 2031". Pegado encima de tres herederos.» · después rota entre 2 y 5. | **Coger:** CELESTINO: «Esas llaves no se tocan. Las custodio yo. Y el garaje me custodia a mí.» · **Usar `tarjeta_becario`:** «La tarjeta no abre el garaje. Seis años y no tengo ni plaza de bici.» |

- **Celestino, opción nueva en C0** (A) «¿Cómo se consigue una plaza de garaje?» (se queda): CELESTINO: «Hay dos formas: jubilarse o un "accidente". Con comillas.» // CELESTINO: «La segunda no ha funcionado nunca. Pero lo intentan mucho.» // «¿Y una plaza de bici?» // CELESTINO: «¿Tú eres el nuevo?» → C0
- **Celestino, murmullo nuevo** (Actos II-III): «Hoy tres me han preguntado por mi salud. Con mucho interés. Estoy de miedo.»

**`office` (paquete C).** *Para el artista:* en el tablón, junto al hilo del yogur, una hoja grapada con columnas a boli.

| id | Mirar | Interacciones especiales |
|---|---|---|
| `porra_plazas` | 1.ª: «Una hoja: "PORRA: ¿QUIÉN DEJA ANTES SU PLAZA?". Cinco euros.» // «Gervasio, a tres contra uno. Teodoro, a cuatrocientos. Ramírez: "no computa".» · Siguientes: «Abajo, a boli: "Prohibido apostar por la salud. Solo por la jubilación".» | **Coger:** «Si la quito, me apuestan a mí. Y ni siquiera tengo plaza.» |

- **Gertrudis, chisme de relleno nuevo** (al final de la lista): «CHISME: LA PORRA DEL GARAJE VA TRES A UNO. YO NO APUESTO: ESTOY ENCHUFADA.»

**`pecera` (paquete B).** Murmullos nuevos de `figurantes_web` (los dos de guardia ensayan pésames, por si acaso): «"Lo siento muchísimo. ¿Y la plaza?" ...No, así no.» · «"Era un gran compañero. Aparcaba de lujo".» · «"Mi más sentido pésame. Y mi matrícula, por si acaso".»

**`ecosistema` (paquete D).** *Para el artista:* en el suelo, junto a `impresora_tercera`, una **piel de plátano** con un pósit pegado.

| id | Mirar | Interacciones especiales |
|---|---|---|
| `piel_platano` | 1.ª: «Una piel de plátano junto a la impresora. Pósit: "Para Gervasio (plaza 7)".» // «Gervasio no imprime nunca. El plan tiene un fallo.» · Siguientes (`piel_platano_n` ≥ 1): «Lleva aquí desde marzo. Es más antigua que yo en esta planta.» | **Coger:** MARIPAZ: «¡Deja eso, cariño! Es una inversión a largo plazo.» · **Empujar:** «La aparto con el pie. Aquí no se cae nadie: aquí la gente se jubila.» · **Usar:** «No. Yo quiero una plaza de bici. Y por las buenas.» |

- **Maripaz, murmullo nuevo** (al teléfono): «Gervasio, cariño, ¿y tú cómo te encuentras? De salud, digo.»
- **Borja, murmullo nuevo:** «Si alguien deja su plaza, el photocall del pésame lo pongo yo.»

**`administracion` (paquete D).**
- `pared_rechazadas` (existe), entrada nueva en la rotación: «"Yunque, una unidad. Motivo: un yunque no es material de oficina".»
- **Begoña, opción nueva en B0** «¿Le han pedido algo raro hoy?» (se queda): BEGOÑA: «Un yunque. Por nota de gasto. Concepto: "Sucesión, plaza 7".» // BEGOÑA: «Rechazado. Si lo aprobara, tendría que justificar la caída.» → B0
- **Evaristo, murmullo nuevo:** «Plaza 3, sucesión en disputa. Esto no es un garaje. Es una herencia.»

**Gervasio, murmullo nuevo** (en todas sus salas; B, C y D): «Hoy me han preguntado tres veces por mi salud. Debo de estar fatal.»

### 8bis.2 Remate (inserto en 7.5, paquete A, siempre)
En el vestíbulo, después del inserto 9.8a (o, si no sale, después de la «¿Tú eres el nuevo?» de Celestino que sigue a «Celestino, que la noticia es mía.») y antes de «(Bruno llama. Suena dos veces.)»:
```
CELESTINO: Y esto ha llegado por fax. De la Catacumba. Para ti.
CELESTINO: (lee, despacio) "PLAZA 1. NO LA USO DESDE 1997. ES TUYA, CHAVAL."
CELESTINO: "Y QUE NADIE ME DESEE NADA."
BRUNO: No tengo coche.
CELESTINO: Ni bici.
BRUNO: (al jugador) Seis años sin plaza de bici. Y ahora tengo una de coche.
CELESTINO: (tacha el cuadro de llaves) La línea de sucesión acaba de enloquecer.
```
**Créditos** (se añade a 9.8d): «Plazas de garaje — Asignado a: Bruno Pellejo (plaza 1, sin coche).»

---

## 9. Insertos exactos en escenas existentes

Todos son **solo texto**: no ponen ni exigen flags de la tabla 5.5 de la biblia.

### 9.1 Escena 7.2 · Presentación del villano (paquete B)
Entre «ÍÑIGO: Vengo a reimaginar el perímetro.» y «YOLI: Eso es despedir con diapositivas.»:
```
CORO: (desde el rincón) ¡Ha sido Diseño!
ÍÑIGO: ...No he dicho nada malo todavía.
DEV 1: Por si acaso.
```

### 9.2 P05 · La pantalla que tumba el CMS (paquete B)
Entre «YOLI: ¡Estamos ciegos! ¿Hay alguien leyendo? ¿HAY ALGUIEN AHÍ FUERA?» y «YOLI: ...Ha entrado una pieza. Y otra. ¿El CMS va?»:
```
CORO: ¡Ha sido Diseño!
BRUNO: (al jugador) He sido yo. Pero gracias.
```

### 9.3 Escena 7.3a · Inicio del Acto III (paquete C)
Solo con `evaristo_llamadas` ≥ 3, entre «TEODORO (fax): Página 7 cerrada.» y «(Descuelga el teléfono rojo...)»:
```
TEODORO (fax): Y la coma de Controlling, en su sitio. Ese hombre lee.
```

### 9.4 Escena 7.4 · Clímax, entrada (paquete D)
Entre la acotación «(Penumbra. Proyector: diapositiva 247 de 400... con un café que no le han servido.)» y «ÍÑIGO: ...y en la fase 3, el papel pasa a ser un recuerdo de marca.»:
```
ÍÑIGO: Siguiente.
(La diapositiva no cambia. Sigue en la 247.)
ÍÑIGO: Siguiente.
ÍÑIGO: Perfecto. Como veis, la 247 tiene mucho recorrido.
BRUNO: (al jugador) El proyector se colgó en la 247 hace tres semanas.
BRUNO: (al jugador) Él cree que avanza. El Lector Medio cree que asiente.
```

### 9.5 Escena 7.4 · Empujar al Lector Medio, tras el ¡PLOF! (paquete D)
Entre «ÍÑIGO: Es la primera vez que la matriz me pone en algún sitio.» y «(Entra Begoña con una factura cogida con dos dedos...)»:
```
(Con el golpe del Lector Medio, el cable del proyector se mueve. Zumbido.
 La pantalla salta, por primera vez en tres semanas, a la diapositiva 248.)
(rótulo, en la diapositiva) EL VIAJE CONTINÚA
ÍÑIGO: ...Ahora no.
BRUNO: (al jugador) Quedan ciento cincuenta y dos. No las verá nadie.
```
> Cuenta: 400 − 248 = 152.

### 9.6 Escena 7.4 · El héroe de la coma (paquete D) — **refuerzo opcional**
Entre «(¡SELLO!) BEGOÑA: Rechazada. Va a la pared. Al lado del ministro.» y «(Por los altavoces del edificio, la voz ronca de Teodoro por el teléfono rojo.)». **No cambia las condiciones de victoria:** a esa altura ya está puesto `duelo_inigo_ganado` y `lector_derribado` se pone igual. Sale **una de las dos versiones**, según `correo_evaristo_listo`.

**Versión A · con `correo_evaristo_listo`:**
```
(En la mesa, el teléfono de conferencias se ilumina. Pantallita: CONTROLLING.)
EVARISTO: (por el altavoz) Buenas noches. Una cosita. Muy pequeña.
ÍÑIGO: ¿Quién es Evaristo?
GERVASIO: El que llama. De mis tres móviles, uno es para no cogerle.
EVARISTO: Les anuncié un correo. Lo envío ahora. Con todos en copia.
(¡PLIN! en todos los móviles del edificio. De: Evaristo Salvedad. Asunto: Una coma.)
BRUNO: (lee) "Contrato Optimal Brains. Cláusula 4: 48,000 euros al mes."
BRUNO: (lee) "Cláusula 12: punto de miles y coma decimal. Son 48 euros."
ÍÑIGO: ¡Es formato internacional! ¡Lo entiende todo el mundo!
EVARISTO: Cláusula 13: ley española. Y lo oscuro, contra quien lo escribe.
EVARISTO: Hemos pagado cuarenta y ocho mil al mes. El contrato dice cuarenta y ocho.
EVARISTO: Cuatro meses. Nos deben 191.808 euros. Lo he revisado tres veces.
BEGOÑA: Cuatro. La cuarta la he hecho yo.
BEGOÑA: (palidece) ...Una cuarta copia. Esto acaba en un juzgado.
EVARISTO: Exacto, Begoña. Esta vez, a favor.
RUBÉN: Cuarenta y ocho euros al mes... Es lo que me como en atún.
EVARISTO: Veinticuatro bocadillos a dos euros. La única cifra que cuadraba.
EVARISTO: Con lo que nos deben hay partida para un contrato. Con coma.
RUBÉN: ¿Con táper?
EVARISTO: El táper, con ticket. Era solo eso. Buenas noches. (clic)
GRABACIÓN: (desde el suelo, el Lector Medio) ...Y ahorrar.
```
> **Cuentas (dos veces):** 48.000 − 48 = 47.952 € al mes. Julio, agosto, septiembre y octubre = 4 facturas pagadas (la de noviembre es la que Begoña acaba de rechazar). 47.952 × 4 = 191.808 €. 24 × 2,00 € = 48 €. «48,000» con coma decimal = 48 euros con tres decimales a cero.

**Versión B · sin `correo_evaristo_listo`:**
```
(Vibra uno de los tres móviles de Gervasio. Lo mira. Lo coge.)
GERVASIO: Es Evaristo. Dice que nos va a escribir un correo.
GERVASIO: Lo hablamos. (cuelga)
BRUNO: (al jugador) Algo importante se nos acaba de escapar. Por una coma.
```

### 9.7 Escena 7.4 · orden final de la secuencia tras Empujar
¡PLOF! → grabación / Gervasio → «¿Y quién ha validado la fase 1?» → «Sin Lector Medio no hay plan» → matriz de Íñigo → **9.5 (diapositiva 248)** → Begoña y la factura → **9.6 (Evaristo A o B)** → «Goyita. Tira.» → Rubén y Bruno → `lector_derribado`.

### 9.8 Escena 7.5 · Final (paquete A)
**a) Evaristo, solo con `correo_evaristo_listo`.** Vestíbulo, entre «CELESTINO: ¿Tú eres el nuevo?» (la que sigue a «Celestino, que la noticia es mía.») y «(Bruno llama. Suena dos veces.)»:
```
(Pasa Evaristo, con un ejemplar bajo el brazo y la lupa.)
EVARISTO: Pellejo. Lo he revisado en el periódico. Con jota y dos eles.
EVARISTO: Correcto.
BRUNO: Gracias, don Evaristo.
EVARISTO: Le escribiré un correo para felicitarle.
BRUNO: ¿Y si me lo dice ahora?
EVARISTO: (se lo piensa. Mucho.)
EVARISTO: ...Felicidades.
EVARISTO: Es la primera vez que lo digo sin adjunto.
```
> G1 intacto: Teodoro sigue siendo el primero que escribe bien el nombre; Evaristo lo **revisa** impreso.

**b) La abuela y el rumor, solo con `rumor_firma_n` ≥ 4.** Entre «ABUELA: No lo entiendo, pero lo escribes muy bonito.» y «ABUELA: Y te pongo "abrígate". Que nunca contestas.»:
```
ABUELA: En el pueblo digo que eres el dueño. Que suena más.
BRUNO: Abuela...
ABUELA: Tú déjame. Los rumores, en el pueblo, son como el periódico.
ABUELA: Si lo dice mucha gente, sale.
```

**c) La Pecera.** Entre «YOLI: Y desde esta noche, otro. Comenta "gracias por sacarme". En mayúsculas.» y «BRUNO: (al jugador) Si has llegado hasta aquí...». Primero, solo con `infografia_integrada`:
```
YOLI: La infografía de la opa: permanencia, más de un 40 %.
YOLI: Firmada por dos departamentos. Bueno, firmada no. Reclamada.
```
Después, **siempre** (el coro sigue al fondo, de espaldas):
```
DEV 1: La web ha publicado la opa a las 00:01. Sin un fallo.
DEV 2: Ni uno.
DEV 1: ¿Y a quién se lo damos?
CORO: (se miran) ...Diseño.
BRUNO: Diseño soy yo. Lo pone el organigrama.
DEV 2: Pues enhorabuena, Diseño.
CORO: Enhorabuena, Diseño.
BRUNO: (al jugador) Por fin tengo departamento. Y es el que tenía razón.
```

**d) Créditos** (paquete A), se añaden a la lista «Asignado a:», en este orden:
- «Infografía — Asignado a: Herminia.» + con `infografia_integrada`: «(becaria de Desarrollo, alta en 40 segundos)»; sin él: «Integración: pendiente de revisión (marzo).»
- «Diseño y Producto — Asignado a: Diseño y Producto. Entregado a las 18:29.»
- «Errores — Asignado a: Diseño (que no fue).»
- «Controlling — Asignado a: el único que leyó hasta el final.» (sin `correo_evaristo_listo`: «Controlling — Asignado a: un correo que nadie quiso oír.»)
- «Material — Asignado a: Custodia Precinto. Devuélvanle el boli.»
- «Salas — Asignado a: Ramírez (viernes, 20:59, recurrente).»
- «Reenvíos — Asignado a: la impresora de la tercera, la única que leía a Tadeo.»
- «Rumores — Asignado a: la planta del vestíbulo (micrófono de 1994).»
- «Plazas de garaje — Asignado a: Bruno Pellejo (plaza 1, sin coche).»
- «Dirección de arte — Asignado a: Valentín Retícula (lo entregó a las 18:29).»

En una esquina de los créditos, opuesta al LCD de Gertrudis, un hilo de correo (cuatro líneas, texto en pantalla):
```
De: Tadeo Adjunto · RV: Fe de erratas · "¡Equipo! ¿Esto lo ha escrito la IA?!!"
De: Bruno Pellejo · RE: No. Un becario.
De: Tadeo Adjunto · RE: ¡Qué modelo más bueno! ¿Cuánto cuesta?
De: Evaristo Salvedad · RE: Cuarenta y ocho euros. Con coma.
```
El poscréditos canónico (Ramírez vuelve; la impresora imprime «BANDEJA 2 INSTALADA») **no cambia**: remata a la vez la reserva de Ramírez (G-SALAS) y el RV2 de Tadeo (G-RV).

### 9.9 Titulares de hazaña nuevos del Titulator (8.3, paquete B)

| Flag | Titular |
|---|---|
| `herminia_de_alta` | «UNA HERRAMIENTA CONSIGUE CONTRATO EN 40 SEGUNDOS. UN BECARIO, EN SHOCK» |
| `custodia_ablandada` | «UN BECARIO CONSIGUE UN BOLI. LO DEVUELVE A LOS DIEZ SEGUNDOS» |
| `correo_evaristo_listo` | «UN SEÑOR ANUNCIA UN CORREO. LO QUE PASÓ DESPUÉS: NADA, DE MOMENTO» |

La regla de la 3.ª mirada («AYÚDAME ESTOY EN EL ARMARIO 27») manda sobre estos.

---

## 10. Running gags nuevos (escalada y remate)

| Gag | Se presenta | Se repite / escala | Remate |
|---|---|---|---|
| **G-FRONTERA** · la cinta de Anselmo | Acto I: «Alto. Esto es Desarrollo.» + «ACCESO DENEGADO: HERMINIA / CONCEDIDO: TITULATOR 3000» | Acto II: la cinta avanza; gráficos de 130 %. Acto III: enclave de Leoncio; «Lo revoco. Con fecha de hoy. Y de julio.» | MP1: Anselmo despega la cinta: «Me han anexionado. ...Pero integrada.» Sin MP1: créditos «pendiente de revisión (marzo)». |
| **G-RV** · Tadeo reenvía | RV1 (40 páginas de Core Web Vitals) | RV2 (la bandeja 2), RV3-RV4, portátil, Cerrar por actos; RV5 reenvía el «AYÚDAME» como reflexión | Poscréditos canónico: «BANDEJA 2 INSTALADA». La impresora era la única que le leía. |
| **G-COMA** · «Una cosita. Muy pequeña.» | L1 (¿una ele o dos? ¿jota o ge?) | L2 convoca; L3 salva la exclusiva (4,15); L4 encuentra a Rubén con una hoja de cálculo; L5 «Lleva una coma que me tiene en vela» | Clímax A: el Lector Medio caído le da la razón: «...Y ahorrar.» Epílogo: «Felicidades. Es la primera vez que lo digo sin adjunto.» |
| **G-DISEÑO** · «¡Ha sido Diseño!» | Escena 7.2 (9.1) | P05 (9.2); discusiones de fondo; Bruno cuelga de Diseño en el organigrama; floja nueva en el duelo | **Humillación con cariño:** la bandeja de 2017 (CO_BANDEJA): Diseño tenía razón. Epílogo: «Enhorabuena, Diseño.» |
| **G-PARAQUÉ** · Custodia | 1.ª conversación: «¿Qué quiere.» | Todo lo que se pide sale mal; Aurora: «Es una sentencia.»; Begoña: «Es temperamento.» | CU_DA: «Ya ha firmado. Ya lo ha usado. Devuélvamelo.» Y luego sabe dónde está Rubén: «No me preguntó nadie.» |
| **G-SALAS** · la reserva y la 247 | `hoja_reservas`: Ramírez, viernes a las 20:59, recurrente | Relojes parados a las 20:59: la sala es de Ramírez siempre; «cinco minutitos» desde marzo; la tele y sus entradas; Íñigo «hasta 2031» encima de Ramírez | Clímax: «Siguiente.» (9.4) y, tras el ¡PLOF!, la 248: «EL VIAJE CONTINÚA.» // «...Ahora no.» Créditos y poscréditos: Ramírez vuelve. |
| **G-PLAZAS** · el garaje | Cuadro de llaves y línea de sucesión | Porra, pésames ensayados, piel de plátano, yunque, «¿cómo se encuentra de salud?», rumor D | Epílogo: Teodoro cede la plaza 1 a Bruno, sin coche ni bici. |
| **G-PAREDES** · rumores | La planta con micrófono de 1994 | Tres cadenas (8.1-8.3), la rejilla del CPD | La abuela: «Si lo dice mucha gente, sale.» Teodoro: «ESTOY MAQUETADO.» |

---

## 11. Reparto por paquetes

### 11.1 Qué hace cada paquete (sección 9 de la biblia)

| Paquete | Salas | Elementos nuevos |
|---|---|---|
| **A · vestíbulo + CPD + común/final** | `vestibulo`, `cpd` | Menciones del cameo por Celestino y Paco (el cameo, `valentin_reticula`, y `monitor_valentin` pasaron a la Pecera, paquete B). Ascensor con botonera (14). Garaje: `cuadro_plazas`, opción y murmullo de Celestino, rumor D paso 2 (Paco) y desmentido (Celestino), remate 8bis.2. Hotspots `altavoz_ibex`, `rama_diseno`, añadidos de `planta_plastico` (Hablar → `planta_oyo`, Empujar), `rejilla_cpd`. Línea del Ibex nueva. Opciones nuevas de Paco (alta de Herminia, rejilla, Tadeo) y de Rubén (Tadeo). Rumor A paso 1 (Celestino), rumor B paso 1 (Paco) y desmentido (Rubén). **Común:** cola de avisos (2.1 llamadas, 2.2 RV:), saludo nuevo de la abuela, Mirar de `movil` y `libreta_replicas`, objeto `boli_muerto` y su combinación con la ficha, datos de duelo (7.1-7.5). **Final:** insertos 9.8 a-d (epílogo, créditos, hilo de esquina). |
| **B · Pecera + Pajarera** | `pecera`, `pajarera` | PNJ `leoncio_quesitos`, `anselmo_monolito`; presencias `herminia`, `coro_desarrollo`. Hotspots de 3.3 y 3.4. Árboles 4.1, 4.2, 4.3. Opciones nuevas de Íñigo y Nerea. Añadido de `enchufe_pantalla`. Línea de Rubén en la Pecera. Rumores: A paso 4 (Yoli), B pasos 2-3 (Nerea, Íñigo), C paso 2 (Yoli). Insertos 9.1 y 9.2. Titulares 9.9. Combinaciones de 4.8 marcadas B. Murmullos nuevos de Nerea y Yoli. Garaje: pésames de `figurantes_web`, rumor D paso 3 (Nerea), murmullo de Gervasio en la Pajarera. Cameo: murmullo de Nerea y discusión del coro sobre Valentín. |
| **C · Vending + Catacumba** | `office`, `catacumba` | Presencia `custodia_precinto` (árbol 4.4) y hotspots de 3.5; hotspots `bolis_aurora`, `corrector_aurora` (3.6). Opciones nuevas de Aurora (coma, Custodia) y Teodoro (Herminia, Evaristo). Murmullo de Aurora por los «!!». Chismes de relleno nuevos de Gertrudis. Rumores: A paso 2 (Gertrudis), C paso 1 (Aurora) y desmentido (Teodoro). Inserto 9.3. Combinaciones C. Garaje: `porra_plazas`, chisme nuevo de Gertrudis, murmullo de Gervasio en el Vending. |
| **D · Ecosistema + Eventos + Administración + Sala Amazonas** | `ecosistema`, `eventos`, `administracion`, `sala_amazonas` | PNJ `evaristo_salvedad` (árbol 4.6) y hotspots de 3.8; presencia `tadeo_adjunto` vía `portatil_tadeo` (3.7, árbol 4.5); hotspots de la Sala (3.9). Opciones nuevas de Gervasio (reunión) y Begoña. Murmullos de Begoña, Maripaz, Borja y Mercados. Rumores: A paso 3 (Borja), C paso 3 (Maripaz). Insertos 9.4, 9.5, 9.6 (A y B). Cameo 7.4 y `hurt` nuevos de Íñigo en D4. Combinaciones D. Garaje: `piel_platano`, yunque en `pared_rechazadas`, opción de Begoña, murmullos de Maripaz, Borja, Evaristo y Gervasio (Sala), rumor D paso 1 (Borja). Cameo: murmullo de Borja. |

### 11.2 Lo que deben añadir los ficheros comunes

**Actores** (id · nombre en pantalla · color · tipo):
- `leoncio_quesitos` · Leoncio Quesitos · `#00C2A8` · PNJ con sprite (pecera)
- `anselmo_monolito` · Anselmo Monolito · `#D96CFF` · PNJ con sprite (pecera)
- `valentin_reticula` · Valentín Retícula · `#C0E8FF` · PNJ con sprite, cameo (pecera)
- `pilar_escaleta` · Pilar Escaleta · `#A8F07A` · PNJ con sprite, Eventos (`eventos`, Sala Polivalente), §13
- `evaristo_salvedad` · Evaristo Salvedad (en globos: EVARISTO) · `#B5A642` · PNJ con sprite (administracion; vestíbulo en el epílogo)
- `custodia_precinto` · Custodia Precinto (CUSTODIA) · `#A0A0FF` · presencia (manos bajo persiana; Secretaría de Redacción, en `pecera`)
- `tadeo_adjunto` · Tadeo Adjunto (y PORTÁTIL, su asistente) · `#FFCC99` · presencia (portátil, ecosistema; móvil)
- `herminia` · Herminia · `#00C2A8` · objeto con carácter (rótulos)
- `coro_desarrollo` · DEV 1, DEV 2, DEV 3, CORO · `#7FFFD4` · figurantes de espaldas (pecera)
- `altavoz_ibex` · ALTAVOZ · `#CCCCCC` · voz de objeto (vestíbulo)

**Objetos:** `boli_muerto` (6.1).

**Flags:** los de 6.2, con su tipo y valor inicial (`false` / `0`).

**Datos de duelo:** parejas R15/R16 (7.1), mazo D4 ampliado (7.2), `hurt` nuevos de Íñigo, **dos** flojas nuevas (Diseño y la salud) con sus contestaciones y el grito en off de una sola vez (7.3), cameo de Tadeo (7.4), fila de `boli_muerto` en remates (7.5).

**Avisos al entrar en sala:** cola de 2.1 y 2.2 con la regla de prioridad y las exclusiones (escenas, duelos, Sala en el Acto III).

### 11.3 Lo que dibuja cada artista de fondo (hotspots nuevos por sala)

| Sala | Hotspots / estados nuevos que hay que dibujar |
|---|---|
| `vestibulo` | `cuadro_plazas` (cuadro de llaves y hoja de sucesión tras el mostrador), `altavoz_ibex` (altavoz con bufanda), `rama_diseno` (rótulo «DISEÑO Y PRODUCTO» en la rama de VACANTE), micrófono bajo la hoja de `planta_plastico` (estado tras Empujar). Epílogo: sprite de Evaristo (lo trae el personaje). |
| `cpd` | `rejilla_cpd` (rejilla en el suelo técnico); armarios 22 y 23 y cables donde estaba el rincón de Valentín; mampara tras Paco; `ascensor_cpd` con la botonera común. |
| `pecera` | `sillas_con_chaqueta` (sillas vacías con chaqueta y pantallas encendidas, 80-180 px), sprite de Leoncio, `mesa_dibujo`, `herminia_portatil` (portátil con pegatina y animación), dos sillas con chaqueta giradas hacia Herminia, `frontera_carrocero` (4 estados: 420 px, 400 px, 400 px + lazo alrededor de Leoncio, sin cinta con marca), `cartel_frontera` (atril), coro de espaldas con manos animadas, `semaforo_ruido` (rojo; ámbar y verde para escenas), `taza_no`, `bandeja_diseno`, sprite de Anselmo, `pantalla_anselmo`. |
| `pajarera` | `hoja_reservas` en la puerta (y folio del Acto III encima), `posit_evaristo` en la matriz. |
| `office` → `pecera` (orden v) | `porra_plazas` (hoja en el tablón, se queda en el Vending); en la Redacción: ventanuco con persiana metálica a media altura (`custodia_precinto`): manos con guantes (idle y dos frames de «sacar la mano»), llave con cinta roja, esquina del libro negro; `cartel_material`; `timbre_secretaria`. |
| `catacumba` | `bolis_aurora` (bote con un boli tumbado), `corrector_aurora` (tableta bajo el Libro de Estilo). |
| `ecosistema` | mesa vacía con chaqueta y `portatil_tadeo` (portátil con notificaciones, 2 frames); `piel_platano` con pósit junto a la impresora. |
| `administracion` | despacho acristalado con `puerta_controlling`, `contratos_evaristo`, `coma_enmarcada`, sprite de Evaristo (sentado tras el cristal y de pie en la puerta). |
| `sala_amazonas` | `tele_amazonas`, `caja_cables`, `carteles_amazonas` (Actos I-II); en el clímax, el estado «diapositiva 248: EL VIAJE CONTINÚA» del proyector. |

---

## 12. Walkthrough de extras y verificación

### 12.1 Cómo se prueba
- **Partida de extras:** se reproduce el walkthrough 5.4 completo **intercalando** los pasos X de esta tabla en el sitio indicado. Tras cada fila del 5.4 se siguen comprobando sus resultados esperados; tras cada fila X, los de esta tabla.
- **Avisos y rumores automáticos:** las llamadas, los RV: y los rumores salen solos al entrar en salas o al hablar. **El test los acepta** (cierra el globo y sigue) y comprueba los contadores en los puntos de control. Nunca ponen flags del 5.4.
- **Formato:** `VERBO objeto [con/a objeto]`; elecciones de diálogo entre comillas.

### 12.2 Tabla

| # | Dónde va | Sala | Acción | Resultado esperado |
|---|---|---|---|---|
| X1 | tras el paso 7 | vestibulo | Hablar planta_plastico | `planta_oyo` |
| X2 | | vestibulo | Empujar planta_plastico | `planta_empujada_n`=1 |
| X3 | | vestibulo | Hablar celestino → (rumor A1 al empezar) → «Nada, Celestino.» | `rumor_firma_n`=1 |
| X4 | | vestibulo | Mirar rama_diseno · Usar altavoz_ibex | sin flags |
| X4b | | vestibulo | Mirar cuadro_plazas ×3 · Hablar celestino → «¿Cómo se consigue una plaza de garaje?» → «Nada, Celestino.» | `cuadro_plazas_n`=3 |
| — | pasos 8-9 | | (al entrar en la `pajarera` del paso 10 sale la llamada L1) | `evaristo_llamadas`=1 |
| X5 | tras el paso 13 | pecera | Mirar sillas_con_chaqueta · Hablar leoncio_quesitos → «¿Qué es Herminia?» → «Me voy.» | sin flags; RV1 ya salió en alguna entrada (`tadeo_rv_n` ≥ 1) |
| — | paso 14 | office | (el «Buenas noches» lleva antes el rumor A2) | `rumor_firma_n`=2 |
| — | paso 17 | catacumba | (A_MENU lleva antes el rumor C1) | `rumor_teodoro_n`=1 |
| — | tras el paso 20 | | Control: L2 ya ha salido (primera entrada tras el paso 16) | `evaristo_convoco`, `evaristo_llamadas`=2 |
| X6 | tras el paso 20 | pecera | Hablar custodia_precinto → «¿Me deja un boli?» → «¿Y cómo se consigue un boli aquí?» | `custodia_regla` |
| — | paso 23 | pecera | (Y0 lleva antes el rumor C2) | `rumor_teodoro_n`=2 |
| X7 | tras el paso 24 | pecera | Hablar anselmo_monolito → «¿Y el Titulator? Ese sí entró.» → «Me voy.» | `anselmo_dijo_regla` |
| X8 | | pecera | Hablar leoncio_quesitos → «¿Y si Herminia tuviera alta en Sistemas?» | `leoncio_acepta_alta` |
| X9 | | pecera | Abrir bandeja_diseno · Hablar coro_desarrollo → «Diseño os avisó de lo del CMS. En 2017.» | `bandeja_diseno_abierta` |
| — | paso 25 | cpd | (P1 lleva antes el rumor B1) | `rumor_atun_n`=1 |
| X10 | tras el paso 26 | cpd | Hablar paco_ticket → «Quiero dar de alta a una becaria.» → «Herramienta.» | `herminia_de_alta` |
| X11 | | cpd | Usar rejilla_cpd | `rejilla_n`=1 |
| X11b | | pecera | *(tras X12, ya en la Pecera)* Hablar valentin_reticula → «¿Qué está dirigiendo?» → «¿Por qué trabaja aquí, al lado de Desarrollo?» → «¿Sabía que la pantalla tumbaba el CMS?» → «Me voy.» · Usar monitor_valentin | sin flags |
| X12 | | pecera | Hablar anselmo_monolito → «Hay una becaria nueva en Desarrollo.» | `infografia_integrada` |
| X13 | | pecera | Hablar coro_desarrollo → «Herminia ahora es de Desarrollo.» | sin flags (escena CO_HERMINIA) |
| X14 | | pecera | Hablar nerea_backlog → (rumor B2 al empezar) → «Nada, ya me voy.» | `rumor_atun_n`=2 |
| X15 | | pajarera | Hablar inigo_sinergia → (rumor B3 al empezar) → «Me voy.» | `rumor_atun_n`=3 |
| — | pasos 27-28 | | | |
| X16 | tras el paso 28 | ecosistema | Mirar portatil_tadeo ×2 | `portatil_tadeo_n`=2, `rep_15` |
| X17 | | ecosistema | Hablar borja_engagement → (rumor A3) → «Me voy.» | `rumor_firma_n`=3 |
| X17b | | ecosistema | Hablar borja_engagement → (rumor D1) → «Me voy.» · Mirar piel_platano | `rumor_plaza_n`=1, `piel_platano_n`=1 |
| — | paso 29 | ecosistema | (al hablar con Maripaz antes de dar el planillo: Hablar maripaz_remitido → rumor C3 → «Me voy.»; luego Dar planillo) | `rumor_teodoro_n`=3 |
| X18 | tras el paso 30 | administracion | Usar puerta_controlling → «¿Algún cotilleo?» | `rep_16` |
| X18b | | administracion | Hablar begona_triplicado → «¿Le han pedido algo raro hoy?» → «Nada. Me iba.» | sin flags |
| X19 | | administracion | Hablar evaristo_salvedad → «¿Para qué me ha llamado?» → «¿De qué trata?» → «Siga.» → «Siga, siga.» → «No pare.» | `evaristo_escuchado` |
| X20 | tras el paso 31 | catacumba | Coger bolis_aurora | `boli_muerto`, `boli_muerto_cogido` |
| X21 | tras el paso 33 | catacumba | Hablar aurora_galerada → «Don Evaristo pregunta si su coma está bien.» | `coma_bendecida` |
| — | paso 35 | catacumba | (T0 lleva antes el desmentido C de Teodoro al hablarle; luego «Quiero firmar en tu página 7.») | rumor C cerrado (sin cambio de contador) |
| X22 | tras el paso 36 | administracion | Hablar evaristo_salvedad → «Aurora dice que su coma está bien.» | `correo_evaristo_listo` |
| — | paso 37 | catacumba | (al entrar, L3; en 7.3a sale la línea 9.3) | `evaristo_llamadas`=3 |
| X23 | tras el paso 37 | pecera | (al entrar en la Redacción sale L4, versión sin Rubén) Dar boli_muerto a custodia_precinto → «Para apuntar lo que me digan. Sin grabadora.» | `custodia_ablandada`; −`boli_muerto`; `evaristo_llamadas`=4 |
| X24 | | office | Hablar custodia_precinto → «¿Dónde está...?» → «¿Dónde está el Titulator?» → «Ya está.» | sin flags |
| — | paso 38 | cpd | (L5 sale en una de las salas por las que se pasa camino del CPD: las llamadas saltan en cada entrada, también de paso) | `evaristo_llamadas`=5 |
| X23b | antes de Tirar (paso 38) | cpd | Hablar paco_ticket → (rumor D2) → «Me voy.» | `rumor_plaza_n`=2 |
| — | paso 39 | cpd | (R0 lleva antes el desmentido B de Rubén) | sin flags |
| — | pasos 40-42 | | (RV5 ya ha salido en alguna entrada sin llamada pendiente) | `evaristo_llamadas`=5, `tadeo_rv_n`=5 |
| X25 | tras el paso 41 | pecera | Hablar yoli_tendencias → (rumor A4 al empezar) → «Me voy.» | `rumor_firma_n`=4 |
| X25b | antes del paso 41 | pecera | Hablar nerea_backlog → (rumor D3) → «Nada, ya me voy.» | `rumor_plaza_n`=3 |
| X26 | tras el paso 42 | vestibulo | (ascensor desde el CPD) Hablar celestino → (desmentido D) → «Nada, Celestino.» | rumor D cerrado |
| — | pasos 43-46 | | Clímax con 9.4, 9.5 y **9.6 versión A**; epílogo con 9.8 a, 8bis.2, 9.8 b y c; créditos con las versiones «con» | `juego_terminado` |

### 12.3 Verificación (hecha por el jefe de guion, con el mismo modelo de estado que la sección 10 de la biblia)
- **El walkthrough 5.4 no cambia:** ningún paso X pone, quita ni exige un flag u objeto de la biblia. Los 46 pasos se cumplen con y sin extras. Los mazos D1-D3 no cambian; D4 se gana en R05 antes de llegar a R15/R16.
- **Las condiciones de victoria no cambian:** 9.6 sale después de `duelo_inigo_ganado` y antes de «Goyita. Tira.»; `lector_derribado` se pone igual en las versiones A y B.
- **Los tres micro-puzles se resuelven:** MP1 en X7, X8, X10, X12 (con `cms_vivo` desde el paso 22); MP2 en X19, X21, X22 (con `evaristo_convoco` desde la primera entrada tras el paso 16 y `acto_2_iniciado`); MP3 en X6, X20, X23.
- **Objeto nuevo:** `boli_muerto` se consigue (X20) antes de usarse (X23) y se usa una vez. Ningún objeto del juego principal entra ni sale en los pasos X.
- **Flags nuevos sin huérfanos:** todos los de 6.2 tienen quien los pone y quien los lee (los contadores de rotación los lee su propio hotspot).
- **Avisos:** con el orden del 5.4 hay entradas de sobra para que salgan L1-L5 (L1 en el paso 10; L2 en la primera entrada tras el 16; L3 en el 37; L4 en la primera entrada posterior —la Redacción de X23, o el CPD del 38 sin extras—; L5 en la siguiente entrada, de paso hacia el CPD con extras o entre el 40 y el 44 sin ellos) y RV1-RV5 (las entradas sin llamada pendiente). Ninguno sale en escenas, duelos ni en la Sala del clímax.
- **Rumores:** con la tabla 12.2, las cuatro cadenas llegan al final (A en X25, B en el paso 39, C en el paso 35, D en X26). X25b va antes del paso 41 (Dar el álbum no es Hablar; el rumor sale al Hablar). Si el jugador se salta un eslabón, la cadena espera y solo se pierde el remate opcional.
- **Sin callejones:** MP2 se reinicia sin coste; en MP3 el muerto no se gasta hasta CU_DA y Custodia lo devuelve si Bruno sale; MP1 no gasta nada.
- **Sprites:** 4 PNJ nuevos con sprite (tope cumplido); el cameo cuenta.
- **Garaje:** ningún hotspot del guiño 8 pone flags del 5.4; el remate 8bis.2 sale siempre y no lee flags.
- **Cifras:** 48.000 − 48 = 47.952; 47.952 × 4 = 191.808; 24 × 2 = 48; 400 − 248 = 152; 4,15 frente a 415; 19:15 − 19:07 = 8 minutos (ventanilla de Begoña, biblia). Todo contado dos veces.
- **Longitud:** todas las intervenciones habladas y los Mirar de esta adenda miden ≤ 80 caracteres.

---

## 13. EVENTOS: Pilar Escaleta (encargo de dirección; paquete D, sala propia `eventos`)

La casa tiene departamento de **Eventos**, y es Eventos (no Marketing) quien va con la cámara, el photocall y las
acreditaciones. **Borja Engagement sigue siendo Marketing** y sigue flipado (engagement, «en vertical», «contenido»,
embudos), pero **sin cámara ni acreditaciones**: lleva el móvil en la mano como si fuera un micro. Son de **Eventos**: el
photocall, el ¡FLASH! al entrar en la planta, el aro de luz, las cajas de lanyards, el gong (suena para empezar; Maripaz
lo usa por cada venta y factura) y el **álbum** de la cena de Navidad. **Revisión de dirección (§13.4):** Eventos tiene
**sala propia**, la **Sala Polivalente** (`eventos`), junto al Ecosistema; todo lo de Eventos vive allí con sus mismos ids y
líneas, y el Ecosistema queda para Marketing y Comercial.

### 13.1 Ficha · `pilar_escaleta` — Pilar Escaleta (PNJ con sprite)
- **Departamento / sala:** jefa de Eventos · `eventos` (Sala Polivalente), de pie en la alfombra roja, delante de su photocall. Actos I-III.
- **Aspecto (definido por los objetos, sin rasgos de nadie real):** negro de equipo técnico, **cascos con micro**, **walkie** al cinto, la **escaleta** en una carpeta, **seis acreditaciones** al cuello y un rollo de **cinta americana** en la muñeca. Coleta alta.
- **Color de texto:** `#A8F07A`.
- **Tics:** todo está **«a cinco minutos de empezar»**; **cuenta sillas** (ciento doce... ciento trece); **tres personas juntas ya son un evento** y necesitan acreditación; obsesión con el **catering** (croquetas a las 21:05).
- **Entrada en la Sala Polivalente (onEnter, cada vez; antes, en la planta):** ¡FLASH! del photocall y Pilar acredita al que llega (rota): «¡Acreditado! Empezamos en cinco minutos.» · «¡Foto de entrada hecha! Cinco minutos y empezamos.» · «Uno más. Ya sois tres. Eso es un evento. ¡Acreditación!» · «¡Flash! Para el álbum. Y para el seguro.»

### 13.2 Árbol `pilar` (6-8 opciones)
```
[PE0] (rumor C, paso 3, también aquí: si rumor_teodoro_n = 2 → 3)
      PILAR: Teodoro tiene acreditación vitalicia. Del 97. Plastificada a mano.
      PILAR: Dicen que el edificio lo compró él. Por fax. Con acuse de recibo.
      PILAR: ¿Vienes acreditado? Empezamos en cinco minutos.
  1. «¿Qué evento hay hoy?» (una vez)
     PILAR: Ninguno. Pero siempre estamos a cinco minutos de empezar.
     PILAR: Así nunca llegamos tarde. Ni a lo que no hay.
  2. «¿Para qué es el photocall?»
     PILAR: Lo que no está en el photocall no ha ocurrido.
     PILAR: Lo que está, tampoco. Pero sale mejor iluminado.
  3. «¿Cuántas sillas hay?» (se queda; ecosistema_sillas_n)
     1.ª: PILAR: Ciento doce. ...Ciento doce. ...Ciento trece. ¿Quién ha traído una?
     Siguientes: PILAR: Ciento doce. Las cuento cada cinco minutos. Por si se van.
  4. «¿Por qué hay que acreditarse?» (una vez)
     PILAR: Tres personas juntas ya son un evento. Y un evento sin acreditar es un caos.
     PILAR: Ayer acredité a la cola de la máquina de café. Funcionó.
  5. «¿Hay catering?» (se queda)
     PILAR: Croquetas a las 21:05. Si el cierre se retrasa, se enfrían.
     PILAR: Una croqueta fría es una crisis de reputación.
  6. [ruben_encontrado Y !oyo_descopear] «¿Me prestas el álbum?»   ← P14a
     PILAR: ¿El de la cena de Navidad? Está acreditado. Firma aquí. Y aquí.
     PILAR: Cuídamelo. Sale todo el mundo. Hasta el chico del táper.
     BORJA (desde su sitio): ¡Compártelo! Por cierto: hemos descopeado la ética del Q3.
     BRUNO: Descopear. Me lo apunto.   {+album_eventos, oyo_descopear} → FIN
  7. «¿Qué es esa cinta en la muñeca?» (una vez)
     PILAR: Cinta americana. Con ella acredito, señalizo y arreglo un atril.
     PILAR: Una vez sujeté un evento entero. Con dos tiras.
  8. «Me voy.»
     PILAR: ¡Hasta ahora! Te guardo la silla ciento trece.  → FIN
```
**Mirar:** «Pilar Escaleta, de Eventos. Cascos, walkie, escaleta y seis acreditaciones.» // «En la muñeca, un rollo de cinta americana. Por si hay que acreditar algo.»
**Dar / Usar:** `cafe`: «Café sin catering es un café. Con catering, una pausa. Apuntado.» · `tarjeta_becario`: «"Pellizco". Te la repito bien: "Bruno. Acceso: hasta el canapé".» · `ficha_pagina_7`: «¿Una ficha con tres casillas? ¡Eso es una escaleta! Me encanta.» · `album_eventos`: «Quédatelo hasta que acabes. Lo tengo apuntado: "Bruno, álbum, 19:40".» · Usar `movil`: «¡Sin fotos sin acreditación! ...Bueno, una. Salgo mejor de perfil.» · cualquier otra cosa: «Gracias. Lo acredito y lo pongo en la mesa de bienvenida.» · Empujar: «No. Está contando sillas. Si la empujo, empieza otra vez.» · Coger: «A Pilar no se la coge. Se la avisa con cinco minutos.» · Tirar: «Le tiro del cable de los cascos. Me mira como a un micro que acopla.»
**Murmullos:** «Cinco minutos. Siempre cinco minutos. Es mi zona horaria.» · «Ciento diez, ciento once, ciento doce... ¿Quién se ha sentado?» · «Cinta en el suelo, cinta en el cable, cinta en el alma.» · «Tres en el ascensor. Eso ya es un evento. Sin acreditar.» · «Si no hay croquetas, no es un evento. Es una reunión.» · «Aquí Eventos, cambio. Sí, a cinco minutos. Cambio y corto.»

### 13.3 Cambios en Borja (Marketing) y en la planta
- **Sprite:** fuera la cámara y las nueve acreditaciones; móvil en la mano. **Mirar:** «Borja Engagement, Marketing. Habla al móvil como a un micro. Aunque no grabe.»
- **Árbol de Borja:** entrada «¡Bruno! ¡Justo hablábamos de tu marca personal!» · rumor A3: «¡Me dicen que vas a comprar el periódico! ¡Eso es un lanzamiento!» // «Te hago la campaña: "Sonríe como si tuvieras liquidez".» · rumor D1 sin cambios · opciones: «¿Qué hace Marketing?» → «¡Engagement! Que la gente quiera lo que ya tiene.» // «Pero en vertical. Y con un emoji de fuego.» · «¿Qué evento hay hoy?» → «¡Eso es de Eventos! Yo solo lo cuento. Antes de que pase.» · [ruben_encontrado Y !oyo_descopear] «¿Me prestas el álbum?» → «El álbum es de Eventos. Yo solo lo viralizo.» // «Pídeselo a Pilar. Con acreditación, que se pone tensa.» · «Me voy.» → «¡Salida de escena! ¡Eso es un cierre de embudo!»
- **Respuestas de Borja sin flash:** Coger: «¡Me has cogido del brazo! ¡Eso es una alianza estratégica!» · Empujar: «¡Contacto físico! ¡Eso es engagement orgánico!» · Dar `cafe`: «¡Café en mano! ¡Eso es un post! Quédatelo, que tú conviertes mejor.» · Dar `tarjeta_becario`: «¿"Pellizco"? ¡Eso es un naming! Te lo registro como marca.» · Dar `ficha_pagina_7`: «¿Una ficha? Hazle un carrusel. Si no, no la firma nadie.» · Usar `movil`: «¡Me grabas! ¡Eso es contenido generado por becario!» · Murmullos nuevos: «Hay que hablarle al lector de tú. Y en vertical. Y con un emoji.» · «Tadeo y yo hacemos sinergia. Él reenvía. Yo lo convierto en hilo.» · «Si alguien deja su plaza, el post del pésame lo escribo yo.» · «¡Valentín no necesita filtro! ¡El filtro necesita a Valentín!» · «Si no está en vertical, no ha pasado.»
- **Objetos:** `photocall` (Usar: ¡FLASH! + PILAR: «¡Foto de acreditación! Ya constas en un evento.»; con la tarjeta: PILAR: «"Pellizco", acreditado. Con foto. Acceso: hasta el canapé.»; Coger: «¿Me llevo el photocall? Sin él, Eventos dejaría de existir.») · `cajas_lanyards` (Mirar: «Lanyards de Eventos. Para acreditar dos veces a la ONU.»; Coger: «Si me pongo uno más, Pilar me cuenta como asistente.») · `gong` (Mirar: «El gong de Eventos: suena para empezar. Maripaz lo usa por cada venta.»; Usar: PILAR: «¡Ese gong es de Eventos! ¡Y aún faltan cinco minutos!» // MARIPAZ: «Si suena, cariño, yo facturo. Es el acuerdo.»; Coger: PILAR: «El gong no se mueve. Tiene la marca de cinta en el suelo.») · **`album_eventos_hotspot`** (antes `album_borja_hotspot`): «El álbum de Eventos. En todas las fotos sale al fondo un chico pálido.» // «Siempre yendo al baño. Con un táper. Pilar lo llama "el extra".»; Coger: PILAR: «¡Eh! Ese álbum está acreditado. Pídemelo con un motivo.» (con `ruben_encontrado`: «Mejor se lo pido a Pilar. Lo tiene acreditado. Con foto.»).
- **Objeto de inventario:** `album_eventos` (antes `album_borja`), «álbum de Eventos». Nerea, al cerrar P14b: «El álbum se lo devuelvo yo a Pilar. Con acuse de recibo.»
- **P14a (walkthrough, paso 40):** Hablar `pilar_escaleta` → «¿Me prestas el álbum?» (antes, a Borja; los pasos siguen siendo los mismos), ahora en la Sala Polivalente (§13.6).
- **Carteles:** la planta 2 es «Marketing · Eventos · Comercial · Administración» (escalera de la Pecera, botonera del ascensor; el ascensor llega al Ecosistema y a Eventos se pasa por su puerta); en el organigrama del vestíbulo, un pósit pegado con cinta: «+EVENTOS». **Créditos:** «Eventos — Asignado a: Pilar Escaleta. Empezamos en cinco minutos.» · «Marketing — Asignado a: Borja Engagement (en vertical).»

### 13.4 La Sala Polivalente (`eventos`): sala propia de Eventos (encargo de dirección)
Se entra por la **puerta de Eventos** del Ecosistema (`ecosistema_a_eventos` ↔ `eventos_a_ecosistema`); el ascensor sigue
llegando al Ecosistema. **512×144 con scroll.** Sala oscura de techo técnico, ciruela y terciopelo negro, con una **barra de
focos** (truss) de lado a lado: focos PAR con conos de luz tramados, brillo de lente y dos que **parpadean** (el tres del
photocall y el del atril). De izquierda a derecha: puerta abierta al Ecosistema (luz lila) · **photocall** con truss, pared de
logos y el hueco discontinuo «ESPACIO PREMIUM PARA TU CARA», **alfombra roja**, postes y cordón de terciopelo (Pilar, delante)
· **aro de luz** · **flight cases** · **escenario** (telón negro, pancarta «BIENVENIDOS A» con el nombre tapado con cinta,
**cuenta atrás clavada en 00:05:00**, **gong**, micro de pie, **atril**) con **cuatro filas de sillas** granates en perspectiva
delante (pasillo central; una con el folio **«RESERVADO»**, otra **torcida**, de Comercial, sacando la pata al pasillo) ·
altavoces · **mesa de sonido** «FOH» con el cargador de walkies · cartel luminoso «SALA POLIVALENTE» · **mesa de
acreditaciones** (cajas de lanyards, el álbum, la lista pegada con cinta, roll-up «EN 5 MIN») · **catering**: campana con
croquetas, su propio foco y el cartel «21:05». Cruces de **cinta americana** por el suelo. Música: `m_eventos` (el motivo
principal como fanfarria sobre un redoble que acaba en un acorde de dominante que nunca resuelve).

**Lo que se muda del Ecosistema (ids y líneas intactos):** `pilar_escaleta` y su árbol `pilar`, el ¡FLASH! de entrada,
`photocall`, `aro_luz`, `cajas_lanyards`, `gong`, `album_eventos_hotspot`. Contadores con su nombre de siempre (globales en
`flags.js`): `ecosistema_entradas_n`, `ecosistema_sillas_n`, `ecosistema_gong_n`.

**El Ecosistema, recompuesto (Marketing + Comercial):** donde estaba el photocall, la **puerta de Eventos**; bajo el neón, el
**embudo de Marketing**; donde las cajas, el **roll-up de Comercial**; donde el gong, el **termómetro de ventas**. Borja junto
al embudo. Primera entrada: «La planta 2 a las seis y media: moqueta, pufs y nadie. Y un gong, detrás.» Pufs, Empujar:
«Rueda hacia la puerta de Eventos. Hasta el puf quiere salir en una foto.»

| id (Ecosistema) | Mirar | Otras |
|---|---|---|
| `ecosistema_a_eventos` | «La puerta de Eventos. Por la rendija salen focos, un gong y prisa.» // «Encima, un piloto verde: "PRÓXIMO EVENTO: 5 MIN". No se apaga nunca.» | Ir a / Usar / Abrir: a la sala · Cerrar: «Ya está entornada. Más cerrada, Pilar lo llama "evento privado".» · Empujar: «Empujo. Desde dentro: "¡Faltan cinco minutos!". Empujo con más respeto.» · Hablar: «"¿Se puede?". Contesta un walkie: "Con acreditación. Cambio".» |
| `embudo_marketing` | «Un embudo de Marketing: "VEN · MIRA · COMPARTE · ¿?".» // «El último paso es una interrogación. Es el único honesto.» | Usar: «Me meto en el embudo. Salgo por abajo convertido. En becario.» · Coger: «Borja lo tiene en vertical. Si lo descuelgo, se queda en horizontal y llora.» · Hablar: «"¿Y qué hay al final del embudo?".» // BORJA: «¡No le hables al embudo! ¡El embudo te habla a ti!» · Empujar: «Lo enderezo. Borja lo vuelve a torcer: "Así convierte más".» |
| `rollup_comercial` | «Un roll-up: "SU ANUNCIO AQUÍ". Y la extensión de Maripaz, en grande.» // «Lleva aquí tanto tiempo que ya se anuncia a sí mismo.» | Usar: «Me pongo delante del roll-up.» // MARIPAZ: «Ahora tú eres el anuncio, cariño. Te cobro el metro cuadrado.» · Empujar: «¡Zas! Se enrolla solo.» // MARIPAZ: «Eso, cariño, es una baja de campaña. Te la facturo.» · Coger: MARIPAZ: «El roll-up no se toca, cariño. Está contratado hasta 2030.» · Tirar: «Tiro de la lona. Sube como una persiana con objetivos.» |
| `termometro_ventas` | «Un termómetro pintado a rotulador: "OBJETIVO Q3". Rojo hasta el 97 %.» // «El 3 % que falta se lo lleva el gong de al lado.» | Usar: «Le pinto un poquito más de rojo.» // MARIPAZ: «Eso no es una venta, cariño. Es una ilusión. Y no la facturo.» · Empujar: «Si lo empujo, sube la temperatura. No las ventas.» · Coger: «Es la única cosa de la planta que sube sola. No lo toco.» · Hablar: «"¿Cuándo llegas al cien?".» // MARIPAZ: «El día que pagues tú, cariño.» |

### 13.5 Gags nuevos de la Sala Polivalente (se añaden; los de §13.1-13.3 no cambian)
**Entrada (una vez):** «La Sala Polivalente. Vale para todo.» // «Sobre todo, para estar a punto de empezar.»

| id | Mirar | Otras |
|---|---|---|
| `eventos_a_ecosistema` | «La puerta a Marketing y Comercial. Por ahí entra la luz lila y sale el gong.» | Abrir: «Está abierta. Pilar la deja así: "para que fluya el público".» · Cerrar: PILAR: «¡No! Una puerta cerrada es un evento privado. Y no hay presupuesto.» · Empujar: «La empujo. Pilar me acredita al salir. Y al volver, por si acaso.» · Hablar: «"¿Hay alguien?". Desde Comercial: "Depende de lo que pagues, cariño".» |
| `focos` | «Una barra de focos. Dos parpadean. Pilar dice que es "ambiente".» // «El tercero parpadea desde la cena de Navidad. Ya es de la plantilla.» | Usar: «No llego. Los focos solo los toca Pilar. Con escalera acreditada.» · Coger: «Si me llevo un foco, la Redacción me verá por fin. No estoy preparado.» · Tirar: «Tiro de un cable. Parpadean todos a la vez.» // PILAR: «¡Eso! ¡Eso es ambiente!» · Hablar: «Le pido al foco que deje de parpadear. Parpadea dos veces: es un no.» |
| `cuenta_atras` | **Running gag por actos.** I (1.ª): «Una cuenta atrás: 00:05:00. No se mueve.» // «Todos los relojes de la casa marcan las 20:59. Este, cinco minutos.» · I (siguientes): «Sigue en 00:05:00. Pilar dice que así nadie llega tarde. Funciona: nadie llega.» · II: «00:05:00. Juraría que he visto un 04:59.» // «Pilar le ha dado un golpe con la escaleta. Ha vuelto a 05:00.» · III: «00:05:00. Mientras el edificio arde, aquí siempre faltan cinco minutos.» // «Es lo más estable de la casa. El CLS de Tadeo lo envidia.» · **Remate en los créditos** (abajo). | Usar: «Busco el botón de empezar. Solo hay uno, y pone "+5 MIN".» · Coger / Tirar: «Está pegada con cinta americana. A la pared y al tiempo.» · Hablar: «"¿Cuánto falta?".» // PILAR: «¡Cinco minutos! ...Perdona, creía que me hablabas a mí.» · Usar `movil`: «Le hago una foto. En el móvil también pone 00:05:00. Se contagia.» |
| `pancarta_evento` | «Una pancarta: "BIENVENIDOS A". El nombre, tapado con cinta americana.» // «Debajo de la cinta, otra cinta. Es cinta hasta el fondo.» | Tirar / Usar: «Despego una esquina. Debajo pone "POR CONFIRMAR". La vuelvo a pegar.» · Coger: «La pancarta se queda. Es lo único confirmado del evento: "BIENVENIDOS".» · Hablar: «"Bienvenidos a...". Ni la pancarta lo sabe. Pero lo dice con ilusión.» |
| `atril` | «Un atril con micro. Encima, el discurso: "Buenas noches y bienvenidos a...".» // «Ahí se acaba. Lleva así desde 2019, esperando un sustantivo.» | Usar: «"Buenas noches y bienvenidos a...".» // PILAR: «¡Aún no! ¡Faltan cinco minutos! ...Pero muy bien proyectado.» · Hablar: «"Sí, sí, probando". El micro me devuelve un eco.» // PILAR: «¡Probando, cambio! Se te oye en Comercial.» · Coger: «Si me llevo el atril, empiezo yo el evento. Y no sé de qué va.» · Empujar: «No. Tiene su cruz de cinta. Y Pilar tiene memoria fotográfica de cruces.» · Usar `ficha_pagina_7`: «Leo la ficha desde el atril: tres casillas. Ovación de ciento doce sillas.» · Usar `libreta_replicas`: «Ensayo réplicas en el atril. El eco me las devuelve mejoradas.» |
| `sillas_evento` | **Running gag 112 → 113.** I: «Filas de sillas, cada una en su cruz de cinta. Cuento cincuenta y seis.» // «Pilar dice que son ciento doce. Las otras están "en el plano".» · II: «Las sillas. Una sobresale por la derecha.» // «Pilar la mira de reojo cada cinco minutos.» · III: «Ciento doce sillas para un evento sin tema. La ocupación media es Pilar.» · Con la silla devuelta: «Todas en su cruz. Ciento doce, según el plano.» // «Pilar respira en mayúsculas.» | Usar: «Me siento un momento en la última fila.» // PILAR: «¡Público! ¡Ya tenemos uno! Cuatro minutos y medio.» // «Me levanto. Vuelven a ser cinco.» · Coger: «Si me llevo una, Pilar tendrá que contar hacia atrás. Y eso es el reloj.» · Empujar: «No. Cada silla está en su cruz. Si muevo una, Pilar lo nota en el walkie.» · Hablar: «"¿Hay alguien?". Ciento doce sillas en silencio. El mejor público de la casa.» · Dar cualquier cosa: «Si dejo algo en una silla, Pilar lo acredita como asistente.» |
| `silla_reservado` | «Un folio en una silla: "RESERVADO". Debajo, más pequeño: "Ponente".» // «"Por confirmar". La silla lleva años confirmando que no viene nadie.» | Usar: «No me siento. Si me siento, me toca hablar. Y no sé de qué va.» · Coger: PILAR: «¡Esa no! Es la del ponente. El día que venga, que la encuentre.» · Hablar: «Le pregunto al ponente si viene. El folio ni se mueve. Eso es un "ya veremos".» · Usar `chaqueta_ramirez`: «La chaqueta de Ramírez reserva sillas sola. Pero esta ya está pillada.» |
| `silla_torcida` | 1.ª: «Una silla torcida, fuera de su cruz de cinta. Saca una pata al pasillo.» // «Debajo del asiento, una pegatina: "PROPIEDAD DE COMERCIAL. NO TOCAR, CARIÑO".» (+ con la crisis: «La silla ciento trece. Tiene dueña.») · Siguientes: «La silla de Comercial. Maripaz se la trajo para oír el gong sentada.» | **Micro-puzle opcional (§13.5b).** Usar / Empujar sin haberla mirado: «La pongo recta en su cruz.» // PILAR: «Ciento doce... ciento trece. ¡No es la postura, es la silla!» · Coger sin mirarla: «Antes miro de quién es. Aquí todo tiene dueño. Y acreditación.» · Hablar: «"¿De quién eres?". La silla no contesta. Tiene contrato de confidencialidad.» |
| `mesa_sonido` | «La mesa de sonido. Doce faders y un pósit: "NO TOCAR. YA ESTÁ A 5 MIN".» // «Al lado, el cargador. Cuatro walkies cargando. Uno dice "cambio" solo.» | Usar: «Subo un fader. Suena una freidora. Es el canal del catering.» · Tirar: «Tiro de un cable. Se apaga el foco tres. Lo enchufo: sigue parpadeando.» · Hablar: «Cojo un walkie: "¿Hola?".» // WALKIE: «Cinco minutos. Cambio.» · Abrir: «Abro la tapa del cargador. Pilas de 2009 y un caramelo. Cierro.» · Coger: «Cojo un walkie. Pilar me lo quita sin mirar. Tiene seis acreditaciones.» · Usar `movil`: «Conecto el móvil. Suena mi tono a todo volumen. Lo oyen ciento doce sillas.» |
| `mesa_acreditaciones` | **Running gag: acreditados cada vez más absurdos** (lista pegada con cinta; lo nuevo de cada acto sale primero, luego rota). 1.ª vez: «La mesa de acreditaciones. Hay una lista pegada con cinta.» · I: «"Cola de la máquina de café: doce personas y una máquina".» · «"El ascensor. Tres veces. Con acompañante: el hilo musical".» · «"Gertrudis, máquina de café. Acceso total. Ya lo tenía".» · II: «"La impresora de la tercera. Con su bandeja 2". La bandeja no consta.» · «"Piel de plátano, plaza 7. Asistencia: por confirmar".» · III: «"Titulator 3000: DENEGADA. Motivo: trae su propio atún".» · «"El chico del táper. Acreditado desde 2021. Sale en todas las fotos".» // «Al final, a boli: "Bruno. Acceso: hasta el canapé". Subrayado.» | Usar: «Me pongo detrás de la mesa, a acreditar.» // PILAR: «¡Fuera de mi mesa! Acreditar es un oficio. Tiene escaleta.» · Coger: «La mesa es de Eventos. Lo pone el mantel. Lo pone todo.» · Empujar: «No se mueve. Está pegada al suelo con cinta. Es su marca.» · Usar `tarjeta_becario`: «Dejo mi tarjeta en la mesa.» // PILAR: «"Pellizco", otra vez. Te hago la segunda. Por si pierdes la primera.» |
| `catering_croquetas` | «Una campana de catering con un cartel: "21:05". Debajo, croquetas.» // «Tienen su propio foco. Son las únicas que están listas.» · Tras la croqueta: «Falta una croqueta. Pilar ha tapado el hueco con cinta americana.» // «Ahí no ha pasado nada.» | Abrir: PILAR: «¡Ni se te ocurra! A las 21:05. Ni un minuto antes. Ni cinco.» · Coger: PILAR: «Las croquetas están acreditadas para las 21:05. Tú, para el canapé.» · Usar: PILAR: «¡Las 21:05! ¡Lo pone el cartel! ¡Y la escaleta! ¡Y mi alma!» · Hablar: «Les susurro a las croquetas: "¿Falta mucho?". No contestan. Están en su papel.» · Usar `cafe`: «Dejo el café junto a la campana.» // PILAR: «Café junto al catering. Eso ya es una pausa. ¡Apuntado!» |
| `flight_cases` | «Flight cases de Eventos. Uno pone "FRÁGIL". Otro, "5 MIN".» // «Encima, un rollo de cinta. El de repuesto del de repuesto.» | Abrir: «Dentro: cinta americana, cinta americana y un rollo de cinta de emergencia.» · Empujar: «Ruedan un palmo. Pilar los mira. Vuelven solos a su marca de cinta.» · Coger: «Pesa como un evento entero. Que es justo lo que lleva dentro.» · Usar: «Me subo a uno para ver el escenario. Desde arriba también faltan cinco minutos.» |
| `marcas_cinta` | «Cruces de cinta en el suelo. Una por silla, por atril y por persona.» // «Hay una con mi nombre. Pilar me ha marcado antes de que llegara.» | Usar: «Me pongo en mi marca. Por fin sé dónde tengo que estar.» · Coger: «Despego una esquina. Pilar lo nota desde el photocall. La vuelvo a pegar.» · Tirar: «Tiro de la cinta. Debajo sale otra. Esto es arqueología de eventos.» · Hablar: «Le pregunto a mi cruz si me quedo. Las cruces no prometen nada.» |
| `photocall` (nuevo) | — | Usar `album_eventos`: «Pongo el álbum en el hueco. Al fondo de la foto, el chico del táper.» // ¡FLASH! // PILAR: «Una foto de un álbum de fotos. Eso ya es un archivo. ¡Acreditado!» |

**Opciones nuevas del árbol `pilar`** (antes de «Me voy.»; las 8 de §13.2 siguen igual y en su orden):
```
  9. «¿Y de qué va el evento?» (se queda; eventos_tema_n; escala)
     1.ª: PILAR: Es un encuentro. Con ponente, photocall y croquetas.
          PILAR: El tema lo trae el ponente. El ponente, por confirmar.
     2.ª: PILAR: Es una jornada de... de... Mira, estamos a cinco minutos.
          PILAR: No me líes, que pierdo la cuenta.
     3.ª+: PILAR: Va de empezar. Cuando empiece, ya sabremos de qué iba.
 10. [ecosistema_sillas_n ≥ 1 Y !eventos_silla_devuelta] «¿Estás bien, Pilar?» (la crisis de la silla 113)
     PILAR: Ciento trece, Bruno. Una silla de más es un asistente que no existe.
     PILAR: ¿Y si se sienta? ¿A quién acredito? ¿Al vacío?
     PILAR: Esa silla ha venido de fuera. Tiene que tener dueño.
 11. «¿Por qué no baja la cuenta atrás?» (una vez)
     PILAR: La puse a cinco minutos el día que entré. Y ahí la dejé.
     PILAR: Si baja, hay que empezar. Y eso ya es otro presupuesto.
 12. «¿Puedes acreditar a mi abuela?» (una vez)
     PILAR: ¿Por teléfono? Tú, ella y la compañía: tres. ¡Evento!
     PILAR: Acreditada: «Abuela de Bruno. Acceso: todo. Que se abrigue».
 13. [eventos_croqueta] «Gracias por la croqueta.» (una vez)
     PILAR: No me las des. Te he apuntado como catering.
     PILAR: Y si alguien pregunta, a las 21:05 estaban todas.
```
**Murmullos nuevos de Pilar:** «Foco tres, me parpadeas. No, cambio, foco tres. Tú.» · «Ponente: por confirmar. Croquetas: confirmadísimas.» · «Si alguien dice "empezamos ya", que me lo pase por escrito.» · con la crisis de la 113: «Ciento trece. Que alguien me diga que es una errata.» · «Una silla de más. Un asistente fantasma. Sin acreditar.» · resuelta: «Ciento doce. Qué paz. Hasta el walkie suena más bajito.» **Murmullos de los walkies** (`mesa_sonido`): «WALKIE: Catering a Eventos: croquetas en posición. Cambio.» · «WALKIE: ¿Empezamos? ...Cambio. No. Cambio.» · «WALKIE: Foco tres, deja de parpadear. Cambio. Foco tres no contesta.»

**13.5b · Micro-puzle opcional «La silla ciento trece»** (no toca el grafo principal; flags `eventos_silla_devuelta`, `eventos_croqueta`):
Pilar cuenta 113 (opción «¿Cuántas sillas hay?») y entra en crisis («¿Estás bien, Pilar?»: «Esa silla ha venido de fuera. Tiene que
tener dueño.»). Mirar `silla_torcida` descubre la pegatina de Comercial (Maripaz se la trajo para oír el gong sentada). Usar /
Coger / Empujar la silla, sabiendo de quién es: BRUNO: «Es de Comercial. Se la devuelvo a Maripaz, que es de donde ha venido.» //
(ruido de sillas) // PILAR: «Ciento diez, ciento once... ciento doce.» // «¡CIENTO DOCE! ¡Vuelvo a ser persona!» // «Bruno, eso
merece algo. Toma: una croqueta antes de las 21:05.» // BRUNO: «Está fría.» // PILAR: «Es una crisis de reputación. Pero es
nuestra.» Al volver al Ecosistema, una vez: MARIPAZ: «Me has devuelto la silla, cariño. Te la facturo como mudanza.»

**Remate en los créditos (el evento por fin empieza):** tras «Ninguna rotativa fue apagada...»: «Sala Polivalente — Cuenta atrás:
00:04:59. Por fin empezamos.» · «Era la presentación de una fe de erratas.» · «La primera de la historia con photocall.»

### 13.6 Puesta en escena entre las dos salas (P14a y el gong)
- **P14a (álbum):** se pide a Pilar en la Sala Polivalente (paso 40). Al prestarlo, **Borja, que lo ha oído desde Marketing, se
  asoma por la puerta** (entra un paso, habla en su sitio y en su color) con su línea de siempre: «¡Compártelo! Por cierto: hemos
  descopeado la ética del Q3.» // BRUNO: «Descopear. Me lo apunto.» // PILAR (nuevo): «¡Borja! Sin acreditación, de la puerta no se
  pasa.» // BORJA (nuevo): «¡Me voy! Pero esto lo cuento. En vertical.» Y vuelve a su sitio del Ecosistema. **Pista justa:** Borja,
  en el Ecosistema, «¿Me prestas el álbum?» → «Pídeselo a Pilar. Con acreditación, que se pone tensa.»; la puerta de Eventos está a
  dos pasos; y la abuela (pista de `ruben_libre`, sin `oyo_descopear`) añade: «Las fotos de las fiestas las guarda la que las
  organiza. Pídeselas.»
- **El gong** es de Eventos y está en el escenario. Maripaz no está en la sala, pero el dinero tiene buen oído: su línea llega
  desde Comercial, arriba, sin globo sobre nadie («Si suena, cariño, yo facturo. Es el acuerdo.») y Bruno añade (nuevo): «Lo ha
  oído desde Comercial. El dinero tiene muy buen oído.» Maripaz sigue llevando el mazo «como otros el bolso».

---

## 14. El ascensor con botonera y la geografía del vestíbulo (encargo de dirección; común, `content/lib/ascensor.js`)

### 14.1 El vestíbulo: el ascensor está DETRÁS del torno
Se lee de izquierda a derecha: **zona de entrada** (puertas de la calle, organigrama, cuadro de llaves, ficus y el
**mostrador de seguridad** de Celestino, pegado a los tornos) → **línea de tornos** en diagonal, del fondo al borde de la
pantalla (tres bancadas de acero con alas de cristal; el carril de atrás es el de Bruno, el de delante está FUERA DE
SERVICIO; cartel colgado «REDACCIÓN → / ASCENSOR →») → **vestíbulo interior** (pared de nogal con el logo de letras
metálicas, moqueta roja, el **ascensor** y la **escalera a la Redacción**, hotspot nuevo `vestibulo_a_redaccion`).
Físico, no solo dicho: el suelo son dos zonas separadas (`entrada`, `interior`) que solo une el carril del torno
(walkbox `paso_torno`, condicional: `when: 'torno_abierto'`). Antes de abrir el torno, Bruno no puede andar al
interior; al abrirlo, las alas se recogen, el piloto pasa a verde y el carril queda abierto. Cruzar el torno abierto
(Ir a / Usar) = cruzar el carril y subir la escalera a la Pecera, como antes. Mirar `vestibulo_a_redaccion`: «La escalera
a la Redacción. Al otro lado de los tornos. A seis años y un torno.» (con el torno abierto: «Moqueta roja: aquí ya se
nota que constas.») · Ir sin torno: «La escalera está al otro lado del torno. Y el torno, de su lado.» · Hablar: «"¿Hay
alguien arriba?". Contesta un teclado. Eso es que sí.» · Empujar: «Una escalera no se empuja. Se sube. Si te deja el
torno.» · Mirar el ascensor sin torno: «El ascensor. Detrás de los tornos, con su moqueta y su logo.» // «Desde aquí se
ve. Como la plantilla fija.»

### 14.2 La botonera
Plantas: **-1** Sistemas y CPD (`cpd`) · **0** Vestíbulo · **1** Redacción (`pecera`) · **2** Marketing · Eventos ·
Comercial · Administración (`ecosistema`; la Sala Polivalente de Eventos, `eventos`, está tras la puerta del Ecosistema). Hay ascensor en las cuatro salas (`ascensor_vestibulo`, `ascensor_cpd`,
`ascensor_pecera`, `ascensor_ecosistema`). Ir a / Usar / Abrir el ascensor abre el menú de plantas (la actual, en gris
con «(aquí)»; última opción «Nada, me quedo en esta planta.»). Viaje: puertas, cabina con el indicador contando
plantas, una frase del ascensor (rota en orden, `ascensor_viajes_n`) y llegada por la puerta del ascensor de la otra
planta: corre el `onEnter` de la sala (escena 7.2 si es la primera vez en la Pecera, ¡FLASH! de la planta 2, ticket del
CPD) y los avisos comunes. Las rutas de siempre (torno, escalera) siguen.
**Bloqueos (las mismas condiciones que la ruta antigua a cada sala):** -1, 1 y 2 piden `torno_abierto`; 0 siempre.
Negativas (solo se oyen con el torno cerrado): «Planta -1: solo personal de Sistemas. Abra un ticket desde el torno.» ·
«Planta 1: usuario no consta en organigrama. Pruebe a constar.» · «Planta 2: se requiere acreditación. Pilar tiene
seis. Usted, ninguna.»
**Frases del ascensor:** «Su planta ha quedado registrada con el ticket 48.216. Paco le atenderá.» · «Ascensor
rediseñado por Diseño y Producto. Si no lo nota, está bien hecho.» · «Le recordamos que lo que se dice en el ascensor no
sale. Ni el wifi.» · «Hilo musical: el Ibex en diferido. Narra Celestino, desde el mostrador.» · «Capacidad: ocho
personas o una reunión que pudo ser un correo.» · «Prohibido hablar de plazas de garaje. La rejilla del sótano lo oye
todo.» · «RV de Tadeo: "La IA dice que subir es lo contrario de bajar. Por si os sirve!!".» · «Este ascensor no consta en
el organigrama. Funciona igual. O por eso.» · «Optimal Brains propone sustituirme por una escalera. Más escalable.» · «Si
al abrir oye un gong, alguien ha vendido algo. No se asuste.»
**Textos de los ascensores nuevos:** Pecera (13.3/3.3). Planta 2: Mirar: «El ascensor. Marketing le ha puesto pufs
delante.» // «Para que la gente no se vaya. Que se "ubique".» · Cerrar: «Se cierra solo. Es lo único de la planta que no
pide feedback.» · Empujar: «No se empuja. Se activa. Lo dice el vinilo.» · Tirar: «Tiro de la puerta. Borja lo cuenta en
vertical: "Bruno abriendo caminos".» · Hablar: «"¿Bajas?". Hace "tin". Maripaz me lo factura como conversación.»

---

## 15. Legibilidad y móvil (encargo de dirección)
- **Texto hablado:** contorno negro de 8 vecinos + banda oscura translúcida bajo cada línea (`SPEECH_BACKING`, 80 %).
  Colores aclarados para que se lean sobre la planta 2 lila y la Administración verde: Aurora `#FF8A7A`, Begoña
  `#C0A2F6`, Anselmo `#E496FF`, Custodia `#A0A0FF`, Evaristo `#F0F0A8`, Gervasio `#AEC6E6`, Paco `#92C0FF`, Maripaz
  `#FF8A60`, Leoncio `#3CE0C6`, Yoli `#FF78B8`, Valentín `#C0E8FF`, Herminia `#FF8C3C` (antes igual que Leoncio), Lector
  Medio `#E8C8A8` (antes se confundía con Gervasio), LED del torno `#FF7E6A`. Comprobación: `node tools/contrast.mjs`.
- **Móvil:** web app instalable (iPhone: Compartir → Añadir a pantalla de inicio), opción «Pantalla completa» en el
  título y en el menú (tecla F en escritorio); en el Safari del iPhone explica cómo instalarla.

---

## 16. «La Reunión de Dirección» (encargo de dirección: el órgano de la casa se llama así en todo el juego)
El órgano que aprueba el Plan Cero Papel a las 21:00 es la **Reunión de Dirección** («Dirección» es solo el nombre de una
planta y de un comité: no hay director del periódico). El objeto es `acta_reunion` («acta de la reunión»: «1. Pedir más
café. 2. Ninguno más»), el asunto del duelo D3 «RE: Redactar el acta de la última Reunión de Dirección», el remate B de
Íñigo «Esto ya lo ha decidido la Reunión de Dirección.» y la segunda fuente de la opa es **una comida de trabajo de
Gervasio con Hidrovoltia**: BEGOÑA: «Esto. Esto es una nota de gasto. Como Dios manda.» // «"Comida de trabajo con
Hidrovoltia. 312,00 euros. Firmado: Gervasio."» // BRUNO: «¿Gervasio come con Hidrovoltia?» // BEGOÑA: «Gervasio come
con quien haga falta. Y lo justifica. Es su gran talento.»

