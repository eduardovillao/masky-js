# Masky.js

Zero-dependency vanilla-JS input-masking library, published to npm as `masky-js`. The whole library is **one file** — `src/masky.js` — a single `inputMask` class that is **self-instantiated at the bottom** and driven entirely by HTML `data-mask*` attributes (**no JS API, nothing exported**). Usage docs live in `README.md`.

Size is the whole point (**~1.6 KB gzipped**). Weigh every byte before adding code — prefer the smallest thing that works over the general one.

## Commands

```bash
npx vitest run     # run tests — there is NO `npm test` script
npm run build      # webpack + esbuild → dist/masky.min.js
```

## Conventions (`.claude/rules/`)

- `testing.md` — how the side-effect module is tested (jsdom + `vi.resetModules()`).
- `release.md` — tag-driven npm publish; `dist/` is a committed artifact.
