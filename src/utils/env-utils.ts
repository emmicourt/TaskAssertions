import tl = require("azure-pipelines-task-lib/task");
import process from "node:process";

export class EnvUtil {

  public getProjectName(): string | undefined {
    return process.env.SYSTEM_TEAMPROJECT ?? undefined; 
  }

  public getBuildId(): string | undefined {
    return process.env.BUILD_BUILDID ?? undefined; 
  }

  public getJobId(): string | undefined {
    return process.env.SYSTEM_JOBID ?? undefined;
  }

  public getSystemAccessToken(): string | undefined {
    const endpoint = tl.getEndpointAuthorization('SYSTEMVSSCONNECTION', false); 
    if(endpoint){
      return endpoint.parameters['AccessToken'] ?? undefined;
    }
    return undefined
  }

  public getAdoUrl(): string | undefined {
    return process.env.SYSTEM_COLLECTIONURI ?? undefined;
  }
}
