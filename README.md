# Example APM Loader

This loader overloads the `fs` module specifier to point to a new version with a different `readFile` implementation as an example for how to create tooling like APMs or mocking in ESM using loader hooks.

This loader can be used by passing in the `--experimental-loader` flag to `node`.

```sh
node --experimental-modules --experimental-loader ./index.mjs $MAIN
```

or

```sh
NODE_OPTIONS='--experimental-modules --experimental-loader ./index.mjs'
node $MAIN
```
