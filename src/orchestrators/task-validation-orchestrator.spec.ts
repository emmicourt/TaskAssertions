import { TaskRun } from "../contracts/task-runs/task-run";
import { TaskValidationOrchestrator } from "./task-validation-orchestrator";


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

    afterEach(() => {
        jest.clearAllMocks();
      });

    it("should return success validation if assertion is true", () => {
        const result = taskValidationOrchestrator.validateTask();

        expect(result).not.toBeNull();
    });
});

function createTaskRun() : TaskRun {
    return {
        taskId : "someTaskId",
        taskName : "someTaskName",
        buildId : "someBuildId",
        jobId : "someJobid",
        errorCount : 0,
        warningCount : 0
    };
}