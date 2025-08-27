// components/authentications/table-columns.tsx
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Download,
  Send,
  Ban,
  MoreHorizontal,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { WatchAuthentication } from "@/types/watch-authentication";
import { toast } from "@/components/ui/use-toast";

// Status Badge Component
const StatusBadge = ({
  authentication,
}: {
  authentication: WatchAuthentication;
}) => {
  const status = authentication.status;
  const documentSent = authentication.document_sent_at;

  if (status === "voided") {
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="h-3 w-3 mr-1" />
        Voided
      </Badge>
    );
  }

  if (status === "completed" || status === "done" || status === "submitted") {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        {status === "done"
          ? "Done"
          : status === "submitted"
          ? "Submitted"
          : "Completed"}
      </Badge>
    );
  }

  if (documentSent || status === "sent") {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        <Send className="h-3 w-3 mr-1" />
        Document Sent
      </Badge>
    );
  }

  return (
    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
      {status}
    </Badge>
  );
};

// Actions Component
interface TableActionsProps {
  watchData: WatchAuthentication;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDownloadPDF: (data: WatchAuthentication) => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  watchData,
  onView,
  onEdit,
  onDownloadPDF,
}) => {
  const [resendLoading, setResendLoading] = useState(false);
  const [voidLoading, setVoidLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [voidReason, setVoidReason] = useState("");
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const isDocumentSent =
    watchData.status === "sent" || watchData.document_sent_at;
  const isVoided = watchData.status === "voided";
  const isCompleted = watchData.status === "completed";
  const isDone =
    watchData.status === "done" ||
    watchData.status === "submitted" ||
    watchData.status === "completed";

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/authentications/${watchData.id}/resend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend document");
      }

      toast({
        title: "Document Resent",
        description: `Authentication certificate for ${watchData.brand} ${
          watchData.model || ""
        } has been resent successfully.`,
        variant: "default",
      });

      setResendDialogOpen(false);
      // Refresh the page data
      window.location.reload();
    } catch (error) {
      console.error("Resend failed:", error);
      toast({
        title: "Error",
        description: "Failed to resend document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmitDocument = async () => {
    setSubmitLoading(true);

    console.log(watchData.id);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth-products/${watchData.id}/submit`,
        {
          method: "PUT", // Changed from POST to PUT
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit document");
      }

      toast({
        title: "Document Submitted",
        description: `Authentication certificate for ${watchData.brand} ${
          watchData.model || ""
        } has been submitted successfully.`,
        variant: "default",
      });

      setSubmitDialogOpen(false);
      // Refresh the page data
      window.location.reload();
    } catch (error) {
      console.error("Submit failed:", error);
      toast({
        title: "Error",
        description: "Failed to submit document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Updated Frontend - Fix the URL path to match your backend
  const handleVoid = async () => {
    if (!voidReason.trim() || voidReason.trim().length < 10) {
      toast({
        title: "Invalid Reason",
        description:
          "Please provide a detailed reason (at least 10 characters) for voiding the process.",
        variant: "destructive",
      });
      return;
    }

    setVoidLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth-products/${watchData.id}/void`, // Fixed URL to match backend
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: voidReason.trim() }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to void process");
      }

      toast({
        title: "Process Voided",
        description: `Authentication process has been voided successfully.`,
        variant: "default",
      });

      setVoidReason("");
      setVoidDialogOpen(false);
      // Refresh the page data
      window.location.reload();
    } catch (error) {
      console.error("Void failed:", error);
      toast({
        title: "Error",
        description: "Failed to void process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVoidLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {/* View Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onView(watchData.id)}
          title="View details"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>

        {/* Edit Button - disabled if done/submitted/completed or voided */}
        {!isDone && !isVoided && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50"
            onClick={() => onEdit(watchData.id)}
            title="Edit authentication"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        )}

        {/* Download PDF Button */}
        {!isVoided && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-green-50"
            onClick={() => onDownloadPDF(watchData)}
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download PDF</span>
          </Button>
        )}

        {/* Submit Document Button - only if not submitted and not voided */}
        {!isDocumentSent && !isDone && !isVoided && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-purple-50 border-purple-200"
            onClick={() => setSubmitDialogOpen(true)}
            disabled={submitLoading}
            title="Submit document"
          >
            {submitLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4 text-purple-600" />
            )}
            <span className="sr-only">Submit document</span>
          </Button>
        )}

        {/* Resend Document Button - only if document was sent and not voided */}
        {isDocumentSent && !isVoided && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50 border-blue-200"
            onClick={() => setResendDialogOpen(true)}
            disabled={resendLoading}
            title="Resend document"
          >
            {resendLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4 text-blue-600" />
            )}
            <span className="sr-only">Resend document</span>
          </Button>
        )}

        {/* Void Process Button - only if not completed and not voided */}
        {!isCompleted && !isVoided && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => setVoidDialogOpen(true)}
            disabled={voidLoading}
            title="Void process"
          >
            {voidLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Ban className="h-4 w-4" />
            )}
            <span className="sr-only">Void process</span>
          </Button>
        )}
      </div>

      {/* Submit Document Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-purple-500" />
              Submit Authentication Document
            </DialogTitle>
            <DialogDescription>
              This will submit the authentication document for processing and
              mark it as completed.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Watch Details Card */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Watch Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="ml-2 font-medium">{watchData.brand}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <span className="ml-2 font-medium">
                    {watchData.model || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Serial:</span>
                  <span className="ml-2 font-mono text-xs">
                    {watchData.serial_number ||
                      watchData.serial_and_model_number_cross_reference
                        ?.serial_number ||
                      "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Verdict:</span>
                  <span className="ml-2 font-medium">
                    {watchData.authenticity_verdict || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Submission Warning */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
              <h5 className="font-medium text-blue-900 text-sm mb-1">
                Important:
              </h5>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• The document will be submitted for final processing</li>
                <li>• Once submitted, the record cannot be edited</li>
                <li>• The status will be updated to reflect submission</li>
                <li>• A confirmation will be sent to relevant parties</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSubmitDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitDocument}
              disabled={submitLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {submitLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Document
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-500" />
              Resend Authentication Certificate
            </DialogTitle>
            <DialogDescription>
              This will resend the authentication certificate to the registered
              email address.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Watch Details Card */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Watch Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="ml-2 font-medium">{watchData.brand}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <span className="ml-2 font-medium">
                    {watchData.model || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Serial:</span>
                  <span className="ml-2 font-mono text-xs">
                    {watchData.serial_number ||
                      watchData.serial_and_model_number_cross_reference
                        ?.serial_number ||
                      "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Verdict:</span>
                  <span className="ml-2 font-medium">
                    {watchData.authenticity_verdict || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Send History */}
            {watchData.document_sent_at && (
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Originally sent:
                  </span>
                  <span>
                    {new Date(watchData.document_sent_at).toLocaleDateString()}
                  </span>
                </div>
                {(watchData.resend_count || 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Times resent:</span>
                    <span>{watchData.resend_count}</span>
                  </div>
                )}
                {watchData.last_resent_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last resent:</span>
                    <span>
                      {new Date(watchData.last_resent_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Warning for multiple resends */}
            {(watchData.resend_count || 0) >= 2 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">
                    Multiple Resends Detected
                  </p>
                  <p className="text-yellow-700">
                    This certificate has been resent {watchData.resend_count}{" "}
                    times. Consider contacting the recipient directly.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResendDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResend}
              disabled={resendLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {resendLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Resend Certificate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Void Dialog */}
      <AlertDialog open={voidDialogOpen} onOpenChange={setVoidDialogOpen}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Void Authentication Process
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The authentication process will be
              permanently marked as voided.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            {/* Watch Info */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">
                Authentication to be voided:
              </h4>
              <div className="text-sm text-red-800">
                <p>
                  <strong>
                    {watchData.brand} {watchData.model || ""}
                  </strong>
                </p>
                <p>
                  Serial:{" "}
                  {watchData.serial_number ||
                    watchData.serial_and_model_number_cross_reference
                      ?.serial_number ||
                    "N/A"}
                </p>
                <p>Current Status: {watchData.status || "Pending"}</p>
              </div>
            </div>

            {/* Reason Input */}
            <div className="space-y-2">
              <Label htmlFor="void-reason" className="text-sm font-medium">
                Reason for voiding <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="void-reason"
                placeholder="Please provide a detailed reason for voiding this authentication process..."
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters required. This will be recorded in the
                audit log.
              </p>
            </div>

            {/* Consequences Warning */}
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <h5 className="font-medium text-yellow-900 text-sm mb-1">
                Consequences:
              </h5>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• The authentication process will be permanently voided</li>
                <li>• No further actions can be taken on this record</li>
                <li>• The action will be logged in the audit trail</li>
                <li>• A notification may be sent to relevant parties</li>
              </ul>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setVoidReason("");
                setVoidDialogOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleVoid}
              disabled={
                !voidReason.trim() ||
                voidReason.trim().length < 10 ||
                voidLoading
              }
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {voidLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Voiding...
                </>
              ) : (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Void Process
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Authenticity Badge
interface AuthenticityBadgeProps {
  verdict?: string;
}

const AuthenticityBadge: React.FC<AuthenticityBadgeProps> = ({ verdict }) => {
  const isAuthentic =
    verdict?.toLowerCase() === "authentic" ||
    verdict?.toLowerCase() === "genuine";

  return (
    <Badge
      className={
        isAuthentic
          ? "bg-green-500 hover:bg-green-600 text-white"
          : verdict
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-gray-500 hover:bg-gray-600 text-white"
      }
    >
      {verdict || "Pending"}
    </Badge>
  );
};

interface ColumnHandlers {
  handleView: (id: string) => void;
  handleEdit: (id: string) => void;
  handleDownloadPDF: (data: WatchAuthentication) => void;
}
export const createTableColumns = ({
  handleView,
  handleEdit,
  handleDownloadPDF,
}: ColumnHandlers): ColumnDef<WatchAuthentication>[] => [
  {
    accessorKey: "serial_number",
    header: "Serial Number",
    cell: ({ row }) => {
      const serialNumber =
        row.original.serial_number ||
        row.original.serial_and_model_number_cross_reference?.serial_number;
      const isVoided = row.original.status === "voided";

      return (
        <div className={`font-mono text-sm ${isVoided ? "text-gray-400" : ""}`}>
          {serialNumber || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const isVoided = row.original.status === "voided";
      return (
        <div className={`font-medium ${isVoided ? "text-gray-400" : ""}`}>
          {row.original.name}
        </div>
      );
    },
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => {
      const isVoided = row.original.status === "voided";
      return (
        <div className={`text-sm ${isVoided ? "text-gray-400" : ""}`}>
          {row.original.brand}
        </div>
      );
    },
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => {
      const isVoided = row.original.status === "voided";
      return (
        <div className={`text-sm ${isVoided ? "text-gray-400" : ""}`}>
          {row.original.model || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "estimated_production_year",
    header: "Production Year",
    cell: ({ row }) => {
      const isVoided = row.original.status === "voided";
      return (
        <div className={`text-sm ${isVoided ? "text-gray-400" : ""}`}>
          {row.original.estimated_production_year || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "date_of_sale",
    header: "Date of Sale",
    cell: ({ row }) => {
      const saleDate = row.original.date_of_sale;
      const isVoided = row.original.status === "voided";
      return (
        <div className={`text-sm ${isVoided ? "text-gray-400" : ""}`}>
          {saleDate || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "authenticity_verdict",
    header: "Authenticity",
    cell: ({ row }) => {
      const isVoided = row.original.status === "voided";

      if (isVoided) {
        return (
          <Badge className="bg-gray-100 text-gray-500 border-gray-200">
            {row.original.authenticity_verdict || "Pending"}
          </Badge>
        );
      }

      return <AuthenticityBadge verdict={row.original.authenticity_verdict} />;
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      console.log("Status cell row:", row);
      return <StatusBadge authentication={row.original} />;
    },
    filterFn: (row, id, value) => {
      console.log("FilterFn row:", row.original);
      console.log("FilterFn id:", id);
      console.log("FilterFn value:", value);
      const status = row.original.status;
      const documentSent = row.original.document_sent_at;

      if (value === "sent") {
        return status === "sent" || !!documentSent;
      }
      return status === value;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <TableActions
        watchData={row.original}
        onView={handleView}
        onEdit={handleEdit}
        onDownloadPDF={handleDownloadPDF}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
