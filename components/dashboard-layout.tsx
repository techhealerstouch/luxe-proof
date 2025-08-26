"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Shield,
  Settings,
  LogOut,
  ChevronUp,
  List,
  Plus,
  BarChart3,
  Menu,
  X,
  User,
  CircleDollarSign,
  UserRound,
  Watch,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  // {
  //   title: "User List",
  //   url: "/users",
  //   icon: User,
  // },
  {
    title: "Create Authentication",
    url: "/authentications/intro",
    icon: Watch,
  },
  {
    title: "Authentication List",
    url: "/authentications",
    icon: List,
  },
];

function AppSidebar({
  isOpen,
  className,
}: {
  isOpen: boolean;
  className?: string;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
        <Shield className="h-6 w-6" />
        {isOpen && <span className="font-semibold">Luxe Proof</span>}
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="space-y-1">
            <div className="px-2 py-2">
              {isOpen && (
                <h2 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wide">
                  Navigation
                </h2>
              )}
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  pathname === item.url
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {isOpen && <span className="truncate">{item.title}</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-sidebar-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2 h-auto",
                !isOpen && "justify-center px-2"
              )}
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {isOpen && (
                <>
                  <span className="truncate text-sm">{user?.name}</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserRound className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/billing">
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar
        isOpen={sidebarOpen}
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-16"
        )}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">
              Watch Authentication System
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
