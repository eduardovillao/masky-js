/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Masky JS Library', () => {
  let container;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    // Reset modules to reload the script and trigger the "new inputMask()" execution
    vi.resetModules();
  });

  const loadScript = async () => {
    // We import the file. Since it executes "new inputMask()" at the bottom,
    // it will scan the current DOM for inputs.
    await import('../src/masky.js');
  };

  const createInput = (attributes = {}) => {
    const input = document.createElement('input');
    for (const [key, value] of Object.entries(attributes)) {
      input.setAttribute(key, value);
    }
    document.body.appendChild(input);
    return input;
  };

  const triggerInputEvent = (input, value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const triggerBlurEvent = (input) => {
    input.dispatchEvent(new Event('blur', { bubbles: true }));
  };

  describe('Mask Application', () => {
    it('should apply a simple numeric mask (000.000)', async () => {
      const input = createInput({ 'data-mask': '000.000' });
      await loadScript();

      triggerInputEvent(input, '123456');
      expect(input.value).toBe('123.456');
    });

    it('should apply a date mask (00/00/0000)', async () => {
      const input = createInput({ 'data-mask': '00/00/0000' });
      await loadScript();

      triggerInputEvent(input, '27012026');
      expect(input.value).toBe('27/01/2026');
    });

    it('should apply an alphanumeric mask (AAA-000)', async () => {
      const input = createInput({ 'data-mask': 'AAA-000' });
      await loadScript();

      triggerInputEvent(input, 'ABC1234'); // Extra char should be ignored
      expect(input.value).toBe('ABC-123');
    });

    it('should handle reverse masking (currency-like)', async () => {
      const input = createInput({ 
        'data-mask': '0.000.000,00', 
        'data-mask-reverse': 'true' 
      });
      await loadScript();

      triggerInputEvent(input, '123456');
      // Reverse mask logic is complex, checking expected behavior
      // 1 -> 0,01
      // 12 -> 0,12
      // 123 -> 1,23
      // 1234 -> 12,34
      // 12345 -> 123,45
      // 123456 -> 1.234,56
      expect(input.value).toBe('1.234,56');
    });
  });

  describe('Prefix and Suffix', () => {
    it('should add a prefix', async () => {
      const input = createInput({ 
        'data-mask': '000',
        'data-mask-prefix': 'R$ ' 
      });
      await loadScript();

      triggerInputEvent(input, '123');
      expect(input.value).toBe('R$ 123');
    });

    it('should add a suffix', async () => {
      const input = createInput({ 
        'data-mask': '000',
        'data-mask-suffix': ' USD' 
      });
      await loadScript();

      triggerInputEvent(input, '123');
      expect(input.value).toBe('123 USD');
    });

    it('should handle both prefix and suffix', async () => {
      const input = createInput({ 
        'data-mask': '00',
        'data-mask-prefix': '[', 
        'data-mask-suffix': ']' 
      });
      await loadScript();

      triggerInputEvent(input, '99');
      expect(input.value).toBe('[99]');
    });
  });

  describe('Validation', () => {
    describe('CPF Validation', () => {
      it('should mark valid CPF as valid', async () => {
        const input = createInput({ 
          'data-mask': '000.000.000-00', 
          'data-mask-validation': 'cpf' 
        });
        await loadScript();

        // 529.982.247-25 is a mathematically valid CPF
        triggerInputEvent(input, '52998224725');
        triggerBlurEvent(input);

        expect(input.validity.customError).toBe(false);
      });

      it('should mark invalid CPF as invalid', async () => {
        const input = createInput({ 
          'data-mask': '000.000.000-00', 
          'data-mask-validation': 'cpf' 
        });
        await loadScript();

        triggerInputEvent(input, '11111111111'); // Known invalid (all same digits)
        triggerBlurEvent(input);

        expect(input.validity.customError).toBe(true);
        expect(input.validationMessage).toContain('Invalid CPF');
      });
    });

    describe('CNPJ Validation', () => {
      it('should mark valid CNPJ as valid (Google Brasil)', async () => {
        const input = createInput({ 
          'data-mask': '00.000.000/0000-00', 
          'data-mask-validation': 'cnpj' 
        });
        await loadScript();

        // 06.990.590/0001-23
        triggerInputEvent(input, '06990590000123');
        triggerBlurEvent(input);

        expect(input.validity.customError).toBe(false);
      });

      it('should mark CNPJ with invalid check digits as invalid', async () => {
        const input = createInput({ 
          'data-mask': '00.000.000/0000-00', 
          'data-mask-validation': 'cnpj' 
        });
        await loadScript();

        // 06.990.590/0001-24 (last digit changed)
        triggerInputEvent(input, '06990590000124');
        triggerBlurEvent(input);

        expect(input.validity.customError).toBe(true);
        expect(input.validationMessage).toContain('Invalid CNPJ');
      });

      it('should invalidate repeated digits (blacklisted)', async () => {
        const input = createInput({ 
          'data-mask': '00.000.000/0000-00', 
          'data-mask-validation': 'cnpj' 
        });
        await loadScript();

        triggerInputEvent(input, '22222222222222');
        triggerBlurEvent(input);

        expect(input.validity.customError).toBe(true);
      });

      it('should strip non-numeric characters before validation', async () => {
         const input = createInput({ 
          'data-mask': '00.000.000/0000-00', 
          'data-mask-validation': 'cnpj' 
        });
        await loadScript();

        // Valid CNPJ but typed with some noise (which mask usually prevents, but if pasted or set directly)
        // 06.990.590/0001-23
        input.value = '06.990.590/0001-23'; // Simulating value already having format or noise
        triggerBlurEvent(input);

        expect(input.validity.customError).toBe(false);
      });
    });
    
    describe('MinLength', () => {
       it('should set minLength based on mask length', async () => {
        const input = createInput({ 'data-mask': '000' });
        await loadScript();
        
        // Mask length is 3
        triggerInputEvent(input, '1'); // Trigger logic to set attributes
        expect(input.minLength).toBe(3);
       });
       
       it('should report error if length is insufficient on blur', async () => {
         const input = createInput({ 'data-mask': '000' });
         await loadScript();
         
         triggerInputEvent(input, '12'); // Only 2 chars
         triggerBlurEvent(input);
         
         expect(input.validity.customError).toBe(true);
         expect(input.validationMessage).toContain('minimum number of characters');
       });
    });
  });

  describe('Token S — alphabetic only', () => {
    it('keeps letters and stops at the first digit', async () => {
      const input = createInput({ 'data-mask': 'SSS' });
      await loadScript();

      triggerInputEvent(input, 'ab1c');
      expect(input.value).toBe('ab');
    });
  });

  describe('inputMode derived from the mask', () => {
    it('is "numeric" when the mask is only digit tokens', async () => {
      const input = createInput({ 'data-mask': '000.000' });
      await loadScript();

      triggerInputEvent(input, '123456');
      expect(input.inputMode).toBe('numeric');
    });

    it('is "text" when the mask has non-digit tokens', async () => {
      const input = createInput({ 'data-mask': 'AAA-000' });
      await loadScript();

      triggerInputEvent(input, 'ABC123');
      expect(input.inputMode).toBe('text');
    });

    it('does not override an author-provided inputmode', async () => {
      const input = createInput({ 'data-mask': '000', inputmode: 'tel' });
      await loadScript();

      triggerInputEvent(input, '1');
      expect(input.inputMode).toBe('tel');
    });
  });

  describe('Length attributes', () => {
    it('derives maxLength from the mask length', async () => {
      const input = createInput({ 'data-mask': '000.000' });
      await loadScript();

      triggerInputEvent(input, '1');
      expect(input.maxLength).toBe(7);
    });

    it('includes prefix and suffix in the derived length', async () => {
      const input = createInput({
        'data-mask': '000',
        'data-mask-prefix': 'R$ ',
        'data-mask-suffix': ' x',
      });
      await loadScript();

      triggerInputEvent(input, '1');
      expect(input.maxLength).toBe(8);
    });

    it('does not override an author-provided maxlength', async () => {
      const input = createInput({ 'data-mask': '000.000', maxlength: '99' });
      await loadScript();

      triggerInputEvent(input, '1');
      expect(input.maxLength).toBe(99);
    });
  });

  describe('removeMask round-trip (prefix/suffix)', () => {
    it('does not duplicate the prefix/suffix across input events', async () => {
      const input = createInput({
        'data-mask': '000',
        'data-mask-prefix': 'R$ ',
        'data-mask-suffix': ' x',
      });
      await loadScript();

      triggerInputEvent(input, '12');
      expect(input.value).toBe('R$ 12 x');

      triggerInputEvent(input, 'R$ 123 x');
      expect(input.value).toBe('R$ 123 x');
    });
  });

  describe('Edge cases and regressions', () => {
    // Regression: reverse (currency) masks must not pin minLength to the full
    // mask length, or they reject short-but-valid values on blur.
    it('reverse mask accepts a short value without a minlength error', async () => {
      const input = createInput({
        'data-mask': '0.000.000,00',
        'data-mask-reverse': 'true',
      });
      await loadScript();

      triggerInputEvent(input, '123');
      triggerBlurEvent(input);
      expect(input.validity.customError).toBe(false);
    });

    // Regression: literal removal must not treat mask literals as regex syntax
    // (a special literal like "^" used to strip everything).
    it('treats regex-special mask literals as literals', async () => {
      const input = createInput({ 'data-mask': '00^00' });
      await loadScript();

      triggerInputEvent(input, '1234');
      expect(input.value).toBe('12^34');
    });

    // Characterizes current behavior: a delete is left untouched (early return),
    // so a deleted literal is not re-added.
    it('leaves a deleteContentBackward edit untouched', async () => {
      const input = createInput({ 'data-mask': '00/00' });
      await loadScript();

      triggerInputEvent(input, '1234');
      expect(input.value).toBe('12/34');

      input.value = '1234'; // user deleted the "/"
      input.dispatchEvent(
        new InputEvent('input', { bubbles: true, inputType: 'deleteContentBackward' })
      );
      expect(input.value).toBe('1234');
    });

    // Needs the reverse-mask redesign (planning): the leading-separator strip is
    // hardcoded to "." and breaks for masks using another thousands separator.
    it.todo('reverse mask should not leave an orphan non-dot separator');
  });
});
