const FisherRole = artifacts.require("./FisherRole.sol");
const DistributorRole = artifacts.require("./DistributorRole.sol");
const RetailerRole = artifacts.require("./RetailerRole.sol");
const ConsumerRole = artifacts.require("./ConsumerRole.sol");
const SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(FisherRole);
  deployer.deploy(DistributorRole);
  deployer.deploy(RetailerRole);
  deployer.deploy(ConsumerRole);
  deployer.deploy(SupplyChain);
};
