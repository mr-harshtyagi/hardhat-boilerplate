// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat")
const { ethers } = require("hardhat")
const fs = require("fs")

async function main() {
  // settings
  // const relevantTx = require("../output/relevanTx copy.json")
  const dystopiaLensAddress = "0xDd688a48A511f1341CC57D89e3DcA486e073eaCe"
  const votingSnapshotAddress = "0xC166e512ef3127e835Ffe96a5F87014DEf46A904"
  const userProxyFactoryAddress = "0x22Eb3955Ac17AA32374dA5932BbB2C46163E39E3"
  const targetAddressInput = "0xc69f58ea47875b2e838bf5807184f76d1050f53d" // user address, not userProxy
  // 0xa3f0416e7aa28342bc241f9e1bbc5c4c8c646e39
  // 0xc69f58ea47875b2e838bf5807184f76d1050f53d
  // 0xe93ce1315a296e12e040f47c6d0bf3496253d10a

  // checksum the address
  const targetAddress = ethers.utils.getAddress(targetAddressInput)

  // define contracts
  const dystopiaLens = await ethers.getContractAt("IDystopiaLens", dystopiaLensAddress)

  const pools = await dystopiaLens.poolsAddresses()

  const userProxyFactory = await ethers.getContractAt("IUserProxyFactory", userProxyFactoryAddress)

  const userProxyAddress = await userProxyFactory.userProxyByAccount(targetAddress)

  const votingSnapshot = await ethers.getContractAt("IVotingSnapshot", votingSnapshotAddress)

  // log user address and userProxy address
  console.log("targetAddress", targetAddress)
  console.log("userProxyAddress", userProxyAddress)

  // fetch all pools
  for (let i = 0; i < pools.length; i++) {
    let vote = await votingSnapshot.callStatic.accountVoteByPool(userProxyAddress, pools[i])
    if (vote.poolAddress != "0x0000000000000000000000000000000000000000") {
      console.log(vote)
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
