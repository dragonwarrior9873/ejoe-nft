"use client";
import React, { useEffect, useState } from "react";
import ItemTypeVideoIcon from "@/components/ItemTypeVideoIcon";
import LikeButton from "@/components/LikeButton";
import { nftsLargeImgs, personNames } from "@/contains/fakeData";
import NcImage from "@/shared/NcImage/NcImage";
import AccordionInfo from "@/components/AccordionInfo";
import Badge from "@/shared/Badge/Badge";
import LikeSaveBtns from "../LikeSaveBtns";
import Avatar from "@/shared/Avatar/Avatar";
import collectionPng from "@/images/nfts/collection.png";
import VerifyIcon from "@/components/VerifyIcon";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import TabDetail from "../TabDetail";
import TimeCountDown from "../TimeCountDown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchNFTById } from "@/hooks/useFetchNftById";
import {
  addNFTFavorite,
  checkIsFav,
  getUserDetailsByEthAddress,
  getUserNamePicByEthAddress,
} from "@/apis/profile.apis";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { address } from "../../../contractsData/MarketPlace-address.json";
import { ethereumUsd } from "@/hooks/useEtherUsdPrice";
import { CheckIsOwner } from "@/hooks/useAuth";
import { BuyNFT } from "@/hooks/useBuyNFT";
import moment from "moment";
import { ClockIcon } from "@heroicons/react/24/outline";
import Loader from "@/shared/Loader/Loader";
import { SuccessToast } from "@/components/Toast/Success";
import { ErrorToast } from "@/components/Toast/Error";
import ModalPlaceBid from "@/components/ModalPlaceBid";
import { ClaimNft } from "@/hooks/useClaimNFT";
import { createNotification } from "@/apis/notification.apis";
interface NFTResponse {
  NFTId: number;
  Price: string;
  startPrice?: string;
  auctionEnded?: number;
  CreateAt: number;
  creatorFees: string;
  IsListed: boolean;
  CurrentOwner: string;
  Image: string;
  Name: string;
  Properties: object;
  Description: string;
  Creator: string;
  Category: string;
  highestBid?: string;
  highestBidder?: string;
  ended?: boolean;
  isAuction: boolean;
  nftBids: any;
}

