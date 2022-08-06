const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")

describe("Simple Storage Contract", function () {
  async function deployStrategyFixture() {
    console.log("Deploying...")
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage")
    const simpleStorage = await SimpleStorage.deploy()
    await simpleStorage.deployed()
    console.log("Contract Deployed at :", simpleStorage.address)
    return { simpleStorage }
  }

  describe("Deployment", function () {
    it("Should check store and retreive function", async function () {
      const { simpleStorage } = await loadFixture(deployStrategyFixture)
      await simpleStorage.store(7)
      expect(7).to.equal(await simpleStorage.retrieve())
    })
  })
})
