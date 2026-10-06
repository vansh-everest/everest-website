import Image from "next/image";
import { getContent } from "@/lib/store";
import { PHONE_HREF } from "@/components/home/ui";
import { IntercityBooking } from "./intercity-booking";
import { Eyebrow, HeroActions, HeroLabel, HeroTitle } from "./ui";

const ALT = "A family sitting in the open boot of their car on a road trip at sunset";

/** Intercity hero: the booking strip sits over the photo on a desktop and under it on a phone. */
export async function IntercityHero() {
  const cities = (await getContent()).cities.map((c) => ({ slug: c.slug, name: c.name.en }));
  return (
    <section className="relative isolate bg-navy lg:h-[600px] lg:overflow-hidden">
      <Image
        src="/figma/b2b/intercity-hero.webp"
        alt={ALT}
        fill
        preload
        loading="eager"
        sizes="100vw"
        className="-z-10 hidden object-cover lg:block"
      />
      <div className="relative aspect-[412/206] lg:hidden">
        <Image src="/figma/b2b/intercity-hero-phone.webp" alt={ALT} fill preload loading="eager" sizes="100vw" className="object-cover" />
      </div>
      <div className="bg-[linear-gradient(180deg,#08345b_0%,#021831_100%)] px-4 pb-[38px] pt-[9px] lg:bg-none lg:px-[42px] lg:pb-0 lg:pt-16 xl:pt-[136px]">
        <HeroLabel>Intercity</HeroLabel>
        <HeroTitle>
          City to City,
          <br />
          One Way Or Round Trip
        </HeroTitle>
        <div className="mt-3 lg:absolute lg:inset-x-[42px] lg:bottom-10 lg:mt-0">
          <IntercityBooking cities={cities} />
        </div>
      </div>
    </section>
  );
}

/** The closing "Book a ride" band: back up to the booking strip, or call. */
export function BookRide() {
  return (
    <section className="bg-[linear-gradient(160deg,#062f50_0%,#0a4378_100%)] px-4 pb-[45px] pt-11 text-center lg:px-6 lg:pb-[72px] lg:pt-[76px]">
      <Eyebrow tone="white" bars className="justify-center">
        Book a ride
      </Eyebrow>
      <h2 className="mx-auto mt-[11px] max-w-[300px] text-[28px] font-bold leading-[34px] tracking-[-0.4px] text-white lg:mt-[7px] lg:max-w-none lg:text-[42px] lg:leading-[50px] lg:tracking-normal">
        Discover new paths for your intercity rides
      </h2>
      <HeroActions
        primary={{ label: "Book now", href: "#book" }}
        secondary={{ label: "Call Now", href: PHONE_HREF, phoneIcon: true }}
        arrow
        className="mt-3 lg:mt-[33px] lg:justify-center"
      />
    </section>
  );
}
