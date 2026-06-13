"use client"

import { BellDot, User } from "lucide-react";
import React from "react";

const AdminHeader = ({ pageTitle }: { pageTitle: string }) => {
  return (
    <div className="w-full flex flex-row bg-white border-b border-gray-200 px-1.5 md:px-8 items-center justify-between md:h-20 h-15">
      <h1 className="capitalize text-gray-700 text-xl font-semibold">
        {pageTitle || "Dashboard"}
      </h1>

{/* omo */}
      <div className="flex flex-row gap-5 text-gray-700">
        <BellDot />
        <User />
      </div>
    </div>
  );
};

export default AdminHeader;
