import * as vm from "azure-devops-node-api";
import { BuildTimelineClient } from "./build-timeline-client";

export class BuildTimelineClientFactory {
    constructor() {}

    public async getBuildTimelineClient(adoUrl:string, token:string) : Promise<BuildTimelineClient> {
        let authHandler = vm.getPersonalAccessTokenHandler(token);
        let vsoClient = new vm.WebApi(adoUrl, authHandler, undefined);
        let buildApi = await vsoClient.getBuildApi();

        return new BuildTimelineClient(buildApi);
    }
}
