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

    const handleFileClick = (file) => {
        setSelectedFile(file);
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

    const renderFileOrFolder = (item, index) => (
        <div
            key={item.id}
            className="flex flex-row flex-wrap items-center space-x-4 hover:text-[#F1FF9B] cursor-pointer"
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
            <p className="text-xs">{index + 1}</p>
            <Image
                src={item.fileType === "Folder" ? folderIcon : audioWave}
                alt="File Icon"
                width={24}
                height={24}
            />
            <p className="pr-[473px]">{item.fileName}</p>
            <p className="pr-10 text-sm">{item.modifiedDate}</p>
            <p className="pr-10 text-sm">{item.fileSize}</p>
            <p className="pr-10 text-sm">{item.fileType}</p>
            {item.fileType === "Folder" && expandedFolders[item.id] && (
                <div className="mt-2 ml-10 border-l border-white/20 pl-4">
                    {item.children.map((child, childIndex) => renderFileOrFolder(child, childIndex))}
                </div>
            )}
        </div>
    );

    return (
        <div className="border border-white/20">
            {files.map((item, index) => renderFileOrFolder(item, index))}
            {selectedFile && (
                <AudioPlayerModal
                    src={selectedFile.src}
                    fileName={selectedFile.fileName}
                    fileSize={selectedFile.fileSize}
                    fileType={selectedFile.fileType}
                    modifiedDate={selectedFile.modifiedDate}
                    isOpen={true}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default FileShowcase;