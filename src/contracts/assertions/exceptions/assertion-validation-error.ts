export class AssertionValidationError extends Error {
  innerException: Error;
  constructor(innerException: Error) {
    super("Invalid Assertion.");
    this.innerException = innerException;
    Object.setPrototypeOf(this, AssertionValidationError.prototype);
  }
}
