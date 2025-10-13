"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Shield,
  Settings,
  LogOut,
  ChevronUp,
  List,
  BarChart3,
  UserRound,
  CircleDollarSign,
  ShoppingBag,
  Watch,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import TopNavigation from "@/components/top-navigation";
import Logo from "./logo";
import IconCompany from "./icon";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
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

function SidebarContent({
  isOpen,
  onLinkClick,
}: {
  isOpen: boolean;
  onLinkClick?: () => void;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
    onLinkClick?.();
  };

  const handleLinkClick = () => {
    onLinkClick?.();
  };

  return (
    <div className="bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-sidebar-border">
        {isOpen ? (
          <span className="font-semibold">
            <Link href="/">
              <Logo width={300} height={20} className="mx-auto" />
            </Link>
          </span>
        ) : (
          <div className="mx-auto">
            <Link href="/">
              <IconCompany width={100} height={20} className="mx-auto" />
            </Link>
          </div>
        )}
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
            {menuItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "text-sidebar-accent-foreground bg-sidebar-accent"
                      : "text-sidebar-foreground",
                    !isOpen && "justify-center"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-md transition-colors",
                      isActive ? "bg-black text-white p-1.5" : "p-0",
                      isOpen ? "h-7 w-7" : "h-8 w-8"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "shrink-0",
                        isActive ? "h-4 w-4" : isOpen ? "h-4 w-4" : "h-5 w-5"
                      )}
                    />
                  </div>
                  {isOpen && <span className="truncate">{item.title}</span>}
                </Link>
              );
            })}
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
              <Link href="/profile" onClick={handleLinkClick}>
                <UserRound className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" onClick={handleLinkClick}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/billing" onClick={handleLinkClick}>
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/order-tracking" onClick={handleLinkClick}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState !== null) {
      setSidebarOpen(savedState === "true");
    }
    setIsInitialized(true);
  }, []);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSheetOpen(!mobileSheetOpen);
    } else {
      const newState = !sidebarOpen;
      setSidebarOpen(newState);
      localStorage.setItem("sidebarOpen", String(newState));
    }
  };

  const handleMobileLinkClick = () => {
    setMobileSheetOpen(false);
  };

  // Desktop: Don't pass onLinkClick so sidebar stays in its state
  // Mobile: Pass onLinkClick to close the sheet

  // Prevent flash of incorrect sidebar state
  if (!isInitialized) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            sidebarOpen ? "w-64" : "w-16"
          )}
        >
          <SidebarContent isOpen={sidebarOpen} />
        </div>
      )}

      {/* Mobile Sidebar Sheet */}
      {isMobile && (
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent isOpen={true} onLinkClick={handleMobileLinkClick} />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavigation
          sidebarOpen={isMobile ? mobileSheetOpen : sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
