import { IsNullOrWhitespace } from "../common/string-utils";
import {
  AssertionValidationReport,
  AssertionValidationResult,
} from "../contracts/assertion-validation-results/assertion-validation-result";
import { Assertion } from "../contracts/assertions/assertion";
import { AssertionValidationError } from "../contracts/assertions/exceptions/assertion-validation-error";
import { AssertionValidationOrchestratorError } from "../contracts/assertions/exceptions/assertion-validation-orchestrator-error";
import { InvalidAssertionError } from "../contracts/assertions/exceptions/invalid-assertion-error";
import { NullAssertionError } from "../contracts/assertions/exceptions/null-assertion-error";
import { TaskRun } from "../contracts/task-runs/task-run";
import { ITaskRunService } from "../services/task-run-service";

export interface IAssertionValidationOrchestrator {
  checkAssertions(assertion: Assertion): Promise<AssertionValidationReport>;
}

export class AssertionValidationOrchestrator
  implements IAssertionValidationOrchestrator
{
  private taskRunService: ITaskRunService;

  constructor(taskRunService: ITaskRunService) {
    this.taskRunService = taskRunService;
  }

  public async checkAssertions(
    assertion: Assertion
  ): Promise<AssertionValidationReport> {
    try {
      this.validateAssertion(assertion);

      const taskRun = await this.taskRunService.getBuildTaskRun(
        assertion.projectName,
        assertion.buildId,
        assertion.jobId,
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

  private validateAssertion(assertion: Assertion): void {
    if (this.IsNullOrUndefined(assertion)) {
      throw new NullAssertionError();
    }
    this.validate([
      ["taskId", assertion.taskId, IsNullOrWhitespace],
      ["jobId", assertion.jobId, IsNullOrWhitespace],
      ["buildId", assertion.buildId, IsNullOrWhitespace],
      ["projectName", assertion.projectName, IsNullOrWhitespace],
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
      [
        "expectedTaskResult",
        assertion.expectedTaskResult,
        this.IsNullOrUndefined,
      ],
      ["expectedMessages", assertion.expectedMessages, this.IsNullOrUndefined],
    ]);
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

  private IsNullOrUndefined(obj: unknown) {
    return obj === undefined || obj === null;
  }

  private mapException(err: Error) {
    switch (err.name) {
      case InvalidAssertionError.name:
      case NullAssertionError.name:
        throw new AssertionValidationError(err);
      default:
        throw new AssertionValidationOrchestratorError(err);
    }
  }
}
