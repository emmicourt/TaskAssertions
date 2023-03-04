import { TaskConfig } from "../common/task-config";
import { Assertion } from "../contracts/assertions/assertion";
import { TaskRun } from "../contracts/task-runs/task-run";
import { TaskValidationReport, TaskValidationResult } from "../contracts/task-validation-results/task-validation-result";
import { ITaskRunService } from "../services/task-run-service";


export interface ITaskValidationOrchestrator {
    validateTask(taskConfig : TaskConfig, assertion: Assertion) : Promise<TaskValidationReport>
}

export class TaskValidationOrchestrator implements ITaskValidationOrchestrator{
    private taskRunService : ITaskRunService;
    
    constructor(taskRunService: ITaskRunService){
        this.taskRunService = taskRunService;
    }
    
    public async validateTask(taskConfig: TaskConfig, assertion: Assertion): Promise<TaskValidationReport> {
        const projectName = taskConfig.getProjectName();
        const jobId = taskConfig.getJobId();
        const buildId = taskConfig.getBuildId();

        const taskRun = await this.taskRunService.getBuildTaskRun(projectName, buildId, jobId, assertion.taskId);

        return this.createTaskValidationResult(assertion, taskRun);
    }
    
    private createTaskValidationResult(assertion: Assertion, taskRun: TaskRun) : TaskValidationReport {
        const taskValidationReport : TaskValidationReport = {
            taskId: taskRun.taskId,
            taskName: taskRun.taskName,
            result: TaskValidationResult.Succeeded,
            messages: [],
        }

        if(taskRun.errorCount !== assertion.expectedErrorCount){
            taskValidationReport.messages.push("");
            taskValidationReport.result = TaskValidationResult.Failed;
        }

        if(taskRun.warningCount !== assertion.expectedWarningCount){
            taskValidationReport.messages.push("");
            taskValidationReport.result = TaskValidationResult.Failed;
        }

        if(taskRun.taskResult !== assertion.expectedTaskResult){
            taskValidationReport.messages.push("");
            taskValidationReport.result = TaskValidationResult.Failed;
        }

        return taskValidationReport
    }
}