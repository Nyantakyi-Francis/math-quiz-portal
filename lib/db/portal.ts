import { redirect } from "next/navigation";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { modules } from "@/lib/data/modules";

type DashboardAttempt = {
  id: string;
  moduleTitle: string;
  moduleSlug: string;
  scorePercent: number;
  createdAt: string;
};

type InboxMessage = {
  id: string;
  subject: string;
  body: string;
  type: string;
  createdAt: string;
  readAt: string | null;
};

type LearnerRow = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  joinedAt: string;
};

type AttemptRow = {
  id: string;
  learnerId: string;
  learnerName: string;
  moduleTitle: string;
  scorePercent: number;
  createdAt: string;
};

type SentMessageRow = {
  id: string;
  subject: string;
  type: string;
  createdAt: string;
  recipientCount: number;
};

type SetupWarning = string | null;

function mapSetupWarning(message: string) {
  if (
    message.includes("relation") ||
    message.includes("does not exist") ||
    message.includes("schema cache")
  ) {
    return "Supabase is connected, but the database schema has not been applied yet.";
  }

  return message;
}

export async function getCurrentSession() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      supabase: null,
      user: null,
      isConfigured: false
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return {
    supabase,
    user,
    isConfigured: true
  };
}

export async function requireUser() {
  const session = await getCurrentSession();

  if (!session.isConfigured) {
    return session;
  }

  if (!session.user) {
    redirect("/login");
  }

  return session;
}

async function ensureProfile(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  user: NonNullable<Awaited<ReturnType<typeof getCurrentSession>>["user"]>
) {
  try {
    await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email ?? null,
        full_name:
          typeof user.user_metadata.full_name === "string"
            ? user.user_metadata.full_name
            : null
      },
      {
        onConflict: "id"
      }
    );
  } catch {
    // Ignore until schema exists.
  }
}

export async function getDashboardSnapshot() {
  const session = await requireUser();

  if (!session.supabase || !session.user) {
    return {
      isConfigured: getSupabaseEnv().isConfigured,
      userEmail: null,
      profileName: null,
      role: "learner",
      totals: {
        attemptedModules: 0,
        averageScore: 0,
        unreadMessages: 0
      },
      attempts: [] as DashboardAttempt[],
      messages: [] as InboxMessage[],
      warning:
        "Connect Supabase and apply the SQL schema before protected learner data can load." as SetupWarning
    };
  }

  await ensureProfile(session.supabase, session.user);

  let warning: SetupWarning = null;
  let role = "learner";
  let profileName =
    typeof session.user.user_metadata.full_name === "string"
      ? session.user.user_metadata.full_name
      : null;
  let attempts: DashboardAttempt[] = [];
  let messages: InboxMessage[] = [];

  try {
    const { data, error } = await session.supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      warning = mapSetupWarning(error.message);
    } else if (data) {
      profileName = data.full_name;
      role = data.role ?? "learner";
    }
  } catch (error) {
    warning = mapSetupWarning(error instanceof Error ? error.message : "Unable to load profile.");
  }

  try {
    const { data, error } = await session.supabase
      .from("attempts")
      .select("id, score_percent, created_at, modules(title, slug)")
      .eq("learner_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      warning ??= mapSetupWarning(error.message);
    } else if (data) {
      attempts = data.map((attempt: any) => ({
        id: attempt.id,
        moduleTitle: attempt.modules?.title ?? "Module",
        moduleSlug: attempt.modules?.slug ?? "",
        scorePercent: Number(attempt.score_percent ?? 0),
        createdAt: attempt.created_at
      }));
    }
  } catch (error) {
    warning ??= mapSetupWarning(error instanceof Error ? error.message : "Unable to load attempts.");
  }

  try {
    const { data, error } = await session.supabase
      .from("message_recipients")
      .select("id, read_at, messages(id, subject, body, message_type, created_at)")
      .eq("recipient_id", session.user.id)
      .order("created_at", { foreignTable: "messages", ascending: false })
      .limit(6);

    if (error) {
      warning ??= mapSetupWarning(error.message);
    } else if (data) {
      messages = data.map((entry: any) => ({
        id: entry.messages?.id ?? entry.id,
        subject: entry.messages?.subject ?? "Message",
        body: entry.messages?.body ?? "",
        type: entry.messages?.message_type ?? "system",
        createdAt: entry.messages?.created_at ?? new Date().toISOString(),
        readAt: entry.read_at
      }));
    }
  } catch (error) {
    warning ??= mapSetupWarning(error instanceof Error ? error.message : "Unable to load inbox.");
  }

  const attemptedModules = new Set(
    attempts.map((attempt) => attempt.moduleSlug).filter(Boolean)
  ).size;
  const averageScore = attempts.length
    ? Number(
        (
          attempts.reduce((sum, attempt) => sum + attempt.scorePercent, 0) /
          attempts.length
        ).toFixed(1)
      )
    : 0;
  const unreadMessages = messages.filter((message) => !message.readAt).length;

  return {
    isConfigured: true,
    userEmail: session.user.email ?? null,
    profileName,
    role,
    totals: {
      attemptedModules,
      averageScore,
      unreadMessages
    },
    attempts,
    messages,
    warning
  };
}

