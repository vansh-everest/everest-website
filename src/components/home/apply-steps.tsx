import { getContent } from "@/lib/store";
import { ApplyForm } from "./apply-form";
import { Eyebrow } from "./ui";

type Variant = "home" | "page";

const steps = [
  {
    title: "Download app start onboarding",
    body: "Fill your details, upload your documents and complete application. Takes 5min-7min.",
    dot: "bg-sun text-navy ring-4 ring-sun/25",
    label: "text-sun",
  },
  {
    title: "Visit your nearest Everest fleet office",
    body: "Bring your address proof along with driving licence & Aadhaar to get your details verified, quick and easy.",
    dot: "border-2 border-[#3d8fd1] bg-[#264e71] text-white",
    label: "text-[#5aaef0]",
  },
  {
    title: "Car allocation-Start driving",
    body: "Our team will allocate a car according to your plan and will create  Uber ID.",
    dot: "border-2 border-lime bg-[#264f74] text-white",
    label: "text-lime",
  },
];

function Stepper() {
  return (
    <div className="bg-[linear-gradient(160deg,#062f50_0%,#0a3d6b_100%)] px-8 py-12 lg:px-12 lg:py-[62px]">
      <p className="text-[11px] font-bold uppercase leading-[15px] tracking-[1.5px] text-sun">Your journey</p>
      <p className="mt-3 max-w-[464px] text-[22px] font-bold leading-[33px] text-white">
        From application to first ride
        <br />
        Same day
      </p>
      <ol className="mt-11">
        {steps.map((step, i) => (
          <li key={step.title} className="relative flex gap-7 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span aria-hidden className="absolute left-[23px] top-[52px] h-[52px] w-0.5 bg-white/20" />
            )}
            <span className={`grid size-12 shrink-0 place-items-center rounded-full text-lg font-bold ${step.dot}`}>{i + 1}</span>
            <div className="max-w-[398px]">
              <p className={`text-[10px] font-bold uppercase leading-[13px] tracking-[1.5px] ${step.label}`}>Step {i + 1}</p>
              <p className="mt-0.5 text-lg font-bold leading-[23px] text-white">{step.title}</p>
              <p className="mt-1 text-[13px] leading-5 text-white/65">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 border-t border-white/15 pt-3 text-xs leading-4 text-white/70">On the road in as little as 1 day</p>
    </div>
  );
}

function ApplyCard({ cities, source }: { cities: { slug: string; name: string }[]; source: string }) {
  return (
    <div className="px-6 py-8 lg:px-14 lg:py-12">
      <h3 className="text-[22px] font-bold leading-[29px] text-navy lg:text-[26px]">Start onboarding now</h3>
      <p className="mb-7 mt-1.5 text-sm leading-[18px] text-ink-soft lg:text-base lg:leading-5">
        Fill the form and our team calls you back within 10 minutes to guide you for completing the process.
      </p>
      <ApplyForm cities={cities} source={source} />
    </div>
  );
}

export async function ApplySteps({ variant = "home" }: { variant?: Variant }) {
  const page = variant === "page";
  const cities = (await getContent()).cities.map((c) => ({ slug: c.slug, name: c.name.en }));
  return (
    <section id="apply" className={`scroll-mt-20 bg-paper px-6 ${page ? "py-20 lg:py-24" : "pb-[94px] pt-[98px]"}`}>
      <div className="text-center">
        <Eyebrow>How it works</Eyebrow>
        {page ? (
          <h2 className="mt-2 text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[77px]">
            Start Driving in <span className="text-brand">3 Simple Steps</span>
          </h2>
        ) : (
          <>
            <h2 className="mt-2 text-[32px] font-bold leading-tight text-navy lg:text-[48px] lg:leading-[51px]">
              Start Driving in 3 Simple Steps
            </h2>
            <p className="mt-2 text-base leading-[21px] text-ink-soft">No CV. No interview. Just your licence and the will to work.</p>
          </>
        )}
      </div>
      <div className="mx-auto mt-12 grid max-w-[1200px] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(6,47,80,0.12)] lg:mt-16 lg:grid-cols-[560px_1fr]">
        <Stepper />
        <ApplyCard cities={cities} source={page ? "plan-page" : "home"} />
      </div>
    </section>
  );
}
