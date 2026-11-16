# FE DE ERRATAS · E7 · RESTAURA (devolver los golpes que la poda de E6 aplanó)

> Repaso de las **274 filas aplicadas en E6** (`docs/guion2/e6/tabla.mjs`), una por una y en su contexto real de
> `content/` (quién habla, qué hay antes y después), con la regla **inversa** a la de E6. Más los tres tics que creó la
> fusión, las cuatro explicaciones que señala la crítica 6 (§4.3 y §8.6) y la línea repetida de Leoncio (F7).
> No se toca nada más: ni Eventos y Pilar, ni la cadena final (`climaxEmpujon`, `escenas/final.js`), ni
> `pecera.titulador*.js`, ni las réplicas ni los remates de los duelos.
>
> Material (scratchpad `e7/`): `restaura.mjs` (la tabla de datos: `filas` = lo que cambia, `mantenidas` = lo que se
> queda), `decisiones.mjs` (la decisión y el motivo de cada fila de E6), `build.mjs` (genera `restaura.mjs`),
> `verifica.mjs` (comprueba que cada «actual» existe literal hoy, ≤ 80, topes; aplica en `e7/copia/` y comprueba la
> sintaxis), `corpus.mjs` + `personas.mjs` (remate por personaje, heurística de E6), `greptools*.mjs` (§7).
> **Resultado de `node verifica.mjs`: 158 filas, 0 «actual» que no existan hoy, 158 de 158 aplicadas en la copia,
> sintaxis OK.** Sobre la copia: `text-audit` estático y **completo** (la partida automática, 1.427 líneas oídas) dan
> PLAN, E2 y E5 OK y en E6 un solo aviso, el tope de remate seco, que esta enmienda propone subir (§6).

---

## §1 · Método y criterio

**Cómo se leyó.** Para cada fila, el texto de antes de E6 (columna «actual» de la tabla de E6, contrastado con
`git show c5179bd^`) frente al de hoy, en su fichero, con las 4 líneas de antes y las 3 de después (`e7/ctx.txt`,
3.215 líneas). Para las 13 filas que E6 eliminó, el contexto se miró en el historial.

**Regla (la del dueño para esta ronda).**
1. **Vuelve el original siempre que la versión nueva no sea claramente mejor. En la duda, vuelve.**
2. **Se mantiene la versión de E6** solo si quitaba (a) un segundo o tercer chiste apilado, (b) una coletilla que
   comentaba el chiste anterior («Qué descanso», «La define», «Coherente», «Eso es nivel»…) o (c) una explicación
   (sobre todo de Bruno rematando el gag de otro), **y** lo que queda tiene golpe.
3. **Las fusiones son sospechosas por definición.** Si el golpe estaba en la frase corta («Rojo.», «Asiente.», «En
   barras.», «Se archiva.», «Igual que Yoli.»), vuelve la frase corta. El punto y coma en boca de un personaje
   («Se ve demasiado; estoy en ello») vuelve siempre: nadie habla con punto y coma.
4. **Un remate corto que ES el golpe no es una coletilla.** «Suben.», «Tienen horario.», «Estoy de miedo.», «NI
   SENTIMIENTOS.», «Es mi encuadre.», «Por vergüenza.» giran la frase: vuelven.
5. **Tercera opción** (12 de 274) solo cuando el original rompe un tope duro (año, «Siguiente», «de la casa») o
   cuando ni el original ni la fusión convencen: corta, natural y con un solo golpe.
6. **Los topes de las otras rondas mandan sobre el original.** «táper» (17/17), «Diecinueve años» (4/4), «Era solo
   eso» (5/5), «Lo que diga el Lector Medio» (5/5), «Huele a 2019» (1/1) y «D3: No.» (6/6) están llenos: ninguna fila
   que los toque vuelve. El año (33/35) admite una: vuelve la mejor, «OCUPADO hasta 2031»
   (E150), porque el año es el chiste. «Perdón», «próxima versión», «Siguiente» y «de la casa», tampoco vuelven.
7. **Lección del dueño.** Nada de chistes «de guionista»: dos chistes apilados, coletilla graciosa tras el remate o
   escena inventada. Por eso se mantienen podadas E045 («Doblo la apuesta. Sigue sin constar.»), E123 («Con número.»),
   E201, E214, X3 («Es el equilibrio.»), y E190 se queda con «La tinta está corrida» (concreto) frente a «Alguien
   lloraba» (escena inventada).
8. **Topes por personaje.** Tras la primera pasada, Leoncio quedaba en 36,7 % y Yoli en 31,6 %. Se devolvieron a la
   versión de E6 las cuatro dudas más flojas de los dos (E078, E105 —el cuarto «supervisa» de Leoncio—, E122) y dos
   pasaron a tercera opción (E129, E133). Así nadie pasa del 30 % (§6.3).

---

## §2 · Recuento

| Decisión | Filas de E6 |
|---|---:|
| **Vuelve el original** | **129** (de ellas, 1 inserción: E326) |
| **Se mantiene la versión de E6** | **133** |
| **Tercera opción** | **12** |
| Total | 274 |

De las 133 que se mantienen: **48** por un tope lleno de otra ronda (táper, año, «Diecinueve años», «Era solo eso», «Lo
que diga el Lector Medio», «Huele a 2019», «Perdón», «próxima versión», «desde [fecha]»); **2** por el tope de remate de
su personaje (E078, E122); **9** que la crítica da por mejoradas (E011, E023, E028, E099, E120, E132, E217, E224, E230);
**11** que quitaban una explicación o un rumor que no pagaba (E090, E096, E100, E146, E147, E202, E269, E276, E307, E345,
X15), y **63** por coletilla que comenta, chiste apilado, pista funcional de E6 (E303, E360-E363) o porque la versión de
E6 ya conservaba el golpe (E031, E251, E271, E292).

Además (fuera de las 274): **10 filas de tics** (§4), **5 de explicaciones** y **1 de F7** (§5). En total,
`restaura.mjs` lleva **158 filas que cambian** (130 de vuelta —129 + la segunda clave de E076—, 12 terceras, 10 de tics,
5 de explicación, 1 de F7) y 133 mantenidas.

### Por fichero (filas de E6)

| Fichero | Vuelven | Se mantienen | Tercera | Total |
|---|---:|---:|---:|---:|
| `rooms/office.js` | 12 | 20 | 2 | 34 |
| `rooms/cpd.js` | 12 | 16 | 1 | 29 |
| `rooms/sala_amazonas.js` | 16 | 11 | 1 | 28 |
| `rooms/pecera.js` | 13 | 12 | 0 | 25 |
| `rooms/catacumba.js` | 6 | 15 | 0 | 21 |
| `rooms/pajarera.js` | 10 | 8 | 1 | 19 |
| `pistas.js` | 14 | 5 | 0 | 19 |
| `rooms/pecera.escenas.js` | 6 | 6 | 3 | 15 |
| `rooms/vestibulo.js` | 8 | 6 | 0 | 14 |
| `rooms/ecosistema.js` | 7 | 7 | 0 | 14 |
| `rooms/pecera.dialogos.js` | 5 | 6 | 2 | 13 |
| `rooms/administracion.js` | 8 | 3 | 0 | 11 |
| `game.js` | 1 | 6 | 0 | 7 |
| `rooms/pecera.secretaria.js` | 3 | 2 | 1 | 6 |
| `rooms/administracion.dialogos.js` | 4 | 1 | 1 | 6 |
| `items.js` | 1 | 5 | 0 | 6 |
| `rooms/ecosistema.dialogos.js` | 1 | 1 | 0 | 2 |
| `actors.js` | 0 | 1 | 0 | 1 |
| `lib/movil.js` | 0 | 1 | 0 | 1 |
| `lib/ascensor.js` | 1 | 0 | 0 | 1 |
| `lib/directorio.js` | 1 | 0 | 0 | 1 |
| `duelo.js` | 0 | 1 | 0 | 1 |
| **Total** | **129** | **133** | **12** | **274** |

## §3 · Tabla completa (las 274 filas de E6)

Dec.: **O** vuelve el original · **N** se mantiene la versión de E6 · **T** tercera opción. «Hoy» es el literal de hoy en `content/` (lo que comprueba `verifica.mjs`). E076 tiene una segunda cadena («…Mirándola. Encima, una tira de cinta.»), E176 dos claves iguales y E355 tres: `restaura.mjs` las lleva todas.

