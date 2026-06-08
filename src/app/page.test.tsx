import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

describe("Tota apology slideshow", () => {
  async function goToApologyQuestion(user: ReturnType<typeof userEvent.setup>) {
    for (let index = 0; index < 5; index += 1) {
      await user.click(screen.getByRole("button", { name: "التالي" }));
    }
  }

  it("renders an Arabic RTL slideshow and advances one emotional slide at a time", async () => {
    const user = userEvent.setup();

    render(<Home />);

    expect(screen.getByTestId("tota-journey")).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("heading", { name: /توتا/i })).toBeInTheDocument();
    expect(screen.getByText(/عرض خاص لتوتا/i)).toBeInTheDocument();
    expect(screen.getByTestId("slide-counter")).toHaveTextContent("١ / ٨");
    expect(screen.queryByText(/تقبلي اعتذاري؟/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "التالي" }));

    expect(screen.getByTestId("slide-counter")).toHaveTextContent("٢ / ٨");
    expect(screen.getByText(/أنا مدعمتكيش بالشكل اللي تستحقيه/i)).toBeInTheDocument();
  });

  it("reveals the final pledge only after the slideshow and both yes answers", async () => {
    const user = userEvent.setup();

    render(<Home />);

    expect(screen.queryByText(/ده عهدي ليكي/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "شغّلي الأغنية تاني" })).not.toBeInTheDocument();

    await goToApologyQuestion(user);
    expect(screen.getByText(/تقبلي اعتذاري؟/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "أيوه، قبلت اعتذارك" }));
    expect(screen.getByText(/لسه بتحبيني؟/i)).toBeInTheDocument();
    expect(screen.queryByText(/ده عهدي ليكي/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "أيوه، بحبك" }));
    expect(screen.getByText(/ده عهدي ليكي/i)).toBeInTheDocument();
    expect(screen.getByText(/مش هسيبك تشيلي لوحدك تاني/i)).toBeInTheDocument();
    expect(screen.getByTitle("أغنية النهاية لتوتا")).toHaveAttribute("src", "/finale.mp3");
    expect(screen.getByRole("button", { name: "شغّلي الأغنية تاني" })).toBeInTheDocument();
  });

  it("keeps the no button inside mobile-safe bounds and changes its text", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await goToApologyQuestion(user);
    const noButton = screen.getByRole("button", { name: "لا" });
    await user.click(noButton);

    expect(noButton).toHaveTextContent(/لا؟ استني بس|مش بالسهولة دي|نعم مستنياكي/);
    expect(noButton).toHaveStyle({
      position: "absolute",
    });
    expect(noButton).toHaveAttribute("data-runaway-count", "1");
  });
});
