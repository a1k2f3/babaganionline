import React from "react";
import Link from "next/link";

const NavLinks: React.FC = () => {
  const links = [
    { name: "Home", href: "/" },
    { name: "order", href: "/orders" },
    { name: "About", href: "/static/about" },
    { name: "Help", href: "/support" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          {link.name}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
