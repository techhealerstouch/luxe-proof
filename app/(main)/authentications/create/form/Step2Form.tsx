// components/forms/Step2Form.tsx
"use client";
import { useState, useEffect, useRef } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { Camera, Upload, X } from "lucide-react";
import { FileInput } from "@/components/ui/file-input";

type Step2FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

// Image Preview Component
const ImagePreview = ({
  file,
  onRemove,
}: {
  file: File | null;
  onRemove: () => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Cleanup
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!file || !preview) return null;

  return (
    <div className="relative mt-3">
      <img
        src={preview}
        alt="Preview"
        className="h-32 w-full rounded-md object-cover"
      />
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="mt-1 text-xs text-gray-500">
        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
      </div>
    </div>
  );
};

export function Step2Form({ form, onSubmit, onBack, step }: Step2FormProps) {
  const { handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Watch Serial Number
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Upload clear, high-quality images of the watch from different angles
            (PNG or JPG only, max 2MB each).
          </p>

          {/* Front View */}
          <FormField
            name="watch_serial_info_image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileInput
                    value={field.value ? [field.value] : []}
                    onChange={(newFiles: File[]) =>
                      field.onChange(newFiles[0] || null)
                    }
                    accept="image/png,image/jpeg,image/jpg"
                    maxSize={2}
                    maxFiles={1}
                    className="border-dashed border-2 border-orange-200 hover:border-orange-300"
                  />
                </FormControl>
                <ImagePreview
                  file={field.value}
                  onRemove={() => field.onChange(null)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="serial_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number *</FormLabel>
              <FormControl>
                <Input
                  readOnly
                  className="bg-gray-100 text-gray-600 cursor-not-allowed"
                  {...field}
                  value={field.value ?? ""}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="model_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Number *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="serial_found_location"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2 rounded-md">
              <FormLabel>Where was the serial found?</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Between lugs">Between lugs</SelectItem>
                    <SelectItem value="Rehaut">Rehaut</SelectItem>
                    <SelectItem value="Caseback">Caseback</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="matches_documents"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2 rounded-md border p-4">
              <FormLabel>Match with documents? *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="engraving_quality"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel>Engraving Quality</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sharp">Sharp</SelectItem>
                    <SelectItem value="Shallow">Shallow</SelectItem>
                    <SelectItem value="Acid-etched">Acid-etched</SelectItem>
                    <SelectItem value="Dotty">Dotty</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="serial_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={5}
                  className="resize-none"
                  placeholder="Please provide notes about the serial number..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
