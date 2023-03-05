
export class AssertionValidationOrchestratorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = AssertionValidationOrchestratorError.name;
    }
}