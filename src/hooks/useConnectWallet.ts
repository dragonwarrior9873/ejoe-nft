import Web3, { eth } from "web3";
import { getUserNamePicByEthAddress } from "@/apis/profile.apis";
import { store } from "@/lib/store";
import { setEthAccount } from "@/lib/features/userSlice";
import { ErrorToast } from "@/components/Toast/Error";
import { SuccessToast } from "@/components/Toast/Success";

// interface WindowWithEthereum extends Window {
//   ethereum?: any; // Ethereum object in window, optional
// }
// export const WalletInstance = window as WindowWithEthereum;
// const useConnectMetaMask = async (): Promise<boolean> => {
//   // const windowWithEthereum = window as WindowWithEthereum;
//   // const ethereum = windowWithEthereum.ethereum;
//   const ethereum = window.ethereum;
//   if (!ethereum) {
//     ErrorToast({ message: "MetaMask is not available in your browser.💔" });
//     console.error("MetaMask is not available in your browser.");
//     return false; // Return false if MetaMask is not available
//   }

//   try {
//     // Request accounts to connect
//     const accounts = await ethereum.request({ method: "eth_requestAccounts" });

//     // Initialize Web3 with Ethereum provider
//     const web3 = new Web3(ethereum);

//     // Select the first account
//     const selectedAccount = accounts[0];

//     if (!selectedAccount) {
//       ErrorToast({ message: "No account found.💔" });
//       console.error("No account found.");
//       return false; // Return false if no account is found
//     }

//     // Get the balance in Wei and convert it to Ether
//     const balanceInWei = await web3.eth.getBalance(selectedAccount);
//     console.log(balanceInWei);

//     const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");

//     // Get the user profile
//     const userProfile = await getUserNamePicByEthAddress(selectedAccount);

//     // Dispatch the account data to the Redux store
//     store.dispatch(
//       setEthAccount({
//         isConnect: true,
//         account: selectedAccount,
//         balance: balanceInEther,
//         userName: userProfile?.userName ?? "",
//         userAvatar: userProfile?.userProfile ?? "",
//       })
//     );

//     // Save the connection status to local storage
//     localStorage.setItem("IsNFTMetamaskConnect", "true");
//     SuccessToast({ message: "Metamask is connected 🎉" });
//     return true;
//   } catch (error) {
//     console.error("Failed to connect to MetaMask:", error);
//     ErrorToast({ message: "Failed to connect to MetaMask:💔" });
//     return false;
//   }
// };
const useConnectMetaMask = async (): Promise<boolean> => {
  const ethereum = window.ethereum;
  if (typeof ethereum !== "undefined") {

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      console.log("connected to MetaMask with address: ", address);
      const web3 = new Web3(ethereum);
      const balanceInWei = await web3.eth.getBalance(address);
      console.log(balanceInWei);

      // Getting the current network ID
      console.log("Current network ID:", ethereum.networkVersion);

      const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
      const userProfile = await getUserNamePicByEthAddress(address);
      console.log(userProfile);

      store.dispatch(
        setEthAccount({
          userId: userProfile?._id,
          isConnect: true,
          account: address,
          balance: balanceInEther,
          userName: userProfile?.userName ?? "",
          userAvatar: userProfile?.userProfile ?? "",
        })
      );
      localStorage.setItem("IsNFTMetamaskConnect", "true");
      SuccessToast({ message: "Metamask is connected 🎉" });
      SuccessToast({ message: `Balance is ${balanceInEther} ETH` });
      return true;
    } catch (error: Error | any) {
      ErrorToast({ message: "Failed to connect to MetaMask:💔" });
      return false;
    }
  }
};
export default useConnectMetaMask;
