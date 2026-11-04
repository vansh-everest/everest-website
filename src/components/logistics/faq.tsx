import { Minus, Plus } from "lucide-react";
import { FAQS } from "./data";
import { Heading, Wrap } from "./ui";

/** The browser's own accordion: `name` keeps one answer open at a time, and every answer stays in the HTML. */
export function Faq() {
  return (
    <section className="bg-[#f6f9fc] pb-[48px] pt-[47px] lg:pb-[96px] lg:pt-[97px]">
      <Wrap>
        <Heading title="Frequently asked questions" sub="Quick answers before you get in touch." />
        <div className="mx-auto mt-[27px] max-w-[880px] rounded-3xl border border-[#e4e9ef] bg-white px-[18px] py-2 lg:mt-[50px] lg:px-8 lg:py-[9px]">
          {FAQS.map((faq, i) => (
            <details key={faq.q} name="logistics-faq" open={i === 0} className="group border-b border-[#e4e9ef] last:border-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-[21px] text-[17px] font-semibold leading-[22px] text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:py-[23px] [&::-webkit-details-marker]:hidden">
                {faq.q}
                <Plus aria-hidden size={18} strokeWidth={2} className="shrink-0 text-brand group-open:hidden" />
                <Minus aria-hidden size={18} strokeWidth={2} className="hidden shrink-0 text-brand group-open:block" />
              </summary>
              <p className="-mt-2 pb-[19px] text-base leading-[23px] text-ink-soft lg:pb-6 lg:leading-[25px]">{faq.a}</p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
