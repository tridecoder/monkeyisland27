# ENMIENDA E7 · «FE DE ERRATAS» — entrada al nudo, la tele, el duelo de Gervasio y los golpes que vuelven

> Enmienda única de la ronda E7: casa `E7_DISENO.md` y `E7_RESTAURA.md` con la lectura a la contra. Prevalece sobre los
> dos. Todo lo que cambia texto está en **una sola tabla de datos**, `e7/tabla_e7.mjs` (110 sustituciones o bajas, clave =
> literal de hoy, y 18 altas). El código del diseño y del motor está, como especificación ejecutable, en
> `e7/contra/disenio_patch.mjs` (34 parches literales `[fichero, viejo, nuevo]`); los fragmentos de abajo son los mismos.
>
> **Comprobado (scratchpad `e7/contra/`, nunca en el repo):** `node verifica_e7.mjs` → 110/110 «actual» existen literales
> hoy, 0 solapes, 0 líneas > 80, 0 «Como…», 0 palabras vetadas nuevas; tabla y 34 parches aplicados en `contra/copia/`,
> `node --check` OK. En la copia: `node tools/check.mjs` → **CHECK: OK**; `node tools/text-audit.mjs --estatico --plan --e2
> --e5 --e6 --recuento` → **PLAN OK · E2 OK · E5 OK · E6 OK** (con el tope de hoy, y con el nuevo); `text-audit` completo
> (partida automática de 49 pasos, 1.422 líneas oídas; lanzado antes de los dos últimos retoques —rótulo en la barra y
> condición de Mirar tele—, que no tocan el recorrido) → **TEXTOS: OK**; prototipo con navegador y ratón real
> (`contra/test-e7-proto.mjs`: D3 con trozos, interrupción, fallo de verdad, guardar/cargar a mitad, remate, F3, nudo
> completo por el sobre, tele con Usar) → **42/42, 0 errores de consola**. Capturas: `contra/copia/tools/shots/e7-proto-*.png`.

---

## §1 · Resumen y decisiones

**Qué hace E7** (cambios 1-4 de la crítica 6 §8, más F3, F4, F6 y los tics):

1. **Nudo del Acto II con entrada.** Dos pistas del mundo que dicen *qué falta* (papel) y *dónde* (Begoña, rechazado), sin
   decir *qué hacer*: Aurora (N1-N2) y Begoña (N3-N4). El sobre de azúcar abre el impreso de la nota en vez de cerrarlo
   (E3). «Importe cero» deja claro que aprobar no da papel (N5). «Mirar a Bruno» y la abuela, delante del fax, hablan del
   papel y no del CMS (`nota` también en `catacumba`). La ficha recuerda lo oído (N11) y el margen dice para qué importa
   el CMS (N9).
2. **Tele: Usar = Hablar** con «sin turno». «Wifi y rencor» pasa a Mirar y Cerrar.
3. **Gervasio, «no le pises la frase»** (`aTiempo` en `engine/duel.js`): escribe a trozos; contestar antes de que acabe le
   corta («Me has interrumpido. Se apunta.»), no cuenta fallo y el ataque vuelve a empezar.
4. **Restauración con criba**: de 274 filas de E6, **75 vuelven al original** (74 + E133, que el autor daba como tercera),
   **5 terceras** del autor entran, **194 se quedan podadas** (las 133 del autor + 61 que el autor devolvía y la contra no).
   Tics: «, por X.» 11 → 3 (y las 3 son naturales), «plantilla» 5 → 2, «se fue a las seis» 6 → 2. Explicaciones: fuera 3 de 4
   y F7; **la de «abrígate» se queda exactamente como está** (veto, §4.4).
5. **F3** (verbo colgado tras adjuntar), **F4** («¿Falta mucho?» como gag de acción), **F6** (escena de Anselmo en dos tiempos,
   −3 cadenas, se queda «Nos hemos quedado sin IA de la casa.»).

**Decisiones del director, aplicadas:** no hay cuarta casilla; la impresora de Marketing no entra (N12 fuera); «Varios» se
queda como chiste puro; la trampa del R07 se queda porque caer en ella **no cuenta fallo** y tiene respuesta propia
(«Me has interrumpido. Se apunta.»), es decir, cuesta menos que un fallo normal; F6 conserva «Nos hemos quedado sin IA de la
casa.»; la línea de «abrígate» no se toca.

**Métrica (deja de mandar):** remate seco 514/3.558 (14,4 %) → **585/3.565 (16,4 %)**. Tope nuevo = real + 1,5 = **17,9 %**.
Aviso por sala 22 % → **26 %** (peor: `ecosistema.js`, 24,6 %). Aviso nuevo por personaje (oídas): **30 %** (peor fuera del
fax: Gervasio, 26,1 %). Ningún otro tope sube.

**Saldo:** camino principal **−4 líneas**; reloj ≈ **−5 s** a velocidad normal (≤ +1 min). Cadenas en `content/`: +7.

---

## §2 · Diseño definitivo

### 2.1 El nudo del Acto II (F1)

**Partida mental de un jugador nuevo delante del fax sin papel** (Acto II, con ficha, sobre de azúcar y café gastado):

| # | Lo que hace | Lo que le dice el juego (E7) | ¿Qué sabe ahora? |
|---|---|---|---|
| 1 | Mira la ficha | «FIRMA: Teodoro solo habla por fax. Y el fax no tiene papel.» / «Al margen, a lápiz: «CMS en coma. Sistemas no atiende a nadie».» | Falta papel. El CMS es asunto de Sistemas (otra rama, no la del papel) |
| 2 | Mira a Bruno (o llama a la abuela) | Meta `nota` (N6): «Teodoro no habla sin papel. Y en esta casa no queda un folio sin sellar.» · abuela n1: «En las oficinas sin papel siempre hay una que lo gasta en decir que no.» | El papel lo tiene quien sella / dice que no |
| 3 | Habla con Aurora (la que le dio la ficha) | Opción nueva N1 «¿De dónde saco papel para el fax?» → N2 «Papel, en esta casa, solo gasta Begoña. Lo devuelve por triplicado.» **(pista del mundo 1)** | Begoña, y el papel vuelve en copias |
| 4 | Mira la ficha otra vez | FIRMA (N11): «FIRMA: el fax no tiene papel. El papel, en esta casa, sale de Begoña.» | Queda apuntado |
| 5 | Va a Begoña y le pide folios | N3 «¿Me da unos folios? Son para el fax de Teodoro.» → N4 «Folios no doy. De esta ventanilla solo sale papel rechazado.» **(pista del mundo 2)**. La opción de debajo es «Quiero presentar una nota de gasto.» | Para tener papel, algo tiene que salir rechazado |
| 6a | Le da el sobre de azúcar (lo más probable) | «¿Un sobre de azúcar? Sin nota de gasto, esto es azúcar.» (la de hoy) **y se abre el impreso**: «Uno: concepto. Dos: importe. Tres: justificante.» / «Y como me escribas «varios», te sello la frente.» | Está dentro de la nota |
| 6b | Hace la nota «bien»: «Importe cero» | «...Correcta. Aprobada. Vete. Me has hecho daño.» → N5 «Un trámite bien hecho, y ni un papel. Lo pongo en «logros».» y vuelve a B0 con la nota aún en el menú | Aprobada = sin papel. Hay que hacerla mal |
| 6c | «Varios» | El sello en la frente (carcajada; sin pista). Vuelve a B0 | Rechazar no basta si no hay copias (y se ríe) |
| 7 | «Café para entender el capitalismo» → importe → sobre | B_INSULTO → «Pues enséñeme…» → fotocopia de Gervasio + copias rechazadas (paso 30 de hoy) | Papel y segunda fuente |

**Llega a Begoña con dos pistas del mundo (Aurora y la propia Begoña) sin pedir ayuda**, y la tercera (el sobre, que ya
pone «Es casi un ticket.» en su descripción) mete al jugador en el impreso. Ninguna línea dice «haz una nota mal hecha»:
N2 dice dónde y en qué forma vuelve el papel, N4 dice que solo sale rechazado, N5 dice que aprobar no da papel. La idea de
«hazla mal» la junta el jugador. «Varios» se queda como chiste.

**N4, a la contra:** la del diseño («Folios, no doy. Lo que sale de esta ventanilla sale con sello de RECHAZADA.») repetía
«sale… sale» y nombraba el sello, que es casi la solución. La definitiva dice lo mismo en la voz seca de Begoña y sin el
sello: «Folios no doy. De esta ventanilla solo sale papel rechazado.» No es masticada: no dice qué rechazar.
**N5, a la contra:** «Aprobada, y ni una copia.» perdía el golpe («he hecho un trámite bien» es lo que hace gracioso
«logros»). La definitiva conserva el orgullo y dice lo que falta: «Un trámite bien hecho, y ni un papel. Lo pongo en
«logros».»

**Flags.** Nuevo (I1): `oyo_papel_begona` (bool, `startFlags` false; lo ponen N1 o N3; lo lee la ficha).

**Código** (exacto en `contra/disenio_patch.mjs`):

