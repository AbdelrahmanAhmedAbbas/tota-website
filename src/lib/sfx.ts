// Small synthesized sound effects (no audio files needed).
// Nothing is created until `unlockSound()` runs inside a user gesture,
// so browsers never complain about an AudioContext starting on its own.

type Engine = { ctx: AudioContext; master: GainNode };

let engine: Engine | null = null;
let noiseBuffer: AudioBuffer | null = null;
let muted = false;
const lastPlayed = new Map<string, number>();

function create(): Engine | null {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.55;
  master.connect(ctx.destination);
  return { ctx, master };
}

/** Call from a click/keydown handler. Returns true when sound is available. */
export function unlockSound(): boolean {
  if (!engine) engine = create();
  if (!engine) return false;
  if (engine.ctx.state === "suspended") engine.ctx.resume().catch(() => {});
  return true;
}

export function setSoundMuted(value: boolean) {
  muted = value;
  if (engine)
    engine.master.gain.setTargetAtTime(
      value ? 0 : 0.55,
      engine.ctx.currentTime,
      0.05,
    );
}

export function isSoundMuted() {
  return muted;
}

function ready(name: string, gap = 250): Engine | null {
  if (!engine || engine.ctx.state !== "running") return null;
  const now = performance.now();
  if (now - (lastPlayed.get(name) ?? -Infinity) < gap) return null;
  lastPlayed.set(name, now);
  return engine;
}

function noise(ctx: AudioContext) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    const length = ctx.sampleRate * 2;
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  return source;
}

function envelope(
  gain: GainNode,
  at: number,
  attack: number,
  peak: number,
  decay: number,
) {
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(peak, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
}

function filteredNoise(
  { ctx, master }: Engine,
  options: {
    at: number;
    type: BiquadFilterType;
    from: number;
    to: number;
    q?: number;
    attack: number;
    peak: number;
    decay: number;
  },
) {
  const source = noise(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = options.type;
  filter.Q.value = options.q ?? 0.8;
  filter.frequency.setValueAtTime(options.from, options.at);
  filter.frequency.exponentialRampToValueAtTime(
    options.to,
    options.at + options.attack + options.decay,
  );
  const gain = ctx.createGain();
  envelope(gain, options.at, options.attack, options.peak, options.decay);
  source.connect(filter).connect(gain).connect(master);
  source.start(options.at);
  source.stop(options.at + options.attack + options.decay + 0.05);
}

function tone(
  { ctx, master }: Engine,
  options: {
    at: number;
    frequency: number;
    to?: number;
    type?: OscillatorType;
    attack?: number;
    peak: number;
    decay: number;
  },
) {
  const osc = ctx.createOscillator();
  osc.type = options.type ?? "sine";
  osc.frequency.setValueAtTime(options.frequency, options.at);
  if (options.to)
    osc.frequency.exponentialRampToValueAtTime(
      options.to,
      options.at + (options.attack ?? 0.01) + options.decay,
    );
  const gain = ctx.createGain();
  envelope(gain, options.at, options.attack ?? 0.01, options.peak, options.decay);
  osc.connect(gain).connect(master);
  osc.start(options.at);
  osc.stop(options.at + (options.attack ?? 0.01) + options.decay + 0.05);
}

/** Wax seal cracking loose: a snap plus a soft thud. */
export function sealPop() {
  const e = ready("seal", 500);
  if (!e) return;
  const at = e.ctx.currentTime;
  filteredNoise(e, {
    at,
    type: "bandpass",
    from: 1800,
    to: 500,
    q: 1.2,
    attack: 0.004,
    peak: 0.9,
    decay: 0.09,
  });
  tone(e, { at: at + 0.01, frequency: 190, to: 55, peak: 0.7, decay: 0.22 });
}

/** Envelope flap folding back. */
export function paperRustle() {
  const e = ready("rustle", 350);
  if (!e) return;
  const at = e.ctx.currentTime;
  filteredNoise(e, {
    at,
    type: "bandpass",
    from: 3200,
    to: 900,
    q: 0.6,
    attack: 0.05,
    peak: 0.35,
    decay: 0.42,
  });
  filteredNoise(e, {
    at: at + 0.14,
    type: "highpass",
    from: 2200,
    to: 4000,
    attack: 0.03,
    peak: 0.18,
    decay: 0.25,
  });
}

/** Letter sliding up out of the envelope. */
export function whoosh() {
  const e = ready("whoosh", 500);
  if (!e) return;
  const at = e.ctx.currentTime;
  filteredNoise(e, {
    at,
    type: "lowpass",
    from: 350,
    to: 2600,
    q: 1,
    attack: 0.28,
    peak: 0.4,
    decay: 0.45,
  });
}

/** Turning to the next page of the letter. */
export function pageTurn() {
  const e = ready("page", 400);
  if (!e) return;
  const at = e.ctx.currentTime;
  filteredNoise(e, {
    at,
    type: "highpass",
    from: 1200,
    to: 2600,
    attack: 0.02,
    peak: 0.3,
    decay: 0.16,
  });
  filteredNoise(e, {
    at: at + 0.1,
    type: "bandpass",
    from: 2500,
    to: 1200,
    q: 0.7,
    attack: 0.03,
    peak: 0.22,
    decay: 0.22,
  });
}

/** A magical rising chime when the words appear. */
export function sparkle() {
  const e = ready("sparkle", 900);
  if (!e) return;
  const at = e.ctx.currentTime;
  [1046.5, 1318.5, 1568, 1975.5, 2349.3, 3136].forEach((frequency, i) => {
    tone(e, {
      at: at + i * 0.075,
      frequency,
      type: "triangle",
      attack: 0.012,
      peak: 0.16 - i * 0.012,
      decay: 0.9,
    });
    tone(e, {
      at: at + i * 0.075 + 0.01,
      frequency: frequency * 2.01,
      type: "sine",
      attack: 0.01,
      peak: 0.045,
      decay: 0.5,
    });
  });
}

/** Tiny click for buttons. */
export function softClick() {
  const e = ready("click", 80);
  if (!e) return;
  const at = e.ctx.currentTime;
  tone(e, { at, frequency: 1100, to: 700, peak: 0.18, decay: 0.045 });
  filteredNoise(e, {
    at,
    type: "highpass",
    from: 3000,
    to: 3500,
    attack: 0.003,
    peak: 0.08,
    decay: 0.03,
  });
}

/** Two gentle heartbeats for the closing. */
export function heartbeat() {
  const e = ready("heart", 1200);
  if (!e) return;
  const at = e.ctx.currentTime;
  [0, 0.28].forEach((offset, i) => {
    tone(e, {
      at: at + offset,
      frequency: i ? 95 : 110,
      to: 45,
      attack: 0.015,
      peak: i ? 0.35 : 0.5,
      decay: 0.26,
    });
  });
}
