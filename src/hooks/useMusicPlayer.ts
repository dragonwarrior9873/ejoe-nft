"use client";

import { createGlobalState } from "react-hooks-global-state";

const initialState: {
  playing: boolean;
  volume: number;
  muted: boolean;
  played: number;
  playedSeconds: number;
  loaded: number;
  duration: number;
  loadedSeconds: number;
  playbackRate: number;
  url: string;
} = {
  playing: false,
  volume: 0.8,
  muted: false,
  played: 0,
  playedSeconds: 0,
  loaded: 0,
  duration: 0,
  loadedSeconds: 0,
  playbackRate: 1.0,
  url: "",
};

const { useGlobalState } = createGlobalState(initialState);

export const useMusicPlayer = () => {
  const [playbackRate, setplaybackRate] = useGlobalState("playbackRate");
  const [duration, setDuration] = useGlobalState("duration");
  const [loaded, setLoaded] = useGlobalState("loaded");
  const [played, setPlayed] = useGlobalState("played");
  const [muted, setMuted] = useGlobalState("muted");
  const [volume, setVolume] = useGlobalState("volume");
  const [playing, setPlaying] = useGlobalState("playing");
  const [url, setUrl] = useGlobalState("url");
  const [loadedSeconds, setLoadedSeconds] = useGlobalState("loadedSeconds");
  const [playedSeconds, setPlayedSeconds] = useGlobalState("playedSeconds");

  return {
    duration,
    playedSeconds,
    setPlayedSeconds,
    loadedSeconds,
    setLoadedSeconds,
    setDuration,
    loaded,
    setLoaded,
    played,
    setPlayed,
    muted,
    setMuted,
    volume,
    setVolume,
    playing,
    setPlaying,
    playbackRate,
    setplaybackRate,
    url,
    setUrl,
  };
};
