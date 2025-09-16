// components/CreditsDisplay.tsx
import React from "react";
import { Coins, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/use-credits";

interface CreditsDisplayProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "destructive" | "outline";
  showRefresh?: boolean;
  className?: string;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({
  size = "md",
  variant,
  showRefresh = false,
  className = "",
}) => {
  const { credits, loading, error, refetch } = useCredits();

  const getBadgeVariant = () => {
    if (variant) return variant;
    if (error) return "destructive";
    if (credits < 1000) return "destructive";
    if (credits < 5000) return "secondary";
    return "default";
  };

  const getSizeClasses = () => {
    const classes = {
      sm: { badge: "text-xs px-2 py-1", icon: "h-3 w-3", button: "px-2 py-1" },
      md: {
        badge: "text-sm px-2.5 py-1.5",
        icon: "h-4 w-4",
        button: "px-3 py-1.5",
      },
      lg: {
        badge: "text-base px-3 py-2",
        icon: "h-5 w-5",
        button: "px-4 py-2",
      },
    };
    return classes[size];
  };

  const sizeClasses = getSizeClasses();

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge
          variant="outline"
          className={`flex items-center gap-1 ${sizeClasses.badge}`}
        >
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading...
        </Badge>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge
          variant="destructive"
          className={`flex items-center gap-1 ${sizeClasses.badge}`}
        >
          <AlertCircle className={sizeClasses.icon} />
          Error
        </Badge>
        {showRefresh && (
          <Button
            variant="outline"
            size="sm"
            className={sizeClasses.button}
            onClick={refetch}
            title="Retry loading credits"
          >
            <RefreshCw className={sizeClasses.icon} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge
        variant={getBadgeVariant()}
        className={`flex items-center gap-1 ${sizeClasses.badge}`}
      >
        <Coins className={sizeClasses.icon} />
        {credits.toLocaleString()} credits
      </Badge>
      {showRefresh && (
        <Button
          variant="ghost"
          size="sm"
          className={sizeClasses.button}
          onClick={refetch}
          title="Refresh credits"
        >
          <RefreshCw className={sizeClasses.icon} />
        </Button>
      )}
    </div>
  );
};

export default CreditsDisplay;
