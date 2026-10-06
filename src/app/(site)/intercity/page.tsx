import type { Metadata } from "next";
import { ArrowRight, BriefcaseBusiness, Building2, Clock, IndianRupee, Plane, Repeat, Route, ShieldCheck } from "lucide-react";
import { IntercityHero, BookRide } from "@/components/b2b/intercity";
import { Steps } from "@/components/b2b/steps";
import { Features } from "@/components/b2b/features";
import { Commitments } from "@/components/b2b/commitments";
import { Quotes } from "@/components/b2b/quotes";

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
      <Steps
        title="Four Steps From City To City"
        steps={[
          { title: "Choose your route", body: "Pick-up and drop in 370+ places" },
          { title: "Pick a date and time", body: "Leave whenever it suits you" },
          { title: "Add your details", body: "How many are travelling, and how to reach you" },
          { title: "Talk to our experts", body: "We call to confirm your ride" },
        ]}
      />
      <Features
        eyebrow="Our rides"
        title={["Six Ways To", "Ride With Us"]}
        sub="From an airport drop to a trip to another city, all booked the same way."
        items={[
          { icon: Plane, title: "Airport transfers", body: "Stress-free pick-ups and drops" },
          { icon: ArrowRight, title: "One way", body: "Straight to your destination city" },
          { icon: Repeat, title: "Round trip", body: "There and back in one booking" },
          { icon: Route, title: "Multi-way", body: "Several stops on one trip" },
          { icon: Building2, title: "City rides", body: "Anywhere in town, even long distances" },
          { icon: BriefcaseBusiness, title: "Business or leisure", body: "Reliable cabs for work and holidays" },
        ]}
      />
      <Commitments
        items={[
          { icon: ShieldCheck, title: "Safe, the whole way", points: ["Top-tier safety standards", "Comfortable cabs, city to city"] },
          { icon: Clock, title: "On your schedule", points: ["Custom scheduling around your plans", "Seamless links between major cities"] },
          { icon: IndianRupee, title: "Priced fairly", points: ["Affordable, competitive fares", "Reliable service, every trip"] },
        ]}
      />
      <Quotes
        eyebrow="Riders"
        title="The people we already drive"
        quotes={[
          {
            text: "I booked Everest Fleet for a trip from Mumbai to Pune and couldn’t be happier with the service.",
            name: "Priya Singh",
            meta: "Mumbai · Intercity rider",
          },
        ]}
      />
      <BookRide />
    </>
  );
}
