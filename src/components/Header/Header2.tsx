import React, { FC } from "react";
import MainNav2 from "./MainNav2";

export interface Header2Props {}

const Header2: FC<Header2Props> = () => {
  return (
    <div className="nc-Header2 sticky top-0 w-full left-0 right-0 z-40 bg-white dark:bg-neutral-900 nc-header-bg shadow-sm dark:border-b dark:border-neutral-700">
      <MainNav2 />
    </div>
  );
};

export default Header2;
