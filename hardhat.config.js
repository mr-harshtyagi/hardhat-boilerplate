const { task } = require("hardhat/config");

require("@nomicfoundation/hardhat-toolbox");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

/** @type import('hardhat/config').HardhatUserConfig */

task("accounts", "Prints the list of accounts", async function (taskArgs, hre) {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337, // We set 1337 to make interacting with MetaMask simpler
    },
  },
};
