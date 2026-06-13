"use client";

import React from "react";

const Contact = () => {
  const branches = [
    {
      country: "United Kingdom",
      flag: "🇬🇧",
      address: "221B Baker Street, London",
      phone: "+44 20 7946 0958",
      email: "uk@logistics.com",
    },
    {
      country: "United States",
      flag: "🇺🇸",
      address: "1600 Pennsylvania Ave NW, Washington, DC",
      phone: "+1 202-456-1111",
      email: "usa@logistics.com",
    },
    {
      country: "Global Contact",
      flag: "🌐",
      address: "Reach us from anywhere in the world",
      phone: "+000 000 0000",
      email: "global@logistics.com",
    },
  ];

  return (
    <div className="bg-blue-950/80 px-[5%] md:px-[12%] lg:px-[16%] py-10">
      <h3 className="text-white text-2xl font-semibold text-center">
        Our Top Branches
      </h3>
      <p className="text-gray-200 text-base text-center mt-4">
        Discover our branches located in key areas, ensuring convenient access
        to our courier services and exceptional support for all your shipping
        needs.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {branches.map((branch, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            <div className="text-5xl mb-4">{branch.flag}</div>
            <h4 className="text-white text-xl font-semibold mb-2">
              {branch.country}
            </h4>
            <p className="text-gray-300 text-sm mb-1">{branch.address}</p>
            <p className="text-gray-300 text-sm mb-1">📞 {branch.phone}</p>
            <p className="text-gray-300 text-sm">✉️ {branch.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
