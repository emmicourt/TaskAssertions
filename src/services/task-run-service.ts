import {
  Timeline,
  TimelineRecord,
} from "azure-devops-node-api/interfaces/BuildInterfaces";
import { IBuildTimelineClient } from "../clients/build-timeline-client";
import { IsNullOrWhitespace } from "../common/string-utils";
import { TaskRunServiceError } from "../contracts/task-runs/exceptions/task-run-service-error";
import { TaskRunServiceInputValidationError } from "../contracts/task-runs/exceptions/task-run-service-input-validation-error";
import { TaskRun } from "../contracts/task-runs/task-run";

export interface ITaskRunService {
  getBuildTaskRun(
    projectName: string,
    buildId: string,
    jobId: string,
    taskId: string
  ): Promise<TaskRun | undefined>;
}

export class BuildTaskRunService implements ITaskRunService {
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

      if (!taskRecord) {
        return undefined;
      }

      return this.mapTimelineToTaskRun(taskRecord, buildId);
    } catch (error) {
      throw new TaskRunServiceError(error.message);
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

  private validateInputParameters(
    inputs: [
      parameterName: string,
      parameterValue: unknown,
      rule: (value: unknown) => boolean
    ][]
  ): void {
    inputs.forEach(([name, value, rule]) => {
      if (rule(value)) {
        throw new TaskRunServiceInputValidationError(name, value);
      }
    });
  }
}
