
import { BuildTimelineClient, IBuildTimelineClient } from "../clients/build-timeline-client";
import { BuildTaskRunService } from "./build-task-run-service";
jest.mock('../clients/build-timeline-client');

describe("build task run service ", () => {

  const buildClientMock = <jest.Mock<IBuildTimelineClient>><unknown>BuildTimelineClient;
  const buildTaskRunService = new BuildTaskRunService(buildClientMock());

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw unimplemented", async () => {
    let errorMessage :string;
    try{
        buildTaskRunService.getBuildTaskRun("someProjectName", "someBuildId", "someJobId", "someTaskId");
    } catch (err){
        errorMessage = err.message;
    }

    expect(errorMessage).toBe("Method not implemented.");
  });
});
