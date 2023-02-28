import {
  TaskResult,
  Timeline,
} from "azure-devops-node-api/interfaces/BuildInterfaces";
import { BuildTaskRunService } from "./build-task-run-service";

describe("build task run service ", () => {
  const getBuildTimelineMock = jest.fn(
    (): Promise<Timeline | undefined> => Promise.resolve(createTestTimeline())
  );
  const buildTimelineClientMock = jest.fn().mockImplementation(() => {
    return {
      getBuildTimeline: getBuildTimelineMock,
    };
  });
  const buildTImelineClient = new buildTimelineClientMock();
  const buildTaskRunService = new BuildTaskRunService(buildTImelineClient);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get build task run", async () => {
    const jobId = "someJobId";
    const taskId = "someTaskId";
    const buildId = "someBuildId";
    const project = "someProject";

    const result = await buildTaskRunService.getBuildTaskRun(
      project,
      buildId,
      jobId,
      taskId
    );

    expect(result).not.toBeNull();
    expect(result.buildId).toBe(buildId);
    expect(result.errorCount).toBe(0);
    expect(result.jobId).toBe(jobId);
    expect(result.taskId).toBe(taskId);
  });

  it("should return undefined if task not found ",async () => {
    const jobId = "someJobId";
    const taskId = "someOtherTaskId";
    const buildId = "someBuildId";
    const project = "someProject";

    const result = await buildTaskRunService.getBuildTaskRun(
      project,
      buildId,
      jobId,
      taskId
    );

    expect(result).toBeUndefined();
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
