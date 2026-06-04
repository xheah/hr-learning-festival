import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sofia_Sans } from "next/font/google";
import "./globals.css";

// Graphik and Sofia Pro are commercial fonts that aren't available on Google
// Fonts. We use two open-source siblings that match the brief ("professional
// with a bit of playfulness"):
//
//   • Plus Jakarta Sans — geometric sans with humanist warmth. Serves as
//     the body / UI font. Closest free analogue to Graphik.
//   • Sofia Sans — the free open-source sibling of Sofia Pro by the same
//     designer (Mostardesign). Used as the display font for headings.
//
// Both are loaded via next/font/google so they're inlined at build time —
// no runtime network call, no FOUT.

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Sofia_Sans({
  subsets: ["latin"],
  variable: "--font-display",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable}`}
    >
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
