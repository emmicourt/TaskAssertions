import {
  TaskResult,
  Timeline,
} from "azure-devops-node-api/interfaces/BuildInterfaces";
import { TaskRunNotFoundError } from "../contracts/task-runs/exceptions/task-run-not-found-error";
import { TaskRunServiceError } from "../contracts/task-runs/exceptions/task-run-service-error";
import { TaskRunServiceValidationError } from "../contracts/task-runs/exceptions/task-run-service-input-validation-error";
import { BuildTaskRunService } from "./task-run-service";

describe("TaskRunService logical tests", () => {
  const jobId = "someJobId";
  const taskId = "someTaskId";
  const buildId = "someBuildId";
  const project = "someProject";

  const getBuildTimelineMock = jest.fn(
    (): Promise<Timeline | undefined> => Promise.resolve(createTestTimeline())
  );
  const buildTimelineClientMock = jest.fn().mockImplementation(() => {
    return {
      getBuildTimeline: getBuildTimelineMock,
    };
  });
  const buildTimelineClient = new buildTimelineClientMock();
  const buildTaskRunService = new BuildTaskRunService(buildTimelineClient);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get build task run", async () => {
    const result = await buildTaskRunService.getBuildTaskRun(
      project,
      buildId,
      jobId,
      taskId
    );

    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
    expect(result.buildId).toBe(buildId);
    expect(result.errorCount).toBe(0);
    expect(result.jobId).toBe(jobId);
    expect(result.taskId).toBe(taskId);
  });

  it("should return undefined if task not found ", async () => {
    const otherTaskId = "someOtherTaskId";
    let result: TaskRunServiceError;
    try{
      await buildTaskRunService.getBuildTaskRun(
        project,
        buildId,
        jobId,
        otherTaskId
      );
    }catch(err){
      result = err;
    }
  });

  it("should return undefined if job not found ", async () => {
    const otherJobId = "someOtherJobId";
    let resultError : TaskRunNotFoundError;
    try{
      await buildTaskRunService.getBuildTaskRun(
        project,
        buildId,
        otherJobId,
        taskId
      );
    }catch(err){
      resultError = err;
    }

    expect(resultError).toBeInstanceOf(TaskRunNotFoundError);
    expect(resultError.message).toBe(`Error task run not found in build job.`);
    expect(resultError.name).toBe(TaskRunNotFoundError.name);
  });
});

describe("TaskRunService input validation tests", () => {
  const jobId = "someJobId";
  const taskId = "someTaskId";
  const buildId = "someBuildId";
  const project = "someProject";

  const buildTimelineClientMock = jest.fn().mockImplementation(() => {
    return {
      getBuildTimeline: jest.fn(
        (): Promise<Timeline | undefined> =>
          Promise.resolve(createTestTimeline())
      ),
    };
  });
  const buildTimelineClient = new buildTimelineClientMock();
  const buildTaskRunService = new BuildTaskRunService(buildTimelineClient);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([undefined, null, "", " "])(
    "Input: taskId Value: %p as argument. Throw validation error ",
    async (taskId) => {
      let error: Error;
      try {
        await buildTaskRunService.getBuildTaskRun(
          project,
          buildId,
          jobId,
          taskId
        );
      } catch (resultError) {
        error = resultError;
      }
      expect(error).toBeInstanceOf(TaskRunServiceValidationError);
      expect(error.message).toBe(
        `Invalid input: parameter taskId cannot be ${taskId}`
      );
      expect(error.name).toBe(TaskRunServiceValidationError.name);
    }
  );

  test.each([undefined, null, "", " "])(
    "Input: jobId Value: %p. throw validation error ",
    async (jobId) => {
      let error: Error;
      try {
        await buildTaskRunService.getBuildTaskRun(
          project,
          buildId,
          jobId,
          taskId
        );
      } catch (resultError) {
        error = resultError;
      }
      expect(error).toBeInstanceOf(TaskRunServiceValidationError);
      expect(error.message).toBe(
        `Invalid input: parameter jobId cannot be ${jobId}`
      );
      expect(error.name).toBe(TaskRunServiceValidationError.name);
    }
  );

  test.each([undefined, null, "", " "])(
    "Input: ProjectName Value: %p, throw validation error ",
    async (projectName) => {
      let error: Error;
      try {
        await buildTaskRunService.getBuildTaskRun(
          projectName,
          buildId,
          jobId,
          taskId
        );
      } catch (resultError) {
        error = resultError;
      }
      expect(error).toBeInstanceOf(TaskRunServiceValidationError);
      expect(error.message).toBe(
        `Invalid input: parameter projectName cannot be ${projectName}`
      );
      expect(error.name).toBe(TaskRunServiceValidationError.name);
    }
  );

  test.each([undefined, null, "", " "])(
    "Input: BuildId Value: %p, throw validation error ",
    async (buildId) => {
      let error: Error;
      try {
        await buildTaskRunService.getBuildTaskRun(
          project,
          buildId,
          jobId,
          taskId
        );
      } catch (resultError) {
        error = resultError;
      }
      expect(error).toBeInstanceOf(TaskRunServiceValidationError);
      expect(error.message).toBe(
        `Invalid input: parameter buildId cannot be ${buildId}`
      );
      expect(error.name).toBe(TaskRunServiceValidationError.name);
    }
  );
});

describe("TaskRunService exception tests", () => {
  const jobId = "someJobId";
  const taskId = "someTaskId";
  const buildId = "someBuildId";
  const project = "someProject";
  const message = "some api error";

  const getBuildTimelineMock = jest.fn(
    (): Promise<Timeline | undefined> => Promise.resolve(createTestTimeline())
  );
  const buildTimelineClientMock = jest.fn().mockImplementation(() => {
    return {
      getBuildTimeline: getBuildTimelineMock,
    };
  });
  const buildTimelineClient = new buildTimelineClientMock();
  const buildTaskRunService = new BuildTaskRunService(buildTimelineClient);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if client returns error", async () => {
    let error: TaskRunServiceError;
    buildTimelineClient.getBuildTimeline = jest.fn().mockImplementation(() => {
      throw Error(message);
    });

    try {
      await buildTaskRunService.getBuildTaskRun(
        project,
        buildId,
        jobId,
        taskId
      );
    } catch (resultError) {
      error = resultError;
    }

    expect(error).toBeInstanceOf(TaskRunServiceError);
    expect(error.message).toBe(`Error.`);
    expect(error.name).toBe(TaskRunServiceError.name);
    expect(error.innerException).not.toBeUndefined()
    expect(error.innerException).not.toBeNull();
    expect(error.innerException.message).toBe("some api error");
  });
});

function createTestTimeline(): Timeline {
  return {
    records: [
      {
        parentId: "someJobId",
        type: "Task",
        task: { id: "someTaskId", name: "someTaskName" },
        errorCount: 0,
        warningCount: 0,
        result: TaskResult.Succeeded,
      },
    ],
  };
}
