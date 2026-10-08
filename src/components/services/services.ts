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
    tags: ["Mumbai", "Bengaluru", "Cold Chain"],
    stats: [
      { value: "242+", label: "Vehicles" },
      { value: "4", label: "Vehicle Types" },
      { value: "2", label: "Cities" },
    ],
    points: [
      "Temperature-Controlled Vans",
      "Live Tracking On Every Trip",
      "Real-Time Delivery Alerts",
      "Built For Perishable Food",
      "Low Carbon Footprint",
    ],
    img: "/figma/services/fleet-logistics.webp",
    alt: "Everest Logistics refrigerated truck loaded with fresh fruit and vegetables",
  },
  {
    slug: "employee-mobility",
    title: "Employee Mobility",
    tags: ["EV-Led", `${COMPANY.cities} Cities`, "Corporate"],
    stats: [
      { value: String(COMPANY.cities), label: "Metro Cities" },
      { value: "100%", label: "Compliance" },
      { value: "₹0", label: "Fuel Exposure" },
    ],
    points: [
      "One Contract, Everything Included",
      "Backup Vehicle On Breakdown",
      "Live Tracking On Every Route",
      "Trained, Certified Drivers",
      "Pricing Fuel Cannot Move",
    ],
    img: "/figma/services/employee-mobility.webp",
    alt: "White Everest Fleet Tata Tigor on an open road",
  },
  {
    slug: "intercity",
    title: "Intercity",
    tags: ["One Way", "Round Trip", "Multi-Way"],
    stats: [
      { value: "3", label: "Ways To Travel" },
      { value: "5", label: "Steps To Book" },
      { value: "2", label: "Regions" },
    ],
    points: [
      "Airport Transfers",
      "City Rides, Any Distance",
      "Outstation, One Way Or Return",
      "Booked In Five Steps",
      "North India And Maharashtra",
    ],
    img: "/figma/services/intercity.webp",
    alt: "A family on a highway trip, seen from the back seat of a car",
  },
  {
    slug: "advertise-with-us",
    title: "Advertise With Us",
    tags: ["In-Cab", "Full Wrap", "Sampling"],
    stats: [
      // Cars carrying ads, as the services design gives it; the fleet total (COMPANY.vehicles) is larger.
      { value: "15,000+", label: "Cars In Motion" },
      { value: "₹0.10–0.20", label: "Per Impression" },
      { value: String(COMPANY.cities), label: "Cities" },
    ],
    points: [
      "3 Crore External Impressions A Day",
      "1,50,000 km Covered Daily",
      "AI Photo Proof Of Every Placement",
      "In-Cab, Wrap Or Sampling",
      "Reaches Riders And Streets",
    ],
    img: "/figma/services/advertise.webp",
    alt: "Car with a brand advertisement wrapped on its doors",
  },
];

/** Fired by a service's Get Started button; the enquiry form selects that service. */
export const PICK_SERVICE_EVENT = "everest:pick-service";
