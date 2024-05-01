"use client";

import React, { FC, useEffect, useState } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import NcImage from "@/shared/NcImage/NcImage";
import ItemTypeImageIcon from "./ItemTypeImageIcon";
import LikeButton from "./LikeButton";
import ItemTypeVideoIcon from "./ItemTypeVideoIcon";
import Prices from "./Prices";
import RemainingTimeNftCard from "./RemainingTimeNftCard";
import Link from "next/link";
import useGetRandomData from "@/hooks/useGetRandomData";
import {
  addNFTFavorite,
  checkIsFav,
  getUserNamePicByEthAddress,
} from "@/apis/profile.apis";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { ErrorToast } from "./Toast/Error";
import { SuccessToast } from "./Toast/Success";

export interface CardNFT2Props {
  className?: string;
  isLiked?: boolean;
  data?: NFTData | null;
}
// Define the interface for the NFT data
interface NFTData {
  NFTid: number;
  isAuction: boolean;
  price: string;
  Owner: string;
  createdBy: string;
  Uri: string;
  image: string;
  name: string;
  properties: string;
  description: string;
  category: string;
  fileType?: string;
  createAt?: number;
  endTime?: any;
  highestBid: string;
  highestBidder: string;
}
interface userData {
  userProfile: string;
  userName: string;
}
const CardNFT2: FC<CardNFT2Props> = ({ className = "", isLiked, data }) => {
  const { titleRd, nftImageRd } = useGetRandomData();
  const EthAccount = useSelector((state: RootState) => state.user);
  const [NFTsCreatorDetails, setNFTsCreatorDetails] = useState<userData>();
  const [isFav, setIsFav] = useState(false);
  console.log(NFTsCreatorDetails);
  const [itemType, setItemType] = useState<"video" | "audio" | "default">(
    "default"
  );

  const handleFavorite = async () => {
    if (!EthAccount.isConnect) {
      ErrorToast({ message: "Wallet not connect ! 💔" });
      return null;
    }
    try {
      const result = await addNFTFavorite(EthAccount.account, {
        isAuction: data.isAuction,
        NFTid: data?.NFTid,
        createdBy: data.createdBy,
        image: data.image,
        price: data.price,
      });
      if (result.success) {
        setIsFav(!isFav);
        SuccessToast({ message: result.message });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Fetch creator details if data and createdBy are available
    const fetchCreatorDetails = async () => {
      if (data && data.createdBy) {
        try {
          const [response, isFavourite] = await Promise.all([
            getUserNamePicByEthAddress(data.createdBy),
            checkIsFav(EthAccount.account, data?.image, data?.NFTid),
          ]);
          console.log(isFavourite);
          // const response = await getUserNamePicByEthAddress(data.createdBy);

          setIsFav(isFavourite?.isExist);
          console.log(response);

          setNFTsCreatorDetails(response);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchCreatorDetails();
  }, [data]);

  return (
    <div
      className={`nc-CardNFT2 relative bg-white dark:bg-neutral-900 rounded-3xl flex flex-col group p-2.5  ${className}`}
      data-nc-id="CardNFT2"
    >
      <div className="relative flex-shrink-0 ">
        <div>
          <NcImage
            containerClassName="flex relative aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0"
            src={data?.image || "/nft.svg"}
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
            fill
          />
        </div>

        {itemType === "video" && (
          <ItemTypeVideoIcon className="absolute bottom-2.5 right-2.5 w-7 h-7 md:w-9 md:h-9" />
        )}
        {itemType === "audio" && (
          <ItemTypeImageIcon className="absolute bottom-2.5 right-2.5 w-7 h-7 md:w-9 md:h-9" />
        )}

        {/* LIKE AND AVATARS */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-2">
          <LikeButton
            onClick={handleFavorite}
            liked={isFav}
            setIsLiked={setIsFav}
            className=" !h-9"
          />
          <Avatar
            containerClassName="ring-2 ring-white dark:ring-neutral-900"
            sizeClass="h-8 w-8 text-sm"
            imgUrl={
              NFTsCreatorDetails &&
              NFTsCreatorDetails?.userProfile &&
              Object.keys(NFTsCreatorDetails).length !== 0
                ? `${
                    process.env.NEXT_PUBLIC_BACKEND_BASE_URL
                  }/api/images?imageName=${encodeURIComponent(
                    NFTsCreatorDetails.userProfile
                  )}`
                : "/user-demo-avatar.svg"
            }
          />
        </div>

        {/* ----TIME--- */}
        <RemainingTimeNftCard
          contentClassName="right-5 top-1/2 -translate-y-1/2 pb-1"
          endTime={Number(data?.endTime) * 1000}
        />

        <div className="absolute left-[-1px] bottom-[-0.4px] ">
          <svg
            className="text-white dark:text-neutral-900 w-64 md:w-[281px]"
            width="281"
            viewBox="0 0 281 99"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0V99H258.059C248.54 99 239.92 93.3743 236.089 84.6606L205.167 14.3394C201.335 5.62568 192.716 0 183.197 0H0Z"
              fill="currentColor"
            />
          </svg>

          <div className="absolute left-4 bottom-0 w-48 ">
            <h2 className={`text-lg font-semibold `}>
              {" "}
              {data?.name?.length > 15
                ? data?.name?.slice(0, 15) + "..."
                : data?.name}
            </h2>

            <div className="w-full mt-1.5 flex justify-between items-end ">
              <Prices
                labelText="Current Bid"
                labelTextClassName="bg-white dark:bg-neutral-900"
                price={Number(data?.price).toFixed(4)}
              />
              <span className="block text-neutral-500 dark:text-neutral-400 text-xs">
                {data?.createAt ? moment.unix(data.createAt).fromNow() : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Link
        href={`/nft-detail/${data.NFTid}`}
        className="absolute inset-0"
      ></Link>
    </div>
  );
};

export default CardNFT2;
