export enum AssertionValidationResult {
  Succeeded,
  Failed,
}

export interface AssertionValidationReport {
  taskId: string;
  taskName: string;
  result: AssertionValidationResult;
  messages: string[];
}
