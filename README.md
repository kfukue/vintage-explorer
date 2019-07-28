# vintage-explorer

Simple decentralized application built on react that allows wine producers post wines and users to buy wines on the ethereum blockchain

## Prerequisites

1. Install [Node.js](http://nodejs.org)

2. Install [Truffle](https://www.trufflesuite.com/)

3. Install [Ganache](https://www.trufflesuite.com/)
* Look at truffle-config.js for ganache setup
    * By default we are using
    ```JSON
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ```

## QuickStart for local environment

1. To start the application locally (port : 3000 by default) 
    * start ganache-cli
    ```bash
    npm install -g ganache-cli
    ganache-cli
    ```
    * run truffle migrate
    ```bash
    npm install -g truffle
    truffle migrate
    ```
    * start react app locally (port 3000 by default)
    ```bash
    cd client
    npm install 
    npm run start
    ```

2. To test using the test script written js
   ```bash
    npm install -g truffle
    truffle test
    ```
\ No newline at end of file