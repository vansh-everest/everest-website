import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_HOST, MAIN_SITE_URL } from "@/lib/hosts";

/**
 * One build, two addresses. website-admin.everestfleet.com serves only the admin (Hawkeye's app
 * menu opens it there, and Hawkeye's session cookie reaches it); every public page lives on the
 * main site. A public page asked for on the admin address is sent to the main site, and /admin on
 * the main site is sent to the admin address.
 */

/** What the admin itself needs on its address: its pages, its API routes, and draft previews. */
function adminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/");
}

/** Local and test servers keep every page on one address. */
function localHost(host: string): boolean {
  return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(host) || host.endsWith(".localhost") || host.endsWith(".test");
}

export function proxy(request: NextRequest) {
  // Behind Amplify's CDN the address the visitor typed can arrive as x-forwarded-host.
  const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const host = (forwarded || request.headers.get("host") || "").split(":")[0].toLowerCase();
  const { pathname, search } = request.nextUrl;
  if (!host || localHost(host)) return NextResponse.next();

  if (host === ADMIN_HOST) {
    // Absolute, on the public address: behind Amplify, request.url carries the server's own one.
    if (pathname === "/") return NextResponse.redirect(`https://${ADMIN_HOST}/admin/`, 308);
    if (adminPath(pathname)) return NextResponse.next();
    // An admin previewing a draft opens public pages on this address with draft mode on.
    if (request.cookies.has("__prerender_bypass")) return NextResponse.next();
    return NextResponse.redirect(`${MAIN_SITE_URL}${pathname}${search}`, 308);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.redirect(`https://${ADMIN_HOST}${pathname}${search}`, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Pages and API routes only: Next's own files and anything with a file extension pass untouched.
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
