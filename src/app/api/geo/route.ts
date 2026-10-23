import { NextResponse } from "next/server";
import { getContent } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The visitor's city, as one of the site's cities, for the top bar's picker on a first visit.
 *
 * It reads the city the host puts on the request (CloudFront on Amplify, Vercel, Cloudflare).
 * Where the host gives none and IPINFO_TOKEN is set, it asks ipinfo.io for the caller's address.
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

const CITY_HEADERS = ["cloudfront-viewer-city", "x-vercel-ip-city", "cf-ipcity"];

function hostCity(headers: Headers): { city: string; source: string } | null {
  for (const name of CITY_HEADERS) {
    const value = headers.get(name);
    if (value) {
      try {
        return { city: decodeURIComponent(value), source: name };
      } catch {
        return { city: value, source: name };
      }
    }
  }
  return null;
}

async function lookupCity(headers: Headers): Promise<string | null> {
  const token = process.env.IPINFO_TOKEN;
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!token || !ip) return null;
  try {
    const res = await fetch(`https://ipinfo.io/${encodeURIComponent(ip)}/city?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    return res.ok ? (await res.text()).trim() || null : null;
  } catch (error) {
    console.warn(`ipinfo lookup failed: ${error instanceof Error ? error.message : error}`);
    return null;
  }
}

export async function GET(request: Request) {
  const found = hostCity(request.headers);
  const name = found?.city ?? (await lookupCity(request.headers));
  const source = found?.source ?? (name ? "ipinfo" : null);
  const key = name?.toLowerCase().trim() ?? "";
  const content = await getContent();
  const slugs = new Set(content.cities.map((c) => c.slug));
  const match =
    content.cities.find((c) => c.name.en.toLowerCase() === key)?.slug ??
    Object.entries(ALIASES).find(([slug, places]) => slugs.has(slug) && places.includes(key))?.[0] ??
    null;
  return NextResponse.json({ city: match, source }, { headers: { "Cache-Control": "private, no-store" } });
}
