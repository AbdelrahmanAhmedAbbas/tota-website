"use client";

import { useEffect, useState, type CSSProperties } from "react";

const repairPoints = [
  {
    label: "اللي كان لازم يحصل",
    title: "كان لازم أتكلم معاكي أوضح",
    body: "امبارح كان يوم تقيل علينا، وأنا كان دوري أكون حاضر معاكي بالكلام والهدوء قبل أي حاجة تانية.",
  },
  {
    label: "اللي عملته غلط",
    title: "كنت بجري أصلّح كل حاجة",
    body: "دخلت في وضع الشغل والحلول، وبقيت أحاول أرتّب اليوم من غير ما أقف أسمعك الأول أو أفهم إحساسك.",
  },
  {
    label: "اللي وجعك",
    title: "اتأخرت في السند",
    body: "بدل ما أحسسك إننا فريق واحد، خليتك تحسي إنك بتواجهي اليوم لوحدك، وده حقك تزعلي منه.",
  },
] as const;

const promises = [
  "هسأل قبل ما أصلّح",
  "هسمع للآخر من غير دفاع",
  "هقول تعبي من غير ما أجرحك",
  "هفضل جنبك حتى وأنا مضغوط",
] as const;

const soundCloudTrackUrl = "https://soundcloud.com/ocahhycucqfd/vzo6gyzcmgys";

function soundCloudPlayerUrl(autoPlay: boolean) {
  const params = new URLSearchParams({
    url: soundCloudTrackUrl,
    color: "#ff4f86",
    auto_play: autoPlay ? "true" : "false",
    hide_related: "false",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "true",
    visual: "false",
  });

  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

function MotionScript() {
  return (
    <div className="motion-script" aria-hidden="true">
      {["آسف", "هسمعك", "معاكي", "أوضح", "أهدى"].map((word, index) => (
        <span
          key={word}
          style={
            {
              "--delay": `${index * 0.7}s`,
              "--x": `${8 + index * 19}%`,
            } as CSSProperties
          }
        >
          {word}
        </span>
      ))}
    </div>
  );
}

function MobileFunLayer() {
  return (
    <div className="mobile-fun-layer" data-testid="mobile-fun-layer" aria-hidden="true">
      {["بحبك", "هسمعك", "ضحكة", "صلح"].map((word, index) => (
        <span
          className="fun-chip"
          key={word}
          style={
            {
              "--delay": `${index * 0.55}s`,
              "--x": `${10 + index * 22}%`,
              "--y": `${18 + (index % 2) * 46}%`,
            } as CSSProperties
          }
        >
          {word}
        </span>
      ))}
      <i className="fun-shape fun-shape-one" />
      <i className="fun-shape fun-shape-two" />
      <i className="fun-shape fun-shape-three" />
    </div>
  );
}

export default function Home() {
  const [shouldAutoplaySong, setShouldAutoplaySong] = useState(false);

  useEffect(() => {
    const autoplayTimer = window.setTimeout(() => {
      setShouldAutoplaySong(true);
    }, 2000);

    return () => window.clearTimeout(autoplayTimer);
  }, []);

  function playSong() {
    setShouldAutoplaySong(true);
  }

  return (
    <main data-testid="repair-letter" dir="rtl" className="repair-page">
      <MotionScript />
      <MobileFunLayer />
      <div className="light-beam" aria-hidden="true" />
      <div className="repair-frame">
        <header className="repair-hero" aria-labelledby="apology-title">
          <p className="eyebrow">رسالة جديدة من قلبي</p>
          <div className="hero-stickers" aria-hidden="true">
            <span>بحبك</span>
            <span>نبدأ بهدوء</span>
            <span>هسمعك</span>
          </div>
          <h1 id="apology-title">أنا آسف يا توتا</h1>
          <p className="hero-lede">
            مش جاي أجمّل اللي حصل، ولا أشرح نفسي قبل ما أعتذر. جاي أقولك إنك كنتي
            محتاجة مني حضور وكلام واضح وسند، وأنا قصّرت في التلاتة.
          </p>
          <div className="hero-actions">
            <a className="hero-link" href="#promise">
              اقري وعدي ليكي
            </a>
            <button type="button" className="music-control" onClick={playSong}>
              <span aria-hidden="true">♪</span>
              شغّلي من ساوندكلاود
            </button>
          </div>
          <p className="song-status" aria-live="polite">
            {shouldAutoplaySong
              ? "لو الصوت ما بدأش، اضغطي زر التشغيل داخل ساوندكلاود"
              : "دوسي عليها لما تبقي جاهزة تسمعيها"}
          </p>
          <iframe
            className="soundcloud-player"
            title="أغنية الاعتذار من ساوندكلاود"
            src={soundCloudPlayerUrl(shouldAutoplaySong)}
            allow="autoplay"
            loading="lazy"
          />
        </header>

        <section className="truth-section" aria-labelledby="truth-title">
          <div className="section-label">امبارح</div>
          <h2 id="truth-title">امبارح كان يوم تقيل علينا</h2>
          <p>
            أنا كنت غرقان في الشغل وبحاول ألحق وأصلّح وأظبط كل حاجة، بس وأنا بعمل
            كده نسيت الأهم: إني أتكلم معاكي، أسمعك، وأسألك محتاجة مني إيه في
            اللحظة دي. كان لازم أكون أوضح، أهدى، وأقرب.
          </p>
        </section>

        <section className="repair-grid" aria-label="تفاصيل الاعتذار">
          {repairPoints.map((point, index) => (
            <article
              className="repair-point"
              key={point.title}
              style={{ "--index": index } as CSSProperties}
            >
              <span>{point.label}</span>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </article>
          ))}
        </section>

        <section className="meaning-section" aria-labelledby="meaning-title">
          <div className="meaning-card">
            <p className="section-label">الجملة اللي محتاجة تتصلح</p>
            <h2 id="meaning-title">لما قلتلك إني مش عندي طاقة أسندك</h2>
            <p>
              أنا آسف إن الجملة دي طلعت بالشكل ده. مش معناه إنك حمل عليّا، ولا إن
              وجعك زيادة، ولا إنك المفروض تواجهي لوحدك.
            </p>
            <p className="meaning-emphasis">
              المعنى الصح كان: أنا منهك ومتلخبط ومحتاج أهدى عشان أعرف أكون سندك
              صح، بس كان لازم أقولها بحنية بدل ما أوجعك.
            </p>
          </div>
        </section>

        <section id="promise" className="promise-section" aria-labelledby="promise-title">
          <p className="section-label">من النهارده</p>
          <h2 id="promise-title">وعدي ليكي</h2>
          <div className="promise-list">
            {promises.map((promise, index) => (
              <p key={promise} style={{ "--index": index } as CSSProperties}>
                {promise}
              </p>
            ))}
          </div>
          <p className="closing-line">
            بحبك، وعايز أرجّع بينا الكلام الهادي، وأثبتلك بالأيام مش بالكلام بس إنك
            مش لوحدك.
          </p>
        </section>
      </div>
    </main>
  );
}
