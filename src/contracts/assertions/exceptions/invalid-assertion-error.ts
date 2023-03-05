export class InvalidAssertionError extends Error {
  constructor(parameterName: string, value) {
    super(
      `Invalid Assertion. Parameter name ${parameterName} Parameter value: ${value}`
    );
    this.name = InvalidAssertionError.name;
  }
}
