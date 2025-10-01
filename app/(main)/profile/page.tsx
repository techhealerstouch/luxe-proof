"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { z } from "zod";

// ============================================================================
// Constants
// ============================================================================

// GMT-based timezone options
const timezoneOptions = [
  { value: "UTC", label: "GMT+0 (UTC)" },
  { value: "Pacific/Midway", label: "GMT-11 (Midway Island)" },
  { value: "Pacific/Honolulu", label: "GMT-10 (Hawaii)" },
  { value: "America/Anchorage", label: "GMT-9 (Alaska)" },
  { value: "America/Los_Angeles", label: "GMT-8 (Pacific Time)" },
  { value: "America/Denver", label: "GMT-7 (Mountain Time)" },
  { value: "America/Chicago", label: "GMT-6 (Central Time)" },
  { value: "America/New_York", label: "GMT-5 (Eastern Time)" },
  { value: "America/Caracas", label: "GMT-4 (Venezuela)" },
  { value: "America/Sao_Paulo", label: "GMT-3 (Brazil)" },
  { value: "Atlantic/South_Georgia", label: "GMT-2 (South Georgia)" },
  { value: "Atlantic/Azores", label: "GMT-1 (Azores)" },
  { value: "Europe/London", label: "GMT+0 (London)" },
  { value: "Europe/Paris", label: "GMT+1 (Central European Time)" },
  { value: "Europe/Athens", label: "GMT+2 (Eastern European Time)" },
  { value: "Europe/Moscow", label: "GMT+3 (Moscow)" },
  { value: "Asia/Dubai", label: "GMT+4 (Dubai)" },
  { value: "Asia/Karachi", label: "GMT+5 (Pakistan)" },
  { value: "Asia/Kolkata", label: "GMT+5:30 (India)" },
  { value: "Asia/Dhaka", label: "GMT+6 (Bangladesh)" },
  { value: "Asia/Bangkok", label: "GMT+7 (Thailand)" },
  { value: "Asia/Shanghai", label: "GMT+8 (China/Philippines)" },
  { value: "Asia/Tokyo", label: "GMT+9 (Japan)" },
  { value: "Australia/Sydney", label: "GMT+10 (Australia East)" },
  { value: "Pacific/Noumea", label: "GMT+11 (New Caledonia)" },
  { value: "Pacific/Auckland", label: "GMT+12 (New Zealand)" },
];

// ============================================================================
// Schemas
// ============================================================================

const profileSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  timezone: z.string().min(1, "Timezone is required"),
  businessName: z.string().min(1, "Account name is required"),
  businessSlug: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

// ============================================================================
// Types
// ============================================================================

type MessageType = {
  type: "success" | "error";
  text: string;
} | null;

