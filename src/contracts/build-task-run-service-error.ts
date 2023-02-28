export class BuildTaskRunServiceError extends Error {
  constructor(message: string) {
    super(`Error getting build timeline. ${message}`);
    this.name = "BuildTaskRunServiceError";
  }
}
