"use client";

import { Atom, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
// Import AuthLayout yang baru dibuat
import AuthLayout from "../components/authLayout"; 

export default function Register() {
  const router = useRouter();

  // State Form Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State untuk Show/Hide Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Semua kolom harus diisi.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/register", {
        email,
        password,
      });

      if (response.status === 200) {
        router.push("/login");
        router.refresh();
      } else {
        setError("Gagal mendaftar. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Sign-up failed:", err);
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/30 p-8 shadow-2xl backdrop-blur-md sm:p-10">
          {/* Header */}
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="mx-auto h-10 w-10 text-white flex items-center justify-center">
              <Atom className="w-full h-full" />
            </div>
            <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
              Create an account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-center">
                  {error}
                </div>
              )}

              {/* Input Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Your email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="block w-full rounded-lg border-0 bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 backdrop-blur-sm transition-all hover:bg-white/10 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="block w-full rounded-lg border-0 bg-white/5 px-3 py-2 pr-10 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 backdrop-blur-sm transition-all hover:bg-white/10 disabled:opacity-50"
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

              {/* Input Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-200">
                  Confirm password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm-password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="block w-full rounded-lg border-0 bg-white/5 px-3 py-2 pr-10 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 backdrop-blur-sm transition-all hover:bg-white/10 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-300">
                    I accept the{" "}
                    <a href="#" className="font-medium text-indigo-400 hover:underline hover:text-indigo-300">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>

              {/* Tombol Register */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    "Create an account"
                  )}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}