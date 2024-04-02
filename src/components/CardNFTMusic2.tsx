"use client";

import React, { FC } from "react";
import { nftsAbstracts } from "@/contains/fakeData";
import Avatar from "@/shared/Avatar/Avatar";
import NcImage from "@/shared/NcImage/NcImage";
import Prices from "./Prices";
import useGetRandomData from "@/hooks/useGetRandomData";
import Link from "next/link";
import ButtonPlayMusicPlayer from "./ButtonPlayMusicPlayer";

export interface CardNFTMusic2Props {
  className?: string;
  featuredImage?: string;
}

const CardNFTMusic2: FC<CardNFTMusic2Props> = ({
  className = "",
  featuredImage = nftsAbstracts[18],
}) => {
  const { nftAudioUrlRl } = useGetRandomData();

  const renderAvatars = () => {
    return (
      <div className="hidden sm:flex -space-x-1.5 ">
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-800"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-800"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-800"
          sizeClass="h-5 w-5 text-sm"
        />
      </div>
    );
  };

  const renderIcon = (state?: "playing") => {
    switch (state) {
      case "playing":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M15.25 6.75V17.25"
            ></path>
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8.75 6.75V17.25"
            ></path>
          </svg>
        );

      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M18.25 12L5.75 5.75V18.25L18.25 12Z"
            ></path>
          </svg>
        );
    }
  };

  const renderDefaultBtnListen = (state?: "playing") => {
    return (
      <span className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white dark:bg-neutral-900/50 text-primary-6000 dark:text-primary-200 shadow-lg cursor-pointer">
        {renderIcon(state)}
      </span>
    );
  };

  return (
    <div
      className={`nc-CardNFTMusic2 relative flex justify-between p-2 space-x-2 rounded-3xl bg-neutral-100 dark:bg-neutral-800 hover:shadow-xl transition-shadow ${className}`}
      data-nc-id="CardNFTMusic2"
    >
      <Link href={"/nft-detail"} className="flex-grow flex space-x-4">
        <div className="relative w-16 sm:w-24">
          <NcImage
            containerClassName="absolute inset-0 rounded-2xl overflow-hidden shadow-lg z-0"
            src={featuredImage}
            fill
          />
        </div>

        <div className="flex flex-col justify-center flex-grow">
          <h2 className={`block font-medium sm:text-lg`}>NFT music #114</h2>
          <div className=" flex items-center pt-3 mt-1.5">
            {renderAvatars()}
            <Prices
              price="1.00 ETH"
              labelText="Price"
              className="sm:ml-3.5"
              contentClass="py-1.5 px-2 sm:px-3 text-xs sm:text-sm font-semibold"
              labelTextClassName="bg-neutral-100 dark:bg-neutral-800 "
            />
            <span className="block ml-3.5 text-neutral-500 dark:text-neutral-400 text-xs">
              1 of 100
            </span>
          </div>
        </div>
      </Link>

      <ButtonPlayMusicPlayer
        url={nftAudioUrlRl}
        className="relative z-10 self-center"
        renderDefaultBtn={() => renderDefaultBtnListen()}
        renderPlayingBtn={() => renderDefaultBtnListen("playing")}
      />
    </div>
  );
};

export default CardNFTMusic2;
