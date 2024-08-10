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
        console.log("Creating Howl instance with src:", src);
        soundRef.current = new Howl({
            src: [src],
            format: ["mp3"], // Specify the format explicitly
            html5: true, // Force HTML5 audio for streaming
            onload: () => {
                console.log("Audio loaded, duration:", soundRef.current.duration());
                setDuration(soundRef.current.duration());
            },
            onloaderror: (id, error) => {
                console.error("Error loading audio:", error);
            },
        });
        return () => soundRef.current.unload();
    }, [src]);

    const togglePlay = () => {
        if (soundRef.current) {
            if (isPlaying) {
                soundRef.current.pause();
            } else {
                soundRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } else {
            console.error("Howl instance not initialized");
        }
    };

    useEffect(() => {
        const updateTime = () => {
            if (soundRef.current && isPlaying) {
                setCurrentTime(soundRef.current.seek());
                requestAnimationFrame(updateTime);
            }
        };
        if (isPlaying) updateTime();
    }, [isPlaying]);


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
                className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg"
                style={{
                    maxWidth: "600px",
                }}
            >
                <div className="mb-4 flex items-center justify-between">
                    <button
                        onClick={togglePlay}
                        className="cursor-pointer border-none bg-transparent text-2xl text-white"
                    >
                        {isPlaying ? "❚❚" : "▶"}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume * 100}
                        onChange={handleVolumeChange}
                        className="h-5 w-5 cursor-pointer appearance-none bg-white"
                    />
                </div>
                <input
                    ref={progressRef}
                    type="range"
                    min="0"
                    max="100"
                    value={(currentTime / duration) * 100 || 0}
                    onChange={handleProgressChange}
                    className="mb-2 w-full"
                />
                <div className="flex justify-between text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="mt-4 text-sm">
                    <div>{fileName}</div>
                    <div className="text-xs text-gray-500">
                        MODIFIED {modifiedDate}
                        <br/>
                        {fileSize}
                        <br/>
                        {fileType}
                    </div>
                </div>
                <button
                    className="absolute top-4 right-4 text-xl text-white"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default AudioPlayerModal;