import React from "react";
import BgGlassmorphism from "@/components/BgGlassmorphism/BgGlassmorphism";
import SectionHero from "@/components/SectionHero/SectionHero";
import SectionHowItWork from "@/components/SectionHowItWork/SectionHowItWork";
import Vector1 from "@/images/Vector1.png";
import Image from "next/image";
import SectionLargeSlider from "../SectionLargeSlider";
import SectionGridAuthorBox from "@/components/SectionGridAuthorBox/SectionGridAuthorBox";
import BackgroundSection from "@/components/BackgroundSection/BackgroundSection";
import SectionSliderCollections from "@/components/SectionSliderCollections";
import SectionGridFeatureNFT from "../SectionGridFeatureNFT";
import SectionBecomeAnAuthor from "@/components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import SectionSliderCategories from "@/components/SectionSliderCategories/SectionSliderCategories";
import SectionVideos from "../SectionVideos";

function PageHome() {
  return (
    <div className="nc-PageHome relative overflow-hidden">
      <BgGlassmorphism />

      <div className="container relative space-y-20 mt-12 mb-20 sm:space-y-24 sm:my-24 lg:space-y-32 lg:my-32">
        {/* SECTION HERO */}
        <SectionHero
          className="pb-10"
          heading={
            <span>
              Discover 🖼️
              <br /> collect, and sell <br /> extraordinary {` `}
              <span className="relative pr-3">
                <Image
                  className="w-full absolute bottom-3 -left-1"
                  src={Vector1}
                  alt="Vector1"
                />
                <span className="relative">NFTs</span>
              </span>
            </span>
          }
        />

        <SectionHowItWork />
      </div>

      <div className="bg-neutral-100/80 dark:bg-black/20 py-20 lg:py-32">
        <div className="container">
          <SectionLargeSlider />
        </div>
      </div>

      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
        <SectionGridAuthorBox boxCard="box3" />

        <div className="relative py-20 lg:py-28">
          <BackgroundSection />
          <SectionSliderCollections />
        </div>

        <SectionGridFeatureNFT />

        <div className="relative py-20 lg:py-24">
          <BackgroundSection />
          <SectionBecomeAnAuthor />
        </div>

        <SectionSliderCategories />

        <SectionVideos />
      </div>
    </div>
  );
}

export default PageHome;
