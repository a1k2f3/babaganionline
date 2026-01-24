"use client";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import React from "react";

interface BackendResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const GoogleLoginButton: React.FC = () => {
    const router = useRouter();
  const handleSuccess = async (
    response: CredentialResponse
  ): Promise<void> => {
    try {
      if (!response.credential) {
        throw new Error("No credential received from Google");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: response.credential,
          }),
        }
      );

      const data: BackendResponse = await res.json();

      if (!res.ok) {
        throw new Error("Google login failed");
      }

      // Store JWT
      localStorage.setItem("token", data.token);
        localStorage.setItem("UserId", JSON.stringify(data.user.id));
router.push("/");
      console.log("Logged in user:", data.user);
      alert("Google Login Successful");

    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  const handleError = (): void => {
    alert("Google Login Failed");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
      />
    </div>
  );
};

export default GoogleLoginButton;
