import React, { FC } from "react";
import MainNav2Logged from "./MainNav2Logged";

export interface HeaderLoggedProps {}

const HeaderLogged: FC<HeaderLoggedProps> = () => {
  return (
    <div className="nc-HeaderLogged sticky top-0 w-full left-0 right-0 z-40 bg-white dark:bg-neutral-900 shadow-sm dark:border-b dark:border-neutral-700">
      <MainNav2Logged />
    </div>
  );
};

export default HeaderLogged;
