import tl = require("azure-pipelines-task-lib/task");

const projectNameString = "System.TeamProject";
const buildId = "Build.BuildId";
const jobId = "System.JobId";

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
}
