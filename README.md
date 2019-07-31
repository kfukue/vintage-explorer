# vintage-explorer

Simple decentralized application built on react that allows wine producers to sell wine to users on the ethereum blockchain. Admins can add wine producers and the wine producers then can post wines where any users can buy wines on the ethereum blockchain. The wine producers can also withdraw ETH from smart contract if it has balance from its sales.

## Prerequisites

1. Install [Node.js](http://nodejs.org) 
* node version ^10.16.0

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

1. To start the application locally (front end react port : 3000 by default). Please start at the root of this project.
    * start ganache-cli
    ```bash
    ganache-cli
    ```
    * run truffle migrate
    ```bash
    npm install -g truffle
    truffle migrate --network develop
    ```
    * start react app locally (port 3000 by default)
    ```bash
    cd client
    npm install 
    npm run start
    ```

2. To test using the test script written js
    * start ganache-cli
    ```bash
    ganache-cli
    ```
    * run truffle test
    ```bash
    npm install -g truffle
    truffle test
    ```