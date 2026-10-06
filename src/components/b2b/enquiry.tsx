import { EnquiryForm, type EnquiryChoice, type EnquiryField } from "./enquiry-form";
import { Eyebrow } from "./ui";

/** "Get in touch": the enquiry card on the navy-to-blue gradient. The hero buttons link to #enquire. */
export function Enquiry({
  title,
  source,
  fields,
  after,
  choice,
  submit = "Send enquiry",
}: {
  title: string;
  source: string;
  fields: EnquiryField[];
  after?: EnquiryField[];
  choice?: EnquiryChoice;
  submit?: string;
}) {
  return (
    <section
      id="enquire"
      className="scroll-mt-20 bg-[linear-gradient(160deg,#062f50_0%,#0a4378_100%)] px-4 pb-6 pt-[30px] lg:px-6 lg:pb-12 lg:pt-[49px]"
    >
      <div className="text-center">
        <Eyebrow tone="white" bars className="justify-center">
          Get in touch
        </Eyebrow>
        <h2 className="mt-[11px] text-[28px] font-bold leading-[34px] tracking-[-0.4px] text-white lg:mt-2 lg:text-[42px] lg:leading-[50px] lg:tracking-normal">
          {title}
        </h2>
      </div>
      <div className="mx-auto mt-3 max-w-[744px] rounded-lg bg-white px-3 pb-3 pt-3 shadow-[0_20px_60px_rgba(0,0,0,0.2)] lg:mt-8 lg:rounded-3xl lg:px-14 lg:pb-14 lg:pt-12">
        <EnquiryForm source={source} fields={fields} after={after} choice={choice} submit={submit} />
      </div>
    </section>
  );
}
