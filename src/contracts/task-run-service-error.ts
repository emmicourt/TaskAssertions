export class TaskRunServiceError extends Error {
  constructor(message: string) {
    super(`Error getting build timeline. ${message}`);
    this.name = "TaskRunServiceError";
  }
}
