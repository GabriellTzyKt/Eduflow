'use client';

import { Atom, Loader2, Eye, EyeOff } from "lucide-react"; // Import ikon tambahan
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  
  // State Input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State untuk lihat password

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
      // Mengirim data ke Route Handler (API)
      const response = await fetch("/api/login", { // Pastikan Anda punya file app/api/login/route.ts
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Berhasil: Arahkan ke dashboard/home
        router.push("/"); // Ubah sesuai halaman tujuan setelah login
        router.refresh();
      } else {
        // Gagal
        setError(data.message || "Gagal masuk. Periksa email atau password Anda.");
      }
    } catch (err) {
      console.error("Sign-in failed:", err);
      setError("Terjadi kesalahan koneksi. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
      
      {/* KARTU LOGIN */}
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/30 p-8 shadow-2xl backdrop-blur-md sm:p-10">
        
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mx-auto h-10 w-10 text-white flex items-center justify-center">
             <Atom className="w-full h-full" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        {/* Form Area */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Tambahkan onSubmit */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Menampilkan Error Pesan */}
            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-center">
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
                  name="email"
                  required
                  autoComplete="email"
                  // Binding State
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="block w-full rounded-lg border-0 bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 backdrop-blur-sm transition-all hover:bg-white/10 disabled:opacity-50"
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
              
              {/* Wrapper Relative untuk Icon Mata */}
              <div className="mt-2 relative">
                <input
                  id="password"
                  // Logika Show/Hide
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  // Binding State
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  // pr-10 agar teks tidak tertutup icon
                  className="block w-full rounded-lg border-0 bg-white/5 px-3 py-2 pr-10 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 backdrop-blur-sm transition-all hover:bg-white/10 disabled:opacity-50"
                />

                {/* Tombol Mata */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Sign In */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Register Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}