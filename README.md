# vintage-explorer

Simple decentralized application built with react that allows wine producers to sell wine to users on the ethereum blockchain. Admins will need to add wine producers and the wine producers then can post wines.  Any users can buy wines using this smart contract on the ethereum blockchain. The wine producers can also withdraw ETH from the smart contract if it has balance from its sales.

## Prerequisites

1. Install [Node.js](http://nodejs.org) 
    * node version ^10.16.0
    * Please start at the root of this project.
        * Install npm packages for front end application (react)
        ```bash
        cd client
        npm install
        ```
2. Install [Truffle](https://www.trufflesuite.com/)
    ```bash
        npm install -g truffle
    ```
3. Install [Ganache](https://www.trufflesuite.com/)
    ```bash
        npm install -g ganache-cli
    ```
* Look at truffle-config.js for ganache setup
    * By default we are using ganache-cli's default setup
    ```JSON
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ```

## QuickStart For Local Environment

1. To start the application locally (front end react port : 3000). Please start at the root of this project.
    * start ganache-cli
    ```bash
    ganache-cli
    ```
    * run truffle migrate
    ```bash
    truffle migrate --network develop
    ```
    * start react app locally (port 3000 by default)
    ```bash
    cd client
    npm run start
    ```

2. To test using the test script written in js
    * start ganache-cli
    ```bash
    ganache-cli
    ```
    * run truffle test
    ```bash
    npm install -g truffle
    truffle test
    ```
3. If you have IPFS node running locally, you can load the site through ipfs
    * Hash
        * QmVMaM23U5cvYwX2jzAYtz5MpSBaE6Udvsdg2wf352N7Sh
    * Local URL 
        * http://127.0.0.1:8080/ipfs/QmVMaM23U5cvYwX2jzAYtz5MpSBaE6Udvsdg2wf352N7Sh/
