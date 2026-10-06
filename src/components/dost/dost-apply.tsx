import { getContent } from "@/lib/store";
import { DostForm } from "./dost-form";

export async function DostApply() {
  const cities = (await getContent()).cities.map((c) => ({ slug: c.slug, name: c.name.en }));
  return (
    <section
      id="apply"
      className="scroll-mt-20 bg-blue-gradient lg:bg-[linear-gradient(160deg,#062f50_0%,#0b3d6b_100%)] px-4 pb-6 pt-6 sm:px-6 sm:pb-12 lg:pb-12 lg:pt-12"
    >
      <div className="text-center">
        <p className="flex items-center justify-center gap-[22px] text-[13px] font-medium uppercase leading-4 tracking-[1.5px] text-white">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
          Apply
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
        </p>
        <h2 className="mt-3 text-[28px] font-bold leading-[34px] text-white lg:mt-[9px] lg:text-[42px] lg:leading-[50px]">
          Apply To Become A Dost
        </h2>
        <p className="mt-[9px] hidden text-[17px] leading-6 text-white/85 lg:block">
          We review every application and send you an invite to the app.
        </p>
      </div>
      <div className="mx-auto mt-3 max-w-[744px] rounded-lg bg-white px-3 pb-3 pt-[13px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:mt-8 sm:rounded-3xl sm:px-14 sm:pb-[54px] sm:pt-12 lg:mt-[33px]">
        <DostForm cities={cities} />
      </div>
    </section>
  );
}
