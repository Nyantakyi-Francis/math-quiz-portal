import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resources } from "../lib/data/resources";

describe("protected resources", () => {
  it("uses authenticated API links instead of public PDF paths", () => {
    expect(resources.length).toBeGreaterThan(0);

    for (const resource of resources) {
      expect(resource.href).toBe(`/api/resources/${resource.slug}`);
      expect(resource.href).not.toMatch(/^\/resources\//);
    }
  });

  it("keeps resource PDFs outside the public folder", () => {
    for (const resource of resources) {
      expect(existsSync(path.join(process.cwd(), "resources", resource.fileName))).toBe(true);
      expect(existsSync(path.join(process.cwd(), "public", "resources", resource.fileName))).toBe(false);
    }
  });
});
