"use client";
import FileShowcase from "./components/FileShowcase";
import React from "react";

export default function Home() {
    return (
        <div>
            <h1 className="m-2 text-center text-xl">808 Vault</h1>
            <div className="flex items-center text-sm">
                <p className="pl-[653px]">Date Modified</p>
                <p className="pl-[133px]">Size</p>
                <p className="pl-[82px]">Kind</p>
            </div>
            <FileShowcase/>


        </div>
    );
}
