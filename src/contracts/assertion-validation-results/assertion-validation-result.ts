export enum AssertionValidationResult {
  Succeeded,
  Failed,
}

export class AssertionValidationReport {
  taskId: string;
  taskName: string;
  result: AssertionValidationResult;
  messages: string[];
}
