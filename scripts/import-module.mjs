import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

async function loadEnvFile(filename) {
  const filePath = resolve(process.cwd(), filename);

  if (!existsSync(filePath)) {
    return;
  }

  const content = await readFile(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function importModule(slug, options = {}) {
  const { replaceExisting = false, skipExisting = false } = options;
  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase credentials. Populate NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
  }

  const dataPath = join(process.cwd(), "data", `${slug}.json`);

  if (!existsSync(dataPath)) {
    throw new Error(`No legacy data file was found for "${slug}" at ${dataPath}.`);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const quizData = JSON.parse(await readFile(dataPath, "utf8"));
  const questionCount = Array.isArray(quizData.questions) ? quizData.questions.length : 0;

  if (!questionCount) {
    throw new Error(`The file ${dataPath} does not contain any questions.`);
  }

  const { data: moduleRow, error: moduleError } = await supabase
    .from("modules")
    .select("id, title")
    .eq("slug", slug)
    .maybeSingle();

  if (moduleError || !moduleRow) {
    throw new Error(
      moduleError?.message ??
        `Module "${slug}" was not found in the modules table. Run supabase/schema.sql and supabase/seed.sql first.`
    );
  }

  const { count: existingCount, error: countError } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("module_id", moduleRow.id);

  if (countError) {
    throw new Error(countError.message);
  }

  if ((existingCount ?? 0) > 0 && !replaceExisting) {
    if (skipExisting) {
      console.log(`Skipped "${slug}" because it already has ${existingCount} imported questions.`);
      return;
    }

    throw new Error(
      `Module "${slug}" already has ${existingCount} imported questions. Re-run with --replace to rebuild it.`
    );
  }

  if ((existingCount ?? 0) > 0 && replaceExisting) {
    const { error: deleteError } = await supabase
      .from("questions")
      .delete()
      .eq("module_id", moduleRow.id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  const { error: moduleUpdateError } = await supabase
    .from("modules")
    .update({
      title: quizData.title ?? moduleRow.title,
      description: quizData.description ?? null,
      question_count: questionCount
    })
    .eq("id", moduleRow.id);

  if (moduleUpdateError) {
    throw new Error(moduleUpdateError.message);
  }

  for (const [index, question] of quizData.questions.entries()) {
    const { data: insertedQuestion, error: questionInsertError } = await supabase
      .from("questions")
      .insert({
        module_id: moduleRow.id,
        prompt: question.q,
        order_index: index + 1
      })
      .select("id")
      .single();

    if (questionInsertError || !insertedQuestion) {
      throw new Error(questionInsertError?.message ?? "Unable to insert a question row.");
    }

    const optionPayload = question.options.map((optionText, optionIndex) => ({
      question_id: insertedQuestion.id,
      option_text: optionText,
      order_index: optionIndex
    }));

    const { data: insertedOptions, error: optionInsertError } = await supabase
      .from("question_options")
      .insert(optionPayload)
      .select("id, order_index");

    if (optionInsertError || !insertedOptions?.length) {
      throw new Error(optionInsertError?.message ?? "Unable to insert question options.");
    }

    const correctOption = insertedOptions.find((option) => option.order_index === question.correct);

    if (!correctOption) {
      throw new Error(
        `Question ${index + 1} in "${slug}" has an invalid correct option index: ${question.correct}.`
      );
    }

    const { error: answerKeyError } = await supabase.from("question_answer_keys").insert({
      question_id: insertedQuestion.id,
      correct_option_id: correctOption.id
    });

    if (answerKeyError) {
      throw new Error(answerKeyError.message);
    }
  }

  console.log(`Imported ${questionCount} questions for "${slug}".`);
}

async function main() {
  await loadEnvFile(".env.local");
  await loadEnvFile(".env");

  const slug = process.argv[2];
  const replaceExisting = process.argv.includes("--replace");

  if (!slug) {
    console.error("Usage: npm run import:module -- <module-slug> [--replace]");
    process.exit(1);
  }

  try {
    if (slug === "all") {
      const dataDir = join(process.cwd(), "data");
      const files = await readdir(dataDir);
      const moduleSlugs = files
        .filter((file) => file.endsWith(".json"))
        .map((file) => file.replace(/\.json$/, ""))
        .sort();

      for (const moduleSlug of moduleSlugs) {
        await importModule(moduleSlug, {
          replaceExisting,
          skipExisting: !replaceExisting
        });
      }
    } else {
      await importModule(slug, {
        replaceExisting
      });
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Module import failed.");
    process.exit(1);
  }
}

await main();
