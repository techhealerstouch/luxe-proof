"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard-layout";
import { Plus, User, CheckCircle, Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import IconCompany from "@/components/icon";
export default function Intro() {
  const [serialNumber, setSerialNumber] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Check if serial is already validated on component mount
  useEffect(() => {
    const validatedSerial = localStorage.getItem("validated_serial");
    const timestamp = localStorage.getItem("serial_validation_timestamp");

    if (validatedSerial && timestamp) {
      // Check if validation is still recent (e.g., within 30 minutes)
      const validationTime = parseInt(timestamp);
      const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

      if (Date.now() - validationTime < thirtyMinutes) {
        setSerialNumber(validatedSerial);
        setIsValidated(true);
      } else {
        // Validation expired, clear localStorage
        localStorage.removeItem("validated_serial");
        localStorage.removeItem("serial_validation_timestamp");
      }
    }
  }, []);

  const handleSerialNumberChange = (e: any) => {
    setSerialNumber(e.target.value);
    // Reset validation state when user types
    if (isValidated || validationError) {
      setIsValidated(false);
      setValidationError("");
      // Clear localStorage when user starts typing new serial
      localStorage.removeItem("validated_serial");
      localStorage.removeItem("serial_validation_timestamp");
    }
  };

  const handleCheckSerialNumber = async () => {
    setIsChecking(true);
    setValidationError("");

    try {
      // Get the auth token from wherever you store it (localStorage, cookies, etc.)
      const token = localStorage.getItem("accessToken"); // Adjust based on your auth implementation

      if (!token) {
        setValidationError("Authentication required. Please log in.");
        setIsChecking(false);
        return;
      }

      // Configure axios request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth-products/check-serial`,
        {
          serial_number: serialNumber.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      const data = response.data;

      // Check if serial number is available (not already in database)
      if (data.available) {
        setIsValidated(true);
        // Store validated serial in localStorage
        localStorage.setItem("validated_serial", serialNumber.trim());
        localStorage.setItem(
          "serial_validation_timestamp",
          Date.now().toString()
        );
      } else {
        setValidationError(
          data.message || "Serial number already exists in the database"
        );
      }
    } catch (error) {
      console.error("Serial validation error:", error);

      if (axios.isAxiosError(error)) {
        // Handle different types of axios errors
        if (error.response) {
          // Server responded with error status
          const errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            "Server error occurred";
          setValidationError(errorMessage);
        } else if (error.request) {
          // Request was made but no response received
          setValidationError(
            "Network error. Please check your connection and try again."
          );
        } else {
          // Something else happened
          setValidationError("An unexpected error occurred. Please try again.");
        }
      } else {
        setValidationError(
          "Failed to validate serial number. Please try again."
        );
      }
    } finally {
      setIsChecking(false);
    }
  };

  const isSerialNumberEntered = serialNumber.trim().length > 0;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-4xl">
          <div className="text-center space-y-4">
            <IconCompany width={100} height={20} className="mx-auto" />
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              The Expert's 8-Step Watch
              <br /> Authentication Protocol
            </h1>

            <p className="text-muted-foreground text-base max-w-1xl mx-auto leading-relaxed">
              This protocol provides a systematic framework for the
              comprehensive authentication and condition assessment of luxury
              timepieces. Each step builds upon the last, creating a complete
              picture of the watch's history, authenticity, and current state.
            </p>

            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-full text-xs text-blue-700 dark:text-blue-300">
              <User className="w-3 h-3" />
              <span>Includes comprehensive user information collection</span>
            </div>
          </div>

          {/* Serial Number Input */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber" className="text-sm font-medium">
                Watch Serial Number
              </Label>
              <Input
                id="serialNumber"
                type="text"
                placeholder="Enter serial number"
                value={serialNumber}
                onChange={handleSerialNumberChange}
                className="w-full"
                disabled={isChecking}
              />
            </div>

            {/* Check Serial Number Button */}
            {!isValidated && (
              <Button
                onClick={handleCheckSerialNumber}
                disabled={!isSerialNumberEntered || isChecking}
                variant="outline"
                className="w-full"
              >
                {isChecking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Checking Serial Number...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Check Serial Number
                  </>
                )}
              </Button>
            )}

            {/* Validation Error */}
            {validationError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {validationError}
                </p>
              </div>
            )}

            {/* Success Message */}
            {isValidated && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Serial number validated successfully! You can now proceed with
                  authentication.
                </p>
              </div>
            )}
          </div>

          {/* 8-Step Authentication Button - Only show when validated */}
          {isValidated && (
            <div className="flex justify-center">
              <Button
                asChild
                size="sm"
                className="px-6 py-2 text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <Link
                  href="/authentications/create"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  Start 8-Step Authentication
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
