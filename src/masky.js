class inputMask {
  constructor() {
    this.inputs = null;
    this.tokens = {
      '0': {
        validateRule: /\d/,
      },
      'A': {
        validateRule: /[a-zA-Z0-9]/,
      },
      'S': {
        validateRule: /[a-zA-Z]/,
      },
    };
    this.init();
  }

  init() {
    if (document.readyState !== 'complete') {
      window.addEventListener('load', this.init.bind(this));
      return;
    }

    this.getInput();
  }

  getInput() {
    this.inputs = document.querySelectorAll('input[data-mask]');
    this.inputs.forEach((input) => {
      input.addEventListener('input', this.maskInput.bind(this));
      input.addEventListener('blur', this.validateInput.bind(this));
    });
  }

    setInputLength(input, mask, prefix = '', suffix = '') {
        if(input.hasAttribute('minlength') && input.hasAttribute('maxlength')) {
            return;
        }

        const maskLength = mask.length + (prefix?.length || 0) + (suffix?.length || 0);
        if(!input.hasAttribute('minlength')) {
            input.minLength = maskLength;
        }

        if(!input.hasAttribute('maxlength')) {
            input.maxLength = maskLength;
        }
    }

  maskInput(event) {
    const input = event.target;
    input.setCustomValidity('');

    if (event.inputType === 'deleteContentBackward') {
      return;
    }

    const mask = input.dataset.mask;
    const value = input.value;
    const prefix = input.dataset.maskPrefix;
    const suffix = input.dataset.maskSuffix;

        this.setInputLength(input, mask, prefix, suffix);

    const unmaskedValue = this.removeMask(mask, value, prefix, suffix);
    const isReverse = input.dataset.maskReverse === 'true';
    const maskedValue = this.applyMask(
      unmaskedValue,
      mask,
      isReverse,
      prefix,
      suffix
    );

    input.value = maskedValue;
    input.checkValidity();
  }

  removeMask(mask, value, prefix, suffix) {
    if (!mask || !value) {
      return value;
    }

    if (prefix) {
      value = value.replace(prefix, '');
    }

    if (suffix) {
      value = value.replace(suffix, '');
    }

    const allowTokens = Object.keys(this.tokens);
    const allowTokensRegex = new RegExp(`[${allowTokens.join('')}]`, 'g');
    const maskLiteralsToRemove = mask.replace(allowTokensRegex, '');
    return value.replace(new RegExp(`[${maskLiteralsToRemove}]`, 'g'), '');
  }

  applyMask(unmaskedValue, mask, isReverse, prefix, suffix) {
    if (!unmaskedValue) {
      return unmaskedValue;
    }

    let maskedValue = '';
    let valueIndex = 0;
    let maskChars = mask.split('');

    if (isReverse) {
      unmaskedValue = unmaskedValue.split('').reverse().join('');
      maskChars = maskChars.reverse();
    }

    for (let i = 0; i < maskChars.length; i++) {
      if (this.tokens[maskChars[i]]) {
        const token = this.tokens[maskChars[i]];
        if (
          new RegExp(token.validateRule).test(
            unmaskedValue[valueIndex]
          ) &&
          unmaskedValue[valueIndex]
        ) {
          maskedValue += unmaskedValue[valueIndex];
          valueIndex++;
        } else {
          break;
        }
      } else {
        maskedValue += maskChars[i];
      }
    }

    if (isReverse) {
      maskedValue = maskedValue.split('').reverse().join('');
      maskedValue = maskedValue.startsWith('.')
        ? maskedValue.substring(1)
        : maskedValue;
    }

    if (prefix) {
      maskedValue = prefix + maskedValue;
    }

    if (suffix) {
      maskedValue = maskedValue + suffix;
    }

    return maskedValue;
  }

  validateInput(event) {
    const input = event.target;
    const value = input.value;
    const currentLength = value.length;
    const minLength = input.minLength;
    const validationMethod = input.dataset.maskValidation || null;
    if (currentLength > 0 && currentLength < minLength) {
      const defaultMessage = `The minimum number of characters required is ${minLength}. Please complete the field.`;
      input.setCustomValidity(defaultMessage);
      input.reportValidity();
      return;
    }

    const validationMethods = {
      cpf: this.isValidCPF,
      cnpj: this.isValidCNPJ,
    };

    if (value && validationMethod && validationMethods[validationMethod]) {
      const isValid = validationMethods[validationMethod](value);
      if (!isValid) {
        const defaultMessage = `Invalid ${validationMethod.toUpperCase()}. Please enter a valid value.`;
        input.setCustomValidity(defaultMessage);
        input.reportValidity();
        return;
      }
    }

    input.setCustomValidity('');
  }

  isValidCPF(cpf) {
    const sanitizedCPF = cpf.replace(/[^\d]+/g, '');
    if (sanitizedCPF.length !== 11 || /^(\d)\1{10}$/.test(sanitizedCPF)) {
      return false;
    }

    for (
      let verifierPosition = 9;
      verifierPosition < 11;
      verifierPosition++
    ) {
      let sumOfProducts = 0;

      for (
        let digitIndex = 0;
        digitIndex < verifierPosition;
        digitIndex++
      ) {
        const digit = parseInt(sanitizedCPF[digitIndex]);
        const weight = verifierPosition + 1 - digitIndex;
        sumOfProducts += digit * weight;
      }

      const expectedVerifier = ((sumOfProducts * 10) % 11) % 10;

      const actualVerifier = parseInt(sanitizedCPF[verifierPosition]);
      if (actualVerifier !== expectedVerifier) {
        return false;
      }
    }

    return true;
  }

  isValidCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
      return false;
    }

    const calculateDigit = (base, positions) => {
      let sum = 0;
      for (let i = 0; i < base.length; i++) {
        sum += base[i] * positions[i];
      }
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const positions1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const positions2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const baseCNPJ = cnpj.slice(0, 12);
    const digit1 = calculateDigit(baseCNPJ, positions1);
    const digit2 = calculateDigit(baseCNPJ + digit1, positions2);

    return cnpj === baseCNPJ + digit1.toString() + digit2.toString();
  }
}

new inputMask();
