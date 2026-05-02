import { Toaster } from "sonner";
import type { Metadata } from "next";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const geistSans = localFont({
  src: [
    { path: "../../public/fonts/geist-latin.woff2", weight: "100 900" },
    { path: "../../public/fonts/geist-latin-ext.woff2", weight: "100 900" },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    { path: "../../public/fonts/geist-mono-latin.woff2", weight: "100 900" },
    {
      path: "../../public/fonts/geist-mono-latin-ext.woff2",
      weight: "100 900",
    },
  ],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "eSim IC Management Portal",
  description: "FOSSEE IC Management System",
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
      <body className="min-h-screen flex flex-col">
        <NextTopLoader showSpinner={false} color="#2563eb" />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
