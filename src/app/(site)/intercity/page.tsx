import type { Metadata } from "next";
import { IntercityHero } from "@/components/intercity/hero";
import { Stories } from "@/components/intercity/stories";
import { TopRoutes } from "@/components/intercity/top-routes";
import { WhyEverest } from "@/components/intercity/why";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Intercity Cabs",
  description: "Book an intercity cab one way, round trip or multi-way, plus airport transfers and city rides, with pick-up and drop in 370+ places.",
  alternates: { canonical: "/intercity/" },
};

export default function IntercityPage() {
  return (
    <>
      <IntercityHero />
      <WhyEverest />
      <TopRoutes />
      <Stories />
    </>
  );
}