| E6 | Fichero | Hoy | → Queda | Dec. | Motivo |
|---|---|---|---|---|---|
| E003 | `game.js` | No me contesta. Por lo menos no me ha llamado Pellizco. | = (se mantiene) | N | quitaba «Algo es algo», comentario |
| E006 | `game.js` | No pienso empujar eso. Saldría en una diapositiva del próximo comité. | No pienso empujar eso. Saldría en el próximo comité. En diapositiva. | O | golpe en «En diapositiva» |
| E007 | `game.js` | No veo cómo. El manual se lo llevó alguien al jubilarse. | = (se mantiene) | N | tope de año; 2011 es final |
| E009 | `game.js` | Veintitrés líneas. Ni una coma fuera de sitio. | = (se mantiene) | N | tope «Era solo eso» lleno |
| E010 | `game.js` | Alguien come ahí abajo y no cobra. | = (se mantiene) | N | tope «Era solo eso» lleno |
| E011 | `game.js` | Se llama Brais. | = (se mantiene) | N | Bruno ya no explica: mejora |
| E012 | `game.js` | Ella recorta sin leer. Yo leo sin recortar. | = (se mantiene) | N | «Somos un sistema» comenta antítesis |
| E013 | `rooms/vestibulo.js` | El cuadro de llaves del garaje: doce plazas y ciento doce aspirantes. | El cuadro de llaves del garaje. Doce plazas. Ciento doce aspirantes. | O | fusión: golpe en «aspirantes» |
| E014 | `rooms/vestibulo.js` | El ascensor está al otro lado del torno. Le saludo desde aquí. | = (se mantiene) | N | coletilla; queda el saludo |
| E015 | `rooms/vestibulo.js` | Tú pregúntame por el Ibex de vez en cuando. | Tú pregúntame por el Ibex de vez en cuando. Por si acaso. | O | «Por si acaso» es el miedo |
| E017 | `rooms/vestibulo.js` | Escribo «Más becarios con contrato». La ranura la escupe. | Escribo «Más becarios con contrato». La ranura la escupe. Polvo y principios. | O | vuelve «Polvo y principios» (crítica) |
| E020 | `rooms/vestibulo.js` | Etiqueta: «SEGURIDAD — NO RETIRAR». El piloto sigue encendido. | Etiqueta: «SEGURIDAD — NO RETIRAR». Sigue encendido. | O | «Sigue encendido» espía mejor |
| E021 | `rooms/vestibulo.js` | La riego con la mirada. Es de plástico: no necesita más. | La riego con la mirada. No necesita más. Es de plástico. | O | la revelación va al final |
| E022 | `rooms/vestibulo.js` | Le pregunto qué hay que hacer para tener plaza. El cuadro calla. | Le pregunto qué hay que hacer para tener plaza. El cuadro calla. Sabe cosas. | O | «Sabe cosas» gira; duda |
| E023 | `rooms/vestibulo.js` | Treinta años en este mostrador, y el mostrador tiene peor rodilla que yo. | = (se mantiene) | N | la crítica: mejora |
| E024 | `rooms/vestibulo.js` | Hoy tres me han preguntado por mi salud, con mucho interés. | Hoy tres me han preguntado por mi salud. Con mucho interés. Estoy de miedo. | O | sin «Estoy de miedo» no hay chiste |
| E025 | `rooms/vestibulo.js` | Celestino, el conserje, con la bufanda del Ibex. | Celestino, el conserje. Bufanda del Ibex. | O | ficha telegráfica; fusión floja |
| E026 | `rooms/vestibulo.js` | Le tiro de la bufanda y grita «¡fuera de juego!». | = (se mantiene) | N | queda el grito; «Lo dejo» sobra |
| E027 | `rooms/vestibulo.js` | Pidieron a alguien hace años. Llego tarde, pero llego. | = (se mantiene) | N | tope de año |
| E028 | `rooms/vestibulo.js` | *(eliminada)* | = (se mantiene) | N | la crítica: mejora (fuera) |
| E029 | `rooms/vestibulo.js` | ¡Despeje del mostrador! ¡Eso busca a alguien con hambre de verdad! | = (se mantiene) | N | tope de «táper» lleno |
| E030 | `rooms/office.js` | Nevera con imanes y un cartel: «ETIQUETAD VUESTROS TUPPERS». | = (se mantiene) | N | el cartel ya es el chiste |
| E031 | `rooms/office.js` | No. Dentro duerme el yogur de Ramírez. Respeto. | = (se mantiene) | N | ya conserva «Respeto.» |
| E032 | `rooms/office.js` | Le queda una bolsa de pipas caducada. Lleva años a punto de caer. | = (se mantiene) | N | año; dos remates apilados |
| E033 | `rooms/office.js` | Pulso la B4. Las pipas se asoman y se quedan colgando. | Pulso la B4. Las pipas se asoman y se quedan colgando. Las animo. Nada. | O | vuelve «Las animo. Nada.» |
| E037 | `rooms/office.js` | No pienso recalentar un café de Gertrudis delante de ella. | Recalentar un café de Gertrudis delante de ella. No. | O | el «No.» seco es Bruno |
| E039 | `rooms/office.js` | Darle café a la máquina de enfrente de Gertrudis sería una provocación. | Darle café a la máquina de enfrente de Gertrudis. Sería una provocación. | O | fusión sin ganancia; duda |
| E040 | `rooms/office.js` | Un hilo impreso, «RE: RE: RE: ¿De quién es el yogur?», con 214 respuestas. | Un hilo impreso: «RE: RE: RE: ¿De quién es el yogur?». 214 respuestas. | O | fusión: la cifra golpea sola |
| E041 | `rooms/office.js` | Mi primera firma en papel no va a ser en una hoja de riesgos. | = (se mantiene) | N | «Me niego» coletilla |
| E042 | `rooms/office.js` | La taza del Foro de Innovación ha echado raíces en el escurridor. | La taza del Foro de Innovación no se mueve. Ha echado raíces. Disruptivas. | O | vuelve «Disruptivas.» (crítica) |
| E043 | `rooms/office.js` | Tirar un café de Gertrudis por el fregadero. Me oiría. | = (se mantiene) | N | «Lo sé» coletilla |
| E044 | `rooms/office.js` | Una hoja: «PORRA: ¿QUIÉN DEJA ANTES SU PLAZA? CINCO EUROS». | Una hoja: «PORRA: ¿QUIÉN DEJA ANTES SU PLAZA?». Cinco euros. | O | «Cinco euros» fuera del cartel |
| E045 | `rooms/office.js` | Apuesto cinco euros por mí. En la cuota pone «no consta». | = (se mantiene) | N | segundo chiste apilado |
| E046 | `rooms/office.js` | Gertrudis, la cafetera. Tiene pantalla y carácter. | Gertrudis, la cafetera. Tiene pantalla y carácter. Lo segundo, más. | T | sin año, vuelve «Lo segundo, más» |
| E047 | `rooms/office.js` | Pulso el botón del café. Me mira y espera a que la salude. | = (se mantiene) | N | pista natural, personifica bien |
| E048 | `rooms/office.js` | Fermín Plazofijo, de Mercados, en la cola del microondas. | = (se mantiene) | N | el apellido ya es chiste |
| E049 | `rooms/office.js` | Gervasio, delante de Gertrudis. Ella no le sirve y él no la saluda. | = (se mantiene) | N | «Del todo» coletilla |
| E051 | `rooms/office.js` | Esperar cosas se me da bien. | = (se mantiene) | N | tope «Diecinueve años» lleno |
| E052 | `rooms/office.js` | Lleva toda la tarde sin moverse de su sitio. No voy a ser yo quien empiece. | = (se mantiene) | N | tope «Diecinueve años» lleno |
| E054 | `rooms/office.js` | Un ticket. Eso es de Sistemas: se les reenvía. | Un ticket. Eso es de Sistemas. Se les reenvía. | O | voz de Gervasio: frases sueltas |
| E055 | `rooms/office.js` | Chsss. Aquí la cola tiene orden. | Chsss. Aquí la cola tiene orden. Me siento seguro. | O | «Me siento seguro» es el chiste |
| E056 | `rooms/office.js` | Para cerrar un arco hace falta una puerta y un presupuesto. | Para cerrar un arco hace falta una puerta y un presupuesto. No hay ninguno. | O | «No hay ninguno» remata |
| E057 | `rooms/office.js` | NO SE ADMITEN DEVOLUCIONES. | NO SE ADMITEN DEVOLUCIONES. NI SENTIMIENTOS. | O | voz de Gertrudis (crítica) |
| E058 | `rooms/office.js` | NO ACEPTO TARJETAS. SOLO MODALES. | = (se mantiene) | N | quitaba el chiste del medio |
| E060 | `rooms/office.js` | NO SIRVO PARA LLEVAR. TENGO UN NOMBRE QUE MANTENER. | = (se mantiene) | N | tope de «táper» lleno |
| E061 | `rooms/office.js` | Un yogur con nombre: «RAMÍREZ». Lo respetan más que a la chaqueta. | = (se mantiene) | N | tope de año |
| E062 | `rooms/office.js` | El yogur de Ramírez. Dijo que volvía antes de que caducara. | El yogur de Ramírez. Caducado. Dijo que volvía antes. | T | sin año, vuelve la elipsis |
| E063 | `rooms/office.js` | Tazas de eventos. La del «Foro de Innovación» tiene moho innovador. | = (se mantiene) | N | tope de año |
| E064 | `rooms/office.js` | Lo adopto. Es lo primero que tengo a mi cargo. | = (se mantiene) | N | tope de «táper» lleno |
| E065 | `rooms/office.js` | Se queda conmigo. En el currículum: «Personal a cargo: 1». | = (se mantiene) | N | tope de «táper» lleno |
| E066 | `rooms/office.js` | No tengo nada que calentar. Solo nervios, y esos no se enfrían. | = (se mantiene) | N | táper ×2; nueva, mejor |
| E067 | `rooms/office.js` | En el suelo, vacío y sin nombre. Su dueño ha elegido la libertad. | = (se mantiene) | N | tope de «táper» lleno |
| E068 | `rooms/office.js` | Todavía no. Hay que esperar a que suelte la presa. | = (se mantiene) | N | tope de «táper» lleno |
| E070 | `rooms/pecera.js` | Empujar a alguien escaleras abajo sería una salida en valor. | Empujar a alguien escaleras abajo sería una salida en valor. No. | O | el «No.» lo desdice: gracia |
| E071 | `rooms/pecera.js` | Pulso el botón y viene enseguida. No estoy acostumbrado a eso. | = (se mantiene) | N | dos remates; queda uno |
| E072 | `rooms/pecera.js` | Lectores concurrentes: 3.418. Se refresca cada segundo, igual que Yoli. | Lectores concurrentes: 3.418. Se refresca cada segundo. Igual que Yoli. | O | fusión: «Igual que Yoli» golpea |
| E073 | `rooms/pecera.js` | Ya está fuera, y el CMS, dentro. | = (se mantiene) | N | «Que siga así» coletilla |
| E074 | `rooms/pecera.js` | La cinta dice NO DESENCHUFAR. No dice NO COGER, pero se sobreentiende. | La cinta dice NO DESENCHUFAR. No dice NO COGER. Pero se sobreentiende. | O | fusión: la pausa es chiste |
| E075 | `rooms/pecera.js` | Una taza con costra de café de la crisis de la deuda. | Una taza con costra de café de la crisis de la deuda. Debería cotizar. | O | «Debería cotizar» gira (crítica) |
| E076 | `rooms/pecera.js` | Delante, dos sillas vacías con chaqueta, mirándola. | Delante, dos sillas vacías con chaqueta. Mirándola. | O | fusión: «Mirándola.» es golpe |
| E078 | `rooms/pecera.js` | Herminia no sale de esta mesa: fuera está Anselmo. | = (se mantiene) | N | dos puntos naturales; Leoncio al tope |
| E081 | `rooms/pecera.js` | Si me siento con su chaqueta en la mano, Ramírez vuelve: es tradición. | Si me siento con su chaqueta en la mano, Ramírez vuelve. Es tradición. | O | fusión: «Es tradición» golpea |
| E082 | `rooms/pecera.js` | La arrimo a mi mesa. Primera silla en seis años. | = (se mantiene) | N | tope «Huele a 2019» |
| E084 | `rooms/pecera.js` | No me la pongo aún. Primero la descuelgo. | No me la pongo aún. Primero la descuelgo. Hay un orden. | O | «Hay un orden» gira |
| E085 | `rooms/pecera.js` | Cinta de carrocero en el suelo: la frontera de Desarrollo, recta de momento. | Cinta de carrocero en el suelo. La frontera de Desarrollo. Recta, de momento. | O | fusión que cita la crítica |
| E087 | `rooms/pecera.js` | Semáforo de ruido de Prevención, en rojo. | Semáforo de ruido de Prevención. Rojo. | O | fusión: «Rojo.» es golpe |
| E088 | `rooms/pecera.js` | Una taza que pone "NO". Es de la tercera espalda. | = (se mantiene) | N | «La define» comenta |
| E089 | `rooms/pecera.js` | Una bandeja, "ENTREGAS DE DISEÑO Y PRODUCTO", llena hasta arriba. | Una bandeja: "ENTREGAS DE DISEÑO Y PRODUCTO". Llena hasta arriba. | O | fusión: «Llena hasta arriba» golpea |
| E090 | `rooms/pecera.js` | Está en HECHO (PERO NO). | = (se mantiene) | N | Bruno explicaba la columna |
| E092 | `rooms/pecera.js` | Ahí fuera hay un mundo real, sin contador de lectores. | = (se mantiene) | N | «Qué descanso» comenta |
| E094 | `rooms/pecera.js` | Gracias. Herminia dice que es mi quinto. Me lo ha puesto en barras. | Gracias. Herminia dice que es mi quinto. Me lo ha puesto en barras. Suben. | O | vuelve «Suben.» (crítica) |
| E096 | `rooms/pecera.js` | *(eliminada)* | = (se mantiene) | N | Bruno remataba: silencio mejor |
| E097 | `rooms/pecera.js` | No. Si la dejo aquí, le ponen el sello de LEÍDO (PERO NO). | = (se mantiene) | N | tope de año |
| E098 | `rooms/pecera.js` | «Entregado a las 18:29». Y al fondo, una hoja con una flecha. | = (se mantiene) | N | tope de año |
| E099 | `rooms/pecera.dialogos.js` | *(eliminada)* | = (se mantiene) | N | la crítica: mejora (fuera) |
| E100 | `rooms/pecera.dialogos.js` | SEGUIREMOS INFORMANDO. | = (se mantiene) | N | Brais se despide en titular |
| E102 | `rooms/pecera.dialogos.js` | Nadie me lo había preguntado sin querer un dato. | = (se mantiene) | N | queda la verdad, sin apilar |
| E103 | `rooms/pecera.dialogos.js` | Menos una lectora: cuarenta y siete minutos, y comenta «abrígate» en todo. | Menos una lectora: cuarenta y siete minutos. Comenta «abrígate». En todo. | O | fusión: «En todo.» es golpe |
| E105 | `rooms/pecera.dialogos.js` | Pasa. Aquí ya no se trabaja: se supervisa. | = (se mantiene) | N | «supervisa» ×4 en Leoncio: sobra |
| E107 | `rooms/pecera.dialogos.js` | Dejaron las chaquetas en las sillas, mirándola, por respeto. | Dejaron las chaquetas en las sillas, mirándola. | T | tic «, por respeto»: fuera |
| E108 | `rooms/pecera.dialogos.js` | Un quesito que suma 130 %. Yo los hacía de 100. | = (se mantiene) | N | «Vieja escuela» coletilla |
| E109 | `rooms/pecera.dialogos.js` | Lo sé. Ella lo dijo a las ocho y veinte, en barras. | Lo sé. Ella lo dijo a las ocho y veinte. En barras. | O | fusión: «En barras.» golpea |
| E110 | `rooms/pecera.dialogos.js` | Me han absorbido en plataforma. Sigo aquí, supervisando desde Desarrollo. | Me han absorbido en plataforma. Sigo aquí, supervisando. Desde Desarrollo. | T | un golpe: «Desde Desarrollo.» |
| E112 | `rooms/pecera.dialogos.js` | Solución de terceros. Funciona, pero no es mía. | = (se mantiene) | N | tope «próxima versión» |
| E113 | `rooms/pecera.dialogos.js` | Tenía alta y estaba en mis sistemas. | Tenía alta. Estaba en mis sistemas. Todo en regla. | O | «Todo en regla» prepara la pausa |
| E117 | `rooms/pecera.dialogos.js` | Con el navegador, con los lectores y con la lluvia. | Con el navegador. Con los lectores. Con la lluvia. | O | la lista remata en «lluvia» |
| E118 | `rooms/pecera.dialogos.js` | Eutimio ha mandado primero el papeleo, por procedimiento. | Eutimio ha mandado primero el papeleo. Es el procedimiento. | O | tic «, por procedimiento»: punto |
| E120 | `rooms/pecera.escenas.js` | *(eliminada)* | = (se mantiene) | N | la crítica: mejora (fuera) |
| E121 | `rooms/pecera.escenas.js` | Trescientos titulares esta tarde, sin CMS, sin silla y sin convenio. | Trescientos titulares esta tarde. Sin CMS. Sin silla. Sin convenio. | O | staccato de consultor: golpe |
| E122 | `rooms/pecera.escenas.js` | Ya. Pero si no lo veo entrar, no cuenta. | = (se mantiene) | N | nueva, natural; Yoli al tope |
| E123 | `rooms/pecera.escenas.js` | ...Entonces existe. A HECHO (PERO NO). | = (se mantiene) | N | tercer golpe apilado |
| E124 | `rooms/pecera.escenas.js` | Ya te la ha leído. Yo no, ¿eh? Yo ya solo superviso. | Ya te la ha leído. Yo no, ¿eh? Yo ya no leo. Superviso. | O | «Superviso.» es el golpe |
| E125 | `rooms/pecera.escenas.js` | Encintar, no: aislar el componente. | Encintar, no. Aislar el componente. | O | eufemismo de Anselmo: pausa |
| E129 | `rooms/pecera.escenas.js` | Antes de que la envolviera le pedí un gráfico del Titulator, por curiosidad. | Antes de que la envolviera le pedí un gráfico del Titulator. | T | tic «, por curiosidad»: fuera |
| E130 | `rooms/pecera.escenas.js` | Quitar, no: absorber en plataforma. | Quitar, no. Absorber en plataforma. | O | eufemismo de Anselmo: pausa |
| E131 | `rooms/pecera.escenas.js` | Me han anexionado. Pero integrada, que es lo que quería. | Me han anexionado. Pero integrada, que es lo que quería. Creo. | O | «Creo.» gira la frase |
| E132 | `rooms/pecera.escenas.js` | Por un segundo te he respetado. | = (se mantiene) | N | la crítica: mejora |
| E133 | `rooms/pecera.escenas.js` | Esa ya está vieja; te imprimo otra. | Esa ya está vieja, te imprimo otra. | T | coma natural, sin punto y coma |
| E134 | `rooms/pecera.escenas.js` | Lo más leído de la web, impreso y clavado con chinchetas. | Lo más leído de la web. Impreso y clavado con chinchetas. | T | sin coletilla, vuelve la pausa |
| E135 | `rooms/pecera.escenas.js` | Ticket nº 3: «El CMS se cuelga con esta pantalla». | = (se mantiene) | N | tope de año |
| E137 | `rooms/pecera.secretaria.js` | Para apuntar lo que me digan. | = (se mantiene) | N | opción: coletilla «Sin» |
| E138 | `rooms/pecera.secretaria.js` | Para tenerlo, por si acaso. | Para tenerlo. Por si acaso. | O | tic «, por si acaso»: punto |
| E139 | `rooms/pecera.secretaria.js` | Un muerto sin que se lo pida. No me había pasado nunca. | Un muerto sin que se lo pida. Qué raro. | O | voz seca de Custodia |
| E141 | `rooms/pecera.secretaria.js` | Él desayuna despacio y yo apunto rápido. | Él desayuna despacio. Yo apunto rápido. | O | antítesis de Custodia: dos frases |
| E144 | `rooms/pecera.secretaria.js` | Abierta dos dedos, lo que cabe un boli. | Abierta dos dedos. Lo que cabe un boli. | T | sin «Siguiente» (tic de Íñigo) |
| E145 | `rooms/pecera.secretaria.js` | Lo leo dos veces y sigo sin merecer nada. | = (se mantiene) | N | «Coherente» comenta |
| E146 | `rooms/pajarera.js` | *(eliminada)* | = (se mantiene) | N | Bruno explicaba a Íñigo |
| E147 | `rooms/pajarera.js` | *(eliminada)* | = (se mantiene) | N | Bruno explicaba los colores |
| E148 | `rooms/pajarera.js` | Otra vez «ARMARIO 27». Los titulares no se repiten; las personas, sí. | Otra vez: «ARMARIO 27». Los titulares no se repiten. Las personas, sí. | O | punto y coma no se habla |
| E149 | `rooms/pajarera.js` | Sin acta de la anterior no se abre la siguiente, por reglamento. | Sin acta de la anterior no se abre la siguiente. Es el reglamento. | O | tic «, por reglamento»: punto |
| E150 | `rooms/pajarera.js` | OCUPADO. Llamar a esta puerta es pedir una prórroga. | OCUPADO hasta 2031. Llamar a esta puerta es pedir una prórroga. | O | el año es el chiste |
| E151 | `rooms/pajarera.js` | La silla de Ramírez queda libre. Por antigüedad, es mía. | = (se mantiene) | N | dos golpes; queda el mejor |
| E152 | `rooms/pajarera.js` | «Acuerdos: uno, perder otro duelo». Mi segunda acta. | «Acuerdos: uno, perder otro duelo». Mi segunda acta. Ya tengo archivo. | O | vuelve «Ya tengo archivo.» (crítica) |
| E155 | `rooms/pajarera.js` | Empujo el cristal. Desde la Redacción parece que pido auxilio. | Empujo el cristal. Desde la Redacción parece que pido auxilio. Un poco sí. | O | «Un poco sí» gira |
| E156 | `rooms/pajarera.js` | No. Íñigo los tiene contados por colores. | No. Íñigo los tiene contados. Por colores. | O | fusión: «Por colores.» golpea |
| E162 | `rooms/pajarera.js` | Cuidado, que es una licencia de cuarenta y ocho mil al mes. | Cuidado, que es una licencia. Cuarenta y ocho mil al mes. Una inversión. | O | siembra «Soy la inversión» |
| E165 | `rooms/pajarera.js` | Cerrada por dentro. Se oye pasar una diapositiva, muy despacio. | Cerrada por dentro. Se oye pasar una diapositiva. Muy despacio. | O | fusión: «Muy despacio.» golpea |
| E166 | `rooms/pajarera.js` | Todos los relojes marcan las 20:59, y la sala es de Ramírez. | Todos los relojes marcan las 20:59. La sala es de Ramírez. Siempre. | O | «Siempre.» gira |
| E167 | `rooms/pajarera.js` | Me apunto: "Bruno · firmar en papel · hoy". Lo tacho yo. | = (se mantiene) | N | evita otro «Por si acaso» |
| E172 | `rooms/pajarera.js` | Cero. Los marrones se... se reparten. | = (se mantiene) | N | coletilla que comenta |
| E173 | `rooms/pajarera.js` | Una vez se firmó un acuse de recibo. | = (se mantiene) | N | tope de año |
| E174 | `rooms/pajarera.js` | Se agradece la iniciativa igual, y se archiva. | Se agradece la iniciativa igual. Se archiva. | O | «Se archiva.» es Gervasio |
| E176 | `rooms/pajarera.js` | El Lector Medio: cartón pluma a tamaño real, encargado por Marketing. | El Lector Medio. Cartón pluma a tamaño real. Lo encargó Marketing. | T | sin año, vuelve el telegrama |
| E177 | `rooms/pajarera.js` | *(eliminada)* | = (se mantiene) | N | tope «Lo que diga…» lleno |
| E179 | `rooms/sala_amazonas.js` | No se enciende. El mando lo tiene alguien de Mercados, en el Vending. | No se enciende. El mando lo tiene alguien de Mercados. En el Vending. | O | fusión: «En el Vending.» golpea |
| E180 | `rooms/sala_amazonas.js` | Uy, eso tiene tarifa. | Uy. Eso tiene tarifa. | O | fusión sin ganancia |
| E182 | `rooms/sala_amazonas.js` | Hueco libre: veintitrés líneas. Impar, y sin un banner. | Hueco libre: veintitrés líneas. Impar, y sin un banner. Me duele. | T | sin coletilla «Y», vuelve «Me duele» |
| E183 | `rooms/sala_amazonas.js` | Se ve demasiado; estoy en ello. | Se ve demasiado. Estoy en ello. | O | punto y coma no se habla |
| E184 | `rooms/sala_amazonas.js` | Me han puesto un ronquido en espera. Cuelgo y vuelvo con Maripaz. | Me han puesto un ronquido en espera. Cuelgo. Vuelvo con Maripaz. | O | fusión sin ganancia; duda |
| E185 | `rooms/sala_amazonas.js` | Bienvenido otra vez. Su llamada nos importa, por eso bostezamos. | Bienvenido otra vez. Su llamada nos importa. Por eso bostezamos. | O | «Por eso bostezamos» golpea solo |
| E186 | `rooms/sala_amazonas.js` | Si la cierro, esto se convierte en una reunión de verdad. | = (se mantiene) | N | «No me atrevo» comenta |
| E187 | `rooms/sala_amazonas.js` | Diapositiva 247 de 400: «Sinergias exponenciales: el viaje». | Diapositiva 247 de 400: «Sinergias exponenciales: el viaje». No hay vuelta. | O | «No hay vuelta» juega con viaje |
| E188 | `rooms/sala_amazonas.js` | Lo empujo un poco. Zumba, y la 247 aguanta. | Lo empujo un poco. Zumba. La 247 aguanta. | O | fusión: tres tiempos |
| E189 | `rooms/sala_amazonas.js` | Si lo apago, Íñigo presenta a oscuras, y lo haría igual. | Si lo apago, Íñigo presenta a oscuras. Lo haría igual. | O | «Lo haría igual» golpea solo |
| E190 | `rooms/sala_amazonas.js` | Todo tachado, hasta «Siguientes pasos». La tinta está corrida. | = (se mantiene) | N | concreto mejor que inventado |
| E191 | `rooms/sala_amazonas.js` | El punto 3. Nadie lo toca: dicen que muerde. | El punto 3. Nadie lo toca. Dicen que muerde. | O | «Dicen que muerde» golpea solo |
| E193 | `rooms/sala_amazonas.js` | Lo empujo hacia dentro y Maripaz se acomoda encima. | = (se mantiene) | N | «Ha ganado terreno» comenta |
| E195 | `rooms/sala_amazonas.js` | Los alineo. Catorce en fila parecen un comité. | Los alineo. Catorce en fila. Parecen un comité. | O | «Parecen un comité» golpea solo |
| E196 | `rooms/sala_amazonas.js` | La apago y se enciende sola en «BUSCANDO SEÑAL». | = (se mantiene) | N | «No se rinde» comenta |
| E197 | `rooms/sala_amazonas.js` | Si me llevo un cable, alguien no podrá presentar. Tentador. | Si me llevo un cable, alguien no podrá presentar. Tentador. No. | O | el «No.» decide: duda |
| E198 | `rooms/sala_amazonas.js` | *(eliminada)* | = (se mantiene) | N | tope «Diecinueve años» lleno |
| E199 | `rooms/sala_amazonas.js` | Gervasio no se mueve. Esquivar marrones da mucha estabilidad. | = (se mantiene) | N | tope «Diecinueve años» lleno |
| E200 | `rooms/sala_amazonas.js` | ¿Cogerme? Antes, el formulario de contacto, cariño: catorce campos. | ¿Cogerme? Antes, el formulario de contacto, cariño. Catorce campos. | O | fusión: «Catorce campos.» golpea |
| E201 | `rooms/sala_amazonas.js` | Una ficha sin hueco. El hueco lo tengo yo, aquí debajo. | = (se mantiene) | N | dos remates; queda uno |
| E202 | `rooms/sala_amazonas.js` | *(eliminada)* | = (se mantiene) | N | clave duplicada; cae en dar:* |
| E203 | `rooms/sala_amazonas.js` | Junto a la pantalla, el Lector Medio, con la chaqueta de Ramírez, asintiendo. | Junto a la pantalla, el Lector Medio, con la chaqueta de Ramírez. Asiente. | O | «Asiente.» es el personaje |
| E204 | `rooms/sala_amazonas.js` | Junto a la pantalla, el Lector Medio, asintiendo. | Junto a la pantalla, el Lector Medio. Asiente. | O | «Asiente.» es el personaje |
| E205 | `rooms/sala_amazonas.js` | Lo levanto un poco. Pesa lo que un folio, y asiente igual. | Lo levanto un poco. Pesa lo que un folio. Asiente igual. | O | «Asiente igual.» golpea solo |
| E208 | `rooms/sala_amazonas.js` | Para eso. Muy bien visto, se toma nota. | Para eso. Muy bien visto. Se toma nota. | O | voz de Gervasio: frases sueltas |
| E209 | `rooms/sala_amazonas.js` | Se decide... Se está decidiendo por quien corresponda. | = (se mantiene) | N | tope «Lo que diga…» lleno |
| E214 | `rooms/catacumba.js` | Si firma uno de la web, el papel se acaba. | = (se mantiene) | N | dos remates (fax exento) |
| E215 | `rooms/catacumba.js` | ¿«Nota del autor: tengo sueño»? La escribí yo, una noche de cierre. | = (se mantiene) | N | año: 1998 es del final |
| E217 | `rooms/catacumba.js` | Sin papel no habla. Es su mejor época. | = (se mantiene) | N | la crítica: mejora |
| E219 | `rooms/catacumba.js` | La ficha, después. Primero contéstame, si puedes. | La ficha, después. Primero, contéstame. Si puedes. | O | «Si puedes.» es el reto |
| E220 | `rooms/catacumba.js` | Ya lo intentó Teodoro. La web entró igual. Por el fax. | = (se mantiene) | N | ya solo quitaba el año |
| E222 | `rooms/catacumba.js` | No la cojo: esta puerta separa el papel del clic. | = (se mantiene) | N | año; nueva, natural |
| E223 | `rooms/catacumba.js` | La mesa de Teodoro, ordenada al milímetro. | = (se mantiene) | N | concreto y natural: mejor |
| E224 | `rooms/catacumba.js` | Galeradas colgadas como jamones. | = (se mantiene) | N | la crítica: mejora |
| E225 | `rooms/catacumba.js` | Corro la cortina. Teodoro la vuelve a abrir sin dejar de mirar el fax. | Corro la cortina. Teodoro la vuelve a abrir sin mirar. Vigila el fax. | O | fusión sin ganancia; duda |
| E227 | `rooms/catacumba.js` | Un tipómetro, la regla de medir texto. Teodoro no se lo quita ni para dormir. | Un tipómetro: la regla de medir texto. Teodoro lo lleva encima. Duerme con él. | O | «Duerme con él.» mejor que frase hecha |
| E229 | `rooms/catacumba.js` | Jefes de cierre en blanco y negro, todos con bigote. | Jefes de cierre en blanco y negro. Todos con bigote. | O | fusión: «Todos con bigote.» |
| E230 | `rooms/catacumba.js` | Ya lo he contrastado: está enmarcado. | = (se mantiene) | N | la crítica: mejora |
| E231 | `rooms/catacumba.js` | Lo abro por cualquier página y pone «Así no se dice». | = (se mantiene) | N | dos remates; nueva, natural |
| E235 | `rooms/catacumba.js` | Dos líneas. Cabe en un faldón. | Dos líneas. Cabe en un faldón. Y sobra. | O | «Y sobra.» es Teodoro |
| E236 | `rooms/catacumba.js` | Vacío. Cabe todo. No lo quiero. | = (se mantiene) | N | solo quitaba «táper» |
| E237 | `rooms/catacumba.js` | Aurora, correctora. Tiene un boli rojo clavado en el moño. | Aurora, correctora. Tiene un boli rojo clavado en el moño. Por si acaso. | O | «Por si acaso» es Aurora |
| E238 | `rooms/catacumba.js` | Eso no se faxea, y vacío todavía menos. | = (se mantiene) | N | tope de «táper» lleno |
| E240 | `rooms/catacumba.js` | La manta de cuadros de Teodoro, doblada en cuatro como un pliego. | = (se mantiene) | N | tope de año |
| E241 | `rooms/catacumba.js` | Pesa lo que pesa una década. | = (se mantiene) | N | año; ya lo dice Mirar |
| E242 | `rooms/catacumba.js` | Un fax enmarcado: «¿Esto lo has contrastado?». | = (se mantiene) | N | tope de año |
| E247 | `rooms/cpd.js` | *(eliminada)* | = (se mantiene) | N | año; «Me lo abrí yo» cierra |
| E248 | `rooms/cpd.js` | Herramientas, por el otro circuito, el rápido. | Herramientas, por el otro circuito. El rápido. | O | fusión: «El rápido.» golpea |
| E250 | `rooms/cpd.js` | ...Esa es mía. | = (se mantiene) | N | tope de «Perdón»; duelo |
| E251 | `rooms/cpd.js` | ...Te espero. No me muevo. No puedo. | = (se mantiene) | N | ya conserva «No puedo.» |
| E252 | `rooms/cpd.js` | El ascensor. En el sótano, el «tin» suena más bajito, por respeto. | El ascensor. En el sótano, el «tin» suena más bajito. Por respeto. | O | tic «, por respeto»: punto |
| E253 | `rooms/cpd.js` | Empujo uno. Eutimio carraspea. Paro, y Eutimio para. | = (se mantiene) | N | «Nos entendemos» repetido (Teodoro) |
| E254 | `rooms/cpd.js` | Pesan como un servidor, porque son servidores. | Pesan como un servidor. Porque son servidores. | O | fusión: «Porque son servidores.» |
| E255 | `rooms/cpd.js` | Tiro de un cable. Eutimio carraspea a seis metros y lo suelto. | Tiro de un cable. Eutimio carraspea a seis metros. Lo suelto. | O | fusión: «Lo suelto.» golpea |
| E256 | `rooms/cpd.js` | Brais ya no está, y la matricial sigue imprimiendo. | = (se mantiene) | N | evita tercer «Por respeto» |
| E258 | `rooms/cpd.js` | La empujo con el pie. El piloto ni parpadea: tiene brida. | La empujo con el pie. El piloto ni parpadea. Tiene brida. | O | fusión: «Tiene brida.» golpea |
| E259 | `rooms/cpd.js` | Ya está encendido. Nadie sabe dónde está el botón. | = (se mantiene) | N | «Eutimio no pregunta» comenta |
| E261 | `rooms/cpd.js` | La salida, con letra de Eutimio, apretando mucho. | La salida, con letra de Eutimio. Apretando mucho. | O | «Apretando mucho.» es la emoción |
| E262 | `rooms/cpd.js` | Si lo cierro, Brais no sale ni en el libro. | Si lo cierro, Brais no sale ni en el libro. Lo dejo abierto. | O | «Lo dejo abierto» gira |
| E263 | `rooms/cpd.js` | No tiene botones. Sube uno cada vez que entro: soy una incidencia. | No tiene botones. Sube uno cada vez que entro. Soy una incidencia. | O | fusión: «Soy una incidencia.» |
| E264 | `rooms/cpd.js` | Ticket nº 1, julio: «Alta becario Brais». Estado: cerrado. | Ticket nº 1, julio: «Alta becario Brais». Estado: cerrado. Por fin. | O | «Por fin.» es el pago |
| E265 | `rooms/cpd.js` | Y al final, de hoy: «Alta becaria Herminia», en cuarenta segundos. | Y al final, de hoy: «Alta becaria Herminia». Cuarenta segundos. | T | sin «de la casa», vuelve staccato |
| E266 | `rooms/cpd.js` | Muevo una bola y rueda por dentro, como decía Eutimio. | Muevo una bola. Rueda por dentro. Eutimio tenía razón. | O | «Eutimio tenía razón.» golpea |
| E267 | `rooms/cpd.js` | Me abrió un ticket con márgenes, y lo tengo enmarcado. | Me abrió un ticket con márgenes. Lo tengo enmarcado. | O | fusión: «Lo tengo enmarcado.» |
| E268 | `rooms/cpd.js` | Ahí salgo. Al fondo. Siempre al fondo. | Ahí salgo. Al fondo. Siempre al fondo. Es mi encuadre. | O | vuelve «Es mi encuadre.» (crítica) |
| E269 | `rooms/cpd.js` | Firmo: «Bruno. Entrada: 2020. Salida: —». | = (se mantiene) | N | quitaba la explicación |
| E270 | `rooms/cpd.js` | Nº 3: «El CMS se cuelga con la pantalla de la Redacción». | = (se mantiene) | N | tope de año |
| E271 | `rooms/cpd.js` | Ahí abajo hay cables viejos. Y un bocadillo de 2003. | = (se mantiene) | N | ya conserva el bocadillo |
| E273 | `rooms/cpd.js` | ¿ES COMIDA? | = (se mantiene) | N | tope de «táper» lleno |
| E274 | `rooms/cpd.js` | Al armario no. Esto es para alguien que coma. | = (se mantiene) | N | tope de «táper» lleno |
| E275 | `rooms/cpd.js` | Ticket abierto: «objeto huérfano». Estado: tuyo. | = (se mantiene) | N | tope de «táper» lleno |
| E276 | `rooms/cpd.js` | *(eliminada)* | = (se mantiene) | N | la coma se une sola |
| E277 | `rooms/ecosistema.js` | Debajo: «Propongo quitar el logo. Por si os sirve!!», enviado a todos. | Debajo: «Propongo quitar el logo. Por si os sirve!!». Enviado a todos. | O | fusión: «Enviado a todos.» |
| E278 | `rooms/ecosistema.js` | Tadeo no lo ha leído; yo, sí. | Tadeo no lo ha leído. Yo sí. | O | punto y coma no se habla |
| E279 | `rooms/ecosistema.js` | Ya está cerrado. Por fin descansa. | = (se mantiene) | N | la impresora ya en E294 |
| E280 | `rooms/ecosistema.js` | Lo cierro y se abre solo. | Lo cierro. Se abre solo. | O | fusión: dos tiempos, gag |
| E286 | `rooms/ecosistema.js` | Debajo escribo «¿Y qué es?». Se borra solo. | Debajo escribo «¿Y qué es?». Se borra solo. Por vergüenza. | O | vuelve «Por vergüenza.» (crítica) |
| E289 | `rooms/ecosistema.js` | Si lo descuelgo, detrás habrá un módulo. | = (se mantiene) | N | «Mejor no mirar» comenta |
| E290 | `rooms/ecosistema.js` | Me pongo al lado. Soy una oportunidad. | = (se mantiene) | N | «Nadie me compra» está en roll-up |
| E291 | `rooms/ecosistema.js` | Le leo el lema en voz alta y suena a anuncio. | Le leo el lema en voz alta. Suena a anuncio. | O | fusión: «Suena a anuncio.» |
| E292 | `rooms/ecosistema.js` | Dentro hay un folio que pone «PRUEBA». Superada. | = (se mantiene) | N | ya conserva «Superada.» |
| E293 | `rooms/ecosistema.js` | Le pregunto por la bandeja 2. Se calla. | = (se mantiene) | N | segundo golpe que comenta |
| E296 | `rooms/ecosistema.js` | ¡Deja eso! Lleva un adhesivo de patrocinio por debajo. | ¡Deja eso! Lleva un adhesivo de patrocinio. Por debajo. | O | fusión: «Por debajo.» golpea |
| E297 | `rooms/ecosistema.js` | ¿Cogerme? Rellena antes el formulario: catorce campos, ocho obligatorios. | ¿Cogerme? Rellena antes el formulario. Catorce campos. Ocho obligatorios. | O | fusión: los campos en dos tiempos |
| E301 | `rooms/ecosistema.js` | El roll-up no se toca: está contratado. | = (se mantiene) | N | el año está debajo |
| E303 | `rooms/ecosistema.js` | El rotulador cuelga al lado, de un cordel, como el boli de un banco. | = (se mantiene) | N | pista del rotulador (§2.9) |
| E306 | `rooms/ecosistema.dialogos.js` | ¿Seguro que quieres salir? Era una pregunta patrocinada. | ¿Seguro que quieres salir? Era una pregunta. Y un anuncio. | O | «Y un anuncio.» gira |
| E307 | `rooms/ecosistema.dialogos.js` | *(eliminada)* | = (se mantiene) | N | rumor que no pagaba |
| E308 | `rooms/administracion.js` | Si cierro el pasillo, Begoña me pide el F-3 de Pasillos por triplicado. | Si cierro el pasillo, Begoña me pide el F-3 de Pasillos. Por triplicado. | O | fusión: «Por triplicado.» golpea |
| E309 | `rooms/administracion.js` | Le pregunto la hora al cartel: las 19:07. | = (se mantiene) | N | «Es coherente» comenta |
| E310 | `rooms/administracion.js` | Tiro de una esquina. Se recorta sola. Un 26 %. | = (se mantiene) | N | «Exacto.» apilado |
| E311 | `rooms/administracion.js` | Tres tazas vacías, una por copia. | Tres tazas vacías. Una por copia. | O | fusión: «Una por copia.» |
| E312 | `rooms/administracion.js` | «EJEMPLARES»: once notas bien hechas en cuarenta años. | «EJEMPLARES». Once notas bien hechas en cuarenta años. Una por cuatrienio. | O | vuelve «Una por cuatrienio.» (crítica) |
| E313 | `rooms/administracion.js` | Se ha ido todo el mundo. Yo cierro a las 19:15, por principios. | Se ha ido todo el mundo. Yo cierro a las 19:15. Por principios. | O | tic «, por principios»: punto |
| E314 | `rooms/administracion.js` | ¿Fotos? En esta ventanilla, fotocopias por triplicado. | ¿Fotos? En esta ventanilla, fotocopias. Por triplicado. | O | voz de Begoña: «Por triplicado.» |
| E316 | `rooms/administracion.js` | Don Evaristo Salvedad, Controlling, con corbata de comas y lupa al cuello. | Don Evaristo Salvedad, Controlling. Corbata de comas. Lupa al cuello. | O | ficha telegráfica: fusión floja |
| E317 | `rooms/administracion.js` | Gracias. ¿Lleva ticket? No lo pregunto yo, lo preguntaría Begoña. | Gracias. ¿Lleva ticket? No lo digo yo. Lo diría Begoña. | O | fusión: dos tiempos, Begoña |
| E318 | `rooms/administracion.js` | Gracias. Lo leo y le escribo un correo muy pequeño. | Gracias. Lo leo y le escribo. Un correo. Muy pequeño. | O | «Muy pequeño.» es Evaristo |
| E319 | `rooms/administracion.js` | Ese cristal aguantó una auditoría. Te aguanta a ti. | = (se mantiene) | N | tope de año |
| E321 | `rooms/administracion.dialogos.js` | Eso es autoestima, y no desgrava. | Eso es autoestima. Y no desgrava. | O | «Y no desgrava.» es Begoña |
| E322 | `rooms/administracion.dialogos.js` | Pellejo, con jota. Pase un segundo, que es una cosita muy pequeña. | Pellejo, con jota. Pase un segundo. Una cosita. Muy pequeña. | O | voz de Evaristo: «Una cosita.» |
| E323 | `rooms/administracion.dialogos.js` | Lleva «RECHAZADO» en la frente. Bien centrado. | Lleva «RECHAZADO» en la frente. Bien centrado. Begoña tiene pulso. | O | «Begoña tiene pulso» gira |
| E324 | `rooms/administracion.dialogos.js` | Un sobre de azúcar caducado, del bolsillo de Ramírez, por el olor. | Un sobre de azúcar. Caducado. Del bolsillo de Ramírez, por el olor. | T | sin año, vuelve el staccato |
| E325 | `rooms/administracion.dialogos.js` | Gracias por escucharme hasta el final. La gente suele colgar en la coma. | = (se mantiene) | N | año y «desde» con tope |
| E326 | `rooms/administracion.dialogos.js` | *(eliminada)* | Le he mirado el reloj y se ha dado cuenta. *(se inserta)* | O | sin ella parece un fallo (F4) |
| E327 | `items.js` | Me la pongo por probar. Huele a cruasán de máquina. | = (se mantiene) | N | tope «Huele a 2019» |
| E328 | `items.js` | Sobre de azúcar caducado. Pone «Cafetería». Es casi un ticket. | = (se mantiene) | N | tope de año |
| E330 | `items.js` | Echarle azúcar al café de Gertrudis es corregirla. | = (se mantiene) | N | «No me atrevo» comenta |
| E331 | `items.js` | Duplicado y triplicado de mi nota de gasto, con dos sellos de RECHAZADA. | Duplicado y triplicado de mi nota de gasto. Sello: RECHAZADA. Dos veces. | O | fusión: «Dos veces.» golpea |
| E332 | `items.js` | La primera acta en diecinueve años. Tiene dos faltas. | = (se mantiene) | N | «Aurora lloraría» comenta |
| E334 | `items.js` | Siempre yendo al baño, siempre en una esquina de la foto. | = (se mantiene) | N | tope de «táper» lleno |
| E335 | `actors.js` | ¿Hay alguien? ¿Me traéis algo de comer? | = (se mantiene) | N | tope de «táper» lleno |
| E336 | `lib/movil.js` | Una perdida de la abuela. | = (se mantiene) | N | «Siempre hay una» en items |
| E341 | `lib/ascensor.js` | Si al abrir oye un gong, alguien ha vendido algo. | Si al abrir oye un gong, alguien ha vendido algo. No se asuste. | O | «No se asuste.» es la voz |
| E344 | `lib/directorio.js` | Un punto rojo: «ESTÁ AQUÍ». Gracias. | Un punto rojo: «ESTÁ AQUÍ». Gracias. Me hacía falta. | O | «Me hacía falta.» gira |
| E345 | `pistas.js` | Hueco, fuente y firma. Lo pone la ficha. | = (se mantiene) | N | meta de Bruno: basta |
| E346 | `pistas.js` | El del mostrador siempre está mascando algo: pídeselo. | El del mostrador siempre está mascando algo. Pídeselo. | O | voz de la abuela: dos frases |
| E347 | `pistas.js` | Mirar mi ordenador, sentado. | Mirar mi ordenador. Sentado. | O | fusión sin ganancia |
| E348 | `pistas.js` | Dale las buenas noches a la cafetera, en alto. | Dale las buenas noches a la cafetera. En alto. | O | voz de la abuela: «En alto.» |
| E349 | `pistas.js` | Tienes un papel del fax y otro de la ventanilla: dos vecinas. | Tienes un papel del fax y otro de la ventanilla. Dos vecinas. | O | voz de la abuela: «Dos vecinas.» |
| E350 | `pistas.js` | Mi ordenador, a escribir. | Mi ordenador. A escribir. | O | fusión sin ganancia |
| E351 | `pistas.js` | Al señor del fax llévale los papeles de mi parte. | Al señor del fax llévale los papeles. De mi parte. | O | voz de la abuela: «De mi parte.» |
| E352 | `pistas.js` | A los que nunca dicen nada, hijo, un empujoncito con educación. | A los que nunca dicen nada, hijo, un empujoncito. Con educación. | O | voz de la abuela: «Con educación.» |
| E353 | `pistas.js` | La del boli rojo y el del fax no se hablan; pregúntale por qué. | La del boli rojo y el del fax no se hablan. Pregúntale por qué. | O | punto y coma no se habla |
| E354 | `pistas.js` | Vending: «Buenas noches, Gertrudis», el primer chisme. | Vending: «Buenas noches, Gertrudis». El primer chisme. | O | fusión sin ganancia |
| E355 | `pistas.js` | A esa cafetera salúdala otra vez, hijo, que le quedan chismes. | A esa cafetera salúdala otra vez, hijo. Le quedan chismes. | O | voz de la abuela (tres claves) |
| E356 | `pistas.js` | Encima de la mesa del fax hay un papel con marco: léelo. | Encima de la mesa del fax hay un papel con marco. Léelo. | O | voz de la abuela: «Léelo.» |
| E357 | `pistas.js` | Despachos: Mirar el ordenador de Gervasio, los enviados. | Despachos: Mirar el ordenador de Gervasio. Los enviados. | O | fusión sin ganancia |
| E358 | `pistas.js` | El de los cables sabe cosas del señor del traje; pregúntale. | El de los cables sabe cosas del señor del traje. Pregúntale. | O | punto y coma no se habla |
| E359 | `pistas.js` | El chico del armario escribía los discursos; pregúntale. | El chico del armario escribía los discursos. Pregúntale. | O | punto y coma no se habla |
| E360 | `pistas.js` | En esa pizarra se escribe con rotulador, hijo, y no con el de ese señor. | = (se mantiene) | N | pista nueva del rotulador (§2.9) |
| E361 | `pistas.js` | La de los anuncios pinta sus objetivos a rotulador: pídeselo. | = (se mantiene) | N | pista nueva del rotulador (§2.9) |
| E362 | `pistas.js` | A esa tele dale las buenas noches, como a la cafetera, y pregúntale. | = (se mantiene) | N | pista del atajo de la tele |
| E363 | `pistas.js` | Hablar con la tele: «Buenas noches, Gertrudis». Y lo de los pasos. | = (se mantiene) | N | pista del atajo de la tele |
| E371 | `duelo.js` | TODO. Se me escapa todo. | = (se mantiene) | N | «Perdón» ya en R13 |
| X1 | `rooms/catacumba.js` | Me ha corregido sin hablar. | = (se mantiene) | N | «Es buenísima» comenta el gesto |
| X2 | `rooms/cpd.js` | Le contesta mi respuesta automática. | = (se mantiene) | N | «Hacen buena pareja» comenta |
| X3 | `rooms/cpd.js` | Me entero de todo. No arreglo nada. | = (se mantiene) | N | tercer golpe apilado |
| X4 | `rooms/pajarera.js` | Ha pisado la reserva de un hombre que no está. | = (se mantiene) | N | «Eso es nivel» comenta |
| X5 | `rooms/pecera.js` | Cabe. Ni ella ni yo hemos tocado nada. | = (se mantiene) | N | «Mi parte favorita» es de Íñigo |
| X6 | `rooms/pecera.js` | Me escribo un pósit: "Firmar en papel". Lo pego en POR HACER. | = (se mantiene) | N | «Desde hoy» coletilla |
| X7 | `rooms/sala_amazonas.js` | ¿Llamar yo a Siestatón un viernes? Te lo pongo por escrito. | = (se mantiene) | N | coletilla «Con banner» |
| X8 | `rooms/pecera.js` | Es que lo escribí yo. | Es que lo escribí yo. Ayuda bastante. | O | vuelve «Ayuda bastante.» (crítica) |
| X9 | `rooms/pecera.escenas.js` | ¡Ha entrado otra! | ¡Otra! ¡Ha entrado otra! | O | entusiasmo natural de Yoli |
| X10 | `rooms/pecera.js` | Busco "el Contable" y salen gestorías. | Busco "el Contable" y salen gestorías. Nos ganan. Tienen horario. | O | vuelve «Tienen horario.» (crítica) |
| X11 | `rooms/cpd.js` | Mi baja está en un pósit del tablero de Anselmo, en POR HACER. | = (se mantiene) | N | es pista, no remate |
| X12 | `rooms/office.js` | CELESTINO, EXTENSIÓN 0. | CELESTINO. EXTENSIÓN 0. | O | voz de pantalla de Gertrudis |
| X13 | `rooms/office.js` | NO RECOJO CADÁVERES: PRUEBE EN SECRETARÍA. | NO RECOJO CADÁVERES. PRUEBE EN SECRETARÍA. | O | voz de pantalla de Gertrudis |
| X14 | `rooms/sala_amazonas.js` | ¿Un café? ¿A mí? Esto no estaba en el orden del día. | = (se mantiene) | N | «Se agradece» es tic |
| X15 | `rooms/pecera.escenas.js` | ¿Llevas un banner en la espalda? ...Pues convierte. | = (se mantiene) | N | «Me han mirado» explica |

