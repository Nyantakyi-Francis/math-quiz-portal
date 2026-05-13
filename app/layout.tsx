import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta"
});

export const metadata: Metadata = {
  title: "Math Quiz Portal",
  description:
    "Protected learner portal for Elective Mathematics with Supabase auth, progress tracking, messaging, and admin insights."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Set the theme before React renders to avoid a flash of incorrect styles.
          - Preference is stored in localStorage (key: "math-quiz-portal-theme")
          - If not set, we default to a simple time-of-day heuristic (day/night)
          - We also sync `color-scheme` so built-in form controls match
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var key = "math-quiz-portal-theme";
                  var saved = window.localStorage.getItem(key);
                  var hour = new Date().getHours();
                  var timeTheme = hour >= 6 && hour < 18 ? "day" : "night";
                  var theme = saved === "day" || saved === "night" ? saved : timeTheme;
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = theme === "night" ? "dark" : "light";
                } catch (error) {
                  document.documentElement.dataset.theme = "day";
                  document.documentElement.style.colorScheme = "light";
                }
              })();
            `
          }}
        />
      </head>
      <body className={`${jakarta.variable} bg-[var(--surface)] text-slate-900 antialiased`}>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
