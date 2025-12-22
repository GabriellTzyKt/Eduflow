"use client";
import CircularGallery from "./components/circular";
import SpotlightCard from "./components/spotlighCard";
import PillNav from "./components/navbar";
import Link from "next/link";
import { useState, useEffect } from "react"; 
import { createBrowserClient } from "@supabase/ssr"; 
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
// Pastikan import FloatingLines ada (sesuaikan path jika berbeda)
import FloatingLines from "./components/floatingLines"; 

export default function Home() {
  const router = useRouter();

  // --- LOGIKA AUTHENTICATION (TETAP SAMA) ---
  const [user, setUser] = useState<User | null>(null);

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

  const navItems = [
    { label: "Home", href: "/" },
    ...(user
      ? [
          { label: "Courses", href: "/student/dashboard" },
          { label: "Sign Out", href: "#", onClick: handleLogout },
        ]
      : []),
    ...(!user ? [{ label: "Login", href: "/login" }] : []),
  ];

  return (
    // 1. CONTAINER UTAMA: Ubah jadi background gelap/ungu & relative
    <div className="relative min-h-screen w-full bg-gray-900 text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* 2. BACKGROUND LAYER (Floating Lines & Gradient) - Posisi fixed di belakang */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Gradient Ungu Gelap */}
         <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-950 opacity-100" />
         
         {/* Komponen Garis */}
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
          
          {/* Overlay Transparan agar teks lebih terbaca */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/20 to-gray-950/80" />
      </div>

      {/* 3. CONTENT LAYER: Tambahkan relative z-10 agar di atas background */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        <PillNav
          logo="/next.svg"
          logoAlt="Company Logo"
          items={navItems}
          activeHref="/"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />

        <div className="relative z-10 pointer-events-none w-full">
          {/* Hero */}
          <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <div className="pointer-events-auto">
              {" "}
              {/* Judul */}
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-lg">
                EDUFLOW <br /> Learn With The Flow!
              </h1>
              {/* Tombol */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/login">
                  <button className="cursor-pointer rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30">
                    Get Started
                  </button>
                </Link>
                <button
                  onClick={scrollToBenefits}
                  className="cursor-pointer rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10 backdrop-blur-xl"
                >
                  Learn More
                </button>
              </div>
            </div>
          </section>

          {/* 3 Benefit */}
          <section
            id="benefits-section"
            className="container mx-auto px-4 py-8 text-white pointer-events-auto"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 w-full ">
              <SpotlightCard
                className="custom-spotlight-card w-full rounded-[24px] border border-white/10 bg-black/40 p-8 backdrop-blur-md"
                spotlightColor="rgba(139, 92, 246, 0.3)" // Ungu muda
              >
                <div className="relative z-10 flex h-full flex-col justify-start">
                  <div className="mb-6 text-5xl select-none">✨</div>
                  <h2 className="mb-3 text-3xl font-bold text-white leading-tight">
                    Flexible Access
                  </h2>
                  <p className="text-base leading-relaxed text-zinc-300">
                    All lesson modules, videos, and assignments are neatly stored
                    so you can access them 24/7 from any device.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard
                className="custom-spotlight-card w-full rounded-[24px] border border-white/10 bg-black/40 p-8 backdrop-blur-md"
                spotlightColor="rgba(139, 92, 246, 0.3)"
              >
                <div className="relative z-10 flex h-full flex-col justify-start">
                  <div className="mb-6 text-5xl select-none">👨‍🏫</div>
                  <h2 className="mb-3 text-3xl font-bold text-white leading-tight">
                    Live Tutoring
                  </h2>
                  <p className="text-base leading-relaxed text-zinc-300">
                    Get exclusive materials compiled by mentors, as well as
                    objective feedback on the assignments you submit.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard
                className="custom-spotlight-card w-full rounded-[24px] border border-white/10 bg-black/40 p-8 backdrop-blur-md"
                spotlightColor="rgba(139, 92, 246, 0.3)"
              >
                <div className="relative z-10 flex h-full flex-col justify-start">
                  <div className="mb-6 text-5xl select-none">📈</div>
                  <h2 className="mb-3 text-3xl font-bold text-white leading-tight">
                    Monitoring Progress
                  </h2>
                  <p className="text-base leading-relaxed text-zinc-300">
                    View your completed assignment history, grades, and upcoming
                    material to keep your learning process on track.
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </section>

          {/* Carousel Bahasa Pemrogaman */}
          <div style={{ height: "600px", position: "relative" }} className="pointer-events-auto">
            <CircularGallery
              bend={3}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={0.02}
            />
          </div>
        </div>
      </div>
    </div>
  );
}