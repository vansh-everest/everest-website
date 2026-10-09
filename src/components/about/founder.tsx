import Image from "next/image";

const FOUNDER = { name: "Siddharth Ladsariya", title: "Founder & CEO" };

/** About us: the founder's photo and letter under its own heading. */
export function Founder() {
  return (
    <section className="bg-mist px-4 pb-12 pt-12 sm:px-6 sm:py-16 lg:bg-fog lg:px-10 lg:pb-20 lg:pt-[72px]">
      <h2 className="text-center text-[26px] font-bold leading-8 text-navy sm:text-[32px] sm:leading-tight sm:tracking-[-0.5px] lg:text-[44px] lg:leading-[52px]">
        Meet Our <span className="text-brand">Founder</span>
      </h2>
      <FounderStory className="mt-7 sm:mt-10 lg:mt-14" />
    </section>
  );
}

/**
 * The founder's photo and letter, also shown on the investors page in place of a team list. `short` keeps
 * the opening, the belief and the thanks; `flush` lines the photo up with the page column instead of
 * centring the block.
 */
export function FounderStory({ className = "", short = false, flush = false }: { className?: string; short?: boolean; flush?: boolean }) {
  return (
    <div className={`grid gap-6 sm:gap-10 lg:grid-cols-[340px_1fr] lg:gap-14 ${flush ? "" : "mx-auto max-w-[1040px]"} ${className}`}>
      <figure className={`relative w-full max-w-[240px] self-start sm:max-w-[340px] ${flush ? "mx-auto lg:mx-0" : "mx-auto"}`}>
        <span
          aria-hidden
          className="absolute -right-3 -top-3 hidden size-[90px] bg-[#d0dbe5] [clip-path:polygon(0_0,100%_0,100%_100%)] sm:block"
        />
        <div className="relative aspect-[280/340] overflow-hidden rounded-2xl shadow-[0_16px_40px_-12px_rgba(6,47,80,0.3)] sm:aspect-[480/580] sm:rounded-3xl">
          <Image
            src="/figma/about/founder.webp"
            alt={`${FOUNDER.name}, ${FOUNDER.title} of Everest Fleet`}
            fill
            sizes="(min-width: 640px) 340px, 240px"
            className="object-cover"
          />
        </div>
        {/* Phones: a card under the photo. From sm: a tag overlapping the photo's bottom edge. */}
        <figcaption className="relative mt-5 overflow-hidden rounded-xl border-l-4 border-sun bg-white py-2.5 pl-4 pr-4 shadow-[0_8px_24px_rgba(6,47,80,0.14)] sm:absolute sm:-bottom-5 sm:left-5 sm:mt-0 sm:rounded-2xl sm:border-l-0 sm:py-3 sm:pl-[22px] sm:pr-5 sm:shadow-[0_12px_32px_rgba(6,47,80,0.18)]">
          <span aria-hidden className="absolute bottom-2.5 left-0 top-2.5 hidden w-1 bg-sun sm:block" />
          <span className="block text-[15px] font-bold leading-5 text-navy sm:text-base sm:leading-6">{FOUNDER.name}</span>
          <span className="mt-0.5 block text-[13px] leading-[18px] text-brand sm:text-[13px]">{FOUNDER.title}, Everest Fleet</span>
        </figcaption>
      </figure>
      <div className="lg:max-w-[620px]">
        <p className="text-lg font-bold leading-7 tracking-[-0.3px] text-navy sm:text-[22px] sm:leading-[30px] lg:text-[26px] lg:leading-[34px]">
          Our Journey Has Always Been About More Than Cars.
          <br /> It Has Always Been About People.
        </p>
        <div className="mt-4 space-y-3 text-sm leading-[22px] text-ink-soft sm:mt-5 sm:text-[15px] sm:leading-[25px]">
          <p>
            When we started Everest Fleet, we wanted to create something that gave drivers a reliable way to earn, grow
            and build a better future for their families.
          </p>
          <p>
            Over the years, Everest has grown in size, in cities and in the number of drivers who are part of our journey.
            But what has stayed the same is our belief that{" "}
            <strong className="font-semibold text-navy">
              every driver deserves respect, opportunity and a chance to move forward.
            </strong>
          </p>
          {short ? null : (
            <>
              <p>
                I have seen many drivers begin their journey with us with a simple goal &mdash; to earn more for their
                families. Some have gone on to build their savings, some have moved towards owning their own cars, and
                many have simply created a more secure life for the people who depend on them.
              </p>
              <p>These are the stories that make Everest what it is today.</p>
              <p>We still have a long way to go. And I hope we continue to grow together, one journey at a time.</p>
            </>
          )}
          <p className="font-semibold text-navy">Thank you for trusting Everest and being a part of our journey.</p>
        </div>
        <p className="mt-6 hidden lg:block">
          <span className="block text-[15px] font-bold leading-6 text-navy">{FOUNDER.name}</span>
          <span className="mt-0.5 block text-[13px] leading-5 text-gray-400">{FOUNDER.title}, Everest Fleet</span>
        </p>
      </div>
    </div>
  );
}
