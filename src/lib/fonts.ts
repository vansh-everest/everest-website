import { Inter, Noto_Sans_Devanagari, Noto_Sans_Telugu, Plus_Jakarta_Sans } from "next/font/google";

/**
 * Shared by every root layout. The site has one per locale group, so that a Hindi page can
 * declare lang="hi-IN" on the document rather than inheriting English.
 */

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-deva-src",
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const telugu = Noto_Sans_Telugu({
  variable: "--font-telu-src",
  subsets: ["telugu"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const FONT_VARS = `${inter.variable} ${jakarta.variable} ${devanagari.variable} ${telugu.variable}`;
