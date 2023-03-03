import { TaskValidation } from "../contracts/task-validation-results/task-validation-result";
import { ITaskRunService } from "../services/task-run-service";


export interface ITaskValidationOrchestrator {
    validateTask() : TaskValidation
}

export class TaskValidationOrchestrator implements ITaskValidationOrchestrator{
    private taskRunService : ITaskRunService;
    
    constructor(taskRunService: ITaskRunService){
        this.taskRunService = taskRunService;
    }
    
    validateTask(): TaskValidation {
        throw new Error("Method not implemented.");
    }
}