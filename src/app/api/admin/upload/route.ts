import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jarvisAdminEnabled, jarvisAdminForm } from "@/lib/jarvis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Image upload for the admin.
 *
 * Jarvis when it is connected (its public Cloudflare bucket, efpp.everestfleet.com), else Vercel
 * Blob when a token is present, otherwise public/uploads for local development.
 * The route returns the address to store in the image slot, so the editor never has to
 * know which of the two is in use.
 *
 * The stored type and extension come from the bytes, never from the upload. A part labelled
 * image/png whose name ends .html would otherwise be served back as a document from this
 * origin, where it can read the session cookie and drive the admin's own actions.
 *
 * SVG is not accepted for the same reason: it carries script and there is no way to serve it
 * inertly from the same origin.
 */

const MAX_BYTES = 8 * 1024 * 1024;

type Kind = { mime: string; ext: string; matches: (b: Uint8Array) => boolean };

const ascii = (b: Uint8Array, at: number, text: string) =>
  [...text].every((c, i) => b[at + i] === c.charCodeAt(0));

const KINDS: Kind[] = [
  { mime: "image/jpeg", ext: ".jpg", matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    mime: "image/png",
    ext: ".png",
    matches: (b) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v),
  },
  { mime: "image/gif", ext: ".gif", matches: (b) => ascii(b, 0, "GIF87a") || ascii(b, 0, "GIF89a") },
  { mime: "image/webp", ext: ".webp", matches: (b) => ascii(b, 0, "RIFF") && ascii(b, 8, "WEBP") },
  {
    mime: "image/avif",
    ext: ".avif",
    matches: (b) => ascii(b, 4, "ftyp") && (ascii(b, 8, "avif") || ascii(b, 8, "avis")),
  },
];

/** The kind the bytes actually are, or null. */
function sniff(bytes: Uint8Array): Kind | null {
  return KINDS.find((k) => k.matches(bytes)) ?? null;
}

/** The name is reduced to a slug; the extension comes from the sniffed kind. */
function storedName(uploadName: string, kind: Kind): string {
  const base = path
    .basename(uploadName, path.extname(uploadName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${base || "image"}-${Date.now()}${kind.ext}`;
}

/** Behind a proxy (Amplify, CloudFront) the public host arrives as x-forwarded-host, as Next's own check reads it. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  return [request.headers.get("x-forwarded-host"), request.headers.get("host")].includes(host);
}

export async function POST(request: Request) {
  // Server actions get Next's own origin check; a route handler does not. The admin's cookies
  // can be sent by any everestfleet.com page, so only this site's own pages may upload.
  if (!sameOrigin(request)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 415 });
  }

  const name = storedName(file.name, kind);

  if (jarvisAdminEnabled()) {
    const upload = new FormData();
    upload.set("file", new File([bytes], name, { type: kind.mime }));
    const answer = await jarvisAdminForm<{ url: string }>("/website/admin/images", upload);
    const url = answer.body.data?.records?.url;
    if (answer.status !== 201 || !url) {
      console.error("[upload] Jarvis refused the photo", answer.status, answer.body.message);
      return NextResponse.json({ error: "storage_failed" }, { status: 502 });
    }
    return NextResponse.json({ url });
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`site/${name}`, Buffer.from(bytes), { access: "public", contentType: kind.mime });
    return NextResponse.json({ url: blob.url });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);
  return NextResponse.json({ url: `/uploads/${name}` });
}
