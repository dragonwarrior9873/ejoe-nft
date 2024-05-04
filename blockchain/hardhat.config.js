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
  defaultNetwork: "op_sepolia",
  networks: {
    // Define your networks here, such as "sepolia", "goerli", "mainnet", etc.
    // Example:
    op_sepolia: {
      url: "https://sepolia.optimism.io",
      accounts: [
        "0xe561a8dab4282f12b078e8cb3531cc3776c4fb321fd266de86e67a6a33959e30",
      ],
    },
  },
  etherscan: {
    apiKey: {
      op_sepolia: "7W4EKPGF42PE7P5FT1PP4YHG51NIW3P8KT",
    },
    customChains: [
      {
        network: "op_sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io/"
        }
      },
    ]
  },
  mocha: {
    timeout: 40000,
  },
};
