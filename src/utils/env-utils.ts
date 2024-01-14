import tl = require("azure-pipelines-task-lib/task");

const projectNameString = "SYSTEM_TEAMPROJECT";
const buildId = "BUILD_BUILDID";
const jobId = "SYSTEM_JOBID";
const systemAccess = "SYSTEM_ACCESSTOKEN";
const adoUrl = "SYSTEM_COLLECTIONURI";

export class TaskConfig {
  public getProjectName(): string | undefined {
    return tl.getVariable(projectNameString);
  }

  public getBuildId(): string | undefined {
    return tl.getVariable(buildId);
  }

  public getJobId(): string | undefined {
    return tl.getVariable(jobId);
  }

  public getSystemAccessToken(): string | undefined {
    return tl.getVariable(systemAccess);
  }

  public getAdoUrl(): string | undefined {
    return tl.getVariable(adoUrl);
  }
}
