import { COMPANY } from "@/lib/company";

/**
 * Everything the investors page states, in one place.
 *
 * The design carries figures nobody has signed off yet (market size, revenue, EBITDA, asset
 * utilisation, funding round, headcount, EV count, cumulative drivers onboarded). Each of those
 * slots is listed here with `value: null` and the design's number in a comment. A null slot is
 * not rendered. Supplying a sourced value is the only change needed to show it.
 */

export type Figure = { value: string | null; label: string };

/** Hero stats. Company figures come only from COMPANY. */
export const HERO_STATS: Figure[] = [
  { value: COMPANY.vehicles, label: "vehicles" },
  // Design: "1,22,605 driver-partners onboarded". COMPANY has no cumulative figure yet.
  { value: COMPANY.drivers, label: "drivers on the road" },
  { value: String(COMPANY.cities), label: "cities" },
  // Design: "100% CNG + EV fleet". PENDING: fleet composition source.
  { value: null, label: "CNG + EV fleet" },
];

/** Market sizing cards beside "The opportunity". All pending the investor deck. */
export const MARKET: Figure[] = [
  { value: null, label: "Ride-hailing market in India" }, // design: [₹ XX,XXX Cr]
  { value: null, label: "Ride-hailing drivers in India" }, // design: [XX lakh]
  { value: null, label: "Market growth a year" }, // design: [XX%]
  { value: null, label: "Drivers without their own car" }, // design: [XX%]
];

export const STEPS = [
  { title: "We own the fleet", body: "CNG and electric cars, financed with partners like Axis Bank" },
  { title: "Drivers choose a plan", body: "Own Now, Revenue Share, Drive to Earn or Drive to Own" },
  { title: "The cars earn on Uber", body: "We are Uber India’s largest electric fleet partner" },
  { title: "Four more services", body: "Logistics, employee mobility, intercity and cab advertising" },
];

/** Financial highlights. None is in the codebase yet, so the block stays hidden. */
export const HIGHLIGHTS: Figure[] = [
  { value: null, label: "Revenue, FY 2024-25" }, // design: [₹ XX Cr]
  { value: null, label: "Revenue growth, year on year" }, // design: [XX%]
  { value: null, label: "EBITDA margin" }, // design: [XX%]
  { value: null, label: "Asset utilisation, up from 40%" }, // design: 80%
  { value: null, label: "Series C, led by Uber (2024)" }, // design: ₹251.7 Cr
  { value: null, label: "Employees" }, // design: 1,850+
];

const ASOF_YEAR = COMPANY.asOf.split(" ").pop() ?? "";

/**
 * Milestones the About page already states. The design's 2024 line ("Series C, led by Uber")
 * is a funding claim with no source here, so it waits with the other funding figures.
 */
export const MILESTONES = [
  { year: "2016", text: "Founded in Mumbai, 10 cars" },
  { year: "2018", text: "1,000+ vehicles, into Delhi NCR" },
  { year: "2022", text: "10,000 vehicles, Series B" },
  { year: ASOF_YEAR, text: `${COMPANY.vehicles} vehicles, ${COMPANY.cities} cities`, current: true },
];

export type ImpactCard = { icon: "leaf" | "users" | "shield"; title: string; points: Figure[] };

/** Impact cards. A point renders as "value label"; a null value hides the point. */
export const IMPACT: ImpactCard[] = [
  {
    icon: "leaf",
    title: "A cleaner fleet",
    points: [
      { value: null, label: "CNG and electric" }, // design: 100%
      { value: null, label: "EVs on the road" }, // design: 2,000+
    ],
  },
  {
    icon: "users",
    title: "Drivers grow with us",
    points: [
      { value: null, label: "partners have taken vehicles" }, // design: 1,22,605
      { value: null, label: "Everest Intrapreneurs" }, // design: 250+
    ],
  },
  {
    icon: "shield",
    title: "Governed properly",
    points: [
      { value: "", label: "Three-tier ESG governance" },
      { value: "", label: "GRI-aligned ESG reporting" },
    ],
  },
];

/** PENDING: the ESG report PDF. Every "Download ESG report" control appears once this is set. */
export const ESG_REPORT_URL = "";

/** PENDING: the company profile PDF. */
export const COMPANY_PROFILE_URL = "";

export const FOUNDERS = [
  { initials: "SL", name: "Siddharth Ladsariya", role: "Founder & CEO" },
  { initials: "AC", name: "Anand Chheda", role: "Co-founder" },
  { initials: "PD", name: "Prihaans Dedhiya", role: "Co-founder" },
  { initials: "HL", name: "Himani Ladsariya", role: "Co-founder" },
];

/** Logo crops from the design, at their drawn size in CSS pixels. */
export const BACKERS = [
  { id: "uber", name: "Uber", w: 114, h: 42 },
  { id: "bii", name: "British International Investment", w: 111, h: 34 },
  { id: "artha", name: "Artha Group", w: 78, h: 66 },
  { id: "param", name: "Param", w: 96, h: 62 },
  { id: "patni", name: "Patni Financial Advisors", w: 113, h: 65 },
  { id: "rockstud", name: "Rockstud Capital", w: 107, h: 53 },
  { id: "spark", name: "Spark Fund", w: 101, h: 26 },
];
