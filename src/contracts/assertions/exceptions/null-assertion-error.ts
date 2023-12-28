export class NullAssertionError extends Error {
  constructor() {
    super("Invalid Assertion. Assertion cannot be null or undefined.");
    Object.setPrototypeOf(this, NullAssertionError.prototype);
  }
}
