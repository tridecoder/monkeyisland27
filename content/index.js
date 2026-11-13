// Punto ÚNICO de registro del contenido. ARCHIVO COMPARTIDO: no lo edita ningún autor de sala.
// Ya registra las 10 salas: cada sala importa sus propios archivos extra (diálogos, escenas, arte),
// así que nadie necesita tocar este archivo. Documentación: docs/CONTENT_SCHEMA.md §1.
//
//   game    : content/game.js      (título, defaults §8.2, pistas §5.6, cuarta pared §8.6, créditos)
//   actors  : content/actors.js    (reparto completo §2)
//   items   : content/items.js     (18 objetos §4 + combinaciones comunes)
//   duels   : content/duelo.js     (14 parejas, flojas, comodín, objetos equivocados §6) — cada rival lo define su sala
//   flags   : content/flags.js     (lista de flags globales §5.5; el modo debug avisa de los no declarados)
//   rooms   : content/rooms/<id>.js (lógica) + content/rooms/art/<id>.art.js (arte), unidas con buildRoom()
import game from './game.js';
import actors from './actors.js';
import items from './items.js';
import duelo from './duelo.js';
import flags from './flags.js';
import vestibulo from './rooms/vestibulo.js';
import pecera from './rooms/pecera.js';
import office from './rooms/office.js';
import catacumba from './rooms/catacumba.js';
import pajarera from './rooms/pajarera.js';
import sala_amazonas from './rooms/sala_amazonas.js';
import ecosistema from './rooms/ecosistema.js';
import eventos from './rooms/eventos.js';
import administracion from './rooms/administracion.js';
import cpd from './rooms/cpd.js';

export default {
  game,
  actors: [actors],
  items: [items],
  duels: [duelo],
  flags: [flags],
  rooms: [vestibulo, pecera, office, catacumba, pajarera, sala_amazonas, ecosistema, eventos, administracion, cpd],
  dialogs: [],
  music: [],
  sfx: [],
};
