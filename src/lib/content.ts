import type { Locale } from "@/lib/i18n";

/**
 * Everything on the driver pages and the blog that a person can change without a deploy.
 *
 * Figures that a driver could act on (rent, deposit, earnings) are deliberately optional and
 * default to empty. A page renders "pending approval" rather than a number nobody has signed.
 */

export type ImageSlot = {
  /** Shown in the admin so a non-technical editor knows what they are replacing. */
  label: string;
  /** Empty means render a labelled placeholder instead of an image. */
  url: string;
  alt: string;
};

export type Hub = {
  name: string;
  address: string;
  hours: string;
  mapUrl?: string;
};

export type Plan = {
  id: string;
  /** "Own Now", "Drive to Own", "Leasing" */
  name: Record<Locale, string>;
  summary: Record<Locale, string>;
  /** Left blank until operations approves a figure for this city. */
  upfront?: string;
  perDay?: string;
  months?: string;
};

export type City = {
  /** Must match the live address exactly: /drive-with-us/driver-job-in-<slug>/ */
  slug: string;
  name: Record<Locale, string>;
  state: string;
  /** Refreshed from the weekly workbook. Zero hides the line rather than showing a zero. */
  readyCars: number;
  hubs: Hub[];
  plans: string[];
  heroImage: ImageSlot;
};

export type Post = {
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  /** Plain paragraphs. One string per paragraph, so an editor never writes markup. */
  body: string[];
  published: boolean;
  date: string;
  coverImage: ImageSlot;
};

export type SiteContent = {
  updatedAt: string;
  updatedBy: string;
  cities: City[];
  plans: Plan[];
  posts: Post[];
  images: Record<string, ImageSlot>;
};

const placeholder = (label: string, alt = ""): ImageSlot => ({ label, url: "", alt });

const CITY_SEED: Array<{ slug: string; en: string; hi: string; te: string; state: string }> = [
  { slug: "mumbai", en: "Mumbai", hi: "मुंबई", te: "ముంబై", state: "Maharashtra" },
  { slug: "delhi", en: "Delhi NCR", hi: "दिल्ली NCR", te: "ఢిల్లీ NCR", state: "Delhi" },
  { slug: "bengaluru", en: "Bengaluru", hi: "बेंगलुरु", te: "బెంగళూరు", state: "Karnataka" },
  { slug: "hyderabad", en: "Hyderabad", hi: "हैदराबाद", te: "హైదరాబాద్", state: "Telangana" },
  { slug: "chennai", en: "Chennai", hi: "चेन्नई", te: "చెన్నై", state: "Tamil Nadu" },
  { slug: "pune", en: "Pune", hi: "पुणे", te: "పూణే", state: "Maharashtra" },
  { slug: "kolkata", en: "Kolkata", hi: "कोलकाता", te: "కోల్‌కతా", state: "West Bengal" },
];

/**
 * Opening guides. Every claim here already appears on the driver pages, so nothing new is
 * being asserted. An editor can unpublish or rewrite any of them in the admin.
 */
