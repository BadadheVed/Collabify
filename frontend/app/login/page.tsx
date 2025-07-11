"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

export const dynamic = "force-dynamic";

// Separate component that uses useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const returnUrlParam = searchParams.get("returnUrl");
    if (returnUrlParam) {
      setReturnUrl(decodeURIComponent(returnUrlParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setShowError(false);
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email: formData.email });
      console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        formData,
        {
          timeout: 10000, // 10 second timeout
          withCredentials: true, // Include cookies in request
        }
      );

      console.log("Login response:", res.data);

      if (res.data.success) {
        // Show success popup with message from backend
        //  setSuccessMessage(res.data.message || "Login successful!");
        setShowSuccess(true);

        // Navigate to return URL or dashboard after showing success message
        setTimeout(() => {
          setShowSuccess(false);
          console.log("Navigating to:", returnUrl || "/dashboard");
          if (returnUrl) {
            router.push(returnUrl);
          } else {
            router.push("/dashboard");
          }
        }, 2000);
      } else {
        setErrorMsg(res.data.message || "Login failed");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let msg = "Something went wrong during login";

      if (error.code === "ECONNABORTED") {
        msg = "Request timed out. Please try again.";
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error.message) {
        msg = error.message;
      }

      setErrorMsg(msg);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-sm w-full relative overflow-hidden shadow-2xl">
            {/* Success Content */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
            </div>

            {/* Animated Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-2xl overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 animate-progress-bar"
                style={{
                  animation: "progressBar 2s linear forwards",
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-in">
          {errorMsg}
        </div>
      )}

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-all duration-300 hover:scale-105 hover:translate-x-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div
            className="relative bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20"
            style={{
              transformStyle: "preserve-3d",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                Collabify
              </div>
              {returnUrl && (
                <div className="mb-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <p className="text-cyan-400 text-sm font-medium">
                    Sign in to continue with your team invitation
                  </p>
                </div>
              )}
              <h1 className="text-2xl font-bold text-white mb-2 hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-500 hover:bg-clip-text transition-all duration-300">
                Welcome Back
              </h1>
              <p className="text-gray-400 hover:text-gray-300 transition-colors duration-300">
                Sign in to your account to continue
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-cyan-400 transition-colors duration-300" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500 hover:border-gray-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-cyan-400 transition-colors duration-300" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500 hover:border-gray-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-gray-600 bg-gray-700 hover:border-cyan-500 transition-colors duration-300"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    Remember me
                  </span>
                </label>
                <Link
                  href="#"
                  className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-all duration-300"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-transparent text-white hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-transparent text-white hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-400 mt-8">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-all duration-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Loading component for Suspense fallback
function LoginLoading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Collabify
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
              <p className="text-gray-400">Please wait</p>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <Suspense fallback={<LoginLoading />}>
        <LoginForm />
      </Suspense>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes progressBar {
          0% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }

        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
