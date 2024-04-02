"use client";

import React, { FC } from "react";
import Heading from "@/components/Heading/Heading";
import CardNFTVideo from "./CardNFTVideo";
import MySlider from "./MySlider";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

export interface SectionSliderCardNftVideoProps {
  className?: string;
  heading?: string;
  subHeading?: string;
}

const SectionSliderCardNftVideo: FC<SectionSliderCardNftVideoProps> = ({
  className = "",
}) => {
  return (
    <div className={`nc-SectionSliderCardNftVideo ${className}`}>
      <MySlider
        itemPerRow={3}
        hideNextPrev
        renderSectionHeading={({
          onClickPrev,
          onClickNext,
          showNext,
          showPrev,
        }) => {
          return (
            <Heading
              hasNextPrev
              desc="Click on play icon and enjoy NTFs video"
              onClickPrev={onClickPrev}
              onClickNext={onClickNext}
              disableNext={!showNext}
              disablePrev={!showPrev}
            >
              Explore NFTs Video
            </Heading>
          );
        }}
        data={[
          "https://images.unsplash.com/photo-1643101809204-6fb869816dbe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          "https://images.unsplash.com/photo-1643101808200-0d159c1331f9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          "https://images.unsplash.com/photo-1643101808513-0552e31e4d9c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          "https://images.unsplash.com/photo-1638913974023-cef988e81629?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          null,
        ]}
        renderItem={(item, index) => {
          if (!item) {
            return (
              <Link href={"/search"} className="block relative group">
                <div className="flex aspect-w-16 aspect-h-9 w-full h-0 rounded-3xl bg-neutral-100 dark:bg-neutral-800"></div>
                <div className="absolute inset-y-6 inset-x-10  flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center relative">
                    <span className="text-xl font-semibold">NFTs Video</span>
                    <ArrowUpRightIcon className="absolute left-full w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm mt-1">Show me more</span>
                </div>
              </Link>
            );
          }
          return <CardNFTVideo key={index} featuredImage={item} />;
        }}
      />
    </div>
  );
};

export default SectionSliderCardNftVideo;
