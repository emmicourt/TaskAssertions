import { Assertion } from "../contracts/assertions/assertion";
import { TaskRun } from "../contracts/task-runs/task-run";
import tl = require("azure-pipelines-task-lib/task");
import { AssertionValidationError } from "../contracts/assertions/exceptions/assertion-validation-error";
import { InvalidAssertionError } from "../contracts/assertions/exceptions/invalid-assertion-error";
import { AssertionValidationOrchestrator } from "./assertion-validation-orchestrator";
import { AssertionValidationResult } from "../contracts/assertion-validation-results/assertion-validation-result";
import { AssertionValidationOrchestratorError } from "../contracts/assertions/exceptions/assertion-validation-orchestrator-error";
import { TaskRunService } from "../services/task-run-service";
import { mock } from "jest-mock-extended";

const taskRunServiceMock = mock<TaskRunService>();
const taskValidationOrchestrator = new AssertionValidationOrchestrator(
  taskRunServiceMock
);

describe("AssertionValidationOrchestrator logical tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    taskRunServiceMock.getBuildTaskRun.mockResolvedValue(createTaskRun());
  });

  it("should return success validation if assertion is true", async () => {
    const assertion: Assertion = createAssertion();
    const result = await taskValidationOrchestrator.checkAssertions(assertion);

    expect(result).not.toBeUndefined();
    expect(result?.messages).not.toBeUndefined();
    expect(result?.messages.length).toBe(0);
    expect(result?.taskId).toBe(assertion.taskId);
    expect(result?.result).toBe(AssertionValidationResult.Succeeded);
  });

  it("should return failed validation if error count does not match assertion", async () => {
    const assertion: Assertion = createAssertion();
    assertion.expectedErrorCount = 5;
    const result = await taskValidationOrchestrator.checkAssertions(assertion);
    expect(result).not.toBeUndefined();
    expect(result?.messages.length).toBe(1);
    expect(result?.messages[0]).toBe(
      `Expected error count: ${assertion.expectedErrorCount} Recieved: 0`
    );
    expect(result?.taskId).toBe(assertion.taskId);
    expect(result?.result).toBe(AssertionValidationResult.Failed);
  });

  it("should return failed validation if warning count does not match assertion", async () => {
    const assertion: Assertion = createAssertion();
    assertion.expectedWarningCount = 5;
    const result = await taskValidationOrchestrator.checkAssertions(assertion);
    expect(result).not.toBeNull();
    expect(result?.messages.length).toBe(1);
    expect(result?.messages[0]).toBe(
      `Expected warning count: ${assertion.expectedWarningCount} Recieved: 0`
    );
    expect(result?.taskId).toBe(assertion.taskId);
    expect(result?.result).toBe(AssertionValidationResult.Failed);
  });

  it("should return failed validation if taskResult does not match assertion", async () => {
    const assertion: Assertion = createAssertion();
    assertion.expectedTaskResult = tl.TaskResult.Failed;
    const result = await taskValidationOrchestrator.checkAssertions(assertion);
    expect(result).not.toBeNull();
    expect(result?.messages.length).toBe(1);
    expect(result?.messages[0]).toBe(
      `Expected task result: ${assertion.expectedTaskResult} Recieved: ${tl.TaskResult.Succeeded}`
    );
    expect(result?.taskId).toBe(assertion.taskId);
    expect(result?.result).toBe(AssertionValidationResult.Failed);
  });

  it("should return failed validation if multiple do not match assertion", async () => {
    const assertion: Assertion = createAssertion();
    assertion.expectedErrorCount = 5;
    assertion.expectedWarningCount = 5;
    assertion.expectedTaskResult = tl.TaskResult.Failed;
    const result = await taskValidationOrchestrator.checkAssertions(assertion);
    expect(result).not.toBeNull();
    expect(result?.messages.length).toBe(3);
    expect(result?.messages).toContain(
      `Expected task result: ${assertion.expectedTaskResult} Recieved: ${tl.TaskResult.Succeeded}`
    );
    expect(result?.messages).toContain(
      `Expected error count: ${assertion.expectedErrorCount} Recieved: ${0}`
    );
    expect(result?.messages).toContain(
      `Expected warning count: ${assertion.expectedWarningCount} Recieved: ${0}`
    );
    expect(result?.taskId).toBe(assertion.taskId);
    expect(result?.result).toBe(AssertionValidationResult.Failed);
  });
});

