// components/GoogleLoginPrompt.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { X } from "lucide-react";

interface BackendResponse {
  message: string;
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const GoogleLoginPrompt = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSuccess = async (response: CredentialResponse) => {
    try {
      if (!response.credential) {
        throw new Error("No credential received from Google");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: response.credential }),
        }
      );

      const data: BackendResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Google login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("UserId", data.user.id);

      alert("Google Login Successful! 🎉");
      setIsModalOpen(false);
      setIsLoggedIn(true);
      router.refresh(); // Refresh server-rendered parts
    } catch (error: unknown) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleError = () => {
    alert("Google Login Failed. Please try again.");
  };

  if (isLoggedIn === true) return null;

  return (
    <>
      {/* Trigger Button */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sign in to unlock full features
        </h3>
        <p className="text-sm text-gray-600 mb-5">
          Login with Google to write reviews, save favorites, and get personalized recommendations and for book orders if ou arhesitate then chat on whatsapp.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-white border border-gray-300 hover:border-indigo-500 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3 hover:shadow"
        >
          <img
            src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Sign in with Google
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 flex flex-col items-center">
              <p className="text-center text-gray-600 mb-8">
                Sign in to continue and enjoy all features on our store.
              </p>

              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>

              <p className="text-xs text-gray-500 mt-8 text-center">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleLoginPrompt;