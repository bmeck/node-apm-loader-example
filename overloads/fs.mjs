import fs from 'fs';
import util from 'util';
const promisify = util.promisify;
const exports = Object.create(fs, {
  readFile: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function readFile(...args) {
      exports.readFile = wrap(fs.readFile, args => console.log('fs.readFile called'));
      return passThrough(exports.readFile, this, args, new.target);
    },
  },
});
export default exports;
// Generic function to execute things before another
// if the function is intended to be promisified
// it will add util.promisify.custom
//
// @param {Function} fn - the function we want to insert behavior around
// @param {Function} before - the function to invoke before `fn`
// @param {Boolean} promisified - if `fn` has promisified behavior
// @return {Function}
function wrap(fn, before, promisified = false) {
  const wrapped = function() {
    before(arguments, this, new.target);
    passThrough(fn, this, arguments, new.target);
  };
  if (promisified === true) {
    Object.defineProperty(wrapped, promisify.custom, {
      configurable: true,
      get() {
        const promisified = promisify(fn);
        Object.defineProperty(wrapped, promisify.custom, {
          configurable: true,
          value: wrap(promisified, before, false),
        });
        return value;
      },
    });
  }
  return wrapped;
}
// Invokes or constructs a function depending on if it had a new.target
//
// @param {Function} fn
// @param {any} self - the `this` value provided
// @param {any[]} args - the `arguments` value provided
// @param {any} target - the `new.target` value provided
// @returns {any}
function passThrough(fn, self, args, target) {
  return target
    ? Reflect.construct(fn, args, target)
    : Reflect.apply(fn, self, args);
}
