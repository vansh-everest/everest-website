import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Image upload for the admin.
 *
 * Vercel Blob when a token is present, otherwise public/uploads for local development.
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

export async function POST(request: Request) {
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
