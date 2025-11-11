import {
  buildCurrencyString,
  buildCurrencySufixString,
  convertMainUnitToSubunit,
  convertSubunitToMainUnit,
} from './currency';

describe('Utils Currency', () => {
  describe('Currency unit conversions', () => {
    describe('integer conversions', () => {
      it('should convert subunit (cents) to mainunit (USD)', () => {
        expect(convertSubunitToMainUnit(100000)).toBe(1000);
      });

      it('should convert mainunit (USD) to subunit (cents)', () => {
        expect(convertMainUnitToSubunit(1000)).toBe(100000);
      });
    });

    describe('float conversions', () => {
      it('should convert subunit (cents) to mainunit (USD)', () => {
        expect(convertSubunitToMainUnit(100012)).toBe(1000.12);
      });

      it('should convert mainunit (USD) to subunit (cents)', () => {
        expect(convertMainUnitToSubunit(1000.12)).toBe(100012);
      });
    });
  });
  describe('Currency locale conversions', () => {
    it('should convert amount with cents to locale WITHOUT currency sufix', () => {
      expect(buildCurrencyString(10000)).toHaveLength(6);
    });

    it('should convert amount with cents to locale WITH currency sufix', () => {
      expect(buildCurrencySufixString(10000, 'USD', false)).toBe('100.00 USD');
    });

    it('should convert amount with cents to locale with thousand separator added', () => {
      expect(buildCurrencyString(100000)).toHaveLength(8);
    });

    it('should have space as thousand separators', () => {
      expect(buildCurrencyString(120000)).toBe('1 200.00');
    });
  });
});
