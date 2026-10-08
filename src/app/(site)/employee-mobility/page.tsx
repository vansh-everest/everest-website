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
        primary={{ label: "Get A Quote", href: "#enquire" }}
        secondary={{ label: "Talk To Our Team", href: PHONE_HREF }}
        size="md"
        media={{ kind: "car", alt: "White Everest electric sedan" }}
      />
      <Steps
        title="Four Steps From Door To Desk"
        steps={[
          { title: "Share Your Shifts", body: "Office address, shift timings and where your team lives" },
          { title: "We Plan The Routes", body: "A cab and a certified driver for every shift" },
          { title: "Your Team Rides", body: "Picked up from home, dropped at the office" },
          { title: "At Work, On Time", body: "Every shift, without you chasing anyone" },
        ]}
      />
      <Features
        eyebrow="What’s included"
        title={["One Contract,", "Six Things Handled"]}
        sub={`Car, driver, tech and support from one partner, across ${COMPANY.cities} metro cities.`}
        items={[
          { icon: CarFront, title: "Electric Cabs", body: "Ready for tomorrow’s emission rules" },
          { icon: UserCheck, title: "Certified Drivers", body: "Trained and certified, every shift" },
          { icon: Smartphone, title: "Smart Technology", body: "Full transparency on every trip" },
          { icon: Users, title: "An Operations Team", body: "One connected fleet, run for you" },
          { icon: RefreshCw, title: "Backup Cabs", body: "Ready if a cab breaks down" },
          { icon: ShieldCheck, title: "Full Compliance", body: "100% compliant with every regulation" },
        ]}
      />
      <Commitments
        tone="mist"
        items={[
          {
            icon: Clock,
            title: "They Arrive On Time",
            points: ["High Reliability, Every Shift", "Live Tracking On Every Ride", "A Hassle-Free Daily Commute"],
          },
          {
            icon: Smile,
            title: "They Ride In Comfort",
            points: ["Odour-Free, Hygienic Cabs", "Dedicated Support, Not A Queue", "Happier, More Satisfied Teams"],
          },
          {
            icon: Leaf,
            title: "Less Cost, Less Carbon",
            points: ["Real Savings On Commute Costs", "Pricing That Fuel Can’t Move", "A Smaller Carbon Footprint"],
          },
        ]}
      />
      <LogoWall
        eyebrow="Clients"
        title="The Teams We Already Move"
        size="large"
        logos={[
          { file: "tcs", name: "Tata Consultancy Services", w: 168, h: 49 },
          { file: "indigo", name: "IndiGo", w: 174, h: 57 },
          { file: "sutherland", name: "Sutherland", w: 197, h: 74 },
          { file: "bank-of-america", name: "Bank of America", w: 151, h: 84 },
        ]}
      />
      <Enquiry
        title="Tell Us About Your Team"
        source="employee-mobility"
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Your full name", autoComplete: "name" },
          { name: "company", label: "Company", type: "text", placeholder: "Your company name", autoComplete: "organization" },
          { name: "role", label: "Job Title", type: "text", placeholder: "Your role", autoComplete: "organization-title" },
          { name: "email", label: "Email", type: "email", placeholder: "name@company.com", autoComplete: "email" },
        ]}
      />
    </>
  );
}
