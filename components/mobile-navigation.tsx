"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconName = "dashboard" | "modules" | "resources" | "messages" | "students" | "admin";

type MobileNavigationProps = {
  role: string;
};

const iconPaths: Record<IconName, React.ReactNode> = {
  dashboard: <path d="M3 11.5 12 4l9 7.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-8ZM9 21v-6h6v6" />,
  modules: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" />,
  resources: <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3h8L20 9.5v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-15ZM13 3v7h7M8 14h8M8 17.5h6" />,
  messages: <path d="M4 5h16v12H9l-5 4V5ZM8 9h8M8 13h5" />,
  students: <path d="M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 8h4M19 6v4" />,
  admin: <path d="M12 3 4.5 6v5.5c0 4.8 3.2 8.1 7.5 9.5 4.3-1.4 7.5-4.7 7.5-9.5V6L12 3ZM9 12l2 2 4-4" />
};

function NavIcon({ name }: { name: IconName }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      {iconPaths[name]}
    </svg>
  );
}

export function MobileNavigation({ role }: MobileNavigationProps) {
  const pathname = usePathname();
  const items: Array<{ href: string; label: string; icon: IconName }> = role === "admin"
    ? [
        { href: "/dashboard", label: "Home", icon: "dashboard" },
        { href: "/modules", label: "Modules", icon: "modules" },
        { href: "/resources", label: "Resources", icon: "resources" },
        { href: "/admin/messages", label: "Messages", icon: "messages" },
        { href: "/admin", label: "Admin", icon: "admin" }
      ]
    : [
        { href: "/dashboard", label: "Home", icon: "dashboard" },
        { href: "/modules", label: "Modules", icon: "modules" },
        { href: "/resources", label: "Resources", icon: "resources" },
        { href: "/messages", label: "Messages", icon: "messages" },
        { href: "/students", label: "Students", icon: "students" }
      ];

  return (
    <nav aria-label="Primary navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`focus-outline flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[0.65rem] font-semibold transition-colors ${active ? "text-indigo-700" : "text-slate-500 hover:text-slate-900"}`}
              href={item.href}
              key={item.href}
            >
              <NavIcon name={item.icon} />
              <span className="max-w-full truncate px-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
