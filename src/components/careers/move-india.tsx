import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { JOBS_URL } from "./data";
import { Ribbon } from "./ribbon";

const ALT = "Rows of white Everest Fleet cars parked in front of a city skyline";

function ExploreJobs({ className }: { className: string }) {
  return (
    <a
      href={JOBS_URL}
      target="_blank"
      rel="noopener"
      className={`items-center justify-center gap-[11px] rounded-full bg-sun font-bold text-navy shadow-[0_10px_24px_rgba(6,47,80,0.22)] transition-[filter] hover:brightness-95 ${className}`}
    >
      Explore Jobs
      <ExternalLink className="size-[18px] lg:size-5" strokeWidth={2.25} />
    </a>
  );
}

export function MoveIndia() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy px-4 pb-[33px] pt-10 lg:px-0 lg:pb-24 lg:pt-[114px]">
        {/* Phone: one ribbon under the text. Desktop: one behind the glass card, one down the right edge. */}
        <Ribbon
          width={412}
          height={200}
          from={[0, 112, 140, 70, 290, 30, 412, 20]}
          to={[0, 196, 150, 170, 300, 110, 412, 96]}
          lines={40}
          className="bottom-[22px] left-0 h-[200px] w-full lg:hidden"
        />
        <Ribbon
          width={760}
          height={460}
          from={[0, 172, 160, 80, 330, 30, 512, 34, 620, 37, 700, 80, 760, 112]}
          to={[0, 427, 200, 320, 400, 150, 560, 150, 660, 150, 720, 200, 760, 225]}
          lines={56}
          className="left-0 top-[110px] hidden h-[460px] w-[760px] lg:block"
        />
        <Ribbon
          width={260}
          height={590}
          from={[260, 48, 170, 210, 70, 400, 58, 592]}
          to={[260, 330, 250, 430, 252, 520, 262, 592]}
          lines={30}
          className="right-0 top-0 hidden h-[590px] w-[260px] lg:block"
        />

        <div className="relative mx-auto flex max-w-[1440px] flex-col lg:grid lg:grid-cols-[518fr_520fr] lg:items-center lg:gap-x-[4.5%] lg:pl-[9.93%] lg:pr-[13.47%]">
          <div className="relative order-1 aspect-[380/220] overflow-hidden rounded-2xl lg:order-2 lg:aspect-[520/440] lg:rounded-[20px]">
            <Image src="/figma/careers/fleet-mobile.webp" alt={ALT} fill sizes="(min-width: 1024px) 0px, 100vw" className="object-cover lg:hidden" />
            <Image src="/figma/careers/fleet.webp" alt={ALT} fill sizes="(min-width: 1024px) 36vw, 0px" className="hidden object-cover lg:block" />
          </div>
          <ExploreJobs className="relative order-2 mx-auto -mt-[9px] flex h-[52px] w-48 text-lg lg:hidden" />
          <div className="order-3 mt-[11px] lg:order-1 lg:mt-0 lg:rounded-[20px] lg:border lg:border-white/25 lg:bg-[linear-gradient(160deg,rgba(0,109,184,0.28)_0%,rgba(0,109,184,0.1)_100%)] lg:px-6 lg:pb-[27px] lg:pt-[21px] lg:backdrop-blur-[3px]">
            <h2 className="text-[28px] font-bold leading-[34px] tracking-[-0.2px] text-white lg:text-[44px] lg:leading-[53px] lg:tracking-[-0.015em]">
              Let&rsquo;s Move India, Together
            </h2>
            <p className="mt-[13px] text-[15px] leading-6 text-white lg:mt-[22px] lg:text-lg lg:leading-[29px]">
              Everest Fleet gives drivers a car, steady work on Uber and a path to own it. Our 100% CNG and electric fleet runs
              across {COMPANY.cities} cities, with {COMPANY.drivers} drivers on the road today.
            </p>
          </div>
        </div>
      </section>
      <div className="hidden h-[190px] items-center justify-center bg-white lg:flex">
        <ExploreJobs className="flex h-[65px] w-[247px] text-2xl" />
      </div>
    </>
  );
}
