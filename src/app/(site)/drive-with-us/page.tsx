import type { Metadata } from "next";
import { DriverHub } from "@/components/driver/driver-pages";
import { getDictionary } from "@/content/dictionary";
import { getContent } from "@/lib/store";
import { DEFAULT_LOCALE, alternatesFor, canonical } from "@/lib/i18n";

const dict = getDictionary(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: dict.hub.metaTitle,
  description: dict.hub.metaDescription,
  alternates: { canonical: canonical(DEFAULT_LOCALE, "/drive-with-us"), languages: alternatesFor("/drive-with-us") },
};

export default async function Page() {
  return <DriverHub locale={DEFAULT_LOCALE} content={await getContent()} />;
}
