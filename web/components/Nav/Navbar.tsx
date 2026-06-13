"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Mail, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../assets/img/logo.png";

interface NavbarProps {
  _links?: {
    name: string;
    url: string;
  }[];
}

const Navbar = ({ _links }: NavbarProps) => {
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkScreen();

    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggleMenu = () => {
    setOpen(!open);
  };

  // Scroll behavior
  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        setIsSticky(window.scrollY > 50);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      const node = topBarRef.current;
      const observer = new IntersectionObserver(
        ([entry]) => setIsSticky(!entry.isIntersecting),
        { threshold: 0 }
      );

      if (node) observer.observe(node);

      return () => {
        if (node) observer.unobserve(node);
      };
    }
  }, [isMobile]);

  return (
    <div>
      {/* tablet and desktop display only */}
      <div
        ref={topBarRef}
        className="hidden relative md:flex px-[12%] lg:px-[16%] flex-row justify-between items-center py-5 border-b border-gray-300 z-40"
      >
        <div className="flex flex-row items-center justify-start gap-5">
          <Link href="mailto:apexdelivery64@gmail.com" className={styles.mailPhoneLink}>
            <Mail className="text-xs text-blue-600" size={20} />
            <span>support@apexdelivery.net</span>
          </Link>
          <Link href="/" className={styles.mailPhoneLink}>
            <Phone className="text-xs text-blue-600" size={20} />
            <span>+1 (234) 567-8901</span>
          </Link>
        </div>

        <div className="flex flex-row items-center justify-end gap-5">
          <select
            aria-label="language"
            name="language"
            className="outline-none bg-transparent text-gray-100 border border-gray-200 p-2"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>

          <button
            type="button"
            aria-label="order tracking"
            className="outline-none bg-blue-600 hover:bg-white border border-blue-600 rounded-4xl px-4 py-2 hover:text-blue-600 transition-all duration-300 ease-in-out"
          >
            <Link href="/tracking" className={styles.mailPhoneLink}>
              <span>Order Tracking</span>
            </Link>
          </button>
        </div>
      </div>

      {/* sticky navbar */}
      <div
        className={`w-full px-[5%] md:px-[12%] lg:px-[16%] py-5 flex flex-row justify-between items-center transition-all duration-300 relative ${
          isSticky
            ? "fixed top-0 z-50 bg-blue-950 shadow-xs"
            : "sticky top-0 z-40 bg-transparent"
        }`}
      >
        <div className="logoD">
          <Link href="/">
            <Image
              src={Logo}
              alt="Logo"
              className="w-40 h-10 object-contain"
              priority
            />
          </Link>
        </div>

        <ul
          className={`hidden lg:flex flex-row justify-center items-center gap-10 font-medium text-base transition-colors duration-300 ${
            isSticky ? "text-gray-100" : "text-gray-100"
          }`}
        >
          {_links?.map((link, index) => (
            <li key={index}>
              <Link href={link.url}>{link.name}</Link>
            </li>
          ))}
        </ul>

        {/* tablet + mobile menu */}
        <div className="flex flex-row items-center justify-end gap-5 lg:hidden">
          <Menu size={25} className="text-gray-100" onClick={() => toggleMenu()} />
        </div>
      </div>

      {/* Bible-like opening animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
            className="lg:hidden fixed top-0 left-0 bg-blue-950 w-full min-h-screen z-70 flex items-start justify-start px-10 md:px-[10%] flex-col"
          >
            <button
              aria-label="close menu"
              type="button"
              className="absolute top-5 right-5 cursor-pointer"
              onClick={() => toggleMenu()}
            >
              <X size={20} className="text-pink-800" />
            </button>

            <div className="w-full mt-20 md:hidden">
              <div className="flex flex-row items-center justify-center gap-5">
                <select
                  aria-label="language"
                  name="language"
                  id="language"
                  className="outline-none bg-transparent text-gray-100 border border-gray-200 p-2"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>

                <button
                  type="button"
                  aria-label="order tracking"
                  className="outline-none bg-blue-600 hover:bg-white border border-blue-600 rounded-4xl px-4 py-2 hover:text-blue-600 transition-all duration-300 ease-in-out"
                >
                  <Link href="/tracking" className={styles.mailPhoneLink}>
                    <span>Order Tracking</span>
                  </Link>
                </button>
              </div>
              <div className="flex flex-row items-center justify-center gap-5 mt-5">
                <Link href="mailto:support@apexdelivery.net" className={styles.mailPhoneLink}>
                  <span className="text-xs">support@apexdelivery.net</span>
                </Link>
                <Link href="/" className={styles.mailPhoneLink}>
                  <span className="text-xs">+1 (234) 567-8901</span>
                </Link>
              </div>
            </div>

            <ul className="w-full flex flex-col justify-center items-start gap-2 font-medium text-md text-gray-100 mt-10">
              {_links?.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="w-full hover:text-blue-600"
                  onClick={() => toggleMenu()}
                >
                  <li className="w-full py-2 border-b border-dotted border-gray-500">
                    {link.name}
                  </li>
                </Link>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  mailPhoneLink: `flex flex-row gap-2 text-base hover:text-blue-600 font-medium items-center text-white`,
};

export default Navbar;
