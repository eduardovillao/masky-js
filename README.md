# Masky.js

[![Bundle Size](https://img.shields.io/bundlephobia/minzip/masky-js)](https://bundlephobia.com/package/masky-js)

📦 **Masky.js** — a tiny, dependency-free JavaScript library for input masking. At **~1.3 KB gzipped** it needs nothing more than a `<script>` tag and a `data-mask` attribute: no build step, no framework, no JavaScript to write.

---

## Perfect for static sites & AI-generated pages

Masky.js is **fully declarative** — you add masks with HTML attributes, not code. That makes it a natural fit for static sites (Astro, Eleventy, plain HTML) and for pages built by AI tools: an LLM can add a working mask with a single attribute, with nothing to import, bundle, or initialize.

Add the script, then describe your masks with attributes:

```
<script src="https://cdn.jsdelivr.net/npm/masky-js"></script>

data-mask             pattern — tokens: 0=digit  A=alphanumeric  S=letter  (rest = literal)
data-mask-prefix      text prepended       e.g. "R$ "
data-mask-suffix      text appended        e.g. " kg"
data-mask-reverse     "true" → fills right-to-left (currency)
data-mask-validation  "cpf" | "cnpj"       validates on blur

<input data-mask="(00) 00000-0000">
<input data-mask="000.000.000-00" data-mask-validation="cpf">
```

💡 Paste that cheat sheet into your AI assistant (v0, Cursor, Claude…) and let it wire the masks into your forms.

---

## Features

- **Tiny & dependency-free** — ~1.3 KB gzipped (~1.1 KB brotli), vanilla JS, runs anywhere.
- **Fully declarative** — configure everything through `data-*` attributes; no JS to write.
- **Automatic enhancements** — derives `inputmode`, `minlength` and `maxlength` from the mask.
- **Prefixes, suffixes and reverse (currency) masks.**
- **Built-in CPF & CNPJ validation** for Brazilian forms.

---

## Usage

**Basic**

```html
<input type="text" data-mask="(00) 00000-0000" />
<script src="https://cdn.jsdelivr.net/npm/masky-js"></script>
```

**Prefix & suffix**

```html
<input
    type="text"
    data-mask="000-000"
    data-mask-prefix="+55 "
    data-mask-suffix=" ext"
/>
```

**CPF / CNPJ validation**

```html
<input type="text" data-mask="000.000.000-00" data-mask-validation="cpf" />
<input type="text" data-mask="00.000.000/0000-00" data-mask-validation="cnpj" />
```

Validation runs on `blur` through the native Constraint Validation API (`setCustomValidity`), so errors surface like any other HTML5 form validation.

## Tokens

| Token | Matches           | Example       |
| ----- | ----------------- | ------------- |
| `0`   | Digits (0–9)      | `000` → `123` |
| `A`   | Letters or digits | `AAA` → `1AB` |
| `S`   | Letters only      | `SSS` → `abc` |

Any other character in the mask is treated as a literal (`.`, `-`, `/`, `(`, spaces, …).

## Installation

**🌐 CDN**

```html
<script src="https://cdn.jsdelivr.net/npm/masky-js/dist/masky.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/masky-js/dist/masky.min.js"></script>
```

**📦 npm**

```bash
npm install masky-js
```

```js
import "masky-js/dist/masky.min.js";
```

The script runs on page load and masks every `input[data-mask]` it finds.

## FAQ

**Does it work with React, Vue or Angular?**
Masky.js writes straight to the input's `value` and scans the DOM once on load, which clashes with frameworks that own the value and re-render it. It's built for static and server-rendered HTML. Inside a controlled React/Vue component, reach for a mask solution designed for that model.

**Are inputs added after page load masked?**
Not yet — Masky.js scans the page once on load, so inputs injected later (a modal, an SPA route) aren't picked up automatically.

## Contributing

Contributions are welcome — fork the repo, create a branch, and open a pull request.

## License

[MIT](https://mit-license.org/)
