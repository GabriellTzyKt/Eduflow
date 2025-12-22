"use client";

import { Atom, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "../components/authLayout"; // Fixed import path

export default function Login() {
  const router = useRouter();

  // State Input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validasi dasar
    if (!email || !password) {
      setError("Email dan password harus diisi.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const role = data.role;
        // Refresh router agar middleware update cookie
        router.refresh(); 
        
        if (role === "murid") {
          router.push("/student/dashboard");
        } else if (role === "guru") {
          router.push("/teacher/dashboard");
        }
      } else {
        setError(data.message || "Gagal masuk. Periksa email atau password Anda.");
      }
    } catch (err) {
      console.error("Sign-in failed:", err);
      setError("Terjadi kesalahan koneksi. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  // BUNGKUS DENGAN AUTH LAYOUT
  return (
    <AuthLayout>
      {/* KARTU LOGIN */}
      <div className="w-full rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mx-auto h-12 w-12 text-white flex items-center justify-center bg-white/10 rounded-full mb-4">
            <Atom className="w-8 h-8" />
          </div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-white">
            Welcome Back
          </h2>
          <p className="text-center text-gray-400 text-sm mt-1">
            Sign in to continue to Eduflow
          </p>
        </div>

        {/* Form Area */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200 border border-red-500/30 text-center animate-pulse">
                {error}
              </div>
            )}

            {/* Input Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="block w-full rounded-lg border-0 bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 backdrop-blur-sm transition-all hover:bg-white/10 disabled:opacity-50"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="mt-2 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="block w-full rounded-lg border-0 bg-white/5 px-3 py-2.5 pr-10 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 backdrop-blur-sm transition-all hover:bg-white/10 disabled:opacity-50"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Tombol Sign In */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          {/* Footer Register */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
            >
              Register Here
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}