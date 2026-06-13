"use client";

import { DollarSign, Shield, Truck } from 'lucide-react';
import React from 'react'
import GuyDelivery from "../../assets/img/deliveryGuy.png"
import Image from 'next/image';

const Experiences = () => {

    const _experiencesDisplay = [
        {
            title: "Secured Services",
            desc: "Your packages are in safe hands. We ensure every delivery is handled securely, giving you peace of mind from pickup to drop-off.",
            icon: <Shield className="w-10 h-10 text-blue-600" />,
        },
        {
            title: "Lowest Cost",
            desc: "High-quality courier services at competitive rates. We optimize every route to keep delivery costs minimal without compromising speed or safety.",
            icon: <DollarSign className="w-10 h-10 text-blue-600" />,
        },
        {
            title: "Fast Delivery",
            desc: "Time is money. Our logistics network guarantees rapid delivery times so your packages reach their destination faster than ever.",
            icon: <Truck className="w-10 h-10 text-blue-600" />,
        },
    ];

  return (
    <div className="px-[5%] md:px-[12%] lg:px-[16%] mb-5">
        <h2 className='text-xl md:text-3xl font-semibold'>30+ Years Experiences in Courier Service</h2>
        <p
          className='mt-4 text-sm md:text-base text-justify'
        >
            Apex Delivery stands out as the best choice for your courier needs due to our user-friendly interface, efficient service, reliable tracking, and dedicated customer support for all clients.
        </p>

        <div className="mt-20 lg:flex lg:flex-row justify-between lg:items-start lg:gap-10">
            <div className=' '>
              {_experiencesDisplay.map((item, index) => (
                <div key={index}
                   className='flex items-start gap-6 mb-12'
                 >
                        <div
                        className='border-3 border-blue-100 rounded-full p-4'
                        >
                            {item.icon}
                        </div>
                        <div>
                            <h3 className='text-xl md:text-2xl font-semibold'>{item.title}</h3>
                            <p className='text-base text-gray-800'>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Image
               src={GuyDelivery}
               alt='...'
               priority
               className=' lg:w-100 h-auto'
            />
        </div>
    </div>
  )
}

export default Experiences