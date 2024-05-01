"use client";
import React, { FC, useEffect, useRef, useState } from "react";

interface CountDownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface RemainingTimeNftCardProps {
  className?: string;
  contentClassName?: string;
  endTime: any; // Added endTime prop
}

const RemainingTimeNftCard: FC<RemainingTimeNftCardProps> = ({
  className = "absolute top-[-1px] right-[-1px] flex items-center",
  contentClassName = "right-5 top-1/2 -translate-y-1/2",
  endTime, // Use endTime prop
}) => {
  // Define the type of state variable
  const [countDownTime, setCountDownTime] = useState<CountDownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Define the ref type
  const intervalRef = useRef<number | null>(null);

  // Function to calculate time difference
  const getTimeDifference = (endTime: number) => {
    const currentTime = Date.now();
    const timeDifference = endTime - currentTime;
    if (timeDifference <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
    intervalRef.current = window.setInterval(() => {
      getTimeDifference(endTime);
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [endTime]);

  return (
    <div className={className}>
      <svg
        className="text-white dark:text-neutral-900 w-44 md:w-[200px]"
        viewBox="0 0 196 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M196 55V0H0.5V1H4.05286C12.4067 1 20.1595 5.34387 24.5214 12.4685L43.5393 43.5315C47.9012 50.6561 55.654 55 H196Z"
          fill="currentColor"
        />
      </svg>

      <div className={`absolute ${contentClassName}`}>
        <span className="block text-xs text-neutral-500 dark:text-neutral-400 tracking-wide">
          Remaining time
        </span>
        <span className="block md:text-lg font-semibold">
          {countDownTime.days}d : {countDownTime.hours}h :{" "}
          {countDownTime.minutes}m
        </span>
      </div>
    </div>
  );
};

export default RemainingTimeNftCard;
