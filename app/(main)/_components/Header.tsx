                                               "use client";
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggleButton } from './ThemeToggleButton';
import { UserNav } from "./UserNav";
import { Button } from '@/components/ui/button'; 

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-800 bg-slate-950 px-10 shadow-sm">
      
      {/* Left Side: Brand Name */}
      <div className="flex items-center">
         {/* Added text-white to make the brand name visible */}
         <Link href="/dashboard" className="text-xl font-bold text-white">
            AURA AI
         </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 block h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>
            <ThemeToggleButton />
            <UserNav />
          </>
        ) : (
          <Button onClick={() => router.push('/sign-in')}>
            Sign In
          </Button>
        )}
      </div>
      
    </header>
  );
}

export default Header;