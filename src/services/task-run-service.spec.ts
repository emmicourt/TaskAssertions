import {
  TaskResult,
  Timeline,
} from "azure-devops-node-api/interfaces/BuildInterfaces";
import { TaskRunServiceError } from "../contracts/task-run-service-error";
import { TaskRunServiceInputValidationError } from "../contracts/task-run-service-input-validation-error";
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

    const result = await buildTaskRunService.getBuildTaskRun(
      project,
      buildId,
      jobId,
      otherTaskId
    );

    expect(result).toBeUndefined();
  });

  it("should return undefined if job not found ", async () => {
    const otherJobId = "someOtherJobId";

    const result = await buildTaskRunService.getBuildTaskRun(
      project,
      buildId,
      otherJobId,
      taskId
    );

    expect(result).toBeUndefined();
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
    "given %p as argument taskId, throw validation error ",
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
      expect(error).toBeInstanceOf(TaskRunServiceInputValidationError);
      expect(error.message).toBe(
        `Invalid input: parameter taskId cannot be ${taskId}`
      );
      expect(error.name).toBe(TaskRunServiceInputValidationError.name);
    }
  );

  test.each([undefined, null, "", " "])(
    "given %p as argument jobId, throw validation error ",
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
      expect(error).toBeInstanceOf(TaskRunServiceInputValidationError);
      expect(error.message).toBe(
        `Invalid input: parameter jobId cannot be ${jobId}`
      );
      expect(error.name).toBe(TaskRunServiceInputValidationError.name);
    }
  );

  test.each([undefined, null, "", " "])(
    "given %p as argument projectName, throw validation error ",
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
      expect(error).toBeInstanceOf(TaskRunServiceInputValidationError);
      expect(error.message).toBe(
        `Invalid input: parameter projectName cannot be ${projectName}`
      );
      expect(error.name).toBe(TaskRunServiceInputValidationError.name);
    }
  );

  test.each([undefined, null, "", " "])(
    "given %p as argument buildId, throw validation error ",
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
      expect(error).toBeInstanceOf(TaskRunServiceInputValidationError);
      expect(error.message).toBe(
        `Invalid input: parameter buildId cannot be ${buildId}`
      );
      expect(error.name).toBe(TaskRunServiceInputValidationError.name);
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
    let error: Error;
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
    expect(error.message).toBe(`Error getting build timeline. ${message}`);
    expect(error.name).toBe(TaskRunServiceError.name);
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
