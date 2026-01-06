"use client";
import React from "react";
import NavLogo from "./NavbarLogo";
// import NavLinks from "./NavLinks";
import NavActions from "./Navaction";
import NavSearch from "./NavSearch";
import BottomNavbar from "./BttomNavbar";

const MobileMenu: React.FC = () => {
  return (
    <div className="md:hidden w-full bg-white text-gray-800 z-50 flex flex-col ">
      {/* 🔹 Top Bar — Logo + Seaarch + Login */}
      <div className="w-full bg-white px-4 py-3 border-b shadow-sm flex items-center justify-between sticky top-0 left-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <NavLogo />
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-3">
          <NavSearch />
        </div>

        {/* Login / Profile */}
        <div className="flex-shrink-0">
          <NavActions />
        </div>
      </div>

      {/* 🔹 Middle Nav Links */}
    

      {/* 🔹 Main content padding space */}
      <div className="flex-grow"></div>

      {/* 🔹 Bottom Bar — Cart + Shortcuts */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md">
    <BottomNavbar/>
      </div>

      {/* Padding to prevent bottom overlap */}
      <div className="pb-16"></div>
    </div>
  );
};

export default MobileMenu;
