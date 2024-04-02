"use client";

import React, { FC, useState } from "react";
import NcDropDown, { NcDropDownItem } from "@/shared/NcDropDown/NcDropDown";
import ModalDelete from "./ModalDelete";
import ModalEdit from "./ModalEdit";
import ModalReportItem from "./ModalReportItem";
import ModalTransferToken from "./ModalTransferToken";

export interface NftMoreDropdownProps {
  containerClassName?: string;
  dropdownPositon?: "up" | "down";
  actions?: NcDropDownItem[];
}

const actionsDefault: NftMoreDropdownProps["actions"] = [
  {
    id: "edit",
    name: "Change price",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
`,
  },
  {
    id: "transferToken",
    name: "Transfer token",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
</svg>
`,
  },
  {
    id: "report",
    name: "Report abuse",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
</svg>
`,
  },
  {
    id: "delete",
    name: "Delete item",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>
`,
  },
];

const NftMoreDropdown: FC<NftMoreDropdownProps> = ({
  containerClassName = "py-1.5 px-3 flex rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer",
  dropdownPositon = "down",
  actions = actionsDefault,
}) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransfering, setIsTransfering] = useState(false);

  const openModalEdit = () => setIsEditting(true);
  const closeModalEdit = () => setIsEditting(false);

  const openModalReport = () => setIsReporting(true);
  const closeModalReport = () => setIsReporting(false);

  const openModalDelete = () => setIsDeleting(true);
  const closeModalDelete = () => setIsDeleting(false);

  const openModalTransferToken = () => setIsTransfering(true);
  const closeModalTransferToken = () => setIsTransfering(false);

  const hanldeClickDropDown = (item: NcDropDownItem) => {
    if (item.href) {
      return;
    }

    if (item.id === "edit") {
      return openModalEdit();
    }
    if (item.id === "report") {
      return openModalReport();
    }
    if (item.id === "delete") {
      return openModalDelete();
    }
    if (item.id === "transferToken") {
      return openModalTransferToken();
    }
    return;
  };

  const renderMenu = () => {
    return (
      <NcDropDown
        className={` ${containerClassName} `}
        data={actions}
        panelMenusClass={
          dropdownPositon === "up"
            ? "origin-bottom-right bottom-0 "
            : "origin-top-right !w-44 sm:!w-52"
        }
        onClick={hanldeClickDropDown}
      />
    );
  };

  return (
    <div className="">
      {renderMenu()}
      <ModalReportItem
        show={isReporting}
        onCloseModalReportItem={closeModalReport}
      />
      <ModalEdit show={isEditting} onCloseModalEdit={closeModalEdit} />
      <ModalDelete show={isDeleting} onCloseModalDelete={closeModalDelete} />
      <ModalTransferToken
        show={isTransfering}
        onCloseModalTransferToken={closeModalTransferToken}
      />
    </div>
  );
};

export default NftMoreDropdown;
