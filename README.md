# Masky.js

📦 Masky.js – A compact and **high-performance JavaScript library for input masking**. Weighing only **1.3 KB** (gzip), it’s optimized for fast loading and ideal for any project requiring lightweight, flexible, and customizable input masks.

---

## Features
- **Super Lightweight:** Only **1.3 KB gzipped**, minimizing your app’s bundle size.
- **Automatic Enhancements:**
    - **inputmode support:** Dynamically adjusts for better mobile user experience.
    - **minlength and maxlength:** Automatically calculated based on the mask.
- **Built-in Validations:** Native support for CPF and CNPJ validation.
- **Flexible Masks:** Add custom masks with prefixes, suffixes, and dynamic formatting.
- **Ease of Use:** Just add data-mask and optional attributes—Masky.js does the rest.
- **Vanilla JS:** Works without any dependencies, making it adaptable to any environment.

---

## Usage

**Basic Example**

Add data-mask to your input fields, and the library will handle the rest:

```html
<input type="text" data-mask="(99) 99999-9999" />
<script src="dist/masky.min.js"></script>
```

**Adding Prefixes and Suffixes**

Add data-mask-prefix or data-mask-suffix to include additional characters:

```html
<input type="text" data-mask="000-000" data-mask-prefix="+55 " data-mask-suffix=" ext" />
```

**Validating CPF and CNPJ**

Use data-mask-validation for built-in validation of CPF and CNPJ:

```html
<input type="text" data-mask="999.999.999-99" data-mask-validation="cpf" />
<input type="text" data-mask="99.999.999/9999-99" data-mask-validation="cnpj" />
```

## Available Tokens

Masky.js provides the following tokens for creating masks:

| Token | Description           | Example Input | Example Mask |   |
|-------|-----------------------|---------------|--------------|---|
| 0     | Numeric digits only   | 123           | 000 → 123    |   |
| A     | Alphanumeric          | 1aB           | AAA → 1AB    |   |
| S     | Alphabetic characters | abc           | SSS → abc    |   |

## Why Masky.js?

- **Automatic Enhancements:** Input mode (`inputmode`) and field limits (`minlength` and `maxlength`) are calculated and applied automatically based on the mask.
- **Built for Performance:** With only 1.3 KB gzipped, it’s one of the most efficient libraries available.
- **Flexibility:** Perfect for any environment—websites, frameworks, or CMS integrations.
- **Ease of Integration:** Add `data-mask` to your inputs, and Masky.js takes care of formatting, validation, and user experience.

## Example

```html
<input type="text" data-mask="(99) 99999-9999" />
<input type="text" data-mask="000-000" data-mask-prefix="+55 " data-mask-suffix=" ext" />
<input type="text" data-mask="AAA-SSS-000" />
<script src="dist/masky.min.js"></script>
```

- No need to manually define inputmode or limits-—Masky.js handles them automatically.
- Add as much customization as needed with `data-mask-prefix` and `data-mask-suffix`.

## Installation

**Copy the File**

For now, download or copy the file directly from the /dist directory of the repository:

1.	Go to the `/dist` folder in this repository.
2.	Download or copy the `masky.min.js` file.
3.	Include it in your project:

```html
<script src="path/to/masky.min.js"></script>
```

**Via npm (Available Soon)**

**Via CDN (Available Soon)**

## Contributing
We welcome contributions! Fork the repository, create a branch, and open a pull request.

## License
This project is licensed under the [MIT License](https://mit-license.org/).
