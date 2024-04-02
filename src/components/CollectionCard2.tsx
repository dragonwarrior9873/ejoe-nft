"use client";

import React, { FC } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import NcImage from "@/shared/NcImage/NcImage";
import VerifyIcon from "./VerifyIcon";
import useGetRandomData from "@/hooks/useGetRandomData";
import Link from "next/link";

export interface CollectionCard2Props {
  className?: string;
  imgs?: string[];
}

const CollectionCard2: FC<CollectionCard2Props> = ({
  className,
  imgs = [],
}) => {
  const { nftImageRd, personNameRd } = useGetRandomData();
  const { nftImageRd: nftImageRd2 } = useGetRandomData();
  const { nftImageRd: nftImageRd3 } = useGetRandomData();
  const { nftImageRd: nftImageRd4 } = useGetRandomData();

  const nftImages = imgs.length
    ? imgs
    : [nftImageRd, nftImageRd2, nftImageRd3, nftImageRd4];

  return (
    <div className={`CollectionCard2 group relative ${className}`}>
      <div className="relative flex flex-col">
        <NcImage
          containerClassName="relative z-0 aspect-w-8 aspect-h-5"
          className="object-cover rounded-xl"
          src={nftImages[0]}
          sizes="(max-width: 600px) 480px, 33vw"
          fill
        />
        <div className="grid grid-cols-3 gap-1.5 mt-1.5">
          <NcImage
            fill
            containerClassName="relative w-full h-28"
            className="object-cover rounded-xl"
            src={nftImages[1]}
            sizes="150px"
          />
          <NcImage
            fill
            containerClassName="relative w-full h-28"
            className="object-cover rounded-xl"
            src={nftImages[2]}
            sizes="150px"
          />
          <NcImage
            fill
            containerClassName="relative w-full h-28"
            className="object-cover rounded-xl"
            src={nftImages[3]}
            sizes="150px"
          />
        </div>
      </div>
      <div className="relative mt-5 ">
        {/* TITLE */}
        <h2 className="font-semibold text-2xl group-hover:text-primary-500 transition-colors">
          Awesome collection
        </h2>
        {/* AUTHOR */}
        <div className="mt-2 flex justify-between">
          <div className="flex items-center  truncate">
            <Avatar sizeClass="h-6 w-6" />
            <div className="ml-2 text-sm truncate">
              <span className="font-normal hidden sm:inline-block">
                Creator
              </span>
              {` `}
              <span className="font-medium">{personNameRd}</span>
            </div>
            <VerifyIcon iconClass="w-4 h-4" />
          </div>
          <span className="mb-0.5 ml-2 inline-flex justify-center items-center px-2 py-1.5 border-2 border-secondary-500 text-secondary-500 rounded-md text-xs !leading-none font-medium">
            1.255 Items
          </span>
        </div>
      </div>
      <Link href={"/collection"} className="absolute inset-0 "></Link>
    </div>
  );
};

export default CollectionCard2;
