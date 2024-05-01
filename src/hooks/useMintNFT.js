import ContractInstance from "./useContract";
import { web3 } from "./useContract";
import { ethereumUsd } from "./useEtherUsdPrice";
import { WarringToast } from "@/components/Toast/Warring";

const MintNFT = async (
  _account,
  _price,
  _uri,
  _creatorFee,
  _approveNft,
  _auction,
  _startPrice,
  _endTime,
  _category,
  _fileType
) => {
  console.log(
    _account,
    _price,
    _uri,
    _creatorFee,
    _approveNft,
    _auction,
    _startPrice,
    _endTime,
    _category,
    _fileType
  );
  console.log(_price);
  const ether = Number(_price / (await ethereumUsd())).toFixed(18);
  console.log(ether);
  const _wei = web3.utils.toWei(ether, "ether");
  console.log(_wei);
  try {
    const response = await ContractInstance.methods
      .mintNFT(
        _uri,
        _creatorFee,
        _wei,
        _approveNft,
        _auction,
        _wei,
        _endTime,
        _category,
        _fileType
      )
      .send({
        from: _account,
      });
    // WarringToast("Waiting for transaction ....");
    console.log(response);
    return response;
  } catch (error) {
    console.log(error + " in useMintNFT ( Hook )");
    return error;
  }
};

export { MintNFT };
