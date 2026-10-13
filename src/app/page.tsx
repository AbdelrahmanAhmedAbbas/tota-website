"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import gsap from "gsap";
import story from "../data/letter.json";
import {
  EnvelopeFlapFace,
  EnvelopeFront,
  Heart,
  Ornament,
  Petal,
  PromiseDrawing,
  RoseBranch,
  Sparkle,
} from "./illustrations";
import * as sfx from "../lib/sfx";
import { Song, embedUrl, trackUrl, type SongState } from "../lib/song";

const pageStops = [0.38, 0.62, 0.87];
const pageStarts = [0.28, 0.51, 0.74];

// Decorative layers. Values are fixed so server and client render the same markup.
const petals = [
  { x: 4, delay: 0, duration: 15, size: 16, front: false },
  { x: 12, delay: 4, duration: 18, size: 22, front: true },
  { x: 21, delay: 9, duration: 14, size: 14, front: false },
  { x: 30, delay: 2, duration: 20, size: 18, front: false },
  { x: 38, delay: 11, duration: 16, size: 24, front: true },
  { x: 47, delay: 6, duration: 19, size: 15, front: false },
  { x: 55, delay: 13, duration: 15, size: 20, front: true },
  { x: 63, delay: 1, duration: 21, size: 17, front: false },
  { x: 70, delay: 8, duration: 17, size: 13, front: false },
  { x: 78, delay: 5, duration: 14, size: 23, front: true },
  { x: 86, delay: 12, duration: 19, size: 16, front: false },
  { x: 93, delay: 3, duration: 16, size: 19, front: true },
  { x: 25, delay: 15, duration: 18, size: 12, front: false },
  { x: 66, delay: 17, duration: 15, size: 21, front: true },
];
const bokeh = [
  { x: 8, y: 22, size: 150, delay: 0 },
  { x: 86, y: 18, size: 110, delay: 3 },
  { x: 72, y: 70, size: 190, delay: 6 },
  { x: 18, y: 76, size: 120, delay: 2 },
  { x: 50, y: 40, size: 260, delay: 8 },
  { x: 92, y: 55, size: 90, delay: 5 },
];
const twinkles = [
  { x: 15, y: 30, size: 14, delay: 0 },
  { x: 82, y: 26, size: 10, delay: 1.3 },
  { x: 26, y: 62, size: 9, delay: 2.1 },
  { x: 76, y: 66, size: 16, delay: 0.7 },
  { x: 60, y: 24, size: 8, delay: 2.9 },
  { x: 40, y: 80, size: 12, delay: 1.8 },
  { x: 90, y: 82, size: 9, delay: 3.4 },
  { x: 8, y: 50, size: 11, delay: 2.5 },
];

const burstColors = ["#f6b8c1", "#f9d2c3", "#e9a0ad", "#f3d9a8", "#fff1e6", "#e8c3d6"];

