import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

describe("Tota repair letter", () => {
  it("renders a new Arabic RTL apology experience with yesterday's core message", () => {
    render(<Home />);

    expect(screen.getByTestId("repair-letter")).toHaveAttribute("dir", "rtl");
    expect(
      screen.getByRole("heading", { name: "أنا آسف يا توتا" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "امبارح كان يوم تقيل علينا" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/كان لازم أتكلم معاكي أوضح/i)).toBeInTheDocument();
    expect(screen.getByText(/كنت بجري أصلّح كل حاجة/i)).toBeInTheDocument();
  });

  it("clarifies the energy sentence without blaming her", () => {
    render(<Home />);

    expect(screen.getByText(/لما قلتلك إني مش عندي طاقة أسندك/i)).toBeInTheDocument();
    expect(screen.getByText(/مش معناه إنك حمل عليّا/i)).toBeInTheDocument();
    expect(screen.getByText(/المعنى الصح كان: أنا منهك/i)).toBeInTheDocument();
  });

  it("replaces the old playful slideshow copy with a new final promise", () => {
    render(<Home />);

    expect(screen.queryByText(/عرض خاص لتوتا/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/زر لا/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/تقبلي اعتذاري؟/i)).not.toBeInTheDocument();
    expect(screen.getByText(/هسأل قبل ما أصلّح/i)).toBeInTheDocument();
    expect(screen.getByText(/بحبك، وعايز أرجّع بينا الكلام الهادي/i)).toBeInTheDocument();
  });

  it("loads the requested SoundCloud song in a clickable player", async () => {
    const user = userEvent.setup();

    render(<Home />);

    const player = screen.getByTitle("أغنية الاعتذار من ساوندكلاود");
    const initialSrc = player.getAttribute("src") ?? "";

    expect(initialSrc).toContain("https://w.soundcloud.com/player/");
    expect(decodeURIComponent(initialSrc)).toContain(
      "https://soundcloud.com/ocahhycucqfd/vzo6gyzcmgys",
    );
    expect(initialSrc).toContain("auto_play=false");

    await user.click(screen.getByRole("button", { name: "شغّلي من ساوندكلاود" }));

    expect(screen.getByTitle("أغنية الاعتذار من ساوندكلاود")).toHaveAttribute(
      "src",
      expect.stringContaining("auto_play=true"),
    );
    expect(screen.getByText(/لو الصوت ما بدأش/i)).toBeInTheDocument();
  });

  it("requests SoundCloud autoplay after two seconds by default", () => {
    vi.useFakeTimers();

    render(<Home />);

    expect(screen.getByTitle("أغنية الاعتذار من ساوندكلاود")).toHaveAttribute(
      "src",
      expect.stringContaining("auto_play=false"),
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByTitle("أغنية الاعتذار من ساوندكلاود")).toHaveAttribute(
      "src",
      expect.stringContaining("auto_play=true"),
    );
    expect(screen.getByText(/لو الصوت ما بدأش/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("includes mobile-only playful decoration without changing the apology content", () => {
    render(<Home />);

    expect(screen.getByTestId("mobile-fun-layer")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(/أنا آسف يا توتا/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "شغّلي من ساوندكلاود" })).toBeInTheDocument();
  });
});
