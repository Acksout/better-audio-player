"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Howl } from "howler";

const AudioPlayerModal = ({
  src,
  fileName,
  fileSize,
  fileType,
  modifiedDate,
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const soundRef = useRef(null);
  const progressRef = useRef(null);

  const updateTime = useCallback(() => {
    if (soundRef.current?.playing()) {
      setCurrentTime(soundRef.current.seek());
      requestAnimationFrame(updateTime);
    }
  }, []);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [src],
      format: ["mp3"],
      html5: true,
      onload: () => setDuration(soundRef.current.duration()),
      onplay: () => {
        setIsPlaying(true);
        requestAnimationFrame(updateTime);
      },
      onpause: () => setIsPlaying(false),
      onstop: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onseek: () => setCurrentTime(soundRef.current.seek()),
      onloaderror: (_, error) => console.error("Error loading audio:", error),
    });
    return () => soundRef.current.unload();
  }, [src, updateTime]);

  const togglePlay = () => {
    if (soundRef.current) {
      isPlaying ? soundRef.current.pause() : soundRef.current.play();
    } else {
      console.error("Howl instance not initialized");
    }
  };

  const handleProgressChange = (e) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (soundRef.current) {
      soundRef.current.seek(newTime);
      setCurrentTime(newTime);
      if (!isPlaying) {
        soundRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    soundRef.current?.volume(newVolume);
    setVolume(newVolume);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-8 shadow-2xl ring-1 ring-white/10">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="rounded-full bg-white/10 p-5 text-4xl text-white/90 transition-all hover:bg-white/20 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <div className="w-1/3">
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              className="w-full appearance-none rounded-lg bg-white/30 accent-white/90 hover:accent-white"
            />
          </div>
        </div>
        <input
          ref={progressRef}
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleProgressChange}
          className="mb-3 w-full appearance-none rounded-lg bg-white/30 accent-white/90 hover:accent-white"
        />
        <div className="mb-6 flex justify-between text-sm font-medium text-stone-300">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="mt-8 text-sm">
          <h3 className="mb-3 text-xl font-bold text-stone-100">{fileName}</h3>
          <p className="text-xs font-medium text-stone-400">
            Modified: {modifiedDate}
            <br />
            Size: {fileSize}
            <br />
            Type: {fileType}
          </p>
        </div>
        <button
          className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-2xl text-white/70 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AudioPlayerModal;
