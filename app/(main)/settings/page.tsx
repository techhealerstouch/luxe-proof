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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Palette, CheckCircle, XCircle } from "lucide-react";

// ============================================================================
// Constants & Configuration
// ============================================================================

const LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    locale: "en-US",
    dateFormat: {
      hour12: true,
    },
  },
  es: {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
    locale: "es-ES",
    dateFormat: {
      hour12: false,
    },
  },
} as const;

const TIMEZONES = {
  philippines: [
    { value: "Asia/Manila", label: "Philippines (PHT)", flag: "🇵🇭" },
  ],
  usa: [
    { value: "America/New_York", label: "Eastern Time (ET)", flag: "🇺🇸" },
    { value: "America/Chicago", label: "Central Time (CT)", flag: "🇺🇸" },
    { value: "America/Denver", label: "Mountain Time (MT)", flag: "🇺🇸" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)", flag: "🇺🇸" },
    { value: "America/Anchorage", label: "Alaska Time (AKT)", flag: "🇺🇸" },
    { value: "Pacific/Honolulu", label: "Hawaii Time (HST)", flag: "🇺🇸" },
  ],
  australia: [
    {
      value: "Australia/Sydney",
      label: "Sydney/Melbourne (AEST/AEDT)",
      flag: "🇦🇺",
    },
    { value: "Australia/Brisbane", label: "Brisbane (AEST)", flag: "🇦🇺" },
    { value: "Australia/Adelaide", label: "Adelaide (ACST/ACDT)", flag: "🇦🇺" },
    { value: "Australia/Perth", label: "Perth (AWST)", flag: "🇦🇺" },
    { value: "Australia/Darwin", label: "Darwin (ACST)", flag: "🇦🇺" },
  ],
} as const;

const THEMES = [
  { value: "light", label: "Light", icon: "☀️", color: "bg-yellow-400" },
  { value: "dark", label: "Dark", icon: "🌙", color: "bg-slate-800" },
  {
    value: "system",
    label: "System",
    icon: "💻",
    color: "bg-gradient-to-r from-yellow-400 to-slate-800",
  },
] as const;

// ============================================================================
// Types
// ============================================================================

type MessageType = {
  type: "success" | "error";
  text: string;
} | null;

// ============================================================================
// Helper Functions
// ============================================================================

const formatDateTime = (
  date: Date,
  timezone: string,
  languageCode: string
): string => {
  const lang = LANGUAGES[languageCode as keyof typeof LANGUAGES];
  return date.toLocaleString(lang.locale, {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: lang.dateFormat.hour12,
  });
};

const applyTheme = (theme: string): void => {
  const root = document.documentElement;

  switch (theme) {
    case "dark":
      root.classList.add("dark");
      break;
    case "light":
      root.classList.remove("dark");
      break;
    case "system":
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      systemPrefersDark
        ? root.classList.add("dark")
        : root.classList.remove("dark");
      break;
  }
};

// ============================================================================
// Custom Hooks
// ============================================================================

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return currentTime;
};

const useAppearanceSettings = () => {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Manila");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedLanguage = localStorage.getItem("language") || "en";
    const savedTimezone = localStorage.getItem("timezone") || "Asia/Manila";

    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setTimezone(savedTimezone);

    applyTheme(savedTheme);
    document.documentElement.lang = savedLanguage;
  }, []);

  const updateTheme = useCallback((newTheme: string) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, []);

  const updateLanguage = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    document.documentElement.lang = newLanguage;
  }, []);

  const updateTimezone = useCallback((newTimezone: string) => {
    setTimezone(newTimezone);
    localStorage.setItem("timezone", newTimezone);
  }, []);

  return {
    theme,
    language,
    timezone,
    updateTheme,
    updateLanguage,
    updateTimezone,
  };
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

// ============================================================================
// Main Component
// ============================================================================

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const currentTime = useCurrentTime();
  const {
    theme,
    language,
    timezone,
    updateTheme,
    updateLanguage,
    updateTimezone,
  } = useAppearanceSettings();

  // UI state
  const [message, setMessage] = useState<MessageType>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize user check
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
  }, [user, router]);

  // Memoized values
  const currentTimezone = useMemo(() => {
    const allTimezones = [
      ...TIMEZONES.philippines,
      ...TIMEZONES.usa,
      ...TIMEZONES.australia,
    ];
    return allTimezones.find((tz) => tz.value === timezone);
  }, [timezone]);

  // Form handlers
  const handleAppearanceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      // In a real app, you might save to backend here
      setMessage({
        type: "success",
        text: "Appearance settings updated successfully!",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: "Failed to update appearance settings",
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
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Customize how the application looks and feels
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance Settings
            </CardTitle>
            <CardDescription>
              Customize your theme, language, and timezone preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MessageAlert message={message} />

            <form onSubmit={handleAppearanceUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme Select */}
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme} onValueChange={updateTheme}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${t.color}`}
                            ></div>
                            {t.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>

                {/* Language Select */}
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={updateLanguage}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(LANGUAGES).map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            {lang.flag} {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose your preferred language
                  </p>
                </div>
              </div>

              {/* Timezone Select */}
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={updateTimezone}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {/* Philippines */}
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      Philippines
                    </div>
                    {TIMEZONES.philippines.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.flag} {tz.label}
                      </SelectItem>
                    ))}

                    <SelectSeparator />

                    {/* United States */}
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      United States
                    </div>
                    {TIMEZONES.usa.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.flag} {tz.label}
                      </SelectItem>
                    ))}

                    <SelectSeparator />

                    {/* Australia */}
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      Australia
                    </div>
                    {TIMEZONES.australia.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.flag} {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Your timezone affects date and time display
                </p>
              </div>

              {/* Current Settings Display */}
              <div className="bg-muted/50 p-4 rounded-xl space-y-3">
                <h4 className="text-sm font-medium mb-2">Current Settings:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Theme:</span>
                    <span className="capitalize bg-background px-2 py-1 rounded text-foreground font-medium">
                      {theme}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Language:</span>
                    <span className="bg-background px-2 py-1 rounded text-foreground font-medium">
                      {LANGUAGES[language as keyof typeof LANGUAGES]?.name ||
                        language}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Timezone:</span>
                    <span className="bg-background px-2 py-1 rounded text-foreground font-medium text-xs">
                      {currentTimezone
                        ? `${currentTimezone.flag} ${currentTimezone.label}`
                        : timezone}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">
                      Current time in your timezone:
                    </span>
                    <span className="bg-background px-3 py-2 rounded text-foreground font-mono">
                      {formatDateTime(currentTime, timezone, language)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl w-full md:w-auto"
              >
                {isLoading ? "Saving..." : "Save Appearance Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