const SEED_POSTS: Post[] = [
  {
    slug: "documents-to-drive-an-uber",
    locale: "en",
    title: "Documents you need to start driving",
    excerpt: "Four documents, and what each one is checked for at the hub.",
    date: "2026-09-15",
    published: true,
    coverImage: placeholder("Guide cover, documents", ""),
    body: [
      "Four documents are checked before you take a car: an Aadhaar card, a PAN card, a driving licence and proof of address. Bring the originals to the hub.",
      "The driving licence has to be valid on the day you collect the car. The hub will tell you whether your city also requires a commercial endorsement, because that varies by state.",
      "Proof of address can be a rent agreement, a utility bill or a passport. It has to carry the address you actually live at, not a permanent address in another state.",
      "Nothing is charged for the application itself. The refundable deposit is paid at the hub once a car is assigned to you.",
    ],
  },
  {
    slug: "rent-or-own-a-car",
    locale: "en",
    title: "Renting, or owning at the end of the term",
    excerpt: "Three plans, and the question each one answers.",
    date: "2026-09-16",
    published: true,
    coverImage: placeholder("Guide cover, plans", ""),
    body: [
      "Leasing is a refundable deposit and a daily rent, with no commitment to buy. It suits a driver testing whether full time driving works for them.",
      "Drive to Own is a deposit and monthly instalments, and ownership transfers at the end of the term.",
      "Own Now is a lower amount upfront and a daily payment, and the car transfers to you at the end.",
      "Insurance and maintenance are covered on all three. Fuel or charging is paid by the driver. The exact deposit and daily figure depends on the city and is confirmed at the hub.",
    ],
  },
  {
    slug: "how-weekly-payouts-work",
    locale: "en",
    title: "How weekly payouts work",
    excerpt: "When the money moves, and what comes out before it does.",
    date: "2026-09-17",
    published: true,
    coverImage: placeholder("Guide cover, payouts", ""),
    body: [
      "Earnings reach your bank account every week, directly. There is no cash handling and no waiting on a monthly cycle.",
      "What you keep is what Uber pays you less the rent for the week. Fuel or charging is yours. Servicing, repairs and insurance are ours.",
      "A refundable deposit is held for the length of the term and returned when the car comes back, subject to the condition it is returned in.",
    ],
  },
  {
    slug: "documents-to-drive-an-uber",
    locale: "hi",
    title: "गाड़ी लेने के लिए कौन से कागज़ चाहिए",
    excerpt: "चार कागज़, और हब पर हर एक में क्या देखा जाता है।",
    date: "2026-09-15",
    published: true,
    coverImage: placeholder("Guide cover, documents (Hindi)", ""),
    body: [
      "गाड़ी लेने से पहले चार कागज़ देखे जाते हैं: आधार कार्ड, पैन कार्ड, ड्राइविंग लाइसेंस और पते का प्रमाण। हब पर असली कागज़ साथ लाइए।",
      "जिस दिन आप गाड़ी लेंगे उस दिन ड्राइविंग लाइसेंस वैध होना चाहिए। आपके शहर में कमर्शियल एंडोर्समेंट चाहिए या नहीं, यह हब बताएगा, क्योंकि हर राज्य में नियम अलग है।",
      "पते के प्रमाण में रेंट एग्रीमेंट, बिजली का बिल या पासपोर्ट चलेगा। उस पर वही पता होना चाहिए जहाँ आप अभी रहते हैं।",
      "अप्लाई करने की कोई फ़ीस नहीं है। वापस मिलने वाला डिपॉज़िट गाड़ी मिलने पर हब पर लिया जाता है।",
    ],
  },
  {
    slug: "documents-to-drive-an-uber",
    locale: "te",
    title: "కారు తీసుకోవడానికి ఏ పత్రాలు కావాలి",
    excerpt: "నాలుగు పత్రాలు, హబ్‌లో ఒక్కోదాన్ని దేనికి చూస్తారు.",
    date: "2026-09-15",
    published: true,
    coverImage: placeholder("Guide cover, documents (Telugu)", ""),
    body: [
      "కారు ఇచ్చే ముందు నాలుగు పత్రాలు చూస్తారు: ఆధార్ కార్డు, పాన్ కార్డు, డ్రైవింగ్ లైసెన్స్ మరియు చిరునామా రుజువు. హబ్‌కు అసలు పత్రాలు తీసుకురండి.",
      "కారు తీసుకునే రోజున డ్రైవింగ్ లైసెన్స్ చెల్లుబాటులో ఉండాలి. మీ నగరంలో కమర్షియల్ ఎండార్స్‌మెంట్ అవసరమా అనేది హబ్ చెబుతుంది, ఎందుకంటే అది రాష్ట్రాన్ని బట్టి మారుతుంది.",
      "చిరునామా రుజువుగా అద్దె ఒప్పందం, కరెంటు బిల్లు లేదా పాస్‌పోర్ట్ పనికొస్తుంది. దానిపై మీరు ప్రస్తుతం నివసించే చిరునామా ఉండాలి.",
      "దరఖాస్తుకు ఎలాంటి రుసుము లేదు. తిరిగి ఇచ్చే డిపాజిట్ కారు కేటాయించిన తర్వాత హబ్‌లో తీసుకుంటారు.",
    ],
  },
];

export const DEFAULT_CONTENT: SiteContent = {
  updatedAt: "",
  updatedBy: "",
  cities: CITY_SEED.map((c) => ({
    slug: c.slug,
    name: { en: c.en, hi: c.hi, te: c.te },
    state: c.state,
    readyCars: 0,
    // Hub details are placeholders until the city teams supply verified addresses.
    hubs: [],
    plans: ["own-now", "drive-to-own", "leasing"],
    heroImage: placeholder(`${c.en} hero image`, `Everest Fleet cars in ${c.en}`),
  })),
  plans: [
    {
      id: "own-now",
      name: { en: "Own Now", hi: "Own Now", te: "Own Now" },
      summary: {
        en: "Pay a low amount upfront, then daily, and the car transfers to you at the end.",
        hi: "शुरू में कम रकम, फिर रोज़ का भुगतान, और अवधि पूरी होने पर गाड़ी आपकी।",
        te: "మొదట తక్కువ మొత్తం, తర్వాత రోజువారీ చెల్లింపు, గడువు చివర కారు మీదే.",
      },
    },
    {
      id: "drive-to-own",
      name: { en: "Drive to Own", hi: "Drive to Own", te: "Drive to Own" },
      summary: {
        en: "A deposit and monthly instalments, with ownership at the end of the term.",
        hi: "डिपॉज़िट और महीने की किस्तें, अवधि पूरी होने पर मालिकाना हक़ आपका।",
        te: "డిపాజిట్ మరియు నెలవారీ వాయిదాలు, గడువు చివర యాజమాన్యం మీదే.",
      },
    },
    {
      id: "leasing",
      name: { en: "Leasing", hi: "लीज़िंग", te: "లీజింగ్" },
      summary: {
        en: "A refundable deposit and a daily rent, with no commitment to buy.",
        hi: "वापस मिलने वाला डिपॉज़िट और रोज़ का किराया, खरीदने की कोई बाध्यता नहीं।",
        te: "తిరిగి ఇచ్చే డిపాజిట్ మరియు రోజువారీ అద్దె, కొనుగోలు తప్పనిసరి కాదు.",
      },
    },
  ],
  posts: SEED_POSTS,
  images: {
    "driver-hub-hero": placeholder("Drive with us, hero image", "A driver beside an Everest Fleet car"),
    "blog-hero": placeholder("Driver guides, hero image", ""),
  },
};

export function findCity(content: SiteContent, slug: string): City | undefined {
  return content.cities.find((c) => c.slug === slug);
}

export function planFor(content: SiteContent, id: string): Plan | undefined {
  return content.plans.find((p) => p.id === id);
}

export function postsFor(content: SiteContent, locale: Locale): Post[] {
  return content.posts
    .filter((p) => p.published && p.locale === locale)
    .sort((a, b) => b.date.localeCompare(a.date));
}
