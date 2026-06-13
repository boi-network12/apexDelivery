"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react"; // lucide icon
import CaseDisplay from "@/components/CaseDisplay/CaseDisplay";
import Experiences from "@/components/CaseDisplay/Experiences";
import Services from "@/components/CaseDisplay/Services";
import HomeHeroBg from "@/components/HeroBg/HomeHeroBg";
import Navbar from "@/components/Nav/Navbar";
import Bg1Display from "../assets/img/plane1.png";
import Bg2Display from "../assets/img/shipGlob.png";
import Bg3Display from "../assets/img/footerbg.png";
import ExploreSection from "../components/CaseDisplay/ExploreSection";
import Contact from "@/components/CaseDisplay/Contact";
import Teams from "@/components/CaseDisplay/Teams";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  const [showScroll, setShowScroll] = useState(false);

  // detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const _links = [
    { name: "Home", url: "#home" },
    { name: "About", url: "#about" },
    { name: "Team", url: "#team" },
    { name: "Service", url: "#service" },
    { name: "Contact", url: "#contact" },
  ];

  return (
    <div className="w-screen min-h-screen relative">
      {/* navbar display */}
      <Navbar _links={_links} />

      {/* hero bg */}
      <section id="home" className="w-full absolute top-0 left-0 ">
        <HomeHeroBg />
        <section className="w-full px-4 absolute top-100 left-0 md:top-160 flex justify-center items-center gap-8 flex-wrap">
          <CaseDisplay />
        </section>
      </section>

      <section
        id="about"
        className="w-full mt-[1300px] md:mt-[1150px] lg:mt-[800px]"
      >
        <Experiences />
      </section>

      {/* what we serve */}
      <section
        id="service"
        className="w-full relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Bg1Display.src})` } as React.CSSProperties}
      >
        <Services />
      </section>

      {/* explore section */}
      <section className="w-full">
        <ExploreSection />
      </section>

      {/* contact */}
      <section
        id="contact"
        className="w-full relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Bg2Display.src})` } as React.CSSProperties}
      >
        <Contact />
      </section>

      {/* team */}
      <section id="team" className="w-full">
        <Teams />
      </section>

      {/* footer */}
      <section
        id="footer"
        className="w-full relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Bg3Display.src})` } as React.CSSProperties}
      >
        <Footer />
        <div className="backdrop-blur-md bg-blue-950/70">
          <p className="text-white text-center py-4">
            © {new Date().getFullYear()} Logistics Company. All rights reserved.
          </p>
        </div>
      </section>

      {/* scroll to top button */}
      {showScroll && (
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
