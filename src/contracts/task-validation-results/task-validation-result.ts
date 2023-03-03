
export enum TaskValidationResult {
    Succeeded,
    Failed
}

export class TaskValidation{
    taskId: string;
    taskName: string;
    result: TaskValidationResult;
    message: string;
}