import type { Metadata } from "next";
import { CarFront, Clock, Leaf, RefreshCw, ShieldCheck, Smartphone, Smile, UserCheck, Users } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";
import { COMPANY } from "@/lib/company";
import { B2BHero } from "@/components/b2b/hero";
import { Steps } from "@/components/b2b/steps";
import { Features } from "@/components/b2b/features";
import { Commitments } from "@/components/b2b/commitments";
import { LogoWall } from "@/components/b2b/logo-wall";
import { Enquiry } from "@/components/b2b/enquiry";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Employee Mobility",
  description: `Electric office cabs with certified drivers, route planning, backup cabs and full compliance, across ${COMPANY.cities} metro cities.`,
  alternates: { canonical: "/employee-mobility/" },
};

export default function EmployeeMobilityPage() {
  return (
    <>
      <B2BHero
        label="Employee Mobility"
        title={
          <>
            Your Office Commute,
            <br />
            Electric And On Time
          </>
        }
        primary={{ label: "Get a quote", href: "#enquire" }}
        secondary={{ label: "Talk to our team", href: PHONE_HREF }}
        size="md"
        media={{ kind: "car", alt: "White Everest electric sedan" }}
      />
      <Steps
        title="Four steps from door to desk"
        steps={[
          { title: "Share your shifts", body: "Office address, shift timings and where your team lives" },
          { title: "We plan the routes", body: "A cab and a certified driver for every shift" },
          { title: "Your team rides", body: "Picked up from home, dropped at the office" },
          { title: "At work, on time", body: "Every shift, without you chasing anyone" },
        ]}
      />
      <Features
        eyebrow="What’s included"
        title={["One contract,", "six things handled"]}
        sub={`Car, driver, tech and support from one partner, across ${COMPANY.cities} metro cities.`}
        items={[
          { icon: CarFront, title: "Electric cabs", body: "Ready for tomorrow’s emission rules" },
          { icon: UserCheck, title: "Certified drivers", body: "Trained and certified, every shift" },
          { icon: Smartphone, title: "Smart technology", body: "Full transparency on every trip" },
          { icon: Users, title: "An operations team", body: "One connected fleet, run for you" },
          { icon: RefreshCw, title: "Backup cabs", body: "Ready if a cab breaks down" },
          { icon: ShieldCheck, title: "Full compliance", body: "100% compliant with every regulation" },
        ]}
      />
      <Commitments
        tone="mist"
        items={[
          {
            icon: Clock,
            title: "They arrive on time",
            points: ["High reliability, every shift", "Live tracking on every ride", "A hassle-free daily commute"],
          },
          {
            icon: Smile,
            title: "They ride in comfort",
            points: ["Odour-free, hygienic cabs", "Dedicated support, not a queue", "Happier, more satisfied teams"],
          },
          {
            icon: Leaf,
            title: "Less cost, less carbon",
            points: ["Real savings on commute costs", "Pricing that fuel can’t move", "A smaller carbon footprint"],
          },
        ]}
      />
      <LogoWall
        eyebrow="Clients"
        title="The teams we already move"
        size="large"
        logos={[
          { file: "tcs", name: "Tata Consultancy Services", w: 168, h: 49 },
          { file: "indigo", name: "IndiGo", w: 174, h: 57 },
          { file: "sutherland", name: "Sutherland", w: 197, h: 74 },
          { file: "bank-of-america", name: "Bank of America", w: 151, h: 84 },
        ]}
      />
      <Enquiry
        title="Tell us about your team"
        source="employee-mobility"
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Your full name", autoComplete: "name" },
          { name: "company", label: "Company", type: "text", placeholder: "Your company name", autoComplete: "organization" },
          { name: "role", label: "Job title", type: "text", placeholder: "Your role", autoComplete: "organization-title" },
          { name: "email", label: "Email", type: "email", placeholder: "name@company.com", autoComplete: "email" },
        ]}
      />
    </>
  );
}
