import * as fs from 'fs';
import {promisify} from 'util';
import util from 'util';
const promisify = util.promisify;
export * from 'fs';
// export {default} from 'fs';
export function readFile(...args) {
  console.log('reading file');
  return fs.readFile(...args);
}
Object.defineProperty(
  readFile, promisify.custom, {
    configurable: true,
    get() {
      const value = promisify(fs.readFile);
      Object.defineProperty(
        readFile, promisify.custom, {
          configurable: true,
          value
        });
      return value;
    }
  }
);
