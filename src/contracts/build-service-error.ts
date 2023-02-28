export class BuildTaskRunServiceError extends Error {
  constructor(message: string) {
    super(`BuildTaskRunServiceError: error getting build timeline. ${message}`);
    this.name = "BuildTaskRunServiceError";
  }
}
