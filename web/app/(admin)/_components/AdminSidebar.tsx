"use client";

import { User } from '@/types/user';
import { LayoutGrid, LogOut, MapPin, Menu, PackagePlus, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { FC, JSX } from 'react'

interface AdminSidebarProps {
    logout: () => void;
    user: User | null;
    sidebarLinks: {
      name: string,
      routes: string;
      icon: string;
    }[],
}

const icons: Record<string, JSX.Element> = {
  LayoutGrid: <LayoutGrid />,
  MapPin: <MapPin />,
  PackagePlus: <PackagePlus />,
}

const AdminSidebar: FC<AdminSidebarProps> = ({ logout, user, sidebarLinks }) => {
  const pathname = usePathname();

  return (
    <div 
      className="flex flex-col relative border-r border-gray-200
                 w-16 md:w-64 transition-all duration-300"
    >
       {/* Top section */}
       <div className="flex flex-row justify-between items-center p-4 mb-2">
        {/* Show username only on md and up */}
        <h1 className="hidden md:block capitalize font-semibold text-xl text-gray-800">
          {user?.name}
        </h1>
        <Menu className="text-gray-700 cursor-pointer" />
       </div>

       {/* Search box (hidden on small screens) */}
       <div className="px-4 hidden md:block">
        <form 
          className="w-full flex flex-row justify-between p-2 rounded-2xl border border-gray-200"
        >
          {/*  */}
          <input 
             type="search" 
             aria-label="search"
             placeholder="search"
             className="w-[80%] outline-0 h-full"
          />
          <SearchIcon size={25} className="text-gray-800 cursor-pointer" />
        </form>
       </div>

       {/* Nav links */}
       <ul className="flex flex-col mt-5 gap-1 px-2">
          {sidebarLinks.map((item, index) => {
            const isActive = pathname === item.routes;

            return (
              <li key={index}>
                <Link
                  href={item.routes}
                  className={`capitalize w-full h-12 px-3 flex flex-row items-center gap-3 rounded-lg transition
                    ${isActive 
                      ? "bg-blue-500 text-white font-semibold shadow-md" 
                      : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {/* Icon always visible */}
                  <span className={`text-lg ${isActive ? "text-white" : "text-gray-500"}`}>
                    {icons[item.icon]}
                  </span>
                  
                  {/* Label hidden on mobile */}
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>

       {/* Bottom logout */}
       <div className="absolute bottom-0 w-full left-0 p-4">
        <div
          onClick={logout}
          className="bg-red-500/20 hover:bg-red-500/60 w-full flex flex-row items-center gap-2 text-red-700 font-medium px-3 py-2 rounded-lg cursor-pointer transition"
        >
          <LogOut size={20} /> 
          <span className="hidden md:inline">Logout</span>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar;
