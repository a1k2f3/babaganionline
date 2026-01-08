"use client";

import React, { useEffect } from "react";
import Logo from "@/components/forms/logo";
import LoginForm from "@/components/forms/LoginForm";

const LoginPage: React.FC = () => {
  // Dynamically set the page title and description
  useEffect(() => {
    document.title = "Login | Baba Gani Online";

    // Optional: Update meta description if needed
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Log in to your Baba Gani Online account for secure access to your orders, wishlist, and personalized shopping. Fast, safe login for customers across Pakistan."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Log in to your Baba Gani Online account for secure access to your orders, wishlist, and personalized shopping. Fast, safe login for customers across Pakistan.";
      document.head.appendChild(meta);
    }
  }, []);

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