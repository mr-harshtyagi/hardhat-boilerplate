// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");
const { ethers } = require("hardhat")

async function main() {
  // settings
  const targetAddressInput = "0xc69f58ea47875b2e838bf5807184f76d1050f53d" // user address, not userProxy

  const dystopiaLensAddress = "0xDd688a48A511f1341CC57D89e3DcA486e073eaCe"
  const votingSnapshotAddress = "0xC166e512ef3127e835Ffe96a5F87014DEf46A904"
  const userProxyFactoryAddress = "0x22Eb3955Ac17AA32374dA5932BbB2C46163E39E3"
  const multicallAddress = "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507"

  // checksum the address
  const targetAddress = ethers.utils.getAddress(targetAddressInput)

  // define contracts
  const dystopiaLens = await ethers.getContractAt("IDystopiaLens", dystopiaLensAddress)

  const userProxyFactory = await ethers.getContractAt("IUserProxyFactory", userProxyFactoryAddress)

  const userProxyAddress = await userProxyFactory.userProxyByAccount(targetAddress)

  const votingSnapshot = await ethers.getContractAt("IVotingSnapshot", votingSnapshotAddress)

  const multicall = await ethers.getContractAt("Multicall", multicallAddress)

  // log user address and userProxy address
  console.log("targetAddress", targetAddress)
  console.log("userProxyAddress", userProxyAddress)

  // fetch list of pools
  const pools = await dystopiaLens.poolsAddresses()

  // construct multicall
  let calls = []
  for (let i = 0; i < pools.length; i++) {
    calls[i] = {}
    let tx = await votingSnapshot.populateTransaction.accountVoteByPool(userProxyAddress, pools[i])
    calls[i].target = tx.to
    calls[i].callData = tx.data
  }
  // console.log(calls);

  const result = await multicall.callStatic.aggregate(calls)
  // console.log(result);
  let stragglerPools = []
  result[1].forEach((poolResult) => {
    let decoded = ethers.utils.defaultAbiCoder.decode(["address pool", "int weight"], poolResult)
    if (decoded.pool != ethers.constants.AddressZero) {
      stragglerPools.push({ poolAddress: decoded.pool, weight: decoded.weight })
    }
  })

  // print all stragglerPools data
  if (stragglerPools.length == 0) {
    console.log("no straggler pools found")
  } else console.log(stragglerPools)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
