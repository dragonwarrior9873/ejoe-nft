"use client";
import React, { FC, useEffect, useState } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import NcImage from "@/shared/NcImage/NcImage";
import ItemTypeImageIcon from "./ItemTypeImageIcon";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import { ClockIcon } from "@heroicons/react/24/outline";
import ItemTypeVideoIcon from "./ItemTypeVideoIcon";
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
}
interface userData {
  userProfile: string;
  userName: string;
  userEthAddress: String;
}

// Define the interface for the CardNFT component's props
interface CardNFTProps {
  className?: string;
  isLiked?: boolean;
  data?: NFTData | null;
}

const CardNFT: FC<CardNFTProps> = ({ className = "", isLiked, data }) => {
  console.log(data);
  const [itemType, setItemType] = useState<"video" | "audio" | "default">(
    "default"
  );
  const EthAccount = useSelector((state: RootState) => state.user);
  const [NFTsCreatorDetails, setNFTsCreatorDetails] = useState<userData>();
  const [isFav, setIsFav] = useState(false);
  console.log(NFTsCreatorDetails);

  useEffect(() => {
    // Randomly set itemType to either "video" or "audio"
    if (Math.random() > 0.5) {
      setItemType("video");
    } else {
      setItemType("audio");
    }
  }, []);

  useEffect(() => {
    // Fetch creator details if data and createdBy are available
    const fetchCreatorDetails = async () => {
      if (data && data.createdBy) {
        try {
          const [response, isFavourite] = await Promise.all([
            getUserNamePicByEthAddress(data.createdBy),
            checkIsFav(EthAccount.account, data?.image, data?.NFTid),
          ]);
          // const response = await getUserNamePicByEthAddress(data.createdBy);
          // console.log(response);
          setIsFav(isFavourite?.isExist);
          setNFTsCreatorDetails(response);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchCreatorDetails();
  }, [data]);
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
  return (
    <div className={`nc-CardNFT relative flex flex-col group ${className}`}>
      <div className="relative flex-shrink-0">
        <Link href={`/nft-detail/${data?.NFTid}`}>
          <div>
            <NcImage
              containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0"
              src={data?.image || "/nft.svg"}
              fill={true}
              className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
            />
          </div>
        </Link>
        {data?.fileType === "video" && (
          <ItemTypeVideoIcon className="absolute top-3 left-3 !w-9 !h-9" />
        )}

        {data?.fileType === "audio" && (
          <ItemTypeImageIcon className="absolute top-3 left-3 !w-9 !h-9" />
        )}

        <LikeButton
          onClick={handleFavorite}
          liked={isFav}
          setIsLiked={setIsFav}
          className="absolute top-3 right-3 z-10 !h-9"
        />
      </div>

      <div className="px-2 py-5 space-y-3">
        <Link href={`/author/${NFTsCreatorDetails?.userEthAddress}`}>
          <div className="flex justify-start gap-4 items-start">
            <Avatar
              containerClassName="ring-2 ring-white dark:ring-neutral-900"
              sizeClass="h-12 w-12 text-sm"
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
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-neutral-700 dark:text-neutral-400 text-xs">
                Created by :
              </span>
              <span className="text-neutral-700 dark:text-neutral-400 text-xs">
                {NFTsCreatorDetails?.userName
                  ? NFTsCreatorDetails?.userName
                  : data?.createdBy
                  ? `${data?.createdBy.slice(0, 5)}...${data?.createdBy.slice(
                      38
                    )}`
                  : null}
              </span>
            </div>
          </div>
        </Link>
        <Link href={`/nft-detail/${data?.NFTid}`}>
          <h2 className={`text-lg font-medium`}>
            {data?.name?.length > 30
              ? data?.name?.slice(0, 30) + "..."
              : data?.name}
          </h2>
        </Link>

        <div className="w-full border-b border-neutral-200/70 dark:border-neutral-700"></div>

        <div className="flex justify-between items-end">
          <Prices
            labelTextClassName="bg-white dark:bg-neutral-900"
            price={Number(data?.price).toFixed(4)}
          />
          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            <ClockIcon className="w-4 h-4" />
            <span className="ml-1 mt-0.5">
              {data?.createAt ? moment.unix(data.createAt).fromNow() : ""}
            </span>
          </div>
        </div>
      </div>

      {/* <Link
        href={`/nft-detail/${data?.NFTid}`}
        className="absolute inset-0"
      ></Link> */}
    </div>
  );
};

export default CardNFT;
