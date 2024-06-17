import {Address} from "@ton/ton";
import {TestEntityType} from "./TestEntityType";

export abstract class TestEntity {
    public readonly address: Address;
    public readonly type: TestEntityType
    constructor(type: TestEntityType, address: Address) {
        this.address = address;
        this.type = type;
    }
}