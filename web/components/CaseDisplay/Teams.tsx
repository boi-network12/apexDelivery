"use client";

import React from 'react'
import Image1 from "../../assets/img/team1.png";
import Image2 from "../../assets/img/team2.png"
import Image3 from "../../assets/img/team3.png"
import Image4 from "../../assets/img/team4.png"
import Image from 'next/image';

const Teams = () => {

    const _teamMembers = [
        {
            name: "John Dew",
            role: "Delivery Boy",
            img: Image1,
            counts: 543,
        },
        {
            name: "harry hardson",
            role: "Delivery Boy",
            img: Image2,
            counts: 658,
        },
        {
            name: "Dew Brisk",
            role: "Delivery Boy",
            img: Image3,
            counts: 150,
        },
        {
            name: "Liana Harris",
            role: "Sales Expert",
            img: Image4,
            counts: 6543,
        },
    ]

  return (
    <div className='px-[5%] md:px-[12%] lg:px-[16%] py-8'>
        <h2 className='text-xl md:text-3xl font-semibold'>Our Expert Team</h2>
        <p
          className='mt-4 text-sm md:text-base text-justify'
        >
            Our expert team is dedicated to providing exceptional service, combining industry knowledge and experience to ensure efficient and reliable courier solutions for every customer.
        </p>

        <div className='mt-5 w-full flex flex-wrap gap-6 lg:gap-10 justify-center'>
            {_teamMembers.map((member, index) => (
                <div key={index}
                   className='overflow-hidden border border-gray-300 w-full md:w-xs lg:w-2xs'
                >
                    <Image
                       src={member.img}
                       alt={member.name}
                       className='w-md h-auto bg-blue-950/50 object-cover'
                    />
                    <div className="w-full bg-white p-4 text-center">
                        <h4 className='capitalize font-semibold text-gray-800 md:text-xl'>{member.name}</h4>
                        <p className=' text-sm text-blue-500'>{member.role}</p>
                        <p className='text-sm text-gray-500'>complete Delivery: <span className='text-blue-500'>{member.counts}</span></p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Teams