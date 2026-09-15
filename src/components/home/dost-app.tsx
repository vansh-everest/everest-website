import Image from "next/image";
import { GooglePlayButton } from "./ui";

export function DostApp() {
  return (
    <section id="dost">
      <div className="bg-[linear-gradient(90deg,#062f50_0%,#054e84_100%)] px-6 py-10 text-center lg:flex lg:h-[173px] lg:items-center lg:justify-center lg:py-0">
        <h2 className="text-[34px] font-bold leading-tight tracking-[-0.5px] text-white lg:text-[64px] lg:leading-[77px]">
          Introducing <span className="text-sun">Everest Dost</span> App
        </h2>
      </div>
      <div className="relative overflow-hidden bg-[#e9ecef] pb-10 lg:h-[752px] lg:pb-0">
        {/* The band render is laid out on the 1440 frame, so it stays 1440 wide and centred on desktop. */}
        <div className="relative lg:absolute lg:left-1/2 lg:top-0 lg:h-full lg:w-[1440px] lg:-translate-x-1/2">
          <div className="relative h-[420px] lg:absolute lg:inset-0 lg:h-auto">
            <Image
              src="/figma/dost-band.jpg"
              alt="Everest Dost partner checking the app on his phone beside a car"
              fill
              sizes="(min-width: 1024px) 1440px, 100vw"
              className="object-cover object-right lg:object-center"
            />
          </div>
          <div className="relative mx-4 -mt-24 rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(6,47,80,0.15)] lg:absolute lg:left-[268px] lg:top-[168.5px] lg:m-0 lg:h-[430px] lg:w-[546px]">
            <h3 className="text-[28px] font-bold leading-9 text-navy lg:text-[40px] lg:leading-[48px]">
              Not Behind The Wheel? You Can Still Drive The Change.
            </h3>
            <p className="mt-6 inline-flex items-center gap-1 rounded-full bg-[#f6e9f5] px-4 py-2 text-sm font-semibold text-plum">
              Earn <span className="text-lg font-bold">₹3,000</span> per signed driver
            </p>
            <p className="mt-6 max-w-[420px] text-base leading-7 text-ink-soft">
              Download our driver app for free to track your earnings, monitor your Drive-to-Own progress, and reach
              support anytime, anywhere.
            </p>
            <div className="mt-2 flex flex-wrap gap-[18px]">
              <GooglePlayButton className="!h-12" />
              <a
                href="#apply"
                className="flex h-12 w-[174px] items-center justify-center rounded-full bg-sun text-[15px] font-semibold text-navy"
              >
                Know more
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
