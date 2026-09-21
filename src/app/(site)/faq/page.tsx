import type { Metadata } from "next";
import Link from "next/link";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";
import { SITE_URL } from "@/lib/company";
import { jsonLd } from "@/lib/json-ld";

/**
 * The answers are the ones already given on the driver pages, so a person reading either
 * is told the same thing. Anything an operations team has not signed, such as a rent or a
 * deposit figure, is deliberately answered as "confirmed at the hub" rather than guessed.
 */
const faqs: { q: string; a: string }[] = [
  {
    q: "Do I need my own car?",
    a: "No. Everest Fleet provides the car, the commercial permit and the insurance. You bring a valid driving licence and your documents.",
  },
  {
    q: "What deposit is required?",
    a: "A refundable deposit, and the amount depends on the city and the plan you choose. The exact figure is confirmed at the hub before you take a car.",
  },
  {
    q: "What documents do I need to apply?",
    a: "An Aadhaar card, a PAN card, a driving licence and proof of address. Bring the originals to the hub.",
  },
  {
    q: "Do I need a commercial licence?",
    a: "A valid driving licence is required. The hub will tell you whether your city also needs a commercial endorsement, because that varies by state.",
  },
  {
    q: "When am I paid?",
    a: "Every week, directly to your bank account. There is no cash handling and no monthly cycle to wait for.",
  },
  {
    q: "Who pays for fuel?",
    a: "Fuel or charging is paid by the driver. Insurance, servicing and repairs are covered by Everest Fleet.",
  },
  {
    q: "Can I really own the car?",
    a: "Yes. The Own Now plan transfers ownership to you at the end of the term, and Drive to Own does the same through monthly instalments.",
  },
  {
    q: "Which cities is Everest Fleet available in?",
    a: "Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune and Kolkata.",
  },
  {
    q: "Is maintenance and insurance covered?",
    a: "Yes. Servicing, repairs and insurance are handled by Everest Fleet for the length of the term.",
  },
  {
    q: "How do I start?",
    a: "Apply online with your name, mobile number and city, or walk into the hub in your city. We call you back to arrange the paperwork.",
  },
];

export const metadata: Metadata = {
  title: "Driver questions answered",
  description:
    "What you need to drive with Everest Fleet: documents, deposit, payouts, ownership and the cities we operate in.",
  alternates: { canonical: "/faq/" },
};

export default function Page() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${SITE_URL}/faq/`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />

      <section className="bg-blue-gradient px-6 pb-16 pt-14 text-white">
        <div className="mx-auto max-w-[840px]">
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-sun">FAQs</p>
          <h1 className="mt-3 text-[34px] font-bold leading-tight tracking-[-0.5px] lg:text-[56px] lg:leading-[1.05]">
            Questions drivers ask
          </h1>
          <p className="mt-3 max-w-[60ch] text-base leading-7 text-white/85">
            Everything worth knowing before you start driving with us.
          </p>
        </div>
      </section>

      <section className="bg-fog px-6 py-16">
        <ul className="mx-auto max-w-[840px] space-y-3">
          {faqs.map((faq) => (
            <li key={faq.q} className="overflow-hidden rounded-xl bg-white">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-4 px-6 py-5">
                  <span className="flex-1 text-lg font-semibold leading-7 text-navy">{faq.q}</span>
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-mist text-navy transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-6 pb-5 text-base leading-7 text-ink-soft">{faq.a}</p>
              </details>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-12 max-w-[840px] rounded-2xl bg-navy px-8 py-10 text-center text-white">
          <h2 className="text-2xl font-bold lg:text-[32px]">Still have a question?</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={PHONE_HREF} className="flex h-12 items-center rounded-full bg-sun px-7 text-sm font-bold text-navy">
              Call {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_HREF}
              className="flex h-12 items-center rounded-full bg-whatsapp px-7 text-sm font-bold text-white"
            >
              WhatsApp
            </a>
            <Link
              href="/drive-with-us"
              className="flex h-12 items-center rounded-full border border-white/30 px-7 text-sm font-bold text-white"
            >
              Drive with us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
