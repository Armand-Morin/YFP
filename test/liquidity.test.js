const { expect } = require("chai")
const { ethers } = require("hardhat")

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
//const DAI_WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"
//const USDC_WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"

const DAI_WHALE = "0xC131701Ea649AFc0BfCc085dc13304Dc0153dc2e"
const USDC_WHALE = "0xC131701Ea649AFc0BfCc085dc13304Dc0153dc2e"

describe("LiquidityExamples", () => {
  let liquidityExamples
  let accounts
  let dai
  let usdc

  before(async () => {
    accounts = await ethers.getSigners()

    const LiquidityExamples = await ethers.getContractFactory(
      "LiquidityExamples"
    )
    liquidityExamples = await LiquidityExamples.deploy()
    await liquidityExamples.deployed()

    dai = await ethers.getContractAt("IERC20", DAI)
    usdc = await ethers.getContractAt("IERC20", USDC)

    // Unlock DAI and USDC whales
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    })
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_WHALE],
    })

    const daiWhale = await ethers.getSigner(DAI_WHALE)
    const usdcWhale = await ethers.getSigner(USDC_WHALE)

    // Send DAI and USDC to accounts[0]
    const daiAmount = 1000n * 10n ** 18n
    const usdcAmount = 1000n * 10n ** 6n

    expect(await dai.balanceOf(daiWhale.address)).to.gte(daiAmount)
    expect(await usdc.balanceOf(usdcWhale.address)).to.gte(usdcAmount)

    await dai.connect(daiWhale).transfer(accounts[0].address, daiAmount)
    await usdc.connect(usdcWhale).transfer(accounts[0].address, usdcAmount)

    console.log("--- Send tokens to user ---")
    console.log(
      "User's Token0 balance: ",
      await dai.balanceOf(accounts[0].address)
    )
    console.log(
      "User's Token1 balance: ",
      await usdc.balanceOf(accounts[0].address)
    )
  })

  it("mintNewPosition", async () => {
    const daiAmount = 500n * 10n ** 18n
    const usdcAmount = 500n * 10n ** 6n

    console.log("--- User sends tokens to YF contract ---")
    await dai
      .connect(accounts[0])
      .transfer(liquidityExamples.address, daiAmount)
    await usdc
      .connect(accounts[0])
      .transfer(liquidityExamples.address, usdcAmount)

    console.log(
      "Contract's Token0 balance: ",
      await dai.balanceOf(liquidityExamples.address)
    )
    console.log(
      "Contract's Token1 balance: ",
      await usdc.balanceOf(liquidityExamples.address)
    )
    
    console.log("--- Providing liquidity ---")

    await liquidityExamples.mintNewPosition()

    console.log(
      "Contract's Token0 balance: ",
      await dai.balanceOf(liquidityExamples.address)
    )
    console.log(
      "Contract's Token1 balance: ",
      await usdc.balanceOf(liquidityExamples.address)
    )
  })

  it("decreaseLiquidity", async () => {
    const tokenId = await liquidityExamples.tokenId()
    const liquidity = await liquidityExamples.getLiquidity(tokenId)

    console.log("--- decrease liquidity ---")
    await liquidityExamples.decreaseLiquidity(liquidity)

    console.log(`liquidity ${liquidity}`)
    //console.log(`dai ${await dai.balanceOf(liquidityExamples.address)}`)
    //console.log(`usdc ${await usdc.balanceOf(liquidityExamples.address)}`)
    console.log(
      "Contract's Token0 balance: ",
      await dai.balanceOf(liquidityExamples.address)
    )
    console.log(
      "Contract's Token1 balance: ",
      await usdc.balanceOf(liquidityExamples.address)
    )
  })

  it("collectAllFees", async () => {
    console.log("--- Collecting fees ---")

    await liquidityExamples.collectAllFees()

    //console.log(`dai ${await dai.balanceOf(liquidityExamples.address)}`)
    //console.log(`usdc ${await usdc.balanceOf(liquidityExamples.address)}`)
    console.log(
      "Contract's Token0 balance: ",
      await dai.balanceOf(liquidityExamples.address)
    )
    console.log(
      "Contract's Token1 balance: ",
      await usdc.balanceOf(liquidityExamples.address)
    )
  }) 
  

  // it.skip("increaseLiquidityCurrentRange", async () => {
  //   const daiAmount = 20n * 10n ** 18n
  //   const usdcAmount = 20n * 10n ** 6n

  //   await dai.connect(accounts[0]).approve(liquidityExamples.address, daiAmount)
  //   await usdc
  //     .connect(accounts[0])
  //     .approve(liquidityExamples.address, usdcAmount)

  //   await liquidityExamples.increaseLiquidityCurrentRange(daiAmount, usdcAmount)
  // })


})