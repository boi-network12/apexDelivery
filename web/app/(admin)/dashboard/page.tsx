"use client";

import { useAuth } from '@/context/AuthContext'
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  const { authState, fetchUser } = useAuth();

  useEffect(() => {
    if (!authState.user) {
      fetchUser();
    }
  },[authState.user, fetchUser])

  const shipmentType = [
    {
      name: "Prepaid"
    },
    {
      name: "In transit"
    },
    {
      name: "completed"
    },
  ]

  // state for active type
  const [activeType, setActiveType] = useState(shipmentType[0].name);
  const [sortOption, setSortOption] = useState("Newest");
  const [filterOption, setFilterOption] = useState("All");

  const renderHeaderDashboard = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-5 bg-white border-b border-gray-200">
      {/* Left: Title and Navigation */}
      <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
        <h1 className="font-bold text-lg md:text-xl text-gray-800 mb-3 md:mb-0 md:mr-4">Shipment</h1>
        <nav className="flex flex-row gap-2 md:gap-3 bg-gray-200 p-2 rounded-2xl w-full md:w-auto">
          {shipmentType.map((item, index) => {
            const isActive = activeType === item.name;
            return (
              <button
                key={index}
                onClick={() => setActiveType(item.name)}
                className={`flex-1 md:flex-none px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition 
                  ${isActive 
                    ? "bg-blue-500 text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-300"}`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: Filter + Sort */}
      <div className="flex flex-row items-center gap-2 md:gap-4 mt-3 md:mt-0 w-full md:w-auto">
        {/* Filter */}
        <select
          aria-label="filter"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="flex-1 md:flex-none border border-gray-300 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-0"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Sort */}
        <select
          aria-label="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="flex-1 md:flex-none border border-gray-300 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-0"
        >
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="A-Z">A → Z</option>
          <option value="Z-A">Z → A</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className='w-full'>
      {renderHeaderDashboard()}

      <div className='w-full'>
        <div className="">
          {/* product */}
        </div>
        <div className="">
          map
        </div>
      </div>
    </div>
  )
}

export default Dashboard
// app/(admin)/dashboard/page.tsx