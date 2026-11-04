import {
  BrickWall,
  CalendarCheck,
  Carrot,
  ChefHat,
  Croissant,
  CupSoda,
  Fuel,
  GraduationCap,
  Headset,
  IceCreamCone,
  Leaf,
  LocateFixed,
  Milk,
  MonitorSmartphone,
  PlugZap,
  RefreshCw,
  Route,
  Settings,
  Shirt,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Sofa,
  Sun,
  Thermometer,
  Timer,
  UserCheck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { COMPANY } from "@/lib/company";

export type IconItem = { icon: LucideIcon; label: string };

export const CITIES = ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata", "Other"];

export const STATS = [
  { value: COMPANY.vehicles, label: "Vehicles" },
  { value: String(COMPANY.cities), label: "Cities" },
  { value: "1,800", label: "Employees" },
  { value: String(COMPANY.founded), label: "In business since" },
];

export const SERVICES = [
  { icon: CalendarCheck, title: "Dedicated", body: "A fixed vehicle and driver, every month.", suits: "Daily, regular routes" },
  { icon: Timer, title: "Ad-hoc / Spot", body: "Book a vehicle trip by trip, when you need one.", suits: "One-off or peak loads" },
  { icon: Route, title: "Intercity line-haul", body: "Goods moved from one city to another.", suits: "City-to-city loads" },
];

/** `phoneOnly` items appear in the phone export's chip list, not in the desktop icon grid. */
export const CARGO: (IconItem & { phoneOnly?: boolean })[] = [
  { icon: ChefHat, label: "Cloud kitchens & QSR", phoneOnly: true },
  { icon: Milk, label: "Milk & dairy" },
  { icon: Carrot, label: "Fresh produce" },
  { icon: IceCreamCone, label: "Frozen food" },
  { icon: Croissant, label: "Bakery & confectionery" },
  { icon: Thermometer, label: "Temperature-sensitive", phoneOnly: true },
  { icon: CupSoda, label: "Beverages" },
  { icon: MonitorSmartphone, label: "Electronics" },
  { icon: Sofa, label: "Home goods" },
  { icon: Shirt, label: "Clothing" },
  { icon: Settings, label: "Automobile parts" },
  { icon: BrickWall, label: "Construction materials" },
];

export const FLEET = [
  { icon: Snowflake, name: "Freezer", range: "−18°C to −20°C", size: "1 T to 20 T", tone: "navy", level: 22 },
  { icon: Thermometer, name: "Chiller", range: "2°C to 8°C", size: "1 T to 20 T", tone: "brand", level: 45 },
  { icon: Sun, name: "Ambient", range: "No cooling needed", size: "Under 1 T to 30 T", tone: "sun", level: 81 },
] as const;

export const GREEN_FLEET: IconItem[] = [
  { icon: Leaf, label: "100% CNG vans" },
  { icon: PlugZap, label: "Electrically charged refrigeration" },
  { icon: Zap, label: "EV 3-wheelers for last mile" },
];

export const OPERATIONS: IconItem[] = [
  { icon: Headset, label: "Dedicated fleet support" },
  { icon: UserCheck, label: "Relationship manager" },
  { icon: RefreshCw, label: "Replacement vehicle support" },
  { icon: LocateFixed, label: "Live vehicle tracking" },
  { icon: Thermometer, label: "Temperature tracking" },
  { icon: GraduationCap, label: "Trained drivers" },
  { icon: ShieldCheck, label: "Well-maintained compliant vehicles" },
];

/** A logo row: add a client here and its card joins the row. */
/** Logos cropped from the design; w and h are each file's size, so the row keeps their proportions. */
export const CLIENTS = [
  { name: "Amul", logo: "/figma/logistics/clients/amul.webp", w: 184, h: 118 },
  { name: "bigbasket", logo: "/figma/logistics/clients/bigbasket.webp", w: 236, h: 92 },
  { name: "Delhivery", logo: "/figma/logistics/clients/delhivery.webp", w: 320, h: 58 },
  { name: "DMart", logo: "/figma/logistics/clients/dmart.webp", w: 288, h: 73 },
  { name: "Flipkart", logo: "/figma/logistics/clients/flipkart.webp", w: 260, h: 75 },
  { name: "Jumbotail", logo: "/figma/logistics/clients/jumbotail.webp", w: 270, h: 80 },
  { name: "NOTO Healthy Ice-creams", logo: "/figma/b2b/noto.webp", w: 96, h: 96 },
];

/** Fleet Logistics' own inbox, printed on the design's contact tile. */
export const EFL_EMAIL = "efl@everestfleet.com";

export type Quote = { text: string; name: string; meta: string; initials: string };

/** Add a quote here and the carousel grows its arrows and dots on its own. */
export const QUOTES: Quote[] = [
  {
    text: "Your commitment to excellence and dedication to meeting our needs have consistently exceeded our expectations.",
    name: "NOTO Healthy Ice-creams",
    meta: "Ice cream",
    initials: "N",
  },
  {
    text: "The effort and efficacy with which each order is handled is seamless — we almost feel like they are an extension of us.",
    name: "Mansi Bafna",
    meta: "Founder",
    initials: "MB",
  },
  {
    text: "Everest Fleet solves temperature-controlled logistics with environment-friendly, GPS-enabled refrigerated vans — at start-up friendly costs.",
    name: "Bansi Kotecha",
    meta: "Co-Founder, Kytchens · Cloud kitchens",
    initials: "BK",
  },
];

export const OWNER_GETS: IconItem[] = [
  { icon: CalendarCheck, label: "Assured monthly business" },
  { icon: Fuel, label: "Fuel or FASTag handling" },
  { icon: Wrench, label: "Maintenance support" },
  { icon: Smartphone, label: "App for trip and payment visibility" },
];

export const OWNER_STEPS = [
  { title: "Register", note: "On the form" },
  { title: "We call you", note: "Within one business day" },
  { title: "Verification", note: "Vehicle, RC and permit" },
  { title: "Start earning", note: "Your first trips begin" },
];

export const FAQS = [
  {
    q: "Why use Everest instead of running our own vehicles?",
    a: "You get tracked, temperature-logged trips, a replacement vehicle on breakdown, standard paperwork and a named account manager, without owning or managing a fleet.",
  },
  {
    q: "Which temperatures can you carry goods at?",
    a: "Freezer at −18°C to −20°C, chiller at 2°C to 8°C, and ambient for goods that need no cooling.",
  },
  {
    q: "What vehicle sizes do you have?",
    a: "Freezer and chiller vehicles run from 1 T to 20 T. Ambient vehicles run from under 1 T to 30 T, in LCV and HCV.",
  },
  {
    q: "Can we track our goods during the trip?",
    a: "Yes. Every trip has live vehicle tracking and temperature tracking, and the trip log is saved for audits.",
  },
  {
    q: "What happens if a vehicle breaks down?",
    a: "A replacement vehicle takes over, so the load keeps moving.",
  },
  {
    q: "How does billing work?",
    a: "Dedicated vehicles are billed monthly. Your quote sets out billing for ad-hoc and intercity trips.",
  },
  {
    q: "How quickly will you reply?",
    a: "Quote requests get a reply the same business day. Vehicle registrations get a call back within one business day.",
  },
  {
    q: "I own vehicles. How do I attach them to Everest?",
    a: "Register on the Attach your vehicle form. We call you within one business day, verify the vehicle, RC and permit, and your first trips begin.",
  },
];
