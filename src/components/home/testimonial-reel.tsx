"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, VolumeX } from "lucide-react";
import type { StoryCopy } from "@/content/home-copy";
import type { VideoShape } from "@/lib/content";
import { fill } from "@/lib/i18n";
import { joinPlayers, loadApi, type YTEvent, type YTPlayer } from "./youtube-api";

export type Story = {
  id: string;
  shape: VideoShape;
  name: string;
  detail: string;
  quote: string;
};

/* ----------------------------------------------------------------------------- cards */

/** Vertical stories play in a 9:16 card, landscape ones in a 16:9 card. */
const tall = (story: Story) => story.shape !== "landscape";

/** A still for the card: the 16:9 frame (its middle, in a 9:16 card), or a Short's own vertical frame. */
function poster(story: Story) {
  return `https://i.ytimg.com/vi/${story.id}/${story.shape === "short" ? "oardefault" : "maxresdefault"}.jpg`;
}

function PlayMark({ small }: { small?: boolean }) {
  return (
    <span className={`grid place-items-center bg-[#ff0000] ${small ? "h-9 w-[52px] rounded-[10px]" : "h-12 w-[68px] rounded-xl lg:h-[50px] lg:w-[72px] lg:rounded-[14px]"}`}>
      <svg viewBox="0 0 20 22" aria-hidden className={`ml-1 fill-white ${small ? "h-4 w-[15px]" : "h-[22px] w-5"}`}>
        <path d="M0 0 20 11 0 22Z" />
      </svg>
    </span>
  );
}