const NftDetailPage = ({ params }) => {
  const router = useRouter();
  const EthAccount = useSelector((state: RootState) => state.user);
  const [NFTsItems, setNFTsItems] = useState<NFTResponse | null>(null);
  const [ComponentLoad, setComponentLoad] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  console.log(NFTsItems);

  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [usdPrice, setUsdPrice] = useState(0);
  const [NftAuth, setNftAuth] = useState(false);
  const [isPlaceBid, setIsPlaceBid] = useState(false);
  const openModalPlaceBid = () => setIsPlaceBid(true);
  const closeModalPlaceBid = () => setIsPlaceBid(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [profilePictures, setProfilePictures] = useState({
    creatorAddress: "",
    creatorId: "",
    creatorName: "",
    creator: "",
    ownerAddress: "",
    ownerId: "",
    owner: "",
    ownerName: "",
  });

  const handleReload = () => {
    setComponentLoad((prev: number) => prev + 1);
  };
  const fetchingUserData = async () => {
    try {
      const [creatorAvatar, ownerAvatar, isFavourite] = await Promise.all([
        getUserDetailsByEthAddress(NFTsItems.Creator),
        NFTsItems?.CurrentOwner !==
          "0x0000000000000000000000000000000000000000" &&
          getUserDetailsByEthAddress(NFTsItems.CurrentOwner),
        checkIsFav(EthAccount.account, NFTsItems?.Image, NFTsItems?.NFTId),
      ]);
      setIsFav(isFavourite?.isExist);
      console.log(creatorAvatar);

      setProfilePictures({
        creatorAddress: creatorAvatar?.userEthAddress,
        creatorId: creatorAvatar?._id,
        creatorName: creatorAvatar?.userName,
        creator: creatorAvatar?.userProfile,
        ownerAddress: ownerAvatar?.userEthAddress,
        ownerId: ownerAvatar?._id,
        owner: ownerAvatar?.userProfile,
        ownerName: ownerAvatar?.userName,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!NFTsItems?.Creator && !NFTsItems) return;

    fetchingUserData();
  }, [NFTsItems, EthAccount, ComponentLoad]);
  const handleClaimNft = async () => {
    try {
      setClaimLoading(true);
      if (
        NFTsItems?.highestBidder.toLowerCase() !==
        EthAccount?.account?.toLowerCase()
      ) {
        setClaimLoading(false);
        ErrorToast({ message: "You are not a winner of NFT" });
        return;
      } else if (!NFTsItems?.ended) {
        ErrorToast({
          message: "Auction cannot ended.So you cannot claim the NFT",
        });
        setClaimLoading(false);
        return;
      }
      const response = await ClaimNft(NFTsItems?.NFTId, EthAccount?.account);
      if (response) {
        await createNotification({
          description: `<b> Congratulations! </b> Your auction NFT <b> ${
            NFTsItems?.Name?.length > 10
              ? NFTsItems?.Name?.slice(0, 10) + "..."
              : NFTsItems?.Name
          } </b> has been successfully claimed by <b> ${
            EthAccount?.userName
              ? EthAccount?.userName
              : EthAccount?.account.slice(0, 6) +
                ".." +
                EthAccount?.account.slice(38)
          } </b>.`,
          sender: EthAccount?.userId,
          receiver: NFTsItems?.Creator, // Set the receiver to the creator's user ID
          href: `/nft-detail/${NFTsItems?.NFTId}`,
        });

        SuccessToast({ message: "Claim NFT Successfully! 🥳🥳" });
        setClaimLoading(false);
        fetching();
      }

      // console.log(response);
    } catch (error) {
      setClaimLoading(false);
      console.log(error);
      ErrorToast({ message: "Internal server error.Please try again!!" });
    }
  };
  const handleFavorite = async () => {
    if (!EthAccount.isConnect) {
      ErrorToast({ message: "Wallet not connect ! 💔" });
      return null;
    }
    try {
      const result = await addNFTFavorite(EthAccount.account.toLowerCase(), {
        NFTid: NFTsItems?.NFTId,
        image: NFTsItems.Image,
        isAuction: NFTsItems?.isAuction,
      });
      if (result.success) {
        setIsFav(!isFav);
        SuccessToast({ message: result.message });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetching = async () => {
    try {
      setLoading(true);
      const response = await fetchNFTById(params?.id);
      console.log(response);
      if (!response) {
        router.push("/");
        return null;
      }
      setNFTsItems(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetching();
  }, [params?.id, ComponentLoad]);
  useEffect(() => {
    const converting = async () => {
      setUsdPrice(await ethereumUsd());
    };
    converting();
  }, []);
  const HandleBuyNFT = async () => {
    try {
      setBuyNowLoading(true);
      const response = await BuyNFT(NFTsItems?.NFTId, EthAccount?.account);
      console.log(response);
      if (!response) {
        ErrorToast({
          message: "It seems like metamask transaction is reject 💔",
        });
        return;
      }
      console.log({
        description: `Congratulations! Your NFT ${
          NFTsItems?.Name?.length > 10
            ? NFTsItems?.Name?.slice(0, 10) + "..."
            : NFTsItems?.Name
        } has been successfully purchased by ${
          EthAccount?.userName
            ? EthAccount?.userName
            : EthAccount?.account.slice(0, 6) +
              ".." +
              EthAccount?.account.slice(38)
        }`,
        sender: EthAccount?.userId,
        receiver: profilePictures?.creatorId,
        href: `nft-detail/${NFTsItems?.NFTId}`,
      });

      await createNotification({
        description: `<b> Congratulations! </b> Your NFT <b> ${
          NFTsItems?.Name?.length > 10
            ? NFTsItems?.Name?.slice(0, 10) + "..."
            : NFTsItems?.Name
        } </b> has been successfully purchased by <b> ${
          EthAccount?.userName
            ? EthAccount?.userName
            : EthAccount?.account.slice(0, 6) +
              ".." +
              EthAccount?.account.slice(38)
        } </b>`,
        sender: EthAccount?.userId,
        receiver: profilePictures?.creatorId,
        href: `/nft-detail/${NFTsItems?.NFTId}`,
      });

      setBuyNowLoading(false);
      setComponentLoad((pre) => pre + 1);
      SuccessToast({
        message: `NFT Buy successfully 🎉 !`,
      });
    } catch (error) {
      setBuyNowLoading(false);
      ErrorToast({ message: "Oops! Something bad.Please try again" });
      console.log(error);
    }
  };
  const IsCheckOwner = async () => {
    try {
      const result = await CheckIsOwner(NFTsItems?.NFTId, EthAccount?.account);
      setNftAuth(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (EthAccount && NFTsItems) {
      IsCheckOwner();
    }
  }, [EthAccount, NFTsItems]);

  const renderSection1 = () => {
    return (
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        <ModalPlaceBid
          profilePictures={profilePictures}
          handleReload={handleReload}
          EthAccount={EthAccount}
          NFTsItems={NFTsItems}
          show={isPlaceBid}
          onCloseModalPlaceBid={closeModalPlaceBid}
        />
        {/* ---------- 1 ----------  */}
        <div className="pb-9 space-y-5">
          <div className="flex justify-between items-center">
            <Badge
              href="/collection"
              name={NFTsItems?.Category}
              color="green"
            />
            {/* <LikeSaveBtns /> */}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            {NFTsItems?.Name}
          </h2>

          {/* ---------- 4 ----------  */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
            <Link
              href={`/author/${profilePictures?.creatorAddress}`}
              className="flex items-center "
            >
              <Avatar
                imgUrl={
                  profilePictures?.creator
                    ? `${
                        process.env.NEXT_PUBLIC_BACKEND_BASE_URL
                      }/api/images?imageName=${encodeURIComponent(
                        profilePictures.creator
                      )}`
                    : "/user-demo-avatar.svg"
                }
                sizeClass="h-9 w-9"
                radius="rounded-full"
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Creator</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                  <span>
                    {profilePictures?.creatorName ? (
                      profilePictures?.creatorName
                    ) : (
                      <>
                        {NFTsItems?.Creator
                          ? NFTsItems?.Creator.slice(0, 6) +
                            ".." +
                            NFTsItems?.Creator.slice(38)
                          : null}
                      </>
                    )}
                  </span>
                  <VerifyIcon iconClass="w-4 h-4" />
                </span>
              </span>
            </Link>
            <div className="hidden sm:block h-6 border-l border-neutral-200 dark:border-neutral-700"></div>

            {profilePictures?.ownerAddress &&
            profilePictures?.ownerAddress.toLowerCase() ===
              "0x0000000000000000000000000000000000000000" ? (
              <Link
                href={`/author/${profilePictures?.ownerAddress}`}
                className="flex items-center"
              >
                <Avatar
                  imgUrl={
                    profilePictures?.owner
                      ? `${
                          process.env.NEXT_PUBLIC_BACKEND_BASE_URL
                        }/api/images?imageName=${encodeURIComponent(
                          profilePictures.owner
                        )}`
                      : "/user-demo-avatar.svg"
                  }
                  sizeClass="h-9 w-9"
                  radius="rounded-full"
                />
                <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                  <span className="text-sm">Current Owner</span>
                  <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                    <span>
                      {NFTsItems?.CurrentOwner ? (
                        NFTsItems?.CurrentOwner.toLowerCase() ==
                        EthAccount?.account.toLowerCase() ? (
                          "You"
                        ) : (
                          <>
                            {" "}
                            {profilePictures?.ownerName ? (
                              profilePictures?.ownerName
                            ) : (
                              <>
                                {NFTsItems?.CurrentOwner
                                  ? NFTsItems?.CurrentOwner.slice(0, 6) +
                                    ".." +
                                    NFTsItems?.CurrentOwner.slice(38)
                                  : null}
                              </>
                            )}
                          </>
                        )
                      ) : null}
                    </span>
                    <VerifyIcon iconClass="w-4 h-4" />
                  </span>
                </span>
              </Link>
            ) : (
              <div className="flex items-center">
                <Avatar
                  imgUrl={
                    profilePictures?.owner
                      ? `${
                          process.env.NEXT_PUBLIC_BACKEND_BASE_URL
                        }/api/images?imageName=${encodeURIComponent(
                          profilePictures.owner
                        )}`
                      : "/user-demo-avatar.svg"
                  }
                  sizeClass="h-9 w-9"
                  radius="rounded-full"
                />
                <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                  <span className="text-sm">Current Owner</span>
                  <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                    <span>
                      {NFTsItems?.CurrentOwner ? (
                        NFTsItems?.CurrentOwner.toLowerCase() ===
                        EthAccount?.account.toLowerCase() ? (
                          "You"
                        ) : (
                          <>
                            {" "}
                            {profilePictures?.ownerName ? (
                              profilePictures?.ownerName
                            ) : (
                              <>
                                {NFTsItems?.CurrentOwner
                                  ? `${NFTsItems?.CurrentOwner.slice(
                                      0,
                                      6
                                    )}..${NFTsItems?.CurrentOwner.slice(38)}`
                                  : null}
                              </>
                            )}
                          </>
                        )
                      ) : null}
                    </span>
                    <VerifyIcon iconClass="w-4 h-4" />
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ---------- 6 ----------  */}
        {NFTsItems?.isAuction && (
          <div className="py-9">
            <TimeCountDown endTime={Number(NFTsItems?.auctionEnded) * 1000} />
          </div>
        )}

        {/* ---------- 7 ----------  */}
        {/* PRICE */}
        <div className="pb-9 pt-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 flex flex-col sm:flex-row items-baseline p-6 border-2 border-green-500 rounded-xl relative">
              <span className="absolute bottom-full translate-y-1 py-1 px-1.5 bg-white dark:bg-neutral-900 text-sm text-neutral-500 dark:text-neutral-400">
                {NFTsItems?.isAuction ? <>Start Price</> : <>Price</>}
              </span>

              <span className="text-3xl xl:text-4xl font-semibold text-green-500">
                {Number(NFTsItems?.Price).toFixed(5)} ETH
              </span>
              <span className="text-lg text-neutral-400 sm:ml-5">
                ( ≈ ${Math.round(usdPrice * Number(NFTsItems?.Price))})
              </span>
            </div>
            <div className="flex justify-center items-center gap-1 ml-5 mt-2 sm:mt-0 sm:ml-10">
              <ClockIcon className="w-4 h-4" />
              <span className="text-sm text-neutral-500 dark:text-neutral-400 ">
                {moment.unix(NFTsItems?.CreateAt).fromNow()}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {NFTsItems?.isAuction ? (
              !NftAuth && !NFTsItems?.ended ? (
                <ButtonPrimary onClick={openModalPlaceBid} className="flex-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 12H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ml-2.5">Place a bid</span>
                </ButtonPrimary>
              ) : (
                EthAccount?.account?.toLowerCase() ===
                  NFTsItems?.highestBidder?.toLowerCase() &&
                NFTsItems?.CurrentOwner?.toLowerCase() !==
                  EthAccount?.account?.toLowerCase() && (
                  <ButtonPrimary
                    loading={claimLoading}
                    onClick={handleClaimNft}
                    className="flex-1"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 12H14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="ml-2.5">Claim NFT</span>
                  </ButtonPrimary>
                )
              )
            ) : (
              !NftAuth && (
                <ButtonPrimary
                  loading={buyNowLoading}
                  onClick={HandleBuyNFT}
                  className="flex-1"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 12H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ml-2.5">Buy Now</span>
                </ButtonPrimary>
              )
            )}
          </div>
        </div>

        {/* ---------- 9 ----------  */}
        <div className="pt-9">
          <TabDetail
            profilePictures={profilePictures}
            NFTData={NFTsItems}
            usdPrice={usdPrice}
          />
        </div>
      </div>
    );
  };
  const descripotionData = [
    {
      name: "Descriptions",
      content: NFTsItems?.Description,
    },
    {
      name: "Details",
      content: `
      <p>Properties</p>
      <p class="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
      ${NFTsItems?.Properties}
      </p>
      <br />
      <p>Contract Address</p>
      <p class="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
     ${address}
      </p>
      <br />
      <p>Token ID</p>
      <p class="text-base text-neutral-900 dark:text-neutral-100">
       ${NFTsItems?.NFTId}
      </p>`,
    },

    {
      name: "FAQ",
      content: `
      <ul class="list-disc list-inside leading-7">
      <li>All full-priced, unworn items, with tags attached and in their original packaging are eligible for return or exchange within 30 days of placing your order.</li>
      <li>
      Please note, packs must be returned in full. We do not accept partial returns of packs.
      </li>
      <li>
      Want to know our full returns policies? Here you go.
      </li>
      <li>
      Want more info about shipping, materials or care instructions? Here!
      </li>
    </ul>
      `,
    },
  ];
  return (
    <div className={`nc-NftDetailPage `}>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <Loader className="w-8 h-8 " />
        </div>
      ) : (
        <>
          {/* MAIn */}
          <main className="container mt-11 mb-20 flex ">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
              {/* CONTENT */}
              <div className="space-y-8 lg:space-y-10">
                {/* HEADING */}
                <div className="relative">
                  <NcImage
                    src={NFTsItems?.Image}
                    containerClassName="aspect-w-11 aspect-h-12 rounded-3xl overflow-hidden z-0 relative"
                    fill
                  />
                  {/* META TYPE */}
                  <ItemTypeVideoIcon className="absolute left-3 top-3  w-8 h-8 md:w-10 md:h-10" />

                  {/* META FAVORITES */}
                  <LikeButton
                    onClick={handleFavorite}
                    liked={isFav}
                    setIsLiked={setIsFav}
                    className="absolute right-3 top-3 "
                  />
                </div>

                <AccordionInfo data={descripotionData} />
              </div>

              {/* SIDEBAR */}
              <div className="pt-10 lg:pt-0 xl:pl-10 border-t-2 border-neutral-200 dark:border-neutral-700 lg:border-t-0">
                {renderSection1()}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default NftDetailPage;
