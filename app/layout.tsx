import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "EV Charging | Parikrama College of Engineering",
  description: "Advanced EV Charging Management System for campus sustainability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} font-sans overflow-x-hidden w-full`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden w-full max-w-[100vw]">
        {children}
      </body>
    </html>
  );
}
