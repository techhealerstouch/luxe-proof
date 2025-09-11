// components/watch-details/watch-view-modal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";
import { WatchAuthentication } from "@/types/watch-authentication";
import { generateAuthenticationPDF } from "@/utils/pdf-generator";
import {
  BasicInfoSection,
  SerialInfoSection,
  CaseAnalysisSection,
  DialAnalysisSection,
  BraceletAnalysisSection,
  MovementAnalysisSection,
  PerformanceTestSection,
  DocumentationSection,
} from "./detail-sections";

interface WatchViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchData: WatchAuthentication | null;
}

export const WatchViewModal: React.FC<WatchViewModalProps> = ({
  isOpen,
  onClose,
  watchData,
}) => {
  const handleDownloadPDF = () => {
    if (watchData) {
      generateAuthenticationPDF(watchData);
    }
  };

  if (!watchData) return null;

  // Check if the watch status is voided
  const isVoided = watchData.status === "voided";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Watch Authentication Details</span>
            {/* Only show Download Certificate button if not voided */}
            {!isVoided && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="ml-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            <BasicInfoSection watchData={watchData} />
            <SerialInfoSection watchData={watchData} />
            <CaseAnalysisSection watchData={watchData} />
            <DialAnalysisSection watchData={watchData} />
            <BraceletAnalysisSection watchData={watchData} />
            <MovementAnalysisSection watchData={watchData} />
            <PerformanceTestSection watchData={watchData} />
            <DocumentationSection watchData={watchData} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
