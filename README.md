# Masky.js

📦 **Masky.js** – A lightweight (2.3 KB) and flexible JavaScript library for input masking. Add custom masks, prefixes, suffixes, and built-in CPF/CNPJ validation seamlessly.

---

## Features
- **Ultra lightweight**: Only 2.3 KB (1.5 KB gzipped).
- **Customizable**: Supports prefixes, suffixes, and flexible masks.
- **Built-in validations**: CPF and CNPJ validation included.
- **Easy to use**: Works with simple `data-mask` attributes in any input field.
- **Vanilla JS**: No dependencies required.

---

## Usage

Simply add a data-mask attribute to your input fields:

```html
<input type="text" data-mask="(99) 99999-9999" data-mask-prefix="+55 " />
<script src="dist/masky.min.js"></script>
```

**Validating CPF/CNPJ**
You can enable built-in validation by adding data-mask-validation:

```html
<input type="text" data-mask="999.999.999-99" data-mask-validation="cpf" />
<input type="text" data-mask="99.999.999/9999-99" data-mask-validation="cnpj" />
```

## Example

```html
<input type="text" data-mask="AAA-0000" />
<script src="dist/masky.min.js"></script>
```

## Contributing
We welcome contributions! Fork the repository, create a branch, and open a pull request.

## License
This project is licensed under the [MIT License](https://mit-license.org/).