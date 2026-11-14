// LA SECRETARÍA DE REDACCIÓN (Custodia Precinto) — LÓGICA. Plan de comedia §5.15 (P2): se queda en el ventanuco y
// PIERDE EL ORÁCULO (fuera silla, CMS y Titulator de CU_DONDE; se quedan las de chiste). Adenda §1.5, §3.5 (cartel_material, timbre_secretaria),
// §4.4 (árbol de Custodia, MP3 «Boli muerto, boli nuevo»). Orden de dirección 3: Custodia vive en la REDACCIÓN
// (`pecera`), en la bisagra con la Redacción de papel (antes, en el Office, hoy Vending). Ids, flags (`office_*`, se
// conservan para no romper partidas) y líneas, sin cambios. El arte está en ./art/lib-secretaria.js (dibujo) y
// ./art/pecera.art.js (dónde va).
// Custodia es una PRESENCIA sin sprite: habla el objeto `custodia_precinto` (la persiana): api.sayFrom(...).
const cu = (api, lines) => api.sayFrom('custodia_precinto', lines);

// ------------------------------------------------------------------ Custodia Precinto (adenda 4.4, MP3)
// En CU_CADAVER las respuestas que fallan desaparecen mientras dura la conversación (no se guarda).
const cadaver = { activo: false, fallos: new Set(), dado: false };
const CAD_OPCIONES = [
  { k: 1, text: 'Para firmar en papel.', r: 'Firmar no gasta. No doy bolis para gestos.' },
  { k: 2, text: 'Para lo que surja.', r: 'Lo que surja, apúntelo en la mano.' },
  { k: 3, text: 'Para mi abuela.', r: 'Su abuela que venga. Con su muerto.' },
];
const opcionesCadaver = () => [
  ...CAD_OPCIONES.map(o => ({ text: o.text, if: () => !cadaver.fallos.has(o.k), silent: false,
    do: async (api) => { cadaver.fallos.add(o.k); await cu(api, o.r); return 'CU_CADAVER_2'; } })),
  { text: 'Para apuntar lo que me digan. Sin grabadora.', goto: 'CU_DA' },
];