### Filas fuera de las 274 (tics, explicaciones, F7)

| Id | Fichero | Hoy | → Queda | Motivo |
|---|---|---|---|---|
| TIC-P1 | `rooms/catacumba.js` | Toma la ficha de la página 7. Ahí lo tienes, por casillas. | Toma la ficha de la página 7. Ahí lo tienes todo, en casillas. | tic «, por X»: fuera |
| TIC-P2 | `rooms/catacumba.js` | Cinco. El quinto es para ti, por traérmelo. | Cinco. El quinto es para ti. Por traérmelo. | tic «, por X»: punto y golpe |
| TIC-S1 | `rooms/ecosistema.js` | El portátil de Tadeo, de Negocio. Se fue a las seis. | El portátil de Tadeo, de Negocio. Tadeo no está. | tic «se fue a las seis» |
| TIC-S2 | `rooms/ecosistema.js` | Su portátil, no. | El portátil sigue reenviando. | tic «su X, no» |
| TIC-S3 | `rooms/pecera.dialogos.js` | Se fue a las seis y media. Herminia no ficha. | Ficharon y se fueron. Herminia no ficha. | tic «se fue a las seis» |
| TIC-S4 | `rooms/office.js` | Sus dueños se fueron a las seis y media. Los tuppers siguen en la cola. | Los nueve tuppers siguen en la cola. Nadie viene a por ellos. | tic «se fue a las seis» |
| TIC-S5 | `rooms/cpd.js` | A las seis y media se va la gente. Los tickets se quedan. Y yo... | Los tickets nunca se van a casa. Y yo... | tic «se fue a las seis» |
| TIC-L1 | `rooms/vestibulo.js` | No acepta nada. Ni regalos ni sugerencias. Por eso sigue en plantilla. | No acepta regalos. Es la única del edificio que no se deja comprar. | tic «plantilla» (el ficus repetía) |
| TIC-L2 | `rooms/catacumba.js` | El bigote también era de plantilla. | El bigote venía con el cargo. | tic «plantilla» |
| TIC-L3 | `rooms/catacumba.js` | El Libro de Estilo. Más grueso que la plantilla fija. | El Libro de Estilo. Más grueso que el convenio. | tic «plantilla» |
| EXP-1 | `rooms/cpd.js` | Esta casa da de alta antes a un portátil que a un chaval. | *(fuera: se quita la cadena)* | tesis dicha en voz alta |
| EXP-2a | `rooms/catacumba.js` | Abre interrogación y cierra con punto. | *(fuera: se quita la cadena)* | explica lo que se ve |
| EXP-2b | `rooms/catacumba.js` | Eso no es una pregunta, criatura. Es una sentencia. | Eso, criatura, es una sentencia. | queda el golpe sin explicar |
| EXP-3 | `escenas/climax.js` | Él cree que avanza. El Lector Medio cree que asiente. | *(fuera: se quita la cadena)* | narra el proyector: fuera |
| EXP-4 | `rooms/pecera.escenas.js` | Y un comentario: «abrígate». La cuenta de siempre. | Y alguien ha comentado: «abrígate». | no subrayar la pista final |
| F7 | `rooms/pecera.js` | Cuatro décimas. Yo tardaba una semana. Qué semanas aquellas. | *(fuera: se quita la cadena)* | repetida: queda la escena |

