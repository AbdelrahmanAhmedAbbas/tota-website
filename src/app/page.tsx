"use client";

import { useMemo, useRef, useState } from "react";

const content = {
  name: "توتا",
  questions: {
    apology: "تقبلي اعتذاري؟",
    love: "لسه بتحبيني؟",
  },
  runawayLabels: ["لا؟ استني بس", "مش بالسهولة دي", "نعم مستنياكي", "طب فرصة أخيرة"],
  pledgeTitle: "ده عهدي ليكي",
  pledge:
    "بوعدك إن اللي جاي مش هيبقى نسخة من اللي فات. هنتعلم نحافظ على نفسيتنا وطاقتنا، ومش هسيبك تشيلي لوحدك تاني. كل يوم هحاول أبقى أهدى، وأوعى، وأحن عليكي وليكي. إنتي سندي وحبيبتي، ومليش في الدنيا أغلى منك.",
};

const slides = [
  {
    kicker: "عرض خاص لتوتا",
    icon: "🫶",
    mood: "مش عارف أبدأ منين",
    title: "توتا",
    body: "أنا عارف إن صفحة صغيرة مش هتصلح كل حاجة. بس قلت أعملك حاجة بإيدي، حتى لو بسيطة، عشان الكلام اللي جوايا يوصل بدل ما يفضل متكركب.",
    note: "اقري براحتك. مفيش زرار تخطي، معلش.",
  },
  {
    kicker: "اعتذار واضح",
    icon: "🙏",
    mood: "حقك عليّا",
    title: "أنا قصّرت.",
    body: "وقت تعبك كان المفروض أكون ضهرك أكتر من كده. أنا مدعمتكيش بالشكل اللي تستحقيه، وتصرفي الغلط ضايقك ووجعك.",
    note: "مش داخل أشرح، داخل أقول: حقك عليّا.",
  },
  {
    kicker: "حقك عليّا",
    icon: "🏠",
    mood: "شايف تعب البيت",
    title: "أنا شايف تعبك.",
    body: "شايفك وإنتي واخدة بالك من البيت ومننا، بتلمي تفاصيل صغيرة محدش بياخد باله منها. مش مفرطة ومش مقصرة في حق أي حد فينا.",
    note: "الحاجات اللي بتعدي عادي عندنا، عارف إنها ساعات بتتعبك جدًا.",
  },
  {
    kicker: "اللي بينا",
    icon: "🧡",
    mood: "إنتي أماني",
    title: "إنتي دايمًا واخدة بالك.",
    body: "عينك علينا، على تصرفاتنا، على نفسيتنا، وعلى علاقتنا. ساعات بتحسي بالحاجة قبل ما أنا أفهمها أصلًا، وده مش قليل.",
    note: "وجودك بيخليني أحس إن الدنيا لسه فيها أمان.",
  },
  {
    kicker: "اقتراح بسيط",
    icon: "🥪",
    mood: "خليها النهاردة؟",
    title: "نتغدى برّة؟",
    body: "فاكرة أول مرة طلعنا بعبيدة؟ لسه فاكر الموقف، اتمرمطنا واحنا بنرضعه لأول مرة بره البيت، وضحكنا بعدها على نفسنا وعدّيناها. نفسي نعيدها النهاردة بشكل أحلى، نطلع كلنا مع بعض، أنا وإنتي وعبيدة وبراء، ونتغدى على مهلنا. نضحك تاني، ونرجع بصورة جديدة نحطها جنب القديمة.",
    note: "مفيش تجهيز ولا تخطيط. كلمة منك، وأنا بفصّل اليوم على كده.",
  },
  {
    kicker: "قبل النهاية",
    icon: "💌",
    mood: "قلبي مستني",
    title: "فاضل سؤالين.",
    body: "مش هضغط عليكي. بس بصراحة أنا عامل الصفحة كلها ومستني إجابة تطمن قلبي شوية.",
    note: "وزر لا؟ ده واضح إنه مش قد المسؤولية.",
  },
] as const;

const stickerPairs = [
  ["مهم", "من قلبي"],
  ["حقك", "واضحة"],
  ["شايفك", "بجد"],
  ["أمان", "قريبة"],
  ["خروجة", "النهاردة"],
  ["استعدي", "سؤال"],
] as const;

