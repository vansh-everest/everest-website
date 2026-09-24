import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { safePath } from "@/lib/preview";

export const dynamic = "force-dynamic";

/** Opens a page with the saved draft in place of the live content. Signed-in users only. */
export async function GET(request: Request) {
  if (!(await readSession())) {
    return new Response("Sign in at /admin to preview drafts.", { status: 401 });
  }
  const target = safePath(new URL(request.url).searchParams.get("path"));
  (await draftMode()).enable();
  redirect(target);
}
