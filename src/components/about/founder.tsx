import Image from "next/image";
import { COMPANY } from "@/lib/company";

const FOUNDER = { name: "Siddharth Ladsariya", title: "Founder & CEO" };

export function Founder() {
  return (
    <section className="bg-mist px-4 pb-[57px] pt-[55px] sm:px-6 sm:py-20 lg:bg-fog lg:px-10 lg:pb-32 lg:pt-[100px]">
      <h2 className="text-center text-[28px] font-bold leading-[34px] text-navy sm:text-[36px] sm:leading-tight sm:tracking-[-0.5px] lg:text-[64px] lg:leading-[70px] lg:tracking-normal">
        Meet Our <span className="text-brand">Founder</span>
      </h2>
      <div className="mx-auto mt-7 grid max-w-[1184px] gap-6 sm:mt-14 sm:gap-16 lg:mt-[98px] lg:grid-cols-[480px_1fr] lg:gap-20">
        <figure className="relative mx-auto w-full max-w-[280px] sm:max-w-[480px]">
          <span
            aria-hidden
            className="absolute -right-4 -top-4 hidden size-[120px] bg-[#d0dbe5] [clip-path:polygon(0_0,100%_0,100%_100%)] sm:block"
          />
          <div className="relative aspect-[280/340] overflow-hidden rounded-2xl shadow-[0_16px_40px_-12px_rgba(6,47,80,0.3)] sm:aspect-[480/580] sm:rounded-3xl sm:shadow-[0_24px_60px_-12px_rgba(6,47,80,0.3)]">
            <Image
              src="/figma/about/founder.webp"
              alt={`${FOUNDER.name}, ${FOUNDER.title} of Everest Fleet`}
              fill
              sizes="(min-width: 640px) 480px, 280px"
              className="object-cover"
            />
          </div>
          {/* Phones: a card under the photo. From sm: a tag overlapping the photo's bottom edge. */}
          <figcaption className="relative mt-6 overflow-hidden rounded-xl border-l-4 border-sun bg-white py-[11px] pl-4 pr-4 shadow-[0_8px_24px_rgba(6,47,80,0.14)] sm:absolute sm:-bottom-6 sm:left-6 sm:mt-0 sm:rounded-[20px] sm:border-l-0 sm:py-4 sm:pl-[26px] sm:pr-6 sm:shadow-[0_12px_32px_rgba(6,47,80,0.18)]">
            <span aria-hidden className="absolute bottom-3 left-0 top-3 hidden w-1 bg-sun sm:block" />
            <span className="block text-[15px] font-bold leading-5 text-navy sm:text-lg sm:leading-6">{FOUNDER.name}</span>
            <span className="mt-0.5 block text-[13px] leading-[18px] text-brand sm:mt-[5px] sm:text-sm sm:leading-5">
              {FOUNDER.title}, Everest Fleet
            </span>
          </figcaption>
        </figure>
        <div className="lg:max-w-[600px] lg:pt-[49px]">
          <p className="text-xl font-bold leading-7 tracking-[-0.3px] text-navy sm:text-[26px] sm:leading-[34px] lg:text-[32px] lg:leading-[42px]">
            We don&rsquo;t just put drivers on the road.
            <br /> We put families ahead.
          </p>
          <div className="mt-4 space-y-3 text-sm leading-[22px] text-ink-soft sm:mt-6 sm:space-y-4 sm:text-base sm:leading-[27px]">
            <p>
              When we started Everest Fleet, we made one promise that every driver who joins us would earn with dignity
              and grow with security. Today, with {COMPANY.drivers} drivers across {COMPANY.cities} cities, that promise is
              stronger than ever.
            </p>
            <p>
              Behind every car is a family counting on it. That&rsquo;s why we built more than a fleet. We built a community
              that supports you, from your first trip to owning your own vehicle.
            </p>
            <p>This is just the beginning. Thank you for driving the journey with us.</p>
          </div>
          <p className="mt-8 hidden pl-4 lg:block">
            <span className="block text-base font-bold leading-6 text-navy">{FOUNDER.name}</span>
            <span className="mt-0.5 block text-sm leading-5 text-gray-400">{FOUNDER.title}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
