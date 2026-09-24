import { ApplyForm } from "@/components/home/apply-form";
import { getContent } from "@/lib/store";

/** "Start Driving Today": the lead form on navy, closing the About Us page. */
export async function StartDriving() {
  const cities = (await getContent()).cities.map((c) => ({ slug: c.slug, name: c.name.en }));
  return (
    <section id="apply" className="scroll-mt-20 bg-[linear-gradient(160deg,#062f50_0%,#0a4378_100%)] px-4 pb-12 pt-16 sm:px-6 lg:pt-14">
      <div className="text-center">
        <p className="flex items-center justify-center gap-[22px] text-xs font-bold uppercase leading-4 tracking-[2px] text-white">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
          How it works
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
        </p>
        <h2 className="mt-3 text-[34px] font-bold leading-tight tracking-[-0.5px] text-white lg:text-[48px] lg:leading-[56px]">
          Start Driving Today
        </h2>
      </div>
      <div className="mx-auto mt-8 max-w-[744px] rounded-3xl bg-white px-6 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:px-14 sm:py-10">
        <ApplyForm cities={cities} source="about-us" />
      </div>
    </section>
  );
}
