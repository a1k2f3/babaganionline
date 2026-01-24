"use client";

import React, { useState } from "react";
import InputField from "./InputField";
import Link from "next/link";
import Button from "./Button";
import GoogleLoginButton from "./Googleloginbutton";
// import SocialLoginButton from "./SocialLoginbutton";

const SignupForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      setError("All fields are required.");
      return;
    }
    if (!/^\d{11}$/.test(phone)) {
      setError("Phone must be an 11-digit Pakistani number (e.g. 03001234567).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const userData = { name, email, phone, password };

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

      const response = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed.");
      }

      setSuccess("Registration successful! Redirecting to login…");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error("Registration Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Status messages */}
      {success && (
        <div className="p-3 text-sm bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 text-sm bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <InputField
        id="name"
        label="Enter your Name"
        type="text"
        value={name}
        placeholder="Kamran Ali"
        onChange={(e) => setName(e.target.value)}
      />

      <InputField
        id="email"
        label="Email Address"
        type="email"
        value={email}
        placeholder="kamran@example.com"
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputField
        id="phone"
        label="Phone Number"
        type="tel"
        value={phone}
        placeholder="03001234567"
        onChange={(e) => setPhone(e.target.value)}
      />

      <InputField
        id="password"
        label="Password"
        type="password"
        value={password}
        placeholder="Enter your password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        label={isLoading ? "Signing up…" : "Signup"}
        // disabled={isLoading}
      />

      {/* Privacy Policy + Login link section */}
      <div className="text-center text-sm text-gray-600 mt-4 space-y-2">
        <p>
          By signing up, you agree to our{" "}
          <Link
            href="/static/privacy-policy"
            className="text-blue-600 hover:underline font-medium"
          >
            Privacy Policy
          </Link>
        </p>

        <p>
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
        <GoogleLoginButton/>
      </div>

      {/* Uncomment when you implement social auth */}
      {/* 
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">Or continue with</span>
        </div>
      </div>

      <SocialLoginButton
        provider="google"
        onClick={() => console.log("Google login")}
        title="Signup with Google"
      />
      <SocialLoginButton
        provider="facebook"
        onClick={() => console.log("Facebook login")}
        title="Signup with Facebook"
      /> */}
    </form>
  );
};

export default SignupForm;