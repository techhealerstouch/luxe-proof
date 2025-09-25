import type React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface BillingPageHeaderProps {
  isDownloading: boolean;
  onDownloadCSV: () => void;
  hasData: boolean;
}

export const BillingPageHeader: React.FC<BillingPageHeaderProps> = ({
  isDownloading,
  onDownloadCSV,
  hasData,
}) => (
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
      <p className="text-muted-foreground">
        Manage your subscription and billing information
      </p>
    </div>

    <Button
      onClick={onDownloadCSV}
      disabled={isDownloading || !hasData}
      className="rounded-xl"
    >
      {isDownloading ? (
        <>
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4 mr-2" />
          Export Filtered Payments (CSV)
        </>
      )}
    </Button>
  </div>
);
