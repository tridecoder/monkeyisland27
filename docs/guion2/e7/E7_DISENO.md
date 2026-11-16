# E7 · DISEÑO — entrada al nudo del Acto II, la tele con Usar, el duelo de Gervasio y tres fallos baratos

Encargo: cambios 1, 3 y 4 de `docs/informes/critica6/CRITICA_JUEGO_6.md` §8 (F1, F2, problema 4) y, de paso, F3, F4 y F6.
El cambio 2 (devolver golpes podados) es de otro autor; aquí no se toca ningún texto podado salvo donde se dice.
Todo lo que sigue se ha comprobado contra el código de hoy. Las líneas citadas son las de hoy.

Reglas que he aplicado: ≤ 80 caracteres por línea; ninguna línea nueva con «Como…», coletilla («Y/Con/Sin/Ni + 1-3
palabras» a principio de frase), «criatura», «chaval», «cariño», «niño» (Begoña está en su tope 4), «triplicado» en boca de
Begoña (tope 6), «el único/lo único», «no se X. Se Y», «primera vez», «Mi primer», «No es X. Es Y», «factur…», año, «táper»,
«Era solo eso», «Lo que diga el Lector Medio». Un solo golpe por línea. Nada de Eventos ni de Pilar, nada de la cadena final,
Herminia solo como pantalla, en Desarrollo solo Anselmo y el coro, sin director, Valentín sin tocar.

---

## 1. EL NUDO DEL ACTO II (F1 · cambio 1)

### 1(a) Diagnóstico: la cadena de hoy, eslabón a eslabón

**Lo que hace falta (grafo real del código).**

```
Aurora da la ficha (catacumba.js:364-381) → acto_2_iniciado
│
├─ FUENTE = mensaje_fp + fotocopia_nota_direccion → Dar a Aurora (catacumba.js:291-292, 383-398, 482-488)
│     mensaje_fp ← sale del fax AL METERLE PAPEL (faxConPapel, catacumba.js:169-196)
│     fotocopia  ← Begoña, B_EJEMPLAR (administracion.dialogos.js:122-143)
│
├─ FIRMA = fax_con_papel + D2 ganado + ficha (catacumba.js:87-104, 581-628)
│     fax_con_papel ← Usar copias_rechazadas con fax (catacumba.js:690)
│     copias_rechazadas ← Begoña, B_EJEMPLAR (administracion.dialogos.js:137)
│     remate de D2 = manual_fax ← Eutimio «Ticket 0.441» (cpd.js:272-274), que SOLO sale con cms_vivo (cpd.js:248)
│        y con vio_pegatina_fax (Mirar el fax, catacumba.js:685-687)
│        cms_vivo ← regletero R-3 (cpd.js:132-189) o el enchufe con el ticket 3 leído (pecera.js:257-258)
│
└─ La nota de gasto «mal hecha» (B_NOTA → «Café para entender el capitalismo.» → cualquier importe → B_JUST
   «Aquí tiene. Un sobre de azúcar.» → B_INSULTO → «Pues enséñeme…» / «Seguro que en los Despachos…» / «Lo siento…»)
   pone nota_gasto_presentada y da a la vez el PAPEL (copias) y la SEGUNDA FUENTE (fotocopia), y manda a Evaristo.
   El sobre de azúcar viene de la chaqueta de Ramírez (pecera.js:365-376, paso 9): todo jugador lo tiene.
```

**Conclusión.** El eslabón que cuelga todo es la **nota de gasto**: abre la FIRMA (papel), la FUENTE (fotocopia y, por el papel,
el fax de F.P.) y la trama de Evaristo. El CMS **no** es un eslabón de la nota: solo da el manual (remate de D2) y las
réplicas R08 y R12. Son dos ramas independientes, y hoy el juego empuja al jugador a la equivocada.

**Lo que sabe el jugador en cada momento (sin pistas).**

| Momento | Lo que tiene en la mano o en la cabeza | Lo que le dice el juego |
|---|---|---|
| Recibe la ficha | Ficha, sobre de azúcar, café gastado | Mirar ficha: «FUENTE: dos fuentes, dice Aurora. Tengo cero.» / «FIRMA: Teodoro solo habla por fax. Y el fax no tiene papel.» / «Al margen, a lápiz: «Arriba no me atiende nadie. El CMS está en coma».» (items.js:209-215, 232) |
| Mira a Bruno en la Redacción de papel | — | «Arriba no me atiende nadie mientras el CMS no vaya.» (pistas.js:22). En `catacumba` no casa ningún objetivo del Acto II: `actual()` cae en el primero de la lista, `cms` (engine/objetivos.js:52; pistas.js:63 va antes que `nota`, pistas.js:83, cuyas `salas` no incluyen `catacumba`) |
| Llama a la abuela delante del fax | — | La pista de **CMS** («Apágale algo a alguien»), por la misma razón (engine/objetivos.js:67-68). Es exactamente la primera pista que gastó el crítico |
| Busca papel | Que el fax no tiene papel | Nadie en el juego dice dónde hay papel. El único rastro es un correo fijo del móvil, «Nota de gasto RECHAZADA (se adjunta duplicado)» (lib/movil.js:29), que no se relaciona con nada |
| Busca fuentes | «Dos fuentes» | La pista de que las notas de gasto son fuentes («Falta la segunda fuente: mira las notas de gasto. — F.P.», items.js:336) llega dentro del fax de F.P., que solo sale cuando el fax ya tiene papel: la pista llega cuando ya no hace falta |

**Lo que dice hoy cada intento razonable (y adónde lleva).**

| Intento | Respuesta de hoy (fichero:línea) | ¿Apunta a algo? |
|---|---|---|
| Hablar con Teodoro sin papel | Aurora, una vez: «Sin papel no habla. Es su mejor época.»; luego Bruno: «Teclea. Pita. Ni una línea…» (catacumba.js:525-527) | No. Dice lo que ya se sabe |
| Usar / Abrir el fax | «Pulso un botón. Me contesta «SIN PAPEL» con más énfasis.» / «Abro la bandeja. Vacía…» (catacumba.js:700-707) | No |
| Mirar el fax | Pegatina «Mantenimiento: Sistemas. Ticket 0.441» (catacumba.js:685) | Sí, pero a Sistemas (el manual), no al papel |
| Preguntar a Aurora | No hay opción sobre el papel (catacumba.js:400-454) | — |
| Abrir la impresora de Marketing | «Dentro hay un folio que pone «PRUEBA». Superada.» (ecosistema.js:329); Coger, al genérico | No |
| Dar el sobre de azúcar a Begoña | «¿Un sobre de azúcar? Sin nota de gasto, esto es azúcar.» y fin (administracion.js:169) | **Cierra** la puerta que debería abrir (crítica §4.3.1) |
| Dar la ficha a Begoña | «Tres casillas. Bien. Pero ninguna dice «importe».» (administracion.js:179) | Un poco (insinúa la nota) |
| Nota de gasto: «Nada. Importe cero.» | Aprobada; Bruno: «He hecho un trámite bien. Lo pongo en «logros».» (administracion.dialogos.js:71-76) | No: aprobar no da papel y nada lo dice |
| Nota de gasto: «Varios.» | Sello en la frente (administracion.dialogos.js:78-84) | No (es carcajada; se queda) |
| B_INSULTO: «¿Me la aprueba o no?» | «Se la apruebo el día que el CMS no se caiga.» (administracion.dialogos.js:119) | Se queda en el nodo: bien |

