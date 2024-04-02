"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import React, { FC } from "react";

export interface NextPrevProps {
  className?: string;
  btnClassName?: string;
  onClickNext?: () => void;
  onClickPrev?: () => void;
  disableNext?: boolean;
  disablePrev?: boolean;
}

const NextPrev: FC<NextPrevProps> = ({
  className = "",
  onClickNext = () => {},
  onClickPrev = () => {},
  btnClassName = "w-10 h-10",
  disableNext,
  disablePrev,
}) => {
  const [focus, setFocus] = React.useState<"left" | "right">("right");

  return (
    <div
      className={`nc-NextPrev relative flex items-center text-slate-500 dark:text-slate-400 ${className}`}
    >
      <button
        className={`${btnClassName} mr-2 border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center ${
          focus === "left" ? "border-2" : ""
        }`}
        onClick={(e) => {
          e.preventDefault();
          onClickPrev();
        }}
        title="Prev"
        disabled={disablePrev}
        onMouseEnter={() => setFocus("left")}
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>
      <button
        className={`${btnClassName}  border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center ${
          focus === "right" ? "border-2" : ""
        }`}
        onClick={(e) => {
          e.preventDefault();
          onClickNext();
        }}
        title="Next"
        disabled={disableNext}
        onMouseEnter={() => setFocus("right")}
      >
        <ArrowRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default NextPrev;
