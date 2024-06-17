import {TestResultType} from "./TestResultType";

export abstract class TestResult {
    public readonly type: TestResultType;
    public readonly happened: boolean;
    constructor(type: TestResultType, happened: boolean) {
        this.type = type;
        this.happened = happened;
    }
}