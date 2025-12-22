import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eduflow",
  description: "Platform Pembelajaran Online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* PENTING: Hapus semua class di body agar tidak memaksa halaman lain jadi ungu/tengah */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}