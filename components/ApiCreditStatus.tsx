// components/ApiCreditStatus.tsx
import React from "react";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";

const ApiCreditStatus: React.FC = () => {
  const { credits, loading, error } = useCredits();

  const getCreditStatus = (credits: number) => {
    if (credits === 0) {
      return {
        status: "empty",
        message: "No credits remaining",
        description: "You need credits to perform authentications",
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200",
        icon: AlertTriangle,
      };
    } else if (credits < 1000) {
      return {
        status: "low",
        message: "Insufficient credits for authentication",
        description: "You need 1000 credits to perform an authentication",
        color: "text-orange-600",
        bgColor: "bg-orange-50 border-orange-200",
        icon: AlertTriangle,
      };
    } else if (credits < 5000) {
      return {
        status: "moderate",
        message: "Moderate credit balance",
        description: `${Math.floor(credits / 1000)} authentications available`,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 border-yellow-200",
        icon: Clock,
      };
    } else {
      return {
        status: "good",
        message: "Good credit balance",
        description: `${Math.floor(credits / 1000)} authentications available`,
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200",
        icon: CheckCircle,
      };
    }
  };

  if (loading) {
    return (
      <div className="border rounded-lg p-3 bg-gray-50 border-gray-200">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          <p className="text-sm font-medium text-gray-600">Loading status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-lg p-3 bg-red-50 border-red-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <p className="text-sm font-medium text-red-600">
            Unable to load credit status
          </p>
        </div>
        <p className="text-xs text-red-600/80 mt-1">{error}</p>
      </div>
    );
  }

  const creditStatus = getCreditStatus(credits);
  const IconComponent = creditStatus.icon;

  return (
    <div className={`border rounded-lg p-3 ${creditStatus.bgColor}`}>
      <div className="flex items-start gap-2">
        <IconComponent className={`h-4 w-4 ${creditStatus.color} mt-0.5`} />
        <div>
          <p className={`text-sm font-medium ${creditStatus.color}`}>
            {creditStatus.message}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {creditStatus.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiCreditStatus;
