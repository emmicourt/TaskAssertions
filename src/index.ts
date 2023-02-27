import tl = require("azure-pipelines-task-lib/task");

export async function run() {
  try {
    const inputString: string | undefined = tl.getInput("samplestring", true);

    console.log("Hello", inputString);
  } catch (err) {
    if (err instanceof Error) {
      tl.setResult(tl.TaskResult.Failed, err.message);
    }
  }
}

run();
