
"use client";
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggleButton } from './ThemeToggleButton';
import { UserNav } from "./UserNav";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"; 
import { Button } from '@/components/ui/button'; 

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm dark:border-gray-800 dark:bg-slate-950">
      
      {/* Left Side: Brand Name */}
      <div className="flex items-center">
         <Link href="/dashboard" className="text-xl font-bold">
            AURA AI
         </Link>
      </div>

      
      <div className="flex items-center gap-4">
        <SignedIn>
          
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 block h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>
          <ThemeToggleButton />
          <UserNav />
        </SignedIn>

        <SignedOut>
          
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
       
      </div>
      

    </header>
  );
}