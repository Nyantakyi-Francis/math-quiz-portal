import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta"
});

export const metadata: Metadata = {
  title: "Math Quiz Portal",
  description:
    "Learning portal for Elective Mathematics by Nyantakyi Francis.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-256.png", sizes: "256x256", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.png"]
  }
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="default" name="apple-mobile-web-app-status-bar-style" />
        <meta content="Math Quiz Portal" name="apple-mobile-web-app-title" />
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
        <PwaRegister />
      </body>
    </html>
  );
}
