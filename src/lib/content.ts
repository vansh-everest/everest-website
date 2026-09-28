import type { Locale } from "@/lib/i18n";

/**
 * Everything on the public site that a person can change from /admin without a deploy.
 *
 * Money and month fields hold digits only, so the site formats every figure one way and the
 * calculator can do sums with them. A blank figure is hidden rather than shown as zero.
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

export type Price = {
  /** The headline figure, e.g. 650. */
  amount: string;
  /** Printed after the amount: "/day", "/week", "+/mo". */
  unit: string;
  deposit: string;
  upfront: string;
  tenureMonths: string;
};

export const PRICE_FIELDS = ["amount", "unit", "deposit", "upfront", "tenureMonths"] as const satisfies readonly (keyof Price)[];

/** Fields that hold digits. `unit` is the only free-text price field. */
export const DIGIT_FIELDS = ["amount", "deposit", "upfront", "tenureMonths"] as const satisfies readonly (keyof Price)[];

/** City slug to the fields that differ from the national figure. A missing field inherits. */
export type CityPrices = Record<string, Partial<Price>>;

export type Row = { label: string; value: string };

/** Marks a plan page card can carry; each has its own colour. */
export const FEATURE_ICONS = ["card", "coins", "calendar", "key", "shield", "wrench"] as const;
export type FeatureIcon = (typeof FEATURE_ICONS)[number];

/** A card in the plan page's blue band. */
export type Feature = { icon: FeatureIcon; title: string; body: string };

/**
 * The plan's own page. `{price}`, `{deposit}`, `{upfront}` and `{months}` in any text print the
 * national figures.
 */
export type PlanPage = {
  /** First line of the hero heading, in white. */
  headline: string;
  /** Second line, in yellow. */
  highlight: string;
  heroImage: ImageSlot;
  /** The third hero figure, after the rent and the deposit, e.g. Tenure: 12 Months. */
  term: Row;
  /** The chips under the hero figures, e.g. "Ownership plan". Also on the Our Plans page. */
  tags: string[];
  /** The small heading over the band, e.g. "Benefits". */
  whyTag: string;
  whyTitle: string;
  whySubtitle: string;
  /** The photo beside the benefit cards. */
  benefitsImage: ImageSlot;
  features: Feature[];
  /** Heading over the driver video. */
  storiesTitle: string;
};

/** A numbered photo card in the plan's Our Plans block. */
export type PlanStep = { title: string; body: string; image: ImageSlot };

/** The plan's block on the Our Plans page. */
export type PlanOverview = {
  /** Small text after the plan name, e.g. "Leasing plan". */
  note: string;
  /** Numbered photo cards. With none, the photo and points show instead. */
  steps: PlanStep[];
  image: ImageSlot;
  points: string[];
  /** The "Why drivers pick" strip. */
  highlights: string[];
};

export type Plan = {
  /** Referenced by cities, cars and the calculator. Fixed once the plan exists. */
  id: string;
  /** Offered at all: its own page, the driver pages and the calculator. */
  visible: boolean;
  /** A card in "We have plans for everyone" on the home page. */
  showCard: boolean;
  name: Record<Locale, string>;
  /** The badge on car cards, e.g. "DTO". */
  shortName: string;
  summary: Record<Locale, string>;
  /** The tab above the card, e.g. "Ownership model". */
  tag: string;
  /** The rent label on this plan's car cards, e.g. "Rent starting from". */
  priceLabel: string;
  theme: "dark" | "light";
  price: Price;
  /** Printed after the figures on the home page card, e.g. "Onwards". */
  depositNote: string;
  /** Printed as the tenure where no months are set, e.g. "Flexible". */
  tenureNote: string;
  cityPrices: CityPrices;
  /** Rows under deposit and vehicles, e.g. Ownership. */
  rows: Row[];
  benefits: string[];
  /** Cars offered under this plan, in the order the card lists them. */
  carIds: string[];
  page: PlanPage;
  overview: PlanOverview;
};

