export class TaskRunServiceError extends Error {
  innerException: Error;
  constructor(innerException: Error) {
    super("Error.");
    this.innerException = innerException;
  }
}
