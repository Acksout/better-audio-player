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

    const updateTime = () => {
        if (soundRef.current && soundRef.current.playing()) {
            setCurrentTime(soundRef.current.seek());
            requestAnimationFrame(updateTime);
        }
    };

    useEffect(() => {
        console.log("Creating Howl instance with src:", src);
        soundRef.current = new Howl({
            src: [src],
            format: ["mp3"],
            html5: true,
            onload: () => {
                console.log("Audio loaded, duration:", soundRef.current.duration());
                setDuration(soundRef.current.duration());
            },
            onplay: () => {
                setIsPlaying(true);
                requestAnimationFrame(updateTime);
            },
            onpause: () => {
                setIsPlaying(false);
            },
            onstop: () => {
                setIsPlaying(false);
                setCurrentTime(0);
            },
            onseek: () => {
                setCurrentTime(soundRef.current.seek());
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
        } else {
            console.error("Howl instance not initialized");
        }
    };

    const handleProgressChange = (e) => {
        const newTime = (parseFloat(e.target.value) / 100) * duration;
        if (soundRef.current) {
            const wasPlaying = isPlaying;
            if (wasPlaying) {
                soundRef.current.pause();
            }
            soundRef.current.seek(newTime);
            setCurrentTime(newTime);
            if (wasPlaying) {
                soundRef.current.play();
            }
        }
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
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 ${
                isOpen ? "visible" : "invisible"
            }`}
            onClick={(e) => {
                if (e.target.classList.contains("fixed")) {
                    onClose();
                }
            }}
        >
            <div
                className="w-full max-w-md rounded-lg bg-white/20 p-6 shadow-lg"
                style={{
                    maxWidth: "600px",
                }}
            >
                <div className="mb-4 flex items-center justify-between">
                    <button
                        onClick={togglePlay}
                        className="cursor-pointer border-none bg-transparent text-2xl text-white/60"
                    >
                        {isPlaying ? "❚❚" : "▶"}
                    </button>
                    <div className="h-4 w-1/4">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume * 100}
                            onChange={handleVolumeChange}
                            className="w-full appearance-none rounded-lg bg-white/40"
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
                    className="mb-2 w-full appearance-none rounded-lg bg-white/40"
                />
                <div className="flex justify-between text-sm text-white/60">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="mt-4 text-sm">
                    <div className="text-white/80">{fileName}</div>
                    <div className="text-xs text-white/30">
                        MODIFIED {modifiedDate}
                        <br/>
                        {fileSize}
                        <br/>
                        {fileType}
                    </div>
                </div>
                <button
                    className="absolute top-4 right-4 text-xl text-black"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default AudioPlayerModal;