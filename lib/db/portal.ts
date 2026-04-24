import { redirect } from "next/navigation";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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
  senderId: string | null;
  senderLabel: string;
  senderEmail: string | null;
  senderPhone: string | null;
  subject: string;
  body: string;
  preview: string;
  type: string;
  createdAt: string;
  readAt: string | null;
  direction: "incoming" | "outgoing";
};

type RawInboxMessage = Omit<
  InboxMessage,
  "senderLabel" | "senderEmail" | "senderPhone" | "preview"
>;

type AdminContact = {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
};

type LearnerRow = {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
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

const inboxMessageSelect =
  "read_at, messages(id, sender_id, subject, body, message_type, created_at)";

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

function buildMessagePreview(body: string) {
  const compactBody = body.replace(/\s+/g, " ").trim();

  if (compactBody.length <= 160) {
    return compactBody;
  }

  return `${compactBody.slice(0, 157).trimEnd()}...`;
}

function getDefaultSenderLabel(messageType: string) {
  if (messageType === "score" || messageType === "system") {
    return "System";
  }

  if (messageType === "admin") {
    return "Admin";
  }

  return "Admin team";
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function getProfileSummary(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  user: NonNullable<Awaited<ReturnType<typeof getCurrentSession>>["user"]>
) {
  let warning: SetupWarning = null;
  let role = "learner";
  let profileName =
    typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : null;
  let phone =
    typeof user.user_metadata.phone === "string" && user.user_metadata.phone.trim()
      ? user.user_metadata.phone.trim()
      : null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, role, phone")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      warning = mapSetupWarning(error.message);
    } else if (data) {
      profileName = data.full_name;
      role = data.role ?? "learner";
      phone = data.phone ?? phone;
    }
  } catch (error) {
    warning = mapSetupWarning(error instanceof Error ? error.message : "Unable to load profile.");
  }

  return {
    warning,
    role,
    profileName,
    phone
  };
}

async function getUnreadMessagesCount(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  userId: string
) {
  try {
    const { count, error } = await supabase
      .from("message_recipients")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", userId)
      .is("read_at", null);

    if (error) {
      return {
        unreadMessages: 0,
        warning: mapSetupWarning(error.message)
      };
    }

    return {
      unreadMessages: count ?? 0,
      warning: null as SetupWarning
    };
  } catch (error) {
    return {
      unreadMessages: 0,
      warning: mapSetupWarning(error instanceof Error ? error.message : "Unable to load inbox.")
    };
  }
}

async function getInboxMessages(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  userId: string,
  role: string,
  limit?: number,
  includeSent = false,
  ascending = false
) {
  let warning: SetupWarning = null;

  try {
    let query = supabase
      .from("message_recipients")
      .select(inboxMessageSelect)
      .eq("recipient_id", userId)
      .order("created_at", { foreignTable: "messages", ascending });

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      return {
        messages: [] as InboxMessage[],
        warning: mapSetupWarning(error.message)
      };
    }

    const rawMessages: RawInboxMessage[] = (data ?? [])
      .map<RawInboxMessage | null>((entry: any) => {
        const messageRow = Array.isArray(entry.messages) ? entry.messages[0] : entry.messages;

        if (!messageRow?.id) {
          return null;
        }

        return {
          id: messageRow.id,
          senderId: messageRow.sender_id ?? null,
          subject: messageRow.subject ?? "Message",
          body: messageRow.body ?? "",
          type: messageRow.message_type ?? "system",
          createdAt: messageRow.created_at ?? new Date().toISOString(),
          readAt: entry.read_at,
          direction: "incoming" as const
        };
      })
      .filter((message): message is RawInboxMessage => Boolean(message));

    let sentMessages: RawInboxMessage[] = [];

    if (includeSent) {
      const { data: sentRows, error: sentError } = await supabase
        .from("messages")
        .select("id, sender_id, subject, body, message_type, created_at")
        .eq("sender_id", userId)
        .order("created_at", { ascending });

      if (sentError) {
        warning ??= mapSetupWarning(sentError.message);
      } else {
        sentMessages = (sentRows ?? []).map((messageRow: any) => ({
          id: messageRow.id,
          senderId: messageRow.sender_id ?? null,
          subject: messageRow.subject ?? "Message",
          body: messageRow.body ?? "",
          type: messageRow.message_type ?? "admin",
          createdAt: messageRow.created_at ?? new Date().toISOString(),
          readAt: null,
          direction: "outgoing" as const
        }));
      }
    }

    const allMessages = [...rawMessages, ...sentMessages]
      .filter(
        (message, index, messages) =>
          messages.findIndex((candidate) => candidate.id === message.id) === index
      )
      .sort((a, b) => {
        const direction = ascending ? 1 : -1;
        return direction * (Date.parse(a.createdAt) - Date.parse(b.createdAt));
      });

    const senderIds = allMessages
      .map((message) => message.senderId)
      .filter((senderId): senderId is string => Boolean(senderId));
    const senderLookup = new Map<
      string,
      { fullName: string | null; email: string | null; phone: string | null }
    >();

    if (senderIds.length) {
      const { data: senders, error: sendersError } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone")
        .in("id", Array.from(new Set(senderIds)));

      if (sendersError) {
        warning ??= mapSetupWarning(sendersError.message);
      } else {
        (senders ?? []).forEach((sender: any) => {
          senderLookup.set(sender.id, {
            fullName: sender.full_name,
            email: sender.email ?? null,
            phone: sender.phone ?? null
          });
        });
      }
    }

    return {
      messages: allMessages.map((message) => {
        const sender = message.senderId ? senderLookup.get(message.senderId) : null;
        const senderLabel =
          role === "admin"
            ? sender?.fullName ?? sender?.email ?? getDefaultSenderLabel(message.type)
            : getDefaultSenderLabel(message.type);

        return {
          ...message,
          senderLabel:
            message.direction === "outgoing"
              ? "You"
              : message.type === "admin"
              ? sender?.fullName ?? sender?.email ?? "Admin"
              : senderLabel,
          senderEmail: sender?.email ?? null,
          senderPhone: sender?.phone ?? null,
          preview: buildMessagePreview(message.body)
        };
      }),
      warning
    };
  } catch (error) {
    return {
      messages: [] as InboxMessage[],
      warning: mapSetupWarning(error instanceof Error ? error.message : "Unable to load inbox.")
    };
  }
}

