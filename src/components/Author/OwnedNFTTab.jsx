import React, { useEffect } from "react";
import { useState } from "react";
import Loader from "../../shared/Loader/Loader";
import CardNFT from "../CardNFT";
import { fetchOwnedNFT } from "@/hooks/useFetchNftByUser";
import { mapArray } from "../../utils/mapArray";
import { ErrorToast } from "@/components/Toast/Error";
function OwnedNFTTab({ params }) {
  const [loading, setLoading] = useState("");
  const [ownedNft, setOwnedNft] = useState(null);
  const getUserOwnedNFT = async () => {
    try {
      setLoading("ownedNft");
      const response = await fetchOwnedNFT(params?.id);
      const OwnedData = await Promise.all(
        response.owned.map(async (item) => {
          return mapArray(item);
        })
      );

      setOwnedNft(OwnedData);
      setLoading("");
    } catch (error) {
      console.log(error);
      setLoading("");
      ErrorToast({
        message: "Something went wrong.Please refresh the page!!",
      });
    }
  };
  useEffect(() => {
    if (params?.id && !ownedNft) {
      getUserOwnedNFT();
    }
  }, [params]);

  return (
    <div>
      {loading === "ownedNft" ? (
        <div className="w-full mt-28 mb-20 flex items-center justify-center">
          <Loader className="w-6 h-6" />
        </div>
      ) : (
        <>
          {ownedNft?.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
              {ownedNft?.map((item, index) => (
                <CardNFT key={index} data={item} />
              ))}
            </div>
          ) : (
            <div className="w-full mt-28 mb-20 flex items-center justify-center">
              <span className="text-neutral-700 dark:text-neutral-400 text-xs">
                OOPS! No NFT FOUND
              </span>
            </div>
          )}
        </>
      )}

      {/* <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
          <Pagination />
          <ButtonPrimary loading>Show me moresss</ButtonPrimary>
        </div> */}
    </div>
  );
}

export default OwnedNFTTab;
