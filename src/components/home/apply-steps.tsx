import { CaretDown } from "@phosphor-icons/react/ssr";
import { Eyebrow, PHONE_DISPLAY } from "./ui";

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

const cities = ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Pune", "Kolkata", "Chennai"];

const input =
  "mt-2 h-[54px] w-full rounded-xl border border-line bg-white pl-[46px] pr-4 text-sm text-navy placeholder:text-ink-soft/60 focus:border-brand focus:outline-none";

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

function ApplyForm() {
  return (
    <form className="px-6 py-8 lg:px-14 lg:py-4">
      <p className="inline-flex h-[27px] items-center gap-2 rounded-full bg-[#e8f9ee] px-3 text-[11px] font-semibold text-[#1a8f4a]">
        <span aria-hidden className="size-[7px] rounded-full bg-leaf" />
        Step 1 of 3 · Apply now
      </p>
      <h3 className="mt-5 text-[22px] font-bold leading-[29px] text-navy">Start onboarding now</h3>
      <p className="mt-1.5 text-sm leading-[18px] text-ink-soft">
        Fill the form and our team calls you back within 10 minutes to guide you for completing the process.
      </p>
      <label className="mt-7 block text-[13px] font-semibold leading-4 text-navy">
        Full name *
        <input name="name" required autoComplete="name" placeholder="e.g. Ravi Kumar" className={input} />
      </label>
      <label className="mt-[18px] block text-[13px] font-semibold leading-4 text-navy">
        Mobile number *
        <input
          name="mobile"
          required
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
          autoComplete="tel-national"
          placeholder="10-digit mobile number"
          className={input}
        />
      </label>
      <label className="mt-[18px] block text-[13px] font-semibold leading-4 text-navy">
        Your city *
        <span className="relative block">
          <select name="city" required defaultValue="" className={`${input} appearance-none invalid:text-ink-soft/60`}>
            <option value="" disabled>
              Select your city
            </option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <CaretDown size={20} className="pointer-events-none absolute right-6 top-1/2 mt-1 -translate-y-1/2 text-navy" />
        </span>
      </label>
      <button
        type="submit"
        className="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-brand text-[15px] font-semibold text-white transition hover:brightness-110"
      >
        Submit &amp; Apply →
      </button>
      <p className="mt-4 text-center text-xs leading-4 text-ink-soft/80">
        Or reach us directly · 📞 {PHONE_DISPLAY} · 💬 WhatsApp
      </p>
    </form>
  );
}

export function ApplySteps() {
  return (
    <section id="apply" className="scroll-mt-20 bg-paper px-6 pb-[94px] pt-[98px]">
      <div className="text-center">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-2 text-[32px] font-bold leading-tight text-navy lg:text-[48px] lg:leading-[51px]">
          Start Driving in 3 Simple Steps
        </h2>
        <p className="mt-2 text-base leading-[21px] text-ink-soft">No CV. No interview. Just your licence and the will to work.</p>
      </div>
      <div className="mx-auto mt-16 grid max-w-[1200px] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(6,47,80,0.12)] lg:h-[560px] lg:grid-cols-[560px_640px]">
        <Stepper />
        <ApplyForm />
      </div>
    </section>
  );
}
