export class AssertionValidationOrchestratorError extends Error {
  innerException: Error;
  constructor(innerException: Error) {
    super("An internal error has occured.");
    this.innerException = innerException;
    this.name = AssertionValidationOrchestratorError.name;
  }
}
