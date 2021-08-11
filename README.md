<a href="https://github.com/roaldnefs/supply-chain" style="color: black;">
    <h1 align="center">Seafood Supply Chain</h1>
</a>
<p align="center">
    <a href="https://raw.githubusercontent.com/roaldnefs/supply-chain/main/LICENSE">
        <img src="https://img.shields.io/github/license/roaldnefs/supply-chain?color=blue&style=for-the-badge"
            alt="GitHub license">
    </a>
    <a href="https://github.com/roaldnefs/supply-chain/graphs/contributors">
        <img src="https://img.shields.io/github/contributors/roaldnefs/supply-chain?style=for-the-badge&color=blue"
            alt="GitHub contributors">
    </a>
    </br>
    <b>Seafood Supply Chain</b> is a DApp seafood supply chain solution backed by the <a href="https://ethereum.org/">Ethereum platform</a>. The smart contracts manage specific user permission controls as well as contracts that track and verify a product's authenticity.
    <br />
    <a href="https://github.com/roaldnefs/supply-chain/blob/main/README.md#quick-start"><strong>Quick Start »</strong></a>
    <br />
    <a href="https://github.com/roaldnefs/supply-chain/issues/new?title=Bug%3A">Report Bug</a>
    ·
    <a href="https://github.com/roaldnefs/supply-chain/issues/new?&title=Feature+Request%3A">Request Feature</a>
</p>

## Introduction
Seafood Supply Chain is a DApp supply chain solution backed by the Ethereum platform. The smart contracts manage specific user permission controls as well as contracts that track and verify a product's authenticity.

| ⚠️ **Notice**: For development purposes only! |
| --- |

## Prerequisites
Before running the Supply Chain project make sure the following dependencies are installed:

* Truffle v5.4.0 (core: 5.4.0)
* Solidity v0.8.6 (solc-js)
* Node v16.4.2
* Web3.js v1.2.4

## Quick Start
Use the following command to deploy the smart contracts to a local blockchain, run the tests and launch the DApp. Start by cloning the repository:

```
git clone https://github.com/roaldnefs/supply-chain.git
cd supply-chain
```

After installing all the [prerequisites](#prerequisites) run the following commands to install the required NPM packages:

```
npm install
```

Launch Ganache to start a local Ethereum blockchain for development and testing purposes:

```
ganache-cli
```

Compile the smart contracts by running the following command:

```
truffle compile
```

After the compiling the smart contracts they can be migrated to the locally running blockchain:

```
truffle migrate
```

Run the included tests:

```
npm run test
```

Launch the DApp using the following command:

```
npm run dapp
```

You should now be able to interact with the DApp via: [http://localhost:8080](http://localhost:8080).

## Deployed to Rinkeby
The smart contracts have been deployed to the Rinkeby Testnet Network. The information of the _SupplyChain_ contract is listed below:

**Transaction ID:** [0x097ef453cd06d31417a6e7b21a48721c0f11a13ad481d921c5f2fa508efab71c](https://rinkeby.etherscan.io/tx/0x097ef453cd06d31417a6e7b21a48721c0f11a13ad481d921c5f2fa508efab71c)
**Contract address:** [0x1Bb4D68246e362D70f0168f7250B19552a2b4e08](https://rinkeby.etherscan.io/address/0x1bb4d68246e362d70f0168f7250b19552a2b4e08)

## IPFS
Although IPFS isn't being used in the project, it could be used to store the product images and host the frontend of the DApp.

## Design
The **Seafood Supply Chain** is based upon the UML diagrams showed below.

### Activity Diagram
![Activity diagram of the Seafood Supply Chain](diagrams/activity.png?raw=true "Activity diagram of the Seafood Supply Chain")

### Sequence Diagram
![Sequence diagram of the Seafood Supply Chain](diagrams/sequence.png?raw=true "Sequence diagram of the Seafood Supply Chain")

### State Diagram
![State diagram of the Seafood Supply Chain](diagrams/state.png?raw=true "State diagram of the Seafood Supply Chain")


### Class Diagram
![Class diagram of the Seafood Supply Chain](diagrams/class.png?raw=true "Class diagram of the Seafood Supply Chain")

## Acknowledgment
The project is heavily based upon [nd1309-Project-6b-Example-Template](https://github.com/udacity/nd1309-Project-6b-Example-Template), with the modified work by [Roald Nefs](https://github.com/roaldnefs) as part of the [Udacity Blockchain Developer Nanodegree Program](https://www.udacity.com/course/blockchain-developer-nanodegree--nd1309).
