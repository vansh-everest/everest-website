const values = [
  {
    name: "Empathetic",
    title: "Doctor on Call for you & your family.",
    body: "We believe a healthy driver is an empowered driver. Your wellbeing — and your family's — is our responsibility.",
  },
  {
    name: "Empowering",
    title: "Direct bank transfer every week.",
    body: "Your earnings are yours, on time, every time. No delays, no middlemen — just your money in your account.",
  },
  {
    name: "Rigorous",
    title: "100% service & repairs covered.",
    body: "We obsess over every detail so your vehicle never lets you down. From routine service to major repairs, we've got it covered.",
  },
];

const circles = ["bg-sun", "bg-[#aca82b]", "bg-[#667a43]"];

export function Values() {
  return (
    <section className="grid lg:min-h-[800px] lg:grid-cols-[480px_1fr]">
      <div className="relative bg-[#0a3d62] px-6 py-16 lg:px-20 lg:pb-0 lg:pt-20">
        <p className="inline-flex h-[31px] items-center rounded-full bg-sun px-4 text-[13px] font-bold uppercase text-navy">Our culture</p>
        <h2 className="mt-10 text-5xl font-light leading-[1.05] text-white lg:text-[64px] lg:leading-[62px]">
          What
          <br />
          Drives Us
        </h2>
        <p className="mt-6 max-w-80 text-lg leading-[29px] text-white/80">
          Our EVERT values aren&apos;t just words — they&apos;re the promises we keep every day for 50,000+ drivers across India.
        </p>
        <div aria-hidden className="mt-12 flex lg:absolute lg:left-20 lg:top-[575px] lg:mt-0">
          {circles.map((tone, i) => (
            <span key={tone} className={`size-16 rounded-full border-2 border-white/80 ${tone} ${i ? "-ml-3" : ""}`} />
          ))}
        </div>
      </div>
      <ol className="space-y-10 bg-[#f8f9fa] px-6 py-16 lg:px-20 lg:py-20">
        {values.map((value, i) => (
          <li key={value.name} className="flex flex-col gap-4 border-l-4 border-sun py-8 pl-6 sm:flex-row sm:gap-8 sm:pl-8">
            <div className="sm:w-40 sm:shrink-0">
              <p className="inline-flex h-[23px] items-center rounded bg-navy px-3 text-xs font-bold uppercase text-white">Value {i + 1}</p>
              <p className="mt-3 text-lg font-bold leading-[22px] text-navy">{value.name}</p>
            </div>
            <div>
              <p className="text-2xl leading-[34px] text-navy lg:text-[30px]">{value.title}</p>
              <p className="mt-2 text-base leading-6 text-ink-soft">{value.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
