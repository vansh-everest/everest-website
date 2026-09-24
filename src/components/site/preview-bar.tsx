"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PreviewBar() {
  const pathname = usePathname();
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex flex-wrap items-center justify-center gap-x-5 gap-y-1 bg-navy px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] text-[13px] font-bold text-white shadow-[0_-4px_20px_rgba(6,47,80,0.3)]">
      <span className="text-sun">Draft preview</span>
      <Link href="/admin/" className="underline underline-offset-2">
        Back to admin
      </Link>
      {/* A plain link: it goes through a route handler that clears the preview cookie. */}
      <a href={`/api/preview/exit/?path=${encodeURIComponent(pathname)}`} className="underline underline-offset-2">
        Exit preview
      </a>
    </div>
  );
}
