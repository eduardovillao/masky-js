---
paths:
  - "package.json"
  - ".github/workflows/**"
  - "dist/**"
  - "webpack.config.js"
---

## Build & Release

`dist/masky.min.js` is **committed to git on purpose** — it is the package's `main` entry and the file served over CDN (jsDelivr/unpkg). Never gitignore it and never hand-edit it; regenerate with `npm run build`.

Publishing is tag-driven, not merge-driven:

- Pushing a `v*` git tag triggers `.github/workflows/publish.yml`, which tests, builds, then runs `npm publish --provenance` (OIDC id-token — no npm token is stored).
- Bump `version` in `package.json` and commit it BEFORE tagging; the tag must match. A `v*` tag whose number differs from package.json publishes the wrong version.
- `test.yml` runs the suite on every push and PR to `main`.

Webpack auto-discovers an entry for every `src/*.js`, so adding a source file silently produces a new published `dist/<name>.min.js` bundle.
