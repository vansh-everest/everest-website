"use client";

import { PICK_SERVICE_EVENT, type Service } from "./services";

/** Jumps to the enquiry form with this service already chosen. Without JavaScript it still jumps. */
export function GetStarted({ service, className = "" }: { service: Service["slug"]; className?: string }) {
  return (
    <a
      href="#enquiry"
      onClick={() => window.dispatchEvent(new CustomEvent(PICK_SERVICE_EVENT, { detail: service }))}
      className={`flex h-12 items-center justify-center rounded-full bg-sun text-lg font-medium text-navy transition hover:brightness-95 lg:h-14 lg:text-[22px] lg:tracking-[0.2px] ${className}`}
    >
      Get Started
    </a>
  );
}
