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
        * Please note that the account that deployed the contract (usually account 0 under "Available Accounts" in ganache-cli) is the admin account which is required to add wine producers by their ethereum address. 
        * After the contract is deployed, please make sure to use the admin account (account 0) with metamask when loading the react app in the next step below.
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
    truffle test
    ```

3. If you have an IPFS node running locally or would like to load the app with a public gateway, you can load the react app site through IPFS. (Only For Rinkeby Test Network)
    * Make sure to point to Rinkeby Test Network in Metamask
    * You would only be able to log in as a buyer account so if you would like to test the admin and wine producers accounts, please deploy the contract locally via ganache-cli and use the local dev server (npm run start) as explained above in step 1.
    * Hash
        * QmNXDertS98oGgCwNGYAG9GurfkeHTduBVL35PHLCyG1X2
    * Local URL (If you have an IPFS node running locally)
        * http://127.0.0.1:8080/ipfs/QmNXDertS98oGgCwNGYAG9GurfkeHTduBVL35PHLCyG1X2/
    * Public Gateway (This may take longer to load)
        * https://cloudflare-ipfs.com/ipfs/QmNXDertS98oGgCwNGYAG9GurfkeHTduBVL35PHLCyG1X2/
        * https://ipfs.io/ipfs/QmNXDertS98oGgCwNGYAG9GurfkeHTduBVL35PHLCyG1X2/