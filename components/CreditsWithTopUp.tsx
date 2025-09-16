// components/CreditsWithTopUp.tsx
import React from "react";
import CreditsDisplay from "./CreditsDisplay";
import TopUp from "./TopUp";

interface CreditsWithTopUpProps {
  showTopUp?: boolean;
  showRefresh?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "destructive" | "outline";
  topUpButtonText?: string;
  topUpButtonVariant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
  packages?: Array<{
    id: string;
    name: string;
    credits: number;
    price: number;
    popular?: boolean;
  }>;
}

const CreditsWithTopUp: React.FC<CreditsWithTopUpProps> = ({
  showTopUp = true,
  showRefresh = false,
  size = "md",
  variant,
  topUpButtonText = "Top Up",
  topUpButtonVariant = "outline",
  className = "",
  packages,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CreditsDisplay size={size} variant={variant} showRefresh={showRefresh} />

      {showTopUp && (
        <TopUp
          buttonText={topUpButtonText}
          buttonVariant={topUpButtonVariant}
          buttonSize={size}
          packages={packages}
        />
      )}
    </div>
  );
};

export default CreditsWithTopUp;
