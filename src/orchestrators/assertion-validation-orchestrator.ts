import { IsNullOrWhitespace } from "../common/string-utils";
import { TaskConfig } from "../common/task-config";
import {
  AssertionValidationReport,
  AssertionValidationResult,
} from "../contracts/assertion-validation-results/assertion-validation-result";
import { Assertion } from "../contracts/assertions/assertion";
import { AssertionValidationError } from "../contracts/assertions/exceptions/assertion-validation-error";
import { InvalidAssertionError } from "../contracts/assertions/exceptions/invalid-assertion-error";
import { NullAssertionError } from "../contracts/assertions/exceptions/null-assertion-error";
import { TaskRun } from "../contracts/task-runs/task-run";
import { ITaskRunService } from "../services/task-run-service";

export interface IAssertionValidationOrchestrator {
  checkAssertions(
    taskConfig: TaskConfig,
    assertion: Assertion
  ): Promise<AssertionValidationReport>;
}

export class AssertionValidationOrchestrator
  implements IAssertionValidationOrchestrator
{
  private taskRunService: ITaskRunService;

  constructor(taskRunService: ITaskRunService) {
    this.taskRunService = taskRunService;
  }

  public async checkAssertions(
    taskConfig: TaskConfig,
    assertion: Assertion
  ): Promise<AssertionValidationReport> {
    try {
      const projectName = taskConfig.getProjectName();
      const jobId = taskConfig.getJobId();
      const buildId = taskConfig.getBuildId();

      this.validate([
        ["taskId", assertion.taskId, IsNullOrWhitespace],
        [
          "expectedErrorCount",
          assertion.expectedErrorCount,
          this.IsNonNaturalNumber,
        ],
        [
          "expectedWarningCount",
          assertion.expectedWarningCount,
          this.IsNonNaturalNumber,
        ],
      ]);

      const taskRun = await this.taskRunService.getBuildTaskRun(
        projectName,
        buildId,
        jobId,
        assertion.taskId
      );

      return this.createTaskValidationResult(assertion, taskRun);
    } catch (err) {
      this.mapException(err);
    }
  }

  private createTaskValidationResult(
    assertion: Assertion,
    taskRun: TaskRun
  ): AssertionValidationReport {
    const taskValidationReport: AssertionValidationReport = {
      taskId: taskRun.taskId,
      taskName: taskRun.taskName,
      result: AssertionValidationResult.Succeeded,
      messages: [],
    };

    if (taskRun.errorCount !== assertion.expectedErrorCount) {
      taskValidationReport.messages.push("");
      taskValidationReport.result = AssertionValidationResult.Failed;
    }

    if (taskRun.warningCount !== assertion.expectedWarningCount) {
      taskValidationReport.messages.push("");
      taskValidationReport.result = AssertionValidationResult.Failed;
    }

    if (taskRun.taskResult !== assertion.expectedTaskResult) {
      taskValidationReport.messages.push("");
      taskValidationReport.result = AssertionValidationResult.Failed;
    }

    return taskValidationReport;
  }

  private validate(
    inputs: [
      parameterName: string,
      parameterValue: unknown,
      rule: (value: unknown) => boolean
    ][]
  ): void {
    inputs.forEach(([name, value, rule]) => {
      if (rule(value)) {
        throw new InvalidAssertionError(name, value);
      }
    });
  }

  private IsNonNaturalNumber(num: number) {
    if (num < 0 || num % 1 !== 0) {
      return true;
    }
    return false;
  }

  private mapException(err: Error) {
    switch (err.name) {
      case InvalidAssertionError.name:
        throw new AssertionValidationError(err);
      case NullAssertionError.name:
        throw new AssertionValidationError(err);
      default:
        throw err;
    }
  }
}