**Dónde se corta el hilo.** En tres sitios: (1) entre «el fax no tiene papel» y «el papel de esta casa son los rechazos de
Begoña» no hay nada en el mundo; (2) el sistema de ayuda (Mirar a Bruno y la abuela) manda al CMS cuando el jugador está
delante del fax; (3) el sobre de azúcar, el objeto que el jugador intuye que es «para algo de Administración», cierra la
conversación en vez de abrir la nota.

### 1(b) Diseño paso a paso

Cinco entradas, ninguna con recado ni sala nueva. Dos son pistas del mundo que llevan al primer eslabón sin ayuda (E1 y E2);
la E3 convierte en entrada el intento más probable; la E4 corrige el sistema de ayuda; la E5 es opcional.

**Flag nuevo (global, `content/flags.js`):**
`oyo_papel_begona: 'bool · E7 · catacumba (Aurora) o administracion (Begoña) · items.js (ficha)'`, `startFlags` false.

**E1 · Aurora siembra de dónde sale el papel** (`catacumba.js`, `dialogoAurora.A_MENU`, justo después de «¿Cómo convenzo a
Teodoro?», catacumba.js:404-405):
```js
{ text: '¿De dónde saco papel para el fax?', if: '!fax_con_papel', once: true,
  reply: 'Papel, en esta casa, solo gasta Begoña. Lo devuelve por triplicado.', setFlag: 'oyo_papel_begona' },
```
El jugador lo pregunta solo: acaba de ver «SIN PAPEL», y la opción está en el menú de la persona que le dio la ficha. La línea
dice dónde hay papel y cómo sale (devuelto, en copias). No dice «haz una nota de gasto».

**E2 · Begoña, si se le pide papel** (`administracion.dialogos.js`, `begona.B0`, justo después de «Quiero presentar una nota
de gasto.», línea 42):
```js
{ text: '¿Me da unos folios? Son para el fax de Teodoro.', if: ['acto_2_iniciado', '!nota_gasto_presentada', '!fax_con_papel'],
  once: true, reply: 'Folios, no doy. Lo que sale de esta ventanilla sale con sello de RECHAZADA.', setFlag: 'oyo_papel_begona' },
```
Lleva la opción `once` (regla E2 §7.6). La línea de debajo en el menú es «Quiero presentar una nota de gasto.»: el jugador
une las dos cosas él solo (papel = rechazo; rechazo = nota). La pared de notas rechazadas (administracion.js:85-92) refuerza
la idea sin cambiar nada.

**E3 · El sobre de azúcar abre la nota** (`administracion.js:169` y `administracion.dialogos.js`):
1. En `administracion.dialogos.js`, exportar un estado de módulo y saltarse el saludo cuando se entra por el sobre:
   ```js
   export const ENTRADA = { sobre: false };
   // begona.onStart:
   onStart: async (api) => {
     if (ENTRADA.sobre) { ENTRADA.sobre = false; return; }       // E7 F1: se entra por el sobre, directo a la nota
     await sayBe(api, 'Son las 19:07. Te quedan ocho minutos de existencia administrativa.');
   },
   ```
2. En `administracion.js` (import `dialogos, { recorte, ENTRADA }`), una función y tres verbos:
   ```js
   const sobreANota = async (api) => {
     await sayBe(api, '¿Un sobre de azúcar? Sin nota de gasto, esto es azúcar.');   // la línea de hoy, literal
     if (api.flag('nota_gasto_presentada')) return;
     ENTRADA.sobre = true;
     await api.dialog('begona', 'B_NOTA');                                           // «Uno: concepto. Dos: importe…»
   };
   // actor BEGONA:  'dar:sobre_azucar': sobreANota, 'usar:sobre_azucar': sobreANota,
   // objeto ventanilla: 'usar:sobre_azucar': sobreANota, 'dar:sobre_azucar': sobreANota,
   ```
   La línea de Begoña no cambia; lo que cambia es que, en lugar de cerrar, saca el impreso (el `onEnter` de `B_NOTA` dice los
   tres campos). **0 cadenas nuevas.** Si se cancela por las ramas de B_NOTA, vuelve a B0 como hoy.

**E4 · El «no» de «Importe cero» apunta al papel** (`administracion.dialogos.js:75`):
- Hoy: `'He hecho un trámite bien. Lo pongo en «logros».'`
- E7: `'Aprobada, y ni una copia. Lo pongo en «logros».'`
Se queda el golpe («Lo pongo en «logros»»). Lo que cambia es la preparación: aprobar no deja copias. Con E1 o E2 oídas, el
jugador entiende que tiene que conseguir que se la rechacen.

**E5 · La ficha y «Mirar a Bruno» dejan de mandar al CMS delante del fax** (`items.js`, `pistas.js`):
1. `pistas.js:83`, objetivo `nota`: `salas: ['catacumba', 'ecosistema', 'administracion']` (se añade `catacumba`). Delante del
   fax sin papel, Mirar a Bruno y la abuela hablan ya del papel (la `nota`) y no del CMS. En la Redacción y en Sistemas sigue
   mandando el `cms` (sus salas no cambian).
2. `pistas.js`, `M` (meta en voz de Bruno; `meta` admite función, engine/objetivos.js:59):
   ```js
   nota: 'Teodoro no habla sin papel. Y en esta casa no queda un folio sin sellar.',
   cms: (api) => (api.flag('vio_pegatina_fax') ? 'El fax es de Sistemas. Y Sistemas no atiende a nadie sin CMS.'
     : 'Con el CMS caído, en Sistemas no atienden a nadie.'),
   ```
   y el objetivo `nota` pasa de `meta: M.hff` a `meta: M.nota`. (Con esto, en Administración Mirar a Bruno ya no dice «Hueco,
   fuente y firma. Lo pone la ficha.»: es el «fallo 2» que el crítico vio en el banco de espera.)
