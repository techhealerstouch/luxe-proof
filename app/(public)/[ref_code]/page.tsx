"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  Calendar,
  Shield,
  Info,
} from "lucide-react";
import Logo from "@/components/logo";

// Types
interface AuthenticatedProduct {
  id: number;
  account_id?: number;
  user_id?: number;
  name: string;
  brand?: string;
  email?: string;
  phone?: string;
  contact_method?: string;
  company_name?: string | null;
  abn?: string | null;
  company_address?: string | null;
  reference_number?: string | null;
  model?: string;
  date_of_sale?: string;
  authenticity_verdict?: string;
  estimated_production_year?: string;
  final_summary?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  price?: number;
  warranty?: string;
  manufacturer_date?: string;
  description?: string;
  category?: string;
  serial_number?: string;
}

interface NfcData {
  ref_code: string;
  product: AuthenticatedProduct;
  verified_at: string;
  status: string;
}

interface ApiResponse {
  valid: boolean;
  message?: string;
  data?: NfcData;
}

export default function VerifyNfcPage() {
  const params = useParams();
  const ref_code = params.ref_code as string;

  const [loading, setLoading] = useState(true);
  const [nfcData, setNfcData] = useState<NfcData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!;

  // ✅ Fetch real API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<ApiResponse>(
          `${baseUrl}/api/nfc/public/${ref_code}`
        );

        if (response.data.valid && response.data.data) {
          setNfcData(response.data.data);
        } else {
          setError(response.data.message || "Product not found");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load product information"
        );
      } finally {
        setLoading(false);
      }
    };

    if (ref_code) fetchData();
  }, [ref_code]);

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <Shield className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-base font-medium text-slate-700">
            Verifying Product
          </p>
          <p className="text-sm text-slate-500 font-mono">
            {ref_code.toUpperCase()}
          </p>
        </div>
      </div>
    );
  }

  if (error || !nfcData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="bg-red-100 rounded-full p-3">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Verification Failed
            </h2>
            <p className="text-slate-600">{error}</p>
            <div className="w-full border-t border-slate-200 my-4"></div>
            <div className="bg-slate-50 rounded-lg p-3 w-full">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Reference Code
              </p>
              <p className="font-mono text-sm font-semibold text-slate-900">
                {ref_code.toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { product, verified_at } = nfcData;

  // Exclude sensitive/unwanted fields
  const excludedFields = [
    "id",
    "account_id",
    "user_id",
    "email",
    "phone",
    "created_at",
    "updated_at",
    "image_url",
    "contact_method",
  ];

  const productDetails = Object.entries(product).filter(
    ([key, value]) =>
      !excludedFields.includes(key) &&
      value !== null &&
      value !== undefined &&
      value !== ""
  );

  // Groups
  const productInfo = productDetails.filter(([key]) =>
    [
      "name",
      "brand",
      "model",
      "category",
      "serial_number",
      "description",
    ].includes(key)
  );

  const authenticationInfo = productDetails.filter(([key]) =>
    [
      "authenticity_verdict",
      "estimated_production_year",
      "final_summary",
      "status",
    ].includes(key)
  );

  const purchaseInfo = productDetails.filter(([key]) =>
    ["price", "date_of_sale", "manufacturer_date", "warranty"].includes(key)
  );

  const companyInfo = productDetails.filter(([key]) =>
    ["company_name", "abn", "company_address", "reference_number"].includes(key)
  );

  const formatFieldName = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const renderDetailCard = (label: string, value: any, icon?: any) => {
    let displayValue = value;

    if (typeof value === "string" && value.includes("T")) {
      displayValue = formatDate(value);
    } else if (
      typeof value === "number" &&
      label.toLowerCase().includes("price")
    ) {
      displayValue = formatCurrency(value);
    } else {
      displayValue = String(value);
    }

    return (
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-blue-300 transition-colors">
        <div className="flex items-start gap-3">
          {icon && <div className="mt-0.5 text-slate-400">{icon}</div>}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="text-sm font-semibold text-slate-900 break-words">
              {displayValue}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="container mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 w-full">
            <Logo width={350} height={80} className="mx-auto" />
          </div>
        </div>

        {/* Verification Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 flex items-start gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 text-white">
              <h2 className="text-xl font-bold mb-1">
                Authentication Successful
              </h2>
              <p className="text-green-50 text-sm mb-3">
                This product has been verified through our secure authentication
                system.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <span className="text-green-50">Reference:</span>
                  <span className="font-mono font-bold ml-2">
                    {ref_code.toUpperCase()}
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <span className="text-green-50">Verified:</span>
                  <span className="font-semibold ml-2">
                    {formatDate(verified_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Overview */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-start gap-3 mb-2">
              <Package className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {product.name}
                </h3>
                {product.brand && (
                  <p className="text-slate-600 text-lg">by {product.brand}</p>
                )}
              </div>
              <div className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-full flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="h-5 w-5" />
                <span>Verified Authentic</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {product.image_url && (
              <div className="mb-6">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/800x400?text=No+Image";
                  }}
                />
              </div>
            )}

            {/* Product Information */}
            {productInfo.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  Product Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productInfo.map(([fieldKey, value]) => (
                    <div key={`${product.id}-${fieldKey}`}>
                      {renderDetailCard(formatFieldName(fieldKey), value)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Authentication Details */}
            {authenticationInfo.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Authentication Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {authenticationInfo.map(([fieldKey, value]) => (
                    <div key={`${product.id}-${fieldKey}`}>
                      {renderDetailCard(formatFieldName(fieldKey), value)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase Information */}
            {purchaseInfo.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Purchase & Warranty
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {purchaseInfo.map(([fieldKey, value]) => (
                    <div key={`${product.id}-${fieldKey}`}>
                      {renderDetailCard(formatFieldName(fieldKey), value)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Information */}
            {companyInfo.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-slate-600" />
                  Company Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyInfo.map(([fieldKey, value]) => (
                    <div key={`${product.id}-${fieldKey}`}>
                      {renderDetailCard(formatFieldName(fieldKey), value)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-sm text-slate-500">
            Verification completed on {formatDate(verified_at)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Powered by Lux Proof</p>
        </div>
      </div>
    </div>
  );
}
