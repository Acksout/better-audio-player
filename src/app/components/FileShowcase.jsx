"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import folderIcon from "/public/folder-icon.svg";
import arrow from "/public/arrow.svg";
import audioWave from "/public/audio-wave.svg";
import AudioPlayerModal from "@/app/components/AudioPlayerModal";

const FileShowcase = () => {
    const [expandedFolders, setExpandedFolders] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);

    const toggleExpand = (folderId) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    };

    const handleFileClick = async (file) => {
        if ("caches" in window) {
            const cache = await caches.open("audio-files");
            const cachedResponse = await cache.match(file.src);
            if (!cachedResponse) {
                const response = await fetch(file.src);
                await cache.put(file.src, response.clone());
            }
            setSelectedFile(file);
        } else {
            setSelectedFile(file);
        }
    };

    const handleModalClose = () => {
        setSelectedFile(null);
    };

    useEffect(() => {
        const fetchDirectoryContents = async () => {
            try {
                const response = await fetch("/api/drive");
                const filesDetails = await response.json();
                setFiles(filesDetails);
            } catch (error) {
                console.error("Error fetching directory contents", error);
            }
        };

        fetchDirectoryContents();
    }, []);

    const capitalize = (str) => {
        return str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

    const renderFileOrFolder = (item, index, isChild) => (
        <div
            key={item.id}
            className={`flex flex-row flex-wrap items-center space-x-4 cursor-pointer p-2 ${
                isChild ? "" : "border border-white/20 mb-4"
            }`}
            onClick={() => item.fileType === "Folder" ? toggleExpand(item.id) : handleFileClick(item)}
        >
            {item.fileType === "Folder" && (

                <Image
                    src={arrow}
                    alt="Arrow"
                    width={24}
                    height={24}
                    className={`transform transition-transform ${
                        expandedFolders[item.id] ? "rotate-90" : "rotate-0"
                    }`}
                />
            )}
            <Image
                src={item.fileType === "Folder" ? folderIcon : audioWave}
                alt="File Icon"
                width={24}
                height={24}
            />

            <p className="pr-[500px] hover:text-[#F1FF9B] ">{capitalize(item.fileName)}</p>
            <p className="text-sm pr-10 hover:text-[#F1FF9B]">{capitalize(item.modifiedDate)}</p>
            <p className="text-sm pr-10 hover:text-[#F1FF9B]">{capitalize(item.fileSize)}</p>
            <p className="text-sm pr-10 hover:text-[#F1FF9B]">{capitalize(item.fileType)}</p>


            {item.fileType === "Folder" && expandedFolders[item.id] && (
                <div className="mt-2 ml-10 pl-4">
                    {item.children.map((child, childIndex) => renderFileOrFolder(child, childIndex, true))}
                </div>
            )}
        </div>
    );

    return (
        <div>
            {files.map((item, index) => renderFileOrFolder(item, index))}
            {selectedFile && (
                <AudioPlayerModal
                    src={selectedFile.src}
                    fileName={capitalize(selectedFile.fileName)}
                    fileSize={capitalize(selectedFile.fileSize)}
                    fileType={capitalize(selectedFile.fileType)}
                    modifiedDate={capitalize(selectedFile.modifiedDate)}
                    isOpen={true}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default FileShowcase;