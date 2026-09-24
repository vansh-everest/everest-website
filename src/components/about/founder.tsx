import Image from "next/image";
import { COMPANY } from "@/lib/company";

const FOUNDER = { name: "Siddharth Ladsariya", title: "Founder & CEO" };

export function Founder() {
  return (
    <section className="bg-fog px-6 py-20 lg:px-10 lg:pb-32 lg:pt-[100px]">
      <h2 className="text-center text-[36px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[70px] lg:tracking-normal">
        Meet Our <span className="text-brand">Founder</span>
      </h2>
      <div className="mx-auto mt-14 grid max-w-[1184px] gap-16 lg:mt-[98px] lg:grid-cols-[480px_1fr] lg:gap-20">
        <figure className="relative mx-auto w-full max-w-[480px]">
          <span
            aria-hidden
            className="absolute -right-4 -top-4 size-[120px] bg-[#d0dbe5] [clip-path:polygon(0_0,100%_0,100%_100%)]"
          />
          <div className="relative aspect-[480/580] overflow-hidden rounded-3xl shadow-[0_24px_60px_-12px_rgba(6,47,80,0.3)]">
            <Image
              src="/figma/about/founder.webp"
              alt={`${FOUNDER.name}, ${FOUNDER.title} of Everest Fleet`}
              fill
              sizes="(min-width: 528px) 480px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="absolute -bottom-6 left-6 overflow-hidden rounded-[20px] bg-white py-4 pl-[26px] pr-6 shadow-[0_12px_32px_rgba(6,47,80,0.18)]">
            <span aria-hidden className="absolute bottom-3 left-0 top-3 w-1 bg-sun" />
            <span className="block text-lg font-bold leading-6 text-navy">{FOUNDER.name}</span>
            <span className="mt-[5px] block text-sm leading-5 text-brand">{FOUNDER.title}, Everest Fleet</span>
          </figcaption>
        </figure>
        <div className="lg:max-w-[592px] lg:pt-[49px]">
          <p className="text-[26px] font-bold leading-[34px] tracking-[-0.3px] text-navy lg:text-[32px] lg:leading-[42px]">
            We don&rsquo;t just put drivers on the road.
            <br className="hidden sm:block" /> We put families ahead.
          </p>
          <div className="mt-6 space-y-4 text-base leading-[27px] text-ink-soft">
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
          <p className="mt-8 pl-4">
            <span className="block text-base font-bold leading-6 text-navy">{FOUNDER.name}</span>
            <span className="mt-0.5 block text-sm leading-5 text-gray-400">{FOUNDER.title}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
