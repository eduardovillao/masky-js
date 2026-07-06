---
paths:
  - "package.json"
  - ".github/workflows/**"
  - "dist/**"
---

## Build & Release

`dist/masky.min.js` is **committed to git on purpose** — it is the package's `main` entry and the file served over CDN (jsDelivr/unpkg). Never gitignore it and never hand-edit it; regenerate with `npm run build`.

Publishing is tag-driven, not merge-driven:

- Pushing a `v*` git tag triggers `.github/workflows/publish.yml`, which tests, builds, then runs `npm publish --provenance` (OIDC id-token — no npm token is stored).
- Bump `version` in `package.json` and commit it BEFORE tagging; the tag must match. A `v*` tag whose number differs from package.json publishes the wrong version.
- `test.yml` runs the suite on every push and PR to `main`.

The build minifies the single entry `src/masky.js` with Terser (`--toplevel` mangles top-level names — safe only because the file exports nothing). It is not multi-entry: a new source file won't be built until you add it to the `build` script.
