import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getModuleBySlug } from "@/lib/data/modules";
import type { LearnerQuizModule, LearnerQuizQuestion } from "@/lib/quiz/types";

type ModulePageSnapshot = {
  isConfigured: boolean;
  userEmail: string | null;
  role: string;
  profileName: string | null;
  module: LearnerQuizModule | null;
  warning: string | null;
};

function mapSetupWarning(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("does not exist") ||
    normalizedMessage.includes("could not find the table") ||
    (normalizedMessage.includes("could not find the") &&
      normalizedMessage.includes("column") &&
      normalizedMessage.includes("schema cache"))
  ) {
    return "Supabase is connected, but the database schema or quiz import has not been applied yet.";
  }

  return message;
}

export async function getModulePageSnapshot(slug: string): Promise<ModulePageSnapshot> {
  const legacyModule = getModuleBySlug(slug);
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      isConfigured: getSupabaseEnv().isConfigured,
      userEmail: null,
      role: "learner",
      profileName: null,
      module: null,
      warning:
        "Connect Supabase and import at least one module before protected quiz delivery can begin."
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isConfigured: true,
      userEmail: null,
      role: "learner",
      profileName: null,
      module: null,
      warning: "Please log in to access modules."
    };
  }

  let role = "learner";
  let profileName =
    typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : null;
  let warning: string | null = null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      warning = mapSetupWarning(error.message);
    } else if (data) {
      role = data.role ?? "learner";
      profileName = data.full_name;
    }
  } catch (error) {
    warning = mapSetupWarning(error instanceof Error ? error.message : "Unable to load profile.");
  }

  try {
    const { data: moduleRow, error: moduleError } = await supabase
      .from("modules")
      .select("id, slug, title, description, difficulty, question_count")
      .eq("slug", slug)
      .maybeSingle();

    if (moduleError) {
      return {
        isConfigured: true,
        userEmail: user.email ?? null,
        role,
        profileName,
        module: null,
        warning: mapSetupWarning(moduleError.message)
      };
    }

    if (!moduleRow) {
      return {
        isConfigured: true,
        userEmail: user.email ?? null,
        role,
        profileName,
        module: null,
        warning: "This module has not been seeded into the database yet."
      };
    }

    const { data: questionRows, error: questionError } = await supabase
      .from("questions")
      .select("id, prompt, order_index")
      .eq("module_id", moduleRow.id)
      .order("order_index", { ascending: true });

    if (questionError) {
      return {
        isConfigured: true,
        userEmail: user.email ?? null,
        role,
        profileName,
        module: null,
        warning: mapSetupWarning(questionError.message)
      };
    }

    if (!questionRows || questionRows.length === 0) {
      return {
        isConfigured: true,
        userEmail: user.email ?? null,
        role,
        profileName,
        module: {
          id: moduleRow.id,
          slug: moduleRow.slug,
          title: moduleRow.title,
          description: moduleRow.description,
          difficulty: moduleRow.difficulty,
          questionCount: moduleRow.question_count,
          questions: []
        },
        warning:
          legacyModule?.slug === slug
            ? "The module shell exists in Postgres, but its question bank has not been imported yet."
            : warning
      };
    }

    const questionIds = questionRows.map((question) => question.id);
    const { data: optionRows, error: optionError } = await supabase
      .from("question_options")
      .select("id, question_id, option_text, order_index")
      .in("question_id", questionIds)
      .order("order_index", { ascending: true });

    if (optionError) {
      return {
        isConfigured: true,
        userEmail: user.email ?? null,
        role,
        profileName,
        module: null,
        warning: mapSetupWarning(optionError.message)
      };
    }

    const optionsByQuestion = new Map<string, LearnerQuizQuestion["options"]>();

    optionRows?.forEach((option) => {
      const current = optionsByQuestion.get(option.question_id) ?? [];
      current.push({
        id: option.id,
        text: option.option_text,
        orderIndex: option.order_index
      });
      optionsByQuestion.set(option.question_id, current);
    });

    const questions: LearnerQuizQuestion[] = questionRows.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      orderIndex: question.order_index,
      options: optionsByQuestion.get(question.id) ?? []
    }));

    return {
      isConfigured: true,
      userEmail: user.email ?? null,
      role,
      profileName,
      module: {
        id: moduleRow.id,
        slug: moduleRow.slug,
        title: moduleRow.title,
        description: moduleRow.description,
        difficulty: moduleRow.difficulty,
        questionCount: moduleRow.question_count,
        questions
      },
      warning
    };
  } catch (error) {
    return {
      isConfigured: true,
      userEmail: user.email ?? null,
      role,
      profileName,
      module: null,
      warning: mapSetupWarning(
        error instanceof Error ? error.message : "Unable to load the protected quiz module."
      )
    };
  }
}