type FormData = {
  name: string;
  phone_number: string;
  timezone: string;
  businessName: string;
  businessSlug: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// ============================================================================
// Sub-components
// ============================================================================

const MessageAlert: React.FC<{ message: MessageType }> = ({ message }) => {
  if (!message) return null;

  return (
    <Alert
      className={`mb-4 ${
        message.type === "error" ? "border-red-500" : "border-green-500"
      }`}
    >
      <AlertDescription className="flex items-center gap-2">
        {message.type === "success" ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
        {message.text}
      </AlertDescription>
    </Alert>
  );
};

const PasswordInput: React.FC<{
  id: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  label: string;
}> = ({ id, value, onChange, show, onToggle, label }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        className="rounded-xl pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export default function ProfilePage() {
  const { user, updateUser, changePassword } = useAuth();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone_number: "",
    timezone: "",
    businessName: "",
    businessSlug: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [messages, setMessages] = useState<{
    profile: MessageType;
    password: MessageType;
  }>({
    profile: null,
    password: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Add this line
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      name: user?.name || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      timezone: user?.timezone || "",
      businessName: user?.account?.name || "",
      businessSlug: user?.account?.slug || "",
    }));

    // Mark as initialized after setting form data
    setIsInitialized(true);

    console.log("User timezone:", user?.timezone);
  }, [user, router]);

  // Debug useEffect to see when formData changes
  useEffect(() => {
    console.log("formData.timezone updated to:", formData.timezone);
  }, [formData.timezone]);

  // Memoized values
  const passwordRequirements = useMemo(
    () => [
      {
        text: "Minimum 8 characters",
        met: formData.newPassword.length >= 8,
      },
      {
        text: "Passwords must match",
        met:
          formData.newPassword &&
          formData.confirmPassword &&
          formData.newPassword === formData.confirmPassword,
      },
    ],
    [formData.newPassword, formData.confirmPassword]
  );

  // Form handlers
  const updateFormField = useCallback(
    (field: keyof FormData, value: string) => {
      console.log(`Updating ${field} to:`, value); // Debug log
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const togglePasswordVisibility = useCallback(
    (field: keyof typeof passwordVisibility) => {
      setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
    },
    []
  );

  const setMessage = useCallback(
    (tab: keyof typeof messages, message: MessageType) => {
      setMessages((prev) => ({ ...prev, [tab]: message }));
    },
    []
  );

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("profile", null);

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      setMessage("profile", {
        type: "error",
        text: result.error.errors[0].message,
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateUser({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        timezone: formData.timezone,
        businessName: formData.businessName,
        businessSlug: formData.businessSlug,
      });
      setMessage("profile", {
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error: any) {
      setMessage("profile", {
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("password", null);

    const result = passwordSchema.safeParse({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      setMessage("password", {
        type: "error",
        text: result.error.errors[0].message,
      });
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      setMessage("password", {
        type: "success",
        text: "Password updated successfully!",
      });
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setPasswordVisibility({ current: false, new: false, confirm: false });
    } catch (error: any) {
      setMessage("password", {
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to update password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            manage your profile and account security
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal and business information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MessageAlert message={messages.profile} />

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        className="rounded-xl"
                        value={formData.name}
                        onChange={(e) =>
                          updateFormField("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        className="rounded-xl"
                        disabled
                        value={formData.email}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone_number">
                        Phone Number (Optional)
                      </Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        className="rounded-xl"
                        value={formData.phone_number}
                        onChange={(e) =>
                          updateFormField("phone_number", e.target.value)
                        }
                        placeholder="Your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      {/* Only render Select when initialized */}
                      {isInitialized ? (
                        <Select
                          value={formData.timezone}
                          onValueChange={(value) => {
                            console.log(
                              "Select onValueChange called with:",
                              value
                            );
                            if (value && value !== formData.timezone) {
                              updateFormField("timezone", value);
                            }
                          }}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select your timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            {timezoneOptions.map((timezone) => (
                              <SelectItem
                                key={timezone.value}
                                value={timezone.value}
                              >
                                {timezone.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm text-muted-foreground flex items-center">
                          Loading timezone...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Account Name</Label>
                      <Input
                        id="businessName"
                        type="text"
                        className="rounded-xl"
                        value={formData.businessName}
                        onChange={(e) =>
                          updateFormField("businessName", e.target.value)
                        }
                        placeholder="Your account name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessSlug">Business Slug</Label>
                      <Input
                        id="businessSlug"
                        type="text"
                        className="rounded-xl"
                        value={formData.businessSlug}
                        onChange={(e) =>
                          updateFormField("businessSlug", e.target.value)
                        }
                        placeholder="Your business slug"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Role
                    </Label>
                    <p className="text-sm capitalize bg-muted px-3 py-2 rounded-xl">
                      {user.role}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-xl w-full md:w-auto"
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MessageAlert message={messages.password} />

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <PasswordInput
                    id="currentPassword"
                    label="Current Password"
                    value={formData.currentPassword}
                    onChange={(value) =>
                      updateFormField("currentPassword", value)
                    }
                    show={passwordVisibility.current}
                    onToggle={() => togglePasswordVisibility("current")}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PasswordInput
                      id="newPassword"
                      label="New Password"
                      value={formData.newPassword}
                      onChange={(value) =>
                        updateFormField("newPassword", value)
                      }
                      show={passwordVisibility.new}
                      onToggle={() => togglePasswordVisibility("new")}
                    />

                    <PasswordInput
                      id="confirmPassword"
                      label="Confirm New Password"
                      value={formData.confirmPassword}
                      onChange={(value) =>
                        updateFormField("confirmPassword", value)
                      }
                      show={passwordVisibility.confirm}
                      onToggle={() => togglePasswordVisibility("confirm")}
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-xl">
                    <h4 className="text-sm font-medium mb-2">
                      Password Requirements:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {passwordRequirements.map((req, idx) => (
                        <li
                          key={idx}
                          className={req.met ? "text-green-500" : ""}
                        >
                          • {req.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-xl w-full md:w-auto"
                  >
                    {isLoading ? "Updating..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
