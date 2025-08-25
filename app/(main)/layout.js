"use client";
import React from "react";
import DashboardProvider from "./provider";
import { Header } from "./_components/Header";
import Image from 'next/image';
import { ThemeProvider } from "next-themes";
function MainLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardProvider>
        
        <div className="min-h-screen w-full bg-background">
          <Header />
          
          
          <main className="px-6 md:px-85">
            {children}
          </main>
        </div>
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default MainLayout;