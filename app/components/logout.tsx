"use client";
import { useState, useEffect } from "react"; 
import { createBrowserClient } from "@supabase/ssr"; 
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
export default function LogoutButton() {
const router = useRouter();

  // --- LOGIKA AUTHENTICATION (TETAP SAMA) ---
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); 
    router.refresh();
  };

  const scrollToBenefits = () => {
    const element = document.getElementById("benefits-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 shadow-sm"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {loading ? "Keluar..." : "Sign Out"}
    </button>
  );
}