3. `items.js`, `FICHA` y `fichaViva` (items.js:204-239). **No** hay cuarta casilla: «tres casillas» se dice en seis sitios
   (Begoña, Evaristo, Eventos, Yoli, Herminia, el atril de Eventos), y una cuarta los rompe todos. Lo que la crítica pedía, que
   el CMS se vea y diga por qué importa, va en la nota al margen, y la casilla FIRMA recuerda lo oído sobre el papel:
   ```js
   margen: ['Al margen, a lápiz: «CMS en coma. Sistemas no atiende a nadie».',
     'Al margen, a lápiz: «CMS en coma. Sistemas no atiende ni el fax».'],          // con vio_pegatina_fax
   firmaPapel: 'FIRMA: el fax no tiene papel. Papel, en esta casa, solo sale de Begoña.',   // con oyo_papel_begona
   // fichaViva:
   out.push(f('casilla_firma') ? FICHA.firma[2] : f('fax_con_papel') ? FICHA.firma[1]
     : f('oyo_papel_begona') ? FICHA.firmaPapel : FICHA.firma[0]);
   if (!f('cms_vivo')) out.push(FICHA.margen[f('vio_pegatina_fax') ? 1 : 0]);
   ```
   La nota al margen pasa a ir justo **debajo de FIRMA** (hoy ya va ahí). Así se lee como parte de la firma, que es lo que es.

**E6 (opcional) · La impresora de Marketing** (`ecosistema.js:329`, objeto `impresora_tercera`), el sitio donde un jugador
busca folios. Es Abrir, que es el verbo con el que se buscan (y ya enseña un folio):
```js
abrir: async (api) => {
  if (api.flag('acto_2_iniciado') && !api.flag('fax_con_papel')) { await api.say('Dentro, un folio de «PRUEBA». El resto del papel de la planta va sellado.'); return; }
  await api.say('Dentro hay un folio que pone «PRUEBA». Superada.');   // la de hoy, literal
},
```
Es opcional porque `ecosistema.js` puede estar tocándolo el autor de la poda. Si choca, se cae E6 y el diseño se sostiene
con E1-E5.

### 1(c) Textos definitivos (todos ≤ 80)

| Id | Quién | Texto |
|---|---|---|
| N1 | Bruno (opción) | ¿De dónde saco papel para el fax? |
| N2 | Aurora | Papel, en esta casa, solo gasta Begoña. Lo devuelve por triplicado. |
| N3 | Bruno (opción) | ¿Me da unos folios? Son para el fax de Teodoro. |
| N4 | Begoña | Folios, no doy. Lo que sale de esta ventanilla sale con sello de RECHAZADA. |
| N5 | Bruno (sustituye) | Aprobada, y ni una copia. Lo pongo en «logros». |
| N6 | Bruno (meta `nota`) | Teodoro no habla sin papel. Y en esta casa no queda un folio sin sellar. |
| N7 | Bruno (meta `cms`, sin pegatina) | Con el CMS caído, en Sistemas no atienden a nadie. |
| N8 | Bruno (meta `cms`, con pegatina) | El fax es de Sistemas. Y Sistemas no atiende a nadie sin CMS. |
| N9 | Ficha (sustituye margen) | Al margen, a lápiz: «CMS en coma. Sistemas no atiende a nadie». |
| N10 | Ficha (margen, con pegatina) | Al margen, a lápiz: «CMS en coma. Sistemas no atiende ni el fax». |
| N11 | Ficha (FIRMA, tras N2 o N4) | FIRMA: el fax no tiene papel. Papel, en esta casa, solo sale de Begoña. |
| N12 | Bruno (opcional, Abrir impresora) | Dentro, un folio de «PRUEBA». El resto del papel de la planta va sellado. |

### 1(d) Respuestas a los intentos equivocados más probables (cada «no» apunta)

| Intento | E7 | Apunta a |
|---|---|---|
| Dar o Usar el sobre con Begoña o la ventanilla | La línea de hoy y se abre la nota (E3) | El impreso: concepto, importe, justificante |
| «Importe cero» | N5 | Aprobar no da copias |
| Pedirle papel a Begoña | N4 | El papel sale rechazado |
| Preguntar a Aurora | N2 | Begoña, en copias |
| Mirar a Bruno / la abuela delante del fax | N6 y pistas de `nota` | El papel, sellado |
| Mirar la ficha | N11 (si ya lo oyó) y N9/N10 | Dónde está el papel; para qué sirve el CMS |
| Abrir la impresora buscando folios (opcional) | N12 | «Sellado» = Administración |
| «Varios» | Sin cambio: el sello en la frente es carcajada y vuelve a B0 con la nota aún disponible | (Decisión: el chiste gana; ver §6) |

### 1(e) Pistas de la abuela, eslabón por eslabón

`nota` (sustituye los tres niveles de pistas.js:84-86; ahora también suena en `catacumba`):
1. «En las oficinas sin papel siempre hay una que lo gasta en decir que no.»
2. «¿Has hecho la cuenta de gastos? Hazla mal, que las malas vuelven con copia.»
3. [«Lo que lleves en el bolsillo vale de justificante. Y pídele una bien hecha.»,
   «Nota de gasto a Begoña, con el azúcar. Y que me enseñe una bien hecha.»]

Nivel 1 dice qué falta (papel) y dónde (quien dice que no). Nivel 2 da la idea («hazla mal»), que es la pista que funcionó en
la crítica, ahora con el porqué. El 3 es el de siempre.

Los otros eslabones, revisados y **sin cambio**: `cms` (pistas.js:63-66; funciona y ya no tapa al papel), `papel_fax`
(92-95: «Ese papel que te rechazaron tiene la espalda en blanco.», justo), `fuente` (96-99), `firma` (105-109, con su
`extra` del manual).

### 1(f) Cómo se prueba (`tools/test-e7-nudo.mjs`, ratón real; guardar y cargar a mitad)

1. Partida del paso 16 (ficha recién dada): en `catacumba`, `__game.objetivo.actual()` = `nota`; Mirar a Bruno dice N6; la
   abuela, nivel 1 de `nota`. En `pecera`, `actual()` = `cms` y Mirar a Bruno dice N7; tras Mirar el fax, N8.
2. Aurora → N1 → N2; `oyo_papel_begona`; Mirar ficha incluye N11 y N9 (N10 tras Mirar el fax). La opción no vuelve.
3. Begoña: N3 → N4 (una vez; desaparece con `nota_gasto_presentada` o `fax_con_papel`).
4. Dar sobre a Begoña → su línea de hoy → el menú de B_NOTA sin el saludo «Son las 19:07…»; «Café…» → «Lo que sea.» →
   sobre → «Pues enséñeme…» → fotocopia + copias (como el paso 30). Lo mismo con Usar sobre con la ventanilla.
5. «Importe cero» → N5; la opción de la nota sigue en B0.
6. Guardar con `oyo_papel_begona` y cargar: la ficha conserva N11.
7. `node tools/text-audit.mjs --estatico --plan --e2 --e5 --e6 --recuento`: topes iguales o por debajo; ninguna coletilla nueva.

---

## 2. USAR LA TELE (F2 · cambio 3)

### 2(a) Diagnóstico

