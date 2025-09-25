// components/authentications/table-columns.tsx
import React, { useState, useRef, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  SmartphoneNfc,
  Shield,
  Package,
  User,
  Phone,
  Mail,
  Building,
  Star,
  Search,
  Link,
  QrCode,
  Camera,
  X,
  Nfc,
} from "lucide-react";
import { WatchAuthentication } from "@/types/watch-authentication";
import { toast } from "@/components/ui/use-toast";
import { EditAuthenticationModal } from "@/components/authentications/edit-authentication-modal";

// NFC Interfaces
interface NfcLink {
  id: number;
  ref_code: string;
  account_id: number | null;
  authenticated_products_id: number | null;
  status: "unused" | "used";
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T = any> {
  success?: boolean;
  valid?: boolean;
  message: string;
  data?: T;
}

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

// NFC Management Component
const NfcManagementModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
}> = ({ open, onOpenChange, productId }) => {
  const [refCode, setRefCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [nfcData, setNfcData] = useState<NfcLink | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const authToken = localStorage?.getItem("accessToken") || "";

  const clearMessage = () => {
    setTimeout(() => setMessage(null), 5000);
  };

  // QR Code scanning functions
  const startQrScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setQrScanning(true);

        // Start scanning for QR codes
        scanIntervalRef.current = setInterval(scanQrCode, 500);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Unable to access camera. Please check permissions.",
      });
      clearMessage();
    }
  };

  const stopQrScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    setQrScanning(false);
  };

  const scanQrCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = detectQrCode(imageData);

    if (code) {
      setRefCode(code.toUpperCase());
      stopQrScanner();
      setMessage({
        type: "success",
        text: `QR Code scanned successfully: ${code}`,
      });
      clearMessage();
    }
  };

  // Simple QR code detection (placeholder - in production use jsQR)
  const detectQrCode = (imageData: ImageData): string | null => {
    // Placeholder for QR detection logic
    return null;
  };

  useEffect(() => {
    return () => {
      stopQrScanner();
    };
  }, []);

  const checkRefCode = async () => {
    if (!refCode.trim()) {
      setMessage({ type: "error", text: "Please enter a reference code" });
      clearMessage();
      return;
    }

    setCheckLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nfc/check-ref-code/${refCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result: ApiResponse<NfcLink> = await response.json();

      if (result.valid && result.data) {
        setNfcData(result.data);
        setMessage({ type: "success", text: result.message });
      } else {
        setNfcData(null);
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to check reference code" });
      setNfcData(null);
    } finally {
      setCheckLoading(false);
      clearMessage();
    }
  };

  const linkNfc = async () => {
    if (!refCode.trim() || !productId) {
      setMessage({
        type: "error",
        text: "Please enter both reference code and product ID",
      });
      clearMessage();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nfc/${refCode}/link/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result: ApiResponse = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        // Refresh the NFC data after successful linking
        await checkRefCode();
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to link NFC" });
    } finally {
      setLoading(false);
      clearMessage();
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "used":
        return "default";
      case "unused":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "used" ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-400" />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Nfc className="h-5 w-5 text-blue-600" />
            NFC Management
          </DialogTitle>
          <DialogDescription>
            Manage NFC links and verify reference codes for Product ID:{" "}
            {productId}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {message && (
            <Alert
              className={`mb-4 ${
                message.type === "error"
                  ? "border-red-200 bg-red-50"
                  : message.type === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <AlertDescription
                className={`${
                  message.type === "error"
                    ? "text-red-800"
                    : message.type === "success"
                    ? "text-green-800"
                    : "text-blue-800"
                }`}
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* QR Scanner Modal */}
          {qrScanning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Scan QR Code
                  </h3>
                  <Button variant="ghost" size="sm" onClick={stopQrScanner}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Position the QR code within the frame to scan
                </p>
              </div>
            </div>
          )}

          <Tabs defaultValue="check" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="check">Check Reference</TabsTrigger>
              <TabsTrigger value="link">Link NFC</TabsTrigger>
            </TabsList>

            <TabsContent value="check" className="space-y-4">
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Check Reference Code
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Verify if a reference code is valid and view its current
                  status
                </p>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="check-ref-code">Reference Code</Label>
                    <Input
                      id="check-ref-code"
                      placeholder="Enter reference code (e.g., ABC123XYZ)"
                      value={refCode}
                      onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={startQrScanner}
                      disabled={qrScanning}
                      title="Scan QR Code"
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button onClick={checkRefCode} disabled={checkLoading}>
                      {checkLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Check Code
                    </Button>
                  </div>
                </div>

                {nfcData && (
                  <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      NFC Link Details
                      {getStatusIcon(nfcData.status)}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">
                          Reference Code
                        </Label>
                        <p className="font-mono font-medium">
                          {nfcData.ref_code}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={getStatusBadgeVariant(nfcData.status)}
                          >
                            {nfcData.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Account ID
                        </Label>
                        <p>{nfcData.account_id || "Not assigned"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Product ID
                        </Label>
                        <p>
                          {nfcData.authenticated_products_id || "Not linked"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Created</Label>
                        <p>
                          {new Date(nfcData.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Updated</Label>
                        <p>
                          {new Date(nfcData.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Link NFC to Product
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Associate an NFC card with this authenticated product
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="link-ref-code">Reference Code</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="link-ref-code"
                        placeholder="Enter reference code"
                        value={refCode}
                        onChange={(e) =>
                          setRefCode(e.target.value.toUpperCase())
                        }
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={startQrScanner}
                        disabled={qrScanning}
                        title="Scan QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="product-id">Authenticated Product ID</Label>
                    <Input
                      id="product-id"
                      value={productId}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This is automatically set to the current product
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button onClick={linkNfc} disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Link NFC to Product
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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
  const [nfcLoading, setNfcLoading] = useState(false);
  const [voidReason, setVoidReason] = useState("");
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [nfcDialogOpen, setNfcDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [nfcData, setNfcData] = useState<any>(null);
  const [nfcManagementOpen, setNfcManagementOpen] = useState(false);

  const isDocumentSent =
    watchData.status === "sent" || watchData.document_sent_at;
  const isVoided = watchData.status === "voided";

  // Edit is allowed only within 3 days of creation and if not voided
  const canEdit = !isVoided && isEditAllowedFor3Days(watchData.created_at);

  const handleNfcView = async () => {
    setNfcLoading(true);
    setNfcData(null);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nfc/public-profile/${
          watchData.reference_number || watchData.id
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.valid && result.data) {
        setNfcData(result.data);
      } else {
        toast({
          title: "NFC Data Not Found",
          description:
            result.message || "No NFC profile found for this product.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("NFC fetch failed:", error);
      toast({
        title: "Error",
        description: "Failed to load NFC data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setNfcLoading(false);
    }
  };

  const getAuthenticityColor = (verdict: string) => {
    switch (verdict?.toLowerCase()) {
      case "genuine":
      case "authentic":
        return "bg-green-100 text-green-800 border-green-300";
      case "genuine_with_aftermarket_parts":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "counterfeit":
      case "fake":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

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

        {/* NFC Button - Opens NFC Management Modal */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-purple-50 border-purple-200"
          onClick={() => setNfcManagementOpen(true)}
          title="Manage NFC"
        >
          <Nfc className="h-4 w-4 text-purple-600" />
          <span className="sr-only">Manage NFC</span>
        </Button>

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

      {/* NFC Management Modal */}
      <NfcManagementModal
        open={nfcManagementOpen}
        onOpenChange={setNfcManagementOpen}
        productId={watchData.id}
      />

      {/* Edit Authentication Modal */}
      <EditAuthenticationModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        watchData={watchData}
        onSave={handleEditSave}
      />

      {/* NFC Profile Modal */}
      <Dialog open={nfcDialogOpen} onOpenChange={setNfcDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SmartphoneNfc className="h-5 w-5 text-purple-600" />
              NFC Public Profile
            </DialogTitle>
            <DialogDescription>
              This is how the product appears when scanned via NFC
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {nfcLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-2" />
                  <p className="text-gray-600">Loading NFC profile...</p>
                </div>
              </div>
            ) : nfcData ? (
              <div className="space-y-6">
                {/* Authentication Status */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-3 text-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="text-lg font-bold text-green-800">
                        Authenticated Product
                      </h3>
                      <p className="text-green-600 text-sm">
                        Verified on{" "}
                        {new Date(nfcData.verified_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div>
                  <h4 className="font-medium mb-3 text-blue-800 border-b border-blue-200 pb-1">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Reference Code
                      </Label>
                      <p className="font-mono font-bold text-lg text-blue-600">
                        {nfcData.ref_code}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Product ID
                      </Label>
                      <p className="font-medium">{nfcData.product.id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Reference Number
                      </Label>
                      <p className="font-medium">
                        {nfcData.product.reference_number}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <h4 className="font-medium mb-3 text-blue-800 border-b border-blue-200 pb-1">
                    Product Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Product Name
                      </Label>
                      <p className="font-medium text-lg">
                        {nfcData.product.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Brand
                      </Label>
                      <p className="font-medium">{nfcData.product.brand}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Model
                      </Label>
                      <p className="font-medium">{nfcData.product.model}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Date of Sale
                      </Label>
                      <p>
                        {new Date(
                          nfcData.product.date_of_sale
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Est. Production Year
                      </Label>
                      <p>{nfcData.product.estimated_production_year}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Status
                      </Label>
                      <Badge
                        variant={
                          nfcData.status === "used" ? "default" : "secondary"
                        }
                        className="mt-1"
                      >
                        {nfcData.status?.toUpperCase() || "N/A"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Authenticity Information */}
                <div>
                  <h4 className="font-medium mb-3 text-blue-800 border-b border-blue-200 pb-1">
                    Authenticity Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Authenticity Verdict
                      </Label>
                      <div className="mt-1">
                        <Badge
                          className={`${getAuthenticityColor(
                            nfcData.product.authenticity_verdict
                          )}`}
                        >
                          {nfcData.product.authenticity_verdict
                            ?.replace(/_/g, " ")
                            .toUpperCase() || "N/A"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Verified At
                      </Label>
                      <p>{new Date(nfcData.verified_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {nfcData.product.final_summary && (
                    <div className="mt-4">
                      <Label className="text-muted-foreground font-medium">
                        Authentication Summary
                      </Label>
                      <div className="mt-2 p-3 bg-white rounded-md border border-gray-200">
                        <p className="text-sm leading-relaxed">
                          {nfcData.product.final_summary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="font-medium mb-3 text-blue-800 border-b border-blue-200 pb-1">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Contact Method
                      </Label>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {nfcData.product.contact_method}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Email
                      </Label>
                      <p className="break-all">{nfcData.product.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Phone
                      </Label>
                      <p>{nfcData.product.phone}</p>
                    </div>
                    {nfcData.product.company_name && (
                      <div>
                        <Label className="text-muted-foreground font-medium">
                          Company Name
                        </Label>
                        <p>{nfcData.product.company_name}</p>
                      </div>
                    )}
                    {nfcData.product.company_address && (
                      <div className="md:col-span-2">
                        <Label className="text-muted-foreground font-medium">
                          Company Address
                        </Label>
                        <p>{nfcData.product.company_address}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Information */}
                <div>
                  <h4 className="font-medium mb-3 text-blue-800 border-b border-blue-200 pb-1">
                    System Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Account ID
                      </Label>
                      <p>{nfcData.product.account_id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        User ID
                      </Label>
                      <p>{nfcData.product.user_id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Created At
                      </Label>
                      <p>
                        {new Date(nfcData.product.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Last Updated
                      </Label>
                      <p>
                        {new Date(nfcData.product.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Authentication Badge */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center gap-2 text-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">
                        Authenticated Product
                      </p>
                      <p className="text-sm text-green-600">
                        This product has been verified and authenticated
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <SmartphoneNfc className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No NFC profile data available</p>
                <p className="text-gray-400 text-sm">
                  This product may not have been set up for NFC scanning yet.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNfcDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
