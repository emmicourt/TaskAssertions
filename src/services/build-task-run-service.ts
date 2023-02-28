import {
  Timeline,
  TimelineRecord,
} from "azure-devops-node-api/interfaces/BuildInterfaces";
import { IBuildTimelineClient } from "../clients/build-timeline-client";
import { BuildTaskRunServiceError } from "../contracts/build-task-run-service-error";
import { BuildTaskRun } from "../contracts/build-task-run";
import { IsNullOrWhitespace } from "../common/string-utils";
import { BuildTaskRunServiceInputValidationError } from "../contracts/build-task-run-service-input-validation-error";

export interface IBuildTaskRunService {
  getBuildTaskRun(
    projectName: string,
    buildId: string,
    jobId: string,
    taskId: string
  ): Promise<BuildTaskRun | undefined>;
}

export class BuildTaskRunService implements IBuildTaskRunService {
  private buildTimelineClient: IBuildTimelineClient;

  constructor(buildTimelineClient: IBuildTimelineClient) {
    this.buildTimelineClient = buildTimelineClient;
  }

  async getBuildTaskRun(
    projectName: string,
    buildId: string,
    jobId: string,
    taskId: string
  ): Promise<BuildTaskRun | undefined> {
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
      throw new BuildTaskRunServiceError(error.message);
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
  ): BuildTaskRun | undefined {
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
        throw new BuildTaskRunServiceInputValidationError(name, value);
      }
    });
  }
}
