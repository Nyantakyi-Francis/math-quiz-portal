import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const schema = readFileSync(path.join(root, "supabase", "schema.sql"), "utf8");
const migration = readFileSync(
  path.join(root, "supabase", "20261001_lock_quiz_attempt_writes.sql"),
  "utf8"
);

describe("quiz attempt RLS", () => {
  it("keeps direct learner writes disabled in the base schema", () => {
    expect(schema).not.toContain('create policy "Learners can create their own attempts"');
    expect(schema).not.toContain('create policy "Learners can update their own attempts"');
    expect(schema).not.toContain('create policy "Attempt answers are writable by owner or admin"');
  });

  it("ships a migration that drops the unsafe write policies", () => {
    expect(migration).toContain('drop policy if exists "Learners can create their own attempts"');
    expect(migration).toContain('drop policy if exists "Learners can update their own attempts"');
    expect(migration).toContain('drop policy if exists "Attempt answers are writable by owner or admin"');
  });
});
