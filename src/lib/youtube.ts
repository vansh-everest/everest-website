/** The 11-character video id in a YouTube watch, youtu.be, Shorts or embed link; null when it is not one. */
export function youtubeId(link: string): string | null {
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m)\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/)?.[1] ?? null;
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

/** A Shorts link: the video itself is vertical, so it needs no cropping. */
export const isShort = (link: string) => /youtube\.com\/shorts\//i.test(link);

/**
 * A video's running time as "m:ss", read from its public watch page and kept for a day.
 * Null when YouTube does not answer in time or the page has no length: the card then shows none.
 */
export async function youtubeLength(id: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
      headers: { "Accept-Language": "en", "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const seconds = Number((await res.text()).match(/"lengthSeconds":"(\d+)"/)?.[1]);
    if (!seconds) return null;
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  } catch {
    return null;
  }
}
