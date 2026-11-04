import type { Metadata } from "next";
import type { QA } from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { cityPath } from "./city-route";
import type { Hub } from "./content";
import { canonical } from "./i18n";
import { listNames } from "./seo-data";

/**
 * Shared pieces of the Hindi search pages under /hi. Each one exists in English and Hindi only,
 * so its alternates name the two pages rather than every locale the driver pages run in.
 */

/** The only locale these pages are published in besides English. */
export const isHindi = (locale: string): locale is "hi" => locale === "hi";

/** "/car-on-rent-for-uber/pune" → "/hi/car-on-rent-for-uber/pune/". */
export const hiPath = (path: string) => canonical("hi", path);

/** The English page's hreflang pair, for its own metadata. */
export function pairLanguages(englishPath: string): Record<string, string> {
  const en = canonical("en", englishPath);
  return { "en-IN": en, "hi-IN": canonical("hi", englishPath), "x-default": en };
}

/** The Hindi page's canonical and its hreflang pair. */
export function hiAlternates(englishPath: string): Metadata["alternates"] {
  return { canonical: hiPath(englishPath), languages: pairLanguages(englishPath) };
}

/** /hi/drive-with-us/driver-job-in-<city>/: the Hindi driver page for a city. */
export const hiCityPath = (slug: string) => hiPath(cityPath(slug));

export const HI_DRIVE_PATH = hiPath("/drive-with-us");

/** The hub page's crumb, named as its heading reads, without the dictionary's first person. */
export const HI_DRIVE_CRUMB = { name: "ड्राइवर की नौकरी", path: HI_DRIVE_PATH };

/** Labels repeated across the Hindi search pages. */
export const HI = {
  inShort: "संक्षेप में",
  allCities: "सभी शहर",
  keepReading: "आगे पढ़िए",
  cities: "शहर",
  hubs: "हब",
  models: "मॉडल",
  car: "गाड़ी",
  eachCar: "हर गाड़ी और उसके प्लान",
  pickCity: "अपना शहर चुनिए",
  startInCity: "अपने शहर में शुरू कीजिए",
  carIncluded: "गाड़ी शामिल",
  numberAndHubs: "नंबर और हब",
  carsAndPlans: "गाड़ियाँ और प्लान",
  fleetInCity: "शहर में Everest Fleet",
  docsAndLicence: "कागज़ात और लाइसेंस",
  requirements: "Uber ड्राइवर की शर्तें",
  everestAcrossIndia: "पूरे भारत में Everest Fleet",
};

/** "12 हब", "5 मॉडल": a card's note. */
export const hubCount = (n: number) => `${n} ${HI.hubs}`;

/** Beside the mid-page form on every Hindi search page. */
export const APPLY_POINTS_HI = [
  "गाड़ी, बीमा और परमिट शामिल",
  "हर हफ़्ते पेमेंट, सीधे बैंक खाते में",
  "Drive To Own या Own Now में अवधि पूरी होने पर गाड़ी आपकी",
];

/** "आधार कार्ड, पैन कार्ड, ड्राइविंग लाइसेंस और पते का प्रमाण". */
export const hiDocuments = () => listNames(getDictionary("hi").documents, "और");

/** A hub's hours, "9 am to 7 pm, हर दिन" when they hold all week. */
export const hiHubHours = (hub: Hub) => (hub.hours ? (hub.daily ? `${hub.hours}, ${getDictionary("hi").city.everyDay}` : hub.hours) : "");

/**
 * The driver questions every search page ends with: the dictionary's Hindi FAQ, worded about
 * Everest Fleet in the third person as the English search pages are. Each carries its English
 * question so a Hindi page drops the same ones its English twin filters out of dict.faq.
 */
const DRIVER_FAQ: (QA & { en: string })[] = [
  { en: "Do I Need My Own Car?", q: "क्या अपनी गाड़ी चाहिए?", a: "नहीं। गाड़ी Everest Fleet देता है। आप अपना लाइसेंस और कागज़ लाइए।" },
  { en: "When Am I Paid?", q: "पेमेंट कब मिलती है?", a: "हर हफ़्ते, सीधे आपके बैंक खाते में।" },
  { en: "Who Pays For Fuel?", q: "ईंधन का खर्च कौन उठाता है?", a: "ईंधन या चार्जिंग का खर्च ड्राइवर का होता है। बीमा और मेंटेनेंस Everest Fleet का।" },
  { en: "Can I Own The Car?", q: "क्या गाड़ी मेरी हो सकती है?", a: "हाँ। Own Now और Drive To Own प्लान में अवधि पूरी होने पर गाड़ी आपके नाम हो जाती है।" },
];

export function hiFaq(keep: (englishQuestion: string) => boolean = () => true): QA[] {
  return DRIVER_FAQ.filter((item) => keep(item.en)).map(({ q, a }) => ({ q, a }));
}

/** A structured-data block marked as Hindi. */
export const inHindi = <T extends object>(block: T) => ({ ...block, inLanguage: "hi-IN" });
