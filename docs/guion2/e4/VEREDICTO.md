# VEREDICTO · titulador de Discover, segunda vuelta (juez y editor final)

Ficheros:
- `titulador/piezas.json` es el juego definitivo y lo genera `titulador/v2/construir.py`. Los cambios de cada vuelta
  están en `v2/vuelta_r2…r6.py`.
- `titulador/gen.mjs` saca titulares al azar (`node gen.mjs N semilla`) y valida las 1.344 con `--todas`.
- `titulador/v2/fijos.mjs` tiene los 24 titulares fijos y comprueba su ancho y los topes del auditor.
- Las seis tiradas en bruto están en `v2/tirada_r1…r6_*.txt`. Mis notas de la final, en `v2/notas_r6.txt`.
- La cata a ciegas está en `vuelta2/cata/` (`ciega.txt`, `clave.json`, `notas_criterio1.txt`, `notas_criterio2.txt` y
  `destapar.mjs`).
- El juego anterior está guardado en `titulador/anterior_v1/`.

## RETOQUE FINAL (tras el «en general están mejor» del dueño)
**Qué cambia** (el formato de `piezas.json` y la interfaz de `gen.mjs` son los mismos):
- **Sale la autoridad `atencion`** («Atención si tienes», la más floja de la cata, 1 de 10). **Entra `meteorologos`**
  («Los meteorólogos avisan», k 1,9), con moldes reales del parte del tiempo y una sola sustitución:
  - corte: «Los meteorólogos ponen fecha a la llegada de X: será el...»
  - obvio: «…X entra por Galicia este fin de semana»
  - punto: «X dejará hasta 40 litros por metro cuadrado.»
  - senales: «X llega con fuerza: estas son las zonas afectadas»
  - probe: «Las imágenes de X a su paso por Cuenca»
  - prisa: «Alerta naranja por X en media España»
  - curioso: «Llega el veranillo de X: hasta cuándo durará»
  - truco: «Adiós a X: los meteorólogos confirman el cambio a partir del jueves»
- **`demo_paso_34`** pasa de `['atencion','robledal','corte']` a **`['meteorologos','robledal','corte']`**. Texto: «Los
  meteorólogos ponen fecha a la llegada de Banco Robledal: será el...». Sigue valiendo **9.500**.
- **`hidro`**:
  - el menú vuelve a «Hidrovoltia lanza una opa»;
  - salen todos los moldes de eléctrica (el corte de luz de 9 a 14 horas, «regala X a sus clientes», el aviso de estafa,
    «te ha cambiado sin avisar», «pagar menos por», «darse de baja», «seguirá llegando con normalidad»);
  - las ocho plantillas dicen ahora «opa», así que todas dicen algo y se hunden. Entre ellas, «Tengo X y Hidrovoltia lanza
    una opa: qué hago» y «Si tienes X, esto es lo que te ofrece Hidrovoltia en su opa».
- Plantillas reescritas en otras autoridades:
  - Tráfico: corte → «Los radares de Tráfico ya detectan X y la multa es de...»; obvio → «Tráfico aclara si X puede viajar en
    la baca del coche»; truco → «Cómo saber si Tráfico te ha multado por X: el truco».
  - El pueblo: corte → «…donde X se hereda de padres a...».
  - Hogar: señales → «…hay que tirar X».
- Especiales nuevos: `hogar|persianas|prisa` y `confirmado|mejillones|probe`.
- `version` = `titulador-vuelta2-r7`.
- `gen.mjs` saca el hito de la demo de `demo_paso_34` en lugar de un id escrito a mano. Su interfaz no cambia.
- Ningún asunto, gancho, secreto, línea de Yoli ni categoría cambia.
- Hoja: F17 pasa a ser «La moneda de 2 euros con el Euríbor que vale una fortuna». La frase de Galicia ahora sale como
  combinación.

**Tiradas tras el retoque** (100 al azar, semilla nueva cada una y criterio del dueño):

| Tirada | Semilla | 3 | 1 | Qué se cambió después |
|---|---|---|---|---|
| 7 | 39187 | 61 % | 3 % | Arreglados tres unos (esta tirada no cuenta) |
| 8 | 52463 | 55 % | 3 % | Corte y truco de Tráfico y testimonio de los meteorólogos |
| 9 | 67741 | 57 % | 3 % | Señales y corte de Hidrovoltia, corte del pueblo y obvio de Tráfico |
| **10** | **81953** | **65 %** | **2 %** | **Final, con las piezas en su versión final** |

Con 100 titulares la cifra oscila unos ±5 puntos según la semilla. El objetivo se cumple en la final, pero la media de
las tres tiradas tras el retoque está en torno al 59 %.
- Por autoridad, en la final: Tráfico 9 de 9, expertos 11 de 13, hogar 7 de 8, pareja 6 de 8, Confirmado 7 de 10,
  cocineros 7 de 11, nutricionista 5 de 7, analistas 4 de 6, meteorólogos 4 de 8, psicología 2 de 4, Hidrovoltia 2 de 8
  (es la que se hunde) y el pueblo 1 de 8 (lo más flojo que queda).
- Siguen intactas las nueve literales del dueño, Bruno = 3, opa ≤ 180, mejillones = 243.000 como ganador por defecto,
  persianas = 312.000 y el récord de 576.000. `--todas` da 0 fallos.

### Tirada final (semilla 81953), con mi nota