export async function getMessagesSnapshot() {
  const dashboard = await getDashboardSnapshot();

  return {
    ...dashboard,
    allModules: modules
  };
}

export async function getAdminSnapshot() {
  const session = await requireUser();

  if (!session.supabase || !session.user) {
    return {
      isConfigured: getSupabaseEnv().isConfigured,
      userEmail: null,
      authorized: false,
      warning:
        "Connect Supabase and apply the schema before the admin dashboard can load." as SetupWarning,
      learners: [] as LearnerRow[],
      attempts: [] as AttemptRow[],
      sentMessages: [] as SentMessageRow[]
    };
  }

  await ensureProfile(session.supabase, session.user);

  let warning: SetupWarning = null;
  let authorized = false;
  let learners: LearnerRow[] = [];
  let attempts: AttemptRow[] = [];
  let sentMessages: SentMessageRow[] = [];

  try {
    const { data: profile, error: profileError } = await session.supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profileError) {
      warning = mapSetupWarning(profileError.message);
    } else {
      authorized = profile?.role === "admin";
    }
  } catch (error) {
    warning = mapSetupWarning(error instanceof Error ? error.message : "Unable to load role.");
  }

  if (!authorized) {
    return {
      isConfigured: true,
      userEmail: session.user.email ?? null,
      authorized: false,
      warning:
        warning ??
        "Your account is not marked as an admin yet. Update your profile role in Supabase after applying the schema.",
      learners,
      attempts,
      sentMessages
    };
  }

  try {
    const { data, error } = await session.supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) {
      warning ??= mapSetupWarning(error.message);
    } else if (data) {
      learners = data.map((profile: any) => ({
        id: profile.id,
        email: profile.email ?? "No email",
        fullName: profile.full_name,
        role: profile.role ?? "learner",
        joinedAt: profile.created_at
      }));
    }
  } catch (error) {
    warning ??= mapSetupWarning(error instanceof Error ? error.message : "Unable to load learners.");
  }

  try {
    const { data, error } = await session.supabase
      .from("attempts")
      .select("id, learner_id, score_percent, created_at, profiles(full_name), modules(title)")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      warning ??= mapSetupWarning(error.message);
    } else if (data) {
      attempts = data.map((attempt: any) => ({
        id: attempt.id,
        learnerId: attempt.learner_id,
        learnerName: attempt.profiles?.full_name ?? "Learner",
        moduleTitle: attempt.modules?.title ?? "Module",
        scorePercent: Number(attempt.score_percent ?? 0),
        createdAt: attempt.created_at
      }));
    }
  } catch (error) {
    warning ??= mapSetupWarning(
      error instanceof Error ? error.message : "Unable to load learner performance."
    );
  }

  try {
    const { data: messages, error: messagesError } = await session.supabase
      .from("messages")
      .select("id, subject, message_type, created_at")
      .eq("sender_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(8);

    if (messagesError) {
      warning ??= mapSetupWarning(messagesError.message);
    } else if (messages?.length) {
      const messageIds = messages.map((message) => message.id);
      const { data: recipients, error: recipientsError } = await session.supabase
        .from("message_recipients")
        .select("message_id")
        .in("message_id", messageIds);

      if (recipientsError) {
        warning ??= mapSetupWarning(recipientsError.message);
      } else {
        const recipientCountByMessage = new Map<string, number>();

        recipients?.forEach((recipient: any) => {
          const count = recipientCountByMessage.get(recipient.message_id) ?? 0;
          recipientCountByMessage.set(recipient.message_id, count + 1);
        });

        sentMessages = messages.map((message: any) => ({
          id: message.id,
          subject: message.subject,
          type: message.message_type,
          createdAt: message.created_at,
          recipientCount: recipientCountByMessage.get(message.id) ?? 0
        }));
      }
    }
  } catch (error) {
    warning ??= mapSetupWarning(
      error instanceof Error ? error.message : "Unable to load sent messages."
    );
  }

  return {
    isConfigured: true,
    userEmail: session.user.email ?? null,
    authorized,
    warning,
    learners,
    attempts,
    sentMessages
  };
}
