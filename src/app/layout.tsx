import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Nav } from "@/components/nav";
import { AuthProvider } from "@/contexts/auth";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "On Time - Dog Walker",
  description: "Book vetted dog walkers across Miami neighborhoods.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--color-canvas)] text-[var(--color-ink)]">
        <AuthProvider>
          <Nav />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
