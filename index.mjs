import __dirname from './dirname';
import util from 'util';
const {promisify} = util;
import fs from 'fs';
const asyncStat = promisify(fs.stat);
import url from 'url';
const {URL} = url;
const dirHref = `file://${__dirname}/`;
const overloadsHref = `${dirHref}overloads/`;

export async function resolve(specifier, parentModuleURL, defaultResolver) {
  if (
    new URL(parentModuleURL).href.indexOf(overloadsHref) == 0) {
    return defaultResolver(specifier, parentModuleURL);
  }
  try {
    const overloadUrl = new URL(
      `./${specifier}.mjs`,
      overloadsHref
    );
    if (overloadUrl.href.indexOf(overloadsHref) === 0) {
      await asyncStat(overloadUrl);
      return defaultResolver(
        overloadUrl.href,
        dirHref
      );
    }
  } catch (e) {
  }
  return defaultResolver(specifier, parentModuleURL);
}
