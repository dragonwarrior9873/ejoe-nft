import React, { FC, useId } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import NcImage from "@/shared/NcImage/NcImage";
import { nftsImgs } from "@/contains/fakeData";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import VideoForNft from "./VideoForNft";
import Link from "next/link";

export interface CardNFTVideoProps {
  className?: string;
  featuredImage?: string;
  isLiked?: boolean;
}

const CardNFTVideo: FC<CardNFTVideoProps> = ({
  className = "",
  isLiked,
  featuredImage = nftsImgs[1],
}) => {
  const DEMO_NFT_ID = useId();

  const renderAvatars = () => {
    return (
      <div className="hidden sm:flex -space-x-1 ">
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
      </div>
    );
  };

  return (
    <div
      className={`nc-CardNFTVideo relative flex flex-col group ${className}`}
    >
      <div className="relative flex-shrink-0">
        <div className="relative aspect-w-16 aspect-h-9 w-full h-0 rounded-3xl overflow-hidden z-0">
          <VideoForNft featuredImage={featuredImage} />
        </div>

        <LikeButton
          liked={isLiked}
          className="absolute top-3 right-3 z-10 !h-9"
        />
      </div>

      <div className="p-5 relative">
        <Link href={"/nft-detail"} className="absolute inset-0"></Link>
        <div className="flex justify-between items-center">
          <h2 className={`sm:text-lg font-semibold hover:text-primary-6000`}>
            NFT Video #{Math.floor(Math.random() * 1000) + 1000}
          </h2>
          <div className="ml-2 flex items-center space-x-3">
            {renderAvatars()}
            <span className="text-neutral-700 dark:text-neutral-400 text-xs">
              1 of 100
            </span>
          </div>
        </div>

        <div className="flex justify-between items-end mt-3.5">
          <Prices labelTextClassName="bg-white dark:bg-neutral-900 " />
          <div className="text-right">
            <span className="block text-xs text-neutral-500 dark:text-neutral-400 font-normal tracking-wide">
              Remaining time
            </span>
            <span className="block font-semibold mt-0.5">3h : 15m : 20s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNFTVideo;
