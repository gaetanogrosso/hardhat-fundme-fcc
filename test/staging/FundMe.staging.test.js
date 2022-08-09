const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

// developmentChains.includes(network.name)
//     ? describe.skip // ? operator, staging only on testnets
//     : describe("FundMe", async function () {
//           let fundMe
//           let deployer
//           const sendValue = ethers.utils.parseEther("1")
//           beforeEach(async function () {
//               deployer = (await getNamedAccounts()).deployer
//               fundMe = await ethers.getContract("FundMe", deployer)
//           })
//           it("allows people to fund and withdraw", async function () {
//               await fundMe.fund({ value: sendValue })
//               await fundMe.withdraw()
//               const endingBalance = await fundMe.provider.getBalance(
//                   fundMe.address
//               )
//               assert.equal(endingBalance.toString(), "0")
//           })
//       })

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let deployer
          let fundMe
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal..."
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
