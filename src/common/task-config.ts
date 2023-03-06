import tl = require("azure-pipelines-task-lib/task");

const projectNameString = "System.TeamProject";
const buildId = "Build.BuildId";
const jobId = "System.JobId";
const systemAccess = "System.AccessToken";
const adoUrl = "System.CollectionUri";

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
