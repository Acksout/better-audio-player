"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import folderIcon from "/public/folder-icon.svg";
import arrow from "/public/arrow.svg";
import audioWave from "/public/audio-wave.svg";
import AudioPlayerModal from "@/app/components/AudioPlayerModal";

const FileShowcase = () => {
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleExpand = useCallback((folderId, event) => {
    event.stopPropagation();
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  }, []);

  const handleFileClick = useCallback(async (file, event) => {
    event.stopPropagation();
    setIsLoading(true);
    if ("caches" in window) {
      const cache = await caches.open("audio-files");
      const cachedResponse = await cache.match(file.src);
      if (!cachedResponse) {
        const response = await fetch(file.src);
        await cache.put(file.src, response.clone());
      }
    }
    setIsLoading(false);
    setSelectedFile(file);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedFile(null);
  }, []);

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

  const capitalize = useCallback((str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  const renderFileOrFolder = useCallback(
    (item, index, isChild = false) => (
      <div
        key={item.id}
        className={`flex flex-row flex-wrap items-center space-x-4 cursor-pointer p-2 transition-colors duration-200 hover:bg-white/10 ${
          isChild ? "" : "border border-white/20 mb-4 rounded-lg"
        }`}
      >
        {item.fileType === "Folder" && (
          <div onClick={(event) => toggleExpand(item.id, event)}>
            <Image
              src={arrow}
              alt="Arrow"
              width={24}
              height={24}
              className={`transform transition-transform duration-200 ${
                expandedFolders[item.id] ? "rotate-90" : "rotate-0"
              }`}
            />
          </div>
        )}
        <Image
          src={item.fileType === "Folder" ? folderIcon : audioWave}
          alt="File Icon"
          width={24}
          height={24}
        />

        <p
          className="flex-grow hover:text-[#F1FF9B] transition-colors duration-200"
          onClick={(event) =>
            item.fileType !== "Folder" && handleFileClick(item, event)
          }
        >
          {capitalize(item.fileName)}
        </p>
        <p className="text-sm w-40 hover:text-[#F1FF9B] transition-colors duration-200">
          {capitalize(item.modifiedDate)}
        </p>
        <p className="text-sm w-24 hover:text-[#F1FF9B] transition-colors duration-200">
          {capitalize(item.fileSize)}
        </p>
        <p className="text-sm w-24 hover:text-[#F1FF9B] transition-colors duration-200">
          {capitalize(item.fileType)}
        </p>

        {item.fileType === "Folder" && expandedFolders[item.id] && (
          <div className="w-full mt-2 ml-10 pl-4">
            {item.children.map((child, childIndex) =>
              renderFileOrFolder(child, childIndex, true)
            )}
          </div>
        )}
      </div>
    ),
    [expandedFolders, handleFileClick, toggleExpand, capitalize]
  );

  return (
    <div className="space-y-4">
      {files.map((item, index) => renderFileOrFolder(item, index))}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      {selectedFile && !isLoading && (
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
