import React, { FC } from "react";
import NcImage from "@/shared/NcImage/NcImage";
import { imgHigtQualitys } from "@/contains/fakeData";
import PostCardMeta from "@/components/PostCardMeta/PostCardMeta";
import Link from "next/link";

export interface Card12Props {
  className?: string;
}

const Card12: FC<Card12Props> = ({ className = "h-full" }) => {
  return (
    <div className={`nc-Card12 group relative flex flex-col ${className}`}>
      <Link
        href={"/blog-single"}
        className="block flex-shrink-0 flex-grow relative w-full h-0 aspect-w-4 aspect-h-3 rounded-3xl overflow-hidden"
      >
        <NcImage
          src={imgHigtQualitys[0]}
          containerClassName="absolute inset-0"
          alt={"title"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </Link>

      <div className=" mt-8 pr-10 flex flex-col">
        <h2
          className={`nc-card-title block font-semibold text-neutral-900 dark:text-neutral-100 transition-colors text-lg sm:text-2xl`}
        >
          <Link
            href={"/blog-single"}
            className="line-clamp-2 capitalize"
            title={"title"}
          >
            Adipiscing Bibendum Est Ultricies.
          </Link>
        </h2>
        <span className="hidden sm:block mt-4 text-neutral-500 dark:text-neutral-400">
          <span className="line-clamp-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
            vero perspiciatis ullam ea? Nihil accusamus similique debitis
            tempore mollitia? Aperiam.
          </span>
        </span>
        <PostCardMeta className="mt-5" />
      </div>
    </div>
  );
};

export default Card12;
