import Image from "next/image";
import { Phone } from "@phosphor-icons/react/ssr";
import { PHONE_HREF } from "./ui";

export function HeadlineBand() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(168.8deg,#062f50_0%,#006db8_100%)] px-4 pb-6 pt-5 text-center lg:pb-[46px] lg:pt-[33px]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[-27.17%] top-[-27.11%]">
        <Image src="/figma/wave.svg" alt="" fill loading="eager" className="object-fill" />
      </div>
      <h1 className="relative text-[26px] font-extrabold uppercase leading-[1.21] tracking-[-0.013em] text-white sm:text-[48px] md:text-[60px] lg:text-[80px] xl:text-[96px]">
        Drive, Earn <span className="text-sun">and Own.</span>
      </h1>
      <div className="relative mt-6 flex flex-wrap items-center justify-center gap-[5px] lg:mt-[34px] lg:gap-5">
        <a
          href="#apply"
          className="flex h-9 items-center justify-center rounded-full bg-sun px-4 text-[13px] font-medium tracking-[0.4px] text-navy transition hover:brightness-95 lg:h-14 lg:w-[251px] lg:px-0 lg:text-xl lg:font-semibold lg:tracking-[-0.2px]"
        >
          Join as Driver
        </a>
        <a
          href={PHONE_HREF}
          className="flex h-9 items-center gap-1.5 rounded-full border-2 border-white px-4 text-[13px] font-medium tracking-[0.4px] text-white transition hover:bg-white/10 lg:h-14 lg:gap-2.5 lg:border-[1.5px] lg:border-line lg:bg-white lg:px-8 lg:text-xl lg:font-semibold lg:tracking-[-0.2px] lg:text-navy lg:hover:bg-white lg:hover:brightness-95"
        >
          <Phone aria-hidden className="size-4 lg:size-[22px]" />
          Call Now
        </a>
      </div>
    </section>
  );
}
