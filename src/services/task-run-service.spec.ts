import {
  TaskResult,
  Timeline,
} from "azure-devops-node-api/interfaces/BuildInterfaces";
import { TaskRunNotFoundError } from "../contracts/task-runs/exceptions/task-run-not-found-error";
import { TaskRunServiceError } from "../contracts/task-runs/exceptions/task-run-service-error";
import { TaskRunServiceValidationError } from "../contracts/task-runs/exceptions/task-run-service-input-validation-error";
import { TaskRunService } from "./task-run-service";
import { BuildTimelineClient } from "../clients/build-timeline-client";
import { mock } from "jest-mock-extended";

const jobId = "someJobId";
const taskId = "someTaskId";
const buildId = "someBuildId";
const project = "someProject";

const buildTimelineClientMock = mock<BuildTimelineClient>();
const buildTaskRunService = new TaskRunService(buildTimelineClientMock);

describe("TaskRunService logical tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buildTimelineClientMock.getBuildTimeline.mockResolvedValue(
      createTestTimeline()
    );
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
    expect(result?.buildId).toBe(buildId);
    expect(result?.errorCount).toBe(0);
    expect(result?.jobId).toBe(jobId);
    expect(result?.taskId).toBe(taskId);
  });

  it("should throw TaskRunNotFoundError if task not found ", async () => {
    const otherTaskId = "someOtherTaskId";
    await expect(
      buildTaskRunService.getBuildTaskRun(project, buildId, jobId, otherTaskId)
    ).rejects.toThrowError(TaskRunNotFoundError);
  });

  it("should return TaskRunNotFoundError if job not found ", async () => {
    const otherJobId = "someOtherJobId";
    await expect(
      buildTaskRunService.getBuildTaskRun(project, buildId, otherJobId, taskId)
    ).rejects.toThrowError(TaskRunNotFoundError);
  });
});

describe("TaskRunService input validation tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buildTimelineClientMock.getBuildTimeline.mockResolvedValue(
      createTestTimeline()
    );
  });

  test.each(["", " "])(
    "Input: taskId Value: %p as argument. Should Throw validation error ",
    async (taskId) => {
      await expect(
        buildTaskRunService.getBuildTaskRun(project, buildId, jobId, taskId)
      ).rejects.toThrowError(TaskRunServiceValidationError);
    }
  );

  test.each(["", " "])(
    "Input: jobId Value: %p. throw validation error ",
    async (jobId) => {
      await expect(
        buildTaskRunService.getBuildTaskRun(project, buildId, jobId, taskId)
      ).rejects.toThrowError(TaskRunServiceValidationError);
    }
  );

  test.each(["", " "])(
    "Input: ProjectName Value: %p, throw validation error ",
    async (projectName) => {
      await expect(
        buildTaskRunService.getBuildTaskRun(projectName, buildId, jobId, taskId)
      ).rejects.toThrowError(TaskRunServiceValidationError);
    }
  );

  test.each(["", " "])(
    "Input: BuildId Value: %p, throw validation error ",
    async (buildId) => {
      await expect(
        buildTaskRunService.getBuildTaskRun(project, buildId, jobId, taskId)
      ).rejects.toThrowError(TaskRunServiceValidationError);
    }
  );
});

describe("TaskRunService exception tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
    buildTimelineClientMock.getBuildTimeline.mockResolvedValue(
      createTestTimeline()
    );
  });

  it("should throw error if client returns error", async () => {
    buildTimelineClientMock.getBuildTimeline.mockImplementation(() => {
      throw Error();
    });
    await expect(
      buildTaskRunService.getBuildTaskRun(project, buildId, jobId, taskId)
    ).rejects.toThrowError(TaskRunServiceError);
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
