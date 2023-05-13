/*
this file serves as a module aggregate to make all the exports of the package available under a single import.
It's standard to name it `index.js` or `main.js` often referring to wether the package uses CJS or ESM.
some packages provide both, as they can be individually specified in the package.json for maximum plugability.

Currently, the entire namespace is excessively polluted by how many things are exposed.
But this doesn't affect the end-user and can be gradually tidied up.
*/
export * from './lib/_util.js';
export * from './lib/_settings.js';
export * from './lang/lang-en.js';
export * from './lib/_file_saver.js';
export * from './lib/_saveload.js';
export * from './lib/_text.js';
export * from './lib/_io.js';
export * from './lib/_command.js';
export * from './lib/_defaults.js';
export * from './lib/_templates.js';
export * from './lib/_world.js';
export * from './lib/_npc.js';
export * from './lib/_parser.js';
export * from './lib/_commands.js';

// todo:
// export * from './lib/_transcript.js';
// export * from './lib/board.js';
// export * from './lib/hex-map.js';
// export * from './lib/image-map.js';
// export * from './lib/image-pane.js';
// export * from './lib/item-links.js';
// export * from './lib/node-map.js';
// export * from './lib/shipwise.js';
// export * from './lib/test-lib.js';
// export * from './lib/zone.js';
