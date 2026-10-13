# إلى توتا، بكل الحب

An interactive Egyptian Arabic love letter built with Next.js 16, React 19 and GSAP ScrollTrigger.

Tap the wax seal to start the song and open the envelope: the seal cracks with a burst of petals, the flap folds back to reveal the patterned liner and the letter rises out. Scrolling drives the same choreography (and reverses it), then turns the letter's three pages; previous/next buttons and page dots jump to the same scroll positions. Below the letter, promises draw themselves as a pocket watch, a warm home and two tied hearts, with expandable personal notes.

Sound is part of the experience: the SoundCloud track is controlled through its Widget API (`src/lib/song.ts`) so it fades in exactly when the seal opens, and small sound effects (seal crack, paper rustle, whoosh, sparkle chime, page turn, soft clicks, closing heartbeat) are synthesized with the Web Audio API in `src/lib/sfx.ts`, so no audio files are shipped. The header has play/pause, a mute toggle for the effects and a popover with the full player. Browsers only allow audio after a tap, so scrolling without tapping stays silent.

The hero is decorated with drifting petals, a soft aurora glow, bokeh lights and hand-drawn rose branches (`src/app/illustrations.tsx`). The site also includes a complete readable letter, keyboard navigation and a static reading layout for reduced-motion preferences.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm test
npm run lint
npm run build
```

Edit the words in `src/data/letter.json`, interactions and scroll choreography in `src/app/page.tsx`, drawings in `src/app/illustrations.tsx`, sounds in `src/lib/`, and layout and colors in `src/app/globals.css`.
