import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
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
    <html lang="en">
      <body className={`${jakarta.variable} bg-[var(--surface)] text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
