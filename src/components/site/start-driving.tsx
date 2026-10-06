import { ApplyForm } from "@/components/home/apply-form";
import { getContent } from "@/lib/store";

/**
 * "Start Driving Today": the lead form on navy. `source` records which page a lead came from;
 * `eyebrow` is the "How it works" line, which only some page designs carry ("phone": only the phone
 * designs). Phones get the compact card from the phone exports; from sm up the roomier one.
 */
export async function StartDriving({ source, eyebrow = false }: { source: string; eyebrow?: boolean | "phone" }) {
  const cities = (await getContent()).cities.map((c) => ({ slug: c.slug, name: c.name.en }));
  return (
    <section
      id="apply"
      className="scroll-mt-20 overflow-hidden bg-[linear-gradient(to_bottom_right,#062f50,#006db8)] px-4 sm:bg-[linear-gradient(to_bottom_right,#062f50,#0b3e6c)] pb-6 pt-6 sm:px-6 sm:pb-12 sm:pt-12"
    >
      <div className="text-center">
        {eyebrow ? (
          <p
            className={`mb-3 flex items-center justify-center gap-2.5 text-[13px] font-medium uppercase leading-4 tracking-[1.5px] text-white sm:mb-1.5 sm:gap-[11px] sm:font-semibold sm:tracking-[1.3px] ${
              eyebrow === "phone" ? "lg:hidden" : ""
            }`}
          >
            <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
            How it works
            <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
          </p>
        ) : null}
        <h2 className="text-[28px] font-bold leading-[34px] tracking-[-0.5px] text-white sm:text-[34px] sm:leading-tight lg:text-[43px] lg:leading-[52px]">
          Start Driving Today
        </h2>
      </div>
      {/* relative: the form's sent toast sits over the top of this card. */}
      <div className="relative mx-auto mt-3 max-w-[744px] rounded-lg bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:mt-8 sm:rounded-3xl sm:border sm:border-line sm:px-14 sm:pb-7 sm:pt-11">
        <ApplyForm cities={cities} source={source} />
      </div>
    </section>
  );
}
