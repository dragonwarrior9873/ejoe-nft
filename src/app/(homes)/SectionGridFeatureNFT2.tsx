"use client";
import React, { FC, useEffect, useState } from "react";
import HeaderFilterSection from "@/components/HeaderFilterSection";
import CardNFT2 from "@/components/CardNFT2";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { countNFTsByFilter, fetchNFTsByFilter } from "@/hooks/useFetchAllNFTs";
import CardNFT from "@/components/CardNFT";
import Loader from "@/shared/Loader/Loader";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { handleTradingNFTS } from "@/lib/features/NftSlice";

//
export interface SectionGridFeatureNFT2Props {}
const SectionGridFeatureNFT2: FC<SectionGridFeatureNFT2Props> = () => {
  const { rangePrices, apply, saleTypes, TradingNFTs } = useSelector(
    (state: RootState) => state.nft
  );

  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setloadMoreLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const dispatch = useDispatch();
  const [tabActive, setTabActive] = useState("All NFTs");
  const [count, setCount] = useState<number>(0);
  const mergeNFTArrays = (existingNFTs, newNFTs) => {
    const existingNFTMap = new Map(existingNFTs.map((nft) => [nft.NFTid, nft]));
    const mergedNFTs = [...existingNFTs];
    for (const newNFT of newNFTs) {
      if (!existingNFTMap.has(newNFT.NFTid)) {
        mergedNFTs.push(newNFT);
      }
    }
    return mergedNFTs;
  };
  const fetching = async (isLoad, offset) => {
    try {
      if (isLoad) {
        setLoading(true);
      } else {
        setloadMoreLoading(true);
      }

      const filterOptions = {
        category: tabActive,
        minPrice: rangePrices[0],
        maxPrice: rangePrices[1],
        includeBuyNow:
          saleTypes?.includes("All Sale Types") ||
          saleTypes?.includes("Buy now"),
        includeAuction:
          saleTypes?.includes("All Sale Types") ||
          saleTypes?.includes("On Auction"),
        sortByPriceLowToHigh: true,
        sortByPriceHighToLow: false,
        sortByEndingSoon: false,
        sortByMostFavorited: true,
        startIndex: offset,
        pageSize: 9,
      };
      const response = await fetchNFTsByFilter(filterOptions);

      const mergedNFTs = mergeNFTArrays(TradingNFTs, response);
      dispatch(handleTradingNFTS(mergedNFTs));
      const countNFT: number | any = await countNFTsByFilter(filterOptions);
      setCount(Number(countNFT));
      if (isLoad) {
        setLoading(false);
      } else {
        setloadMoreLoading(false);
      }
    } catch (error) {
      if (isLoad) {
        setLoading(false);
      } else {
        setloadMoreLoading(false);
      }
      console.log(error);
    }
  };
  useEffect(() => {
    fetching(true, startIndex);
  }, [apply]);
  return (
    <div className="nc-SectionGridFeatureNFT2 relative">
      <HeaderFilterSection setTabActive={setTabActive} tabActive={tabActive} />
      {loading ? (
        <div className="w-full mt-20 mb-20 flex items-center justify-center">
          <Loader className="h-5 w-5 text-primary-6000" />
        </div>
      ) : (
        <>
          {TradingNFTs?.length > 0 ? (
            <>
              <div
                className={`grid gap-6 lg:gap-8 sm:grid-cols-2 xl:grid-cols-3`}
              >
                {TradingNFTs?.map((item, index) => {
                  return (
                    <div key={index}>
                      {item?.isAuction ? (
                        <CardNFT2 key={index} data={item} />
                      ) : (
                        <CardNFT key={index} data={item} />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {" "}
              <div className="w-full mt-20 mb-20 flex items-center justify-center">
                <span className="text-neutral-700 dark:text-neutral-400 text-xs">
                  OOPS! No NFT FOUND
                </span>
              </div>
            </>
          )}
        </>
      )}

      {TradingNFTs?.length < count && (
        <div className="flex mt-16 justify-center items-center">
          <ButtonPrimary
            onClick={() => {
              fetching(false, startIndex + 1);
              setStartIndex(startIndex + 1);
            }}
            loading={loadMoreLoading}
          >
            Show me more
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
};

export default SectionGridFeatureNFT2;