async function getAdminContacts() {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    return {
      adminContacts: [] as AdminContact[],
      warning: "Supabase is not configured yet." as SetupWarning
    };
  }

  try {
    const { data, error } = await admin
      .from("profiles")
      .select("id, full_name, email, phone")
      .eq("role", "admin")
      .order("created_at", { ascending: true });

    if (error) {
      return {
        adminContacts: [] as AdminContact[],
        warning: mapSetupWarning(error.message)
      };
    }

    return {
      adminContacts: (data ?? []).map((profile: any) => ({
        id: profile.id,
        email: profile.email ?? "No email",
        fullName: profile.full_name,
        phone: profile.phone ?? null
      })),
      warning: null as SetupWarning
    };
  } catch (error) {
    return {
      adminContacts: [] as AdminContact[],
      warning: mapSetupWarning(error instanceof Error ? error.message : "Unable to load admins.")
    };
  }
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
            : null,
        phone:
          typeof user.user_metadata.phone === "string" && user.user_metadata.phone.trim()
            ? user.user_metadata.phone.trim()
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
      userPhone: null,
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

  const profileSummary = await getProfileSummary(session.supabase, session.user);
  let warning: SetupWarning = profileSummary.warning;
  const role = profileSummary.role;
  const profileName = profileSummary.profileName;
  let attempts: DashboardAttempt[] = [];

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

  const inboxResult = await getInboxMessages(session.supabase, session.user.id, role, 6);
  const unreadResult = await getUnreadMessagesCount(session.supabase, session.user.id);
  const messages = inboxResult.messages;

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
  const unreadMessages = unreadResult.unreadMessages;
  warning ??= inboxResult.warning ?? unreadResult.warning;

  return {
    isConfigured: true,
    userEmail: session.user.email ?? null,
    profileName,
    userPhone: profileSummary.phone,
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
  const session = await requireUser();

  if (!session.supabase || !session.user) {
    return {
      isConfigured: getSupabaseEnv().isConfigured,
      userEmail: null,
      profileName: null,
      userPhone: null,
      role: "learner",
      totals: {
        attemptedModules: 0,
        averageScore: 0,
        unreadMessages: 0
      },
      attempts: [] as DashboardAttempt[],
      messages: [] as InboxMessage[],
      adminContacts: [] as AdminContact[],
      allModules: modules,
      warning:
        "Connect Supabase and apply the SQL schema before protected learner data can load." as SetupWarning
    };
  }

  await ensureProfile(session.supabase, session.user);

  const profileSummary = await getProfileSummary(session.supabase, session.user);
  const inboxResult = await getInboxMessages(
    session.supabase,
    session.user.id,
    profileSummary.role,
    undefined,
    true,
    true
  );
  const unreadResult = await getUnreadMessagesCount(session.supabase, session.user.id);
  const adminContactsResult =
    profileSummary.role === "admin"
      ? { adminContacts: [] as AdminContact[], warning: null as SetupWarning }
      : await getAdminContacts();

  return {
    isConfigured: true,
    userEmail: session.user.email ?? null,
    profileName: profileSummary.profileName,
    userPhone: profileSummary.phone,
    role: profileSummary.role,
    totals: {
      attemptedModules: 0,
      averageScore: 0,
      unreadMessages: unreadResult.unreadMessages
    },
    attempts: [] as DashboardAttempt[],
    messages: inboxResult.messages,
    adminContacts: adminContactsResult.adminContacts,
    allModules: modules,
    warning: profileSummary.warning ?? inboxResult.warning ?? unreadResult.warning ?? adminContactsResult.warning
  };
}

