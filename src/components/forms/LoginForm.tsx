"use client";
import React, { useState } from "react";
import InputField from "./InputField";
import Link from "next/link";
import Button from "./Button";
import SocialLoginButton from "./SocialLoginbutton";
// import { Router } from "next/router";
import { useRouter } from "next/navigation";
const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
const router =useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        // Data payload matching the required body structure (email and password)
        const loginData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login`, {
                method: "POST",
                headers: {
                    // Standard header for sending JSON data
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(loginData),
            });

            // Always attempt to parse the response body
            const result = await response.json(); 

            if (!response.ok) {
                // Throw an error using the message from the backend if available
                throw new Error(result.message || "Login failed. Invalid credentials.");
            }

            // Success handling (e.g., storing the token and user info)
            // Assuming the backend returns user data/token in the 'result' object
            setSuccess("Login successful! Welcome.");
            localStorage.setItem("token", result.token);
            localStorage.setItem("UserId", JSON.stringify(result.user.id));
            // Redirect to home page after successful login  
            router.push('/');
            
            // Redirect to dashboard or desired page
            
            // TODO: In a real app, you would store the received token (result.token) 
            // in a cookie or local storage and redirect the user here.
            // Example: router.push('/dashboard'); 

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            console.error("Login Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display status messages */}
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
                // disabled={isLoading} 
            />

            <p className="text-center text-sm text-gray-600 mt-5">
                Don’t have an account?{" "}
                {/* FIX: Changed 'rigester' to 'register' */}
                <Link href="/auth/rigester" className="text-blue-600 hover:underline font-medium">
                    Register
                </Link>
            </p>
            <SocialLoginButton provider="google" onClick={() => console.log("Google login")} title="Login with Google"  />
            <SocialLoginButton provider="facebook" onClick={() => console.log("Facebook login")} title="Login with Facebook" />
        </form>
    );
};

export default LoginForm;