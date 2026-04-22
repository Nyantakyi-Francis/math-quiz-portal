type SetupBannerProps = {
  title: string;
  message: string;
};

export function SetupBanner({ title, message }: SetupBannerProps) {
  return (
    <div className="glass-card rounded-[1.75rem] border-amber-200/70 bg-linear-to-br from-amber-50/90 via-white/85 to-blue-50/70 px-5 py-4 text-amber-950">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">{title}</p>
      <div className="academic-rule mt-3" />
      <p className="mt-3 text-sm leading-6 text-slate-700">{message}</p>
    </div>
  );
}