```js
// catacumba.js · dialogoAurora.A_MENU, justo después de «¿Cómo convenzo a Teodoro?»
{ text: '¿De dónde saco papel para el fax?', if: '!fax_con_papel', once: true,
  reply: 'Papel, en esta casa, solo gasta Begoña. Lo devuelve por triplicado.', setFlag: 'oyo_papel_begona' },

// administracion.dialogos.js
export const ENTRADA = { sobre: false };                          // antes de `export default`
// begona.onStart
onStart: async (api) => {
  if (ENTRADA.sobre) { ENTRADA.sobre = false; return; }           // E7 F1 (E3): por el sobre, directo al impreso
  await sayBe(api, 'Son las 19:07. Te quedan ocho minutos de existencia administrativa.');
},
// begona.B0, justo después de «Quiero presentar una nota de gasto.»
{ text: '¿Me da unos folios? Son para el fax de Teodoro.', if: ['acto_2_iniciado', '!nota_gasto_presentada', '!fax_con_papel'],
  once: true, reply: 'Folios no doy. De esta ventanilla solo sale papel rechazado.', setFlag: 'oyo_papel_begona' },

// administracion.js · import dialogos, { recorte, ENTRADA } from './administracion.dialogos.js';
const sobreANota = async (api) => {
  await sayBe(api, '¿Un sobre de azúcar? Sin nota de gasto, esto es azúcar.');     // literal de hoy
  if (api.flag('nota_gasto_presentada')) return;
  ENTRADA.sobre = true;
  try { await api.dialog('begona', 'B_NOTA'); } finally { ENTRADA.sobre = false; }
};
// actor Begoña:   'dar:sobre_azucar': sobreANota, 'usar:sobre_azucar': sobreANota,
// objeto ventanilla: 'usar:sobre_azucar': sobreANota, 'dar:sobre_azucar': sobreANota,

// pistas.js
M.nota = 'Teodoro no habla sin papel. Y en esta casa no queda un folio sin sellar.';
{ id: 'nota', …, salas: ['catacumba', 'ecosistema', 'administracion'], meta: M.nota, niveles: [ …tabla… ] }

// items.js
FICHA.firmaPapel = 'FIRMA: el fax no tiene papel. El papel, en esta casa, sale de Begoña.';
out.push(f('casilla_firma') ? FICHA.firma[2] : f('fax_con_papel') ? FICHA.firma[1] : f('oyo_papel_begona') ? FICHA.firmaPapel : FICHA.firma[0]);
```

(El `finally` de `sobreANota` es de la contra: si el árbol falla o se recarga, `ENTRADA` no se queda en `true` y el
siguiente «Hablar con Begoña» no pierde su saludo.)

**Comprobado contra `engine/objetivos.js`:** `actual(sala)` devuelve el primer pendiente del acto en curso cuyas `salas`
incluyen la sala; hoy en `catacumba` ningún objetivo del Acto II activo lo incluye (papel_fax/fuente/firma se activan tras la
nota) y cae en `P[0]` = `cms`. Con `catacumba` en `nota`, delante del fax manda `nota` (meta N6, pista n1 de `nota`); tras
`nota_gasto_presentada`, `papel_fax` (ya en `catacumba`). En Redacción y Sistemas sigue `cms`. `meta` admite cadena (se
usa cadena: la variante por función del diseño no hace falta, ver §11). Probado en el prototipo: `actual() === 'nota'` y
la meta N6 en `catacumba`.

**Meta y ficha del CMS (texto en la tabla):** `M.cms` = N7 «Con el CMS caído, en Sistemas no atienden a nadie.» (una sola
variante); margen = N9 «Al margen, a lápiz: «CMS en coma. Sistemas no atiende a nadie».» (una sola variante). La contra
quita las variantes «…ni el fax» del diseño: delante del fax sin papel, «Sistemas no atiende ni el fax» manda al jugador a
la rama del CMS, que es justo el atasco que sufrió el crítico.

**Respuestas a los intentos equivocados**

| Intento | Respuesta | Apunta a |
|---|---|---|
| Dar/Usar sobre con Begoña o la ventanilla | Línea de hoy + impreso (B_NOTA, sin saludo) | El impreso |
| Dar ficha a Begoña | «Tres casillas. Bien. Pero ninguna dice «importe».» (hoy) | La nota |
| «Importe cero» | N5 | Aprobada no da papel |
| Pedir folios a Begoña | N4 | Papel = rechazado |
| Preguntar a Aurora | N2 | Begoña, en copias |
| Mirar a Bruno / abuela delante del fax | N6 / `nota` n1 | El papel, sellado |
| Mirar la ficha | N11 (si oyó) + N9 | Dónde está el papel; el CMS es de Sistemas |
| Usar/Abrir el fax, Hablar con Teodoro | Sin cambio («SIN PAPEL»…) | Lo que falta |
| «Varios» | Sello en la frente (sin pista) | — (chiste) |
| Abrir la impresora de Marketing | Sin cambio (decisión: no entra) | — |

**Pistas `nota`** (en la tabla): n1 «En las oficinas sin papel siempre hay una que lo gasta en decir que no.» · n2 «¿Has
hecho la cuenta de gastos? Hazla mal, que las malas vuelven con copia.» · n3 «Lo que lleves en el bolsillo vale de
justificante. Y pídele una bien hecha.» / Bruno: «Nota de gasto a Begoña, con el azúcar. Y que me enseñe una bien hecha.»
`cms`, `papel_fax`, `fuente`, `firma` (con su `extra` del manual): sin cambio.

### 2.2 La tele (F2)

`sala_amazonas.js` (código exacto en el parche): `sinTurno(api)` = «sin turno» ∧ ¬`gertrudis_pregunta` ∧ ¬`reunion_terminada`.
`teleBuscando(api)` = nieve 1 s + ««BUSCANDO SEÑAL». Alguien con wifi y rencor la encontraría enseguida.» (literal de hoy).
`hablarTele(api, { usar })` y `teleSegunTurno(api, deHoy, { usar })`: con `sinTurno` y `usar`, va al árbol `tele_sala` (con
`usar`, la tele pasa a `buscando` y suena `click` antes del árbol); sin `usar` (Cerrar), `teleBuscando`.

| Verbo | Con atasco | Con `gertrudis_pregunta` | Con «sin turno» | Resto |
|---|---|---|---|---|
| Usar tele / Usar caja de cables | CONVOCADA (igual) | escena (igual: vía del Vending) | **árbol `tele_sala`** | rotación `TELE` / Acto III igual |
| Hablar tele | igual | igual | árbol (igual) | igual |
| Mirar tele | — | — | **«wifi y rencor»** (primera rama) | descripción de hoy |
| Cerrar tele | igual | igual | «wifi y rencor» (igual que hoy) | igual |

**No rompe nada:** la vía del Vending va antes (con `gertrudis_pregunta`, cualquier verbo lanza la escena); las cuatro vías
del atasco (empujar, cruasán, Rogelio, anuncio) empiezan con la tele ya en atasco y el extra `atasco` usa Hablar. Probado:
Usar tele → árbol → «¿Y cuáles son los siguientes pasos?» → `reunion_terminada`; Mirar → «wifi y rencor»; `text-audit`
completo (paso 28 con Hablar) OK. Pista `turno` n3 (tabla): «La tele: «Buenas noches, Gertrudis». Y lo de los pasos.»

### 2.3 El duelo de Gervasio: «no le pises la frase» (D3)

**Juicio a la contra.** Se entiende sin tutorial porque el primer «no» lo enseña: casi todo el mundo contesta en cuanto ve
el menú, Gervasio está escribiendo (la barra del correo lo dice, como un chat) y le corta con «Me has interrumpido. Se
apunta.», sin coste. Es gracioso, no incómodo, si las esperas son cortas: por eso **1,3 s por trozo** (con `timedMs`, nunca
menos que leerlo), tres trozos como mucho y la frase del R07 **acortada a 71 caracteres** (la del diseño tenía 85 y no cabía
en la regla de 80). Funciona igual con ratón, teclado (1-9) y táctil (todas eligen por `choose`; el `t0` de 250 ms evita el
doble toque). En modo rápido y con `instant` no hay trozos (la frase entera de golpe): el recorrido no cambia.

**La trampa del R07 se queda** (condición del director cumplida): empieza como el R03 («Esto se necesitaba para...») y acaba
en el R07 («…me consta que ya lo hablamos.»). Caer en ella (contestar R03 enseguida) es una interrupción: **0 fallos**, la
respuesta es «Me has interrumpido. Se apunta.» (luego, su rotación de `taunt`), y el ataque vuelve a empezar. Contestar R03
*con la frase acabada* es un fallo normal (uno, como cualquier otro). Nunca cuesta más que un fallo normal.

**Rótulo, a la contra:** el diseño lo ponía bajo la ventana; en la captura tapaba la cabeza de Gervasio (que está en la
puerta, justo debajo). Va **en la barra del título**, entre «RESPONDER A TODOS» y el marcador: «escribiendo» + 1-3 puntos
(como la cabecera de un chat; el «De: Gervasio Acta» está justo debajo). Captura `e7-proto-escribiendo.png`: se lee y no
tapa a nadie.

**Asaltos:** como hoy, mazo `['R07', 'R03', 'R01', 'R05']`, `winScore: 2`, `maxMisses: 3`, remate a los 2 con la fotocopia
(`remateHidrovoltia`, sin trozos). R01 y R05 solo tras un fallo. Ninguna réplica nueva.

**Datos (`pajarera.js`, `dueloGervasio`, antes de `intro`):**

```js
aTiempo: {
  ms: 1300, escribiendo: 'escribiendo', interrumpe: 'Me has interrumpido. Se apunta.', sostener: 'movil',
  trozos: {
    R07: ['Esto se necesitaba para...', 'para cuando...', 'me consta que ya lo hablamos.'],
    R03: ['El acta se necesitaba para...', 'para...'],
    R01: ['Ya se dijo en el otro correo...', 'ese que no se leyó...'],
    R05: ['Lo del acta, entre tú y yo...', 'que no salga de esta puerta.'],
  },
},
```

`attackText` se queda como está (respaldo si un día se quita `aTiempo`). `hurtByPair.gervasio.R07` («Me consta que...
Bueno. Se constaba.») encaja. Frases enteras en el cuerpo: R07 «Esto se necesitaba para... para cuando... me consta que ya lo
hablamos.»; R03 «El acta se necesitaba para... para...» (la de E6, intacta: `play-mouse` la sigue encontrando en el log).

**Cómo se ve (320×200):** globo de Gervasio con el primer trozo; menú abierto a la vez; la barra «escribiendo...»; el cuerpo
crece trozo a trozo con un `click`; si pasa de dos líneas, se ven las dos últimas con «...» delante; al acabar, se va el
rótulo y Gervasio suelta el móvil. Al interrumpir: Bruno, cortado («Ayer no puedo...», «A ti te consta...»), y Gervasio.

