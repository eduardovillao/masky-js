---
paths:
  - "test/**"
  - "**/*.test.js"
  - "src/**"
---

## Testing

Tests run in vitest under the `jsdom` environment, set per-file via the `@vitest-environment jsdom` docblock at the top of the test — there is no vitest config file.

`src/masky.js` exports nothing; importing it runs `new inputMask()` as a side effect, and the instance scans the DOM for `input[data-mask]` **once**, at that moment. Tests are built around this:

- Create the inputs FIRST (append `input[data-mask]` to `document.body`), THEN `await import('../src/masky.js')` so the one-time scan sees them.
- `beforeEach` calls `vi.resetModules()` so each test re-imports and re-instantiates against a fresh DOM. Drop it and the module stays cached — later tests' inputs are never wired up and assertions pass/fail for the wrong reason.
- You cannot `import { inputMask }` and `new` it — it isn't exported. Exercise behavior by dispatching DOM events, not by calling methods.
- Masking fires on the `input` event; CPF/CNPJ and minlength validation fire on `blur`. A test that only triggers `input` never runs validation.
