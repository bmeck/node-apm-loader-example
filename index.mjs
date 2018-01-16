import __dirname from './dirname';
import {URL} from 'url';
const dirHref = `file://${__dirname}/`;
const testHref = `${dirHref}/test.mjs`;

export async function resolve(specifier, parentModuleURL, defaultResolver) {
  if (
    parentModuleURL !== testHref &&
    new URL(parentModuleURL).href.indexOf(dirHref) == 0) {
    return defaultResolver(specifier, parentModuleURL);
  }
  try {
    const overloadHref = new URL(
      `./overloads/${specifier}.mjs`,
      dirHref
    ).href;
    if (overloadHref.indexOf(dirHref) === 0) {
      return defaultResolver(
        overloadHref,
        dirHref
      );
    }
  } catch (e) {
  }
  return defaultResolver(specifier, parentModuleURL);
}
