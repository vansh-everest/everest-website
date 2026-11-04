import Image, { getImageProps } from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";

/** The photo, then the title and buttons on the blue band. The exports frame the photo differently. */
export function AdHero() {
  const common = { alt: "White Everest cab on a seafront road with a blue Your Brand Here panel across its doors", sizes: "100vw" };
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: "/figma/advertise/hero-desktop.webp", width: 2880, height: 1000 });
  const {
    props: { srcSet: tight, ...img },
  } = getImageProps({ ...common, src: "/figma/advertise/hero-phone.webp", width: 824, height: 500, loading: "eager", fetchPriority: "high" });
  return (
    <section>
      <picture className="relative block aspect-[412/250] bg-navy lg:aspect-[1440/500] lg:max-h-[640px] lg:w-full">
        <source media="(min-width: 1024px)" srcSet={wide} />
        <source srcSet={tight} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img {...img} className="absolute inset-0 size-full object-cover" />
      </picture>
      <div className="relative overflow-hidden bg-blue-gradient px-4 pb-10 pt-3 text-center lg:bg-[linear-gradient(168.8deg,#062f50_0%,#006db8_100%)] lg:pb-[57px] lg:pt-[29px]">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[-27.17%] top-[-27.11%] hidden lg:block">
          <Image src="/figma/wave.svg" alt="" fill className="object-fill" />
        </div>
        {/* The exports title the page differently; only one line shows at a time. */}
        <h1 className="relative text-[30px] font-bold leading-[38px] text-white lg:text-[96px] lg:font-extrabold lg:leading-[115px]">
          <span className="lg:hidden">Advertise With Everest</span>
          <span className="hidden lg:inline">Cab Advertisements</span>
        </h1>
        <div className="relative mt-[23px] flex flex-col gap-[11px] lg:mt-7 lg:flex-row lg:justify-center lg:gap-3">
          <a
            href="#enquire"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-sun text-[17px] font-medium tracking-[0.3px] text-navy transition hover:brightness-95 lg:w-[272px] lg:text-xl lg:tracking-[0.55px]"
          >
            Request a Callback
            <ArrowRight aria-hidden size={20} className="lg:hidden" />
          </a>
          <a
            href={PHONE_HREF}
            className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-white/80 text-[17px] font-medium text-white transition hover:bg-white/10 lg:border-2 lg:border-white lg:px-[30px]"
          >
            <Phone aria-hidden size={20} strokeWidth={1.75} className="hidden lg:block" />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
