type LoadingBlockProps = {
  className: string;
};

function LoadingBlock({ className }: LoadingBlockProps) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}

function LoadingHeader() {
  return (
    <header className="chrome-header border-b backdrop-blur-2xl">
      <div className="shell flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <LoadingBlock className="h-7 w-48 rounded-full" />
          <LoadingBlock className="h-4 w-72 rounded-full" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LoadingBlock className="h-11 w-28 rounded-full" />
          <LoadingBlock className="h-11 w-28 rounded-full" />
          <LoadingBlock className="h-11 w-28 rounded-full" />
          <LoadingBlock className="h-11 w-24 rounded-full" />
          <LoadingBlock className="h-11 w-44 rounded-full" />
          <LoadingBlock className="h-11 w-28 rounded-full" />
        </div>
      </div>
    </header>
  );
}

export function PortalShellLoading({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <LoadingHeader />

      <main className="shell py-10">
        <div className="mb-8">
          <span className="eyebrow">Loading</span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{description}</p>
          <LoadingBlock className="mt-5 h-2.5 w-44 rounded-full" />
        </div>
        {children}
      </main>
    </div>
  );
}

export function AuthPageLoading() {
  return (
    <main className="shell flex min-h-screen items-center justify-center py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel-soft p-8 sm:p-10">
          <span className="eyebrow">Loading</span>
          <LoadingBlock className="mt-5 h-12 w-4/5 rounded-3xl" />
          <LoadingBlock className="mt-5 h-5 w-full rounded-full" />
          <LoadingBlock className="mt-3 h-5 w-4/5 rounded-full" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <LoadingBlock className="h-32 rounded-3xl" />
            <LoadingBlock className="h-32 rounded-3xl" />
          </div>
        </section>

        <section className="panel p-8 sm:p-10">
          <LoadingBlock className="h-4 w-28 rounded-full" />
          <LoadingBlock className="mt-3 h-10 w-40 rounded-2xl" />
          <div className="mt-8 space-y-5">
            <div className="space-y-3">
              <LoadingBlock className="h-4 w-28 rounded-full" />
              <LoadingBlock className="h-12 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <LoadingBlock className="h-4 w-28 rounded-full" />
              <LoadingBlock className="h-12 rounded-2xl" />
            </div>
            <LoadingBlock className="mt-3 h-12 rounded-full" />
          </div>
        </section>
      </div>
    </main>
  );
}

