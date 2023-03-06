export class TaskRunServiceValidationError extends Error {
  constructor(parameter: string, value: unknown) {
    super(`Invalid input: parameter ${parameter} cannot be ${value}`);
    this.name = "TaskRunServiceValidationError";
  }
}
