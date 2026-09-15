const cards = [
  { label: "Industry average", value: "40%", caption: "Asset utilization", tone: "bg-white", labelTone: "border-line text-ink-soft" },
  {
    label: "Everest Fleet standard",
    value: "80%",
    caption: "Setting industry benchmarks",
    tone: "bg-sun",
    labelTone: "border-navy/15 text-navy/70",
  },
];

export function Impact() {
  return (
    <section className="relative overflow-hidden bg-blue-gradient px-6 py-16 lg:h-[560px] lg:px-20 lg:py-0">
      <span aria-hidden className="absolute left-0 top-[220px] hidden h-[120px] w-1 bg-sun lg:block" />
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 lg:h-full lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:w-[540px]">
          <p className="inline-flex h-[34px] items-center rounded-full bg-sun px-4 text-sm font-bold uppercase text-navy">Our journey</p>
          <h2 className="mt-6 font-display text-[40px] font-extrabold leading-[1.1] text-white lg:text-[56px] lg:leading-[62px]">
            From 40% to 80%
            <br />
            Efficiency
          </h2>
          <p className="mt-6 text-xl text-white/90">We doubled what the industry calls &apos;good.&apos;</p>
        </div>
        <div className="relative grid gap-6 sm:grid-cols-2 sm:gap-10">
          {cards.map((card) => (
            <div key={card.label} className={`flex h-[300px] flex-col rounded-[20px] p-8 sm:h-[340px] sm:w-80 ${card.tone}`}>
              <p className={`border-b pb-3 text-sm font-bold uppercase leading-[17px] ${card.labelTone}`}>{card.label}</p>
              <p className="mt-[72px] font-display text-[80px] font-extrabold leading-[80px] text-navy">{card.value}</p>
              <p className="mt-auto text-base leading-[21px] text-navy/80">{card.caption}</p>
            </div>
          ))}
          <span className="absolute left-1/2 top-[138px] hidden size-16 -translate-x-1/2 place-items-center rounded-full border-2 border-white bg-navy font-display text-[22px] font-extrabold text-white sm:grid">
            2×
          </span>
        </div>
      </div>
    </section>
  );
}
