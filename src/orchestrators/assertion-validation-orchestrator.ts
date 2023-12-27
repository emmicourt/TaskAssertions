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
import { TaskRunNotFoundError } from "../contracts/task-runs/exceptions/task-run-not-found-error";
import { TaskRun } from "../contracts/task-runs/task-run";
import { ITaskRunService } from "../services/task-run-service";
import tl = require("azure-pipelines-task-lib/task");

export interface IAssertionValidationOrchestrator {
  checkAssertions(assertion: Assertion): Promise<AssertionValidationReport | undefined>;
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
  ): Promise<AssertionValidationReport | undefined> {
    try {
      this.validateAssertion(assertion);

      const taskRun = await this.taskRunService.getBuildTaskRun(
        assertion.projectName,
        assertion.buildId,
        assertion.jobId,
        assertion.taskId
      );

      if(!taskRun){
        throw new TaskRunNotFoundError();
      }

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
      taskValidationReport.messages.push(
        `Expected error count: ${assertion.expectedErrorCount} Recieved: ${taskRun.errorCount}`
      );
      taskValidationReport.result = AssertionValidationResult.Failed;
    }

    if (taskRun.warningCount !== assertion.expectedWarningCount) {
      taskValidationReport.messages.push(
        `Expected warning count: ${assertion.expectedWarningCount} Recieved: ${taskRun.warningCount}`
      );
      taskValidationReport.result = AssertionValidationResult.Failed;
    }

    if (taskRun.taskResult !== assertion.expectedTaskResult) {
      taskValidationReport.messages.push(
        `Expected task result: ${assertion.expectedTaskResult} Recieved: ${taskRun.taskResult}`
      );
      taskValidationReport.result = AssertionValidationResult.Failed;
    }

    return taskValidationReport;
  }

  private validateAssertion(assertion: Assertion): void {
    if (!assertion) {
      throw new NullAssertionError();
    }

    if(IsNullOrWhitespace(assertion.taskId)){
      throw new InvalidAssertionError("taskId", assertion.taskId);
    }
    if(IsNullOrWhitespace(assertion.jobId)){
      throw new InvalidAssertionError("jobId", assertion.jobId);
    }
    if(IsNullOrWhitespace(assertion.projectName)){
      throw new InvalidAssertionError("projectName", assertion.projectName);
    }
    if(this.IsNonNaturalNumber(assertion.expectedErrorCount)){
      throw new InvalidAssertionError("expectedErrorCount", assertion.expectedErrorCount);
    }
    if(this.IsNonNaturalNumber(assertion.expectedWarningCount)){
      throw new InvalidAssertionError("expectedWarningCount", assertion.expectedWarningCount);
    }
    if(Object.keys(tl.TaskResult).indexOf(assertion.expectedTaskResult.toString()) === -1){
      throw new InvalidAssertionError("expectedTaskResult", assertion.expectedTaskResult);
    }
    if(!assertion.expectedMessages){
      throw new InvalidAssertionError("expectedMessages", assertion.expectedMessages)
    }
  }

  private IsNonNaturalNumber(value: number):boolean{
    if (value < 0 || value % 1 !== 0) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private IsValidEnum(value: any, enumType: any):boolean{
    if(value in enumType ){
      return true;
    }
    return false;
  }

  private mapException(err: Error): void {
    switch (true) {
      case err instanceof InvalidAssertionError:
      case err instanceof NullAssertionError:
        throw new AssertionValidationError(err);
      default:
        throw new AssertionValidationOrchestratorError(err);
    }
  }
}
