import { draftMode } from "next/headers";
import { PreviewBar } from "./preview-bar";

/** Shown only to someone who opened a draft preview from the admin. */
export async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  return isEnabled ? <PreviewBar /> : null;
}
