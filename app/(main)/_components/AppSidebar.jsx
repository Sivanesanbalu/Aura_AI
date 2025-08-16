"use client"
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/services/Constants";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
    const path = usePathname();

    return (
        <Sidebar className="border-r bg-gray-50/50">
            <SidebarHeader className="p-4 border-b">
                <div className="flex items-center justify-center h-full w-full">
                    <Image 
                        src={"/logo.png"}
                        alt="logo"
                        width={100}
                        height={100}
                        className="rounded-lg content-center object-cover"
                    />
                    <span className="font-semibold text-lg"></span>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-4">
                <div className="mb-6">
                    <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Interview
                    </Button>
                </div>

                <SidebarGroup>
                    <SidebarMenu>
                        {SideBarOptions.map((option, index) => (
                            <SidebarMenuItem key={index} className="mb-2">
                                <Link href={option.path} passHref>
                                    <SidebarMenuButton
                                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 ${
                                            path === option.path && 'bg-blue-100 text-primary'
                                        }`}
                                    >
                                        <option.icon className={`h-5 w-5 ${path === option.path ? 'text-primary' : 'text-gray-500'}`} />
                                        <span className={`font-medium ${path === option.path ? 'text-primary' : ''}`}>{option.name}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t">
                {/* Footer content can go here, e.g., user profile, settings link */}
            </SidebarFooter>
        </Sidebar>
    );
}