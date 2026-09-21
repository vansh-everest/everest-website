import type { Metadata } from "next";
import { FONT_VARS } from "@/lib/fonts";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** The admin renders without the public site chrome. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${FONT_VARS} antialiased`}>
      <body className="min-h-screen bg-mist font-sans">{children}</body>
    </html>
  );
}
