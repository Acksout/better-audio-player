"use client";

import React, {useState, useRef, useEffect} from "react";
import {Howl} from "howler";

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

    useEffect(() => {
        soundRef.current = new Howl({
            src: [src],
            onload: () => setDuration(soundRef.current.duration()),
        });
        return () => soundRef.current.unload();
    }, [src]);

    useEffect(() => {
        const updateTime = () => {
            if (soundRef.current && isPlaying) {
                setCurrentTime(soundRef.current.seek());
                requestAnimationFrame(updateTime);
            }
        };
        if (isPlaying) updateTime();
    }, [isPlaying]);

    const togglePlay = () => {
        if (isPlaying) {
            soundRef.current.pause();
        } else {
            soundRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * duration;
        soundRef.current.seek(newTime);
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value / 100;
        soundRef.current.volume(newVolume);
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
            className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 ${
                isOpen ? "visible" : "invisible"
            }`}
        >
            <div
                className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg"
                style={{
                    maxWidth: "600px",
                }}
            >
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={togglePlay}
                        className="bg-transparent border-none text-white text-2xl cursor-pointer"
                    >
                        {isPlaying ? "❚❚" : "▶"}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume * 100}
                        onChange={handleVolumeChange}
                        className="w-5 h-5 appearance-none bg-white cursor-pointer"
                    />
                </div>
                <input
                    ref={progressRef}
                    type="range"
                    min="0"
                    max="100"
                    value={(currentTime / duration) * 100 || 0}
                    onChange={handleProgressChange}
                    className="w-full mb-2"
                />
                <div className="flex justify-between text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="mt-4 text-sm">
                    <div>{fileName}</div>
                    <div className="text-gray-500 text-xs">
                        MODIFIED {modifiedDate}
                        <br/>
                        {fileSize}
                        <br/>
                        {fileType}
                    </div>
                </div>
                <button
                    className="absolute top-4 right-4 text-white text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default AudioPlayerModal;