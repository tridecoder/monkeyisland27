// GENERADO por tools/gen-titulador.mjs desde docs/guion2/e4/piezas.json (versión «titulador-vuelta2-r7»). NO SE EDITA A MANO:
// se cambia el JSON y se vuelve a generar (docs/guion2-impl/GUIA_AUTORES.md §E4). Lo lee content/rooms/pecera.titulador.js.
// Bloque «solo pantalla»: titulares, plantillas, menús y etiquetas que solo se ven en el monitor de Yoli; no son líneas
// habladas (tools/plan-rules.mjs SOLO_PANTALLA los deja fuera de los topes y del límite de 80 caracteres).
// @solo-pantalla:inicio
const PIEZAS = {
 "version": "titulador-vuelta2-r7",
 "componer": "Clave a|s|g. 1) Si está en especiales, ese texto. 2) Si no, autoridad.tObj[gancho] si el asunto es de casa y existe; si no, autoridad.t[gancho]. Cada plantilla es un molde real de Discover con UN hueco. 3) Marcas: {S} asunto con artículo, {C} forma corta, {P} lo/la/los/las, {E} o/a/os/as, {N} '' o 'n', {s} '' o 's' (adjetivo en plural). 4) «a el» → «al», «de el» → «del», mayúscula inicial.",
 "formula": {
  "usuarios": "B(asunto) × k(autoridad) × k(gancho) × afinidades × castigo_opa",
  "castigo_opa": 0.05,
  "redondeo": "< 100 → entero, mínimo 3 · < 10.000 → decena · si no, centena"
 },
 "autoridades": [
  {
   "id": "hidro",
   "menu": "Hidrovoltia lanza una opa",
   "k": 0.02,
   "mania": "la noticia de verdad: dice algo y hunde",
   "t": {
    "corte": "Opa de Hidrovoltia: qué pasa con {S} si no...",
    "obvio": "Hidrovoltia lanza una opa sobre {S}: esto es lo que debes saber",
    "punto": "Hidrovoltia lanza una opa sobre {S}.",
    "senales": "Si tienes {S}, esto es lo que te ofrece Hidrovoltia en su opa",
    "probe": "Tengo {S} y Hidrovoltia lanza una opa: qué hago",
    "prisa": "Opa de Hidrovoltia sobre {S}: tienes hasta el viernes para vender",
    "curioso": "Qué es una opa y por qué Hidrovoltia quiere {S}",
    "truco": "Cómo saber si la opa de Hidrovoltia sobre {S} te afecta"
   }
  },
  {
   "id": "expertos",
   "menu": "Los expertos coinciden",
   "k": 2,
   "mania": "esta tarde hay que bajarlo todo",
   "t": {
    "corte": "Los expertos avisan: nunca metas {S} en el lavavajillas porque...",
    "obvio": "Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar {S}",
    "punto": "Los expertos recomiendan ventilar {S} diez minutos al día.",
    "senales": "Las 5 señales de que {S} tiene{N} humedad, según los expertos",
    "probe": "Purgué {S} como dicen los expertos y esto es lo que pasó",
    "prisa": "Los expertos piden purgar {S} antes de encender la calefacción",
    "curioso": "Por qué los expertos recomiendan dormir con {S} abiert{E}",
    "truco": "El truco de los expertos para secar {S} sin secadora"
   }
  },
  {
   "id": "psicologia",
   "menu": "Según la psicología",
   "k": 1.7,
   "mania": "todo dice algo de ti",
   "t": {
    "corte": "Qué significa soñar con {S}, según la psicología: es señal de...",
    "obvio": "Si piensas en {S} antes de dormir, esto es lo que significa",
    "punto": "La psicología lo confirma: tu relación con {S} es dependencia emocional.",
    "senales": "Las 7 señales de que tu relación con {S} es tóxica",
    "probe": "Le conté a mi psicóloga lo de {S} y se quedó callada",
    "prisa": "Según la psicología, si {S} te escribe{N} pasadas las ocho, no es amor",
    "curioso": "Las personas que hablan con {S} tienen esto en común, según la psicología",
    "truco": "La técnica japonesa para dejar de pensar en {S}"
   }
  },
  {
   "id": "pareja",
   "menu": "Amor y pareja",
   "k": 1.8,
   "mania": "todo es una relación",
   "t": {
    "corte": "{S} te ha{N} dejado: los 5 pasos para...",
    "obvio": "Si {S} hace{N} esto, no te quiere{N}",
    "punto": "Los españoles piensan en {S} una media de 14 veces al día.",
    "senales": "Cómo saber si {S} te quiere{N}: 5 señales",
    "probe": "Dejé a {S} hace un año y esto es lo que aprendí",
    "prisa": "La regla de los tres días: cuánto esperar para escribir a {S}",
    "curioso": "Por qué {S} te deja{N} en visto, según la ciencia",
    "truco": "Cómo olvidar a {S} en 21 días"
   }
  },
  {
   "id": "cocineros",
   "menu": "Los cocineros coinciden",
   "k": 1.8,
   "mania": "todo se cocina",
   "t": {
    "corte": "Los cocineros coinciden: {S} está{N} mejor si {P} preparas con...",
    "obvio": "Los cocineros coinciden: {S} se hace{N} mejor a fuego lento",
    "punto": "Los cocineros coinciden: {S} se sala{N} al final.",
    "senales": "Las 5 señales de que {S} se ha{N} puesto mal{E}",
    "probe": "Los cocineros coinciden: {S} nunca se lava{N} antes de cocinar{P}",
    "prisa": "Los cocineros coinciden: descongela {S} la noche antes",
    "curioso": "Los cocineros nunca piden {S} en un restaurante: este es el motivo",
    "truco": "El truco de los cocineros para que {S} quede{N} jugos{E}"
   }
  },
  {
   "id": "confirmado",
   "menu": "Confirmado",
   "k": 1.2,
   "mania": "todo se confirma",
   "t": {
    "corte": "Confirmado: {S} se puede{N} meter en el microondas si...",
    "obvio": "Confirmado: {S} sube{N}, baja{N} o se queda{N} igual",
    "punto": "Confirmado: {S} caduca{N} el 14 de marzo.",
    "senales": "Confirmado: {S} encoge{N} si {P} lavas con agua caliente",
    "probe": "Confirmado: {S} va{N} al contenedor amarillo",
    "prisa": "Confirmado: {S} se tiende{N} antes de las ocho o pierde{N} valor",
    "curioso": "Confirmado: {S} no se puede{N} congelar",
    "truco": "Confirmado: {S} se lava{N} a 30 grados"
   }
  },
  {
   "id": "pueblo",
   "menu": "El pueblo de España",
   "k": 1.5,
   "mania": "allí todo es como antes",
   "t": {
    "corte": "El pueblo de España donde {S} se hereda{N} de padres a...",
    "obvio": "El pueblo de España donde {S} se sigue{N} haciendo a mano",
    "punto": "El pueblo de España que vive sin {S} desde la Edad Media.",
    "senales": "Los 5 pueblos de España donde todavía no ha{N} llegado {S}",
    "probe": "Dejé la ciudad por un pueblo sin {S} y esto es lo que pasó",
    "prisa": "El pueblo de España que regala {S} si te empadronas antes de diciembre",
    "curioso": "El pueblo de España que todavía paga {S} en pesetas",
    "truco": "El pueblo de España donde la gente vive cien años gracias a {S}"
   }
  },
  {
   "id": "analistas",
   "menu": "Los analistas recomiendan",
   "k": 0.7,
   "mania": "todo es inversión",
   "t": {
    "corte": "Los analistas recomiendan sacar {S} del horno antes de que...",
    "obvio": "Los analistas recomiendan guardar {S} en un lugar fresco y seco",
    "punto": "Los analistas fijan el precio objetivo de {S} en 4,10 euros el kilo.",
    "senales": "Las 3 señales de que {S} está{N} madur{E}, según los analistas",
    "probe": "Llevo un año comprando {S} a granel y esto es lo que he ahorrado",
    "prisa": "Los analistas recomiendan recoger {S} antes de que llueva",
    "curioso": "Por qué los analistas guardan {S} en la nevera",
    "truco": "Los analistas recomiendan comprar {S} y dejar{P} en remojo"
   }
  },
  {
   "id": "nutricionista",
   "menu": "Una nutricionista avisa",
   "k": 1.5,
   "mania": "todo se come",
   "t": {
    "corte": "Una nutricionista avisa: {S} tiene{N} más azúcar que...",
    "obvio": "Qué le pasa a tu cuerpo si comes {S} todos los días",
    "punto": "Una nutricionista desaconseja comer {S}.",
    "senales": "Las 5 señales de que tu cuerpo necesita {S}",
    "probe": "Comí {S} todos los días durante un mes y esto pasó",
    "prisa": "El mejor momento del día para tomar {S}, según una nutricionista",
    "curioso": "Una nutricionista avisa: nunca cenes {S}",
    "truco": "Una nutricionista revela cómo comer {S} sin engordar"
   }
  },
  {
   "id": "hogar",
   "menu": "Ni lejía ni vinagre",
   "k": 1.5,
   "mania": "todo se limpia",
   "t": {
    "corte": "Ni lejía ni vinagre: el truco para limpiar {S} es...",
    "obvio": "Ni lejía ni vinagre: así se limpia{N} {S}",
    "punto": "Ni lejía ni vinagre: {S} se blanquea{N} con bicarbonato.",
    "senales": "Las 5 señales de que hay que tirar {S}",
    "probe": "Metí {S} en el congelador y esto es lo que pasó",
    "prisa": "Cada cuánto hay que lavar {S}, según los expertos",
    "curioso": "El error que todos cometemos al tender {S}",
    "truco": "El truco de la bola de papel de aluminio para {S}"
   }
  },
  {
   "id": "meteorologos",
   "menu": "Los meteorólogos avisan",
   "k": 1.9,
   "mania": "el parte del tiempo",
   "t": {
    "corte": "Los meteorólogos ponen fecha a la llegada de {S}: será el...",
    "obvio": "Los meteorólogos avisan: {S} entra{N} por Galicia este fin de semana",
    "punto": "{S} dejará{N} hasta 40 litros por metro cuadrado.",
    "senales": "{S} llega{N} con fuerza: estas son las zonas afectadas",
    "probe": "Las imágenes de {S} a su paso por Cuenca",
    "prisa": "Alerta naranja por {S} en media España",
    "curioso": "Llega el veranillo de {S}: hasta cuándo durará",
    "truco": "Adiós a {S}: los meteorólogos confirman el cambio a partir del jueves"
   }
  },
  {
   "id": "trafico",
   "menu": "Tráfico avisa",
   "k": 1.6,
   "mania": "todo se multa",
   "t": {
    "corte": "Los radares de Tráfico ya detectan {S} y la multa es de...",
    "obvio": "Tráfico aclara si {S} puede{N} viajar en la baca del coche",
    "punto": "Tráfico confirma: {S} puede{N} ir en el asiento de delante.",
    "senales": "Tráfico avisa: si ves {S} en la carretera, reduce la velocidad",
    "probe": "Me multaron por llevar {S} sin cinturón: así lo recurrí",
    "prisa": "Tráfico avisa: a partir de enero, {S} tendrá{N} que pasar la ITV",
    "curioso": "La pegatina de {S} que Tráfico te exigirá en el parabrisas",
    "truco": "Cómo saber si Tráfico te ha multado por {S}: el truco"
   }
  }
 ],
 "asuntos": [
  {
   "id": "persianas",
   "dom": "casa",
   "menu": "las persianas",
   "S": "las persianas",
   "C": "las persianas",
   "P": "las",
   "E": "as",
   "N": "n",
   "s": "s",
   "B": 40000,
   "epi": "Tus persianas"
  },
  {
   "id": "mejillones",
   "dom": "casa",
   "menu": "los mejillones de lata",
   "S": "los mejillones de lata",
   "C": "los mejillones",
   "P": "los",
   "E": "os",
   "N": "n",
   "s": "s",
   "B": 36000,
   "epi": "Tus mejillones"
  },
  {
   "id": "hacienda",
   "dom": "eco",
   "menu": "Hacienda",
   "S": "Hacienda",
   "C": "Hacienda",
   "P": "la",
   "E": "a",
   "N": "",
   "s": "",
   "B": 10000,
   "epi": "Tu Hacienda"
  },
  {
   "id": "hipoteca",
   "dom": "eco",
   "menu": "la hipoteca",
   "S": "la hipoteca",
   "C": "la hipoteca",
   "P": "la",
   "E": "a",
   "N": "",
   "s": "",
   "B": 9000,
   "epi": "Tu hipoteca"
  },
  {
   "id": "nomina",
   "dom": "eco",
   "menu": "la nómina",
   "S": "la nómina",
   "C": "la nómina",
   "P": "la",
   "E": "a",
   "N": "",
   "s": "",
   "B": 8500,
   "epi": "Tu nómina"
  },
  {
   "id": "euribor",
   "dom": "eco",
   "menu": "el Euríbor",
   "S": "el Euríbor",
   "C": "el Euríbor",
   "P": "lo",
   "E": "o",
   "N": "",
   "s": "",
   "B": 8000,
   "epi": "Tu Euríbor"
  },
  {
   "id": "plazofijo",
   "dom": "eco",
   "menu": "el plazo fijo",
   "S": "el plazo fijo",
   "C": "el plazo fijo",
   "P": "lo",
   "E": "o",
   "N": "",
   "s": "",
   "B": 3000,
   "epi": "Tu plazo fijo"
  },
  {
   "id": "robledal",
   "dom": "eco",
   "menu": "Banco Robledal",
   "S": "Banco Robledal",
   "C": "Banco Robledal",
   "P": "lo",
   "E": "o",
   "N": "",
   "s": "",
   "B": 2000,
   "epi": "Tu Robledal"
  },
  {
   "id": "prima",
   "dom": "eco",
   "menu": "la prima de riesgo",
   "S": "la prima de riesgo",
   "C": "la prima",
   "P": "la",
   "E": "a",
   "N": "",
   "s": "",
   "B": 1200,
   "epi": "Tu prima de riesgo"
  },
  {
   "id": "deuda",
   "dom": "eco",
   "menu": "la deuda pública",
   "S": "la deuda pública",
   "C": "la deuda",
   "P": "la",
   "E": "a",
   "N": "",
   "s": "",
   "B": 700,
   "epi": "Tu deuda pública"
  },
  {
   "id": "pib",
   "dom": "eco",
   "menu": "el PIB",
   "S": "el PIB",
   "C": "el PIB",
   "P": "lo",
   "E": "o",
   "N": "",
   "s": "",
   "B": 500,
   "epi": "Tu PIB"
  },
  {
   "id": "ipc",
   "dom": "eco",
   "menu": "el IPC",
   "S": "el IPC",
   "C": "el IPC",
   "P": "lo",
   "E": "o",
   "N": "",
   "s": "",
   "B": 400,
   "epi": "Tu IPC"
  },
  {
   "id": "ibex",
   "dom": "eco",
   "menu": "el Ibex 35",
   "S": "el Ibex 35",
   "C": "el Ibex",
   "P": "lo",
   "E": "o",
   "N": "",
   "s": "",
   "B": 60,
   "epi": "Tu Ibex"
  },
  {
   "id": "opa",
   "dom": "eco",
   "menu": "la opa de Hidrovoltia",
   "S": "la opa de Hidrovoltia",
   "C": "la opa",
   "P": "la",
   "E": "a",
   "N": "",
   "s": "",
   "B": 600,
   "epi": null
  }
 ],
 "ganchos": [
  {
   "id": "corte",
   "menu": "«...» (cortar)",
   "k": 2.5,
   "mecanismo": "el gancho cortado del molde"
  },
  {
   "id": "obvio",
   "menu": "lo que ya sabías",
   "k": 3,
   "mecanismo": "el molde que no dice nada"
  },
  {
   "id": "punto",
   "menu": "decirlo todo",
   "k": 0.05,
   "mecanismo": "el dato (hunde)"
  },
  {
   "id": "senales",
   "menu": "las señales",
   "k": 2.2,
   "mecanismo": "lista o test: «las 5 señales», «cómo saber si»"
  },
  {
   "id": "probe",
   "menu": "lo probé yo",
   "k": 2,
   "mecanismo": "testimonio: «esto es lo que pasó»"
  },
  {
   "id": "prisa",
   "menu": "antes de que sea tarde",
   "k": 1.6,
   "mecanismo": "plazo u hora"
  },
  {
   "id": "curioso",
   "menu": "lo que no sabías",
   "k": 1.8,
   "mecanismo": "curiosidad: «este es el motivo», «tienen esto en común»"
  },
  {
   "id": "truco",
   "menu": "el truco",
   "k": 1.7,
   "mecanismo": "el truco o la técnica"
  }
 ],
 "afinidades": [
  {
   "a": "cocineros",
   "s": "mejillones",
   "k": 1.5
  },
  {
   "a": "expertos",
   "s": "persianas",
   "k": 1.3
  },
  {
   "a": "confirmado",
   "s": "euribor",
   "g": "obvio",
   "k": 20
  },
  {
   "a": "psicologia",
   "s": "euribor",
   "k": 1.3
  },
  {
   "a": "nutricionista",
   "s": "mejillones",
   "k": 1.3
  }
 ],
 "especiales": {
  "hogar|persianas|prisa": "Cada cuánto hay que lavar las persianas, según los analistas",
  "confirmado|mejillones|probe": "Confirmado: los mejillones de lata cotizan en el contenedor amarillo",
  "nutricionista|mejillones|truco": "Los mejillones de lata, el nuevo valor refugio, según una nutricionista",
  "nutricionista|mejillones|corte": "Una nutricionista avisa: los mejillones de lata cotizan más que...",
  "nutricionista|mejillones|obvio": "Qué le pasa a tu hipoteca si comes mejillones de lata todos los días",
  "cocineros|mejillones|senales": "Las 5 señales de que los mejillones de lata van a subir, según los cocineros",
  "hogar|persianas|curioso": "El error que todos cometemos al declarar las persianas",
  "hogar|persianas|obvio": "Ni lejía ni vinagre: así se amortizan las persianas",
  "hogar|persianas|senales": "Las 5 señales de que hay que refinanciar las persianas",
  "hogar|mejillones|obvio": "Ni lejía ni vinagre: así se amortizan los mejillones de lata",
  "hogar|mejillones|senales": "Las 5 señales de que hay que refinanciar los mejillones de lata",
  "cocineros|mejillones|punto": "Los cocineros coinciden: los mejillones de lata no se cocinan.",
  "cocineros|mejillones|obvio": "Los cocineros coinciden: los mejillones de lata se hacen mejor en la lata",
  "nutricionista|mejillones|punto": "Una nutricionista desaconseja comer los mejillones de lata con la lata.",
  "hogar|persianas|punto": "Ni lejía ni vinagre: las persianas se limpian bajándolas.",
  "hogar|mejillones|punto": "Ni lejía ni vinagre: los mejillones de lata se limpian con su propio caldo.",
  "expertos|persianas|corte": "Los expertos coinciden: esta tarde hay que cerrar las puertas y bajar las...",
  "hidro|opa|punto": "Hidrovoltia lanza una opa sobre su propia opa."
 },
 "categorias": [
  {
   "id": "secreto",
   "si": "la combinación está en secretos",
   "etiqueta": "(la del secreto)",
   "linea": "(la del secreto)"
  },
  {
   "id": "honesto",
   "si": "hidro|robledal|punto",
   "etiqueta": "TITULAR DE PAPEL",
   "linea": "C1"
  },
  {
   "id": "opa",
   "si": "el titular contiene la palabra «opa»",
   "etiqueta": "SOLO LOS DE HIDROVOLTIA",
   "linea": "C2"
  },
  {
   "id": "dato",
   "si": "gancho punto",
   "etiqueta": "DICHO. NADIE ENTRA",
   "linea": "C3"
  },
  {
   "id": "pico",
   "si": "u >= 200.000",
   "etiqueta": "PICO DE LA NOCHE",
   "linea": "C6"
  },
  {
   "id": "corazon",
   "si": "autoridad psicologia o pareja y asunto de economía",
   "etiqueta": "ECONOMÍA, SECCIÓN CORAZÓN",
   "linea": null
  },
  {
   "id": "economia",
   "si": "asunto de economía y u < 20.000",
   "etiqueta": "SECCIÓN DE ECONOMÍA",
   "linea": "C5"
  },
  {
   "id": "corte",
   "si": "gancho corte",
   "etiqueta": "LOS PUNTOS TRABAJAN",
   "linea": null
  },
  {
   "id": "obvio",
   "si": "gancho obvio",
   "etiqueta": "VERDAD COMO UN TEMPLO",
   "linea": null
  },
  {
   "id": "senales",
   "si": "gancho senales",
   "etiqueta": "SEÑALES INEQUÍVOCAS",
   "linea": null
  },
  {
   "id": "probe",
   "si": "gancho probe",
   "etiqueta": "LE PASÓ A ALGUIEN",
   "linea": null
  },
  {
   "id": "prisa",
   "si": "gancho prisa",
   "etiqueta": "ANTES DE LAS OCHO (SON LAS 20:59)",
   "linea": null
  },
  {
   "id": "curioso",
   "si": "gancho curioso",
   "etiqueta": "NADIE LO SABÍA",
   "linea": null
  },
  {
   "id": "truco",
   "si": "gancho truco",
   "etiqueta": "TRUCO DE TODA LA VIDA",
   "linea": null
  },
  {
   "id": "sube",
   "si": "u > anterior",
   "etiqueta": "SUBE",
   "linea": "C7"
  },
  {
   "id": "baja",
   "si": "u < anterior",
   "etiqueta": "SE DESPLOMA",
   "linea": "C8"
  },
  {
   "id": "igual",
   "si": "u = anterior",
   "etiqueta": "NI SUBE NI BAJA",
   "linea": null
  }
 ],
 "voz": "Yoli dice la línea de la categoría si la tiene y no la ha dicho en la partida; si no, C7/C8 según el contador, si no la ha dicho; si no, muda.",
 "secretos": [
  {
   "combo": "expertos|persianas|obvio",
   "etiqueta": "CLÁSICO DE LAS SIETE",
   "linea": "X1"
  },
  {
   "combo": "cocineros|mejillones|corte",
   "etiqueta": "CON... (NADIE SABE QUÉ)",
   "linea": "X2"
  },
  {
   "combo": "cocineros|opa|corte",
   "etiqueta": "COCINA DE ALTAS FINANZAS",
   "linea": "X4"
  },
  {
   "combo": "confirmado|euribor|obvio",
   "etiqueta": "RÉCORD DE LA CASA",
   "linea": "X5"
  },
  {
   "combo": "psicologia|euribor|probe",
   "etiqueta": "SE QUEDÓ CALLADA",
   "linea": "X7"
  },
  {
   "combo": "psicologia|prima|prisa",
   "etiqueta": "NO ES AMOR",
   "linea": "X8"
  },
  {
   "combo": "pueblo|euribor|curioso",
   "etiqueta": "EN PESETAS",
   "linea": "X9"
  },
  {
   "combo": "psicologia|euribor|senales",
   "etiqueta": "RELACIÓN TÓXICA (A TIPO VARIABLE)",
   "linea": null
  },
  {
   "combo": "confirmado|ibex|prisa",
   "etiqueta": "TENDIDO ANTES DE LAS OCHO",
   "linea": null
  },
  {
   "combo": "expertos|prima|obvio",
   "etiqueta": "PUERTAS CERRADAS, PRIMA BAJADA",
   "linea": null
  },
  {
   "combo": "analistas|prima|truco",
   "etiqueta": "EN REMOJO DESDE ANOCHE",
   "linea": null
  }
 ],
 "demo_paso_34": [
  [
   "hidro",
   "robledal",
   "punto"
  ],
  [
   "meteorologos",
   "robledal",
   "corte"
  ]
 ],
 "ganador_por_defecto": "cocineros|mejillones|corte",
 "sentimentales": [
  "psicologia",
  "pareja"
 ]
};
// @solo-pantalla:fin
// Lo que DICE Yoli al publicar (una vez cada una por partida): líneas habladas, pasan por todos los topes.
PIEZAS.lineas = {
 "C1": "Tres otra vez. Ya nos conocemos los tres.",
 "C2": "Han entrado los de Hidrovoltia. A mirarse.",
 "C3": "Lo has contado todo. Ya no hace falta entrar.",
 "C5": "Economía. Lo leen los de Bolsa. Los dos.",
 "C6": "No dice nada y lo lee media España. Me tiembla el párpado.",
 "C7": "Sube. No sé qué has quitado, pero quítalo más.",
 "C8": "Baja. Has dicho algo, ¿verdad?",
 "X1": "El de todas las tardes. Lo saco a las siete. Nunca falla.",
 "X2": "¿Con qué? No lo sabe nadie. Por eso lo leen.",
 "X4": "Ciento cuarenta cocineros. Ninguno sabe qué es una opa.",
 "X5": "Sube, baja o se queda igual. Lo he medido: es verdad.",
 "X7": "Callada. Cobra sesenta euros la hora y se ha quedado callada.",
 "X8": "Pasadas las ocho. Aquí siempre son las 20:59. Estamos a salvo.",
 "X9": "En pesetas. No sabe nadie cuánto es, y por eso entran."
};
export default PIEZAS;
