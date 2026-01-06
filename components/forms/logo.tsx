import Image from "next/image";
import React from "react";

interface LogoProps {
  title: string;
}

const Logo: React.FC<LogoProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      
      <Image 
        src="/logo2.jpg" 
        alt="Logo" 
        width={100} 
        height={100}
        className="my-2 rounded-full" // optional: adds a bit of spacing around the image
      />
      <p className="text-gray-500">{title}.</p>
    </div>
  );
};

export default Logo;