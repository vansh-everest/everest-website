import Link from "next/link";
import type { Locale } from "@/lib/i18n";

/** The line under every lead form: sending it means accepting the Privacy Policy, linked. */
const LINE: Record<Locale, { before: string; link: string; after: string }> = {
  en: { before: "By submitting, you agree to the ", link: "Privacy Policy", after: "." },
  hi: { before: "सबमिट करके आप ", link: "प्राइवेसी पॉलिसी", after: " से सहमत होते हैं।" },
  kn: { before: "ಸಲ್ಲಿಸುವ ಮೂಲಕ ನೀವು ", link: "ಗೌಪ್ಯತಾ ನೀತಿ", after: "ಗೆ ಒಪ್ಪುತ್ತೀರಿ." },
  te: { before: "సమర్పించడం ద్వారా మీరు ", link: "ప్రైవసీ పాలసీ", after: "కి అంగీకరిస్తున్నారు." },
  mr: { before: "सबमिट करून तुम्ही ", link: "प्रायव्हसी पॉलिसी", after: "ला संमती देता." },
  bn: { before: "জমা দিয়ে আপনি ", link: "প্রাইভেসি পলিসি", after: "-তে সম্মত হচ্ছেন।" },
  ta: { before: "சமர்ப்பிப்பதன் மூலம் நீங்கள் ", link: "தனியுரிமைக் கொள்கை", after: "யை ஏற்கிறீர்கள்." },
};

export function Consent({ locale = "en", tone = "light", className = "" }: { locale?: Locale; tone?: "light" | "dark"; className?: string }) {
  const line = LINE[locale] ?? LINE.en;
  return (
    <p className={`text-center text-xs leading-5 ${tone === "dark" ? "text-white/75" : "text-ink-soft"} ${className}`}>
      {line.before}
      <Link href="/privacy-policy/" className="underline underline-offset-2 hover:text-brand">
        {line.link}
      </Link>
      {line.after}
    </p>
  );
}