`sala_amazonas.js:365` (`usar: (api) => teleSegunTurno(api, usarTele)`) y `:385` (la caja de cables, igual) pasan por
`teleSegunTurno` (75-88). Con «sin turno» y sin pregunta, esa función solo dice «BUSCANDO SEÑAL». Alguien con wifi y rencor la
encontraría enseguida.» (83) y manda al Vending. El árbol `tele_sala` (494-519) solo se abre desde `hablarTele` (63-74), es
decir, con Hablar. El crítico usó Usar, el verbo natural para una tele, e hizo el viaje.

### 2(b) Cambio exacto (`sala_amazonas.js`, paquete de la Sala)

```js
// E7 F2: la ventana «sin turno» (sin pregunta del Vending y con la reunión abierta)
const sinTurno = (api) => !!api.flag('sala_becario_sin_turno') && !api.flag('gertrudis_pregunta') && !api.flag('reunion_terminada');
/** E7 F2: la tele busca señal sola; la pista «wifi y rencor» pasa a Mirar y a Cerrar. */
async function teleBuscando(api) {
  api.setState('tele_amazonas', 'buscando'); api.sfx('click');
  await api.wait(1000);
  await api.say('«BUSCANDO SEÑAL». Alguien con wifi y rencor la encontraría enseguida.');   // literal de hoy
  api.setState('tele_amazonas', 'normal');
}
async function hablarTele(api, { usar = false } = {}) {
  if (api.flag('sala_amazonas_atasco')) { /* igual */ }
  if (api.flag('gertrudis_pregunta') && !api.flag('reunion_terminada')) { /* igual */ }
  if (api.flag('sala_becario_sin_turno') && !api.flag('reunion_terminada')) {
    if (usar) { api.setState('tele_amazonas', 'buscando'); api.sfx('click'); }   // Usar = la enciende: nieve, y el árbol
    await api.dialog('tele_sala');
    /* resto igual */
  }
  /* resto igual */
}
async function teleSegunTurno(api, deHoy, { usar = false } = {}) {
  if (api.flag('sala_amazonas_atasco')) { /* igual */ }
  if (api.flag('gertrudis_pregunta') && !api.flag('reunion_terminada')) { /* igual */ }
  if (sinTurno(api)) { if (usar) await hablarTele(api, { usar: true }); else await teleBuscando(api); return; }
  await deHoy(api);
}
```
- `tele_amazonas.usar` → `(api) => teleSegunTurno(api, usarTele, { usar: true })`.
- `caja_cables.usar` → igual, con `{ usar: true }`.
- `tele_amazonas.cerrar` → sin cambio (pasa por `teleSegunTurno` sin `usar`, así que dice «wifi y rencor»).
- `tele_amazonas.mirar`: primera rama nueva `if (sinTurno(api) && api.getState('tele_amazonas') === 'normal') { await teleBuscando(api); return; }`.
- `tele_amazonas.hablar` → `(api) => hablarTele(api)`. El árbol, el `TV0` (que ya pone `buscando` y luego `gertrudis`) y
  `teleGertrudis` no cambian.

**Resultado.** Con «sin turno», Usar la tele, Usar la caja de cables y Hablar con la tele llevan al mismo sitio: el árbol con
«Buenas noches, Gertrudis.» → «¿Y cuáles son los siguientes pasos?» → la escena. La pista «wifi y rencor» se queda donde se
mira (Mirar y Cerrar), que es lo que proponía la crítica. La vía del Vending sigue entera: con `gertrudis_pregunta`, cualquier
verbo lanza la escena directamente.

### 2(c) Textos

0 cadenas nuevas. La pista nivel 3 de `turno` (pistas.js:76) pasa de «Hablar con la tele: «Buenas noches, Gertrudis». Y lo de
los pasos.» a «La tele: «Buenas noches, Gertrudis». Y lo de los pasos.» (vale para los dos verbos).

### 2(d) Intentos equivocados

| Intento | Respuesta |
|---|---|
| Usar la tele antes de Gervasio | La rotación `TELE` de hoy |
| Usar la tele con «sin turno» → «Nada.» | La tele vuelve a `normal`; Bruno no dice nada (como Hablar) |
| Mirar la tele con «sin turno» | «wifi y rencor» (manda a Gertrudis, por la tele o por el Vending) |
| Usar el móvil con la tele | Igual que hoy («Desde mi móvil no me sintoniza nadie…») |
| Acto III | Igual que hoy |

### 2(e) Pistas

`turno`: 1 y 2 iguales; 3, el cambio de 2(c); `previa` igual.

### 2(f) Cómo se prueba

- Extra nuevo **XE7-T1** (tras 27): Usar `tele_amazonas` → opción «Buenas noches, Gertrudis.» → «¿Y cuáles son los siguientes
  pasos?» → `gertrudis_pregunta`, `reunion_terminada`, `sala_amazonas_estampida`; el Vending no se pisa.
- **XE7-T2**: Usar `caja_cables` → el árbol (igual que la tele).
- **XE5-10** (extras.mjs:103), `test-e5-pa.mjs:176` y `test-e6-pa.mjs:242`: «wifi y rencor» se busca ahora con **Mirar** tele,
  no con Usar. Cambio de prueba, para I2.
- `play-mouse`: el paso 28 puede seguir con Hablar; conviene una variante con Usar (clic en el verbo y en la tele).

---

## 3. EL DUELO DE GERVASIO CON MECÁNICA PROPIA (problema 4 · cambio 4)

### 3(a) Diagnóstico

`pajarera.js:218-264`: mazo `['R07', 'R03', 'R01', 'R05']`, `winScore: 2`, remate a los 2 con la fotocopia. Se juega igual
que Maripaz: emparejar por palabra clave. El ataque R03 a medias («El acta se necesitaba para... para...», E6 §5.2) tiene
gracia, pero no cambia cómo se decide. Teodoro tiene una regla de forma (`cabe`, engine/duel.js:150-163, 252-259). Gervasio
no tiene nada.

### 3(b) Tres mecánicas posibles

**A. «No le pises la frase» (la crítica: «que llegue a tiempo»).** Gervasio no acaba las frases. Las escribe a trozos y
cambia de idea a mitad. El menú se abre con el primer trozo, y debajo de la ventana pone «Gervasio está escribiendo...».
Contestar mientras escribe le corta («Me has interrumpido. Se apunta.»): no es fallo y la frase vuelve a empezar. Cuando
deja de escribir, la frase ya es otra y se contesta a como ha acabado, no a como empezaba. La decisión nueva es **cuándo**
contestar, no solo qué. Es su personaje (habla en borrador, se corrige solo: «Ese correo se contesta... se contestará.»,
«Se está... se avanza»), se entiende al primer intento y fallar no cuesta nada.

