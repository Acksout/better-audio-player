"use client";
import FileShowcase from "./components/FileShowcase";
import React from "react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">808 Vault</h1>
      <div className="flex justify-end text-sm text-gray-400 mb-2">
        <p className="w-40">Date Modified</p>
        <p className="w-24">Size</p>
        <p className="w-24">Kind</p>
      </div>
      <FileShowcase />
    </div>
  );
}
