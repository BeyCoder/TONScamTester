import {Blockchain} from "@ton/sandbox";
import {TestEntity} from "./entities/TestEntity";
import {TestCase} from "./cases/TestCase";
import {importTestCaseModules} from "./cases";
import {TestResult} from "./results/TestResult";


// TODO: this is god object, it would be better to create DynamicLoader or smth like that
export class ScamTester {
    private readonly blockchain: Blockchain;
    private modules: any[]; // dynamic loading
    private constructor(blockchain: Blockchain) {
        this.blockchain = blockchain;
        this.modules = [];
    }
    public async loadModules() {
        this.modules = await importTestCaseModules();
    }
    private getTestCases(entity: TestEntity) { // govnokod
        const testCases: TestCase[] = [];
        for (const testCase of this.modules) {
            testCases.push(new testCase(this.blockchain, entity)) // omg :<
        }
        return testCases;
    } // govnokod end

    public async run(entity: TestEntity) {
        const testCases = this.getTestCases(entity);
        if (testCases.length == 0) {
            throw new Error("Test cases are not found! Hint: maybe you forgot to loadModules!")
        }
        const testResults: TestResult[]|null = [];
        for (const testCase of testCases) {
            const result = await testCase.test()
            if (!result)
                continue;

            testResults.push(result)
        }
        return testResults;
    }

    static async fromBlockchain(blockchain: Blockchain) {
        const tester = new ScamTester(blockchain)
        await tester.loadModules();
        return tester;
    }
}