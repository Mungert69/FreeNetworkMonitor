## Running Tests with nvm

The project’s `npm test` command depends on Node being provided by **nvm**. In new shell sessions the `npm` executable may be missing from `PATH`, which leads to errors such as `npm: command not found`. Load nvm before running tests:

```bash
source ~/.nvm/nvm.sh
npm test
```

This ensures the correct Node and NPM binaries are available and allows Vitest to run successfully. Repeat these commands whenever you open a fresh terminal or start a new chat session that needs to execute the test suite.
