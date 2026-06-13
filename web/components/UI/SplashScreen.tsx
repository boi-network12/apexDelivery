"use client";

import { useEffect, useState } from "react";

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-[#0A1D3D]">
        <div className="relative w-12 h-12 border-2 border-white rounded-full animate-[spin_1s_linear_infinite]">
            <span className="absolute left-0 top-0 w-1.5 h-1.5 bg-[#FF3D00] rounded-full translate-x-[150%] translate-y-[150%]"></span>
            <span className="absolute right-0 bottom-0 w-1.5 h-1.5 bg-[#FF3D00] rounded-full -translate-x-[150%] -translate-y-[150%]"></span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
