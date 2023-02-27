import tl = require("azure-pipelines-task-lib/task");

export async function run() {
  try {
    const taskId: string | undefined = tl.getInput("taskId", true);
    
  } catch (err) {
    if (err instanceof Error) {
      tl.setResult(tl.TaskResult.Failed, err.message);
    }
  }
}

run();
