/**
 * A `Brand` is a type that takes at minimum two type parameters. Given a base
 * type `Base` and some unique and arbitrary branding type `Branding`, it
 * produces a type based on but distinct from `Base`. The resulting branded
 * type is not directly assignable from the base type, and not mutually
 * assignable with another branded type derived from the same base type.
 *
 * Take care that the branding type is unique. Two branded types that share the
 * same base type and branding type are considered the same type! There are two
 * ways to avoid this.
 *
 * The first way is to supply a third type parameter, `ReservedName`, with a
 * string literal type that is not `__type__`, which is the default.
 *
 * The second way is to define a branded type in terms of its surrounding
 * interface, thereby forming a recursive type. This is possible because there
 * are no constraints on what the branding type must be. It does not have to
 * be a string literal type, even though it often is.
 *
 * @example
 * ```
 * type Path = Brand<string, 'path'>;
 * type UserId = Brand<number, 'user'>;
 * type DifferentUserId = Brand<number, 'user', '__kind__'>;
 * interface Post { id: Brand<number, Post> }
 * ```
 */
export type Brand<
  Base,
  Branding,
  ReservedName extends string = '__type__',
> = Base & {[K in ReservedName]: Branding} & {__witness__: Base};

/**
 * An `AnyBrand` is a branded type based on any base type branded with any
 * branding type. By itself it is not useful, but it can act as type constraint
 * when manipulating branded types in general.
 */
export type AnyBrand = Brand<unknown, any>;

/**
 * `BaseOf` is a type that takes any branded type `B` and yields its base type.
 */
export type BaseOf<B extends AnyBrand> = B['__witness__'];

/**
 * A `Brander` is a function that takes a value of some base type and casts
 * that value to a branded type derived from said base type. It can be thought
 * of as the type of a "constructor", in the functional programming sense of
 * the word.
 *
 * @example
 * ```
 * type UserId = Brand<number, 'user'>;
 * // A Brander<UserId> would take a number and return a UserId
 * ```
 */
export type Brander<B extends AnyBrand> = (underlying: BaseOf<B>) => B;

/**
 * A generic function that, when given some branded type, can take a value with
 * the base type of the branded type, and cast that value to the branded type.
 * It fulfills the contract of a `Brander`.
 *
 * At runtime, this function simply returns the value as-is.
 *
 * @param underlying The value with a base type, to be casted
 * @return The same underlying value, but casted
 * @example
 * ```
 * type UserId = Brand<number, 'user'>;
 * const UserId: Brander<UserId> = identity;
 * ```
 */
export function identity<B extends AnyBrand>(underlying: BaseOf<B>): B {
  return underlying as B;
}

/**
 * Produces a `Brander<B>`, given a brand type `B`. This simply returns
 * `identity` but relies on type inference to give the return type the correct
 * type.
 *
 * @return `identity`
 * @example
 * ```
 * type UserId = Brand<number, 'user'>;
 * const UserId = make<UserId>();
 * const myUserId = UserId(42);
 * ```
 */
export function make<B extends AnyBrand>(): Brander<B> {
  return identity;
}
