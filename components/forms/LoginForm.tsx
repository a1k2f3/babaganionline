"use client";
import React, { useState } from "react";
import InputField from "./InputField";
import Link from "next/link";
import Button from "./Button";
import GoogleLoginButton from "./Googleloginbutton";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      setSuccess("Login successful! Welcome.");
      localStorage.setItem("token", result.token);
      localStorage.setItem("UserId", JSON.stringify(result.user.id));

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Alerts */}
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
        id="email"
        label="Email Address"
        type="email"
        value={email}
        placeholder="kamran@example.com"
        onChange={(e) => setEmail(e.target.value)}
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
        label={isLoading ? "Logging In..." : "Login"}
      />

      {/* OR divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* 🔥 Google Login Button */}
      <GoogleLoginButton />

      <p className="text-center text-sm text-gray-600 mt-5">
        Don’t have an account?{" "}
        <Link
          href="/auth/rigester"
          className="text-blue-600 hover:underline font-medium"
        >
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
