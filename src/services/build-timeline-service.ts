import { IBuildTimelineClient } from "../clients/build-timeline-client";
import { BuildTaskRun } from "../contracts/BuildTaskRun";


export interface IBuildTimelineService {
    getBuildTaskRun(projectName: string, buildId:string, jobId:string, taskId:string) : BuildTaskRun
}

export class BuildTimeLineService implements IBuildTimelineService {
    private buildTimelineClient: IBuildTimelineClient;

    constructor(buildTimelineClient: IBuildTimelineClient) {
        this.buildTimelineClient = buildTimelineClient;
    }

    getBuildTaskRun(projectName: string, buildId: string, jobId: string, taskId: string): BuildTaskRun {
        throw new Error("Method not implemented.");
    }

}