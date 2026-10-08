/* The YouTube IFrame API, shared by every player on a page. */

export type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setVolume(volume: number): void;
  getPlayerState(): number;
  destroy(): void;
};
export type YTEvent = { target: YTPlayer; data: number };
export type YTApi = {
  Player: new (el: HTMLElement, options: Record<string, unknown>) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number };
};

declare global {
  interface Window {
    YT?: YTApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let api: Promise<YTApi> | null = null;

/** The IFrame API, loaded once per page; it is what reports a video ending. */
export function loadApi(): Promise<YTApi> {
  if (api) return api;
  api = new Promise<YTApi>((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      api = null;
      reject(new Error("The YouTube player could not load"));
    };
    document.head.appendChild(script);
  });
  return api;
}

/* One video plays at a time: a player that starts asks every other one on the page to pause. */
const pausers = new Set<() => void>();

/** Joins the page's players. `claim` pauses the others; `leave` takes this one out again. */
export function joinPlayers(pause: () => void) {
  pausers.add(pause);
  return {
    claim: () => pausers.forEach((other) => other !== pause && other()),
    leave: () => {
      pausers.delete(pause);
    },
  };
}
