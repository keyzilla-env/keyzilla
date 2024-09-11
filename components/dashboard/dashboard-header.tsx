"use client";

import {
  Bell,
  Bold,
  Italic,
  KeyboardIcon,
  KeyIcon,
  LogOut,
  MessageCircle,
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
  Settings,
  Users,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import ModeToggle from "../theme-toggle";
import { DashboardBreadcrumb } from "./breadcrumb";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { CommandDialogs } from "./command";
import { useRouter } from "next/navigation";
import AddProjectForm from "./add-project-form";
import { useState } from "react";
import CommandShorcutsDialog from "./command-shortcuts-dialog";
import { useClerk } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import Feedback from "../feedback";
import { useTheme } from "next-themes";
import { notifications } from "@/notifications.json";

// Calculate unread notifications
const unreadNotificationsCount = notifications.length; // Adjust this logic based on your actual unread criteria

export function DashboardHeader() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signOut } = useClerk();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  if (!user) return null;
  if (!isUserLoaded) return <DashboardHeaderSkeleton />;
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <DashboardBreadcrumb />
      </div>
      <div className="flex items-center space-x-2">
        <CommandDialogs />
        <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotificationsCount + 2}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="absolute top-0 right-0 mt-2 w-64 bg-popover text-popover-foreground shadow-lg rounded-lg p-4">
            <div className="text-lg font-semibold mb-2">Notifications</div>
            <div className="max-h-60 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-2 border-b last:border-b-0 border-border"
                >
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-center">
              <Link
                href="/notifications"
                className="text-primary-foreground hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </PopoverContent>
        </Popover>
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
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAddProjectFormOpen, setIsAddProjectFormOpen] = useState(false);
  const { signOut } = useClerk();

  if (!isLoaded) return null;

  const handleCommand = () => {
    setIsCommandOpen(true);
  };

  const handleSignOut = () => {
    router.push("/");
    signOut();
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
              <span>Command Shortcuts</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <ModeToggle />
              <span className="ml-2">Theme</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsFeedbackOpen(true)}>
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>Feedback</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Team</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsAddProjectFormOpen(true)}>
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
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isAddProjectFormOpen && (
        <AddProjectForm
          isOpen={isAddProjectFormOpen}
          onClose={() => setIsAddProjectFormOpen(false)}
        />
      )}
      <CommandShorcutsDialog
        isOpen={isCommandOpen}
        onOpenChange={setIsCommandOpen}
      />
      <Feedback
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}

function DashboardHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}
type NotificationProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

function Notification({ isOpen, setIsOpen }: NotificationProps) {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverContent>
        <div>Notifications</div>
      </PopoverContent>
    </Popover>
  );
}
