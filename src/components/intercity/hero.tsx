import Image, { getImageProps } from "next/image";
import { getContent } from "@/lib/store";
import { BookingCard } from "./booking-card";

const ALT = "A family with suitcases walking to a white car while the driver loads a bag into the boot";

/**
 * Intercity hero. A desktop lays the title and the booking card over the photo, on the right; a
 * phone sets the photo first, then both on the blue panel. Past 1440px the photo grows with the
 * window, so the cards' right margin grows with it and they stay over the same part of the photo.
 */
export async function IntercityHero() {
  const cities = (await getContent()).cities.map((c) => ({ slug: c.slug, name: c.name.en }));
  const common = { alt: ALT, sizes: "100vw" };
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: "/figma/intercity/hero.webp", width: 2880, height: 1600 });
  const {
    props: { srcSet: tight, ...img },
  } = getImageProps({ ...common, src: "/figma/intercity/hero-phone.webp", width: 1648, height: 880, loading: "eager", fetchPriority: "high" });
  return (
    <section className="relative isolate overflow-hidden lg:min-h-[800px] lg:pb-10 lg:pt-[65px]">
      <picture className="relative block aspect-[412/220] lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto">
        <source media="(min-width: 1024px)" srcSet={wide} />
        <source srcSet={tight} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img {...img} className="absolute inset-0 size-full object-cover lg:object-left-top" />
      </picture>
      <div className="relative isolate overflow-hidden bg-blue-gradient px-5 pb-8 pt-7 lg:overflow-visible lg:bg-none lg:p-0">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[88px] -z-10 ml-[-604px] h-[400px] w-[1256px] opacity-60 lg:hidden">
          <Image src="/figma/wave.svg" alt="" fill className="object-fill" />
        </div>
        <div className="mx-auto max-w-[560px] lg:ml-auto lg:mr-[2.64vw] lg:w-[752px] lg:max-w-none">
          <div className="text-center lg:rounded-3xl lg:bg-white lg:px-4 lg:pb-[17px] lg:pt-[17px]">
            <h1 className="text-[36px] font-bold leading-10 text-white lg:text-[64px] lg:leading-[76px] lg:text-navy">Everest Intercity Rides</h1>
            <p className="mt-3 text-base leading-6 text-white lg:mt-1 lg:text-[22px] lg:leading-8 lg:text-navy">City to City, One Way Or Round Trip</p>
          </div>
          <div className="mt-6">
            <BookingCard cities={cities} />
          </div>
        </div>
      </div>
    </section>
  );
}
