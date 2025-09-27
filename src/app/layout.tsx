import "./globals.css";
import type { Metadata } from "next";
import { Nunito, Great_Vibes } from "next/font/google";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlockBundlR",
  description: "A modern Web3 application for managing batch transactions efficiently on the same chain with glassmorphism design",
  keywords: ["Web3", "Ethereum", "Batch Transactions", "Wallet", "DeFi", "BlockBundlR"],
  authors: [{ name: "BlockBundlR Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress external analytics errors
              window.addEventListener('error', function(e) {
                if (e.message && (
                  e.message.includes('coinbase.com') ||
                  e.message.includes('analytics') ||
                  e.message.includes('metrics') ||
                  e.message.includes('ERR_ABORTED')
                )) {
                  e.preventDefault();
                  return false;
                }
              });
              
              // Suppress unhandled promise rejections from external scripts
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && (
                  e.reason.message && (
                    e.reason.message.includes('coinbase.com') ||
                    e.reason.message.includes('analytics') ||
                    e.reason.message.includes('metrics') ||
                    e.reason.message.includes('ERR_ABORTED')
                  )
                )) {
                  e.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${nunito.variable} ${greatVibes.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
            <Navbar />
            <main className="flex-1 pt-6">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
