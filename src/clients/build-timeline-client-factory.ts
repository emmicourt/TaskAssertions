/* eslint-disable @typescript-eslint/no-empty-function */
import * as vm from "azure-devops-node-api";
import {
  BuildTimelineClient,
  IBuildTimelineClient,
} from "./build-timeline-client";

export class BuildTimelineClientFactory {
  constructor() {}

  public async getBuildTimelineClient(
    adoUrl: string,
    token: string
  ): Promise<IBuildTimelineClient> {
    const authHandler = vm.getPersonalAccessTokenHandler(token);
    const vsoClient = new vm.WebApi(adoUrl, authHandler, undefined);
    const buildApi = await vsoClient.getBuildApi();

    return new BuildTimelineClient(buildApi);
  }
}
