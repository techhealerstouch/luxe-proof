// components/forms/Step4Form.tsx
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
import { Camera, X } from "lucide-react";
import { FileInput } from "@/components/ui/file-input";

type Step4FormProps = {
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
export function Step4Form({ form, onSubmit, onBack, step }: Step4FormProps) {
  const { control, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Image Dial, Hands, and Date Scrutiny
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Upload clear, high-quality images of the watch from different angles
            (PNG or JPG only, max 2MB each).
          </p>

          {/* Front View */}
          <FormField
            name="watch_product_dial_analysis_image"
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
        {/* Dial Text Quality */}
        <FormField
          name="dial_text_quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dial Text Quality</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crisp">Crisp</SelectItem>
                    <SelectItem value="blurry">Blurry</SelectItem>
                    <SelectItem value="misaligned">Misaligned</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Lume Application */}
        <FormField
          name="lume_application"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lume Application</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select application" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="even">Even</SelectItem>
                    <SelectItem value="uneven">Uneven</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cyclops Magnification */}
        <FormField
          name="cyclops_magnification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cyclops Magnification</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select magnification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true_2.5x">True 2.5x</SelectItem>
                    <SelectItem value="weak">Weak</SelectItem>
                    <SelectItem value="off_center">Off-center</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Alignment */}
        <FormField
          name="date_alignment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Alignment</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4"
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

        {/* Notes */}
        <FormField
          name="dial_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter any additional notes..."
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
