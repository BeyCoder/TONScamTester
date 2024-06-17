import {TestResult} from "./results/TestResult";

export interface ITestable {
    test(): Promise<TestResult|null>;
}