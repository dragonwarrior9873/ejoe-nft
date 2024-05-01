// import Web3 from "web3";
// import marketAbi from "../contractsData/MarketPlace.json";
// import contractAddress from "../contractsData/MarketPlace-address.json";
// console.log(contractAddress);
// export const web3 =
//   window.ethereum ||
//   new Web3(
//     "https://eth-sepolia.g.alchemy.com/v2/_3PL2elsK7goLC6sStBMJc4-izywGxSk"
//   );
// // window.ethereum ||
// console.log(web3);
// let ContractInstance;
// if (web3) {
//   console.log("sss");
//   ContractInstance = new web3.eth.Contract(
//     marketAbi.abi,
//     contractAddress.address
//   );

//   if (ContractInstance.options.address) {
//     console.log("Connection to contract successful!");
//   } else {
//     console.log("Failed to connect to contract.");
//   }
// }

// export default ContractInstance;

import Web3 from "web3";
import { Contract } from "web3-eth-contract"; // Import the Contract type
import marketAbi from "../contractsData/MarketPlace.json";
import contractAddress from "../contractsData/MarketPlace-address.json";

export let web3: Web3 | undefined; // Exporting web3 variable
if (typeof window !== "undefined") {
  web3 = new Web3(
    (window as any).ethereum ||
      "https://eth-sepolia.g.alchemy.com/v2/_3PL2elsK7goLC6sStBMJc4-izywGxSk"
  );
}

let ContractInstance: Contract<any> | undefined; // Use Contract<any> as the Contract type with any ABI
if (web3) {
  console.log("sss");
  ContractInstance = new web3.eth.Contract(
    marketAbi.abi as any[], // Cast the ABI to 'any[]' due to limitation in ABI type definitions
    contractAddress.address
  );

  if (ContractInstance.options.address) {
    console.log("Connection to contract successful!");
  } else {
    console.log("Failed to connect to contract.");
  }
}

export default ContractInstance;
