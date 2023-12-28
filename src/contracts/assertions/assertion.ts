import tl = require("azure-pipelines-task-lib/task");

export interface Assertion {
  taskId: string;
  projectName: string;
  jobId: string;
  buildId: string;
  expectedMessages: string[];
  expectedErrorCount: number;
  expectedWarningCount: number;
  expectedTaskResult: tl.TaskResult;
}
