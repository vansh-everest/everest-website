import Image from "next/image";

/*
 * The photo band is drawn on the export frame (412 wide on phones, 1440 on desktop); --u is one
 * frame pixel. The white card sits exactly over the card baked into the photo, and the phone
 * render sits over the baked phone, so both have to keep the frame's geometry at every width.
 */
export function DostApp() {
  return (
    <section id="dost" className="@container overflow-hidden">
      <div className="[--u:calc(100cqw/412)] lg:[--u:calc(min(100cqw,1440px)/1440)]">
        <div className="h-[calc(var(--u)*42)] bg-[linear-gradient(90deg,#062f50_0%,#054e84_100%)] pt-[calc(var(--u)*9)] lg:h-[calc(var(--u)*173)] lg:pt-[calc(var(--u)*45.7)]">
          <h2 className="text-center text-[length:calc(var(--u)*20)] font-bold leading-[calc(var(--u)*24)] tracking-[calc(var(--u)*0.35)] text-white lg:tracking-[calc(var(--u)*0.5)] lg:text-[length:calc(var(--u)*64)] lg:leading-[calc(var(--u)*77)]">
            Introducing <span className="text-sun">Everest Dost</span>
            <span className="hidden lg:inline"> App</span>
          </h2>
        </div>

        <div className="relative overflow-hidden">
          {/* Past 1440 the band keeps its size; a blurred copy of the photo fills the sides. */}
          <Image
            src="/figma/home/dost-band.webp"
            alt=""
            fill
            sizes="480px"
            className="hidden scale-110 object-cover blur-2xl min-[1441px]:block"
          />
          <div className="relative mx-auto aspect-[412/220] w-[calc(var(--u)*412)] lg:aspect-[1440/752] lg:w-[calc(var(--u)*1440)]">
            <Image
              src="/figma/home/dost-band-mobile.webp"
              alt="Everest Dost partner smiling at the app on his phone beside a car"
              fill
              sizes="(min-width: 1024px) 0px, 100vw"
              className="object-cover lg:hidden"
            />
            <Image
              src="/figma/home/dost-band.webp"
              alt="Everest Dost partner smiling at the app on his phone beside a car"
              fill
              sizes="(min-width: 1024px) min(1440px, 100vw), 0px"
              className="hidden object-cover lg:block"
            />

            <div className="absolute left-[calc(var(--u)*93.5)] top-[calc(var(--u)*43)] h-[calc(var(--u)*127)] w-[calc(var(--u)*201.5)] rounded-[calc(var(--u)*8)] bg-white pl-[calc(var(--u)*3.5)] pt-[calc(var(--u)*18.2)] lg:left-[calc(var(--u)*330)] lg:top-[calc(var(--u)*245)] lg:h-[calc(var(--u)*264)] lg:w-[calc(var(--u)*539)] lg:rounded-[calc(var(--u)*20)] lg:pl-[calc(var(--u)*14)] lg:pt-[calc(var(--u)*27.5)]">
              <h3 className="text-[length:calc(var(--u)*16.5)] font-bold leading-[calc(var(--u)*19)] text-navy lg:text-[length:calc(var(--u)*40)] lg:leading-[calc(var(--u)*48)] lg:tracking-[calc(var(--u)*0.3)]">
                Not Behind The Wheel?
                <br />
                You Can Still <br className="lg:hidden" />
                Drive The <br className="hidden lg:inline" />
                Change.
              </h3>
              <a
                href="#apply"
                className="mt-[calc(var(--u)*11.8)] flex h-[calc(var(--u)*30)] w-[calc(var(--u)*188)] items-center justify-center rounded-full border-[length:calc(var(--u)*2)] border-brand text-[length:calc(var(--u)*14)] tracking-[0.04em] text-brand transition hover:bg-brand/5 lg:mt-[calc(var(--u)*15.5)] lg:h-[calc(var(--u)*48)] lg:w-[calc(var(--u)*498)] lg:border-navy lg:text-[length:calc(var(--u)*16)] lg:font-medium lg:text-navy lg:hover:bg-navy/5"
              >
                Know more
              </a>
            </div>

            <div className="absolute left-[calc(var(--u)*16)] top-[calc(var(--u)*27.4)] h-[calc(var(--u)*161.1)] w-[calc(var(--u)*78)] drop-shadow-[calc(var(--u)*3)_calc(var(--u)*4)_calc(var(--u)*6)_rgba(6,47,80,0.25)] lg:left-[calc(var(--u)*83)] lg:top-[calc(var(--u)*118)] lg:h-[calc(var(--u)*512)] lg:w-[calc(var(--u)*248)] lg:drop-shadow-[calc(var(--u)*8)_calc(var(--u)*12)_calc(var(--u)*18)_rgba(6,47,80,0.25)]">
              <Image
                src="/figma/home/dost-phone.webp"
                alt="Everest Dost app with referral payouts and follow-ups"
                fill
                sizes="(min-width: 1024px) min(248px, 18vw), 19vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
