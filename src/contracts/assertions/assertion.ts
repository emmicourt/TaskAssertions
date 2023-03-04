import tl = require("azure-pipelines-task-lib/task");

export class Assertion {
    taskId: string;
    expectedMessages: string[];
    expectedErrorCount: number;
    expectedWarningCount: number;
    expectedTaskResult: tl.TaskResult;
}