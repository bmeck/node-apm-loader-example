#!/usr/bin/env node
const child_process = require('child_process');
const assert = require('assert');
const path = require('path');
const fixture = name => path.join(__dirname, 'fixture', name);
{
  const child = child_process.spawnSync(process.execPath, [
    '--experimental-modules', '--loader', path.join(__dirname, '..'), fixture('call_readFile.mjs'), fixture('call_readFile.mjs')
  ]);
  assert.strictEqual(child.status, 0);
  assert.strictEqual(`${child.stdout}`, 'fs.readFile called\n');
}
{
  const child = child_process.spawnSync(process.execPath, [
    '--experimental-modules', fixture('call_readFile.mjs'), fixture('call_readFile.mjs')
  ]);
  assert.strictEqual(child.status, 0);
  assert.strictEqual(`${child.stdout}`, '');
}
{
  const child = child_process.spawnSync(process.execPath, [
    '--experimental-modules', '--loader', path.join(__dirname, '..'), fixture('use_foo_0.0.0.mjs')
  ]);
  assert.strictEqual(`${child.stdout}`, 'loaded foo@0.0.0\n');
  assert.strictEqual(child.status, 0);
}
{
  const child = child_process.spawnSync(process.execPath, [
    '--experimental-modules', '--loader', path.join(__dirname, '..'), fixture('use_foo_1.0.0.mjs')
  ]);
  assert.strictEqual(`${child.stdout}`, 'loaded foo@1.0.0\n');
  assert.strictEqual(child.status, 0);
}