---

## §4 · Tics

### 4.1 «…, por X.» (11 → 2)

Las 11 que cuenta la crítica (sin Eventos): reglamento, triplicado, respeto ×2, si acaso, casillas, traérmelo,
principios, escrito, procedimiento, curiosidad.

| Dónde | Hoy | Queda | Cómo |
|---|---|---|---|
| E149 `pajarera.js` (Gervasio) | …no se abre la siguiente, por reglamento. | …no se abre la siguiente. Es el reglamento. | vuelve el original |
| E252 `cpd.js` | …el «tin» suena más bajito, por respeto. | …suena más bajito. Por respeto. | vuelve: es el «Por respeto» que se queda (uno) |
| E107 `pecera.dialogos.js` (Leoncio) | …mirándola, por respeto. | …en las sillas, mirándola. | tercera: fuera el segundo «respeto» |
| E138 `pecera.secretaria.js` (opción) | Para tenerlo, por si acaso. | Para tenerlo. Por si acaso. | vuelve: Custodia contesta a esa frase |
| E313 `administracion.js` (Begoña) | …a las 19:15, por principios. | …a las 19:15. Por principios. | vuelve |
| E118 `pecera.dialogos.js` (Brais) | …el papeleo, por procedimiento. | …el papeleo. Es el procedimiento. | vuelve |
| E129 `pecera.escenas.js` (Leoncio) | …del Titulator, por curiosidad. | …un gráfico del Titulator. | tercera: fuera (tope de Leoncio) |
| TIC-P1 `catacumba.js` (Aurora) | Ahí lo tienes, por casillas. | Ahí lo tienes todo, en casillas. | tercera |
| TIC-P2 `catacumba.js` (Aurora) | El quinto es para ti, por traérmelo. | El quinto es para ti. Por traérmelo. | punto y golpe |
| `administracion.dialogos.js` (Begoña) | Y la tuya, por triplicado. | = | **se queda**: prepara los tres sellos que siguen |
| `sala_amazonas.js` (Bruno) | Todavía no. Primero, por escrito. | = | **se queda**: no es fusión, es la frase natural |

