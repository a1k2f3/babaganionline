// components/ui/BottomNavbar.tsx  (or wherever you keep it)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Next.js 13+ App Router
import { FaHome, FaShoppingBag, FaShoppingCart, FaUserAlt } from "react-icons/fa";

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: FaHome, href: "/" },
    { name: "orders", icon: FaShoppingBag, href: "/orders" },
    { name: "Cart", icon: FaShoppingCart, href: "/shop/cart", badge: 3 },
    { name: "Account", icon: FaUserAlt, href: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="flex justify-around items-center py-3 px-4 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 transition-all duration-300 ${
                isActive
                  ? "text-indigo-600 scale-110"
                  : "text-gray-500 hover:text-indigo-500"
              }`}
            >
              <div className="relative">
                <Icon size={24} />
                {/* Badge */}
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-xs font-medium mt-1 transition-all ${
                  isActive ? "opacity-100" : "opacity-80"
                }`}
              >
                {item.name}
              </span>

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-indigo-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}