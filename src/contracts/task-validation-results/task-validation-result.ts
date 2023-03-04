
export enum  TaskValidationResult{
    Succeeded,
    Failed
}

export class TaskValidationReport{
    taskId: string;
    taskName: string;
    result: TaskValidationResult;
    messages: string[];
}