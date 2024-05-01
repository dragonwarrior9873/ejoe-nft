"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Input from "@/shared/Input/Input";
import NcModal from "@/shared/NcModal/NcModal";
import { ethereumUsd } from "@/hooks/useEtherUsdPrice";
import { ErrorToast } from "./Toast/Error";
import { PlaceBid } from "../hooks/usePlaceBid";
import { SuccessToast } from "./Toast/Success";
import { createNotification } from "@/apis/notification.apis";
export interface ModalEditProps {
  profilePictures: any;
  handleReload: () => void;
  EthAccount: any;
  NFTsItems: any;
  show: boolean;
  onCloseModalPlaceBid: () => void;
}

const ModalEdit: FC<ModalEditProps> = ({
  profilePictures,
  handleReload,
  EthAccount,
  NFTsItems,
  show,
  onCloseModalPlaceBid,
}) => {
  console.log(NFTsItems);

  const textareaRef = useRef(null);
  const [bidPrice, setbidPrice] = useState(null);
  const [usdPrice, setUsdPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        const element: HTMLTextAreaElement | null = textareaRef.current;
        if (element) {
          (element as HTMLTextAreaElement).focus();
          (element as HTMLTextAreaElement).setSelectionRange(
            (element as HTMLTextAreaElement).value.length,
            (element as HTMLTextAreaElement).value.length
          );
        }
      }, 400);
    }
  }, [show]);
  useEffect(() => {
    const converting = async () => {
      const usdt = await ethereumUsd();
      let calc = Number(NFTsItems?.highestBid) * usdt.toFixed();

      if (calc === 0) {
        setbidPrice((usdt * NFTsItems?.Price).toFixed(1));
      } else {
        setbidPrice(calc.toFixed(1));
      }
      setUsdPrice(usdt);
    };
    converting();
  }, []);
  const handleSubmitBid = async () => {
    // e.preventDefault();
    try {
      setLoading(true);
      if (bidPrice <= Number(usdPrice * NFTsItems?.highestBid)) {
        <ErrorToast message="Place bid higher than the last bid" />;
        return;
      } else if (bidPrice <= Number(usdPrice * NFTsItems?.Price)) {
        ErrorToast({ message: "Place bid higher than the staring price" });
        return;
      }
      const response = await PlaceBid(
        EthAccount?.account,
        NFTsItems?.NFTId,
        bidPrice,
        EthAccount?.userName ? EthAccount?.userName : EthAccount?.account,
        EthAccount?.userAvatar
      );
      await createNotification({
        description: `<b> Congratulations! </b> Your auction NFT <b> ${
          NFTsItems?.Name?.length > 10
            ? NFTsItems?.Name?.slice(0, 10) + "..."
            : NFTsItems?.Name
        } </b> has received a bid from <b> ${
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
      SuccessToast({ message: "Your bid place successfully!" });
      setLoading(false);
      handleReload();
      onCloseModalPlaceBid();
    } catch (error) {
      setLoading(false);
      console.log(error);
      ErrorToast({ message: "Internal server error.Please try again!!" });
    }
  };
  const renderContent = () => {
    return (
      <form action="#">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          Place Bid
        </h3>
        <span className="text-sm">
          Place your bid to enter the competition!
        </span>
        <div className="mt-8 relative rounded-md shadow-sm">
          <Input
            ref={textareaRef}
            value={bidPrice}
            onChange={(e) => setbidPrice(e.target.value)}
            type={"text"}
          />

          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="currency" className="sr-only">
              Currency
            </label>
            <select
              id="currency"
              disabled
              name="currency"
              className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-neutral-500 dark:text-neutral-300 sm:text-sm rounded-md"
            >
              <option>$</option>
            </select>
          </div>
        </div>
        <div className="mt-4 space-x-3">
          <ButtonPrimary
            onClick={handleSubmitBid}
            loading={loading}
            type="submit"
          >
            Submit
          </ButtonPrimary>
          <ButtonSecondary type="button" onClick={onCloseModalPlaceBid}>
            Cancel
          </ButtonSecondary>
        </div>
      </form>
    );
  };

  const renderTrigger = () => {
    return null;
  };

  return (
    <NcModal
      isOpenProp={show}
      onCloseModal={onCloseModalPlaceBid}
      contentExtraClass="max-w-lg"
      renderContent={renderContent}
      renderTrigger={renderTrigger}
      modalTitle=""
    />
  );
};

export default ModalEdit;
