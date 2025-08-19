
"use client";

import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useUser } from '@clerk/nextjs';


function DashboardProvider({ children }) {
  const { user, isSignedIn } = useUser();

  
  return (
    <SidebarProvider>
      <div >
        
        <div >
          
          <main >
           
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardProvider;