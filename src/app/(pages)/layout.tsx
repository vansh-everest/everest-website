import { PageNav } from "@/components/site/page-nav";

// Inner pages use the "Nav Bar — Redesign" header from Figma.
export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageNav />
      <main className="overflow-x-clip">{children}</main>
    </>
  );
}
