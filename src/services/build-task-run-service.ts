import { IBuildTimelineClient } from "../clients/build-timeline-client";
import { BuildTaskRun } from "../contracts/build-task-run";

export interface IBuildTaskRunService {
  getBuildTaskRun(
    projectName: string,
    buildId: string,
    jobId: string,
    taskId: string
  ): BuildTaskRun;
}

export class BuildTaskRunService implements IBuildTaskRunService {
  private buildTimelineClient: IBuildTimelineClient;

  constructor(buildTimelineClient: IBuildTimelineClient) {
    this.buildTimelineClient = buildTimelineClient;
  }

  getBuildTaskRun(
    projectName: string,
    buildId: string,
    jobId: string,
    taskId: string
  ): BuildTaskRun {
    throw new Error("Method not implemented.");
  }
}
