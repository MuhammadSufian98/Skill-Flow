import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NeuralBackground from "@/components/NeuralBackground";
import AppShell from "@/components/AppShell";
import Providers from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Skill Flow",
  description: "Quiz and Study App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-black`}
      >
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <NeuralBackground />
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-linear-to-br from-cyan-400/25 via-purple-600/35 to-pink-500/25 blur-2xl" />
        </div>

        {/* ✅ Providers should be the outer client boundary */}
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