export type Car = {
  id: string;
  /** A card in the car sections. A hidden car still counts as offered under its plans. */
  visible: boolean;
  make: string;
  name: string;
  subtitle: string;
  fuel: string;
  /** "Pre-owned" or "Brand new". Drives the filter on the Own Now page. */
  condition: string;
  /** The tab above the card. Blank hides the tab. */
  highlight: string;
  highlightTone: "brand" | "leaf";
  image: ImageSlot;
  modelYears: string;
  price: Price;
  cityPrices: CityPrices;
};

/** One point on the Own Now slider: pay this deposit, then this much a day. */
export type DepositOption = { deposit: string; daily: string };

/** One car in the Own Now calculator: its studio photo and its deposit-to-daily points. */
export type CalculatorCar = {
  carId: string;
  image: ImageSlot;
  options: DepositOption[];
  defaultOption: number;
};

/** A plan page's calculator. A plan with no calculator, or no cars in it, shows none. */
export type Calculator = {
  planId: string;
  /** Names the slider and the second result box, e.g. "Upfront payment" or "Deposit". */
  depositLabel: string;
  cars: CalculatorCar[];
  /** Months offered in the Tenure picker. The first is selected. None hides the picker. */
  tenures: string[];
  /** `{months}` prints the chosen tenure. */
  perks: string[];
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
  /** When and by whom this copy was last saved as a draft. */
  updatedAt: string;
  updatedBy: string;
  /** When and by whom this copy went live. Blank on a draft that was never published. */
  publishedAt: string;
  publishedBy: string;
  cities: City[];
  plans: Plan[];
  cars: Car[];
  calculators: Calculator[];
  posts: Post[];
  images: Record<string, ImageSlot>;
};

/** Bump when SiteContent changes shape, so no deployment reads a cache written by an older one. */
export const CONTENT_VERSION = "4";

export const placeholder = (label: string, alt = ""): ImageSlot => ({ label, url: "", alt });

export const emptyPrice = (): Price => ({ amount: "", unit: "/day", deposit: "", upfront: "", tenureMonths: "" });

const same = (text: string): Record<Locale, string> => ({ en: text, hi: text, te: text });

const INSURANCE: Feature = { icon: "shield", title: "Insurance & Permits", body: "Included from Day 1" };
const SUPPORT: Feature = { icon: "wrench", title: "24×7 Support", body: "On-road breakdown help, always" };

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
 * The opening figures are the ones the Figma design and the live pages already carry, so
 * seeding the admin changes nothing a visitor sees until someone publishes an edit.
 */
