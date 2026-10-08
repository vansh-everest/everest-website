"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { siteCopy } from "@/content/site-copy";
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  MAIN_LOCALES,
  basePath,
  existsIn,
  localeOfPath,
  localePath,
  type Locale,
  type MainLocale,
} from "@/lib/i18n";

/** The slugs of the blog posts published in each language: a post opens in another language only when it exists there. */
export type PostSlugs = Partial<Record<Locale, string[]>>;

const Posts = createContext<PostSlugs>({});

export function LocalePosts({ posts, children }: { posts: PostSlugs; children: ReactNode }) {
  return <Posts.Provider value={posts}>{children}</Posts.Provider>;
}

/** Each language in its own script, then in English for anyone who cannot read that script. */
const NAMES: Record<Locale, { native: string; english: string }> = {
  en: { native: "English", english: "English" },
  hi: { native: "हिंदी", english: "Hindi" },
  mr: { native: "मराठी", english: "Marathi" },
  kn: { native: "ಕನ್ನಡ", english: "Kannada" },
  te: { native: "తెలుగు", english: "Telugu" },
  bn: { native: "বাংলা", english: "Bengali" },
  ta: { native: "தமிழ்", english: "Tamil" },
};

/**
 * Where picking a language goes: this page in that language when it is published there, otherwise
 * that language's home page.
 */
function target(locale: MainLocale, path: string, posts: PostSlugs): string {
  const post = /^\/blog\/([^/]+)$/.exec(path);
  const there = post ? (posts[locale] ?? []).includes(post[1]) : existsIn(locale, path);
  return localePath(locale, there ? path : "/");
}

function useLocaleTarget() {
  const pathname = usePathname();
  const posts = useContext(Posts);
  const path = basePath(pathname);
  return { current: localeOfPath(pathname), href: (locale: MainLocale) => target(locale, path, posts) };
}

function Option({ locale, current, href, cell }: { locale: MainLocale; current: Locale; href: string; cell: string }) {
  const on = locale === current;
  return (
    <li>
      <Link
        href={href}
        hrefLang={LOCALE_META[locale].htmlLang}
        lang={LOCALE_META[locale].htmlLang}
        aria-current={on ? "true" : undefined}
        className={`flex items-center justify-between gap-3 transition ${cell} ${on ? "bg-[#e8f1fa]" : "hover:bg-mist"}`}
      >
        <span className="flex flex-col">
          <span className={`${LOCALE_META[locale].fontVar} text-lg font-bold leading-6 ${on ? "text-brand" : "text-navy"}`}>
            {NAMES[locale].native}
          </span>
          <span className={`text-sm leading-5 ${on ? "text-brand/80" : "text-ink-soft"}`}>{NAMES[locale].english}</span>
        </span>
        {on ? <Check size={20} strokeWidth={2.5} aria-hidden className="shrink-0 text-brand" /> : null}
      </Link>
    </li>
  );
}

/** The pill in the top bar: a two-column card on a wide screen, a titled list on a phone. */
export function LocaleSwitch() {
  const { current, href } = useLocaleTarget();
  const { title, titleLocal } = siteCopy(current).language;
  // Under the heading, the same words in a second language: Hindi under English, English under the others.
  const second: Locale = current === "hi" || current === "kn" ? DEFAULT_LOCALE : "hi";
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function away(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Language: ${NAMES[current].english}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[33px] items-center gap-2 rounded-full border border-white/30 bg-white/[0.08] pl-3.5 pr-[13px] text-sm font-bold leading-none text-white transition hover:border-white/50 hover:bg-white/[0.14]"
      >
        <Globe size={14} aria-hidden />
        <span className="uppercase">{current}</span>
        <ChevronDown size={12} aria-hidden className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="fixed right-0 top-11 z-50 w-[calc(100%-40px)] max-w-[372px] overflow-hidden rounded-l-[20px] bg-white shadow-[0_16px_40px_rgba(6,47,80,0.28)] md:absolute md:top-full md:mt-2 md:w-[320px] md:max-w-none md:rounded-[20px] md:border md:border-[#dfe5ee] md:p-[15px]">
          <div className="border-b border-line px-4 pb-3 pt-[18px] md:hidden">
            <p className="text-[17px] font-bold leading-6 text-navy">{title}</p>
            <p lang={LOCALE_META[second].htmlLang} className={`${LOCALE_META[second].fontVar} text-[13px] leading-5 text-ink-soft`}>
              {titleLocal}
            </p>
          </div>
          <ul className="py-2 md:grid md:grid-cols-2 md:gap-x-2 md:gap-y-[5px] md:py-0">
            {MAIN_LOCALES.map((l) => (
              <Option
                key={l}
                locale={l}
                current={current}
                href={href(l)}
                cell="ml-0 h-[75px] rounded-l-xl px-4 md:h-[60px] md:rounded-xl md:px-[14px]"
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** The language row at the foot of the phone menu. The list opens in place, inside the menu. */
export function LocaleRow() {
  const { current, href } = useLocaleTarget();
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[52px] w-full items-center gap-3 px-4 text-[15px] font-bold text-navy"
      >
        <Globe size={18} aria-hidden />
        {NAMES[current].native}
        <ChevronDown size={16} aria-hidden className={`ml-auto text-ink-soft transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul className="pb-2">
          {MAIN_LOCALES.map((l) => (
            <Option key={l} locale={l} current={current} href={href(l)} cell="h-[64px] px-4" />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
