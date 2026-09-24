import Link from "next/link";
import { signOutAction } from "@/app/(admin)/admin/actions";
import { Editor } from "@/components/admin/editor";
import { LoginForm } from "@/components/admin/login-form";
import { authConfigured, readSession } from "@/lib/auth";
import { PREVIEW_PAGES } from "@/lib/preview";
import { getEditorState, listVersions, storeMode } from "@/lib/store";

export const dynamic = "force-dynamic";

const wrap = "mx-auto w-full max-w-[1040px] px-5";

const NOTICES: Record<string, string> = {
  "restore-failed": "That version could not be loaded into the draft.",
  "discard-failed": "The draft could not be discarded.",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const notice = NOTICES[(await searchParams).notice ?? ""];
  const session = await readSession();

  if (!session) {
    return (
      <div className={`${wrap} grid min-h-screen place-items-center py-12`}>
        <div className="w-full max-w-[380px] rounded-2xl border border-line bg-white p-7">
          <h1 className="text-xl font-bold text-navy">Everest Fleet admin</h1>
          <div className="mt-6">
            <LoginForm configured={authConfigured()} />
          </div>
        </div>
      </div>
    );
  }

  const mode = storeMode();
  const [{ content, hasDraft, live }, versions] = await Promise.all([getEditorState(), listVersions()]);

  return (
    <div className={`${wrap} py-8`}>
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold text-navy">Site content</h1>
        <span className="rounded-full bg-white px-3 py-1 text-[12px] font-bold uppercase tracking-[0.6px] text-ink-soft">
          {session.role}
        </span>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/" className="text-[13px] font-bold text-brand">
            View live site
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="text-[13px] font-bold text-ink-soft">
              Sign out
            </button>
          </form>
        </div>
      </header>

      {notice ? (
        <p className="mt-4 rounded-xl border border-[#b3261e]/30 bg-white px-4 py-3 text-[13px] text-[#b3261e]">{notice}</p>
      ) : null}

      {mode === "readonly" ? (
        <p className="mt-4 rounded-xl border border-line bg-white px-4 py-3 text-[13px] text-ink-soft">
          Saving is off: no content store is connected to this deployment.
        </p>
      ) : null}

      <div className="mt-2">
        <Editor
          initial={content}
          hasDraft={hasDraft}
          live={{ publishedAt: live.publishedAt, publishedBy: live.publishedBy }}
          versions={versions}
          previewPages={PREVIEW_PAGES}
          role={session.role}
          storeMode={mode}
        />
      </div>
    </div>
  );
}
