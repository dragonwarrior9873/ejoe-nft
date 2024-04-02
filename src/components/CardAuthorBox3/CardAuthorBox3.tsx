"use client";

import React, { FC } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import NcImage from "@/shared/NcImage/NcImage";
import VerifyIcon from "@/components/VerifyIcon";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import useGetRandomData from "@/hooks/useGetRandomData";

export interface CardAuthorBox3Props {
  className?: string;
  following?: boolean;
}

const CardAuthorBox3: FC<CardAuthorBox3Props> = ({
  className = "",
  following,
}) => {
  const { personNameRd, nftsAbstractRd } = useGetRandomData();
  const { nftsAbstractRd: nftsAbstractRd2 } = useGetRandomData();
  const { nftsAbstractRd: nftsAbstractRd3 } = useGetRandomData();

  return (
    <div
      className={`nc-CardAuthorBox3 relative flex flex-col p-4 overflow-hidden [ nc-box-has-hover ] [ nc-dark-box-bg-has-hover ] ${className}`}
    >
      <div className="relative flex-shrink-0 flex space-x-2 h-24">
        <NcImage
          sizes="100px"
          containerClassName="relative z-0 flex flex-grow h-full rounded-xl overflow-hidden "
          src={nftsAbstractRd}
          fill
        />
        <NcImage
          sizes="100px"
          containerClassName="relative z-0 flex h-full w-24 flex-shrink-0 rounded-xl overflow-hidden"
          src={nftsAbstractRd2}
          fill
        />
        <NcImage
          sizes="100px"
          containerClassName="relative z-0 flex flex-grow h-full rounded-xl overflow-hidden"
          src={nftsAbstractRd3}
          fill
        />
      </div>

      <div className="-mt-6">
        <div className="text-center">
          <Avatar
            containerClassName="ring-4 ring-white dark:ring-black !shadow-xl"
            sizeClass="w-12 h-12 text-2xl"
            radius="rounded-full"
          />
        </div>
        <div className="mt-2.5 flex items-start justify-between">
          <div>
            <h2 className={`text-base font-medium flex items-center`}>
              <span className="">{personNameRd}</span>
              <VerifyIcon />
            </h2>
            <span
              className={`block mt-0.5 text-sm text-neutral-500 dark:text-neutral-400`}
            >
              @creator
            </span>
          </div>
          <FollowButton isFollowing={following} />
        </div>
        <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          X-Metaverse is a Star Wars game based on NFT+ blockchain exploration,
          mining, trading ...
        </div>
      </div>

      <Link href={"/author"} className="absolute inset-0"></Link>
    </div>
  );
};

export default CardAuthorBox3;
