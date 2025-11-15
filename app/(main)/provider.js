"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext"; // ✅ Use Firebase context

function DashboardProvider({ children }) {
  const { user, loading } = useAuth();

  // Optional: loading screen while Firebase checks auth state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-300">
        Loading your dashboard...
      </div>
    );
  }

  // If not signed in
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-300">
        Please sign in to access your dashboard.
      </div>
    );
  }

  // If signed in
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-white">
        <main className="p-0">{children}</main>
      </div>
    </SidebarProvider>
  );
}

export default DashboardProvider;
