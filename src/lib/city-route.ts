/**
 * The driver address is /drive-with-us/driver-job-in-<city>/ on the live property and must
 * not move, but the App Router only accepts a whole path segment as dynamic. So the segment
 * is the full "driver-job-in-mumbai" string and the city is read out of it here.
 */
export const CITY_PREFIX = "driver-job-in-";

export function citySegment(slug: string): string {
  return `${CITY_PREFIX}${slug}`;
}

/** Returns the city slug, or null when the segment is not a driver address. */
export function citySlugFrom(segment: string): string | null {
  return segment.startsWith(CITY_PREFIX) ? segment.slice(CITY_PREFIX.length) : null;
}

export function cityPath(slug: string): string {
  return `/drive-with-us/${citySegment(slug)}`;
}
