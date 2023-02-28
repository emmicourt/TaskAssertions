import {
  Timeline,
  TimelineRecord,
} from "azure-devops-node-api/interfaces/BuildInterfaces";
import { IBuildTimelineClient } from "../clients/build-timeline-client";
import { BuildTaskRun } from "../contracts/build-task-run";

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
    const buildTimeline = await this.buildTimelineClient.getBuildTimeline(
      projectName,
      parseInt(buildId)
    );
    const taskRecord = this.getTaskTimelineRecord(buildTimeline, jobId, taskId);

    return this.mapTimelineToTaskRun(taskRecord, buildId);
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
}
