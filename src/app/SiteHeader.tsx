"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import HeaderLogged from "@/components/Header/HeaderLogged";
import Header2 from "@/components/Header/Header2";
import useConnectMetaMask from "@/hooks/useConnectWallet";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const SiteHeader = () => {
  const AccountState = useSelector((state: RootState) => state.user);
  let pathname = usePathname();

  const headerComponent = useMemo(() => {
    let HeadComponent = HeaderLogged;

    switch (pathname) {
      case "/home-3":
        HeadComponent = Header2;
        break;

      default:
        break;
    }

    return <HeadComponent />;
  }, [pathname]);
  // }
  const Connect = async () => {
    try {
      const result: boolean = await useConnectMetaMask();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (
      // localStorage.getItem("IsNFTMetamaskConnect") &&
      !AccountState?.isConnect &&
      typeof window !== "undefined"
    ) {
      Connect();
    }
  }, []);
  return <>{headerComponent}</>;
};

export default SiteHeader;
