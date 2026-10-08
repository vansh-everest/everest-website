import { COMPANY } from "@/lib/company";

export type Service = {
  /** Also the service's own route and the value the enquiry form records. */
  slug: "fleet-logistics" | "employee-mobility" | "intercity" | "advertise-with-us";
  title: string;
  tags: string[];
  stats: { value: string; label: string }[];
  points: string[];
  img: string;
  alt: string;
};

export const SERVICES: Service[] = [
  {
    slug: "fleet-logistics",
    title: "Fleet Logistics",
    tags: ["Mumbai", "Bengaluru", "Cold chain"],
    stats: [
      { value: "242+", label: "vehicles" },
      { value: "4", label: "vehicle types" },
      { value: "2", label: "cities" },
    ],
    points: [
      "Temperature-controlled vans",
      "Live tracking on every trip",
      "Real-time delivery alerts",
      "Built for perishable food",
      "Low carbon footprint",
    ],
    img: "/figma/services/fleet-logistics.webp",
    alt: "Everest Logistics refrigerated truck loaded with fresh fruit and vegetables",
  },
  {
    slug: "employee-mobility",
    title: "Employee Mobility",
    tags: ["EV-led", `${COMPANY.cities} cities`, "Corporate"],
    stats: [
      { value: String(COMPANY.cities), label: "metro cities" },
      { value: "100%", label: "compliance" },
      { value: "₹0", label: "fuel exposure" },
    ],
    points: [
      "One contract, everything included",
      "Backup vehicle on breakdown",
      "Live tracking on every route",
      "Trained, certified drivers",
      "Pricing fuel cannot move",
    ],
    img: "/figma/services/employee-mobility.webp",
    alt: "White Everest Fleet Tata Tigor on an open road",
  },
  {
    slug: "intercity",
    title: "Intercity",
    tags: ["One way", "Round trip", "Multi-way"],
    stats: [
      { value: "3", label: "ways to travel" },
      { value: "5", label: "steps to book" },
      { value: "2", label: "regions" },
    ],
    points: [
      "Airport transfers",
      "City rides, any distance",
      "Outstation, one way or return",
      "Booked in five steps",
      "North India and Maharashtra",
    ],
    img: "/figma/services/intercity.webp",
    alt: "A family on a highway trip, seen from the back seat of a car",
  },
  {
    slug: "advertise-with-us",
    title: "Advertise With Us",
    tags: ["In-cab", "Full wrap", "Sampling"],
    stats: [
      // Cars carrying ads, as the services design gives it; the fleet total (COMPANY.vehicles) is larger.
      { value: "15,000+", label: "cars in motion" },
      { value: "₹0.10–0.20", label: "per impression" },
      { value: String(COMPANY.cities), label: "cities" },
    ],
    points: [
      "3 crore external impressions a day",
      "1,50,000 km covered daily",
      "AI photo proof of every placement",
      "In-cab, wrap or sampling",
      "Reaches riders and streets",
    ],
    img: "/figma/services/advertise.webp",
    alt: "Car with a brand advertisement wrapped on its doors",
  },
];

/** Fired by a service's Get Started button; the enquiry form selects that service. */
export const PICK_SERVICE_EVENT = "everest:pick-service";
