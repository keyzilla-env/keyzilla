"use client"

import { Bell, Bold, Italic, LogOut, Underline, User } from "lucide-react";
import { SignOutButton, useOrganization, useSessionList, useUser } from "@clerk/nextjs";
import ModeToggle from "../theme-toggle";
import { DashboardBreadcrumb } from "./breadcrumb";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function DashboardHeader() {
    const { user } = useUser();
    const { organization } = useOrganization();
    const { sessions } = useSessionList();
    if (!user) return null;
    return (
        <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
                <DashboardBreadcrumb />
            </div>
            <div className="flex items-center space-x-2">
                <ModeToggle />
                <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                </Button>
                <Avatar className="cursor-pointer">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar title={user.fullName!}>
                                <AvatarImage src={user.imageUrl} alt="User Avatar" title={user.fullName!} />
                                <AvatarFallback>
                                    {user.firstName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{user.firstName || organization?.name || (user.emailAddresses[0].emailAddress.split('@')[0]) || "Your Account"}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings">Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild >
                                <SignOutButton >
                                    <div className="flex items-center bg-destructive text-destructive-foreground">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log out
                                    </div>
                                </SignOutButton>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Avatar>
            </div>
        </div>
    )
}