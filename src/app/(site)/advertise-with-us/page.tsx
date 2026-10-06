import type { Metadata } from "next";
import { Armchair, CarFront, Eye, Gift, IndianRupee, Layers, MapPin } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";
import { COMPANY } from "@/lib/company";
import { B2BHero } from "@/components/b2b/hero";
import { Steps } from "@/components/b2b/steps";
import { Features } from "@/components/b2b/features";
import { FigureBand, ReachNumbers } from "@/components/b2b/figures";
import { Commitments } from "@/components/b2b/commitments";
import { LogoWall, type Logo } from "@/components/b2b/logo-wall";
import { Enquiry } from "@/components/b2b/enquiry";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Advertise With Us",
  description: `Cab advertising across ${COMPANY.vehicles} cabs in ${COMPANY.cities} cities: in-cab branding, cab branding and in-cab sampling, with photo proof of every placement.`,
  alternates: { canonical: "/advertise-with-us/" },
};

const BRANDS: Logo[] = [
  { file: "aakash", name: "Aakash BYJU'S", w: 130, h: 99 },
  { file: "maac", name: "MAAC", w: 159, h: 53 },
  { file: "prince", name: "Prince Piping Systems", w: 171, h: 38 },
  { file: "weikfield", name: "Weikfield", w: 135, h: 50 },
  { file: "ikea", name: "IKEA", w: 156, h: 56 },
  { file: "bank-of-baroda", name: "Bank of Baroda", w: 165, h: 45 },
  { file: "idfc-first", name: "IDFC FIRST Bank", w: 162, h: 60 },
  { file: "amfi", name: "AMFI", w: 74, h: 76 },
  { file: "gomechanic", name: "GoMechanic", w: 173, h: 38 },
  { file: "onsitego", name: "Onsitego", w: 141, h: 40 },
  { file: "netflix", name: "Netflix", w: 158, h: 46 },
  { file: "incredible-india", name: "Incredible India", w: 138, h: 36 },
  { file: "gujarat-tourism", name: "Gujarat Tourism", w: 168, h: 59 },
  { file: "garnier", name: "Garnier", w: 160, h: 46 },
  { file: "himalaya", name: "Himalaya", w: 152, h: 56 },
  { file: "lakme", name: "Lakmé", w: 152, h: 38 },
  { file: "mobil", name: "Mobil", w: 149, h: 48 },
  { file: "gulf", name: "Gulf", w: 111, h: 100 },
  { file: "puneri-paltan", name: "Puneri Paltan", w: 85, h: 100 },
  { file: "leverage-edu", name: "Leverage Edu", w: 130, h: 67 },
];

export default function AdvertiseWithUsPage() {
  return (
    <>
      <B2BHero
        label="Advertise With Us"
        title={
          <>
            Put Your Brand On
            <br />
            {COMPANY.vehicles} Moving Cabs
          </>
        }
        primary={{ label: "Request a callback", href: "#enquire" }}
        secondary={{ label: "Call Now", href: PHONE_HREF, phoneIcon: true }}
        media={{ kind: "brand-car", alt: "White Everest sedan with the door panel marked for a brand" }}
      />
      <Steps
        title="Four Steps From Brief To Street"
        steps={[
          { title: "Share your brief", body: "Your audience, cities and campaign dates" },
          { title: "We pick the cabs", body: "The right cars in the right cities" },
          { title: "Your ads go live", body: "Inside the cab, outside it, or both" },
          { title: "See the proof", body: "AI-verified photos of every placement" },
        ]}
      />
      <Features
        eyebrow="Ad formats"
        title={["Four Ways", "To Get Seen"]}
        sub="Every format rides on cabs already on the road, every day."
        items={[
          { icon: Armchair, title: "In-cab branding", body: "In front of riders for the whole ride" },
          { icon: CarFront, title: "Cab branding", body: "On the outside, at eye level, citywide" },
          { icon: Gift, title: "In-cab sampling", body: "Your product, in riders’ hands" },
          { icon: Layers, title: "Mix and match", body: "Combine formats in one campaign" },
        ]}
      />
      <FigureBand eyebrow="The reach" title={`${COMPANY.vehicles} cars, 3 Crore Impressions A Day`} />
      <ReachNumbers
        eyebrow="By the numbers"
        stats={[
          { value: COMPANY.vehicles, label: "Cars in motion" },
          { value: "1,50,000 km", label: "Driven every day" },
          { value: "3,00,00,000", label: "Street impressions a day" },
          { value: "3,00,000", label: "In-cab impressions" },
          { value: "10–20 paise", label: "Cost per impression" },
          { value: String(COMPANY.cities), label: "Cities covered" },
        ]}
        note="Riding with your brand every day: millennials and Gen Z, corporate employees and homemakers."
      />
      <Commitments
        items={[
          { icon: Eye, title: "It gets seen", points: ["Guaranteed impressions", "Enhanced visibility, at eye level"] },
          { icon: MapPin, title: "It meets your buyers", points: ["Close to your customers, every day", "Wider reach, city after city"] },
          { icon: IndianRupee, title: "More reach per rupee", points: ["Cost-effective outdoor media", "Premium, innovative, always moving"] },
        ]}
      />
      <LogoWall eyebrow="Clients" title="The brands we already carry" size="wall" logos={BRANDS} />
      <Enquiry
        title="Tell us about your brand"
        source="advertise-with-us"
        submit="Request a callback"
        choice={{ legend: "Are you a brand or an agency?", name: "client_type", options: ["Brand", "Agency"] }}
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Your full name", autoComplete: "name" },
          { name: "company", label: "Company name", type: "text", placeholder: "Your company name", autoComplete: "organization" },
          { name: "role", label: "Designation", type: "text", placeholder: "Your designation", autoComplete: "organization-title" },
          { name: "email", label: "Email", type: "email", placeholder: "name@company.com", autoComplete: "email" },
        ]}
      />
    </>
  );
}
