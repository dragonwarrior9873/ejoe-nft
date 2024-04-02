"use client";

import {
  _getPersonNameRd,
  _getAvatarRd,
  _getImgHightQualityRd,
  _getImgRd,
  _getTagNameRd,
  _getTitleRd,
  avatarImgs,
  featuredImgs,
  imgHigtQualitys,
  aTitles,
  personNames,
  nftsImgs,
  nftsAbstracts,
} from "@/contains/fakeData";
import { StaticImageData } from "next/image";
import { useEffect, useId, useState } from "react";

export default function useGetRandomData() {
  const uniqueId = useId();
  const [imgRd, setImgRd] = useState(featuredImgs[0]);
  const [avatarRd, setAvatarRd] = useState(avatarImgs[0]);
  const [imgHigtQualitysRd, setImgHigtQualitysRd] = useState(
    imgHigtQualitys[0]
  );
  const [titleRd, setTitleRd] = useState(aTitles[0]);
  const [nftImageRd, setNftImageRd] = useState<string | StaticImageData>("");
  const [nftAudioUrlRl, setNftAudioUrlRl] = useState(
    "https://chisnghiax.com/ncmaz_mp3/Electro-Light_-_Symbolism_NCS_ReleaseMP3_160K.mp3"
  );
  const [nftsAbstractRd, setNftsAbstractRd] = useState(nftsAbstracts[0]);
  const [personNameRd, setPersonNameRd] = useState(personNames[0]);

  useEffect(() => {
    setImgRd(_getImgRd);
    setAvatarRd(_getAvatarRd);
    setImgHigtQualitysRd(_getImgHightQualityRd);
    setPersonNameRd(_getPersonNameRd);
    setTitleRd(_getTitleRd);
    setNftImageRd(nftsImgs[Math.floor(Math.random() * nftsImgs.length)]);
    setNftsAbstractRd(
      nftsAbstracts[Math.floor(Math.random() * nftsAbstracts.length)]
    );
  }, []);

  useEffect(() => {
    setNftAudioUrlRl(
      "https://chisnghiax.com/ncmaz_mp3/Electro-Light_-_Symbolism_NCS_ReleaseMP3_160K.mp3?" +
        uniqueId
    );
  }, [uniqueId]);

  return {
    imgRd,
    avatarRd,
    imgHigtQualitysRd,
    titleRd,
    personNameRd,
    nftImageRd,
    nftsAbstractRd,
    nftAudioUrlRl,
  };
}