function Frame({ story, children }: { story: Story; children: React.ReactNode }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[18px] bg-navy shadow-[0_12px_32px_rgba(6,47,80,0.18)] lg:rounded-[22px] ${
        tall(story) ? "aspect-[9/16]" : "aspect-video"
      }`}
    >
      {children}
    </div>
  );
}

function Still({ story, small }: { story: Story; small?: boolean }) {
  return (
    <>
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
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 motion-safe:transition group-hover:scale-105">
        <PlayMark small={small} />
      </span>
      {story.name || story.detail ? (
        <span className="absolute inset-x-0 bottom-0 px-4 pb-4 text-left lg:px-5 lg:pb-5">
          {story.name ? <span className="block text-sm font-semibold leading-5 text-white lg:text-base">{story.name}</span> : null}
          {story.detail ? <span className="block text-xs leading-4 text-white/85">{story.detail}</span> : null}
        </span>
      ) : null}
    </>
  );
}

const sideArrow =
  "absolute top-1/2 z-10 hidden size-[52px] -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-[0_6px_18px_rgba(6,47,80,0.18)] hover:bg-mist motion-safe:transition lg:grid";
const smallArrow = "grid size-9 place-items-center rounded-full bg-white text-navy shadow-[0_4px_12px_rgba(6,47,80,0.16)] lg:hidden";

/**
 * Driver stories, each in a card of its video's shape. The middle one plays: on its own, muted,
 * once the section is half in view for a moment, and from the start with sound when tapped. When it
 * ends the next one takes over. Only the middle card ever holds a player; the others are stills.
 */
export function TestimonialReel({ stories, copy }: { stories: Story[]; copy: StoryCopy }) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const inView = useRef(false);
  const soundOn = useRef(false);
  const touch = useRef<number | null>(null);
  const many = stories.length > 1;
  const current = stories[index];

  const count = stories.length;
  const go = (to: number) => setIndex((to + count) % count);

  // Start once the section has been at least half in view for a beat, so a fast scroll past it
  // never starts a player; leaving pauses it and coming back carries on.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let dwell = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        inView.current = visible;
        window.clearTimeout(dwell);
        if (visible) {
          dwell = window.setTimeout(() => {
            setStarted(true);
            player.current?.playVideo();
          }, 250);
        } else {
          player.current?.pauseVideo();
        }
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(el);
    return () => {
      window.clearTimeout(dwell);
      observer.disconnect();
    };
  }, []);

  // One player, for the middle story only; a new story takes the old player down first.
  const story = stories[index];
  // Another video on the page starting pauses this one.
  const others = useRef<ReturnType<typeof joinPlayers> | null>(null);
  useEffect(() => {
    const joined = joinPlayers(() => player.current?.pauseVideo());
    others.current = joined;
    return joined.leave;
  }, []);

  useEffect(() => {
    const box = host.current;
    if (!started || !box) return;
    // False once this player is gone: a late API load or event from it is then ignored.
    let alive = true;
    const mount = document.createElement("div");
    box.replaceChildren(mount);
    let made: YTPlayer | null = null;
    let fallback = 0;

    loadApi()
      .then((YT) => {
        if (!alive) return;
        made = new YT.Player(mount, {
          host: "https://www.youtube-nocookie.com",
          videoId: story.id,
          width: "100%",
          height: "100%",
          playerVars: { autoplay: 1, mute: soundOn.current ? 0 : 1, playsinline: 1, rel: 0, modestbranding: 1 },
          events: {
            onReady: (e: YTEvent) => {
              if (!alive) return;
              if (soundOn.current) e.target.unMute();
              else e.target.mute();
              if (!inView.current) {
                e.target.pauseVideo();
                return;
              }
              e.target.playVideo();
              // A browser may refuse sound without a fresh tap: it then plays muted instead.
              fallback = window.setTimeout(() => {
                if (!alive) return;
                const state = e.target.getPlayerState();
                if (state !== YT.PlayerState.PLAYING && state !== YT.PlayerState.BUFFERING && inView.current) {
                  soundOn.current = false;
                  setMuted(true);
                  e.target.mute();
                  e.target.playVideo();
                }
              }, 1500);
            },
            onStateChange: (e: YTEvent) => {
              if (!alive) return;
              if (e.data === YT.PlayerState.PLAYING) {
                setReady(true);
                others.current?.claim();
              }
              // The story ended: the next one takes the middle, and its own player starts it.
              if (e.data === YT.PlayerState.ENDED) setIndex((i) => (i + 1) % count);
            },
          },
        });
        player.current = made;
      })
      .catch(() => {
        // The still stays up with its play button; nothing else to do.
      });

    return () => {
      alive = false;
      window.clearTimeout(fallback);
      player.current = null;
      setReady(false);
      try {
        made?.destroy();
      } catch {
        // Already gone with the page.
      }
      box.replaceChildren();
    };
  }, [started, story.id, count]);

  function playWithSound() {
    soundOn.current = true;
    setMuted(false);
    if (player.current) {
      player.current.unMute();
      player.current.setVolume(100);
      player.current.playVideo();
    }
    setStarted(true);
  }

  const prev = stories.length > 2 ? stories[(index - 1 + stories.length) % stories.length] : null;
  const next = many ? stories[(index + 1) % stories.length] : null;
  const label = current.name ? fill(copy.play, { name: current.name }) : copy.playAnon;

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={copy.region}
      onKeyDown={(e) => {
        if (!many) return;
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
      className="mx-auto mt-6 max-w-[1184px] lg:mt-12"
    >
      <div
        // The tallest card's height, so changing story never moves the page.
        className="relative flex min-h-[427px] items-center justify-center gap-6 sm:min-h-[534px] lg:min-h-[614px] lg:gap-10 lg:px-[60px]"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null || !many) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          touch.current = null;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        }}
      >
        {prev ? (
          <button type="button" aria-label={copy.previous} onClick={() => go(index - 1)} className="group hidden w-[200px] shrink-0 opacity-60 hover:opacity-90 motion-safe:transition lg:block">
            <Frame story={prev}>
              <Still story={prev} small />
            </Frame>
          </button>
        ) : null}

        <div className={`shrink-0 ${tall(current) ? "w-[240px] sm:w-[300px] lg:w-[345px]" : "w-full sm:w-[560px]"}`}>
          <Frame story={current}>
            <div
              ref={host}
              className={
                current.shape === "vertical"
                  ? // A 9:16 card is 16/9 x 16/9 = 3.16 times narrower than a 16:9 player of its height.
                    "absolute inset-0 [&>*]:absolute [&>*]:left-1/2 [&>*]:top-0 [&>*]:h-full [&>*]:w-[316.05%] [&>*]:-translate-x-1/2"
                  : "absolute inset-0 [&>*]:absolute [&>*]:inset-0 [&>*]:size-full"
              }
            />
            {ready ? null : (
              <button type="button" onClick={playWithSound} aria-label={label} className="group absolute inset-0">
                <Still story={current} />
              </button>
            )}
            {ready && muted ? (
              <button
                type="button"
                onClick={playWithSound}
                className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-navy"
              >
                <VolumeX aria-hidden size={14} />
                {copy.tapForSound}
              </button>
            ) : null}
          </Frame>
        </div>

        {next ? (
          <button type="button" aria-label={copy.next} onClick={() => go(index + 1)} className="group hidden w-[200px] shrink-0 opacity-60 hover:opacity-90 motion-safe:transition lg:block">
            <Frame story={next}>
              <Still story={next} small />
            </Frame>
          </button>
        ) : null}

        {many ? (
          <>
            <button type="button" aria-label={copy.previous} onClick={() => go(index - 1)} className={`${sideArrow} left-0`}>
              <ChevronLeft size={22} />
            </button>
            <button type="button" aria-label={copy.next} onClick={() => go(index + 1)} className={`${sideArrow} right-0`}>
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
        <div className="mt-4 flex items-center justify-center gap-3 lg:mt-6">
          <button type="button" aria-label={copy.previous} onClick={() => go(index - 1)} className={smallArrow}>
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {stories.map((s, i) => (
              <button
                key={s.id + i}
                type="button"
                aria-label={fill(copy.story, { n: i + 1 })}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
                className={`h-2 rounded-full motion-safe:transition-all ${i === index ? "w-7 bg-navy" : "w-2 bg-navy/20"}`}
              />
            ))}
          </div>
          <button type="button" aria-label={copy.next} onClick={() => go(index + 1)} className={smallArrow}>
            <ChevronRight size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
