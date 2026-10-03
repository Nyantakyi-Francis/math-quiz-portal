import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const mobileNavigationSource = readFileSync(
  path.join(process.cwd(), "components", "mobile-navigation.tsx"),
  "utf8"
);

describe("mobile navigation layout", () => {
  it("keeps separate column counts for learner and admin navigation", () => {
    expect(mobileNavigationSource).toContain('role === "admin"');
    expect(mobileNavigationSource).toContain('"grid-cols-6"');
    expect(mobileNavigationSource).toContain('"grid-cols-5"');
    expect(mobileNavigationSource).toContain('{ href: "/admin/messages", label: "Messages"');
    expect(mobileNavigationSource).toContain('{ href: "/admin", label: "Admin"');
  });
});