Quedan **2** (triplicado y escrito). Los «por X» que no son el tic («por el olor», «por si me oyen», «por si alguien
mira») no cuentan. Efecto lateral, a vigilar por la contra: **«Por si acaso» queda en 5 cadenas fuera de Eventos**
(Celestino E015, Aurora E237, la opción de Custodia E138, Begoña y un murmullo de la Redacción; hoy son 3); «Por
respeto», en 1 (más el «Respeto.» del yogur).

### 4.2 «…es / sigue en / lleva más tiempo en plantilla» (5 → 2)

| Dónde | Hoy | Queda |
|---|---|---|
| `vestibulo.js` ficus, Mirar | Es de plástico. Aun así, es la que más tiempo lleva en plantilla. | = (**la que se queda**, la mejor) |
| `vestibulo.js` ficus, Dar (TIC-L1) | No acepta nada. Ni regalos ni sugerencias. Por eso sigue en plantilla. | No acepta regalos. Es la única del edificio que no se deja comprar. |
| `catacumba.js` jefes de cierre (TIC-L2) | El bigote también era de plantilla. | El bigote venía con el cargo. |
| `catacumba.js` Libro de Estilo (TIC-L3) | El Libro de Estilo. Más grueso que la plantilla fija. | El Libro de Estilo. Más grueso que el convenio. |
| `eventos.js` foco | …Ya es de la plantilla. | = (Eventos, protegido) |

