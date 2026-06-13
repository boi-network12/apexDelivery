"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authState, fetchUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authState.user) {
      fetchUser();
    }
    if (!authState.isAuthenticated) {
      router.push("/auth");
    }
  }, [authState.user, authState.isAuthenticated, fetchUser, router]);

  const _sidebarLinks = [
    {
        name: "dashboard",
        routes: "/dashboard",
        icon: "LayoutGrid"
    },
    {
        name: "Packages",
        routes: "/packages",
        icon: "MapPin"
    },
    {
        name: "Add Package",
        routes: "/add",
        icon: "PackagePlus"
    },
    ];

    // find current page name
  const currentPage =
    _sidebarLinks.find((link) => link.routes === pathname)?.name || "";

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar 
         logout={logout}
         user={authState.user}
         sidebarLinks={_sidebarLinks}
      />

      {/* Main content */}
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        {/* Topbar */}
        <AdminHeader
           pageTitle={currentPage}
        />

        {/* Page content */}
        {children}
      </main>
    </div>
  );
}
