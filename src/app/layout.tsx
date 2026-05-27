import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopUtilityBar } from "@/components/layout/TopUtilityBar";
import { MainNavbar } from "@/components/layout/MainNavbar";
import { Footer } from "@/components/layout/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HCI EdTech Platform",
  description: "Gamified Learning for User Interface Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} font-sans antialiased bg-zinc-50 flex flex-col min-h-screen`}
        >
          <TopUtilityBar />
          <MainNavbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
