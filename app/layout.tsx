import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";
import { AuthGuard } from "@/components/auth-guard";
import IconCompany from "@/components/icon";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luxe Proof",
  description: "Professional watch authentication and verification platform",
  icons: {
    icon: "./icon.svg", // or .png / .svg (place in /public folder)
    shortcut: "./icon.svg",
    apple: "./icon.svg", // optional (for iOS home screen)
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" richColors closeButton />
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
