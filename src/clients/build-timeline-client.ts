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
    buildId: number,
    numRetry = 1
  ): Promise<Timeline> {
    return this.retry(
      numRetry,
      await this.buildApi.getBuildTimeline(project, buildId)
    );
  }

  private retry(numRetry: number, fn): unknown {
    return new Promise(fn).catch((error) =>
      numRetry > 0 ? this.retry(numRetry - 1, fn) : Promise.reject(error)
    );
  }
}
