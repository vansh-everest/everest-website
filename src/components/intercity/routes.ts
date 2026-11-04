/**
 * Every route and fare on the Intercity page. To change a price, change it here: the route cards,
 * the booking sheet and the lead all read from this list.
 *
 * Fares are rupees for a one-way trip. `city` is the pick-up city as the lead's city field carries
 * it, which is the site's city slug where the city has one.
 */

export const VEHICLES = [
  { id: "hatchback", label: "Hatchback", seats: "Up to 4" },
  { id: "sedan", label: "Sedan", seats: "Up to 4" },
  { id: "suv", label: "XL / SUV", seats: "Up to 7" },
] as const;

export type VehicleId = (typeof VEHICLES)[number]["id"];

export type Route = {
  from: string;
  to: string;
  city: string;
  fares: Record<VehicleId, number>;
};

export const ROUTES: Route[] = [
  { from: "Mumbai", to: "Pune", city: "mumbai", fares: { hatchback: 2200, sedan: 2400, suv: 2800 } },
  { from: "Mumbai", to: "Nashik", city: "mumbai", fares: { hatchback: 2400, sedan: 2600, suv: 3000 } },
  { from: "Pune", to: "Mumbai", city: "pune", fares: { hatchback: 2200, sedan: 2400, suv: 2800 } },
  { from: "Nashik", to: "Mumbai", city: "nashik", fares: { hatchback: 2400, sedan: 2600, suv: 3000 } },
  { from: "Delhi", to: "Jaipur", city: "delhi", fares: { hatchback: 3200, sedan: 3800, suv: 4700 } },
  { from: "Jaipur", to: "Delhi", city: "jaipur", fares: { hatchback: 3200, sedan: 3800, suv: 4700 } },
  { from: "Bangalore", to: "Mysore", city: "bengaluru", fares: { hatchback: 2200, sedan: 2400, suv: 2800 } },
  { from: "Mysore", to: "Bangalore", city: "mysore", fares: { hatchback: 2200, sedan: 2400, suv: 2800 } },
];

export const vehicleLabel = (id: VehicleId) => VEHICLES.find((v) => v.id === id)?.label ?? id;

export const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

/** The route card's "starting from" price. */
export const lowestFare = (route: Route) => Math.min(...Object.values(route.fares));
