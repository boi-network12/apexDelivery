"use client";

import React from 'react';
import Image1 from "../../assets/img/wareHouse.png";
import Image2 from "../../assets/img/ship.png";
import Image3 from "../../assets/img/box.png";
import Image4 from "../../assets/img/pallet.png";
import Image5 from "../../assets/img/vanBox.png";
import Image6 from "../../assets/img/bike.png";
import Image from 'next/image';

const Services = () => {

    const _servicesDisplay = [
        {
            image: Image1,
            title: "Warehousing",
            desc: "Our warehousing service provides secure storage solutions for your goods, offering inventory management and easy access, ensuring your items are safe and well-organized."
        },
        {
            image: Image2,
            title: "International Courier",
            desc: "Ship your packages worldwide with our international courier service, ensuring timely and secure delivery across borders while adhering to all customs regulations."
        },
        {
            image: Image3,
            title: "Over Night Courier",
            desc: "Need a package delivered by morning? Our overnight courier service provides guaranteed next-day delivery, ensuring your items reach their destination promptly and securely."
        },
        {
            image: Image4,
            title: "Pallet Courier",
            desc: "Ideal for heavy or bulk shipments, our pallet courier service offers safe and efficient transportation of goods on pallets, ensuring secure handling and delivery."
        },
        {
            image: Image5,
            title: "Express Courier",
            desc: "For urgent deliveries, our express courier service ensures swift handling and transportation, guaranteeing your packages arrive quickly and on time, every time."
        },
        {
            image: Image6,
            title: "Standard Courier",
            desc: "Reliable and cost-effective, our standard courier service delivers packages within a specified timeframe, perfect for everyday shipping needs without urgency."
        },
    ]


  return (
    <div className='bg-blue-950/80 px-[5%] md:px-[12%] lg:px-[16%] py-10'>
        <h3 className='text-white text-2xl font-semibold text-center'>What We Serve</h3>
        <p
        className='text-gray-200 text-base text-center mt-4'
        >
            We offer a comprehensive range of courier services tailored to meet your shipping needs, ensuring reliability, speed, and exceptional customer satisfaction every time.
        </p>

        <div className="flex flex-row flex-wrap justify-center items-center gap-6 mt-10">
            {_servicesDisplay.map((item, index) => (
                <div key={index}
                   className="w-full max-w-85 bg-blue-700/20 backdrop:blur-2xl border border-gray-200/20 rounded-lg p-6 mx-auto text-center text-white flex flex-col justify-center items-center gap-4"
                >
                    <Image 
                        src={item.image}
                        alt={item.title}
                        className='w-20 h-20 object-contain'
                    />
                    <h3 className='text-blue-500 font-semibold text-2xl'>{item.title}</h3>
                    <p className="text-gray-300 text-base">
                        {item.desc}
                    </p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Services