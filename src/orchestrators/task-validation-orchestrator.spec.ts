import { Assertion } from "../contracts/assertions/assertion";
import { TaskRun } from "../contracts/task-runs/task-run";
import { TaskValidationOrchestrator } from "./task-validation-orchestrator";
import tl = require("azure-pipelines-task-lib/task");
import { TaskConfig } from "../common/task-config";
import { TaskValidationResult } from "../contracts/task-validation-results/task-validation-result";


describe("TaskValidationOrchestrator logical tests", () => {
    const getBuildTaskRun = jest.fn((): Promise<TaskRun | undefined> => 
        Promise.resolve(createTaskRun()));

    const taskRunServiceMock = jest.fn().mockImplementation(() => {
        return {
            getBuildTaskRun : getBuildTaskRun
        };
    });
    const taskRunService = new taskRunServiceMock();
    const taskValidationOrchestrator = new TaskValidationOrchestrator(taskRunService);
    const taskConfig = new TaskConfig();

    afterEach(() => {
        jest.clearAllMocks();
      });

    it("should return success validation if assertion is true", async () => {
        const assertion : Assertion = {
            taskId: "someTaskId",
            expectedErrorCount : 0,
            expectedTaskResult : tl.TaskResult.Succeeded,
            expectedWarningCount : 0,
            expectedMessages : []
        };
        const result = await taskValidationOrchestrator.validateTask(taskConfig, assertion);

        expect(result).not.toBeNull();
        expect(result.messages).not.toBeNull()
        expect(result.messages.length).toBe(0);
        expect(result.taskId).toBe(assertion.taskId);
        expect(result.result).toBe(TaskValidationResult.Succeeded);
    });
});

function createTaskRun() : TaskRun {
    return {
        taskId : "someTaskId",
        taskName : "someTaskName",
        buildId : "someBuildId",
        jobId : "someJobid",
        taskResult: tl.TaskResult.Succeeded,
        errorCount : 0,
        warningCount : 0
    };
}