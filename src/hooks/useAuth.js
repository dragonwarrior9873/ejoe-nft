import ContractInstance from "./useContract";

const CheckIsOwner = async (NftId, currentOwner) => {
  try {
    const response = await ContractInstance.methods.ownerOf(NftId).call();
    const areOwnersTheSame =
      response.toLowerCase() === currentOwner.toLowerCase();
    return areOwnersTheSame;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export { CheckIsOwner };
