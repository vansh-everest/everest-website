import Image from "next/image";

export function Hero() {
  return (
    <section className="relative aspect-[412/300] overflow-hidden bg-navy sm:aspect-[1440/654]">
      {/* One photo serves both frames. Phones crop it to the car; from sm up it runs the full
          width and sits 16% above the frame, where the Figma frame places it. */}
      <div className="absolute inset-0 sm:inset-auto sm:left-0 sm:top-[-16.13%] sm:h-[116.13%] sm:w-full">
        <Image
          src="/figma/home/hero.webp"
          alt="Everest Fleet driver leaning on a white Everest sedan"
          fill
          preload
          sizes="100vw"
          className="object-cover object-[42%_100%] sm:object-center"
        />
      </div>
      <p className="absolute left-[13px] top-[14px] rounded-full bg-sun py-[4.5px] pl-1.5 pr-2 text-[11px] font-bold uppercase leading-4 tracking-[1.26px] text-navy sm:left-[35px] sm:top-[68px] sm:py-[11px] sm:pl-[13px] sm:pr-4">
        <span aria-hidden>⭐</span> India’s Largest Fleet
      </p>
    </section>
  );
}
