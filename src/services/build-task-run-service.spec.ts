import {
  TaskResult,
  Timeline,
} from "azure-devops-node-api/interfaces/BuildInterfaces";
import { BuildTaskRunServiceError } from "../contracts/build-service-error";
import { BuildTaskRunService } from "./build-task-run-service";

describe("build task run service ", () => {
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

  it("should return throw error if client returns error", async () => {
    const message = "some api error";
    buildTimelineClient.getBuildTimeline = jest.fn().mockImplementation(() => {
      throw Error(message);
    });

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

    expect(error).toBeInstanceOf(BuildTaskRunServiceError);
    expect(error.message).toBe(
      `BuildTaskRunServiceError: error getting build timeline. ${message}`
    );
    expect(error.name).toBe(BuildTaskRunServiceError.name);
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
