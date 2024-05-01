"use client";
import React, { useEffect, useState } from "react";
import BackgroundSection from "@/components/BackgroundSection/BackgroundSection";
import CardNFT from "@/components/CardNFT";
import HeaderFilterSearchPage from "@/components/HeaderFilterSearchPage";
import SectionBecomeAnAuthor from "@/components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import SectionSliderCollections from "@/components/SectionSliderCollections";
import ButtonCircle from "@/shared/Button/ButtonCircle";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Pagination from "@/shared/Pagination/Pagination";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { countNFTsByFilter, fetchNFTsByFilter } from "@/hooks/useFetchAllNFTs";
import { applyChanges, handleTradingNFTS } from "@/lib/features/NftSlice";
import HeaderFilterSection from "@/components/HeaderFilterSection";
import CardNFT2 from "@/components/CardNFT2";
import Loader from "@/shared/Loader/Loader";
import NcImage from "@/shared/NcImage/NcImage";
import authorBanner from "@/images/nfts/authorBanner.png";
import { useSearchParams } from "next/navigation";

const PageSearch = ({}) => {
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat");
  console.log(cat);

  const { rangePrices, apply, saleTypes, TradingNFTs } = useSelector(
    (state: RootState) => state.nft
  );
  console.log(saleTypes);

  const [loading, setLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const dispatch = useDispatch();
  const [tabActive, setTabActive] = useState(cat || "All NFTs");
  console.log(tabActive);

  const [count, setCount] = useState<number>(0);
  const mergeNFTArrays = (existingNFTs, newNFTs) => {
    const existingNFTMap = new Map(existingNFTs.map((nft) => [nft.NFTid, nft]));
    const mergedNFTs = [...existingNFTs];
    for (const newNFT of newNFTs) {
      if (!existingNFTMap.has(newNFT.NFTid)) {
        mergedNFTs.push(newNFT);
      }
    }

    // Return the merged array
    return mergedNFTs;
  };

  useEffect(() => {
    const fetching = async () => {
      try {
        setLoading(true);
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
          startIndex: startIndex,
          pageSize: 9,
        };

        console.log(filterOptions);

        const response = await fetchNFTsByFilter(filterOptions);
        console.log(response);

        const mergedNFTs = mergeNFTArrays(TradingNFTs, response);
        dispatch(handleTradingNFTS(mergedNFTs));
        const countNFT: number | any = await countNFTsByFilter(filterOptions);
        console.log(countNFT);
        setCount(Number(countNFT));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetching();
  }, [apply, startIndex]);
  useEffect(() => {
    if (cat) {
      dispatch(applyChanges());
    }
  }, [cat]);

  return (
    <div className={`nc-PageSearch `}>
      {/* <div
        className={`nc-HeadBackgroundCommon h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-50 dark:bg-neutral-800/20 `}
      /> */}
      <div className="relative w-full h-40 md:h-60 2xl:h-72">
        <NcImage
          containerClassName="absolute inset-0"
          src={"/images/nfts/authorBanner.png"}
          className="object-cover"
          fill
          sizes="100vw"
        />
      </div>
      {/* <div className="container">
        <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
          <form className="relative w-full" method="post">
            <label
              htmlFor="search-input"
              className="text-neutral-500 dark:text-neutral-300"
            >
              <span className="sr-only">Search all icons</span>
              <Input
                className="shadow-lg border-0 bg-white dark:!bg-neutral-800"
                id="search-input"
                type="search"
                placeholder="Type your keywords"
                sizeClass="pl-14 py-5 pr-5 md:pl-16"
                rounded="rounded-full"
              />

              <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 22L20 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <ButtonCircle
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                size=" w-11 h-11"
                type="submit"
              >
                <ArrowRightIcon className="w-5 h-5" />
              </ButtonCircle>
            </label>
          </form>
        </header>
      </div> */}

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <main>
          {/* FILTER */}
          <HeaderFilterSection
            setTabActive={setTabActive}
            tabActive={tabActive}
          />
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
                onClick={() => setStartIndex(startIndex + 1)}
                loading={loading}
              >
                Show me more
              </ButtonPrimary>
            </div>
          )}
          {/* PAGINATION */}
          {/* <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
            <Pagination />
            <ButtonPrimary loading>Show me more</ButtonPrimary>
          </div> */}
        </main>

        {/* === SECTION 5 === */}
        {/* <div className="relative py-16 lg:py-28">
          <BackgroundSection />
          <SectionSliderCollections />
        </div> */}

        {/* SUBCRIBES */}
        <SectionBecomeAnAuthor />
      </div>
    </div>
  );
};

export default PageSearch;
