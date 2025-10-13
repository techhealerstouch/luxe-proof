import type React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import type { PlanType } from "@/types/billing/billing";
import { type AuthenticationItem } from "@/lib/api-dashboard";

export const getShipmentStatusBadgeOrder = (status: string) => {
  const config: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-orange-100 text-orange-800 border-orange-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
  };
  return (
    <Badge className={config[status] || "bg-gray-100 text-gray-800"}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </Badge>
  );
};
export const getStatusBadgeOrder = (status: string) => {
  const config: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PAID: "bg-green-100 text-green-800 border-green-200",
    PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
    SHIPPED: "bg-orange-100 text-orange-800 border-orange-200",
    DELIVERED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <Badge className={config[status] || "bg-gray-100 text-gray-800"}>
      {status}
    </Badge>
  );
};
export const getStatusBadge = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "paid":
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          {status === "active" ? "Active" : "Paid"}
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "failed":
    case "cancelled":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {status === "cancelled" ? "Cancelled" : "Failed"}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getPlanBadge = (planType: PlanType) => {
  switch (planType) {
    case "free":
      return <Badge variant="secondary">Free</Badge>;
    case "pro":
      return <Badge variant="default">Pro</Badge>;
    case "enterprise":
      return <Badge variant="outline">Enterprise</Badge>;
    default:
      return <Badge variant="outline">{planType}</Badge>;
  }
};

export const getAuthenticityColor = (verdict: string) => {
  switch (verdict?.toLowerCase()) {
    case "Genuine":
    case "Authentic":
      return "bg-green-100 text-green-800 border-green-300";
    case "Genuine (Aftermarket)":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "counterfeit":
    case "fake":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getStatusBadgeTableAuthentication = (auth: AuthenticationItem) => {
  const status = auth.status;
  const documentSent = auth.document_sent_at;

  if (status === "voided") {
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">Voided</Badge>
    );
  }

  if (documentSent || status === "sent") {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        Document Sent
      </Badge>
    );
  }

  if (status === "submitted") {
    return (
      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
        Submitted
      </Badge>
    );
  }

  return (
    <Badge className="bg-green-100 text-green-800 border-green-200">
      Completed
    </Badge>
  );
};

export const getAuthenticityBadge = (verdict?: string) => {
  if (!verdict) {
    return (
      <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
        Not Available
      </Badge>
    );
  }

  const isAuthentic =
    verdict.toLowerCase().includes("authentic") ||
    verdict.toLowerCase().includes("genuine");

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
