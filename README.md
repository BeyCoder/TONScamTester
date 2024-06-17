# TONScamTester
Powerful tool to detect scam entities (Jetton, NFT, etc) by emulating smart contracts execution in a remote TON network. 

### Installation
Run ```npm i tonscamtester```

### How can I add a new test case?
Create a new class in ```src/cases/``` which must extend the ```TestCase``` class. All ```TestCases``` will be imported automatically. Don't forget to set supported entities by property ```supportedEntities```.

### Features
1. [x] Dynamic modules importing
2. [x] Remote network support
3. [x] Sell swap fail
4. [ ] Sell swap fail (case if it's future)
5. [ ] Jetton wallet code_hash verification