**B. «El marrón» (en copia).** Cada ataque de Gervasio reasigna el acta: el campo «Asignado a» pasa a «Vacante (becario)» y
la lista de CC crece. Acertar la devuelve («Asignado a: Gervasio Acta») y gana quien la tenga al llegar el remate. Se ve
bien en la ventana de correo y es muy de jefe intermedio. Pero la decisión sigue siendo emparejar frases: es una forma de
contar lo mismo, no una mecánica. Descartada.

**C. «Para ayer».** Cada ataque llega con fecha de ayer y una cuenta atrás. Contestar tarde es «Se verá» y el ataque se
aplaza. Castiga a quien lee despacio y a quien juega en el móvil, y le va al revés al personaje: Gervasio nunca tiene prisa.
Descartada.

**Se desarrolla la A.** Es la de la crítica, y es el espejo de la de Teodoro: allí cuenta la forma de la réplica, aquí el
momento.

### 3(c) Diseño de la A

**Asaltos (≤ 3).** Dos asaltos y el remate, como hoy: R07 (con cambio de idea), R03 (se queda en el aire) y la fotocopia.
R01 y R05 solo salen tras un fallo. Ninguna réplica nueva que aprender: R07 (paso 11) y R03 (paso 14) ya están en la libreta
en los dos recorridos.

**Cómo va cada ataque con trozos.**
1. Gervasio dice el **primer trozo** en su globo, como un ataque normal. El cuerpo del correo pone ese trozo.
2. Se abre el menú (réplicas + floja, como siempre). A la vez, debajo de la ventana, en el hueco del hilo, sale
   **«Gervasio está escribiendo...»** con los puntos animados. Gervasio sostiene el móvil (`api.sostener(G, 'movil')`) y teclea
   (`reach` corto y `sfx('click')` por trozo).
3. Cada `ms` (mínimo, el tiempo de lectura del trozo: `game.timedMs('duelo', trozo, ms)`) el cuerpo crece con el siguiente
   trozo, sin globo.
4. Tras el último, desaparece «está escribiendo», suelta el móvil y el cuerpo queda con la frase entera. Esa es la que cuenta.
5. **Si elige antes de que acabe** (cualquier opción, también la floja o el comodín): Bruno dice el principio de su réplica
   cortado («A ti te consta...», «Ayer no puedo...»), y Gervasio contesta, la primera vez, **«Me has interrumpido. Se
   apunta.»** y después su rotación de `taunt`. **No cuenta como fallo**: ni RE:, ni CC, ni se mueve el mazo, ni se gasta el
   comodín. El mismo ataque vuelve a empezar desde el primer trozo.
6. **Si elige después**: el duelo de siempre (acierto, fallo, floja, comodín).

**El cambio de idea (R07).** El primer trozo empieza como la R03 («Esto se necesitaba para...») y la frase acaba en la R07
(«…y esto, me consta, ya lo hablamos.»). Quien contesta enseguida con la R03, la que parecía, se lleva el «Me has
interrumpido». Quien espera ve que la frase ha cambiado. El primer «no» enseña la regla y no cuesta nada.
**La frase en el aire (R03).** «El acta se necesitaba para...» → «para...» y deja de escribir. La R03 («Ayer no puedo. Te miro
hueco para anteayer.») le termina la frase. Es el gag de E6, ahora con su momento.

**Lo que se ve en pantalla (320×200).**
- Ventana de correo de siempre (63 px). El cuerpo se va llenando; si pasa de dos líneas, se ven **las dos últimas** (con «…»
  delante), para que el trozo nuevo esté siempre a la vista.
- Debajo de la ventana, donde va el hilo, la línea «Gervasio está escribiendo...» en el color del hilo, con 1-3 puntos que
  cambian cada 400 ms. Si a la vez hay un hilo (+1 o cameo), van uno encima del otro (`hudTop` + 11).
- Gervasio con el móvil en la mano, en la puerta de la Sala.
- Al interrumpir: el globo de Bruno cortado y, encima, el de Gervasio. El cuerpo vuelve al primer trozo.

**Remate.** Igual que hoy: «Yo con Hidrovoltia no he comido en mi vida. Ni cenado.» → [Usar objeto] → fotocopia →
`remateHidrovoltia`. Los remates no llevan trozos.

### 3(d) Cambio en `engine/duel.js` (API como la de `cabe`; paquete P0)

**Datos del rival:**
```js
aTiempo: {
  trozos: { R07: ['…', '…', '…'], R03: ['…', '…'], R01: ['…', '…'], R05: ['…', '…'] },
  ms: 1500,                                   // por trozo (con game.timedMs: nunca menos que leerlo)
  escribiendo: 'Gervasio está escribiendo',   // se pintan detrás 1-3 puntos
  interrumpe: 'Me has interrumpido. Se apunta.',   // 1.ª interrupción del duelo; luego, `taunt`
  sostener: 'movil',                          // opcional: lo que sostiene el rival mientras escribe
},
```
**Motor** (en `runDuel`, en el lugar del ataque, engine/duel.js:132-149):
```js
const tz = opp.aTiempo && opp.aTiempo.trozos && opp.aTiempo.trozos[pid];
let tl = null;
if (tz) {
  S.body = tz[0]; info.body = tz[0];
  await say('rival', tz[0]);
  tl = { done: tz.length < 2 || game.fast || game.instant, cancel: false };
  if (tl.done) { S.body = tz.join(' '); info.body = S.body; }
  else {
    S.escribiendo = opp.aTiempo.escribiendo; info.escribiendo = true;
    if (opp.aTiempo.sostener) api.sostener(actorId, opp.aTiempo.sostener);
    (async () => {
      for (let k = 1; k < tz.length; k++) {
        await game.sleep(game.timedMs('duelo', tz[k], opp.aTiempo.ms || 1500));
        if (tl.cancel) return;
        S.body = tz.slice(0, k + 1).join(' '); info.body = S.body; api.sfx('click');
      }
      tl.done = true; S.escribiendo = null; info.escribiendo = false;
      if (opp.aTiempo.sostener) api.sostener(actorId, null);
      game.log.push({ who: 'aviso', name: null, text: `${fromName}: ${S.body}`, room: game.state && game.state.room, t: Math.round(game.time) });
    })();
  }
} else { S.body = attack; info.body = attack; await say('rival', attack); }
// … buildMenu y choose como hoy …
const i = await game.choose(/* igual */);
const ch = opts[Math.max(0, i)];
if (tl && !tl.done) {                                            // E7: contestó mientras escribía
  tl.cancel = true; S.escribiendo = null; info.escribiendo = false;
  if (opp.aTiempo.sostener) api.sostener(actorId, null);
  info.options = null; info.optionPairs = null; info.correctIndex = -1; info.weakIndex = -1;
  await say('player', cortada(ch.text));
  S.interrumpeN = (S.interrumpeN || 0) + 1; info.interrumpeN = S.interrumpeN;
  await say('rival', S.interrumpeN === 1 && opp.aTiempo.interrumpe ? opp.aTiempo.interrumpe : next('taunt'));
  continue;                                                     // mismo ataque, desde el primer trozo; 0 fallos
}
if (tl) tl.cancel = true;
// … a partir de aquí, igual que hoy: S.round++, say('player', ch.text), larga / acierto / comodín / fallo …
```
- `cortada(t)`: lo que hay hasta el primer `.`, `,`, `:`, `;`, `?` o `!`, o las tres primeras palabras si es más corto, más
  `...` («A ti te consta...», «Ayer no puedo...», «Lo leímos todos...», «Tranquilo...», «Te lo miro...»).