const PLAN_SEED: Plan[] = [
  {
    id: "own-now",
    visible: true,
    showCard: true,
    name: same("Own Now"),
    shortName: "Own Now",
    summary: {
      en: "Pay a low amount upfront, then daily, and the car transfers to you at the end.",
      hi: "शुरू में कम रकम, फिर रोज़ का भुगतान, और अवधि पूरी होने पर गाड़ी आपकी।",
      te: "మొదట తక్కువ మొత్తం, తర్వాత రోజువారీ చెల్లింపు, గడువు చివర కారు మీదే.",
    },
    tag: "Ownership model",
    priceLabel: "Rent starting from",
    theme: "dark",
    price: { amount: "650", unit: "/day", deposit: "15000", upfront: "", tenureMonths: "" },
    depositNote: "Onwards",
    tenureNote: "",
    cityPrices: {},
    rows: [{ label: "Ownership", value: "Car transferred to your name at tenure end" }],
    benefits: ["No CIBIL", "Daily Instalments", "No Insurance", "No Regulatory Charges", "100% Uber incentive"],
    carIds: ["swift-dzire", "wagonr", "tigor", "s-presso"],
    page: {
      headline: "The Easiest Way to",
      highlight: "Own a Car",
      heroImage: { label: "Own Now, hero photo", url: "/figma/own-hero.webp", alt: "Everest driver holding up the keys to his car" },
      term: { label: "Tenure", value: "12 Months" },
      tags: ["Ownership plan", "High upfront · low daily rental plan", "Non-refundable"],
      whyTag: "Benefits",
      whyTitle: "Everything a driver needs, in one plan",
      whySubtitle: "",
      benefitsImage: { label: "Own Now, benefits photo", url: "/figma/plans/own-now-benefits.webp", alt: "A hand holding out a car key in front of a white car" },
      features: [
        { icon: "card", title: "No CIBIL Needed", body: "Just licence + basic KYC" },
        { icon: "coins", title: "Low Upfront", body: "Start with only 10% down" },
        { icon: "calendar", title: "Fixed Daily Pay", body: "{price}, no surprises" },
        { icon: "key", title: "Own in 24 Months", body: "Car is 100% yours at the end" },
        INSURANCE,
        SUPPORT,
      ],
      storiesTitle: "Real Drivers. Real Stories. On Camera.",
    },
    overview: {
      note: "Alternative to ownership via bank loan",
      steps: [
        {
          title: "Select Tenure & Pay Upfront",
          body: "Upfront payment starting as low as {upfront}",
          image: { label: "Own Now, step 1 photo", url: "/figma/our-plans/own-now-step-1.webp", alt: "A driver handing over the upfront payment at an Everest desk" },
        },
        {
          title: "Drive & Earn",
          body: "Daily rent starting from as low as {price} onwards",
          image: { label: "Own Now, step 2 photo", url: "/figma/our-plans/own-now-step-2.webp", alt: "A white Everest car on a city highway" },
        },
        {
          title: "Full Ownership After End Of Tenure",
          body: "Car transferred to your name at the end of tenure",
          image: { label: "Own Now, step 3 photo", url: "/figma/our-plans/own-now-step-3.webp", alt: "A driver beside his new car at the showroom" },
        },
      ],
      image: placeholder("Own Now, Our Plans photo"),
      points: [],
      highlights: ["No CIBIL", "₹0 insurance", "₹0 regulatory fees", "100% incentive"],
    },
  },
  {
    id: "drive-to-own",
    visible: true,
    showCard: true,
    name: same("Drive to Own"),
    shortName: "DTO",
    summary: {
      en: "A deposit and monthly instalments, with ownership at the end of the term.",
      hi: "डिपॉज़िट और महीने की किस्तें, अवधि पूरी होने पर मालिकाना हक़ आपका।",
      te: "డిపాజిట్ మరియు నెలవారీ వాయిదాలు, గడువు చివర యాజమాన్యం మీదే.",
    },
    tag: "Ownership model",
    priceLabel: "Rent starting from",
    theme: "light",
    price: { amount: "499", unit: "+/mo", deposit: "5000", upfront: "", tenureMonths: "" },
    depositNote: "",
    tenureNote: "",
    cityPrices: {},
    rows: [{ label: "Flexible", value: "No fixed rent - earnings-linked model" }],
    benefits: ["No Insurance", "No Regulatory Charges", "Free Repair & Maintenance", "24×7 Support"],
    carIds: ["swift-dzire", "wagonr", "tigor", "s-presso", "tigor-ev"],
    page: {
      headline: "Own a Car Without",
      highlight: "a Fixed Rent",
      heroImage: { label: "Drive to Own, hero photo", url: "/figma/hero-drive-to-own.webp", alt: "A hand holding out car keys in front of a row of Everest cars" },
      term: { label: "Ownership", value: "24 Months" },
      tags: ["Ownership plan", "Low deposit · high daily rental plan", "Refundable"],
      whyTag: "Benefits",
      whyTitle: "Why Drivers Choose Drive to Own",
      whySubtitle: "",
      benefitsImage: { label: "Drive to Own, benefits photo", url: "/figma/plans/drive-to-own-benefits.webp", alt: "An Everest driver standing beside his car" },
      features: [
        { icon: "card", title: "No Fixed Rent", body: "You pay a share of what you earn" },
        { icon: "coins", title: "{deposit} Deposit", body: "Low, and fully refundable" },
        { icon: "calendar", title: "Earnings-Linked", body: "A slow week costs you less" },
        { icon: "key", title: "Ends in Ownership", body: "The car still becomes yours" },
        INSURANCE,
        SUPPORT,
      ],
      storiesTitle: "Real Drivers. Real Stories. On Camera.",
    },
    overview: {
      note: "",
      steps: [],
      image: { label: "Drive to Own, Our Plans photo", url: "/figma/our-plans/drive-to-own.webp", alt: "An Everest manager shaking hands with a driver beside his car" },
      points: ["No large upfront, refundable deposit", "No Regulatory Charges", "Own your car in less than 24 months", "24×7 Support, zero maintenance"],
      highlights: ["Earnings-Linked", "No insurance costs", "No regulatory fees", "Free Maintenance"],
    },
  },
  {
    id: "leasing",
    visible: true,
    showCard: true,
    name: same("Drive to Earn"),
    shortName: "DTE",
    summary: {
      en: "A refundable deposit and a daily rent, with no commitment to buy.",
      hi: "वापस मिलने वाला डिपॉज़िट और रोज़ का किराया, खरीदने की कोई बाध्यता नहीं।",
      te: "తిరిగి ఇచ్చే డిపాజిట్ మరియు రోజువారీ అద్దె, కొనుగోలు తప్పనిసరి కాదు.",
    },
    tag: "Renting model",
    priceLabel: "Rent starting from",
    theme: "light",
    price: { amount: "399", unit: "/day", deposit: "5000", upfront: "", tenureMonths: "" },
    depositNote: "",
    tenureNote: "Flexible",
    cityPrices: {},
    rows: [{ label: "Zero asset", value: "No ownership or loan liability" }],
    benefits: ["24/7 Support", "100% Uber incentive", "free repair and maintenance"],
    carIds: ["swift-dzire", "wagonr", "tigor", "s-presso", "tigor-ev"],
    page: {
      headline: "Earn Without",
      highlight: "Owning Anything",
      heroImage: { label: "Drive to Earn, hero photo", url: "/figma/hero-drive-to-earn.webp", alt: "A driver sitting in the open door of his Everest car" },
      term: { label: "Liability", value: "Zero" },
      tags: ["Rental plan", "Low deposit · high daily rental plan", "Refundable"],
      whyTag: "Benefits",
      whyTitle: "Why Drivers Choose Drive to Earn",
      whySubtitle: "",
      benefitsImage: { label: "Drive to Earn, benefits photo", url: "/figma/plans/drive-to-earn-benefits.webp", alt: "A smiling driver at the wheel of his car" },
      features: [
        { icon: "card", title: "Fixed {price}", body: "Same rent, every single day" },
        { icon: "coins", title: "{deposit} Deposit", body: "Low, and fully refundable" },
        { icon: "calendar", title: "Zero Asset", body: "No ownership, no loan in your name" },
        { icon: "key", title: "All Incentives", body: "Every Uber incentive stays with you" },
        INSURANCE,
        SUPPORT,
      ],
      storiesTitle: "Real Drivers. Real Stories. On Camera.",
    },
    overview: {
      note: "Leasing plan",
      steps: [],
      image: { label: "Drive to Earn, Our Plans photo", url: "/figma/our-plans/drive-to-earn.webp", alt: "A driver checking his phone beside an Everest car" },
      points: ["Simple renting, no commitment", "Low refundable deposit", "We set up your Uber account", "Earn Uber incentives on every ride", "24×7 Support, zero maintenance"],
      highlights: ["Earnings-Linked", "100% Uber incentive", "24×7 Driver Support", "Free Maintenance"],
    },
  },
  {
    id: "revenue-share",
    visible: true,
    showCard: false,
    name: same("Revenue Share"),
    shortName: "RS",
    summary: same(""),
    tag: "Earning model",
    priceLabel: "Rent starting from",
    theme: "light",
    price: emptyPrice(),
    depositNote: "",
    tenureNote: "Flexible",
    cityPrices: {},
    rows: [],
    benefits: [],
    carIds: ["wagonr", "tigor-ev"],
    page: {
      headline: "You Drive.",
      highlight: "We Both Earn.",
      heroImage: { label: "Revenue Share, hero photo", url: "/figma/hero-revenue-share.webp", alt: "An Everest driver leaning on his car with the city skyline behind him" },
      term: { label: "", value: "" },
      tags: [],
      whyTag: "Why Revenue Share",
      whyTitle: "No rent to find on a slow day",
      whySubtitle: "Your cost moves with you.",
      benefitsImage: placeholder("Revenue Share, benefits photo"),
      // The design also carries "Share split" and "Deposit" cards, to add once those figures are set.
      features: [
        { icon: "card", title: "No Fixed Rent", body: "Your cost moves with your earnings" },
        { icon: "coins", title: "Pay As You Earn", body: "Earn less, pay less, automatically" },
        INSURANCE,
        SUPPORT,
      ],
      storiesTitle: "Real Drivers. Real Stories. On Camera.",
    },
    overview: emptyOverview("Revenue Share"),
  },
];

