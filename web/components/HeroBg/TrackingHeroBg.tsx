"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

const TrackingHeroBg = () => {
  const pathname = usePathname(); // current route (e.g., /order/tracking)
  const router = useRouter();

  // Split path into breadcrumbs
  const segments = pathname.split("/").filter(Boolean); // remove empty strings

  return (
    <div className="bg-blue-950/80 w-full h-[500px] flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-white text-2xl font-semibold md:text-5xl">
          Order Tracking
        </h3>

        {/* Breadcrumbs */}
        <div className="text-white flex items-center justify-center gap-2 mt-2 text-sm md:text-base">
          <button
            onClick={() => router.back()}
            className="hover:underline hover:text-gray-300"
          >
            ← Back
          </button>

          <span>|</span>

          {segments.length > 0 ? (
            <span className="capitalize">{segments.join(" / ")}</span>
          ) : (
            "Home"
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingHeroBg;
