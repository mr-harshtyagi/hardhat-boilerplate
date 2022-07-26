require("dotenv").config()
require("@openzeppelin/hardhat-upgrades")
require("@nomicfoundation/hardhat-toolbox")
const { task } = require("hardhat/config")

/** @type import('hardhat/config').HardhatUserConfig */

task("accounts", "Prints the list of accounts", async function (taskArgs, hre) {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const GOERLI_RPC_URL = process.env.RINKEBY_RPC_URL
const MATIC_RPC_URL = process.env.MATIC_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      forking: {
        url: MATIC_RPC_URL,
      },
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
    matic: {
      url: MATIC_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
}
