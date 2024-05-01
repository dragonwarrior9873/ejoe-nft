// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const Marketplace = await hre.ethers.getContractFactory("MarketPlace");
  const marketplace = await Marketplace.connect(deployer).deploy();
  console.log("Marketplace deployed to: ", marketplace.target);
  saveFrontendFiles(marketplace, "MarketPlace");

  //   const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  //   const rewardToken = await RewardToken.connect(deployer).deploy();
  //   console.log("RewardToken deployed to: ", rewardToken.target);
  //   saveFrontendFiles(rewardToken, "RewardToken");

  //   const StakeSystem = await hre.ethers.getContractFactory("StakeSystem");
  //   const stakeSystem = await StakeSystem.connect(deployer).deploy(
  //     rewardToken.target,
  //     2
  //   );
  //   console.log("StakeSystem deployed to: ", stakeSystem.target);
  //   saveFrontendFiles(stakeSystem, "StakeSystem");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.target }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);
  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
