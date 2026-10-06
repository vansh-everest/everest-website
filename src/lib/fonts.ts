import {
  Inter,
  Noto_Sans_Bengali,
  Noto_Sans_Devanagari,
  Noto_Sans_Kannada,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Plus_Jakarta_Sans,
} from "next/font/google";

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

// Not preloaded: the files load only when a page sets text in that script, so the English
// pages do not pay for six Indic faces.
const kannada = Noto_Sans_Kannada({
  variable: "--font-knda-src",
  subsets: ["kannada"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: false,
});

const bengali = Noto_Sans_Bengali({
  variable: "--font-beng-src",
  subsets: ["bengali"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: false,
});

const tamil = Noto_Sans_Tamil({
  variable: "--font-taml-src",
  subsets: ["tamil"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: false,
});

export const FONT_VARS = [inter, jakarta, devanagari, telugu, kannada, bengali, tamil].map((f) => f.variable).join(" ");