function burstPetals(container: HTMLElement | null) {
  if (!container) return;
  const count = 26;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "burst-petal";
    petal.style.background = burstColors[i % burstColors.length];
    container.appendChild(petal);
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const distance = 110 + Math.random() * 190;
    gsap.fromTo(
      petal,
      {
        x: 0,
        y: 0,
        scale: 0.5 + Math.random() * 0.7,
        rotation: Math.random() * 360,
        opacity: 1,
      },
      {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 90,
        rotation: `+=${200 + Math.random() * 400}`,
        opacity: 0,
        duration: 1.4 + Math.random() * 0.9,
        ease: "power3.out",
        onComplete: () => petal.remove(),
      },
    );
  }
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const journey = useRef<HTMLElement>(null);
  const burst = useRef<HTMLDivElement>(null);
  const songFrame = useRef<HTMLIFrameElement>(null);
  const song = useRef<Song | null>(null);
  const scrollRange = useRef({ start: 0, end: 0 });
  const desiredFocus = useRef<number | null>(null);
  const lastProgress = useRef(0);
  const skipSealSound = useRef(false);
  const navigateScroll = useRef<((top: number, seconds?: number) => void) | null>(
    null,
  );
  const navigationTween = useRef<gsap.core.Tween | null>(null);
  const pageHeading = useRef<HTMLHeadingElement[]>([]);
  const transcriptHeading = useRef<HTMLHeadingElement>(null);
  const transcriptButton = useRef<HTMLButtonElement>(null);
  const previousTranscript = useRef(false);
  const [page, setPage] = useState(0);
  const [opened, setOpened] = useState(false);
  const [songState, setSongState] = useState<SongState>("idle");
  const [player, setPlayer] = useState(false);
  const [sfxMuted, setSfxMuted] = useState(false);
  const [transcript, setTranscript] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  // The song is controlled through the SoundCloud widget so it can start
  // together with the opening animation.
  useEffect(() => {
    if (!songFrame.current) return;
    const instance = new Song(songFrame.current);
    instance.onChange = setSongState;
    song.current = instance;
    return () => {
      instance.dispose();
      song.current = null;
    };
  }, []);

  // Any click or key press unlocks sound; buttons get a soft click.
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const unlock = () => sfx.unlockSound();
    const onClick = (event: Event) => {
      const target = (event.target as Element | null)?.closest("button, a");
      if (!target) return;
      sfx.unlockSound();
      if (!target.classList.contains("envelope-seal")) sfx.softClick();
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    element.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      element.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let context: gsap.Context | undefined;
    let media: gsap.MatchMedia | undefined;
    Promise.all([
      import("gsap/ScrollTrigger"),
      import("gsap/ScrollToPlugin"),
    ]).then(([{ ScrollTrigger }, { ScrollToPlugin }]) => {
      if (disposed || !root.current || !journey.current) return;
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      navigateScroll.current = (top, seconds = 1.9) => {
        navigationTween.current?.kill();
        navigationTween.current = gsap.to(window, {
          scrollTo: { y: top, autoKill: true },
          duration: seconds,
          ease: "power3.inOut",
          overwrite: "auto",
        });
      };
      context = gsap.context(() => {
        media = gsap.matchMedia();
        media.add(
          "(prefers-reduced-motion: no-preference) and (min-height: 501px)",
          () => {
            // Sound cues tied to moments in the opening. `up` cues only
            // play while moving forward; the others also play in reverse.
            const cues: { at: number; up?: boolean; play: () => void }[] = [
              {
                at: 0.065,
                up: true,
                play: () => {
                  if (skipSealSound.current) skipSealSound.current = false;
                  else sfx.sealPop();
                },
              },
              { at: 0.09, play: sfx.paperRustle },
              { at: 0.145, up: true, play: sfx.whoosh },
              { at: 0.2, up: true, play: () => burstPetals(burst.current) },
              { at: 0.275, up: true, play: sfx.sparkle },
              { at: pageStarts[1], play: sfx.pageTurn },
              { at: pageStarts[2], play: sfx.pageTurn },
            ];
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: journey.current,
                start: "top top+=72",
                end: "bottom bottom",
                scrub: 1.2,
                invalidateOnRefresh: true,
                onRefresh: (self) => {
                  scrollRange.current = { start: self.start, end: self.end };
                },
                onUpdate: (self) => {
                  const progress = self.progress;
                  const previous = lastProgress.current;
                  cues.forEach((cue) => {
                    const forward = previous < cue.at && progress >= cue.at;
                    const backward = previous >= cue.at && progress < cue.at;
                    if (forward || (!cue.up && backward)) cue.play();
                  });
                  lastProgress.current = progress;
                  setOpened(progress > 0.22);
                  setPage(progress < 0.49 ? 0 : progress < 0.72 ? 1 : 2);
                },
                onScrubComplete: () => {
                  if (desiredFocus.current !== null) {
                    pageHeading.current[desiredFocus.current]?.focus({
                      preventScroll: true,
                    });
                    desiredFocus.current = null;
                  }
                },
              },
            });
            tl.set(
              ".reader-paper",
              {
                scale: 0.38,
                rotation: -7,
                opacity: 0,
                y: () => window.innerHeight * 0.18,
              },
              0,
            );
            tl.set(".envelope-flap", { transformOrigin: "50% 0%" }, 0);
            tl.set(".reader-contents, .reader-label", { opacity: 0 }, 0);
            tl.set(".folio-controls", { autoAlpha: 0 }, 0);
            tl.set(".folio-page", { autoAlpha: 0 }, 0);
            tl.to(
              ".journey-intro, .scroll-invitation",
              { y: -35, autoAlpha: 0, duration: 0.07 },
              0.015,
            );
            tl.to(
              ".envelope-seal",
              { scale: 1.14, rotation: 12, duration: 0.025 },
              0.04,
            );
            tl.to(
              ".envelope-seal",
              { y: -90, x: 34, rotation: 40, opacity: 0, duration: 0.045 },
              0.065,
            );
            tl.to(
              ".envelope-flap",
              { rotationX: -180, duration: 0.075, ease: "power2.inOut" },
              0.09,
            );
            tl.to(".envelope-glint", { opacity: 0, duration: 0.03 }, 0.09);
            tl.to(
              ".reader-paper",
              {
                y: () => -window.innerHeight * 0.13,
                opacity: 1,
                rotation: -3,
                duration: 0.075,
                ease: "power2.out",
              },
              0.14,
            );
            tl.to(
              ".envelope-shell",
              {
                y: () => window.innerHeight * 0.5,
                opacity: 0,
                rotation: 6,
                duration: 0.085,
              },
              0.2,
            );
            tl.to(
              ".reader-paper",
              {
                scale: 1,
                y: 0,
                rotation: 0,
                duration: 0.12,
                ease: "power3.inOut",
              },
              0.21,
            );
            tl.to(
              ".paper-address, .paper-fold",
              { opacity: 0, duration: 0.07 },
              0.23,
            );
            tl.to(
              ".reader-contents, .reader-label",
              { opacity: 1, duration: 0.04 },
              0.27,
            );
            tl.to(".folio-controls", { autoAlpha: 1, duration: 0.04 }, 0.3);
            story.pages.forEach((_, index) => {
              const selector = `.folio-page-${index}`;
              const start = pageStarts[index];
              tl.fromTo(
                selector,
                { autoAlpha: 0, x: 35, rotationY: 4 },
                { autoAlpha: 1, x: 0, rotationY: 0, duration: 0.035 },
                start,
              );
              tl.fromTo(
                `${selector} .folio-ornament`,
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 0.03 },
                start + 0.012,
              );
              tl.fromTo(
                `${selector} .letter-word`,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.012, stagger: 0.00055 },
                start + 0.015,
              );
              tl.fromTo(
                `${selector} .folio-note`,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.025 },
                start + 0.065,
              );
              if (index < 2) {
                tl.to(
                  selector,
                  { autoAlpha: 0, x: -35, rotationY: -5, duration: 0.035 },
                  start + 0.185,
                );
                tl.to(
                  ".reader-paper",
                  { rotationY: -3, rotation: 1, duration: 0.02 },
                  start + 0.18,
                );
                tl.to(
                  ".reader-paper",
                  { rotationY: 0, rotation: 0, duration: 0.025 },
                  start + 0.2,
                );
              }
            });
            tl.to(
              ".reader-paper",
              { y: -20, scale: 0.98, duration: 0.08 },
              0.92,
            );
            gsap.fromTo(
              ".rose-branch",
              { y: 30 },
              {
                y: -110,
                ease: "none",
                scrollTrigger: {
                  trigger: journey.current,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 1,
                },
              },
            );
            gsap.utils
              .toArray<HTMLElement>(".promise-row")
              .forEach((row, index) => {
                const reveal = gsap.timeline({
                  scrollTrigger: {
                    trigger: row,
                    start: "top 85%",
                    end: "center 48%",
                    scrub: 1.3,
                  },
                });
                reveal.fromTo(
                  row.querySelector(".promise-illustration"),
                  {
                    opacity: 0,
                    y: 85,
                    rotation: index % 2 ? -12 : 12,
                    scale: 0.82,
                  },
                  {
                    opacity: 1,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                  },
                  0,
                );
                reveal.fromTo(
                  row.querySelector(".promise-copy"),
                  { opacity: 0, x: index % 2 ? -45 : 45 },
                  { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
                  0.15,
                );
                row
                  .querySelectorAll<SVGGeometryElement>(".draw-path")
                  .forEach((path) => {
                    const length = path.getTotalLength();
                    gsap.set(path, { strokeDasharray: length });
                    reveal.fromTo(
                      path,
                      { strokeDashoffset: length },
                      {
                        strokeDashoffset: 0,
                        duration: 1.3,
                        ease: "power2.inOut",
                      },
                      0.1,
                    );
                  });
                reveal.fromTo(
                  row.querySelectorAll(".fill-in, .small-heart"),
                  { opacity: 0, scale: 0.6, transformOrigin: "center" },
                  { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08 },
                  1,
                );
                if (index === 0) {
                  reveal.to(
                    row.querySelector(".clock-hour"),
                    {
                      rotation: 110,
                      transformOrigin: "200px 212px",
                      duration: 1.2,
                    },
                    0.3,
                  );
                  reveal.to(
                    row.querySelector(".clock-minute"),
                    {
                      rotation: 360,
                      transformOrigin: "200px 212px",
                      duration: 1.2,
                    },
                    0.3,
                  );
                }
              });
            gsap.fromTo(
              ".promise-intro h2",
              { opacity: 0, y: 55, rotation: 2 },
              {
                opacity: 1,
                y: 0,
                rotation: 0,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: ".promise-intro",
                  start: "top 90%",
                  end: "center 55%",
                  scrub: 1,
                },
              },
            );
            gsap.fromTo(
              ".closing-heart",
              { scale: 0.3, rotation: -25, opacity: 0 },
              {
                scale: 1,
                rotation: 0,
                opacity: 1,
                scrollTrigger: {
                  trigger: ".closing",
                  start: "top 80%",
                  end: "center 60%",
                  scrub: 1.2,
                  onEnter: () => sfx.heartbeat(),
                },
              },
            );
            gsap.fromTo(
              ".closing h2, .closing p",
              { opacity: 0, y: 35 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.2,
                scrollTrigger: {
                  trigger: ".closing",
                  start: "top 70%",
                  end: "center 45%",
                  scrub: 1.2,
                },
              },
            );
            const refresh = () => ScrollTrigger.refresh();
            document.fonts.ready.then(() => {
              if (!disposed) refresh();
            });
          },
        );
      }, root);
    });
    return () => {
      disposed = true;
      media?.revert();
      context?.revert();
      navigationTween.current?.kill();
      navigateScroll.current = null;
    };
  }, []);

  useEffect(() => {
    if (transcript) {
      transcriptHeading.current?.focus({ preventScroll: true });
      transcriptHeading.current?.scrollIntoView?.({
        block: "start",
        behavior: "instant",
      });
    } else if (previousTranscript.current)
      transcriptButton.current?.focus({ preventScroll: true });
    previousTranscript.current = transcript;
  }, [transcript]);

  const goToPage = useCallback(
    (index: number, addHistory = true, seconds?: number) => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setPage(index);
      setOpened(true);
      if (addHistory)
        window.history.pushState(null, "", `#letter-${index + 1}`);
      const instant =
        reduced || window.innerHeight <= 500 || scrollRange.current.end === 0;
      if (instant) {
        pageHeading.current[index]?.scrollIntoView?.({
          behavior: "instant",
          block: "center",
        });
        pageHeading.current[index]?.focus({ preventScroll: true });
      } else {
        desiredFocus.current = index;
        const range = scrollRange.current;
        navigateScroll.current?.(
          range.start + (range.end - range.start) * pageStops[index],
          seconds,
        );
      }
    },
    [],
  );

  // Tapping the wax seal: the song starts, the seal cracks and the letter opens.
  const openLetter = useCallback(() => {
    sfx.unlockSound();
    sfx.sealPop();
    skipSealSound.current = true;
    song.current?.play();
    goToPage(0, true, 3.2);
  }, [goToPage]);

  useEffect(() => {
    const onBack = () => {
      const match = window.location.hash.match(/^#letter-([123])$/);
      if (match) goToPage(Number(match[1]) - 1, false);
    };
    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, [goToPage]);

  function goToSection(event: MouseEvent<HTMLAnchorElement>) {
    const hash = event.currentTarget.hash;
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    event.preventDefault();
    window.history.pushState(null, "", hash);
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !navigateScroll.current
    )
      window.scrollTo({ top, behavior: "instant" });
    else navigateScroll.current(top);
  }

  function toggleSfx() {
    const next = !sfxMuted;
    setSfxMuted(next);
    sfx.setSoundMuted(next);
  }

  useEffect(() => {
    let cancelled = false;
    let refresh: gsap.core.Tween | undefined;
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (!cancelled)
        refresh = gsap.delayedCall(0.5, () => ScrollTrigger.refresh());
    });
    return () => {
      cancelled = true;
      refresh?.kill();
    };
  }, [expanded, transcript, player]);

  const playing = songState === "playing";
  const songLabel =
    songState === "loading"
      ? "بتبدأ…"
      : playing
        ? "وقّفي الأغنية"
        : "شغّلي أغنيتك";

  return (
    <main dir="rtl" ref={root} className="love-site">
      <header className="site-header">
        <a className="wordmark" href="#top" onClick={goToSection}>
          إلى توتا
          <Heart />
        </a>
        <nav aria-label="أجزاء الرسالة">
          <button type="button" onClick={() => goToPage(0)}>
            الرسالة
          </button>
          <a href="#promise" onClick={goToSection}>
            وعدي ليكي
          </a>
        </nav>
        <div className="sound-controls">
          <button
            type="button"
            className="sfx-button"
            onClick={toggleSfx}
            aria-pressed={sfxMuted}
            aria-label={sfxMuted ? "تشغيل المؤثرات الصوتية" : "كتم المؤثرات الصوتية"}
            title={sfxMuted ? "تشغيل المؤثرات" : "كتم المؤثرات"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
              {sfxMuted ? (
                <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              )}
            </svg>
          </button>
          <button
            type="button"
            className="music-button"
            data-playing={playing}
            onClick={() => song.current?.toggle()}
            aria-pressed={playing}
            aria-label={songLabel}
          >
            <span className="equalizer" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="music-label">{songLabel}</span>
          </button>
          <button
            type="button"
            className="player-toggle"
            onClick={() => setPlayer(!player)}
            aria-expanded={player}
            aria-controls="our-song"
            aria-label={player ? "اقفلي المشغّل" : "افتحي المشغّل"}
            title="المشغّل"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </header>
      <aside
        id="our-song"
        className="song-panel"
        data-open={player}
        inert={!player}
        aria-label="مشغّل الأغنية"
      >
        <div className="song-panel-top">
          <span className="equalizer" data-playing={playing} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>{playing ? "أغنيتنا بتشتغل ليكي" : "أغنيتنا"}</span>
        </div>
        <iframe
          ref={songFrame}
          title="أغنيتنا من ساوندكلاود"
          src={embedUrl}
          allow="autoplay"
          height="120"
        />
        <a href={trackUrl} target="_blank" rel="noreferrer">
          افتحي في ساوندكلاود ↗
        </a>
      </aside>
      <section
        className="letter-journey"
        id="top"
        ref={journey}
        data-opened={opened}
        aria-label="الظرف والرسالة"
      >
        <div className="journey-sticky">
          <div className="sky" aria-hidden="true">
            <span className="aurora aurora-1" />
            <span className="aurora aurora-2" />
            <span className="aurora aurora-3" />
            {bokeh.map((light, i) => (
              <span
                key={i}
                className="bokeh"
                style={
                  {
                    "--x": `${light.x}%`,
                    "--y": `${light.y}%`,
                    "--size": `${light.size}px`,
                    "--delay": `${light.delay}s`,
                  } as CSSProperties
                }
              />
            ))}
            {twinkles.map((star, i) => (
              <span
                key={i}
                className="twinkle"
                style={
                  {
                    "--x": `${star.x}%`,
                    "--y": `${star.y}%`,
                    "--size": `${star.size}px`,
                    "--delay": `${star.delay}s`,
                  } as CSSProperties
                }
              >
                <Sparkle />
              </span>
            ))}
          </div>
          <div className="petal-field" aria-hidden="true">
            {petals.map((petal, i) => (
              <span
                key={i}
                className={`petal-drift${petal.front ? " is-front" : ""}`}
                style={
                  {
                    "--x": `${petal.x}%`,
                    "--delay": `-${petal.delay}s`,
                    "--duration": `${petal.duration}s`,
                    "--size": `${petal.size}px`,
                  } as CSSProperties
                }
              >
                <Petal className="petal" />
              </span>
            ))}
          </div>
          <div className="rose-branch branch-right" aria-hidden="true">
            <RoseBranch />
          </div>
          <div className="rose-branch branch-left" aria-hidden="true">
            <RoseBranch mirrored />
          </div>
          <div className="journey-intro">
            <p className="eyebrow">في حاجات بنحسّها، ومش بنقولها كفاية</p>
            <h1>
              يا توتا،<em>في كلام ليكي.</em>
            </h1>
            <Ornament className="intro-ornament" />
            <p className="intro-note">شكر، وحب، ووعد من قلبي.</p>
          </div>
          <div className="envelope-shell">
            <div className="envelope-back" aria-hidden="true" />
            <div className="envelope-flap" aria-hidden="true">
              <EnvelopeFlapFace />
              <EnvelopeFlapFace liner />
            </div>
            <EnvelopeFront />
            <div className="envelope-glint" aria-hidden="true" />
            <button
              type="button"
              className="envelope-seal"
              onClick={openLetter}
              aria-label="افتحي الرسالة"
            >
              <span className="seal-ring" aria-hidden="true" />
              <span className="seal-ring seal-ring-two" aria-hidden="true" />
              <span className="seal-wax" aria-hidden="true">
                <Heart />
              </span>
            </button>
            <span className="envelope-address" aria-hidden="true">
              لتوتا، مخصوص ليكي
            </span>
            <div className="burst" ref={burst} aria-hidden="true" />
          </div>
          <div className="reader-paper">
            <div className="paper-grain" aria-hidden="true" />
            <Heart className="paper-watermark" />
            <div className="paper-address">
              إلى توتا
              <Heart />
            </div>
            <div className="paper-fold fold-one" />
            <div className="paper-fold fold-two" />
            <div className="reader-contents">
              {story.pages.map((item, index) => (
                <article
                  key={item.number}
                  className={`folio-page folio-page-${index}`}
                >
                  <div className="folio-top">
                    <span>{item.label}</span>
                    <span>{item.number} / ٠٣</span>
                  </div>
                  <h2
                    id={`letter-${index + 1}`}
                    tabIndex={-1}
                    ref={(element) => {
                      if (element) pageHeading.current[index] = element;
                    }}
                  >
                    {item.title}
                  </h2>
                  <Ornament className="folio-ornament" />
                  {item.paragraphs.map((text) => (
                    <p key={text}>
                      {text.split(" ").map((word, i) => (
                        <span className="letter-word" key={i}>
                          {word}{" "}
                        </span>
                      ))}
                    </p>
                  ))}
                  <p className="folio-note">{item.note}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="reader-label" aria-hidden="true">
            على مهلك… كل الكلام ده ليكي.
          </div>
          <div className="scroll-invitation">
            <p className="invitation-main">
              <Sparkle />
              اضغطي على الختم… وافتحي رسالتك
              <Sparkle />
            </p>
            <p>أو اسكرولي على مهلك، وخلي الحكاية تتفتح</p>
            <span className="scroll-cue" aria-hidden="true">
              <i />
            </span>
          </div>
          <div className="folio-controls">
            <button
              type="button"
              onClick={() => goToPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              → اللي قبلها
            </button>
            <div className="folio-dots" aria-label="صفحات الرسالة">
              {story.pages.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  aria-label={`صفحة ${index + 1}`}
                  aria-current={page === index ? "page" : undefined}
                  onClick={() => goToPage(index)}
                />
              ))}
            </div>
            {page < 2 ? (
              <button type="button" onClick={() => goToPage(page + 1)}>
                اللي بعدها ←
              </button>
            ) : (
              <a href="#promise" onClick={goToSection}>
                اقري وعدي ←
              </a>
            )}
          </div>
        </div>
      </section>
      <section
        id="promise"
        className="promises"
        aria-labelledby="promise-title"
      >
        <div className="promise-intro">
          <span className="eyebrow">اللي جاي أحلى، بإذن الله</span>
          <h2 id="promise-title">
            وعد يتشاف.
            <br />
            <em>مش بس يتقال.</em>
          </h2>
          <p>
            لأنك تستاهلي اهتمام تحسّي بيه،
            <br />
            وحب يبان في التفاصيل الصغيرة.
          </p>
          <button type="button" onClick={() => goToPage(2)}>
            → ارجعي للرسالة
          </button>
        </div>
        <div className="promise-stories">
          {story.promises.map((promise, index) => (
            <article
              className={`promise-row promise-row-${index}`}
              key={promise.number}
            >
              <div className="promise-illustration">
                <span className="illustration-orbit" />
                <span className="illustration-glow" />
                <PromiseDrawing index={index} />
                <span className="illustration-note">
                  {["وقتنا، لينا.", "راحة وسند.", "حب في التفاصيل."][index]}
                </span>
              </div>
              <div className="promise-copy">
                <span className="promise-number">وعد {promise.number}</span>
                <h3>{promise.title}</h3>
                <p>{promise.body}</p>
                <button
                  type="button"
                  className="promise-toggle"
                  aria-expanded={expanded === index}
                  aria-controls={`promise-detail-${index}`}
                  onClick={() => {
                    if (expanded !== index) sfx.sparkle();
                    setExpanded(expanded === index ? null : index);
                  }}
                >
                  ومن قلبي كمان
                  <span aria-hidden="true">
                    {expanded === index ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`promise-detail${expanded === index ? " is-open" : ""}`}
                  id={`promise-detail-${index}`}
                >
                  <div>
                    <p>{promise.caption}</p>
                    <Heart />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="closing" aria-labelledby="closing-title">
        <span className="closing-ring" aria-hidden="true" />
        <span className="closing-ring ring-two" aria-hidden="true" />
        <Heart className="closing-heart" />
        <p className="eyebrow">آخر الكلام وأهمّه</p>
        <h2 id="closing-title">
          ربنا يخلّيكي لينا،<em>يا أجمل حاجة في بيتنا.</em>
        </h2>
        <p className="closing-note">بحبك، في كل الأيام.</p>
        <a className="back-top" href="#top" onClick={goToSection}>
          نقراها تاني؟ ↑
        </a>
      </section>
      <div className="plain-letter-toggle">
        <button
          type="button"
          ref={transcriptButton}
          onClick={() => setTranscript(true)}
          aria-expanded={transcript}
          aria-controls="full-letter"
        >
          اقري الرسالة كاملة
        </button>
        <span>لتوتا، بكل الحب ♡</span>
      </div>
      {transcript && (
        <section
          id="full-letter"
          className="plain-letter"
          aria-label="نص الرسالة الكامل"
        >
          <div className="plain-letter-top">
            <span>خدي وقتك في كل كلمة</span>
            <button type="button" onClick={() => setTranscript(false)}>
              ارجعي للموقع
            </button>
          </div>
          {story.pages.map((item, index) => (
            <article key={item.number}>
              <h2
                ref={index === 0 ? transcriptHeading : undefined}
                tabIndex={index === 0 ? -1 : undefined}
              >
                {item.title}
              </h2>
              {item.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </article>
          ))}
          <p className="plain-signature">بحبك، وممتن ليكي دايمًا.</p>
        </section>
      )}
    </main>
  );
}
