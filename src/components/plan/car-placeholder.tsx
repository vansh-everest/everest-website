import { CarFront } from "lucide-react";

/** Stands in for a car whose photo Jarvis and the admin do not have yet: a studio-grey card with a car outline. */
export function CarPlaceholder({ size = 56 }: { size?: number }) {
  return (
    <span aria-hidden className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_50%_40%,#f7f8fa_0%,#e4e8ec_75%)]">
      <CarFront size={size} strokeWidth={1.25} className="text-navy/25" />
    </span>
  );
}
