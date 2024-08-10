"use client";
import FileShowcase from "./components/FileShowcase";
import React from "react";

export default function Home() {
    return (
        <div>
            <h1 className="m-2 text-center text-xl">100 Audio Player</h1>
            <div className="flex items-center text-sm">
                <p className="pl-[777px]">Date Modified</p>
                <p className="pl-[90px]">Size</p>
                <p className="pl-[56px]">Kind</p>
            </div>
            <FileShowcase/>


        </div>
    );
}