- En el `finally` del duelo: `if (tl) tl.cancel = true` (con una variable `tlActual` a nivel de `runDuel`) y `S.escribiendo = null`.
- `drawHud`: si `S.escribiendo`, pinta la línea del hilo `S.escribiendo + '.'.repeat(1 + Math.floor(game.realTime / 400) % 3)`
  debajo de la ventana; y si `S.escribiendo` o el cuerpo venía de `tz`, el cuerpo enseña las dos **últimas** líneas.
- `game.duelInfo` añade `escribiendo` (bool) e `interrumpeN`, para las pruebas.
- El ataque se registra en el log solo por su primer trozo (el globo). La frase entera entra como `aviso`, con el nombre
  delante (así la ve quien transcribe y no suma en los topes de lo que dice Gervasio).
- Modo rápido (recorridos) e `instant`: sin trozos; la frase entera de golpe. `walk-lib` no cambia.
- Todo es **opt-in**: sin `aTiempo` en el rival, el motor hace exactamente lo de hoy. Maripaz, Teodoro e Íñigo no lo llevan.

`docs/CONTENT_SCHEMA.md` §10 (lo hace I2): una entrada «E7 `aTiempo`» junto a `cabe`.

### 3(e) Datos del duelo y textos definitivos (`pajarera.js`, `dueloGervasio`)

```js
deck: ['R07', 'R03', 'R01', 'R05'],     // igual
winScore: 2, maxMisses: 3,              // igual
attackText: { /* se quedan como respaldo (frase entera); con trozos no se dicen */ },
aTiempo: {
  ms: 1500, escribiendo: 'Gervasio está escribiendo', interrumpe: 'Me has interrumpido. Se apunta.', sostener: 'movil',
  trozos: {
    R07: ['Esto se necesitaba para...', 'para cuando se pueda...', 'y esto, me consta, ya lo hablamos.'],
    R03: ['El acta se necesitaba para...', 'para...'],
    R01: ['Ya se dijo en el otro correo...', 'ese que no se leyó...'],
    R05: ['Lo del acta, entre tú y yo...', 'que no salga de esta puerta.'],
  },
},
intro, hurt, taunt, finishers, cc1, defeat*, onWin: igual que hoy.
```
Frases enteras que quedan en el cuerpo:
- R07: «Esto se necesitaba para... para cuando se pueda... y esto, me consta, ya lo hablamos.» (85; en el cuerpo, dos líneas)
- R03: «El acta se necesitaba para... para...» (la de E6)
- R01: «Ya se dijo en el otro correo... ese que no se leyó...»
- R05: «Lo del acta, entre tú y yo... que no salga de esta puerta.»

Textos nuevos del duelo: el R07 en trozos (sustituye a «Esto ya se... se habló. Me consta. Lo hablamos.»), el troceado de R03,
R01 y R05 (las mismas palabras de hoy), «Me has interrumpido. Se apunta.» y el rótulo «Gervasio está escribiendo». El
`hurtByPair.gervasio.R07` («Me consta que... Bueno. Se constaba.», duelo.js:61) encaja sin tocarlo.

**Taunts tras la primera interrupción** (los de hoy): «Eso se... Eso no venía a cuento. Se agradece.» / «Se toma nota. La
tomas tú.».

### 3(f) Tabla DONDE y pistas

**DONDE:** sin cambios (no hay réplicas nuevas): R07 → `rep_07` (Despachos, ordenador de Gervasio), R03 → `rep_03`
(Vending, primer chisme), R01 y R05 de reserva.

**Pistas `acta`** (pistas.js:143-146), con el mismo `duelo: 'gervasio'` (que ya añade dónde está la réplica que falte):
1. «En una reunión manda el que escribe el acta. Que la escriba otro.» (igual)
2. «A ese señor no le pises las frases, hijo. Espera a que se le acaben.»
3. [«Cuando deje de escribir, contéstale. Y al final, su cuenta de la comida.»,
   «Gervasio: esperar a que acabe de escribir. Remate: su nota de la comida.»]

### 3(g) Comprobaciones: clímax y duelo final

- D4 (Íñigo, `escenas/climax.js`) no lleva `aTiempo`: el motor no cambia para él. Gervasio, en el clímax, solo habla como
  extra (la floja «siguientes pasos», `sala_amazonas_gervasio_agachado`). No hay duelo suyo ahí.
- Revancha (regla 9): la interrupción no mueve el mazo, así que «empieza por la carta que ganó» sigue igual.
- Guardar a mitad: el duelo ya no se guarda y al cargar se reinicia (core.js). El temporizador de trozos muere con el
  `finally` del duelo.
- Derrota: solo por fallos de verdad (tres, como hoy). Interrumpir nunca cuenta.
- Duración: R07 ≈ 1,5 + 2 × 1,5-2 s de escritura; R03 ≈ 1,5 s. Unos 5 s más que hoy a velocidad normal; 0 en modo rápido.

### 3(h) Cómo se prueba (`tools/test-e7-d3.mjs`, ratón real, **sin** modo rápido en estas comprobaciones)

1. Partida del paso 45 → Hablar con Gervasio → «Necesito el acta…». Primer menú con `duelInfo.escribiendo === true` y el
   rótulo en pantalla (captura). Clic en la R03 antes de que acabe → log «Ayer no puedo...» y «Me has interrumpido. Se
   apunta.»; `misses === 0`; el ataque vuelve a ser R07.
2. Segunda interrupción → taunt; sigue con 0 fallos.
3. Esperar a `escribiendo === false` → el cuerpo acaba en «ya lo hablamos.» → R07 → acierto. R03: esperar → R03 → remate →
   fotocopia → acta, `sala_abierta`.
4. Con la frase acabada, una réplica equivocada sí cuenta como fallo (RE:, CC); tres fallos → derrota de siempre.
5. Comodín durante la escritura: interrupción, y el comodín sigue sin gastar.
6. Guardar y cargar con el duelo abierto: reinicia sin rótulo colgado.
7. `play-mouse`: antes de pinchar una réplica en D3, esperar a `escribiendo === false`. Capturas
   `tools/shots/e7-d3-escribiendo.png` y `e7-d3-interrumpe.png` (MIRARLAS: el rótulo no tapa a Gervasio ni a Bruno).
8. Recorrido (modo rápido): el paso 46 pasa igual que hoy.

---

## 4. TRES FALLOS BARATOS

