import { TaskResult } from "azure-pipelines-task-lib";
import { BuildTaskRunIssue } from "./build-task-run-issue";
import { BuildTaskRunLog } from "./build-task-run-log";

export class BuildTaskRun {
  taskId: string;
  taskName: string;
  buildId: string;
  jobId: string;
  attempt?: number;
  errorCount: number;
  warningCount: number;
  taskResult?: TaskResult;
  logs?: BuildTaskRunLog;
  Issues?: BuildTaskRunIssue[];
}