**Pistas `acta`** (tabla): n1 igual; n2 «A ese señor no le pises las frases, hijo. Espera a que se le acaben.»; n3 «Cuando
deje de escribir, contéstale. Y al final, su cuenta de la comida.» / Bruno: «Gervasio: esperar a que acabe de escribir.
Remate: su nota de la comida.» (`duelo: 'gervasio'` sigue añadiendo dónde está la réplica que falte).

**Clímax y otros duelos:** D1 (Maripaz), D2 (Teodoro) y D4 (Íñigo) no llevan `aTiempo`: el motor hace exactamente lo de hoy.
Gervasio en el clímax no tiene duelo. Revancha: la interrupción no mueve el mazo.

### 2.4 F3, F4, F6

**F3 (confirmado).** `updateHover` deja `ui.hover` en el objeto del inventario bajo el ratón mientras se elige; nadie lo borra
al resolver `pickItem`. P0, `engine/core.js`: en la `resolve` de `pickItem`, `this.ui.hover = null; this.ui.sentence = null;`
y en `sentenceText`, `if (h && h.kind === 'inv' && !this.state.inventory.includes(h.id)) h = this.ui.hover = null;`.
Probado: tras adjuntar la fotocopia con el ratón quieto, la barra dice «Ir a».

**F4 (confirmado; gana la acción, no vuelve E326).** `administracion.dialogos.js`, E_CORREO «¿Falta mucho?»:

```js
do: async (api) => {
  await api.anim(api.player, 'reach', 700);                 // Bruno mira el móvil (más largo)
  await sayEv(api, 'Si tiene prisa, se lo pongo por escrito.');
  api.faceActor(EV, 'up');                                  // de espaldas: lo pone por escrito, de verdad
  for (let i = 0; i < 3; i++) { api.sfx('typewriter'); await api.wait(380); }
  if (api.once('administracion_evaristo_por_escrito')) api.notice('Correo nuevo de Evaristo Salvedad: «Una cosita (1 de 3)».');
},
```

El aviso, solo la primera vez (la contra añade `once`: la segunda, la regla de despedidas calla la línea y el gesto basta).
Paga el «Son tres.» de su saludo siguiente. «Le he mirado el reloj y se ha dado cuenta.» (E326) **no vuelve**: con la acción
y el aviso, la línea de Bruno sería un segundo golpe que explica el primero. Si la captura `e7-f4-evaristo.png` no deja leer
que Evaristo se ha ido a escribir, se cambia el aviso por E326 (una cosa o la otra, nunca las dos).

**F6 (confirmado).** Dos tiempos: (a) «ACCESO REVOCADO» → Anselmo «Revocado. Fecha: hoy. Efectos: julio.»; (b) paseo hacia
Infografía → **«Nos hemos quedado sin IA de la casa.»** (se queda: a 320×200 un giro de sprite no se lee seguro, y es su
lógica de «la casa», no una traducción) → mira el portátil, aparta la vista, lo vuelve a mirar (`faceActor` derecha 700 ms,
izquierda 400 ms) → Leoncio pone las manos (el `reach` de hoy) → pantalla de Herminia (la de hoy) → `wait(600)` → Anselmo
vuelve **sin decir nada**. Fuera (tabla F6a-c): «Y en nuestros corazones, Brais está en HECHO.», «Integró una IA que era un
becario. Y rechaza una IA que es una IA.», «...Lo miro en la próxima versión.» Saldo −3 en el paso 45.

---

## §3 · Restauración: recuentos finales y criterio

**Criterio aplicado (el del dueño, sin «en la duda, vuelve»).** Vuelve el original solo si es *claramente* mejor: (a) recupera
un golpe que la poda quitó y que **gira** la frase («Suben.», «Estoy de miedo.», «Tienen horario.», «Lo dejo abierto.»), o
(b) deshace una fusión que **enterraba** el golpe (la cifra, la revelación o el giro necesitaban su pausa: «214
respuestas.», «Es de plástico.», «Rojo.», «Asiente.»), o (c) quita un tic («, por X.», punto y coma en boca de alguien).
Se queda podada si lo que vuelve es: un segundo chiste apilado, una coletilla que comenta, un cambio de puntuación sin golpe
ganado, o una línea del hilo de «abrígate».

| | Filas de E6 |
|---|---:|
| **Vuelven al original** | **75** (74 «O» del autor + E133, tercera del autor → original) |
| **Terceras opciones del autor que entran** | **5** (E046, E107, E129, E265, E324) |
| **Se quedan podadas** | **194** (las 133 del autor + 55 «O» y 6 «T» que la contra no devuelve) |
| Total | 274 |

Fuera de las 274: 4 tics del autor tal cual (TIC-P1, S3, S4, S5), 6 tics reescritos por la contra (TIC-P2, S1, S2, L1, L2,
L3: ver §4), 4 explicaciones fuera (EXP-1, 2a, 3, F7) y 1 reescrita (EXP-2b); EXP-4 vetada. Más 14 filas de diseño. Total
de la tabla: **110 filas** (RES·O 75 · RES·T 5 · RES·tic 4 · RES·expl 5 · CONTRA 7 · DIS 14) y 18 altas.

**Las que el autor devolvía y la contra no (61):**

| Fila | Fichero | Propuesta del autor | Por qué no vuelve |
|---|---|---|---|
| E006 | `game.js` | No pienso empujar eso. Saldría en el próximo comité. En diapositiva. | hoy es natural y el golpe ya está («diapositiva»); «En diapositiva.» sería coletilla |
| E015 | `vestibulo.js` | Tú pregúntame por el Ibex de vez en cuando. Por si acaso. | coletilla que explica el miedo (ya está en «de vez en cuando») y 4.º «Por si acaso» |
| E020 | `vestibulo.js` | Etiqueta: «SEGURIDAD — NO RETIRAR». Sigue encendido. | sin golpe ganado; «El piloto sigue encendido» se entiende mejor |
| E022 | `vestibulo.js` | Le pregunto qué hay que hacer para tener plaza. El cuadro calla. Sabe cosas. | segundo chiste que comenta («Sabe cosas»): la crítica la da por neutra |
| E025 | `vestibulo.js` | Celestino, el conserje. Bufanda del Ibex. | ficha sin golpe: la fusión es natural |
| E037 | `office.js` | Recalentar un café de Gertrudis delante de ella. No. | hoy es natural; el «No.» final no gira nada |
| E039 | `office.js` | Darle café a la máquina de enfrente de Gertrudis. Sería una provocación. | solo cambia la puntuación; sin golpe |
| E044 | `office.js` | Una hoja: «PORRA: ¿QUIÉN DEJA ANTES SU PLAZA?». Cinco euros. | «Cinco euros» ya está en el cartel; sin golpe ganado |
| E062 | `office.js` | El yogur de Ramírez. Caducado. Dijo que volvía antes. | tercera: críptica; la de hoy se entiende y golpea |
| E074 | `pecera.js` | La cinta dice NO DESENCHUFAR. No dice NO COGER. Pero se sobreentiende. | el golpe («se sobreentiende») sigue igual con la coma |
| E081 | `pecera.js` | Si me siento con su chaqueta en la mano, Ramírez vuelve. Es tradición. | solo puntuación: «es tradición» ya golpea tras los dos puntos |
| E084 | `pecera.js` | No me la pongo aún. Primero la descuelgo. Hay un orden. | «Hay un orden.» comenta el gesto (coletilla) |
| E103 | `pecera.dialogos.js` | Menos una lectora: cuarenta y siete minutos. Comenta «abrígate». En todo. | hilo de «abrígate»: el final cita la frase de hoy («comenta «abrígate» en todo»); no se toca |
| E110 | `pecera.dialogos.js` | Me han absorbido en plataforma. Sigo aquí, supervisando. Desde Desarrollo. | tercera: otro «supervisando» de Leoncio; la de hoy basta |
| E113 | `pecera.dialogos.js` | Tenía alta. Estaba en mis sistemas. Todo en regla. | «Todo en regla.» es un tercer tiempo antes de la pausa |
| E125 | `pecera.escenas.js` | Encintar, no. Aislar el componente. | solo puntuación: el eufemismo ya se oye |
| E130 | `pecera.escenas.js` | Quitar, no. Absorber en plataforma. | ídem |
| E134 | `pecera.escenas.js` | Lo más leído de la web. Impreso y clavado con chinchetas. | tercera: sin golpe ganado |
| E138 | `pecera.secretaria.js` | Para tenerlo. Por si acaso. | es la opción que Custodia cita entre comillas: la coma es habla natural, no remate |
| E139 | `pecera.secretaria.js` | Un muerto sin que se lo pida. Qué raro. | «Qué raro.» comenta; «No me había pasado nunca» es más Custodia |
| E141 | `pecera.secretaria.js` | Él desayuna despacio. Yo apunto rápido. | solo puntuación; la antítesis ya se oye |
| E144 | `pecera.secretaria.js` | Abierta dos dedos. Lo que cabe un boli. | tercera: sin golpe ganado |
| E166 | `pajarera.js` | Todos los relojes marcan las 20:59. La sala es de Ramírez. Siempre. | «Siempre.» coletilla tras dos chistes |
| E176 | `pajarera.js` | El Lector Medio. Cartón pluma a tamaño real. Lo encargó Marketing. | tercera: sin golpe ganado (dos claves) |
| E179 | `sala_amazonas.js` | No se enciende. El mando lo tiene alguien de Mercados. En el Vending. | sin golpe; «En el Vending» es dato (y es la tele de E7) |
| E180 | `sala_amazonas.js` | Uy. Eso tiene tarifa. | sin golpe; Maripaz ya sube al 24-25 % |
| E182 | `sala_amazonas.js` | Hueco libre: veintitrés líneas. Impar, y sin un banner. Me duele. | tercera: «Me duele.» es coletilla tras el chiste |
| E184 | `sala_amazonas.js` | Me han puesto un ronquido en espera. Cuelgo. Vuelvo con Maripaz. | sin golpe ganado |
| E187 | `sala_amazonas.js` | Diapositiva 247 de 400: «Sinergias exponenciales: el viaje». No hay vuelta. | dos chistes apilados |
| E188 | `sala_amazonas.js` | Lo empujo un poco. Zumba. La 247 aguanta. | solo ritmo; sin golpe ganado |
| E189 | `sala_amazonas.js` | Si lo apago, Íñigo presenta a oscuras. Lo haría igual. | «y lo haría igual» ya golpea |
| E191 | `sala_amazonas.js` | El punto 3. Nadie lo toca. Dicen que muerde. | «dicen que muerde» ya golpea tras los dos puntos |
| E195 | `sala_amazonas.js` | Los alineo. Catorce en fila. Parecen un comité. | ya golpea; y «comité» está en E016 |
| E197 | `sala_amazonas.js` | Si me llevo un cable, alguien no podrá presentar. Tentador. No. | la crítica la da por neutra; el «No.» comenta |
| E200 | `sala_amazonas.js` | ¿Cogerme? Antes, el formulario de contacto, cariño. Catorce campos. | mismo chiste que E297 en otra sala; ninguno de los dos vuelve |
| E219 | `catacumba.js` | La ficha, después. Primero, contéstame. Si puedes. | sin golpe ganado |
| E225 | `catacumba.js` | Corro la cortina. Teodoro la vuelve a abrir sin mirar. Vigila el fax. | sin golpe ganado |
| E227 | `catacumba.js` | Un tipómetro: la regla de medir texto. Teodoro lo lleva encima. Duerme con él. | frase hecha natural; «Duerme con él.» no es mejor |
| E248 | `cpd.js` | Herramientas, por el otro circuito. El rápido. | «el rápido» ya golpea tras la coma |
| E297 | `ecosistema.js` | ¿Cogerme? Rellena antes el formulario. Catorce campos. Ocho obligatorios. | mismo chiste que E200 |
| E306 | `ecosistema.dialogos.js` | ¿Seguro que quieres salir? Era una pregunta. Y un anuncio. | hoy es mejor: «pregunta patrocinada» es un golpe; el original son dos |
| E316 | `administracion.js` | Don Evaristo Salvedad, Controlling. Corbata de comas. Lupa al cuello. | ficha sin golpe |
| E317 | `administracion.js` | Gracias. ¿Lleva ticket? No lo digo yo. Lo diría Begoña. | se contradice (lo está diciendo); hoy es natural |
| E318 | `administracion.js` | Gracias. Lo leo y le escribo. Un correo. Muy pequeño. | el diminutivo ya está; partirlo no añade |
| E322 | `administracion.dialogos.js` | Pellejo, con jota. Pase un segundo. Una cosita. Muy pequeña. | cuatro frases para un saludo; «una cosita muy pequeña» ya es su voz |
| E323 | `administracion.dialogos.js` | Lleva «RECHAZADO» en la frente. Bien centrado. Begoña tiene pulso. | «Begoña tiene pulso.» comenta el sello (coletilla) |
| E326 | `administracion.dialogos.js` | (inserción) Le he mirado el reloj y se ha dado cuenta. | F4 lo resuelve con acción; con las dos, sobra una |
| E331 | `items.js` | Duplicado y triplicado de mi nota de gasto. Sello: RECHAZADA. Dos veces. | descripción de objeto sin golpe ganado |
| E346-E352, E354-E357 | `pistas.js` | (11 pistas partidas en dos frases) | pistas: la de hoy es clara; partirlas no añade (E352 sería coletilla) |
| X12, X13 | `office.js` | CELESTINO. EXTENSIÓN 0. / NO RECOJO CADÁVERES. PRUEBE EN SECRETARÍA. | pantalla de Gertrudis: sin golpe |

