// we used to import, write the async main function, then call it
// now we do :

// either like this
// function deployFunc(hre) {
//     console.log("hi")
// }

// module.exports.default = deployFunc

// or like this: (as anonymous function)

// module.exports = async (hre) => { // hre = hardhat runtime environment
//     const { getNamedAccounts, deployments } = hre // pulling variables from hre
// }

const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
// { ... } lets us pull out just  the networkConfig from helper-hardhat-config

// or even like this(is the same like above)
module.exports = async ({ getNamedAccounts, deployments }) => {
    // need deployments for deploy, log functions
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //const ethUsdPriceFeedAddress = networkConfig[chainId] ["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    //verification, see utils folder:
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("---------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
