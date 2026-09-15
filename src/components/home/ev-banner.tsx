import Image from "next/image";
import { CheckItem, SunButton } from "./ui";

export function EvBanner() {
  return (
    <section className="bg-sun p-3">
      <div className="grid overflow-hidden rounded-[20px] bg-[linear-gradient(160deg,#062f50_0%,#064a7c_100%)] lg:h-[336px] lg:grid-cols-[1fr_660px]">
        <div className="relative px-6 pb-10 pt-20 lg:pb-0 lg:pl-[108px] lg:pt-[50px]">
          <Image
            src="/figma/logo-white.png"
            alt="Everest"
            width={99}
            height={57}
            className="absolute left-4 top-3 h-[57px] w-[99px] object-cover"
          />
          <h2 className="text-[32px] font-bold leading-tight text-white lg:text-[50px] lg:leading-[60px]">
            Powering India&apos;s
            <br />
            <span className="text-sun">Electric</span> Car Revolution
          </h2>
          <ul className="mt-[17px] flex flex-wrap gap-x-5 gap-y-2 text-[13px] leading-5 text-white/80">
            <CheckItem>₹0 fuel cost</CheckItem>
            <CheckItem>Charging support included</CheckItem>
            <CheckItem>₹40,000+ monthly</CheckItem>
          </ul>
          <SunButton href="#plans" className="mt-[23px]">
            Know more
          </SunButton>
        </div>
        <div className="relative aspect-[660/336] lg:aspect-auto">
          <Image
            src="/figma/ev-banner.jpg"
            alt="White Everest electric sedan at a charging station"
            fill
            sizes="(min-width: 1024px) 660px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
