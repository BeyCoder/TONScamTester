# TONScamTester
Powerful tool to detect scam entities (Jetton, NFT, etc) by emulating smart contracts execution in a remote TON network. 

## How can I add a new test case?
Create a new class in ```src/cases/``` which must extend the ```TestCase``` class. All ```TestCases``` will be imported automatically. Don't forget to set supported entities by property ```supportedEntities```.
