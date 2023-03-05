import { Assertion } from "../contracts/assertions/assertion";
import { TaskRun } from "../contracts/task-runs/task-run";
import tl = require("azure-pipelines-task-lib/task");
import { TaskConfig } from "../common/task-config";
import { AssertionValidationError } from "../contracts/assertions/exceptions/assertion-validation-error";
import { InvalidAssertionError } from "../contracts/assertions/exceptions/invalid-assertion-error";
import { AssertionValidationOrchestrator } from "./assertion-validation-orchestrator";
import { AssertionValidationResult } from "../contracts/assertion-validation-results/assertion-validation-result";

describe("AssertionValidationOrchestrator logical tests", () => {
  const getBuildTaskRun = jest.fn(
    (): Promise<TaskRun | undefined> => Promise.resolve(createTaskRun())
  );

  const taskRunServiceMock = jest.fn().mockImplementation(() => {
    return {
      getBuildTaskRun: getBuildTaskRun,
    };
  });
  const taskRunService = new taskRunServiceMock();
  const taskValidationOrchestrator = new AssertionValidationOrchestrator(
    taskRunService
  );
  const taskConfig = new TaskConfig();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return success validation if assertion is true", async () => {
    const assertion: Assertion = createAssertion();
    const result = await taskValidationOrchestrator.checkAssertions(
      taskConfig,
      assertion
    );

    expect(result).not.toBeNull();
    expect(result.messages).not.toBeNull();
    expect(result.messages.length).toBe(0);
    expect(result.taskId).toBe(assertion.taskId);
    expect(result.result).toBe(AssertionValidationResult.Succeeded);
  });
});

describe("AssertionValidationOrchestrator validation tests", () => {
  const getBuildTaskRun = jest.fn(
    (): Promise<TaskRun | undefined> => Promise.resolve(createTaskRun())
  );

  const taskRunServiceMock = jest.fn().mockImplementation(() => {
    return {
      getBuildTaskRun: getBuildTaskRun,
    };
  });
  const taskRunService = new taskRunServiceMock();
  const taskValidationOrchestrator = new AssertionValidationOrchestrator(
    taskRunService
  );
  const taskConfig = new TaskConfig();

  test.each([undefined, null, "", " "])(
    "Input: assertion.taskId Value: %p throw error",
    async (taskId) => {
      const assertion: Assertion = createAssertion();
      assertion.taskId = taskId;
      let error: AssertionValidationError;

      try {
        await taskValidationOrchestrator.checkAssertions(taskConfig, assertion);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AssertionValidationError);
      expect(error.innerException).toBeInstanceOf(InvalidAssertionError);
      expect(error.message).toBe(`Invalid Assertion.`);
      expect(error.innerException.message).toBe(
        `Invalid Assertion. Parameter name taskId Parameter value: ${taskId}`
      );
    }
  );

  test.each([-1, 0.5])(
    "Input: assertion.expectedErrorCount Value: %p throw error",
    async (expectedErrorCount) => {
      const assertion: Assertion = createAssertion();
      assertion.expectedErrorCount = expectedErrorCount;
      let error: AssertionValidationError;

      try {
        await taskValidationOrchestrator.checkAssertions(taskConfig, assertion);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AssertionValidationError);
      expect(error.innerException).toBeInstanceOf(InvalidAssertionError);
      expect(error.message).toBe(`Invalid Assertion.`);
      expect(error.innerException.message).toBe(
        `Invalid Assertion. Parameter name expectedErrorCount Parameter value: ${expectedErrorCount}`
      );
    }
  );

  test.each([-1, 0.5])(
    "Input: assertion.expectedWarningCount Value: %p throw error",
    async (expectedWarningCount) => {
      const assertion: Assertion = createAssertion();
      assertion.expectedWarningCount = expectedWarningCount;
      let error: AssertionValidationError;

      try {
        await taskValidationOrchestrator.checkAssertions(taskConfig, assertion);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AssertionValidationError);
      expect(error.innerException).toBeInstanceOf(InvalidAssertionError);
      expect(error.message).toBe(`Invalid Assertion.`);
      expect(error.innerException.message).toBe(
        `Invalid Assertion. Parameter name expectedWarningCount Parameter value: ${expectedWarningCount}`
      );
    }
  );
});

function createAssertion(): Assertion {
  return {
    taskId: "someTaskId",
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
