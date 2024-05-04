"use client";
import React, { FC, useCallback } from "react";
import Logo from "@/shared/Logo/Logo";
import MenuBar from "@/shared/MenuBar/MenuBar";
import SwitchDarkMode from "@/shared/SwitchDarkMode/SwitchDarkMode";
import NotifyDropdown from "./NotifyDropdown";
import AvatarDropdown from "./AvatarDropdown";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Navigation from "@/shared/Navigation/Navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import useConnectMetaMask from "@/hooks/useConnectWallet";
import { SuccessToast } from "../Toast/Success";
import { ErrorToast } from "../Toast/Error";

export interface MainNav2LoggedProps {}
const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
  const AccountState = useSelector((state: RootState) => state.user);

  // // Move the logic of useConnectMetaMask into connectMetamask function
  // const connectMetamask = async () => {
  //   const result: boolean = await useConnectMetaMask();
  //   if (result) {
  //     navigator.vibrate(100);
  //     SuccessToast({ message: "Metamask is connected 🎉" });
  //   } else {
  //     navigator.vibrate([100, 300]);
  //     ErrorToast({ message: "Metamask is not found 💔" });
  //   }
  // };
  const Connect = async () => {
    try {
      const result: boolean = await useConnectMetaMask();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={`nc-MainNav2Logged relative z-10`}>
      <div className="container">
        <div className="h-20 flex justify-between space-x-4 xl:space-x-8">
          <div className="self-center flex justify-start flex-grow space-x-3 sm:space-x-8 lg:space-x-10">
            <Logo />
          </div>
          <div className="flex-shrink-0 flex justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
            <div className="hidden xl:flex space-x-2">
              <Navigation />
              <div className="self-center hidden sm:block h-6 border-l border-neutral-300 dark:border-neutral-6000"></div>
              <div className="flex">
                <SwitchDarkMode />
                <NotifyDropdown />
              </div>
              <div></div>
              <ButtonPrimary
                className="self-center"
                href="/create-nft"
                sizeClass="px-4 py-2 sm:px-5"
              >
                Create
              </ButtonPrimary>
              <div></div>
              {AccountState?.isConnect ? (
                <AvatarDropdown />
              ) : (
                <ButtonPrimary
                  className="self-center"
                  // href="/create-nft"
                  sizeClass="px-4 py-2 sm:px-5"
                  onClick={Connect}
                >
                  <img
                    className="me-2 w-5"
                    src="/metamask.svg"
                    alt="metamask"
                  />{" "}
                  Connect
                </ButtonPrimary>
              )}
            </div>
            <div className="flex items-center space-x-1 xl:hidden">
              <NotifyDropdown />
              <AvatarDropdown />
              <MenuBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2Logged;
