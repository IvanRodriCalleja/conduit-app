import generateUid from './generateUid';

describe('generateUid', () => {
  it('generates random string of default length', () => {
    expect(generateUid()).toHaveLength(8);
  });

  it('generates random string of given length', () => {
    expect(generateUid('', 12)).toHaveLength(12);
  });

  it('generates random string that consists of given prefix', () => {
    const prefix = 'testHash';
    const hashLength = 8;
    const prefixSeparatorLenght = 1; // prefix is just "-"

    expect(generateUid(prefix, hashLength).indexOf(prefix)).toBeGreaterThan(-1);
    expect(generateUid(prefix, hashLength).indexOf('-')).toBeGreaterThan(-1);
    expect(generateUid(prefix, hashLength)).toHaveLength(
      prefix.length + hashLength + prefixSeparatorLenght,
    );
  });

  it('generates random string that consists of custom prefix separator', () => {
    expect(generateUid('somePrefix', 8, '_').indexOf('_')).toBeGreaterThan(-1);
  });
});
