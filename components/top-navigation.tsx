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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  UserRound,
  CircleDollarSign,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Credits from "@/components/credits"; // Adjust path as needed
import IconCompany from "./icon";
import CreditsWithTopUp from "./CreditsWithTopUp";
// import Logo from "@/components/logo";

interface TopNavigationProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  className?: string;
}

export default function TopNavigation({
  sidebarOpen,
  toggleSidebar,
  className,
}: TopNavigationProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // State to manage user credits - starts at 0
  const [userCredits, setUserCredits] = useState(user?.credits || 0);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleCreditPurchase = (packageId: string, packageData: any) => {
    console.log(
      `Purchased ${packageData.name}: ${packageData.credits} credits`
    );
    // Update the credits in the TopNavigation state
    setUserCredits((prev) => prev + packageData.credits);
  };

  const handlePaymentSuccess = (packageData: any) => {
    console.log("Payment successful in TopNavigation:", packageData);
    // This is an additional callback if you need to do other things on success
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error in TopNavigation:", error);
    // Handle payment errors (show toast, etc.)
  };

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between gap-4 border-b bg-background px-4 shrink-0",
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
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
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Credits Component with dynamic state */}
        <CreditsWithTopUp size="sm" showRefresh topUpButtonText="Add Credits" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-3 py-2 h-auto"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm">
              <div className="font-medium">{user?.name}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
            <DropdownMenuSeparator />
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
