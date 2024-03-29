import * as ba from "azure-devops-node-api/BuildApi";
import { Timeline } from "azure-devops-node-api/interfaces/BuildInterfaces";

export interface IBuildTimelineClient {
  getBuildTimeline(project: string, buildId: number): Promise<Timeline>;
}

export class BuildTimelineClient implements IBuildTimelineClient {
  private buildApi: ba.IBuildApi;

  constructor(buildApi: ba.IBuildApi) {
    this.buildApi = buildApi;
  }

  public async getBuildTimeline(
    project: string,
    buildId: number
  ): Promise<Timeline> {
    return await this.buildApi.getBuildTimeline(project, buildId);
  }
}
