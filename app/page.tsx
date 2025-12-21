'use client'
import CircularGallery from "./components/circular";
import SpotlightCard from "./components/spotlighCard";
import PillNav from "./components/navbar";
import Link from "next/link";

export default function Home() {
  const scrollToBenefits = () => {
    const element = document.getElementById("benefits-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <PillNav
        logo="/next.svg"
        logoAlt="Company Logo"
        items={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/courses" },
        ]}
        activeHref="/"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#000000"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
      />
      <div className="relative z-10 pointer-events-none">
        {/* Hero */}
        <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="pointer-events-auto">
            {" "}
            {/* Judul */}
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-linear-to-b from-white to-gray-400">
              EDUFLOW <br /> Learn With The Flow!
            </h1>
            {/* Tombol */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/login">
                <button className="cursor-pointer rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition hover:bg-gray-200">
                  Get Started
                </button>
              </Link>
              <button
                onClick={scrollToBenefits}
                className="cursor-pointer rounded-full border border-gray-700 bg-gray-900/50 px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800/80 hover:border-gray-600 backdrop-blur-xl"
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* 3 Benefit */}
        <section id="benefits-section" className="container mx-auto px-4 py-8 text-white pointer-events-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 w-full ">
            <SpotlightCard
              // --- STYLING CONTAINER KARTU ---
              className="custom-spotlight-card w-full rounded-[24px] border border-white/10 bg-[#0f0f11] p-8"
              // Mengubah warna spotlight menjadi putih transparan agar sesuai tema monokrom gelap
              spotlightColor="rgba(0, 229, 255, 0.2)"
            >
              <div className="relative z-10 flex h-full flex-col justify-start">
                {/* BAGIAN IKON */}
                <div className="mb-6 text-5xl select-none">✨</div>

                {/* BAGIAN JUDUL */}
                <h2 className="mb-3 text-3xl font-bold text-white leading-tight">
                  Flexible Access
                </h2>

                {/* BAGIAN DESKRIPSI */}
                <p className="text-base leading-relaxed text-zinc-400">
                  All lesson modules, videos, and assignments are neatly stored
                  so you can access them 24/7 from any device.
                </p>
              </div>
            </SpotlightCard>
            <SpotlightCard
              // --- STYLING CONTAINER KARTU ---
              className="custom-spotlight-card w-full rounded-[24px] border border-white/10 bg-[#0f0f11] p-8"
              // Mengubah warna spotlight menjadi putih transparan agar sesuai tema monokrom gelap
              spotlightColor="rgba(0, 229, 255, 0.2)"
            >
              <div className="relative z-10 flex h-full flex-col justify-start">
                {/* BAGIAN IKON */}
                <div className="mb-6 text-5xl select-none">👨‍🏫</div>

                {/* BAGIAN JUDUL */}
                <h2 className="mb-3 text-3xl font-bold text-white leading-tight">
                  Live Tutoring
                </h2>

                {/* BAGIAN DESKRIPSI */}
                <p className="text-base leading-relaxed text-zinc-400">
                  Get exclusive materials compiled by mentors, as well as
                  objective feedback on the assignments you submit.
                </p>
              </div>
            </SpotlightCard>
            <SpotlightCard
              // --- STYLING CONTAINER KARTU ---
              className="custom-spotlight-card w-full rounded-[24px] border border-white/10 bg-[#0f0f11] p-8"
              // Mengubah warna spotlight menjadi putih transparan agar sesuai tema monokrom gelap
              spotlightColor="rgba(0, 229, 255, 0.2)"
            >
              <div className="relative z-10 flex h-full flex-col justify-start">
                {/* BAGIAN IKON */}
                <div className="mb-6 text-5xl select-none">📈</div>

                {/* BAGIAN JUDUL */}
                <h2 className="mb-3 text-3xl font-bold text-white leading-tight">
                  Monitoring Progress
                </h2>

                {/* BAGIAN DESKRIPSI */}
                <p className="text-base leading-relaxed text-zinc-400">
                  View your completed assignment history, grades, and upcoming
                  material to keep your learning process on track.
                </p>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* Carousel Bahasa Pemrogaman */}
        <div style={{ height: "600px", position: "relative" }}>
          <CircularGallery
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.02}
          />
        </div>
      </div>
    </div>
  );
}
