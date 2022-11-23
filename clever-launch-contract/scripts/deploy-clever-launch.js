// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const CleverLaunch = await hre.ethers.getContractFactory("CleverLaunch");
  // polygon: 0xb02861fbe5d1dd4dd94bbdf5ef097b1b988c65c0
  // goerli: 0xFf8cE0E67B86128273e8E66111ABac0F965f7789
  const cleverLaunch = await CleverLaunch.deploy('0xb02861fbe5d1dd4dd94bbdf5ef097b1b988c65c0');

  await cleverLaunch.deployed();

  console.log(`CleverLaunch deployed to ${cleverLaunch.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
