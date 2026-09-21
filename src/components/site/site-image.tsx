import Image from "next/image";
import type { ImageSlot } from "@/lib/content";

/**
 * An image that has not been supplied yet renders as a labelled placeholder rather than a
 * broken frame or a stock photograph. The label is the same wording the admin shows, so it
 * is obvious both on the page and in the editor which slot is still empty.
 */
export function SiteImage({
  slot,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  slot: ImageSlot;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!slot.url) {
    return (
      <div
        role="img"
        aria-label={`Placeholder: ${slot.label}`}
        className={`absolute inset-0 grid place-items-center bg-mist text-center ${className}`}
      >
        <span className="px-4 text-[11px] font-semibold uppercase tracking-[1px] text-ink-soft">
          {slot.label}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={slot.url}
      alt={slot.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
