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
  { value: COMPANY.vehicles, label: "Vehicles" },
  // Design: "1,22,605 driver-partners onboarded". No driver count until operations confirm one.
  { value: String(COMPANY.cities), label: "Cities" },
  // Design: "100% CNG + EV fleet". PENDING: fleet composition source.
  { value: null, label: "CNG + EV Fleet" },
];

/** Market sizing cards beside "The opportunity". All pending the investor deck. */
export const MARKET: Figure[] = [
  { value: null, label: "Ride-Hailing Market In India" }, // design: [₹ XX,XXX Cr]
  { value: null, label: "Ride-Hailing Drivers In India" }, // design: [XX lakh]
  { value: null, label: "Market Growth A Year" }, // design: [XX%]
  { value: null, label: "Drivers Without Their Own Car" }, // design: [XX%]
];

export const STEPS = [
  { title: "We Own The Fleet", body: "CNG and electric cars, financed with partners like Axis Bank" },
  { title: "Drivers Choose A Plan", body: "Own Now, Revenue Share, Drive To Earn or Drive To Own" },
  { title: "The Cars Earn On Uber", body: "We are Uber India’s largest fleet partner" },
  { title: "Four More Services", body: "Logistics, employee mobility, intercity and cab advertising" },
];

/** Financial highlights. None is in the codebase yet, so the block stays hidden. */
export const HIGHLIGHTS: Figure[] = [
  { value: null, label: "Revenue, FY 2024-25" }, // design: [₹ XX Cr]
  { value: null, label: "Revenue Growth, Year On Year" }, // design: [XX%]
  { value: null, label: "EBITDA Margin" }, // design: [XX%]
  { value: null, label: "Asset Utilisation, Up From 40%" }, // design: 80%
  { value: null, label: "Series C, Led By Uber (2024)" }, // design: ₹251.7 Cr
  { value: null, label: "Employees" }, // design: 1,850+
];

const ASOF_YEAR = COMPANY.asOf.split(" ").pop() ?? "";

/**
 * Milestones the About page already states. The design's 2024 line ("Series C, led by Uber")
 * is a funding claim with no source here, so it waits with the other funding figures.
 */
export const MILESTONES = [
  { year: "2016", text: "Founded In Mumbai, 10 Cars" },
  { year: "2018", text: "100+ Vehicles, Into Bengaluru" },
  { year: "2023", text: "10,000 Vehicles, Series B" },
  { year: ASOF_YEAR, text: `${COMPANY.vehicles} Vehicles, ${COMPANY.cities} Cities`, current: true },
];

export type ImpactCard = { icon: "leaf" | "users"; title: string; points: Figure[] };

/** Impact cards. A point renders as "value label"; a null value hides the point. */
export const IMPACT: ImpactCard[] = [
  {
    icon: "leaf",
    title: "A Cleaner Fleet",
    points: [
      { value: null, label: "CNG And Electric" }, // design: 100%
      { value: null, label: "EVs On The Road" }, // design: 2,000+
    ],
  },
  {
    icon: "users",
    title: "Drivers Grow With Us",
    points: [
      { value: null, label: "Partners Have Taken Vehicles" }, // design: 1,22,605
      { value: null, label: "Everest Intrapreneurs" }, // design: 250+
    ],
  },
];

/** PENDING: the company profile PDF. */
export const COMPANY_PROFILE_URL = "";
/** Its page count; null shows plain "PDF". */
export const COMPANY_PROFILE_PAGES: number | null = null;

export type InvestorDocument = { icon: "file" | "lock"; title: string; url: string; pages: number | null };

/**
 * The documents row above the contact form. A document with a URL downloads; one without is
 * shared on request through the investor relations form.
 */
export const DOCUMENTS: InvestorDocument[] = [
  { icon: "file", title: "Company Profile", url: COMPANY_PROFILE_URL, pages: COMPANY_PROFILE_PAGES },
  { icon: "lock", title: "Investor Presentation", url: "", pages: null },
];

export type Logo = { id: string; name: string; w: number; h: number };

/** Equity backers, largest holding first. Logos at their drawn size in CSS pixels (files are /figma/investors/backer-<id>.webp). */
export const BACKERS: Logo[] = [
  { id: "uber", name: "Uber", w: 114, h: 42 },
  { id: "param", name: "Param Capital", w: 96, h: 62 },
  { id: "artha", name: "Artha Venture Fund", w: 78, h: 66 },
  { id: "paragon", name: "Paragon Partners", w: 118, h: 35 },
  { id: "patni", name: "Patni Family Office", w: 113, h: 65 },
  { id: "rockstud", name: "Rockstud Capital", w: 107, h: 53 },
  { id: "spark", name: "Spark Alternative Investment Trust", w: 101, h: 26 },
];

/** Debt partners, in the stakeholder's order. Sized to a similar area so wide and tall marks read evenly (files are /figma/investors/lender-<id>.webp). */
export const LENDERS: Logo[] = [
  { id: "axis", name: "Axis Bank", w: 115, h: 26 },
  { id: "guarantco", name: "GuarantCo", w: 89, h: 34 },
  { id: "bii", name: "British International Investment", w: 103, h: 29 },
  { id: "hdfc", name: "HDFC Bank", w: 118, h: 18 },
  { id: "bob", name: "Bank of Baroda", w: 114, h: 26 },
  { id: "sbi", name: "State Bank of India", w: 94, h: 32 },
  { id: "union", name: "Union Bank of India", w: 118, h: 25 },
  { id: "psb", name: "Punjab & Sind Bank", w: 112, h: 30 },
  { id: "bom", name: "Bank of Maharashtra", w: 112, h: 34 },
  { id: "idfc", name: "IDFC First Bank", w: 106, h: 33 },
  { id: "indusind", name: "IndusInd Bank", w: 118, h: 21 },
  { id: "hsbc", name: "HSBC", w: 70, h: 43 },
  { id: "yes", name: "Yes Bank", w: 102, h: 34 },
  { id: "toyota", name: "Toyota Financial Services", w: 96, h: 31 },
];

export type TeamMember = { name: string; photo: string | null };

/**
 * Leadership team, in the stakeholder's order. A photo is /figma/investors/team-<photo>.webp,
 * a 4:5 crop; a member with no photo yet shows initials.
 */
export const TEAM: TeamMember[] = [
  { name: "Siddharth Ladsariya", photo: "siddharth" },
  { name: "Sunny Sapra", photo: "sunny" },
  { name: "Apurav Mahajan", photo: "apurav" },
  { name: "Amar Kerkar", photo: "amar" },
  { name: "Sidarth Vohra", photo: "sidarth" },
  { name: "Prihans Dedhiya", photo: "prihans" },
  { name: "Monil Sheth", photo: "monil" },
  { name: "Shivang Unadkat", photo: "shivang" },
  { name: "Pradnya", photo: null },
  { name: "Ganesh Jatadharan", photo: null },
  { name: "Himani Ladsariya", photo: "himani" },
];

export type PressLink = { title: string; date: string; url: string };

/** Coverage hosted elsewhere, shown ahead of the newsroom's own stories in "Recent News". Headline and date as the publisher's page states them. */
export const PRESS_LINKS: PressLink[] = [
  {
    title: "Exclusive: Uber India to invest another $20 Mn in Everest Fleet",
    date: "2025-11-07T12:52:16+05:30",
    url: "https://entrackr.com/exclusive/exclusive-uber-india-to-invest-another-20-mn-in-everest-fleet-10635661",
  },
];
