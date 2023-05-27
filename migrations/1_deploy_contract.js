const StakingContract = artifacts.require("StakingContract.sol");

module.exports = function (deployer) {

  deployer.deploy(StakingContract);
};
