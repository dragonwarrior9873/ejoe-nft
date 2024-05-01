"use client";

import useCountDownTime from "@/hooks/useCountDownTime";
import React, { useEffect, useRef, useState } from "react";

const TimeCountDown = ({ endTime }) => {
  const timeLeft = useCountDownTime();
  const [countDownTime, setCountDownTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const intervalRef = useRef(null);

  const getTimeDifference = (endTime) => {
    const currentTime = new Date().getTime();
    const timeDifference = endTime - currentTime;
    if (timeDifference <= 0) {
      clearInterval(intervalRef.current);
      setCountDownTime({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    } else {
      const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
      const hours = Math.floor(
        (timeDifference % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeDifference % (60 * 60 * 1000)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);
      setCountDownTime({ days, hours, minutes, seconds });
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      getTimeDifference(endTime);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [endTime]);
  return (
    <div className="space-y-5">
      <div className="text-neutral-500 dark:text-neutral-400 flex items-center space-x-2 ">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8V13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 2H15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="leading-none mt-1">Auction ending in:</span>
      </div>
      <div className="flex space-x-5 sm:space-x-10">
        <div className="flex flex-col ">
          <span className="text-2xl sm:text-2xl font-semibold">
            {countDownTime.days}
          </span>
          <span className="sm:text-lg text-neutral-500 dark:text-neutral-400">
            Days
          </span>
        </div>
        <div className="flex flex-col ">
          <span className="text-2xl sm:text-2xl font-semibold">
            {countDownTime.hours}
          </span>
          <span className="sm:text-lg text-neutral-500 dark:text-neutral-400">
            hours
          </span>
        </div>
        <div className="flex flex-col ">
          <span className="text-2xl sm:text-2xl font-semibold">
            {countDownTime.minutes}
          </span>
          <span className="sm:text-lg text-neutral-500 dark:text-neutral-400">
            minutes
          </span>
        </div>
        <div className="flex flex-col ">
          <span className="text-2xl sm:text-2xl font-semibold">
            {countDownTime.seconds}
          </span>
          <span className="sm:text-lg text-neutral-500">seconds</span>
        </div>
      </div>
    </div>
  );
};

export default TimeCountDown;