### F3 · Tras adjuntar en un duelo, la barra se queda con «Usar <objeto>»

**(a)** Mientras se elige un objeto, `updateHover` pone `ui.hover` en el objeto del inventario que hay bajo el ratón
(core.js:1580-1584). Al resolverse `pickItem` (core.js:1084) nadie lo borra. Si el ratón no se mueve, `sentenceText` (core.js:895)
pinta «Usar <nombre>», aunque el objeto ya no esté en el inventario (la fotocopia en D3) o el duelo haya acabado.
**(b)** P0, `engine/core.js`:
- en `pickItem`, la `resolve`: `this.itemPick = null; this.ui.hover = null; this.ui.sentence = null; res(id); this.checkIdle();`
- en `sentenceText`, antes de componer: `if (h && h.kind === 'inv' && !this.state.inventory.includes(h.id)) h = null;`
**(c)** Sin textos. **(f)** En `test-e7-motor.mjs`: D1 y D4 con ratón real, adjuntar sin mover el ratón → `sentenceText()`
no empieza por «Usar»; captura de la barra al acabar.

### F4 · «¿Falta mucho?» corta sin explicación visible

**(a)** `administracion.dialogos.js:188-194`: tras la poda E326, solo queda un `reach` de 400 ms (ilegible a 320×200), la línea
de Evaristo y un `typewriter`; la conversación se cierra y parece un error.
**(b)** Gag de acción: Evaristo lo pone por escrito, de verdad. El `do` de la opción:
```js
do: async (api) => {
  await api.anim(api.player, 'reach', 700);              // Bruno mira el móvil (más largo)
  await sayEv(api, 'Si tiene prisa, se lo pongo por escrito.');
  api.faceActor(EV, 'up');                               // se da la vuelta, de espaldas
  for (let i = 0; i < 3; i++) { api.sfx('typewriter'); await api.wait(380); }   // tac, tac, tac
  api.notice('Correo nuevo de Evaristo Salvedad: «Una cosita (1 de 3)».');
},
```
Al cerrarse, `hablarEvaristo` le devuelve a su mesa (administracion.js:43-46, como hoy). La próxima vez que se le habla dice
«Disculpe. ¿Tiene un segundo? Son tres.» (línea 163), que ahora paga el «1 de 3» sin cambiar nada.
**(c)** Texto nuevo (aviso, no hablado): «Correo nuevo de Evaristo Salvedad: «Una cosita (1 de 3)».» (58).
**(d)** El aviso se lee como causa del corte: se ha ido a escribirlo. La segunda vez que se elige, la regla de despedidas
calla la línea, pero el gesto y el aviso salen.
**(f)** Administración → Evaristo → «¿Para qué me ha llamado?» → «¿Falta mucho?» → aviso en el log (`who: 'aviso'`);
Evaristo de espaldas en la captura `e7-f4-evaristo.png`. Ojo: los avisos no se pintan en modo rápido (core.js:198), pero sí van
al log.

### F6 · La escena de Anselmo tras el kanban lía

**(a)** `pecera.dialogos.js:311-347` (`salida`): seguidas, «Y en nuestros corazones, Brais está en HECHO.» (312, no es de
Anselmo), el revocado (336), Leoncio traduciendo el chiste (337), «Nos hemos quedado sin IA de la casa.» (342), la pantalla de
Herminia (346) y «...Lo miro en la próxima versión.» (347). Son tres ideas encadenadas y una traducción.
**(b)** Dos tiempos, sin que nadie explique:
- (a) la pantalla de Anselmo: «ACCESO REVOCADO: TITULATOR 3000» (como hoy) → Anselmo: «Revocado. Fecha: hoy. Efectos: julio.»
- (b) Anselmo va hacia Infografía (paseo y cámara de hoy) → se para, mira el portátil, aparta la vista, lo vuelve a mirar
  (`faceActor` izquierda, 700 ms, derecha, 400 ms, izquierda) → Leoncio pone las dos manos encima (el `reach` de 1500 ms de
  hoy) → la pantalla: «alta de usuario: no · propietaria: Infografía» (la de hoy, por `talk` con `'H'`, es decir,
  `api.pantalla`) → `wait(600)` → Anselmo vuelve a su sitio **sin decir nada**.
Se borran, en `salida`: «Y en nuestros corazones, Brais está en HECHO.» (queda «Columna nueva. La primera que no dice que no.»
/ «El tablero va conectado al registro de Eutimio.»), la línea de Leoncio «Integró una IA…», «Nos hemos quedado sin IA de la
casa.» y «...Lo miro en la próxima versión.».
**(c)** 0 cadenas nuevas; −4 cadenas, las cuatro en el camino principal (paso 45).
**(d)** El que no lo pille ve igualmente lo esencial: el Titulator fuera y Herminia que no se deja coger.
**(f)** `test-comedia-p2.mjs:425-427` y `:526` (la captura «salida-revocado» espera la línea de Leoncio): pasan a esperar
«Revocado. Fecha: hoy. Efectos: julio.» y la pantalla de Herminia, y a comprobar que **no** salen las cuatro borradas. Captura
`e7-f6-herminia.png` (MIRARLA: el gesto de Anselmo y las manos de Leoncio tienen que leerse; si no, ver §6, decisión 6).

---

## 5. RECORRIDO, SALDO, PAQUETES Y RIESGOS

### 5.1 Recorrido (`tools/walk-data.mjs`)

**Los 49 pasos no cambian de acciones ni de orden.** El paso 30 (nota de gasto por el menú) y el 28 (Hablar tele) siguen
valiendo. Los pasos 45 y 46 pasan igual: en el 45 desaparecen cuatro líneas; en el 46, en modo rápido no hay trozos. Solo
cambia el texto descriptivo:
```js
{ n: 45, … txt: '[E5] Rotulador + kanban → SALIDA EN VALOR (Bruno mueve el pósit) (E5 46) [E7 F6: escena en dos tiempos]', … },
{ n: 46, … txt: '[E6] Gervasio en la puerta → D3: R07 y la frase a medias (R03) (E5 47) [E7: con trozos; modo rápido sin ellos]', … },
```
`ALT` igual. Extras nuevos (para I2): **XE7-N1** Dar sobre a Begoña → B_NOTA → nota entera (alternativa al 30); **XE7-N2**
Aurora «¿De dónde saco papel…?» + Begoña «¿Me da unos folios…?» + ficha con N11; **XE7-N3** «Importe cero» → N5; **XE7-T1/T2**
tele y caja con Usar; **XE7-F4** «¿Falta mucho?» → aviso. XE5-10 pasa a Mirar tele.

### 5.2 Saldo

