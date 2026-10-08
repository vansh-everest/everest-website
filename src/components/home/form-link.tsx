"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";

/** The id of the driver lead form a page ends with (StartDriving, the driver and Dost pages). */
export const FORM_ID = "apply";

const subscribeNothing = () => () => {};
const formHere = () => document.getElementById(FORM_ID) !== null;
const notKnown = () => false;

/**
 * A link to the lead form: the one on this page when it has one, otherwise the home page's.
 * Which page is open is known only in the browser, so the server renders the home form's address
 * and the link switches once the page is in place.
 */
export function FormLink({
  home,
  className,
  onClick,
  children,
}: {
  home: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  // Reading the path re-renders the link on every navigation, so the check below sees the new page.
  usePathname();
  const here = useSyncExternalStore(subscribeNothing, formHere, notKnown);
  return (
    <Link href={here ? `#${FORM_ID}` : `${home}#${FORM_ID}`} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
