import {TestEntity} from "./TestEntity";
import {Address} from "@ton/ton";
import {TestEntityType} from "./TestEntityType";
import axios from "axios";

export class JettonTestEntity extends TestEntity {
    get holders(): Address[] {
        return this._holders;
    }
    private _holders: Address[];
    protected constructor(address: Address) {
        super(TestEntityType.jetton, address);
        this._holders = [];
    }

    public async loadHolders() {
        this._holders = [];
        
        const url = `https://toncenter.com/api/v3/jetton/wallets?jetton_address=${this.address.toString()}&limit=128&offset=0`;
        const jettonWallets = await axios.get(url)
        for (const item of jettonWallets.data.jetton_wallets) {
            const holder = Address.parse(item.owner)
            this._holders.push(holder);
        }
    }

    static async fromAddress(address: Address) {
        const entity = new JettonTestEntity(address)
        await entity.loadHolders();
        return entity;
    }
}