const CAR_SEED: Car[] = [
  {
    id: "wagonr",
    visible: true,
    make: "Maruti Suzuki",
    name: "WagonR",
    subtitle: "Sedan · Most popular",
    fuel: "CNG",
    condition: "Pre-owned",
    highlight: "India’s Most Driven & Trusted Choice",
    highlightTone: "brand",
    image: { label: "WagonR photo", url: "/figma/car-wagonr.jpg", alt: "White Everest Fleet WagonR" },
    modelYears: "2025, 2024, 2023",
    price: { amount: "650", unit: "/day", deposit: "40000", upfront: "", tenureMonths: "24" },
    cityPrices: {},
  },
  {
    id: "tigor-ev",
    visible: true,
    make: "Tata",
    name: "Tigor EV",
    subtitle: "Sedan · Comfort drive",
    fuel: "EV",
    condition: "Brand new",
    highlight: "Our Most Popular Eco-Friendly Favorite",
    highlightTone: "leaf",
    image: { label: "Tigor EV photo", url: "/figma/car-tigor-ev.jpg", alt: "White Everest Fleet Tigor EV" },
    modelYears: "2025, 2024, 2023",
    price: { amount: "650", unit: "/day", deposit: "40000", upfront: "", tenureMonths: "24" },
    cityPrices: {},
  },
  ...(
    [
      ["swift-dzire", "Maruti Suzuki", "Swift Dzire"],
      ["tigor", "Tata", "Tigor"],
      ["s-presso", "Maruti Suzuki", "S-Presso"],
    ] as const
  ).map(
    ([id, make, name]): Car => ({
      id,
      // Listed on the plan cards; no photo or figures yet, so no card of its own.
      visible: false,
      make,
      name,
      subtitle: "",
      fuel: "CNG",
      condition: "",
      highlight: "",
      highlightTone: "brand",
      image: placeholder(`${name} photo`, `White Everest Fleet ${name}`),
      modelYears: "",
      price: emptyPrice(),
      cityPrices: {},
    })
  ),
];

