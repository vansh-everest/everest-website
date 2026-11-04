import { Eyebrow } from "@/components/b2b/ui";
import { AdEnquiryForm } from "./enquiry-form";

/** "Get in touch": the enquiry card on the navy-to-blue gradient. The hero button links to #enquire. */
export function AdEnquiry() {
  return (
    <section id="enquire" className="scroll-mt-20 bg-blue-gradient px-4 pb-6 pt-6 lg:bg-[linear-gradient(160deg,#062f50_0%,#0a4378_100%)] lg:px-6 lg:pb-[54px] lg:pt-[54px]">
      <div className="text-center">
        <Eyebrow tone="white" bars className="justify-center">
          Get in touch
        </Eyebrow>
        <h2 className="mt-3 text-[clamp(24px,6.8vw,28px)] font-bold leading-[34px] tracking-[-0.4px] text-white lg:mt-2 lg:text-[42px] lg:leading-[50px] lg:tracking-normal">
          Tell Us About Your Brand
        </h2>
      </div>
      <div className="mx-auto mt-3 max-w-[744px] rounded-lg bg-white px-3 pb-3 pt-3 shadow-[0_20px_60px_rgba(0,0,0,0.2)] lg:mt-[33px] lg:rounded-3xl lg:px-14 lg:pb-14 lg:pt-[50px]">
        <AdEnquiryForm />
      </div>
    </section>
  );
}
