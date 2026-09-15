import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <SiteHeader />
      <main className="overflow-x-clip">{children}</main>
    </>
  );
}
