"use client";

import FollowButton from "@/components/FollowButton";
import VerifyIcon from "@/components/VerifyIcon";
import React, { FC, useEffect, useState } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import Badge from "@/shared/Badge/Badge";
import Link from "next/link";
import useGetRandomData from "@/hooks/useGetRandomData";
import { web3 } from "@/hooks/useContract";

export interface CardAuthorBoxProps {
  item?: any;
  className?: string;
  index?: number;
}

const CardAuthorBox: FC<CardAuthorBoxProps> = ({
  item,
  className = "",
  index,
}) => {
  const { personNameRd } = useGetRandomData();
  const [balanceInEther, setBalanceInEther] = useState<number>();
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceInWei = await web3.eth.getBalance(item?.userEthAddress);
        const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
        setBalanceInEther(Number(balanceInEther));
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    if (item?.userEthAddress) {
      fetchBalance();
    }
  }, [item?.userEthAddress]);

  return (
    <Link
      href={`/author/${item?.userEthAddress}`}
      className={`nc-CardAuthorBox relative flex flex-col items-center justify-center text-center px-3 py-5 sm:px-6 sm:py-7  [ nc-box-has-hover ] [ nc-dark-box-bg-has-hover ] ${className}`}
    >
      <Badge
        className="absolute left-3 top-3"
        color={index === 1 ? "red" : index === 2 ? "blue" : "green"}
        name={`#${index}`}
      />

      <Avatar
        imgUrl={
          item?.userProfile
            ? `${
                process.env.NEXT_PUBLIC_BACKEND_BASE_URL
              }/api/images?imageName=${encodeURIComponent(item.userProfile)}`
            : "/user-demo-avatar.svg"
        }
        sizeClass="w-20 h-20 text-2xl"
        radius="rounded-full"
      />
      <div className="mt-3">
        <h2 className={`text-base font-semibold flex items-center`}>
          {item?.userName
            ? item?.userName
            : `${item?.userEthAddress.slice(
                0,
                7
              )}...${item?.userEthAddress.slice(38)}`}
          <VerifyIcon />
        </h2>
        <div className={`mt-1 text-sm font-medium`}>
          <span>{balanceInEther?.toFixed(4)}</span>
          {` `}
          <span className="text-neutral-400 font-normal">ETH</span>
        </div>
      </div>
      {/* <FollowButton className="mt-3" /> */}
    </Link>
  );
};

export default CardAuthorBox;
