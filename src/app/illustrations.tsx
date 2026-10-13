// Hand-drawn style SVG assets for the letter site.

export const HEART_PATH =
  "M100 164C22 116 28 56 62 55C82 54 95 69 100 79C105 69 118 54 138 55C172 56 178 116 100 164Z";

export function Heart({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <path d={HEART_PATH} />
    </svg>
  );
}

/** A heart path placed at (cx, cy) with the given width, for use inside a bigger drawing. */
function HeartAt({
  cx,
  cy,
  size,
  className,
}: {
  cx: number;
  cy: number;
  size: number;
  className?: string;
}) {
  const k = size / 120;
  return (
    <path
      className={className}
      d={HEART_PATH}
      transform={`translate(${cx - 100 * k} ${cy - 110 * k}) scale(${k})`}
    />
  );
}

export function Petal({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 34" aria-hidden="true">
      <defs>
        <linearGradient id="petal-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd9d0" />
          <stop offset="1" stopColor="#e9a0ad" />
        </linearGradient>
      </defs>
      <path
        d="M12 1C20 7 23 20 12 33C1 20 4 7 12 1Z"
        fill="url(#petal-fill)"
        stroke="#d98c99"
        strokeWidth="0.6"
      />
      <path d="M12 6V28" stroke="#f6c7ca" strokeWidth="0.8" />
    </svg>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 1C12.8 7.5 16.5 11.2 23 12C16.5 12.8 12.8 16.5 12 23C11.2 16.5 7.5 12.8 1 12C7.5 11.2 11.2 7.5 12 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A small rose-gold flourish used as a divider. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 24" fill="none" aria-hidden="true">
      <path
        d="M4 12H84C96 12 100 4 108 4C112 4 114 8 112 10M236 12H156C144 12 140 20 132 20C128 20 126 16 128 14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <HeartAt cx={120} cy={12} size={18} className="ornament-heart" />
      <circle cx="94" cy="12" r="1.6" fill="currentColor" />
      <circle cx="146" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** A hand-drawn rose stem with leaves, used in the hero corners. */
export function RoseBranch({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg viewBox="0 0 220 360" fill="none" aria-hidden="true">
      <g transform={mirrored ? "matrix(-1 0 0 1 220 0)" : undefined}>
        <g className="rose-sway">
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 350C60 290 70 230 95 170C112 130 130 100 140 72" />
            <path d="M76 228C52 226 36 206 34 178C62 182 78 200 76 228Z" />
            <path d="M100 150C124 158 134 182 128 208C104 196 94 176 100 150Z" />
            <path d="M58 300C38 296 24 278 26 254C50 258 62 276 58 300Z" />
            <path d="M118 112C140 118 150 140 146 164C124 154 114 134 118 112Z" />
            <path d="M76 228L50 196M100 150L120 190M58 300L40 268M118 112L134 150" strokeWidth="1.2" />
          </g>
          <g className="rose-bloom" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M140 72C118 70 104 54 108 34C128 30 146 42 140 72Z" />
            <path d="M140 72C162 72 178 56 174 36C154 32 136 46 140 72Z" />
            <path d="M140 72C128 54 132 30 152 20C170 32 170 56 140 72Z" />
            <path d="M152 20C158 24 164 34 160 46" strokeWidth="1.4" />
            <path d="M140 72C112 78 98 64 96 48" strokeWidth="1.4" />
            <path d="M140 72C166 80 184 70 188 52" strokeWidth="1.4" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/** Envelope face shapes drawn as SVG so the gold edges stay crisp. */
export function EnvelopeFront() {
  return (
    <svg className="envelope-front" viewBox="0 0 480 300" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="env-side" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4d0c4" />
          <stop offset="1" stopColor="#e7b6a9" />
        </linearGradient>
        <linearGradient id="env-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7d9cc" />
          <stop offset="1" stopColor="#efc5b6" />
        </linearGradient>
      </defs>
      <polygon points="0,0 240,160 0,300" fill="url(#env-side)" />
      <polygon points="480,0 240,160 480,300" fill="url(#env-side)" />
      <polygon points="0,300 240,130 480,300" fill="url(#env-bottom)" />
      <g fill="none" stroke="#d9a476" strokeWidth="1.3" vectorEffect="non-scaling-stroke">
        <polyline points="0,0 240,160 480,0" />
        <polyline points="0,300 240,130 480,300" />
      </g>
      <g fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <polyline points="8,300 240,138 472,300" />
      </g>
    </svg>
  );
}

export function EnvelopeFlapFace({ liner = false }: { liner?: boolean }) {
  return (
    <svg
      className={liner ? "flap-face flap-liner" : "flap-face flap-outer"}
      viewBox="0 0 480 180"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flap-outer-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe4da" />
          <stop offset="1" stopColor="#f0c6b8" />
        </linearGradient>
        <pattern id="liner-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="1.6" fill="#c97f8c" />
        </pattern>
      </defs>
      {liner ? (
        <>
          <polygon points="0,0 480,0 240,180" fill="#8b4453" />
          <polygon points="0,0 480,0 240,180" fill="url(#liner-dots)" />
        </>
      ) : (
        <>
          <polygon points="0,0 480,0 240,180" fill="url(#flap-outer-fill)" />
          <polyline
            points="0,0 240,180 480,0"
            fill="none"
            stroke="#d9a476"
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  );
}

export function PromiseDrawing({ index }: { index: number }) {
  return (
    <svg className="promise-drawing" viewBox="0 0 400 400" fill="none" aria-hidden="true">
      {index === 0 ? (
        <>
          {/* pocket watch with a heart at its center */}
          <path className="draw-path chain" d="M214 36C250 10 292 54 330 30C352 16 372 32 384 18" />
          <circle className="draw-path" cx="200" cy="34" r="12" />
          <path className="draw-path" d="M190 46H210V62H190Z" />
          <circle className="draw-path" cx="200" cy="212" r="150" />
          <circle className="draw-path" cx="200" cy="212" r="132" strokeWidth="1" />
          {Array.from({ length: 12 }, (_, i) => (
            <path
              key={i}
              d={i % 3 ? "M200 86V96" : "M200 84V104"}
              transform={`rotate(${i * 30} 200 212)`}
              strokeWidth={i % 3 ? 1.5 : 3}
            />
          ))}
          <path className="clock-hour" d="M200 212V140" strokeWidth="4" />
          <path className="clock-minute" d="M200 212H300" strokeWidth="3" />
          <HeartAt cx={200} cy={214} size={30} className="small-heart" />
          <HeartAt cx={200} cy={300} size={22} className="small-heart heart-two" />
          <g className="fill-in petal-dots">
            <circle cx="60" cy="330" r="4" />
            <circle cx="340" cy="340" r="3" />
            <circle cx="72" cy="90" r="3" />
          </g>
        </>
      ) : index === 1 ? (
        <>
          {/* a warm home with lit windows, chimney smoke and a crescent moon */}
          <path className="draw-path moon" d="M330 44A26 26 0 1 1 304 84A19 19 0 1 0 330 44Z" />
          <path className="draw-path" d="M40 206L200 70L360 206" />
          <path className="draw-path" d="M84 178V336H316V178" />
          <path className="draw-path" d="M268 128V94H298V156" />
          <path className="draw-path smoke" d="M283 86C272 70 294 60 284 44C274 28 296 20 290 6" />
          <path className="draw-path" d="M166 336V258C166 236 234 236 234 258V336" />
          <circle className="draw-path" cx="222" cy="296" r="4" />
          <path className="draw-path" d="M110 206H150V246H110Z M250 206H290V246H250Z" />
          <path className="draw-path" d="M130 206V246M110 226H150M270 206V246M250 226H290" strokeWidth="1.2" />
          <rect className="fill-in window-glow" x="112" y="208" width="36" height="36" rx="2" />
          <rect className="fill-in window-glow" x="252" y="208" width="36" height="36" rx="2" />
          <HeartAt cx={200} cy={172} size={34} className="small-heart" />
          <path className="draw-path" d="M60 336H340" />
          <path className="draw-path" d="M36 300C48 282 70 282 82 300M318 304C330 288 350 288 362 304" strokeWidth="1.5" />
          <g className="fill-in petal-dots">
            <path d="M70 60L74 72L86 76L74 80L70 92L66 80L54 76L66 72Z" />
            <path d="M360 140L362 146L368 148L362 150L360 156L358 150L352 148L358 146Z" />
            <path d="M120 120L122 126L128 128L122 130L120 136L118 130L112 128L118 126Z" />
          </g>
        </>
      ) : (
        <>
          {/* two hearts tied together with a thread and a bow */}
          <path
            className="draw-path"
            d="M170 322C40 240 54 126 118 124C156 122 178 150 170 174C184 150 214 128 250 134C312 144 310 246 170 322Z"
          />
          <path
            className="draw-path heart-two-outline"
            d="M276 220C214 178 222 108 258 108C278 106 290 124 284 142C292 124 310 110 330 114C364 122 360 180 276 220Z"
          />
          <path className="draw-path heart-thread" d="M28 260C70 240 88 290 130 262S190 232 228 262S286 288 318 256S360 232 384 254" />
          <path className="draw-path heart-thread" d="M206 96C196 78 176 84 180 100C184 114 206 112 206 96ZM206 96C216 78 236 84 232 100C228 114 206 112 206 96ZM206 96L198 124M206 96L214 124" />
          <path className="draw-path" d="M200 334C196 310 184 294 162 288M200 334C206 312 220 298 244 294" />
          <path className="draw-path" d="M162 288C170 274 190 274 194 290C180 300 166 298 162 288ZM244 294C236 278 216 282 214 298C230 306 242 302 244 294Z" />
          <g className="fill-in petal-dots">
            <path d="M330 300L333 309L342 312L333 315L330 324L327 315L318 312L327 309Z" />
            <path d="M74 110L76 116L82 118L76 120L74 126L72 120L66 118L72 116Z" />
            <path d="M350 60L352 66L358 68L352 70L350 76L348 70L342 68L348 66Z" />
          </g>
        </>
      )}
    </svg>
  );
}
