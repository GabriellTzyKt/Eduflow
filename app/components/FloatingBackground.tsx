"use client";

import { useEffect, useRef } from "react";

export default function FloatingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    // --- KONFIGURASI TAMPILAN (YANG DIUBAH) ---
    const particleCount = 70;      // Diperbanyak agar lebih ramai (tadi 60)
    const connectionDistance = 160; // Jarak koneksi diperjauh
    const mouseDistance = 200;

    // Warna: Lebih gelap dan opacity lebih tinggi agar terlihat jelas
    // Indigo-600 dengan opacity 0.7 (70% terlihat)
    const particleColor = "rgba(79, 70, 229, 0.7)"; 
    // Indigo-400 dengan opacity 0.35 (Tadi cuma 0.2, sekarang lebih tebal)
    const lineColor = "rgba(129, 140, 248, 0.35)";  

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const mouse = { x: -1000, y: -1000 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        // Kecepatan sedikit ditambah agar pergerakan lebih dinamis
        this.vx = (Math.random() - 0.5) * 1.5; 
        this.vy = (Math.random() - 0.5) * 1.5; 
        // Ukuran titik diperbesar sedikit (2 s/d 4px)
        this.size = Math.random() * 2 + 2; 
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            if (distance < mouseDistance) {
                this.x -= forceDirectionX * force * 1; 
                this.y -= forceDirectionY * force * 1;
            }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = particle.x - p2.x;
          const dy = particle.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            // Ketebalan garis ditambah (tadi 1)
            ctx.lineWidth = 1.5; 
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // Ubah bg-gray-50 jadi putih solid agar kontras garis lebih tajam
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-white"
    />
  );
}