"use client"

import React from 'react'
import truck from "../../assets/img/dangote.png";
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../UI/accordion';

const ExploreSection = () => {

    const _accordionData = [
        {
            title: "What areas do you deliver to?",
            desc: "We deliver locally, nationally, and internationally, providing flexible shipping solutions to meet your specific needs, no matter the destination."
        },
        {
            title: "How can i track my shipment?",
            desc: "Contact our customer support team immediately. We&apos;ll assist you in locating your package and resolving the issue promptly."
        },
        {
            title: "Are there any restrictions to what I can send?",
            desc: "Yes, certain items are prohibited for shipping, including hazardous materials and perishable goods. Check our guidelines for more details."
        },
    ]

  return (
    <div className='px-[5%] md:px-[12%] lg:px-[16%] py-12'>
        <h2 className='text-xl md:text-3xl font-semibold'>Explore Our Services and Solutions</h2>
        <p
          className='mt-4 text-sm md:text-base text-justify'
        >
            Get answers to common questions about our courier services, ensuring a seamless experience and complete understanding of our offerings.
        </p>

        <div className="lg:flex lg:flex-row lg:items-start mt-3 gap-10 md:mt-10 justify-between">
            <div className="flex flex-col gap-6 mt-3 md:mt-5">
                {_accordionData.map((item, index) => (
                    <Accordion type="single" collapsible key={index}>
                    <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger>{item.title}</AccordionTrigger>
                        <AccordionContent>{item.desc}</AccordionContent>
                    </AccordionItem>
                    </Accordion>
                ))}
            </div>
            <Image
               src={truck}
               alt="Truck"
               className="mt-8 w-full lg:max-w-lg md:max-w-xl h-auto"
            />
        </div>
    </div>
  )
}

export default ExploreSection