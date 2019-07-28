const path = require("path");
var HDWalletProvider = require("truffle-hdwallet-provider");
// mnemonic for rinkeby for contract creation
// var mnemonic = "winner kitchen door bacon hidden mad fire click jar cup gravity catalog";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    test: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    // rinkeby: {
    //   provider: function() { 
    //    return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/APIHERE");
    //   },
    //   network_id: 4,
    //   gas: 4500000,
    //   gasPrice: 10000000000,
    // }
  }
};
