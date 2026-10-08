import Image from "next/image";
import { COMPANY } from "@/lib/company";

export function AboutHero() {
  return (
    <section className="relative isolate overflow-clip bg-navy lg:h-[600px]">
      <div className="fx-scroll-exit absolute inset-0 -z-10">
        <Image
          src="/figma/about/hero.webp"
          alt="Everest Fleet cars on a Bengaluru road at sunset"
          fill
          preload
          loading="eager"
          sizes="100vw"
          className="object-cover object-[52%_center] sm:object-[71%_center] lg:object-center"
        />
      </div>
      {/* The photo carries its own navy wash on the left. Narrow screens crop that side away, so they get one here:
          a left-edge wash on phones, where the text is short enough to sit over the photo, and a top-down one from sm. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#062f50_0%,rgba(6,47,80,0.75)_4%,rgba(6,47,80,0.45)_13%,rgba(6,47,80,0.25)_25%,rgba(6,47,80,0.1)_42%,rgba(6,47,80,0)_52%)] sm:bg-[linear-gradient(180deg,rgba(6,47,80,0.94)_0%,rgba(6,47,80,0.8)_55%,rgba(6,47,80,0.1)_100%)] lg:hidden"
      />
      <div className="px-4 pb-6 pt-[35px] sm:px-6 sm:pb-72 sm:pt-12 lg:pb-0 lg:pl-[37px] lg:pr-10 lg:pt-[82px]">
        {/* The PNG has transparent padding around the wordmark; the negative margins trim it to the visible mark. */}
        <Image
          src="/figma/logo-white.png"
          alt="Everest"
          width={211}
          height={121}
          className="-mb-[21px] -ml-2.5 -mt-[15px] h-[73px] w-[128px] sm:-mb-[25px] sm:-ml-3 sm:-mt-[18px] sm:h-[85px] sm:w-[148px] lg:-mb-9 lg:-ml-[7px] lg:-mt-[25px] lg:h-[121px] lg:w-[211px]"
        />
        <h1 className="mt-8 max-w-[960px] text-[26px] font-bold leading-[31px] tracking-[-1px] text-white sm:text-[34px] sm:leading-[40px] sm:tracking-[-0.5px] lg:mt-[55px] lg:text-[56px] lg:leading-[64px] lg:tracking-normal">
          Your Journey.
          <br /> Our Support.
          <br /> Together, We Move Forward.
        </h1>
        {/* Phones set the line in a frosted pill over the photo. */}
        <p className="mt-3 max-w-[640px] rounded-[15px] border border-white/40 bg-white/15 px-2.5 py-1 text-xs leading-[15px] text-white backdrop-blur-sm sm:mt-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:text-[17px] sm:leading-[26px] sm:text-white/90 sm:backdrop-blur-none lg:mt-[22px] lg:text-xl lg:leading-[30px]">
          India&rsquo;s Largest Fleet. {COMPANY.vehicles} cars, {COMPANY.drivers} drivers, {COMPANY.cities} cities.
        </p>
      </div>
    </section>
  );
}
