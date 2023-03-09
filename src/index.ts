import tl = require("azure-pipelines-task-lib/task");
import { BuildTimelineClientFactory } from "./clients/build-timeline-client-factory";
import { TaskConfig } from "./common/task-config";
import { AssertionValidationResult } from "./contracts/assertion-validation-results/assertion-validation-result";
import { Assertion } from "./contracts/assertions/assertion";
import { AssertionValidationOrchestrator } from "./orchestrators/assertion-validation-orchestrator";
import { TaskRunService } from "./services/task-run-service";

export async function run(): Promise<void> {
  try {
    const taskId: string | undefined = tl.getInput("taskId", true);
    const expectedErrorCount: number | undefined = parseInt(
      tl.getInput("expectedErrorCount", false)
    );
    const expectedWarningCount: number | undefined = parseInt(
      tl.getInput("expectedWarningCount", false)
    );
    const expectedTaskResult = tl.getInput("expectedTaskResult", false);
    const expectedMessages = tl.getInput("expectedMessage", false);

    const taskConfig = new TaskConfig();
    const assertionOrchestrator = await initialize();

    const assertion: Assertion = {
      taskId: taskId,
      jobId: taskConfig.getJobId(),
      buildId: taskConfig.getBuildId(),
      projectName: taskConfig.getProjectName(),
      expectedErrorCount: expectedErrorCount,
      expectedWarningCount: expectedWarningCount,
      expectedMessages: expectedMessages.split(";"),
      expectedTaskResult: tl.TaskResult[expectedTaskResult],
    };
    const result = await assertionOrchestrator.checkAssertions(assertion);

    if (result.result == AssertionValidationResult.Succeeded) {
      tl.setResult(tl.TaskResult.Succeeded, "Pass. All assertions met.");
    }
    const meesages = result.messages.join(";");
    tl.setResult(tl.TaskResult.Failed, meesages);
  } catch (err) {
    if (err instanceof Error) {
      tl.setResult(tl.TaskResult.Failed, err.message);
    }
  }
}

async function initialize(): Promise<AssertionValidationOrchestrator> {
  const taskConfig = new TaskConfig();
  const adoUrl = taskConfig.getAdoUrl();
  const token = taskConfig.getSystemAccessToken();
  const buildTimelineClientFactory = new BuildTimelineClientFactory();
  const buildTimelineClient =
    await buildTimelineClientFactory.getBuildTimelineClient(adoUrl, token);
  const taskRunService = new TaskRunService(buildTimelineClient);
  return new AssertionValidationOrchestrator(taskRunService);
}

run();