Quedan **2** (el ficus y el foco de Eventos, que no se toca). Nota: la crítica atribuye «Por eso sigue en plantilla» al
buzón; es el `dar:*` del ficus (el mismo objeto lo decía dos veces). «Están ampliando plantilla» (Siestatón) y «Toda la
plantilla en "Prescindible"» (la matriz) usan la palabra en su sentido literal: no son el tic.

### 4.3 «X se fue a las seis (y media). Su X, no» (6 → 2)

| Dónde | Hoy | Queda |
|---|---|---|
| `ecosistema.js` móvil de Borja | Borja se fue a las seis. / El móvil no… | = (**se queda**) |
| `pecera.js` sillas con chaqueta | Se fueron a las seis y media. / La chaqueta ficha por ellos. | = (**se queda**) |
| `ecosistema.js` Tadeo (TIC-S1/S2) | …de Negocio. Se fue a las seis. / Su portátil, no. | …de Negocio. Tadeo no está. / El portátil sigue reenviando. |
| `pecera.dialogos.js` Leoncio (TIC-S3) | Se fue a las seis y media. Herminia no ficha. | Ficharon y se fueron. Herminia no ficha. |
| `office.js` microondas, 2.º Mirar (TIC-S4) | Sus dueños se fueron a las seis y media. Los tuppers siguen en la cola. | Los nueve tuppers siguen en la cola. Nadie viene a por ellos. |
| `cpd.js` murmullo de Eutimio (TIC-S5) | A las seis y media se va la gente. Los tickets se quedan. Y yo... | Los tickets nunca se van a casa. Y yo... |

