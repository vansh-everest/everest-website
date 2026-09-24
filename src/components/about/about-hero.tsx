import Image from "next/image";
import { COMPANY } from "@/lib/company";

export function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy lg:h-[600px]">
      <Image
        src="/figma/about/hero.webp"
        alt="Everest Fleet cars on a Bengaluru road at sunset"
        fill
        preload
        loading="eager"
        sizes="100vw"
        className="-z-10 object-cover object-[71%_center] lg:object-center"
      />
      {/* The photo carries its own navy wash on the left. Narrow screens crop that side away, so they get one here. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,47,80,0.94)_0%,rgba(6,47,80,0.8)_55%,rgba(6,47,80,0.1)_100%)] lg:hidden"
      />
      <div className="px-6 pb-64 pt-12 sm:pb-72 lg:pb-0 lg:pl-[37px] lg:pr-10 lg:pt-[82px]">
        {/* The PNG has transparent padding around the wordmark; the negative margins trim it to the visible mark. */}
        <Image
          src="/figma/logo-white.png"
          alt="Everest"
          width={211}
          height={121}
          className="-mb-[25px] -ml-3 -mt-[18px] h-[85px] w-[148px] lg:-mb-9 lg:-ml-[7px] lg:-mt-[25px] lg:h-[121px] lg:w-[211px]"
        />
        <h1 className="mt-8 max-w-[760px] text-[34px] font-bold leading-[40px] tracking-[-0.5px] text-white lg:mt-[55px] lg:text-[56px] lg:leading-[64px] lg:tracking-normal">
          We don&rsquo;t just move people.
          <br className="hidden sm:block" /> We move them forward.
        </h1>
        <p className="mt-4 max-w-[640px] text-[17px] leading-[26px] text-white/90 lg:mt-[22px] lg:text-xl lg:leading-[30px]">
          India&rsquo;s largest fleet partner. {COMPANY.vehicles} cars, {COMPANY.drivers} drivers, {COMPANY.cities} cities
          built by putting the person behind the wheel first.
        </p>
      </div>
    </section>
  );
}
