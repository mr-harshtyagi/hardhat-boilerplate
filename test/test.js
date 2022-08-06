const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")

describe("Simple Storage Contract", function () {
  async function deployStrategyFixture() {
    console.log("Deploying...")
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage")
    const instance = await upgrades.deployProxy(SimpleStorage)
    console.log("Contract Deployed at :", instance.address)
    return { instance }
  }

  describe("Deployment", function () {
    it("Should work before upgrading", async function () {
      const { instance } = await loadFixture(deployStrategyFixture)
      await instance.store(7)
      expect(7).to.equal(await instance.retrieve())
    })
    it("Should work after upgrading too", async function () {
      const { instance } = await loadFixture(deployStrategyFixture)
      const SimpleStorageV2 = await ethers.getContractFactory("SimpleStorageV2")
      await upgrades.upgradeProxy(instance, SimpleStorageV2)
      await instance.store(7)
      expect(8).to.equal(await instance.retrieve())
    })
  })
})
