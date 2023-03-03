import { TaskResult } from "azure-pipelines-task-lib";
import { TaskRunIssue } from "./task-run-issue";
import { TaskRunLog } from "./task-run-log";

export class TaskRun {
  taskId: string;
  taskName: string;
  buildId: string;
  jobId: string;
  attempt?: number;
  errorCount: number;
  warningCount: number;
  taskResult?: TaskResult;
  logs?: TaskRunLog;
  Issues?: TaskRunIssue[];
}
