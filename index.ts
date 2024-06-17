import {Blockchain, RemoteBlockchainStorage, wrapTonClient4ForRemote} from "@ton/sandbox";
import {Address, TonClient4} from "@ton/ton";
import {getHttpV4Endpoint} from "@orbs-network/ton-access";
import {ScamTester} from "./src/ScamTester";
import {JettonTestEntity} from "./src/entities/JettonTestEntity";

async function initBlockchain() {
    const endpoint = await getHttpV4Endpoint({
        network: 'mainnet'
    })
    const client = new TonClient4({
        endpoint
    });
    const storage = new RemoteBlockchainStorage(wrapTonClient4ForRemote(
        client
    ));
    return await Blockchain.create({
        storage
    })
}

async function main() {
    const blockchain = await initBlockchain();
    const tester = await ScamTester.fromBlockchain(blockchain)
    console.log(await tester.run(await JettonTestEntity.fromAddress(Address.parse("EQBOc9E6XCF480t1tzNndv8UC9C8MU5isCnzokJXFLLW8IkL"))))
}

main()