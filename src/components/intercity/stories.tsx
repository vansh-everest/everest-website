const QUOTE = {
  text: "I booked Everest Fleet for a trip from Mumbai to Pune and couldn’t be happier with the service.",
  name: "Priya Singh",
  initials: "PS",
  meta: "Mumbai · Intercity rider",
};

/** The design's story card, once: the site has one real rider quote so far. */
export function Stories() {
  return (
    <section className="bg-[#f6f9fc] px-5 pb-[58px] pt-[42px] lg:px-6 lg:pb-24 lg:pt-[44px]">
      <h2 className="mx-auto max-w-[372px] text-center text-[28px] font-bold leading-9 text-navy lg:max-w-none lg:text-[40px] lg:leading-[48px]">
        Stories From Our Happy Customers
      </h2>
      <p className="mt-[18px] text-center text-[15px] leading-6 text-ink-soft lg:mt-3 lg:text-lg lg:leading-7">Real trips, in our riders’ own words.</p>
      <figure className="mx-auto mt-[22px] max-w-[420px] rounded-3xl bg-white px-12 py-11 lg:mt-[60px] lg:py-12">
        <blockquote className="text-xl font-medium leading-7 text-navy">{QUOTE.text}</blockquote>
        <figcaption className="mt-[27px] flex items-center gap-4">
          <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e8f2fa] text-base font-bold text-brand">
            {QUOTE.initials}
          </span>
          <span>
            <span className="block text-lg font-bold leading-6 text-navy">{QUOTE.name}</span>
            <span className="block text-sm leading-5 text-ink-soft">{QUOTE.meta}</span>
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
