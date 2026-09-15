"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "For Investors", href: "#" },
  { label: "Our Plans", href: "/own-now", menu: true },
  { label: "Our Services", href: "/our-services", menu: true },
  { label: "Everest Dost", href: "/#dost" },
  { label: "Blogs & Reports", href: "#" },
];

export function PageNavLinks() {
  const pathname = usePathname();
  return (
    <nav className="ml-[73px] hidden items-center gap-1.5 xl:flex">
      {LINKS.map((link) => {
        const active = link.href === pathname;
        return (
          <Link
            key={link.label}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-1 px-2.5 text-[17px] font-medium transition ${
              active ? "text-brand" : "text-navy hover:text-brand"
            }`}
          >
            {link.label}
            {link.menu && <ChevronDown size={16} strokeWidth={2.25} />}
          </Link>
        );
      })}
    </nav>
  );
}
