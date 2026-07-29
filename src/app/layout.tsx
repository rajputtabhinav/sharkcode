import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { ClerkProvider } from "@clerk/nextjs"; // Removed - will add another auth service later
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SharkCode - Turn Your Network into Net Worth",
  description: "Join SharkCode and earn rewards through referrals. Get ₹50 signup bonus, earn ₹10 per referral and ₹80 when they upgrade to Pro.",
  keywords: ["referral", "earn money", "rewards", "SharkCode", "pro membership"],
  authors: [{ name: "SharkCode" }],
  openGraph: {
    title: "SharkCode - Turn Your Network into Net Worth",
    description: "Join SharkCode and earn rewards through referrals. Get ₹50 signup bonus!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
