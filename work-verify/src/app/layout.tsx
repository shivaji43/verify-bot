import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import AppWalletProvider from "@//components/WalletProvider";
import { SessionProvider } from "next-auth/react";
import { siteConfig } from "@/config/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: "%s | Verify Bot",
  },
  description: siteConfig.description,
  icons: [
    {
      url: "/verify-bot-profile.svg",
      href: "/verify-bot-profile.svg",
    },
  ],
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_VERIFY_APP_URL}`),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://verify-bot.gib.work",
    siteName: "Verify Bot",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_VERIFY_APP_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: "Verify Bot Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
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
        <Toaster />
        <SessionProvider>
          <AppWalletProvider>{children}</AppWalletProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
