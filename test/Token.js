const { expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

describe("Token contract", function () {
  // fixture is just a function that return something useful for reusability
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    // const Token = await ethers.getContractFactory("Token")
    // const hardhatToken = await Token.deploy()
    // await hardhatToken.deployed()
    // const hardhatToken = await ethers.getContractAt(
    //   "Token",
    //   "0x2785951ECFF992eB6A50bb22Ea62db156016887b"
    // )

    // Fixtures can return anything you consider useful for your tests
    return { hardhatToken, owner, addr1, addr2 }
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // it("Should set the right owner", async function () {
    //   // We use loadFixture to setup our environment, and then assert that
    //   // things went well
    //   const { hardhatToken, owner } = await loadFixture(deployTokenFixture)
    //   console.log(hardhatToken.address)
    //   expect(await hardhatToken.owner()).to.equal(owner.address)
    // })

    it("Should assign the total supply of tokens to the owner", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)
      const ownerBalance = await hardhatToken.balanceOf(owner.address)
      console.log("Owner balance :", ownerBalance)
      console.log("Addr 1 balance :", await hardhatToken.balanceOf(addr1.address))
      console.log("Addr 2 balance :", await hardhatToken.balanceOf(addr2.address))
      // expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)
    })
  })

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)
      // Transfer 50 tokens from owner to addr1
      await expect(hardhatToken.transfer(addr1.address, 50)).to.changeTokenBalances(
        hardhatToken,
        [owner, addr1],
        [-50, 50]
      )
      console.log("Owner balance :", await hardhatToken.balanceOf(owner.address))

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50)).to.changeTokenBalances(
        hardhatToken,
        [addr1, addr2],
        [-50, 50]
      )
      console.log("Addr 2 balance :", await hardhatToken.balanceOf(addr2.address))
    })

    // it("should emit Transfer events", async function () {
    //   const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)

    //   // Transfer 50 tokens from owner to addr1
    //   await expect(hardhatToken.transfer(addr1.address, 50))
    //     .to.emit(hardhatToken, "Transfer")
    //     .withArgs(owner.address, addr1.address, 50)

    //   // Transfer 50 tokens from addr1 to addr2
    //   // We use .connect(signer) to send a transaction from another account
    //   await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
    //     .to.emit(hardhatToken, "Transfer")
    //     .withArgs(addr1.address, addr2.address, 50)
    // })

    // it("Should fail if sender doesn't have enough tokens", async function () {
    //   const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture)
    //   const initialOwnerBalance = await hardhatToken.balanceOf(owner.address)

    //   // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    //   // `require` will evaluate false and revert the transaction.
    //   await expect(hardhatToken.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith(
    //     "Not enough tokens"
    //   )

    //   // Owner balance shouldn't have changed.
    //   expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance)
    // })
  })
})
