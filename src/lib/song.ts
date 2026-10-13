// Controls the SoundCloud embed through its Widget API so the song can
// start exactly when the seal is opened and fade in gently.

export const trackUrl = "https://soundcloud.com/ocahhycucqfd/vzo6gyzcmgys";

export const embedUrl = `https://w.soundcloud.com/player/?${new URLSearchParams(
  {
    url: trackUrl,
    color: "#b4525f",
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_teaser: "false",
    visual: "false",
  },
)}`;

type Widget = {
  bind: (event: string, handler: () => void) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  isPaused: (callback: (paused: boolean) => void) => void;
};

type WidgetApi = ((iframe: HTMLIFrameElement) => Widget) & {
  Events: { READY: string; PLAY: string; PAUSE: string; FINISH: string };
};

declare global {
  interface Window {
    SC?: { Widget: WidgetApi };
  }
}

let apiPromise: Promise<WidgetApi | null> | null = null;

function loadApi(): Promise<WidgetApi | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.SC?.Widget) return Promise.resolve(window.SC.Widget);
  if (!apiPromise)
    apiPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://w.soundcloud.com/player/api.js";
      script.async = true;
      script.onload = () => resolve(window.SC?.Widget ?? null);
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
  return apiPromise;
}

export type SongState = "idle" | "loading" | "playing" | "paused";

export class Song {
  private widget: Widget | null = null;
  private ready: Promise<Widget | null>;
  private fade: number | null = null;
  state: SongState = "idle";
  onChange: (state: SongState) => void = () => {};

  constructor(iframe: HTMLIFrameElement) {
    this.ready = loadApi().then((api) => {
      if (!api) return null;
      const widget = api(iframe);
      return new Promise<Widget>((resolve) => {
        widget.bind(api.Events.READY, () => {
          widget.bind(api.Events.PLAY, () => this.set("playing"));
          widget.bind(api.Events.PAUSE, () => this.set("paused"));
          widget.bind(api.Events.FINISH, () => this.set("paused"));
          this.widget = widget;
          resolve(widget);
        });
      });
    });
  }

  private set(state: SongState) {
    if (this.state === state) return;
    this.state = state;
    this.onChange(state);
  }

  private fadeTo(target: number, seconds: number) {
    if (!this.widget) return;
    if (this.fade) window.clearInterval(this.fade);
    const widget = this.widget;
    const steps = Math.max(1, Math.round(seconds * 20));
    let step = 0;
    let current = target === 0 ? 85 : 0;
    widget.setVolume(current);
    this.fade = window.setInterval(() => {
      step += 1;
      current = target === 0 ? 85 * (1 - step / steps) : target * (step / steps);
      widget.setVolume(Math.max(0, Math.min(100, current)));
      if (step >= steps && this.fade) {
        window.clearInterval(this.fade);
        this.fade = null;
      }
    }, 50);
  }

  /** Start playing (must be triggered from a user gesture). */
  async play() {
    this.set("loading");
    const widget = await this.ready;
    if (!widget) {
      this.set("idle");
      return false;
    }
    widget.setVolume(0);
    widget.play();
    this.fadeTo(85, 2.6);
    return true;
  }

  async pause() {
    const widget = await this.ready;
    if (!widget) return;
    this.fadeTo(0, 0.6);
    window.setTimeout(() => widget.pause(), 650);
  }

  toggle() {
    if (this.state === "playing" || this.state === "loading") this.pause();
    else this.play();
  }

  dispose() {
    if (this.fade) window.clearInterval(this.fade);
    this.onChange = () => {};
  }
}
