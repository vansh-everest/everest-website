import type { Metadata } from "next";
import { Car, Cpu, Handshake, Users, Wrench, Zap } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";
import { B2BHero } from "@/components/b2b/hero";
import { Steps } from "@/components/b2b/steps";
import { Features } from "@/components/b2b/features";
import { Enquiry } from "@/components/b2b/enquiry";

/**
 * Everest Intrapreneurship Program: a driver-partner leases cars from Everest Fleet and runs a cab
 * fleet of their own. A first version for the team to review (QC P1): the words are the old site's
 * (its EIP line on Drive With Us and its /franchise/ page), so the figures wait on the EIP owner's
 * brief. Kept out of search and the sitemap until then.
 */
export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Everest Intrapreneurship Program",
  description: "Lease cars from Everest Fleet and run your own cab fleet on Uber, with Everest's cars, hubs and support behind you.",
  alternates: { canonical: "/eip/" },
  robots: { index: false, follow: true },
};

const SUPPORT = [
  { icon: Car, title: "20 Ready Cars", body: "Your fleet on the road from day one" },
  { icon: Zap, title: "Uber Integration", body: "Cars set up to earn on Uber" },
  { icon: Cpu, title: "Technology", body: "Everest Fleet's systems for running cars" },
  { icon: Users, title: "Recruitment", body: "Help finding drivers for your cars" },
  { icon: Wrench, title: "Repair & Maintenance", body: "Serviced through Everest Fleet hubs" },
  { icon: Handshake, title: "Operations Support", body: "A team behind your day-to-day running" },
];

const CITIES = ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata"];

export default function EipPage() {
  return (
    <>
      <B2BHero
        label="Everest Intrapreneurship Program"
        compactTitle
        title={
          <>
            Run Your Own
            <br />
            Cab Fleet
          </>
        }
        primary={{ label: "Apply Now", href: "#enquire" }}
        secondary={{ label: "Call Now", href: PHONE_HREF, phoneIcon: true }}
        media={{ kind: "car", alt: "Everest Fleet sedan" }}
      />
      <Steps
        title="What You Bring"
        steps={[
          { title: "₹5 Lakh To Start", body: "The investment that puts your first cars on the road" },
          { title: "Your Drivers", body: "Recruit and manage the drivers for your cars" },
          { title: "Daily Running", body: "Manage the fleet day to day and keep it earning" },
          { title: "Everest Standards", body: "Run to Everest Fleet's operating and service standards" },
        ]}
      />
      <Features
        eyebrow="What you get"
        title={["Everything A Fleet", "Needs, From", "Day One"]}
        sub="Lease cars from Everest Fleet and grow from one car to many."
        items={SUPPORT}
      />
      <Enquiry
        title="Start Your Fleet"
        source="eip"
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Your full name", autoComplete: "name" },
          { name: "email", label: "Email", type: "email", placeholder: "name@example.com", autoComplete: "email" },
        ]}
        after={[
          { name: "location", label: "City", type: "select", placeholder: "Select your city", options: CITIES },
          { name: "investment", label: "Investment", type: "select", placeholder: "Select an amount", options: ["₹5 lakh", "₹8 lakh", "₹13 lakh"] },
        ]}
        submit="Apply Now"
      />
    </>
  );
}
