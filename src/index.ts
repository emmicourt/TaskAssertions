import tl = require("azure-pipelines-task-lib/task");
import { BuildTimelineClientFactory } from "./clients/build-timeline-client-factory";
import { TaskConfig } from "./utils/env-utils";
import { AssertionValidationResult } from "./contracts/assertion-validation-results/assertion-validation-result";
import { Assertion } from "./contracts/assertions/assertion";
import { AssertionValidationOrchestrator } from "./orchestrators/assertion-validation-orchestrator";
import { TaskRunService } from "./services/task-run-service";
import { IsNullOrWhitespace, parseEnum } from "./utils/string-utils";

export async function run(): Promise<void> {
  try {
    const taskConfig = new TaskConfig();
    const assertionOrchestrator: AssertionValidationOrchestrator =
      await initialize(taskConfig);
    const taskId: string | undefined = tl.getInputRequired("taskId");
    const expectedMessages: string[] =
      tl.getInput("expectedMessage", false)?.split(";") ?? [];

    const expectedTaskResultInput: string =
      tl.getInput("expectedTaskResult") ?? tl.TaskResult.Succeeded.toString();

    const expectedTaskResult = parseEnum(
      tl.TaskResult,
      expectedTaskResultInput
    );

    if (!expectedTaskResult) {
      throw new Error(`Invalid Input. Expected Task Result invalid.`);
    }

    const expectedErrorCount: number | undefined = parseInt(
      tl.getInput("expectedErrorCount", false) ?? "0"
    );

    const expectedWarningCount: number | undefined = parseInt(
      tl.getInput("expectedWarningCount", false) ?? "0"
    );

    const jobId = taskConfig.getJobId();

    if (!jobId || IsNullOrWhitespace(jobId)) {
      throw new Error(`Invalid Input. Parameter: JobId Value: ${jobId}`);
    }

    const buildId = taskConfig.getBuildId();

    if (!buildId || IsNullOrWhitespace(buildId)) {
      throw new Error(`Invalid Input. Parameter: BuildId Value: ${buildId}`);
    }

    const projectName = taskConfig.getProjectName();

    if (!projectName || IsNullOrWhitespace(projectName)) {
      throw new Error(
        `Invalid Input. Parameter: ProjectName Value: ${projectName}`
      );
    }

    const assertion: Assertion = {
      taskId: taskId,
      jobId: jobId,
      buildId: buildId,
      projectName: projectName,
      expectedErrorCount: expectedErrorCount,
      expectedWarningCount: expectedWarningCount,
      expectedMessages: expectedMessages,
      expectedTaskResult: expectedTaskResult,
    };
    const result = await assertionOrchestrator.checkAssertions(assertion);

    if (result?.result == AssertionValidationResult.Succeeded) {
      tl.setResult(tl.TaskResult.Succeeded, "Pass. All assertions met.");
    }

    const messages = result?.messages.join(";") ?? "";
    tl.setResult(tl.TaskResult.Failed, messages, true);
  } catch (err) {
    if (err instanceof Error) {
      tl.setResult(tl.TaskResult.Failed, err.message);
    }
  }
}

async function initialize(
  taskConfig: TaskConfig
): Promise<AssertionValidationOrchestrator> {
  const adoUrl = taskConfig.getAdoUrl();
  const token = taskConfig.getSystemAccessToken();

  if (!adoUrl || !token) {
    throw new Error(
      "Task failed to locate Azure DevOps url and create a token."
    );
  }

  const buildTimelineClientFactory = new BuildTimelineClientFactory();

  const buildTimelineClient =
    await buildTimelineClientFactory.getBuildTimelineClient(adoUrl, token);

  const taskRunService = new TaskRunService(buildTimelineClient);
  return new AssertionValidationOrchestrator(taskRunService);
}

run();
