import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ACP Watchtower — Validate Agent Manifests & Catch Action Drift",
  description:
    "Validate ACP manifests, catch action drift, and generate shareable readiness reports. Free readiness scoring for AI agent teams.",
  openGraph: {
    title: "ACP Watchtower",
    description: "Validate ACP manifests, score readiness, diff releases, and automate compliance checks.",
    url: "https://acp-watchtower.vercel.app",
    siteName: "ACP Watchtower",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACP Watchtower",
    description: "Validate ACP manifests, score readiness, and catch action drift before production.",
  },
  metadataBase: new URL("https://acp-watchtower.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
