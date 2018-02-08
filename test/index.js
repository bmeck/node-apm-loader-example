#!/usr/bin/env node
const child_process = require('child_process');
const assert = require('assert');

const path = require('path');
const fixture = path.join(__dirname, 'fixture', 'call_readFile.mjs');
const child = child_process.spawn(process.execPath, [
  '--experimental-modules', '--loader', path.join(__dirname, '..'), fixture, fixture
]);
const stdout = [];
child.stdout.on('data', _ => stdout.push(_));
child.on('exit', (code, signal) => {
  const stdoutString = `${Buffer.concat(stdout)}`;
  assert.strictEqual(stdoutString, 'fs.readFile called\n');
  assert.strictEqual(code, 0);
});