"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import LogoutButton from "./logout";

type NavId =
  | "dashboard"
  | "manage-classes"
  | "manage-materials"
  | "manage-assignments"
  | "submissions";

type CardNavLink = {
  id: NavId;
  label: string;
};

type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export default function CardNav() {
  const router = useRouter();

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);


  const items: CardNavItem[] = [
    {
      label: "Dashboard",
      bgColor: "#F0FDF4",
      textColor: "#166534",
      links: [{ id: "dashboard", label: "Home" }],
    },
    {
      label: "Manajemen",
      bgColor: "#FFF7ED",
      textColor: "#9A3412",
      links: [
        { id: "manage-classes", label: "Manage Classes" },
        { id: "manage-materials", label: "Manage Materials" },
        { id: "manage-assignments", label: "Manage Assignments" },
        { id: "submissions", label: "Submissions" },
      ],
    },
  ];


  const routeMap: Record<NavId, string> = {
    dashboard: "/teacher/dashboard",
    "manage-classes": "/teacher/manage-classes",
    "manage-materials": "/teacher/manage-materials",
    "manage-assignments": "/teacher/manage-assignments",
    submissions: "/teacher/submissions",
  };


  const calculateHeight = () => {
    if (typeof window === "undefined") return 260;

    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return 260;

    const contentEl = navEl.querySelector(
      ".card-nav-content"
    ) as HTMLElement | null;

    if (!contentEl) return 260;

    return 60 + contentEl.scrollHeight + 16;
  };

  const createTimeline = () => {
    if (!navRef.current) return null;

    gsap.set(navRef.current, { height: 60, overflow: "hidden" });

    if (cardsRef.current.length) {
      gsap.set(cardsRef.current, { y: 40, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    tl.to(navRef.current, {
      height: calculateHeight,
      duration: 0.4,
      ease: "power3.out",
    });

    tl.to(
      cardsRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        stagger: 0.08,
        ease: "power3.out",
      },
      "-=0.15"
    );

    return tl;
  };

  useLayoutEffect(() => {
    tlRef.current = createTimeline();
    return () => tlRef.current?.kill();
  }, []);

  const toggleMenu = () => {
    if (!tlRef.current) return;

    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tlRef.current.play(0);
    } else {
      setIsHamburgerOpen(false);
      tlRef.current.reverse();
      tlRef.current.eventCallback("onReverseComplete", () =>
        setIsExpanded(false)
      );
    }
  };

  const navigate = (id: NavId) => {
    router.push(routeMap[id]);
    toggleMenu();
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };


  return (
    <div className="absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-[99] top-[1.5rem]">
      <nav
        ref={navRef}
        className="h-[60px] rounded-xl shadow-md relative overflow-hidden bg-white"
      >
        {/* TOP BAR */}
        <div className="absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-3 z-[2]">
          <div
            onClick={toggleMenu}
            className="flex flex-col gap-[6px] cursor-pointer"
          >
            <span
              className={`w-[30px] h-[2px] bg-black transition-transform ${
                isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`w-[30px] h-[2px] bg-black transition-transform ${
                isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </div>

          <h1 className="text-lg font-medium text-gray-700">Eduflow</h1>

          <LogoutButton />
        </div>

        {/* CONTENT */}
        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col md:flex-row gap-2 ${
            isExpanded
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none"
          }`}
        >
          {items.map((item, idx) => (
            <div
              key={item.label}
              ref={setCardRef(idx)}
              className="flex flex-col gap-2 p-4 rounded-lg flex-1"
              style={{
                backgroundColor: item.bgColor,
                color: item.textColor,
              }}
            >
              <div className="text-lg font-medium">{item.label}</div>

              <div className="mt-auto flex flex-col gap-1">
                {item.links.map((lnk) => (
                  <button
                    key={lnk.id}
                    onClick={() => navigate(lnk.id)}
                    className="flex items-center gap-2 text-left hover:opacity-75 hover:underline"
                  >
                    <GoArrowUpRight />
                    {lnk.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