| Partida | Cadenas en `content/` | Camino principal (líneas) |
|---|---:|---:|
| Nudo (N1-N4, N6-N8, N10, N11; N5 y N9 sustituyen; pistas `nota` sustituyen) | +9 | 0 |
| Impresora (N12, opcional) | +1 | 0 |
| Tele | 0 | 0 |
| D3: R07 en 3 trozos (+2), R03/R01/R05 troceados (+3), «Me has interrumpido» (+1), rótulo (+1); pistas `acta` sustituyen | +7 | 0 dichas (el R07 y el R03 siguen siendo un globo cada uno; las frases enteras van como `aviso`) |
| F4 (aviso) | +1 | 0 |
| F6 | −4 | **−4** |
| F3 | 0 | 0 |
| **Total** | **+13 (+14 con la impresora)** | **−4** (≤ +6 ✓) |

Si la medida del camino cuenta los avisos como líneas, el D3 suma +2 y el total es −2. Sigue dentro.
**Reloj** (velocidad normal): D3 ≈ +5 s; F6 ≈ −10 s; total ≈ −5 s (≤ +1 min ✓). En modo rápido, −4 líneas.
**Topes:** remate seco +1 («Me has interrumpido. Se apunta.»: es el golpe y se queda), 515 de ≈ 3.571 ≈ 14,4 %. «Lo hablamos»
de Gervasio, oídas −1 (el R07 entero ya no es globo). «próxima versión» de Anselmo −1. «de la casa» −1. Coletillas,
«criatura», «chaval», «cariño», «niño» y «triplicado» de Begoña: +0. Duplicados audibles: 0 (la línea de Begoña del sobre se
oye en un solo sitio; «wifi y rencor» sigue en una sola sala).

### 5.3 Reparto en paquetes de ficheros disjuntos

| Paquete | Ficheros | Qué |
|---|---|---|
| **P0 · motor** | `engine/duel.js`, `engine/core.js` | `aTiempo` (§3d), rótulo y cuerpo en cola, `duelInfo.escribiendo/interrumpeN`; F3. Prueba `tools/test-e7-motor.mjs` (un rival de demo con `aTiempo`) |
| **I1 · comunes** | `content/flags.js`, `content/items.js`, `content/pistas.js` | `oyo_papel_begona`; ficha (N9-N11, `firmaPapel`, margen en dos); metas `nota` y `cms`, `salas` de `nota`, niveles de `nota`, `acta` y `turno` nivel 3 |
| **PA · Administración** | `content/rooms/administracion.js`, `administracion.dialogos.js` | E2 (N3-N4), E3 (sobre → B_NOTA, `ENTRADA`), E4 (N5), F4 |
| **PB · Redacción de papel** | `content/rooms/catacumba.js` | E1 (N1-N2) |
| **PC · Sala** | `content/rooms/sala_amazonas.js` | Tele (§2b) |
| **PD · Despachos** | `content/rooms/pajarera.js` | `dueloGervasio.aTiempo` (§3e). Depende de P0 (sin P0, `aTiempo` se ignora y el duelo es el de hoy: se puede entregar en paralelo) |
| **PE · Redacción** | `content/rooms/pecera.dialogos.js` | F6 |
| **PF · Marketing (opcional)** | `content/rooms/ecosistema.js` | N12 (impresora) |
| **I2 · integración** | `tools/walk-data.mjs` (txt), `extras.mjs`, `play-mouse.mjs`, `test-fase0.mjs` (literal del margen, línea 180), `test-comedia-p2.mjs`, `test-e5-pa.mjs`, `test-e6-pa.mjs`, `test-e7.mjs`, `docs/CONTENT_SCHEMA.md` §10 | Pruebas y documentación |

Orden: P0 ∥ I1 → PA ∥ PB ∥ PC ∥ PD ∥ PE (∥ PF) → I2.

### 5.4 Riesgos

1. **El otro autor (golpes podados) trabaja a la vez.** Puede tocar `administracion.js` (E312, «Una por cuatrienio», en el
   archivador), `catacumba.js` (E224 y otras), `ecosistema.js` (E042, E046…), `pecera*.js` y `office.js`. Los cambios de E7 van
   por clave literal y en zonas distintas (opciones nuevas, `dar:sobre_azucar`, `salida`, la tele). Hay que fusionar con
   cuidado, y por eso PF es opcional.
2. **La primera interrupción en D3 puede parecer un error** si el rótulo no se lee. Mitigación: el rótulo va en el sitio del
   hilo, que el jugador ya lee; Gervasio tiene el móvil en la mano; y la línea «Me has interrumpido» lo dice todo. Hay que
   mirar la captura.
3. **Concurrencia en el motor**: el temporizador de trozos corre en paralelo a `choose`. Si queda vivo tras el duelo, ensucia
   el cuerpo del correo del siguiente. Por eso la cancelación va en el `finally`, y la prueba 6 de §3h lo comprueba.
4. **F6 en silencio** depende de que se lea un gesto a 320×200 (lo mismo que falló con Evaristo). La pantalla de Herminia
   lleva el texto que lo explica, pero si la captura no convence, ver la decisión 6.
5. **Pruebas de hoy que cambian a propósito**: XE5-10, `test-e5-pa:176`, `test-e6-pa:242` («wifi y rencor» con Usar),
   `test-fase0:180` (literal del margen), `test-comedia-p2:425-427/526` (F6), `play-mouse` en D3 (esperar a que acabe).
6. **Pistas**: con `nota` en `catacumba`, en la Redacción de papel deja de salir la pista del CMS. Quien tenga ya el papel y no
   el manual sigue recibiendo el `extra` de `firma` («El de los ordenadores no da nada sin número…»), así que el CMS no queda
   huérfano.

---

## 6. Decisiones para el dueño

1. **Ficha: no a la cuarta casilla.** La crítica pedía «CMS: en coma» como cuarta casilla, pero «tres casillas» se dice en
   seis sitios. Propongo la nota al margen reescrita (dice para qué sirve el CMS: el fax) y la casilla FIRMA con el papel.
   Si se prefiere la cuarta casilla, hay que reescribir esas seis líneas.
2. **La opción de Begoña «¿Me da unos folios?» (N3-N4)** es la entrada más directa. Si parece demasiado mascada, se quita: el
   nudo queda con Aurora (N2), el sobre (E3), «Importe cero» (N5) y las pistas.
3. **«Varios» se queda como chiste puro**, sin pista (es carcajada; un «no» que apunte ahí sería una coletilla tras el remate).
4. **El cambio de idea del R07** («Esto se necesitaba para...» acaba en «me consta») es la trampa que enseña la regla. Si se
   prefiere un duelo sin trampa, los trozos del R07 pueden ser los de hoy («Esto ya se...» / «se habló. Me consta.» / «Lo
   hablamos.»).
5. **La impresora (N12)** es opcional y choca con el fichero del otro autor.
6. **F6 sin «Nos hemos quedado sin IA de la casa.»**: si la captura no deja claro que Anselmo va a por Herminia, esa línea
   (y solo esa) vuelve antes del paseo. El saldo del camino pasa a −3.