Quedan **2**, las que la crítica elige (Borja y las chaquetas). Celestino («A las seis y media sale todo el mundo…») y
«La planta 2 a las seis y media: moqueta, pufs y nadie» dan la hora, no el molde «X se fue; su Y, no».

---

## §5 · Las cuatro explicaciones y F7

| Id | Dónde | Hoy | Propuesta | Por qué |
|---|---|---|---|---|
| EXP-1 | `cpd.js` P_ALTA → Herramienta (Eutimio) | «Esta casa da de alta antes a un portátil que a un chaval.» | **Fuera la línea** (`await api.sayAs(P, …)`). Queda: «Herminia. Becaria de Desarrollo. Herramienta.» Estado: de la casa. → Brais: «¿CUARENTA SEGUNDOS? …Perdón. Yo también soy herramienta.» | Es la tesis dicha en voz alta tras enseñarla; Brais ya la paga. «chaval» baja de 11 a 10 |
| EXP-2 | `catacumba.js` «¿Ha oído cómo pregunta Custodia?» (Aurora) | ['Abre interrogación y cierra con punto.', 'Eso no es una pregunta, criatura. Es una sentencia.'] | **Una sola cadena: «Eso, criatura, es una sentencia.»** | La puntuación de Custodia se ve en cada línea suya; Aurora solo pone nombre al gesto. «criatura» sigue en 6 |
| EXP-3 | `escenas/climax.js` entrada al clímax (Bruno) | ['El proyector se colgó en la 247 hace tres semanas.', 'Él cree que avanza. El Lector Medio cree que asiente.'] | **Fuera la segunda.** Queda el dato, que es el golpe contra «La 247 tiene mucho recorrido» | Narraba lo que se ve. `climax.js` no es la cadena final (`climaxEmpujon` / `final.js` no se tocan) |
| EXP-4 | `pecera.escenas.js` Gertrudis viral (Yoli) | «Y un comentario: «abrígate». La cuenta de siempre.» | **«Y alguien ha comentado: «abrígate».»** | No subrayar la pista del giro final. Reformulada para no sumar coletilla «Y + 3 palabras» |
| F7 | `pecera.js` MURMULLOS (Leoncio) | «Cuatro décimas. Yo tardaba una semana. Qué semanas aquellas.» | **Fuera el murmullo.** La frase se queda en la escena de la medida («…Bien hecha, eso sí.») | Se oían las dos en dos minutos. La cola de murmullos sigue con cuatro |

Y la línea que E6 quitó y que la crítica da por error de interfaz (F4): **E326**, «Le he mirado el reloj y se ha dado
cuenta.», **vuelve** tras «Si tiene prisa, se lo pongo por escrito.» y el tecleo (`administracion.dialogos.js`,
E_CORREO, tras `await api.wait(700);`). A 320×200 el gesto `reach` no se lee; con la línea, el corte de Evaristo es
un gag y no un fallo.

---

## §6 · Métrica

### 6.1 Global (corpus del auditor, sin `music.js`)

| | Cadenas | Remate seco | % |
|---|---:|---:|---:|
| Antes de E6 | 3.591 | 727 | 20,2 % |
| Hoy (E6) | 3.558 | 514 | 14,4 % |
| **Con E7** | **3.555** | **641** | **18,0 %** |

**Tope propuesto: 19,5 %** (valor real + 1,5): `TOPES_E6_JUEGO[0].pct` de 0.165 a **0.195** en `tools/plan-rules.mjs`
(y el comentario de `text-audit.mjs`, `test-e6.mjs` l. 21 y `GUIA_AUTORES.md` E6.2).

**Aviso por sala: de 22 % a 27 %** (`REMATE_SALA_AVISO.pct` 0.22 → 0.27; la peor queda en 25,5 %). Es aviso, no fallo,
pero `test-e6.mjs` l. 182 exige «ninguna sala > 22 %» y fallaría: hay que cambiarlo a la vez.

### 6.2 Por sala

| Fichero | Hoy | Con E7 |
|---|---:|---:|
| `ecosistema.js` | 21,7 % (40/184) | **25,5 %** (47/184) |
| `office.js` | 15,5 % (25/161) | **23,6 %** (38/161) |
| `pecera.dialogos.js` | 15,7 % (22/140) | 20,0 % (28/140) |
| `cpd.js` | 15,0 % (38/254) | 19,8 % (50/253) |
| `catacumba.js` | 17,6 % (58/329) | 19,5 % (64/328) |
| `sala_amazonas.js` | 12,4 % (30/242) | 19,0 % (46/242) |
| `pajarera.js` | 14,7 % (34/232) | 19,0 % (44/232) |
| `vestibulo.js` | 14,8 % (31/210) | 18,1 % (38/210) |
| `pecera.escenas.js` | 11,4 % (12/105) | 17,1 % (18/105) |
| `administracion.js` | 8,7 % (9/104) | 16,3 % (17/104) |
| `ecosistema.dialogos.js` | 13,2 % (5/38) | 15,8 % (6/38) |
| `pecera.secretaria.js` | 12,6 % (12/95) | 15,8 % (15/95) |
| `pecera.titulador.js` | 15,4 % (2/13) | 15,4 % (2/13) |
| `pecera.js` | 10,2 % (31/304) | 13,9 % (42/303) |
| `administracion.dialogos.js` | 9,5 % (11/116) | 11,1 % (13/117) |

Las dos salas que más suben (planta 2 y Vending) son justo donde la crítica echó en falta sonrisas (§4.1 de la
crítica: «en el ecuador del Acto II… ninguna carcajada»).

### 6.3 Por personaje (heurística de E6, `personas.mjs`; sin lo protegido; ≥ 10 cadenas)

