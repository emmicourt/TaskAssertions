import {
  Timeline,
  TimelineRecord,
} from "azure-devops-node-api/interfaces/BuildInterfaces";
import { IBuildTimelineClient } from "../clients/build-timeline-client";
import { IsNullOrWhitespace } from "../common/string-utils";
import { TaskRunNotFoundError } from "../contracts/task-runs/exceptions/task-run-not-found-error";
import { TaskRunServiceError } from "../contracts/task-runs/exceptions/task-run-service-error";
import { TaskRunServiceValidationError } from "../contracts/task-runs/exceptions/task-run-service-input-validation-error";
import { TaskRun } from "../contracts/task-runs/task-run";

export interface ITaskRunService {
  getBuildTaskRun(
    projectName: string,
    buildId: string,
    jobId: string,
    taskId: string
  ): Promise<TaskRun | undefined>;
}

export class TaskRunService implements ITaskRunService {
  private buildTimelineClient: IBuildTimelineClient;

  constructor(buildTimelineClient: IBuildTimelineClient) {
    this.buildTimelineClient = buildTimelineClient;
  }

  async getBuildTaskRun(
    projectName: string,
    buildId: string,
    jobId: string,
    taskId: string
  ): Promise<TaskRun | undefined> {
    this.validateInputParameters([
      ["taskId", taskId, IsNullOrWhitespace],
      ["jobId", jobId, IsNullOrWhitespace],
      ["projectName", projectName, IsNullOrWhitespace],
      ["buildId", buildId, IsNullOrWhitespace],
    ]);
    try {
      const buildTimeline = await this.buildTimelineClient.getBuildTimeline(
        projectName,
        parseInt(buildId)
      );
      const taskRecord = this.getTaskTimelineRecord(
        buildTimeline,
        jobId,
        taskId
      );

      this.validateTaskRun(taskRecord);

      return this.mapTimelineToTaskRun(taskRecord, buildId);
    } catch (err) {
      this.mapException(err);
    }
  }

  private getTaskTimelineRecord(
    timeline: Timeline,
    jobId: string,
    taskId: string
  ): TimelineRecord | undefined {
    const record = timeline.records
      .filter((record) => record.parentId === jobId)
      .filter((record) => record.type === "Task")
      .filter((record) => record.task.id === taskId);

    return record[0];
  }

  private mapTimelineToTaskRun(
    timelineRecord: TimelineRecord,
    buildId: string
  ): TaskRun | undefined {
    return {
      taskId: timelineRecord.task.id,
      taskName: timelineRecord.task.name,
      buildId: buildId,
      jobId: timelineRecord.parentId,
      errorCount: timelineRecord.errorCount,
      warningCount: timelineRecord.warningCount,
    };
  }

  private validateTaskRun(timelineRecord: TimelineRecord): void {
    if (this.IsNullOrUndefined(timelineRecord)) {
      throw new TaskRunNotFoundError();
    }
  }

  private IsNullOrUndefined(obj: unknown) {
    return obj === undefined || obj === null;
  }

  private validateInputParameters(
    inputs: [
      parameterName: string,
      parameterValue: unknown,
      rule: (value: unknown) => boolean
    ][]
  ): void {
    inputs.forEach(([name, value, rule]) => {
      if (rule(value)) {
        throw new TaskRunServiceValidationError(name, value);
      }
    });
  }

  private mapException(err: Error) {
    switch (err.name) {
      case TaskRunServiceValidationError.name:
      case TaskRunNotFoundError.name:
        throw err;
      default:
        throw new TaskRunServiceError(err);
    }
  }
}
