import __dirname from './dirname.js';
import util from 'util';
const {promisify} = util;
import fs from 'fs';
//const asyncStat = promisify(fs.stat);
const asyncReadFile = promisify(fs.readFile);
import url from 'url';
const {URL} = url;
const dirHref = `file://${__dirname}/`;
const overloadsHref = `${dirHref}overloads/`;

/* eslint-disable no-console */

import {pathToFileURL} from 'url';
const baseURL = pathToFileURL(process.cwd()).href;

// you can do any global mutation here
// setup async_hooks etc.
console.error('initializing loader... (do setup here)');

// this will find the package.json URL associated with a given file URL
const grabPackage = async (url) => {
  try {
    return JSON.parse(
      await asyncReadFile(new URL('./package.json', url ? url : baseURL)));
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
  const parent = new URL('../', url);
  if (parent.href === url) {
    return undefined;
  }
  return grabPackage(parent.href);
}

const skipPackageSearch = new Set(['fs']);
const overloads = {
  __proto__: null,
  fs () {
    return new URL(
      './fs.mjs',
      overloadsHref
    ).href;
  },
  foo ({url: resolved}, pkg) {
    if (pkg.version === '0.0.0') {
      return new URL(
        './foo@0.0.0.mjs',
        overloadsHref
      ).href;
    } if (pkg.version === '1.0.0') {
      return new URL(
        './foo@1.0.0.mjs',
        overloadsHref
      ).href;
    } else {
      return resolved;
    }
  }
}
export async function resolve (specifier, context, defaultResolver) {
  //console.log(`specifier: ${specifier}`, context);
  const {parentURL = null} = context;
  const url = parentURL || baseURL;
  if (new URL(url).href.indexOf(overloadsHref) == 0) {
    return defaultResolver(specifier, url);
  }
  try {
    const overload = overloads[specifier];
    if (overload) {
      if (skipPackageSearch.has(specifier)) {
        return {url: parentURL ? new URL(overload(), parentURL).href : new URL(overload()).href};
      } else {
        const resolved = await defaultResolver(
          specifier,
          context,
          parentURL
        );
        const pkg = await grabPackage(resolved.url);
        return {url: overload(resolved, pkg), parentURL};
      }
    }
  } catch (e) {
    console.trace(e);
  }
  return defaultResolver(specifier, context, parentURL);
}
