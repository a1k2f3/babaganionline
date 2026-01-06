'use client';

import React from 'react';
import NavLogo from './NavbarLogo';
import NavLinks from './NavLinks';
import NavActions from './Navaction';
import MobileMenu from './MobileMenue';
import NavSearch from './NavSearch';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-white shadow-lg fixed top-0 left-0 z-50 border-b border-gray-100">
      {/* Desktop & Tablet Layout */}
      <div className="hidden md:flex max-w-7xl mx-auto h-16 items-center">
        {/* Full-width container to allow logo to stick to left edge */}
        <div className="absolute left-0 px-4 sm:px-6 lg:px-8">
          <NavLogo />
        </div>

        {/* Centered content: Search + Right side */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 ml-32 lg:ml-40">
          {/* Adjust ml-32/lg:ml-40 based on your logo width to prevent overlap */}
          <div className="flex-1 max-w-xl">
            <NavSearch />
          </div>
        </div>

        {/* Right side: Links + Actions */}
        <div className="absolute right-0 flex items-center gap-8 px-4 sm:px-6 lg:px-8">
          <NavLinks />
          <NavActions />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </nav>
  );
};

export default Navbar;