import { InvestorForm } from "./contact-form";

export function InvestorContact() {
  return (
    <section
      id="contact"
      className="scroll-mt-28 bg-[linear-gradient(160deg,#062f50_0%,#0a4176_100%)] px-4 pb-6 pt-8 sm:px-6 lg:pb-12 lg:pt-14"
    >
      <p className="flex items-center justify-center gap-3 text-[13px] font-semibold uppercase leading-4 tracking-[1.5px] text-white lg:gap-4">
        <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
        Investor relations
        <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
      </p>
      <h2 className="mx-auto mt-3 max-w-[300px] text-center text-[28px] font-bold leading-[34px] tracking-[-0.3px] text-white sm:max-w-none lg:mt-0.5 lg:text-[44px] lg:leading-[52px] lg:tracking-[-0.3px]">
        Talk To Our Investor Relations Team
      </h2>
      <div className="mx-auto mt-3 max-w-[744px] rounded-lg bg-white px-3 pb-3 pt-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:rounded-3xl sm:px-10 sm:py-10 lg:mt-7 lg:rounded-[28px] lg:px-14 lg:pb-[34px] lg:pt-[50px]">
        <InvestorForm />
      </div>
    </section>
  );
}