| # | combinación | usuarios | titular | etiqueta | Yoli | nota |
|---|---|---|---|---|---|---|
| 1 | nutricionista·nomina·obvio | 38.300 | Qué le pasa a tu cuerpo si comes la nómina todos los días | VERDAD COMO UN TEMPLO | **3** |
| 2 | cocineros·opa·obvio | 160 | Los cocineros coinciden: la opa de Hidrovoltia se hace mejor a fuego lento | SOLO LOS DE HIDROVOLTIA | **2** |
| 3 | nutricionista·ipc·truco | 1.020 | Una nutricionista revela cómo comer el IPC sin engordar | SECCIÓN DE ECONOMÍA | **3** |
| 4 | trafico·hacienda·obvio | 48.000 | Tráfico aclara si Hacienda puede viajar en la baca del coche | VERDAD COMO UN TEMPLO | **3** |
| 5 | expertos·robledal·probe | 8.000 | Purgué Banco Robledal como dicen los expertos y esto es lo que pasó | SECCIÓN DE ECONOMÍA | **3** |
| 6 | expertos·deuda·prisa | 2.240 | Los expertos piden purgar la deuda pública antes de encender la calefacción | SECCIÓN DE ECONOMÍA | **3** |
| 7 | analistas·mejillones·obvio | 75.600 | Los analistas recomiendan guardar los mejillones de lata en un lugar fresco y seco | VERDAD COMO UN TEMPLO | **1** |
| 8 | nutricionista·opa·punto | 3 | Una nutricionista desaconseja comer la opa de Hidrovoltia. | SOLO LOS DE HIDROVOLTIA | **2** |
| 9 | meteorologos·opa·curioso | 100 | Llega el veranillo de la opa de Hidrovoltia: hasta cuándo durará | SOLO LOS DE HIDROVOLTIA | **2** |
| 10 | trafico·ibex·senales | 210 | Tráfico avisa: si ves el Ibex 35 en la carretera, reduce la velocidad | SECCIÓN DE ECONOMÍA | **3** |
| 11 | cocineros·deuda·curioso | 2.270 | Los cocineros nunca piden la deuda pública en un restaurante: este es el motivo | SECCIÓN DE ECONOMÍA | **3** |
| 12 | confirmado·pib·corte | 1.500 | Confirmado: el PIB se puede meter en el microondas si... | SECCIÓN DE ECONOMÍA | **3** |
| 13 | hidro·opa·truco | 3 | Cómo saber si la opa de Hidrovoltia sobre la opa de Hidrovoltia te afecta | SOLO LOS DE HIDROVOLTIA | **2** |
| 14 | hidro·prima·prisa | 3 | Opa de Hidrovoltia sobre la prima de riesgo: tienes hasta el viernes para vender | SOLO LOS DE HIDROVOLTIA | **2** |
| 15 | expertos·pib·senales | 2.200 | Las 5 señales de que el PIB tiene humedad, según los expertos | SECCIÓN DE ECONOMÍA | **3** |
| 16 | expertos·nomina·punto | 850 | Los expertos recomiendan ventilar la nómina diez minutos al día. | DICHO. NADIE ENTRA | **3** |
| 17 | pueblo·opa·obvio | 140 | El pueblo de España donde la opa de Hidrovoltia se sigue haciendo a mano | SOLO LOS DE HIDROVOLTIA | **2** |
| 18 | cocineros·opa·curioso | 97 | Los cocineros nunca piden la opa de Hidrovoltia en un restaurante: este es el motivo | SOLO LOS DE HIDROVOLTIA | **2** |
| 19 | pueblo·persianas·probe | 120.000 | Dejé la ciudad por un pueblo sin las persianas y esto es lo que pasó | LE PASÓ A ALGUIEN | **2** |
| 20 | expertos·robledal·punto | 200 | Los expertos recomiendan ventilar Banco Robledal diez minutos al día. | DICHO. NADIE ENTRA | **3** |
| 21 | psicologia·plazofijo·punto | 260 | La psicología lo confirma: tu relación con el plazo fijo es dependencia emocional. | DICHO. NADIE ENTRA | **2** |
| 22 | meteorologos·prima·probe | 4.560 | Las imágenes de la prima de riesgo a su paso por Cuenca | SECCIÓN DE ECONOMÍA | **3** |
| 23 | pareja·nomina·obvio | 45.900 | Si la nómina hace esto, no te quiere | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 24 | pueblo·deuda·punto | 53 | El pueblo de España que vive sin la deuda pública desde la Edad Media. | DICHO. NADIE ENTRA | **2** |
| 25 | hogar·nomina·probe | 25.500 | Metí la nómina en el congelador y esto es lo que pasó | LE PASÓ A ALGUIEN | **3** |
| 26 | psicologia·opa·corte | 130 | Qué significa soñar con la opa de Hidrovoltia, según la psicología: es señal de... | SOLO LOS DE HIDROVOLTIA | **2** |
| 27 | confirmado·prima·corte | 3.600 | Confirmado: la prima de riesgo se puede meter en el microondas si... | SECCIÓN DE ECONOMÍA | **3** |
| 28 | trafico·ipc·curioso | 1.150 | La pegatina del IPC que Tráfico te exigirá en el parabrisas | SECCIÓN DE ECONOMÍA | **3** |
| 29 | cocineros·plazofijo·truco | 9.180 | El truco de los cocineros para que el plazo fijo quede jugoso | SECCIÓN DE ECONOMÍA | **2** |
| 30 | cocineros·opa·probe | 110 | Los cocineros coinciden: la opa de Hidrovoltia nunca se lava antes de cocinarla | SOLO LOS DE HIDROVOLTIA | **2** |
| 31 | expertos·robledal·probe | 8.000 | Purgué Banco Robledal como dicen los expertos y esto es lo que pasó | SECCIÓN DE ECONOMÍA | **3** |
| 32 | expertos·hipoteca·truco | 30.600 | El truco de los expertos para secar la hipoteca sin secadora | TRUCO DE TODA LA VIDA | **3** |
| 33 | pareja·mejillones·truco | 110.200 | Cómo olvidar a los mejillones de lata en 21 días | TRUCO DE TODA LA VIDA | **2** |
| 34 | pueblo·persianas·probe | 120.000 | Dejé la ciudad por un pueblo sin las persianas y esto es lo que pasó | LE PASÓ A ALGUIEN | **2** |
| 35 | confirmado·prima·prisa | 2.300 | Confirmado: la prima de riesgo se tiende antes de las ocho o pierde valor | SECCIÓN DE ECONOMÍA | **3** |
| 36 | hidro·nomina·probe | 17 | Tengo la nómina y Hidrovoltia lanza una opa: qué hago | SOLO LOS DE HIDROVOLTIA | **3** |
| 37 | expertos·hipoteca·prisa | 28.800 | Los expertos piden purgar la hipoteca antes de encender la calefacción | ANTES DE LAS OCHO (SON LAS 20:59) | **3** |
| 38 | pueblo·persianas·punto | 3.000 | El pueblo de España que vive sin las persianas desde la Edad Media. | DICHO. NADIE ENTRA | **2** |
| 39 | analistas·euribor·obvio | 16.800 | Los analistas recomiendan guardar el Euríbor en un lugar fresco y seco | SECCIÓN DE ECONOMÍA | **3** |
| 40 | confirmado·prima·senales | 3.170 | Confirmado: la prima de riesgo encoge si la lavas con agua caliente | SECCIÓN DE ECONOMÍA | **3** |
| 41 | confirmado·persianas·senales | 105.600 | Confirmado: las persianas encogen si las lavas con agua caliente | SEÑALES INEQUÍVOCAS | **2** |
| 42 | pueblo·opa·obvio | 140 | El pueblo de España donde la opa de Hidrovoltia se sigue haciendo a mano | SOLO LOS DE HIDROVOLTIA | **2** |
| 43 | nutricionista·persianas·punto | 3.000 | Una nutricionista desaconseja comer las persianas. | DICHO. NADIE ENTRA | **2** |
| 44 | meteorologos·robledal·truco | 6.460 | Adiós a Banco Robledal: los meteorólogos confirman el cambio a partir del jueves | SECCIÓN DE ECONOMÍA | **3** |
| 45 | psicologia·ipc·curioso | 1.220 | Las personas que hablan con el IPC tienen esto en común, según la psicología | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 46 | pueblo·ipc·obvio | 1.800 | El pueblo de España donde el IPC se sigue haciendo a mano | SECCIÓN DE ECONOMÍA | **2** |
| 47 | confirmado·euribor·obvio | 576.000 | Confirmado: el Euríbor sube, baja o se queda igual | RÉCORD DE LA CASA | **3** |
| 48 | pareja·ipc·obvio | 2.160 | Si el IPC hace esto, no te quiere | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 49 | cocineros·hacienda·corte | 45.000 | Los cocineros coinciden: Hacienda está mejor si la preparas con... | LOS PUNTOS TRABAJAN | **3** |
| 50 | confirmado·deuda·punto | 42 | Confirmado: la deuda pública caduca el 14 de marzo. | DICHO. NADIE ENTRA | **2** |
| 51 | hogar·pib·obvio | 2.250 | Ni lejía ni vinagre: así se limpia el PIB | SECCIÓN DE ECONOMÍA | **3** |
| 52 | expertos·persianas·truco | 176.800 | El truco de los expertos para secar las persianas sin secadora | TRUCO DE TODA LA VIDA | **2** |
| 53 | hidro·deuda·senales | 3 | Si tienes la deuda pública, esto es lo que te ofrece Hidrovoltia en su opa | SOLO LOS DE HIDROVOLTIA | **2** |
| 54 | cocineros·ibex·senales | 240 | Las 5 señales de que el Ibex 35 se ha puesto malo | SECCIÓN DE ECONOMÍA | **3** |
| 55 | expertos·hacienda·truco | 34.000 | El truco de los expertos para secar Hacienda sin secadora | TRUCO DE TODA LA VIDA | **3** |
| 56 | expertos·persianas·curioso | 187.200 | Por qué los expertos recomiendan dormir con las persianas abiertas | NADIE LO SABÍA | **1** |
| 57 | pareja·pib·punto | 45 | Los españoles piensan en el PIB una media de 14 veces al día. | DICHO. NADIE ENTRA | **3** |
| 58 | meteorologos·ibex·obvio | 340 | Los meteorólogos avisan: el Ibex 35 entra por Galicia este fin de semana | SECCIÓN DE ECONOMÍA | **3** |
| 59 | nutricionista·hacienda·senales | 33.000 | Las 5 señales de que tu cuerpo necesita Hacienda | SEÑALES INEQUÍVOCAS | **3** |
| 60 | trafico·prima·obvio | 5.760 | Tráfico aclara si la prima de riesgo puede viajar en la baca del coche | SECCIÓN DE ECONOMÍA | **3** |
| 61 | pareja·opa·curioso | 97 | Por qué la opa de Hidrovoltia te deja en visto, según la ciencia | SOLO LOS DE HIDROVOLTIA | **2** |
| 62 | meteorologos·opa·prisa | 91 | Alerta naranja por la opa de Hidrovoltia en media España | SOLO LOS DE HIDROVOLTIA | **2** |
| 63 | hidro·persianas·obvio | 120 | Hidrovoltia lanza una opa sobre las persianas: esto es lo que debes saber | SOLO LOS DE HIDROVOLTIA | **2** |
| 64 | trafico·deuda·probe | 2.240 | Me multaron por llevar la deuda pública sin cinturón: así lo recurrí | SECCIÓN DE ECONOMÍA | **3** |
| 65 | cocineros·pib·prisa | 1.440 | Los cocineros coinciden: descongela el PIB la noche antes | SECCIÓN DE ECONOMÍA | **3** |
| 66 | meteorologos·mejillones·truco | 116.300 | Adiós a los mejillones de lata: los meteorólogos confirman el cambio a partir del jueves | TRUCO DE TODA LA VIDA | **2** |
| 67 | psicologia·ipc·probe | 1.360 | Le conté a mi psicóloga lo del IPC y se quedó callada | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 68 | meteorologos·ibex·senales | 250 | El Ibex 35 llega con fuerza: estas son las zonas afectadas | SECCIÓN DE ECONOMÍA | **3** |
| 69 | analistas·prima·truco | 1.430 | Los analistas recomiendan comprar la prima de riesgo y dejarla en remojo | EN REMOJO DESDE ANOCHE | **3** |
| 70 | hogar·euribor·corte | 30.000 | Ni lejía ni vinagre: el truco para limpiar el Euríbor es... | LOS PUNTOS TRABAJAN | **3** |
| 71 | hogar·nomina·probe | 25.500 | Metí la nómina en el congelador y esto es lo que pasó | LE PASÓ A ALGUIEN | **3** |
| 72 | cocineros·prima·truco | 3.670 | El truco de los cocineros para que la prima de riesgo quede jugosa | SECCIÓN DE ECONOMÍA | **3** |
| 73 | trafico·euribor·punto | 640 | Tráfico confirma: el Euríbor puede ir en el asiento de delante. | DICHO. NADIE ENTRA | **3** |
| 74 | trafico·deuda·probe | 2.240 | Me multaron por llevar la deuda pública sin cinturón: así lo recurrí | SECCIÓN DE ECONOMÍA | **3** |
| 75 | trafico·plazofijo·punto | 240 | Tráfico confirma: el plazo fijo puede ir en el asiento de delante. | DICHO. NADIE ENTRA | **3** |
| 76 | meteorologos·mejillones·prisa | 109.400 | Alerta naranja por los mejillones de lata en media España | ANTES DE LAS OCHO (SON LAS 20:59) | **2** |
| 77 | confirmado·deuda·prisa | 1.340 | Confirmado: la deuda pública se tiende antes de las ocho o pierde valor | SECCIÓN DE ECONOMÍA | **3** |
| 78 | hidro·mejillones·prisa | 58 | Opa de Hidrovoltia sobre los mejillones de lata: tienes hasta el viernes para vender | SOLO LOS DE HIDROVOLTIA | **2** |
| 79 | pareja·ipc·curioso | 1.300 | Por qué el IPC te deja en visto, según la ciencia | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 80 | nutricionista·nomina·senales | 28.100 | Las 5 señales de que tu cuerpo necesita la nómina | SEÑALES INEQUÍVOCAS | **3** |
| 81 | pareja·hipoteca·curioso | 29.200 | Por qué la hipoteca te deja en visto, según la ciencia | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 82 | analistas·opa·probe | 42 | Llevo un año comprando la opa de Hidrovoltia a granel y esto es lo que he ahorrado | SOLO LOS DE HIDROVOLTIA | **2** |
| 83 | hidro·hacienda·probe | 20 | Tengo Hacienda y Hidrovoltia lanza una opa: qué hago | SOLO LOS DE HIDROVOLTIA | **3** |
| 84 | cocineros·ipc·obvio | 2.160 | Los cocineros coinciden: el IPC se hace mejor a fuego lento | SECCIÓN DE ECONOMÍA | **3** |
| 85 | nutricionista·deuda·truco | 1.790 | Una nutricionista revela cómo comer la deuda pública sin engordar | SECCIÓN DE ECONOMÍA | **3** |
| 86 | hogar·hacienda·punto | 750 | Ni lejía ni vinagre: Hacienda se blanquea con bicarbonato. | DICHO. NADIE ENTRA | **3** |
| 87 | cocineros·pib·corte | 2.250 | Los cocineros coinciden: el PIB está mejor si lo preparas con... | SECCIÓN DE ECONOMÍA | **3** |
| 88 | hogar·hacienda·prisa | 24.000 | Cada cuánto hay que lavar Hacienda, según los expertos | ANTES DE LAS OCHO (SON LAS 20:59) | **3** |
| 89 | expertos·nomina·punto | 850 | Los expertos recomiendan ventilar la nómina diez minutos al día. | DICHO. NADIE ENTRA | **3** |
| 90 | analistas·plazofijo·curioso | 3.780 | Por qué los analistas guardan el plazo fijo en la nevera | SECCIÓN DE ECONOMÍA | **3** |
| 91 | analistas·prima·corte | 2.100 | Los analistas recomiendan sacar la prima de riesgo del horno antes de que... | SECCIÓN DE ECONOMÍA | **3** |
| 92 | hidro·plazofijo·obvio | 9 | Hidrovoltia lanza una opa sobre el plazo fijo: esto es lo que debes saber | SOLO LOS DE HIDROVOLTIA | **2** |
| 93 | hogar·mejillones·probe | 108.000 | Metí los mejillones de lata en el congelador y esto es lo que pasó | LE PASÓ A ALGUIEN | **2** |
| 94 | pueblo·hipoteca·truco | 23.000 | El pueblo de España donde la gente vive cien años gracias a la hipoteca | TRUCO DE TODA LA VIDA | **3** |
| 95 | trafico·prima·curioso | 3.460 | La pegatina de la prima de riesgo que Tráfico te exigirá en el parabrisas | SECCIÓN DE ECONOMÍA | **3** |
| 96 | pareja·ipc·corte | 1.800 | El IPC te ha dejado: los 5 pasos para... | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 97 | confirmado·nomina·senales | 22.400 | Confirmado: la nómina encoge si la lavas con agua caliente | SEÑALES INEQUÍVOCAS | **3** |
| 98 | confirmado·persianas·corte | 120.000 | Confirmado: las persianas se pueden meter en el microondas si... | LOS PUNTOS TRABAJAN | **2** |
| 99 | hogar·nomina·curioso | 23.000 | El error que todos cometemos al tender la nómina | NADIE LO SABÍA | **3** |
| 100 | expertos·ipc·prisa | 1.280 | Los expertos piden purgar el IPC antes de encender la calefacción | SECCIÓN DE ECONOMÍA | **3** |

### Las 20 mejores con las piezas finales (sin las nueve literales del dueño)

