import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

interface SocialLoginButtonProps {
  provider: "google" | "facebook";
  onClick?: () => void;
  title?: string;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, onClick,title }) => {
  const getStyles = () => {
    if (provider === "google") {
      return {
        bg: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100",
        icon: <FcGoogle size={20} />,
        label: title||"Login with Google",
      };
    }
    return {
      bg: "bg-blue-600 hover:bg-blue-700 text-white",
      icon: <FaFacebookF size={20} />,
      label: "Login with Facebook",
    };
  };

  const { bg, icon, label } = getStyles();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-all ${bg}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default SocialLoginButton;
