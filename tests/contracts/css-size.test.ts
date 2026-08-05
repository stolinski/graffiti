import { describe, expect, it } from "vitest";

import {
  createCssBudgetBaseline,
  getCssBudgetFailures,
} from "../../scripts/css-metrics.mjs";

const metrics = {
  rawBytes: 100,
  gzipBytes: 50,
  rules: 4,
  declarations: 8,
  classes: 3,
  customProperties: 2,
};

function createReport(rawBytes = metrics.rawBytes) {
  return {
    entries: {
      ".": {
        target: "./dist/index.css",
        files: ["dist/index.css"],
        metrics: { ...metrics, rawBytes },
      },
    },
    featureGroups: {},
  };
}

describe("CSS size budgets", () => {
  it("allows decreases without mutating the reviewed maximum", () => {
    const baseline = createCssBudgetBaseline(createReport());

    expect(getCssBudgetFailures(createReport(99), baseline)).toEqual([]);
    expect(baseline.entries["."].maximum.rawBytes).toBe(100);
  });

  it("reports the public entry, metric, exact delta, and maximum", () => {
    const baseline = createCssBudgetBaseline(createReport());

    expect(getCssBudgetFailures(createReport(107), baseline)).toEqual([
      ". rawBytes: 107 (+7; max 100)",
    ]);
  });
});
