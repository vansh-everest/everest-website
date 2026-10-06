import { EnquiryForm } from "./enquiry-form";

/** "Tell Us What You Need": the business enquiry form on navy, the target of every Get Started button. */
export function Enquiry({ source }: { source: string }) {
  return (
    <section
      id="enquiry"
      className="scroll-mt-20 bg-[linear-gradient(160deg,#062f50_0%,#0a4378_100%)] px-4 pb-6 pt-[23px] sm:px-6 sm:pb-12 lg:pt-12"
    >
      <div className="text-center">
        <p className="flex items-center justify-center gap-2.5 text-[13px] font-medium uppercase leading-4 tracking-[1.5px] text-white sm:gap-[22px] sm:text-xs sm:font-bold sm:tracking-[2px]">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
          Get in touch
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
        </p>
        <h2 className="mt-2 text-[28px] font-bold leading-9 tracking-[-0.3px] text-white sm:mt-1 sm:text-[36px] sm:leading-[44px] lg:text-[44px] lg:leading-[52px] lg:tracking-[-0.5px]">
          Tell Us What You Need
        </h2>
      </div>
      <div className="relative mx-auto mt-[13px] max-w-[744px] rounded-lg bg-white px-3 pb-3 pt-[14px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:mt-[30px] sm:rounded-3xl sm:px-14 sm:pb-[52px] sm:pt-[50px]">
        <EnquiryForm source={source} />
      </div>
    </section>
  );
}
