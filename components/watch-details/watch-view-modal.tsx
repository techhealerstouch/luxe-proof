// components/watch-details/watch-view-modal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Eye, Loader2 } from "lucide-react";
import { WatchAuthentication } from "@/types/watch-authentication";
import { certificateApi } from "@/lib/api-certificate";
import { toast } from "sonner";
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
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!watchData) return;

    setLoading(true);
    try {
      await certificateApi.downloadCertificate(watchData.id);
      toast.success("Certificate downloaded successfully");
    } catch (error) {
      console.error("Failed to download certificate:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to download certificate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPDF = async () => {
    if (!watchData) return;

    setLoading(true);
    try {
      await certificateApi.previewCertificate(watchData.id);
    } catch (error) {
      console.error("Failed to preview certificate:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to preview certificate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!watchData) return null;

  const isVoided = watchData.status === "voided";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Watch Authentication Details</span>
            {!isVoided && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviewPDF}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  Preview
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download
                </Button>
              </div>
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
