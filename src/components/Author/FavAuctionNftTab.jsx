import React, { useEffect } from "react";
import { useState } from "react";
import Loader from "../../shared/Loader/Loader";
import CardNFT2 from "../CardNFT2";
import { fetchFavNFTById } from "../../hooks/useFetchFavNfts";
import { ErrorToast } from "@/components/Toast/Error";
function FavAuctionTab({ params, userDetail }) {
  const [loading, setLoading] = useState(false);
  const [favNft, setFavNft] = useState(null);
  const getFavouriteAuctionNFTs = async () => {
    try {
      setLoading(true);
      const nftIds = [
        ...userDetail?.FavoriteAuctionNfts?.map((nft) => nft.NFTid),
      ];
      const nftPromises = nftIds.map((id) => fetchFavNFTById(id));
      const nfts = await Promise.all(nftPromises);

      setFavNft(nfts);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      ErrorToast({ message: "Something wrong. Please refresh the page" });
    }
  };

  useEffect(() => {
    if (params?.id && !favNft) {
      getFavouriteAuctionNFTs();
    }
  }, [params]);

  return (
    <div>
      {loading ? (
        <div className="w-full mt-28 mb-20 flex items-center justify-center">
          <Loader className="w-6 h-6" />
        </div>
      ) : (
        <>
          {favNft?.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
              {favNft?.map((item, index) => (
                <CardNFT2 key={index} data={item} />
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

export default FavAuctionTab;
