"use client";

import React from "react";
import FloatingLines from "./floatingLines"; // Pastikan path import ini benar sesuai struktur folder Anda

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gray-950 text-white">
      
      {/* 1. BACKGROUND FLOATING LINES (Dipindahkan dari layout lama) */}
      <div className="absolute inset-0 z-0 opacity-60">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[10, 6, 10]}
          lineDistance={[8, 6, 4]}
          bendRadius={10.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          linesGradient={["#4f46e5", "#818cf8", "#c026d3", "#e879f9"]}
        />
      </div>

      {/* 2. BACKGROUND GRADIENT TAMBAHAN (Agar teks lebih terbaca) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/80 via-transparent to-purple-900/50 pointer-events-none" />

      {/* 3. KONTEN UTAMA (Login/Register Form) */}
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}