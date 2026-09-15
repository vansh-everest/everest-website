import Image from "next/image";
import { GooglePlayButton } from "./ui";

export function FleetApp() {
  return (
    <section className="relative bg-fog pb-16 pt-[93px] lg:h-[1125px] lg:pb-0">
      <h2 className="px-6 text-center text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[60px]">
        Introducing <span className="text-brand">Everest Fleet</span> app
      </h2>

      {/* Desktop keeps the 1440 frame geometry: blue pill at y=378, phones render at (150, 232). */}
      <div className="relative mx-auto mt-10 max-w-[1440px] lg:absolute lg:inset-x-0 lg:top-0 lg:mt-0 lg:h-full">
        <div className="bg-blue-gradient px-6 py-12 lg:absolute lg:left-0 lg:top-[378px] lg:h-[496px] lg:w-[1352px] lg:rounded-r-[248px] lg:p-0">
          <div className="lg:absolute lg:left-[734px] lg:top-[84.5px] lg:w-[440px]">
            <h3 className="text-[28px] font-bold uppercase leading-[40px] text-white lg:text-[36px] lg:leading-[48px]">
              Your <span className="text-sun">earnings</span>,
              <br />
              your <span className="text-sun">trips</span>,
              <br />
              all in one place.
            </h3>
            <p className="mt-6 max-w-[420px] text-base leading-7 text-white/80 lg:mt-9">
              Download our driver app for free to track your earnings, monitor your Drive-to-Own progress, and reach
              support — anytime, anywhere.
            </p>
            <GooglePlayButton className="mt-3" />
          </div>
        </div>
        <div className="relative mx-auto mt-10 aspect-[700/933] w-full max-w-[440px] lg:absolute lg:left-[20px] lg:top-[192px] lg:mt-0 lg:w-[700px] lg:max-w-none">
          <Image
            src="/figma/app-phones.png"
            alt="Everest Fleet driver app showing weekly performance and plan progress"
            fill
            sizes="(min-width: 1024px) 700px, 440px"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
