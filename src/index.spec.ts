import { run } from "./index";
import tl = require("azure-pipelines-task-lib/task");

describe("index input validation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Task should fail if required inputs not given", () => {
    const tlSpy = jest.spyOn(tl, "setResult");
    run();

    expect(tlSpy).toHaveBeenCalledWith(
      tl.TaskResult.Failed,
      "Input required: taskId"
    );
  });

  test("Task should succeed if valid input given", () => {
    const tlSpy = jest.spyOn(tl, "setResult");
    const tlGetInput = jest.spyOn(tl, "getInput").mockReturnValue("someTaskId");
    run();

    expect(tlSpy).toHaveBeenCalledTimes(0);
    expect(tlGetInput).toHaveBeenLastCalledWith("taskId", true);
  });
});
