import {TestResult} from "../results/TestResult";
import {TestCase} from "./TestCase";
import {TestEntityType} from "../entities/TestEntityType";
import {Address, toNano} from "@ton/ton";
import {JettonTestEntity} from "../entities/JettonTestEntity";
import {Asset, Factory, JettonRoot, JettonWallet, MAINNET_FACTORY_ADDR, PoolType, VaultJetton} from "@dedust/sdk";
import {SellFailedTestResult} from "../results/SellFailedTestResult";

export class SellFailTestCase extends TestCase {
    supportedEntities = [TestEntityType.jetton]
    private async getDedustVault() {
        const entity = this.entity as JettonTestEntity;
        for (const holder of entity.holders) {
            const tryTestVault = this.blockchain.openContract(VaultJetton.createFromAddress(holder))
            try {
                await tryTestVault.getAsset();
                return tryTestVault;
            } catch (e) {

            }
        }
        return null;
    }
    private async getDedustPool() {
        const factory = this.blockchain.openContract(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
        return factory.getPoolAddress({
            poolType: PoolType.VOLATILE, assets: [Asset.native(), Asset.jetton(this.entity.address)]
        })
    }
    async test(): Promise<TestResult|null> {
        if (!this.isSupported())
            return null;

        const entity = this.entity as JettonTestEntity;
        const vault = await this.getDedustVault();
        if (!vault) {
            return null; // Vault not found
        }
        const pool = await this.getDedustPool();

        let counter = 0;
        let verified = 0;
        for (const holder of entity.holders) {
            const result = await this.emulate(holder, pool, vault.address);
            if (result) {
                counter++;
            } else {
                verified++;
            }

            if (counter >= entity.holders.length * 0.02) { // if 2% of holders are failed
                return new SellFailedTestResult(true);
            }
            if (verified >= entity.holders.length * 0.04) { // if 4% of holders are success (f.e. to avoid honeypot owners)
                break;
            }
        }

        return new SellFailedTestResult(false);
    }

    private async emulate(holder: Address, poolAddress: Address, vault: Address) {
        const jettonRootContract = JettonRoot.createFromAddress(this.entity.address);
        const jettonRoot = this.blockchain.openContract(jettonRootContract);
        const jettonWallet = this.blockchain.openContract(
            JettonWallet.createFromAddress(await jettonRoot.getWalletAddress(holder))
        )

        const resp = await jettonWallet.sendTransfer(this.blockchain.sender(holder), toNano("0.5"), {
            destination: vault,
            amount: BigInt(1),
            forwardAmount: toNano("0.25"),
            forwardPayload: VaultJetton.createSwapPayload({poolAddress})
        })
        const transactions = resp.transactions;
        for (const tx of transactions) {
            if (tx.description.type !== "generic") {
                continue;
            }

            const compute_phase = tx.description.computePhase;
            if (compute_phase.type == "vm" && !compute_phase.success && compute_phase.exitCode != 65535) {
                // console.log(tx)
                return true;
            }
        }
        return false;
    }

}