| Personaje | Cadenas | Hoy | Con E7 |
|---|---:|---:|---:|
| Bruno | 1.042 | 11,3 % | 17,2 % |
| Anselmo | 86 | 20,9 % | 24,4 % |
| **Teodoro** (fax, exento) | 82 | 37,8 % | 39,0 % |
| Maripaz | 79 | 21,5 % | 29,1 % |
| Begoña | 76 | 13,2 % | 14,5 % |
| Custodia | 76 | 14,5 % | 18,4 % |
| Aurora | 73 | 14,9 % | 15,1 % |
| Gervasio | 72 | 20,8 % | 26,4 % |
| Yoli | 57 | 22,8 % | 28,1 % |
| Íñigo | 53 | 16,7 % | 22,6 % |
| Evaristo | 52 | 15,4 % | 21,2 % |
| Brais | 51 | 21,6 % | 23,5 % |
| Celestino | 46 | 19,6 % | 21,7 % |
| Eutimio | 30 | 9,7 % | 13,3 % |
| Leoncio | 30 | 19,4 % | 26,7 % |
| Gertrudis | 29 | 20,7 % | 27,6 % |
| D1 (coro) | 16 | 12,5 % | 18,8 % |
| Mercados | 13 | 15,4 % | 23,1 % |
| móvil de Borja (formato, exento en E6 §12.6) | 12 | 100 % | 100 % |

**Nadie pasa del 30 %** salvo los exentos (Teodoro por fax; el móvil de Borja, que es formato; D3 no llega a 10 cadenas).
Los más cerca: Maripaz (29,1 %) y Yoli (28,1 %): cualquier restauración más en ellas pide quitar otra.

### 6.4 Los demás topes, con E7 aplicada (copia; `text-audit` estático y completo)

Coletilla «Y/Con/Sin/Ni» 25 → **31 / 46** (E117, E121, E235, E306, E321, E352; por personaje, el máximo es Begoña con
6,6 %, tope 10 %) · «chaval» 11 → **10 / 12** · «criatura» **6 / 6** · año 33 → **34 / 35** (E150) · «táper» 17/17 ·
«Diecinueve años» 4/4 · «Era solo eso» 5/5 · «Lo que diga el Lector Medio» 5/5 · «Huele a 2019» 1/1 · «D3: No.» 6/6 ·
«lo único / la única» 5 → **6 / 8** (TIC-L1) · «No es X. Es Y.» 9 → 8 / 12 · duplicados audibles **0** · Leoncio
«Yo ya no» **2 / 2** (vuelve E124) · ninguna línea > 80 · `check.mjs` OK. **PLAN: OK · E2: OK · E5: OK · E6: 1 aviso
(el tope de remate seco, a subir).** La partida automática completa sobre la copia: 0 intervenciones > 80, 0 globos > 3
renglones, 0 topes por personaje, 0 coletilla por personaje.

---

## §7 · Pruebas que citan textos que cambian (`grep` en `tools/`)

Afirman el texto de hoy (hay que poner el nuevo) o comprueban que el viejo **ya no** se dice (hay que quitar o invertir
la comprobación). Generado con `greptools.mjs` (frases que desaparecen) y `greptools2.mjs` (frases que vuelven), y
filtrado a mano (fuera los falsos positivos: «Nada», «Siempre», «Creo», etc.).

| Prueba | Fila | Qué comprueba hoy | Cambio |
|---|---|---|---|
| `test-e6-pc.mjs:329` | E025 | logHas «Celestino, el conserje, con la bufanda del Ibex.» | → «Celestino, el conserje. Bufanda del Ibex.» |
| `test-e6-pb.mjs:98` | E344, X8, X9, X10 | lista `fuera`: «Me hacía falta», «Ayuda bastante», «¡Otra! ¡Ha entrado otra!», «Nos ganan. Tienen horario» no deben estar | quitar esas cuatro de la lista |
| `test-e6-pb.mjs:127` | E129 | «…del Titulator, por curiosidad.» | → «…un gráfico del Titulator.» |
| `test-e6-pb.mjs:166` | E118 | «…el papeleo, por procedimiento.» | → «…el papeleo. Es el procedimiento.» |
| `test-e6-pb.mjs:193` | E344 | Mirar el tótem: SIN_DESTINO y **sin** «Me hacía falta» | invertir: con «Me hacía falta» |
| `test-e6-pb.mjs:196` | E070 | última de Bruno === «…una salida en valor.» («sin el No.») | → «…sería una salida en valor. No.» |
| `test-e6-pb.mjs:230` | E124, E125 | «Encintar, no: aislar…» y «…Yo ya solo superviso.» | → «Encintar, no. Aislar el componente.» y «…Yo ya no leo. Superviso.» |
| `test-e6-i1.mjs:42` | E344 | SIN_DESTINO === «Un punto rojo: «ESTÁ AQUÍ». Gracias.» | → «…Gracias. Me hacía falta.» |
| `test-e6-pd.mjs:343` | E237 | TX: nuevo sin «Por si acaso.» | → el texto con «Por si acaso.», sin `viejo` |
| `test-e6-pd.mjs:378` | E155 | TX: sin «Un poco sí.» | → con «Un poco sí.» |
| `test-e6-pd.mjs:381` | E165 | TX: «…diapositiva, muy despacio.» y sin «Muy despacio.» | → «…diapositiva. Muy despacio.» |
| `test-e5-pd.mjs:343` | E156 | «No. Íñigo los tiene contados por colores.» | → «No. Íñigo los tiene contados. Por colores.» |
| `test-e6-pe.mjs:9, 208, 215` | E326 | «B9: «Le he mirado el reloj…» ya no se dice» | invertir: se dice tras «Si tiene prisa…» |
| `test-e6-pe.mjs:183` | E286 | «Debajo escribo «¿Y qué es?». Se borra solo.» | → «…Se borra solo. Por vergüenza.» |
| `test-e6-pe.mjs:189` | E297 | «…el formulario: catorce campos, ocho obligatorios.» | → «…el formulario. Catorce campos. Ocho obligatorios.» |
| `test-e6-pe.mjs:207` | E316 | «Don Evaristo Salvedad, Controlling, con corbata…» | → «…Controlling. Corbata de comas. Lupa al cuello.» |
| `test-e6-pe.mjs:216` | E322 | includes «Pase un segundo, que es una cosita muy pequeña.» | → «Pase un segundo. Una cosita. Muy pequeña.» |
| `test-e5-pe.mjs:224` | E324 | «begona_triplicado: Un sobre de azúcar caducado, del bolsillo…» | → «Un sobre de azúcar. Caducado. Del bolsillo de Ramírez, por el olor.» |
| `test-e5-pb.mjs:157` | X9 | `!logHas('¡Otra! ¡Ha entrado otra!')` | invertir |
| `test-e4.mjs:338` | TIC-P2 | «El quinto es para ti, por traérmelo.» | → «El quinto es para ti. Por traérmelo.» |
| `test-e4.mjs:439` | E134 | «Lo más leído de la web, impreso y clavado con chinchetas.» | → «Lo más leído de la web. Impreso y clavado con chinchetas.» |
| `test-e4.mjs:441` | E133 | «Esa ya está vieja; te imprimo otra.» | → «Esa ya está vieja, te imprimo otra.» |
| `test-comedia-p1.mjs:345-346` | E248, EXP-1 | «Herramientas, por el otro circuito, el rápido.» y «Esta casa da de alta…» | → «…otro circuito. El rápido.»; quitar la de Eutimio |
| `test-comedia-p2.mjs:108` | E121 | «Trescientos titulares esta tarde, sin CMS…» | → «…esta tarde. Sin CMS. Sin silla. Sin convenio.» |
| `test-comedia-p2.mjs:198` | E107 | «…mirándola, por respeto.» | → «Dejaron las chaquetas en las sillas, mirándola.» |
| `test-comedia-p2.mjs:266` | EXP-4 | ««abrígate». La cuenta de siempre.» | → «Y alguien ha comentado: «abrígate».» |
| `test-comedia-p2.mjs:276` | E103 | «…cuarenta y siete minutos, y comenta «abrígate» en todo.» | → «…minutos. Comenta «abrígate». En todo.» |
| `test-comedia-p2.mjs:303, 306` | E124, E125 | como en `test-e6-pb.mjs:230` | ídem |
| `test-comedia-p2.mjs:335` | E129 | «…por curiosidad.» | → sin «por curiosidad» |
| `test-comedia-p2.mjs:442` | E130 | «Quitar, no: absorber en plataforma.» | → «Quitar, no. Absorber en plataforma.» |
| `test-comedia-p3.mjs:141` | X12 | «CELESTINO, EXTENSIÓN 0.» | → «CELESTINO. EXTENSIÓN 0.» |
| `test-comedia-p3.mjs:216` | TIC-P1 | «Ahí lo tienes, por casillas.» | → «Ahí lo tienes todo, en casillas.» |
| `test-comedia-p3.mjs:390` | E322, E323 | «…que es una cosita muy pequeña.» y «…Bien centrado.» | → los originales («…Una cosita. Muy pequeña.», «…Bien centrado. Begoña tiene pulso.») |
| `test-comedia-p3.mjs:397` | E326 | `!logHas('Le he mirado el reloj')` | invertir |
| `test-comedia-p4.mjs:217, 407` | E306 | «Era una pregunta patrocinada.» (1 y 0) | → «Era una pregunta. Y un anuncio.» |
| `test-comedia-p4.mjs:243` | E278 | «Tadeo no lo ha leído; yo, sí.» | → «Tadeo no lo ha leído. Yo sí.» |
| `test-comedia-p4.mjs:274` | E191 | «Nadie lo toca: dicen que muerde.» | → «Nadie lo toca. Dicen que muerde.» |
| `test-comedia-p4.mjs:332` | E183 | «Se ve demasiado; estoy en ello.» | → «Se ve demasiado. Estoy en ello.» |
| `test-fase0.mjs:152` | E346 | «A: El del mostrador siempre está mascando algo: pídeselo.» | → «…mascando algo. Pídeselo.» |
| `test-e6.mjs:21, 182` | §6 | remate ≤ 16,5 % y «ninguna sala > 22 %» | 19,5 % y 27 % |
| `plan-rules.mjs:310, 320` | §6 | `pct: 0.165`, `REMATE_SALA_AVISO.pct: 0.22` | 0.195 y 0.27 (y los comentarios) |

No los cita ninguna prueba (verificado): las filas de Gertrudis E057/X13 (constantes), los tics TIC-S1…S5 y TIC-L1…L3,
EXP-2, EXP-3 y F7 (la línea de la escena, que se queda, sí está en `test-comedia-p2.mjs:305`, y no cambia). Ninguna
opción de menú del recorrido (`walk-data.mjs`) cambia: E138 es una opción de Custodia que el recorrido no elige por
texto.
