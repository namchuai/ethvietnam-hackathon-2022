require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const etherScanApiKey = "";
const polygonScanApiKey = "";
module.exports = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: polygonScanApiKey,
  },
  defaultNetwork: "mumbai",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/7-JEp3pCTX-bmCKmAYAjf3h17DFhKVXT",
      accounts: [""],
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [""],
    },
  },
};
