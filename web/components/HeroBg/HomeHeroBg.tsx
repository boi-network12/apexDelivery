"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Carouse1 from "../../assets/img/container.jpg";
import Carouse2 from "../../assets/img/plane1.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const images = [Carouse1, Carouse2]; 
const INTERVAL = 5000;

const HomeHeroBg = () => {
  const navigate = useRouter();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, INTERVAL);
    return () => clearTimeout(timer);
  }, [current]);

  const prevImage = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="h-130 md:h-190 relative group">
      {/* Background image */}
      <Image
        src={images[current]}
        alt="hero-bg"
        className="w-full h-full object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-950/70 pointer-events-none" />

      {/* Navigation arrows, hidden by default and appear on hover */}
      <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-between w-full px-3 md:px-20 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
        <button
          type="button"
          onClick={prevImage}
          className={styles.cursorBtn}
          aria-label="left-arrow"
        >
          <ChevronLeft className="w-6 h-6 text-black/70 hover:text-white" />
        </button>
        <button
          type="button"
          onClick={nextImage}
          className={styles.cursorBtn}
          aria-label="right-arrow"
        >
          <ChevronRight className="w-6 h-6 text-black/70 hover:text-white" />
        </button>
      </div>

      {/* Hero content */}
      <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <div>
          <h5 className="text-blue-500 font-medium text-md md:text-3xl tracking-wider line-clamp-1">
            Welcome to Apex Delivery
          </h5>
          <h1 className="text-white text-2xl md:text-3xl mt-2 line-clamp-2 font-semibold px-10 capitalize">
            We Provide Best Dispatch and Parcel Services
          </h1>
        </div>
        <div className="flex justify-center items-center gap-5 mt-5">
          <button
            onClick={() => navigate.push("/#service")}
            className="border border-blue-500 bg-blue-500/80 hover:bg-blue-950/70 text-white font-medium px-5 py-2 rounded-full mt-5 transition-all duration-200 ease-in-out"
          >
            Get Quotes
          </button>
          <button
            onClick={() => navigate.push("/#contact")}
            className="border border-gray-200 bg-transparent hover:bg-blue-950/70 text-white font-medium px-5 py-2 rounded-full mt-5 transition-all duration-200 ease-in-out"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  cursorBtn:
    "bg-white rounded-full p-2 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 ease-in-out hover:bg-blue-500",
};

export default HomeHeroBg;
