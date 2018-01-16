# Example APM Loader

This loader overloads the `fs` module specifier to point to a new version with a different `readFile` implementation as an example for how to create tooling like APMs or mocking in ESM using loader hooks.

This loader can be used by passing in the `--loader` flag to `node`.

Feel free to play with `sandbox.mjs` by running:

```sh
node --experimental-modules --loader ./index.mjs sandbox.mjs
```
