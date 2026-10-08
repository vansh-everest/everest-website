"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The header bar, which turns into Argo's floating glass pill once it sticks to the top.
 *
 * The outer band keeps its height in both states, so the page never jumps when it changes.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const check = () => {
      const top = ref.current?.getBoundingClientRect().top ?? 1;
      setStuck(window.scrollY > 0 && top <= 0);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <header
      ref={ref}
      data-stuck={stuck || undefined}
      className={`sticky top-0 z-50 h-[60px] border-b-4 transition-colors duration-500 md:h-[68px] lg:h-[80px] ${
        stuck ? "border-transparent bg-transparent" : "border-sun bg-white"
      }`}
    >
      <div
        className={`fx-header-in relative mx-auto flex items-center justify-between gap-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          stuck
            ? "mt-2 h-12 w-[calc(100%-1.5rem)] max-w-[1180px] rounded-full border border-white/70 bg-white/95 px-3 shadow-[0_18px_44px_-20px_rgba(6,47,80,0.5)] pointer-fine:bg-white/75 pointer-fine:backdrop-blur-md pointer-fine:backdrop-saturate-150 md:h-[52px] md:w-[calc(100%-3rem)] md:px-5 lg:h-[60px] lg:px-6"
            : "h-14 w-full max-w-[1440px] rounded-none border border-transparent px-4 md:h-16 md:px-6 lg:h-[76px] lg:px-12"
        }`}
      >
        {/* The specular edge along the top of the glass. */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent transition-opacity duration-700 ${
            stuck ? "opacity-100" : "opacity-0"
          }`}
        />
        {children}
      </div>
    </header>
  );
}
