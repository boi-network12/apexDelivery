"use client";

import { FileText } from 'lucide-react';
import React from 'react'

const CaseDisplay = () => {

    const _caseDisplay = [
        {
            title: "Receive goods",
            description: "Track and receive your packages seamlessly, ensuring timely delivery and peace of mind with every shipment you make.",
            icon: <FileText size={40} className='text-blue-500' />
        },
        {
            title: "Submit Documents",
            description: "Effortlessly upload and submit required documents online, ensuring a smooth and efficient processing of your courier requests.",
            icon: <FileText size={40} className='text-blue-500' />
        },
        {
            title: "Apply Online",
            description: "Easily register for our courier services through a simple online application process, saving time and effort for all users.",
            icon: <FileText size={40} className='text-blue-500' />
        },
    ]

  return (
    <>
       {_caseDisplay.map((item, index) => (
        <div key={index}
           className='
             bg-white/20 backdrop-blur-md w-full max-w-[400px] h-70 shadow-md p-5 
             rounded-xl flex flex-col justify-center items-center gap-4 text-center
             transform transition duration-300 hover:scale-105 hover:shadow-xl
           '
        >
            <div 
              className="flex justify-center items-center border-3 border-blue-500/20 rounded-full p-4"
            >
                {item.icon}
            </div>
            <h3 className='text-gray-900 capitalize font-semibold text-2xl'>{item.title}</h3>
            <p>{item.description}</p>
        </div>
    ))}
    </>
  )
}

export default CaseDisplay;
