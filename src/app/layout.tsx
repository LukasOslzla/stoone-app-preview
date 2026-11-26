import type { Metadata } from "next";
import Script from "next/script";
import { Hanken_Grotesk, Lexend } from "next/font/google";
import { themeInitScript } from "@/lib/theme-script";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin", "latin-ext"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "STOONE",
    template: "%s · STOONE",
  },
  description: "Administrace developerských projektů STOONE.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="cs"
      // The script below sets data-theme before React hydrates.
      suppressHydrationWarning
      className={`${lexend.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="h-full">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