export const dialogoCustodia = {
  actor: 'custodia_precinto', start: 'CU0',
  onEnd: async (api) => {
    // «si Bruno sale del diálogo, se lo devuelve»
    if (cadaver.activo && !cadaver.dado) await cu(api, 'Llévese a su muerto. Vuelva con una razón.');
    cadaver.activo = false;
  },
  nodes: {
    CU0: {
      options: [
        { text: '¿Me deja un boli?', goto: 'CU_PARAQUE' },
        { text: '¿Me da una libreta?', once: true, exit: true,
          do: async (api) => {
            await cu(api, 'Ya tiene una.');
            await api.say('Está a medias.');
            await cu(api, 'Pues acábela. Las libretas a medias son de los que no acaban.');
          } },
        { text: 'Buenas noches.', once: true, do: async (api) => { await cu(api, 'Las buenas noches, a la cafetera. A mí tráigame un motivo.'); } },
        { text: 'Por favor. Es una emergencia.', once: true,
          do: async (api) => { await cu(api, ['Una emergencia es que se pare la rotativa.', 'Lo suyo es un capricho con prisa.']); } },
        { text: 'Me manda Gervasio.', once: true, do: async (api) => { await cu(api, 'Gervasio no manda. Delega. Y a mí no se me delega.'); } },
        { text: 'Begoña dice que hay que rellenar algo.', once: true,
          do: async (api) => { await cu(api, ['Begoña tiene formularios. Yo tengo memoria.', 'La memoria no se rellena. Se gana.']); } },
        { text: '¿Por qué no se le ve la cara?', do: async (api) => { await cu(api, 'Porque la cara no es material. Siguiente.'); } },
        { text: '¿Usted sabe dónde está todo?', if: '!custodia_ablandada', exit: true,
          do: async (api) => { await cu(api, 'Todo. Siguiente.'); } },
        { text: '¿Dónde está...?', if: 'custodia_ablandada', goto: 'CU_DONDE' },
        { text: 'Le traigo un muerto.', if: 'has:boli_muerto', goto: 'CU_CADAVER' },
        { text: 'Nada, perdone.', exit: true, do: async (api) => { await cu(api, 'Perdonado.'); } },
      ],
    },
    CU_PARAQUE: {
      onEnter: async (api) => { await cu(api, '¿Para qué.'); },
      options: [
        { text: 'Para escribir.', exit: true,
          do: async (api) => {
            await cu(api, ['Escribir se escribe con la cabeza. El boli es para firmar.', '¿Va a firmar algo.']);
            await api.say('Algún día.');
            await cu(api, 'Pues vuelva ese día.');
          } },
        { text: 'Para firmar en papel. En la página 7.', exit: true,
          do: async (api) => {
            await cu(api, 'Ja.');
            await api.wait(500);              // (No se ríe. Lo dice. Es una sílaba.)
            await cu(api, 'Seis años en la web y viene a pedirme un boli para el papel.');
          } },
        { text: 'Para tenerlo. Por si acaso.', exit: true,
          do: async (api) => { await cu(api, '"Por si acaso" es como desaparecen ochenta y tres bolis al año.'); } },
        { text: '¿Y cómo se consigue un boli aquí?', exit: true,
          do: async (api) => {
            api.sfx('open');                  // (Por primera vez, la persiana sube un centímetro.)
            await api.wait(400);
            await cu(api, ['Boli muerto, boli nuevo.', 'Tráigame el cadáver. Gastado de trabajar, no de perderlo.', 'Eso lo noto.']);
            api.setFlag('custodia_regla', true);
          } },
      ],
    },
    CU_CADAVER: {
      onEnter: async (api) => {
        if (!api.flag('custodia_regla')) { await cu(api, 'Un muerto sin que se lo pida. Qué raro.'); return 'exit'; }
        cadaver.activo = true; cadaver.dado = false; cadaver.fallos = new Set();
        api.sfx('pickup');                    // (la mano coge el boli y lo levanta a contraluz, despacio)
        await api.wait(500);
        await cu(api, ['Rojo. Sin tinta. Gastado hasta el final.', 'Esto es de Aurora. Es la única que los acaba. Ha muerto trabajando.', '¿Y para qué quiere el nuevo.']);
      },
      options: opcionesCadaver(),
    },
    CU_CADAVER_2: {
      onEnter: async (api) => { await cu(api, 'No. Otra vez. ¿Para qué.'); },
      options: opcionesCadaver(),
    },
    CU_DA: {
      onEnter: async (api) => {
        await api.wait(700);                  // (Silencio. La mano se queda quieta.)
        await cu(api, '...Eso hacía la gente antes.');
        api.sfx('open');                      // (Gira la llave. La mano sale con un boli azul.)
        await api.wait(400);
        await cu(api, ['Azul. El rojo es de Aurora.', 'Firme aquí que se lo lleva.']);
        api.sfx('paper');                     // (Bruno firma en EL LIBRO.)
        await api.anim(api.player, 'reach', 500);
        await cu(api, 'Ya ha firmado. Ya lo ha usado. Devuélvamelo.');
        await api.anim(api.player, 'reach', 300);
        await api.say('...¿Y para qué me lo ha dado?');
        await cu(api, ['Para que sepa lo que se siente.', 'Desde hoy, pregúnteme dónde está la gente. Las cosas, no.']);
        api.take('boli_muerto');
        api.setFlag('custodia_ablandada', true);
        cadaver.dado = true;
        return 'exit';
      },
    },
    CU_DONDE: {
      onEnter: async (api) => { await cu(api, 'Diga.'); },
      options: [
        { text: '¿Dónde está Ramírez?', once: true,
          do: async (api) => { await cu(api, 'Desayunando.'); await api.say('¿Desde 2019?'); await cu(api, 'Él desayuna despacio. Yo apunto rápido.'); } },
        { text: '¿Dónde está la bandeja 2 de la impresora de la tercera?', once: true,
          do: async (api) => { await cu(api, 'No existe. Por eso es la única bandeja que no se atasca.'); } },
        { text: '¿Dónde está la gente? La redacción está vacía.', once: true,
          do: async (api) => { await cu(api, ['En su casa. Desde las seis y media. Donde tiene que estar.', 'Lo raro es usted.']); } },
        { text: '¿Dónde está mi nombre bien escrito?', once: true,
          do: async (api) => { await cu(api, ['En ningún sitio. Todavía.', 'Pero el todavía, en esta casa, ya es mucho.']); } },
        { text: 'Ya está.', exit: true, do: async (api) => { await cu(api, 'Siguiente.'); } },
      ],
    },
  },
};

