import Image from "next/image";
import { PHONE_HREF, WHATSAPP_HREF } from "./ui";

export function HeadlineBand() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(168.8deg,#062f50_0%,#006db8_100%)] px-4 pb-12 pt-[33px] text-center">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[-27.17%] top-[-27.11%]">
        <Image src="/figma/wave.svg" alt="" fill loading="eager" className="object-fill" />
      </div>
      <h1 className="relative text-[40px] font-extrabold uppercase leading-[1.21] tracking-[-0.28px] text-white sm:text-[64px] lg:text-[96px]">
        Drive, Earn <span className="text-sun">and Own.</span>
      </h1>
      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-5">
        <a
          href="#apply"
          className="flex h-14 w-[251px] items-center justify-center rounded-full bg-sun text-sm font-medium tracking-[-0.15px] text-navy transition hover:brightness-95"
        >
          Join as Driver
        </a>
        <a
          href={PHONE_HREF}
          className="flex h-14 items-center gap-2 rounded-full border-[1.5px] border-line bg-white px-[31.5px] text-[15px] font-medium tracking-[-0.23px] text-navy"
        >
          <Image src="/figma/icon-phone.svg" alt="" width={18} height={18} />
          Call Now
        </a>
        <a
          href={WHATSAPP_HREF}
          className="flex h-[52px] items-center gap-2 rounded-full bg-whatsapp px-[22px] text-sm font-bold tracking-[-0.15px] text-white"
        >
          <Image src="/figma/icon-whatsapp.svg" alt="" width={18} height={18} />
          WhatsApp
        </a>
      </div>
    </section>
  );
}