const WAGONR_STUDIO: ImageSlot = { label: "WagonR, studio photo", url: "/figma/own-wagonr-studio.jpg", alt: "Maruti Suzuki WagonR in a studio" };

// One combination per plan, the one its design shows. The slider appears once a second point is added.
const CALCULATOR_SEED: Calculator[] = [
  {
    planId: "own-now",
    depositLabel: "Upfront payment",
    cars: [{ carId: "wagonr", image: WAGONR_STUDIO, options: [{ deposit: "65000", daily: "750" }], defaultOption: 0 }],
    tenures: ["48"],
    perks: ["Taxes and insurance included", "Maintenance for contract duration", "You own it at month {months}"],
  },
  {
    planId: "drive-to-own",
    depositLabel: "Deposit",
    cars: [{ carId: "wagonr", image: WAGONR_STUDIO, options: [{ deposit: "15000", daily: "900" }], defaultOption: 0 }],
    tenures: ["24"],
    perks: ["Taxes and insurance included", "Maintenance for contract duration", "You own it at month {months}"],
  },
  {
    planId: "leasing",
    depositLabel: "Deposit",
    cars: [{ carId: "wagonr", image: WAGONR_STUDIO, options: [{ deposit: "5000", daily: "925" }], defaultOption: 0 }],
    tenures: [],
    perks: ["Taxes and insurance included", "Maintenance included", "Refundable deposit"],
  },
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
  publishedAt: "",
  publishedBy: "",
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
  plans: PLAN_SEED,
  cars: CAR_SEED,
  calculators: CALCULATOR_SEED,
  posts: SEED_POSTS,
  images: {
    "driver-hub-hero": placeholder("Drive with us, hero image", "A driver beside an Everest Fleet car"),
    "blog-hero": placeholder("Driver guides, hero image", ""),
    "our-plans-hero": { label: "Our Plans, hero photo", url: "/figma/our-plans/hero.webp", alt: "Rows of white Everest cars in front of a city skyline" },
  },
};