export async function getMessageDetailSnapshot(messageId: string) {
  const session = await requireUser();

  if (!session.supabase || !session.user) {
    return {
      isConfigured: getSupabaseEnv().isConfigured,
      userEmail: null,
      profileName: null,
      userPhone: null,
      role: "learner",
      message: null as InboxMessage | null,
      warning:
        "Connect Supabase and apply the SQL schema before protected learner data can load." as SetupWarning
    };
  }

  await ensureProfile(session.supabase, session.user);

  const profileSummary = await getProfileSummary(session.supabase, session.user);
  let warning: SetupWarning = profileSummary.warning;

  if (!isUuid(messageId)) {
    return {
      isConfigured: true,
      userEmail: session.user.email ?? null,
      profileName: profileSummary.profileName,
      userPhone: profileSummary.phone,
      role: profileSummary.role,
      message: null as InboxMessage | null,
      warning: "That message link is invalid."
    };
  }

  try {
    const { data, error } = await session.supabase
      .from("message_recipients")
      .select(inboxMessageSelect)
      .eq("recipient_id", session.user.id)
      .eq("message_id", messageId)
      .maybeSingle();

    if (error) {
      return {
        isConfigured: true,
        userEmail: session.user.email ?? null,
        profileName: profileSummary.profileName,
        userPhone: profileSummary.phone,
        role: profileSummary.role,
        message: null as InboxMessage | null,
        warning: mapSetupWarning(error.message)
      };
    }

    const messageRow = Array.isArray(data?.messages) ? data.messages[0] : data?.messages;

    if (!messageRow) {
      return {
        isConfigured: true,
        userEmail: session.user.email ?? null,
        profileName: profileSummary.profileName,
        userPhone: profileSummary.phone,
        role: profileSummary.role,
        message: null as InboxMessage | null,
        warning
      };
    }

    const createdAt = messageRow.created_at ?? new Date().toISOString();
    let readAt = data?.read_at ?? null;

    if (!readAt) {
      const nextReadAt = new Date().toISOString();
      const { error: readError } = await session.supabase
        .from("message_recipients")
        .update({
          read_at: nextReadAt
        })
        .eq("recipient_id", session.user.id)
        .eq("message_id", messageId)
        .is("read_at", null);

      if (readError) {
        warning ??= mapSetupWarning(readError.message);
      } else {
        readAt = nextReadAt;
      }
    }

    let senderLabel = getDefaultSenderLabel(messageRow.message_type ?? "system");
    let senderEmail: string | null = null;
    let senderPhone: string | null = null;

    if (messageRow.sender_id) {
      const { data: sender, error: senderError } = await session.supabase
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", messageRow.sender_id)
        .maybeSingle();

      if (senderError) {
        warning ??= mapSetupWarning(senderError.message);
      } else if (sender) {
        senderLabel =
          messageRow.message_type === "admin"
            ? sender.full_name ?? sender.email ?? "Admin"
            : sender.full_name ?? sender.email ?? senderLabel;
        senderEmail = sender.email ?? null;
        senderPhone = sender.phone ?? null;
      }
    }

    return {
      isConfigured: true,
      userEmail: session.user.email ?? null,
      profileName: profileSummary.profileName,
      userPhone: profileSummary.phone,
      role: profileSummary.role,
      message: {
        id: messageRow.id,
        senderId: messageRow.sender_id ?? null,
        senderLabel,
        senderEmail,
        senderPhone,
        subject: messageRow.subject ?? "Message",
        body: messageRow.body ?? "",
        preview: buildMessagePreview(messageRow.body ?? ""),
        type: messageRow.message_type ?? "system",
        createdAt,
        readAt
      },
      warning
    };
  } catch (error) {
    return {
      isConfigured: true,
      userEmail: session.user.email ?? null,
      profileName: profileSummary.profileName,
      userPhone: profileSummary.phone,
      role: profileSummary.role,
      message: null as InboxMessage | null,
      warning: mapSetupWarning(error instanceof Error ? error.message : "Unable to load message.")
    };
  }
}

export async function getAdminSnapshot() {
  const session = await requireUser();

  if (!session.supabase || !session.user) {
    return {
      isConfigured: getSupabaseEnv().isConfigured,
      userEmail: null,
      userPhone: null,
      authorized: false,
      warning:
        "Connect Supabase and apply the schema before the admin dashboard can load." as SetupWarning,
      learners: [] as LearnerRow[],
      attempts: [] as AttemptRow[],
      sentMessages: [] as SentMessageRow[]
    };
  }

  await ensureProfile(session.supabase, session.user);
  const profileSummary = await getProfileSummary(session.supabase, session.user);

  let warning: SetupWarning = profileSummary.warning;
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
      userPhone: profileSummary.phone,
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
      .select("id, email, full_name, phone, role, created_at")
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) {
      warning ??= mapSetupWarning(error.message);
    } else if (data) {
      learners = data.map((profile: any) => ({
        id: profile.id,
        email: profile.email ?? "No email",
        fullName: profile.full_name,
        phone: profile.phone ?? null,
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
    userPhone: profileSummary.phone,
    authorized,
    warning,
    learners,
    attempts,
    sentMessages
  };
}
