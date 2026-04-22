import type { Metadata } from "next";
import { Geist, Geist_Mono, EB_Garamond } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MusicDB - A Retro Cinematic Experience",
  description: "The world's most elegant platform for music connoisseurs.",
  icons: {
    icon: '/icon.png',
  },
};

import TopBar from "@/components/TopBar";
import SongDetailOverlay from "@/components/SongDetailOverlay";
import ArtistDetailOverlay from "@/components/ArtistDetailOverlay";
import InteractiveBackground from "@/components/InteractiveBackground";
import CursorFollower from "@/components/CursorFollower";
import CinematicOverlay from "@/components/CinematicOverlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ebGaramond.variable} antialiased h-screen overflow-hidden relative font-sans flex flex-col bg-[#050505]`}
      >
        <CinematicOverlay />
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-transparent relative z-10 w-full">
          {children}
        </main>
        <SongDetailOverlay />
        <ArtistDetailOverlay />
      </body>
    </html>
  );
}
