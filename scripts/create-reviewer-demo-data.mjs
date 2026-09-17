import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before creating reviewer demo data."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const demoUsers = [
  {
    email: "reviewer.learner@example.com",
    password: "ReviewerLearner#2026",
    fullName: "Reviewer Learner",
    role: "learner"
  },
  {
    email: "reviewer.admin@example.com",
    password: "ReviewerAdmin#2026",
    fullName: "Reviewer Admin",
    role: "admin"
  }
];

async function findOrCreateUser(user) {
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      full_name: user.fullName
    }
  });

  if (created?.user) {
    return created.user;
  }

  if (!createError?.message.toLowerCase().includes("already")) {
    throw createError ?? new Error(`Unable to create ${user.email}`);
  }

  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });

  if (error) {
    throw error;
  }

  const existing = data.users.find((candidate) => candidate.email === user.email);

  if (!existing) {
    throw new Error(`User ${user.email} exists but could not be found by listUsers.`);
  }

  await supabase.auth.admin.updateUserById(existing.id, {
    password: user.password,
    email_confirm: true,
    user_metadata: {
      full_name: user.fullName
    }
  });

  return existing;
}

async function main() {
  const users = new Map();

  for (const demoUser of demoUsers) {
    const authUser = await findOrCreateUser(demoUser);

    const { error } = await supabase.from("profiles").upsert(
      {
        id: authUser.id,
        email: demoUser.email,
        full_name: demoUser.fullName,
        role: demoUser.role
      },
      { onConflict: "id" }
    );

    if (error) {
      throw error;
    }

    users.set(demoUser.role, authUser.id);
  }

  const learnerId = users.get("learner");
  const adminId = users.get("admin");

  const { data: moduleRows, error: modulesError } = await supabase
    .from("modules")
    .select("id, slug")
    .in("slug", ["binary-sets-binomial", "vectors", "statistics"]);

  if (modulesError) {
    throw modulesError;
  }

  const scoreBySlug = new Map([
    ["binary-sets-binomial", [62, 78]],
    ["vectors", [55]],
    ["statistics", [84]]
  ]);

  for (const moduleRow of moduleRows ?? []) {
    const scores = scoreBySlug.get(moduleRow.slug) ?? [];

    for (const [index, score] of scores.entries()) {
      const { error } = await supabase.from("attempts").insert({
        learner_id: learnerId,
        module_id: moduleRow.id,
        score_raw: score,
        score_total: 100,
        score_percent: score,
        completed_at: new Date(Date.now() - (scores.length - index) * 86400000).toISOString()
      });

      if (error) {
        throw error;
      }
    }
  }

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert({
      sender_id: adminId,
      subject: "Reviewer demo account ready",
      body: "This synthetic account contains sample attempts and an admin message for licensing review.",
      message_type: "announcement"
    })
    .select("id")
    .single();

  if (messageError) {
    throw messageError;
  }

  const { error: recipientError } = await supabase.from("message_recipients").insert({
    message_id: message.id,
    recipient_id: learnerId
  });

  if (recipientError) {
    throw recipientError;
  }

  console.log("Reviewer demo data created.");
  console.log("Learner: reviewer.learner@example.com / ReviewerLearner#2026");
  console.log("Admin: reviewer.admin@example.com / ReviewerAdmin#2026");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
