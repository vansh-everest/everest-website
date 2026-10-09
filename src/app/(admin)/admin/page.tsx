import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Gauge, Inbox, LogOut } from "lucide-react";
import { signOutAction } from "@/app/(admin)/admin/actions";
import { Editor } from "@/components/admin/editor";
import { LoginForm } from "@/components/admin/login-form";
import { authConfigured, readSession } from "@/lib/auth";
import { getLiveData } from "@/lib/fleet-data";
import { fleetConnectEnabled, hawkeyeUrl, jarvisAdminEnabled, jarvisSignIn, signInDiagnosis } from "@/lib/jarvis";
import { PREVIEW_PAGES } from "@/lib/preview";
import { getEditorState, listVersions, storeMode } from "@/lib/store";
import { jarvisView } from "./jarvis-view";

export const dynamic = "force-dynamic";

const NOTICES: Record<string, string> = {
  "restore-failed": "That version could not be loaded into the draft.",
  "discard-failed": "The draft could not be discarded.",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ notice?: string; debug?: string }> }) {
  const params = await searchParams;
  const notice = NOTICES[params.notice ?? ""];
  const session = await readSession();

  if (!session && jarvisAdminEnabled()) {
    const { problem } = await jarvisSignIn();
    const diagnosis = params.debug === "1" ? await signInDiagnosis() : null;
    return (
      <div className="grid min-h-screen place-items-center px-4 py-12">
        <div className="w-full max-w-[380px]">
          <Image src="/figma/logo.png" alt="Everest Fleet" width={135} height={78} className="mx-auto h-14 w-auto" />
          <div className="mt-4 rounded-xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(6,47,80,0.05)] sm:p-7">
            <h1 className="text-lg font-bold text-navy">Everest Fleet website admin</h1>
            {problem === "no-access" ? (
              <p className="mt-1 text-[13px] text-ink-soft">Ask a Hawkeye admin for the website-admin role.</p>
            ) : (
              <>
                <p className="mt-1 text-[13px] text-ink-soft">Sign in to Hawkeye, then open this app again.</p>
                <a
                  href={hawkeyeUrl()}
                  className="mt-5 flex h-10 items-center justify-center rounded-lg bg-navy text-sm font-semibold text-white hover:bg-navy/90"
                >
                  Open Hawkeye
                </a>
              </>
            )}
            {diagnosis ? <p className="mt-4 break-words font-mono text-[11px] leading-4 text-ink-soft">{diagnosis}</p> : null}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center px-4 py-12">
        <div className="w-full max-w-[380px]">
          <Image src="/figma/logo.png" alt="Everest Fleet" width={135} height={78} className="mx-auto h-14 w-auto" />
          <div className="mt-4 rounded-xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(6,47,80,0.05)] sm:p-7">
            <h1 className="text-lg font-bold text-navy">Everest Fleet admin</h1>
            <p className="mt-1 text-[13px] text-ink-soft">Sign in to edit plans, cars and pages</p>
            <div className="mt-6">
              <LoginForm configured={authConfigured()} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mode = storeMode();
  // On Jarvis, its figures are shown read only in place of the editable ones.
  const [{ content, hasDraft, live, base }, versions, figures] = await Promise.all([
    getEditorState(),
    listVersions(),
    mode === "jarvis" ? getLiveData() : null,
  ]);
  const jarvis = mode === "jarvis" ? jarvisView(content, figures) : null;

  return (
    <>
      <header className="sticky top-0 z-30 h-14 border-b border-line bg-white">
        <div className="mx-auto flex h-full max-w-[1280px] items-center gap-3 px-4 lg:px-6">
          <Image src="/figma/logo.png" alt="Everest Fleet" width={135} height={78} preload className="h-11 w-auto" />
          <span aria-hidden className="h-6 w-px bg-line" />
          <h1 className="text-[15px] font-bold text-navy">Site content</h1>
          <span className="hidden rounded-md bg-mist px-2 py-0.5 text-xs font-semibold capitalize text-ink-soft sm:inline">{session.role}</span>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link href="/" target="_blank" className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-navy hover:bg-mist">
              <ExternalLink size={14} />
              <span className="hidden sm:inline">View live site</span>
            </Link>
            {/* Signed in through Hawkeye, people sign out there, so this slot holds the leads link. */}
            {fleetConnectEnabled() ? (
              <Link href="/admin/live-data" className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-navy hover:bg-mist">
                <Gauge size={14} />
                <span className="hidden sm:inline">Live data</span>
              </Link>
            ) : null}
            {mode === "jarvis" ? (
              <Link href="/admin/leads" className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-navy hover:bg-mist">
                <Inbox size={14} />
                Leads
              </Link>
            ) : (
              <form action={signOutAction}>
                <button type="submit" className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-ink-soft hover:bg-mist hover:text-navy">
                  <LogOut size={14} />
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      <Editor
        initial={content}
        initialBase={base}
        hasDraft={hasDraft}
        live={{ publishedAt: live.publishedAt, publishedBy: live.publishedBy }}
        versions={versions}
        previewPages={PREVIEW_PAGES}
        role={session.role}
        storeMode={mode}
        notice={notice}
        jarvis={jarvis}
      />
    </>
  );
}
