"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Camera, X } from "lucide-react";
import { FileInput } from "@/components/ui/file-input";
import { useState, useEffect, useRef } from "react";
import { Button } from "react-day-picker";

type Step7FormProps = {
  form: UseFormReturn;
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

      <div className="mt-1 text-xs text-gray-500">
        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
      </div>
    </div>
  );
};
export function Step7Form({ form, onSubmit }: Step7FormProps) {
  const { handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rate */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Image Performance & Function Test
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Upload clear, high-quality images of the watch from different angles
            (PNG or JPG only, max 2MB each).
          </p>

          {/* Front View */}
          <FormField
            name="watch_performance_tests_image"
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
          name="rate_seconds_per_day"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate (seconds/day)</FormLabel>
              <FormControl>
                <Input type="text" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amplitude */}
        <FormField
          name="amplitude_degrees"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amplitude (degrees)</FormLabel>
              <FormControl>
                <Input type="text" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Beat Error */}
        <FormField
          name="beat_error_ms"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beat Error (ms)</FormLabel>
              <FormControl>
                <Input type="text" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Power Reserve */}
        <FormField
          name="power_reserve_test_result"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Power Reserve Test Result</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter hours or result"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Setting Works */}
        <FormField
          name="time_setting_works"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Setting Works?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel>Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="0" />
                    </FormControl>
                    <FormLabel>No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Change Works */}
        <FormField
          name="date_change_works"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Change Works?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel>Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="0" />
                    </FormControl>
                    <FormLabel>No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Chronograph Works */}
        <FormField
          name="chronograph_works"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chronograph Works?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel>Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel>No</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="n/a" />
                    </FormControl>
                    <FormLabel>N/A</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          name="performance_notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter additional notes..."
                  {...field}
                  value={field.value || ""}
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
