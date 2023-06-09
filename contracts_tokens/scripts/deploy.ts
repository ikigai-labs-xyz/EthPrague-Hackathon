import { ethers } from "hardhat"

async function main() {
  const initialSupply = 1000

  const coins = [
    { initialSupply, name: "USDC", symbol: "USDC" },
    { initialSupply, name: "Good Coin", symbol: "GCOIN" },
    { initialSupply, name: "Bad Coin", symbol: "BCOIN" },
  ]

  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with the account:", deployer.address)

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log(
    `Account balance before deployment: ${ethers.formatEther(balance)} ETH`
  )

  const Coin = await ethers.getContractFactory("Coin")

  const deployedCoins = await Promise.all(
    coins.map(async (coin) => {
      const c = await Coin.deploy(coin.initialSupply, coin.name, coin.symbol)
      return c.waitForDeployment()
    })
  )

  for (const coin of deployedCoins) {
    console.log(
      `${await coin.name()}, ${await coin.symbol()} deployed to ${coin.target}`
    )
  }

  console.log(
    `Account balance after deployment: ${ethers.formatEther(balance)} ETH`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
