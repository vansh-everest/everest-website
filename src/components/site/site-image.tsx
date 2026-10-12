import Image from "next/image";
import type { ImageSlot } from "@/lib/content";

/**
 * An image that has not been supplied yet renders as a quiet tinted panel rather than a broken
 * frame or a stock photograph. Its admin label stays in the admin: printed on the page it read as
 * finished copy ("Guide cover, payouts").
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
    return <div aria-hidden className={`absolute inset-0 bg-[linear-gradient(135deg,#eef4fa_0%,#dbe6f0_100%)] ${className}`} />;
  }

  return (
    <Image
      src={slot.url}
      alt={slot.alt}
      fill
      sizes={sizes}
      // Next 16 renamed priority to preload.
      preload={priority}
      className={`object-cover ${className}`}
    />
  );
}
