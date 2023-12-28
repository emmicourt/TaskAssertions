export class TaskRunNotFoundError extends Error {
  constructor() {
    super("Error task run not found in build job.");
  }
}