(Las 75 que vuelven y las 5 terceras están, con su texto final, en el anexo A y en `tabla_e7.mjs`.)

**Las 48 que se quedan por un tope lleno (año, táper, «Diecinueve años», «Era solo eso», «Lo que diga el Lector Medio»,
«Huele a 2019», «Perdón», «próxima versión», «desde»): revisadas una a una, ninguna se cambia por otra aparición.**
- **«táper» (11 filas):** ninguna supera a las 17 que hay; el «¿Traéis táper?» de Brais (E335) ya existe en `cpd.js` («¿Traes
  táper?»), y «¡Despeje del mostrador!» (E029, hoy) es mejor narración de Celestino que «¡Táper rechazado!».
- **«Diecinueve años» (E051, E052, E198, E199):** E198 («Diecinueve años. Ni un marrón. Ni uno.») repetiría «Diecinueve años sin
  un marrón» del `onWin` de D3; las otras tres, hoy, son naturales.
- **«Era solo eso» (E009, E010):** las 5 que hay son cierres de llamada que pagan; E009/E010 añadirían un sexto cierre al mismo
  hilo.
- **«Huele a 2019» (E082, E327):** la que hay (la chaqueta) es la mejor; E082 era el tercer golpe de una línea.
- **Año (queda 1 hueco, 34/35):** se usa en E150 («OCUPADO hasta 2031»), donde el año es el chiste. No se gasta el último
  (E301 «hasta 2030» sería el mismo chiste en otra sala; E097 «en 2033», igual).
- **«Lo que diga el Lector Medio» (E177, E209), «Perdón» (E250, E371), «próxima versión» (E112), «desde» (E325):** las de hoy
  son naturales y no pierden golpe. (F6 libera un «próxima versión» de Anselmo; no se gasta: E112 sería un golpe apilado.)

**Por personaje** (heurística de cadenas del autor, `personas.mjs`, sin lo protegido): nadie con ≥ 10 cadenas pasa del 30 %
salvo los exentos (Teodoro por fax, el móvil de Borja, que es formato). Los más altos: Yoli 29,8 % (13/57 → 17/57), Leoncio
27,6 %, Gervasio 24,7 %, Maripaz 24,1 %, Íñigo 24,0 %. Sobre lo **oído** en la partida automática (lo que mide el auditor):
Gervasio 26,1 %, Maripaz 25,0 %, Celestino 24,2 %, Anselmo 22,2 %, Íñigo 22,0 %, Brais 21,4 %; Bruno 15,2 %.

---

## §4 · Tics y explicaciones

### 4.1 «…, por X.» (11 → 3, y las 3 son habla natural)
Vuelven con punto: E149 (Gervasio, «Es el reglamento.»), E252 («Por respeto.», el único), E313 (Begoña, «Por
principios.»), E118 (Brais, «Es el procedimiento.»). Fuera: E107 y E129 (terceras del autor), TIC-P1 («Ahí lo tienes todo, en
casillas.»). **TIC-P2, a la contra:** «Cinco. El quinto es por traérmelo.» (ni coma-tic ni remate añadido: el golpe es el
quinto tachón; «El quinto es para ti. Por traérmelo.» del autor era un remate seco nuevo). Quedan: «Y la tuya, por
triplicado.» (Begoña, prepara los tres sellos), «Todavía no. Primero, por escrito.» y la opción «Para tenerlo, por si acaso.»
(Custodia la cita: E138 no se toca). «Por si acaso» como remate: solo vuelve E237 (Aurora); E015 no.

### 4.2 «plantilla» (5 → 2: el ficus de Mirar y el foco de Eventos, protegido)
- **TIC-L1 (ficus, Dar), a la contra:** «No acepta nada: ni regalos ni sugerencias.» Se quita el tic y no se mete chiste
  nuevo. La del autor («Es la única del edificio que no se deja comprar.») sumaba «la única» (tope) y un chiste explicado.
- **TIC-L2 (jefes de cierre), a la contra: fuera la cadena.** Con E229 («…Todos con bigote.») el golpe es el bigote; «El
  bigote venía con el cargo.» sería un segundo chiste sobre el primero.
- **TIC-L3 (Libro de Estilo), a la contra:** «El Libro de Estilo.» El chiste es la línea que sigue («Página 1: «No se dice a
  nivel de»…»); «Más grueso que el convenio» apilaba otro.

### 4.3 «se fue a las seis (y media)» (6 → 2: el móvil de Borja y las sillas con chaqueta)
TIC-S3 (Leoncio, «Ficharon y se fueron. Herminia no ficha.»), TIC-S4 («Los nueve tuppers siguen en la cola. Nadie viene a
por ellos.»), TIC-S5 («Los tickets nunca se van a casa. Y yo...»): del autor, entran. **TIC-S1/S2 (Tadeo), a la contra:**
«El portátil de Tadeo, de Negocio.» y fuera «Su portátil, no.»: lo de «el portátil sigue reenviando» era el mismo chiste que
el móvil de Borja, en la misma sala, y los «RV:» que siguen ya lo enseñan.

### 4.4 Explicaciones y el veto de «abrígate»
- **EXP-1** (Eutimio, «Esta casa da de alta antes a un portátil que a un chaval.»): fuera. Brais la paga.
- **EXP-2** (Aurora): fuera «Abre interrogación y cierra con punto.»; queda «Eso, criatura, es una sentencia.» (la de la
  crítica). «criatura» sigue en 6/6.
- **EXP-3** (`escenas/climax.js`, entrada al clímax, no es la cadena final): fuera «Él cree que avanza. El Lector Medio cree
  que asiente.»; queda el dato del proyector.
- **F7** (murmullo de Leoncio «Cuatro décimas…»): fuera; la frase de la escena se queda.
- **EXP-4 (Yoli, «Y un comentario: «abrígate». La cuenta de siempre.»): VETO. Se queda EXACTAMENTE como está, y no se
  busca otro corte.** Leído en contexto (`pecera.escenas.js` `viral`, `pecera.dialogos.js` E103 y `escenas/final.js:200`): el
  final dice «Menos esa cuenta que comenta «abrígate» en todo...». Ese «esa cuenta» presupone que el jugador ya ha oído que
  hay *una cuenta* recurrente; la única vez que lo oye **todo** jugador es en la escena viral («La cuenta de siempre»), porque
  E103 está en una opción opcional de Yoli. Quitarlo no adelanta nada, pero cambia lo que el jugador sabe al llegar al
  final (le quita la siembra de «esa cuenta»). Hay duda, luego no se toca. Por el mismo motivo **E103 no vuelve** (el final
  cita su forma de hoy: «comenta «abrígate» en todo»). Ninguna fila toca `escenas/final.js` ni el epílogo.

