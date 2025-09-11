"use client";

import React, { useState, useEffect } from "react";
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
import Credits from "@/components/credits";

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

  // State management for credits with localStorage
  const [userCredits, setUserCredits] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side hydration and load from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const savedCredits = localStorage.getItem("userCredits");
      const initialCredits = savedCredits
        ? parseInt(savedCredits, 10)
        : user?.credits || 0;
      setUserCredits(initialCredits);
    } catch (error) {
      console.error("Error loading credits from localStorage:", error);
      setUserCredits(user?.credits || 0);
    }
  }, [user?.credits]);

  // Save credits to localStorage whenever it changes
  useEffect(() => {
    if (isClient && userCredits >= 0) {
      try {
        localStorage.setItem("userCredits", userCredits.toString());
      } catch (error) {
        console.error("Error saving credits to localStorage:", error);
      }
    }
  }, [userCredits, isClient]);

  const handleLogout = () => {
    // Clear credits from localStorage on logout
    if (isClient) {
      try {
        localStorage.removeItem("userCredits");
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
    logout();
    router.push("/login");
  };

  const handleCreditPurchase = (packageId: string, packageData: any) => {
    console.log(
      `Purchased ${packageData.name}: ${packageData.credits} credits`
    );
    setUserCredits((prev) => prev + packageData.credits);
  };

  const handlePaymentSuccess = (packageData: any) => {
    console.log("Payment successful:", packageData);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
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

        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg sm:hidden">Luxe Proofs</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Credits Component */}
        <Credits
          credits={userCredits}
          onPurchase={handleCreditPurchase}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          size="md"
          showTopUpButton={true}
        />

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
