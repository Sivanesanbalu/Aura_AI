"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { SideBarOptions } from "@/services/Constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";

export function UserNav() {
  const path = usePathname();

  // Separate options into groups
  const mainLinks = SideBarOptions.filter(
    (option) => option.name !== "Settings" && option.name !== "Logout"
  );
  const settingsLink = SideBarOptions.find(
    (option) => option.name === "Settings"
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          {/* Profile */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "h-9 w-9" } }}
          />
          {/* Downward icon */}
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
        <SignOutButton>
          <DropdownMenuItem className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
