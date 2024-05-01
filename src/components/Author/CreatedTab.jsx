import React, { useEffect } from "react";
import { useState } from "react";
import Loader from "../../shared/Loader/Loader";
import CardNFT from "../CardNFT";
import { fetchCreatedNFT } from "@/hooks/useFetchNftByUser";
import { mapArray } from "../../utils/mapArray";
import { ErrorToast } from "@/components/Toast/Error";
function CreatedTab({ params }) {
  const [loading, setLoading] = useState("");
  const [createdNft, setCreatedNft] = useState(null);
  const getUserCreatedNFT = async () => {
    try {
      setLoading("createdNft");
      const response = await fetchCreatedNFT(params?.id);
      const CreatedData = await Promise.all(
        response.Created.map(async (item) => {
          return mapArray(item);
        })
      );

      setCreatedNft(CreatedData);
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
    if (params?.id && !createdNft) {
      getUserCreatedNFT();
    }
  }, [params]);

  return (
    <div>
      {loading === "createdNft" ? (
        <div className="w-full mt-28 mb-20 flex items-center justify-center">
          <Loader className="w-6 h-6" />
        </div>
      ) : (
        <>
          {createdNft?.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
              {createdNft?.map((item, index) => (
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

export default CreatedTab;
