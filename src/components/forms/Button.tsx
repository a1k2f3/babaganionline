import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  label: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type = "button", label, onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all"
    >
      {label}
    </button>
  );
};

export default Button;
