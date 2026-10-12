import type { Metadata } from "next";
import { PROSE } from "./prose";

export type LegalDoc = { slug: string; title: string; modified: string; description: string; html: string };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const updated = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
};

/** The legal pages carried over word for word from the old site, at their old addresses. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="bg-white px-4 pb-16 pt-10 sm:px-6 lg:pb-24 lg:pt-16">
      <div className="mx-auto max-w-[820px]">
        <h1 className="text-[30px] font-bold leading-9 tracking-[-0.3px] text-navy lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.5px]">
          {doc.title}
        </h1>
        <p className="mt-3 text-[13px] leading-5 text-ink-soft lg:text-[15px]">Last updated {updated(doc.modified)}</p>
        <div className={`mt-8 ${PROSE}`} dangerouslySetInnerHTML={{ __html: doc.html }} />
      </div>
    </article>
  );
}

export function legalMetadata(doc: LegalDoc): Metadata {
  return { title: doc.title, description: doc.description, alternates: { canonical: `/${doc.slug}/` } };
}
