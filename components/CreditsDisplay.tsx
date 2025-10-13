// components/CreditsDisplay.tsx
import React from "react";
import { Coins, AlertCircle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/use-credits";

interface CreditsDisplayProps {
  showRefresh?: boolean;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({
  showRefresh = false,
}) => {
  const { credits, loading, error, refetch } = useCredits();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Card className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs font-semibold text-muted-foreground">
            Loading...
          </span>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <Card className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 px-3 py-2 shadow-sm">
          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
          <span className="text-xs font-semibold text-destructive">Error</span>
        </Card>
        {showRefresh && (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-destructive/10"
            onClick={refetch}
            title="Retry loading credits"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Card className="flex items-center gap-2 rounded-lg border bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 border-amber-200/60 dark:border-amber-800/60 px-3 py-2 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-yellow-500 dark:from-amber-500 dark:to-yellow-600 p-1.5 shadow-sm">
          <Coins className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold tabular-nums text-foreground">
            {credits.toLocaleString()}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Credits
          </span>
        </div>
      </Card>
      {showRefresh && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg transition-all hover:bg-accent hover:rotate-180"
          onClick={refetch}
          title="Refresh credits"
        >
          <RefreshCw className="h-3.5 w-3.5 transition-transform" />
        </Button>
      )}
    </div>
  );
};

export default CreditsDisplay;
