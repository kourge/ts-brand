import {AnyBrand, Brand, identity, make} from '../src/index';

describe('identity', () => {
  it('returns the same value', () => {
    const input = {};

    expect(identity(input)).toBe(input);
  });
});

describe('make', () => {
  type PositiveNumber = Brand<number, 'positive'>;

  it('returns `identity` when no validator is provided', () => {
    expect(make<AnyBrand>()).toBe(identity);
  });

  it('uses the validator when one is provided with explicit validator types and an implicit brand type', () => {
    const isPositive = (value: number): asserts value is PositiveNumber => {
      if (value <= 0) {
        throw new Error(`Non-positive: ${value}`);
      }
    };
    const brand = make(isPositive);

    expect(() => brand(-1)).toThrow('Non-positive: -1');
    expect(brand(1)).toEqual(1);
  });

  it('utilizes the validator when one is provided with implicit validator types and an explicit brand type', () => {
    const brand = make<PositiveNumber>((value) => {
      if (value <= 0) {
        throw new Error(`Non-positive: ${value}`);
      }
    });

    expect(() => brand(-1)).toThrow('Non-positive: -1');
    expect(brand(1)).toEqual(1);
  });
});
