"use client";

export const dynamic = "force-dynamic";
// Remove this line completely:
// export const revalidate = 60;

import React from "react";
import Logo from "@/components/forms/logo";
import LoginForm from "@/components/forms/LoginForm";

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