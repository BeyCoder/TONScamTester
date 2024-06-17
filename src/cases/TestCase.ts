import {ITestable} from "../ITestable";
import {TestResult} from "../results/TestResult";
import {Blockchain} from "@ton/sandbox";
import {TestEntity} from "../entities/TestEntity";
import {TestEntityType} from "../entities/TestEntityType";

export abstract class TestCase implements ITestable {
    protected blockchain: Blockchain;
    protected entity: TestEntity;
    protected supportedEntities: TestEntityType[] = [];
    constructor(blockchain: Blockchain, entity: TestEntity) {
        this.blockchain = blockchain;
        this.entity = entity;
    }
    protected isSupported() {
        if (this.supportedEntities.length == 0) {
            return true;
        }

        return this.supportedEntities.includes(this.entity.type)
    }
    abstract test(): Promise<TestResult|null>;
}