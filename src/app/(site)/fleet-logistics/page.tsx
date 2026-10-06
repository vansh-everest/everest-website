import type { Metadata } from "next";
import { Croissant, Leaf, Milk, ShieldCheck, Clock, Snowflake, Sparkle, Store, Thermometer } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";
import { B2BHero } from "@/components/b2b/hero";
import { Steps } from "@/components/b2b/steps";
import { Features } from "@/components/b2b/features";
import { FigureBand, FleetMix } from "@/components/b2b/figures";
import { Commitments } from "@/components/b2b/commitments";
import { Quotes } from "@/components/b2b/quotes";
import { Enquiry } from "@/components/b2b/enquiry";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Fleet Logistics",
  description:
    "Chilled, frozen and ambient delivery vans for cloud kitchens, dairy, produce and bakeries in Mumbai and Bengaluru, tracked live on every trip.",
  alternates: { canonical: "/fleet-logistics/" },
};

const LOADS = [
  { icon: Store, title: "Cloud kitchens & QSRs", body: "Multi-outlet chains and delivery-only kitchens" },
  { icon: Milk, title: "Milk and dairy", body: "Chilled from your dock to their counter" },
  { icon: Leaf, title: "Fresh produce", body: "Fruit and veg that lose value by the hour" },
  { icon: Snowflake, title: "Frozen goods", body: "Held below freezing the entire way" },
  { icon: Croissant, title: "Bakery & confectionery", body: "Fragile loads, and it shows if you rush them" },
  { icon: Thermometer, title: "Temperature-sensitive", body: "Anything with a range it must not leave" },
];

export default function FleetLogisticsPage() {
  return (
    <>
      <B2BHero
        label="Fleet Logistics"
        compactTitle
        title={
          <>
            Preserving Freshness &amp;
            <br />
            Delivering Perfection
          </>
        }
        primary={{ label: "Get started", href: "#enquire" }}
        secondary={{ label: "Call Now", href: PHONE_HREF, phoneIcon: true }}
        media={{
          kind: "photo",
          desktop: "/figma/b2b/fleet-hero.webp",
          phone: "/figma/b2b/fleet-hero-phone.webp",
          alt: "Everest Logistics refrigerated truck with shelves of fresh fruit and vegetables",
        }}
      />
      <Steps
        title="Four Steps From Your Door To Theirs"
        steps={[
          { title: "Tell us your route", body: "Pick-up, drop, temperature and the time it has to land" },
          { title: "We assign the van", body: "Ambient, chilled, frozen or air-conditioned — whichever the load needs" },
          { title: "Track the whole trip", body: "Live location from the moment it leaves you" },
          { title: "Delivered, with proof", body: "A real-time notification the moment it is handed over" },
        ]}
      />
      <Features
        eyebrow="What we carry"
        title={["Six Loads We", "Already Run Every", "Day"]}
        sub="Not a list of what we could take on. These are the routes running across Mumbai and Bengaluru this week."
        items={LOADS}
      />
      <FigureBand eyebrow="The fleet" title="242 Vehicles, Four Temperature Ranges" eyebrowLeft compact />
      <FleetMix
        eyebrow="What the 242 are made of"
        rows={[
          { label: "Ambient 4-wheeler", count: 197 },
          { label: "Refrigerated van", count: 22 },
          { label: "EV 3-wheeler", count: 19, tone: "lime" },
          { label: "Air-conditioned van", count: 4 },
        ]}
        note="The 19 EV three-wheelers run last-mile drops — zero tailpipe emissions inside city limits."
      />
      <Commitments
        items={[
          {
            icon: Clock,
            title: "It arrives when we said",
            points: ["Timely delivery, route by route", "Live tracking on every trip", "A real-time alert the moment it drops"],
          },
          {
            icon: ShieldCheck,
            title: "Someone is accountable",
            points: ["A named account manager, not a queue", "Strict quality checks at every handover"],
          },
          {
            icon: Sparkle,
            title: "It reflects well on you",
            points: ["Your branding on the van, if you want it", "EV three-wheelers on last-mile drops"],
          },
        ]}
      />
      <Quotes
        eyebrow="Clients"
        title="The People We Already Deliver For"
        quotes={[
          {
            text: "Your commitment to excellence and dedication to meeting our needs have consistently exceeded our expectations.",
            name: "NOTO Healthy Ice-creams",
            meta: "Valued Partner since 2024 · Cold-Chain Delivery",
            avatar: "/figma/b2b/noto.webp",
          },
        ]}
      />
      <Enquiry
        title="Tell Us What You Move"
        source="fleet-logistics"
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Your full name", autoComplete: "name" },
          { name: "company", label: "Company", type: "text", placeholder: "Your company name", autoComplete: "organization" },
          { name: "email", label: "Email", type: "email", placeholder: "name@company.com", autoComplete: "email" },
        ]}
        after={[
          { name: "cargo", label: "What you move", type: "select", placeholder: "Select a cargo type", options: LOADS.map((l) => l.title) },
        ]}
      />
    </>
  );
}