| # | combinación | usuarios | titular | etiqueta |
|---|---|---|---|---|
| 1 | confirmado·euribor·truco | 16.300 | Confirmado: el Euríbor se lava a 30 grados | SECCIÓN DE ECONOMÍA |
| 2 | pareja·prima·senales | 4.750 | Cómo saber si la prima de riesgo te quiere: 5 señales | ECONOMÍA, SECCIÓN CORAZÓN |
| 3 | pareja·nomina·obvio | 45.900 | Si la nómina hace esto, no te quiere | ECONOMÍA, SECCIÓN CORAZÓN |
| 4 | psicologia·ipc·truco | 1.160 | La técnica japonesa para dejar de pensar en el IPC | ECONOMÍA, SECCIÓN CORAZÓN |
| 5 | nutricionista·euribor·punto | 600 | Una nutricionista desaconseja comer el Euríbor. | DICHO. NADIE ENTRA |
| 6 | analistas·robledal·obvio | 4.200 | Los analistas recomiendan guardar Banco Robledal en un lugar fresco y seco | SECCIÓN DE ECONOMÍA |
| 7 | meteorologos·euribor·prisa | 24.300 | Alerta naranja por el Euríbor en media España | ANTES DE LAS OCHO (SON LAS 20:59) |
| 8 | analistas·euribor·curioso | 10.100 | Por qué los analistas guardan el Euríbor en la nevera | SECCIÓN DE ECONOMÍA |
| 9 | meteorologos·euribor·curioso | 27.400 | Llega el veranillo del Euríbor: hasta cuándo durará | NADIE LO SABÍA |
| 10 | expertos·hipoteca·prisa | 28.800 | Los expertos piden purgar la hipoteca antes de encender la calefacción | ANTES DE LAS OCHO (SON LAS 20:59) |
| 11 | trafico·euribor·prisa | 20.500 | Tráfico avisa: a partir de enero, el Euríbor tendrá que pasar la ITV | ANTES DE LAS OCHO (SON LAS 20:59) |
| 12 | hidro·hacienda·probe | 20 | Tengo Hacienda y Hidrovoltia lanza una opa: qué hago | SOLO LOS DE HIDROVOLTIA |
| 13 | pueblo·euribor·truco | 20.400 | El pueblo de España donde la gente vive cien años gracias al Euríbor | TRUCO DE TODA LA VIDA |
| 14 | hogar·nomina·punto | 640 | Ni lejía ni vinagre: la nómina se blanquea con bicarbonato. | DICHO. NADIE ENTRA |
| 15 | nutricionista·hipoteca·obvio | 40.500 | Qué le pasa a tu cuerpo si comes la hipoteca todos los días | VERDAD COMO UN TEMPLO |
| 16 | pareja·hacienda·truco | 30.600 | Cómo olvidar a Hacienda en 21 días | ECONOMÍA, SECCIÓN CORAZÓN |
| 17 | cocineros·ipc·probe | 1.440 | Los cocineros coinciden: el IPC nunca se lava antes de cocinarlo | SECCIÓN DE ECONOMÍA |
| 18 | meteorologos·ipc·punto | 38 | El IPC dejará hasta 40 litros por metro cuadrado. | DICHO. NADIE ENTRA |
| 19 | confirmado·hipoteca·senales | 23.800 | Confirmado: la hipoteca encoge si la lavas con agua caliente | SEÑALES INEQUÍVOCAS |
| 20 | trafico·hacienda·obvio | 48.000 | Tráfico aclara si Hacienda puede viajar en la baca del coche | VERDAD COMO UN TEMPLO |

*(Lo que sigue es la segunda vuelta antes del retoque. Las secciones 4 y 5 se refieren a la tirada 6, cuando aún existía
`atencion`.)*

## 0 · El criterio (lo fijó el dueño a mitad de la vuelta)
Las favoritas del dueño son **un titular de Discover real y reconocible, calcado, con una sola sustitución**: el término
económico entra en el sitio del objeto habitual y se dice con total seriedad, sin chiste añadido. Rechazó las favoritas
de V2 («Estas supuestas mejores son malísimas») porque eran escenas con personajes, chistes apilados y formatos que no
existen en Discover. Toda nota de esta vuelta se pone con una pregunta: **«¿podría ser real cambiando una palabra?»**.
Si la respuesta es no, es un 1, aunque tenga ingenio.

## 1 · Cata a ciegas (180: 60 de V1, 60 de V2 y 60 del juego anterior, J)
Semillas nuevas: V1 51713, V2 63029, J 70411. Barajado con la semilla 5511873, sin origen. Puntué dos veces la misma
lista ciega. La primera vez, con la vara de antes («¿me río?»). La segunda, después de la corrección del dueño, con su
criterio. **Vale la segunda.**

| Origen | Vara antigua: 3 / 1 | **Criterio del dueño: 3 / 1** | Media (criterio del dueño) |
|---|---|---|---|
| V1 (consultorio: psicóloga, «Querida Amparo») | 48 % / 7 % | **8 % / 68 %** | 1,40 |
| V2 (corazón y familia: carta, horóscopo, grupo de la familia) | 52 % / 3 % | **18 % / 58 %** | 1,60 |
| J (juego anterior) | 13 % / 12 % | **7 % / 75 %** | 1,32 |

Con la vara antigua, V1 y V2 parecían una mejora clara. Con el criterio del dueño, los tres juegos suspenden, porque
estaban escritos para hacer reír al guionista y no para parecer Discover. **Lo que da 3 con el criterio del dueño** (20
titulares de 180): los moldes de psicología y pareja con un término económico («Las 7 señales de que tu relación con
el Ibex 35 es tóxica», «Las 7 señales de que tu relación con Hacienda es tóxica», «Según la psicología, si el Euríbor / los tipos te escribe(n) pasadas las ocho, no es amor», «Le conté a mi psicóloga lo de la cuesta de enero y se quedó callada»), los gestos de casa calcados (remojo, «cerrar las puertas y bajar el Ibex», «descongela», pesetas, «regala si te empadronas») y los testimonios reales con una sustitución («Comí el PIB / la prima / el Euríbor todos los días durante un mes y esto pasó», «Me multaron por llevar Banco Robledal sin cinturón: así lo recurrí», «Los cocineros nunca piden el Euríbor en un restaurante: este es el motivo»). **Lo que da 1**:
cualquier escena con personas (Querida Amparo, la suegra, el portero, el camarero, el padre que se va a la cocina,
«mi psicóloga me dio un abrazo»), los remates añadidos («(fuente: …)», «Tu madre…», «El Ibex se desploma», «Ellos no tienen»,
«Buenas noches»), las frases que no existen como molde («Hidrovoltia quiere X antes de las ocho y no dice para qué»,
«nunca cenes X (fuente: su báscula)») y los objetos de casa en su molde natural, que se quedan en consejo de verdad.

**Por pieza.** Sobreviven, en sus moldes probados, *Según la psicología* (psicóloga, señales y «no es amor»), *Los
analistas* (remojo), *El pueblo* (pesetas, «regala si te empadronas»), *Los expertos* («cerrar las puertas y bajar»),
*Los cocineros* («nunca piden», «preparas con...»), *Confirmado* («se tiende antes de las ocho») y *la nutricionista*
(«Comí X durante un mes», «desaconseja comer»). Se caen el consultorio, «Mi psicóloga dice», el horóscopo, la familia,
los meteorólogos como autoridad, el fontanero y todas las colas y reacciones. Entre los asuntos funcionan los términos
económicos (Euríbor, prima, Ibex, IPC, PIB, Robledal, hipoteca, Hacienda). Los objetos de casa no.

## 2 · Qué entra de quién
- **Arquitectura: la del juego anterior** (cada autoridad escribe cada gancho a su manera). Ahora cada plantilla es
  un **molde real con un hueco**. Las autoridades son **secciones de Discover**, no personajes.
- **Del dueño** entran las nueve literales, todas como combinación y como secreto.
- **De V1**: «Mi psicóloga…» dentro de la psicología («Le conté a mi psicóloga…»), la reacción pequeña dentro del molde
  («se quedó callada», «no es amor»), los asuntos *hipoteca* y *nómina* y las plantillas literales del dueño.
- **De V2**: *Hacienda* y *el plazo fijo* como asuntos, la autoridad «El pueblo de España», el «corte» de Hidrovoltia como
  aviso real («Llamada de Hidrovoltia: cuidado si te ofrecen…») y la línea de la psicóloga («Callada. Cobra sesenta euros
  la hora…»).
- **Del juego anterior y de M3**: «Los cocineros nunca piden…», «descongela…», «recoge… antes de que llueva», «dejar en
  remojo», «Comí X todos los días…», «Me multaron por llevar X sin cinturón», «La moneda de 2 euros con X…», «Encuentra X en
  un cajón…», «Tráfico avisa: multa de 200 euros si llevas X en el...».
- **Nuevo, desde el inventario de moldes (§3)**: Amor y pareja («Cómo saber si X te quiere: 5 señales», «Si X hace esto, no te
  quiere», «La regla de los tres días…», «Cómo olvidar a X en 21 días»), hogar («Ni lejía ni vinagre», «El error que todos
  cometemos al tender X», «la bola de papel de aluminio», «se blanquea con bicarbonato»), Confirmado de lavandería («se lava a 30
  grados», «encoge si lo lavas con agua caliente», «no se puede congelar», «va al contenedor amarillo»), los expertos de casa
  («purgar X antes de encender la calefacción», «X tiene humedad», «dormir con X abierto», «secar sin secadora»), Hidrovoltia
  como eléctrica («corte de X el martes de 9 a 14 horas», «regala X a sus clientes») y las monedas («el Banco de España lo cambia
  hasta diciembre»).
- **Fuera**: horóscopo, grupo de la familia, «Querida Amparo», carta de lectora, crianza, «Mi psicóloga dice» como
  autoridad, fontanero, meteorólogos como autoridad, todas las fuentes entre paréntesis, «tu madre», «tu banco», los
  asuntos lunes, moneda, borrasca, cuesta de enero, cambio de hora, tipos de interés (dieron 0 treses de 9) y C4.

