import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter is the guaranteed fallback in the Graphik / Sofia Pro stack — both of
// those are commercial fonts the host site is expected to load via Adobe
// Fonts (or @font-face) at the document level. Inter ships with the build so
// the type design never collapses to system sans.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skill Tree · HR Learning Festival",
  description:
    "Map your skills across HR, Finance and Admin, set your next career goal, and see the path to get there. A booth demo by HR Learning Festival.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#bb342f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                const d = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (t === 'dark' || (!t && d)) document.documentElement.classList.add('dark');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  );
}
