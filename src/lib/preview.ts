/**
 * Pages an admin can open in preview. The list is fixed on the server, and any other value is
 * reduced to the home page, so the preview link can never become an open redirect.
 */
export const PREVIEW_PAGES: { label: string; path: string }[] = [
  { label: "Home", path: "/" },
  { label: "Own Now", path: "/own-now/" },
  { label: "Drive to Own", path: "/drive-to-own/" },
  { label: "Drive to Earn", path: "/drive-to-earn/" },
  { label: "Revenue Share", path: "/revenue-share/" },
  { label: "Drive with us", path: "/drive-with-us/" },
  { label: "Mumbai driver page", path: "/drive-with-us/driver-job-in-mumbai/" },
  { label: "Delhi NCR driver page", path: "/drive-with-us/driver-job-in-delhi/" },
  { label: "Bengaluru driver page", path: "/drive-with-us/driver-job-in-bengaluru/" },
];

/** Any internal page path; used to return from a preview to the page it was opened on. */
export function safePath(value: string | null | undefined): string {
  if (!value || value.length > 200) return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  if (!/^[A-Za-z0-9/_-]*$/.test(value)) return "/";
  return value.endsWith("/") ? value : `${value}/`;
}
