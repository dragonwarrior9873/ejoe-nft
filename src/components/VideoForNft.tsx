"use client";

import NcImage from "@/shared/NcImage/NcImage";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { StaticImageData } from "next/image";
import React, { FC, useState } from "react";
import { useVideo } from "react-use";

interface VideoForNftProps {
  src?: string;
  featuredImage: string | StaticImageData;
}

const VideoForNft: FC<VideoForNftProps> = ({
  src = "https://www.w3schools.com/html/mov_bbb.mp4",
  featuredImage = "",
}) => {
  const [video, state, controls, ref] = useVideo(
    <video className="absolute inset-0 w-full h-full object-cover rounded-3xl">
      <source
        src={"https://www.w3schools.com/html/mov_bbb.mp4"}
        type="video/mp4"
      />
      <source
        src={"https://www.w3schools.com/html/mov_bbb.ogg"}
        type="video/ogg"
      />
      Your browser does not support the video tag.
    </video>
  );

  const [firstRender, setFirstRender] = useState(false);

  const renderIcon = () => {
    if (!state.playing) {
      return (
        <svg
          className="ml-0.5 mt-0.5 w-9 h-9"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M18.25 12L5.75 5.75V18.25L18.25 12Z"
          ></path>
        </svg>
      );
    }

    return (
      <svg className=" w-9 h-9" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M15.25 6.75V17.25"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8.75 6.75V17.25"
        ></path>
      </svg>
    );
  };

  const renderPlayButton = () => {
    return (
      <div
        className={`absolute z-10 bottom-2 left-2 w-14 h-14 flex items-center justify-center rounded-full cursor-pointer select-none ${
          state.playing
            ? "bg-neutral-900/40 text-primary-50"
            : "bg-neutral-50 text-primary-500"
        }`}
        onClick={() => {
          setFirstRender(true);
          state.playing ? controls.pause() : controls.play();
        }}
      >
        {renderIcon()}
      </div>
    );
  };

  const renderMuted = () => {
    const isMuted = state.muted;
    return (
      <div
        className={`absolute z-10 bottom-2 right-2 h-6 w-6 rounded-full bg-black bg-opacity-70 text-white flex items-center justify-center text-sm transform transition-transform hover:scale-125 select-none`}
        onClick={() => {
          isMuted ? controls.unmute() : controls.mute();
        }}
      >
        {isMuted ? (
          <>
            <SpeakerXMarkIcon className="w-3.5 h-3.5" />
          </>
        ) : (
          <SpeakerWaveIcon className="w-3.5 h-3.5" />
        )}
      </div>
    );
  };

  const renderFeaturedImage = () => {
    return (
      <NcImage
        containerClassName={`absolute inset-0 ${
          firstRender ? "opacity-0" : "opacity-100"
        } transition-opacity duration-1000`}
        src={featuredImage}
        className="object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform "
        fill
      />
    );
  };

  return (
    <div className="absolute inset-0 z-10">
      {video}
      {renderPlayButton()}
      {firstRender && renderMuted()}
      {renderFeaturedImage()}
    </div>
  );
};

export default VideoForNft;
