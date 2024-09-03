"use client";

import {
  Bell,
  Bold,
  Italic,
  KeyboardIcon,
  KeyIcon,
  LogOut,
  Underline,
  User,
} from "lucide-react";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Protect,
  SignOutButton,
  useOrganization,
  useOrganizationList,
  useSessionList,
  useUser,
} from "@clerk/nextjs";
import ModeToggle from "../theme-toggle";
import { DashboardBreadcrumb } from "./breadcrumb";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { CommandDialogs } from "./command";
import { useRouter } from "next/navigation";
import AddProjectForm from "./add-project-form";
import { useState } from "react";
import CommandShorcutsDialog from "./command-shortcuts-dialog";

export function DashboardHeader() {
  const { user } = useUser();
  const { organization } = useOrganization();

  const { userMemberships, isLoaded } = useOrganizationList();
  if (!user) return null;

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <DashboardBreadcrumb />
      </div>
      <div className="flex items-center space-x-2">
        <CommandDialogs />
        <ModeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Avatar className="cursor-pointer">
          <DropdownMenuDemo>
            <Avatar title={user.fullName!}>
              <AvatarImage
                src={user.imageUrl}
                alt="User Avatar"
                title={user.fullName!}
              />
              <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuDemo>
        </Avatar>
      </div>
    </div>
  );
}

export function DropdownMenuDemo({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isCommanadOpen, setisCommanadOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAddProjectFormOpen, setIsAddtProjectFormOpen] = useState(false);
  if (!isLoaded) return;

  const handleCommand = () => {
    setisCommanadOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings/billing")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCommand}>
              <KeyboardIcon className="mr-2 h-4 w-4" />
              <span>command shrtcuts</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Team</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsAddtProjectFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <span>New Project</span>
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href="https://github.com/zaluty/keyzilla"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              <span>GitHub</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/support")}>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutButton redirectUrl="/">
              <>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </>
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isAddProjectFormOpen && (
        <AddProjectForm
          isOpen={isAddProjectFormOpen}
          onClose={() => setIsAddtProjectFormOpen(false)}
        />
      )}
      <CommandShorcutsDialog
        isOpen={isCommanadOpen}
        onOpenChange={setisCommanadOpen}
      />
    </>
  );
}