const invitationSlideIndex = 4;

const noPositions = [
  { x: 50, y: 72 },
  { x: 32, y: 75 },
  { x: 68, y: 74 },
  { x: 40, y: 76 },
  { x: 60, y: 73 },
];

const totalFrames = slides.length + 2;
const finaleSongSrc = "/finale.mp3";

type Stage = "slides" | "love" | "finale";
type SlideDirection = "next" | "back";

function arabicNumber(value: number) {
  return value.toLocaleString("ar-EG");
}

function FloatingMarks() {
  return (
    <div className="floating-words" aria-hidden="true">
      {["حبي", "وعد", "نور", "حنية", "توتا"].map((word, index) => (
        <span
          key={word}
          style={
            {
              "--delay": `${index * 0.42}s`,
              "--start": `${8 + index * 18}%`,
            } as React.CSSProperties
          }
        >
          {word}
        </span>
      ))}
    </div>
  );
}

function SlideDots({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="slide-dots" aria-hidden="true">
      {Array.from({ length: totalFrames }).map((_, index) => (
        <span key={index} className={index === activeIndex ? "active" : ""} />
      ))}
    </div>
  );
}

function MoodBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="mood-badge" aria-label={label}>
      <span className="mood-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

function QuestionSlide({
  counter,
  question,
  yesLabel,
  onYes,
}: {
  counter: number;
  question: string;
  yesLabel: string;
  onYes: () => void;
}) {
  const [runawayCount, setRunawayCount] = useState(0);
  const position = noPositions[runawayCount % noPositions.length];
  const noLabel =
    runawayCount === 0
      ? "لا"
      : content.runawayLabels[(runawayCount - 1) % content.runawayLabels.length];

  function moveNoButton() {
    setRunawayCount((count) => count + 1);
  }

  const tilt = runawayCount % 2 === 0 ? 4 : -7;

  return (
    <section className="slide-shell question-shell" aria-label="سؤال">
      <div className="question-doodle" aria-hidden="true">
        زر لا عامل فيها صعب
      </div>
      <div className="slide-meta">
        <span>اختيار مهم</span>
        <span data-testid="slide-counter">
          {arabicNumber(counter)} / {arabicNumber(totalFrames)}
        </span>
      </div>

      <div className="slide-copy question-copy">
        <MoodBadge icon="🥺" label="سؤال محتاج قلب طيب" />
        <p className="slide-kicker">بهدوء خالص</p>
        <h2>{question}</h2>
        <p>أنا عارف الإجابة اللي نفسي أسمعها. والإجابة التانية موجودة، بس عاملة فيها مشغولة شوية.</p>
      </div>

      <div className="answer-arena">
        <button type="button" className="yes-button" onClick={onYes}>
          {yesLabel}
        </button>
        <button
          type="button"
          data-runaway-count={runawayCount}
          className="no-button"
          onClick={moveNoButton}
          style={{
            position: "absolute",
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: `translate(-50%, -50%) rotate(${tilt}deg)`,
            maxWidth: "56%",
            whiteSpace: "nowrap",
          }}
        >
          {noLabel}
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("slides");
  const [direction, setDirection] = useState<SlideDirection>("next");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const year = useMemo(() => new Date().getFullYear(), []);

  function playFinaleSong() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    const attempt = audio.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => {});
    }
  }
  const activeSlide = slides[slideIndex];
  const frameIndex =
    stage === "finale" ? totalFrames - 1 : stage === "love" ? slides.length : slideIndex;

  function goNext() {
    setDirection("next");
    setSlideIndex((current) => Math.min(current + 1, slides.length - 1));
  }

  function goBack() {
    setDirection("back");
    if (stage === "love") {
      setStage("slides");
      setSlideIndex(slides.length - 1);
      return;
    }

    setSlideIndex((current) => Math.max(current - 1, 0));
  }

  function handleTouchEnd(clientX: number) {
    if (touchStart === null || stage !== "slides") {
      setTouchStart(null);
      return;
    }

    const distance = clientX - touchStart;
    if (distance > 54 && slideIndex < slides.length - 1) {
      goNext();
    }

    if (distance < -54 && slideIndex > 0) {
      goBack();
    }

    setTouchStart(null);
  }

  return (
    <main data-testid="tota-journey" dir="rtl" className="slideshow-stage">
      <audio ref={audioRef} src={finaleSongSrc} preload="auto" title="أغنية النهاية لتوتا" />
      <div className="slideshow-frame">
        <header className="slideshow-topbar">
          <span>عرض خاص</span>
          <span className="tabular-nums">{year}</span>
        </header>

        {stage === "slides" && slideIndex < slides.length - 1 && (
          <section
            key={slideIndex}
            className={`slide-shell slide-${direction}${
              slideIndex === invitationSlideIndex ? " invitation-shell" : ""
            }`}
            onTouchStart={(event) => setTouchStart(event.changedTouches[0].clientX)}
            onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
          >
            <div className="slide-stickers" aria-hidden="true">
              {stickerPairs[slideIndex].map((sticker) => (
                <span key={sticker}>{sticker}</span>
              ))}
            </div>
            {slideIndex === invitationSlideIndex && (
              <div className="invite-stamp" aria-hidden="true">
                <span className="invite-stamp__top">دعوة عيلية</span>
                <span className="invite-stamp__big">اليوم</span>
                <span className="invite-stamp__bottom">٤ كراسي · ضحكة كتير</span>
              </div>
            )}
            <div className="slide-meta">
              <span>{activeSlide.kicker}</span>
              <span data-testid="slide-counter">
                {arabicNumber(slideIndex + 1)} / {arabicNumber(totalFrames)}
              </span>
            </div>

            <div className="slide-copy">
              <MoodBadge icon={activeSlide.icon} label={activeSlide.mood} />
              {slideIndex === 0 ? <h1>{activeSlide.title}</h1> : <h2>{activeSlide.title}</h2>}
              <p>{activeSlide.body}</p>
              {slideIndex === invitationSlideIndex && (
                <div className="invite-rsvp" aria-hidden="true">
                  <span className="invite-rsvp__chip">ميعاد مفتوح</span>
                  <span className="invite-rsvp__arrow">←</span>
                  <span className="invite-rsvp__name">يا توتا</span>
                </div>
              )}
            </div>

            <p className="slide-note">{activeSlide.note}</p>
          </section>
        )}

        {stage === "slides" && slideIndex === slides.length - 1 && (
          <QuestionSlide
            key="apology-question"
            counter={slideIndex + 1}
            question={content.questions.apology}
            yesLabel="أيوه، قبلت اعتذارك"
            onYes={() => setStage("love")}
          />
        )}

        {stage === "love" && (
          <QuestionSlide
            key="love-question"
            counter={slides.length + 1}
            question={content.questions.love}
            yesLabel="أيوه، بحبك"
            onYes={() => {
              playFinaleSong();
              setStage("finale");
            }}
          />
        )}

        {stage === "finale" && (
          <section key="finale" className="slide-shell slide-next finale-shell">
            <FloatingMarks />
            <button
              type="button"
              className="music-badge"
              onClick={playFinaleSong}
              aria-label="شغّلي الأغنية تاني"
            >
              <span>الأغنية بتلعب</span>
              <span className="music-badge__hint">اضغطي لو وقفت</span>
            </button>
            <div className="slide-meta">
              <span>النهاية اللي بتمناها</span>
              <span data-testid="slide-counter">
                {arabicNumber(totalFrames)} / {arabicNumber(totalFrames)}
              </span>
            </div>
            <div className="slide-copy">
              <MoodBadge icon="❤️" label="وعد من قلبي" />
              <p className="slide-kicker">بعد أحلى أيوتين</p>
              <h2>{content.pledgeTitle}</h2>
              <p>{content.pledge}</p>
            </div>
            <p className="final-love-note">بحبك يا توتا، وعايز أستحق قلبك كل يوم.</p>
          </section>
        )}

        <footer className="slideshow-controls">
          <SlideDots activeIndex={frameIndex} />
          <div className="control-buttons">
            {stage !== "finale" && (
              <button
                type="button"
                className="ghost-button"
                onClick={goBack}
                disabled={stage === "slides" && slideIndex === 0}
              >
                السابق
              </button>
            )}
            {stage === "slides" && slideIndex < slides.length - 1 && (
              <button type="button" className="next-button" onClick={goNext}>
                التالي
              </button>
            )}
          </div>
        </footer>
      </div>
    </main>
  );
}
