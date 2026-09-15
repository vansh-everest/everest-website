import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";

export function OwnHero() {
  return (
    <section className="relative bg-white lg:h-[623px] lg:overflow-hidden">
      <div className="relative h-[280px] sm:h-[380px] lg:absolute lg:inset-0 lg:h-auto">
        <Image
          src="/figma/own-hero.jpg"
          alt="Everest driver holding up the keys to his car"
          fill
          preload
          loading="eager"
          sizes="100vw"
          className="object-cover object-[75%_center] lg:object-center"
        />
      </div>
      <div className="relative px-6 py-10 lg:absolute lg:left-[89px] lg:top-[80px] lg:p-0">
        <p className="inline-flex h-[31px] items-center rounded-full bg-navy px-3.5 text-[15px] font-bold uppercase tracking-[0.5px] text-white">
          Own Now plan
        </p>
        <h1 className="mt-[22px] text-[40px] font-bold leading-[1.1] tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[69px]">
          The Easiest Way to
          <br />
          <span className="text-brand">Own a Car</span>
        </h1>
        <div className="mt-[22px]">
          <p className="text-xs font-semibold uppercase leading-[15px] tracking-[0.5px] text-ink-soft">Starting at</p>
          <p className="flex items-baseline gap-1">
            <span className="text-[44px] font-extrabold leading-[48px] text-navy">₹650</span>
            <span className="text-base text-ink-soft">/day</span>
          </p>
        </div>
        <div className="mt-[22px] flex flex-wrap gap-3.5">
          <Link href="#calculator" className="flex h-[49px] items-center gap-2 rounded-full bg-sun px-7 text-base font-semibold text-navy">
            Calculate Plan
            <ArrowRight size={18} />
          </Link>
          <a
            href={PHONE_HREF}
            className="flex h-[49px] items-center gap-2 rounded-full border-[1.5px] border-navy px-[26px] text-base font-semibold text-navy"
          >
            <Phone size={18} />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
