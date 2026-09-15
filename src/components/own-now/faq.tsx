import { ChevronDown } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";

// Figma shows these collapsed with no answer copy; they expand once answers are supplied.
const faqs = [
  { q: "How much can I earn as an Everest Fleet driver?", accent: "bg-sun", toggle: "bg-[#fdfae2] text-[#c9b000]" },
  { q: "Do I need to pay a deposit to start?", accent: "bg-brand", toggle: "bg-[#e0edf6] text-brand" },
  { q: "What documents do I need to apply?", accent: "bg-lime", toggle: "bg-[#f6fae6] text-[#8fae1b]" },
  { q: "Can I really own the car? How does Drive to Own work?", accent: "bg-plum", toggle: "bg-[#f3e8f2] text-plum" },
  { q: "Which cities is Everest Fleet available in?", accent: "bg-navy", toggle: "bg-[#e1e6ea] text-navy" },
  { q: "Is vehicle maintenance and insurance covered?", accent: "bg-brand", toggle: "bg-[#e0edf6] text-brand" },
];

export function Faq() {
  return (
    <section className="bg-fog px-6 py-24">
      <div className="text-center">
        <p className="inline-flex h-[27px] items-center rounded-full bg-[#e7e4c5] px-3.5 text-xs font-bold uppercase tracking-[1px] text-[#6f6419]">
          ❓ FAQs
        </p>
        <h2 className="mt-4 text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[77px]">
          Questions? We&apos;ve got answers.
        </h2>
        <p className="mt-2.5 text-lg leading-[22px] text-ink-soft">
          Everything you need to know before you start driving with Everest Fleet.
        </p>
      </div>
      <ul className="mx-auto mt-12 max-w-[840px] space-y-3.5">
        {faqs.map((faq) => (
          <li key={faq.q} className="flex min-h-[78px] overflow-hidden rounded-xl bg-white">
            <span aria-hidden className={`w-1.5 shrink-0 ${faq.accent}`} />
            <div className="flex flex-1 items-center justify-between gap-4 py-4 pl-6 pr-[22px]">
              <p className="text-lg font-semibold leading-6 text-navy lg:text-xl">{faq.q}</p>
              <span aria-hidden className={`grid size-[34px] shrink-0 place-items-center rounded-full ${faq.toggle}`}>
                <ChevronDown size={18} strokeWidth={2.5} />
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-10 flex max-w-[840px] flex-col gap-4 rounded-2xl bg-[#073153] px-[26px] py-6 sm:flex-row sm:items-center sm:justify-between lg:h-[98px] lg:py-0">
        <div>
          <p className="text-lg font-bold leading-[22px] text-white">Still have questions?</p>
          <p className="mt-1 text-[13px] leading-[17px] text-white/70">Our team is one message away — we usually reply within minutes.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={WHATSAPP_HREF} className="flex h-[46px] items-center rounded-full bg-whatsapp px-6 text-sm font-bold text-white">
            💬 WhatsApp Us
          </a>
          <a href={PHONE_HREF} className="flex h-[46px] items-center rounded-full bg-sun px-6 text-sm font-bold text-navy">
            📞 {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