describe("AssertionValidationOrchestrator validation tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    taskRunServiceMock.getBuildTaskRun.mockResolvedValue(createTaskRun());
  });

  test.each(["", " "])(
    "Input: assertion.taskId Value: %p throw error",
    async (taskId) => {
      const assertion: Assertion = createAssertion();
      assertion.taskId = taskId;
      await expect(
        taskValidationOrchestrator.checkAssertions(assertion)
      ).rejects.toThrowError(
        new AssertionValidationError(
          new InvalidAssertionError("taskId", taskId)
        )
      );
    }
  );

  test.each(["", " "])(
    "Input: assertion.jobId Value: %p throw error",
    async (jobId) => {
      const assertion: Assertion = createAssertion();
      assertion.jobId = jobId;
      await expect(
        taskValidationOrchestrator.checkAssertions(assertion)
      ).rejects.toThrowError(
        new AssertionValidationError(new InvalidAssertionError("jobId", jobId))
      );
    }
  );

  test.each(["", " "])(
    "Input: assertion.projectName Value: %p throw error",
    async (projectName) => {
      const assertion: Assertion = createAssertion();
      assertion.projectName = projectName;
      await expect(
        taskValidationOrchestrator.checkAssertions(assertion)
      ).rejects.toThrowError(
        new AssertionValidationError(
          new InvalidAssertionError("projectName", projectName)
        )
      );
    }
  );

  test.each(["", " "])(
    "Input: assertion.buildId Value: %p throw error",
    async (buildId) => {
      const assertion: Assertion = createAssertion();
      assertion.buildId = buildId;
      await expect(
        taskValidationOrchestrator.checkAssertions(assertion)
      ).rejects.toThrowError(
        new AssertionValidationError(
          new InvalidAssertionError("buildId", buildId)
        )
      );
    }
  );

  test.each([-1, 0.5])(
    "Input: assertion.expectedErrorCount Value: %p throw error",
    async (expectedErrorCount) => {
      const assertion: Assertion = createAssertion();
      assertion.expectedErrorCount = expectedErrorCount;
      await expect(
        taskValidationOrchestrator.checkAssertions(assertion)
      ).rejects.toThrowError(AssertionValidationError);
    }
  );

  test.each([-1, 0.5])(
    "Input: assertion.expectedWarningCount Value: %p throw error",
    async (expectedWarningCount) => {
      const assertion: Assertion = createAssertion();
      assertion.expectedWarningCount = expectedWarningCount;
      await expect(
        taskValidationOrchestrator.checkAssertions(assertion)
      ).rejects.toThrowError(
        new AssertionValidationError(
          new InvalidAssertionError(
            "expectedWarningCount",
            expectedWarningCount
          )
        )
      );
    }
  );
});

describe("AssertionValidationOrchestrator exception tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    taskRunServiceMock.getBuildTaskRun.mockResolvedValue(createTaskRun());
  });

  it("TaskServiceFailure should throw AssertionValidationOrchestrator error", async () => {
    taskRunServiceMock.getBuildTaskRun.mockImplementation(() => {
      throw Error();
    });

    await expect(
      taskValidationOrchestrator.checkAssertions(createAssertion())
    ).rejects.toThrowError(
      new AssertionValidationOrchestratorError(new Error())
    );
  });
});

function createAssertion(): Assertion {
  return {
    taskId: "someTaskId",
    projectName: "someProjectName",
    jobId: "someJobId",
    buildId: "someBuildId",
    expectedTaskResult: tl.TaskResult.Succeeded,
    expectedErrorCount: 0,
    expectedWarningCount: 0,
    expectedMessages: [],
  };
}

function createTaskRun(): TaskRun {
  return {
    taskId: "someTaskId",
    taskName: "someTaskName",
    buildId: "someBuildId",
    jobId: "someJobid",
    taskResult: tl.TaskResult.Succeeded,
    errorCount: 0,
    warningCount: 0,
  };
}
