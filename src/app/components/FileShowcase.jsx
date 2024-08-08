import React, {useState} from "react";
import Image from "next/image";
import folderIcon from "/public/folder-icon.svg";
import arrow from "/public/arrow.svg";
import audioWave from "/public/audio-wave.svg";
import AudioPlayerModal from "@/app/components/AudioPlayerModal";

const FileShowcase = ({files}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleFileClick = (file) => {
        setSelectedFile(file);
    };

    const handleModalClose = () => {
        setSelectedFile(null);
    };

    return (
        <div className="border border-white/20">
            <div
                className="m-2 flex flex-row flex-wrap items-center space-x-4 hover:text-[#F1FF9B] cursor-pointer"
                onClick={toggleExpand}
            >
                <Image
                    src={arrow}
                    alt="Arrow"
                    width={24}
                    height={24}
                    className={`transform transition-transform ${
                        isExpanded ? "rotate-90" : "rotate-0"
                    }`}
                />
                <p className="text-xs">{files.length}</p>
                <Image src={folderIcon} alt="Folder Icon" width={24} height={24}/>
                <p className="pr-[600px]">1_NEW</p>
                <p className="text-sm pr-10">08.06.24 07:04AM</p>
                <p className="text-sm pr-10">28MB</p>
                <p className="text-sm pr-10">Folder</p>
            </div>
            {isExpanded && (
                <div className="ml-10 mt-2 border-l border-white/20 pl-4">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex flex-row flex-wrap items-center space-x-4 hover:text-[#F1FF9B] cursor-pointer"
                            onClick={() => handleFileClick(file)}
                        >
                            <p className="text-xs">{index + 1}</p>
                            <Image src={audioWave} alt="File Icon" width={24} height={24}/>
                            <p className="pr-[473px]">{file.fileName}</p>
                            <p className="text-sm pr-10">{file.modifiedDate}</p>
                            <p className="text-sm pr-10">{file.fileSize}</p>
                            <p className="text-sm pr-10">{file.fileType}</p>
                        </div>
                    ))}
                </div>
            )}
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