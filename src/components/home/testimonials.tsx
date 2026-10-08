import { getContent } from "@/lib/store";
import { isShort, youtubeId } from "@/lib/youtube";
import { TestimonialReel, type Story } from "./testimonial-reel";

/** "Real Drivers Real Stories": the driver videos listed in the admin, each in a card of its own shape. None, no section. */
export async function Testimonials({
  variant = "home",
  title = "Real Drivers Real Stories",
}: {
  variant?: "home" | "page";
  title?: string;
}) {
  const { testimonials } = await getContent();
  const stories = testimonials.flatMap((t): Story[] => {
    const id = youtubeId(t.video);
    if (!id) return [];
    // A Shorts link is vertical whatever the admin picked.
    return [{ id, shape: isShort(t.video) ? "short" : t.shape, name: t.name, detail: t.detail, quote: t.quote }];
  });
  if (!stories.length) return null;

  const page = variant === "page";
  return (
    <section className={`bg-white px-4 pb-9 pt-9 lg:bg-fog lg:px-6 lg:pt-24 ${page ? "lg:pb-[84px]" : "lg:pb-[111px]"}`}>
      <div className="mx-auto max-w-[1248px] text-center">
        <p
          className={`flex items-center justify-center gap-2 text-[13px] font-bold uppercase leading-4 tracking-[0.07em] text-brand ${
            page ? "lg:gap-[22px] lg:text-xs lg:tracking-[2px]" : "lg:gap-[11px]"
          }`}
        >
          <span aria-hidden className={`h-[3px] w-7 rounded-full bg-sun ${page ? "lg:w-6" : ""}`} />
          Hear it from them
          <span aria-hidden className="h-[3px] w-7 rounded-full bg-sun lg:hidden" />
        </p>
        <h2
          className={`mt-[15px] text-[28.5px] font-bold leading-[35px] tracking-[-0.3px] text-navy lg:mt-3 lg:text-[40px] lg:leading-[48px] ${
            page ? "lg:tracking-[-0.5px]" : "lg:tracking-[-0.25px]"
          }`}
        >
          {title}
        </h2>
      </div>
      <TestimonialReel stories={stories} />
    </section>
  );
}
