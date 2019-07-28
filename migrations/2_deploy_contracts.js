var SafeMath = artifacts.require("./SafeMath.sol");
var VintageExplorer = artifacts.require("./VintageExplorer.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(VintageExplorer);
};
