import {AnyBrand, identity, make} from '../src/index';

describe('identity', () => {
  it('returns the same value', () => {
    const input = {};

    expect(identity(input)).toBe(input);
  });
});

describe('make', () => {
  it('returns `identity`', () => {
    expect(make<AnyBrand>()).toBe(identity);
  });
});
