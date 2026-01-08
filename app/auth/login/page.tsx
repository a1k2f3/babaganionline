"use client";



import React from "react";
import Logo from "@/components/forms/logo";
import LoginForm from "@/components/forms/LoginForm";
export const metadata = {
  title: "Login | Baba Gani Online",
  description: "Log in to your Baba Gani Online account for secure access to your orders, wishlist, and personalized shopping. Fast, safe login for customers across Pakistan.",
};
const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <Logo title="Welcome back login" />
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;