"use client";

import React, { FC, useEffect, useState } from "react";

export interface PricesProps {
  className?: string;
  price?: string;
  contentClass?: string;
  labelTextClassName?: string;
  labelText?: string;
}

const Prices: FC<PricesProps> = ({
  className = "pt-3 w-1/2",
  price = "1.000 ETH",
  contentClass = "py-1.5 md:py-2 px-2.5 md:px-3.5 text-sm sm:text-base font-semibold",
  labelTextClassName = "bg-white",
  labelText = "",
}) => {
  const [labelTextState, setLabelTextState] = useState(labelText);

  useEffect(() => {
    if (!labelText) {
      setLabelTextState(Math.random() > 0.4 ? "Price" : "Current Bid");
    }
  }, [labelText]);

  return (
    <div className={`${className}`}>
      <div
        className={`flex items-baseline border-2 border-green-500 rounded-lg relative ${contentClass} `}
      >
        <span
          className={`block absolute font-normal bottom-full translate-y-1 p-1 -mx-1 text-xs text-neutral-500 dark:text-neutral-400 ${labelTextClassName}`}
        >
          {labelTextState}
        </span>
        <span className=" text-green-500 !leading-none">{price}</span>
      </div>
    </div>
  );
};

export default Prices;