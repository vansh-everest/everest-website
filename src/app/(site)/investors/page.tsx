import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY, COMPANY_BLURB } from "@/lib/company";

export const metadata: Metadata = {
  title: "For investors",
  description: COMPANY_BLURB,
  alternates: { canonical: "/investors/" },
};

/**
 * Deliberately thin. It carries only figures that already appear elsewhere on the site
 * and a way to get in touch, because anything else would be a claim nobody has signed.
 */
const figures = [
  { value: COMPANY.vehicles, label: "Vehicles owned" },
  { value: COMPANY.drivers, label: "Drivers on the road" },
  { value: String(COMPANY.cities), label: "Cities" },
  { value: String(COMPANY.founded), label: "Operating since" },
];

export default function Page() {
  return (
    <>
      <section className="bg-blue-gradient px-6 pb-16 pt-14 text-white">
        <div className="mx-auto max-w-[900px]">
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-sun">For investors</p>
          <h1 className="mt-3 text-[34px] font-bold leading-tight tracking-[-0.5px] lg:text-[56px] lg:leading-[1.05]">
            India&rsquo;s largest fleet management company
          </h1>
          <p className="mt-4 max-w-[62ch] text-base leading-7 text-white/85">{COMPANY_BLURB}</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-[900px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {figures.map((f) => (
            <div key={f.label} className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[32px] font-bold leading-none text-navy">{f.value}</p>
              <p className="mt-2 text-sm text-ink-soft">{f.label}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-[900px] text-xs text-ink-soft">
          Figures as of {COMPANY.asOf}.
        </p>

        <div className="mx-auto mt-12 max-w-[900px] rounded-2xl bg-mist px-8 py-10">
          <h2 className="text-2xl font-bold text-navy">Get in touch</h2>
          <p className="mt-2 max-w-[56ch] text-base leading-7 text-ink-soft">
            Write to us for the investor deck and current operating numbers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:hello@everestfleet.com?subject=Investor%20enquiry"
              className="flex h-12 items-center rounded-full bg-navy px-7 text-sm font-bold text-white"
            >
              hello@everestfleet.com
            </a>
            <Link
              href="/about-us"
              className="flex h-12 items-center rounded-full border border-line px-7 text-sm font-bold text-navy"
            >
              About the company
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
