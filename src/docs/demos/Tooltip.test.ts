// @vitest-environment jsdom

import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Tooltip from "./Tooltip.svelte";

describe("tooltip demo accessibility contract", () => {
  it("keeps pseudo tip text presentational and equal to the icon control name", () => {
    render(Tooltip);

    const saveButton = screen.getByRole("button", { name: "Save to draft" });

    expect(saveButton.getAttribute("data-tooltip")).toBe("Save to draft");
    expect(saveButton.getAttribute("aria-describedby")).toBeNull();
    expect(saveButton.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("connects every rich tooltip to one normally named trigger", () => {
    render(Tooltip);

    const tooltips = screen.getAllByRole("tooltip");
    expect(tooltips).toHaveLength(4);

    for (const tooltip of tooltips) {
      expect(tooltip.id).not.toBe("");
      expect(
        tooltip.querySelector("a, button, input, select, textarea"),
      ).toBeNull();

      const trigger = document.querySelector(
        `[aria-describedby="${tooltip.id}"]`,
      );
      expect(trigger).toBeInstanceOf(HTMLButtonElement);
      expect(trigger?.hasAttribute("aria-label")).toBe(false);
    }

    expect(
      screen.getByRole("button", { name: "Formatting help" }).textContent,
    ).toBe("Formatting help");
  });
});
