"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Story = {
  id: string;
  /** Vertical footage inside a 16:9 upload: the player is widened so its black side bars fall outside the card. */
  crop: boolean;
  /** A Shorts video: vertical already. */
  short: boolean;
  name: string;
  detail: string;
  quote: string;
};

function PlayMark({ small }: { small?: boolean }) {
  return (
    <span className={`grid place-items-center bg-[#ff0000] ${small ? "h-9 w-[52px] rounded-[10px]" : "h-12 w-[68px] rounded-xl lg:h-[50px] lg:w-[72px] lg:rounded-[14px]"}`}>
      <svg viewBox="0 0 20 22" aria-hidden className={`ml-1 fill-white ${small ? "h-4 w-[15px]" : "h-[22px] w-5"}`}>
        <path d="M0 0 20 11 0 22Z" />
      </svg>
    </span>
  );
}

/** A still for the card: the 16:9 frame's middle for a cropped upload, the vertical frame for a Short. */
function poster(story: Story) {
  return `https://i.ytimg.com/vi/${story.id}/${story.short ? "oardefault" : "maxresdefault"}.jpg`;
}

function StoryCard({ story, active, playing, onPlay }: { story: Story; active: boolean; playing: boolean; onPlay: () => void }) {
  const label = story.name ? `Play ${story.name}'s story` : "Play this driver's story";
  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[18px] bg-navy shadow-[0_12px_32px_rgba(6,47,80,0.18)] lg:rounded-[22px]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${story.id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
          title={story.name ? `${story.name}'s story` : "Driver story"}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          // A 9:16 card is 16/9 x 16/9 = 3.16 times narrower than a 16:9 player of the same height.
          className={story.crop ? "absolute left-1/2 top-0 h-full w-[316.05%] -translate-x-1/2" : "absolute inset-0 size-full"}
        />
      ) : (
        <Cover active={active} onPlay={onPlay} label={label}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster(story)}
            alt=""
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.src.endsWith("/hqdefault.jpg")) img.src = `https://i.ytimg.com/vi/${story.id}/hqdefault.jpg`;
            }}
            className="absolute inset-0 size-full object-cover"
          />
          <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,47,80,0.35)_0%,rgba(6,47,80,0.05)_40%,rgba(6,47,80,0.15)_70%,rgba(6,47,80,0.7)_100%)]" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition group-hover:scale-105">
            <PlayMark small={!active} />
          </span>
          {story.name || story.detail ? (
            <span className="absolute inset-x-0 bottom-0 px-4 pb-4 text-left lg:px-5 lg:pb-5">
              {story.name ? <span className="block text-sm font-semibold leading-5 text-white lg:text-base">{story.name}</span> : null}
              {story.detail ? <span className="block text-xs leading-4 text-white/85">{story.detail}</span> : null}
            </span>
          ) : null}
        </Cover>
      )}
    </div>
  );
}

/** The middle card's cover is the play button; a neighbour's sits inside its own "go to" button. */
function Cover({ active, onPlay, label, children }: { active: boolean; onPlay: () => void; label: string; children: React.ReactNode }) {
  return active ? (
    <button type="button" onClick={onPlay} aria-label={label} className="group absolute inset-0">
      {children}
    </button>
  ) : (
    <span className="group absolute inset-0">{children}</span>
  );
}

const arrow =
  "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-[0_6px_18px_rgba(6,47,80,0.18)] transition hover:bg-mist lg:size-[52px]";

/**
 * Driver stories as vertical cards: the one in the middle plays, its neighbours step in with the
 * arrows, a swipe or a tap. Moving to another story stops the one that was playing.
 */
export function TestimonialReel({ stories }: { stories: Story[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState<number | null>(null);
  const touch = useRef<number | null>(null);
  const many = stories.length > 1;

  const go = (to: number) => {
    setPlaying(null);
    setIndex((to + stories.length) % stories.length);
  };

  const prev = many ? stories[(index - 1 + stories.length) % stories.length] : null;
  const next = stories.length > 2 ? stories[(index + 1) % stories.length] : stories.length === 2 ? stories[(index + 1) % 2] : null;
  const current = stories[index];

  return (
    <div className="mx-auto mt-6 max-w-[1184px] lg:mt-12">
      <div
        className="relative flex items-center justify-center gap-6 lg:gap-10"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null || !many) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          touch.current = null;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        }}
      >
        {prev && stories.length > 2 ? (
          <button type="button" aria-label="Previous story" onClick={() => go(index - 1)} className="hidden w-[242px] shrink-0 opacity-60 transition hover:opacity-90 lg:block">
            <StoryCard story={prev} active={false} playing={false} onPlay={() => go(index - 1)} />
          </button>
        ) : null}
        <div className="w-[240px] shrink-0 sm:w-[300px] lg:w-[345px]">
          <StoryCard story={current} active playing={playing === index} onPlay={() => setPlaying(index)} />
        </div>
        {next ? (
          <button type="button" aria-label="Next story" onClick={() => go(index + 1)} className="hidden w-[242px] shrink-0 opacity-60 transition hover:opacity-90 lg:block">
            <StoryCard story={next} active={false} playing={false} onPlay={() => go(index + 1)} />
          </button>
        ) : null}
        {many ? (
          <>
            <button type="button" aria-label="Previous story" onClick={() => go(index - 1)} className={`${arrow} left-0`}>
              <ChevronLeft size={22} />
            </button>
            <button type="button" aria-label="Next story" onClick={() => go(index + 1)} className={`${arrow} right-0`}>
              <ChevronRight size={22} />
            </button>
          </>
        ) : null}
      </div>
      {current.quote ? (
        <p className="mx-auto mt-5 max-w-[640px] px-4 text-center text-base font-semibold leading-6 text-navy lg:mt-8 lg:text-[28px] lg:leading-[39px]">
          {current.quote}
        </p>
      ) : null}
      {many ? (
        <div className="mt-4 flex justify-center gap-1.5 lg:mt-6">
          {stories.map((s, i) => (
            <button
              key={s.id + i}
              type="button"
              aria-label={`Story ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-navy" : "w-2 bg-navy/20"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
