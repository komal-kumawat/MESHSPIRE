import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, Khula, Catamaran } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const khula = Khula({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-khula",
});

const catamaran = Catamaran({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-catamaran",
});

export const metadata: Metadata = {
  title: "Meshspire | Learn & Teach Anytime, Anywhere",
  description:
    "Learn from peers, teach your skills, and grow your knowledge with Meshspire – a community-driven learning experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${khula.variable} ${catamaran.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
