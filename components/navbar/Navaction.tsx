import Link from "next/link";
import React from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const NavActions: React.FC = () => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      {/* Cart */}
      <Link href="/shop/cart" passHref>  
      <button className="relative">
        <FaShoppingCart className="text-gray-700 hover:text-blue-600" size={18} />
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          2
        </span>
      </button>
</Link>
      {/* Login Button */}
<Link href="/profile" passHref>
      <button className=" text-black px-4 py-1.5 rounded-lg font-semibold text-sm flex items-center">
        <FaUser className="mr-2" size={14} /> 
      </button>
    </Link>
    </div>

  );
};

export default NavActions;