---

## §5 · Motor (P0)

### 5.1 `aTiempo` en `engine/duel.js` (opt-in; código exacto en `contra/disenio_patch.mjs`, `MOTOR`)

**API (datos del rival):**
```
aTiempo: {
  trozos: { <pairId>: [trozo0, trozo1, …] },   // sin entrada para un pairId → ese ataque es el de siempre
  ms: 1300,                                     // mínimo entre trozos (game.timedMs('duelo', trozo, ms) lo sube si no da para leerlo)
  escribiendo: 'escribiendo',                   // rótulo en la barra del título, + 1-3 puntos (cada 400 ms de realTime)
  interrumpe: 'Me has interrumpido. Se apunta.',// 1.ª interrupción del duelo; las siguientes, la rotación `taunt`
  sostener: 'movil',                            // opcional: item que el rival sostiene mientras escribe (api.sostener)
}
```
Exporta además `TROZO_MS = 1300` y `cortada(t)` (lo que dice Bruno al ser cortado: hasta el primer `. , : ; ? !` o las tres
primeras palabras, lo que sea más corto, + «...»; quita «¡¿«" » del principio).

**Estados y reglas** (en el sitio del ataque de `runDuel`):
1. Con `trozos[pid]`: el rival dice `trozo0` en su globo (`say`), `S.cola = true`, cuerpo = `trozo0`.
2. `tl = { done, cancel }`; `done = trozos.length < 2 || game.instant` (modo rápido, `skipCut`): entonces el cuerpo es la
   frase entera y no hay rótulo ni temporizador.
3. Si no: `S.escribiendo = rótulo`, `info.escribiendo = true`, `sostener`; tarea en segundo plano que, para cada trozo,
   duerme con `game.sleep` (tiempo de juego: el menú de pausa la congela) y, **si `tl.cancel` o `!vivo()`**, sale; si no,
   cuerpo = trozos hasta k, `sfx('click')`. Al acabar: `done`, fuera rótulo y móvil, y un `aviso` en el log con
   `{ who: 'aviso', name: <from>, text: <frase entera> }` (no se oye; no suma topes de Gervasio).
   `vivo()` = `game.duelActive === <este duelo> && game.gen === <gen al empezar>`: **imprescindible**, porque
   `resetRuntime()` (cargar) resuelve todos los temporizadores de golpe y el `finally` del duelo huérfano no corre nunca.
4. Se abre el menú como siempre. Al elegir, **si `tl && !tl.done`** (cualquier opción: réplica, larga, floja o comodín):
   `paraEscritura()` (cancela, quita rótulo y móvil), `S.interrumpeN++`, `info.phase = 'interrumpido'`, Bruno dice
   `cortada(texto)`, el rival dice `interrumpe` (la 1.ª) o `next('taunt')`; `continue` → **el mismo ataque desde el primer
   trozo**. No cambian `misses`, `re`, CC, mazo, `round`, `comodinUsed`.
5. Si `tl.done`: lo de hoy (acierto, fallo, floja, comodín, larga).
6. `finally` del duelo: `paraEscritura()` antes de lo de hoy. Esc durante el menú abre la pausa (el `choose` del duelo no
   tiene `escape`): la escritura se congela y sigue al volver.
7. `drawHud`: con `S.escribiendo`, el rótulo en la barra del título centrado entre el título y el marcador (color `#c8d8ff`
   en correo, `barText` en fax); con `S.cola` y más de dos líneas de cuerpo, se ven las **dos últimas** («...» delante).

**Para pruebas** (`game.duelInfo`, y `__game.state().duel`): `escribiendo` (bool), `interrumpeN` (n), `phase`
`'interrumpido'` mientras se resuelve una interrupción, `body` (crece). Sin `aTiempo`, los campos valen `false`/`0`.
**No afecta** a D1, D2, D4 ni al clímax (prototipo + `text-audit` completo con el recorrido entero en verde).

### 5.2 F3 en `engine/core.js`
Ver §2.4 (dos líneas). Probado con ratón real.

`docs/CONTENT_SCHEMA.md` §10 (I2): entrada «E7 `aTiempo`» junto a `cabe`, con la API de arriba.

---

## §6 · Recorrido y extras

**`walk-data.mjs`: los 49 pasos no cambian** (el 28 sigue con Hablar; el 30, por el menú; el 46, en modo rápido sin trozos).
Solo el `txt` descriptivo de 45 («… [E7 F6: dos tiempos]») y 46 («… [E7: Gervasio escribe a trozos; en modo rápido, entera]»).
Probado: `text-audit` completo en la copia recorre los 49 pasos.

**Extras nuevos** (I2, `extras.mjs`):
- **XE7-N1** (tras 29): Dar sobre a Begoña → línea de hoy, sin «Son las 19:07…», B_NOTA → «Café…» → «Lo que sea.» → sobre →
  «Pues enséñeme…» → fotocopia + copias, `nota_gasto_presentada` (alternativa al 30). Variante: Usar sobre con la ventanilla.
- **XE7-N2** (tras 16): Aurora «¿De dónde saco papel para el fax?» → N2, `oyo_papel_begona`; ficha con N11 y N9; Begoña
  «¿Me da unos folios?…» → N4; la opción no vuelve.
- **XE7-N3** (tras 29): B_NOTA «Importe cero» → N5; B0 conserva «Quiero presentar una nota de gasto.».
- **XE7-T1 / T2** (tras 27): Usar `tele_amazonas` / Usar `caja_cables` → árbol → «¿Y cuáles son los siguientes pasos?» →
  `gertrudis_pregunta`, `reunion_terminada`; cargar.
- **XE7-F4** (tras 30): Evaristo «¿Para qué me ha llamado?» → «¿Falta mucho?» → aviso «Correo nuevo de Evaristo…» en el log;
  segunda vez, sin aviso.
- **XE5-10** cambia: `V('mirar', 'tele_amazonas')` en vez de Usar (el log sigue buscando «wifi y rencor»).

---

## §7 · Topes y regex

`tools/plan-rules.mjs` (I1):
- `TOPES_E6_JUEGO[0]`: `pct: 0.165` → **`0.179`** y `txt: 'remate seco (E6 §8, E7): ≤ 17,9 % de las cadenas'`
  (real con E7: 585/3.565 = 16,4 %; +1,5).
- `REMATE_SALA_AVISO.pct`: `0.22` → **`0.26`** (peor: `ecosistema.js` 24,6 %; luego `office.js` 20,5 %, `cpd.js` 19,4 %).
- **Nuevo, aviso (nunca fallo):** `REMATE_PERSONAJE_AVISO = { minimo: 20, max: 0.30, fuera: ['fax', 'lector_medio', 'aviso'] }`
  y `rematePorPersonaje(lines)` sobre las líneas **oídas** `[{ who, text, room }]` (sin `room === 'eventos'`): quien tenga ≥ 20
  líneas distintas y pase del 30 % de `esRemateSeco`, aviso. Con E7, el más alto es Gervasio (6/23 = 26,1 %).
  `text-audit.mjs` lo enseña en la sección E6 junto al aviso por sala («[E7] Remate seco por personaje > 30 % (aviso)»).
- Comentarios: la cabecera de `text-audit.mjs` (línea de E6 §8), `test-e6.mjs:21` y `GUIA_AUTORES.md` E6.2 (16,5 → 17,9; 22 → 26).
- **Ningún otro tope cambia.** Recuento con E7 aplicada (copia): coletilla 25 → **29**/46 · «chaval» 11 → **10**/12 · «criatura»
  6/6 · año 33 → **34**/35 · táper 17/17 · «Diecinueve años» 4/4 · «Era solo eso» 5/5 · «Lo que diga el Lector Medio» 5/5 ·
  «Huele a 2019» 1/1 · «D3: No.» 6/6 · «lo único / la única» 5/8 · «No es X. Es Y.» 9 → **8**/12 · «primera vez» 4/5 · «Mi
  primer» 5/6 · «factur» 9/11 · «de la casa» 15 (recuento) · duplicados audibles 0 · coletilla por personaje 0 · topes por
  personaje 0 · líneas > 80: 0.

---

## §8 · Saldo y reloj

| Partida | Cadenas | Camino principal (líneas) | Reloj (normal) |
|---|---:|---:|---:|
| Nudo (N1-N4, N6, N11 altas; N5, N7, N9 y pistas sustituyen) | +6 | 0 (todo opcional) | 0 |
| Tele | 0 | 0 | 0 |
| D3 (`aTiempo`: 9 trozos, interrumpe; `attackText` se queda) | +9 (8 «texto») | 0 globos más (el aviso no se dice) | ≈ +4 s (2 × 1,3 s en R07, 1 × 1,3 s en R03) |
| F4 (aviso) | +1 | 0 | 0 |
| F6 | −3 | **−3** | ≈ −8 s (+1,7 s de gesto) |
| EXP-3 (clímax) | −1 | **−1** | ≈ −2 s |
| EXP-1, EXP-2a, F7, TIC-L2, TIC-S2 | −5 | 0 | — |
| Restauración (75 + 5 + tics) | 0 (se cambian, no se añaden) | 0 | ≈ +2 s (colas cortas oídas en el camino) |
| **Total** | **+7** (3.558 → 3.565 en el corpus del auditor) | **−4** (≤ +6 ✓) | **≈ −5 s** (≤ +1 min ✓) |

Cada interrupción voluntaria en D3 cuesta ≈ 3 s (no está en el camino). En modo rápido: −4 líneas.

---

## §9 · Paquetes (ficheros disjuntos)

Orden: **P0 ∥ I1 → PA ∥ PB ∥ PC ∥ PD ∥ PE ∥ PF ∥ PG ∥ PH → I2**. Cada paquete aplica SOLO las filas de `tabla_e7.mjs`
de sus ficheros (clave: literal de hoy; `nuevo: null` = quitar la cadena del array o la línea `await api.say*(…)` que la
dice) y los parches de `contra/disenio_patch.mjs` de sus ficheros. Nada de reescrituras por gusto.

| Paquete | Ficheros | Filas de la tabla | Código |
|---|---|---|---|
| **P0 · motor** | `engine/duel.js`, `engine/core.js` | — | `aTiempo` (§5.1), F3. Prueba `tools/test-e7-motor.mjs` |
| **I1 · comunes** | `content/flags.js`, `content/items.js`, `content/pistas.js`, `content/escenas/climax.js`, `content/lib/ascensor.js`, `content/lib/directorio.js`, `tools/plan-rules.mjs`, `tools/text-audit.mjs` | items N9 · pistas E353 E358 E359 N7 P-nota1/2/3a/3b P-turno3 P-acta2/3a/3b · climax EXP-3 · ascensor E341 · directorio E344 | `oyo_papel_begona`; `M.nota`, `nota.salas/meta`; `FICHA.firmaPapel` y `fichaViva`; topes (§7). (`game.js`, `duelo.js`, `actors.js`, `walk-lib.mjs`: sin cambios) |
| **PA · Administración** | `rooms/administracion.js`, `rooms/administracion.dialogos.js` | E308 E311 E312 E313 E314 · E321 E324 N5 | E2 (N3-N4), E3 (`ENTRADA`, `sobreANota`), F4 |
| **PB · Redacción de papel** | `rooms/catacumba.js` | E229 E235 E237 TIC-P1 TIC-P2 TIC-L2 TIC-L3 EXP-2a EXP-2b | E1 (N1-N2) |
| **PC · Sala** | `rooms/sala_amazonas.js` | E183 E185 E203 E204 E205 E208 | Tele (§2.2) |
| **PD · Despachos** | `rooms/pajarera.js` | E148 E149 E150 E152 E155 E156 E162 E165 E174 | `dueloGervasio.aTiempo` (sin P0 se ignora: entrega en paralelo) |
| **PE · Redacción** | `rooms/pecera.js`, `rooms/pecera.dialogos.js`, `rooms/pecera.escenas.js` | pecera E070 E072 E075 E076 E076b E085 E087 E089 E094 X8 X10 F7 · dialogos E107 E109 E117 E118 TIC-S3 F6a F6b F6c · escenas E121 E124 E129 E131 E133 X9 | F6 (gesto) |
| **PF · Vestíbulo y Vending** | `rooms/vestibulo.js`, `rooms/office.js` | E013 E017 E021 E024 TIC-L1 · E033 E040 E042 E046 E054 E055 E056 E057 TIC-S4 | — |
| **PG · Sistemas** | `rooms/cpd.js` | E252 E254 E255 E258 E261 E262 E263 E264 E265 E266 E267 E268 TIC-S5 EXP-1 | — |
| **PH · Marketing** | `rooms/ecosistema.js` | E277 E278 E280 E286 E291 E296 TIC-S1 TIC-S2 | — |
| **I2 · integración** | `tools/walk-data.mjs` (txt), `extras.mjs`, `play-mouse.mjs`, las pruebas de §10, `tools/test-e7.mjs`, `docs/CONTENT_SCHEMA.md` §10, `docs/guion2-impl/GUIA_AUTORES.md` E6.2/E7, golden files de `tools/shots/` | — | — |

---

## §10 · Pruebas

**Cambian por la restauración** (texto nuevo o «ya no se dice» que hay que invertir):
- `test-e6-pb.mjs:97-98` — quitar de `fuera` «Me hacía falta», «Ayuda bastante», «¡Otra! ¡Ha entrado otra!», «Nos ganan. Tienen horario».
- `test-e6-pb.mjs:127` (E129) → «Antes de que la envolviera le pedí un gráfico del Titulator.» · `:166` (E118) → «Eutimio ha
  mandado primero el papeleo. Es el procedimiento.» · `:193` (E344) → **invertir**: con «Me hacía falta» · `:196` (E070) →
  «…sería una salida en valor. No.» · `:230` (E124) → «…Yo ya no leo. Superviso.» (E125 **no** cambia).
- `test-e6-i1.mjs:42` (E344) → «Un punto rojo: «ESTÁ AQUÍ». Gracias. Me hacía falta.» · `:41` (turno n3) → «La tele: «Buenas
  noches, Gertrudis». Y lo de los pasos.»
- `test-e6-pd.mjs:343` (E237, con «Por si acaso.», sin `viejo`) · `:378` (E155, con «Un poco sí.») · `:381` (E165 → «…diapositiva.
  Muy despacio.»).
- `test-e5-pd.mjs:343` (E156) → «No. Íñigo los tiene contados. Por colores.»
- `test-e6-pe.mjs:183` (E286) → «…Se borra solo. Por vergüenza.»; `:208-215` siguen valiendo (sin «mirado el reloj»), y se añade
  el aviso de F4 en el log.
- `test-e5-pe.mjs:224` (E324) → «begona_triplicado: Un sobre de azúcar. Caducado. Del bolsillo de Ramírez, por el olor.»; y si
  cuenta opciones de B0 con el Acto II abierto, contar «¿Me da unos folios?…».
- `test-e5-pb.mjs:157` (X9) → **invertir**: «¡Otra! ¡Ha entrado otra!» sí sale.
- `test-e4.mjs:338` (TIC-P2) → «Cinco. El quinto es por traérmelo.» · `:441` (E133) → «Esa ya está vieja. Te imprimo otra.»
- `test-comedia-p1.mjs:346` (EXP-1) → quitar «Esta casa da de alta antes…» de los `musts` y comprobar que no sale (E248 no cambia).
- `test-comedia-p2.mjs:108` (E121) · `:198` (E107 → «Dejaron las chaquetas en las sillas, mirándola.») · `:303` (E124) · `:335`
  (E129) · `:425-428` (F6: fuera «Y en nuestros corazones…», «Integró una IA que era un becario.», «...Lo miro en la próxima
  versión.» de los `musts` y comprobar que **no** salen; se quedan «Revocado. Fecha: hoy. Efectos: julio.», «Nos hemos quedado
  sin IA de la casa.» y la pantalla de Herminia) · `:526` (la captura «salida-revocado» espera «Revocado. Fecha: hoy. Efectos:
  julio.»). `:266` y `:276` (abrígate) **no cambian**.
- `test-comedia-p3.mjs:216` (TIC-P1) → «Toma la ficha de la página 7. Ahí lo tienes todo, en casillas.» (`:141`, `:390`, `:397`
  no cambian).
- `test-comedia-p4.mjs:243` (E278) → «Tadeo no lo ha leído. Yo sí.» · `:332` (E183) → «Se ve demasiado. Estoy en ello.»
  (`:217`, `:274`, `:407` no cambian).
- `test-fase0.mjs:172` → «A: En las oficinas sin papel siempre hay una que lo gasta en decir que no.» · `:180` → margen N9.
- `test-e6.mjs:21` (16,5 → 17,9 %) y `:182` («ninguna sala > 22 %» → 26 %).

**Cambian por el diseño:** `extras.mjs:103` (XE5-10 con Mirar) · `test-e5-pa.mjs:176` y `test-e6-pa.mjs:242` («wifi y rencor»
con Mirar tele) · `play-mouse.mjs` paso 46: si se juega sin `skipText`, esperar a `state().duel.escribiendo === false` antes del
clic (la comprobación de `:423` sigue valiendo: la R03 entera va al log como aviso) · golden files (`tools/shots/textos.json`,
`camino-principal.tsv`): regenerar.

**Nuevas:**
- `tools/test-e7-motor.mjs` (P0): rival de demostración con `aTiempo` (copia del prototipo `contra/test-e7-proto.mjs`, D3):
  menú con `escribiendo`, clic real antes de tiempo → `cortada`, `interrumpe`, 0 fallos/RE:/CC, mismo ataque; segunda →
  `taunt`; esperar → frase entera y aviso en el log; acierto; fallo de verdad con la frase acabada; comodín durante la escritura
  sin gastarse; guardar y cargar a mitad → reanuda desde 0 y **ningún aviso huérfano** en 4,5 s; Esc → pausa congela y sigue;
  modo rápido sin trozos; D1 y D4 sin `aTiempo` idénticos; F3 en D1 y D4 con ratón quieto; táctil (844×390) con toque.
- `tools/test-e7.mjs` (I2): el nudo (objetivo `nota` y meta N6 en `catacumba`; `cms` y N7 en `pecera`; N1-N2, flag, ficha
  N11+N9; sobre → B_NOTA sin saludo, con Dar y con Usar en la ventanilla; N5; N3-N4; nota completa), la tele (Mirar, Usar, caja,
  Vending intacto, atasco por Hablar), D3 real con ratón, F4 (gesto, aviso una vez), F6 (dos tiempos, las tres fuera, «Nos hemos
  quedado sin IA de la casa.» dentro), EXP-4 y E103 **intactas**, `--recuento` con los topes de §7. Capturas `e7-d3-escribiendo`,
  `e7-d3-interrumpe`, `e7-f4-evaristo`, `e7-f6-herminia`, `e7-nudo-ficha` (MIRARLAS).
- `text-audit`: aviso por personaje (§7).

---

## §11 · Acta de la contra

**Al autor de la restauración:**
1. Cambia la regla «en la duda, vuelve» por la del dueño: vuelve solo lo claramente mejor. De sus 130 vueltas, se quedan 75;
   no vuelven 55 (cambios de puntuación sin golpe, coletillas que comentan, chistes apilados, las 11 pistas partidas, dos
   chistes repetidos E200/E297, E306 que hoy es mejor). De sus 12 terceras, entran 5; E133 vuelve a su original (la tercera
   era una coma entre dos frases); fuera E062, E110, E134, E144, E176, E182.
2. **E326 no vuelve**: F4 se resuelve con acción y aviso (una cosa u otra).
3. **E103 y EXP-4: veto** (hilo de «abrígate», §4.4).
4. Tics reescritos: TIC-P2 («es por traérmelo»), TIC-L1 (sin «la única» ni chiste nuevo), TIC-L2 (fuera), TIC-L3 («El Libro
   de Estilo.»), TIC-S1/S2 (Tadeo sin el chiste del móvil de Borja).
5. Métrica: la suya (641, 18,0 %) subía el tope a 19,5 % y el aviso de sala a 27 %; con la criba, 585 (16,4 %), tope 17,9 %,
   aviso 26 %. Las 48 de topes llenos: ninguna se cambia (§3).

**Al autor del diseño:**
1. N4 reescrita sin el sello ni la repetición; N5 conserva el golpe.
2. Fuera las variantes por pegatina (N8, N10): «Sistemas no atiende ni el fax» mandaba otra vez a la rama del CMS delante
   del fax sin papel. `M.cms` y el margen, una cadena cada uno.
3. N11 sin repetir N2 palabra por palabra.
4. N12 (impresora) fuera: decisión del director.
5. D3: R07 acortado (85 → 71 caracteres), 1,3 s por trozo, rótulo «escribiendo» en la barra del título (el suyo tapaba a
   Gervasio en la captura); `vivo()` con `game.gen` y `duelActive` (sin él, cargar a mitad dejaba la tarea huérfana escribiendo
   avisos y soltando el móvil en la partida nueva: `resetRuntime` resuelve los temporizadores y el `finally` no corre);
   `info.phase = 'interrumpido'`; el aviso del log con `name` aparte (la frase sola en `text`, así `play-mouse:423` sigue valiendo).
6. `sobreANota` con `finally` para `ENTRADA`.
7. F4: aviso solo la primera vez. F6: se queda «Nos hemos quedado sin IA de la casa.» (decisión del director ante la duda del
   gesto) → −3, no −4.
8. Tele: Mirar dice «wifi y rencor» siempre que haya «sin turno» (su condición sobre el estado `normal` fallaba con el estado
   inicial sin fijar; lo cazó el prototipo).

---

## Anexo A · La tabla única (110 filas; datos en `tabla_e7.mjs`)

| Fila | Fichero | Queda | Origen |
|---|---|---|---|
| E013 | `vestibulo.js` | El cuadro de llaves del garaje. Doce plazas. Ciento doce aspirantes. | RES·O |
| E017 | `vestibulo.js` | Escribo «Más becarios con contrato». La ranura la escupe. Polvo y principios. | RES·O |
| E021 | `vestibulo.js` | La riego con la mirada. No necesita más. Es de plástico. | RES·O |
| E024 | `vestibulo.js` | Hoy tres me han preguntado por mi salud. Con mucho interés. Estoy de miedo. | RES·O |
| E033 | `office.js` | Pulso la B4. Las pipas se asoman y se quedan colgando. Las animo. Nada. | RES·O |
| E040 | `office.js` | Un hilo impreso: «RE: RE: RE: ¿De quién es el yogur?». 214 respuestas. | RES·O |
| E042 | `office.js` | La taza del Foro de Innovación no se mueve. Ha echado raíces. Disruptivas. | RES·O |
| E054 | `office.js` | Un ticket. Eso es de Sistemas. Se les reenvía. | RES·O |
| E055 | `office.js` | Chsss. Aquí la cola tiene orden. Me siento seguro. | RES·O |
| E056 | `office.js` | Para cerrar un arco hace falta una puerta y un presupuesto. No hay ninguno. | RES·O |
| E057 | `office.js` | NO SE ADMITEN DEVOLUCIONES. NI SENTIMIENTOS. | RES·O |
| E070 | `pecera.js` | Empujar a alguien escaleras abajo sería una salida en valor. No. | RES·O |
| E072 | `pecera.js` | Lectores concurrentes: 3.418. Se refresca cada segundo. Igual que Yoli. | RES·O |
| E075 | `pecera.js` | Una taza con costra de café de la crisis de la deuda. Debería cotizar. | RES·O |
| E076 | `pecera.js` | Delante, dos sillas vacías con chaqueta. Mirándola. | RES·O |
| E076b | `pecera.js` | Delante, dos sillas vacías con chaqueta. Mirándola. Encima, una tira de cinta. | RES·O |
| E085 | `pecera.js` | Cinta de carrocero en el suelo. La frontera de Desarrollo. Recta, de momento. | RES·O |
| E087 | `pecera.js` | Semáforo de ruido de Prevención. Rojo. | RES·O |
| E089 | `pecera.js` | Una bandeja: "ENTREGAS DE DISEÑO Y PRODUCTO". Llena hasta arriba. | RES·O |
| E094 | `pecera.js` | Gracias. Herminia dice que es mi quinto. Me lo ha puesto en barras. Suben. | RES·O |
| E109 | `pecera.dialogos.js` | Lo sé. Ella lo dijo a las ocho y veinte. En barras. | RES·O |
| E117 | `pecera.dialogos.js` | Con el navegador. Con los lectores. Con la lluvia. | RES·O |
| E118 | `pecera.dialogos.js` | Eutimio ha mandado primero el papeleo. Es el procedimiento. | RES·O |
| E121 | `pecera.escenas.js` | Trescientos titulares esta tarde. Sin CMS. Sin silla. Sin convenio. | RES·O |
| E124 | `pecera.escenas.js` | Ya te la ha leído. Yo no, ¿eh? Yo ya no leo. Superviso. | RES·O |
| E131 | `pecera.escenas.js` | Me han anexionado. Pero integrada, que es lo que quería. Creo. | RES·O |
| E148 | `pajarera.js` | Otra vez: «ARMARIO 27». Los titulares no se repiten. Las personas, sí. | RES·O |
| E149 | `pajarera.js` | Sin acta de la anterior no se abre la siguiente. Es el reglamento. | RES·O |
| E150 | `pajarera.js` | OCUPADO hasta 2031. Llamar a esta puerta es pedir una prórroga. | RES·O |
| E152 | `pajarera.js` | «Acuerdos: uno, perder otro duelo». Mi segunda acta. Ya tengo archivo. | RES·O |
| E155 | `pajarera.js` | Empujo el cristal. Desde la Redacción parece que pido auxilio. Un poco sí. | RES·O |
| E156 | `pajarera.js` | No. Íñigo los tiene contados. Por colores. | RES·O |
| E162 | `pajarera.js` | Cuidado, que es una licencia. Cuarenta y ocho mil al mes. Una inversión. | RES·O |
| E165 | `pajarera.js` | Cerrada por dentro. Se oye pasar una diapositiva. Muy despacio. | RES·O |
| E174 | `pajarera.js` | Se agradece la iniciativa igual. Se archiva. | RES·O |
| E183 | `sala_amazonas.js` | Se ve demasiado. Estoy en ello. | RES·O |
| E185 | `sala_amazonas.js` | Bienvenido otra vez. Su llamada nos importa. Por eso bostezamos. | RES·O |
| E203 | `sala_amazonas.js` | Junto a la pantalla, el Lector Medio, con la chaqueta de Ramírez. Asiente. | RES·O |
| E204 | `sala_amazonas.js` | Junto a la pantalla, el Lector Medio. Asiente. | RES·O |
| E205 | `sala_amazonas.js` | Lo levanto un poco. Pesa lo que un folio. Asiente igual. | RES·O |
| E208 | `sala_amazonas.js` | Para eso. Muy bien visto. Se toma nota. | RES·O |
| E229 | `catacumba.js` | Jefes de cierre en blanco y negro. Todos con bigote. | RES·O |
| E235 | `catacumba.js` | Dos líneas. Cabe en un faldón. Y sobra. | RES·O |
| E237 | `catacumba.js` | Aurora, correctora. Tiene un boli rojo clavado en el moño. Por si acaso. | RES·O |
| E252 | `cpd.js` | El ascensor. En el sótano, el «tin» suena más bajito. Por respeto. | RES·O |
| E254 | `cpd.js` | Pesan como un servidor. Porque son servidores. | RES·O |
| E255 | `cpd.js` | Tiro de un cable. Eutimio carraspea a seis metros. Lo suelto. | RES·O |
| E258 | `cpd.js` | La empujo con el pie. El piloto ni parpadea. Tiene brida. | RES·O |
| E261 | `cpd.js` | La salida, con letra de Eutimio. Apretando mucho. | RES·O |
| E262 | `cpd.js` | Si lo cierro, Brais no sale ni en el libro. Lo dejo abierto. | RES·O |
| E263 | `cpd.js` | No tiene botones. Sube uno cada vez que entro. Soy una incidencia. | RES·O |
| E264 | `cpd.js` | Ticket nº 1, julio: «Alta becario Brais». Estado: cerrado. Por fin. | RES·O |
| E266 | `cpd.js` | Muevo una bola. Rueda por dentro. Eutimio tenía razón. | RES·O |
| E267 | `cpd.js` | Me abrió un ticket con márgenes. Lo tengo enmarcado. | RES·O |
| E268 | `cpd.js` | Ahí salgo. Al fondo. Siempre al fondo. Es mi encuadre. | RES·O |
| E277 | `ecosistema.js` | Debajo: «Propongo quitar el logo. Por si os sirve!!». Enviado a todos. | RES·O |
| E278 | `ecosistema.js` | Tadeo no lo ha leído. Yo sí. | RES·O |
| E280 | `ecosistema.js` | Lo cierro. Se abre solo. | RES·O |
| E286 | `ecosistema.js` | Debajo escribo «¿Y qué es?». Se borra solo. Por vergüenza. | RES·O |
| E291 | `ecosistema.js` | Le leo el lema en voz alta. Suena a anuncio. | RES·O |
| E296 | `ecosistema.js` | ¡Deja eso! Lleva un adhesivo de patrocinio. Por debajo. | RES·O |
| E308 | `administracion.js` | Si cierro el pasillo, Begoña me pide el F-3 de Pasillos. Por triplicado. | RES·O |
| E311 | `administracion.js` | Tres tazas vacías. Una por copia. | RES·O |
| E312 | `administracion.js` | «EJEMPLARES». Once notas bien hechas en cuarenta años. Una por cuatrienio. | RES·O |
| E313 | `administracion.js` | Se ha ido todo el mundo. Yo cierro a las 19:15. Por principios. | RES·O |
| E314 | `administracion.js` | ¿Fotos? En esta ventanilla, fotocopias. Por triplicado. | RES·O |
| E321 | `administracion.dialogos.js` | Eso es autoestima. Y no desgrava. | RES·O |
| E341 | `lib/ascensor.js` | Si al abrir oye un gong, alguien ha vendido algo. No se asuste. | RES·O |
| E344 | `lib/directorio.js` | Un punto rojo: «ESTÁ AQUÍ». Gracias. Me hacía falta. | RES·O |
| E353 | `pistas.js` | La del boli rojo y el del fax no se hablan. Pregúntale por qué. | RES·O |
| E358 | `pistas.js` | El de los cables sabe cosas del señor del traje. Pregúntale. | RES·O |
| E359 | `pistas.js` | El chico del armario escribía los discursos. Pregúntale. | RES·O |
| X8 | `pecera.js` | Es que lo escribí yo. Ayuda bastante. | RES·O |
| X9 | `pecera.escenas.js` | ¡Otra! ¡Ha entrado otra! | RES·O |
| X10 | `pecera.js` | Busco "el Contable" y salen gestorías. Nos ganan. Tienen horario. | RES·O |
| E046 | `office.js` | Gertrudis, la cafetera. Tiene pantalla y carácter. Lo segundo, más. | RES·T |
| E107 | `pecera.dialogos.js` | Dejaron las chaquetas en las sillas, mirándola. | RES·T |
| E129 | `pecera.escenas.js` | Antes de que la envolviera le pedí un gráfico del Titulator. | RES·T |
| E265 | `cpd.js` | Y al final, de hoy: «Alta becaria Herminia». Cuarenta segundos. | RES·T |
| E324 | `administracion.dialogos.js` | Un sobre de azúcar. Caducado. Del bolsillo de Ramírez, por el olor. | RES·T |
| TIC-P1 | `catacumba.js` | Toma la ficha de la página 7. Ahí lo tienes todo, en casillas. | RES·tic |
| TIC-S3 | `pecera.dialogos.js` | Ficharon y se fueron. Herminia no ficha. | RES·tic |
| TIC-S4 | `office.js` | Los nueve tuppers siguen en la cola. Nadie viene a por ellos. | RES·tic |
| TIC-S5 | `cpd.js` | Los tickets nunca se van a casa. Y yo... | RES·tic |
| EXP-1 | `cpd.js` | *(fuera la cadena)* ~~Esta casa da de alta antes a un portátil que a un chaval.~~ | RES·expl |
| EXP-2a | `catacumba.js` | *(fuera la cadena)* ~~Abre interrogación y cierra con punto.~~ | RES·expl |
| EXP-2b | `catacumba.js` | Eso, criatura, es una sentencia. | RES·expl |
| EXP-3 | `escenas/climax.js` | *(fuera la cadena)* ~~Él cree que avanza. El Lector Medio cree que asiente.~~ | RES·expl |
| F7 | `pecera.js` | *(fuera la cadena)* ~~Cuatro décimas. Yo tardaba una semana. Qué semanas aquellas.~~ | RES·expl |
| E133 | `pecera.escenas.js` | Esa ya está vieja. Te imprimo otra. | CONTRA |
| TIC-P2 | `catacumba.js` | Cinco. El quinto es por traérmelo. | CONTRA |
| TIC-S1 | `ecosistema.js` | El portátil de Tadeo, de Negocio. | CONTRA |
| TIC-S2 | `ecosistema.js` | *(fuera la cadena)* ~~Su portátil, no.~~ | CONTRA |
| TIC-L1 | `vestibulo.js` | No acepta nada: ni regalos ni sugerencias. | CONTRA |
| TIC-L2 | `catacumba.js` | *(fuera la cadena)* ~~El bigote también era de plantilla.~~ | CONTRA |
| TIC-L3 | `catacumba.js` | El Libro de Estilo. | CONTRA |
| N5 | `administracion.dialogos.js` | Un trámite bien hecho, y ni un papel. Lo pongo en «logros». | DIS |
| N7 | `pistas.js` | Con el CMS caído, en Sistemas no atienden a nadie. | DIS |
| N9 | `items.js` | Al margen, a lápiz: «CMS en coma. Sistemas no atiende a nadie». | DIS |
| P-nota1 | `pistas.js` | En las oficinas sin papel siempre hay una que lo gasta en decir que no. | DIS |
| P-nota2 | `pistas.js` | ¿Has hecho la cuenta de gastos? Hazla mal, que las malas vuelven con copia. | DIS |
| P-nota3a | `pistas.js` | Lo que lleves en el bolsillo vale de justificante. Y pídele una bien hecha. | DIS |
| P-nota3b | `pistas.js` | Nota de gasto a Begoña, con el azúcar. Y que me enseñe una bien hecha. | DIS |
| P-turno3 | `pistas.js` | La tele: «Buenas noches, Gertrudis». Y lo de los pasos. | DIS |
| P-acta2 | `pistas.js` | A ese señor no le pises las frases, hijo. Espera a que se le acaben. | DIS |
| P-acta3a | `pistas.js` | Cuando deje de escribir, contéstale. Y al final, su cuenta de la comida. | DIS |
| P-acta3b | `pistas.js` | Gervasio: esperar a que acabe de escribir. Remate: su nota de la comida. | DIS |
| F6a | `pecera.dialogos.js` | *(fuera la cadena)* ~~Y en nuestros corazones, Brais está en HECHO.~~ | DIS |
| F6b | `pecera.dialogos.js` | *(fuera la cadena)* ~~Integró una IA que era un becario. Y rechaza una IA que es una IA.~~ | DIS |
| F6c | `pecera.dialogos.js` | *(fuera la cadena)* ~~...Lo miro en la próxima versión.~~ | DIS |

**Altas (18; su código, en §2 y en `contra/disenio_patch.mjs`):**

| Id | Fichero | Texto | Dónde |
|---|---|---|---|
| N1 | `catacumba.js` | ¿De dónde saco papel para el fax? | dialogoAurora.A_MENU, opción tras «¿Cómo convenzo a Teodoro?» |
| N2 | `catacumba.js` | Papel, en esta casa, solo gasta Begoña. Lo devuelve por triplicado. | reply de N1 (Aurora) |
| N3 | `administracion.dialogos.js` | ¿Me da unos folios? Son para el fax de Teodoro. | begona.B0, tras «Quiero presentar una nota de gasto.» |
| N4 | `administracion.dialogos.js` | Folios no doy. De esta ventanilla solo sale papel rechazado. | reply de N3 (Begoña) |
| N6 | `pistas.js` | Teodoro no habla sin papel. Y en esta casa no queda un folio sin sellar. | M.nota (meta del objetivo `nota`) |
| N11 | `items.js` | FIRMA: el fax no tiene papel. El papel, en esta casa, sale de Begoña. | FICHA.firmaPapel (con oyo_papel_begona) |
| D3-r | `pajarera.js` | escribiendo | dueloGervasio.aTiempo.escribiendo (rótulo en la barra del título, + 1-3 puntos; no es «texto» para el auditor) |
| D3-i | `pajarera.js` | Me has interrumpido. Se apunta. | dueloGervasio.aTiempo.interrumpe |
| D3-07a | `pajarera.js` | Esto se necesitaba para... | aTiempo.trozos.R07[0] |
| D3-07b | `pajarera.js` | para cuando... | aTiempo.trozos.R07[1] |
| D3-07c | `pajarera.js` | me consta que ya lo hablamos. | aTiempo.trozos.R07[2] |
| D3-03a | `pajarera.js` | El acta se necesitaba para... | aTiempo.trozos.R03[0] |
| D3-03b | `pajarera.js` | para... | aTiempo.trozos.R03[1] (no es «texto» para el auditor) |
| D3-01a | `pajarera.js` | Ya se dijo en el otro correo... | aTiempo.trozos.R01[0] |
| D3-01b | `pajarera.js` | ese que no se leyó... | aTiempo.trozos.R01[1] |
| D3-05a | `pajarera.js` | Lo del acta, entre tú y yo... | aTiempo.trozos.R05[0] |
| D3-05b | `pajarera.js` | que no salga de esta puerta. | aTiempo.trozos.R05[1] |
| F4 | `administracion.dialogos.js` | Correo nuevo de Evaristo Salvedad: «Una cosita (1 de 3)». | E_CORREO «¿Falta mucho?» (api.notice) |

## Anexo B · Material de la contra (scratchpad `e7/contra/`)

- `build_tabla.mjs` → genera `../tabla_e7.mjs` (decisiones de la contra sobre `../restaura.mjs` + filas del diseño).
- `verifica_e7.mjs` → comprueba la tabla, monta `copia/`, aplica tabla y `disenio_patch.mjs`, `node --check`.
- `disenio_patch.mjs` → el código de §2 y §5 como parches literales (especificación ejecutable para los paquetes).
- `test-e7-proto.mjs` → prototipo con navegador (se copia a `copia/tools/`): 42/42.
- `ta_hoy.txt`, `ta_copia.txt`, `ta_copia_full.txt` → `text-audit` de hoy y de la copia (estático y completo).
- `porpersona.mjs`, `hoy.json`/`copia.json` (+ `../personas.mjs`) → remate por personaje (oídas y cadenas).
- `greptests.mjs` → pruebas que citan los textos que cambian.