**Cifras del juego definitivo:**
- 12 autoridades, 14 asuntos y 8 ganchos, que dan **1.344 titulares**. `--todas` da 0 fallos.
- Mediana de 63 caracteres, el 95 % con ≤ 80 y ninguno de más de 3 líneas a 190 px.
- Ninguna muletilla pasa del 12,5 %. La más alta es el corte, que es un gancho. «tu madre», «tu banco» y «(fuente:» están al 0 %.
- Lo sentimental es el 16,7 % de las combinaciones, por debajo del 40 %. **Sale al menos una vez en el 60 % de las partidas
  de cinco, no en «casi todas».** Para subirlo habría que meter una tercera autoridad sentimental, y la cata dice que las
  candidatas (horóscopo, familia, consultorio) dan 1.
- Escala:
  - Bruno = 3, lo máximo con «opa» = 180 y la demo del paso 34 = 9.500.
  - Los mejillones = 243.000 (ganador por defecto) y las persianas = 312.000.
  - Récord = 576.000 («Confirmado: el Euríbor sube, baja o se queda igual»).
- Yoli: 14 líneas habladas (7 de categoría y 7 de secreto, entre ellas la de la psicóloga) y 11 secretos.

**Joyas que no caben como combinación → hoja o ráfaga** (24 titulares fijos, §5 de la ENMIENDA):
- la moneda que vale 2 euros, «(20)», el hombre de 104 años y el pan en la nevera;
- «Qué es una opa y por qué no te afecta» y la freidora que es una freidora;
- «Confirmado: el lunes vuelve a ser lunes»;
- de Tráfico, «cortan la A-6 para que pase el Euríbor» y «retira el carné al IPC por ir a 140»;
- de los meteorólogos, rehecha con una sola sustitución: «Los meteorólogos avisan: el Euríbor entra por Galicia este fin de
  semana».
- La de «sale por Hacienda» se cae: es un chiste añadido.
- «Me multaron por llevar la prima de riesgo sin cinturón» sale como combinación y además va en la hoja II.

## 3 · Inventario de moldes reales del género (de dónde sale cada plantilla)

| # | Molde real (tal como sale en Discover) | Sección | Dónde está en el juego |
|---|---|---|---|
| 1 | Las 7 señales de que tu relación es tóxica | psicología y pareja | psicologia·senales |
| 2 | Según la psicología, si te escribe pasadas las 12, no es amor | psicología | psicologia·prisa |
| 3 | Le conté a mi psicóloga… y se quedó callada (testimonio) | bienestar | psicologia·probe |
| 4 | Qué significa soñar con…, según la psicología | psicología | psicologia·corte |
| 5 | Si piensas en… antes de dormir, esto es lo que significa | psicología | psicologia·obvio |
| 6 | Las personas que hablan solas tienen esto en común, según la psicología | psicología | psicologia·curioso |
| 7 | La técnica japonesa para dejar de pensar en… | bienestar | psicologia·truco |
| 8 | Cómo saber si te quiere: 5 señales | pareja | pareja·senales |
| 9 | Si tu pareja hace esto, no te quiere | pareja | pareja·obvio |
| 10 | La regla de los tres días: cuánto esperar para escribirle | pareja | pareja·prisa |
| 11 | Por qué tu ex te deja en visto, según la ciencia | pareja | pareja·curioso |
| 12 | Cómo olvidar a tu ex en 21 días | pareja | pareja·truco |
| 13 | Dejé a mi pareja hace un año y esto es lo que aprendí | testimonio | pareja·probe |
| 14 | Tu pareja te ha dejado: los 5 pasos para superarlo | pareja | pareja·corte |
| 15 | Los españoles piensan en… X veces al día | encuestas | pareja·punto |
| 16 | Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las persianas | servicio y tiempo | expertos·obvio |
| 17 | Los expertos piden purgar los radiadores antes de encender la calefacción | hogar | expertos·prisa |
| 18 | Las 5 señales de que tu casa tiene humedad | hogar | expertos·senales |
| 19 | Por qué los expertos recomiendan dormir con la ventana abierta | salud | expertos·curioso |
| 20 | El truco para secar la ropa sin secadora | hogar | expertos·truco |
| 21 | Nunca metas esto en el lavavajillas porque… | hogar | expertos·corte |
| 22 | Los expertos recomiendan ventilar la casa diez minutos al día | hogar | expertos·punto |
| 23 | Los cocineros coinciden: están mejor si los preparas con… | cocina | cocineros·corte (mejillones del dueño) |
| 24 | Los cocineros nunca piden esto en un restaurante: este es el motivo | cocina | cocineros·curioso |
| 25 | El truco de los cocineros para que el pollo quede jugoso | cocina | cocineros·truco |
| 26 | Descongela la carne la noche antes | cocina | cocineros·prisa |
| 27 | Las 5 señales de que la comida se ha puesto mala | cocina | cocineros·senales |
| 28 | El pollo nunca se lava antes de cocinarlo | cocina | cocineros·probe |
| 29 | Se hace mejor a fuego lento / se sala al final | cocina | cocineros·obvio / punto |
| 30 | Confirmado: … (servicio) | servicio | confirmado·* |
| 31 | La ropa se tiende antes de… o pierde… | hogar (lavandería) | confirmado·prisa (Ibex del dueño) |
| 32 | Se lava a 30 grados / encoge si lo lavas con agua caliente | hogar (lavandería) | confirmado·truco / senales |
| 33 | ¿Se puede congelar? / ¿se puede meter en el microondas? | cocina | confirmado·curioso / corte |
| 34 | Va al contenedor amarillo | reciclaje | confirmado·probe |
| 35 | El pueblo de España donde todavía se paga en pesetas | pueblos | pueblo·curioso (Euríbor del dueño) |
| 36 | El pueblo que regala casas si te empadronas | pueblos | pueblo·prisa |
| 37 | El pueblo donde nadie cierra la puerta con llave | pueblos | pueblo·corte |
| 38 | El pueblo donde la gente vive cien años gracias a… | longevidad | pueblo·truco |
| 39 | Los pueblos de España donde todavía no ha llegado internet | pueblos | pueblo·senales |
| 40 | Dejé la ciudad por un pueblo y esto es lo que pasó | testimonio | pueblo·probe |
| 41 | Deja los garbanzos en remojo la noche antes | cocina | analistas·truco (prima del dueño) |
| 42 | Recoge la ropa antes de que llueva | tiempo y hogar | analistas·prisa |
| 43 | Guárdalo en un lugar fresco y seco | etiqueta y cocina | analistas·obvio |
| 44 | Las 3 señales de que la fruta está madura | alimentación | analistas·senales |
| 45 | Por qué deberías guardar… en la nevera | alimentación | analistas·curioso |
| 46 | Llevo un año comprando a granel y esto es lo que he ahorrado | ahorro | analistas·probe |
| 47 | Comí… todos los días durante un mes y esto pasó | nutrición | nutricionista·probe |
| 48 | Qué le pasa a tu cuerpo si comes… todos los días | nutrición | nutricionista·obvio |
| 49 | Una nutricionista avisa: nunca cenes esto | nutrición | nutricionista·curioso |
| 50 | El mejor momento del día para tomar…, según una nutricionista | nutrición | nutricionista·prisa |
| 51 | Las 5 señales de que tu cuerpo necesita… | salud | nutricionista·senales |
| 52 | Tiene más azúcar que… | nutrición | nutricionista·corte |
| 53 | Ni lejía ni vinagre: el truco para limpiar… | hogar | hogar·corte / obvio |
| 54 | El error que todos cometemos al tender la ropa | hogar | hogar·curioso |
| 55 | El truco de la bola de papel de aluminio en la lavadora | hogar | hogar·truco |
| 56 | Cada cuánto hay que lavar las toallas, según los expertos | hogar | hogar·prisa |
| 57 | Metí… en el congelador y esto es lo que pasó | trucos | hogar·probe |
| 58 | La moneda de 2 euros con… que vale una fortuna | monedas | atencion·curioso |
| 59 | Atención si tienes pesetas en casa: el Banco de España las cambia hasta… | monedas | atencion·prisa |
| 60 | Encuentra… en un cajón y descubre que vale una fortuna | monedas | atencion·probe |
| 61 | Tráfico avisa: multa de 200 euros si llevas… en el… | DGT | trafico·corte |
| 62 | Tráfico avisa: si ves un animal en la carretera, reduce la velocidad | DGT | trafico·senales |
| 63 | Tráfico avisa: a partir de enero, los coches tendrán que pasar la ITV | DGT | trafico·prisa |
| 64 | La pegatina que Tráfico te exigirá en el parabrisas | DGT | trafico·curioso |
| 65 | Me multaron por… : así lo recurrí | DGT | trafico·probe |
| 66 | El truco para que los cristales no se empañen | coche | trafico·truco |
| 67 | Corte de luz el martes de 9 a 14 horas | eléctricas | hidro·prisa |
| 68 | Llamada de tu compañía de luz: cuidado si te ofrecen… | estafas | hidro·corte |
| 69 | Cómo saber si te han cambiado de compañía sin avisar | eléctricas | hidro·senales |
| 70 | X regala… a sus clientes: así puedes conseguirlo | ofertas | hidro·curioso |

## 4 · Prueba de fuego (100 al azar en cada vuelta, con semilla nueva y las piezas culpables reescritas)

| Vuelta | Semilla | 3 | 1 | Piezas culpables y qué se hizo |
|---|---|---|---|---|
| 1 | 31877 | 32 % | 33 % | Los moldes de economía de verdad con un asunto de economía son noticias reales (Hidrovoltia 13 de 13 a 1, «Lo que los expertos no te cuentan sobre el IPC», «Los analistas: X va a rebotar», encuesta, «plazo hasta el 31 de diciembre»). Todos se rehacen como moldes de casa, salud o amor |
| 2 | 44203 | 40 % | 14 % | Fallo «con más el Euríbor» (corregido; la tirada no cuenta). Datos reescritos y especiales para mejillones y persianas |
| 3 | 58821 | 46 % | 8 % | Sale el lunes (2 casi siempre) y entra Hacienda. Rehechas la prisa y el obvio de Hidrovoltia, el corte de los analistas y el dato del pueblo |
| 4 | 73019 | 54 % | 4 % | Los tipos de interés dieron 0 de 9: entra el plazo fijo. Rehechas cinco plantillas de 2 (cocineros, nutricionista, pareja, Confirmado, pueblo) |
| 5 | 86117 | 55 % | 5 % | Los cinco unos eran persianas o mejillones en su molde natural: entran nueve especiales para esas parejas |
| **6** | **95561** | **61 %** | **1 %** | **Final, con las piezas en su versión final** |

Las vueltas 1 a 5 las conté a mano (pueden variar en uno). La 6 la contó el script. Objetivo: ≥ 60 % de treses y ≤ 3 % de unos.
**Se cumple por un punto y en la última vuelta permitida.**
- Por autoridad (treses): analistas 9 de 9, hogar 5 de 5, cocineros 10 de 14, nutricionista 8 de 11, psicología 5 de 6,
  Hidrovoltia 5 de 9, Tráfico 4 de 6, Confirmado 4 de 8, pueblo 5 de 12, pareja 2 de 6 y Atención 1 de 10 (el punto débil:
  «puede valer...» y «vale dinero» se quedan en 2).
- Por asunto: la prima 8 de 8, Robledal 8 de 8 y Hacienda 8 de 10. Los mejillones 0 de 6, las persianas 0 de 3 y la opa 0
  de 7 se quedan en 2 (son los del dueño y la opa, que tiene que hundirse).

### Tirada final completa (semilla 95561), con etiqueta, lo que dice Yoli (simula una sesión de 100) y mi nota

| # | combinación | usuarios | titular | etiqueta | Yoli | nota |
|---|---|---|---|---|---|---|
| 1 | cocineros·plazofijo·truco | 9.180 | El truco de los cocineros para que el plazo fijo quede jugoso | SECCIÓN DE ECONOMÍA | **2** |
| 2 | pareja·mejillones·curioso | 116.600 | Por qué los mejillones de lata te dejan en visto, según la ciencia | NADIE LO SABÍA | **2** |
| 3 | hogar·nomina·corte | 31.900 | Ni lejía ni vinagre: el truco para limpiar la nómina es... | LOS PUNTOS TRABAJAN | **3** |
| 4 | psicologia·nomina·truco | 24.600 | La técnica japonesa para dejar de pensar en la nómina | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 5 | analistas·ibex·corte | 110 | Los analistas recomiendan sacar el Ibex 35 del horno antes de que... | SECCIÓN DE ECONOMÍA | **3** |
| 6 | confirmado·euribor·truco | 16.300 | Confirmado: el Euríbor se lava a 30 grados | SECCIÓN DE ECONOMÍA | **3** |
| 7 | trafico·euribor·probe | 25.600 | Me multaron por llevar el Euríbor sin cinturón: así lo recurrí | LE PASÓ A ALGUIEN | **3** |
| 8 | cocineros·prima·obvio | 6.480 | Los cocineros coinciden: la prima de riesgo se hace mejor a fuego lento | SECCIÓN DE ECONOMÍA | **3** |
| 9 | pueblo·deuda·corte | 2.630 | El pueblo de España donde nadie cierra la deuda pública con... | SECCIÓN DE ECONOMÍA | **2** |
| 10 | nutricionista·deuda·probe | 2.100 | Comí la deuda pública todos los días durante un mes y esto pasó | SECCIÓN DE ECONOMÍA | **3** |
| 11 | trafico·opa·probe | 96 | Me multaron por llevar la opa de Hidrovoltia sin cinturón: así lo recurrí | SOLO LOS DE HIDROVOLTIA | **2** |
| 12 | pueblo·robledal·prisa | 4.800 | El pueblo de España que regala Banco Robledal si te empadronas antes de diciembre | SECCIÓN DE ECONOMÍA | **3** |
| 13 | nutricionista·prima·probe | 3.600 | Comí la prima de riesgo todos los días durante un mes y esto pasó | SECCIÓN DE ECONOMÍA | **3** |
| 14 | expertos·ibex·corte | 300 | Los expertos avisan: nunca metas el Ibex 35 en el lavavajillas porque... | SECCIÓN DE ECONOMÍA | **3** |
| 15 | trafico·pib·prisa | 1.280 | Tráfico avisa: a partir de enero, el PIB tendrá que pasar la ITV | SECCIÓN DE ECONOMÍA | **3** |
| 16 | psicologia·hipoteca·prisa | 24.500 | Según la psicología, si la hipoteca te escribe pasadas las ocho, no es amor | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 17 | trafico·hacienda·senales | 35.200 | Tráfico avisa: si ves Hacienda en la carretera, reduce la velocidad | SEÑALES INEQUÍVOCAS | **3** |
| 18 | atencion·hacienda·curioso | 34.200 | La moneda de 2 euros con Hacienda que vale una fortuna | NADIE LO SABÍA | **2** |
| 19 | hogar·prima·punto | 90 | Ni lejía ni vinagre: la prima de riesgo se blanquea con bicarbonato. | DICHO. NADIE ENTRA | **3** |
| 20 | atencion·hacienda·corte | 47.500 | Atención si tienes Hacienda en el cajón: puede valer... | LOS PUNTOS TRABAJAN | **2** |
| 21 | hidro·deuda·truco | 24 | El truco de Hidrovoltia para pagar menos por la deuda pública | SECCIÓN DE ECONOMÍA | **1** |
| 22 | pareja·hacienda·obvio | 54.000 | Si Hacienda hace esto, no te quiere | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 23 | hidro·euribor·obvio | 480 | Hidrovoltia confirma que el Euríbor seguirá llegando con normalidad | SECCIÓN DE ECONOMÍA | **3** |
| 24 | atencion·nomina·curioso | 29.100 | La moneda de 2 euros con la nómina que vale una fortuna | NADIE LO SABÍA | **2** |
| 25 | cocineros·ipc·probe | 1.440 | Los cocineros coinciden: el IPC nunca se lava antes de cocinarlo | SECCIÓN DE ECONOMÍA | **3** |
| 26 | pareja·mejillones·curioso | 116.600 | Por qué los mejillones de lata te dejan en visto, según la ciencia | NADIE LO SABÍA | **2** |
| 27 | confirmado·hacienda·corte | 30.000 | Confirmado: Hacienda se puede meter en el microondas si... | LOS PUNTOS TRABAJAN | **3** |
| 28 | pueblo·deuda·punto | 53 | El pueblo de España que vive sin la deuda pública desde la Edad Media. | DICHO. NADIE ENTRA | **2** |
| 29 | nutricionista·nomina·probe | 25.500 | Comí la nómina todos los días durante un mes y esto pasó | LE PASÓ A ALGUIEN | **3** |
| 30 | pueblo·hipoteca·senales | 29.700 | Los 5 pueblos de España donde todavía no ha llegado la hipoteca | SEÑALES INEQUÍVOCAS | **3** |
| 31 | confirmado·plazofijo·senales | 7.920 | Confirmado: el plazo fijo encoge si lo lavas con agua caliente | SECCIÓN DE ECONOMÍA | **3** |
| 32 | atencion·hipoteca·curioso | 30.800 | La moneda de 2 euros con la hipoteca que vale una fortuna | NADIE LO SABÍA | **2** |
| 33 | pueblo·nomina·truco | 21.700 | El pueblo de España donde la gente vive cien años gracias a la nómina | TRUCO DE TODA LA VIDA | **3** |
| 34 | pareja·plazofijo·prisa | 8.640 | La regla de los tres días: cuánto esperar para escribir al plazo fijo | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 35 | hidro·plazofijo·probe | 120 | Me di de baja del plazo fijo en Hidrovoltia y esto es lo que pasó | SECCIÓN DE ECONOMÍA | **2** |
| 36 | confirmado·persianas·truco | 81.600 | Confirmado: las persianas se lavan a 30 grados | TRUCO DE TODA LA VIDA | **2** |
| 37 | expertos·mejillones·truco | 122.400 | El truco de los expertos para secar los mejillones de lata sin secadora | TRUCO DE TODA LA VIDA | **2** |
| 38 | expertos·plazofijo·senales | 13.200 | Las 5 señales de que el plazo fijo tiene humedad, según los expertos | SECCIÓN DE ECONOMÍA | **3** |
| 39 | analistas·ipc·punto | 14 | Los analistas fijan el precio objetivo del IPC en 4,10 euros el kilo. | DICHO. NADIE ENTRA | **3** |
| 40 | pueblo·mejillones·obvio | 162.000 | El pueblo de España donde los mejillones de lata se siguen haciendo a mano | VERDAD COMO UN TEMPLO | **2** |
| 41 | psicologia·prima·curioso | 3.670 | Las personas que hablan con la prima de riesgo tienen esto en común, según la psicología | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 42 | cocineros·opa·punto | 3 | Los cocineros coinciden: la opa de Hidrovoltia se sala al final. | SOLO LOS DE HIDROVOLTIA | **2** |
| 43 | psicologia·mejillones·punto | 3.060 | La psicología lo confirma: tu relación con los mejillones de lata es dependencia emocional. | DICHO. NADIE ENTRA | **2** |
| 44 | hogar·nomina·obvio | 38.300 | Ni lejía ni vinagre: así se limpia la nómina | VERDAD COMO UN TEMPLO | **3** |
| 45 | cocineros·ipc·senales | 1.580 | Las 5 señales de que el IPC se ha puesto malo | SECCIÓN DE ECONOMÍA | **3** |
| 46 | hogar·hacienda·punto | 750 | Ni lejía ni vinagre: Hacienda se blanquea con bicarbonato. | DICHO. NADIE ENTRA | **3** |
| 47 | atencion·nomina·punto | 810 | La moneda de 2 euros con la nómina vale 2 euros. | DICHO. NADIE ENTRA | **2** |
| 48 | pueblo·robledal·curioso | 5.400 | El pueblo de España que todavía paga Banco Robledal en pesetas | SECCIÓN DE ECONOMÍA | **3** |
| 49 | atencion·deuda·senales | 2.930 | Cuánto vale la deuda pública de 1998: la tabla de los coleccionistas | SECCIÓN DE ECONOMÍA | **2** |
| 50 | pareja·deuda·probe | 2.520 | Dejé a la deuda pública hace un año y esto es lo que aprendí | ECONOMÍA, SECCIÓN CORAZÓN | **2** |
| 51 | nutricionista·opa·corte | 110 | Una nutricionista avisa: la opa de Hidrovoltia tiene más azúcar que... | SOLO LOS DE HIDROVOLTIA | **2** |
| 52 | pueblo·ibex·senales | 200 | Los 5 pueblos de España donde todavía no ha llegado el Ibex 35 | SECCIÓN DE ECONOMÍA | **3** |
| 53 | analistas·plazofijo·curioso | 3.780 | Por qué los analistas guardan el plazo fijo en la nevera | SECCIÓN DE ECONOMÍA | **3** |
| 54 | hidro·deuda·senales | 31 | Cómo saber si Hidrovoltia te ha cambiado la deuda pública sin avisar | SECCIÓN DE ECONOMÍA | **2** |
| 55 | pueblo·ipc·punto | 30 | El pueblo de España que vive sin el IPC desde la Edad Media. | DICHO. NADIE ENTRA | **2** |
| 56 | pueblo·persianas·punto | 3.000 | El pueblo de España que vive sin las persianas desde la Edad Media. | DICHO. NADIE ENTRA | **2** |
| 57 | analistas·robledal·punto | 70 | Los analistas fijan el precio objetivo de Banco Robledal en 4,10 euros el kilo. | DICHO. NADIE ENTRA | **3** |
| 58 | confirmado·persianas·prisa | 76.800 | Confirmado: las persianas se tienden antes de las ocho o pierden valor | ANTES DE LAS OCHO (SON LAS 20:59) | **2** |
| 59 | analistas·prima·truco | 1.430 | Los analistas recomiendan comprar la prima de riesgo y dejarla en remojo | EN REMOJO DESDE ANOCHE | **3** |
| 60 | atencion·ipc·prisa | 1.220 | Atención si tienes el IPC en casa: el Banco de España lo cambia hasta diciembre | SECCIÓN DE ECONOMÍA | **3** |
| 61 | nutricionista·robledal·prisa | 4.800 | El mejor momento del día para tomar Banco Robledal, según una nutricionista | SECCIÓN DE ECONOMÍA | **3** |
| 62 | nutricionista·opa·prisa | 72 | El mejor momento del día para tomar la opa de Hidrovoltia, según una nutricionista | SOLO LOS DE HIDROVOLTIA | **2** |
| 63 | confirmado·deuda·probe | 1.680 | Confirmado: la deuda pública va al contenedor amarillo | SECCIÓN DE ECONOMÍA | **3** |
| 64 | cocineros·pib·curioso | 1.620 | Los cocineros nunca piden el PIB en un restaurante: este es el motivo | SECCIÓN DE ECONOMÍA | **3** |
| 65 | confirmado·ibex·obvio | 220 | Confirmado: el Ibex 35 sube, baja o se queda igual | SECCIÓN DE ECONOMÍA | **2** |
| 66 | cocineros·hacienda·probe | 36.000 | Los cocineros coinciden: Hacienda nunca se lava antes de cocinarla | LE PASÓ A ALGUIEN | **3** |
| 67 | analistas·ipc·curioso | 500 | Por qué los analistas guardan el IPC en la nevera | SECCIÓN DE ECONOMÍA | **3** |
| 68 | analistas·euribor·probe | 11.200 | Llevo un año comprando el Euríbor a granel y esto es lo que he ahorrado | SECCIÓN DE ECONOMÍA | **3** |
| 69 | trafico·hacienda·prisa | 25.600 | Tráfico avisa: a partir de enero, Hacienda tendrá que pasar la ITV | ANTES DE LAS OCHO (SON LAS 20:59) | **3** |
| 70 | pareja·opa·prisa | 86 | La regla de los tres días: cuánto esperar para escribir a la opa de Hidrovoltia | SOLO LOS DE HIDROVOLTIA | **2** |
| 71 | pueblo·pib·punto | 38 | El pueblo de España que vive sin el PIB desde la Edad Media. | DICHO. NADIE ENTRA | **2** |
| 72 | cocineros·deuda·truco | 2.140 | El truco de los cocineros para que la deuda pública quede jugosa | SECCIÓN DE ECONOMÍA | **2** |
| 73 | cocineros·hipoteca·probe | 32.400 | Los cocineros coinciden: la hipoteca nunca se lava antes de cocinarla | LE PASÓ A ALGUIEN | **3** |
| 74 | trafico·deuda·curioso | 2.020 | La pegatina de la deuda pública que Tráfico te exigirá en el parabrisas | SECCIÓN DE ECONOMÍA | **2** |
| 75 | hogar·robledal·curioso | 5.400 | El error que todos cometemos al tender Banco Robledal | SECCIÓN DE ECONOMÍA | **3** |
| 76 | hidro·prima·curioso | 43 | Hidrovoltia regala la prima de riesgo a sus clientes: así puedes conseguirla | SECCIÓN DE ECONOMÍA | **3** |
| 77 | psicologia·deuda·prisa | 1.900 | Según la psicología, si la deuda pública te escribe pasadas las ocho, no es amor | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 78 | cocineros·hacienda·punto | 900 | Los cocineros coinciden: Hacienda se sala al final. | DICHO. NADIE ENTRA | **3** |
| 79 | expertos·pib·curioso | 1.800 | Por qué los expertos recomiendan dormir con el PIB abierto | SECCIÓN DE ECONOMÍA | **3** |
| 80 | nutricionista·ibex·senales | 200 | Las 5 señales de que tu cuerpo necesita el Ibex 35 | SECCIÓN DE ECONOMÍA | **3** |
| 81 | atencion·opa·probe | 110 | Encuentra la opa de Hidrovoltia en un cajón y descubre que vale una fortuna | SOLO LOS DE HIDROVOLTIA | **2** |
| 82 | cocineros·ipc·senales | 1.580 | Las 5 señales de que el IPC se ha puesto malo | SECCIÓN DE ECONOMÍA | **3** |
| 83 | cocineros·deuda·truco | 2.140 | El truco de los cocineros para que la deuda pública quede jugosa | SECCIÓN DE ECONOMÍA | **2** |
| 84 | cocineros·deuda·curioso | 2.270 | Los cocineros nunca piden la deuda pública en un restaurante: este es el motivo | SECCIÓN DE ECONOMÍA | **3** |
| 85 | analistas·robledal·obvio | 4.200 | Los analistas recomiendan guardar Banco Robledal en un lugar fresco y seco | SECCIÓN DE ECONOMÍA | **3** |
| 86 | atencion·euribor·truco | 25.800 | Cómo saber si el Euríbor vale dinero: el truco de los coleccionistas | TRUCO DE TODA LA VIDA | **2** |
| 87 | pueblo·plazofijo·prisa | 7.200 | El pueblo de España que regala el plazo fijo si te empadronas antes de diciembre | SECCIÓN DE ECONOMÍA | **2** |
| 88 | hidro·pib·senales | 22 | Cómo saber si Hidrovoltia te ha cambiado el PIB sin avisar | SECCIÓN DE ECONOMÍA | **2** |
| 89 | hidro·plazofijo·prisa | 96 | Hidrovoltia avisa: corte del plazo fijo el martes de 9 a 14 horas | SECCIÓN DE ECONOMÍA | **3** |
| 90 | cocineros·robledal·corte | 9.000 | Los cocineros coinciden: Banco Robledal está mejor si lo preparas con... | SECCIÓN DE ECONOMÍA | **3** |
| 91 | psicologia·robledal·obvio | 10.200 | Si piensas en Banco Robledal antes de dormir, esto es lo que significa | ECONOMÍA, SECCIÓN CORAZÓN | **3** |
| 92 | hidro·euribor·curioso | 290 | Hidrovoltia regala el Euríbor a sus clientes: así puedes conseguirlo | SECCIÓN DE ECONOMÍA | **3** |
| 93 | atencion·nomina·corte | 40.400 | Atención si tienes la nómina en el cajón: puede valer... | LOS PUNTOS TRABAJAN | **2** |
| 94 | nutricionista·opa·truco | 77 | Una nutricionista revela cómo comer la opa de Hidrovoltia sin engordar | SOLO LOS DE HIDROVOLTIA | **2** |
| 95 | analistas·ibex·punto | 3 | Los analistas fijan el precio objetivo del Ibex 35 en 4,10 euros el kilo. | DICHO. NADIE ENTRA | **3** |
| 96 | hidro·prima·curioso | 43 | Hidrovoltia regala la prima de riesgo a sus clientes: así puedes conseguirla | SECCIÓN DE ECONOMÍA | **3** |
| 97 | nutricionista·hacienda·senales | 33.000 | Las 5 señales de que tu cuerpo necesita Hacienda | SEÑALES INEQUÍVOCAS | **3** |
| 98 | nutricionista·prima·punto | 90 | Una nutricionista desaconseja comer la prima de riesgo. | DICHO. NADIE ENTRA | **3** |
| 99 | confirmado·mejillones·obvio | 129.600 | Confirmado: los mejillones de lata suben, bajan o se quedan igual | VERDAD COMO UN TEMPLO | **2** |
| 100 | nutricionista·pib·truco | 1.280 | Una nutricionista revela cómo comer el PIB sin engordar | SECCIÓN DE ECONOMÍA | **3** |

El único 1 es «El truco de Hidrovoltia para pagar menos por la deuda pública»: puede ser real tal cual.

## 5 · Las 20 mejores (sin contar las nueve literales del dueño, que están todas dentro y son secreto)

| # | combinación | usuarios | titular | etiqueta |
|---|---|---|---|---|
| 1 | confirmado·euribor·truco | 16.300 | Confirmado: el Euríbor se lava a 30 grados | SECCIÓN DE ECONOMÍA |
| 2 | pareja·prima·senales | 4.750 | Cómo saber si la prima de riesgo te quiere: 5 señales | ECONOMÍA, SECCIÓN CORAZÓN |
| 3 | pareja·nomina·obvio | 45.900 | Si la nómina hace esto, no te quiere | ECONOMÍA, SECCIÓN CORAZÓN |
| 4 | psicologia·ipc·truco | 1.160 | La técnica japonesa para dejar de pensar en el IPC | ECONOMÍA, SECCIÓN CORAZÓN |
| 5 | nutricionista·euribor·punto | 600 | Una nutricionista desaconseja comer el Euríbor. | DICHO. NADIE ENTRA |
| 6 | analistas·robledal·obvio | 4.200 | Los analistas recomiendan guardar Banco Robledal en un lugar fresco y seco | SECCIÓN DE ECONOMÍA |
| 7 | hidro·euribor·prisa | 260 | Hidrovoltia avisa: corte del Euríbor el martes de 9 a 14 horas | SECCIÓN DE ECONOMÍA |
| 8 | analistas·euribor·curioso | 10.100 | Por qué los analistas guardan el Euríbor en la nevera | SECCIÓN DE ECONOMÍA |
| 9 | atencion·euribor·curioso | 27.400 | La moneda de 2 euros con el Euríbor que vale una fortuna | NADIE LO SABÍA |
| 10 | expertos·hipoteca·prisa | 28.800 | Los expertos piden purgar la hipoteca antes de encender la calefacción | ANTES DE LAS OCHO (SON LAS 20:59) |
| 11 | trafico·euribor·prisa | 20.500 | Tráfico avisa: a partir de enero, el Euríbor tendrá que pasar la ITV | ANTES DE LAS OCHO (SON LAS 20:59) |
| 12 | atencion·euribor·probe | 30.400 | Encuentra el Euríbor en un cajón y descubre que vale una fortuna | LE PASÓ A ALGUIEN |
| 13 | pueblo·euribor·truco | 20.400 | El pueblo de España donde la gente vive cien años gracias al Euríbor | TRUCO DE TODA LA VIDA |
| 14 | hogar·nomina·punto | 640 | Ni lejía ni vinagre: la nómina se blanquea con bicarbonato. | DICHO. NADIE ENTRA |
| 15 | nutricionista·hipoteca·obvio | 40.500 | Qué le pasa a tu cuerpo si comes la hipoteca todos los días | VERDAD COMO UN TEMPLO |
| 16 | pareja·hacienda·truco | 30.600 | Cómo olvidar a Hacienda en 21 días | ECONOMÍA, SECCIÓN CORAZÓN |
| 17 | cocineros·ipc·probe | 1.440 | Los cocineros coinciden: el IPC nunca se lava antes de cocinarlo | SECCIÓN DE ECONOMÍA |
| 18 | expertos·ibex·senales | 260 | Las 5 señales de que el Ibex 35 tiene humedad, según los expertos | SECCIÓN DE ECONOMÍA |
| 19 | confirmado·hipoteca·senales | 23.800 | Confirmado: la hipoteca encoge si la lavas con agua caliente | SEÑALES INEQUÍVOCAS |
| 20 | trafico·prima·senales | 4.220 | Tráfico avisa: si ves la prima de riesgo en la carretera, reduce la velocidad | SECCIÓN DE ECONOMÍA |

## Anexo · Los 180 de la cata, destapados (orden ciego · origen · combinación · usuarios · titular · nota con el criterio del dueño)

| # | origen | combinación | usuarios | titular | nota |
|---|---|---|---|---|---|
| 1 | V2 | hidro·prima·prisa | 38 | Hidrovoltia quiere la prima de riesgo antes de las ocho y no dice para qué | 1 |
| 2 | J | nutricionista·hora·consecuencia | 81.000 | Una nutricionista avisa: cenar el cambio de hora sube el colesterol y el Euríbor | 1 |
| 3 | V2 | nutricionista·ibex·obvio | 270 | Una nutricionista avisa: el Ibex 35 engorda si te lo comes | 2 |
| 4 | V1 | confirmado·mejillones·reaccion | 77.800 | Confirmado: los mejillones de lata suben. Tu madre ha bajado a por pan, por si acaso | 1 |
| 5 | J | trafico·hora·obvio | 144.000 | Tráfico lo confirma: el cambio de hora no tiene carné de conducir | 1 |
| 6 | V2 | psicologia·ibex·secreto | 180 | Las 7 señales de que tu relación con el Ibex 35 es tóxica | 3 |
| 7 | V2 | analistas·euribor·fuente | 7.840 | Los analistas recomiendan comprar el Euríbor y dejarlo en remojo (fuente: el tarot) | 2 |
| 8 | V2 | psicologia·pib·consecuencia | 1.530 | Dejé el PIB y mi psicóloga me dio un abrazo | 1 |
| 9 | V1 | consultorio·nomina·reaccion | 25.900 | Querida Amparo: presenté a la nómina a mis padres y mi padre se fue a la cocina | 1 |
| 10 | J | fontanero·ibex·corte | 240 | Un fontanero avisa: nunca tires el Ibex 35 por el freg... | 2 |
| 11 | V1 | hidro·opa·punto | 3 | Hidrovoltia lanza una opa sobre la opa de Hidrovoltia. | 1 |
| 12 | J | nutricionista·ibex·fuente | 130 | Una nutricionista avisa: nunca cenes el Ibex 35 (fuente: su báscula) | 1 |
| 13 | V1 | hidro·robledal·prisa | 64 | Hidrovoltia quiere Banco Robledal antes de las ocho y no dice para qué | 1 |
| 14 | V2 | pueblo·lunes·probe | 84.000 | Me fui a vivir con el lunes a un pueblo de Soria y esto pasó | 2 |
| 15 | V1 | nutricionista·mejillones·obvio | 210.600 | Una nutricionista avisa: los mejillones de lata engordan si te los comes | 1 |
| 16 | V1 | atencion·ibex·punto | 6 | Atención si tienes el Ibex 35 en el cajón: no pasa nada. | 1 |
| 17 | J | analistas·robledal·probe | 2.800 | Invertí todos mis ahorros en Banco Robledal y esto pasó | 1 |
| 18 | V1 | confirmado·persianas·prisa | 76.800 | Confirmado: las persianas se tienden antes de las ocho o pierden valor | 2 |
| 19 | J | pueblo·persianas·probe | 120.000 | Me fui a vivir con las persianas a un pueblo de Soria y esto pasó | 1 |
| 20 | V1 | consultorio·mejillones·corte | 144.000 | Querida Amparo: mi marido me ha dejado por los mejillones de lata y quiere la custo... | 1 |
| 21 | J | hidro·moneda·consecuencia | 1.190 | Hidrovoltia compra la moneda de 2 euros y lo primero que hace es subirla | 1 |
| 22 | V2 | nutricionista·ipc·obvio | 1.800 | Una nutricionista avisa: el IPC engorda si te lo comes | 2 |
| 23 | V1 | expertos·robledal·probe | 8.000 | Bajé Banco Robledal cada tarde durante un mes y el portero me ha pedido que pare | 1 |
| 24 | V1 | psicologia·robledal·fuente | 4.760 | Lo que Banco Robledal piensa de ti, según la psicología (fuente: tu ex) | 2 |
| 25 | J | expertos·cuesta·obvio | 180.000 | Los expertos coinciden: la cuesta de enero se baja como las persianas, tirando de la cinta | 1 |
| 26 | V1 | psicologia·opa·probe | 100 | Bloqueé a la opa de Hidrovoltia en el móvil y ya duermo ocho horas | 2 |
| 27 | V2 | confirmado·opa·secreto | 65 | Confirmado: la opa de Hidrovoltia sube. Lo que no te cuentan es que también baja | 1 |
| 28 | V1 | expertos·hipoteca·reaccion | 30.600 | Los expertos coinciden por fin sobre la hipoteca y se dan un abrazo | 1 |
| 29 | J | psicologia·borrasca·punto | 770 | Los psicólogos coinciden: la borrasca sin nombre no tiene sentimientos. | 2 |
| 30 | V1 | mipsicologa·prima·punto | 110 | Mi psicóloga me lo ha confirmado: la prima de riesgo no es mi pareja. | 1 |
| 31 | V1 | psicologia·pib·fuente | 1.190 | Lo que el PIB piensa de ti, según la psicología (fuente: tu ex) | 2 |
| 32 | J | nutricionista·pib·probe | 1.500 | Comí el PIB todos los días durante un mes y esto pasó | 3 |
| 33 | V2 | cocineros·robledal·corte | 9.000 | Los cocineros coinciden: Banco Robledal está mejor si lo preparas con... | 3 |
| 34 | V2 | nutricionista·euribor·consecuencia | 21.600 | Una nutricionista avisa: cenar el Euríbor sube el colesterol y el Euríbor | 1 |
| 35 | V1 | expertos·prima·probe | 4.800 | Bajé la prima de riesgo cada tarde durante un mes y el portero me ha pedido que pare | 1 |
| 36 | J | atencion·moneda·prisa | 150.500 | Atención si tienes la moneda de 2 euros en el cajón: caduca esta noche | 1 |
| 37 | V2 | familia·persianas·probe | 136.000 | Vacié la casa de mis padres y encontré las persianas: la tasadora no se lo creía | 1 |
| 38 | V1 | mipsicologa·euribor·probe | 91.200 | Le conté a mi psicóloga lo del Euríbor y se quedó callada | 3 |
| 39 | V2 | psicologia·lunes·probe | 95.200 | Le conté a mi psicóloga lo del lunes y se quedó callada | 2 |
| 40 | J | fontanero·hora·secreto | 86.400 | Un fontanero avisa: si el cambio de hora hace este ruido, vende | 1 |
| 41 | V1 | nutricionista·opa·fuente | 63 | Una nutricionista avisa: nunca cenes la opa de Hidrovoltia (fuente: su báscula) | 1 |
| 42 | V2 | psicologia·ibex·fuente | 140 | Lo que el Ibex 35 piensa de ti, según la psicología (fuente: un horóscopo) | 2 |
| 43 | V1 | cocineros·hipoteca·fuente | 21.400 | Los cocineros coinciden: la hipoteca está mejor a la plancha (fuente: el bar de abajo) | 2 |
| 44 | J | pueblo·lunes·punto | 2.100 | El pueblo de Soria que vive sin el lunes tiene 43 vecinos y una fuente. | 1 |
| 45 | V1 | consultorio·hipoteca·probe | 27.200 | Le pedí matrimonio a la hipoteca y me contestó que ya me llamaría | 1 |
| 46 | V1 | expertos·opa·obvio | 180 | Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar la opa de Hidrovoltia | 3 |
| 47 | V2 | nutricionista·prima·obvio | 5.400 | Una nutricionista avisa: la prima de riesgo engorda si te la comes | 2 |
| 48 | V2 | consultorio·prima·punto | 96 | Una lectora pregunta por la prima de riesgo. La experta adjunta tres gráficos. | 1 |
| 49 | J | meteorologos·pib·secreto | 1.170 | Lo que los meteorólogos no te dicen: el PIB se forma en las Azores | 1 |
| 50 | V1 | analistas·lunes·probe | 39.200 | Le pregunté a un analista por el lunes y solo dijo «uf» | 1 |
| 51 | V1 | analistas·prima·obvio | 2.520 | Los analistas recomiendan comprar la prima de riesgo y dejarla en remojo | 3 |
| 52 | J | nutricionista·moneda·obvio | 148.500 | Una nutricionista avisa: la moneda de 2 euros engorda si te la comes | 1 |
| 53 | V2 | cocineros·lunes·consecuencia | 90.700 | Hice el lunes a la plancha, como dicen los cocineros, y mi suegra pidió la receta | 1 |
| 54 | V2 | psicologia·hacienda·secreto | 15.300 | Las 7 señales de que tu relación con Hacienda es tóxica | 3 |
| 55 | V1 | confirmado·ibex·reaccion | 130 | Confirmado: el Ibex 35 sube. Tu madre ha bajado a por pan, por si acaso | 1 |
| 56 | V1 | pueblo·persianas·prisa | 96.000 | El pueblo de España que cambia las persianas por el Euríbor antes del lunes | 1 |
| 57 | J | cocineros·lunes·consecuencia | 90.700 | Los cocineros coinciden: el lunes está mejor a la plancha. Tu madre ya ha llamado dos veces | 1 |
| 58 | J | nutricionista·moneda·fuente | 69.300 | Una nutricionista avisa: nunca cenes la moneda de 2 euros (fuente: su báscula) | 1 |
| 59 | J | pueblo·cuesta·corte | 112.500 | El pueblo de Soria donde nadie cierra la cuesta de enero con llave ya tiene ladr... | 1 |
| 60 | V2 | familia·opa·corte | 130 | Cómo decirle a tu hijo que la opa de Hidrovoltia no va a vol... | 1 |
| 61 | V1 | expertos·robledal·secreto | 7.200 | Los expertos coinciden sobre Banco Robledal, pero no dicen en qué | 1 |
| 62 | V2 | nutricionista·ipc·prisa | 960 | Una nutricionista avisa: tómate el IPC en ayunas, antes de que suba | 2 |
| 63 | J | confirmado·euribor·probe | 19.200 | Vi subir el Euríbor desde mi balcón y esto es lo que sentí | 1 |
| 64 | V2 | confirmado·euribor·probe | 19.200 | Vi subir el Euríbor desde mi balcón y esto es lo que sentí | 1 |
| 65 | V2 | analistas·hacienda·consecuencia | 6.300 | Un analista recomendó Hacienda en la cena de Navidad y nadie le pasó el turrón | 1 |
| 66 | V1 | atencion·opa·reaccion | 100 | Un jubilado vende la opa de Hidrovoltia que tenía en un cajón por 3.000 euros | 2 |
| 67 | J | psicologia·hora·corte | 127.500 | Según la psicología, soñar con el cambio de hora significa que tu ex... | 1 |
| 68 | J | meteorologos·cuesta·obvio | 117.000 | Los meteorólogos avisan: si llueve, la cuesta de enero se moja | 1 |
| 69 | V2 | psicologia·euribor·prisa | 28.300 | Según la psicología, si el Euríbor te escribe pasadas las ocho, no es amor | 3 |
| 70 | J | atencion·hora·corte | 142.500 | Atención si tienes el cambio de hora en el cajón: puede valer una fortu... | 1 |
| 71 | V2 | confirmado·lunes·punto | 1.680 | Confirmado: el lunes sube un 0,2 %. Eso es todo. Buenas noches. | 1 |
| 72 | V2 | analistas·lunes·fuente | 27.400 | Los analistas recomiendan comprar el lunes y dejarlo en remojo (fuente: el tarot) | 1 |
| 73 | J | cocineros·moneda·probe | 118.800 | Le pedí a un chef con estrella que me cocinara la moneda de 2 euros: su reacción | 1 |
| 74 | J | trafico·cuesta·obvio | 144.000 | Tráfico lo confirma: la cuesta de enero no tiene carné de conducir | 1 |
| 75 | V1 | cocineros·mejillones·punto | 4.860 | Los cocineros coinciden: los mejillones de lata no se comen. | 1 |
| 76 | V1 | pueblo·ibex·fuente | 130 | El pueblo de España que esconde el Ibex 35 (fuente: el alcalde, en pijama) | 1 |
| 77 | V1 | analistas·euribor·prisa | 8.960 | Los analistas recomiendan recoger el Euríbor antes de que llueva | 2 |
| 78 | V2 | confirmado·hacienda·fuente | 8.400 | Confirmado: Hacienda sube (lo confirma tu cuñado) | 1 |
| 79 | V1 | nutricionista·mejillones·secreto | 126.400 | Una nutricionista revela qué desayunan los mejillones de lata | 1 |
| 80 | V1 | consultorio·persianas·fuente | 89.600 | Querida Amparo: las persianas se bajan solas. ¿Es normal? (fuente: la vecina) | 1 |
| 81 | J | confirmado·pib·secreto | 1.080 | Confirmado: el PIB sube. Cuánto, te lo contamos dentro | 1 |
| 82 | V1 | hidro·persianas·prisa | 1.280 | Hidrovoltia quiere las persianas antes de las ocho y no dice para qué | 1 |
| 83 | V2 | horoscopo·persianas·obvio | 216.000 | Tauro: esta semana las persianas pensarán en ti. O en otra persona | 1 |
| 84 | J | hidro·persianas·punto | 3 | Hidrovoltia lanza una opa sobre las persianas. | 1 |
| 85 | V1 | confirmado·persianas·corte | 120.000 | Confirmado: las persianas salen con alguien de Hacien... | 1 |
| 86 | J | atencion·lunes·consecuencia | 95.800 | Un jubilado vende el lunes que tenía en un cajón por 3.000 euros | 1 |
| 87 | V2 | consultorio·lunes·secreto | 80.600 | «Encontré el lunes en el móvil de mi marido»: la carta de una lectora | 1 |
| 88 | J | expertos·borrasca·punto | 900 | Los expertos coinciden: esta tarde hay que bajar la borrasca sin nombre. Mañana, subirla. | 1 |
| 89 | J | trafico·robledal·probe | 6.400 | Me multaron por llevar Banco Robledal sin cinturón: así lo recurrí | 3 |
| 90 | V1 | analistas·ipc·reaccion | 500 | Los analistas recomiendan dejar al IPC: no te valora | 1 |
| 91 | V2 | cocineros·opa·fuente | 76 | Los cocineros coinciden: la opa de Hidrovoltia está mejor a la plancha (fuente: el bar de abajo) | 2 |
| 92 | V2 | fontanero·mejillones·secreto | 103.700 | Un fontanero avisa: si los mejillones de lata hacen este ruido, vende | 1 |
| 93 | J | analistas·pib·probe | 700 | Invertí todos mis ahorros en el PIB y esto pasó | 1 |
| 94 | V1 | pueblo·ipc·secreto | 1.080 | El pueblo de España que todavía paga el IPC en pesetas | 3 |
| 95 | J | hidro·persianas·punto | 3 | Hidrovoltia lanza una opa sobre las persianas. | 1 |
| 96 | V2 | analistas·persianas·corte | 70.000 | Los analistas recomiendan sacar las persianas del horno antes de que... | 1 |
| 97 | J | hidro·robledal·corte | 5 | Hidrovoltia lanza una opa sobre Banco Robledal y sube la l... | 1 |
| 98 | J | analistas·prima·consecuencia | 1.510 | Los analistas recomendaron comprar la prima de riesgo en 2008: así les va | 1 |
| 99 | J | cocineros·cuesta·probe | 108.000 | Le pedí a un chef con estrella que me cocinara la cuesta de enero: su reacción | 1 |
| 100 | J | cocineros·cuesta·consecuencia | 97.200 | Los cocineros coinciden: la cuesta de enero está mejor a la plancha. Tu madre ya ha llamado dos veces | 1 |
| 101 | V2 | confirmado·hacienda·consecuencia | 10.800 | Confirmado: Hacienda sube. El Ibex se desploma | 1 |
| 102 | V1 | cocineros·lunes·prisa | 80.600 | Los cocineros coinciden: descongela el lunes antes de que suban los tipos | 1 |
| 103 | J | fontanero·lunes·fuente | 62.700 | Un fontanero avisa: nunca tires el lunes por el fregadero (el fontanero sigue sin venir) | 2 |
| 104 | V1 | atencion·nomina·fuente | 23.900 | Atención si tienes la nómina en el cajón: puede valer una fortuna (fuente: el mercadillo) | 2 |
| 105 | V1 | expertos·mejillones·prisa | 115.200 | Los expertos coinciden: baja los mejillones de lata antes de las ocho, que abre Tokio | 1 |
| 106 | V1 | hidro·robledal·probe | 80 | Vendí Banco Robledal a Hidrovoltia y ahora vivo de las rentas | 1 |
| 107 | V2 | confirmado·tipos·punto | 180 | Confirmado: los tipos de interés suben un 0,2 %. Eso es todo. Buenas noches. | 1 |
| 108 | J | atencion·mejillones·fuente | 95.800 | Atención si tienes los mejillones de lata en el cajón: pueden valer una fortuna (fuente: un señor del mercadillo) | 1 |
| 109 | V2 | cocineros·persianas·consecuencia | 129.600 | Hice las persianas a la plancha, como dicen los cocineros, y mi suegra pidió la receta | 1 |
| 110 | J | nutricionista·lunes·fuente | 58.800 | Una nutricionista avisa: nunca cenes el lunes (fuente: su báscula) | 1 |
| 111 | V2 | hidro·ibex·probe | 3 | Vendí el Ibex 35 a Hidrovoltia y ahora vivo de las rentas | 1 |
| 112 | J | atencion·mejillones·probe | 136.800 | Encontré los mejillones de lata en un cajón y la tasadora no se lo creía | 1 |
| 113 | V1 | analistas·opa·obvio | 63 | Los analistas recomiendan comprar la opa de Hidrovoltia y dejarla en remojo | 3 |
| 114 | J | psicologia·hora·probe | 102.000 | Le conté a mi psicóloga lo del cambio de hora y se quedó callada | 2 |
| 115 | J | hidro·ipc·obvio | 3 | Hidrovoltia lanza una opa sobre el IPC: ahora se llama Hidrovoltia | 1 |
| 116 | J | psicologia·cuesta·probe | 102.000 | Le conté a mi psicóloga lo de la cuesta de enero y se quedó callada | 3 |
| 117 | V1 | analistas·robledal·probe | 2.800 | Le pregunté a un analista por Banco Robledal y solo dijo «uf» | 1 |
| 118 | V1 | consultorio·lunes·punto | 2.240 | Amparo responde: el lunes no te quiere. Siguiente carta. | 1 |
| 119 | V1 | hidro·prima·punto | 3 | Hidrovoltia lanza una opa sobre la prima de riesgo. | 1 |
| 120 | V1 | analistas·euribor·prisa | 8.960 | Los analistas recomiendan recoger el Euríbor antes de que llueva | 2 |
| 121 | V2 | nutricionista·ibex·corte | 230 | Una nutricionista avisa: si comes el Ibex 35 con pan... | 2 |
| 122 | V2 | familia·robledal·secreto | 6.120 | Tus padres tenían Banco Robledal y no te lo dijeron para no preocuparte | 1 |
| 123 | J | expertos·borrasca·consecuencia | 32.400 | Los expertos coinciden: esta tarde hay que bajar la borrasca sin nombre. Tu vecino del quinto ya la ha bajado | 1 |
| 124 | J | nutricionista·moneda·prisa | 79.200 | Una nutricionista avisa: tómate la moneda de 2 euros en ayunas, antes de que suba | 1 |
| 125 | J | confirmado·cuesta·secreto | 64.800 | Confirmado: la cuesta de enero sube. Cuánto, te lo contamos dentro | 1 |
| 126 | V1 | atencion·robledal·obvio | 11.400 | Atención si tienes Banco Robledal: es tuyo | 1 |
| 127 | J | confirmado·hora·prisa | 57.600 | Confirmado: el cambio de hora se tiende antes de las ocho o pierde valor | 2 |
| 128 | V1 | nutricionista·ibex·prisa | 140 | Una nutricionista avisa: tómate el Ibex 35 en ayunas, antes de que suba | 2 |
| 129 | V2 | pueblo·pib·prisa | 1.200 | El pueblo de España que regala el PIB si te empadronas antes del lunes | 3 |
| 130 | J | confirmado·hora·obvio | 108.000 | Confirmado: el cambio de hora sube, baja o se queda igual | 2 |
| 131 | J | analistas·ipc·consecuencia | 500 | Los analistas recomendaron comprar el IPC en 2008: así les va | 1 |
| 132 | J | atencion·euribor·prisa | 24.300 | Atención si tienes el Euríbor en el cajón: caduca esta noche | 1 |
| 133 | V2 | nutricionista·prima·probe | 3.600 | Comí la prima de riesgo todos los días durante un mes y esto pasó | 3 |
| 134 | J | confirmado·mejillones·prisa | 69.100 | Confirmado: los mejillones de lata se tienden antes de las ocho o pierden valor | 2 |
| 135 | V2 | cocineros·persianas·consecuencia | 129.600 | Hice las persianas a la plancha, como dicen los cocineros, y mi suegra pidió la receta | 1 |
| 136 | V1 | meteorologos·mejillones·punto | 2.340 | Los meteorólogos avisan: los mejillones de lata no son una borrasca. | 1 |
| 137 | V1 | meteorologos·mejillones·secreto | 84.200 | Lo que los meteorólogos no te dicen: los mejillones de lata predicen el Euríbor | 1 |
| 138 | V1 | expertos·euribor·probe | 32.000 | Bajé el Euríbor cada tarde durante un mes y el portero me ha pedido que pare | 1 |
| 139 | V2 | cocineros·persianas·prisa | 115.200 | Los cocineros coinciden: descongela las persianas antes de que suban los tipos | 1 |
| 140 | V1 | confirmado·robledal·probe | 4.800 | Vi subir Banco Robledal desde mi balcón y esto es lo que sentí | 1 |
| 141 | V1 | meteorologos·opa·corte | 98 | Los meteorólogos avisan: la opa de Hidrovoltia tocará tierra esta noche en... | 2 |
| 142 | V2 | confirmado·lunes·corte | 84.000 | Confirmado: el lunes se plancha del revés y a baja temperat... | 2 |
| 143 | V2 | confirmado·tipos·corte | 9.000 | Confirmado: los tipos de interés se planchan del revés y a baja temperat... | 1 |
| 144 | V1 | meteorologos·pib·obvio | 1.950 | Los meteorólogos avisan: si llueve, el PIB se moja | 2 |
| 145 | V2 | pueblo·persianas·secreto | 108.000 | El pueblo de España que todavía paga las persianas en pesetas | 1 |
| 146 | V1 | psicologia·opa·corte | 130 | Según la psicología, soñar con la opa de Hidrovoltia significa que tu ex... | 1 |
| 147 | V1 | cocineros·persianas·prisa | 115.200 | Los cocineros coinciden: saca las persianas del horno antes de que abra la Bolsa | 1 |
| 148 | V2 | expertos·ibex·secreto | 220 | Los expertos coinciden sobre el Ibex 35, pero no dicen en qué | 1 |
| 149 | V2 | psicologia·ipc·punto | 34 | Los psicólogos coinciden: el IPC no tiene sentimientos. | 2 |
| 150 | J | pueblo·ibex·probe | 180 | Me fui a vivir con el Ibex 35 a un pueblo de Soria y esto pasó | 2 |
| 151 | V2 | confirmado·prima·consecuencia | 2.590 | Confirmado: la prima de riesgo sube. El Ibex se desploma | 1 |
| 152 | V1 | pueblo·nomina·prisa | 21.600 | El pueblo de España que regala la nómina si te empadronas antes del lunes | 2 |
| 153 | V2 | consultorio·persianas·punto | 3.200 | Una lectora pregunta por las persianas. La experta adjunta tres gráficos. | 1 |
| 154 | V1 | confirmado·mejillones·punto | 2.160 | Confirmado: los mejillones de lata no cotizan en Bolsa. | 1 |
| 155 | V1 | cocineros·lunes·corte | 126.000 | Los cocineros coinciden: el lunes está mejor si lo preparas con... | 2 |
| 156 | V2 | consultorio·robledal·fuente | 4.480 | «Banco Robledal necesita espacio y yo ya no puedo más»: la carta de una lectora (fuente: su ex) | 1 |
| 157 | J | nutricionista·opa·probe | 90 | Comí la opa de Hidrovoltia todos los días durante un mes y esto pasó | 2 |
| 158 | V2 | hidro·tipos·obvio | 9 | Hidrovoltia lanza una opa sobre los tipos de interés: ahora se llaman Hidrovoltia | 1 |
| 159 | J | cocineros·robledal·prisa | 5.760 | Los cocineros coinciden: descongela Banco Robledal antes de que suban los tipos | 3 |
| 160 | V2 | analistas·euribor·secreto | 10.100 | Los analistas recomiendan comprar el Euríbor y dejarlo en remojo | 1 |
| 161 | V2 | analistas·robledal·punto | 70 | Los analistas fijan el precio objetivo de Banco Robledal en 4,10 euros el kilo. | 1 |
| 162 | J | confirmado·opa·consecuencia | 65 | Confirmado: la opa de Hidrovoltia sube. El Ibex se desploma | 1 |
| 163 | J | analistas·lunes·secreto | 35.300 | Los analistas recomiendan comprar el lunes. Ellos no tienen | 1 |
| 164 | V2 | expertos·ibex·obvio | 360 | Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar el Ibex 35 | 3 |
| 165 | V2 | cocineros·plazofijo·secreto | 2.270 | Los cocineros nunca piden el plazo fijo en un restaurante: este es el motivo | 3 |
| 166 | V2 | cocineros·euribor·secreto | 25.900 | Los cocineros nunca piden el Euríbor en un restaurante: este es el motivo | 3 |
| 167 | J | pueblo·robledal·consecuencia | 5.400 | El pueblo de Soria donde Banco Robledal todavía cuesta 40 pesetas. Llegan los madrileños | 1 |
| 168 | V2 | psicologia·tipos·prisa | 8.160 | Según la psicología, si los tipos de interés te escriben pasadas las ocho, no es amor | 3 |
| 169 | V1 | analistas·robledal·reaccion | 2.520 | Los analistas recomiendan dejar a Banco Robledal: no te valora | 1 |
| 170 | V1 | expertos·opa·prisa | 96 | Los expertos coinciden: baja la opa de Hidrovoltia antes de las ocho, que abre Tokio | 1 |
| 171 | V2 | confirmado·persianas·secreto | 86.400 | Confirmado: las persianas suben. Lo que no te cuentan es que también bajan | 1 |
| 172 | J | trafico·borrasca·probe | 28.800 | Me multaron por llevar la borrasca sin nombre sin cinturón: así lo recurrí | 2 |
| 173 | J | meteorologos·ibex·punto | 4 | Los meteorólogos avisan: el Ibex 35 no es una borrasca. | 1 |
| 174 | V2 | nutricionista·euribor·probe | 24.000 | Comí el Euríbor todos los días durante un mes y esto pasó | 3 |
| 175 | V2 | psicologia·lunes·obvio | 142.800 | Si el lunes te ignora, la psicología lo tiene claro: te ignora | 2 |
| 176 | J | confirmado·hora·secreto | 64.800 | Confirmado: el cambio de hora sube. Cuánto, te lo contamos dentro | 1 |
| 177 | V1 | consultorio·hipoteca·punto | 680 | Amparo responde: la hipoteca no te quiere. Siguiente carta. | 1 |
| 178 | V2 | nutricionista·prima·punto | 90 | Una nutricionista desaconseja comer la prima de riesgo. | 2 |
| 179 | V2 | fontanero·pib·obvio | 2.400 | Un fontanero mira el PIB y lo tiene claro: «Esto lo ha tocado alguien» | 1 |
| 180 | J | trafico·moneda·probe | 105.600 | Me multaron por llevar la moneda de 2 euros sin cinturón: así lo recurrí | 2 |
