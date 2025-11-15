"use client";
import React from "react";
import DashboardProvider from "./provider";
import { Header } from "./_components/Header";
import { ThemeProvider } from "next-themes";

function MainLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardProvider>
        {/* Full-screen flex layout */}
        <div className="flex flex-col min-h-screen w-screen bg-background overflow-hidden">
          {/* Header stays fixed on top */}
          <Header />
          
          {/* Main content fills remaining space */}
          <main className="flex-grow w-full h-full m-0 p-0">
            {children}
          </main>
        </div>
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default MainLayout;
