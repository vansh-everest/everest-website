import Image from "next/image";
import { CheckItem, SunButton } from "./ui";

export function OwnNowBanner() {
  return (
    <section className="border-t-[12px] border-sun bg-[linear-gradient(90deg,#063f6c_0%,#006db8_100%)]">
      <div className="grid lg:h-[348px] lg:grid-cols-[770px_1fr]">
        <div className="relative aspect-[770/348] lg:aspect-auto">
          <Image
            src="/figma/own-now-banner.jpg"
            alt="Smiling driver at the wheel of an Everest car"
            fill
            sizes="(min-width: 1024px) 770px, 100vw"
            className="object-cover object-left"
          />
        </div>
        <div className="px-6 py-10 lg:pl-[41px] lg:pr-0 lg:pt-8">
          <h2 className="text-[34px] font-bold leading-tight text-white lg:text-[48px] lg:leading-[60px]">
            Introducing <span className="text-sun">Own Now</span>
            <br />
            by Everest
          </h2>
          <p className="mt-[22px] text-xl font-semibold leading-[29px] text-white lg:text-2xl">Now become owner of your own car</p>
          <div className="mt-2 flex flex-wrap items-end gap-x-[92px] gap-y-6">
            <ul className="space-y-2 text-base leading-5 text-white">
              <CheckItem>Without loan</CheckItem>
              <CheckItem>Without CIBIL score</CheckItem>
              <CheckItem>With small deposit</CheckItem>
            </ul>
            <SunButton href="#plans">Know more</SunButton>
          </div>
        </div>
      </div>
    </section>
  );
}
