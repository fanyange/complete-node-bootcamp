// console.log(arguments);

// console.log(require('module').wrapper);

// module.exports
const C = require('./test-module-1');

const calc1 = new C();
console.log(calc1.multiply(64, 1024));

// exports
const { multiply } = require('./test-module-2');
console.log(multiply(5, 100));

// Caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
