"use client";

import React from 'react'
import Logo from "../../assets/img/logo.png";
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {

  const _socialMedia = [
    { icon: <Instagram />, link: "https://www.instagram.com/#" },
    { icon: <Linkedin />, link: "https://www.linkedin.com/#" },
    { icon: <Twitter />, link: "https://www.x.com/#" },
    { icon: <Facebook />, link: "https://www.facebook.com/#" },
  ];

  const _links = [
    {
      title: "Company",
      items: ["About Us", "Careers", "Blog", "Contact"]
    },
    {
      title: "Services",
      items: ["Courier", "Freight", "Logistics", "E-commerce Solutions"]
    },
    {
      title: "Support",
      items: ["Help Center", "FAQs", "Privacy Policy", "Terms & Conditions"]
    },
  ];

  return (
    <div className='bg-blue-950/80 px-[5%] md:px-[12%] lg:px-[16%] py-10 lg:flex lg:flex-row justify-between lg:items-start lg:gap-20'>
      {/* Left Side */}
      <div className="lg:w-1/2">
        <Image
          src={Logo}
          alt="Logo"
          className='w-35 h-10 object-contain md:w-65 md:h-20'
        />
        <p className='text-gray-200 text-base text-start mt-4'>
          Providing reliable, efficient, and secure courier solutions tailored to your needs. 
          Connect with us for exceptional support and a seamless shipping experience.
        </p>

        {/* Social Media */}
        <div className="mt-5 flex flex-row justify-start items-center gap-3 text-white text-lg">
          {_socialMedia.map((item, index) => (
            <Link 
              key={index} 
              href={item.link} 
              className='bg-blue-900/50 backdrop-blur-md p-2 rounded-full hover:bg-blue-700/70 transition-all duration-300'
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-10 lg:mt-0 text-gray-200 text-sm">
        {_links.map((section, i) => (
          <div key={i}>
            <h4 className="text-white font-semibold text-lg mb-4">{section.title}</h4>
            <ul className="space-y-2">
              {section.items.map((link, j) => (
                <li key={j}>
                  <Link 
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2"><Phone size={16}/> +1 (234) 567-8901</li>
            <li className="flex items-center gap-2"><Mail size={16}/> support@logistics.com</li>
            <li className="flex items-center gap-2"><MapPin size={16}/> wake County, North carolina</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Footer;
