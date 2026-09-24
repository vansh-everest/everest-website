/**
 * Single source for every company figure shown on the site.
 *
 * Nothing anywhere else should hard-code a fleet size, driver count or city count.
 * The build previously carried 35,000+ cars and 50,000+ drivers in five places, which
 * conflicted with the live property (18,000 and 25,000+) and with the operating figures.
 * Four different answers across our own pages is also the main reason an AI assistant
 * declines to quote us: it cross-checks and finds no agreement.
 *
 * Figures below are the verifiable operating position as at 16 September 2026.
 * PENDING: operations to confirm these, and to supply a cumulative drivers-served figure
 * if one is to be published. Update the numbers and the date together, never separately.
 */
export const COMPANY = {
  asOf: "September 2026",
  founded: 2016,

  /** Vehicles owned, stated conservatively. */
  vehicles: "20,000+",
  /** Drivers currently on the road, stated conservatively. */
  drivers: "10,000+",
  /** Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune, Kolkata, Chennai. */
  cities: 7,

  phone: "+91 91262 14248",
} as const;

/** One sentence, reused in metadata, the footer and anywhere else the company is described. */
export const COMPANY_BLURB =
  `India's largest fleet management company. ${COMPANY.vehicles} cars, ${COMPANY.drivers} drivers ` +
  `and ${COMPANY.cities} cities, powering driver earnings on the Uber India network since ${COMPANY.founded}.`;

export const SITE_URL = "https://everestfleet.com";
