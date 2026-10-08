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
          { title: "Choose Your Route", body: "Pick-up and drop in 370+ places" },
          { title: "Pick A Date And Time", body: "Leave whenever it suits you" },
          { title: "Add Your Details", body: "How many are travelling, and how to reach you" },
          { title: "Talk To Our Experts", body: "We call to confirm your ride" },
        ]}
      />
      <Features
        eyebrow="Our rides"
        title={["Six Ways To", "Ride With Us"]}
        sub="From an airport drop to a trip to another city, all booked the same way."
        items={[
          { icon: Plane, title: "Airport Transfers", body: "Stress-free pick-ups and drops" },
          { icon: ArrowRight, title: "One Way", body: "Straight to your destination city" },
          { icon: Repeat, title: "Round Trip", body: "There and back in one booking" },
          { icon: Route, title: "Multi-Way", body: "Several stops on one trip" },
          { icon: Building2, title: "City Rides", body: "Anywhere in town, even long distances" },
          { icon: BriefcaseBusiness, title: "Business Or Leisure", body: "Reliable cabs for work and holidays" },
        ]}
      />
      <Commitments
        items={[
          { icon: ShieldCheck, title: "Safe, The Whole Way", points: ["Top-Tier Safety Standards", "Comfortable Cabs, City To City"] },
          { icon: Clock, title: "On Your Schedule", points: ["Custom Scheduling Around Your Plans", "Seamless Links Between Major Cities"] },
          { icon: IndianRupee, title: "Priced Fairly", points: ["Affordable, Competitive Fares", "Reliable Service, Every Trip"] },
        ]}
      />
      <Quotes
        eyebrow="Riders"
        title="The People We Already Drive"
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
