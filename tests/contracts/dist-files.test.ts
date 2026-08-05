import { access } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { minifyCss } from "../../scripts/css-metrics.mjs";
import { DIST_FILES, readDistCss, resolveDistFile } from "./helpers";

describe("dist bundle outputs", () => {
  it("includes every published CSS bundle", async () => {
    const expectedFiles = Object.values(DIST_FILES);

    await Promise.all(
      expectedFiles.map(async (fileName) => {
        await expect(
          access(resolveDistFile(fileName)),
        ).resolves.toBeUndefined();
      }),
    );
  });

  it.each([
    [DIST_FILES.index, DIST_FILES.indexMin],
    [DIST_FILES.flat, DIST_FILES.flatMin],
  ])("minifies %s deterministically as %s", async (readable, minified) => {
    const [readableCss, minifiedCss] = await Promise.all([
      readDistCss(readable),
      readDistCss(minified),
    ]);

    expect(minifiedCss).toBe(minifyCss(readableCss, readable));
    expect(minifiedCss).not.toContain("/*");
    expect(Buffer.byteLength(minifiedCss)).toBeLessThan(
      Buffer.byteLength(readableCss),
    );
  });
});
