"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  QrCode,
  X,
  SmartphoneNfc,
} from "lucide-react";

interface AuthenticatedProduct {
  id: number;
  name: string;
  brand: string;
  model: string;
  verified_at: string;
  account_id: number;
  authenticity_verdict: string;
  company_address: string | null;
  company_name: string | null;
  contact_method: string;
  created_at: string;
  date_of_sale: string;
  email: string;
  estimated_production_year: string;
  final_summary: string;
  phone: string;
  status: string | null;
  updated_at: string;
  user_id: number;
}

interface PublicProfile {
  ref_code: string;
  product: AuthenticatedProduct;
  verified_at: string;
  status: string;
}

interface ApiResponse<T = any> {
  success?: boolean;
  valid?: boolean;
  message: string;
  data?: T;
}

export default function NfcPublicProfile() {
  const [refCode, setRefCode] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(
    null
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get auth token from localStorage
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
      // Automatically load profile after scanning
      viewPublicProfile(code);
    }
  };

  // Simple QR code detection (placeholder - in production use jsQR)
  const detectQrCode = (imageData: ImageData): string | null => {
    // This is a simplified placeholder - in production you'd use jsQR library
    // For demo purposes, this just returns null
    // In real implementation: return jsQR(imageData.data, imageData.width, imageData.height)?.data || null;
    return null;
  };

  useEffect(() => {
    return () => {
      stopQrScanner();
    };
  }, []);

  const viewPublicProfile = async (code?: string) => {
    const codeToUse = code || refCode;

    if (!codeToUse.trim()) {
      setMessage({ type: "error", text: "Please enter a reference code" });
      clearMessage();
      return;
    }

    setProfileLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nfc/public-profile/${codeToUse}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result: ApiResponse<PublicProfile> = await response.json();

      if (result.valid && result.data) {
        setPublicProfile(result.data);
        setMessage({
          type: "success",
          text: "Public profile loaded successfully",
        });
      } else {
        setPublicProfile(null);
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load public profile" });
      setPublicProfile(null);
    } finally {
      setProfileLoading(false);
      clearMessage();
    }
  };

  const getAuthenticityColor = (verdict: string) => {
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

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <SmartphoneNfc className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">NFC Product Profile</h1>
        </div>
        <p className="text-muted-foreground">
          View authenticated product information via NFC reference code
        </p>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${
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

      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            View Product Profile
          </CardTitle>
          <CardDescription>
            Enter a reference code or scan QR code to view product
            authentication details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="profile-ref-code">Reference Code</Label>
              <Input
                id="profile-ref-code"
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
              <Button
                onClick={() => viewPublicProfile()}
                disabled={profileLoading}
              >
                {profileLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                View Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Profile Display */}
      {publicProfile && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-3 text-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="text-lg font-bold text-green-800">
                      Authenticated Product
                    </h3>
                    <p className="text-green-600 text-sm">
                      Verified on{" "}
                      {new Date(publicProfile.verified_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-medium mb-3 text-blue-800 border-b border-blue-200 pb-1">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Reference Code
                    </Label>
                    <p className="font-mono font-bold text-lg text-blue-600">
                      {publicProfile.ref_code}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Product ID
                    </Label>
                    <p className="font-medium">{publicProfile.product.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Reference Number
                    </Label>
                    <p className="font-medium">
                      {publicProfile.product.reference_number}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Product Details */}
              <div>
                <h4 className="font-medium mb-3 text-blue-800 border-b border-blue-200 pb-1">
                  Product Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Product Name
                    </Label>
                    <p className="font-medium text-lg">
                      {publicProfile.product.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Brand
                    </Label>
                    <p className="font-medium">{publicProfile.product.brand}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Model
                    </Label>
                    <p className="font-medium">{publicProfile.product.model}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Date of Sale
                    </Label>
                    <p>
                      {new Date(
                        publicProfile.product.date_of_sale
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Est. Production Year
                    </Label>
                    <p>{publicProfile.product.estimated_production_year}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Status
                    </Label>
                    <Badge
                      variant={
                        publicProfile.status === "used"
                          ? "default"
                          : "secondary"
                      }
                      className="mt-1"
                    >
                      {publicProfile.status?.toUpperCase() || "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

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
                        className={getAuthenticityColor(
                          publicProfile.product.authenticity_verdict
                        )}
                      >
                        {publicProfile.product.authenticity_verdict
                          ?.replace(/_/g, " ")
                          .toUpperCase() || "N/A"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Verified At
                    </Label>
                    <p>
                      {new Date(publicProfile.verified_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {publicProfile.product.final_summary && (
                  <div className="mt-4">
                    <Label className="text-muted-foreground font-medium">
                      Authentication Summary
                    </Label>
                    <div className="mt-2 p-3 bg-white rounded-md border border-gray-200">
                      <p className="text-sm leading-relaxed">
                        {publicProfile.product.final_summary}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h4 className="font-medium mb-3 text-blue-800 border-b border-blue-200 pb-1">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Contact Method
                    </Label>
                    <Badge variant="outline" className="mt-1 capitalize">
                      {publicProfile.product.contact_method}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Email
                    </Label>
                    <p className="break-all">{publicProfile.product.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Phone
                    </Label>
                    <p>{publicProfile.product.phone}</p>
                  </div>
                  {publicProfile.product.company_name && (
                    <div>
                      <Label className="text-muted-foreground font-medium">
                        Company Name
                      </Label>
                      <p>{publicProfile.product.company_name}</p>
                    </div>
                  )}
                  {publicProfile.product.company_address && (
                    <div className="md:col-span-2">
                      <Label className="text-muted-foreground font-medium">
                        Company Address
                      </Label>
                      <p>{publicProfile.product.company_address}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* System Information */}
              <div>
                <h4 className="font-medium mb-3 text-blue-800 border-b border-blue-200 pb-1">
                  System Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Account ID
                    </Label>
                    <p>{publicProfile.product.account_id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      User ID
                    </Label>
                    <p>{publicProfile.product.user_id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Created At
                    </Label>
                    <p>
                      {new Date(
                        publicProfile.product.created_at
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground font-medium">
                      Last Updated
                    </Label>
                    <p>
                      {new Date(
                        publicProfile.product.updated_at
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Authentication Badge */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
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
          </CardContent>
        </Card>
      )}

      {/* No Profile State */}
      {!publicProfile && !profileLoading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <SmartphoneNfc className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Product Profile
              </h3>
              <p className="text-gray-500 mb-4">
                Enter a reference code or scan a QR code to view product
                authentication details.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
