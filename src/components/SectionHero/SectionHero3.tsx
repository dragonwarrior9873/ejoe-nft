import React from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import imagePng from "@/images/hero3.png";
import HeroSearchForm from "@/components/HeroSearchForm/HeroSearchForm";
import Image from "next/image";

const SectionHero3 = () => {
  return (
    <div className={`nc-SectionHero3 relative`}>
      <div className="mt-10 lg:mt-0 lg:absolute lg:container z-10 inset-x-0 top-[10%] sm:top-[20%]">
        <div className="flex flex-col items-start max-w-2xl space-y-5 xl:space-y-8 ">
          <span className="sm:text-lg md:text-xl font-semibold text-neutral-900">
            Create, Explore, & Collect Digital Art NFTs.
          </span>
          <h2 className="font-bold text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl !leading-[115%] ">
            Buy, sell, and showcase NFTs
          </h2>
          <ButtonPrimary
            sizeClass="px-6 py-3 lg:px-8 lg:py-4"
            fontSize="text-sm sm:text-base lg:text-lg font-medium"
            href="/search"
          >
            Start your search
          </ButtonPrimary>
        </div>
        <HeroSearchForm className="mt-5 lg:mt-24 2xl:mt-40" />
      </div>
      <div className="relative aspect-w-4 aspect-h-3 sm:aspect-w-16 sm:aspect-h-9">
        <Image
          className="absolute inset-0 object-cover rounded-[32px]"
          fill
          src={imagePng}
          alt="hero"
        />
      </div>
    </div>
  );
};

export default SectionHero3;
