"use client";

import React, { FC, useEffect, useState } from "react";
import Heading from "@/components/Heading/Heading";
import CardCategory5 from "@/components/CardCategory5/CardCategory5";
import { nftsCatImgs } from "@/contains/fakeData";
import MySlider from "../MySlider";
import { countNFTsByCategory } from "../../hooks/useCount";

export interface SectionSliderCategoriesProps {
  className?: string;
  heading?: string;
  subHeading?: string;
}

const ntfsCatNames = [
  "Arts",
  "Entertainment",
  "Music",
  "News",
  "Science",
  "Sports",
  "Technology",
];

const SectionSliderCategories: FC<SectionSliderCategoriesProps> = ({
  heading = "Browse by category",
  subHeading = "Explore the NFTs in the most featured categories.",
  className = "",
}) => {
  const [countCat, setCountCat] = useState<any>([]);
  const getCategoryCount = async () => {
    const result = await countNFTsByCategory(ntfsCatNames);
    console.log(result);
    setCountCat(result);
  };
  useEffect(() => {
    getCategoryCount();
  }, []);

  return (
    <div className={`nc-SectionSliderCategories ${className}`}>
      <MySlider
        itemPerRow={4}
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
              desc={subHeading}
              onClickPrev={onClickPrev}
              onClickNext={onClickNext}
              disableNext={!showNext}
              disablePrev={!showPrev}
            >
              {heading}
            </Heading>
          );
        }}
        data={ntfsCatNames}
        renderItem={(_, index) => {
          return (
            <CardCategory5
              key={index}
              index={index}
              featuredImage={nftsCatImgs[index]}
              name={`${ntfsCatNames[index]}`}
              count={Number(countCat[index])}
            />
          );
        }}
      />
    </div>
  );
};

export default SectionSliderCategories;
