import Image from "next/image";

export function Hero() {
  return (
    <section className="relative aspect-[1440/654] min-h-[340px] overflow-hidden bg-blue-gradient">
      {/* Figma places the photo at (-70, -105) at 1510x759 inside the 1440x654 frame. */}
      <div className="absolute left-[-4.861%] top-[-16.055%] h-[116.055%] w-[104.861%]">
        <Image
          src="/figma/hero.webp"
          alt="Everest Fleet driver leaning on a white Everest sedan"
          fill
          preload
          loading="eager"
          sizes="105vw"
          className="object-cover"
        />
      </div>
      <p className="absolute left-4 top-6 rounded-[20px] bg-sun py-[11px] pl-4 pr-6 text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.26px] text-navy lg:left-10 lg:top-[43px] lg:w-[310px]">
        ⭐ India’s largest fleet partner
      </p>
    </section>
  );
}
