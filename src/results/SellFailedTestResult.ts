import {TestResult} from "./TestResult";
import {TestResultType} from "./TestResultType";

export class SellFailedTestResult extends TestResult {
    constructor(happened: boolean) {
        super(TestResultType.sellFailed, happened);
    }
}