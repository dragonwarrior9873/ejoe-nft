import BackgroundSection from "@/components/BackgroundSection/BackgroundSection";
import SectionGridAuthorBox from "@/components/SectionGridAuthorBox/SectionGridAuthorBox";
import SectionHowItWork from "@/components/SectionHowItWork/SectionHowItWork";
import SectionMagazine8 from "@/components/SectionMagazine8";
import SectionSliderCardNftVideo from "@/components/SectionSliderCardNftVideo";
import SectionSliderCollections from "@/components/SectionSliderCollections";
import SectionSubscribe2 from "@/components/SectionSubscribe2/SectionSubscribe2";
import React from "react";
import SectionGridFeatureNFT2 from "../SectionGridFeatureNFT2";
import SectionSliderCategories from "@/components/SectionSliderCategories/SectionSliderCategories";
import SectionBecomeAnAuthor from "@/components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import SectionHero3 from "@/components/SectionHero/SectionHero3";

function PageHome3() {
  return (
    <div className="nc-PageHome3 relative">
      <div className="container px-4">
        <SectionHero3 />
      </div>

      <div className="container py-20 lg:py-32">
        <SectionHowItWork />
      </div>

      <div className="container relative space-y-24 mb-24 lg:space-y-32 lg:mb-32">
        {/* SECTION */}
        <div className="relative py-20 lg:py-28">
          <BackgroundSection />
          <SectionGridAuthorBox
            sectionStyle="style2"
            data={Array.from("11111111")}
            boxCard="box4"
          />
        </div>

        {/* SECTION */}
        <SectionSliderCollections />

        <SectionSubscribe2 />

        {/* SECTION */}
        <div className="relative py-20 lg:py-28">
          <BackgroundSection className="bg-neutral-100/70 dark:bg-black/20 " />
          <SectionGridFeatureNFT2 />
        </div>

        {/* SECTION 1 */}
        <SectionSliderCategories />

        {/* SECTION */}
        <div className="relative py-20 lg:py-24">
          <BackgroundSection />
          <SectionBecomeAnAuthor />
        </div>
      </div>
    </div>
  );
}

export default PageHome3;
