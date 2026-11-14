# FE DE ERRATAS — ENMIENDA E3 (fórmulas de remate y segundo registro de Maripaz) · revisión 2

> **Revisión 2** (contra-guion, lista para implementar). Prevalece sobre `PLAN_COMEDIA.md`, E1 y E2 **solo** en lo que
> toca aquí: las líneas que lista, los topes nuevos de `tools/plan-rules.mjs` y la voz de Maripaz Remitido (que gana un
> segundo registro acotado sin perder el eje de E2 §4). Responde a la crítica 3 (§3.1 «Molde dominante», §5.2, §5.3;
> cambios n.º 5 y n.º 6). La revisión 1 era un documento para discutir; esta aplica las decisiones del director (Eventos
> fuera de los topes, margen en cada tope, final intocable) y la discusión del segundo guionista, que está en §7.

**Cómo leer las tablas.** La clave es el **texto literal**: quien implemente, que busque la cadena, no la línea (otro
agente edita `content/` a la vez). Todas las cadenas «actuales» de §3.2 y §4.3 se han vuelto a comprobar por script
contra `content/` en esta revisión (todas casan) y todas las «nuevas» pasan ≤ 80 caracteres, sin remate «Como…», sin
«(*», sin «Diseño», sin «desde [fecha]», sin palabras vetadas y sin volver a caer en ninguna fórmula (comprobado
aplicando la tabla entera a una copia de `content/` y pasando las expresiones de §2 y el auditor de `plan-rules.mjs`
con `esTexto()` corregido). Texto nuevo **ELIMINAR** = se borra la cadena (el verbo cae en `DEFAULTS`).

**Qué no se toca.** **Eventos** (`eventos.js`, `eventos.dialogos.js`) **y Pilar: ninguna línea se reescribe y ninguna
cuenta en los topes nuevos** (van con `fuera`, como «cariño»). El final (de «Abrígate tú.» a los créditos) y el epílogo
de Maripaz: intactos. Ningún flag, id, solución de puzle, mazo, ataque, réplica ni remate de duelo cambia. Diseño e
Infografía no coinciden en ninguna línea nueva; Desarrollo, igual de velado; el director del periódico no aparece.

## Índice

- §1 Inventarios (las tres fórmulas de la crítica, la cuarta que no vio, «factur…» y un fallo del auditor)
- §2 Topes y expresiones regulares para `tools/plan-rules.mjs` (recalculados sin Eventos, con margen)
- §3 Reescrituras de fórmulas (tabla para implementar), formas usadas y las que se quedan
- §4 Maripaz Remitido: segundo registro acotado, tabla y dos momentos (M2 rehecho)
- §5 Saldo de líneas, ficheros afectados y pruebas que citan texto
- §6 Dudas de la revisión 1, cerradas
- §7 Acta de la contra

---

## 1. Inventarios

### 1.1 Método

Recuento sobre **cadenas literales** de `content/` (sin `art/`, `flags.js` ni `_plantilla.js`), con el mismo
tokenizador que usa `tools/plan-rules.mjs` (`literales()`), pero **con `esTexto()` corregido** (§1.5). Cada aparición
cuenta, también en ramas raras; una misma cadena en dos claves cuenta dos veces. Comentarios fuera. **Eventos fuera**
(decisión del director): las cifras «sin Eventos» son las que cuentan para los topes.

### 1.2 Resumen

| Fórmula | Crítica 3 | Hoy, todo `content/` | Hoy, sin Eventos | Tope r2 | Tras E3 r2 (sin Eventos) | Margen |
|---|---|---|---|---|---|---|
| «lo único / la única / el único / su única…» | ~36 | 59 | **57** | 8 | **6** | 2 |
| «X no se coge/toca/empuja… Se Y.» | ~21 | 36 | **35** | 6 | **5** | 1 |
| «primera vez» | ~12 | 13 | **13** | 5 | **4** | 1 |
| «Mi primer/a [documento, acta, firma…]» | — | 6 | **6** | 6 | **5** | 1 |
| **Cuarta fórmula: «No es X. Es Y.»** | no la ve | 25 | **23** | 12 | **10** | 2 |
| «factur…» | 28 | 33 | **31** | 11 | **9** | 2 |
| (informativo) «Tiene más [X] que yo» | ~10 | 7 | 7 | — | 7 | — |
| (informativo) superlativo «lo más… de la casa / planta / edificio» | — | 25 (18 con «único») | — | — | 6 | — |

**Por qué los recuentos de la crítica se quedan cortos.** «Lo único» tiene muchas formas (la única, el único, su
única, los dos únicos, ERES EL ÚNICO); «no se X. Se Y.» se esconde con dos puntos, punto y coma, coma o clíticos; y el
auditor del repositorio no ve las cadenas sin tildes ni eñes (§1.5), que son muchas de estas.

**La cuarta fórmula.** «No es X. Es Y.» es la misma máquina que «no se X. Se Y.»: negar la palabra normal y poner la
rara. Hay buenas («Eso no es una pregunta, criatura. Es una sentencia.»; «Entonces no es una IA. Es un hobby.»), y por
eso el tope no es cero. El superlativo de lugar («la conversación más clara de la planta») cae solo al podar «lo
único»; sin tope propio, vigilado.

### 1.3 Inventario detallado (fichero:línea, texto literal, decisión)

«Decisión» remite al identificador de la reescritura (§3.2, §4.3) o dice «se queda» (porqué en §3.3). Las líneas de
Eventos se han quitado del inventario: no se tocan ni cuentan. Números de línea: foto del día de la revisión 1; manda
el texto.

#### lo único — 57 (sin Eventos)

| Fichero:línea | Texto literal | Decisión |
|---|---|---|
| `actors.js:212` | Respondo a todos. Es lo único que sé hacer bien. | U1 |
| `actors.js:227` | Chof, chof... Menta. Lo único de esta casa que no caduca. | U2 |
| `escenas/climax.js:86` | Es la única que hay. Las demás no las escribí. | U3 |
| `escenas/climax.js:227` | Sin Lector Medio no hay plan. Era mi único dato. | U4 |
| `game.js:22` | Ya está cerrado. Aquí lo único que no cierra a tiempo es la edición. | U5 |
| `pistas.js:29` | Respondo a todos. Es lo único que sé hacer bien. | U1 |
| `rooms/administracion.js:139` | Carpetas: «CONTRATOS (LEÍDOS)». La única estantería sincera de la casa. | U6 |
| `rooms/administracion.js:192` | ...Es broma. Es lo único que sé hacer de broma. | se queda |
| `rooms/catacumba.js:288` | Son cuarenta y ocho euros. Y su corbata, lo único bien puntuado de la casa. | se queda |
| `rooms/catacumba.js:474` | La máquina de Leoncio respeta el cuerpo 9. Es la única. | U7 |
| `rooms/catacumba.js:672` | No. Es la única boca de Teodoro. Y muerde. | U8 |
| `rooms/catacumba.js:699` | No. Llevan cuarenta años colgadas. Es la única antigüedad que se respeta. | U9 |
| `rooms/catacumba.js:730` | Ese libro no se mueve. Es lo único que sostiene esta mesa. | U10 |
| `rooms/catacumba.js:763` | Si la saco, se cae la mesa. Es su única función con futuro. | U11 |
| `rooms/cpd.js:75` | Te he titulado toda la noche. Perdona. Eras lo único que pasaba. | se queda |
| `rooms/cpd.js:180` | Lo único de esta casa que contesta a todos sin cabrearse... | se queda |
| `rooms/cpd.js:315` | El ascensor. Sube. Es lo único que sube aquí sin abrir ticket. | U12 |
| `rooms/cpd.js:395` | Es la única brisa de Sistemas. Los servidores me odiarían en mi bemol. | U13 |
| `rooms/cpd.js:428` | Ya está cerrado. Es lo único cerrado de todo el registro. | U14 |
| `rooms/ecosistema.js:220` | Se cierra solo. Es lo único de la planta que no pide feedback. | U15 |
| `rooms/ecosistema.js:240` | El último paso es una interrogación. Es el único honesto. | U16 |
| `rooms/ecosistema.js:266` | Es la única cosa de la planta que sube sola. No lo toco. | U17 |
| `rooms/ecosistema.js:272` | No me llevo la pizarra. Es lo único que Marketing tiene por escrito. | U18 |
| `rooms/ecosistema.js:284` | Tiro. Suspira. Es el único de la planta que se queja con razón. | U19 |
| `rooms/office.js:223` | Más abierto no puede estar. Es un arco: lo único de esta planta sin cerradura. | U20 |
| `rooms/office.js:225` | Empujo el aire del arco. Cede. Es lo único que cede en esta planta. | U21 |
| `rooms/office.js:239` | El yogur de Ramírez no se toca. Es lo único suyo que sigue fresco. | U22 |
| `rooms/office.js:241` | Mi táper se queda conmigo. Es lo único que tengo a mi cargo. | U23 |
| `rooms/office.js:264` | Hay cola. Colarse en el microondas es lo único que aquí es despido procedente. | U24 |
| `rooms/office.js:287` | Si me la llevo, Rubén pierde su única firma. Y no sé quién es. | U25 |
| `rooms/office.js:292` | Lo releo. Sigue a 1,20 €. Es la única cifra estable de la casa. | U26 |
| `rooms/office.js:299` | Ya está limpio. Es el único táper limpio del edificio. No lo estropeo. | U27 |
| `rooms/office.js:345` | No pienso pegar a una cafetera. Es la única que trabaja de noche. | U28 |
| `rooms/office.js:346` | No pienso pegar a una cafetera. Es la única que trabaja de noche. | U28 |
| `rooms/office.js:395` | LO SÉ. ERES EL ÚNICO. NO SE LO DIGAS A NADIE. | se queda |
| `rooms/pajarera.js:317` | ¿El informe en blanco? Es lo único validado de esta planta. Se queda. | U29 |
| `rooms/pajarera.js:327` | Es el único mueble de los Despachos sin pósit. No pienso estropearlo. | U30 |
| `rooms/pajarera.js:387` | No. Es la única autoridad de esta planta. Si se cae, se cae todo. | U31 |
| `rooms/pajarera.js:389` | No puedo llevármelo. Es el único lector que nunca se da de baja. | U32 |
| `rooms/pajarera.js:476` | Cero. Diecinueve años en cero. Es mi único dato bueno. | U33 |
| `rooms/pecera.dialogos.js:232` | El tablero va conectado al registro de Paco. Lo único integrado de la casa. | U34 |
| `rooms/pecera.js:161` | No se mueve. Es lo único de esta planta que está donde dice que está. | U35 |
| `rooms/pecera.js:185` | Los dos únicos que quedan. Están de guardia. Lo demás son chaquetas. | U36 |
| `rooms/pecera.js:211` | Está atornillada a la pared. Es lo único fijo de esta planta. | U37 |
| `rooms/pecera.js:320` | La única silla libre. Tiene una chaqueta: Ramírez, el de Bolsa. | U38 |
| `rooms/pecera.js:394` | No. Es lo único que les mide sin que se enfaden. | U39 |
| `rooms/pecera.js:411` | Déjala. Es lo único ordenado del rincón. Y no es nuestro. | U40 |
| `rooms/pecera.js:434` | ¡Quieto! Es lo único de fuera que dejo entrar. Por los tacos. | U41 |
| `rooms/pecera.js:517` | No. Está mirando a Herminia trabajar. Es lo único que hace. | U42 |
| `rooms/pecera.secretaria.js:87` | Esto es de Aurora. Es la única que los acaba. Ha muerto trabajando. | se queda |
| `rooms/pecera.secretaria.js:120` | No existe. Por eso es la única bandeja que no se atasca. | U43 |
| `rooms/sala_amazonas.js:280` | Apagada. Solo el piloto rojo, en reposo. Lo único que descansa aquí. | U44 |
| `rooms/sala_amazonas.js:372` | Se lo enseño. Asiente. Asiente a todo: es su único dato. | U45 |
| `rooms/vestibulo.js:347` | Está atornillado. Es lo único de esta casa que tiene estabilidad. | U46 |
| `rooms/vestibulo.js:361` | Se cierra solo. Es lo único automático del edificio. Bueno, y Gertrudis. | U47 |
| `rooms/vestibulo.js:392` | No. Es la única que ha sobrevivido a todos los ERE. | U48 |
| `rooms/vestibulo.js:428` | Es la única rama del organigrama que está recta. La dejo. | U49 |

#### no se X. Se Y. — 35 (sin Eventos)

| Fichero:línea | Texto literal | Decisión |
|---|---|---|
| `duelo.js:87` | LOS MUERTOS NO SE FAXEAN. SE ENTIERRAN EN CUERPO 9. | N1 |
| `rooms/administracion.js:64` | El pasillo no se empuja. Se recorre. Con número de turno. | N2 |
| `rooms/administracion.js:93` | Eso es patrimonio. Esas notas no se tocan: se rechazan. | N3 |
| `rooms/administracion.js:108` | La ventanilla no se abre. Se atiende por el agujerito, como manda la norma. | N4 |
| `rooms/administracion.js:134` | A don Evaristo no se le empuja. Se le espera. | N5 |
| `rooms/administracion.js:147` | Una coma no se usa. Se pone en su sitio. Y ella ya está. | N6 |
| `rooms/administracion.js:180` | Aquí no se hacen fotos. Se hacen fotocopias. | N7 |
| `rooms/administracion.js:181` | A Begoña no se la empuja. Se la tramita. | N8 |
| `rooms/administracion.js:202` | A don Evaristo no se le empuja. Se le espera. | N5 |
| `rooms/catacumba.js:276` | Lo pienso. Un fax mal marcado no se borra. Se archiva. | N9 |
| `rooms/catacumba.js:385` | La nota te la devuelvo; las fuentes no se quedan, se citan. | N10 |
| `rooms/catacumba.js:451` | Ya está citada, criatura. Una fuente no se cita dos veces; se gasta. | N11 |
| `rooms/catacumba.js:628` | No. Las galeradas no se tiran: se curan. | N12 |
| `rooms/catacumba.js:655` | La ficha no se faxea. Se sella. | se queda |
| `rooms/catacumba.js:708` | Un fax enmarcado no se coge. Se hereda. | N13 |
| `rooms/catacumba.js:793` | No se empuja a un jefe de cierre. Se le entrega a tiempo. | N14 |
| `rooms/cpd.js:381` | Lo que lleva brida no se coge. Se respeta. O se desenchufa. | N15 |
| `rooms/cpd.js:464` | A Paco no se le empuja. Se le apunta en la cola. Y se espera. | N16 |
| `rooms/ecosistema.js:221` | No se empuja. Se activa. Lo dice el vinilo. | N17 |
| `rooms/ecosistema.js:282` | Un puf no se coge. Se adopta. Y no tengo piso. | N18 |
| `rooms/ecosistema.js:356` | A mí no se me coge. Se me contrata. Por impresiones. | B3 |
| `rooms/office.js:376` | Gervasio no se coge. Se le espera. Él también espera algo. No sabe qué. | N20 |
| `rooms/pajarera.js:313` | No se coge. Se licencia. Cuarenta y ocho mil al mes. | N21 |
| `rooms/pecera.dialogos.js:73` | Pasa. Aquí ya no se trabaja. Se supervisa. | se queda |
| `rooms/pecera.js:141` | Ya está cerrada. En los Despachos las puertas no se cierran: se delegan. | N22 |
| `rooms/pecera.js:330` | Las sillas no se cogen. Se heredan. Y Ramírez sigue desayunando. | se queda |
| `rooms/pecera.secretaria.js:46` | La memoria no se rellena. Se gana. | N23 |
| `rooms/pecera.secretaria.js:157` | Aquí no se coge nada. Se merece. | N24 |
| `rooms/pecera.secretaria.js:161` | "EL MATERIAL NO SE PIDE. SE MERECE". | se queda |
| `rooms/sala_amazonas.js:256` | Ese planillo no se coge. Se negocia. | B5 |
| `rooms/sala_amazonas.js:369` | Es más alto que yo y tiene más autoridad. No se coge: se consulta. | N26 |
| `rooms/sala_amazonas.js:393` | A un consultor no se le empuja. Se le factura. Y eso ya lo hace él. | N27 |
| `rooms/sala_amazonas.js:415` | Aún no se le ha preguntado. Se le preguntará. En el punto cuatro. | se queda |
| `rooms/vestibulo.js:372` | Una escalera no se empuja. Se sube. Si te deja el torno. | N28 |
| `rooms/vestibulo.js:442` | Las plazas no se abren. Se heredan. | N29 |

#### primera vez — 13

| Fichero:línea | Texto literal | Decisión |
|---|---|---|
| `escenas/climax.js:229` | Es la primera vez que la matriz me pone en algún sitio. | se queda |
| `escenas/final.js:154` | ...Felicidades. Es la primera vez que lo digo sin adjunto. | se queda |
| `rooms/administracion.dialogos.js:79` | He hecho un trámite bien. Primera vez. Lo pongo en «logros». | P1 |
| `rooms/ecosistema.js:36` | Cerrado. Por primera vez desde las seis. | P2 |
| `rooms/ecosistema.js:116` | Me pongo delante. El aro me ilumina. Salgo favorecido por primera vez. | P3 |
| `rooms/ecosistema.js:368` | ¿Un acta? Con un banner arriba sería rentable. Por primera vez. | B14 |
| `rooms/pajarera.js:338` | "LIBRE". Es la primera vez que lo veo. | P5 |
| `rooms/pecera.escenas.js:400` | Lectores... no lo sé. Por primera vez en seis años, no lo sé. | se queda |
| `rooms/pecera.js:159` | Un punto rojo: «ESTÁ AQUÍ». Es la primera vez que algo me ubica. | P6 |
| `rooms/pecera.js:209` | Le hablo. Está apagada. Es la primera vez que no me contesta con una cifra. | P7 |
| `rooms/pecera.js:395` | "Shhh", le digo. Es la primera vez que alguien le da la razón. | P8 |
| `rooms/sala_amazonas.js:327` | No, no. El acta es tuya. Yo ya cumplí. Por primera vez. | P9 |
| `rooms/vestibulo.js:266` | Ahí estoy, en VACANTE. Es la primera vez que salgo en un organigrama. | se queda |

#### No es X. Es Y. — 23 (sin Eventos)

| Fichero:línea | Texto literal | Decisión |
|---|---|---|
| `actors.js:397` | Plaza 3, sucesión en disputa. Esto no es un garaje. Es una herencia. | Q1 |
| `duelo.js:23` | No es un despido: es una salida en valor. | se queda |
| `rooms/administracion.dialogos.js:65` | ¿Custodia? No es burocracia, niño. Es temperamento. | Q2 |
| `rooms/administracion.dialogos.js:90` | Eso no es representación. Es autoestima. Y no desgrava. | Q3 |
| `rooms/administracion.js:95` | Las mías no son de pared. Son de archivo personal. Lo dijo ella. | Q4 |
| `rooms/catacumba.js:308` | Eso no es mío. Es de Controlling. Lo respeto. | Q5 |
| `rooms/catacumba.js:425` | Eso no es una pregunta, criatura. Es una sentencia. | se queda |
| `rooms/catacumba.js:791` | Eso no es mío. Es de Controlling. Lo respeto. | Q5 |
| `rooms/catacumba.js:829` | Eso no es entusiasmo, criatura. Es inglés. | se queda |
| `rooms/cpd.js:240` | TODOS. «NO ES UN DESPIDO: ES UNA SALIDA EN VALOR». | se queda |
| `rooms/cpd.js:440` | Paco lo sabe todo. No es intuición: es fontanería. | se queda |
| `rooms/cpd.js:457` | ¿Tiene número de ticket? Pues no es un café: es un rumor. | Q6 |
| `rooms/ecosistema.js:264` | Eso no es una venta. Es una ilusión. Y no la facturo. | B17 |
| `rooms/ecosistema.js:362` | ¿«Pellizco»? Eso no es un nombre, cariño. Es un formato publicitario. | se queda |
| `rooms/pajarera.js:258` | Un acta escrita por un becario no es un acta. Es un diario. | se queda |
| `rooms/pajarera.js:431` | Es un modelo muy empático. No es un armario: es un entorno de concentración. | Q7 |
| `rooms/pecera.dialogos.js:95` | Un quesito que suma 130 % no es un gráfico. Es una aspiración. | Q8 |
| `rooms/pecera.dialogos.js:169` | No es un despido: es una salida en valor. | se queda |
| `rooms/pecera.dialogos.js:220` | ...Eso no es ni hecho ni muerto. Es consultoría. | Q9 |
| `rooms/pecera.escenas.js:120` | Entonces no es una IA. Es un hobby. | se queda |
| `rooms/sala_amazonas.js:458` | ¿Ocho meses sin confirmar? Eso no es un cliente, cariño. Es un exnovio. | se queda |
| `rooms/vestibulo.js:345` | Eso no es una sugerencia. Es un objeto. Aquí no se aceptan pruebas. | Q10 |
| `rooms/vestibulo.js:469` | ¿Un táper sin nombre? Eso no es para mí. Es para alguien con hambre de verdad. | Q11 |

#### factur — 31 (sin Eventos)

| Fichero:línea | Texto literal | Decisión |
|---|---|---|
| `duelo.js:36` | Te lo miro y te facturo. | B13 |
| `duelo.js:91` | Si me grabas, te facturo los derechos de imagen. | F1 |
| `duelo.js:94` | ¿Un manual? Yo no leo manuales: los facturo. | F2 |
| `escenas/climax.js:243` | Factura de Optimal Brains. Cuarenta y ocho euros. Con coma. | se queda |
| `escenas/final.js:97` | Me fui. Y volví facturando. Es lo que se hace. | se queda |
| `game.js:19` | No. Si le doy eso, me pide factura. | F3 |
| `game.js:24` | Mejor no. Si viene con cable, Paco me lo factura. | F4 |
| `rooms/administracion.dialogos.js:52` | Vengo a ver la pared. Dicen que es un museo de facturas. | se queda |
| `rooms/administracion.js:194` | «Asignado a: Titulator 3000». ¿Facturamos a un ticket? Lo apunto. | F5 |
| `rooms/catacumba.js:242` | «Envío por fax: 0,26 euros». Me ha facturado el recorte. | se queda |
| `rooms/catacumba.js:271` | Ya está recortada. Si la vuelvo a enviar, me la facturan dos veces. | F6 |
| `rooms/catacumba.js:713` | factura del fax | se queda |
| `rooms/catacumba.js:716` | Ya está pagada. Es la factura más sentimental de la casa. | F7 |
| `rooms/cpd.js:69` | UN BECARIO VIVE EN UN ARMARIO Y FACTURA COMO UN BANCO | se queda |
| `rooms/cpd.js:254` | Comer algo que no sea atún. Y que no me lo facture nadie. | F8 |
| `rooms/cpd.js:275` | (Despachos) «Amarillo, facturación. Verde, oportunidades...» | F9 |
| `rooms/cpd.js:339` | Lo alquiló el consultor. Yo ahí no entro, que me factura. | F10 |
| `rooms/cpd.js:346` | Si lo empujo, se enfría el modelo. Y luego me lo factura. | F11 |
| `rooms/ecosistema.js:257` | Eso es una baja de campaña, cariño. Te la facturo. | B16 |
| `rooms/ecosistema.js:257` | Se enrolla sin factura. Lo disfruto. | B16b |
| `rooms/ecosistema.js:264` | Eso no es una venta. Es una ilusión. Y no la facturo. | B17 |
| `rooms/ecosistema.js:358` | Uy. Eso en la web se llama «interacción». Te la facturo. | se queda |
| `rooms/pajarera.js:32` | UNA COMERCIAL SE QUEDA SOLA EN UNA REUNIÓN. Y FACTURA LA SALA | F15 |
| `rooms/pajarera.js:304` | Me siento. Me hundo. Me levanto antes de que me lo facturen. | F16 |
| `rooms/pajarera.js:398` | Un consultor no se empuja. Te factura el empujón y el desplazamiento. | N30 |
| `rooms/pajarera.js:449` | Me llama por las comas de las facturas. Le tengo en azul. | se queda |
| `rooms/pecera.escenas.js:119` | ¿Cuánto factura? | se queda |
| `rooms/sala_amazonas.js:106` | Eso no lo facturo. Ni lo firmo. Ni lo entiendo. | B10 |
| `rooms/sala_amazonas.js:195` | ¿Sí? ¿Me llamas desde el colchón? Eso te lo facturo. | B12 |
| `rooms/sala_amazonas.js:393` | A un consultor no se le empuja. Se le factura. Y eso ya lo hace él. | N27 |
| `rooms/vestibulo.js:274` | Si lo empujo, se reestructura solo. Y luego me lo facturan. | F19 |

### 1.4 Otras repeticiones miradas y descartadas como fórmula

Busqué cualquier molde de remate con más de 8 apariciones. Además de las de arriba: «Nadie…» (33, pero repartido en
usos normales, no como remate), «Bueno, …» (11, coletilla de habla, no remate), «Es lo más/mejor [X]» (10: «Es lo
más parecido a un abrazo», «lo más parecido a un acta», «lo más bonito que me han escrito…»; vigilar, sin tope),
«Lo dejo» (7), «Ya está.» (5). Las muletillas por personaje («cariño», «criatura», «chaval», «Lo hablamos») ya
tienen tope en `TOPES`/`TOPES_E2_JUEGO` y no las toco salvo «cariño», que baja de 15 a 14 (B2 y B20).

### 1.5 Un fallo del auditor que esconde fórmulas (para el integrador, P0; verificado en la revisión 2)

`tools/plan-rules.mjs`, `esTexto()`, descarta toda cadena que case con `/^[\w.:\-/ ]+$/`: la idea era saltarse ids
(`fax_enmarcado`), pero como la clase incluye el **espacio**, también descarta cualquier frase sin tildes, eñes, comas,
comillas ni signos de apertura («Un fax enmarcado no se coge. Se hereda.», «Eso te lo arreglo con un pop-up. De
cartulina.»).

**Arreglo:** quitar el espacio de la clase:

```js
const esTexto = (t) => /\s/.test(t) && /[a-záéíóúñ]/i.test(t) && !/^[\w.:\-/]+$/.test(t) && !/^(bool|int|str|num)\b.*·/.test(t);
```

**Verificado por script** (tokenizador de `plan-rules.mjs` copiado tal cual, sobre `content/` de hoy):

| Qué | `esTexto` actual | corregido |
|---|---|---|
| «lo único» (todo / sin Eventos) | 59 / 57 | 59 / 57 |
| «no se X. Se Y.» | 17 / 17 | 36 / 35 |
| «primera vez» | 10 / 10 | 13 / 13 |
| «Mi primer/a» | 4 / 4 | 6 / 6 |
| «No es X. Es Y.» | 21 / 19 | 25 / 23 |
| «factur…» | 24 / 22 | 33 / 31 |
| topes de E2: «desde [fecha]» · «Emoji de fuego» · «pop-up» · «interstitial» · «cariño» (sin Eventos) · «Diseño» | 5 · 7 · 4 · 0 · 15 · 5 | **6/6** · **8/8** · 5/8 · 1/2 · 15/20 · 5/11 |

Sin el arreglo, los topes de §2 no ven 19 «no se X. Se Y.», 3 «primera vez», 2 «Mi primer/a», 4 «No es X. Es Y.» y 9
«factur», y saldrían en verde mintiendo. Con el arreglo, «desde [fecha]» y «Emoji de fuego» de E2 quedan **al límite
exacto** (no los toca E3; aviso al director: cualquier línea nueva con «desde 2019» los rompe).

**Lo que saltaría en `text-audit --estatico` al arreglarlo** (todo lo que aparece, comprobado):

| Fichero | Cadena | Regla | Qué se hace |
|---|---|---|---|
| `duelo.js` | Una tarjeta sin foto. Como tu firma. | «Como X.» | X1 (§3.2) |
| `rooms/administracion.dialogos.js` | Esto. Esto es una nota de gasto. Como Dios manda. | «Como X.» | X2 (§3.2) |
| `lib/edificio.js` | la Pecera · la Catacumba · el Ecosistema | vetadas | no es texto: campo `apodo:` de la tabla `SALA`, que nada lee (búsqueda en `engine/`, `content/`, `tools/`). Excepción en el auditor: `const APODO = /^(?:la\|el) (?:Pecera\|Catacumba\|Ecosistema\|Ventanilla)$/;` y `if (APODO.test(t)) continue;` antes de `VETADAS` en `estatico()` |

Ninguna otra cadena oculta cae en «Como X.», «Diseño» + «Infografía», «director del periódico», «Consejo», «Dirección»
ni en los apodos. Con la tabla de E3 r2 aplicada a una copia de `content/`, el estático corregido da 0 «Como…» y solo
las tres falsas de `edificio.js`.

---

## 2. Topes y expresiones regulares

Se añaden a `TOPES_E2_JUEGO` y, por decisión del director, **con `fuera` para Eventos** (la misma expresión que ya usa
«cariño»). Probadas con Node sobre el árbol actual y sobre una copia con toda la tabla de la revisión 2 aplicada; con
`esTexto()` corregido (§1.5), sin el cual cuentan de menos.

```js
// ENMIENDA E3 §2 (revisión 2) · fórmulas de remate: en todo el juego salvo Eventos (sala protegida, `fuera`);
// flag `u` para que «ÚNICO» y las tildes cuenten. Requiere el arreglo de esTexto() (E3 §1.5).
const FUERA_EVENTOS = /[\\/]eventos[.\w]*\.js$/;
{ re: /(?<!\p{L})(?:lo|la|el|los|las|su|sus|mi|mis)\s+(?:\p{L}+\s+)?únic[oa]s?(?!\p{L})/giu, max: 8, fuera: FUERA_EVENTOS,
  txt: '«lo único / la única…» (E3 §2)' },                                        // hoy 57 → 6
{ re: /\bno se (?:l[aeo]s? |me |te )?\p{L}+(?: \p{L}+){0,5}\s*[.:;,]\s*(?:y )?se (?:l[aeo]s? |me |te )?\p{L}+/giu, max: 6,
  fuera: FUERA_EVENTOS, txt: '«X no se coge. Se Y.» (E3 §2)' },                    // hoy 35 → 5
{ re: /\bprimera vez\b/gi, max: 5, fuera: FUERA_EVENTOS, txt: '«primera vez» (E3 §2)' },   // hoy 13 → 4
{ re: /\bmi primer[oa]?\b/gi, max: 6, fuera: FUERA_EVENTOS, txt: '«Mi primer/a…» (E3 §2)' }, // hoy 6 → 5
{ re: /\bno (?:es|son|era)\s[^.!?;:]{1,45}[.:;,]\s*(?:es|son|era)\s/giu, max: 12, fuera: FUERA_EVENTOS,
  txt: '«No es X. Es Y.» (E3 §1, cuarta fórmula)' },                              // hoy 23 → 10
{ re: /factur/gi, max: 11, fuera: FUERA_EVENTOS, txt: '«factur…» (E3 §4)' },             // hoy 31 → 9
```

**Qué cuentan de verdad** (todas las coincidencias listadas y leídas una a una): las seis cuentan lo que dicen, con un
solo falso positivo asumido, «Aún no se le ha preguntado. Se le preguntará.» (Gervasio, se queda y cuenta), y ningún
falso negativo de la fórmula (la «no se X» suelta, «Eso no se sella.», no es el molde y no la cuentan). La de «lo único»
no exige que la palabra vaya al final; «ERES EL ÚNICO» cuenta.

**Por qué esos números (margen de 1-2 en todos).**
- «lo único» ≤ 8, quedan 6: margen 2 sin tocar el tope del encargo.
- «no se X. Se Y.» ≤ 6, quedan 5 (el ≤ 5 de la crítica): margen 1. Las cinco supervivientes son el original, una pista,
  el cartel de Custodia, el saludo de Leoncio y el futuro de Gervasio (§3.3); no hay sexta que lo merezca.
- «primera vez» **sube de 4 a 5**, quedan 4: las cuatro supervivientes son golpes de final de acto o de puzle (Yoli en
  el apagón, Íñigo en el ¡PLOF!, Evaristo en el epílogo, Bruno en el organigrama). Quitar una para tener margen
  costaría una buena; mejor subir un punto.
- «Mi primer/a» ≤ 6, quedan 5: margen 1; el autoengaño de currículum de Bruno es bueno, el tope solo impide que crezca.
- «No es X. Es Y.» ≤ 12, quedan 10: margen 2.
- «factur…» **baja de 14 a 11**, quedan 9: margen 2. Sin Eventos, el 14 de la revisión 1 dejaba un margen de 5, que no
  es margen sino permiso.
- «cariño» (E2, sin Eventos) queda en 14/20.

## 3. Reescrituras de fórmulas

### 3.1 Formas usadas (leyenda y recuento, revisión 2)

**REC** (recorte: se quita la frase-fórmula y queda la situación, que ya era el chiste) y **ELIMINAR** no son formas,
pero en la revisión 2 cada REC se ha releído con una pregunta: ¿lo que queda sigue teniendo remate? Cuatro no lo tenían
(U16 «El último paso es una interrogación.», U26 «Lo releo. Sigue a 1,20 €.», U27 «Ya está limpio. No lo estropeo.»,
U44 «Apagada. Solo el piloto rojo, en reposo.»): pasan a forma con remate. Otros dos se quedan en REC pero pierden un
«Con sello» que ya era el tercero de Administración (P1, Q4). Q10 pasa de LIT a REC (vuelve el remate del original).
Quedan **27 REC**, cada uno con remate en su última frase o en la línea siguiente de la misma escena (comprobación en
§7.3). Ninguna forma de superficie pasa de 7.

| Código | Forma | Usos |
|---|---|---|
| LOG | Lógica propia del personaje (Teodoro mide, Anselmo pregunta de dónde viene, Custodia deniega, Paco sin ticket no ve, Leoncio en pasado, Íñigo reencuadra, Gertrudis anota) | 12 |
| ACC | Acción con consecuencia / silencio | 7 |
| CSQ | Consecuencia absurda | 7 |
| PRE | Precisión absurda (cifras, fechas, tamaños exactos) | 6 |
| DET | Detalle concreto que solo ve quien mira | 6 |
| PIS | Pista escondida (la línea ayuda a resolver algo) | 6 |
| COR | Cortesía con el objeto | 5 |
| REB | Rebaja / anticlímax (U1 cuenta con su gemela de `pistas.js`) | 5 |
| REG | Fuera de registro (esquela, locutor deportivo, caso de éxito) | 4 |
| AUT | Autoengaño de currículum (Bruno) | 3 |
| CAL | Callback a algo ya visto | 3 |
| LIT | Literalidad | 3 |
| PRG | Pregunta que no espera respuesta | 3 |
| INT | Autointerrupción (Gervasio se corta y se lo da al «se») | 2 |
| TRES | Lista de tres con el tercero torcido (Begoña) | 1 |
| INV | El personaje contra su propio tic (Rubén) | 1 |
| REC | Recorte (no es forma; con remate comprobado) | 27 |
| ELIMINAR | Eliminación (no es forma) | 14 |

Total: 115 entradas de §3 (U28, N5 y Q5 cubren dos claves cada una). LOG pasa de 7 porque no es un molde de frase sino
la regla 1 de §2.2 del plan («la voz es una manera de decidir»): cada LOG suena distinto porque decide alguien distinto.
**Arranques vigilados** (el tic de la revisión 1 no era la forma, sino la primera palabra): tras esta revisión no hay
dos «Lo empujo.» nuevos en la misma sala, ni un tercer «No voy a ser yo», ni un tercer «Con sello» en Administración, y
«¡Quieto!» se queda en boca de Anselmo.

### 3.2 Tabla de reescrituras (para implementar)

U = «lo único», N = «no se X. Se Y.», P = «primera vez», Q = «No es X. Es Y.», F = «factur…» fuera de Maripaz,
X = «Como X.» que esconde el auditor. Las de Maripaz van en §4.3. **Veredicto** en la nota: **A** aprobada tal como
venía, **M** mejorada en la revisión 2 (el porqué de las relevantes, en §7). Las tumbadas no están en la tabla (§7.1).
Toda cadena «actual» se ha comprobado literal contra `content/` el día de esta revisión.

| # | Fichero:línea | Texto actual | Texto nuevo | Forma | Nota |
|---|---|---|---|---|---|
| U1 | `actors.js:212` | Respondo a todos. Es lo único que sé hacer bien. | Respondo a todos. Por fin algo que sé hacer. | REB | **M** · Mirar a Bruno sin meta; conserva la rebaja de Bruno |
| U1b | `pistas.js:29` | Respondo a todos. Es lo único que sé hacer bien. | Respondo a todos. Por fin algo que sé hacer. | =U1 | **M** · meta `climax` |
| U2 | `actors.js:227` | Chof, chof... Menta. Lo único de esta casa que no caduca. | Chof, chof... Menta. | REC | **A** · murmullo de Celestino |
| U3 | `escenas/climax.js:86` | Es la única que hay. Las demás no las escribí. | Es la que hay. Las demás no las escribí. | REC | **A** · Gervasio |
| U4 | `escenas/climax.js:227` | Sin Lector Medio no hay plan. Era mi único dato. | Sin Lector Medio no hay plan. Era toda mi muestra. | PRE | **A** · Íñigo: estadística de N = 1 |
| U5 | `game.js:22` | Ya está cerrado. Aquí lo único que no cierra a tiempo es la edición. | Ya está cerrado. Hasta en eso llego tarde. | REB | **M** · rotación de Cerrar: se sustituye, no se elimina (U14 y N22 ya mandan dos objetos más a Cerrar) |
| U6 | `rooms/administracion.js:139` | Carpetas: «CONTRATOS (LEÍDOS)». La única estantería sincera de la casa. | Carpetas: «CONTRATOS (LEÍDOS)». Y es verdad: están subrayados. | DET | **A** |
| U7 | `rooms/catacumba.js:474` | La máquina de Leoncio respeta el cuerpo 9. Es la única. | La máquina de Leoncio respeta el cuerpo 9. Lo he medido. Nueve. | LOG | **A** · Teodoro mide |
| U8 | `rooms/catacumba.js:672` | No. Es la única boca de Teodoro. Y muerde. | **ELIMINAR** | ELIMINAR | **A** · Empujar el fax: cae en el defecto |
| U9 | `rooms/catacumba.js:699` | No. Llevan cuarenta años colgadas. Es la única antigüedad que se respeta. | No. Llevan cuarenta años colgadas. Debajo, la pared es de otro color. | DET | **A** |
| U10 | `rooms/catacumba.js:730` | Ese libro no se mueve. Es lo único que sostiene esta mesa. | Ese libro, ni tocarlo. Se consulta aquí, de pie. Con las manos limpias. | COR | **A** · Aurora |
| U11 | `rooms/catacumba.js:763` | Si la saco, se cae la mesa. Es su única función con futuro. | Si la saco, se cae la mesa. | REC | **A** |
| U12 | `rooms/cpd.js:315` | El ascensor. Sube. Es lo único que sube aquí sin abrir ticket. | El ascensor. En el sótano, el «tin» suena más bajito. Por respeto. | DET | **A** |
| U13 | `rooms/cpd.js:395` | Es la única brisa de Sistemas. Los servidores me odiarían en mi bemol. | **ELIMINAR** | ELIMINAR | **A** · Coger el ventilador: defecto |
| U14 | `rooms/cpd.js:428` | Ya está cerrado. Es lo único cerrado de todo el registro. | **ELIMINAR** | ELIMINAR | **A** · Cerrar el registro: defecto |
| U15 | `rooms/ecosistema.js:220` | Se cierra solo. Es lo único de la planta que no pide feedback. | Se cierra solo. Al rato, Marketing le pregunta qué tal la experiencia. | LOG | **A** |
| U16 | `rooms/ecosistema.js:240` | El último paso es una interrogación. Es el único honesto. | El último paso es una interrogación. Ese paso ya lo domino. | AUT | **M** · el REC dejaba sin remate |
| U17 | `rooms/ecosistema.js:266` | Es la única cosa de la planta que sube sola. No lo toco. | **ELIMINAR** | ELIMINAR | **A** · Coger el termómetro |
| U18 | `rooms/ecosistema.js:272` | No me llevo la pizarra. Es lo único que Marketing tiene por escrito. | No me llevo la pizarra. Si la muevo, se escapa el velero. | CAL | **A** · callback a su Mirar |
| U19 | `rooms/ecosistema.js:284` | Tiro. Suspira. Es el único de la planta que se queja con razón. | Tiro. Suspira. | REC | **A** |
| U20 | `rooms/office.js:223` | Más abierto no puede estar. Es un arco: lo único de esta planta sin cerradura. | Más abierto no puede estar. Es un arco. | REC | **A** |
| U21 | `rooms/office.js:225` | Empujo el aire del arco. Cede. Es lo único que cede en esta planta. | Empujo el aire del arco. Cede. | REC | **A** |
| U22 | `rooms/office.js:239` | El yogur de Ramírez no se toca. Es lo único suyo que sigue fresco. | El yogur de Ramírez. Caducó en 2019. Dijo que volvía antes. | PRE | **M** · paga «Ramírez sigue desayunando» con la fecha |
| U23 | `rooms/office.js:241` | Mi táper se queda conmigo. Es lo único que tengo a mi cargo. | Mi táper se queda conmigo. En el currículum: «Personal a cargo: 1». | AUT | **A** |
| U24 | `rooms/office.js:264` | Hay cola. Colarse en el microondas es lo único que aquí es despido procedente. | Hay cola. Colarse aquí es despido procedente. | REC | **A** |
| U25 | `rooms/office.js:287` | Si me la llevo, Rubén pierde su única firma. Y no sé quién es. | Si me la llevo, Rubén pierde su firma. Y todavía no sé quién es. | PIS | **M** · conserva la siembra «¿quién es Rubén?» |
| U26 | `rooms/office.js:292` | Lo releo. Sigue a 1,20 €. Es la única cifra estable de la casa. | Lo releo. 1,20 €. Cuando entré de becario, valía uno. | PRE | **M** · el REC dejaba sin remate |
| U27 | `rooms/office.js:299` | Ya está limpio. Es el único táper limpio del edificio. No lo estropeo. | Ya está limpio. Lo vuelvo a fregar. Por tener algo hecho. | REB | **M** · el REC dejaba sin remate |
| U28 | `rooms/office.js:345, 346` | No pienso pegar a una cafetera. Es la única que trabaja de noche. | Ni la rozo. En la pantalla ya pone: «ANOTADO». | LOG | **M** · Empujar y Tirar (dos claves, misma cadena); Gertrudis anota agravios sin gastar «TENGO WIFI Y RENCOR» |
| U29 | `rooms/pajarera.js:317` | ¿El informe en blanco? Es lo único validado de esta planta. Se queda. | ¿El informe en blanco? Se queda. Está validado. | REC | **A** |
| U30 | `rooms/pajarera.js:327` | Es el único mueble de los Despachos sin pósit. No pienso estropearlo. | **ELIMINAR** | ELIMINAR | **A** · Coger el perchero |
| U31 | `rooms/pajarera.js:387` | No. Es la única autoridad de esta planta. Si se cae, se cae todo. | No. Si se cae, se cae todo. Y todavía no toca. | PIS | **A** · pista del ¡PLOF! del clímax |
| U32 | `rooms/pajarera.js:389` | No puedo llevármelo. Es el único lector que nunca se da de baja. | No me lo llevo. Lleva tres semanas asintiendo. Se ha ganado el sitio. | CAL | **A** · cita a Íñigo (`pajarera.js:447`) |
| U33 | `rooms/pajarera.js:476` | Cero. Diecinueve años en cero. Es mi único dato bueno. | Cero. Los marrones se... se reparten. Muy bien repartidos. | INT | **M** · duda del autor resuelta (§7.4); −1 «Diecinueve años» |
| U34 | `rooms/pecera.dialogos.js:232` | El tablero va conectado al registro de Paco. Lo único integrado de la casa. | El tablero va conectado al registro de Paco. | REC | **A** · remata la línea siguiente («Rubén está en HECHO») |
| U35 | `rooms/pecera.js:161` | No se mueve. Es lo único de esta planta que está donde dice que está. | No se mueve. Está donde dice que está. | REC | **A** |
| U36 | `rooms/pecera.js:185` | Los dos únicos que quedan. Están de guardia. Lo demás son chaquetas. | Siguen tecleando. De guardia. El resto de la planta son chaquetas. | REC | **A** |
| U37 | `rooms/pecera.js:211` | Está atornillada a la pared. Es lo único fijo de esta planta. | Está atornillada a la pared. Y Yoli, a la pantalla. | DET | **A** |
| U38 | `rooms/pecera.js:320` | La única silla libre. Tiene una chaqueta: Ramírez, el de Bolsa. | Una silla libre. Tiene una chaqueta: Ramírez, el de Bolsa. | REC | **A** · paso 10 |
| U39 | `rooms/pecera.js:394` | No. Es lo único que les mide sin que se enfaden. | No. Es de Prevención. El pósit, mío. | LOG | **A** · Anselmo: no · motivo · propiedad |
| U40 | `rooms/pecera.js:411` | Déjala. Es lo único ordenado del rincón. Y no es nuestro. | Déjala. Está ordenada. Se nota que no es nuestra. | LOG | **A** · Anselmo |
| U41 | `rooms/pecera.js:434` | ¡Quieto! Es lo único de fuera que dejo entrar. Por los tacos. | ¡Quieto! Es de fuera, pero trae tacos del 8. Tiene permiso. | LOG | **M** · Anselmo vuelve a preguntar de dónde viene |
| U42 | `rooms/pecera.js:517` | No. Está mirando a Herminia trabajar. Es lo único que hace. | No. Está mirando a Herminia trabajar. | REC | **A** |
| U43 | `rooms/pecera.secretaria.js:120` | No existe. Por eso es la única bandeja que no se atasca. | No existe. Y tiene lista de espera. | LOG | **A** · Custodia |
| U44 | `rooms/sala_amazonas.js:280` | Apagada. Solo el piloto rojo, en reposo. Lo único que descansa aquí. | Apagada. Solo el piloto rojo, en reposo. Se lo ha ganado. | COR | **M** · el REC dejaba sin remate |
| U45 | `rooms/sala_amazonas.js:372` | Se lo enseño. Asiente. Asiente a todo: es su único dato. | Se lo enseño. Asiente. Antes le ha asentido al proyector. | DET | **A** |
| U46 | `rooms/vestibulo.js:347` | Está atornillado. Es lo único de esta casa que tiene estabilidad. | Está atornillado. A él sí lo hicieron fijo. | AUT | **M** · fuera el comparativo «más X que» |
| U47 | `rooms/vestibulo.js:361` | Se cierra solo. Es lo único automático del edificio. Bueno, y Gertrudis. | Se cierra solo. Celestino lo narra: «¡Y cierra! ¡Y cierra!». | REG | **A** |
| U48 | `rooms/vestibulo.js:392` | No. Es la única que ha sobrevivido a todos los ERE. | No. Ha sobrevivido a tres ERE. No voy a ser yo el cuarto. | PRE | **A** |
| U49 | `rooms/vestibulo.js:428` | Es la única rama del organigrama que está recta. La dejo. | **ELIMINAR** | ELIMINAR | **A** · Empujar la rama |
| N1 | `duelo.js:87` | LOS MUERTOS NO SE FAXEAN. SE ENTIERRAN EN CUERPO 9. | ESQUELA: UN BOLI DE AURORA. MURIÓ CORRIGIENDO. CABE EN UNA LÍNEA. | REG | **M** · `wrongObject.teodoro.boli_muerto`; Teodoro mide hasta la esquela |
| N2 | `rooms/administracion.js:64` | El pasillo no se empuja. Se recorre. Con número de turno. | **ELIMINAR** | ELIMINAR | **A** |
| N3 | `rooms/administracion.js:93` | Eso es patrimonio. Esas notas no se tocan: se rechazan. | Uno: es patrimonio. Dos: ya están rechazadas. Tres: esas manos. | TRES | **A** · Begoña |
| N4 | `rooms/administracion.js:108` | La ventanilla no se abre. Se atiende por el agujerito, como manda la norma. | ¿Abrirla? Por el agujerito cabe un impreso doblado en tres. Usted, no. | PRE | **A** · Begoña |
| N5 | `rooms/administracion.js:134, 202` | A don Evaristo no se le empuja. Se le espera. | Ni se le ocurra. Si le empuja, vuelve a empezar la cláusula 12. | CSQ | **A** · dos claves, misma cadena |
| N6 | `rooms/administracion.js:147` | Una coma no se usa. Se pone en su sitio. Y ella ya está. | Ya está en su sitio. Y bien puesta. | REC | **A** |
| N7 | `rooms/administracion.js:180` | Aquí no se hacen fotos. Se hacen fotocopias. | ¿Fotos? En esta ventanilla, fotocopias. Por triplicado. | LIT | **M** · duda del autor resuelta (§7.4) |
| N8 | `rooms/administracion.js:181` | A Begoña no se la empuja. Se la tramita. | Me pongo detrás para empujarla. Me da número de turno. El uno. | ACC | **A** |
| N9 | `rooms/catacumba.js:276` | Lo pienso. Un fax mal marcado no se borra. Se archiva. | Lo pienso. En este fax, un número mal marcado también llega. A otro. | CSQ | **A** |
| N10 | `rooms/catacumba.js:385` | La nota te la devuelvo; las fuentes no se quedan, se citan. | Te devuelvo la nota. Una fuente se cita y se devuelve: es prestada. | COR | **A** · Aurora, paso 30 |
| N11 | `rooms/catacumba.js:451` | Ya está citada, criatura. Una fuente no se cita dos veces; se gasta. | Ya está citada, criatura. Dos veces sería abusar de su confianza. | COR | **A** · Aurora |
| N12 | `rooms/catacumba.js:628` | No. Las galeradas no se tiran: se curan. | **ELIMINAR** | ELIMINAR | **A** |
| N13 | `rooms/catacumba.js:708` | Un fax enmarcado no se coge. Se hereda. | No hace falta. La réplica ya me la sé. El marco, que se quede. | PIS | **M** · no depende de la altura del marco (crítica 3, n.º 3, lo mueve) |
| N14 | `rooms/catacumba.js:793` | No se empuja a un jefe de cierre. Se le entrega a tiempo. | ¿Empujar al jefe de cierre antes del cierre? ¿Y quién cierra? | PRG | **M** · sin «media hora»: vale a cualquier hora |
| N15 | `rooms/cpd.js:381` | Lo que lleva brida no se coge. Se respeta. O se desenchufa. | Tiene brida. No me la llevo. Pero el enchufe no tiene brida. | PIS | **M** · la pista de la regleta R-3, más clara |
| N16 | `rooms/cpd.js:464` | A Paco no se le empuja. Se le apunta en la cola. Y se espera. | Paco ni se gira. Escribe algo. Creo que ya consto. | ACC | **M** · sin «Lo empujo.»: ya hay otro en la sala (`cpd.js`, rejilla) |
| N17 | `rooms/ecosistema.js:221` | No se empuja. Se activa. Lo dice el vinilo. | **ELIMINAR** | ELIMINAR | **A** |
| N18 | `rooms/ecosistema.js:282` | Un puf no se coge. Se adopta. Y no tengo piso. | Lo cojo. Lo abrazo. Lo dejo. No tengo piso. | ACC | **A** |
| N20 | `rooms/office.js:376` | Gervasio no se coge. Se le espera. Él también espera algo. No sabe qué. | Gervasio espera algo. No sabe qué. Por si soy yo, me aparto. | CSQ | **M** · la de E3 era el tercer «No voy a ser yo» |
| N21 | `rooms/pajarera.js:313` | No se coge. Se licencia. Cuarenta y ocho mil al mes. | Cuidado, que es una licencia. Cuarenta y ocho mil al mes. Una inversión. | LOG | **M** · Íñigo no grita «Quieto»: reencuadra; conserva la cifra |
| N22 | `rooms/pecera.js:141` | Ya está cerrada. En los Despachos las puertas no se cierran: se delegan. | **ELIMINAR** | ELIMINAR | **A** |
| N23 | `rooms/pecera.secretaria.js:46` | La memoria no se rellena. Se gana. | **ELIMINAR** | ELIMINAR | **A** · segundo elemento del array; queda «Begoña tiene formularios. Yo tengo memoria.» |
| N24 | `rooms/pecera.secretaria.js:157` | Aquí no se coge nada. Se merece. | ¿Qué ha merecido usted hoy. | PRG | **M** · Custodia: pregunta que acaba en punto |
| N26 | `rooms/sala_amazonas.js:369` | Es más alto que yo y tiene más autoridad. No se coge: se consulta. | Lo levanto un poco. Pesa lo que un folio. Asiente igual. | DET | **A** |
| N27 | `rooms/sala_amazonas.js:393` | A un consultor no se le empuja. Se le factura. Y eso ya lo hace él. | No. Está presentando. Si le empujo, pasa a la diapositiva 248. | CSQ | **A** · −1 «factur» |
| N28 | `rooms/vestibulo.js:372` | Una escalera no se empuja. Se sube. Si te deja el torno. | **ELIMINAR** | ELIMINAR | **A** |
| N29 | `rooms/vestibulo.js:442` | Las plazas no se abren. Se heredan. | Aquí una plaza se abre cuando alguien se jubila. Nadie se jubila. | LOG | **M** · la de E3 («se sortean») contradecía la herencia |
| N30 | `rooms/pajarera.js:398` | Un consultor no se empuja. Te factura el empujón y el desplazamiento. | Lo empujo. Se deja. Me da las gracias por el feedback. | CSQ | **A** · −1 «factur» |
| P1 | `rooms/administracion.dialogos.js:79` | He hecho un trámite bien. Primera vez. Lo pongo en «logros». | He hecho un trámite bien. Lo pongo en «logros». | REC | **M** · sin el tercer «Con sello» de la sala |
| P2 | `rooms/ecosistema.js:36` | Cerrado. Por primera vez desde las seis. | Cerrado. | REC | **A** · remata «Se oye la moqueta.» |
| P3 | `rooms/ecosistema.js:116` | Me pongo delante. El aro me ilumina. Salgo favorecido por primera vez. | Me pongo delante. El aro me ilumina. Se me ven seis años de ojeras. | REB | **A** |
| P5 | `rooms/pajarera.js:338` | "LIBRE". Es la primera vez que lo veo. | "LIBRE". Lo leo dos veces. Sigue poniendo "LIBRE". | ACC | **M** |
| P6 | `rooms/pecera.js:159` | Un punto rojo: «ESTÁ AQUÍ». Es la primera vez que algo me ubica. | Un punto rojo: «ESTÁ AQUÍ». Gracias. Me hacía falta. | COR | **A** |
| P7 | `rooms/pecera.js:209` | Le hablo. Está apagada. Es la primera vez que no me contesta con una cifra. | Le hablo. Está apagada. No me da ni una cifra. | REC | **A** |
| P8 | `rooms/pecera.js:395` | "Shhh", le digo. Es la primera vez que alguien le da la razón. | "Shhh", le digo. Se pone verde un segundo. Luego, rojo otra vez. | ACC | **A** · opcional: `setState('semaforo_ruido', 'verde')` 1 s y vuelta a rojo |
| P9 | `rooms/sala_amazonas.js:327` | No, no. El acta es tuya. Yo ya cumplí. Por primera vez. | No, no. El acta es tuya. Yo ya... Se ha cumplido. | INT | **A** · Gervasio |
| P10 | `lib/movil.js:29` | «Pensar no es deducible». Lo enmarco. Mi primer documento oficial. | «Pensar no es deducible». Lo enmarco. | REC | **A** · deshace el doblete con el RECHAZADO |
| Q1 | `actors.js:397` | Plaza 3, sucesión en disputa. Esto no es un garaje. Es una herencia. | Plaza 3, sucesión en disputa. Tres herederos. Ningún coche. | PRE | **A** · murmullo de Evaristo |
| Q2 | `rooms/administracion.dialogos.js:65` | ¿Custodia? No es burocracia, niño. Es temperamento. | ¿Custodia? Temperamento, niño. Eso no hay quien lo selle. | REC | **A** · funde las dos líneas |
| Q2b | `rooms/administracion.dialogos.js:65` | Eso no se sella. | **ELIMINAR** | ELIMINAR | **A** · segundo elemento del mismo `reply` |
| Q3 | `rooms/administracion.dialogos.js:90` | Eso no es representación. Es autoestima. Y no desgrava. | Eso es autoestima. Y no desgrava. | REC | **A** |
| Q4 | `rooms/administracion.js:95` | Las mías no son de pared. Son de archivo personal. Lo dijo ella. | Las mías van al archivo personal. Lo dijo ella. | REC | **M** · fuera «Con sello» (tercero de la sala) |
| Q5 | `rooms/catacumba.js:308, 791` | Eso no es mío. Es de Controlling. Lo respeto. | De Controlling. Ni lo mido. Lo respeto. | REC | **A** · dos claves |
| Q6 | `rooms/cpd.js:457` | ¿Tiene número de ticket? Pues no es un café: es un rumor. | Café sin ticket. Estado: rumor. Olor: confirmado. | LOG | **M** · la de E3 decía «Me lo bebo» y el café no se consume |
| Q7 | `rooms/pajarera.js:431` | Es un modelo muy empático. No es un armario: es un entorno de concentración. | Es un modelo muy empático. Le tenemos en un entorno de concentración. | REC | **A** · el leísmo de persona es el chiste (es Rubén) |
| Q8 | `rooms/pecera.dialogos.js:95` | Un quesito que suma 130 % no es un gráfico. Es una aspiración. | Un quesito que suma 130 %. Yo los hacía de 100. Vieja escuela. | LOG | **M** · Leoncio no es de Bolsa: oficio en pasado |
| Q9 | `rooms/pecera.dialogos.js:220` | ...Eso no es ni hecho ni muerto. Es consultoría. | ...Ni hecho ni muerto. Consultoría. | REC | **A** · Anselmo, vía 3 |
| Q10 | `rooms/vestibulo.js:345` | Eso no es una sugerencia. Es un objeto. Aquí no se aceptan pruebas. | Es un buzón de sugerencias. Pruebas, no se aceptan. | REC | **M** · duda del autor resuelta (§7.4) |
| Q11 | `rooms/vestibulo.js:469` | ¿Un táper sin nombre? Eso no es para mí. Es para alguien con hambre de verdad. | ¡Táper rechazado! ¡Ese táper busca a alguien con hambre de verdad! | REG | **A** · Celestino; conserva la pista (Rubén) |
| F1 | `duelo.js:91` | Si me grabas, te facturo los derechos de imagen. | Grábame. Lo subimos como caso de éxito. Tú sales en «aprendizajes». | REG | **A** · Íñigo |
| F2 | `duelo.js:94` | ¿Un manual? Yo no leo manuales: los facturo. | ¿Un manual? Nosotros lo resumimos en una diapositiva. La 247. | CAL | **A** · Íñigo |
| F3 | `game.js:19` | No. Si le doy eso, me pide factura. | No. Aquí los regalos vuelven con acuse de recibo. | LIT | **A** · rotación de Dar |
| F4 | `game.js:24` | Mejor no. Si viene con cable, Paco me lo factura. | Mejor no. Todo lo que tiene cable acaba en Sistemas. Y yo detrás. | CSQ | **A** · rotación de Tirar |
| F5 | `rooms/administracion.js:194` | «Asignado a: Titulator 3000». ¿Facturamos a un ticket? Lo apunto. | «Asignado a: Titulator 3000». ¿Y a quién se lo reclamo? ¿Al enchufe? | PRG | **A** · Evaristo |
| F6 | `rooms/catacumba.js:271` | Ya está recortada. Si la vuelvo a enviar, me la facturan dos veces. | Ya está recortada. Si la vuelvo a enviar, Begoña recorta el recorte. | CSQ | **A** |
| F7 | `rooms/catacumba.js:716` | Ya está pagada. Es la factura más sentimental de la casa. | La toco. Teodoro carraspea por el fax. La dejo donde estaba. | ACC | **A** |
| F8 | `rooms/cpd.js:254` | Comer algo que no sea atún. Y que no me lo facture nadie. | Comer algo que no sea atún. Y que nadie me lo titule. | INV | **A** · Rubén |
| F9 | `rooms/cpd.js:275` | (Despachos) «Amarillo, facturación. Verde, oportunidades...» | (Despachos) «Amarillo, prescindible. Verde, prescindible pero barato...» | PIS | **A** · siembra «Prescindible. Caro.» |
| F10 | `rooms/cpd.js:339` | Lo alquiló el consultor. Yo ahí no entro, que me factura. | Lo alquiló el consultor. Sin ticket. Para mí, ese armario no existe. | LOG | **A** · Paco |
| F11 | `rooms/cpd.js:346` | Si lo empujo, se enfría el modelo. Y luego me lo factura. | Ni se mueve. Pesa más de lo que debería pesar un armario de servidores. | PIS | **M** · era el tercer «Lo empujo.» de arranque |
| F15 | `rooms/pajarera.js:32` | UNA COMERCIAL SE QUEDA SOLA EN UNA REUNIÓN. Y FACTURA LA SALA | UNA COMERCIAL SE QUEDA SOLA EN UNA REUNIÓN. Y LA AMORTIZA | REC | **A** · titular |
| F16 | `rooms/pajarera.js:304` | Me siento. Me hundo. Me levanto antes de que me lo facturen. | Me siento. Me hundo. Huele a consultor. Me levanto. | ACC | **A** |
| F19 | `rooms/vestibulo.js:274` | Si lo empujo, se reestructura solo. Y luego me lo facturan. | **ELIMINAR** | ELIMINAR | **A** · Empujar el organigrama |
| X1 | `duelo.js:85` | Una tarjeta sin foto. Como tu firma. | Una tarjeta sin foto. Sin cara no hay cuerpo. | LIT | **A** · remate «Como X.» oculto |
| X2 | `rooms/administracion.dialogos.js:131` | Esto. Esto es una nota de gasto. Como Dios manda. | Esto. Esto es una nota de gasto. | REC | **A** · remate «Como X.» oculto; la línea siguiente enumera |

### 3.3 Las que se quedan y por qué (fuera de Eventos)

| Fórmula | Se queda | Por qué |
|---|---|---|
| lo único (6) | Aurora: «…Y su corbata, lo único bien puntuado de la casa.» · Rubén: «…Eras lo único que pasaba.» · Paco: «Lo único de esta casa que contesta a todos sin cabrearse...» · Gertrudis: «LO SÉ. ERES EL ÚNICO…» · Custodia: «…Es la única que los acaba…» · Evaristo: «...Es broma. Es lo único que sé hacer de broma.» | Paso 32; la frase triste del juego; siembra del remate del fax; la despedida que cita la crítica; la pista del boli muerto; la única broma de Evaristo. |
| no se X. Se Y. (5) | «Las sillas no se cogen. Se heredan.» · «La ficha no se faxea. Se sella.» · cartel «EL MATERIAL NO SE PIDE. SE MERECE» · Leoncio «Aquí ya no se trabaja. Se supervisa.» · Gervasio «Aún no se le ha preguntado. Se le preguntará.» | El original; una pista; el origen en el mundo; un saludo; el «se» de Gervasio en futuro (la regex lo cuenta, y cuenta en el tope). |
| primera vez (4) | Evaristo en el epílogo · Íñigo en el clímax · Yoli en el apagón · Bruno en el organigrama | Golpes, no tic. Ninguna antes del Acto II salvo la del organigrama (remate de puzle). |
| No es X. Es Y. (10) | Aurora ×2 · Íñigo «hobby» · Maripaz «exnovio» y «Pellizco» · Gervasio «diario» · Paco «fontanería» · R13 ×3 | Una por voz; R13 es un ataque del duelo y no se toca. |
| factur… (9) | Factura de 48 € (clímax) · «volví facturando» (epílogo) · «museo de facturas» · «Me ha facturado el recorte» · objeto «factura del fax» · titular de Rubén · «las comas de las facturas» · «¿Cuánto factura?» · Maripaz «Te la facturo» (1.er empujón) | Las de trama y una de Maripaz como condimento. |

Eventos (`eventos.js`, `eventos.dialogos.js`) no se toca ni cuenta: allí siguen la pancarta, las sillas, «A Pilar no se
la coge…», las croquetas, la silla 112 y las dos facturas de Maripaz en Eventos.

### 3.4 Cinco notas de oficio sobre la tabla

1. **Recortar antes que reescribir**, pero comprobando que queda remate (§3.1).
2. **Las pistas sobreviven y algunas mejoran.** La regleta (N15, ahora más clara), el Lector Medio que «si se cae, se cae
   todo» (U31), «¿quién es Rubén?» (U25, se recupera la siembra que E3 había quitado), el táper con hambre (Q11), los
   48.000 € (N21), el armario 27 que pesa demasiado (F11), la rejilla que adelanta «prescindible» (F9) y el fax
   enmarcado, que ahora dice que la réplica ya está aprendida (N13).
3. **Los dobletes se rompen, y no se crean otros.** E3 creaba tres: el tercer «No voy a ser yo…» (N20), el tercer «Con
   sello» de Administración (P1, Q4) y el tercer «Lo empujo.» de arranque (F11); también «Quieto» en dos bocas (N21,
   B5). La revisión 2 los quita.
4. **Las voces ganan.** Teodoro mide hasta la esquela (N1), Íñigo reencuadra (N21), Leoncio presume en pasado (Q8),
   Anselmo pregunta de dónde viene (U41), Custodia pregunta con punto (N24), Paco informa de estado (Q6).
5. **Las eliminaciones caen en los defectos**, y el de Cerrar no se empobrece (U5 se sustituye). Ninguna toca un paso
   del recorrido de 44.

---

## 4. Maripaz Remitido: segundo registro (revisión 2)

> El eje lo ha fijado el dueño y **sigue siendo lo que más se oye de ella**: cada píxel es inventario (branded content,
> «todavía cabe un banner», «te lo arreglo con un pop-up», «los interstitials son ingresos», «se ve demasiado la
> noticia»). Intactos, palabra por palabra: la X que mengua, la página 7 según Comercial, el anuncio de la estampida,
> el interstitial, el vídeo de Siestatón, los paquetes y el gong, el exnovio, el adhesivo «SU ANUNCIO AQUÍ» (y lo que
> pasa al quitarlo: nada nuevo), «Has hecho clic en un anuncio…», la «tarifa plana», la silla 113 y el epílogo entero.

### 4.1 Dirección aceptada y sus límites

**A · La que lo lee todo**, aceptada por el director como dirección, con tres límites que fija esta revisión:

1. **Lee el periódico y la pieza de hoy; nunca «te lee» a Bruno.** El final del juego es que la abuela es quien lee y
   comenta a Bruno («Yo te leo todas las mañanas…»; Yoli: «Una. Pero se lo lee TODO.»). Nada de Maripaz puede decir
   «te leo», «leyéndote», «seis años» ni prometer leerle. Por eso caen B7 («Lo sé: te leo. Entero.»), B11 («Las
   leeré.»), M2 («Seis años leyéndote. Sin hueco.») y la línea nueva del epílogo (§7.1).
2. **Lo dice en su idioma comercial, sin ternura.** Leer, para ella, es encontrar el hueco y el anuncio vecino
   (vecindad). Elogio = valor en inventario («la conclusión vale un faldón entero»), nunca «es lo mejor».
3. **Dosis: seis líneas en su boca**, ninguna en el duelo, una sola en su árbol. El resto de sus ~60 líneas, eje.

**Las seis líneas del segundo registro** (y dónde van):

| # | Línea | Dónde |
|---|---|---|
| 1 | (lee la web) Incendio en un polígono. Y al lado, barbacoas. Lo cambio. | murmullo (B20) |
| 2 | ¿El acta? Ya la he leído. «Pedir más café». Ahí cabe Cafés Madrugón. | Dar acta, Marketing (B14) |
| 3 | De la cabecera a las esquelas. Para vender un hueco hay que leer lo de al lado. | árbol `maripaz`, opción nueva (B19) |
| 4 | Lo más leído es la fe de erratas. Y ahí no me dejan poner ni un banner. | ídem: el remate vuelve al eje |
| 5 | Línea nueve: «Hidrovoltia, a por el Robledal». Quita el sueño. Siestatón. | M1, Dar `pieza_opa` (B24) |
| 6 | Y la conclusión vale un faldón entero. Que no te la recorten. | ídem |

Y su pago, sin línea nueva: el faldón del paso 35 (§4.4.2), donde Bruno lee el anuncio que ella escribió tras leer la
pieza.

**Proporción comprobada.** Árbol `maripaz` (`ecosistema.dialogos.js`): 17 líneas suyas hoy, todas de eje o condimento; con B19,
19, de las que 1 es segundo registro y 1 vuelve al eje en el remate. Duelo D1 (`duelMaripaz` + `duelo.js`): 0 de segundo
registro (B9 es vecindad de inventario, eje; B10 y B13 pasan a eje). Sala Amazonas: 0.

### 4.2 «factur…»: de 31 a 9 (sin Eventos)

Bajan 22 apariciones fuera de Eventos: 6 en la tabla de Maripaz (B10, B12, B13, B16, B16b, B17) y 16 en §3.2 (los 14
F, N27 y N30). Quedan 9 (§3.3), tope 11. Recuento hecho por script sobre una copia de `content/` con toda la tabla
aplicada.

### 4.3 Reescrituras de Maripaz (para implementar)

| # | Fichero:línea | Texto actual | Texto nuevo | Forma | Nota |
|---|---|---|---|---|---|
| B2 | `rooms/sala_amazonas.js:344` | A mí no se me coge, cariño. Se me contrata. Por impresiones. | ¿Cogerme? Antes, el formulario de contacto, cariño. Catorce campos. | eje | **A** · Coger (Sala) |
| B3 | `rooms/ecosistema.js:356` | A mí no se me coge. Se me contrata. Por impresiones. | ¿Cogerme? Rellena antes el formulario. Catorce campos. Ocho obligatorios. | eje | **M** · Coger (Marketing): ya no es gemela de la de la Sala |
| B4 | `rooms/sala_amazonas.js:345` | Eso en la web se llama «interacción». Te la cobro. | ¡Uy! Si me mueves a mí, se mueve la página 7. | situación | **M** · Empujar (Sala), tras el mazo; «¡Quieto!» es de Anselmo; rompe `test-comedia-p4.mjs:280` |
| B5 | `rooms/sala_amazonas.js:256` | Ese planillo no se coge. Se negocia. | Ese planillo tiene un hueco. Es mío hasta que alguien llame a Siestatón. | eje | **M** · pista del duelo, sin «me lo he leído» |
| B9 | `rooms/sala_amazonas.js:102` | Eso me lo guardo para un branded content. | Bien dicho. Eso, al lado de un anuncio de tiritas. | eje | **A** · `hurt`: vecindad de inventario (le ha dolido → tiritas) |
| B10 | `rooms/sala_amazonas.js:106` | Eso no lo facturo. Ni lo firmo. Ni lo entiendo. | Eso no lleva sello. Sin sello, para mí es un hueco. Y los huecos los vendo. | eje | **M** · `wrongObject` del remate: orienta a la ficha sellada |
| B12 | `rooms/sala_amazonas.js:195` | ¿Sí? ¿Me llamas desde el colchón? Eso te lo facturo. | ¿Sí? ¿Me llamas desde un colchón? Buena elección. | condimento | **A** · `d1Siestaton`, 3.ª derrota |
| B13 | `duelo.js:36` | Te lo miro y te facturo. | ¿Me lo miras? Eso es una impresión. Te la cobro. | eje | **M** · floja «Te lo miro y te digo»: contesta retorciendo la frase de Bruno, como las de los demás rivales |
| B14 | `rooms/ecosistema.js:368` | ¿Un acta? Con un banner arriba sería rentable. Por primera vez. | ¿El acta? Ya la he leído. «Pedir más café». Ahí cabe Cafés Madrugón. | 2.º | **A** · Dar `acta_reunion`; −1 «primera vez» |
| B15 | `rooms/ecosistema.js:371` | Si no lleva logo, no lo cojo. Y si lo lleva, lo cobro. | Me lo quedo cinco segundos. Lo que dura un anuncio. Toma. | eje | **M** · Dar `*` (solo Marketing; en la Sala se queda la del logo); vale para cualquier objeto |
| B16 | `rooms/ecosistema.js:257` | Eso es una baja de campaña, cariño. Te la facturo. | Eso es una baja de campaña, cariño. Con tres días de preaviso. | eje | **A** · roll-up, Empujar, con Maripaz (1.er argumento de `mp`) |
| B16b | `rooms/ecosistema.js:257` | Se enrolla sin factura. Lo disfruto. | Se enrolla solo. Sin testigos. Lo disfruto. | — | **A** · ídem, sin Maripaz (2.º argumento) |
| B17 | `rooms/ecosistema.js:264` | Eso no es una venta. Es una ilusión. Y no la facturo. | Así lo pinto yo los viernes. Pero con más pulso. | persona | **A** · termómetro, Usar, con Maripaz; casa con «Lo toco más fuerte. Que parezca.» |
| B19 | `rooms/ecosistema.dialogos.js:—` | — | opción `once` «¿Usted se lee el periódico?» / MARIPAZ «De la cabecera a las esquelas. Para vender un hueco hay que leer lo de al lado.» / MARIPAZ «Lo más leído es la fe de erratas. Y ahí no me dejan poner ni un banner.» | 2.º | **M** · antes de «¿Qué tal con Siestatón?»; `reply` de dos líneas; +3 |
| B20 | `actors.js:314` | Tadeo, cariño, te patrocino el reenvío. | (lee la web) Incendio en un polígono. Y al lado, barbacoas. Lo cambio. | 2.º | **A** · murmullo; −1 «cariño» |
| B21 | `rooms/catacumba.js:260` | De Comercial. Mi pieza, con un faldón de Siestatón. Más largo que la pieza. | Mi pieza, con faldón de Comercial: «¿La opa le quita el sueño? Siestatón». | eje | **M** · M2 nuevo (§4.4.2); Bruno, 1 por 1; las dos líneas del fax, intactas; rompe `test-comedia-p3.mjs:327` |
| B24 | `rooms/ecosistema.js:367` | ¿Toda esta noticia sin un anuncio en medio? Se ve demasiado. | se queda como respuesta repetida, y se añaden: [1.ª] «Línea nueve: «Hidrovoltia, a por el Robledal». Quita el sueño. Siestatón.» / «Y la conclusión vale un faldón entero. Que no te la recorten.» / [con `pieza_recortada`] «Te han quitado la conclusión. Era mi hueco de cierre. Lo daba por vendido.» | 2.º | **M** · M1 (§4.4.1); +3 |

**El duelo D1 sigue casando.** Cambian `hurt` (B9), `wrongObject` del remate (B10), la 3.ª derrota (B12) y la
contestación de una floja (B13). No cambian `subject`, `attackText` (las cuatro, eje, intactas), `taunt`, `deck`
(R08, R04, R11, R14), `finishers` (remate en `atScore: 3` con `ficha_pagina_7`), `hurtByPair`, `defeatScene`, `onWin`,
flags ni pistas. B10 orienta hacia lo que falta (algo sellado). `pistas.js` (objetivo `hueco`) no cita ninguna línea que
cambie: **sin cambios en `pistas.js`** salvo U1b.

### 4.4 Dos momentos de situación

#### 4.4.1 M1 · «La lectora del inventario» (Marketing y Comercial; Dar `pieza_opa` a Maripaz)

Dónde: `content/rooms/ecosistema.js`, actor `maripaz_remitido`, clave `'dar:pieza_opa'`. Cuándo: con la pieza escrita
(paso 34) y Maripaz en su planta (tras D1), antes o después del recorte (paso 35). Opcional. Marca local
`api.once('ecosistema_maripaz_lee')` (mismo patrón que `ecosistema_silla_113`; declárese si `check.mjs` lo pide).

```js
'dar:pieza_opa': async (api) => {
  if (api.flag('pieza_recortada')) { await sayM(api, 'Te han quitado la conclusión. Era mi hueco de cierre. Lo daba por vendido.'); return; }
  if (!api.once('ecosistema_maripaz_lee')) { await sayM(api, '¿Toda esta noticia sin un anuncio en medio? Se ve demasiado.'); return; }
  await api.cutscene(async (api) => {
    api.faceActor(MARIPAZ, 'bruno'); await api.anim(MARIPAZ, 'reach', 400); api.sfx('paper');   // la coge
    api.faceActor(MARIPAZ, 'down'); await api.wait(1400);                                        // la lee, con el dedo
    for (let i = 0; i < 3; i++) { api.sfx('click'); await api.wait(350); }                       // tres golpecitos de mazo: ahí iría un banner
    await api.wait(600); api.faceActor(MARIPAZ, 'bruno');
    await sayM(api, 'Línea nueve: «Hidrovoltia, a por el Robledal». Quita el sueño. Siestatón.');
    await sayM(api, 'Y la conclusión vale un faldón entero. Que no te la recorten.');
    await api.anim(MARIPAZ, 'reach', 400); api.sfx('paper');                                     // se la devuelve; no se consume
  });
},
```

Por qué funciona: lee la pieza de hoy, no a Bruno, y lo que saca es inventario (la opa quita el sueño → colchones). Lo
único que se parece a un elogio es una tasación («vale un faldón entero»). «Que no te la recorten» se cumple minutos
después con Begoña, y la versión recortada lo cobra en su idioma («Lo daba por vendido»). La respuesta repetida es la
línea de eje de hoy: tras leerla, vuelve a vender.

#### 4.4.2 M2 (revisión 2) · «El faldón leído» (Redacción de papel, paso 35; sustituye al M2 del adhesivo)

El M2 de la revisión 1 (Aurora lee por detrás del adhesivo «Seis años leyéndote. Sin hueco.») **se retira**: decía que
alguien lee a Bruno desde hace años, que es la revelación de la abuela, y además ocurría tras D1 (paso 26-32), antes de
que exista la pieza (paso 34), así que no se podía convertir en «ha leído la pieza de hoy». La función `quitarAdhesivo`
de `catacumba.js` **no cambia**.

El momento pasa al faldón (`faldonComercial`, `catacumba.js:255-266`), que ya es camino principal y ya trae la hoja de
Comercial con la pieza. Cambia una línea de Bruno (B21), 1 por 1; el resto, igual:

```text
(El fax imprime una hoja larga, larguísima.)
BRUNO: Mi pieza, con faldón de Comercial: «¿La opa le quita el sueño? Siestatón».
TEODORO (fax): EL ANUNCIO MIDE CUARENTA LÍNEAS. LA NOTICIA, VEINTITRÉS.
TEODORO (fax): EN MI PÁGINA LA NOTICIA SE VE. DEVUELTO.
(Teodoro mete la hoja en el fax al revés. El fax la traga entera, despacio.)
```

Por qué funciona: el anuncio es contextual, así que Maripaz se ha leído la pieza de hoy, y lo dice en el único idioma
que tiene: un eslogan. Nadie lo subraya; quien jugó M1 reconoce su «Quita el sueño. Siestatón», y quien no, ríe con el
eslogan. Teodoro conserva su mejor línea de la escena. Saldo 0.

#### 4.4.3 Epílogo

**Sin cambios** (`final.js:134-141` intacto): «Página 7. Tu noticia, entera. Ni un anuncio. Me ha dolido, cariño.» y lo que
sigue. Es eje, no lee a nadie, y no compite con «Se ha leído tu opa entera» (Yoli) ni con la abuela, que llegan
cuarenta segundos después.

### 4.5 Topes de Maripaz tras la revisión 2

| Tope | Hoy | Tras E3 r2 | Máximo |
|---|---|---|---|
| «cariño» (todo el juego, sin Eventos) | 15 | 14 | 20 |
| «pop-up» | 5 | 5 | 8 |
| «interstitial» | 1 | 1 | 2 |
| «(*» | 0 | 0 | 0 |
| M1 «cabe un banner» (oído, Maripaz) | igual | igual (B6 y B7 tumbadas) | 5 |
| M2 «arreglo con un pop-up» | igual | igual | 4 |
| M3 «se ve demasiado» | igual | igual (B24 la conserva como respuesta repetida) | 3 |
| M4 «branded content / contenido que paga» | igual | −1 (B9) | 3 |
| «factur…» (sin Eventos) | 31 | 9 | 11 |

---

## 5. Saldo de líneas, ficheros y pruebas

**Unidad:** una línea = una cadena que se dice o se enseña (entrada de `say`, elemento de array, opción de menú).

| Bloque | Cambios | Saldo |
|---|---|---|
| §3 Fórmulas | 115 entradas: 101 reescrituras 1 por 1, 14 ELIMINAR | **−14** |
| §4 Maripaz | 17 entradas: 15 reescrituras 1 por 1; B19 (+3); B24 (+3) | **+6** |
| **Total** | | **−8** (revisión 1: −5) |

| Fichero | Paquete | Entradas | Saldo | Ids |
|---|---|---|---|---|
| `content/actors.js` | P0 | 4 | 0 | U1 U2 Q1 B20 |
| `content/pistas.js` | P0 | 1 | 0 | U1b |
| `content/game.js` | P0 | 3 | 0 | U5 F3 F4 |
| `content/duelo.js` | P0 | 5 | 0 | N1 F1 F2 X1 B13 |
| `content/lib/movil.js` | P0 | 1 | 0 | P10 |
| `content/rooms/vestibulo.js` | P1 | 9 | −3 | U46-U49 N28 N29 Q10 Q11 F19 |
| `content/rooms/cpd.js` | P1 | 10 | −2 | U12-U14 N15 N16 Q6 F8-F11 |
| `content/rooms/pecera.js` | P2 | 12 | −1 | U35-U42 N22 P6-P8 |
| `content/rooms/pecera.dialogos.js` | P2 | 3 | 0 | U34 Q8 Q9 |
| `content/rooms/pecera.secretaria.js` | P2 | 3 | −1 | U43 N23 N24 |
| `content/rooms/pajarera.js` | P2 | 11 | −1 | U29-U33 N21 N30 P5 Q7 F15 F16 |
| `content/rooms/office.js` | P3 | 10 | 0 | U20-U28 N20 |
| `content/rooms/catacumba.js` | P3 | 15 | −2 | U7-U11 N9-N14 Q5 F6 F7 B21 |
| `content/rooms/administracion.js` | P3 | 10 | −1 | U6 N2-N8 Q4 F5 |
| `content/rooms/administracion.dialogos.js` | P3 | 5 | −1 | P1 Q2 Q2b Q3 X2 |
| `content/rooms/sala_amazonas.js` | P4 | 11 | 0 | U44 U45 N26 N27 P9 B2 B4 B5 B9 B10 B12 |
| `content/rooms/ecosistema.js` | P4 | 16 | +1 | U15-U19 N17 N18 P2 P3 B3 B14-B17 B24 |
| `content/rooms/ecosistema.dialogos.js` | P4 | 1 | +3 | B19 |
| `content/escenas/climax.js` | P4 | 2 | 0 | U3 U4 |
| `tools/plan-rules.mjs` | P0 | — | — | §2 (seis topes con `fuera`) y §1.5 (`esTexto`, excepción `apodo:`) |

**No se tocan:** `eventos.js`, `eventos.dialogos.js`, `pecera.escenas.js`, `pecera.voces.js`, `items.js`, `flags.js`,
`escenas/final.js` (la revisión 1 tocaba B23: tumbada), la función `quitarAdhesivo`, la tarjeta final y los créditos.

**Pruebas que citan texto que cambia** (búsqueda literal de cada cadena actual, y de cada frase de ≥ 12 caracteres, en
`tools/*.mjs`; actualizar a la vez que el texto):

| Prueba | Línea | Cadena citada | Id | Qué hacer |
|---|---|---|---|---|
| `tools/test-comedia-p2.mjs` | 406 | «Lo único integrado de la casa.» | U34 | quitar esa cadena de `musts` |
| `tools/test-comedia-p2.mjs` | 215 | «Es lo único de fuera que dejo entrar. Por los tacos.» | U41 | → «Es de fuera, pero trae tacos del 8.» |
| `tools/test-comedia-p2.mjs` | 313 | «Un quesito que suma 130 % no es un gráfico. Es una aspiración.» | Q8 | → «Un quesito que suma 130 %. Yo los hacía de 100. Vieja escuela.» |
| `tools/test-comedia-p2.mjs` | 405 | «...Eso no es ni hecho ni muerto. Es consultoría.» | Q9 | → «...Ni hecho ni muerto. Consultoría.» |
| `tools/test-comedia-p1.mjs` | 329 | «Comer algo que no sea atún.» | F8 | sigue casando (es prefijo): sin cambios |
| `tools/test-comedia-p4.mjs` | 280 | «Te la cobro.» (Empujar en la Sala) | B4 | → «Si me mueves a mí, se mueve la página 7.» |
| `tools/test-comedia-p3.mjs` | 327 | «Mi pieza, con un faldón de Siestatón. Más largo que la pieza.» | B21 | → «Mi pieza, con faldón de Comercial: «¿La opa le quita el sueño? Siestatón».» (las dos de Teodoro, igual) |
| `tools/test-comedia-p4.mjs` | 457 | «Cuarenta y ocho mil al mes. Firmado. Fin del hilo.» | (N21) | no cambia: N21 no contiene «Firmado»; comprobar que `logHas` sigue dando 1 |

Coincidencias que la búsqueda saca y **no** se rompen: `test-comedia-p4.mjs:213` («se llama «interacción». Te la
facturo.», el empujón de Maripaz, intacto; no la B16) y `:315` («Se ve demasiado. Estoy en ello.», del árbol de la
Sala; no la B24). Las que la revisión 1 rompía y ya no: `test-comedia-p4.mjs:276` («con una tableta llena de anuncios», B1 tumbada),
`:369` («Y sin un banner. Me duele.», B11 tumbada), `test-comedia-p1.mjs:372` (epílogo, B23 tumbada). Ningún paso de
`walk-data.mjs` ni de `extras.mjs` cita estas líneas.

---

## 6. Dudas de la revisión 1, cerradas

1. **¿REC es una forma?** No, y queda con remate comprobado (§3.1): 24.
2. **Topes sin margen.** Resuelto (§2): todos con 1-2 de margen, sin Eventos.
3. **Eventos en los topes.** Decisión del director: fuera (`fuera`), como «cariño». Ninguna línea de Eventos se toca.
4. **`esTexto()`.** Arreglo confirmado por script (§1.5): destapa 2 «Como X.» (X1, X2, ya en la tabla) y 3 vetadas
   falsas en `lib/edificio.js` (campo `apodo:`). Ninguna otra.
5. **M2 y el final.** Retirado; sustituido por el faldón leído (§4.4.2).
6. **Teodoro y el faldón.** Conserva «En mi página la noticia se ve. Devuelto.»: cambia la línea de Bruno, no la suya.
7. **Marcas en la vecindad.** Sin marcas nuevas: «tiritas» (B9) y Siestatón (ya existe) bastan.
8. **Marca local de M1.** `api.once('ecosistema_maripaz_lee')`, como las demás marcas `once` de la sala.
9. **Defectos.** U5 se sustituye, no se elimina.
10. **Gervasio y «Diecinueve años».** U33 lo quita (baja uno).

---

## 7. Acta de la contra (segundo guionista, revisión 2)

**Balance.** De las 140 entradas de la revisión 1: **93 aprobadas** tal cual (85 de fórmulas, 8 de Maripaz), **39
mejoradas** (30 de fórmulas, 9 de Maripaz) y **8 tumbadas** (todas de Maripaz). Saldo de líneas: de −5 a **−8**.
Ninguna línea de Eventos estaba en las tablas de reescritura; sí en el inventario y en los recuentos: fuera de ambos.

### 7.1 Tumbadas (se queda el texto de hoy, o no se añade nada)

| Id | Lo que proponía la revisión 1 | Por qué cae |
|---|---|---|
| B22 (M2) | Aurora lee por detrás del adhesivo: «Seis años leyéndote. Sin hueco.» / Bruno: «"Sin hueco". Creo que es un piropo.» | Alguien que lleva seis años leyendo a Bruno es exactamente la revelación de la abuela, dicha media hora antes. Y no admite el arreglo «ha leído la pieza de hoy»: ocurre tras D1 (paso 26-32) y la pieza se escribe en el 34. Sustituido por el faldón leído (§4.4.2). |
| B23 | Epílogo: «Página 7. Sin un anuncio. Y sin tu conclusión, cariño. Era lo mejor.» | Es una lectora elogiando la pieza entera cuarenta segundos antes de Yoli («Se ha leído tu opa entera») y de la abuela. Compite. Se queda el de hoy, que es eje y no añade línea. |
| B7 | `attackText.R04`: «Hazlo tú, que escribes divinamente. Lo sé: te leo. Entero.» | «Te leo» es la frase de la abuela. Además el duelo debe ser todo eje. Se queda «…Entre tus párrafos caben tres banners.» |
| B11 | `onWin`: «…Sin un banner. Me duele. Las leeré.» | Promete leer a Bruno. Se queda la de hoy (y no rompe `test-comedia-p4.mjs:369`). |
| B1 | Mirar en la Sala: «…En el planillo, leyendo la web entera. Con el dedo.» | En la Sala manda el eje (es la escena del duelo); la tableta llena de anuncios es el personaje a primera vista. |
| B6 | Murmullo de la Sala: «(lee el orden del día) Punto tres... Me lo he leído. Mercados, no.» | Sustituía «Entre esta silla y aquella cabe un banner», que es literalmente la orden del dueño. |
| B8 | `taunt`: «Eso salió ayer en la página 3. Mejor escrito.» | Lectora en el duelo; y la burla de hoy («sin anuncio no es contenido») es eje puro. |
| B18 | Árbol, opción de la abuela: «Las pensiones, tras el segundo colchón. Línea cuatro. Me las sé todas.» | Maripaz sabiéndose lo que lee la abuela, en la única opción que nombra a la abuela: pisa el final. La de hoy («Ahí, entre los colchones») es mejor gag. |

### 7.2 Las diez mejoras más relevantes (antes → después)

| Id | Revisión 1 | Revisión 2 | Por qué |
|---|---|---|---|
| B21 | (Bruno, igual que hoy) «De Comercial. Mi pieza, con un faldón de Siestatón. Más largo que la pieza.» + línea nueva de Bruno con el eslogan + Teodoro cambiado a «Quien escribió eso se leyó la pieza entera. Devuelto igual.» | Bruno: «Mi pieza, con faldón de Comercial: «¿La opa le quita el sueño? Siestatón».» Teodoro, intacto. | Es el M2 nuevo, saldo 0: Maripaz ha leído la pieza de hoy y lo dice con un eslogan. Teodoro conserva su mejor línea y su voz (telegrama, sin sujeto). |
| B24 (M1) | «Línea nueve: … Al lado, uno de alarmas.» / «Y la conclusión es lo mejor. Que no te la quiten.» / «…Yo sí la leía. Era mi hueco de cierre.» | «Línea nueve: «Hidrovoltia, a por el Robledal». Quita el sueño. Siestatón.» / «Y la conclusión vale un faldón entero. Que no te la recorten.» / «…Era mi hueco de cierre. Lo daba por vendido.» | Fuera la ternura («es lo mejor», «yo sí la leía»): tasación en vez de elogio. Y «alarmas» no venía a cuento de una opa; «quita el sueño» sí, y lo paga el faldón. |
| U28 | «No pienso pegar a una cafetera. Tiene wifi. Y rencor.» | «Ni la rozo. En la pantalla ya pone: «ANOTADO».» | El callback gastaba «TENGO WIFI Y RENCOR» (de lo mejor del juego según la crítica) y podía oírse antes que el original, dos veces (Empujar y Tirar). Ahora el rencor se ve, no se dice. |
| U33 | «Cero. Diecinueve años en cero. Eso se... Se ha conseguido. Entre todos.» | «Cero. Los marrones se... se reparten. Muy bien repartidos.» | El chiste de Gervasio es que delega; «entre todos» no lo decía. Y quita un «Diecinueve años», que ya suena cuatro veces. |
| N29 | «Las plazas se sortean. El último sorteo fue en 1987.» | «Aquí una plaza se abre cuando alguien se jubila. Nadie se jubila.» | El garaje es una herencia en todo el juego (Evaristo: «sucesión en disputa»; Celestino: «línea de sucesión»; el epílogo regala la plaza 1). El sorteo lo contradecía. |
| Q6 | Paco: «Café sin ticket. Estado: rumor. ...Me lo bebo igual.» | «Café sin ticket. Estado: rumor. Olor: confirmado.» | `dar:cafe` no consume el café, que además es el de Aurora: «me lo bebo» mentía al jugador sobre su inventario. |
| Q8 | Leoncio: «…En Bolsa, a eso lo llaman burbuja.» | «Un quesito que suma 130 %. Yo los hacía de 100. Vieja escuela.» | Bolsa es Ramírez. Leoncio habla de su oficio en pasado y se cuelga la medalla (§2.3 del plan). |
| N13 | «Está colgado a la altura de los bigotes de antes. No llego.» | «No hace falta. La réplica ya me la sé. El marco, que se quede.» | La crítica 3 (n.º 3) manda mover el fax enmarcado: una línea que depende de su altura se rompe en cuanto se implemente eso. La nueva, además, orienta (la réplica ya está aprendida). |
| U41 | Anselmo: «¡Quieto! Ese tiene permiso. Por los tacos del 8.» | «¡Quieto! Es de fuera, pero trae tacos del 8. Tiene permiso.» | Sin «de fuera» se perdía la lógica de Anselmo (pregunta de dónde viene). |
| U5 | ELIMINAR la respuesta de Cerrar por defecto | «Ya está cerrado. Hasta en eso llego tarde.» | Dos ELIMINAR de la tabla (U14, N22) mandan más objetos a Cerrar por defecto: quitarle además una de cinco respuestas era volver al bucle que la crítica señala. |

Otras mejoras con el mismo criterio: U1/U1b (la rebaja de Bruno vuelve: «Por fin algo que sé hacer.»), U25 (vuelve la
siembra «no sé quién es» Rubén), N21 (Íñigo reencuadra: «Cuidado, que es una licencia… Una inversión.»), N14 (sin
«media hora», vale a cualquier hora del juego), N15 (la pista de la regleta, explícita), N20 (fuera el tercer «No voy a
ser yo»), P1 y Q4 (fuera el «Con sello» repetido), N16 y F11 (fuera arranques «Lo empujo.» duplicados), B4 («¡Quieto!»
es de Anselmo), B10 (el objeto equivocado orienta hacia el sello), B13 (la contestación retuerce la frase de Bruno,
como las de los otros rivales), B15 (vale para cualquier objeto, no solo los que tienen etiqueta), N1 (Teodoro mide la
esquela), U22 (el yogur caducado paga «sigue desayunando»).

### 7.3 Los 27 recortes: remate comprobado

Cada REC se ha leído en su escena. Remate en la última frase: U2 «Menta.», U3 «Las demás no las escribí.», U11 «se cae
la mesa», U19 «Suspira.», U20 «Es un arco.», U21 «Cede.», U24 «despido procedente», U29 «Está validado.» (paga el Mirar
«Se nota que lo ha validado»), U35 «Está donde dice que está.», U36 «son chaquetas», U38 «Ramírez, el de Bolsa.» (paso
10, descriptiva a propósito), U42 «mirando a Herminia trabajar», N6 «Y bien puesta.», P1 «Lo pongo en «logros».», P7
«ni una cifra», P10 «Lo enmarco.», Q2 «no hay quien lo selle», Q3 «Y no desgrava.», Q4 «Lo dijo ella.», Q5 «Ni lo
mido.», Q7 «Le tenemos» (el leísmo: es Rubén), Q9 «Consultoría.», Q10 «Pruebas, no se aceptan.», F15 «Y LA AMORTIZA»,
X2 (la sigue la enumeración de Begoña). Remate en la línea siguiente de la misma escena: U34 («Y en nuestros corazones,
Rubén está en HECHO.») y P2 («Se oye la moqueta.»). Los cuatro que no lo tenían (U16, U26, U27, U44) ya no son REC.

### 7.4 Las tres dudas del autor

- **U33** (Gervasio, «¿Cuántos marrones lleva este año?»): resuelta en §7.2.
- **N7** (Begoña, Usar el móvil): la de la revisión 1 («¿Con qué impreso ha pedido usted tener cara?») hay que leerla
  dos veces. El chiste bueno era el original (fotos → fotocopias); se conserva sin el molde y con su triplicado:
  «¿Fotos? En esta ventanilla, fotocopias. Por triplicado.»
- **Q10** (Dar cualquier cosa al buzón de sugerencias): «No cabe por la ranura» es falso para objetos pequeños (el
  chicle). El remate bueno era el del original («no se aceptan pruebas»): «Es un buzón de sugerencias. Pruebas, no se
  aceptan.»

### 7.5 Decisión sobre M2 y el epílogo (para el director)

Juzgado en frío, el riesgo no era pequeño: Yoli dice de la abuela «Una. Pero se lo lee TODO.» y la abuela «Yo te leo
todas las mañanas»; un adhesivo que dice «Seis años leyéndote» y un epílogo que echa de menos la conclusión adelantan
las dos frases. Por eso: **M2 retirado** y sustituido por el faldón (Maripaz leyó la pieza de hoy, lo dice con un
eslogan, cero líneas nuevas, cero ternura); **epílogo de Maripaz sin cambios**; y regla fija para quien escriba más:
Maripaz lee el periódico y la pieza, **nunca a Bruno**, y nunca dice «te leo».
