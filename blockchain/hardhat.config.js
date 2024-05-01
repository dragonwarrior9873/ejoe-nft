require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.23", // Update to the desired Solidity version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
  },
  // paths: {
  //   artifacts: "./artifacts",
  // },
  networks: {
    // Define your networks here, such as "sepolia", "goerli", "mainnet", etc.
    // Example:
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/_3PL2elsK7goLC6sStBMJc4-izywGxSk",
      accounts: [
        "0x91b3b19cc0861dfb0b1edff11ff24b53f272b0e35dff8433b95bb2621591bd2e",
      ],
    },
  },
  // networks: {
  //   localhost: {
  //     url: "http://127.0.0.1:8545",
  //   },
  //   hardhat: {
  //     forking: {
  //       url: "https://eth-sepolia.g.alchemy.com/v2/_3PL2elsK7goLC6sStBMJc4-izywGxSk",
  //     },
  //   },
  // },
  mocha: {
    timeout: 40000,
  },
};
