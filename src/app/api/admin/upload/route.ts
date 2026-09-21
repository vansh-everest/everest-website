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
 */

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"]);
const MAX_BYTES = 8 * 1024 * 1024;

function safeName(name: string): string {
  const ext = path.extname(name).toLowerCase().slice(0, 8) || ".jpg";
  const base = path.basename(name, path.extname(name)).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48);
  return `${base || "image"}-${Date.now()}${ext}`;
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
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  const name = safeName(file.name);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`site/${name}`, file, { access: "public", contentType: file.type });
    return NextResponse.json({ url: blob.url });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${name}` });
}
