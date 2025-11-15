import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AuraAI",
  description: "AI-powered recruiter and interview coach",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background h-full w-full m-0 p-0 overflow-x-hidden`}
      >
        {/* Firebase Auth Provider wraps entire app */}
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* Toast notifications */}
        <Toaster />
      </body>
    </html>
  );
}
