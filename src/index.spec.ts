import { run } from "./index";
import tl = require("azure-pipelines-task-lib/task");

describe("index input validation", () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Task should fail if required inputs not given", () => {
    let tlSpy = jest.spyOn(tl, "setResult");
    run();

    expect(tlSpy).toHaveBeenCalledWith(
      tl.TaskResult.Failed,
      "Input required: samplestring"
    );
  });

  test("Task should succeed if valid input given", () => {
    let tlSpy = jest.spyOn(tl, "setResult");
    let tlGetInput = jest.spyOn(tl, "getInput").mockReturnValue(" there.");
    run();

    expect(tlSpy).toHaveBeenCalledTimes(0);
    expect(tlGetInput).toHaveBeenLastCalledWith("samplestring", true);
  });
});
