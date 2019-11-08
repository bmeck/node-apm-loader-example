#!/usr/bin/env node
'use strict';

/* eslint-disable no-console */

const child_process = require('child_process');
const assert = require('assert');
const path = require('path');

const fixture = name => path.join(__dirname, 'fixture', name);
const shortFixture = name => `...${fixture(name).split('/').slice(4).join('/')}`;
const args = [
  '--experimental-modules',
  '--no-warnings',
];
const loaderArgs = [
  '--experimental-loader',
  path.join(__dirname, '../index.mjs'),
]
const f = fixture('call_readFile.mjs');

const tests = [
  function (n) {
    console.log(`${n}. testing no loader on ${shortFixture('call_readFile.mjs')}`);
    const child = child_process.spawnSync(process.execPath, args.concat(f, f));

    assert.strictEqual(`${child.stderr}`, '');
    assert.strictEqual(`${child.stdout}`, '');
    assert.strictEqual(child.status, 0);
  },
  function (n) {
    console.log(`${n}. testing on ${shortFixture('call_readFile.mjs')}`);
    const child = child_process.spawnSync(process.execPath, args.concat(loaderArgs, f, f));

    assert.strictEqual(`${child.stderr}`, 'initializing loader... (do setup here)\n');
    assert.strictEqual(`${child.stdout}`, 'fs.readFile called\n');
    assert.strictEqual(child.status, 0);
  },
  function (n) {
    console.log(`${n}. testing ${shortFixture('use_foo_0.0.0.mjs')}`);
    const child = child_process.spawnSync(process.execPath, args.concat(loaderArgs, fixture('use_foo_0.0.0.mjs')));
    assert.strictEqual(`${child.stderr}`, 'initializing loader... (do setup here)\n');
    assert.strictEqual(`${child.stdout}`, 'loaded foo@0.0.0\n');
    assert.strictEqual(child.status, 0);
  },
  function (n) {
    console.log(`${n}. testing ${shortFixture('use_foo_1.0.0.mjs')}`);
    const child = child_process.spawnSync(process.execPath, args.concat(loaderArgs, fixture('use_foo_1.0.0.mjs')));
    assert.strictEqual(`${child.stderr}`, 'initializing loader... (do setup here)\n');
    assert.strictEqual(`${child.stdout}`, 'loaded foo@1.0.0\n');
    assert.strictEqual(child.status, 0);
  }
];

let pass = 0;
let test = 1;
tests.forEach(f => {
  try {
    f(test++);
    pass += 1;
  } catch (e) {
    console.error(e);
  }
});

console.log(`passed ${pass}`);
