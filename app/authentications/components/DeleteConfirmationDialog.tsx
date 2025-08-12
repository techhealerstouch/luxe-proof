"use client";

import { useState, ReactNode } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type DeleteProductButtonProps = {
  id: string;
  fetchData: () => void;
  label?: ReactNode;
  confirmTitle?: string;
  confirmDescription?: string;
  disabled?: boolean;
};

export default function DeleteConfirmationDialog({
  id,
  fetchData,
  label = "Delete",
  confirmTitle = "Are you absolutely sure?",
  confirmDescription = "This action cannot be undone. This will permanently delete the item.",
  disabled = false,
}: DeleteProductButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("auth_token");

    try {
      await axios.delete(`http://localhost:8000/api/auth-products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchData();
      setOpen(false); // close dialog only on success
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={disabled}>
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              onClick={handleDelete}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, delete"}
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
