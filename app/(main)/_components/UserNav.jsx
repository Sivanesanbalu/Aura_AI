"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { SideBarOptions } from "@/services/Constants"; // Make sure this file exists
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";

export function UserNav() {
  const path = usePathname();
  const { user, logout } = useAuth();

  // Separate options into groups
  const mainLinks = SideBarOptions.filter(
    (option) => option.name !== "Settings" && option.name !== "Logout"
  );
  const settingsLink = SideBarOptions.find(
    (option) => option.name === "Settings"
  );

  // Get user initials for the avatar fallback
  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('');
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  if (!user) {
    return null; 
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          {/* Profile: Replaced <UserButton> with <Avatar> */}
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* Navigation links */}
        {mainLinks.map((option, index) => (
          <Link href={option.path} key={index} passHref>
            <DropdownMenuItem
              className={`cursor-pointer ${
                path === option.path ? "bg-slate-100 dark:bg-slate-800" : ""
              }`}
            >
              <option.icon className="mr-2 h-4 w-4" />
              <span>{option.name}</span>
            </DropdownMenuItem>
          </Link>
        ))}

        {settingsLink && <DropdownMenuSeparator />}

        {settingsLink && (
          <Link href={settingsLink.path} passHref>
            <DropdownMenuItem
              className={`cursor-pointer ${
                path === settingsLink.path
                  ? "bg-slate-100 dark:bg-slate-800"
                  : ""
              }`}
            >
              <settingsLink.icon className="mr-2 h-4 w-4" />
              <span>{settingsLink.name}</span>
            </DropdownMenuItem>
          </Link>
        )}

        {/* Logout button */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => await logout()} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}