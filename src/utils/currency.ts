import isNumber from 'lodash/isNumber';

export const convertSubunitToMainUnit = (subUnitValue: number): number => subUnitValue / 100;

export const convertMainUnitToSubunit = (mainUnitValue: number): number => (
  Math.floor(mainUnitValue * 100)
);

const calculateFromCents = (amountOfCents) => amountOfCents / 100;

export const buildCurrencyString = (
  amountOfCents: number | undefined,
  hideDecimal = false,
  separatorThousands = ' ',
  separatorDecimals = '.',
): string | number => {
  if (Number.isNaN(amountOfCents) || !isNumber(amountOfCents)) {
    return '--';
  }
  return calculateFromCents(amountOfCents)
    .toLocaleString('en-GB', {
      minimumFractionDigits: hideDecimal ? 0 : 2,
    })
    .replace(/,/g, separatorThousands)
    .replace(/\./g, separatorDecimals);
};

export const buildCurrencySufixString = (
  amountOfCents: number | undefined,
  currency: string,
  hideDecimal = false,
): string => `${buildCurrencyString(amountOfCents, hideDecimal)} ${currency}`;
