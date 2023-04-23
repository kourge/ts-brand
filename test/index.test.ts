import {AnyBrand, BaseOf, identity, make} from '../src/index';

describe('identity', () => {
  it('returns the same value', () => {
    const input = {};

    expect(identity(input)).toBe(input);
  });
});

describe('make', () => {
  it('returns `identity`', () => {
    const brander = make<AnyBrand>();
    expect(brander).toBe(identity);
    expect(brander(42)).toBe(42);
  });
  it('returns `generator`', () => {
    function generator<B extends AnyBrand>(): BaseOf<B> {
      return 'generated';
    }
    const brander = make(generator);
    expect(brander).toBe(generator);
    expect(brander()).toBe('generated');
  });
});