export async function hablarCustodia(api) {
  if (!api.flag('office_custodia_vista')) {
    api.setFlag('office_custodia_vista', true);
    await cu(api, '¿Qué quiere.');                  // (la persiana no se mueve)
  } else await cu(api, 'Otra vez usted. ¿Qué quiere.');
  await api.dialog('custodia', 'CU0');
}


/** Los tres objetos de la Secretaría (la geometría, en el arte de la Redacción). */
export const objetosSecretaria = [
    // ADENDA §3.5 · Secretaría de Redacción (Custodia Precinto, presencia sin sprite)
    { id: 'custodia_precinto', name: 'Secretaría de Redacción', color: '#A0A0FF', defaultVerb: 'hablar',
      murmurs: ['Ochenta y tres bolis. Los tengo contados. Los que faltan.', 'Las paredes no oyen. Oigo yo.', '...Buenas noches.'],
      murmurColor: '#A0A0FF',
      handlers: {
        mirar: async (api) => { await api.say(['La Secretaría de Redacción. Bajo la persiana, dos manos. Y una llave.', 'Nadie le ha visto la cara desde 2012. Se le oye la mirada.']); },
        hablar: hablarCustodia,
        'dar:boli_muerto': async (api) => { await api.dialog('custodia', 'CU_CADAVER'); },
        'dar:cafe': async (api) => { await cu(api, ['¿Me soborna con un café de Gertrudis.', 'Gertrudis me debe catorce. No cuenta.']); },
        'dar:tarjeta_becario': async (api) => { await cu(api, ['"Pellizco". Seis años y nunca me ha pedido un boli.', 'O es respeto o es miedo. Las dos me valen.']); },
        'dar:ticket_n1': async (api) => { await cu(api, 'Rubén. Por fin alguien lo apunta. Me debe dos bolis.'); },
        'dar:*': async (api) => { await cu(api, 'Eso no es material.'); },
        abrir: async (api) => { await cu(api, 'Abierta dos dedos. Lo que cabe un boli. Siguiente.'); },
        empujar: async (api) => { await cu(api, 'Empuje algo suyo.'); },
        tirar: async (api) => { await cu(api, 'Empuje algo suyo.'); },
        coger: async (api) => { await cu(api, 'Aquí no se coge nada. Se merece.'); },
        cerrar: async (api) => { await cu(api, 'La cierro yo. Cuando cierre el periódico.'); },
      } },
    { id: 'cartel_material', name: 'cartel del material', handlers: {
      mirar: '"EL MATERIAL NO SE PIDE. SE MERECE".',
      coger: async (api) => { await cu(api, 'El cartel tampoco se pide.'); },
      usar: 'Lo leo dos veces. Sigo sin merecer nada. Coherente.',
    } },
    { id: 'timbre_secretaria', name: 'timbre', handlers: {
      mirar: 'Un timbre de mostrador. Pegatina: "NO".',
      usar: async (api) => {
        const n = api.inc('office_timbre_n');
        api.sfx('beep');
        if (n === 1) {
          await api.say('¡Ding!');
          await cu(api, 'Estoy delante.');
          await api.say('Ya. Perdón.');
        } else await cu(api, 'Tóquelo otra vez y le apunto en el libro.');
      },
      coger: 'Si me llevo el timbre, Custodia me apunta en el libro. Con tinta azul.',
      empujar: 'Lo empujo sin tocarlo. Es la versión cobarde de llamar.',
    } },
];

export const flagsSecretaria = {
  office_timbre_n: 'int · pecera (Secretaría) · +1 por Usar timbre_secretaria (adenda 3.5)',
  office_custodia_vista: 'bool · pecera (Secretaría) · 1.ª conversación con Custodia («¿Qué quiere.»)',
};
