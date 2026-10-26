import { NextResponse } from "next/server";
import { getContent } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The visitor's city, as one of the site's cities, for the top bar's picker on a first visit.
 *
 * everestfleet.com sits behind Cloudflare, which sits in front of Amplify's CloudFront. There the
 * CloudFront location headers describe Cloudflare's server, not the visitor, so a request that
 * came through Cloudflare is located by Cloudflare's own headers (cf-ipcity and coordinates, when
 * its visitor location headers are on) or else by looking up the visitor's address
 * (cf-connecting-ip) on ipinfo.io. A request straight to CloudFront uses CloudFront's city and
 * coordinates. A place outside the city names below still matches by distance to a site city.
 * The answer is only a starting point: the picker shows it, and the visitor can change it.
 * The caller's address is never returned or stored.
 */

/** Places the host may name, filed under the site city whose hubs serve them. */
const ALIASES: Record<string, string[]> = {
  mumbai: ["mumbai", "bombay", "thane", "navi mumbai", "kalyan", "dombivli", "bhiwandi", "vasai", "virar", "mira bhayandar", "panvel"],
  delhi: ["delhi", "new delhi", "gurgaon", "gurugram", "noida", "greater noida", "ghaziabad", "faridabad"],
  bengaluru: ["bengaluru", "bangalore"],
  hyderabad: ["hyderabad", "secunderabad"],
  chennai: ["chennai", "madras"],
  pune: ["pune", "pimpri", "pimpri-chinchwad", "chinchwad"],
  kolkata: ["kolkata", "calcutta", "howrah"],
};

/** Each site city's centre; a place within RADIUS_KM of one is filed under it. */
const CENTRES: Record<string, [number, number]> = {
  mumbai: [19.076, 72.8777],
  delhi: [28.6139, 77.209],
  bengaluru: [12.9716, 77.5946],
  hyderabad: [17.385, 78.4867],
  chennai: [13.0827, 80.2707],
  pune: [18.5204, 73.8567],
  kolkata: [22.5726, 88.3639],
};
const RADIUS_KM = 80;

type Place = { city: string | null; lat: number | null; lon: number | null; source: string };

const header = (headers: Headers, name: string) => {
  const value = headers.get(name);
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};
const num = (value: string | null | undefined) => (value && Number.isFinite(Number(value)) ? Number(value) : null);

/** The place the host put on the request, or null when the host gives none for the visitor. */
function hostPlace(headers: Headers): Place | null {
  if (headers.get("cf-connecting-ip")) {
    const city = header(headers, "cf-ipcity");
    const lat = num(headers.get("cf-iplatitude"));
    const lon = num(headers.get("cf-iplongitude"));
    return city || lat !== null ? { city, lat, lon, source: "cloudflare" } : null;
  }
  const city = header(headers, "cloudfront-viewer-city") ?? header(headers, "x-vercel-ip-city");
  const lat = num(headers.get("cloudfront-viewer-latitude") ?? headers.get("x-vercel-ip-latitude"));
  const lon = num(headers.get("cloudfront-viewer-longitude") ?? headers.get("x-vercel-ip-longitude"));
  return city || lat !== null ? { city, lat, lon, source: "cloudfront" } : null;
}

const recent = new Map<string, Place | null>();
const RECENT_MAX = 5000;

/** The visitor's address looked up on ipinfo.io (IPINFO_TOKEN raises its free limit), kept briefly per address. */
async function lookupPlace(headers: Headers): Promise<Place | null> {
  const ip = headers.get("cf-connecting-ip")?.trim() || headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return null;
  if (recent.has(ip)) return recent.get(ip) ?? null;
  const token = process.env.IPINFO_TOKEN;
  let place: Place | null = null;
  try {
    const res = await fetch(`https://ipinfo.io/${encodeURIComponent(ip)}/json${token ? `?token=${encodeURIComponent(token)}` : ""}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const body = (await res.json()) as { city?: string; loc?: string };
      const [lat, lon] = (body.loc ?? "").split(",");
      place = { city: body.city || null, lat: num(lat), lon: num(lon), source: "ipinfo" };
    } else {
      console.warn(`ipinfo lookup answered ${res.status}`);
    }
  } catch (error) {
    console.warn(`ipinfo lookup failed: ${error instanceof Error ? error.message : error}`);
  }
  if (recent.size >= RECENT_MAX) recent.clear();
  recent.set(ip, place);
  return place;
}

function distanceKm(a: [number, number], b: [number, number]): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]);
  const dLon = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** A site city for the place: by name first, by distance second. */
function siteCity(place: Place, cities: { slug: string; name: { en: string } }[]): string | null {
  const slugs = new Set(cities.map((c) => c.slug));
  const key = place.city?.toLowerCase().trim() ?? "";
  const byName =
    (key && cities.find((c) => c.name.en.toLowerCase() === key)?.slug) ||
    (key && Object.entries(ALIASES).find(([slug, places]) => slugs.has(slug) && places.includes(key))?.[0]);
  if (byName) return byName;
  if (place.lat === null || place.lon === null) return null;
  const here: [number, number] = [place.lat, place.lon];
  const nearest = Object.entries(CENTRES)
    .filter(([slug]) => slugs.has(slug))
    .map(([slug, centre]) => [slug, distanceKm(here, centre)] as const)
    .sort((x, y) => x[1] - y[1])[0];
  return nearest && nearest[1] <= RADIUS_KM ? nearest[0] : null;
}

export async function GET(request: Request) {
  const content = await getContent();
  const hosted = hostPlace(request.headers);
  let place = hosted;
  let city = hosted ? siteCity(hosted, content.cities) : null;
  if (!city) {
    const looked = await lookupPlace(request.headers);
    if (looked) {
      place = looked;
      city = siteCity(looked, content.cities);
    }
  }
  // ?why=1 names the location headers that reached the app (names only), to check what the CDNs pass on.
  const why = new URL(request.url).searchParams.has("why")
    ? { headers: [...request.headers.keys()].filter((k) => /^(cf-|cloudfront-viewer-|x-forwarded-for|x-vercel-ip)/.test(k)).sort() }
    : {};
  return NextResponse.json({ city, source: place?.source ?? null, ...why }, { headers: { "Cache-Control": "private, no-store" } });
}
