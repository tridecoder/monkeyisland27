# FE DE ERRATAS — ENMIENDA E3 (fórmulas de remate y segundo registro de Maripaz)

> Prevalece sobre `PLAN_COMEDIA.md`, E1 y E2 **solo** en lo que toca aquí: las líneas que lista, los topes nuevos de
> `tools/plan-rules.mjs` y la voz de Maripaz Remitido (que gana un segundo registro sin perder el eje de E2 §4).
> Lo demás de E2 sigue vigente. Responde a la crítica 3 (§3.1 «Molde dominante», §5.2, §5.3; cambios n.º 5 y n.º 6).
> Documento para discutir: cada decisión lleva su porqué, y las dudas que no me corresponde cerrar están en §6.

**Cómo leer las tablas.** Los números de línea son una foto del árbol de trabajo mientras escribía (otro agente está
editando `content/` a la vez y ya ha movido alguna, p. ej. `pecera.js` y `sala_amazonas.js`). **La clave es el texto
literal**: quien implemente, que busque la cadena, no la línea. Todas las cadenas «actuales» de §3 y §4 se han
comprobado por script contra el fichero (ninguna da «no encontrado»), y todas las «nuevas» pasan ≤ 80 caracteres, sin
remate «Como…», sin «(*», sin «Diseño», sin «desde [año]» y sin volver a caer en ninguna de las cinco fórmulas.

**Qué no se toca.** Eventos (`eventos.js`, `eventos.dialogos.js`) y Pilar: cero cambios; sus líneas cuentan en los
topes tal como están. El final (de «Abrígate tú.» a los créditos): intacto. Ningún flag, id, solución de puzle, mazo,
remate de duelo ni réplica cambia. Diseño e Infografía no coinciden en ninguna línea nueva; Desarrollo, igual de velado.

## Índice

- §1 Inventarios (las tres fórmulas de la crítica, la cuarta que no vio, «factur…» y un fallo del auditor)
- §2 Topes y expresiones regulares para `tools/plan-rules.mjs`
- §3 Reescrituras de fórmulas (tabla), formas usadas y las que se quedan
- §4 Maripaz Remitido: segundo registro, tabla de reescrituras y dos momentos nuevos
- §5 Saldo de líneas y ficheros afectados
- §6 Dudas abiertas para el director

---

## 1. Inventarios

### 1.1 Método

Recuento sobre **cadenas literales** de `content/` (sin `art/`, `flags.js` ni `_plantilla.js`), con el mismo
tokenizador que usa `tools/plan-rules.mjs` (`literales()`), pero **sin** su filtro de «cadenas solo ASCII» (ver §1.5).
Cada aparición cuenta, también en ramas raras; una misma cadena repetida en dos claves (`empujar` y `tirar`, dos salas)
cuenta dos veces, porque el jugador puede oírla dos veces. Comentarios fuera.

### 1.2 Resumen

| Fórmula | Crítica 3 | Recuento real hoy | Tope propuesto | Previsto tras E3 |
|---|---|---|---|---|
| «lo único / la única / el único / su única…» | ~36 | **59** | 8 | **8** |
| «X no se coge/toca/empuja… Se Y.» (negación + corrección) | ~21 | **36** | 6 | **6** |
| «primera vez» | ~12 | **13** | 4 | **4** |
| «Mi primer/a [documento, acta, firma…]» (currículum de Bruno; familia de la anterior) | — | 6 | 6 | 5 |
| **Cuarta fórmula: «No es X. Es Y.»** (reclasificación) | no la ve | **25** | 12 | **12** |
| «factur…» | 28 | **33** | 14 | **11** |
| (informativo) «Tiene más [X] que yo» | ~10 | 7 | — | 6 |
| (informativo) superlativo de lugar «lo más/mejor… de la casa / de la planta / del edificio» | — | 25 (18 de ellas con «único») | — | 6 |

**Por qué los recuentos de la crítica se quedan cortos.** «Lo único» tiene muchas formas (la única, el único, su
única, los dos únicos, ERES EL ÚNICO); «no se X. Se Y.» se esconde con dos puntos, punto y coma, coma o clíticos
(«no se le empuja. Se le espera»; «no se tocan: se rechazan»; «no se quedan, se citan»); y el auditor del repositorio
no ve las cadenas que no llevan tildes ni eñes (§1.5), que son muchas de estas.

**La cuarta fórmula.** «No es X. Es Y.» (25) es la misma máquina que «no se X. Se Y.»: negar la palabra normal y
poner la rara. Juntas suman 61 líneas que funcionan igual. Hay buenas («Eso no es una pregunta, criatura. Es una
sentencia.»; «Entonces no es una IA. Es un hobby.»), y por eso el tope no es cero, pero el molde ya se oye.
Hay además una **quinta, solapada con la primera**: el superlativo de lugar («la conversación más clara de la planta»,
«la noticia más leída del edificio», «la cifra más estable de la casa»): 25 casos, 18 de ellos con «único». Al podar
«lo único» cae solo a 6; no propongo tope propio, solo vigilarla.

### 1.3 Inventario detallado (fichero:línea, texto literal, decisión)

«Decisión» remite al identificador de la reescritura (§3, §4) o dice «se queda». Las que se quedan llevan su porqué en
§3.3.

#### lo único — 59

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
| `rooms/eventos.js:188` | La pancarta se queda. Es lo único confirmado del evento: «BIENVENIDOS». | se queda |
| `rooms/eventos.js:263` | Tienen su propio foco. Son las únicas que están listas. | se queda |
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

#### no se X. Se Y. — 36

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
| `rooms/eventos.js:310` | A Pilar no se la coge. Se la avisa con cinco minutos. | se queda |
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

#### No es X. Es Y. — 25

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
| `rooms/eventos.js:79` | Ciento doce... ciento trece. ¡No es la postura, es la silla! | se queda |
| `rooms/eventos.js:293` | Si no hay croquetas, no es un evento. Es una reunión. | se queda |
| `rooms/pajarera.js:258` | Un acta escrita por un becario no es un acta. Es un diario. | se queda |
| `rooms/pajarera.js:431` | Es un modelo muy empático. No es un armario: es un entorno de concentración. | Q7 |
| `rooms/pecera.dialogos.js:95` | Un quesito que suma 130 % no es un gráfico. Es una aspiración. | Q8 |
| `rooms/pecera.dialogos.js:169` | No es un despido: es una salida en valor. | se queda |
| `rooms/pecera.dialogos.js:220` | ...Eso no es ni hecho ni muerto. Es consultoría. | Q9 |
| `rooms/pecera.escenas.js:120` | Entonces no es una IA. Es un hobby. | se queda |
| `rooms/sala_amazonas.js:458` | ¿Ocho meses sin confirmar? Eso no es un cliente, cariño. Es un exnovio. | se queda |
| `rooms/vestibulo.js:345` | Eso no es una sugerencia. Es un objeto. Aquí no se aceptan pruebas. | Q10 |
| `rooms/vestibulo.js:469` | ¿Un táper sin nombre? Eso no es para mí. Es para alguien con hambre de verdad. | Q11 |

#### factur — 33

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
| `rooms/eventos.js:31` | Si suena, cariño, yo facturo. Es el acuerdo. | se queda |
| `rooms/eventos.js:35` | Otro, cariño. A la tercera te hago una factura proforma. | se queda |
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
tienen tope en `TOPES`/`TOPES_E2_JUEGO` y no las toco salvo «cariño», que baja de 15 a 14.

### 1.5 Un fallo del auditor que esconde fórmulas (para el integrador; no lo arreglo yo)

`tools/plan-rules.mjs`, `esTexto()`, descarta toda cadena que case con `/^[\w.:\-/ ]+$/`: la idea era saltarse ids
(`fax_enmarcado`), pero como la clase incluye el **espacio**, también descarta cualquier frase sin tildes, eñes, comas,
comillas ni signos de apertura. Ejemplos que hoy no ve ningún tope ni el control de «Como…»:
«Un fax enmarcado no se coge. Se hereda.», «Eso no lo facturo. Ni lo firmo. Ni lo entiendo.», «Eso te lo arreglo con
un pop-up. De cartulina.» y dos **remates «Como X.» vivos**: `duelo.js` «Una tarjeta sin foto. Como tu firma.» y
`administracion.dialogos.js` «Esto. Esto es una nota de gasto. Como Dios manda.» (los reescribo en §3, X1 y X2).

Arreglo propuesto: quitar el espacio de la clase (`!/^[\w.:\-/]+$/.test(t)`; los ids no llevan espacios y ya los
descarta `/\s/`). Comprobado: con el filtro corregido, los topes de E2 siguen en verde («desde [fecha]» 6/6, «Emoji de
fuego» 8/8, «pop-up» 5/8, «interstitial» 1/2), pero aparecen tres «vetadas» falsas en `lib/edificio.js` (los campos
`apodo: 'la Pecera'`, `'la Catacumba'`, `'el Ecosistema'`, datos internos): hay que exceptuar ese campo o ese fichero.

---

## 2. Topes y expresiones regulares

Se añaden a `TOPES_E2_JUEGO` (cuentan en **todas** las cadenas de `content/`, como «desde [fecha]»). Las de Eventos
cuentan (no pongo `fuera`): la sala protegida aporta 2 «lo único», 1 «no se X. Se Y.», 2 «No es X. Es Y.» y 2
«factur»; los topes ya las descuentan. Probadas con Node sobre el árbol actual y sobre una copia con todas las
reescrituras de este documento aplicadas (columna «tras E3»).

```js
// ENMIENDA E3 §2 · fórmulas de remate (en todo el juego; flags `u` para que «ÚNICO» y las tildes cuenten)
{ re: /(?<!\p{L})(?:lo|la|el|los|las|su|sus|mi|mis)\s+(?:\p{L}+\s+)?únic[oa]s?(?!\p{L})/giu, max: 8,
  txt: '«lo único / la única…» (E3 §2)' },                                                   // hoy 59 → 8
{ re: /\bno se (?:l[aeo]s? |me |te )?\p{L}+(?: \p{L}+){0,5}\s*[.:;,]\s*(?:y )?se (?:l[aeo]s? |me |te )?\p{L}+/giu, max: 6,
  txt: '«X no se coge. Se Y.» (E3 §2)' },                                                    // hoy 36 → 6
{ re: /\bprimera vez\b/gi, max: 4, txt: '«primera vez» (E3 §2)' },                            // hoy 13 → 4
{ re: /\bmi primer[oa]?\b/gi, max: 6, txt: '«Mi primer/a…» (E3 §2)' },                        // hoy 6 → 5
{ re: /\bno (?:es|son|era)\s[^.!?;:]{1,45}[.:;,]\s*(?:es|son|era)\s/giu, max: 12,
  txt: '«No es X. Es Y.» (E3 §1, cuarta fórmula)' },                                         // hoy 25 → 12
{ re: /factur/gi, max: 14, txt: '«factur…» (E3 §4)' },                                        // hoy 33 → 11
```

**Por qué esos números.**
- «lo único» ≤ 8: el encargo. Me quedo con 6 fuera de Eventos (§3.3) y Eventos aporta 2: justo 8. Si el director
  prefiere margen, bajo dos más (candidatas: Evaristo, `administracion.js`, y Paco, `cpd.js`), no subo el tope.
- «no se X. Se Y.» ≤ 6 (la crítica pedía ≤ 5): con Eventos dentro, 5 propias + 1 protegida. Si se pone `fuera`
  para Eventos, el tope pasa a 5 sin tocar una línea más.
- «primera vez» ≤ 4: la crítica dice que funciona en el epílogo; dejo las cuatro que son golpe y no tic (§3.3).
- «Mi primer/a» ≤ 6: es el «autoengaño de currículum» de Bruno (§2.3 del plan), que es bueno; el tope solo impide que
  crezca. Arreglo de paso un doblete real: «Mi primer documento oficial» lo decía dos veces (móvil y RECHAZADO).
- «No es X. Es Y.» ≤ 12: la cuarta fórmula. Doce es «una por sala y poco más»; se queda la mejor de cada voz.
- «factur…» ≤ 14: el encargo. Quedan 11, con margen de 3 para que Maripaz tenga su condimento sin pedir permiso.
- **Recomendado además**: el arreglo de `esTexto()` de §1.5. Sin él, estas expresiones no ven 19 de las 36 «no se X.
  Se Y.», 4 de las 25 «No es X. Es Y.», 3 «primera vez» y 9 «factur»: los topes saldrían en verde mintiendo.

---

## 3. Reescrituras de fórmulas

### 3.1 Formas usadas (leyenda y recuento)

Ninguna forma nueva pasa de 6. **ELIM** (se elimina la línea; el verbo cae en la respuesta por defecto o la escena
pierde una línea) y **REC** (recorte: se quita la frase-fórmula y queda la situación, que ya era el chiste) **no son
formas nuevas**: son el «recorte, bienvenido» del encargo. Si el director cuenta REC como forma, ver §6.1.

| Código | Forma | Usos |
|---|---|---|
| CAL | Callback: cita algo que el jugador ya ha visto (el velero, «TENGO WIFI Y RENCOR», los bigotes, «Lleva tres semanas asintiendo», la 247, el CC que crece) | 6 |
| PRE | Precisión absurda (cifras, fechas, tamaños exactos) | 6 |
| DET | Detalle concreto que solo ve quien mira | 6 |
| LOG | Lógica propia del personaje (Teodoro mide, Anselmo reclama la propiedad, Custodia deniega, Paco sin ticket no ve) | 6 |
| ACC | Acción con consecuencia / silencio: el objeto o el PNJ hace algo y no hay remate verbal | 6 |
| CSQ | Consecuencia absurda («si le empujas, pasa a la diapositiva 248») | 6 |
| PIS | Pista escondida (la línea ayuda a resolver algo) | 5 |
| REG | Respuesta fuera de registro (esquela, locutor deportivo, jerga de Bolsa, caso de éxito) | 5 |
| COR | Cortesía con el objeto | 4 |
| PRG | Pregunta que no espera respuesta | 4 |
| REB | Rebaja / anticlímax | 3 |
| LIT | Literalidad (y juego de palabras de oficio: «Sin cara no hay cuerpo») | 3 |
| AUT | Autoengaño de currículum (Bruno) | 2 |
| INT | Autointerrupción (Gervasio se corta y se lo da al «se») | 2 |
| TRES | Lista de tres con el tercero torcido (Begoña, dictamen numerado) | 1 |
| FAL | Dato falso dicho con seguridad | 1 |
| CON | Contradicción inmediata (dice que no existe y se lo bebe) | 1 |
| INV | El personaje contra su propio tic (Rubén no quiere que le titulen) | 1 |
| REC | Recorte (no es forma) | 31 |
| ELIM | Eliminación (no es forma) | 15 |

### 3.2 Tabla de reescrituras

U = «lo único», N = «no se X. Se Y.», P = «primera vez», Q = «No es X. Es Y.», F = «factur…» fuera de Maripaz,
X = «Como X.» que esconde el auditor. Las de Maripaz van en §4 (B1-B24) aunque también cuenten aquí.

| # | Fichero:línea | Texto actual | Texto nuevo | Forma | Nota |
|---|---|---|---|---|---|
| U1 | `actors.js:212` | Respondo a todos. Es lo único que sé hacer bien. | Respondo a todos. Con copia a toda la empresa. | CAL | también pistas.js (misma cadena, meta del clímax); callback al CC que crece en el duelo |
| U1b | `pistas.js:29` | Respondo a todos. Es lo único que sé hacer bien. | Respondo a todos. Con copia a toda la empresa. | =U1 | gemela de U1 |
| U2 | `actors.js:227` | Chof, chof... Menta. Lo único de esta casa que no caduca. | Chof, chof... Menta. | REC | murmullo de Celestino: el chicle ya es el chiste |
| U3 | `escenas/climax.js:86` | Es la única que hay. Las demás no las escribí. | Es la que hay. Las demás no las escribí. | REC | Gervasio; el chiste es la segunda frase |
| U4 | `escenas/climax.js:227` | Sin Lector Medio no hay plan. Era mi único dato. | Sin Lector Medio no hay plan. Era toda mi muestra. | PRE | Íñigo: estadística de N = 1 |
| U5 | `game.js:22` | Ya está cerrado. Aquí lo único que no cierra a tiempo es la edición. | **(se elimina)** | ELIM | rotación de Cerrar por defecto: quedan cuatro |
| U6 | `rooms/administracion.js:139` | Carpetas: «CONTRATOS (LEÍDOS)». La única estantería sincera de la casa. | Carpetas: «CONTRATOS (LEÍDOS)». Y es verdad: están subrayados. | DET |  |
| U7 | `rooms/catacumba.js:474` | La máquina de Leoncio respeta el cuerpo 9. Es la única. | La máquina de Leoncio respeta el cuerpo 9. Lo he medido. Nueve. | LOG | Teodoro mide |
| U8 | `rooms/catacumba.js:672` | No. Es la única boca de Teodoro. Y muerde. | **(se elimina)** | ELIM | Empujar el fax: cae en el defecto |
| U9 | `rooms/catacumba.js:699` | No. Llevan cuarenta años colgadas. Es la única antigüedad que se respeta. | No. Llevan cuarenta años colgadas. Debajo, la pared es de otro color. | DET |  |
| U10 | `rooms/catacumba.js:730` | Ese libro no se mueve. Es lo único que sostiene esta mesa. | Ese libro, ni tocarlo. Se consulta aquí, de pie. Con las manos limpias. | COR | Aurora; «calza la mesa» ya lo dice Empujar (`catacumba.js`, libro) |
| U11 | `rooms/catacumba.js:763` | Si la saco, se cae la mesa. Es su única función con futuro. | Si la saco, se cae la mesa. | REC | una tableta calzando una mesa ya es el chiste |
| U12 | `rooms/cpd.js:315` | El ascensor. Sube. Es lo único que sube aquí sin abrir ticket. | El ascensor. En el sótano, el «tin» suena más bajito. Por respeto. | DET | prolonga el «tin» de las otras plantas |
| U13 | `rooms/cpd.js:395` | Es la única brisa de Sistemas. Los servidores me odiarían en mi bemol. | **(se elimina)** | ELIM | Coger el ventilador: defecto |
| U14 | `rooms/cpd.js:428` | Ya está cerrado. Es lo único cerrado de todo el registro. | **(se elimina)** | ELIM | Cerrar el registro: defecto |
| U15 | `rooms/ecosistema.js:220` | Se cierra solo. Es lo único de la planta que no pide feedback. | Se cierra solo. Al rato, Marketing le pregunta qué tal la experiencia. | LOG | lógica de Marketing |
| U16 | `rooms/ecosistema.js:240` | El último paso es una interrogación. Es el único honesto. | El último paso es una interrogación. | REC | el embudo ya remata |
| U17 | `rooms/ecosistema.js:266` | Es la única cosa de la planta que sube sola. No lo toco. | **(se elimina)** | ELIM | Coger el termómetro; Empujar ya hace el chiste |
| U18 | `rooms/ecosistema.js:272` | No me llevo la pizarra. Es lo único que Marketing tiene por escrito. | No me llevo la pizarra. Si la muevo, se escapa el velero. | CAL | callback a su Mirar |
| U19 | `rooms/ecosistema.js:284` | Tiro. Suspira. Es el único de la planta que se queja con razón. | Tiro. Suspira. | REC |  |
| U20 | `rooms/office.js:223` | Más abierto no puede estar. Es un arco: lo único de esta planta sin cerradura. | Más abierto no puede estar. Es un arco. | REC |  |
| U21 | `rooms/office.js:225` | Empujo el aire del arco. Cede. Es lo único que cede en esta planta. | Empujo el aire del arco. Cede. | REC |  |
| U22 | `rooms/office.js:239` | El yogur de Ramírez no se toca. Es lo único suyo que sigue fresco. | El yogur de Ramírez caduca el lunes. Dijo que volvía antes. | PRE | paga «Ramírez sigue desayunando» |
| U23 | `rooms/office.js:241` | Mi táper se queda conmigo. Es lo único que tengo a mi cargo. | Mi táper se queda conmigo. En el currículum: «Personal a cargo: 1». | AUT | evita el doblete con «Es lo primero que tengo a mi cargo» |
| U24 | `rooms/office.js:264` | Hay cola. Colarse en el microondas es lo único que aquí es despido procedente. | Hay cola. Colarse aquí es despido procedente. | REC |  |
| U25 | `rooms/office.js:287` | Si me la llevo, Rubén pierde su única firma. Y no sé quién es. | Si me la llevo, Rubén se queda sin firma. Y sin «todavía aquí». | PIS | pista: Rubén sigue en el edificio |
| U26 | `rooms/office.js:292` | Lo releo. Sigue a 1,20 €. Es la única cifra estable de la casa. | Lo releo. Sigue a 1,20 €. | REC |  |
| U27 | `rooms/office.js:299` | Ya está limpio. Es el único táper limpio del edificio. No lo estropeo. | Ya está limpio. No lo estropeo. | REC |  |
| U28 | `rooms/office.js:345, 346` | No pienso pegar a una cafetera. Es la única que trabaja de noche. | No pienso pegar a una cafetera. Tiene wifi. Y rencor. | CAL | Empujar y Tirar (dos claves, misma cadena); cita «TENGO WIFI Y RENCOR» |
| U29 | `rooms/pajarera.js:317` | ¿El informe en blanco? Es lo único validado de esta planta. Se queda. | ¿El informe en blanco? Se queda. Está validado. | REC |  |
| U30 | `rooms/pajarera.js:327` | Es el único mueble de los Despachos sin pósit. No pienso estropearlo. | **(se elimina)** | ELIM | Coger el perchero |
| U31 | `rooms/pajarera.js:387` | No. Es la única autoridad de esta planta. Si se cae, se cae todo. | No. Si se cae, se cae todo. Y todavía no toca. | PIS | conserva la pista del ¡PLOF! del clímax y añade «aún no» |
| U32 | `rooms/pajarera.js:389` | No puedo llevármelo. Es el único lector que nunca se da de baja. | No me lo llevo. Lleva tres semanas asintiendo. Se ha ganado el sitio. | CAL | cita a Íñigo («Lleva tres semanas asintiendo») |
| U33 | `rooms/pajarera.js:476` | Cero. Diecinueve años en cero. Es mi único dato bueno. | Cero. Diecinueve años en cero. Eso se... Se ha conseguido. Entre todos. | INT | Gervasio se corta y se lo da al «se» |
| U34 | `rooms/pecera.dialogos.js:232` | El tablero va conectado al registro de Paco. Lo único integrado de la casa. | El tablero va conectado al registro de Paco. | REC |  |
| U35 | `rooms/pecera.js:161` | No se mueve. Es lo único de esta planta que está donde dice que está. | No se mueve. Está donde dice que está. | REC |  |
| U36 | `rooms/pecera.js:185` | Los dos únicos que quedan. Están de guardia. Lo demás son chaquetas. | Siguen tecleando. De guardia. El resto de la planta son chaquetas. | REC |  |
| U37 | `rooms/pecera.js:211` | Está atornillada a la pared. Es lo único fijo de esta planta. | Está atornillada a la pared. Y Yoli, a la pantalla. | DET |  |
| U38 | `rooms/pecera.js:320` | La única silla libre. Tiene una chaqueta: Ramírez, el de Bolsa. | Una silla libre. Tiene una chaqueta: Ramírez, el de Bolsa. | REC | descriptiva (paso 10); no es chiste, pero cuenta en el tope |
| U39 | `rooms/pecera.js:394` | No. Es lo único que les mide sin que se enfaden. | No. Es de Prevención. El pósit, mío. | LOG | Anselmo: no · motivo · propiedad |
| U40 | `rooms/pecera.js:411` | Déjala. Es lo único ordenado del rincón. Y no es nuestro. | Déjala. Está ordenada. Se nota que no es nuestra. | LOG | Anselmo |
| U41 | `rooms/pecera.js:434` | ¡Quieto! Es lo único de fuera que dejo entrar. Por los tacos. | ¡Quieto! Ese tiene permiso. Por los tacos del 8. | PRE | Anselmo |
| U42 | `rooms/pecera.js:517` | No. Está mirando a Herminia trabajar. Es lo único que hace. | No. Está mirando a Herminia trabajar. | REC |  |
| U43 | `rooms/pecera.secretaria.js:120` | No existe. Por eso es la única bandeja que no se atasca. | No existe. Y tiene lista de espera. | LOG | Custodia |
| U44 | `rooms/sala_amazonas.js:280` | Apagada. Solo el piloto rojo, en reposo. Lo único que descansa aquí. | Apagada. Solo el piloto rojo, en reposo. | REC |  |
| U45 | `rooms/sala_amazonas.js:372` | Se lo enseño. Asiente. Asiente a todo: es su único dato. | Se lo enseño. Asiente. Antes le ha asentido al proyector. | DET |  |
| U46 | `rooms/vestibulo.js:347` | Está atornillado. Es lo único de esta casa que tiene estabilidad. | Está atornillado. Más fijo que la plantilla. | REB |  |
| U47 | `rooms/vestibulo.js:361` | Se cierra solo. Es lo único automático del edificio. Bueno, y Gertrudis. | Se cierra solo. Celestino lo narra: «¡Y cierra! ¡Y cierra!». | REG | registro de locutor deportivo |
| U48 | `rooms/vestibulo.js:392` | No. Es la única que ha sobrevivido a todos los ERE. | No. Ha sobrevivido a tres ERE. No voy a ser yo el cuarto. | PRE |  |
| U49 | `rooms/vestibulo.js:428` | Es la única rama del organigrama que está recta. La dejo. | **(se elimina)** | ELIM | Empujar la rama |
| N1 | `duelo.js:87` | LOS MUERTOS NO SE FAXEAN. SE ENTIERRAN EN CUERPO 9. | DESCANSE EN PAZ. ERA DE AURORA. GASTADO HASTA EL FINAL. | REG | registro de esquela; cita a Custodia |
| N2 | `rooms/administracion.js:64` | El pasillo no se empuja. Se recorre. Con número de turno. | **(se elimina)** | ELIM |  |
| N3 | `rooms/administracion.js:93` | Eso es patrimonio. Esas notas no se tocan: se rechazan. | Uno: es patrimonio. Dos: ya están rechazadas. Tres: esas manos. | TRES | Begoña, dictamen numerado |
| N4 | `rooms/administracion.js:108` | La ventanilla no se abre. Se atiende por el agujerito, como manda la norma. | ¿Abrirla? Por el agujerito cabe un impreso doblado en tres. Usted, no. | PRE | Begoña |
| N5 | `rooms/administracion.js:134, 202` | A don Evaristo no se le empuja. Se le espera. | Ni se le ocurra. Si le empuja, vuelve a empezar la cláusula 12. | CSQ | dos claves (cristal y Evaristo), misma cadena |
| N6 | `rooms/administracion.js:147` | Una coma no se usa. Se pone en su sitio. Y ella ya está. | Ya está en su sitio. Y bien puesta. | REC |  |
| N7 | `rooms/administracion.js:180` | Aquí no se hacen fotos. Se hacen fotocopias. | ¿Una foto? ¿Con qué impreso ha pedido usted tener cara? | PRG | Begoña |
| N8 | `rooms/administracion.js:181` | A Begoña no se la empuja. Se la tramita. | Me pongo detrás para empujarla. Me da número de turno. El uno. | ACC |  |
| N9 | `rooms/catacumba.js:276` | Lo pienso. Un fax mal marcado no se borra. Se archiva. | Lo pienso. En este fax, un número mal marcado también llega. A otro. | CSQ |  |
| N10 | `rooms/catacumba.js:385` | La nota te la devuelvo; las fuentes no se quedan, se citan. | Te devuelvo la nota. Una fuente se cita y se devuelve: es prestada. | COR | Aurora, paso 30: no cambia lo que pasa |
| N11 | `rooms/catacumba.js:451` | Ya está citada, criatura. Una fuente no se cita dos veces; se gasta. | Ya está citada, criatura. Dos veces sería abusar de su confianza. | COR | Aurora |
| N12 | `rooms/catacumba.js:628` | No. Las galeradas no se tiran: se curan. | **(se elimina)** | ELIM |  |
| N13 | `rooms/catacumba.js:708` | Un fax enmarcado no se coge. Se hereda. | Está colgado a la altura de los bigotes de antes. No llego. | CAL | cita «El bigote también era de plantilla» |
| N14 | `rooms/catacumba.js:793` | No se empuja a un jefe de cierre. Se le entrega a tiempo. | ¿Empujar al jefe de cierre a media hora del cierre? ¿Y quién cierra? | PRG |  |
| N15 | `rooms/cpd.js:381` | Lo que lleva brida no se coge. Se respeta. O se desenchufa. | Lleva brida. Cogerla, no. Tirar del enchufe ya es otra conversación. | PIS | conserva la pista de la regleta R-3 (paso del apagón) |
| N16 | `rooms/cpd.js:464` | A Paco no se le empuja. Se le apunta en la cola. Y se espera. | Lo empujo. Paco ni se gira. Escribe algo. Creo que ya consto. | ACC |  |
| N17 | `rooms/ecosistema.js:221` | No se empuja. Se activa. Lo dice el vinilo. | **(se elimina)** | ELIM | Empujar el ascensor de Marketing |
| N18 | `rooms/ecosistema.js:282` | Un puf no se coge. Se adopta. Y no tengo piso. | Lo cojo. Lo abrazo. Lo dejo. No tengo piso. | ACC |  |
| N20 | `rooms/office.js:376` | Gervasio no se coge. Se le espera. Él también espera algo. No sabe qué. | Gervasio espera algo. No sabe qué. No voy a ser yo quien se lo dé. | REC |  |
| N21 | `rooms/pajarera.js:313` | No se coge. Se licencia. Cuarenta y ocho mil al mes. | Quieto. Eso es una licencia. Cuarenta y ocho mil al mes. | REC | conserva la cifra (siembra de la coma) |
| N22 | `rooms/pecera.js:141` | Ya está cerrada. En los Despachos las puertas no se cierran: se delegan. | **(se elimina)** | ELIM |  |
| N23 | `rooms/pecera.secretaria.js:46` | La memoria no se rellena. Se gana. | **(se elimina)** | ELIM | segunda línea; queda «Begoña tiene formularios. Yo tengo memoria.» |
| N24 | `rooms/pecera.secretaria.js:157` | Aquí no se coge nada. Se merece. | ¿Y usted qué ha merecido hoy. | PRG | Custodia: pregunta que acaba en punto; el cartel ya dice «SE MERECE» |
| N26 | `rooms/sala_amazonas.js:369` | Es más alto que yo y tiene más autoridad. No se coge: se consulta. | Lo levanto un poco. Pesa lo que un folio. Asiente igual. | DET | también quita un «más X que yo» |
| N27 | `rooms/sala_amazonas.js:393` | A un consultor no se le empuja. Se le factura. Y eso ya lo hace él. | No. Está presentando. Si le empujo, pasa a la diapositiva 248. | CSQ | paga el estado `diapo_248`; −1 «factur» |
| N28 | `rooms/vestibulo.js:372` | Una escalera no se empuja. Se sube. Si te deja el torno. | **(se elimina)** | ELIM |  |
| N29 | `rooms/vestibulo.js:442` | Las plazas no se abren. Se heredan. | Las plazas se sortean. El último sorteo fue en 1987. | FAL | deja «Se heredan» solo a la silla de Ramírez |
| N30 | `rooms/pajarera.js:398` | Un consultor no se empuja. Te factura el empujón y el desplazamiento. | Lo empujo. Se deja. Me da las gracias por el feedback. | CSQ | variante «Te…»; −1 «factur» |
| P1 | `rooms/administracion.dialogos.js:79` | He hecho un trámite bien. Primera vez. Lo pongo en «logros». | He hecho un trámite bien. Lo pongo en el currículum. Con sello. | AUT |  |
| P2 | `rooms/ecosistema.js:36` | Cerrado. Por primera vez desde las seis. | Cerrado. | REC | sigue «Se oye la moqueta.» |
| P3 | `rooms/ecosistema.js:116` | Me pongo delante. El aro me ilumina. Salgo favorecido por primera vez. | Me pongo delante. El aro me ilumina. Se me ven seis años de ojeras. | REB |  |
| P5 | `rooms/pajarera.js:338` | "LIBRE". Es la primera vez que lo veo. | "LIBRE". Me lo creo a medias. | REB |  |
| P6 | `rooms/pecera.js:159` | Un punto rojo: «ESTÁ AQUÍ». Es la primera vez que algo me ubica. | Un punto rojo: «ESTÁ AQUÍ». Gracias. Me hacía falta. | COR |  |
| P7 | `rooms/pecera.js:209` | Le hablo. Está apagada. Es la primera vez que no me contesta con una cifra. | Le hablo. Está apagada. No me da ni una cifra. | REC |  |
| P8 | `rooms/pecera.js:395` | "Shhh", le digo. Es la primera vez que alguien le da la razón. | "Shhh", le digo. Se pone verde un segundo. Luego, rojo otra vez. | ACC | opcional: `setState(semaforo_ruido, verde)` 1 s y vuelta a rojo |
| P9 | `rooms/sala_amazonas.js:327` | No, no. El acta es tuya. Yo ya cumplí. Por primera vez. | No, no. El acta es tuya. Yo ya... Se ha cumplido. | INT | Gervasio |
| P10 | `lib/movil.js:29` | «Pensar no es deducible». Lo enmarco. Mi primer documento oficial. | «Pensar no es deducible». Lo enmarco. | REC | deshace el doblete con el RECHAZADO de Begoña («Mi primer documento oficial. Con sello.») |
| Q1 | `actors.js:397` | Plaza 3, sucesión en disputa. Esto no es un garaje. Es una herencia. | Plaza 3, sucesión en disputa. Tres herederos. Ningún coche. | PRE | murmullo de Evaristo |
| Q2 | `rooms/administracion.dialogos.js:65` | ¿Custodia? No es burocracia, niño. Es temperamento. | ¿Custodia? Temperamento, niño. Eso no hay quien lo selle. | REC | funde las dos líneas: se elimina «Eso no se sella.» (−1) |
| Q2b | `rooms/administracion.dialogos.js:65` | Eso no se sella. | **(se elimina)** | ELIM | ver Q2 |
| Q3 | `rooms/administracion.dialogos.js:90` | Eso no es representación. Es autoestima. Y no desgrava. | Eso es autoestima. Y no desgrava. | REC |  |
| Q4 | `rooms/administracion.js:95` | Las mías no son de pared. Son de archivo personal. Lo dijo ella. | Las mías van al archivo personal. Lo dijo ella. Con sello. | REC |  |
| Q5 | `rooms/catacumba.js:308, 791` | Eso no es mío. Es de Controlling. Lo respeto. | De Controlling. Ni lo mido. Lo respeto. | REC | dos claves (paso 32 y Dar), misma cadena |
| Q6 | `rooms/cpd.js:457` | ¿Tiene número de ticket? Pues no es un café: es un rumor. | Café sin ticket. Estado: rumor. ...Me lo bebo igual. | CON | Paco |
| Q7 | `rooms/pajarera.js:431` | Es un modelo muy empático. No es un armario: es un entorno de concentración. | Es un modelo muy empático. Le tenemos en un entorno de concentración. | REC |  |
| Q8 | `rooms/pecera.dialogos.js:95` | Un quesito que suma 130 % no es un gráfico. Es una aspiración. | Un quesito que suma 130 %. En Bolsa, a eso lo llaman burbuja. | REG | Leoncio |
| Q9 | `rooms/pecera.dialogos.js:220` | ...Eso no es ni hecho ni muerto. Es consultoría. | ...Ni hecho ni muerto. Consultoría. | REC | Anselmo, vía 3 del álbum |
| Q10 | `rooms/vestibulo.js:345` | Eso no es una sugerencia. Es un objeto. Aquí no se aceptan pruebas. | No cabe por la ranura. Aquí las sugerencias tienen que ser finas. | LIT |  |
| Q11 | `rooms/vestibulo.js:469` | ¿Un táper sin nombre? Eso no es para mí. Es para alguien con hambre de verdad. | ¡Táper rechazado! ¡Ese táper busca a alguien con hambre de verdad! | REG | Celestino locutor; conserva la pista (Rubén) |
| F1 | `duelo.js:91` | Si me grabas, te facturo los derechos de imagen. | Grábame. Lo subimos como caso de éxito. Tú sales en «aprendizajes». | REG | Íñigo, objeto equivocado en D4 |
| F2 | `duelo.js:94` | ¿Un manual? Yo no leo manuales: los facturo. | ¿Un manual? Nosotros lo resumimos en una diapositiva. La 247. | CAL | Íñigo |
| F3 | `game.js:19` | No. Si le doy eso, me pide factura. | No. Aquí los regalos vuelven con acuse de recibo. | LIT | rotación de Dar por defecto |
| F4 | `game.js:24` | Mejor no. Si viene con cable, Paco me lo factura. | Mejor no. Todo lo que tiene cable acaba en Sistemas. Y yo detrás. | CSQ | rotación de Tirar por defecto |
| F5 | `rooms/administracion.js:194` | «Asignado a: Titulator 3000». ¿Facturamos a un ticket? Lo apunto. | «Asignado a: Titulator 3000». ¿Y a quién se lo reclamo? ¿Al enchufe? | PRG | Evaristo |
| F6 | `rooms/catacumba.js:271` | Ya está recortada. Si la vuelvo a enviar, me la facturan dos veces. | Ya está recortada. Si la vuelvo a enviar, Begoña recorta el recorte. | CSQ |  |
| F7 | `rooms/catacumba.js:716` | Ya está pagada. Es la factura más sentimental de la casa. | La toco. Teodoro carraspea por el fax. La dejo donde estaba. | ACC | también quita un superlativo de «la casa» |
| F8 | `rooms/cpd.js:254` | Comer algo que no sea atún. Y que no me lo facture nadie. | Comer algo que no sea atún. Y que nadie me lo titule. | INV | Rubén contra su propio tic |
| F9 | `rooms/cpd.js:275` | (Despachos) «Amarillo, facturación. Verde, oportunidades...» | (Despachos) «Amarillo, prescindible. Verde, prescindible pero barato...» | PIS | siembra «Prescindible. Caro.» del clímax |
| F10 | `rooms/cpd.js:339` | Lo alquiló el consultor. Yo ahí no entro, que me factura. | Lo alquiló el consultor. Sin ticket. Para mí, ese armario no existe. | LOG | Paco |
| F11 | `rooms/cpd.js:346` | Si lo empujo, se enfría el modelo. Y luego me lo factura. | Lo empujo. Pesa más de lo que debería pesar un armario de servidores. | PIS | Rubén dentro (vale también vacío: los servidores) |
| F15 | `rooms/pajarera.js:32` | UNA COMERCIAL SE QUEDA SOLA EN UNA REUNIÓN. Y FACTURA LA SALA | UNA COMERCIAL SE QUEDA SOLA EN UNA REUNIÓN. Y LA AMORTIZA | REC | titular; cita «La amortizo» |
| F16 | `rooms/pajarera.js:304` | Me siento. Me hundo. Me levanto antes de que me lo facturen. | Me siento. Me hundo. Huele a consultor. Me levanto. | ACC |  |
| F19 | `rooms/vestibulo.js:274` | Si lo empujo, se reestructura solo. Y luego me lo facturan. | **(se elimina)** | ELIM | Empujar el organigrama |
| X1 | `duelo.js:85` | Una tarjeta sin foto. Como tu firma. | Una tarjeta sin foto. Sin cara no hay cuerpo. | LIT | Teodoro, objeto equivocado en D2: remate «Como X.» oculto |
| X2 | `rooms/administracion.dialogos.js:131` | Esto. Esto es una nota de gasto. Como Dios manda. | Esto. Esto es una nota de gasto. | REC | Begoña, paso 27: remate «Como X.» oculto; la línea siguiente ya enumera |

### 3.3 Las que se quedan y por qué

| Fórmula | Se queda | Por qué |
|---|---|---|
| lo único | Aurora: «Son cuarenta y ocho euros. Y su corbata, lo único bien puntuado de la casa.» (`catacumba.js`) | Paso 32, la coma bendecida; la crítica la cita entre lo mejor. |
| lo único | Rubén: «Te he titulado toda la noche. Perdona. Eras lo único que pasaba.» (`cpd.js`) | Momento 4.6, sale del armario: es la frase triste del juego. |
| lo único | Paco: «Lo único de esta casa que contesta a todos sin cabrearse... / ...es la respuesta automática.» (`cpd.js`) | Siembra el mejor remate de puzle (el fax gana a Teodoro con la respuesta automática). |
| lo único | Gertrudis: «LO SÉ. ERES EL ÚNICO. NO SE LO DIGAS A NADIE.» (`office.js`) | Despedida de Gertrudis; la crítica la cita. |
| lo único | Custodia: «Esto es de Aurora. Es la única que los acaba. Ha muerto trabajando.» (`pecera.secretaria.js`) | Micropuzle del boli muerto: la línea es la pista. |
| lo único | Evaristo: «...Es broma. Es lo único que sé hacer de broma.» (`administracion.js`) | La única broma de Evaristo en todo el juego; su voz amable de §0 del brief. |
| lo único | Eventos: pancarta y croquetas | Sala protegida. |
| no se X. Se Y. | «Las sillas no se cogen. Se heredan.» (`pecera.js`) | El original, el mejor según la crítica, en el paso 10. Por eso N29 deja «heredan» solo para ella. |
| no se X. Se Y. | «La ficha no se faxea. Se sella.» (`catacumba.js`) | Pista: la ficha la sella Aurora, no el fax. |
| no se X. Se Y. | «"EL MATERIAL NO SE PIDE. SE MERECE".» (cartel de Custodia) | Es el origen en el mundo: la fórmula está escrita en la pared de Custodia. Por eso N24 la deja solo en el cartel. |
| no se X. Se Y. | Leoncio: «Pasa. Aquí ya no se trabaja. Se supervisa.» | Su voz (oficio en pasado) y su saludo; se oye una vez. |
| no se X. Se Y. | Gervasio: «Aún no se le ha preguntado. Se le preguntará. En el punto cuatro.» | Técnicamente cae en la expresión, pero es el «se» impersonal de Gervasio en futuro, no el molde. |
| no se X. Se Y. | Eventos: «A Pilar no se la coge. Se la avisa con cinco minutos.» | Sala protegida. |
| primera vez | Evaristo, epílogo: «...Felicidades. Es la primera vez que lo digo sin adjunto.» | La crítica: «Funciona en el epílogo». |
| primera vez | Íñigo, clímax: «Es la primera vez que la matriz me pone en algún sitio.» | Remate del ¡PLOF! («Prescindible. Caro.»). |
| primera vez | Yoli, apagón: «Lectores... no lo sé. Por primera vez en seis años, no lo sé.» | Su momento bonito. |
| primera vez | Bruno: «Ahí estoy, en VACANTE. Es la primera vez que salgo en un organigrama.» | Remate del puzle de la foto (Vestíbulo). |
| No es X. Es Y. | «Eso no es una pregunta, criatura. Es una sentencia.» · «Eso no es entusiasmo, criatura. Es inglés.» (Aurora) · «Entonces no es una IA. Es un hobby.» (Íñigo) · «Eso no es un cliente, cariño. Es un exnovio.» (Maripaz, paso 26) · «…no es un acta. Es un diario.» (Gervasio) · «No es intuición: es fontanería.» (rejilla de Paco) · «¿«Pellizco»? Eso no es un nombre, cariño. Es un formato publicitario.» (Maripaz) · R13 «No es un despido: es una salida en valor.» ×3 (es la frase del duelo: la tienen que reconocer) · Eventos ×2 | Una por voz, la mejor de cada una; R13 es un ataque del duelo y no se toca. |
| factur… | Begoña y la factura de 48 € (clímax); Íñigo «Me fui. Y volví facturando.» (epílogo); «museo de facturas» (Administración); «Me ha facturado el recorte.» (fax, paso 35); nombre del objeto «factura del fax»; titular de Rubén «…Y FACTURA COMO UN BANCO»; «las comas de las facturas» (Íñigo sobre Evaristo); «¿Cuánto factura?» (escena 7.2: monta «Es un hobby»); Maripaz «Te la facturo» (1.er empujón, con la «tarifa plana» detrás); Eventos ×2 | Las de trama (la coma, el recorte, el armario) y una de Maripaz como condimento. |

### 3.4 Cinco notas de oficio sobre la tabla

1. **Recortar antes que reescribir.** En 31 líneas la situación ya era el chiste y la fórmula era el subrayado
   («Tiro. Suspira.»; «El último paso es una interrogación.»; «Si la saco, se cae la mesa.»). Quitar la explicación
   es la reescritura más barata y la que más se nota.
2. **Las pistas sobreviven.** Cinco líneas eran pista además de fórmula; la pista se queda en otra forma: la regleta
   (N15), el Lector Medio que «si se cae, se cae todo» (U31), Rubén «todavía aquí» (U25), el táper que busca a alguien
   con hambre (Q11) y los 48.000 € de la licencia (N21). Dos líneas nuevas siembran: el armario 27 pesa demasiado (F11)
   y la rejilla adelanta «prescindible» (F9).
3. **Los dobletes se rompen.** «Se heredan» (silla y plazas de garaje), «Mi primer documento oficial» (móvil y
   RECHAZADO), «lo que tengo a mi cargo» (táper ×2), «Se cierra solo» (dos ascensores), «la mesa se cae» (libro y
   tableta), «Aquí no se coge nada. Se merece.» (Custodia y su cartel): ahora cada uno se oye una vez.
4. **Las voces ganan.** Donde la fórmula hablaba por un personaje, la reescritura usa su manera de decidir (§2.3 del
   plan): Teodoro mide (U7, Q5), Begoña numera (N3), Custodia deniega con punto (N24, U43), Anselmo reclama propiedad
   (U39, U40), Gervasio se corta (U33, P9), Celestino retransmite (U47, Q11), Paco no ve lo que no tiene ticket (F10).
5. **Las eliminaciones caen en los defectos.** Ninguna deja un verbo mudo: los quince caen en `game.js` `DEFAULTS`
   (rotación) o en otra línea de la misma escena. Ninguna toca un paso del recorrido de 44.

---

## 4. Maripaz Remitido: segundo registro

> El eje lo ha fijado el dueño y no se mueve: **cada píxel es inventario publicitario** (branded content, «todavía
> cabe un banner», «esto te lo arreglo con un pop-up», «los interstitials son ingresos», «se ve demasiado la
> noticia»). Lo que sigue es un **segundo registro que nace del mismo eje**, no otro personaje. Se quedan intactos,
> palabra por palabra: la X que mengua, la página 7 según Comercial, el anuncio de la estampida, el anuncio antes de
> entrar («Se llama interstitial. Son ingresos.»), el vídeo de Siestatón, los tres paquetes y el gong («Lo toco más
> fuerte. Que parezca.»), el exnovio, el adhesivo «SU ANUNCIO AQUÍ», «Has hecho clic en un anuncio. Ahora te sigo
> toda la noche.», la «tarifa plana», la silla 113 con anuncio en el respaldo y el «pop-up. De cartulina» del epílogo.

### 4.1 Tres candidatos

**A · La que lo lee todo.** Para vender un hueco hay que saber qué tiene al lado. Así que Maripaz se lee el periódico
entero, cada noche, de la cabecera a las esquelas, con el dedo: es la persona mejor informada del edificio y la
única que llega a las conclusiones (las que, según Begoña, «no lee nadie»). Su manera de pensar es la **vecindad**: no
mide cuánto ocupa una noticia (eso es Teodoro), sabe qué dice y qué anuncio le pega al lado, y a veces descoloca uno
porque le parece mal. Y su elogio sale en su idioma: una pieza buena es una pieza **sin hueco**.
- «Entero, cada noche. Para vender un hueco hay que leer lo de al lado.»
- «(lee la web) Incendio en un polígono. Y al lado, barbacoas. Lo cambio.»
- «Seis años leyéndote. Sin hueco.»

**B · Ternura comercial.** Sus anunciantes son su familia: conoce sus cumpleaños, les manda cojines, sufre cuando no
renuevan, llama a Siestatón con voz de madre. El dinero como forma de cariño.
- «Siestatón no contesta porque su dueño no duerme. Le mandé un cojín.»
- «Cafés Madrugón cumple treinta años. Le he hecho una tarta. Con logo.»
- «A un anunciante se le acompaña hasta la renovación. Y en la renovación, más.»

**C · Todo el mundo es un *lead*.** Escucha a Bruno con atención total, sin cortarle, en un edificio donde todos le
cortan (Begoña le recorta a media palabra, Gervasio le delega la frase). La razón es comercial: cada persona es un
cliente posible.
- «Sigue, sigue. No te corto. Cada palabra tuya es una impresión.»
- «¿Seis años sin silla? Eso es un público fiel. Te escucho.»
- «¿Tu abuela lee en el móvil? Cuéntamelo todo. Despacio.»

**Elijo A.** Razones:
1. **Es el eje vuelto del revés, no otro tema.** Misma causa (cada píxel es inventario) y consecuencia distinta (para
   venderlo hay que leerlo). No contradice al dueño: lo profundiza. B y C se quedan dentro del eje (más anunciantes,
   más ventas) y no la sacan de él.
2. **Da situaciones con lo que ya hay en pantalla**: la pieza de Bruno (se la lee delante de él), el planillo (se lo
   sabe), el faldón (el anuncio está escrito por alguien que leyó la pieza), el adhesivo (por detrás hay algo escrito)
   y el periódico del epílogo (echa de menos la conclusión). C es pasiva: escuchar no se ve.
3. **Engancha con la columna del juego**: nadie lee (Begoña: «la conclusión, que no la lee nadie»), y el final es que
   alguien contesta al periódico. Maripaz es la primera prueba de que a Bruno le lee alguien, **sin robarle el final a
   la abuela**: Maripaz lee por negocio; la abuela, por cariño; y la de Maripaz se dice en su idioma («Sin hueco»),
   que es más chiste que emoción.
4. **Le da una manera de pensar, no una palabra** (§2.2.1 del plan): la vecindad. No pisa a Teodoro (mide longitudes)
   ni a Aurora (corrige): Maripaz sabe *qué* dice cada línea y *qué tiene al lado*.

**Dosis.** El segundo registro aparece en unas 18 líneas (de las ~60 de Maripaz, más las de Aurora, Teodoro y Bruno que la leen) y en dos momentos; el eje sigue mandando
en todo lo demás. Regla para quien escriba más: **una línea de lectora por escena, como mucho**, y siempre con un
anuncio cerca (la lectora nunca deja de vender: «Las leeré» va detrás de «Me duele»).

### 4.2 «factur…»: de 33 a 11

El inventario completo está en §1.3 (tabla «factur»). Bajan 22 apariciones: 6 en la tabla de Maripaz (§4.3) y 16 de otras bocas
(§3.2, F1-F19, N27 y N30). Quedan 11 (tope 14): las de trama y **una sola de Maripaz fuera de Eventos** («Uy. Eso en
la web se llama «interacción». Te la facturo.», con la «tarifa plana» detrás), más sus dos de Eventos (protegida).
Regex y tope en §2.

### 4.3 Reescrituras de Maripaz

Registro: **eje** = inventario publicitario; **2.º** = la que lo lee todo; **condimento** = gong, tarifa, cariño;
**situación** = gag de lo que pasa; **persona** = se le ve el oficio por dentro.

| # | Fichero:línea | Texto actual | Texto nuevo | Registro | Nota |
|---|---|---|---|---|---|
| B1 | `rooms/sala_amazonas.js:336` | Maripaz, Comercial. Sentada en el planillo, con una tableta llena de anuncios. | Maripaz, Comercial. En el planillo, leyendo la web entera. Con el dedo. | 2.º | Mirar (Sala); rompe `test-comedia-p4.mjs` («tableta llena de anuncios») |
| B2 | `rooms/sala_amazonas.js:344` | A mí no se me coge, cariño. Se me contrata. Por impresiones. | ¿Cogerme? Antes, el formulario de contacto, cariño. Catorce campos. | eje | Coger (Sala); fuera la fórmula |
| B3 | `rooms/ecosistema.js:356` | A mí no se me coge. Se me contrata. Por impresiones. | ¿Cogerme? Antes, el formulario de contacto. Catorce campos. | eje | Coger (Marketing) |
| B4 | `rooms/sala_amazonas.js:345` | Eso en la web se llama «interacción». Te la cobro. | ¡Quieto! Si me mueves a mí, se mueve la página 7. | situación | Empujar (Sala), tras el mazo; deja la «interacción» solo en Marketing |
| B5 | `rooms/sala_amazonas.js:256` | Ese planillo no se coge. Se negocia. | Me lo he leído entero. Hay un hueco. Es mío hasta que alguien llame. | 2.º | Coger el planillo; además apunta al duelo (llamar a Siestatón) |
| B6 | `rooms/sala_amazonas.js:334` | Entre esta silla y aquella cabe un banner. Lo he medido. | (lee el orden del día) Punto tres... Me lo he leído. Mercados, no. | 2.º | murmullo (Sala); el «Lo he medido» se queda en actors.js |
| B7 | `rooms/sala_amazonas.js:97` | Hazlo tú, que escribes divinamente. Entre tus párrafos caben tres banners. | Hazlo tú, que escribes divinamente. Lo sé: te leo. Entero. | 2.º | `attackText.R04`; gana igual R04 «Y tú el que mejor delega. Por eso me escribes a mí.» |
| B8 | `rooms/sala_amazonas.js:103` | Muy bonito. Pero sin anuncio no es contenido. | Eso salió ayer en la página 3. Mejor escrito. | 2.º | `taunt` (2.º); queda «Eso no lo patrocina nadie.» |
| B9 | `rooms/sala_amazonas.js:102` | Eso me lo guardo para un branded content. | Bien dicho. Eso, al lado de un anuncio de tiritas. | 2.º | `hurt` (2.º); queda «Uy. Eso tiene tarifa.» |
| B10 | `rooms/sala_amazonas.js:106` | Eso no lo facturo. Ni lo firmo. Ni lo entiendo. | Lo he leído. No dice «noticia» en ninguna línea. | 2.º | `wrongObject` del remate; el remate sigue siendo `ficha_pagina_7` |
| B11 | `rooms/sala_amazonas.js:123` | Hueco libre: veintitrés líneas. Impar. Y sin un banner. Me duele. | Hueco libre: veintitrés líneas. Sin un banner. Me duele. Las leeré. | eje + 2.º | `onWin`; el adhesivo, intacto |
| B12 | `rooms/sala_amazonas.js:195` | ¿Sí? ¿Me llamas desde el colchón? Eso te lo facturo. | ¿Sí? ¿Me llamas desde un colchón? Buena elección. | condimento | `d1Siestaton`, 3.ª derrota; sigue «tarifa de proximidad» |
| B13 | `duelo.js:36` | Te lo miro y te facturo. | Ya lo he leído. Dos veces. Y no. | 2.º | floja «Te lo miro y te digo», contestación de Maripaz |
| B14 | `rooms/ecosistema.js:368` | ¿Un acta? Con un banner arriba sería rentable. Por primera vez. | ¿El acta? Ya la he leído. «Pedir más café». Ahí cabe Cafés Madrugón. | eje + 2.º | Dar `acta_reunion`; −1 «primera vez» |
| B15 | `rooms/ecosistema.js:371` | Si no lleva logo, no lo cojo. Y si lo lleva, lo cobro. | Leo la etiqueta entera. Hasta el lote. Al lado cabía un anuncio. Toma. | eje + 2.º | Dar `*` (solo Marketing; en la Sala se queda la del logo) |
| B16 | `rooms/ecosistema.js:257` | Eso es una baja de campaña, cariño. Te la facturo. | Eso es una baja de campaña, cariño. Con tres días de preaviso. | eje | roll-up, Empujar, con Maripaz |
| B16b | `rooms/ecosistema.js:257` | Se enrolla sin factura. Lo disfruto. | Se enrolla solo. Sin testigos. Lo disfruto. | — | roll-up, Empujar, sin Maripaz (Bruno) |
| B17 | `rooms/ecosistema.js:264` | Eso no es una venta. Es una ilusión. Y no la facturo. | Así lo pinto yo los viernes. Pero con más pulso. | persona | termómetro, Usar, con Maripaz: confiesa (casa con «Lo toco más fuerte. Que parezca.») |
| B18 | `rooms/ecosistema.dialogos.js:57` | Que baje un poco. Y otro poco. Ahí, entre los colchones. | Las pensiones, tras el segundo colchón. Línea cuatro. Me las sé todas. | 2.º | árbol `maripaz`, opción de la abuela (2.ª línea; la 1.ª se queda) |
| B19 | `rooms/ecosistema.dialogos.js:—` | — | [opción, once] ¿Usted se lee el periódico? / Entero, cada noche. Para vender un hueco hay que leer lo de al lado. / [Bruno] ¿Y qué es lo que más se lee? / La fe de erratas. Y ahí no me dejan poner ni un banner. | 2.º | opción nueva del árbol `maripaz`, antes de «Me voy.»; +4 |
| B20 | `actors.js:314` | Tadeo, cariño, te patrocino el reenvío. | (lee la web) Incendio en un polígono. Y al lado, barbacoas. Lo cambio. | 2.º | murmullo; −1 «cariño» |
| B21 | `rooms/catacumba.js:261` | En mi página la noticia se ve. Devuelto. | [Bruno, antes] El faldón dice: «¿La opa le quita el sueño? Colchones Siestatón». / [fax] Quien escribió eso se leyó la pieza entera. Devuelto igual. | 2.º | faldón del paso 35 (§4.3.4); +1 |
| B22 | `rooms/catacumba.js:—` | — | [Aurora] Por detrás pone, a boli: «Seis años leyéndote. Sin hueco.». Bien puntuado. / [Bruno] «Sin hueco». Creo que es un piropo. | 2.º | momento nuevo M2 (§4.4.2); +2 |
| B23 | `escenas/final.js:134` | Página 7. Tu noticia, entera. Ni un anuncio. Me ha dolido, cariño. | Página 7. Sin un anuncio. Y sin tu conclusión, cariño. Era lo mejor. | 2.º | epílogo; el resto de la escena (rotulador, «pop-up. De cartulina», mazo), intacto |
| B24 | `rooms/ecosistema.js:367` | ¿Toda esta noticia sin un anuncio en medio? Se ve demasiado. | [1.ª, sin recorte] Línea nueve: «Hidrovoltia, a por el Robledal». Al lado, uno de alarmas. / Y la conclusión es lo mejor. Que no te la quiten. / [con pieza_recortada] Te han quitado la conclusión. Yo sí la leía. Era mi hueco de cierre. / [repetida] Ya la he leído. Línea nueve: alarmas. No cambio de idea. | 2.º | momento nuevo M1 (§4.4.1), Dar `pieza_opa` en Marketing; +3. En la Sala se queda la línea actual |

**El duelo D1 sigue casando.** Solo cambian textos del bloque `duelMaripaz` (y una contestación de floja en
`duelo.js`); no cambian `deck` (R08, R04, R11, R14), `finishers` (remate en `atScore: 3` con `ficha_pagina_7`),
`defeatScene`, `onWin` (salvo una línea), flags ni pistas.
- **B7, `attackText.R04`**: la paráfrasis sigue siendo el ataque R04 («Es que tú eres el que mejor escribe.»: halago
  para delegar). La réplica que gana es la misma R04, «Y tú el que mejor delega. Por eso me escribes a mí.», y ahora
  pega más: ella te lee de verdad *y* te delega igual. Se aprende donde siempre; `pistas.js` no la nombra.
- **B8, B9** (`taunt`, `hurt`): no influyen en el resultado; R08 y R11 conservan su `hurtByPair` («¿Modo avión? Sin
  cobertura no me cargan los anuncios. Eso duele.» / «¿Sentado? Sentado se ven mejor los banners.»).
- **B10** (`wrongObject` del remate): el remate sigue pidiendo `ficha_pagina_7`; la línea nueva incluso orienta («no
  dice "noticia"»: lo que falta es un papel que diga que es noticia, la ficha sellada).
- **B13** (floja «Te lo miro y te digo»): sigue fallando siempre; solo cambia lo que contesta.
- `pistas.js`, objetivo `hueco`: sus tres niveles («Díselo por escrito…», «A Maripaz: «Siestatón no ha confirmado la
  página 7».») no citan ninguna línea que cambie. **Sin cambios en `pistas.js`.**

### 4.4 Dos momentos de situación nuevos

#### 4.4.1 M1 · «La lectora» (Marketing y Comercial; Dar `pieza_opa` a Maripaz)

Dónde: `content/rooms/ecosistema.js`, actor `maripaz_remitido`, clave `'dar:pieza_opa'` (sustituye a la línea de hoy,
«¿Toda esta noticia sin un anuncio en medio? Se ve demasiado.», que **se queda en la Sala Amazonas**, donde ya está).
Cuándo puede pasar: con la pieza escrita (paso 34) y Maripaz en su planta (tras D1), camino natural de la Redacción a
Administración para el recorte (paso 35). Opcional: no bloquea nada. Flags: ninguno nuevo de partida; una marca local
`api.once('ecosistema_maripaz_lee')` (declararla en `flags` de la sala si `check.mjs` lo pide; ver §6.8).

Paso a paso (texto exacto en B24):
1. Si `api.flag('pieza_recortada')`: Maripaz dice «Te han quitado la conclusión. Yo sí la leía. Era mi hueco de
   cierre.» y termina. (Contesta a Begoña sin nombrarla: «No la lee nadie.»)
2. Si no es la primera vez (`!api.once('ecosistema_maripaz_lee')`): «Ya la he leído. Línea nueve: alarmas. No cambio
   de idea.» y termina.
3. Primera vez, dentro de `api.cutscene`:
   1. `api.faceActor(MARIPAZ, 'bruno'); await api.anim(MARIPAZ, 'reach', 400); api.sfx('paper');` — la coge.
   2. `api.faceActor(MARIPAZ, 'down'); await api.wait(1400);` — lee (con el dedo; no hace falta arte nuevo).
   3. Tres golpecitos con el mazo en el papel: `for (let i = 0; i < 3; i++) { api.sfx('click'); await api.wait(350); }`
      — marca dónde iría un banner; no lo dice: se oye.
   4. `await api.wait(600); api.faceActor(MARIPAZ, 'bruno');`
   5. `await sayM(api, 'Línea nueve: «Hidrovoltia, a por el Robledal». Al lado, uno de alarmas.');`
   6. `await sayM(api, 'Y la conclusión es lo mejor. Que no te la quiten.');`
   7. `await api.anim(MARIPAZ, 'reach', 400); api.sfx('paper');` — se la devuelve. La pieza no se consume.
Por qué funciona: el jugador ve a una comercial leerse entera una pieza que nadie más ha leído; la vecindad
(opa → alarmas) es el eje; y «Que no te la quiten» se cumple diez minutos después, cuando Begoña corta justo la
conclusión. Es el único aviso del recorte que hay en el juego, y lo da la que vende anuncios.

#### 4.4.2 M2 · «Por detrás del adhesivo» (Redacción de papel; Aurora despega «SU ANUNCIO AQUÍ»)

Dónde: `content/rooms/catacumba.js`, función `quitarAdhesivo` (E2 §4.2.6; camino principal: la primera vez que Bruno
habla con Aurora tras ganar D1). Se añade al final de la función, sin tocar lo que ya hace ni el flag.

Paso a paso (texto exacto en B22):
1. Tras `api.setFlag('bruno_con_banner', false);` y `await api.wait(400);`, y **antes** de que Aurora vuelva a su
   sitio: Aurora le da la vuelta al adhesivo: `await api.anim(AUR, 'reach', 300); api.sfx('paper');`.
2. `await api.wait(700);` — lo lee. Aurora lee todo dos veces; aquí, una: es corto.
3. `await aurora(api, 'Por detrás pone, a boli: «Seis años leyéndote. Sin hueco.». Bien puntuado.');` — Aurora no
   comenta el contenido; corrige la puntuación, que es su manera de aprobar.
4. Vuelve a su sitio como hoy (`walkActor` a `ax, ay`, `faceActor`, `api.face(AUR)`).
5. `await api.say('«Sin hueco». Creo que es un piropo.');`
6. Sigue el flujo de hoy (rumor C y árbol de Aurora).
Por qué funciona: el mismo objeto que era un gag de Maripaz contra Bruno (le usa la espalda de soporte) resulta tener
una cara B; la descubre la única otra persona del edificio que lee todo (Aurora), y la traduce Bruno a su idioma de
becario. «Seis años» es su antigüedad en la web (lo dice el juego desde el Vestíbulo). Sin flags nuevos: la función ya
se ejecuta una sola vez.

#### 4.4.3 El fax del faldón y el epílogo (no son momentos nuevos; son los dos pagos)

- **Faldón (B21, paso 35, `faldonComercial` en `catacumba.js`).** Entre las dos líneas del fax entra una de Bruno, y
  la segunda del fax cambia: «De Comercial. Mi pieza, con un faldón de Siestatón. Más largo que la pieza.» / FAX «El
  anuncio mide cuarenta líneas. La noticia, veintitrés.» / BRUNO «El faldón dice: «¿La opa le quita el sueño?
  Colchones Siestatón».» / FAX «Quien escribió eso se leyó la pieza entera. Devuelto igual.» → (Teodoro mete la hoja en
  el fax al revés; igual que hoy). El anuncio es contextual: alguien leyó la noticia para escribirlo, y Teodoro, que
  odia el faldón, lo reconoce *y lo devuelve*. El eje y el segundo registro chocan en una línea.
- **Epílogo (B23, `final.js`).** Cambia solo la primera línea: «Página 7. Sin un anuncio. Y sin tu conclusión,
  cariño. Era lo mejor.» Es el pago de M1 y del recorte: la única persona que leyó la conclusión entera es la que
  vende los anuncios. Luego, igual que hoy: «Aunque mira: entre línea y línea todavía cabía un banner.» (lo dibuja) /
  «Es papel. No se le puede hacer clic.» / «Eso te lo arreglo con un pop-up. De cartulina.» / pum. Va antes de
  Evaristo y de la abuela: el final no se toca.

### 4.5 Topes de Maripaz tras E3

| Tope | Hoy | Tras E3 | Máximo |
|---|---|---|---|
| «cariño» (todo el juego, sin Eventos) | 15 | 14 | 20 |
| «pop-up» | 5 | 5 | 8 |
| «interstitial» | 1 | 1 | 2 |
| «(*» | 0 | 0 | 0 |
| M1 «cabe un banner» (oído, Maripaz) | — | baja 2 (B6, B7) | 5 |
| M2 «arreglo con un pop-up» | — | igual | 4 |
| M3 «se ve demasiado» | — | igual (la línea de la pieza se queda en la Sala) | 3 |
| M4 «branded content / contenido que paga» | — | baja 1 (B9) | 3 |
| «factur…» (todo el juego) | 33 | 11 | 14 |

---

## 5. Saldo de líneas y ficheros afectados

**Unidad:** una línea = una cadena que se dice o se enseña en pantalla (una entrada de `say`, un elemento de array,
una opción de menú). Reescribir 1 por 1 cuenta 0; eliminar, −1; añadir, +1.

| Bloque | Cambios | Saldo |
|---|---|---|
| §3 Fórmulas (U, N, P, Q, F, X) | 115 entradas: 100 reescrituras o recortes 1 por 1, 15 eliminaciones | **−15** |
| §4 Maripaz (B1-B24) | 21 reescrituras 1 por 1; opción nueva del árbol (+4); M1 (+3); faldón (+1); M2 (+2) | **+10** |
| **Total** | | **−5** |

Por fichero (entradas · saldo), con el paquete dueño según E2 §11:

| Fichero | Paquete | Entradas | Saldo | Ids |
|---|---|---|---|---|
| `content/actors.js` | P0 | 4 | 0 | U1 U2 Q1 B20 |
| `content/pistas.js` | P0 | 1 | 0 | U1b |
| `content/game.js` | P0 | 3 | −1 | U5 F3 F4 |
| `content/duelo.js` | P0 | 5 | 0 | N1 F1 F2 X1 B13 |
| `content/lib/movil.js` | P0 | 1 | 0 | P10 |
| `content/rooms/vestibulo.js` | P1 | 9 | −3 | U46-U49 N28 N29 Q10 Q11 F19 |
| `content/rooms/cpd.js` | P1 | 10 | −2 | U12-U14 N15 N16 Q6 F8-F11 |
| `content/escenas/final.js` | P1 | 1 | 0 | B23 |
| `content/rooms/pecera.js` | P2 | 12 | −1 | U35-U42 N22 P6-P8 |
| `content/rooms/pecera.dialogos.js` | P2 | 3 | 0 | U34 Q8 Q9 |
| `content/rooms/pecera.secretaria.js` | P2 | 3 | −1 | U43 N23 N24 |
| `content/rooms/pajarera.js` | P2 | 11 | −1 | U29-U33 N21 N30 P5 Q7 F15 F16 |
| `content/rooms/office.js` | P3 | 10 | 0 | U20-U28 N20 |
| `content/rooms/catacumba.js` | P3 | 16 | +1 | U7-U11 N9-N14 Q5 F6 F7 B21 B22 |
| `content/rooms/administracion.js` | P3 | 10 | −1 | U6 N2-N8 Q4 F5 |
| `content/rooms/administracion.dialogos.js` | P3 | 5 | −1 | P1 Q2 Q2b Q3 X2 |
| `content/rooms/sala_amazonas.js` | P4 | 16 | 0 | U44 U45 N26 N27 P9 B1 B2 B4-B12 |
| `content/rooms/ecosistema.js` | P4 | 16 | +1 | U15-U19 N17 N18 P2 P3 B3 B14-B17 B24 |
| `content/rooms/ecosistema.dialogos.js` | P4 | 2 | +4 | B18 B19 |
| `content/escenas/climax.js` | P4 | 2 | 0 | U3 U4 |
| `tools/plan-rules.mjs` | P0 | — | — | §2 (seis topes) y §1.5 (`esTexto`) |

**No se tocan:** `eventos.js`, `eventos.dialogos.js`, `pecera.escenas.js`, `pecera.voces.js`, `items.js`, `flags.js`,
`office.js` de Gertrudis salvo los objetos citados, la tarjeta final y los créditos.

**Pruebas que citan texto que cambia** (búsqueda en `tools/`; actualizar a la vez):
`test-comedia-p1.mjs` (B23 epílogo «Página 7. Tu noticia, entera…»; F8 Rubén «Comer algo…»),
`test-comedia-p2.mjs` (U34 «…integrado de la casa.»; U41 «…Por los tacos.»; Q8 «Un quesito que suma 130 %…»;
Q9 «…Es consultoría.»), `test-comedia-p4.mjs` (B1 «con una tableta llena de anuncios»; B11 «…sin un banner. Me
duele.»; N21 conserva «Cuarenta y ocho mil al mes.», comprobar). Ningún paso de `walk-data.mjs` usa estas líneas
como condición, salvo que el integrador diga otra cosa.

---

## 6. Dudas abiertas para el director

1. **¿REC es una forma?** Lo he tratado como recorte (quitar la frase-fórmula y dejar la situación), no como forma
   nueva: 31 casos. Si el director lo cuenta como forma, pasa de 6 y hay que convertir 25 en otras formas (salen
   líneas más largas) o en eliminaciones (sale más recorte). Mi voto: es recorte y es lo mejor del documento.
2. **Topes sin margen.** Quedan justo en el tope «lo único» (8/8), «no se X. Se Y.» (6/6), «primera vez» (4/4) y
   «No es X. Es Y.» (12/12). Cualquier línea nueva de cualquier paquete los rompe. ¿Se quiere margen? Puedo bajar dos
   más de cada, sin subir topes.
3. **Eventos en los topes.** Cuento sus líneas (2 + 1 + 2 + 2) dentro del tope, porque el jugador las oye. La otra
   opción es `fuera: /eventos/` como «cariño»; entonces los topes bajan a 6, 5, 4 y 10.
4. **El arreglo de `esTexto()`** (§1.5) no es mío (`tools/` es de P0), pero sin él las expresiones de §2 cuentan de
   menos: no ven 19 de las 36 «no se X. Se Y.», 4 de las 25 «No es X. Es Y.», 3 «primera vez» y 9 «factur». Y deja
   pasar dos «Como X.» (X1, X2). Pide excepción para `apodo:` en `lib/edificio.js`.
5. **M2 y el final.** El adhesivo dice «Seis años leyéndote. Sin hueco.»: alguien lee a Bruno antes de que la abuela
   le conteste. Creo que no le roba el final (es negocio dicho como piropo y lo corrige Aurora), pero es la duda más
   seria del documento. Si el director lo ve cerca, alternativa sin emoción: «Por detrás pone, a boli: «Hueco
   disponible».»; se pierde el pago del epílogo.
6. **Teodoro pierde «En mi página la noticia se ve. Devuelto.»** (B21) a cambio de reconocer que el anuncio lo
   escribió alguien que leyó la pieza. Si el revisor la echa de menos, alternativa: dejar esa línea y quitar la de
   Bruno («El faldón dice…»), con lo que la pista de la lectura desaparece del faldón.
7. **Dos nombres de mazo.** B9 («al lado de un anuncio de tiritas») y M1 («uno de alarmas») usan la vecindad sin
   marca inventada; si se prefiere marca (Tiritas Alivio, Alarmas Vigía), cabe en 80. No lo hago para no sumar marcas.
8. **Marca local de M1.** `api.once('ecosistema_maripaz_lee')` es una marca nueva de sala (no un flag cruzado ni un
   cambio de los existentes). Si «no cambies flags» la prohíbe también, M1 se queda sin la variante «repetida» y dice
   siempre la escena larga (saldo +2 en vez de +3).
9. **Defectos.** Quitar «Ya está cerrado. Aquí lo único que no cierra a tiempo es la edición.» deja cuatro respuestas
   a Cerrar en la rotación (`game.js`). La crítica se quejaba de los defectos en bucle; si se prefiere no
   empobrecerla, sustitúyase por otra de forma distinta en vez de eliminarla (saldo −4 en vez de −5).
10. **Gervasio** dice «Diecinueve años» en U33; el tope es ≤ 4 oídas. La línea ya lo decía (no suma), pero conviene
    que el integrador mire el recuento en la partida automática.
