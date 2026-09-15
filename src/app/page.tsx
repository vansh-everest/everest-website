import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";
import { Hero } from "@/components/home/hero";
import { HeadlineBand } from "@/components/home/headline-band";
import { StatsBand } from "@/components/home/stats-band";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { CitiesStrip } from "@/components/home/cities-strip";
import { Plans } from "@/components/home/plans";
import { OwnNowBanner } from "@/components/home/own-now-banner";
import { CarShowcase } from "@/components/home/car-showcase";
import { EvBanner } from "@/components/home/ev-banner";
import { FleetApp } from "@/components/home/fleet-app";
import { DostApp } from "@/components/home/dost-app";
import { ApplySteps } from "@/components/home/apply-steps";
import { Testimonials } from "@/components/home/testimonials";
import { SiteFooter } from "@/components/home/site-footer";

export default function Home() {
  return (
    <>
      <TopBar />
      <SiteHeader />
      <main className="overflow-x-clip">
        <Hero />
        <HeadlineBand />
        <StatsBand />
        <WhyChooseUs />
        <CitiesStrip />
        <Plans />
        <OwnNowBanner />
        <CarShowcase />
        <EvBanner />
        <FleetApp />
        <DostApp />
        <ApplySteps />
        <Testimonials />
      </main>
      <SiteFooter />
    </>
  );
}