export function HomePageLoading() {
  return (
    <div className="min-h-screen">
      <header className="chrome-header border-b backdrop-blur-2xl">
        <div className="shell flex h-18 items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <LoadingBlock className="h-11 w-11 rounded-2xl" />
            <div className="space-y-2">
              <LoadingBlock className="h-4 w-36 rounded-full" />
              <LoadingBlock className="h-3 w-28 rounded-full" />
            </div>
          </div>

          <div className="flex gap-3">
            <LoadingBlock className="h-11 w-32 rounded-full" />
            <LoadingBlock className="h-11 w-24 rounded-full" />
          </div>
        </div>
      </header>

      <section className="shell py-12 sm:py-16">
        <div className="panel-soft p-8 sm:p-10">
          <LoadingBlock className="h-7 w-40 rounded-full" />
          <LoadingBlock className="mt-6 h-16 w-4/5 rounded-[2rem]" />
          <LoadingBlock className="mt-4 h-5 w-full rounded-full" />
          <LoadingBlock className="mt-3 h-5 w-5/6 rounded-full" />
          <div className="mt-8 flex flex-wrap gap-4">
            <LoadingBlock className="h-12 w-44 rounded-full" />
            <LoadingBlock className="h-12 w-36 rounded-full" />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <LoadingBlock className="h-28 rounded-3xl" />
            <LoadingBlock className="h-28 rounded-3xl" />
            <LoadingBlock className="h-28 rounded-3xl" />
          </div>
        </div>
      </section>

      <section className="shell pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="panel p-6" key={index}>
              <div className="flex items-start justify-between gap-3">
                <LoadingBlock className="h-7 w-28 rounded-full" />
                <LoadingBlock className="h-7 w-24 rounded-full" />
              </div>
              <LoadingBlock className="mt-5 h-8 w-4/5 rounded-2xl" />
              <LoadingBlock className="mt-4 h-4 w-full rounded-full" />
              <LoadingBlock className="mt-2 h-4 w-5/6 rounded-full" />
              <LoadingBlock className="mt-8 h-11 w-36 rounded-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function DashboardPageLoading() {
  return (
    <PortalShellLoading
      description="Loading your learner overview, recent attempts, and full protected module list."
      title="Dashboard"
    >
      <div className="space-y-8">
        <section className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="panel p-6" key={index}>
              <LoadingBlock className="h-4 w-28 rounded-full" />
              <LoadingBlock className="mt-4 h-10 w-20 rounded-2xl" />
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="panel p-6">
            <LoadingBlock className="h-6 w-40 rounded-2xl" />
            <LoadingBlock className="mt-3 h-4 w-80 rounded-full" />
            <div className="mt-6 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <LoadingBlock className="h-24 rounded-3xl" key={index} />
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <LoadingBlock className="h-6 w-32 rounded-2xl" />
            <LoadingBlock className="mt-3 h-4 w-64 rounded-full" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <LoadingBlock className="h-14 rounded-2xl" key={index} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </PortalShellLoading>
  );
}

export function ModulesPageLoading() {
  return (
    <PortalShellLoading
      description="Loading the protected module catalog so learners can browse every topic."
      title="Module Catalog"
    >
      <div className="space-y-6">
        <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <LoadingBlock className="h-5 w-32 rounded-full" />
            <LoadingBlock className="h-4 w-80 rounded-full" />
          </div>
          <LoadingBlock className="h-12 w-[280px] rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div className="panel p-6" key={index}>
              <div className="flex items-start justify-between gap-3">
                <LoadingBlock className="h-7 w-28 rounded-full" />
                <LoadingBlock className="h-7 w-24 rounded-full" />
              </div>
              <LoadingBlock className="mt-5 h-8 w-4/5 rounded-2xl" />
              <LoadingBlock className="mt-4 h-4 w-full rounded-full" />
              <LoadingBlock className="mt-2 h-4 w-5/6 rounded-full" />
              <LoadingBlock className="mt-6 h-11 w-36 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </PortalShellLoading>
  );
}

export function MessagesPageLoading() {
  return (
    <PortalShellLoading
      description="Loading your inbox, message status, and score notifications."
      title="Message Center"
    >
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel p-6">
          <LoadingBlock className="h-6 w-28 rounded-2xl" />
          <LoadingBlock className="mt-3 h-4 w-80 rounded-full" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingBlock className="h-32 rounded-3xl" key={index} />
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <LoadingBlock className="h-6 w-36 rounded-2xl" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingBlock className="h-16 rounded-2xl" key={index} />
            ))}
          </div>
        </div>
      </section>
    </PortalShellLoading>
  );
}

export function AdminPageLoading() {
  return (
    <PortalShellLoading
      description="Loading learner performance, admin tools, and messaging controls."
      title="Admin Console"
    >
      <div className="space-y-6">
        <section className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="panel p-6" key={index}>
              <LoadingBlock className="h-4 w-32 rounded-full" />
              <LoadingBlock className="mt-4 h-10 w-20 rounded-2xl" />
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="panel p-6">
            <LoadingBlock className="h-6 w-32 rounded-2xl" />
            <LoadingBlock className="mt-3 h-4 w-64 rounded-full" />
            <div className="mt-6 space-y-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="space-y-3" key={index}>
                  <LoadingBlock className="h-4 w-24 rounded-full" />
                  <LoadingBlock className="h-12 rounded-2xl" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="panel p-6" key={index}>
                <LoadingBlock className="h-6 w-40 rounded-2xl" />
                <div className="mt-6 space-y-3">
                  {Array.from({ length: 3 }).map((__, innerIndex) => (
                    <LoadingBlock className="h-20 rounded-2xl" key={innerIndex} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PortalShellLoading>
  );
}

export function QuizPageLoading() {
  return (
    <PortalShellLoading
      description="Loading your protected quiz, question set, and answer options."
      title="Module Quiz"
    >
      <div className="space-y-8">
        <div className="panel p-6">
          <LoadingBlock className="h-7 w-32 rounded-full" />
          <LoadingBlock className="mt-4 h-10 w-3/5 rounded-3xl" />
          <LoadingBlock className="mt-4 h-4 w-full rounded-full" />
          <LoadingBlock className="mt-2 h-4 w-5/6 rounded-full" />
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <div className="panel p-6" key={index}>
            <div className="flex items-start gap-4">
              <LoadingBlock className="h-8 w-8 rounded-xl" />
              <div className="flex-1">
                <LoadingBlock className="h-7 w-4/5 rounded-2xl" />
                <div className="mt-5 grid gap-3">
                  {Array.from({ length: 4 }).map((__, optionIndex) => (
                    <LoadingBlock className="h-14 rounded-2xl" key={optionIndex} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PortalShellLoading>
  );
}
