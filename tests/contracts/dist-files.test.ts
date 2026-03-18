import { access } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { DIST_FILES, resolveDistFile } from "./helpers";

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
});
