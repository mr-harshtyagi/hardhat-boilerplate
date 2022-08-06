const { ethers, upgrades } = require("hardhat")

async function main() {
  // Deploying
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying Contracts...")
  const instance = await upgrades.deployProxy(SimpleStorage) // deploying proxy here
  await instance.deployed()
  console.log(`Deployed contract to : ${instance.address}`)
  await instance.store(7)
  console.log("Favourite Number :", await instance.retrieve())

  // Upgrading
  const SimpleStorageV2 = await ethers.getContractFactory("SimpleStorageV2")
  const upgraded = await upgrades.upgradeProxy(instance.address, SimpleStorageV2) // upgrading proxy here
  console.log(`Upgraded Contract deployed to : ${upgraded.address}`)
  await upgraded.store(8)
  console.log("Favourite Number :", await upgraded.retrieve())
  console.log("Favourite Number :", await instance.retrieve())
  // both instances are referring to same address where implementation contract exists
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
