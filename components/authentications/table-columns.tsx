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
  Eye,
  Edit,
  Download,
  Send,
  Ban,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { WatchAuthentication } from "@/types/watch-authentication";
import { toast } from "@/components/ui/use-toast";
import { EditAuthenticationModal } from "@/components/authentications/edit-authentication-modal";

// Helper function to check if edit is allowed (within 3 days of creation)
const isEditAllowedFor3Days = (createdDate: string | null): boolean => {
  if (!createdDate) return false;

  const created = new Date(createdDate);
  const now = new Date();
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

  return now.getTime() - created.getTime() <= threeDaysInMs;
};

// Helper function to get remaining edit days
const getRemainingEditDays = (createdDate: string | null): number => {
  if (!createdDate) return 0;

  const created = new Date(createdDate);
  const now = new Date();

  created.setHours(0, 0, 0, 0);
  const currentDate = new Date(now);
  currentDate.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor(
    (currentDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.max(0, 3 - diffInDays);
};

// Helper function to format time ago
const formatTimeAgo = (dateString: string | null): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

// Updated Status Badge Component
const StatusBadge = ({
  authentication,
}: {
  authentication: WatchAuthentication;
}) => {
  const status = authentication.status;
  const documentSent = authentication.document_sent_at;

  // Voided status
  if (status === "voided") {
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="h-3 w-3 mr-1" />
        Voided
      </Badge>
    );
  }

  // Document sent status
  if (documentSent || status === "sent") {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        <Send className="h-3 w-3 mr-1" />
        Document Sent
      </Badge>
    );
  }

  // Submitted status
  if (status === "submitted") {
    return (
      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Submitted
      </Badge>
    );
  }

  // Default to completed status
  return (
    <Badge className="bg-green-100 text-green-800 border-green-200">
      <CheckCircle className="h-3 w-3 mr-1" />
      Completed
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
  const [voidReason, setVoidReason] = useState("");
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const isDocumentSent =
    watchData.status === "sent" || watchData.document_sent_at;
  const isVoided = watchData.status === "voided";

  // Edit is allowed only within 3 days of creation and if not voided
  const canEdit = !isVoided && isEditAllowedFor3Days(watchData.created_at);

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth-products/${watchData.id}/void`,
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

  const handleEditSave = () => {
    // Refresh the page or update the data
    window.location.reload();
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

        {/* Edit Button - Opens Modal */}
        {canEdit ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50 border-blue-200"
            onClick={() => setEditModalOpen(true)}
            title={`Edit authentication (${getRemainingEditDays(
              watchData.created_at
            )} days left)`}
          >
            <Edit className="h-4 w-4 text-blue-600" />
            <span className="sr-only">Edit</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 opacity-50 cursor-not-allowed"
            disabled
            title="Edit period expired (3-day limit)"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit disabled</span>
          </Button>
        )}

        {/* Download PDF Button */}
        {!isVoided && watchData.authenticity_verdict && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-green-50 border-green-200"
            onClick={() => onDownloadPDF(watchData)}
            title="Download authentication certificate PDF"
          >
            <Download className="h-4 w-4 text-green-600" />
            <span className="sr-only">Download PDF</span>
          </Button>
        )}

        {/* Resend Document Button - Only show if document was sent */}
        {isDocumentSent && !isVoided && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50 border-blue-200"
            onClick={() => setResendDialogOpen(true)}
            disabled={resendLoading}
            title="Resend authentication certificate"
          >
            {resendLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4 text-blue-600" />
            )}
            <span className="sr-only">Resend document</span>
          </Button>
        )}

        {/* Void Process Button - Only show if not voided */}
        {!isVoided && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => setVoidDialogOpen(true)}
            disabled={voidLoading}
            title="Void authentication process"
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

      {/* Edit Authentication Modal */}
      <EditAuthenticationModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        watchData={watchData}
        onSave={handleEditSave}
      />

      {/* Resend Document Dialog */}
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
              permanently marked as voided and cannot be edited.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
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
                <p>Current Status: {watchData.status || "Completed"}</p>
              </div>
            </div>

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

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <h5 className="font-medium text-yellow-900 text-sm mb-1">
                Consequences:
              </h5>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• The authentication process will be permanently voided</li>
                <li>• No further actions can be taken on this record</li>
                <li>• Edit access will be permanently revoked</li>
                <li>• The action will be logged in the audit trail</li>
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
  if (!verdict) {
    return (
      <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
        Not Available
      </Badge>
    );
  }

  const isAuthentic =
    verdict.toLowerCase() === "authentic" ||
    verdict.toLowerCase() === "genuine";

  return (
    <Badge
      className={
        isAuthentic
          ? "bg-green-500 hover:bg-green-600 text-white"
          : "bg-red-500 hover:bg-red-600 text-white"
      }
    >
      {verdict}
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
        <div
          className={`font-mono text-sm ${
            isVoided ? "text-gray-400 line-through" : ""
          }`}
        >
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
        <div
          className={`font-medium ${
            isVoided ? "text-gray-400 line-through" : ""
          }`}
        >
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
        <div
          className={`text-sm ${isVoided ? "text-gray-400 line-through" : ""}`}
        >
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
        <div
          className={`text-sm ${isVoided ? "text-gray-400 line-through" : ""}`}
        >
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
        <div
          className={`text-sm ${isVoided ? "text-gray-400 line-through" : ""}`}
        >
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
        <div
          className={`text-sm ${isVoided ? "text-gray-400 line-through" : ""}`}
        >
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
            <XCircle className="h-3 w-3 mr-1" />
            {row.original.authenticity_verdict || "Voided"}
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
      return <StatusBadge authentication={row.original} />;
    },
    filterFn: (row, id, value) => {
      const status = row.original.status;
      const documentSent = row.original.document_sent_at;

      if (value === "sent") {
        return status === "sent" || !!documentSent;
      }
      if (value === "completed") {
        return !status || status === "completed" || (!documentSent && !status);
      }
      return status === value;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const isVoided = row.original.status === "voided";
      const createdAt = row.original.created_at;
      const timeAgo = formatTimeAgo(createdAt);

      const editAllowed = isEditAllowedFor3Days(createdAt);
      const remainingDays = getRemainingEditDays(createdAt);

      return (
        <div className={`text-sm ${isVoided ? "text-gray-400" : ""}`}>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{timeAgo}</span>
          </div>
          {!isVoided && editAllowed && (
            <div className="text-xs text-green-600 mt-1 font-medium">
              ✏️ Can edit ({remainingDays} day{remainingDays !== 1 ? "s" : ""}{" "}
              remaining)
            </div>
          )}
          {!isVoided && !editAllowed && (
            <div className="text-xs text-red-600 mt-1">
              🔒 Edit period expired
            </div>
          )}
          {createdAt && (
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.created_at || 0);
      const dateB = new Date(rowB.original.created_at || 0);
      return dateB.getTime() - dateA.getTime(); // Most recent first
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
