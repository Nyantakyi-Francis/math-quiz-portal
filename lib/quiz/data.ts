import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getModuleBySlug } from "@/lib/data/modules";
import type { LearnerQuizModule, LearnerQuizQuestion } from "@/lib/quiz/types";
import { normalizeQuizStimulus } from "@/lib/quiz/stimuli";
import { getSafeDataError } from "@/lib/errors/user-facing";

type ModulePageSnapshot = {
  isConfigured: boolean;
  userEmail: string | null;
  role: string;
  profileName: string | null;
  module: LearnerQuizModule | null;
  warning: string | null;
};

function mapSetupWarning(message: string) {
  console.error("Quiz data request failed:", message);
  return getSafeDataError();
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
      warning: getSafeDataError()
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
        warning: "This module is not available yet."
      };
    }

    const { data: questionRows, error: questionError } = await supabase
      .from("questions")
      .select("id, prompt, order_index, stimulus_id")
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
        warning: legacyModule?.slug === slug ? "This quiz is not available yet." : warning
      };
    }

    const questionIds = questionRows.map((question) => question.id);
    const stimulusIds = questionRows.flatMap((question) =>
      question.stimulus_id ? [question.stimulus_id] : []
    );
    const [optionResult, stimulusResult] = await Promise.all([
      supabase
        .from("question_options")
        .select("id, question_id, option_text, order_index")
        .in("question_id", questionIds)
        .order("order_index", { ascending: true }),
      stimulusIds.length
        ? supabase.from("question_stimuli").select("id, content").in("id", stimulusIds)
        : Promise.resolve({ data: [], error: null })
    ]);
    const { data: optionRows, error: optionError } = optionResult;
    const { data: stimulusRows, error: stimulusError } = stimulusResult;

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

    if (stimulusError) {
      return {
        isConfigured: true,
        userEmail: user.email ?? null,
        role,
        profileName,
        module: null,
        warning: mapSetupWarning(stimulusError.message)
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
    const stimulusById = new Map(
      (stimulusRows ?? []).map((stimulus) => [
        stimulus.id,
        normalizeQuizStimulus(stimulus.content)
      ])
    );

    const questions: LearnerQuizQuestion[] = questionRows.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      orderIndex: question.order_index,
      stimulus: question.stimulus_id ? stimulusById.get(question.stimulus_id) ?? null : null,
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
        error instanceof Error ? error.message : "Unable to load the quiz module."
      )
    };
  }
}