export function findCity(content: SiteContent, slug: string): City | undefined {
  return content.cities.find((c) => c.slug === slug);
}

export function planFor(content: SiteContent, id: string): Plan | undefined {
  return content.plans.find((p) => p.id === id);
}

export function carFor(content: SiteContent, id: string): Car | undefined {
  return content.cars.find((c) => c.id === id);
}

export function postsFor(content: SiteContent, locale: Locale): Post[] {
  return content.posts
    .filter((p) => p.published && p.locale === locale)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** The national figure with any field this city overrides. */
export function priceIn(base: Price, overrides: CityPrices, city?: string): Price {
  const own = city ? overrides[city] : undefined;
  if (!own) return base;
  const out = { ...base };
  for (const field of PRICE_FIELDS) {
    const value = own[field];
    if (value) out[field] = value;
  }
  return out;
}

/** "65000" becomes "₹65,000"; blank stays blank. */
export function rupees(digits: string): string {
  if (!digits) return "";
  return `₹${Number(digits).toLocaleString("en-IN")}`;
}

/** "₹650/day": the amount with its unit, blank when there is no amount. */
export function headline(price: Price): string {
  return price.amount ? `${rupees(price.amount)}${price.unit}` : "";
}

/**
 * Admin text can name a figure instead of repeating it, so a price change reaches every
 * sentence that quotes it. A token with no figure behind it prints nothing.
 */
export function fillFigures(text: string, price: Price, months = price.tenureMonths): string {
  return text
    .replaceAll("{price}", headline(price))
    .replaceAll("{deposit}", rupees(price.deposit))
    .replaceAll("{upfront}", rupees(price.upfront))
    .replaceAll("{months}", months)
    .replace(/\s{2,}/g, " ")
    .trim();
}

const TOKENS = /\{(price|deposit|upfront|months)\}/g;

/**
 * Like fillFigures, but a line quoting a figure the plan leaves blank is dropped whole, so a
 * sentence never ends on "as low as".
 */
export function fillOrDrop(text: string, price: Price, months = price.tenureMonths): string {
  const blank = [...text.matchAll(TOKENS)].some(([, token]) => {
    if (token === "price") return !price.amount;
    if (token === "months") return !months;
    return !price[token as "deposit" | "upfront"];
  });
  return blank ? "" : fillFigures(text, price, months);
}

export const emptyPage = (name = "Plan"): PlanPage => ({
  headline: "",
  highlight: "",
  heroImage: placeholder(`${name}, hero photo`),
  term: { label: "", value: "" },
  tags: [],
  whyTag: "",
  whyTitle: "",
  whySubtitle: "",
  benefitsImage: placeholder(`${name}, benefits photo`),
  features: [],
  storiesTitle: "Real Drivers. Real Stories. On Camera.",
});

/** A function declaration, because the plan seeds above call it before this line runs. */
export function emptyOverview(name = "Plan"): PlanOverview {
  return { note: "", steps: [], image: placeholder(`${name}, Our Plans photo`), points: [], highlights: [] };
}
