"use client";

import { useEffect, useRef, useState } from "react";
import { VolumeX } from "lucide-react";
import { joinPlayers, loadApi, type YTPlayer } from "./youtube-api";

/* Player states from the IFrame API, needed before the API itself has loaded. */
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
const BUFFERING = 3;
/** Sound level out of 100: the video plays under the page, not over it. */
const VOLUME = 30;

/**
 * A YouTube video behind its own still. The player loads once the frame is near the screen and
 * starts when the frame is half in view: with sound where the browser allows it, otherwise muted
 * with a Tap For Sound button. Leaving pauses it; coming back carries on, unless the visitor
 * paused it themselves. Reduced motion never starts it on its own.
 */
export function WhyVideo({
  id,
  title,
  label,
  tapForSound,
  className,
  children,
}: {
  id: string;
  /** The player frame's accessible name. */
  title: string;
  /** The still's play button, for screen readers. */
  label: string;
  /** The button that turns the sound on when the browser started it muted. */
  tapForSound: string;
  className: string;
  /** The still shown until the first frame plays. */
  children: React.ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const inView = useRef(false);
  /** Start (or carry on) when the frame comes into view. */
  const autoplay = useRef(true);
  /** Try for sound; false once the browser has refused it. */
  const sound = useRef(true);
  /** The visitor tapped for sound, so the browser allows it. */
  const tapped = useRef(false);
  /** A play asked for before the player was ready. */
  const queued = useRef(false);
  /** Our own pauses, so they are not mistaken for the visitor's. */
  const ownPause = useRef(false);
  const check = useRef(0);
  const others = useRef<ReturnType<typeof joinPlayers> | null>(null);

  function pause() {
    const p = player.current;
    if (!p) return;
    const state = p.getPlayerState();
    if (state !== PLAYING && state !== BUFFERING) return;
    ownPause.current = true;
    autoplay.current = true;
    p.pauseVideo();
  }

  /** Plays, with sound if wanted; if the browser holds it back, plays muted instead. */
  function start() {
    const p = player.current;
    if (!p) {
      queued.current = true;
      return;
    }
    window.clearTimeout(check.current);
    if (sound.current) {
      p.unMute();
      p.setVolume(VOLUME);
    } else {
      p.mute();
    }
    p.playVideo();
    if (!sound.current || tapped.current) return;
    let waits = 0;
    const verify = () => {
      const state = p.getPlayerState();
      if (state === PLAYING) {
        // Some browsers play it but force the sound off.
        if (p.isMuted()) {
          sound.current = false;
          setMuted(true);
        }
        return;
      }
      if (state === BUFFERING && ++waits < 3) {
        check.current = window.setTimeout(verify, 1000);
        return;
      }
      if (!inView.current) return;
      sound.current = false;
      setMuted(true);
      p.mute();
      p.playVideo();
    };
    check.current = window.setTimeout(verify, 1200);
  }

  function playWithSound() {
    tapped.current = true;
    sound.current = true;
    autoplay.current = true;
    setMuted(false);
    setNear(true);
    const p = player.current;
    if (p?.getPlayerState() === ENDED) p.seekTo(0, true);
    start();
  }

  // Load the player when the frame is near; play while it is at least half in view.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) autoplay.current = false;
    let dwell = 0;
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        nearby.disconnect();
        // Never ahead of the page's own first load.
        if (document.readyState === "complete") setNear(true);
        else window.addEventListener("load", () => setNear(true), { once: true });
      },
      { rootMargin: "300px 0px" }
    );
    const visible = new IntersectionObserver(
      ([entry]) => {
        const shown = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        inView.current = shown;
        window.clearTimeout(dwell);
        if (shown) {
          // A beat first, so a fast scroll past never starts it.
          if (autoplay.current) dwell = window.setTimeout(start, 250);
        } else {
          pause();
        }
      },
      { threshold: [0, 0.5, 1] }
    );
    nearby.observe(el);
    visible.observe(el);
    others.current = joinPlayers(pause);
    return () => {
      window.clearTimeout(dwell);
      window.clearTimeout(check.current);
      nearby.disconnect();
      visible.disconnect();
      others.current?.leave();
    };
    // start and pause read refs only, so the first render's copies stay correct.
  }, []);

  // The player itself: our own frame, so it carries exactly the permissions it needs.
  useEffect(() => {
    const box = host.current;
    if (!near || !box) return;
    let alive = true;
    let made: YTPlayer | null = null;
    const iframe = document.createElement("iframe");
    const params = new URLSearchParams({
      enablejsapi: "1",
      playsinline: "1",
      rel: "0",
      modestbranding: "1",
      origin: window.location.origin,
    });
    iframe.title = title;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.className = "absolute inset-0 size-full";
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?${params}`;
    box.replaceChildren(iframe);

    loadApi()
      .then((YT) => {
        if (!alive) return;
        made = new YT.Player(iframe, {
          host: "https://www.youtube-nocookie.com",
          events: {
            onReady: () => {
              if (!alive) return;
              player.current = made;
              made?.setVolume(VOLUME);
              if (queued.current || (inView.current && autoplay.current)) {
                queued.current = false;
                start();
              }
            },
            onStateChange: (e: { data: number }) => {
              if (!alive) return;
              if (e.data === PLAYING) {
                setPlaying(true);
                others.current?.claim();
              }
              if (e.data === PAUSED) {
                // A pause we did not make is the visitor's: it stays paused until they play it.
                if (ownPause.current) ownPause.current = false;
                else autoplay.current = false;
              }
              if (e.data === ENDED) {
                autoplay.current = false;
                setPlaying(false);
              }
            },
          },
        });
      })
      .catch(() => {
        // The still stays up with its play button.
      });

    return () => {
      alive = false;
      player.current = null;
      try {
        made?.destroy();
      } catch {
        // Already gone with the page.
      }
      box.replaceChildren();
    };
  }, [near, id, title]);

  return (
    <div ref={frame} className={className}>
      <div ref={host} className="absolute inset-0" />
      <button
        type="button"
        onClick={playWithSound}
        aria-label={label}
        tabIndex={playing ? -1 : undefined}
        aria-hidden={playing || undefined}
        className={`group absolute inset-0 transition-opacity duration-300 ${playing ? "pointer-events-none opacity-0" : ""}`}
      >
        {children}
        <span className="absolute left-1/2 top-1/2 grid h-12 w-[68px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl bg-[#ff0000] group-hover:scale-105 motion-safe:transition xl:h-[50px] xl:w-[72px] xl:rounded-[14px]">
          <svg viewBox="0 0 20 22" aria-hidden className="ml-1 h-[25px] w-[22px] fill-white xl:ml-0 xl:h-[21px] xl:w-[19px]">
            <path d="M0 0 20 11 0 22z" />
          </svg>
        </span>
      </button>
      {playing && muted ? (
        <button
          type="button"
          onClick={playWithSound}
          className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-navy"
        >
          <VolumeX aria-hidden size={14} />
          {tapForSound}
        </button>
      ) : null}
    </div>
  );
}
