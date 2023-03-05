import { Assertion } from "../contracts/assertions/assertion";
import { TaskRun } from "../contracts/task-runs/task-run";
import tl = require("azure-pipelines-task-lib/task");
import { AssertionValidationError } from "../contracts/assertions/exceptions/assertion-validation-error";
import { InvalidAssertionError } from "../contracts/assertions/exceptions/invalid-assertion-error";
import { AssertionValidationOrchestrator } from "./assertion-validation-orchestrator";
import { AssertionValidationResult } from "../contracts/assertion-validation-results/assertion-validation-result";
import { NullAssertionError } from "../contracts/assertions/exceptions/null-assertion-error";
import { AssertionValidationOrchestratorError } from "../contracts/assertions/exceptions/assertion-validation-orchestrator-error";

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return success validation if assertion is true", async () => {
    const assertion: Assertion = createAssertion();
    const result = await taskValidationOrchestrator.checkAssertions(assertion);

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

  test.each([undefined, null, "", " "])(
    "Input: assertion.taskId Value: %p throw error",
    async (taskId) => {
      const assertion: Assertion = createAssertion();
      assertion.taskId = taskId;
      let error: AssertionValidationError;

      try {
        await taskValidationOrchestrator.checkAssertions(assertion);
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

  test.each([undefined, null, "", " "])(
    "Input: assertion.jobId Value: %p throw error",
    async (jobId) => {
      const assertion: Assertion = createAssertion();
      assertion.jobId = jobId;
      let error: AssertionValidationError;

      try {
        await taskValidationOrchestrator.checkAssertions(assertion);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AssertionValidationError);
      expect(error.innerException).toBeInstanceOf(InvalidAssertionError);
      expect(error.message).toBe(`Invalid Assertion.`);
      expect(error.innerException.message).toBe(
        `Invalid Assertion. Parameter name jobId Parameter value: ${jobId}`
      );
    }
  );

  test.each([undefined, null, "", " "])(
    "Input: assertion.projectName Value: %p throw error",
    async (projectName) => {
      const assertion: Assertion = createAssertion();
      assertion.projectName = projectName;
      let error: AssertionValidationError;

      try {
        await taskValidationOrchestrator.checkAssertions(assertion);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AssertionValidationError);
      expect(error.innerException).toBeInstanceOf(InvalidAssertionError);
      expect(error.message).toBe(`Invalid Assertion.`);
      expect(error.innerException.message).toBe(
        `Invalid Assertion. Parameter name projectName Parameter value: ${projectName}`
      );
    }
  );

  test.each([undefined, null, "", " "])(
    "Input: assertion.buildId Value: %p throw error",
    async (buildId) => {
      const assertion: Assertion = createAssertion();
      assertion.buildId = buildId;
      let error: AssertionValidationError;

      try {
        await taskValidationOrchestrator.checkAssertions(assertion);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AssertionValidationError);
      expect(error.innerException).toBeInstanceOf(InvalidAssertionError);
      expect(error.message).toBe(`Invalid Assertion.`);
      expect(error.innerException.message).toBe(
        `Invalid Assertion. Parameter name buildId Parameter value: ${buildId}`
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
        await taskValidationOrchestrator.checkAssertions(assertion);
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
        await taskValidationOrchestrator.checkAssertions(assertion);
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

  test.each([undefined, null])(
    "Input: assertion.expectedTaskResult Value: %p throw error",
    async (expectedTaskResult) => {
      const assertion: Assertion = createAssertion();
      assertion.expectedTaskResult = expectedTaskResult;
      let error: AssertionValidationError;

      try {
        await taskValidationOrchestrator.checkAssertions(assertion);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AssertionValidationError);
      expect(error.innerException).toBeInstanceOf(InvalidAssertionError);
      expect(error.message).toBe(`Invalid Assertion.`);
      expect(error.innerException.message).toBe(
        `Invalid Assertion. Parameter name expectedTaskResult Parameter value: ${expectedTaskResult}`
      );
    }
  );

  test.each([undefined, null])(
    "Input: assertion.expectedMessages Value: %p throw error",
    async (expectedMessages) => {
      const assertion: Assertion = createAssertion();
      assertion.expectedMessages = expectedMessages;
      let error: AssertionValidationError;

      try {
        await taskValidationOrchestrator.checkAssertions(assertion);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AssertionValidationError);
      expect(error.innerException).toBeInstanceOf(InvalidAssertionError);
      expect(error.message).toBe(`Invalid Assertion.`);
      expect(error.innerException.message).toBe(
        `Invalid Assertion. Parameter name expectedMessages Parameter value: ${expectedMessages}`
      );
    }
  );

  test.each([undefined, null])(
    "Input: assertion Value: %p throw error",
    async (assertion) => {
      let error: AssertionValidationError;

      try {
        await taskValidationOrchestrator.checkAssertions(assertion);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AssertionValidationError);
      expect(error.innerException).toBeInstanceOf(NullAssertionError);
      expect(error.message).toBe(`Invalid Assertion.`);
      expect(error.innerException.message).toBe(
        "Invalid Assertion. Assertion cannot be null or undefined."
      );
    }
  );
});

describe("AssertionValidationOrchestrator exception tests", () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("TaskServiceFailure should throw AssertionValidation error", async () => {
    taskRunService.getBuildTaskRun = jest.fn().mockImplementation(() => {
        throw Error("some error message");
      });
    let error: AssertionValidationOrchestratorError;
    try {
      await taskValidationOrchestrator.checkAssertions(createAssertion());
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(AssertionValidationOrchestratorError);
    expect(error.message).toBe(`An internal error has occured.`);
    expect(error.innerException.message).toBe(
      "some error message"
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
