"use client";

import React, { useEffect, useState } from "react";
import { Tab } from "@/app/headlessui";
import Avatar from "@/shared/Avatar/Avatar";
import VerifyIcon from "@/components/VerifyIcon";
import Link from "next/link";
import { NFTsActivityEvent } from "@/hooks/useFetchEventForNFT";
import { getUserNamePicByEthAddress } from "@/apis/profile.apis";
import { MdOutlineOpenInNew, MdShoppingCart } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import { web3 } from "@/hooks/useContract";
import moment from "moment";
const TabDetail = ({ profilePictures, NFTData, usdPrice }) => {
  const TABS = NFTData?.isAuction
    ? ["Bid History", "Activity", "Owner"]
    : ["Activity", "Owner"];

  const [NFTActivityTable, setNFTActivityTable] = useState([]);
  const [filter, setFilter] = useState("all");
  const calculateTimeAgo = (solidityTimestamp) => {
    const timeDifference =
      Math.abs(solidityTimestamp * 1000 - Date.now()) / 1000; // Convert Solidity timestamp to milliseconds
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInMonth = 2592000;
    const secondsInYear = 31536000;

    if (timeDifference < secondsInMinute) {
      return `${Math.floor(timeDifference)} seconds ago`;
    } else if (timeDifference < secondsInHour) {
      return `${Math.floor(timeDifference / secondsInMinute)} minutes ago`;
    } else if (timeDifference < secondsInDay) {
      return `${Math.floor(timeDifference / secondsInHour)} hours ago`;
    } else if (timeDifference < secondsInMonth) {
      return `${Math.floor(timeDifference / secondsInDay)} days ago`;
    } else if (timeDifference < secondsInYear) {
      return `${Math.floor(timeDifference / secondsInMonth)} months ago`;
    } else {
      return `${Math.floor(timeDifference / secondsInYear)} years ago`;
    }
  };

  useEffect(() => {
    const fetching = async () => {
      try {
        const activityTable = await NFTsActivityEvent(NFTData?.NFTId, filter);
        setNFTActivityTable(activityTable);
      } catch (error) {
        console.log(error);
      }
    };
    fetching();
  }, [NFTData?.NFTId, filter]);
  const renderTabBidHistory = () => {
    return (
      <ul className="">
        {NFTData?.nftBids?.length > 0 ? (
          NFTData?.nftBids?.map((item: any, index: number) => (
            <>
              {item?.bidder?.toLowerCase() ===
                NFTData?.highestBidder?.toLowerCase() && NFTData?.ended ? (
                <span className="text-neutral-500 dark:text-slate-400 font-semibold mb-2">
                  Winner
                </span>
              ) : (
                <span className="text-neutral-500 dark:text-slate-400 font-semibold mb-2">
                  Bidder
                </span>
              )}
              <li
                key={index}
                className={`relative py-4 ${
                  item?.bidder?.toLowerCase() ===
                    NFTData?.highestBidder?.toLowerCase() &&
                  NFTData?.ended &&
                  "bg-neutral-100 px-3 rounded-xl mb-5 dark:bg-slate-800 dark:hover:bg-slate-700 mt-3 "
                }`}
              >
                <Link
                  href={`/author/${item?.bidder}`}
                  className="flex items-center"
                >
                  <Avatar
                    imgUrl={
                      item?.image
                        ? `${
                            process.env.NEXT_PUBLIC_BACKEND_BASE_URL
                          }/api/images?imageName=${encodeURIComponent(
                            item?.image
                          )}`
                        : "/user-demo-avatar.svg"
                    }
                    sizeClass="h-10 w-10"
                    radius="rounded-full"
                  />
                  <span className="ml-4 text-neutral-500 dark:text-neutral-400 flex flex-col">
                    <span className="flex items-center text-sm">
                      <span className="">
                        {`Placed a bid $${(
                          usdPrice *
                          Number(
                            web3.utils.fromWei(
                              item?.amount?.toString(),
                              "ether"
                            )
                          )
                        ).toFixed(2)} by`}
                      </span>

                      <span className="font-medium text-neutral-900 dark:text-neutral-200 ml-1">
                        {item?.username?.startsWith("0x")
                          ? item?.username?.length > 15
                            ? item?.username.slice(0, 6) +
                              ".." +
                              item?.username.slice(38)
                            : item?.username
                          : item?.username}
                      </span>
                    </span>
                    <span className="text-xs mt-1">
                      {moment
                        .unix(Number(item?.timestamp))
                        .format("MMM D - h:mm A")}
                    </span>
                  </span>
                </Link>
              </li>
            </>
          ))
        ) : (
          <div className="w-full mt-32 flex items-center justify-center">
            <span className="text-neutral-400 dark:text-slate-400 font-normal mb-2">
              No Bid found!!
            </span>
          </div>
        )}
      </ul>
    );
  };

  const renderTabActivity = () => {
    return (
      <div id="Activity" className="flex h-full  w-full flex-col gap-4">
        <div className="">
          <label
            htmlFor="countries"
            className="block mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-200"
          >
            Select a filter
          </label>
          <select
            id="countries"
            className="bg-darkBlue-600 dark:bg-slate-800 border sm:text-base text-sm border-gray-300   rounded-lg focus:ring-darkBlue-500 focus:border-darkBlue-500 block w-full p-2.5  border-gray-600/30 placeholder-gray-500 text-neutral-500"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="76">sell</option>
            <option value="98">mint</option>
            <option value="77">bid</option>
          </select>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-max sm:w-full h-full relative text-sm text-left rtl:text-right  text-neutral-500">
            <thead className="text-xs  sticky top-0 uppercase bg-darkBlue-600 text-neutral-700 dark:text-neutral-200">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Event
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  From
                </th>
                <th scope="col" className="px-6 py-3">
                  To
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {NFTActivityTable?.map((item, index) => (
                <tr
                  key={index}
                  className=" border-b bg-darkBlue-500 border-gray-700  hover:bg-darkBlue-400"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium  whitespace-nowrap text-neutral-500 dark:text-neutral-100"
                  >
                    <div className="flex items-center gap-1">
                      {item.action == "mint" ? <BsStars /> : <MdShoppingCart />}
                      {item.action.toUpperCase()}
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    {Number(item.price).toFixed(4)} ETH
                  </td>
                  <td className="px-6 py-4">{`${item.from.slice(
                    0,
                    6
                  )}...${item.from.slice(39)}`}</td>
                  <td className="px-6 py-4">{`${item.to.slice(
                    0,
                    6
                  )}...${item.to.slice(39)}`}</td>
                  <td className="px-6 py-4">
                    <a
                      href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORE_URL}/tx/${item.transactionHash}`}
                      className="font-medium flex gap-1 items-center text-blue-500 hover:underline"
                      target="_blank"
                    >
                      {calculateTimeAgo(item.time)}
                      <MdOutlineOpenInNew />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      // <ul className="divide-y divide-neutral-100 dark:divide-neutral-700">
      //   {NFTActivityTable?.map((item, index) => (
      //     <li
      //       key={index}
      //       className={`relative py-4 ${
      //         index % 2 === 1 ? "bg-neutradl-100" : ""
      //       }`}
      //     >
      //       <Link href={"/author"} className="flex items-center">
      //         <Avatar imgUrl={item && item?.image?`${
      //                   process.env.NEXT_PUBLIC_BACKEND_BASE_URL
      //                 }/api/images?imageName=${encodeURIComponent(
      //                   item?..creator
      //                 )}`:"/user-demo-avatar.svg"} sizeClass="h-10 w-10" radius="rounded-full" />
      //         <span className="ml-4 text-neutral-500 dark:text-neutral-400 flex flex-col">
      //           <span className="flex items-center text-sm">
      //             <span className="">{item?.action?.toUpperCase()} BY</span>

      //             <span className="font-medium text-neutral-900 dark:text-neutral-200 ml-1">
      //               Martoutaa
      //             </span>
      //           </span>
      //           <span className="text-xs mt-1">Jun 14 - 4:12 PM</span>
      //         </span>
      //       </Link>
      //     </li>
      //   ))}
      // </ul>
    );
  };
  const renderTabOwner = () => {
    const ownerId =
      NFTData?.CurrentOwner === "0x0000000000000000000000000000000000000000"
        ? NFTData?.Creator
        : NFTData?.CurrentOwner;
    const ownerName =
      NFTData?.CurrentOwner === "0x0000000000000000000000000000000000000000"
        ? profilePictures?.creatorName ||
          (NFTData?.Creator
            ? `${NFTData?.Creator.slice(0, 6)}..${NFTData?.Creator.slice(38)}`
            : null)
        : profilePictures?.ownerName ||
          (NFTData?.CurrentOwner
            ? `${NFTData?.CurrentOwner.slice(
                0,
                6
              )}..${NFTData?.CurrentOwner.slice(38)}`
            : null);
    const avatarImgUrl =
      NFTData?.CurrentOwner === "0x0000000000000000000000000000000000000000"
        ? profilePictures?.creator
          ? `${
              process.env.NEXT_PUBLIC_BACKEND_BASE_URL
            }/api/images?imageName=${encodeURIComponent(
              profilePictures.creator
            )}`
          : "/user-demo-avatar.svg"
        : profilePictures?.owner
        ? `${
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL
          }/api/images?imageName=${encodeURIComponent(profilePictures.owner)}`
        : "/user-demo-avatar.svg";
    return (
      <Link href={`/author/${ownerId}`} className="flex items-center py-4">
        <Avatar
          imgUrl={avatarImgUrl}
          sizeClass="h-11 w-11"
          radius="rounded-full"
        />
        <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
          <span className="text-sm">Owner</span>
          <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
            {ownerName}
            <VerifyIcon iconClass="w-4 h-4" />
          </span>
        </span>
      </Link>
    );
  };

  const renderTabItem = (item: string) => {
    switch (item) {
      case "Bid History":
        return renderTabBidHistory();

      case "Activity":
        return renderTabActivity();

      case "Owner":
        return renderTabOwner();

      default:
        return null;
    }
  };

  return (
    <div className="w-full pdx-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex justify-start pd-1 space-x-2.5 rounded-full bordedr border-neutral-300 dark:border-neutral-500">
          {TABS.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `px-3.5 sm:px-8 py-1.5 sm:py-2 text-xs sm:text-sm leading-5 font-medium rounded-full focus:outline-none focus:ring-2 ring-primary-300 ${
                  selected
                    ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                    : "text-neutral-700 dark:text-neutral-300 bg-neutral-100/70 dark:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {TABS.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={
                "rounded-xl focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 "
              }
            >
              {renderTabItem(tab)}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default TabDetail;
