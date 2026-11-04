import Image from "next/image";
import { CLIENTS, QUOTES } from "./data";
import { SwipeRow } from "./swipe-row";
import { Heading, Wrap } from "./ui";

export function Clients() {
  return (
    <section className="bg-[#f6f9fc] pb-12 pt-[47px] lg:pb-[96px] lg:pt-[97px]">
      <Wrap>
        <Heading title="Our Clients" sub="Named partners we deliver for." />
        <SwipeRow label="Client logos" className="mt-6 lg:mt-[50px]" track="-mx-4 flex gap-3 px-4 scroll-px-4 lg:mx-0 lg:gap-4 lg:px-0">
          {CLIENTS.map((client) => (
            <div key={client.name} className="grid h-[76px] w-[156px] shrink-0 snap-start place-items-center rounded-2xl border border-[#e4e9ef] bg-white px-4 lg:h-24 lg:w-[200px] lg:px-5">
              <Image src={client.logo} alt={client.name} width={client.w} height={client.h} className="h-auto max-h-[52px] w-auto max-w-full object-contain lg:max-h-14" />
            </div>
          ))}
        </SwipeRow>
      </Wrap>
    </section>
  );
}

export function ClientQuotes() {
  const single = QUOTES.length === 1;
  return (
    <section className="bg-white pb-12 pt-[47px] lg:pb-[96px] lg:pt-[97px]">
      <Wrap>
        <Heading title="What Our Clients Say" />
        <SwipeRow
          label="Client testimonials"
          arrows
          className="mt-6 lg:mt-10"
          track={`-mx-4 flex gap-3 px-4 scroll-px-4 lg:mx-0 lg:gap-6 lg:px-0 ${single ? "justify-center" : ""}`}
        >
          {QUOTES.map((quote) => (
            <figure key={quote.name} className={`flex shrink-0 snap-start flex-col rounded-3xl border border-[#e4e9ef] bg-white p-[23px] lg:p-7 ${single ? "w-full lg:w-[560px]" : "w-[292px] lg:w-[352px]"}`}>
              <svg aria-hidden viewBox="0 0 22 16" className="h-4 w-[22px] fill-sun">
                <path d="M0 16V9.5C0 4.6 2.6 1.2 7.6 0l1.2 2.3C6 3.2 4.9 5 4.9 7.4h3.9V16zM12.6 16V9.5c0-4.9 2.6-8.3 7.6-9.5l1.2 2.3c-2.8.9-3.9 2.7-3.9 5.1h3.9V16z" />
              </svg>
              <blockquote className="mt-[18px] flex-1 text-[17px] leading-[25px] text-navy lg:text-base">{quote.text}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-[#eaf4fc] text-[15px] font-bold text-brand">
                  {quote.initials}
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-bold leading-[22px] text-navy">{quote.name}</span>
                  <span className="block text-sm leading-5 text-ink-soft">{quote.meta}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </SwipeRow>
      </Wrap>
    </section>
  );
}
