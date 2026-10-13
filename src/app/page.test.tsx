import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

describe("Tota's interactive letter", () => {
  it("lets her read the complete message and return without animation playback", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(
      screen.getByRole("button", { name: "اقري الرسالة كاملة" }),
    );
    const letter = within(
      screen.getByRole("region", { name: "نص الرسالة الكامل" }),
    );
    expect(
      letter.getByRole("heading", { name: "يا توتا، يا حنية البيت" }),
    ).toHaveFocus();
    expect(letter.getByText(/تسلمي على صبرك/)).toBeVisible();
    expect(letter.getByText(/تنظيم وقتي/)).toBeVisible();
    expect(screen.getByRole("main")).toHaveAttribute("dir", "rtl");
    await user.click(letter.getByRole("button", { name: "ارجعي للموقع" }));
    expect(
      screen.getByRole("button", { name: "اقري الرسالة كاملة" }),
    ).toHaveFocus();
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });

  it("opens the letter from the wax seal and marks the journey as opened", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const journey = screen.getByRole("region", { name: "الظرف والرسالة" });
    expect(journey).toHaveAttribute("data-opened", "false");
    await user.click(screen.getByRole("button", { name: "افتحي الرسالة" }));
    expect(journey).toHaveAttribute("data-opened", "true");
    expect(window.location.hash).toBe("#letter-1");
    expect(
      screen.getByRole("button", { name: /الأغنية|أغنيتك|بتبدأ/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "كتم المؤثرات الصوتية" }),
    ).toHaveAttribute("aria-pressed", "false");
  });
});
