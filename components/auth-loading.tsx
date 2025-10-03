"use client";

import { Loader2 } from "lucide-react";

export function AuthLoading() {
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4 bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  );
}
